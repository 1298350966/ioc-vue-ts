<template>
    <div style="padding: 20px">
        <div>
            <el-input placeholder="请输入查询条件" v-model="condition" class="input-with-select" v-if="conditions instanceof Array && conditions.length >0" style="width: 250px">
                <el-button slot="append" icon="el-icon-search" @click="queryFormData"></el-button>
            </el-input>
            <el-table
                stripe
                :data="tableData"
                v-loading="tableDataLoading"
                tooltip-effect="dark"
                @selection-change="handleSelectionChange"
                style="width: 100%;margin-top: 20px"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}"
            >
                <el-table-column type="selection" width="55px"
                ></el-table-column>
                <el-table-column label="序号" width="60px" type="index">
                </el-table-column>
                <template v-for='(col) in columns'>
                    <el-table-column show-overflow-tooltip
                                     :prop="col.column"
                                     :label="col.name"
                                     :key="col.column"
                    >
                        <template slot-scope="scope">
                            <span >{{scope.row[col.column] | arrayJsonVal }}</span>
                        </template>
                    </el-table-column>
                </template>
            </el-table>

            <div>
                <div style="width: 96%;margin: 0 auto;min-height: 40px">
                    <el-pagination
                        background
                        :current-page="queryCommonDataParam.pageNum"
                        @current-change="handleCurrentChange"
                        :page-size="queryCommonDataParam.pageSize"
                        layout="prev, pager, next"
                        :total="totalPage"  style="float: right">
                    </el-pagination>
                </div>
            </div>

        </div>
        <div style="float: right;margin:20px">
            <el-button @click="$emit('closeDialog')">取 消</el-button>
            <el-button type="primary" @click="saveSelectFormData">确 定</el-button>
        </div>


    </div>
</template>

<script>
    export default {
        /*isDataRef 是否为数据引用控件
        *   * isDefaultSelect 默认自动选择
        *   */
        props: ['formId', 'subKey','destFormId','destSubKey', 'columns','isDataRef','isDefaultSelect','conditions'],
        created() {
            if (this.formId == null) {
                return false;
            }
            //
            if(this.isDefaultSelect){
                this.queryCommonDataParam.pageSize = 50;
            }
            this.getDataSource();
        },
        mounted() {
        },
        data() {
            return {
                tableData: [],
                tableDataLoading: false,
                totalPage: 0,
                queryCommonDataParam: {
                    pageNum: 1,    // 查询参数
                    pageSize: 10
                },
                condition:"",
                selectFormData: []
            }
        },
        methods: {
            handleSelectionChange(val){
                this.selectFormData = [];
                this.selectFormData = val;
            },
            saveSelectFormData(){
                this.$emit('closeDialog');
                this.$emit('selectFormData', this.selectFormData);

            },
            handleCurrentChange(val) {
                this.queryCommonDataParam.pageNum = val;
                this.getDataSource();
            },
            getDataSource(){
                let _this = this;
                _this.tableDataLoading = true;
                _this.tableData = [];
                _this.queryFormDataForChoose();

            },
            queryFormData(){
                this.queryCommonDataParam.pageNum = 1;
                this.getDataSource();
            },
            //查询主表单数据
            queryFormDataForChoose(){
                let _this = this;
                let postJsParam = {
                    "formId": _this.formId,
                    "key": _this.subKey,
                    "destFormId": _this.destFormId,
                    "destSubKey": _this.destSubKey,
                    "pageNum": _this.queryCommonDataParam.pageNum,
                    "pageSize": _this.queryCommonDataParam.pageSize,
                    "condition":_this.condition

                };
                if(_this.isDataRef == true){
                    postJsParam.keyType = 0;
                }else {
                    postJsParam.keyType = 1;
                }
                this.$Get(this.khConfig.api.queryFormDataForChoose, postJsParam).then(res => {
                    _this.tableDataLoading = false;
                    if (res.errCode === 0) {
                        this.tableData = res.datas;
                        this.totalPage = res.totalCount;

                        //默认自动选择
                        if(this.isDefaultSelect){
                            this.selectFormData = [];
                            this.selectFormData = this.tableData;
                            this.saveSelectFormData();
                        }
                    }
                });
            },


        }

    }
</script>

<style>

</style>
