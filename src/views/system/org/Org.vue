<template>
    <div class="Org" style="padding:15px; height:100%;">
        <el-row :gutter="20" style="height:100%">
            <el-col :span="4" style="height:100%;">
                <Tree class="orgTreeClass"></Tree>
            </el-col>
            <el-col :span="20" style="position: relative;">
                <el-row style="margin: 10px 0 20px 10px;display:flex;justify-content:end;">
                    <span class="header-title">{{currentNodeData.orgName}}</span>
                    <i @click="handleRename" class="el-icon-edit"
                            style="cursor: pointer;margin: 5px auto 0 5px;flex:1"></i>
                    <el-button @click="handleAdd" type="primary"  >新增</el-button>
                    <el-button @click="handleDeleteMulti" :loading="delLoading" type="danger" >删除</el-button>
                </el-row>
                <el-row>
                    <el-col :span="24">
                        <el-table
                            :data="tableData"
                            highlight-current-row
                            @selection-change="handleSelectionChange"
                            border
                            stripe
                            max-height="650"
                            style="width: 100%;"
                            @row-click="handleEdit"
                            :header-cell-style="{background:'#eaf1f7',color:'#606266'}"
                        >
                            <el-table-column type="selection" width="55" prop="id"  align="center">
                            </el-table-column>
                            <el-table-column prop="orgName" label="组织名称" width="180"  show-overflow-tooltip align="center">
                                <!--           <template slot-scope="scope">
                                            <a href="javascript:void(0)" @click="handleEdit(scope.row)">{{scope.row.orgName}}</a>
                                        </template>-->
                            </el-table-column>
                            <el-table-column prop="orgCode" label="组织编码"  show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="parentOrgName" label="上级组织" show-overflow-tooltip align="center">
                            </el-table-column>
                            <el-table-column prop="level" label="级别" 
                                            :formatter="this.KHUtils.formatLevel" align="center">
                            </el-table-column>
                            <el-table-column prop="orgIndex" label="排序号"  align="center">
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <el-dialog :title="formTitle" :visible.sync="editFormVisible" :close-on-click-modal="closeOnClickModal"
                        class="custom-org-dia">
                    <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm"
                            class="demo-form-inline">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="组织名称" prop="orgName">
                                    <el-input v-model.number="editForm.orgName"
                                    ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="组织编码" prop="orgCode">
                                    <el-input v-model="editForm.orgCode"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="上级组织">
                                <el-popover placement="bottom-start" width="100%"  v-model="popoverVisible" popper-class="popover-tree">
                                    <el-input style="line-height: 30px;" v-model="editForm.parentOrgName"
                                            clearable slot="reference">
                                        {{editForm.parentOrgName}}
                                    </el-input>
                                    <el-tree
                                        :data="treeData"
                                        :props="props"
                                        :style="{zIndex: 2}"
                                        node-key="id"
                                        accordion
                                        highlight-current
                                        @current-change="selectDepartment"
                                        default-expand-all
                                        :expand-on-click-node="false">
                                    </el-tree>
                                </el-popover>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="排序号" prop="orgIndex">
                                    <el-input v-model="editForm.orgIndex"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="24">
                                <el-form-item label="组织描述" prop="orgDesc">
                                    <el-input v-model="editForm.orgDesc" type="textarea"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存
                        </el-button>
                    </div>
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
                        <el-row>
                            <el-col :span="1">&nbsp;</el-col>
                            <el-col :span="22">
                                <el-form-item label="设置主管" prop="orgLeaderId">
                                    <el-select v-model="renameForm.orgLeaderId" placeholder="请选择">
                                        <el-option
                                            v-for="user in orgUserList"
                                            :key="user.id"
                                            :label="user.realName"
                                            :value="user.id">
                                        </el-option>
                                    </el-select>
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
    </div>
</template>

<script type="es6">
    import Tree from '@/components/tree/OrgTree.vue'
    import {mapActions, mapGetters,mapMutations} from 'vuex'

    export default {
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
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                renameForm: {
                    orgName: '',
                    orgLeaderId:null
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
                popoverVisible:false,
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
                delLoading: false,
                orgUserList:[],
            }
        },
        watch: {
            deptNode() {
                this.init();
            }
        },
        components: {
            Tree
        },
        computed: mapGetters({
            treeData: 'getDeptTree',
            deptNode: 'getDeptNode'
        }),
        mounted() {
            this.listOrgTreeHttp()
            
        },
        methods: {
            ...mapActions({
                getDeptTree: 'getDeptTree'
                
            }),
            ...mapMutations({
                SET_DEPT_TREE:"SET_DEPT_TREE",
                SET_DEPT_NODE:"SET_DEPT_NODE"
            }),
            async listOrgTreeHttp() {
                const { listOrgTree } = this.khConfig.api;
                let res = await this.$Get(listOrgTree);
                if (res.errCode === 0 && res.departManage != null) {
                    let tree = res.departManage;
                    let deptNode;
                    if (tree != null) {
                        if (tree.length === 1) {
                            deptNode = tree[0]
                        } else {
                            deptNode = tree.children[0]
                        }
                    }
                    this.SET_DEPT_TREE(tree)
                    this.SET_DEPT_NODE(deptNode)
                    this.init()
                }
            },
            // 默认初始化
            init() {
                let _this = this;
                if (_this.deptNode != null) {
                    _this.currentNodeData = _this.KHUtils.clone(_this.deptNode);
                    if (_this.deptNode.children === undefined) {
                        _this.tableData = [_this.KHUtils.clone(_this.deptNode)];
                    } else {
                        _this.tableData = _this.KHUtils.isNull(_this.deptNode.children) ? [] : _this.KHUtils.clone(_this.deptNode.children);
                    }
                }

            },
            // 选择上级组织
            selectDepartment(data, node, self) {
                let _this = this;
                if (data.level !== 3) {
                    if (_this.KHUtils.isNull(data.level)) {
                        _this.editForm.level = 1
                    } else {
                        _this.editForm.level = data.level + 1
                    }
                    _this.editForm.parentId = data.id;
                    _this.editForm.parentOrgName = data.orgName;
                    _this.popoverVisible = false;
                } else {
                    _this.$notify({
                        title: '温馨提示',
                        message: '此为三级组织 ,不能作为上级组织选择',
                        type: 'warning'
                    });
                }
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
                            _this.listOrgTreeHttp({cacheUpdate: true});
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
            // 删除前检查组织下是否有用户关联
            checkOrgRelUser(orgId, orgName) {
                let _this = this;
                let param = {
                    ids: orgId
                };
                _this.$Get(_this.khConfig.api.listUserRelOrgByOrgId, param)
                    .then(res => {
                        if (res.errCode === 0 && res.list != null && res.list.length > 0) {
                            _this.$notify({
                                title: '警告',
                                message: '所选择要删除的' + orgName + '组织与用户有关联关系,若必须要删除,请先删除其子组织的用户再进行操作',
                                type: 'warning'
                            });
                            _this.allowDel = false;
                        } else if (res.errCode === 0 && res.list != null && res.list.length === 0) {
                            _this.allowDel = true;
                        }
                    })
            },
            // 显示编辑页面
            handleEdit(row) {
                let _this = this;
                _this.isAddOrEdit = false;
                _this.editFormVisible = true;
                _this.formTitle = '编辑';
                _this.editForm = row;
                _this.editOrgName = _this.editForm.orgName;
            },
            // 显示新增界面
            handleAdd() {
                let _this = this;
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
                                        _this.listOrgTreeHttp({cacheUpdate: true});
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
           async handleRename() {
                let _this = this;
                _this.orgUserList = [];
                _this.renameFormVisible = true;
                _this.renameForm.orgName = _this.currentNodeData.orgName;
                _this.renameForm.orgLeaderId = _this.currentNodeData.orgLeaderId;
                let params = {
                    orgId: _this.currentNodeData.id,
                };
                const { listUserByOrgId } = this.khConfig.api;

                let res = await this.$Get(listUserByOrgId, params);
                if(res.errCode == 0){
                    _this.orgUserList = res.list;
                }

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
                            paramArray.push("orgLeaderId=" + _this.renameForm.orgLeaderId);
                            paramArray = paramArray.join("&");
                            _this.$Post(_this.khConfig.api.updateOrg, paramArray)
                                .then(res => {
                                    _this.renameLoading = false;
                                    if (res.errCode === 0) {
                                        _this.currentNodeData.orgName = _this.renameForm.orgName;
                                        _this.listOrgTreeHttp({cacheUpdate: true});
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
        }
    }
</script>
<style lang="scss" scoped>
    .custom-org-dia ::v-deep .el-dialog__body {
        padding: 20px 20px;
    }

    ::v-deep .el-table{
          .el-table__header-wrapper{
          font-size:13px;
          font-weight: 600;
        }
     }

     .header-title {
      font-weight: bolder;
      color: #3a3b3f;
      position: relative;
      margin-right: auto;
      margin-top: 5px;

      &::before {
        content: "";
        display: block;
        height: 17px;
        border-right: 3px solid #3581fb;
        position: absolute;
        left: -10px;

      }
    }

    .orgTreeClass{
      ::v-deep .el-input{
        padding:10px 10px 0 10px;
      }
      ::v-deep .el-tree{
        padding:10px;
        height: calc(100% - 60px);
        overflow: auto;
      }
    }
</style>

