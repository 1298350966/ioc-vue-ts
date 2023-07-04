export interface useAmapType{
  isInit: globalThis.Ref<boolean>;
  map: any;
  getMap: () => any;
  setMap: (aMap: any) => void;
  setCoverGroupViewport: (LngLatList: any) => void
}


export function useBmap() {
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
    let overlays = map.value.getOverlays()
    console.log(`output->getOverlays`,overlays)
    overlays.forEach((overlay) => {
      // console.log(`output->overlay.getBounds()`,overlay.getBounds())
      if(overlay.getPosition){
        view.push(overlay.getPosition())
      } 
      if(overlay.getBounds){
        let Bounds = overlay.getBounds()
        view.push(Bounds.sw)
        view.push(Bounds.ne)
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
      return new window.BMapGL.Point(LngLat.lng,LngLat.lat) 
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