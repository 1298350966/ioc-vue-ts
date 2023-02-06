<template>
    <el-row>
        <!-- <div v-if="tableData.length === 0" class="el-table__body-wrapper is-scrolling-none" style="top: 200px">
            <div class="el-table__empty-block" style="height: 100%; width: 100%;">
                <span class="el-table__empty-text">暂无数据</span>
            </div>
        </div> -->
        <el-table
            class="process-table"
            :data="tableData"
            empty-text="暂无数据"
            tooltip-effect="dark"
            @row-click="notifyParent"
            >
            <el-table-column  type="index" width="600px">
                <template slot-scope="scope">
                    <img alt=" " :src="scope.row.formImg"
                         v-if="!scope.row.showDefault"/>
                    <img alt=" " src="../../assets/images/default-icon.png"
                         v-if="scope.row.showDefault" />
                    <div class="process-table-box">
                        <h4>{{ scope.row.formName }}</h4>
                        <p>{{ scope.row.formComment }}</p>
                        <p>{{ scope.row.lastUpdateTime }} 更新</p>
                    </div>
                </template>
            </el-table-column>
            <el-table-column label=" ">
                <template slot-scope="scope">
                    <el-row class="second-column">
                        <el-col :span="12">
                            <h4 >可见范围</h4>
                            <p 
                               style="overflow: hidden;text-overflow: ellipsis;  display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2">
                                {{ scope.row.permissions}}</p>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="">
                <template slot-scope="scope">
                    <el-button v-if="!showManageProcess" @click.stop="notifyParent(scope.row)" type="text" size="small">
                        发起申请
                    </el-button>
                    <el-button v-if="showManageProcess" @click.stop="notifyParent(scope.row)" type="text" size="small"
                               :disabled="scope.row.flag===1">编辑
                    </el-button>
                    <el-button v-if="showManageProcess" @click.stop="handleDisabled(scope.row)" type="text" size="small"
                               :disabled="scope.row.flag===1">停用
                    </el-button>
                    <el-button v-if="showManageProcess" @click.stop="handleEnable(scope.row)" type="text" size="small"
                               :disabled="scope.row.flag ===0">启用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination
            background
            @size-change="handleSizeChange"
            :current-page.sync="queryParam.pageNum"
            :page-sizes="[10, 15, 20, 50]"
            :page-size.sync="queryParam.pageSize"
            layout="total, sizes, prev, pager, next, jumper"
            :total="totalCount"
            style="margin-top:15px;float:right;">
        </el-pagination>
    </el-row>
</template>

<script>

    export default {
        name: "FormConfTable",
        // formType: 区分普通表单 Or 流程表单 ;
        // list: 监听父组件是否需要刷新列表
        // showManageProcess: 流程表单设计是否显示可管理操作按钮
        // props: ['formType', 'list', 'showManageProcess','nameOrGroup'],
        props:{
          formType:{
            type:String,
            default:"0"
          },
          list:{
            type:Number,
            default:0
          },
          showManageProcess:{
            type:Boolean,
            default:false
          },
          nameOrGroup:{
            tyep:Object,
            default(){
              return{
                formName:'',
                formGroup:'',
                formStatus:'',
              }
            }
          }
        },
        data() {
            return {
                tableData: [],
                // 分页相关
                queryParam:{
                    pageNum:1,
                    pageSize:10,
                },
                totalCount:0,

            };
        },
        watch: {
            list() {
                this.listData();
            },
            "queryParam.pageNum"(){
                this.listData();
            }
        },
        mounted() {
            this.listData();
        },
        methods: {
            // 通知父组件
            notifyParent(row) {
                if (this.KHUtils.isNull(this.formType)) {
                    return false;
                }
                // 通知父组件
                if ("0" === this.formType) {
                    this.$emit("handleEdit", row);
                } else {
                    this.$emit("handleOperate", row);
                }
            },
            // 停用表单
            handleDisabled(row) {
                this.$confirm('确认停用此表单吗？', '提示', {}).then(() => {
                    this.$Get(this.khConfig.api.disableForm + "/" + row.formId)
                        .then(res => {
                            if (res.errCode === 0) {
                                this.listData();
                                this.$notify({
                                    title: '成功',
                                    message: '停用表单成功',
                                    type: 'success'
                                });
                            }
                        })
                }).catch((e) => {
                    console.log(e)
                });
            },
            // 启用表单
            handleEnable(row) {
                this.$confirm('确认启用此表单吗？', '提示', {}).then(() => {
                    this.$Get(this.khConfig.api.enableForm + "/" + row.formId)
                        .then(res => {
                            if (res.errCode === 0) {
                                this.listData();
                                this.$notify({
                                    title: '成功',
                                    message: '启用表单成功',
                                    type: 'success'
                                });
                            }
                        })
                }).catch((e) => {
                    console.log(e)
                });
            },
            handleSizeChange(val){
                this.queryParam.pageSize = val;
                this.listData();
            },

            // 根据formType分页查询流程相关或普通表单数据
             listData() {
                const loading = this.$loading({
                    lock: true,
                    text: '拼命加载中..',
                    spinner: 'el-icon-loading',
                    background: 'transparent'
                });
                // 对提交的参数进行处理
                let param={
                    pageSize:this.queryParam.pageSize,
                    pageNum:this.queryParam.pageNum
                };
                if(this.nameOrGroup.formName!=="" && this.nameOrGroup.formName!==null){
                  param.formName=this.nameOrGroup.formName;
                }
                if(this.nameOrGroup.formGroup!=="" && this.nameOrGroup.formGroup!==null){
                  param.formGroup=this.nameOrGroup.formGroup;
                }
                if(this.nameOrGroup.formStatus!=="" && this.nameOrGroup.formStatus!==null){
                  param.flag=this.nameOrGroup.formStatus;
                }
                let params=Object.assign(param,{formType:this.formType});
                // 流程表单类型查询
                this.$Get(this.khConfig.api.listFormConf, params).then(res => {
                    if (res.errCode === 0) {
                        this.tableData = res.datas.map(item=>{
                            let obj = {...item};
                            // 查询表单权限
                            if (!this.KHUtils.isNull(item.formPermissionList) && item.formPermissionList.length > 0) {
                                let temp = "";
                                item.formPermissionList.forEach(e => {
                                    temp += e.subName + "  ";
                                });
                                obj.permissions = temp;
                            } else {
                                obj.permissions = "全部可见";
                            }
                            //图片字段显示处理
                            if(this.KHUtils.isNull(item.formImg)){      
                                obj.showDefault = true;
                            }else{
                                obj.showDefault = false;
                                obj.formImg = this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + item.formImg;
                            }
                            //时间类型格式处理
                            obj.lastUpdateTime = item.lastUpdateTime.split(".")[0];     
                            return obj;
                        });
                        this.totalCount = res.totalCount;
                    }
                    loading.close();
                });
            },
        }
    }
</script>
<style lang="scss" scoped>
    .process-table {
        //头部
        ::v-deep  & thead {
            & th {
            color: #000000;
            font-size: 13px;
            padding-top: 10px;
            padding-bottom: 10px;
            background: #eaf1f7;
            }
        }
        // element-vue中el-table去除底边
        .el-table td, .el-table th.is-leaf {
            border-bottom: none;
        }

        // element-vue中el-table去除鼠标悬停背景色
        .el-table tbody tr:hover > td {
            background-color: #ffffff !important
        }

        :deep(.el-table__header){
            display: none;
        }
    }
</style>
