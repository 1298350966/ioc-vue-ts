<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="层级">
      <el-input-number v-model="options.zIndex" />
    </setting-item>
    <setting-item name="圆点半径">
      <el-input-number v-model="options.radius" :min="0" />
    </setting-item>
    <setting-item name="填充颜色">
      <el-color-picker v-model="options.fillColor" show-alpha />
    </setting-item>
    <setting-item name="填充透明度">
      <el-input-number v-model="options.fillOpacity" :min="0" :max="1" :step="0.1"/>
    </setting-item>
    <setting-item name="线条颜色">
      <el-color-picker v-model="options.strokeColor" show-alpha />
    </setting-item>
    <setting-item name="线条透明度">
      <el-input-number v-model="options.strokeOpacity" :min="0" :max="1" :step="0.1"/>
    </setting-item>
    <setting-item name="线条宽度">
      <el-input-number v-model="options.strokeWeight" :min="0" :max="50" />
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
</script>

<style scoped></style>
