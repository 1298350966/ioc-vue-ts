import { findOneViewsHttp } from "@/api/apiHttp/views";
import { JSONParse } from "@/utils";
import { ChartEditStorage } from '@/store/modules/chartEditStore/chartEditStore.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
const chartEditStore = useChartEditStore()
// 根据路由 id 获取存储数据的信息
export const useStoreInfo = () => {
  const route = useRoute()
  const {id} = route.params
  onMounted(()=>{
    setStoreInfo()
  })
  async function setStoreInfo(){
    const res = await findOneViewsHttp(id as string)
    if(!res.data) return
    if(!res.data.config) return
    const { editCanvasConfig, requestGlobalConfig, componentList,globalDialog,globalFunction } = JSONParse(res.data.config)
    chartEditStore.editCanvasConfig = editCanvasConfig
    chartEditStore.requestGlobalConfig = requestGlobalConfig
    chartEditStore.componentList = componentList
    chartEditStore.globalDialog = globalDialog
  }
  return  {
    setStoreInfo
  }
}