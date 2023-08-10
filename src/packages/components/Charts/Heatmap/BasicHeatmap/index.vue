<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option" :manual-update="isPreview()" autoresize></v-chart>
</template>

<script setup lang="ts">
import { ref, watch, computed, PropType } from 'vue'
import VChart from 'vue-echarts'
import dataJson from './data.json'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { HeatmapChart } from 'echarts/charts'
import { Events, includes } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { useChartDataFetch } from '@/hooks'
import { CreateComponentType } from '@/packages/index.d'
import { isPreview } from '@/utils'
import {
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent
} from 'echarts/components'
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
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events)

use([
  DatasetComponent,
  CanvasRenderer,
  HeatmapChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  VisualMapComponent
])

const option = computed(() => {
  return mergeTheme(props.chartConfig.option, props.themeSetting, includes)
})

const vChartRef = ref<typeof VChart>()

const dataSetHandle = (dataset: typeof dataJson) => {
  // const { x, y, data  } = props.chartConfig.dataMapping
  const x = props.chartConfig.dataMapping.find(e => e.key == "x")
  const y = props.chartConfig.dataMapping.find(e => e.key == "y")
  const data = props.chartConfig.dataMapping.find(e => e.key == "data")
  let xAxis = []
  let yAxis = []
  let seriesData = []
  dataset.forEach((e)=>{
    if(!xAxis.includes(e[x.column])){
      xAxis.push(e[x.column])
    }
    if(!yAxis.includes(e[y.column])){
      yAxis.push(e[y.column])
    }
    let xIndex = xAxis.findIndex((v) => v == e[x.column])
    let yIndex = yAxis.findIndex((v) => v == e[y.column])
    seriesData.push([xIndex,yIndex,e[data.column] || "-"])
  })
  console.log(`output->`,xAxis,yAxis,seriesData)

  if (xAxis) {
    // @ts-ignore
    props.chartConfig.option.xAxis.data = xAxis
  }
  if (yAxis) {
    // @ts-ignore
    props.chartConfig.option.yAxis.data = yAxis
  }
  if (seriesData) {
    props.chartConfig.option.series[0].data = seriesData
  }
  if (vChartRef.value && isPreview()) {
    vChartRef.value.setOption(props.chartConfig.option)
  }
}

watch(
  () => props.chartConfig.data,
  newData => {
    dataSetHandle(newData)
  },
  {
    deep: false,
    immediate:true
  }
)

watch(
  () => props.chartConfig.dataMapping,
  newData => {
    dataSetHandle(props.chartConfig.data)
  },
  {
    deep: true,
  }
)

useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (newData: typeof dataJson) => {
  dataSetHandle(newData)
})
</script>
