import { createRouter, createWebHashHistory } from 'vue-router';
import NProgress from 'nprogress'; // progress bar
import 'nprogress/nprogress.css';

import { appRoutes } from './routes';
import { REDIRECT_MAIN, NOT_FOUND_ROUTE } from './routes/base';
import createRouteGuard from './guard';

NProgress.configure({ showSpinner: false }); // NProgress Configuration

const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: '/',
      redirect: 'wordsbt',
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('@/views/login/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },

    {
      path: '/word',
      name: 'word',
      component: () => import('@/views/word/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/words',
      name: 'words',
      component: () => import('@/views/words/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    {
      path: '/wordsbt',
      name: 'wordsbt',
      component: () => import('@/views/wordsbeat/index.vue'),
      meta: {
        requiresAuth: false,
      },
    },
    ...appRoutes,
    REDIRECT_MAIN,
    NOT_FOUND_ROUTE,
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

createRouteGuard(router);

export default router;
