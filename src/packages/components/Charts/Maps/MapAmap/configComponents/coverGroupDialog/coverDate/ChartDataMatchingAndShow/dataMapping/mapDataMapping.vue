<template>
  <el-table size="small" border striped :data="tableData" >
    <el-table-column prop="label" label="名称" align="center" width="60">
      <template #default="{ row }">
        {{ row.label  }}
      </template>
    </el-table-column>
    <el-table-column prop="type" label="类型" align="center">
      <template #default="{ row }">
        <template v-if="row.typeOptions">
          <el-select-v2 v-model="row.type" size="small" :options="row.typeOptions"></el-select-v2>
        </template>
        <span v-else>{{ row.type }}</span>
       </template>
    </el-table-column>
    <el-table-column prop="key" label="字段" align="center">
      <template #default="{ row }">
        
        <div class="kh-flex-between" v-if="row.type == 'LngLat'">
          <el-tooltip content="经度">
            <el-input class="mr-1" size="small" v-model="row.lng"></el-input>
          </el-tooltip>
          <el-tooltip content="纬度">
          <el-input size="small" v-model="row.lat"></el-input>
          </el-tooltip>
        </div>
        <div v-else>
          <el-input size="small" v-model="row.key"></el-input>
        </div>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { columnItem } from '@/packages/components/Forms/Tables/Table/config'
import { cloneDeep } from 'lodash'
import { CoverGroupType } from '@/packages/index.d'

const props = defineProps<{
  targetData:CoverGroupType
}>()
const tableData = computed(() => {
  return Object.keys(props.targetData.dataMapping).map((key)=>{
    return props.targetData.dataMapping[key]
  }) 
})

// const typeOptions = [
//   []
// ]
</script>

<style lang="scss" scoped>
.el-table{
    :deep(.el-form-item) {
        margin-bottom: 0;
    }

    .el-form-item__error {
        position: initial;
    }
    :deep(.cell) {
        display: flex;
        align-items: center;
        .el-table__expand-icon{
          margin-right: 5px;
        }
        .el-table__placeholder{
          width: 0;
        }
        span.el-table__indent {
            margin: 0 5px;
        }
    }
}
:deep(.el-select-v2__placeholder){
  margin-inline-start:5px;
}
</style>