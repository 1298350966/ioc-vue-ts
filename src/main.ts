import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
// import * as ElementPlusIconsVue from '@element-plus/icons-vue'
// import 'element-plus/dist/index.css'

import { useElementPlusGlobal, useElementPlus } from "./plugins/element-plus/index";

import i18n from '@/i18n/index'
import { useRouter } from './router'
// 导入Unocss
import 'uno.css'
// 引入全局样式
// import '@/styles/pages/index.scss'

// 引入动画
import 'animate.css/animate.min.css'
import "imagehover.css/css/imagehover.min.css"
// import '@/styles/element/index.scss'

import { setupStore } from '@/store'
import { setupDirectives, setupLoading } from '@/plugins'
import { useDirective } from '@/directive/customDirective'

import "@/plugins/feedback"


import '@/styles/theme/register.scss'

const app = createApp(App)

//注册全局自定义指令
useDirective(app)

//注册全局加载
setupLoading(app)
// app.component('SketchRule', SketchRule)
// 注册全局自定义指令
setupDirectives(app)

// 挂载状态管理
setupStore(app)

// 注册路由
useRouter(app)

// 注册UI
// app.use(ElementPlus)

// for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
//   app.component(key, component)
// }
useElementPlus(app)
// import 'virtual:svg-icons-register'

// 语言注册
app.use(i18n)

// 挂载到页面
app.mount('#app')

// 挂载到 window
window['$vue'] = app

// import {getImageUrl} from "@/utils/utils"

// console.log(getImageUrl("canvas/noData.png"))


const scriptEl = document.createElement('script')
scriptEl.setAttribute('type', 'module')
// send ok in the module script to ensure sequential evaluation
// of multiple proxy.eval() calls
scriptEl.innerHTML = `
  import { createApp } from 'vue'
  console.log(createApp);
`
document.head.appendChild(scriptEl)
scriptEl.onerror = (err) => {
  console.log(err);
}
