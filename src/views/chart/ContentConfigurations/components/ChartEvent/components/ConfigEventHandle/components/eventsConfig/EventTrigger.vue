<template>
  <div class="EventTrigger">
    <div class="grid  grid-items-center grid-gap-15px grid-cols-2">
      <div class="grid grid-gap-5px">
        <span>类型</span>
        <el-select-v2 size="small" v-model="triggerConfig.type" :options="eventTypeOptions"
          @change="triggerChange"></el-select-v2>
      </div>
      <div class="grid grid-gap-5px">
        <span>目标</span>
        <el-select-v2 size="small" v-model="triggerConfig.targetId" :options="targetIdOptions" @change="targetIdChange"
          @visible-change="setTargetIdOptions(triggerConfig.type)"></el-select-v2>
      </div>
    </div> 
    <component v-if="targetConfig" :is="targetComponent" :triggerConfig="triggerConfig" :targetConfig="targetConfig" :mappingFieldOptions="mappingFieldOptions"></component>
    
  </div>
</template>

<script setup lang="ts">
import { EventTriggerConfigType, EventType } from "@/packages/index.d";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { get } from "lodash";
import { componentListUpdate, eventTypeOptions, globalDialogUpdate } from "../../config";
import { useTargetData } from "@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook";
const { getStorageInfo } = useChartEditStore();
const { targetData } = useTargetData();
const targetConfig = ref(null);
const props = defineProps<{
  triggerConfig: EventTriggerConfigType;
  eventDes: EventType
}>();

const targetIdOptions = ref([]);
function triggerChange(type) {
  props.triggerConfig.targetId = "";
 
  targetConfig.value = null
  setTargetIdOptions(type);
}
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


function setTargetConfigOptions() {
  let { type, targetId } = props.triggerConfig;
  if (type == "componentList") {
    targetConfig.value = getStorageInfo.componentList.find((c) => {
      return targetId == c.id;
    });

  } else if (type == "globalDialog") {
    targetConfig.value = getStorageInfo.globalDialog.find((c) => {
      return targetId == c.id;
    });
  } else {
    targetConfig.value = null
  }
}

function targetIdChange() {
  props.triggerConfig.updateValue = null
  setTargetConfigOptions();
}

const targetComponent = computed(() => {
  if (props.triggerConfig.type == "componentList") {
    if(['MapAmap'].includes(targetConfig.value.key)){
      return defineAsyncComponent(() => import("@/packages/components/Charts/Maps/MapAmap/configComponents/coverGroupDialog/coverEvent/components/ConfigEventHandle/components/MapComponentList/index.vue"))
    }else{
      return defineAsyncComponent(() => import("../componentList/index.vue"))
    }
  } else if (props.triggerConfig.type == "globalDialog") {
    return defineAsyncComponent(() => import("../globalDialog/index.vue"))
  } else {
    return null
  }

})
const mappingFieldOptions = computed(() => {
  if (props.eventDes) {
    props.eventDes.setVars && props.eventDes.setVars(targetData.value)
    return props.eventDes.vars
  } else { 
    return []
  }
}) 

onMounted(() => {
  setTargetIdOptions(props.triggerConfig.type);

  setTargetConfigOptions();
});
</script>

<style scoped lang="scss">
.g-l-v-i {
  display: grid;
  grid-template-columns: 60px 1fr 40px;
  margin-bottom: 10px;
}

.g-l-v {
  display: grid;
  grid-template-columns: 60px 1fr;
  margin-bottom: 10px;
}
</style>
