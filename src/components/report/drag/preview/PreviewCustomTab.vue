<template>
    <div style="height: 100%" onClick="event.cancelBubble = true">
        <el-tabs v-model="currentActiveTabId"
                 style="height: 100%;"
                 @tab-click="handleTabsClick"
                 :type="tabItem.style.tabType"
                 :tab-position="tabItem.style.tabPosition">
            <el-tab-pane
                onClick="event.cancelBubble = true"
                style="height: 100%"
                :key="et.tabId"
                v-for="(et, etIndex) in editableTabs"
                :label="et.tabName"
                :name="et.tabId">
                <div class="scrollBar" ref="scrollBar">
                <power-drag-child
                    v-if="et.tabId === currentActiveTabId"
                    :ref="'cyGridster'+tabPageWidgetId+et.tabId"
                    :your-list="et.tabContent.widgets"
                    :base-margin-left="baseMarginLeft"
                    :base-margin-top="baseMarginTop"
                    :base-width="baseWidth"
                    :base-height="baseHeight"
                    @onResize="dragResize"
                >
                    <template v-for="(item,index) in et.tabContent.widgets" :slot="'slot'+index">
                        <div class="dragHandle" :key="index" onClick="event.cancelBubble = true"
                             :style="[{'background-color':(item.backgroundColor ? item.backgroundColor : 'transparent' )},{border:(item.borderColor ? '1px solid '+item.borderColor : 'none' )},
                     {'padding':(typeof item.paddingTop === 'number'? item.paddingTop + 'px': '25px' )+' '+(typeof item.paddingRight === 'number' ? item.paddingRight  + 'px'  : '5px' )+' '+(typeof item.paddingBottom === 'number'? item.paddingBottom  + 'px': '5px' )+' '+(typeof item.paddingLeft === 'number' ? item.paddingLeft + 'px' : '5px')}]">
                            <!--左侧标题-->
                            <div class="tool-title">
                                <!--挂载菜单后不显示-->
                                <template v-if="item.style">
                                    <div class="caption" v-if="item.style.mainTitleVisiable"
                                         :style="{color:item.style.mainTitleColor}">{{item.style.mainTitle}}
                                    </div>
                                </template>
                                <template v-else>
                                    <div class="caption">{{item.name}}
                                    </div>
                                </template>
                            </div>
                            <!--指标看板-->
                            <template
                                v-if="item.type && item.type === 'reportWidget' && item.reportType === 'kanbanWidget'">
                                <kanban-widget :item="item" :ref="'kanbanWidget'+index"></kanban-widget>
                            </template>
                            <!--交叉表-->
                            <template
                                v-if="item.type && item.type === 'reportWidget' && item.reportType === 'tableReportWidget'">
                                <table-widget :item="item" :data="tableData" :ref="'tableWidget'+index" :reportId="reportId"
                                              style="height: 100%"></table-widget>
                            </template>
                            <!--查询控件-->
                            <template v-if="item.type && item.type === 'queryWidget'">
                                <query-widget :queryWidgetData="item"
                                              @queryReportData="queryByCustomCondition"></query-widget>
                            </template>
                            <!--文本控件-->
                            <template v-if="item.type && item.type === 'textWidget'">
                                <text-widget :textWidgetData="item" :isEdit="false"></text-widget>
                            </template>
                            <!--图片控件-->
                            <template v-if="item.type && item.type === 'imgWidget'">
                                <image-widget :imageWidgetData="item"></image-widget>
                            </template>
                            <!--内嵌页面-->
                            <template v-if="item.type && item.type === 'innerPageWidget'">
                                <iframe :src="item.src" width="100%" height="100%" style="border-width: 0;"></iframe>
                            </template>
                            <!--Charts  onClick="event.cancelBubble = true" 防止同时触发父组件点击事件-->
                            <template
                                v-if="item.type && item.type === 'reportWidget'&& item.reportType !== 'tableReportWidget' && item.reportType !== 'kanbanWidget'">
                                <ul v-if="item.data.superConds instanceof Array && item.data.superConds.length > 0"
                                    class="time-switcher">
                                    <li
                                        class="time-item"
                                        v-for="(dbBtn,index) in item.data.superConds"
                                        :key="index"
                                        :style="[{'background':(dbBtn.default ? (item.style.superConds ? item.style.superConds.selected.backgroundColor :'#0140ff') : (item.style.superConds?item.style.superConds.unselected.backgroundColor:'transparent'))},
                                {'font-size':(dbBtn.default ? (item.style.superConds ? item.style.superConds.selected.fontSize : '12px') : (item.style.superConds ? item.style.superConds.unselected.fontSize :'12px'))},
                                {'color':(dbBtn.default ? (item.style.superConds ? item.style.superConds.selected.fontColor:'#fff') : (item.style.superConds ? item.style.superConds.unselected.fontColor : '#fff'))}]"
                                        @click="queryBySuperConds(dbBtn,item)">{{dbBtn.alias}}
                                    </li>
                                </ul>
                                <div v-if="item" class="chart" :ref="'chart'+index" v-loading="item.chartLoading"
                                     onClick="event.cancelBubble = true">
                                </div>
                                <el-breadcrumb v-if="item.drillNavigation && item.drillNavigation.length > 0"
                                               style="position:absolute;bottom: 0" separator="">
                                    <el-breadcrumb-item v-for="(dc,key) in item.drillNavigation" :key="key">
                                        <a @click="handleBackSenior(item,index,key)"
                                           :style="[{'font-size':(item.style.drillNavigationFontSize ? item.style.drillNavigationFontSize : '12px' )},
                                   {color:(item.style.drillNavigationFontColor ? item.style.drillNavigationFontColor: 'black' )}]">{{dc.value}}</a>
                                        <i class="el-breadcrumb__separator el-icon-arrow-right" :style="[{'font-size':(item.style.drillNavigationFontSize ? item.style.drillNavigationFontSize : '12px' )},
                                   {color:(item.style.drillNavigationFontColor ? item.style.drillNavigationFontColor: 'black' )}]"></i>
                                    </el-breadcrumb-item>
                                </el-breadcrumb>
                            </template>
                        </div>
                    </template>
                </power-drag-child>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import drag from '@/components/report/drag/preview/PreviewTabDrag.vue';
    import QueryWidget from "@/components/report/queryWidget/QueryWidget.vue";
    import TextWidget from "@/components/report/textWidget/TextWidget.vue";
    import TableWidget from "@/components/report/tableWidget/TableWidget.vue";
    import ImgWidget from "@/components/report/imgWidget/ImgWidget.vue";
    import ConditionConfig from '@/components/report/conditions/ConditionConfig'
    import SqlEditor from '@/components/SqlEditor'
    import KanbanWidget from "@/components/report/kanbanWidget/KanbanWidget";

    let chartInstanceBox = {};
    const inv = [];
    export default {
        name: "PreviewCustomTab",
        created() {
            
        },
        props: {
            "editableTabs": {type: Array, required: true},
            "activeTabId": {type: String, required: true},
            "tabPageWidgetId": {type: Number, required: true},
            "tabItem": {type: Object, required: true},
            "reviewType": {type: String, required: false},
            "notifyTabQueryCustom": {type: Number, required: false},
            "tabQueryParam": {type: Array, required: false},
            "reportId": {type: String, required: true},
            "reportSet": {type: Object, required: true}
        },
        watch: {
            notifyTabQueryCustom: {
                deep: true,
                handler() {
                    let _this = this;
                    if (!_this.KHUtils.isNull(_this.tabQueryParam)) {
                        _this.queryByCustomCondition(_this.tabQueryParam, true);
                    }
                },
            }
        },
        data() {
            return {
                baseWidth: 0,
                baseHeight: 0,
                baseMarginLeft: 0,
                baseMarginTop: 0,
                currentActiveTabId: "0",
                drillNavigation: [],
                tableData: [],
                queryParams: [],
                resizeObserver:null
            };
        },
        components: {
            "query-widget": QueryWidget,
            "power-drag-child": drag,
            "image-widget": ImgWidget,
            "condition-config": ConditionConfig,
            "text-widget": TextWidget,
            "table-widget": TableWidget,
            "SqlEditor": SqlEditor,
            "kanban-widget": KanbanWidget
        },
        beforeDestroy() {
            this.resizeObserver.disconnect()
            // 清除计时器
            Object.keys(inv).forEach(function (k) {
                clearInterval(inv[k]);
            });
        },
        mounted() {
           
            this.currentActiveTabId = (this.tabItem.tabs instanceof Array && this.tabItem.tabs.length > 0) ? this.tabItem.tabs[0].tabId : "0";
            let _this = this;
            _this.initTabGrid();
           
            if(!this.resizeObserver){
                this.resizeObserver = new ResizeObserver(entries => {
                    //回调
                    this.dragResize();
                });
                //监听对应的dom
                if(this.$refs.scrollBar){
                    if(Array.isArray(this.$refs.scrollBar)){
                        this.$refs.scrollBar.forEach((scrollBar, index, array) => {
                            this.resizeObserver.observe(scrollBar);
                        }) 
                    }else{
                        this.resizeObserver.observe(this.$refs.scrollBar);
                    }
                }
            }

        },

        methods: {
            //监听window窗口变化
            async dragResize(){
                await this.WidgetHelper.initGridBaseTab(this,this.reportSet ? this.reportSet.version : null);
                let gridster = this.$refs["cyGridster" + this.tabPageWidgetId + this.currentActiveTabId];
                gridster[0].init();
                console.log('PreviewCustomTab.vue')
            },
            queryBySuperConds(dbBtn,item) {
                let _this = this;
                let column = _this.KHChart.splicingColumnSetNoIdWithTableName(dbBtn,_this);
                item.data.superConds.forEach(obj => {
                    let compareColumn = _this.KHChart.splicingColumnSetNoIdWithTableName(obj,_this);
                    obj.default = column === compareColumn;
                });
                if (_this.tabItem.tabs instanceof Array) {
                    _this.tabItem.tabs.forEach(tb => {
                        if (tb.tabId === _this.currentActiveTabId) {
                            _this.KHReport.commonQuery(item, _this, chartInstanceBox, tb.tabContent.widgets, true);
                        }
                    })
                }
            },
            // 根据选择的Tab页初始化Grid(定时刷新任务)
            async initTabGrid() {
				await this.WidgetHelper.initGridBaseTab(this,this.reportSet ? this.reportSet.version : null);  //屏幕适配，使得当前布局能在所有分辨率下适用
                let _this = this;
                let gridster = this.$refs["cyGridster" + _this.tabPageWidgetId + _this.currentActiveTabId]; //获取gridster实例
                if (gridster instanceof Array && gridster.length > 0) {
                    gridster[0].init();
                    let maxCell = gridster[0].getMaxCell();
                    if (_this.tabItem.tabs instanceof Array) {
                        _this.tabItem.tabs.forEach(tb => {
                            if (tb.tabId === _this.currentActiveTabId) {
                                _this.KHReport.initReportQueryCondtions(_this, tb.tabContent.widgets); // 初始化查询条件默认值
                                if (tb.tabContent.widgets instanceof Array && tb.tabContent.widgets.length > 0) {
                                    _this.currentSelectItem = tb.tabContent.widgets[0];
                                    _this.$emit("notifyCurrentItemChange", _this.currentSelectItem); // 切换Tab默认选中Tab的第一个控件
                                    tb.tabContent.widgets.forEach((obj, index) => {
                                        if(!(this.reportSet && this.reportSet.version == 1)){
                                             _this.WidgetHelper.recalItemPosition(obj, maxCell);   // 重新计算widget x/y/sizex/sizey
                                        }
                                        if (!_this.WidgetHelper.checkItem(_this, obj)) {
                                            return false;
                                        }
                                        if (obj.type === "textWidget" || obj.type === "imgWidget"
                                            || obj.type === "innerPageWidget" || obj.type === "queryWidget" || obj.type === 'tabPageWidget') {
                                            return false;
                                        }
                                        // 定时器(挂载菜单后执行)
                                        if (obj.sensior && obj.sensior.autoRefresh) {
                                            let countType = obj.sensior.countType;
                                            if ("minute" === countType) {
                                                let senconds = 60 * obj.sensior.count;
                                                _this.autoRefresh(obj, senconds, senconds, tb.tabContent.widgets);
                                            }
                                        }
                                        _this.KHReport.commonQuery(obj, _this, chartInstanceBox, tb.tabContent.widgets, true);
                                    })
                                }
                            }
                        })
                    }
                }
            },
            // Tab页签切换
            handleTabsClick() {
                let _this = this;
                setTimeout(() => {
                    _this.initTabGrid();
                }, 100);
            },
            // 定时任务刷新
            autoRefresh(obj, seconds, tempCount, widgets) {
                let _this = this;
                inv[obj.id] = setInterval(function () {
                    seconds = seconds - 1;
                    if (seconds === -1) {
                        seconds = tempCount;
                        _this.KHReport.commonQuery(obj, _this, chartInstanceBox, widgets, true);
                    }
                }, 1000)
            },
            // 自定义条件查询
            queryByCustomCondition(queryParams, innerOrOutter) {
                let _this = this;
                if (!innerOrOutter) {
                    //console.log("tab receive QueryWidget :" + JSON.stringify(queryParams));
                    _this.$emit("queryByCustomCondition", queryParams); // 在Tab内设置的查询条件起效于Tab页外的控件
                }
                let widgets = [];
                if (_this.tabItem.tabs instanceof Array) {
                    _this.tabItem.tabs.forEach(tb => {
                        if (tb.tabId === _this.currentActiveTabId) {
                            if (tb.tabContent.widgets instanceof Array && tb.tabContent.widgets.length > 0) {
                                widgets = tb.tabContent.widgets;
                            }
                        }
                    })
                }
                _this.KHReport.queryByCustomCondition(_this, queryParams, widgets, chartInstanceBox, true);
            },
            // Chart导航操作
            handleBackSenior(item, itemIndex, condIndex) {
                let _this = this;
                _this.KHReport.handleBackSenior(item, itemIndex, condIndex, _this, chartInstanceBox,true);
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import "@/assets/style/report/drag-power.scss";
    .scrollBar{
        height: 100%;
        width: 100%;
        position: relative;
        box-sizing: border-box;
        overflow:auto;
    }
    .dragAndResize {
        height: 100%;
    }

   ::v-deep .el-tabs__content {
        height:calc(100% - 55px);
    }
</style>
