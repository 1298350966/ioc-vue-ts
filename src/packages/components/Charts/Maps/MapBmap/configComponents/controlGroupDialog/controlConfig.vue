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
  ScaleOptions,
  ZoomOptions,
  MapTypeOptions,
  LocationOptions,
  CopyrightOptions,
  Navigation3dOptions,
  CityListOptions,
  PanoramaOptions,
  controlOptions
} from "../../config";
import { controlEnum } from "../../type";

const ScaleConfig = defineAsyncComponent(
  () => import("./controlConfig/ScaleConfig.vue")
);
const ZoomConfig = defineAsyncComponent(
  () => import("./controlConfig/ZoomConfig.vue")
);
const CopyrightConfig = defineAsyncComponent(
  () => import("./controlConfig/CopyrightConfig.vue")
);
const LocationConfig = defineAsyncComponent(
  () => import("./controlConfig/LocationConfig.vue")
);
const PanoramaControlConfig = defineAsyncComponent(
  () => import("./controlConfig/PanoramaControlConfig.vue")
);
const Navigation3dConfig = defineAsyncComponent(
  () => import("./controlConfig/Navigation3dConfig.vue")
);
const CityListConfig = defineAsyncComponent(
  () => import("./controlConfig/CityListConfig.vue")
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
      props.config.options = cloneDeep(ScaleOptions);
      commentName.value = ScaleConfig;
      break;
    case controlEnum.Zoom:
      props.config.options = cloneDeep(ZoomOptions);
      commentName.value = ZoomConfig;
      break;
    case controlEnum.Location:
      props.config.options = cloneDeep(LocationOptions);
      commentName.value = LocationConfig;
      break;
    case controlEnum.Copyright:
      props.config.options = cloneDeep(CopyrightOptions);
      commentName.value = CopyrightConfig;
      break;
    case controlEnum.Navigation3d:
      props.config.options = cloneDeep(Navigation3dOptions);
      commentName.value = Navigation3dConfig;
      break;
    case controlEnum.CityList:
      props.config.options = cloneDeep(CityListOptions);
      commentName.value = CityListConfig;
      break;
    case controlEnum.PanoramaControl:
      props.config.options = cloneDeep(PanoramaOptions);
      commentName.value = PanoramaControlConfig;
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
    case controlEnum.Zoom:
      commentName.value = ZoomConfig;
      break;
    case controlEnum.Copyright:
      commentName.value = CopyrightConfig;
      break;
    case controlEnum.Location:
      commentName.value = LocationConfig;
      break;
    case controlEnum.PanoramaControl:
      commentName.value = PanoramaControlConfig;
      break;
    case controlEnum.Navigation3d:
      commentName.value = Navigation3dConfig;
      break;
    case controlEnum.CityList:
      commentName.value = CityListConfig;
      break;
    default:
      break;
  }
});
</script>

<style scoped></style>
