<template>
  <el-sub-menu v-if="option.type == 'group'" :index="option.index">
    <template #title>
      <el-icon>{{ option.icon }}</el-icon>
      <span>{{ option.name }}</span>
    </template>
    <template v-for="subOption in option.children" :key="item.id">
      <kh-menu-item :option="subOption"></kh-menu-item>
    </template>
  </el-sub-menu>
  <el-menu-item v-else :index="option.name">
    <!-- <el-icon>{{ option.icon }}</el-icon> -->
    <span>{{ option.name }}</span>
  </el-menu-item>
</template>
<script lang="ts" setup>
const props = defineProps({
  option: {
    type: Object,
    default: () => {

    }
  }
})
</script>