<template>
<el-collapse>
  <CollapseItem name="列表" :expanded="true">
    <SettingItemBox name="基础">
      <SettingItem name="表行数">
        <el-input-number
          v-model="optionData.rowNum"
          :min="1"
          size="small"
          placeholder="请输入自动计算"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="轮播时间(s)">
        <el-input-number
          v-model="optionData.waitTime"
          :min="1"
          size="small"
          placeholder="请输入轮播时间"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="数值单位">
        <el-input
          v-model="optionData.unit"
          size="small"
          placeholder="数值单位"
        ></el-input>
      </SettingItem>
    </SettingItemBox>

    <SettingItemBox name="样式">
      <SettingItem name="主体颜色">
        <el-color-picker
          size="small"
          v-model="optionData.color"
          show-alpha
        ></el-color-picker>
      </SettingItem>
      <SettingItem name="数据颜色">
        <el-color-picker
          size="small"
          v-model="optionData.textColor"
          show-alpha
        ></el-color-picker>
      </SettingItem>
      <SettingItem name="底部线条">
        <el-color-picker
          size="small"
          v-model="optionData.borderColor"
          show-alpha
        ></el-color-picker>
      </SettingItem>
    </SettingItemBox>

    <SettingItemBox name="字体样式">
       <SettingItem name="序号字体">
        <el-input-number
          size="small"
          v-model="optionData.indexFontSize"
          :min="12"
        />
      </SettingItem>
      <SettingItem name="左侧数据字体">
        <el-input-number
          size="small"
          v-model="optionData.leftFontSize"
          :min="12"
        />
      </SettingItem>
      <SettingItem name="右侧数据字体">
        <el-input-number
          size="small"
          v-model="optionData.rightFontSize"
          :min="12"
        />
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
