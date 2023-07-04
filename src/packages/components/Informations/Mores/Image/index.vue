<template>
  <div :style="getStyle(borderRadius)">
    <el-image
      :fit="fit"
      :src="option.dataset"
      :style="{
        width:w + 'px',
        height:h + 'px'
      }"
    ></el-image>
  </div>
</template>

<script setup lang="ts">
import { PropType, shallowReactive, watch, toRefs } from 'vue'
import { useChartDataFetch } from '@/hooks'
import { CreateComponentType } from '@/packages/index.d'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { ChartEditStorageType } from '@/views/preview'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const rootConfig: ChartEditStorageType = inject("rootConfig")

const { w, h } = toRefs(props.chartConfig.attr)
const { dataset, fit, borderRadius } = toRefs(props.chartConfig.option)

const option = shallowReactive({
  dataset: ''
})

const getStyle = (radius: number) => {
  return {
    borderRadius: `${radius}px`,
    overflow: 'hidden'
  }
}

// 编辑更新
watch(
  () => props.chartConfig.option.dataset,
  (newData: any) => {
    option.dataset = newData
  },
  {
    immediate: true,
    deep: false
  }
)

// 预览更新
useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (newData: any) => {
  option.dataset = newData
})
</script>
