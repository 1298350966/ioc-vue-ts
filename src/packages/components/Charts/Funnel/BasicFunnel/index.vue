<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option" :manual-update="isPreview()" autoresize></v-chart>
</template>

<script setup lang="ts">
import { computed, PropType } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { FunnelChart } from 'echarts/charts'
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

use([DatasetComponent, CanvasRenderer, FunnelChart, GridComponent, TooltipComponent, LegendComponent])

const option = computed(() => {
  let option = cloneDeep(props.chartConfig.option)

  option.series[0].data = getSeriesData(getArrayData(props.chartConfig.data))
  return mergeTheme(option, props.themeSetting, includes)
})

function getSeriesData(datas) {
  const { valueAxis, classAxis } = props.chartConfig.dataMapping
  return datas.map((e) => ({
    value: e[valueAxis[0].column],
    name: e[classAxis[0].column]
  }))
}

const { vChartRef } = useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig)

</script>
