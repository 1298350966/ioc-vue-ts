<template>
    <el-checkbox-group  v-model="chartConfig.option.modelValue" v-bind="chartConfig.option.attrs" v-on="getEvents" :style="getStyle">
      <template v-for="(item,index) in chartConfig.option.listOptions" :key="index">
        <el-checkbox :label="item.value" >{{ item.label }}</el-checkbox>
      </template>
    </el-checkbox-group>
</template>

<script lang="ts" setup>
import { ref, nextTick,reactive, computed, watch, PropType } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { Events, option as configOption } from './config'
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
    'display':'flex',
    'align-items':'center',
    'justify-content':'space-between'
  }
})


</script>

<style lang="scss" scoped>
</style>