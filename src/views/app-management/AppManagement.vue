<template>
    <div>
        <el-form :model="queryParams" label-width="100px" :inline="true">
            <el-form-item label="名称：" prop="appName">
                <el-input v-model="queryParams.appName"
                          placeholder="请输入名称"
                          clearable
                          size="small"/>
            </el-form-item>
            <el-form-item label="功能介绍：" prop="introduce">
                <el-input v-model="queryParams.introduce"
                          placeHolder="请输入功能介绍"
                          clearable
                          size="small"/>
            </el-form-item>

            <el-form-item class="opt-button">
                <el-button type="info" @click="handleQuery">查询</el-button>
                <el-button type="success" @click="handleQueryReset">重置</el-button>
                <el-button type="danger" @click="handleDelete">删除</el-button>
                <el-button type="primary" @click="addMicroApp">新增</el-button>
            </el-form-item>
        </el-form>
        <NewAdd :visible.sync="addOpen"></NewAdd>

        <div class="table-box">
            <el-table v-loading="loading" ref="appTable" :data="appList" row-key="id" border>
                <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>

                <el-table-column label="应用名称" prop="introduce" align="center" show-overflow-tooltip/>N
                <el-table-column label="功能介绍" class-name="tag-column" align="center">
                    <template slot-scope="scope">
                        {{ KHUtils.isNull(scope.row.tag) ? '' : scope.row.tag.split(',').join('、') }}
                    </template>
                </el-table-column>
                <el-table-column label="" align="center">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" >基础信息</el-button>
                        <el-button type="text" size="small">流程定义</el-button>
                        <el-button type="text" size="small" >流转设定</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>
    </div>
</template>

<script>
import NewAdd from '../../components/app-management/NewAdd';
    export default {
        components:{
            NewAdd
        },
        created() {
            this.getAppList();
        },

        computed: {
            tagValue() {
                return function (type) {
                    let tagArray = [];
                    if (type === 'add') {
                        this.addForm.tag.split(',').forEach(item => {
                            if (item) {
                                tagArray.push(item);
                            }
                        });
                    } else {
                        this.updateForm.tag = this.updateForm.tag ? this.updateForm.tag : '';
                        this.updateForm.tag.split(',').forEach(item => {
                            if (item) {
                                tagArray.push(item);
                            }
                        });
                    }
                    return tagArray;
                };
            },
            imgSrc() {
                return function (fileId) {
                    return window.location.origin + this.khConfig.api['fileDownload'] + '/' + fileId;
                };
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
                    classObject.iconfont = true;
                    classObject[appIcon.iconName] = true;
                    return classObject;
                }

            }
        },

        data() {
            return {


                removeTag: '',
                appList: [],
                total: 0,
                queryParams: {},

                loading: true,
                combLoading: true,
                pageParam: {
                    pageNum: 1,
                    pageSize: 10
                },
                combPageParam: {
                    pageNum: 1,
                    pageSize: 10
                },
                funcPageParam: {
                    pageNum: 1,
                    pageSize: 10
                },
                funcTotal: 0,
                funcSearch: '',
                addOpen: false,
                updateOpen: false,
                funcAppOpen: false,
                addForm: {
                    appType: 0,
                    tag: '',
                    appName: "",
                    introduce: "",
                    func: []
                },
                updateForm: {},
                updateFormRules: {},
                addFormRules: {},
                selectedRowIds: [],
                combAppOpen: false,
                combAppList: [],
                combTotal: 0,
                combAppSelect: [],
                funcSelect: [],
                combSearch: '',
                funList: [],
                isAdd: false,
                appIconSetVisible: false,
                color: '#E6A23C',
                icon: 'iconguanliyuancaozuo',
                appIconObj: {
                    iconName: '',
                    iconBgColor: ''
                }
            };
        },

        methods: {
            //新增微应用
            addMicroApp(){
                this.addOpen = true;
                this.isAdd = true
            },
            handleDelete() {
                if (this.selectedRowIds.length > 0) {
                    this.$confirm('此操作将永久删除该应用, 是否继续?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        let param = {
                            ids: this.selectedRowIds.join(',')
                        };
                        this.$Post(this.khConfig.api['deleteMicroApp'], this.KHUtils.transformRequest(param)).then(res => {
                            this.$message({type: 'success', message: '删除成功'});
                            this.pageParam.pageNum = 1;
                            this.$refs['appTable'].clearSelection();
                            this.getAppList();
                        });
                    });
                } else {
                    this.$message({
                        type: 'warning',
                        message: '请选择要删除的项'
                    });
                }
            },
            handleQueryReset() {
                this.queryParams = this.$options.data().queryParams;
                this.pageParam.pageNum = 1;
                this.getAppList();
            },
             handleQuery() {
                this.pageParam.pageNum = 1;
                this.getAppList();
                this.$refs['funTable'].clearSelection();
            },
            selectIcon(appIcon){
                this.appIconObj.iconName = appIcon.iconName;
            },
            slectBgColor(color){
                this.appIconObj.iconBgColor = color;
            },
            setAppIcon(){
                this.appIconSetVisible = false;
                if (this.isAdd) {
                    this.$set(this.addForm, 'iconName', this.appIconObj.iconName);
                    this.$set(this.addForm, 'iconBgColor', this.appIconObj.iconBgColor);
                } else {
                    this.$set(this.updateForm, 'iconName', this.appIconObj.iconName);
                    this.$set(this.updateForm, 'iconBgColor', this.appIconObj.iconBgColor);

                }
            },

            getAppList() {
                this.loading = true;
                let param = {
                    ...this.pageParam,
                    ...this.queryParams
                };
                this.$Get(this.khConfig.api['listMicroApp'], param).then(res => {
                    this.total = res.totalCount;
                    this.appList = res.datas;
                    this.loading = false;
                });
            },

            cancelAdd() {
                this.addForm = this.$options.data().addForm;
                this.addOpen = false;
            },
            submitAddForm() {
                this.addForm.funIds = this.addForm.func.map(v => {
                    return v.id;
                }).join(',');
                delete this.addForm.func;
                this.$Post(this.khConfig.api['addMicroApp'], this.KHUtils.transformRequest(this.addForm)).then(res => {
                    this.pageParam.pageNum = 1;
                    this.getAppList();
                    this.$message({
                        type: 'success',
                        message: '添加微应用成功'
                    });
                });
                this.cancelAdd();
            },
            handleUpdate(id) {
                this.updateForm = {};
                this.isAdd = false;
                const getMicroApp = new Promise((resolve, reject) => {
                    this.$Get(this.khConfig.api['getMicroApp'], {id: id}).then(res => {
                        let microApp = res.microApp;
                        this.$set(this.updateForm, 'id', microApp.id);
                        this.$set(this.updateForm, 'iconId', microApp.iconId);
                        this.$set(this.updateForm, 'appName', microApp.appName);
                        this.$set(this.updateForm, 'introduce', microApp.introduce);
                        this.$set(this.updateForm, 'tag', microApp.tag);
                        this.$set(this.updateForm, 'iconName', microApp.iconName);
                        this.$set(this.updateForm, 'iconBgColor', microApp.iconBgColor);
                        resolve();
                    });
                });
                const listMicroAppFunctionByAppId = new Promise((resolve, reject) => {
                    this.$Get(this.khConfig.api['listMicroAppFunctionByAppId'], {appId: id}).then(res => {
                        this.$set(this.updateForm, 'func', res.datas);
                        resolve();
                    });
                });
                Promise.all([getMicroApp, listMicroAppFunctionByAppId]).then(() => {
                    this.updateOpen = true;
                });
            },
            cancelUpdate() {
                this.updateForm = this.$options.data().updateForm;
                this.updateOpen = false;
            },
            submitUpdateForm() {
                console.log(this.updateForm);
                if (this.updateForm.func instanceof Array && this.updateForm.func.length > 0) {
                    let strIds = this.updateForm.func.map(function (obj, index) {
                        return obj.id
                    }).join(",");
                    this.updateForm.funIds = strIds;
                }
                this.$Post(this.khConfig.api['updateMicroApp'], this.KHUtils.transformRequest(this.updateForm)).then(res => {
                    this.$message({
                        type: 'success',
                        message: '更新成功'
                    });
                    this.getAppList();
                    this.cancelUpdate();
                });
            },
            handleTagInput(val, type) {
                type === 'add' ? this.addForm.tag = val.join(',') : this.updateForm.tag = val.join(',');
            },
            getOrgList(id, pathName) {
                this.$Get(this.khConfig.api['listTenantOrg'], {orgId: id}).then(res => {

                    if (res.list.length > 0) {

                    } else {
                        this.$message({
                            type: 'warning',
                            message: '已经到最后一级了'
                        });
                    }
                });
            },
            handleClickRole() {
                this.$Get(this.khConfig.api.listRole).then(res => {

                });
            },

            handleCurrentChange(pageNum) {
                console.log(this.pageParam.pageNum);
                this.getAppList();
            },
            handleCombCurrentChange() {
                this.getCombAppList();
            },
            handleSelectionChange(selection) {
                this.selectedRowIds = selection.map(item => {
                    return item.id;
                });
            },

            handleRemoveLogo() {
                this.addForm.iconId = '';
            },
            uploadLogoCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    this.$set(this.addForm, 'iconId', response.datas[0].fileId);
                    console.log(this.addForm.iconId);
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            handleRemoveUpdateLogo() {
                this.updateForm.iconId = '';
            },
            uploadUpdateLogoCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    this.$set(this.updateForm, 'iconId', response.datas[0].fileId);
                    console.log(this.addForm.iconId);
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            beforeUpload(file) {
                if (file.type !== 'image/jpeg' && file.type !== 'image/png') {
                    this.$message.error('只能上传jpg/png文件');
                    return false;
                }
                const limitSize = file.size / 1024 / 1024 < 5;
                if (!limitSize) {
                    this.$message.error('上传文件大小不能超过 5M');
                    return false;
                }
            },
            handleCombAppOpen() {
                this.combAppOpen = true;
                this.getCombAppList();
            },
            getCombAppList() {
                this.combLoading = true;
                let param = {
                    ...this.combPageParam,
                    appName: this.combSearch,
                    appType: 0
                };
                this.$Get(this.khConfig.api['listMicroApp'], param).then(res => {
                    this.combTotal = res.totalCount;
                    this.combAppList = res.datas;
                    this.combLoading = false;
                });
            },
            handleCombAppSelectionChange(list) {
                this.combAppSelect = list;
            },
            closeCombAppDialog() {
                this.combAppOpen = false;
            },
            closeFuncAddDialog() {
                this.funcAppOpen = false;
                this.funcSelect = this.$options.data().funcSelect;
            },
            saveFunc() {
                if (this.isAdd) {
                    for (const item of this.funcSelect) {
                        if (!this.addForm.func.some(v => v.id === item.id)) {
                            this.addForm.func.push(item);
                        }
                    }
                } else {
                    for (const item of this.funcSelect) {
                        if (!this.updateForm.func.some(v => v.id === item.id)) {
                            this.updateForm.func.push(item);
                        }
                    }
                }

                this.closeFuncAddDialog();
            },
            saveCombApp() {
                this.closeCombAppDialog();
            },
            handleFuncOpen(value) {
                if (value == 0) {
                    this.isAdd = true;
                } else if (value == 1) {
                    this.isAdd = false;
                }
                this.getAppFunctionList();
                this.funcAppOpen = true;
            },
            getAppFunctionList() {
                let param = {
                    ...this.funcPageParam,
                    ...this.funcSearch
                };
                this.loading = true;
                this.$Get(this.khConfig.api['listMicroAppFunction'], param).then(res => {
                    this.funList = res.datas;
                    this.funcTotal = res.totalCount;
                    this.loading = false;
                });
            },
            handleFuncSelectionChange(list) {
                this.funcSelect = list;
            },
            handleCombSearch() {
                this.getCombAppList();
            },
            handleFuncCurrentChange() {
                this.getAppFunctionList();
            }
        }
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/microApp/micro-app.scss";

   ::v-deep .opt-button {
        .el-form-item__content {
            min-width:300px ;
            .el-button {
                margin: 0px 5px;
                padding: 7px 15px;
            }

            .el-button:nth-of-type(1) {
                margin-bottom: 5px;
            }

            .el-button:nth-of-type(2) {
                margin-bottom: 5px;
            }

            width: 120px;
        }

        float: right;
    }

    .avatar {
        width: 60px;
        height: 60px;
        display: inline-block;
    }

    .pic {
        width: 60px;
        height: 60px;
        display: inline-block;
        margin-right: 15px;
    }

   ::v-deep .form {
        .el-upload {
            width: 60px;
            height: 60px;
            display: flex;
            border: none;
            flex-direction: column;
            justify-content: center;
        }

        .el-icon-close:before {
            font-size: 12px;
        }

        .el-radio-group {
            display: flex;
            flex-direction: row;
            align-items: center;
        }
    }

   ::v-deep .pagination {
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
        padding: 0px;
        margin-top: 10px;
        margin-bottom: 10px;
        margin-right: 5px;

        .btn-next {
            margin-right: 0px;
        }
    }

   ::v-deep .table-box {
        .el-table th {
            display: table-cell !important;
        }
        .logo-column {
            display: flex;
            flex-direction: row;
            align-items: center;

            span {
                //margin-left: 10px;
                text-overflow: ellipsis;
                overflow: hidden;
            }
        }
    }

    .search {
        width: 30%;
        margin-bottom: 10px;
    }

    .comb-footer {
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: flex-end;
    }

    .has-select {
        font-size: 25px;
        font-weight: bold;
        color: #000000;
        margin-right: 30px;
        margin-bottom: auto;
        margin-top: 15px;
    }

    .has-select-box {
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }

    .app-box {
        display: flex;
        flex-flow: row wrap;
        padding: 0px 10px;
    }

    .icon {
        width: 70px;
        height: 70px;
        border-radius: 10px;
        margin-bottom: 10px;
    }

    .app {
        display: flex;
        cursor: pointer;
        flex-direction: column;
        align-items: flex-start;
        font-size: 13px;
        color: #53575A;
        margin-right: 25px;
        margin-bottom: 10px;

        span {
            display: inline-block;
            max-width: 70px;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
        }
    }

    .icon-content {
        max-height: 200px;
        overflow-y: auto;
        white-space: nowrap;
        text-overflow: ellipsis;
    }

</style>
