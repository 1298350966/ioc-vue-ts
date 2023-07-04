<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="层级">
      <el-input-number v-model="options.zIndex" />
    </setting-item>
    <setting-item name="偏移量">
      <div class="kh-g-2">
        <el-input-number v-model="offsetX" />
        <el-input-number v-model="offsetY" />
      </div>
    </setting-item>
    <setting-item name="拖拽移动">
      <el-switch v-model="options.draggable"></el-switch>
    </setting-item>
    <setting-item name="样式映射">
      <el-input v-model="zoomStyleMapping"></el-input>
    </setting-item>
    <setting-item name="样式组">
      <el-input v-model="styles"></el-input>
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
const offsetX = computed({
  get() {
    return props.options.offset[0];
  },
  set(val) {
    props.options.offset[0] = val;
  },
});

const offsetY = computed({
  get() {
    return props.options.offset[1];
  },
  set(val) {
    props.options.offset[1] = val;
  },
});

const zoomStyleMapping = computed({
  get() {
    return JSON.stringify(props.options.zoomStyleMapping);
  },
  set(val) {
    try {
      props.options.zoomStyleMapping = JSON.parse(val);
    } catch (error) {
      console.log(error);
    }
  },
});
const styles = computed({
  get() {
    return JSON.stringify(props.options.styles);
  },
  set(val) {
    try {
      props.options.styles = JSON.parse(val);
    } catch (error) {
      console.log(error);
    }
  },
});
</script>

<style scoped></style>
