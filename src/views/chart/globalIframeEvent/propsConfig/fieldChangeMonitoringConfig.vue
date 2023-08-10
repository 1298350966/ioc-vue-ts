<template>
  <div class="fieldChangeMonitoringConfig">
    <el-tabs v-model="eventActiveName" class="demo-tabs">
      <el-tab-pane label="属性配置" name="1">
        <el-card class="mb-15px card-box" v-for="(item, index) in eventConfig.trigger" :key="index">
          <el-icon size="20px" class="closeIcon" @click="eventConfig.trigger.splice(index, 1)">
            <Close />
          </el-icon>
          <EventTrigger :triggerConfig="item" :eventDes="propsFunConfig"></EventTrigger>
        </el-card>
        <el-button class="w-100%" @click="addEventTrigger">添加触发动作</el-button>
      </el-tab-pane>
      <el-tab-pane label="过滤条件" name="2" v-if="eventConfig.filters">
        <FilterConfig :filters="eventConfig.filters" :mappingFieldOptions="propsFunConfig.vars"></FilterConfig>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { EventConfigType, EventType } from '@/packages/index.d';
import EventTrigger from '@/views/chart/ContentConfigurations/components/ChartEvent/components/ConfigEventHandle/components/eventsConfig/EventTrigger.vue';
import { cloneDeep } from 'lodash';
import { eChartEventTriggerConfig } from '../../ContentConfigurations/components/ChartEvent/components/ConfigEventHandle/config';



const props = defineProps<{
  eventConfig:EventConfigType,
  propsFunConfig:EventType
}>()

const eventActiveName = ref("1")

function addEventTrigger() {
  props.eventConfig.trigger.push(cloneDeep(eChartEventTriggerConfig))
}
</script>

<style lang="scss" scoped>
.card-box{
  position: relative;
  .closeIcon {
    position: absolute;
    right: 10px;
    top: 10px;
    cursor: pointer;
  }
}


</style>