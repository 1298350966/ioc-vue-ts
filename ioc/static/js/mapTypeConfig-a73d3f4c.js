import{_ as r}from"./SettingItem-0e9c370f.js";import"./index-4e626338.js";/* empty css                 *//* empty css               *//* empty css                     *//* empty css                  *//* empty css                        *//* empty css                     */import{ap as u}from"./elementPlus-07602b2b.js";import{d as s,o as c,c as v,a as o,w as i}from"./vue-65382a1b.js";/* empty css                 *//* empty css                                                                    */import"./xgplayerVue-c27b6911.js";import"./vueRepl-a238c739.js";import"./lodash-f91682a1.js";import"./vuema-115cb50e.js";const O=s({__name:"mapTypeConfig",props:{options:{type:Object,required:!0}},setup(t){const n=[{value:"topright",label:"右上"},{value:"topleft",label:"左上"},{value:"bottomright",label:"右下"},{value:"bottomleft",label:"左下"}],m=[{value:{title:"地图",icon:"http://api.tianditu.gov.cn/v4.0/image/map/maptype/vector.png",layer:"TMAP_NORMAL_MAP"},label:"地图"},{value:{title:"卫星",icon:" http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellite.png",layer:"TMAP_SATELLITE_MAP"},label:"卫星"},{value:{title:"卫星混合",icon:"http://api.tianditu.gov.cn/v4.0/image/map/maptype/satellitepoi.png",layer:"TMAP_HYBRID_MAP"},label:"卫星混合"},{value:{title:"地形",icon:"http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrain.png",layer:"TMAP_TERRAIN_MAP"},label:"地形"},{value:{title:"地形混合",icon:"http://api.tianditu.gov.cn/v4.0/image/map/maptype/terrainpoi.png",layer:"TMAP_TERRAIN_HYBRID_MAP"},label:"地形混合"}];return(d,e)=>{const l=u,p=r;return c(),v("div",null,[o(p,{name:"位置"},{default:i(()=>[o(l,{modelValue:t.options.position,"onUpdate:modelValue":e[0]||(e[0]=a=>t.options.position=a),options:n},null,8,["modelValue"])]),_:1}),o(p,{name:"地图类型"},{default:i(()=>[o(l,{modelValue:t.options.mapTypes,"onUpdate:modelValue":e[1]||(e[1]=a=>t.options.mapTypes=a),multiple:"",clearable:"",options:m,placeholder:"请选择","value-key":"value.layer"},null,8,["modelValue"])]),_:1})])}}});export{O as default};