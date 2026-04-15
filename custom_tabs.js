const fs = require('fs');

const vueFile = 'e:\\zf_Word\\src\\views\\word\\index.vue';
let content = fs.readFileSync(vueFile, 'utf8');

// Replace a-tabs, a-tab-pane
let newTemplate = content
  .replace(/<a-tabs[^>]*class="word-ribbon-tabs"[^>]*>/, `
    <div class="custom-ribbon-tabs">
      <div class="tabs-nav">
        <div class="tab-btn" :class="{active: activeTab === '1'}" @click="activeTab = '1'">开始</div>
        <div class="tab-btn" :class="{active: activeTab === '2'}" @click="activeTab = '2'">插入</div>
        <div class="tab-btn" :class="{active: activeTab === '3'}" @click="activeTab = '3'">视图</div>
        <div class="tab-btn" :class="{active: activeTab === '4'}" @click="activeTab = '4'">审阅</div>
        <div class="tab-btn" :class="{active: activeTab === '5'}" @click="activeTab = '5'">公文</div>
        <div class="tab-btn" :class="{active: activeTab === '6'}" @click="activeTab = '6'">模板</div>
        <div class="tab-btn" :class="{active: activeTab === '7'}" @click="activeTab = '7'">导入</div>
        <div class="tab-btn" :class="{active: activeTab === '8'}" @click="activeTab = '8'">导出</div>
      </div>
      <div class="tabs-content">
  `)
  .replace(/<\/a-tabs>/, `
      </div>
    </div>
  `)
  // replace <a-tab-pane key="1" title="xxx"> with <div class="tab-pane" v-show="activeTab === '1'">
  .replace(/<a-tab-pane key="([^"]+)" title="([^"]+)">/g, `<div class="tab-pane" v-show="activeTab === '$1'">`)
  .replace(/<\/a-tab-pane>/g, `</div>`);

// Inject reactive activeTab
if (!newTemplate.includes('activeTab')) {
  newTemplate = newTemplate.replace('const templateModalVisible = ref(false);', `const templateModalVisible = ref(false);\nconst activeTab = ref('1');`);
}

// Update the CSS part
newTemplate = newTemplate.replace(/\/\* Ribbon GUI overrides \*\/[\s\S]*?(?=\.custom-action-bar)/, `/* Ribbon GUI overrides */
.custom-ribbon-tabs {
  background-color: #f4f5f7;
  display: flex;
  flex-direction: column;
}
.tabs-nav {
  display: flex;
  padding: 0 10px;
  background-color: #f0f2f5;
  border-bottom: 1px solid #e1e3e8;
}
.tab-btn {
  padding: 8px 16px;
  cursor: pointer;
  font-size: 14px;
  color: #4e5969;
  border-bottom: 2px solid transparent;
  margin-right: 4px;
}
.tab-btn:hover {
  background-color: #e5e6eb;
}
.tab-btn.active {
  color: #165dff;
  border-bottom: 2px solid #165dff;
  background-color: #fff;
}
.tabs-content {
  background-color: #fff;
  border-bottom: 1px solid #e1e3e8;
  padding: 4px 10px;
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
  height: 44px !important;
  background: transparent !important;
  justify-content: flex-start !important;
  box-shadow: none !important;
  overflow: visible !important;
}
.action-btn {
  margin: 0 4px;
}

`);

fs.writeFileSync(vueFile, newTemplate, 'utf8');
console.log('Tabs replaced beautifully.');
