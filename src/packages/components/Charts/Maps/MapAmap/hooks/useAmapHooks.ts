export interface useAmapType{
  isInit:any,
  map: any;
  coverGroupMap: Map<any, any>;
  setMap: (aMap: any) => void;
  getMap: () => any;
  setFitView(overlays: any): void
  setBounds: (LngLatList: any) => void;
  addCoverGroup: (id: any, coverGroup: any) => void;
  deleteCoverGroup: (id: any, coverGroup: any) => void;
  getCoverGroup: (id: any) => void;
  setCoverGroupFitView:(id: any) => void;
}


export function useAmap() {
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
      setFitView()
    }, 1000);
  }
  //根据坐标组地图自动缩放
  function setBounds(LngLatList){
    if(!isInit) return
    if(LngLatList.length == 0) return
    let lngList = LngLatList.map((LngLat) => {
      return LngLat[0]
    }).sort((a,b) => a-b);
    let latList = LngLatList.map((LngLat) => {
      return LngLat[1]
    }).sort((a,b) => a-b);
    // map.value.setBounds(new window.AMap.Bounds([lngList[0],latList[0]],lngList[lngList.length - 1],latList[latList.length - 1]))
    var mybounds = new window.AMap.Bounds([Number(lngList[0])  - 0.01, Number(latList[latList.length - 1]) + 0.01] , [Number(lngList[lngList.length - 1]) + 0.01,Number(latList[0])  - 0.01]);
    map.value.setBounds(mybounds);
  }

  function setFitView(overlays=null){
    map.value.setFitView(overlays,false,[100,100,100,100])
  }
  //添加覆盖物组
  function addCoverGroup(id,coverGroup){
    coverGroupMap.set(id,coverGroup)

  }
  //删除覆盖物组
  function deleteCoverGroup(id,coverGroup){
    coverGroupMap.delete(id)
  }
  //获取覆盖物组
  function getCoverGroup(id){
    coverGroupMap.get(id)
  }
  //地图自动缩放到覆盖物组
  function setCoverGroupFitView(id){
    let coverGroupRefs = coverGroupMap.get(id)
    if(coverGroupRefs){
      let overlays = coverGroupRefs.value.map((cover) => {
        return cover.$$getInstance()
      })
      setFitView(overlays)
    }
  }
  return {
    isInit,
    map,
    coverGroupMap,
    getMap,
    addCoverGroup,
    deleteCoverGroup,
    getCoverGroup,
    setMap,
    setBounds,
    setCoverGroupFitView,
  }
}