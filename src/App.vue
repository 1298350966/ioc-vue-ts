<template>
    <div id="app">
        <add-form-custom v-if="!showAddFullMenu"></add-form-custom>
        <company-register v-if="!showCompanyRegisterMenu"></company-register>
        <top-nav :active-menu="activeMenu" :menus="menus" v-if="showAddFullMenu && showCompanyRegisterMenu && showM"></top-nav>
        <div :class="[showM == true ? 'main-content':'main-content2']" v-if="getUserSuccess && showAddFullMenu && showCompanyRegisterMenu">
            <router-view></router-view>
        </div>
    </div>
</template>

<script>
    import TopNav from "@/components/layout/TopNav";
    import AddFormCustom from "@/views/AddFormCustom";
    import {mapActions, mapGetters} from 'vuex'
    import CompanyRegister from "@/views/CompanyRegister";
    import Vue from 'vue';
    export default {
        name: 'app',
        components: {CompanyRegister, AddFormCustom, TopNav},
        data() {
            return {
                activeMenu: this.$router.currentRoute.matched.length > 0 ? this.$router.currentRoute.matched[0].path : "",
                getUserSuccess: false,
                showAddFullMenu: true,  // 新增页面是否全屏显示,true: 不显示
                showCompanyRegisterMenu: true,  // cas登录页面直连企业注册页面,true: 不显示
            }
        },

        computed: mapGetters({
            menus: 'getMenus',                                      //  一级菜单
        }),

        beforeMount(){
            let v_s = this.getQueryVariable("v_s");
            if(v_s === 'third' || window.top !== window.self){
                Vue.prototype.showM=false;
            }else{
                Vue.prototype.showM=true;
            }

        },
        created() {
            let currentPath = this.$router.currentRoute.path;
            if (currentPath.indexOf("/full/custom/") > -1) {
                this.showAddFullMenu = false;
            }
            if (currentPath.indexOf("/companyRegister") > -1) {
                this.showCompanyRegisterMenu = false;
            }
            if (this.showAddFullMenu && this.showCompanyRegisterMenu) {
                // 获取当前用户信息
                this.$Get(this.khConfig.api.getUser, {})
                    .then(res => {
                        if (res.errCode === 0) {
                            this.getUserSuccess = true;
                            let tempObj = this.KHUtils.clone(res.user);
                            tempObj.enableCompanyPermission = res.enableCompanyPermission; // 0:基础设置页面将不再显示企业访问权限配置,表单设计页面中的高级控件栏不显示【企业】控件;
                            this.setUserInfo({user: tempObj});
                            this.getMenus({routes: global.antRouter});
                        }
                    });
            }
        },
        methods: {
            ...mapActions({
                getMenus: 'getMenus',
                setUserInfo: 'setUserInfo',
            }),
            getQueryVariable(variable) {
                var query = window.location.search.substring(1);
                var vars = query.split("&");
                for (var i=0;i<vars.length;i++) {
                    var pair = vars[i].split("=");
                    if(pair[0] == variable){
                        return pair[1];
                    }
                }
                return "";
            }
        }
    }
</script>

<style lang="scss">
    @import './assets/style/form-global';
    // @import url('http://at.alicdn.com/t/font_2407713_z8iwem0dum.css');

    * {
        box-sizing: border-box;
    }

    #app {
        font-family: 'Avenir', Helvetica, Arial, sans-serif;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        color: #2c3e50;
        width:100vw;
        height:100vh;
        display: flex;
        flex-flow: column;
        .main-content {
            width:100%;
            flex:1;
            overflow: auto;
        }

        .main-content2 {
            width:100%;
            flex:1;
            overflow: hidden;
        }
    }
</style>
