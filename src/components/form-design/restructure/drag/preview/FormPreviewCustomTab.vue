<template>
    <div style="height: 100%" onClick="event.cancelBubble = true">
        <el-tabs v-model="currentActiveTabId"
                 style="height: 100%;"
                 @tab-click="handleTabsClick"
                 :type="tabItem.style.tabType"
                 :tab-position="tabItem.style.tabPosition">
            <el-tab-pane
                onClick="event.cancelBubble = true"
                style="height: 100%;"
                :key="index"
                v-for="(et,index) in editableTabs"
                :label="et.tabName"
                :name="et.tabId">
                <div class="scrollBar" ref="scrollBar">
                <preview-drag
                    v-if="et.tabId === currentActiveTabId"
                    :ref="'cyGridster' + tabPageWidgetId + et.tabId"
                    :your-list="et.tabContent.widgets"
                    :baseMarginTop="baseMarginTop"
                >
                    <template v-for="(item, index) in et.tabContent.widgets"   :slot="'slot' + index">
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
                            <!--交叉表-->
                            <template
                                v-if="item.type && item.type === 'reportWidget' && item.reportType === 'tableReportWidget'">
                                <table-widget :item="item" :data="tableData" :ref="'tableWidget'+index" :formId="formId"
                                            :queryParams="queryParams" :isPreview="true"
                                            style="height: 100%"></table-widget>
                            </template>
                            <!--查询控件-->
                            <template v-if="item.type && item.type === 'queryWidget'">
                                <query-widget :formId="formId" :queryWidgetData="item"
                                            @queryFormConditions="queryByCustomCondition"></query-widget>
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
                                <form-inner-page-widget
                                    :pointerEvents="true"
                                    :currentFormId="formId"
                                    :widget="item"
                                    @queryByInnerPageParam="queryByInnerPageParam"
                                    style="width: 100%; height: 100%"
                                ></form-inner-page-widget>
                                <!-- <template v-if="item.innerType==='0'">
                                    <iframe :src="item.src" width="100%" height="100%" style="border-width: 0;"></iframe>
                                </template>
                                <template v-if="item.innerType==='1'">
                                    <component v-if="innerPageComponentHackSet" :is="customComponent"
                                            @queryByInnerPageParam="queryByInnerPageParam"></component>
                                </template> -->
                            </template>
                        </div>
                    </template>
                </preview-drag>
                </div>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import PreviewDrag from '@/components/form-design/restructure/drag/preview/PreviewDrag.vue';
    import QueryWidget from "@/components/form-design/restructure/queryWidget/FormQueryWidget.vue";
    import TextWidget from "@/components/form-design/restructure/textWidget/FormTextWidget.vue";
    import TableWidget from "@/components/form-design/restructure/tableWidget/FormTableWidget.vue";
    import ImgWidget from "@/components/form-design/restructure/imgWidget/FormImgWidget.vue";
    import FormInnerPageWidget from "@/components/form-design/restructure/innerPageWidget/FormInnerPageWidget.vue";
    const inv = [];
    export default {
        name: "PreviewCustomTab",
   
        created() {
            this.currentActiveTabId = (this.tabItem.tabs instanceof Array && this.tabItem.tabs.length > 0) ? this.tabItem.tabs[0].tabId : "0";
        },
        props: {
            "editableTabs": {type: Array, required: true},
            "activeTabId": {type: String, required: true},
            "tabPageWidgetId": {type: Number, required: true},
            "tabItem": {type: Object, required: true},
            "reviewType": {type: String, required: false},
            "notifyTabQueryCustom": {type: Number, required: false},
            "tabQueryParam": {type: Array, required: false},
            "formId": {type: Number, required: true},
            "sensorSettingsV2": {type: Object, required: true},
            baseMarginTop: {type: Number, required: true}
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
                customComponent: "",
                innerPageComponentHackSet: false,
                innerPageParam: [],
                currentActiveTabId: "0",
                tableData: [],
                queryParams: [],
            };
        },
        components: {
            "query-widget": QueryWidget,
            "preview-drag":PreviewDrag,
            "image-widget": ImgWidget,
            "text-widget": TextWidget,
            "table-widget": TableWidget,
            "form-inner-page-widget": FormInnerPageWidget,
        },
        beforeDestroy() {
            // 清除计时器
            Object.keys(inv).forEach(function (k) {
                clearInterval(inv[k]);
            });
        },
        mounted() {
            let _this = this;
            _this.initTabGrid();
        },
        methods: {
            // 根据内嵌页面嵌入自定义组件,传参查询
            queryByInnerPageParam(innerPageParam) {
                this.innerPageParam = innerPageParam;
                this.queryByCustomCondition(innerPageParam);
            },
            // 根据选择的Tab页初始化Grid(定时刷新任务)
            async initTabGrid() {
                let _this = this;
                if (_this.tabItem.tabs instanceof Array) {
                    _this.tabItem.tabs.forEach(tb => {
                        if (tb.tabId === _this.currentActiveTabId) {
                            _this.KHReport.initReportQueryCondtions(_this, tb.tabContent.widgets); // 初始化查询条件默认值
                            if (tb.tabContent.widgets instanceof Array && tb.tabContent.widgets.length > 0) {
                                _this.currentSelectItem = tb.tabContent.widgets[0];
                                _this.$emit("notifyCurrentItemChange", _this.currentSelectItem); // 切换Tab默认选中Tab的第一个控件
                                tb.tabContent.widgets.forEach((obj, index) => {
                                    if (obj.type === "innerPageWidget" && obj.innerType === "1") {
                                        let url = obj.src;
                                        let componentName = url.substring(url.lastIndexOf('/') + 1, url.length);
                                        _this.KHForm.registerComponent(componentName, url);
                                        _this.customComponent = componentName;
                                        _this.innerPageComponentHackSet = false;
                                        _this.$nextTick(() => {
                                            _this.innerPageComponentHackSet = true
                                        });
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
                                    // _this.KHReport.commonQuery(obj, _this, chartInstanceBox, tb.tabContent.widgets, true);
                                })
                            }
                        }
                    })
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
                        // _this.KHReport.commonQuery(obj, _this, chartInstanceBox, widgets, true);
                    }
                }, 1000)
            },
            // 自定义条件查询
            queryByCustomCondition(queryParams, innerOrOutter) {
                let _this = this;
                if (_this.innerPageParam instanceof Array && _this.innerPageParam.length > 0) {
                    if (queryParams instanceof Array) {
                        _this.innerPageParam.forEach(obj => {
                            queryParams.push(obj);
                        })
                    }
                }
                _this.queryParams = queryParams;
                if (!innerOrOutter) {
                    //console.log("tab receive QueryWidget :" + JSON.stringify(queryParams));
                    // _this.$emit("queryByCustomCondition", queryParams); // 在Tab内设置的查询条件起效于Tab页外的控件
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
                _this.KHForm.queryByCustomCondition(queryParams, widgets, _this);
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
