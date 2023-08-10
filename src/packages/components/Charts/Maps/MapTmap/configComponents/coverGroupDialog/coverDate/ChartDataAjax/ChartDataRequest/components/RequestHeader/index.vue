<template>
  <!-- <el-space direction="vertical"> -->
  <div style="top: -8px;position: relative;width: 80%;">
    <el-tabs v-model="requestContentType" size="small">
      <el-tab-pane :name="RequestContentTypeEnum.DEFAULT" label="普通请求">
      </el-tab-pane>
      <el-tab-pane :name="RequestContentTypeEnum.SQL" label="SQL 请求">
      </el-tab-pane>
    </el-tabs>
    <div v-show="requestContentType === RequestContentTypeEnum.DEFAULT">
      <el-tabs animated v-model="tabValue">
        <el-tab-pane
          v-for="item in RequestParamsTypeEnum"
          :key="item"
          :name="item"
          :label="item"
        >
        </el-tab-pane>
      </el-tabs>

      <!-- 各个页面 -->
      <div class="go-mt-3">
        <div v-if="tabValue !== RequestParamsTypeEnum.BODY">
          <request-header-table
            :target="requestParams[tabValue]"
            @update="updateRequestParams"
          ></request-header-table>
        </div>

        <!-- 选择了 body -->
        <div v-else>
          <el-radio-group v-model="requestParamsBodyType" name="radiogroup">
            <el-radio
              v-for="bodyEnum in RequestBodyEnumList"
              :key="bodyEnum"
              :label="bodyEnum"
            >
              {{ bodyEnum }}
            </el-radio>
          </el-radio-group>

          <!-- 为 none 时 -->
          <el-card
            shadow="never"
            class="go-mt-3 go-pb-3"
            v-if="requestParamsBodyType === RequestBodyEnum['NONE']"
          >
            <span>该接口没有 Body 体</span>
          </el-card>

          <!-- 具有对象属性时 -->
          <template
            v-else-if="
              requestParamsBodyType === RequestBodyEnum['FORM_DATA'] ||
              requestParamsBodyType === RequestBodyEnum['X_WWW_FORM_URLENCODED']
            "
          >
            <request-header-table
              class="go-mt-3"
              :target="
                requestParams[RequestParamsTypeEnum.BODY][requestParamsBodyType]
              "
              @update="updateRequestBodyTable"
            ></request-header-table>
          </template>

          <!-- json  -->
          <template
            v-else-if="requestParamsBodyType === RequestBodyEnum['JSON']"
          >
            <monaco-editor
              v-model="
                requestParams[RequestParamsTypeEnum.BODY][requestParamsBodyType]
              "
              height="200px"
              language="json"
            />
          </template>

          <!-- xml  -->
          <template
            v-else-if="requestParamsBodyType === RequestBodyEnum['XML']"
          >
            <monaco-editor
              v-model="
                requestParams[RequestParamsTypeEnum.BODY][requestParamsBodyType]
              "
              height="200px"
              language="html"
            />
          </template>
        </div>
      </div>
    </div>
    <div v-show="requestContentType === RequestContentTypeEnum.SQL">
      <template v-if="requestHttpType === RequestHttpEnum.GET">
        <span>SQL 类型不支持 Get 请求，请使用其它方式</span>
      </template>
      <template v-else>
        <el-tag type="warning">需要后台提供专门处理 sql 的接口</el-tag>
        <setting-item-box name="键名">
          <el-tag
            type="success"
            :bordered="false"
            style="width: 40px; font-size: 16px"
          >
            sql
          </el-tag>
        </setting-item-box>
        <setting-item-box name="键值" alone>
          <monaco-editor
            v-model="requestSQLContent['sql']"
            height="200px"
            language="sql"
          />
        </setting-item-box>
      </template>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, toRefs, PropType } from "vue";
import { MonacoEditor } from "@/components/Pages/MonacoEditor";
import { RequestHeaderTable } from "../RequestHeaderTable/index";
import {
  SettingItemBox,
  SettingItem,
} from "@/components/Pages/ChartItemSetting";
import { useTargetData } from "@/views/chart/ContentConfigurations/components/hooks/useTargetData.hook";
import { RequestConfigType } from "@/store/modules/chartEditStore/chartEditStore.d";
import {
  RequestParamsTypeEnum,
  RequestContentTypeEnum,
  RequestParamsObjType,
  RequestBodyEnumList,
  RequestBodyEnum,
  RequestHttpEnum,
} from "@/enums/httpEnum";

const props = defineProps({
  targetDataRequest: Object as PropType<RequestConfigType>,
});

const {
  requestHttpType,
  requestContentType,
  requestSQLContent,
  requestParams,
  requestParamsBodyType,
} = toRefs(props.targetDataRequest as RequestConfigType);

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
.select-type {
  width: 300px;
}
</style>
