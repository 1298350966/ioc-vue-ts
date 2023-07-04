<template>
  <div class="editPolygonPath">
    <el-button size="small" @click="openDialog">编辑</el-button>
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
    </dragDialog>
  </div>
</template>

<script setup lang="ts">
import { option, coverGroupOptions } from "../config";
import { initAMapApiLoader, ElAmap, ElAmapPolygon } from "@vuemap/vue-amap";
import "@vuemap/vue-amap/dist/style.css";
import coverGroup from "../coverGroup/index.vue";
let props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
const dialogShow = ref(false);
let {
  amapKey,
  amapStyleKey,
  amapLon,
  amapLat,
  amapZindex,
  lang,
  amapStyleKeyCustom,
  features,
  viewMode,
  pitch,
  skyColor,
} = toRefs(props.optionData.mapOptions);
const center = computed(() => {
  return [amapLon.value, amapLat.value];
});

const mapStyle = computed(() => {
  return `amap://styles/${
    amapStyleKeyCustom.value !== ""
      ? amapStyleKeyCustom.value
      : amapStyleKey.value
  }`;
});

initAMapApiLoader({
  key: amapKey.value,
  securityJsCode: "securityJsCode", // 新版key需要配合安全密钥使用
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
