import { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { createRouterGuards } from './routeGuard';
import { Layout,LayoutHome } from '@/router/constant'
import { PageEnum } from '@/enums/pageEnum';
import { HttpErrorPage } from './base';
import modules from './modules';

const constantRouter: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    // redirect: PageEnum.BASE_HOME,
    redirect: "/home",
    component: Layout,
    meta: {
      title: 'Root',
    },
    children: [
      ...HttpErrorPage,
      modules.chartRoutes,
      modules.previewRoutes,
      modules.editRoutes,
      {
        path: "/demo",
        name: "demo",
        component: () => import("@/views/test/nested-main.vue")
      },
      {
        path: "/replVue",
        name: "replVue",
        component: () => import("@/views/replVue/index.vue")
      },
      {
        path: "/wangEditor",
        name: "wangEditor",
        component: () => import("@/components/wangEditor/index.vue")
        
      }
    ]
  },
  {
    path: '/home',
    name: 'Home',
    component: LayoutHome,
    redirect:modules.homeRoutes[0].path,
    meta: {
      title: 'Home',
    },
    children: [
      ...modules.homeRoutes,
    ]
  },
]

const router = createRouter({
  history: createWebHashHistory(),
  routes: constantRouter,
  strict: true,
})

export function useRouter(app: App) {
  app.use(router);
  // 创建路由守卫
  createRouterGuards(router)
}

export default router