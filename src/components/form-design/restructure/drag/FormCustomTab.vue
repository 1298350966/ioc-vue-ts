<template>
    <div @click="handleItemClick2"  @mousedown.stop @resize="dragResize" style="height: 100%">
        <el-tabs v-model="currentActiveTabId"
                 editable
                 @edit="handleTabsEdit"
                 style="height: 100%;"
                 @tab-click="handleTabsClick"
                 :type="tabItem.style.tabType"
                 :tab-position="tabItem.style.tabPosition">
            <el-tab-pane
                style="height: 100%;width:100%"
                :key="et.tabId"
                v-for="(et, etIndex) in editableTabs"
                :label="et.tabName"
                :name="et.tabId">
                <div class="scrollBar" ref="cyGridster"  v-if="et.tabId === activeTabId">
                    <power-drag-child
                    :add-or-edit="addOrEdit"
                    :ref="'cyGridster'+tabPageWidgetId+et.tabId"
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
                    <template v-for="(item,index) in et.tabContent.widgets" :slot="'slot'+index">
                        <div class="dragHandle" :key="index" onClick="event.cancelBubble = true"
                             :style="[{'background-color':(item.backgroundColor ? item.backgroundColor : 'transparent' )},{border:(item.borderColor ? '1px solid '+item.borderColor : 'none' )},
                     {'padding':(typeof item.paddingTop === 'number'? item.paddingTop + 'px': '25px' )+' '+(typeof item.paddingRight === 'number' ? item.paddingRight  + 'px'  : '5px' )+' '+(typeof item.paddingBottom === 'number'? item.paddingBottom  + 'px': '5px' )+' '+(typeof item.paddingLeft === 'number' ? item.paddingLeft + 'px' : '5px')}]">
                            <!--????????????-->
                            <div class="tool-title">
                                <!--????????????????????????-->
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
                            <!--???????????????-->
                            <div class="tool">
                                <el-button type="text" icon="el-icon-edit" style="margin-right: 10px"
                                           @click.stop="editQueryWidget(item)"
                                           v-if="item.type && item.type === 'queryWidget'"></el-button>
                                <el-dropdown @command="handleCommand">
                                  <span class="el-dropdown-link">
                                    <i class="el-icon-more el-icon--right"></i>
                                  </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item icon="el-icon-delete-solid"
                                                          :command="beforeHandleCommand(item,index,'delete')">??????
                                        </el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>
                            </div>
                            <!--??????-->
                            <template
                                v-if="item.type && item.type === 'reportWidget' && item.reportType === 'tableReportWidget'">
                                <table-widget :item="item" :data="tableData" :ref="'tableWidget'+index" :formId="formId"
                                              :queryParams="queryParams"
                                              style="height: 100%"></table-widget>
                            </template>
                            <!--????????????-->
                            <template v-if="item.type && item.type === 'queryWidget'">
                                <query-widget :formId="formId" :queryWidgetData="item"  :formConfig="formConfig"
                                              @queryFormConditions="queryByCustomCondition"></query-widget>
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
                                <form-inner-page-widget
                                    v-if="innerPageComponentHackSet"
                                    :pointerEvents="true"
                                    :currentFormId="formId"
                                    :widget="item"
                                    @queryByInnerPageParam="queryByInnerPageParam"
                                    style="width: 100%; height: 100%"
                                ></form-inner-page-widget>
                                <!-- <template v-if="item.innerType==='0'">
                                    <iframe :src="item.src" width="100%" height="100%" style="border-width: 0; pointer-events:none;height:calc(100% - 3px);"></iframe>
                                </template>
                                <template v-if="item.innerType==='1'">
                                    <component v-if="innerPageComponentHackSet" :is="customComponent"
                                               @queryByInnerPageParam="queryByInnerPageParam"></component>
                                </template> -->
                            </template>
                        </div>
                    </template>
                </power-drag-child>
                </div>
            </el-tab-pane>
        </el-tabs>
        <el-dialog :visible.sync="conditionVisible" v-if="conditionVisible" :modal="false" width="85%">
            <condition-config :widgets="tabWidgets" @closeCondition="conditionVisible = false"
                              :formConfig="formConfig" :queryId="queryId"></condition-config>
        </el-dialog>
    </div>
</template>

<script>
    import drag from '@/components/form-design/restructure/drag/FormTabDrag.vue';
    import QueryWidget from "@/components/form-design/restructure/queryWidget/FormQueryWidget.vue";
    import TextWidget from "@/components/form-design/restructure/textWidget/FormTextWidget.vue";
    import TableWidget from "@/components/form-design/restructure/tableWidget/FormTableWidget.vue";
    import ImgWidget from "@/components/form-design/restructure/imgWidget/FormImgWidget.vue";
    import CustomTab from '@/components/form-design/restructure/drag/FormCustomTab.vue';
    import ConditionConfig from '@/components/form-design/restructure/conditions/FormConditionConfig'
    import FormInnerPageWidget from "@/components/form-design/restructure/innerPageWidget/FormInnerPageWidget.vue";
    let chartInstanceBox = {};
    export default {
        name: "CustomTab",
        created() {
            
            this.$watch(
                function () { // ???????????????????????????????????????????????????????????????return????????????
                    let tempIndex = 0;
                    if (this.editableTabs instanceof Array) {
                        this.editableTabs.forEach((tb, index) => {
                            if (tb.tabId === this.activeTabId) {
                                tempIndex = index;
                            }
                        })
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
                function () { // ???????????????????????????????????????????????????????????????return????????????
                    if (this.tabItem.style.tabType) {
                        return this.tabItem.style.tabType;
                    }
                },
                function (oldVal, newVal) {
                    this.initTabGrid();
                }
            );
            this.$watch(
                function () { // ???????????????????????????????????????????????????????????????return????????????
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
            "editableTabs": {type: Array, required: true},
            "activeTabId": {type: String, required: true},
            "tabPageWidgetId": {type: Number, required: true},
            "formId": {type: Number, required: true},
            "tabItem": {type: Object, required: true},
            "widgetType": {type: String, required: true},
            "notifyTabQuery": {type: Number, required: false},
            "notifyCancelSelected": {type: Number, required: false},
            "notifyTabQueryCustom": {type: Number, required: false},
            "tabQueryParam": {type: Array, required: false},
            "baseSet": {required: false, type: Object},
            "formConfig": {type: Object},
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
                        _this.tabItem.tabs.forEach(tb => {
                            if (tb.tabId === _this.currentActiveTabId) {
                                // _this.KHReport.commonQuery(_this.currentSelectItem, _this, chartInstanceBox, tb.tabContent.widgets, false);
                                if (tb.tabContent && tb.tabContent.widgets instanceof Array && tb.tabContent.widgets.length > 0) {
                                    let currentSelectItemIndex = 0; // ???????????????????????????
                                    tb.tabContent.widgets.forEach((ml, index) => {
                                        if (ml.type === "innerPageWidget" && ml.innerType === "1") {
                                            let url = ml.src;
                                            let componentName = url.substring(url.lastIndexOf('/') + 1, url.length);
                                            _this.KHForm.registerComponent(componentName, url);
                                            _this.customComponent = componentName;
                                       
                                        }
                                        _this.innerPageComponentHackSet = false;
                                        _this.$nextTick(() => {
                                            _this.innerPageComponentHackSet = true
                                        });
                                        if (ml.id === _this.currentSelectItem.id) {
                                            currentSelectItemIndex = index;
                                        }
                                    });
                                    console.log(currentSelectItemIndex);
                                    _this.$refs["tableWidget" + currentSelectItemIndex][0].renderTable();
                                }
                            }
                        })
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
                customComponent: "",
                innerPageComponentHackSet: true,
                innerPageParam: [],
                baseWidth: 0,
                baseHeight: 0,
                baseMarginLeft: 0,
                baseMarginTop: 0,
                currentActiveTabId: "0",
                addOrEdit: true, // ??????????????????
                currentSelectItem: {}, // ?????????????????????
                tdLoading: false,
                tableData: [],
                conditionVisible: false,
                queryId: "",
                queryParams: [],
                seriesData: [],
                refreshTextWidget: true,
                refreshSqlEditor: true,
                tabWidgets: [], // ??????Tab????????????
                tabIndex: 1,
                resizeObserver:null
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
            "form-inner-page-widget": FormInnerPageWidget,
        },
        mounted() {
            let _this = this;
            _this.initTabGrid();
            if(!this.resizeObserver){
                this.resizeObserver = new ResizeObserver(entries => {
                    //??????
                    this.dragResize();
                });
                //???????????????dom
                if(this.$refs.cyGridster){
                    if(Array.isArray(this.$refs.cyGridster)){
                        this.$refs.cyGridster.forEach((cyGridster, index, array) => {
                            this.resizeObserver.observe(cyGridster);
                        }) 
                    }else{
                        this.resizeObserver.observe(this.$refs.cyGridster);
                    }
                }
            }
        },
        beforeDestroy(){
            this.resizeObserver.disconnect()
        },
        methods: {
            //??????window????????????
            async dragResize(){
                await this.FormWidgetHelper.initGridBaseDesign(this);
                let gridster = this.$refs["cyGridster" + this.tabPageWidgetId + this.currentActiveTabId]; //??????gridster??????
                gridster[0].init()
                console.log("FormCustomTab.vue");
            },
            // ???????????????????????????????????????,????????????
            queryByInnerPageParam(innerPageParam) {
                this.innerPageParam = innerPageParam;
                this.queryByCustomCondition(innerPageParam);
            },
            // ???????????????Tab????????????Grid
            async initTabGrid() {
                await this.FormWidgetHelper.initGridBaseDesign(this);  //???????????????????????????????????????????????????????????????
                let _this = this;
                let gridster = this.$refs["cyGridster" + _this.tabPageWidgetId + _this.currentActiveTabId]; //??????gridster??????
                if (gridster instanceof Array && gridster.length > 0) {
                    gridster[0].init();
                    if (_this.tabItem.tabs instanceof Array) {
                        _this.tabItem.tabs.forEach(tb => {
                            if (tb.tabId === _this.currentActiveTabId) {
                                _this.KHReport.initReportQueryCondtions(_this, tb.tabContent.widgets); // ??????????????????????????????
                                if (tb.tabContent.widgets instanceof Array && tb.tabContent.widgets.length > 0) {
                                    _this.currentSelectItem = tb.tabContent.widgets[0];
                                    _this.$emit("notifyCurrentItemChange", _this.currentSelectItem); // ??????Tab????????????Tab??????????????????
                                    tb.tabContent.widgets.forEach((obj, index) => {
                                        if (obj.type === "innerPageWidget"  && obj.innerType === "1") {
                                            let url = obj.src;
                                            let componentName = url.substring(url.lastIndexOf('/') + 1, url.length);
                                            _this.KHForm.registerComponent(componentName, url);
                                            _this.customComponent = componentName;
                                            _this.innerPageComponentHackSet = false;
                                            _this.$nextTick(() => {
                                                _this.innerPageComponentHackSet = true
                                            });
                                            return false;
                                        }
                                        if (!_this.WidgetHelper.checkItem(_this, obj)) {
                                            return false;
                                        }
                                        //_this.KHReport.commonQuery(obj, _this, chartInstanceBox, tb.tabContent.widgets, false);
                                    })
                                }
                            }
                        })
                    }
                }
                // setTimeout(()=>{
                //     this.dragResize()
                // },100)
            },
            // ?????????????????????
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
                    // console.log("tab receive QueryWidget :" + JSON.stringify(queryParams));
                    //_this.$emit("queryByCustomCondition", queryParams); // ???Tab?????????????????????????????????Tab???????????????
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
            // Chart????????????
            handleBackSenior(item, itemIndex, condIndex) {
                let _this = this;
                _this.KHReport.handleBackSenior(item, itemIndex, condIndex, _this, chartInstanceBox, false);
            },
            // ?????????????????????????????????
            handleTabsClick(e) {
                let _this = this;
                this.$emit("stopDragEvent");
                setTimeout(() => {
                    _this.initTabGrid();
                }, 100);
            },
            // ????????????
            addInnerWidget() {
                let _this = this;
                let gridsters = _this.$refs["cyGridster" + _this.tabPageWidgetId + _this.currentActiveTabId]; //??????gridster??????
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
                _this.tabItem.tabs.forEach(tb => {
                    if (tb.tabId === _this.currentActiveTabId) {
                        tb.tabContent.widgets.forEach((obj) => {
                            obj.showMoreOptVisible = false;
                        });
                        let cal = _this.FormWidgetHelper.calItemPosition(tb.tabContent.widgets, _this, maxCell, sizeX)
                        if (!_this.KHUtils.isNull(cal)) {
                            gridX = cal.gridX;
                            gridY = cal.gridY;
                        }
                    }
                });
                
                _this.FormWidgetHelper.addWidget(_this, gridster, gridX, gridY, sizeX, sizeY, false);
            },
            // ????????????
            deleteItem(index) {
                let _this = this;
                let gridster = _this.$refs["cyGridster" + _this.tabPageWidgetId + _this.currentActiveTabId]; //??????gridster??????
                gridster[0].removeItem(index);
                if (chartInstanceBox["chart" + index]) {
                    chartInstanceBox["chart" + index].destroy();              //????????????this.myList???index?????????item??????{}????????????????????????vue??????????????????v-for???
                    //????????????????????????????????????????????????????????????????????????????????????v-if???????????????????????????highchart?????????????????????chartInstance.$destroy()
                }
                _this.currentSelectItem = null;
                _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
            },
            // ??????Tab?????????
            handleTabsEdit(targetName, action) {
                if (action === 'add') {
                    let newTab = {
                        remark: "",
                        tabId: ++this.tabIndex + '',
                        tabName: 'New Tab',
                        widgetCount: 0,  // ??????????????????????????????
                        tabContent: {
                            layout: {
                                rows: [
                                    {
                                        columns: [
                                            {
                                                widgetId: ""
                                            }
                                        ]
                                    }
                                ],
                                style: {}
                            },
                            widgets: []
                        }
                    };
                    this.tabItem.tabs.push(newTab);
                    this.tabItem.activeTabId = newTab.tabId;
                    this.currentActiveTabId = this.tabItem.activeTabId;
                }
                if (action === 'remove') {
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
                    let tempArray = tabs.filter(tab => tab.tabId !== targetName);
                    if (tempArray.length === 0) {
                        this.$message.warning("??????????????????Tab???");
                        return false;
                    }
                    this.tabItem.tabs = tempArray;
                    this.currentActiveTabId = this.tabItem.activeTabId;
                }
                setTimeout(() => {
                    let gridster = this.$refs["cyGridster" + this.tabPageWidgetId + this.currentActiveTabId]; //??????gridster??????
                    if (gridster instanceof Array && gridster.length > 0) {
                        gridster[0].init();
                    }
                }, 100)
            },
            // ?????????????????????
            editQueryWidget(item) {
                let _this = this;
                _this.conditionVisible = true;
                if (_this.tabItem && _this.tabItem.tabs instanceof Array) {
                    _this.tabItem.tabs.forEach(tb => {
                        if (tb.tabId === _this.currentActiveTabId) {
                            if (tb.tabContent.widgets instanceof Array && tb.tabContent.widgets.length > 0) {
                                _this.tabWidgets = _this.tabItem.tabs[_this.currentActiveTabId].tabContent.widgets;
                            }
                        }
                    });
                }
                _this.queryId = item.id;
                _this.currentSelectItem = item;
            },
            beforeHandleCommand(item, index, command) {
                return {
                    'item': item,
                    'index': index,
                    'command': command
                }
            },
            handleCommand(obj) {
                let _this = this;
                let index = obj.index;
                let command = obj.command;
                if (command === 'delete') {
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
            handleItemClick2(){
                this.addOrEdit = false;
                this.currentSelectItem = null;
                this.$emit("notifyCurrentItemChange", this.tabItem);
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
    @import "@/assets/style/form/drag-power.scss";
    .scrollBar{
        height: 100%;
        width: 100%;
        position: relative;
        box-sizing: border-box;
        overflow:auto;
    }
    .dragAndResize {
        height: 100%;
        //background-color: #EBEAEF;
    }
    
    ::v-deep .el-tabs__content {
        height:calc(100% - 55px);
    }
</style>
