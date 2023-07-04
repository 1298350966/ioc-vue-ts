<template>
<el-collapse>
  <CollapseItem name="时钟" expanded>
    <SettingItemBox name="表盘">
      <SettingItem name="背景色">
        <el-color-picker size="small" :modes="['hex']" v-model="optionData.bgColor"></el-color-picker>
      </SettingItem>
      <SettingItem name="边框色">
        <el-color-picker size="small" v-model="optionData.borderColor" show-alpha></el-color-picker>
      </SettingItem>
      <SettingItem name="边框大小">
        <el-input-number v-model="optionData.border" size="small" :step="0.5" :min="0"></el-input-number>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="指针">
      <SettingItem name="颜色">
        <el-color-picker size="small" v-model="optionData.color" show-alpha></el-color-picker>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>
