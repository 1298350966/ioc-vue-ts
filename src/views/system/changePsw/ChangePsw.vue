<template>
    <el-form style="padding:25vh 15px 20px 15px;" :model="pwdForm" label-width="120px" :rules="pwdRules" ref="pwdForm">
        <el-row >
            <el-col :span="24" >
                <el-row class="form-item">
                    <el-col :span="12">
                        <el-form-item label="旧密码" prop="password">
                            <el-input v-model="pwdForm.password" type="password" onpaste="return false"
                                      oncopy="return false" oncut="return false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="form-item">
                    <el-col :span="12">
                        <el-form-item label="新密码" prop="newPassword">
                            <el-input v-model="pwdForm.newPassword" type="password" onpaste="return false"
                                      oncopy="return false" oncut="return false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="form-item">
                    <el-col :span="12">
                        <el-form-item label="确认新密码" prop="surePassword">
                            <el-input v-model="pwdForm.surePassword" type="password" onpaste="return false"
                                      oncopy="return false" oncut="return false"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row class="form-item">
                    <el-button type="primary" @click.native="updatePwd()" :loading="pwdLoading">保存</el-button>
                </el-row>
            </el-col>
        </el-row>
    </el-form>
</template>

<script>
    import {mapFormatter} from '@/utils/khFormatter.js';
    import {JSEncrypt} from 'jsencrypt';

    export default {
        filters: {
            ...mapFormatter
        },
        data() {
            const KHUtils = this.KHUtils;
            // 校验修改密码前密码是否输入正确
            const checkPasswordRight = (rule, value, callback) => {
                let _this = this;
                // 解决输入数字
                value = value + "";
                value = value.replace(/\s*/g, "");
                let data = {
                    pwd: _this.encryptedPwd(value)
                };
                _this.$Get(_this.khConfig.api.checkCurrentPwd, data).then(res => {
                    if (res.errCode === 0) {
                        callback();
                    } else {
                        callback(new Error('原密码错误'));
                    }
                }).catch(error => {
                    console.log("checkExists OrgName :" + error);
                    callback(new Error('服务端错误'));
                });
            };
            var validatePass2 = (rule, value, callback) => {
                if (value === '') {
                    callback(new Error('请再次输入密码'));
                } else if (value !== this.pwdForm.newPassword) {
                    callback(new Error('两次输入密码不一致!'));
                } else {
                    callback();
                }
            };
            const validateNewPassword = (rule, value, callback) => {
                let password = this.pwdForm.newPassword;
                if (!KHUtils.isNull(password) && !KHUtils.isValidPwd(password)) {
                   // callback(new Error('请输入8至16位数字与字母组合的密码'));
                  callback(new Error('至少6位数密码包含数字、小写字母、大写字母和特殊符号'));
                } else {
                    callback();
                }
            };
            return {
                pwdLoading: false,
                pwdForm: {
                    username: '',
                    password: '',
                    newPassword: '',
                    surePassword: '',
                },
                pwdRules: {
                    password: [
                        {required: true, message: '请输入旧密码', trigger: 'blur'},
                    ],
                    newPassword: [
                        {required: true, message: '请输入新密码', trigger: 'blur'},
                        {validator: validateNewPassword, trigger: 'blur'}
                    ],
                    surePassword: [
                        {required: true, message: '请再次输入新密码', trigger: 'blur'},
                        {validator: validatePass2, trigger: 'blur'}
                    ],
                },
            }
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
            updatePwd() {
                let _this = this;
                _this.$refs.pwdForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            _this.pwdLoading = true;
                            setTimeout(function () {
                                _this.pwdLoading = false;
                                let param = {
                                    oldPs: _this.encryptedPwd(_this.pwdForm.password),
                                    newPs: _this.encryptedPwd(_this.pwdForm.newPassword)
                                };
                                _this.$Get(_this.khConfig.api.updateCurrentPwd, param)
                                    .then(res => {
                                        if (res.errCode === 0) {
                                            _this.$notify({
                                                title: '成功',
                                                message: '修改密码成功',
                                                type: 'success'
                                            });
                                        }
                                        _this.pwdVisible = false;
                                        _this.pwdForm = {
                                            username: '',
                                            password: '',
                                            newPassword: '',
                                            surePassword: '',
                                        }

                                    })
                            }, 1000);
                        }).catch((e) => {
                            console.log(e)
                            _this.pwdForm = {
                                username: '',
                                password: '',
                                newPassword: '',
                                surePassword: '',
                            }
                        });
                    }
                });
            },
        }
    }
</script>


<style>
.form-item{
    display:flex;
    justify-content:center;
    align-items:center;
}
</style>
