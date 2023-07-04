<template>
  <div>
    <SettingItem name="覆盖物组对象">
      <el-select-v2 v-model="coverGroupListUpdateValue.targetId" :options="coverGroupListOptions" ></el-select-v2>
    </SettingItem>
    <div v-if="coverGroupListUpdateValue.targetId" class="grid grid-cols-2 grid-gap-10px grid-items-center">
      <SettingItem name="是否显示">
        <el-select-v2 v-model="coverGroupListUpdateValue.updateValue['visible']" :options="visibleOptions" clearable allow-create
            filterable></el-select-v2>
      </SettingItem>
    </div>
  </div>
</template>

<script setup lang="ts">
import { MapComponentListUpdate } from '../../../config';
import { CoverGroupType } from "@/packages/index.d";

const props = defineProps<{
  coverGroupList:CoverGroupType[],
  coverGroupListUpdateValue:typeof MapComponentListUpdate["option.coverGroupList"]
  mappingFieldOptions:{
    label:string,
    type:string
    value:string
  }[]
}>()
const emit = defineEmits(["update:coverGroupListUpdateValue"])

const coverGroupListOptions = computed(()=>{
  return props.coverGroupList.map((InfoWindow) => ({
    label: InfoWindow.name + "(" + InfoWindow.id + ")",
    value: InfoWindow.id 
  }))
})



const visibleOptions = computed(()=>{
  let list =[
    {
      label:"显示",
      value:true
    },
    {
      label:"隐藏",
      value:false
    }
  ]
  let list2 = props.mappingFieldOptions.filter((obj)=>obj.type == "boolean")
  return [...list,...list2] 
}) 
</script>

<style scoped>

</style>