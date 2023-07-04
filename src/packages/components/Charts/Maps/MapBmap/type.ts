export enum MapTypeEnum {
  BMAP_NORMAL_MAP = "BMAP_NORMAL_MAP",
  BMAP_EARTH_MAP = "BMAP_EARTH_MAP",
  BMAP_SATELLITE_MAP = "BMAP_SATELLITE_MAP",
}

export enum coverEnum {
  Marker = "BMarker",
  Polygon = "BPolygon",
  Circle = "BCircle",
  Polyline = "BPolyline",
}

export enum controlEnum{
  Scale = "BScale",
  Zoom = "BZoom",
  Copyright = "BCopyright",
  Location = "BLocation",
  PanoramaControl = "BPanoramaControl",
  Navigation3d = "BNavigation3d",
  CityList = "BCityList",
}
export enum controlLabelEnum{
  Scale = "比例尺",
  Zoom = "缩放",
  Copyright = "版权",
  Location = "定位",
  PanoramaControl = "全景",
  Navigation3d = "3D视角导航",
  CityList = "城市列表",
}

export enum controlAnchorEnum{
  LT = 'BMAP_ANCHOR_TOP_LEFT',
  RT = 'BMAP_ANCHOR_TOP_RIGHT',
  LB = 'BMAP_ANCHOR_BOTTOM_LEFT',
  RB = 'BMAP_ANCHOR_BOTTOM_RIGHT'
}