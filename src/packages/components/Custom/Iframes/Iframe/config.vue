<template>
  <el-collapse>
    <collapse-item name="配置" :expanded="true">
    <setting-item-box name="地址"  :alone="true">
      <setting-item>
        <el-input v-model="optionData.src" size="small"></el-input>
      </setting-item>
      </setting-item-box>
      <!-- <setting-item-box name="通讯数据"  :alone="true">
        <setting-item>
          <el-input v-model="optionData.dataset" size="small"></el-input>
        </setting-item>
      </setting-item-box> -->

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
