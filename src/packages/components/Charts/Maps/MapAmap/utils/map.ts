export function setBounds(map,LngLatList){
  let lngList = LngLatList.map((LngLat) => {
    return LngLat[0]
  }).sort((a,b) => a-b);
  let latList = LngLatList.map((LngLat) => {
    return LngLat[1]
  }).sort((a,b) => a-b);
  map.setBounds([lngList[0],latList[0]],lngList[lngList.length - 1],latList[latList.length - 1])
}