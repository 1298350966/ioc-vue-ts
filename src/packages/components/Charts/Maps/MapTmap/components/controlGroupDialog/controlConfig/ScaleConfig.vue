<template>
    <div>
      <setting-item name="位置">
        <el-select-v2 v-model="options.position" :options="positionOptions" />
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
  