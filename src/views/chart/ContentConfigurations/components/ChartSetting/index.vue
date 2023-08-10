<template>
  <div class="go-chart-configurations-setting" v-if="targetData">
    <!-- 名称 -->
    <name-setting :chartConfig="targetData.chartConfig"></name-setting>
    <!-- 尺寸 -->
    <size-setting :isGroup="targetData.isGroup" :chartAttr="targetData.attr"></size-setting>
    <!-- 位置 -->
    <position-setting :chartAttr="targetData.attr" :canvasConfig="chartEditStore.getEditCanvasConfig"/>
    <!-- 内边距 -->
    <paddingSetting :chartStyles="targetData.styles"></paddingSetting>
    <!-- 背景 -->
    <backgroundSetting :chartStyles="targetData.styles"></backgroundSetting>
    <!-- 滤镜 -->
    <styles-setting :isGroup="targetData.isGroup" :chartStyles="targetData.styles"></styles-setting>
    <!-- 自定义配置项 -->
    <component :is="targetData.chartConfig.conKey" :optionData="targetData.option" :targetData="targetData"></component>
    <!-- 组件列表 -->
    <group-list v-if="targetData.isGroup" :targetData="(targetData as CreateComponentGroupType)"></group-list>
  </div>
</template>

<script setup lang="ts">
import { NameSetting, PositionSetting, SizeSetting, StylesSetting, GroupList, backgroundSetting, paddingSetting } from '@/components/Pages/ChartItemSetting'
import { useTargetData } from '../hooks/useTargetData.hook'
import { CreateComponentGroupType } from '@/packages/index.d';
const { targetData, chartEditStore } = useTargetData()

</script>

<style lang="scss" scoped>
@include go('chart-configurations-setting') {
}
</style>
