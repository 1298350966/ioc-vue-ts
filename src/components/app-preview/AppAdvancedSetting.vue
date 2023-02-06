<template>
    <el-row class="report-design" style="height: calc(100% - 30px)">
        <div class="main">
            <div class="main-page animated watermark">
                <div class="main-app" >
                    <el-radio-group v-model="previewType" size="small" style="float: right;margin-top: 5px">
                        <el-radio-button label="0" >PC端</el-radio-button>
                        <el-radio-button label="1">APP</el-radio-button>
                    </el-radio-group>
                </div>
                <div class="drag-container">
                     <app-preview :formConfig="formConfig"  :cols-array="colsArray" style="width: 100%;height: 100%"
                                  :reviewAppEventListen="reviewAppEventListen" :formId="formId" :appSensorSettings="formConfig.appSensorSettings"></app-preview>
                </div>
            </div>
            <div class="main-operation">
                <div class="main-data">
                    <app-advanced-widget-set v-if="advancedWidgetHackSet"
                                         :formConfig="formConfig"
                                         :formName="formName"
                                         :cols-array="colsArray"
                                         :formList="formList"
                                         :item="formConfig.appSensorSettings"
                                         @refreshApp="refreshApp"
                                            >
                    </app-advanced-widget-set>
                </div>
            </div>
        </div>
        <el-dialog title="添加主题" :visible.sync="themeDialogVisible" :modal="false" custom-class="add-theme-dialog" :append-to-body="true">
            <el-form :model="themeInfo" label-width="120px">
                <el-form-item label="主题名称">
                    <el-input v-model="themeInfo.themeName" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="themeDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTheme" :loading="themeLoading">确 定</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import DragPower from "@/components/form-design/restructure/drag/FormDragPower";
    import AppAdvancedWidgetSet from "@/components/app-preview/AppAdvancedWidgetSet";
    import AppPreview from "@/components/app-preview/AppPreview";
    import widgetTypeItems from "@/utils/form/advancedSetting.config.js";
    import Draggable from "vuedraggable";

    export default {
        name: "AppAdvancedSetting",
        components: {AppAdvancedWidgetSet, Draggable, DragPower,AppPreview},
        props: {
            formConfig: {
                required: false
            },
            formId: {
                type: Number,
                required: true
            },
            formName: {
                type: String,
                required: false
            },
            notifySave: {
                type: Number,
                required: false
            },
            advancedSettingType:{
                type:String,
                required:true
            }
        },
        watch: {
            notifySave: {
                deep: true,
                handler() {
                    this.saveAdvancedSetting();
                }
            },
            advancedSettingType: {
                deep: true,
                handler() {
                  // this.previewType =  this.advancedSettingType;
                }
            },
            previewType: {
                deep: true,
                handler() {
                    if(this.previewType === "0"){
                        this.$emit("previewChange", "0")
                    }

                }
            },

        },
        created() {
            let _this = this;
            if (_this.KHUtils.isNull(_this.formConfig)) {
                return false;
            }
            if (!_this.formConfig) {

                return false;
            }
            if (!_this.formConfig.list) {
                return false;
            }
            _this.listFormConf();
            _this.colsArray = [];
            _this.formConfig.list.forEach(val => {
                if (val.type === 'grid') {
                    loop(val, _this);
                } else {
                    if (val.type === 'data_select' || val.type === 'org_select'
                        || val.type === 'user_select'
                        || val.type === 'company_select'
                        || val.type === 'role_select'
                        || val.type === 'dic_select'
                        || val.type === 'current_user') {
                        _this.KHForm.processDataSourceControl(val, _this.colsArray, _this);
                    } else if (val.type === 'gis_select') {
                        _this.KHForm.processGisControl(val, _this.colsArray, _this);
                    } else if (val.type === 'region_select') {
                        _this.KHForm.processRegionControl(val, _this.colsArray, _this);
                    } else {
                        let temp = _this.KHUtils.clone(val);
                        if (temp.type === 'radio' || temp.type === 'select') {
                            // 查询条件设置,取消关联控件的设置
                            if (temp.options.options) {
                                if (temp.options.options instanceof Array) {
                                    temp.options.options.forEach(obj => {
                                        if (obj.relatedList) {
                                            obj.relatedList = [];
                                        }
                                    })
                                }
                            }
                        }
                        _this.colsArray.push(temp);
                    }
                }
            });
            _this.colsArray.push({
                type:"datetime",
                key: 'create_time',
                model: 'create_time',
                name: '创建时间',
                alias: '创建时间',
                isJump: false
            })
            _this.colsArray.push({
                type:"datetime",
                key: 'last_update_time',
                model: 'last_update_time',
                name: '更新时间',
                alias: '更新时间',
                isJump: false
            })
            _this.colsArray.push({
                type:"input",
                key: 'last_update_user_id',
                model: 'last_update_user_id',
                name: '更新人ID',
            })
            _this.colsArray.push({
                type:"input",
                key: 'last_update_user_name',
                model: 'last_update_user_name',
                name: '更新人',
            })
            _this.colsArray.push({
                type:"input",
                key: 'user_id',
                model: 'user_id',
                name: '创建人ID',
            })
            _this.colsArray.push({
                type:"input",
                key: 'user_name',
                model: 'user_name',
                name: '创建人',
            })
            _this.colsArray.push({
                type:"input",
                key: 'real_name',
                model: 'real_name',
                name: '创建人真实姓名',
            })
            function loop(obj, _this) {
                if (obj.columns) {
                    obj.columns.forEach(cs => {
                        cs.list.forEach(ls => {
                            if (ls.type === 'data_select' || ls.type === 'org_select'
                                || ls.type === 'user_select'
                                || ls.type === 'company_select'
                                || ls.type === 'role_select'
                                || ls.type === 'dic_select') {
                                _this.KHForm.processDataSourceControl(ls, _this.colsArray, _this);
                            } else if (ls.type === 'gis_select') {
                                _this.KHForm.processGisControl(ls, _this.colsArray, _this);
                            } else if (ls.type === 'region_select') {
                                _this.KHForm.processRegionControl(ls, _this.colsArray, _this);
                            } else {
                                let temp = _this.KHUtils.clone(ls);
                                if (temp.type === 'radio' || temp.type === 'select') {
                                    // 查询条件设置,取消关联控件的设置
                                    if (temp.options.options) {
                                        if (temp.options.options instanceof Array) {
                                            temp.options.options.forEach(obj => {
                                                if (obj.relatedList) {
                                                    obj.relatedList = [];
                                                }
                                            })
                                        }
                                    }
                                }
                                _this.colsArray.push(temp);
                            }
                            if (ls.columns) {
                                loop(ls, _this);
                            }
                        })
                    })
                }
            }

            if (!_this.formConfig.appSensorSettings) {
                _this.formConfig.appSensorSettings = _this.appSensorSettings
            }


        },
        data() {
            return {
                title: "",
                formList: [], // 所有表单配置集合
                colsArray: "", // 所有拖拽表单字段集合
                editFormVisible: true,
                widgetTypeItems: widgetTypeItems,
                widgetType: "",
                addWidgetEventListen: 0,
                reviewWidgetEventListen: 0,
                reviewAppEventListen:0,
                currentSelectItem: null,
                advancedWidgetHackSet: true,
                appSensorSettings: {
                    queryCondition: {
                      placeholder: "",
                      conditions: [],
                        enumConditions:[],
                    },
                    "tableItem":{
                        "cols":[],
                        "title":[],
                        "rightTop": [],
                        "leftBottom":[],
                        "rightBottom": [],
                        "condFilters":[],
                        "querySort":[]
                    }
                },
                saveLoading: false,
                themeDialogVisible: false,
                themeInfo: {
                    themeName: "",
                    themeMeta: {
                        widgetsStyle: []
                    },
                    type: 0
                },
                themeMaps: [],
                themeLoading: false,
                themeMeta: {},
                previewType:"1"
            };
        },
        mounted() {
            let _this = this;
            _this.title = "高级设置 - " + _this.formName;
            //获取主题
            _this.themeMeta = {};
            if (_this.formConfig.sensorSettingsV2 && _this.formConfig.sensorSettingsV2.themeId && !_this.KHUtils.isNull(_this.formConfig.sensorSettingsV2.themeId)) {
                this.$Get(this.khConfig.api.queryThemeMeta + "/" + _this.formConfig.sensorSettingsV2.themeId).then(res => {
                    if (res.errCode === 0) {
                        _this.themeMeta = JSON.parse(res.themeMeta);
                    }
                });
            }
            //默认自动新增一个表单控件
            if(_this.formConfig.sensorSettingsV2 && _this.formConfig.sensorSettingsV2.widgets instanceof Array && _this.formConfig.sensorSettingsV2.widgets.length == 0){
                _this.addTableWidget();
            }

        },
        methods: {
            //默认新增表单控件
            addTableWidget(){
                let _this = this;
                _this.addDragPowerClickListen("tableReportWidget");
                //自动添加列
                setTimeout(() => {
                    if(_this.formConfig.sensorSettingsV2.widgets instanceof Array && _this.formConfig.sensorSettingsV2.widgets.length >0){
                        _this.formConfig.sensorSettingsV2.widgets.forEach((widget,index)=>{
                            if(widget.reportType === "tableReportWidget"){
                                if(_this.colsArray instanceof Array && _this.colsArray.length >0){
                                    let seqObj = {
                                        "key":"$seq",
                                        "name":"序号",
                                        "alias":"序号",
                                        "isJump":false,
                                    };
                                    widget.data.cols.push(seqObj);
                                    _this.colsArray.forEach((col,colKey)=>{
                                        //剔除子表单
                                        if(col.type != "table"){
                                            let newObj = {};
                                            newObj.key = col.model;
                                            newObj.name = col.name;
                                            newObj.alias = col.name;
                                            newObj.isJump = false;
                                            widget.data.cols.push(newObj);
                                        }


                                    });
                                    let optObj = {
                                        "key":"$opt",
                                        "name":"操作",
                                        "alias":"操作",
                                        "isJump":false
                                    };
                                    widget.data.cols.push(optObj);
                                }

                            }
                        })
                        //刷新
                        _this.reviewItem();
                        this.$message({
                            message: '默认新增表格！',
                            type: 'success'
                        });
                    }
                }, 100);

            },
            //刷新主题
            refreshTheme(themeId, themeMeta) {
                let _this = this;
                _this.themeMeta = {};
                _this.themeMeta = themeMeta;
                _this.formConfig.sensorSettingsV2.themeId = themeId;
                let widgetsStyle = themeMeta.widgetsStyle;
                let layout = _this.formConfig.sensorSettingsV2.layout;
                if (themeMeta.verticalSpacing) {
                    layout.style.verticalSpacing = themeMeta.verticalSpacing;
                }
                if (themeMeta.backgroundColor) {
                    _this.$set(layout.style, 'backgroundColor', themeMeta.backgroundColor);
                }
                if (widgetsStyle instanceof Array && widgetsStyle.length > 0) {
                    let widgets = _this.formConfig.sensorSettingsV2.widgets;
                    if (widgets instanceof Array && widgets.length > 0) {
                        _this.updateThemeStyle(widgets, widgetsStyle);
                    }
                }

            },
            updateThemeStyle(widgets, widgetsStyle) {
                let _this = this;
                for (var i = 0; i < widgets.length; i++) {
                    let widget = widgets[i];
                    let type = widget.type;
                    if (type === "reportWidget") {
                        type = widget.reportType;
                    }

                    let themeStyle = _this.findWidgetStyle(type, widgetsStyle);
                    if (themeStyle && !_this.KHUtils.isNull(themeStyle)) {
                        widget.paddingTop = themeStyle.paddingTop;
                        widget.paddingRight = themeStyle.paddingRight;
                        widget.paddingBottom = themeStyle.paddingBottom;
                        widget.paddingLeft = themeStyle.paddingLeft;
                        widget.borderColor = themeStyle.borderColor;
                        widget.backgroundColor = themeStyle.backgroundColor;
                        widget.style = themeStyle.style
                    }
                    if (type === "tabPageWidget") {
                        if (widget.tabs instanceof Array && widget.tabs.length > 0) {
                            widget.tabs.forEach((tab, index) => {
                                if (tab.tabContent.widgets instanceof Array && tab.tabContent.widgets.length > 0) {
                                    _this.updateThemeStyle(tab.tabContent.widgets, widgetsStyle);
                                }
                            })
                        }
                    }
                }
            },
            findWidgetStyle(type, widgetsStyle) {
                let style = null;
                if (widgetsStyle instanceof Array && widgetsStyle.length > 0) {
                    widgetsStyle.forEach((item, index) => {
                        if (item.widgetType === type) {
                            style = item;
                            return style;
                        }
                    })
                }
                return style;
            },
            addTheme() {
                let _this = this;
                _this.themeInfo = {
                    themeName: "",
                    themeMeta: {
                        widgetsStyle: []
                    },
                    type: 0
                }
                _this.themeDialogVisible = true;


            },
            resetTheme(){
                let _this = this;
                let layout = _this.formConfig.sensorSettingsV2.layout;
                layout.style.verticalSpacing = 5;
                _this.$set(layout.style, 'backgroundColor', null);
                let widgets = _this.formConfig.sensorSettingsV2.widgets;
                if (widgets instanceof Array && widgets.length > 0) {
                    _this.resetWidgetTheme(widgets);
                }
                _this.themeMeta = {};

            },
            resetWidgetTheme(widgets){
                let _this = this;
                for (var i = 0; i < widgets.length; i++) {
                    let widget = widgets[i];
                    let type = widget.type;
                    if (type === "reportWidget") {
                        type = widget.reportType;
                    }

                    widget.paddingTop = 25;
                    widget.paddingRight = 5;
                    widget.paddingBottom =5;
                    widget.paddingLeft = 5;
                    widget.borderColor = null;
                    widget.backgroundColor = null;
                     let style =  this.FormWidgetHelper.getWidgetInitStyle(type,_this);
                     if(!_this.KHUtils.isNull(style)){
                         widget.style = style;

                     }


                    if (type === "tabPageWidget") {
                        if (widget.tabs instanceof Array && widget.tabs.length > 0) {
                            widget.tabs.forEach((tab, index) => {
                                if (tab.tabContent.widgets instanceof Array && tab.tabContent.widgets.length > 0) {
                                    _this.resetWidgetTheme(tab.tabContent.widgets);
                                }
                            })
                        }
                    }
                }
            },
            saveTheme() {
                let _this = this;
                _this.themeMaps = []
                let widgets = _this.formConfig.sensorSettingsV2.widgets;
                if (widgets instanceof Array && widgets.length > 0) {
                    let layout = _this.formConfig.sensorSettingsV2.layout;
                    if (layout.style && layout.style.verticalSpacing) {
                        _this.themeInfo.themeMeta.verticalSpacing = layout.style.verticalSpacing;
                    }
                    if (layout.style && layout.style.backgroundColor) {
                        _this.themeInfo.themeMeta.backgroundColor = layout.style.backgroundColor;
                    }
                    _this.convertThemeInfo(widgets);
                    _this.themeLoading = true;
                    _this.$PostJson(this.khConfig.api.addTheme, _this.themeInfo).then(res => {
                        _this.themeDialogVisible = false;
                        _this.themeLoading = false;
                        if (res.errCode === 0) {
                            this.$notify({
                                title: '成功',
                                message: '主题保存成功',
                                type: 'success'
                            });


                        } else {

                        }
                    }).catch((e) => {
                        _this.themeDialogVisible = false;
                        _this.themeLoading = false;
                        console.log(e);
                    });

                } else {
                    this.$message({
                        message: '未找到任何控件',
                        type: 'warning'
                    });
                }

            },
            convertThemeInfo(widgets) {
                let _this = this;
                for (var i = 0; i < widgets.length; i++) {
                    let widget = widgets[i];
                    let type = widget.type;
                    if (type === "reportWidget") {
                        type = widget.reportType;
                    }
                    if (_this.themeMaps.indexOf(type) === -1) {
                        let newObj = {};
                        newObj.widgetType = type;
                        newObj.paddingTop = widget.paddingTop;
                        newObj.paddingRight = widget.paddingRight;
                        newObj.paddingBottom = widget.paddingBottom;
                        newObj.paddingLeft = widget.paddingLeft;
                        newObj.borderColor = widget.borderColor;
                        newObj.backgroundColor = widget.backgroundColor;

                        newObj.style = widget.style;
                        _this.themeMaps.push(type);
                        _this.themeInfo.themeMeta.widgetsStyle.push(newObj);
                        if (type === "tabPageWidget") {
                            if (widget.tabs instanceof Array && widget.tabs.length > 0) {
                                widget.tabs.forEach((tab, index) => {
                                    if (tab.tabContent.widgets instanceof Array && tab.tabContent.widgets.length > 0) {
                                        _this.convertThemeInfo(tab.tabContent.widgets);
                                    }
                                })
                            }
                        }
                    }
                }
            },
            listFormConf() {
                let _this = this;
                let param = {
                    flag: 0,
                    pageNum: 1,
                    pageSize: 1000
                };
                _this.formList = [];
                _this.$Get(_this.khConfig.api.listFormConf, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            if (res.datas != null && res.datas instanceof Array && res.datas.length > 0) {
                                res.datas.forEach(item => {
                                    let formObj = {};
                                    formObj.formName = item.formName;
                                    formObj.formId = item.formId + "";
                                    _this.formList.push(formObj);
                                })
                            }
                        }
                    });
            },
            // 保存高级设置配置
            saveAdvancedSetting() {
                let _this = this;
                _this.formConfig.sensorSettingsV2.version = 1
                //控件配置重新排序
                _this.formConfig.sensorSettingsV2.widgets = _this.formConfig.sensorSettingsV2.widgets.sort((a, b) => {
                        if (a.y == b.y) {
                        return a.x - b.x;
                        } else {
                        return a.y - b.y;
                        }
                });
                let postJsParam = {
                    "formId": _this.formId,
                    "sensorSettingsV2": _this.formConfig.sensorSettingsV2,
                    "appSensorSettings":_this.formConfig.appSensorSettings
                };
                _this.saveLoading = true;
                this.$PostJson(this.khConfig.api.saveFormSeniorConfV2, postJsParam).then(res => {
                    _this.saveLoading = false;
                    if (res.errCode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '高级设置成功',
                            type: 'success'
                        });
                        this.$emit("notifyParentClose", true, false, false); // 通知父表单已完成高级设置保存,可以进行下一步操作
                        this.editFormVisible = false;
                        if (_this.formConfig.sensorSettingsV2 && _this.formConfig.sensorSettingsV2.widgets instanceof Array && _this.formConfig.sensorSettingsV2.widgets.length >= 1) {
                            let tempWidget = _this.formConfig.sensorSettingsV2.widgets[0];
                            if (tempWidget.showType && tempWidget.showType.addShowType) {
                                let addShowType = tempWidget.showType.addShowType;
                                if (addShowType === 'full') {
                                    // 直达新增页面的路由新增
                                    this.$Get(this.khConfig.api.addFullMenu, {
                                        menuUrl: "/custom/" + this.formId,
                                        menuName: this.formName
                                    }).then(res => {
                                        if (res.errCode === 0) {
                                            // console.log("新增页面全屏设置成功!")
                                        }
                                    })
                                }
                            }
                        }
                    } else {
                        this.$emit("notifyParentClose", true, false, true);  // 通知父表单已完成高级设置保存失败
                    }
                }).catch((e) => {
                    _this.saveLoading = false;
                    this.$emit("notifyParentClose", true, false, true);  // 通知父表单已完成高级设置保存失败
                    console.log(e);
                });
            },
            // 更新预览,对应监听DragPower更新按钮
            refreshApp() {
                let _this = this;
                _this.reviewAppEventListen++;
            },
            // 切换选择控件,对应显示不同的属性设置
            notifyItemChange(currentSelectItem) {
                let _this = this;
                _this.currentSelectItem = currentSelectItem;
                _this.advancedWidgetHackSet = false;
                _this.$nextTick(() => {
                    _this.advancedWidgetHackSet = true
                })
            },
            // 双击选择添加控件
            addDragPowerClickListen(type) {
                let _this = this;
                _this.widgetType = type;
                _this.addWidgetEventListen++;
            },
            // 返回表单设计
            goBack() {
                this.editFormVisible = false;
                this.$emit("goBack")
            },
            clickMove() {
                return true;
            },
        },
    };
</script>


<style lang="scss" scoped>
    @import "@/assets/style/form/advanced-setting.scss";
    .main-app {
        width: 100%;
        height: 40px;
        color: rgba(255, 255, 255, 0.3);
        background: #2b3551;
    }
</style>
