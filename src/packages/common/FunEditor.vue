<template>
  <el-container>
    <el-main style="padding: 0">
      <el-tabs v-model="tabsActiveName" type="border-card" class="demo-tabs">
        <el-tab-pane
          v-for="(event, index) in eventsConfig"
          :label="`${event.name}-${event.key}`"
          :name="event.key"
        >
          <!-- 函数名称 -->
          <p class="go-pl-3">
            <span class="func-keyword">async function &nbsp;</span>
            <span class="func-keyNameWord"
              >{{ event.key + "(" + event.paramsName.join(",") + ")" }}&nbsp;&nbsp;{</span
            >
            <!-- <span class="func-keyNameWord"
              >{{ eventName }}(data, e)&nbsp;&nbsp;{</span
            > -->
          </p>
          <!-- 编辑主体 -->
          <monaco-editor
            v-model:modelValue="baseEvent[event.key]"
            height="480px"
            language="javascript"
          />
          <!-- 函数结束 -->
          <p class="go-pl-3 func-keyNameWord">}</p>
        </el-tab-pane>
      </el-tabs>
    </el-main>
    <el-aside width="240px;" style="padding-left: 15px">
      <el-tabs v-model="tabsRightActiveName"  class="demo-tabs">
        <el-tab-pane  label="编译信息" name="encodeInfo">
          <el-scrollbar>
            <el-collapse>
              <template v-for="error in [validEvents()]" :key="error">
                <el-collapse-item title="错误函数" :name="1">
                  {{ error.errorFn || "暂无" }}
                </el-collapse-item>
                <el-collapse-item title="错误信息" :name="2">
                  {{ error.name || "暂无" }}
                </el-collapse-item>
                <el-collapse-item title="堆栈信息" :name="3">
                  {{ error.message || "暂无" }}
                </el-collapse-item>
              </template>
            </el-collapse>
          </el-scrollbar>
        </el-tab-pane>
        <el-tab-pane label="说明文档" name="readText">
          <slot name="readText"></slot>
        </el-tab-pane>
      </el-tabs>
    </el-aside>
  </el-container>
</template>

<script setup lang="ts">
import { ref,onMounted } from "vue"
import {  EventsType } from '@/packages/index.d'
const props = defineProps<{
  eventsConfig: EventsType,
  baseEvent:{
   [T:string]:string
  }
}>();

const baseEvent = reactive(Object.assign({},props.baseEvent))

let tabsActiveName = ref("");
const initTabsActiveName = ()=>{
  let keys = Object.keys(props.eventsConfig)
  tabsActiveName.value = keys[0]
}

let tabsRightActiveName = ref("encodeInfo");
const emit = defineEmits(["close"]);

const errorFlag = ref(false);
// 验证语法
const validEvents = () => {
  let errorFn = "";
  let message = "";
  let name = "";

  errorFlag.value = Object.entries(baseEvent).every(
    ([eventName, str]) => {
      try {
        // 支持await，验证语法
        const AsyncFunction = Object.getPrototypeOf(
          async function () {}
        ).constructor;
        new AsyncFunction(str);
        return true;
      } catch (error: any) {
        message = error.message;
        name = error.name;
        errorFn = eventName;
        return false;
      }
    }
  );
  return {
    errorFn,
    message,
    name,
  };
};

const saveEvents = () => {
  if (validEvents().errorFn) {
    window["$message"].error("事件函数错误，无法进行保存");
    return;
  }
  if (Object.values(props.baseEvent).join("").trim() === "") {
    // 清空事件
    // console.log(props.targetData);
    Object.keys((key)=>{
      props.baseEvent[key] = undefined;
    })
  } else {
    Object.assign(props.baseEvent, baseEvent)
  }
  emit("close");
};

onMounted(()=>{
  initTabsActiveName();
})
defineExpose({
  saveEvents,
});
</script>

<style lang="scss" scoped>
.func-keyword {
  color: #b478cf;
}

.func-annotate {
  color: #70c0e8;
}
.func-keyNameWord {
  color: #70c0e8;
}
</style>
