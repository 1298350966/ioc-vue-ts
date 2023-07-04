<template>
  <el-dialog v-model="config.show" custom-class="dragDialogClass" v-bind="config.attrs" :append-to-body="false">
    <div :style="{ height: config.body.height }">
      <component-iframe :type="config.body.type" :attrs="config.body.attrs" :component="config.body.component" :iframe="config.body.iframe" @message="ComponentIframeMessage"></component-iframe>
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

function ComponentIframeMessage(data){
  if(typeof data == "string"){
    switch (data) {
      case "closeDialog":
        props.config.show = false
        return 
      default:
        return
    }
  }
}
</script>

<style lang="scss" >
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
