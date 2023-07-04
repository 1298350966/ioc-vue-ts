import { defineConfig} from 'vite'
import { resolve } from 'path';

function pathResolve(dir: string) {
  return resolve(process.cwd(), '.', dir)
}
// 打包的入口文件
const entry = pathResolve( 'packages/index.ts')
// 出口文件夹
const outDir = pathResolve('lib')


export default defineConfig({
  build: {
    outDir,
    rollupOptions: {
      // 确保外部化处理那些你不想打包进库的依赖
      external: [
        'vue'
      ],
      output: {
        // 在 UMD 构建模式下为这些外部化的依赖提供一个全局变量
        // global: []
      }
    },
    lib: {
      entry,
      name: 'lib', // umd的变量名
      fileName: (format) => `index.${format}.js`, // 输出文件名
      formats: ['es', 'umd'],
    },
  }
})
