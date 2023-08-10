<template>
  <LMarker :key="LMarkerKey" :v-if="configData.latLng" v-bind="configData" v-on="getEvents">
  </LMarker>
</template>

<script setup lang="ts">
import { LMarker, LPopup } from "@vue-leaflet/vue-leaflet";
import L from 'leaflet';
import { CoverGroupType } from "@/packages/index.d";
import { useDataMappingHook } from '../hooks/useDataMappingHook';
import { cloneDeep} from "lodash";
import { useAddMapEvent } from "@/packages/hooks/useAddEvent.kooks";
import { ControlGroupEvents } from "../config";

const props = defineProps<{
  config: CoverGroupType,
  dataOptions: any
}>()
const coverGroupProvide = inject<any>("coverGroupProvide")

const { setDataMappingOptions } = useDataMappingHook(props.config)

const {getEvents, setEvents } = useAddMapEvent(props.config, ControlGroupEvents,(emitEvent)=>{
  const {eventType} = props.config.InfoWindow
  emitEvent.on(eventType,(e) =>{ 
    console.log(e);
    if(coverGroupProvide.InfoWindow){
      coverGroupProvide.InfoWindow.openPopup(e.latlng,props.dataOptions)
    }
  })
})

const configData = ref<any>({
  latLng:null,
  icon:null,
  opacity:1,
  zIndexOffset: 1,
  draggable:false,
  options:null
})

function setConfigData() {
  const { icon } = props.config.options
  const data = props.dataOptions
  let options = cloneDeep(props.config.options);
  Object.keys(props.config.options).forEach((key) => {
    if (Object.keys(data).includes(key)) {
      options[key] = data[key];
    }
  });
  setDataMappingOptions(data, options)
  options.extData = data;
  options.icon = L.icon(icon)
  Object.keys(configData.value).forEach((key)=>{
    configData.value[key] = options[key]
  })
}
setConfigData()


const LMarkerKey = ref(0)
watch(()=>[props.config.InfoWindow.eventType],()=>{
  setEvents()
  LMarkerKey.value++
})
</script> 

<style lang="scss" >
</style>