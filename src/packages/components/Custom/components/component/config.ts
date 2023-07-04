import { echartOptionProfixHandle, PublicConfigClass,FormConfigClass } from '@/packages/public'
import { componentConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
export const option = {
  is:"components",
}



export default class Config extends PublicConfigClass {
  public key = componentConfig.key
  public chartConfig = cloneDeep(componentConfig)
  // 控件配置项
  public option = cloneDeep(option)
  public data = {}
}
