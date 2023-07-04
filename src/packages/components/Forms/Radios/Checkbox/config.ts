import { echartOptionProfixHandle, PublicConfigClass, FormConfigClass } from '@/packages/public'
import { CheckboxConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  modelValue: [],
  attrs: {
    disabled: false,
    size: 'default',
    textColor: '#ffffff',  //当按钮为活跃状态时的字体颜色
    fill: '#409EFF', //当按钮为活跃状态时的边框和背景颜色
  },
  listOptions: [
    {
      "label": "选项1",
      "value": "1"
    },
    {
      "label": "选项2",
      "value": "2"
    },
    {
      "label": "选项3",
      "value": "3"
    }
  ],
  style: {
    borderColor: '',
    focusBorderColr: '',
    textColor: '',
    bgColor: '',
  },
  dataset: null,
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
    label: "多选框值",
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

export default class Config extends FormConfigClass {
  public key = CheckboxConfig.key
  public chartConfig = cloneDeep(CheckboxConfig)
  // 控件配置项
  public option = cloneDeep(option)
}