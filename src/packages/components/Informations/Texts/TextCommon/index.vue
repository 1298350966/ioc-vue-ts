<template>
  <div class="go-text-box">
    <div class="content">
      <span style="cursor: pointer" v-if="link" @click="click">{{ chartConfig.option.dataset }}</span>
      <span v-else>{{ chartConfig.option.dataset }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch } from '@/hooks'
import { option as configOption } from './config'
import { ChartEditStorageType } from '@/views/preview'


const props = defineProps<{
  chartConfig:CreateComponentType
}>()

const {
  linkHead,
  link,
  fontColor,
  fontSize,
  letterSpacing,
  paddingY,
  paddingX,
  textAlign,
  borderWidth,
  borderColor,
  borderRadius,
  writingMode,
  backgroundColor,
  fontWeight,
  fontFamily,
  fontStyle
} = toRefs(props.chartConfig.option)


// 手动更新
watch(
  () => props.chartConfig.data,
  (newData: any) => {
    newData && (props.chartConfig.option.dataset = newData)
  },
  {
    immediate: true,
    deep: false
  }
)

const rootConfig: ChartEditStorageType = inject("rootConfig")

// 预览更新
useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (newData: string) => {
  props.chartConfig.option.dataset = newData
})

//打开链接
const click = () => {
  window.open(linkHead.value + link.value)
}
</script>

<style lang="scss" scoped>
@include go('text-box') {
  display: flex;
  align-items: center;
  justify-content: v-bind('textAlign');

  .content {
    color: v-bind('fontColor');
    padding: v-bind('`${paddingY}px ${paddingX}px`');
    font-size: v-bind('fontSize + "px"');
    letter-spacing: v-bind('letterSpacing + "px"');
    writing-mode: v-bind('writingMode');
    font-weight: v-bind('fontWeight');
    border-style: solid;
    border-width: v-bind('borderWidth + "px"');
    border-radius: v-bind('borderRadius + "px"');
    border-color: v-bind('borderColor');
    background-color: v-bind('backgroundColor');
    font-family:v-bind('fontFamily');
    font-style:v-bind('fontStyle')
  }
}
</style>
