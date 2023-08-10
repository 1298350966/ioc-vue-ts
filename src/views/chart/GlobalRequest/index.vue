<template>
  <content-box class="kh-GlobalVar" title="公共请求">
    <template #top-right>
      <el-button link icon="Plus" @click="createPond"></el-button>
      <!-- <el-button link icon="DeleteFilled"></el-button> -->
    </template>
    <el-empty
      v-if="requestDataPond.length === 0"
      class="empty-box"
      :image-size="100"
      description="暂无数据"
    />
    <template v-else>
      <div v-for="(item, index) in requestDataPond" :key="index">
      <div class="item-content">
            <div class="item-content-body"  @click="editPond(item)">
              <div>
                <el-tag class="go-mr-1" type="warning">
                  名称
                </el-tag>
                <span style="max-width: 180px">
                  {{ item.dataPondName || '暂无' }}
                </span>
              </div>
              <div>
                <el-tag class="go-mr-1" type="warning">
                  地址
                </el-tag>
                <span style="max-width: 180px">
                  {{ item.dataPondRequestConfig.requestUrl || '暂无' }}
                </span>
              </div>
            </div>
            <div class="item-content-icon" @click="deletePond(item)">
              <el-icon size="16px">
                <Trash></Trash>
              </el-icon>
            </div>
          </div>
    </div>
    </template>
 

      <!-- 请求配置model -->
  <pond-data-request
    v-if="requestShow"
    v-model:modelShow="requestShow"
    :targetDataRequest="editData"
    :isEdit="isEdit"
    @editSaveHandle="saveHandle"
  ></pond-data-request>
  </content-box>
</template>

<script setup lang="ts">
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";
import { ContentBox } from "../ContentBox/index";
import { PondDataRequest } from "../ContentConfigurations/components/ChartData/components/ChartDataRequest";
import { RequestDataPondItemType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { getUUID, goDialog } from "@/utils";
import { cloneDeep } from "lodash";
import { requestConfig } from '@/packages/public/publicConfig'
import { useTargetData } from "../ContentConfigurations/components/hooks/useTargetData.hook";
import { RequestDataTypeEnum } from "@/enums/httpEnum";
import {Trash} from '@vicons/ionicons5'
const { getRequestGlobalConfig } = useChartEditStore();
const { chartEditStore, targetData } = useTargetData()
const {requestDataPond} = toRefs(getRequestGlobalConfig)
const requestShow = ref(false)
const isEdit = ref(false)
const editData = ref<RequestDataPondItemType>()
// 打开/编辑
const openPond = (isEditFlag: boolean = false) => {
  isEdit.value = !!isEditFlag
  requestShow.value = true
}
// 创建
const createPond = () => {
  const id = getUUID()
  editData.value = {
    dataPondId: id,
    dataPondName: id,
    dataPondRequestConfig: cloneDeep({ ...requestConfig, requestDataType: RequestDataTypeEnum.Pond })
  }
  openPond()
}
// 編輯
const editPond = (item) => {
  editData.value = item
  openPond(true)
}
const deletePond = (targetData: RequestDataPondItemType) => {
  goDialog({
    message: '删除数据后，需手动处理使用改接口的组件，是否继续？',
    isMaskClosable: true,
    transformOrigin: 'center',
    onPositiveCallback: () => {
      const targetIndex = requestDataPond.value.findIndex(item => item.dataPondId === targetData.dataPondId)
      if (targetIndex !== -1) {
        requestDataPond.value.splice(targetIndex, 1)
        window.$message.success('删除成功!')
      } else {
        window.$message.error('删除失败，请稍后重试！')
      }
    }
  })
}
// 完成创建/编辑
const saveHandle = (newData: RequestDataPondItemType) => {
  // 走创建
  if (isEdit.value) {
    editSaveHandle(newData)
  } else {
    createSaveHandle(newData)
  }
  isEdit.value = false
  requestShow.value = false
}


// 创建保存成功之后
const createSaveHandle = (newData: RequestDataPondItemType) => {
  try {
    if (editData.value) {
      requestDataPond.value.unshift(newData)
      window.$message.success('创建成功!')
    } else {
      window.$message.error('创建失败，请稍后重试!')
    }
  } catch (error) {
    window.$message.error('创建失败，请稍后重试!')
  }
}

// 编辑保存之后
const editSaveHandle = (newData: RequestDataPondItemType) => {
  try {
    const targetIndex = requestDataPond.value.findIndex(item => item.dataPondId === newData.dataPondId)
    if (targetIndex !== -1) {
      requestDataPond.value.splice(targetIndex, 1, newData)
      // 修改数据池后, 修改所有关联的组件
      chartEditStore.getComponentList.forEach(item => {
        if (
          item.request.requestDataType === RequestDataTypeEnum.Pond &&
          item.request.requestDataPondId === newData.dataPondId
        ) {
          item.request = {
            ...toRaw(newData.dataPondRequestConfig),
            requestDataPondId: newData.dataPondId
          }
        }
      })
      window.$message.success('保存成功！')
    } else {
      window.$message.error('编辑失败，请稍后重试！')
    }
  } catch (error) {
    window.$message.error('编辑失败，请稍后重试！')
  }
}
</script>

<style lang="scss" scoped>
      .item-content {
        z-index: 1;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 5px;
        background-color: var(--bg-color-3);
        margin: 10px;
        border-radius: 5px;
        transition: all 0.5s linear;
        .item-content-body {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 5px;
          cursor: pointer;
        }
        .item-content-icon {
          opacity:0;
          height:20px;
          line-height: 20px;
          padding-left: 10px;
          top: 0;
          transition: all 0.3s ease-in-out;
          cursor: pointer;
        }
        &:hover{
          background-color: var(--bg-color-3);
          .item-content-icon {
            opacity:1;
            
          }
        }
      }

</style>
