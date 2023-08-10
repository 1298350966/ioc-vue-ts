<template>
  <el-dialog draggable class="dragDialog" top="10vh" v-bind="$attrs" append-to-body :close-on-click-modal="false"
    width="60%">
    <template #header>
    </template>
    <slot></slot>
    <template #footer v-if="$slots.footer">
      <slot name="footer" class="footer"></slot>
    </template>
  </el-dialog>
</template>

<script lang="ts" >


export default {
  name: 'dragDialog',
};
</script>

<style lang="scss">
.dragDialog {
  border-radius: 10px;
  overflow: hidden;
  .el-dialog__header {
    background-color: var(--bg-color-3);
    padding: 10px 15px;
    margin-right: 0;

    .el-dialog__headerbtn {
      top: -2px;
    }
  }

  .el-dialog__body {
    padding: 0;
  }

  .el-dialog__footer {
    background-color: var(--bg-color-3);
    padding: 10px 15px;
  }
}
</style>


