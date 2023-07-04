<template>
  <div>
    <div>
      <div class="title grid-c-1-18-5 mb-2 ">
        <span>扇区角度/度量</span>
        <!-- <el-tooltip content="添加字段映射">
          <el-icon size="16" class="cursor-pointer " @click="addValueAxis">
            <Plus />
          </el-icon>
        </el-tooltip> -->
      </div>

      <div v-for="(item, index) in props.dataMapping.valueAxis" :key="index" class="grid-c-2-0-5 mb-2">
        <el-tooltip content="名称" trigger="click">
          <el-input v-model="item.name" class="flex-1" placeholder="请输入名称"></el-input>
        </el-tooltip>
        <el-tooltip content="字段" trigger="click">
          <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
        </el-tooltip>
        <!-- <el-icon class="c-red cursor-pointer" size="18" @click="props.dataMapping.valueAxis.splice(index, 1)">
          <RemoveFilled />
        </el-icon> -->
      </div>
      <!-- <div v-if="props.dataMapping.valueAxis.length == 0" class="noDate mb-2">
        点击加号添加字段
      </div> -->
    </div>
    <div>
      <div class="title grid-c-1-18-5 mb-2">
        <span>扇区标签/维度</span>
        <!-- <el-tooltip content="添加字段映射">
          <el-icon size="16" class="cursor-pointer" @click="addClassAxis">
            <Plus />
          </el-icon>
        </el-tooltip> -->
      </div>
      <div v-for="(item, index) in props.dataMapping.classAxis" :key="index" class="flex w-100% mb-2 grid-c-1-0-5">
        <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
        <!-- <el-icon class="c-red cursor-pointer" size="18" @click="props.dataMapping.classAxis.splice(index, 1)">
          <RemoveFilled />
        </el-icon> -->
      </div>
      <!-- <div v-if="props.dataMapping.classAxis.length == 0" class="noDate mb-2">
        点击加号添加字段
      </div> -->
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