<template>
  <component :is="componentName" v-bind="config.options" v-if="isResetMap"></component>
</template>

<script setup lang="ts">
import { ElAmapControlScale,ElAmapControlToolBar,ElAmapControlControlBar,ElAmapControlMapType,ElAmapControlHawkEye } from "@vuemap/vue-amap";
const props = defineProps({
    config: {
        type: Object,
        required: true,
    },
})
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

<style lang="scss" scoped>
</style>