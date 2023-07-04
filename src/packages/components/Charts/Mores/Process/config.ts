import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import { ProcessConfig } from './index'
import { chartInitConfig } from '@/settings/designSetting'
import cloneDeep from 'lodash/cloneDeep'


export const types = [
  {
    label: '线形',
    value: 'line'
  },
  {
    label: '圆形',
    value: 'circle'
  },
  {
    label: '仪表盘',
    value: 'dashboard'
  },
]

export const indicatorPlacements = [
  {
    label: '内部',
    value: 'inside'
  },
  {
    label: '外部',
    value: 'outside'
  }
]

export const option = {
  dataset: 36,
  // 默认类型
  type: types[2].value,
  // 进行时效果
  processing: true,
  // 主颜色
  color: '#4992FFFF',
  // 轨道颜色
  railColor: '#3e3e3f',
  // 指标
  unit: '%',
  // 指标大小
  indicatorTextSize: 34,
  // 指标位置（线条时可用）
  indicatorPlacement: 'outside',
  // 指标颜色
  indicatorTextColor: '#FFFFFFFF',
  // 偏移角度
  offsetDegree: 0
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
  public key = ProcessConfig.key
  public attr = { ...chartInitConfig, h: 500, zIndex: -1 }
  public chartConfig = cloneDeep(ProcessConfig)
  public option = cloneDeep(option)
}