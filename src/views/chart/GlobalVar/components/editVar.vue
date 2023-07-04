<template>
  <dragDialog  custom-class="FunEditorDialog" v-model="dragDialogShow" title="修改变量" >
      <el-scrollbar height="560px" wrap-style="padding:20px;">
        <el-form :model="ruleForm" ref="ruleFormRef" label-width="100px" v-if="ruleForm">
          <el-form-item
            label="数据名称"
            prop="name"
            :rules="[{ required: true, message: '请输入数据名称', trigger: 'change' }]"
          >  
            <div class="kh-flex-between" style="width: 100%;">
              <el-input class="flex-1" v-model="ruleForm.name" placeholder="请输入数据名称"></el-input>
              <el-button style="margin-left: 10px;" @click="addEntityItem" type="primary">
                  添加
                </el-button>
            </div>
          </el-form-item>
          <template v-for="(entity, index) in ruleForm.entitys" :key="index">
            <el-card shadow="never" style="margin-bottom: 15px;">
            <el-form-item
              label="对象名称"
              :prop="`entitys.${index}.name`"
              :rules="[{ required: true, message: '请输入实体名称', trigger: 'change' }]"
            > 
            <div class="kh-flex-between" style="width: 100%;">
              <el-input class="flex-1" v-model="entity.name" placeholder="请输入实体名称"></el-input>
              <el-button style="margin-left: 10px;" @click="deleteEntityItem(index)" type="danger">
                  删除
               </el-button>
            </div>
            </el-form-item>
            <el-form-item
              label="字段名称"
              :prop="`entitys.${index}.key`"
              :rules="[{ required: true, message: '请输入实体字段', trigger: 'change' }]"
            >
              <el-input v-model="entity.key" placeholder="请输入实体字段"></el-input>
            </el-form-item>
            <el-form-item
              label="字段类型"
              :prop="`entitys.${index}.type`"
              :rules="[{ required: true, message: '请输入字段类型', trigger: 'change' }]"
            >
              <el-select v-model="entity.type">
                <el-option v-for="(item, index) in fieldTypes" :key="index" :label="item.label" :value="item.value"></el-option>
              </el-select>   
            </el-form-item>
            <el-form-item
              label="默认数据"
              :prop="`entitys.${index}.value`"
            >
              <el-input v-model="entity.value" placeholder="请输入默认数据"></el-input>
            </el-form-item>
          </el-card>
          </template>
        </el-form>
      </el-scrollbar>
      <template #footer>
        <el-button type="primary" @click="save">修改</el-button>
      </template>
  </dragDialog>
</template>

<script setup lang="ts">
import { JSONParse, JSONStringify, getUUID } from '@/utils';
import { useChartEditStore } from '@/store/modules/chartEditStore/chartEditStore';
import { GlobalVarType } from '@/packages/index.d'
import { Json } from '@vicons/carbon';
import { cloneDeep } from 'lodash';


const {addGlobalVar} = useChartEditStore()
const createEntity = () => ({ key: '', name: '', type: 'string', value: '' })
const ruleFormRef = ref()
const emit = defineEmits(["update:data"])
const props = defineProps<{
    data:GlobalVarType 
}>()
const createEmptyModel = () => ({
  name: '',
  key: getUUID(),
  entitys: [createEntity()],
});
const dragDialogShow = ref(false)


let ruleForm = ref(cloneDeep(props.data));

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
    label: '数组',
    value: 'array',
  },
  {
    label: '对象',
    value: 'object',
  },
  {
    label: '布尔值',
    value: 'boolean',
  },
];
const openDialog = (data) => {
  dragDialogShow.value = true
}
const closeDialog = () => {
  dragDialogShow.value = false
}
const save = () => {
  ruleFormRef.value.validate((valid)=>{
    if (valid) {
      console.log(ruleForm);
      emit("update:data",unref(ruleForm))
      closeDialog()
    } else {
      return false
    }
  })
}

const addEntityItem = () =>{
  unref(ruleForm).entitys.push(createEntity()) 
}

const deleteEntityItem = (index) => {
  unref(ruleForm).entitys.splice(index,1)
}
watch(()=>props.data,()=>{
  ruleForm.value = cloneDeep(props.data)
})

defineExpose({
  openDialog,
  closeDialog
})
</script>

<style lang="scss">
.FunEditorDialog{
  .el-dialog__body{
    padding: 0;
  }
}


</style>