<script setup lang="ts">
import { reactive } from 'vue';
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
const config = reactive({
  zIndex: 10,
  size: 'default' as any,
})
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
