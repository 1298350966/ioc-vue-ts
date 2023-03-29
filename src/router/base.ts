import { RouteRecordRaw } from 'vue-router'
import type { AppRouteRecordRaw } from '@/router/types';
import { ErrorPage404, ErrorPage403, ErrorPage500, Layout } from '@/router/constant';
import { PageEnum } from '@/enums/pageEnum'
// import { GoReload } from '@/components/GoReload'


// export const LoginRoute: RouteRecordRaw = {
//   path: '/login',
//   name: 'Login',
//   component: () => import('@/views/login/index.vue'),
//   meta: {
//     title: '登录',
//   },
// };

export const HttpErrorPage: RouteRecordRaw[] = [
  {
    path: '/error/404',
    name: PageEnum.ERROR_PAGE_NAME_404,
    component: ErrorPage404,
    meta: {
      title: PageEnum.ERROR_PAGE_NAME_404,
    },
  },
  {
    path: '/error/403',
    name: PageEnum.ERROR_PAGE_NAME_403,
    component: ErrorPage403,
    meta: {
      title: PageEnum.ERROR_PAGE_NAME_403,
    },
  },
  {
    path: '/error/500',
    name: PageEnum.ERROR_PAGE_NAME_500,
    component: ErrorPage500,
    meta: {
      title: PageEnum.ERROR_PAGE_NAME_500,
    },
  },
]

export const ErrorPageRoute: AppRouteRecordRaw = {
  path: '/:path(.*)*',
  name: 'ErrorPage',
  component: ErrorPage404,
  meta: {
    title: PageEnum.ERROR_PAGE_NAME_404,
    hideBreadcrumb: true,
  }
};


