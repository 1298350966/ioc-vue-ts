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
  zoomOptions,
  scaleOptions,
  copyrightOptions,
  overviewMapOptions,
  mapTypeOptions,
  controlOptions
} from "../../config";
import { contorlEnum } from "../../type";

const ZoomConfig = defineAsyncComponent(
  () => import("./controlConfig/ZoomConfig.vue")
);
const CopyrightConfig = defineAsyncComponent(
  () => import("./controlConfig/CopyrightConfig.vue")
);
const OverviewMapConfig = defineAsyncComponent(
  () => import("./controlConfig/OverviewMapConfig.vue")
);
const ScaleConfig = defineAsyncComponent(
  () => import("./controlConfig/ScaleConfig.vue")
);
const mapTypeConfig = defineAsyncComponent(
  () => import("./controlConfig/mapTypeConfig.vue")
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
    case contorlEnum.Zoom:
      props.config.options = cloneDeep(zoomOptions);
      commentName.value = ZoomConfig;
      break;
    case contorlEnum.Scale:
      props.config.options = cloneDeep(scaleOptions);
      commentName.value = ScaleConfig;
      break;
    case contorlEnum.Copyright:
      props.config.options = cloneDeep(copyrightOptions);
      commentName.value = CopyrightConfig;
      break;
    case contorlEnum.OverviewMap:
      props.config.options = cloneDeep(overviewMapOptions);
      commentName.value = OverviewMapConfig;
      break;
    case contorlEnum.mapType:
      props.config.options = cloneDeep(mapTypeOptions);
      commentName.value = mapTypeConfig;
      break;
    default:
      break;
  }
}
onMounted(() => {
  switch (props.config.type) {
    case contorlEnum.Zoom:
      commentName.value = ZoomConfig;
      break;
    case contorlEnum.Scale:
      commentName.value = ScaleConfig;
      break;
    case contorlEnum.Copyright:
      commentName.value = CopyrightConfig;
      break;
    case contorlEnum.OverviewMap:
      commentName.value = OverviewMapConfig;
      break;
    case contorlEnum.mapType:
      commentName.value = mapTypeConfig;
      break;
    default:
      break;
  }
});
</script>

<style scoped></style>
