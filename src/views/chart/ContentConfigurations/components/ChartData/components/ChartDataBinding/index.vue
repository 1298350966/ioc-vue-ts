<template>
  <div class="ChartDataBinding">
    <p>接口返回数据绑定其他组件模板配置</p>
    <el-button type="primary" @click="showModal = true">数据绑定</el-button>
    <dragDialog custom-class="FunEditorDialog" v-model="showModal" title="数据绑定设置">
       <DataBindingConfig :dataBinding="dataBinding"></DataBindingConfig>
    </dragDialog>
  </div>
</template>

<script setup lang="ts">
import DataBindingConfig from "./DataBindingConfig/index.vue";
import {
  PublicConfigType,
} from '@/packages/index.d'
const showModal = ref(false)

const props = defineProps<{
  dataBinding:PublicConfigType["dataBinding"]
}>()
</script>

<style scoped>

</style>