<template>
  <div>
    <setting-item-box name="请求方式" :alone="true">
      <el-select-v2
        v-model="targetData.request.requestDataType"
        :options="selectOptions"
      />
    </setting-item-box>

    <!-- 静态 -->
    <chart-data-static
      :targetData="targetData"
      v-if="targetData.request.requestDataType === RequestDataTypeEnum.STATIC"
    ></chart-data-static>
    <!-- 动态 -->
    <chart-data-ajax
      v-if="targetData.request.requestDataType === RequestDataTypeEnum.AJAX"
    ></chart-data-ajax>
    <!-- 数据池 -->
    <chart-data-pond
      v-if="targetData.request.requestDataType === RequestDataTypeEnum.Pond"
    ></chart-data-pond>
  </div>
</template>

<script setup lang="ts">
import { RequestDataTypeEnum } from "@/enums/httpEnum";
import { CoverGroupType } from '@/packages/index.d'
import {
  SelectCreateDataType,
  SelectCreateDataEnum,
} from "@/views/chart/ContentConfigurations/components/ChartData/index.d";
// import ChartDataStatic from "./coverDate/ChartDataStatic/index.vue";
const ChartDataStatic = defineAsyncComponent(
  () => import("./coverDate/ChartDataStatic/index.vue")
);
const ChartDataAjax = defineAsyncComponent(
  () => import("./coverDate/ChartDataAjax/index.vue")
);
const ChartDataPond = defineAsyncComponent(
  () => import("./coverDate/ChartDataPond/index.vue")
);

const props = defineProps({
  targetData: {
    type: Object as PropType<CoverGroupType>,
    require: true,
  },
});
const targetData = computed(() => {
  return props.targetData;
});
provide("targetData", targetData);
// 选项
const selectOptions: SelectCreateDataType[] = [
  {
    label: SelectCreateDataEnum.STATIC,
    value: RequestDataTypeEnum.STATIC,
  },
  {
    label: SelectCreateDataEnum.AJAX,
    value: RequestDataTypeEnum.AJAX,
  },
  {
    label: SelectCreateDataEnum.Pond,
    value: RequestDataTypeEnum.Pond,
  },
];
</script>

<style scoped></style>
