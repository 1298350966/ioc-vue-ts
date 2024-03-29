<template>
  <div class="go-chart-data-display">
    <el-scrollbar style="max-height: 570px">
      <div class="go-mr-3">
        <div>
          <setting-item-box name="主体信息">
            <setting-item name="接口名称">
              <el-input
                size="small"
                :placeholder="targetData?.dataPondName || '暂无'"
                :disabled="true"
              >
              </el-input>
            </setting-item>
            <setting-item name="接口类型">
              <el-input
                size="small"
                :placeholder="requestHttpType || '暂无'"
                :disabled="true"
              ></el-input>
            </setting-item>
          </setting-item-box>

          <setting-item-box>
            <setting-item name="组件间隔">
              <el-input
                size="small"
                :placeholder="`${requestInterval || '暂无'}`"
                :disabled="true"
              >
                <template #suffix>
                  {{ targetData && SelectHttpTimeNameObj[requestIntervalUnit] }}
                </template>
              </el-input>
            </setting-item>
            <setting-item name="全局间隔（默认）">
              <el-input
                size="small"
                :placeholder="`${globalData?.requestInterval || '暂无'}`"
                :disabled="true"
              >
                <template #suffix>
                  {{
                    globalData &&
                    SelectHttpTimeNameObj[globalData.requestIntervalUnit]
                  }}
                </template>
              </el-input>
            </setting-item>
          </setting-item-box>

          <setting-item-box name="源地址" :alone="true">
            <el-input
              size="small"
              :placeholder="globalData?.requestOriginUrl || '暂无'"
              :disabled="true"
            >
              <template #prefix>
                <el-icon :component="PulseIcon" />
              </template>
            </el-input>
          </setting-item-box>

          <setting-item-box name="接口地址" :alone="true">
            <el-input
              size="small"
              :placeholder="requestUrl || '暂无'"
              :disabled="true"
            >
              <template #prefix>
                <el-icon :component="FlashIcon" />
              </template>
            </el-input>
          </setting-item-box>
        </div>
        <el-divider />
        <setting-item-box name="类型">
          <setting-item name="配置类型">
            <el-input
              size="small"
              :placeholder="
                targetData && requestContentTypeObj[requestContentType]
              "
              :disabled="true"
            ></el-input>
          </setting-item>
          <setting-item
            name="body 类型"
            v-if="requestContentType === RequestContentTypeEnum.DEFAULT"
          >
            <el-input
              size="small"
              :placeholder="targetData && requestParamsBodyType"
              :disabled="true"
            ></el-input>
          </setting-item>
        </setting-item-box>
        <div v-if="requestContentType === RequestContentTypeEnum.DEFAULT">
          <el-tabs v-model="tabValue">
            <el-tab-pane
              v-for="item in RequestParamsTypeEnum"
              :key="item"
              :name="item"
              :label="item"
            >
              {{ item }}
            </el-tab-pane>
          </el-tabs>
          <!-- 各个页面 -->
          <div class="go-mt-3">
            <div v-if="tabValue !== RequestParamsTypeEnum.BODY">
              <display-table class="go-my-3" :target="requestParams[tabValue]">
              </display-table>
            </div>

            <!-- 选择了 body -->
            <div v-else>
              <!-- 为 none 时 -->
              <el-card
                class="go-mt-3 go-pb-3"
                v-if="requestParamsBodyType === RequestBodyEnum['NONE']"
              >
                <span>该接口没有 Body 体</span>
              </el-card>

              <!-- 具有对象属性时 -->
              <template
                v-else-if="
                  requestParamsBodyType === RequestBodyEnum['FORM_DATA'] ||
                  requestParamsBodyType ===
                    RequestBodyEnum['X_WWW_FORM_URLENCODED']
                "
              >
                <display-table
                  class="go-my-3"
                  :target="
                    requestParams[RequestParamsTypeEnum.BODY][
                      requestParamsBodyType
                    ]
                  "
                ></display-table>
              </template>

              <!-- json  -->
              <template
                v-else-if="requestParamsBodyType === RequestBodyEnum['JSON']"
              >
                <el-card size="small" style="padding-bottom: 7px">
                  <h-code
                    :code="
                      requestParams[RequestParamsTypeEnum.BODY][
                        requestParamsBodyType
                      ] || '暂无内容'
                    "
                    language="json"
                  ></h-code>
                </el-card>
              </template>

              <!-- xml  -->
              <template
                v-else-if="requestParamsBodyType === RequestBodyEnum['XML']"
              >
                <h-code
                  :code="
                    requestParams[RequestParamsTypeEnum.BODY][
                      requestParamsBodyType
                    ] || ''
                  "
                  language="html"
                ></h-code>
              </template>
            </div>
          </div>
        </div>
        <!-- SQL 请求 -->
        <div v-else>
          <setting-item-box name="键名">
            <span>sql</span>
          </setting-item-box>
          <setting-item-box name="键值">
            <h-code :code="requestSQLContent.sql || ''" language="sql"></h-code>
          </setting-item-box>
        </div>
      </div>
    </el-scrollbar>
  </div>
</template>

<script setup lang="ts">
import { PropType, ref, toRefs } from "vue";
import { icon } from "@/plugins";
import { MonacoEditor } from "@/components/Pages/MonacoEditor";
import {
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import {
  RequestDataPondItemType,
  RequestGlobalConfigType,
} from "@/store/modules/chartEditStore/chartEditStore.d";
import displayTable from "./displayTable.vue";
import {
  RequestBodyEnum,
  RequestParamsTypeEnum,
  SelectHttpTimeNameObj,
  RequestContentTypeEnum,
  RequestBodyEnumList,
  RequestParamsObjType,
} from "@/enums/httpEnum";

const props = defineProps({
  globalData: Object as PropType<RequestGlobalConfigType>,
  targetData: Object as PropType<RequestDataPondItemType>,
});

const { HelpOutlineIcon, FlashIcon, PulseIcon } = icon.ionicons5;
const {
  requestUrl,
  requestInterval,
  requestHttpType,
  requestContentType,
  requestSQLContent,
  requestParams,
  requestParamsBodyType,
  requestIntervalUnit,
} = toRefs((props.targetData as RequestDataPondItemType).dataPondRequestConfig);

const tabs = [RequestParamsTypeEnum.HEADER];
const requestContentTypeObj = {
  [RequestContentTypeEnum.DEFAULT]: "普通请求",
  [RequestContentTypeEnum.SQL]: "SQL 请求",
};
const tabValue = ref<RequestParamsTypeEnum>(RequestParamsTypeEnum.PARAMS);

// 更新参数表格数据
const updateRequestParams = (paramsObj: RequestParamsObjType) => {
  if (tabValue.value !== RequestParamsTypeEnum.BODY) {
    requestParams.value[tabValue.value] = paramsObj;
  }
};

// 更新参数表格数据
const updateRequestBodyTable = (paramsObj: RequestParamsObjType) => {
  if (
    tabValue.value === RequestParamsTypeEnum.BODY &&
    // 仅有两种类型有 body
    (requestParamsBodyType.value === RequestBodyEnum.FORM_DATA ||
      requestParamsBodyType.value === RequestBodyEnum.X_WWW_FORM_URLENCODED)
  ) {
    requestParams.value[RequestParamsTypeEnum.BODY][
      requestParamsBodyType.value
    ] = paramsObj;
  }
};
</script>

<style lang="scss" scoped>
@include go("chart-data-display") {
  flex: 1;
}
</style>
