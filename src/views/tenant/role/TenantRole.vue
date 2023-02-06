<template>
    <div class="page-container">
            <el-row style="padding-bottom: 10px">
                <el-select v-model="tenantValue" placeholder="请选择租户" collapse-tags filterable
                        style="width: 200px"
                        class="report-set-style imageMarginTop" :popper-append-to-body="false"
                        @change="tenantSelect" v-el-select-load-more="loadTenantMore" value="">
                    <el-option
                        v-for="item in tenantData"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
            </el-row>
            <el-row class="box-container">
                <el-col :span="12" class="left-box">
                    <h3 class="left-header">
                        <p style="color:#919191">角色管理</p>
                        <!-- <i @click="handleAdd" class="el-icon-plus" style="cursor: pointer;font-size:20px;"></i> -->
                    </h3>
                        <el-tree
                            :data="roleData"
                            :props="roleProps"
                            node-key="id"
                            accordion
                            highlight-current
                            default-expand-all
                            @node-click="switchRole"
                            v-loading.body="roleLoading"
                            :expand-on-click-node="false"
                            class="tree-class">
                        </el-tree>
                </el-col>
                <el-col :span="12" class="right-box">
                        <h3 class="right-header">
                            <div style="display:flex;">
                                <div class="flex-class">{{currentRole.roleName}}</div>
                                <el-input 
                                        size="small"
                                        clearable
                                        v-model="filterText"
                                        autocomplete="off"
                                        placeholder="请输入权限菜单名称"
                                        style="margin-left:35px;" />
                            </div>
                            <div class="flex-class">
                            <!-- <i @click="handleEdit" class="el-icon-edit" style="cursor: pointer;margin-right:10px;"></i>
                            <i @click="handleDelete" class="el-icon-close" style="cursor: pointer"></i> -->
                            </div>
                        </h3>
                            <el-tree
                                :data="menuData"
                                show-checkbox
                                node-key="id"
                                ref="tree"
                                :default-checked-keys="checkedRoleIdArray"
                                :props="menuProps"
                                default-expand-all
                                highlight-current
                                accordion
                                :expand-on-click-node="false"
                                check-strictly
                                v-loading.body="menuLoading"
                                :filter-node-method="filterNode"
                                class="tree-class"
                            >
                            </el-tree>
                </el-col>
            </el-row>
            <el-row style="text-align: center;margin-top:20px">
                <el-button @click="saveMenuRelRole" type="primary" :loading="saveLoading">保存</el-button>
                <el-button>取消</el-button>
            </el-row>
            <el-dialog :title="formTitle" :visible.sync="editFormVisible" :close-on-click-modal="closeOnClickModal"
                       class="custom-role-dia">
                <el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
                    <el-row>
                        <el-col :span="2">
                            &nbsp;
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="角色名称" prop="roleName">
                                <!--  onkeypress="if(event.keyCode == 13) return false;" 解决按回车刷新的问题-->
                                <el-input v-model="editForm.roleName"
                                          onkeypress="if(event.keyCode === 13) return false;"
                                          style="width: 50%"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="2">
                            &nbsp;
                        </el-col>
                        <el-col :span="16">
                            <el-form-item label="关联组织">
                                <el-select v-model="relOrg" multiple filterable placeholder="可搜索" value="">
                                    <el-option
                                        v-for="item in options"
                                        :key="item.id"
                                        :label="item.orgName"
                                        :value="item.id">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                </div>
            </el-dialog>
    </div>
</template>

<script type="es6">
    export default {
        directives: {
            'el-select-load-more': {
                bind(el, binding) {
                    const SELECTWRAP_DOM = el.querySelector(
                        '.el-select-dropdown .el-select-dropdown__wrap'
                    );
                    SELECTWRAP_DOM.addEventListener('scroll', function () {
                        const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
                        if (condition) {
                            binding.value();
                        }
                    });
                }
            }
        },
        data() {
            // 校验角色名称是否重复
            let checkExists = (rule, value, callback) => {
                let _this = this;
                // 解决输入数字
                value = value + "";
                value = value.replace(/\s*/g, "");
                if (!_this.isAddOrEdit && _this.editBeforeRoleName === value) {
                    callback();
                }
                let data = {
                    roleName: value
                };
                _this.$Get(_this.khConfig.api.checkByRoleName, data).then(res => {
                    if (res.errCode === 0 && res.count != null && res.count > 0) {
                        callback(new Error('角色名已存在'));
                    } else if (res.errCode === 0 && res.count != null && res.count === 0) {
                        _this.editForm.roleName = value;
                        callback();
                    } else {
                        callback(new Error('服务端错误'));
                    }
                }).catch(error => {
                    console.log("checkExists roleName :" + error);
                    callback(new Error('服务端错误'));
                });
            };
            return {
                tenantValue: null,
                tenantData: [],
                queryTenantParam: {
                    pageNum: 1,
                    pageSize: 100
                },
                roleLoading: false,
                menuLoading: false,
                options: [],
                relOrg: [],
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                delOperate: false,
                // 修改前的名称
                editBeforeRoleName: '',
                saveLoading: false,
                editForm: {
                    roleName: '',
                    name: ''
                },
                editFormRules: {
                    roleName: [
                        {required: true, message: '请输入名称', trigger: 'blur'},
                        {validator: checkExists, trigger: 'blur'}
                    ]
                },
                isAddOrEdit: false,
                editLoading: false,
                editFormVisible: false,
                formTitle: '',
                currentRole: {
                    roleName: '',
                    id: ''
                },
                roleData: [],
                menuData: [],
                roleProps: {
                    label: 'roleName',
                    children: 'children'
                },
                menuProps: {
                    label: 'menuName',
                    children: 'children'
                },
                checkedRoleIdArray: [],
                filterText: '',
                // parentIdArray:[],
                childrenNodeArray:[],
            }
        },
        mounted() {
            // this.listRole();
            // this.listOrg();
            this.loadTenantFirst();
        },
        methods: {
        	//支持过滤出包含关键字的当前节点和它的所有子孙节点
            filterNode(value, data) {
                if (!value) return true;
                if(data.menuName.indexOf(value) !== -1){
                    // this.parentIdArray.push(data.parentId)
                    this.childrenNodeArray.push(data.id)
                }
                if(this.childrenNodeArray.indexOf(data.parentId) !== -1){
                    this.childrenNodeArray.push(data.id)
                }
                // return data.menuName.indexOf(value) !== -1 || this.parentIdArray.indexOf(data.parentId) !== -1 || this.childrenNodeArray.indexOf(data.parentId) !== -1;
                return data.menuName.indexOf(value) !== -1 || this.childrenNodeArray.indexOf(data.parentId) !== -1;
            },
            loadTenantFirst() {
                let _this = this;
                _this.queryTenantParam.pageNum = 1;
                _this.tenantData = [];
                _this.queryTenant("init");
            },
            loadTenantMore() {
                let _this = this;
                _this.queryTenantParam.pageNum++;
                _this.queryTenant();
            },
            queryTenant(sign) {
                this.$Get(this.khConfig.api.listTenant, this.queryTenantParam).then(res => {
                    if (res.errCode === 0) {
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            if (sign === "init") {
                                this.tenantValue = res.datas[0].id; // 首次加载时
                            }
                           // this.listOrg();
                            this.listRole();
                            res.datas.forEach(item => {
                                let obj = {
                                    label: item.tenantName,
                                    value: item.id
                                };
                                this.tenantData.push(obj);
                            })
                        }
                    }
                });
            },
            tenantSelect(value) {
                this.tenantValue = value;
                if (!this.KHUtils.isNull(value)) {
                   // this.listOrg();
                    this.listRole();
                }
            },
            listOrg() {
                this.options = [];
                this.$Get(this.khConfig.api.listOrg, {tenantId: this.tenantValue}).then(res => {
                    if (res.errCode === 0) {
                        if (res.list != null && res.list.length > 0) {
                            this.options = res.list;
                        } else {
                            this.options = [];
                        }
                    } else {
                        this.$notify.error({
                            title: '错误',
                            message: res.errMsg
                        });
                    }
                }).catch(error => {
                    console.log("listOrg :" + error);
                });
            },
            // 查询所有角色
            listRole() {
                let _this = this;
                _this.roleLoading = true;
                _this.roleData = [];
                _this.currentRole = {};
                _this.menuData = [];
                _this.checkedRoleIdArray = [];
                _this.$Get(_this.khConfig.api.listRole, {tenantId: _this.tenantValue})
                    .then(res => {
                        if (res.errCode === 0) {
                            if (res.list != null && res.list.length > 0) {
                                _this.roleData = res.list;
                                if (_this.KHUtils.isNull(_this.currentRole.id)) {
                                    _this.currentRole = _this.roleData[0];
                                }
                            }
                            _this.listMenuByRoleId();
                        }
                        _this.roleLoading = false;
                    })
            },
            // 根据角色ID查询功能权限
            listMenuByRoleId() {
                let _this = this;
                let param = {
                    roleId: _this.currentRole.id,
                    hidden: '0',      // 查询未隐藏的
                    menuTypes: '0,2',  // 菜单类型(0或者null或者空:默认的系统菜单;1:表单相关的菜单;2:可通过路由直接访问的菜单,比如新增页面全屏设置,需要通过cas登录;3:可通过路由直接访问的菜单,并且不需要经过cas登录即可调用后台接口,比如注册页面)
                    tenantId: _this.tenantValue
                };
                this.menuLoading = true;
                _this.$Get(_this.khConfig.api.listMenu, param)
                    .then(res => {
                        _this.menuData = res.children;
                        if (res.roleMenus != null) {
                            _this.checkedRoleIdArray = [];
                            for (let item of res.roleMenus) {
                                _this.checkedRoleIdArray.push(item.menuId);
                            }
                        }
                        this.menuLoading = false;
                    })
            },
            // 切换不同角色组查询功能权限
            switchRole(data, node, self) {
                let _this = this;
                _this.currentRole = data;
                _this.currentRoleId = '';
                _this.currentRoleId = data.id;
                _this.listMenuByRoleId();
            },
            // 保存角色与菜单的关联关系
            saveMenuRelRole() {
                let _this = this;
                let checkedId = "";
                for (let item of _this.$refs.tree.getCheckedKeys()) {
                    checkedId += item.toString() + ",";
                }
                _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                    _this.saveLoading = true;
                    let param = {
                        roleId: _this.currentRole.id
                    };
                    if (checkedId != null && checkedId !== '') {
                        param.menuIds = checkedId;
                    }
                    _this.$Get(_this.khConfig.api.addRolesRelMenu, param).then(res => {
                        if (res.errCode === 0) {
                            _this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                            _this.listRole();
                        }
                        _this.saveLoading = false;
                    })
                }).catch((e) => {
                    console.log(e)
                })
            },
            // 显示新增的页面
            handleAdd() {
                let _this = this;
                _this.relOrg = [];
                _this.isAddOrEdit = true;
                _this.editFormVisible = true;
                _this.formTitle = '添加角色';
                _this.editForm = {
                    roleName: ''
                };
            },
            // 显示编辑页面
            handleEdit() {
                let _this = this;
                _this.isAddOrEdit = false;
                _this.editFormVisible = true;
                _this.formTitle = '编辑';
                _this.editForm = {
                    roleName: ''
                };
                _this.editBeforeRoleName = _this.currentRole.roleName;
                _this.editForm.roleName = _this.currentRole.roleName;
                _this.relOrg = [];
                if (!_this.KHUtils.isNull(_this.currentRole.id)) {
                    _this.$Get(_this.khConfig.api.listRolesRelOrgByRoleId, {roleId: _this.currentRole.id})
                        .then(res => {
                            if (!this.KHUtils.isNull(res.list)) {
                                res.list.forEach(obj => {
                                    _this.relOrg.push(obj.orgId);
                                })
                            }
                        })
                }
            },
            // 删除前判断是否能进行删除
            handleDelete() {
                let _this = this;
                let param = {
                    roleId: _this.currentRole.id
                };
                _this.$Get(_this.khConfig.api.listRolesRelUserByRoleId, param)
                    .then(res => {
                        if (res.list != null && res.list.length > 0) {
                            _this.delOperate = true;
                        }
                        _this.batchDelete();
                    })
            },
            // 批量删除
            batchDelete() {
                let _this = this;
                if (_this.delOperate) {
                    _this.$notify({
                        title: '警告',
                        message: '所选择要删除的' + _this.currentRole.roleName + '与用户有关联关系,若必须要删除,请先删除其关联的用户再进行操作',
                        type: 'warning'
                    });
                } else {
                    _this.$confirm('确认删除' + _this.currentRole.roleName + '吗?', '提示', {}).then(() => {
                        let param = {
                            ids: _this.currentRole.id
                        };
                        _this.$Get(_this.khConfig.api.deleteRole, param)
                            .then(res => {
                                if (res.errCode === 0) {
                                    _this.$notify({
                                        title: '成功',
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    _this.currentRole.id = ""
                                    _this.listRole();
                                }
                            })
                    }).catch(error => {
                        console.log("deleteRole : " + error);
                    });
                }
            },
            // 提交
            editSubmit() {
                let _this = this;
                _this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let url;
                            if (_this.isAddOrEdit) {
                                url = _this.khConfig.api.addRole;
                            } else {
                                url = _this.khConfig.api.updateRole;
                            }
                            _this.$Post(url, _this.convertRoleForm2Array(_this.editForm))
                                .then(res => {
                                    _this.editLoading = true;
                                    if (res.errCode === 0) {
                                        _this.listRole();
                                        _this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    _this.editLoading = false;
                                    _this.editFormVisible = false;
                                })
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            // form提交参数处理
            convertRoleForm2Array(_form) {
                let _this = this;
                let paramArray = [];
                if (!_this.KHUtils.isInvalidValue(_form.roleName)) {
                    paramArray.push("roleName=" + _form.roleName);
                }
                if (!_this.isAddOrEdit) {
                    paramArray.push("id=" + _this.currentRole.id);
                }
                if (_this.relOrg.length > 0) {
                    let orgIds = "";
                    for (let i = 0; i < _this.relOrg.length; i++) {
                        orgIds += _this.relOrg[i] + ","
                    }
                    paramArray.push("orgIds=" + orgIds);
                }
                paramArray = paramArray.join("&");
                return paramArray;
            }
        },
        watch: {
            filterText(val) {
                // this.parentIdArray = [];
                this.childrenNodeArray = [];
                this.$refs.tree.filter(val);
            }
        },
    }
</script>
<style lang="scss" scoped>
    h3 {
        margin: 0;
    }

    h3 p {
        display: inline-block;
        margin: 0;
        padding: 0;
    }

    .custom-role-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }

    .flex-class{
        display: flex;
        justify-content: center;
        align-items: center;
        white-space: nowrap;
    }
    .tree-class{
        overflow:auto;
        height: 609px;

        /*滚动条里面小方块*/
        &::-webkit-scrollbar-thumb {
            // background-color: #EBEAEF;
            border-radius: 5px;
        }
        /*滚动条整体样式*/
        &::-webkit-scrollbar {
            // width: 6px;
            // height: 6px;
        }
        /*滚动条里面轨道*/
        &::-webkit-scrollbar-track {
            // background: #FFFFFF;
            border-radius: 5px;
        }
    }

    .page-container{
        width: 100%;
        margin: 0 auto;
        padding: 15px 25px;

        .box-container{
            margin-right: 0;
            border: 2px solid #ebf1f7;
            border-radius: 8px 8px 0 0;

            .left-box{

                .left-header{
                    background:#eaf1f7;
                    padding:13px 23px;
                    font-size:16px;
                    font-weight:800;
                    display:flex;
                    justify-content:space-between;
                }

            }
            .right-box{
                padding: 0px;
                height: 100%;
                border-left:4px solid #f5f8ff;
                
                .right-header{
                    background:#eaf1f7;
                    padding:7px 23px;
                    font-size:16px;
                    font-weight:800;
                    display:flex;
                    justify-content:space-between;
                }
            }
        }
    }
</style>
