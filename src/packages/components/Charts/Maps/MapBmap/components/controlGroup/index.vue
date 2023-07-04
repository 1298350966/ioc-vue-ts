<template>
        <component  :is="componentName" v-bind="config.options" v-if="isResetMap"></component>
</template>

<script setup lang="ts">
import { BScale,BZoom,BCopyright,BLocation,BPanoramaControl,BNavigation3d,BCityList } from 'vue3-baidu-map-gl'
const props = defineProps({
    config: {
        type: Object,
        required: true,
    },
})
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
</script>

<style lang="scss" scoped>
</style>