<template>
  <el-amap-info-window
    v-if="config.visible"
    :isCustom="config.isCustom"
    :autoMove="config.autoMove"
    :avoid="config.avoid"
    :closeWhenClickMap="config.closeWhenClickMap"
    :offset="config.offset"
    v-model:visible="config.visible"
    :position="config.position"
    :anchor="config.anchor"
    :size="config.size"
    :extraOptions="config.extData"
  >
  <component-iframe :style="infoWindowStyle" :type="config.content.type" :attrs="attrs" :component="config.content.component" :iframe="config.content.iframe"></component-iframe>
  </el-amap-info-window>
</template>

<script setup lang="ts">
import { ElAmapInfoWindow } from "@vuemap/vue-amap";
import {getAsyncCustomComponents} from "@/customComponents/index"
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
const {width, height} = toRefs(props.config)
const componentIs = computed(()=>{
  return getAsyncCustomComponents(props.config.content.component.is)
})

const infoWindowStyle = computed(()=>{
  const {width, height} = props.config
  return {
    width:width + "px", 
    height:height + "px"
  }
})

const attrs = computed(()=>{
  if(props.data){
    let _attrs = cloneDeep( props.config.content.attrs)
    return getValue(_attrs, props.data)
  }
  return props.config.content.attrs
})
</script>

<style scoped></style>
