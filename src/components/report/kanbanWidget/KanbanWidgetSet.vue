<template>
    <section>
        <el-form label-position="top" v-if="activeName === 'first'">
            <!--指标看板 度量-->
            <div class="config-data-item">
                <el-tooltip class="item" effect="dark" content="单击数据字段至此处" placement="left">
                    <div class="area-name clearfix"><span style="cursor: pointer"
                                                          @click="showDimOrMeasureSelect('valueAxis','度量')"> 看板指标/度量</span>
                        <i class="el-icon-plus"
                           @click="showDimOrMeasureSelect('valueAxis','度量')"
                           style="float: right"></i>
                    </div>
                </el-tooltip>
                <div
                    v-if="item.data.valueAxis.length === 0">
                    <ul class="column-list"></ul>
                    <div class="no-column-tip">
                        <span>单击字段至此处</span>
                    </div>
                </div>
                <el-form-item
                    v-for="(vaItem, index) in item.data.valueAxis"
                    :key="index">
                    <report-set-item :moreMenu="true" :drillDown="false" :item="vaItem"
                                     :itemType="measure"
                                     @removeAxis="removeValueAxis"></report-set-item>
                </el-form-item>
            </div>
            <!--指标看板 维度-->
            <div class="config-data-item">
                <el-tooltip class="item" effect="dark" content="单击数据字段至此处"
                            placement="left">
                    <div class="area-name clearfix"><span style="cursor: pointer"
                                                          @click="showDimOrMeasureSelect('classAxis','维度')">看板标签/维度</span>
                        <i class="el-icon-plus"
                           @click="showDimOrMeasureSelect('classAxis','维度')"
                           style="float: right"></i>
                    </div>
                </el-tooltip>
                <div v-if="item.data.classAxis.length === 0">
                    <ul class="column-list"></ul>
                    <div class="no-column-tip">
                        <span>单击维度数据字段至此处</span>
                    </div>
                </div>
                <el-form-item v-for="(vaItem, index) in item.data.classAxis"
                              :key="index">
                    <report-set-item :moreMenu="true" :drillDown="false" :item="vaItem"
                                     :itemType="dim"
                                     @removeAxis="removeClassAxis"></report-set-item>
                </el-form-item>
            </div>
            <!--过滤器-->
            <div class="config-data-item">
                <el-tooltip class="item" effect="dark" content="勾选数据字段至此处"
                            placement="left">
                    <div class="area-name clearfix"><span style="cursor: pointer"
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
                    :key="index"
                >
                    <report-set-item :moreMenu="vaItem.dataType === 'Number'"
                                     :reportType="item.reportType" :drillDown="false"
                                     :filter="true" :item="vaItem"
                                     :itemType="vaItem.itemType?vaItem.itemType:'measure'"
                                     @addFilters="showCondFiltersSet" :isFilter="true"
                                     @removeAxis="removeCondFilters"></report-set-item>
                </el-form-item>
            </div>
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
                    <div class="secondary-font-color" style="margin-top: 10px">主标题</div>
                    <div style="margin-bottom: 10px">
                        <el-input style="width: 90%" v-model="item.style.mainTitle"></el-input>
                        <el-color-picker v-model="item.style.mainTitleColor" show-alpha></el-color-picker>
                    </div>
                    <el-form-item label="备注">
                        <el-input style="width: 90%" v-model="item.style.titleRemark"></el-input>
                    </el-form-item>
                    <el-checkbox v-model="item.style.subtitleVisible">
                        展示链接跳转
                    </el-checkbox>
                    <el-form-item label="链接文案">
                        <el-input style="width: 90%" v-model="item.style.subtitleText"></el-input>
                    </el-form-item>
                    <el-form-item label="链接地址">
                        <el-input style="width: 90%" v-model="item.style.subtitleUrl"></el-input>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="样式配置" name="2">
                <el-form label-position="top" class="report-set-margin-let">
                    <el-form-item label="看板样式">
                        <el-radio v-model="item.style.kanbanStyle" :label="0">样式一</el-radio>
                        <el-radio v-model="item.style.kanbanStyle" :label="1">样式二</el-radio>
                    </el-form-item>
                    <el-form-item label="背景颜色">
                        <el-color-picker v-model="item.style.backgroundColor" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-form-item label="填充颜色" v-if="item.style.kanbanStyle===1">
                        <el-color-picker v-model="item.style.fillColor" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-form-item label="间隙大小" v-if="item.style.kanbanStyle===1">
                        <el-select v-model="item.style.gapSize" :popper-append-to-body="false" style="width: 35%">
                            <el-option v-for="option in Constants.gapSizeOptions"
                                       :key="option.value" :label="option.label"
                                       :value="option.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="边框颜色">
                        <el-color-picker v-model="item.style.borderColor" show-alpha></el-color-picker>
                    </el-form-item>
                    <el-form-item label="边框样式">
                        <el-select v-model="item.style.borderStyle" :popper-append-to-body="false" style="width: 35%">
                            <el-option v-for="option in Constants.borderStyleOptions"
                                       :key="option.value" :label="option.label"
                                       :value="option.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="边框大小">
                        <el-select v-model="item.style.borderWidth" :popper-append-to-body="false" style="width: 20%">
                            <el-option v-for="option in Constants.borderWidthOptions"
                                       :key="option.value" :label="option.label"
                                       :value="option.value"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="每行最多个数">
                        <el-input style="width: 20%" v-model="item.style.maxPerLineBlock"
                                  type="number"></el-input>
                    </el-form-item>
                    <el-checkbox v-model="item.style.fontSetVisible">
                        开启字体设置
                    </el-checkbox>
                    <el-form-item label="标签字体/颜色">
                        <el-select v-model="item.style.classLabelSize"
                                   :popper-append-to-body="false" style="width: 20%">
                            <el-option v-for="option in Constants.viceValueSizeOptions"
                                       :key="option.value" :label="option.label"
                                       :value="option.value"></el-option>
                        </el-select>
                        <el-color-picker v-model="item.style.classLabelColor" show-alpha></el-color-picker>
                    </el-form-item>
                    <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 1%">
                        <el-form-item label="主指标标签字体/颜色">
                            <el-select v-model="item.style.mainLabelSize"
                                       :popper-append-to-body="false" style="width: 35%">
                                <el-option v-for="option in Constants.viceValueSizeOptions"
                                           :key="option.value" :label="option.label"
                                           :value="option.value"></el-option>
                            </el-select>
                            <el-color-picker v-model="item.style.mainLabelColor" show-alpha></el-color-picker>
                        </el-form-item>
                        <el-form-item label="主指标数值字体/颜色">
                            <el-select v-model="item.style.mainValueSize"
                                       :popper-append-to-body="false" style="width: 35%">
                                <el-option v-for="option in Constants.mainValueSizeOptions"
                                           :key="option.value" :label="option.label"
                                           :value="option.value"></el-option>
                            </el-select>
                            <el-color-picker v-model="item.style.mainValueColor" show-alpha></el-color-picker>
                        </el-form-item>
                    </div>
                    <div style="display: flex;flex-direction: row;justify-content: space-between;margin-top: 1%">
                        <el-form-item label="副指标标签字体/颜色">
                            <el-select v-model="item.style.viceLabelSize"
                                       :popper-append-to-body="false" style="width: 35%">
                                <el-option v-for="option in Constants.viceValueSizeOptions"
                                           :key="option.value" :label="option.label"
                                           :value="option.value"></el-option>
                            </el-select>
                            <el-color-picker v-model="item.style.viceLabelColor" show-alpha></el-color-picker>
                        </el-form-item>
                        <el-form-item label="副指标数值字体/颜色">
                            <el-select v-model="item.style.viceValueSize"
                                       :popper-append-to-body="false" style="width: 35%">
                                <el-option v-for="option in Constants.viceValueSizeOptions"
                                           :key="option.value" :label="option.label"
                                           :value="option.value"></el-option>
                            </el-select>
                            <el-color-picker v-model="item.style.viceValueColor" show-alpha></el-color-picker>
                        </el-form-item>
                    </div>
                    <el-form-item label="主/副指标组合指标块内位置">
                        <el-radio v-model="item.style.kanbanPosition" :label="0">横向居左</el-radio>
                        <el-radio v-model="item.style.kanbanPosition" :label="1">横向居中</el-radio>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
            <el-collapse-item title="指标数据格式设置" name="3">
                <el-form label-position="top" class="report-set-margin-let">
                    <el-form-item style="margin-top: 5px">
                        <div class="secondary-font-color" v-if="!item.style.dataUnit || item.style.dataUnit.length===0">
                            暂无数据
                        </div>
                        <div v-for="(option,index) in item.style.dataUnit" :key="option.data.id"
                             style="display: flex;flex-direction: row;justify-content: flex-start;align-items: center">
                            <report-set-item :item="option.data"
                                             :drillDown="false" :moreMenu="false"
                                             :deleteItem="false" :showChar="false"
                                             itemType="measure" :isFilter="false"
                                             :filter="false" style="width: 35%"></report-set-item>
                            <span class="secondary-font-color" style="margin-left: 10px;margin-right: 5px">前缀</span>
                            <el-input style="width: 20%;" v-model="option.prefix"></el-input>
                            <span class="secondary-font-color" style="margin-left: 10px;margin-right: 5px">后缀</span>
                            <el-input style="width: 20%;" v-model="option.suffix"></el-input>
                        </div>
                    </el-form-item>
                </el-form>
            </el-collapse-item>
        </el-collapse>
    </section>
</template>

<script>
import ReportSetItem from "@/components/report/ReportSetItem";

export default {
    name: "KanbanWidgetSet",
    components: {ReportSetItem},
    created() {
        this.KHReportSet.initDataField(this);
    },
    props: {
        item: {required: true, type: Object},
        activeName: {required: true, type: String}
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
            dim: "dim"
        }
    },
    watch: {
        "item.data.valueAxis": {
            handler: function (val) {
                this.initDataUnit();
            },
            deep: true
        }
    },
    methods: {
        initDataUnit() {
            if (!this.item.style.hasOwnProperty('dataUnit')) {
                this.$set(this.item.style, 'dataUnit', []);
            }
            for (let i = 0; i < this.item.style.dataUnit.length; i++) {
                let dataUnitItem = this.item.style.dataUnit[i];
                let isExist = false;
                for (let j = 0; j < this.item.data.valueAxis.length; j++) {
                    let valueAxi = this.item.data.valueAxis[j];
                    if (valueAxi.hasOwnProperty('id')) {
                        if (dataUnitItem.data.id === valueAxi.id) {
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    this.item.style.dataUnit.splice(i, 1);
                    i--;
                }
            }
            for (let i = 0; i < this.item.data.valueAxis.length; i++) {
                let isExist = false;
                let valueAxi = this.item.data.valueAxis[i];
                for (let j = 0; j < this.item.style.dataUnit.length; j++) {
                    let dataUnitItem = this.item.style.dataUnit[j];
                    if (valueAxi.hasOwnProperty('id')) {
                        if (valueAxi.id === dataUnitItem.data.id) {
                            isExist = true;
                            break;
                        }
                    }
                }
                if (!isExist) {
                    if (this.item.data.valueAxis[i].hasOwnProperty('id')) {
                        let dataUnitItem = {};
                        this.$set(dataUnitItem, 'data', this.item.data.valueAxis[i]);
                        this.$set(dataUnitItem, 'prefix', '');
                        this.$set(dataUnitItem, 'suffix', '');
                        this.item.style.dataUnit.push(dataUnitItem);
                    }
                }
            }
        },
        // 打开过滤条件设置
        showCondFiltersSet(cond) {
            this.$emit("showCondFiltersSet", cond);
        },
        // 通知父组件打开选择维度和度量的界面
        showDimMeasureSelect() {
            this.$emit("showDimMeasureSelect", '过滤器');
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
