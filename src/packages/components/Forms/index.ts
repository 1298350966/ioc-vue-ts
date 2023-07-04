import Inputs, { InputEvents } from './Inputs'
import Selects, { SelectsEvents } from './Selects'
import DatePickers, { DatePickersEvents } from './DatePickers'
import Switchs, { SwitchsEvents } from './Switchs'
import Radios, { RadiosEvents } from './Radios'
import Tables, { TablesEvents } from './Tables'
import Mores, { MoresEvents } from './Mores'
import { ConfigType } from '@/packages/index.d'



export const FormList = [...Inputs,...Selects,...DatePickers,...Switchs,...Radios,...Tables,...Mores ]

export const FormsEvents = {
  ...InputEvents,
  ...SelectsEvents,
  ...DatePickersEvents,
  ...SwitchsEvents,
  ...RadiosEvents,
  ...TablesEvents,
  ...MoresEvents
}

