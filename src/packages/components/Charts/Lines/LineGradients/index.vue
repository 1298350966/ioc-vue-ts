<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option.value" :manual-update="isPreview()" :update-options="{
    replaceMerge: ['series']
  }"></v-chart>
</template>

<script setup lang="ts">
import { reactive, watch, PropType } from 'vue'
import VChart from 'vue-echarts'
import { use, graphic } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { LineChart } from 'echarts/charts'
import config, { Events, includes, seriesItem } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { chartColorsSearch, defaultTheme } from '@/settings/chartThemes/index'
import { DatasetComponent, GridComponent, TooltipComponent, LegendComponent } from 'echarts/components'
import { useChartDataFetch } from '@/hooks'
import { getArrayData, isPreview } from '@/utils'
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

use([DatasetComponent, CanvasRenderer, LineChart, GridComponent, TooltipComponent, LegendComponent])

const option = reactive({
  value: {}
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
// 渐变色处理
watch(
  () => rootConfig.editCanvasConfig.chartThemeColor,
  (newColor: keyof typeof chartColorsSearch) => {
    if (!isPreview()) {
      const themeColor = chartColorsSearch[newColor] || chartColorsSearch[defaultTheme]
      props.chartConfig.option.series.forEach((value: any, index: number) => {
        value.areaStyle.color = new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: themeColor[3 + index]
          },
          {
            offset: 1,
            color: 'rgba(0,0,0, 0)'
          }
        ])
      })
    }
    let option2 = cloneDeep(props.chartConfig.option)
    setDataset(getArrayData(props.chartConfig.data), option2)
    option.value = mergeTheme(option2, props.themeSetting, includes)
    props.chartConfig.option = option.value
  },
  {
    immediate: true
  }
)

watch(
  () => props.chartConfig.option.dataset,
  () => {
    option.value = props.chartConfig.option
  }
)

const { vChartRef } = useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig)
</script>
