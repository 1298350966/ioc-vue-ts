import Vue from "vue";
import Vuex from "vuex";
import user from "./modules/user";
import menu from "./modules/menu";
import deptTree from "./modules/deptTree";

Vue.use(Vuex);

export default new Vuex.Store({
    modules: {
        user,
        menu,
        deptTree
    },
    // 是否开启严格模式
    // strict: process.env.NODE_ENV !== 'production',
})
