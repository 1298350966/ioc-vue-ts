import { Router } from "vue-router";
import createBeforeEach from "./beforeEach";
import createAfterEach from "./afterEach";



export function createRouterGuards(router: Router){
  // 全局前置守卫
  createBeforeEach(router)
  // 全局后置钩子
  createAfterEach(router)
  // 错误
  router.onError((error) => {
    console.log(error, '路由错误');
  });
}