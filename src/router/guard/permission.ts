import type { Router, RouteRecordNormalized } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

// 注释掉不需要的依赖（也可以保留，不影响）
// import usePermission from '@/hooks/permission';
// import { useUserStore, useAppStore } from '@/store';
// import { appRoutes } from '../routes';
// import { WHITE_LIST, NOT_FOUND } from '../constants';

export default function setupPermissionGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 👇 核心修改：直接放行所有路由，删除原有的所有权限校验逻辑
    next();
    // 保留NProgress的结束逻辑，不影响页面加载进度条
    NProgress.done();

    // 以下是原有的权限校验逻辑，直接注释/删除即可
    // const appStore = useAppStore();
    // const userStore = useUserStore();
    // const Permission = usePermission();
    // const permissionsAllow = Permission.accessRouter(to);
    // if (appStore.menuFromServer) {
    //   if (!WHITE_LIST.find((el) => el.name === to.name)) {
    //     await appStore.fetchServerMenuConfig();
    //   }
    //   const serverMenuConfig = [...WHITE_LIST];

    //   let exist = false;
    //   while (serverMenuConfig.length && !exist) {
    //     const element = serverMenuConfig.shift();
    //     if (element?.name === to.name) exist = true;

    //     if (element?.children) {
    //       serverMenuConfig.push(
    //         ...(element.children as unknown as RouteRecordNormalized[])
    //       );
    //     }
    //   }
    //   if (exist && permissionsAllow) {
    //     next();
    //   } else next(NOT_FOUND);
    // } else {
    //   if (permissionsAllow) next();
    //   else {
    //     const destination =
    //       Permission.findFirstPermissionRoute(appRoutes, userStore.role) ||
    //       NOT_FOUND;
    //     next(destination);
    //   }
    // }
    // NProgress.done();
  });
}