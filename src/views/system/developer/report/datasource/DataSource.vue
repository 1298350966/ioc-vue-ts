<template>
    <section>
        <!--查询条件-->
        <el-row style="padding-bottom: 10px">
            <el-col :span="6">
                <el-button icon="el-icon-plus" @click="handleAddDs">新增数据源</el-button>
                <el-input style="width: 120px;" placeholder="数据源名称" v-model="dsKeyWord" @blur="listDs"
                          prefix-icon="el-icon-search"></el-input>
            </el-col>
            <el-col :span="18">
                <el-input style="width: 220px; float: left;" placeholder="表名称" v-model="tableNameKeyWord"
                          @blur="selectKeyTable" prefix-icon="el-icon-search"></el-input>
            </el-col>
        </el-row>
        <!--数据源列表、表集合-->
        <el-row>
            <el-col :span="6">
                <el-table :data="dsData"
                          height="530px"
                          ref="dsTable"
                          highlight-current-row
                          border
                          stripe
                          v-loading="dsLoading"
                          style="width: 90%;text-align: center"
                          @row-click="changePageNum"
                >
                    <el-table-column prop="dsName" label="数据源" header-align="center">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作" align="center">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="详情" placement="bottom">
                                <el-button @click.stop="handleShowDs(scope.row)" type="text" size="small"
                                           icon="el-icon-info"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="编辑" placement="bottom">
                                <el-button @click.stop="handleEditDs(scope.row)" type="text" size="small"
                                           icon="el-icon-edit">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="删除" placement="bottom">
                                <el-button @click.stop="handleDeleteDs(scope.row)" type="text" size="small"
                                           icon="el-icon-delete">
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
            <!--数据源表列表-->
            <el-col :span="18">
                <el-table :data="tbData"
                          highlight-current-row
                          border
                          stripe
                          v-loading="tbLoading"
                          style="width: 90%;text-align: center"
                          @row-click="handleShowTbDetail"
                >
                    <el-table-column prop="tableName" label="表名" sortable header-align="center">
                    </el-table-column>
                    <el-table-column prop="tableDesc" label="表描述" sortable header-align="center">
                    </el-table-column>
                    <el-table-column
                        fixed="right"
                        label="操作" width="120" align="center">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="详情" placement="bottom">
                                <el-button @click.stop="handleShowTbDetail(scope.row)" type="text" size="small"
                                           icon="el-icon-info">
                                </el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="创建数据集" placement="bottom">
                                <el-button @click.stop="handleAddDataSet(scope.row)" type="text" size="small"
                                           icon="el-icon-folder-add">
                                </el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
                <el-row v-show="totalCount>10">
                    <el-col :span="23" style="margin-top: 8px;width: 86.5%">
                        <el-pagination :current-page="pageNum" v-if="pageIsShow"
                                       :page-size="pageSize"
                                       layout="prev, pager, next"
                                       @current-change="handleCurrentPage"
                                       :total="totalCount"
                                       style="float:right">
                        </el-pagination>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <!--查看数据源详情-->
        <el-dialog title="数据源详情" :visible.sync="dsDetailVisible" :close-on-click-modal="false" style="width: 1200px">
            <el-form :model="dsForm" label-width="120px">
                <el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据源类型" prop="dsType" style="width: 300px">
                                <el-input v-model="dsForm.dsType" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="显示名称" prop="dsName" style="width: 500px">
                                <el-input v-model="dsForm.dsName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据库地址" prop="ip" style="width: 500px">
                                <el-input v-model="dsForm.ip" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="端口" prop="port" style="width: 500px">
                                <el-input v-model="dsForm.port" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据库" prop="dbName" style="width: 500px">
                                <el-input v-model="dsForm.dbName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row v-if="dsForm.dsType=='sqlserver' || dsForm.dsType=='oracle'">
                        <el-col :span="24">
                            <el-form-item label="Schema" prop="sc" style="width: 500px">
                                <el-input v-model="dsForm.sc" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="用户名" prop="user" style="width: 500px">
                                <el-input v-model="dsForm.user" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" size="50" @click.native="closeDs">关闭</el-button>
            </div>
        </el-dialog>
        <!--编辑或新增数据源-->
        <el-dialog :title="dsTitle" :visible.sync="dsVisible" :close-on-click-modal="false" style="width: 1300px">
            <el-form :model="dsForm" label-width="120px" :rules="dsFormRules" ref="dsForm">
                <el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据源类型" prop="dsType">
                                <el-select v-model="dsForm.dsType" style="width: 180px" placeholder="请选择数据库类型">
                                    <el-option label="mysql" value="mysql"></el-option>
                                    <el-option label="sqlserver" value="sqlserver"></el-option>
                                    <el-option label="oracle" value="oracle"></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="显示名称" prop="dsName" style="width: 550px">
                                <el-input v-model="dsForm.dsName" placeholder="数据源配置列表显示名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据库地址" prop="ip" style="width: 550px">
                                <el-input v-model="dsForm.ip" placeholder="主机名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="端口" prop="port" style="width: 550px">
                                <el-input v-model="dsForm.port" placeholder="主机端口"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据库" prop="dbName" style="width: 550px">
                                <el-input v-model="dsForm.dbName" placeholder="数据库名称"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24" v-if="dsForm.dsType=='sqlserver' || dsForm.dsType=='oracle'">
                            <el-form-item label="Schema" prop="sc" style="width: 550px">
                                <el-input v-model="dsForm.sc"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="用户名" prop="user" style="width: 550px">
                                <el-input v-model="dsForm.user" placeholder="请输入用户名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="密码" prop="pas" style="width: 550px">
                                <el-input v-model="dsForm.pas" type="password" placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="info" size="medium" plain @click.native="closeDs">关闭
                </el-button>
                <el-button type="info" size="medium" @click.native="connectionTest" :loading="connectionTestLoading">
                    连接测试
                </el-button>
                <el-button type="primary" size="medium" @click.native="saveDs" :loading="saveDsLoading">保存</el-button>
            </div>
        </el-dialog>
        <!--查看表结构字段-->
        <el-dialog title="表结构" :visible.sync="tbDetailVisible" :close-on-click-modal="false">
            <el-form :model="tbForm" label-width="120px">
                <el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="表名">
                                <el-input v-model="tbForm.tableName" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="表描述" prop="tableDesc">
                                <el-input v-model="tbForm.tableDesc" :disabled="true"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-row>
            </el-form>
            <el-row>
                <el-table :data="tableFields"
                          highlight-current-row
                          border
                          stripe
                          v-loading="tableFieldsLoading"
                          style="width: 90%;text-align: center"
                >
                    <el-table-column prop="columnName" label="字段名">
                    </el-table-column>
                    <el-table-column prop="columnType" label="字段类型">
                    </el-table-column>
                    <el-table-column prop="columnDesc" label="字段描述">
                    </el-table-column>
                </el-table>
            </el-row>
        </el-dialog>
        <!--创建数据集-->
        <el-dialog title="创建数据集" :visible.sync="DataSetAddVisible" :close-on-click-modal="false">
            <el-form :model="dataSetForm" label-width="120px" :rules="dataSetFormRules" ref="dataSetForm">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="名称" prop="dsName">
                            <el-input v-model="dataSetForm.dsName">
                            </el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="saveDataSet" :loading="saveDsLoading">保存</el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    
    import {JSEncrypt} from 'jsencrypt'
    
    export default {
        name: "DataSource",
        components: {},
        data() {
            return {
                pageIsShow: false,
                dataSetForm: {
                    dsName: ""
                },
                dsId: 0,
                dsData: [],
                DataSetAddVisible: false,
                dsLoading: false,
                dsSelection: [],
                dsDetailVisible: false,
                dsForm: {
                    dsName: "",
                    dsType: "mysql",
                    ip: "",
                    port: "",
                    dbName: "",
                    user: "",
                    pas: "",
                    sc: ""
                },
                dataSetFormRules: {
                    dsName: [
                        {required: true, message: '请输入数据集名称', trigger: 'blur'}
                    ]
                },
                dsFormRules: {
                    dsType: [
                        {required: true, message: '请输入数据源类型', trigger: 'blur'}
                    ],
                    dsName: [
                        {required: true, message: '请输入显示名称', trigger: 'blur'}
                    ],
                    ip: [
                        {required: true, message: '请输入数据库地址', trigger: 'blur'}
                    ],
                    port: [
                        {required: true, message: '请输入端口', trigger: 'blur'}
                    ],
                    dbName: [
                        {required: true, message: '请输入数据库', trigger: 'blur'}
                    ],
                    user: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    pas: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ]
                },
                dsTitle: '新增数据源',
                dsVisible: false,
                connectionTestLoading: false,
                saveDsLoading: false,
                dsKeyWord: "",  // 搜索数据源的关键字
                // 表集合
                tbData: [],
                tbForm: {
                    tableName: "",
                    tableDesc: ""
                },
                tbLoading: false,
                totalCount: 0,
                pageSize: 10,
                pageNum: 1,
                // 表字段
                tbDetailVisible: false,
                tableFields: [],
                tableFieldsLoading: false,
                currentSelectDs: {},
                tableNameKeyWord: ""//搜索表名称
            }
        },
        mounted() {
            this.listDs();
        },
        methods: {
            // 查询数据源列表
            listDs() {
                let _this = this;
                _this.dsData = [];
                let param = {
                    pageSize: 1000,
                    pageNum: 1
                };
                if (!_this.KHUtils.isNull(_this.dsKeyWord)) {
                    param.dsName = _this.dsKeyWord;
                }
                _this.dsLoading = true;
                _this.$Get(_this.khConfig.api.queryDataSource, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            if (res.datasources instanceof Array && res.datasources.length > 0) {
                                _this.dsData = res.datasources;
                                _this.$refs.dsTable.setCurrentRow(_this.dsData[0]);
                                _this.listTbByDs(_this.dsData[0]);
                            } else {
                                _this.tbData = [];     //查询为空时,上个查询表列数据置为空,不显示表详情数据
                                _this.pageIsShow = false; //隐藏页码
                            }
                        }
                        _this.dsLoading = false;
                    })
            },
            // 密码明文加密
            encryptedPwd(pas) {
                let _this = this;
                if (_this.KHUtils.isInvalidValue(pas)) {
                    return false;
                }
                let encryptor = new JSEncrypt();
                encryptor.setPublicKey(_this.khConfig.host.publicKeyStr);
                return encryptor.encrypt(pas);
            },
            // 查看数据源详情
            handleShowDs(row) {
                let _this = this;
                _this.dsForm = _this.KHUtils.clone(row);
                _this.dsDetailVisible = true;
            },
            // 新增数据源
            handleAddDs() {
                let _this = this;
                _this.dsTitle = "新增数据源";
                _this.dsForm = {
                    dsName: "",
                    dsType: "mysql",
                    ip: "",
                    port: "",
                    dbName: "",
                    user: "",
                    pas: "",
                    sc: ""
                };
                //_this.dsForm.dsType = "mysql";
                _this.dsVisible = true;
                // _this.pasBoolean = true;
            },
            // 编辑数据源
            handleEditDs(row) {
                let _this = this;
                _this.dsTitle = "编辑数据源";
                _this.dsForm = _this.KHUtils.clone(row);
                _this.dsVisible = true;
                _this.connectionTestLoading = false;
                /*     _this.pasBoolean = false;
                     this.count = 2;
                     this.changePas = false;*/
            },
            // 数据源连接测试
            connectionTest() {
                let _this = this;
                let pass = _this.dsForm.pas;
                _this.$refs.dsForm.validate((valid) => {
                    if (valid) {
                        _this.connectionTestLoading = true;
                        _this.$Post(_this.khConfig.api.testDataSource, _this.convertForm2Array(_this.dsForm))
                            .then(res => {
                                _this.dsForm.pas = pass
                                _this.connectionTestLoading = false;
                                if (res.errCode === 0) {
                                    _this.$message.success("连接成功")
                                } else {
                                    _this.$message.error("连接失败")
                                }
                                _this.tbLoading = false;
                            })
                    }
                });
            },
            // 保存数据源
            saveDs() {
                let _this = this;
                _this.$refs.dsForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            setTimeout(function () {
                                _this.saveDsLoading = true;
                                _this.$Post(_this.khConfig.api.saveDataSource, _this.convertForm2Array(_this.dsForm))
                                    .then(res => {
                                        _this.saveDsLoading = false;
                                        if (res.errCode === 0) {
                                            _this.$notify({
                                                title: '成功',
                                                message: '操作成功',
                                                type: 'success'
                                            });
                                            _this.listDs();
                                        }
                                        _this.dsVisible = false;
                                    })
                            }, 1000);
                        }).catch((e) => {
                        
                        });
                    }
                });
            },
            /*改变页码*/
            changePageNum(row) {
                let _this = this;
                _this.pageNum = 1;
                _this.listTbByDs(row);
            },
            // 查询数据源的表集合
            listTbByDs(row) {
                let _this = this;
                _this.pageIsShow = false;
                let param = {
                    pageSize: _this.pageSize,
                    pageNum: _this.pageNum
                };
                if (!_this.KHUtils.isNull(row)) {
                    _this.currentSelectDs = _this.KHUtils.clone(row);
                    param.dsId = row.dsId;
                }
                _this.tbData = [];
                _this.tbLoading = true;
                _this.$Get(_this.khConfig.api.queryTable, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.pageIsShow = true;
                            _this.totalCount = res.totalCount;
                            if (res.tables instanceof Array && res.tables.length > 0) {
                                _this.tbData = res.tables;
                            }
                        }
                        _this.tbLoading = false;
                    });
                _this.dsId = row.dsId;
            },
            // 查看表结构详情--表字段
            handleShowTbDetail(row) {
                let _this = this;
                if (_this.KHUtils.isNull(row.tableName)) {
                    _this.$message.warning("表名称为空");
                    return false;
                }
                _this.tbForm = _this.KHUtils.clone(row);
                _this.dataSetForm = _this.KHUtils.clone(row);
                _this.tbDetailVisible = true;
                let param = {
                        pageSize: _this.pageSize,
                        pageNum: _this.pageNum,
                        tableName: _this.tbForm.tableName,
                        dsId: _this.dsId
                    }
                ;
                _this.tableFields = [];
                _this.tableFieldsLoading = true;
                _this.$Get(_this.khConfig.api.queryTableDesc, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            if (res.colums instanceof Array && res.colums.length > 0) {
                                _this.tableFields = res.colums;
                            }
                        }
                        _this.tableFieldsLoading = false;
                    })
            },
            // 分页查询数据源表
            handleCurrentPage(val) {
                let _this = this;
                _this.pageNum = val;
                _this.listTbByDs(_this.currentSelectDs);
            },
            // 数据源保存是对参数处理
            convertForm2Array(_form) {
                let _this = this;
                let paramArray = [];
                if (!_this.KHUtils.isNull(_form.dsId)) {
                    paramArray.push("dsId=" + _form.dsId);
                }
                paramArray.push("dsName=" + _form.dsName);
                paramArray.push("dsType=" + _form.dsType);
                paramArray.push("ip=" + _form.ip);
                paramArray.push("port=" + _form.port);
                paramArray.push("dbName=" + _form.dbName);
                paramArray.push("user=" + _form.user);
                paramArray.push("pas=" + _this.encryptedPwd(_form.pas));   /*密码已被修改*/
                paramArray.push("sc=" + _form.sc);
                paramArray = paramArray.join("&");
                return paramArray;
            },
            //保存数据集参数处理
            converDataSetForm2Array(_form) {
                let _this = this;
                let paramArray = [];
                if (!_this.KHUtils.isNull(_form.datasourceId)) {
                    paramArray.push("datasourceId=" + _form.datasourceId);
                }
                if (!_this.KHUtils.isNull(_form.dsName)) {
                    paramArray.push("dsName=" + _form.dsName);
                }
                if (!_this.KHUtils.isNull(_form.tableName)) {
                    paramArray.push("tableName=" + _form.tableName);
                }
                paramArray = paramArray.join("&");
                return paramArray;
            },
            //删除数据源根据id
            handleDeleteDs(row) {
                let _this = this;
                _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                    let param = {
                        dsId: row.dsId
                    }
                    _this.$Get(_this.khConfig.api.deleteDSById, param).then(res => {
                        if (res.errCode === 0) {
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            _this.listDs();
                        }
                    })
                })
            },
            //弹出添加数据集界面
            handleAddDataSet(row) {
                let _this = this;
                _this.DataSetAddVisible = true;
                _this.dataSetForm = row;
                //_this.dataSetForm.dsName=row.tableName
                _this.$set(_this.dataSetForm, "dsName", row.tableName)
            },
            //添加数据集
            saveDataSet() {
                let _this = this;
                _this.$refs.dataSetForm.validate((valid) => {
                    if (valid) {
                        let param = {
                            datasourceId: _this.dsId,
                            dsName: _this.dataSetForm.dsName,
                            tableName: _this.dataSetForm.tableName
                        }
                        _this.$Post(_this.khConfig.api.createDataSetConf, _this.converDataSetForm2Array(param)).then(res => {
                            if (res.errCode === 0) {
                                _this.$notify({
                                    title: '成功',
                                    message: '创建成功',
                                    type: 'success'
                                });
                                _this.DataSetAddVisible = false;
                                this.$router.push({path: '/report/dataset', query: {dsId: res.dsId}});
                            }
                        })
                    }
                })
            },
            //关闭新增或编辑弹出框
            closeDs() {
                let _this = this;
                _this.dsVisible = false;
                _this.dsDetailVisible = false;
            },
            //查询表
            selectKeyTable() {
                let _this = this;
                _this.pageIsShow = false;
                let param = {
                    pageSize: _this.pageSize,
                    pageNum: _this.pageNum,
                    dsId: _this.dsId,
                    tbName: _this.tableNameKeyWord
                };
                _this.tbData = [];
                _this.tbLoading = true;
                _this.$Get(_this.khConfig.api.queryTable, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.pageIsShow = true;
                            _this.totalCount = res.totalCount;
                            if (res.tables instanceof Array && res.tables.length > 0) {
                                _this.tbData = res.tables;
                            }
                        }
                        _this.tbLoading = false;
                    });
            }
        }
    }
</script>


<style lang="scss" scoped>
</style>
