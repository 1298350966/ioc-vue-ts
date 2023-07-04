<template>
  <div>
    <div>
      <div class="title grid-c-1-18-5 mb-2 ">
        <span>X轴/维度或度量</span>
      </div>

      <div v-for="(item, index) in props.dataMapping.xAxis" :key="index" class="grid-c-2-0-5 mb-2">
        <el-tooltip content="名称" trigger="click">
          <el-input v-model="item.name" class="flex-1" placeholder="请输入名称"></el-input>
        </el-tooltip>
        <el-tooltip content="字段" trigger="click">
          <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
        </el-tooltip>
      </div>
    </div>
    <div>
      <div class="title grid-c-1-18-5 mb-2">
        <span>Y轴/度量</span>
      </div>
      <div v-for="(item, index) in props.dataMapping.yAxis" :key="index" class="grid-c-2-0-5 mb-2">
        <el-tooltip content="名称" trigger="click">
          <el-input v-model="item.name" class="flex-1" placeholder="请输入名称"></el-input>
        </el-tooltip>
        <el-tooltip content="字段" trigger="click">
          <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
        </el-tooltip>
      </div>
    </div>
    <div>
      <div class="title grid-c-1-18-5 mb-2">
        <span>类别/维度</span>
      </div>
      <div v-for="(item, index) in props.dataMapping.classAxis" :key="index" class="flex w-100% mb-2 grid-c-1-0-5">
        <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
      </div>
    </div>
    <div>
      <div class="title grid-c-1-18-5 mb-2">
        <span>颜色/维度或度量</span>
      </div>
      <div v-for="(item, index) in props.dataMapping.colorAxis" :key="index" class="flex w-100% mb-2 grid-c-1-0-5">
        <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
      </div>
    </div>
    <div>
      <div class="title grid-c-1-18-5 mb-2">
        <span>尺寸/度量</span>
      </div>
      <div v-for="(item, index) in props.dataMapping.classAxis" :key="index" class="flex w-100% mb-2 grid-c-1-0-5">
        <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { DataMappingType } from '@/packages/index.d'

const props = defineProps<{
  dataMapping: DataMappingType
}>()


function addValueAxis() {
  props.dataMapping.valueAxis.push({
    column: "data" + (props.dataMapping.valueAxis.length + 1),
    name: "数据" + (props.dataMapping.valueAxis.length + 1)
  })
}

function addClassAxis() {
  if (props.dataMapping.classAxis.length >= 1) return window["$message"].warning("类别轴/维度只允许添加一个字段");
  props.dataMapping.classAxis.push({
    column: "product"
  })
}


function addColorAxis() {
  if (props.dataMapping.valueAxis.length > 1) return window["$message"].warning("值轴/度量添加了多个字段，颜色图例不予许添加")
  if (props.dataMapping.colorAxis.length >= 1) return window["$message"].warning("颜色图例/维度只允许添加一个字段");
  props.dataMapping.colorAxis.push({
    column: "colorAxis",
    typeList: []
  })
}
const dialogShow = ref(false)
function openDialog() {
  console.log("openDialog");
  dialogShow.value = true
}
</script>

<style scoped>
.noDate {
  border-radius: var(--el-border-radius-base);
  background-color: var(--dark-color-1);
  color: rgb(124 124 124);
  text-align: center;
  padding: 10px 5px;
  font-size: 10px;
}
</style>