import { echartOptionProfixHandle, PublicConfigClass,FormConfigClass } from '@/packages/public'
import { SliderConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
    modelValue:50 || [0,50],
    attrs:{
      min:0,
      max:100,
      disabled:false,
      step:1,
      size:'default',
      showStops:false,  //是否显示间断点
      showTooltip:true, //是否显示提示信息	
      range:false,  //是否开启选择范围
      vertical:false, //垂直模式
      height:'',  //滑块高度，垂直模式必填
      placement:'bottom', //Tooltip 出现的位置
    },
    style:{
      mainBgColor:'', //已划过颜色
      runwayBgColor:'', //未划过颜色
    },
    methods:{},
    events:{
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

const eventVarOptions = [
  {
    label: "滑块值",
    value: '${config.option.modelValue}',
  }
]

//事件
export const Events: EventsType = {
  [BaseEventEnum.CHANGE]: {
    key: BaseEventEnum.CHANGE,
    name: "失去焦点",
    paramsName: ["e", "config", 'rootConfig'],
    vars: eventVarOptions
  },
}

export const EventNameList = ['change']
  
export default class Config extends FormConfigClass {
  public key = SliderConfig.key
  public chartConfig = cloneDeep(SliderConfig)
  // 控件配置项
  public option = cloneDeep(option)
}