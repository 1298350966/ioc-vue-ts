import {
  Events as RadioEvents,
  RadioConfig
} from './Radio/index'
import {
  Events as CheckboxEvents,
  CheckboxConfig
} from './Checkbox/index'

export const RadiosEvents = {
  [RadioConfig.key]: RadioEvents,
  [CheckboxConfig.key]: CheckboxEvents,
}

export default [ RadioConfig,CheckboxConfig ]