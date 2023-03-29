<template>
  <el-collapse>
    <CollapseItem name="边框" :expanded="true">
      <SettingItemBox
        :name="`颜色-${index + 1}`"
        v-for="(item, index) in optionData.colors"
        :key="index"
      >
        <SettingItem name="颜色">
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="optionData.colors[index]"
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
    </CollapseItem>
    <CollapseItem name="动画" :expanded="true">
      <SettingItemBox name="设置">
        <SettingItem name="速度(s)">
          <el-input-number
            v-model="optionData.dur"
            size="small"
            :step="0.5"
            :min="0.5"
          ></el-input-number>
        </SettingItem>
        <SettingItem>
          <el-space>
            <el-switch size="small" v-model="optionData.reverse" />
            <el-text>开启反向</el-text>
          </el-space>
        </SettingItem>
      </SettingItemBox>
    </CollapseItem>
    <CollapseItem name="背景" :expanded="true">
      <SettingItemBox name="颜色">
        <SettingItem>
          <el-color-picker
            size="small"
            :modes="['hex']"
            v-model="optionData.backgroundColor"
          ></el-color-picker>
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
