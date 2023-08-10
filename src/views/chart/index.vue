<template>
  <el-container class="kh-chart" direction="vertical">
    <chartHeader>
      <template #left>
        <header-left-btn></header-left-btn>
      </template>
      <template #center>
        <header-title></header-title>
      </template>
      <template #right>
        <header-right-btn></header-right-btn>
      </template>
    </chartHeader>
    <el-main style="padding: 0; overflow: hidden; display: flex">
      <LeftSideBar></LeftSideBar>
      <!-- <content-charts></content-charts> -->
      <!-- <content-layers></content-layers> -->
      <ContentConfigurations></ContentConfigurations>
    </el-main>
  </el-container>
  <Contextmenu
    v-show="chartEditStore.getRightMenuShow"
    :axis="mousePosition"
    :menus="menuOptions"
    :remove-contextmenu="onClickOutSide"
    @select="handleMenuSelect"
  ></Contextmenu>
</template>

<script lang="ts" setup>
import { loadAsyncComponent } from "@/utils";
import { useContextMenu } from "./hooks/useContextMenu.hook";
import { useStoreInfo } from "./hooks/useStorageInfo.hook";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import ContentConfigurations from "./ContentConfigurations/index.vue"
// import {ContentLayers} from "./ContentLayers/index"
// import {ContentCharts} from "./ContentCharts/index"
import LeftSideBar from "./LeftSideBar/index.vue";
// import chartHeader from "./chartHeader/index.vue"
import headerLeftBtn from "./chartHeader/headerLeftBtn.vue"
// import headerTitle from "./chartHeader/headerTitle.vue"
// import headerRightBtn from "./chartHeader/headerRightBtn.vue"
// import 'element-plus/theme-chalk/dark/css-vars.css'

import "./style/vars.scss";

//设置数据
useStoreInfo()  

const chartHeader = loadAsyncComponent(() => import("./chartHeader/index.vue"));
// const headerLeftBtn = loadAsyncComponent(
//   () => import("./chartHeader/headerLeftBtn.vue")
// );
const headerTitle = loadAsyncComponent(
  () => import("./chartHeader/headerTitle.vue")
);
const headerRightBtn = loadAsyncComponent(
  () => import("./chartHeader/headerRightBtn.vue")
);
// const ContentLayers = loadAsyncComponent(() => import('./ContentLayers/index.vue'))
const ContentCharts = loadAsyncComponent(
  () => import("./ContentCharts/index.vue")
);
// const ContentConfigurations = loadAsyncComponent(
//   () => import("./ContentConfigurations/index.vue")
// );
// const LeftSideBar = loadAsyncComponent(() => import("./LeftSideBar/index.vue"))

const chartEditStore = useChartEditStore();

// 右键
const { menuOptions, onClickOutSide, mousePosition, handleMenuSelect } =
  useContextMenu();


</script>


<style lang="scss" scoped>
.kh-chart {
  --kh-color: #18181c;
  color: $--color-light-bg-5;
  background: var(--bg-color);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-size: 12px;
}
</style>
