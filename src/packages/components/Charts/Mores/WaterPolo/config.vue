<template>
  <el-collapse>
    <CollapseItem
      v-for="(item, index) in seriesList"
      :key="index"
      name="水球"
      :expanded="true"
    >
      <SettingItemBox name="内容">
        <SettingItem name="数值">
          <el-input-number
            v-mode="item.data[0]"
            :min="0"
            :step="0.01"
            size="small"
            placeholder="水球数值"
          ></el-input-number>
        </SettingItem>
        <SettingItem name="形状">
          <el-select v-mode="item.shape" :options="shapes" placeholder="选择形状" />
        </SettingItem>
        <SettingItem name="文本">
          <el-input-number v-mode="item.label.normal.textStyle.fontSize" :min="0" :step="1" size="small" placeholder="文字大小">
          </el-input-number>
        </SettingItem>
        <SettingItem name="颜色1">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-mode="item.color[0].colorStops[0].color"
        ></el-color-picker>
        </SettingItem>
        <SettingItem name="颜色2">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-mode="item.color[0].colorStops[1].color"
        ></el-color-picker>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="背景" :alone="true">
        <SettingItem>
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-mode="item.backgroundStyle.color"
          ></el-color-picker>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { option, shapes } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
})

const seriesList = computed(() => {
  return props.optionData.series
})
</script>
