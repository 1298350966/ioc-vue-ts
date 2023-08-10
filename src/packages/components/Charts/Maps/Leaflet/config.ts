import { PublicConfigClass, requestConfig } from "@/packages/public";
import { CreateComponentType, EventsType } from "@/packages/index.d";
import { LeafletConfig } from "./index";
import { chartInitConfig } from "@/settings/designSetting";
import cloneDeep from "lodash/cloneDeep";
import {CoverGroupType } from '@/packages/index.d'
import MarkerData from "./json/MarkerData.json";



export enum MarkerEnum {
  // 圆圈
  CIRCLE_MARKER = "CircleMarker",
  // 定位标点
  MARKER = "Marker",
  // 暂无
  NONE = "none",
}

export const option = {
  dataset: null,
  mapOptions: {
    mapLog: 115.840466,
    mapLat: 28.736469,
    // center:[28.736469, 115.840466],
    // bounds:null,
    // maxBounds:null,
    zoom:11,
    // minZoom:null,
    // maxZoom:null,
    inertia:true, //平移惯性
    zoomAnimation:true, //缩放动画
    fadeAnimation:true, //淡入淡出动画
  },
  tileLayer:{
    visible:true,
    name:"",
    url:"https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
  },
  coverGroupList: [],
  InfoWindowList: [],
  controlGroupList:[],
};



export enum coverEnum {
  Marker = "Marker",
  Polygon = "Polygon",
  CircleMarker = "CircleMarker",
  Polyline = "Polyline"
}

export const MarkerOptions = {
  
  visible: true,
  zIndexOffset: 1,
  latLng: null,
  pane:"markerPane", //Map pane将在其中添加标记图标
  draggable:false,
  options:{
    shadowPane:"shadowPane", //Map pane将添加标记阴影的位置
  },
  opacity:1,
  icon:{
    iconUrl:"//a.amap.com/jsapi_demos/static/demo-center/icons/poi-marker-default.png",
    iconSize:[40,65],
    iconAnchor:[20, 65],
  },
  extData: null,
};

export const CircleMarkerOptions = {
  visible: true,
  pane:'markerPane',
  name:"",
  latLng: null,
  radius: 10,
  stroke:true ,//是否沿路径绘制边框
  color: "white", //线条颜色
  opacity: 0.5, //轮廓线透明度
  weight: 2, //轮廓线宽度
  fill:true,
  fillColor: "#E98984FF", //圆形填充颜色
  fillOpacity: 0.5, //圆形填充透明度
  extData: null,
};
export const PolygonOptions = {
  visible: true,
  pane:"overlayPane",
  latLngs: null,
  fill:true,
  fillColor: "#ccebc5",//填充颜色
  fillOpacity: 0.5, //填充透明度
  fillRule:"evenodd",
  stroke:true,
  color: "#2b8cbe", // 线条颜色
  opacity: 1, // 线条透明度
  weight: 1, //线条宽度
  extData: null,
};

export const PolylineOptions = {
  visible: true,
  pane: 'overlayPane',
  latLngs: null,
  stroke:true,
  color: "#2b8cbe", // 线条颜色
  opacity: 1, // 线条透明度
  weight: 1, //线条宽度
  fill:true,
  fillColor: "#ccebc5",//填充颜色
  fillOpacity: 0.5, //填充透明度
  fillRule:"evenodd",
  lineJoin: "miter", //折线拐点的绘制样式
  lineCap: "butt", //	折线两端线帽的绘制样式
  noClip: false, //方向箭头
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
  latLng:{
    type:"LngLat",
    key:"latLng",
    lng:"lng",
    lat:"lat",
    label:"坐标",
    typeOptions:positionTypeOptions
  },  
}


export const PolygonDataMapping = {
  latLngs:{
    type:"array|LngLatArray",
    key:"path",
    lng:"lng",
    lat:"lat",
    label:"路径",
    typeOptions:pathTypeOptions
  },
}

export const PolylineDataMapping = {
  latLngs:{
    type:"array|LngLatArray",
    key:"path",
    lng:"lng",
    lat:"lat",
    label:"路径",
    typeOptions:pathTypeOptions
  },
}







export const CircleMarkerDataMapping = {
  latLng:{
    type:"LngLat",
    key:"latLng",
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
    value: coverEnum.Polygon,
    label: "多边形",
  },
  {
    value: coverEnum.Polyline,
    label: "折线",
  },
];

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

export const InfoWindowOptions = {
  id: null,
  name: "",
  visible: false,
  latLng: null,
  offset:[0,-50],
  width:320,
  height:200,
  minWidth:50,
  maxWidth:500,
  maxHeight:null,
  closeButton:true,
  autoClose:false,
  closeOnClick:true,
  className:"",
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
    codeEvents:{
      baseEvent: {
        click: ""
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
  public key = LeafletConfig.key;
  public attr = { ...chartInitConfig, w: 1000, h: 800, zIndex: -1 };
  public chartConfig = cloneDeep(LeafletConfig);
  public option = cloneDeep(option);
  public data = null
}
