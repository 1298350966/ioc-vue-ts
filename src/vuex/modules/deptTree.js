import * as types from "../types";
import khHttp from "../../utils/khHttp";
import khConfig from "../../utils/khConfig";

const Config = khConfig.instance;
const Api = Config.api;

const DeptTree = sessionStorage.getItem('deptTree') != null ? JSON.parse(sessionStorage.getItem('deptTree')) : [];
const state = {
    // 部门列表
    deptTree: DeptTree || [],
    deptNode: {},
};

const actions = {
    /**
     * 获取部门树
     * @param commit
     * @param cacheUpdate
     */
    getDeptTree({commit}, {cacheUpdate}) {
        // 先从缓存里取或者明确标识不从缓存中取
       if ((DeptTree != null && DeptTree.length > 0) && !cacheUpdate) {
            let deptNode;
            if (DeptTree.length === 1) {
                deptNode = DeptTree[0]
            } else {
                deptNode = DeptTree.children[0]
            }
            commit(types.SET_DEPT_TREE, DeptTree);
            commit(types.SET_DEPT_NODE, deptNode);
            return false;
        }
        // 如果缓存里没有再从调用接口获取
       khHttp.Get(Api.listOrgTree)
            .then(res => {
                if (res.errCode === 0 && res.departManage != null) {
                    let tree = res.departManage;
                    let deptNode;
                    if (tree != null) {
                        if (tree.length === 1) {
                            deptNode = tree[0]
                        } else {
                            deptNode = tree.children[0]
                        }
                    }
                    sessionStorage.setItem("deptTree", JSON.stringify(tree));
                    commit(types.SET_DEPT_TREE, tree);
                    commit(types.SET_DEPT_NODE, deptNode);
                } else {
                    commit(types.SET_DEPT_TREE, []);
                    commit(types.SET_DEPT_NODE, {});
                }
            }).catch(error => {
            console.error(error)
        })
    },
    /**
     * 设置当前节点
     * @param commit
     * @param node
     */
    setDeptTree({commit}, node) {
        commit(types.SET_DEPT_NODE, node);
    }
};

const getters = {
    getDeptTree: state => state.deptTree,
    getDeptNode: state => state.deptNode
};

const mutations = {
    [types.SET_DEPT_TREE](state, tree) {
        state.deptTree = tree;
    },
    [types.SET_DEPT_NODE](state, deptNode) {
        state.deptNode = deptNode;
    }
};

export default {
    state,
    actions,
    getters,
    mutations
}
