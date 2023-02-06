<template>
  <div id="chartVue" style="height: 100%" @click="settingMainDesgin">
    <power-drag
      ref="cyGridster"
      :add-or-edit="addOrEdit"
      :resizable="resizable"
      :draggable="draggable"
      :your-list="myList"
      :base-margin-left="baseMarginLeft"
      :base-margin-top="baseMarginTop"
      :base-width="baseWidth"
      :base-height="baseHeight"
      :drag-start="dragStart"
      :dragging="dragging"
      :drag-end="dragEnd"
      :resize-start="resizeStart"
      :resizing="resizing"
      :resize-end="resizeEnd"
      @handleClick="handleItemClick"
      @onResize="dragResize"
      @onItemMouseUp="onItemMouseUp"
    >
      <template v-for="(item, index) in myList" :slot="'slot' + index">
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
                (typeof item.paddingTop === 'number' ? item.paddingTop + 'px' : '25px') +
                ' ' +
                (typeof item.paddingRight === 'number'
                  ? item.paddingRight + 'px'
                  : '5px') +
                ' ' +
                (typeof item.paddingBottom === 'number'
                  ? item.paddingBottom + 'px'
                  : '5px') +
                ' ' +
                (typeof item.paddingLeft === 'number' ? item.paddingLeft + 'px' : '5px'),
            },
          ]"
        >
          <!--左侧标题-->
          <div class="tool-title">
            <!--挂载菜单后不显示-->
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
          <!--右侧操作栏-->
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
                  查看SQL
                </el-dropdown-item>
                <el-dropdown-item
                  icon="el-icon-delete-solid"
                  :command="beforeHandleCommand(item, index, 'delete')"
                  >删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!--指标看板-->
          <template
            v-if="
              item.type &&
              item.type === 'reportWidget' &&
              item.reportType === 'kanbanWidget'
            "
          >
            <kanban-widget :item="item" :ref="'kanbanWidget' + index"></kanban-widget>
          </template>
          <!--交叉表-->
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
          <!--Tab标签页-->
          <template v-if="item.type && item.type === 'tabPageWidget'">
            <custom-tab
              :tab-page-widget-id="item.id"
              :active-tab-id="item.activeTabId"
              :editable-tabs="item.tabs"
              :tab-item="item"
              :widget-type="widgetType"
              :review-type="reviewType"
              :notify-tab-query="notifyTabQuery"
              :notify-cancel-selected="notifyCancelSelected"
              :notify-tab-query-custom="notifyTabQueryCustom"
              :tab-query-param="tabQueryParam"
              :base-set="baseSet"
              @queryByCustomCondition="queryByCustomCondition"
              @notifyCurrentItemChange="notifyCurrentItemChange"
              @handleTabClick="handleTabClick"
              @stopDragEvent="stopDragEvent"
              @startDragEvent="startDragEvent"
              @resize="customTabResize"
              ref="customTab"
            ></custom-tab>
          </template>
          <!--查询控件-->
          <template v-if="item.type && item.type === 'queryWidget'">
            <query-widget
              :queryWidgetData="item"
              @queryReportData="queryByCustomCondition"
            ></query-widget>
          </template>
          <!--文本控件-->
          <template v-if="item.type && item.type === 'textWidget'">
            <text-widget :textWidgetData="item" :isEdit="true"></text-widget>
          </template>
          <!--图片控件-->
          <template v-if="item.type && item.type === 'imgWidget'">
            <image-widget :imageWidgetData="item"></image-widget>
          </template>
          <!--内嵌页面-->
          <template v-if="item.type && item.type === 'innerPageWidget'">
            <div class="scrollBar">
              <iframe
                :src="item.src"
                width="100%"
                height="100%"
                style="border-width: 0px; pointer-events: none; height: calc(100% - 3px)"
              ></iframe>
            </div>
          </template>
          <!--Charts-->
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
                item.data.superConds instanceof Array && item.data.superConds.length > 0
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
            ></div>
            <el-breadcrumb
              v-if="item.drillNavigation && item.drillNavigation.length > 0"
              style="position: absolute; bottom: 0"
              separator=""
            >
              <el-breadcrumb-item v-for="(dc, key) in item.drillNavigation" :key="key">
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
    </power-drag>
    <el-dialog
      :visible.sync="conditionVisible"
      v-if="conditionVisible"
      :modal="false"
      width="85%"
      :close-on-click-modal="false"
    >
      <condition-config
        :widgets="myList"
        @closeCondition="conditionVisible = false"
        :queryId="queryId"
      ></condition-config>
    </el-dialog>
    <el-dialog
      title="sql语句"
      :visible.sync="sqlVisible"
      :modal="false"
      width="60%"
      :close-on-click-modal="false"
    >
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
          >格式化sql
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
let chartInstanceBox = {};
import drag from "@/components/report/drag/Drag.vue";
import QueryWidget from "@/components/report/queryWidget/QueryWidget.vue";
import TextWidget from "@/components/report/textWidget/TextWidget.vue";
import TableWidget from "@/components/report/tableWidget/TableWidget.vue";
import ImgWidget from "@/components/report/imgWidget/ImgWidget.vue";
import CustomTab from "@/components/report/drag/CustomTab.vue";
import ConditionConfig from "@/components/report/conditions/ConditionConfig";
import sqlFormatter from "sql-formatter";
import SqlEditor from "@/components/SqlEditor";
import KanbanWidget from "@/components/report/kanbanWidget/KanbanWidget";

export default {
  name: "DragPower",
  created() {},
  props: {
    widgetType: { required: true, type: String }, // 控件类型
    addWidgetEventListen: { required: true, type: Number }, // 监听父组件,添加控件触发
    reviewWidgetEventListen: { required: false, type: Number }, // 监听父组件,更新触发
    myList: { required: true, type: Array },
    reviewType: { required: true, type: String },
    baseSet: { required: false, type: Object },
    themeMeta: { required: false, type: Object },
  },
  watch: {
    addWidgetEventListen: {
      deep: true,
      handler() {
        let _this = this;
        if (_this.currentSelectItem && _this.currentSelectItem.type === "tabPageWidget") {
          if (_this.widgetType === "tabPageWidget") {
            _this.$message.warning("Tab组件不能嵌套Tab组件！");
            return false;
          }
          if (_this.currentSelectItem.tabs instanceof Array) {
            _this.currentSelectItem.tabs.forEach((tb) => {
              if (tb.tabId === _this.currentSelectItem.activeTabId) {
                let flag = 0;
                if (tb.tabContent.widgets instanceof Array) {
                  tb.tabContent.widgets.forEach((obj) => {
                    if (obj.name) {
                      flag++;
                    }
                  });
                }
                if (flag >= 10) {
                  _this.$message.warning("Tab页内添加的组件不允许超过10个");
                  return false;
                } else {
                  tb.widgetCount++;
                }
              }
            });
          }
          return false;
        }
        let gridY = 1;
        let gridX = 1;
        let flag = false;
        let gridster = this.$refs["cyGridster"]; //获取gridster实例
        let maxCell = gridster.getMaxCell();
        let sizeX = Math.floor(maxCell / 2);
        let sizeY = Math.floor(maxCell * (1 / 30));
        let cal = _this.WidgetHelper.calItemPosition(_this.myList, _this, maxCell, sizeX);
        if (!_this.KHUtils.isNull(cal)) {
          gridX = cal.gridX;
          gridY = cal.gridY;
        }
        _this.WidgetHelper.addWidget(_this, gridster, gridX, gridY, sizeX, sizeY, true);
      },
    },
    "currentSelectItem.id": {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.$emit("notifyItemChange", this.currentSelectItem);
        }
      },
      immediate: true, // immediate这个属性需要加上，代表该回调将会在侦听开始之后被立即调用
    },
    reviewWidgetEventListen: {
      deep: true,
      handler() {
        this.handleItemReview();
      },
    },
    "baseSet.backgroundColor": {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          // let dom = document.getElementsByClassName("dragAndResize");
          let dom = [this.$refs["cyGridster"].$el];
          if (dom && dom[0] && dom[0].style) {
            if (this.baseSet.backgroundColor) {
              dom[0].style.backgroundColor = this.baseSet.backgroundColor;
            } else {
              dom[0].style.backgroundColor = "transparent";
            }
          }
        }
      },
      immediate: true, // immediate这个属性需要加上，代表该回调将会在侦听开始之后被立即调用
    },
    "baseSet.verticalSpacing": {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.WidgetHelper.initGridBaseDesign(this);
        }
      },
      immediate: true, // immediate这个属性需要加上，代表该回调将会在侦听开始之后被立即调用
    },
  },
  data() {
    return {
      notifyTabQueryCustom: 0,
      tabQueryParam: [],
      notifyCancelSelected: 0,
      notifyTabQuery: 0,
      drillNavigation: [],
      sqlVisible: false,
      addOrEdit: true, // 默认新增状态
      resizable: true,
      draggable: true,
      currentSelectItem: {}, // 当前选中的控件
      baseWidth: 0,
      baseHeight: 0,
      baseMarginLeft: 0,
      baseMarginTop: 0,
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
    };
  },
  components: {
    "query-widget": QueryWidget,
    "power-drag": drag,
    "custom-tab": CustomTab,
    "condition-config": ConditionConfig,
    "text-widget": TextWidget,
    "image-widget": ImgWidget,
    "table-widget": TableWidget,
    SqlEditor: SqlEditor,
    "kanban-widget": KanbanWidget,
  },
  async mounted() {
    await this.WidgetHelper.initGridBaseDesign(this);
    // 编辑,默认选中
    if (this.myList.length > 0) {
      this.addOrEdit = false; // 编辑状态默认选中第一个
    }
    let _this = this;
    let gridster = _this.$refs["cyGridster"]; //获取gridster实例
    gridster.init();
    if (_this.myList instanceof Array && _this.myList.length > 0) {
      _this.KHReport.initReportQueryCondtions(_this, _this.myList); // 初始化查询条件默认值
      _this.myList.forEach((obj, index) => {
        _this.KHReport.commonQuery(obj, _this, chartInstanceBox, _this.myList, false);
      });
    }
    // 背景色
    // let dom = document.getElementsByClassName("dragAndResize");
    let dom = this.$refs["cyGridster"];
    if (dom && dom[0] && dom[0].style) {
      if (this.baseSet.backgroundColor) {
        dom[0].style.backgroundColor = this.baseSet.backgroundColor;
      } else {
        dom[0].style.backgroundColor = "transparent";
      }
    }
    setTimeout(() => {
      this.dragResize();
    }, 100);
  },
  methods: {
    onItemMouseUp() {
      if (this.$refs.customTab) {
        if (Array.isArray(this.$refs.customTab)) {
          this.$refs.customTab.forEach((value) => {
            value.dragResize();
          });
        }
      }
    },
    customTabResize() {
      console.log("customTabResize");
    },
    //监听window窗口变化
    async dragResize() {
      await this.WidgetHelper.initGridBaseDesign(this);
      this.$nextTick(() => {
        let gridster = this.$refs["cyGridster"]; //获取gridster实例
        gridster.init();
      });
      console.log("DragPower.vue");
    },
    queryBySuperConds(dbBtn, item) {
      let _this = this;
      let column = _this.KHChart.splicingColumnSetNoIdWithTableName(dbBtn, _this);
      item.data.superConds.forEach((obj) => {
        let compareColumn = _this.KHChart.splicingColumnSetNoIdWithTableName(obj, _this);
        obj.default = column === compareColumn;
      });
      _this.KHReport.commonQuery(item, _this, chartInstanceBox, _this.myList, false);
    },
    refreshWidgets() {
      let _this = this;
      if (_this.myList instanceof Array && _this.myList.length > 0) {
        _this.KHReport.initReportQueryCondtions(_this, _this.myList); // 初始化查询条件默认值
        _this.myList.forEach((obj, index) => {
          _this.KHReport.commonQuery(obj, _this, chartInstanceBox, _this.myList, false);
        });
      }
    },
    // 自定义条件查询
    queryByCustomCondition(queryParams) {
      let _this = this;
      _this.KHReport.queryByCustomCondition(
        _this,
        queryParams,
        _this.myList,
        chartInstanceBox,
        false
      );
      _this.notifyTabQueryCustom++;
      _this.tabQueryParam = queryParams;
    },
    // Chart导航操作
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
    // 页面设置
    settingMainDesgin() {
      let _this = this;
      _this.currentSelectItem = null;
      _this.addOrEdit = false;
      _this.notifyCancelSelected++; // 通知Tab页签内部控件取消选中
    },
    // 接收Tab页内组件切换后属性设置变更
    notifyCurrentItemChange(item) {
      let _this = this;
      _this.$emit("notifyItemChange", item);
    },
    // 属性设置完成渲染
    handleItemReview() {
      let _this = this;
      if (_this.currentSelectItem && _this.currentSelectItem.type === "tabPageWidget") {
        _this.notifyTabQuery++;
      } else {
        if (_this.currentSelectItem) {
          _this.myList.forEach((obj) => {
            if (obj.id === _this.currentSelectItem.id && obj.drillNavigation) {
              obj.drillNavigation = [];
            }
          });
        } else {
          _this.myList.forEach((obj) => {
            if (obj.drillNavigation) {
              obj.drillNavigation = [];
            }
          });
        }
        _this.KHReport.commonQuery(
          _this.currentSelectItem,
          _this,
          chartInstanceBox,
          _this.myList,
          false
        );
      }
    },
    // 动态监听Tab组件切换点击
    handleTabClick(currentActiveName, tabId) {
      let _this = this;
      _this.myList.forEach((obj) => {
        if (obj.id === tabId && obj.type === "tabPageWidget") {
          obj.activeTabId = currentActiveName;
        }
      });
    },
    // 自定义查询条件
    editQueryWidget(item) {
      let _this = this;
      _this.conditionVisible = true;
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
      _this.refreshSqlEditor = false; //先关闭，
      this.$nextTick(function () {
        _this.refreshSqlEditor = true; //再打开
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
    /**#############################以下为Drag组件定义的方法##################################**/
    // 点击选中控件item触发d
    handleItemClick(item) {
      let _this = this;
      if (_this.currentSelectItem && _this.currentSelectItem.id === item.id) {
        return false;
      }
      _this.draggable = true;
      _this.resizable = true;
      _this.addOrEdit = true;
      _this.currentSelectItem = item;
    },
    // 删除控件
    deleteItem(index) {
      let _this = this;
      let gridster = this.$refs["cyGridster"]; //获取gridster实例
      gridster.removeItem(index);
      if (chartInstanceBox["chart" + index]) {
        chartInstanceBox["chart" + index].destroy(); //此时会在this.myList的index位置将item置为{}，目的是为了不让vue重新渲染整个v-for。
        //注意，这里删除布局框并不会删除里面的组件，组件需要自己用v-if来控制销毁，如果是highchart，必须手动调用chartInstance.$destroy()
      }
      _this.currentSelectItem = null; // 默认选中上一个
      _this.$emit("notifyItemChange", _this.currentSelectItem);
    },
    // Tab页内控件拖拽开始
    startDragEvent() {
      let _this = this;
      _this.draggable = true;
      _this.resizable = true;
    },
    stopDragEvent() {
      let _this = this;
      _this.draggable = false;
      _this.resizable = false;
    },
    dragStart(e, item, index) {
      let _this = this;
      _this.currentSelectItem = item;
      item.showMoreOptVisible = false;
    },
    dragging(e, item, index) {
      let _this = this;
      _this.currentSelectItem = item;
      item.showMoreOptVisible = false;
    },
    dragEnd(e, item, index) {
      item.showMoreOptVisible = false;
    },
    resizeStart(e, item, index) {
      let _this = this;
      _this.currentSelectItem = item;
      item.showMoreOptVisible = false;
    },
    resizing(e, item, index) {
      let _this = this;
      _this.currentSelectItem = item;
      item.showMoreOptVisible = false;
    },
    resizeEnd(e, item, index) {
      item.showMoreOptVisible = false;
      if (chartInstanceBox["chart" + index]) {
        chartInstanceBox["chart" + index].reflow();
        this.PieChart.resizeTitle(item, chartInstanceBox, index);
      }
    },
    handleClose(done) {},
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
  box-sizing: border-box;
  overflow: auto;
}
</style>
