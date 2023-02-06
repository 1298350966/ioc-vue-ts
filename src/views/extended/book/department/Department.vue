<template>
   <div>
        <div class="header-row" >
            <span class="header-title">部门管理</span>
        </div>
        <div class="search-row">
            <el-form :inline="true" v-model="queryParams" class="demo-form-inline" label-suffix="：">
                <el-form-item label="企业名称">
                    <el-input v-model="queryParams.tenantName" placeholder=""></el-input>
                </el-form-item>
                <el-form-item label="部门名称">
                    <el-input v-model="queryParams.orgName" placeholder=""></el-input>
                </el-form-item>

                <el-button type="primary" round @click="queryOrgData">查询</el-button>
            </el-form>
        </div>
       <el-table class="org-member-table" stripe  :data="orgList"   :header-cell-style="tableHeaderStyle" v-loading="loading">

           <el-table-column label="所属企业名称" prop="tenantName"  show-overflow-tooltip/>
           <el-table-column label="部门名称" prop="orgName"  show-overflow-tooltip/>
           <el-table-column label="上级部门" prop="parentOrgName"  show-overflow-tooltip/>
           <el-table-column label="主管名称" prop="orgLeaderName"  show-overflow-tooltip/>
           <el-table-column label="操作"></el-table-column>
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
                orgList:[],
                totalCount:0,
                loading:false,
                queryParams:{
                    pageSize:10,
                    pageNum:1,
                    tenantName:"",
                    orgName:"",
                }
            }
        },
        mounted(){
          this.listData();
        },
        methods: {

            listData(){
                let _this = this;
                _this.loading = true;
                _this.$Get(_this.khConfig.api['queryOrgsByCondition'], _this.queryParams).then(res => {
                    _this.totalCount = res.totalCount;
                    _this.orgList = res.datas;
                    _this.loading = false;
                });
            },
            queryOrgData(){
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
