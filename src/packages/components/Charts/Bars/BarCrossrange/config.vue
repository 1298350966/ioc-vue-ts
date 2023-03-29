<template>
  <el-collapse v-model="collapseActive">

  <!-- Echarts 全局设置 --> 
  <global-setting :optionData="optionData"></global-setting>
  
  <el-collapse-item  v-for="(item, index) in seriesList" :key="index" :title="`柱状图-${index+1}`" :name="`柱状图-${index+1}`" :expanded="true">
    <SettingItemBox name="图形">
      <SettingItem name="颜色">
        <el-color-picker size="small" :modes="['hex']" v-model:value="item.itemStyle.color"></el-color-picker>
      </SettingItem>
      <SettingItem>
        <el-button size="small" @click="item.itemStyle.color = null">恢复默认</el-button>
      </SettingItem>
      <SettingItem name="宽度">
          <el-input-number
          v-model:value="item.barWidth"
          :min="1"
          :max="100"
          size="small"
          placeholder="自动计算"
       ></el-input-number>
      </SettingItem>
      <SettingItem name="圆角">
          <el-input-number
          v-model:value="item.itemStyle.borderRadius"
          :min="0"
          size="small"
       ></el-input-number>
      </SettingItem>
    </SettingItemBox>
  </el-collapse-item>
</el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import { GlobalSetting, CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})
const collapseActive = ref([])
const seriesList = computed(() => {
  return props.optionData.series
})
</script>
