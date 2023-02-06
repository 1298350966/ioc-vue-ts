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
            <el-col :span="4">
                <el-tree
                    v-if="orgTreeHackSet"
                    :props="orgProps"
                    :load="lazyLoadNode"
                    @node-click="handleNodeClick"
                    lazy
                    ref="tree">
                </el-tree>
            </el-col>
            <el-col :span="18" style="position: relative;bottom: -8px;left: 2%">
                <div class="header-row" style="margin-bottom:15px;">
                    <span class="header-title">当前组织：{{currentNodeData.orgName}}</span>
                </div>
<!--                <el-row style="margin: 10px 0 10px 0">
                    <el-button @click="handleAdd">新增</el-button>
                    <el-button @click="handleDeleteMulti" :loading="delLoading">删除</el-button>
                </el-row>-->

                        <el-table
                            :data="tableData"
                            highlight-current-row
                            @selection-change="handleSelectionChange"
                            border
                            stripe
                            @row-click="handleEdit"
                        >
                            <el-table-column type="selection" width="55" prop="id" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="orgName" label="组织名称" width="180" show-overflow-tooltip
                                             align="center">
                            </el-table-column>
                            <el-table-column prop="orgCode" label="组织编码" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="parentOrgName" label="上级组织" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="level" label="级别" show-overflow-tooltip
                                             :formatter="this.KHUtils.formatLevel" align="center">
                            </el-table-column>
                            <el-table-column prop="orgIndex" label="排序号" show-overflow-tooltip align="center">
                            </el-table-column>
                        </el-table>

                <el-dialog title="查看" :visible.sync="editFormVisible" :close-on-click-modal="closeOnClickModal"
                           class="custom-org-dia">
                    <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm"
                             class="demo-form-inline">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="组织名称" prop="orgName">
                                    <el-input v-model.number="editForm.orgName" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="组织编码" prop="orgCode">
                                    <el-input v-model="editForm.orgCode" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="上级组织">
                                    <el-input style="line-height: 30px;" v-model="editForm.parentOrgName" :disabled="true">
                                        {{editForm.parentOrgName}}
                                    </el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序号" prop="orgIndex">
                                    <el-input v-model="editForm.orgIndex" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="组织描述" prop="orgDesc">
                                    <el-input v-model="editForm.orgDesc" type="textarea" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
     <!--               <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存
                        </el-button>
                    </div>-->
                </el-dialog>
                <el-dialog title="上级组织" :visible.sync="orgSelectedVisible" width="50%">
                    <org-selected @getCheckedNodes="getCheckedNodes" :selected-array="selectedArray"
                                  :tenant-id="tenantValue"></org-selected>
                </el-dialog>
                <el-dialog title="重命名" :visible.sync="renameFormVisible" :close-on-click-modal="closeOnClickModal"
                           class="custom-org-dia">
                    <el-form :model="renameForm" label-width="120px" :rules="renameFormRules" ref="renameForm">
                        <el-row>
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="22">
                                <el-form-item label="组织机构名称" prop="orgName">
                                    <!--  onkeypress="if(event.keyCode == 13) return false;" 解决按回车刷新的问题-->
                                    <el-input v-model="renameForm.orgName"
                                              onkeypress="if(event.keyCode === 13) return false;"
                                              style="width: 50%"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click.native="rename" :loading="renameLoading">保存</el-button>
                    </div>
                </el-dialog>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import OrgSelected from "@/components/OrgSelected";
    
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
        components: {
            OrgSelected
        },
        data() {
            // 校验组织名称是否重复
            let checkExists = (rule, value, callback) => {
                let _this = this;
                // 解决输入数字
                value = value + "";
                value = value.replace(/\s*/g, "");
                if ((!_this.isAddOrEdit && _this.editOrgName === value) || _this.currentNodeData.orgName === value) {
                    callback();
                }
                let data = {
                    checkedName: value
                };
                _this.$Get(_this.khConfig.api.listOrg, data).then(res => {
                    if (res.errCode === 0 && res.list != null && res.list.length > 0) {
                        callback(new Error('组织名称已存在'));
                    } else if (res.errCode === 0 && res.list != null && res.list.length === 0) {
                        _this.editForm.orgName = value;
                        _this.renameForm.orgName = value;
                        callback();
                    } else {
                        callback(new Error('服务端错误'));
                    }
                }).catch(error => {
                    console.log("checkExists OrgName :" + error);
                    callback(new Error('服务端错误'));
                });
            };
            // 检查是否选择与选择的上级组织的级别不相符
            let validateOrderIndex = (rule, value, callback) => {
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
                selectedArray: [],
                orgSelectedVisible: false,
                orgTreeHackSet: false,
                treeData: [],
                tenantValue: null,
                tenantData: [],
                queryTenantParam: {
                    pageNum: 1,
                    pageSize: 100
                },
                orgProps: {
                    children: 'children',
                    label: 'orgName'
                },
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                renameForm: {
                    orgName: ''
                },
                renameFormRules: {
                    orgName: [
                        {required: true, message: '请输入组织名称', trigger: 'blur'},
                        {validator: checkExists, trigger: 'blur'}
                    ]
                },
                renameFormVisible: false,
                renameLoading: false,
                // 允许删除
                allowDel: false,
                // 修改之前的组织名称
                editOrgName: '',
                display: 'none',
                props: {
                    children: 'children',
                    label: 'orgName'
                },
                editFormVisible: false,
                formTitle: '编辑',
                editForm: {
                    orgName: '', orgCode: '', parentId: '', orgDesc: '', orgIndex: '', level: '', parentOrgName: ''
                },
                editLoading: false,
                isAddOrEdit: false,
                editFormRules: {
                    orgName: [
                        {required: true, message: '请输入组织名称', trigger: 'blur'},
                        {validator: checkExists, trigger: 'blur'}
                    ],
                    orgIndex: [
                        {validator: validateOrderIndex, trigger: 'blur'}
                    ]
                },
                currentNodeData: {
                    id: '',
                    orgName: ''
                },
                multipleSelection: [],
                tableData: [],
                delLoading: false
            }
        },
        mounted() {
            this.loadTenantFirst();
        },
        methods: {
            // 从表单权限子组件中获取选中的节点
            getCheckedNodes(checkedNodes) {
                let _this = this;
                if (checkedNodes instanceof Array && checkedNodes.length > 0) {
                    _this.editForm.parentId = checkedNodes[0].id;
                    _this.editForm.parentOrgName = checkedNodes[0].orgName;
                }
                _this.orgSelectedVisible = false;
            },
            // 是否展开组织树
            displayTree(parentOrgId, parentOrgName) {
                let _this = this;
                _this.selectedArray = [];
                if (!_this.KHUtils.isNull(parentOrgId)) {
                    _this.selectedArray.push({id: parentOrgId, orgName: parentOrgName});
                }
                _this.orgSelectedVisible = true;
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
                    })
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
                _this.$Get(_this.khConfig.api.deleteOrg, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.currentNodeData.orgName = '';
                            _this.currentNodeData.id = '';
                            _this.getDeptTree({cacheUpdate: true});
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
                let delArray = [];
                for (let i = 0, n = array.length; i < n; i++) {
                    let obj = array[i];
                    if (obj.children != null && obj.children.length > 0) {
                        _this.$notify({
                            title: '警告',
                            message: '所选择要删除的' + obj.orgName + '组织中含有子组织,若必须要删除,请先删除其子组织再进行操作',
                            type: 'warning'
                        });
                    } else {
                        let param = {
                            ids: obj.id
                        };
                        _this.$Get(_this.khConfig.api.listUserRelOrgByOrgId, param)
                            .then(res => {
                                if (res.errCode === 0 && res.list != null && res.list.length > 0) {
                                    _this.$notify({
                                        title: '警告',
                                        message: '所选择要删除的' + obj.orgName + '组织与用户有关联关系,若必须要删除,请先删除组织下的用户再进行操作',
                                        type: 'warning'
                                    });
                                } else if (res.errCode === 0 && res.list != null && res.list.length === 0) {
                                    // 无子组织无关联用户
                                    delArray.push(obj);
                                }
                            })
                    }
                }
                _this.multipleSelection = delArray;
            },
            // 显示编辑页面
            handleEdit(row) {
                let _this = this;
                _this.display = 'none';
                _this.isAddOrEdit = false;
                _this.editFormVisible = true;
                _this.formTitle = '编辑';
                _this.editForm = row;
                _this.editOrgName = _this.editForm.orgName;
            },
            // 显示新增界面
            handleAdd() {
                let _this = this;
                _this.display = 'none';
                _this.isAddOrEdit = true;
                _this.editFormVisible = true;
                _this.formTitle = '新增';
                _this.editForm = {
                    orgName: '',
                    orgCode: '',
                    parentId: '',
                    orgDesc: '',
                    orgIndex: '',
                    level: '',
                    parentOrgName: ''
                };
                if (_this.KHUtils.isNull(_this.currentNodeData.orgName)) {
                    _this.editForm.level = 1;
                } else {
                    _this.editForm.parentId = this.currentNodeData.id;
                    _this.editForm.parentOrgName = this.currentNodeData.orgName;
                    if (_this.KHUtils.isNull(_this.currentNodeData.level)) {
                        _this.editForm.level = 1
                    } else {
                        _this.editForm.level = _this.currentNodeData.level + 1
                    }
                }
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
                                url = _this.khConfig.api.addOrg;
                            } else {
                                url = _this.khConfig.api.updateOrg;
                            }
                            _this.$Post(url, _this.convertForm2Array(_this.editForm))
                                .then(res => {
                                    if (res.errCode === 0) {
                                        _this.currentNodeData.orgName = _this.editForm.orgName;
                                        _this.currentNodeData.id = _this.editForm.parentId;
                                        _this.getDeptTree({cacheUpdate: true});
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
            convertForm2Array(_form) {
                let _this = this;
                let paramArray = [];
                if (!_this.KHUtils.isInvalidValue(_form.orgName)) {
                    paramArray.push("orgName=" + _form.orgName);
                }
                // 如果传入参数为null,则请求接口会400
                if (!_this.KHUtils.isNull(_form.parentId)) {
                    paramArray.push("parentId=" + _form.parentId);
                }
                if (!_this.KHUtils.isInvalidValue(_form.orgDesc)) {
                    paramArray.push("orgDesc=" + _form.orgDesc);
                }
                if (!_this.KHUtils.isInvalidValue(_form.level)) {
                    paramArray.push("level=" + _form.level);
                }
                if (!_this.KHUtils.isInvalidValue(_form.orgCode)) {
                    paramArray.push("orgCode=" + _form.orgCode);
                }
                if (!_this.KHUtils.isInvalidValue(_form.orgIndex)) {
                    paramArray.push("orgIndex=" + _form.orgIndex);
                }
                if (!_this.isAddOrEdit) {
                    paramArray.push("id=" + _form.id);
                }
                paramArray = paramArray.join("&");
                return paramArray;
            },
            // 显示重命名的界面
            handleRename() {
                let _this = this;
                _this.renameFormVisible = true;
                _this.renameForm.orgName = _this.currentNodeData.orgName;
            },
            // 重命名
            rename() {
                let _this = this;
                _this.$refs.renameForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            _this.renameLoading = true;
                            let paramArray = [];
                            paramArray.push("id=" + _this.currentNodeData.id);
                            paramArray.push("orgName=" + _this.renameForm.orgName);
                            paramArray = paramArray.join("&");
                            _this.$Post(_this.khConfig.api.updateOrg, paramArray)
                                .then(res => {
                                    _this.renameLoading = false;
                                    if (res.errCode === 0) {
                                        _this.currentNodeData.orgName = _this.renameForm.orgName;
                                        _this.getDeptTree({cacheUpdate: true});
                                        _this.renameFormVisible = false;
                                        _this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                });
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            handleNodeClick(data) {
                let _this = this;
                _this.currentNodeData = _this.KHUtils.clone(data);
                let param = {
                    tenantId: _this.tenantValue
                };
                if (data) {
                    param.orgId = data.id;
                }
                this.$Get(this.khConfig.api.listTenantOrg, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            let tree = res.list;
                            this.tableData = [];
                            if (tree instanceof Array) {
                                _this.tableData = tree;
                            }
                        }
                    }).catch(error => {
                    console.error(error)
                });
            },
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
                            this.treeData = [];
                            this.tableData = [];
                            if (tree instanceof Array && tree.length > 0) {
                                if (node.data) {
                                    _this.tableData = tree;
                                    _this.currentNodeData = _this.KHUtils.clone(node.data);
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
                    this.orgTreeHackSet = false;
                    this.$nextTick(() => {
                            this.orgTreeHackSet = true;
                        }
                    );
                }
            },
        }
    }
</script>
<style lang="scss" scoped>
    .custom-org-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }
</style>

