<template>
  <div class="eChartEvent">
    <el-button style="width: 100%; margin-bottom: 10px" type="primary" @click="addEventConfig">添加</el-button>
    <el-empty description="无事件" :image-size="100"></el-empty>
    <dragDialog title="事件配置" v-model="dialogShow" v-if="dialogShow">
      <div class="common-layout">
        <el-container class="h-180">
          <el-container>
            <el-aside width="260px" class="aside">
              <el-scrollbar view-style="padding: 10px 0;">
                <div :class="{ select: item.value == eventConfig.type }" class="item-box "
                  v-for="item in eChartsEventOptions" :key="item.value" @click="eventConfig.type = item.value">
                  {{ item.label }}
                </div>
              </el-scrollbar>
            </el-aside>
            <el-main>
              <el-card class="mb-15px" v-for="(item, index) in eventConfig.trigger" :key="index">
                <el-icon size="20px" class="closeIcon" @click="eventConfig.trigger.splice(index, 1)">
                  <Close />
                </el-icon>
                <!-- <EventTrigger :triggerConfig="item"></EventTrigger> -->
              </el-card>


              <el-button type="primary" @click="addEventTrigger">添加触发动作</el-button>

            </el-main>
          </el-container>
        </el-container>
      </div>
      <!-- <span>事件</span> -->

      <!-- <el-select size="small" v-model="event.type" placeholder="选择事件">
          <el-option v-for="item in eventOptions" :key="item.value" :label="item.label" :value="item.value" />
        </el-select> -->

    </dragDialog>
  </div>
</template>

<script setup lang="ts">
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { Close, Add } from "@vicons/ionicons5";
import EventTrigger from './eChartEvent//EventTrigger.vue';
import { eChartsEventOptions } from "../config";

const dialogShow = ref(false)
function addEventConfig() {
  dialogShow.value = true
}



const eventConfig = ref({
  type: "click",
  trigger: []
})
//简单事件触发配置
const eventTriggerConfig = {
  type: "globalDialog",
  targetId: '',
  update: []
}
function addEventTrigger() {
  eventConfig.value.trigger.push({
    type: "globalDialog",
    targetId: '',
    componentListUpdate: {
      "request.requestParams.Header": [],
      "request.requestParams.Params": [],
    }
  })
}
const { getStorageInfo } = useChartEditStore();

const targetIdOptions = ref([]);
function triggerChange(type, triggerConfig) {
  triggerConfig.targetId = "";
  triggerConfig.update = [];
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
</style>