import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { PieCircleConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'

export const includes = []

const option = {
  tooltip: {
    show: true,
    trigger: 'item'
  },
  legend: {
    show: true,
  },
  dataset: 0.25,
  title: {
    text: 25 + "%",
    x: "center",
    y: "center",
    textStyle: {
      color: "#56B9F8",
      fontSize: 30
    }
  },
  series: [
    {
      type: "pie",
      radius: ["75%", "80%"],
      center: ["50%", "50%"],
      hoverAnimation: true,
      color: ["#00bcd44a", "transparent"],
      label: {
        show: false
      },
      data: [
        {
          value: [25],
          itemStyle: {
            color: "#03a9f4",
            shadowBlur: 10,
            shadowColor:"#97e2f5"
          }
        },
        {
          value: [75],
          itemStyle: {
            color: "#00bcd44a",
            shadowBlur: 0,
            shadowColor:"#00bcd44a"
          }
        }
      ]
    },
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
  {
    label: "百分比",
    value: '${e.percent}',
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
  public key: string = PieCircleConfig.key

  public chartConfig = PieCircleConfig

  // 图表配置项
  public option = echartOptionProfixHandle(option, includes)
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
