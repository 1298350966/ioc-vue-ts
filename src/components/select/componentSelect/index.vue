<template>
  <DragDialog title="组件选择" v-model="dialogShow">
    <div class="dragDialog-body">
      <el-tabs v-model="tabsActiveName" class="demo-tabs">
      <el-tab-pane label="自定义组件" name="1">
        <customComponent :customComponentsConfig="customComponentsConfig" @select="select"></customComponent>
      </el-tab-pane>
      <el-tab-pane label="配置组件" name="2">
        <configComponent @select="select"></configComponent>
      </el-tab-pane>
    </el-tabs>
  </div>
    <template #footer>
        <el-button @click="closeHandle">取消</el-button>
        <el-button type="primary" @click="saveHandle">保存</el-button>
    </template>
  </DragDialog>

</template>

<script lang="ts" setup>
import {customComponentsConfig} from "@/customComponents/index"
// defineOptions({
//   name:"imgSelect"
// })
const props = defineProps<{
  show:boolean
  modelValue?:any
}>()
const emit =defineEmits(["update:show","update:modelValue","select"])
const tabsActiveName = ref("1")
const selectComponent = ref(null)

const dialogShow = computed({
 get(){
    return props.show
 },
 set(val){
  emit("update:show",val)
 }
})

function closeHandle(){
  dialogShow.value = false
}

function saveHandle(){
 if(!selectComponent.value) return
 emit("select",selectComponent.value)
 dialogShow.value = false
}

function select(item){
  selectComponent.value = item
}
</script>

<style lang="scss" scoped>
.dragDialog-body{
  height: 700px;
  padding: 0 20px;
}

</style>