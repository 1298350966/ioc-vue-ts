<template>
  <el-timeline style="padding-left: 10px">
    <el-timeline-item color="#2a2a2b" size="large" :hollow="true" type="info" :timestamp="TimelineTitleEnum.MAPPING"
      placement="top">
      <component v-if="dataMappingComponentIs" :is="dataMappingComponentIs" :targetData="targetData"
        :dataMapping="targetData.dataMapping || []">
      </component>
      <!-- <echartDAtaMapping v-if="targetData.dataMapping" :dataMapping="targetData.dataMapping"></echartDAtaMapping> -->
      <el-table v-else border striped :data="dimensionsAndSource"  row-key="key" size="small" default-expand-all>
        <el-table-column prop="name" label="字段" />
        <el-table-column prop="column" label="映射">
          <template #default="{row, $index }">
            <el-input v-model="row.column" size="small"></el-input>
          </template>
        </el-table-column>
        <!-- <el-table-column prop="result" label="状态">
          <template #default="scope">
            <span v-if="scope.row.result === 0"> 无 </span>
            <span v-else>匹配{{ scope.row.result === 1 ? "成功" : "失败" }}</span>
          </template>
        </el-table-column> -->
      </el-table>
    </el-timeline-item>
    <el-timeline-item v-show="filterShow" type="warning" color="#2a2a2b" size="large" :hollow="true"
      :timestamp="TimelineTitleEnum.FILTER" placement="top">
      <SettingItem name="过滤节点(添加过滤器配置过滤节点失效)" v-if="!targetData.filter">
        <el-input style="width:100%" v-model="targetData.filterNode"></el-input>
      </SettingItem>
      <el-space direction="vertical" alignment="start" fill style="width:100%">
        <p>过滤器默认处理接口返回值的「data」字段</p>
        <chart-data-monaco-editor></chart-data-monaco-editor>
      </el-space>
    </el-timeline-item>
    <el-timeline-item type="warning" color="#2a2a2b" size="large" :hollow="true" :timestamp="TimelineTitleEnum.BINDING" placement="top">
      <ChartDataBinding :dataBinding="targetData.dataBinding"></ChartDataBinding>
    </el-timeline-item>
    <el-timeline-item type="success" color="#2a2a2b" size="large" :hollow="true" :timestamp="TimelineTitleEnum.CONTENT"
      placement="top">
      <el-space direction="horizontal" :fill-ratio="100" fill style="width: 100%">
        <el-space>
          <el-upload v-model:file-list="uploadFileListRef" :show-file-list="false" :http-request="(customRequest as any)"
            @before-upload="beforeUpload">
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
          <el-button class="sourceBtn-item" :disabled="noData" @click="download">
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
        <el-card shadow="never" style="padding: 0;position: relative;">
          <el-scrollbar  v-if="!sourceEdit" wrap-style="height:400px;padding:10px;" >
            <h-code :code="toString(source)" language="json"></h-code>
              <el-button
              class="edit"
              text
              circle
              type="primary"
              size="small"
              @click.stop="sourceEdit = true;setSourceStr()"
            >
              <Edit style="width: 15px; height: 15px" />
            </el-button>  
          </el-scrollbar> 

          <div style="padding:10px;"  v-else>
            <monaco-editor height="400px"  v-model="sourceStr" 
              language="json"
              :editorOptions="{
                lineNumbers: 'off',
                lineDecorationsWidth: -10,
                minimap: { enabled: false },
              }"/>
  
          </div>
        </el-card>
        <div class="text-right"  v-if="sourceEdit">
          <el-button @click="sourceEdit = false">取消</el-button>
          <el-button type="primary" @click="sourceStrSave">保存</el-button>
        </div>
      </el-space>
    </el-timeline-item>
  </el-timeline>
</template>

<script setup lang="ts">
import { ref, computed, watch } from "vue";
import { ChartFrameEnum } from "@/packages/index.d";
import { RequestDataTypeEnum } from "@/enums/httpEnum";
import { icon } from "@/plugins";
import { DataResultEnum, TimelineTitleEnum } from "../../index.d";
import { ChartDataMonacoEditor } from "../ChartDataMonacoEditor";
import { useFile } from "../../hooks/useFile.hooks";
import { useTargetData } from "../../../hooks/useTargetData.hook";
import isObject from "lodash/isObject";
import { toString, isArray } from "@/utils";
import echartDAtaMapping from "./echartDAtaMapping.vue"
import { ChatCategoryEnum } from "@/packages/components/Charts/index.d";
import { FormComponentsCategoryEnum } from "@/packages/components/Forms/index.d";
import ChartDataBinding from "../ChartDataBinding/index.vue"

const BarsAndLines = defineAsyncComponent(
  () => import("./dataMapping/BarsAndLines.vue")
);
const Pies = defineAsyncComponent(
  () => import("./dataMapping/Pies.vue")
);
const Scatters = defineAsyncComponent(
  () => import("./dataMapping/Scatters.vue")
);

const { targetData } = useTargetData();
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
const { dimensions } = toRefs(targetData.value.option.dataset)
const source = computed(() => {
  return targetData.value?.data || targetData.value?.option.dataset || "此组件无数据源";
})
const sourceEdit = ref(false)
const sourceStr = ref(null)

function setSourceStr(){
  sourceStr.value = JSON.stringify(source.value,null,2)
}
function sourceStrSave(){
  targetData.value.data = JSON.parse(sourceStr.value)
  sourceEdit.value = false
}
// const dimensions = ref();
const dimensionsAndSource = computed(()=>{
  let {dataMapping} = targetData.value
  if(dataMapping){
    // let list = []
    // Object.keys(dataMapping).forEach((key) => {
    //   list.push() 
    // })
    return dataMapping
  }else{
    return []
  } 
});
function dataMappingtoArray(dataMapping){
  let list = []
  Object.keys(dataMapping).forEach((key) => {
    const mapping = dataMapping[key]
    if(mapping.children){
      dataMappingtoArray(mapping.children)
    }
    list.push(mapping) 
  })

  return list
}

const noData = ref(false);

const { uploadFileListRef, customRequest, beforeUpload, download } =
  useFile(targetData);

// 是否展示过滤器
const filterShow = computed(() => {
  return (
    targetData.value.request.requestDataType !== RequestDataTypeEnum.STATIC
  );
});

// 是支持 dataset 的图表类型
const isCharts = computed(() => {
  return targetData.value.chartConfig.chartFrame === ChartFrameEnum.ECHARTS;
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


const dataMappingComponentIs = computed(() => {
  if (!targetData.value) return
  switch (targetData.value.chartConfig.category) {
    case ChatCategoryEnum.BAR:
      return BarsAndLines;
    case ChatCategoryEnum.LINE:
      return BarsAndLines;
    case ChatCategoryEnum.PIE:
      return Pies;
    case ChatCategoryEnum.SCATTER:
      return Scatters
    case ChatCategoryEnum.RADAR:
      return defineAsyncComponent(
        () => import("./dataMapping/Radar.vue")
      );
    case ChatCategoryEnum.TREE_MAP:
      return defineAsyncComponent(
        () => import("./dataMapping/TreeMap.vue")
      );
    case ChatCategoryEnum.FUNNEl:
      return defineAsyncComponent(
        () => import("./dataMapping/Funnel.vue")
      );
    case FormComponentsCategoryEnum.TABLE:
      return defineAsyncComponent(
        () => import("./dataMapping/ElTable.vue")
      );
    default:
      return null;
  }
});
// watch(
//   () => targetData.value?.data,
//   (
//     newData
//   ) => {
//     if (
//       newData &&
//       targetData?.value?.chartConfig?.chartFrame === ChartFrameEnum.ECHARTS
//     ) {
//       // 只有 DataSet 数据才有对应的格式
//       // source.value = newData;
//     } else if (newData !== undefined && newData !== null) {
//       dimensionsAndSource.value = null;
//       // source.value = newData;
//     } else {
//       noData.value = true;
//       // if (targetData.value?.option.dataset) {
//       //   source.value = targetData.value?.option.dataset
//       // } else {
//       //   source.value = "此组件无数据源";
//       // }
//     }
//     if (isArray(newData)) {
//       dimensionsAndSource.value = null;
//     }
//   },
//   {
//     immediate: true,
//   }
// );

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

.edit {
  position: absolute;
  top: 5px;
  right: 5px;
}
</style>
