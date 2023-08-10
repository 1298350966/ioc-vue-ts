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
    <component  :is="componentName" v-bind="config.options" v-if="isResetMap"></component>
  </el-amap>
</template>

<script setup lang="ts">
import { option, coverGroupOptions } from "../../config";
import { initAMapApiLoader, ElAmap, ElAmapPolygon,ElAmapControlScale,ElAmapControlToolBar,ElAmapControlControlBar,ElAmapControlMapType,ElAmapControlHawkEye } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";
import coverGroup from "../coverGroup/index.vue";
import { useAmap } from "../../hooks/useAmapHooks";
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
}


const componentName = computed(()=>{
  let {type,options} = props.config
  switch(type){
    case 'ElAmapControlScale':  return ElAmapControlScale; 
    case 'ElAmapControlToolBar':  return ElAmapControlToolBar; 
    case 'ElAmapControlControlBar':  return ElAmapControlControlBar; 
    case 'ElAmapControlMapType':  return ElAmapControlMapType; 
    case 'ElAmapControlHawkEye':  return ElAmapControlHawkEye; 
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
</script>

<style scoped></style>
