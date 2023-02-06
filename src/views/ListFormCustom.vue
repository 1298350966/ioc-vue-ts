<template>
    <section v-if="addShowNormal">
        <!--查询条件渲染-->
        <el-row>
            <form-build-cond
                v-if="condSetHackRest"
                :data.sync="condFormConfig"
                :value.sync="queryDataModels"
                @resetCond="resetCond"
                @queryByCond="queryByCond(false)"
                ref="condSetForm">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build-cond>
        </el-row>
        <!--功能按钮渲染-->
        <el-row>
            <el-button @click="handleExport" :loading="exportLoading" v-if="isShowFunExport">导出</el-button>
            <el-button @click="getExcelTemplate" v-if="isShowFunImport">模板下载</el-button>
            <el-button @click="handleAdd" v-if="isShowFunAdd">新增</el-button>
            <el-button @click="handleDeleteMulti" :loading="delLoading" v-if="isShowFunRemove">删除</el-button>
            <div v-if="isShowFunImport" style="float: left;margin-right: 10px">
                <el-upload
                    class="upload"
                    :action="uploadUrl"
                    :multiple="false"
                    :on-success="uploadCall"
                    :on-error="uploadError"
                    :before-upload="beforeUpload"
                    :show-file-list="false"
                >
                    <el-button :loading="importLoading">导入</el-button>
                </el-upload>
            </div>
        </el-row>
        <!--列表、操作按钮渲染-->
        <el-row>
            <el-table
                v-loading="tdLoading"
                :data="tableData"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                style="width: 96%"
            >
                <el-table-column type="selection" width="55px" v-if="isShowChecked"></el-table-column>
                <el-table-column label="序号" width="60px" type="index" v-if="isShowSeq">
                </el-table-column>
                <template v-for='(col) in colsArray'>
                    <template v-if="col.isJump">
                        <el-table-column
                            sortable
                            :prop="col.model"
                            :label="col.name"
                            :key="col.model"
                            :formatter="formatCustom">
                            <template slot-scope="scope">
                                <a href="javascript:void(0)" @click="handleCustomJump(scope.row,col)">{{scope.row[col.model]}}</a>
                            </template>
                        </el-table-column>
                    </template>
                    <template v-else>
                        <el-table-column
                            sortable
                            :prop="col.model"
                            :label="col.name"
                            :key="col.model"
                            :formatter="formatCustom">
                        </el-table-column>
                    </template>
                </template>
                <el-table-column
                    fixed="right"
                    label="操作" v-if="isShowOpt">
                    <template slot-scope="scope">
                        <el-button @click.stop="handleEdit(scope.row)" type="text" size="small"
                                   v-if="isShowOptEdit">编辑
                        </el-button>
                        <el-button @click.stop="batchDel(scope.row)" type="text" size="small"
                                   v-if="isShowOptDelete">删除
                        </el-button>
                        <template v-for='(opt,index) in customOptList'>
                            <template v-if="opt.isImage">
                                <img alt=" " :key="index" :src="opt.imageId"
                                     @click.stop="handleCustomJump(scope.row,opt)"
                                     style="width: 16px;height: 16px;margin-top: 7px"/>
                            </template>
                            <template v-else>
                                <el-button :key="index" @click.stop="handleCustomJump(scope.row,opt)" type="text"
                                           size="small">
                                    {{opt.imageId}}
                                </el-button>
                            </template>
                        </template>
                    </template>
                </el-table-column>
            </el-table>
            <p style="width: 96%;margin: 0 auto">
                <el-pagination
                    layout="prev, pager, next"
                    :current-page="queryParam.pageNum"
                    @current-change="handleCurrentChange"
                    :total="totalPage" style="float: right">
                </el-pagination>
            </p>
        </el-row>
        <!--新增、编辑-->
        <!--<el-dialog :title="formTitle" :visible.sync="editFormVisible" :close-on-click-modal="false" :modal="false"
                   width="80%"
                   class="custom-dialog-form">
            <form-build
                v-if="hackReset"
                :data.sync="formConfig"
                :value.sync="dataModels"
                :addOrEdit.sync="addOrEdit"
                ref="buildForm">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build>
            <el-button type="primary" @click="saveData" :loading="nextLoading" :disabled="parentSaveDisable"
                       style="position: relative;left: 95%">
                保存
            </el-button>
            <template v-if="tableFormConfig.length > 0 && formConfig.sensorSettingsV2 &&   formConfig.sensorSettingsV2.tableShowType === 'transverse'">
                <el-tabs v-model="formActiveName">
                    <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model"
                                 :key="item.model">
                        <single-table v-if="hackReset" :item="item" :data-config="formConfig.config"
                                      :form-id="parentFormId"
                                      :parent-id="parentBusinessId"></single-table>
                    </el-tab-pane>
                </el-tabs>
            </template>
            <template v-else>
                <template v-for="item in tableFormConfig">
                    <single-table v-if="hackReset" :item="item" :data-config="formConfig.config" :form-id="parentFormId"
                                  :parent-id="parentBusinessId"></single-table>
                </template>
            </template>
        </el-dialog>-->
        <el-dialog :title="formTitle" :visible.sync="editFormVisible" :close-on-click-modal="false" v-if="editFormVisible"
                   :append-to-body="true"
                   width="60%"
                   :id="formId"
                   class="edit-form-dialog">
            <template v-if="addOrEdit == true">
                <template v-if="tableShowType === 'transverse'">
                    <form-build
                        v-if="hackReset"
                        :data.sync="formConfig"
                        :value.sync="dataModels"
                        :addOrEdit.sync="addOrEdit"
                        :allCols="allCols"
                        :form-id="formId"
                        ref="buildForm">
                        <template v-slot:blank="scope">
                            宽度：
                            <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                            高度：
                            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                        </template>
                    </form-build>

                    <template v-if="tableFormConfig.length > 0 ">
                        <el-tabs v-model="formActiveName">
                            <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model"
                                         :key="item.model">
                                <add-single-table :formId="parentFormId"  :item="item" :data-config="formConfig.config" :tableData="item.subData"
                                ></add-single-table>
                            </el-tab-pane>
                        </el-tabs>
                    </template>

                    <el-button type="primary" @click="saveAddData" :loading="nextLoading"
                               style="position: relative;left: 90%">保存
                    </el-button>
                </template>
                <template v-else>
                    <portrait-restructure-form-build
                        v-if="hackReset"
                        :data.sync="formConfig"
                        :value.sync="dataModels"
                        :addOrEdit.sync="addOrEdit"
                        :allCols="allCols"
                        :form-id="formId"
                        :tableFormConfig="tableFormConfig"
                        :parentBusinessId="parentBusinessId"
                        ref="buildForm"
                    >
                        <template v-slot:blank="scope">
                            宽度：
                            <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                            高度：
                            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                        </template>
                    </portrait-restructure-form-build>
                    <el-button type="primary" @click="saveAddData" :loading="nextLoading"
                               style="position: relative;left: 90%">保存
                    </el-button>
                </template>




            </template>
            <template v-if="addOrEdit == false">
                <template v-if="tableShowType === 'transverse'">
                    <form-build
                        v-if="hackReset"
                        :data.sync="formConfig"
                        :value.sync="dataModels"
                        :addOrEdit.sync="addOrEdit"
                        :allCols="allCols"
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
                    <template v-if="tableFormConfig.length > 0">
                        <el-tabs v-model="formActiveName">
                            <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model"
                                         :key="item.model">
                                <single-table v-if="hackReset" :item="item" :data-config="formConfig.config"
                                              :form-id="parentFormId"
                                              :parent-id="parentBusinessId"></single-table>
                            </el-tab-pane>
                        </el-tabs>
                    </template>
                </template>
                <template v-else>
                    <portrait-restructure-form-build
                        v-if="hackReset"
                        :data.sync="formConfig"
                        :value.sync="dataModels"
                        :addOrEdit.sync="addOrEdit"
                        :allCols="allCols"
                        :form-id="formId"
                        :tableFormConfig="tableFormConfig"
                        :parentBusinessId="parentBusinessId"
                        ref="buildForm"
                    >
                        <template v-slot:blank="scope">
                            宽度：
                            <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                            高度：
                            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                        </template>
                    </portrait-restructure-form-build>
                    <el-button type="primary" @click="saveData" :loading="nextLoading" :disabled="parentSaveDisable"
                               style="position: relative;left: 90%">保存
                    </el-button>
                </template>
            </template>
        </el-dialog>
        <!--列表字段点击弹窗-->
        <el-dialog :title="customTitle" :visible.sync="customVisible" v-if="customVisible" :close-on-click-modal="false" width="80%"
                   :modal="false"
                   class="custom-dialog-form">
            <component :is="customComponent" v-bind="customProps" v-if="customHackSet"></component>
            <iframe v-if="customUrl !== ''" :src="customUrl"
                    style="width: 100%;height: 100%;overflow: auto"></iframe>
        </el-dialog>
    </section>
    <!--普通新增页面,不弹窗的形式-->
    <section v-else>
        <div>
            <el-page-header @back="normalReturn" :content="formTitle">
            </el-page-header>
        </div>
        <el-row style="padding-top: 20px">
            <form-build
                v-if="normalHackReset"
                :data.sync="formConfig"
                :value.sync="dataModels"
                :addOrEdit.sync="addOrEdit"
                ref="buildForm">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build>
            <el-row style="margin-left: 40%">
                <el-button type="info" @click.native="normalReturn">返回</el-button>
                <el-button type="primary" @click.native="saveData" :loading="nextLoading" :disabled="parentSaveDisable">
                    保存
                </el-button>
            </el-row>
            <template v-if="tableFormConfig.length > 0 && formConfig.sensorSettingsV2 && formConfig.sensorSettingsV2.tableShowType === 'transverse'">
                <el-tabs v-model="formActiveName">
                    <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model"
                                 :key="item.model">
                        <single-table v-if="normalHackReset" :item="item" :data-config="formConfig.config"
                                      :form-id="parentFormId"
                                      :parent-id="parentBusinessId"></single-table>
                    </el-tab-pane>
                </el-tabs>
            </template>
            <template v-else>
                <template v-for="item in tableFormConfig">
                    <single-table v-if="normalHackReset" :item="item" :data-config="formConfig.config"
                                  :form-id="parentFormId"
                                  :parent-id="parentBusinessId"></single-table>
                </template>
            </template>
        </el-row>
    </section>
</template>
<script>
    //import FormBuild from "@/components/form-build/FormBuild";
    import FormBuild from "@/components/form-build/RestructureFormBuild";
    import PortraitRestructureFormBuild from "@/components/form-build/PortraitRestructureFormBuild";
    import PortraitRestructureFormDetailBuild from "@/components/form-build/PortraitRestructureFormDetailBuild";
    import FormDetailBuild from "@/components/form-build/RestructureFormDetailBuild";
    import SingleTable from "@/components/table/SingleTable";
    import AddSingleTable from "@/components/table/AddSingleTable";
    import BatchTable from "@/components/table/BatchTable";

    export default {
        name: "ListFormCustom",
        components: {
            FormBuild,
            SingleTable,
            BatchTable,
            FormDetailBuild,
            AddSingleTable,
            PortraitRestructureFormBuild,
            PortraitRestructureFormDetailBuild
        },
        // formId: 指定弹出框的fromId
        // businessId: 关联数据的业务ID
        props: ['formId', 'listBusinessId'],
        created() {
            let _this = this;
            if (_this.KHUtils.isNull(_this.formId)) {
                _this.$notify.error({
                    title: '错误',
                    message: 'ListFormCustom组件接收的参数【formId】为空'
                });
                return false;
            }
            if (_this.KHUtils.isNull(_this.listBusinessId)) {
                _this.$notify.error({
                    title: '错误',
                    message: 'ListFormCustom组件接收的参数【listBusinessId】为空'
                });
                return false;
            }
            _this.KHForm.loadFormConf(_this, _this.formId);
        },
        data() {
            return {
                customTitle: "", // 弹窗名称
                customVisible: false,
                customComponent: "",
                customProps: {},
                customHackSet: false,
                customUrl: "", // 默认弹窗
                // 操作按钮自定义跳转
                customOptList: [], // 除编辑、删除操作外,其他自定义操作的集合
                allCols: [], // 所有拉取的控件
                tableFormConfig: [],  // 子表单控件集合
                formActiveName: "", // 子表单页签
                addShowNormal: true, // 新增页面以非弹窗,即普通方式展示
                importExcelFileId: "", // 导出Excel文件ID
                parentSaveDisable: false,
                parentFormId: 0,
                parentBusinessId: 0,
                tdLoading: false,
                uploadUrl: "",
                importLoading: false,
                exportLoading: false,
                excelFileId: "", // 导出Excel文件ID
                queryDataModels: {},
                multipleSelection: [],
                delLoading: false,
                tableData: [],
                formTitle: "新增",
                editFormVisible: false,
                formConfig: {},
                dataModels: {},
                blank: '',
                nextLoading: false,
                queryParam: {
                    pageNum: 1    // 查询参数
                },
                totalPage: 0,
                normalHackReset: false,
                hackReset: false,
                businessId: "",  // 业务ID
                // formId: 0,  // 表单ID
                addOrEdit: false,
                dynCols: [],  // 动态列
                switchMsgObj: {},
                isShowSeq: false, // 表格是否显示序号
                isShowChecked: false, // 表格是否显示Checked框
                isShowOpt: false, // 表格预览是否显示操作
                condFormConfig: {
                    list: [],
                    config: {
                        labelWidth: 100,
                        labelPosition: 'right',
                        size: 'small'
                    }
                }, // 查询条件设置
                queryConditions: {},
                condSetHackRest: false,
                condColumnSet: 3, // 列
                colsArray: [],
                isShowFunAdd: false, // 是否显示新增
                isShowFunRemove: false, // 是否显示删除
                isShowFunImport: false, // 是否显示导入
                isShowFunExport: false, // 是否显示导出
                isShowOptEdit: false, // 操作栏是否显示编辑
                isShowOptDelete: false, // 操作栏是否显示删除
                timerIdEnd: "",
                importTimerIdEnd: ""
            }
        },
        beforeDestroy() {
            let _this = this;
            _this.KHForm.clearExportTimer(_this);
            _this.KHForm.clearImportTimer(_this);
        },
        mounted() {
            this.listData();
            this.uploadUrl = this.khConfig.host.rest + this.khConfig.api.importForm + "/" + this.formId;  // 导入接口
        },
        methods: {
            // 根据业务ID查询表格数据
            listData() {
                this.tdLoading = true;
                let param = {
                    "formId": this.formId,
                    "businessId": this.listBusinessId
                };
                this.tableData = [];
                this.$Get(this.khConfig.api.getFormDataById, param).then(res => {
                    this.tableData.push(res.data);
                    this.totalPage = 1;
                    this.tdLoading = false;
                });
            },
            // 分页查询
            handleCurrentChange(val) {
                let _this = this;
                _this.queryParam.pageNum = val;
                if (this.$refs.condSetForm) {
                    _this.queryByCond(true);
                } else {
                    _this.listData();  // 无查询条件设置
                }
            },
            // 列表显示格式化
            formatCustom(row, column) {
                let _this = this;
                return _this.KHForm.formatCustom(row, column, _this);
            },
            // 查询条件重置
            resetCond() {
                this.$refs.condSetForm.reset();
            },
            // 按条件查询
            queryByCond(flag) {
                let _this = this;
                if (_this.KHUtils.isNull(_this.queryConditions) || _this.queryConditions.length === 0) {
                    return false;
                }
                if (!flag) {
                    // 直接点击查询条件查询
                    _this.queryParam.pageNum = 1;
                }
                this.$refs.condSetForm.getData().then(data => {
                    let param = [];
                    _this.KHForm.processCond(data, param, _this);   // 查询条件参数处理
                    let postJsParam = {
                        "formId": _this.formId,
                        "pageNum": _this.queryParam.pageNum,
                        "pageSize": 10,
                        "queryConditions": param
                    };
                    this.$PostJson(this.khConfig.api.queryFormDataByConditions, postJsParam).then(res => {
                        if (res.errCode === 0) {
                            this.tableData = res.datas;
                            this.totalPage = res.totalCount;
                        }
                    });
                });
            },
            // 新增
            handleAdd() {
                let _this = this;
                if(_this.tableFormConfig instanceof Array && _this.tableFormConfig.length >0){
                    _this.tableFormConfig.forEach((table,index)=>{
                        table.subData = [];
                    })
                }
                _this.editFormVisible = true;
                _this.parentSaveDisable = false;
                _this.businessId = "";
                _this.hackReset = false;
                _this.formTitle = "新增";
                _this.addOrEdit = true;
                _this.dataModels = {};

                // 新增页面设置处理
                _this.addShowNormal = true;
                _this.parentFormId = _this.formId;
                _this.parentBusinessId = 0;
                if (_this.formConfig.sensorSettingsV2 && _this.formConfig.sensorSettingsV2.widgets instanceof Array &&  _this.formConfig.sensorSettingsV2.widgets.length >= 1) {
                    let tempWidget = _this.formConfig.sensorSettingsV2.widgets[0];
                    if (tempWidget.showType && tempWidget.showType.addShowType) {
                        let addShowType = tempWidget.showType.addShowType;
                        if ("normal" === addShowType) {
                            _this.addShowNormal = false;
                        }
                    }
                    if (tempWidget.showType && tempWidget.showType.tableShowType && !this.KHUtils.isNull(tempWidget.showType.tableShowType)) {
                        this.tableShowType = tempWidget.showType.tableShowType;
                    }
                    _this.normalHackReset = false;
                    // 重新渲染子组件
                    _this.$nextTick(() => {
                        _this.normalHackReset = true
                    })
                }
                if (_this.addShowNormal) {
                    _this.editFormVisible = true;
                }
                // 重新渲染子组件
                _this.$nextTick(() => {
                    _this.hackReset = true
                })
            },
            // 编辑
            handleEdit(row) {
                let _this = this;
                // _this.KHForm.handleEdit(row, _this);
                let tempRow = _this.KHUtils.clone(row);
                _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                _this.formTitle = "编辑";
                _this.parentSaveDisable = false;
                _this.editFormVisible = true;
                _this.dataModels = tempRow;
                _this.businessId = row.id;
                _this.addOrEdit = false;
                _this.hackReset = false;
                // 新增页面设置处理
                _this.addShowNormal = true;
                if (_this.formConfig.sensorSettingsV2 && _this.formConfig.sensorSettingsV2.widgets instanceof Array && _this.formConfig.sensorSettingsV2.widgets.length >= 1) {
                    let tempWidget = _this.formConfig.sensorSettingsV2.widgets[0];
                    if (tempWidget.showType && tempWidget.showType.addShowType) {
                        let addShowType = tempWidget.showType.addShowType;
                        if ("normal" === addShowType) {
                            _this.addShowNormal = false;
                            _this.normalHackReset = false;
                            // 重新渲染子组件
                            _this.$nextTick(() => {
                                _this.normalHackReset = true;
                            });
                            return false;
                        }
                        if (tempWidget.showType && tempWidget.showType.tableShowType && !this.KHUtils.isNull(tempWidget.showType.tableShowType)) {
                            this.tableShowType = tempWidget.showType.tableShowType;
                        }
                    }
                }
                if (_this.addShowNormal) {
                    _this.editFormVisible = true;

                }
                _this.parentFormId = _this.formId;
                _this.parentBusinessId = row.id;
                _this.hackReset = false;
                // 重新渲染子组件
                _this.$nextTick(() => {
                    _this.hackReset = true;
                });
            },
            // 删除选中的多条记录
            handleDeleteMulti() {
                if (this.multipleSelection === "" || this.multipleSelection.length === 0) {
                    this.$notify({
                        title: '警告',
                        message: '请选择要删除的记录',
                        type: 'warning'
                    });
                } else {
                    this.batchDel(this.multipleSelection);
                }
            },
            // 批量删除操作
            batchDel(multipleSelection) {
                let _this = this;
                _this.KHForm.batchDel(multipleSelection, _this);
            },
            // 选中列表数据
            handleSelectionChange(array) {
                this.multipleSelection = array;
            },
            // 保存数据
            saveData() {
                let _this = this;
                _this.KHForm.saveData(_this);
            },
            //保存新增数据
            saveAddData(){
                let _this = this;
                _this.$refs.buildForm.getData().then(data => {
                    this.$confirm('确认保存吗？', '提示', {}).then(() => {
                        let newData = JSON.parse(JSON.stringify(data));
                        _this.KHForm.formatDynCols(newData, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                        let param = {
                            parent:{},
                            child:[]
                        }
                        //this.checkMapData(newData);
                        param.parent = newData;
                        if(_this.tableFormConfig instanceof Array && _this.tableFormConfig.length >0){
                            _this.tableFormConfig.forEach((table,index)=>{
                                if(!_this.KHUtils.isNull(table.key) && table.subData instanceof Array && table.subData.length >0){
                                    table.subData.forEach((tableData,index1)=>{
                                        _this.convertParam(tableData,table.tableColumns);
                                    })
                                    let newObj = {};
                                    newObj.subKey = table.key;
                                    //this.checkMapData(table.subData);
                                    //剔除为null的数据
                                    let newDatas = [];
                                    if(table.subData instanceof Array && table.subData.length >0){
                                        table.subData.forEach((data,index)=>{
                                            let newObj = {};
                                            Object.keys(data).forEach(function (key) {
                                                if(data[key] != null){
                                                    newObj[key] = data[key];
                                                }
                                            });
                                            newDatas.push(newObj);
                                        })
                                    }
                                    newObj.subDatas= newDatas;
                                    param.child.push(newObj);
                                }
                            })
                        }
                        _this.$PostJson(_this.khConfig.api.addpcformdata+"/"+_this.formId, param).then(res => {
                            if (res.errCode === 0) {
                                this.$message({
                                    message: '添加成功',
                                    type: 'success'
                                });
                                this.editFormVisible = false;
                                _this.listData();
                            }
                        })
                    }).catch((e) => {
                        console.log(e)
                    });
                }).catch(() => {
                })

            },
            convertParam(object,list){
                for(let key of Object.keys(object)){
                    if(list instanceof Array && list.length >0){
                        let col = this.findColByKey(key,list);
                        //选择控件传 0或1 不是true，false
                        if(col && col.type === 'switch'){
                            if (null !== object[key] && object[key] !== '' && object[key] !== undefined && typeof object[key] === 'boolean' ) {
                                if (object[key]) {
                                    object[key] = "0";
                                } else {
                                    object[key] = "1";
                                }
                            }else if(!this.KHUtils.isNull(object[key])){

                            } else {
                                object[key] = '0';
                            }
                        }
                    }
                    let value = object[key];

                    if(value instanceof Array){
                        object[key] = value.join(",");
                    }else if(value instanceof Object){
                        for (let valueKey of Object.keys(value)){
                            object[valueKey] = value[valueKey];
                        }
                    }
                }
            },
            findColByKey(key,list){
                if(list instanceof Array && list.length >0){
                    for(var i = 0;i<list.length;i++){
                        let col = list[i];
                        if(col.model == key){
                            return col;
                        }
                    }
                }
                return null;
            },
            // 导出Excel
            handleExport() {
                let _this = this;
                _this.KHForm.handleExport(_this);
            },
            // 获取导入模板
            getExcelTemplate() {
                this.$OpenUrl(this.khConfig.host.rest +this.khConfig.api.exportFormTemplate + "/" + this.formId);
            },
            // 文件上传前处理
            beforeUpload() {
                this.importLoading = true;
            },
            // 导出文件上传
            uploadCall(response) {
                let _this = this;
                _this.importLoading = false;
                if (response.errCode === 0) {
                    if (response.importExportCode) {
                        if (_this.KHUtils.isNull(response.importExportCode)) {
                            this.$notify.error({
                                title: '错误',
                                message: 'importExportCode为空,上传失败'
                            });
                        }
                        _this.importExcelFileId = response.importExportCode;
                        _this.KHForm.timeoutImportExcel(_this);
                    }
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: '上传失败'
                    });
                }
            },
            // 导入文件出错处理
            uploadError() {
                this.importLoading = false;
                this.$notify.error({
                    title: '错误',
                    message: '导入失败'
                });
            },
            // 普通新增页面返回
            normalReturn() {
                let _this = this;
                _this.addShowNormal = true;
                _this.editFormVisible = false;
            },
            // 自定义跳转
            handleCustomJump(row, config) {
                let _this = this;
                _this.KHForm.handleCustomJump(row, config, _this);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-dialog-form ::v-deep .el-dialog__body {
        padding: 10px 10px
    }
</style>
