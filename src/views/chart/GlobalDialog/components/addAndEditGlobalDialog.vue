<template>
  <dragDialog v-model="dragDialogShow" title="添加">
    <el-container style="height:600px;">
      <el-aside width="200px" class="aside">
        <el-scrollbar view-style="padding: 10px 0;">
          <div :class="{ select: item.key == selectKey }" class="item-box " v-for="item in dialogList" :key="item.key"
            @click="selectDialog(item)">
            {{ item.title }}
          </div>
        </el-scrollbar>
      </el-aside>
      <el-main style="padding: 0;">
        <el-scrollbar view-style="padding: 20px;">
          <component is="darkDialog" :optionData="optionData" v-if="optionData"></component>
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
import { componentInstall } from "@/utils";
import dialogList from "@/packages/dialog/index";
import { cloneDeep } from "lodash";
defineOptions({
  name: "GlobalDialogDialog"
})
const props = defineProps({
  data: {
    type: Object,
  },
  modelValue: {
    type: Boolean,
  }
})
const emit = defineEmits(["save", "update:modelValue"])

const dragDialogShow = computed({
  get() {
    return props.modelValue
  },
  set(val) {
    emit("update:modelValue", val)
  }
})

function openDialog() {
  dragDialogShow.value = true
}

function closeDialog() {
  dragDialogShow.value = false
}
let optionData = ref(null)
const selectKey = ref("")



function selectDialog({ key, title }, data = null) {
  if (selectKey.value == key) return
  selectKey.value = key
  componentInstall(key, fetchDialogConfig(key))
  getDialogConfig(key).then((e: any) => {
    optionData.value = Object.assign(e.getGlobalDialogConfig(), data)
    unref(optionData).attrs.title = title
  })
}


onMounted(() => {
  dragDialogShow.value = props.modelValue
  if (props.data) {
    selectKey.value = props.data.component
    optionData.value = cloneDeep(props.data)
    componentInstall(props.data.component, fetchDialogConfig(props.data.component))
    // selectDialog({key:props.data.component,title:props.data.attrs.title},cloneDeep(props.data))
  } else {
    selectDialog(dialogList[0])
  }
})

function save() {
  if (!unref(optionData)) return

  if (props.data) {
    optionData.value.id = props.data.id
  }
  emit("save", optionData.value)
  emit("update:modelValue", false)
}
defineExpose({
  openDialog,
  closeDialog
})


</script>

<style lang="scss" scoped>
.aside {
  background-color: var(--bg-color-1);
}

.item-box {
  margin: 10px;
  overflow: hidden;
  border-radius: 6px;
  cursor: pointer;
  // border: 1px solid rgba(0, 0, 0, 0);
  // background: var(--bg-color-3);
  padding: 10px;

  &:first-child {
    margin-top: 0;
  }

}

.select {
  border: 1px solid #409eff;
  background-color: #40a0ff41;
}
</style>