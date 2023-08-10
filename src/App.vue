<script setup lang="ts">
import { reactive } from 'vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
import { useTheme } from './hooks';
const { initTheme } = useTheme()
const config = reactive({
  zIndex: 10,
  size: 'default' as any,
})

/** 初始化主题 */
initTheme()
</script>

<template>
  <el-config-provider :size="config.size" :z-index="config.zIndex" :locale="zhCn">
    <router-view></router-view>
  </el-config-provider>
</template>

<style scoped>
.none {
  display: none;
  opacity: 0;

}
</style>
