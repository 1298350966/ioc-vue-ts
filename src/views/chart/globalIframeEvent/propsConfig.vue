<template>
  <dragDialog custom-class="FunEditorDialog" v-model="dragDialogShow" title="传参配置">

    <el-scrollbar height="560px" wrap-style="padding:20px;">
      <el-tabs v-model="modelValueTabs" lazy>
        <el-tab-pane label="事件定义" name="1">
          <el-form :model="formData" ref="ruleFormRef" label-width="80px">
            <el-form-item label="事件名:" prop="eventName" :rules="[{ required: true, message: '请输入字段', trigger: 'change' }]">
              <el-input placeholder="请输入默认值" v-model="formData.eventName"></el-input>
            </el-form-item>
            <el-form-item label="事件参数:">
              <el-table :data="formData.eventArgs" border>
              <el-table-column prop="field" label="字段">
                <template #default="{ row }">
                  <el-input placeholder="请输入默认值" v-model="row.field"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="类型">
                <template #default="{ row }">
                  <el-select style="width: 100%;" v-model="row.type" @change="typeChange(row)">
                    <el-option v-for="(item, index) in fieldTypes" :key="index" :label="item.label"
                      :value="item.value"></el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="默认值">
                <template #default="{ row }">
                  <el-switch v-if="row.type == 'boolean'" v-model="row.default"></el-switch>
                  <el-input-number v-else-if="row.type == 'number'" placeholder="请输入默认值"
                    v-model.number="row.default"></el-input-number>
                  <el-input v-else-if="row.type == 'string'" placeholder="请输入默认值" v-model="row.default"></el-input>
                  <objectEditor :type="row.type" v-model="row.default" v-else-if="['array','object'].includes(row.type)"></objectEditor>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template #default="{ row,$index }">
                  <el-button type="danger" @click="removeEventArgs($index)" link>删除</el-button>
                </template>
              </el-table-column>
            </el-table>
            <el-button class="mt-4" style="width: 100%" @click="addEventArgs">添加事件参数</el-button>
            </el-form-item>
    

          </el-form>
        </el-tab-pane>
        <el-tab-pane label="字段变化监听配置" name="2" lazy>
          <fieldChangeMonitoringConfig :eventConfig="formData.configFun" :propsFunConfig="propsFunConfig"></fieldChangeMonitoringConfig>
        </el-tab-pane>
        <el-tab-pane label="字段变化监听方法" name="3" lazy>
          <el-card style="padding: 0;width: 100%;">
            <div>
              <el-tag size="large" type="info">
                <span class="func-keyword">function</span>&nbsp;&nbsp;<span
                  class="func-annotate"></span>({{propsFunConfig.paramsName.join(",")}}){
              </el-tag>
              <monaco-editor v-model:modelValue="formData.fun" height="390px" language="javascript" />
              <el-tag size="large" type="info">}</el-tag>
            </div>
          </el-card>
        </el-tab-pane>
      </el-tabs>

    </el-scrollbar>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </dragDialog>
</template>

<script setup lang="ts">
import { GlobalIframeEventType } from '@/store/modules/chartEditStore/chartEditStore.d';
import { cloneDeep, isObject } from 'lodash';
// import { propsFunConfig } from './config';
import fieldChangeMonitoringConfig from "./propsConfig/fieldChangeMonitoringConfig.vue"
import objectEditor from "./propsConfig/objectEditor.vue"
const props = defineProps<{
  modelValue: boolean,
  data: GlobalIframeEventType
}>()
const emit = defineEmits(['update:modelValue', 'save'])
const dragDialogShow = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit("update:modelValue", val)
  }
})
const modelValueTabs = ref("1")

const ruleFormRef = ref()

let formData = ref(cloneDeep(props.data));

const propsFunConfig = computed(()=>{
  let paramsName:string[] = []
  let vars =  formData.value.eventArgs.map((eventArg)=>{
    paramsName.push(eventArg.field)
    return {
      label:eventArg.field,
      value:"${" + eventArg.field + "}",
      type:eventArg.type
    }
  })
  paramsName.push('rootConfig')
  return   {
    key: "IframeEvent",
    name: "iframe触发事件",
    paramsName: paramsName,
    vars: vars
  }
})
const fieldTypes = [
  {
    label: '字符串',
    value: 'string',
  },
  {
    label: '数字',
    value: 'number',
  },
  {
    label: '布尔值',
    value: 'boolean',
  },
  {
    label: '数组',
    value: 'array',
  },
  {
    label: '对象',
    value: 'object',
  },
];


function typeChange(row) {
  const { type } = row
  switch (type) {
    case "string":
      row.default = ""
      break;
    case "number":
      row.default = 0
      break;
    case "boolean":
      row.default = false
      break;
    case "array":
      row.default = []
      break;
    case "object":
      row.default = {}
      break;
    default:
      break;
  }
}

function addEventArgs(){
  formData.value.eventArgs.push({
    field:"",
    type:"string",
    default:"",
  })
}
function removeEventArgs(index){
  formData.value.eventArgs.splice(index)
}
// function setSourceStr() {
//   defaultStr.value = JSON.stringify(formData.value.default, null, 2)
// }

function save() {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      eventArgsFilter()

      emit("save", formData.value)
      dragDialogShow.value = false
    } else {
      return false
    }
  })
}

function eventArgsFilter(){
  formData.value.eventArgs = formData.value.eventArgs.filter((e) => !!e.field)
}

</script>

<style scoped></style>