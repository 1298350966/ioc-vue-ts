
//点标记
export function createMarker(options = null) {
  if (!options.position) return null
  const marker = new window.AMap.Marker(
    Object.assign({
      icon: "//a.window.AMap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
      position: [116.406315, 39.908775],
      offset: new window.AMap.Pixel(-13, -30)
    }, options)
  )
  return marker
}
//灵活点标记
export function createElasticMarker() {

}

//圆标记
export function createCircleMarker(options) {
  if (!options.center) return null
  const marker = new window.AMap.CircleMarker(
    Object.assign(options)
  )
  return marker
}

//多边形
export function createPolygon(options) {
  if (!options.path) return null
  const polygon = new window.AMap.Polygon(Object.assign({
    fillColor: '#ccebc5', // 多边形填充颜色
    strokeOpacity: 1, // 线条透明度
    fillOpacity: 0.5, //填充透明度
    strokeColor: '#2b8cbe', // 线条颜色
    strokeWeight: 1, //线条宽度
    strokeStyle: 'dashed', // 线样式
    strokeDasharray: [5, 5], //轮廓的虚线和间隙的样式
  }, options));
  return polygon
}

//折线
export function createPolyline(options) {
  if (!options.path) return null
  const polyline = new window.AMap.Polyline(options);
  return polyline
}
//弹窗
export function createInfoWindow(el, options = null) {
  new window.AMap.InfoWindow(Object.assign({
    content: el
  }, options))
}

//遮罩
export function createMask(path, options = null) {
  var outer = [
    new window.AMap.LngLat(-360, 90, true),
    new window.AMap.LngLat(-360, -90, true),
    new window.AMap.LngLat(360, -90, true),
    new window.AMap.LngLat(360, 90, true),
  ];
  var pathArray = [
    outer,
    path
  ];
  var polygon = new window.AMap.Polygon({
    path: pathArray,
    strokeColor: '#00eeff',
    strokeWeight: 1,
    fillColor: '#71B3ff',
    fillOpacity: 0.5
  });
  return polygon
}
//创建组
export function createOverlayGroup(map) {
  let overlayGroup = new window.AMap.OverlayGroup();
  map.add(overlayGroup)
  return overlayGroup
}



