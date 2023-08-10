<template>
  <dragDialog
    title="覆盖物群组配置"
    v-model="dialogShow"
    width="75%"
    top="10vh"
  >
    <el-container class="container">
      <el-main style="padding: 0">
        <previewMap
          :optionData="optionData"
          :config="props.config"
        ></previewMap>
      </el-main>
      <el-aside width="400px" class="aside">
        <el-scrollbar  wrap-style="padding: 0px 10px;">
          <el-tabs v-model="asideTabs.activeName" class="demo-tabs">
            <el-tab-pane label="配置" name="1">
              <coverConfig :config="props.config"></coverConfig>
            </el-tab-pane>
            <el-tab-pane label="数据" name="2">
              <coverDate :targetData="props.config"></coverDate>
            </el-tab-pane>
            <el-tab-pane label="事件" name="3">
              <coverEvent :targetData="props.config"></coverEvent>
            </el-tab-pane>
            <el-tab-pane label="信息窗口" name="4">
              <SettingItem name="事件类型">
                <el-select-v2 v-model="config.InfoWindow.eventType" :options="eventTypeOptions"></el-select-v2>
              </SettingItem>
              <SettingItem name="信息窗口启用">
                <el-switch v-model="config.InfoWindow.enable"></el-switch>
              </SettingItem>
              <InfoWindowConfig :config="config.InfoWindow.options"></InfoWindowConfig>
            </el-tab-pane>
          </el-tabs>
        </el-scrollbar>
      </el-aside>
    </el-container>
    <template #footer>
      <el-button type="primary" @click="closeHandle">保存</el-button>
    </template>
  </dragDialog>
</template>

<script setup lang="ts">
import { cloneDeep } from "lodash";
import { option, coverGroupOptions } from "../config";
import previewMap from "./coverGroupDialog/previewMap.vue";
// import coverConfig from "./coverGroupDialog/coverConfig.vue";
const coverConfig = defineAsyncComponent(
  () => import("./coverGroupDialog/coverConfig.vue")
);
const coverDate = defineAsyncComponent(
  () => import("./coverGroupDialog/coverDate.vue")
);
const coverEvent = defineAsyncComponent(
  () => import("./coverGroupDialog/coverEvent/index.vue")
);
const InfoWindowConfig = defineAsyncComponent(
  () => import("./InfoWindowSetting/InfoWindowConfig.vue")
);
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  config: {
    type: Object as PropType<typeof coverGroupOptions>,
    required: true,
  },
  optionData: {
    type: Object as PropType<typeof option>,
    required: true,
  },
});
provide("coverGroupConfig", props.config);
const emit = defineEmits(["update:modelValue", "save"]);
const dialogShow = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});
function closeHandle() {
  emit("save", props.config);
}

const asideTabs = reactive({
  activeName: "1",
});

const eventTypeOptions = [
  {
    value:"click",
    label:"点击"
  },
  {
    value:"mouseover",
    label:"鼠标进入"
  }
]
</script>

<style lang="scss" scoped>
.container {
  height: 650px;
  .aside {
    background: var(--bg-color-1);
  }
}
</style>
