<template>
  <div>
    <SettingItem name="窗体对象" class="">
      <el-select-v2 v-model="InfoWindowListUpdateValue.targetId" :options="InfoWindowListOptions" ></el-select-v2>
    </SettingItem>
    <div class="grid grid-cols-2 grid-gap-10px grid-items-center">
      <SettingItem name="是否显示">
        <el-switch v-model="InfoWindowListUpdateValue.updateValue['visible']"></el-switch>
      </SettingItem>
    </div>
    <SettingItem name="组件传参">
      <el-table class="w-100%" :data="InfoWindowListUpdateValue.updateValue['content.attrs']" border>
          <el-table-column prop="key" label="目标参数">
              <template #default="{ row }">
                <el-select-v2 class="w-100%" v-model="row.key" :options="attrsOptions" clearable allow-create
                  filterable></el-select-v2>
              </template>
          </el-table-column>
          <el-table-column prop="value" label="映射字段">
            <template #default="{ row }">
              <el-select-v2 class="w-100%" v-model="row.value" :options="mappingFieldOptions" clearable allow-create
                filterable></el-select-v2>
            </template>
          </el-table-column>
          <el-table-column width="60" label="操作">
             <template #default="{ row,$index }">
               <el-button type="danger" link @click="InfoWindowListUpdateValue.updateValue['content.attrs'].splice($index,1)">删除</el-button> 
            </template>
          </el-table-column>
        </el-table>
        <el-button class="w-100% mt-2" @click="addUpdateValueContentAttrs"> 添加参数设置</el-button>
    </SettingItem>
  </div>
</template>

<script setup lang="ts">
import {InfoWindowOptions} from "@/packages/components/Charts/Maps/MapAmap/config"
import { MapComponentListUpdate } from "../../../config";

const props = defineProps<{
  InfoWindowList:typeof InfoWindowOptions[],
  InfoWindowListUpdateValue:typeof MapComponentListUpdate["option.InfoWindowList"],
  mappingFieldOptions:any[]
}>()


const InfoWindowListOptions = computed(()=>{
  return props.InfoWindowList.map((InfoWindow) => ({
    label: InfoWindow.name + "(" + InfoWindow.id + ")",
    value: InfoWindow.id 
  }))
})
const InfoWindowConfig = computed(()=>{
  return props.InfoWindowList.find((InfoWindow)=> props.InfoWindowListUpdateValue.targetId == InfoWindow.id)
})
const attrsOptions = computed(()=>{
  if(InfoWindowConfig.value){
    return Object.keys(InfoWindowConfig.value.content.attrs).map((key)=>({
      label:key,
      value:key
    }))
  }else{
    return []
  }
})
function addUpdateValueContentAttrs(){
  props.InfoWindowListUpdateValue.updateValue['content.attrs'].push({
    key:"",
    value:""
  })
}

onBeforeUnmount(() => {
  props.InfoWindowListUpdateValue.updateValue['content.attrs'] = props.InfoWindowListUpdateValue.updateValue['content.attrs'].filter((e)=> !!e.key)
})
</script>

<style scoped>

</style>