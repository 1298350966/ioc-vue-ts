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
      <coverGroup v-if="config.options.visible" :config="config"></coverGroup>
  </el-amap>
</template>

<script setup lang="ts">
import { option, coverGroupOptions } from "../../config";
import { initAMapApiLoader, ElAmap, ElAmapPolygon } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";
import coverGroup from "../coverGroup/index.vue";
import { useAmap } from "../../hooks/useAmapHooks";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
  config: {
    type: Object as PropType<typeof coverGroupOptions>,
    required: true,
  },
});
const mapIns = useAmap()
provide("map",mapIns) 
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
  mapIns.setMap(e)
}
</script>

<style scoped></style>
