<template>
    <div>
        <el-row
            :key="item.model"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align">
            <el-row style="width: 100%">
                <el-row class="buttonBox">
                    <el-button @click="handleAdd" type="primary" size="mini">新增</el-button>
                    <el-button @click="handleBatchAdd" type="primary" size="mini">批量新增</el-button>
                   <!-- <el-button @click="handleBatchEdit" type="primary" size="mini">批量编辑</el-button>-->
                    <el-button @click="handleSelect" type="primary" size="mini" v-if="item.options.dsConf && item.options.dsConf.formId && item.options.dsConf != null && item.options.dsConf.defaultSelect != true">数据选择</el-button>
                 <!--   <el-button @click="handleDeleteMulti" type="primary" size="mini">删除</el-button>-->
                </el-row>
                <el-row style="padding-top: 5px;padding-bottom: 10px;">
                    <el-table
                        :data="tableData"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 100%">
                      <!--  <el-table-column type="selection" width="55px"></el-table-column>-->
                        <el-table-column label="序号" width="60px" type="index">
                        </el-table-column>
                        <template v-for='(col) in dynCols'>
                            <el-table-column
                                sortable
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                                :formatter="formatCustom">

                                <template slot-scope="scope">

                                    <template v-if="(col.type == 'image_upload' ||col.type == 'signature') && !KHUtils.isNull(scope.row[col.model]) && !(scope.row[col.model] instanceof Array)">
                                        <el-image :key="index" v-for="(imageId,index) in scope.row[col.model].split(',')"   :src="getImgeUrl(imageId)" class="image-icon" >
                                            <div slot="error" class="image-slot">
                                                <i class="el-icon-picture-outline"></i>
                                            </div>
                                        </el-image>
                                    </template>
                                    <template v-else-if="(col.type == 'switch' )">
                                        <span>{{scope.row[col.model] == '0'?'已开启':'已关闭' }}</span>
                                    </template>
                                    <template v-else-if="(col.type == 'calculate_formula' )">
                                        <span>{{getCalculateFormulaValue(col,scope.row[col.model])}}</span>
                                    </template>
                                    <span v-else>{{scope.row[col.model] | arrayJsonVal }}</span>
                                </template>
                            </el-table-column>
                        </template>
                        <el-table-column
                            fixed="right"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button @click.stop="handleEdit(scope.$index,scope.row)" type="text"
                                           size="small">编辑
                                </el-button>
                                <el-button @click.stop="deleteRow(scope.$index,scope.row)" type="text"
                                           size="small">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-row>
            </el-row>
        </el-row>
        <el-row>
            <el-dialog top="10vh" width="60%" :title="childFormTitle" :visible.sync="childFormVisible" :modal="true" v-if="childFormVisible"
                       :close-on-click-modal="false" append-to-body>
                <form-build
                    v-if="hackReset"
                    :formId="formId"
                    :data.sync="formConfig"
                    :value.sync="childDataModels"
                    :allCols="allCols"
                    :addOrEdit.sync="childAddOrEdit"
                    ref="childBuildForm">
                    <template v-slot:blank="scope">
                        宽度：
                        <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                        高度：
                        <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                    </template>
                </form-build>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="save" :loading="childSaveLoading">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog top="10vh" title="数据选择" :visible.sync="formDataSelectDialogVisible" :modal="false" v-if="formDataSelectDialogVisible && item.options.dsConf && item.options.dsConf.formId && item.options.dsConf != null"
                       :close-on-click-modal="false" append-to-body width="60%"    custom-class="advanced-set-dialog">
                <form-data-select  :formId= "formId" :subKey="item.key"  :destFormId="item.options.dsConf.formId" :destSubKey ="item.options.dsConf.subKey" :columns="item.options.dsConf.columns" @closeDialog="closeFormDataSelectDialog"
                                  @selectFormData="selectFormData" :isDefaultSelect="item.options.dsConf.defaultSelect" :conditions="item.options.dsConf.conditions"></form-data-select>

            </el-dialog>
            <el-dialog top="10vh" :title="isBatchAdd?'批量新增':'批量编辑'" :visible.sync="batchAddDataDialogVisible" :modal="false" v-if="batchAddDataDialogVisible"
                       :close-on-click-modal="false" append-to-body width="60%"    custom-class="advanced-set-dialog">
                <batch-add-sub-table-data :formId="formId" :selectDatas="selectDatas" @closeDialog="closeBatchAddSubTableDialog" :allCols="allCols" :isBatchAdd="isBatchAdd" @batchProcess="batchProcess"></batch-add-sub-table-data>
            </el-dialog>
        </el-row>
    </div>
</template>

<script>
    import FormBuildItem from '@/components/form-build/RestructureFormBuildItem';
    import FormBuild from '@/components/form-build/RestructureFormBuild';
    import FormDataSelect from "@/components/table/FormDataSelect.vue";
    import BatchAddSubTableData from "@/components/table/BatchAddSubTableData.vue";

    export default {
        name: 'AddSingleTable', // 子表单数据提交的方式为单条
        components: {
            FormBuildItem,
            FormBuild,
            FormDataSelect,
            BatchAddSubTableData
        },
        // item:子表单配置; (必填)
        // dataConfig:{labelWidth: 100, labelPosition: 'right',  size: 'small'},配置(必填)
        // formId:父表单ID(必填)
        // parentId:父表单的业务ID(必填)
        props: ['formId','item', 'dataConfig','tableData'],

        created() {
            let _this = this;
            _this.initTableForm();
            //默认赋值
            if(_this.item.options.dsConf.defaultSelect == true){
                _this.handleSelect();
            }

        },

        data() {
            return {
                queryParam: {
                    pageNum: 1,
                    pageSize: 5
                },
                totalPage: 0,
                multipleSelection: [],
                switchMsgObj: {}, // 开关
                allCols: [],
                dynCols: [],
                hackReset: false,
                formConfig: {},
                childDataModels: {},
                childAddOrEdit: false,
                childSaveLoading: false,
                childFormTitle: "",
                childFormVisible: false,
                childBusinessId: "", // 子表单业务数据ID
                childFormKey: "", // 子表单Key


                formDataSelectDialogVisible:false,
                batchAddDataDialogVisible:false,
                selectDatas:[],
                isBatchAdd:true,
                updateIndex:0
            }
        },

        mounted() {
        },
        computed:{
            getImgeUrl(){
                return function (imageUrl) {
                    //如果是完整图片路径直接返回 ，如果是uuid 就补齐路径
                    if(this.KHUtils.isUrlPath(imageUrl) == true){
                        return imageUrl;
                    }else {
                        return this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + imageUrl;
                    }

                }
            },
            getCalculateFormulaValue(){
                return function (col,value) {
                    return this.KHForm.getCalculateFormulaValue(col,value,this);
                }

            }
        },

        methods: {
            batchProcess(datas){
                if(datas instanceof Array && datas.length >0){
                    datas.forEach((data,index)=>{
                        this.convertParam(data);
                        this.tableData.push(data);
                    })

                }
            },
            //批量新增
            handleBatchAdd(){
                let _this = this;
                _this.selectDatas = [];
                _this.isBatchAdd = true;
                _this.batchAddDataDialogVisible = true;

            },
            //批量编辑
            handleBatchEdit(){
                let _this = this;
                _this.isBatchAdd = false;
                _this.selectDatas = [];
                if (!_this.multipleSelection || _this.multipleSelection === "" || _this.multipleSelection.length === 0) {
                    this.$notify({
                        title: '警告',
                        message: '请选择需要编辑的数据',
                        type: 'warning'
                    });
                } else {
                    _this.KHForm.convertFormData(_this.allCols, _this.multipleSelection, _this.selectDatas);
                    _this.batchAddDataDialogVisible = true;

                }

            },
            //数据选择返回数据
            selectFormData(datas){
                let _this = this;
                if(_this.item.options.dsConf.defaultSelect == true){
                    let defaultDatas = [];
                    _this.KHForm.selectDataMapping(_this,_this.allCols,datas,defaultDatas,_this.item);
                    if(defaultDatas instanceof Array && defaultDatas.length >0){
                        defaultDatas.forEach((data,index)=>{
                            this.convertParam(data);
                            this.tableData.push(data);
                        })

                    }
                }else {
                    _this.selectDatas = [];
                    _this.KHForm.selectDataMapping(_this,_this.allCols,datas,_this.selectDatas,_this.item);
                    _this.isBatchAdd = true;
                    _this.batchAddDataDialogVisible = true;
                }


            },

            closeFormDataSelectDialog(){
                this.formDataSelectDialogVisible = false;
            },
            closeBatchAddSubTableDialog(){
                this.batchAddDataDialogVisible = false
            },

            handleSelect(){
                this.formDataSelectDialogVisible = true;
            },


            deleteRow(index,row){
                this.tableData.splice(index,1);
            },
            // 初始化子表单配置
            initTableForm() {
                let _this = this;
                if (!_this.item.formConfig) {
                    initFormConfig(_this.item, this.dataConfig, _this);
                }
                initDynCols(_this.item, this);

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
                    _this.formConfig = formConfig;
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
                                || obj.type === 'dic_select'|| obj.type === 'current_user') {
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
            // 查询列表数据
            listTableData() {
                let _this = this;
                _this.tableData = [];
                _this.queryParam.parentId = _this.parentId;
                _this.$Get(_this.khConfig.api.querySubFormData + "/" + _this.formId + "/" + _this.item.key, _this.queryParam).then(res => {
                    if (res.datas) {
                        _this.tableData = res.datas;
                        _this.totalPage = res.totalCount;
                    }
                });
            },
            // 分页查询
            handleCurrentChange() {
                this.listTableData();
            },
            // 预新增数据处理
            handleAdd() {
                let _this = this;
                if (this.KHUtils.isNull(this.formConfig)) {
                    this.$notify({
                        title: '警告',
                        message: item.name + '未添加任何控件',
                        type: 'warning'
                    });
                    return false;
                }
                this.childSaveLoading = false;
                this.childFormKey = _this.item.key;
                this.hackReset = false;
                this.childAddOrEdit = true;
                this.childFormVisible = true;
                this.childFormTitle = "新增" + _this.item.name;
                this.childDataModels = {};
                this.childBusinessId = "";
                // 重新渲染子组件
                this.$nextTick(() => {
                    this.hackReset = true
                });
            },
            // 预编辑数据处理
            handleEdit(index,row) {
                let _this = this;
                let tempRow = _this.KHUtils.clone(row);
                _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                this.childDataModels = tempRow;
                this.childBusinessId = row.id;
                this.childSaveLoading = false;
                this.hackReset = false;
                this.childAddOrEdit = false;
                this.childFormVisible = true;
                this.childFormKey = _this.item.key;
                this.childFormTitle = "编辑" + _this.item.name;
                this.updateIndex = index;
                // 重新渲染子组件
                this.$nextTick(() => {
                    this.hackReset = true
                });
            },
            // 保存数据
            save() {
                let _this = this;
                if(_this.childAddOrEdit == true){
                    this.$refs.childBuildForm.getData().then(data => {
                        _this.convertParam(data);
                        _this.tableData.push(data);
                        _this.childFormVisible = false;
                    }).catch((e) => {
                        console.log(e)
                    })
                }else {
                    //修改
                    this.$refs.childBuildForm.getData().then(data => {
                        _this.convertParam(data);
                        _this.tableData.splice(this.updateIndex,1,data);
                        _this.childFormVisible = false;
                    }).catch((e) => {
                        console.log(e)
                    })
                }

            },
            convertParam(object){
                for(let key of Object.keys(object)){
                    let value = object[key];
                    //开关控件值特殊处理
                    if(typeof value === 'boolean'){
                        if(value == true){
                            object[key] = "0"
                        }else {
                            object[key] = "1";
                        }
                    }else if(value instanceof Array){
                        object[key] = value.join(",");
                    }else if(value instanceof Object){
                        for (let valueKey of Object.keys(value)){
                            object[valueKey] = value[valueKey];
                        }
                    }

                }
            },
            // Check列表数据
            handleSelectionChange(array) {
                this.multipleSelection = array;
            },
            // 单条: 删除选中的多条记录
            handleDeleteMulti() {
                let _this = this;
                if (!_this.multipleSelection || _this.multipleSelection === "" || _this.multipleSelection.length === 0) {
                    this.$notify({
                        title: '警告',
                        message: '请选择' + _this.item.name + '要删除的记录',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确认删除该记录吗?', '提示', {}).then(() => {
                        let readyToDeleteIds = "";
                        if (_this.multipleSelection instanceof Array) {
                            for (let ms of _this.multipleSelection) {
                                readyToDeleteIds += ms.id + ","
                            }
                        } else {
                            readyToDeleteIds = _this.multipleSelection.id;
                        }
                        let param = {
                            businessIds: readyToDeleteIds
                        };
                        this.$Get(this.khConfig.api.batchDeleteSubFormData + "/" + _this.formId + "/" + _this.item.key, param)
                            .then(res => {
                                if (res.errCode === 0) {
                                    _this.listTableData();
                                    this.$notify({
                                        title: '成功',
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                }
                            })
                    }).catch((e) => {
                        console.log(e)
                    });
                }
            },
            // 列表显示格式化
            formatCustom(row, column) {
                let _this = this;
                return _this.KHForm.formatCustom(row, column, _this);
            },
            // 获取表单填写数据
            getData() {
                let _this = this;
                return new Promise((resolve, reject) => {
                    _this.$refs.buildForm.validate(valid => {
                        if (valid) {
                            resolve(_this.models);
                        } else {
                            reject(new Error('表单数据校验失败').message);
                        }
                    })
                })
            },
            // 重置表单
            reset() {
                let _this = this;
                _this.$refs.buildForm.resetFields();
            },
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/dialog-maxheight.scss";
    .image-icon{
        width: 35px;
        height: 35px;
        margin-right: 10px;
    }

    ::v-deep .advanced-set-dialog {
        .el-dialog__body {
            padding: 0px 0px !important;
            background-color: #FFFFFF;
            overflow-y: auto !important;

            /*滚动条里面小方块*/
            &::-webkit-scrollbar-thumb {
                background-color: #EBEAEF;
                border-radius: 10px;
            }
            /*滚动条整体样式*/
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            /*滚动条里面轨道*/
            &::-webkit-scrollbar-track {
                background: #FFFFFF;
                border-radius: 10px;
            }
        }

        .el-dialog__header {
            background-color: #E6EBFE;
            border-bottom: 1px solid #E8E8E8;
            padding-left: 10px !important;
            padding-top: 15px !important;
            padding-bottom: 15px !important;
        }

        .el-dialog__footer {
            padding-top: 5px;
            padding-bottom: 5px;
            background-color: #F8F8FA !important;
        }
    }
</style>
