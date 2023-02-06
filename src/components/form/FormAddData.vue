<template>
    <div>
        <form-build
            v-if="hackReset"
            :data.sync="formConfig"
            :value.sync="dataModels"
            :addOrEdit.sync="addOrEdit"
            :form-id="formId"
            ref="buildForm">
            <template v-slot:blank="scope">
                宽度：
                <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                高度：
                <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
            </template>
        </form-build>
        <el-button type="primary" @click="saveData" :loading="nextLoading" :disabled="parentSaveDisable"
                   style="position: relative;left: 90%">保存
        </el-button>
        <template v-if="tableFormConfig.length > 0 && tableShowType === 'transverse'">
            <el-tabs v-model="formActiveName">
                <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model"
                             :key="item.model">
                    <single-table  v-if="hackReset" :item="item" :data-config="formConfig.config"
                                  :form-id="parentFormId"
                                  :parent-id="parentBusinessId"></single-table>
                </el-tab-pane>
            </el-tabs>
        </template>
        <template v-else>
            <template v-for="item in tableFormConfig">
                <single-table  v-if="hackReset"  :item="item" :data-config="formConfig.config" :form-id="parentFormId"
                              :parent-id="parentBusinessId"></single-table>
            </template>
        </template>
    </div>
</template>

<script>
    import FormBuild from "@/components/form-build/RestructureFormBuild";
    import SingleTable from "@/components/table/SingleTable";
    export default {
        name: "FormAddData",
        props: [ 'formId'],
        components: {
            FormBuild,
            SingleTable,

        },
        created(){

        },
        mounted(){
            new Promise((resolve, reject) => {
                this.loadFormConf(resolve);
            }).then(()=>{
                this.initFormAdd();
            })
        },
        data(){
            return {
                formConfig: {},
                tableFormConfig: [],  // 子表单控件集合
                dataModels: {},
                formActiveName:"",
                hackReset:false,
                parentFormId: 0,
                parentBusinessId: 0,
                tableShowType:"transverse",
                nextLoading: false,
                parentSaveDisable: false,
                dynCols:[],
                allCols:[],
                switchMsgObj: {},
                addOrEdit:true
            }
        },
        methods:{
            loadFormConf(resolve) {
                let _this = this;
                if (_this.KHUtils.isNull(_this.formId)) {
                    _this.$notify.error({
                        title: '错误',
                        message: '路由formId为空'
                    });
                    return false;
                }
                if (!_this.KHUtils.isNumber(_this.formId)) {
                    _this.$notify.error({
                        title: '错误',
                        message: '路由formId不为字符串:'
                    });
                    return false;
                }
                _this.dynCols = [];
                _this.allCols = [];
                _this.tableFormConfig = [];
                // 根据formId查询表单配置
                _this.$Get(_this.khConfig.api.getFormConf + "/" + _this.formId).then(res => {
                    if (res.errCode === 0) {
                        if (!_this.KHUtils.isNull(res.formConf)) {
                            _this.formConfig = JSON.parse(res.formConf.formMeta);
                            //_this.KHForm.convertSensorSettingsV2(_this.formId, _this);
                            if (_this.KHUtils.isNull(_this.formConfig)) {
                                _this.$notify.warning({
                                    title: '警告',
                                    message: "表单ID(" + _this.formId + "): 暂未进行相关的表单设计"
                                });
                            }
                            let tempConfig = JSON.parse(res.formConf.formMeta);
                            if (!tempConfig || _this.KHUtils.isNull(tempConfig.list)) {
                                return false;
                            }
                            // 遍历配置
                            for (let i = 0, n = tempConfig.list.length; i < n; i++) {
                                let obj = tempConfig.list[i];
                                if ("grid" === obj.type) {
                                    loop(obj, _this.dynCols, _this);
                                    loopAll(obj, _this.allCols, _this);

                                    function loop(obj, arr, _this) {
                                        let columns = obj.columns;
                                        for (let j = 0, m = columns.length; j < m; j++) {
                                            let colObj = columns[j];
                                            colObj.list.forEach(lsObj => {
                                                if (lsObj.type === 'switch') {
                                                    _this.switchMsgObj[lsObj.model] = [lsObj.options.openMsg, lsObj.options.closeMsg];
                                                }
                                                if (lsObj.type === 'data_select' || lsObj.type === 'org_select'
                                                    || lsObj.type === 'user_select'
                                                    || lsObj.type === 'company_select'
                                                    || lsObj.type === 'role_select'
                                                    || lsObj.type === 'dic_select') {
                                                    _this.KHForm.processDataSourceControl(lsObj, arr, _this);
                                                } else if (lsObj.type === 'gis_select') {
                                                    _this.KHForm.processGisControl(lsObj, arr, _this);
                                                } else if (lsObj.type === 'region_select') {
                                                    _this.KHForm.processRegionControl(lsObj, arr, _this);
                                                } else {
                                                    arr.push(lsObj);
                                                }
                                                if ("grid" === lsObj.type) {
                                                    loop(obj, _this);
                                                }
                                            })
                                        }
                                    }

                                    function loopAll(obj, arr, _this) {
                                        let columns = obj.columns;
                                        for (let j = 0, m = columns.length; j < m; j++) {
                                            let colObj = columns[j];
                                            colObj.list.forEach(lsObj => {
                                                arr.push(lsObj);
                                                if ("grid" === lsObj.type) {
                                                    loop(obj, _this);
                                                }
                                            })
                                        }
                                    }
                                } else if ("table" === obj.type) {
                                    _this.tableFormConfig.push(obj);      // 子表单独立组件显示
                                    if (_this.tableFormConfig.length > 0) {
                                        _this.formActiveName = _this.tableFormConfig[0].model;
                                    }
                                } else {
                                    _this.allCols.push(obj);
                                    if (obj.type === 'switch') {
                                        _this.switchMsgObj[obj.model] = [obj.options.openMsg, obj.options.closeMsg];
                                    }
                                    if (obj.type === 'data_select' || obj.type === 'org_select'
                                        || obj.type === 'user_select'
                                        || obj.type === 'company_select'
                                        || obj.type === 'role_select'
                                        || obj.type === 'dic_select') {
                                        _this.KHForm.processDataSourceControl(obj, _this.dynCols, _this);
                                    } else if (obj.type === 'gis_select') {
                                        _this.KHForm.processGisControl(obj, _this.dynCols, _this);
                                    } else if (obj.type === 'region_select') {
                                        _this.KHForm.processRegionControl(obj, _this.dynCols, _this);
                                    } else {
                                        _this.dynCols.push(obj);
                                    }
                                }
                            }

                        } else {
                            _this.$notify.warning({
                                title: '警告',
                                message: "表单ID(" + _this.formId + "): 暂未进行相关的表单设计"
                            });
                        }
                    }
                    resolve();
                });
            },
            initFormAdd(){
                let _this = this;
                _this.dataModels = {};
                _this.hackReset = false;
                _this.parentSaveDisable=false,
                _this.parentFormId = _this.formId;
                _this.parentBusinessId = 0;
                if (_this.formConfig.sensorSettingsV2 && _this.formConfig.sensorSettingsV2.widgets instanceof Array &&  _this.formConfig.sensorSettingsV2.widgets.length >= 1) {
                    let tempWidget = _this.formConfig.sensorSettingsV2.widgets[0];
                    if (tempWidget.showType && tempWidget.showType.tableShowType && !this.KHUtils.isNull(tempWidget.showType.tableShowType)) {
                        this.tableShowType = tempWidget.showType.tableShowType;
                    }

                }
                // 重新渲染子组件
                _this.$nextTick(() => {
                    _this.hackReset = true
                })
            },
            saveData() {
                let _this = this;
                _this.$refs.buildForm.getData().then(data => {
                    _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                        _this.KHForm.formatDynCols(data, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                        let url = _this.khConfig.api.addFormData;
                        _this.nextLoading = true;
                        data.formId = _this.formId;
                        let paramArray = [];
                        Object.keys(data).forEach(function (key) {
                            if(data[key] != null){
                                paramArray.push(key + "=" + data[key]);
                            }
                        });
                        paramArray = paramArray.join("&");
                        _this.$Post(url + "/" + _this.formId, paramArray).then(res => {
                            if (res.errCode === 0) {
                                _this.$notify({
                                    title: '成功',
                                    message: '保存成功',
                                    type: 'success'
                                });
                                this.$emit('addSuccess',_this.formId,res.businessId);

                            }
                            _this.nextLoading = false;
                            let flag = false;
                            if (_this.formConfig.list) {
                                _this.formConfig.list.forEach(obj => {
                                    if (obj.type === 'table') {
                                        flag = true;
                                        return false;
                                    }
                                })
                            }
                            if (flag) {
                                // 将业务ID与表单ID传递给子表单
                                _this.parentBusinessId = res.businessId ? res.businessId : _this.businessId;    // 父表单业务数据ID
                                _this.parentFormId = _this.formId;        // 表单Id
                                _this.parentSaveDisable = true; // 含有子表单时,新增完禁用父表单的保存按钮
                                let tempRow = _this.KHUtils.clone(data);
                                _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                                _this.dataModels = tempRow;
                                _this.hackReset = false;
                                // 重新渲染子组件
                                _this.$nextTick(() => {
                                    _this.hackReset = true;
                                })
                            } else {
                                this.$emit('closeDialog');
                            }
                        })
                    }).catch((e) => {
                        console.log(e)
                    });
                }).catch(() => {
                })
            },
        }
    }
</script>

<style>

</style>
