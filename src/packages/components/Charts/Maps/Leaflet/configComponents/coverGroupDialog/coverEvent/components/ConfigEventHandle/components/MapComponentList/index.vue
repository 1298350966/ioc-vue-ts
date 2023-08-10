<template>
  <div v-if="triggerConfig.updateValue">
    <el-tabs v-model="activeName" class="demo-tabs">
      <el-tab-pane  label="信息窗体" name="1">
        <InformationForm :InfoWindowList="targetConfig.option.InfoWindowList" :InfoWindowListUpdateValue="updateValue['option.InfoWindowList']" :mappingFieldOptions="mappingFieldOptions"></InformationForm>
      </el-tab-pane>
      <el-tab-pane label="覆盖物" name="2">
        <COVER :coverGroupList="targetConfig.option.coverGroupList" v-model:coverGroupListUpdateValue="updateValue['option.coverGroupList']" :mappingFieldOptions="mappingFieldOptions"></COVER>
      </el-tab-pane>
    </el-tabs>
  </div>
</template>

<script setup lang="ts">
import { RequestBodyEnum, RequestHttpEnum, RequestParamsTypeEnum } from '@/enums/httpEnum';
import { CreateComponentType } from '@/packages/index.d';
import { EChartEventTriggerType } from '../../type';
import { MapComponentListUpdate } from '../../config';
import { cloneDeep, get } from 'lodash';
const InformationForm = defineAsyncComponent(()=>import("./InformationForm/index.vue"))
const COVER = defineAsyncComponent(()=>import("./COVER/index.vue"))

const props = defineProps({
  triggerConfig: {
    type: Object as PropType<EChartEventTriggerType>
  },
  targetConfig: {
    type: Object as PropType<CreateComponentType>
  },
  mappingFieldOptions: {
    type: Array as any
  }
})

const activeName = ref("1")
const {updateValue} = toRefs(props.triggerConfig) 

// function requestParamsDataFilter(data) {
//     data = data.filter((e) => !!e.key)
// }
const InfoWindowListOptions = computed(()=>{
  const InfoWindowList = props.targetConfig.option.InfoWindowList
  return InfoWindowList.map((InfoWindow) => ({
    label: InfoWindow.name + "(" + InfoWindow.id + ")",
    value: InfoWindow.id 
  }))
})
onMounted(() => {
  if (!props.triggerConfig.updateValue) {
    props.triggerConfig.updateValue = cloneDeep(MapComponentListUpdate)
  }
})


onBeforeUnmount(() => {
  const { updateValue } = props.triggerConfig
  // Object.keys(updateValue).forEach((key) => {
  //     requestParamsDataFilter(updateValue[key])
  // })
})
</script>

<style scoped></style>