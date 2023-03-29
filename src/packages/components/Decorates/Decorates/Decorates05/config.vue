<template>
<el-collapse>
  <CollapseItem name="样式" :expanded="true">
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
    <SettingItemBox name="速度(s)">
      <SettingItem>
        <el-input-number
          v-model:value="optionData.dur"
          size="small"
          :step="1"
          :min="2"
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
