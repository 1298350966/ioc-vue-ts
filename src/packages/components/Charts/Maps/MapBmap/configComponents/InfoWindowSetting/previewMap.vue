<template>
  <BMap
    :ak="mapKey"
    :center="center"
    :zoom="mapZindex"
    :tilt="pitch"
    :heading="heading"
    :mapType="mapType"
    height="100%"
    enableScrollWheelZoom
    @initd="initMap"
  >
    <InfoWindow :config="config"></InfoWindow>
  </BMap>
</template>

<script setup lang="ts">
import { BMap,BInfoWindow } from 'vue3-baidu-map-gl'
import { option, InfoWindowOptions } from "../../config";
// import { initAMapApiLoader, ElAmap } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";
import { InfoWindow } from "../../components";
import { useBmap } from '../../hooks/useBmapHooks';
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

const mapIns = useBmap()
provide("mapIns",mapIns) 

let { mapKey, mapLog, mapLat, mapZindex, pitch, heading, mapType } = toRefs(
  props.optionData.mapOptions
);
const center = computed(() => {
  return {
    lng:mapLog.value,
    lat:mapLat.value
  }
});

function initMap({ map, BmapGL, instance}){
  mapIns.setMap(map)
  props.config.position = center.value
  setTimeout(() => {
    props.config.visible = true  
  }, 500);
}

</script>

<style scoped></style>
