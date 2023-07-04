<template>
  <div class="kh-setting-item" :style="{ width: width + 'px' }">
    <span class="name">{{ name }}
      <el-space>
        <slot name="name"></slot>
      </el-space>
    </span>
    <slot ></slot>

  </div>
</template>

<script setup lang="ts">
defineProps({
  name: {
    type: String,
    required: false
  },
  width: {
    type: Number,
    required: false
  }
})
</script>

<style lang="scss" scoped>
.kh-setting-item {
  display: flex;
  flex-direction: column;
  min-width: 110px;
  text-align: start;
  margin-bottom: 5px;
  .name {
    display: flex;
    justify-content: space-between;
    margin-top: 2px;
    margin-bottom: 2px;
  }
}
</style>
