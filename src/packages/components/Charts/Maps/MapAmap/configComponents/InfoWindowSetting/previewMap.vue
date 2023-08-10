<template>
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
  >
    <InfoWindow :config="config"></InfoWindow>
  </el-amap>
</template>

<script setup lang="ts">
import { option, InfoWindowOptions } from "../../config";
import { initAMapApiLoader, ElAmap } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";
import { InfoWindow } from "../../components";
import { useAmap } from "../../hooks/useAmapHooks";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
  config: {
    type: Object as PropType<typeof InfoWindowOptions>,
    required: true,
  },
});
const map = useAmap()
provide("map",map) 
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
} = toRefs(props.optionData.mapOptions);
const center = computed(() => {
  return [amapLon.value, amapLat.value];
});
const mapStyle = computed(() => {
  return `amap://styles/${
    amapStyleKeyCustom.value !== ""
      ? amapStyleKeyCustom.value
      : amapStyleKey.value
  }`;
});
initAMapApiLoader({
  key: amapKey.value,
  securityJsCode: "securityJsCode", // 新版key需要配合安全密钥使用
});

function initMap(e) {
  map.setMap(e)
  props.config.position = center;
  props.config.visible = true;
}
</script>

<style scoped></style>
