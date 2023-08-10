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
    <setting-item name="图标url">
      <el-input v-model="options.icon.imageUrl"></el-input>
    </setting-item>
    <setting-item name="图标大小">
      <div class="kh-g-2">
        <el-input-number v-model="iconSizeX" />
        <el-input-number v-model="iconSizeY" />
      </div>
    </setting-item>
    <setting-item name="图标偏移量">
      <div class="kh-g-2">
        <el-input-number v-model="iconOffsetX" />
        <el-input-number v-model="iconOffsetY" />
      </div>
    </setting-item>
    <!-- <setting-item name="鼠标悬浮文字提示">
      <el-input v-model="options.title"></el-input>
    </setting-item> -->
    <!-- <setting-item name="文本内容">
      <el-input v-model="options.label.content"></el-input>
    </setting-item>
    <setting-item name="文本偏移量">
      <div class="kh-g-2">
        <el-input-number v-model="labelOffsetX" />
        <el-input-number v-model="labelOffsetY" />
      </div>
    </setting-item>
    <setting-item name="文本鼠标悬浮提示">
      <el-input v-model="options.label.title"></el-input>
    </setting-item> -->
    <setting-item name="旋转角度">
      <el-input-number v-model="options.rotation" />
    </setting-item>
    <setting-item name="拖拽标注是否开启离开效果">
      <el-switch v-model="options.raiseOnDrag" />
    </setting-item>
    <setting-item name="是否响应点击事件">
      <el-switch v-model="options.enableClicking" />
    </setting-item>
    <setting-item name="是否拖拽">
      <el-switch v-model="options.enableDragging" />
    </setting-item>
    <setting-item name="是否允许覆盖物map.clearOverlays清除">
      <el-switch v-model="options.enableMassClear" />
    </setting-item>
    <setting-item name="是否开启大地线模式">
      <el-switch v-model="options.geodesic" />
    </setting-item>
    <setting-item name="是否进行跨经度180度裁剪">
      <el-switch v-model="options.clip" />
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
    return props.options.offset['x'];
  },
  set(val) {
    props.options.offset['x'] = val;
  },
});

const offsetY = computed({
  get() {
    return props.options.offset['y'];
  },
  set(val) {
    props.options.offset['y'] = val;
  },
});

const iconSizeX = computed({
  get() {
    return props.options.icon.imageSize['width'];
  },
  set(val) {
    props.options.icon.imageSize['width'] = val;
  },
});
const iconSizeY = computed({
  get() {
    return props.options.icon.imageSize['height'];
  },
  set(val) {
    return props.options.icon.imageSize['height'] = val;
  },
});
const iconOffsetX = computed({
  get() {
    return props.options.icon.imageOffset['x'];
  },
  set(val) {
    return props.options.icon.imageOffset['x'] = val;
  },
});
const iconOffsetY = computed({
  get() {
    return props.options.icon.imageOffset['y'];
  },
  set(val) {
    return props.options.icon.imageOffset['y'] = val;
  },
});

const labelOffsetX = computed({
  get() {
    return props.options.label.offset['x'];
  },
  set(val) {
    props.options.label.offset['x'] = val;
  },
});

const labelOffsetY = computed({
  get() {
    return props.options.label.offset['y'];
  },
  set(val) {
    props.options.label.offset['y'] = val;
  },
});

const anchorOptions = [
  {
    value: "top-left",
    label: "top-left",
  },
  {
    value: "top-center",
    label: "top-center",
  },
  {
    value: "top-right",
    label: "top-right",
  },
  {
    value: "middle-left",
    label: "middle-left",
  },
  {
    value: "center",
    label: "center",
  },
  {
    value: "middle-right",
    label: "middle-right",
  },
  {
    value: "bottom-left",
    label: "bottom-left",
  },
  {
    value: "bottom-center",
    label: "bottom-center",
  },
  {
    value: "bottom-right",
    label: "bottom-right",
  },
];
</script>

<style scoped></style>
