<template>
  <div class="EventTrigger">
    <div class="g-l-v-i">
      <span>类型</span>
      <el-select-v2 size="small" v-model="triggerConfig.type" :options="eventTypeOptions"
        @change="triggerChange"></el-select-v2>
      <el-tooltip content="删除触发对象">
        <el-button type="danger" size="small" style="margin-left: 10px" @click="$emit('close')">
          <el-icon size="14px" class="closeIcon">
            <Delete />
          </el-icon>
        </el-button>
      </el-tooltip>
    </div>
    <div class="g-l-v">
      <span>目标</span>
      <el-select-v2 size="small" v-model="triggerConfig.targetId" :options="targetIdOptions" @change="targetIdChange"
        @visible-change="setTargetIdOptions(triggerConfig.type)"></el-select-v2>
    </div>

    <el-table size="small" :data="triggerConfig.update" border row-key="id">
      <el-table-column label="字段">
        <template #default="{ row }">
          <!-- <el-input size="small" v-model="row.key"></el-input> -->
          <el-cascader size="small" v-model="row.key" :options="targetConfigOptions"
            @change="updateKeyChange(row.key, row)" />
        </template>
      </el-table-column>
      <el-table-column label="赋值">
        <template #default="{ row }">
          <el-switch v-if="row.type == 'boolean'" v-model="row.value"></el-switch>
          <el-input v-else-if="row.type == 'number'" size="small" v-model.number="row.value"></el-input>
          <el-input v-else size="small" v-model="row.value"></el-input>
          <!-- <el-select-v2 size="small" v-model="row.value" :options="valueOptions"
            @visible-change="updateKeyChange(row.key, row)"></el-select-v2> -->
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="50">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="triggerConfig.update.splice(scope.$index, 1)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button size="small" style="width: 100%; margin-top: 10px" @click="addRow">添加一行</el-button>
  </div>
</template>

<script setup lang="ts">
import { EventTriggerConfigType } from "@/packages/index.d";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { eventTypeOptions } from "./config";
import { get } from "lodash";
const { getStorageInfo } = useChartEditStore();
const props = defineProps<{
  triggerConfig: EventTriggerConfigType;
}>();

const targetIdOptions = ref([]);
function triggerChange(type) {
  props.triggerConfig.targetId = "";
  props.triggerConfig.update = [];
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
function addRow() {
  props.triggerConfig.update.push({
    key: [],
    value: "",
    type: "",
  });
}

const targetConfigOptions = ref([]);
function setTargetConfigOptions() {
  let { type, targetId } = props.triggerConfig;
  let list = [];
  if (type == "componentList") {
    let targetConfig = getStorageInfo.componentList.find((c) => {
      return targetId == c.id;
    });
    targetConfig && getKeys(targetConfig, list);

  } else if (type == "globalDialog") {
    let targetConfig = getStorageInfo.globalDialog.find((c) => {
      return targetId == c.id;
    });
    targetConfig && getKeys(targetConfig, list);
  }
  targetConfigOptions.value = list;
}
function targetIdChange() {
  props.triggerConfig.update = [];
  setTargetConfigOptions();
}

function getKeys(obj, list) {
  for (const key in obj) {
    const e = obj[key];
    let _options: any = {};
    if (typeof e == "object") {
      _options.value = key;
      _options.label = key;
      _options.children = [];
      getKeys(e, _options.children);
    } else {
      _options.value = key;
      _options.label = key;
    }
    list.push(_options);
  }
}
const valueOptions = ref([])
function updateKeyChange(key, row) {
  let { type, targetId } = props.triggerConfig;
  let targetConfig = getStorageInfo[type].find((c) => {
    return targetId == c.id;
  });
  row.type = typeof get(targetConfig, key);

  if (row.type == "boolean") {
    row.value = false;
    valueOptions.value = [
      {
        label: "false",
        value: false
      },
      {
        label: "true",
        value: true
      }
    ]
  } else {
    row.value = "";
    valueOptions.value = []
    if (type == "componentList") {
      let list = targetConfig.option.dataset.dimensions.map((v) => ({
        label: v,
        value: "${data." + v + "}"
      }))
      valueOptions.value.push(...list)
    }

  }
}




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
