<template>

  <div class="word-container-pro">

    <div class="custom-ribbon-tabs">
      <div class="tabs-nav">
        <div class="tab-btn" :class="{ active: activeTab === '1' }" @click="activeTab = '1'">开始</div>
        <div class="tab-btn" :class="{ active: activeTab === '2' }" @click="activeTab = '2'">插入</div>
        <div class="tab-btn" :class="{ active: activeTab === '3' }" @click="activeTab = '3'">视图</div>
        <div class="tab-btn" :class="{ active: activeTab === '4' }" @click="activeTab = '4'">审阅</div>
        <div class="tab-btn" :class="{ active: activeTab === '5' }" @click="activeTab = '5'">公文模式</div>
        <div class="tab-btn" :class="{ active: activeTab === '7' }" @click="activeTab = '7'">导入/导出</div>

      </div>
      <div class="tabs-content">

        <div class="tab-pane" v-show="activeTab === '1'">
          <div class="menu" editor-component="menu">
            <div class="menu-item">
              <div class="menu-item__save" @click="saveToLocal(true)" title="保存到本地 (Ctrl+S)"><i></i></div>

              <div class="menu-item__undo"><i></i></div>
              <div class="menu-item__redo"><i></i></div>
              <div class="menu-item__painter" title="格式刷(双击可连续使用)"><i></i></div>
              <div class="menu-item__format" title="清除格式"><i></i></div>
            </div>

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
                    <li data-size="56">初号</li>
                    <li data-size="48">小初</li>
                    <li data-size="34">一号</li>
                    <li data-size="32">小一</li>
                    <li data-size="29">二号</li>
                    <li data-size="24">小二</li>
                    <li data-size="21">三号</li>
                    <li data-size="20">小三</li>
                    <li data-size="18">四号</li>
                    <li data-size="16">小四</li>
                    <li data-size="14">五号</li>
                    <li data-size="12">小五</li>
                    <li data-size="10">六号</li>
                    <li data-size="8">小六</li>
                    <li data-size="7">七号</li>
                    <li data-size="6">八号</li>
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
                  <ul>
                    <li data-decoration-style='solid'><i></i></li>
                    <li data-decoration-style='double'><i></i></li>
                    <li data-decoration-style='dashed'><i></i></li>
                    <li data-decoration-style='dotted'><i></i></li>
                    <li data-decoration-style='wavy'><i></i></li>
                  </ul>
                </div>
              </div>
              <div class="menu-item__strikeout" title="删除线(Ctrl+Shift+X)"><i></i></div>
              <div class="menu-item__superscript"><i></i></div>
              <div class="menu-item__subscript"><i></i></div>
              <div class="menu-item__color" title="字体颜色"><i></i><span></span><input type="color" id="color" /></div>
              <div class="menu-item__highlight" title="高亮"><i></i><span></span><input type="color" id="highlight"></div>
            </div>

            <div class="menu-item">
              <div class="menu-item__title">
                <i></i><span class="select" title="切换标题">正文</span>
                <div class="options">
                  <ul>
                    <li style="font-size:14px;">正文</li>
                    <li data-level="first" style="font-size:18px; font-weight: bold;">标题1</li>
                    <li data-level="second" style="font-size:17px; font-weight: bold;">标题2</li>
                    <li data-level="third" style="font-size:16px; font-weight: bold;">标题3</li>
                    <li data-level="fourth" style="font-size:15px; font-weight: bold;">标题4</li>
                    <li data-level="fifth" style="font-size:14px; font-weight: bold;">标题5</li>
                    <li data-level="sixth" style="font-size:14px; font-weight: bold;">标题6</li>
                  </ul>
                </div>
              </div>
              <div class="menu-item__left"><i></i></div>
              <div class="menu-item__center"><i></i></div>
              <div class="menu-item__right"><i></i></div>
              <div class="menu-item__alignment"><i></i></div>
              <div class="menu-item__justify"><i></i></div>
              <div class="menu-item__first-line-indent">
                <i title="首行缩进"></i>
                <div class="options">
                  <ul>
                    <li data-firstlineindent="0">无</li>
                    <li data-firstlineindent="1">1 字符</li>
                    <li data-firstlineindent="2">2 字符</li>
                    <li data-firstlineindent="3">3 字符</li>
                    <li data-firstlineindent="4">4 字符</li>
                  </ul>
                </div>
              </div>
              <div class="menu-item__indent-minus" title="减少缩进"><i></i></div>
              <div class="menu-item__indent-add" title="增加缩进"><i></i></div>
              <div class="menu-item__row-margin">
                <i title="行间距"></i>
                <div class="options">
                  <ul>
                    <li data-rowmargin='1'>1</li>
                    <li data-rowmargin="1.25">1.25</li>
                    <li data-rowmargin="1.5">1.5</li>
                    <li data-rowmargin="1.75">1.75</li>
                    <li data-rowmargin="2">2</li>
                    <li data-rowmargin="2.5">2.5</li>
                    <li data-rowmargin="3">3</li>
                  </ul>
                </div>
              </div>
              <div class="menu-item__p-spacing-before">
                <i title="段前间距"></i>
                <div class="options">
                  <ul>
                     <li data-pspacing-before="0">0</li>
                     <li data-pspacing-before="0.5">0.5</li>
                     <li data-pspacing-before="1.0">1.0</li>
                     <li data-pspacing-before="1.2">1.2</li>
                     <li data-pspacing-before="1.5">1.5</li>
                     <li data-pspacing-before="2.0">2.0</li>
                     <li data-pspacing-before="2.5">2.5</li>
                  </ul>
                </div>
              </div>
              <div class="menu-item__p-spacing-after">
                <i title="段后间距"></i>
                <div class="options">
                  <ul>
                     <li data-pspacing-after="0">0</li>
                     <li data-pspacing-after="0.5">0.5</li>
                     <li data-pspacing-after="1.0">1.0</li>
                     <li data-pspacing-after="1.2">1.2</li>
                     <li data-pspacing-after="1.5">1.5</li>
                     <li data-pspacing-after="2.0">2.0</li>
                     <li data-pspacing-after="2.5">2.5</li>
                  </ul>
                </div>
              </div>
              <div class="menu-item__list">
                <i></i>
                <div class="options">
                  <ul>
                    <li><label>取消列表</label></li>
                    <li data-list-type="ol" data-list-style='decimal'><label>有序列表：</label>
                      <ol>
                        <li>________</li>
                      </ol>
                    </li>
                    <li data-list-type="ul" data-list-style='checkbox'><label>复选框列表：</label>
                      <ul style="list-style-type: '☑️ ';">
                        <li>________</li>
                      </ul>
                    </li>
                    <li data-list-type="ul" data-list-style='disc'><label>实心圆点列表：</label>
                      <ul style="list-style-type: disc;">
                        <li>________</li>
                      </ul>
                    </li>
                    <li data-list-type="ul" data-list-style='circle'><label>空心圆点列表：</label>
                      <ul style="list-style-type: circle;">
                        <li>________</li>
                      </ul>
                    </li>
                    <li data-list-type="ul" data-list-style='square'><label>空心方块列表：</label>
                      <ul style="list-style-type: '☐ ';">
                        <li>________</li>
                      </ul>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane" v-show="activeTab === '2'">
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
                  <ul>
                    <li data-control='text'>文本</li>
                    <li data-control="number">数值</li>
                    <li data-control="select">列举</li>
                    <li data-control="date">日期</li>
                    <li data-control="checkbox">复选框</li>
                    <li data-control="radio">单选框</li>
                  </ul>
                </div>
              </div>
              <div class="menu-item__checkbox" title="复选框"><i></i></div>
              <div class="menu-item__radio" title="单选框"><i></i></div>
              <div class="menu-item__latex" title="LateX"><i></i></div>
              <div class="menu-item__date">
                <i title="日期"></i>
                <div class="options">
                  <ul>
                    <li data-format="yyyy-MM-dd"></li>
                    <li data-format="yyyy-MM-dd hh:mm:ss"></li>
                  </ul>
                </div>
              </div>
              <div class="menu-item__block" title="内容块"><i></i></div>
            </div>
          </div>
        </div>

        <div class="tab-pane" v-show="activeTab === '3'">
          <div class="menu" editor-component="menu">
            <div class="menu-item">
              <div class="menu-item__catalog catalog-mode" title="显示/隐藏目录"><i></i></div>

              <div class="menu-item__scale-minus page-scale-minus" title="缩小(Ctrl+-)"><i></i>
              </div>
              <span class="menu-item__scale-percentage page-scale-percentage" title="点击复原(Ctrl+0)">100%</span>
              <div class="menu-item__scale-add page-scale-add" title="放大(Ctrl+=)"><i></i></div>

              <div class="menu-item__fullscreen fullscreen" title="全屏显示(F11)"><i></i></div>
              <div class="menu-item__option editor-option" title="编辑器设置"><i></i></div>
            </div>
          </div>
        </div>

        <div class="tab-pane" v-show="activeTab === '4'">
          <div class="menu" editor-component="menu">
            <div class="menu-item">
              <div class="menu-item__search" data-menu="search">
                <i></i>
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
                  <div class="search-option-item"><input type="checkbox" id="option-reg" checked /><label
                      for="option-reg">正则</label></div>
                  <div class="search-option-item"><input type="checkbox" id="option-case" checked /><label
                      for="option-case">忽略大小写</label></div>
                  <div class="search-option-item"><input type="checkbox" id="option-selection" /><label
                      for="option-selection">选定内容查找</label></div>
                </div>
              </div>

              <div class="menu-item__watermark">
                <i title="水印(添加、删除)"></i>
                <div class="options">
                  <ul>
                    <li data-menu="add">添加水印</li>
                    <li data-menu="delete">删除水印</li>
                  </ul>
                </div>
              </div>

              <div class="menu-item__print" data-menu="print">
                <i></i>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane" v-show="activeTab === '5'">
          <div class="menu">
            <div class="menu-item">
              <div class="menu-item__redline" :class="{ active: redLineMenuVisible }" title="插入分隔红线">
                <i @click.stop="redLineMenuVisible = !redLineMenuVisible"></i>

                <div class="options" :class="{ visible: redLineMenuVisible }">
                  <ul>
                    <li @click="insertRedLine('standard')">
                      <div class="line-preview"></div>标准红线
                    </li>
                    <li @click="insertRedLine('thick')">
                      <div class="line-preview thick"></div>加粗红线
                    </li>
                    <li @click="insertRedLine('double')">
                      <div class="line-preview double"></div>双红线(文头线)
                    </li>
                    <li @click="insertRedLine('dashed')">
                      <div class="line-preview dashed"></div>虚线红线
                    </li>
                    <li @click="insertRedLine('custom')" class="custom-trigger"><i></i>自定义样式...</li>
                  </ul>
                </div>
              </div>

              <div class="menu-item__template" @click="showTemplateModal" title="公文模版画廊">
                <i></i>
              </div>
              <div class="menu-item__save-template" @click="saveCustomTemplate" title="存为自定义模版">
                <i></i>
              </div>
            </div>
          </div>
        </div>

        <div class="tab-pane" v-show="activeTab === '7'">
          <div class="menu">
            <div class="menu-item">
              <div class="menu-item__import" @click="triggerImportWord" title="导入文稿 (.docx)">
                导入
              </div>
              <input type="file" ref="fileInputRef" accept=".docx" style="display: none"
                @change="handleImportWord" />

              <div class="menu-item__export" @click="handleExportWord" title="导出为 Word">
                导出
              </div>
            </div>
          </div>
        </div>



      </div>
    </div>


    <div class="catalog" editor-component="catalog" v-show="isCatalogShow">
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
        <div class="catalog-mode" title="目录">
          <i></i>
        </div>
        <div class="page-mode">
          <i title="页面模式(分页、连页)"></i>
          <div class="options">
            <ul>
              <li data-page-mode="paging" class="active">分页</li>
              <li data-page-mode="continuity">连页</li>
            </ul>
          </div>
        </div>
        <div class="status-group">
          <span>可见页码：<span class="page-no-list">1</span></span>
          <span>页面：<span class="page-no">1</span>/<span class="page-size">1</span></span>
        </div>
        <div class="status-group">
          <span>字数：<span class="word-count">0</span></span>
        </div>
        <div class="status-group">
          <span>行：<span class="row-no">0</span></span>
          <span>列：<span class="col-no">0</span></span>
        </div>
        <div class="status-group save-status">
          <i :class="{ saving: isSaving }"></i>
          <span>{{ isSaving ? '保存中...' : (lastSavedTime ? '已保存 ' + lastSavedTime : '未保存') }}</span>
        </div>
      </div>
      <div class="editor-mode" title="编辑模式(编辑、清洁、只读、表单、设计、涂鸦)">编辑模式</div>
      <div>
        <div class="page-scale-minus" title="缩小(Ctrl+-)">
          <i></i>
        </div>
        <span class="page-scale-percentage" title="显示比例(点击可复原Ctrl+0)">100%</span>
        <div class="page-scale-add" title="放大(Ctrl+=)">
          <i></i>
        </div>
        <div class="paper-size">
          <i title="纸张类型"></i>
          <div class="options">
            <ul>
              <li data-paper-size="794*1123" class="active">A4</li>
              <li data-paper-size="1593*2251">A2</li>
              <li data-paper-size="1125*1593">A3</li>
              <li data-paper-size="565*796">A5</li>
              <li data-paper-size="412*488">5号信封</li>
              <li data-paper-size="450*866">6号信封</li>
              <li data-paper-size="609*862">7号信封</li>
              <li data-paper-size="862*1221">9号信封</li>
              <li data-paper-size="813*1266">法律用纸</li>
              <li data-paper-size="813*1054">信纸</li>
            </ul>
          </div>
        </div>
        <div class="paper-direction">
          <i title="纸张方向"></i>
          <div class="options">
            <ul>
              <li data-paper-direction="vertical" class="active">纵向</li>
              <li data-paper-direction="horizontal">横向</li>
            </ul>
          </div>
        </div>
        <div class="paper-margin" title="页边距"><i></i></div>
      </div>
    </div>

    <!-- 模版大库弹窗 -->
    <a-modal v-model:visible="templateModalVisible" title="公文模版库画廊" hide-cancel @ok="templateModalVisible = false"
      width="600px">
      <div class="template-gallery">
        <div class="template-card" v-for="(item, index) in templates" :key="index" @click="applyTemplate(item.id)"
          style="position: relative;">
          <div class="delete-btn" v-if="item.id.startsWith('custom_')" @click.stop="deleteCustomTemplate(item.id)"
            title="删除模版">×</div>
          <div class="template-cover">
            <div class="mock-doc" :class="item.type">
              <div class="head" v-if="item.type === 'red-head' || item.type === 'report'">{{ item.type === 'red-head' ?
                '发文'
                : '报告' }}</div>
              <div class="head" v-if="item.type === 'meeting'">纪要</div>
              <div class="line"
                v-if="item.id === 'standard' || item.id === 'notice' || item.id === 'decision' || item.id === 'announcement'"
                style="background: #ff0000; height: 2px; margin: 5px 0;"></div>
              <div class="line" v-if="item.id === 'double'"
                style="border-top: 1px solid #ff0000; border-bottom: 2px solid #ff0000; height: 4px; margin: 5px 0;">
              </div>
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

</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue';
import Editor, { ElementType } from './canvas-editor';
import { bindEditorUI } from './official-ui/menu-bindings';
import { parseDocxToElements } from './utils/docxImporter';
import { exportDocxFile } from './utils/docxExporter';
import { Dialog } from './official-ui/components/dialog/Dialog';
import { debounce } from './official-ui/utils';
import { dbService } from './utils/db';
import './official-ui/style.css';

const editorRef = ref<HTMLDivElement | null>(null);
const isCatalogShow = ref(false);
let instance: Editor | null = null;
const templateModalVisible = ref(false);
const redLineMenuVisible = ref(false);
const activeTab = ref('1');
const fileInputRef = ref<HTMLInputElement | null>(null);

const lastSavedTime = ref('');
const isSaving = ref(false);
const DRAFT_KEY = 'wordsbeat_draft_data';

const triggerImportWord = () => {
  fileInputRef.value?.click();
};

const handleExportWord = async () => {
  if (!instance) return;

  try {
    const data = instance.command.getValue();
    console.log('【导出调试】getValue() 返回原始数据:', data);

    // 还原回原来的路径：data.data.main
    const mainElements = data.data?.main || data.main;

    console.log('【导出调试】待转换元素数量:', mainElements?.length);
    if (!mainElements || mainElements.length === 0) {
      console.warn('警告：导出数据为空，请检查编辑器内容');
    }
    await exportDocxFile(mainElements, '导出文档.docx');
  } catch (err) {
    console.error('自定义导出失败，尝试降级:', err);
    // @ts-ignore
    if (instance.command.executeExportDocx) {
      // @ts-ignore
      instance.command.executeExportDocx({ fileName: '导出文档.docx' });
    } else {
      instance.command.executePrint();
    }
  }
};

const handleImportWord = async (e: Event) => {
  const file = (e.target as HTMLInputElement).files?.[0];
  if (!file || !instance) return;


  const reader = new FileReader();
  reader.onload = async (evt) => {
    try {
      // 抛弃 mammoth 和底层插件，使用最高精度的原生自研 DOCX 解析
      console.log('【开始高精度重构 DOCX 获取样式...】');
      const elements = await parseDocxToElements(file);
      console.log('【原生提取 DOCX 完成】', elements);

      // 直接灌入 Canvas-Editor 的神经中枢
      instance!.command.executeSetValue({ main: elements });
    } catch (err) {
      console.error('DOCX 高进度解析发生异常，降级回退:', err);
      const arrayBuffer = evt.target?.result as ArrayBuffer;
      // @ts-ignore
      instance!.command.executeImportDocx({ arrayBuffer });
    }
  };
  reader.readAsArrayBuffer(file);
  (e.target as HTMLInputElement).value = '';
};

// 生成红线 SVG Base64
const createRedLineSVG = (style: string, options: any = {}) => {
  const color = options.color || '#ff0000';
  const width = 800; // 宽画布保证精度
  const strokeRatio = options.strokeWidth ? (Number(options.strokeWidth) / 2) : 1;
  let svg = '';
  let height = 10;

  if (style === 'standard') {
    height = 6 * strokeRatio + 4;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="${color}" stroke-width="${2 * strokeRatio}"/></svg>`;
  } else if (style === 'thick') {
    height = 10 * strokeRatio + 4;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="${color}" stroke-width="${5 * strokeRatio}"/></svg>`;
  } else if (style === 'double') {
    height = 20 * strokeRatio;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}">
      <line x1="0" y1="${6 * strokeRatio}" x2="${width}" y2="${6 * strokeRatio}" stroke="${color}" stroke-width="${1.5 * strokeRatio}"/>
      <line x1="0" y1="${14 * strokeRatio}" x2="${width}" y2="${14 * strokeRatio}" stroke="${color}" stroke-width="${3 * strokeRatio}"/>
    </svg>`;
  } else if (style === 'dashed') {
    height = 6 * strokeRatio + 4;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="${color}" stroke-width="${2 * strokeRatio}" stroke-dasharray="${8 * strokeRatio},${4 * strokeRatio}"/></svg>`;
  } else if (style === 'custom') {
    const strokeWidth = options.strokeWidth || 2;
    height = strokeWidth * 2 + 4;
    svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}"><line x1="0" y1="${height / 2}" x2="${width}" y2="${height / 2}" stroke="${color}" stroke-width="${strokeWidth}"/></svg>`;
  }

  return `data:image/svg+xml;base64,${btoa(unescape(encodeURIComponent(svg)))}`;
};

const insertRedLine = (style: string) => {
  if (!instance) return;

  if (style === 'custom') {
    new Dialog({
      title: '自定义红线',
      data: [
        {
          type: 'select',
          label: '线条样式',
          name: 'style',
          value: 'standard',
          options: [
            { label: '标准单线', value: 'standard' },
            { label: '加粗单线', value: 'thick' },
            { label: '双红线', value: 'double' },
            { label: '虚线', value: 'dashed' }
          ]
        },
        {
          type: 'color',
          label: '线条颜色',
          name: 'color',
          value: '#ff0000',
          required: true
        },
        {
          type: 'number',
          label: '线条粗细',
          name: 'strokeWidth',
          value: '2',
          required: true
        }
      ],
      onConfirm: payload => {
        const selectedStyle = payload.find(p => p.name === 'style')?.value || 'standard';
        const color = payload.find(p => p.name === 'color')?.value || '#ff0000';
        const strokeWidth = Number(payload.find(p => p.name === 'strokeWidth')?.value || 2);

        const svgData = createRedLineSVG(selectedStyle, { color, strokeWidth });

        // 计算高度预览值
        let imgHeight = strokeWidth * 2;
        if (selectedStyle === 'double') imgHeight = strokeWidth * 6;
        if (selectedStyle === 'thick') imgHeight = strokeWidth * 4;

        // 使用 executeInsertElementList 确保前后的换行符也具备对齐属性，彻底解决居中问题
        instance!.command.executeInsertElementList([
          { value: '\n', rowFlex: 'center' },
          {
            type: ElementType.IMAGE,
            value: svgData,
            width: 600,
            height: imgHeight,
            rowFlex: 'center',
            title: 'redline'
          },
          { value: '\n', rowFlex: 'center' }
        ] as any);
      }
    });
    return;
  }

  // 预设样式直接插入
  const svgData = createRedLineSVG(style);
  let imgHeight = 5;
  if (style === 'double') imgHeight = 16;
  if (style === 'thick') imgHeight = 10;

  instance!.command.executeInsertElementList([
    { value: '\n', rowFlex: 'center' },
    {
      type: ElementType.IMAGE,
      value: svgData,
      width: 600,
      height: imgHeight,
      rowFlex: 'center',
      title: 'redline'
    },
    { value: '\n', rowFlex: 'center' }
  ] as any);
};

const defaultTemplates = [
  { id: 'standard', name: '标准发文(红头)', type: 'red-head' },
  { id: 'notice', name: '通知 (常用)', type: 'red-head' },
  { id: 'announcement', name: '公告', type: 'red-head' },
  { id: 'letter', name: '函 (正式)', type: 'report' },
  { id: 'report', name: '请示报告', type: 'report' },
  { id: 'meeting', name: '会议纪要', type: 'meeting' },
  { id: 'decision', name: '决定/决议', type: 'red-head' },
  { id: 'reply', name: '批复', type: 'report' }
];

const templates = ref<any[]>([...defaultTemplates]);

const loadCustomTemplates = () => {
  const customStr = localStorage.getItem('word_custom_templates');
  if (customStr) {
    try {
      const customTmpls = JSON.parse(customStr);
      templates.value = [...defaultTemplates, ...customTmpls];
    } catch (e) {
      console.error(e);
    }
  }
};

const saveCustomTemplate = () => {
  if (!instance) return;
  const name = window.prompt('请输入自定义模版的名称：', '自定义模版');
  if (!name) return;

  const currentData = instance.command.getValue().data.main;
  const newTmpl = {
    id: 'custom_' + Date.now(),
    name,
    type: 'report',
    data: currentData
  };

  templates.value.push(newTmpl);

  const customTemplates = templates.value.filter(t => t.id.startsWith('custom_'));
  localStorage.setItem('word_custom_templates', JSON.stringify(customTemplates));
};

const deleteCustomTemplate = (id: string) => {
  if (window.confirm('确定删除该自定义模版吗？')) {
    templates.value = templates.value.filter(t => t.id !== id);
    const customTemplates = templates.value.filter(t => t.id.startsWith('custom_'));
    localStorage.setItem('word_custom_templates', JSON.stringify(customTemplates));
  }
};

// 视图标签页功能已迁移至 official-ui/menu-bindings.ts


// 编辑器设置功能已迁移至 official-ui/menu-bindings.ts


const saveToLocal = async (manual = false) => {
  if (!instance) return;
  isSaving.value = true;
  try {
    const data = instance.command.getValue();
    // 存储数据核心部分
    const draftData = data.data;
    await dbService.set(DRAFT_KEY, draftData);
    
    const now = new Date();
    lastSavedTime.value = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    if (manual) {
      console.log('手动保存成功 (IndexedDB)');
    }
  } catch (e) {
    console.error('保存失败', e);
  } finally {
    setTimeout(() => {
      isSaving.value = false;
    }, 1000);
  }
};

const loadFromLocal = async () => {
  if (!instance) return;
  
  try {
    // 优先尝试从 IndexedDB 加载
    let draftData = await dbService.get<any>(DRAFT_KEY);
    
    // 如果 IndexedDB 为空，尝试从 localStorage 迁移 (处理旧版本数据)
    if (!draftData) {
      const oldDraft = localStorage.getItem(DRAFT_KEY);
      if (oldDraft) {
        try {
          const parsed = JSON.parse(oldDraft);
          draftData = parsed.data || parsed;
          console.log('检测到旧版 localStorage 草稿，正在迁移至 IndexedDB...');
          // 迁移后建议存入 IndexedDB
          await dbService.set(DRAFT_KEY, draftData);
          // 可选：清理 localStorage 以节省空间
          // localStorage.removeItem(DRAFT_KEY);
        } catch (e) {
          console.error('旧版草稿解析失败', e);
        }
      }
    }

    if (draftData) {
      // 兼容以前的包装格式
      const data = draftData.data || draftData;
      
      // 如果数据结构不包含 main，可能是一个空对象或错误对象，跳过
      if (!data || (!data.main && !data.header && !data.footer)) {
        console.warn('无效的草稿数据', data);
        return;
      }
      instance.command.executeSetValue(data);
      console.log('草稿已自洽恢复');
    }
  } catch (e) {
    console.error('恢复草稿失败', e);
  }
};

const handleWindowClick = () => {
  redLineMenuVisible.value = false;
};

const handleGlobalKeyDown = (evt: KeyboardEvent) => {
  if (evt.key === 'Escape') {
    // 强制尝试寻找并关闭图片预览器 (针对 canvas-editor 默认预览器)
    const viewer = document.querySelector('.ce-image-viewer');
    if (viewer) {
      const closeBtn = viewer.querySelector('.ce-image-viewer__close') as HTMLElement;
      if (closeBtn) {
        closeBtn.click();
      } else {
        viewer.remove();
      }
    }
  }
};

onMounted(() => {
  window.addEventListener('click', handleWindowClick);
  window.addEventListener('keydown', handleGlobalKeyDown);
  loadCustomTemplates();
  // Use timeout to ensure DOM is fully rendered for querySelectors inside bindEditorUI
  setTimeout(() => {
    const container = document.querySelector('.editor') as HTMLDivElement;
    if (!container) return;

    instance = new Editor(container, {
      main: [],
    }, {
      margins: [100, 120, 100, 120],
      watermark: {
        data: '中飞内部文件',
        color: '#f0f0f0',
        size: 30,
        repeat: true,
        opacity: 1
      },
      scrollContainerSelector: '.editor'
    });



    try {
      bindEditorUI(instance);
    } catch (e) {
      console.error('Menu binding error:', e);
    }

    // Mount it on the window so UI actions finding window.__CANVAS_EDITOR_INSTANCE__ works
    (window as any).__CANVAS_EDITOR_INSTANCE__ = instance;
    (window as any).editor = instance;

    // 加载缓存
    loadFromLocal();

    // 关键：保留并包装原有的内容变动监听器（用于更新字数、目录等 UI）
    const oldContentChange = instance.listener.contentChange;
    const autoSave = debounce(() => {
      saveToLocal(false);
    }, 2000);

    instance.listener.contentChange = () => {
      // 触发原有逻辑（更新字数、目录等，内部有 200ms 防抖）
      if (oldContentChange) oldContentChange();
      // 触发自动保存逻辑（2000ms 防抖）
      autoSave();
    };

    // 快捷键 Ctrl+S
    window.addEventListener('keydown', (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        saveToLocal(true);
      }
    });
  }, 100);
});

onUnmounted(() => {
  window.removeEventListener('click', handleWindowClick);
  window.removeEventListener('keydown', handleGlobalKeyDown);
  if (instance) {
    instance.destroy();
  }
});

const showTemplateModal = () => {
  templateModalVisible.value = true;
};

const applyTemplate = (id: string) => {
  if (!instance) return;
  let templateData: any[] = [];

  if (id.startsWith('custom_')) {
    const tmpl = templates.value.find(t => t.id === id);
    if (tmpl && tmpl.data) {
      templateData = tmpl.data;
    }
  } else if (id === 'notice') {
    templateData = [
      { value: '机 密\n', size: 16, font: '黑体' },
      { value: '中 飞 核 心 企 业 通 知\n\n', size: 38, font: '方正小标宋_GBK, 黑体', color: '#ff0000', rowFlex: 'center' },
      { type: 'image', value: createRedLineSVG('standard'), width: 600, height: 6, rowFlex: 'center' },
      { value: '\n', size: 14 },
      { value: '中飞发〔2026〕88号\n\n', size: 16, font: '仿宋_GB2312', rowFlex: 'center' },
      { value: '关于加强五一期间值班工作的通知\n\n', size: 24, font: '方正小标宋_GBK, 黑体', rowFlex: 'center' },
      { value: '各所属单位、各部门：\n', size: 16, font: '仿宋_GB2312' },
      { value: '    为保障假期期间生产安全，现就有关要求通知如下...\n', size: 16, font: '仿宋_GB2312' },
      { value: '    一、高度重视安全生产...\n', size: 16, font: '仿宋_GB2312' },
      { value: '    二、严格落实值班制度...\n\n', size: 16, font: '仿宋_GB2312' },
      { value: '中飞集团有限公司\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' },
      { value: '2026年4月10日\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' }
    ];
  } else if (id === 'announcement') {
    templateData = [
      { value: '公 告\n\n', size: 42, font: '方正小标宋_GBK, 黑体', color: '#ff0000', rowFlex: 'center' },
      { value: '2026年第3号\n\n', size: 16, font: '仿宋_GB2312', rowFlex: 'center' },
      { type: 'image', value: createRedLineSVG('standard'), width: 600, height: 6, rowFlex: 'center' },
      { value: '\n', size: 14 },
      { value: '关于新产品正式上线的公告\n\n', size: 24, font: '方正小标宋_GBK, 黑体', rowFlex: 'center' },
      { value: '    经过多轮测试，我司自主研发的新一代编辑器产品现已正式上线...\n\n', size: 16, font: '仿宋_GB2312' },
      { value: '特此公告。\n\n', size: 16, font: '仿宋_GB2312' },
      { value: '中飞研发中心\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' },
      { value: '2026年4月10日\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' }
    ];
  } else if (id === 'letter') {
    templateData = [
      { value: '红 头 函 件\n\n', size: 36, font: '方正小标宋_GBK, 黑体', color: '#ff0000', rowFlex: 'center' },
      { type: 'image', value: createRedLineSVG('standard'), width: 600, height: 6, rowFlex: 'center' },
      { value: '\n', size: 14 },
      { value: '致 [合作单位名称] 的商洽函\n\n', size: 22, font: '方正小标宋_GBK, 黑体', rowFlex: 'center' },
      { value: '[合作单位名称]：\n', size: 16, font: '仿宋_GB2312' },
      { value: '    感谢贵司长期以来对我司的大力支持。现就XXXX项目事宜商洽如下...\n\n', size: 16, font: '仿宋_GB2312' },
      { value: '望复函为盼。\n\n', size: 16, font: '仿宋_GB2312' },
      { value: '中飞项目部\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' }
    ];
  } else if (id === 'reply') {
    templateData = [
      { value: '官 方 批 复\n\n', size: 38, font: '方正小标宋_GBK, 黑体', color: '#ff0000', rowFlex: 'center' },
      { type: 'image', value: createRedLineSVG('standard'), width: 600, height: 6, rowFlex: 'center' },
      { value: '\n', size: 14 },
      { value: '关于XX项目可行性研究报告的批复\n\n', size: 22, font: '方正小标宋_GBK, 黑体', rowFlex: 'center' },
      { value: '    你部《关于XX项目的请示》收悉。经研究，现批复如下：\n', size: 16, font: '仿宋_GB2312' },
      { value: '    原则同意该项目立项...\n\n', size: 16, font: '仿宋_GB2312' },
      { value: '审批机关\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' }
    ];
  } else if (id === 'standard') {
    templateData = [
      { value: '【机密】\n', size: 16, font: '黑体', color: '#000000' },
      { value: 'X X 部 门 发 文\n\n\n', size: 36, font: '方正小标宋_GBK, 方正小标宋简体, 黑体', color: '#ff0000', rowFlex: 'center' },
      { type: 'image', value: createRedLineSVG('standard'), width: 600, height: 6, rowFlex: 'center' },
      { value: '\n', size: 14 },
      { value: '关于XXXX工作指引的通知\n\n', size: 22, font: '方正小标宋_GBK, 方正小标宋简体, 黑体', rowFlex: 'center' },
      { value: '各部门、各单位：\n', size: 16, font: '仿宋_GB2312, 仿宋, SimSun' },
      { value: '    为了提高工作效率...\n\n', size: 16, font: '仿宋_GB2312, 仿宋, SimSun' },
      { value: '    特此通知。\n\n', size: 16, font: '仿宋_GB2312, 仿宋, SimSun' },
      { value: '单位落款\n', size: 16, font: '仿宋_GB2312, SimSun', rowFlex: 'right' },
      { value: '2026年4月7日\n', size: 16, font: '仿宋_GB2312, SimSun', rowFlex: 'right' }
    ];
  } else if (id === 'report') {
    templateData = [
      { value: 'X X 部 门 请 示 报 告\n\n\n', size: 36, font: '方正小标宋_GBK, 黑体', color: '#ff0000', rowFlex: 'center' },
      { type: 'image', value: createRedLineSVG('standard'), width: 600, height: 6, rowFlex: 'center' },
      { value: '\n', size: 14 },
      { value: '关于XXXX的请示\n\n', size: 22, font: '方正小标宋_GBK, 黑体', rowFlex: 'center' },
      { value: '尊敬的领导：\n', size: 16, font: '仿宋_GB2312' },
      { value: '    现就近期工作汇报如下...\n\n', size: 16, font: '仿宋_GB2312' },
      { value: '汇报人：XXX\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' }
    ];
  } else if (id === 'meeting') {
    templateData = [
      { value: '会 议 纪 要\n\n', size: 36, font: '方正小标宋_GBK, 黑体', color: '#333', rowFlex: 'center' },
      { value: '第 [2026] 1 号\n\n', size: 16, font: '仿宋_GB2312', rowFlex: 'center' },
      { type: 'image', value: createRedLineSVG('standard', { color: '#000000' }), width: 600, height: 4, rowFlex: 'center' },
      { value: '\n', size: 14 },
      { value: '时间：2026年4月7日\n', size: 16, font: '黑体' },
      { value: '地点：第一会议室\n', size: 16, font: '黑体' },
      { value: '参会人员：张三、李四、王五\n\n', size: 16, font: '黑体' },
      { value: '会议记录：\n', size: 16, font: '黑体' },
      { value: '    本次会议重点讨论了...\n\n', size: 16, font: '仿宋_GB2312' }
    ];
  } else if (id === 'decision') {
    templateData = [
      { value: '中 共 X X 委 员 会 决 定\n\n\n', size: 36, font: '方正小标宋_GBK, 黑体', color: '#ff0000', rowFlex: 'center' },
      { type: 'image', value: createRedLineSVG('standard'), width: 600, height: 6, rowFlex: 'center' },
      { value: '\n', size: 14 },
      { value: '关于同意实施XXX的决定\n\n', size: 22, font: '方正小标宋_GBK, 黑体', rowFlex: 'center' },
      { value: '    为进一步加强和改进工作...\n\n', size: 16, font: '仿宋_GB2312' },
      { value: 'X X 委 员 会\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' },
      { value: '2026年4月7日\n', size: 16, font: '仿宋_GB2312', rowFlex: 'right' }
    ];
  }

  if (templateData.length > 0) {
    instance.command.executeSetValue({ main: templateData });
  }
  templateModalVisible.value = false;
};
</script>

<style scoped>
.word-container-pro {
  --biz-primary: #1b2e4b;
  --biz-primary-light: #2c4a7c;
  --biz-bg: #f8f9fb;
  --biz-bg-dark: #f0f2f5;
  --biz-text: #1d2129;
  --biz-text-secondary: #4e5969;
  --biz-border: #e5e6eb;
  --biz-shadow: 0 4px 10px rgba(0, 0, 0, 0.05);

  display: flex;
  flex-direction: column;
  height: 100vh;
  box-sizing: border-box;
  background-color: var(--biz-bg);
  position: relative;
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
}

/* Ribbon GUI overrides */
.custom-ribbon-tabs {
  background-color: #f4f5f7;
  display: flex;
  flex-direction: column;
  z-index: 100;
}

.tabs-nav {
  display: flex;
  padding: 4px 20px 0 20px;
  background-color: #fff;
  border-bottom: 1px solid var(--biz-border);
}

.tab-btn {
  padding: 10px 20px;
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  color: var(--biz-text-secondary);
  border-bottom: 2px solid transparent;
  margin-right: 4px;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.tab-btn:hover {
  color: var(--biz-primary);
  background-color: rgba(27, 46, 75, 0.04);
}

.tab-btn.active {
  color: var(--biz-primary);
  border-bottom: 2px solid var(--biz-primary);
  background-color: #fff;
}

.tabs-content {
  background-color: #fff;
  border-bottom: 1px solid var(--biz-border);
  padding: 6px 20px;
  box-shadow: 0 2px 5px rgba(0, 0, 0, 0.02);
}

.tab-pane {
  display: block;
}

.tab-pane[style*="display: none"] {
  display: none !important;
}

.custom-ribbon-tabs .menu {
  position: relative !important;
  top: auto !important;
  z-index: 1 !important;
  height: 50px !important;
  background: transparent !important;
  justify-content: flex-start !important;
  box-shadow: none !important;
  overflow: visible !important;
}

.action-btn {
  margin: 0 4px;
}

.custom-action-bar {
  position: absolute;
  top: 15px;
  right: 20px;
  z-index: 100;
  display: flex;
  gap: 15px;
}

.action-btn {
  height: 30px;
  border-radius: 4px;
}

/* 覆盖样式 */
.menu {
  position: absolute;
}

.catalog {
  top: 60px;
}

.editor {
  position: relative;
  margin-top: 0px;
  height: calc(100vh - 90px);
  overflow-y: auto;
}

.editor>div {
  margin: 30px auto !important;
}

.footer {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 32px;
  background: rgba(255, 255, 255, 0.85);
  backdrop-filter: blur(12px) saturate(180%);
  -webkit-backdrop-filter: blur(12px) saturate(180%);
  border-top: 1px solid rgba(229, 230, 235, 0.5);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  font-size: 11px;
  color: var(--biz-text-secondary);
  z-index: 1000;
  box-shadow: 0 -2px 10px rgba(0, 0, 0, 0.05);
}

.footer>div {
  display: flex;
  align-items: center;
  gap: 12px;
}

.footer .status-group {
  display: flex;
  align-items: center;
  gap: 8px;
  border-right: 1px solid var(--biz-border);
  padding-right: 12px;
}

.footer .status-group:last-child {
  border-right: none;
}

.footer span {
  display: flex;
  align-items: center;
  gap: 2px;
  white-space: nowrap;
}

.footer .page-no-list,
.footer .page-no,
.footer .page-size,
.footer .word-count,
.footer .row-no,
.footer .col-no {
  font-weight: 600;
  color: var(--biz-primary);
}

/* 模版库试图展现样式 */
.template-gallery {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  padding: 10px;
}

.template-card {
  cursor: pointer;
  border: 1px solid #e8e8e8;
  border-radius: 4px;
  padding: 10px;
  transition: all 0.2s;
  background: #fdfdfd;
}

.template-card:hover {
  border-color: var(--biz-primary);
  box-shadow: 0 8px 20px rgba(27, 46, 75, 0.1);
  transform: translateY(-3px);
}

.delete-btn {
  position: absolute;
  top: 5px;
  right: 5px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: rgba(255, 0, 0, 0.7);
  color: white;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 12px;
  opacity: 0;
  transition: opacity 0.2s;
  z-index: 10;
}

.template-card:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: rgba(255, 0, 0, 1);
  transform: scale(1.1);
}

.template-cover {
  width: 100%;
  height: 160px;
  background-color: #f0f2f5;
  margin-bottom: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px dashed #d9d9d9;
}

/* CSS 组合模拟封面的微观效果 */
.mock-doc {
  width: 80px;
  height: 110px;
  background: #fff;
  box-shadow: 0 0 5px rgba(0, 0, 0, 0.1);
  padding: 10px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.mock-doc .head {
  color: red;
  font-size: 12px;
  font-weight: bold;
  margin-top: 5px;
}

.mock-doc.meeting .head {
  color: #333;
}

.mock-doc .line {
  width: 90%;
  height: 2px;
  background-color: red;
  margin-top: 5px;
  margin-bottom: 10px;
}

.mock-doc .mock-text {
  width: 100%;
  height: 4px;
  background: #ccc;
  margin-bottom: 4px;
}

.mock-doc .mock-text-1 {
  width: 90%;
}

.mock-doc .mock-text-2 {
  width: 100%;
}

.mock-doc .mock-text-3 {
  width: 60%;
  align-self: flex-start;
}

.template-title {
  text-align: center;
  font-size: 14px;
  color: #333;
}

/* Fix catalog overlapping tabs */
.word-container-pro :deep(.catalog) {
  top: 105px !important;
  height: calc(100vh - 105px - 32px) !important;
}

.word-container-pro .catalog {
  top: 105px !important;
  height: calc(100vh - 105px - 32px) !important;
}

/* Fix content document gap */
.word-container-pro :deep(.editor > div) {
  margin: 40px auto 80px auto !important;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.08) !important;
  transition: box-shadow 0.3s ease;
}

.word-container-pro .editor>div {
  margin: 40px auto 80px auto !important;
  box-shadow: 0 0 25px rgba(0, 0, 0, 0.08) !important;
}

.word-container-pro .editor>div:hover {
  box-shadow: 0 0 35px rgba(0, 0, 0, 0.12) !important;
}

/* 图片预览器关闭按钮增强：强制显示并置顶 */
:deep(.ce-image-viewer),
.ce-image-viewer {
  z-index: 20000 !important;
}

:deep(.ce-image-viewer__close),
.ce-image-viewer__close {
  display: flex !important;
  visibility: visible !important;
  z-index: 20001 !important;
  cursor: pointer !important;
}

/* 如果预览器是在 body 下的全局元素 */
:global(.ce-image-viewer) {
  z-index: 20000 !important;
}

:global(.ce-image-viewer__close) {
  display: flex !important;
  visibility: visible !important;
  z-index: 20001 !important;
}

/* Make editor flex container aware of new bounds */
.word-container-pro .editor {
  flex: 1;
  overflow-y: auto;
  position: relative;
}
</style>
