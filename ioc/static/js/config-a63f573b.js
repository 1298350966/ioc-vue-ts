var m=Object.defineProperty,c=Object.defineProperties;var d=Object.getOwnPropertyDescriptors;var a=Object.getOwnPropertySymbols;var l=Object.prototype.hasOwnProperty,C=Object.prototype.propertyIsEnumerable;var e=(i,o,t)=>o in i?m(i,o,{enumerable:!0,configurable:!0,writable:!0,value:t}):i[o]=t,s=(i,o)=>{for(var t in o||(o={}))l.call(o,t)&&e(i,t,o[t]);if(a)for(var t of a(o))C.call(o,t)&&e(i,t,o[t]);return i},f=(i,o)=>c(i,d(o));var r=(i,o,t)=>(e(i,typeof o!="symbol"?o+"":o,t),t);import{r as g,O as p}from"./index-55ccac47.js";import{F as x,d as n}from"./index-4e626338.js";import"./vueRepl-a238c739.js";import"./vue-65382a1b.js";import"./lodash-f91682a1.js";import"./echarts-676dbcd6.js";import"./elementPlus-07602b2b.js";import"./vuema-115cb50e.js";import"./xgplayerVue-c27b6911.js";const h={dataset:"我是标题",textColor:"#fff",textSize:32,colors:["#1dc1f5","#1dc1f5"]};class P extends g{constructor(){super(...arguments);r(this,"key",p.key);r(this,"attr",f(s({},x),{w:500,h:70,zIndex:1}));r(this,"chartConfig",n(p));r(this,"option",n(h))}}export{P as default,h as option};