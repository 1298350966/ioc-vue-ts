<template>
  <el-collapse-item title="高级事件配置" name="2">
    <!-- <template #header-extra>
      <n-button type="primary" tertiary size="small" @click.stop="showModal = true">
        <template #icon>
          <n-icon>
            <pencil-icon />
          </n-icon>
        </template>
        编辑
      </n-button>
    </template> -->
    <el-card class="collapse-show-box" shadow="never">
      <el-button class="edit" text circle  type="primary" size="small" @click.stop="showModal = true">
        <Edit style="width: 15px; height: 15px; "  />
      </el-button>
      <!-- 函数体 -->
      <div v-for="eventName in EventLife" :key="eventName">
        <p>
          <span class="func-annotate">// {{ EventLifeName[eventName] }}</span>
          <br />
          <span class="func-keyword">async {{ eventName }}</span> (e, components, echarts, node_modules) {
        </p>
        <p class="go-ml-4">
          <code :code="(targetData.events.advancedEvents || {})[eventName] || ''" language="typescript"></code>
        </p>
        <p>}<span>,</span></p>
      </div>
    </el-card>
  </el-collapse-item>
  <!-- 弹窗 -->
  <dragDialog custom-class="FunEditorDialog" v-model="showModal" title="高级事件配置">
     <FunEditor :advanced-events="advancedEvents" :target-data="targetData"></FunEditor>
  </dragDialog>
</template>

<script lang="ts" setup>
import { ref, computed, watch, toRefs, toRaw } from 'vue'
import { MonacoEditor } from '@/components/Pages/MonacoEditor'
import { useTargetData } from '../../../hooks/useTargetData.hook'
import { templateList } from './importTemplate'
import { npmPkgs } from '@/hooks'
import { icon } from '@/plugins'
import { CreateComponentType } from '@/packages/index.d'
import { EventLife } from '@/enums/eventEnum'
import  {code} from "@/components/highlightCode/index"
import FunEditor from "./FunEditor.vue"
defineOptions({
  name:"ChartEventAdvancedHandle"
})
const { targetData, chartEditStore } = useTargetData()

const EventLifeName = {
  [EventLife.VNODE_BEFORE_MOUNT]: '渲染之前',
  [EventLife.VNODE_MOUNTED]: '渲染之后'
}

const EventLifeTip = {
  [EventLife.VNODE_BEFORE_MOUNT]: '此时组件 DOM 还未存在',
  [EventLife.VNODE_MOUNTED]: '此时组件 DOM 已经存在'
}

// 受控弹窗
const showModal = ref(false)
// 编辑区域控制
const editTab = ref(EventLife.VNODE_MOUNTED)
// events 函数模板
let advancedEvents = ref({ ...targetData.value.events.advancedEvents })
// 事件错误标识
const errorFlag = ref(false)

// 验证语法
const validEvents = () => {
  let errorFn = ''
  let message = ''
  let name = ''

  errorFlag.value = Object.entries(advancedEvents.value).every(([eventName, str]) => {
    try {
      // 支持await，验证语法
      const AsyncFunction = Object.getPrototypeOf(async function () {}).constructor
      new AsyncFunction(str)
      return true
    } catch (error: any) {
      message = error.message
      name = error.name
      errorFn = eventName
      return false
    }
  })
  return {
    errorFn,
    message,
    name
  }
}

// 关闭事件
const closeEvents = () => {
  showModal.value = false
}

// 新增事件
const saveEvents = () => {
  if (validEvents().errorFn) {
    window['$message'].error('事件函数错误，无法进行保存')
    return
  }
  if (Object.values(advancedEvents.value).join('').trim() === '') {
    // 清空事件
    targetData.value.events.advancedEvents = {
      vnodeBeforeMount: undefined,
      vnodeMounted: undefined
    }
  } else {
    targetData.value.events.advancedEvents = { ...advancedEvents.value }
  }
  closeEvents()
}

watch(
  () => showModal.value,
  (newData: boolean) => {
    if (newData) {
      advancedEvents.value = { ...targetData.value.events.advancedEvents }
    }
  }
)
</script>

<style lang="scss" scoped>
@import '../index.scss';
.edit {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
