<template>
  <div class="DataBindingConfig">
    <el-tabs v-model="tabsName">
      <el-tab-pane label="数据绑定配置模式" name='1' lazy>
        <configMode :config="dataBinding.configMode"></configMode>
      </el-tab-pane>
      <el-tab-pane label="数据绑定代码模式" name="2" lazy>
        <el-card style="padding: 0;width: 100%;">
            <div>
              <el-tag size="large" type="info">
                <span class="func-keyword">function</span>&nbsp;&nbsp;<span
                  class="func-annotate"></span>( data, rootConfig ){
              </el-tag>
              <monaco-editor v-model:modelValue="dataBinding.codeMode" height="450px" language="javascript" />
              <el-tag size="large" type="info">}</el-tag>
            </div>
          </el-card>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import {ref, reactive} from "vue"
import configMode from "./configMode.vue"
import {
  PublicConfigType,
} from '@/packages/index.d'
const props = defineProps<{
  dataBinding:PublicConfigType["dataBinding"]
}>()
const tabsName = ref("1")
const formData = reactive({
  fun:""
})
const triggerConfig =  reactive({
  update:[]
})
</script>

<style scoped>
.DataBindingConfig{
  height:650px;
  padding:0 15px;
  position: relative;
}
</style>