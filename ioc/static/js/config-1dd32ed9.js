var J=Object.defineProperty,b=Object.defineProperties;var d=Object.getOwnPropertyDescriptors;var D=Object.getOwnPropertySymbols;var f=Object.prototype.hasOwnProperty,N=Object.prototype.propertyIsEnumerable;var s=(a,t,i)=>t in a?J(a,t,{enumerable:!0,configurable:!0,writable:!0,value:i}):a[t]=i,L=(a,t)=>{for(var i in t||(t={}))f.call(t,i)&&s(a,i,t[i]);if(D)for(var i of D(t))N.call(t,i)&&s(a,i,t[i]);return a},T=(a,t)=>b(a,d(t));var A=(a,t,i)=>(s(a,typeof t!="symbol"?t+"":t,i),i);import{r as Y,v as r,t as X}from"./index-55ccac47.js";import{F as Z,d as o}from"./index-4e626338.js";const G=[{name:"某某地市",value:10,position:[116.300467,39.907761]},{name:"某某地市",value:15,position:[116.400567,39.908761]},{name:"某某地市",value:20,position:[116.200467,39.937761]}],W={markers:G};var n=(a=>(a.Marker="Marker",a.Polygon="Polygon",a.Circle="Circle",a.Polyline="Polyline",a))(n||{}),O=(a=>(a.NORMAL="",a.BLACK="black",a.INDIGO="indigo",a))(O||{}),_=(a=>(a.Zoom="Zoom",a.Scale="Scale",a.Copyright="Copyright",a.OverviewMap="OverviewMap",a.mapType="MapType",a))(_||{}),e=(a=>(a.SLDT_LNGLAT_SHADOW="矢量底图经纬度投影",a.SLDT_MOKATUO_SHADOW="矢量底图球面墨卡托投影",a.SLZJ_LNGLAT_SHADOW="矢量注记经纬度投影",a.SLZJ_MOKATUO_SHADOW="矢量注记墨卡托投影",a.YXDT_LNGLAT_SHADOW="影像底图经纬度投影",a.YXDT_MOKATUO_SHADOW="影像底图墨卡托投影",a.YXZJ_LNGLAT_SHADOW="影像注记经纬度投影",a.YXZJ_MOKATUO_SHADOW="影像注记墨卡托投影",a.DXYX_LNGLAT_SHADOW="地形晕渲经纬度投影",a.DXYX_MOKATUO_SHADOW="地形晕渲墨卡托投影",a.DXZJ_LNGLAT_SHADOW="地形注记经纬度投影",a.DXZJ_MOKATUO_SHADOW="地形注记墨卡托投影",a.QQJJ_LNGLAT_SHADOW="全球境界经纬度投影",a.QQJJ_MOKATUO_SHADOW="全球境界墨卡托投影",a.SLYWZJ_LNGLAT_SHADOW="矢量英文注记经纬度投影",a.SLYWZJ_MOKATUO_SHADOW="矢量英文注记墨卡托投影",a.YXYWZJ_LNGLAT_SHADOW="影像英文注记经纬度投影",a.YXYWZJ_MOKATUO_SHADOW="影像英文注记墨卡托投影",a))(e||{}),l=(a=>(a.SLDT_LNGLAT_SHADOW="vec_c",a.SLDT_MOKATUO_SHADOW="vec_w",a.SLZJ_LNGLAT_SHADOW="cva_c",a.SLZJ_MOKATUO_SHADOW="cva_w",a.YXDT_LNGLAT_SHADOW="img_c",a.YXDT_MOKATUO_SHADOW="img_w",a.YXZJ_LNGLAT_SHADOW="cia_c",a.YXZJ_MOKATUO_SHADOW="cia_w",a.DXYX_LNGLAT_SHADOW="ter_c",a.DXYX_MOKATUO_SHADOW="ter_w",a.DXZJ_LNGLAT_SHADOW="cta_c",a.DXZJ_MOKATUO_SHADOW="cta_w",a.QQJJ_LNGLAT_SHADOW="ibo_c",a.QQJJ_MOKATUO_SHADOW="ibo_w",a.SLYWZJ_LNGLAT_SHADOW="eva_c",a.SLYWZJ_MOKATUO_SHADOW="eva_w",a.YXYWZJ_LNGLAT_SHADOW="eia_c",a.YXYWZJ_MOKATUO_SHADOW="eia_w",a))(l||{});const p=[{position:[116.406315,39.908775],lng:"116.406315",lat:"39.908775"},{position:[116.156782,39.910151],lng:"116.156782",lat:"39.910151"},{position:[116.196887,39.809312],lng:"116.196887",lat:"39.809312"}],v={dataset:W,mapOptions:{pitch:60,skyColor:"#53A9DE",mapKey:"ce5a88c3140fe5ed788f757afdab0f77",mapStyleKey:O.NORMAL,mapStyleKeyCustom:"",mapLng:116.3987,mapLat:39.8947,mapZindex:13},mask:{enable:!1,outer:[[-360,90],[-360,-90],[360,-90],[360,90]],path:[],polygonOptions:{visible:!0,path:[[[-360,90],[-360,-90],[360,-90],[360,90]],[[116.36169,39.9279],[116.40461,39.9279],[116.44444,39.92633],[116.44478,39.87707],[116.36307,39.87681]]],color:"#ccebc5",weight:3,opacity:.5,lineStyle:"solid",edit:!1,extData:null}},coverGroupList:[],InfoWindowList:[],controlGroupList:[]},g={visible:!0,zIndexOffset:1,position:null,icon:"",title:"",opacity:1,draggable:!1,extData:null},k={visible:!0,color:"#2b8cbe",weight:3,opacity:.5,fillColor:"#0000FF",fillOpacity:.2,lineStyle:"solid",center:null,radius:10,edit:!1,extData:null},P={visible:!0,color:"#2b8cbe",weight:3,opacity:.5,fillColor:"#0000FF",fillOpacity:.2,lineStyle:"solid",path:null,edit:!1,extData:null},h={visible:!0,color:"#2b8cbe",weight:3,opacity:.5,lineStyle:"solid",path:null,edit:!1,extData:null},U=[{value:n.Marker,label:"点标记"},{value:n.Circle,label:"圆标记"},{value:n.Polygon,label:"多边形"},{value:n.Polyline,label:"折线"}],c=[{value:"LngLat",label:"LngLat对象"},{value:"LngLatArray",label:"LngLat数组"}],M={position:{type:"LngLat",key:"position",lng:"lng",lat:"lat",label:"坐标",typeOptions:c}},w={position:{type:"LngLat",key:"center",lng:"lng",lat:"lat",label:"坐标",typeOptions:c},radius:{key:"radius",type:"number",label:"半径"}},u={position:{type:"LngLat",key:"position",lng:"lng",lat:"lat",label:"坐标",typeOptions:c}},I={position:{type:"LngLat",key:"position",lng:"lng",lat:"lat",label:"坐标",typeOptions:c}},Q={id:null,name:"",visible:!0,type:n.Marker,options:o(g),dataset:p,request:o(X),events:{configEvents:{componentEvents:[]},codeEvents:{baseEvent:{click:"console.log(this);console.log(data);console.log(e);"}}},data:o(p),dataMapping:o(M),filterNode:"datas",filter:""},x={id:null,name:"",visible:!1,minWidth:50,maxWidth:300,maxHeight:null,autoPan:!1,closeButton:!0,offset:[0,7],autoPanPadding:[5,5],closeOnClick:!1,content:{type:"component",component:{is:"",attrs:{}},iframe:{src:""}},position:null,extData:null},R=[{value:O.NORMAL,label:"标准"},{value:O.BLACK,label:"幻影黑"},{value:O.INDIGO,label:"靛蓝色"}],z=[{value:l.SLDT_LNGLAT_SHADOW,label:e.SLDT_LNGLAT_SHADOW},{value:l.SLDT_MOKATUO_SHADOW,label:e.SLDT_MOKATUO_SHADOW},{value:l.SLZJ_LNGLAT_SHADOW,label:e.SLZJ_LNGLAT_SHADOW},{value:l.SLZJ_MOKATUO_SHADOW,label:e.SLZJ_MOKATUO_SHADOW},{value:l.YXDT_LNGLAT_SHADOW,label:e.YXDT_LNGLAT_SHADOW},{value:l.YXDT_MOKATUO_SHADOW,label:e.YXDT_MOKATUO_SHADOW},{value:l.YXZJ_LNGLAT_SHADOW,label:e.YXZJ_LNGLAT_SHADOW},{value:l.YXZJ_MOKATUO_SHADOW,label:e.YXZJ_MOKATUO_SHADOW},{value:l.DXYX_LNGLAT_SHADOW,label:e.DXYX_LNGLAT_SHADOW},{value:l.DXYX_MOKATUO_SHADOW,label:e.DXYX_MOKATUO_SHADOW},{value:l.DXZJ_LNGLAT_SHADOW,label:e.DXZJ_LNGLAT_SHADOW},{value:l.DXZJ_MOKATUO_SHADOW,label:e.DXZJ_MOKATUO_SHADOW},{value:l.QQJJ_LNGLAT_SHADOW,label:e.QQJJ_LNGLAT_SHADOW},{value:l.QQJJ_MOKATUO_SHADOW,label:e.QQJJ_MOKATUO_SHADOW},{value:l.SLYWZJ_LNGLAT_SHADOW,label:e.SLYWZJ_LNGLAT_SHADOW},{value:l.SLYWZJ_MOKATUO_SHADOW,label:e.SLYWZJ_MOKATUO_SHADOW},{value:l.YXYWZJ_LNGLAT_SHADOW,label:e.YXYWZJ_LNGLAT_SHADOW},{value:l.YXYWZJ_MOKATUO_SHADOW,label:e.YXYWZJ_MOKATUO_SHADOW}],S={position:"topleft",zoomInText:"+",zoomOutText:"-",zoomInTitle:"放大",zoomOutTitle:"缩小"},K={position:"bottomleft"},y={position:"bottomleft",id:"",content:"",bounds:[]},B={position:"bottomright",isOpen:"false"},F={position:"topright",mapTypes:["TMAP_NORMAL_MAP"]},j=[{title:"地图",icon:"http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png",layer:"TMAP_NORMAL_MAP"},{title:"卫星",icon:" http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png",layer:"TMAP_SATELLITE_MAP"},{title:"卫星混合",icon:"http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png",layer:"TMAP_HYBRID_MAP"},{title:"地形",icon:"http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrain.png",layer:"TMAP_TERRAIN_MAP"},{title:"地形混合",icon:"http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrainpoi.png",layer:"TMAP_TERRAIN_HYBRID_MAP"}],q=[{value:_.Zoom,label:"缩放"},{value:_.Scale,label:"比例尺"},{value:_.Copyright,label:"版权"},{value:_.OverviewMap,label:"鹰眼地图"},{value:_.mapType,label:"地图类型"}],V={id:null,name:"",visible:!0,type:_.Zoom,options:o(S)};var H=(a=>(a.CLICK="click",a.MOUSE_ENTER="mouseenter",a.MOUSE_LEAVE="mouseleave",a))(H||{});const $={click:{key:"click",name:"单击",paramsName:["MapsEvent","config","rootConfig"],vars:[]},mouseenter:{key:"mouseenter",name:"鼠标进入",paramsName:["MapsEvent","config","rootConfig"],vars:[]},mouseleave:{key:"mouseleave",name:"鼠标移出",paramsName:["MapsEvent","config","rootConfig"],vars:[]}};class C extends Y{constructor(){super(...arguments);A(this,"key",r.key);A(this,"attr",T(L({},Z),{w:1e3,h:800,zIndex:-1}));A(this,"chartConfig",o(r));A(this,"option",o(v));A(this,"data",o(W))}}const ea=Object.freeze(Object.defineProperty({__proto__:null,CircleDataMapping:w,CircleOptions:k,ControlGroupEventEnum:H,ControlGroupEvents:$,InfoWindowOptions:x,MarkerDataMapping:M,MarkerOptions:g,PolygonMapping:u,PolygonOptions:P,PolylineDataMapping:I,PolylineOptions:h,controlGroupOptions:V,controlOptions:q,copyrightOptions:y,coverGroupOptions:Q,coverOptions:U,default:C,mapStyleKeyCustomOptions:z,mapTypeOptions:F,mapTypeSelectOptions:j,option:v,overviewMapOptions:B,scaleOptions:K,themeOptions:R,zoomOptions:S},Symbol.toStringTag,{value:"Module"}));export{$ as C,x as I,g as M,h as P,V as a,n as b,Q as c,j as d,U as e,q as f,I as g,P as h,k as i,w as j,p as k,M as l,z as m,_ as n,F as o,B as p,y as q,ea as r,K as s,R as t,S as z};