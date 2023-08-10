<template>
  <div class="Layout-Header">
    <div class="Header-left">
       <span>IOC开发平台</span>
    </div>
    <div>
      
    </div>
    <div class="Header-right">
      <ThemeSwitch class="ThemeSwitch"></ThemeSwitch>
    </div>

  </div>
</template>

<script setup lang="ts">
  
</script>

<style lang="scss" scoped>
.Layout-Header{
  display: grid;
  grid-template-columns: 240px 1fr 300px;
  align-items: center;
  justify-content: center;
  height: 100%;
  gap: 10px;
  .Header-left{
    text-align: center;
    letter-spacing: 4px;
    font-weight: bold;
  }
  .Header-right{
    text-align: right;
 
    .ThemeSwitch{
      width: 50px;
      height: 50px;
      display: inline-flex;
      align-items: center;
      justify-content: center;
      border-radius: 5px;
    }
  }
}
</style>