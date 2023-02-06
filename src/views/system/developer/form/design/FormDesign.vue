<template>
    <el-row class="process-manage">
        <el-row class="process-manage-top">
            <el-col :span="12">
                <h3>表单管理</h3>
                <el-button type="info" icon="el-icon-s-tools" @click="formGroupVisible = true" plain>分组管理</el-button>
                <!--<el-button type="info" icon="el-icon-sort" @click="addFormGroupVisible" disabled plain>分组排序</el-button>-->
            </el-col>
            <el-col :span="12" class="text-right">
                <el-button type="primary" icon="el-icon-plus" @click="handleAdd" plain>创建新表单</el-button>
            </el-col>
        </el-row>
        <el-row>
            <form-conf-table :form-type="formType" @handleEdit="handleEdit" :list="listNum"
                             :showManageProcess="true"></form-conf-table>
        </el-row>
        <el-dialog :title="formConf.formName === '' ? '基础设置' : formConf.formName"
                   :visible.sync="editFormVisible"
                   custom-class="custom-dialog" :close-on-click-modal="false" @close="handleClose" fullscreen>
            <el-row v-if="!addOrEdit">
                <el-steps :active="active" simple finish-status="success" process-status="process"
                          class="form-design-step">
                    <el-step title="基础设置" icon="el-icon-setting" @click.native="handleChooseJumpStep(0)">
                    </el-step>
                    <el-step title="表单设计" icon="el-icon-s-order" @click.native="handleChooseJumpStep(1)"></el-step>
                    <el-step title="高级设置" icon="el-icon-s-tools" @click.native="handleChooseJumpStep(2)"></el-step>
                    <el-step title="菜单配置" icon="el-icon-menu" @click.native="handleChooseJumpStep(3)"></el-step>
                </el-steps>
            </el-row>
            <el-row v-if="addOrEdit">
                <el-steps :active="active" simple finish-status="success" process-status="process">
                    <el-step title="基础设置" icon="el-icon-setting">
                    </el-step>
                    <el-step title="表单设计" icon="el-icon-s-order"></el-step>
                    <el-step title="高级设置" icon="el-icon-s-tools"></el-step>
                    <el-step title="菜单配置" icon="el-icon-menu"></el-step>
                </el-steps>
            </el-row>
            <el-row class="custom-box">
                <!--基础设置-->
                <el-row v-if="active === 0" style="padding: 40px;height: 100%;overflow: auto">
                    <el-form ref="formConf" :model="formConf" label-width="100px" :rules="formConfRules"
                             class="demo-ruleForm">
                        <el-form-item label="表单名称" prop="formName">
                            <el-input v-model="formConf.formName" style="width: 40%"></el-input>
                        </el-form-item>
                        <el-form-item label="选择分组" prop="formGroup">
                            <el-select v-model="formConf.formGroup" placeholder="选择分组" value="">
                                <el-option
                                    v-for="item in formGroupOptions"
                                    :key="item.groupName"
                                    :label="item.groupName"
                                    :value="item.groupName">
                                </el-option>
                            </el-select>
                            <el-button @click="addFormGroupVisible = true">新增分组</el-button>
                        </el-form-item>
                        <el-form-item label="表单权限">
                            <div @click="showFormPermission">
                                <div :class="formPermissions.length>0 ? customDivClass:customDivClass1">
                            <span><span class="el-tag el-tag--info el-tag--mini el-tag--light"
                                        v-for="item in formPermissions" style="margin-right: 2px"><span
                                class="el-select__tags-text">{{item.name}}</span><i
                                class="el-tag__close el-icon-close"
                                @click.stop="delFormPermission(item.id)"></i></span></span>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="企业访问权限" v-show="user.enableCompanyPermission !== 0">
                            <div @click="showCompanyPermission">
                                <div :class="companyPermissions.length>0 ? customDivClass:customDivClass1">
                            <span><span class="el-tag el-tag--info el-tag--mini el-tag--light"
                                        v-for="item in companyPermissions" style="margin-right: 2px"><span
                                class="el-select__tags-text">{{item.companyName}}</span><i
                                class="el-tag__close el-icon-close"
                                @click.stop="delCompanyPermission(item.id)"></i></span></span>
                                </div>
                            </div>
                        </el-form-item>
                        <el-form-item label="模板图标">
                            <custom-upload :list-type="listType"
                                           @fromCustomChild="getFileIdFromCusUpload"></custom-upload>
                            <p>
                                <img v-if="showImage" :src="this.imgSrc" alt=" " width="100px" height="100px"/>
                            </p>
                        </el-form-item>
                        <el-form-item label="表单说明">
                            <el-input type="textarea" v-model="formConf.formComment"></el-input>
                        </el-form-item>
                    </el-form>
                </el-row>
                <!--表单设计-->
                <el-row v-if="active === 1" style="height: 100%">
                    <form-design-tool :form-config="formConfig" :form-id="formId" v-if="formDesignHackReset" :type="0"
                                      :notify-save="notifySaveFormDesign"
                                      @notifyParentClose="notifyParentClose"></form-design-tool>
                </el-row>
                <!--高级设置-->
                <el-row v-if="active === 2" style="height: 100%;">
                    <!--                 <advanced-setting :form-config="formConfig" :form-id="formId" :form-name="formConf.formName"
                                                       v-if="advancedSettingHackReset" :notify-save="notifySave"
                                                       @notifyParentClose="notifyParentClose"></advanced-setting>-->
                    <advanced-setting-restructure v-if="advancedSettingHackReset"
                                                  :form-config="formConfig"
                                                  :form-id="formId"
                                                  :notify-save="notifySave"
                                                  :form-name="formConf.formName"
                                                  :formType="0"
                                                  @notifyParentClose="notifyParentClose"></advanced-setting-restructure>
                </el-row>
                <!--菜单配置-->
                <el-row v-if="active === 3" style="height: 100%">
                    <menu-setting :form-type="formType" :form-id="formId" :form-name="formConf.formName"
                                  :notify-save="notifySaveMenu" @notifyParentClose="notifyParentClose"></menu-setting>
                </el-row>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="back" v-if="active > 0"
                           style="background: #0b1532;border-color: #2153d4">
                    返回上一步
                </el-button>
                <el-button type="primary" @click="next" :loading="nextLoading"
                           style="background: #0b1532;border-color: #2153d4">
                    下一步
                </el-button>
            </div>
        </el-dialog>
        <!--表单分组管理-->
        <form-group :visible="formGroupVisible"
                    :data="formGroupOptions"
                    v-if="formGroupVisible"
                    @listFormGroup="listFormGroup"
                    @changeFormGroupVisible="changeFormGroupVisible"
        ></form-group>
        <form-group-add :visible="addFormGroupVisible"
                        v-if="addFormGroupVisible"
                        @listFormGroup="listFormGroup"
                        @changeFormGroupVisible="changeFormGroupVisible"
        ></form-group-add>
        <el-dialog title="表单权限" :visible.sync="formPermissionVisible" width="50%">
            <!--<custom-cascade @getCheckedNodesFromOrgUserTree="getCheckedNodesFromOrgUserTree"
                            v-if="customCascadeHackReset"></custom-cascade>-->
            <ore-transfer @getCheckedNodesFromOrgUserTree="getCheckedNodesFromOrgUserTree"
                          :formPermissions="formPermissions"></ore-transfer>
        </el-dialog>
        <el-dialog title="选择企业" :visible.sync="companyPermissionVisible" :modal="false">
            <div class="block">
                <el-transfer
                    filterable
                    :titles="['请选择', '已选择']"
                    :filter-method="filterCompanyName"
                    :props="{ key: 'id',  label: 'companyName'}"
                    filter-placeholder="请输入企业名称"
                    v-model="targetOptions"
                    :data="companyOptions">
                </el-transfer>
                <div slot="footer" class="dialog-footer" style="position: relative;left: 48%;padding:20px">
                    <el-button type="primary" @click.native="saveCompanyPermission">保存</el-button>
                </div>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    import CustomUpload from "@/components/CustomUpload";
    import OrgUserTree from "@/components/tree/OrgUserTree";
    import CustomCascade from "@/components/CustomCascade";
    import FormDesignTool from "@/components/form-design/FormDesignTool";
    import AdvancedSetting from "@/components/form-design/AdvancedSetting";
    import AdvancedSettingRestructure from "@/components/form-design/restructure/AdvancedSetting";
    import MenuSetting from "@/components/form-design/MenuSetting";
    import FormGroup from "@/components/form-design/FormGroup";
    import FormGroupAdd from "@/components/form-design/FormGroupAdd";
    import FormConfTable from "@/components/form-design/FormConfTable";
    import OreTransfer from "@/components/OreTransfer"
    import {mapGetters} from "vuex";

    export default {
        name: "FormDesign",
        components: {
            OreTransfer,
            FormDesignTool,
            AdvancedSetting,
            MenuSetting,
            CustomCascade,
            OrgUserTree,
            CustomUpload,
            FormGroup,
            FormGroupAdd,
            FormConfTable,
            AdvancedSettingRestructure
        },
        computed: mapGetters({
            user: 'getUserInfo'
        }),
        data() {
            return {
                addOrEdit: true, // true:创建新表单;false:编辑
                chooseJump: false, // 编辑状态下,触发步骤条随意切换步骤
                chooseJumpActive: 0,
                // 企业访问权限
                customDivClass: "customDivClass",
                customDivClass1: "customDivClass1",
                companyPermissionVisible: false,
                companyPermissions: [],  // 显示
                companyOptions: [],
                targetOptions: [],
                // 表单权限
                formPermissions: [],
                formPermissionVisible: false,
                customCascadeHackReset: false,
                // 菜单配置
                notifySaveMenu: 0, // 保存菜单配置
                // 高级设置
                notifySave: 0, // 保存高级设置
                formDesignHackReset: true,
                advancedSettingHackReset: true,
                formType: "0", // 表单类型,0:普通表单
                listNum: 0,  // 通知子组件刷新列表
                listType: "picture",    // 传递给子组件的文件上传的类型
                formConfig: "",            // 表单配置信息
                formGroupVisible: false,     // 表单分组管理
                addFormGroupVisible: false,    // 新增表单分组
                formId: "",     // 表单ID
                formGroupRules: {
                    groupName: [
                        {required: true, message: '请输入分组名称', trigger: 'blur'},
                    ],
                },
                formConfRules: {
                    formName: [
                        {required: true, message: '请输入表单名称', trigger: 'blur'},
                    ],
                    formGroup: [
                        {required: true, message: '请选择分组', trigger: 'blur'}
                    ]
                },
                active: 0,
                showImage: false, // 图标
                imgSrc: "",
                formGroupOptions: [],   // 所属菜单选择项
                formConf: {
                    formId: '',
                    formName: '',
                    formGroup: '',
                    formComment: '',
                    permissions: [],
                    formImg: ''
                },
                nextLoading: false,
                editFormVisible: false,
                notifySaveFormDesign: 0
            };
        },
        mounted() {
            this.listFormGroup();
        },
        methods: {
            handleChooseJumpStep(active) {
                let _this = this;
                _this.chooseJump = true;
                if (_this.chooseJumpActive === active) {
                    return false;
                }
                _this.chooseJumpActive = active;
                if (this.active === 0) {
                    _this.saveFormConf(false);
                } else if (this.active === 1) {
                    // 通知表单设计组件保存
                    this.notifySaveFormDesign++;
                } else if (this.active === 2) {
                    // 通知高级设置组件保存(改造后的表单该处注释)
                    this.notifySave++;
                } else if (this.active === 3) {
                    // 通知保存菜单配置
                    this.notifySaveMenu++;
                }
            },
            // 搜索企业
            filterCompanyName(query, item) {
                return item.companyName.indexOf(query) > -1;
            },
            // 打开企业权限选择页面
            showCompanyPermission() {
                let _this = this;
                // 查询已审核的企业
                _this.companyOptions = [];
                _this.$Get(this.khConfig.api.queryAllCheckCompanyInfo, {pageSize: 100000000, pageNum: 1}).then(res => {
                    if (res.errCode === 0) {
                        // 初始化企业选择的数据源
                        if (res.datas) {
                            if (!_this.KHUtils.isNull(res.datas)) {
                                _this.companyOptions = res.datas;
                            }
                        }
                        // 初始化已选择的企业
                        _this.targetOptions = [];
                        if (_this.companyPermissions.length > 0) {
                            _this.companyPermissions.forEach(obj => {
                                _this.targetOptions.push(parseInt(obj.id));
                            })
                        }
                        _this.companyPermissionVisible = true;
                    }
                });
            },
            // 保存企业权限
            saveCompanyPermission() {
                let _this = this;
                _this.companyPermissions = [];
                if (_this.companyOptions.length > 0) {
                    _this.companyOptions.forEach(rs => {
                        let flag = false;
                        _this.targetOptions.forEach(id => {
                            if (id === rs.id) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            _this.companyPermissions.push(rs);
                        }
                    });
                }
                _this.companyPermissionVisible = false;
            },
            // 删除企业访问权限
            delCompanyPermission(key) {
                let _this = this;
                if (_this.KHUtils.isNull(key)) {
                    return false;
                }
                const index = _this.targetOptions.findIndex(obj => obj === key);
                _this.targetOptions.splice(index, 1);

                delArrayObj(key, 'id', _this.companyPermissions);

                function delArrayObj(compareKey, key, array) {
                    if (!(array instanceof Array)) {
                        return false;
                    }
                    const index = array.findIndex(obj => obj[key] === compareKey);
                    array.splice(index, 1);
                }
            },
            // 删除表单权限
            delFormPermission(key) {
                let _this = this;
                if (_this.KHUtils.isNull(key)) {
                    return false;
                }

                delArrayObj(key, 'id', _this.formPermissions);

                function delArrayObj(compareKey, key, array) {
                    if (!(array instanceof Array)) {
                        return false;
                    }
                    const index = array.findIndex(obj => obj[key] === compareKey);
                    array.splice(index, 1);
                }
            },
            // Dialog关闭回调
            handleClose() {
                let _this = this;
                _this.listNum++;  // 通知子组件刷新表单列表信息
                _this.nextLoading = false;
                _this.active = 0;
                _this.chooseJumpActive = 0;
            },
            // 关闭Dialog
            changeFormGroupVisible() {
                this.formGroupVisible = false;
                this.addFormGroupVisible = false;
            },
            // 打开权限选择页面
            showFormPermission() {
                let _this = this;
                _this.formPermissionVisible = true;
                _this.customCascadeHackReset = false;
                _this.$nextTick(() => {
                    _this.customCascadeHackReset = true;
                });
            },
            // 从图片上传组件中获取上传成功后的ID值
            getFileIdFromCusUpload(fileId) {
                if (!this.KHUtils.isNull(fileId)) {
                    // 存储文件ID便于后续对文件访问的权限控制
                    this.formConf.formImg = fileId;
                }
            },
            // 从表单权限子组件中获取选中的节点
            getCheckedNodesFromOrgUserTree(checkedNodes) {
                let _this = this;
                _this.formPermissions = [];
                _this.formPermissions = checkedNodes;
                _this.formPermissionVisible = false;
            },
            // 查询表单分组
            listFormGroup(groupName) {
                if (!this.KHUtils.isNull(groupName)) {
                    this.formConf.formGroup = groupName;
                }
                this.$Get(this.khConfig.api.listFormGroup).then(res => {
                    if (res.groups != null) {
                        this.formGroupOptions = res.groups;
                    } else {
                        this.formGroupOptions = [];
                    }
                });
            },
            // 查询表单权限
            listFormPermission(formId) {
                this.formPermissions = [];
                this.formConf.permissions = [];
                this.companyPermissions = [];
                this.$Get(this.khConfig.api.listFormPermission, {"formId": formId}).then(res => {
                    if (res.datas != null && res.datas.length > 0) {
                        res.datas.forEach(obj => {
                            if (obj.type === 0 || obj.type === 1) {
                                // 0组织架构；1用户
                                this.formPermissions.push({id: obj.subId, name: obj.subName, type: obj.type})
                            } else if (obj.type === 9) {
                                //9企业用户
                                this.companyPermissions.push({id: obj.subId, companyName: obj.subName, type: obj.type})
                            }
                            this.formConf.permissions.push(obj);
                        })
                    }
                });
            },
            // 新增
            handleAdd() {
                // 回退到第一步
                this.addOrEdit = true;
                this.active = 0;
                this.showImage = false;
                this.imgSrc = "";
                this.formPermissions = [];
                this.companyPermissions = [];
                this.editFormVisible = true;
                this.formConfig = "";
                this.formConf = {
                    formId: '',
                    formName: '',
                    formGroup: '',
                    formComment: '',
                    permissions: []
                }
            },
            // 编辑
            handleEdit(row) {
                this.addOrEdit = false;
                this.active = 0;
                this.editFormVisible = true;
                this.formConf = {
                    formId: row.formId,
                    formName: row.formName,
                    formGroup: row.formGroup,
                    formComment: row.formComment
                };
                this.formConfig = JSON.parse(row.formMeta);
                this.formId = row.formId;
                if (!this.KHUtils.isNull(this.formId)) {
                    // 查询表单权限信息
                    this.listFormPermission(this.formId);
                }
                if (!this.KHUtils.isNull(row.formImg)) {
                    // 查询图标
                    this.imgSrc = row.formImg;
                    this.showImage = true;
                }
            },
            // 子组件设置成功后,子组件回调,是否关闭父组件的某些状态
            notifyParentClose(btnClose, dialogClose, cancel, checkFormDesignNoPass) {
                if (checkFormDesignNoPass) {
                    this.$notify.error({
                        title: '错误',
                        message: '请先完成确保设计的表单中含有字段并发布成功,否则无法进行下一步操作'
                    });
                    this.nextLoading = false; // 下一步按钮状态关闭
                    return false;
                }
                if (this.chooseJump) {
                    if (this.active !== this.chooseJumpActive) {
                        this.active = this.chooseJumpActive;
                        return false;
                    }
                }
                if (btnClose) {
                    this.nextLoading = false; // 下一步按钮状态关闭
                }
                if (dialogClose) {
                    this.editFormVisible = false; // 步骤全部设置完成,关闭弹窗
                }
                if (!cancel) {
                    this.active++;  // 下一步保存点击确认,进入到下一个步骤
                    if (this.active === 2) {
                        this.setNewestFormConfig("advancedSetting"); // 表单设计完,进入高级设计,以确保最新的表单配置
                    }
                }
            },
            // 下一步,保存
            next() {
                this.chooseJump = false;
                if (this.active === 0) {
                    this.saveFormConf(true);
                } else if (this.active === 1) {
                    // 通知表单设计组件保存
                    this.nextLoading = true;
                    this.notifySaveFormDesign++;
                } else if (this.active === 2) {
                    // 通知高级设置组件保存(改造后的表单该处注释)
                    this.nextLoading = true;
                    this.notifySave++;
                } else if (this.active === 3) {
                    // 通知高级设置组件保存
                    this.nextLoading = true;
                    this.notifySaveMenu++;
                }
            },
            // 返回上一步
            back() {
                if (this.active === 0) {
                    this.$notify.error({
                        title: '错误',
                        message: '已经是第一步了,无法再返回上一步'
                    });
                } else {
                    if (this.active === 3) {
                        this.setNewestFormConfig("advancedSetting"); // 高级设置点击下一步后,再返回上一步进行修改
                    } else if (this.active === 2) {
                        this.setNewestFormConfig(); // 表单设计点击下一步后,再返回上一步进行修改
                    }
                    this.active--;
                }
            },
            // 保存基础设置 nextOrChooseJump: true:next()触发;false:handleChooseJumpStep()触发
            saveFormConf(nextOrChooseJump) {
                let _this = this;
                this.$refs.formConf.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存基础设置吗？', '提示', {}).then(() => {
                            _this.nextLoading = true;
                            // 表单权限
                            let tempPermission = [];
                            if (_this.formPermissions.length > 0) {
                                if (_this.formPermissions.length > 0) {
                                    _this.formPermissions.forEach((perObj) => {
                                        let newObj = {
                                            type: perObj.type,           // 区分是部门还是人员,0部门权限 1用户权限
                                            subId: perObj.id,
                                            subName: perObj.name
                                        };
                                        tempPermission.push(newObj);
                                    });
                                } else {
                                    if (_this.formConf.permissions instanceof Array) {
                                        _this.formConf.permissions.forEach(obj => {
                                            if (obj.type !== 9) {
                                                tempPermission.push(obj);
                                            }
                                        })
                                    }
                                }
                            }
                            // 企业权限
                            let tempCompanyPermission = [];
                            if (_this.companyPermissions.length > 0) {
                                if (_this.companyPermissions.length > 0) {
                                    _this.companyPermissions.forEach(obj => {
                                        let newObj = {
                                            type: 9, // 企业用户
                                            subId: obj.id,
                                            subName: obj.companyName
                                        };
                                        tempCompanyPermission.push(newObj);
                                    })
                                } else {
                                    if (_this.formConf.permissions instanceof Array) {
                                        _this.formConf.permissions.forEach(obj => {
                                            if (obj.type === 9) {
                                                tempCompanyPermission.push(obj);
                                            }
                                        })
                                    }
                                }
                            }
                            _this.formConf.permissions = [];
                            _this.formConf.permissions = _this.formConf.permissions.concat(tempPermission);
                            _this.formConf.permissions = _this.formConf.permissions.concat(tempCompanyPermission);
                            _this.formConf.formType = "0";            // 普通表单
                            _this.$PostJson(_this.khConfig.api.saveFormConf, _this.formConf).then(res => {
                                _this.nextLoading = false;
                                if (res.errCode === 0) {
                                    this.$notify({
                                        title: '成功',
                                        message: '基础设置完成',
                                        type: 'success'
                                    });
                                    if (nextOrChooseJump) {
                                        _this.active = 1;
                                    } else {
                                        _this.active = _this.chooseJumpActive;
                                    }
                                    _this.listNum++;  // 刷新普通表单列表信息
                                    _this.formId = res.formId;
                                    _this.formConf.formId = _this.formId; // 便于新增成功后,用户再返回上一步对基础设置进行修改
                                }
                            })
                        }).catch((e) => {
                            if (!nextOrChooseJump) {
                                _this.active = _this.chooseJumpActive;
                            }
                            console.log(e)
                        });
                    }
                });
            },
            // 设置最新的表单设计配置并更新相应的子组件
            setNewestFormConfig(sign) {
                this.$Get(this.khConfig.api.getFormConf + "/" + this.formId).then(res => {
                    if (res.errCode === 0) {
                        if (!this.KHUtils.isNull(res.formConf)) {
                            this.formConfig = JSON.parse(res.formConf.formMeta);
                        }
                        if ("advancedSetting" === sign) {
                            this.advancedSettingHackReset = false;
                            // 重新渲染高级设置的子组件
                            this.$nextTick(() => {
                                this.advancedSettingHackReset = true
                            });
                        } else {
                            this.formDesignHackReset = false;
                            // 重新渲染表单设计的子组件
                            this.$nextTick(() => {
                                this.formDesignHackReset = true
                            });
                        }
                    }
                });
            }
        }
    }
</script>
<style lang="scss" scoped>
    @import "@/assets/style/form/form-design.scss";
</style>
