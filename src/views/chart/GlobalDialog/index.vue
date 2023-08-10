<template>
  <content-box class="kh-GlobalDialog" title="公共弹窗">
    <template #top-right>
      <el-button link icon="Plus" @click="addData"></el-button>
      <el-button link icon="DeleteFilled"  @click="clearGlobalDialog"></el-button>
    </template>
    <el-empty
      v-if="getGlobalDialog.length === 0"
      class="empty-box"
      :image-size="100"
      description="暂无数据"
    />

    <el-collapse v-else>
      <template v-for="(item, index) in getGlobalDialog" :key="item.key">
        <el-collapse-item :title="item.name" :name="item.key">
          <template #title>
            <div class="kh-flex-between model-item">
              <span>{{ item.attrs.title }}</span>
              <span class="kh-flex-between model-item-icon" @click.stop>
                <el-icon
                  :size="16"
                  color="#2196f3"
                  @click.stop="editData(item)"
                >
                  <Edit />
                </el-icon>

                <el-popconfirm
                  title="确定要删除该模型吗？"
                  icon-color="red"
                  @confirm="removeGlobalDialog(item.id)"
                >
                  <template #reference>
                    <el-icon :size="16" color="#f44336"><Delete /></el-icon>
                  </template>
                </el-popconfirm>
              </span>
            </div>
          </template>
          <div class="low-model-item">
            <h-code
              :code="JSON.stringify(item, null, 2)"
              language="json"
            ></h-code>
          </div>
        </el-collapse-item>
      </template>
    </el-collapse>
    <addAndEditGlobalDialog ref="addAndEditGlobalDialogRef" v-if="addAndEditGlobalDialogShow" v-model="addAndEditGlobalDialogShow" :data="GlobalDialogData" @save="save"></addAndEditGlobalDialog>

  </content-box>
</template>

<script setup lang="ts">
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { ContentBox } from "../ContentBox/index";
import addAndEditGlobalDialog from "./components/addAndEditGlobalDialog.vue"
const {getGlobalDialog,addGlobalDialog,removeGlobalDialog,clearGlobalDialog } = useChartEditStore();
const addAndEditGlobalDialogRef = ref()
const GlobalDialogData = ref(null)
function save(data){
  if(GlobalDialogData.value){
    let index = getGlobalDialog.indexOf(GlobalDialogData.value)
    getGlobalDialog[index] = data  
  }else{
    addGlobalDialog(data)
  }
}
const addAndEditGlobalDialogShow = ref(false)
function addData(){
  GlobalDialogData.value = null
  addAndEditGlobalDialogShow.value = true
  // addAndEditGlobalDialogRef.value.open()
}
function editData(data){
  GlobalDialogData.value = data
  addAndEditGlobalDialogShow.value = true
  // addAndEditGlobalDialogRef.value.open()
}
</script>

<style lang="scss" scoped>
:deep(.el-collapse-item__content){
  padding-bottom: 0;
}
.kh-GlobalDialog{
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
