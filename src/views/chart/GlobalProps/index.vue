<template>
    <content-box 
    class="kh-GlobalProps" 
    title="组件传参定义">
    <template #top-right>
      <el-button link icon="Plus" @click="createProps"></el-button>
      <el-button link icon="DeleteFilled" @click="clearGlobalProps"></el-button>
    </template>
    <el-empty v-if="getGlobalProps.length === 0" class="empty-box" :image-size="100" description="暂无变量" />
    <div class="list">
      <div class="list-item" v-for="(item, index) in getGlobalProps" :key="index" @click="updateProps(item)">
        <el-icon color="#0093ff" size="16px">
          <ValueVariable/>  
        </el-icon>

        <span>{{  item.field + "(" + item.type + ")" }}</span>
        <el-icon size="16px">
          <Trash></Trash>
        </el-icon>
      </div>
 
    </div>
    <propsConfig v-if="propsConfigShow" v-model="propsConfigShow" :data="globalPropsConfig" @save="saveGlobalProps"></propsConfig>
  </content-box>
</template>

<script setup lang="ts">
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { ContentBox } from '../ContentBox/index'
import { getUUID } from '@/utils';
import { GlobalPropsType } from '@/store/modules/chartEditStore/chartEditStore.d';
import { ValueVariable } from '@vicons/carbon';
import { Trash } from '@vicons/ionicons5';
import { FiltersEnum } from '@/components/Pages/FilterConfig/type';

const propsConfig = defineAsyncComponent(()=>import("./propsConfig.vue"))
const chartEditStore = useChartEditStore()
const {getGlobalProps,saveGlobalProps,removeGlobalProps,clearGlobalProps} = useChartEditStore()
console.log(`output->`,chartEditStore.globalProps)
const globalPropsConfig = ref<GlobalPropsType>(null)
const propsConfigShow = ref(false) 

function createProps(){
  globalPropsConfig.value = {
    field:"",
    type:"string",
    default:null,
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
.kh-GlobalProps{
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