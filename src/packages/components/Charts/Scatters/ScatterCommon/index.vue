<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option" :manual-update="isPreview()"
    :update-options="{ replaceMerge: replaceMergeArr }" autoresize>
  </v-chart>
</template>

<script setup lang="ts">
import { PropType, computed, watch, ref, nextTick } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { ScatterChart, EffectScatterChart } from 'echarts/charts'
import config, { Events, includes, seriesItem } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { useChartDataFetch } from '@/hooks'
import { isPreview, isArray, getArrayData } from '@/utils'
import {
  DatasetComponent,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent
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
  EffectScatterChart,
  GridComponent,
  TooltipComponent,
  LegendComponent,
  MarkLineComponent,
  MarkAreaComponent,
  MarkPointComponent
])

const replaceMergeArr = ref<string[]>()

const option = computed(() => {
  let option = cloneDeep(props.chartConfig.option)
  setDataset(getArrayData(props.chartConfig.data), option)
  // option.dataset = getArrayData(props.chartConfig.data)
  return mergeTheme(option, props.themeSetting, includes)
})

function setDataset(datas: any[], option) {
  let { xAxis, yAxis, classAxis, colorAxis, typeList } = props.chartConfig.dataMapping
  let seriesArr = []
  if (colorAxis[0]) {
    typeList.forEach((value, index) => {
      let series = {
        ...getSeriesItem(option.series, index)
      }
      series.name = value.name
      series.data = []
      seriesArr.push(series)
    })
    datas.forEach((e, index, array) => {
      let series = seriesArr.find((s) => s.name == e[colorAxis[0].column])
      if (series) {
        series.data.push([e[xAxis[0].column], e[yAxis[0].column]])
      } else {
        series = {
          ...getSeriesItem(option.series, seriesArr.length)
        }
        series.name = e[colorAxis[0].column]
        series.data = [[e[xAxis[0].column], e[yAxis[0].column]]]
        seriesArr.push(series)
      }
    })
  } else {
    let series = getSeriesItem(option.series, 0)
    series.data = datas.map((e) => {
      return [e[xAxis[0].column], e[yAxis[0].column]]
    })
    seriesArr.push(series)
  }

  option.series = seriesArr
}

function getSeriesItem(series, index) {
  if (series[index]) {
    return series[index]
  } else {
    return { ...seriesItem, datasetIndex: index }
  }
}
// dataset 无法变更条数的补丁
// watch(
//   () => props.chartConfig.option.dataset,
//   (newData, oldData) => {
//     try {
//       if (!isArray(newData)) return
//       if (Array.isArray(newData)) {
//         replaceMergeArr.value = ['series']
//         // eslint-disable-next-line vue/no-mutating-props
//         props.chartConfig.option.series = newData.map((item: { dimensions: any[] }, index: number) => ({
//           ...seriesItem,
//           datasetIndex: index
//         }))
//         nextTick(() => {
//           replaceMergeArr.value = []
//         })
//       }
//     } catch (error) {
//       console.log(error)
//     }
//   },
//   {
//     deep: false
//   }
// )

const { vChartRef } = useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig)
</script>
