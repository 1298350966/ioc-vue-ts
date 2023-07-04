<template>
  <el-collapse>
    <!-- Echarts 全局设置 -->
    <global-setting :optionData="optionData"></global-setting>
    <CollapseItem name="雷达" :expanded="true">
      <SettingItemBox name="样式">
        <SettingItem>
          <el-checkbox v-model:checked="radarConfig.splitArea.show">背景</el-checkbox>
        </SettingItem>
        <SettingItem>
          <el-checkbox v-model:checked="radarConfig.splitLine.show">分割线</el-checkbox>
        </SettingItem>
        <SettingItem name="雷达形状">
          <el-select-v2 v-model="radarConfig.shape" size="small" :options="RadarShapeEnumList" placeholder="选择形状" />
        </SettingItem>
      </SettingItemBox>

      <SettingItemBox name="坐标轴">
        <SettingItem>
          <el-checkbox v-model:checked="radarConfig.axisLine.show">轴线</el-checkbox>
        </SettingItem>
        <SettingItem>
          <el-checkbox v-model:checked="radarConfig.axisTick.show">刻度</el-checkbox>
        </SettingItem>
      </SettingItemBox>

      <SettingItemBox name="范围">
        <setting-item :name="`最小值：${radarProp.radius[0]}%`">
          <el-slider v-model="radarProp.radius[0]" :min="0" :max="100" :format-tooltip="sliderFormatTooltip"
            @update:value="updateRadius0"></el-slider>
        </setting-item>
        <setting-item :name="`最大值：${radarProp.radius[1]}%`">
          <el-slider v-model="radarProp.radius[1]" :min="0" :max="100" :format-tooltip="sliderFormatTooltip"
            @update:value="updateRadius1"></el-slider>
        </setting-item>
      </SettingItemBox>

      <SettingItemBox name="偏移">
        <setting-item :name="`X 轴值：${radarProp.center[0]}%`">
          <el-slider v-model="radarProp.center[0]" :min="0" :max="100" :format-tooltip="sliderFormatTooltip"
            @update:value="updateCenter0"></el-slider>
        </setting-item>
        <setting-item :name="`Y 轴值：${radarProp.center[1]}%`">
          <el-slider v-model="radarProp.center[1]" :min="0" :max="100" :format-tooltip="sliderFormatTooltip"
            @update:value="updateCenter1"></el-slider>
        </setting-item>
      </SettingItemBox>

      <SettingItemBox name="指示器">
        <SettingItem name="颜色">
          <el-color-picker size="small" v-model="radarConfig.axisName.color" show-alpha></el-color-picker>
        </SettingItem>
        <SettingItem name="大小">
          <el-input-number v-model="radarConfig.axisName.fontSize" size="small" :min="9"></el-input-number>
        </SettingItem>
        <SettingItem>
          <el-checkbox v-model:checked="radarConfig.axisName.show">文字标签</el-checkbox>
        </SettingItem>
      </SettingItemBox>

      <SettingItemBox name="系列" :alone="true">
        <SettingItem name="背景透明度">
          <el-input-number v-model="optionData.series[0].areaStyle.opacity" size="small" :min="0" :max="1"
            :step="0.1"></el-input-number>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed, reactive } from 'vue'
import { GlobalSetting, CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option, RadarShapeEnumList } from './config'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option & GlobalThemeJsonType>,
    required: true
  }
})

const radarConfig = computed<typeof option.radar>(() => {
  return props.optionData.radar
})

const radarProp = reactive({
  radius: [0, 60],
  center: [50, 50]
})

// 更新处理
const updateRadius0 = (value: number) => {
  props.optionData.radar.radius[0] = `${value}%`
}

const updateRadius1 = (value: number) => {
  props.optionData.radar.radius[1] = `${value}%`
}

// 更新处理
const updateCenter0 = (value: number) => {
  props.optionData.radar.center[0] = `${value}%`
}

const updateCenter1 = (value: number) => {
  props.optionData.radar.center[1] = `${value}%`
}

// 百分比格式化 percent
const sliderFormatTooltip = (v: number) => {
  return `${v}%`
}
</script>
