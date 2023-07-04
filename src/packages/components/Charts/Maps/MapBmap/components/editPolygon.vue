<template>
  <div class="editPolygonPath">
    <!-- <el-button @click="openDialog">编辑</el-button>
    <dragDialog
      title="多边形配置"
      v-if="dialogShow"
      v-model="dialogShow"
      width="75%"
      top="10vh"
    >
      <div style="height: 70vh; width: 100%">
        <el-amap
          :resize-enable="true"
          :center="center"
          :zoom="amapZindex"
          :map-style="mapStyle"
          :lang="lang"
          :features="features"
          :view-mode="viewMode"
          :pitch="pitch"
          :sky-color="skyColor"
        >
          <el-amap-polygon
            v-bind="props.optionData.mask.polygonOptions"
            :editable="true"
            :path="path"
            @update:path="updatePath"
          ></el-amap-polygon>
        </el-amap>
      </div>
      <template #footer>
        <el-button type="primary" @click="closeHandle">保存</el-button>
      </template>
    </dragDialog> -->
  </div>
</template>

<script setup lang="ts">
import { option, coverGroupOptions } from "../config";
import { initBMapApiLoader, ElBmap, ElBmapMarker } from "vue-bmap-gl";
import "vue-bmap-gl/dist/style.css";
import coverGroup from "../coverGroup/index.vue";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
const dialogShow = ref(false);
let { mapKey, mapLog, mapLat, mapZindex, pitch, heading, mapType } = toRefs(
  props.optionData.mapOptions
);
const center = computed(() => {
  return [mapLog.value, mapLat.value];
});

initBMapApiLoader({
  ak: mapKey.value,
});
const path = ref<any>([]);
function openDialog() {
  path.value = props.optionData.mask.polygonOptions.path[1] || [];
  dialogShow.value = true;
}
function closeHandle() {
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
</script>

<style lang="scss" scoped></style>
