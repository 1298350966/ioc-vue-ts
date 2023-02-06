<template>
    <section>
        <div class="el-input">
            <input type="text"
                   v-model="filterText"
                   autocomplete="off"
                   placeholder="输入分类名称搜索"
                   class="el-input__inner" style="width: 200px">
            <el-button type="primary" @click="handleAddDicCatalog">新增</el-button>
        </div>
        <el-tree
            :data="dicCatalogData"
            default-expand-all
            node-key="id"
            ref="dicCatalogTree"
            highlight-current
            :props="dicCatalogProps"
            @node-click="handlerEditCatalog"
            :filter-node-method="filterNode"
            accordion
            :expand-on-click-node="false"
            show-checkbox
            @check-change="handleCheckChange"
            check-strictly
        >
        </el-tree>
        <el-dialog :title="catalogTitle" :visible.sync="dicCatalogFormVisible"
                   width="30%"
                   :close-on-click-modal="false"
                   :modal="false"
                   class="custom-dic-dia">
            <el-form :model="dicCatalogForm" label-width="80px" :rules="dicCatalogFormRules" ref="dicCatalogForm">
                <el-row>
                    <el-col :span="12">
                        <el-form-item label="分类名称" prop="name">
                            <el-input v-model="dicCatalogForm.name"></el-input>
                        </el-form-item>
                    </el-col>
                    <!--                <el-col :span="12">
                                        <el-form-item label="分类编码" prop="code">
                                            <el-input v-model="dicCatalogForm.code"></el-input>
                                        </el-form-item>
                                    </el-col>-->
                    <el-col :span="12">
                        <el-form-item label="父级分类">
                            <el-input style="line-height: 30px;" v-model="dicCatalogForm.parentName"
                                      @clear="clearParentDicCatalog"
                                      @focus="displayTree" clearable>
                            </el-input>
                            <el-tree
                                :data="dicCatalogData"
                                :props="dicCatalogProps"
                                :style="{zIndex: 2, display: display}"
                                :filter-node-method="filterNode"
                                node-key="id"
                                accordion
                                ref="tree"
                                highlight-current
                                @current-change="selectDicCatalog"
                                default-expand-all
                                :expand-on-click-node="false">
                            </el-tree>
                        </el-form-item>
                    </el-col>
                </el-row>
<!--                <el-row>
                    <el-col :span="12">
                        <el-form-item label="排序号">
                            <el-input type="number" v-model="dicCatalogForm.catalogIndex"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>-->
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="saveDicCatalog" :loading="addDicCatalogLoading">保存
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    export default {
        name: "FileClassificationSelected",
        props: {
            "tenantId": {required: false}, // 租户ID
            "multiple": {type: Boolean, required: false}, // 是否支持多选
            "source": {type: String, required: true}, // 来源： 0:平台;1:企业;2:私人
        },
        watch: {
            filterText(val) {
                this.$refs.dicCatalogTree.filter(val);
            }
        },
        data() {
            return {
                filterText: "",
                dicCatalogData: [],
                dicCatalogProps: {
                    label: 'name',
                    children: 'children'
                },
                dicTypeFormVisible: false,
                dicCatalogForm: {
                    name: '',
                    code: '',
                    typeCode: '',
                    parentId: '',
                    level: 1,
                    parentName: '',
                    catalogIndex: ''
                },
                dicCatalogFormRules: {
                    name: [{required: true, message: '请输入分类名称', trigger: 'blur'}],
                    //typeCode: [{required: true, message: '请输入类型编码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入分类编码', trigger: 'blur'}]
                },
                addDicCatalogLoading: false,
                dicCatalogFormVisible: false,
                display: 'none',
                checkedCatalog: [],
                catalogTitle: '新增分类'
            }
        },
        mounted() {
            this.listDicCatalog();
        },
        methods: {
            filterNode(value, data) {
                if (!value) return true;
                return data.name.indexOf(value) !== -1;
            },
            clearParentDicCatalog() {
                let _this = this;
                _this.dicCatalogForm.parentId = null;
                if (_this.dicCatalogForm.level > 1) {
                    _this.dicCatalogForm.level = _this.dicCatalogForm.level - 1;
                }
            },
            // 根据类型查询分类数据
            listDicCatalog() {
                let _this = this;
                _this.checkedCatalog = [];
                let param = {
                    tenantId: _this.tenantId,
                    source: _this.source
                };
                _this.dicCatalogData = [];
                _this.$Get(_this.khConfig.api.listFileClassification, param)
                    .then(res => {
                        if (res.children != null && res.children.length > 0) {
                            _this.dicCatalogData = res.children;
                        }
                    })
            },
            // 是否展开分类树
            displayTree() {
                if (this.display === 'none') {
                    this.display = 'block'
                } else if (this.display === 'block') {
                    this.display = 'none'
                }
            },
            // 选择上级
            selectDicCatalog(data) {
                let _this = this;
                if (data.level !== 3) {
                    _this.dicCatalogForm.level = data.level + 1;
                    _this.dicCatalogForm.parentId = data.id;
                    _this.dicCatalogForm.parentName = data.name;
                    _this.display = 'none';
                } else {
                    _this.$message.warning("此为三级分类 ,不能作为上级分类选择");
                    _this.display = 'block'
                }
            },
            // 显示分类的编辑界面
            handlerEditCatalog(data) {
                let _this = this;
                _this.dicCatalogFormVisible = true;
                _this.catalogTitle = '编辑分类';
                _this.dicCatalogForm = data;
                //_this.typeCode = data.typeCode;
            },
            // 显示新增分类页面
            handleAddDicCatalog() {
                let _this = this;
                _this.dicCatalogFormVisible = true;
                _this.catalogTitle = '新增分类';
                _this.dicCatalogForm = {
                    name: '',
                    parentId: '',
                    level: 1,
                    parentName: '',
                    catalogIndex: ''
                };
            },
            // 保存类型
            saveDicCatalog() {
                let _this = this;
                if (_this.dicCatalogForm.name === _this.dicCatalogForm.parentName) {
                    // 若父级分类选择了本身,则自行修正
                    _this.dicCatalogForm.parentName = "";
                    _this.dicCatalogForm.parentId = "";
                }
                _this.$refs.dicCatalogForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let url = '';
                            if (_this.KHUtils.isNull(_this.dicCatalogForm.id)) {
                                url = _this.khConfig.api.addFileClassification;
                            } else {
                                url = _this.khConfig.api.updateFileClassification;
                            }
                            _this.$Post(url, convertDicCatalogForm2Array(_this.dicCatalogForm, this))
                                .then(res => {
                                    _this.addDicCaLoading = true;
                                    _this.addDicCaLoading = false;
                                    _this.dicCatalogFormVisible = false;
                                    _this.listDicCatalog();
                                    if (res.errCode === 0) {
                                        _this.$message.success("保存成功");
                                    }
                                })
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
                
                function convertDicCatalogForm2Array(_form, _this) {
                    let paramArray = [];
                    if (!_this.KHUtils.isNull(_form.id)) {
                        paramArray.push("id=" + _form.id);
                    }
                    if (!_this.KHUtils.isNull(_this.tenantId)) {
                        paramArray.push("tenantId=" + _this.tenantId);
                    }
                    paramArray.push("source=" + _this.source);
                    paramArray.push("name=" + _form.name);
                    paramArray.push("code=" + _form.code);
                    paramArray.push("typeCode=classification");
                    if (!_this.KHUtils.isInvalidValue(_form.parentId)) {
                        paramArray.push("parentId=" + _form.parentId);
                    }
                    paramArray.push("level=" + _form.level);
                    if (!_this.KHUtils.isNull(_form.catalogIndex)) {
                        paramArray.push("catalogIndex=" + parseInt(_form.catalogIndex));
                    }
                    paramArray = paramArray.join("&");
                    return paramArray;
                }
            },
            // check 框选中的分类
            handleCheckChange(currentNode, checkedKeys) {
                let _this = this;
                // check框选中 Or 取消选中都会触发
                let checked = false;
                if (!_this.KHUtils.isNull(checkedKeys) && checkedKeys.checkedNodes instanceof Array) {
                    checkedKeys.checkedNodes.forEach(ck => {
                        if (ck.id === currentNode.id) {
                            // 选中状态
                            checked = true;
                        }
                    })
                }
                // 选中状态
                let tempObj = {};
                tempObj.name = currentNode.name;
                //tempObj.code = currentNode.code;
                tempObj.id = currentNode.id;
                tempObj.parentId = currentNode.parentId;
                if (_this.multiple) {
                    _this.checkedCatalog.push(tempObj);
                } else {
                    _this.checkedCatalog = [];
                    _this.checkedCatalog.push(tempObj);
                }
            },
            getCheckedNode() {
                return this.checkedCatalog;
            }
        }
    }
</script>
<style scoped>
    h3 {
        margin: 0;
    }
    
    h3 p {
        display: inline-block;
        margin: 0;
        padding: 0;
    }
    
    .custom-dic-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }
</style>
