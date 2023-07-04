<template>
   <dragDialog
    v-model="modelShowRef"
    title="请求设置"
    @close="closeHandle"
  >
  <!-- <n-modal class="go-chart-data-request" v-model:show="modelShowRef" :mask-closable="false" :closeOnEsc="false"> -->
    <el-container>
      <el-scrollbar height="70vh">
        <div class="go-pr-3">
          <request-global-config></request-global-config>
          <request-target-config :target-data-request="targetData?.request"></request-target-config>
        </div>
      </el-scrollbar>
      <!-- 底部 -->

    </el-container>
    <template #footer>
        <el-space style="width: 100%;justify-content:space-between;">
          <div>
            <span>「 {{ chartConfig.categoryName }} 」</span>
            <span>—— </span>
            <el-tag type="success" style="border-radius: 5px">
              {{ requestContentTypeObj[requestContentType] }}
            </el-tag>
          </div>
          <el-button type="primary" @click="closeAndSendHandle"> {{ saveBtnText || '保存 & 发送请求' }}</el-button>
        </el-space>
      </template>
  </dragDialog>
</template>

<script script lang="ts" setup>
import { ref, toRefs, PropType, watch } from 'vue'
import { RequestContentTypeEnum } from '@/enums/httpEnum'
import { RequestGlobalConfig } from './components/RequestGlobalConfig'
import { RequestTargetConfig } from './components/RequestTargetConfig'
import { CreateComponentType, CreateComponentGroupType } from '@/packages/index.d'

const props = defineProps({
  modelShow: Boolean,
  targetData: Object as PropType<CreateComponentType>,
  saveBtnText: String || null
})
const emit = defineEmits(['update:modelShow', 'sendHandle'])

// 解构基础配置
const { chartConfig } = toRefs(props.targetData as CreateComponentType)
const { requestContentType } = toRefs((props.targetData as CreateComponentType).request)

const modelShowRef = computed({
  get(){
    return props.modelShow
  },
  set(val){
    emit('update:modelShow', val)
  }
})
const requestContentTypeObj = {
  [RequestContentTypeEnum.DEFAULT]: '普通请求',
  [RequestContentTypeEnum.SQL]: 'SQL 请求'
}

// watch(
//   () => props.modelShow,
//   newValue => {
//     modelShowRef.value = newValue
//   },
//   {
//     immediate: true
//   }
// )

const closeHandle = () => {
  emit('update:modelShow', false)
}

const closeAndSendHandle = () => {
  emit('update:modelShow', false)
  emit('sendHandle')
}
</script>

<style lang="scss" scoped>
@include go('chart-data-request') {
  &.n-card.n-modal,
  .n-card {
    @extend .go-background-filter;
  }
  .n-card-shallow {
    background-color: rgba(0, 0, 0, 0) !important;
  }
  @include deep() {
    & > .n-card__content {
      padding-right: 0;
    }
    .n-card__content {
      padding-bottom: 5px;
    }
  }
}
</style>
