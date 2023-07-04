import { RouteRecordRaw } from 'vue-router'
import { EditEnum } from '@/enums/pageEnum'


const homeRoutes: RouteRecordRaw = {
  path: "/home",
  name: "home",
  component: () => import('@/views/home/index.vue'),
  meta: {
    title: '编辑',
    isRoot: true
  }
}


export default homeRoutes