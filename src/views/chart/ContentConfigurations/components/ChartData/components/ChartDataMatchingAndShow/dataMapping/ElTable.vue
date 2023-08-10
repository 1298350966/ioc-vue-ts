<template>
  <el-table size="small" border striped row-key="id" :data="tableData" default-expand-all targetData>
    <el-table-column prop="label" label="名称" align="center">
      <template #default="{ row }">
          <span v-if="row.id">{{ row.label }}</span>
          <el-input v-else size="small" v-model="row.label"></el-input>
      </template>
    </el-table-column>
    <el-table-column prop="prop" label="字段" align="center">
      <template #default="{ row }">
        <div>
          <el-input size="small" v-model="row.prop"></el-input>
        </div>

      </template>
    </el-table-column>
    <el-table-column label="操作" width="60" align="center">
      <template #default="{ row,$index }">
        <span v-if="row.id">无</span>
        <div calss="kh-flex-center" v-else>
          <el-button type="primary" link>
            <el-icon @click.stop="handleCopy" size="14">
              <Plus />
            </el-icon>
          </el-button>

          <el-button type="danger" link style="margin-left:0px">
            <el-icon @click.stop="handleDelete(row)" size="14">
              <Minus />
            </el-icon>
          </el-button>
        </div>


      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { columnItem } from '@/packages/components/Forms/Tables/Table/config'
import { cloneDeep } from 'lodash'

const props = defineProps({
  targetData: {
    type: Object as any,
    required: true
  }
})
const tableData = computed(() => {
  
  const { columns } = props.targetData.option
  let children = columns.map((c) => {
    return c.attrs
  })
  return Object.keys(props.targetData.tableDateMapping).map((key) => {
    let obj: any = { id: key }
    console.log(`output->props.targetData.tableDateMapping[key]`,props.targetData.tableDateMapping[key])
    Object.keys(props.targetData.tableDateMapping[key]).forEach((p) => {
      Object.defineProperty(obj, p, {
        get() {
          return  props.targetData.tableDateMapping[key][p]
        },
        set(val) {
          props.targetData.tableDateMapping[key][p] = val
        }
      })
    })
    if (key == "datas") {
      obj.children = children
    }     
    return  obj
  })
})

//增加列
function handleCopy() {
  let colsLength = props.targetData.option.columns.length;
  let newItemObj = cloneDeep(columnItem)
  newItemObj.attrs.label = "字段" + colsLength
  newItemObj.attrs.prop = "field" + colsLength
  props.targetData.option.columns.push(newItemObj)
}
// 删除列
function handleDelete(row) {
  if (props.targetData.option.columns.length <= 1) return
  let index = props.targetData.option.columns.indexOf(row)
  props.targetData.option.columns.splice(index, 1);
}
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
</style>