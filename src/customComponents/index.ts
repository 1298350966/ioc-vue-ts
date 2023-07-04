import { mapConfig } from "./map";

export const customComponentsConfig = [
  {
    name:"地图",
    list:mapConfig
  }
]
  
const customComponentsVue = import.meta.glob('@/customComponents/**/index.vue')

export function getAsyncCustomComponents(componentName) {
  const module = customComponentsVue
  for (const key in module) {
    const urlSplit = key.split('/')
    if (urlSplit[urlSplit.length - 2] === componentName) {
      return defineAsyncComponent(module[key])
    }
  }
}