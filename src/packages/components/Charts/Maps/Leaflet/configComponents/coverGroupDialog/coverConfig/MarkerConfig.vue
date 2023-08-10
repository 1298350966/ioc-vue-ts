<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="层级">
      <el-input-number v-model="options.zIndexOffset" />
    </setting-item>
    <setting-item name="是否拖拽">
      <el-switch v-model="options.draggable" />
    </setting-item>
    <setting-item name="透明度">
      <el-input-number v-model="options.opacity" :step="0.1" :min="0" :max="1" />
    </setting-item>
    <setting-item name="图标url">
      <el-input v-model="options.icon.iconUrl">
        <template #append>
          <el-button @click="iconSelectShow = true" icon="Tools" />
        </template>
      </el-input>
      <icon-select v-if="iconSelectShow" v-model:show="iconSelectShow" v-model="options.icon.iconUrl"></icon-select>
    </setting-item>
    <setting-item name="偏移量">
      <div class="kh-g-2">
        <el-input-number v-model="offsetX" />
        <el-input-number v-model="offsetY" />
      </div>
    </setting-item>
    <setting-item name="图标大小">
      <div class="kh-g-2">
        <el-input-number v-model="imageSizeX" />
        <el-input-number v-model="imageSizeY" />
      </div>
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
    return props.options.icon.iconAnchor[0];
  },
  set(val) {
    props.options.icon.iconAnchor[0] = val;
  },
});

const offsetY = computed({
  get() {
    return props.options.icon.iconAnchor[1];
  },
  set(val) {
    props.options.icon.iconAnchor[1] = val;
  },
});

const imageSizeX = computed({
  get() {
    return props.options.icon.iconSize[0];
  },
  set(val) {
    props.options.icon.iconSize[0] = val;
  },
});
const imageSizeY = computed({
  get() {
    return props.options.icon.iconSize[1];
  },
  set(val) {
    props.options.icon.iconSize[1] = val;
  },
});


const labelOffsetX = computed({
  get() {
    return props.options.label.offset[0];
  },
  set(val) {
    props.options.label.offset[0] = val;
  },
});

const labelOffsetY = computed({
  get() {
    return props.options.label.offset[1];
  },
  set(val) {
    props.options.label.offset[1] = val;
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

const  iconSelectShow = ref(false)
</script>

<style scoped></style>
