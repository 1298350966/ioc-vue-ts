<template>
  <el-collapse v-model="collapseActiveList">
  <!-- Echarts 全局设置 -->
  <global-setting :optionData="optionData"></global-setting>
  <CollapseItem
    v-for="(item, index) in seriesList"
    :key="index"
    :name="`折线图-${index + 1}`"
    :expanded="true"
  >
    <SettingItemBox name="线条">
      <SettingItem name="宽度">
        <el-input-number
          v-model="item.lineStyle.width"
          :min="1"
          :max="100"
          size="small"
          placeholder="自动计算"
       ></el-input-number>
      </SettingItem>
      <SettingItem name="类型">
      <el-select-v2
        v-model="item.lineStyle.type"
        size="small"
        :options="lineConf.lineStyle.type"
      >
      </el-select-v2>
      </SettingItem>
    </SettingItemBox>
  </CollapseItem>
</el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import { lineConf } from '@/packages/chartConfiguration/echarts/index'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import {
  GlobalSetting,
  CollapseItem,
  SettingItemBox,
  SettingItem
} from '@/components/Pages/ChartItemSetting'

const collapseActiveList = ref([])

const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalThemeJsonType>,
    required: true
  }
})

const seriesList = computed(() => {
  return props.optionData.series
})
</script>
