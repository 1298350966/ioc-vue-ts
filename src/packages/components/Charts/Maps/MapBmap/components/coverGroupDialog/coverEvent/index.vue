<template>
  <div class="ChartEvent">
    <el-tabs v-model="tabsActiveName" class="demo-tabs">
      <el-tab-pane label="简单模式" name="1">
        <el-collapse>
          <ConfigEventHandle :configEvents="targetData.events.configEvents"></ConfigEventHandle>
        </el-collapse>
      </el-tab-pane>

      <el-tab-pane label="复杂模式" name="2">
        <el-collapse>
          <!-- 基础事件配置 -->
          <eventBase :targetData="targetData"></eventBase>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { coverGroupOptions } from "../../../config";
import { ConfigEventHandle } from "./components/ConfigEventHandle";
import eventBase from "./eventBase.vue";
const props = defineProps({
  targetData: {
    type: Object as PropType<typeof coverGroupOptions>,
    required: true,
  },
});
const tabsActiveName = ref("1");
</script>

<style lang="scss" scoped>
.ChartEvent {
  .title {
    font-size: 14px;
    margin-bottom: 15px;
  }

  :deep(.el-tabs__nav-wrap) {
    --el-tabs-header-height: 35px;

    .el-tabs__nav {
      display: grid;
      grid-template-columns: 1fr 1fr;
      width: 100%;
      background: #333;
      border-radius: 5px;
      overflow: hidden;
    }

    .is-active {
      background: var(--el-color-primary);
      color: #ffffff;
    }

    .el-tabs__active-bar {
      display: none;
    }

    &::after {
      display: none;
    }
  }
}
</style>
