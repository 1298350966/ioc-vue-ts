<template>
  <div style="display: none" :key="groupKey" >
    <template>
      <div v-for="(item, index) in configData"  :key="index">
        <component
          ref="CoverGroupRef"
          :is="componentIs"
          v-bind="item"
          v-on="getEvents"
          @init="init"
          
        ></component>
      </div>
      <div v-if="config.InfoWindow.enable">
        <InfoWindow v-if="config.InfoWindow.options.visible" :config="config.InfoWindow.options" :data="InfoWindowData"></InfoWindow>
      </div>
    </template>
    <div ref="content">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
import {
  ElAmapMarker as Marker,
  ElAmapCircleMarker as CircleMarker,
  ElAmapPolygon as Polygon,
  ElAmapPolyline as Polyline,
  ElAmapLabelMarker as LabelMarker,
  ElAmapElasticMarker as ElasticMarker,
} from "@vuemap/vue-amap";
import { ControlGroupEvents, coverGroupOptions } from "../../config";
import { useAddEvent, useAddMapEvent } from "@/packages/hooks/useAddEvent.kooks";
import {CoverGroupType } from '@/packages/index.d'
import { useChartDataFetch } from "@/hooks";
import { useDataMappingHook } from "../../hooks/useDataMappingHook";
import { useAmapType } from "../../hooks/useAmapHooks";
import { cloneDeep } from "lodash";
import {InfoWindow} from "../index"
defineOptions({
  name: "coverGroup",
  components: {
    Marker,
    CircleMarker,
    Polygon,
    Polyline,
    LabelMarker,
    ElasticMarker,
  },
});
const mapIns:useAmapType = inject("map") 
let props = defineProps({
  config: {
    required: true,
    type: Object as PropType<CoverGroupType>,
  },
});

const {setDataMappingOptions} = useDataMappingHook(props.config)

const CoverGroupRef = ref(null)

const componentIs = computed(() => {
  return props.config.type || null;
});


const configData  = computed(()=>{
  let list = []
  props.config.data.forEach((data) => {
    let options = cloneDeep(props.config.options);
    Object.keys(props.config.options).forEach((key) => {
      if (Object.keys(data).includes(key)) {
        options[key] = data[key];
      }
    });
    setDataMappingOptions(data,options)
    options.extData = data;
    if(["Marker","LabelMarker","ElasticMarker"].includes(props.config.type)){
      if(props.config.type == "Marker"){
        options.icon =  new window.AMap.Icon({
          imageSize: options.icon.imageSize,
          image:options.icon.image,
        }) 
      }
      if(options.position){
        list.push(options)
      }
    }else if(props.config.type == "CircleMarker"){
      if(options.center){
        list.push(options)
      }
    }else if(["Polyline","Polygon"].includes(props.config.type)){
      if(options.path){
        list.push(options)
      }
    }else{
      list.push(options)
    }
  })
  return list
})

const InfoWindowData = ref(null)

const { rootConfig, getEvents,setEvents } = useAddMapEvent(props.config, ControlGroupEvents,(emitEvent)=>{
  const {options,eventType} = props.config.InfoWindow
  emitEvent.on(eventType,(e) =>{
    console.log(e);
    if(["Marker"].includes(props.config.type)){
      const position = e.target.getPosition().toArray()
      options.position = position
    }else{
      options.position =  e.lnglat.toArray()
    }
    if(e.target.getExtData){
      InfoWindowData.value = e.target.getExtData()
    }
    options.visible = true
  })
})

if(rootConfig){
  useChartDataFetch(props.config, rootConfig.requestGlobalConfig, (data) => {
    console.log(data);

  })
}
watch(() =>props.config.data,()=>{
  // mapIns.setCoverGroupFitView(props.config.id)
})

function init(cover) {
  // coverGroupList.push(cover)
  // mapIns.addCoverGroup(props.config.id,coverGroupList)
}
onMounted(()=>{
  mapIns.addCoverGroup(props.config.id,CoverGroupRef)
})

const groupKey = ref(0)
watch(()=>[props.config.InfoWindow.eventType],()=>{
  setEvents()
  groupKey.value++
})

</script>

<style scoped></style>
