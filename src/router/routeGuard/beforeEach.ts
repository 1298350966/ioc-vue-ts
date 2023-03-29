import { Router } from "vue-router"

export default function createBeforeEach(router: Router){
  router.beforeEach((to, from, next) => {
    next()
  })
}