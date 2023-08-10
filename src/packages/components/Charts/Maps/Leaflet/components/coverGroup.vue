<template>
  <template>
    <div style="display: none" >
        <div v-for="(item, index) in config.data" :key="index">
        <component ref="CoverGroupRef" :is="componentIs" :config="config" :dataOptions="item">
        </component>
      </div>
      <InfoWindow v-if="config.InfoWindow.enable" :InfoWindow="config.InfoWindow"></InfoWindow>
      <!-- <LFeatureGroup v-if="config.InfoWindow.enable">
        <l-popup :key="key" class="popup" :style="InfoWindowStyle" :options="InfoWindowOptions" @ready="popupReady">
          <InfoWindow v-if="config.InfoWindow.options.visible" :config="config.InfoWindow.options"></InfoWindow>
        </l-popup>
      </LFeatureGroup> -->
    </div>
  </template>

  <div ref="content">
    <slot />
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { CoverGroupType } from '@/packages/index.d'
import { coverEnum } from "../config";
import { LFeatureGroup, LPopup } from "@vue-leaflet/vue-leaflet";
import { InfoWindow } from "./index"
import "./scss/InfoWindow.scss"

let props = defineProps<{
  config: CoverGroupType
}>();

const componentList = {
  [coverEnum.Marker]: defineAsyncComponent(() => import("./marker.vue")),
  [coverEnum.CircleMarker]: defineAsyncComponent(() => import("./circleMarker.vue")),
  [coverEnum.Polygon]: defineAsyncComponent(() => import("./polygon.vue")),
  [coverEnum.Polyline]: defineAsyncComponent(() => import("./polyline.vue"))
}
const componentIs = computed(() => {
  return componentList[props.config.type]
});
const popupObject = ref(null)

provide("coverGroupProvide", {
  InfoWindow:null,
  data:{}
});



</script>

<style scoped></style>
