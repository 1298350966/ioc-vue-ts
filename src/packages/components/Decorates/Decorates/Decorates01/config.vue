<template>
<el-collapse>
  <CollapseItem name="线条" :expanded="true">
    <SettingItemBox
      :name="`颜色-${index + 1}`"
      v-for="(item, index) in optionData.colors"
      :key="index"
    >
      <SettingItem name="颜色">
        <el-color-picker
          size="small"
          v-model="optionData.colors[index]"
          show-alpha
        ></el-color-picker>
      </SettingItem>
      <SettingItem>
        <el-button
          size="small"
          @click="optionData.colors[index] = option.colors[index]"
        >
          恢复默认
        </el-button>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="具体">
      <SettingItem name="线条高度">
        <el-input-number
          size="small"
          v-model="optionData.lineHeight"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="末端长度">
        <el-input-number
          size="small"
          v-model="optionData.endWidth"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="反转">
         <el-switch v-model="optionData.reverse"></el-switch>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>

  <CollapseItem name="动画" :expanded="true">
    <SettingItemBox name="速度(s)">
      <SettingItem>
        <el-input-number
          v-model="optionData.dur"
          size="small"
          :step="0.5"
          :min="0.5"
        ></el-input-number>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import {
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})
</script>
