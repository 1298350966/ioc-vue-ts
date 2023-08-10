import { CreateComponentType, CreateComponentGroupType, EventsType } from '@/packages/index.d'
import { EventLife } from '@/enums/eventEnum'
import * as echarts from 'echarts'
import { cloneDeep, get, set } from 'lodash'
import { EventConfigFiltersType } from '@/components/Pages/FilterConfig/type'

// 所有图表组件集合对象useLifeHandler
const components: { [K in string]?: any } = {}
// const  Map = 
// 项目提供的npm 包变量
export const npmPkgs = { echarts }



// 组件事件处理 hook
export const useLifeHandler = (chartConfig: CreateComponentType | CreateComponentGroupType, _this) => {
  if (!chartConfig.events) return {}
  const rootConfig = inject("rootConfig")
  console.log(_this);
  // 处理基础事件
  const baseEventList = {}
  const baseEvent: { [key: string]: any } = {}
  chartConfig.events.configEvents.baseEvent.forEach((configEvent) => {
    if (!baseEventList[configEvent.type]) {
      baseEventList[configEvent.type] = []
    }
    configEvent.trigger.forEach(t => {
      if (t.type == "componentList") {
        let component = rootConfig[t.type].find((c) => {
          return c.id === t.targetId
        })

        if (component) {
          const _fun = (e) => {
            let params = {
              e: e,
              data: chartConfig.option.dataset
            }
            console.log(getValue(cloneDeep(e.value), params));
            t.update.forEach(e => {
              if (e.key.length == 1) {
                component[e.key] = getValue(cloneDeep(e.value), params)
              } else {
                get(component, e.key.slice(0, -1))[e.key.slice(-1)] = getValue(cloneDeep(e.value), params)
              }

              console.log(component);
            });
          }
          baseEventList[configEvent.type].push(_fun)
        }

      } else if (t.type == "globalDialog") {
        let component = rootConfig[t.type].find((c) => {
          return c.id === t.targetId
        })
        if (component) {
          const _fun = (_e) => {
            let params = {
              e: _e,
              data: chartConfig.option.dataset
            }
            t.update.forEach(e => {
              if (e.key.length == 1) {
                component[e.key] = getValue(cloneDeep(e.value), params)
              } else {
                get(component, e.key.slice(0, -1))[e.key.slice(-1)] = getValue(cloneDeep(e.value), params)
              }
              console.log(component);
            });
          }
          baseEventList[configEvent.type].push(_fun)
        }
      }
    })
  })

  setEChartsEvents(chartConfig.events.configEvents.eChartsEvents, rootConfig, baseEventList)
  // chartConfig.events.configEvents.eChartsEvents.forEach((configEvent) => {
  //   if (!baseEventList[configEvent.type]) {
  //     baseEventList[configEvent.type] = []
  //   }
  //   configEvent.trigger.forEach(t => {
  //     let component = rootConfig[t.type].find((c) => {
  //       return c.id = t.targetId
  //     })

  //     if (component) {
  //       const _fun = (e) => {
  //         let params = {
  //           e: e,
  //           data: chartConfig.data
  //         }
  //         console.log(params);
  //         setComponentValue(t, component, params)
  //       }
  //       baseEventList[configEvent.type].push(_fun)
  //     }
  //   })
  // })
  console.log(chartConfig.events.configEvents.eChartsEvents);
  for (const key in chartConfig.events.baseEvent) {
    const fnStr: string | undefined = (chartConfig.events.baseEvent as any)[key]
    // 动态绑定基础事件
    if (fnStr) {
      if (!baseEventList[key]) {
        baseEventList[key] = []
      }
      let _fun = (e) => {
        generateBaseFunc(fnStr).bind(components[chartConfig.id], e, chartConfig, rootConfig)()
      }

      baseEventList[key].push(_fun)
    }
  }

  // 生成生命周期事件
  const events = chartConfig.events.advancedEvents || {}
  const lifeEvents = {
    [EventLife.VNODE_BEFORE_MOUNT](e: any) {
      // 存储组件
      components[chartConfig.id] = e.component
      const fnStr = (events[EventLife.VNODE_BEFORE_MOUNT] || '').trim()
      generateFunc(fnStr, e)
    },
    [EventLife.VNODE_MOUNTED](e: any) {
      const fnStr = (events[EventLife.VNODE_MOUNTED] || '').trim()
      generateFunc(fnStr, e)
    }
  }

  for (const key in baseEventList) {
    baseEvent[key] = (e) => {
      console.log(e, chartConfig, rootConfig);
      baseEventList[key].forEach(_fun => {
        _fun(e)
      });
    }
  }
  return { ...baseEvent, ...lifeEvents }
}

/**
 * 生成基础函数
 * @param fnStr 用户方法体代码
 * @param event 鼠标事件
 */
export function generateBaseFunc(fnStr: string) {
  try {
    return new Function(`
      return (
        async function(mouseEvent,config,$root){
          ${fnStr}
        }
      )`)()
  } catch (error) {
    console.error(error)
  }
}

/**
 * 生成高级函数
 * @param fnStr 用户方法体代码
 * @param e 执行生命周期的动态组件实例
 */
function generateFunc(fnStr: string, e: any) {
  try {
    // npmPkgs 便于拷贝 echarts 示例时设置option 的formatter等相关内容
    Function(`
      "use strict";
      return (
        async function(e, components, node_modules){
          const {${Object.keys(npmPkgs).join()}} = node_modules;
          ${fnStr}
        }
      )`)().bind(e?.component)(e, components, npmPkgs)
  } catch (error) {
    console.error(error)
  }
}


function getValue(value, data) {
  if (typeof value === "object") {
   
    for (const key in value) {
      const e = value[key];
      value[key] = getValue(e, data)
    }
    return value
  } else if (typeof value === "string") {
    if(/\$\{([^\}]+)\}/g.test(value)){
    value.replace(/\$\{([^\}]+)\}/g, (_, key) => {
      if(/\(\)/.test(key)){
        value = eval("data." + key)
      }else{
        value = get(data, key)
      }
      return _
    });
    }
    return value
  } else {
    return value
  }
}


function setEChartsEvents(eChartsEvents, rootConfig, baseEventList) {
  eChartsEvents.forEach((configEvent) => {
    if (!baseEventList[configEvent.type]) {
      baseEventList[configEvent.type] = []
    }
    configEvent.trigger.forEach(t => {
      console.log(`output->`, rootConfig, t)
      let component = rootConfig[t.type].find((c) => {
        return c.id == t.targetId
      })
      if (component) {
        const _fun = (e) => {
          let params = {
            e: e,
            // data: data
          }
          setComponentValue(t, component, params)
          console.log(component);
        }
        baseEventList[configEvent.type].push(_fun)
      }
    })
  })
}



export function setComponentValue(event, component, params) {
  console.log(event, component, params);
  Object.keys(event.updateValue).map((key) => {
    let keyStr = `${key}`
    if (Array.isArray(event.updateValue[key])) {
      let obj = {}
      event.updateValue[key].forEach((e) => {
        obj[e.key] = e.value
      })
      var updateDateValue = getValue(cloneDeep(obj), params)
    } else {
      var updateDateValue = getValue(cloneDeep(event.updateValue[key]), params)
    }

    try {
      if (typeof updateDateValue == "object") {
        let componentKeyList = get(component, key)
        let {targetId,updateValue} = event.updateValue[key]
        if(Array.isArray(componentKeyList) && targetId && updateValue){
          let componentKey = componentKeyList.find((c)=>{
            return targetId ==  c.id
          })
          if(componentKey){
            setComponentValue(event.updateValue[key], componentKey, params)
          }
        }else{
          Object.assign(get(component, keyStr), updateDateValue)
        }
      } else {
          set(component, key, updateDateValue)
      }
    } catch (error) {
      console.log(error);
    }
  })
}




//设置事件
export function setConfigEvents(componentEvents, emit, Events: EventsType, extArgs: any[],_this=null) {
  let rootConfig = extArgs[1]
  if(!rootConfig) return 
  componentEvents.forEach((configEvent) => {
    configEvent.trigger.forEach(t => {
      let component = rootConfig[t.type].find((c) => {
        return c.id === t.targetId
      })
      if (component) {
        const _fun = (...args) => {
          const argsName = Events[configEvent.type].paramsName
          let _args = {}
          let end = argsName.length - extArgs.length
          argsName.slice(0, end > 0 ? end : 0).forEach((e, index) => {
            _args[e] = args[index]
          })
          argsName.slice(end, argsName.length).forEach((e, index) => {
            _args[e] = extArgs[index]
          }) 
          if(!checkFiltersFun(configEvent.filters,_args))  return
          setComponentValue(t, component, _args)
          console.log(component);
        }
        emit.on(configEvent.type,_fun.bind(_this))
      }
    })
  })
}

//设置代码事件
export function setCodeEvents(componentEvents, emit, Events: EventsType, extArgs:any[],_this=null) {
  Object.keys(componentEvents).forEach(key => {
    emit.on(key, (...args) => {
      const argsName = Events[key].paramsName
      const _args = []
      let end = argsName.length - extArgs.length
      argsName.slice(0, end > 0 ? end : 0).forEach((e,index) => {
        _args.push(args[index])
      })    
      extArgs.forEach((e) => {
        _args.push(e)
      }) 
      try {
        new Function(...argsName, componentEvents[key]).call(_this, ..._args)
      } catch (error:any) {
        console.error(error)
      }
    })
  })
}



export function checkFiltersFun(filters:EventConfigFiltersType,_args){
  if(!filters || filters.conditions.length == 0) return true
  let str = ""
  filters.conditions.forEach((c)=>{
    let c_str = ""
    c.conditions.forEach((condition)=>{
      let condition_str = ""
      condition_str += "getValue(condition.key,_args)"
      condition_str += condition.condition
      condition_str += "getValue(condition.value,_args)"
      if(c_str){
        c_str += c.type + eval(condition_str)
      }else{
        c_str += eval(condition_str)
      }
    })
    if(str){
      str += filters.type + eval(c_str)
    }else{
      str += eval(c_str)
    }
  })
  return eval(str)
}