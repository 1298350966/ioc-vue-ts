import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { BasicFunnelConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const includes = ["grid",'legend']

// 排序枚举
export const FunnelOrderEnumList = [
  { label: '倒三角', value: 'descending' },
  { label: '正三角', value: 'ascending' }
]
// 标签位置枚举
export const FunnelLabelPositionEnumList = [
  { label: '内部', value: 'inside' },
  { label: '外部', value: 'outside' },
  { label: '内部左侧', value: 'insideLeft' },
  { label: '内部右侧', value: 'insideRight' }
]

export const option = {
  tooltip: {},
  legend: {},
  series: [
    {
      name: 'Funnel',
      type: 'funnel',
      top: 70,
      left: '10%',
      width: '80%',
      min: 0,
      minSize: '0%',
      maxSize: '100%',
      sort: 'descending', // descending | ascending
      gap: 5,
      label: {
        show: true,
        position: 'inside',
        fontSize: 12
      },
      itemStyle: {
        borderColor: '#fff',
        borderWidth: 0
      },
      emphasis: {
        label: {
          fontSize: 20
        }
      }
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

function setVars({ dataMapping }) {
  let list = []
  if (dataMapping.classAxis[0]) {
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

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key: string = BasicFunnelConfig.key
  public chartConfig = cloneDeep(BasicFunnelConfig)

  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
  public data = cloneDeep(dataJson)
  public dataMapping = {
    classAxis: [{
      column: "product",
    }],
    valueAxis: [
      {
        column: "dataOne",
      },
    ]
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
