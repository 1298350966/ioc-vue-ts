<template>
    <section class="NavGroup" :style="NavGroupStyle">
        <div class="left-menu" v-if="showM">
            <el-menu
                :default-active="activeIndex"
                :collapse="isCollapse"
                id="navMenu"
                class="nav-menu"
                background-color="transparent"
                :text-color="variables.menuText"
                :unique-opened="false"
                :active-text-color="variables.menuActiveText"
                :collapse-transition="false"
                router>
                <el-scrollbar>
                    <side-nav :child-menus="childMenus" :currentMenuDepth="currentMenuDepth"></side-nav>
                </el-scrollbar>
            </el-menu>

            <div class="menuCollapse">
                <i :class="[!isCollapse ? 'el-icon-caret-left' : 'el-icon-caret-right']" @click="isCollapse = !isCollapse"/>
            </div>
        </div>

        <div class="Main">
            <div class="navbar">
                <Hamburger id="hamburger-container" :is-active="!isCollapse" class="hamburger-container" @toggleClick="isCollapse = !isCollapse" />
                <bread-crumb v-if="showM" class="breadcrumb-container"></bread-crumb>
            </div>
            <section :class="[showM == true ? 'third-content':'third-content2']" id="thirdContent">
                <transition name="fade-transform" mode="out-in">
                <router-view class="router-view" :key="$route.fullPath"></router-view>
                </transition>
            </section>
        </div>
        <!-- <bread-crumb v-if="showM"></bread-crumb>

        <section :class="[showM == true ? 'third-content':'third-content2']" id="thirdContent">
            <router-view :key="$route.fullPath"></router-view>
        </section> -->
    </section>
</template>

<script>
    import menuIcon from './layout/menuIcon.vue';
    import {mapActions, mapGetters} from 'vuex'
    import SideNav from "@/components/layout/SideNav";
    import BreadCrumb from '@/components/BreadCrumb';
    import Hamburger from "./Hamburger/index.vue"
    import { LeftMenu as variables} from '@/assets/theme/config/index.js'

    export default {
        name: "NavGroup",
        components: {SideNav, BreadCrumb,menuIcon,Hamburger},
        props: {
            showSide: {
                type: Boolean,
                default: true,
            },
            showBread: {
                type: Boolean,
                default: true,
            },
        },

        data() {
            return {
                showMenu:true,
                childActiveMenu: this.$router.currentRoute.path !== '/' ? this.$router.currentRoute.path : "",
                activeIndex: '',
                isCollapse:false,

                currentMenuDepth:1,
            }
        },

        mounted() {
            let _this = this;
            if(location.search){
                this.activeIndex = decodeURI(this.$router.currentRoute.fullPath);
            }else{
                this.activeIndex = this.$router.currentRoute.path;
            }
            _this.activeIndex = this.$router.currentRoute.path;
            // let _this = this;
            // _this.activeIndex = this.$router.currentRoute.path;
            // // 获取Top栏的高度
            // let topDom = document.getElementById("topNav");
            // if(topDom){
            //     // 动态侧边栏菜单的top属性
            //     let navMenuDom = document.getElementById("navMenu");
            //     navMenuDom.style.top = topDom.offsetHeight + 'px';
            //     // 动态设置主体内容padding-top属性
            //     let thirdContentDom = document.getElementById("thirdContent");
            //     if(thirdContentDom){
            //         thirdContentDom.style.paddingTop = topDom.offsetHeight + 'px';
            //     }
            // }
        },

        watch: {
            //监听路由改变
            // '$route'(to, from) {
            //     this.activeIndex = this.$router.currentRoute.path;
            //     // 当前为二级菜单
            //     this.getChildMenus(this.$router.currentRoute);
            // },
            //监听路由改变
            '$route'(to, from) {
                this.$nextTick(()=>{
                    if(location.search){
                        this.activeIndex = decodeURI(this.$router.currentRoute.fullPath);
                    }else{
                        this.activeIndex = this.$router.currentRoute.path;
                    }
                     // 当前为二级菜单
                    this.getChildMenus(this.$router.currentRoute);
                })
            }
        },

        // computed: mapGetters({
        //     childMenus: 'getChildMenus',                    // 二级菜单
        // }),
        computed:{
            ...mapGetters({
                childMenus: 'getChildMenus',                    // 二级菜单
            }),
            variables() {
                return variables
            },
            NavGroupStyle(){
                let style = {}
                for (const key in variables) {
                   style["--" + key] = variables[key]
                }
                console.log(style)
                return style
            }
        },

        methods: {
            ...mapActions({
                getMenus: 'getMenus',
                getChildMenus: 'getChildMenus',
                getDeptTree: 'getDeptTree'
            })
        },
        created() {
            this.getChildMenus(this.$router.currentRoute);
            this.getDeptTree({cacheUpdate: false});
        }
    }
</script>

<style scoped lang="scss">
</style>
