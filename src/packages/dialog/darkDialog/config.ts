import cloneDeep from 'lodash/cloneDeep'
import { GlobalDialogType } from '../type'
import { publicOption } from '../publicConfig'


// export const option = {
//   id: "",
//   name: "",
//   component: "darkDialog",
//   show: false,
//   attrs: {
//     title: "",
//     width: "60%",
//     fullscreen: false,
//     top: "15vh",
//     modal: true,
//     draggable: false
//   },
//   body: {
//     height: "60vh",
//     type: "component",  //component iframe
//     attrs: {},
//     component: {
//       is: "",
//     },
//     iframe: {
//       src: "",

//     },
//   }
// }
export const getGlobalDialogConfig = () => {

  return cloneDeep(publicOption)
}
export default class GlobalDialogConfig {
  public option = getGlobalDialogConfig()
}


