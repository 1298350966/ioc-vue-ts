import { PublicConfigClass } from '@/packages/public'
import { chartInitConfig } from '@/settings/designSetting'
import { CreateComponentType } from '@/packages/index.d'
import { Decorates09Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['rgba(3, 166, 224, 0.8)', 'rgba(3, 166, 224, 0.5)'],
  dur: 3
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates09Config.key
  public attr = { ...chartInitConfig, w: 300, h: 300, zIndex: 1 }
  public chartConfig = cloneDeep(Decorates09Config)
  public option = cloneDeep(option)
}
