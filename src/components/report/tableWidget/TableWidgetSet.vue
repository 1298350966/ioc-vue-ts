<template>
  <section>
    <el-form label-position="top" v-if="activeName === 'first'">
      <!--钻取-->
      <div class="config-data-item"
           v-if="item.reportType === 'tableReportWidget'&& tableDrillingVisible">
        <el-tooltip class="item" effect="dark" content=""
                    placement="left">
          <div class="area-name clearfix">
            <span>  钻取</span>
          </div>
        </el-tooltip>
        <el-tree
          class="dataSetTree"
          :data="tableDrillingTreeData"
          :expand-on-click-node="false"
          style="color: white"
        >
           <span class="custom-tree-node" slot-scope="{ node, data }">
                <span class="whiteFont" style="width: 80px">{{ node.label }}</span>
                <span>
                    <i class="el-icon-plus" v-if="node.level === 1"
                       @click="showTableDimSelect('tableDrillingAxis','钻取',data)"
                       style="float: right"></i>
                        <el-dropdown @command="handleCommand">
                          <span class="el-dropdown-link" style="color: white">
                            <i class="el-icon-arrow-down el-icon--right"></i>
                          </span>
                            <el-dropdown-menu slot="dropdown">
                                <el-dropdown-item icon="el-icon-view"
                                                  :command="beforeHandleCommand(node,data,'rename')">
                                    重命名
                                </el-dropdown-item>
                                <el-dropdown-item icon="el-icon-delete-solid"
                                                  :command="beforeHandleCommand(node,data,'delete')"
                                >删除
                                </el-dropdown-item>
                            </el-dropdown-menu>
                        </el-dropdown>
                </span>
           </span>
        </el-tree>
      </div>
      <!--行-->
      <div class="config-data-item"
           v-if="item.reportType === 'tableReportWidget'">
        <el-tooltip class="item" effect="dark" content="单击数据字段至此处"
                    placement="left">
          <div class="area-name clearfix">
            <span style="cursor: pointer" @click="showDimOrMeasureSelect('rowAxis','行')"> 行</span>
            <i class="el-icon-plus"
               @click="showDimOrMeasureSelect('rowAxis','行')"
               style="float: right"></i>
          </div>
        </el-tooltip>
        <div v-if="item.data.rowAxis.length === 0">
          <ul class="column-list"></ul>
          <div class="no-column-tip">
            <span>单击维度数据字段至此处</span>
          </div>
        </div>
        <el-form-item
          v-for="(vaItem, index) in item.data.rowAxis"
          :key="'rowAxis:'+index"
        >
          <report-set-item :moreMenu="true" :reportType="item.reportType"
                           :drillDown="true" :item="vaItem" :itemType="dim"
                           @removeAxis="removeRowAxis"
                           @addDrillDownAxis="addTableDrillingAxis"></report-set-item>
        </el-form-item>
      </div>
      <!--列-->
      <div class="config-data-item"
           v-if="item.reportType === 'tableReportWidget'">
        <el-tooltip class="item" effect="dark" content="单击数据字段至此处"
                    placement="left">
          <div class="area-name clearfix">
            <span style="cursor: pointer"
                  @click="showDimOrMeasureSelect('colAxis','列')"> 列</span>
            <i class="el-icon-plus"
               @click="showDimOrMeasureSelect('colAxis','列')"
               style="float: right"></i>
          </div>
        </el-tooltip>
        <div
          v-if="item.data.colAxis.classAxis.length === 0 && item.data.colAxis.valueAxis.length === 0">
          <ul class="column-list"></ul>
          <div class="no-column-tip">
            <span>单击字段至此处</span>
          </div>
        </div>
        <el-form-item
          v-for="(vaItem, index) in item.data.colAxis.classAxis"
          :key="'classAxis:'+index"
        >
          <report-set-item :moreMenu="true" :reportType="item.reportType"
                           :drillDown="false" :item="vaItem" :itemType="dim"
                           @removeAxis="removeColClassAxis"></report-set-item>
        </el-form-item>
        <el-form-item
          v-for="(vaItem, index) in item.data.colAxis.valueAxis"
          :key="'valueAxis:'+index"
        >
          <report-set-item :moreMenu="true" :reportType="item.reportType"
                           :drillDown="false" :item="vaItem"
                           :itemType="measure" :ref="'aggregateTable'+index"
                           :tableGroup="item.data.tableGroup"
                           @removeAxis="removeColValueAxis"></report-set-item>
        </el-form-item>
      </div>
      <!--过滤器-->
      <div class="config-data-item">
        <el-tooltip class="item" effect="dark" content="勾选数据字段至此处"
                    placement="left">
          <div class="area-name clearfix">
            <span style="cursor: pointer"
                  @click="showDimMeasureSelect"> 过滤器</span>
            <i class="el-icon-plus" @click="showDimMeasureSelect"
               style="float: right"></i>
          </div>
        </el-tooltip>
        <div v-if="item.data.condFilters.length === 0">
          <ul class="column-list"></ul>
          <div class="no-column-tip">
            <span>勾选数据字段至此处</span>
          </div>
        </div>
        <el-form-item
          v-for="(vaItem, index) in item.data.condFilters"
          :key="'condFilters:'+index"
        >
          <report-set-item :moreMenu="vaItem.itemType?vaItem.itemType == 'measure':false"
                           :reportType="item.reportType" :drillDown="false"
                           :filter="true" :item="vaItem"
                           :itemType="vaItem.itemType?vaItem.itemType:'measure'"
                           @addFilters="showCondFiltersSet" :isFilter="true"
                           @removeAxis="removeCondFilters"></report-set-item>
        </el-form-item>
      </div>
      <!--<div class="tableRadioGroup" v-if="item.reportType === 'tableReportWidget'">
        <el-radio-group v-model="item.data.tableGroup" size="medium"
                        @change="tableGroupChange">
          <el-radio-button label="aggregate">聚合</el-radio-button>
          <el-radio-button label="detail">明细</el-radio-button>
        </el-radio-group>
      </div>-->
      <!--叠加条件-->
      <!--<div class="config-data-item">
          <el-tooltip class="item" effect="dark" content="添加叠加条件至此处"
                      placement="left">
              <div class="area-name clearfix"><span style="cursor: pointer"
                                                    @click="showDateButtonsSelect"> 叠加条件</span>
                  <i class="el-icon-plus" @click="showDateButtonsSelect"
                     style="float: right"></i>
              </div>
          </el-tooltip>
          <div v-if="item.data.superConds.length === 0">
              <ul class="column-list"></ul>
              <div class="no-column-tip">
                  <span>添加叠加条件字段至此处</span>
              </div>
          </div>
          <el-form-item
              v-for="(vaItem, index) in item.data.superConds"
              :key="index"
          >
              <report-set-item :item="vaItem" itemType="dateButtons" @removeAxis="removeDateButtons"
                               @setDefaultDateButton="setDefaultDateButton"></report-set-item>
          </el-form-item>
      </div>-->
    </el-form>
    <el-collapse v-model="queryActiveNames" v-if="activeName === 'second'">
      <el-collapse-item title="基础信息" name="1">
        <el-form label-position="top" class="secondary-font-color report-set-margin-let">
          <div class="secondary-font-color" style="margin-top: 10px">控件</div>
          <div style="margin-bottom: 10px">
            <span class="secondary-font-color">背景颜色</span>
            <el-color-picker v-model="item.backgroundColor" show-alpha></el-color-picker>
            <span class="secondary-font-color">边框颜色</span>
            <el-color-picker v-model="item.borderColor" show-alpha></el-color-picker>
          </div>
            <div class="secondary-font-color" style="margin-top: 10px">填充边距</div>
            <div style="margin-bottom: 10px">
                <el-tooltip class="item" effect="dark" content="上内边距">
                    <el-input-number v-model="item.paddingTop" style="width: 20%"></el-input-number>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="右内边">
                    <el-input-number v-model="item.paddingRight" style="width: 20%"></el-input-number>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="下内边距">
                    <el-input-number v-model="item.paddingBottom" style="width: 20%"></el-input-number>
                </el-tooltip>
                <el-tooltip class="item" effect="dark" content="左内边距">
                    <el-input-number v-model="item.paddingLeft" style="width: 20%"></el-input-number>
                </el-tooltip>
            </div>
          <el-checkbox v-model="item.style.mainTitleVisiable"
                       class="secondary-font-color">
            显示主标题/备注
          </el-checkbox>
          <!--   <div>
               <span class="secondary-font-color">背景颜色</span>
               <el-color-picker v-model="item.style.backgroundColor"></el-color-picker>
             </div>-->
          <div class="secondary-font-color" style="margin-top: 10px">主标题</div>
          <div style="margin-bottom: 10px">
            <el-input style="width: 90%" v-model="item.style.mainTitle"></el-input>
            <el-color-picker v-model="item.style.mainTitleColor" show-alpha></el-color-picker>
          </div>
          <el-checkbox v-model="item.style.showSerialNum" class="secondary-font-color">
            显示序号
          </el-checkbox>
          <el-form-item label="">
            <el-checkbox v-model="item.style.pagination" class="secondary-font-color">
              显示分页
            </el-checkbox>
            <el-select v-model="item.style.pageSize" placeholder="请选择"
                       style="width: 100px"
                       class="report-set-style imageMarginTop"
                       :popper-append-to-body="false" value="">
              <el-option
                v-for="item in Constants.tablePaginationOptions"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <span class="secondary-font-color">条/页</span>
          </el-form-item>
          <el-checkbox v-model="item.sensior.isExport" class="secondary-font-color">
            导出报表
          </el-checkbox>
        </el-form>
      </el-collapse-item>
      <el-collapse-item title="样式设置" name="2">
        <el-form label-position="top" class="secondary-font-color report-set-margin-let">
          <el-form-item label="表格边框" v-if="item.style.tableBorderStyle">
            <el-select v-model="item.style.tableBorderStyle.boderSize"
                       :popper-append-to-body="false" style="width: 35%">
              <el-option v-for="item in Constants.borderWidthOptions"
                         :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
            <el-color-picker v-model="item.style.tableBorderStyle.boderColor" show-alpha></el-color-picker>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="表头样式" >
            <div style="margin-left: 10px">
              字体大小/颜色 <el-select v-model="item.style.tableHeaderStyle.cellFontSize"
                                 :popper-append-to-body="false" style="width: 35%">
              <el-option v-for="item in Constants.viceValueSizeOptions"
                         :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
              <el-color-picker v-model="item.style.tableHeaderStyle.cellColor" show-alpha></el-color-picker>
              <el-form-item label="标题位置" >
                <el-radio-group v-model="item.style.tableHeaderStyle.cellPosition"
                                class="table-set-radio-button report-set-radio-button">
                  <el-radio label="left" border>
                    <el-tooltip class="item" effect="dark" content="左" placement="top">
                      <i class="icon iconfont icon-icon--1"></i>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="center" border>
                    <el-tooltip class="item" effect="dark" content="中" placement="top">
                      <i class="icon iconfont icon-shanchu-fangkuang"></i>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="right" border>
                    <el-tooltip class="item" effect="dark" content="右" placement="top">
                      <i class="icon iconfont icon-icon--"></i>
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row :span="24">
                <el-col :span="12">
                  表头网格颜色 <el-color-picker  v-model="item.style.tableHeaderStyle.cellBorderColor" show-alpha></el-color-picker>
                </el-col>
                <el-col :span="12">
                  背景色 <el-color-picker v-model="item.style.tableHeaderStyle.backgroundColor" show-alpha></el-color-picker>
                </el-col>
              </el-row>

               <div style="margin-top: 10px">
                 表头单元格高度
                 <el-input class="query-widget-style" style="width: 150px"
                           placeholder="数值"
                           type="number"
                           v-model="item.style.tableHeaderStyle.cellHeight"
                 >
                 </el-input>
                 px
               </div>
            </div>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="表内容样式" >
            <div style="margin-left: 10px">
              字体大小/颜色 <el-select v-model="item.style.tableBodyStyle.cellFontSize"
                                 :popper-append-to-body="false" style="width: 35%">
              <el-option v-for="item in Constants.viceValueSizeOptions"
                         :key="item.value" :label="item.label"
                         :value="item.value"></el-option>
            </el-select>
              <el-color-picker v-model="item.style.tableBodyStyle.cellColor" show-alpha></el-color-picker>
              <el-form-item label="表内容位置" >
                <el-radio-group v-model="item.style.tableBodyStyle.cellPosition"
                                class="table-set-radio-button report-set-radio-button">
                  <el-radio label="left" border>
                    <el-tooltip class="item" effect="dark" content="左" placement="top">
                      <i class="icon iconfont icon-icon--1"></i>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="center" border>
                    <el-tooltip class="item" effect="dark" content="中" placement="top">
                      <i class="icon iconfont icon-shanchu-fangkuang"></i>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="right" border>
                    <el-tooltip class="item" effect="dark" content="右" placement="top">
                      <i class="icon iconfont icon-icon--"></i>
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row :span="24">
                <el-col :span="8">
                  表内容网格颜色 <el-color-picker  v-model="item.style.tableBodyStyle.cellBorderColor" show-alpha ></el-color-picker>
                </el-col>
                <el-col :span="8" style="text-align: center">
                  背景色 <el-color-picker v-model="item.style.tableBodyStyle.backgroundColor" show-alpha></el-color-picker>
                </el-col>
                <el-col :span="8">
                  鼠标悬浮背景色 <el-color-picker v-model="item.style.tableBodyStyle.backgroundColorHover" show-alpha></el-color-picker>
                </el-col>
              </el-row>
              <div style="margin-top: 10px">
                表内容单元格高度
                <el-input class="query-widget-style" style="width: 150px"
                          placeholder="数值"
                          type="number"
                          v-model="item.style.tableBodyStyle.cellHeight"
                >
                </el-input>
                px
              </div>
            </div>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="钻取导航栏样式" v-if="item.style.drillingNavigationStyle">
            <div style="margin-left: 10px">
                <el-row :span="24">
                   <el-col :span="12">
                     <div class="secondary-font-color">字体设置（大小/颜色）</div>
                     <el-select v-model="item.style.drillingNavigationStyle.fontSize"
                                :popper-append-to-body="false" style="width: 50%">
                       <el-option v-for="item in Constants.viceValueSizeOptions"
                                  :key="item.value" :label="item.label"
                                  :value="item.value"></el-option>
                     </el-select>
                     <el-color-picker v-model="item.style.drillingNavigationStyle.fontColor" show-alpha></el-color-picker>
                   </el-col>
                   <el-col :span="12">
                     <div class="secondary-font-color">图标颜色</div>
                     <el-color-picker v-model="item.style.drillingNavigationStyle.iconColor" show-alpha></el-color-picker>
                   </el-col>
                </el-row>
            </div>
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="分页样式" v-if="item.style.tablePaginationStyle">
            <div style="margin-left: 10px">
              字体颜色
              <el-color-picker v-model="item.style.tablePaginationStyle.fontColor" show-alpha></el-color-picker>
              <el-row :span="24">
                <el-col :span="12">
                  <el-form-item label="非选中按钮样式">
                    <el-color-picker v-model="item.style.tablePaginationStyle.buttonStyle.backgroundColor" show-alpha></el-color-picker>
                    <el-color-picker v-model="item.style.tablePaginationStyle.buttonStyle.fontColor" show-alpha></el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="选中按钮样式">
                    <el-color-picker v-model="item.style.tablePaginationStyle.buttonActiveStyle.backgroundColor" show-alpha></el-color-picker>
                    <el-color-picker v-model="item.style.tablePaginationStyle.buttonActiveStyle.fontColor" show-alpha></el-color-picker>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row :span="24">
                <el-col :span="12">
                  <el-form-item label="输入框样式">
                    <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.backgroundColor" show-alpha></el-color-picker>
                    <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.fontColor" show-alpha></el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="输入框边框样式">
                    <el-select v-model="item.style.tablePaginationStyle.inputStyle.borderWidth"
                               :popper-append-to-body="false" style="width: 50%">
                      <el-option v-for="item in Constants.borderWidthOptions"
                                 :key="item.value" :label="item.label"
                                 :value="item.value"></el-option>
                    </el-select>
                    <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.borderColor" show-alpha></el-color-picker>
                  </el-form-item>
                </el-col>


              </el-row>
            </div>
          </el-form-item>
        </el-form>
      </el-collapse-item>
    </el-collapse>

    <!--table 交叉表 钻取修改别名-->
    <el-dialog
      title="重命名"
      :visible.sync="renameVisible"
      :modal="false"
      width="35%"
    >
      <el-col style="padding: 20px 50px;" class="rename-input">
        <el-row :span="24">
          <el-col :span="4">
            <div>字段别名:</div>
          </el-col>
          <el-col :span="20">
            <el-input v-model="tableDrillAxis.alias"></el-input>
          </el-col>
        </el-row>
        <el-row :span="24" style="margin-top: 20px">
          <el-col :span="4">
            <div>字段描述:</div>
          </el-col>
          <el-col :span="20">
            <el-input type="textarea" v-model="tableDrillAxis.desc"></el-input>
          </el-col>
        </el-row>
      </el-col>
      <span slot="footer" class="dialog-footer">
    <el-button @click="renameVisible = false">取 消</el-button>
    <el-button type="primary" @click="drillRename()">确 定</el-button>
  </span>
    </el-dialog>
  </section>
</template>

<script>
  import ReportSetItem from "@/components/report/ReportSetItem";


  export default {
    name: "TableWidgetSet",
    components: {
      ReportSetItem},
    created() {
      this.KHReportSet.initDataField(this);
    },
    props: {
      item: {required: true, type: Object},
      activeName: {required: true, type: String},
      dimTreeData: {required: false, type: Array}
    },
    data() {
      return {
        queryActiveNames: ['1'],
        tableDrillingVisible: true,
        tableDrillingTreeData: [],
        tableDrillingData: {},
        renameVisible: false,
        tableDrillAxis: {},
        refreshTableDrill: true,
        measure: "measure",
        dim: "dim",
      }
    },
    watch: {
      /*            tableGroupChangeNum: {
       deep: true,
       handler() {
       this.tableGroupChange(0, this);
       }
       }*/
    },
    methods: {
      showTableDimSelect(type, title, data) {
        let _this = this;
        _this.tableDrillingData = data.data;
        this.$emit("showDimOrMeasureSelect", type, title);
      },
      // 打开过滤条件设置
      showCondFiltersSet(cond) {
        this.$emit("showCondFiltersSet", cond);
      },
      // 通知父组件打开选择维度和度量的界面
      showDimMeasureSelect() {
        this.$emit("showDimMeasureSelect", "过滤器");
      },
      // 通知父组件打开选择维度或度量的界面
      showDimOrMeasureSelect(type, title) {
        this.$emit("showDimOrMeasureSelect", type, title);
      },
      //通知父组件打开选择当前时间按钮的界面
      showDateButtonsSelect() {
        this.$emit('showDateButtonsSelect', '时间按钮');
      },
      // 过滤条件的动态新增
      addCondFilters(currentNode, checkedKeys) {
        let _this = this;
        _this.KHReportSet.addCondFilters(currentNode, checkedKeys, _this);
      },
      // 过滤条件的动态删除
      removeCondFilters(item) {
        let _this = this;
        _this.KHReportSet.removeCondFilters(item, _this);
      },
      //交叉表 ：添加行或列判断是否已经存在相同对象
      isExistRowColAxis(rowColObj) {
        let _this = this;
        let isExist = false;
        if (_this.item.data.rowAxis instanceof Array && _this.item.data.rowAxis.length > 0) {
          _this.item.data.rowAxis.forEach((obj, index) => {
            if (rowColObj.column === obj.column && rowColObj.table === obj.table && rowColObj.dateDim === obj.dateDim && rowColObj.express === obj.express) {
              isExist = true;
            }
          })
        }
        if (_this.item.data.colAxis && _this.item.data.colAxis.classAxis instanceof Array && _this.item.data.colAxis.classAxis.length > 0) {
          _this.item.data.colAxis.classAxis.forEach((obj, index) => {
            if (rowColObj.column === obj.column && rowColObj.table === obj.table && rowColObj.dateDim === obj.dateDim && rowColObj.express === obj.express) {
              isExist = true;
            }
          })
        }

        if (_this.item.data.colAxis && _this.item.data.colAxis.valueAxis instanceof Array && _this.item.data.colAxis.valueAxis.length > 0) {
          _this.item.data.colAxis.valueAxis.forEach((obj, index) => {
            if (rowColObj.column === obj.column && rowColObj.table === obj.table && rowColObj.dateDim === obj.dateDim && rowColObj.express === obj.express) {
              isExist = true;
            }
          })
        }

        return isExist;
      },
      // 交叉表 行动态删除
      removeRowAxis(item) {
        let _this = this;
        var index = _this.item.data.rowAxis.indexOf(item);
        if (index !== -1) {
          _this.item.data.rowAxis.splice(index, 1)
        }
        _this.deleteTableDrilling(item);
      },
      //交叉表  删除列中的维度
      removeColClassAxis(item) {
        let _this = this;
        var index = _this.item.data.colAxis.classAxis.indexOf(item);
        if (index !== -1) {
          _this.item.data.colAxis.classAxis.splice(index, 1)
        }
      },
      //交叉表  删除列中的度量
      removeColValueAxis(item) {
        let _this = this;
        var index = _this.item.data.colAxis.valueAxis.indexOf(item);
        if (index !== -1) {
          _this.item.data.colAxis.valueAxis.splice(index, 1)
        }
      },
      // 当前时间按钮动态删除
      removeDateButtons(item) {
        let _this = this;
        _this.KHReportSet.removeDateButtons(item, _this);
      },
      tableGroupChange(value) {
        let _this = this;
        if (_this.item.data.colAxis.valueAxis instanceof Array && _this.item.data.colAxis.valueAxis.length > 0) {
          _this.item.data.colAxis.valueAxis.forEach((obj, index) => {
            _this.$refs["aggregateTable" + index][0].aggregateSwitch(value);
          })
        }

        /*
         if (value == 'aggregate') {
         _this.Constants.optionsNum[2].children = [];
         _this.Constants.optionsNum[2].children = _this.Constants.optionsNum[2].children.concat(_this.Constants.aggregateType);
         if (_this.item.data.colAxis.valueAxis instanceof Array && _this.item.data.colAxis.valueAxis.length > 0) {
         _this.item.data.colAxis.valueAxis.forEach((obj, index) => {
         obj.aggregate = "sum";
         })
         }


         } else if (value == 'detail') {

         _this.Constants.optionsNum[2].children = [];
         _this.Constants.optionsNum[2].children = _this.Constants.optionsNum[2].children.concat(_this.Constants.detailType);

         if (_this.item.data.colAxis.valueAxis instanceof Array && _this.item.data.colAxis.valueAxis.length > 0) {
         _this.item.data.colAxis.valueAxis.forEach((obj, index) => {
         obj.aggregate = "none";
         })
         }


         }*/


      },
      deleteTableDrilling(data) {
        let _this = this;
        if (_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length > 0) {
          _this.item.data.drillingAxis.forEach((obj, index) => {
            let drillCol = obj.drillCol;
            let childCols = obj.childCols;
            if (drillCol[0] && data.column === drillCol[0].column && data.table === drillCol[0].table && data.dateDim === drillCol[0].dateDim) {
              _this.item.data.drillingAxis.splice(index, 1);
              return false;
            }
            if (childCols && childCols instanceof Array && childCols.length > 0) {
              childCols.forEach((child, k) => {
                if (data.column === child.column && data.table === child.table && data.dateDim === child.dateDim) {
                  obj.childCols.splice(k, 1);
                  return false;
                }
              })
            }
          });
          _this.convertTableDrilling();
        }
      },
      //添加交叉表钻取
      addTableDrillingAxis(drillColObj) {
        let _this = this;
        let drillCol = JSON.parse(JSON.stringify(drillColObj));
        if (_this.isExistDrilling(drillCol)) {
          _this.$message.warning("已存在相同钻取");
          return;
        }

        // if (_this.drillingAxisSelectVisible) {
        //     _this.$message.warning("已开启钻取图层");
        // }
        let drillObj = {drillCol: [], childCols: []};
        // 默认带出年份的钻取维度
        if (drillCol.dataType === 'Date') {
          let tempArray = [];
          find(_this.dimTreeData);

          function find(arr) {
            arr.forEach(obj => {
              if (obj.children) {
                find(obj.children)
              }
              if (drillCol.column === obj.column && drillCol.dateDim === obj.dateDim) {
                tempArray = arr;
              }
            })
          }

          let compareIndex = null;
          tempArray.forEach((ta, index) => {
            if (drillCol.column === ta.column && drillCol.dateDim === ta.dateDim) {
              compareIndex = index;
            }
            if (compareIndex !== null && index > compareIndex) {
              let newObj = {};
              newObj.column = ta.column;
              newObj.desc = ta.desc;
              newObj.dataType = ta.dataType;
              newObj.alias = ta.alias;
              newObj.express = ta.express;
              newObj.aggregate = ta.aggregate && !_this.KHUtils.isNull(ta.aggregate) ? ta.aggregate : "none";
              newObj.charttype = ta.charttype;
              newObj.table = ta.table;
              newObj.dateDim = ta.dateDim;
              if (ta.order && !_this.KHUtils.isNull(ta.order)) {
                newObj.order = ta.order;
              } else {
                newObj.order = "none";
              }
              drillObj.childCols.push(newObj);
            }
          });
        }
        drillObj.drillCol.push(drillCol);
        _this.item.data.drillingAxis.push(drillObj);
        _this.convertTableDrilling();
      },
      //判断交叉表是否存在相同的钻取
      isExistDrilling(drillingObj) {
        let _this = this;
        let exist = false;
        if (_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length > 0) {
          _this.item.data.drillingAxis.forEach((obj, index) => {
            let drillCol = obj.drillCol;
            let childCols = obj.childCols;
            if (drillCol[0] && drillingObj.column === drillCol[0].column && drillingObj.table === drillCol[0].table && drillingObj.dateDim === drillCol[0].dateDim && drillingObj.express === drillCol[0].express) {
              exist = true;
            }
            if (childCols && childCols instanceof Array && childCols.length > 0) {
              childCols.forEach((child, k) => {
                if (drillingObj.column === child.column && drillingObj.table === child.table && drillingObj.dateDim === child.dateDim  && drillingObj.express === child.express) {
                  exist = true;
                }
              })
            }
          });
        }
        return exist;
      },
      addTableDrillingChildAxis(data) {
        let _this = this;
        // 如果是父节点,则不允许选择
        if (data.children instanceof Array && data.children.length > 0) {
          return false;
        }
        if (_this.isExistDrilling(data)) {
          _this.$message.warning("已存在相同钻取");
          return;
        }
        let newObj = {};
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.alias = data.alias;
        newObj.express = data.express;
        newObj.table = data.table;
        if (data.dataType === "Date") {
          newObj.dateDim = data.dateDim;
        }
        if (_this.tableDrillingData) {
          if (_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length > 0) {
            _this.item.data.drillingAxis.forEach((obj, index) => {
              let drillCol = obj.drillCol;
              let childCols = obj.childCols;
              if (drillCol[0] && _this.tableDrillingData.column === drillCol[0].column && _this.tableDrillingData.table === drillCol[0].table && _this.tableDrillingData.dateDim === drillCol[0].dateDim) {
                childCols.push(newObj);
                _this.convertTableDrilling();
                return false;
              }
            });
          }
        }
      },
      beforeHandleCommand(node, data, command) {
        return {
          'node': node,
          'data': data,
          'command': command
        }
      },
      handleCommand(obj) {
        let _this = this;
        let node = obj.node;
        let data = obj.data.data;
        let command = obj.command;
        if (command === 'rename') {
          _this.renameVisible = true;
          _this.tableDrillAxis = {};
          _this.tableDrillAxis = data;
        } else if (command === 'delete') {
          _this.deleteTableDrilling(data)
        }
      },
      drillRename() {
        let _this = this;
        if (_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length > 0) {
          _this.item.data.drillingAxis.forEach((obj, index) => {
            let drillCol = obj.drillCol;
            let childCols = obj.childCols;
            if (drillCol[0] && _this.tableDrillAxis.column === drillCol[0].column && _this.tableDrillAxis.table === drillCol[0].table && _this.tableDrillAxis.dateDim === drillCol[0].dateDim) {
              drillCol[0].alias = _this.tableDrillAxis.alias;
            } else {
              if (childCols instanceof Array && childCols.length > 0) {
                childCols.forEach((child, index) => {
                  if (child && _this.tableDrillAxis.column === child.column && _this.tableDrillAxis.table === child.table && _this.tableDrillAxis.dateDim === child.dateDim) {
                    child.alias = _this.tableDrillAxis.alias;
                  }
                })
              }
            }
          });
        }
        _this.convertTableDrilling();
        _this.renameVisible = false;
      },
      //交叉表 动态添加行
      addRowAxis(data) {
        let _this = this;
        // 如果是父节点,则不允许选择
        if (data.children instanceof Array && data.children.length > 0) {
          return false;
        }
        /*  if (_this.isExistRowColAxis(data)) {
         _this.$message.warning("已存在相同对象");
         return;
         }*/
        let newObj = {};
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.alias = data.alias;
        newObj.express = data.express;
        newObj.table = data.table;
        if (data.dataType === "Date") {
          newObj.dateDim = data.dateDim;
        }
        _this.item.data.rowAxis.push(newObj);
      },
      addColAxis(data) {
        let _this = this;
        // 如果是父节点,则不允许选择
        if (data.children instanceof Array && data.children.length > 0) {
          return false;
        }
        /*  if (_this.isExistRowColAxis(data)) {
         _this.$message.warning("已存在相同对象");
         return;
         }*/
        let newObj = {};
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.alias = data.alias;
        newObj.express = data.express;
        newObj.table = data.table;
        if (data.dataType === "Date") {
          newObj.dateDim = data.dateDim;
        }

        if (data.dataType === "Number") {
          // 维度 Or 度量的区分
          /*
           if (data.aggregate && !_this.KHUtils.isNull(data.aggregate)) {
           newObj.aggregate = data.aggregate;  // 聚合函数
           } else {
           newObj.aggregate = "none";
           }
           */

          newObj.aggregate = null;  // 聚合函数

        }

        if (data.type == 'dim') {
          _this.item.data.colAxis.classAxis.push(newObj);
        } else if (data.type == 'measure') {
          newObj.aggregate = null;  // 聚合函数
          _this.item.data.colAxis.valueAxis.push(newObj);

        }
        //_this.tableGroupChange(_this.item.data.tableGroup);


      },
      //交叉表 钻取数据转换成树状结构
      convertTableDrilling() {
        let _this = this;
        _this.tableDrillingTreeData = [];
        if (_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length > 0) {
          _this.item.data.drillingAxis.forEach((obj, index) => {
            let drillCol = obj.drillCol;
            let childCols = obj.childCols;
            if (drillCol && drillCol instanceof Array && drillCol.length > 0) {
              let newObj = {label: "", children: []};
              newObj.label = drillCol[0].alias ? drillCol[0].column + "(" + drillCol[0].alias + ")" : drillCol[0].column;
              newObj.data = drillCol[0];
              if (childCols && childCols instanceof Array && childCols.length > 0) {
                childCols.forEach((child, k) => {
                  let childObj = {};
                  childObj.label = child.alias ? child.column + "(" + child.alias + ")" : child.column;
                  childObj.data = child;
                  newObj.children.push(childObj);
                })

              }
              _this.tableDrillingTreeData.push(newObj);

            }
          })
        }
        _this.tableDrillingVisible = _this.tableDrillingTreeData.length > 0;
      },
      // 当前时间按钮设为默认
      setDefaultDateButton(item) {
        let _this = this;
        _this.KHReportSet.setDefaultDateButton(item, _this);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @import "@/assets/style/report/report-set.scss";
</style>
