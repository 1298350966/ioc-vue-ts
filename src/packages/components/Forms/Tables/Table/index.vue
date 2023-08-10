<template>
  <div class="form-components-container">
    <el-table :data="dataset" v-bind="attrs" v-on="EventsClass.ElTable" :style="getStyle">
      <el-table-column
        v-if="extAttrs.isShowSelection"
        type="selection"
        width="50"
      />
      <el-table-column v-if="extAttrs.isShowIndex" type="index" width="50" />
      <template v-for="(item, index) in columns" :key="index">
        <el-table-column
          v-bind="item.attrs"
          :style="getColumnStyle(item.style)"
          className="col-class"
        />
      </template>
    </el-table>
    <el-pagination
      v-bind="extAttrs.pagingAttrs"
      v-on="EventsClass.ElPagination"
      v-model:current-page="extAttrs.pagingAttrs.currentPage"
      v-model:page-size="extAttrs.pagingAttrs.pageSize"
      v-if="extAttrs.isPaging"
      style="float: right; margin: 10px"
    />
  </div>
</template>

<script lang="ts" setup>
import { ref, PropType, getCurrentInstance } from "vue";
import { CreateComponentType } from "@/packages/index.d";
import { EventParamsName, EventNameList, Events } from "./config";
import { useAddEvent } from "@/packages/hooks/useAddEvent.kooks";
import { useChartDataFetch } from "@/hooks/useChartDataFetch.hook";
const props = defineProps({
  chartConfig: {
    type: Object as PropType<CreateComponentType>,
    required: true,
  },
});

const { rootConfig, getEvents } = useAddEvent(props.chartConfig, Events);
const getEventComponentType = function(){
  let types = {}
  Object.keys(Events).forEach((key) => {
    if(!types[Events[key].type]){
      types[Events[key].type] = []
    }
    types[Events[key].type].push(key)
  })
  return types
}

const EventsClass = computed(()=>{
  let EventClass:{
    ElTable?:any,
    ElPagination?:any,
  } = {}
  let EventComponentType = getEventComponentType()
  Object.keys(EventComponentType).forEach((key)=>{
    EventClass[key] = {}
    EventComponentType[key].forEach((eventName) => {
      if(getEvents.value[eventName]){
        EventClass[key][eventName] = getEvents.value[eventName]
      }
    })
  })
  return EventClass
})
const { attrs, extAttrs, columns, dataset } = toRefs(props.chartConfig.option);

const getStyle = computed(() => {
  let {
    bgColor,
    headerBgColor,
    headerTextColor,
    textColor,
    rowHoverBgColor,
    borderColor,
    trBgColor,
    stripeTrBgColor,
    expandedCellBgColor
  } = props.chartConfig.option.style;
  return {
    "--el-table-bg-color": bgColor,
    "--el-table-header-bg-color": headerBgColor,
    "--el-table-header-text-color": headerTextColor,
    "--el-table-text-color": textColor,
    "--el-table-row-hover-bg-color": rowHoverBgColor,
    "--el-table-border-color": borderColor,
    "--el-table-tr-bg-color":trBgColor,
    "--el-table-expanded-cell-bg-color":expandedCellBgColor,
    "--el-fill-color-lighter":stripeTrBgColor
  };
});
const getColumnStyle = (styleOptions) => {
  let { fontSize, color } = styleOptions;
  return {
    "--el-table-column-color": color,
    "--el-table-column-font-size": fontSize,
  };
};

const handleCurrentChange = (val) => {
  extAttrs.value.pagingAttrs.currentPage = val;
  console.log(`output->`, val);
};
const handleSizeChange = (val) => {
  extAttrs.value.pagingAttrs.pageSize = val;
  console.log(`output->`, val);
};

useChartDataFetch(props.chartConfig, rootConfig.requestGlobalConfig, (data) => {
  console.log(data);
  dataset.value = data;
});

watch(
  () => props.chartConfig.data,
  (nweVl, oldVl) => {
    console.log(`output->`, nweVl, oldVl);
    dataset.value = nweVl.datas;
    extAttrs.value.pagingAttrs.total = nweVl.totalCount;
    extAttrs.value.pagingAttrs.pageNum = nweVl.pageNum;
    extAttrs.value.pagingAttrs.pageSize = nweVl.pageSize;
  }
);
</script>

<style lang="scss" scoped>
.form-components-container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-flow: column;

  .el-table {
    flex: 1;
  }
}

:deep(.col-class) {
  // color:red;
  color: var(--el-table-column-color);
  font-size: var(--el-table-column-font-size) px;
}
</style>
