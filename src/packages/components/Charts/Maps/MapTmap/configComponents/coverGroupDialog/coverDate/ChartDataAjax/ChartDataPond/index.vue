<template>
  <!-- 选中内容 -->
  <div class="chart-data-pond">
    <el-card class="el-card-shallow">
      <setting-item-box name="请求名称" :alone="true">
        <el-input
          size="small"
          :placeholder="pondData?.dataPondName || '暂无'"
          :disabled="true"
        >
          <template #prefix>
            <el-icon :component="FishIcon" />
          </template>
        </el-input>
      </setting-item-box>

      <setting-item-box name="接口地址" :alone="true">
        <el-input
          size="small"
          :placeholder="pondData?.dataPondRequestConfig.requestUrl || '暂无'"
          :disabled="true"
        >
          <template #prefix>
            <el-icon :component="FlashIcon" />
          </template>
        </el-input>
      </setting-item-box>

      <div class="edit-text" @click="controlModelHandle">
        <div class="kh-absolute-center">
          <el-button type="primary">编辑配置</el-button>
        </div>
      </div>
    </el-card>
  </div>

  <setting-item-box :alone="true">
    <template #name>
      测试
      <el-tooltip trigger="hover" content="默认赋值给 dataset 字段">
        <el-icon size="21" :depth="3">
          <help-outline-icon></help-outline-icon>
        </el-icon>
      </el-tooltip>
    </template>
    <el-button type="primary" ghost @click="sendHandle">
      <template #icon>
        <el-icon>
          <flash-icon />
        </el-icon>
      </template>
      发送请求
    </el-button>
  </setting-item-box>

  <!-- 底部数据展示 -->
  <chart-data-matching-and-show
    :show="showMatching && !loading"
    :ajax="true"
  ></chart-data-matching-and-show>

  <!-- 骨架图 -->
  <go-skeleton :load="loading" :repeat="3"></go-skeleton>

  <!-- 编辑 / 新增弹窗 -->
  <chart-data-pond-control
    v-model:modelShow="controlModel"
    @sendHandle="sendHandle"
  ></chart-data-pond-control>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  toRaw,
  onBeforeUnmount,
  computed,
  watchEffect,
} from "vue";
import { icon } from "@/plugins";
import { http, customizeHttp } from "@/api/http";
import {
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { ChartDataPondControl } from "./components/ChartDataPondControl";
import { useDesignStore } from "@/store/modules/designStore/designStore";
// import { useTargetData } from "../../../hooks/useTargetData.hook";
import { ChartDataMatchingAndShow } from "../ChartDataMatchingAndShow";
import { newFunctionHandle } from "@/utils";
import { useChartEditStore } from "@/store/modules/chartEditStore/chartEditStore";

const designStore = useDesignStore();
const { HelpOutlineIcon, FlashIcon, PulseIcon, FishIcon } = icon.ionicons5;
// const { targetData, chartEditStore } = useTargetData()
const targetData: Ref<any> = inject("targetData");
const chartEditStore = useChartEditStore();
const {
  requestDataPond,
  requestInterval: GlobalRequestInterval,
  requestIntervalUnit: GlobalRequestIntervalUnit,
} = toRefs(chartEditStore.getRequestGlobalConfig);

const loading = ref(false);
const controlModel = ref(false);
const showMatching = ref(false);

let firstFocus = 0;
let lastFilter: any = undefined;

// 所选数据池
const pondData = computed(() => {
  const selectId = targetData.value.request.requestDataPondId;
  if (!selectId) return undefined;
  const data = requestDataPond.value.filter((item) => {
    return selectId === item.dataPondId;
  });
  return data[0];
});

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme;
});

// 请求配置 model
const controlModelHandle = () => {
  controlModel.value = true;
};

// 发送请求
const sendHandle = async () => {
  if (!targetData.value?.request) {
    window.$message.warning("请选择一个公共接口！");
    return;
  }
  loading.value = true;
  try {
    // const res = await customizeHttp(
    //   toRaw(pondData.value?.dataPondRequestConfig),
    //   toRaw(chartEditStore.getRequestGlobalConfig)
    // )
    const res = await customizeHttp(
      toRaw(targetData.value.request),
      toRaw(chartEditStore.getRequestGlobalConfig)
    );
    loading.value = false;
    console.log(res);
    if (res) {
      if (!res?.data && !targetData.value.filter)
        window["$message"].warning("您的数据不符合默认格式，请配置过滤器！");
      let { filter, filterNode } = targetData.value
      if (!filter && filterNode) {
        filter = "return data." + filterNode
      }
      targetData.value.data = newFunctionHandle(
        res?.data,
        res,
        filter
      );
      showMatching.value = true;
      return;
    }
    window["$message"].warning("数据异常，请检查参数！");
  } catch (error) {
    loading.value = false;
    window["$message"].warning("数据异常，请检查参数！");
  }
};

watchEffect(() => {
  const filter = targetData.value?.filter;
  if (lastFilter !== filter && firstFocus) {
    lastFilter = filter;
    sendHandle();
  }
  firstFocus++;
});

onBeforeUnmount(() => {
  lastFilter = null;
});
</script>

<style scoped lang="scss">
.chart-data-pond {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  .el-card-shallow {
    width: 99%;

    &.el-card {
      @extend .go-background-filter;
    }
    .edit-text {
      position: absolute;
      top: 0px;
      left: 0px;
      width: 100%;
      height: 100%;
      cursor: pointer;
      opacity: 0;
      transition: all 0.3s;
      @extend .go-background-filter;
      backdrop-filter: blur(2px) !important;
    }
    &:hover {
      border-color: v-bind("themeColor");
      .edit-text {
        opacity: 1;
      }
    }
  }
}
</style>
