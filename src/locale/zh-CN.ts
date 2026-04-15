import localeLogin from './login/zh-CN.ts';
import localeWorkplace from './workplace/zh-CN.ts';
import localeSettings from './settings/zh-CN.ts';

export default {
  'menu.dashboard': '首页',
  'menu.server.dashboard': '首页',
  'navbar.action.locale': '切换为中文',
  ...localeSettings,
  ...localeLogin,
  ...localeWorkplace,
  //新增
  'menu.statistics': '数据统计',
  'menu.sys': '系统管理',
  'menu.sys.user': '用户管理',
};
