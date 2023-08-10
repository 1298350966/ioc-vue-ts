<template>
    <dragDialog
      title="地图控件配置"
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
          <el-scrollbar view-style="padding: 5px 10px;">
            <el-tabs v-model="asideTabs.activeName" class="demo-tabs">
              <el-tab-pane label="配置" name="1">
                <controlConfig :config="props.config"></controlConfig>
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
  import { option, controlGroupOptions } from "../config";
  import previewMap from "./controlGroupDialog/previewMap.vue";
  // import controlConfig from "./controlGroupDialog/controlConfig.vue";
  const controlConfig = defineAsyncComponent(
    () => import("./controlGroupDialog/controlConfig.vue")
  );

  const props = defineProps({
    modelValue: {
      type: Boolean,
      required: true,
    },
    config: {
      type: Object as PropType<typeof controlGroupOptions>,
      required: true,
    },
    optionData: {
      type: Object as PropType<typeof option>,
      required: true,
    },
  });
  provide("controlGroupConfig", props.config);
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
  </script>
  
  <style lang="scss" scoped>
  .container {
    height: 650px;
    .aside {
      background: var(--bg-color-1);
      // padding: 5px 10px;
    }
  }
  </style>
  