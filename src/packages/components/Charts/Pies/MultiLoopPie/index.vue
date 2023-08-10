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
  let legendData = []
  let total = 0;
  datas.forEach((e, i) => {
    legendData.push(e[classAxis[0].column])
    total += e[valueAxis[0].column]
  })
 datas.forEach((e, i) => {
    const {series,extSeries} = cloneDeep(props.chartConfig.option)
    const {pieGap,bgColor } = extSeries    
    let radius1 = getNumber(series.radius[0])
    let radius2 = getNumber(series.radius[1])
    let spacing =Math.abs(radius1 - radius2) + pieGap
    seriesArr.push({
      ...series,
      radius: [ radius1 - i * spacing + '%', radius2 - i * spacing  + '%'],
      data: [{
            value: e[valueAxis[0].column],
            name: e[classAxis[0].column]
        }, {
            value: total - e[valueAxis[0].column],
            itemStyle: {
              color: bgColor,
              borderWidth: 0
            }
        }]
    })
    return {
      value: e[valueAxis[0].column],
      name: e[classAxis[0].column],
    }
  })

  option.series = seriesArr
  option.legend.data = legendData
  // option.series.data = datas.map(e => ({
  //     value: e[valueAxis[0].column],
  //     name: e[classAxis[0].column],
  //   }))
  // option.series[0].name = valueAxis[0].name
  // option.series[0].data = data
}


function getNumber(str:string): number{
  return Number(str.replace(/[^0-9]/ig,"")) 
}

const { vChartRef } = useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig)
</script>
