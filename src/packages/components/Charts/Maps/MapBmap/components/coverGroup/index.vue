<template>
  <div :key="groupKey">
    <template v-for="(item, index) in configData" :key="index">
      <component
        :is="componentIs"
        v-bind="item"
        v-on="getEvents"
        @[config.InfoWindow.eventType]="InfoWindowEvent($event, item.extData)"
      ></component>
    </template>
    <div v-if="config.InfoWindow.enable">
      <InfoWindow v-if="config.InfoWindow.options.visible" :config="config.InfoWindow.options" :data="InfoWindowData"></InfoWindow>
    </div>
    <div ref="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
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
 
import { ControlGroupEvents, coverGroupOptions } from "../../config";
import { CoverGroupType } from '@/packages/index.d';
import { useAmapType } from '../../hooks/useBmapHooks';
import { useAddMapEvent } from '@/packages/hooks/useAddEvent.kooks';
import { useDataMappingHook } from './useDataMappingHook';
import { coverEnum } from '../../type';
import {InfoWindow} from "../index"
defineOptions({
  name: "coverGroup",
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

const InfoWindowData = ref(null)

//事件
const { rootConfig, getEvents, setEvents } = useAddMapEvent(props.config, ControlGroupEvents, (emitEvent)=>{
  const {options,eventType} = props.config.InfoWindow
  console.log(eventType);
  // emitEvent.on(eventType,(e,data) =>{
  //   console.log(e,data);
  //   if(["Marker"].includes(props.config.type)){
  //     options.position = e.target.getPosition()
  //   }else{
  //     options.position = e.latLng
  //   }
  //   if(data){
  //     InfoWindowData.value = data
  //   }
  //   options.visible = true
  // })
})

const InfoWindowEvent = (e,data) =>{
    const {options,eventType} = props.config.InfoWindow
    console.log(e,data);
    if(["BMarker"].includes(props.config.type)){
      options.position = e.target.getPosition()
    }else{
      options.position = e.latLng
    }
    if(data){
      InfoWindowData.value = data
    }
    options.visible = true
}

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

const groupKey = ref(0)
watch(()=>[props.config.InfoWindow.eventType],()=>{
  setEvents()
  groupKey.value++
})

// function mouseover(e){
//   console.log(e);
// }
</script>

<style scoped></style>
