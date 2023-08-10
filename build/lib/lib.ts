import { defineConfig} from 'vite'
import path, { resolve } from 'path';
import plugins from "./plugins"
function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
// 打包的入口文件
const entry = pathResolve('build/lib/components.ts')
// 出口文件夹
const outDir = pathResolve('lib')
// monaco-editor 路径
export const prefix = `monaco-editor/esm/vs`

export default defineConfig({
  plugins:plugins("lib"),
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
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "src/styles/common/style.scss";`,
      },
    }
  },
  build: {
    outDir,
    rollupOptions: {
      output: {
        // global: [],
        chunkFileNames: 'static/js/[name]-[hash].js',
        entryFileNames: '[name]-[hash].js',
        assetFileNames: (chunkInfo) => {
          if (['.png', '.jpg', '.jpeg'].includes(path.extname(chunkInfo.name as string))) {
            return `static/[ext]/[name].[ext]`
          }
          return `static/[ext]/[name]-[hash].[ext]`
        },
        manualChunks: (filePath,anme) => {
          console.log(filePath,anme);
          if(filePath.includes("views")){
            return filePath.split("views/")[1]
          }else{
            return 'static/js/aa.js'
          }
  
        }
      },
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        // 'vue',
      ],
      // output: {
      //   // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
      //   // global: []
      // }
    },
    lib: {
      entry,
      name: 'lib', // umd的变量名
      fileName: (format) => `index.${format}.js`, // 输出文件名
      formats: ['es', 'umd'],
    },
  }
})
