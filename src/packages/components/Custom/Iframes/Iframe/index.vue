<template>
   <iframe ref="IframeRefs" :allowtransparency="true" style="color-scheme: normal;" frameborder="0"  class="content" :src="src" @load="IframeLoad"></iframe>
</template>

<script setup lang="ts">
import mitt from 'mitt'
import { ref, nextTick, computed, watch, PropType } from 'vue'
import { CreateComponentType } from '@/packages/index.d'
import { EventParamsName, Events, option as configOption } from './config'
import { UseEventType } from '@/hooks';

const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})
const rootIframeEmit:UseEventType = inject("rootIframeEmit")

const {src,dataset}  = toRefs(props.chartConfig.option)
// const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events)
const IframeRefs = ref(null);
function IframeLoad(){
  IframeRefs.value.contentWindow.postMessage( JSON.stringify(props.chartConfig.data), "*")
}

function IframeMessage(event) {
  if(IframeRefs.value.contentWindow == event.source){ 
    let iframeData  = JSON.parse(event.data)
    console.log(`window接受消息`, iframeData)
    if(iframeData.eventName){
      rootIframeEmit && rootIframeEmit.emit(iframeData.eventName,iframeData.data)
    }
  }
}

watch(()=>props.chartConfig.data,(val)=>{
  IframeRefs.value.contentWindow.postMessage(JSON.stringify(val), "*")
},{

})
onMounted(()=>{
  window.addEventListener("message",IframeMessage , false);
})
onBeforeUnmount(() => {
  window.removeEventListener('message', IframeMessage, false)
})
</script>
<style lang="scss" scoped>
</style>