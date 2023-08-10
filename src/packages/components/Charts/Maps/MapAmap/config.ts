import { PublicConfigClass, requestConfig } from "@/packages/public";
import { CreateComponentType, EventsType } from "@/packages/index.d";
import { MapAmapConfig } from "./index";
import { chartInitConfig } from "@/settings/designSetting";
import cloneDeep from "lodash/cloneDeep";
import dataJson from "./data.json";
import {controlEnum,mapStyleKeyCustomOptionsLabelEnum,mapStyleKeyCustomOptionsUrlEnum } from './type'
import {CoverGroupType } from '@/packages/index.d'
import MarkerData from "./json/MarkerData.json";
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

export enum FeaturesEnum {
  BG = "bg",
  POINT = "point",
  ROAD = "road",
  BUILDING = "building",
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
    amapKey: "d5f3e16589dbecae64d05fe90e2ba4f2",
    amapStyleKey: ThemeEnum.NORMAL,
    amapStyleKeyCustom: "ElAmapLayerDefault",
    layerOptions: {
      tileUrl: "https://wprd0{1,2,3,4}.is.autonavi.com/appmaptile?x=[x]&y=[y]&z=[z]&size=1&scl=1&style=8&ltype=11",
    },
    amapLon: 116.397428,
    amapLat: 39.90923,
    amapZindex: 11,
    viewMode: ViewModeEnum.PLANE,
    lang: LangEnum.ZH_CN,
    features: [
      FeaturesEnum.BG,
      FeaturesEnum.POINT,
      FeaturesEnum.ROAD,
      FeaturesEnum.BUILDING,
    ],
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

export enum coverEnum {
  Marker = "Marker",
  Polygon = "Polygon",
  CircleMarker = "CircleMarker",
  Polyline = "Polyline",
  LabelMarker = "LabelMarker",
  ElasticMarker = "ElasticMarker",
  MassMarks = "MassMarks"
}

export const MarkerOptions = {
  visible: true,
  zIndex: 1,
  position: null,
  icon:{
    imageSize:[40,65],
    image: "//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
  },
  title: "",
  content: "",
  label: {
    direction: "bottom-center",
    content: "",
    offset: [0, 0]
  },
  angle: 0,
  draggable: false,
  offset: [-20, -65],
  extData: null,
};

//海量标注
export const LabelMarkerOptions = {
  visible: true,
  zIndex: 1,
  position: null,
  zooms: [2, 20],
  icon: {
    image: 'https://a.amap.com/jsapi_demos/static/images/poi-marker.png',
    anchor: 'bottom-center',
    size: [25, 34],
    clipOrigin: [459, 92],
    clipSize: [50, 68]
  },
  text: {
    content: "",
    direction: 'right',
    offset: [0, 0],
    style: {
      fontSize: "12",
      fillColor: "",
      backgroundColor: "",
    }
  },
  extData: {

  }
}
//灵活点标记
export const ElasticMarkerOptions = {
  visible: true,
  zIndex: 1,
  position: null,
  offset: [0, 0],
  draggable: false,
  zoomStyleMapping: {
    2: 1,
    11: 0,
    12: 0,
    13: 0,
    14: 0,
    15: 0,
    16: 1,
    17: 1,
    18: 1,
    19: 1,
    20: 1
  },
  styles: [{
    icon: {
      img: 'https://a.amap.com/jsapi_demos/static/resource/img/故宫.png',
      size: [16, 16],//可见区域的大小
      anchor: 'bottom-center',//锚点
      fitZoom: 14,//最合适的级别
      scaleFactor: 2,//地图放大一级的缩放比例系数
      maxScale: 2,//最大放大比例
      minScale: 1//最小放大比例
    },
    label: {
      content: '祈年殿',
      position: 'BM',
      minZoom: 15
    }
  }, {
    icon: {
      img: 'https://a.amap.com/jsapi_demos/static/resource/img/qiniandian.png',
      size: [128, 160],
      anchor: 'bottom-center',
      fitZoom: 17.5,
      scaleFactor: 2,
      maxScale: 2,
      minScale: 0.125
    },
    label: {
      content: '祈年殿',
      position: 'BM'
    }
  }],
  extData: ""
}
//海量点标记
export const MassMarksOptions = {
  visible: true,
  zIndex: 1,
  zooms: [2, 20],
  data: [],
  styles: [{
    url: 'https://webapi.amap.com/images/mass/mass0.png',
    anchor: [6, 6],
    size: [11, 11],
    zIndex: 3,
  }, {
    url: 'https://webapi.amap.com/images/mass/mass1.png',
    anchor: [4, 4],
    size: [7, 7],
    zIndex: 2,
  }, {
    url: 'https://webapi.amap.com/images/mass/mass2.png',
    anchor: [3, 3],
    size: [5, 5],
    zIndex: 1,
  }
  ]
}
export const CircleMarkerOptions = {
  visible: true,
  zIndex: 1,
  center: null,
  radius: 10,
  strokeColor: "white", //线条颜色
  strokeOpacity: 0.5, //轮廓线透明度
  strokeWeight: 2, //轮廓线宽度
  fillColor: "#E98984FF", //圆形填充颜色
  fillOpacity: 0.5, //圆形填充透明度
  extData: null,
};
export const PolygonOptions = {
  visible: true,
  zIndex: 1,
  path: null,
  fillColor: "#ccebc5",//填充颜色
  fillOpacity: 0.5, //填充透明度
  strokeColor: "#2b8cbe", // 线条颜色
  strokeOpacity: 1, // 线条透明度
  strokeWeight: 1, //线条宽度
  strokeStyle: "dashed", // 线样式
  extData: null,
};

export const PolylineOptions = {
  visible: true,
  zIndex: 1,
  path: null,
  strokeColor: "#2b8cbe", // 线条颜色
  strokeOpacity: 1, // 线条透明度
  strokeWeight: 1, //线条宽度
  strokeStyle: "dashed", // 线样式
  lineJoin: "miter", //折线拐点的绘制样式
  lineCap: "butt", //	折线两端线帽的绘制样式
  showDir: false, //方向箭头
  extData: null,
};

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

export const LabelMarkerDataMapping = {
  position:{
    type:"LngLat",
    key:"position",
    lng:"lng",
    lat:"lat",
    label:"坐标",
    typeOptions:positionTypeOptions
  },
}

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

export const ElasticMarkerDataMapping = {
  position:{
    type:"json|LngLat",
    key:"position",
    lng:"lng",
    lat:"lat",
    label:"坐标",
    typeOptions:pathTypeOptions
  },
}



export const CircleMarkerDataMapping = {
  center:{
    type:"LngLat",
    key:"center",
    lng:"lng",
    lat:"lat",
    label:"中心点",
    typeOptions:positionTypeOptions
  },
  radius:{
    key:"radius",
    type:"number",
    label:"半径"
  }
}



export const coverOptions = [
  {
    value: coverEnum.Marker,
    label: "点标记",
  },
  {
    value: coverEnum.CircleMarker,
    label: "圆标记",
  },
  {
    value: coverEnum.LabelMarker,
    label: "海量标注",
  },
  {
    value: coverEnum.ElasticMarker,
    label: "灵活点标记",
  },
  // {
  //   value: coverEnum.MassMarks,
  //   label: "海量点标记",
  // },
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
  visible: false,
  width:320,
  height:200,
  isCustom: false,
  autoMove: true,
  avoid: true,
  closeWhenClickMap: true,
  offset:[0,-50],
  anchor: 'bottom-center',
  // size:[300,170],
  position: null,
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
export const scaleOptions={
  visible:true,
  position:"LB",
  offset:[2,2],
}
//缩放控件
export const toolBarOptions={
  visible:true,
  position:"LT",
  offset:[2,2],
}
//地图控制控件
export const controlBarOptions={
  visible:true,
  position:"LT",
  offset:[2,2],
  showControlButton:true,
}
//地图类型控件
export const mapTypeOptions={
  visible:true,
  position:"RT",
  defaultType:0,   //初始化默认图层类型。 取值为0:默认底图; 取值为1:卫星图; 默认值：0
  showTraffic:false,
  showRoad:false,
}
//鹰眼地图控件
export const hawkEyeOptions={
  visible:true,
  isOpen:true,
  position:"RB",
  autoMove:true,
  showRectangle:true,
  showButton:true,
  mapStyle:"",
  layers:[],
  width:'200px',
  height:'200px',
  offset:[2,2],
  borderStyle:"",
  borderColor:"",
  borderRadius:"2px",
  borderWidth:"2px",
  buttonSize:"20px",
}

export const controlOptions = [
  {
    value:controlEnum.Scale,
    label:"比例尺",
  },
  {
    value:controlEnum.ToolBar,
    label:"缩放",
  },
  {
    value:controlEnum.ControlBar,
    label:"地图控制",
  },
  {
    value:controlEnum.MapType,
    label:"地图类型",
  },
  {
    value:controlEnum.HawkEye,
    label:"鹰眼",
  },
]

export const controlGroupOptions = {
  id: null,
  name: "",
  visible: true,
  type:controlEnum.Scale,
  options: cloneDeep(scaleOptions),
}

export enum ControlGroupEventEnum {
  // 单击
  CLICK = 'click',
  // 鼠标进入
  MOUSE_ENTER = 'mouseover',
  // 鼠标移出
  MOUSE_LEAVE = 'mouseout',
}

function setVars({ dataKeyList }){
  if(!dataKeyList) return
  let list =  []
  dataKeyList.forEach((keyObj) => {
    list.push({
      value:"${MapsEvent.target.getExtData()." + keyObj.key + "}",
      label:keyObj.key,
      type:keyObj.type
     })
  })
  this.vars = list
}
export const ControlGroupEvents:EventsType= {
  [ControlGroupEventEnum.CLICK]: {
    key: ControlGroupEventEnum.CLICK,
    name: "单击",
    paramsName: ["MapsEvent","config", 'rootConfig'],
    vars: [],
    setVars:setVars
  },
  [ControlGroupEventEnum.MOUSE_ENTER]: {
    key: ControlGroupEventEnum.MOUSE_ENTER,
    name: "鼠标进入",
    paramsName: ["MapsEvent", "config", 'rootConfig'],
    vars: [],
    setVars:setVars
  },
  [ControlGroupEventEnum.MOUSE_LEAVE]: {
    key: ControlGroupEventEnum.MOUSE_LEAVE,
    name: "鼠标移出",
    paramsName: ["MapsEvent", "config", 'rootConfig'],
    vars: [],
    setVars:setVars
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
        click: "console.log(this);console.log(e);"
      }
    }
  },
  InfoWindow:{
    eventType:"click",
    enable: true,
    options:cloneDeep(InfoWindowOptions)
  },
  data:cloneDeep(MarkerData),
  dataMapping:cloneDeep(MarkerDataMapping),
  dataKeyList:null,
  filterNode:'datas',
  filter:"",
  dataBinding:{
    codeMode:"",
    configMode:[]
  },
};

export default class Config
  extends PublicConfigClass
  implements CreateComponentType {
  public key = MapAmapConfig.key;
  public attr = { ...chartInitConfig, w: 1000, h: 800, zIndex: -1 };
  public chartConfig = cloneDeep(MapAmapConfig);
  public option = cloneDeep(option);
  public data = cloneDeep(dataJson)
}
