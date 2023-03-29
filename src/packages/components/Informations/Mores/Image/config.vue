<template>
  <el-collapse>
    <collapse-item name="属性" :expanded="true">
      <setting-item-box name="路径" :alone="true">
        <setting-item>
          <el-input v-model="optionData.dataset" size="small"></el-input>
        </setting-item>
      </setting-item-box>
      <setting-item-box name="样式">
        <setting-item name="类型">
          <el-select-v2
            v-model="optionData.fit"
            size="small"
            :options="fitList"
          ></el-select-v2>
        </setting-item>
        <setting-item name="圆角">
          <el-input-number
            v-model="optionData.borderRadius"
            size="small"
            :min="0"
            placeholder="圆角"
          ></el-input-number>
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
  SettingItem,
} from '@/components/Pages/ChartItemSetting'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
})

// 适应类型
const fitList = [
  {
    value: 'fill',
    label: 'fill'
  },
  {
    value: 'contain',
    label: 'contain'
  },
  {
    value: 'cover',
    label: 'cover'
  },
  {
    value: 'scale-down',
    label: 'scale-down'
  },
  {
    value: 'none',
    label: 'none'
  },
]
</script>
