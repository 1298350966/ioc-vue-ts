<template>
    <div>
      <setting-item name="位置">
        <el-select-v2 v-model="options.position" :options="positionOptions" />
      </setting-item>
      <setting-item name="缩略地图添加到地图后的开合状态">
        <el-switch v-model="options.isOpen" />
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
  const positionOptions = [
    {
      value: "topright",
      label: "右上",
    },
    {
      value: "topleft",
      label: "左上",
    },
    {
      value: "bottomright",
      label: "右下",
    },
    {
      value: "bottomleft",
      label: "左下",
    },
  ];
  </script>
  
  <style scoped></style>
  