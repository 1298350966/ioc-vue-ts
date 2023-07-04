<template>
  <dragDialog
    title="信息窗体配置"
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
      <el-aside width="350px" class="aside">
        <el-scrollbar>
          <el-tabs v-model="asideTabs.activeName" class="demo-tabs">
            <el-tab-pane label="配置" name="1">
              <InfoWindowConfig :config="config"></InfoWindowConfig>
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
import { option, InfoWindowOptions } from "../../config";
import previewMap from "./previewMap.vue";
import InfoWindowConfig from "./InfoWindowConfig.vue";
const props = defineProps({
  modelValue: {
    type: Boolean,
    required: true,
  },
  config: {
    type: Object as PropType<typeof InfoWindowOptions>,
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
</script>

<style lang="scss" scoped>
.container {
  height: 650px;
  .aside {
    background: var(--dark-color-1a);
    padding: 5px 10px;
  }
}
</style>
