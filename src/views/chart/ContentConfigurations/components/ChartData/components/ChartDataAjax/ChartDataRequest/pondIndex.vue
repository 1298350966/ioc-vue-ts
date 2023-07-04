<template>
  <dragDialog title="接口设置" class="go-chart-data-request" v-model="modelShowRef" @close="closeHandle">

    <el-scrollbar height="640px" wrap-style="padding:20px;">

      <div class="go-pr-3">
        <div>
          <request-global-config></request-global-config>
          <request-target-config :target-data-request="targetDataRequest?.dataPondRequestConfig"></request-target-config>
        </div>
      </div>
    </el-scrollbar>
    <!-- 底部 -->
    <template #footer>
      <el-space justify="space-between" style="width: 100%;justify-content: space-between;">
        <el-space v-if="targetDataRequest">
          <el-tag type="success" size="large">名称：</el-tag>
          <el-input v-model="targetDataRequest.dataPondName" ref="inputInstRef" type="text" size="small" :autofocus="true"
            :clearable="true" :minlength="1" :maxlength="16" placeholder="请输入名称"></el-input>
        </el-space>
        <span v-else></span>
        <el-space>
          <el-button @click="closeHandle">取消</el-button>
          <el-button type="primary" @click="closeAndSendHandle">保存</el-button>
        </el-space>
      </el-space>
    </template>
  </dragDialog>
</template>

<script script lang="ts" setup>
import { PropType, ref, watch } from 'vue'
import { RequestContentTypeEnum } from '@/enums/httpEnum'
// import { useTargetData } from '../../../hooks/useTargetData.hook'
import { RequestGlobalConfig } from './components/RequestGlobalConfig'
import { RequestTargetConfig } from './components/RequestTargetConfig'
import { RequestDataPondItemType } from '@/store/modules/chartEditStore/chartEditStore.d'
import { goDialog } from '@/utils'

const props = defineProps({
  modelShow: Boolean,
  targetDataRequest: Object as PropType<RequestDataPondItemType>
})
const emit = defineEmits(['update:modelShow', 'editSaveHandle'])

const pondName = ref()
const inputInstRef = ref()
// const modelShowRef = ref(false)
const modelShowRef = computed({
  get() {
    return props.modelShow
  },
  set(val) {
    emit('update:modelShow', val)
  }
})

// watch(() => props.modelShow, (newValue) => {
//   modelShowRef.value = newValue
// })


const closeHandle = () => {
  emit('update:modelShow', false)
}

const closeAndSendHandle = () => {
  if (!props.targetDataRequest?.dataPondName) {
    window.$message.warning('请在左下角输入名称！')
    inputInstRef.value?.focus()
    return
  }
  goDialog({
    message: '保存内容将同步修改所有使用此接口的组件, 是否继续?',
    isMaskClosable: true,
    transformOrigin: 'center',
    onPositiveCallback: () => {
      emit('update:modelShow', false)
      emit('editSaveHandle', props.targetDataRequest)
    }
  })
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
    &>.n-card__content {
      padding-right: 0;
    }

    .n-card__content {
      padding-bottom: 5px;
    }
  }
}
</style>
