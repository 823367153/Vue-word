import localeLogin from './login/en-US.ts';
import localeWorkplace from './workplace/en-US.ts';
import localeSettings from './settings/en-US.ts';

export default {
  'menu.dashboard': 'Dashboard',
  'menu.server.dashboard': 'Dashboard-Server',
  'navbar.action.locale': 'Switch to English',
  ...localeSettings,
  ...localeLogin,
  ...localeWorkplace,
  //新增
  'menu.statistics': '数据统计',
};
