<template>
  <div ref="domRef" >
    <div :id='config.id'></div>
  </div>
</template>

<script setup lang="ts">
import { resizeListener } from '@/utils';
import { throttle } from 'lodash';
import Player from 'xgplayer';
import "xgplayer/dist/index.min.css"
import  FlvPlayer from "xgplayer-flv"
import  HlsPlayer from "xgplayer-hls"
import  Mp4Plugin from "xgplayer-hls"
import { VideoFormatEnum } from '.';


const props = withDefaults(defineProps<{
  config:any
}>(),{
  config:{ id: 'mse', url: '' }
})
const emit = defineEmits(["player"])
let player = null
const domRef= ref<HTMLElement>(null)
function init() {
  nextTick(()=>{
    let height = domRef.value.offsetHeight
    let width = domRef.value.offsetWidth
      
    if (props.config.url && props.config.url !== '') {
      let plugins 
      if(props.config.type == VideoFormatEnum.FLV){
        plugins = [FlvPlayer]
      }else if(props.config.type == VideoFormatEnum.HLS){
        plugins = [HlsPlayer]
      }else{
        plugins = []
      }
      player = new Player(Object.assign({
        lang: 'zh',
        height: height,
        width: width,
        plugins
      },props.config));
      emit('player', player)
    }
  })
}
function resize(){
  document.getElementById(props.config.id).style.height= domRef.value.offsetHeight+'px';
  document.getElementById(props.config.id).style.width= domRef.value.offsetWidth+'px';
  console.log(`output->`,name)
}
watch(()=>props.config,()=>{
  init()
},{
  deep: true,
  immediate:true
})
onMounted(()=>{

  init()
  console.log(`output->`,domRef.value)
  if(domRef.value){
    resizeListener(domRef.value as HTMLElement,resize)
  }
})


onBeforeUnmount(() => {
  player && typeof player.destroy === 'function' && player.destroy();
  // window.removeEventListener('resize',resize)
})
</script>

<style scoped>

</style>