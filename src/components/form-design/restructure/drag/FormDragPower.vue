<template>
  <div class="FormTheme" formId="formId" id="chartVue" setting  @click="settingMainDesgin">
    <!-- 页面新增 编辑 详情 自定义 -->
    <div id="FormPage"></div>
    <power-drag
      id="FormDrag"
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
                  icon="el-icon-delete-solid"
                  :command="beforeHandleCommand(item, index, 'delete')"
                  >删除
                </el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </div>
          <!--表格-->
          <template
            v-if="
              item.type &&
              item.type === 'reportWidget' &&
              item.reportType === 'tableReportWidget'
            "
          >
            <table-widget
              :item="item"
              :ref="'tableWidget' + index"
              :formId="formId"
              v-if="refreshTable"
              @click.native="tableReload"
              :queryParams="queryParams"
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
              :formId="formId"
              :widget-type="widgetType"
              :notify-tab-query="notifyTabQuery"
              :notify-cancel-selected="notifyCancelSelected"
              :notify-tab-query-custom="notifyTabQueryCustom"
              :tab-query-param="tabQueryParam"
              :base-set="baseSet"
              :formConfig="formConfig"
              @queryByCustomCondition="queryByCustomCondition"
              @notifyCurrentItemChange="notifyCurrentItemChange"
              @handleTabClick="handleTabClick"
              @stopDragEvent="stopDragEvent"
              @startDragEvent="startDragEvent"
              ref="customTab"
            ></custom-tab>
          </template>
          <!--查询控件-->
          <template v-if="item.type && item.type === 'queryWidget'">
            <query-widget
              :formId="formId"
              :queryWidgetData="item"
              :formConfig="formConfig"
              @queryFormConditions="queryByCustomCondition"
              @click.native="reload"
              v-if="isRouterAlive"
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
            <form-inner-page-widget
              :pointerEvents="true"
              v-if="innerPageComponentHackSet"
              :currentFormId="formId"
              :widget="item"
              @queryByInnerPageParam="queryByInnerPageParam"
              style="width: 100%; height: 100%"
            ></form-inner-page-widget>
          </template>
        </div>
      </template>
    </power-drag>
    <el-dialog
      class="condition-config-dialog"
      :visible.sync="conditionVisible"
      v-if="conditionVisible"
      :modal="false"
      width="85%"
      :close-on-click-modal="false"
      custom-class="condition-config-dialog"
    >
      <condition-config
        :formConfig="formConfig"
        :widgets="myList"
        @closeCondition="conditionVisible = false"
        :queryId="queryId"
      ></condition-config>
    </el-dialog>
  </div>
</template>

<script>
let chartInstanceBox = {};
import drag from "@/components/form-design/restructure/drag/FormDrag.vue";
import QueryWidget from "@/components/form-design/restructure/queryWidget/FormQueryWidget.vue";
import TextWidget from "@/components/form-design/restructure/textWidget/FormTextWidget.vue";
import TableWidget from "@/components/form-design/restructure/tableWidget/FormTableWidget.vue";
import ImgWidget from "@/components/form-design/restructure/imgWidget/FormImgWidget.vue";
import CustomTab from "@/components/form-design/restructure/drag/FormCustomTab.vue";
import ConditionConfig from "@/components/form-design/restructure/conditions/FormConditionConfig";
import FormInnerPageWidget from "@/components/form-design/restructure/innerPageWidget/FormInnerPageWidget.vue";
import "@/assets/theme/form/index.scss"
export default {
  name: "DragPower",
  created() {},
  props: {
    widgetType: { required: true, type: String }, // 控件类型
    addWidgetEventListen: { required: true, type: Number }, // 监听父组件,添加控件触发
    reviewWidgetEventListen: { required: false, type: Number }, // 监听父组件,更新触发
    myList: { required: true, type: Array },
    baseSet: { required: false, type: Object },
    themeMeta: { required: false, type: Object },
    formId: { type: Number, required: true },
    formConfig: { type: Object },
  },
  watch: {
    addWidgetEventListen: {
      deep: true,
      handler() {
        let _this = this;
        if (_this.widgetType === "tableReportWidget") {
          if (_this.KHForm.judgeTableExit(_this.myList)) {
            _this.$message.warning("请勿重复添加表格");
            return false;
          }
        }
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
        let cal = _this.FormWidgetHelper.calItemPosition(
          _this.myList,
          _this,
          maxCell,
          sizeX
        );
        if (!_this.KHUtils.isNull(cal)) {
          gridX = cal.gridX;
          gridY = cal.gridY;
        }
        _this.FormWidgetHelper.addWidget(
          _this,
          gridster,
          gridX,
          gridY,
          sizeX,
          sizeY,
          true
        );
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
          if(!this.$refs["cyGridster"]) return
          let dom = [this.$refs["cyGridster"].$el];
          if (dom && dom[0] && dom[0].style) {
            if (this.baseSet.backgroundColor) {
              dom[0].style.backgroundColor = this.baseSet.backgroundColor;
            }
          }
        }
      },
      immediate: true, // immediate这个属性需要加上，代表该回调将会在侦听开始之后被立即调用
    },
    "baseSet.verticalSpacing": {
      handler: function (val, oldVal) {
        if (val !== oldVal) {
          this.dragResize()
        }
      },
      immediate: true, // immediate这个属性需要加上，代表该回调将会在侦听开始之后被立即调用
    },
  },
  data() {
    return {
      customComponent: "",
      innerPageComponentHackSet: true,
      innerPageParam: [],
      notifyTabQueryCustom: 0,
      tabQueryParam: [],
      notifyCancelSelected: 0,
      notifyTabQuery: 0,
      addOrEdit: true, // 默认新增状态
      resizable: true,
      draggable: true,
      currentSelectItem: {}, // 当前选中的控件
      baseWidth: 0,
      baseHeight: 0,
      baseMarginLeft: 0,
      baseMarginTop: 0,
      tdLoading: false,
      conditionVisible: false,
      queryId: "",
      queryParams: [],
      seriesData: [],
      refreshTextWidget: true,
      isRouterAlive: true,
      activeBool: true,
      refreshTable: true,
      tableFirstRefresh: true,
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
    "form-inner-page-widget": FormInnerPageWidget,
  },

  async mounted() {
    await this.FormWidgetHelper.initGridBaseDesign(this);
    // 编辑,默认选中
    if (this.myList.length > 0) {
      this.addOrEdit = false; // 编辑状态默认选中第一个
    }
    let _this = this;
    let gridster = _this.$refs["cyGridster"]; //获取gridster实例
    gridster.init();
    if (_this.myList instanceof Array && _this.myList.length > 0) {
      _this.KHReport.initReportQueryCondtions(_this, _this.myList); // 初始化查询条件默认值
      _this.myList.forEach((obj, index) => {});
    }
    // 背景色
    // let dom = document.getElementsByClassName("dragAndResize");
    let dom = [this.$refs["cyGridster"].$el];
    if (dom && dom[0] && dom[0].style) {
      if (this.baseSet.backgroundColor) {
        dom[0].style.backgroundColor = this.baseSet.backgroundColor;
      }
    }
    // setTimeout(() => {
    //   this.dragResize();
    // }, 100);
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
    //监听window窗口变化
    async dragResize() {
      let _this = this;
      await this.FormWidgetHelper.initGridBaseDesign(this);
      this.$nextTick(() => {
        let gridster = this.$refs["cyGridster"]; //获取gridster实例
        if (gridster) {
          gridster.init();
        }
      });
    },
    reload() {
      if (this.activeBool) {
        this.isRouterAlive = false;
        this.activeBool = false;
        this.$nextTick(() => (this.isRouterAlive = true));
      }
    },
    tableReload() {
      if (this.tableFirstRefresh) {
        this.refreshTable = false;
        this.tableFirstRefresh = false;
        this.$nextTick(() => (this.refreshTable = true));
      }
    },
    // 根据内嵌页面嵌入自定义组件,传参查询
    queryByInnerPageParam(innerPageParam) {
      this.innerPageParam = innerPageParam;
      this.queryByCustomCondition(innerPageParam);
    },
    // 自定义条件查询
    queryByCustomCondition(queryParams) {
      let _this = this;
      if (_this.innerPageParam instanceof Array && _this.innerPageParam.length > 0) {
        if (queryParams instanceof Array) {
          _this.innerPageParam.forEach((obj) => {
            queryParams.push(obj);
          });
        }
      }
      _this.queryParams = queryParams;
      _this.KHForm.queryByCustomCondition(queryParams, _this.myList, _this);
      _this.notifyTabQueryCustom++;
      _this.tabQueryParam = queryParams;
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
      if (_this.currentSelectItem && _this.currentSelectItem.type === "innerPageWidget") {
        let url = _this.currentSelectItem.src;
        let componentName = url.substring(url.lastIndexOf("/") + 1, url.length);
        _this.KHForm.registerComponent(componentName, url);
        _this.customComponent = componentName;
        _this.innerPageComponentHackSet = false;
        _this.$nextTick(() => {
          _this.innerPageComponentHackSet = true;
        });
        return false;
      }
      if (_this.currentSelectItem && _this.currentSelectItem.type === "tabPageWidget") {
        _this.notifyTabQuery++;
      } else if (
        _this.currentSelectItem &&
        _this.currentSelectItem.reportType === "tableReportWidget"
      ) {
        // _this.KHReport.commonQuery(_this.currentSelectItem, _this, chartInstanceBox, _this.myList, false);
        let currentSelectItemIndex = 0; // 当前选中控件的下标
        _this.myList.forEach((ml, index) => {
          if (ml.id === _this.currentSelectItem.id) {
            currentSelectItemIndex = index;
          }
        });
        console.log(currentSelectItemIndex);
        _this.$refs["tableWidget" + currentSelectItemIndex][0].renderTable();
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
@import "@/assets/style/form/drag-power.scss";
:deep(.condition-config-dialog){ 
  .el-dialog__header button.el-dialog__headerbtn i.el-dialog__close{
    color: #333;
  }
}

</style>
