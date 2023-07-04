import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { HeatmapConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import { cloneDeep } from 'lodash'
import dataJson from './data.json'

export const includes = ['xAxis', 'yAxis']

export const option = {
  dataset: { ...dataJson },
  tooltip: {
    position: 'top'
  },
  xAxis: {
    data: dataJson.xAxis
  },
  yAxis: {
    data: dataJson.yAxis
  },
  visualMap: {
    show: true,
    min: 0,
    max: 10,
    itemWidth: 20,
    itemHeight: 140,
    calculable: true,
    orient: 'horizontal',
    inRange: {
      // 高 -> 低
      color: ['#4661c2', '#263253']
    }
  },
  series: [
    {
      name: '',
      type: 'heatmap',
      data: dataJson.seriesData,
      label: {
        show: true
      },
      emphasis: {
        itemStyle: {
          borderColor: '#333',
          borderWidth: 1,
          shadowBlur: 10,
          shadowColor: 'rgba(0, 0, 0, 0.5)'
        }
      },
      progressive: 1000,
      animation: false
    }
  ]
}

//组件基础事件类型
export enum BaseEventEnum {
  // 单击
  CLICK = 'click',
  // 鼠标进入
  MOUSE_ENTER = 'mouseenter',
  // 鼠标移出
  MOUSE_LEAVE = 'mouseleave',
}

let eChartsEventVars = [
  {
    label: "系列名称",
    value: '${e.seriesName}',
  },
  {
    label: "名称",
    value: '${e.name}',
  },
  {
    label: "值",
    value: '${e.value}',
  }
]

//事件
export const Events: EventsType = {
  [BaseEventEnum.CLICK]: {
    key: BaseEventEnum.CLICK,
    name: "单击",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eChartsEventVars,
  },
  [BaseEventEnum.MOUSE_ENTER]: {
    key: BaseEventEnum.MOUSE_ENTER,
    name: "鼠标进入",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eChartsEventVars,
  },
  [BaseEventEnum.MOUSE_LEAVE]: {
    key: BaseEventEnum.MOUSE_LEAVE,
    name: "鼠标移出",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eChartsEventVars,
  },
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = HeatmapConfig.key
  public chartConfig = cloneDeep(HeatmapConfig)

  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
  public data = cloneDeep(dataJson)
  public eChartsEventVars = [
    {
      label: "系列名称",
      value: '${e.seriesName}',
    },
    {
      label: "名称",
      value: '${e.name}',
    },
    {
      label: "值",
      value: '${e.value}',
    }
  ]
}
