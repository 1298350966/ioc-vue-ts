import { defineConfig, optimizeDeps } from 'vite'
import path, { resolve } from 'path';
import plugins from "./plugins"
import server from "./server"

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}

// monaco-editor 路径
export const prefix = `monaco-editor/esm/vs`

const baseConfig = ({mode}: { mode: string; }) => defineConfig({
  plugins: plugins(mode),
  base: '/ioc',
  resolve: {
    alias: {
      '/@': pathResolve('src'),
      '@': pathResolve('src'),
      '@packages': pathResolve('packages'),
      '@public': pathResolve('public'),
      '@static': pathResolve('public/static'),
      "@assets": pathResolve('src/assets'),
    },
    dedupe: ['vue']
  },
  // 全局 css 注册
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "src/styles/common/style.scss";`,
      },
    }
  },
  server,
  preview: {
    port: 9002
  },
  // 打包配置
  build: {
    // minify: "terser",
    target: 'es2015',
    // sourcemap: false,
    outDir: 'ioc', // 指定输出路径，要和库的包区分开
    // assetsDir: 'static', // 指定生成静态资源的存放路径
    rollupOptions: {
      output: {
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: 'static/js/[name]-[hash].js',
        assetFileNames: (chunkInfo) => {
          if (['.png', '.jpg', '.jpeg'].includes(path.extname(chunkInfo.name as string))) {
            return `static/[ext]/[name].[ext]`
          }
          return `static/[ext]/[name]-[hash].[ext]`
        },
        manualChunks: {
          vue: ['vue', 'vue-router'],
          echarts: ['echarts'],
          lodash: ['lodash'],
          vueRepl:["@vue/repl"],
          vuema:["@vuemap/vue-amap"],
          axios:["axios"],
          elementPlus:["element-plus"],
          highlight:["highlight.js"],
          xgplayer:["xgplayer"],
          xgplayerFlv:["xgplayer-flv"],
          xgplayerHls:["xgplayer-hls"],
          xgplayerMp4:["xgplayer-mp4"],
          xgplayerVue:["xgplayer-vue"],
          vuedraggable:["vuedraggable"],
          vue3BaiduMapGl:["vue3-baidu-map-gl"],
          vueTianditu:["vue-tianditu"],
          jsonWorker: [`${prefix}/language/json/json.worker`],
          cssWorker: [`${prefix}/language/css/css.worker`],
          htmlWorker: [`${prefix}/language/html/html.worker`],
          tsWorker: [`${prefix}/language/typescript/ts.worker`],
          editorWorker: [`${prefix}/editor/editor.worker`]
        }
      }
    },
    chunkSizeWarningLimit: 1000,
    // terserOptions: {
    //   compress: {
    //     keep_infinity: true,
    //     drop_console: true,
    //     drop_debugger: true
    //   }
    // }
  },
  optimizeDeps: {
    include: [
      "vue",
      "pinia",
      "vue-router",
      "axios",
      "echarts",
      "nprogress",
      "nprogress/nprogress.css",
      'element-plus/es',
      'element-plus/es/components/form/style/index',
      'element-plus/es/components/radio-group/style/index',
      'element-plus/es/components/radio/style/index',
      'element-plus/es/components/checkbox/style/index',
      'element-plus/es/components/checkbox-group/style/index',
      'element-plus/es/components/switch/style/index',
      'element-plus/es/components/time-picker/style/index',
      'element-plus/es/components/date-picker/style/index',
      'element-plus/es/components/col/style/index',
      'element-plus/es/components/form-item/style/index',
      'element-plus/es/components/alert/style/index',
      'element-plus/es/components/breadcrumb/style/index',
      'element-plus/es/components/select/style/index',
      'element-plus/es/components/input/style/index',
      'element-plus/es/components/breadcrumb-item/style/index',
      'element-plus/es/components/tag/style/index',
      'element-plus/es/components/pagination/style/index',
      'element-plus/es/components/table/style/index',
      'element-plus/es/components/table-column/style/index',
      'element-plus/es/components/card/style/index',
      'element-plus/es/components/row/style/index',
      'element-plus/es/components/button/style/index',
      'element-plus/es/components/menu/style/index',
      'element-plus/es/components/sub-menu/style/index',
      'element-plus/es/components/menu-item/style/index',
      'element-plus/es/components/option/style/index',
      `monaco-editor/esm/vs/language/json/json.worker`,
      `monaco-editor/esm/vs/language/css/css.worker`,
      `monaco-editor/esm/vs/language/html/html.worker`,
      `monaco-editor/esm/vs/language/typescript/ts.worker`,
      `monaco-editor/esm/vs/editor/editor.worker`,
      '/src/packages/components/**/*.vue'
    ]
  }
})

export default baseConfig