<template>
  <div style="padding: 0 10px">
    <setting-item name="覆盖组名称">
      <el-input v-model="config.name"></el-input>
    </setting-item>
    <setting-item name="覆盖类型">
      <el-select-v2
        v-model="config.type"
        :options="coverOptions"
        @change="typeChange"
      />
    </setting-item>
    <component :is="commentName" :options="config.options"></component>
  </div>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import MarkerData from "../../json/MarkerData.json";
import CircleMarkerData from "../../json/CircleData.json";
import PolygonData from "../../json/PolygonData.json";
import PolylineData from "../../json/PolylineData.json";

import {
CircleDataMapping,
  CircleOptions,
  MarkerDataMapping,
  MarkerOptions,
  PolygonOptions,
  PolylineDataMapping,
  PolylineOptions,
  coverOptions,
} from "../../config";
import { coverEnum } from "../../type";
import { CoverGroupType } from '@/packages/index.d'
import { PolygonDataMapping } from "../../../MapAmap/config";

const MarkerConfig = defineAsyncComponent(
  () => import("./coverConfig/MarkerConfig.vue")
);
const CircleConfig = defineAsyncComponent(
  () => import("./coverConfig/CircleConfig.vue")
);
const PolygonConfig = defineAsyncComponent(
  () => import("./coverConfig/PolygonConfig.vue")
);
const PolylineConfig = defineAsyncComponent(
  () => import("./coverConfig/PolylineConfig.vue")
);

const props = defineProps({
  config: {
    type: Object as PropType<CoverGroupType>,
    required: true,
  },
});
const commentName = ref(null);

function typeChange(type) {
  switch (type) {
    case coverEnum.Marker:
      props.config.options = cloneDeep(MarkerOptions);
      props.config.data = cloneDeep(MarkerData);
      props.config.dataMapping = cloneDeep(MarkerDataMapping);
      commentName.value = MarkerConfig;
      break;
    case coverEnum.Circle:
      props.config.options = cloneDeep(CircleOptions);
      props.config.data = cloneDeep(CircleMarkerData);
      props.config.dataMapping = cloneDeep(CircleDataMapping);
      commentName.value = CircleConfig;
      break;
    case coverEnum.Polygon:
      props.config.options = cloneDeep(PolygonOptions);
      props.config.data = cloneDeep(PolygonData);
      props.config.dataMapping = cloneDeep(PolygonDataMapping);
      commentName.value = PolygonConfig;
      break;
    case coverEnum.Polyline:
      props.config.options = cloneDeep(PolylineOptions);
      props.config.data = cloneDeep(PolylineData);
      props.config.dataMapping = cloneDeep(PolylineDataMapping);
      commentName.value = PolylineConfig;
      break;
    default:
      break;
  }
}
onMounted(() => {
  switch (props.config.type) {
    case coverEnum.Marker:
      commentName.value = MarkerConfig;
      break;
    case coverEnum.Circle:
      commentName.value = CircleConfig;
      break;
    case coverEnum.Polygon:
      commentName.value = PolygonConfig;
      break;
    case coverEnum.Polyline:
      commentName.value = PolylineConfig;
      break;
    default:
      break;
  }
});
</script>

<style scoped></style>
