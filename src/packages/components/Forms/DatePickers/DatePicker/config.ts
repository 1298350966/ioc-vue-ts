import { echartOptionProfixHandle, PublicConfigClass,FormConfigClass } from '@/packages/public'
import { DatePickerConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
// import dataJson from './data.json'

export const option = {
  modelValue:null || [null,null],
  attrs:{
    readonly:false,
    disabled:false,
    size:'default',
    editable:true,
    clearable:true,
    placeholder:'请选择时间',
    startPlaceholder:'请选择开始时间',
    endPlaceholder:'请选择结束时间',
    type:'date',    //year/month/date/dates/datetime/ week/datetimerange/daterange/ monthrange
    format:null,  //控件显示的值格式
    valueFormat:null, //控件绑定的值格式
    rangeSeparator:'-',
  },
  style:{
    borderColor:'',
    focusBorderColr:'',
    textColor:'',
    bgColor:'',
  },
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
    label: "请选择时间",
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
  public key = DatePickerConfig.key
  public chartConfig = cloneDeep(DatePickerConfig)
  // 控件配置项
  public option = cloneDeep(option)
}
