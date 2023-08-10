<template>
  <div>
    <el-tabs  v-model="tabValue">
      <el-tab-pane v-for="item in tabs" :key="item" :name="item" :label="item"> 
        <request-header-table
          v-if="tabValue === RequestParamsTypeEnum.HEADER"
          :editDisabled="editDisabled"
          :target="requestParams[tabValue]"
          @update="updateRequestParams"
      ></request-header-table>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs } from 'vue'
import { useTargetData } from '@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook'
import { RequestHeaderTable } from '../RequestHeaderTable'
import { RequestParamsTypeEnum, RequestParamsObjType } from '@/enums/httpEnum'
defineOptions({
  name:"RequestGlobalHeaderTable"
})
defineProps({
  editDisabled: {
    type: Boolean,
    default: true
  }
})

const { chartEditStore } = useTargetData()
const { requestParams } = toRefs(chartEditStore.getRequestGlobalConfig)

const tabValue = ref<RequestParamsTypeEnum>(RequestParamsTypeEnum.HEADER)
const tabs = [RequestParamsTypeEnum.HEADER]

// 更新表格参数
const updateRequestParams = (paramsObj: RequestParamsObjType) => {
  if (tabValue.value === RequestParamsTypeEnum.HEADER) {
    requestParams.value[tabValue.value] = paramsObj
  }
}
</script>

<style lang="scss" scoped></style>
