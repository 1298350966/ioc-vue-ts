var $=Object.defineProperty;var y=Object.getOwnPropertySymbols;var j=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var h=(e,t,o)=>t in e?$(e,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):e[t]=o,g=(e,t)=>{for(var o in t||(t={}))j.call(t,o)&&h(e,o,t[o]);if(y)for(var o of y(t))q.call(t,o)&&h(e,o,t[o]);return e};import"./index-4e626338.js";/* empty css                    */import{_ as z}from"./index-806da9dd.js";/* empty css                 */import"./el-collapse-item-4ed993c7.js";/* empty css                *//* empty css                  */import{d as M,r as c,al as R,o as d,s as U,w as s,a,y as G,k as H,z as L,c as w,F as O,q as A,u as n,h as r,l as f,a6 as m,G as J,H as K}from"./vue-65382a1b.js";import{u as Q}from"./useTargetData.hook-7e83673b.js";import{_ as W}from"./hCode-f0cdea69.js";import{F as X}from"./FunEditor-b02dfd0c.js";import{a_ as k,a$ as D,b0 as b}from"./index-55ccac47.js";import{k as Y,p as Z,U as ee,n as te,T as oe}from"./elementPlus-07602b2b.js";import{_ as ae}from"./xgplayerVue-c27b6911.js";import"./vueRepl-a238c739.js";import"./lodash-f91682a1.js";import"./vuema-115cb50e.js";/* empty css                   */import"./chartEditStore-8641b951.js";import"./plugin-68db7aa1.js";import"./highlight-87778b4e.js";/* empty css                *//* empty css                     *//* empty css                    */import"./EditorWorker.vue_vue_type_script_setup_true_lang-44860150.js";import"./editorWorker-7e4b3ef6.js";import"./echarts-676dbcd6.js";const x=e=>(J("data-v-f3eefd85"),e=e(),K(),e),se={class:"func-annotate"},ne=x(()=>r("br",null,null,-1)),le={class:"func-keyword"},re={class:"go-ml-4"},pe=x(()=>r("p",null,[m("}"),r("span",null,",")],-1)),ie=M({__name:"events",props:{optionData:{type:Object,required:!0}},setup(e){const t=e,{targetData:o,chartEditStore:ce}=Q(),C=c(!0),p=c(!1);let S=c(g({},t.optionData.events));const v=()=>{p.value=!1},E=c(null),B=()=>{var _;(_=E.value)==null||_.saveEvents()};return(_,i)=>{const T=R("Edit"),u=Y,V=Z,F=ee,I=te,N=z,P=oe;return d(),U(P,null,{default:s(()=>[a(F,{title:"组件事件"},{default:s(()=>[a(V,{class:"collapse-show-box",shadow:"never"},{default:s(()=>[G(a(u,{class:"edit",text:"",circle:"",type:"primary",size:"small",onClick:i[0]||(i[0]=H(l=>p.value=!0,["stop"]))},{default:s(()=>[a(T,{style:{width:"15px",height:"15px"}})]),_:1},512),[[L,C.value]]),(d(!0),w(O,null,A(n(k),l=>(d(),w("div",{key:l},[r("p",null,[r("span",se,"// "+f(n(D)[l]),1),ne,r("span",le,"async "+f(l),1),m(" ("+f(n(b)[l].join(","))+") { ",1)]),r("p",re,[a(n(W),{code:(e.optionData.events||{})[l]||"",language:"typescript"},null,8,["code"])]),pe]))),128))]),_:1})]),_:1}),a(N,{"custom-class":"FunEditorDialog",modelValue:p.value,"onUpdate:modelValue":i[1]||(i[1]=l=>p.value=l),title:"组件事件编辑器"},{footer:s(()=>[a(I,null,{default:s(()=>[a(u,{onClick:v},{default:s(()=>[m("取消")]),_:1}),a(u,{type:"primary",onClick:B},{default:s(()=>[m("保存")]),_:1})]),_:1})]),default:s(()=>[a(X,{ref_key:"funEditorRef",ref:E,baseEvent:n(S),eventTypeName:n(D),eventParamsName:n(b),baseEventEnum:n(k),targetData:n(o),onClose:v},null,8,["baseEvent","eventTypeName","eventParamsName","baseEventEnum","targetData"])]),_:1},8,["modelValue"])]),_:1})}}});const Me=ae(ie,[["__scopeId","data-v-f3eefd85"]]);export{Me as default};