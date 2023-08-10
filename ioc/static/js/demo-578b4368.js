import"./index-4e626338.js";/* empty css                 */import{g as _,_ as b}from"./config-819cfcac.js";import{_ as u}from"./config-198f63cf.js";import{d as y,_ as v,a as S,b as D}from"./index-ed5dbb37.js";import{_ as h}from"./index-3a52cf45.js";import{_ as k}from"./config-3a39b492.js";import{_ as I}from"./config-128e5cf4.js";import{_ as x}from"./index-7a053113.js";import{_ as w}from"./publicConfig-0dc9cccb.js";import{f as O}from"./index-55ccac47.js";import{F as C}from"./type-ae7fe4c5.js";import"./axios-ba46900f.js";import"./echarts-676dbcd6.js";import"./lodash-f91682a1.js";import{_ as A}from"./xgplayerVue-c27b6911.js";import{d as m,c,l as T,o as g,b as l,r as G,a as p,u as s,a0 as N}from"./vue-65382a1b.js";import{x as B}from"./elementPlus-07602b2b.js";import"./vueRepl-a238c739.js";import"./vuema-115cb50e.js";/* empty css                    *//* empty css                */import"./index-dde95f94.js";import"./index-806da9dd.js";/* empty css                   *//* empty css                  *//* empty css                    *//* empty css                        */import"./views-99f1c264.js";import"./index-7dcd76df.js";/* empty css               *//* empty css                  *//* empty css                     *//* empty css                  */import"./el-collapse-item-4ed993c7.js";import"./SettingItemBox-ce5066ee.js";/* empty css                 *//* empty css                  */import"./SettingItem-0e9c370f.js";/* empty css                                                                    */import"./EditorWorker.vue_vue_type_script_setup_true_lang-44860150.js";import"./editorWorker-7e4b3ef6.js";import"./index.vue_vue_type_script_setup_true_lang-25ca69b6.js";import"./config-a9477480.js";import"./axios-e76ab20a.js";const J=Object.freeze(Object.defineProperty({__proto__:null},Symbol.toStringTag,{value:"Module"})),P=`import cloneDeep from 'lodash/cloneDeep'
import { GlobalDialogType } from '../type'
import { publicOption } from '../publicConfig'


// export const option = {
//   id: "",
//   name: "",
//   component: "darkDialog",
//   show: false,
//   attrs: {
//     title: "",
//     width: "60%",
//     fullscreen: false,
//     top: "15vh",
//     modal: true,
//     draggable: false
//   },
//   body: {
//     height: "60vh",
//     type: "component",  //component iframe
//     attrs: {},
//     component: {
//       is: "",
//     },
//     iframe: {
//       src: "",

//     },
//   }
// }
export const getGlobalDialogConfig = () => {

  return cloneDeep(publicOption)
}
export default class GlobalDialogConfig {
  public option = getGlobalDialogConfig()
}


`,j=`<template>\r
  <el-collapse v-model="collapseActive">\r
    <el-collapse-item name="1" title="弹窗设置">\r
      <SettingItemBox style="margin: 0">\r
        <SettingItem name="标题">\r
          <el-input v-model="optionData.attrs.title"></el-input>\r
        </SettingItem>\r
        <SettingItem name="宽度">\r
          <el-input v-model="optionData.attrs.width"></el-input>\r
        </SettingItem>\r
        <SettingItem name="头部位置">\r
          <el-input v-model="optionData.attrs.top"></el-input>\r
        </SettingItem>\r
        <SettingItem name="全屏">\r
          <el-switch v-model="optionData.attrs.fullscreen"></el-switch>\r
        </SettingItem>\r
        <SettingItem name="遮罩层">\r
          <el-switch v-model="optionData.attrs.modal"></el-switch>\r
        </SettingItem>\r
        <SettingItem name="拖拽功能">\r
          <el-switch v-model="optionData.attrs.draggable"></el-switch>\r
        </SettingItem>\r
        <SettingItem name="显示">\r
          <el-switch v-model="optionData.show"></el-switch>\r
        </SettingItem>\r
      </SettingItemBox>\r
    </el-collapse-item>\r
\r
    <el-collapse-item name="2" title="内容设置">\r
      <SettingItemBox style="margin: 0">\r
        <SettingItem name="类型">\r
          <el-select v-model="optionData.body.type">\r
            <el-option v-for="item in bodyTypeOptions" :key="item.value" :label="item.label" :value="item.value" />\r
          </el-select>\r
        </SettingItem>\r
        <template v-if="optionData.body.type === 'component'">\r
          <SettingItem name="组件名称">\r
            <el-input v-model="optionData.body.component.is">\r
              <template #append>\r
              <el-button icon="Tools" @click="componentSelectShow = true" />\r
            </template>\r
            </el-input>\r
            <componentSelect v-model:show="componentSelectShow" @select="componentSelectFun"></componentSelect>\r
          </SettingItem>\r
        </template>\r
        <template v-else-if="optionData.body.type === 'iframe'">\r
          <SettingItem name="链接地址">\r
            <el-input v-model="optionData.body.iframe.src"></el-input>\r
          </SettingItem>\r
        </template>\r
      </SettingItemBox>\r
      <SettingItemBox alone style="margin: 0">\r
        <SettingItem name="组件传参">\r
          <el-card body-style="padding:0">\r
            <monaco-editor height="300px" v-model:modelValue="componentAttrsStr" language="json" :editorOptions="{\r
              lineNumbers: 'on',\r
              minimap: { enabled: true },\r
            }" @blur="setComponentAttrs" />\r
          </el-card>\r
        </SettingItem>\r
      </SettingItemBox>\r
    </el-collapse-item>\r
  </el-collapse>\r
</template>\r
\r
<script lang="ts" setup>\r
import { GlobalDialogType } from "../type";\r
import { Json } from "@vicons/carbon";\r
import { JSONParse, JSONStringify } from "@/utils";\r
import { MonacoEditor } from "@/components/Pages/MonacoEditor";\r
const props = defineProps({\r
  optionData: {\r
    type: Object as PropType<GlobalDialogType>,\r
    required: true,\r
  },\r
});\r
const collapseActive = ["1", "2"];\r
const componentSelectShow = ref(false)\r
const componentAttrsStr = ref(\r
  JSONStringify(props.optionData.body.attrs)\r
);\r
function setComponentAttrs() {\r
  try {\r
    props.optionData.body.attrs = JSONParse(componentAttrsStr.value);\r
  } catch (error) {\r
    componentAttrsStr.value = JSON.stringify(\r
      props.optionData.body.attrs\r
    );\r
  }\r
}\r
\r
const bodyTypeOptions = [\r
  { value: "component", label: "内部组件" },\r
  { value: "iframe", label: "嵌入页面" },\r
];\r
\r
function componentSelectFun(data) {\r
  props.optionData.body.component.is = ""\r
  nextTick(() => {\r
    props.optionData.body.component.is = data.componentName\r
  });\r
  props.optionData.body.attrs = data.props\r
  componentAttrsStr.value = JSONStringify(props.optionData.body.attrs)\r
}\r
<\/script>\r
\r
<style scoped></style>\r
`,E=`export const darkDialogConfig = {\r
  key: 'darkDialog',\r
  title: '弹窗一',\r
}\r
`,M=`<template>\r
  <div>\r
    <el-dialog v-model="config.show" custom-class="dragDialogClass" v-bind="config.attrs" :append-to-body="false">\r
      <div :style="{ height: config.body.height }">\r
        <component-iframe :type="config.body.type" :attrs="config.body.attrs" :component="config.body.component" :iframe="config.body.iframe" @message="ComponentIframeMessage"></component-iframe>\r
      </div>\r
    </el-dialog>\r
  </div>\r
</template>\r
\r
<script setup lang="ts">\r
const props = defineProps({\r
  config: {\r
    type: Object,\r
    required: true,\r
  },\r
});\r
\r
function ComponentIframeMessage(data){\r
  if(typeof data == "string"){\r
    switch (data) {\r
      case "closeDialog":\r
        props.config.show = false\r
        return \r
      default:\r
        return\r
    }\r
  }\r
}\r
<\/script>\r
\r
<style lang="scss" scoped>\r
\r
\r
:deep(.dragDialogClass) {\r
  background: #0e3f5fe7;\r
\r
  .el-dialog__body {\r
    padding: 10px;\r
  }\r
  .content {\r
    width: 100%;\r
    height: 100%;\r
    border: none;\r
  }\r
}\r
</style>\r
`,V=`import cloneDeep from 'lodash/cloneDeep'
import { GlobalDialogType } from '../type'
import { publicOption } from '../publicConfig'
export const getGlobalDialogConfig = () => {

  return cloneDeep(publicOption)
}
export default class GlobalDialogConfig {
  public option = getGlobalDialogConfig()
}


`,$=`<template>\r
  <el-collapse v-model="collapseActive">\r
    <el-collapse-item name="1" title="弹窗设置">\r
      <SettingItemBox style="margin: 0">\r
        <SettingItem name="标题">\r
          <el-input v-model="optionData.attrs.title"></el-input>\r
        </SettingItem>\r
        <SettingItem name="宽度">\r
          <el-input v-model="optionData.attrs.width"></el-input>\r
        </SettingItem>\r
        <SettingItem name="头部位置">\r
          <el-input v-model="optionData.attrs.top"></el-input>\r
        </SettingItem>\r
        <SettingItem name="全屏">\r
          <el-switch v-model="optionData.attrs.fullscreen"></el-switch>\r
        </SettingItem>\r
        <SettingItem name="遮罩层">\r
          <el-switch v-model="optionData.attrs.modal"></el-switch>\r
        </SettingItem>\r
        <SettingItem name="拖拽功能">\r
          <el-switch v-model="optionData.attrs.draggable"></el-switch>\r
        </SettingItem>\r
        <SettingItem name="显示">\r
          <el-switch v-model="optionData.show"></el-switch>\r
        </SettingItem>\r
      </SettingItemBox>\r
    </el-collapse-item>\r
\r
    <el-collapse-item name="2" title="内容设置">\r
      <SettingItemBox style="margin: 0">\r
        <SettingItem name="类型">\r
          <el-select v-model="optionData.body.type">\r
            <el-option v-for="item in bodyTypeOptions" :key="item.value" :label="item.label" :value="item.value" />\r
          </el-select>\r
        </SettingItem>\r
        <template v-if="optionData.body.type === 'component'">\r
          <SettingItem name="组件名称">\r
            <el-input v-model="optionData.body.component.is"></el-input>\r
          </SettingItem>\r
        </template>\r
        <template v-else-if="optionData.body.type === 'iframe'">\r
          <SettingItem name="链接地址">\r
            <el-input v-model="optionData.body.iframe.src"></el-input>\r
          </SettingItem>\r
        </template>\r
      </SettingItemBox>\r
      <SettingItemBox alone style="margin: 0">\r
        <SettingItem name="组件传参">\r
          <el-card body-style="padding:0">\r
            <monaco-editor height="300px" v-model:modelValue="componentAttrsStr" language="json" :editorOptions="{\r
              lineNumbers: 'on',\r
              minimap: { enabled: true },\r
            }" @blur="setComponentAttrs" />\r
          </el-card>\r
        </SettingItem>\r
      </SettingItemBox>\r
    </el-collapse-item>\r
  </el-collapse>\r
</template>\r
\r
<script lang="ts" setup>\r
import { GlobalDialogType } from "../type";\r
import { Json } from "@vicons/carbon";\r
import { JSONParse, JSONStringify } from "@/utils";\r
import { MonacoEditor } from "@/components/Pages/MonacoEditor";\r
const props = defineProps({\r
  optionData: {\r
    type: Object as PropType<GlobalDialogType>,\r
    required: true,\r
  },\r
});\r
const collapseActive = ["1", "2"];\r
\r
const componentAttrsStr = ref(\r
  JSONStringify(props.optionData.body.attrs)\r
);\r
function setComponentAttrs() {\r
  try {\r
    props.optionData.body.attrs = JSONParse(componentAttrsStr.value);\r
  } catch (error) {\r
    componentAttrsStr.value = JSON.stringify(\r
      props.optionData.body.attrs\r
    );\r
  }\r
}\r
\r
const bodyTypeOptions = [\r
  { value: "component", label: "内部组件" },\r
  { value: "iframe", label: "嵌入页面" },\r
];\r
<\/script>\r
\r
<style scoped></style>\r
`,q=`export const darkDialog2Config = {\r
  key: 'darkDialog2',\r
  title: '弹窗二',\r
}\r
`,F=`<template>\r
  <el-dialog v-model="config.show" custom-class="dragDialogClass" v-bind="config.attrs" :append-to-body="false">\r
    <div :style="{ height: config.body.height }">\r
      <component-iframe :type="config.body.type" :attrs="config.body.attrs" :component="config.body.component" :iframe="config.body.iframe"></component-iframe>\r
    </div>\r
  </el-dialog>\r
</template>\r
\r
<script setup lang="ts">\r
const props = defineProps({\r
  config: {\r
    type: Object,\r
    required: true,\r
  },\r
});\r
<\/script>\r
\r
<style lang="scss" scoped>\r
.content {\r
  width: 100%;\r
  height: 100%;\r
  border: none;\r
}\r
\r
.dragDialogClass {\r
  background: #0e3f5fe7;\r
\r
  .el-dialog__body {\r
    padding: 10px;\r
  }\r
\r
}\r
</style>\r
`,z=`import { darkDialogConfig } from './darkDialog/index'\r
import { darkDialog2Config } from './darkDialog2/index'\r
\r
export default [darkDialogConfig,darkDialog2Config]\r
`,L=`import { GlobalDialogType } from "./type";\r
\r
export const publicOption: GlobalDialogType = {\r
  id: "",\r
  name: "",\r
  component: "darkDialog",\r
  show: false,\r
  attrs: {\r
    title: "",\r
    width: "60%",\r
    fullscreen: false,\r
    top: "15vh",\r
    modal: true,\r
    draggable: false\r
  },\r
  body: {\r
    height: "60vh",\r
    type: "component",  //component iframe\r
    attrs: {},\r
    component: {\r
      is: "",\r
    },\r
    iframe: {\r
      src: "",\r
    },\r
  }\r
}`,R=`export interface GlobalDialogType {\r
  id:string,\r
  component:any,\r
  name:string,\r
  show:boolean,\r
  attrs :{\r
    title:string\r
    width:string | number\r
    fullscreen:boolean,\r
    top:string,\r
    modal:boolean\r
    draggable:boolean\r
  },\r
  body:{\r
    height:String,\r
    type:string,\r
    attrs:any,\r
    component?:{\r
      is:string,\r
      [string]:any\r
    }\r
    iframe?:{\r
      src:string,\r
      [string]:any\r
    }\r
  }\r
}`,U={a:{type:String}},H=m({props:U});function K(e,n,t,o,r,i){return g(),c("div",null,T(e.a),1)}const Q=A(H,[["render",K]]),Ft=m({__name:"demo",setup(e){l({enable:!0,type:C.AND,conditions:[]});const n=G(""),t=l(_());t.attrs.title="111",t.body.component.is="demo2",t.body.iframe.src="https://colordrop.io/gradient/",t.show=!0;const o=Object.assign({"/src/packages/dialog/darkDialog/config.ts":b,"/src/packages/dialog/darkDialog/config.vue":u,"/src/packages/dialog/darkDialog/index.ts":v,"/src/packages/dialog/darkDialog/index.vue":h,"/src/packages/dialog/darkDialog2/config.ts":k,"/src/packages/dialog/darkDialog2/config.vue":I,"/src/packages/dialog/darkDialog2/index.ts":S,"/src/packages/dialog/darkDialog2/index.vue":x,"/src/packages/dialog/index.ts":D,"/src/packages/dialog/publicConfig.ts":w,"/src/packages/dialog/type.d.ts":J}),r=Object.assign({"/src/packages/dialog/darkDialog/config.ts":P,"/src/packages/dialog/darkDialog/config.vue":j,"/src/packages/dialog/darkDialog/index.ts":E,"/src/packages/dialog/darkDialog/index.vue":M,"/src/packages/dialog/darkDialog2/config.ts":V,"/src/packages/dialog/darkDialog2/config.vue":$,"/src/packages/dialog/darkDialog2/index.ts":q,"/src/packages/dialog/darkDialog2/index.vue":F,"/src/packages/dialog/index.ts":z,"/src/packages/dialog/publicConfig.ts":L,"/src/packages/dialog/type.d.ts":R}),i=Object.assign({});return window.$vue.component(t.component,O(t.component)),console.log(y),console.log(o,r,i),console.log(t),(W,a)=>{const d=B;return g(),c("div",null,[p(d,{placeholder:"",modelValue:s(n),"onUpdate:modelValue":a[0]||(a[0]=f=>N(n)?n.value=f:null)},null,8,["modelValue"]),p(Q,{a:s(n)},null,8,["a"])])}}});export{Ft as default};
