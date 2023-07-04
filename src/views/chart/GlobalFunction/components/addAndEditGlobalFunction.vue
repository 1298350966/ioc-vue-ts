<template>
  <dragDialog v-model="dragDialogShow" title="公共方法设置">
    <el-container style="height: 650px">
      <el-main style="padding: 0">
        <el-scrollbar view-style="padding: 20px;">
          <el-form label-position="top">
            <div class="g-c-2">
              <el-form-item  label="名称:">
                <el-input v-model="optionData.name"></el-input>
              </el-form-item>
              <el-form-item label="方法名:">
                <el-input v-model="optionData.functionName"></el-input>
              </el-form-item>
            </div>

            <el-form-item label="方法内容:" style="margin-bottom: 0;">
              <el-card style="padding: 0;width: 100%;">
                <div>
                  <el-tag size="large" type="info">
                    <span class="func-keyword">function</span
                    >&nbsp;&nbsp;<span class="func-annotate">{{optionData.functionName}}</span>(data)&nbsp;&nbsp;{
                  </el-tag>
                  <monaco-editor
                    v-model:modelValue="optionData.functionContext"
                    height="390px"
                    language="javascript"
                  />
                  <el-tag size="large" type="info">}</el-tag>
                </div>
              </el-card>
            </el-form-item>
          </el-form>
          <!-- 编辑主体 -->
        </el-scrollbar>
      </el-main>
    </el-container>
    <template #footer>
      <el-button type="primary" @click="save">保存</el-button>
    </template>
  </dragDialog>
</template>

<script setup lang="ts">
import { fetchDialogConfig, getDialogConfig } from "@/packages";
import { getGlobalDialogConfig } from "@/packages/dialog/darkDialog/config";
import { componentInstall, getUUID } from "@/utils";
import dialogList from "@/packages/dialog/index";
import { cloneDeep } from "lodash";
defineOptions({
  name: "GlobalDialogDialog",
});
const props = defineProps({
  data: {
    type: Object,
  },
  modelValue: {
    type: Boolean,
  },
});
const emit = defineEmits(["save", "update:modelValue"]);

const dragDialogShow = computed({
  get() {
    return props.modelValue;
  },
  set(val) {
    emit("update:modelValue", val);
  },
});

function openDialog() {
  dragDialogShow.value = true;
}

function closeDialog() {
  dragDialogShow.value = false;
}
let optionData = reactive(cloneDeep(props.data) || cerateGlobalFunction());

function cerateGlobalFunction() {
  let name = getUUID();
  return {
    name: name,
    functionName: name,
    functionContext: "",
  };
}

function save() {
  if (!unref(optionData)) return;
  emit("save", optionData);
  emit("update:modelValue", false);
}
defineExpose({
  openDialog,
  closeDialog,
});

// watch(()=> props.modelValue,(newVal)=>{
//   if(newVal){
//     openDialog()
//   }else{
//     closeDialog()
//   }
// })
</script>

<style lang="scss" scoped>
.aside {
  background-color: var(--dark-color-1a);
}
.g-c-2{
  display: grid;
  grid-template-columns: 1fr 1fr;
  grid-column-gap:10px
}
.item-box {
  margin: 10px;
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer;
  // border: 1px solid rgba(0, 0, 0, 0);
  // background: var(--dark-color-2);
  padding: 10px;
  &:first-child {
    margin-top: 0;
  }
}
.select {
  border: 1px solid #409eff;
  background-color: #40a0ff41;
}
.func-keyword {
  color: #b478cf;

}


.func-annotate {
  color: #70c0e8;
}
:deep(.el-tag){
 font-size: 14px
}
  .editor-data-show {
    @include fetch-bg-color("filter-color");
    width: 420px;
    padding: 20px;
    border-radius: 5px;
  }
</style>
