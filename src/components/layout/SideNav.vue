<template>
    <div>
        <template v-for="item in childMenus">
            <el-submenu popper-append-to-body v-if="Array.isArray(item.children) && item.children.length > 0 " :key="item.id" :data="item"
                        :index="item.path" :class="isThirdNav">
                <template slot="title">
                    <menuIcon :iconName="item.iconName" :iconUpload="item.iconUpload"></menuIcon>
                    <span slot="title"> {{item.name}}</span>
                </template>
                <!-- 递归 -->
                <side-nav :child-menus="item.children" :currentMenuDepth="currentMenuDepth+1"></side-nav>
            </el-submenu>

            <template v-else>
                <el-menu-item
                    :key="item.id" :data="item" :index="item.path">
                    <menuIcon :iconName="item.iconName" :iconUpload="item.iconUpload"></menuIcon>
                    <span slot="title">{{item.name}}</span>
                </el-menu-item>
            </template>
        </template>

    </div>
</template>

<script>
    import menuIcon from "./menuIcon"
    export default {
        name: 'SideNav',
        components:{
            menuIcon
        },
        props: ['childMenus','currentMenuDepth'],
        data() {
            return {}
        },
        computed:{
            isThirdNav(){
                return this.currentMenuDepth === 2 ? 'third-nav':'';
            }
        },
        methods: {}
    }
</script>
<style scoped lang="scss">
// 三级或更高级别导航菜单样式
.third-nav{
    :deep(.el-submenu__title){
        background-color: var(--subMenuBg) !important;

        &:hover{
            background-color: var(--subMenuHover) !important;
        }
    }
}
</style>
