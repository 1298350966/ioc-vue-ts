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
<!--                <div class="el-input">
                    <input type="text"
                           v-model="filterText"
                           autocomplete="off"
                           placeholder="输入菜单名称进行搜索"
                           class="el-input__inner" style="width: 200px">
                </div>-->
                <el-tree
                    :data="menuTree"
                    :props="props"
                    node-key="id"
                    accordion
                    ref="menuTreeRef"
                    highlight-current
                    :filter-node-method="filterNode"
                    @node-click="handleNodeClick"
                    v-loading="listLoading"
                    class="tree-no-border">
                </el-tree>
            </el-col>
            <el-col :span="18" style="position: relative;bottom: -8px;left: 2%">
                <div class="header-row" >
                    <span class="header-title">当前菜单：{{currentNodeData.menuName}}</span>
                </div>
                <el-row style="margin: 10px 0 10px 0">
          <!--          <el-button @click="handleAdd">新增</el-button>
                    <el-button @click="handleDeleteMulti" :loading="delLoading">删除</el-button>-->
                </el-row>
                <!--列表-->

                        <el-table
                            :data="tableData"
                            @selection-change="handleSelectionChange"
                            highlight-current-row
                            border
                            stripe
                            v-loading="listLoading"
                            @row-click="handleEdit"
                        >
                            <el-table-column type="selection" prop="id" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="id" label="菜单编号" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="menuName" label="菜单名称" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="parentMenuName" label="上级菜单" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="level" label="菜单等级" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="menuUrl" label="路由地址" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="orderIndex" label="排序号" align="center" show-overflow-tooltip>
                            </el-table-column>
                        </el-table>
    
                <!--编辑界面-->
                <el-dialog title="查看菜单" :visible.sync="editFormVisible"
                           :close-on-click-modal="closeOnClickModal"
                           class="custom-menu-dia">
                    <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="菜单名称" prop="menuName">
                                    <el-input v-model="editForm.menuName" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="上级菜单" prop="parentMenuName">
                                    <el-input style="line-height: 30px;" v-model="editForm.parentMenuName":disabled="true">
                                    </el-input>
                                    <el-tree
                                        :data="menuTree"
                                        :props="props"
                                        :style="{position: 'absolute', zIndex: 2, display: display}"
                                        node-key="id"
                                        accordion
                                        highlight-current
                                        @node-click="selectParentMenu"
                                        :expand-on-click-node="false"
                                        ref="tree">
                                    </el-tree>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="路由地址" prop="menuUrl">
                                    <el-input v-model="editForm.menuUrl" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="组件名称" prop="component">
                                    <el-input v-model="editForm.component" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="排序号" prop="orderIndex">
                                    <el-input v-model="editForm.orderIndex" :disabled="true"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="是否显示">
                                    <el-switch
                                        :disabled="true"
                                        active-color="#13ce66"
                                        inactive-color="#ff4949"
                                        active-value="0" inactive-value="1" v-model="editForm.hidden"
                                        style="width: auto">
                                    </el-switch>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="接口地址" prop="serverUrl">
                                    <el-input v-model="editForm.serverUrl" :disabled="true"
                                              type="textarea" ></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
         <!--           <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存
                        </el-button>
                    </div>-->
                </el-dialog>
            </el-col>
        </el-row>
    </section>
</template>

<script>
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
            return {
                tenantValue: null,
                tenantData: [],
                queryTenantParam: {
                    pageNum: 1,
                    pageSize: 100
                },
                delLoading: false,
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                display: 'none',
                menuTree: [],
                props: {
                    label: 'menuName',
                    children: 'children'
                },
                editFormVisible: false,
                editFormTitle: '新增菜单',
                editForm: {},
                editLoading: false,
                isAddOrEdit: false,
                editFormRules: {
                    menuName: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    menuUrl: [
                        {required: true, message: '请输入路由地址', trigger: 'blur'}
                    ]
                },
                currentNodeData: {
                    menuName: '',
                    id: ''
                },
                body: {},
                multipleSelection: [],
                menuData: [],
                tableData: [],
                listLoading: false,
                filterText: ''
            }
        },
        watch: {
            filterText(val) {
                this.$refs.menuTreeRef.filter(val);
            }
        },
        mounted() {
            this.loadTenantFirst();
        },
        methods: {
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
                            this.init();
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
                    this.init();
                }
            },
            clearParent() {
                let _this = this;
                _this.editForm.parentId = null;
                if (_this.editForm.level > 1) {
                    _this.editForm.level = _this.editForm.level - 1;
                }
            },
            filterNode(value, data) {
                if (!value) return true;
                return data.menuName.indexOf(value) !== -1;
            },
            // 初始化
            init() {
                let _this = this;
                _this.listLoading = true;
                this.$Get(_this.khConfig.api.listMenu, {tenantId: _this.tenantValue})
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.menuTree = res.children;
                            if (!_this.KHUtils.isNull(_this.menuTree) && _this.menuTree.length > 0) {
                                // 初始化当前菜单
                                if (_this.KHUtils.isNull(_this.currentNodeData.id)) {
                                    _this.currentNodeData = _this.KHUtils.clone(_this.menuTree[0]);
                                }
                                _this.tableData = [];
                                _this.menuTree.forEach(menu => {
                                    if (_this.currentNodeData.id === menu.id) {
                                        if (_this.KHUtils.isNull(menu.children) || menu.children.length === 0) {
                                            _this.tableData.push(menu);
                                        } else {
                                            _this.tableData = menu.children;
                                            _this.tableData = _this.tableData.concat(menu);
                                        }
                                    }
                                })
                            }
                        }
                        _this.listLoading = false;
                    })
            },
            // 展开树
            displayTree() {
                if (this.display === 'none') {
                    this.display = 'block'
                } else if (this.display === 'block') {
                    this.display = 'none'
                }
            },
            // 选择上级菜单
            selectParentMenu(data) {
                this.editForm.parentMenuName = data.menuName;
                this.editForm.parentId = data.id;
                this.editForm.level = data.level ? data.level + 1 : 1;
                this.display = 'none';
            },
            // 切换菜单,更新表格展示数据
            handleNodeClick(data) {
                this.currentNodeData = this.KHUtils.clone(data);
                this.tableData = [];
                if (this.currentNodeData.id === data.id) {
                    this.tableData = data.children;
                    this.tableData = this.tableData.concat(data);
                }
            },
            // 删除选中的多条记录
            handleDeleteMulti() {
                let _this = this;
                if (_this.multipleSelection === "" || _this.multipleSelection.length === 0) {
                    _this.$notify({
                        title: '警告',
                        message: '请选择要删除的记录',
                        type: 'warning'
                    })
                } else {
                    _this.$confirm('确认删除该记录吗?', '提示', {}).then(() => {
                        _this.batchDel(_this.multipleSelection)
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
                _this.$Get(_this.khConfig.api.deleteMenu, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.currentNodeData = {};
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
            handleSelectionChange(array) {
                let _this = this;
                let delArray = [];
                for (let i = 0, n = array.length; i < n; i++) {
                    let obj = array[i];
                    if (obj.children != null && obj.children.length > 0) {
                        _this.$notify({
                            title: '警告',
                            message: '所选择要删除的' + obj.menuName + '菜单中中含有子菜单,若必须要删除,请先删除其子菜单再进行操作',
                            type: 'warning'
                        });
                    } else {
                        delArray.push(obj);
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
                _this.editFormTitle = '编辑菜单';
                _this.editForm = row;
            },
            // 显示新增界面
            handleAdd() {
                let _this = this;
                _this.display = 'none';
                _this.isAddOrEdit = true;
                _this.editFormVisible = true;
                _this.editFormTitle = '新增菜单';
                _this.editForm = {};
                _this.editForm.parentMenuName = _this.currentNodeData.menuName;
                _this.editForm.parentId = _this.currentNodeData.id;
                _this.editForm.level = _this.currentNodeData.level + 1;
                _this.editForm.hidden = "0"
            },
            // 保存
            editSubmit() {
                this.$refs.editForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let url;
                            if (this.isAddOrEdit) {
                                url = this.khConfig.api.addMenu;
                            } else {
                                url = this.khConfig.api.updateMenu;
                            }
                            this.$Post(url, this.convertForm2Array(this.editForm))
                                .then(res => {
                                    this.editLoading = false;
                                    this.editFormVisible = false;
                                    if (res.errCode === 0) {
                                        this.currentNodeData.menuName = this.editForm.parentMenuName;
                                        this.currentNodeData.id = this.editForm.parentId;
                                        this.init();
                                        this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
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
                if (!_this.KHUtils.isInvalidValue(_form.menuName)) {
                    paramArray.push("menuName=" + _form.menuName);
                }
                if (!_this.KHUtils.isNull(_form.parentId)) {
                    paramArray.push("parentId=" + _form.parentId);
                }
                if (!_this.KHUtils.isInvalidValue(_form.menuUrl)) {
                    paramArray.push("menuUrl=" + _form.menuUrl);
                }
                if (!_this.KHUtils.isInvalidValue(_form.level)) {
                    if (this.KHUtils.isNull(_form.parentMenuName)) {
                        paramArray.push("level=" + 1);
                    } else {
                        paramArray.push("level=" + _form.level);
                    }
                }
                if (!_this.KHUtils.isInvalidValue(_form.funcName)) {
                    paramArray.push("funcName=" + _form.funcName);
                }
                if (!_this.KHUtils.isInvalidValue(_form.serverUrl)) {
                    paramArray.push("serverUrl=" + _form.serverUrl);
                }
                if (!_this.KHUtils.isInvalidValue(_form.component)) {
                    paramArray.push("component=" + _form.component);
                }
                if (!_this.KHUtils.isInvalidValue(_form.redirect)) {
                    paramArray.push("redirect=" + _form.redirect);
                }
                if (!_this.KHUtils.isInvalidValue(_form.hidden)) {
                    paramArray.push("hidden=" + _form.hidden);
                }
                if (!_this.KHUtils.isInvalidValue(_form.orderIndex)) {
                    paramArray.push("orderIndex=" + _form.orderIndex);
                }
                if (!_this.isAddOrEdit) {
                    paramArray.push("id=" + _form.id);
                }
                paramArray.push("menuType=" + 0);
                paramArray = paramArray.join("&");
                return paramArray;
            },
        }
    }
</script>
<style lang="scss" scoped>
    .el-tree {
        width: 100%;
        border-radius: 5px;
    }
    
    .tree-no-border {
        border: none;
    }
    
    .demo-form-inline {
        margin-top: 20px;
    }
    
    .custom-menu-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }
</style>

