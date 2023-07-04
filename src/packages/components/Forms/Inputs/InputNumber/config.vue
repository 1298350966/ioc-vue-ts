<template>
  <el-collapse>
    <collapse-item name="配置" :expanded="true">
    <setting-item-box name="默认值"  :alone="true">
      <setting-item>
        <el-input-number v-model="optionData.modelValue" size="small"></el-input-number>
        <!-- <el-input v-model="optionData.modelValue" size="small"></el-input> -->
      </setting-item>
    </setting-item-box>
      <setting-item-box name="范围">
        <setting-item name="最大值">
          <el-input-number v-model="optionData.attrs.max" size="small" placeholder="内容长度"></el-input-number>
        </setting-item>
        <setting-item name="最小值">
          <el-input-number v-model="optionData.attrs.min" size="small" placeholder="内容长度"></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box>
        <setting-item name="步长">
          <el-input-number v-model="optionData.attrs.step" size="small" placeholder="内容长度"></el-input-number>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="开关">
        <setting-item name="是否使用控制按钮">
          <el-switch v-model="optionData.attrs.controls" />
        </setting-item>
        <setting-item name="控制按钮位置" v-if="optionData.attrs.controls">
          <el-select-v2 v-model="optionData.attrs.controlsPosition" size="small" :options="controlsPositionOptions" />
        </setting-item>
      </setting-item-box>
      <setting-item-box  :alone="true">
        <setting-item name="是否禁用">
          <el-switch v-model="optionData.attrs.disabled" />
        </setting-item>
      </setting-item-box>
    </collapse-item>

    <collapse-item name="样式" :expanded="true">
      <setting-item-box name="控件尺寸"  :alone="true">
          <setting-item>
            <el-select-v2 v-model="optionData.attrs.size" size="small" :options="sizeOptions" />
          </setting-item>
      </setting-item-box>
      <input-style-setting v-model:styleOptions = "optionData.style" />
    </collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref,PropType } from 'vue'
import { option } from './config'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'
import{ InputStyleSetting }from '@/components/Pages/FormItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const sizeOptions = [
  { label: '小号', value: 'small' },
  { label: '默认', value: 'default' },
  { label: '大号', value: 'large' }
]

const controlsPositionOptions = [
  {label:'default',value:''},
  {label:'right',value:'right'},
]
</script>
