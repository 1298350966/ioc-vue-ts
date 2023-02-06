<template>
  <el-dialog
    width="650px"
    v-bind="$attrs"
    v-on="$listeners"
    append-to-body
    custom-class="calculatorDialog"
  >
    <slot></slot>
    <span slot="footer" class="dialog-footer">
      <el-button @click="$emit('onCancel')">取 消</el-button>
      <el-button type="primary" @click="$emit('onDetermine')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<style lang="scss" scoped>
    ::v-deep .calculatorDialog{
      .el-dialog__body{
        padding-top: 0;
      }
    }
</style>
