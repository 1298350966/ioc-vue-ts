import{r as A}from"./index-4e626338.js";/* empty css                    *//* empty css                  *//* empty css                *//* empty css                 *//* empty css               *//* empty css                     *//* empty css                  *//* empty css                        *//* empty css                     *//* empty css                  *//* empty css                        */import{d as L,f as Y,o as r,s as x,w as l,a as e,g as G,al as T,u as o,a0 as J,x as $,c,F as h,q as E,h as b,l as Q,k as H,a5 as j}from"./vue-65382a1b.js";import{Y as W}from"./index-55ccac47.js";import{_ as S}from"./CollapseItem.vue_vue_type_script_setup_true_name_CollapseItem_lang-3e00f931.js";import{_ as u}from"./SettingItem-0e9c370f.js";import{_ as i}from"./SettingItemBox-ce5066ee.js";/* empty css                        */import"./el-collapse-item-4ed993c7.js";/* empty css                 *//* empty css                   */import{i as X}from"./icon-24f36b03.js";/* empty css                                                                  *//* empty css                  */import"./el-tooltip-4ed993c7.js";/* empty css                        */import"./chartEditStore-8641b951.js";import"./vuedraggable-26823587.js";import{a1 as Z,ae as _,N as ee,ap as le,x as te,w as ae,k as oe,T as ne}from"./elementPlus-07602b2b.js";import{l as ue}from"./lodash-f91682a1.js";import{_ as se}from"./xgplayerVue-c27b6911.js";import"./vueRepl-a238c739.js";import"./vuema-115cb50e.js";import"./echarts-676dbcd6.js";/* empty css                                                                    */import"./Close-095524a6.js";import"./plugin-68db7aa1.js";const ie=L({__name:"TableStyleSetting",props:{styleOptions:{type:Object,required:!0}},emits:["update:styleOptions"],setup(t,{emit:V}){const k=t;return Y(()=>k.styleOptions,(v,m)=>{V("update:styleOptions",v)},{deep:!0}),(v,m)=>{const p=Z,g=u,w=i;return r(),x(w,{name:"表格"},{default:l(()=>[e(g,{name:"背景色"},{default:l(()=>[e(p,{size:"small",modes:["hex"],modelValue:t.styleOptions.bgColor,"onUpdate:modelValue":m[0]||(m[0]=d=>t.styleOptions.bgColor=d),"show-alpha":""},null,8,["modelValue"])]),_:1}),e(g,{name:"头部行背景色"},{default:l(()=>[e(p,{size:"small",modes:["hex"],modelValue:t.styleOptions.headerBgColor,"onUpdate:modelValue":m[1]||(m[1]=d=>t.styleOptions.headerBgColor=d),"show-alpha":""},null,8,["modelValue"])]),_:1}),e(g,{name:"头部行文字颜色"},{default:l(()=>[e(p,{size:"small",modes:["hex"],modelValue:t.styleOptions.headerTextColor,"onUpdate:modelValue":m[2]||(m[2]=d=>t.styleOptions.headerTextColor=d),"show-alpha":""},null,8,["modelValue"])]),_:1}),e(g,{name:"表格内容文字颜色"},{default:l(()=>[e(p,{size:"small",modes:["hex"],modelValue:t.styleOptions.textColor,"onUpdate:modelValue":m[3]||(m[3]=d=>t.styleOptions.textColor=d),"show-alpha":""},null,8,["modelValue"])]),_:1}),e(g,{name:"hover激活的行背景色"},{default:l(()=>[e(p,{size:"small",modes:["hex"],modelValue:t.styleOptions.rowHoverBgColor,"onUpdate:modelValue":m[4]||(m[4]=d=>t.styleOptions.rowHoverBgColor=d),"show-alpha":""},null,8,["modelValue"])]),_:1}),e(g,{name:"边框颜色"},{default:l(()=>[e(p,{size:"small",modes:["hex"],modelValue:t.styleOptions.borderColor,"onUpdate:modelValue":m[5]||(m[5]=d=>t.styleOptions.borderColor=d),"show-alpha":""},null,8,["modelValue"])]),_:1})]),_:1})}}}),me={class:"title-container"},de=L({__name:"config",props:{optionData:{type:Object,required:!0}},setup(t){const V=t,{AlignHorizontalLeftIcon:k,AlignHorizontalCenterIcon:v,AlignHorizontalRightIcon:m}=X.carbon,p=[{label:"小号",value:"small"},{label:"默认",value:"default"},{label:"大号",value:"large"}],g=[{label:"深色",value:"dark"},{label:"亮色",value:"light"}],w=[{label:"不固定",value:!1},{label:"固定左侧",value:"left"},{label:"固定右侧",value:"right"}],d=[{label:"sizes",value:"sizes"},{label:"prev",value:"prev"},{label:"pager",value:"pager"},{label:"next",value:"next"},{label:"jumper",value:"jumper"},{label:"total",value:"total"}],O=G({get(){return V.optionData.extAttrs.pagingAttrs.layout.split(",")},set(y){V.optionData.extAttrs.pagingAttrs.layout=y.join(",")}}),I=[{key:"left",lable:"局左",icon:A(k)},{key:"center",lable:"Y轴居中",icon:A(v)},{key:"right",lable:"局右",icon:A(m)}];function N(){let y=V.optionData.columns.length,n=ue.cloneDeep(W);n.attrs.label="字段"+y,n.attrs.prop="field"+y,V.optionData.columns.push(n)}function R(y){V.optionData.columns.length<=1||V.optionData.columns.splice(y,1)}return(y,n)=>{const z=_,f=ee,D=le,U=te,q=T("Plus"),B=ae,F=T("Minus"),P=oe,K=ne;return r(),x(K,null,{default:l(()=>[e(o(S),{name:"配置",expanded:!0},{default:l(()=>[e(o(i),{name:"高度边框"},{default:l(()=>[e(o(u),{name:"表格高度（px）"},{default:l(()=>[e(z,{modelValue:t.optionData.attrs.height,"onUpdate:modelValue":n[0]||(n[0]=a=>t.optionData.attrs.height=a),size:"small"},null,8,["modelValue"])]),_:1}),e(o(u),{name:"表格最大高度（px）"},{default:l(()=>[e(z,{modelValue:t.optionData.attrs.maxHeight,"onUpdate:modelValue":n[1]||(n[1]=a=>t.optionData.attrs.maxHeight=a),size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),e(o(i),null,{default:l(()=>[e(o(u),{name:"是否设置边框"},{default:l(()=>[e(f,{modelValue:t.optionData.attrs.border,"onUpdate:modelValue":n[2]||(n[2]=a=>t.optionData.attrs.border=a),size:"small"},null,8,["modelValue"])]),_:1}),e(o(u),{name:"是否设置斑马纹"},{default:l(()=>[e(f,{modelValue:t.optionData.attrs.stripe,"onUpdate:modelValue":n[3]||(n[3]=a=>t.optionData.attrs.stripe=a),size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),e(o(i),null,{default:l(()=>[e(o(u),{name:"是否高亮当前行"},{default:l(()=>[e(f,{modelValue:t.optionData.attrs.highlightCurrentRow,"onUpdate:modelValue":n[4]||(n[4]=a=>t.optionData.attrs.highlightCurrentRow=a),size:"small"},null,8,["modelValue"])]),_:1}),e(o(u),{name:"tooltip 主题"},{default:l(()=>[e(D,{modelValue:t.optionData.attrs.tooltipEffect,"onUpdate:modelValue":n[5]||(n[5]=a=>t.optionData.attrs.tooltipEffect=a),size:"small",options:g},null,8,["modelValue"])]),_:1})]),_:1}),e(o(i),{name:"rowKey",alone:!0},{default:l(()=>[e(o(u),null,{default:l(()=>[e(U,{modelValue:t.optionData.attrs.rowKey,"onUpdate:modelValue":n[6]||(n[6]=a=>t.optionData.attrs.rowKey=a),size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),e(o(i),{name:"空白描述",alone:!0},{default:l(()=>[e(o(u),null,{default:l(()=>[e(U,{modelValue:t.optionData.attrs.emptyText,"onUpdate:modelValue":n[7]||(n[7]=a=>t.optionData.attrs.emptyText=a),size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),e(o(i),{name:"是否排序",alone:!0},{default:l(()=>[e(o(u),null,{default:l(()=>[e(f,{modelValue:t.optionData.extAttrs.isShowSelection,"onUpdate:modelValue":n[8]||(n[8]=a=>t.optionData.extAttrs.isShowSelection=a),size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),e(o(i),{name:"是否多选",alone:!0},{default:l(()=>[e(o(u),null,{default:l(()=>[e(f,{modelValue:t.optionData.extAttrs.isShowIndex,"onUpdate:modelValue":n[9]||(n[9]=a=>t.optionData.extAttrs.isShowIndex=a),size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),e(o(i),{name:"是否分页",alone:!0},{default:l(()=>[e(o(u),null,{default:l(()=>[e(f,{modelValue:t.optionData.extAttrs.isPaging,"onUpdate:modelValue":n[10]||(n[10]=a=>t.optionData.extAttrs.isPaging=a),size:"small"},null,8,["modelValue"])]),_:1})]),_:1}),t.optionData.extAttrs.isPaging?(r(),x(o(i),{key:0,name:"分页设置"},{default:l(()=>[e(o(u),{name:"分页按钮背景"},{default:l(()=>[e(f,{modelValue:t.optionData.extAttrs.pagingAttrs.background,"onUpdate:modelValue":n[11]||(n[11]=a=>t.optionData.extAttrs.pagingAttrs.background=a)},null,8,["modelValue"])]),_:1}),e(o(u),{name:"只有一页隐藏分页"},{default:l(()=>[e(f,{modelValue:t.optionData.extAttrs.pagingAttrs.hideOnSinglePage,"onUpdate:modelValue":n[12]||(n[12]=a=>t.optionData.extAttrs.pagingAttrs.hideOnSinglePage=a)},null,8,["modelValue"])]),_:1}),e(o(u),{name:"最大页码按钮数"},{default:l(()=>[e(z,{modelValue:t.optionData.extAttrs.pagingAttrs.pagerCount,"onUpdate:modelValue":n[13]||(n[13]=a=>t.optionData.extAttrs.pagingAttrs.pagerCount=a),size:"small"},null,8,["modelValue"])]),_:1}),e(o(u),{name:"分页内容显示",alone:"true"},{default:l(()=>[e(D,{modelValue:o(O),"onUpdate:modelValue":n[14]||(n[14]=a=>J(O)?O.value=a:null),size:"small",multiple:"","collapse-tags":"",options:d},null,8,["modelValue"])]),_:1})]),_:1})):$("",!0)]),_:1}),e(o(S),{name:"样式",expanded:!0},{default:l(()=>[e(o(i),{name:"控件尺寸",alone:!0},{default:l(()=>[e(o(u),null,{default:l(()=>[e(D,{modelValue:t.optionData.attrs.size,"onUpdate:modelValue":n[15]||(n[15]=a=>t.optionData.attrs.size=a),size:"small",options:p},null,8,["modelValue"])]),_:1})]),_:1}),t.optionData.extAttrs.isPaging?(r(),x(o(i),{key:0,name:"分页控件尺寸",alone:!0},{default:l(()=>[e(o(u),null,{default:l(()=>[e(D,{modelValue:t.optionData.attrs.size,"onUpdate:modelValue":n[16]||(n[16]=a=>t.optionData.attrs.size=a),size:"small",options:p},null,8,["modelValue"])]),_:1})]),_:1})):$("",!0),e(o(ie),{styleOptions:t.optionData.style,"onUpdate:styleOptions":n[17]||(n[17]=a=>t.optionData.style=a)},null,8,["styleOptions"])]),_:1}),(r(!0),c(h,null,E(t.optionData.columns,(a,C)=>(r(),x(o(S),{key:C,name:`列-${C+1}`},{header:l(()=>[b("div",me,[b("span",null,"列-"+Q(C+1),1),b("div",null,[e(B,{onClick:n[18]||(n[18]=H(s=>N(),["stop"]))},{default:l(()=>[e(q)]),_:1}),e(B,{onClick:H(s=>R(C),["stop"])},{default:l(()=>[e(F)]),_:2},1032,["onClick"])])])]),default:l(()=>[e(o(i),{name:"映射"},{default:l(()=>[e(o(u),{name:"绑定字段"},{default:l(()=>[e(U,{size:"small",modelValue:a.attrs.prop,"onUpdate:modelValue":s=>a.attrs.prop=s},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),e(o(u),{name:"列名"},{default:l(()=>[e(U,{size:"small",modelValue:a.attrs.label,"onUpdate:modelValue":s=>a.attrs.label=s},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024)]),_:2},1024),e(o(i),{name:"列宽(px)"},{default:l(()=>[e(z,{size:"small",modelValue:a.attrs.width,"onUpdate:modelValue":s=>a.attrs.width=s},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024),e(o(i),{name:"文本"},{default:l(()=>[e(o(u),{name:"是否溢出省略"},{default:l(()=>[e(f,{size:"small",modelValue:a.attrs.showOverflowTooltip,"onUpdate:modelValue":s=>a.attrs.showOverflowTooltip=s},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024)]),_:2},1024),e(o(i),{name:"对齐方式",alone:!0},{default:l(()=>[e(o(u),{name:"内容对齐"},{default:l(()=>[b("div",null,[(r(),c(h,null,E(I,s=>e(P,{type:a.attrs.align==s.key?"primary":"",key:s.key,onClick:M=>a.attrs.align=s.key},{icon:l(()=>[(r(),x(j(s.icon)))]),_:2},1032,["type","onClick"])),64))])]),_:2},1024),e(o(u),{name:"表头对齐"},{default:l(()=>[b("div",null,[(r(),c(h,null,E(I,s=>e(P,{type:a.attrs.headerAlign==s.key?"primary":"",key:s.key,onClick:M=>a.attrs.headerAlign=s.key},{icon:l(()=>[(r(),x(j(s.icon)))]),_:2},1032,["type","onClick"])),64))])]),_:2},1024)]),_:2},1024),e(o(i),{name:"列固定",alone:!0},{default:l(()=>[e(o(u),null,{default:l(()=>[e(D,{modelValue:a.attrs.fixed,"onUpdate:modelValue":s=>a.attrs.fixed=s,size:"small",options:w},null,8,["modelValue","onUpdate:modelValue"])]),_:2},1024)]),_:2},1024)]),_:2},1032,["name"]))),128))]),_:1})}}});const Je=se(de,[["__scopeId","data-v-9451615c"]]);export{Je as default};