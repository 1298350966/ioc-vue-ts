<template>
  <div ref="domRef" >
    <component v-if="show"  style="width: 100%;height: 100%;" :is="componentIs" v-bind="data" @message="componentMessage"></component>
  </div>
</template>

<script setup lang="ts">
import mitt from 'mitt'
import { ref, nextTick, computed, watch, PropType } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { getAsyncCustomComponents } from '@/customComponents';
import { componentList } from '@/components/Pages/componentIframe/config';
import { resizeListener } from '@/utils';
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const show = ref(true)
const domRef= ref<HTMLElement>(null)
const {  data }  = toRefs(props.chartConfig)
const { is }  = toRefs(props.chartConfig.option)
const componentIs = computed(()=>{
  try {
    if(componentList[is.value]){
      return componentList[is.value]
    }else{
      return getAsyncCustomComponents(is.value)
    }
  } catch (error) {

  }
})
function componentMessage(){

}

onMounted(()=>{
  if(domRef.value){
    resizeListener(domRef.value as HTMLElement,resize,1000)
  }
})
function resize(){
  show.value = false
  nextTick(()=>{
    show.value = true
  })
}
</script>
<style lang="scss" scoped>
</style>