import { echartOptionProfixHandle, PublicConfigClass,FormConfigClass } from '@/packages/public'
import { InputTextConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
export const option = {
  modelValue: '',
  attrs: {
    type: null,
    maxlength: null,
    minlength: null,
    placeholder: '请输入内容',
    clearable: true,
    disabled: false,
    size: 'default',
    // prefixIcon:'',
    // suffixIcon:'',
  },
  style: {
    borderColor: '',
    focusBorderColr: '',
    textColor: '',
    bgColor: '',
  },
  methods: {},
  events: {
    blur: "",
    focus: "",
    change: "",
    clear:"",
  }
}

//组件基础事件类型
export enum BaseEventEnum {
  // 失去焦点
  BLUR = 'blur',
  // 获得焦点
  FOCUS = 'focus',
  // 值改变时
  CHANGE = 'change',
  // 值清空时
  CLEAR = 'clear',
}
export const EventTypeName = {
  [BaseEventEnum.BLUR]: "失去焦点",
  [BaseEventEnum.FOCUS]: "获得焦点",
  [BaseEventEnum.CHANGE]: "值改变时",
  [BaseEventEnum.CLEAR]: "值清空时",
};
export const EventParamsName = {
  [BaseEventEnum.BLUR]: ["e", "config", 'rootConfig'],
  [BaseEventEnum.FOCUS]: ["e", "config", 'rootConfig'],
  [BaseEventEnum.CHANGE]: ["e", "config", 'rootConfig'],
  [BaseEventEnum.CLEAR]: ["e", "config", 'rootConfig'],
};

const eventVarOptions = [
  {
    label: "输入值",
    value: '${config.option.modelValue}',
  }
]
//事件
export const Events: EventsType = {
  [BaseEventEnum.BLUR]: {
    name: "失去焦点",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eventVarOptions
  },
  [BaseEventEnum.FOCUS]: {
    name: "获得焦点",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eventVarOptions
  },
  [BaseEventEnum.CHANGE]: {
    name: "值改变时",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eventVarOptions
  },
}

export const EventNameList = ['blur','focus','change','clear']

export default class Config extends FormConfigClass {
  public key = InputTextConfig.key
  public chartConfig = cloneDeep(InputTextConfig)
  // 控件配置项
  public option = cloneDeep(option)
}
