<template>
  <content-box
    class="kh-content-charts"
    title="组件"
    >
    <div class="charts-menu-box">
      <charts-menu class="charts-menu-1" @menuItemClick="clickItemHandle" :options="menuOptions"></charts-menu>
      <charts-option-content
        class="charts-option-content" 
        v-if="selectOptions"
        :selectOptions="selectOptions"
        :key="selectValue"
      ></charts-option-content>
    </div>
   
  </content-box>
</template>
<script setup lang="ts">
import { ContentBox } from '../ContentBox/index'
import { ChartsMenu } from "./components/ChartsMenu/index"
import { ChartsOptionContent } from './components/ChartsOptionContent'
import {
  getCharts,
  BarChartIcon,
  themeColor,
  selectOptions,
  selectValue,
  clickItemHandle,
  menuOptions,
} from './hooks/useAside.hook'
import { reactive } from 'vue';


</script>
<style lang="scss" scoped>
/* 整体宽度 */
$width: 330px;
/* 列表的宽度 */
$widthScoped: 65px;
/* 此高度与 ContentBox 组件关联 */
$topHeight: 40px;
.kh-content-charts{
   width:$width;
   .charts-menu-box{
    display: flex;
    height: calc(100vh - #{$--header-height} - #{$topHeight} - 2px);
   }
   .charts-menu-1{
    width:$widthScoped;
    background: $--color-dark-bg-2;
    margin-top:1px;
    box-sizing: border-box;
   }

   .charts-option-content{
    flex: 1;
   }
}
</style>