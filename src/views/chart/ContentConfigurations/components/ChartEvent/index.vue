<template>
  <div class="ChartEvent">
    <div class="title">
      <span>
        组件 id：
      </span>
    </div>

      <el-collapse>
        <!-- 基础事件配置 -->
        <chart-event-base-handle></chart-event-base-handle>
        <!-- 高级事件配置 -->
        <chart-event-advanced-handle></chart-event-advanced-handle>
      </el-collapse>
  </div>

</template>

<script lang="ts" setup>
import { ChartEventAdvancedHandle } from './components/ChartEventAdvancedHandle'
import { ChartEventBaseHandle } from './components/ChartEventBaseHandle'
import { useTargetData } from '../hooks/useTargetData.hook'
defineOptions({
   name:"ChartEvent"
})

const { targetData } = useTargetData()
</script>

<style lang="scss" scoped>
.ChartEvent{
 .title{
  font-size: 14px;
  margin-bottom: 15px;
 }
}
</style>