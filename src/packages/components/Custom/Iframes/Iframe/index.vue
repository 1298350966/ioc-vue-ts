<template>
  <iframe ref="IframeRefs" frameborder="0"  class="content" :src="src" @load="IframeLoad"></iframe>
</template>

<script setup lang="ts">
import mitt from 'mitt'
import { ref, nextTick, computed, watch, PropType } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { EventParamsName, Events, option as configOption } from './config'


const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const {src,dataset}  = toRefs(props.chartConfig.option)
// const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events)
const IframeRefs = ref(null);
function IframeLoad(){
  console.log(`output->11`,11)
  IframeRefs.value.contentWindow.postMessage( JSON.stringify(props.chartConfig.data), "*")
}

function IframeMessage(event) {
  if(IframeRefs.value.contentWindow == event.source){

    console.log(`window接受消息`, event)
  }

  // emit("message",event.data)
}
onMounted(()=>{
  window.addEventListener("message",IframeMessage , false);
})
onBeforeUnmount(() => {
  window.removeEventListener('message', IframeMessage, false)
})
</script>
<style lang="scss" scoped>
</style>