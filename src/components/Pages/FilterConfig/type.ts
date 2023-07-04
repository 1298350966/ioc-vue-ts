export interface EventConfigFiltersType{
  enable?:boolean,
  type:FiltersEnum,
  conditions:ConditionsType[]
}

export interface ConditionsType{
  type:FiltersEnum,
  conditions:ConditionType[]
}

export interface ConditionType{
  key:string,
  condition:string
  value:string,
}
export enum FiltersEnum{
  OR = "||",
  AND = "&&"
} 
