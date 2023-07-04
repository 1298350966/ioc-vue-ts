import { loadJs } from "@/utils";
// import { option } from "../config";
// const {mapKey,mapZindex,mapLng,mapLat,mapStyleKeyCustom} = option.mapOptions

export async function initTMap(el:string|HTMLElement|undefined,mapOptions:any){
  const {mapKey,mapZindex,mapLng,mapLat,mapStyleKeyCustom,mapStyleKey} = mapOptions
  let url:string = `http://api.tianditu.gov.cn/api?v=4.0&tk=${mapKey}`
  await loadJs( url )
  const {LngLat,TileLayer} = window.T
  let option = {layers:[] as any}
  if(mapStyleKeyCustom){
    option.layers.push(new TileLayer(mapStyleKeyCustom))
  }
  

  const TMapIns = new window.T.Map(el,option);
  window.TMapIns = TMapIns
  // 设置中心点
  TMapIns.centerAndZoom(new LngLat(mapLng,mapLat), mapZindex)
  //设置主题
  mapStyleKey==='normal'?
  TMapIns.removeStyle():
  TMapIns.setStyle(mapStyleKey)
  
  return  TMapIns
}




function useTMap(){
  
}
