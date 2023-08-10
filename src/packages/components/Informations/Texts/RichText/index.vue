<template>
  <div class="RichText-box">
    <div :style="contentStyle" class="content editor-content-view" v-html="htmlText">
    </div>
  </div>
</template>

<script setup lang="ts">
import { PropType, toRefs, shallowReactive, watch } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { useChartDataFetch } from '@/hooks'
import { option as configOption } from './config'
import { ChartEditStorageType } from '@/views/preview'
import { get } from 'lodash'
import "./css/view.css";

const props = defineProps<{
  chartConfig:CreateComponentType
}>()

const {
  paddingY,
  paddingX,
  
} = toRefs(props.chartConfig.option)

const htmlText = computed(()=>{
  let {htmlText} = props.chartConfig.option
  return getHtmlText(htmlText)
})

function getHtmlText(val:string){
  return val.replace(/\{\{([^\}]+)\}\}/g, (_,key)=>{
    console.log(`output->`,_,key)
    try {
      return get(props.chartConfig.data,key)
    } catch (error) {
      return ""
    }
  });
      
}

const contentStyle = computed(()=>{
  return props.chartConfig.option.style
})
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
})


</script>

<style lang="scss" scoped>
.RichText-box{
  .content{
    padding: v-bind('`${paddingY}px ${paddingX}px`');
  }
  
}

</style>
