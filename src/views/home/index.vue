<template>
  <el-container class="home">
  <el-header>
    header
  </el-header>
  <el-container>
        <el-aside width="200px">Aside</el-aside>
        <el-main>
          <viewsList></viewsList>
        </el-main>
      </el-container>
  </el-container>
</template>

<script setup lang="ts">
import viewsList from "./viewsList.vue"
</script>

<style lang="scss" scoped>
.home{
  height: 100vh;
  /* background-color: #fff; */
  .el-header{
     background-color: var(--color-bg-2);
  }
  .el-aside{
    background-color: var(--color-bg-2);
  }
}
</style>