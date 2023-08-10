<template>
  <v-chart ref="vChartRef" :theme="themeColor" :option="option.value" :manual-update="isPreview()" autoresize>
  </v-chart>
</template>

<script setup lang="ts">
import { PropType, reactive, watch, ref, nextTick } from 'vue'
import config, { Events, includes } from './config'
import VChart from 'vue-echarts'
import { use, registerMap } from 'echarts/core'
import { EffectScatterChart, MapChart } from 'echarts/charts'
import { CanvasRenderer } from 'echarts/renderers'
import { useChartDataFetch } from '@/hooks'
import { mergeTheme } from '@/packages/public/chart'
import { isPreview } from '@/utils'
import mapJsonWithoutHainanIsLands from './mapWithoutHainanIsLands.json'
import { DatasetComponent, GridComponent, TooltipComponent, GeoComponent, VisualMapComponent } from 'echarts/components'
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
  MapChart,
  DatasetComponent,
  CanvasRenderer,
  GridComponent,
  TooltipComponent,
  GeoComponent,
  EffectScatterChart,
  VisualMapComponent
])

const option = reactive({
  value: mergeTheme(props.chartConfig.option, props.themeSetting, includes)
})
const vChartRef = ref<typeof VChart>()

//动态获取json注册地图
const getGeojson = (regionId: string) => {
  return new Promise<boolean>(resolve => {
    import(`./mapGeojson/${regionId}.json`).then(data => {
      registerMap(regionId, { geoJSON: data.default as any, specialAreas: {} })
      resolve(true)
    })
  })
}

//异步时先注册空的 保证初始化不报错
registerMap(props.chartConfig.option.mapRegion.adcode, { geoJSON: {} as any, specialAreas: {} })

// 进行更换初始化地图
const registerMapInitAsync = async () => {
  await nextTick()
  await getGeojson(props.chartConfig.option.mapRegion.adcode)
  vEchartsSetOption()
}
registerMapInitAsync()

// 手动触发渲染
const vEchartsSetOption = () => {
  option.value = props.chartConfig.option
  vChartRef.value?.setOption(props.chartConfig.option)
}

// 更新数据处理
const dataSetHandle = async (dataset: any) => {
  const { dataMapping } = props.chartConfig
  const point = dataMapping.find(e => e.key == "point")
  const map = dataMapping.find(e => e.key == "map")
  props.chartConfig.option.series.forEach((item: any) => {
    let pointData = dataset[point.column] || []
    const pointName = point.children.find(e => e.key == "name")
    const pointLng = point.children.find(e => e.key == "lng")
    const pointLat = point.children.find(e => e.key == "lat")
    const pointValue = point.children.find(e => e.key == "value")
    let _pointData = pointData.map((d)=>{
      return {
        name:d[pointName.column],
        value:[d[pointLng.column],d[pointLat.column],d[pointValue.column]]
      }
    })
    let mapData = dataset[map.column] || []
    const mapName = map.children.find(e => e.key == "name")
    const mapValue = map.children.find(e => e.key == "value")
    let _mapData = mapData.map((d)=>{
      return {
        name:d[mapName.column],
        value:d[mapValue.column]
      }
    })
    console.log(`output->`,_pointData,_mapData)
    if (item.type === 'effectScatter' && dataset.point) item.data = _pointData
    else if (item.type === 'map' && dataset.map) item.data = _mapData
  })
  // isPreview() && vEchartsSetOption()
}

//监听 dataset 数据发生变化
watch(
  () => props.chartConfig.data,
  newData => {
    dataSetHandle(newData)
  },
  {
    immediate: true,
    deep: false
  }
)

//监听是否显示南海群岛
watch(
  () => props.chartConfig.option.mapRegion.showHainanIsLands,
  async newData => {
    if (newData) {
      await getGeojson('china')
    } else {
      registerMap('china', { geoJSON: mapJsonWithoutHainanIsLands as any, specialAreas: {} })
    }
    vEchartsSetOption()
  },
  {
    deep: false
  }
)

//监听地图展示区域发生变化
watch(
  () => props.chartConfig.option.mapRegion.adcode,
  async newData => {
    await getGeojson(newData)
    props.chartConfig.option.geo.map = newData
    props.chartConfig.option.series.forEach((item: any) => {
      if (item.type === 'map') item.map = newData
    })
    vEchartsSetOption()
  },
  {
    deep: false
  }
)

// 预览
useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (newData: any) => {
  dataSetHandle(newData)
})
</script>
