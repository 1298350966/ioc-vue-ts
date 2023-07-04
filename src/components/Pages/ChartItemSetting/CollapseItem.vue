<template>
    <!-- 右侧 -->
    <el-collapse-item :title="name" :name="name">
      <template #title>
        <slot name="header"></slot>
      </template>
      <slot ></slot>
    </el-collapse-item>
</template>

<script setup lang="ts" name="CollapseItem">
import { ref } from 'vue';

const props = defineProps<{
  name:string,
}>()

const activeNames = ref([])

const click = (e:MouseEvent) => {
  e.preventDefault()
  e.stopPropagation()
}
</script>
