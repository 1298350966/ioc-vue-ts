import { setCodeEvents, setConfigEvents, useEvent } from "@/hooks";
import { ChartEditStorageType } from "@/views/preview";
import { EventsType } from "../index.d";

export function useAddEvent(chartConfig, Events: EventsType) {
  const rootConfig:ChartEditStorageType = inject("rootConfig")
  const getEvents = computed(() => {
    let events:{
      [T:string]:Function
    } = {};
    const emitEvent = useEvent()
    if (chartConfig.option.events) {
      setCodeEvents(chartConfig.option.events, emitEvent, Events, [chartConfig, rootConfig])
    }
    //添加配置事件
    if (chartConfig.events.configEvents.componentEvents) {
      setConfigEvents(chartConfig.events.configEvents.componentEvents, emitEvent, Events, [chartConfig, rootConfig])
    }
    Object.keys(emitEvent.all).forEach((key) => {
      events[key] = (...args) => {
        emitEvent.emit(key, ...args)
      }
    })
    return events;
  })
  return { rootConfig, getEvents }
}
//添加地圖事件
export function useAddMapEvent(config, Events: EventsType) {
  const rootConfig:ChartEditStorageType = inject("rootConfig")
  const getEvents = computed(() => {
    let events = {};
    const emitEvent = useEvent()
    const _this = getCurrentInstance()
    if(rootConfig){
      if (config.events.codeEvents) {
        console.log(`output->getCurrentInstance()`,_this)
        setCodeEvents(config.events.codeEvents.baseEvent, emitEvent, Events, [config, rootConfig],_this)
      }
      //添加配置事件
      if (config.events.configEvents.componentEvents) {
        setConfigEvents(config.events.configEvents.componentEvents, emitEvent, Events, [config, rootConfig],_this)
      }
    }
    Object.keys(emitEvent.all).forEach((key) => {
      events[key] = (...args) => {
        emitEvent.emit(key, ...args)
      }
    })
    return events;
  })
  return { rootConfig, getEvents }
}


