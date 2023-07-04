<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option" :manual-update="isPreview()" autoresize></v-chart>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch } from 'vue'
import VChart from 'vue-echarts'
import dataJson from './data.json'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { RadarChart } from 'echarts/charts'
import { Events, includes } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { useChartDataFetch } from '@/hooks'
import { CreateComponentType } from '@/packages/index.d'
import { getArrayData, isPreview } from '@/utils'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { cloneDeep } from 'lodash'
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

use([DatasetComponent, CanvasRenderer, RadarChart, GridComponent, TooltipComponent, LegendComponent])

const vChartRef = ref<typeof VChart>()

const option = computed(() => {
  return mergeTheme(props.chartConfig.option, props.themeSetting, includes)
})

const dataSetHandle = (datas: any[]) => {
  const { valueAxis, radarAxis } = props.chartConfig.dataMapping
  props.chartConfig.option.series[0].data = valueAxis.map((e) => {
    let value = datas.map((d) => d[e.column])
    return {
      value: value,
      name: e.name
    }
  })
  props.chartConfig.option.radar.indicator = datas.map((d) => {
    return {
      name: d[radarAxis[0].column]
    }
  })
  if (vChartRef.value && isPreview()) {
    vChartRef.value.setOption(props.chartConfig.option)
  }
}

watch(
  () => props.chartConfig.data,
  newData => {
    dataSetHandle(getArrayData(newData))
  },
  {
    deep: false,
    immediate: true
  }
)

useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (newData: typeof dataJson) => {
  dataSetHandle(getArrayData(newData))
})
</script>
