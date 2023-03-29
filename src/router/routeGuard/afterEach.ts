import { Router } from "vue-router"

export default function createAfterEach(router: Router){
  router.afterEach((to, from, failure) => {
    // document.title = 
  })
}