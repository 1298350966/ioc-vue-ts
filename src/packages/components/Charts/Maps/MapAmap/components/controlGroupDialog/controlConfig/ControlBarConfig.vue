<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"/>
    </setting-item>
    <setting-item name="位置">
      <el-select-v2 v-model="options.position" :options="positionOptions" />
    </setting-item>
    <setting-item name="控件偏移量（px）">
      <div class="kh-g-2">
        <el-input-number v-model="options.offset[0]"/>
        <el-input-number v-model="options.offset[1]"/>
      </div>
    </setting-item>
    <setting-item name="是否显示倾斜、旋转按钮">
      <el-switch v-model="options.showControlButton"/>
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
  </script>
  
  <style scoped></style>
  