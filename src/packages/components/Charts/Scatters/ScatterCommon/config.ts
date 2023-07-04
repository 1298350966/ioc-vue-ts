import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { ScatterCommonConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'
import { getArrayData } from '@/utils'

export const includes = ['legend', 'xAxis', 'yAxis']

export const seriesItem = {
  type: 'scatter',
  emphasis: {
    focus: 'series'
  },
  symbolSize: 12,
  markArea: {
    silent: true,
    itemStyle: {
      color: 'transparent',
      borderWidth: 1,
      borderType: 'dashed'
    },
    data: [
      [
        {
          xAxis: 'min',
          yAxis: 'min'
        },
        {
          xAxis: 'max',
          yAxis: 'max'
        }
      ]
    ]
  },
  markPoint: {
    symbol: 'pin',
    symbolSize: 50,
    data: [
      { type: 'max', name: 'Max' },
      { type: 'min', name: 'Min' }
    ]
  }
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
  if (dataMapping.colorAxis[0]) {
    list.push({
      label: `系列名称(${dataMapping.colorAxis[0].column})`,
      value: '${e.name}',
    })
  } else {
    list.push({
      label: `系列名称`,
      value: '${e.seriesName}',
    })
  }
  if (dataMapping.colorAxis[0]) {
    list.push({
      label: `名称(${dataMapping.classAxis[0].column})`,
      value: '${e.name}',
    })
  }

  list.push({
    label: "值",
    value: '${e.value}',
  })
  
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

export const option = {
  // dataset: dataJson,
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
  xAxis: {
    scale: true
  },
  yAxis: {
    scale: true
  },
  series: [{
    ...seriesItem,
    datasetIndex: 0
  },
  {
    ...seriesItem,
    datasetIndex: 1
  }]
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = ScatterCommonConfig.key
  public chartConfig = cloneDeep(ScatterCommonConfig)
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
  public data = cloneDeep(dataJson)
  public dataMapping = {
    xAxis: [{
      column: "x",
      name: "身高",
    }],
    yAxis: [{
      column: "y",
      name: "体重",
    }],
    classAxis: [{
      column: "dataType",
    }],
    colorAxis: [
      {
        column: "dataType",
      }
    ],
    sizeAxis: [
      {
        column: "product",
      }
    ],
    typeList: []
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
    },
  ]
}
