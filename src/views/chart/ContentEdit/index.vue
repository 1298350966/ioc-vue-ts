<template>
  <content-box
    id="chart-edit-layout"
    :flex="true"
    :showTop="false"
    :showBottom="true"
    @mousedown="mousedownHandleUnStop"
    @drop="dragHandle"
    @dragover.prevent="dragoverHandle"
    @dragenter.prevent="dragoverHandle"
  >
    <EditRule>
      <!-- 画布主体 -->
      <div id="chart-edit-content" @contextmenu="handleContextMenu">
        <!-- 展示 -->
        <edit-range>
          <div
            :style="{
              ...getFilterStyle(chartEditStore.getEditCanvasConfig),
              ...rangeStyle,
            }"
          >
            <!-- 图表 -->
            <div
              v-for="(item, index) in chartEditStore.getComponentList"
              :key="item.id"
            >
              <!-- 分组 -->
              <edit-group
                v-if="item.isGroup"
                :groupData="(item as CreateComponentGroupType)"
                :groupIndex="index"
              ></edit-group>

              <!-- 单组件 -->

              <edit-shape-box
                v-else
                :data-id="item.id"
                :index="index"
                :style="useComponentStyle(item.attr, index)"
                :item="item"
                @click="mouseClickHandle($event, item)"
                @mousedown="mousedownHandle($event, item)"
                @mouseenter="mouseenterHandle($event, item)"
                @mouseleave="mouseleaveHandle($event, item)"
                @contextmenu="handleContextMenu($event, item, optionsHandle)"
              >
                <!-- <div  > -->
                <component
                  class="edit-content-chart"
                  :class="animationsClass(item.styles.animations)"
                  :is="item.chartConfig.chartKey"
                  :chartConfig="item"
                  :themeSetting="themeSetting"
                  :themeColor="themeColor"
                  :style="{
                    ...useSizeStyle(item.attr),
                    ...getFilterStyle(item.styles),
                    ...getTransformStyle(item.styles),
                  }"
                  :id="item.id"
                ></component>
                <!-- </div> -->
              </edit-shape-box>
            </div>
          </div>
        </edit-range>
      </div>
    </EditRule>
    <!-- 工具栏 -->
    <template #aside>
      <edit-tools></edit-tools>
    </template>
    <!-- 底部控制 -->
    <template #bottom>
      <EditBottom></EditBottom>
    </template>
  </content-box>
</template>

<script lang="ts" setup>
import { ContentBox } from "../ContentBox/index";
import { EditRule } from "./components/EditRule";
import { EditRange } from "./components/EditRange";
import { EditBottom } from "./components/EditBottom";
import { EditShapeBox } from "./components/EditShapeBox";
import { EditGroup } from "./components/EditGroup";
import { Directive, computed, onMounted, reactive } from "vue";

import { useLayout } from "./hooks/useLayout.hook";
import { useAddKeyboard } from "../hooks/useKeyboard.hook";
import {
  dragHandle,
  dragoverHandle,
  mousedownHandleUnStop,
  useMouseHandle,
} from "./hooks/useDrag.hook";
import { useComponentStyle, useSizeStyle } from "./hooks/useStyle.hook";

import { chartColors } from "@/settings/chartThemes/index";
import { MenuEnum } from "@/enums/editPageEnum";
import {
  CreateComponentType,
  CreateComponentGroupType,
} from "@/packages/index.d";
import { animationsClass, getFilterStyle, getTransformStyle } from "@/utils";
import { useContextMenu } from "@/views/chart/hooks/useContextMenu.hook";
import { MenuOptionsItemType } from "@/views/chart/hooks/useContextMenu.hook.d";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { ContentDropdown } from "../ContentDropdown/index";
import { EditTools } from "./components/EditTools";
defineOptions({
  name: "ContentEdit",
});

const chartEditStore = useChartEditStore();

provide("rootConfig", chartEditStore.getStorageInfo);

const { handleContextMenu } = useContextMenu();
// 布局处理
useLayout();

// 点击事件
const {
  mouseenterHandle,
  mouseleaveHandle,
  mousedownHandle,
  mouseClickHandle,
} = useMouseHandle();

// 右键事件
const optionsHandle = (
  targetList: MenuOptionsItemType[],
  allList: MenuOptionsItemType[],
  targetInstance: CreateComponentType
) => {
  // 多选
  const moreMenuEnums = [MenuEnum.GROUP, MenuEnum.DELETE, MenuEnum.DOWNLOAD_IMAGE];
  // 单选
  const singleMenuEnums = targetList;

  // 多选处理
  if (chartEditStore.getTargetChart.selectId.length > 1) {
    const list: MenuOptionsItemType[] = [];

    allList.forEach((item) => {
      // 成组
      if (moreMenuEnums.includes(item.key as MenuEnum)) {
        list.push(item);
      }
    });
    return list;
  }
  return singleMenuEnums;
};

// 主题色
const themeSetting = computed(() => {
  const chartThemeSetting =
    chartEditStore.getEditCanvasConfig.chartThemeSetting;
  return chartThemeSetting;
});

// 配置项
const themeColor = computed(() => {
  const chartThemeColor = chartEditStore.getEditCanvasConfig.chartThemeColor;
  return chartColors[chartThemeColor];
});

// 是否展示渲染
const filterShow = computed(() => {
  return chartEditStore.getEditCanvasConfig.filterShow;
});

// 背景
const rangeStyle = computed(() => {
  // 设置背景色和图片背景
  const background = chartEditStore.getEditCanvasConfig.background;
  const backgroundImage = chartEditStore.getEditCanvasConfig.backgroundImage;
  const selectColor = chartEditStore.getEditCanvasConfig.selectColor;
  const backgroundColor = background ? background : undefined;

  const computedBackground = selectColor
    ? { background: backgroundColor }
    : {
        background: `url(${backgroundImage}) no-repeat center center / cover !important`,
      };

  // @ts-ignore
  return {
    ...computedBackground,
    width: "inherit",
    height: "inherit",
  };
});

// 键盘事件
onMounted(() => {
  useAddKeyboard();
});
</script>

<style lang="scss" scoped>
#chart-edit-layout {
  width: 100%;
  height: 100%;
  // background: #33333333;
  position: relative;
  background-color: $--color-dark-bg-1;

  #chart-edit-content {
    position: absolute;
    overflow: hidden;
    border-radius: 2px;
  }
}

.none {
  display: none;
}
</style>
