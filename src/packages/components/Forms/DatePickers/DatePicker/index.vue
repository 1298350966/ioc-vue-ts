<template>
    <!-- <div class="form-components-container"> -->
        <el-date-picker
            v-model="chartConfig.option.modelValue"
            v-bind="chartConfig.option.attrs"
            :style="getStyle"
            v-on="getEvents"
            />
    <!-- </div> -->
</template>
<script lang="ts" setup>
import { ref, reactive, nextTick, computed, watch, PropType } from 'vue'
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
    '--el-input-border-color':borderColor,
    '--el-input-focus-border':focusBorderColr,
    '--el-input-text-color':textColor,
    '--el-input-bg-color':bgColor,
  }
})
</script>

<style lang="scss" scoped>
.form-components-container{
    display: flex;
    align-items: center;
    justify-content: center;
}
</style>