<template>
<el-collapse>
  <CollapseItem name="内容" :expanded="true">
    <SettingItemBox name="数值">
      <SettingItem name="终点值">
        <el-input-number
          v-model="optionData.dataset"
          size="small"
          :min="1"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="大小">
        <el-input-number
          v-model="optionData.numberSize"
          size="small"
          :min="1"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="精度">
        <el-input-number
          v-model="optionData.precision"
          size="small"
          :min="0"
        ></el-input-number>
      </SettingItem>
      <SettingItem>
        <el-space>
          <el-switch v-model="optionData.showSeparator" size="small" />
          <el-text>展示分割符</el-text>
        </el-space>
      </SettingItem>
    </SettingItemBox>

    <SettingItemBox name="数值">
      <SettingItem name="前缀">
        <el-input v-model="optionData.prefixText" size="small"></el-input>
      </SettingItem>
      <SettingItem name="后缀">
        <el-input v-model="optionData.suffixText" size="small"></el-input>
      </SettingItem>
    </SettingItemBox>

    <SettingItemBox name="颜色">
      <SettingItem name="前缀">
        <el-color-picker
          size="small"
          v-model="optionData.prefixColor"
          show-alpha
        ></el-color-picker>
      </SettingItem>
      <SettingItem name="后缀">
        <el-color-picker
          size="small"
          v-model="optionData.suffixColor"
          show-alpha
        ></el-color-picker>
      </SettingItem>
      <SettingItem name="数值">
        <el-color-picker
          size="small"
          v-model="optionData.numberColor"
          show-alpha
        ></el-color-picker>
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
  SettingItem,
} from '@/components/Pages/ChartItemSetting'
import { option } from './config'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
})
</script>
