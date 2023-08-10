<template>
  <el-timeline style="padding-left: 10px">
    <el-timeline-item
      v-show="dimensionsAndSource"
      color="#2a2a2b"
      size="large"
      :hollow="true"
      type="info"
      :timestamp="TimelineTitleEnum.MAPPING"
      placement="top"
    >
      <el-table border striped :data="dimensionsAndSource">
        <el-table-column prop="field" label="字段" />
        <el-table-column prop="mapping" label="映射" />
        <el-table-column prop="result" label="状态">
          <template #default="scope">
            <span v-if="scope.row.result === 0"> 无 </span>
            <span v-else
              >匹配{{ scope.row.result === 1 ? "成功" : "失败" }}</span
            >
          </template>
        </el-table-column>
      </el-table>
    </el-timeline-item>
    <el-timeline-item
      v-show="filterShow"
      type="warning"
      color="#2a2a2b"
      size="large"
      :hollow="true"
      :timestamp="TimelineTitleEnum.FILTER"
      placement="top"
    > 
      <SettingItem name="过滤节点(添加过滤器配置过滤节点失效)" v-if="!targetData.filter">
        <el-input style="width:100%" v-model="targetData.filterNode"></el-input>
      </SettingItem>
      <el-space direction="vertical" alignment="start">
        <p>过滤器默认处理接口返回值的「data」字段</p>
        <chart-data-monaco-editor></chart-data-monaco-editor>
      </el-space>
    </el-timeline-item>
    <el-timeline-item
      type="success"
      color="#2a2a2b"
      size="large"
      :hollow="true"
      :timestamp="TimelineTitleEnum.CONTENT"
      placement="top"
    >
      <el-space
        direction="horizontal"
        :fill-ratio="100"
        fill
        style="width: 100%"
      >
        <el-space>
          <el-upload
            v-model:file-list="uploadFileListRef"
            :show-file-list="false"
            :http-request="(customRequest as any)"
            @before-upload="beforeUpload"
          >
            <el-space>
              <el-button v-if="!ajax" class="sourceBtn-item" :disabled="noData">
                <template #icon>
                  <el-icon :size="14">
                    <document-add-icon />
                  </el-icon>
                </template>
                导入（json / txt）
              </el-button>
            </el-space>
          </el-upload>
          <el-button
            class="sourceBtn-item"
            :disabled="noData"
            @click="download"
          >
            <template #icon>
              <el-icon :size="14">
                <document-download-icon />
              </el-icon>
            </template>

            下载
          </el-button>
          <el-tooltip content="点击【下载】查看完整数据">
            <el-icon :size="16">
              <QuestionFilled />
            </el-icon>
          </el-tooltip>
        </el-space>
        <el-card shadow="never" style="padding: 0">
          <el-scrollbar height="400px">
            <h-code
              :code="JSON.stringify(source, null, 2)"
              language="json"
            ></h-code>
          </el-scrollbar>
        </el-card>
      </el-space>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ChartFrameEnum } from "@/packages/index.d";
import { RequestDataTypeEnum } from "@/enums/httpEnum";
import { icon } from "@/plugins";
import { ChartDataMonacoEditor } from "../ChartDataMonacoEditor";
import isObject from "lodash/isObject";
import { toString, isArray } from "@/utils";
import {
  TimelineTitleEnum,
  DataResultEnum,
} from "@/views/chart/ContentConfigurations/components/ChartData/index.d";
import { useFile } from "@/views/chart/ContentConfigurations/components/ChartData/hooks/useFile.hooks";
import { CoverGroupType } from '@/packages/index.d'

const activities = [
  {
    content: "Custom icon",
    timestamp: "2018-04-12 20:46",
    size: "large",
    type: "primary",
  },
  {
    content: "Custom color",
    timestamp: "2018-04-03 20:46",
    color: "#0bbd87",
  },
  {
    content: "Custom size",
    timestamp: "2018-04-03 20:46",
    size: "large",
  },
  {
    content: "Custom hollow",
    timestamp: "2018-04-03 20:46",
    type: "primary",
    hollow: true,
  },
  {
    content: "Default node",
    timestamp: "2018-04-03 20:46",
  },
];
const targetData: Ref<CoverGroupType> = inject("targetData");

const props = defineProps({
  show: {
    type: Boolean,
    required: false,
  },
  ajax: {
    type: Boolean,
    required: true,
  },
});

// 表格标题
const tableTitle = ["字段", "映射", "状态"];

const { HelpOutlineIcon } = icon.ionicons5;
const { DocumentAddIcon, DocumentDownloadIcon } = icon.carbon;
const { dimensions } = toRefs(targetData.value.dataset)
const source = computed(() => {
  return targetData.value?.data || targetData.value?.dataset || "此组件无数据源";
})
const dimensionsAndSource = ref();
const noData = ref(false);

const { uploadFileListRef, customRequest, beforeUpload, download } =
  useFile(targetData);

// 是否展示过滤器
const filterShow = computed(() => {
  return (
    targetData.value.request.requestDataType !== RequestDataTypeEnum.STATIC
  );
});


// 处理映射列表状态结果
const matchingHandle = (mapping: string) => {
  let res = DataResultEnum.SUCCESS;
  for (let i = 0; i < source.value.length; i++) {
    if (source.value[i][mapping] === undefined) {
      res = DataResultEnum.FAILURE;
      return res;
    }
  }
  return DataResultEnum.SUCCESS;
};

// 处理映射列表
const dimensionsAndSourceHandle = () => {
  try {
    // 去除首项数据轴标识
    return dimensions.value.map((dimensionsItem: string, index: number) => {
      return index === 0
        ? {
            // 字段
            field: "通用标识",
            // 映射
            mapping: dimensionsItem,
            // 结果
            result: DataResultEnum.NULL,
          }
        : {
            field: `数据项-${index}`,
            mapping: dimensionsItem,
            result: matchingHandle(dimensionsItem),
          };
    });
  } catch (error) {
    return [];
  }
};

watch(
  () => targetData.value?.data,
  (
    newData
  ) => {
    if (
      newData ) {
      dimensionsAndSource.value = dimensionsAndSourceHandle()
      // 只有 DataSet 数据才有对应的格式
      // source.value = newData;
    } else if (newData !== undefined && newData !== null) {
      dimensionsAndSource.value = null;
      // source.value = newData;
    } else {
      noData.value = true;
      // if (targetData.value?.option.dataset) {
      //   source.value = targetData.value?.option.dataset
      // } else {
      //   source.value = "此组件无数据源";
      // }
    }
    if (isArray(newData)) {
      dimensionsAndSource.value = null;
    }
  },
  {
    immediate: true,
  }
);
</script>

<style lang="scss" scoped>
:deep(.el-card) {
  .el-card__body {
    padding: 0;
  }
}
@include go("chart-configurations-timeline") {
  @include deep() {
    pre {
      white-space: pre-wrap;
      word-wrap: break-word;
    }
  }
  .source-btn-box {
    margin-top: 10px !important;
  }
}
</style>
