<template>
  <DragDialog title="图标选择" v-model="dialogShow">
    <div class="dragDialog-body">
      <el-tabs v-model="tabsActiveName" class="demo-tabs">
      <el-tab-pane :label="ImgsClassNameEnum[key] || key" :name="key" v-for="(imgList, key) in imgsClass" :key="key">
        <div class="iconSelectBox grid grid-items-center grid-gap-15px">
      <div class="img-box " :class="{select:item.src == selectSrc}" v-for="(item,index) in imgList" :key="index" @click="select(item)">
        <el-image fit="contain" class="icon" :src="item.src"></el-image>
        <span>{{ item.name }}</span>
      </div>
    </div> 
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

import imgsClass, { ImgsClassNameEnum } from "./config"
defineOptions({
  name:"imgSelect"
})
const props = defineProps<{
  modelValue:string,
  show:boolean
}>()
const emit =defineEmits(["update:show","update:modelValue"])
const tabsActiveName = ref(Object.keys(imgsClass)[0])

const selectSrc = ref(props.modelValue || "")
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
 emit("update:modelValue",selectSrc.value)
 dialogShow.value = false
}

function select(item){
  selectSrc.value = item.src
}
</script>

<style lang="scss" scoped>
.dragDialog-body{
  height: 700px;
  padding: 0 20px;
  overflow: scroll;
}
.iconSelectBox{
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(100px,1fr) );
}
.img-box{
  background:  var(--bg-color-3);
  border-radius: 5px;
  display: flex;
  flex-flow: column;
  align-items: center;
  padding: 15px;
  position: relative;
  transition: all .9s linear;
 span{
  width: 100%;
  text-align: center;
  text-overflow: ellipsis;
  overflow: hidden;
  white-space: nowrap;
  margin-top: 10px;
  font-size: 12px;
 }
 &:hover{
  .icon{
    transform: scale(2);
  }
 }
}
.select{
  background: #0080ff2f;;
  border: 1px solid var(--el-color-primary);
 }
.icon{
  width: 50px;
  height: 50px;
 }
</style>