import { EventConfigType, EventTriggerConfigType, EventType } from "@/packages/index.d";
import { ChartEditStorageType } from "../utils";
import { checkFiltersFun, setCodeEvents, setComponentValue, setConfigEvents, useEvent } from "@/hooks";

export function useFunction(config:{
  fun:string,
  configFun:EventConfigType
}, Event: EventType,rootConfig:ChartEditStorageType) {
  const emitEvent= useEvent()
  if (config.fun) {
    emitEvent.on(Event.key, (...args: any) => {
      new Function(...Event.paramsName,config.fun).call(this,...args)
    })
  }
  //添加配置事件
  if (config.configFun) {
    emitEvent.on(Event.key, (...args) => {
      debugger
      config.configFun.trigger.forEach(t => {
        let component = rootConfig[t.type].find((c) => {
          return c.id === t.targetId
        })
        if (component) {
            const argsName = Event.paramsName
            let _args = {}
            argsName.forEach((e, index) => {
              _args[e] = args[index]
            })
            if(!checkFiltersFun(config.configFun.filters,_args))  return
            console.log(`output->`,_args)
            setComponentValue(t, component, _args) 
        }
      })
    })
  }
  
  return { emitEvent }
}


