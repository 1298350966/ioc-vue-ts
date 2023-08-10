<template>
  <div class="ChartEvent">
    <el-tabs v-model="tabsActiveName" class="demo-tabs">
      <el-tab-pane label="简单模式" name="1">
        <el-collapse>
          <ConfigEventHandle :configEvents="targetData.events.configEvents"></ConfigEventHandle>
        </el-collapse>
      </el-tab-pane>

      <el-tab-pane label="复杂模式" name="2">
        <div class="title">
          <span> 组件 id：{{ targetData.id }} </span>
        </div>
        <el-collapse>
          <component :is="componentIs" :optionData="targetData.option" :componentEvents="targetData.events.componentEvents"></component>
          <!-- 基础事件配置 -->
          <chart-event-base-handle></chart-event-base-handle>
          <!-- 高级事件配置 -->
          <chart-event-advanced-handle></chart-event-advanced-handle>
        </el-collapse>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script lang="ts" setup>
import { ChartEventAdvancedHandle } from "./components/ChartEventAdvancedHandle";
import { ChartEventBaseHandle } from "./components/ChartEventBaseHandle";
import { ConfigEventHandle } from "./components/ConfigEventHandle";
import { useTargetData } from "../hooks/useTargetData.hook";
import { fetchEventsComponent } from "@/packages";

defineOptions({
  name: "ChartEvent",
});

const { targetData } = useTargetData();
const tabsActiveName = ref("1");
const componentIs = computed(() => {
  return fetchEventsComponent(targetData.value.chartConfig.key)
})

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
