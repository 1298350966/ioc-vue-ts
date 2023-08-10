<template>
  <el-collapse v-model="collapseActive">
    <el-collapse-item name="1" title="弹窗设置">
      <SettingItemBox style="margin: 0">
        <SettingItem name="标题">
          <el-input v-model="optionData.attrs.title"></el-input>
        </SettingItem>
        <SettingItem name="宽度">
          <el-input v-model="optionData.attrs.width"></el-input>
        </SettingItem>
        <SettingItem name="头部位置">
          <el-input v-model="optionData.attrs.top"></el-input>
        </SettingItem>
        <SettingItem name="全屏">
          <el-switch v-model="optionData.attrs.fullscreen"></el-switch>
        </SettingItem>
        <SettingItem name="遮罩层">
          <el-switch v-model="optionData.attrs.modal"></el-switch>
        </SettingItem>
        <SettingItem name="拖拽功能">
          <el-switch v-model="optionData.attrs.draggable"></el-switch>
        </SettingItem>
        <SettingItem name="显示">
          <el-switch v-model="optionData.show"></el-switch>
        </SettingItem>
      </SettingItemBox>
    </el-collapse-item>

    <el-collapse-item name="2" title="内容设置">
      <SettingItemBox style="margin: 0">
        <SettingItem name="类型">
          <el-select v-model="optionData.body.type">
            <el-option v-for="item in bodyTypeOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
        </SettingItem>
        <template v-if="optionData.body.type === 'component'">
          <SettingItem name="组件名称">
            <el-input v-model="optionData.body.component.is">
              <template #append>
              <el-button icon="Tools" @click="componentSelectShow = true" />
            </template>
            </el-input>
            <componentSelect v-model:show="componentSelectShow" @select="componentSelectFun"></componentSelect>
          </SettingItem>
        </template>
        <template v-else-if="optionData.body.type === 'iframe'">
          <SettingItem name="链接地址">
            <el-input v-model="optionData.body.iframe.src"></el-input>
          </SettingItem>
        </template>
      </SettingItemBox>
      <SettingItemBox alone style="margin: 0">
        <SettingItem name="组件传参">
          <el-card body-style="padding:0">
            <monaco-editor height="300px" v-model:modelValue="componentAttrsStr" language="json" :editorOptions="{
              lineNumbers: 'on',
              minimap: { enabled: true },
            }" @blur="setComponentAttrs" />
          </el-card>
        </SettingItem>
      </SettingItemBox>
    </el-collapse-item>
  </el-collapse>
</template>

<script lang="ts" setup>
import { GlobalDialogType } from "../type";
import { Json } from "@vicons/carbon";
import { JSONParse, JSONStringify } from "@/utils";
import { MonacoEditor } from "@/components/Pages/MonacoEditor";
const props = defineProps({
  optionData: {
    type: Object as PropType<GlobalDialogType>,
    required: true,
  },
});
const collapseActive = ["1", "2"];
const componentSelectShow = ref(false)
const componentAttrsStr = ref(
  JSONStringify(props.optionData.body.attrs)
);
function setComponentAttrs() {
  try {
    props.optionData.body.attrs = JSONParse(componentAttrsStr.value);
  } catch (error) {
    componentAttrsStr.value = JSON.stringify(
      props.optionData.body.attrs
    );
  }
}

const bodyTypeOptions = [
  { value: "component", label: "内部组件" },
  { value: "iframe", label: "嵌入页面" },
];

function componentSelectFun(data) {
  props.optionData.body.component.is = ""
  nextTick(() => {
    props.optionData.body.component.is = data.componentName
  });
  props.optionData.body.attrs = data.props
  componentAttrsStr.value = JSONStringify(props.optionData.body.attrs)
}
</script>

<style scoped></style>
