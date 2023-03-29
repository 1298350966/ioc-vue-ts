<template>
  <!-- Echarts 全局设置 -->
  <el-collapse>
    <global-setting :optionData="optionData"></global-setting>
    <CollapseItem
      v-for="(item, index) in seriesList"
      :key="index"
      :name="`样式`"
      :expanded="true"
    >
      <SettingItemBox name="线条">
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="item.lineStyle.color.colorStops[0].color"
        ></el-color-picker>
        </SettingItem>
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="item.lineStyle.color.colorStops[1].color"
        ></el-color-picker>
        </SettingItem>
        <SettingItem name="宽度">
          <el-input-number
            v-model="item.lineStyle.width"
            :min="1"
            :max="100"
            size="small"
            placeholder="自动计算"
        ></el-input-number>
        </SettingItem>
        <SettingItem name="类型">
          <el-select-v2
            v-model="item.lineStyle.type"
            size="small"
            :options="lineConf.lineStyle.type"
        ></el-select-v2>
        </SettingItem>
      </SettingItemBox>
      <SettingItemBox name="阴影" :alone="true">
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="item.lineStyle.shadowColor"
        ></el-color-picker>
        </SettingItem>
        
      </SettingItemBox>
      <SettingItemBox name="设置">
      <SettingItem name="阴影">
          <el-button
            size="small"
            @click="item.lineStyle.shadowColor = 'rgba(0, 0, 0, 0)'"
          >
            去除阴影
          </el-button>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { lineConf } from '@/packages/chartConfiguration/echarts/index'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import {
  GlobalSetting,
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})

const seriesList = computed(() => {
  return props.optionData.series
})
</script>
