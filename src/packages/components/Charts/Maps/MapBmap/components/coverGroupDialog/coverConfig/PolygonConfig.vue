<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="层级">
      <el-input-number v-model="options.zIndex" />
    </setting-item>
    <setting-item name="填充颜色">
      <el-color-picker v-model="options.fillColor" show-alpha />
    </setting-item>
    <setting-item name="填充透明度">
      <el-input-number
        v-model="options.fillOpacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </setting-item>
    <setting-item name="线条颜色">
      <el-color-picker v-model="options.strokeColor" show-alpha />
    </setting-item>
    <setting-item name="线条透明度">
      <el-input-number
        v-model="options.strokeOpacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </setting-item>
    <setting-item name="线条宽度">
      <el-input-number v-model="options.strokeWeight" :min="0" :max="50" />
    </setting-item>
    <!-- <setting-item name="线条宽度">
      <el-input-number v-model="options.strokeWeight" :min="0" :max="50" />
    </setting-item> -->
    <setting-item name="线样式">
      <el-select-v2
        v-model="options.strokeStyle"
        :options="strokeStyleOptions"
      />
    </setting-item>
    <setting-item name="是否响应点击事件">
      <el-switch v-model="options.enableClicking" />
    </setting-item>
    <setting-item name="是否拖拽">
      <el-switch v-model="options.enableDragging" />
    </setting-item>
    <setting-item name="是否允许覆盖物map.clearOverlays清除">
      <el-switch v-model="options.enableMassClear" />
    </setting-item>
    <setting-item name="是否开启大地线模式">
      <el-switch v-model="options.geodesic" />
    </setting-item>
    <setting-item name="是否进行跨经度180度裁剪">
      <el-switch v-model="options.clip" />
    </setting-item>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});

const strokeStyleOptions = [
  {
    value: "solid",
    label: "实线",
  },
  {
    value: "dashed",
    label: "虚线",
  },
  {
    value: "dotted",
    label: "点状线",
  },
];
</script>

<style scoped></style>
