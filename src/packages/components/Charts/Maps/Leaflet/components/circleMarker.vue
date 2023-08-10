<template>
  <LCircleMarker v-bind="configData" v-on="getEvents"></LCircleMarker>
</template>

<script setup lang="ts">
import { LCircleMarker } from "@vue-leaflet/vue-leaflet";
import { CoverGroupType } from "@/packages/index.d";
import {useDataMappingHook} from '../hooks/useDataMappingHook';
import { cloneDeep } from "lodash";
import { useAddMapEvent } from "@/packages/hooks/useAddEvent.kooks";
import { ControlGroupEvents } from "../config";

const props = defineProps<{
  config:CoverGroupType,
  dataOptions:any
}>()

const coverGroupProvide = inject<any>("coverGroupProvide")

const {getEvents, setEvents } = useAddMapEvent(props.config, ControlGroupEvents,(emitEvent)=>{
  const {eventType, options} = props.config.InfoWindow
  emitEvent.on(eventType,(e) =>{ 
    console.log(e);
    if(coverGroupProvide.InfoWindow){
      coverGroupProvide.InfoWindow.openPopup(e.latlng)
    }
  })
})

const {setDataMappingOptions} = useDataMappingHook(props.config)
  
const configData  = computed(()=>{
  const data = props.dataOptions  
  let options = cloneDeep(props.config.options);
  Object.keys(props.config.options).forEach((key) => {
    if (Object.keys(data).includes(key)) {
      options[key] = data[key];
    }
  });
  setDataMappingOptions(data,options)
  options.extData = data;
  return options
})



</script> 

<style scoped>

</style>