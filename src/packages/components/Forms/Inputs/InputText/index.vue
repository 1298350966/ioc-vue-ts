<template>
    <el-input 
      v-model="chartConfig.option.modelValue"  
      v-bind="chartConfig.option.attrs" 
      :style="getStyle"
      v-on="getEvents"
      />
</template>


<script setup lang="ts">
import { ref, nextTick, computed, watch, PropType,defineEmits,getCurrentInstance } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
// import { generateComponentFunc } from '@/hooks'
import { option as configOption,EventNameList, EventParamsName, Events, EventTypeName } from './config'
import { useEvent } from '@/hooks/useEvent.hook'
import { setConfigEvents, setCodeEvents } from '@/hooks/useLifeHandler.hook'
import { useAddEvent } from '@/packages/hooks/useAddEvent.kooks'
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events)

const getStyle = computed(()=>{
  let {borderColor,focusBorderColr,textColor,bgColor} = props.chartConfig.option.style;
  return {
    '--el-input-border-color':borderColor,
    '--el-input-focus-border':focusBorderColr,
    '--el-input-text-color':textColor,
    '--el-input-bg-color':bgColor,
  }
})



</script>

<style lang="scss" scoped>
</style>