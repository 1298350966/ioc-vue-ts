<template>
    <l-map ref="map" 
      v-model:center="center"  
      v-model:zoom="zoom"
      :inertia="inertia"
      :zoomAnimation="zoomAnimation"
      :fadeAnimation="fadeAnimation"
      :use-global-leaflet="false"
      >
      <l-tile-layer v-bind="tileLayer" ></l-tile-layer>
      <div>
        <coverGroup v-if="config.options.visible" :config="config"></coverGroup>
      </div>
  
    </l-map>
</template>

<script setup lang="ts">
import { option, coverGroupOptions } from "../../config";
import { LMap, LTileLayer } from "@vue-leaflet/vue-leaflet";
import coverGroup from "../../components/coverGroup.vue";
// import { useAmap } from "../../hooks/useAmapHooks";

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
// const mapIns = useAmap()
// provide("map",mapIns) 
let {
  mapLat,
  mapLog,
  // bounds,
  // maxBounds,
  zoom,
  // minZoom,
  // maxZoom,
  inertia,
  zoomAnimation,
  fadeAnimation,
} = toRefs(props.optionData.mapOptions);

let {
  tileLayer
} = toRefs(props.optionData);

const center = computed(()=>{
  return [mapLat.value,mapLog.value]
})



</script>

<style scoped></style>
