<template>
  <el-collapse>
    <collapse-item name="信息" :expanded="true">
      <setting-item-box name="文字" :alone="true">
        <setting-item>
          <el-input v-model="optionData.dataset" size="small"></el-input>
        </setting-item>
      </setting-item-box>
    </collapse-item>
    <collapse-item name="样式" :expanded="true">
      <setting-item-box name="文字">
        <setting-item name="字体大小">
          <el-input-number v-model="optionData.size" size="small" placeholder="字体大小"></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="渐变色参数">
        <setting-item name="起始值">
          <el-color-picker size="small" v-model="optionData.gradient.from" show-alpha></el-color-picker>
        </setting-item>
        <setting-item name="结束值">
          <el-color-picker size="small" v-model="optionData.gradient.to" show-alpha></el-color-picker>
        </setting-item>
        <setting-item name="偏移角度">
          <el-input-number v-model="optionData.gradient.deg" size="small" placeholder="颜色旋转"></el-input-number>
        </setting-item>
      </setting-item-box>
    </collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>
