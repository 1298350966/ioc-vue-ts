<template>
  <div>
    <div>
      <div class="title grid-c-1-18-5 mb-2 ">
        <span>值轴/度量</span>
        <el-tooltip content="添加字段映射">
          <el-icon size="16" class="cursor-pointer " @click="addValueAxis">
            <Plus />
          </el-icon>
        </el-tooltip>
      </div>

      <div v-for="(item, index) in props.dataMapping.valueAxis" :key="index" class="grid-c-2-20-5 mb-2">
        <el-tooltip content="名称" trigger="click">
          <el-input v-model="item.name" class="flex-1" placeholder="请输入名称"></el-input>
        </el-tooltip>
        <el-tooltip content="字段" trigger="click">
          <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
        </el-tooltip>
        <el-icon class="c-red cursor-pointer" size="18" @click="props.dataMapping.valueAxis.splice(index, 1)">
          <RemoveFilled />
        </el-icon>
      </div>
      <div v-if="props.dataMapping.valueAxis.length == 0" class="noDate mb-2">
        点击加号添加字段
      </div>
    </div>
    <div>
      <div class="title grid-c-1-18-5 mb-2">
        <span>类别轴/维度</span>
        <el-tooltip content="添加字段映射">
          <el-icon size="16" class="cursor-pointer" @click="addClassAxis">
            <Plus />
          </el-icon>
        </el-tooltip>
      </div>
      <div v-for="(item, index) in props.dataMapping.classAxis" :key="index" class="flex w-100% mb-2 grid-c-1-20-5">
        <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
        <el-icon class="c-red cursor-pointer" size="18" @click="props.dataMapping.classAxis.splice(index, 1)">
          <RemoveFilled />
        </el-icon>
      </div>
      <div v-if="props.dataMapping.classAxis.length == 0" class="noDate mb-2">
        点击加号添加字段
      </div>
    </div>
    <div>
      <div class="title grid-c-1-39-5 mb-2">
        <span>颜色图例/维度
        </span>
        <div>
          <el-tooltip content="添加默认枚举类型">
            <el-icon size="16" class="mr-5px cursor-pointer" @click="openDialog">
              <Setting />
            </el-icon>
          </el-tooltip>
          <el-tooltip content="添加字段映射">
            <el-icon size="16" class="cursor-pointer" @click="addColorAxis">
              <Plus />
            </el-icon>
          </el-tooltip>
        </div>
      </div>

      <template v-for="(item, index) in props.dataMapping.colorAxis" :key="index">
        <div class="flex w-100% mb-2 grid-c-1-20-5">
          <el-input v-model="item.column" class="flex-1" placeholder="请输入字段"></el-input>
          <el-icon class="c-red cursor-pointer" size="18" @click="props.dataMapping.colorAxis.splice(index, 1)">
            <RemoveFilled />
          </el-icon>
        </div>

      </template>
      <div v-if="props.dataMapping.colorAxis.length == 0" class="noDate mb-2">
        点击加号添加字段
      </div>
      <dragDialog title="枚举类型配置" v-model="dialogShow" width="50%" top="10vh">
        <div class="p-5">
          <el-table border striped :data="props.dataMapping.typeList" height="600px">
            <el-table-column prop="name" label="枚举类型名称">
              <template #default="{ row }">
                <el-input v-model="row.name"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="result" label="操作" width="60px">
              <template #default="{ $index }">
                <el-button type="danger" link @click="props.dataMapping.typeList.splice($index, 1)">删除</el-button>
              </template>
            </el-table-column>
          </el-table>

        </div>
        <template #footer>
          <div class="m-1">
            <el-button style="width: 100%" @click="props.dataMapping.typeList.push({ name: '' })">添加一行</el-button>
          </div>
        </template>
      </dragDialog>
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
  background-color: var(--bg-color-2);
  color: rgb(124 124 124);
  text-align: center;
  padding: 10px 5px;
  font-size: 10px;
}
</style>