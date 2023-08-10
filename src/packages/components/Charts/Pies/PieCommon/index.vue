<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option" :manual-update="isPreview()" autoresize></v-chart>
</template>

<script setup lang="ts">
import { computed, PropType, reactive, watch } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { PieChart } from 'echarts/charts'
import { mergeTheme } from '@/packages/public/chart'
import config, { Events, includes } from './config'
import { useChartDataFetch } from '@/hooks'
import { getArrayData, isPreview } from '@/utils'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import cloneDeep from 'lodash/cloneDeep'
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

use([DatasetComponent, CanvasRenderer, PieChart, GridComponent, TooltipComponent, LegendComponent])

const option = computed(() => {
  let option = cloneDeep(props.chartConfig.option)
  // option.dataset.source = getArrayData(props.chartConfig.data)
  setDataset(getArrayData(props.chartConfig.data), option)
  return mergeTheme(option, props.themeSetting, includes)
})


function setDataset(datas: any[], option) {
  let { valueAxis, classAxis } = props.chartConfig.dataMapping
  let seriesArr = []

  let data = datas.map((e) => {
    return {
      value: e[valueAxis[0].column],
      name: e[classAxis[0].column],
    }
  })
  option.series[0].name = valueAxis[0].name
  option.series[0].data = data

  option.series[0].label.formatter = new Function("params", option.series[0].label.formatter)
}

const { vChartRef } = useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig)


let timerForChar =  null


watch(
  () => props.chartConfig.option.type,
  newData => {
    if (newData === 'nomal') {
      props.chartConfig.option.series[0].radius = '70%'
      props.chartConfig.option.series[0].roseType = false
    } else if (newData === 'ring') {
      props.chartConfig.option.series[0].radius = ['40%', '65%']
      props.chartConfig.option.series[0].roseType = false
    } else {
      props.chartConfig.option.series[0].radius = '70%'
      props.chartConfig.option.series[0].roseType = true
    }
  },
  { deep: true, immediate: true }
)


</script>
