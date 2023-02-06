<template>
    <div class="Menu" style="padding:15px; height:100%;">
        <el-row :gutter="20" style="height:100%;">
            <!--左边树结构-->
            <el-col :span="4" style="height:100%;">
                <div class="el-input">
                    <input type="text"
                        v-model="filterText"
                        autocomplete="off"
                        placeholder="输入菜单名称进行搜索"
                        class="el-input__inner" style="width: 100%;">
                </div>
                <el-tree
                    :data="menuTree"
                    :props="props"
                    node-key="id"
                    accordion
                    ref="menuTreeRef"
                    highlight-current
                    :filter-node-method="filterNode"
                    @node-click="handleNodeClick"
                    v-loading.body="listLoading"
                    class="tree-no-border"
                    style="overflow:auto;height:calc(100% - 50px);margin-top:10px;"
                    :default-expanded-keys="defaultExpandTreeIds"
                    @node-expand="handleNodeExpand" 
                    @node-collapse="handleNodeCollapse" 
                    >
                </el-tree>
            </el-col>
            <el-col :span="20" style="position: relative;">
                <el-row style="margin:0 0 20px 10px;display:flex;justify-content:end">
                
                    <span class="header-title">当前菜单：{{currentNodeData.menuName}}</span>
                    <el-button @click="handleAdd" type="primary" >新增</el-button>
                    <el-button @click="handleDeleteMulti" :loading="delLoading" type="danger" >删除</el-button>
                
                </el-row>
                <!-- <el-row style="margin: 10px 0 10px 0;display:flex;justify-content:end;">
                </el-row> -->
                <!--列表-->
                <el-row>
                    <el-col :span="24">
                        <el-table
                            ref="multipleTable"
                            :data="tableData"
                            @selection-change="handleSelectionChange"
                            highlight-current-row
                            max-height="650"
                            border
                            stripe
                            v-loading="listLoading"
                            :header-cell-style="{background:'#eaf1f7',color:'#606266'}"
                        >
                            <el-table-column type="selection" prop="id" align="center">
                            </el-table-column>
                            <el-table-column prop="id" label="菜单编号" align="center">
                            </el-table-column>
                            <el-table-column prop="menuName" label="菜单名称" align="center">
                            </el-table-column>
                            <el-table-column prop="parentMenuName" label="上级菜单" align="center">
                            </el-table-column>
                            <el-table-column prop="level" label="菜单等级" align="center">
                            </el-table-column>
                            <el-table-column prop="menuUrl" label="路由地址" align="center" show-overflow-tooltip>
                            </el-table-column>
                            <el-table-column prop="orderIndex" label="排序号" align="center">
                            </el-table-column>
                            <el-table-column prop="showType" label="显示端" align="center">
                            <template slot-scope="scope" >
                                {{optNamesMap.get(scope.row.showType)}}
                                </template>
                            </el-table-column>
                            <el-table-column prop="iconName" label="菜单图标" align="center">
                                <template slot-scope="scope" >
                                <el-image v-if="scope.row.iconUpload"  class="update-icon" :src="scope.row.iconUpload | KHImg" fit="cover">
                                    </el-image>
                                    <el-button v-else type="primary" class="update-icon" :style="iconStyle(scope.row)">
                                        <i :class="iconClassObject(scope.row)" style="color: white;font-size: 20px"></i>
                                    </el-button>
                                </template>
                            </el-table-column>
                            <el-table-column prop="orderIndex" label="操作" align="center" width="150px">
                            <template slot-scope="scope" >
                                <el-button type="primary" size="mini" @click="handleEdit(scope.row)" >编辑</el-button>
                                <el-button type="danger" size="mini"  @click="batchDel([scope.row])" >删除</el-button>
                            </template>
                            </el-table-column>
                        </el-table>
                    </el-col>
                </el-row>
                <!--编辑界面-->
                <el-dialog :title="editFormTitle" v-if="editFormVisible" :visible.sync="editFormVisible" :close-on-click-modal="closeOnClickModal"
                        class="custom-menu-dia">
                    <el-form :model="editForm" label-width="120px" :rules="editFormRules" ref="editForm">
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="菜单名称" prop="menuName">
                                    <el-input v-model="editForm.menuName"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="上级菜单" prop="parentMenuName">
                                <el-popover placement="bottom-start" width="100%"  v-model="popoverVisible" popper-class="popover-tree">
                                    <el-input style="line-height: 30px;" v-model="editForm.parentMenuName"
                                            clearable slot="reference" @clear="clearParent">
                                    </el-input>
                                    <el-tree
                                        :data="menuTree"
                                        :props="props"
                                        :style="{zIndex: 2}"
                                        node-key="id"
                                        accordion
                                        highlight-current
                                        @node-click="selectParentMenu"
                                        :expand-on-click-node="false"
                                        ref="tree">
                                    </el-tree>
                                </el-popover>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="路由地址" prop="menuUrl">
                                    <el-input v-model="editForm.menuUrl" ></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="12">
                                <el-form-item label="组件名称" prop="component">
                                    <el-input v-model="editForm.component"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row>
                            <el-col :span="12">
                                <el-form-item label="排序号" prop="orderIndex">
                                    <el-input v-model="editForm.orderIndex"></el-input>
                                </el-form-item>
                            </el-col>
                            <el-col :span="4">
                                <el-form-item label="是否显示">
                                    <el-switch
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
                                    <el-input v-model="editForm.serverUrl"
                                            type="textarea" :disabled="!isAddOrEdit"></el-input>
                                </el-form-item>
                            </el-col>
                        </el-row>
                        <el-row v-if="!KHUtils.isNull(user.currentTenantId) && user.currentTenantId === 0">
                            <el-col :span="12">
                              <el-form-item label="是否默认分配给创建的租户">
                                <el-radio-group v-model="editForm.defaultAssign">
                                  <el-radio :label="0">是</el-radio>
                                  <el-radio :label="1">否</el-radio>
                                </el-radio-group>
                              </el-form-item>
                            </el-col>
                        </el-row>
                        <!-- 显示端下拉框 -->
                        <el-row>
                        <el-col :span="24">
                            <el-form-item label="显示端" prop="showType">
                                <el-select v-model="editForm.showType" clearable placeholder="请选择">
                                <el-option v-for="item in opts" :key="item.value" :label="item.name" :value="item.value" ></el-option>
                                </el-select>
                            </el-form-item>
                        </el-col>
                        </el-row>
                        <!-- 选择图标 -->
                        <el-row>
                        <el-col :span="24">
                            <el-form-item label="菜单图标" prop="appName">
                            <IconSetting :data="editForm"></IconSetting>
                            </el-form-item>
                        </el-col>
                        </el-row>
                        <!-- 图片上传 -->
                        <el-row>
                        <el-col :span="24">
                            <el-form-item label="菜单图片" prop="iconUpload">
                                <uploadFlie v-model="editForm.iconUpload"></uploadFlie>
                            </el-form-item>
                        </el-col>
                        </el-row>
                    </el-form>
                    <div slot="footer" class="dialog-footer">
                        <el-button type="primary" @click.native="editSubmit" :loading="editLoading">保存
                        </el-button>
                    </div>
                </el-dialog>
            </el-col>

        </el-row>
    </div>    
</template>

<script>
import {mapGetters} from 'vuex'
import uploadFlie from '@/components/common/uploadFlie.vue';
import IconSetting from '@/components/common/IconSetting.vue';
    export default {
        components:{
            uploadFlie,
            IconSetting
        },
        data() {
            return {
				tenantValue: null,
                delLoading: false,
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                popoverVisible:false,
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
                    // 
                    menuUrl: [
                        {required: true, message: '请输入路由地址', trigger: 'blur'},
                        { validator: (rule, value, callback)=> {
                            if(/(\*|\+|\^|\%|\#|\@|\!|\~)/.test(value)){
                                callback(new Error('请输入数字，字母，-，_'));
                            }else{
                                callback()
                            }
                        }, trigger: 'blur'}
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
                filterText: '',
                opts:[
                  {name:"全部显示",value:0},
                  {name:"PC端显示",value:1},
                  {name:"APP端显示",value:2},
                ],
                defaultExpandTreeIds: [], // 存放要默认展开的树节点 id
            }
        },
        watch: {
            filterText(val) {
                this.$refs.menuTreeRef.filter(val);
            }
        },
        computed:{
            optNamesMap(){
                let map = new Map()
                this.opts.forEach((opt)=>{
                  map.set(opt.value,opt.name) 
                })
                return map
            },
            iconStyle(){
                return function (data) {
                    let styleObj = {};
                    styleObj.backgroundColor = data.iconBgColor;
                    styleObj.borderColor = data.iconBgColor;
                    return styleObj;
                }

            },
            iconClassObject(){
                return function (appIcon) {
                    let classObject = {};
                    classObject.icon = true;
                    classObject.KHIcon = true;
                    classObject[appIcon.iconName] = true;
                    return classObject;
                }
            },
            ...mapGetters({
                user: 'getUserInfo'
            }),
        },
        mounted() {
            this.init()
        },
        methods: {
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
                            // 初始化当前菜单
                            if (_this.KHUtils.isNull(_this.currentNodeData.id)) {
                                _this.currentNodeData = _this.KHUtils.clone(_this.menuTree[0]);
                            }
                            if (!_this.KHUtils.isNull(_this.menuTree) && _this.menuTree.length > 0) {
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
            // 选择上级菜单
            selectParentMenu(data) {
                this.editForm.parentMenuName = data.menuName;
                this.editForm.parentId = data.id;
                this.editForm.level = data.level ? data.level + 1 : 1;
                this.popoverVisible = false;
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
                
                this.$confirm('确认删除该记录吗?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
                }).then(() => {
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
                  _this.$Get(_this.khConfig.api.deleteMenu, param).then(res => {
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
                  }).catch(()=>{
                    _this.delLoading = false;
                  })
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
                        this.$refs.multipleTable.clearSelection();
                        delArray = [];
                        break;
                    } else {
                        delArray.push(obj);
                    }
                }
                _this.multipleSelection = delArray;
            },
            // 显示编辑页面
            handleEdit(row) {
                let _this = this;
                _this.isAddOrEdit = false;
                _this.editFormVisible = true;
                _this.editFormTitle = '编辑菜单';
                _this.editForm = Object.assign({iconUpload:"",iconName:"",iconBgColor:"",showType:""},row);
                if (_this.KHUtils.isNull(_this.editForm.defaultAssign)) {
                  _this.editForm = Object.assign(_this.editForm,{defaultAssign : 1});
                } else {
                  _this.editForm = Object.assign(_this.editForm,{defaultAssign : parseInt(_this.editForm.defaultAssign)});
                }
            },
            // 显示新增界面
            handleAdd() {
                let _this = this;
                _this.isAddOrEdit = true;
                _this.editFormVisible = true;
                _this.editFormTitle = '新增菜单';
                _this.editForm = {};
                _this.editForm.parentMenuName = _this.currentNodeData.menuName;
                _this.editForm.parentId = _this.currentNodeData.id;
                _this.editForm.level = _this.currentNodeData.level + 1;
                _this.editForm.hidden = "0"
                this.$set(this.editForm,"iconName","")
                this.$set(this.editForm,"iconBgColor","")
                this.$set(this.editForm,"showType","")
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

                            this.$PostFromData(url, this.convertForm2Array(this.editForm))
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
                let paramArray = {};
                if (!_this.KHUtils.isInvalidValue(_form.menuName)) {
                    paramArray.menuName = _form.menuName;
                }
                if (!_this.KHUtils.isNull(_form.parentId)) {
                    paramArray.parentId = _form.parentId;
                }
                if (!_this.KHUtils.isInvalidValue(_form.menuUrl)) {
                    paramArray.menuUrl = _form.menuUrl;
                }
                if (!_this.KHUtils.isInvalidValue(_form.level)) {
                    if (this.KHUtils.isNull(_form.parentMenuName)) {
                        paramArray.level = 1;
                    } else {
                        paramArray.level = _form.level;
                    }
                }
                if (!_this.KHUtils.isInvalidValue(_form.funcName)) {
                    paramArray.funcName = _form.funcName;
                }
                if (!_this.KHUtils.isInvalidValue(_form.serverUrl)) {
                    paramArray.serverUrl = _form.serverUrl;
                }
                if (!_this.KHUtils.isInvalidValue(_form.component)) {
                    paramArray.component = _form.component;
                }
                if (!_this.KHUtils.isInvalidValue(_form.redirect)) {
                    paramArray.redirect = _form.redirect;
                }
                if (!_this.KHUtils.isInvalidValue(_form.hidden)) {
                    paramArray.hidden= _form.hidden;
                }
                if (!_this.KHUtils.isInvalidValue(_form.orderIndex)) {
                    paramArray.orderIndex= _form.orderIndex;
                }

                if (!_this.KHUtils.isInvalidValue(_form.iconUpload)) {
                    paramArray.iconUpload= _form.iconUpload;
                }
                if (!_this.KHUtils.isInvalidValue(_form.iconName)) {
                    paramArray.iconName= _form.iconName;
                }
                if (!_this.KHUtils.isInvalidValue(_form.iconBgColor)) {
                    paramArray.iconBgColor= _form.iconBgColor;
                }
                if (!_this.KHUtils.isInvalidValue(_form.showType)) {
                    paramArray.showType= _form.showType;
                }

                if (!_this.isAddOrEdit) {
                    paramArray.id= _form.id;
                }
              	paramArray.defaultAssign= _form.defaultAssign;
                paramArray.menuType= 0;
                return paramArray;
            },


            //树节点展开关闭时记录当前树展开状态的方法
            // 树节点展开
            handleNodeExpand(data) {
              // 保存当前展开的节点
              let flag = false
              this.defaultExpandTreeIds.some(item => {
                if (item === data.id) { // 判断当前节点是否存在， 存在不做处理
                  flag = true
                  return true
                }
              })
              if (!flag) { // 不存在则存到数组里
                this.defaultExpandTreeIds.push(data.id)
              }
            },
            // 树节点关闭
            handleNodeCollapse(data) {
              // 删除当前关闭的节点
              this.defaultExpandTreeIds.some((item, i) => {
                if (item === data.id) {
                  this.defaultExpandTreeIds.splice(i, 1)
                }
              })
              this.removeChildrenIds(data) // 这里主要针对多级树状结构，当关闭父节点时，递归删除父节点下的所有子节点
            },
            // 删除树（默认展开）子节点
            removeChildrenIds(data) {
              const ts = this
              if (data.children) {
                data.children.forEach(function(item) {
                  const index = ts.defaultExpandTreeIds.indexOf(item.id)
                  if (index > 0) {
                    ts.defaultExpandTreeIds.splice(index, 1)
                  }
                  ts.removeChildrenIds(item)
                })
              }
            },
            
        }
    }
</script>
<style lang="scss" scoped>
    ::v-deep .el-tree {
        width: 100%;
        border-radius: 5px;
        .el-tree-node > .el-tree-node__children {
            overflow: visible;
        }
    }

    .tree-no-border {
        border: none;
    }
    .tree-no-border:hover {
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

    .demo-form-inline {
        margin-top: 20px;
    }

    .custom-menu-dia > > > .el-dialog__body {
        padding: 10px 10px;
    }

    ::v-deep .col-cond-filter-dialog {
        .el-dialog__body {
            padding: 15px 15px !important;
            background-color: #FFFFFF;
            overflow-y: auto !important;
            // height: 45vh;

            
        }
    }
    .update-icon {
        width: 50px;
        height: 50px;
        border-radius: 10px;
    }

    .upload-demo > .el-upload {
        float: left;
        padding-right: 10px;
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


 
</style>

