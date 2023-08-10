<template>
  <!-- :class="{ scoped: !getCharts }" -->
  <content-box
    class="kh-content-charts"
    title="组件模板"
    >
    <div class="charts-menu-box" >
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
   @extend .kh-transition;
    &.scoped,
    .menu-width {
      width: $widthScoped;
    }
   .charts-menu-box{
    display: flex;
    height: calc(100vh - #{$--header-height} - #{$topHeight} - 2px);
    .menu-width {
      flex-shrink: 0;
    }
    .menu-component-box {
      flex-shrink: 0;
      width: $width - $widthScoped;
      overflow: hidden;
    } 
  }
   .charts-menu-1{
    width:$widthScoped;
    background: var(--bg-color-3);
    margin-top:1px;
    box-sizing: border-box;
    // overflow: hidden;
   }

   .charts-option-content{
    flex: 1;
    overflow: hidden;
   }
}
</style>