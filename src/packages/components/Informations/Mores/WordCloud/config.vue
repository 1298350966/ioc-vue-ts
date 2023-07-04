<template>
  <collapse-item name="词云" expanded>
    <setting-item-box name="形状">
      <setting-item>
        <el-select-v2 v-model="optionData.series[0].shape" size="small" :options="ShapeEnumList" />
      </setting-item>
      <setting-item>
        <el-checkbox v-model:checked="optionData.series[0].drawOutOfBound" size="small">允许出边</el-checkbox>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="布局">
      <setting-item name="宽度">
        <el-slider
          v-model="series.width"
          :min="0"
          :max="100"
          :format-tooltip="sliderFormatTooltip"
          @update:value="updateWidth"
        ></el-slider>
      </setting-item>
      <setting-item name="高度">
        <el-slider
          v-model="series.height"
          :min="0"
          :max="100"
          :format-tooltip="sliderFormatTooltip"
          @update:value="updateHeight"
        ></el-slider>
      </setting-item>
    </setting-item-box>

    <setting-item-box name="样式" alone>
      <setting-item name="字体区间(最小/最大字体)">
        <el-slider v-model="optionData.series[0].sizeRange" range :step="1" :min="6" :max="100" />
      </setting-item>
      <setting-item name="旋转角度">
        <el-slider v-model="series.rotationStep" :step="15" :min="0" :max="45" @update:value="updateRotation" />
      </setting-item>
    </setting-item-box>
  </collapse-item>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { option, ShapeEnumList } from './config'
// eslint-disable-next-line no-unused-vars
// import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const series = computed(() => {
  const { width, height, rotationStep } = props.optionData.series[0]
  return {
    width: +width.replace('%', ''),
    height: +height.replace('%', ''),
    rotationStep
  }
})

const sliderFormatTooltip = (v: number) => {
  return `${v}%`
}

const updateWidth = (value: number) => {
  props.optionData.series[0].width = `${value}%`
}

const updateHeight = (value: number) => {
  props.optionData.series[0].height = `${value}%`
}

const updateRotation = (value: number) => {
  props.optionData.series[0].rotationStep = value
  props.optionData.series[0].rotationRange = value === 0 ? [0, 0] : [-90, 90]
}
</script>
