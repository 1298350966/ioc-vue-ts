<template>
    <el-row style="height: 100%" class="menu-setting">
        <el-row style="padding-top: 10px;padding-bottom: 10px">
            <el-col :span="8">
                <el-button size="mini" @click="handlerAddCatalog" style="background: #0b1532;border-color: #2153d4;color: #fff">新增目录</el-button>
            </el-col>
            <el-col :span="14" style="padding-left: 120px"><h3 style="float: left;color: #fff">当前父菜单：{{parentMenu.menuName}}</h3>
            </el-col>
        </el-row>
        <el-row style="height: 90%">
            <el-col :span="8" style="height: 102%;overflow: hidden">
                <el-tree
                    :data="menuTree"
                    :props="props"
                    node-key="id"
                    default-expand-all
                    v-loading="treeLoading"
                    @node-click="handlerNodeClick"
                    :expand-on-click-node="false">
                <span class="custom-tree-node" id="customTree" slot-scope="{ node, data }">
                         <span>{{ node.label }}</span>
                         <span>
                          <!-- <el-button type="text" size="mini" icon="el-icon-plus"
                                     @click="() => append(node,data)"></el-button> -->
                         <el-button type="text" size="mini" icon="el-icon-delete"
                                    @click="() => remove(node, data)"></el-button>
                    </span>
                    </span>
                </el-tree>
            </el-col>
            <el-col :span="14" style="padding-left: 120px">
                <el-cascader-panel :options="options" ref="menuRef" @change="addMenuChild"
                                   v-model="value"></el-cascader-panel>
            </el-col>
        </el-row>
        <el-dialog title="新增目录" :visible.sync="addMenuVisible" :close-on-click-modal="false" :modal="false" custom-class="advanced-set-dialog">
            <el-form :model="addMenuForm" label-width="120px" :rules="addFormRules" ref="addMenuForm" style="margin-top:20px;color: black" class="custom-box1">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="菜单名称" prop="menuName">
                            <el-input v-model="addMenuForm.menuName"></el-input>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="路由地址" prop="menuUrl">
                            <el-input v-model="addMenuForm.menuUrl" placeholder="/system"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="上级目录">
                            <el-input style="line-height: 30px;" v-model="addMenuForm.parentMenuName"
                                      @focus="displayTree" clearable>
                                {{addMenuForm.parentMenuName}}
                            </el-input>
                            <el-tree
                                :data="menuTree"
                                :props="props"
                                :style="{zIndex: 2, display: display}"
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
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addCatalog">保存</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>

    export default {
        name: "MenuSetting",
        props: ["formType", "formId", "notifySave", 'formName'],
        created() {
            let _this = this;
            // 查询当前系统中已存在的普通表单
            _this.$Get(this.khConfig.api.listFormConfWithPermission, {
                formType: this.formType,
                pageNum: 1,
                pageSize: 1000
            }).then(res => {
                if (res.errCode === 0) {
                    if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                        res.datas.forEach(obj => {
                            let formConfig = JSON.parse(obj.formMeta);
                            if (!this.KHUtils.isNull(formConfig) && formConfig.list) {
                                if (formConfig.list.length > 0) {
                                    _this.options[1].children.push({"value": obj.formId, "label": obj.formName}); // 未进行表单设计的菜单不允许挂载
                                }
                            }
                        })
                    }
                }
            });
        },
        watch: {
            notifySave: {
                deep: true,
                handler() {
                    this.saveMenu();
                }
            },
        },
        data() {
            return {
                addFormRules: {
                    menuName: [
                        {required: true, message: '请输入菜单名称', trigger: 'blur'}
                    ],
                    menuUrl: [
                        {required: true, message: '请输入路由地址', trigger: 'blur'},
                        {
                            validator: (rule, value, callback) => {
                                if (/(\*|\+|\^|\%|\#|\@|\!|\~)/.test(value)) {
                                    callback(new Error('请输入数字，字母，-，_'));
                                } else {
                                    callback()
                                }
                            }, trigger: 'blur'
                        }
                    ]
                },
                addMenuForm: {
                    menuName: "",
                    menuUrl: "",
                    parentId: "",
                    level: "",
                    parentMenuName: ""
                },
                addMenuVisible: false,
                props: {
                    label: 'menuName',
                    children: 'children'
                },
                treeLoading: false,
                menuTree: [],
                parentMenu: {},
                showVisible: false,
                options: [{value: 9999999998, label: '添加当前表单',}, {value: 9999999999, label: '添加其他表单', children: []}],
                prepareAddMenu: [],// 待新增入数据库的菜单集合
                value: [],
                display: 'none'
            }
        },
        mounted() {
            this.listMenu();
        },
        methods: {
            // 展开上级菜单
            displayTree() {
                if (this.display === 'none') {
                    this.display = 'block'
                } else if (this.display === 'block') {
                    this.display = 'none'
                }
            },
            // 选择上级菜单
            selectParentMenu(data) {
                this.addMenuForm.parentMenuName = data.menuName;
                this.addMenuForm.parentId = data.id;
                this.addMenuForm.level = data.level ? data.level + 1 : 1;
                this.display = 'none';
            },
            // 查询菜单列表
            listMenu(flag) {
                let _this = this;
                _this.treeLoading = true;
                _this.prepareAddMenu = [];
                _this.value = [];
                // 查询默认的系统菜单和表单相关的菜单
                // 菜单类型(0或者null或者空:默认的系统菜单;1:表单相关的菜单;2:可通过路由直接访问的菜单,比如新增页面全屏设置,需要通过cas登录;
                // 3:可通过路由直接访问的菜单,并且不需要经过cas登录即可调用后台接口,比如注册页面)
                _this.$Get(_this.khConfig.api.listMenu, {hidden: '0', menuTypes: '0,1,9'})
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.menuTree = res.children;
                            if (!_this.KHUtils.isNull(_this.menuTree) && _this.menuTree.length > 0) {
                                if (_this.KHUtils.isNull(flag)) {
                                    _this.parentMenu = _this.menuTree[0];
                                } else {
                                    _this.menuTree.forEach(menu => {
                                        if (menu.menuUrl === _this.addMenuForm.menuUrl && menu.menuName === _this.addMenuForm.menuName) {
                                            _this.parentMenu = menu;
                                            return false;
                                        }
                                    })
                                }
                            }
                        }
                        _this.treeLoading = false;
                    })
            },
            // 打开新增目录页面
            handlerAddCatalog() {
                let _this = this;
                _this.addMenuForm = {};
                _this.addMenuVisible = true;
            },
            // 添加目录
            addCatalog() {
                this.$refs.addMenuForm.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            let paramArray = {};
                            
                            if (this.KHUtils.isNull(this.addMenuForm.parentMenuName)) {
                                this.addMenuForm.level = 1;
                            }
                            if (this.addMenuForm.level === 1) {
                                paramArray.component="FormCustomBase"
                            } else {
                                paramArray.formId = this.formId
                                paramArray.component ="ThirdFormCustomBase"
                            }
                            if (!this.KHUtils.isInvalidValue(this.addMenuForm.parentId)) {
                                paramArray.parentId = this.addMenuForm.parentId
                            }
                            paramArray.menuName = this.addMenuForm.menuName
                            paramArray.menuUrl = this.addMenuForm.menuUrl
                            paramArray.menuType = "1"
                            paramArray.hidden = "0"
                            paramArray.level = this.addMenuForm.level
                            paramArray.orderIndex = "1000"
                            // paramArray = paramArray.join("&");
                            this.$PostFromData(this.khConfig.api.addMenu, paramArray)
                                .then(res => {
                                    this.addMenuVisible = false;
                                    if (res.errCode === 0) {
                                        this.$notify({
                                            title: '成功',
                                            message: '添加成功',
                                            type: 'success'
                                        });
                                    }
                                    this.listMenu('add');
                                })
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            // 展示菜单选择的页面
            handlerNodeClick(data) {
                let _this = this;
                _this.value = [];
                _this.showVisible = true;
                _this.parentMenu = data;
            },
            // 展示菜单选择的页面
            append(node, data) {
                let _this = this;
                _this.value = [];
                _this.showVisible = true;
                _this.parentMenu = data;
            },
            // 添加菜单
            addMenuChild() {
                let _this = this;
                let checkedNodes = this.$refs.menuRef.getCheckedNodes();
                if (this.KHUtils.isNull(checkedNodes) || checkedNodes.length === 0) {
                    _this.$notify.warning({
                        title: '警告',
                        message: '未选择任何需要配置的菜单'
                    });
                    return false;
                }
                let checkNode = checkedNodes[0];
                let newChild = {};
                let newChildFormId = 0;
                if (checkNode.value === 9999999998) {
                    // 添加当前表单
                    newChildFormId = _this.formId;
                    newChild.menuName = _this.formName;
                } else {
                    newChildFormId = checkNode.data.value;
                    newChild.menuName = checkNode.data.label;
                }
                if (!_this.parentMenu.children) {
                    this.$set(_this.parentMenu, 'children', []);
                }
                let flag = false;
                _this.parentMenu.children.forEach(pm => {
                    if (pm.menuName === newChild.menuName) {
                        flag = true;
                    }
                });
                if (flag) {
                    _this.$notify.warning({
                        title: '警告',
                        message: '不允许在同一级菜单下添加重复的子菜单'
                    });
                    return false;
                }
                newChild.formId = newChildFormId;
                newChild.menuUrl = _this.parentMenu.menuUrl + "/custom/" + newChildFormId;
                newChild.parentId = _this.parentMenu.id;

                newChild.level = _this.parentMenu.level + 1;

                newChild.component = "FormCustomV2";
                newChild.hidden = 0;
                _this.prepareAddMenu.push(newChild);
                _this.parentMenu.children.push(newChild);
            },
            // 保存菜单
            saveMenu() {
                let _this = this;
                _this.$confirm('确认保存菜单配置吗？', '提示', {}).then(() => {
                    if (_this.prepareAddMenu.length > 0) {
                        _this.prepareAddMenu.forEach((menu, index) => {
                            menu.orderIndex = index;
                            this.$emit("onMenu",menu);
                            this.$emit("notifyParentClose", true, true, false);
                            // this.$Post(_this.khConfig.api.addMenu, _this.convertForm2Array(menu))
                            //     .then(res => {
                            //         if (res.errCode === 0) {
                            //             this.$notify({
                            //                 title: '成功',
                            //                 message: '菜单配置成功',
                            //                 type: 'success'
                            //             });

                            //             this.$emit("onMenuUrl",menuParams.menuUrl);
                            //         } else {
                            //             this.$emit("notifyParentClose", true, false, true);
                            //         }
                            //     });
                        });
                    } else {
                        this.$emit("notifyParentClose", true, true, false);
                    }
                }).catch((e) => {
                    this.$emit("notifyParentClose", true, false, true);
                    console.log(e)
                });
            },
            // 删除
            remove(node, data) {
                let _this = this;
                _this.$confirm('确认移除此菜单配置吗？', '提示', {}).then(() => {
                    const parent = node.parent;
                    const children = parent.data.children || parent.data;
                    const index = children.findIndex(d => d.id === data.id);
                    children.splice(index, 1);
                    const menuIndex = _this.prepareAddMenu.findIndex(d => d.id === data.id);
                    _this.prepareAddMenu.splice(menuIndex, 1);
                    if(!data.hasOwnProperty('id')) return;
                    _this.$Get(_this.khConfig.api.deleteMenu, {ids: data.id})
                        .then(res => {
                            if (res.errCode === 0) {
                                _this.listMenu();
                                _this.$notify({
                                    title: '成功',
                                    message: '删除成功',
                                    type: 'success'
                                });
                            }
                            _this.delLoading = false;
                        })
                }).catch((e) => {
                    console.log(e)
                });
            },
            // form提交参数处理
            convertForm2Array(_form) {
                let paramArray = [];
                paramArray.push("menuType=1");
                paramArray.push("formId=" + _form.formId);
                paramArray.push("orderIndex=" + _form.orderIndex);
                paramArray.push("menuName=" + _form.menuName);
                paramArray.push("parentId=" + _form.parentId);
                paramArray.push("menuUrl=" + _form.menuUrl);
                paramArray.push("level=" + _form.level);
                paramArray.push("component=" + _form.component);
                paramArray.push("hidden=" + _form.hidden);
                paramArray = paramArray.join("&");
                return paramArray;
            },
        }
    }
</script>


<style lang="scss" scoped>
    :deep(.el-tree-node__content:hover){
        background: #266dd7;
    }
    :deep(.el-tree-node:focus > .el-tree-node__content){
        background: #266dd7;
    }
    :deep(.el-cascader-node:not(.is-disabled):hover, .el-cascader-node:not(.is-disabled):focus){
        background: #266dd7;
    }
    .menu-setting ::v-deep .custom-tree-node {
        flex: 1;
        display: flex;
        align-items: center;
        justify-content: space-between;
        font-size: 14px;
        padding-right: 8px;
    }

    .menu-setting ::v-deep .el-cascader-menu__list {
        position: relative;
        min-height: 100%;
        margin: 0;
        padding: 6px 0;
        list-style: none;
        -webkit-box-sizing: border-box;
        box-sizing: border-box;
        color: #fff;
    }
    .menu-setting ::v-deep .el-tree {
        position: relative;
        cursor: default;
        color: #fff;
        background-color: #0b1532;
        height: 100%;
        overflow: auto;
    }

    /*滚动条里面小方块*/
    .menu-setting ::v-deep .el-tree::-webkit-scrollbar-thumb {
        background-color: #fff;
        border-radius: 10px;
    }

    /*滚动条整体样式*/
    .menu-setting  ::v-deep .el-tree::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }

    /*滚动条里面轨道*/
    .menu-setting  ::v-deep .el-tree::-webkit-scrollbar-track {
        background: rgba(77, 86, 133, 0.1);
        border-radius: 10px;
    }

    ::v-deep .advanced-set-dialog {
        .el-dialog__body {
            padding: 0px 0px !important;
            background-color: #FFFFFF;
            overflow-y: auto !important;

            /*滚动条里面小方块*/
            &::-webkit-scrollbar-thumb {
                background-color: #EBEAEF;
                border-radius: 10px;
            }
            /*滚动条整体样式*/
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            /*滚动条里面轨道*/
            &::-webkit-scrollbar-track {
                background: #FFFFFF;
                border-radius: 10px;
            }
        }

        .el-dialog__header {
            background-color: #EAF1F7;
            border-bottom: 1px solid #E8E8E8;
            padding-left: 10px !important;
            padding-top: 15px !important;
            padding-bottom: 15px !important;
        }

        .el-dialog__footer {
            padding-top: 5px;
            padding-bottom: 5px;
            background-color: #F8F8FA !important;
        }

    }
    ::v-deep.custom-box1 .el-form-item__label {
        color: #303133 !important;
    }
</style>
