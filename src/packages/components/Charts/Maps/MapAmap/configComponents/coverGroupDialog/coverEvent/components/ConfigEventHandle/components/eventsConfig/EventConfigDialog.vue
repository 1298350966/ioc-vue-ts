<template>
    <dragDialog title="事件配置" v-model="dialogShow" v-if="dialogShow">
      <div class="common-layout">
        <el-container class="h-180">
          <el-container>
            <el-aside width="260px" class="aside">
              <el-scrollbar view-style="padding: 10px 0;">
                <div :class="{ select: item.value == eventConfig.type }" class="item-box " v-for="item in eventOptions"
                  :key="item.value" @click="eventConfig.type = item.value">
                  {{ item.label  }}
                </div>
              </el-scrollbar>
            </el-aside>
            <el-main>
              <div class="grid  grid-items-center grid-gap-5px mb-15px">
                <label>事件名称</label>
                <el-input placeholder="请输入事件名称" v-model="eventConfig.name"></el-input>
              </div>
              <el-card class="mb-15px" v-for="(item, index) in eventConfig.trigger" :key="index">
                <el-icon size="20px" class="closeIcon" @click="eventConfig.trigger.splice(index, 1)">
                  <Close />
                </el-icon>
                <EventTrigger :triggerConfig="item" :eventDes="eventDes"></EventTrigger>
              </el-card>
              <el-button class="w-100%" @click="addEventTrigger">添加触发动作</el-button>
            </el-main>
          </el-container>
        </el-container>
      </div>
      <template #footer>
        <el-button type="primary" @click="saveConfig">保存</el-button>
      </template>
    </dragDialog>
</template>

<script setup lang="ts">
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { Close, Add } from "@vicons/ionicons5";
import EventTrigger from './EventTrigger.vue';
import { eChartEventTriggerConfig, eChartsEventOptions } from "../../config";
import { cloneDeep } from "lodash";
import { EventConfigType } from "@/packages/index.d";
import { getUUID } from "@/utils";
import { ControlGroupEvents } from "@/packages/components/Charts/Maps/MapAmap/config";

const props = defineProps<{
  modelValue: boolean,
  eventConfig?: EventConfigType
}>()
const emit = defineEmits(["update:modelValue","save"])
const dialogShow = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit('update:modelValue', val)
  }
})

const eventsConfig = computed(() => {
  let Events =  ControlGroupEvents
  return Events
})
const eventOptions = computed(() => {
  if (eventsConfig.value) {
    return Object.keys(eventsConfig.value).map(v => {
      return {
        label: eventsConfig.value[v].name,
        value: v
      }
    })
  } else {
    return eChartsEventOptions
  }
})

const eventDes = computed(() => {
  if(!eventsConfig.value) return null
  const _eventDes = eventsConfig.value[props.eventConfig.type]
  if (_eventDes) {
    return _eventDes
  } else {
    return null
  }
})



//简单事件触发配置

function addEventTrigger() {
  props.eventConfig.trigger.push(cloneDeep(eChartEventTriggerConfig))
}
const { getStorageInfo } = useChartEditStore();
const targetIdOptions = ref([]);

function setTargetIdOptions(type) {
  let list = [];
  if (type == "componentList") {
    getStorageInfo.componentList.forEach((c) => {
      list.push({
        label: `${c.chartConfig.title}(${c.id})`,
        value: c.id,
      });
    });
  } else if (type == "globalDialog") {
    getStorageInfo.globalDialog.forEach((g) => {
      list.push({
        label: `${g.attrs.title}(${g.id})`,
        value: g.id,
      });
    });
  }
  targetIdOptions.value = list;
}

function saveConfig() {
  emit("save", props.eventConfig)
  // props.eChartsEventsConfig.push(props.eventConfig)
  // dialogShow.value = false
}

onMounted(() => {
  if (!props.eventConfig.type) {
    props.eventConfig.type = eventOptions.value[0].value || ""
  }
  console.log(`output->`, props.eventConfig.type)
})

</script>

<style scoped lang="scss">
.el-header {
  border-bottom: 1px solid var(--bg-color-3);
}

.el-aside {
  border-right: 1px solid var(--bg-color-3);

  .aside-title {
    background: var(--bg-color-1);
    padding: 10px;
  }
}

.aside {
  background-color: var(--bg-color-1);
}

.item-box {
  margin: 10px;
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer;
  // border: 1px solid rgba(0, 0, 0, 0);
  // background: var(--bg-color-3);
  padding: 10px;

  &:first-child {
    margin-top: 0;
  }

}

.select {
  border: 1px solid #409eff;
  background-color: #40a0ff41;
}


.g-l-v-i {
  display: grid;
  grid-template-columns: 60px 1fr 40px;
  margin-bottom: 10px;
}

.g-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
}

.g-l-v {
  display: grid;
  grid-template-columns: 60px 1fr;
}

.closeIcon {
  position: absolute;
  right: 10px;
  top: 10px;
  cursor: pointer;
}

.el-card {
  position: relative;
}

.eventBox {
  background-color: var(--bg-color-3);
  padding: 0 10px;
  height: 40px;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>