import { PublicConfigClass } from '@/packages/public'
import { chartInitConfig } from '@/settings/designSetting'
import { CreateComponentType } from '@/packages/index.d'
import { Decorates07Config } from './index'
import cloneDeep from 'lodash/cloneDeep'

export const option = {
  colors: ['#fff', '#0de7c2'],
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = Decorates07Config.key
  public attr = { ...chartInitConfig, w: 350, h: 70, zIndex: 1 }
  public chartConfig = cloneDeep(Decorates07Config)
  public option = cloneDeep(option)
}
