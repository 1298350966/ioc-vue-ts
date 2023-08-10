<template>
  <div>
    <setting-item name="是否可见">
      <el-switch size="small" v-model="options.visible"></el-switch>
    </setting-item>
    <setting-item name="是否绘制边框">
      <el-switch v-model="options.stroke"></el-switch>
    </setting-item>
    <template v-if="options.stroke">
      <setting-item name="线条颜色">
        <el-color-picker size="small" v-model="options.color" show-alpha />
      </setting-item>
      <setting-item name="线条透明度">
        <el-input-number
          size="small"
          v-model="options.opacity"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </setting-item>
      <setting-item name="线条宽度">
        <el-input-number
          size="small"
          v-model="options.weight"
          :min="0"
          :max="50"
        />
      </setting-item>
    </template>
    <setting-item name="是否绘制填充">
      <el-switch v-model="options.fill"></el-switch>
    </setting-item>
    <template v-if="options.fill">
      <setting-item name="填充颜色">
        <el-color-picker size="small" v-model="options.fillColor" show-alpha />
      </setting-item>
      <setting-item name="填充透明度">
        <el-input-number
          size="small"
          v-model="options.fillOpacity"
          :min="0"
          :max="1"
          :step="0.1"
        />
      </setting-item>
    </template>
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
