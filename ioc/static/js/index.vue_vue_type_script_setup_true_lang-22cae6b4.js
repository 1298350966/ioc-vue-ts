import{at as t}from"./index-4e626338.js";/* empty css                    */import{u as E}from"./useTargetData.hook-7e83673b.js";import{_ as D}from"./index.vue_vue_type_style_index_0_lang-9b48fdd8.js";import{Q as R,P as v}from"./elementPlus-07602b2b.js";import{d as g,a7 as q,r as V,o as s,c as u,a as m,w as d,F as k,q as x,u as o,s as H,x as P}from"./vue-65382a1b.js";const F=g({name:"RequestGlobalHeaderTable",__name:"index",props:{editDisabled:{type:Boolean,default:!0}},setup(i){const{chartEditStore:c}=E(),{requestParams:l}=q(c.getRequestGlobalConfig),e=V(t.HEADER),p=[t.HEADER],_=n=>{e.value===t.HEADER&&(l.value[e.value]=n)};return(n,r)=>{const f=R,b=v;return s(),u("div",null,[m(b,{modelValue:e.value,"onUpdate:modelValue":r[0]||(r[0]=a=>e.value=a)},{default:d(()=>[(s(),u(k,null,x(p,a=>m(f,{key:a,name:a,label:a},{default:d(()=>[e.value===o(t).HEADER?(s(),H(o(D),{key:0,editDisabled:i.editDisabled,target:o(l)[e.value],onUpdate:_},null,8,["editDisabled","target"])):P("",!0)]),_:2},1032,["name","label"])),64))]),_:1},8,["modelValue"])])}}});export{F as _};