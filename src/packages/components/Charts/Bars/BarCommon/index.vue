<template>
  <div>
    <v-chart v-on="getEvents" ref="vChartRef" :theme="themeColor" :option="option" :manual-update="isPreview()" :update-options="{
      replaceMerge: ['series']
    }" autoresize></v-chart>
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, PropType } from 'vue'
import VChart from 'vue-echarts'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { BarChart } from 'echarts/charts'
import config, { Events, includes, seriesItem } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { useChartDataFetch } from '@/hooks'
import { CreateComponentType } from '@/packages/index.d'
import { getArrayData, isPreview } from '@/utils'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { cloneDeep, find, isObject } from 'lodash'
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

use([DatasetComponent, CanvasRenderer, BarChart, GridComponent, TooltipComponent, LegendComponent])

const replaceMergeArr = ref<string[]>()

const option = computed(() => {
  let option = cloneDeep(props.chartConfig.option)
  // option.dataset.source = getArrayData(props.chartConfig.data)
  setDataset(getArrayData(props.chartConfig.data), option)
  return mergeTheme(option, props.themeSetting, includes)
})



function setDataset(datas: any[], option) {
  let { valueAxis, classAxis, colorAxis, typeList } = props.chartConfig.dataMapping
  let seriesArr = []
  let categoryData = datas.map((e) => e[(classAxis[0].column || colorAxis[0].column)])

  if (valueAxis.length > 1) {

    valueAxis.forEach((value, index, array) => {
      let series = {
        ...getSeriesItem(option.series, index)
      }
      series.name = value.name
      series.data = datas.map((e) => e[value.column])
      seriesArr.push(series)
    })
  } else if (valueAxis.length == 1) {
    if (classAxis[0] && colorAxis[0]) {
      typeList.forEach((value, index) => {
        let series = {
          ...getSeriesItem(option.series, index)
        }
        series.name = value.name
        series.data = []
        seriesArr.push(series)
      })
      datas.forEach((value, index, array) => {
        if (classAxis[0] && colorAxis[0]) {
          let series = seriesArr.find((e) => e.name == value[colorAxis[0].column])
          if (series) {
            series.data.push(value[valueAxis[0].column])
          } else {
            series = {
              ...getSeriesItem(option.series, seriesArr.length)
            }
            series.name = value[colorAxis[0].column]
            series.data = [value[valueAxis[0].column]]
            seriesArr.push(series)
          }
        }
      })
    } else {
      valueAxis.forEach((value, index, array) => {
        let series = {
          ...getSeriesItem(option.series, index)
        }
        series.name = value.name
        series.data = datas.map((e) => e[value.column])
        seriesArr.push(series)
      })
    }
  }

  if (option.yAxis.type == "category") {
    option.yAxis.data = categoryData
  } else if (option.xAxis.type == "category") {
    option.xAxis.data = categoryData
  }
  option.series = seriesArr
}

function getSeriesItem(series, index) {
  if (series[index]) {
    return series[index]
  } else {
    return seriesItem
  }
}

// dataset 无法变更条数的补丁

const { vChartRef } = useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (data) => {
  console.log(data);
})

</script>
