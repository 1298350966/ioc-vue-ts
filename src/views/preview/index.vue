<template>
  <div ref="contextRef" :class="`kh-preview ${localStorageInfo.editCanvasConfig.previewScaleType}`">
    <template v-if="showEntity">
      <!-- 实体区域 -->
      <div ref="entityRef" class="kh-preview-entity">
        <!-- 缩放层 -->
        <div ref="previewRef" class="kh-preview-scale">
          <!-- 展示层 -->
          <div :style="previewRefStyle" v-if="show">
            <!-- 渲染层 -->
            <preview-render-list :localStorageInfo="localStorageInfo"></preview-render-list>
          </div>
        </div>
      </div>
    </template>
    <template v-else>
      <!-- 缩放层 -->
      <div ref="previewRef" class="kh-preview-scale">
        <!-- 展示层 -->
        <div :style="previewRefStyle" v-if="show">
          <!-- 渲染层 -->
          <preview-render-list :localStorageInfo="localStorageInfo"></preview-render-list>
        </div>
      </div>
    </template>

    <!-- 弹窗 -->
    <template v-for="(config, index) in localStorageInfo.globalDialog" :key="index">
      <component :is="config.component" v-if="config.show" :config="config"></component>
    </template>
     <!-- 弹窗11 -->
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { PreviewRenderList } from "./components/PreviewRenderList";
import { getFilterStyle, getBasicStyle } from "@/utils";
import { getEditCanvasConfigStyle, getSessionStorageInfo } from "./utils";
import { useComInstall } from "./hooks/useComInstall.hook";
import { useScale } from "./hooks/useScale.hook";
import { useStore } from "./hooks/useStore.hook";
import { PreviewScaleEnum } from "@/enums/styleEnum";
import { ChartEditStorageType } from "./index.d";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { useProps } from "./hooks/useProps.hook";
import { useIframeEvent } from "./hooks/useIframeEvent.hook";
import { PreviewChartEdit } from "./utils/PreviewChartEdit";
// const { getStorageInfo  } = useChartEditStore();
// const localStorageInfo = reactive(getStorageInfo as ChartEditStorageType)

const props = defineProps<{
  rootConfig?:ChartEditStorageType
}>()
const localStorageInfo = reactive(
  props.rootConfig || getSessionStorageInfo() as ChartEditStorageType
);

//Iframe通讯触发事件定义
const  iframeEvent = useIframeEvent(localStorageInfo.globalIframeEvent,{
  rootConfig:localStorageInfo
})

//组件传参监停
useProps(localStorageInfo.globalProps,{
  rootConfig:localStorageInfo
})
const rootConfig = new PreviewChartEdit(localStorageInfo)
provide("rootConfig", rootConfig);

provide("rootIframeEmit", iframeEvent.iframeEmitEvent);

const previewRefStyle = computed(() => {
  return {
    ...getEditCanvasConfigStyle(localStorageInfo.editCanvasConfig),
    ...getFilterStyle(localStorageInfo.editCanvasConfig),
  };
});

const showEntity = computed(() => {
  const type = localStorageInfo.editCanvasConfig.previewScaleType;
  return (
    type === PreviewScaleEnum.SCROLL_Y || type === PreviewScaleEnum.SCROLL_X
  );
});

useStore(localStorageInfo);

const { entityRef, previewRef,contextRef } = useScale(localStorageInfo);

const { show } = useComInstall(localStorageInfo);



</script>

<style lang="scss" scoped>
.kh-preview {
  position: relative;
  height: 100vh;
  width: 100vw;

  &.fit,
  &.full {
    display: flex;
    align-items: center;
    justify-content: center;
    overflow: hidden;

    .kh-preview-scale {
      transform-origin: center center;
    }
  }

  &.scrollY {
    overflow-x: hidden;

    .kh-preview-scale {
      transform-origin: left top;
    }
  }

  &.scrollX {
    overflow-y: hidden;

    .kh-preview-scale {
      transform-origin: left top;
    }
  }

  .kh-preview-entity {
    overflow: hidden;
  }
}
</style>
