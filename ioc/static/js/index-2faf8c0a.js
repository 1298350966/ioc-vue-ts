import{g as p}from"./index-4e626338.js";import{d as u,a7 as a,o as d,c as f,u as t,h as s,G as h,H as m}from"./vue-65382a1b.js";import{_ as b}from"./xgplayerVue-c27b6911.js";import"./elementPlus-07602b2b.js";import"./vuema-115cb50e.js";import"./lodash-f91682a1.js";import"./vueRepl-a238c739.js";const _=n=>(h("data-v-1e74db59"),n=n(),m(),n),g={class:"go-border-box"},k=["width","height"],y=_(()=>s("animate",{attributeName:"x1",values:"0%;100%;0%",dur:"10s",begin:"0s",repeatCount:"indefinite"},null,-1)),x=_(()=>s("animate",{attributeName:"x2",values:"100%;0%;100%",dur:"10s",begin:"0s",repeatCount:"indefinite"},null,-1)),v=["stop-color"],w=["values"],C=["stop-color"],I=["values"],N=["points"],B=["points"],S=["points"],G=["points"],U=["points"],j=["points"],q=["points"],D=["points"],E=["points"],H=["fill","points"],O=["width","height","fill","mask"],R=u({__name:"index",props:{chartConfig:{type:Object,required:!0}},setup(n){const l=n,$=`border-box-07-filter-${p()}`,r=`border-box-07-mask-${p()}`,{w:o,h:e}=a(l.chartConfig.attr),{colors:i,backgroundColor:c}=a(l.chartConfig.option);return(V,z)=>(d(),f("div",g,[(d(),f("svg",{width:t(o),height:t(e)},[s("defs",null,[s("linearGradient",{id:$,x1:"0%",y1:"0%",x2:"100%",y2:"100%"},[y,x,s("stop",{offset:"0%","stop-color":t(i)[0]},[s("animate",{attributeName:"stop-color",values:`${t(i)[0]};${t(i)[1]};${t(i)[0]}`,dur:"10s",begin:"0s",repeatCount:"indefinite"},null,8,w)],8,v),s("stop",{offset:"100%","stop-color":t(i)[1]},[s("animate",{attributeName:"stop-color",values:`${t(i)[1]};${t(i)[0]};${t(i)[1]}`,dur:"10s",begin:"0s",repeatCount:"indefinite"},null,8,I)],8,C)]),s("mask",{id:r},[s("polyline",{stroke:"#fff","stroke-width":"3",fill:"transparent",points:`8, ${t(e)*.4} 8, 3, ${t(o)*.4+7}, 3`},null,8,N),s("polyline",{fill:"#fff",points:`8, ${t(e)*.15} 8, 3, ${t(o)*.1+7}, 3
              ${t(o)*.1}, 8 14, 8 14, ${t(e)*.15-7}
            `},null,8,B),s("polyline",{stroke:"#fff","stroke-width":"3",fill:"transparent",points:`${t(o)*.5}, 3 ${t(o)-3}, 3, ${t(o)-3}, ${t(e)*.25}`},null,8,S),s("polyline",{fill:"#fff",points:`
              ${t(o)*.52}, 3 ${t(o)*.58}, 3
              ${t(o)*.58-7}, 9 ${t(o)*.52+7}, 9
            `},null,8,G),s("polyline",{fill:"#fff",points:`
              ${t(o)*.9}, 3 ${t(o)-3}, 3 ${t(o)-3}, ${t(e)*.1}
              ${t(o)-9}, ${t(e)*.1-7} ${t(o)-9}, 9 ${t(o)*.9+7}, 9
            `},null,8,U),s("polyline",{stroke:"#fff","stroke-width":"3",fill:"transparent",points:`8, ${t(e)*.5} 8, ${t(e)-3} ${t(o)*.3+7}, ${t(e)-3}`},null,8,j),s("polyline",{fill:"#fff",points:`
              8, ${t(e)*.55} 8, ${t(e)*.7}
              2, ${t(e)*.7-7} 2, ${t(e)*.55+7}
            `},null,8,q),s("polyline",{stroke:"#fff","stroke-width":"3",fill:"transparent",points:`${t(o)*.35}, ${t(e)-3} ${t(o)-3}, ${t(e)-3} ${t(o)-3}, ${t(e)*.35}`},null,8,D),s("polyline",{fill:"#fff",points:`
              ${t(o)*.92}, ${t(e)-3} ${t(o)-3}, ${t(e)-3} ${t(o)-3}, ${t(e)*.8}
              ${t(o)-9}, ${t(e)*.8+7} ${t(o)-9}, ${t(e)-9} ${t(o)*.92+7}, ${t(e)-9}
            `},null,8,E)])]),s("polygon",{fill:t(c),points:`
        15, 9 ${t(o)*.1+1}, 9 ${t(o)*.1+4}, 6 ${t(o)*.52+2}, 6
        ${t(o)*.52+6}, 10 ${t(o)*.58-7}, 10 ${t(o)*.58-2}, 6
        ${t(o)*.9+2}, 6 ${t(o)*.9+6}, 10 ${t(o)-10}, 10 ${t(o)-10}, ${t(e)*.1-6}
        ${t(o)-6}, ${t(e)*.1-1} ${t(o)-6}, ${t(e)*.8+1} ${t(o)-10}, ${t(e)*.8+6}
        ${t(o)-10}, ${t(e)-10} ${t(o)*.92+7}, ${t(e)-10}  ${t(o)*.92+2}, ${t(e)-6}
        11, ${t(e)-6} 11, ${t(e)*.15-2} 15, ${t(e)*.15-7}
      `},null,8,H),s("rect",{x:"0",y:"0",width:t(o),height:t(e),fill:`url(#${$})`,mask:`url(#${r})`},null,8,O)],8,k))]))}});const Q=b(R,[["__scopeId","data-v-1e74db59"]]);export{Q as default};
