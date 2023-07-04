<template>
    <el-switch 
        v-model="chartConfig.option.modelValue"
        v-bind="chartConfig.option.attrs"
        v-on="getEvents"
        >
    </el-switch>
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

</script>

<style lang="scss" scoped>
</style>