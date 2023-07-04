import { PublicConfigClass } from '@/packages/public'
import { CreateComponentType } from '@/packages/index.d'
import { XGPlayerConfig } from './index'
import cloneDeep from 'lodash/cloneDeep'
export enum VideoFormatEnum{
  MP4 = "MP4",
  HLS = "HLS",
  FLV = "FLV"
}
export const option = {
  // 播放格式
  type:VideoFormatEnum.MP4,
  // 是否直播
  isLive: false,
  // 播放地址
  url:'//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/mp4/xgplayer-demo-360p.mp4',
  // url:"//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/hls/xgplayer-demo.m3u8",
  // url:"//sf1-cdn-tos.huoshanstatic.com/obj/media-fe/xgplayer_doc_video/flv/xgplayer-demo-360p.flv",
  //封面图
  poster: "",
  //预设音量
  volume:"0.6",
  //自动播放
  autoplay:false,
  //静音状态
  muted:false,
  //循环播放
  loop:false,
  fluid:true,
  //控制栏
  controls:{
    autoHide:true,
    initShow:true,
  },
  playsinline: true,  
  cssFullscreen:false,
  // 圆角
  borderRadius: 10
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = XGPlayerConfig.key
  public chartConfig = cloneDeep(XGPlayerConfig)
  public option = cloneDeep(option)
}
