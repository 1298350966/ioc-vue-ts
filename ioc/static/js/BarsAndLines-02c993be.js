import{_ as B}from"./index-806da9dd.js";import"./index-4e626338.js";/* empty css                 *//* empty css                    *//* empty css               */import"./el-tooltip-4ed993c7.js";/* empty css                  *//* empty css                     *//* empty css                  *//* empty css                        *//* empty css                 *//* empty css                */import{w as E,C as D,x as I,$ as S,k as F,_ as N}from"./elementPlus-07602b2b.js";import{d as T,r as R,al as v,o as i,c as d,h as t,a as e,w as a,F as h,q as x,x as V,a6 as M,u as P,a0 as q,G,H}from"./vue-65382a1b.js";import{_ as j}from"./xgplayerVue-c27b6911.js";/* empty css                   */import"./vueRepl-a238c739.js";import"./lodash-f91682a1.js";import"./vuema-115cb50e.js";const k=u=>(G("data-v-7717d482"),u=u(),H(),u),J={class:"title grid-c-1-18-5 mb-2"},K=k(()=>t("span",null,"值轴/度量",-1)),O={key:0,class:"noDate mb-2"},Q={class:"title grid-c-1-18-5 mb-2"},W=k(()=>t("span",null,"类别轴/维度",-1)),X={key:0,class:"noDate mb-2"},Y={class:"title grid-c-1-39-5 mb-2"},Z=k(()=>t("span",null,"颜色图例/维度 ",-1)),ee={key:0,class:"noDate mb-2"},le={class:"p-5"},ae={class:"m-1"},oe=T({__name:"BarsAndLines",props:{dataMapping:{}},setup(u){const l=u;function w(){l.dataMapping.valueAxis.push({column:"data"+(l.dataMapping.valueAxis.length+1),name:"数据"+(l.dataMapping.valueAxis.length+1)})}function b(){if(l.dataMapping.classAxis.length>=1)return window.$message.warning("类别轴/维度只允许添加一个字段");l.dataMapping.classAxis.push({column:"product"})}function y(){if(l.dataMapping.valueAxis.length>1)return window.$message.warning("值轴/度量添加了多个字段，颜色图例不予许添加");if(l.dataMapping.colorAxis.length>=1)return window.$message.warning("颜色图例/维度只允许添加一个字段");l.dataMapping.colorAxis.push({column:"colorAxis",typeList:[]})}const m=R(!1);function U(){console.log("openDialog"),m.value=!0}return(te,_)=>{const g=v("Plus"),p=E,c=D,r=I,f=v("RemoveFilled"),$=v("Setting"),A=S,C=F,L=N,z=B;return i(),d("div",null,[t("div",null,[t("div",J,[K,e(c,{content:"添加字段映射"},{default:a(()=>[e(p,{size:"16",class:"cursor-pointer",onClick:w},{default:a(()=>[e(g)]),_:1})]),_:1})]),(i(!0),d(h,null,x(l.dataMapping.valueAxis,(o,n)=>(i(),d("div",{key:n,class:"grid-c-2-20-5 mb-2"},[e(c,{content:"名称",trigger:"click"},{default:a(()=>[e(r,{modelValue:o.name,"onUpdate:modelValue":s=>o.name=s,class:"flex-1",placeholder:"请输入名称"},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),e(c,{content:"字段",trigger:"click"},{default:a(()=>[e(r,{modelValue:o.column,"onUpdate:modelValue":s=>o.column=s,class:"flex-1",placeholder:"请输入字段"},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),e(p,{class:"c-red cursor-pointer",size:"18",onClick:s=>l.dataMapping.valueAxis.splice(n,1)},{default:a(()=>[e(f)]),_:2},1032,["onClick"])]))),128)),l.dataMapping.valueAxis.length==0?(i(),d("div",O," 点击加号添加字段 ")):V("",!0)]),t("div",null,[t("div",Q,[W,e(c,{content:"添加字段映射"},{default:a(()=>[e(p,{size:"16",class:"cursor-pointer",onClick:b},{default:a(()=>[e(g)]),_:1})]),_:1})]),(i(!0),d(h,null,x(l.dataMapping.classAxis,(o,n)=>(i(),d("div",{key:n,class:"flex w-100% mb-2 grid-c-1-20-5"},[e(r,{modelValue:o.column,"onUpdate:modelValue":s=>o.column=s,class:"flex-1",placeholder:"请输入字段"},null,8,["modelValue","onUpdate:modelValue"]),e(p,{class:"c-red cursor-pointer",size:"18",onClick:s=>l.dataMapping.classAxis.splice(n,1)},{default:a(()=>[e(f)]),_:2},1032,["onClick"])]))),128)),l.dataMapping.classAxis.length==0?(i(),d("div",X," 点击加号添加字段 ")):V("",!0)]),t("div",null,[t("div",Y,[Z,t("div",null,[e(c,{content:"添加默认枚举类型"},{default:a(()=>[e(p,{size:"16",class:"mr-5px cursor-pointer",onClick:U},{default:a(()=>[e($)]),_:1})]),_:1}),e(c,{content:"添加字段映射"},{default:a(()=>[e(p,{size:"16",class:"cursor-pointer",onClick:y},{default:a(()=>[e(g)]),_:1})]),_:1})])]),(i(!0),d(h,null,x(l.dataMapping.colorAxis,(o,n)=>(i(),d("div",{key:n,class:"flex w-100% mb-2 grid-c-1-20-5"},[e(r,{modelValue:o.column,"onUpdate:modelValue":s=>o.column=s,class:"flex-1",placeholder:"请输入字段"},null,8,["modelValue","onUpdate:modelValue"]),e(p,{class:"c-red cursor-pointer",size:"18",onClick:s=>l.dataMapping.colorAxis.splice(n,1)},{default:a(()=>[e(f)]),_:2},1032,["onClick"])]))),128)),l.dataMapping.colorAxis.length==0?(i(),d("div",ee," 点击加号添加字段 ")):V("",!0),e(z,{title:"枚举类型配置",modelValue:P(m),"onUpdate:modelValue":_[1]||(_[1]=o=>q(m)?m.value=o:null),width:"50%",top:"10vh"},{footer:a(()=>[t("div",ae,[e(C,{style:{width:"100%"},onClick:_[0]||(_[0]=o=>l.dataMapping.typeList.push({name:""}))},{default:a(()=>[M("添加一行")]),_:1})])]),default:a(()=>[t("div",le,[e(L,{border:"",striped:"",data:l.dataMapping.typeList,height:"600px"},{default:a(()=>[e(A,{prop:"name",label:"枚举类型名称"},{default:a(({row:o})=>[e(r,{modelValue:o.name,"onUpdate:modelValue":n=>o.name=n},null,8,["modelValue","onUpdate:modelValue"])]),_:1}),e(A,{prop:"result",label:"操作",width:"60px"},{default:a(({$index:o})=>[e(C,{type:"danger",link:"",onClick:n=>l.dataMapping.typeList.splice(o,1)},{default:a(()=>[M("删除")]),_:2},1032,["onClick"])]),_:1})]),_:1},8,["data"])])]),_:1},8,["modelValue"])])])}}});const Me=j(oe,[["__scopeId","data-v-7717d482"]]);export{Me as default};