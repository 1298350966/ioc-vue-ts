<template>
  <div class="InfoWindowConfig">
    <SettingItem name="窗体名称">
      <el-input v-model="config.name"></el-input>
    </SettingItem>
    <SettingItem name="样式名称">
      <el-select-v2 v-model="config.className" :options="classOptions" allow-create clearable placeholder="选择或输入样式名称"></el-select-v2>
    </SettingItem>
    <SettingItem name="是否显示">
      <el-switch v-model="config.visible"></el-switch>
    </SettingItem>
    <SettingItem name="宽度">
      <el-input-number v-model="config.width"></el-input-number>
    </SettingItem>
    <SettingItem name="高度">
      <el-input-number v-model="config.height"></el-input-number>
    </SettingItem>
    <SettingItem name="最大宽度">
      <el-input-number v-model="config.maxWidth"></el-input-number>
    </SettingItem>
    <SettingItem name="最小宽度">
      <el-input-number v-model="config.minWidth"></el-input-number>
    </SettingItem>
    <SettingItem name="最大高度">
      <el-input-number v-model="config.maxHeight"></el-input-number>
    </SettingItem>

    <SettingItem name="是否显示关闭按钮">
      <el-switch v-model="config.closeButton"></el-switch>
    </SettingItem>
    <SettingItem name="自己定义关闭按钮">
      <el-switch v-model="config.autoClose"></el-switch>
    </SettingItem>
    <SettingItem name="点击地图时关闭弹出窗口">
      <el-switch v-model="config.closeOnClick"></el-switch>
    </SettingItem>
    <SettingItem name="偏移量">
      <div class="kh-g-2">  
        <el-input-number v-model="offsetX"></el-input-number>
        <el-input-number v-model="offsetY"></el-input-number>
      </div>
    </SettingItem>
    <!-- <SettingItem name="信息窗体尺寸（isCustom为true时，该属性无效）">
      <div class="kh-g-2">  
      <el-input-number v-model="sizeX"></el-input-number>
      <el-input-number v-model="sizeY"></el-input-number>
      </div>
    </SettingItem> -->
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
        <el-input v-model="config.content.component.is">
          <template #append>
            <el-button icon="Tools" @click="componentSelectShow = true " />
          </template>
        </el-input>
        <componentSelect v-model:show="componentSelectShow" @select="componentSelectFun"></componentSelect>
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
import { PropType, computed, onMounted, onUnmounted, ref } from "vue";
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

const classOptions =  [
  {
    value: "leaflet-none",
    label: "自定义（leaflet-none）",
  },
];
// const sizeX = computed({
//   get() {
//     return props.config.size[0];
//   },
//   set(val) {
//     props.config.size[0] = val;
//   },
// });

// const sizeY = computed({
//   get() {
//     return props.config.size[1];
//   },
//   set(val) {
//     props.config.size[1] = val;
//   },
// });

const componentAttrsStr = ref(
  JSONStringify(props.config.content.attrs)
);
function setComponentAttrs() {
  try {
    props.config.content.attrs = JSONParse(componentAttrsStr.value);
  } catch (error) {
    componentAttrsStr.value = JSON.stringify(
      props.config.content.attrs
    );
  }
}


const componentSelectShow = ref(false)

function componentSelectFun(data){
  props.config.content.component.is = data.componentName
  props.config.content.attrs = data.props
  componentAttrsStr.value = JSONStringify(props.config.content.attrs)
}

onMounted(()=>{
  props.config.visible = true  
})
onUnmounted(() => {
  props.config.visible = false
});
</script>

<style scoped></style>
