<template>
  <el-menu :default-active="defaultActiveMenu" router class="el-menu-vertical-demo">
   
    <el-menu-item :index="item.path"  v-for="(item, index) in homeRoutes" :key="index">{{item.meta.title}}</el-menu-item>
    <!-- <el-menu-item index="2">组件模板</el-menu-item> -->
  </el-menu>
</template>
<script setup lang="ts">
import homeRoutes from '@/router/modules/home.route'
const defaultActiveMenu = ref("")

const route = useRoute()
watch(()=>route.path,()=>{
  defaultActiveMenu.value = route.path
},{
  immediate:true
})

</script>

<style lang="scss" scoped>
.el-menu {
  --el-menu-active-color: #fff;
  --el-menu-hover-bg-color:transparent;
  border: none;
  height: 100%;
  padding-top: 28px;

  .el-menu-item.is-active {
    background-image: url("@/assets/images/menu/nav-menu-img.png");
    background-repeat: round;
  }
}
</style>