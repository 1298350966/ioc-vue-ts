import { ref, toRefs, toRaw, watch } from 'vue'
import type VChart from 'vue-echarts'
import { customizeHttp } from '@/api/http'
import { useChartDataPondFetch } from '@/hooks/'
import { CreateComponentType, ChartFrameEnum, CoverGroupType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { RequestDataTypeEnum } from '@/enums/httpEnum'
import { isPreview, newFunctionHandle, intervalUnitHandle, JSONParse, getArrayData } from '@/utils'
import { setOption } from '@/packages/public/chart'
import { RequestGlobalConfigType } from '@/store/modules/chartEditStore/chartEditStore.d'

// 获取类型
type ChartEditStoreType = typeof useChartEditStore

/**
 * setdata 数据监听与更改
 * @param targetComponent
 * @param requestGlobalConfig 全局接口
 * @param updateCallback 自定义更新函数
 */
export const useChartDataFetch = (
  targetComponent: CreateComponentType|CoverGroupType,
  requestGlobalConfig: RequestGlobalConfigType,
  updateCallback?: (...args: any) => any
) => {
  const vChartRef = ref<typeof VChart | null>(null)
  let fetchInterval: any = 0

  // 数据池
  // const { addGlobalDataInterface } = useChartDataPondFetch()

  // 组件类型
  // const { chartFrame } = targetComponent.chartConfig

  // // eCharts 组件配合 vChart 库更新方式
  // const echartsUpdateHandle = (data: any) => {
  //   if (!data && Array.isArray(data)) return
  //   if (chartFrame === ChartFrameEnum.ECHARTS) {
  //     if (vChartRef.value) {
  //       if (Array.isArray(targetComponent.option.dataset)) {
  //         setOption(vChartRef.value, {
  //           dataset: data
  //         })
  //       } else {
  //         setOption(vChartRef.value, {
  //           dataset: {
  //             dimensions: targetComponent.option.dataset.dimensions,
  //             source: data
  //           }
  //         })
  //       }
  //     }
  //   }
  // }

  const requestIntervalFn = () => {
    // const chartEditStore = useChartEditStore()

    // 全局数据
    const {
      requestOriginUrl,
      requestIntervalUnit: globalUnit,
      requestInterval: globalRequestInterval
    } = toRefs(requestGlobalConfig)

    // 目标组件
    const {
      requestDataType,
      requestUrl,
      requestIntervalUnit: targetUnit,
      requestInterval: targetInterval
    } = toRefs(targetComponent.request)

    // 非请求类型
    if (requestDataType.value == RequestDataTypeEnum.STATIC) {
      return
    }

    try {
      // 处理地址
      // @ts-ignore
      if (requestUrl?.value) {
        // requestOriginUrl 允许为空
        const completePath = requestOriginUrl && requestOriginUrl.value + requestUrl.value
        if (!completePath) return

        clearInterval(fetchInterval)

        const fetchFn = async () => {
          const res = await customizeHttp(toRaw(targetComponent.request), toRaw(requestGlobalConfig))
          if (res) {
            try {
              let { filter, filterNode } = targetComponent
              if (!filter && filterNode) {
                filter = "return data." + filterNode
              }
              const { data } = res
              targetComponent.data = newFunctionHandle(data, res, filter)

              // 更新回调函数
              if (updateCallback) {

                updateCallback(newFunctionHandle(data, res, filter), res)
              }
            } catch (error) {
              console.error(error)
            }
          }
        }
        console.log(`request->`, targetComponent.request)
        // 普通初始化与组件交互处理监听
        watch(
          () => targetComponent.request,
          (nweVL) => {
            console.log(`output->`, nweVL)
            fetchFn()
          },
          {
            immediate: true,
            deep: true
          }
        )

        // 定时时间
        const time = targetInterval && targetInterval.value ? targetInterval.value : globalRequestInterval.value
        // 单位
        const unit = targetInterval && targetInterval.value ? targetUnit.value : globalUnit.value
        // 开启轮询
        if (time) fetchInterval = setInterval(fetchFn, intervalUnitHandle(time, unit))
      }
      // eslint-disable-next-line no-empty
    } catch (error) {
      console.log(error)
    }
  }

  if (isPreview()) {
    // 判断是否是数据池类型
    // targetComponent.request.requestDataType === RequestDataTypeEnum.Pond
    //   ? addGlobalDataInterface(targetComponent, useChartEditStore, updateCallback)
    //   : requestIntervalFn()
    requestIntervalFn()
  }
  return { vChartRef }
}


