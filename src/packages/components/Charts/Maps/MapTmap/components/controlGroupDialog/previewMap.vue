<template>
  <tdt-map
    :center="center"
    :zoom="mapZindex"
    :loadConfig="loadScript"
    :controls="(mapControls as any)"
    :mapStyle="(mapStyleKey as any)"
    v-if="resetMap"
  >
  </tdt-map>
</template>

<script setup lang="ts">
import { option, controlGroupOptions,mapTypeSelectOptions } from "../../config";
import { TdtMap } from "vue-tianditu/packages/index";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
  config: {
    type: Object,
    required: true,
  },
});

let { mapKey, mapStyleKey, mapLng, mapLat, mapZindex, mapStyleKeyCustom } =
  toRefs(props.optionData.mapOptions);
const center = computed(() => {
  return [mapLng.value, mapLat.value];
});

const loadScript = computed(() => {
  return { v: "4.0", tk: mapKey.value };
});

const resetMap = ref(true)
const mapControls= computed(()=>{
  let ans = [];
  let {type,options} = props.config
  if(type === "MapType"){
    let obj =  {
        "name":type,
        "position":options.position,
        "mapTypes":options.mapTypes.map(item=>{
          let index = mapTypeSelectOptions.findIndex(item2=>item2.layer === item)
          if(index>0){
            return mapTypeSelectOptions[index]
          }
          return {};
        })
    }
    ans.push(obj)
    resetMap.value = false;
    nextTick(()=>{
      resetMap.value = true;
    })
    return ans;
  }
  else{
    ans.push({
      ...options,
      "name":type,
    })
    resetMap.value = false;
    nextTick(()=>{
      resetMap.value = true;
    })
    return ans;
  }
})
</script>

<style scoped></style>
