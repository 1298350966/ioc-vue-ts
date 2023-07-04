import {
  Events as TableEvents,
  TableConfig 
} from './Table/index'

export const TablesEvents = {
  [TableConfig.key]: TableEvents,
}
const tables =  [TableConfig]
export default tables