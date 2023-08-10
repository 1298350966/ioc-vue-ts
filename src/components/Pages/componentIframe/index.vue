<template>
  <template v-if="type === 'component'">
    <component :is="componentIs" v-bind="attrs" @message="componentMessage" :style="isInherit ? {width: '100%',height: '100%'} : {}"></component>
  </template>
  <template v-else-if="type === 'iframe'">
    <iframe ref="IframeRefs" :allowtransparency="true" frameborder="0" style="color-scheme: normal;" class="content" v-bind="iframe" @load="IframeLoad"></iframe>
  </template>
</template>

<script setup lang="ts">
import { getAsyncCustomComponents } from '@/customComponents';
import { componentList } from './config';
import { UseEventType } from '@/hooks';

const props = withDefaults(defineProps<{
  type:string,
  attrs:any,
  component?:any,
  iframe?:any
  isInherit:boolean,
}>(),{
  isInherit:true
})

const rootIframeEmit:UseEventType = inject("rootIframeEmit")

const emit = defineEmits(["message"])

const componentIs = computed(()=>{
  if(componentList[props.component.is]){
    return componentList[props.component.is]
  }else{
    return getAsyncCustomComponents(props.component.is)
  }
})

function componentMessage(event) {
  emit("message",event)
}

const IframeRefs = ref(null);

function IframeLoad(){
  IframeRefs.value.contentWindow.postMessage( JSON.stringify(props.attrs), "*")
}

function IframeMessage(event) {
  if(!IframeRefs.value) return
  if(IframeRefs.value.contentWindow == event.source){ 
    let iframeData  = JSON.parse(event.data)
    console.log(`window接受消息`, iframeData)
    if(iframeData.eventName){
      rootIframeEmit && rootIframeEmit.emit(iframeData.eventName,iframeData.data)
    }
  }
}

onMounted(()=>{
  window.addEventListener("message",IframeMessage , false);
})
onBeforeUnmount(() => {
  window.removeEventListener('message', IframeMessage, false)
})
</script>

<style scoped>

</style>