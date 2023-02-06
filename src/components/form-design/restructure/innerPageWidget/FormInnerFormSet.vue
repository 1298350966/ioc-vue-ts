<template>
    <div>
        <el-input
            style="width: 300px"
            v-model="item.targetName"
            placeholder="请选择表单"
            @focus="selectFormVisible = true"
            clearable
            @clear="item.targetId=''"
        ></el-input>
        <div style="margin-top: 10px;margin-bottom: 10px"  v-if="item.innerType==='0' || item.innerType==='1'  || item.innerType==='2'">
            <span class="secondary-font-color">联动设置</span>
            <el-button type="primary" icon="el-icon-plus" circle @click.native="addParams"></el-button>
            <div v-if="item.params instanceof Array && item.params.length >0" v-for="(param,index) in item.params" :key="index" style="margin-bottom: 10px;padding-right: 10px">
                <el-row :span="24">
                    <el-col :span="10">
                        <el-select v-model="param.model" placeholder="请选择参数">
                            <el-option
                                v-for="col in dynCols"
                                :key="col.model"
                                :label="col.name"
                                :value="col.model">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10" style="margin-left: 5px;margin-right: 5px">
                        <el-select v-model="param.paramName" placeholder="请选择接收参数" >
                            <el-option
                                v-for="col in formDynCols"
                                :key="col.model"
                                :label="col.name"
                                :value="col.model">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" icon="el-icon-delete" circle @click.native="deleteParams(index)"></el-button>
                    </el-col>
                </el-row>

            </div>
        </div>


        <!-- 选择表单 -->
        <selectForm
            v-if="selectFormVisible"
            :formId="item.targetId"
            :visible.sync="selectFormVisible"
            @onData="SelectFormoData"
        ></selectForm>
    </div>
</template>

<script>
    import selectForm from "@/components/selectForm";
    export default {
        name: "FormInnerFormSet",
        components: {
            selectForm
        },
        props: ['item', 'dynCols'],
        created(){
            this.loadFormConf();
        },
        data() {
            return {
                selectFormVisible:false,
                formDynCols:[],
                formConfig: {},

            }
        },
        watch: {
            'item.targetId': {
                handler() {
                    this.loadFormConf();
                    this.$set(this.item,'params',[]);
                    this.$emit("notifyUpdateInnerComponent");
                }
            }
        },
        methods: {
            loadFormConf() {
                let _this = this;
                if (_this.KHUtils.isNull(_this.item.targetId)) {
                /*    _this.$notify.error({
                        title: '错误',
                        message: '请选择表单！'
                    });*/
                    return false;
                }
                if(_this.item.innerType != '2'){
                    return false;
                }
                _this.formDynCols = [];
                // 根据formId查询表单配置
                _this.$Get(_this.khConfig.api.getFormConf + "/" + _this.item.targetId).then(res => {
                    if (res.errCode === 0) {
                        if (!_this.KHUtils.isNull(res.formConf)) {
                            _this.formConfig = JSON.parse(res.formConf.formMeta);
                        /*    if (_this.KHUtils.isNull(_this.formConfig)) {
                                _this.$notify.warning({
                                    title: '警告',
                                    message: "表单ID(" + _this.item.targetId + "): 暂未进行相关的表单设计"
                                });
                            }*/
                            let tempConfig = JSON.parse(res.formConf.formMeta);
                            if (!tempConfig || _this.KHUtils.isNull(tempConfig.list)) {
                                return false;
                            }
                            // 遍历配置
                            for (let i = 0, n = tempConfig.list.length; i < n; i++) {
                                let obj = tempConfig.list[i];
                                if ("grid" === obj.type) {
                                    loop(obj, _this.formDynCols, _this);

                                    function loop(obj, arr, _this) {
                                        let columns = obj.columns;
                                        for (let j = 0, m = columns.length; j < m; j++) {
                                            let colObj = columns[j];
                                            colObj.list.forEach(lsObj => {

                                                if (lsObj.type === 'data_select' || lsObj.type === 'org_select'
                                                    || lsObj.type === 'user_select'
                                                    || lsObj.type === 'company_select'
                                                    || lsObj.type === 'role_select'
                                                    || lsObj.type === 'dic_select' || lsObj.type === 'current_user') {
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

                                } else {


                                    if (obj.type === 'data_select' || obj.type === 'org_select'
                                        || obj.type === 'user_select'
                                        || obj.type === 'company_select'
                                        || obj.type === 'role_select'
                                        || obj.type === 'dic_select' || obj.type === 'current_user') {
                                        _this.KHForm.processDataSourceControl(obj, _this.formDynCols, _this);
                                    } else if (obj.type === 'gis_select') {
                                        _this.KHForm.processGisControl(obj, _this.formDynCols, _this);
                                    } else if (obj.type === 'region_select') {
                                        _this.KHForm.processRegionControl(obj, _this.formDynCols, _this);
                                    } else {
                                        _this.formDynCols.push(obj);
                                    }
                                }
                            }


                        } else {
                           /* _this.$notify.warning({
                                title: '警告',
                                message: "表单ID(" + _this.item.targetId + "): 暂未进行相关的表单设计"
                            });*/
                        }
                    }


                });
            },
            addParams(){
                if(this.KHUtils.isNull(this.item.params)){
                    this.$set(this.item,'params',[]);
                }
                let obj = {model:"",paramName:""};
                this.item.params.push(obj);
            },
            deleteParams(index){
                if(this.item.params instanceof Array && this.item.params.length >0){
                    this.item.params.splice(index,1)
                }
            },
            //选择表单
            SelectFormoData(dataObj) {
                this.$set(this.item,'targetId',dataObj.formId);
                this.$set(this.item,'targetName',dataObj.formName);
                this.selectFormVisible = false;
            },
        }

    }
</script>

<style lang="scss" scoped>

</style>
