<template>
  <el-collapse>
    <collapse-item name="内容" :expanded="true">
      <setting-item-box name="文本" :alone="true">
        <el-button @click="dialogShow = true">编辑文本</el-button>
      </setting-item-box>
       
      <dragDialog v-if="dialogShow" v-model="dialogShow" title="富文本编辑">
        <!-- <el-card shadow="never"> -->
          <wangEditor :style="wangEditorStyle"  class="wangEditor" v-model="optionData.htmlText"></wangEditor>
        <!-- </el-card> -->
      </dragDialog>
    </collapse-item>
    <collapse-item name="样式" :expanded="true">
      <setting-item-box name="文字">
        <setting-item name="X轴内边距">
          <el-input-number v-model="optionData.paddingX" size="small" placeholder="输入内边距"></el-input-number>
        </setting-item>
        <setting-item name="Y轴内边距">
          <el-input-number v-model="optionData.paddingY" size="small" placeholder="输入内边距"></el-input-number>
        </setting-item>
        <setting-item name="背景色">
          <el-color-picker size="small"  v-model="optionData.style['--w-e-textarea-bg-color']" show-alpha></el-color-picker>
        </setting-item>
        <setting-item name="弱背景色">
          <el-color-picker size="small"  v-model="optionData.style['--w-e-textarea-slight-bg-color']" show-alpha></el-color-picker>
        </setting-item>
        <setting-item name="字体色">
          <el-color-picker size="small"  v-model="optionData.style['--w-e-textarea-color']" show-alpha></el-color-picker>
        </setting-item>
        <setting-item name="弱字体色">
          <el-color-picker size="small"  v-model="optionData.style['--w-e-textarea-slight-color']" show-alpha></el-color-picker>
        </setting-item>
        <setting-item name="边框色">
          <el-color-picker size="small"  v-model="optionData.style['--w-e-textarea-border-color']" show-alpha></el-color-picker>
        </setting-item>
        <setting-item name="弱边框色">
          <el-color-picker size="small"  v-model="optionData.style['--w-e-textarea-slight-border-color']" show-alpha></el-color-picker>
        </setting-item>
        <setting-item name="选中边框色">
          <el-color-picker size="small"  v-model="optionData.style['--w-e-textarea-selected-border-color']" show-alpha></el-color-picker>
        </setting-item>
      </setting-item-box>
    </collapse-item>
    
  </el-collapse>
</template>

<script setup lang="ts">
import { PropType } from 'vue'
import { option } from './config'
import { CollapseItem, SettingItemBox, SettingItem } from '@/components/Pages/ChartItemSetting'
import wangEditor from "@/components/wangEditor/index.vue"
const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const dialogShow = ref(false)

const wangEditorStyle = computed(()=>{
  return props.optionData.style
})
</script>

<style lang="scss" scoped>
.wangEditor{
  background-color: var(--bg-color-2);
  height: 75vh;
}
</style>