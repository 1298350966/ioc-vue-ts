<template>
    <div>
        <div class="header-row" >
            <span class="header-title">租户信息</span>
            <el-form :inline="true" v-model="queryParams" class="demo-form-inline" label-suffix="：">
                <el-form-item label="租户名称">
                    <el-input class="search" placeholder="租户名称" v-model="queryParams.tenantName"/>
                </el-form-item>
                <el-form-item label="行业">
                    <el-input class="search" placeholder="行业" v-model="queryParams.industry"/>
                </el-form-item>
                <el-form-item label="联系人手机号码">
                    <el-input class="search" placeholder="联系人手机号码" v-model="queryParams.phone"/>
                </el-form-item>
                <el-form-item label="启用状态">
                    <el-select class="search" v-model="queryParams.status" placeholder="启用状态" value="">
                        <el-option v-for="item in statusOptions" :key="item.value"
                                   :label="item.label" :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-button @click="resetQueryParam">重 置</el-button>
                <el-button type="success" @click="handleQuery">查 询</el-button>
                <el-button type="primary" class="add" @click="handleAddTenant">新增</el-button>
            </el-form>
        </div>
        
        <el-row class="table-box">
            <el-table
                :data="tenantList"
                border
                style="width: 100%">
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="tenantName"
                    fixed
                    label="租户名称"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="industry"
                    label="行业"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="location"
                    label="所在地"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="address"
                    label="详细地址"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="contact"
                    label="联系人姓名"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="phone"
                    label="联系人手机号码"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="email"
                    label="联系人邮箱"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="userName"
                    label="创建用户名"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="lastUpdateUserName"
                    label="最后修改用户名"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="createTime"
                    label="创建时间"
                    :formatter="formatTime"
                    width="150">
                </el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="lastUpdateTime"
                    label="最后修改时间"
                    :formatter="formatTime"
                    width="150">
                </el-table-column>
                <el-table-column
                    align="center"
                    fixed="right"
                    label="启用状态">
                    <template slot-scope="scope">
                        <el-switch :value="switchType(scope.row)"
                                   @input="handleInputStatus(arguments, scope.row)"></el-switch>
                    </template>
                </el-table-column>
                <el-table-column
                    align="center"
                    fixed="right"
                    width="150"
                    label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" size="small" @click="handleUpdate(scope.row)">编辑</el-button>
                      <!--  <el-button type="text" size="small" @click="handleAllocateForm(scope.row)">表单分配</el-button>-->
                        <el-button type="text" size="small" @click="editWorkbench(scope.row)">工作台</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <el-row class="pagination-box">
                <el-pagination
                    background
                    :current-page.sync="pageParam.pageNum"
                    :page-size.sync="pageParam.pageSize"
                    layout="total, prev, pager, next, jumper"
                    :total="total"
                    @current-change="handleCurrentChange"
                />
            </el-row>
        </el-row>
        <el-dialog :title="title" :visible.sync="open" v-if="open" width="600px" :close-on-click-modal="false">
            <el-form ref="form" :model="form" :rules="rules">
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="租户名称" prop="tenantName">
                            <el-input v-model="form.tenantName" placeholder="请输入租户名称"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="行业" prop="industry">
                            <el-input v-model="form.industry" placeholder="请输入行业"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="所在地" prop="location" class="custom-form-item">
                            <v-region @values="regionChange" :city="true" class="form-control"
                                      v-model="regionObj"></v-region>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="详细地址" prop="address">
                            <el-input v-model="form.address" placeholder="请输入详细地址" @focus="gisVisible = true"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="联系人姓名" prop="contact">
                            <el-input v-model="form.contact" placeholder="请输入联系人姓名"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="联系人手机号码" prop="phone">
                            <el-input :disabled="formType==='update' " v-model="form.phone" placeholder="请输入联系人手机号码"
                                      maxlength="11"/>
                        </el-form-item>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="12">
                        <el-form-item label="联系人邮箱" prop="email">
                            <el-input v-model="form.email" placeholder="请输入联系人邮箱"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="启用状态" class="form-status"></el-form-item>
                        <el-switch :value="switchType(form)"
                                   @input="(status) => form.status = status ? 1 : 0"
                                   active-text="启用"
                                   inactive-text="禁用"></el-switch>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel">取 消</el-button>
                <el-button type="primary" @click="submitForm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog :title="allocateTitle" :visible.sync="allocateOpen" v-if="allocateOpen" width="800px"
                   :close-on-click-modal="false">
            <div class="transfer-box">
                <el-transfer
                    v-infinite-scroll="getFormConfList"
                    style="width: 100%"
                    v-model="allocateFormIds"
                    filterable
                    :titles="['表单', '已选择']"
                    :button-texts="['移除表单', '分配表单']"
                    :format="{ noChecked: '${total}', hasChecked: '${checked}/${total}'}"
                    :props="{key: 'formId', label: 'formName'}"
                    :data="formList">
                    <span slot-scope="{ option }">{{ option.formName }}</span>
                </el-transfer>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancelAllocateForm">取 消</el-button>
                <el-button type="primary" @click="saveAllocateForm">确 定</el-button>
            </div>
        </el-dialog>
        <el-dialog
            title="工作台分组"
            :visible.sync="workbenchDialogVisible"
            width="60%" style="height: auto"
            :before-close="closeDialog"
        >
            <workbench-tenant :tenantId="tenantId" ref="workbench"></workbench-tenant>
        </el-dialog>
        <!--GIS定位-->
        <el-dialog title="地图定位"
                   :visible.sync="gisVisible"
                   :close-on-click-modal="false"
                   :close-on-press-escape="false"
                   width="60%"
                   @close="handlerGisClose"
                   append-to-body>
            <gao-de-gis :from-parent-gis-obj="editGisObj" @recGisMsg="recGisMsg" :gis-init-obj="gisInitObj"
                        :child-resp="notifyGis"></gao-de-gis>
        </el-dialog>
    </div>
</template>

<script>
    import WorkbenchTenant from "@/components/micro-app/WorkbenchTenant"
    import GaoDeGis from '@/components/gis/GaoDeGis';

    export default {
        components: {
            WorkbenchTenant,
            GaoDeGis
        },
        created() {
            this.initTenantList();
            this.initFormList();
        },

        computed: {
            switchType() {
                return function (obj) {
                    return obj.status === 1;
                };
            }
        },

        directives: {
            infiniteScroll(el, binding, vnode) {
                let getDataFunc = binding.value;
                let leftPanel = el.querySelector('.el-transfer-panel');
                let scrollEl = leftPanel.querySelector('.el-checkbox-group');
                scrollEl.addEventListener('scroll', () => {
                    //变量scrollTop是滚动条滚动时，距离顶部的距离
                    var scrollTop = scrollEl.scrollTop;
                    //变量clientHeight是可视区的高度
                    var clientHeight = scrollEl.clientHeight;
                    //变量scrollHeight是滚动条的总高度
                    var scrollHeight = scrollEl.scrollHeight;
                    //滚动条到底部的条件
                    if (scrollTop + clientHeight >= scrollHeight) {
                        //到了这个就可以进行业务逻辑加载后台数据了
                        getDataFunc();
                    }
                });
            }
        },

        data() {
            return {
                gisInitObj: {
                    gisInitCity: "南昌",
                    gisInitZoom: "13",
                    gisInitLat: 28.683016,
                    gisInitLnt: 115.857963
                },
                editGisObj: {},
                gisVisible: false,
                notifyGis: 0,     // 通知GIS定位子组件关闭
                pageParam: {
                    pageNum: 1,
                    pageSize: 10
                },
                tenantList: [],
                total: 0,
                open: false,
                title: '',
                statusOptions: [
                    {label: '全部', value: undefined},
                    {label: '已启用', value: 1},
                    {label: '已禁用', value: 0}
                ],
                queryParams: {
                    tenantName: undefined,
                    industry: undefined,
                    location: undefined,
                    address: undefined,
                    contact: undefined,
                    phone: undefined,
                    email: undefined,
                    status: undefined,
                    userName: undefined,
                    beginCreateTime: undefined,
                    endCreateTime: undefined,
                    lastUpdateUserName: undefined,
                    beginLastUpdateTime: undefined,
                    endLastUpdateTime: undefined,
                },
                form: {},
                rules: {
                    tenantName: [
                        {required: true, message: '租户名称不能为空', trigger: 'blur'},
                        {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],
                    industry: [
                        {required: true, message: '行业不能为空', trigger: 'blur'},
                        {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],
                    /*                    location: [
                                            {required: true, message: '所在地不能为空', trigger: 'blur'},
                                            {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                                        ],*/
                    address: [
                        {required: true, message: '详细地址不能为空', trigger: 'blur'},
                        {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],
                    contact: [
                        {required: true, message: '联系人姓名不能为空', trigger: 'blur'},
                        {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],
                    phone: [
                        {required: true, message: '联系人手机号码不能为空', trigger: 'blur'},
                        {
                            pattern: /^1[3456789][0-9]\d{8}$/,
                            message: "请输入正确的手机号码",
                            trigger: "blur"
                        }
                    ],
                    email: [
                        {required: true, message: '联系人邮箱不能为空', trigger: 'blur'},
                        {
                            type: "email",
                            message: "'请输入正确的邮箱地址",
                            trigger: ["blur", "change"]
                        }
                    ]
                },
                allocateTitle: '表单分配',
                allocateOpen: false,
                formList: [],
                allocateFormIds: [],
                formConfPageParam: {
                    pageNum: 1,
                    pageSize: 10
                },
                tenantId: undefined,
                formType: 'add',
                workbenchDialogVisible: false,
                regionObj: {}      // 行政区划
            };
        },

        methods: {
            // 关闭GIs窗口通知子组件返回数据给父组件
            handlerGisClose() {
                this.notifyGis++;
            },
            // 定位信息返回
            recGisMsg(obj) {
                let _this = this;
                _this.gisVisible = false;
                _this.form.address = obj.address;
                _this.form.lat = obj.lat ? obj.lat : "";
                _this.form.lnt = obj.lnt ? obj.lnt : "";
            },
            // 行政区划选择
            regionChange(data) {
                let _this = this;
                if (data.province) {
                    if (data.province.value) {
                        _this.form.provice = data.province.value; // 省
                        _this.form.proviceCode = data.province.key;
                    }
                } else {
                    _this.form.provice = ""; // 省
                    _this.form.proviceCode = "";
                }
                if (data.city) {
                    if (data.city.value) {
                        _this.form.city = data.city.value; // 市
                        _this.form.cityCode = data.city.key;
                    }
                } else {
                    _this.form.city = ""; // 市
                    _this.form.cityCode = "";
                }
                if (data.area) {
                    if (data.area.value) {
                        _this.form.area = data.area.value; // 县
                        _this.form.areaCode = data.area.key;
                    }
                } else {
                    _this.form.area = "";
                    _this.form.areaCode = "";
                }
            },
            editWorkbench(row) {
                let _this = this;
                _this.tenantId = row.id;
                _this.workbenchDialogVisible = true;
            },
            closeDialog() {
                this.$confirm('是否保存工作台配置信息"?', '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    this.$refs.workbench.saveWorkbench();
                    this.workbenchDialogVisible = false;
                }).catch(() => {
                    this.workbenchDialogVisible = false;
                });

            },
            initTenantList() {
                this.getList(true, false);
            },
            initFormList() {
                this.getFormConfList();
            },
            getFormConfList() {
                this.$Get(this.khConfig.api['queryPlatFormConf'], {
                    ...this.formConfPageParam
                }).then(res => {
                    this.formList.push(...res.datas);
                    this.formConfPageParam.pageNum++;
                });
            },
            handleInputStatus(arg, row) {
                this.$confirm(`是否${arg[0] ? '启用' : '禁用'}租户？`, '提示', {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning'
                }).then(() => {
                    let param = {
                        id: row.id,
                        status: arg[0] ? 1 : 0
                    };
                    this.$Post(this.khConfig.api['changeTenantStatus'], this.KHUtils.transformRequest(param)).then(res => {
                        if (res.errCode === 0) {
                            if (row.status === 1) {
                                row.status = 0;
                            } else {
                                row.status = 1;
                            }
                            this.$message({
                                type: 'success',
                                message: `${arg[0] ? '启用' : '禁用'}租户成功`
                            });
                        }
                    });
                });
            },
            handleCurrentChange() {
                this.getList(false, true);
            },
            getList(toPage1, isQuery) {
                let param = {
                    ...this.pageParam,
                    ...this.queryParams
                };
                if (toPage1) {
                    this.pageParam.pageNum = 1;
                    if (isQuery) {
                        this.$Get(this.khConfig.api['listTenant'], param).then(res => {
                            this.tenantList = res.datas;
                            this.total = res.totalCount;
                        });
                    } else {
                        this.$Get(this.khConfig.api['listTenant'], this.pageParam).then(res => {
                            this.tenantList = res.datas;
                            this.total = res.totalCount;
                        });
                        this.queryParams = this.$options.data().queryParams;
                    }
                } else {
                    if (isQuery) {
                        this.$Get(this.khConfig.api['listTenant'], param).then(res => {
                            this.tenantList = res.datas;
                            this.total = res.totalCount;
                        });
                    } else {
                        this.$Get(this.khConfig.api['listTenant'], this.pageParam).then(res => {
                            this.tenantList = res.datas;
                            this.total = res.totalCount;
                        });
                    }
                }
            },
            handleAddTenant() {
                this.formType = 'add';
                this.title = '新增租户';
                this.open = true;
                this.reset();
                this.regionObj = {};
                this.editGisObj = {};
            },
            reset() {
                this.form = {
                    tenantName: undefined,
                    industry: undefined,
                    location: undefined,
                    address: undefined,
                    contact: undefined,
                    phone: undefined,
                    email: undefined,
                    status: 1
                };
            },
            cancel() {
                this.open = false;
                this.reset();
            },
            submitForm() {
                if (this.KHUtils.isNull(this.form.proviceCode) || this.KHUtils.isNull(this.form.cityCode) || this.KHUtils.isNull(this.form.areaCode)) {
                    this.$message.warning("所在地信息需填写完整");
                    return false;
                }
                this.form.location = this.form.provice === this.form.city ? this.form.city + this.form.area : this.form.provice + this.form.city + this.form.area;
                this.$refs["form"].validate(valid => {
                    if (valid) {
                        if (this.form.id) {
                            this.$Post(this.khConfig.api['updateTenant'], this.KHUtils.transformRequest(this.form)).then(res => {
                                if (res.errCode === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '修改租户成功'
                                    });
                                    this.cancel();
                                    this.getList(false, true);
                                }
                            });
                        } else {
                            this.$Post(this.khConfig.api['addTenant'], this.KHUtils.transformRequest(this.form)).then(res => {
                                if (res.errCode === 0) {
                                    this.$message({
                                        type: 'success',
                                        message: '新增租户成功!登录账号为手机号码,初始密码为：kh123456'
                                    });
                                    this.cancel();
                                    this.getList(true, false);
                                }
                            });
                        }
                    }
                });
            },
            handleUpdate(row) {
                this.formType = 'update';
                this.title = '修改租户';
                this.open = true;
                this.reset();
                this.form = {
                    id: row.id,
                    tenantName: row.tenantName,
                    industry: row.industry,
                    location: row.location,
                    address: row.address,
                    contact: row.contact,
                    phone: row.phone,
                    email: row.email,
                    status: row.status
                };
                debugger
                this.editGisObj = {};
                this.editGisObj.lat = row.lat;
                this.editGisObj.lnt = row.lnt;
                this.editGisObj.address = row.address;
                let tempObj = {'town': ''};
                tempObj.province = row.proviceCode;
                tempObj.city = row.cityCode;
                tempObj.area = row.areaCode;
                this.regionObj = tempObj;
            },
            handleQuery() {
                this.pageParam.pageNum = 1;
                this.getList(true, true);
            },
            resetQueryParam() {
                this.queryParams = this.$options.data().queryParams;
                this.getList(true, false);
            },
            formatTime(row, column) {
                const date = new Date(row[column.property]);
                return this.KHUtils.formatDate(date, "yyyy-MM-dd hh:mm:ss");
            },
            handleChangeDate(type) {
                if (type === 'createTime') {
                    if (this.queryParams.beginCreateTime && this.queryParams.endCreateTime) {
                        if (this.queryParams.beginCreateTime > this.queryParams.endCreateTime) {
                            [this.queryParams.beginCreateTime, this.queryParams.endCreateTime] = [this.queryParams.endCreateTime, this.queryParams.beginCreateTime];
                        }
                    }
                } else if (type === 'lastUpdateTime') {
                    if (this.queryParams.beginLastUpdateTime && this.queryParams.endLastUpdateTime) {
                        if (this.queryParams.beginLastUpdateTime > this.queryParams.endLastUpdateTime) {
                            [this.queryParams.beginLastUpdateTime, this.queryParams.endLastUpdateTime] = [this.queryParams.endLastUpdateTime, this.queryParams.beginLastUpdateTime];
                        }
                    }
                }
            },
            handleAllocateForm(row) {
                this.allocateFormIds = [];
                this.tenantId = row.id;
                this.$Get(this.khConfig.api['queryTenantFormPression'] + '/' + this.tenantId).then(res => {
                    res.datas.forEach(item => {
                        this.allocateFormIds.push(item.formId);
                    });
                    this.allocateOpen = true;
                });
            },
            cancelAllocateForm() {
                this.allocateOpen = false;
            },
            saveAllocateForm() {
                let allocateIds = this.allocateFormIds.join(',');
                let param = {};
                param.tenantId = this.tenantId;
                param.formIds = allocateIds;
                this.$Post(this.khConfig.api['tenantAllotForms'], this.KHUtils.transformRequest(param)).then(res => {
                    if (res.errCode === 0) {
                        this.$message({
                            type: 'success',
                            message: '表单分配成功'
                        });
                    }
                    this.cancelAllocateForm();
                });
            }
        }
    };
</script>

<style lang="scss">
    .form-control {
        div.rg-select div.rg-select__el div.rg-select__content {
            padding: 0 10px 0 15px;
        }
    }
</style>

<style lang="scss" scoped>
    .custom-form-item {
        > > > .el-form-item__label {
            &:before {
                content: '*';
                color: #F56C6C;
                margin-right: 4px;
            }
        }
    }

   ::v-deep .table-box {
        // padding-right: 3%;

        .el-table th.gutter {
            display: table-cell !important;
        }
    }

    .opt-box {
        display: flex;
        flex-direction: row;
        margin-bottom: 10px;
    }

    .search {
        width: 130px;
        margin-right: auto;
    }

    .date-search {
        width: 200px;
    }

    .add {
        margin-right: 10px;
    }

    .pagination-box {
        padding: 10px 0px;
        float: right;
    }

    .query-box {
        .el-row {
            display: flex;
            flex-direction: row;
            margin-bottom: 5px;

            .input-box {
                display: flex;
                flex-direction: row;
                justify-content: space-between;
                align-items: center;

                span {
                    font-size: 12px;
                    width: 100px;
                }
            }

            .input-date-box {
                display: flex;
                flex-direction: row;
                justify-content: space-between;

                span {
                    font-size: 12px;
                    width: 80px;
                }
            }
        }
    }

    .form-status {
        margin-bottom: 6px;
    }

   ::v-deep .transfer-box {
        .el-transfer {
            display: flex;
            flex-direction: row;
            justify-content: center;
            align-items: center;
        }

        .el-transfer-panel {
            width: 300px;
        }
    }

    .date-box {
        display: flex;
        flex-direction: column;
    }
</style>
