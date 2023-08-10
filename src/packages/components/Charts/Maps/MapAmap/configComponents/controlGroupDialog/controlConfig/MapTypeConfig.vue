<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"/>
    </setting-item>
    <setting-item name="位置">
      <el-select-v2 v-model="options.position" :options="positionOptions" />
    </setting-item>
    <setting-item name="默认图层类型">
      <el-select-v2 v-model="options.defaultType" :options="defaultTypeOptions" />
    </setting-item>
    <setting-item name="是否叠加实时交通图层">
      <el-switch v-model="options.showTraffic"/>
    </setting-item>
    <setting-item name="是否叠加路网图层">
      <el-switch v-model="options.showRoad"/>
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
      value: "RT",
      label: "右上",
    },
    {
      value: "LT",
      label: "左上",
    },
    {
      value: "RB",
      label: "右下",
    },
    {
      value: "LB",
      label: "左下",
    },
  ];

  const defaultTypeOptions = [
    {
      value: 0,
      label: "默认底图",
    },
    {
      value: 1,
      label: "卫星图",
    },
  ]
  </script>
  
  <style scoped></style>
  