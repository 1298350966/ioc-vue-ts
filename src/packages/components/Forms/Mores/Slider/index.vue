<template>
  <el-slider 
      v-model="chartConfig.option.modelValue"  
      v-bind="chartConfig.option.attrs" 
      v-on="getEvents"
      :style="getStyle"/>
</template>

<script setup lang="ts">
import { ref, nextTick, computed, watch, PropType } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { Events, option as configOption } from './config'
import { setCodeEvents, setConfigEvents, useEvent } from '@/hooks'
import { useAddEvent } from '@/packages/hooks/useAddEvent.kooks'
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events)

const getStyle = computed(()=>{
  let { mainBgColor,runwayBgColor } = props.chartConfig.option.style;
  return {
    '--el-slider-main-bg-color':mainBgColor,
    '--el-slider-runway-bg-color':runwayBgColor,
  }
})


</script>
<style lang="scss" scoped>
</style>