import{d as h,aI as x,u as s,a7 as y,o as i,c as l,h as e,F as b,q as g,U as w,G as v,H as k}from"./vue-65382a1b.js";import{_ as C}from"./xgplayerVue-c27b6911.js";const S=t=>(v("data-v-b4d0ec68"),t=t(),k(),t),$={xmlns:"http://www.w3.org/2000/svg",viewBox:"0 0 200 200"},B=w('<filter id="innerShadow" x="-20%" y="-20%" width="140%" height="140%" data-v-b4d0ec68><feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" data-v-b4d0ec68></feGaussianBlur><feOffset in="blur" dx="2.5" dy="2.5" data-v-b4d0ec68></feOffset></filter><g data-v-b4d0ec68><circle id="shadow" style="fill:rgba(0, 0, 0, 0.1);" cx="100" cy="100" r="87" filter="url(#innerShadow)" data-v-b4d0ec68></circle><circle id="circle" class="clock-border" cx="100" cy="100" r="80" data-v-b4d0ec68></circle></g>',2),T={x1:"100",y1:"100",x2:"100",y2:"55",style:{"stroke-width":"3px"},class:"clock-line"},I=["from","to"],M={x1:"100",y1:"100",x2:"100",y2:"40",style:{"stroke-width":"4px"},class:"clock-line"},N=["from","to"],G={x1:"100",y1:"100",x2:"100",y2:"30",style:{"stroke-width":"2px"},class:"clock-line"},L=["from","to"],A=S(()=>e("circle",{id:"center",style:{fill:"#128a86",stroke:"#c1efed","stroke-width":"2px"},cx:"100",cy:"100",r:"3"},null,-1)),O=["transform"],V=h({__name:"index",props:{chartConfig:{type:Object,required:!0}},setup(t){const d=t;x(m=>({"47fe3763":s(p),46891283:s(u)+"px","7239e62c":s(_),"67e7692f":s(f)}));let{border:u,color:f,bgColor:_,borderColor:p}=y(d.chartConfig.option);const o=new Date,r=360*o.getHours()/12+o.getMinutes()/2,a=360*o.getMinutes()/60,n=360*o.getSeconds()/60;return(m,X)=>(i(),l("svg",$,[B,e("g",null,[e("line",T,[e("animateTransform",{attributeName:"transform",attributeType:"XML",type:"rotate",dur:"43200s",repeatCount:"indefinite",from:`${r} 100 100`,to:`${r+360} 100 100`},null,8,I)]),e("line",M,[e("animateTransform",{attributeName:"transform",attributeType:"XML",type:"rotate",dur:"3600s",repeatCount:"indefinite",from:`${a} 100 100`,to:`${a+360} 100 100`},null,8,N)]),e("line",G,[e("animateTransform",{attributeName:"transform",attributeType:"XML",type:"rotate",dur:"60s",repeatCount:"indefinite",from:`${n} 100 100`,to:`${n+360} 100 100`},null,8,L)])]),A,(i(),l(b,null,g(12,c=>e("line",{x1:"100",y1:"30",x2:"100",y2:"40",class:"clock-line",transform:`rotate(${(c+1)*360/12} 100 100)`,key:`line_${c+1}`},null,8,O)),64))]))}});const F=C(V,[["__scopeId","data-v-b4d0ec68"]]);export{F as default};