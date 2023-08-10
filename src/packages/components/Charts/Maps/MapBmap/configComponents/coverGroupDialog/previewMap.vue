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
    <!-- <template v-for="(item, index) in config.data" :key="index">
      <component :is="componentIs" v-bind="getOptions(item)"></component>
    </template> -->
    <coverGroup :config="config"></coverGroup>
   </BMap>
</template>

<script setup lang="ts">
import { option, coverGroupOptions } from "../../config";
import { 
  BMap,
  BCircle,
  BLabel,
  BMarker,
  BMarker3d,
  BPolygon,
  BPolyline,
  BBezierCurve,
  BInfoWindow,
  BPrism,
  BGroundOverlay,
 } from 'vue3-baidu-map-gl'
import "vue-bmap-gl/dist/style.css";
import { useBmap } from "../../hooks/useBmapHooks";
import {coverGroup} from "../../components/index";
defineOptions({
  name: "previewMap",
  components: {
    BCircle,
    BLabel,
    BMarker,
    BMarker3d,
    BPolygon,
    BPolyline,
    BBezierCurve,
    BInfoWindow,
    BPrism,
    BGroundOverlay,
  },
});
// const bmap = defineAsyncComponent(() => import("./index2.vue"));
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



const componentIs = computed(() => {
  return props.config.type || null;
});
function getOptions(data) {
  let options = { ...props.config.options };
  Object.keys(props.config.options).forEach((key) => {
    if (Object.keys(data).includes(key)) {
      options[key] = data[key];
    }
  });
  options.extData = data;
 
  let obj = {}
  switch(componentIs.value){
    case "BMarker":
      obj = {position:{lat:options.position[1],lng:options.position[0]}}
      break;
    case "BCircle":
      obj = {center:{lat:options.center[1],lng:options.center[0]}};
      break;
    case "BPolygon":
      obj = {
        path:options.path.map(item=>{
          return {
            lat:item[1],
            lng:item[0]
          }
        })
      }
      break;
    case "BPolyline":
      obj = {
        path:options.path.map(item=>{
          return {
            lat:item[1],
            lng:item[0]
          }
        })
      }
      break;
    default:break;
  }
  return {
    ...options,
    ...obj
  };
}


function initMap({map, BmapGL, instance}){
  mapIns.setMap(map)
}
</script>

<style scoped></style>
