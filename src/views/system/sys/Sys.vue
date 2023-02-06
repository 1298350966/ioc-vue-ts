<template>
    <el-col :span="24" style="padding: 8px 70px">
        <el-row>
            <div class="forms" style="margin-left: -75px">
                <el-form :inline="true" class="demo-form-inline">
                    <el-form-item label="子系统名称:" style="margin-left:15px;">
                        <el-input v-model="queryParam.sysName" style="width: 140px"></el-input>
                    </el-form-item>
                    <el-form-item label="数据同步账号:">
                        <el-input v-model="queryParam.agentAccount" style="width: 140px"></el-input>
                    </el-form-item>
                    <el-form-item label="是否显示:">
                        <el-select v-model="queryParam.status" clearable placeholder="请选择" style="width: 100px"
                                   value="">
                            <el-option label="全部" value="" key=""></el-option>
                            <el-option label="已显示" value="0" key="0"></el-option>
                            <el-option label="已隐藏" value="1" key="1"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item style="width: 240px">
                        <el-button type="primary" icon="search" @click="listSys">查询</el-button>
                    </el-form-item>
                </el-form>
            </div>
            <el-row style="margin-bottom: 10px ;margin-left: -60px">
                <el-button @click="handleAdd">新增</el-button>
                <el-button @click="handleDeleteMulti" :loading="delLoading">删除</el-button>
            </el-row>
            <!--列表-->
            <el-row style="margin-bottom: 10px;margin-left: -60px">
                <el-col :span="24">
                    <el-table
                        :data="tableData"
                        highlight-current-row
                        @selection-change="handleSelectionChange"
                        border
                        stripe
                        v-loading="listLoading"
                        style="width: 98%;text-align: center"
                        @row-click="handleEdit"
                    >
                        <el-table-column type="selection" width="55" prop="id" header-align="center">
                        </el-table-column>
                        <el-table-column prop="sysName" label="子系统名称" header-align="center" align="center">
                        </el-table-column>
                        <el-table-column prop="sysUrl" label="访问地址" header-align="center" align="center">
                        </el-table-column>
                        <el-table-column prop="syn" label="是否需要数据同步" header-align="center" align="center"
                                         :formatter="this.KHUtils.formatSyn">
                        </el-table-column>
                        <el-table-column prop="sso" label="是否需要单点登录" header-align="center" align="center"
                                         :formatter="this.KHUtils.formatSso">
                        </el-table-column>
                        <el-table-column prop="ssoMode" label="单点登录方式" header-align="center" align="center">
                        </el-table-column>
                        <el-table-column prop="sysIndex" label="排序号" header-align="center" align="center">
                        </el-table-column>
                        <el-table-column prop="sysDesc" label="描述简介" width="180" header-align="center"
                                         show-overflow-tooltip>
                        </el-table-column>
                        <el-table-column
                            header-align="center"
                            text-align="center"
                            fixed="right"
                            label="操作"
                            width="200">
                            <template slot-scope="scope">
                                <el-button type="text" size="small" @click.stop="handleShowAgentView(scope.row)">分配同步账号
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <!--编辑界面-->
            <el-dialog :title="formTitle" :visible.sync="editFormVisible" :close-on-click-modal="closeOnClickModal"
                       class="custom-sys-dia">
                <el-form :model="editForm" label-width="140px" :rules="editFormRules" ref="editForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="子系统名称" prop="sysName">
                                <el-input v-model="editForm.sysName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="访问地址" prop="sysUrl">
                                <el-input v-model="editForm.sysUrl"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="是否需要单点登录" prop="sso">
                                <el-radio-group v-model="editForm.sso">
                                    <el-radio class="radio" :label="0">是</el-radio>
                                    <el-radio class="radio" :label="1">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否需要数据同步" prop="syn">
                                <el-radio-group v-model="editForm.syn">
                                    <el-radio class="radio" :label="0">是</el-radio>
                                    <el-radio class="radio" :label="1">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="单点登录方式" prop="ssoMode">
                                <el-input v-model="editForm.ssoMode"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="描述简介" prop="sysDesc">
                                <el-input type="textarea" v-model="editForm.sysDesc"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="排序号" prop="sysIndex">
                                <el-input v-model="editForm.sysIndex"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否显示">
                                <el-switch
                                    active-color="#13ce66"
                                    inactive-color="#ff4949"
                                    active-value="0" inactive-value="1" v-model="editForm.status" style="width: auto">
                                </el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="数据同步账号分配" :visible.sync="showVisible" class="custom-sys-dia">
                <el-form :model="agentForm" label-width="140px" :rules="agentFormRules" ref="agentForm">
                    <p>&nbsp;</p>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="子系统名称">
                                <el-input v-model="agentForm.sysName" disabled></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="是否需要数据同步">
                                <el-radio-group v-model="agentForm.syn">
                                    <el-radio class="radio" :label="0">是</el-radio>
                                    <el-radio class="radio" :label="1">否</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="账号" prop="agentAccount">
                                <el-input v-model="agentForm.agentAccount"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="秘钥" prop="agentSecret">
                                <el-input v-model="agentForm.agentSecret"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="2">
                            <el-button style="margin-left: 5px" type="primary" @click.native="getUuid">自动获取
                            </el-button>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="updateAgent" :loading="agentLoading">保存
                    </el-button>
                </div>
            </el-dialog>
        </el-row>
    </el-col>
</template>

<script>
    export default {
        data() {
            // 校验子系统名称是否重复
            const checkExists = (rule, value, callback) => {
                let _this = this;
                // 解决输入数字
                value = value + "";
                value = value.replace(/\s*/g, "");
                if (!_this.isAddOrEdit && _this.editBeforeSysName === value) {
                    callback();
                }
                let data = {
                    sysName: value
                };
                _this.$Get(_this.khConfig.api.checkBySysName, data).then(res => {
                    if (res.errCode === 0 && res.count != null && res.count > 0) {
                        callback(new Error('子系统已存在'));
                    } else if (res.errCode === 0 && res.count != null && res.count === 0) {
                        _this.editForm.roleName = value;
                        callback();
                    } else {
                        callback(new Error('服务端错误'));
                    }
                }).catch(error => {
                    console.log("checkExists sysName :" + error);
                    callback(new Error('服务端错误'));
                });
            };
            // 校验分配的账号是否重复
            const checkAgentExists = (rule, value, callback) => {
                let _this = this;
                // 解决输入数字
                value = value + "";
                value = value.replace(/\s*/g, "");
                if (_this.editBeforeAgentAccount === value) {
                    callback();
                }
                let data = {
                    agentAccount: value
                };
                _this.$Get(_this.khConfig.api.checkBySysName, data).then(res => {
                    if (res.errCode === 0 && res.count != null && res.count > 0) {
                        callback(new Error('账号已存在'));
                    } else if (res.errCode === 0 && res.count != null && res.count === 0) {
                        _this.agentForm.agentAccount = value;
                        callback();
                    } else {
                        callback(new Error('服务端错误'));
                    }
                }).catch(error => {
                    console.log("checkExists sysName :" + error);
                    callback(new Error('服务端错误'));
                });
            };
            const validateDomain = (rule, value, callback) => {
                let _this = this;
                let sysUrl = this.editForm.sysUrl;
                if (_this.KHUtils.isNull(sysUrl)) {
                    callback();
                }
                if (!_this.KHUtils.isDomain(sysUrl)) {
                    callback(new Error('请输入正确的访问地址'));
                } else {
                    callback();
                }
            };
            // 检查是否选择与选择的上级组织的级别不相符
            const validateOrderIndex = (rule, value, callback) => {
                let _this = this;
                if (_this.KHUtils.isNull(value)) {
                    callback();
                } else if (!_this.KHUtils.isNull(value) && !_this.KHUtils.isInteger(value)) {
                    callback(new Error('必须为正整数'));
                } else {
                    callback();
                }
            };
            return {
                delLoading: false,
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                // 修改之前的子系统名称
                editBeforeAgentAccount: '',
                // 是否展示数据同步账号分配
                showVisible: false,
                agentForm: {
                    sysName: '',
                    syn: 0,
                    agentAccount: '',
                    agentSecret: '',
                    id: ''
                },
                agentFormRules: {
                    agentAccount: [
                        {required: true, message: '请输入账号', trigger: 'blur'},
                        {validator: checkAgentExists, trigger: 'blur'}
                    ],
                    agentSecret: [
                        {required: true, message: '请输入密钥', trigger: 'blur'},
                        {min: 32, max: 32, message: '请输入32位密钥', trigger: 'blur'}
                    ]
                },
                agentLoading: false,
                // 查询参数
                queryParam: {
                    sysName: "",
                    agentAccount: "",
                    status: ""
                },
                // 列表信息
                tableData: [],
                // 修改之前的子系统名称
                editBeforeSysName: '',
                editFormVisible: false,
                formTitle: '编辑',
                editForm: {
                    sysName: '',
                    sysDesc: '',
                    sysUrl: '',
                    syn: 0,
                    sso: 0,
                    ssoMode: '',
                    sysIndex: '',
                    status: '0'
                },
                editLoading: false,
                isAddOrEdit: false,
                editFormRules: {
                    sysName: [
                        {required: true, message: '请输入子系统名称', trigger: 'blur'},
                        {validator: checkExists, trigger: 'blur'}
                    ],
                    sysUrl: [
                        {required: true, message: '请输入访问地址', trigger: 'blur'},
                        {validator: validateDomain, trigger: 'blur'}
                    ],
                    sysIndex: [
                        {required: true, message: '请输入排序号', trigger: 'blur'},
                        {validator: validateOrderIndex, trigger: 'blur'}
                    ]
                },
                multipleSelection: [],
                listLoading: false
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            // 默认初始化
            init() {
                let _this = this;
                _this.listSys();
            },
            // 子系统信息查询
            listSys() {
                let _this = this;
                _this.listLoading = true;
                _this.$Get(_this.khConfig.api.listSys, _this.queryParam).then(res => {
                    _this.tableData = res.list;
                    _this.listLoading = false;
                });
            },
            // 删除选中的多条记录
            handleDeleteMulti() {
                let _this = this;
                if (_this.multipleSelection === "" || this.multipleSelection.length === 0) {
                    _this.$notify({
                        title: '警告',
                        message: '请选择要删除的记录',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确认删除该记录吗?', '提示', {}).then(() => {
                        _this.batchDel(_this.multipleSelection);
                    }).catch((e) => {
                        console.log(e)
                    });
                }
            },
            // 批量删除
            batchDel(multipleSelection) {
                let _this = this;
                _this.delLoading = true;
                let readyToDeleteIds = [];
                if (multipleSelection instanceof Array) {
                    for (let item of multipleSelection) {
                        readyToDeleteIds += item.id + ","
                    }
                } else {
                    readyToDeleteIds.push(multipleSelection.id)
                }
                let param = {
                    ids: readyToDeleteIds
                };
                _this.$Get(_this.khConfig.api.deleteSys, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.listSys();
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                        _this.delLoading = false;
                    })
            },
            handleSelectionChange(array) {
                let _this = this;
                _this.multipleSelection = array;
            },
            // 显示编辑页面
            handleEdit(row) {
                let _this = this;
                _this.display = 'none';
                _this.isAddOrEdit = false;
                _this.editFormVisible = true;
                _this.formTitle = '编辑';
                _this.editBeforeSysName = row.sysName;
                _this.editForm = row;
                _this.editForm.syn = parseInt(row.syn);
                _this.editForm.sso = parseInt(row.sso);
                _this.editForm.sysIndex = row.sysIndex + '';
            },
            // 显示新增界面
            handleAdd() {
                let _this = this;
                _this.display = 'none';
                _this.isAddOrEdit = true;
                _this.editFormVisible = true;
                _this.formTitle = '新增';
                _this.editForm = {
                    sysName: '',
                    sysDesc: '',
                    sysUrl: '',
                    syn: 0,
                    sso: 0,
                    ssoMode: '',
                    sysIndex: '',
                    status: '0',
                    agentAccount: '',
                    agentSecret: ''
                };
            },
            // 保存
            editSubmit() {
                let _this = this;
                _this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            _this.editLoading = true;
                            let url;
                            if (_this.isAddOrEdit) {
                                url = _this.khConfig.api.addSys;
                            } else {
                                url = _this.khConfig.api.updateSys;
                            }
                            _this.$Post(url, _this.convertSysForm2Array(_this.editForm))
                                .then(res => {
                                    _this.editLoading = false;
                                    if (res.errCode === 0) {
                                        _this.listSys();
                                        _this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    _this.editFormVisible = false;
                                })
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            // 获取32UUID
            getUuid() {
                let _this = this;
                _this.agentForm.agentSecret = _this.KHUtils.generate32Uuid();
            },
            // 显示分配账号页面
            handleShowAgentView(row, column, event) {
                let _this = this;
                _this.showVisible = true;
                _this.editBeforeAgentAccount = row.agentAccount;
                _this.agentForm.sysName = row.sysName;
                _this.agentForm.syn = parseInt(row.syn);
                _this.agentForm.id = row.id;
                _this.agentForm.agentSecret = row.agentSecret;
                _this.agentForm.agentAccount = row.agentAccount;
            },
            // 分配数据同步账号
            updateAgent() {
                let _this = this;
                _this.$refs.agentForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            _this.agentLoading = true;
                            _this.$Post(_this.khConfig.api.updateAgent, _this.convertAgentForm2Array(_this.agentForm))
                                .then(res => {
                                    if (res.errCode === 0) {
                                        _this.listSys();
                                        _this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    _this.showVisible = false;
                                    _this.agentLoading = false;
                                })
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            // form提交参数处理
            convertSysForm2Array(_form) {
                let _this = this;
                let paramArray = [];
                paramArray.push("sysName=" + _form.sysName);
                paramArray.push("sysUrl=" + _form.sysUrl);
                paramArray.push("sysIndex=" + _form.sysIndex);
                paramArray.push("syn=" + _form.syn);
                paramArray.push("sso=" + _form.sso);
                paramArray.push("status=" + _form.status);
                if (!_this.KHUtils.isInvalidValue(_form.sysDesc)) {
                    paramArray.push("sysDesc=" + _form.sysDesc);
                }
                if (!_this.KHUtils.isInvalidValue(_form.ssoMode)) {
                    paramArray.push("ssoMode=" + _form.ssoMode);
                }
                if (!_this.KHUtils.isInvalidValue(_form.agentAccount)) {
                    paramArray.push("agentAccount=" + _form.agentAccount);
                }
                if (!_this.KHUtils.isInvalidValue(_form.agentSecret)) {
                    paramArray.push("agentSecret=" + _form.agentSecret);
                }
                if (!_this.isAddOrEdit) {
                    paramArray.push("id=" + _form.id);
                }
                paramArray = paramArray.join("&");
                return paramArray;
            },
            // AgentForm提交参数处理
            convertAgentForm2Array(_form) {
                let paramArray = [];
                paramArray.push("sysName=" + _form.sysName);
                paramArray.push("syn=0");
                paramArray.push("agentAccount=" + _form.agentAccount);
                paramArray.push("agentSecret=" + _form.agentSecret);
                paramArray.push("id=" + _form.id);
                paramArray = paramArray.join("&");
                return paramArray;
            }
        }
    }
</script>
<style lang="scss" scoped>
    .custom-sys-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }
</style>

