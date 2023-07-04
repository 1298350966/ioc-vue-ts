<template>
<el-collapse>
  <CollapseItem name="内容" :expanded="true">
    <SettingItemBox name="字体">
      <SettingItem name="大小">
        <el-input-number
          v-model="optionData.timeSize"
          size="small"
          :min="1"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="粗细">
        <el-select-v2
          v-model="optionData.fontWeight"
          size="small"
          :options="fontWeightOptions"
        />
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="间距">
      <SettingItem name="字距">
        <el-input-number
          v-model="optionData.timeTextIndent"
          size="small"
          :min="1"
        ></el-input-number>
      </SettingItem>
      <SettingItem name="行距">
        <el-input-number
          v-model="optionData.timeLineHeight"
          size="small"
          :min="1"
        ></el-input-number>
      </SettingItem>
    </SettingItemBox>

    <SettingItemBox name="颜色">
      <SettingItem name="时间">
        <el-color-picker
          size="small"
          v-model="optionData.timeColor"
          show-alpha
        ></el-color-picker>
      </SettingItem>
    </SettingItemBox>
    <SettingItemBox name="阴影">
      <SettingItem>
        <el-space>
          <el-switch v-model="optionData.showShadow" size="small" />
          <el-text>展示阴影</el-text>
        </el-space>
      </SettingItem>
      <SettingItem name="x">
        <el-input-number v-model="optionData.hShadow" size="small"></el-input-number
      ></SettingItem>
      <SettingItem name="y">
        <el-input-number v-model="optionData.vShadow" size="small"></el-input-number
      ></SettingItem>
      <SettingItem name="模糊">
        <el-input-number
          v-model="optionData.blurShadow"
          size="small"
        ></el-input-number
      ></SettingItem>
      <SettingItem name="颜色">
        <el-color-picker
          size="small"
          v-model="optionData.colorShadow"
          show-alpha
        ></el-color-picker
      ></SettingItem>
    </SettingItemBox>
  </CollapseItem>
</el-collapse>
</template>
<script setup lang="ts">
import { PropType } from "vue";
import {
  CollapseItem,
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { option, FontWeightEnum, FontWeightObject } from "./config";

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
const fontWeightOptions = [
  {
    label: FontWeightEnum.NORMAL,
    value: FontWeightObject[FontWeightEnum.NORMAL],
  },
  {
    label: FontWeightEnum.BOLD,
    value: FontWeightObject[FontWeightEnum.BOLD],
  },
];
</script>
