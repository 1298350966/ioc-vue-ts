import"./index-4e626338.js";/* empty css                    *//* empty css                 *//* empty css                    *//* empty css               */import"./el-tooltip-4ed993c7.js";/* empty css                  *//* empty css                     *//* empty css                  *//* empty css                        *//* empty css                 *//* empty css                        *//* empty css                     *//* empty css                  */import{_ as x}from"./SettingItem-0e9c370f.js";import{g as O}from"./config-e96d20cf.js";import{l as V}from"./lodash-f91682a1.js";import{x as B,N,Q as j,ap as A,$ as T,k as D,_ as P,P as S}from"./elementPlus-07602b2b.js";import{d as $,r as c,A as F,$ as I,o as K,c as M,a as e,w as o,h as Q,u as n,a6 as v,a0 as R,x as q}from"./vue-65382a1b.js";import"./xgplayerVue-c27b6911.js";import"./vueRepl-a238c739.js";import"./vuema-115cb50e.js";/* empty css                 *//* empty css                                                                    */const z={key:0},G={class:"grid grid-cols-2 grid-gap-10px grid-items-center"},be=$({__name:"index",props:{triggerConfig:{type:Object},targetConfig:{type:Object},mappingFieldOptions:{type:Array}},setup(d){const u=d,p=c("1"),b=c([]),a=c(V.cloneDeep(u.targetConfig.attrs));function k(){Object.assign(a.value,u.triggerConfig.updateValue.attrs)}function U(){u.triggerConfig.updateValue["body.attrs"].push({key:"",value:""})}return F(()=>{u.triggerConfig.updateValue||(u.triggerConfig.updateValue=V.cloneDeep(O)),k(),b.value=Object.keys(u.targetConfig.body.attrs).map(i=>({label:i,value:i}))}),I(()=>{u.triggerConfig.updateValue["body.attrs"]=u.triggerConfig.updateValue["body.attrs"].filter(l=>!!l.key);let i=Object.keys(a.value).filter(l=>a.value[l]!=u.targetConfig.attrs[l]);u.triggerConfig.updateValue.attrs=V.pick(a.value,i)}),(i,l)=>{const g=B,r=x,s=N,_=j,C=A,f=T,y=D,w=P,E=S;return d.triggerConfig.updateValue?(K(),M("div",z,[e(E,{modelValue:n(p),"onUpdate:modelValue":l[7]||(l[7]=t=>R(p)?p.value=t:null),class:"demo-tabs"},{default:o(()=>[e(_,{label:"弹窗设置",name:"1"},{default:o(()=>[Q("div",G,[e(r,{name:"标题"},{default:o(()=>[e(g,{modelValue:n(a).title,"onUpdate:modelValue":l[0]||(l[0]=t=>n(a).title=t)},null,8,["modelValue"])]),_:1}),e(r,{name:"宽度"},{default:o(()=>[e(g,{modelValue:n(a).width,"onUpdate:modelValue":l[1]||(l[1]=t=>n(a).width=t)},null,8,["modelValue"])]),_:1}),e(r,{name:"头部位置"},{default:o(()=>[e(g,{modelValue:n(a).top,"onUpdate:modelValue":l[2]||(l[2]=t=>n(a).top=t)},null,8,["modelValue"])]),_:1}),e(r,{name:"全屏"},{default:o(()=>[e(s,{modelValue:n(a).fullscreen,"onUpdate:modelValue":l[3]||(l[3]=t=>n(a).fullscreen=t)},null,8,["modelValue"])]),_:1}),e(r,{name:"遮罩层"},{default:o(()=>[e(s,{modelValue:n(a).modal,"onUpdate:modelValue":l[4]||(l[4]=t=>n(a).modal=t)},null,8,["modelValue"])]),_:1}),e(r,{name:"拖拽功能"},{default:o(()=>[e(s,{modelValue:n(a).draggable,"onUpdate:modelValue":l[5]||(l[5]=t=>n(a).draggable=t)},null,8,["modelValue"])]),_:1}),e(r,{name:"显示"},{default:o(()=>[e(s,{modelValue:d.triggerConfig.updateValue.show,"onUpdate:modelValue":l[6]||(l[6]=t=>d.triggerConfig.updateValue.show=t)},null,8,["modelValue"])]),_:1})])]),_:1}),e(_,{label:"组件传参",name:"2"},{default:o(()=>[e(w,{class:"w-100%",data:d.triggerConfig.updateValue["body.attrs"],border:""},{default:o(()=>[e(f,{prop:"key",label:"目标参数"},{default:o(({row:t})=>[e(C,{class:"w-100%",modelValue:t.key,"onUpdate:modelValue":m=>t.key=m,options:n(b),clearable:"","allow-create":"",filterable:""},null,8,["modelValue","onUpdate:modelValue","options"])]),_:1}),e(f,{prop:"value",label:"映射字段"},{default:o(({row:t})=>[e(C,{class:"w-100%",modelValue:t.value,"onUpdate:modelValue":m=>t.value=m,options:d.mappingFieldOptions,clearable:"","allow-create":"",filterable:""},null,8,["modelValue","onUpdate:modelValue","options"])]),_:1}),e(f,{width:"60",label:"操作"},{default:o(({row:t,$index:m})=>[e(y,{type:"danger",link:"",onClick:H=>d.triggerConfig.updateValue["body.attrs"].splice(m,1)},{default:o(()=>[v("删除")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"]),e(y,{class:"w-100% mt-2",onClick:U},{default:o(()=>[v(" 添加参数设置")]),_:1})]),_:1})]),_:1},8,["modelValue"])])):q("",!0)}}});export{be as default};