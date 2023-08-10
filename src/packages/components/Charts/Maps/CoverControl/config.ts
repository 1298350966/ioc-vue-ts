import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { CoverControlConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import { BaseEvent, EventLife } from '@/enums/eventEnum'

export const seriesItem = {
  icon:"",
  name:"",
  show:true,
  options:[
    {value:false,name:""}
  ]
}
export const seriesItemOptions = {value:false,name:""}

export const option = {
  style:{},
  series: [
    {
      icon:"分区管控",
      name:"分区管控",
      show:true,
      options:[
        {value:false,name:"分区管控"}
      ]
    },
    {
      icon:"分区管控",
      name:"巡检点",
      show:true,
      options:[
        {value:false,name:"巡检点"}
      ]
    }
  ],
}

//组件基础事件类型
export enum BaseEventEnum {
  // 单击
  CHANGE = 'change',
}


//事件
export const Events: EventsType = {
  [BaseEventEnum.CHANGE]: {
    key: BaseEventEnum.CHANGE,
    name: "值变化事件",
    paramsName: ["value", "option", "seriesItem", "config", 'rootConfig'],
    vars: [
      {
        value:"${value}",
        label:"变化值",
        type:"boolean"
      },
      {
        value:"${seriesItem.name}",
        label:"分组名称",
        type:"string"
      },
      {
        value:"${option.name}",
        label:"分组选项名称",
        type:"string"
      },
    ],
  },
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = CoverControlConfig.key
  public chartConfig = cloneDeep(CoverControlConfig)
  // 图表配置项
  public option = cloneDeep(option)
}
