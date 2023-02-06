<template>
    <div>
        <div class="header-row" >
            <span class="header-title">内部联系人</span>
        </div>
        <div class="search-row">
            <el-form :inline="true" v-model="queryParams" class="demo-form-inline" label-suffix="：">
                <el-form-item label="企业名称">
                    <el-input v-model="queryParams.tenantName" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="姓名">
                    <el-input v-model="queryParams.userName" placeholder=""></el-input>
                </el-form-item>

                <el-button type="primary" round @click="queryUserData">查询</el-button>
            </el-form>
        </div>
        <el-table class="org-member-table" stripe  :data="userList"   :header-cell-style="tableHeaderStyle" v-loading="loading">

            <el-table-column label="所属企业名称" prop="tenantName"  show-overflow-tooltip/>
            <el-table-column label="所属部门"   show-overflow-tooltip>
                <template slot-scope="scope">
                    <span>{{ getOrgName(scope.row.orgs)}}</span>
                </template>
            </el-table-column>
            <el-table-column label="姓名" prop="realName"  show-overflow-tooltip/>
            <el-table-column label="手机号" prop="phone"  show-overflow-tooltip/>
            <el-table-column label="邮箱" prop="email"></el-table-column>
            <el-table-column label="职位" prop="jobs"></el-table-column>
            <el-table-column label="角色">
                <template slot-scope="scope">
                    <span>{{ getRoleName(scope.row.roles)}}</span>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            style="float: right;margin-top: 20px"
            background
            layout="total,prev, pager, next"
            :total="totalCount"
            @current-change="handleCurrentChange"
            :page-size="queryParams.pageSize"
            :current-page.sync="queryParams.pageNum"
        >
        </el-pagination>
    </div>
</template>

<script>

    export default {
        name: "Department",
        data() {
            return {
                tableHeaderStyle:{
                    backgroundColor:"#EAF1F7"
                },
                userList:[],
                totalCount:0,
                loading:false,
                queryParams:{
                    pageSize:10,
                    pageNum:1,
                    tenantName:"",
                    userName:"",
                }
            }
        },
        computed: {
            getOrgName() {
                return function (orgs) {
                  if(orgs instanceof Array && orgs.length >0){
                      let strTag = orgs.map(function(obj,index){
                        return obj.orgName;
                      }).join(',');
                      return strTag;
                  }
                  return "";
                };
            },
            getRoleName() {
                return function (roles) {
                    if(roles instanceof Array && roles.length >0){
                        let strTag = roles.map(function(obj,index){
                            return obj.roleName;
                        }).join(',');
                        return strTag;
                    }
                    return "";
                };
            }
        },
        mounted(){
            this.listData();
        },
        methods: {

            listData(){
                let _this = this;
                _this.loading = true;
                _this.$Get(_this.khConfig.api['queryTenantUserInfo'], _this.queryParams).then(res => {
                    _this.totalCount = res.totalCount;
                    _this.userList = res.datas;
                    _this.loading = false;
                });
            },
            queryUserData(){
                let _this = this;
                _this.queryParams.pageNum = 1;
                _this.listData();
            },
            handleCurrentChange(val){
                let _this = this;
                _this.queryParams.pageNum = val;
                _this.listData();
            }

        }
    }
</script>


<style lang="scss" scoped>
.search-row{
    margin:15px 0;
}
</style>
