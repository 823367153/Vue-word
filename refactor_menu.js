const fs = require('fs');
const path = require('path');

const vuePath = path.join(__dirname, 'src', 'views', 'word', 'index.vue');
let content = fs.readFileSync(vuePath, 'utf8');

// The original template structure has <div class="word-container-pro">... <div class="custom-action-bar">...</div> <div class="menu">...</div> <div class="catalog">...</div>
// We need to extract the exact menu items and custom actions.

// 1. We will replace the whole area from <div class="custom-action-bar"> up to the end of <div class="menu" editor-component="menu"> ... </div> (just before <div class="catalog")
// It's easier to rip out the template part entirely and re-assemble.

let templateContentMatch = content.match(/<template>([\s\S]*?)<\/template>/);
if (!templateContentMatch) throw new Error("Could not find template tag");
let templateContent = templateContentMatch[1];

// New Tabbed Menu Structure Layout
const newMenuStructure = `
  <div class="word-container-pro">
    <a-tabs type="line" :lazy-load="false" destroy-on-hide="false" class="word-ribbon-tabs">
      <a-tab-pane key="1" title="开始">
        <div class="menu" editor-component="menu">
          <div class="menu-item">
            <div class="menu-item__undo"><i></i></div>
            <div class="menu-item__redo"><i></i></div>
            <div class="menu-item__painter" title="格式刷(双击可连续使用)"><i></i></div>
            <div class="menu-item__format" title="清除格式"><i></i></div>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item">
            <div class="menu-item__font">
              <span class="select" title="字体">微软雅黑</span>
              <div class="options">
                <ul>
                  <li data-family="Microsoft YaHei" style="font-family:'Microsoft YaHei';">微软雅黑</li>
                  <li data-family="华文宋体" style="font-family:'华文宋体';">华文宋体</li>
                  <li data-family="华文黑体" style="font-family:'华文黑体';">华文黑体</li>
                  <li data-family="华文仿宋" style="font-family:'华文仿宋';">华文仿宋</li>
                  <li data-family="华文楷体" style="font-family:'华文楷体';">华文楷体</li>
                  <li data-family="华文琥珀" style="font-family:'华文琥珀';">华文琥珀</li>
                  <li data-family="华文楷体" style="font-family:'华文楷体';">华文楷体</li>
                  <li data-family="华文隶书" style="font-family:'华文隶书';">华文隶书</li>
                  <li data-family="华文新魏" style="font-family:'华文新魏';">华文新魏</li>
                  <li data-family="华文行楷" style="font-family:'华文行楷';">华文行楷</li>
                  <li data-family="华文中宋" style="font-family:'华文中宋';">华文中宋</li>
                  <li data-family="华文彩云" style="font-family:'华文彩云';">华文彩云</li>
                  <li data-family="Arial" style="font-family:'Arial';">Arial</li>
                  <li data-family="Segoe UI" style="font-family:'Segoe UI';">Segoe UI</li>
                  <li data-family="Ink Free" style="font-family:'Ink Free';">Ink Free</li>
                  <li data-family="Fantasy" style="font-family:'Fantasy';">Fantasy</li>
                </ul>
              </div>
            </div>
            <div class="menu-item__size">
              <span class="select" title="字体">小四</span>
              <div class="options">
                <ul>
                  <li data-size="56">初号</li><li data-size="48">小初</li><li data-size="34">一号</li><li data-size="32">小一</li>
                  <li data-size="29">二号</li><li data-size="24">小二</li><li data-size="21">三号</li><li data-size="20">小三</li>
                  <li data-size="18">四号</li><li data-size="16">小四</li><li data-size="14">五号</li><li data-size="12">小五</li>
                  <li data-size="10">六号</li><li data-size="8">小六</li><li data-size="7">七号</li><li data-size="6">八号</li>
                </ul>
              </div>
            </div>
            <div class="menu-item__size-add"><i></i></div>
            <div class="menu-item__size-minus"><i></i></div>
            <div class="menu-item__bold"><i></i></div>
            <div class="menu-item__italic"><i></i></div>
            <div class="menu-item__underline">
              <i></i><span class="select"></span>
              <div class="options">
                <ul><li data-decoration-style='solid'><i></i></li><li data-decoration-style='double'><i></i></li><li data-decoration-style='dashed'><i></i></li><li data-decoration-style='dotted'><i></i></li><li data-decoration-style='wavy'><i></i></li></ul>
              </div>
            </div>
            <div class="menu-item__strikeout" title="删除线(Ctrl+Shift+X)"><i></i></div>
            <div class="menu-item__superscript"><i></i></div>
            <div class="menu-item__subscript"><i></i></div>
            <div class="menu-item__color" title="字体颜色"><i></i><span></span><input type="color" id="color" /></div>
            <div class="menu-item__highlight" title="高亮"><i></i><span></span><input type="color" id="highlight"></div>
          </div>
          <div class="menu-divider"></div>
          <div class="menu-item">
            <div class="menu-item__title">
              <i></i><span class="select" title="切换标题">正文</span>
              <div class="options">
                <ul><li style="font-size:16px;">正文</li><li data-level="first" style="font-size:26px;">标题1</li><li data-level="second" style="font-size:24px;">标题2</li><li data-level="third" style="font-size:22px;">标题3</li><li data-level="fourth" style="font-size:20px;">标题4</li><li data-level="fifth" style="font-size:18px;">标题5</li><li data-level="sixth" style="font-size:16px;">标题6</li></ul>
              </div>
            </div>
            <div class="menu-item__left"><i></i></div>
            <div class="menu-item__center"><i></i></div>
            <div class="menu-item__right"><i></i></div>
            <div class="menu-item__alignment"><i></i></div>
            <div class="menu-item__justify"><i></i></div>
            <div class="menu-item__row-margin">
              <i title="行间距"></i>
              <div class="options">
                <ul><li data-rowmargin='1'>1</li><li data-rowmargin="1.25">1.25</li><li data-rowmargin="1.5">1.5</li><li data-rowmargin="1.75">1.75</li><li data-rowmargin="2">2</li><li data-rowmargin="2.5">2.5</li><li data-rowmargin="3">3</li></ul>
              </div>
            </div>
            <div class="menu-item__list">
              <i></i>
              <div class="options">
                <ul>
                  <li><label>取消列表</label></li>
                  <li data-list-type="ol" data-list-style='decimal'><label>有序列表：</label><ol><li>________</li></ol></li>
                  <li data-list-type="ul" data-list-style='checkbox'><label>复选框列表：</label><ul style="list-style-type: '☑️ ';"><li>________</li></ul></li>
                  <li data-list-type="ul" data-list-style='disc'><label>实心圆点列表：</label><ul style="list-style-type: disc;"><li>________</li></ul></li>
                  <li data-list-type="ul" data-list-style='circle'><label>空心圆点列表：</label><ul style="list-style-type: circle;"><li>________</li></ul></li>
                  <li data-list-type="ul" data-list-style='square'><label>空心方块列表：</label><ul style="list-style-type: '☐ ';"><li>________</li></ul></li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="2" title="插入">
        <div class="menu" editor-component="menu">
          <div class="menu-item">
            <div class="menu-item__table"><i title="表格"></i></div>
            <div class="menu-item__table__collapse">
              <div class="table-close">×</div>
              <div class="table-title"><span class="table-select">插入</span><span>表格</span></div>
              <div class="table-panel"></div>
            </div>
            <div class="menu-item__image">
              <i title="图片"></i><input type="file" id="image" accept=".png, .jpg, .jpeg, .svg, .gif">
            </div>
            <div class="menu-item__hyperlink"><i title="超链接"></i></div>
            <div class="menu-item__separator">
              <i title="分割线"></i>
              <div class="options">
                <ul>
                  <li data-separator='0,0'><i></i></li>
                  <li data-separator="1,1"><i></i></li>
                  <li data-separator="3,1"><i></i></li>
                  <li data-separator="4,4"><i></i></li>
                  <li data-separator="7,3,3,3"><i></i></li>
                  <li data-separator="6,2,2,2,2,2"><i></i></li>
                </ul>
              </div>
            </div>
            <div class="menu-item__codeblock" title="代码块"><i></i></div>
            <div class="menu-item__page-break" title="分页符"><i></i></div>
            <div class="menu-item__control">
              <i title="控件"></i>
              <div class="options">
                <ul><li data-control='text'>文本</li><li data-control="number">数值</li><li data-control="select">列举</li><li data-control="date">日期</li><li data-control="checkbox">复选框</li><li data-control="radio">单选框</li></ul>
              </div>
            </div>
            <div class="menu-item__checkbox" title="复选框"><i></i></div>
            <div class="menu-item__radio" title="单选框"><i></i></div>
            <div class="menu-item__latex" title="LateX"><i></i></div>
            <div class="menu-item__date">
              <i title="日期"></i>
              <div class="options"><ul><li data-format="yyyy-MM-dd"></li><li data-format="yyyy-MM-dd hh:mm:ss"></li></ul></div>
            </div>
            <div class="menu-item__block" title="内容块"><i></i></div>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="3" title="视图">
        <div class="menu" editor-component="menu">
          <!-- 把视图相关的内容从底部提取 -->
          <div class="menu-item">
            <a-button type="outline" size="small" class="catalog-mode action-btn">切换目录大纲</a-button>
            <div class="page-scale-minus action-btn" title="缩小(Ctrl+-)">➖缩小</div>
            <span class="page-scale-percentage action-btn" title="显示比例(点击可复原Ctrl+0)">100%</span>
            <div class="page-scale-add action-btn" title="放大(Ctrl+=)">➕放大</div>
            
            <span class="action-btn fullscreen" title="全屏显示">🖥️全屏显示</span>
            <span class="action-btn editor-option" title="编辑器设置">⚙️编辑器配置</span>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="4" title="审阅">
        <div class="menu" editor-component="menu">
          <div class="menu-item">
            <div class="menu-item__search" data-menu="search">
              <i></i>搜索与替换
            </div>
            <div class="menu-item__search__collapse" data-menu="search">
              <div class="menu-item__search__collapse__search">
                <input type="text" />
                <label class="search-result"></label>
                <div class="arrow-left"><i></i></div>
                <div class="arrow-right"><i></i></div>
                <span>×</span>
              </div>
              <div class="menu-item__search__collapse__replace">
                <input type="text">
                <button>替换</button>
              </div>
              <div class="menu-item__search__collapse__option">
                <div class="search-option-item"><input type="checkbox" id="option-reg" checked /><label for="option-reg">正则</label></div>
                <div class="search-option-item"><input type="checkbox" id="option-case" checked /><label for="option-case">忽略大小写</label></div>
                <div class="search-option-item"><input type="checkbox" id="option-selection" /><label for="option-selection">选定内容查找</label></div>
              </div>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item__watermark">
              <i title="水印(添加、删除)"></i>水印
              <div class="options">
                <ul><li data-menu="add">添加水印</li><li data-menu="delete">删除水印</li></ul>
              </div>
            </div>
            <div class="menu-divider"></div>
            <div class="menu-item__print" data-menu="print">
              <i></i>打印
            </div>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="5" title="公文">
        <div class="menu">
          <div class="menu-item">
            <a-button type="primary" status="danger" @click="insertRedLine" class="action-btn">
              <template #icon><icon-edit /></template>
              一键插入红线
            </a-button>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="6" title="模板">
        <div class="menu">
          <div class="menu-item">
            <a-button type="primary" @click="showTemplateModal" class="action-btn">
              <template #icon><icon-book /></template>
              公文模版画廊
            </a-button>
            <a-button type="outline" status="warning" @click="saveCustomTemplate" class="action-btn" style="margin-left: 10px;">
              <template #icon><icon-save /></template>
              存为自定义模版
            </a-button>
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="7" title="导入">
         <div class="menu">
          <div class="menu-item">
            <a-button type="primary" status="success" @click="triggerImportWord" class="action-btn">导入 Word (.docx)</a-button>
            <input type="file" ref="fileInputRef" accept=".docx" style="display: none" @change="handleImportWord" />
          </div>
        </div>
      </a-tab-pane>

      <a-tab-pane key="8" title="导出">
        <div class="menu">
          <div class="menu-item">
            <a-button type="primary" @click="handleExportWord" class="action-btn">导出为 Word</a-button>
          </div>
        </div>
      </a-tab-pane>
    </a-tabs>

    <div class="catalog" editor-component="catalog">
      <div class="catalog__header">
        <span>目录</span>
        <div class="catalog__header__close"><i></i></div>
      </div>
      <div class="catalog__main"></div>
    </div>
    <div class="editor"></div>
    <div class="comment" editor-component="comment"></div>
    <div class="footer" editor-component="footer">
      <div>
        <div class="page-mode">
          <i title="页面模式(分页、连页)"></i>
          <div class="options">
            <ul><li data-page-mode="paging" class="active">分页</li><li data-page-mode="continuity">连页</li></ul>
          </div>
        </div>
        <span>可见页码：<span class="page-no-list">1</span></span>
        <span>页面：<span class="page-no">1</span>/<span class="page-size">1</span></span>
        <span>字数：<span class="word-count">0</span></span>
        <span>行：<span class="row-no">0</span></span>
        <span>列：<span class="col-no">0</span></span>
      </div>
      <div class="editor-mode" title="编辑模式(编辑、清洁、只读、表单、设计、涂鸦)">编辑模式</div>
      <div>
        <div class="paper-size">
          <i title="纸张类型"></i>
          <div class="options">
            <ul>
              <li data-paper-size="794*1123" class="active">A4</li><li data-paper-size="1593*2251">A2</li>
              <li data-paper-size="1125*1593">A3</li><li data-paper-size="565*796">A5</li>
              <li data-paper-size="412*488">5号信封</li><li data-paper-size="450*866">6号信封</li>
              <li data-paper-size="609*862">7号信封</li><li data-paper-size="862*1221">9号信封</li>
              <li data-paper-size="813*1266">法律用纸</li><li data-paper-size="813*1054">信纸</li>
            </ul>
          </div>
        </div>
        <div class="paper-direction">
          <i title="纸张方向"></i>
          <div class="options">
            <ul><li data-paper-direction="vertical" class="active">纵向</li><li data-paper-direction="horizontal">横向</li></ul>
          </div>
        </div>
        <div class="paper-margin" title="页边距"><i></i></div>
      </div>
    </div>
  
    <!-- 模版大库弹窗 -->
    <a-modal v-model:visible="templateModalVisible" title="公文模版库画廊" hide-cancel @ok="templateModalVisible = false" width="600px">
      <div class="template-gallery">
        <div class="template-card" v-for="(item, index) in templates" :key="index" @click="applyTemplate(item.id)" style="position: relative;">
          <div class="delete-btn" v-if="item.id.startsWith('custom_')" @click.stop="deleteCustomTemplate(item.id)" title="删除模版">×</div>
          <div class="template-cover">
            <div class="mock-doc" :class="item.type">
              <div class="head" v-if="item.type === 'red-head' || item.type === 'report'">{{ item.type === 'red-head' ? '发文' : '报告' }}</div>
              <div class="head" v-if="item.type === 'meeting'">纪要</div>
              <div class="line" v-if="item.type === 'red-head' || item.type === 'report'"></div>
              <div class="mock-text mock-text-1"></div>
              <div class="mock-text mock-text-2"></div>
              <div class="mock-text mock-text-3"></div>
            </div>
          </div>
          <div class="template-title">{{ item.name }}</div>
        </div>
      </div>
    </a-modal>
  </div>
`;

// Extract <script setup lang="ts"> content and append handleExportWord
let newContent = content.replace(/<template>[\s\S]*?<\/template>/, `<template>\n${newMenuStructure}\n</template>`);

if (!newContent.includes('handleExportWord')) {
  newContent = newContent.replace('const handleImportWord', `const handleExportWord = () => {
  if (!instance) return;
  instance.command.executeExportDocx({ fileName: '导出文档.docx' });
};\n\nconst handleImportWord`);
}

// Write the modified content back
fs.writeFileSync(vuePath, newContent, 'utf8');

console.log('Successfully refactored template!');
