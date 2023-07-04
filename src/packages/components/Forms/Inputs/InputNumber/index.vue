<template>
    <el-input-number 
        v-model="chartConfig.option.modelValue"  
        v-bind="chartConfig.option.attrs"
        v-on="getEvents"
        :style="getStyle"
         />
</template>

<script setup lang="ts">
import mitt from 'mitt'
import { ref, nextTick, computed, watch, PropType } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { EventParamsName, Events, option as configOption } from './config'
import { useEvent } from '@/hooks/useEvent.hook'
import { setConfigEvents,setCodeEvents } from '@/hooks/useLifeHandler.hook'
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
    '--el-border-color':borderColor,
    '--el-color-primary':focusBorderColr,
    '--el-text-color-regular':textColor,
    '--el-fill-color-blank':bgColor,
    // '--el-input-border-color':borderColor,
    // '--el-input-focus-border':focusBorderColr,
    // '--el-input-text-color':textColor,
    // '--el-input-bg-color':bgColor,
  }
})

</script>
<style lang="scss" scoped>
</style>