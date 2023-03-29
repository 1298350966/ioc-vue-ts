// vite.config.ts
import { defineConfig } from "file:///D:/data-works/ioc-vue-ts/node_modules/vite/dist/node/index.js";
import vue from "file:///D:/data-works/ioc-vue-ts/node_modules/@vitejs/plugin-vue/dist/index.mjs";
import Components from "file:///D:/data-works/ioc-vue-ts/node_modules/unplugin-vue-components/dist/vite.mjs";
import AutoImport from "file:///D:/data-works/ioc-vue-ts/node_modules/unplugin-auto-import/dist/vite.js";
import DefineOptions from "file:///D:/data-works/ioc-vue-ts/node_modules/unplugin-vue-define-options/dist/vite.mjs";
import { resolve } from "path";
function pathResolve(dir) {
  return resolve(process.cwd(), ".", dir);
}
var vite_config_default = defineConfig({
  // 路径重定向
  resolve: {
    alias: [
      {
        find: /\/#\//,
        replacement: pathResolve("types")
      },
      {
        find: "@",
        replacement: pathResolve("src")
      }
    ],
    dedupe: ["vue"]
  },
  // 全局 css 注册
  css: {
    preprocessorOptions: {
      scss: {
        javascriptEnabled: true,
        additionalData: `@import "src/styles/common/style.scss";`
      }
    }
  },
  plugins: [
    vue(),
    DefineOptions(),
    // vueSetupExtend(),
    Components({
      // dirs: ["src/components"], // 目标文件夹
      extensions: ["vue", "jsx"],
      // 文件类型
      dts: "src/components.d.ts"
      // 输出文件，里面都是一些import的组件键值对
      // resolvers: [ElementPlusResolver()],
    }),
    AutoImport({
      imports: [
        "vue",
        "vue-router",
        {
          "vuex": ["useStore"]
        }
      ],
      include: [/\.[tj]sx?$/, /\.vue$/, /\.vue\?vue/, /\.md$/],
      dts: "src/auto-imports.d.ts"
      // resolvers: [ElementPlusResolver()],
    })
    // AutoImport({
    //     resolvers: [ElementPlusResolver()]
    // }),
    // Components({
    //     resolvers: [ElementPlusResolver()]
    // }),
  ]
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJEOlxcXFxkYXRhLXdvcmtzXFxcXGlvYy12dWUtdHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXGRhdGEtd29ya3NcXFxcaW9jLXZ1ZS10c1xcXFx2aXRlLmNvbmZpZy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovZGF0YS13b3Jrcy9pb2MtdnVlLXRzL3ZpdGUuY29uZmlnLnRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVcIjtcbmltcG9ydCB2dWUgZnJvbSBcIkB2aXRlanMvcGx1Z2luLXZ1ZVwiO1xuaW1wb3J0IENvbXBvbmVudHMgZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3ZpdGVcIjtcbmltcG9ydCBBdXRvSW1wb3J0IGZyb20gJ3VucGx1Z2luLWF1dG8taW1wb3J0L3ZpdGUnXG5pbXBvcnQgeyBFbGVtZW50UGx1c1Jlc29sdmVyIH0gZnJvbSBcInVucGx1Z2luLXZ1ZS1jb21wb25lbnRzL3Jlc29sdmVyc1wiO1xuLy8gaW1wb3J0IHZ1ZVNldHVwRXh0ZW5kIGZyb20gXCJ2aXRlLXBsdWdpbi12dWUtc2V0dXAtZXh0ZW5kXCI7XG5pbXBvcnQgRGVmaW5lT3B0aW9ucyBmcm9tIFwidW5wbHVnaW4tdnVlLWRlZmluZS1vcHRpb25zL3ZpdGVcIjtcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tIFwicGF0aFwiO1xuZnVuY3Rpb24gcGF0aFJlc29sdmUoZGlyOiBzdHJpbmcpIHtcbiAgcmV0dXJuIHJlc29sdmUocHJvY2Vzcy5jd2QoKSwgXCIuXCIsIGRpcik7XG59XG4vLyBodHRwczovL3ZpdGVqcy5kZXYvY29uZmlnL1xuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcbiAgLy8gXHU4REVGXHU1Rjg0XHU5MUNEXHU1QjlBXHU1NDExXG4gIHJlc29sdmU6IHtcbiAgICBhbGlhczogW1xuICAgICAge1xuICAgICAgICBmaW5kOiAvXFwvI1xcLy8sXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoUmVzb2x2ZShcInR5cGVzXCIpLFxuICAgICAgfSxcbiAgICAgIHtcbiAgICAgICAgZmluZDogXCJAXCIsXG4gICAgICAgIHJlcGxhY2VtZW50OiBwYXRoUmVzb2x2ZShcInNyY1wiKSxcbiAgICAgIH0sXG4gICAgXSxcbiAgICBkZWR1cGU6IFtcInZ1ZVwiXSxcbiAgfSxcbiAgLy8gXHU1MTY4XHU1QzQwIGNzcyBcdTZDRThcdTUxOENcbiAgY3NzOiB7XG4gICAgcHJlcHJvY2Vzc29yT3B0aW9uczoge1xuICAgICAgc2Nzczoge1xuICAgICAgICBqYXZhc2NyaXB0RW5hYmxlZDogdHJ1ZSxcbiAgICAgICAgYWRkaXRpb25hbERhdGE6IGBAaW1wb3J0IFwic3JjL3N0eWxlcy9jb21tb24vc3R5bGUuc2Nzc1wiO2AsXG4gICAgICB9LFxuICAgIH0sXG4gIH0sXG4gIHBsdWdpbnM6IFtcbiAgICB2dWUoKSxcbiAgICBEZWZpbmVPcHRpb25zKCksXG4gICAgLy8gdnVlU2V0dXBFeHRlbmQoKSxcbiAgICBDb21wb25lbnRzKHtcbiAgICAgIC8vIGRpcnM6IFtcInNyYy9jb21wb25lbnRzXCJdLCAvLyBcdTc2RUVcdTY4MDdcdTY1ODdcdTRFRjZcdTU5MzlcbiAgICAgIGV4dGVuc2lvbnM6IFtcInZ1ZVwiLCBcImpzeFwiXSwgLy8gXHU2NTg3XHU0RUY2XHU3QzdCXHU1NzhCXG4gICAgICBkdHM6IFwic3JjL2NvbXBvbmVudHMuZC50c1wiLCAvLyBcdThGOTNcdTUxRkFcdTY1ODdcdTRFRjZcdUZGMENcdTkxQ0NcdTk3NjJcdTkwRkRcdTY2MkZcdTRFMDBcdTRFOUJpbXBvcnRcdTc2ODRcdTdFQzRcdTRFRjZcdTk1MkVcdTUwM0NcdTVCRjlcbiAgICAgIC8vIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV0sXG4gICAgfSksXG4gICAgQXV0b0ltcG9ydCh7XG4gICAgICBpbXBvcnRzOiBbXG4gICAgICAgICd2dWUnLFxuICAgICAgICAndnVlLXJvdXRlcicsXG4gICAgICAgIHtcbiAgICAgICAgICAndnVleCc6IFsndXNlU3RvcmUnXVxuICAgICAgICB9XG4gICAgICBdLFxuICAgICAgaW5jbHVkZTogWy9cXC5bdGpdc3g/JC8sIC9cXC52dWUkLywgL1xcLnZ1ZVxcP3Z1ZS8sIC9cXC5tZCQvXSxcbiAgICAgIGR0czogJ3NyYy9hdXRvLWltcG9ydHMuZC50cycsXG4gICAgICAvLyByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldLFxuICAgIH0pLFxuICAgIC8vIEF1dG9JbXBvcnQoe1xuICAgIC8vICAgICByZXNvbHZlcnM6IFtFbGVtZW50UGx1c1Jlc29sdmVyKCldXG4gICAgLy8gfSksXG4gICAgLy8gQ29tcG9uZW50cyh7XG4gICAgLy8gICAgIHJlc29sdmVyczogW0VsZW1lbnRQbHVzUmVzb2x2ZXIoKV1cbiAgICAvLyB9KSxcbiAgXSxcbn0pO1xuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFnUSxTQUFTLG9CQUFvQjtBQUM3UixPQUFPLFNBQVM7QUFDaEIsT0FBTyxnQkFBZ0I7QUFDdkIsT0FBTyxnQkFBZ0I7QUFHdkIsT0FBTyxtQkFBbUI7QUFDMUIsU0FBUyxlQUFlO0FBQ3hCLFNBQVMsWUFBWSxLQUFhO0FBQ2hDLFNBQU8sUUFBUSxRQUFRLElBQUksR0FBRyxLQUFLLEdBQUc7QUFDeEM7QUFFQSxJQUFPLHNCQUFRLGFBQWE7QUFBQTtBQUFBLEVBRTFCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMO0FBQUEsUUFDRSxNQUFNO0FBQUEsUUFDTixhQUFhLFlBQVksT0FBTztBQUFBLE1BQ2xDO0FBQUEsTUFDQTtBQUFBLFFBQ0UsTUFBTTtBQUFBLFFBQ04sYUFBYSxZQUFZLEtBQUs7QUFBQSxNQUNoQztBQUFBLElBQ0Y7QUFBQSxJQUNBLFFBQVEsQ0FBQyxLQUFLO0FBQUEsRUFDaEI7QUFBQTtBQUFBLEVBRUEsS0FBSztBQUFBLElBQ0gscUJBQXFCO0FBQUEsTUFDbkIsTUFBTTtBQUFBLFFBQ0osbUJBQW1CO0FBQUEsUUFDbkIsZ0JBQWdCO0FBQUEsTUFDbEI7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUFBLEVBQ0EsU0FBUztBQUFBLElBQ1AsSUFBSTtBQUFBLElBQ0osY0FBYztBQUFBO0FBQUEsSUFFZCxXQUFXO0FBQUE7QUFBQSxNQUVULFlBQVksQ0FBQyxPQUFPLEtBQUs7QUFBQTtBQUFBLE1BQ3pCLEtBQUs7QUFBQTtBQUFBO0FBQUEsSUFFUCxDQUFDO0FBQUEsSUFDRCxXQUFXO0FBQUEsTUFDVCxTQUFTO0FBQUEsUUFDUDtBQUFBLFFBQ0E7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRLENBQUMsVUFBVTtBQUFBLFFBQ3JCO0FBQUEsTUFDRjtBQUFBLE1BQ0EsU0FBUyxDQUFDLGNBQWMsVUFBVSxjQUFjLE9BQU87QUFBQSxNQUN2RCxLQUFLO0FBQUE7QUFBQSxJQUVQLENBQUM7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxFQU9IO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
