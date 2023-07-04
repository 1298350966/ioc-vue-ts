<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="层级">
      <el-input-number v-model="options.zIndex" />
    </setting-item>
    <setting-item name="线条颜色">
      <el-color-picker v-model="options.strokeColor" show-alpha />
    </setting-item>
    <setting-item name="线条透明度">
      <el-input-number v-model="options.strokeOpacity" :min="0" :max="1" />
    </setting-item>
    <setting-item name="线条宽度">
      <el-input-number v-model="options.strokeWeight" :min="0" :max="50" />
    </setting-item>
    <setting-item name="线样式">
      <el-select-v2
        v-model="options.strokeStyle"
        :options="strokeStyleOptions"
      />
    </setting-item>
    <setting-item name="折线拐点的绘制样式">
      <el-select-v2 v-model="options.lineJoin" :options="lineJoinOptions" />
    </setting-item>
    <setting-item name="折线两端线帽的绘制样式">
      <el-select-v2 v-model="options.lineCap" :options="lineCapOptions" />
    </setting-item>
    <setting-item name="方向箭头">
      <el-switch v-model="options.showDir" />
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
];

const lineJoinOptions = [
  {
    value: "miter",
    label: "尖角",
  },
  {
    value: "round",
    label: "圆角",
  },
  {
    value: "bevel",
    label: "斜角",
  },
];
const lineCapOptions = [
  {
    value: "butt",
    label: "无头",
  },
  {
    value: "round",
    label: "圆头",
  },
  {
    value: "square",
    label: "方头",
  },
];
</script>

<style scoped></style>
