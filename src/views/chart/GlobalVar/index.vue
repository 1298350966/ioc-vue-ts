<template>
    <content-box 
    class="kh-GlobalVar" 
    title="全局变量">
    <template #top-right>
      <el-button link icon="Plus" @click="createVar"></el-button>
      <el-button link icon="DeleteFilled" @click="clearGlobalVar"></el-button>
    </template>
    <el-empty v-if="getGlobalVar.length === 0" class="empty-box" :image-size="100" description="暂无变量" />
 
    <el-collapse v-else v-model="state.activeNames" v-infinite-scroll="() => {}">
    <template v-for="(item,index) in getGlobalVar" :key="item.key">
      <el-collapse-item :title="item.name" :name="item.key">
        <template #title>
          <div class="kh-flex-between  model-item">
            <span >{{ item.name }}</span>
            <span  class="kh-flex-between model-item-icon" @click.stop>
              <el-icon :size="16" color="#2196f3" @click.stop="updateVar(item,index)">
                <Edit />
              </el-icon>
    
              <el-popconfirm
                title="确定要删除该模型吗？"
                icon-color="red"
                @confirm="removeGlobalVar(item.key)"
              >
                <template #reference>
                  <el-icon :size="16" color="#f44336"><Delete /></el-icon>
                </template>
              </el-popconfirm>
            </span>
          </div>
        </template>
        <template v-for="entity in item.entitys" :key="entity.key">
          <div class="low-model-item">
            <h-code
              :code="JSON.stringify(entity, null, 2)"
              language="json"
            ></h-code>
          </div>
        </template>
      </el-collapse-item>
    </template>
  </el-collapse>  
  <addVar  ref="addVarRefs"></addVar>
  <editVar ref="editVarRefs" v-model:data="getGlobalVar[editDataIndex]"></editVar>
  </content-box>
</template>

<script setup lang="ts">
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { ContentBox } from '../ContentBox/index'
import { getUUID } from '@/utils';
const addVar = defineAsyncComponent(()=>import("./components/addVar.vue"))
const editVar = defineAsyncComponent(()=>import("./components/editVar.vue"))
const {getGlobalVar,addGlobalVar,removeGlobalVar,clearGlobalVar} = toRefs(useChartEditStore())
const addVarRefs = ref()
const editVarRefs = ref()
const editDataIndex = ref()
const createEmptyModel = () => ({
    name: '',
    key: getUUID(),
    entitys: [{ key: '', name: '', type: 'string', value: '' }],
  });

const state = reactive({
  activeNames: [],
  ruleForm: createEmptyModel(),
});

const createVar = ()=>{
  addVarRefs.value.openDialog()
}
const updateVar = (item,index) =>{
  console.log(editVarRefs);
  editDataIndex.value = unref(getGlobalVar).indexOf(item) 
  editVarRefs.value.openDialog()
}
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__content){
  padding-bottom: 0;
}
.kh-GlobalVar{
  // .empty-box{
  //   position: absolute;
  //   top: 50%;
  //   left: 50%;
  //   transform: translate(-50%, -100%);
  // }
  .model-item{
    padding-left:10px;
    width: 100%;
  
    .model-item-icon{
      :deep(.el-icon){
        margin-right: 5px;
      }
    }
  }
}
</style>