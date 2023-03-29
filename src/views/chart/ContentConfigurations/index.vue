<template>
  <div class="chart-layout">
    <div class="layout-content">
      <ContentEdit></ContentEdit>
    </div>
    <div class="layout-aside" >
      <content-box class="kh-content-layers" :showTop="false" >
        <el-tabs v-if="!selectTarget" v-model="tabsSelect" class="demo-tabs">
          <el-tab-pane v-for="item in globalTabList" :label="item.title" :name="item.key">
            <template #label>
              <el-space>
                <span>{{ item.title }}</span>
              </el-space>
            </template>
            <component :is="item.render"></component>
          </el-tab-pane>
        </el-tabs>
        <el-tabs v-if="selectTarget" v-model="tabsSelect" class="demo-tabs">
          <el-tab-pane style="padding:5px 10px;" v-for="item in selectTarget.isGroup ? chartsDefaultTabList : chartsTabList" :label="item.title"
            :name="item.key">
            <template #label>
              <el-space>
                <span>{{ item.title }}</span>
              </el-space>
            </template>
            <component :is="item.render" ></component>
          </el-tab-pane>
        </el-tabs>
      </content-box>
    </div>
  </div>
</template>

<script lang="ts" setup name="ContentConfigurations">
import { reactive, toRefs, computed, watch, ref } from 'vue';
import { ContentEdit } from '../ContentEdit/index';
import { TabsEnum } from './index.d'
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { loadAsyncComponent } from '@/utils'
import { ContentBox } from '../ContentBox/index';
const CanvasPage = loadAsyncComponent(() => import('./components/CanvasPage/index.vue'))
const ChartAnimation = loadAsyncComponent(() => import('./components/ChartAnimation/index.vue'))
const ChartSetting = loadAsyncComponent(() => import('./components/ChartSetting/index.vue'))
const ChartEvent = loadAsyncComponent(() => import('./components/ChartEvent/index.vue'))
const { getDetails } = toRefs(useChartLayoutStore())
const { setItem } = useChartLayoutStore()

const chartEditStore = useChartEditStore()

const tabsSelect = ref<TabsEnum>(TabsEnum.PAGE_SETTING)
console.log(CanvasPage);
// 页面设置
const globalTabList = [
  {
    key: TabsEnum.PAGE_SETTING,
    title: '页面配置',
    render: CanvasPage
  }
]
const collapsedHandle = () => {
  setItem(ChartLayoutStoreEnum.DETAILS, true)
}

const expandHandle = () => {
  setItem(ChartLayoutStoreEnum.DETAILS, false)
}

const selectTarget = computed(() => {
  
  const selectId = chartEditStore.getTargetChart.selectId
  // 排除多个
  if (selectId.length !== 1){
    tabsSelect.value = TabsEnum.PAGE_SETTING
    return undefined
  } 
  const target = chartEditStore.componentList[chartEditStore.fetchTargetIndex()]
  if (target?.isGroup) {
    // eslint-disable-next-line vue/no-side-effects-in-computed-properties
    tabsSelect.value = TabsEnum.CHART_SETTING
  }else{
    tabsSelect.value = TabsEnum.CHART_SETTING
  }
  
  return target
})

watch(getDetails, newData => {
  if (newData) {
    collapsedHandle()
  } else {
    expandHandle()
  }
})

const chartsDefaultTabList = [
  {
    key: TabsEnum.CHART_SETTING,
    title: '定制',
    render: ChartSetting
  },
  {
    key: TabsEnum.CHART_ANIMATION,
    title: '动画',
    render: ChartAnimation
  }
]

const chartsTabList = [
  ...chartsDefaultTabList,
  {
    key: TabsEnum.CHART_DATA,
    title: '数据',
    render: null
  },
  {
    key: TabsEnum.CHART_EVENT,
    title: '事件',
    // icon: RocketIcon,
    render: ChartEvent
  }
]
</script>

<style lang="scss" scoped>
.chart-layout {
  --el-bg-color-overlay: #333333;
  height: 100%;
  width: 100%;
  display: flex;
  flex: 1;
  box-sizing: border-box;
  position: relative;
  overflow: hidden;

  .layout-content {
    flex: 1;
    height: 100%;
    position: relative;
    overflow: hidden;
  }

  .layout-aside {
    width: 350px;
    height: 100%;
    background: $--color-dark-bg-2;
  }

}

.none {
  display: none;
}
</style>