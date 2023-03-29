<template>
  <el-collapse>
    <span>
        组件 id：
      </span>
    <el-collapse-item title="基础事件配置">
      <chart-event-base-handle></chart-event-base-handle>
    </el-collapse-item>
    <el-collapse-item title="高级事件配置">
      <chart-event-advanced-handle></chart-event-advanced-handle>
    </el-collapse-item>
  </el-collapse>
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

<style lang="" scoped>

</style>