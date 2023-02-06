<template>
    <el-row>
      <!-- <el-button @click="OpenBatchAllotDialog()">分配表单</el-button> -->

        <el-table
            :data="tableData"
            border
            style="width: 100%;"
            ref="formTable">
            <!-- <el-table-column
              type="selection"
              width="55"
              align="center">
            </el-table-column> -->
            <el-table-column
                prop="formName"
                label="表单名称"
            >
            </el-table-column>
            <el-table-column
                prop="formGroup"
                label="组名"
            >
            </el-table-column>
            <el-table-column
                prop="flag"
                label="状态">
                <template slot-scope="scope">
                    <el-tag
                        :type="scope.row.flag == 0?'success':'danger'"
                        disable-transitions>{{scope.row.flag == 0 ? '启用' : "停用"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="formType"
                label="类型">
                <template slot-scope="scope">
                    <el-tag
                        type="success"
                        disable-transitions>{{scope.row.formType == 0 ? '表单' : "流程"}}
                    </el-tag>
                </template>
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="创建时间">
            </el-table-column>
            <el-table-column label="操作" align="center">
                <template slot-scope="scope">
                    <!-- <el-button
                        size="mini"
                        type="primary"
                        @click="allotTenant(scope.$index, scope.row)">表单分配
                    </el-button> -->
                    <el-button
                        size="mini"
                        type="primary"
                        @click="allotTenantV2(scope.$index, scope.row)">表单分配
                    </el-button>
                    <el-button
                        size="mini"
                        type="success"
                        @click="syncTenant(scope.$index, scope.row)">同步配置
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="float: right;margin: 10px"
            background
            :current-page.sync="pageParam.pageNum"
            :page-size.sync="pageParam.pageSize"
            layout="total, prev, pager, next, jumper"
            :total="total"
            @current-change="handleCurrentChange"
        />

        

        <!-- 表单分配/同步组件 -->
        <FormDistributeDialog :formDistributeVisible.sync="formDistributeVisible"  :formIds="formIds"  :isSync="isSync"></FormDistributeDialog>
    </el-row>
</template>

<script>
    import FormDistributeDialog from "@/views/tenant/form/FormTenantAllotComponents/formDistributeDialog";
    export default {
        name: "FormTenantAllot",
        components:{
            FormDistributeDialog,
        },
        data(){
            return {
                tableData: [],
                formId:0,
                pageParam: {
                    pageNum: 1,
                    pageSize: 20
                },
                total:0,

                // 表单同步或分配相关
                formDistributeVisible:false,
                currentStep:0,   
                //当前需要同步配置或分配的表单id
                formIds:0,
                // 当前是否为同步配置对话框：true同步配置，false表单分配
                isSync:true,
            }
        },
        mounted(){
            this.pageParam.pageNum = 1;
            this.listData();
        },
        methods: {
          // 打开批量分配表单对话框V2
            OpenBatchAllotDialog(){
              let _this = this;
              _this.formDistributeVisible = true;
               let ids = [];
              _this.$refs.formTable.selection.forEach((item)=>{
                ids.push(item.formId)
              })
            },
           // 打开批量分配表单对话框
            handleOpenDisriDialog(){
              let _this = this;
              // _this.currentStep = 0;
              // _this.isAllSelected = false;
              _this.formDistributeVisible = true;
              //打开后默认选中所有的一级节点（即外部原选中的表单）
              // _this.$nextTick(()=>{
              //   _this.$refs.formTable.toggleAllSelection();
              // })
              // _this.isFirst = !_this.isFirst;
            },
            // 下一步
            // nextStep(){
            //   this.currentStep++;
            // },
            // // 查看详情
            // handleDetail(){

            // },
            // // 打开批量分配表单对话框
            // handleOpenDisriDialog(){
            //   let _this = this;
            //   _this.currentStep = 0;
            //   _this.isAllSelected = false;
            //   _this.formDistributeVisible = true;
            //   //打开后默认选中所有的一级节点（即外部原选中的表单）
            //   _this.$nextTick(()=>{
            //     _this.$refs.formTable.toggleAllSelection();
            //   })
            //   // _this.isFirst = !_this.isFirst;
            // },
            // // 提交表单分配
            // submitDistributeForm(){
            //   let _this = this;
            //   // 表单表格的所有选中行
            //   let arr = _this.$refs.multipleTable.selection;
            //   //所有选中的租户
              


            // },
            // // 点击全选（包括所有表单及其依赖的表单）
            // selectAll(){
            //   let _this = this;
            //   _this.isAllSelected = !_this.isAllSelected;
            //   _this.$refs.formTable.clearSelection();
            //   if(_this.isAllSelected){ //初始false，为true说明点击了一次（单数次）全选（需要将全部节点选中）
            //     _this.splite(_this.formTableData,_this.isAllSelected);  
            //   }
            // },
            // // // 点击全选（包括所有表单及其依赖的表单
            // // selectAll(){
            // //   let _this = this;
            // //   _this.isAllSelected = !_this.isAllSelected;
            // //   _this.splite(_this.formTableData,_this.isAllSelected);
            // // },
            // splite(data,flag){
            //   data.forEach((row)=>{
            //     this.$nextTick(()=>{
            //       this.$refs.formTable.toggleRowSelection(row,flag);
            //       })
            //     if(row.children != undefined){
            //       this.splite(row.children)
            //     }
            //   })
            // },

            // // 点击重置
            // reset(){
            //   let _this = this;
            //   // 首先清空所有选中项
            //   _this.$refs.formTable.clearSelection();
            //   //重新选中默认项
            //   _this.$refs.formTable.toggleAllSelection();
            // },

           
            // 查询流程相关的表单数据
            listData() {
                const loading = this.$loading({
                    lock: true,
                    text: '拼命加载中..',
                    spinner: 'el-icon-loading',
                    background: 'transparent'
                });
                // 流程表单类型查询
                this.$Get(this.khConfig.api.queryPlatFormConf, {
                    pageNum: this.pageParam.pageNum,
                    pageSize: this.pageParam.pageSize
                }).then(res => {
                    if (res.errCode === 0) {
                        this.tableData = [];
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            this.tableData = [];
                            this.tableData = res.datas;
                            this.total = 0;
                            this.total = res.totalCount;
                            // 表单分组
                            /* let newArray = [];
                             for (let i = 0, n = res.datas.length; i < n; i++) {
                             let state = false;
                             let compareObj = res.datas[i];
                             if (newArray.length > 0) {
                             for (let j = 0, m = newArray.length; j < m; j++) {
                             let obj = newArray[j];
                             if (obj.formGroup === compareObj.formGroup) {
                             state = true;
                             }
                             }
                             }
                             if (!state) {
                             newArray.push(compareObj);
                             }
                             }
                             if (newArray.length > 0) {
                             newArray.forEach(arr => {
                             let dataList = [];
                             let newObj = {};
                             res.datas.forEach(obj => {
                             // 查询表单权限
                             if (!this.KHUtils.isNull(obj.formPermissionList) && obj.formPermissionList.length > 0) {
                             let temp = "";
                             obj.formPermissionList.forEach(obj => {
                             temp += obj.subName + "  ";
                             });
                             obj.permissions = temp;
                             } else {
                             obj.permissions = "全部可见";
                             }
                             if (obj.formGroup === arr.formGroup) {
                             if (this.KHUtils.isNull(obj.formImg)) {
                             obj.formImg = "";
                             obj.showDefault = true;
                             } else {
                             obj.formImg = this.khConfig.api.imageDownload + "/" + obj.formImg;
                             obj.showDefault = false;
                             }
                             dataList.push(obj);
                             }
                             // 时间格式化
                             obj.lastUpdateTime = obj.lastUpdateTime.split(".")[0];
                             });
                             newObj.formGroup = arr.formGroup + "(" + dataList.length + ")";
                             newObj.data = dataList;
                             this.tableData.push(newObj);
                             })
                             }*/
                        }
                    }
                    loading.close();
                });
            },
            // 分配表单
            allotTenantV2(index,row){
              let _this = this;
              _this.formIds = row.formId;
              _this.currentStep = 0;
              _this.isSync = false;
              _this.formDistributeVisible = true;
            },
            // 同步配置
            syncTenant(index,row){
              let _this = this;
              _this.formIds = row.formId;
              _this.currentStep = 0;
              _this.isSync = true;
              _this.formDistributeVisible = true;
            },
            
            
            handleCurrentChange(val){
                this.pageParam.pageNum = val;
                this.listData()
            }
        }
    }
</script>

<style lang="scss" scoped>
    .process-table {
        // element-vue中el-table去除底边
        .el-table td, .el-table th.is-leaf {
            border-bottom: none;
        }

        // element-vue中el-table去除鼠标悬停背景色
        .el-table tbody tr:hover > td {
            background-color: #ffffff !important
        }
    }

   
    
</style>
