import type { Router, LocationQueryRaw } from 'vue-router';
import NProgress from 'nprogress'; // progress bar

// 注释掉不需要的依赖（也可以保留，不影响）
// import { useUserStore } from '@/store';
// import { isLogin } from '@/utils/auth';

export default function setupUserLoginInfoGuard(router: Router) {
  router.beforeEach(async (to, from, next) => {
    // 保留进度条开始的逻辑（不需要的话也可以删除）
    NProgress.start();
    // 👇 核心修改：直接放行所有路由，删除原有的登录校验逻辑
    next();

    // 以下是原有的登录校验逻辑，直接注释/删除即可
    // const userStore = useUserStore();
    // if (isLogin()) {
    //   if (userStore.role) {
    //     next();
    //   } else {
    //     try {
    //       if (to.name == 'login') {
    //       } else {
    //         await userStore.info();
    //       }
    //       next();
    //     } catch (error) {
    //       await userStore.logout();
    //       next({
    //         name: 'login',
    //         query: {
    //           redirect: to.name,
    //           ...to.query,
    //         } as LocationQueryRaw,
    //       });
    //     }
    //   }
    // } else {
    //   if (to.name === 'login') {
    //     next();
    //     return;
    //   }
    //   next({
    //     name: 'login',
    //     query: {
    //       redirect: to.name,
    //       ...to.query,
    //     } as LocationQueryRaw,
    //   });
    // }
  });
}