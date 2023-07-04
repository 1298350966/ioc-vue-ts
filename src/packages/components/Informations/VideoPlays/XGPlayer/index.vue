
<template>
<div class="Xgplayer">
    <XgplayerVue :config="PlayerConfig"  style="background-color:rgba(0,0,0,0.87);width: 100%;height: 100%;" />
  </div>
</template>

<script setup lang="ts">
import { CreateComponentType } from '@/packages/index.d'


const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true
  }
})

const PlayerConfig = computed(()=>{

  const {type,isLive,url,poster,volume,autoplay,muted,loop,controls,playsinline,cssFullscreen} = props.chartConfig.option
  return {
    id: 'xgplayer',
    // url:'//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
    // url:"//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8",
    // url:"//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv",
    type,isLive,url,poster,volume,autoplay,muted,loop,controls,playsinline,cssFullscreen
    // poster: "//lf9-cdn-tos.bytecdntp.com/cdn/expire-1-M/byted-player-videos/1.0.0/poster.jpg", //播放器首帧预览图插件
  }
})
</script>

<style lang="scss" scoped>

</style>
