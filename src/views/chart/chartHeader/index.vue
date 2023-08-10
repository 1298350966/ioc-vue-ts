<template>
  <el-header class="kh-header">
    <div  class="header-item left">
      <slot name="left"></slot>
    </div>
    <div class="header-item center">
      <slot name="center"></slot>
    </div>
    <div  class="header-item right">
      <slot name="right"></slot>
    </div>
  </el-header>
</template>

<style lang="scss" scoped>
$min-width: 400px;
.kh-header{
  display: grid;
  grid-template-columns: repeat(3, 33.33%);
  height: 60px;
  padding: 0 60px;
  background: var(--bg-color-3);
  border-bottom: 1px solid var(--el-border-color);
  color:#fff;
  background-image: radial-gradient(transparent 1px,var(--el-bg-color) 1px);
  background-size: 4px 4px;
  backdrop-filter: saturate(50%) blur(4px);
  .header-item {
    display: flex;
    align-items: center;
    min-width: $min-width;
    &.left {
      justify-content: start;
    }
    &.center {
      justify-content: center;
    }
    &.right {
      justify-content: end;
    }


  }

}

</style>