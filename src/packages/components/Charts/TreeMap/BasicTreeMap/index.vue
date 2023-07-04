<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option" :manual-update="isPreview()" autoresize></v-chart>
</template>

<script setup lang="ts">
import { ref, computed, PropType, watch } from 'vue'
import VChart from 'vue-echarts'
import dataJson from './data.json'
import { use } from 'echarts/core'
import { CanvasRenderer } from 'echarts/renderers'
import { TreemapChart } from 'echarts/charts'
import { Events, includes } from './config'
import { mergeTheme } from '@/packages/public/chart'
import { useChartDataFetch } from '@/hooks'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { getArrayData, isPreview } from '@/utils'
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

use([CanvasRenderer, TreemapChart])

const vChartRef = ref<typeof VChart>()

const option = computed(() => {
  dataSetHandle(getArrayData(props.chartConfig.data))
  return mergeTheme(props.chartConfig.option, props.themeSetting, includes)
})

const dataSetHandle = (dataset) => {
  let { classAxis, valueAxis } = props.chartConfig.dataMapping
  if (dataset) {
    props.chartConfig.option.series[0].data = getTreeMapData(dataset, classAxis[0].column, valueAxis[0].column)
    vChartRef.value?.setOption(props.chartConfig.option)
  }
}

function getTreeMapData(e, name, value) {
  return e.map((e) => {
    let children = e.children && getTreeMapData(e.children, name, value)
    return {
      name: e[name],
      value: e[value],
      children: children || null
    }
  })
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

useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (newData) => {
  dataSetHandle(getArrayData(newData))
})
</script>
