<template>
    <section>
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
        <el-row>
            <!--左边树结构-->
            <el-col :span="4">
                <el-tabs v-model="activeName" type="border-card" @tab-click="changeTab">
                    <el-tab-pane label="组织机构" name="first">
                        <el-tree
                            v-if="orgTreeHackSet"
                            :props="orgProps"
                            :load="lazyLoadNode"
                            @node-click="handleNodeClick"
                            lazy
                            ref="tree">
                        </el-tree>
                    </el-tab-pane>
                    <el-tab-pane label="系统角色" name="second">
                        <el-tree
                            :data="roleList"
                            :props="roleProps"
                            node-key="id"
                            accordion
                            highlight-current
                            default-expand-all
                            @node-click="switchRole"
                            :expand-on-click-node="false">
                        </el-tree>
                    </el-tab-pane>
                </el-tabs>
            </el-col>
            <el-col :span="18" style="position: relative;bottom: -8px;left:2%">
                <div class="header-row" style="margin-bottom:15px;">
                    <span class="header-title">{{currentNodeCheckedMsg}}</span>
                    <el-input style="width: 120px;" placeholder="搜索" v-model="keyWord"
                              @blur="listUser(null,'search')" prefix-icon="el-icon-search"></el-input>
                </div>
          
                        <el-table :data="tableData"
                                  @selection-change="handleSelectionChange"
                                  highlight-current-row
                                  border
                                  stripe
                                  v-loading="listLoading"
                                  style="text-align: center"
                                  @row-click="handleEdit"
                        >
                            <el-table-column type="selection" width="55" prop="id" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="username" label="用户名" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="realName" label="真实名称" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="sex" label="性别" align="center" show-overflow-tooltip
                                             :formatter="this.KHUtils.formatSex">
                            </el-table-column>
                            <el-table-column prop="phone" label="手机号" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="email" label="邮箱" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="source" label="用户来源" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="orgName" label="所属组织" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column
                                align="center" 
                                show-overflow-tooltip
                                prop="status"
                                label="状态"
                                :filters="[{ text: '正常', value: '1' }, { text: '禁用', value: '0' }]"
                                :filter-method="filterTag"
                                filter-placement="bottom-end">
                                <template slot-scope="scope">
                                    <el-tag
                                        :type="scope.row.status === '0' || scope.row.status === 0 ? 'danger' : 'success'"
                                        disable-transitions>{{scope.row.status| formatStatus}}
                                    </el-tag>
                                </template>
                            </el-table-column>
  <!--                          <el-table-column
                                fixed="right"
                                label="操作"
                                width="300">
                                <template slot-scope="scope">
                                    <el-button @click.stop="startUser(scope.row)" type="text" size="small"
                                               :disabled="scope.row.status === '1'">启用
                                    </el-button>
                                    <el-button @click.stop="stopUser(scope.row)" type="text" size="small"
                                               :disabled="scope.row.status !== '1'">禁用
                                    </el-button>
                                    <el-button @click.stop="resetPwd(scope.row)" type="text" size="small">重置密码
                                    </el-button>
                                </template>
                            </el-table-column>-->
                        </el-table>
               
                
                <el-row v-show="countPage>5">
                    <el-col :span="23" style="margin-top: 8px;width: 86.5%">
                        <el-pagination :current-page="pageNum"
                                       :page-size="pageSize"
                                       layout="prev, pager, next"
                                       @current-change="handleCurrentPage"
                                       :total="countPage"
                                       style="float:right">
                        </el-pagination>
                    </el-col>
                </el-row>
                <el-dialog title="查看" :visible.sync="editFormVisible" :close-on-click-modal="closeOnClickModal"
                           class="custom-user-dia">
                    <p>【用户信息】</p>
                    <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                        <el-row>
                            <el-col :span="24">
                                <el-row>
                                    <el-col :span="isAddOrEdit ? 12 : 24">
                                        <el-form-item label="用户名" prop="username">
                                            <el-input v-model="editForm.username" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12" v-if="isAddOrEdit">
                                        <el-form-item label="密码" prop="password">
                                            <el-input v-model="editForm.password" type="password" onpaste="return false"
                                                      oncopy="return false" oncut="return false"
                                                      :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="真实名称" prop="realName">
                                            <el-input v-model="editForm.realName" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="所属组织">
                                            <el-input style="line-height: 30px;" v-model="editForm.orgName"
                                                      :disabled="true">
                                            </el-input>
                                            <el-tree
                                                :data="treeData"
                                                :props="props"
                                                :style="{position: 'absolute', zIndex: 2, display: display}"
                                                node-key="id"
                                                accordion
                                                highlight-current
                                                @current-change="selectDepartment"
                                                default-expand-all
                                                :expand-on-click-node="false">
                                            </el-tree>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="手机号码" prop="phone">
                                            <el-input v-model="editForm.phone" :maxlength="maxPhone" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="邮箱" prop="email">
                                            <el-input v-model="editForm.email" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="性别" prop="sex" width="50px">
                                            <el-select v-model="editForm.sex" value="" :disabled="true">
                                                <el-option label="男" value="0"></el-option>
                                                <el-option label="女" value="1"></el-option>
                                            </el-select>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="用户来源" prop="source">
                                            <el-input v-model="editForm.source" auto-complete="off" :disabled="true"></el-input>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                                <el-row>
                                    <el-col :span="12">
                                        <el-form-item label="状态">
                                            <el-radio-group v-model="editForm.status" :disabled="true">
                                                <el-radio :label="1">正常</el-radio>
                                                <el-radio :label="0">停用</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                    <el-col :span="12">
                                        <el-form-item label="租户用户类型">
                                            <el-radio-group v-model="tenantUserType" :disabled="true">
                                                <el-radio :label="0">主管理员</el-radio>
                                                <el-radio :label="1">子管理员</el-radio>
                                                <el-radio :label="2">普通用户</el-radio>
                                            </el-radio-group>
                                        </el-form-item>
                                    </el-col>
                                </el-row>
                            </el-col>
                        </el-row>
                        <p>【分配角色组】</p>
                        <el-row>
                            <el-col :span="2">&nbsp;</el-col>
                            <el-col :span="20">
                                <el-form-item label="角 色 组：" prop="roleArray" width="180">
                                    <el-checkbox-group v-model="roleArray" :disabled="true">
                                        <el-checkbox :label="item.id" :key="item.id" v-for="item in roleList">
                                            {{item.roleName}}
                                        </el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>
                            </el-col>
                            <el-col :span="2">&nbsp;</el-col>
                        </el-row>
                    </el-form>
   <!--                 <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存</el-button>
                    </div>-->
                </el-dialog>
            </el-col>
        </el-row>
    </section>
</template>

<script type="es6">
    import {JSEncrypt} from 'jsencrypt'
    import {mapFormatter} from "@/utils/khFormatter";
    
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
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        filters: {
            ...mapFormatter
        },
        data() {
            const KHUtils = this.KHUtils;
            // 校验用户名是否重复
            const checkUseNameExists = (rule, value, callback) => {
                let _this = this;
                // 解决输入数字
                value = value + "";
                value = value.replace(/\s*/g, "");
                if (!_this.isAddOrEdit && _this.editBeforeUserName === value) {
                    callback();
                }
                let data = {
                    username: value
                };
                _this.$Get(_this.khConfig.api.getUser, data).then(res => {
                    if (res.errCode === 0 && res.user != null) {
                        callback(new Error('用户名已存在'));
                    } else if (res.errCode === 0 && res.user == null) {
                        _this.editForm.username = value;
                        callback();
                    } else {
                        callback(new Error('服务端错误'));
                    }
                }).catch(error => {
                    console.log("checkExists OrgName :" + error);
                    callback(new Error('服务端错误'));
                });
            };
            const validatePwd = (rule, value, callback) => {
                if (!this.KHUtils.isNull(this.editBeforePassword)) {
                    callback();
                }
                let password = this.editForm.password;
                if (!KHUtils.isNull(password) && !KHUtils.isValidPwd(password)) {
                    callback(new Error('至少6位数密码包含数字、小写字母、大写字母和特殊符号'));
                } else {
                    callback();
                }
            };
            const validateMobile = (rule, value, callback) => {
                let phone = this.editForm.phone;
                if (!KHUtils.isNull(phone) && !KHUtils.isMobile(phone)) {
                    callback(new Error('请输入正确的手机格式'));
                } else {
                    callback();
                }
            };
            const validateMail = (rule, value, callback) => {
                let email = this.editForm.email;
                if (!KHUtils.isNull(email) && !KHUtils.isEmail(email)) {
                    callback(new Error('请输入正确的邮箱地址'));
                } else {
                    callback();
                }
            };
            const validateRole = (rule, value, callback) => {
                if (this.roleArray.length === 0) {
                    callback(new Error('请勾选角色组,若没有你需要的角色组请至角色管理中添加'));
                } else {
                    callback();
                }
            };
            return {
                tenantUserType:2,
                selectedArray: [],
                orgSelectedVisible: false,
                orgTreeHackSet: false,
                filterText: '',
                treeData: [],
                orgProps: {
                    children: 'children',
                    label: 'orgName'
                },
                tenantValue: null,
                tenantData: [],
                queryTenantParam: {
                    pageNum: 1,
                    pageSize: 100
                },
                oldEmail: "",
                oldRealName: "",
                oldPhone: "",
                delLoading: false,
                currentNodeCheckedMsg: "",
                activeName: "first",
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                // 用户信息关键字搜索
                keyWord: "",
                pwdForm: {
                    username: '',
                    password: '',
                    newPassword: '',
                    surePassword: '',
                    id: ''
                },
                pwdLoading: false,
                pwdVisible: false,
                // 修改前的密码
                editBeforePassword: '',
                editBeforeUserName: '',
                // 手机号码最大长度
                maxPhone: 11,
                pageSize: 5,
                // 电话号码最大长度
                maxTel: 13,
                // 当前页
                pageNum: 1,
                // 总数
                countPage: 0,
                // 编辑界面显是否显示
                editFormVisible: false,
                // 编辑界面标题
                formTitle: '编辑',
                props: {
                    children: 'children',
                    label: 'orgName'
                },
                editForm: {
                    username: '',
                    password: '',
                    sex: '0',
                    phone: '',
                    realName: '',
                    email: '',
                    status: 1,
                    source: '',
                    roles: '',
                    orgId: '',
                    orgName: ''
                },
                roleArray: [],
                editLoading: false,
                isAddOrEdit: false,
                editFormRules: {
                    realName: [
                        {required: true, message: '请输入真实姓名', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, max: 11, message: '请输入11位手机号码', trigger: 'blur'},
                        {validator: validateMobile, trigger: 'blur'}
                    ],
                    email: [
                        {validator: validateMail, trigger: 'blur'}
                    ],
                    username: [
                        {required: true, message: '请输入用户名', trigger: 'blur'},
                        {validator: checkUseNameExists, trigger: 'blur'}
                    ],
                    password: [
                        {required: true, message: '请输入密码', trigger: 'blur'},
                        {validator: validatePwd, trigger: 'blur'}
                    ],
                    roleArray: [
                        {validator: validateRole, trigger: 'blur'}
                    ]
                },
                currentNodeData: {
                    orgName: '',
                    id: ''
                },
                multipleSelection: [],
                body: {},
                // 查询条件下的table（人员列表）集合
                tableData: [],
                listLoading: false,
                display: 'none',
                // 用户组
                roleList: [],
                roleProps: {
                    label: 'roleName',
                    children: 'children'
                },
                currentRoleData: {},
                searchFlag: false,
            }
        },
        mounted() {
            // this.init();
            // this.listRole();
            this.loadTenantFirst();
        },
        methods: {
            lazyLoadNode(node, resolve) {
                let _this = this;
                let param = {
                    tenantId: _this.tenantValue
                };
                if (node.data) {
                    param.orgId = node.data.id;
                }
                this.$Get(this.khConfig.api.listTenantOrg, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            let tree = res.list;
                            if (tree instanceof Array && tree.length > 0) {
                                if (node.data) {
                                    _this.currentNodeData = _this.KHUtils.clone(node.data);
                                } else {
                                    _this.currentNodeData = _this.KHUtils.clone(tree[0]);
                                    _this.listUser(tree[0].id);
                                }
                                return resolve(tree);
                            } else {
                                return resolve([]);
                            }
                        }
                    }).catch(error => {
                    console.error(error)
                });
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
                            this.orgTreeHackSet = false;
                            this.$nextTick(() => {
                                    this.orgTreeHackSet = true;
                                }
                            );
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
                    this.listRole();
                    this.orgTreeHackSet = false;
                    this.$nextTick(() => {
                            this.orgTreeHackSet = true;
                        }
                    );
                }
            },
            handleNodeClick(data) {
                let _this = this;
                _this.currentNodeData = data;
                _this.listUser(data.id);
            },
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
            // 切换标签页
            changeTab() {
                if (this.activeName === "second") {
                    // 系统角色,默认加载第一个
                    if (this.roleList instanceof Array && this.roleList.length > 0) {
                        this.switchRole(this.roleList[0]);
                    }
                } else {
                    if (this.currentNodeData.id) {
                        this.listUser(this.currentNodeData.id);
                    }
                }
            },
            // 查询所有角色
            listRole() {
                let _this = this;
                _this.roleList = [];
                _this.$Get(_this.khConfig.api.listRole, {tenantId: this.tenantValue})
                    .then(res => {
                        if (!this.KHUtils.isNull(res.list) && res.list.length > 0) {
                            _this.roleList = res.list;
                        }
                    })
            },
            // 切换不同角色组查询功能权限
            switchRole(data, pageNum) {
                let _this = this;
                _this.currentRoleData = data;
                if (_this.KHUtils.isNull(pageNum)) {
                    _this.pageNum = 1;
                }
                _this.searchFlag = false;
                _this.currentNodeCheckedMsg = this.KHUtils.isNull(this.currentNodeData.orgName) ? "当前角色：" : "当前角色：" + data.roleName;
                let param = {
                    roleId: _this.currentRoleData.id,
                    pageNum: _this.pageNum,
                    pageSize: _this.pageSize,
                    wd: _this.keyWord,
                    tenantId: this.tenantValue
                };
                _this.listLoading = true;
                _this.$Get(_this.khConfig.api.listUserByRoleId, param)
                    .then(res => {
                        _this.tableData = res.list;
                        _this.countPage = res.totalCount;
                        _this.listLoading = false;
                    })
            },
            // 获取人员列表
            listUser(orgId, flag) {
                let _this = this;
                _this.currentNodeCheckedMsg = this.KHUtils.isNull(this.currentNodeData.orgName) ?
                    "当前组织：" : "当前组织：" + this.currentNodeData.orgName;
                _this.searchFlag = !_this.KHUtils.isNull(flag);
                let param = {
                    orgId: orgId,
                    pageNum: _this.pageNum,
                    pageSize: _this.pageSize,
                    wd: _this.keyWord,
                    tenantId: this.tenantValue
                };
                _this.listLoading = true;
                _this.$Get(_this.khConfig.api.listUser, param)
                    .then(res => {
                        _this.tableData = res.list;
                        _this.countPage = res.totalCount;
                        if (_this.roleList == null || _this.roleList.length <= 0) {
                            _this.roleList = res.roleList;
                        }
                        _this.listLoading = false;
                    })
            },
            // Table中用户状态属性的过滤
            filterTag(value, row) {
                return row.status === value;
            },
            // 是否展开组织树
            displayTree() {
                if (this.display === 'none') {
                    this.display = 'block'
                } else if (this.display === 'block') {
                    this.display = 'none'
                }
            },
            // 选择所属组织
            selectDepartment(data) {
                let _this = this;
                _this.editForm.orgId = data.id;
                _this.editForm.orgName = data.orgName;
                _this.pageNum = 1;
                _this.display = 'none';
            },
            // 换页
            handleCurrentPage(val) {
                let _this = this;
                _this.currentPage = val;
                _this.pageNum = _this.currentPage;
                if (!_this.searchFlag) {
                    if (this.activeName === "second") {
                        if (_this.currentRoleData != null) {
                            _this.keyWord = "";
                            _this.switchRole(_this.currentRoleData, val);
                        } else {
                            _this.listUser(null); // 默认展示所有的,不分部门
                        }
                    } else {
                        if (_this.KHUtils.isNull(_this.currentNodeData)) {
                            _this.keyWord = "";
                            _this.listUser(_this.currentNodeData.id);
                        } else {
                            _this.listUser(null); // 默认展示所有的,不分部门
                        }
                    }
                } else {
                    _this.listUser(null, "search") // 搜索分页
                }
            },
            // 批量删除
            batchDel(multipleSelection) {
                let _this = this;
                _this.delLoading = true;
                let readyToDeleteIds = "";
                if (multipleSelection instanceof Array) {
                    for (let item of multipleSelection) {
                        readyToDeleteIds += item.id + ","
                    }
                } else {
                    readyToDeleteIds.push(item.id)
                }
                let param = {
                    ids: readyToDeleteIds
                };
                _this.$Get(_this.khConfig.api.deleteUser, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.init();
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                        }
                        _this.delLoading = false;
                    })
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
                        _this.batchDel(_this.multipleSelection)
                    }).catch((e) => {
                        console.log(e)
                    });
                }
            },
            handleSelectionChange(val) {
                let _this = this;
                _this.multipleSelection = val
            },
            // 显示编辑页面
            handleEdit(row) {
                let _this = this;
                // 清空数组
                if (_this.roleArray.length > 0) {
                    _this.roleArray.splice(0, _this.roleArray.length)
                }
                _this.display = 'none';
                _this.isAddOrEdit = false;
                _this.editFormVisible = true;
                _this.formTitle = '编辑';
                _this.editBeforePassword = row.password;
                _this.editBeforeUserName = row.username;
                // 查询用户所属的角色信息
                _this.$Get(_this.khConfig.api.listRoleByUserId, {userId: row.id})
                    .then(res => {
                        if (!this.KHUtils.isNull(res.list)) {
                            res.list.forEach(obj => {
                                _this.roleArray.push(obj.id);
                            });
                        }
                    });
                _this.editForm = _this.KHUtils.clone(row);
                // 查询用户管理的租户用户类型
                _this.$Get(_this.khConfig.api.getTenantUserRelative, {userId: row.id})
                    .then(res => {
                        if (!this.KHUtils.isNull(res.tenantUser)) {
                            _this.tenantUserType = res.tenantUser.userType;
                        }
                    });
                _this.editForm.status = parseInt(_this.editForm.status);
                _this.oldPhone = _this.editForm.phone;
                _this.oldEmail = _this.editForm.email;
                _this.oldRealName = _this.editForm.realName;
            },
            // 显示新增界面
            handleAdd() {
                let _this = this;
                // 清空数组
                if (_this.roleArray.length > 0) {
                    _this.roleArray.splice(0, _this.roleArray.length)
                }
                _this.display = 'none';
                _this.isAddOrEdit = true;
                _this.editFormVisible = true;
                _this.formTitle = '新增';
                _this.editForm = {
                    username: '',
                    password: '',
                    sex: '0',
                    phone: '',
                    realName: '',
                    email: '',
                    status: 1,
                    source: '',
                    roles: '',
                    orgId: ''
                };
                if (_this.treeData instanceof Array) {
                    if (_this.treeData.length > 0) {
                        _this.editForm.orgName = _this.treeData[0].orgName;
                        _this.editForm.orgId = _this.treeData[0].id;
                    }
                }
            },
            // 保存
            editSubmit() {
                let _this = this;
                if (_this.KHUtils.isNull(_this.editForm.orgId)) {
                    _this.$notify({
                        title: '警告',
                        message: '请选择关联的组织',
                        type: 'warning'
                    });
                    return false;
                }
                _this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        if (_this.editForm.username == _this.editForm.password) {
                            this.$message({
                                message: '密码请勿与用户名一致!!!',
                                type: 'warning'
                            });
                            return false;
                        }
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            _this.editLoading = true;
                            setTimeout(function () {
                                _this.editLoading = false;
                                let url;
                                if (_this.isAddOrEdit) {
                                    url = _this.khConfig.api.addUser;
                                } else {
                                    url = _this.khConfig.api.updateUser;
                                }
                                _this.editForm.oldPhone = _this.oldPhone;
                                _this.editForm.oldRealName = _this.oldRealName;
                                _this.editForm.oldEmail = _this.oldEmail;
                                _this.$Post(url, _this.convertUserForm2Array(_this.editForm))
                                    .then(res => {
                                        _this.editLoading = false;
                                        if (res.errCode === 0) {
                                            _this.$notify({
                                                title: '成功',
                                                message: '操作成功',
                                                type: 'success'
                                            });
                                            _this.init();
                                        }
                                        _this.editFormVisible = false;
                                    })
                            }, 1000);
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            // form提交参数处理
            convertUserForm2Array(_form) {
                let _this = this;
                let paramArray = [];
                paramArray.push("username=" + _form.username);
                if (!_this.KHUtils.isNull(_form.orgId)) {
                    paramArray.push("orgId=" + _form.orgId);
                }
                let roles = '';
                if (_this.roleArray.length > 0) {
                    for (let i = 0, n = _this.roleArray.length; i < n; i++) {
                        roles += _this.roleArray[i] + ","
                    }
                    paramArray.push("roles=" + roles);
                }
                paramArray.push("sex=" + _form.sex);
                if (!_this.KHUtils.isInvalidValue(_form.password)) {
                    paramArray.push("ps=" + _this.encryptedPwd(_form.password));
                }
                if (!_this.KHUtils.isInvalidValue(_form.phone)) {
                    paramArray.push("phone=" + _form.phone);
                }
                if (!_this.KHUtils.isInvalidValue(_form.realName)) {
                    paramArray.push("realName=" + _form.realName);
                }
                if (!_this.KHUtils.isInvalidValue(_form.email)) {
                    paramArray.push("email=" + _form.email);
                }
                paramArray.push("status=" + _form.status);
                if (!_this.KHUtils.isInvalidValue(_form.source)) {
                    paramArray.push("source=" + _form.source);
                }
                if (!_this.KHUtils.isInvalidValue(_form.oldPhone)) {
                    paramArray.push("oldPhone=" + _form.oldPhone)
                }
                if (!_this.KHUtils.isInvalidValue(_form.oldRealName)) {
                    paramArray.push("oldRealName=" + _form.oldRealName)
                }
                if (!_this.KHUtils.isInvalidValue(_form.oldEmail)) {
                    paramArray.push("oldEmail=" + _form.oldEmail)
                }
                if (!_this.isAddOrEdit) {
                    paramArray.push("id=" + _form.id);
                }
                paramArray.push("tenantUserType=" + _this.tenantUserType);
                paramArray = paramArray.join("&");
                return paramArray;
            },
            // 修改密码
            updatePwd() {
                let _this = this;
                _this.$refs.pwdForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
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
                                        _this.editLoading = false;
                                        _this.pwdVisible = false;
                                    })
                            }, 1000);
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            // 重置密码
            resetPwd(row, column, event) {
                let _this = this;
                _this.$confirm('确认重置' + row.username + '的密码吗？', '提示', {}).then(() => {
                    setTimeout(function () {
                        let paramArray = [];
                        paramArray.push("username=" + row.username);
                        paramArray.push("id=" + row.id);
                        paramArray = paramArray.join("&");
                        _this.$Post(_this.khConfig.api.resetPwd, paramArray)
                            .then(res => {
                                if (res.errCode === 0) {
                                    _this.$notify({
                                        title: '成功',
                                        message: '重置密码成功,初始密码为' + res.initPwd + '请尽快修改密码！！！',
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
            // 控制用户状态
            controlUserStatus(status, row) {
                let _this = this;
                let tip = status === '0' ? '禁用' : '启用';
                tip = tip + row.username;
                _this.$confirm('确认' + tip + '吗?', '提示', {}).then(() => {
                    let paramArray = [];
                    paramArray.push("id=" + row.id);
                    paramArray.push("status=" + status);
                    paramArray.push("username=" + row.username);
                    paramArray = paramArray.join("&");
                    _this.$Post(_this.khConfig.api.updateStatus, paramArray)
                        .then(res => {
                            _this.editLoading = false;
                            if (res.errCode === 0) {
                                _this.$notify({
                                    title: '成功',
                                    message: tip + '成功',
                                    type: 'success'
                                });
                                _this.init();
                                _this.keyWord = "";
                            }
                        })
                }).catch((e) => {
                    console.log(e)
                });
            },
            // 启用用户
            startUser(row, column, event) {
                let _this = this;
                _this.controlUserStatus('1', row);
            },
            // 禁用用户
            stopUser(row, column, event) {
                let _this = this;
                _this.controlUserStatus('0', row);
            }
        }
    }
</script>
<style lang="scss" scoped>
    .custom-user-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }
</style>

