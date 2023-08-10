<template>
  <div class="content-layers-group-list-item">
    <div
      class="root-item-content"
      :class="{ hover, select, 'list-mini': selectText }"
      @click="clickHandle($event)"
      @mousedown="groupMousedownHandle($event)"
      @mouseenter="mouseenterHandle(componentGroupData)"
      @mouseleave="mouseleaveHandle(componentGroupData)"
      @contextmenu="handleContextMenu($event, componentGroupData, optionsHandle)"
    >
      <div class="kh-flex-items-center item-content">
        <el-icon :size="20" style="vertical-align: middle">
          <Folder v-if="expend" />
          <FolderOpened v-else />
        </el-icon>

        <div class="list-text-ellipsis">
          <span class="list-text">
            {{ componentGroupData.chartConfig.title }}
          </span>
        </div>
        <layers-status :isGroup="false" :hover="hover" :status="status"></layers-status>
      </div>
      <div :class="{ 'select-modal': select }"></div>
    </div>
    <el-collapse-transition >
      <div v-show="expend" >
        <draggable @change="draggableChange" group="LAYER" :animation="150" fallbackOnBody :swapThreshold="0.65" item-key="id" v-model="componentGroupData.groupList" ghostClass="ghost" >
          <template #item="{ element }">
            <div>
              <LayersListItem
                :key="element.id"
                :componentData="element"
                :layer-mode="layerMode"
                :isGroup="true"
                @mousedown="mousedownHandle($event, element)"
                @mouseenter="mouseenterHandle(element)"
                @mouseleave="mouseleaveHandle(element)"
                @contextmenu="handleContextMenu($event, componentGroupData, optionsHandle)"
              ></LayersListItem>
            </div>

          </template>
        </draggable>
      </div>
    </el-collapse-transition>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, PropType } from 'vue'
import Draggable from 'vuedraggable'
import { MouseEventButton, WinKeyboard, MacKeyboard } from '@/enums/editPageEnum'
import { MenuEnum } from '@/enums/editPageEnum'
import { useDesignStore } from '@/store/modules/designStore/designStore'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { useContextMenu, divider } from '@/views/chart/hooks/useContextMenu.hook'
import { MenuOptionsItemType } from '@/views/chart/hooks/useContextMenu.hook.d'
import { LayerModeEnum } from '@/store/modules/chartLayoutStore/chartLayoutStore.d'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'
import { LayersListItem } from '../LayersListItem'
import { LayersStatus } from '../LayersStatus/index'
import { icon } from '@/plugins'

const props = defineProps({
  componentGroupData: {
    type: Object as PropType<CreateComponentGroupType>,
    required: true
  },
  layerMode: {
    type: String as PropType<LayerModeEnum>,
    default: LayerModeEnum.THUMBNAIL
  }
})


// 右键
const pickOptionsList = [MenuEnum.UN_GROUP]

// 全局颜色
const designStore = useDesignStore()
const { FolderIcon, FolderOpenIcon } = icon.ionicons5

const chartEditStore = useChartEditStore()
const { handleContextMenu, onClickOutSide } = useContextMenu()

const expend = ref(false)

// const groupList = computed({
//   get(){
//     return props.componentGroupData.groupList.reverse();
//   },
//   set(val){
//     props.componentGroupData.groupList = val
//      console.log(`output->`, props.componentGroupData.groupList)
//   }
// })



// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme
})

// 是否选中文本
const selectText = computed(() => {
  return props.layerMode === LayerModeEnum.TEXT
})

// 计算当前选中目标
const select = computed(() => {
  const id = props.componentGroupData.id
  return chartEditStore.getTargetChart.selectId.find((e: string) => e === id)
})

// 悬浮
const hover = computed(() => {
  return props.componentGroupData.id === chartEditStore.getTargetChart.hoverId
})

// 组件状态 隐藏/锁定
const status = computed(() => {
  return props.componentGroupData.status
})

// 右键
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType
) => {
  const filter = (menulist: MenuEnum[]) => {
    return allList.filter(i => menulist.includes(i.key as MenuEnum))
  }

  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    return filter([MenuEnum.GROUP])
  } else {
    const statusMenuEnums: MenuEnum[] = []
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
    return [
      ...filter([MenuEnum.UN_GROUP]),
      divider(),
      ...targetList.filter(i => !statusMenuEnums.includes(i.key as MenuEnum))
    ]
  }
}

// 点击
const clickHandle = (e: MouseEvent) => {
  // 按下左键 + CTRL
  if (window.$KeyboardActive?.ctrl) return
  // 判断左右键
  expend.value = !expend.value
  mousedownHandle(e, props.componentGroupData)
}

// 组点击事件
const groupMousedownHandle = (e: MouseEvent) => {
  onClickOutSide()
  // 若此时按下了 CTRL, 表示多选
  const id = props.componentGroupData.id
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

// 公共点击事件
const mousedownHandle = (
  e: MouseEvent,
  componentInstance: CreateComponentType | CreateComponentGroupType,
  id?: string
) => {
  console.log(componentInstance);
  // e.preventDefault()
  // e.stopPropagation()

  onClickOutSide()
  chartEditStore.setTargetSelectChart(id || componentInstance.id)
}

// 公共进入事件
const mouseenterHandle = (componentInstance: CreateComponentType | CreateComponentGroupType) => {
  chartEditStore.setTargetHoverChart(componentInstance.id)
}

// 公共移出事件
const mouseleaveHandle = (componentInstance: CreateComponentType | CreateComponentGroupType) => {
  chartEditStore.setTargetHoverChart(undefined)
}

function draggableChange(e){
  let {added,removed} =  e
  console.log(`output->`,e)
  if(added){
    const {element} = added
    chartEditStore.addGroup(props.componentGroupData,element.id)
  }
  if(removed){
    const {element} = removed
    chartEditStore.removeGroup(props.componentGroupData,element.id)
  }
}


// draggableFilter(){

// }
</script>

<style lang="scss" scoped>
$centerHeight: 52px;
$centerMiniHeight: 28px;
$textSize: 10px;

.content-layers-group-list-item {
  position: relative;
  width: 90%;
  margin: 10px 5%;
  margin-bottom: 5px;
  @extend .kh-transition-quick;
  @include deep() {
    .go-content-layers-list-item {
      margin-right: 0 !important;
      width: 95% !important;
    }
  }

  &:hover {
    @include deep() {
      .icon-item {
        opacity: 1;
      }
    }
  }

  .root-item-content {
    height: $centerHeight;
    cursor: pointer;
    border-radius: 5px;
    border: 1px solid rgba(0, 0, 0, 0);
    &.hover,
    &:hover {
      @include fetch-bg-color('background-color4');
    }
    /* 选中 */
    &.select {
      border: 1px solid v-bind('themeColor');
      /* 需要设置最高级，覆盖 hover 的颜色 */
      background-color: rgba(0, 0, 0, 0);
      .list-img {
        border: 1px solid v-bind('themeColor') !important;
      }
    }

    // mini样式
    &.list-mini {
      height: $centerMiniHeight;
      .item-content {
        height: calc(#{$centerMiniHeight} - 10px) !important;
      }
      .select-modal {
        height: calc(#{$centerMiniHeight} + 2px) !important;
      }
    }
  }
  .select-modal,
  .item-content {
    position: absolute;
    top: 0;
    left: 0;
  }
  .item-content {
    z-index: 1;
    padding: 6px 8px;
    justify-content: start !important;
    width: calc(100% - 10px);
    height: calc(#{$centerHeight} - 10px);
  }
  .select-modal {
    width: 100%;
    height: calc(#{$centerHeight} + 2px);
    opacity: 0.3;
    background-color: v-bind('themeColor');
  }
  .list-text-ellipsis{
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
    display: inline-block;
    margin-right: auto;

    .list-text {
      padding-left: 6px;
      font-size: $textSize;
    }
  }

  .list-status-icon {
    margin-left: 3px;
  }
}
</style>
