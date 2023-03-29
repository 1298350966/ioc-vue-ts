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
      <el-main style="padding:0;overflow:hidden; display: flex;">
        <content-charts></content-charts>
        <content-layers></content-layers>
        <ContentConfigurations></ContentConfigurations>
      </el-main>
    </el-container>
</template>

<script lang="ts" setup>
import { loadAsyncComponent } from '@/utils'
import ContentConfigurations from "./ContentConfigurations/index.vue"
import {ContentLayers} from "./ContentLayers/index"
import {ContentCharts} from "./ContentCharts/index"
import chartHeader from "./chartHeader/index.vue"
import headerLeftBtn from "./chartHeader/headerLeftBtn.vue"
import headerTitle from "./chartHeader/headerTitle.vue"
import headerRightBtn from "./chartHeader/headerRightBtn.vue"
import "./style/vars.scss"
import 'element-plus/theme-chalk/dark/css-vars.css'
// const chartHeader = loadAsyncComponent(() => import("./chartHeader/index.vue"))
// const headerLeftBtn = loadAsyncComponent(() => import("./chartHeader/headerLeftBtn.vue"))
// const headerTitle = loadAsyncComponent(() => import("./chartHeader/headerTitle.vue"))
// const headerRightBtn = loadAsyncComponent(() => import("./chartHeader/headerRightBtn.vue"))


</script>
<style lang="scss" scoped>
.kh-chart{
  --kh-color:#18181c;
  color: $--color-light-bg-5;
  background: var(--bg);
  height: 100vh;
  width: 100vw;
  overflow: hidden;
  font-size: 12px;
}
</style>