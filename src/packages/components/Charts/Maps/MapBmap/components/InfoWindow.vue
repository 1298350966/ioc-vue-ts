<template>
  <BInfoWindow 
    :show="config.visible"
    :position="config.position"
    :title="config.title"
    :width="config.width"
    :height="config.height"
    :offset="config.offset"
    :enableAutoPan="config.enableAutoPan"
    :enableCloseOnClick="config.enableCloseOnClick"
    :extraOptions="config.extData"
    :key="key"
    @close="close"
    style="width: 100%; height: 100%;"
  >
    <component-iframe  :type="config.content.type" :attrs="attrs" :component="config.content.component" :iframe="config.content.iframe"></component-iframe>
  </BInfoWindow >
</template>

<script setup lang="ts">
import { BInfoWindow } from 'vue3-baidu-map-gl'
import { cloneDeep } from "lodash";
import { getValue } from "@/utils";
const props = defineProps({
  config: {
    type: Object,
    require: true,
  },
  data:{
    type:Object,
  }
});

const key = ref(0)
watch(()=>[props.config.offset],()=>{
  key.value++
})

function close(type, target, point){
  console.log(type, target, point);
  props.config.visible = false
}

const attrs = computed(()=>{
  if(props.data){
    let _attrs = cloneDeep( props.config.content.attrs)
    return getValue(_attrs, props.data)
  }
  return props.config.content.attrs
})
</script>

<style scoped></style>
