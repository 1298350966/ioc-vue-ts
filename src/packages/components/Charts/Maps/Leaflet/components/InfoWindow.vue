<template>
   <LFeatureGroup>
    <l-popup :key="key" class="popup" :style="InfoWindowStyle" :options="InfoWindowOptions" @ready="popupReady">
      <component-iframe :type="InfoWindow.options.content.type" :attrs="attrs" :component="InfoWindow.options.content.component" :iframe="InfoWindow.options.content.iframe"></component-iframe>
    </l-popup>
   </LFeatureGroup>
</template>

<script setup lang="ts">
import { LFeatureGroup, LPopup } from "@vue-leaflet/vue-leaflet";
import {getAsyncCustomComponents} from "@/customComponents/index"
import { coverGroupOptions } from "../config";
import { cloneDeep } from "lodash";
import { getValue } from "@/utils";

const props = defineProps<{
  InfoWindow:typeof coverGroupOptions.InfoWindow
}>();

const coverGroupProvide = inject<any>("coverGroupProvide")

const data =  ref(null)

const componentIs = computed(()=>{
  return getAsyncCustomComponents(props.InfoWindow.options.content.component.is)
})

const options = computed(()=>{
  const {offset,minWidth,maxWidth,maxHeight,closeButton,autoClose,closeOnClick,className} = props.InfoWindow.options
  return {
    offset:offset,
    minWidth:minWidth,
    maxWidth:maxWidth,
    maxHeight:maxHeight,
    closeButton:closeButton,
    autoClose:autoClose,
    closeOnClick:closeOnClick,
    className:className
  }
})

//信息窗口
const InfoWindowOptions = computed(() => {
  const { offset, minWidth, maxWidth, maxHeight, closeButton, autoClose, closeOnClick, className } = props.InfoWindow.options
  return {
    offset: offset,
    minWidth: minWidth,
    maxWidth: maxWidth,
    maxHeight: maxHeight,
    closeButton: closeButton,
    autoClose: autoClose,
    closeOnClick: closeOnClick,
    className: className
  }
})

const InfoWindowStyle = computed(() => {
  const { width, height } = props.InfoWindow.options
  return {
    width: width + "px",
    height: height + "px"
  }
})

const key=ref(0)
watch(() => [props.InfoWindow.options], () => {
  key.value++
}, {
  deep: true,
  immediate: true
})


const popupObject = ref(null)
function popupReady(e) {
  popupObject.value = e
  if(coverGroupProvide){
    coverGroupProvide.InfoWindow = {
      popupObject:e,
      openPopup:openPopup
    }
  }
}

function openPopup(latLng,_data) {
  popupObject.value.setLatLng(latLng).openOn()
  data.value = _data
  debugger
}



onBeforeUnmount(()=>{
  coverGroupProvide.InfoWindow = null
})

const attrs = computed(()=>{
  if(data.value){
    let _attrs = cloneDeep( props.InfoWindow.options.content.attrs)
    return getValue(_attrs,data.value)
  }
  return props.InfoWindow.options.content.attrs
})



</script>

<style scoped></style>
