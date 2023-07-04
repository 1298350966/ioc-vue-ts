<template>
  <el-space class="go-mt-0">
    <el-button v-for="item in btnList" :key="item.title" ghost @click="item.event">
      <template #icon>
        <component :is="item.icon"></component>
      </template>
      <span>{{ item.title }}</span>
    </el-button>
    <el-dialog></el-dialog>
    <drag-dialog v-model="sendDialogShow" title="发布" width="500px">
        <div>
        
        </div>
    </drag-dialog>
  </el-space>
</template>
<script setup lang="ts">
import { shallowReactive } from 'vue'
import { renderIcon, goDialog, fetchPathByName, routerTurnByPath, setSessionStorage, getLocalStorage, JSONStringify, getCanvasCutImg, base64ToFile } from '@/utils'
import { PreviewEnum } from '@/enums/pageEnum'
import { StorageEnum } from '@/enums/storageEnum'
import { useRoute } from 'vue-router'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { EditCanvasTypeEnum } from '@/store/modules/chartEditStore/chartEditStore.d'
import { icon } from '@/plugins'
import { uploadHttp } from '@/api/apiHttp/file'
import { addViewsHttp,updateViewsHttp } from '@/api/apiHttp/views'
const router = useRouter()
const { BrowsersOutlineIcon, SendIcon } = icon.ionicons5
const chartEditStore = useChartEditStore()

const routerParamsInfo = useRoute()

// 预览
const previewHandle = () => {
  const path = fetchPathByName(PreviewEnum.CHART_PREVIEW_NAME, 'href')
  if (!path) return
  const { id } = routerParamsInfo.params
  // id 标识
  const previewId = typeof id === 'string' ? id : id[0]
  const storageInfo = chartEditStore.getStorageInfo
  const sessionStorageInfo = getLocalStorage(StorageEnum.GO_CHART_STORAGE_LIST) || []

  if (sessionStorageInfo?.length) {
    const repeateIndex = sessionStorageInfo.findIndex((e: { id: string }) => e.id === previewId)
    // 重复替换
    if (repeateIndex !== -1) {
      sessionStorageInfo.splice(repeateIndex, 1, { id: previewId, ...storageInfo })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    } else {
      sessionStorageInfo.push({
        id: previewId, ...storageInfo
      })
      setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, sessionStorageInfo)
    }
  } else {
    setSessionStorage(StorageEnum.GO_CHART_STORAGE_LIST, [{ id: previewId, ...storageInfo }])
  }
  // 跳转
  routerTurnByPath(path, [previewId], undefined, true)
}


const  sendDialogShow = ref(false)
// 发布
const sendHandle =async () => {
  const { id } = routerParamsInfo.params
  const { type } = routerParamsInfo.query
  const range = document.querySelector('.go-edit-range') as HTMLElement
  const config = JSON.stringify(chartEditStore.getStorageInfo)
  const img = await getCanvasCutImg(range)
  let res = await uploadHttp(base64ToFile(img))
  let imgSrc =  res.data && res.data.path
  let params = {
    name:chartEditStore.getEditCanvasConfig.projectName,
    imgSrc:imgSrc,
    config:config
  }
  type == "update" ?  await updateViewsHttp(id as string, params)  : await addViewsHttp(params)
  // updateViewsHttp()
  window.$message.success("保存成功")
  router.go(-1)
  // sendDialogShow.value = true
  // goDialog({
  //   message: '<div>111</div>',
  //   positiveText: '了然',
  //   closeNegativeText: true,
  //   onPositiveCallback: () => {}
  // })
}

const btnList = shallowReactive([
  {
    select: true,
    title: '预览',
    icon: renderIcon(BrowsersOutlineIcon),
    event: previewHandle
  },
  {
    select: true,
    title: '发布',
    icon: renderIcon(SendIcon),
    event: sendHandle
  }
])

</script>
<style lang="scss" scoped>
.align-center {
  margin-top: -4px;
}
</style>
<!-- export const exportHandle = () => {
  // 取消选中
  chartEditStore.setTargetSelectChart(undefined)

  // 导出数据
  downloadTextFile(
    JSONStringify(chartEditStore.getStorageInfo || []),
    undefined,
    'json'
  )

  // 导出图片
  const range = document.querySelector('.go-edit-range') as HTMLElement
  // const watermark = document.getElementById('go-edit-watermark')
  // 隐藏边距线
  // if (!range || !watermark) {
  if (!range) {
    window['$message'].error('导出失败！')
    return
  }

  // 记录缩放比例
  const scaleTemp = chartEditStore.getEditCanvas.scale
  // 百分百展示页面
  chartEditStore.setScale(1, true)
  // 展示水印
  // watermark.style.display = 'block'

  setTimeout(() => {
    canvasCut(range, () => {
      // 隐藏水印
      // if (watermark) watermark.style.display = 'none'
      // 还原页面大小
      chartEditStore.setScale(scaleTemp, true)
    })
  }, 600)
} -->