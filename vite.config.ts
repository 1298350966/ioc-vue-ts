import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import Components from "unplugin-vue-components/vite";
import AutoImport from 'unplugin-auto-import/vite'
import { ElementPlusResolver } from "unplugin-vue-components/resolvers";
// import vueSetupExtend from "vite-plugin-vue-setup-extend";
import DefineOptions from "unplugin-vue-define-options/vite";
import { resolve } from "path";
function pathResolve(dir: string) {
  return resolve(process.cwd(), ".", dir);
}
// https://vitejs.dev/config/
export default defineConfig({
  // 路径重定向
  resolve: {
    alias: [
      {
        find: /\/#\//,
        replacement: pathResolve("types"),
      },
      {
        find: "@",
        replacement: pathResolve("src"),
      },
    ],
    dedupe: ["vue"],
  },
  // 全局 css 注册
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "src/styles/common/style.scss";`,
      },
    },
  },
  plugins: [
    vue(),
    DefineOptions(),
    // vueSetupExtend(),
    Components({
      // dirs: ["src/components"], // 目标文件夹
      // extensions: ["vue", "jsx"], // 文件类型
      dts: "src/components.d.ts", // 输出文件，里面都是一些import的组件键值对
      // resolvers: [ElementPlusResolver()],
    }),
    AutoImport({
      imports: [
        'vue',
        'vue-router',
        {
          'vuex': ['useStore']
        }
      ],
      // include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: 'src/auto-imports.d.ts',
      // resolvers: [ElementPlusResolver()],
    }),
    // AutoImport({
    //     resolvers: [ElementPlusResolver()]
    // }),
    // Components({
    //     resolvers: [ElementPlusResolver()]
    // }),
  ],
});
