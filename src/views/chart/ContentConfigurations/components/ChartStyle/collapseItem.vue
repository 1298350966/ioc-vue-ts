<template>
  <div class="collapseItem"  >
    <div class="title" @click="setCollapseShow">
      <el-icon class="icon" :class="{'rotate-90':collapseShow}" size="14px">
        <CaretRight/>
      </el-icon>
      <span>{{ name }}</span>
      <div>
        <slot name="title-right"></slot>
      </div>
  
    </div>
    <div>
      <el-collapse-transition>
      <div v-show="collapseShow" class="collapse-content" >
        <slot></slot>       
      </div>
    </el-collapse-transition>
    <el-divider/>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{
  show?:boolean,
  name:string
}>(),{
  show:false,
  name:""
})

const collapseShow = ref(props.show)

function setCollapseShow(){
  collapseShow.value = !collapseShow.value
}
watch(()=>props.show,(val)=>{
  collapseShow.value = val
})
</script>

<style lang="scss" scoped>
 .collapseItem{
   
  .title{
    display: grid;
    grid-template-columns: 15px  60px  1fr;
    height: 40px;
    position: relative;
    cursor: pointer;
    align-items: center;
    color: var(--font-color);
  }
  .collapse-content{
    padding: 10px;
    background-color: rgba(216, 216, 216, 0.08);
    border-radius: 5px;
    display: grid;
    grid-template-columns:1fr;
    gap:10px;
    align-items: center;
    margin-bottom: 8px;
  }
  .rotate-90{
    transform: rotate(90deg);
  } 
  .el-divider--horizontal{
    margin: 0;
  }

 }

</style>