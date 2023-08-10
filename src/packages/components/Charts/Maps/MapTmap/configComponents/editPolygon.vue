<template>
  <div class="editPolygonPath">
    <el-button @click="openDialog">编辑</el-button>
    <dragDialog
      title="多边形配置"
      v-if="dialogShow"
      v-model="dialogShow"
      width="75%"
      top="10vh"
    >
      <div style="height: 70vh; width: 100%">
        <tdt-map
          :center="center"
          :zoom="mapZindex"
          :loadConfig="loadScript"
          :mapStyle="(mapStyleKey as any)"
        >
          <tdt-polygon
            :color="optionData.mask.polygonOptions.color"
            :weight="optionData.mask.polygonOptions.weight"
            :opacity="optionData.mask.polygonOptions.opacity"
            :lineStyle="(optionData.mask.polygonOptions.lineStyle as any)"
            :edit="true"
            :path="path"
            @init="initPolygon"
          ></tdt-polygon>
        </tdt-map>
      </div>
      <template #footer>
        <el-button type="primary" @click="closeHandle">保存</el-button>
      </template>
    </dragDialog>
  </div>
</template>

<script setup lang="ts">
import { Json } from "@vicons/carbon";
import { option, coverGroupOptions } from "../config";
// @ts-ignore
import { TdtMap, TdtPolygon } from "vue-tianditu";
import { JSONStringify } from "@/utils";

let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
const dialogShow = ref(false);
let { mapKey, mapStyleKey, mapLng, mapLat, mapZindex, mapStyleKeyCustom } =
  toRefs(props.optionData.mapOptions);
const center = computed(() => {
  return [mapLng.value, mapLat.value];
});

const loadScript = computed(() => {
  return { v: "4.0", tk: mapKey.value };
});

const path = ref<any>([]);
let polygonIns = null;

function openDialog() {
  path.value = props.optionData.mask.polygonOptions.path[1] || [];
  dialogShow.value = true;
}
function closeHandle() {
  let _path = polygonIns.getLngLats()[0].map((p) => {
    return [p.lng, p.lat];
  });
  updatePath(_path);
  props.optionData.mask.polygonOptions.path[1] = path.value;
  dialogShow.value = false;
}
function updatePath(value) {
  console.log(value);
  if (value.length == 0) {
    console.log(path);
  } else {
    path.value = value;
  }
}
function initPolygon(e) {
  polygonIns = e;
}
const toLngLats = (lnglats: VT.LngLats) => {
  return lnglats.map((lnglat) => {
    const [lng, lat] = lnglat;
    return new T.LngLat(lng, lat);
  });
};
function setPath() {
  let _path = props.optionData.mask.polygonOptions.path.map((lnglats) => {
    return toLngLats(lnglats);
  });
  polygonIns.setLngLats([]);
}
</script>

<style lang="scss" scoped></style>
