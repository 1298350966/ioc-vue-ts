<template>
  <el-space wrap>
    <el-icon >
      <Edit />
    </el-icon>
    <div>
      工作空间 -
      <el-button round v-show="focus">
        <span class="title">{{ comTitle }}</span>
      </el-button>
    </div>
    <el-input
      v-show="focus"
      ref="inputInstRef"
      maxlength="16"
      placeholder="请输入项目名称"
      v-model:value.trim="title"
      @keyup.enter="handleBlur"
      @blur="handleBlur"
    ></el-input>
  </el-space>
</template>

<script lang="ts" setup>
import { computed, nextTick, ref } from 'vue';
import { fetchRouteParams } from '@/utils'
const focus = ref<boolean>(false)
const inputInstRef = ref(null)

// 根据路由 id 参数获取项目信息
const fetchProhectInfoById = () => {
  const routeParamsRes = fetchRouteParams()
  if (!routeParamsRes) return
  const { id } = routeParamsRes
  if (id.length) {
    return id[0]
  }
  return ''
}

const title = ref<string>(fetchProhectInfoById() || '')

const comTitle = computed(() => {
  // eslint-disable-next-line vue/no-side-effects-in-computed-properties
  title.value = title.value.replace(/\s/g, '')
  return title.value.length ? title.value : '新项目'
})

const handleFocus = () => {
  focus.value = true
  nextTick(() => {
    inputInstRef.value && (inputInstRef.value as any).focus()
  })
}

const handleBlur = () => {
  focus.value = false
}



</script>

<style lang="" scoped>

</style>