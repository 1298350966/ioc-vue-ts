<template>
  <div>
     <SettingItemBox name="图形样式" v-if="series.itemStyle">
      <SettingItem name="是否启用" >
        <el-switch v-model="series.itemStyle.show" size="small"></el-switch>
      </SettingItem>
      <SettingItem name="边框半径">
        <el-input-number v-model="series.itemStyle.borderRadius" :min="0" size="small"></el-input-number>
      </SettingItem>
      <SettingItem name="边框宽度">
        <el-input-number v-model="series.itemStyle.borderWidth" :min="0" size="small"></el-input-number>
      </SettingItem>
      <SettingItem name="边框颜色">
        <el-color-picker size="small" show-alpha v-model="series.itemStyle.borderColor"></el-color-picker>
      </SettingItem>
     </SettingItemBox>
     <SettingItemBox name="标签"  v-if="series.label">
      <SettingItem name="是否启用">
        <el-switch v-model="series.label.show" size="small"></el-switch>
      </SettingItem>
      <SettingItem name="位置">
        <el-select-v2 v-model="series.label.position" size="small" :options="positionOptions" clearable allow-create
        filterable />
      </SettingItem>
     </SettingItemBox>
     <SettingItemBox name="高亮标签" v-if="series.emphasis && series.emphasis.label">
      <SettingItem name="是否启用">
        <el-switch v-model="series.emphasis.label.show" size="small"></el-switch>
      </SettingItem>
      <SettingItem name="大小">
        <el-input-number v-model="series.emphasis.label.fontSize" :min="0" size="small"></el-input-number>
      </SettingItem>
      <SettingItem name="粗细">
        <el-select-v2 v-model="series.emphasis.label.fontWeight" size="small" :options="fontWeightOptions" clearable allow-create
        filterable />
      </SettingItem>
     </SettingItemBox>
  </div>
</template>

<script setup lang="ts">
import { fontWeightOptions,positionOptions } from './config';

const props = defineProps<{
  series:{
    itemStyle: {
        show: boolean;
        borderRadius: number;
        borderColor: string;
        borderWidth: number;
    }
    label: {
        show: boolean;
        position: string;
    }
    emphasis: {
      label: {
          show: boolean;
          fontSize: string;
          fontWeight: string;
      };
    };
    labelLine: {
      show: boolean;
    }
  }
}>()

</script>

<style scoped>

</style>