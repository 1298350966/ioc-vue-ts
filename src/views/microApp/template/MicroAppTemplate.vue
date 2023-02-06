<template>
    <div style="margin-right: 30px">
        <div class="header-row" >
            <span class="header-title">模板管理</span>
            <el-form :inline="true" v-model="queryCondition" class="demo-form-inline">
                <el-form-item label="模板名称">
                    <el-input v-model="queryCondition.templateName" placeholder="输入模板名称"></el-input>
                </el-form-item>
                <el-form-item label="适用行业">
                    <el-input v-model="queryCondition.applyIndustry" placeholder="请输入行业名称"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="queryCondition.explanation" placeholder="请输入行业名称"></el-input>
                </el-form-item>
                <el-button type="info" @click="queryMicroAppTemplate">查询</el-button>
                <el-button type="success" @click="resetQuery">重置</el-button>
                <el-button type="danger" @click="deleteMicroAppTemplate">删除</el-button>
                <el-button type="primary" @click="addMicroAppTemplate">新增</el-button>
            </el-form>
        </div>
        <el-table
            :data="tableData"
            border
            stripe
            v-loading="loading"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="templateName"
                label="模板名称"
            >
            </el-table-column>
            <el-table-column
                prop="applyIndustry"
                label="适用行业"
            >
            </el-table-column>
            <el-table-column
                prop="explanation"
                label="说明">
            </el-table-column>
            <el-table-column
                label="操作"
            >
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="editTemplate(scope.$index, scope.row)"
                        type="primary"
                        size="small">
                        编辑
                    </el-button>
                    <el-button
                        @click.native.prevent="openWorkbench(scope.$index, scope.row)"
                        type="warning"
                        size="small">
                        工作台分组
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="float: right;margin: 10px"
                       background
                       :current-page.sync="queryCondition.pageNum"
                       :page-size.sync="queryCondition.pageSize"
                       layout="total, prev, pager, next, jumper"
                       :total="total"
                       @current-change="handleCurrentChange"
        />
        <el-dialog
            title="新增行业应用模板"
            :visible.sync="templateDialogVisible"
            width="50%"
        >
            <el-form  v-model="templateObj" label-width="80px" style="margin-left: 50px;margin-right: 80px">
                <el-form-item label="模板名称">
                    <el-input v-model="templateObj.templateName" ></el-input>
                </el-form-item>
                <el-form-item label="适用行业">
                    <el-input v-model="templateObj.applyIndustry"></el-input>
                </el-form-item>
                <el-form-item label="说明">
                    <el-input v-model="templateObj.explanation" type="textarea"
                              :rows="3" ></el-input>
                </el-form-item>

            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="templateDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveTemplate" :loading="saveTemplateLoading">确 定</el-button>
            </span>
        </el-dialog>

        <el-dialog
            title="工作台分组"
            :visible.sync="workbenchDialogVisible"
            width="60%" style="height: auto"
            :before-close="closeDialog"
        >
            <workbench-template :templateId="templateId" ref="workbench"></workbench-template>
        </el-dialog>
    </div>
</template>

<script>
    import WorkbenchTemplate from "@/components/micro-app/WorkbenchTemplate"
    export default {
        components:{
            WorkbenchTemplate
        },
        data(){
            return {
                tableData: [],
                total: 0,
                loading: false,
                queryCondition: {
                    templateName: "",
                    applyIndustry: "",
                    explanation: "",
                    pageSize: 10,
                    pageNum: 1
                },
                templateObj:{
                    id:null,
                    templateName: "",
                    applyIndustry: "",
                    explanation: "",
                },
                saveTemplateLoading:false,
                isAdd:true,//记录是新增还是编辑
                templateDialogVisible: false,
                multipleSelection:[],
                workbenchDialogVisible:false,
                templateId:null

            }
        },
        mounted(){
            let _this = this;
            _this.queryCondition = {
                templateName: "",
                applyIndustry: "",
                explanation: "",
                pageSize: 10,
                pageNum: 1
            },
                _this.listData();
        },
        methods: {
            //查询模板
            queryMicroAppTemplate(){
                let _this = this;
                _this.queryCondition.pageNum = 1;
                _this.listData();
            },
            listData(){
                this.loading = true;
                this.tableData = [];
                this.$Get(this.khConfig.api.queryMicroAppTemplate, this.queryCondition).then(res => {
                    this.loading = false;
                    if (res.errCode === 0) {
                        this.total = res.count;
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            this.tableData = res.datas;
                        }
                    } else {

                    }
                });
            },
            //新增
            addMicroAppTemplate(){
                let _this = this;
                _this.templateObj={
                    id:null,
                    templateName: "",
                    applyIndustry: "",
                    explanation: "",
                };
                _this.isAdd = true;
                _this.templateDialogVisible = true;

            },
            //编辑
            editTemplate(index,row){
                let _this = this;
                _this.templateObj.id = row.id;
                _this.templateObj.templateName = row.templateName;
                _this.templateObj.applyIndustry = row.applyIndustry;
                _this.templateObj.explanation = row.explanation;
                _this.isAdd = false;
                _this.templateDialogVisible = true;


            },
            saveTemplate(){
                let _this = this;
                _this.saveTemplateLoading = true;
                let url = ""
                if(_this.isAdd){
                    url = this.khConfig.api.addMicroAppTemplate;
                }else {
                    url = this.khConfig.api.updateMicroAppTemplate
                }
                _this.$Get(url, this.templateObj).then(res => {
                    _this.saveTemplateLoading = false;
                    if (res.errCode === 0) {
                        _this.templateDialogVisible = false;
                        if(_this.isAdd){
                            _this.$message({
                                message: '新增模板成功',
                                type: 'success'
                            });
                        }else {
                            _this.$message({
                                message: '修改模板成功',
                                type: 'success'
                            });
                        }
                        _this.listData();

                    } else {

                    }
                });


            },
            //工作台
            openWorkbench(index,row){
                let _this = this;
                _this.templateId = row.id;
                _this.workbenchDialogVisible = true;
            },
            handleSelectionChange(array) {
                this.multipleSelection = array;
            },
            //删除
            deleteMicroAppTemplate(){
                let _this = this;
                if( _this.multipleSelection instanceof Array && _this.multipleSelection.length>0){
                    _this.$confirm('是否确认删除行业应用模板?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var idsStr = _this.multipleSelection.map(function(obj,index){
                            return obj.id;
                        }).join(",");
                        let param = {
                            ids:idsStr
                        }
                        _this.$Get(_this.khConfig.api.deleteMicroAppTemplate, param).then(res => {
                            if (res.errCode === 0) {
                                _this.$message({
                                    message: '删除模板成功',
                                    type: 'success'
                                });
                                _this.listData();
                            }
                        });
                    }).catch(() => {

                    });
                }else {
                    _this.$message({
                        message: '请选择需要删除的模板！',
                        type: 'warning'
                    });
                }


            },
            resetQuery(){
                let _this = this;
                _this.queryCondition = {
                    templateName: "",
                    applyIndustry: "",
                    explanation: "",
                    pageSize: 10,
                    pageNum: 1
                }
            },
            handleCurrentChange(val){
                let _this = this;
                _this.queryCondition.pageNum = val;
                _this.listData();
            },
            closeDialog(){
                this.$confirm('是否保存工作台配置信息"?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                   this.$refs.workbench.saveWorkbench();
                    this.workbenchDialogVisible = false;
                }).catch(() => {
                    this.workbenchDialogVisible = false;
                });

            }
        }
    }
</script>

<style>

</style>
