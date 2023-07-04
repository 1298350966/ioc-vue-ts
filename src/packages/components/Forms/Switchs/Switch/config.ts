import { echartOptionProfixHandle, PublicConfigClass, FormConfigClass } from '@/packages/public'
import { SwitchConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  modelValue: false,
  attrs: {
    disabled: false,
    size: 'default',
    activeText: '',
    inactiveText: '',
    activeColor: '',
    inactiveColor: '',

  },
  methods: {},
  events: {
    change: "",
  }
}

//组件基础事件类型
export enum BaseEventEnum {
  // 值改变时
  CHANGE = 'change',
}
//组件基础事件名称
export const EventTypeName = {
  [BaseEventEnum.CHANGE]: "值改变时",
};
//组件基础事件的参数名称
export const EventParamsName = {
  [BaseEventEnum.CHANGE]: ["e"],
};
export const EventNameList = ['change']

const eventVarOptions = [
  {
    label: "开关值",
    value: '${config.option.modelValue}',
  }
]

//事件
export const Events: EventsType = {
  [BaseEventEnum.CHANGE]: {
    key: BaseEventEnum.CHANGE,
    name: "值改变时",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eventVarOptions
  },
}

export default class Config extends FormConfigClass {
  public key = SwitchConfig.key
  public chartConfig = cloneDeep(SwitchConfig)
  // 控件配置项
  public option = cloneDeep(option)
}