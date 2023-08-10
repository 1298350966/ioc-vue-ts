<template>
  <div>
    <setting-item name="是否可见">
      <el-switch v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="层级">
      <el-input-number v-model="options.zIndexOffset" />
    </setting-item>
    <setting-item name="是否拖拽">
      <el-switch v-model="options.dragging" />
    </setting-item>
    <setting-item name="图标url">
      <el-input v-model="options.icon"></el-input>
    </setting-item>
    <setting-item name="透明度">
      <el-input-number
        v-model="options.opacity"
        :min="0"
        :max="1"
        :step="0.1"
      />
    </setting-item>
    <!-- <setting-item name="文本标注">
      <el-input v-model="options.title"></el-input>
    </setting-item> -->
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  options: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped></style>
