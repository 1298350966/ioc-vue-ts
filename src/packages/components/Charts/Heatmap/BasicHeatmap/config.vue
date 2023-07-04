<template>
  <el-collapse>
    <global-setting :optionData="optionData"></global-setting>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed } from 'vue'
import { GlobalSetting } from '@/components/Pages/ChartItemSetting'
import { option } from './config'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'

const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option & GlobalThemeJsonType>,
    required: true
  }
})

const heatMapConfig = computed<typeof option>(() => {
  return props.optionData
})
</script>
