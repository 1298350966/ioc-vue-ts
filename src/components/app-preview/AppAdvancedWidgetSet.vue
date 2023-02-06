<template>
  <el-container class="config-container">
    <!--表单设计-页面设置-->
    <div class="main-design">
      <template>
        <div class="chart-design">APP设计</div>
      </template>
    </div>
    <!--头部(数据-样式-高级)-->
    <el-header style="text-align: center;height:45px">
      <template>
        <div class="config-tab" :class="{active: activeName === 'first',tableColor: activeName === 'first'}"
             @click="handleTabSelect('first')">数据
        </div>
        <div class="config-tab" :class="{active: activeName === 'second'}"
             @click="handleTabSelect('second')">样式
        </div>
        <div class="config-tab" :class="{active: activeName === 'third'}"
             @click="handleTabSelect('third')">高级
        </div>
      </template>

    </el-header>
    <!--设置内容-->
    <el-main class="config-content">
      <!--数据-->
      <div v-show="activeName === 'first'"
           style="display: flex;flex-direction: row;height: 100%">
        <!--左侧栏-->
        <div class="data-config-panel-left">
          <div class="div-first">
            <div class="div-second">
              <!--设置-->
              <div class="div-third">
                <!--表单数据设置-->
                <app-widget-set :item="item" :active-name="activeName"
                                :currDragItem="currDragItem"
                                ref="tableWidgetSet"
                                @showAddQuerySortDialog="showAddQuerySortDialog"
                                @showCondFilterConfigDialog="showCondFilterConfigDialog"
                                @removeCol="removeCol"
                                @removeCondFilter="removeCondFilter"
                                @removeQuerySort="removeQuerySort"
                                @removeTitle="removeTitle"
                                @removeLeftBottom="removeLeftBottom"
                                @removeRightBottom="removeRightBottom"
                                @removeCondition="removeCondition"
                                @removeEnumCondition="removeEnumCondition"
                                @openPlaceHolderDialog="openPlaceHolderDialog"
                                @removeRightTop="removeRightTop"
                                @removeHeadIocn="removeHeadIocn"
                                @removeHeadTitle="removeHeadTitle"
                                @removeHeadDescribe="removeHeadDescribe"
                ></app-widget-set>
              </div>
            </div>
            <!--更新-->
            <div class="bottom-menus">
              <div class="preview-panel">
                <label class="preview-label">结果展示</label>
                <el-input type="number" :value="1000"
                          style="width: 40%;background-color: #414A63"></el-input>
              </div>
              <div class="refresh-panel">
                <el-button type="primary"
                           style="width: 100%;background-color: #2153D4;border: none;border-radius: 0px"
                           @click="updateForm">更新
                </el-button>
              </div>
            </div>
          </div>
        </div>
        <!--右侧栏-->
        <div class="data-config-panel-right" style="width: 50%;overflow: auto">
          <data-tree-show :cols-array="colsArray" :formName="formName" isApp
                          @addDragItem="addDragItem" @endDragItem="endDragItem"/>
        </div>
      </div>
      <!--样式-->
      <div v-show="activeName === 'second'" class="second-config-content report-set-style">

      </div>
      <!--高级-->
      <div v-show="activeName === 'third'">
        <el-collapse v-model="queryActiveNames">
          <el-collapse-item title="高级设置" name="1">
            <el-form label-position="top" class="report-set-margin-let">
              <el-form-item label=" ">
                <el-checkbox>自动刷新</el-checkbox>
                <el-input style="width: 40%" type="number"
                          min="1"
                          :disabled="true"></el-input>
                <el-select placeholder="请选择" value=""
                           :disabled="true"
                           style="width: 25%" :popper-append-to-body="false">
                  <el-option label="分钟" value="minute"></el-option>
                  <el-option label="秒" value="seconds"></el-option>
                </el-select>
              </el-form-item>
            </el-form>
          </el-collapse-item>
          <el-collapse-item title="控件信息" name="2">
            <div style="font-size: 14px;margin-left: 10px;margin-top: 15px">
              <span style="color: #C0C3CB">控件id</span>
              <span style="color: #FFFFFF"></span>
            </div>
          </el-collapse-item>
        </el-collapse>
      </div>
    </el-main>
    <el-dialog title="设置过滤条件" :visible.sync="condFilterConfigDialogVisible" v-if="condFilterConfigDialogVisible"
               :append-to-body="true"
               @close="closeCondFilterConfigDialog" custom-class="form-cond-filter-dialog" width="35%"
               :close-on-click-modal="false" :close-on-press-escape="false">
      <template v-slot:default>
        <form-cond-filter ref="formCondFilter" :formConfig="formConfig"
                          :itemDataCondFilter="currentItemDataCondFilter"></form-cond-filter>
      </template>
      <template v-slot:footer>
        <el-button @click="closeCondFilterConfigDialog">取消</el-button>
        <el-button type="primary" @click="saveCondFilterConfig">确定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="添加排序设置" :visible.sync="querySortDialogVisible" v-if="querySortDialogVisible" :append-to-body="true"
               @close="closeAddQuerySortDialog" width="45%" custom-class="query-sort-dialog" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <template v-slot:default>
        <query-sort-show ref="querySortShow" :item="item" :itemDataQuerySort="item.tableItem.querySort"
                         :colsArray="colsArray"></query-sort-show>
      </template>
      <template v-slot:footer>
        <el-button @click="closeAddQuerySortDialog">取 消</el-button>
        <el-button type="primary" @click="saveAddQuerySort">确 定</el-button>
      </template>
    </el-dialog>
    <el-dialog title="占位内容设置" :visible.sync="placeHolderVisible" v-if="placeHolderVisible" :append-to-body="true"
               @close="closePlaceHolderVisible" width="35%" custom-class="query-sort-dialog" :close-on-click-modal="false"
               :close-on-press-escape="false">
      <template v-slot:default>
        <el-form label-position="right">
          <el-form-item label="占位内容" label-width="80px">
            <el-input v-model="placeHolderContent"></el-input>
          </el-form-item>
        </el-form>
      </template>
      <template v-slot:footer>
        <el-button @click="closePlaceHolderVisible">取 消</el-button>
        <el-button type="primary" @click="savePlaceHolderVisible">确 定</el-button>
      </template>
    </el-dialog>
  </el-container>
</template>

<script>
import AppWidgetSet from "@/components/app-preview/AppWidgetSet";
import FormCondFilter from "@/components/form-design/restructure/FormCondFilter";
import QuerySortShow from "@/components/form-design/restructure/dataConfig/QuerySortShow";
import DataTreeShow from "@/components/form-design/restructure/dataConfig/DataTreeShow";

export default {
  name: "AdvancedWidgetSet",
  components: {
    AppWidgetSet,
    FormCondFilter,
    QuerySortShow,
    DataTreeShow
  },
  props: {
    colsArray: {type: Array},
    formConfig: {type: Object},
    formList: {type: Array},
    item: {required: false, type: Object}, // 当前控件item的有关配置
    baseSet: {required: false, type: Object}, //页面基础配置
    formName: {type: String}
  },
  computed: {

  },
  data() {
    return {
      activeName: 'first', //数据-样式-高级切换
      queryActiveNames: ['1'], //高级
      defaultProps: {children: 'cols', label: 'name'},  //树形结构格式
      configType: '', //列设置或过滤器
      colsCondFiltersDialogVisible: false, //字段显示对话框
      querySortDialogVisible: false,
      condFilterConfigDialogVisible: false,
      currentItemDataCondFilter: null,
      currDragItem: null,
      placeHolderVisible: false,
      placeHolderContent: ''
    };
  },
  created() {

  },
  methods: {
    updateForm() {
      let _this = this;
      _this.$emit("refreshApp");
    },
    //数据-样式-高级切换
    handleTabSelect(value) {
      this.activeName = value;
    },
    openPlaceHolderDialog() {
      this.placeHolderContent = this.item.queryCondition.placeholder;
      this.placeHolderVisible = true;
    },
    closePlaceHolderVisible() {
      this.placeHolderVisible = false;
      this.placeHolderContent = '';
    },
    savePlaceHolderVisible() {
      this.item.queryCondition.placeholder = this.placeHolderContent;
      this.closePlaceHolderVisible();
    },
    showAddColCondFilterDialog(type) {
      this.configType = type;
      this.colsCondFiltersDialogVisible = true;
    },
    showAddQuerySortDialog() {
      this.querySortDialogVisible = true;
    },
    showCondFilterConfigDialog(item) {
      this.currentItemDataCondFilter = item;
      this.condFilterConfigDialogVisible = true;
    },

    closeAddColsCondFiltersDialog() {
      this.colsCondFiltersDialogVisible = false;
    },
    closeAddQuerySortDialog() {
      this.querySortDialogVisible = false;
    },
    closeCondFilterConfigDialog() {
      this.condFilterConfigDialogVisible = false;
    },
    saveAddQuerySort() {
      let querySort = this.$refs.querySortShow.getCheckedSort();
      this.item.tableItem.querySort = [];
      this.item.tableItem.querySort.push(...querySort);
      this.closeAddQuerySortDialog();
    },
    saveCondFilterConfig() {
      let condFilter = this.$refs.formCondFilter.saveCondFilter();
      Object.assign(this.currentItemDataCondFilter, condFilter);
      this.closeCondFilterConfigDialog();
    },

    //移除列设置
    removeCol(item) {
      for (let i = 0; i < this.item.tableItem.cols.length; i++) {
        let col = this.item.tableItem.cols[i];
        if (col.key === item.key) {
          this.item.tableItem.cols.splice(i, 1);
          break;
        }
      }
    },
    // 过滤条件的删除
    removeCondFilter(item) {
      for (let i = 0; i < this.item.tableItem.condFilters.length; i++) {
        let condFilter = this.item.tableItem.condFilters[i];
        if (condFilter.model === item.model) {
          this.item.tableItem.condFilters.splice(i, 1);
          break;
        }
      }
    },
    removeQuerySort(item) {
      for (let i = 0; i < this.item.tableItem.querySort.length; i++) {
        let querySort = this.item.tableItem.querySort[i];
        if (querySort.key === item.key) {
          this.item.tableItem.querySort.splice(i, 1);
          break;
        }
      }
    },
    removeHeadIocn(item){
      for (let i = 0; i < this.item.tableItem.head.iocn.length; i++) {
        let headIocnItem = this.item.tableItem.head.iocn[i];
        if (headIocnItem.key === item.key) {
          this.item.tableItem.head.iocn.splice(i, 1);
          break;
        }
      }
    },
    removeHeadTitle(item){
      for (let i = 0; i < this.item.tableItem.head.title.length; i++) {
        let headTitleItem = this.item.tableItem.head.title[i];
        if (headTitleItem.key === item.key) {
          this.item.tableItem.head.title.splice(i, 1);
          break;
        }
      }
    },
    removeHeadDescribe(item){
      for (let i = 0; i < this.item.tableItem.head.describe.length; i++) {
        let HeadDescribeItem = this.item.tableItem.head.describe[i];
        if (HeadDescribeItem.key === item.key) {
          this.item.tableItem.head.describe.splice(i, 1);
          break;
        }
      }
    },
    removeTitle(item) {
      for (let i = 0; i < this.item.tableItem.title.length; i++) {
        let titleItem = this.item.tableItem.title[i];
        if (titleItem.key === item.key) {
          this.item.tableItem.title.splice(i, 1);
          break;
        }
      }
    },
    removeLeftBottom(item) {
      for (let i = 0; i < this.item.tableItem.leftBottom.length; i++) {
        let leftBottomItem = this.item.tableItem.leftBottom[i];
        if (leftBottomItem.key === item.key) {
          this.item.tableItem.leftBottom.splice(i, 1);
          break;
        }
      }
    },
    removeRightBottom(item) {
      for (let i = 0; i < this.item.tableItem.rightBottom.length; i++) {
        let rightBottomItem = this.item.tableItem.rightBottom[i];
        if (rightBottomItem.key === item.key) {
          this.item.tableItem.rightBottom.splice(i, 1);
          break;
        }
      }
    },
    removeCondition(item) {
      for (let i = 0; i < this.item.queryCondition.conditions.length; i++) {
        let condition = this.item.queryCondition.conditions[i];
        if (condition.key === item.key) {
          this.item.queryCondition.conditions.splice(i, 1);
          break;
        }
      }
    },
      removeCondition(item) {
          for (let i = 0; i < this.item.queryCondition.conditions.length; i++) {
              let condition = this.item.queryCondition.conditions[i];
              if (condition.key === item.key) {
                  this.item.queryCondition.conditions.splice(i, 1);
                  break;
              }
          }
      },
      removeEnumCondition(item){
          for (let i = 0; i < this.item.queryCondition.enumConditions.length; i++) {
              let condition = this.item.queryCondition.enumConditions[i];
              if (condition.key === item.key) {
                  this.item.queryCondition.enumConditions.splice(i, 1);
                  break;
              }
          }
      },
    removeRightTop(item) {
      for (let i = 0; i < this.item.tableItem.rightTop.length; i++) {
        let rightTopItem = this.item.tableItem.rightTop[i];
        if (rightTopItem.key === item.key) {
          this.item.tableItem.rightTop.splice(i, 1);
          break;
        }
      }
    },
    addDragItem(currDragItem) {
      this.currDragItem = currDragItem;
      this.$refs['tableWidgetSet'].onStartDrag();
    },
    endDragItem() {
      this.$refs['tableWidgetSet'].onEndDrag();
    }
  }
};
</script>
<style lang="scss" scoped>
@import "@/assets/style/form/advanced-widget-set.scss";

</style>

