<template>
  <el-collapse>
    <el-collapse-item title="组件事件">
      <el-card class="collapse-show-box" shadow="never">
        <el-button v-show="editShow" class="edit" text circle type="primary" size="small" @click.stop="showModal = true">
          <Edit style="width: 15px; height: 15px" />
        </el-button>
        <!-- 函数体 -->
        <div v-for="eventName in BaseEventEnum" :key="eventName">
          <p>
            <span class="func-annotate">// {{ EventTypeName[eventName] }}</span>
            <br />
            <span class="func-keyword">async {{ eventName }}</span> ({{EventParamsName[eventName].join(",")}}) {
          </p>
          <p class="go-ml-4">
            <h-code :code="(optionData.events || {})[eventName] || ''" language="typescript"></h-code>
          </p>
          <p>}<span>,</span></p>
        </div>
      </el-card>
    </el-collapse-item>
    <!-- 弹窗 -->
    <dragDialog
      custom-class="FunEditorDialog"
      v-model="showModal"
      title="组件事件编辑器"
    >
      <FunEditor
        ref="funEditorRef"
        :baseEvent="baseEvent"
        :eventTypeName = "EventTypeName"
        :eventParamsName = "EventParamsName"
        :baseEventEnum = "BaseEventEnum"
        :targetData="targetData"
        @close="closeEvents"
      ></FunEditor>
      <template #footer>
        <el-space>
          <el-button @click="closeEvents">取消</el-button>
          <el-button type="primary" @click="saveEvents">保存</el-button>
        </el-space>
      </template>
    </dragDialog>
  </el-collapse>
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs, toRaw } from "vue";
import { MonacoEditor } from "@/components/Pages/MonacoEditor";
import { useTargetData } from "@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook";
import { hCode } from "@/components/highlightCode/index";
import FunEditor from "@/views/chart/ContentConfigurations/components/ChartEvent/components/FormEventBaseHandle/FunEditor.vue"
import { option,EventTypeName,EventParamsName,BaseEventEnum } from "./config";
// const { DocumentTextIcon, ChevronDownIcon, PencilIcon } = icon.ionicons5
const { targetData, chartEditStore } = useTargetData();
const props = defineProps({
  optionData: {
    type: Object as PropType<typeof option>,
    required: true
  }
})

const editShow = ref(true);

// 受控弹窗
const showModal = ref(false);

// events 函数模板
let baseEvent = ref({ ...props.optionData.events });

// 关闭事件
const closeEvents = () => {
  showModal.value = false;
};

const funEditorRef = ref<InstanceType<typeof FunEditor> | null>(null)
// 新增事件
const saveEvents = () => {
  funEditorRef.value?.saveEvents()
}

// watch(
//   () => showModal.value,
//   (newData: boolean) => {
//     if (newData) {
//       baseEvent.value = { ...targetData.value.events.baseEvent };
//       baseEvent.value = { ...targetData.value.option.events };
//     }
//   }
// );
</script>

<style lang="scss" scoped>
.edit {
  position: absolute;
  top: 5px;
  right: 5px;
}

:deep(.FunEditorDialog) {
  .el-dialog__body {
    padding-top: 0;
  }
}
.collapse-show-box {
  position: relative;
}
</style>