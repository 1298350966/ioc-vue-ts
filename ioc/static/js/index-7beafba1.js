import{d,a7 as r,o as l,c,u as o,h as t}from"./vue-65382a1b.js";import{_ as p}from"./xgplayerVue-c27b6911.js";const $={class:"go-border-box"},h=["width","height"],u=["fill","points"],g=["stroke","points"],f=["stroke","points"],b=["stroke","points"],k=["stroke","points"],m=d({__name:"index",props:{chartConfig:{type:Object,required:!0}},setup(_){const i=_,{w:s,h:e}=r(i.chartConfig.attr),{colors:n,backgroundColor:a}=r(i.chartConfig.option);return(x,y)=>(l(),c("div",$,[(l(),c("svg",{class:"bv-border-svg-container",width:o(s),height:o(e)},[t("polygon",{fill:o(a),points:`
        23, 23 ${o(s)-24}, 23 ${o(s)-24}, ${o(e)-24} 23, ${o(e)-24}
      `},null,8,u),t("polyline",{class:"go-border-line-1",stroke:o(n)[0],points:`4, 4 ${o(s)-22} ,4 ${o(s)-22}, ${o(e)-22} 4, ${o(e)-22} 4, 4`},null,8,g),t("polyline",{class:"go-border-line-3",stroke:o(n)[1],points:`10, 10 ${o(s)-16}, 10 ${o(s)-16}, ${o(e)-16} 10, ${o(e)-16} 10, 10`},null,8,f),t("polyline",{class:"go-border-line-3",stroke:o(n)[1],points:`16, 16 ${o(s)-10}, 16 ${o(s)-10}, ${o(e)-10} 16, ${o(e)-10} 16, 16`},null,8,b),t("polyline",{class:"go-border-line-3",stroke:o(n)[1],points:`22, 22 ${o(s)-4}, 22 ${o(s)-4}, ${o(e)-4} 22, ${o(e)-4} 22, 22`},null,8,k)],8,h))]))}});const w=p(m,[["__scopeId","data-v-454ad1b3"]]);export{w as default};