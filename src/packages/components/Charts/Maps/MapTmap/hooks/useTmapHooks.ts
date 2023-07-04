export interface useAmapType{
  isInit: globalThis.Ref<boolean>;
  map: any;
  getMap: () => any;
  setMap: (aMap: any) => void;
  setCoverGroupViewport: (LngLatList: any) => void
}


export function useTmap() {
  let map =  shallowRef(null)
  let isInit = ref(false) 
  let coverGroupMap = new Map() 
  //获取地图对象
  function getMap() {
    return map.value
  }
  //设置地图对象
  function setMap(aMap) {
    map.value = aMap
    isInit.value = true
    setTimeout(() => {
      setViewport(getOverlaysView())
    }, 1000);
  }
  function getOverlaysView(){
    let view = []
    map.value.getOverlays().forEach((overlay) => {
      if(overlay.getLngLat){
        view.push(overlay.getLngLat())
      }else if(overlay.getLngLats){
        view.push(...overlay.getLngLats()) 
      }
    })
    return  view
  }
  function setViewport(view=null){
    map.value.setViewport(view)
  }
  //地图自动缩放到覆盖物组
  function setCoverGroupViewport(LngLatList){
    let view = LngLatList.map((LngLat)=>{
      return new window.T.LngLat(LngLat[0],LngLat[1]) 
    })
    setViewport(view)
  }
  return {
    isInit,
    map,
    getMap,
    setMap,
    setCoverGroupViewport,
  }
}