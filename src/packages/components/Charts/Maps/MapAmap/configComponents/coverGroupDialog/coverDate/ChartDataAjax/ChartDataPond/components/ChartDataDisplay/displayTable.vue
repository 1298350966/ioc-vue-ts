<template>
  <el-table :data="tableArray.content" border>
    <el-table-column prop="key" label="key">
      <template #default="{row}">
        {{ row.key || '暂无'}}
      </template>
    </el-table-column>
    <el-table-column prop="value" label="value">
      <template #default="{row}">
        {{ row.value || '暂无'}}
      </template>
    </el-table-column>
  </el-table>
</template>

<script setup lang="ts">
import { PropType, reactive, ref, toRefs, watch } from 'vue'
import { RequestParamsObjType } from '@/enums/httpEnum'


const props = defineProps({
  target: Object as PropType<RequestParamsObjType>
})

// 默认表格
const defaultItem = {
  key: '',
  value: ''
}
const tableArray = reactive<{
  content: typeof defaultItem[]
}>({ content: [] })

// 监听选项
watch(
  () => props.target as RequestParamsObjType,
  (target: RequestParamsObjType) => {
    tableArray.content = []
    for (const k in target) {
      tableArray.content.push({
        key: k,
        value: target[k]
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