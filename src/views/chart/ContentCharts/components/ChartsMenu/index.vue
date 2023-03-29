<template>
  <div class="ChartsMenu">
    <div class="ChartsMenuItem" @click="setActive(option,index)" :class="{active:active === index }" v-for="(option, index) in options" :key="index">
      <span>{{ option.label }}</span>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
const emit = defineEmits(['menuItemClick'])
const props = defineProps({
  options:{
    type:Array as any,
    default: () => [],
  }
})
let active = ref(0) 

function setActive(option: { key: any; },index:number){
  active.value = index
  emit("menuItemClick",option.key,option)
}
</script>

<style lang="scss" scoped>
.ChartsMenu{
  line-height: 28px;
  .ChartsMenuItem{
    display: flex;
    flex-direction: column;
    padding: 5px 10px ;
    font-size: 14px;
    position: relative;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    &::before{
      z-index: auto;
      content: "";
      background-color: #0000;
      position: absolute;
      left: 4px;
      right: 4px;
      top: 2px;
      bottom: 2px;
      pointer-events: none;
      border-radius: 5px;

      transition: background-color .3s ease-in-out;
    }
  }
  
.active{
  color: #f6dead;
  &::before{
    background: rgba(246, 222, 173, 0.15);
  }
}
}


</style>