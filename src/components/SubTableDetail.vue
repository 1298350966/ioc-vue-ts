<template>
    <div v-if="formConfig != null && !KHUtils.isNull(dataModels)">
        <form-detail-build
            :data.sync="tableFormConfig"
            :value.sync="dataModels"
            :addOrEdit="false"
            ref="buildForm">
            <template v-slot:blank="scope">
                宽度：
                <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                高度：
                <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
            </template>
        </form-detail-build>
    </div>
</template>

<script>
    import FormDetailBuild from "@/components/form-build/RestructureFormDetailBuild";

    export default {
        components: {
            FormDetailBuild,

        },
        props:{
            formId:{type:Number},
            dataId:{type:Number},
            subKey:{type:String},

        },
        created(){
            new Promise((resolve, reject) => {
                this.loadFormConf(resolve);
            }).then(()=>{
                let param = {
                    "formId": this.formId,
                    "businessId":this.dataId,
                    "subKey":this.subKey
                };
                this.$Get(this.khConfig.api.getsubformdatabyid, param).then(res => {
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
                tableFormConfig:{},
                currentSubTable:null,
                dataModels:null,
                formActiveName:"",
                tableShowType:"transverse"
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
                                if ("table" === obj.type) {
                                    if(obj.key == _this.subKey){
                                        _this.currentSubTable = obj;
                                    }


                                }
                            }
                            _this.initTableForm();


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

            initTableForm() {
                let _this = this;
                if(_this.currentSubTable){
                    initFormConfig(_this.currentSubTable, this.formConfig.config, _this);
                    initDynCols(_this.currentSubTable, this);
                }


                function initFormConfig(td, config, _this) {
                    let formConfig = {
                        list: [],
                        config: config
                    };
                    if (td.tableColumns && td.tableColumns.length > 0) {
                        td.tableColumns.forEach(tc => {
                            formConfig.list.push(tc);
                        })
                    }
                    _this.tableFormConfig = formConfig;
                }

                function initDynCols(td, _this) {
                    _this.dynCols = [];
                    _this.allCols = [];
                    if (td.tableColumns && td.tableColumns.length > 0) {
                        td.tableColumns.forEach(obj => {
                            _this.allCols.push(obj);
                            if (obj.type === 'switch') {
                                _this.switchMsgObj[obj.model] = [obj.options.openMsg, obj.options.closeMsg];
                            }
                            if (obj.type === 'data_select' || obj.type === 'org_select'
                                || obj.type === 'user_select'
                                || obj.type === 'company_select'
                                || obj.type === 'role_select'
                                || obj.type === 'dic_select' || obj.type === 'current_user') {
                                _this.KHForm.processDataSourceControl(obj, _this.dynCols, _this);
                            } else if (obj.type === 'gis_select') {
                                _this.KHForm.processGisControl(obj, _this.dynCols, _this);
                            } else if (obj.type === 'region_select') {
                                _this.KHForm.processRegionControl(obj, _this.dynCols, _this);
                            } else {
                                _this.dynCols.push(obj);
                            }
                        })
                    }
                }
            },
        }
    }
</script>

<style lang="scss" scoped>

</style>
