import { ProcessConfig } from './Process/index'
import {
  Events as WaterPoloEvents,
  WaterPoloConfig
} from './WaterPolo/index'

export const MoresEvents = {
  [WaterPoloConfig.key]: WaterPoloEvents,
}
export default [ProcessConfig, WaterPoloConfig]
