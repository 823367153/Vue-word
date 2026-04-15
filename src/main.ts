import { createApp } from 'vue';
import ArcoVue from '@arco-design/web-vue';
import ArcoVueIcon from '@arco-design/web-vue/es/icon';
// 样式通过 arco-plugin 插件导入。详见目录文件 config/plugin/arcoStyleImport.ts

import router from './router';
import store from './store';
import i18n from './locale';
import directive from './directive';
import App from './App.vue';
import '@/assets/style/index.less';
import { Message } from '@arco-design/web-vue';

 import "@/utils/flexible.js";


// mdn
import VMdPreview from '@kangc/v-md-editor/lib/preview';
import '@kangc/v-md-editor/lib/style/preview.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
// highlightjs
import hljs from 'highlight.js';

VMdPreview.use(githubTheme, {
  Hljs: hljs,
});

const app = createApp(App);
Message._context = app._context;
if(window.config.VUE_IS_LOCAL) {
	app.config.globalProperties.baseurl = window.config.VUE_FILE_BASE_PATH;
} else {
	app.config.globalProperties.baseurl = window.config.VUE_FILE_OSS_PATH;
}
app.use(VMdPreview);
app.use(ArcoVue, {});
app.use(ArcoVueIcon);

app.use(router);
app.use(store);
app.use(i18n);

app.use(directive);

app.mount('#app');
