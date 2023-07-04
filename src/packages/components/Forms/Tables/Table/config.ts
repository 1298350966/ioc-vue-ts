import { echartOptionProfixHandle, PublicConfigClass } from '@/packages/public'
import { TableConfig } from './index'
import { CreateComponentType, EventsType } from '@/packages/index.d'
import cloneDeep from 'lodash/cloneDeep'
import dataJson from './data.json'
export const columnItem = {
  attrs: {
    prop: "",
    label: "",
    width: null,
    minWidth: null,
    align: "left",
    headerAlign: "left",
    showOverflowTooltip: true,
    fixed: false
  },
  style: {
    fontSize: 12,
    color: "",
  }
}
export const option = {
  modelValue:'',
  attrs:{
      height:null,
      maxHeight:null,
      stripe:false,
      border:false,
      size:'default',
      highlightCurrentRow:false,
      rowKey:null,    //使用reserve-selection功能与显示树形数据时，该属性是必填的
      emptyText:'暂无数据',
      defaultExpandAll:false,
      expandRowKeys:null,
      tooltipEffect:'dark', //溢出的 tooltip 的主题dark / light
  },
  extAttrs:{
      isShowSelection:false,
      isShowIndex:false,
      isPaging:true,
      pagingAttrs:{
        total: dataJson.totalCount ||  10,  //总数量
        pageSizes:[5,10,20,50],
        pageSize: dataJson.pageSize || 10,  //分页大小
        currentPage: dataJson.pageNum || 1,  //当前页数
        pagerCount:  10, //设置最大页码按钮数
        layout:"total,sizes,prev, pager, next",
        background:false,
        hideOnSinglePage:false, //只有一页隐藏分页
        disabled:false,
        small:true,  //使用小型分页
      }
  },
  style:{
    bgColor:'',
    headerBgColor:'',
    headerTextColor:'',   
    textColor:'',     // 表格内容文字颜色
    rowHoverBgColor:'',
    borderColor:'',   //边框颜色
  },
  columns: ["date", "name", "address"].map((prop,index) => {
    let column = cloneDeep(columnItem)
    column.attrs.label = "字段" + index 
    column.attrs.prop = prop
    return column
  }) ,
  dataset: dataJson.datas,
  methods:{},
  events:{
    select:"",
    selectAll:"",
    selectionChange:"",
    cellClick:"",
    rowClick:"",
    headerClick:"",
    // tableEvents:{
      
    // },
    // paginationEvents:{}
  }

}

  //组件基础事件类型
export enum BaseEventEnum {
  // 手动勾选数据行的 Checkbox时
  SELECT = 'select',
  // 手动勾选全选 Checkbox 时
  SELECTALL = 'select-all',
  // 选择项发生变化时
  SELECTIONCHANGE = 'selection-change',
  // 某个单元格被点击时
  CELLCLICK = 'cell-click',
  // 某一行被点击时
  ROWCLICK = 'row-click',
  // 某一列的表头被点击时
  HEADERCLICK = 'header-click',
  // 每页数量改变
  SIZE_CHANGE = "size-change",
  // 页码改变
  CURRENT_CHANGE = "current-change"
}
//组件基础事件名称
export const EventTypeName = {
  [BaseEventEnum.SELECT]: "勾选数据行时",
  [BaseEventEnum.SELECTALL]: "勾选全选 Checkbox 时",
  [BaseEventEnum.SELECTIONCHANGE]: "选择项变化时",
  [BaseEventEnum.CELLCLICK]: "单元格点击时",
  [BaseEventEnum.ROWCLICK]: "行点击时",
  [BaseEventEnum.HEADERCLICK]: "列的表头点击时",
};
//组件基础事件的参数名称
export const EventParamsName = {
  [BaseEventEnum.SELECT]: ["selection","row"],
  [BaseEventEnum.SELECTALL]: ["selection"],
  [BaseEventEnum.SELECTIONCHANGE]: ["selection"],
  [BaseEventEnum.CELLCLICK]: ["row", "column", "cell", "event"],
  [BaseEventEnum.ROWCLICK]: ["row", "column", "event"],
  [BaseEventEnum.HEADERCLICK]: [ "column", "event"],
};
export const EventNameList = ['select','select-all','selection-change','cell-click','row-click','header-click']

const eventVarOptions = []

function setVars({ option }) {
  this.vars = option.columns.map((c) => {
    return {
      label: c.attrs.label + "(" + c.attrs.prop + ")",
      value: "${row." + c.attrs.prop + "}",
    }
  })
}
//事件
export const Events: EventsType = {
  [BaseEventEnum.SELECT]: {
    type:'ElTable',
    key: BaseEventEnum.SELECT,
    name: `勾选数据行触发`,
    paramsName: ["selection", "row", "config", 'rootConfig'],
    vars: [],
    setVars: setVars
  },
  [BaseEventEnum.SELECTALL]: {
    type:'ElTable',
    key: BaseEventEnum.SELECTALL,
    name: "勾选全选触发",
    paramsName: ["selection", "config", 'rootConfig'],
    vars: []
  },
  [BaseEventEnum.SELECTIONCHANGE]: {
    type:'ElTable',
    key: BaseEventEnum.SELECTIONCHANGE,
    name: "选择项发生变化触发",
    paramsName: ["selection", "config", 'rootConfig'],
    vars: []
  },
  [BaseEventEnum.CELLCLICK]: {
    type:'ElTable',
    key: BaseEventEnum.CELLCLICK,
    name: "单元格点击触发",
    paramsName: ["row", "column", "cell", "event", "config", 'rootConfig'],
    vars: [],
    setVars: setVars
  },
  [BaseEventEnum.ROWCLICK]: {
    type:'ElTable',
    key: BaseEventEnum.ROWCLICK,
    name: "行点击触发",
    paramsName: ["row", "column", "event", "config", 'rootConfig'],
    vars: [],
    setVars: setVars
  },
  [BaseEventEnum.HEADERCLICK]: {
    type:'ElTable',
    key: BaseEventEnum.HEADERCLICK,
    name: "列表头点击触发",
    paramsName: ["column", "event", "config", 'rootConfig'],
    vars: [],
  },
  [BaseEventEnum.SIZE_CHANGE]: {
    type:'ElPagination',
    key: BaseEventEnum.SIZE_CHANGE,
    name: "每页数量改变",
    paramsName: ["value", "config", 'rootConfig'],
    vars: [
      {
        label:"每页数量",
        value: "${value}",
      }
    ],
  },
  [BaseEventEnum.CURRENT_CHANGE]: {
    type:'ElPagination',
    key: BaseEventEnum.CURRENT_CHANGE,
    name: "页码改变",
    paramsName: ["value", "config", 'rootConfig'],
    vars:[{
      label:"页码",
      value: "${value}",
    }],
  },
}

export default class Config extends PublicConfigClass {
  public key = TableConfig.key
  public chartConfig = cloneDeep(TableConfig)
  public filterNode = ""
  // 控件配置项
  public option = cloneDeep(option)
  public tableDateMapping = {
    pageNum: {
      prop: "pageNum",
      label: "页码",
    },
    pageSize: {
      prop: "pageSize",
      label: "每页数量",
    },
    datas: {
      prop: "datas",
      label: "表格数据",
      children: []
    }
  }
}