import{g as y}from"./index-4e626338.js";import{d as m,a7 as p,o as _,c,u as t,h as i,l as b,G as C,H as x}from"./vue-65382a1b.js";import{_ as k}from"./xgplayerVue-c27b6911.js";import"./elementPlus-07602b2b.js";import"./vuema-115cb50e.js";import"./lodash-f91682a1.js";import"./vueRepl-a238c739.js";const r=$=>(C("data-v-4dd6360b"),$=$(),x(),$),v={class:"go-border-box"},w=["width","height"],N=r(()=>i("feMorphology",{operator:"dilate",radius:"2",in:"SourceAlpha",result:"thicken"},null,-1)),I=r(()=>i("feGaussianBlur",{in:"thicken",stdDeviation:"3",result:"blurred"},null,-1)),S=["flood-color"],G=r(()=>i("feComposite",{in:"glowColor",in2:"blurred",operator:"in",result:"softGlowColored"},null,-1)),T=r(()=>i("feMerge",null,[i("feMergeNode",{in:"softGlowColored"}),i("feMergeNode",{in:"SourceGraphic"})],-1)),B=["fill","points"],M=["fill","stroke","filter","points"],z=["stroke","points"],D=["stroke","points"],H=["stroke","fill","filter","points"],U=["filter","fill","points"],j=r(()=>i("animate",{attributeName:"opacity",values:"1;0.7;1",dur:"2s",begin:"0s",repeatCount:"indefinite"},null,-1)),q=[j],A=["filter","fill","points"],E=r(()=>i("animate",{attributeName:"opacity",values:"0.7;0.4;0.7",dur:"2s",begin:"0s",repeatCount:"indefinite"},null,-1)),F=[E],O=["filter","fill","points"],R=r(()=>i("animate",{attributeName:"opacity",values:"0.5;0.2;0.5",dur:"2s",begin:"0s",repeatCount:"indefinite"},null,-1)),V=[R],W=["filter","fill","points"],J=r(()=>i("animate",{attributeName:"opacity",values:"1;0.7;1",dur:"2s",begin:"0s",repeatCount:"indefinite"},null,-1)),K=[J],L=["filter","fill","points"],P=r(()=>i("animate",{attributeName:"opacity",values:"0.7;0.4;0.7",dur:"2s",begin:"0s",repeatCount:"indefinite"},null,-1)),Q=[P],X=["filter","fill","points"],Y=r(()=>i("animate",{attributeName:"opacity",values:"0.5;0.2;0.5",dur:"2s",begin:"0s",repeatCount:"indefinite"},null,-1)),Z=[Y],tt=["x","y","fill","font-size"],ot=["fill","filter","points"],et=["fill","filter","points"],it=m({__name:"index",props:{chartConfig:{type:Object,required:!0}},setup($){const d=$,n=`border-box-04-filterId-${y()}`,{w:o,h:l}=p(d.chartConfig.attr),{colors:s,borderTitle:f,borderTitleColor:u,borderTitleSize:h,borderTitleHeight:g,borderTitleWidth:e,backgroundColor:a}=p(d.chartConfig.option);return(lt,st)=>(_(),c("div",v,[(_(),c("svg",{width:t(o),height:t(l)},[i("defs",null,[i("filter",{id:n,height:"150%",width:"150%",x:"-25%",y:"-25%"},[N,I,i("feFlood",{"flood-color":t(s)[1],result:"glowColor"},null,8,S),G,T])]),i("polygon",{fill:t(a),points:`
        20, 32 ${t(o)*.5-t(e)/2}, 32 ${t(o)*.5-t(e)/2+20}, 53
        ${t(o)*.5+t(e)/2-20}, 53 ${t(o)*.5+t(e)/2}, 32
        ${t(o)-20}, 32 ${t(o)-8}, 48 ${t(o)-8}, ${t(l)-25} ${t(o)-20}, ${t(l)-8}
        20, ${t(l)-8} 8, ${t(l)-25} 8, 50
      `},null,8,B),i("polyline",{fill:t(a),stroke:t(s)[0],filter:`url(#${n})`,points:`
          ${(t(o)-t(e))/2}, 30
          20, 30 7, 50 7, ${50+(t(l)-167)/2}
          13, ${55+(t(l)-167)/2} 13, ${135+(t(l)-167)/2}
          7, ${140+(t(l)-167)/2} 7, ${t(l)-27}
          20, ${t(l)-7} ${t(o)-20}, ${t(l)-7} ${t(o)-7}, ${t(l)-27}
          ${t(o)-7}, ${140+(t(l)-167)/2} ${t(o)-13}, ${135+(t(l)-167)/2}
          ${t(o)-13}, ${55+(t(l)-167)/2} ${t(o)-7}, ${50+(t(l)-167)/2}
          ${t(o)-7}, 50 ${t(o)-20}, 30 ${(t(o)+t(e))/2}, 30
          ${(t(o)+t(e))/2-20}, 7 ${(t(o)-t(e))/2+20}, 7
          ${(t(o)-t(e))/2}, 30 ${(t(o)-t(e))/2+20}, 52
          ${(t(o)+t(e))/2-20}, 52 ${(t(o)+t(e))/2}, 30
        `},null,8,M),i("polygon",{stroke:t(s)[0],fill:"transparent",points:`
          ${(t(o)+t(e))/2-5}, 30 ${(t(o)+t(e))/2-21}, 11
          ${(t(o)+t(e))/2-27}, 11 ${(t(o)+t(e))/2-8}, 34
        `},null,8,z),i("polygon",{stroke:t(s)[0],fill:"transparent",points:`
          ${(t(o)-t(e))/2+5}, 30 ${(t(o)-t(e))/2+22}, 49
          ${(t(o)-t(e))/2+28}, 49 ${(t(o)-t(e))/2+8}, 26
        `},null,8,D),i("polygon",{stroke:t(s)[0],fill:t(s)[1],filter:`url(#${n})`,points:`
          ${(t(o)+t(e))/2-11}, 37 ${(t(o)+t(e))/2-32}, 11
          ${(t(o)-t(e))/2+23}, 11 ${(t(o)-t(e))/2+11}, 23
          ${(t(o)-t(e))/2+33}, 49 ${(t(o)+t(e))/2-22}, 49
        `},null,8,H),i("polygon",{filter:`url(#${n})`,fill:t(s)[0],opacity:"1",points:`
          ${(t(o)-t(e))/2-10}, 37 ${(t(o)-t(e))/2-31}, 37
          ${(t(o)-t(e))/2-25}, 46 ${(t(o)-t(e))/2-4}, 46
        `},q,8,U),i("polygon",{filter:`url(#${n})`,fill:t(s)[0],opacity:"0.7",points:`
          ${(t(o)-t(e))/2-40}, 37 ${(t(o)-t(e))/2-61}, 37
          ${(t(o)-t(e))/2-55}, 46 ${(t(o)-t(e))/2-34}, 46
        `},F,8,A),i("polygon",{filter:`url(#${n})`,fill:t(s)[0],opacity:"0.5",points:`
          ${(t(o)-t(e))/2-70}, 37 ${(t(o)-t(e))/2-91}, 37
          ${(t(o)-t(e))/2-85}, 46 ${(t(o)-t(e))/2-64}, 46
        `},V,8,O),i("polygon",{filter:`url(#${n})`,fill:t(s)[0],opacity:"1",points:`
          ${(t(o)+t(e))/2+30}, 37 ${(t(o)+t(e))/2+9}, 37
          ${(t(o)+t(e))/2+3}, 46 ${(t(o)+t(e))/2+24}, 46
        `},K,8,W),i("polygon",{filter:`url(#${n})`,fill:t(s)[0],opacity:"0.7",points:`
          ${(t(o)+t(e))/2+60}, 37 ${(t(o)+t(e))/2+39}, 37
          ${(t(o)+t(e))/2+33}, 46 ${(t(o)+t(e))/2+54}, 46
        `},Q,8,L),i("polygon",{filter:`url(#${n})`,fill:t(s)[0],opacity:"0.5",points:`
          ${(t(o)+t(e))/2+90}, 37 ${(t(o)+t(e))/2+69}, 37
          ${(t(o)+t(e))/2+63}, 46 ${(t(o)+t(e))/2+84}, 46
        `},Z,8,X),i("text",{x:`${t(o)/2}`,y:t(g),fill:t(u),"font-size":t(h),"text-anchor":"middle","dominant-baseline":"middle"},b(t(f)),9,tt),i("polygon",{fill:t(s)[0],filter:`url(#${n})`,points:`
          7, ${53+(t(l)-167)/2} 11, ${57+(t(l)-167)/2}
          11, ${133+(t(l)-167)/2} 7, ${137+(t(l)-167)/2}
        `},null,8,ot),i("polygon",{fill:t(s)[0],filter:`url(#${n})`,points:`
          ${t(o)-7}, ${53+(t(l)-167)/2} ${t(o)-11}, ${57+(t(l)-167)/2}
          ${t(o)-11}, ${133+(t(l)-167)/2} ${t(o)-7}, ${137+(t(l)-167)/2}
        `},null,8,et)],8,w))]))}});const ct=k(it,[["__scopeId","data-v-4dd6360b"]]);export{ct as default};
