import"./index-4e626338.js";/* empty css                 */import{_ as p}from"./SettingItem-0e9c370f.js";/* empty css               *//* empty css                     *//* empty css                  *//* empty css                        *//* empty css                     */import{ap as d,x as s}from"./elementPlus-07602b2b.js";import{d as r,o as V,c as f,a as e,w as m}from"./vue-65382a1b.js";import"./xgplayerVue-c27b6911.js";import"./vueRepl-a238c739.js";import"./lodash-f91682a1.js";import"./vuema-115cb50e.js";/* empty css                 *//* empty css                                                                    */const y=r({__name:"ZoomConfig",props:{options:{type:Object,required:!0}},setup(o){const a=[{value:"topright",label:"右上"},{value:"topleft",label:"左上"},{value:"bottomright",label:"右下"},{value:"bottomleft",label:"左下"}];return(x,t)=>{const u=d,n=p,i=s;return V(),f("div",null,[e(n,{name:"位置"},{default:m(()=>[e(u,{modelValue:o.options.position,"onUpdate:modelValue":t[0]||(t[0]=l=>o.options.position=l),options:a},null,8,["modelValue"])]),_:1}),e(n,{name:"放大层级按钮的文字显示"},{default:m(()=>[e(i,{modelValue:o.options.zoomInText,"onUpdate:modelValue":t[1]||(t[1]=l=>o.options.zoomInText=l)},null,8,["modelValue"])]),_:1}),e(n,{name:"缩小层级按钮的文字显示"},{default:m(()=>[e(i,{modelValue:o.options.zoomOutText,"onUpdate:modelValue":t[2]||(t[2]=l=>o.options.zoomOutText=l)},null,8,["modelValue"])]),_:1}),e(n,{name:"放大层级按钮的标题显示"},{default:m(()=>[e(i,{modelValue:o.options.zoomInTitle,"onUpdate:modelValue":t[3]||(t[3]=l=>o.options.zoomInTitle=l)},null,8,["modelValue"])]),_:1}),e(n,{name:"缩小层级按钮的标题显示"},{default:m(()=>[e(i,{modelValue:o.options.zoomOutTitle,"onUpdate:modelValue":t[4]||(t[4]=l=>o.options.zoomOutTitle=l)},null,8,["modelValue"])]),_:1})])}}});export{y as default};