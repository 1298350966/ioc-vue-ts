import { UseEventType, setCodeEvents, setConfigEvents, useEvent } from "@/hooks";
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
export function useAddMapEvent(config, Events: EventsType, cb:(emitEvent: UseEventType) => void = undefined )   {
  const rootConfig:ChartEditStorageType = inject("rootConfig")
  const mapEvents = ref<{
    [T:string]:Function
  }>({});
  const getEvents = computed(()=>{
    return mapEvents.value
  })
  function setEvents(){
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
    cb && cb(emitEvent)
    Object.keys(emitEvent.all).forEach((key) => {
      events[key] = (...args) => {
        emitEvent.emit(key, ...args)
      }
    })
    mapEvents.value = events;
  }
  watch(()=>[config.events.codeEvents,config.events.configEvents.componentEvents],()=>{
    setEvents()
  },{
    deep:true,
    immediate:true
  })
  return { rootConfig, getEvents,setEvents }
}


