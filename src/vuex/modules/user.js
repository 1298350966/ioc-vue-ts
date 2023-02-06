import * as types from '../types'

const state = {
    userInfo: {},
};

const actions = {
    setUserInfo({commit}, {user}) {
        sessionStorage.setItem('userInfo', JSON.stringify(user));
        commit(types.SET_USER_INFO, user);
    }
};

const getters = {
    getUserInfo: state => state.userInfo,
};

const mutations = {
    [types.SET_USER_INFO](state, res) {
        state.userInfo = res
    }
};

export default {
    state,
    actions,
    getters,
    mutations
}
