import { echartOptionProfixHandle, PublicConfigClass,FormConfigClass } from '@/packages/public'
import { IframeConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
export const option = {
  src:"",
  dataset:{}
}

//组件基础事件类型
export enum BaseEventEnum {
  // 失去焦点
  BLUR = 'blur',
  // 获得焦点
  FOCUS = 'focus',
  // 值改变时
  CHANGE = 'change',
}

//组件基础事件名称
export const EventTypeName = {
  [BaseEventEnum.BLUR]: "失去焦点",
  [BaseEventEnum.FOCUS]: "获得焦点",
  [BaseEventEnum.CHANGE]: "值改变时",
};
//组件基础事件的参数名称
export const EventParamsName = {
  [BaseEventEnum.BLUR]: ["e", "config",'rootConfig'],
  [BaseEventEnum.FOCUS]: ["e", "config", 'rootConfig'],
  [BaseEventEnum.CHANGE]: ["e", "config", 'rootConfig'],
};

export const EventNameList = [BaseEventEnum.BLUR, BaseEventEnum.FOCUS, BaseEventEnum.CHANGE]


const eventVarOptions = [
  {
    label: "输入值",
    value: '${config.option.modelValue}',
  }
]
//事件
export const Events: EventsType = {
  [BaseEventEnum.BLUR]: {
    key: BaseEventEnum.BLUR,
    name: "失去焦点",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eventVarOptions
  },
  [BaseEventEnum.FOCUS]: {
    key: BaseEventEnum.FOCUS,
    name: "获得焦点",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eventVarOptions
  },
  [BaseEventEnum.CHANGE]: {
    key: BaseEventEnum.CHANGE,
    name: "值改变时",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eventVarOptions
  }, 
}



export default class Config extends PublicConfigClass {
  public key = IframeConfig.key
  public chartConfig = cloneDeep(IframeConfig)
  // 控件配置项
  public option = cloneDeep(option)
  public data = {}
}
