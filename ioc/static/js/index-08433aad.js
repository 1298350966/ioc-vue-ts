import{_ as I}from"./index-806da9dd.js";import{J as B,c as D}from"./index-4e626338.js";/* empty css                  *//* empty css                *//* empty css                     *//* empty css                    */import{v as T}from"./vueTianditu-951bb72c.js";import"./config-1dd32ed9.js";import"./axios-ba46900f.js";import"./echarts-676dbcd6.js";import"./lodash-f91682a1.js";import{I as W}from"./InfoWindow-4d917a69.js";import{u as q}from"./useTmapHooks-5b18dea0.js";import{d as E,p as k,a7 as j,g as v,o as b,s as P,w as l,a as e,u as m,r as M,c as S,h as O,a0 as y,F as J,q as A,x as H,b as K,a6 as L}from"./vue-65382a1b.js";/* empty css                */import{_ as z}from"./EditorWorker.vue_vue_type_script_setup_true_lang-44860150.js";/* empty css                 *//* empty css               *//* empty css                  *//* empty css                  *//* empty css                        *//* empty css                  */import{_ as F}from"./SettingItem-0e9c370f.js";import{x as R,N as X,ae as Y,a3 as $,a2 as G,p as Q,an as Z,Q as h,P as ee,i as oe,ao as ne,al as te,k as le}from"./elementPlus-07602b2b.js";import{_ as ae}from"./xgplayerVue-c27b6911.js";/* empty css                   */import"./vueRepl-a238c739.js";import"./vuema-115cb50e.js";import"./vuedraggable-26823587.js";import"./index-55ccac47.js";import"./axios-e76ab20a.js";import"./editorWorker-7e4b3ef6.js";/* empty css                 *//* empty css                                                                    */const ie=E({__name:"previewMap",props:{optionData:{type:Object,required:!0},config:{type:Object,required:!0}},setup(t){const i=t,r=q();k("mapIns",r);let{mapKey:d,mapStyleKey:x,mapLng:f,mapLat:p,mapZindex:s,mapStyleKeyCustom:_}=j(i.optionData.mapOptions);const u=v(()=>[f.value,p.value]),o=v(()=>({v:"4.0",tk:d.value}));function g(a){r.setMap(a),i.config.position=u,i.config.visible=!0}return(a,V)=>(b(),P(m(T.TdtMap),{center:m(u),zoom:m(s),loadConfig:m(o),mapStyle:m(x),onInit:g},{default:l(()=>[e(m(W),{config:t.config},null,8,["config"])]),_:1},8,["center","zoom","loadConfig","mapStyle"]))}}),ue={class:"InfoWindowConfig"},me={class:"kh-g-2"},de={class:"kh-g-2"},se=E({__name:"InfoWindowConfig",props:{config:{type:Object,required:!0}},setup(t){const i=t,r=[{value:"component",label:"内部组件"},{value:"iframe",label:"嵌入页面"}],d=M(B(i.config.content.component.attrs));function x(){try{i.config.content.component.attrs=D(d.value)}catch(u){d.value=JSON.stringify(i.config.content.component.attrs)}}const f=v({get(){return i.config.offset[0]},set(u){i.config.offset[0]=u}}),p=v({get(){return i.config.offset[1]},set(u){i.config.offset[1]=u}}),s=v({get(){return i.config.autoPanPadding[0]},set(u){i.config.autoPanPadding[0]=u}}),_=v({get(){return i.config.autoPanPadding[1]},set(u){i.config.autoPanPadding[1]=u}});return(u,o)=>{const g=R,a=F,V=X,c=Y,C=$,U=G,N=z,w=Q;return b(),S("div",ue,[e(a,{name:"窗体名称"},{default:l(()=>[e(g,{modelValue:t.config.name,"onUpdate:modelValue":o[0]||(o[0]=n=>t.config.name=n)},null,8,["modelValue"])]),_:1}),e(a,{name:"是否显示"},{default:l(()=>[e(V,{modelValue:t.config.visible,"onUpdate:modelValue":o[1]||(o[1]=n=>t.config.visible=n)},null,8,["modelValue"])]),_:1}),e(a,{name:"最小宽度"},{default:l(()=>[e(c,{modelValue:t.config.minWidth,"onUpdate:modelValue":o[2]||(o[2]=n=>t.config.minWidth=n)},null,8,["modelValue"])]),_:1}),e(a,{name:"最大宽度"},{default:l(()=>[e(c,{modelValue:t.config.maxWidth,"onUpdate:modelValue":o[3]||(o[3]=n=>t.config.maxWidth=n)},null,8,["modelValue"])]),_:1}),e(a,{name:"最大高度"},{default:l(()=>[e(c,{modelValue:t.config.maxHeight,"onUpdate:modelValue":o[4]||(o[4]=n=>t.config.maxHeight=n)},null,8,["modelValue"])]),_:1}),e(a,{name:"是否开启信息窗口打开时地图自动移动"},{default:l(()=>[e(V,{modelValue:t.config.autoPan,"onUpdate:modelValue":o[5]||(o[5]=n=>t.config.autoPan=n)},null,8,["modelValue"])]),_:1}),e(a,{name:"控制弹出窗口中出现的关闭按钮"},{default:l(()=>[e(V,{modelValue:t.config.closeButton,"onUpdate:modelValue":o[6]||(o[6]=n=>t.config.closeButton=n)},null,8,["modelValue"])]),_:1}),e(a,{name:"偏移量"},{default:l(()=>[O("div",me,[e(c,{modelValue:m(f),"onUpdate:modelValue":o[7]||(o[7]=n=>y(f)?f.value=n:null)},null,8,["modelValue"]),e(c,{modelValue:m(p),"onUpdate:modelValue":o[8]||(o[8]=n=>y(p)?p.value=n:null)},null,8,["modelValue"])])]),_:1}),e(a,{name:"边距"},{default:l(()=>[O("div",de,[e(c,{modelValue:m(s),"onUpdate:modelValue":o[9]||(o[9]=n=>y(s)?s.value=n:null)},null,8,["modelValue"]),e(c,{modelValue:m(_),"onUpdate:modelValue":o[10]||(o[10]=n=>y(_)?_.value=n:null)},null,8,["modelValue"])])]),_:1}),e(a,{name:"是否开启点击地图关闭信息窗口"},{default:l(()=>[e(V,{modelValue:t.config.closeOnClick,"onUpdate:modelValue":o[11]||(o[11]=n=>t.config.closeOnClick=n)},null,8,["modelValue"])]),_:1}),e(a,{name:"类型"},{default:l(()=>[e(U,{modelValue:t.config.content.type,"onUpdate:modelValue":o[12]||(o[12]=n=>t.config.content.type=n)},{default:l(()=>[(b(),S(J,null,A(r,n=>e(C,{key:n.value,label:n.label,value:n.value},null,8,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1}),t.config.content.type==="component"?(b(),P(a,{key:0,name:"组件名称"},{default:l(()=>[e(g,{modelValue:t.config.content.component.is,"onUpdate:modelValue":o[13]||(o[13]=n=>t.config.content.component.is=n)},null,8,["modelValue"])]),_:1})):t.config.content.type==="iframe"?(b(),P(a,{key:1,name:"链接地址"},{default:l(()=>[e(g,{modelValue:t.config.content.iframe.src,"onUpdate:modelValue":o[14]||(o[14]=n=>t.config.content.iframe.src=n)},null,8,["modelValue"])]),_:1})):H("",!0),e(a,{name:"组件传参"},{default:l(()=>[e(w,{"body-style":"padding:0"},{default:l(()=>[e(N,{height:"300px",modelValue:m(d),"onUpdate:modelValue":o[15]||(o[15]=n=>y(d)?d.value=n:null),language:"json",editorOptions:{lineNumbers:"off",lineDecorationsWidth:-20,minimap:{enabled:!1}},onBlur:x},null,8,["modelValue"])]),_:1})]),_:1})])}}}),re=E({__name:"index",props:{modelValue:{type:Boolean,required:!0},config:{type:Object,required:!0},optionData:{type:Object,required:!0}},emits:["update:modelValue","save"],setup(t,{emit:i}){const r=t;k("coverGroupConfig",r.config);const d=v({get(){return r.modelValue},set(p){i("update:modelValue",p)}});function x(){i("save",r.config)}const f=K({activeName:"1"});return(p,s)=>{const _=Z,u=h,o=ee,g=oe,a=ne,V=te,c=le,C=I;return b(),P(C,{title:"信息窗体配置",modelValue:m(d),"onUpdate:modelValue":s[1]||(s[1]=U=>y(d)?d.value=U:null),width:"75%",top:"10vh"},{footer:l(()=>[e(c,{type:"primary",onClick:x},{default:l(()=>[L("保存")]),_:1})]),default:l(()=>[e(V,{class:"container"},{default:l(()=>[e(_,{style:{padding:"0"}},{default:l(()=>[e(ie,{optionData:t.optionData,config:r.config},null,8,["optionData","config"])]),_:1}),e(a,{width:"350px",class:"aside"},{default:l(()=>[e(g,null,{default:l(()=>[e(o,{modelValue:m(f).activeName,"onUpdate:modelValue":s[0]||(s[0]=U=>m(f).activeName=U),class:"demo-tabs"},{default:l(()=>[e(u,{label:"配置",name:"1"},{default:l(()=>[e(se,{config:t.config},null,8,["config"])]),_:1})]),_:1},8,["modelValue"])]),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"])}}});const Re=ae(re,[["__scopeId","data-v-ec1d1125"]]);export{Re as default};