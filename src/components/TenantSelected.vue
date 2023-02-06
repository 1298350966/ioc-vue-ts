<template>
    <div>
        <el-row class="query-box">
            <el-row>
                <el-col :span="23">
                    <el-row :gutter="20">
                        <el-col class="input-box">
                            <span>租户名称</span>
                            <el-input class="search" placeholder="租户名称" v-model="queryParams.tenantName"/>
                        </el-col>
                        <el-col class="input-box">
                            <span>行业</span>
                            <el-input class="search" placeholder="行业" v-model="queryParams.industry"/>
                        </el-col>
                        <!--            <el-col class="input-box">
                                      <span>所在地</span>
                                      <el-input class="search" placeholder="所在地" v-model="queryParams.location"/>
                                    </el-col>
                                    <el-col class="input-box">
                                      <span>详细地址</span>
                                      <el-input class="search" placeholder="详细地址" v-model="queryParams.address"/>
                                    </el-col>-->
                        <!--            <el-col class="input-box">
                                      <span>创建用户名</span>
                                      <el-input class="search" placeholder="创建用户名" v-model="queryParams.userName"/>
                                    </el-col>-->
                        <el-col>
                            <el-button type="primary" @click="handleQuery">查 询</el-button>
                            <el-button @click="resetQueryParam">重 置</el-button>
                        </el-col>
                    </el-row>
                    <!--          <el-row :gutter="20">
                                <el-col class="input-box">
                                  <span>联系人姓名</span>
                                  <el-input class="search" placeholder="联系人姓名" v-model="queryParams.contact"/>
                                </el-col>
                                <el-col class="input-box">
                                  <span>联系人手机号码</span>
                                  <el-input class="search" placeholder="联系人手机号码" v-model="queryParams.phone"/>
                                </el-col>
                                <el-col class="input-box">
                                  <span>联系人邮箱</span>
                                  <el-input class="search" placeholder="联系人邮箱" v-model="queryParams.email"/>
                                </el-col>
                                <el-col class="input-box">
                                  <span>启用状态</span>
                                  <el-select class="search" v-model="queryParams.status" placeholder="启用状态">
                                    <el-option v-for="item in statusOptions" :key="item.value"
                                               :label="item.label" :value="item.value">
                                    </el-option>
                                  </el-select>
                                </el-col>
                                <el-col class="input-box">
                                  <span>最后修改用户名</span>
                                  <el-input class="search" placeholder="最后修改用户名" v-model="queryParams.lastUpdateUserName"/>
                                </el-col>
                              </el-row>
                              <el-row :gutter="20">
                                <el-col class="input-date-box" :span="6">
                                  <span style="width: 80px;margin-top: 10px">创建时间</span>
                                  <div class="date-box">
                                    <el-date-picker
                                        class="date-search"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        v-model="queryParams.beginCreateTime"
                                        @change="handleChangeDate('createTime')"
                                        type="datetime"
                                        placeholder="开始日期"
                                        align="right">
                                    </el-date-picker>
                                    <span style="margin-top: 5px"></span>
                                    <el-date-picker
                                        class="date-search"
                                        v-model="queryParams.endCreateTime"
                                        @change="handleChangeDate('createTime')"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        type="datetime"
                                        placeholder="结束日期"
                                        align="right">
                                    </el-date-picker>
                                  </div>
                                </el-col>
                                <el-col class="input-date-box" :span="6">
                                  <span style="width: 80px;margin-top: 10px">最后修改时间</span>
                                  <div class="date-box">
                                    <el-date-picker
                                        class="date-search"
                                        v-model="queryParams.beginLastUpdateTime"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        @change="handleChangeDate('lastUpdateTime')"
                                        type="datetime"
                                        placeholder="开始日期"
                                        align="right">
                                    </el-date-picker>
                                    <span style="margin-top: 5px"></span>
                                    <el-date-picker
                                        class="date-search"
                                        value-format="yyyy-MM-dd HH:mm:ss"
                                        v-model="queryParams.endLastUpdateTime"
                                        @change="handleChangeDate('lastUpdateTime')"
                                        type="datetime"
                                        placeholder="结束日期"
                                        align="right">
                                    </el-date-picker>
                                  </div>
                                </el-col>
                                <el-col>
                                  <el-button @click="resetQueryParam">重 置</el-button>
                                  <el-button type="primary" @click="handleQuery">查 询</el-button>
                                </el-col>
                              </el-row>-->
                </el-col>
            </el-row>
        </el-row>
        <!--        <el-row class="opt-box">
                    <el-button class="add" @click="handleAddTenant">新增</el-button>
                </el-row>-->
        <el-row class="table-box">
            <el-table
                :data="tenantList"
                border
                @selection-change="handleSelectionChange"
                style="width: 100%">
                <el-table-column type="selection" width="55px" fixed></el-table-column>
                <el-table-column
                    show-overflow-tooltip
                    align="center"
                    prop="tenantName"
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
                <!--                <el-table-column
                                    show-overflow-tooltip
                                    align="center"
                                    prop="address"
                                    label="详细地址"
                                    width="150">
                                </el-table-column>-->
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
                >
                </el-table-column>
                <!--                <el-table-column
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
                                </el-table-column>-->
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
    </div>
</template>

<script>
    export default {
        props: {
            "multiple": {type: Boolean, required: false} // 是否支持多选
        },
        computed: {
            switchType() {
                return function (obj) {
                    return obj.status === 1;
                };
            }
        },
        
        data() {
            return {
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
                    location: [
                        {required: true, message: '所在地不能为空', trigger: 'blur'},
                        {min: 2, max: 50, message: '长度在 2 到 50 个字符', trigger: 'blur'}
                    ],
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
                checkedTenant: [],
            };
        },
        
        mounted() {
            this.getList();
            this.checkedTenant = [];
        },
        
        methods: {
            // 列表选中触发
            handleSelectionChange(array) {
                if (array instanceof Array && array.length === 0) {
                    this.$message.warning({
                        title: '警告',
                        message: '请选择',
                    });
                    return false;
                }
                if (this.multiple) {
                    this.checkedTenant = array;
                } else {
                    this.checkedTenant = [];
                    this.checkedTenant.push(array[array.length - 1]);
                }
            },
            getCheckedNode() {
                return this.checkedTenant;
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
            }
        }
    };
</script>

<style lang="scss" scoped>
   ::v-deep .table-box {
        padding-right: 3%;
        
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
                    width: 80px;
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
