<template>
  <div>
    <setting-item name="是否可见">
      <el-switch size="small" v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="层级">
      <el-input-number size="small" v-model="options.zIndex" />
    </setting-item>
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
    <setting-item name="线条颜色">
      <el-color-picker size="small" v-model="options.strokeColor" show-alpha />
    </setting-item>
    <setting-item name="线条透明度">
      <el-input-number
        size="small"
        v-model="options.strokeOpacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </setting-item>
    <setting-item name="线条宽度">
      <el-input-number
        size="small"
        v-model="options.strokeWeight"
        :min="0"
        :max="50"
      />
    </setting-item>
    <!-- <setting-item name="线条宽度">
      <el-input-number v-model="options.strokeWeight" :min="0" :max="50" />
    </setting-item> -->
    <setting-item name="线样式">
      <el-select-v2
        size="small"
        v-model="options.strokeStyle"
        :options="strokeStyleOptions"
      />
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
</script>

<style scoped></style>
