<template>
    <section>
        <!--查询和新增数据报表头部区域-->
        <el-row style="padding: 0 15px 10px 0">
          <el-col :span="24">
             <div style="width: 98%;">

                <span style="float: left;margin-left: 20px">数据报表</span>
                <el-button style="float: right;margin-right: 30px;" icon="el-icon-plus" @click="showReportDesign(null)">新增报表</el-button>
                <el-input style="width: 250px;float: right" placeholder="名称" v-model="reKeyWord"
                          @blur="listReports"
                          prefix-icon="el-icon-search">
                </el-input>
             </div>

            </el-col>
        </el-row>
        <!--数据报表列表-->
        <el-row>
            <el-col :span="24">
                <el-table v-loading="reLoading" :data="reportData" highlight-current-row border stripe
                          style="width: 98%"  :default-sort = "{prop: 'lastUpdateTime', order: 'descending'}">
                    <el-table-column label="名称" align="center" prop="reportName"></el-table-column>
                    <el-table-column label="发布状态" align="center">
                        <template slot-scope="scope">
                            <template v-if="scope.row.state === 1">
                                <i class="el-icon-time"></i>
                                <span style="margin-left: 10px">未发布</span>
                            </template>
                            <template v-if="scope.row.state === 2">
                                <i class="el-icon-success" style="color: #2BC048"></i>
                                <span style="margin-left: 10px">已发布</span>
                            </template>
                            <template v-if="scope.row.state === 3">
                                <i class="el-icon-bottom"></i>
                                <span style="margin-left: 10px">已下线</span>
                            </template>
                            <template v-if="scope.row.state === 4">
                                <i class="el-icon-s-claim" style="color: #6CA0F5"></i>
                                <span style="margin-left: 10px">已保存未发布</span>
                            </template>
                            <!--                <template v-if="scope.row.state === 5">
                                                <i class="el-icon-success" style="color: #2BC048"></i>
                                                <span style="margin-left: 10px">保存已发布</span>
                                            </template>-->
                        </template>
                    </el-table-column>
                    <el-table-column label="创建者" align="center" prop="userName">
                    </el-table-column>
                    <el-table-column label="修改人" align="center" prop="lastUpdateUserName">
                    </el-table-column>
                    <el-table-column label="修改时间" align="center" prop="lastUpdateTime">
                    </el-table-column>
                    <!--              <el-table-column label="修改人/修改时间" align="center" prop="lastUpdateUserName">
                                      <template slot-scope="scope">
                                          <p>{{scope.row.lastUpdateUserName}}</p>
                                          <p style="color: silver">{{scope.row.lastUpdateTime}}</p>
                                          &lt;!&ndash;                         {{scope.row.lastUpdateUserName}}/{{scope.row.lastUpdateTime}}&ndash;&gt;
                                      </template>
                                  </el-table-column>-->
                    <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-tooltip effect="dark" content="编辑" placement="bottom">
                                <el-button @click.stop="showReportDesign(scope.row)" type="text" size="small"
                                           icon="el-icon-edit"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="权限" placement="bottom">
                                <el-button @click="openPermissionDialog(scope.row)" type="text" size="small"
                                           icon="el-icon-key"></el-button>
                            </el-tooltip>
                            <el-tooltip effect="dark" content="菜单" placement="bottom">
                                <el-button @click.stop="menuSet(scope.row)" type="text" size="small" icon="el-icon-menu"></el-button>
                            </el-tooltip>
                        </template>
                    </el-table-column>
                </el-table>
            </el-col>
        </el-row>
        <!--分页-->
        <el-row>
            <el-col :span="6" :offset="16">
                <el-pagination v-if="totalCount > 10"
                               :total="totalCount"
                               :page-size="pageSize"
                               :current-page.sync="pageNum"
                               layout="total,prev, pager, next"
                               @current-change="handleCurrentChange">
                </el-pagination>
            </el-col>
        </el-row>
        <!--报表设计-->
        <el-dialog title="设置报表权限" :visible.sync="reportPermissionVisible">
            <ore-transfer :formPermissions="permissions"
                          @getCheckedNodesFromOrgUserTree="saveReportPermission"></ore-transfer>
        </el-dialog>
        <report-design v-if="reportDesignVisible" @goBack="refreshReportConf"
                       :data-conf="currentDataConf"></report-design>
      <el-dialog
        class="myMenuDialog"
        title="菜单设置"
        :visible.sync="menuDialogVisible"
        width="80%"
         >
        <report-menu-setting  :report-id="reportId" :report-name="reportName" :notify-save="notifySaveMenu" @notifyParentClose="notifyParentClose"></report-menu-setting>
        <span slot="footer" class="dialog-footer">
         <el-button @click="menuDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="saveMenu">确 定</el-button>
        </span>
      </el-dialog>
    </section>
</template>

<script>
    import ReportDesign from "@/components/report/ReportDesign";
    import OreTransfer from "@/components/OreTransfer";
    import ReportMenuSetting from "@/components/report/ReportMenuSetting";

    export default {
        name: "DataReport",
        data() {
            return {
                reLoading: false,
                reportPermissionVisible: false,
                reportData: [],
                reKeyWord: "", //搜索的关键字
                totalCount: 0,
                pageNum: 1,
                pageSize: 10,
                pageIsShow: false,
                reportDesignVisible: false,
                currentDataConf: {},
                permissions: [],
                menuDialogVisible:false,
                reportId:"",
                reportName:"",
                notifySaveMenu:0
            }
        },
        components: {
            OreTransfer,
            ReportDesign,
          ReportMenuSetting
        },
        mounted() {
            this.listReports()
        },
        methods: {
            //查询报列表
            listReports() {
                let _this = this;
                _this.reportData = [];
                let param = {
                    pageNum: _this.pageNum,
                    pageSize: 10
                };
                if (!_this.KHUtils.isNull(_this.reKeyWord)) {
                    param.reportName = _this.reKeyWord;
                }
                _this.reLoading = true;
                _this.$Get(_this.khConfig.api.queryReportConf, param).then(res => {
                    if (res.errCode === 0) {
                        if (res.dataReports instanceof Array) {
                            _this.reportData = res.dataReports;
                            _this.totalCount = res.totalCount;
                            _this.pageNum = res.pageNum;
                            _this.pageSize = res.pageSize;
                        }
                    }
                    _this.reLoading = false;
                })
            },
            //下一页
            handleCurrentChange(val) {
                let _this = this;
                _this.pageNum = val;
                _this.listReports()
            },
            openPermissionDialog(row) {
                this.reportId = row.reportId;
                let param = {
                    reportId: row.reportId
                };
                this.$Get(this.khConfig.api.queryReportPermission, param).then(res => {

                    let datas = res.datas;
                    let arr = [];
                    datas.forEach((value) => {
                        let obj = {
                            type: value.type,
                            id: value.subId,
                            name: value.subName
                        };
                        arr.push(obj);
                    });
                    this.permissions = arr;
                    this.reportPermissionVisible = true;
                });
            },
            saveReportPermission(permission) {
                let reportPermission = {};
                this.$set(reportPermission, 'reportId', this.reportId);
                let arr = [];
                permission.forEach((value) => {
                    let obj = {
                        type: value.type,
                        subId: value.id,
                        subName: value.name
                    };
                    arr.push(obj);
                });
                this.$set(reportPermission, 'permissions', arr);
                this.$PostJson(this.khConfig.api.saveReportPermission, reportPermission).then(res => {
                    if (res.errCode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '操作成功',
                            type: 'success'
                        });
                        this.reportPermissionVisible = false;
                    }
                });
            },
            showReportDesign(item) {
                let _this = this;
                _this.reportDesignVisible = true;
                if (item != null) {
                    _this.currentDataConf = item;
                } else {
                    _this.currentDataConf = {};
                }
            },
            refreshReportConf() {
                let _this = this;
                _this.reportDesignVisible = false;
                _this.listReports();
            },
            menuSet(row){
                this.menuDialogVisible = true;
                this.reportId = row.reportId;
                this.reportName = row.reportName;
            },
            saveMenu(){
                this.notifySaveMenu++;
            },
            notifyParentClose(){
                this.menuDialogVisible = false;
            }
        }
    }
</script>

<style scoped>
   .myMenuDialog >>>.el-dialog__body {
    padding: 20px 15px;

  }
</style>
