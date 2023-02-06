<template>
    <div class="ReportTheme" id="chartVue">
        <!-- 页面新增 编辑 详情 自定义 -->
        <div id="FormPage"></div>
        <previewDrag id="FormDrag" ref="cyGridster" :your-list="myList" :baseMarginTop="baseMarginTop">
            <template v-for="(item,index) in myList" :slot="'slot'+index">
                <div class="dragHandle" style="overflow:auto;" :key="index" onClick="event.cancelBubble = true"
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
                    <template v-if="item.type && item.type === 'reportWidget' && item.reportType === 'kanbanWidget'">
                        <kanban-widget :item="item" :ref="'kanbanWidget'+index"></kanban-widget>
                    </template>
                    <!--交叉表-->
                    <template
                        v-if="item.type && item.type === 'reportWidget' && item.reportType === 'tableReportWidget'">
                        <table-widget :item="item" :data="tableData" :ref="'tableWidget'+index" :reportId="reportId" style="height: 100%"></table-widget>
                    </template>
                    <!--Tab标签页-->
                    <template v-if="item.type && item.type === 'tabPageWidget'">
                        <custom-tab :tab-page-widget-id="item.id"
                                    :active-tab-id="item.activeTabId"
                                    :editable-tabs="item.tabs"
                                    :tab-item="item"
                                    :review-type="reviewType"
                                    :notify-tab-query-custom="notifyTabQueryCustom"
                                    :tab-query-param="tabQueryParam"
                                    :report-id="reportId"
                                    :report-set="reportSet"
                                    @queryByCustomCondition="queryByCustomCondition"
                                    :baseMarginTop="baseMarginTop"
                        ></custom-tab>
                    </template>
                    <!--查询控件-->
                    <template v-if="item.type && item.type === 'queryWidget'">
                        <query-widget :queryWidgetData="item" @queryReportData="queryByCustomCondition"></query-widget>
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
                        <iframe :src="item.src" width="100%" height="100%" style="border-width: 0px"></iframe>
                    </template>
                    <!--Charts-->
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
                        <div class="chart" :ref="'chart'+index" v-loading="item.chartLoading"></div>
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
        </previewDrag>
    </div>
</template>

<script>
    let chartInstanceBox = {};
    import PreviewCustomTab from '@/components/report/drag/preview/PreviewCustomTab.vue';
    import QueryWidget from "@/components/report/queryWidget/QueryWidget.vue";
    import TextWidget from "@/components/report/textWidget/TextWidget.vue";
    import TableWidget from "@/components/report/tableWidget/TableWidget.vue";
    import ImgWidget from "@/components/report/imgWidget/ImgWidget.vue";
    import KanbanWidget from "@/components/report/kanbanWidget/KanbanWidget";
    import FormInnerPageBase from "@/components/form-design/restructure/innerPageWidget/FormInnerPageBase";
    import previewDrag from "@/components/report/drag/preview/PreviewDrag.vue"
    import "@/assets/theme/report/index.scss"
    const inv = [];
    export default {
        name: "ReportCustom",
        extends:FormInnerPageBase,

        mounted() {
            let _this = this;
            //有可能当前显示的组件是从内嵌页面过来的，不能通过路由获取reportId 避免造成死循环
            if(!_this.isInnerPage){
                let currentPath = _this.$router.currentRoute.path;
                currentPath = currentPath.replace(/^\s*|\s*$/g, "");
                _this.reportId = currentPath.substring(currentPath.lastIndexOf('/') + 1, currentPath.length);
                if (!_this.KHUtils.isNumber(_this.reportId)) {
                    _this.$notify.error({
                        title: '错误',
                        message: '当前路由不为字符串:' + currentPath
                    });
                    return false;
                }
            }else {
                _this.reportId = _this.innerPageReportId;
            }
            _this.initReportCustom();
        },
        beforeDestroy() {
            // 清除计时器
            Object.keys(inv).forEach(function (k) {
                clearInterval(inv[k]);
            });
        },
        data() {
            return {
                notifyTabQueryCustom: 0,
                tabQueryParam: [],
                reportSet: {},
                reviewType: "back",
                myList: [],
                reportId: null, // 报表id
                baseWidth: 0,
                baseHeight: 0,
                tableData: [],
                queryParams: [],
                baseMarginLeft: 0,
                baseMarginTop: 0,
            };
        },
        components: {
            "query-widget": QueryWidget,
            "custom-tab": PreviewCustomTab,
            "text-widget": TextWidget,
            "image-widget": ImgWidget,
            "table-widget": TableWidget,
            "kanban-widget": KanbanWidget,
            previewDrag
        },
        methods: {
            initReportCustom(){
                let _this = this;
                if(_this.KHUtils.isNull(_this.reportId)){
                    return false;
                }
                _this.$Get(_this.khConfig.api.getReportConf + "/" + _this.reportId).then(async res => {
                    if (res.errCode === 0) {
                        if (!_this.KHUtils.isNull(res.reportConf)) {
                            _this.reportSet = JSON.parse(res.reportConf.settingMeta);
                            if (_this.KHUtils.isNull(_this.reportSet)) {
                                /*  _this.$notify.warning({
                                 title: '警告',
                                 message: "报表ID(" + _this.reportId + "): 暂未进行相关的报表设计"
                                 });*/
                                return false;
                            }
                            if (!(_this.reportSet.widgets instanceof Array) || _this.reportSet.widgets.length === 0) {
                                return false;
                            }
                            await this.WidgetHelper.initGridBase(this,this.reportSet ? this.reportSet.version : null);
                            _this.myList = _this.reportSet.widgets;
                            _this.KHReport.initReportQueryCondtions(_this, _this.myList); // 初始化查询条件默认值
                            _this.myList.forEach(obj => {
                                if (obj.type === "textWidget" || obj.type === "imgWidget"
                                    || obj.type === "innerPageWidget" || obj.type === "queryWidget"
                                    || obj.type === 'tabPageWidget') {
                                    return false;
                                }
                                // 定时器(挂载菜单后执行)
                                if (obj.sensior && obj.sensior.autoRefresh) {
                                    let countType = obj.sensior.countType;
                                    if ("minute" === countType) {
                                        let senconds = 60 * obj.sensior.count;
                                        _this.autoRefresh(obj, senconds, senconds);
                                    }
                                }
                                _this.KHReport.commonQuery(obj, _this, chartInstanceBox, _this.myList, true);
                            });
                            let dom = document.getElementsByClassName("dragAndResize");
                            if (dom && dom[0] && dom[0].style) {
                                if (this.reportSet && this.reportSet.layout && this.reportSet.layout.style && this.reportSet.layout.style.backgroundColor) {
                                    dom[0].style.backgroundColor = this.reportSet.layout.style.backgroundColor;
                                }
                            }
                        } else {
                            /*  _this.$notify.warning({
                             title: '警告',
                             message: "报表ID(" + _this.reportId + "): 暂未进行相关的报表设计"
                             });*/
                        }
                        // setTimeout(() => {
                        //     this.dragResize() //重新渲染解决滚动条对宽度的影响
                        // }, 100);
                    }
                });
            },
            queryBySuperConds(dbBtn,item) {
                let _this = this;
                let column = _this.KHChart.splicingColumnSetNoIdWithTableName(dbBtn,_this);
                item.data.superConds.forEach(obj => {
                    let compareColumn = _this.KHChart.splicingColumnSetNoIdWithTableName(obj,_this);
                    obj.default = column === compareColumn;
                });
                _this.KHReport.commonQuery(item, _this, chartInstanceBox, _this.myList, true);
            },
            // 定时任务刷新
            autoRefresh(obj, seconds, tempCount) {
                let _this = this;
                inv[obj.id] = setInterval(function () {
                    seconds = seconds - 1;
                    if (seconds === -1) {
                        seconds = tempCount;
                        _this.KHReport.commonQuery(obj, _this, chartInstanceBox, _this.myList, true);
                    }
                }, 1000)
            },
            // 自定义条件查询
            queryByCustomCondition(queryParams) {
                let _this = this;
                _this.KHReport.queryByCustomCondition(_this, queryParams, _this.myList, chartInstanceBox, true);
            },
            // Chart导航操作
            handleBackSenior(item, itemIndex, condIndex) {
                let _this = this;
                _this.KHReport.handleBackSenior(item, itemIndex, condIndex, _this, chartInstanceBox,true);
            },
            triggerVue(params) {
                let _this = this;
                console.log("reportCustom:",params);
                _this.queryByCustomCondition(params);
            },
        },
    };
</script>

<style lang="scss" scoped>
    @import "@/assets/style/report/drag-power.scss";
</style>
