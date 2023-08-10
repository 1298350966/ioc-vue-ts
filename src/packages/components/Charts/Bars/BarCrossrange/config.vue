<template>
  <el-collapse v-model="collapseActive">

    <!-- Echarts 全局设置 -->
    <global-setting :optionData="optionData"></global-setting>

    <el-collapse-item v-for="(item, index) in seriesList" :key="index" :title="`柱状图-${index + 1}`"
      :name="`柱状图-${index + 1}`" :expanded="true">
      <template #title>
        <div class="title-container">
          <span>柱状图-{{ index + 1 }}</span>
          <div>
            <el-icon @click.stop="handleCopy(item, index)">
              <Plus />
            </el-icon>
            <el-icon @click.stop="handleDelete(item, index)">
              <Minus />
            </el-icon>
          </div>
        </div>
      </template>
      <SettingItemBox name="类型">
          <el-select-v2 v-model="item.type" :options="seriesTypeOptions"></el-select-v2>
      </SettingItemBox>
      <SettingItemBox name="图形">
        <SettingItem name="颜色">
          <el-color-picker size="small" v-model="item.itemStyle.color" show-alpha></el-color-picker>
        </SettingItem>
        <SettingItem>
          <el-button size="small" @click="item.itemStyle.color = null">恢复默认</el-button>
        </SettingItem>
        <SettingItem name="宽度">
          <el-input-number v-model="item.barWidth" :min="1" :max="100" size="small" placeholder="自动计算"></el-input-number>
        </SettingItem>
        <SettingItem name="圆角">
          <el-input-number v-model="item.itemStyle.borderRadius" :min="0" size="small"></el-input-number>
        </SettingItem>
      </SettingItemBox>
    </el-collapse-item>
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import { GlobalSetting, CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import { option, seriesItem } from './config'
import { GlobalThemeJsonType } from '@/settings/chartThemes/index'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { cloneDeep, get } from 'lodash'
import { seriesTypeOptions } from '../config'
const props = defineProps<{
  optionData: GlobalThemeJsonType
}>()
const collapseActive = ref([])
const seriesList = computed(() => {
  return props.optionData.series
})

const chartEditStore = useChartEditStore()
const list = chartEditStore.getComponentList
const targetIndex = chartEditStore.fetchTargetIndex()
// const targetData = list[targetIndex]
const targetData = get(list, targetIndex)
function handleCopy(item, index) {
  props.optionData.series.push(cloneDeep(seriesItem))
  let list = props.optionData.series.map((series, index) => {
    return props.optionData.dataset.dimensions[index + 1] || ("data" + (index + 1))
  })
  props.optionData.dataset.dimensions = [props.optionData.dataset.dimensions[0], ...list]
}
function handleDelete(item, index) {
  if (props.optionData.series.length === 1) {
    return window['$message'].error('至少保留一项数据！')
  }
  // 更新目标图表配置项dataset.dimensions、dataset.source、series
  props.optionData.series.splice(index, 1)
  let list = props.optionData.series.map((series, index) => {
    return props.optionData.dataset.dimensions[index + 1] || ("data" + (index + 1))
  })
  props.optionData.dataset.dimensions = [props.optionData.dataset.dimensions[0], ...list]
}
</script>
<style lang="scss" scoped>
.title-container {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding-right: 15px;

  :deep(.el-icon) {
    margin-left: 10px;

  }
}
</style>