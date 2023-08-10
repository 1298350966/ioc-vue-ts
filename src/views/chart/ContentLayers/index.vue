<template>
    <!-- :class="{ scoped: !chartLayoutStore.getLayers }" -->
  <content-box 
    class="kh-content-layers" 
    title="图层" 
    @mousedown="boxMousedownHandle($event)"
    @back="backHandle">
    <el-empty class="empty-box" v-if="reverseList.length === 0" :image-size="100" description="暂无图层" />

    <draggable group="LAYER" :animation="150" fallbackOnBody :swapThreshold="0.65" item-key="id" v-model="chartEditStore.componentList" ghostClass="ghost">
        <template #item="{ element }">
          <div class="kh-content-layer-box">
            <!-- 组合 -->
            <layers-group-list-item
              v-if="element.isGroup"
              :componentGroupData="element"
              :layer-mode="layerMode"
            ></layers-group-list-item>
            <!-- 单组件 -->
            <layers-list-item
              v-else
              :componentData="element"
              :layer-mode="layerMode"
              @mousedown="mousedownHandle($event, element)"
              @mouseenter="mouseenterHandle(element)"
              @mouseleave="mouseleaveHandle(element)"
              @contextmenu="handleContextMenu($event, element, optionsHandle)"
            ></layers-list-item>
          </div>
        </template>
      </draggable>
  </content-box>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import Draggable from 'vuedraggable'
import { ContentBox } from '../ContentBox/index'
import { useChartLayoutStore } from '@/store/modules/chartLayoutStore/chartLayoutStore'
import cloneDeep from 'lodash/cloneDeep'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { MenuOptionsItemType } from '@/views/chart/hooks/useContextMenu.hook.d'
import { ChartLayoutStoreEnum, LayerModeEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useContextMenu } from '@/views/chart/hooks/useContextMenu.hook'
import { MenuEnum, MouseEventButton, WinKeyboard, MacKeyboard } from '@/enums/editPageEnum'

import { LayersListItem } from './components/LayersListItem/index'
import { LayersGroupListItem } from './components/LayersGroupListItem/index'

const chartLayoutStore = useChartLayoutStore()
const chartEditStore = useChartEditStore()
const { handleContextMenu, onClickOutSide } = useContextMenu()

const layerList = ref<any>([])
const layerMode = ref<LayerModeEnum>(chartLayoutStore.getLayerType)

// 逆序展示
const reverseList = computed(() => {
  const list: Array<CreateComponentType | CreateComponentGroupType> = cloneDeep(chartEditStore.getComponentList)
  return list
})
watch(
  () => reverseList.value,
  newValue => {
    layerList.value = newValue
  },
  {
    immediate:true
  }
)

// 右键事件
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType
) => {
  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    return targetList.filter(i => i.key === MenuEnum.GROUP)
  }
  const statusMenuEnums: MenuEnum[] = []
  // 处理锁定与隐藏
  if (targetInstance.status.lock) {
    statusMenuEnums.push(MenuEnum.LOCK)
  } else {
    statusMenuEnums.push(MenuEnum.UNLOCK)
  }
  if (targetInstance.status.hide) {
    statusMenuEnums.push(MenuEnum.HIDE)
  } else {
    statusMenuEnums.push(MenuEnum.SHOW)
  }
  return targetList.filter(item => !statusMenuEnums.includes(item.key as MenuEnum))
}
// 缩小
const backHandle = () => {
  chartLayoutStore.setItem(ChartLayoutStoreEnum.LAYERS, false)
}

// 移动结束处理
const onMoveCallback = (val: any) => {
  const { oldIndex, newIndex } = val.moved
  if (newIndex - oldIndex < 0) {
    // 从上往下
    const moveTarget = chartEditStore.getComponentList.splice(-(oldIndex + 1), 1)[0]
    chartEditStore.getComponentList.splice(-newIndex, 0, moveTarget)
  } else {
    // 从下往上
    const moveTarget = chartEditStore.getComponentList.splice(-(oldIndex + 1), 1)[0]
    if (newIndex === 0) {
      chartEditStore.getComponentList.push(moveTarget)
    } else {
      chartEditStore.getComponentList.splice(-newIndex, 0, moveTarget)
    }
  }
}

const boxMousedownHandle = (e: MouseEvent) => {
  const box = document.querySelector('.kh-content-layer-box')
  if ((e.target as any).contains(box)) {
    chartEditStore.setTargetSelectChart()
  }
}

// 点击事件
const mousedownHandle = (e: MouseEvent, item: CreateComponentType) => {
  onClickOutSide()
  // 若此时按下了 CTRL, 表示多选
  const id = item.id
  if (e.buttons === MouseEventButton.LEFT && window.$KeyboardActive?.ctrl) {
    // 若已选中，则去除
    if (chartEditStore.targetChart.selectId.includes(id)) {
      const exList = chartEditStore.targetChart.selectId.filter(e => e !== id)
      chartEditStore.setTargetSelectChart(exList)
    } else {
      chartEditStore.setTargetSelectChart(id, true)
    }
    return
  }
  chartEditStore.setTargetSelectChart(id)
}

// 进入事件
const mouseenterHandle = (item: CreateComponentType) => {
  chartEditStore.setTargetHoverChart(item.id)
}

// 移出事件
const mouseleaveHandle = (item: CreateComponentType) => {
  chartEditStore.setTargetHoverChart(undefined)
}

// 修改图层展示方式
const changeLayerType = (value: LayerModeEnum) => {
  layerMode.value = value
  chartLayoutStore.setItem(ChartLayoutStoreEnum.LAYER_TYPE, value)
}
</script>

<style lang="scss" scoped>
.kh-content-layers {
  // width: 220px;
  flex-shrink: 0;
  overflow: hidden;
  background: var(--bg-color-3);
  margin:1px;
  @extend .kh-transition;
  &.scoped {
    width: 0;
  }
  // .empty-box{
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -100%);
  // }
}
</style>