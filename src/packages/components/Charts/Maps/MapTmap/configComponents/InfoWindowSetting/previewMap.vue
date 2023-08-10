<template>
  <tdt-map
    :center="center"
    :zoom="mapZindex"
    :loadConfig="loadScript"
    :mapStyle="(mapStyleKey as any)"
    @init="initMap"
  >
    <InfoWindow :config="config"></InfoWindow>
  </tdt-map>
</template>

<script setup lang="ts">
import { option, InfoWindowOptions } from "../../config";
// @ts-ignore
import { TdtMap } from "vue-tianditu";
import { InfoWindow } from "../../components";
import { useTmap } from "../../hooks/useTmapHooks";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
  config: {
    type: Object as PropType<typeof InfoWindowOptions>,
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
  props.config.position = center.value;
  props.config.visible = true;
}
</script>

<style scoped></style>
