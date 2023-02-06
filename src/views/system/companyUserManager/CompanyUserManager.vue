<template>
    <el-col :span="24" style="padding: 8px  10px 8px 70px ">
        <el-row>
            <el-row style="margin-bottom: 10px ;margin-left: -60px">
                <el-button @click="handleAdd">新增</el-button>
            </el-row>
            <!--列表-->
            <el-row style="margin-bottom: 10px;margin-left: -60px">
                <el-col :span="24">
                    <el-table
                        :data="tableData"
                        highlight-current-row
                        border
                        stripe
                        v-loading="listLoading"
                        style="width: 98%;text-align: center"
                        @row-click="handleEdit"
                    >
                        
                        <el-table-column prop="userName" label="用户名" width="120">
                        </el-table-column>
                        <el-table-column prop="realName" label="联系人">
                        </el-table-column>
                        <el-table-column prop="sex" label="性别" width="120">
                            <template slot-scope="scope">
                                {{sexName(scope.row.sex)}}
                            </template>
                        </el-table-column>
                        <el-table-column prop="jobs" label="职务">
                        </el-table-column>
                        <el-table-column prop="phone" label="手机">
                        </el-table-column>
                        <el-table-column prop="officePhone" label="办公电话">
                        </el-table-column>
                        <el-table-column prop="email" label="邮箱">
                        </el-table-column>
                        <el-table-column label="操作" width="200">
                            <template slot-scope="scope">
                                <el-button
                                    size="mini"
                                    type="primary"
                                    @click.stop="resetPwd( scope.row)">重置密码
                                </el-button>
                                <el-button
                                    size="mini"
                                    type="danger"
                                    @click.stop="deleteCompanyUser( scope.row)">删除
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                
                </el-col>
            </el-row>
            
            <!--编辑界面-->
            <el-dialog title="修改用户信息" :visible.sync="editFormVisible">
                <el-form :model="editForm" label-width="130px" :rules="editFormRules" ref="editForm">
                    <el-row>
                        <el-form-item label="账号" prop="userName">
                            <el-input v-model="editForm.userName" placeholder="请输入账号" :disabled="true"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人" prop="realName">
                                <el-input v-model="editForm.realName" placeholder="请输入联系人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <template>
                                    <el-radio v-model="editForm.sex" label="0">男</el-radio>
                                    <el-radio v-model="editForm.sex" label="1">女</el-radio>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="职务" prop="jobs">
                            <el-input v-model="editForm.jobs" placeholder="请输入职务"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="editForm.phone" placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="办公电话" prop="officePhone">
                            <el-input v-model="editForm.officePhone" placeholder="请输入办公电话"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="Email" prop="email">
                            <el-input v-model="editForm.email" placeholder="请输入邮箱地址"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存
                    </el-button>
                </div>
            </el-dialog>
            <!--新增用户-->
            <el-dialog title="新增用户" :visible.sync="addUserVisible">
                <el-form :model="addUser" label-width="130px" :rules="addUserRules" ref="addUser">
                    <el-row>
                        <el-form-item label="账号" prop="userName">
                            <el-input v-model="addUser.userName" placeholder="请输入账号"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="密码" prop="password">
                                    <el-input type="password" autocomplete="off" v-model="addUser.password"
                                              placeholder="请输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="确认密码" prop="password1">
                                    <el-input type="password" autocomplete="off" v-model="addUser.password1"
                                              placeholder="请重新输入密码"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人" prop="realName">
                                <el-input v-model="addUser.realName" placeholder="请输入联系人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <template>
                                    <el-radio v-model="addUser.sex" label="0">男</el-radio>
                                    <el-radio v-model="addUser.sex" label="1">女</el-radio>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="职务" prop="jobs">
                            <el-input v-model="addUser.jobs" placeholder="请输入职务"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="手机号码" prop="phone">
                            <el-input v-model="addUser.phone" placeholder="请输入手机号码"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="办公电话" prop="officePhone">
                            <el-input v-model="addUser.officePhone" placeholder="请输入办公电话"></el-input>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="Email" prop="email">
                            <el-input v-model="addUser.email" placeholder="请输入邮箱地址"></el-input>
                        </el-form-item>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="addUserSubmit" :loading="editLoading">确认
                    </el-button>
                </div>
            </el-dialog>
            <!--修改密码-->
            <el-dialog title="修改密码" :visible.sync="pwdVisible" :close-on-click-modal="false">
                <el-form :model="pwdForm" label-width="120px" :rules="pwdRules" ref="pwdForm">
                    <el-row>
                        <el-col :span="24">
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="用户名" prop="username">
                                        <el-input v-model="pwdForm.username" disabled></el-input>
                                    </el-form-item>
                                </el-col>
                                <!--                     <el-col :span="12">
                                                         <el-form-item label="旧密码" prop="password">
                                                             <el-input v-model="pwdForm.password" type="password"></el-input>
                                                         </el-form-item>
                                                     </el-col>-->
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="新密码" prop="newPassword">
                                        <el-input v-model="pwdForm.newPassword" type="password"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                            <el-row>
                                <el-col :span="12">
                                    <el-form-item label="确认新密码" prop="surePassword">
                                        <el-input v-model="pwdForm.surePassword" type="password"></el-input>
                                    </el-form-item>
                                </el-col>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="updatePwd()" :loading="pwdLoading">保存</el-button>
                </div>
            </el-dialog>
        </el-row>
    </el-col>
</template>

<script type="es6">
    import {mapGetters} from 'vuex';
    import {JSEncrypt} from 'jsencrypt';
    export default {
        name: "CompanyUserManager",
        data() {
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.pwdForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            return {
                listLoading: false,
                editLoading: false,
                tableData: [],
                editForm: {},
                editFormVisible: false,
                addUserVisible: false,
                companyId: 0,
                addUser: {},
                addUserParam: {},
                editFormRules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'blur'}
                    ],
                    jobs: [
                        {required: true, message: '请输入职务', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'}
                    ]
                },
                addUserRules: {
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入联系人', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    password1: [
                        {required: true, message: '请再次输入密码', trigger: 'blur'}
                    ],
                    sex: [
                        {required: true, message: '请选择性别', trigger: 'blur'}
                    ],
                    jobs: [
                        {required: true, message: '请输入职务', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '请输入手机号码', trigger: 'blur'}
                    ]
                },
                /*修改密码*/
                pwdForm: {
                    username: '',
                    password: '',
                    newPassword: '',
                    surePassword: '',
                    id: ''
                },
                pwdLoading: false,
                pwdVisible: false,
                pwdRules: {
                    /*         password: [
                     {required: true, message: '请输入旧密码', trigger: 'blur'},
                     {validator: checkPasswordRight, trigger: 'blur'}
                     ],*/
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        /*  {validator: validateNewPassword, trigger: 'blur'}*/
                    ],
                    surePassword: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                }
            }
        },
        mounted() {
            this.queryAllUsers();
        },
        methods: {
            // 密码明文加密
            encryptedPwd(pwd) {
                let _this = this;
                if (_this.KHUtils.isInvalidValue(pwd)) {
                    return false;
                }
                let encryptor = new JSEncrypt();
                encryptor.setPublicKey(_this.khConfig.host.publicKeyStr);
                return encryptor.encrypt(pwd);
            },
            queryAllUsers() {
                this.$Get(this.khConfig.api.queryAllUsersByUserId).then(res => {
                    console.log("==" + JSON.stringify(res));
                    if (res.errCode === 0) {
                        this.companyId = res.companyId;
                    }
                    this.tableData = res.datas;
                    this.listLoading = false;
                });
            },
            // 显示编辑页面
            handleEdit(row) {
                this.editFormVisible = true;
                this.editForm = row;
            },
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            this.$Get(this.khConfig.api.updateCompanyUserInfo, this.editForm)
                                .then(res => {
                                    this.editLoading = false;
                                    if (res.errCode === 0) {
                                        this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    this.queryAllUsers();
                                    this.editFormVisible = false;
                                })
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            //新增
            handleAdd() {
                this.addUser = {
                    companyId: 0,
                    userName: "",
                    password: "",
                    password1: "",
                    realName: "",
                    sex: "0",
                    jobs: "",
                    phone: "",
                    officePhone: "",
                    email: ""
                    
                }
                this.addUserVisible = true;
            },
            addUserSubmit() {
                this.addUser.companyId = this.companyId;
                this.$refs.addUser.validate((valid) => {
                    if (valid) {
                        if (this.addUser.password != this.addUser.password1) {
                            this.$notify({
                                title: '错误',
                                message: '两次密码不一致请从新输入！',
                                type: 'error'
                            });
                        } else {
                            this.$confirm('确认保存吗？', '提示', {}).then(() => {
                                this.editLoading = true;
                                var pwd = this.addUser.password;
                                this.addUser.password = this.encryptedPwd(pwd);
                                this.addUser.password1 = this.encryptedPwd(pwd);
                                this.addUserParam.companyId = this.addUser.companyId;
                                this.addUserParam.userName = this.addUser.userName;
                                this.addUserParam.ps = this.addUser.password;
                                this.addUserParam.ps1 = this.addUser.password1;
                                this.addUserParam.realName = this.addUser.realName;
                                this.addUserParam.sex = this.addUser.sex;
                                this.addUserParam.jobs = this.addUser.jobs;
                                this.addUserParam.phone = this.addUser.phone;
                                this.addUserParam.officePhone = this.addUser.officePhone;
                                this.addUserParam.email = this.addUser.email;
                                this.$Get(this.khConfig.api.addCompanyUser, this.addUserParam)
                                    .then(res => {
                                        this.editLoading = false;
                                        if (res.errCode === 0) {
                                            this.$notify({
                                                title: '成功',
                                                message: '操作成功',
                                                type: 'success'
                                            });
                                        }
                                        this.queryAllUsers();
                                        this.addUserVisible = false;
                                    })
                            }).catch((e) => {
                                console.log(e)
                            });
                        }
                        
                    }
                });
            },
            //删除用户
            deleteCompanyUser(row) {
                let _this = this;
                let param = {
                    ids: row.userId
                };
                this.$confirm('确认删除吗？', '提示', {}).then(() => {
                    _this.$Get(_this.khConfig.api.deleteCompanyUser, param)
                        .then(res => {
                            if (res.errCode === 0) {
                                _this.$notify({
                                    title: '成功',
                                    message: '删除成功',
                                    type: 'success'
                                });
                                this.queryAllUsers();
                            }
                        })
                }).catch((e) => {
                    console.log(e)
                });
                
                
            },
            /*修改密码*/
            changePwd(row) {
                console.log(JSON.stringify(row))
                this.pwdVisible = true;
                this.pwdForm.username = row.userName;
                this.pwdForm.id = row.userId;
                this.pwdForm.password = "";
                this.pwdForm.newPassword = "";
                this.pwdForm.surePassword = "";
                
            },
            // 修改密码
            updatePwd() {
                let _this = this;
                _this.$refs.pwdForm.validate((valid) => {
                    if (valid) {
                        _this.pwdLoading = true;
                        setTimeout(function () {
                            _this.pwdLoading = false;
                            let paramArray = [];
                            paramArray.push("username=" + _this.pwdForm.username);
                            paramArray.push("password=" + _this.encryptedPwd(_this.pwdForm.newPassword));
                            paramArray.push("id=" + _this.pwdForm.id);
                            paramArray = paramArray.join("&");
                            _this.$Post(_this.khConfig.api.updatePwd, paramArray)
                                .then(res => {
                                    if (res.errCode === 0) {
                                        _this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    _this.pwdVisible = false;
                                })
                        }, 1000);
                    }
                });
            },
            // 重置密码
            resetPwd(row) {
                let _this = this;
                _this.$confirm('确认重置' + row.userName + '的密码吗？', '提示', {}).then(() => {
                    setTimeout(function () {
                        let paramArray = [];
                        paramArray.push("username=" + row.userName);
                        // paramArray.push("password=kh123456");
                        paramArray.push("id=" + row.userId);
                        paramArray = paramArray.join("&");
                        _this.$Post(_this.khConfig.api.resetPwd, paramArray)
                            .then(res => {
                                if (res.errCode === 0) {
                                    _this.$notify({
                                        title: '成功',
                                        message: '重置密码成功,初始密码为kh123456,请尽快修改密码！！！',
                                        type: 'success',
                                        duration: 0
                                    });
                                }
                            })
                    }, 1000);
                }).catch((e) => {
                    console.log(e)
                });
            },
        },
        computed: {
            ...mapGetters({
                user: 'getUserInfo'
            }),
            
            sexName: function () {
                return function (value) {
                    var name;
                    switch (value) {
                        case "0":
                            name = "男";
                            break;
                        case  "1":
                            name = "女";
                            break;
                    }
                    return name;
                }
            }
        },
        
    }
</script>

<style scoped>

</style>
