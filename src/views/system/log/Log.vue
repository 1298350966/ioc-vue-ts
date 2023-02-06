<template>
    <el-col class="Log" :span="24" style="padding:15px;">
        <el-row>
            <div style="display:flex;margin-left:10px;" >
              <span class="header-title">日志信息</span>
                <el-form :inline="true">
                    <el-form-item label="开始时间:" >
                        <el-date-picker
                            v-model="params.startTime"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="结束时间:" >
                        <el-date-picker
                            v-model="params.endTime"
                            type="date"
                            value-format="yyyy-MM-dd HH:mm:ss">
                        </el-date-picker>
                    </el-form-item>
                    <el-form-item label="操作者:" >
                        <el-input v-model="params.username" ></el-input>
                    </el-form-item>
                    <el-button type="primary" icon="search" @click="listLogs" >查询</el-button>
                    <el-button @click="handleDeleteMulti" :loading="delLoading" type="danger" >删除</el-button>
                </el-form>
            </div>
            <!-- <el-row style="margin: 10px 0 10px -60px">
                <el-button @click="handleDeleteMulti" :loading="delLoading">删除</el-button>
            </el-row> -->
            <el-row >
                <el-table
                    :data="logs"
                    border
                    stripe
                    @selection-change="handleSelectionChange"
                    style="width: 100%;"
                    :header-cell-style="{background:'#eaf1f7',color:'#606266'}"
                    v-loading="listLoading"
                >
                    <el-table-column type="selection" prop="id" align="center">
                    </el-table-column>
                    <el-table-column label="操作时间" align="center" prop="createTime">
                        <!--           <template slot-scope="scope">
                                       <el-icon name="time"></el-icon>
                                       <span style="margin-left: 10px">{{ KHUtils.formatDateToAdjustIE(new Date(scope.row.createTime),"yyyy-MM-dd hh:mm:ss") }}</span>
                                   </template>-->
                    </el-table-column>
                    <el-table-column prop="username" label="操作者" align="center">
                    </el-table-column>
                    <el-table-column prop="ipPort" label="操作者IP" align="center">
                    </el-table-column>
                    <el-table-column prop="optModule" label="操作功能" align="center">
                    </el-table-column>
                    <el-table-column prop="optContent" label="日志记录" tooltip>
                    </el-table-column>
                </el-table>
                <p style="width: 96%;margin: 0 auto">
                    <el-pagination
                        layout="prev, pager, next"
                        :current-page="params.pageNum"
                        @current-change="handleCurrentChange"
                        :total="totalPage" style="float: right">
                    </el-pagination>
                </p>
            </el-row>
        </el-row>
    </el-col>
</template>
<script type="es6">
    export default {
        data() {
            return {
                listLoading: false,
                totalPage: 0,
                params: {
                    startTime: this.KHUtils.formatDate(new Date(), 'yyyy-MM-dd') + " 00:00:00",
                    endTime: this.KHUtils.formatDate(new Date(new Date().getTime() + 24 * 60 * 60 * 1000 + 1), 'yyyy-MM-dd') + " 00:00:00",
                    username: '',
                    pageNum: 1,
                },
                logs: [],
                multipleSelection: [],
                delLoading: false
            }
        },
        
        mounted() {
            this.listLogs();
        },
        methods: {
            // 日志记录查询
            listLogs() {
                let _this = this;
                if (_this.params.startTime > _this.params.endTime) {
                    _this.$notify({
                        title: '警告',
                        message: '起始日期不能大于截止日期！',
                        type: 'warning'
                    });
                    return false
                }
                _this.listLoading = true;
                _this.$Get(_this.khConfig.api.listOptLog, _this.params).then(res => {
                    _this.totalPage = res.totalCount;
                    _this.logs = res.list;
                    _this.listLoading = false;
                });
            },
            // 分页查询
            handleCurrentChange(val) {
                let _this = this;
                _this.params.pageNum = val;
                _this.listLogs();
            },
            handleSelectionChange(array) {
                let _this = this;
                _this.multipleSelection = array;
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
                _this.$Get(_this.khConfig.api.deleteOptLog, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            _this.$notify({
                                title: '成功',
                                message: '删除成功',
                                type: 'success'
                            });
                            _this.listLogs();
                        }
                        _this.delLoading = false;
                    })
            },
        },
    }
</script>
<style lang="scss" scoped>
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

