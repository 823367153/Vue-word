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
1. **自动制表识别**：前端已集成智能解析器，支持对标准 Markdown 表格 (Pipe Table) 和 **纯制表符分隔表格 (TSV)** 的流式识别。
2. **多模态渲染支持**：如果希望文字在显示时突出重点或插入复杂元素，可以通过【带样式的文本块】或【结构化 JSON 块】实现。
3. **样式控制权**：建议采用【后端主导内容语义，前端兼容兜底】的模式。

### 2.3 数据 Chunk 格式方案 (支持样式、表格与复杂元素)

为了让后端能够精细化控制流出来的每一个字的长相（字号、颜色、粗体等），或直接插入复杂对象，前端支持以下多模态识别：

**场景 A：推送带样式的文字流**
后端可复用编辑器原生的 `IElementStyle` 属性。在每一块 `data:` 返回时，带上对应的属性即可。
```text
HTTP/1.1 200 OK
Content-Type: text/event-stream;charset=UTF-8

// 常规文字，走前端默认样式
data: {"value": "在"}
data: {"value": "接"}
data: {"value": "下"}
data: {"value": "来", "done": false}

// 后端判定此处为重点！要求加大加粗发红
data: {"value": "严重警告", "color": "#FF0000", "bold": true, "size": 18}
```

**场景 B：推送 Markdown 表格文本 (自动识别)**
如果模型输出的是 Markdown 表格，前端解析器会自动“蓄力”缓存，并在识别到闭合边界后转为原生表格。
```text
data: {"value": "| 指标 | 数值 |\n"}
data: {"value": "|---|---|\n"}
data: {"value": "| AI 识别率 | 100% |\n"}
```

**场景 C：推送制表符 (TSV) 列表 (自动识别)**
支持标准的制表符分隔列表（完美兼容从 Excel/Word 复制出的格式），AI 常用于快速列举数据：
```text
data: {"value": "产品名称\t产品数量\n"}
data: {"value": "笔记本电脑\t35\n"}
data: {"value": "无线鼠标\t120\n"}
```

**场景 D：直接推送结构化元素 (推荐用于精准控制表格、图片、公式)**
后端可以直接推送符合 IElement 规范的完整 JSON，前端会自动将其作为原子块插入。
```text
data: {"type": "table", "trList": [...], "colgroup": [...]}
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

### 3.3 核心解析引擎：支持混合模态识别

前端渲染器不再是简单的字符追加，而是一个带有“语法与结构感知”的混合引擎。

/**
 * 辅助函数：将 Markdown 表格转为编辑器原生 Table 元素
 */
function convertMarkdownTableToElement(mdTable) {
  const lines = mdTable.trim().split(/\r?\n/);
  // 过滤掉分隔行 |---| 
  const dataLines = lines.filter(line => !line.match(/^\|?\s*[:\-|\s]+\s*\|?$/));
  if (dataLines.length === 0) return null;

  return {
    type: 'table',
    trList: dataLines.map(line => ({
      tdList: line.trim().replace(/^\||\|$/g, '').split('|').map(cell => ({
        value: [{ value: cell.trim() }], // 单元格内容同构
        rowspan: 1,
        colspan: 1,
        height: 0
      }))
    })),
    colgroup: Array(dataLines[0].split('|').length).fill({ width: 150 }),
    extension: { isAI: true }
  };
}

/**
 * 辅助函数：将 制表符 (TSV) 表格转为编辑器原生 Table 元素
 */
function convertTsvTableToElement(tsvTable) {
  const lines = tsvTable.trim().split(/\r?\n/);
  if (lines.length === 0) return null;

  const trList = lines.map(line => ({
    tdList: line.split('\t').map(cell => ({
      value: [{ value: cell.trim() }],
      rowspan: 1,
      colspan: 1,
      height: 0
    }))
  }));

  return {
    type: 'table',
    trList: trList,
    colgroup: Array(trList[0].tdList.length).fill({ width: 150 }),
    extension: { isAI: true }
  };
}

/**
 * 节流渲染引擎逻辑 (flushAiBufferToCanvas)
 * 核心逻辑：带有“语法感知”的缓冲区管理
 */
const flushAiBufferToCanvas = () => {
  while (aiCharBuffer.length > 0) {
    const text = aiCharBuffer;
    
    // 1. 正则尝试匹配表格起始 (mdStartRegex / tsvStartRegex)
    // 2. 寻找表格边界循环
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      const isLastLine = i === lines.length - 1;

      if (tableType === 'tsv') {
        if (i > 1 && (line === '' || !line.includes('\t'))) {
          // 关键：在生成过程中，忽略最后一行（即便是空行）的终结判定
          if (isLastLine && isGeneratingState) {
            // 继续等待下一波数据补全
          } else {
            tableEndLineIndex = i; // 确定表格在此结束
            hasSeenNonTableLine = true;
            break;
          }
        }
      }
    }

    // 3. 情况 B: 潜力特征锁定 (防止表格行被误刷为文本)
    if (isGeneratingState) {
      splitLineIndex = linesArray.length - 1; // 默认保留最后一行
      for (let i = 0; i < linesArray.length; i++) {
        // 核心修复：只要发现任何一行有表格特征，锁定该行及其后续所有内容
        if (linesArray[i].includes('\t') || linesArray[i].trimStart().startsWith('|')) {
          splitLineIndex = i;
          break;
        }
      }
    }
  }
}
```

### 3.4 撤销栈安全锁
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
