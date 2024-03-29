<template>
  <v-chart :theme="themeColor" :option="option.value" autoresize></v-chart>
</template>

<script setup lang="ts">
import { PropType, watch, reactive } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import 'echarts-liquidfill/src/liquidFill.js'
import { CanvasRenderer } from 'echarts/renderers'
import { GridComponent } from 'echarts/components'
import config, { Events } from './config'
import { isPreview, isString } from '@/utils'
import { chartColorsSearch, defaultTheme } from '@/settings/chartThemes/index'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useChartDataFetch } from '@/hooks'
import { useAddEvent } from '@/packages/hooks/useAddEvent.kooks'

const props = defineProps({
  themeSetting: {
    type: Object,
    required: true
  },
  themeColor: {
    type: Object,
    required: true
  },
  chartConfig: {
    type: Object as PropType<config>,
    required: true
  }
})

const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events)

use([CanvasRenderer, GridComponent])

const chartEditStore = useChartEditStore()

const option = reactive({
  value: {}
})

// 渐变色处理
watch(
  () => rootConfig.editCanvasConfig.chartThemeColor,
  (newColor: keyof typeof chartColorsSearch) => {
    if (!isPreview()) {
      const themeColor = chartColorsSearch[newColor] || chartColorsSearch[defaultTheme]
      // 背景颜色
      props.chartConfig.option.series[0].backgroundStyle.color = themeColor[2]
      // 水球颜色
      props.chartConfig.option.series[0].color[0].colorStops = [
        {
          offset: 0,
          color: themeColor[0]
        },
        {
          offset: 1,
          color: themeColor[1]
        }
      ]
    }
    option.value = props.chartConfig.option
  },
  {
    immediate: true
  }
)

// 数据处理
const dataHandle = (newData: number | string) => {
  newData = isString(newData) ? parseFloat(newData) : newData
  return parseFloat(newData.toFixed(2))
}

// 编辑
watch(
  () => props.chartConfig.data,
  newData => {
    props.chartConfig.option.series[0].data = [dataHandle(newData.value)]
    option.value = props.chartConfig.option
  },
  {
    immediate: true,
    deep: false
  }
)

// 预览
useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (newData: number) => {
  // @ts-ignore
  option.value.series[0].data = [dataHandle(newData)]
})
</script>
