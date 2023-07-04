<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option" :manual-update="isPreview()"
    :update-options="{ replaceMerge: replaceMergeArr }" autoresize>
  </v-chart>
</template>

<script setup lang="ts">
import { PropType, computed, ref } from 'vue'
import VChart from 'vue-echarts'
import ecStat from 'echarts-stat'
import { use, registerTransform } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart, LineChart } from 'echarts/charts'
import { UniversalTransition, LabelLayout } from 'echarts/features'
import config, { Events, includes } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { useChartDataFetch } from '@/hooks'
import { getArrayData, isPreview } from '@/utils'
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent
} from 'echarts/components'
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
    type: Object as PropType<config>,
    required: true
  }
})

const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events)

use([
  DatasetComponent,
  CanvasRenderer,
  ScatterChart,
  LineChart,
  GridComponent,
  LegendComponent,
  TooltipComponent,
  TransformComponent,
  VisualMapComponent,
  UniversalTransition,
  LabelLayout
])

registerTransform((ecStat as any).transform.regression)

const replaceMergeArr = ref<string[]>()

const option = computed(() => {
  let option = cloneDeep(props.chartConfig.option)
  option.dataset = getArrayData(props.chartConfig.data)
  return mergeTheme(option, props.themeSetting, includes)
})

const { vChartRef } = useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig)
</script>
