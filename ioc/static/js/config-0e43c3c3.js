import"./index-4e626338.js";/* empty css                    *//* empty css                 *//* empty css                *//* empty css                  *//* empty css               *//* empty css                     *//* empty css                  *//* empty css                        *//* empty css                     */import{d as E,g as x,al as v,o as f,s as O,w as e,a as t,u as l,c as I,F as B,q as S,h as _,l as h,k as y}from"./vue-65382a1b.js";import{_ as V}from"./CollapseItem.vue_vue_type_script_setup_true_name_CollapseItem_lang-3e00f931.js";import{_ as i}from"./SettingItem-0e9c370f.js";import{_ as d}from"./SettingItemBox-ce5066ee.js";/* empty css                        *//* empty css                        *//* empty css                  */import"./el-collapse-item-4ed993c7.js";/* empty css                 *//* empty css                   *//* empty css                                                                  *//* empty css                  */import"./el-tooltip-4ed993c7.js";/* empty css                        */import"./chartEditStore-8641b951.js";import"./vuedraggable-26823587.js";import{_ as j}from"./InputStyleSetting.vue_vue_type_script_setup_true_lang-aae56315.js";import{ap as L,N as M,w as N,x as q,T as F}from"./elementPlus-07602b2b.js";import{_ as P}from"./xgplayerVue-c27b6911.js";import"./vueRepl-a238c739.js";import"./lodash-f91682a1.js";import"./vuema-115cb50e.js";/* empty css                                                                    */import"./index-55ccac47.js";import"./echarts-676dbcd6.js";import"./plugin-68db7aa1.js";const T={label:"选项",value:"0"},A={config:T},G={class:"title-container"},H=E({__name:"config",props:{optionData:{type:Object,required:!0}},setup(n){const r=n;function C(g,a){let s=r.optionData.listOptions.length,{config:m}=A,c=Object.assign({},m,{value:String(s+1),label:m.label+(s+1)});r.optionData.listOptions.push(c)}function k(g,a){r.optionData.listOptions.splice(a,1)}const U=x(()=>r.optionData.listOptions),w=[{label:"小号",value:"small"},{label:"默认",value:"default"},{label:"大号",value:"large"}];return(g,a)=>{const s=L,m=M,c=v("Plus"),D=N,z=v("Minus"),b=q,$=F;return f(),O($,null,{default:e(()=>[t(l(V),{name:"配置",expanded:!0},{default:e(()=>[t(l(d),{name:"默认值",alone:!0},{default:e(()=>[t(l(i),null,{default:e(()=>[t(s,{modelValue:n.optionData.modelValue,"onUpdate:modelValue":a[0]||(a[0]=o=>n.optionData.modelValue=o),size:"small",options:l(U),clearable:""},null,8,["modelValue","options"])]),_:1})]),_:1}),t(l(d),null,{default:e(()=>[t(l(i),{name:"是否禁用"},{default:e(()=>[t(m,{modelValue:n.optionData.attrs.disabled,"onUpdate:modelValue":a[1]||(a[1]=o=>n.optionData.attrs.disabled=o)},null,8,["modelValue"])]),_:1}),t(l(i),{name:"是否显示边框"},{default:e(()=>[t(m,{modelValue:n.optionData.attrs.border,"onUpdate:modelValue":a[2]||(a[2]=o=>n.optionData.attrs.border=o)},null,8,["modelValue"])]),_:1})]),_:1})]),_:1}),t(l(V),{name:"样式",expanded:!0},{default:e(()=>[t(l(d),{name:"控件尺寸",alone:!0},{default:e(()=>[t(l(i),null,{default:e(()=>[t(s,{modelValue:n.optionData.attrs.size,"onUpdate:modelValue":a[3]||(a[3]=o=>n.optionData.attrs.size=o),size:"small",options:w},null,8,["modelValue"])]),_:1})]),_:1}),t(l(j),{styleOptions:n.optionData.style,"onUpdate:styleOptions":a[4]||(a[4]=o=>n.optionData.style=o)},null,8,["styleOptions"])]),_:1}),(f(!0),I(B,null,S(n.optionData.listOptions,(o,p)=>(f(),O(l(V),{key:p,name:`选项-${p+1}`},{header:e(()=>[_("div",G,[_("span",null,"选项-"+h(p+1),1),_("div",null,[t(D,{onClick:y(u=>C(o,p),["stop"])},{default:e(()=>[t(c)]),_:2},1032,["onClick"]),t(D,{onClick:y(u=>k(o,p),["stop"])},{default:e(()=>[t(z)]),_:2},1032,["onClick"])])])]),default:e(()=>[t(l(d),{name:"映射"},{default:e(()=>[t(l(i),{name:"绑定字段"},{default:e(()=>[t(b,{size:"small",modelValue:o.label,"onUpdate:modelValue":u=>o.label=u},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),t(l(i),{name:"绑定值"},{default:e(()=>[t(b,{size:"small",modelValue:o.value,"onUpdate:modelValue":u=>o.value=u},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024)]),_:2},1024)]),_:2},1032,["name"]))),128))]),_:1})}}});const $t=P(H,[["__scopeId","data-v-9d3a90f8"]]);export{$t as default};