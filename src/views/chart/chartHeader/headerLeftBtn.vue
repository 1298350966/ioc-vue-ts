<template>
  <div>
    <el-tooltip effect="dark"  v-for="item in btnList" :content="item.title">
      <el-button  @click="clickHandle(item)" :type="item.select ? 'primary' : ''">
        <component :is="item.icon"></component>
      </el-button>
    </el-tooltip>
  </div>
</template>

<script setup lang="ts">
import { toRefs, Ref, reactive, computed } from 'vue'
import { renderIcon, goDialog, goHome } from '@/utils'
import { icon } from '@/plugins'
// import { useRemoveKeyboard } from '../../hooks/useKeyboard.hook'

import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'

import { useChartHistoryStore } from '@/store/modules/chartHistoryStore/chartHistoryStore'
import { HistoryStackEnum } from '@/store/modules/chartHistoryStore/chartHistoryStore.d'

import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { OpenPanelFilledLeft, OpenPanelFilledRight } from '@vicons/carbon'

const {  LayersIcon, BarChartIcon, PrismIcon, HomeIcon, ArrowBackIcon, ArrowForwardIcon } = icon.ionicons5
const { setItem } = useChartLayoutStore()
const { getLeftSidebar, getRightSidebar } = toRefs(useChartLayoutStore())
const chartEditStore = useChartEditStore()
const chartHistoryStore = useChartHistoryStore()

interface ItemType<T> {
  key: T
  select: Ref<boolean> | boolean
  title: string
  icon: any
}

const btnList = reactive<ItemType<ChartLayoutStoreEnum>[]>([
  // {
  //   key: ChartLayoutStoreEnum.CHARTS,
  //   select: getCharts,
  //   title: '图表组件',
  //   icon: renderIcon(BarChartIcon)
  // },
  {
    key: ChartLayoutStoreEnum.LEFT_SIDEBAR,
    select: getLeftSidebar,
    title: '切换左侧栏',
    icon: renderIcon(OpenPanelFilledLeft)
  },
  {
    key: ChartLayoutStoreEnum.RIGHT_SIDEBAR,
    select: getRightSidebar,
    title: '切换右侧栏',
    icon: renderIcon(OpenPanelFilledRight)
     
  }
])

const isBackStack = computed(()=> chartHistoryStore.getBackStack.length> 1)

const isForwardStack = computed(()=> chartHistoryStore.getForwardStack.length> 0)

const historyList = reactive<ItemType<HistoryStackEnum>[]>([
  {
    key: HistoryStackEnum.BACK_STACK,
    // 一定会有初始化画布
    select: isBackStack,
    title: '后退',
    icon: renderIcon(ArrowBackIcon)
  },
  {
    key: HistoryStackEnum.FORWARD_STACK,
    select: isForwardStack,
    title: '前进',
    icon: renderIcon(ArrowForwardIcon)
  }
])


// store 描述的是展示的值，所以和 ContentConfigurations 的 collapsed 是相反的
const styleHandle = (item: ItemType<ChartLayoutStoreEnum>) => {
  if (item.key === ChartLayoutStoreEnum.DETAILS) {
    return item.select ? '' : 'primary'
  }
  return item.select ? 'primary' : ''
}

// 布局处理
const clickHandle = (item: ItemType<ChartLayoutStoreEnum>) => {
  setItem(item.key, !item.select)
}

// 历史记录处理
const clickHistoryHandle = (item: ItemType<HistoryStackEnum>) => {
  switch (item.key) {
    case HistoryStackEnum.BACK_STACK:
      chartEditStore.setBack()
      break;
    case HistoryStackEnum.FORWARD_STACK:
      chartEditStore.setForward()
      break;
  }
}

// 返回首页
const goHomeHandle = () => {
  goDialog({
    message: '返回将不会保存任何操作',
    isMaskClosable: true,
    onPositiveCallback: () => {
      goHome()
      // useRemoveKeyboard()
    }
  })
}
</script>
<style lang="scss" scoped>
.header-left-btn {
  margin-left: -37px;
 }
</style>