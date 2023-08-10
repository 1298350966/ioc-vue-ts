import { RouteRecordRaw } from 'vue-router'
import { EditEnum } from '@/enums/pageEnum'


const homeRoutes: RouteRecordRaw[] = [
  {
    path: "/home/viewsList",
    name: "ViewsList",
    component: () => import('@/views/home/viewsList/index.vue'),
    meta: {
      title: '大屏管理',
      isRoot: true
    }
  },
  {
    path: "/home/componentTemplate",
    name: "ComponentTemplate",
    component: () => import('@/views/home/componentTemplate/index.vue'),
    meta: {
      title: '组件模板',
      isRoot: true
    }
  }
]


export default homeRoutes