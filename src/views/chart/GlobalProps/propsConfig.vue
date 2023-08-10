<template>
  <dragDialog custom-class="FunEditorDialog" v-model="dragDialogShow" title="传参配置">

    <el-scrollbar height="560px" wrap-style="padding:20px;">
      <el-tabs v-model="modelValueTabs" lazy>

        <el-tab-pane label="字段定义" name="1">
          <el-form :model="formData" ref="ruleFormRef" label-width="80px">
            <el-form-item label="字段:" prop="field" :rules="[{ required: true, message: '请输入字段', trigger: 'change' }]">
              <el-input placeholder="请输入默认值" v-model="formData.field"></el-input>
            </el-form-item>
            <el-form-item label="类型:" prop="type" :rules="[{ required: true, message: '请输入字段类型', trigger: 'change' }]">
              <el-select style="width: 100%;" v-model="formData.type" @change="typeChange">
                <el-option v-for="(item, index) in fieldTypes" :key="index" :label="item.label"
                  :value="item.value"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item label="默认值:" prop="default" v-if="formData.type">
              <el-switch v-if="formData.type == 'boolean'" v-model="formData.default"></el-switch>
              <el-input-number v-else-if="formData.type == 'number'" placeholder="请输入默认值"
                v-model.number="formData.default"></el-input-number>
              <el-input v-else-if="formData.type == 'string'" placeholder="请输入默认值" v-model="formData.default"></el-input>
              <objectEditor :type="formData.type" v-model="formData.default" v-else></objectEditor>

            </el-form-item>
          </el-form>

        </el-tab-pane>
        <el-tab-pane label="字段变化监听配置" name="2" lazy>
          <fieldChangeMonitoringConfig :eventConfig="formData.configFun"></fieldChangeMonitoringConfig>
        </el-tab-pane>
        <el-tab-pane label="字段变化监听方法" name="3" lazy>
          <el-card style="padding: 0;width: 100%;">
            <div>
              <el-tag size="large" type="info">
                <span class="func-keyword">function</span>&nbsp;&nbsp;<span
                  class="func-annotate"></span>({{propsFunConfig.paramsName.join(", ")}})&nbsp;=>&nbsp;{
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
import { GlobalPropsType } from '@/store/modules/chartEditStore/chartEditStore.d';
import { cloneDeep, isObject } from 'lodash';
import { propsFunConfig } from './config';
import fieldChangeMonitoringConfig from "./propsConfig/fieldChangeMonitoringConfig.vue"
import objectEditor from "./propsConfig/objectEditor.vue"
const props = defineProps<{
  modelValue: boolean,
  data: GlobalPropsType
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


const eventDes = {
  vars:[
    {
      label:" 新值",
      name: ""
    }
  ]
}
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

const defaultStr = ref(null)

function typeChange(type) {
  switch (type) {
    case "string":
      formData.value.default = ""
      break;
    case "number":
      formData.value.default = 0
      break;
    case "boolean":
      formData.value.default = false
      break;
    case "array":
      formData.value.default = []
      setSourceStr()
      break;
    case "object":
      formData.value.default = {}
      setSourceStr()
      break;
    default:
      break;
  }
}

function setSourceStr() {
  defaultStr.value = JSON.stringify(formData.value.default, null, 2)
}

function save() {
  ruleFormRef.value.validate((valid) => {
    if (valid) {
      if (formData.value.type == "array") {
        formData.value.default = JSON.parse(defaultStr.value)
        if (!Array.isArray(formData.value.default)) {
          window.$message.warning("默认值格式错误，请输入数组")
          return
        }
      }
      if (formData.value.type == "object") {
        formData.value.default = JSON.parse(defaultStr.value)
        if (!isObject(formData.value.default)) {
          window.$message.warning("默认值格式错误，请输入对象")
          return
        }
      }
      emit("save", formData.value)
      dragDialogShow.value = false
    } else {
      return false
    }
  })
}

onMounted(() => {
  setSourceStr()
})
</script>

<style scoped></style>