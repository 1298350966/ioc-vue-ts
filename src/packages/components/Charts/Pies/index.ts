import {
  Events as PieCommonEvents,
  PieCommonConfig
} from './PieCommon/index'
import {
  Events as PieCircleEvents,
  PieCircleConfig
} from './PieCircle/index'

export const PiesEvents = {
  [PieCommonConfig.key]: PieCommonEvents,
  [PieCircleConfig.key]: PieCircleEvents,
}

export default [PieCommonConfig, PieCircleConfig]