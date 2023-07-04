
import {
  Events as BarCommoneEvents,
  BarCommonConfig
} from './BarCommon/index'
import {
  Events as BarCrossrangeEvents,
  BarCrossrangeConfig
} from './BarCrossrange/index'

export const BarsEvents = {
  [BarCommonConfig.key]: BarCommoneEvents,
  [BarCrossrangeConfig.key]: BarCrossrangeEvents,
}

export default [BarCommonConfig, BarCrossrangeConfig]



