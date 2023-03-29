<template>
  <div class="kh-text-box">
    <div class="text" :style="textStyle">
      {{ option.dataset }}
    </div>
  </div>
</template>
<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch, computed } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch } from '@/hooks'
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore'
import { option as configOption } from './config'

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const option = shallowReactive({
  dataset: configOption.dataset
})

const { w, h } = toRefs(props.chartConfig.attr)
const { size, gradient } = toRefs(props.chartConfig.option)

const textStyle = computed(()=>{
  return {
    backgroundImage:`linear-gradient(${gradient.value.deg}deg, ${gradient.value.from}  0%, ${gradient.value.to} 100%)`,
    fontSize: size.value + "px",
  } 
})
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

useChartDataFetch(props.chartConfig, useChartEditStore, (newData: any) => {
  option.dataset = newData
})
</script>

<style lang="scss" scoped>
.kh-text-box {
  display: flex;
  align-items: center;
  justify-content: center;
  .text{
    background-clip: text;
    -webkit-background-clip: text;
    display: inline-block;
    color: transparent;
  }
}
</style>
