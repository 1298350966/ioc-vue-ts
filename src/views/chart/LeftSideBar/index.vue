<template>
  <div class="LeftSideBar" :style="leftSideBarStyle" >
    <el-tabs v-model="tabName" class="LeftTabs"  tab-position="left" style="height: 100%" >
      <el-tab-pane label="组件" name="1" lazy>
        <template #label>
          <el-tooltip content="组件" placement="right">
            <el-icon size="20px">
              <BarChartIcon />
            </el-icon>
          </el-tooltip>
        </template>
        <ContentCharts></ContentCharts>
      </el-tab-pane>
      <el-tab-pane label="图层" name="2" lazy>
        <template #label>
          <el-tooltip content="图层" placement="right">
            <el-icon size="20px">
              <LayersIcon />
            </el-icon>
          </el-tooltip>
        </template>
        <ContentLayers></ContentLayers>
      </el-tab-pane>
      <el-tab-pane label="全局变量" name="3" lazy>
        <template #label>
          <el-tooltip content="全局变量" placement="right">
            <el-icon size="20px">
              <ValueVariable />
            </el-icon>
          </el-tooltip>
        </template>
         <GlobalVar></GlobalVar> 
      </el-tab-pane>
      <el-tab-pane label="公共接口" name="4" lazy>
        <template #label>
          <el-tooltip content="公共接口" placement="right">
            <el-icon size="20px">
              <GatewayApi />
            </el-icon>
          </el-tooltip>
        </template>
         <GlobalRequest></GlobalRequest> 
      </el-tab-pane>
      <el-tab-pane label="公共方法" name="5" lazy>
        <template #label>
          <el-tooltip content="公共方法" placement="right">
            <el-icon size="20px">
              <FunctionIcon />
            </el-icon>
          </el-tooltip>
        </template>
        <GlobalFunction></GlobalFunction> 
      </el-tab-pane>
      <el-tab-pane label="弹窗" name="6" lazy>
        <template #label>
          <el-tooltip content="弹窗" placement="right">
            <el-icon size="20px">
              <BrowsersOutline />
            </el-icon>
          </el-tooltip>
        </template>
        <GlobalDialog></GlobalDialog> 
      </el-tab-pane>
      <el-tab-pane label="组件传参" name="7" lazy>
        <template #label>
          <el-tooltip content="组件传参" placement="right">
            <el-icon size="21px">
              <DataConnected />
            </el-icon>
          </el-tooltip>
        </template>
        <GlobalProps></GlobalProps>
      </el-tab-pane>
      <el-tab-pane label="Iframe通讯触发事件定义" name="8" lazy>
        <template #label>
          <el-tooltip content="Iframe通讯触发事件定义" placement="right">
            <el-icon size="21px">
              <FunctionMath />
            </el-icon>
          </el-tooltip>
        </template>
        <GlobalIframeEvent></GlobalIframeEvent>
      </el-tab-pane>
      
      <el-tab-pane label="公共样式" name="9" lazy>
        <template #label>
          <el-tooltip content="公共样式" placement="right">
            <el-icon size="21px">
              <LogoCss3 />
            </el-icon>
          </el-tooltip>
        </template>
        <GlobalStyle></GlobalStyle>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { loadAsyncComponent } from '@/utils'
import { icon } from '@/plugins'
import { BrowsersOutline,LogoCss3 } from '@vicons/ionicons5';
import { GatewayApi,Function as FunctionIcon ,ValueVariable,DataConnected,FunctionMath} from '@vicons/carbon';
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import { ChartLayoutStoreEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d';

const { LayersIcon, BarChartIcon, PrismIcon, HomeIcon, ArrowBackIcon, ArrowForwardIcon } = icon.ionicons5
const ContentLayers = loadAsyncComponent(() => import('../ContentLayers/index.vue'))
const ContentCharts = loadAsyncComponent(() => import('../ContentCharts/index.vue'))
const GlobalVar = loadAsyncComponent(() => import('../GlobalVar/index.vue'))
const GlobalRequest = loadAsyncComponent(() => import('../GlobalRequest/index.vue'))
const GlobalFunction = loadAsyncComponent(() => import('../GlobalFunction/index.vue'))
const GlobalDialog = loadAsyncComponent(() => import('../GlobalDialog/index.vue'))
const GlobalProps = loadAsyncComponent(() => import('../GlobalProps/index.vue'))
const GlobalStyle = loadAsyncComponent(() => import('../GlobalStyle/index.vue'))
const GlobalIframeEvent = loadAsyncComponent(() => import('../GlobalIframeEvent/index.vue'))

const layoutStore = useChartLayoutStore()
const {setItem} = layoutStore
const tabName = ref("1")

const leftSideBarStyle = computed(()=>{
  const {getLeftSidebar} = layoutStore
  return {
    width: getLeftSidebar ? null : "60px" 
  }
})

watch(tabName,(val)=>{
   if(val){
     setItem(ChartLayoutStoreEnum.LEFT_SIDEBAR,true)
   }else{
     setItem(ChartLayoutStoreEnum.LEFT_SIDEBAR,false)
   }
})
</script>

<style lang="scss" scoped>
.LeftSideBar{
  width: var(--left-sideBar-width);
  background-color: var(--bg-color-3);
  transition: width 0.3s ease-in-out;
  overflow: hidden;
  border-right: 1px solid var(--el-border-color);
  box-sizing: border-box;
  :deep(.LeftTabs){
    width: var(--left-sideBar-width);
    height: 100%;
    .el-tabs__header{
     background: var(--bg-color-3);
     margin-right:0;
    }
    .el-tabs__content{
      height: 100%;
     .el-tab-pane{
      height: 100%;
     }
    }
    .el-tabs__item{
      padding: 0 17px;
    }
  }
}
</style>