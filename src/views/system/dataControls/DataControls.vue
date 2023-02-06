<template>
    <el-row>
        <el-col :span="18" style="position: relative;bottom: -8px;left: 2%">
            
            <el-row style="margin: 10px 0 10px 0">
                <el-button @click="addDataControls">新增</el-button>
                <el-button @click="deleteDataControls" :loading="delLoading">删除</el-button>
            </el-row>
            <!--列表-->
            <el-row>
                <el-col :span="24">
                    <el-table
                        :data="tableData"
                        @selection-change="handleSelectionChange"
                        highlight-current-row
                        border
                        stripe
                        v-loading="listLoading"
                        @row-click="handleEdit"
                    >
                        <el-table-column type="selection" prop="id" align="center">
                        </el-table-column>
                        <el-table-column prop="id" label="模块编号" align="center">
                            <!--                         <template slot-scope="scope">
                                                         <a href="javascript:void(0)" @click="handleEdit(scope.row)">{{scope.row.id}}</a>
                                                     </template>-->
                        </el-table-column>
                        <el-table-column prop="title" label="模块标题" align="center">
                        </el-table-column>
                        <el-table-column prop="valueKey" label="value属性字段" align="center">
                        </el-table-column>
                        <el-table-column prop="valueDesc" label="value属性字段含义" align="center">
                        </el-table-column>
                        <el-table-column prop="labelKey" label="label属性字段" align="center">
                        </el-table-column>
                        <el-table-column prop="labelDesc" label="Label属性字段含义" align="center">
                        </el-table-column>
                        <el-table-column prop="url" label="数据请求地址" align="center">
                        </el-table-column>
                        <el-table-column prop="type" label="类型" align="center">
                            <template slot-scope="scope">
                                {{typeName(scope.row.type)}}
                            </template>
                        </el-table-column>
                    </el-table>
                </el-col>
            </el-row>
            <!--编辑界面-->
            <el-dialog :title="dialogTitle" :visible.sync="dialogVisible" :close-on-click-modal="closeOnClickModal"
                       class="custom-data-dia">
                <el-form :model="dataControls" label-width="150px" ref="dataControls" :rules="editFormRules">
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="模块标题" prop="title">
                                <el-input v-model="dataControls.title"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="类型" prop="type">
                                <el-select v-model="dataControls.type" placeholder="请选择">
                                    <el-option
                                        v-for="item in typeData"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value">
                                    </el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                    
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="value属性字段" prop="valueKey">
                                <el-input v-model="dataControls.valueKey"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="value属性字段含义" prop="valueDesc">
                                <el-input v-model="dataControls.valueDesc"></el-input>
                            </el-form-item>
                        </el-col>
                    
                    </el-row>
                    <el-row>
                        <el-col :span="12">
                            <el-form-item label="label属性字段" prop="labelKey">
                                <el-input v-model="dataControls.labelKey"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="Label属性字段含义" prop="labelDesc">
                                <el-input v-model="dataControls.labelDesc"></el-input>
                            </el-form-item>
                        </el-col>
                    
                    </el-row>
                    <el-row>
                        <el-col :span="24">
                            <el-form-item label="数据请求地址" prop="url">
                                <el-input v-model="dataControls.url"
                                          type="textarea"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :span="24" style="margin-left: 40px;padding-bottom: 10px"
                            v-for="(column,key) in dataControls.columns" :key="key">
                        <el-col :span="3">
                            <el-input v-model="column.model" placeholder="字段名称"></el-input>
                        </el-col>
                        <el-col :span="3" style="margin-left: 10px">
                            <el-input v-model="column.name" placeholder="字段描述"></el-input>
                        </el-col>
                        <el-col :span="1" style="margin-left: 10px">
                            <el-button type="danger" icon="el-icon-delete" @click="deleteColumns(key)"
                                       circle></el-button>
                        </el-col>
                    </el-row>
                    <el-row style="margin-left: 40px;margin-top: 10px">
                        <el-link type="primary" @click="addColumns">添加映射</el-link>
                    </el-row>
                    <el-row>
                    </el-row>
                </el-form>
                <div slot="footer" class="dialog-footer">
                    <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存
                    </el-button>
                </div>
            </el-dialog>
        </el-col>
    </el-row>
</template>

<script>
    
    export default {
        components: {},
        data() {
            return {
                delLoading: false,
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                listLoading: false,
                editLoading: false,
                delLoading: false,
                //新增还是编辑 true:新增 false：编辑
                isAddOrEdit: false,
                tableData: [],
                dataControls: {
                    "title": "",
                    "valueKey": "",
                    "valueDesc": "",
                    "labelKey": "",
                    "labelDesc": "",
                    "url": "",
                    "type": "0",
                    "columns": [],
                    
                },
                dialogTitle: "",
                //编辑新增dialog是否显示
                dialogVisible: false,
                //要删除的数据集合
                multipleSelection: [],
                editFormRules: {
                    title: [
                        {required: true, message: '请输入模块标题', trigger: 'blur'}
                    ],
                    valueKey: [
                        {required: true, message: '请输入value属性字段', trigger: 'blur'}
                    ],
                    valueDesc: [
                        {required: true, message: '请输入value属性字段含义', trigger: 'blur'}
                    ],
                    labelKey: [
                        {required: true, message: '请输入label属性字段', trigger: 'blur'}
                    ],
                    labelDesc: [
                        {required: true, message: '请输入Label属性字段含义', trigger: 'blur'}
                    ],
                    url: [
                        {required: true, message: '请输入数据请求地址', trigger: 'blur'}
                    ],
                    type: [
                        {required: true, message: '请选择类型', trigger: 'blur'}
                    ]
                },
                typeData: [
                    {
                        value: '0',
                        label: '自定义高级控件'
                    }, {
                        value: '1',
                        label: '非自定义高级控件'
                    }
                ],
                
            }
        },
        mounted() {
            this.init()
        },
        methods: {
            init() {
                this.loading = true;
                this.$Get(this.khConfig.api.queryAllDataControls)
                    .then(res => {
                        if (res.errCode === 0) {
                            this.tableData = res.datas;
                        }
                        this.listLoading = false;
                    })
            },
            handleEdit(row) {
                console.log("---" + JSON.stringify(row))
                this.dialogVisible = true;
                this.dialogTitle = "编辑";
                this.isAddOrEdit = false;
                this.dataControls = row;
            },
            addDataControls() {
                this.dialogVisible = true;
                this.dialogTitle = "新增";
                this.isAddOrEdit = true;
                this.dataControls = {
                    "title": "",
                    "valueKey": "",
                    "valueDesc": "",
                    "labelKey": "",
                    "labelDesc": "",
                    "url": "",
                    "type": "0",
                    "columns": [],
                    
                };
            },
            handleSelectionChange(array) {
                this.multipleSelection = array;
            },
            
            // 删除选中的多条记录
            deleteDataControls() {
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
                _this.$Get(_this.khConfig.api.deleteDataControls, param)
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
            //保存
            editSubmit() {
                this.$refs.dataControls.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            this.editLoading = true;
                            let url;
                            let paramArray = [];
                            if (this.isAddOrEdit) {
                                url = this.khConfig.api.addDataControls;
                            } else {
                                url = this.khConfig.api.updateDataControls;
                                if (!this.KHUtils.isInvalidValue(this.dataControls.id)) {
                                    paramArray.push("id=" + this.dataControls.id);
                                }
                                
                            }
                            
                            if (!this.KHUtils.isInvalidValue(this.dataControls.title)) {
                                paramArray.push("title=" + this.dataControls.title);
                            }
                            if (!this.KHUtils.isInvalidValue(this.dataControls.valueKey)) {
                                paramArray.push("valueKey=" + this.dataControls.valueKey);
                            }
                            if (!this.KHUtils.isInvalidValue(this.dataControls.valueDesc)) {
                                paramArray.push("valueDesc=" + this.dataControls.valueDesc);
                            }
                            if (!this.KHUtils.isInvalidValue(this.dataControls.labelKey)) {
                                paramArray.push("labelKey=" + this.dataControls.labelKey);
                            }
                            if (!this.KHUtils.isInvalidValue(this.dataControls.labelDesc)) {
                                paramArray.push("labelDesc=" + this.dataControls.labelDesc);
                            }
                            if (!this.KHUtils.isInvalidValue(this.dataControls.url)) {
                                paramArray.push("url=" + this.dataControls.url);
                            }
                            if (!this.KHUtils.isInvalidValue(this.dataControls.type)) {
                                paramArray.push("type=" + this.dataControls.type);
                            }
                            if (this.dataControls.columns != null && this.dataControls.columns.length > 0) {
                                for (var i = 0; i < this.dataControls.columns.length; i++) {
                                    let item = this.dataControls.columns[i];
                                    if (this.KHUtils.isNull(item.model) && this.KHUtils.isNull(item.name)) {
                                        continue;
                                    }
                                    paramArray.push("columns[" + i + "].model=" + item.model);
                                    paramArray.push("columns[" + i + "].name=" + item.name);
                                }
                                
                            }
                            paramArray = paramArray.join("&");
                            this.$Post(url, paramArray)
                                .then(res => {
                                    this.editLoading = false;
                                    this.dialogVisible = false;
                                    if (res.errCode === 0) {
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
            //删除映射
            deleteColumns(key) {
                this.dataControls.columns.splice(key, 1);
            },
            addColumns() {
                if (this.dataControls.columns == null) {
                    this.dataControls.columns = [];
                }
                let obj = {};
                obj.name = "";
                obj.model = "";
                this.dataControls.columns.push(obj);
            }
        },
        computed: {
            typeName: function () {
                return function (value) {
                    console.log("--" + value);
                    var name;
                    switch (value) {
                        case "0":
                            name = "自定义高级控件";
                            break;
                        case  "1":
                            name = "非自定义高级控件";
                            break;
                    }
                    return name;
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    .custom-data-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }
</style>
