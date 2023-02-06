<template>
    <div>
        <el-row
            :key="item.model"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align">
            <el-row style="width: 100%">
                <el-row v-if="!isDetail" class="buttonBox">
                    <el-button @click="handleAdd" type="primary" size="mini">新增</el-button>
                    <el-button @click="handleBatchAdd" type="primary" size="mini">批量新增</el-button>
                    <el-button @click="handleBatchEdit" type="primary" size="mini">批量编辑</el-button>
                    <el-button @click="handleSelect" type="primary" size="mini" v-if="item.options.dsConf && item.options.dsConf.formId && item.options.dsConf != null">数据选择</el-button>

                    <el-button @click="handleDeleteMulti" type="primary" size="mini">批量删除</el-button>

                </el-row>
                <el-row style="padding-top: 5px;padding-bottom: 10px;">
                    <el-table
                        :data="tableData"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width:100%">
                        <el-table-column type="selection" width="55px"></el-table-column>
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

                                    <template
                                        v-if="(col.type == 'image_upload'|| col.type == 'signature') && !KHUtils.isNull(scope.row[col.model])">
                                        <el-image :key="index"
                                                  v-for="(imageId,index) in scope.row[col.model].split(',')"
                                                  :src="getImgeUrl(imageId)" class="image-icon"
                                                  @click="previewImage(imageId)">
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
                            label="操作"  v-if="!isDetail">
                            <template slot-scope="scope">
                                <el-button @click.stop="handleEdit(scope.row)" type="text"
                                           size="small">编辑
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p style="width: 96%;margin: 0 auto" >
                        <el-pagination
                            layout="prev, pager, next"
                            :page-size="queryParam.pageSize"
                            :current-page.sync="queryParam.pageNum"
                            @current-change="handleCurrentChange()"
                            :total="totalPage" style="float: right">
                        </el-pagination>
                    </p>
                </el-row>
            </el-row>
        </el-row>
        <el-row>
            <el-dialog top="10vh"  class="dialog-subform"  :title="childFormTitle" :visible.sync="childFormVisible"
                       :close-on-click-modal="false" append-to-body width="60%" >
                <form-build
                    v-if="hackReset"
                    :formId="formId"
                    :data.sync="childFormConfig"
                    :value.sync="childDataModels"
                    :addOrEdit.sync="childAddOrEdit"
                    :allCols="allCols"
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
            <preview-image-dialog :visible.sync="imageDialogVisible" :imageId="imageId"></preview-image-dialog>

            <el-dialog top="10vh" title="数据选择" :visible.sync="formDataSelectDialogVisible"  v-if="formDataSelectDialogVisible && item.options.dsConf && item.options.dsConf.formId && item.options.dsConf != null"
                       :close-on-click-modal="false" append-to-body width="60%"    custom-class="advanced-set-dialog">
                <form-data-select :formId= "formId" :subKey="item.key" :destFormId="item.options.dsConf.formId" :destSubKey ="item.options.dsConf.subKey" :columns="item.options.dsConf.columns" @closeDialog="closeFormDataSelectDialog"
                                  @selectFormData="selectFormData" :conditions="item.options.dsConf.conditions"></form-data-select>

            </el-dialog>
            <el-dialog top="10vh" :title="isBatchAdd?'批量新增':'批量编辑'" :visible.sync="batchAddDataDialogVisible" v-if="batchAddDataDialogVisible"
                     append-to-body  width="60%"    custom-class="advanced-set-dialog">
                <batch-add-sub-table-data :formId="formId" :selectDatas="selectDatas" @closeDialog="closeBatchAddSubTableDialog" :allCols="allCols" :isBatchAdd="isBatchAdd" :parentId="parentId" @batchProcess="batchProcess"></batch-add-sub-table-data>
            </el-dialog>
        </el-row>
    </div>
</template>

<script>
    import FormBuildItem from '@/components/form-build/RestructureFormBuildItem';
    import FormBuild from '@/components/form-build/RestructureFormBuild';
    import PreviewImageDialog from "@/components/PreviewImageDialog.vue";
    import FormDataSelect from "@/components/table/FormDataSelect.vue";
    import BatchAddSubTableData from "@/components/table/BatchAddSubTableData.vue";


    export default {
        name: 'SingleTable', // 子表单数据提交的方式为单条
        components: {
            FormBuildItem,
            FormBuild,
            PreviewImageDialog,
            FormDataSelect,
            BatchAddSubTableData
        },
        // item:子表单配置; (必填)
        // dataConfig:{labelWidth: 100, labelPosition: 'right',  size: 'small'},配置(必填)
        // formId:父表单ID(必填)
        // parentId:父表单的业务ID(必填)
        props: ['item', 'dataConfig', 'formId', 'parentId','isDetail'],

        created() {
            let _this = this;
            _this.initTableForm();
            if (!_this.KHUtils.isNull(_this.parentId) && !_this.KHUtils.isNull(_this.formId) && _this.parentId !== 0) {
                // 查询子表单的业务数据
                _this.listTableData();
            }
        },

        data() {
            return {
                tableData: [],
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
                childFormConfig: {},
                childDataModels: {},
                childAddOrEdit: false,
                childSaveLoading: false,
                childFormTitle: "",
                childFormVisible: false,
                childBusinessId: "", // 子表单业务数据ID
                childFormKey: "", // 子表单Key

                imageDialogVisible: false,
                imageId: '',
                formDataSelectDialogVisible:false,
                batchAddDataDialogVisible:false,
                selectDatas:[],
                isBatchAdd:true
            }
        },
        computed: {
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
        mounted() {
        },

        methods: {
            batchProcess(datas){
                let _this = this;
                if(datas instanceof Array && datas.length >0){
                    let title = "";
                    if(_this.isBatchAdd == true){
                        title = "是否确认新增数据?";
                    }else {
                        title = "是否确认修改数据?";
                    }
                    this.$confirm(title, '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        datas.forEach((data,index)=>{
                            this.convertParam(data);
                        });
                        let newDatas = [];
                        //剔除为null的数据
                        if(datas instanceof Array && datas.length >0){
                            datas.forEach((data,index)=>{
                                let newObj = {};
                                Object.keys(data).forEach(function (key) {
                                    if(data[key] != null){
                                        newObj[key] = data[key];
                                    }
                                });
                                newDatas.push(newObj);
                            })
                        }
                        if(_this.isBatchAdd == true){
                            _this.batchAddSubTableData(newDatas);
                        }else {
                            //批量编辑
                            _this.batchEditSubTableData(newDatas);
                        }

                    }).catch((e) => {
                        console.log(e)
                    });


                }


            },
            convertParam(object){
                for(let key of Object.keys(object)){
                    let value = object[key];
                    if(value instanceof Array){
                        object[key] = value.join(",");
                    }else if(value instanceof Object){
                        delete object[key];
                        for (let valueKey of Object.keys(value)){
                            object[valueKey] = value[valueKey];
                        }
                    }
                }
            },
            //批量新增
            batchAddSubTableData(datas){
                let _this = this;
                let param = {
                    parentId:_this.parentId,
                    subDatas:[]
                };
                param.subDatas = datas;
                _this.$PostJson(_this.khConfig.api.batchaddsubformdata + "/" + _this.formId + "/" + _this.item.key, param).then(res => {
                    if (res.errCode === 0) {
                        _this.listTableData();
                        this.$message({
                            type: 'success',
                            message: '添加成功!'
                        });
                    }
                });
            },
            //批量编辑
            batchEditSubTableData(datas){
                let _this = this;
                let param = {
                    parentId:_this.parentId,
                    subDatas:[]
                };
                param.subDatas = datas;
                _this.$PostJson(_this.khConfig.api.batchupdatesubformdata + "/" + _this.formId + "/" + _this.item.key, param).then(res => {
                    if (res.errCode === 0) {
                        _this.listTableData();
                        this.$message({
                            type: 'success',
                            message: '修改成功!'
                        });
                    }
                });
            },
            //批量新增
            handleBatchAdd(){
                let _this = this;
                if (_this.KHUtils.isNull(_this.parentId) || _this.parentId === 0) {
                    _this.$notify({
                        title: '警告',
                        message: '请先填写父表单数据并提交',
                        type: 'warning'
                    });
                    return false;
                }
                if (this.KHUtils.isNull(this.childFormConfig)) {
                    this.$notify({
                        title: '警告',
                        message: _this.item.name + '未添加任何控件',
                        type: 'warning'
                    });
                    return false;
                }
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
                _this.selectDatas = [];
                _this.KHForm.selectDataMapping(_this,_this.allCols,datas,_this.selectDatas,_this.item);
                _this.isBatchAdd = true;
                _this.batchAddDataDialogVisible = true;

            },
            //找到选择数据的映射关系
            findMapping(key){
                let _this = this;
                let mapping = _this.item.options.dsConf.mapping;
                if(mapping instanceof Array && mapping.length >0){
                    for(var i = 0;i<mapping.length;i++){
                        let dk = mapping[i].dk;
                        if(key == dk){
                            return mapping[i].mapping;
                        }
                    }
                }
                return null;
            },
            closeFormDataSelectDialog(){
                this.formDataSelectDialogVisible = false;
            },
            closeBatchAddSubTableDialog(){
                this.batchAddDataDialogVisible = false
            },
            handleSelect(){
                let _this = this;
                if (_this.KHUtils.isNull(_this.parentId) || _this.parentId === 0) {
                    _this.$notify({
                        title: '警告',
                        message: '请先填写父表单数据并提交',
                        type: 'warning'
                    });
                    return false;
                }
                this.formDataSelectDialogVisible = true;
            },



            previewImage(imageId){
                this.imageId = imageId;
                this.imageDialogVisible = true
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
                    _this.childFormConfig = formConfig;
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
                                || obj.type === 'dic_select'
                                || obj.type === 'current_user') {
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
                if (_this.KHUtils.isNull(_this.parentId) || _this.parentId === 0) {
                    _this.$notify({
                        title: '警告',
                        message: '请先填写父表单数据并提交',
                        type: 'warning'
                    });
                    return false;
                }
                if (this.KHUtils.isNull(this.childFormConfig)) {
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
            handleEdit(row) {
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
                // 重新渲染子组件
                this.$nextTick(() => {
                    this.hackReset = true
                });
            },
            // 保存数据
            save() {
                let _this = this;
                this.$refs.childBuildForm.getData().then(data => {
                    this.$confirm('确认保存吗？', '提示', {}).then(() => {
                        this.KHForm.formatDynCols(data, this.khConfig.host.rest + this.khConfig.api.imageDownload, _this.allCols);
                        let url;
                        if (!this.KHUtils.isNull(this.childBusinessId)) {
                            data.id = this.childBusinessId;
                            url = this.khConfig.api.updateSubFormData
                        } else {
                            url = this.khConfig.api.addSubFormData
                        }
                        this.childSaveLoading = true;
                        data.parentId = this.KHUtils.isNull(this.parentId) ? this.businessId : this.parentId;  // 父表单ID
                        let paramArray = [];
                        Object.keys(data).forEach(function (key) {
                            paramArray.push(key + "=" + data[key]);
                        });
                        paramArray = paramArray.join("&");
                        this.$Post(url + "/" + this.formId + "/" + this.childFormKey, paramArray).then(res => {
                            if (res.errCode === 0) {
                                this.$notify({
                                    title: '成功',
                                    message: '保存成功',
                                    type: 'success'
                                });
                            }
                            this.childFormVisible = false;
                            this.listTableData(this.childFormKey);
                        })
                    }).catch((e) => {
                        console.log(e)
                    });
                    this.childSaveLoading = false;
                }).catch((e) => {
                    console.log(e)
                })
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
                                    if(_this.multipleSelection.length == _this.tableData.length &&   _this.queryParam.pageNum >1){
                                        _this.queryParam.pageNum -- ;
                                    }
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
    // ::v-deep .dialog-subform {
   ::v-deep .el-dialog{
     box-sizing: border-box;
      .el-dialog__body {
        padding: 15px;
        max-height:70vh;
        overflow: hidden;
        overflow-y:auto;

        // margin-bottom: 15px;;
      }
    }
//   }
</style>
