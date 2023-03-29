import { App } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router'
import { createRouterGuards } from './routeGuard';
import { Layout } from '@/router/constant'
import { PageEnum} from '@/enums/pageEnum';
import { HttpErrorPage } from './base';
import modules from './modules';

const constantRouter: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'Root',
    // redirect: PageEnum.BASE_HOME,
    redirect:"/chart/home/1",
    component: Layout,
    meta: {
      title: 'Root',
    },
    children: [
      ...HttpErrorPage,
      modules.chartRoutes,
      modules.previewRoutes
    ]
  }
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