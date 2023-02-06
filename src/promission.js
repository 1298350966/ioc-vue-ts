import router from './router'
import khConfig from "./utils/khConfig";

//配置
const Config = khConfig.instance;
// host 路径
const Rest = Config.host.rest;

//获取组件的方法
const _import = require('./router/_import_' + process.env.NODE_ENV);
var getRouter; //用来获取后台拿到的路由
router.beforeEach((to, from, next) => {
    if (!getRouter) {//不加这个判断，路由会陷入死循环
        if (!getObjArr('router')) {
            // 企业注册页面绕开cas登录,则不需要获取动态路由,直接写死
            if (to.path === '/companyRegister') {
                let tempRouter = [];
                tempRouter.push({
                    "id": 999,
                    "parentId": null,
                    "path": "/companyRegister",
                    "level": 1,
                    "name": "企业注册",
                    "component": "CompanyRegister"
                });
                getRouter = tempRouter;
                routerGo(to, next);
                return false;
            }
            let xhr;
            if (window.ActiveXObject) {
                xhr = new ActiveXObject("Microsoft.XMLHTTP");
            } else {
                xhr = new XMLHttpRequest();
            }
            // 原生Ajax同步请求
            xhr.open("GET", Rest + Config.api.listRouter, false);
            xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                    let res = JSON.parse(xhr.responseText);
                    if (res.errCode === 0) {
                        if (res.children === undefined || res.children == null ||
                            res.children === ""
                            || res.children.length === 0) {
                            alert("您无任何菜单权限,请联系管理员进行授权!");
                            return false;
                        }
                        let firstMenuPath = "";
                        res.children.forEach((child, index) => {
                            if (0 === index) {
                                firstMenuPath = child.path;
                            }
                            loop(child);

                            function loop(child) {
                                // 将一级菜单重定向的地址默认设置为二级菜单的第一个节点的路由
                                if (child.children != null && child.children.length > 0) {
                                    child.redirect = child.children[0].path;
                                    if (child.children && child.path.indexOf("/custom") !== -1) {
                                        child.path = child.children[0].path
                                    }
                                    child.children.forEach(obj => {
                                        loop(obj);
                                    })
                                }
                            }
                        });
                        // 默认路由一
                        res.children.push({
                            "id": 998,
                            "parentId": null,
                            "path": "/",
                            "name": "首页跳转",
                            "redirect": firstMenuPath,
                            "component": "Redirect"
                        });
                        // 默认路由二
                        res.children.push({
                            "id": 999,
                            "parentId": null,
                            "path": "*",
                            "name": "页面未找到",
                            "component": "NotFound"
                        });
                        getRouter = res.children;
                        // 执行路由跳转方法
                        routerGo(to, next);
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: res.errMsg
                        });
                    }
                }
            };
            // 传递参数
            xhr.send();
        } else {
            //从localStorage拿到了路由
            getRouter = getObjArr('router');
            routerGo(to, next)
        }
    } else {
        next()
    }
})

function routerGo(to, next) {
    /**
     *  在子组件中报Error in callback for watcher "function () { return this._data.$$state }": "Error: [vuex] Do not mutate vuex store state outside mutation handlers: 是因为用了动态路由，
     *  然后又把路由放到了vuex中导致的。路由变化的时候不会通过mutation改变路由状态导致报错的
     */
    //将路由数据传递给全局变量，做侧边栏菜单渲染工作
    global.antRouter = JSON.parse(JSON.stringify(getRouter));
    // store.dispatch('getMenus',{routes: JSON.parse(JSON.stringify(getRouter))})
    let realRouter = filterAsyncRouter(getRouter);//过滤路由'
    router.addRoutes(realRouter); //采用深复制动态添加路由

    next({...to, replace: true});
}

function saveObjArr(name, data) { //localStorage 存储数组对象的方法
    localStorage.setItem(name, JSON.stringify(data))
}

//localStorage 获取数组对象的方法
function getObjArr(name) {
    return JSON.parse(window.localStorage.getItem(name));
}

// 深复制
function deepCopy(source) {
    if (!source) {
        return source;
    }
    let sourceCopy = source instanceof Array ? [] : {};
    for (let item in source) {
        sourceCopy[item] = typeof source[item] === 'object' ? deepCopy(source[item]) : source[item];
    }
    return sourceCopy;
}

//遍历后台传来的路由字符串，转换为组件对象
function filterAsyncRouter(asyncRouterMap) {
    return asyncRouterMap.filter(route => {
        route.path =  route.path.includes("?") ? route.path.split('?')[0] : route.path
        if (route.component) {
            switch (route.component) {
                case "NotFound":
                    route.component = _import('', route.component);
                    break;
                case "FormCustom":
                    route.component = _import('', route.component);
                    break;
               case "FormCustomV2":
                    route.component = _import('', route.component);
                    break;
                case "AddFormCustom":
                    route.component = _import('', route.component);
                    break;
                case "Redirect":
                    route.component = _import('', route.component);
                    break;
                case "FormCustomBase":
                    route.component = _import('', route.component);
                    break;
                case "ThirdFormCustomBase":
                    route.component = _import('', route.component);
                    break;
                case "ReportCustom":
                    route.component = _import('', route.component);
                    break;
                case "ReportCustomBase":
                    route.component = _import('', route.component);
                    break;
                case "ThirdReportCustomBase":
                    route.component = _import('', route.component);
                    break;
                case "CompanyRegister":
                    route.component = _import('', route.component);
                    break;
                default:
                    route.component = _import(route.path, route.component);
            }
        }
        if (route.children && route.children.length) {
            route.children = filterAsyncRouter(route.children)
        }
        return true
    })
}
