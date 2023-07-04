import {
  Events as LineCommonEvents,
  LineCommonConfig
} from './LineCommon/index'
import {
  Events as LineLinearSingleEvents,
  LineLinearSingleConfig
} from './LineLinearSingle/index'
import {
  Events as LineGradientSingleEvents,
  LineGradientSingleConfig
} from './LineGradientSingle/index'
import {
  Events as LineGradientsEvents,
  LineGradientsConfig
} from './LineGradients/index'

export const LinesEvents = {
  [LineCommonConfig.key]: LineCommonEvents,
  [LineLinearSingleConfig.key]: LineLinearSingleEvents,
  [LineGradientSingleConfig.key]: LineGradientSingleEvents,
  [LineGradientsConfig.key]: LineGradientsEvents,
}


export default [LineCommonConfig, LineLinearSingleConfig, LineGradientSingleConfig, LineGradientsConfig]
