import { setCodeEvents, setConfigEvents, useEvent } from "@/hooks";
import { GlobalPropsType } from "@/store/modules/chartEditStore/chartEditStore.d";
import { propsFunConfig } from "@/views/chart/GlobalProps/config";
import {defineProps} from "vue"
import { useFunction } from "./useFunction.hook";
import { ChartEditStorageType } from "..";
// export function useProps(propsConfig: GlobalPropsType[]) {
  
//   const rootConfig = inject("rootConfig")
//   const props = getProps()
//   const watch = getWatch()
//   console.log(`output->getProps()`,getProps())
//   function getProps() {
//     let obj = {}
//     propsConfig.forEach((propConfig) => {
//       obj[propConfig.field] = {
//         type:getType(propConfig.type),
//         default:propConfig.default
//       }
//     })
//     return obj
//   }

//   function getType(str: string) {
//     switch (str) {
//       case "string":
//         return String
//       case "number":
//         return Number
//       case "boolean":
//         return Boolean
//       case "array":
//         return Array
//       case "object":
//         return Object
//       default:
//         return ""
//     }
//   }
//   function getWatch() {
//     let obj = {}
//     propsConfig.forEach((propConfig) => {
//       obj[propConfig.field] = {
//         handler:(newVl,oldVl)=>{
//           new Function("newVl","oldVl","rootConfig",propConfig.fun).call(this,newVl,oldVl,rootConfig)
//         },
//         immediate:true
//       } 
//     })
//     return obj
//   }
//   return {props,watch}
// }



export function useProps(globalProps: GlobalPropsType[],{rootConfig}:{
  rootConfig:ChartEditStorageType
}) {
  if(!globalProps) return {}
  const attrs = useAttrs()
  const props = reactive(getProps()) 
  

  function getProps() {
    let obj:any = {}
    globalProps.forEach((globalProp) => {
      obj[globalProp.field] = attrs[globalProp.field] || globalProp.default
    })
    return obj
  }

  function getWatch() {
    globalProps.forEach((globalProp) => {
    const {emitEvent} =  useFunction(globalProp,propsFunConfig,rootConfig)

     watch(()=>props[globalProp.field],(newVl,oldVl)=>{
      console.log(`output->`,newVl,oldVl,rootConfig)
      emitEvent.emit(propsFunConfig.key,...[newVl,oldVl,rootConfig])
    },{
      immediate:true
     })
    })
  }
  getWatch()
  return {props}
}
