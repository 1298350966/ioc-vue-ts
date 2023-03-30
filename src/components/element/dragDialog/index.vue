<template>
  <el-dialog v-drag top="10vh" v-bind="$attrs" append-to-body :close-on-click-modal="false" width="60%">
      <template #title>
      </template>
      <slot></slot>
      <template #footer>
        <slot name="footer"></slot>
      </template>
  </el-dialog>
</template>

<script lang="ts" >

export default {
  name: 'dragDialog',
};
</script>

<style lang="scss" scoped>

</style>