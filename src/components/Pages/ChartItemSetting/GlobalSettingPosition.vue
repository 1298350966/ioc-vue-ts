<template>
  <setting-item-box name="位置">
    <setting-item :name="`偏移 X：${props.targetData.left || 0}px`">
      <el-input-number v-model="props.targetData.left" size="small" :step="10"></el-input-number>
    </setting-item>
    <setting-item :name="`偏移 Y：${props.targetData.top || 0}px`">
      <el-input-number v-model="props.targetData.top" size="small" :step="10"></el-input-number>
    </setting-item>
  </setting-item-box>
</template>

<script setup lang="ts">
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'

type positionType = {
  top?: number  
  left?: number 
  right?: number  
  bottom?: number 
}

const props = defineProps<{
  targetData:positionType
}>()
</script>
