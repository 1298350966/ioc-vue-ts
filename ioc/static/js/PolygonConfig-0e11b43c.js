import"./index-4e626338.js";/* empty css                 *//* empty css               *//* empty css                     *//* empty css                  *//* empty css                        *//* empty css                     *//* empty css                        *//* empty css                  *//* empty css                        */import{_ as p}from"./SettingItem-0e9c370f.js";/* empty css                  */import{N as r,ae as V,a1 as f,ap as k}from"./elementPlus-07602b2b.js";import{d as z,o as y,c as x,a as o,w as m}from"./vue-65382a1b.js";import"./xgplayerVue-c27b6911.js";import"./vueRepl-a238c739.js";import"./lodash-f91682a1.js";import"./vuema-115cb50e.js";/* empty css                 *//* empty css                                                                    */const H=z({__name:"PolygonConfig",props:{options:{type:Object,required:!0}},setup(l){const s=[{value:"solid",label:"实线"},{value:"dashed",label:"虚线"}];return(C,e)=>{const u=r,n=p,i=V,a=f,d=k;return y(),x("div",null,[o(n,{name:"是否可见"},{default:m(()=>[o(u,{size:"small",modelValue:l.options.visible,"onUpdate:modelValue":e[0]||(e[0]=t=>l.options.visible=t)},null,8,["modelValue"])]),_:1}),o(n,{name:"层级"},{default:m(()=>[o(i,{size:"small",modelValue:l.options.zIndex,"onUpdate:modelValue":e[1]||(e[1]=t=>l.options.zIndex=t)},null,8,["modelValue"])]),_:1}),o(n,{name:"填充颜色"},{default:m(()=>[o(a,{size:"small",modelValue:l.options.fillColor,"onUpdate:modelValue":e[2]||(e[2]=t=>l.options.fillColor=t),"show-alpha":""},null,8,["modelValue"])]),_:1}),o(n,{name:"填充透明度"},{default:m(()=>[o(i,{size:"small",modelValue:l.options.fillOpacity,"onUpdate:modelValue":e[3]||(e[3]=t=>l.options.fillOpacity=t),min:0,max:1,step:.1},null,8,["modelValue"])]),_:1}),o(n,{name:"线条颜色"},{default:m(()=>[o(a,{size:"small",modelValue:l.options.strokeColor,"onUpdate:modelValue":e[4]||(e[4]=t=>l.options.strokeColor=t),"show-alpha":""},null,8,["modelValue"])]),_:1}),o(n,{name:"线条透明度"},{default:m(()=>[o(i,{size:"small",modelValue:l.options.strokeOpacity,"onUpdate:modelValue":e[5]||(e[5]=t=>l.options.strokeOpacity=t),min:0,max:1,step:.1},null,8,["modelValue"])]),_:1}),o(n,{name:"线条宽度"},{default:m(()=>[o(i,{size:"small",modelValue:l.options.strokeWeight,"onUpdate:modelValue":e[6]||(e[6]=t=>l.options.strokeWeight=t),min:0,max:50},null,8,["modelValue"])]),_:1}),o(n,{name:"线样式"},{default:m(()=>[o(d,{size:"small",modelValue:l.options.strokeStyle,"onUpdate:modelValue":e[7]||(e[7]=t=>l.options.strokeStyle=t),options:s},null,8,["modelValue"])]),_:1})])}}});export{H as default};