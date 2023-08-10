import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { PieRoseConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'

export const includes = ['title', 'legend']

export enum PieTypeEnum {
  NORMAL = '常规图',
  RING = '环形图',
  ROSE = '玫瑰图'
}

export const PieTypeObject = {
  [PieTypeEnum.NORMAL]: 'nomal',
  [PieTypeEnum.RING]: 'ring',
  [PieTypeEnum.ROSE]: 'rose'
}

export const seriesItem = {
  type: 'pie',
  radius: ['40%', '65%'], 
  center: ['50%', '60%'],
  roseType: false,
  avoidLabelOverlap: false,
  itemStyle: {
    show: true,
    borderRadius: 0,
    borderColor: '#fff',
    borderWidth: 2
  },
  label: {
    show: false,
    position: 'center'
  },
  emphasis: {
    label: {
      show: true,
      fontSize: '40',
      fontWeight: 'bold'
    }
  },
  labelLine: {
    show: false
  }
}

export const option = {
  title: {
    x: "center",
    y: "50%",
    padding: [24, 0],
  },
  type: 'rose',
  tooltip: {
    show: true,
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  },
  legend: {
    show: true
  },
  // dataset: {
  //   dimensions: ["product", "data1"],
  //   source: []
  // },
  series: [seriesItem]
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
  public key: string = PieRoseConfig.key
  public chartConfig = cloneDeep(PieRoseConfig)
  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
  public data = cloneDeep(dataJson)
  public dataMapping = {
    classAxis: [{
      column: "product",
    }],
    valueAxis: [
      {
        column: "data1",
        name: "数据1",
      }
    ],
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
    {
      label: "百分比",
      value: '${e.percent}',
    }
  ]
}
