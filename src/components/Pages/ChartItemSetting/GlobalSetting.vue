<template>
  <el-collapse-item v-if="title" title="标题" name="标题">
    <template #title>
      <el-space class="kh-flex-between flex-1">
        <span>标题</span>
        <el-switch @click.stop v-model="title.show" size="small"></el-switch>
      </el-space>
    </template>
    <setting-item-box name="标题">
      <setting-item name="颜色">
        <n-color-picker v-model="title.textStyle.color" size="small"></n-color-picker>
      </setting-item>
      <setting-item name="大小">
        <n-input-number v-model="title.textStyle.fontSize" :min="1" size="small"></n-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="副标题">
      <setting-item name="颜色">
        <n-color-picker size="small" v-model="title.subtextStyle.color"></n-color-picker>
      </setting-item>
      <setting-item name="大小">
        <n-input-number v-model="title.subtextStyle.fontSize" :min="1" size="small"></n-input-number>
      </setting-item>
    </setting-item-box>
  </el-collapse-item>

  <el-collapse-item v-if="xAxis" title="X轴" name="X轴">
    <template #title>
      <el-space class="kh-flex-between flex-1">
        <span>X轴</span>
        <el-switch @click.stop v-model="xAxis.show" size="small"></el-switch>
      </el-space>
    </template>
    <setting-item-box name="单位">
      <setting-item name="名称">
        <el-input v-model="xAxis.name" size="small"></el-input>
      </setting-item>
      <setting-item name="颜色">
        <el-color-picker size="small" v-model="xAxis.nameTextStyle.color"></el-color-picker>
      </setting-item>
      <setting-item name="大小">
        <el-input-number v-model="xAxis.nameTextStyle.fontSize" :min="12" size="small"></el-input-number>
      </setting-item>
      <setting-item name="偏移量">
        <el-input-number v-model="xAxis.nameGap" :min="5" size="small"></el-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="标签">
      <setting-item name="展示">
        <el-space>
          <el-switch v-model="xAxis.axisLabel.show" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="颜色">
        <el-color-picker size="small" v-model="xAxis.axisLabel.color"></el-color-picker>
      </setting-item>
      <setting-item name="大小">
        <el-input-number v-model="xAxis.axisLabel.fontSize" :min="8" size="small"></el-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="轴线">
      <setting-item name="展示">
        <el-space>
          <el-switch v-model="xAxis.axisLine.show" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="颜色">
        <el-color-picker v-model="xAxis.axisLine.lineStyle.color" size="small"></el-color-picker>
      </setting-item>
      <setting-item name="粗细">
        <el-input-number v-model="xAxis.axisLine.lineStyle.width" :min="1" size="small"></el-input-number>
      </setting-item>
      <setting-item name="位置">
        <el-select-v2 v-model="xAxis.position" size="small" :options="axisConfig.xposition"></el-select-v2>
      </setting-item>
      <setting-item name="对齐零">
        <el-space>
          <el-switch v-model="xAxis.axisLine.onZero" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="反向">
        <el-space>
          <el-switch v-model="xAxis.inverse" size="small"></el-switch>
        </el-space>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="刻度">
      <setting-item name="展示">
        <el-space>
          <el-switch v-model="xAxis.axisTick.show" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="长度">
        <el-input-number v-model="xAxis.axisTick.length" :min="1" size="small"></el-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="分割线">
      <setting-item name="展示">
        <el-space>
          <el-switch v-model="xAxis.splitLine.show" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="颜色">
        <el-color-picker v-model="xAxis.splitLine.lineStyle.color" size="small"></el-color-picker>
      </setting-item>
      <setting-item name="粗细">
        <el-input-number v-model="xAxis.splitLine.lineStyle.width" :min="1" size="small"></el-input-number>
      </setting-item>
      <setting-item name="类型">
        <el-select-v2
          v-model="xAxis.splitLine.lineStyle.type"
          size="small"
          :options="axisConfig.splitLint.lineStyle.type"
        ></el-select-v2>
      </setting-item>
    </setting-item-box>
  </el-collapse-item>

  <el-collapse-item v-if="yAxis" name="Y轴">
    <template #title>
      <el-space class="kh-flex-between flex-1">
        <span>Y轴</span>
        <el-switch @click.stop v-model="yAxis.show" size="small"></el-switch>
      </el-space>
    </template>
    <setting-item-box name="单位">
      <setting-item name="名称">
        <el-input v-model="yAxis.name" size="small"></el-input>
      </setting-item>
      <setting-item name="颜色">
        <el-color-picker size="small" v-model="yAxis.nameTextStyle.color"></el-color-picker>
      </setting-item>
      <setting-item name="大小">
        <el-input-number v-model="yAxis.nameTextStyle.fontSize" :min="8" size="small"></el-input-number>
      </setting-item>
      <setting-item name="偏移量">
        <el-input-number v-model="yAxis.nameGap" :min="5" size="small"></el-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="标签">
      <setting-item name="展示">
        <el-space>
          <el-switch v-model="yAxis.axisLabel.show" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="颜色">
        <el-color-picker size="small" v-model="yAxis.axisLabel.color"></el-color-picker>
      </setting-item>
      <setting-item name="大小">
        <el-input-number v-model="yAxis.axisLabel.fontSize" :min="8" size="small"></el-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="轴线">
      <setting-item name="展示">
        <el-space>
          <el-switch v-model="yAxis.axisLine.show" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="颜色">
        <el-color-picker v-model="yAxis.axisLine.lineStyle.color" size="small"></el-color-picker>
      </setting-item>
      <setting-item name="粗细">
        <el-input-number v-model="yAxis.axisLine.lineStyle.width" :min="1" size="small"></el-input-number>
      </setting-item>
      <setting-item name="位置">
        <el-select-v2 v-model="yAxis.position" size="small" :options="axisConfig.yposition"></el-select-v2>
      </setting-item>
      <setting-item name="对齐零">
        <el-space>
          <el-switch v-model="yAxis.axisLine.onZero" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="反向">
        <el-space>
          <el-switch v-model="yAxis.inverse" size="small"></el-switch>
        </el-space>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="刻度">
      <setting-item name="展示">
        <el-space>
          <el-switch v-model="yAxis.axisTick.show" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="长度">
        <el-input-number v-model="yAxis.axisTick.length" :min="1" size="small"></el-input-number>
      </setting-item>
    </setting-item-box>
    <setting-item-box name="分割线">
      <setting-item name="展示">
        <el-space>
          <el-switch v-model="yAxis.splitLine.show" size="small"></el-switch>
        </el-space>
      </setting-item>
      <setting-item name="颜色">
        <el-color-picker v-model="yAxis.splitLine.lineStyle.color" size="small"></el-color-picker>
      </setting-item>
      <setting-item name="粗细">
        <el-input-number v-model="yAxis.splitLine.lineStyle.width" :min="1" size="small"></el-input-number>
      </setting-item>
      <setting-item name="类型">
        <el-select-v2
          v-model="yAxis.splitLine.lineStyle.type"
          size="small"
          :options="axisConfig.splitLint.lineStyle.type"
        ></el-select-v2>
      </setting-item>
    </setting-item-box>
  </el-collapse-item>

  <el-collapse-item v-if="legend" name="图例">
    <template #title>
      <el-space class="kh-flex-between flex-1">
        <span>图例</span>
        <el-switch @click.stop v-model="legend.show" size="small"></el-switch>
      </el-space>
    </template>
    <setting-item-box name="图例文字">
      <setting-item>
        <el-color-picker size="small" v-model="legend.textStyle.color"></el-color-picker>
      </setting-item>
    </setting-item-box>
  </el-collapse-item>

  <el-collapse-item v-if="visualMap" name="视觉映射">
    <template #title>
      <el-space class="kh-flex-between flex-1">
        <span>视觉映射</span>
        <el-switch @click.stop v-model="visualMap.show" size="small"></el-switch>
      </el-space>
    </template>

    <setting-item-box name="范围">
      <setting-item name="最小值">
        <n-input-number v-model="visualMap.min" size="small"></n-input-number>
      </setting-item>
      <setting-item name="最大值">
        <n-input-number v-model="visualMap.max" size="small"></n-input-number>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="颜色">
      <setting-item :name="`层级-${index + 1}`" v-for="(item, index) in visualMap.inRange.color" :key="index">
        <n-color-picker v-model="visualMap.inRange.color[index]" size="small"></n-color-picker>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="控制块">
      <setting-item name="放置方向">
        <n-select v-model="visualMap.orient" size="small" :options="axisConfig.visualMap.orient"></n-select>
      </setting-item>
      <setting-item name="宽度">
        <n-input-number v-model="visualMap.itemWidth" :min="5" size="small"></n-input-number>
      </setting-item>
      <setting-item name="高度">
        <n-input-number v-model="visualMap.itemHeight" :min="5" size="small"></n-input-number>
      </setting-item>
      <setting-item name="反转">
        <n-space>
          <n-switch v-model="visualMap.inverse" size="small"></n-switch>
        </n-space>
      </setting-item>
      <setting-item name="拖拽组件实时更新">
        <n-space>
          <n-switch v-model="visualMap.realtime" size="small"></n-switch>
        </n-space>
      </setting-item>
    </setting-item-box>
    <global-setting-position :targetData="visualMap"></global-setting-position>
  </el-collapse-item>
</template>

<script setup lang="ts" name="GlobalSetting">
import { PropType, computed } from 'vue'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import { axisConfig } from '@/packages/chartConfiguration/echarts/index'
import { CollapseItem, SettingItemBox, SettingItem, GlobalSettingPosition } from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  },
  inChart: {
    type: Boolean,
    required: false,
    default: false
  }
})

const title = computed(() => {
  return props.optionData.title
})

const xAxis = computed(() => {
  return props.optionData.xAxis
})

const yAxis = computed(() => {
  return props.optionData.yAxis
})

const legend = computed(() => {
  return props.optionData.legend
})

const visualMap = computed(() => {
  return props.optionData.visualMap
})
</script>
