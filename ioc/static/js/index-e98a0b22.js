import{_ as x}from"./index.vue_vue_type_script_setup_true_lang-2fcb1adb.js";import{_ as B}from"./InfoWindow.vue_vue_type_script_setup_true_lang-18ca35cd.js";import{_ as w}from"./index.vue_vue_type_script_setup_true_lang-9b376413.js";import{u as T}from"./useBmapHooks-4161bd26.js";import{d as b,p as I,a7 as M,g as q,o,c as n,a as E,w as G,F as a,q as s,s as c,u as e,x as u}from"./vue-65382a1b.js";import{q as O}from"./vue3BaiduMapGl-635dd965.js";import"./config-502f40fc.js";import"./index-55ccac47.js";import"./vueRepl-a238c739.js";import"./lodash-f91682a1.js";import"./index-4e626338.js";import"./elementPlus-07602b2b.js";import"./vuema-115cb50e.js";import"./xgplayerVue-c27b6911.js";import"./echarts-676dbcd6.js";import"./useAddEvent.kooks-e46e3810.js";import"./axios-ba46900f.js";import"./axios-e76ab20a.js";import"./useEvent.hook-afeb4a8c.js";const Y=b({__name:"index",props:{chartConfig:{type:Object,required:!0}},setup(i){const f=i;HTMLCanvasElement.prototype.getContext=function(p){return function(m,t){return m==="webgl"&&(t=Object.assign({},t,{preserveDrawingBuffer:!0})),p.call(this,m,t)}}(HTMLCanvasElement.prototype.getContext);const l=T();I("mapIns",l);let{mapKey:g,mapLog:d,mapLat:h,mapZindex:C,pitch:y,heading:k,mapType:v}=M(f.chartConfig.option.mapOptions);const _=q(()=>({lng:d.value,lat:h.value}));function L({map:p,BmapGL:m,instance:t}){l.setMap(p)}return(p,m)=>(o(),n("div",null,[E(e(O),{ak:e(g),center:e(_),zoom:e(C),tilt:e(y),heading:e(k),mapType:e(v),height:"100%",enableScrollWheelZoom:"",onInitd:L},{default:G(()=>[(o(!0),n(a,null,s(i.chartConfig.option.controlGroupList,(t,r)=>(o(),c(e(w),{key:r,config:t},null,8,["config"]))),128)),(o(!0),n(a,null,s(i.chartConfig.option.coverGroupList,(t,r)=>(o(),n(a,{key:r},[t.visible?(o(),c(e(x),{key:0,config:t},null,8,["config"])):u("",!0)],64))),128)),(o(!0),n(a,null,s(i.chartConfig.option.InfoWindowList,(t,r)=>(o(),n(a,{key:r},[t.visible?(o(),c(e(B),{key:0,config:t},null,8,["config"])):u("",!0)],64))),128))]),_:1},8,["ak","center","zoom","tilt","heading","mapType"])]))}});export{Y as default};