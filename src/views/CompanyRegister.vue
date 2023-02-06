<template>
    <el-col :span="24" style="padding: 8px  140px 8px 140px ;">
        <el-row>
            <el-col style="text-align: center;font-size:30px;margin-bottom: 30px">企业注册</el-col>
            <el-form :model="companyUserInfo.companyInfo" label-width="130px" :rules="companyUserInfoRules"
                     ref="companyInfo">
                <el-row>
                    <el-form-item label="企业名称" prop="companyName">
                        <el-row>
                            <el-col :span="12">
                                <el-input v-model="companyUserInfo.companyInfo.companyName"
                                          placeholder="请输入企业名称"></el-input>
                            </el-col>
                            <el-col :span="12" style="padding-left: 10px">请务必输入企业全称，与行政公章完全一致。</el-col>
                        </el-row>
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="详细地址" prop="administrativeAreaName">
                            <el-input v-model="companyUserInfo.companyInfo.administrativeAreaName"
                                      @focus="openAdministrativeArea">
                            </el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                        <el-form-item prop="address">
                            <el-input v-model="companyUserInfo.companyInfo.address" placeholder="请输入详细地址"
                                      @focus="openGis"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="6">
                        <el-form-item label="纬度">
                            <el-input v-model="companyUserInfo.companyInfo.lat" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="经度">
                            <el-input v-model="companyUserInfo.companyInfo.lnt" :disabled="true"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="10">
                    </el-col>
                </el-row>
                <el-row>
                    <el-form-item label="所属行业" prop="industryName">
                        <el-row>
                            <el-col :span="12">
                                <el-input v-model="companyUserInfo.companyInfo.industryName" placeholder="请选择行业"
                                          @focus="openIndusty"></el-input>
                            </el-col>
                        </el-row>
                    
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="行业类别" prop="industyType">
                        <el-row>
                            <el-col :span="12">
                                <el-input v-model="companyUserInfo.companyInfo.industyType"
                                          placeholder="请选择行业类别"></el-input>
                            </el-col>
                        </el-row>
                    
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="国民经济行业类型" prop="economicTypeName">
                        <el-row>
                            <el-col :span="12">
                                <el-input v-model="companyUserInfo.companyInfo.economicTypeName"
                                          placeholder="请输入国民经济行业类型"></el-input>
                            </el-col>
                        </el-row>
                    
                    </el-form-item>
                </el-row>
                <el-row>
                    <el-form-item label="组织机构代码" prop="companyCode">
                        <el-row>
                            <el-col :span="8">
                                <el-input v-model="companyUserInfo.companyInfo.companyCode"
                                          placeholder="请输入组织机构代码"></el-input>
                            </el-col>
                            <el-col :span="16" style="padding-left: 10px">如果没有可以填写工商登记注册号或统一社会信用代码 （注册成功之后将作为登录系统的帐号）。
                            </el-col>
                        </el-row>
                    
                    </el-form-item>
                </el-row>
                <el-form :model="companyUserInfo.user" label-width="130px" :rules="companyUserInfoRules"
                         ref="companyUser"
                         style="margin-top: 20px">
                    <!--<el-row>
                      <el-form-item label="用户名" prop="userName">
                        <el-input v-model="companyUserInfo.user.userName" placeholder="请输入用户名"></el-input>
                      </el-form-item>
                    </el-row>-->
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="密码" prop="password">
                                <el-input type="password" autocomplete="off" v-model="companyUserInfo.user.password"
                                          placeholder="请输入密码"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="确认密码" prop="password1">
                                <el-input type="password" autocomplete="off" v-model="companyUserInfo.user.password1"
                                          placeholder="请重新输入密码"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="联系人" prop="realName">
                                <el-input v-model="companyUserInfo.user.realName" placeholder="请输入联系人"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="性别" prop="sex">
                                <template>
                                    <el-radio v-model="companyUserInfo.user.sex" label="0">男</el-radio>
                                    <el-radio v-model="companyUserInfo.user.sex" label="1">女</el-radio>
                                </template>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-form-item label="职务" prop="jobs">
                            <el-row>
                                <el-col :span="8">
                                    <el-input v-model="companyUserInfo.user.jobs" placeholder="请输入职务"></el-input>
                                </el-col>
                                <el-col :span="16" style="padding-left: 10px">示例：安全部长、安全科长、安全主管、安全员等。</el-col>
                            </el-row>
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="手机号码" prop="phone">
                            <el-row>
                                <el-col :span="8">
                                    <el-input type="string" v-model="companyUserInfo.user.phone"
                                              placeholder="请输入手机号码"></el-input>
                                </el-col>
                                <el-col :span="16" style="padding-left: 10px">必须填写有效手机号码，以后将作为接收系统预警提醒消息使用</el-col>
                            </el-row>
                        
                        </el-form-item>
                    
                    
                    </el-row>
                    <el-row>
                        <el-form-item label="办公电话" prop="officePhone">
                            <el-row>
                                <el-col :span="12">
                                    <el-input v-model="companyUserInfo.user.officePhone"
                                              placeholder="请输入办公电话"></el-input>
                                </el-col>
                            </el-row>
                        
                        </el-form-item>
                    </el-row>
                    <el-row>
                        <el-form-item label="Email" prop="email">
                            <el-row>
                                <el-col :span="12">
                                    <el-input v-model="companyUserInfo.user.email" placeholder="请输入邮箱"></el-input>
                                </el-col>
                            </el-row>
                        
                        </el-form-item>
                    </el-row>
                </el-form>
            </el-form>
        </el-row>
        <el-row style="text-align: center">
            <el-button type="primary" @click.native="saveCompanyUserInfo" :loading="saveCompanyUserInfoLoading">提交
            </el-button>
            <el-button @click.native="cancelRegister">取消
            </el-button>
        </el-row>
        <el-dialog title="行政区域" :visible.sync="administrativeVisible">
            <el-row>
                <el-col>
                    <el-tree
                        :data="dicCatalogData"
                        :props="dicCatalogProps"
                        node-key="id"
                        accordion
                        highlight-current
                        @current-change="selectDicCatalog"
                        default-expand-all
                        :expand-on-click-node="false">
                    </el-tree>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="监管类型" :visible.sync="industyVisible">
            <el-row>
                <el-col>
                    <el-tree
                        :data="dicIndustyData"
                        :props="dicCatalogProps"
                        node-key="id"
                        accordion
                        highlight-current
                        @current-change="selectDicIndusty"
                        default-expand-all
                        :expand-on-click-node="false">
                    </el-tree>
                </el-col>
            </el-row>
        </el-dialog>
        <el-dialog title="地图定位"
                   :visible.sync="gisVisible"
                   :close-on-click-modal="closeOnClickModal"
                   :close-on-press-escape="closeOnClickModal"
                   width="60%"
                   append-to-body
                   @close="handlerGisClose"
        >   
        <Gis :gisType="khConfig.host.gisType" :from-parent-gis-obj="editGisObj"
                        :gis-init-obj="gisInitObj"
                        @recGisMsg="recGisMsg"
                        :child-resp="notifyChild"></Gis>
        </el-dialog>
        <el-row>
            <el-col :span="24" style="font-size: 14px;font-family:”SimSun”,serif">
                <p style="margin: 5px 0;">注冊说明</p>
                <p style="margin: 5px 0;">1、企业注册后，系统将默认按注册的详细地址提交给系统管理员进行审核。</p>
                <p style="margin: 5px 0;">2、审核时间为自企业注册之日起两个工作日内。审核通过后，系统将自动通过短信提醒用户。用户也可通过登录帐号验证是否已审核通过，以免延误时间。</p>
                <p style="margin: 5px 0;">3、新注册企业审核通过后，方可凭登录帐号和密码进入信息系统，进行信息录入或者申请许可等相关业务。</p>
            </el-col>
        </el-row>
    </el-col>
</template>

<script type="es6">
    import {JSEncrypt} from 'jsencrypt';
    import Gis from '@/components/gis/Gis'
    // import GaoDeGis from '@/components/gis/GaoDeGis';
    export default {
        name: "CompanyRegister",
        components: {
            // GaoDeGis
            Gis
        },
        data() {
            return {
                gisVisible: false,
                closeOnClickModal: false,
                editGisObj: {},
                gisInitObj: {
                    gisInitCity: 13,
                    gisInitLat: 28.683016,
                    gisInitLng: 115.857963
                },
                notifyChild: 0,
                administrativeVisible: false,
                dicCatalogData: [],
                display: 'none',
                industyVisible: false,
                dicIndustyData: [],
                saveCompanyUserInfoLoading: false,
                dicCatalogProps: {
                    label: 'name',
                    children: 'children'
                },
                dicIndustyProps: {
                    label: 'name',
                    children: 'children'
                },
                companyUserInfo: {
                    companyInfo: {
                        companyName: "",
                        administrativeAreaCode: "",
                        administrativeAreaName: "",
                        address: "",
                        lat: 0,
                        lnt: 0,
                        industryCode: "",
                        industryName: "",
                        industyType: "",
                        economicTypeCode: 0,
                        economicTypeName: "",
                        companyCode: ""
                    },
                    user:
                        {
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
                },
                paramInfo: {
                    companyInfo: {
                        companyName: "",
                        administrativeAreaCode: "",
                        administrativeAreaName: "",
                        address: "",
                        industryCode: "",
                        industryName: "",
                        industyType: "",
                        economicTypeCode: 0,
                        economicTypeName: "",
                        companyCode: ""
                    },
                    user:
                        {
                            userName: "",
                            ps: "",
                            ps1: "",
                            realName: "",
                            sex: "0",
                            jobs: "",
                            phone: "",
                            officePhone: "",
                            email: ""
                        }
                },
                companyUserInfoRules: {
                    companyName: [
                        {required: true, message: '请输入企业名称', trigger: 'blur'}
                    ],
                    administrativeAreaName: [
                        {required: true, message: '请输入行政区域名称', trigger: 'blur'}
                    ],
                    address: [
                        {required: true, message: '请输入详细地址', trigger: 'blur'}
                    ],
                    industryName: [
                        {required: true, message: '请输入所属行业名称', trigger: 'blur'}
                    ],
                    industyType: [
                        {required: true, message: '请输入行业类别', trigger: 'blur'}
                    ],
                    companyCode: [
                        {required: true, message: '请输入组织机构代码', trigger: 'blur'}
                    ],
                    userName: [
                        {required: true, message: '请输入用户名', trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    password1: [
                        {required: true, message: '请输入密码', trigger: 'blur'}
                    ],
                    realName: [
                        {required: true, message: '请输入姓名', trigger: 'blur'}
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
            }
        },
        mounted() {
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
            saveCompanyUserInfo() {
                this.$refs.companyInfo.validate((valid) => {
                    if (valid) {
                        this.$refs.companyUser.validate((valid) => {
                            if (valid) {
                                if (this.companyUserInfo.user.password != this.companyUserInfo.user.password1) {
                                    this.$notify({
                                        title: '错误',
                                        message: '两次密码不一致请重新输入！',
                                        type: 'error'
                                    });
                                } else {
                                    this.$confirm('确认提交吗？', '提示', {}).then(() => {
                                        this.saveCompanyUserInfoLoading = true;
                                        var pwd = this.companyUserInfo.user.password;
                                        this.companyUserInfo.user.password = this.encryptedPwd(pwd);
                                        this.companyUserInfo.user.password1 = this.encryptedPwd(pwd);
                                        this.paramInfo.companyInfo.companyName = this.companyUserInfo.companyInfo.companyName;
                                        this.paramInfo.companyInfo.administrativeAreaCode = this.companyUserInfo.companyInfo.administrativeAreaCode;
                                        this.paramInfo.companyInfo.administrativeAreaName = this.companyUserInfo.companyInfo.administrativeAreaName;
                                        this.paramInfo.companyInfo.address = this.companyUserInfo.companyInfo.address;
                                        this.paramInfo.companyInfo.lat = this.companyUserInfo.companyInfo.lat;
                                        this.paramInfo.companyInfo.lnt = this.companyUserInfo.companyInfo.lnt;
                                        this.paramInfo.companyInfo.industryCode = this.companyUserInfo.companyInfo.industryCode;
                                        this.paramInfo.companyInfo.industryName = this.companyUserInfo.companyInfo.industryName;
                                        this.paramInfo.companyInfo.industyType = this.companyUserInfo.companyInfo.industyType;
                                        this.paramInfo.companyInfo.economicTypeCode = this.companyUserInfo.companyInfo.economicTypeCode;
                                        this.paramInfo.companyInfo.economicTypeName = this.companyUserInfo.companyInfo.economicTypeName;
                                        this.paramInfo.companyInfo.companyCode = this.companyUserInfo.companyInfo.companyCode;
                                        this.paramInfo.user.userName = this.companyUserInfo.user.userName;
                                        this.paramInfo.user.ps = this.companyUserInfo.user.password;
                                        this.paramInfo.user.ps1 = this.companyUserInfo.user.password1;
                                        this.paramInfo.user.realName = this.companyUserInfo.user.realName;
                                        this.paramInfo.user.sex = this.companyUserInfo.user.sex;
                                        this.paramInfo.user.jobs = this.companyUserInfo.user.jobs;
                                        this.paramInfo.user.phone = this.companyUserInfo.user.phone;
                                        this.paramInfo.user.officePhone = this.companyUserInfo.user.officePhone;
                                        this.paramInfo.user.email = this.companyUserInfo.user.email;
                                        
                                        this.$PostJson(this.khConfig.api.companyRegistered, this.paramInfo)
                                            .then(res => {
                                                this.saveCompanyUserInfoLoading = false;
                                                if (res.errCode === 0) {
                                                    this.$notify({
                                                        title: '成功',
                                                        message: '注册成功',
                                                        type: 'success'
                                                    });
                                                    this.companyUserInfo = {
                                                        companyInfo: {
                                                            companyName: "",
                                                            administrativeAreaCode: "",
                                                            administrativeAreaName: "",
                                                            address: "",
                                                            industryCode: "",
                                                            industryName: "",
                                                            industyType: "",
                                                            economicTypeCode: 0,
                                                            economicTypeName: "",
                                                            companyCode: ""
                                                        },
                                                        user:
                                                            {
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
                                                    };
                                                    // this.cancelRegister();
                                                    // 注册成功,调转至首页
                                                    let host = window.location.host;
                                                    window.location.href = "http://" + host;
                                                } else {
                                                    this.$notify({
                                                        title: '失败',
                                                        message: '注册失败',
                                                        type: 'error'
                                                    });
                                                }
                                                
                                            })
                                    }).catch((e) => {
                                        console.log(e)
                                    });
                                    
                                }
                                
                            }
                        });
                        
                    }
                });
                
                
            },
            //取消
            cancelRegister() {
                this.$Get(this.khConfig.api.getUser, null).then(res => {
                
                });
                
            },
            
            //获取行政区域数据字典
            getAdministrativeDic() {
                let _this = this;
                _this.dicCatalogData = [];
                _this.$Get(_this.khConfig.api.getAdministrativeDic)
                    .then(res => {
                        if (res.children != null && res.children.length > 0) {
                            _this.dicCatalogData = res.children;
                        }
                    })
            },
            //获取所属行业数据字典
            getIndustryDic() {
                let _this = this;
                _this.dicIndustyData = [];
                _this.$Get(_this.khConfig.api.getIndustryDic)
                    .then(res => {
                        if (res.children != null && res.children.length > 0) {
                            _this.dicIndustyData = res.children;
                        }
                    })
            },
            // 是否展开字典类目树
            openAdministrativeArea() {
                this.getAdministrativeDic();
                this.administrativeVisible = true;
            },
            openIndusty() {
                this.getIndustryDic();
                this.industyVisible = true;
            },
            // 选择上级
            selectDicCatalog(data, node, self) {
                console.log("选择：" + JSON.stringify(data));
                this.companyUserInfo.companyInfo.administrativeAreaCode = data.code;
                this.companyUserInfo.companyInfo.administrativeAreaName = data.name;
                this.administrativeVisible = false;
            },
            selectDicIndusty(data, node, self) {
                this.companyUserInfo.companyInfo.industryCode = data.code;
                this.companyUserInfo.companyInfo.industryName = data.name;
                this.industyVisible = false;
            },
            //打开gis定位
            openGis() {
                this.gisVisible = true;
            },
            //返回定位信息
            recGisMsg(obj) {
                this.companyUserInfo.companyInfo.lat = obj.lat;
                this.companyUserInfo.companyInfo.lnt = obj.lnt;
                this.companyUserInfo.companyInfo.address = obj.address;
                this.gisVisible = false;
                
                
            },
            // 关闭GIs窗口通知子组件返回数据给父组件
            handlerGisClose() {
                this.notifyChild++;
            },
        }
        
    }
</script>

<style scoped>

</style>
