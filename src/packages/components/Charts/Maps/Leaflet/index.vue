<template>
  <div>
    <l-map ref="map" 
      v-if="layerShow"
      v-model:center="center"  
      v-model:zoom="zoom"
      :inertia="inertia"
      :zoomAnimation="zoomAnimation"
      :fadeAnimation="fadeAnimation"
      :use-global-leaflet="false"
      >
      <l-tile-layer v-bind="tileLayer" ></l-tile-layer>
      
      <!-- 覆盖物组 -->
      <template
        v-for="(config, index) in chartConfig.option.coverGroupList"
        :key="index"
      >
        <coverGroup v-if="config.visible" :config="config"></coverGroup>
      </template>
    
    </l-map>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs } from 'vue';
import Config from './config';
import "leaflet/dist/leaflet.css";
import { LMap, LTileLayer, LMarker } from "@vue-leaflet/vue-leaflet";
import { throttle } from 'lodash';
import {coverGroup} from "./components/index"
const props = defineProps({
  chartConfig: {
    type: Object as PropType<Config>,
    required: true,
  },
});

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
} = toRefs(props.chartConfig.option.mapOptions);

let {
  tileLayer
} = toRefs(props.chartConfig.option);
const center = computed(()=>{
  return [mapLat.value,mapLog.value]
})


const layerShow = ref(true)


watch(()=>[props.chartConfig.attr.w, props.chartConfig.attr.h],throttle(()=>{
  layerShow.value = false
  nextTick(()=>{
    layerShow.value = true
  })
},1000))
</script>

<style scoped>

</style>