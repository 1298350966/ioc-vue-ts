import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { LineGradientsConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import { graphic } from 'echarts/core'
import { defaultTheme, chartColorsSearch } from '@/settings/chartThemes/index'
import dataJson from './data.json'
import { cloneDeep } from 'lodash'

export const includes = ["grid", 'legend', 'xAxis', 'yAxis']

export const seriesItem = {
  type: 'line',
  smooth: false,
  lineStyle: {
    width: 3,
    type: 'solid'
  },
  areaStyle: {
    opacity: 0.8,
    color: new graphic.LinearGradient(0, 0, 0, 1, [
      {
        offset: 0,
        color: chartColorsSearch[defaultTheme][3]
      },
      {
        offset: 1,
        color: 'rgba(0,0,0,0)'
      }
    ])
  }
}

const option = {
  legend: {
    show: true
  },
  tooltip: {
    show: true,
    trigger: 'axis',
    axisPointer: {
      type: 'line'
    }
  },
  xAxis: {
    show: true,
    type: 'category'
  },
  yAxis: {
    show: true,
    type: 'value'
  },
  dataset: {
    dimensions: ["product", "data1", "data2"],
    source: []
  },
  series: [seriesItem, seriesItem],
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

function setVars({ dataMapping }) {
  let list = []
  if (dataMapping.colorAxis[0]) {
    list.push({
      label: `系列名称(${dataMapping.colorAxis[0].column})`,
      value: '${e.seriesName}',
    })
  } else {
    list.push({
      label: `系列名称`,
      value: '${e.seriesName}',
    })
  }
  if (dataMapping.classAxis[0]) {
    list.push({
      label: `名称(${dataMapping.classAxis[0].column})`,
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
  public key: string = LineGradientsConfig.key
  public chartConfig = LineGradientsConfig
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
  public data = cloneDeep(dataJson)
  public dataMapping = {
    classAxis: [{
      column: "product",
    }],
    colorAxis: [],
    valueAxis: [
      {
        column: "data1",
        name: "数据1",
      },
      {
        column: "data2",
        name: "数据2",
      }
    ],
    typeList: [],
    drillingAxis: []
  }
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
