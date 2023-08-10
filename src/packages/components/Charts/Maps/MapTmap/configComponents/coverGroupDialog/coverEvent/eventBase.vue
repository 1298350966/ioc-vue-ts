<template>
  <el-collapse-item title="基础事件配置" name="1">
    <el-card class="collapse-show-box" shadow="never">
      <el-button
        v-show="editShow"
        class="edit"
        text
        circle
        type="primary"
        size="small"
        @click.stop="showModal = true"
      >
        <Edit style="width: 15px; height: 15px" />
      </el-button>
      <!-- 函数体 -->
      <div v-for="event in ControlGroupEvents" :key="event.key">
        <p>
          <span class="func-annotate">// {{ event.name }}</span>
          <br />
          <span class="func-keyword">async {{ event.key }}</span> ({{ event.paramsName.join(", ") }}) {
        </p>
        <p class="go-ml-4">
          <h-code
            :code="(targetData.events.codeEvents.baseEvent || {})[event.key] || ''"
            language="typescript"
          ></h-code>
        </p>
        <p>}<span>,</span></p>
      </div>
    </el-card>
  </el-collapse-item>
  <!-- 弹窗 -->
  <dragDialog
    custom-class="FunEditorDialog"
    v-model="showModal"
    title="基础事件编辑器"
  >
    <FunEditor
      ref="funEditorRef"
      :baseEvent="baseEvent"
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
</template>

<script setup lang="ts">
import { ref, computed, watch, toRefs, toRaw } from "vue";
import { hCode } from "@/components/highlightCode/index";
import FunEditor from "./FunEditor.vue";
import { coverGroupOptions, ControlGroupEvents } from "../../../config";
// const { DocumentTextIcon, ChevronDownIcon, PencilIcon } = icon.ionicons5
const props = defineProps({
  targetData: {
    type: Object as PropType<typeof coverGroupOptions>,
    required: true,
  },
});

const editShow = ref(true);

// 受控弹窗
const showModal = ref(false);

// events 函数模板
let baseEvent = ref({ ...props.targetData.events.codeEvents.baseEvent });

// 关闭事件
const closeEvents = () => {
  showModal.value = false;
};

const funEditorRef = ref<InstanceType<typeof FunEditor> | null>(null);
// 新增事件
const saveEvents = () => {
  funEditorRef.value?.saveEvents();
};

watch(
  () => showModal.value,
  (newData: boolean) => {
    if (newData) {
      baseEvent.value = { ...props.targetData.events.codeEvents.baseEvent };
    }
  }
);
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
/* 外层也要使用 */
.func-keyword {
  color: #b478cf;
}

.func-annotate {
  color: #70c0e8;
}
</style>
