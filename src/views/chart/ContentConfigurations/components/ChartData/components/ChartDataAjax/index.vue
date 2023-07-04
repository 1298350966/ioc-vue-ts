<template>
  <div class="chart-configurations-data-ajax">
    <el-card shadow="never" class="n-card-shallow" style="padding: 0">
      <setting-item-box name="请求配置">
        <setting-item name="类型">
          <el-tag :bordered="false" type="success" style="border-radius: 5px">
            {{
              targetData.request.requestContentType ===
              RequestContentTypeEnum.DEFAULT
              ? "普通请求"
              : "SQL请求"
            }}
          </el-tag>
        </setting-item>

        <setting-item name="方式">
          <el-input size="small" :placeholder="targetData.request.requestHttpType || '暂无'" :disabled="true"></el-input>
        </setting-item>

        <setting-item name="组件间隔">
          <el-input size="small" :placeholder="`${targetData.request.requestInterval || '暂无'}`" :disabled="true">
            <template #suffix>
              {{
                SelectHttpTimeNameObj[targetData.request.requestIntervalUnit]
              }}
            </template>
          </el-input>
        </setting-item>

        <setting-item name="全局间隔（默认）">
          <el-input size="small" :placeholder="`${GlobalRequestInterval || '暂无'} `" :disabled="true">
            <template #suffix>
              {{ SelectHttpTimeNameObj[GlobalRequestIntervalUnit] }}
            </template>
          </el-input>
        </setting-item>
      </setting-item-box>

      <setting-item-box name="源地址" :alone="true">
        <el-input size="small" :placeholder="requestOriginUrl || '暂无'" :disabled="true">
          <template #prefix>
            <el-icon :component="PulseIcon" />
          </template>
        </el-input>
      </setting-item-box>

      <setting-item-box name="组件地址" :alone="true">
        <el-input size="small" :placeholder="targetData.request.requestUrl || '暂无'" :disabled="true">
          <template #prefix>
            <el-icon :component="FlashIcon" />
          </template>
        </el-input>
      </setting-item-box>

      <div class="edit-text" @click="requestModelHandle">
        <div class="go-absolute-center">
          <el-button type="primary">编辑配置</el-button>
        </div>
      </div>
    </el-card>

    <setting-item-box :alone="true">
      <template #name>
        测试
        <el-tooltip content="默认赋值给 dataset 字段">
          <el-icon size="21">
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
    <chart-data-matching-and-show :show="showMatching && !loading" :ajax="true"></chart-data-matching-and-show>

    <!-- 骨架图 -->
    <go-skeleton :load="loading" :repeat="3"></go-skeleton>

    <!-- 请求配置model -->
    <chart-data-request v-model:modelShow="requestShow" :targetData="targetData"
      @sendHandle="sendHandle"></chart-data-request>
  </div>
</template>

<script setup lang="ts">
import {
  ref,
  toRefs,
  computed,
  onBeforeUnmount,
  watchEffect,
  toRaw,
} from "vue";
import { icon } from "@/plugins";
import { useDesignStore } from "@/store/modules/designStore/designStore";
import {
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { ChartDataRequest } from "../ChartDataRequest/index";
import {
  RequestHttpEnum,
  ResultEnum,
  SelectHttpTimeNameObj,
  RequestContentTypeEnum,
} from "@/enums/httpEnum";
import {
  chartDataUrl,
  rankListUrl,
  scrollBoardUrl,
  numberFloatUrl,
  numberIntUrl,
  textUrl,
  imageUrl,
} from "@/api/mock";
import { http, customizeHttp } from "@/api/http";
import { SelectHttpType } from "../../index.d";
import { ChartDataMatchingAndShow } from "../ChartDataMatchingAndShow";
import { useTargetData } from "../../../hooks/useTargetData.hook";
import { newFunctionHandle } from "@/utils";

const { HelpOutlineIcon, FlashIcon, PulseIcon } = icon.ionicons5;
const { targetData, chartEditStore } = useTargetData();

const {
  requestOriginUrl,
  requestInterval: GlobalRequestInterval,
  requestIntervalUnit: GlobalRequestIntervalUnit,
} = toRefs(chartEditStore.getRequestGlobalConfig);
const designStore = useDesignStore();

// 是否展示数据分析
const loading = ref(false);
const requestShow = ref(false);
const showMatching = ref(false);

let firstFocus = 0;
let lastFilter: any = undefined;

// 请求配置 model
const requestModelHandle = () => {
  requestShow.value = true;
};

// 发送请求
const sendHandle = async () => {
  if (!targetData.value?.request) return;
  loading.value = true;
  try {
    const res = await customizeHttp(
      toRaw(targetData.value.request),
      toRaw(chartEditStore.getRequestGlobalConfig)
    );
    loading.value = false;
    if (res) {
      const { data } = res;
      if (!data && !targetData.value.filter)
        window["$message"].warning("您的数据不符合默认格式，请配置过滤器！");
      targetData.value.data = newFunctionHandle(
        data,
        res,
        targetData.value.filter
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

// 颜色
const themeColor = computed(() => {
  return designStore.getAppTheme;
});

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

<style lang="scss" scoped>
:deep(.el-card) {
  position: relative;

  .el-card__body {
    padding: 0;
    padding-right: 10px;
    position: relative;
  }
}

.chart-configurations-data-ajax {
  .edit-text {
    position: absolute;
    top: 0px;
    left: 0px;
    bottom: 0px;
    right: 0px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    opacity: 0;
    transition: all 0.3s;
    @extend .go-background-filter;
    backdrop-filter: blur(1px) !important;
  }

  &:hover {
    border-color: v-bind("themeColor");

    .edit-text {
      opacity: 1;
    }
  }
}
</style>
