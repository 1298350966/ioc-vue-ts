<template>
    <el-row>
        <div v-if="tableData.length === 0" style="top: 200px">
            <div class="el-table__empty-block" style="height: 100%; width: 100%;">
                <span class="el-table__empty-text">暂无数据</span>
            </div>
        </div>
        <el-table
            class="process-table"
            v-for="(item, index) in tableData"
            :key="index"
            :data="item.data"
            empty-text="暂无数据"
            tooltip-effect="dark">
            <el-table-column :label="item.formGroup" type="index" width="600px">
                <template slot-scope="scope">
                    <img alt=" " :src="scope.row.formImg"
                         v-if="!scope.row.showDefault"/>
                    <img alt=" " src="../../assets/images/default-icon.png"
                         v-if="scope.row.showDefault" @click="notifyParent(scope.row)"/>
                    <div class="process-table-box" @click="notifyParent(scope.row)">
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
                            <h4 @click="notifyParent(scope.row)">可见范围</h4>
                            <p @click="notifyParent(scope.row)"
                               style="overflow: hidden;text-overflow: ellipsis;  display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2">
                                {{ scope.row.permissions}}</p>
                        </el-col>
                    </el-row>
                </template>
            </el-table-column>
            <el-table-column label="">
                <template slot-scope="scope">
                    <el-button v-if="!showManageProcess" @click="notifyParent(scope.row)" type="text" size="small">
                        发起申请
                    </el-button>
                    <el-button v-if="showManageProcess" @click="notifyParent(scope.row)" type="text" size="small"
                               :disabled="scope.row.flag===1">编辑
                    </el-button>
                    <el-button v-if="showManageProcess" @click="handleDisabled(scope.row)" type="text" size="small"
                               :disabled="scope.row.flag===1">停用
                    </el-button>
                    <el-button v-if="showManageProcess" @click="handleEnable(scope.row)" type="text" size="small"
                               :disabled="scope.row.flag ===0">启用
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-row>
</template>

<script>

    export default {
        name: "FormConfTableV2",
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
                tableData: []
            };
        },
        watch: {
            list() {
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
            // 查询流程相关的表单数据
            listData() {
                const loading = this.$loading({
                    lock: true,
                    text: '拼命加载中..',
                    spinner: 'el-icon-loading',
                    background: 'transparent'
                });
                // 对提交的参数进行处理
                let param={};
                if(this.nameOrGroup.formName!=="" && this.nameOrGroup.formName!==null){
                  param.formName=this.nameOrGroup.formName;
                }
                if(this.nameOrGroup.formGroup!=="" && this.nameOrGroup.formGroup!==null){
                  param.formGroup=this.nameOrGroup.formGroup;
                }
                if(this.nameOrGroup.formStatus!=="" && this.nameOrGroup.formStatus!==null){
                  param.flag=this.nameOrGroup.formStatus;
                }
                let params=Object.assign(param,{formType:this.formType,pageNum:1,pageSize:1000});
                // 流程表单类型查询
                this.$Get(this.khConfig.api.listFormConfWithPermission, params).then(res => {
                    if (res.errCode === 0) {
                        this.tableData = [];
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            // 表单分组
                            let newArray = [];
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
                                                obj.formImg = this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + obj.formImg;
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
                            }
                        }
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
    }
</style>
