<script setup lang="ts">
import { reactive } from 'vue';
const config = reactive({
  zIndex: 3000,
  size: 'default',
})
</script>

<template>
  <!-- <el-config-provider :size="config.size" :z-index="config.zIndex"> -->
    <router-view></router-view>
  <!-- </el-config-provider> -->
</template>

<style scoped>
.none{
  display: none;
  opacity: 0;
}
</style>
