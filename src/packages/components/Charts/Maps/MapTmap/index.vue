<template>
  <div class="mapDiv">
    <tdt-map
      :center="center"
      :zoom="mapZindex"
      :loadConfig="loadScript"
      :map-style="mapStyleKey"
      :controls="mapControls"
      v-if="resetMap"
      @init="init"
    >
      <!-- 覆盖物组 -->
      <template
        v-for="(config, index) in chartConfig.option.coverGroupList"
        :key="index"
      >
        <coverGroup v-if="config.visible" :config="config"></coverGroup>
      </template>
      <!-- 弹窗 -->
      <template
        v-for="(config, index) in chartConfig.option.InfoWindowList"
        :key="index"
      >
        <InfoWindow v-if="config.visible" :config="config"></InfoWindow>
      </template>
      <!-- 自定义图层  -->
      <tdt-tilelayer
        v-if="mapStyleKeyCustom"
        :url="mapStyleKeyCustom"
        :zIndex="1"
      ></tdt-tilelayer>

      <maskPolygon
        v-if="props.chartConfig.option.mask.enable"
        :mask-config="chartConfig.option.mask"
      ></maskPolygon>
    </tdt-map>
  </div>
</template>

<script setup lang="ts">
import { ref, PropType, toRefs, watch } from "vue";
import { CreateComponentType } from "@/packages/index.d";
import { TdtMap, TdtTilelayer, TdtPolygon } from "vue-tianditu/packages/index";
import maskPolygon from "./components/maskPolygon.vue";
import { coverGroup, InfoWindow } from "./components/index";
import { mapTypeSelectOptions } from "./config";
import { useTmap } from "./hooks/useTmapHooks";
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});

const mapIns = useTmap()
provide("mapIns",mapIns) 

let { mapKey, mapStyleKey, mapLng, mapLat, mapZindex, mapStyleKeyCustom } =
  toRefs(props.chartConfig.option.mapOptions);

const center = computed(() => {
  return [mapLng.value, mapLat.value];
});

const loadScript = computed(() => {
  return { v: "4.0", tk: mapKey.value };
});

const vChartRef = ref<HTMLElement>();

const resetMap = ref(true)

const mapControls= computed(()=>{
  return props.chartConfig.option.controlGroupList.map(item=>{
    if(item.type === 'MapType'){  //MapType类型的控件需要匹配/MapType类型配置
      return {
        "name":item.type,
        "position":item.options.position,
        "mapTypes":item.options.mapTypes.map(el=>{
          let index = mapTypeSelectOptions.findIndex(el2=>el2.layer === el)
          resetMap.value = false;
          nextTick(()=>{
            resetMap.value = true;
          })
          if(index>0){
            return mapTypeSelectOptions[index]
          }else{
            return {}
          }
        })
      }
    }
    return {
      ...item.options,
      "name":item.type,
    }
  })
})

function init(e){
  mapIns.setMap(e)
}
</script>
