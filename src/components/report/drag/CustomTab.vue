<template>
  <div @mousedown.stop style="height: 100%" onClick="event.cancelBubble = true">
    <!--        @click.stop="handleTabsClick()"-->
    <el-tabs
      v-model="currentActiveTabId"
      editable
      @edit="handleTabsEdit"
      style="height: 100%"
      @tab-click="handleTabsClick"
      :type="tabItem.style.tabType"
      :tab-position="tabItem.style.tabPosition"
    >
      <el-tab-pane
        onClick="event.cancelBubble = true"
        style="height: 100%"
        :key="et.tabId"
        v-for="(et, etIndex) in editableTabs"
        :label="et.tabName"
        :name="et.tabId"
      >
        <div class="scrollBar" ref="scrollBar">
          <power-drag-child
            v-if="et.tabId === activeTabId"
            :add-or-edit="addOrEdit"
            :ref="'cyGridster' + tabPageWidgetId + et.tabId"
            :your-list="et.tabContent.widgets"
            :base-margin-left="baseMarginLeft"
            :base-margin-top="baseMarginTop"
            :base-width="baseWidth"
            :base-height="baseHeight"
            :drag-start="dragStart1"
            :dragging="dragging1"
            :drag-end="dragEnd1"
            :resize-start="resizeStart1"
            :resizing="resizing1"
            :resize-end="resizeEnd1"
            @handleClick="handleItemClick1"
            @onResize="dragResize"
          >
            <template
              v-for="(item, index) in et.tabContent.widgets"
              :slot="'slot' + index"
            >
              <div
                class="dragHandle"
                :key="index"
                onClick="event.cancelBubble = true"
                :style="[
                  {
                    'background-color': item.backgroundColor
                      ? item.backgroundColor
                      : 'transparent',
                  },
                  { border: item.borderColor ? '1px solid ' + item.borderColor : 'none' },
                  {
                    padding:
                      (typeof item.paddingTop === 'number'
                        ? item.paddingTop + 'px'
                        : '25px') +
                      ' ' +
                      (typeof item.paddingRight === 'number'
                        ? item.paddingRight + 'px'
                        : '5px') +
                      ' ' +
                      (typeof item.paddingBottom === 'number'
                        ? item.paddingBottom + 'px'
                        : '5px') +
                      ' ' +
                      (typeof item.paddingLeft === 'number'
                        ? item.paddingLeft + 'px'
                        : '5px'),
                  },
                ]"
              >
                <!--????????????-->
                <div class="tool-title">
                  <!--????????????????????????-->
                  <template v-if="item.style">
                    <div
                      class="caption"
                      v-if="item.style.mainTitleVisiable"
                      :style="{ color: item.style.mainTitleColor }"
                    >
                      {{ item.style.mainTitle }}
                    </div>
                  </template>
                  <template v-else>
                    <div class="caption">{{ item.name }}</div>
                  </template>
                </div>
                <!--???????????????-->
                <div class="tool">
                  <el-button
                    type="text"
                    icon="el-icon-edit"
                    style="margin-right: 10px"
                    @click.stop="editQueryWidget(item)"
                    v-if="item.type && item.type === 'queryWidget'"
                  ></el-button>
                  <el-dropdown @command="handleCommand">
                    <span class="el-dropdown-link">
                      <i class="el-icon-more el-icon--right"></i>
                    </span>
                    <el-dropdown-menu slot="dropdown">
                      <el-dropdown-item
                        icon="el-icon-view"
                        :command="beforeHandleCommand(item, index, 'sql')"
                        v-if="item.type == 'reportWidget'"
                      >
                        ??????SQL
                      </el-dropdown-item>
                      <el-dropdown-item
                        icon="el-icon-delete-solid"
                        :command="beforeHandleCommand(item, index, 'delete')"
                        >??????
                      </el-dropdown-item>
                    </el-dropdown-menu>
                  </el-dropdown>
                </div>
                <!--????????????-->
                <template
                  v-if="
                    item.type &&
                    item.type === 'reportWidget' &&
                    item.reportType === 'kanbanWidget'
                  "
                >
                  <kanban-widget
                    :item="item"
                    :ref="'kanbanWidget' + index"
                  ></kanban-widget>
                </template>
                <!--?????????-->
                <template
                  v-if="
                    item.type &&
                    item.type === 'reportWidget' &&
                    item.reportType === 'tableReportWidget'
                  "
                >
                  <table-widget
                    :item="item"
                    :data="tableData"
                    :ref="'tableWidget' + index"
                    style="height: 100%"
                  ></table-widget>
                </template>
                <!--????????????-->
                <template v-if="item.type && item.type === 'queryWidget'">
                  <query-widget
                    :queryWidgetData="item"
                    @queryReportData="queryByCustomCondition"
                  ></query-widget>
                </template>
                <!--????????????-->
                <template v-if="item.type && item.type === 'textWidget'">
                  <text-widget :textWidgetData="item" :isEdit="true"></text-widget>
                </template>
                <!--????????????-->
                <template v-if="item.type && item.type === 'imgWidget'">
                  <image-widget :imageWidgetData="item"></image-widget>
                </template>
                <!--????????????-->
                <template v-if="item.type && item.type === 'innerPageWidget'">
                  <iframe
                    :src="item.src"
                    width="100%"
                    height="100%"
                    style="
                      border-width: 0;
                      pointer-events: none;
                      height: calc(100% - 3px);
                    "
                  ></iframe>
                </template>
                <!--Charts  onClick="event.cancelBubble = true" ???????????????????????????????????????-->
                <template
                  v-if="
                    item.type &&
                    item.type === 'reportWidget' &&
                    item.reportType !== 'tableReportWidget' &&
                    item.reportType !== 'kanbanWidget'
                  "
                >
                  <ul
                    v-if="
                      item.data.superConds instanceof Array &&
                      item.data.superConds.length > 0
                    "
                    class="time-switcher"
                  >
                    <li
                      class="time-item"
                      v-for="(dbBtn, index) in item.data.superConds"
                      :key="index"
                      :style="[
                        {
                          background: dbBtn.default
                            ? item.style.superConds
                              ? item.style.superConds.selected.backgroundColor
                              : '#0140ff'
                            : item.style.superConds
                            ? item.style.superConds.unselected.backgroundColor
                            : 'transparent',
                        },
                        {
                          'font-size': dbBtn.default
                            ? item.style.superConds
                              ? item.style.superConds.selected.fontSize
                              : '12px'
                            : item.style.superConds
                            ? item.style.superConds.unselected.fontSize
                            : '12px',
                        },
                        {
                          color: dbBtn.default
                            ? item.style.superConds
                              ? item.style.superConds.selected.fontColor
                              : '#fff'
                            : item.style.superConds
                            ? item.style.superConds.unselected.fontColor
                            : '#fff',
                        },
                      ]"
                      @click="queryBySuperConds(dbBtn, item)"
                    >
                      {{ dbBtn.alias }}
                    </li>
                  </ul>
                  <div
                    v-if="item"
                    class="chart"
                    :ref="'chart' + index"
                    v-loading="item.chartLoading"
                    onClick="event.cancelBubble = true"
                  ></div>
                  <el-breadcrumb
                    v-if="item.drillNavigation && item.drillNavigation.length > 0"
                    style="position: absolute; bottom: 0"
                    separator=""
                  >
                    <el-breadcrumb-item
                      v-for="(dc, key) in item.drillNavigation"
                      :key="key"
                    >
                      <a
                        @click="handleBackSenior(item, index, key)"
                        :style="[
                          {
                            'font-size': item.style.drillNavigationFontSize
                              ? item.style.drillNavigationFontSize
                              : '12px',
                          },
                          {
                            color: item.style.drillNavigationFontColor
                              ? item.style.drillNavigationFontColor
                              : 'black',
                          },
                        ]"
                        >{{ dc.value }}</a
                      >
                      <i
                        class="el-breadcrumb__separator el-icon-arrow-right"
                        :style="[
                          {
                            'font-size': item.style.drillNavigationFontSize
                              ? item.style.drillNavigationFontSize
                              : '12px',
                          },
                          {
                            color: item.style.drillNavigationFontColor
                              ? item.style.drillNavigationFontColor
                              : 'black',
                          },
                        ]"
                      ></i>
                    </el-breadcrumb-item>
                  </el-breadcrumb>
                </template>
              </div>
            </template>
          </power-drag-child>
        </div>
      </el-tab-pane>
    </el-tabs>
    <el-dialog
      :visible.sync="conditionVisible"
      v-if="conditionVisible"
      :modal="false"
      width="85%"
    >
      <condition-config
        :widgets="tabWidgets"
        @closeCondition="conditionVisible = false"
        :queryId="queryId"
      ></condition-config>
    </el-dialog>
    <el-dialog title="sql??????" :visible.sync="sqlVisible" :modal="false" width="60%">
      <div v-if="refreshSqlEditor" style="padding-top: 10px; padding-bottom: 30px">
        <SqlEditor
          ref="sqleditor"
          :value="basicInfoForm.sqlMain"
          :readOnly="true"
          @changeTextarea="changeTextarea($event)"
        />
        <el-button
          type="primary"
          size="small"
          style="float: right; margin: 15px"
          class="sql-btn"
          @click="formaterSql(basicInfoForm.sqlMain)"
          >?????????sql
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import drag from "@/components/report/drag/TabDrag.vue";
import QueryWidget from "@/components/report/queryWidget/QueryWidget.vue";
import TextWidget from "@/components/report/textWidget/TextWidget.vue";
import TableWidget from "@/components/report/tableWidget/TableWidget.vue";
import ImgWidget from "@/components/report/imgWidget/ImgWidget.vue";
import CustomTab from "@/components/report/drag/CustomTab.vue";
import ConditionConfig from "@/components/report/conditions/ConditionConfig";
import KanbanWidget from "@/components/report/kanbanWidget/KanbanWidget";
import SqlEditor from "@/components/SqlEditor";
import sqlFormatter from "sql-formatter";

let chartInstanceBox = {};
export default {
  name: "CustomTab",
  created() {
    this.$watch(
      function () {
        // ???????????????????????????????????????????????????????????????return????????????
        let tempIndex = 0;
        if (this.editableTabs instanceof Array) {
          this.editableTabs.forEach((tb, index) => {
            if (tb.tabId === this.activeTabId) {
              tempIndex = index;
            }
          });
        }
        if (this.editableTabs[tempIndex]) {
          return this.editableTabs[tempIndex].widgetCount;
        }
      },
      function (oldVal, newVal) {
        this.addInnerWidget();
      }
    );
    this.$watch(
      function () {
        // ???????????????????????????????????????????????????????????????return????????????
        if (this.tabItem.style.tabType) {
          return this.tabItem.style.tabType;
        }
      },
      function (oldVal, newVal) {
        this.initTabGrid();
      }
    );
    this.$watch(
      function () {
        // ???????????????????????????????????????????????????????????????return????????????
        if (this.tabItem.style.tabPosition) {
          return this.tabItem.style.tabPosition;
        }
      },
      function (oldVal, newVal) {
        this.initTabGrid();
      }
    );
    if (this.KHUtils.isNull(this.activeName)) {
      this.currentActiveTabId = this.tabItem.activeTabId;
    } else {
      this.currentActiveTabId = this.activeName;
    }
  },
  props: {
    editableTabs: { type: Array, required: true },
    activeTabId: { type: String, required: true },
    tabPageWidgetId: { type: Number, required: true },
    tabItem: { type: Object, required: true },
    widgetType: { type: String, required: true },
    reviewType: { type: String, required: false },
    notifyTabQuery: { type: Number, required: false },
    notifyCancelSelected: { type: Number, required: false },
    notifyTabQueryCustom: { type: Number, required: false },
    tabQueryParam: { type: Array, required: false },
    baseSet: { required: false, type: Object },
  },
  watch: {
    currentActiveTabId: {
      deep: true,
      handler() {
        this.$emit("handleTabClick", this.currentActiveTabId, this.tabPageWidgetId);
      },
    },
    notifyTabQuery: {
      deep: true,
      handler() {
        let _this = this;
        if (_this.tabItem.tabs instanceof Array) {
          _this.tabItem.tabs.forEach((tb) => {
            if (tb.tabId === _this.currentActiveTabId) {
              _this.KHReport.commonQuery(
                _this.currentSelectItem,
                _this,
                chartInstanceBox,
                tb.tabContent.widgets,
                false
              );
            }
          });
        }
      },
    },
    notifyTabQueryCustom: {
      deep: true,
      handler() {
        let _this = this;
        if (!_this.KHUtils.isNull(_this.tabQueryParam)) {
          _this.queryByCustomCondition(_this.tabQueryParam, true); // tab???????????????????????????Tab????????????
        }
      },
    },
    notifyCancelSelected: {
      deep: true,
      handler() {
        this.addOrEdit = false;
      },
    },
  },
  data() {
    return {
      baseWidth: 0,
      baseHeight: 0,
      baseMarginLeft: 0,
      baseMarginTop: 0,
      currentActiveTabId: "0",
      drillNavigation: [],
      sqlVisible: false,
      addOrEdit: true, // ??????????????????
      currentSelectItem: {}, // ?????????????????????
      tdLoading: false,
      tableData: [],
      conditionVisible: false,
      queryId: "",
      queryParams: [],
      seriesData: [],
      refreshTextWidget: true,
      basicInfoForm: {
        sqlMain: "",
      },
      refreshSqlEditor: true,
      tabWidgets: [], // ??????Tab????????????
      tabIndex: 1,
      resizeObserver: null,
    };
  },
  components: {
    "query-widget": QueryWidget,
    "power-drag-child": drag,
    "image-widget": ImgWidget,
    "custom-tab": CustomTab,
    "condition-config": ConditionConfig,
    "text-widget": TextWidget,
    "table-widget": TableWidget,
    SqlEditor: SqlEditor,
    "kanban-widget": KanbanWidget,
  },
  mounted() {
    let _this = this;
    _this.initTabGrid();

    if (!this.resizeObserver) {
        this.$nextTick(()=>{
            this.resizeObserver = new ResizeObserver((entries) => {
                console.log("entries", entries);
                //??????
                this.dragResize();
            });
            //???????????????dom
            if (this.$refs.scrollBar) {
                if (Array.isArray(this.$refs.scrollBar)) {
                this.$refs.scrollBar.forEach((scrollBar, index, array) => {
                    this.resizeObserver.observe(scrollBar);
                });
                } else {
                this.resizeObserver.observe(this.$refs.scrollBar);
                }
            }
        })
    }
  },
  beforeDestroy() {
    this.resizeObserver.disconnect();
  },
  methods: {
    scroll(e) {
      // console.log("scroll",scroll)
    },
    //??????window????????????
    async dragResize() {
      await this.FormWidgetHelper.initGridBaseDesign(this);
      let gridster = this.$refs[
        "cyGridster" + this.tabPageWidgetId + this.currentActiveTabId
      ]; //??????gridster??????
      gridster[0].init();
      console.log("CustomTab.vue");
    },
    queryBySuperConds(dbBtn, item) {
      let _this = this;
      let column = _this.KHChart.splicingColumnSetNoIdWithTableName(dbBtn, _this);
      item.data.superConds.forEach((obj) => {
        let compareColumn = _this.KHChart.splicingColumnSetNoIdWithTableName(obj, _this);
        obj.default = column === compareColumn;
      });
      if (_this.tabItem.tabs instanceof Array) {
        _this.tabItem.tabs.forEach((tb) => {
          if (tb.tabId === _this.currentActiveTabId) {
            _this.KHReport.commonQuery(
              item,
              _this,
              chartInstanceBox,
              tb.tabContent.widgets,
              false
            );
          }
        });
      }
    },
    // ???????????????Tab????????????Grid
    async initTabGrid() {
      await this.WidgetHelper.initGridBaseDesign(this); //???????????????????????????????????????????????????????????????
      let _this = this;
      let gridster = this.$refs[
        "cyGridster" + _this.tabPageWidgetId + _this.currentActiveTabId
      ]; //??????gridster??????
      if (gridster instanceof Array && gridster.length > 0) {
        gridster[0].init();
        if (_this.tabItem.tabs instanceof Array) {
          _this.tabItem.tabs.forEach((tb) => {
            if (tb.tabId === _this.currentActiveTabId) {
              _this.KHReport.initReportQueryCondtions(_this, tb.tabContent.widgets); // ??????????????????????????????
              if (
                tb.tabContent.widgets instanceof Array &&
                tb.tabContent.widgets.length > 0
              ) {
                _this.currentSelectItem = tb.tabContent.widgets[0];
                _this.$emit("notifyCurrentItemChange", _this.currentSelectItem); // ??????Tab????????????Tab??????????????????
                tb.tabContent.widgets.forEach((obj, index) => {
                  if (!_this.WidgetHelper.checkItem(_this, obj)) {
                    return false;
                  }
                  _this.KHReport.commonQuery(
                    obj,
                    _this,
                    chartInstanceBox,
                    tb.tabContent.widgets,
                    false
                  );
                });
              }
            }
          });
        }
      }
    },
    // ?????????????????????
    queryByCustomCondition(queryParams, innerOrOutter) {
      let _this = this;
      if (!innerOrOutter) {
        // console.log("tab receive QueryWidget :" + JSON.stringify(queryParams));
        //_this.$emit("queryByCustomCondition", queryParams); // ???Tab?????????????????????????????????Tab???????????????
      }
      let widgets = [];
      if (_this.tabItem.tabs instanceof Array) {
        _this.tabItem.tabs.forEach((tb) => {
          if (tb.tabId === _this.currentActiveTabId) {
            if (
              tb.tabContent.widgets instanceof Array &&
              tb.tabContent.widgets.length > 0
            ) {
              widgets = tb.tabContent.widgets;
            }
          }
        });
      }
      _this.KHReport.queryByCustomCondition(
        _this,
        queryParams,
        widgets,
        chartInstanceBox,
        false
      );
    },
    // Chart????????????
    handleBackSenior(item, itemIndex, condIndex) {
      let _this = this;
      _this.KHReport.handleBackSenior(
        item,
        itemIndex,
        condIndex,
        _this,
        chartInstanceBox,
        false
      );
    },
    // ?????????????????????????????????
    handleTabsClick() {
      let _this = this;
      this.$emit("stopDragEvent");
      setTimeout(() => {
        _this.initTabGrid();
      }, 100);
    },
    // ????????????
    addInnerWidget() {
      let _this = this;
      let gridsters =
        _this.$refs["cyGridster" + _this.tabPageWidgetId + _this.currentActiveTabId]; //??????gridster??????
      if (!(gridsters instanceof Array) || gridsters.length === 0) {
        return false;
      }
      gridsters[0].init();
      let gridY = 1;
      let gridX = 1;
      let gridster = gridsters[0];
      let maxCell = gridster.getMaxCell() - 1;
      let sizeX = Math.floor(maxCell / 2);
      let sizeY = Math.floor(maxCell * (1 / 30));
      _this.tabItem.tabs.forEach((tb) => {
        if (tb.tabId === _this.currentActiveTabId) {
          tb.tabContent.widgets.forEach((obj) => {
            obj.showMoreOptVisible = false;
          });
          let cal = _this.WidgetHelper.calItemPosition(
            tb.tabContent.widgets,
            _this,
            maxCell,
            sizeX
          );
          if (!_this.KHUtils.isNull(cal)) {
            gridX = cal.gridX;
            gridY = cal.gridY;
          }
        }
      });
      _this.WidgetHelper.addWidget(_this, gridster, gridX, gridY, sizeX, sizeY, false);
    },
    // ????????????
    deleteItem(index) {
      let _this = this;
      let gridster =
        _this.$refs["cyGridster" + _this.tabPageWidgetId + _this.currentActiveTabId]; //??????gridster??????
      gridster[0].removeItem(index);
      if (chartInstanceBox["chart" + index]) {
        chartInstanceBox["chart" + index].destroy(); //????????????this.myList???index?????????item??????{}????????????????????????vue??????????????????v-for???
        //????????????????????????????????????????????????????????????????????????????????????v-if???????????????????????????highchart?????????????????????chartInstance.$destroy()
      }
      _this.currentSelectItem = null;
      _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
    },
    // ??????Tab?????????
    handleTabsEdit(targetName, action) {
      if (action === "add") {
        let newTab = {
          remark: "",
          tabId: ++this.tabIndex + "",
          tabName: "New Tab",
          widgetCount: 0, // ??????????????????????????????
          tabContent: {
            layout: {
              rows: [
                {
                  columns: [
                    {
                      widgetId: "",
                    },
                  ],
                },
              ],
              style: {},
            },
            widgets: [],
          },
        };
        this.tabItem.tabs.push(newTab);
        this.tabItem.activeTabId = newTab.tabId;
        this.currentActiveTabId = this.tabItem.activeTabId;
      }
      if (action === "remove") {
        let tabs = this.tabItem.tabs;
        if (this.tabItem.activeTabId === targetName) {
          tabs.forEach((tab, index) => {
            if (tab.tabId === targetName) {
              let nextTab = tabs[index + 1] || tabs[index - 1];
              if (nextTab) {
                this.tabItem.activeTabId = nextTab.tabId;
              }
            }
          });
        }
        let tempArray = tabs.filter((tab) => tab.tabId !== targetName);
        if (tempArray.length === 0) {
          this.$message.warning("??????????????????Tab???");
          return false;
        }
        this.tabItem.tabs = tempArray;
        this.currentActiveTabId = this.tabItem.activeTabId;
      }
      setTimeout(() => {
        let gridster = this.$refs[
          "cyGridster" + this.tabPageWidgetId + this.currentActiveTabId
        ]; //??????gridster??????
        if (gridster instanceof Array && gridster.length > 0) {
          gridster[0].init();
        }
      }, 100);
    },
    // ?????????????????????
    editQueryWidget(item) {
      let _this = this;
      _this.conditionVisible = true;
      if (_this.tabItem && _this.tabItem.tabs instanceof Array) {
        _this.tabItem.tabs.forEach((tb) => {
          if (tb.tabId === _this.currentActiveTabId) {
            if (
              tb.tabContent.widgets instanceof Array &&
              tb.tabContent.widgets.length > 0
            ) {
              _this.tabWidgets =
                _this.tabItem.tabs[_this.currentActiveTabId].tabContent.widgets;
            }
          }
        });
      }
      _this.queryId = item.id;
      _this.currentSelectItem = item;
    },
    changeTextarea(val) {
      this.$set(this.basicInfoForm, "sqlMain", val);
    },
    formaterSql(val) {
      let dom = this.$refs.sqleditor;
      dom.editor.setValue(sqlFormatter.format(dom.editor.getValue()));
    },
    openSqlEditor(desc) {
      let _this = this;
      _this.sqlVisible = true;
      _this.basicInfoForm.sqlMain = desc;
      _this.refreshSqlEditor = false; //????????????
      this.$nextTick(function () {
        _this.refreshSqlEditor = true; //?????????
      });
      var t = setTimeout(function () {
        _this.formaterSql(_this.basicInfoForm.sqlMain);
      }, 100);
      _this.item.showMoreOptVisible = false;
    },
    beforeHandleCommand(item, index, command) {
      return {
        item: item,
        index: index,
        command: command,
      };
    },
    handleCommand(obj) {
      let _this = this;
      let item = obj.item;
      let index = obj.index;
      let command = obj.command;
      if (command == "sql") {
        _this.openSqlEditor(item.desc);
      } else if (command == "delete") {
        _this.deleteItem(index);
      }
    },
    /**#############################start##################################**/
    /**#############################?????????Drag?????????????????????##################################**/
    // ??????????????????item??????
    handleItemClick1(item) {
      let _this = this;
      _this.addOrEdit = true;
      _this.currentSelectItem = item;
      this.$emit("notifyCurrentItemChange", item);
    },
    /**
             e:????????????
             item???????????????
             index?????????????????????
             */
    dragStart1(e, item, index) {
      this.$emit("stopDragEvent");
    },
    dragging1(e, item, index) {
      // this.$emit("stopDragEvent");
    },
    dragEnd1(e, item, index) {
      this.$emit("startDragEvent");
    },
    resizeStart1(e, item, index) {
      this.$emit("stopDragEvent");
    },
    resizing1(e, item, index) {
      // this.$emit("stopDragEvent");
    },
    resizeEnd1(e, item, index) {
      item.showMoreOptVisible = false;
      if (chartInstanceBox["chart" + index]) {
        chartInstanceBox["chart" + index].reflow();
        this.PieChart.resizeTitle(item, chartInstanceBox, index);
      }
      this.$emit("startDragEvent");
    },
    /**#############################end##################################**/
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/report/drag-power.scss";
.scrollBar {
  height: 100%;
  width: 100%;
  position: relative;
  // box-sizing: border-box;
  overflow: auto;
}
.dragAndResize {
  height: 100%;
  //background-color: #EBEAEF;
}

::v-deep .el-tabs__content {
  height: calc(100% - 55px);
}
</style>
