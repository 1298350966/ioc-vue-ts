import{g as h}from"./index-4e626338.js";import{c as n}from"./style-2d240cf8.js";import{d as f,a7 as u,o as a,c,u as e,h as r,x as $,G as k,H as m}from"./vue-65382a1b.js";import{_ as g}from"./xgplayerVue-c27b6911.js";import"./elementPlus-07602b2b.js";import"./vuema-115cb50e.js";import"./lodash-f91682a1.js";import"./vueRepl-a238c739.js";const d=l=>(k("data-v-b07bae32"),l=l(),m(),l),b={class:"go-border-box"},w=["width","height"],C=d(()=>r("feMorphology",{operator:"dilate",radius:"1",in:"SourceAlpha",result:"thicken"},null,-1)),L=d(()=>r("feGaussianBlur",{in:"thicken",stdDeviation:"2",result:"blurred"},null,-1)),x=["flood-color"],v=["values"],M=d(()=>r("feComposite",{in:"glowColor",in2:"blurred",operator:"in",result:"softGlowColored"},null,-1)),Q=d(()=>r("feMerge",null,[r("feMergeNode",{in:"softGlowColored"}),r("feMergeNode",{in:"SourceGraphic"})],-1)),I=["fill","stroke","d"],y=["filter","stroke"],G=["filter","stroke","d"],N=["filter","stroke","d"],S=["filter","stroke","d"],B=f({__name:"index",props:{chartConfig:{type:Object,required:!0}},setup(l){const p=l,i=`border-box-03-filterId-${h()}`,{w:o,h:t}=u(p.chartConfig.attr),{colors:s,backgroundColor:_}=u(p.chartConfig.option);return(D,U)=>(a(),c("div",b,[(a(),c("svg",{width:e(o),height:e(t)},[r("defs",null,[r("filter",{id:i,height:"150%",width:"150%",x:"-25%",y:"-25%"},[C,L,r("feFlood",{"flood-color":e(n)(e(s)[1],.7),result:"glowColor"},[r("animate",{attributeName:"flood-color",values:`
                ${e(n)(e(s)[1],.7)};
                ${e(n)(e(s)[1],.3)};
                ${e(n)(e(s)[1],.7)};
              `,dur:"3s",begin:"0s",repeatCount:"indefinite"},null,8,v)],8,x),M,Q])]),e(o)&&e(t)?(a(),c("path",{key:0,fill:e(_),"stroke-width":"2",stroke:e(s)[0],d:`
          M15 5 L ${e(o)-15} 5 Q ${e(o)-5} 5, ${e(o)-5} 15
          L ${e(o)-5} ${e(t)-15} Q ${e(o)-5} ${e(t)-5}, ${e(o)-15} ${e(t)-5}
          L 15, ${e(t)-5} Q 5 ${e(t)-5} 5 ${e(t)-15} L 5 15
          Q 5 5 15 5
        `},null,8,I)):$("",!0),r("path",{"stroke-width":"2",fill:"transparent","stroke-linecap":"round",filter:`url(#${i})`,stroke:e(s)[1],d:"M 20 5 L 15 5 Q 5 5 5 15 L 5 20"},null,8,y),r("path",{"stroke-width":"2",fill:"transparent","stroke-linecap":"round",filter:`url(#${i})`,stroke:e(s)[1],d:`M ${e(o)-20} 5 L ${e(o)-15} 5 Q ${e(o)-5} 5 ${e(o)-5} 15 L ${e(o)-5} 20`},null,8,G),r("path",{"stroke-width":"2",fill:"transparent","stroke-linecap":"round",filter:`url(#${i})`,stroke:e(s)[1],d:`
          M ${e(o)-20} ${e(t)-5} L ${e(o)-15} ${e(t)-5}
          Q ${e(o)-5} ${e(t)-5} ${e(o)-5} ${e(t)-15}
          L ${e(o)-5} ${e(t)-20}
        `},null,8,N),r("path",{"stroke-width":"2",fill:"transparent","stroke-linecap":"round",filter:`url(#${i})`,stroke:e(s)[1],d:`
          M 20 ${e(t)-5} L 15 ${e(t)-5}
          Q 5 ${e(t)-5} 5 ${e(t)-15}
          L 5 ${e(t)-20}
        `},null,8,S)],8,w))]))}});const R=g(B,[["__scopeId","data-v-b07bae32"]]);export{R as default};
