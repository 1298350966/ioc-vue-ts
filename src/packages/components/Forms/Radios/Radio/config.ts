import { echartOptionProfixHandle, PublicConfigClass, FormConfigClass } from '@/packages/public'
import { RadioConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  modelValue: null,
  attrs: {
    disabled: false,
    size: 'default',
    border: false,
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
export const EventTypeName = {
  [BaseEventEnum.CHANGE]: "值改变时",
};
export const EventParamsName = {
  [BaseEventEnum.CHANGE]: ["e"],
};
export const EventNameList = ['change']

const eventVarOptions = [
  {
    label: "单选框值",
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
  public key = RadioConfig.key
  public chartConfig = cloneDeep(RadioConfig)
  // 控件配置项
  public option = cloneDeep(option)
}