import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router);
var constantRouterMap = [];


export default new Router({
    // history模式,
    // 解决默认的路由模式,cas应对路由(http://localhost:9001/#/system/model)带有#,登陆成功后跳转回来时只能够到http://localhost:9001/,
    // 在此项目中无论任何一个存在的路由登录态失效后重新登录都只能够跳转到首页,这样显然是不合理的
    mode: 'history',
    routes: constantRouterMap
})
