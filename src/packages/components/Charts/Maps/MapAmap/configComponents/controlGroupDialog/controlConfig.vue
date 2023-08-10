<template>
  <div style="padding: 0 10px">
    <setting-item name="控件名称">
      <el-input v-model="config.name"></el-input>
    </setting-item>
    <setting-item name="控件类型">
      <el-select-v2
        v-model="config.type"
        :options="controlOptions"
        @change="typeChange"
      />
    </setting-item>
    <component :is="commentName" :options="config.options"></component>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";

import {
  scaleOptions,
  toolBarOptions,
  controlBarOptions,
  mapTypeOptions,
  hawkEyeOptions,
  controlOptions
} from "../../config";
import { controlEnum } from "../../type";

const ScaleConfig = defineAsyncComponent(
  () => import("./controlConfig/ScaleConfig.vue")
);
const ToolBarConfig = defineAsyncComponent(
  () => import("./controlConfig/ToolBarConfig.vue")
);
const ControlBarConfig = defineAsyncComponent(
  () => import("./controlConfig/ControlBarConfig.vue")
);
const HawkEyeConfig = defineAsyncComponent(
  () => import("./controlConfig/HawkEyeConfig.vue")
);
const MapTypeConfig = defineAsyncComponent(
  () => import("./controlConfig/MapTypeConfig.vue")
);

const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
});
const commentName = ref(null);

function typeChange(type) {
  switch (type) {
    case controlEnum.Scale:
      props.config.options = cloneDeep(scaleOptions);
      commentName.value = ScaleConfig;
      break;
    case controlEnum.ToolBar:
      props.config.options = cloneDeep(toolBarOptions);
      commentName.value = ToolBarConfig;
      break;
    case controlEnum.ControlBar:
      props.config.options = cloneDeep(controlBarOptions);
      commentName.value = ControlBarConfig;
      break;
    case controlEnum.HawkEye:
      props.config.options = cloneDeep(hawkEyeOptions);
      commentName.value = HawkEyeConfig;
      break;
    case controlEnum.MapType:
      props.config.options = cloneDeep(mapTypeOptions);
      commentName.value = MapTypeConfig;
      break;
    default:
      break;
  }
}
onMounted(() => {
  switch (props.config.type) {
    case controlEnum.Scale:
      commentName.value = ScaleConfig;
      break;
    case controlEnum.ToolBar:
      commentName.value = ToolBarConfig;
      break;
    case controlEnum.ControlBar:
      commentName.value = ControlBarConfig;
      break;
    case controlEnum.MapType:
      commentName.value = MapTypeConfig;
      break;
    case controlEnum.HawkEye:
      commentName.value = HawkEyeConfig;
      break;
    default:
      break;
  }
});
</script>

<style scoped></style>
