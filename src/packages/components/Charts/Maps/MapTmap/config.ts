import { PublicConfigClass, requestConfig } from '@/packages/public'
import { CoverGroupType, CreateComponentType, EventsType } from '@/packages/index.d'
import { MapTmapConfig } from './index'
import { chartInitConfig } from '@/settings/designSetting'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'
import { ThemeEnum, coverEnum,contorlEnum,mapStyleKeyCustomOptionsLabelEnum,mapStyleKeyCustomOptionsUrlEnum } from './type'
import MarkerData from "./json/MarkerData.json";

// export enum ThemeEnum {
//   NORMAL = 'normal',
//   BLACK = 'black',
//   INDIGO = 'indigo'
// }


export const option = {
  dataset: dataJson,
  mapOptions: {
    pitch: 60,
    skyColor: '#53A9DE',
    mapKey: 'ce5a88c3140fe5ed788f757afdab0f77',
    mapStyleKey: ThemeEnum.NORMAL,
    mapStyleKeyCustom: '',
    mapLng: 116.3987,
    mapLat: 39.8947,
    mapZindex: 13,
  },
  mask: {
    enable: false,
    outer: [
      [-360, 90],
      [-360, -90],
      [360, -90],
      [360, 90]
    ],
    path: [],
    polygonOptions: {
      visible: true,
      path: [
        [
          [-360, 90],
          [-360, -90],
          [360, -90],
          [360, 90]
        ],
        [[
          116.36169,
          39.9279
        ],
        [
          116.40461,
          39.9279
        ],
        [
          116.44444,
          39.92633
        ],
        [
          116.44478,
          39.87707
        ],
        [
          116.36307,
          39.87681
        ]]
      ],
      color: "#ccebc5",
      weight: 3,
      opacity: 0.5,
      lineStyle: "solid",
      edit: false,
      extData: null
    }
  },
  coverGroupList: [],
  InfoWindowList: [],
  controlGroupList:[],
}

//点标注
export const MarkerOptions = {
  visible: true,
  zIndexOffset: 1,
  position: null,
  icon: "",
  title: "",
  opacity: 1,
  draggable: false,
  extData: null,
};
//圆形
export const CircleOptions = {
  visible: true,
  color: "#2b8cbe",
  weight: 3,
  opacity: 0.5,
  fillColor: "#0000FF",
  fillOpacity: 0.2,
  lineStyle: "solid",
  center: null,
  radius: 10,
  edit: false,
  extData: null
};
//多边形
export const PolygonOptions = {
  visible: true,
  color: "#2b8cbe",
  weight: 3,
  opacity: 0.5,
  fillColor: "#0000FF",
  fillOpacity: 0.2,
  lineStyle: "solid",
  path: null,
  edit: false,
  extData: null
};
//线
export const PolylineOptions = {
  visible: true,
  color: "#2b8cbe",
  weight: 3,
  opacity: 0.5,
  lineStyle: "solid",
  path: null,
  edit: false,
  extData: null
};


export const coverOptions = [
  {
    value: coverEnum.Marker,
    label: "点标记",
  },
  {
    value: coverEnum.Circle,
    label: "圆标记",
  },
  {
    value: coverEnum.Polygon,
    label: "多边形",
  },
  {
    value: coverEnum.Polyline,
    label: "折线",
  },
];
//经纬度坐标
const positionTypeOptions = [
  {
    value:"LngLat",
    label:"LngLat对象"
  },
  {
    value:"LngLatArray",
    label:"LngLat数组"
  },
]
//路径坐标
const pathTypeOptions = [
  {
    value:"array|LngLat",
    label:"数组|对象(LngLat)"
  },
  {
    value:"array|LngLatArray",
    label:"数组|数组(LngLat)"
  },
  {
    value:"json|LngLat",
    label:"json|对象(LngLat)"
  },
  {
    value:"json|LngLatArray",
    label:"json|数组(LngLat)"
  },
]
//点标注字段映射
export const MarkerDataMapping = {
  position:{
    type:"LngLat",
    key:"position",
    lng:"lng",
    lat:"lat",
    label:"坐标",
    typeOptions:positionTypeOptions
  },  
}
//圆形字段映射
export const CircleDataMapping = {
  position:{
    type:"LngLat",
    key:"center",
    lng:"lng",
    lat:"lat",
    label:"坐标",
    typeOptions:positionTypeOptions
  }, 
  radius:{
    key:"radius",
    type:"number",
    label:"半径"
  } 
}
//多边形字段映射
export const PolygonMapping = {
  position:{
    type:"LngLat",
    key:"position",
    lng:"lng",
    lat:"lat",
    label:"坐标",
    typeOptions:positionTypeOptions
  },  
}
//线字段映射
export const PolylineDataMapping = {
  position:{
    type:"LngLat",
    key:"position",
    lng:"lng",
    lat:"lat",
    label:"坐标",
    typeOptions:positionTypeOptions
  },  
}

export const coverGroupOptions:CoverGroupType = {
  id: null,
  name: "",
  visible: true,
  type: coverEnum.Marker,
  options: cloneDeep(MarkerOptions) as any,
  dataset: MarkerData as any,
  request: cloneDeep(requestConfig),
  events: {
    configEvents: {
      componentEvents: [],
    },
    codeEvents:{
      baseEvent: {
        click: "console.log(this);console.log(data);console.log(e);"
      }
    }
  },
  data:cloneDeep(MarkerData),
  dataMapping:cloneDeep(MarkerDataMapping),
  filterNode:'datas',
  filter:""
};

export const InfoWindowOptions = {
  id: null,
  name: "",
  visible: false,
  minWidth: 50,
  maxWidth: 300,
  maxHeight: null as number,
  autoPan: false,
  closeButton: true,
  offset: [0, 7],
  autoPanPadding: [5, 5],
  closeOnClick: false,
  content: {
    type: "component",
    component: {
      is: "",
      attrs: {}
    },
    iframe: {
      src: ""
    }
  },
  position: null, //位置
  extData: null
}
export const themeOptions = [
  {
    value: ThemeEnum.NORMAL,
    label: "标准",
  },
  {
    value: ThemeEnum.BLACK,
    label: "幻影黑",
  },
  {
    value: ThemeEnum.INDIGO,
    label: "靛蓝色",
  },
];
export const mapStyleKeyCustomOptions = [
  {
    value:mapStyleKeyCustomOptionsUrlEnum.SLDT_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.SLDT_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.SLDT_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.SLDT_MOKATUO_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.SLZJ_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.SLZJ_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.SLZJ_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.SLZJ_MOKATUO_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.YXDT_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.YXDT_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.YXDT_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.YXDT_MOKATUO_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.YXZJ_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.YXZJ_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.YXZJ_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.YXZJ_MOKATUO_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.DXYX_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.DXYX_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.DXYX_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.DXYX_MOKATUO_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.DXZJ_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.DXZJ_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.DXZJ_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.DXZJ_MOKATUO_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.QQJJ_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.QQJJ_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.QQJJ_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.QQJJ_MOKATUO_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.SLYWZJ_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.SLYWZJ_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.SLYWZJ_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.SLYWZJ_MOKATUO_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.YXYWZJ_LNGLAT_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.YXYWZJ_LNGLAT_SHADOW,
  },
  {
    value:mapStyleKeyCustomOptionsUrlEnum.YXYWZJ_MOKATUO_SHADOW,
    label:mapStyleKeyCustomOptionsLabelEnum.YXYWZJ_MOKATUO_SHADOW,
  },
]


//缩放控件
export const zoomOptions={
  position:"topleft",
  zoomInText:"+",
  zoomOutText:"-",
  zoomInTitle:"放大",
  zoomOutTitle:"缩小",
}
//比例尺控件
export const scaleOptions={
  position:"bottomleft",
}
//版权控件
export const copyrightOptions={
  position:"bottomleft",
  id:"",
  content:"",
  bounds:[],
}
//鹰眼地图控件
export const overviewMapOptions={
  position:"bottomright",
  isOpen:"false",
}
//地图类型控件
export const mapTypeOptions={
  position:"topright",
  mapTypes:
  [
    "TMAP_NORMAL_MAP"
  ]
}
export const mapTypeSelectOptions = [
    {
        title: "地图", //地图控件上所要显示的图层名称
        icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png", //地图控件上所要显示的图层图标（默认图标大小 80x80）
        layer: "TMAP_NORMAL_MAP" //地图类型，在原天地图api中以window.TMAP_NORMAL_MAP表示，此处为字符串
    }
    ,
    {
      title: "卫星",
      icon: " http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png",
      layer: "TMAP_SATELLITE_MAP"
    },
    {
      title: "卫星混合",
      icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png",
      layer: "TMAP_HYBRID_MAP"
    },
    {
      title: "地形",
      icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrain.png",
      layer: "TMAP_TERRAIN_MAP"
    },
    {
      title: "地形混合",
      icon: "http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrainpoi.png",
      layer: "TMAP_TERRAIN_HYBRID_MAP"
    }
]
export const controlOptions = [
  {
    value:contorlEnum.Zoom,
    label:"缩放",
  },
  {
    value:contorlEnum.Scale,
    label:"比例尺",
  },
  {
    value:contorlEnum.Copyright,
    label:"版权",
  },
  {
    value:contorlEnum.OverviewMap,
    label:"鹰眼地图",
  },
  {
    value:contorlEnum.mapType,
    label:"地图类型",
  },
]
export const controlGroupOptions = {
  id: null,
  name: "",
  visible: true,
  type:contorlEnum.Zoom,
  options: cloneDeep(zoomOptions),
}

export enum ControlGroupEventEnum {
  // 单击
  CLICK = 'click',
  // 鼠标进入
  MOUSE_ENTER = 'mouseenter',
  // 鼠标移出
  MOUSE_LEAVE = 'mouseleave',
}

export const ControlGroupEvents:EventsType= {
  [ControlGroupEventEnum.CLICK]: {
    key: ControlGroupEventEnum.CLICK,
    name: "单击",
    paramsName: ["MapsEvent","config", 'rootConfig'],
    vars: [],
  },
  [ControlGroupEventEnum.MOUSE_ENTER]: {
    key: ControlGroupEventEnum.MOUSE_ENTER,
    name: "鼠标进入",
    paramsName: ["MapsEvent", "config", 'rootConfig'],
    vars: [],
  },
  [ControlGroupEventEnum.MOUSE_LEAVE]: {
    key: ControlGroupEventEnum.MOUSE_LEAVE,
    name: "鼠标移出",
    paramsName: ["MapsEvent", "config", 'rootConfig'],
    vars: [],
  },
}

export default class Config extends PublicConfigClass implements CreateComponentType {
  public key = MapTmapConfig.key
  public attr = { ...chartInitConfig, w: 1000, h: 800, zIndex: -1 }
  public chartConfig = cloneDeep(MapTmapConfig)
  public option = cloneDeep(option)
  public data = cloneDeep(dataJson)
}
