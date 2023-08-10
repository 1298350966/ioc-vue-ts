import { PublicConfigClass, requestConfig } from "@/packages/public";
import { CoverGroupType, CreateComponentType, EventsType } from "@/packages/index.d";
import { MapBmapConfig } from "./index";
import { chartInitConfig } from "@/settings/designSetting";
import cloneDeep from "lodash/cloneDeep";
import dataJson from "./data.json";
import MarkerData from "./json/MarkerData.json";
import { controlEnum,controlLabelEnum,controlAnchorEnum,MapTypeEnum, coverEnum } from "./type";
export enum ThemeEnum {
  NORMAL = "normal",
  DARK = "dark",
  LIGHT = "light",
  WHITES_MOKE = "whitesmoke",
  FRESH = "fresh",
  GREY = "grey",
  GRAFFITI = "graffiti",
  MACARON = "macaron",
  BLUE = "blue",
  DARKBLUE = "darkblue",
  WINE = "wine",
}

export enum LangEnum {
  ZH_CN = "zh_cn",
  EN = "en",
  ZH_EN = "zh_en",
}

export enum ViewModeEnum {
  PLANE = "2D",
  STEREOSCOPIC = "3D",
}



export enum MarkerEnum {
  // 圆圈
  CIRCLE_MARKER = "CircleMarker",
  // 定位标点
  MARKER = "Marker",
  // 暂无
  NONE = "none",
}


export const option = {
  dataset: dataJson,
  mapOptions: {
    pitch: 60,
    skyColor: "#53A9DE",
    mapKey: "KKG8EDD3V4vuyPGcjsLCt16PHacQIx3P",
    mapStyleKey: ThemeEnum.DARK,
    mapStyleId:"",
    mapStyleKeyCustom: "",
    mapLog: 116.397428,
    mapLat: 39.90923,
    mapZindex: 11,
    minZoom: 0,
    maxZoom: 20,
    heading: 0,
    mapType: MapTypeEnum.BMAP_NORMAL_MAP,
    showControls: false,
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
      zIndex: 1,
      path: [
        [
          [-360, 90],
          [-360, -90],
          [360, -90],
          [360, 90]
        ],
        [[116.156782, 39.910151],
        [116.406315, 39.908775],
        [116.406315, 39.908775],
        [116.196887, 39.809312]]
      ],
      fillColor: "#ccebc5",//填充颜色
      fillOpacity: 0.5, //填充透明度
      strokeColor: "#2b8cbe", // 线条颜色
      strokeOpacity: 1, // 线条透明度
      strokeWeight: 1, //线条宽度
      strokeStyle: "dashed", // 线样式
      extData: null,
    }
  },
  coverGroupList: [],
  InfoWindowList: [],
  controlGroupList:[],
};
//点标记
export const MarkerOptions = {
  visible: true,
  title:"",
  raiseOnDrag: false,
  enableClicking: true,

  zIndex: 1,
  position:{
    lat:"39.90923",
    lng:"116.397428",
  },
  offset:{
    x:-22,
    y:-50,
  },
  icon: {
    anchor:{
      x:0,
      y:0,
    },
    imageOffset:{
      x:0,
      y:0,
    },
    imageSize:{
      width:44,
      height:88,
    },
    imageUrl:"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
  },
  // icon:"simple_red",
  rotation: 0,
  enableDragging: false,
  enableMassClear: true,
  extData: null,
}
//圆形
export const CircleOptions = {
  visible: true,
  zIndex: 1,
  extData: null,
  
  geodesic:false, //是否开启大地线模式
  clip:true,  //是否进行跨经度180度裁剪
  center: null,
  radius: 5000,
  strokeColor: "white", //线条颜色
  strokeOpacity: 0.5, //轮廓线透明度
  strokeWeight: 2, //轮廓线宽度
  fillColor: "#E98984FF", //圆形填充颜色
  fillOpacity: 0.5, //圆形填充透明度
  strokeStyle: "solid", //轮廓线样式
  enableMassClear: true,
  enableEditing: false,
  enableClicking: true,
};
// 多边形
export const PolygonOptions = {
  visible: true,
  zIndex: 1,
  extData: null,
  
  geodesic:false, //是否开启大地线模式
  clip:true,  //是否进行跨经度180度裁剪
  isBoundary:false, //是否行政区域的边界多边形
  autoCenter:true,  //是否自动根据多边形居中地图
  
  path: null,
  strokeColor: "#2b8cbe", // 线条颜色
  strokeOpacity: 1, // 线条透明度
  strokeWeight: 1, //线条宽度
  strokeStyle: "dashed", // 线样式
  fillColor: "#ccebc5",//填充颜色
  fillOpacity: 0.5, //填充透明度
  enableMassClear: true,
  enableEditing: false,
  enableClicking: true,
};
// 折线
export const PolylineOptions = {
  visible: true,
  zIndex: 1,
  extData: null,
  
  geodesic:false, //是否开启大地线模式
  clip:true,  //是否进行跨经度180度裁剪
  path: null,
  strokeColor: "#2b8cbe", // 线条颜色
  strokeOpacity: 1, // 线条透明度
  strokeWeight: 1, //线条宽度
  strokeStyle: "dashed", // 线样式
  enableMassClear: true,
  enableEditing: false,
  enableClicking: true,

};
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
  center:{
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
export const PolygonDataMapping = {
  path:{
    type:"array|LngLatArray",
    key:"path",
    lng:"lng",
    lat:"lat",
    label:"路径",
    typeOptions:pathTypeOptions
  },
}
//折线段映射
export const PolylineDataMapping = {
  path:{
    type:"array|LngLatArray",
    key:"path",
    lng:"lng",
    lat:"lat",
    label:"路径",
    typeOptions:pathTypeOptions
  },
}

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

export const InfoWindowOptions = {
  id: null,
  name: "",
  position: null,
  visible: true,
  title:"自定义标题",
  width:320,  //取值范围：0, 220 - 730
  height:200,  //取值范围：0, 60 - 650
  offset:{
    x:0,
    y:-50
  }, 
  enableAutoPan:true, 
  enableCloseOnClick:false,  
  content: {
    type: "component",
    component: {
      is: "",
    },
    attrs: {},
    iframe: {
      src: ""
    }
  },
  extData: null
}


//比例尺控件
export const ScaleOptions = {
  anchor:controlAnchorEnum.LB,
  offset:{
    x:20,
    y:20,
  },
}
//缩放控件
export const ZoomOptions = {
  anchor:controlAnchorEnum.LT,
  offset:{
    x:20,
    y:20,
  },
}
//地图类型
export const MapTypeOptions = {
  anchor:controlAnchorEnum.RT,
  offset:{
    x:20,
    y:20,
  },
  type:'',
  mapTypes:['BMAP_NORMAL_MAP'],
}
//定位
export const LocationOptions ={
  anchor:controlAnchorEnum.RB,
  offset:{
    x:20,
    y:20,
  },
}
//版权控件
export const CopyrightOptions = {
  anchor:controlAnchorEnum.LB,
  offset:{
    x:20,
    y:20,
  },
}
//地图 3D 控件
export const Navigation3dOptions = {
  anchor:controlAnchorEnum.RT,
  offset:{
    x:20,
    y:20,
  },
}
//城市列表
export const CityListOptions = {
  anchor:controlAnchorEnum.LT,
  offset:{
    x:20,
    y:20,
  },
  expand:false,
}
//全景
export const PanoramaOptions = {
  anchor:controlAnchorEnum.LT,
  offset:{
    x:20,
    y:20,
  },
}

export const controlOptions = [
  {
    value:controlEnum.Scale,
    label:controlLabelEnum.Scale,
  },
  {
    value:controlEnum.Zoom,
    label:controlLabelEnum.Zoom,
  },
  {
    value:controlEnum.Copyright,
    label:controlLabelEnum.Copyright,
  },
  {
    value:controlEnum.Location,
    label:controlLabelEnum.Location,
  },
  {
    value:controlEnum.PanoramaControl,
    label:controlLabelEnum.PanoramaControl,
  },
  {
    value:controlEnum.Navigation3d,
    label:controlLabelEnum.Navigation3d,
  },
  {
    value:controlEnum.CityList,
    label:controlLabelEnum.CityList,
  }
]
export const controlGroupOptions = {
  id: null,
  name: "",
  visible: true,
  type:controlEnum.Scale,
  options: cloneDeep(ScaleOptions),
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

export const coverGroupOptions:CoverGroupType = {
  id: null,
  name: "",
  visible: true,
  type: coverEnum.Marker,
  options: cloneDeep(MarkerOptions) as any,
  request: cloneDeep(requestConfig),
  events: {
    configEvents: {
      componentEvents: [],
    },
    codeEvents: {
      baseEvent: {
        click: "console.log(this);console.log(e);"
      }
    }
  },
  InfoWindow:{
    eventType:"click",
    enable: true,
    options:cloneDeep(InfoWindowOptions)
  },
  data: cloneDeep(MarkerData),
  dataMapping: cloneDeep(MarkerDataMapping),
  filterNode: 'datas',
  filter: "",
  dataBinding: {
    codeMode: "",
    configMode: []
  }
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType {
  public key = MapBmapConfig.key;
  public attr = { ...chartInitConfig, w: 1000, h: 800, zIndex: -1 };
  public chartConfig = cloneDeep(MapBmapConfig);
  public option = cloneDeep(option);
  public data = cloneDeep(dataJson)
}
