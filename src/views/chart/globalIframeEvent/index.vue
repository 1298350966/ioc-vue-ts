<template>
    <content-box 
    class="globalIframeEvent" 
    title="Iframe通讯触发事件定义">
    <template #top-right>
      <el-button link icon="Plus" @click="createProps"></el-button>
      <el-button link icon="DeleteFilled" @click="clearGlobalIframeEvent"></el-button>
    </template>
    <el-empty v-if="getGlobalIframeEvent.length === 0" class="empty-box" :image-size="100" description="暂无变量" />
    <div class="list">
      <div class="list-item" v-for="(item, index) in getGlobalIframeEvent" :key="index" @click="updateProps(item)">
        <el-icon color="#0093ff" size="16px">
          <FunctionMath/>  
        </el-icon>

        <span>{{  item.eventName }}</span>
        <el-icon size="16px">
          <Trash @click.stop="removeGlobalIframeEvent(item.eventName)"></Trash>
        </el-icon>
      </div>
 
    </div>
    <propsConfig v-if="propsConfigShow" v-model="propsConfigShow" :data="globalPropsConfig" @save="saveGlobalIframeEvent"></propsConfig>
  </content-box>
</template>

<script setup lang="ts">
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { ContentBox } from '../ContentBox/index'
import { getUUID } from '@/utils';
import { GlobalIframeEventType } from '@/store/modules/chartEditStore/chartEditStore.d';
import { FunctionMath } from '@vicons/carbon';
import { Trash } from '@vicons/ionicons5';
import { FiltersEnum } from '@/components/Pages/FilterConfig/type';

const propsConfig = defineAsyncComponent(()=>import("./propsConfig.vue"))
const chartEditStore = useChartEditStore()
const {getGlobalIframeEvent,saveGlobalIframeEvent,removeGlobalIframeEvent,clearGlobalIframeEvent} = useChartEditStore()
console.log(`output->`,chartEditStore.globalProps)
const globalPropsConfig = ref<GlobalIframeEventType>(null)
const propsConfigShow = ref(false) 

function createProps(){
  globalPropsConfig.value = {
    eventName:getUUID(),
    eventArgs:[],
    fun:null,
    configFun:{
      type: "",
      targetId:"",
      trigger: [],
      filters: {
        enable:false,
        type:FiltersEnum.AND,
        conditions:[]
      }
    }
  }
  propsConfigShow.value = true
}

function updateProps(data){
  globalPropsConfig.value = data
  propsConfigShow.value = true
}

watch(()=>{
  return 
},(val)=>{

})
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__content){
  padding-bottom: 0;
}
.globalIframeEvent{
   .list{
    .list-item{
       margin: 10px;
       padding: 10px;
       background: var(--bg-color-3);
       border-radius: 5px;
       cursor: pointer;
       display: grid;
       grid-template-columns: 20px 1fr 20px;
       align-items: center;
       grid-gap: 5px;
    }
   }
  
}
</style>