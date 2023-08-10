<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="是否绘制边框">
      <el-switch v-model="options.stroke"></el-switch>
    </setting-item>
    <template v-if="options.stroke">
      <setting-item name="线条颜色">
        <el-color-picker v-model="options.color" show-alpha />
      </setting-item>
      <setting-item name="线条透明度">
        <el-input-number v-model="options.opacity" :min="0" :max="1" />
      </setting-item>
      <setting-item name="线条宽度">
        <el-input-number v-model="options.weight" :min="0" :max="50" />
      </setting-item>
    </template>
    <setting-item name="是否绘制填充">
      <el-switch v-model="options.fill"></el-switch>
    </setting-item>
    <template v-if="options.fill">
      <setting-item name="填充颜色">
        <el-color-picker size="small" v-model="options.fillColor" show-alpha />
      </setting-item>
      <setting-item name="填充透明度">
        <el-input-number
          size="small"
          v-model="options.fillOpacity"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </setting-item>
    </template>

    <setting-item name="折线拐点的绘制样式">
      <el-select-v2 v-model="options.lineJoin" :options="lineJoinOptions" />
    </setting-item>
    <setting-item name="折线两端线帽的绘制样式">
      <el-select-v2 v-model="options.lineCap" :options="lineCapOptions" />
    </setting-item>
    <setting-item name="方向箭头">
      <el-switch v-model="options.noClip" />
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
