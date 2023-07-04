<template>
  <div>
    <setting-item name="位置">
      <el-select-v2 v-model="options.anchor" :options="positionOptions" />
    </setting-item>
    <setting-item name="控件偏移量">
    <div class="kh-g-2">
      <el-input-number v-model="options.offset['x']"/>
      <el-input-number v-model="options.offset['y']"/>
    </div>
  </setting-item>
  </div>
</template>

<script setup lang="ts">
import { controlAnchorEnum } from "../../../type";
const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});
const positionOptions = [
  {
    value: controlAnchorEnum.RT,
    label: "右上",
  },
  {
    value: controlAnchorEnum.LT,
    label: "左上",
  },
  {
    value: controlAnchorEnum.RB,
    label: "右下",
  },
  {
    value: controlAnchorEnum.LB,
    label: "左下",
  },
];
</script>

<style scoped></style>
