<template>
  <el-container class="home">
    <el-header>
      <LayoutHeader></LayoutHeader>
    </el-header>
    <el-container>
      <el-aside width="240px">
        <LayoutAside></LayoutAside>
      </el-aside>
      <el-main>
        <el-scrollbar wrap-class="scrollbar-box">
           <LayoutMain></LayoutMain>
        </el-scrollbar>
      </el-main>
    </el-container>
  </el-container>
</template>

<script setup lang="ts">
import { LayoutMain } from '../components/LayoutMain';
import LayoutHeader from "./LayoutHeader.vue"
import LayoutAside from "./LayoutAside.vue"
</script>

<style lang="scss" scoped>

.home {
  height: 100vh;
  /* background-color: #fff; */
  // background-image: url("@/assets/images/layout/nav-img.png");

  // background-repeat: no-repeat;
  // background-size: contain;

  .el-header {
    // background-color: var(--bg-color-4);
    // height: 200px;
    position: relative;
    border-bottom: 1px solid var(--el-border-color);
    // height: var(--header-height);
    padding: 0 ;
    background-image: radial-gradient(transparent 1px,var(--el-bg-color) 1px);
    background-size: 4px 4px;
    backdrop-filter: saturate(50%) blur(4px);

    top: 0;
  }

  .el-aside {
    // background-color: var(--bg-color-3);
    background-image: radial-gradient(transparent 1px,var(--el-bg-color) 1px);
  }

  :deep(.el-main) {
    padding: 0;
    overflow: hidden;

    .scrollbar-box {
      padding-left: 20px;
      padding-right: 20px;
      padding-top: 30px;
    }
  }

  .el-container {
    overflow: hidden;
  }
}
</style>