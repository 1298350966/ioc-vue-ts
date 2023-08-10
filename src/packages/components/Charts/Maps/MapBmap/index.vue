<template>
  <div    class="bb">
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
      <!-- 控件 -->
      <template
          v-for="(config, index) in chartConfig.option.controlGroupList"
          :key="index"
        >
        <controlGroup :config="config"></controlGroup>
      </template>
      <!-- 覆盖物组 -->
      <template
        v-for="(config, index) in chartConfig.option.coverGroupList"
        :key="index"
      >
        <coverGroup  class="kh" v-if="config.visible" :config="config"></coverGroup>
      </template>
      <!-- 信息窗口 -->
      <template
          v-for="(config, index) in chartConfig.option.InfoWindowList"
          :key="index"
        >
          <InfoWindow v-if="config.visible" :config="config"></InfoWindow>
      </template>
    </BMap>
  </div>
</template>

<script setup lang="ts">
import { BMap } from 'vue3-baidu-map-gl'
import { CreateComponentType } from "@/packages/index.d";
import { coverGroup, InfoWindow,controlGroup } from "./components/index";
import { useBmap } from './hooks/useBmapHooks';
//解决截图问题
(HTMLCanvasElement.prototype as any).getContext = function (origFn) {
  return function (type, attributes) {
    if (type === 'webgl') {
      attributes = Object.assign({}, attributes, {
        preserveDrawingBuffer: true,
      });
    }
    return origFn.call(this, type, attributes);
  };
}(HTMLCanvasElement.prototype.getContext);

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});
const mapIns = useBmap()
provide("mapIns",mapIns) 

let { mapKey, mapLog, mapLat, mapZindex, pitch, heading, mapType } = toRefs(
  props.chartConfig.option.mapOptions
);
const center = computed(() => {
  return {
    lng:mapLog.value,
    lat:mapLat.value
  }
});

function initMap( {map, BmapGL, instance}){
  mapIns.setMap(map)
}
</script>

<style scoped>
</style>
