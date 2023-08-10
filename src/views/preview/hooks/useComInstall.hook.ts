import { ref } from 'vue'
import { ChartEditStorageType } from '../index.d'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { fetchChartComponent, fetchDialogComponent } from '@/packages/index'

export const useComInstall = (localStorageInfo: ChartEditStorageType) => {
  const show = ref(false)

  // 注册组件(一开始无法获取window['$vue'])
  const intervalTiming = setInterval(() => {
    if (window['$vue'].component) {
      clearInterval(intervalTiming)

      const intComponent = (target: CreateComponentType) => {
        if (!window['$vue'].component(target.chartConfig.chartKey)) {
          window['$vue'].component(target.chartConfig.chartKey, fetchChartComponent(target.chartConfig))
        }
      }

      localStorageInfo.componentList.forEach(async (e: CreateComponentType | CreateComponentGroupType) => {
        if (e.isGroup) {
          e.groupList.forEach(groupItem => {
            intComponent(groupItem)
          })
        } else {
          intComponent(e as CreateComponentType)
        }
      })
      localStorageInfo.globalDialog.forEach(async(e)=>{
        if (!window['$vue'].component(e.component)) {
          window['$vue'].component(e.component, fetchDialogComponent(e.component))
        }
        if (!window['$vue'].component(e.body.component.is)) {
          window['$vue'].component(e.body.component.is, fetchDialogComponent(e.body.component.is))
        }
      })
      show.value = true
    }
  }, 200)

  return {
    show
  }
}
