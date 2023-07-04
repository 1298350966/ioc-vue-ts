<template>
  <div v-if="triggerConfig.updateValue">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane label="弹窗设置" name="1">
        <div class="grid grid-cols-2 grid-gap-10px grid-items-center">
          <SettingItem name="标题">
            <el-input v-model="updateValueAttrs.title"></el-input>
          </SettingItem>
          <SettingItem name="宽度">
            <el-input v-model="updateValueAttrs.width"></el-input>
          </SettingItem>
          <SettingItem name="头部位置">
            <el-input v-model="updateValueAttrs.top"></el-input>
          </SettingItem>
          <SettingItem name="全屏">
            <el-switch v-model="updateValueAttrs.fullscreen"></el-switch>
          </SettingItem>
          <SettingItem name="遮罩层">
            <el-switch v-model="updateValueAttrs.modal"></el-switch>
          </SettingItem>
          <SettingItem name="拖拽功能">
            <el-switch v-model="updateValueAttrs.draggable"></el-switch>
          </SettingItem>
          <SettingItem name="显示">
            <el-switch v-model="triggerConfig.updateValue['show']"></el-switch>
          </SettingItem>
        </div>
      </el-tab-pane>
      <el-tab-pane label="组件传参" name="2">
        <el-table class="w-100%" :data="triggerConfig.updateValue['body.attrs']" border>
          <el-table-column prop="key" label="目标参数">
              <template #default="{ row }">
                <el-select-v2 class="w-100%" v-model="row.key" :options="bodyAttrsKeyOptions" clearable allow-create
                  filterable></el-select-v2>
              </template>
          </el-table-column>
          <el-table-column prop="value" label="映射字段">
            <template #default="{ row }">
              <el-select-v2 class="w-100%" v-model="row.value" :options="(mappingFieldOptions as any[])" clearable allow-create
                filterable></el-select-v2>
            </template>
          </el-table-column>
          <el-table-column width="60" label="操作">
             <template #default="{ row,$index }">
               <el-button type="danger" link @click="triggerConfig.updateValue['body.attrs'].splice($index,1)">删除</el-button> 
            </template>
          </el-table-column>
        </el-table>
        <el-button class="w-100% mt-2" @click="addUpdateValueBodyAttrs"> 添加参数设置</el-button>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { GlobalDialogType } from '@/packages/dialog/type';
import { EChartEventTriggerType } from '../../type';
import { globalDialogUpdate } from '../../config';
import { OptionType } from 'element-plus/es/components/select-v2/src/select.types';
import { cloneDeep, pick } from 'lodash';

const props = defineProps({
  triggerConfig: {
    type: Object as PropType<EChartEventTriggerType>
  },
  targetConfig: {
    type: Object as PropType<GlobalDialogType>
  },
  mappingFieldOptions: {
    type: Array
  }
})
const activeName = ref("1")
const bodyAttrsKeyOptions = ref([])
// const bodyAttrsValueOptions = computed(() => {
//   return [...mappingFieldOptions,]
// })
const updateValueAttrs = ref(cloneDeep(props.targetConfig.attrs))
function globalDialogParams() {
  Object.assign(updateValueAttrs.value, props.triggerConfig.updateValue['attrs'])
}
function addUpdateValueBodyAttrs() {
  props.triggerConfig.updateValue['body.attrs'].push({
      key: "",
      value: ""
  })
}
onMounted(() => {
  if (!props.triggerConfig.updateValue) {
      props.triggerConfig.updateValue = cloneDeep(globalDialogUpdate)
  }
  globalDialogParams()
  bodyAttrsKeyOptions.value = Object.keys(props.targetConfig.body.attrs).map((key) => ({
    label: key,
    value: key
  }))
})
onBeforeUnmount(() => {
  props.triggerConfig.updateValue['body.attrs'] = props.triggerConfig.updateValue['body.attrs'].filter((e) => !!e.key)
  let keys = Object.keys(updateValueAttrs.value).filter((key) => updateValueAttrs.value[key] != props.targetConfig.attrs[key])
  props.triggerConfig.updateValue['attrs'] = pick(updateValueAttrs.value, keys)
})
</script>

<style scoped></style>