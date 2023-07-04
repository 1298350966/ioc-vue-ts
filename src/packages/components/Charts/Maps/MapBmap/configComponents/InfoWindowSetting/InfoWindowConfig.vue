<template>
  <div class="InfoWindowConfig">
    <SettingItem name="窗体名称">
      <el-input v-model="config.name"></el-input>
    </SettingItem>
    <SettingItem name="是否显示">
      <el-switch v-model="config.visible"></el-switch>
    </SettingItem>
    <SettingItem name="标题">
      <el-input v-model="config.title"></el-input>
    </SettingItem>
    <SettingItem name="窗体宽度(可选范围:0, 220 - 730)">
      <el-input-number v-model="config.width"></el-input-number>
    </SettingItem>
    <SettingItem name="窗体高度(可选范围:0, 60 - 650)">
      <el-input-number v-model="config.height"></el-input-number>
    </SettingItem>
    <setting-item name="偏移量">
      <div class="kh-g-2">  
        <el-input-number v-model="offsetX"></el-input-number>
        <el-input-number v-model="offsetY"></el-input-number>
      </div>
    </setting-item>
    <SettingItem name="是否自动调整窗体到视野内">
      <el-switch v-model="config.enableAutoPan"></el-switch>
    </SettingItem>
    <SettingItem name="是否在鼠标点击地图后关闭信息窗体">
      <el-switch v-model="config.enableCloseOnClick"></el-switch>
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

const offsetX = computed({
  get() {
    return props.config.offset['x'];
  },
  set(val) {
    props.config.offset['x'] = val;
  },
});

const offsetY = computed({
  get() {
    return props.config.offset['y'];
  },
  set(val) {
    props.config.offset['y'] = val;
  },
});

const bodyTypeOptions = [
  { value: "component", label: "内部组件" },
  { value: "iframe", label: "嵌入页面" },
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
</script>

<style scoped></style>
