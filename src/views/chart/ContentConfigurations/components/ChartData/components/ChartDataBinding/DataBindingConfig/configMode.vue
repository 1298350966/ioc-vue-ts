<template>
  <div class="configMode">
  <el-table :data="config" border row-key="id"  >
      <el-table-column label="目标" width="260px">
        <template #default="{ row }">
          <el-select-v2  v-model="row.targetId" :options="targetIdOptions"></el-select-v2>
        </template>
      </el-table-column>
      <el-table-column label="动态数据赋值">
        <template #default="{ row }">
          <el-input v-model="row.value"></el-input>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="80">
        <template #default="scope">
          <el-button link type="primary" size="small" @click.prevent="config.splice(scope.$index, 1)">
            删除
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-button style="width: 100%; margin-top: 10px" @click="addRow">添加一行</el-button>
  </div>
</template>

<script setup lang="ts">
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";


const { getStorageInfo } = useChartEditStore();
const props = defineProps<{
  config: {
    targetId: string;
    value: string;
  }[]
}>();

const targetIdOptions = ref([]);

function setTargetIdOptions() {
  let list:{
    label:string
    value:string
  }[] = [];
  listPush(getStorageInfo.componentList)  
  targetIdOptions.value = list;
  function listPush(componentList){
    componentList.forEach((c) => {
      if(c.isGroup){
        listPush(c.groupList)
      }
      list.push({
        label: `${c.chartConfig.title}(${c.id})`,
        value: c.id,
      });
    })
   
  }
}

function addRow() {
  props.config.push({
    value: "",
    targetId: "",
  });
}

const targetConfigOptions = ref([]);


onMounted(() => {
  setTargetIdOptions();
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
