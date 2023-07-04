<template>
  <tdt-map
    :center="center"
    :zoom="mapZindex"
    :loadConfig="loadScript"
    :mapStyle="(mapStyleKey as any)"
    @init="initMap"
  >
    <coverGroup :config="config"></coverGroup>
  </tdt-map>
</template>

<script setup lang="ts">
import { option, coverGroupOptions } from "../../config";
import { TdtMap } from "vue-tianditu/packages/index";
import coverGroup from "../coverGroup/index.vue";
import { useTmap } from "../../hooks/useTmapHooks";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
  config: {
    type: Object as PropType<typeof coverGroupOptions>,
    required: true,
  },
});
const mapIns = useTmap()
provide("mapIns",mapIns) 

let { mapKey, mapStyleKey, mapLng, mapLat, mapZindex, mapStyleKeyCustom } =
  toRefs(props.optionData.mapOptions);
const center = computed(() => {
  return [mapLng.value, mapLat.value];
});

const loadScript = computed(() => {
  return { v: "4.0", tk: mapKey.value };
});
function initMap(e) {
  mapIns.setMap(e)
}
</script>

<style scoped></style>
