import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import { WaterPoloConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const shapes = [
  {
    label: '圆形',
    value: 'circle'
  },
  {
    label: '正方形',
    value: 'rect'
  },
  {
    label: '带圆角的正方形',
    value: 'roundRect'
  },
  {
    label: '正三角形',
    value: 'triangle'
  },
  {
    label: '菱形',
    value: 'diamond'
  },
  {
    label: '水滴',
    value: 'pin'
  },
  {
    label: '箭头',
    value: 'arrow'
  },
]

export const includes = []

export const option = {
  series: [
    {
      type: 'liquidFill',
      shape: shapes[0].value,
      radius: '90%',
      data: [0],
      center: ['50%', '50%'],
      color: [
        {
          type: 'linear',
          x: 0,
          y: 0,
          x2: 0,
          y2: 1,
          colorStops: [
            {
              offset: 0,
              color: '#446bf5',
            },
            {
              offset: 1,
              color: '#2ca3e2',
            },
          ],
          globalCoord: false,
        },
      ],
      backgroundStyle: {
        borderWidth: 1,
        color: 'rgba(51, 66, 127, 0.7)',
      },
      label: {
        normal: {
          textStyle: {
            fontSize: 50,
            color: '#fff',
          },
        },
      },
      outline: {
        show: false,
        borderDistance: 10,
        itemStyle: {
          borderWidth: 2,
          borderColor: '#112165'
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

export const Events: EventsType = {
  [BaseEventEnum.CLICK]: {
    key: BaseEventEnum.CLICK,
    name: "单击",
    paramsName: ["e", "config", 'rootConfig'],
    vars: [],
  },
  [BaseEventEnum.MOUSE_ENTER]: {
    key: BaseEventEnum.MOUSE_ENTER,
    name: "鼠标进入",
    paramsName: ["e", "config", 'rootConfig'],
    vars: [],
  },
  [BaseEventEnum.MOUSE_LEAVE]: {
    key: BaseEventEnum.MOUSE_LEAVE,
    name: "鼠标移出",
    paramsName: ["e", "config", 'rootConfig'],
    vars: [],
  },
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = WaterPoloConfig.key
  public chartConfig = cloneDeep(WaterPoloConfig)
  public option = echartOptionProfixHandle(option, includes)
  public data = {
    value: 0.5
  }
}
