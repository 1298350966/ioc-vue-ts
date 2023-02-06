<template>
    <div v-if="formConfig != null && !KHUtils.isNull(dataModels)">
        <form-build
            :data.sync="formConfig"
            :value.sync="dataModels"
            :addOrEdit="false"
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
                    <single-table  :item="item" :data-config="formConfig.config"
                                   :form-id="formId"
                                   :parent-id="dataId" ></single-table>
                </el-tab-pane>
            </el-tabs>
        </template>
        <template v-else>
            <template v-for="item in tableFormConfig">
                <single-table  :item="item" :data-config="formConfig.config" :form-id="formId"
                               :parent-id="dataId"></single-table>
            </template>
        </template>
    </div>
</template>

<script>
    import FormBuild from "@/components/form-build/RestructureFormBuild";
    /*import SingleTable from "@/components/table/SingleTable";*/
    export default {
        components: {
            FormBuild,

        },
        props:{
            formId:{type:Number},
            dataId:{type:Number},

        },
        created(){
            new Promise((resolve, reject) => {
                this.loadFormConf(resolve);
            }).then(()=>{
                let param = {
                    "formId": this.formId,
                    "businessId":this.dataId
                };
                this.$Get(this.khConfig.api.getFormDataById, param).then(res => {
                    let tempRow = this.KHUtils.clone(res.data);
                    this.KHForm.ReversalDynCols(tempRow, this.khConfig.host.rest + this.khConfig.api.imageDownload, this.allCols);
                    this.dataModels = tempRow;

                });
            })
        },
        mounted(){

        },
        data(){
            return {
                formConfig:null,
                allCols:[],
                dynCols:[],
                switchMsgObj: {},
                tableFormConfig:[],
                dataModels:null,
                formActiveName:"",
                tableShowType:"transverse",
                nextLoading :false,
                parentSaveDisable:false
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
                _this.allCols = [];
                _this.dynCols = [];
                _this.tableFormConfig = [];
                // 根据formId查询表单配置
                _this.$Get(_this.khConfig.api.getFormConf + "/" + _this.formId).then(res => {
                    if (res.errCode === 0) {
                        if (!_this.KHUtils.isNull(res.formConf)) {
                            _this.formConfig = JSON.parse(res.formConf.formMeta);
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

                            if (_this.formConfig.sensorSettingsV2 && _this.formConfig.sensorSettingsV2.widgets instanceof Array && _this.formConfig.sensorSettingsV2.widgets.length >= 1) {
                                let tempWidget = _this.formConfig.sensorSettingsV2.widgets[0];
                                if (tempWidget.showType && tempWidget.showType.addShowType) {
                                    let addShowType = tempWidget.showType.addShowType;

                                    if (tempWidget.showType && tempWidget.showType.tableShowType && !this.KHUtils.isNull(tempWidget.showType.tableShowType)) {
                                        this.tableShowType = tempWidget.showType.tableShowType;
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

            // 保存数据
            saveData() {
                let _this = this;
                _this.$refs.buildForm.getData().then(data => {
                    _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                        _this.KHForm.formatDynCols(data, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                        data.id = _this.dataId;
                        let url = _this.khConfig.api.updateFormData
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
                            }
                            _this.nextLoading = false;
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

<style lang="scss" scoped>

</style>
