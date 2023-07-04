import { echartOptionProfixHandle, PublicConfigClass,FormConfigClass } from '@/packages/public'
import { SelectDownConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  modelValue:null,
  attrs:{
    multiple:false,
    disabled:false,
    effect:'light',
    placeholder:'请选择',
    clearable:true,
    size:'default',
    filterable:false,
    
  },
  listOptions:[
      {
          "value": "1",
          "label": "选项1"
      },
      {
          "value": "2",
          "label": "选项2"
      },
      {
          "value": "3",
          "label": "选项3"
      }
  ],
  style:{
    borderColor:'',
    focusBorderColr:'',
    textColor:'',
    bgColor:'',
  },
  dataset:"1",
  methods:{},
  events:{
    blur: "",
    focus: "",
    change: "",
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
}
//组件基础事件名称
export const EventTypeName = {
  [BaseEventEnum.BLUR]: "失去焦点",
  [BaseEventEnum.FOCUS]: "获得焦点",
  [BaseEventEnum.CHANGE]: "值改变时",
};
//组件基础事件的参数名称
export const EventParamsName = {
  [BaseEventEnum.BLUR]: ["e","config"],
  [BaseEventEnum.FOCUS]: ["e"],
  [BaseEventEnum.CHANGE]: ["e"],
};
export const EventNameList = ['blur','focus','change']

const eventVarOptions = [
  {
    label: "下拉选择值",
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
}

export default class Config extends FormConfigClass {
  public key = SelectDownConfig.key
  public chartConfig = cloneDeep(SelectDownConfig)
  // 控件配置项
  public option = cloneDeep(option)
}
