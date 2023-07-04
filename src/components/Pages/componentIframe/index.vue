<template>
  <template v-if="type === 'component'">
    <component :is="componentIs" v-bind="attrs" @message="componentMessage" style="width: 100%;height: 100%;"></component>
  </template>
  <template v-else-if="type === 'iframe'">
    <iframe ref="IframeRefs" class="content" v-bind="iframe" @load="IframeLoad"></iframe>
  </template>
</template>

<script setup lang="ts">
import { getAsyncCustomComponents } from '@/customComponents';
import { componentList } from './config';

const props = defineProps<{
  type:string,
  attrs:any,
  component?:any,
  iframe?:any
}>()

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
  console.log(`window接受消息`, event)
  emit("message",event.data)
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