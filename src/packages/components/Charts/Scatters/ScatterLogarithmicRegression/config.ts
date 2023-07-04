import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { ScatterLogarithmicRegressionConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const includes = ['legend', 'xAxis', 'yAxis']

export const option = {
  dataset: [],

  tooltip: {
    showDelay: 0,
    formatter: (params: { value: string | any[]; seriesName: string; name: string }) => {
      // console.log(params)
      return params.value.length > 1
        ? `${params.seriesName}：<br />${params.value[0]} ${params.value[1]}`
        : `${params.seriesName}：<br />${params.name} ${params.value}`
    },
    axisPointer: {
      show: true,
      type: 'cross',
      lineStyle: {
        type: 'dashed',
        width: 1
      }
    }
  },

  legend: {
    data: dataJson
      .filter(i => i?.transform?.type === 'filter' && i?.transform?.config?.eq)
      .map(i => i.transform?.config?.eq?.toString())
  },

  xAxis: {
    show: true,
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },
  yAxis: {
    show: true,
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed'
      }
    }
  },

  visualMap: {
    show: false,
    dimension: 2,
    min: 20000,
    max: 1500000000,
    seriesIndex: [0, 1],
    inRange: {
      symbolSize: [10, 70]
    }
  },

  series: [
    {
      type: 'scatter',
      datasetIndex: 1
    },
    {
      type: 'scatter',
      datasetIndex: 2
    },
    {
      type: 'line',
      smooth: true,
      datasetIndex: 3,
      symbolSize: 0.1,
      symbol: 'circle',
      label: { show: true, fontSize: 16 },
      labelLayout: { dx: -20 },
      encode: { label: 2, tooltip: 1 }
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
  },
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
    vars: eChartsEventVars
  },
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ScatterLogarithmicRegressionConfig.key
  public chartConfig = cloneDeep(ScatterLogarithmicRegressionConfig)
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
  public data = dataJson
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
    },
  ]
}
