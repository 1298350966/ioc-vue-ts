import{_ as y}from"./vueRepl-a238c739.js";import{g as $}from"./index-4e626338.js";/* empty css                    *//* empty css                *//* empty css                 *//* empty css                  *//* empty css                        *//* empty css                 *//* empty css                  *//* empty css                 *//* empty css                        *//* empty css                          *//* empty css                    *//* empty css               *//* empty css                     *//* empty css                  *//* empty css                        *//* empty css                     */import{d as lo,r as X,a7 as co,g as oo,o as f,c as Y,a as e,w as a,a6 as O,u as o,s as _,h as b,a3 as Do,a0 as vo,x as E,aJ as V,b as q,al as yo,F as eo,q as ao,l as Vo,k as x}from"./vue-65382a1b.js";import{T as d,L as J,V as to,F as I,c as _o,I as go,a as Eo}from"./config-d82a35a6.js";import{_ as g}from"./CollapseItem.vue_vue_type_script_setup_true_name_CollapseItem_lang-3e00f931.js";import{_ as p}from"./SettingItem-0e9c370f.js";import{_ as D}from"./SettingItemBox-ce5066ee.js";import"./el-collapse-item-4ed993c7.js";/* empty css                   *//* empty css                                                                  *//* empty css                  */import"./el-tooltip-4ed993c7.js";/* empty css                        */import"./chartEditStore-8641b951.js";import"./vuedraggable-26823587.js";import{l as j}from"./lodash-f91682a1.js";import{_ as Oo}from"./index-806da9dd.js";/* empty css              */import{o as bo,E as wo,q as Lo}from"./vuema-115cb50e.js";import{k as ko,ap as ho,x as Co,Y as xo,Z as Io,ae as Ao,H as Go,J as Uo,a1 as So,N as Po,n as Ro,w as To,T as No}from"./elementPlus-07602b2b.js";import"./xgplayerVue-c27b6911.js";import"./index-55ccac47.js";import"./echarts-676dbcd6.js";/* empty css                                                                    */import"./plugin-68db7aa1.js";/* empty css                   */const zo={class:"editPolygonPath"},Ko={style:{height:"70vh",width:"100%"}},Mo=lo({__name:"editPolygon",props:{optionData:{type:Object,required:!0}},setup(t){const r=t,c=X(!1);let{amapKey:A,amapStyleKey:G,amapLon:U,amapLat:S,amapZindex:P,lang:R,amapStyleKeyCustom:w,features:T,viewMode:N,pitch:z,skyColor:K}=co(r.optionData.mapOptions);const s=oo(()=>[U.value,S.value]),M=oo(()=>`amap://styles/${w.value!==""?w.value:G.value}`);bo({key:A.value,securityJsCode:"securityJsCode"});const v=X([]);function m(){v.value=r.optionData.mask.polygonOptions.path[1]||[],c.value=!0}function W(){r.optionData.mask.polygonOptions.path[1]=v.value,c.value=!1}function B(u){console.log(u),u.length==0?console.log(v):v.value=u}return(u,L)=>{const k=ko,i=Oo;return f(),Y("div",zo,[e(k,{size:"small",onClick:m},{default:a(()=>[O("编辑")]),_:1}),o(c)?(f(),_(i,{key:0,title:"多边形配置",modelValue:o(c),"onUpdate:modelValue":L[0]||(L[0]=n=>vo(c)?c.value=n:null),width:"75%",top:"10vh"},{footer:a(()=>[e(k,{type:"primary",onClick:W},{default:a(()=>[O("保存")]),_:1})]),default:a(()=>[b("div",Ko,[e(o(wo),{"resize-enable":!0,center:o(s),zoom:o(P),"map-style":o(M),lang:o(R),features:o(T),"view-mode":o(N),pitch:o(z),"sky-color":o(K)},{default:a(()=>[e(o(Lo),Do(o(r).optionData.mask.polygonOptions,{editable:!0,path:o(v),"onUpdate:path":B}),null,16,["path"])]),_:1},8,["center","zoom","map-style","lang","features","view-mode","pitch","sky-color"])])]),_:1},8,["modelValue"])):E("",!0)])}}}),Wo=b("span",null,"遮罩",-1),Bo=b("span",null,"控件",-1),Fo=b("span",null,"覆盖物组",-1),Ho=b("span",null,"信息窗体",-1),Se=lo({__name:"config",props:{optionData:{type:Object,required:!0}},setup(t){const r=t,c=V(()=>y(()=>import("./coverGroupDialog-36b4035d.js"),["static/js/coverGroupDialog-36b4035d.js","static/js/vueRepl-a238c739.js","static/js/vue-65382a1b.js","static/js/lodash-f91682a1.js","static/js/index-806da9dd.js","static/js/index-4e626338.js","static/js/elementPlus-07602b2b.js","static/js/vuema-115cb50e.js","static/js/xgplayerVue-c27b6911.js","static/css/index-bc362552.css","static/css/index-a29e27ad.css","static/css/el-overlay-1d67a486.css","static/js/index.vue_vue_type_script_setup_true_lang-e6b83052.js","static/js/config-d82a35a6.js","static/js/index-55ccac47.js","static/js/echarts-676dbcd6.js","static/js/useAddEvent.kooks-e46e3810.js","static/js/axios-ba46900f.js","static/js/axios-e76ab20a.js","static/js/useEvent.hook-afeb4a8c.js","static/js/useChartDataFetch.hook-495a5af9.js","static/js/http-0d114cdb.js","static/js/useAmapHooks-baae6444.js","static/css/coverGroupDialog-dae7fa7c.css","static/css/el-button-46bfe638.css","static/css/el-main-f5c6a819.css","static/css/el-scrollbar-df5aa9a0.css","static/css/el-tab-pane-eecd8b5a.css","static/css/style-ff29b757.css"])),A=V(()=>y(()=>import("./coverGroupList-1753b55f.js"),["static/js/coverGroupList-1753b55f.js","static/js/vueRepl-a238c739.js","static/js/vue-65382a1b.js","static/js/lodash-f91682a1.js","static/js/index-4e626338.js","static/js/elementPlus-07602b2b.js","static/js/vuema-115cb50e.js","static/js/xgplayerVue-c27b6911.js","static/css/index-bc362552.css","static/js/config-d82a35a6.js","static/js/index-55ccac47.js","static/js/echarts-676dbcd6.js","static/css/coverGroupList-eded3839.css","static/css/el-space-417b6673.css","static/css/el-icon-b1770749.css","static/css/el-switch-4d96cdcc.css","static/css/el-tag-2fca7a82.css","static/css/el-empty-743b38f5.css"])),G=V(()=>y(()=>import("./controlGroupDialog-45583f14.js"),["static/js/controlGroupDialog-45583f14.js","static/js/vueRepl-a238c739.js","static/js/vue-65382a1b.js","static/js/lodash-f91682a1.js","static/js/index-806da9dd.js","static/js/index-4e626338.js","static/js/elementPlus-07602b2b.js","static/js/vuema-115cb50e.js","static/js/xgplayerVue-c27b6911.js","static/css/index-bc362552.css","static/css/index-a29e27ad.css","static/css/el-overlay-1d67a486.css","static/js/useAmapHooks-baae6444.js","static/css/controlGroupDialog-c9c856be.css","static/css/el-button-46bfe638.css","static/css/el-main-f5c6a819.css","static/css/el-scrollbar-df5aa9a0.css","static/css/el-tab-pane-eecd8b5a.css","static/css/style-ff29b757.css"])),U=V(()=>y(()=>import("./controlGroupList-3782ddee.js"),["static/js/controlGroupList-3782ddee.js","static/js/vueRepl-a238c739.js","static/js/vue-65382a1b.js","static/js/lodash-f91682a1.js","static/js/index-4e626338.js","static/js/elementPlus-07602b2b.js","static/js/vuema-115cb50e.js","static/js/xgplayerVue-c27b6911.js","static/css/index-bc362552.css","static/js/config-d82a35a6.js","static/js/index-55ccac47.js","static/js/echarts-676dbcd6.js","static/css/controlGroupList-acbcb8e4.css","static/css/el-space-417b6673.css","static/css/el-icon-b1770749.css","static/css/el-tag-2fca7a82.css","static/css/el-empty-743b38f5.css"])),S=V(()=>y(()=>import("./PolygonConfig-0e11b43c.js"),["static/js/PolygonConfig-0e11b43c.js","static/js/index-4e626338.js","static/js/vue-65382a1b.js","static/js/elementPlus-07602b2b.js","static/js/vuema-115cb50e.js","static/js/lodash-f91682a1.js","static/js/xgplayerVue-c27b6911.js","static/js/vueRepl-a238c739.js","static/css/index-bc362552.css","static/js/SettingItem-0e9c370f.js","static/css/el-space-417b6673.css","static/css/SettingItem-a3b6dbf3.css","static/css/el-input-9bb615ea.css","static/css/el-tag-2fca7a82.css","static/css/el-scrollbar-df5aa9a0.css","static/css/el-popper-b17b6765.css","static/css/el-virtual-list-54336272.css","static/css/el-select-v2-ed199d64.css","static/css/el-color-picker-242b5ded.css","static/css/el-button-46bfe638.css","static/css/el-input-number-e34b49f4.css","static/css/el-switch-4d96cdcc.css"])),P=V(()=>y(()=>import("./index-3e077deb.js"),["static/js/index-3e077deb.js","static/js/index-806da9dd.js","static/js/index-4e626338.js","static/js/vue-65382a1b.js","static/js/elementPlus-07602b2b.js","static/js/vuema-115cb50e.js","static/js/lodash-f91682a1.js","static/js/xgplayerVue-c27b6911.js","static/js/vueRepl-a238c739.js","static/css/index-bc362552.css","static/css/index-a29e27ad.css","static/css/el-overlay-1d67a486.css","static/js/index-6f99bf85.js","static/js/useAmapHooks-baae6444.js","static/js/EditorWorker.vue_vue_type_script_setup_true_lang-44860150.js","static/js/editorWorker-7e4b3ef6.js","static/css/EditorWorker-386f89c2.css","static/js/index-dde95f94.js","static/js/views-99f1c264.js","static/js/axios-ba46900f.js","static/js/axios-e76ab20a.js","static/js/index-7dcd76df.js","static/css/index-9be28c75.css","static/css/el-button-46bfe638.css","static/css/el-tab-pane-eecd8b5a.css","static/css/el-image-viewer-6764fba4.css","static/js/SettingItem-0e9c370f.js","static/css/el-space-417b6673.css","static/css/SettingItem-a3b6dbf3.css","static/css/index-0a18dc44.css","static/css/el-main-f5c6a819.css","static/css/el-scrollbar-df5aa9a0.css","static/css/style-ff29b757.css","static/css/el-card-208b2445.css","static/css/el-input-9bb615ea.css","static/css/el-tag-2fca7a82.css","static/css/el-select-0b32213c.css","static/css/el-popper-b17b6765.css","static/css/el-virtual-list-54336272.css","static/css/el-select-v2-ed199d64.css","static/css/el-input-number-e34b49f4.css","static/css/el-switch-4d96cdcc.css"])),R=V(()=>y(()=>import("./InfoWindowList-4495af6e.js"),["static/js/InfoWindowList-4495af6e.js","static/js/vueRepl-a238c739.js","static/js/vue-65382a1b.js","static/js/lodash-f91682a1.js","static/js/index-4e626338.js","static/js/elementPlus-07602b2b.js","static/js/vuema-115cb50e.js","static/js/xgplayerVue-c27b6911.js","static/css/index-bc362552.css","static/css/InfoWindowList-6a99b205.css","static/css/el-space-417b6673.css","static/css/el-icon-b1770749.css","static/css/el-tag-2fca7a82.css","static/css/el-empty-743b38f5.css"])),w=[{value:d.NORMAL,label:"标准"},{value:d.DARK,label:"幻影黑"},{value:d.LIGHT,label:"月光银"},{value:d.WHITES_MOKE,label:"远山黛"},{value:d.FRESH,label:"草色青"},{value:d.GREY,label:"雅士灰"},{value:d.GRAFFITI,label:"涂鸦"},{value:d.MACARON,label:"马卡龙"},{value:d.BLUE,label:"靛青蓝"},{value:d.DARKBLUE,label:"极夜蓝"},{value:d.WINE,label:"酱籽"}],T=[{value:J.ZH_CN,label:"中文简体"},{value:J.EN,label:"英文"},{value:J.ZH_EN,label:"中英文对照"}],N=[{value:to.PLANE,label:"2D"},{value:to.STEREOSCOPIC,label:"3D"}],z=[{value:I.BG,label:"显示地图背景"},{value:I.POINT,label:"显示标识"},{value:I.ROAD,label:"显示道路"},{value:I.BUILDING,label:"显示建筑"}],K=[{value:"ElAmapLayerDefault",label:"默认图层"},{value:"ElAmapLayerTile",label:"切片图层"},{value:"ElAmapLayerTraffic",label:"实时交通图层"},{value:"ElAmapLayerSatellite",label:"卫星图层"},{value:"ElAmapLayerRoadNet",label:"路网图层"},{value:"ElAmapLayerBuildings",label:"建筑楼块3D图层"},{value:"ElAmapLayerDistrict",label:"简易行政区划图层"},{value:"ElAmapLayerIndoorMap",label:"室内图层"}],s=q({show:!1,config:null});function M(){s.config=j.cloneDeep(_o);const i=$();s.config.id=i,s.config.name=i,s.show=!0}function v(i){r.optionData.coverGroupList.push(i),s.show=!1}const m=q({show:!1,config:null});function W(){m.config=j.cloneDeep(go);const i=$();m.config.id=i,m.config.name=i,m.show=!0}function B(i){r.optionData.InfoWindowList.push(i),m.show=!1}const u=q({show:!1,config:null});function L(){u.config=j.cloneDeep(Eo);const i=$();u.config.id=i,u.config.name=i,u.show=!0}function k(i){r.optionData.controlGroupList.push(i),u.show=!1}return(i,n)=>{const F=ho,Q=Co,no=xo,io=Io,h=Ao,uo=Go,po=Uo,so=So,mo=Po,C=Ro,H=yo("Plus"),Z=To,ro=No;return f(),_(ro,null,{default:a(()=>[e(o(g),{name:"基础",expanded:!0},{default:a(()=>[e(o(D),{name:"语言类型",alone:!0},{default:a(()=>[e(o(p),null,{default:a(()=>[e(F,{size:"small",modelValue:t.optionData.mapOptions.lang,"onUpdate:modelValue":n[0]||(n[0]=l=>t.optionData.mapOptions.lang=l),options:T},null,8,["modelValue"])]),_:1})]),_:1}),e(o(D),{name:"Key",alone:!0},{default:a(()=>[e(o(p),{name:"请务必使用自己的高德应用 key"},{default:a(()=>[e(Q,{modelValue:t.optionData.mapOptions.amapKey,"onUpdate:modelValue":n[1]||(n[1]=l=>t.optionData.mapOptions.amapKey=l),size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),e(o(D),{name:"定义图层",alone:!0},{default:a(()=>[e(o(p),null,{default:a(()=>[e(F,{modelValue:t.optionData.mapOptions.amapStyleKeyCustom,"onUpdate:modelValue":n[2]||(n[2]=l=>t.optionData.mapOptions.amapStyleKeyCustom=l),options:K,placeholder:"请选择",style:{width:"240px","vertical-align":"middle"},"allow-create":"",filterable:"",clearable:"",size:"small"},null,8,["modelValue"])]),_:1}),t.optionData.mapOptions.amapStyleKeyCustom==="ElAmapLayerTile"?(f(),_(o(p),{key:0,name:"切片图层地址"},{default:a(()=>[e(Q,{size:"small",modelValue:t.optionData.mapOptions.layerOptions.tileUrl,"onUpdate:modelValue":n[3]||(n[3]=l=>t.optionData.mapOptions.layerOptions.tileUrl=l)},null,8,["modelValue"])]),_:1})):E("",!0)]),_:1})]),_:1}),e(o(g),{name:"地图",expanded:!0},{default:a(()=>[e(o(D),{name:"主题"},{default:a(()=>[e(o(p),null,{default:a(()=>[e(F,{size:"small",modelValue:t.optionData.mapOptions.amapStyleKey,"onUpdate:modelValue":n[4]||(n[4]=l=>t.optionData.mapOptions.amapStyleKey=l),options:w},null,8,["modelValue"])]),_:1})]),_:1}),e(o(D),{name:"内容",alone:!0},{default:a(()=>[e(io,{modelValue:t.optionData.mapOptions.features,"onUpdate:modelValue":n[5]||(n[5]=l=>t.optionData.mapOptions.features=l)},{default:a(()=>[(f(),Y(eo,null,ao(z,(l,fo)=>e(no,{value:l.value,label:l.label,key:fo},null,8,["value","label"])),64))]),_:1},8,["modelValue"])]),_:1}),e(o(D),{name:"位置"},{default:a(()=>[e(o(p),{name:"经度"},{default:a(()=>[e(h,{modelValue:t.optionData.mapOptions.amapLon,"onUpdate:modelValue":n[6]||(n[6]=l=>t.optionData.mapOptions.amapLon=l),"show-button":!1,size:"small"},{suffix:a(()=>[O("°")]),_:1},8,["modelValue"])]),_:1}),e(o(p),{name:"纬度"},{default:a(()=>[e(h,{modelValue:t.optionData.mapOptions.amapLat,"onUpdate:modelValue":n[7]||(n[7]=l=>t.optionData.mapOptions.amapLat=l),"show-button":!1,size:"small"},{suffix:a(()=>[O("°")]),_:1},8,["modelValue"])]),_:1}),e(o(p),{name:"初始缩放"},{default:a(()=>[e(h,{modelValue:t.optionData.mapOptions.amapZindex,"onUpdate:modelValue":n[8]||(n[8]=l=>t.optionData.mapOptions.amapZindex=l),min:0,size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),e(o(D),{name:"模式",alone:!0},{default:a(()=>[e(o(p),null,{default:a(()=>[e(po,{modelValue:t.optionData.mapOptions.viewMode,"onUpdate:modelValue":n[9]||(n[9]=l=>t.optionData.mapOptions.viewMode=l),name:"radiogroup"},{default:a(()=>[(f(),Y(eo,null,ao(N,l=>e(uo,{label:l.value,value:l.value},{default:a(()=>[O(Vo(l.label),1)]),_:2},1032,["label","value"])),64))]),_:1},8,["modelValue"])]),_:1})]),_:1}),t.optionData.mapOptions.viewMode==="3D"?(f(),_(o(D),{key:0},{default:a(()=>[e(o(p),{name:"天空色"},{default:a(()=>[e(so,{size:"small",modelValue:t.optionData.mapOptions.skyColor,"onUpdate:modelValue":n[10]||(n[10]=l=>t.optionData.mapOptions.skyColor=l),"show-alpha":""},null,8,["modelValue"])]),_:1}),e(o(p),{name:"俯仰角"},{default:a(()=>[e(h,{modelValue:t.optionData.mapOptions.pitch,"onUpdate:modelValue":n[11]||(n[11]=l=>t.optionData.mapOptions.pitch=l),min:0,max:83,size:"small"},null,8,["modelValue"])]),_:1})]),_:1})):E("",!0)]),_:1}),e(o(g),{name:"遮罩",expanded:!0},{header:a(()=>[e(C,{class:"kh-flex-between flex-1"},{default:a(()=>[Wo,e(mo,{size:"small",onClick:n[12]||(n[12]=x(()=>{},["stop"])),modelValue:t.optionData.mask.enable,"onUpdate:modelValue":n[13]||(n[13]=l=>t.optionData.mask.enable=l)},null,8,["modelValue"])]),_:1})]),default:a(()=>[e(o(p),{name:"遮罩轮廓编辑"},{default:a(()=>[e(Mo,{optionData:t.optionData},null,8,["optionData"])]),_:1}),e(o(S),{options:t.optionData.mask.polygonOptions},null,8,["options"])]),_:1}),e(o(g),{name:"控件",expanded:!0},{header:a(()=>[e(C,{class:"kh-flex-between flex-1"},{default:a(()=>[Bo,e(Z,{onClick:x(L,["stop"])},{default:a(()=>[e(H)]),_:1},8,["onClick"])]),_:1})]),default:a(()=>[e(o(U),{controlGroupList:o(r).optionData.controlGroupList,optionData:t.optionData},null,8,["controlGroupList","optionData"]),o(u).show?(f(),_(o(G),{key:0,modelValue:o(u).show,"onUpdate:modelValue":n[14]||(n[14]=l=>o(u).show=l),config:o(u).config,optionData:t.optionData,onSave:k},null,8,["modelValue","config","optionData"])):E("",!0)]),_:1}),e(o(g),{name:"覆盖物群组",expanded:!0},{header:a(()=>[e(C,{class:"kh-flex-between flex-1"},{default:a(()=>[Fo,e(Z,{onClick:x(M,["stop"])},{default:a(()=>[e(H)]),_:1},8,["onClick"])]),_:1})]),default:a(()=>[e(o(A),{coverGroupList:o(r).optionData.coverGroupList,optionData:t.optionData},null,8,["coverGroupList","optionData"]),o(s).show?(f(),_(o(c),{key:0,modelValue:o(s).show,"onUpdate:modelValue":n[15]||(n[15]=l=>o(s).show=l),config:o(s).config,optionData:t.optionData,onSave:v},null,8,["modelValue","config","optionData"])):E("",!0)]),_:1}),e(o(g),{name:"信息窗体",expanded:!0},{header:a(()=>[e(C,{class:"kh-flex-between flex-1"},{default:a(()=>[Ho,e(Z,{onClick:x(W,["stop"])},{default:a(()=>[e(H)]),_:1},8,["onClick"])]),_:1})]),default:a(()=>[e(o(R),{InfoWindowList:t.optionData.InfoWindowList,optionData:t.optionData},null,8,["InfoWindowList","optionData"]),o(m).show?(f(),_(o(P),{key:0,modelValue:o(m).show,"onUpdate:modelValue":n[16]||(n[16]=l=>o(m).show=l),config:o(m).config,optionData:t.optionData,onSave:B},null,8,["modelValue","config","optionData"])):E("",!0)]),_:1})]),_:1})}}});export{Se as default};