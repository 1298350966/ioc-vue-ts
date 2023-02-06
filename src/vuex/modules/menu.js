import * as types from '../types'
import khUtils from '../../utils/khUtils'

const state = {
    menus: [],
    childMenus: []
};

const actions = {
    // 获取一级菜单列表
    getMenus({commit}, {routes}) {
        commit(types.GET_USER_MENU, routes);
    },
    // 获取二级菜单列表
    getChildMenus({commit, state}, routes) {
        let current = routes.matched[1];
        if (current !== undefined && current !== null && current.parent !== null) {
            let menus = khUtils.instance.clone(state.menus);
            for (let menu of menus) {
                if (menu.path === current.parent.path && menu.children) {
                    menus = menu.children;
                    break;
                }
            }
            commit(types.GET_USER_CHILD_MENU, menus);
        } else {
            commit(types.GET_USER_CHILD_MENU, state.menus[0].children);
        }
    }
};

const getters = {
    getMenus: state => state.menus,
    getChildMenus: state => state.childMenus
};

const mutations = {
    [types.GET_USER_MENU](state, list) {
        state.menus = list;
    },
    [types.GET_USER_CHILD_MENU](state, list) {
        state.childMenus = list;
    }
};

export default {
    state,
    actions,
    getters,
    mutations
}
