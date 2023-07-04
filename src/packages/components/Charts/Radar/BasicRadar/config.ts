import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { BasicRadarConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const includes = ['legend']

// 雷达形状
export const RadarShapeEnumList = [
  { label: '多边形', value: 'polygon' },
  { label: '圆形', value: 'circle' }
]

export const option = {
  tooltip: {
    show: true
  },
  legend: {
    data: null
  },
  radar: {
    shape: 'polygon',
    radius: ['0%', '60%'],
    center: ['50%', '55%'],
    splitArea: { show: true },
    splitLine: { show: true },
    axisName: { show: true, color: '#eee', fontSize: 12 },
    axisLine: { show: true },
    axisTick: { show: true },
    indicator: null
  },
  series: [
    {
      name: 'radar',
      type: 'radar',
      areaStyle: {
        opacity: 0.1
      },
      data: null
    }
  ]
}

//组件事件类型
export enum BaseEventEnum {
  // 单击
  CLICK = 'click',
  // 鼠标进入
  MOUSE_ENTER = 'mouseenter',
  // 鼠标移出
  MOUSE_LEAVE = 'mouseleave',
}

function setVars({ dataMapping }) {
  let list = []
  if (dataMapping.radarAxis[0]) {
    list.push({
      label: `名称(${dataMapping.radarAxis[0].column})`,
      value: '${e.name}',
    })
  } 
  if (dataMapping.valueAxis.length > 0) {
    list.push({
      label: "值",
      value: '${e.value}',
    })
  }
  this.vars = list
}

//事件
export const Events: EventsType = {
  [BaseEventEnum.CLICK]: {
    key: BaseEventEnum.CLICK,
    name: "单击",
    paramsName: ["e", "config", 'rootConfig'],
    vars: [],
    setVars: setVars
  },
  [BaseEventEnum.MOUSE_ENTER]: {
    key: BaseEventEnum.MOUSE_ENTER,
    name: "鼠标进入",
    paramsName: ["e", "config", 'rootConfig'],
    vars: [],
    setVars: setVars
  },
  [BaseEventEnum.MOUSE_LEAVE]: {
    key: BaseEventEnum.MOUSE_LEAVE,
    name: "鼠标移出",
    paramsName: ["e", "config", 'rootConfig'],
    vars: [],
    setVars: setVars
  },
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = BasicRadarConfig.key
  public chartConfig = cloneDeep(BasicRadarConfig)
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
  public data = cloneDeep(dataJson)
  public dataMapping = {
    radarAxis: [{
      column: "name",
    }],
    valueAxis: [
      {
        column: "data1",
        name: "数据1",
      },
      {
        column: "data2",
        name: "数据2",
      },
    ]
  }
}



// {
//   "radarIndicator": [
//     { "name": "数据1", "max": 6500 },
//     { "name": "数据2", "max": 16000 },
//     { "name": "数据3", "max": 30000 },
//     { "name": "数据4", "max": 38000 },
//     { "name": "数据5", "max": 52000 },
//     { "name": "数据6", "max": 25000 }
//   ],
//   "seriesData": [
//     {
//       "name": "data1",
//       "value": [4200, 3000, 20000, 35000, 50000, 18000]
//     },
//     {
//       "name": "data2",
//       "value": [5000, 14000, 28000, 26000, 42000, 21000]
//     }
//   ]
// }