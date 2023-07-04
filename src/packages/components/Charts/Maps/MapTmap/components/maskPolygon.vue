<template>
  <tdt-polygon
    v-if="maskConfig.enable"
    v-bind="maskConfig.polygonOptions"
    @init="initPolygon"
  ></tdt-polygon>
</template>

<script setup lang="ts">
import { TdtPolygon } from "vue-tianditu/packages/index";
const props = defineProps<{
  maskConfig: any;
}>();
let polygonIns = null;
function initPolygon(e) {
  polygonIns = e;
  setPath();
}
const toLngLats = (lnglats: VT.LngLats) => {
  return lnglats.map((lnglat) => {
    const [lng, lat] = lnglat;
    return new T.LngLat(lng, lat);
  });
};
function setPath() {
  let _path = props.maskConfig.polygonOptions.path.map((lnglats) => {
    return toLngLats(lnglats);
  });
  polygonIns.setLngLats(_path);
}
</script>

<style scoped></style>
