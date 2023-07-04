<template>
  <div style="display: none">
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
import { useDataMappingHook } from "./useDataMappingHook";
import { useAmapType } from "../../hooks/useAmapHooks";
import { cloneDeep } from "lodash";
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

const componentShow = ref(false);
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


const { rootConfig, getEvents } = useAddMapEvent(props.config, ControlGroupEvents)

// function getEvent(data) {
//   const baseEvent: { [key: string]: any } = {};
//   for (const key in props.config.events.baseEvent) {
//     baseEvent[key] = function (e) {
//       new Function("e", "data", props.config.events.baseEvent[key]).call(
//         this,
//         e,
//         data
//       );
//     };
//   }
//   return baseEvent;
// }
if(rootConfig){
  useChartDataFetch(props.config, rootConfig.requestGlobalConfig, (data) => {
    console.log(data);

  })
}
watch(() =>props.config.data,()=>{
  // mapIns.setCoverGroupFitView(props.config.id)
})
function goCoverGroupCenter(){
  nextTick(()=>{
    if(configData.value){
      if(["Marker","LabelMarker","ElasticMarker"].includes(props.config.type)){
        let list = configData.value.map((data)=>{
          return data.position
        })
        mapIns.setBounds(list)
      }else if(["Polyline","Polygon"].includes(props.config.type)){
        let list = []
        configData.value.forEach((data)=>{
          list.push(...data.path) 
        })
        console.log(`setBounds->`,list)
        mapIns.setBounds(list)
      }
    }
  })
}




function  collectCoverGroup(){
  nextTick(()=>{
    let coverGroupList = []
    CoverGroupRef.value.forEach((coverRef) => {
      let cover = coverRef.$$getInstance()
      console.log(`output->`,cover)
      coverGroupList.push(cover)
    }) 
   
  })
}

function init(cover) {
  // coverGroupList.push(cover)
  // mapIns.addCoverGroup(props.config.id,coverGroupList)
}
onMounted(()=>{
  mapIns.addCoverGroup(props.config.id,CoverGroupRef)
})
</script>

<style scoped></style>
