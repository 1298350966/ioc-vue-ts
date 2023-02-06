<template>
    <el-breadcrumb class="app-breadcrumb" separator="/">
        <el-breadcrumb-item>当前位置</el-breadcrumb-item>
        <transition-group name="breadcrumb">
            <el-breadcrumb-item v-for="(item,index) in breadcrumbList" :key="index">
                <span class="no-redirect" :style="breadcrumbStyle(index)">{{item.name}}</span>
            </el-breadcrumb-item>
        </transition-group>
    </el-breadcrumb>
</template>

<script>
import {mapGetters} from "vuex"
    export default {
        data() {
            return {
                name: 'BreadCrumb',
                breadcrumbList: [],
                currentPathName: '',
                currentPathNameParent: '',
                topHeight: 0
            }
        },
        computed:{
            ...mapGetters({
                routerNames: 'routerNames',                    // 二级菜单
            })
        },
        mounted() {
            // // 获取Top栏的高度
            // let topDom = document.getElementById("topNav");
            // // 设置面包屑的top属性
            // let breadcrumbDom = document.getElementById("breadCrumb");
            // breadcrumbDom.style.top = topDom.offsetHeight + 'px';
            // this.init(this.$router.currentRoute);
            this.init();
        },
        watch: {
            //监听路由改变
            '$route'(to, from) {
                this.init();
            }
        },
        methods: {
            breadcrumbStyle(index){
              return {}
            },
            // 初始化面包屑
            init() {
                this.breadcrumbList = this.$route.matched;
            }
        }
    }
</script>

<style lang="scss" scoped>
.app-breadcrumb.el-breadcrumb {
  display: inline-block;
  font-size: 14px;
  line-height: 45px;
  margin-left: 8px;

  .no-redirect {
    color: #97a8be;
    cursor: text;
  }
}
</style>
