<template>
  <div>
    <el-amap
      :resize-enable="true"
      :center="center"
      :zoom="amapZindex"
      :map-style="mapStyle"
      :lang="lang"
      :features="features"
      :view-mode="viewMode"
      :pitch="pitch"
      :sky-color="skyColor"
      @init="initMap"
      :WebGLParams="{
        preserveDrawingBuffer:true
      }"
    >
      <template v-if="isInit">
        <!-- 覆盖物组 -->
        <template
          v-for="(config, index) in chartConfig.option.coverGroupList"
          :key="index"
        >
          <coverGroup v-if="config.visible" :config="config"></coverGroup>
        </template>
        <!-- 弹窗 -->
        <template
          v-for="(config, index) in chartConfig.option.InfoWindowList"
          :key="index"
        >
          <InfoWindow v-if="config.visible" :config="config"></InfoWindow>
        </template>
        <!-- 图层 -->
        <component
          v-if="amapStyleKeyCustom"
          :is="currentLayer"
          v-bind="chartConfig.option.mapOptions.layerOptions"
        ></component>
        <!-- 控件 -->
        <template
          v-for="(config, index) in chartConfig.option.controlGroupList"
          :key="index"
        >
          <controlGroup :config="config"></controlGroup>
        </template>

        <el-amap-polygon
          v-if="props.chartConfig.option.mask.enable"
          v-bind="props.chartConfig.option.mask.polygonOptions"
        ></el-amap-polygon>
      </template>
    </el-amap>
  </div>
</template>

<script setup lang="ts">
import Config, { option, coverGroupOptions } from "./config";
import {
  initAMapApiLoader,
  ElAmap,
  ElAmapPolygon,
  ElAmapLayerDefault,
  ElAmapLayerTile,
  ElAmapLayerTraffic,
  ElAmapLayerSatellite,
  ElAmapLayerRoadNet,
  ElAmapLayerBuildings,
  ElAmapLayerDistrict,
  ElAmapLayerIndoorMap,
} from "@vuemap/vue-amap";
import { CreateComponentType } from "@/packages/index.d";
import { coverGroup, InfoWindow, controlGroup } from "./components/index";

import "@vuemap/vue-amap/dist/style.css";
import { useAmap } from "./hooks/useAmapHooks";
const props = defineProps({
  chartConfig: {
    type: Object as PropType<Config>,
    required: true,
  },
});

let {
  amapKey,
  amapStyleKey,
  amapLon,
  amapLat,
  amapZindex,
  lang,
  amapStyleKeyCustom,
  features,
  viewMode,
  pitch,
  skyColor,
} = toRefs(props.chartConfig.option.mapOptions);
const map = useAmap()
const {isInit} = map
provide("map",map) 

const center = computed(() => {
  return [amapLon.value, amapLat.value];
});
const mapStyle = computed(() => {
  return `amap://styles/${amapStyleKey.value}`;
});

const currentLayer = computed(() => {
  switch (amapStyleKeyCustom.value) {
    case "ElAmapLayerDefault":
      return ElAmapLayerDefault;
    case "ElAmapLayerTile":
      return ElAmapLayerTile;
    case "ElAmapLayerTraffic":
      return ElAmapLayerTraffic;
    case "ElAmapLayerSatellite":
      return ElAmapLayerSatellite;
    case "ElAmapLayerRoadNet":
      return ElAmapLayerRoadNet;
    case "ElAmapLayerBuildings":
      return ElAmapLayerBuildings;
    case "ElAmapLayerDistrict":
      return ElAmapLayerDistrict;
    case "ElAmapLayerIndoorMap":
      return ElAmapLayerIndoorMap;
    default:
      return null;
  }
});

initAMapApiLoader({
  key: amapKey.value,
  securityJsCode: "securityJsCode", // 新版key需要配合安全密钥使用
});

function initMap(e) {
  map.setMap(e)
  // var polygon = new window.AMap.Polygon({
  //   path: [outer],
  //   strokeColor: "#00eeff",
  //   strokeWeight: 1,
  //   fillColor: "#71B3ff",
  //   fillOpacity: 0.5,
  // });
}
</script>

<style scoped></style>
