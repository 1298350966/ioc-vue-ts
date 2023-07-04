import {
  Events as ScatterCommonEvents,
  ScatterCommonConfig
} from './ScatterCommon/index'
import {
  Events as  ScatterLogarithmicRegressionEvents,
  ScatterLogarithmicRegressionConfig
} from './ScatterLogarithmicRegression/index'

export const ScattersEvents = {
  [ScatterCommonConfig.key]: ScatterCommonEvents,
  [ScatterLogarithmicRegressionConfig.key]: ScatterLogarithmicRegressionEvents,
}

export default [ScatterCommonConfig, ScatterLogarithmicRegressionConfig]
