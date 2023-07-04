<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="层级">
      <el-input-number v-model="options.zIndex" />
    </setting-item>
    <setting-item name="显示的层级范围">
      <el-slider
        style="padding: 0 10px; box-sizing: border-box"
        v-model="options.zooms"
        range
        show-stops
        :min="2"
        :max="20"
      />
    </setting-item>
    <setting-item name="图标标注">
      <setting-item name="url">
        <el-input v-model="options.icon.image"></el-input>
      </setting-item>
      <setting-item name="大小">
        <div class="kh-g-2">
          <el-input-number v-model="sizeX" />
          <el-input-number v-model="sizeY" />
        </div>
      </setting-item>
      <setting-item name="偏移位置">
        <div class="kh-g-2">
          <el-input-number v-model="clipOriginX" />
          <el-input-number v-model="clipOriginY" />
        </div>
      </setting-item>
      <setting-item name="裁剪大小">
        <div class="kh-g-2">
          <el-input-number v-model="clipSizeX" />
          <el-input-number v-model="clipSizeY" />
        </div>
      </setting-item>
      <setting-item name="锚点">
        <!-- <el-input v-model="options.icon.anchor"></el-input> -->
        <el-select-v2
          v-model="options.text.direction"
          :options="anchorOptions"
        ></el-select-v2>
      </setting-item>
    </setting-item>
    <setting-item name="文本标注">
      <setting-item name="标注内容">
        <el-input v-model="options.text.content"></el-input>
      </setting-item>
      <setting-item name="锚点">
        <el-select-v2
          v-model="options.text.direction"
          :options="anchorOptions"
        ></el-select-v2>
      </setting-item>
      <setting-item name="偏移位置">
        <div class="kh-g-2">
          <el-input-number v-model="textOffsetX" />
          <el-input-number v-model="textOffsetY" />
        </div>
      </setting-item>
      <setting-item name="文字大小">
        <el-input-number v-model="options.text.style.fontSize" />
      </setting-item>
      <setting-item name="文字颜色">
        <el-color-picker v-model="options.text.style.fillColor" show-alpha />
      </setting-item>
      <setting-item name="背景色">
        <el-color-picker
          v-model="options.text.style.backgroundColor"
          show-alpha
        />
      </setting-item>
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
const sizeX = computed({
  get() {
    return props.options.icon.size[0];
  },
  set(val) {
    props.options.icon.size[0] = val;
  },
});
const sizeY = computed({
  get() {
    return props.options.icon.size[1];
  },
  set(val) {
    props.options.icon.size[1] = val;
  },
});

const clipOriginX = computed({
  get() {
    return props.options.icon.clipOrigin[0];
  },
  set(val) {
    props.options.icon.clipOrigin[0] = val;
  },
});
const clipOriginY = computed({
  get() {
    return props.options.icon.clipOrigin[1];
  },
  set(val) {
    props.options.icon.clipOrigin[1] = val;
  },
});

const clipSizeX = computed({
  get() {
    return props.options.icon.clipSize[0];
  },
  set(val) {
    props.options.icon.clipSize[0] = val;
  },
});

const clipSizeY = computed({
  get() {
    return props.options.icon.clipSize[1];
  },
  set(val) {
    props.options.icon.clipSize[1] = val;
  },
});

const textOffsetX = computed({
  get() {
    return props.options.text.offset[0];
  },
  set(val) {
    props.options.text.offset[0] = val;
  },
});

const textOffsetY = computed({
  get() {
    return props.options.text.offset[1];
  },
  set(val) {
    props.options.text.offset[1] = val;
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
