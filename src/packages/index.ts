import { ChartList, ChartsEvents } from '@/packages/components/Charts/index'
import { DecorateList } from '@/packages/components/Decorates/index'
import { InformationList } from '@/packages/components/Informations/index'
import { TableList } from '@/packages/components/Tables/index'
import { FormList, FormsEvents } from '@/packages/components/Forms/index'
import {CustomList} from "@/packages/components/Custom"
import {
  PackagesCategoryEnum,
  PackagesType,
  ConfigType,
  FetchComFlagType,
  EventsMapType
} from '@/packages/index.d'


const configModules: any = import.meta.glob("./components/**/config.vue")
const indexModules: any = import.meta.glob("./components/**/index.vue")
const eventsModules: any = import.meta.glob('./components/**/events.vue')
const imagesModules: any = import.meta.glob('../assets/images/chart/**', { eager: true })

// * 所有图表
export let packagesList: PackagesType = {
  [PackagesCategoryEnum.CHARTS]: ChartList,
  [PackagesCategoryEnum.INFORMATIONS]: InformationList,
  [PackagesCategoryEnum.TABLES]: TableList,
  [PackagesCategoryEnum.DECORATES]: DecorateList,
  [PackagesCategoryEnum.FORMS]: FormList,
  [PackagesCategoryEnum.CUSTOM]: CustomList
}

//组件事件
export const componentsEvents: EventsMapType = {
  ...ChartsEvents,
  ...FormsEvents,
}
export const getComponentEvents = (key:string)=>{
  return componentsEvents[key] 
}
/**
 * * 获取目标组件配置信息
 * @param targetData
 */
export const createComponent = async (targetData: ConfigType) => {
  const { category, key } = targetData
  console.log(`output->`,`./components/${targetData.package}/${category}/${key}/config.ts`)
  const chart = await import(`./components/${targetData.package}/${category}/${key}/config.ts`)
  return new chart.default()
}

/**
 * * 获取组件
 * @param {string} chartName 名称
 * @param {FetchComFlagType} flag 标识 0为展示组件, 1为配置组件
 */
const fetchComponent = (chartName: string, flag: FetchComFlagType) => {
  const module = flag === FetchComFlagType.VIEW ? indexModules : configModules
  for (const key in module) {
    const urlSplit = key.split('/')
    if (urlSplit[urlSplit.length - 2] === chartName) {
      return defineAsyncComponent(module[key])
    }
  }
}

/**
 * * 获取展示组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchChartComponent = (dropData: ConfigType) => {
  const { key } = dropData
  return fetchComponent(key, FetchComFlagType.VIEW)
}

/**
 * * 获取配置组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchConfigComponent = (dropData: ConfigType) => {
  const { key } = dropData
  return fetchComponent(key, FetchComFlagType.CONFIG)
}

/**
 * * 获取图片内容
 * @param {ConfigType} targetData 配置项
 */
export const fetchImages = async (targetData?: ConfigType) => {
  if (!targetData) return ''
  // 新数据动态处理
  const { image, package: targetDataPackage } = targetData
  // 兼容旧数据
  if (image.includes('@') || image.includes('base64')) return image

  const imageName = image.substring(image.lastIndexOf('/') + 1)
  for (const key in imagesModules) {
    const urlSplit = key.split('/')
    if (urlSplit[urlSplit.length - 1] === imageName) {
      return imagesModules[key]?.default
    }
  }
  return ''
}


/**
 * * 获取事件组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchEventsComponent = (key: string) => {
  const module = eventsModules
  for (const moduleKey in module) {
    const urlSplit = moduleKey.split('/')
    if (urlSplit[urlSplit.length - 2] === key) {
      let component = defineAsyncComponent(module[moduleKey])
      return component
    }
  }
}

const dialogConfigModules = import.meta.glob('@/packages/dialog/**/config.vue')
const dialogIndexModules = import.meta.glob('@/packages/dialog/**/index.vue')
const dialogIndexConfig = import.meta.glob('@/packages/dialog/**/config.ts')

/**
 * * 获取展示组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchDialogComponent = (key: string) => {
  let component = dialogFetchComponent(key, FetchComFlagType.VIEW)
  if (component) {
    return defineAsyncComponent(component)
  }
}

/**
 * * 获取配置组件
 * @param {ConfigType} dropData 配置项
 */
export const fetchDialogConfig = (key: string) => {
  let component = dialogFetchComponent(key, FetchComFlagType.CONFIG)
  if (component) {
    return defineAsyncComponent(component)
  }

}

const dialogFetchComponent = (chartName: string, flag: FetchComFlagType) => {
  const module = flag === FetchComFlagType.VIEW ? dialogIndexModules : dialogConfigModules
  for (const key in module) {
    const urlSplit = key.split('/')
    if (urlSplit[urlSplit.length - 2] === chartName) {
      return module[key]
    }
  }
}

export const getDialogConfig = async (name) => {
  const module = dialogIndexConfig
  for (const key in module) {
    const urlSplit = key.split('/')
    if (urlSplit[urlSplit.length - 2] === name) {
      return module[key]()
    }
  }
}