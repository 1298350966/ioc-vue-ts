import { PublicConfigClass } from '@/packages/public'
import { chartInitConfig } from '@/settings/designSetting'
import { CreateComponentType } from '@/packages/index.d'
import { Decorates08Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#7acaec', 'transparent'],
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates08Config.key
  public attr = { ...chartInitConfig, w: 350, h: 70, zIndex: 1 }
  public chartConfig = cloneDeep(Decorates08Config)
  public option = cloneDeep(option)
}
