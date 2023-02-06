<template>
    <el-row class="process-manage">
        <!--任务管理-->
        <task-management :list="taskNum" :row="row"></task-management>
        <div class="header">
            <span class="header-title">流程申请</span>
            <el-form class="query-form" inline size="small">
                <el-form-item label="表单分组:">
                    <el-select v-model="nameOrGroup.formGroup" placeholder="选择分组" value="" clearable  @clear="handleQuery"  @change="handleQuery">
                        <el-option v-for="item in formGroupOptions" :key="item.groupName" :label="item.groupName" :value="item.groupName"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="表单名称:">
                    <el-input v-model="nameOrGroup.formName" placeholder="请输入流程表单名称" style="width:200px;" clearable  @clear="handleQuery"></el-input>
                </el-form-item>
                <el-form-item label="状态:">
                    <el-select v-model="nameOrGroup.formStatus" clearable @clear="handleQuery" @change="handleQuery" placeholder="请选择" class="formStatus-class">
                        <el-option
                            v-for="item in formStatusOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item >
                    <el-button type="success" icon="el-icon-search" @click="handleQuery">查询</el-button>
                    <el-button v-if="showManageProcess" type="info" icon="el-icon-s-tools" @click="formGroupVisible = true">分组管理</el-button>
                    <el-button v-if="showManageProcess" type="primary" icon="el-icon-plus" @click="handleAdd">创建新审批</el-button>
                </el-form-item>
            </el-form>
        </div>
        <!--表单分组-->
        <el-row>
            <form-conf-table-tabs :form-type="formType" @handleOperate="handleOperate" :list="listNum"
                             :showManageProcess="showManageProcess" :nameOrGroup="nameOrGroup"></form-conf-table-tabs>
        </el-row>
        <!--流程表单-->
        <el-dialog :title="formConf.formName === '' ? '基础设置' : formConf.formName"
                   :visible.sync="editFormVisible"
                   custom-class="custom-dialog" :close-on-click-modal="false" @close="handleClose" fullscreen>
            <el-row v-if="!addOrEdit">
                <el-steps :active="active" simple finish-status="success" process-status="process"
                          class="form-design-step">
                    <el-step title="基础设置" icon="el-icon-setting" @click.native.stop="handleChooseJumpStep(0)"></el-step>
                    <el-step title="表单设置" icon="el-icon-s-order" @click.native.stop="handleChooseJumpStep(1)"></el-step>
                    <el-step title="高级设置" icon="el-icon-s-tools" @click.native.stop="handleChooseJumpStep(2)"></el-step>
                    <el-step title="流程设置" icon="el-icon-set-up" @click.native.stop="handleChooseJumpStep(3)"></el-step>
                    <el-step title="菜单配置" icon="el-icon-menu" @click.native.stop="handleChooseJumpStep(4)"></el-step>
                </el-steps>
            </el-row>
            <el-row v-if="addOrEdit">
                <el-steps :active="active" simple finish-status="success" process-status="process">
                    <el-step title="基础设置" icon="el-icon-setting"></el-step>
                    <el-step title="表单设置" icon="el-icon-s-order"></el-step>
                    <el-step title="高级设置" icon="el-icon-s-tools"></el-step>
                    <el-step title="流程设置" icon="el-icon-set-up"></el-step>
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
                <!--表单设置-->
                <el-row v-if="active === 1" style="height: 100%">
                    <form-design-tool :form-config="formConfig" :form-id="formId" v-if="formDesignHackReset" :type="1"
                                      :notify-save="notifySaveFormDesign"
                                      @notifyParentClose="notifyParentClose"></form-design-tool>
                </el-row>
                <!--高级设置-->
                <el-row v-if="active === 2" style="height: 100%">
                    <advanced-setting-restructure v-if="advancedSettingType== '0' && advancedSettingHackReset"
                                                  :form-config="formConfig"
                                                  :form-id="formId"
                                                  :notify-save="notifySave"
                                                  :form-name="formConf.formName"
                                                  @notifyParentClose="notifyParentClose"
                                                  :advancedSettingType="advancedSettingType"
                                                  :formType="1"
                                                  @previewChange="previewChange"
                    ></advanced-setting-restructure>
                    <app-advanced-setting v-if="advancedSettingType== '1' && advancedSettingHackReset"
                                          :form-config="formConfig"
                                          :form-id="formId"
                                          :notify-save="notifySave"
                                          :form-name="formConf.formName"
                                          @notifyParentClose="notifyParentClose"
                                          :advancedSettingType="advancedSettingType"
                                          :formType="1"
                                          @previewChange="previewChange"
                    ></app-advanced-setting>
                </el-row>
                <!--流程设置-->
                <el-row v-if="active === 3" style="height: 100%">
                    <iframe :src="flowSrc" style="width: 100%;height: 100%;overflow: auto">
                    </iframe>
                </el-row>
                <!--菜单配置-->
                <el-row v-if="active === 4" style="height: 100%">
                    <menu-setting :form-type="formType" :form-id="formId" :form-name="formConf.formName"
                                  :notify-save="notifySaveMenu" @notifyParentClose="notifyParentClose"></menu-setting>
                </el-row>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="back" v-if="active > 0" style="background: #0b1532;border-color: #2153d4">
                    返回上一步
                </el-button>
                <el-button type="primary" @click="next" :loading="nextLoading" style="background: #0b1532;border-color: #2153d4">
                    下一步
                </el-button>
            </div>
        </el-dialog>
        <!--表单分组管理-->
        <form-group-dialog :visible="formGroupVisible"
                           :data="formGroupOptions"
                           v-if="formGroupVisible"
                           @listFormGroup="listFormGroup"
                           @changeFormGroupVisible="changeFormGroupVisible"
        ></form-group-dialog>
        <!--新增表单分组-->
        <add-form-group-dialog :visible="addFormGroupVisible"
                               v-if="addFormGroupVisible"
                               @listFormGroup="listFormGroup"
                               @changeFormGroupVisible="changeFormGroupVisible"
        ></add-form-group-dialog>
        <!--表单权限-->
        <el-dialog title="表单权限" :visible.sync="formPermissionVisible" :close-on-click-modal="closeOnClickModal">
            <!--            <custom-cascade
                                        @getCheckedNodesFromOrgUserTree="getCheckedNodesFromOrgUserTree"
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
    import AdvancedSettingRestructure from "@/components/form-design/restructure/AdvancedSetting";
    import AppAdvancedSetting from "@/components/app-preview/AppAdvancedSetting";
    import OreTransfer from "@/components/OreTransfer"
    import AdvancedSetting from "@/components/form-design/AdvancedSetting";
    import CustomUpload from "@/components/CustomUpload";
    import CustomCascade from "@/components/CustomCascade";
    import OrgUserTree from "@/components/tree/OrgUserTree";
    import FormDesignTool from "@/components/form-design/FormDesignTool";
    import FormGroupDialog from "@/components/form-design/FormGroup";
    import AddFormGroupDialog from "@/components/form-design/FormGroupAdd";
    import FormConfTableTabs from "@/components/form-design/FormConfTableTabs";
    import TaskManagement from "@/components/form-design/TaskManagement";
    import MenuSetting from "@/components/form-design/MenuSetting";
    import {mapGetters} from "vuex";

    export default {
        name: "FormProcessDesignTool",
        // showManageProcess:判断是否是流程设计管理页面,true: 显示一些必要的管理按钮
        // props: ['showManageProcess'],
        props: {
            showManageProcess: {
                type: Boolean,
                required: false
            }
        },
        computed: mapGetters({
            user: 'getUserInfo'
        }),
        components: {
            AdvancedSetting,
            FormDesignTool,
            CustomCascade,
            OrgUserTree,
            CustomUpload,
            FormGroupDialog,
            AddFormGroupDialog,
            FormConfTableTabs,
            TaskManagement,
            MenuSetting,
            OreTransfer,
            AdvancedSettingRestructure,
            AppAdvancedSetting
        },
        data() {
            return {
                addOrEdit: true, // true:创建新表单;false:编辑
                chooseJump: false, // 编辑状态下,触发步骤条随意切换步骤
                chooseJumpActive: 0,
                // 企业访问权限
                customDivClass: "customDivClass",
                customDivClass1: "customDivClass1",
                companyPermissionVisible: false,
                companyPermissions: [],
                companyOptions: [],
                targetOptions: [],
                // 表单权限
                formPermissions: [],
                formPermissionVisible: false,
                customCascadeHackReset: false,
                // 菜单配置
                notifySaveMenu: 0, // 保存菜单配置
                notifySave: 0, // 保存高级设置
                formDesignHackReset: true,
                advancedSettingHackReset: true,
                row: {},
                formType: "1",
                // 父组件通知子组件更新列表数据
                listNum: 0,
                taskNum: 0,
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                // 文件上传的类型
                listType: "picture",
                // 表单配置信息
                formConfig: "",
                // 表单分组管理
                formGroupVisible: false,
                // 新增表单分组
                addFormGroupVisible: false,
                // 表单ID
                formId: "",
                formConfRules: {
                    formName: [
                        {required: true, message: '请输入表单名称', trigger: 'blur'},
                    ],
                    formGroup: [
                        {required: true, message: '请选择分组', trigger: 'blur'}
                    ]
                },
                active: 0,
                // 图标
                imgSrc: "",
                showImage: false,
                fileList: [],
                fileLimit: 1,
                // 所属菜单选择项
                formGroupOptions: [],
                formConf: {
                    formId: '',
                    formName: '',
                    formGroup: '',
                    formComment: '',
                    permissions: []
                },
                nextLoading: false,
                editFormVisible: false,
                // 流程设计访问路径
                flowSrc: "",
                notifySaveFormDesign: 0,
                advancedSettingType:"0",

                formStatusOptions:[
                    {value:0,label:'启用'},
                    {value:1,label:'停用'}
                ],
                nameOrGroup:{
                  formName:'',
                  formGroup:'',
                  formType:'',
                },
            };
        },
        mounted() {
            this.listFormGroup();
        },
        methods: {
            //pc 和app设置切换
            previewChange(type){
                this.advancedSettingType = type;
            },
            handleChooseJumpStep(active) {
                let _this = this;
                _this.chooseJump = true;
                if(_this.chooseJumpActive === active){
                    return false;
                }
                _this.chooseJumpActive = active;
                if (active === 3) {
                    // 表单设计完成后，创建流程模型,首先查询是否有存在的流程模型
                    this.$Get(this.khConfig.api.getFlowConfByFormId + "/" + this.formConf.formId).then(res => {
                        if (res.flowConf != null) {
                            this.openProcessDesign(res.flowConf.modelId)
                        } else {
                            this.createProcessModel();
                        }
                    });
                }
                if (this.active === 0) {
                    _this.saveFormConf(false);
                } else if (this.active === 1) {
                    // 通知表单设计组件保存
                    this.notifySaveFormDesign++;
                } else if (this.active === 2) {
                    // 通知高级设置组件保存(改造后的表单该处注释)
                    this.notifySave++;
                } else if (this.active === 3) {
                    this.active = active;
                } else if (this.active === 4) {
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
                _this.listNum++;  // 刷新列表信息
                _this.nextLoading = false;
                _this.active = 0;
                _this.chooseJumpActive = 0;
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
            // 引入FormConfTable组件
            handleOperate(row) {
                this.row = {};
                if (this.showManageProcess) {
                    // 可编辑
                    this.handleEdit(row);
                } else {
                    this.row = row;
                    this.taskNum++;
                }
            },
            // 子组件关闭后触发通知父组件对属性改变
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
                                this.formPermissions.push({id: obj.subId, name: obj.subName})
                            } else if (obj.type === 9) {
                                //9企业用户
                                this.companyPermissions.push({id: obj.subId, companyName: obj.subName})
                            }
                            this.formConf.permissions.push(obj);
                        })
                    }
                });
            },
            //查询
            handleQuery(){
              let _this=this;
              _this.listNum++;
            },
            // 新增流程表单
            handleAdd() {
                this.addOrEdit = true;
                // 回退到第一步
                this.active = 0;
                this.showImage = false;
                this.imgSrc = "";
                this.companyPermissions = [];
                this.formPermissions = "";
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
            // 编辑流程表单
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
                    this.listFormPermission(this.formId);
                }
                if (!this.KHUtils.isNull(row.formImg)) {
                    // 查询图标
                    this.imgSrc = row.formImg;
                    this.showImage = true;
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
                    // 表单设计完成后，创建流程模型,首先查询是否有存在的流程模型
                    this.$Get(this.khConfig.api.getFlowConfByFormId + "/" + this.formConf.formId).then(res => {
                        if (res.flowConf != null) {
                            this.openProcessDesign(res.flowConf.modelId)
                        } else {
                            this.createProcessModel();
                        }
                    });
                    // 通知子组件刷新列表 (改造后的表单该处注释)
                    this.nextLoading = true;
                    this.notifySave++;
                } else if (this.active === 3) {
                    // 流转到最后一步
                    this.active++;
                } else if (this.active === 4) {
                    this.nextLoading = true;
                    this.notifySaveMenu++;
                }
            },
            // 打开流程画布
            openProcessDesign(modelId) {
                if (this.KHUtils.isNull(modelId)) {
                    this.$notify.error({
                        title: '错误',
                        message: '流程模型ID为空'
                    });
                    return;
                }
                this.flowSrc = this.khConfig.host.rest + this.khConfig.api.flowSrc + modelId;
            },
            // 创建流程模型
            createProcessModel() {
                let _this = this;
                let createModelParam = {
                    formId: _this.formConf.formId,
                    formName: _this.formConf.formName,
                    formComment: _this.formConf.formComment
                };
                _this.$Get(_this.khConfig.api.createModel, createModelParam).then(res => {
                    if (res.errCode === 0) {
                        _this.openProcessDesign(res.modelId);
                    }
                });
            },
            // 保存流程表单设计
            saveFormConf(nextOrChooseJump) {
                let _this = this;
                _this.formConf.permissions = [];
                this.$refs.formConf.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存基础设置吗？', '提示', {}).then(() => {
                            this.nextLoading = true;
                            // 表单权限
                            let tempPermission = [];
                            if (_this.formPermissions.length > 0) {
                                if (_this.formPermissions.length > 0) {
                                    _this.formPermissions.forEach((perObj) => {
                                        let newObj = {
                                            type: this.KHUtils.isNull(perObj.userId) ? 0 : 1,           // 区分是部门还是人员,0部门权限 1用户权限
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
                            this.formConf.formType = '1'; // 流程表单
                            this.$PostJson(this.khConfig.api.saveFormConf, this.formConf).then(res => {
                                this.nextLoading = false;
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
                                    this.formId = res.formId;
                                    _this.formConf.formId = _this.formId; // 便于新增成功后,用户再返回上一步对基础设置进行修改
                                    this.listNum++;  // 刷新流程列表
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
    .header {
        display: flex;
        flex-flow: row nowrap;
        padding-left: 10px;

        .header-title {
            font-weight: bolder;
            color: #3A3B3F;
            position: relative;
            margin-right: auto;
            margin-top: 5px;

            &::before {
                content: '';
                display: block;
                height: 17px;
                border-right: 3px solid #3581FB;
                position: absolute;
                left: -10px;
            }
        }

        ::v-deep .query-form {
            .el-form-item__label {
                font-size: 13px;
            }

            .el-date-editor {
                width: 150px;
            }

            // .el-input {
            //     width: 200px;
            // }

            .formStatus-class{
                .el-input{
                    .el-input__inner{
                        width:100px;
                    }
                }
            }
        }
    }
</style>
