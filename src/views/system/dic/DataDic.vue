<template>
    <div class="page-container">
            <el-row class="box-container">
                <el-col :span="12" class="left-box">
                    <h3 class="left-header">
                        <p style="color:#919191">字典类型</p>
                        <div>
                          <i @click="handleAddDicType" class="el-icon-plus" style="cursor: pointer;font-size:20px;margin-right:10px;"></i>
                          <i @click="deleteDicType" class="el-icon-close" style="cursor: pointer;font-size:20px;margin-right:10px;"></i>
                          <i @click="handleRename" class="el-icon-edit" style="cursor: pointer"></i>
                        </div>
                    </h3>
                    
                        <el-tree
                            :data="dicTypeData"
                            :props="dicTypeProps"
                            node-key="id"
                            accordion
                            highlight-current
                            default-expand-all
                            @node-click="switchDicType"
                            :expand-on-click-node="false"
                            class="tree-class">
                        </el-tree>
                    
                </el-col>
                <el-col :span="12" class="right-box">
                        <h3 class="right-header">
                            <div class="flex-class">{{currentDicType.typeName}}</div>
                            <div class="flex-class">
                                <i @click="handleAddDicCatalog" class="el-icon-plus" style="cursor: pointer;font-size:20px;margin-right:10px;"></i>
                                <i @click="handleDeleteDicCatalog" class="el-icon-close" style="cursor: pointer;font-size:20px;"></i>
                            </div>
                        </h3>
                        <el-tree
                            :data="dicCatalogData"
                            default-expand-all
                            node-key="id"
                            ref="tree"
                            highlight-current
                            :props="dicCatalogProps"
                            @node-click="handlerEditCatalog"
                            accordion
                            :expand-on-click-node="false"
                            show-checkbox
                            @check-change="handleCheckChange"
                            check-strictly
                            class="tree-class"
                        >
                        </el-tree>
                </el-col>
            </el-row>
            <el-dialog title="新增字典类型" :visible.sync="dicTypeFormVisible" :close-on-click-modal="closeOnClickModal"
                       class="custom-dic-dia">
                <el-form :model="dicTypeForm" label-width="80px" :rules="dicTypeFormRules" ref="dicTypeForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型名称" prop="typeName">
                                <el-input v-model="dicTypeForm.typeName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型编码" prop="typeCode">
                                <el-input v-model="dicTypeForm.typeCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="addDicType" :loading="addDicTypeLoading">保存</el-button>
                </div>
            </el-dialog>
            <el-dialog :title="catalogTitle" :visible.sync="dicCatalogFormVisible"
                       :close-on-click-modal="closeOnClickModal" class="custom-dic-dia">
                <el-form :model="dicCatalogForm" label-width="80px" :rules="dicCatalogFormRules" ref="dicCatalogForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类目名称" prop="name">
                                <el-input v-model="dicCatalogForm.name"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="字典类型">
                                <el-select v-model="typeCode" placeholder="可选择" value="" @change="changeDicCatalog">
                                    <el-option
                                        v-for="item in dicTypeData"
                                        :key="item.typeCode"
                                        :label="item.typeName"
                                        :value="item.typeCode">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类目编码" prop="code">
                                <el-input v-model="dicCatalogForm.code"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="父级类目">
                              <el-popover placement="bottom-start" width="100%"  v-model="popoverVisible" popper-class="popover-tree">
                                <el-input style="line-height: 30px;" v-model="dicCatalogForm.parentName"
                                          @clear="clearParentDicCatalog"
                                          clearable slot="reference">
                                </el-input>
                                <el-tree
                                    :data="dicCatalogData2"
                                    :props="dicCatalogProps"
                                    :style="{zIndex: 2}"
                                    node-key="id"
                                    accordion
                                    highlight-current
                                    @current-change="selectDicCatalog"
                                    default-expand-all
                                    :expand-on-click-node="false">
                                </el-tree>
                              </el-popover>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="排序号">
                                <el-input type="number" v-model="dicCatalogForm.catalogIndex"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="saveDicCatalog" :loading="addDicCatalogLoading">保存
                    </el-button>
                </div>
            </el-dialog>
            <el-dialog title="编辑字典类型" :visible.sync="renameFormVisible" :close-on-click-modal="closeOnClickModal"
                       class="custom-dic-dia">
                <el-form :model="dicTypeForm" label-width="120px" :rules="dicTypeFormRules" ref="dicTypeForm">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="类型名称" prop="typeName">
                                <el-input v-model="dicTypeForm.typeName"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型编码" prop="typeCode">
                                <el-input v-model="dicTypeForm.typeCode"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="rename" :loading="renameLoading">保存</el-button>
                </div>
            </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            let checkTypeCodeExists = (rule, value, callback) => {
                let _this = this;
                // 解决输入数字
                value = value + "";
                value = value.replace(/\s*/g, "");
                if (_this.editBeforeTypeCode === value) {
                    callback();
                }
                let data = {
                    typeCode: value
                };
                _this.$Get(_this.khConfig.api.checkDicType, data).then(res => {
                    if (res.errCode === 0 && res.count != null && res.count > 0) {
                        callback(new Error('字典类型编码已存在'));
                    } else if (res.errCode === 0 && res.count != null && res.count === 0) {
                        _this.dicTypeForm.typeCode = value;
                        callback();
                    } else {
                        callback(new Error('服务端错误'));
                    }
                }).catch(error => {
                    console.log("checkTypeCodeExists typeCode :" + error);
                    callback(new Error('服务端错误'));
                });
            };
            let checkTypeNameExists = (rule, value, callback) => {
                let _this = this;
                // 解决输入数字
                value = value + "";
                value = value.replace(/\s*/g, "");
                if (_this.editBeforeTypeName === value) {
                    callback();
                }
                let data = {
                    typeName: value
                };
                _this.$Get(_this.khConfig.api.checkDicType, data).then(res => {
                    if (res.errCode === 0 && res.count != null && res.count > 0) {
                        callback(new Error('字典类型名称已存在'));
                    } else if (res.errCode === 0 && res.count != null && res.count === 0) {
                        _this.dicTypeForm.typeName = value;
                        callback();
                    } else {
                        callback(new Error('服务端错误'));
                    }
                }).catch(error => {
                    console.log("checkTypeNameExists typeName :" + error);
                    callback(new Error('服务端错误'));
                });
            };
            return {
              	tenantValue: null,
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                editBeforeTypeName: '',
                editBeforeTypeCode: '',
                renameFormVisible: false,
                renameLoading: false,
                currentDicType: {
                    typeName: '',
                    typeCode: '',
                    id: ''
                },
                dicTypeData: [],
                dicCatalogData: [],
                dicCatalogData2: [],
                dicTypeProps: {
                    label: 'typeName',
                    children: 'children'
                },
                dicCatalogProps: {
                    label: 'name',
                    children: 'children'
                },
                dicTypeForm: {
                    typeName: '',
                    typeCode: ''
                },
                dicTypeFormRules: {
                    typeName: [
                        {required: true, message: '请输入类型名称', trigger: 'blur'},
                        {validator: checkTypeNameExists, trigger: 'blur'}
                    ],
                    typeCode: [
                        {required: true, message: '请输入类型编码', trigger: 'blur'},
                        {validator: checkTypeCodeExists, trigger: 'blur'}
                    ]
                },
                addDicTypeLoading: false,
                dicTypeFormVisible: false,
                typeCode: '',
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
                    name: [{required: true, message: '请输入类目名称', trigger: 'blur'}],
                    typeCode: [{required: true, message: '请输入类型编码', trigger: 'blur'}],
                    code: [{required: true, message: '请输入类目编码', trigger: 'blur'}]
                },
                addDicCatalogLoading: false,
                dicCatalogFormVisible: false,
                popoverVisible:false,
                delDicCatalogArray: [],
                catalogTitle: '新增类目'
            }
        },
        mounted() {
            let _this = this;
            _this.listDicType()
        },
        methods: {
            clearParentDicCatalog() {
                let _this = this;
                _this.dicCatalogForm.parentId = null;
                if (_this.dicCatalogForm.level > 1) {
                    _this.dicCatalogForm.level = _this.dicCatalogForm.level - 1;
                }
            },
            // 显示重命名的界面
            handleRename() {
                let _this = this;
                _this.renameFormVisible = true;
                _this.dicTypeForm = _this.currentDicType;
                _this.editBeforeTypeCode = _this.currentDicType.typeCode;
                _this.editBeforeTypeName = _this.currentDicType.typeName;
            },
            // 重命名
            rename() {
                let _this = this;
                _this.$refs.dicTypeForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            _this.renameLoading = true;
                            let paramArray = [];
                            paramArray.push("id=" + _this.currentDicType.id);
                            if (!_this.KHUtils.isInvalidValue(_this.dicTypeForm.typeName)) {
                                paramArray.push("typeName=" + _this.dicTypeForm.typeName);
                            }
                            if (!_this.KHUtils.isInvalidValue(_this.dicTypeForm.typeCode)) {
                                paramArray.push("typeCode=" + _this.dicTypeForm.typeCode);
                            }
                            paramArray = paramArray.join("&");
                            _this.$Post(_this.khConfig.api.updateDicType, paramArray)
                                .then(res => {
                                    _this.renameLoading = false;
                                    _this.renameFormVisible = false;
                                    if (0 === res.errorCode) {
                                        _this.listDicType();
                                        _this.$notify({
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
            // 查询所有字典类型
            listDicType() {
                let _this = this;
                _this.dicCatalogData = [];
                _this.$Get(_this.khConfig.api.listDicType,{tenantId: _this.tenantValue})
                    .then(res => {
                        if (res.list != null && res.list.length > 0) {
                            _this.dicTypeData = res.list;
                            if (_this.KHUtils.isNull(_this.currentDicType.typeCode)) {
                                _this.currentDicType = _this.dicTypeData[0];
                            }
                            _this.listDicCatalog(_this.currentDicType.typeCode);
                        } else {
                            _this.dicTypeData = [];
                            _this.currentDicType = {};
                        }
                    })
            },
            // 根据字典类型查询字典类目数据
            listDicCatalog(typeCode) {
                let _this = this;
                let param = {
                    typeCode: typeCode
                };
                // _this.dicCatalogData = [];
                if(!_this.dicCatalogFormVisible){
                    _this.dicCatalogData = [];
                }
                _this.$Get(_this.khConfig.api.listDicCatalog, param)
                    .then(res => {
                        if (res.children != null && res.children.length > 0) {
                            // _this.dicCatalogData = res.children;
                            if(_this.dicCatalogFormVisible){
                              _this.dicCatalogData2 = res.children;
                            }else{
                              _this.dicCatalogData = res.children;
                            }
                        }
                    })
            },
            // 切换不同角色组查询功能权限
            switchDicType(data) {
                let _this = this;
                _this.currentDicType = data;
                _this.listDicCatalog(_this.currentDicType.typeCode);
            },
            // 显示新增字典类型页面
            handleAddDicType() {
                let _this = this;
                _this.dicTypeFormVisible = true;
                _this.dicTypeForm = {
                    typeName: '',
                    typeCode: ''
                };
            },
            // 新增字典类型
            addDicType() {
                let _this = this;
                _this.$refs.dicTypeForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            _this.$Post(_this.khConfig.api.addDicType, _this.convertDicTypeForm2Array(_this.dicTypeForm))
                                .then(res => {
                                    _this.addDicTypeLoading = true;
                                    _this.addDicTypeLoading = false;
                                    _this.dicTypeFormVisible = false;
                                    if (res.errCode === 0) {
                                        _this.listDicType();
                                        _this.$notify({
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
            // 删除字典类型
            deleteDicType() {
                let _this = this;
                if (_this.dicCatalogData.length > 0) {
                    _this.$notify({
                        title: '警告',
                        message: '所选择要删除的' + _this.currentDicType.typeName + '字典类型下有类目,若必须要删除,请先删除其字典类目再进行操作',
                        type: 'warning'
                    });
                } else {
                    _this.$confirm('确认删除' + _this.currentDicType.typeName + '字典类型吗?', '提示', {}).then(() => {
                        let param = {
                            ids: _this.currentDicType.id
                        };
                        _this.$Get(_this.khConfig.api.deleteDicType, param)
                            .then(res => {
                                if (res.errCode === 0) {
                                    _this.$notify({
                                        title: '成功',
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    _this.listDicType();
                                }
                            })
                    }).catch(error => {
                        console.log("deleteDicType : " + error);
                    });
                }
            },
            // 改变字典类型
            changeDicCatalog() {
                let _this = this;
                _this.dicCatalogForm.parentId = '';
                _this.dicCatalogForm.parentName = '';
                _this.dicCatalogForm.typeCode = _this.typeCode;
                _this.listDicCatalog(_this.typeCode);
            },
            // 选择上级
            selectDicCatalog(data) {
                let _this = this;
                if (data.level !== 3) {
                    _this.dicCatalogForm.level = data.level + 1;
                    _this.dicCatalogForm.parentId = data.id;
                    _this.dicCatalogForm.parentName = data.name;
                    _this.popoverVisible = false;
                } else {
                    _this.$notify({
                        title: '温馨提示',
                        message: '此为三级类目 ,不能作为上级类目选择',
                        type: 'warning'
                    });
                }
            },
            // 显示字典类目的编辑界面
            handlerEditCatalog(data) {
                let _this = this;
                _this.dicCatalogFormVisible = true;
                _this.catalogTitle = '编辑类目';
                _this.dicCatalogForm = data;
                _this.typeCode = data.typeCode;
                //显示新增或编辑页面时，先将外部字典数据同步给内部的字典数据
                // 以前版本内外使用同一个dicCatalogData所以不存在这个问题
                _this.dicCatalogData2 = _this.dicCatalogData;
            },
            // 显示新增字典类目页面
            handleAddDicCatalog() {
                let _this = this;
                _this.dicCatalogFormVisible = true;
                _this.catalogTitle = '新增类目';
                _this.dicCatalogForm = {
                    name: '',
                    parentId: '',
                    level: 1,
                    parentName: '',
                    catalogIndex: ''
                };
                if (!_this.KHUtils.isNull(_this.currentDicType.typeCode)) {
                    _this.dicCatalogForm.typeCode = _this.currentDicType.typeCode;
                    _this.typeCode = _this.currentDicType.typeCode;
                    //显示新增或编辑页面时，先将外部字典数据同步给内部的字典数据
                    // 以前版本内外使用同一个dicCatalogData所以不存在这个问题
                    _this.dicCatalogData2 = _this.dicCatalogData;
                }
            },
            // 保存字典类型
            saveDicCatalog() {
                let _this = this;
                if (_this.dicCatalogForm.name === _this.dicCatalogForm.parentName) {
                    // 若父级类目选择了本身,则自行修正
                    _this.dicCatalogForm.parentName = "";
                    _this.dicCatalogForm.parentId = "";
                }
                _this.$refs.dicCatalogForm.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            let url = '';
                            if (_this.KHUtils.isNull(_this.dicCatalogForm.id)) {
                                url = _this.khConfig.api.addDicCatalog;
                            } else {
                                url = _this.khConfig.api.updateDicCatalog;
                            }
                            console.log(JSON.stringify(_this.convertDicCatalogForm2Array(_this.dicCatalogForm)));
                            _this.$Post(url, _this.convertDicCatalogForm2Array(_this.dicCatalogForm))
                                .then(res => {
                                    _this.addDicCaLoading = true;
                                    _this.addDicCaLoading = false;
                                    _this.dicCatalogFormVisible = false;
                                    if (res.errCode === 0) {
                                        _this.listDicType();
                                        _this.$notify({
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
            // check 框选中需要删除的字典类目
            handleCheckChange(data, checked) {
                let _this = this;
                if (checked) {
                    if (data.children != null && data.children.length > 0) {
                        // 含有子类目的不允许删除
                        _this.$notify({
                            title: '警告',
                            message: '所选择要删除的' + data.name + '中含有子类目,若必须要删除,请先删除其子类目再进行操作',
                            type: 'warning'
                        });
                        return;
                    }
                    _this.delDicCatalogArray.push(data);
                } else {
                    let length = _this.delDicCatalogArray.length;
                    for (var i = 0; i < length; i++) {
                        if (_this.delDicCatalogArray[i].id === data.id) {
                            _this.delDicCatalogArray.splice(i, 1); //删除下标为i的元素
                        }
                    }
                }
            },
            // 批量删除字典类目
            handleDeleteDicCatalog() {
                let _this = this;
                if (_this.delDicCatalogArray == null || _this.delDicCatalogArray.length === 0) {
                    _this.$notify({
                        title: '警告',
                        message: '请选择要删除的记录',
                        type: 'warning'
                    });
                } else {
                    _this.$confirm('确认删除勾选的这些记录吗?', '提示', {}).then(() => {
                        let ids = '';
                        let length = _this.delDicCatalogArray.length;
                        for (var i = 0; i < length; i++) {
                            ids += _this.delDicCatalogArray[i].id + ",";
                        }
                        let param = {
                            ids: ids
                        };
                        _this.$Get(_this.khConfig.api.deleteDicCatalog, param)
                            .then(res => {
                                if (res.errCode === 0) {
                                    _this.$notify({
                                        title: '成功',
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                    _this.listDicType();
                                }
                            })
                    }).catch(error => {
                        console.log("deleteDicCatalog : " + error);
                    });
                }
            },
            // form提交参数处理
            convertDicTypeForm2Array(_form) {
                let paramArray = [];
                paramArray.push("typeName=" + _form.typeName);
                paramArray.push("typeCode=" + _form.typeCode);
                paramArray = paramArray.join("&");
                return paramArray;
            },
            convertDicCatalogForm2Array(_form) {
                let _this = this;
                let paramArray = [];
                if (!_this.KHUtils.isNull(_form.id)) {
                    paramArray.push("id=" + _form.id);
                }
                paramArray.push("name=" + _form.name);
                paramArray.push("code=" + _form.code);
                paramArray.push("typeCode=" + _form.typeCode);
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
        }
    }
</script>
<style scoped lang="scss">
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

    .tree-class{
        overflow:auto;
        height: 659px;

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
                    padding:13px 23px;
                    font-size:16px;
                    font-weight:800;
                    display:flex;
                    justify-content:space-between;
                }
            }
        }
    }
</style>
