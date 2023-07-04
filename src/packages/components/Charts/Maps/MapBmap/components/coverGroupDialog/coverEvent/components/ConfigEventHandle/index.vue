<template>
  <div class="ConfigEventHandle">
    <el-collapse-item title="组件事件配置" name="4">
      <eventsConfig :eventsConfig="configEvents.componentEvents"></eventsConfig>
    </el-collapse-item>
    <!-- <el-collapse-item title="基础事件配置" name="2">
      <el-button style="width: 100%; margin-bottom: 10px" type="primary" @click="addEventConfig">添加</el-button>

      <el-card v-for="(event, index) in configEvents.baseEvent" :key="index" style="margin-bottom: 10px">
        <el-icon size="20px" class="closeIcon" @click="configEvents.baseEvent.splice(index, 1)">
          <Close />
        </el-icon>

        <div class="g-l-v">
          <span>事件</span>
          <el-select size="small" v-model="event.type" placeholder="选择事件">
            <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value" />
          </el-select>
          <el-tooltip content="添加触发对象">
            <el-button size="small" style="margin-left: 5px" @click="addEventTriggerConfig(event)">
              <el-icon size="20px">
                <Add></Add>
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>

        <div v-for="(item, index) in event.trigger" :key="index">
          <el-divider />
          <EventTrigger :triggerConfig="item" @close="event.trigger.splice(index, 1)"></EventTrigger>
        </div>
      </el-card>
    </el-collapse-item> -->
    <!-- <el-collapse-item title="图表事件配置" name="3">

      <eventsConfig :eventsConfig="configEvents.eChartsEvents"></eventsConfig>
    </el-collapse-item> -->

    
  </div>
</template>

<script setup lang="ts">
import { ConfigEventsType } from "@/packages/index.d";
import {
  eventConfig,
  eventTriggerConfig,
} from "@/packages/public/publicConfig";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import EventTrigger from "./EventTrigger.vue";
import eventsConfig from "./components/eventsConfig/index.vue"
import { cloneDeep } from "lodash";
import { eventOptions, eventTypeOptions } from "./config";
import { Close, Add } from "@vicons/ionicons5";
const props = defineProps<{
  configEvents: ConfigEventsType;
}>();

// eventConfig.trigger.push(cloneDeep(eventTriggerConfig));
function addEventConfig() {
  props.configEvents.baseEvent.push(cloneDeep(eventConfig));
}
function addEventTriggerConfig(event) {
  event.trigger.push(cloneDeep(eventTriggerConfig));
}
</script>

<style scoped lang="scss">
.g-l-v {
  display: grid;
  grid-template-columns: 60px 1fr 40px;
  // margin-bottom: 10px;
}

.el-card {
  position: relative;

  .el-card__body {
    padding-top: 40px;
  }

  .closeIcon {
    position: absolute;
    top: 2px;
    right: 3px;
    color: var(--el-text-color-regular);
    opacity: 0;
  }

  &:hover {
    .closeIcon {
      opacity: 0.8;
    }
  }
}
</style>
