<template>
    <div>
      <setting-item name="位置">
        <el-select-v2 v-model="options.position" :options="positionOptions" />
      </setting-item>
      <setting-item name="放大层级按钮的文字显示">
        <el-input v-model="options.zoomInText" />
      </setting-item>
      <setting-item name="缩小层级按钮的文字显示">
        <el-input v-model="options.zoomOutText" />
      </setting-item>
      <setting-item name="放大层级按钮的标题显示">
        <el-input v-model="options.zoomInTitle" />
      </setting-item>
      <setting-item name="缩小层级按钮的标题显示">
        <el-input v-model="options.zoomOutTitle" />
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
  