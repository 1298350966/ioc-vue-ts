import { cloneDeep } from "lodash"
import { ConditionType, ConditionsType, FiltersEnum } from "./type"

export const filtersType = [
  {
     type:FiltersEnum.OR,
     name:"并且"
  },
  {
     type:FiltersEnum.AND,
     name:"或者"
  }
]
export const conditionConfig:ConditionType = {
  key:"",
  condition:"",
  value:"",
}
export const conditionsConfig:ConditionsType = {
  type:FiltersEnum.AND,
  conditions:[
    cloneDeep(conditionConfig)
  ]
}



export const numberConditionOptions = [
  {
    value:'==',
    label:'等于',
  },
  {
    value:'>',
    label:'大于',
  },
  {
    value:'<',
    label:'小于',
  },
  {
    value:'<=',
    label:'大于等于',
  },
  {
    value:'<=',
    label:'小于等于',
  },
  {
    value:'!=',
    label:'不等于',
  },
]

export const stringConditionOptions = [
  {
    value:'==',
    label:'等于',
  },
  {
    value:'!=',
    label:'不等于',
  },
]