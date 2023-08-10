import{d as l,a7 as a,o as d,c,u as t,h as r}from"./vue-65382a1b.js";import{_ as p}from"./xgplayerVue-c27b6911.js";const h={class:"go-border-box"},f=["width","height"],L=["fill","stroke","d"],u=["stroke"],k=["stroke"],$=["stroke","d"],g=l({__name:"index",props:{chartConfig:{type:Object,required:!0}},setup(_){const n=_,{w:e,h:o}=a(n.chartConfig.attr),{colors:s,backgroundColor:i}=a(n.chartConfig.option);return(m,x)=>(d(),c("div",h,[(d(),c("svg",{width:t(e),height:t(o)},[r("path",{fill:t(i),stroke:t(s)[0],d:`
          M 5 20 L 5 10 L 12 3  L 60 3 L 68 10
          L ${t(e)-20} 10 L ${t(e)-5} 25
          L ${t(e)-5} ${t(o)-5} L 20 ${t(o)-5}
          L 5 ${t(o)-20} L 5 20
        `},null,8,L),r("path",{fill:"transparent","stroke-w":"3","stroke-linecap":"round","stroke-dasharray":"10, 5",stroke:t(s)[0],d:"M 16 9 L 61 9"},null,8,u),r("path",{fill:"transparent",stroke:t(s)[1],d:"M 5 20 L 5 10 L 12 3  L 60 3 L 68 10"},null,8,k),r("path",{fill:"transparent",stroke:t(s)[1],d:`M ${t(e)-5} ${t(o)-30} L ${t(e)-5} ${t(o)-5} L ${t(e)-30} ${t(o)-5}`},null,8,$)],8,f))]))}});const b=p(g,[["__scopeId","data-v-fc7dd111"]]);export{b as default};
