import vue from '@vitejs/plugin-vue'
import vueJsx from "@vitejs/plugin-vue-jsx";
import viteCompression from 'vite-plugin-compression'
import { ElementPlusResolver } from 'unplugin-vue-components/resolvers'
import path from 'path'
// import DefineOptions from "unplugin-vue-define-options/vite";
import svgLoader from "vite-svg-loader";
// import { createSvgIconsPlugin } from 'vite-plugin-svg-icons'
/* Element */
import Icons from 'unplugin-icons/vite'
import IconsResolver from 'unplugin-icons/resolver'
import AutoImport from 'unplugin-auto-import/vite'
import Components from 'unplugin-vue-components/vite'
import { visualizer } from 'rollup-plugin-visualizer';
import Unocss from 'unocss/vite';
import { presetUno, presetAttributify, presetIcons } from 'unocss'
import { myPreset } from "./plugins/my-preset"
import  monacoEditorPlugin from 'vite-plugin-monaco-editor'
// import usePluginImport from 'vite-plugin-importer'
const pathSrc = path.resolve(__dirname, 'src')
export default (mode: string) => [

  vue(),
  Unocss({ // 使用Unocss
    presets: [
      presetUno(),
      presetAttributify(),
      presetIcons(),
      myPreset
    ],
  }),
  vueJsx(),
  // DefineOptions(),

  svgLoader(),
  //   createSvgIconsPlugin({
  //     // 配置你存放 svg 图标的目录
  //        iconDirs: [path.resolve(process.cwd(), 'src/assets/svg')],
  //         // 指定symbolId格式
  //         symbolId: 'svg-[dir]-[name]',
  //   }),
  AutoImport({
    // 自动导入 Vue 相关函数，如：ref, reactive, toRef 等
    imports: ['vue', 'vue-router'],
    dts: 'src/auto-imports.d.ts',
    // 自动导入 Element Plus 相关函数，如：ElMessage, ElMessageBox... (带样式)
    resolvers: [
      ElementPlusResolver(),

      // 自动导入图标组件
      IconsResolver({
        prefix: 'Icon',
      })
    ],

  }),


  Components({
    // dirs: ["src/components","src/customComponents"],// 要导入组件的目录路径
    dirs: ["src/components"],// 要导入组件的目录路径
    dts: "src/components.d.ts",
    include: [/\.vue$/, /\.vue\?vue/], // 只识别vue文件
    resolvers: [
      // 自动注册图标组件
      IconsResolver({
        enabledCollections: ['ep'],
      }),
      // 自动导入 Element Plus 组件
      ElementPlusResolver({
        // importStyle: mode === "development" ? false : "sass",
        // importStyle: mode === "development" ? false : false,
      }),
    ],
  }),
  // usePluginImport({
  //   libraryName: 'element-plus',
  //   customStyleName: (name) => {
  //     return `element-plus/lib/theme-chalk/${name}.css`;
  //   },
  // }),
  Icons({
    autoInstall: true,
  }),
  // 压缩
  viteCompression({
    verbose: true,
    disable: false,
    threshold: 10240,
    algorithm: 'gzip',
    ext: '.gz'
  }),
  visualizer({
    open: true,  //注意这里要设置为true，否则无效
    gzipSize: true,
    brotliSize: true
  }),
  (monacoEditorPlugin as any).default({
    languageWorkers: ['editorWorkerService', 'typescript', 'json', 'html',"css"]
  }),
]
