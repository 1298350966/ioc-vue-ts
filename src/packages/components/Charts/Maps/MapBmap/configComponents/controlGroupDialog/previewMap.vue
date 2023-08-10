<template>
  <BMap
    :ak="mapKey"
    :center="center"
    :lazy="2000"
    :zoom="mapZindex"
    :tilt="pitch"
    :heading="heading"
    :mapType="mapType"
    height="100%"
    enableScrollWheelZoom
    @initd="initMap"
  >
    <!-- 覆盖物 -->
    <!-- <template v-for="(item, index) in config.dataset" :key="index">
      <component :is="componentIs" v-bind="getOptions(item)"></component>
    </template> -->
    <!-- 地图控件 -->
    <component  :is="componentName" v-bind="config.options" v-if="isResetMap"></component>
  </BMap>
</template>

<script setup lang="ts">
import { option, coverGroupOptions } from "../../config";
import { BMap,BScale,BZoom,BCopyright,BLocation,BPanoramaControl,BNavigation3d,BCityList } from 'vue3-baidu-map-gl'
import "vue-bmap-gl/dist/style.css";
import { useBmap } from "../../hooks/useBmapHooks";
// import coverGroup from "../coverGroup/index.vue";
defineOptions({
  name: "previewMap",
  components: {
  },
});
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
  config: {
    type: Object,
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
  return {
    ...options,
  };
}


const componentName = computed(()=>{
  let {type,options} = props.config
  switch(type){
    case 'BScale':  return BScale; 
    case 'BZoom':  return BZoom; 
    case 'BCopyright':  return BCopyright; 
    case 'BLocation':  return BLocation; 
    case 'BPanoramaControl':  return BPanoramaControl; 
    case 'BNavigation3d':  return BNavigation3d; 
    case 'BCityList':  return BCityList; 
  };
})

//地图控件：静态属性改变触发响应式
const isResetMap = ref(true)
watch(()=>props.config,()=>{
  isResetMap.value = false;
  nextTick(()=>{
    isResetMap.value = true;
  })
},{deep:true})

function initMap( {map, BmapGL, instance}){
  mapIns.setMap(map)
}
</script>

<style scoped></style>
