# Wordsbeat 编辑器 AI 流式接入开发说明

本文档专为在 Wordsbeat (Canvas-Editor 架构) 编辑器中接入大语言模型 (LLM) 进行流式写作（内联接续打字）而准备，规范了前后端数据对接协议及核心的流式渲染逻辑。

---

## 一、 背景说明与难点分析

在 Canvas 渲染机制中，如果跟随大模型的输出流（每生成一个字符就立刻渲染更新画布），会导致以下**严重问题**：
1. **性能瓶颈**：极高频的回流运算导致编辑器整体卡顿。
2. **光标与撤销栈破坏**：引发历史栈 (Undo/Redo) 异常爆发，比如点击撤销一次只能退回一个字。

因此，我们的统一接入架构为：**后端提供极其轻量的 SSE 标准分块流 -> 前端采用定频节流缓冲流 (Buffer Queue) 接管渲染**。

---

## 二、 后端配合规范 (Backend Spec)

### 2.1 协议规定
后端接口强制要求使用 `text/event-stream` (Server-Sent Events) 的形式推送单项碎片。不能等待所有信息请求完再一次性返回 JSON。

### 2.2 核心要求：纯文本与动态样式透传 (重要)
**对于样式的控制权归属，我们建议采用【后端主导内容语义，前端兼容兜底】的模式。** 

普通的 AI 模型由于习惯输出 Markdown（如 `**加粗**`, `### 标题`），但在流式的内联渲染过程中实时闭合 Markdown 是异常艰难且容易出错的。因此：
1. **取消 Markdown 渲染**：要求 AI 仅生成纯文本。
2. **动态渲染指令转移**：如果希望文字在显示时突出重点，**必须由后端或者中间映射服务在推送 SSE 包时，携带样式修饰参数下发给前端。**

### 2.3 数据 Chunk 格式进阶方案 (附带样式控制)
为了让后端能够精细化控制流出来的每一个字的长相（字号、颜色、粗体等），可以复用编辑器原生的 `IElementStyle` 属性。在每一块 `data:` 返回时，带上对应的属性即可。

**后端推送流进阶示例：**
```text
HTTP/1.1 200 OK
Content-Type: text/event-stream;charset=UTF-8

// 常规文字，走前端默认光标样式兜底
data: {"value": "在"}
data: {"value": "接"}
data: {"value": "下"}
data: {"value": "来", "done": false}

// 后端判定此处为重要重点！要求加大加粗发红
data: {"value": "严重警告", "color": "#FF0000", "bold": true, "size": 18}

// 段落需要拆分换行
data: {"value": "\n"}

// 后端指示结束
data: {"value": "。", "done": true}
```

*   `value`: 代表当前内容切片字符串。（极其重要：这里使用 `value` 是为了与我们在《后端格式对应文档.md》中定义的 `IElement.value` 保持 100% 同构一致！）
*   `color`, `size`, `bold`, `italic`, `rowFlex` 等：只要存在于 JSON 体中，前端在渲染时就会**完整透传**给编辑器节点起效。
*   `done`: 标识该流是否彻底结束。

---

## 三、 前端渲染接收指南 (Frontend Spec)

前端必须维护至少三个核心实体去保障平滑落地：网络拦截器 (Stream Reader)、文字池 (Buffer)、调度引擎 (Interval Renderer)。

### 3.1 Fetch 解析与捕获流
前端通过原生的 Fetch 请求接管数据块解码。
```javascript
const response = await fetch('/api/your-ai-streaming-endpoint', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ prompt: "帮我写一篇总结..." })
});

const reader = response.body.getReader();
const decoder = new TextDecoder('utf-8');

while (true) {
  const { done, value } = await reader.read();
  if (done) break;

  // 切割并获取单帧传递的数据
  const chunkStr = decoder.decode(value, { stream: true });
  // 注意，网络积压时一个包可能包含多行 data: xxx，请务必以 \n 进行 split 遍历
}
```

### 3.2 建立节流文字池 (Buffer Queue) - 「最核心改造点」
**严禁每解析出一个字就调用写入方法！**
建立一个全局时间环（一般设定为 100 毫秒 - 150 毫秒之间），周期性地将这 100ms 内收到的攒好的字符串塞入画布。

```javascript
let aiCharBuffer = ''; // 前端的全局字符缓存池
let aiRenderInterval = null; // 调度引擎

// 启动大模型生成前：建立监听
aiRenderInterval = window.setInterval(() => {
  if (aiCharBuffer.length > 0) {
    // 【修改点】由于现在要求支持后端携带的多样化动态样式，这里应当由一个更智能的对象池接管，
    // 但为保证节流性能，一种主流做法是只合并「样式相同的文本段」。
    // 假设您采用简单的全量对象提取法：
    const elementsToInsert = parseBufferToElementArray(aiCharBuffer);
    
    // 如果是简单的单一文本追加方式，可以直接向编辑器画布中批量灌入
    instance.command.executeInsertElementList(elementsToInsert);

    aiCharBuffer = ''; // 清空池子
  }
}, 100); 

/* *
 * 解析工具集：您可以在解析 SSE Stream 时把带有 size/color 的 JSON 都挂在原始队列里。
 * 当需要插入时，透传这些被后端定好的样式。如果没有，就走默认 AI 幽灵蓝。
 */
function createAiElement(chunkObj) {
  return {
    value: chunkObj.value,               // 直接取后端的 value
    color: chunkObj.color || '#409EFF',  // 如果后端发了颜色用后端的，没发用默认
    size: chunkObj.size || 16,
    bold: chunkObj.bold || false,
    extension: { isAI: true }
  }
}
```

### 3.3 撤销栈安全锁
流式输出如果未加处理会产生多条连续的历史，污染用户的 `Ctrl+Z` 行为。
在编辑器启动流之前和结束流之后，务必进行干预：
```javascript
// 开始渲染流前，阻断记录！
if (instance.history && instance.history.pause) {
  instance.history.pause(); 
}

// ... 进行网络读取和文字渲染 ...

// 全部流结束（done: true）后，执行收尾：将前面挂起的长串历史存为一个“原子操作”：
if (instance.history && instance.history.resume) {
  instance.history.resume(); 
}
```

---

## 四、 后续与总结

1. 想要让 AI 文本更有识别度，请利用 `color` (如 `#409EFF`) 与 `highlight` 背景色在 `executeInsertElementList` 时进行控制。
2. 遇到“打字时光标抖动或者页面不滚动”的问题时，前端应在 `setInterval` 的刷入方法末尾强制要求焦点滚动到底部。
3. 如果是在纯正式公文的流转中，前端甚至可以在输入途中放置一个透明拦截遮罩或者屏蔽用户的按键 `keydown`，防止 AI 字符插队或者串改光标。
