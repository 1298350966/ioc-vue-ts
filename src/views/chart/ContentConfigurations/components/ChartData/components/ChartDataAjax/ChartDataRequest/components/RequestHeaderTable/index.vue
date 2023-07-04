<template>
  <el-table style="width: 100%;"  :data="tableArray.content" class="go-request-header-table-box"  border>
    <el-table-column type="index" width="50" />
    <el-table-column prop="key" label="Key">
      <template #default="scope">
        <el-input v-model="scope.row.key" :disabled="editDisabled" type="text"  @blur="blur" />
      </template>
    </el-table-column>
    <el-table-column prop="value" label="Value">
      <template #default="scope">
        <el-input v-model="scope.row.value" :disabled="editDisabled" type="text"  @blur="blur" />
      </template>
    </el-table-column>
    <el-table-column prop="date" label="操作" width="200px">
      <template #default="scope">
        <div >
            <el-button class="go-ml-2" type="primary" :disabled="editDisabled" @click="add(scope.$index)"
              >+</el-button
            >
            <el-button
              class="go-ml-2"
              type="danger"
              :disabled="scope.$index === 0 && editDisabled"
              @click="remove(scope.$index)"
            >
              -
            </el-button>
          </div>
      </template>
    </el-table-column>
    <el-table-column prop="date" label="结果" width="200px">
      <template #default="scope">
        <el-button v-if="scope.row.error" class="go-ml-2" text type="danger"> 格式错误 </el-button>
        <el-button v-else class="go-ml-2" text type="primary"> 格式通过 </el-button>
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { PropType, reactive, ref, toRefs, watch } from 'vue'
import { RequestParamsObjType } from '@/enums/httpEnum'
defineOptions({
  name:"RequestHeaderTable"
})
const emits = defineEmits(['update'])

const props = defineProps({
  target: {
    type: Object as PropType<RequestParamsObjType>,
    required: true,
    default: () => {}
  },
  editDisabled: {
    type: Boolean,
    required: false,
    default: false
  }
})

// 错误标识
const error = ref(false)

// 默认表格
const defaultItem = {
  key: '',
  value: '',
  error: false
}
const tableArray = reactive<{
  content: typeof defaultItem[]
}>({ content: [] })

// 失焦
const blur = () => {
  let successNum = 0
  tableArray.content.forEach(item => {
    if ((item.key !== '' && item.value == '') || (item.key === '' && item.value !== '')) {
      // 错误
      item.error = true
    } else {
      // 正确
      successNum++
      item.error = false
    }
  })
  // 验证是否全部通过
  if (successNum == tableArray.content.length) {
    // 转换数据成对象
    const updateObj: any = {}
    tableArray.content.forEach((e: typeof defaultItem) => {
      if (e.key) updateObj[e.key] = e.value
    })
    emits('update', updateObj)
  }
}

// 新增
const add = (index: number) => {
  tableArray.content.splice(index + 1, 0, {
    key: '',
    value: '',
    error: false
  })
}

// 减少
const remove = (index: number) => {
  if (tableArray.content.length !== 1) {
    tableArray.content.splice(index, 1)
  }
  blur()
}

// 监听选项
watch(
  () => props.target,
  (target: RequestParamsObjType) => {
    tableArray.content = []
    for (const k in target) {
      tableArray.content.push({
        key: k,
        value: target[k],
        error: false
      })
    }
    // 默认值
    if (!tableArray.content.length) tableArray.content = [JSON.parse(JSON.stringify(defaultItem))]
  },
  {
    immediate: true,
    deep: true
  }
)
</script>

<style lang="scss">
@include go('request-header-table-box') {
  background-color: rgba(0, 0, 0, 0);
  @include deep() {
    .n-data-table .n-data-table-td {
      background-color: rgba(0, 0, 0, 0);
    }
    .add-btn-box {
      width: 100%;
      display: flex;
      justify-content: center;
      .add-btn {
        width: 300px;
      }
    }
  }
}
</style>
