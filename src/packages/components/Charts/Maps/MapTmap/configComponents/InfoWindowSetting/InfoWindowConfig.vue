<template>
  <div class="InfoWindowConfig">
    <SettingItem name="窗体名称">
      <el-input v-model="config.name"></el-input>
    </SettingItem>
    <SettingItem name="是否显示">
      <el-switch v-model="config.visible"></el-switch>
    </SettingItem>
    <SettingItem name="最小宽度">
      <el-input-number v-model="config.minWidth"></el-input-number>
    </SettingItem>
    <SettingItem name="最大宽度">
      <el-input-number v-model="config.maxWidth"></el-input-number>
    </SettingItem>
    <SettingItem name="最大高度">
      <el-input-number v-model="config.maxHeight"></el-input-number>
    </SettingItem>
    <SettingItem name="是否开启信息窗口打开时地图自动移动">
      <el-switch v-model="config.autoPan"></el-switch>
    </SettingItem>
    <SettingItem name="控制弹出窗口中出现的关闭按钮">
      <el-switch v-model="config.closeButton"></el-switch>
    </SettingItem>

    <SettingItem name="偏移量">
      <div class="kh-g-2">
        <el-input-number v-model="offsetX"></el-input-number>
        <el-input-number v-model="offsetY"></el-input-number>
      </div>
    </SettingItem>

    <SettingItem name="边距">
      <div class="kh-g-2">
        <el-input-number v-model="autoPanPaddingX"></el-input-number>
        <el-input-number v-model="autoPanPaddingY"></el-input-number>
      </div>
    </SettingItem>
    <SettingItem name="是否开启点击地图关闭信息窗口">
      <el-switch v-model="config.closeOnClick"></el-switch>
    </SettingItem>
    <SettingItem name="类型">
      <el-select v-model="config.content.type">
        <el-option
          v-for="item in bodyTypeOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        />
      </el-select>
    </SettingItem>
    <template v-if="config.content.type === 'component'">
      <SettingItem name="组件名称">
        <el-input v-model="config.content.component.is"></el-input>
      </SettingItem>
    </template>
    <template v-else-if="config.content.type === 'iframe'">
      <SettingItem name="链接地址">
        <el-input v-model="config.content.iframe.src"></el-input>
      </SettingItem>
    </template>
    <SettingItem name="组件传参">
      <el-card body-style="padding:0">
        <monaco-editor
          height="300px"
          v-model:modelValue="componentAttrsStr"
          language="json"
          :editorOptions="{
            lineNumbers: 'off',
            lineDecorationsWidth: -20,
            minimap: { enabled: false },
          }"
          @blur="setComponentAttrs"
        />
      </el-card>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
import { JSONParse, JSONStringify } from "@/utils";
import { InfoWindowOptions } from "../../config";
let props = defineProps({
  config: {
    type: Object as PropType<typeof InfoWindowOptions>,
    required: true,
  },
});

const bodyTypeOptions = [
  { value: "component", label: "内部组件" },
  { value: "iframe", label: "嵌入页面" },
];

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
const componentAttrsStr = ref(
  JSONStringify(props.config.content.component.attrs)
);
function setComponentAttrs() {
  try {
    props.config.content.component.attrs = JSONParse(componentAttrsStr.value);
  } catch (error) {
    componentAttrsStr.value = JSON.stringify(
      props.config.content.component.attrs
    );
  }
}
const offsetX = computed({
  get() {
    return props.config.offset[0];
  },
  set(val) {
    props.config.offset[0] = val;
  },
});

const offsetY = computed({
  get() {
    return props.config.offset[1];
  },
  set(val) {
    props.config.offset[1] = val;
  },
});

const autoPanPaddingX = computed({
  get() {
    return props.config.autoPanPadding[0];
  },
  set(val) {
    props.config.autoPanPadding[0] = val;
  },
});

const autoPanPaddingY = computed({
  get() {
    return props.config.autoPanPadding[1];
  },
  set(val) {
    props.config.autoPanPadding[1] = val;
  },
});
</script>

<style scoped></style>
