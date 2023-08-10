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
import  monacoEditorPlugin from 'vite-plugin-monaco-editor'
// import usePluginImport from 'vite-plugin-importer'
const pathSrc = path.resolve(__dirname, 'src')
export default (mode: string) => [
  vue(),
  vueJsx(),
]
