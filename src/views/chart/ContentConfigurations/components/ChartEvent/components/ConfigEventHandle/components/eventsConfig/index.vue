<template>
  <div class="eChartEvent">
    <el-button style="width: 100%; margin-bottom: 10px" type="primary" @click="addEventConfig">添加</el-button>
    <el-empty description="无事件" :image-size="100" v-if="eventsConfig.length == 0"></el-empty>
    <template v-else>
      <div class="kh-flex-between eventBox" v-for="(item, index) in eventsConfig" :key="index"
        @click="editEventConfig(item, index)">
        <span class="flex-1 kh-nowrap"> {{ item.name }}</span>
        <el-icon size="18" @click.stop="deleteConfig">
          <DeleteFilled />
        </el-icon>
        <el-icon size="18">
          <ArrowRight />
        </el-icon>

      </div>
    </template>
    <EventConfigDialog v-if="dialogShow" v-model="dialogShow" :eventConfig="eventConfig" @save="editIndex == null ? saveConfig() : updateConfig()"></EventConfigDialog>
  </div>
</template>

<script setup lang="ts">

import { cloneDeep } from "lodash";
import { EventConfigType } from "@/packages/index.d";
import { getUUID } from "@/utils";
import EventConfigDialog from "./EventConfigDialog.vue"
import { FiltersEnum } from "@/components/Pages/FilterConfig/type";
const props = defineProps<{
  eventsConfig?: EventConfigType[]
}>()



const dialogShow = ref(false)
const eventConfig = ref<EventConfigType>({
  type: "",
  trigger: [],
  name: "",
  filters:{
    enable:false,
    type:FiltersEnum.AND,
    conditions:[]
  }
})
let editIndex = null

function addEventConfig() {
  editIndex = null
  eventConfig.value = {
    type: "",
    trigger: [],
    name: getUUID(),
    filters:{
      enable:false,
      type:FiltersEnum.OR,
      conditions:[]
    }
  }
  dialogShow.value = true
}


function saveConfig() {
  props.eventsConfig.push(eventConfig.value)
  dialogShow.value = false
}

function editEventConfig(item, index) {
  eventConfig.value = cloneDeep(item)
  editIndex = index
  dialogShow.value = true
}
function updateConfig() {
  props.eventsConfig[editIndex] = eventConfig.value
  dialogShow.value = false
}

function deleteConfig(index) {
  props.eventsConfig.splice(index, 1)
}
</script>

<style scoped lang="scss">
.el-header {
  border-bottom: 1px solid var(--dark-color-2);
}

.el-aside {
  border-right: 1px solid var(--dark-color-2);

  .aside-title {
    background: var(--dark-color-1a);
    padding: 10px;
  }
}

.aside {
  background-color: var(--dark-color-1a);
}

.item-box {
  margin: 10px;
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer;
  // border: 1px solid rgba(0, 0, 0, 0);
  // background: var(--dark-color-2);
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
  background-color: var(--dark-color-3);
  padding: 0 10px;
  height: 40px;
  border-radius: 5px;
  margin-bottom: 10px;
  cursor: pointer;
}
</style>