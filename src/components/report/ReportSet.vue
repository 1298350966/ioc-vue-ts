<template>
    <el-container class="config-container">
        <div class="main-design">
            <template v-if="item">
                <div class="chart-design">图表设计</div>
            </template>
            <template v-else>
                <span class="chart-design">页面设置</span>
            </template>
          <el-row>
              <el-tooltip class="item" effect="dark" content="恢复默认主题" placement="top">
              <i class="el-icon-brush" @click="resetTheme" size="medium" style="color: #409EFF"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑主题" placement="top">
            <i class="el-icon-edit-outline" @click="themeDialogVisible = true" size="medium" style="color: #409EFF"></i>
              </el-tooltip>
            <el-select v-model="themeValue" placeholder="请选择主题" collapse-tags filterable
                       style="width: 200px"
                       class="report-set-style imageMarginTop"  :popper-append-to-body="false"
                       clearable  @click.native="loadThemeFirst" @change="themeSelect"
                       v-el-select-load-more="loadThemeMore">
              <el-option
                v-for="item in themeData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" style="height: 30px;margin-top: 7px" @click="addTheme" size="small">另存主题</el-button>
          </el-row>
        </div>

        <el-header :style="item ? 'text-align: center;height:45px':'text-align: center;height:0'">
            <template
                v-if="item && dataTabShow">
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
            <template
                v-if="item && (item.type === 'queryWidget' || item.type === 'textWidget' || item.type === 'imgWidget' || item.type === 'tabPageWidget')">
                <div class="config-tab" style="height: 45px">样式</div>
            </template>
        </el-header>
        <el-main class="config-content report-set-style">
            <template v-if="item">
                <template v-if="dataTabShow">
                    <!--数据-->
                    <div v-show="activeName === 'first'" style="height: 830px">
                        <!--左侧栏-->
                        <div class="data-config-panel-left">
                            <div class="div-first">
                                <div class="div-second">
                                    <!--设置-->
                                    <div class="div-third">
                                        <template v-if="chartSetShow">
                                            <chart-set :item="item" :active-name="activeName" :dimTreeData="dimTreeData"
                                                       ref="chartSet"
                                                       @showCondFiltersSet="showCondFiltersSet"
                                                       @showDimMeasureSelect="showDimMeasureSelect"
                                                       @showDimOrMeasureSelect="showDimOrMeasureSelect"
                                                       @showDateButtonsSelect="showDateButtonsSelect"></chart-set>
                                        </template>
                                        <template v-if="item.reportType === 'pieReportWidget'">
                                            <pie-chart-set :item="item" :active-name="activeName"
                                                           :dimTreeData="dimTreeData" ref="pieChartSet"
                                                           @showCondFiltersSet="showCondFiltersSet"
                                                           @showDimMeasureSelect="showDimMeasureSelect"
                                                           @showDimOrMeasureSelect="showDimOrMeasureSelect"
                                                           @showDateButtonsSelect="showDateButtonsSelect"></pie-chart-set>
                                        </template>
                                        <template v-if="item.reportType === 'tableReportWidget'">
                                            <table-widget-set :item="item" :active-name="activeName"
                                                              :dimTreeData="dimTreeData"
                                                              @showCondFiltersSet="showCondFiltersSet"
                                                              @showDimMeasureSelect="showDimMeasureSelect"
                                                              @showDimOrMeasureSelect="showDimOrMeasureSelect"
                                                              @showDateButtonsSelect="showDateButtonsSelect"
                                                              ref="tableWidgetSet"
                                            ></table-widget-set>
                                        </template>
                                        <template v-if="item.reportType === 'kanbanWidget'">
                                            <kanban-widget-set :item="item" :active-name="activeName"
                                                               @showCondFiltersSet="showCondFiltersSet"
                                                               @showDimMeasureSelect="showDimMeasureSelect"
                                                               @showDimOrMeasureSelect="showDimOrMeasureSelect"
                                                               @showDateButtonsSelect="showDateButtonsSelect"></kanban-widget-set>
                                        </template>
                                    </div>
                                    <!--更新-->
                                    <div class="bottom-menus">
                                        <div class="tableRadioGroup" v-if="item.reportType === 'tableReportWidget'">
                                            <el-radio-group v-model="item.data.tableGroup" size="medium"
                                                            @change="tableGroupChange">
                                                <el-radio-button label="aggregate">聚合</el-radio-button>
                                                <el-radio-button label="detail">明细</el-radio-button>
                                            </el-radio-group>
                                        </div>
                                        <div class="preview-panel ng-star-inserted">
                                            <label class="preview-label">结果展示 </label>
                                            <el-input type="number" style="width: 40%;"
                                                      v-model="item.querySize"></el-input>
                                        </div>
                                        <div class="refresh-panel ng-star-inserted">
                                            <el-button @click.prevent="updateItemToParent" type="primary"
                                                       style="width: 100%;">更新
                                            </el-button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--右侧栏-->
                        <div class="data-config-panel-right">
                            <div>
                                <el-select v-model="item.data.dataset" filterable placeholder="请选择" value=""
                                           style="width: 60%" @change="changeSelectDateConf"
                                           :popper-append-to-body="false">
                                    <el-option
                                        v-for="item in dataSetOptions"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                                <el-tooltip class="item" effect="dark" content="刷新数据集" placement="top">
                                    <el-button type="text" icon="el-icon-refresh" @click="listDataSet"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="编辑数据集" placement="top">
                                    <el-button type="text" icon="el-icon-edit-outline" @click="goDataSet"></el-button>
                                </el-tooltip>
                                <el-tooltip class="item" effect="dark" content="新增数据集" placement="top">
                                    <el-button type="text" icon="el-icon-plus" @click="goDataSource"></el-button>
                                </el-tooltip>
                            </div>
                            <div class="cube-content">
                                <div class="normal-panel">
                                    <div class="ant-input-affix-wrapper">
                                        <el-input
                                            placeholder="输入关键字进行过滤"
                                            v-model="filterTreeData" style="width: 90%">
                                        </el-input>
                                        <el-button type="text" icon="el-icon-refresh"
                                                   @click="getDataSetConf"></el-button>
                                    </div>
                                    <div class="tree-container">
                                        <!--维度-->
                                        <div class="dims-container">
                                            <div class="subject-title"> 维度
                                                <div class="pull-right icons nopadding"></div>
                                            </div>
                                            <el-tree ref="dimTree" v-loading="dimTreeDataLoading"
                                                     default-expand-all :show-checkbox="true"
                                                     :props="dimTreeProps" :data="dimTreeData"
                                                     :expand-on-click-node="false"
                                                     :filter-node-method="filterDimMeasure"
                                                     @node-click="addClassAxis" @node-contextmenu="addColorAxis"
                                                     check-strictly @check="addCondFilters(arguments,'dim')">
                                                <div slot-scope="{ node, data }">
                                                    <span class="blueFont" v-if="data.dataType==='String'">Str.</span>
                                                    <span class="blueFont"
                                                          v-else-if="data.dataType==='Timestamp' || data.dataType==='Date' || data.dataType==='Time'">Date.</span>
                                                    <span class="blueFont"
                                                          v-else-if="data.dataType==='Number'">No.</span>
                                                    <span v-else>{{data.dataType}}</span>
                                                    <el-tooltip effect="dark" :content="getDimOrMeasureTitle(data)"
                                                                placement="right" :open-delay="500">
                                                        <span class="whiteFont title-span">{{getDimOrMeasureTitle(data)}}</span>
                                                    </el-tooltip>
                                                </div>
                                            </el-tree>
                                        </div>
                                        <!--度量-->
                                        <div class="measures-container">
                                            <div class="subject-title">度量<span class="iconfont icon-movable v-move"
                                                                               data-spm-anchor-id="0.0.0.i22.24454666DdEnT9"></span>
                                                <div class="pull-right icons"></div>
                                            </div>
                                            <el-tree ref="measureTree" default-expand-all
                                                     v-loading="measureTreeDataLoading" :show-checkbox="true"
                                                     :props="measureTreeProps" :data="measureTreeData"
                                                     :expand-on-click-node="false"
                                                     :filter-node-method="filterDimMeasure" @node-click="addValueAxis"
                                                     check-strictly @check="addCondFilters(arguments,'measure')">
                                                <div slot-scope="{ node, data }">
                                                    <span class="greenFont" v-if="data.dataType==='String'">Str.</span>
                                                    <span class="greenFont"
                                                          v-else-if="data.dataType==='Timestamp' || data.dataType==='Date' || data.dataType==='Time'">Date.</span>
                                                    <span class="greenFont"
                                                          v-else-if="data.dataType==='Number'">No.</span>
                                                    <el-tooltip effect="dark" :content="getDimOrMeasureTitle(data)"
                                                                placement="right" :open-delay="500">
                                                        <span class="whiteFont title-span">{{getDimOrMeasureTitle(data)}}</span>
                                                    </el-tooltip>
                                                </div>
                                            </el-tree>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!--样式-->
                    <div v-show="activeName === 'second'" class="second-config-content">
                        <template v-if="chartSetShow">
                            <chart-set :item="item" :active-name="activeName"
                                       @notifyParentRefresh="chartRefreshNum++"
                                       @notifyParentRefreshByBack="chartNewNum++"></chart-set>
                        </template>
                        <template v-if="item.reportType === 'pieReportWidget'">
                            <pie-chart-set :item="item" :active-name="activeName"
                                           @notifyParentRefresh="chartRefreshNum++"
                                           @notifyParentRefreshByBack="chartNewNum++"></pie-chart-set>
                        </template>
                        <template v-if="item.reportType === 'tableReportWidget'">
                            <table-widget-set :item="item" :active-name="activeName"></table-widget-set>
                        </template>
                        <template v-if="item.reportType === 'kanbanWidget'">
                            <kanban-widget-set :item="item" :active-name="activeName"></kanban-widget-set>
                        </template>
                    </div>
                    <!--高级-->
                    <div v-show="activeName === 'third'">
                        <el-collapse v-model="queryActiveNames">
                            <el-collapse-item title="高级设置" name="1">
                                <el-form label-position="top" class="report-set-margin-let">
                                    <el-form-item label=" ">
                                        <el-checkbox v-model="item.sensior.autoRefresh">自动刷新</el-checkbox>
                                        <el-input style="width: 40%" type="number"
                                                  v-model="item.sensior.count"
                                                  min="1"
                                                  :disabled="!item.sensior.autoRefresh"></el-input>
                                        <el-select placeholder="请选择" v-model="item.sensior.countType" value=""
                                                   :disabled="!item.sensior.autoRefresh"
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
                                    <span v-text="item.id" style="color: #FFFFFF"></span>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </template>
                <template v-if="item.type === 'queryWidget'">
                    <query-widget-set :item="item"></query-widget-set>
                </template>
                <template v-else-if="item.type === 'textWidget'">
                    <text-widget-set :item="item"></text-widget-set>
                </template>
                <template v-else-if="item.type === 'imgWidget'">
                    <img-widget-set :item="item"></img-widget-set>
                </template>
                <template v-else-if="item.type === 'innerPageWidget'">
                    <inner-page-widget-set :item="item"></inner-page-widget-set>
                </template>
                <template v-else-if="item.type === 'tabPageWidget'">
                    <tab-page-widget-set :item="item"></tab-page-widget-set>
                </template>
            </template>
            <template v-else>
                <base-page-set :base-set="baseSet"></base-page-set>
            </template>
        </el-main>
        <!--过滤条件设置-->
        <el-dialog title="设置过滤器" custom-class="filter-dialog" :visible.sync="condFiltersSetVisible" width="45%"
                   :modal="false" :append-to-body="true" :close-on-click-modal="false">
            <report-filter v-if="reportFilterHackSet" :from-parent-obj="cond" @save="saveCondFilter"
                           @cancel="condFiltersSetVisible=false"></report-filter>
        </el-dialog>
        <!--当前时间按钮设置-->
        <el-dialog :title="selectTitle" custom-class="date-buttons-dialog" :visible.sync="addDateButtonsVisible" width="45%" top="5vh"
                   :modal="false" :append-to-body="true" :close-on-click-modal="false" v-if="addDateButtonsVisible">
            <report-date-buttons-set :dimTreeData="dimTreeData" :itemData="item.data.superConds" @cancel="addDateButtonsVisible=false"></report-date-buttons-set>
        </el-dialog>
        <!--维度/度量设置-->
        <el-dialog :title="selectTitle" :visible.sync="dimMeasureTreeSelectVisible" width="40%" :modal="false"
                   custom-class="dimMeasureDia"
                   @close="handleCloseSelected">
            <dim-measure-tree-select v-if="dimMeasureTreeSelectHackSet" @getCheckedNodes="getCheckedNodes"
                                     :select-down-num="selectDownNum" :measure-tree-data="measureTreeData"
                                     :measure-tree-props="measureTreeProps" :dim-tree-data="dimTreeData"
                                     :dim-tree-props="dimTreeProps" :select-type="selectType"></dim-measure-tree-select>
            <el-footer class="dimMeasureFooter" style="background-color: #2b3551">
                <el-row type="flex" justify="end">
                    <el-button @click="dimMeasureTreeSelectVisible=false">取消</el-button>
                    <el-button type="primary" @click="handleCloseSelected">确定</el-button>
                </el-row>
               <el-row></el-row>
            </el-footer>
        </el-dialog>
      <el-dialog title="主题样式" :visible.sync="themeDialogVisible"
                 top="5vh"
                 :modal = false  custom-class="col-cond-filter-dialog">
          <theme-list-show :currentType="2" ></theme-list-show>
      </el-dialog>
    </el-container>
</template>

<script>
    import QueryWidgetSet from "@/components/report/queryWidget/QueryWidgetSet";
    import ImgWidgetSet from "@/components/report/imgWidget/ImgWidgetSet";
    import TextWidgetSet from "@/components/report/textWidget/TextWidgetSet";
    import InnerPageWidgetSet from "@/components/report/innerPageWidget/InnerPageWidgetSet";
    import TabPageWidgetSet from "@/components/report/tabPageWidget/TabPageWidgetSet";
    import BasePageSet from "@/components/report/BasePageSet";
    import ChartSet from "@/components/report/chart/ChartSet";
    import PieChartSet from "@/components/report/chart/PieChartSet";
    import TableWidgetSet from "@/components/report/tableWidget/TableWidgetSet";
    import KanbanWidgetSet from "@/components/report/kanbanWidget/KanbanWidgetSet";
    import ReportFilter from "@/components/report/ReportFilter";
    import ReportSetItem from "@/components/report/ReportSetItem";
    import DimMeasureTreeSelect from "@/components/report/DimMeasureTreeSelect";
    import ThemeListShow from "@/components/theme/ThemeListShow";
    import ReportDateButtonsSet from "@/components/report/ReportDateButtonsSet";



    export default {
      directives: {
        'el-select-load-more': {
          bind(el, binding) {
            const SELECTWRAP_DOM = el.querySelector(
              '.el-select-dropdown .el-select-dropdown__wrap'
            );
            SELECTWRAP_DOM.addEventListener('scroll', function () {
              const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
              if (condition) {
                binding.value();
              }
            });
          }
        }
      },
        name: "ReportSet",
        components: {
          KanbanWidgetSet,
            TableWidgetSet,
            DimMeasureTreeSelect,
            ReportFilter,
            ReportSetItem,
            QueryWidgetSet,
            ImgWidgetSet,
            TextWidgetSet,
            InnerPageWidgetSet,
            TabPageWidgetSet,
            BasePageSet,
            ChartSet,
            PieChartSet,
            ThemeListShow,
            ReportDateButtonsSet
        },
        created() {
        },
        props: {
            item: {required: false, type: Object},
            baseSet: {required: false, type: Object}
        },
        computed: {
            chartSetShow: function () {
                let _this = this;
                return _this.item.reportType === 'lineReportWidget' || _this.item.reportType === 'columnReportWidget'
                    || _this.item.reportType === 'barReportWidget' || _this.item.reportType === 'compositeReportWidget';
            },
            dataTabShow: function () {
                let _this = this;
                return _this.item.reportType === 'lineReportWidget' || _this.item.reportType === 'pieReportWidget'
                    || _this.item.reportType === 'columnReportWidget' || _this.item.reportType === 'barReportWidget'
                    || _this.item.reportType === 'compositeReportWidget' || _this.item.reportType === 'tableReportWidget'
                    || _this.item.reportType === 'kanbanWidget';
            },
            getDimOrMeasureTitle() {
                return function (data) {
                    if (!this.KHUtils.isNull(data.column) && !this.KHUtils.isNull(data.alias)) {
                        return data.alias + "(" + data.column + ")";
                    } else if (!this.KHUtils.isNull(data.column)) {
                        return data.column;
                    } else if (!this.KHUtils.isNull(data.alias)) {
                        return data.alias;
                    }
                }
            },
        },
        data() {
            return {
                selectDownNum: 0,
                selectTitle: "设置维度",
                selectType: "dim",
                dimMeasureTreeSelectVisible: false,
                dimMeasureTreeSelectHackSet: false,
                chartNewNum: 0,  // 重新new,针对一些不能够update的属性,比如：chart:{type}属性
                chartRefreshNum: 0,  // 仅仅更改属性,chart不用new
                dataSetOptions: [],
                cond: {
                    dsId: 0,
                    dsName: '',
                    widgetId: 0,
                    condFilter: {}
                },
                reportFilterHackSet: false,
                condFiltersSetVisible: false, // 过滤条件设置界面
                queryActiveNames: ['1'],
                filterTreeData: '',
                activeName: 'first',
                dsMeta: {
                    datasource: "",
                    table: "",
                    joins: [],
                    columns: {
                        dim: [],
                        measure: []
                    },
                    conditions: []
                },//数据集配置信息
                dataSetConf: {}, //数据集配置
                dimTreeData: [], // 维度
                dimTreeProps: {
                    children: 'children',
                    label: 'column'
                },
                dimTreeDataLoading: false,
                measureTreeData: [], // 度量
                measureTreeProps: {
                    children: 'children',
                    label: 'column'
                },
                measureTreeDataLoading: false,
                drillingAxisSelectVisible: false,
                themeData:[],
                queryThemeParam:{
                  type:2,
                  pageNum:1,
                  pageSize:10
                },
                themeValue:null,
                themeDialogVisible:false,
                drillingAxisSelectVisible: false,
                addDateButtonsVisible: false
            }
        },
        watch: {
            filterTreeData(val) {
                this.$refs.dimTree.filter(val);
                this.$refs.measureTree.filter(val);
            },
            chartRefreshNum: {
                deep: true,
                handler() {
                    this.$emit("refreshChart", false);  //不需要重新调用后台接口刷新
                }
            },
            chartNewNum: {
                deep: true,
                handler() {
                    this.$emit("refreshChart", true); //需要重新调用后台接口刷新
                }
            }
        },
        mounted() {
            let _this = this;
            if (_this.item && _this.dataTabShow) {
                if (!_this.KHUtils.isNull(_this.item.data.dataset)) {
                    _this.getDataSetConf();
                }
                _this.listDataSet();
            }
            if (_this.item && _this.item.reportType === "tableReportWidget") {
                _this.$refs.tableWidgetSet.convertTableDrilling();
            }
        },
        methods: {
            //重置主题
            resetTheme(){
                let _this = this;
                this.$confirm('是否重置主题?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    _this.$emit("resetTheme");
                    /* this.$message({
                     type: 'success',
                     message: '删除成功!'
                     });*/
                });

            },
          addTheme(){
            let _this = this;
            _this.$emit("addTheme");
          },
          loadThemeFirst(){
            let _this = this;
            _this.queryThemeParam.pageNum = 1;
            _this.themeData = [];
            _this.queryTheme();

          },
          loadThemeMore(){
            let _this = this;
            _this.queryThemeParam.pageNum++;
            _this.queryTheme();
          },
          queryTheme(){
            this.$Get(this.khConfig.api.queryThemeByType, this.queryThemeParam).then(res => {
              if (res.errCode === 0) {
                if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                  res.datas.forEach(item => {
                    let obj = {
                      label: item.themeName,
                      value: item.id
                    }
                    this.themeData.push(obj);

                  })

                }


              }
            });
          },
          themeSelect(value){
            if(!this.KHUtils.isNull(value)){
              this.$Get(this.khConfig.api.queryThemeMeta+"/"+value).then(res => {
                if (res.errCode === 0) {
                  let themeMeta = JSON.parse(res.themeMeta);
                  this.$emit("refreshTheme",value,themeMeta);

                }
              });
            }

          },

            // 属性标签页切换设置
            handleTabSelect(value) {
                let _this = this;
                _this.activeName = value;
            },
            // 查询数据集
            listDataSet() {
                let _this = this;
                _this.dataSetOptions = [];
                _this.$Get(_this.khConfig.api.queryDataSetConf, {pageSize: 10000, pageNum: 1}).then(res => {
                    if (res.errCode === 0) {
                        if (res.datasets instanceof Array && res.datasets.length > 0) {
                            res.datasets.forEach(ds => {
                                let tempObj = {};
                                tempObj.value = ds.dsId;
                                tempObj.label = ds.dsName;
                                _this.dataSetOptions.push(tempObj);
                            })
                        }
                    }
                });
            },
            // 根据数据集ID查询
            getDataSetConf() {
                let _this = this;
                _this.dataSetConf = {};
                _this.dsMeta = {};
                _this.dimTreeDataLoading = true;
                _this.measureTreeDataLoading = true;
                _this.$Get(_this.khConfig.api.getDataSetConfById + "/" + _this.item.data.dataset, null).then(res => {
                    if (res.errCode === 0) {
                        if (!_this.KHUtils.isNull(res.dataSetConf)) {
                            _this.dataSetConf = res.dataSetConf;
                            let dsMetaStr = _this.dataSetConf.dsMeta;
                            _this.item.data.dsName = _this.dataSetConf.dsName;
                            if (!_this.KHUtils.isNull(dsMetaStr)) {
                                _this.dsMeta = JSON.parse(dsMetaStr);
                                _this.convertDimTreeData();
                                _this.convertMeasureTreeData();
                            }
                        }
                    }
                    _this.dimTreeDataLoading = false;
                    _this.measureTreeDataLoading = false;
                }).catch((e) => {
                    console.log(e);
                    _this.dimTreeDataLoading = false;
                    _this.measureTreeDataLoading = false;
                });
            },
            // 维度,度量查询
            filterDimMeasure(value, data) {
                if (!value) return true;
                return data.column.indexOf(value) !== -1;
            },
            // 修改数据集配置,初始化上一个数据集配置
            initReportSet() {
                let _this = this;
                if (_this.item && _this.item.data && _this.item.data.valueAxis) {
                    _this.item.data.valueAxis = [];
                }
                if (_this.item && _this.item.data && _this.item.data.classAxis) {
                    _this.item.data.classAxis = [];
                }
                if (_this.item && _this.item.data && _this.item.data.colorAxis) {
                    _this.item.data.colorAxis = [];
                }
                if (_this.item && _this.item.data && _this.item.data.viceValueAxis) {
                    _this.item.data.viceValueAxis = [];
                }
                if (_this.item && _this.item.data && _this.item.data.condFilters) {
                    _this.item.data.condFilters = [];
                }
                if (_this.item && _this.item.data && _this.item.data.rowAxis) {
                    _this.item.data.rowAxis = [];
                }
                if (_this.item && _this.item.data && _this.item.data.colAxis && _this.item.data.colAxis.classAxis) {
                    _this.item.data.colAxis.classAxis = [];
                }
                if (_this.item && _this.item.data && _this.item.data.colAxis && _this.item.data.colAxis.valueAxis) {
                    _this.item.data.colAxis.valueAxis = [];
                }
                if (_this.item && _this.item.data && _this.item.data.rowAxis) {
                    _this.item.data.rowAxis = [];
                }
                if (_this.item && _this.item.data && _this.item.data.drillingAxis) {
                    if (_this.item.reportType === "tableReportWidget") {
                        _this.item.data.drillingAxis = [];
                      _this.$refs.tableWidgetSet.convertTableDrilling();
                    } else {
                        _this.item.data.drillingAxis = [{drillCol: [], childCols: []}];
                    }
                }
                if (_this.item && _this.item.data && _this.item.data.superConds) {
                    _this.item.data.superConds = [];
                }
            },
            // 转化维度TreeData
            convertDimTreeData() {
                this.dimTreeData = [];
                if (this.dsMeta.columns.dim != null && this.dsMeta.columns.dim.length > 0) {
                    this.dsMeta.columns.dim.forEach(item => {
                        let tableName = item.table;
                        let newObj = {
                            "column": "",
                            "desc": "",
                            "dataType": "",
                            "alias": "",
                            "express": "",
                            "children": [],
                        };
                        newObj.column = tableName;
                        if (item.columns != null && item.columns.length > 0) {
                            item.columns.forEach(children => {
                                children.children = [];
                                this.dataConvert(children, "dim", tableName);
                                newObj.children.push(children);
                            })
                        }
                        this.dimTreeData.push(newObj);
                    })
                }
            },
            // 转化度量TreeData(可聚合)
            convertMeasureTreeData() {
                this.measureTreeData = [];
                if (this.dsMeta.columns.measure != null && this.dsMeta.columns.measure.length > 0) {
                    this.dsMeta.columns.measure.forEach(item => {
                        let tableName = item.table;
                        let newObj = {
                            "column": "",
                            "desc": "",
                            "dataType": "",
                            "alias": "",
                            "express": "",
                            "aggregate": "",
                            "charttype": "",
                            "children": [],
                            "type": "table"
                        };
                        newObj.column = tableName;
                        if (item.columns != null && item.columns.length > 0) {
                            item.columns.forEach(children => {
                                children.children = [];
                                this.dataConvert(children, "measure", tableName);
                                newObj.children.push(children);
                            })
                        }
                        this.measureTreeData.push(newObj);
                    })
                }
            },
            // 日期类型处理
            dataConvert(obj, sign, tableName) {
                let dataType = obj.dataType;
                let tempDimObj = {
                    "table": "",
                    "column": "",
                    "desc": "",
                    "dataType": "",
                    "alias": "",
                    "express": "",
                    "children": []
                };
                let tempMeasureObj = {
                    "table": "",
                    "column": "",
                    "desc": "",
                    "dataType": "",
                    "alias": "",
                    "express": "",
                    "aggregate": "",
                    "charttype": "",
                    "children": []
                };
                if (dataType === "Timestamp" || dataType === "Date") {
                    let yearObj = sign === 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    yearObj.column = obj.column;
                    yearObj.dataType = "Date";
                    yearObj.alias = "年";
                    yearObj.dateDim = "year";
                    yearObj.table = tableName;
                    obj.children.push(yearObj);
                    let quarterObj = 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    quarterObj.column = obj.column;
                    quarterObj.dataType = "Date";
                    quarterObj.alias = "季度";
                    quarterObj.dateDim = "quarter";
                    quarterObj.table = tableName;
                    obj.children.push(quarterObj);
                    let monthObj = 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    monthObj.column = obj.column;
                    monthObj.dataType = "Date";
                    monthObj.alias = "月";
                    monthObj.dateDim = "month";
                    monthObj.table = tableName;
                    obj.children.push(monthObj);
                    let weekObj = 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    weekObj.column = obj.column;
                    weekObj.dataType = "Date";
                    weekObj.alias = "星期";
                    weekObj.dateDim = "week";
                    weekObj.table = tableName;
                    obj.children.push(weekObj);
                    let dayObj = 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    dayObj.column = obj.column;
                    dayObj.dataType = "Date";
                    dayObj.alias = "日";
                    dayObj.dateDim = "day";
                    dayObj.table = tableName;
                    obj.children.push(dayObj);
                    let hourObj = 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    hourObj.column = obj.column;
                    hourObj.dataType = "Date";
                    hourObj.alias = "时";
                    hourObj.dateDim = "hour";
                    hourObj.table = tableName;
                    obj.children.push(hourObj);
                    let minuteObj = 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    minuteObj.column = obj.column;
                    minuteObj.dataType = "Date";
                    minuteObj.alias = "分";
                    minuteObj.dateDim = "minute";
                    minuteObj.table = tableName;
                    obj.children.push(minuteObj);
                    let secondObj = 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    secondObj.column = obj.column;
                    secondObj.dataType = "Date";
                    secondObj.alias = "秒";
                    secondObj.dateDim = "second";
                    secondObj.table = tableName;
                    obj.children.push(secondObj);
                    let ymdhmsObj = 'dim' ? this.KHUtils.clone(tempDimObj) : this.KHUtils.clone(tempMeasureObj);
                    ymdhmsObj.column = obj.column;
                    ymdhmsObj.dataType = "Date";
                    ymdhmsObj.alias = "年月日时分秒";
                    ymdhmsObj.dateDim = "ymdhms";
                    ymdhmsObj.table = tableName;
                    obj.children.push(ymdhmsObj);
                } else {
                    obj.table = tableName;
                }
            },
            // 新增数据集
            goDataSource() {
                let tmpUrl = "/report/datasource";
                window.open(tmpUrl);
            },
            // 编辑数据集
            goDataSet() {
                let tmpUrl = "/report/dataset";
                window.open(tmpUrl);
            },
            // 切换选择数据集
            changeSelectDateConf() {
                let _this = this;
                _this.getDataSetConf();
                _this.initReportSet();
            },
            // 从维度/度量树中选择
            getCheckedNodes(checkedNodes) {
                let _this = this;
                if (checkedNodes instanceof Array) {
                    switch (_this.selectType) {
                        case "valueAxis":
                            checkedNodes.forEach(cn => {
                                _this.KHReportSet.addValueAxis(cn, _this);
                            });
                            break;
                        case "viceValueAxis":
                            checkedNodes.forEach(cn => {
                                _this.KHReportSet.addViceValueAxis(cn, _this);
                            });
                            break;
                        case "classAxis":
                            checkedNodes.forEach(cn => {
                                _this.KHReportSet.addClassAxis(cn, _this);
                            });
                            break;
                        case "colorAxis":
                            checkedNodes.forEach(cn => {
                                _this.KHReportSet.addColorAxis({}, cn, _this);
                            });
                            break;
                        case "condFilters":
                            checkedNodes.forEach(data => {
                                _this.KHReportSet.addCondFilters(data, null, _this, data.type);
                            });
                            break;
                        case "drillingAxis":
                            checkedNodes.forEach(cn => {
                                if (_this.item.reportType === 'pieReportWidget') {
                                    _this.$refs.pieChartSet.addChildColsAxis(cn);
                                } else {
                                    _this.$refs.chartSet.addChildColsAxis(cn);
                                }
                            });
                            break;
                        case "rowAxis":
                            checkedNodes.forEach(cn => {
                                _this.$refs.tableWidgetSet.addRowAxis(cn);
                            });
                            break;
                        case "colAxis":
                            checkedNodes.forEach(cn => {
                                _this.$refs.tableWidgetSet.addColAxis(cn);
                            });
                          _this.$refs.tableWidgetSet.tableGroupChange(_this.item.data.tableGroup);
                            break;
                        case "tableDrillingAxis":
                            checkedNodes.forEach(cn => {
                                _this.$refs.tableWidgetSet.addTableDrillingChildAxis(cn);
                            });
                            break;
                    }
                }
            },
            // dialog关闭维度/度量树选择Dialog
            handleCloseSelected() {
                let _this = this;
                _this.dimMeasureTreeSelectVisible = false;
                _this.selectDownNum++;
            },
            // 度量/维度同时选择
            showDimMeasureSelect(title) {
                let _this = this;
                if (!(_this.item.data.dataset) || _this.KHUtils.isNull(_this.item.data.dataset)) {
                    _this.$message.warning("请先选择数据集");
                    return false;
                }
                _this.selectTitle = "设置" + title;
                _this.selectType = "condFilters";
                _this.dimMeasureTreeSelectVisible = true;
                _this.dimMeasureTreeSelectHackSet = false;
                // 重新渲染子组件
                _this.$nextTick(() => {
                    _this.dimMeasureTreeSelectHackSet = true
                });
            },
            // 度量 Or 维度选择
            showDimOrMeasureSelect(type, title) {
                let _this = this;
                if (!(_this.item.data.dataset) || _this.KHUtils.isNull(_this.item.data.dataset)) {
                    _this.$message.warning("请先选择数据集");
                    return false;
                }
                //_this.tableDrillingData = data.data;
                _this.selectType = type;
                _this.selectTitle = "设置" + title;
                _this.dimMeasureTreeSelectVisible = true;
                _this.dimMeasureTreeSelectHackSet = false;
                // 重新渲染子组件
                _this.$nextTick(() => {
                    _this.dimMeasureTreeSelectHackSet = true
                });
            },
            //时间按钮选择
            showDateButtonsSelect(title) {
                if (!(this.item.data.dataset) || this.KHUtils.isNull(this.item.data.dataset)) {
                    this.$message.warning("请先选择数据集");
                    return false;
                }
                this.selectTitle = "设置" + '叠加条件';
                this.addDateButtonsVisible = true;
            },
            // 保存过滤条件设置
            saveCondFilter(fromChildObj) {
                let _this = this;
                //console.log("saveCondFilter before:" + JSON.stringify(_this.item.data.condFilters));
                if (_this.item.data.condFilters instanceof Array) {
                    let tempIndex = 0;
                    let flag = false;
                    _this.item.data.condFilters.forEach((cf, index) => {
                        let tempName = fromChildObj.column + fromChildObj.alias;
                        let compareName = cf.column + cf.alias;
                        if (compareName === tempName) {
                            flag = true;
                            tempIndex = index;
                        }
                    });
                    if (flag) {
                        if ((fromChildObj.conds instanceof Array && fromChildObj.conds.length > 0) || (fromChildObj.conds0 instanceof Array && fromChildObj.conds0.length > 0)
                            || (fromChildObj.conds1 instanceof Array && fromChildObj.conds1.length > 0)) {
                            _this.item.data.condFilters[tempIndex] = _this.KHUtils.clone(fromChildObj);
                        } else {
                            _this.removeCondFilters(fromChildObj);
                        }
                    }
                }
                _this.condFiltersSetVisible = false;
                //console.log("saveCondFilter: " + JSON.stringify(_this.item.data.condFilters));
            },
            // 打开过滤条件设置
            showCondFiltersSet(cond) {
                let _this = this;
                if (cond.dataType === 'Timestamp' || cond.dataType === 'Datetime' || cond.dataType === 'Time') {
                    cond.dataType = 'Date';
                }
                _this.cond.dsId = _this.item.data.dataset;
                if (_this.item.data.dataset) {
                    _this.dataSetOptions.forEach(obj => {
                        if (obj.value === _this.item.data.dataset) {
                            _this.cond.dsName = obj.label;
                        }
                    })
                }
                _this.cond.widgetId = _this.item.id;
                for (let i = 0; i < _this.item.data.condFilters.length; i++) {
                    let condFilter = _this.item.data.condFilters[i];
                    if (condFilter.id === cond.id) {
                        _this.cond.condFilter = _this.KHUtils.clone(condFilter);
                        break;
                    }
                }
                _this.condFiltersSetVisible = true;
                _this.reportFilterHackSet = false;
                // 重新渲染子组件
                _this.$nextTick(() => {
                    _this.reportFilterHackSet = true
                });
                //console.log("showCondFiltersSet :" + JSON.stringify(_this.cond));
            },
            // 返回设置结果
            updateItemToParent() {
                let _this = this;
                let index = 1;  // 起始编号
                let tempValueArray = [];
                if (_this.item.data.valueAxis instanceof Array) {
                    _this.item.data.valueAxis.forEach(va => {
                        va.id = index++;
                        tempValueArray.push(va);
                    })
                }
                if (_this.item.data.viceValueAxis instanceof Array) {
                    _this.item.data.viceValueAxis.forEach(va => {
                        va.id = index++;
                        tempValueArray.push(va);
                    })
                }
                // 校验度量是否存在重复
                for (let i = 0; i < tempValueArray.length - 1; i++) {
                    for (let j = i + 1; j < tempValueArray.length; j++) {
                        let compareColumn = _this.KHChart.splicingColumnSetNoIdWithTableName(tempValueArray[i], _this);
                        let column = _this.KHChart.splicingColumnSetNoIdWithTableName(tempValueArray[j], _this);
                        //tempValueArray[i].table + tempValueArray[i].column + tempValueArray[i].aggregate === tempValueArray[j].table + tempValueArray[j].column + tempValueArray[j].aggregate
                        if (compareColumn === column) {
                            _this.$message.error("度量存在重复项");
                            return false;
                        }
                    }
                }
                if (_this.item.reportType === "tableReportWidget") {
                    let tableArray = [];
                    if (_this.item.data.rowAxis instanceof Array && _this.item.data.rowAxis.length > 0) {
                        _this.item.data.rowAxis.forEach(va => {
                            tableArray.push(va);
                        })
                    }
                    if (_this.item.data.colAxis && _this.item.data.colAxis.classAxis instanceof Array && _this.item.data.colAxis.classAxis.length > 0) {
                        _this.item.data.colAxis.classAxis.forEach(va => {
                            tableArray.push(va);
                        })
                    }
                    if (_this.item.data.colAxis && _this.item.data.colAxis.valueAxis instanceof Array && _this.item.data.colAxis.valueAxis.length > 0) {
                        _this.item.data.colAxis.valueAxis.forEach(va => {
                            tableArray.push(va);
                        })
                    }
                    for (let i = 0; i < tableArray.length - 1; i++) {
                        for (let j = i + 1; j < tableArray.length; j++) {
                            let axis1 = getAxisValue(tableArray[i]);
                            let axis2 = getAxisValue(tableArray[j]);
                            //console.log(axis1 + "&&" + axis2 + "&& i= " + i + "j=" + j);
                            if (axis1 === axis2) {
                                _this.$message.error("已存在相同项");
                                return false;
                            }
                        }
                    }

                }
                if (_this.item.type === 'reportWidget' && _this.item.reportType !== 'tableReportWidget' && _this.item.reportType !== 'kanbanWidget') {
                    let classFlag = !(_this.item.data.classAxis) || _this.item.data.classAxis.length <= 0;
                    let colorFlag = !(_this.item.data.colorAxis) || _this.item.data.colorAxis.length <= 0;
                    if (classFlag && colorFlag) {
                        _this.$message.error("类别轴/维度区域缺少维度项");
                        return false;
                    }
                    let tempClassArray = [];
                    if (_this.item.data.classAxis instanceof Array) {
                        _this.item.data.classAxis.forEach(va => {
                            tempClassArray.push(va);
                        })
                    }
                    if (_this.item.data.colorAxis instanceof Array) {
                        _this.item.data.colorAxis.forEach(va => {
                            tempClassArray.push(va);
                        })
                    }
                    // 校验维度是否存在重复
                    for (let i = 0; i < tempClassArray.length - 1; i++) {
                        for (let j = i + 1; j < tempClassArray.length; j++) {
                            let compareColumn = _this.KHChart.splicingColumnSetNoIdWithTableName(tempClassArray[i], _this);
                            let column = _this.KHChart.splicingColumnSetNoIdWithTableName(tempClassArray[j], _this);
                            /*                     let flag = tempClassArray[i].dataType === 'Date' ?
                                                     tempClassArray[i].table + tempClassArray[i].column + tempClassArray[i].dateDim === tempClassArray[j].table + tempClassArray[j].column + tempClassArray[j].dateDim :
                                                     tempClassArray[i].table + tempClassArray[i].column === tempClassArray[j].table + tempClassArray[j].column*/
                            if (compareColumn === column) {
                                _this.$message.warning("维度存在重复项");
                                return false;
                            }
                        }
                    }
                    let valueFlag = _this.item.data.valueAxis instanceof Array && _this.item.data.valueAxis.length === 0;
                    let viceValueAxisFlag = _this.item.data.viceValueAxis instanceof Array && _this.item.data.viceValueAxis.length === 0;
                    if (_this.item.reportType === "compositeReportWidget") {
                        if (valueFlag && viceValueAxisFlag) {
                            _this.$message.error("缺少度量项");
                            return false;
                        }
                    } else {
                        if (valueFlag || viceValueAxisFlag) {
                            _this.$message.error("缺少度量项");
                            return false;
                        }
                    }
                } else if (_this.item.reportType === "kanbanWidget") {
                    let classFlag = !(_this.item.data.classAxis) || _this.item.data.classAxis.length <= 0;
                    if (classFlag) {
                        _this.$message.error("看板标签/维度缺少维度项");
                        return false;
                    }
                    let valueFlag = _this.item.data.valueAxis instanceof Array && _this.item.data.valueAxis.length === 0;
                    if (valueFlag) {
                        _this.$message.error("看板指标/度量缺少度量项");
                        return false;
                    }
                }
                if (_this.item.data.classAxis instanceof Array) {
                    _this.item.data.classAxis.forEach(va => {
                        va.id = index++;
                    })
                }
                if (_this.item.data.colorAxis instanceof Array && _this.item.data.colorAxis.length > 0) {
                    _this.item.data.colorAxis.forEach(va => {
                        va.id = index++;
                    })
                }
                // 过滤条件去除无效设置
                if (_this.item.data.condFilters instanceof Array && _this.item.data.condFilters.length > 0) {
                    let tempArray = [];
                    _this.item.data.condFilters.forEach(cf => {
                        if ((cf.conds instanceof Array && cf.conds.length > 0) || (cf.conds0 instanceof Array && cf.conds0.length > 0)
                            || (cf.conds1 instanceof Array && cf.conds1.length > 0)) {
                            cf.id = index++;  // 编号
                            tempArray.push(cf);
                        }
                    });
                    _this.item.data.condFilters = tempArray;
                }
                if (_this.item.data.rowAxis instanceof Array && _this.item.data.rowAxis.length > 0) {
                    _this.item.data.rowAxis.forEach(ra => {
                        ra.id = index++;
                    })
                }
                if (_this.item.data.colAxis) {
                    if (_this.item.data.colAxis.classAxis instanceof Array && _this.item.data.colAxis.classAxis.length > 0) {
                        _this.item.data.colAxis.classAxis.forEach(ca => {
                            ca.id = index++;
                        })
                    }
                    if (_this.item.data.colAxis.valueAxis instanceof Array && _this.item.data.colAxis.valueAxis.length > 0) {
                        _this.item.data.colAxis.valueAxis.forEach(va => {
                            va.id = index++;
                        })
                    }
                }
                if (_this.item.reportType === "tableReportWidget") {
                    if (_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length >= 1) {
                        this.item.data.drillingAxis.forEach((drillingObj, key) => {
                            let drillCol = drillingObj.drillCol;
                            let childCols = drillingObj.childCols;
                            if (drillCol instanceof Array && drillCol.length === 1) {
                                drillCol[0].id = index++;
                            }
                            if (childCols instanceof Array && childCols.length > 0) {
                                childCols.forEach((child, m) => {
                                    child.id = index++;
                                })
                            }
                        })
                    }
                } else {
                    // 钻取除主维度外,编号
                    if (_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length >= 1) {
                        if (_this.item.data.drillingAxis[0].childCols instanceof Array) {
                            _this.item.data.drillingAxis[0].childCols.forEach(obj => {
                                obj.id = index++;
                            })
                        }
                    }
                }
                //console.log("updateItemToParent data:" + JSON.stringify(_this.item.data));
                _this.$emit("reviewItem");

                function getAxisValue(axis) {
                    let value = "";
                    if (!_this.KHUtils.isNull(axis.table)) {
                        value += axis.table;
                    }
                    if (!_this.KHUtils.isNull(axis.column)) {
                        value += axis.column;
                    }
                    if (!_this.KHUtils.isNull(axis.express)) {
                        value += axis.express;
                    }
                    if (!_this.KHUtils.isNull(axis.aggregate)) {
                        value += axis.aggregate;
                    }
                    if (axis.dataType === "Date") {
                        value += axis.dateDim;
                    }
                    return value;
                }
            },
            // 度量树点击新增度量
            addValueAxis(data) {
                this.KHReportSet.addValueAxis(data, this);
            },
            // 度量、维度树点击选择新增过滤条件
            addCondFilters(args, itemType) {
                this.KHReportSet.addCondFilters(args[0], args[1], this, itemType);
            },
            // 维度树点击新增维度
            addClassAxis(data) {
                this.KHReportSet.addClassAxis(data, this);
            },
            // 维度树鼠标右键点击新增颜色维度
            addColorAxis(event, data) {
                this.KHReportSet.addColorAxis(event, data, this);
            },
            // 交叉表,聚合/明细切换
            tableGroupChange(value) {
                let _this = this;
                _this.$refs.tableWidgetSet.tableGroupChange(value);
            }
        },
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/report/report-set.scss";
</style>

