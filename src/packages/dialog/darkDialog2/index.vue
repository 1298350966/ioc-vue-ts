<template>
  <el-dialog v-model="config.show" custom-class="dragDialogClass" v-bind="config.attrs" :append-to-body="false">
    <div :style="{ height: config.body.height }">
      <component-iframe :type="config.body.type" :attrs="config.body.attrs" :component="config.body.component" :iframe="config.body.iframe"></component-iframe>
    </div>
  </el-dialog>
</template>

<script setup lang="ts">
const props = defineProps({
  config: {
    type: Object,
    required: true,
  },
});
</script>

<style lang="scss" scoped>
.content {
  width: 100%;
  height: 100%;
  border: none;
}

.dragDialogClass {
  background: #0e3f5fe7;

  .el-dialog__body {
    padding: 10px;
  }

}
</style>
