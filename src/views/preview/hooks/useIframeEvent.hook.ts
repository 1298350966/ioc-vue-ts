import { GlobalIframeEventType} from "@/store/modules/chartEditStore/chartEditStore.d";
import { propsFunConfig } from "@/views/chart/GlobalProps/config";
import { useFunction } from "./useFunction.hook";
import { ChartEditStorageType } from "..";
import { useEvent } from "@/hooks";

export function useIframeEvent(globalIframeEvent: GlobalIframeEventType[],{rootConfig}:{
  rootConfig:ChartEditStorageType
}) {
  const iframeEmitEvent = useEvent()
  if(globalIframeEvent){
    globalIframeEvent.forEach((IframeEvent)=>{
      const propsFunConfig = computed(()=>{
        let paramsName:string[] = []
        let vars =  IframeEvent.eventArgs.map((eventArg)=>{
          paramsName.push(eventArg.field)
          return {
            label:eventArg.field,
            value:"${" + eventArg.field + "}",
            type:eventArg.type
          }
        })
        paramsName.push('rootConfig')
        return   {
          key: "IframeEvent",
          name: "iframe触发事件",
          paramsName: paramsName,
          vars: vars
        }
      })
      const {emitEvent} =  useFunction(IframeEvent,propsFunConfig.value,rootConfig)
  
      iframeEmitEvent.on(IframeEvent.eventName,(data)=>{
        let arg = Object.keys(data).map(key => data[key])
        console.log(`output->`,arg)
        emitEvent.emit(propsFunConfig.value.key,...[...arg,rootConfig])
      })
    })
  }
  return {
    iframeEmitEvent
  }
}
