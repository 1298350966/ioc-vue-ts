<template>
    <section>
        <el-form label-position="top" v-if="activeName === 'first'">
            <!--钻取/维度-->
            <div class="config-data-item" v-if="drillingAxisSelectVisible">
                <el-tooltip class="item" effect="dark" content="点击+选择维度数据字段至此处" placement="left">
                    <div class="area-name clearfix"><span
                        @click="showDimOrMeasureSelect('drillingAxis',drillingAxisTitle)"
                        style="cursor: pointer">{{drillingAxisTitle}}</span>
                        <i class="el-icon-plus" @click="showDimOrMeasureSelect('drillingAxis',drillingAxisTitle)"
                           style="float: right"></i>
                    </div>
                </el-tooltip>
                <div v-if="(!(item.data.drillingAxis instanceof Array) ||item.data.drillingAxis.length < 1)
                    || (item.data.drillingAxis[0].drillCol instanceof Array && item.data.drillingAxis[0].drillCol.length === 0)">
                    <ul class="column-list"></ul>
                    <div class="no-column-tip">
                        <span>点击+选择钻取维度数据字段至此处</span>
                    </div>
                </div>
                <!--点击钻取的主维度-->
                <el-form-item v-for="(vaItem, index) in item.data.drillingAxis[0].drillCol" :key="index">
                    <report-set-item :moreMenu=true :reportType="item.reportType" :item="vaItem" :itemType="dim"
                                     @removeAxis="removeDrillColAxis"></report-set-item>
                </el-form-item>
                <!--点击钻取的子维度-->
                <el-form-item v-for="(vaItem, index) in item.data.drillingAxis[0].childCols" :key="index+1">
                    <report-set-item :moreMenu=true :reportType="item.reportType"
                                     :item="vaItem" :itemType="dim"
                                     @removeAxis="removeChildColsAxis"></report-set-item>
                </el-form-item>
            </div>
            <!--值轴/度量-->
            <div class="config-data-item">
                <el-tooltip class="item" effect="dark" content="单击度量数据字段至此处"
                            placement="left">
                    <div class="area-name clearfix"><span style="cursor: pointer"
                                                          @click="showDimOrMeasureSelect('valueAxis',valueAxisTitle)">{{valueAxisTitle}}</span>
                        <i class="el-icon-plus" @click="showDimOrMeasureSelect('valueAxis',valueAxisTitle)"
                           style="float: right"></i>
                    </div>
                </el-tooltip>
                <div v-if="item.data.valueAxis.length === 0">
                    <ul class="column-list"></ul>
                    <div class="no-column-tip">
                        <span>单击度量数据字段至此处</span>
                    </div>
                </div>
                <el-form-item v-for="(vaItem, index) in item.data.valueAxis" :key="index">
                    <report-set-item :moreMenu="true" :reportType="item.reportType"
                                     :item="vaItem" :itemType="measure"
                                     @removeAxis="removeValueAxis"></report-set-item>
                </el-form-item>
            </div>
            <!--类别轴/维度-->
            <div class="config-data-item">
                <el-tooltip class="item" effect="dark" content="单击维度数据字段至此处" placement="left">
                    <div class="area-name clearfix"><span style="cursor: pointer"
                                                          @click="showDimOrMeasureSelect('classAxis',classAxisTitle)"> {{classAxisTitle}}</span>
                        <i class="el-icon-plus"
                           @click="showDimOrMeasureSelect('classAxis',classAxisTitle)"
                           style="float: right"></i>
                    </div>
                </el-tooltip>
                <div v-if="item.data.classAxis.length === 0">
                    <ul class="column-list"></ul>
                    <div class="no-column-tip">
                        <span>单击维度数据字段至此处</span>
                    </div>
                </div>
                <el-form-item v-for="(vaItem, index) in item.data.classAxis" :key="index">
                    <report-set-item :reportType="item.reportType" :moreMenu="true"
                                     :drillDown="true" :item="vaItem"
                                     @removeAxis="removeClassAxis" :itemType="dim"
                                     @addDrillDownAxis="showDrillingAxisSelect"></report-set-item>
                </el-form-item>
            </div>
            <!--过滤器-->
            <div class="config-data-item">
                <el-tooltip class="item" effect="dark" content="勾选数据字段至此处"
                            placement="left">
                    <div class="area-name clearfix"><span style="cursor: pointer"
                                                          @click="showDimMeasureSelect"> 过滤器</span>
                        <i class="el-icon-plus" @click="showDimMeasureSelect" style="float: right"></i>
                    </div>
                </el-tooltip>
                <div v-if="item.data.condFilters.length === 0">
                    <ul class="column-list"></ul>
                    <div class="no-column-tip">
                        <span>勾选数据字段至此处</span>
                    </div>
                </div>
                <el-form-item v-for="(vaItem, index) in item.data.condFilters" :key="index">
                    <report-set-item :moreMenu="vaItem.dataType === 'Number'"
                                     :reportType="item.reportType" :drillDown="false"
                                     :filter="true" :item="vaItem"
                                     :itemType="vaItem.itemType?vaItem.itemType:'measure'"
                                     @addFilters="showCondFiltersSet" :isFilter="true"
                                     @removeAxis="removeCondFilters"></report-set-item>
                </el-form-item>
            </div>
            <!--叠加条件-->
            <div class="config-data-item">
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
            </div>
        </el-form>
        <el-collapse v-model="queryActiveNames" v-if="activeName === 'second'">
            <el-collapse-item title="基础信息" name="1">
                <el-form label-position="top" class="report-set-margin-let">
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
                    <el-checkbox v-model="item.style.mainTitleVisiable">
                        显示主标题/备注
                    </el-checkbox>
                    <el-form-item label="主标题">
                        <el-input style="width: 90%" v-model="item.style.mainTitle"></el-input>
                        <el-color-picker v-model="item.style.mainTitleColor" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-form-item label="备注">
                        <el-input style="width: 90%" v-model="item.style.titleRemark"></el-input>
                    </el-form-item>
                    <el-checkbox v-model="item.style.subtitleVisiable" @change="notifyParentRefreshByBack">
                        展示链接跳转
                    </el-checkbox>
                    <el-form-item label="链接文案">
                        <el-input style="width: 90%" v-model="item.style.subtitleText"
                                  @blur="notifyParentRefreshByBack"></el-input>
                    </el-form-item>
                    <el-form-item label="链接地址">
                        <el-input style="width: 90%" v-model="item.style.subtitleUrl"
                                  @blur="notifyParentRefreshByBack"></el-input>
                    </el-form-item>
                    <el-form-item label="可视化样式">
                        <el-radio label="pie" v-model="item.style.shapeType"
                                  @change="notifyParentRefreshByBack">饼形
                        </el-radio>
                        <el-radio label="annular" v-model="item.style.shapeType"
                                  @change="notifyParentRefreshByBack">环形
                        </el-radio>
                    </el-form-item>
                    <el-form-item label="钻取导航栏字体/颜色">
                        <el-select v-model="item.style.drillNavigationFontSize"
                                   :popper-append-to-body="false" style="width: 20%" value="">
                            <el-option v-for="item in Constants.viceValueSizeOptions"
                                       :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <el-color-picker v-model="item.style.drillNavigationFontColor" show-alpha></el-color-picker>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="图表样式" name="2">
                <el-form label-position="top" class="report-set-margin-let">
                    <el-form-item label="背景颜色">
                        <el-color-picker v-model="item.style.backgroundColor"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-form-item label="数据列颜色">
                        <el-color-picker v-model="item.style.seriesColor1"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor2"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor3"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor4"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor5"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor6"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor7"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor8"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor9"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                        <el-color-picker v-model="item.style.seriesColor10"
                                         @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-checkbox :indeterminate="item.style.isIndeterminate"
                                 v-model="item.style.dataLabelsEnable"
                                 @change="handleCheckAllPieLabelChange">
                        显示标签
                    </el-checkbox>
                    <el-checkbox-group v-model="item.style.dataLabels"
                                       @change="handleCheckedPieLabelChange">
                        <el-checkbox v-for="op in pieLabelOptions" :label="op" :key="op">{{op}}
                        </el-checkbox>
                    </el-checkbox-group>
                    <el-form-item label="数据标签字体/颜色">
                        <el-select v-model="item.style.labelSize"
                                   :popper-append-to-body="false" style="width: 20%" value=""
                                   @change="notifyParentRefreshByBack">
                            <el-option v-for="item in Constants.viceValueSizeOptions"
                                       :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <el-color-picker v-model="item.style.labelColor" @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-form-item label="半径百分比">
                        <el-select v-model="item.style.radius" placeholder="请选择" value=""
                                   @change="notifyParentRefreshByBack" :popper-append-to-body="false">
                            <el-option
                                v-for="item in Constants.radiusOptions"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <div style="margin-top: 10px;margin-bottom: 10px">
                        <div class="secondary-font-color" style="margin-bottom: 10px">显示图例</div>
                        <el-radio-group v-model="item.style.legendAlign"
                                        class="report-set-radio-button" @change="notifyParentRefreshByBack">
                            <el-radio label="none" border>
                                <el-tooltip class="item" effect="dark" content="无" placement="top">
                                    <i class="icon iconfont icon-fangkuang"></i>
                                </el-tooltip>
                            </el-radio>
                            <el-radio label="top" border>
                                <el-tooltip class="item" effect="dark" content="上" placement="top">
                                    <i class="icon iconfont icon-icon--2"></i>
                                </el-tooltip>
                            </el-radio>
                            <el-radio label="bottom" border>
                                <el-tooltip class="item" effect="dark" content="下" placement="top">
                                    <i class="icon iconfont icon-icon--3"></i>
                                </el-tooltip>
                            </el-radio>
                            <el-radio label="left" border>
                                <el-tooltip class="item" effect="dark" content="左" placement="top">
                                    <i class="icon iconfont icon-icon--1"></i>
                                </el-tooltip>
                            </el-radio>
                            <el-radio label="right" border>
                                <el-tooltip class="item" effect="dark" content="右" placement="top">
                                    <i class="icon iconfont icon-icon--"></i>
                                </el-tooltip>
                            </el-radio>
                        </el-radio-group>
                    </div>
                    <el-form-item label="图例字体/颜色" v-if="item.style.legendAlign &&item.style.legendAlign !== 'none'">
                        <el-select v-model="item.style.legendFontSize"
                                   :popper-append-to-body="false" style="width: 20%" value=""
                                   @change="notifyParentRefreshByBack">
                            <el-option v-for="item in Constants.viceValueSizeOptions"
                                       :key="item.value" :label="item.label"
                                       :value="item.value"></el-option>
                        </el-select>
                        <el-color-picker v-model="item.style.legendFontColor" @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-checkbox v-model="item.style.showTotal" @change="notifyParentRefreshByBack">
                        显示总计
                    </el-checkbox>
                    <el-select v-model="item.style.totalFontSize"
                               :popper-append-to-body="false" style="width: 20%" value="" @change="notifyParentRefreshByBack">
                        <el-option v-for="item in Constants.viceValueSizeOptions"
                                   :key="item.value" :label="item.label"
                                   :value="item.value"></el-option>
                    </el-select>
                    <el-color-picker v-model="item.style.totalColor" @change="notifyParentRefreshByBack" show-alpha></el-color-picker>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="叠加条件样式" name="4">
                <el-form label-position="top" class="report-set-margin-let">
                    <div class="secondary-font-color" style="margin-top: 10px">未选中状态</div>
                    <div style="margin-bottom: 10px">
                        <span class="secondary-font-color">字体/颜色</span>
                        <el-input type="number" style="width: 60px" :min="1"
                                  :value="parseInt(item.style.superConds.unselected.fontSize.split('px')[0])"
                                  @input="(val)=>{ item.style.superConds.unselected.fontSize = val + 'px' }" ></el-input>
                        <el-color-picker v-model="item.style.superConds.unselected.fontColor" show-alpha></el-color-picker>
                        <span class="secondary-font-color" style="margin-left: 20px">背景颜色</span>
                        <el-color-picker v-model="item.style.superConds.unselected.backgroundColor" show-alpha></el-color-picker>
                    </div>
                    <div class="secondary-font-color" style="margin-top: 10px">选中状态</div>
                    <div style="margin-bottom: 10px">
                        <span class="secondary-font-color">字体/颜色</span>
                        <el-input type="number" style="width: 60px" :min="1"
                                  :value="parseInt(item.style.superConds.selected.fontSize.split('px')[0])"
                                  @input="(val)=>{ item.style.superConds.selected.fontSize = val + 'px' }"></el-input>
                        <el-color-picker v-model="item.style.superConds.selected.fontColor" show-alpha></el-color-picker>
                        <span class="secondary-font-color" style="margin-left: 20px">背景颜色</span>
                        <el-color-picker v-model="item.style.superConds.selected.backgroundColor" show-alpha></el-color-picker>
                    </div>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </section>
</template>

<script>
    import ReportSetItem from "@/components/report/ReportSetItem";

    const drillingAxisTitle = "钻取/维度";
    const valueAxisTitle = "扇区角度/度量";
    const classAxisTitle = "扇区标签/维度";
    export default {
        name: "PieChartSet",
        components: {ReportSetItem},
        created() {
            this.KHReportSet.initDataField(this);
            this.KHReportSet.initChartStyle(this);
            this.drillingAxisSelectVisible = this.item.data.drillingAxis instanceof Array && this.item.data.drillingAxis.length > 0;
        },
        props: {
            item: {required: true, type: Object},
            activeName: {required: true, type: String},
            dimTreeData: {required: false, type: Array}
        },
        data() {
            return {
                lineColumnBarShow: true,
                drillingAxisTitle: drillingAxisTitle,
                valueAxisTitle: valueAxisTitle,
                classAxisTitle: classAxisTitle,
                pieLabelOptions: ["维度", "度量", "百分比"],
                queryActiveNames: ['1'],
                drillingAxisSelectVisible: false,
                measure: "measure",
                dim: "dim",
            }
        },
        watch: {},
        methods: {
            // 饼图显示标签设置
            handleCheckAllPieLabelChange(val) {
                let _this = this;
                _this.chartRefreshNum++;
                _this.item.style.dataLabels = val ? _this.pieLabelOptions : [];
                _this.item.style.isIndeterminate = false;
                this.$emit("notifyParentRefreshByBack");
            },
            // 饼图显示标签设置
            handleCheckedPieLabelChange(value) {
                let _this = this;
                _this.chartRefreshNum++;
                let checkedCount = value.length;
                this.item.style.dataLabelsEnable = _this.pieLabelOptions.length === 3;
                this.item.style.isIndeterminate = checkedCount > 0 && checkedCount < _this.pieLabelOptions.length;
                this.$emit("notifyParentRefreshByBack");
            },
            notifyParentRefreshByBack() {
                this.$emit("notifyParentRefreshByBack");
            },
            notifyParentRefreshByBack() {
                this.$emit("notifyParentRefreshByBack");
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
            // 钻取设置
            showDrillingAxisSelect(drillCol) {
                let _this = this;
                _this.KHReportSet.showDrillingAxisSelect(drillCol, _this);
            },
            //通知父组件打开选择当前时间按钮的界面
            showDateButtonsSelect() {
                this.$emit('showDateButtonsSelect', '时间按钮');
            },
            // 主钻取维度的动态删除
            removeDrillColAxis(item) {
                let _this = this;
                _this.KHReportSet.removeDrillColAxis(item, _this);
            },
            // 子钻取维度的动态删除
            removeChildColsAxis(item) {
                let _this = this;
                _this.KHReportSet.removeChildColsAxis(item, _this);
            },
            // 子钻取维度的动态新增
            addChildColsAxis(data) {
                let _this = this;
                _this.KHReportSet.addChildColsAxis(data, _this);
            },
            // 度量的动态新增
            addValueAxis(data) {
                let _this = this;
                _this.KHReportSet.addValueAxis(data, _this);
            },
            // 度量的动态删除
            removeValueAxis(item) {
                let _this = this;
                _this.KHReportSet.removeValueAxis(item, _this);
            },
            // 副值轴/度量的动态新增
            addViceValueAxis(data) {
                let _this = this;
                _this.KHReportSet.addViceValueAxis(data, _this);
            },
            // 副值轴/度量的动态删除
            removeViceValueAxis(item) {
                let _this = this;
                _this.KHReportSet.removeViceValueAxis(item, _this);
            },
            // 维度的动态新增
            addClassAxis(data) {
                let _this = this;
                _this.KHReportSet.addClassAxis(data, _this);
            },
            // 维度的动态删除
            removeClassAxis(item) {
                let _this = this;
                _this.KHReportSet.removeClassAxis(item, _this);
            },
            // 颜色图例的动态新增
            addColorAxis(event, data) {
                let _this = this;
                _this.KHReportSet.addColorAxis(event, data, _this);
            },
            // 颜色图例的动态删除
            removeColorAxis(item) {
                let _this = this;
                _this.KHReportSet.removeColorAxis(item, _this);
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
            // 当前时间按钮动态删除
            removeDateButtons(item) {
                let _this = this;
                _this.KHReportSet.removeDateButtons(item, _this);
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
