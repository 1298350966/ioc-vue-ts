<template>
  <div style="display: none">
    <template>
      <template v-for="(item, index) in configData" :key="index">
        <component
          :is="componentIs"
          v-bind="item"
          v-on="getEvents"
        ></component>
      </template>
    </template>
    <div ref="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  TdtMarker as Marker,
  TdtPolygon as Polygon,
  TdtPolyline as Polyline,
  TdtCircle as Circle,
} from "vue-tianditu/packages/index";
import { ControlGroupEvents, coverGroupOptions } from "../../config";
import { CoverGroupType } from "@/packages/index.d";
import { useDataMappingHook } from "./useDataMappingHook";
import { coverEnum } from "../../type";
import { useAddMapEvent } from "@/packages/hooks/useAddEvent.kooks";
import { useAmapType } from "../../hooks/useTmapHooks";
defineOptions({
  name: "coverGroup",
  components: {
    Marker,
    Circle,
    Polygon,
    Polyline,
  },
});



let props = defineProps({
  config: {
    type: Object as PropType<CoverGroupType>,
    required: true,
  },
});
//地图对象
const mapIns:useAmapType = inject("mapIns") 
//动态组件
const componentIs = computed(() => {
  return props.config.type || null;
});
//事件
const { rootConfig, getEvents } = useAddMapEvent(props.config, ControlGroupEvents)
//字段映射方法
const {setDataMappingOptions} = useDataMappingHook(props.config)
//数据配置
const configData  = computed(()=>{
  let list = []
  props.config.data.forEach((data) => {
    let options = { ...props.config.options };
    Object.keys(props.config.options).forEach((key) => {
      if (Object.keys(data).includes(key)) {
        options[key] = data[key];
      }
    });
    setDataMappingOptions(data,options)
    options.extData = data;
    if([coverEnum.Marker].includes(props.config.type)){
      if(options.position){
        list.push(options)
      }
    }else if(props.config.type == coverEnum.Circle){
      if(options.center){
        list.push(options)
      }
    }else if([coverEnum.Polyline, coverEnum.Polygon].includes(props.config.type)){
      if(options.path){
        list.push(options)
      }
    }else{
      list.push(options)
    }
  })
  return list
})

watch(configData,(newVal)=>{
  nextTick(()=>{
    let list = []
    if([coverEnum.Marker].includes(props.config.type)){
      newVal.forEach((options)=> {
        if(options.position){
          list.push(options.position)
        }
      })
    
    }else if(props.config.type == coverEnum.Circle){
      newVal.forEach((options)=> {
        if(options.center){
          list.push(options.center)
        }
      })
    }else if([coverEnum.Polyline, coverEnum.Polygon].includes(props.config.type)){
      newVal.forEach((options)=> {
        if(options.path	){
          list.push(...options.path)
        }
      })
    }
    mapIns.setCoverGroupViewport(list)
  })
})




</script>

<style scoped></style>
