import {
  Events as InputNumberEvents,
  InputNumberConfig
} from './InputNumber/index'
import {
  Events as InputTextEvents,
  InputTextConfig
} from './InputText'

export const InputEvents = {
  [InputTextConfig.key]: InputTextEvents,
  [InputNumberConfig.key]: InputNumberEvents,
}


export default [InputTextConfig, InputNumberConfig]