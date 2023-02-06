<template>
    <div class="build-form-container">
        <el-row class="full-height">
            <el-col :span="19" class="full-height">
                <section class="btn-bar">
                    <slot name="action">
                    </slot>
                    <el-button type="text" size="medium" icon="el-icon-view" @click="previewPage">
                        预览
                    </el-button>
                    <el-button type="text" size="medium" icon="el-icon-view" @click="saveFormDesign"
                               :loading="nextLoading">
                        发布
                    </el-button>
                    <el-button type="text" size="medium" icon="el-icon-upload2" @click="handleUpload">
                        导入JSON
                    </el-button>
                    <el-button type="text" size="medium" icon="el-icon-tickets"
                               @click="previewJson">生成JSON
                    </el-button>
                    <el-button type="text" size="medium" icon="el-icon-delete"
                               @click="clearAll">清空
                    </el-button>
                    <div style="display: inline-block;float: right">
                        <el-tooltip class="item" effect="dark" content="恢复默认主题" placement="top">
                            <i class="el-icon-brush" @click="resetTheme" size="medium" style="color: #409EFF"></i>
                        </el-tooltip>
                        <el-tooltip class="item" effect="dark" content="编辑主题" placement="top">
                            <i class="el-icon-edit-outline" @click="themeDialogVisible = true" size="medium"
                               style="color: #409EFF"></i>
                        </el-tooltip>
                        <el-select v-model="themeValue" placeholder="请选择主题" collapse-tags filterable
                                   style="width: 200px"
                                   class="report-set-style imageMarginTop" :popper-append-to-body="false"
                                   clearable @click.native="loadThemeFirst" @change="themeSelect"
                                   v-el-select-load-more="loadThemeMore" value="">
                            <el-option
                                v-for="item in themeData"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                        <el-button type="primary" style="height: 30px;margin-top: 7px" @click="addTheme" size="small">
                            另存主题
                        </el-button>
                    </div>
                </section>
                <form-box
                    ref="formBox"
                    :data="formBox"
                    :controlled="controlled"
                    :select.sync="formBoxSelect"
                    :clearAllFlag="clearAllFlag"
                    @loadFormMapping="loadFormMapping"
                    @onFormItemList="onFormItemList"
                >
                </form-box>
            </el-col>

            <el-col :span="5" class="full-height">
                <form-fields
                    :data="formBoxSelect"
                    :config="formBox.config"
                    :form-item-list="formItemList"
                    :dyn-cols="dynCols"
                    @sure-related="sureRelated"
                >
                </form-fields>
            </el-col>
        </el-row>

        <custom-dialog
            title="预览"
            :visible="previewVisible"
            @on-close="previewVisible = false"
            ref="boxPreview"
            width="1000px"
            form>
            <form-build
                v-if="previewVisible"
                :data="formBox"
                :value="dataModels"
                :addOrEdit="true"
                :remote="remoteCall"
                :formId="formId"
                ref="buildForm">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build>
            <template v-for="item in tableFormConfig">
                <single-table :item="item" :data-config="formBox.config"></single-table>
            </template>
            <template v-for="item in batchTableFormConfig">
                <batch-table :item="item"></batch-table>
            </template>
            <template slot="action">
                <el-button type="primary" @click="getData">获取数据</el-button>
                <el-button @click="reset">重置</el-button>
            </template>
        </custom-dialog>

        <custom-dialog
            title="生成JSON"
            :visible="jsonVisible"
            @on-close="jsonVisible = false"
            ref="jsonPreview"
            width="800px"
            form>
            <div
                id="jsonEditor"
                style="height: 400px;width: 100%;">
                {{jsonTemplate}}
            </div>
            <template slot="action">
                <el-button type="primary" class="json-btn" :data-clipboard-text="jsonCopyValue">复制数据</el-button>
            </template>
        </custom-dialog>
        <custom-dialog
            title="导入JSON"
            :visible="uploadVisible"
            @on-close="uploadVisible = false"
            @on-submit="handleUploadJson"
            ref="uploadJson"
            width="800px"
            form
        >
            <el-alert type="info" title="JSON格式如下，直接复制生成的json覆盖此处代码点击确定即可"></el-alert>
            <div id="uploadEditor" style="height: 400px;width: 100%;"></div>
        </custom-dialog>

        <el-dialog title="主题样式" :visible.sync="themeDialogVisible"
                   top="5vh" custom-class="col-cond-filter-dialog" width="50%"
                   :modal=false>
            <theme-list-show :currentType="1"></theme-list-show>
        </el-dialog>
        <el-dialog title="添加主题" :visible.sync="themeAddDialogVisible" :modal="false" custom-class="add-theme-dialog">
            <el-form :model="themeInfo" label-width="120px">
                <el-form-item label="主题名称">
                    <el-input v-model="themeInfo.themeName" style="width: 200px"></el-input>
                </el-form-item>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="themeAddDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTheme" :loading="themeLoading">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    import Draggable from 'vuedraggable'
    import CustomDialog from '@/components/CustomDialog'
    import FormBuild from "@/components/form-build/RestructureFormBuild";
    import FormFields from "@/components/form-filds/RestructureFormFields";
    import Clipboard from 'clipboard'
    import FormBox from "@/components/form-content/components/FormBox";
    import SingleTable from "@/components/table/SingleTable";
    import BatchTable from "@/components/table/BatchTable";
    import ThemeListShow from "@/components/theme/ThemeListShow";

    export default {
        name: "FormContent",
        components: {
            FormBox,
            Draggable,
            CustomDialog,
            FormFields,
            FormBuild,
            SingleTable,
            BatchTable,
            ThemeListShow
        },
        // formConfig: 表单配置
        // formId : 表单ID
        // notifySaveFormDesign: 表单设计点击下一步,触发子组件的方法保存
        props: ["formConfig", "formId", "notifySave"],
        /*        props: {
                    "formConfig": {required: true},      // 表单整体的配置信息
                    "formId": {type: Number, required: true},        // 表单ID
                    "notifySave": {type: Number, required: false}, // notifySave: 表单设计点击下一步,触发子组件的方法保存
                },*/
        created() {

            let _this = this;
            if (!_this.KHUtils.isNull(_this.formConfig)) {
                _this.formBox = _this.KHUtils.clone(_this.formConfig);
                _this.formBox.config.generateDefaultFields = _this.formBox.config.generateDefaultFields !== undefined ? _this.formBox.config.generateDefaultFields : "0";
            }
            //兼容配置
            if(!_this.formBox.config.hasOwnProperty("isBorder")){
               this.$set(_this.formBox.config,"isBorder",false)
            }
        },
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
        watch: {
            notifySave: {
                deep: true,
                handler() {
                    this.saveFormDesign();
                }
            }
        },
        data() {
            return {
                // 主题相关属性
                themeValue: null,
                themeDialogVisible: false,
                themeData: [],
                queryThemeParam: {
                    type: 1,
                    pageNum: 1,
                    pageSize: 100
                },
                saveLoading: false,
                themeAddDialogVisible: false,
                themeInfo: {
                    themeName: "",
                    themeMeta: {
                        widgetsStyle: []
                    },
                    type: 0
                },
                themeMaps: [],
                themeLoading: false,
                dynCols: [],  // 当前表单拉取的所有控件
                // 未触发清空事件
                clearAllFlag: 0,
                uploadEditor: null,
                uploadVisible: false,
                formBox: {
                    list: [],
                    config: {
                        labelWidth: 100,
                        labelPosition: 'right',
                        size: 'small',
                        isBorder:false,
                    },
                },
                formBoxSelect: {},
                previewVisible: false,
                jsonVisible: false,
                dataModels: {},
                controlled: [],             //  被关联项的key数组
                blank: '',
                jsonTemplate: '',
                jsonCopyValue: '',
                jsonClipboard: null,
                nextLoading: false,
                typeNameArray: [],
                // 同一种控件是否有重名
                typeBoxIsRename: false,
                renameBox: {},
                remoteCall: {
                    func_test(resolve) {
                        setTimeout(() => {
                            const options = [
                                {id: '1', name: '1111'},
                                {id: '2', name: '2222'},
                                {id: '3', name: '3333'}
                            ];
                            resolve(options)
                        }, 2000)
                    },
                },
                tableFormConfig: [],
                batchTableFormConfig: [],
                formItemList:[]
            }
        },
        mounted() {
            this.themeValue = this.formBox.config.themeId;
            this.loadThemeFirst();
        },
        methods: {
            onFormItemList(e){
             this.formItemList = e
            },
            resetTheme() {
                let _this = this;
                this.$confirm('确认是否恢复默认主题？', '提示', {}).then(() => {
                    try {
                        let config = _this.formBox.config;
                        if (!_this.KHUtils.isNull(config)) {
                            config.backgroundColor = null;
                            config.widgetBackgroundColor = null;
                            config.widgetFontColor = null;
                            config.widgetIconColor = null;
                            config.widgetTitleFontSize = null;
                            config.widgetTitleFontColor = null;
                            config.widgetBorderSize = null;
                            config.widgetBorderColor = null;
                            config.btnWidgetBackgroundColor = null;
                            config.btnWidgetFontColor = null;
                            config.uploadTipFontColor = null;
                            config.themeId = null;
                            config.backgroundColor = null;
                            this.themeValue = null;
                        }
                        let widgets = _this.formBox.list;
                        if (widgets instanceof Array && widgets.length > 0) {
                            resetThemeMeta(widgets, _this);
                        }
                    } catch (e) {
                        _this.$message.error("恢复默认主题失败!");
                        return false;
                    }

                    function resetThemeMeta(dataList, _this) {
                        dataList.forEach(val => {
                            if (val.type === 'grid') {
                                loop(val, _this);
                            } else {
                                process(val, _this);
                            }
                        });

                        function loop(obj, _this) {
                            if (obj.columns) {
                                obj.columns.forEach(cs => {
                                    cs.list.forEach(ls => {
                                        if (ls.columns) {
                                            loop(ls, _this);
                                        } else {
                                            process(ls, _this);
                                        }
                                    })
                                })
                            }
                        }

                        function process(val, _this) {
                            if (val.type !== 'switch' && val.type !== 'radio' && val.type !== 'checkbox' && val.type !== 'image_upload' && val.type !== 'file_upload') {
                                val.widgetBackgroundColor = null;
                                val.widgetFontColor = null;
                                val.widgetIconColor = null;
                                val.widgetIconBackgroundColor = null;
                                val.widgetTitleFontSize = null;
                                val.widgetTitleFontColor = null;
                                val.widgetBorderSize = null;
                                val.widgetBorderColor = null;
                            } else if (val.type === 'image_upload' || val.type === 'file_upload') {
                                val.btnWidgetBackgroundColor = null;
                                val.btnWidgetFontColor = null;
                                val.uploadTipFontColor = null;
                            } else if (val.type === 'switch') {
                                val.widgetActiveColor = null;
                                val.widgetInActiveColorr = null;
                            }
                        }
                    }
                    _this.$message.success("恢复默认主题成功!");
                });

            },
            loadThemeFirst() {
                let _this = this;
                _this.queryThemeParam.pageNum = 1;
                _this.themeData = [];
                _this.queryTheme();
            },
            loadThemeMore() {
                let _this = this;
                _this.queryThemeParam.pageNum++;
                _this.queryTheme();
            },
            queryTheme() {
                this.$Get(this.khConfig.api.queryThemeByType, this.queryThemeParam).then(res => {
                    if (res.errCode === 0) {
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            res.datas.forEach(item => {
                                let obj = {
                                    label: item.themeName,
                                    value: item.id
                                };
                                this.themeData.push(obj);
                            })
                        }
                    }
                });
            },
            themeSelect(value) {
                this.themeValue = value;
                this.formBox.config.themeId = this.themeValue;
                if (!this.KHUtils.isNull(value)) {
                    this.$Get(this.khConfig.api.queryThemeMeta + "/" + value).then(res => {
                        if (res.errCode === 0) {
                            let themeMeta = JSON.parse(res.themeMeta);
                            if (!this.KHUtils.isNull(themeMeta)) {
                                this.applyTheme(themeMeta);
                            }
                        }
                    });
                }
            },
            addTheme() {
                let _this = this;
                _this.themeInfo = {
                    themeName: "",
                    themeMeta: {},
                    type: 1
                };
                _this.themeAddDialogVisible = true;
            },
            saveTheme() {
                let _this = this;
                _this.themeMaps = [];
                let config = _this.formBox.config;
                if (!_this.KHUtils.isNull(config)) {
                    let flag = !_this.KHUtils.isNull(config.backgroundColor) || !_this.KHUtils.isNull(config.widgetBackgroundColor)
                        || !_this.KHUtils.isNull(config.widgetFontColor) || !_this.KHUtils.isNull(config.widgetIconColor)
                        || !_this.KHUtils.isNull(config.widgetTitleFontSize) || !_this.KHUtils.isNull(config.widgetTitleFontColor)
                        || !_this.KHUtils.isNull(config.widgetBorderSize) || !_this.KHUtils.isNull(config.widgetBorderColor)
                        || !_this.KHUtils.isNull(config.btnWidgetBackgroundColor) || !_this.KHUtils.isNull(config.btnWidgetFontColor)
                        || !_this.KHUtils.isNull(config.uploadTipFontColor);
                    if (flag) {
                        _this.themeInfo.themeMeta.backgroundColor = _this.KHUtils.isNull(config.backgroundColor) ? null : config.backgroundColor;
                        _this.themeInfo.themeMeta.widgetBackgroundColor = _this.KHUtils.isNull(config.widgetBackgroundColor) ? null : config.widgetBackgroundColor;
                        _this.themeInfo.themeMeta.widgetFontColor = _this.KHUtils.isNull(config.widgetFontColor) ? null : config.widgetFontColor;
                        _this.themeInfo.themeMeta.widgetIconColor = _this.KHUtils.isNull(config.widgetIconColor) ? null : config.widgetIconColor;
                        _this.themeInfo.themeMeta.widgetTitleFontSize = _this.KHUtils.isNull(config.widgetTitleFontSize) ? null : config.widgetTitleFontSize;
                        _this.themeInfo.themeMeta.widgetTitleFontColor = _this.KHUtils.isNull(config.widgetTitleFontColor) ? null : config.widgetTitleFontColor;
                        _this.themeInfo.themeMeta.widgetBorderSize = _this.KHUtils.isNull(config.widgetBorderSize) ? null : config.widgetBorderSize;
                        _this.themeInfo.themeMeta.widgetBorderColor = _this.KHUtils.isNull(config.widgetBorderColor) ? null : config.widgetBorderColor;
                        _this.themeInfo.themeMeta.btnWidgetBackgroundColor = _this.KHUtils.isNull(config.btnWidgetBackgroundColor) ? null : config.btnWidgetBackgroundColor;
                        _this.themeInfo.themeMeta.btnWidgetFontColor = _this.KHUtils.isNull(config.btnWidgetFontColor) ? null : config.btnWidgetFontColor;
                        _this.themeInfo.themeMeta.uploadTipFontColor = _this.KHUtils.isNull(config.uploadTipFontColor) ? null : config.uploadTipFontColor;
                    }
                }
                let widgets = _this.formBox.list;
                if (widgets instanceof Array && widgets.length > 0) {
                    processThemeMeta(widgets, _this.themeInfo.themeMeta, _this);
                    if (_this.KHUtils.isNull(_this.themeInfo.themeMeta) || JSON.stringify(_this.themeInfo.themeMeta) === "{}") {
                        _this.$message.warning("当前表单为默认样式,您未自定义任何样式");
                        return false;
                    }
                    console.log("_this.themeInfo.themeMeta :" + JSON.stringify(_this.themeInfo.themeMeta));
                    _this.themeLoading = true;
                    _this.$PostJson(this.khConfig.api.addTheme, _this.themeInfo).then(res => {
                        _this.themeAddDialogVisible = false;
                        _this.themeLoading = false;
                        if (res.errCode === 0) {
                            this.$notify({
                                title: '成功',
                                message: '主题保存成功',
                                type: 'success'
                            });
                        }
                    }).catch((e) => {
                        _this.themeAddDialogVisible = false;
                        _this.themeLoading = false;
                        console.log(e);
                    });
                } else {
                    this.$message({
                        message: '未找到任何控件',
                        type: 'warning'
                    });
                }

                function processThemeMeta(dataList, themeMeta, _this) {
                    dataList.forEach(val => {
                        if (val.type === 'grid') {
                            loop(val, themeMeta, _this);
                        } else {
                            process(val, themeMeta, _this);
                        }
                    });

                    function loop(obj, themeMeta, _this) {
                        if (obj.columns) {
                            obj.columns.forEach(cs => {
                                cs.list.forEach(ls => {
                                    if (ls.columns) {
                                        loop(ls, themeMeta, _this);
                                    } else {
                                        process(ls, themeMeta, _this);
                                    }
                                })
                            })
                        }
                    }

                    function process(val, themeMeta, _this) {
                        if (val.type !== 'switch' && val.type !== 'radio' && val.type !== 'checkbox' && val.type !== 'image_upload' && val.type !== 'file_upload') {
                            let flag = !_this.KHUtils.isNull(val.widgetBackgroundColor) || !_this.KHUtils.isNull(val.widgetFontColor)
                                || !_this.KHUtils.isNull(val.widgetFontColor) || !_this.KHUtils.isNull(val.widgetIconBackgroundColor)
                                || !_this.KHUtils.isNull(val.widgetTitleFontSize) || !_this.KHUtils.isNull(val.widgetTitleFontColor)
                                || !_this.KHUtils.isNull(val.widgetBorderSize) || !_this.KHUtils.isNull(val.widgetBorderColor);
                            if (flag && !themeMeta[val.type]) {
                                themeMeta[val.type] = {};
                                themeMeta[val.type].widgetBackgroundColor = _this.KHUtils.isNull(val.widgetBackgroundColor) ? null : val.widgetBackgroundColor;
                                themeMeta[val.type].widgetFontColor = _this.KHUtils.isNull(val.widgetFontColor) ? null : val.widgetFontColor;
                                themeMeta[val.type].widgetIconColor = _this.KHUtils.isNull(val.widgetIconColor) ? null : val.widgetIconColor;
                                themeMeta[val.type].widgetIconBackgroundColor = _this.KHUtils.isNull(val.widgetIconBackgroundColor) ? null : val.widgetIconBackgroundColor;
                                themeMeta[val.type].widgetTitleFontSize = _this.KHUtils.isNull(val.widgetTitleFontSize) ? null : val.widgetTitleFontSize;
                                themeMeta[val.type].widgetTitleFontColor = _this.KHUtils.isNull(val.widgetTitleFontColor) ? null : val.widgetTitleFontColor;
                                themeMeta[val.type].widgetBorderSize = _this.KHUtils.isNull(val.widgetBorderSize) ? null : val.widgetBorderSize;
                                themeMeta[val.type].widgetBorderColor = _this.KHUtils.isNull(val.widgetBorderColor) ? null : val.widgetBorderColor;
                            }
                        } else if (val.type === 'image_upload' || val.type === 'file_upload') {
                            let flag = !_this.KHUtils.isNull(val.btnWidgetBackgroundColor) || !_this.KHUtils.isNull(val.btnWidgetFontColor) || !_this.KHUtils.isNull(val.uploadTipFontColor);
                            if (flag && !themeMeta[val.type]) {
                                themeMeta[val.type] = {};
                                themeMeta[val.type].btnWidgetBackgroundColor = _this.KHUtils.isNull(val.btnWidgetBackgroundColor) ? null : val.btnWidgetBackgroundColor;
                                themeMeta[val.type].btnWidgetFontColor = _this.KHUtils.isNull(val.btnWidgetFontColor) ? null : val.btnWidgetFontColor;
                                themeMeta[val.type].uploadTipFontColor = _this.KHUtils.isNull(val.uploadTipFontColor) ? null : val.uploadTipFontColor;
                            }
                        } else if (val.type === 'switch') {
                            let flag = !_this.KHUtils.isNull(val.widgetActiveColor) || !_this.KHUtils.isNull(val.widgetInActiveColorr);
                            if (flag && !themeMeta[val.type]) {
                                themeMeta[val.type] = {};
                                themeMeta[val.type].widgetActiveColor = _this.KHUtils.isNull(val.widgetActiveColor) ? null : val.widgetActiveColor;
                                themeMeta[val.type].widgetInActiveColorr = _this.KHUtils.isNull(val.widgetInActiveColorr) ? null : val.widgetInActiveColorr;
                            }
                        }
                    }
                }
            },
            applyTheme(themeMeta) {
                let _this = this;
                let config = _this.formBox.config;
                if (!_this.KHUtils.isNull(config)) {
                    config.backgroundColor = _this.KHUtils.isNull(themeMeta.backgroundColor) ? null : themeMeta.backgroundColor;
                    config.widgetBackgroundColor = _this.KHUtils.isNull(themeMeta.widgetBackgroundColor) ? null : themeMeta.widgetBackgroundColor;
                    config.widgetFontColor = _this.KHUtils.isNull(themeMeta.widgetFontColor) ? null : themeMeta.widgetFontColor;
                    config.widgetIconColor = _this.KHUtils.isNull(themeMeta.widgetIconColor) ? null : themeMeta.widgetIconColor;
                    config.widgetTitleFontSize = _this.KHUtils.isNull(themeMeta.widgetTitleFontSize) ? null : themeMeta.widgetTitleFontSize;
                    config.widgetTitleFontColor = _this.KHUtils.isNull(themeMeta.widgetTitleFontColor) ? null : themeMeta.widgetTitleFontColor;
                    config.widgetBorderSize = _this.KHUtils.isNull(themeMeta.widgetBorderSize) ? null : themeMeta.widgetBorderSize;
                    config.widgetBorderColor = _this.KHUtils.isNull(themeMeta.widgetBorderColor) ? null : themeMeta.widgetBorderColor;
                    config.btnWidgetBackgroundColor = _this.KHUtils.isNull(themeMeta.btnWidgetBackgroundColor) ? null : themeMeta.btnWidgetBackgroundColor;
                    config.btnWidgetFontColor = _this.KHUtils.isNull(themeMeta.btnWidgetFontColor) ? null : themeMeta.btnWidgetFontColor;
                    config.uploadTipFontColor = _this.KHUtils.isNull(themeMeta.uploadTipFontColor) ? null : themeMeta.uploadTipFontColor;
                }
                let widgets = _this.formBox.list;
                if (widgets instanceof Array && widgets.length > 0) {
                    applyThemeMeta(widgets, themeMeta, _this);
                }

                function applyThemeMeta(dataList, themeMeta, _this) {
                    dataList.forEach(val => {
                        if (val.type === 'grid') {
                            loop(val, _this);
                        } else {
                            process(val, themeMeta, _this);
                        }
                    });

                    function loop(obj, themeMeta, _this) {
                        if (obj.columns) {
                            obj.columns.forEach(cs => {
                                cs.list.forEach(ls => {
                                    if (ls.columns) {
                                        loop(ls);
                                    } else {
                                        process(ls, themeMeta, _this);
                                    }
                                })
                            })
                        }
                    }

                    function process(val, themeMeta, _this) {
                        if (!themeMeta[val.type]) {
                            return false;
                        }
                        if (val.type !== 'switch' && val.type !== 'radio' && val.type !== 'checkbox' && val.type !== 'image_upload' && val.type !== 'file_upload') {
                            val.widgetBackgroundColor = _this.KHUtils.isNull(themeMeta[val.type].widgetBackgroundColor) ? null : themeMeta[val.type].widgetBackgroundColor;
                            val.widgetFontColor = _this.KHUtils.isNull(themeMeta[val.type].widgetFontColor) ? null : themeMeta[val.type].widgetFontColor;
                            val.widgetIconColor = _this.KHUtils.isNull(themeMeta[val.type].widgetIconColor) ? null : themeMeta[val.type].widgetIconColor;
                            val.widgetIconBackgroundColor = _this.KHUtils.isNull(themeMeta[val.type].widgetIconBackgroundColor) ? null : themeMeta[val.type].widgetIconBackgroundColor;
                            val.widgetTitleFontSize = _this.KHUtils.isNull(themeMeta[val.type].widgetTitleFontSize) ? null : themeMeta[val.type].widgetTitleFontSize;
                            val.widgetTitleFontColor = _this.KHUtils.isNull(themeMeta[val.type].widgetTitleFontColor) ? null : themeMeta[val.type].widgetTitleFontColor;
                            val.widgetBorderSize = _this.KHUtils.isNull(themeMeta[val.type].widgetBorderSize) ? null : themeMeta[val.type].widgetBorderSize;
                            val.widgetBorderColor = _this.KHUtils.isNull(themeMeta[val.type].widgetBorderColor) ? null : themeMeta[val.type].widgetBorderColor;
                        } else if (val.type === 'image_upload' || val.type === 'file_upload') {
                            val.btnWidgetBackgroundColor = _this.KHUtils.isNull(themeMeta[val.type].btnWidgetBackgroundColor) ? null : themeMeta[val.type].btnWidgetBackgroundColor;
                            val.btnWidgetFontColor = _this.KHUtils.isNull(themeMeta[val.type].btnWidgetFontColor) ? null : themeMeta[val.type].btnWidgetFontColor;
                            val.uploadTipFontColor = _this.KHUtils.isNull(themeMeta[val.type].uploadTipFontColor) ? null : themeMeta[val.type].uploadTipFontColor;
                        } else if (val.type === 'switch') {
                            val.widgetActiveColor = _this.KHUtils.isNull(themeMeta[val.type].widgetActiveColor) ? null : themeMeta[val.type].widgetActiveColor;
                            val.widgetInActiveColorr = _this.KHUtils.isNull(themeMeta[val.type].widgetInActiveColorr) ? null : themeMeta[val.type].widgetInActiveColorr;
                        }
                    }
                }
            },
            // 加载映射配置的表单控件选项
            loadFormMapping(tmpArray) {
                let _this = this;
                if (tmpArray instanceof Array) {
                    _this.dynCols = tmpArray;
                }
            },
            // 预览
            previewPage() {
                let _this = this;
                var myDiv = document.getElementById(_this.$refs.boxPreview.id);
                if (myDiv !== null) {
                    var elDialogCenter = myDiv.getElementsByClassName(" el-dialog el-dialog--center");
                    for (var i = 0; i < elDialogCenter.length; i++) {
                        elDialogCenter[i].setAttribute("style", "background-color:" + _this.formBox.config.backgroundColor + ";margin-top: 15vh;");
                    }
                }
                _this.previewVisible = true;
                _this.tableFormConfig = [];
                _this.batchTableFormConfig = [];
                for (let i = 0, n = _this.formBox.list.length; i < n; i++) {
                    let obj = _this.formBox.list[i];
                    if ("table" === obj.type) {
                        if (obj.options.addModel === 'batch') {
                            obj.tableData = [];
                            _this.batchTableFormConfig.push(obj);      // 子表单独立组件显示
                        } else {
                            _this.tableFormConfig.push(obj);
                        }
                    }
                }
            },
            // 获取数据
            getData() {
                let _this = this;
                _this.$refs.buildForm.getData().then(data => {
                    _this.$alert(data, '').catch((e) => {
                        console.log(e);
                    });
                    _this.$refs.boxPreview.end()
                }).catch(() => {
                    _this.$refs.boxPreview.end()
                })
            },
            // 保存表单设计
            saveFormDesign() {
                if (this.KHUtils.isNull(this.formBox)) {
                    this.$emit("notifyParentClose", true, false, true, true);  // 表单设计不允许为空
                    return false;
                }
                let list = this.formBox.list;
                if (this.KHUtils.isNull(list) || (list instanceof Array && list.length === 0)) {
                    this.$emit("notifyParentClose", true, false, true, true);  // 表单设计不允许为空
                    return false;
                }
                this.$confirm('确认保存表单设计吗？', '提示', {}).then(() => {
                    this.typeNameArray = [];
                    this.typeBoxIsRename = false;
                    this.renameBox = {};
                    this.dealFormConfig(list);
                    this.checkBoxRename(list);
                    if (this.typeBoxIsRename) {
                        this.$notify.error({
                            title: '错误',
                            message: '标题名称为《' + this.renameBox.name + '》的控件与同类控件名称有重复,请重新命名'
                        });
                        this.$emit("notifyParentClose", true, false, true, false);  // 通知父表单已完成表单设计保存失败
                        return false;
                    }
                    this.nextLoading = true;
                    let obj = {
                        formId: this.formId,
                        formMeta: this.formBox
                    };
                    this.$PostJson(this.khConfig.api.saveFormDesign, obj).then(res => {
                        this.nextLoading = false;
                        if (res.errCode === 0) {
                            this.$notify({
                                title: '成功',
                                message: '发布完成,请完成下一步操作',
                                type: 'success'
                            });
                            this.$emit("notifyParentClose", true, false, false, false); // 通知父表单已完成表单设计保存,可以进行下一步操作
                            this.previewVisible = false;
                        } else {
                            this.$emit("notifyParentClose", true, false, true, false);  // 通知父表单已完成表单设计保存失败
                        }
                    })
                }).catch(error => {
                    console.log("保存表单设计失败!!" + error);
                    this.$emit("notifyParentClose", true, false, true, false);  // 通知父表单已完成表单设计保存失败
                });
            },
            // 表单配置对单选框、下拉框将选择项改变后,之前默认选择项也同时修改的处理
            dealFormConfig(list) {
                for (let i = 0; i < list.length; i++) {
                    let obj = list[i];
                    if ("multipleSelect" === obj.type || "checkbox" === obj.type) {
                        let defValueArray = obj.options.defaultValue;
                        if (!this.KHUtils.isNull(defValueArray) && defValueArray instanceof Array
                            && defValueArray.length > 0) {
                            // 查看默认值是否是在选择项中存在的,如果不是则清除
                            let opArray = obj.options.options;
                            let delIndexArray = [];
                            defValueArray.forEach((dv, index) => {
                                let exists = false;
                                if (!this.KHUtils.isNull(opArray) && opArray instanceof Array) {
                                    opArray.forEach(op => {
                                        if (dv === op.value) {
                                            exists = true;
                                        }
                                    })
                                }
                                if (!exists) {
                                    delIndexArray.push(index);
                                }
                            });
                            for (let i = delIndexArray.length - 1; i >= 0; i--) {
                                obj.options.defaultValue.splice(delIndexArray[i], 1);
                            }
                        }
                    } else if ("radio" === obj.type || "select" === obj.type) {
                        if (!this.KHUtils.isNull(obj.options.defaultValue)) {
                            // 查看默认值是否是在选择项中存在的,如果不是则清除
                            let exists = true;
                            let opArray = obj.options.options;
                            if (!this.KHUtils.isNull(opArray) && opArray instanceof Array && opArray.length > 0) {
                                opArray.forEach(op => {
                                    if (obj.options.defaultValue === op.value) {
                                        exists = false;
                                    }
                                })
                            }
                            if (exists) {
                                obj.options.defaultValue = "";
                            }
                        }
                    } else if ("table" === obj.type) {
                        if (obj.formConfig) {
                            delete obj.formConfig;
                        }
                        obj.dynCols = [];
                        obj.tableData = [];
                        obj.multipleSelection = [];
                    }
                }
            },
            // 检查表单控件同一种控件是否有重命名的情况
            checkBoxRename(list) {
                if (this.KHUtils.isNull(list)) {
                    return false;
                }
                for (let i = 0; i < list.length; i++) {
                    let obj = list[i];
                    let newObj = {};
                    newObj.name = obj.name;
                    newObj.type = obj.type;
                    if ("grid" === obj.type) {
                        let colList = obj.columns;
                        for (let j = 0; j < colList.length; j++) {
                            let childList = colList[j].list;
                            this.checkBoxRename(childList);
                        }
                    } else {
                        this.typeNameArray.forEach(obj => {
                            if (newObj.type === obj.type
                                && (newObj.name + "").replace(/\s*/g, "") === (obj.name + "").replace(/\s*/g, "")) {
                                this.typeBoxIsRename = true;
                                this.renameBox = obj;
                                return false;
                            }
                        });
                        this.typeNameArray.push(newObj);
                    }
                }
            },
            // 表单重置
            reset() {
                this.$refs.buildForm.reset()
            },
            // 生成JSON
            previewJson() {
                let _this = this;
                _this.jsonVisible = true;
                _this.jsonTemplate = _this.formBox;
                _this.$nextTick(() => {
                    const editor = ace.edit('jsonEditor');
                    editor.session.setMode("ace/mode/json");
                    if (!_this.jsonClipboard) {
                        _this.jsonClipboard = new Clipboard('.json-btn');
                        _this.jsonClipboard.on('success', () => {
                            _this.$message.success('复制成功')
                        })
                    }
                    _this.jsonCopyValue = JSON.stringify(_this.formBox)
                })
            },
            // 清空
            clearAll() {
                let _this = this;
                // 通知子组件已经进行了清空动作
                this.clearAllFlag++;
                _this.formBox = {
                    list: [],
                    config: {
                        labelWidth: 100,
                        labelPosition: 'right',
                        size: 'small'
                    },
                };
                _this.formBoxSelect = {};
            },
            //  单选框|下拉框确定关联控件 (用于标记哪些控件被关联)
            sureRelated(controls) {
                this.controlled = Array.from(new Set(controls));                //  去除重复
            },
            // 导入JSON
            handleUpload() {
                this.uploadVisible = true;
                this.$nextTick(() => {
                    this.uploadEditor = ace.edit('uploadEditor');
                    this.uploadEditor.session.setMode("ace/mode/json");
                })
            },
            handleUploadJson() {
                try {
                    this.setJSON(JSON.parse(this.uploadEditor.getValue()));
                    this.uploadVisible = false;
                } catch (e) {
                    this.$message.error(e.message);
                    this.$refs.uploadJson.end();
                }
            },
            setJSON(json) {
                this.formBox = json;
                if (json.list.length > 0) {
                    this.formBoxSelect = json.list[0];
                }
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/form/form-content.scss";
</style>
