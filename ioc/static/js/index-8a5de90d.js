import{g as n}from"./index-4e626338.js";import{d as g,a7 as h,g as f,o as m,c as $,u as o,h as t,G as b,H as y}from"./vue-65382a1b.js";import{_ as L}from"./xgplayerVue-c27b6911.js";import"./elementPlus-07602b2b.js";import"./vuema-115cb50e.js";import"./lodash-f91682a1.js";import"./vueRepl-a238c739.js";const v=r=>(b("data-v-966367ac"),r=r(),y(),r),C={class:"go-border-box"},w=["width","height"],I=["d"],B=v(()=>t("stop",{offset:"0%","stop-color":"#fff","stop-opacity":"1"},null,-1)),M=v(()=>t("stop",{offset:"100%","stop-color":"#fff","stop-opacity":"0"},null,-1)),S=[B,M],D=["fill"],G=["dur","path"],N=["fill","points"],U=["stroke","xlink:href"],j=["stroke","xlink:href","mask"],q=["from","to","dur"],E=g({__name:"index",props:{chartConfig:{type:Object,required:!0}},setup(r){const i=r,a=`border-box-08-path-${n()}`,l=`border-box-08-gradient-${n()}`,c=`border-box-08-mask-${n()}`,{w:e,h:s}=h(i.chartConfig.attr),{colors:d,dur:u,backgroundColor:k,reverse:x}=h(i.chartConfig.option),p=f(()=>(e.value+s.value-5)*2),_=f(()=>x.value?`M 2.5, 2.5 L 2.5, ${s.value-2.5} L ${e.value-2.5}, ${s.value-2.5} L ${e.value-2.5}, 2.5 L 2.5, 2.5`:`M2.5, 2.5 L${e.value-2.5}, 2.5 L${e.value-2.5}, ${s.value-2.5} L2.5, ${s.value-2.5} L2.5, 2.5`);return(H,O)=>(m(),$("div",C,[(m(),$("svg",{width:o(e),height:o(s)},[t("defs",null,[t("path",{id:a,d:_.value,fill:"transparent"},null,8,I),t("radialGradient",{id:l,cx:"50%",cy:"50%",r:"50%"},S),t("mask",{id:c},[t("circle",{cx:"0",cy:"0",r:"150",fill:`url(#${l})`},[t("animateMotion",{dur:`${o(u)}s`,path:_.value,rotate:"auto",repeatCount:"indefinite"},null,8,G)],8,D)])]),t("polygon",{fill:o(k),points:`5, 5 ${o(e)-5}, 5 ${o(e)-5} ${o(s)-5} 5, ${o(s)-5}`},null,8,N),t("use",{stroke:o(d)[0],"stroke-width":"1","xlink:href":`#${a}`},null,8,U),t("use",{stroke:o(d)[1],"stroke-width":"3","xlink:href":`#${a}`,mask:`url(#${c})`},[t("animate",{attributeName:"stroke-dasharray",from:`0, ${p.value}`,to:`${p.value}, 0`,dur:`${o(u)}s`,repeatCount:"indefinite"},null,8,q)],8,j)],8,w))]))}});const P=L(E,[["__scopeId","data-v-966367ac"]]);export{P as default};