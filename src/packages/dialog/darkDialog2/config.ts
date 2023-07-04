import cloneDeep from 'lodash/cloneDeep'
import { GlobalDialogType } from '../type'
import { publicOption } from '../publicConfig'
export const getGlobalDialogConfig = () => {

  return cloneDeep(publicOption)
}
export default class GlobalDialogConfig {
  public option = getGlobalDialogConfig()
}


