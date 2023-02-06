<template>
    <el-row v-if="visible" class="form-group">
        <el-dialog title="表单分组管理"
                   custom-class="custom-dialog-form-group"
                   :visible.sync="formVisible"
                   :close-on-click-modal="closeOnClickModal"
                   width="50%"
                   @close="notifyParentClose"
        >
            <el-row style="margin: 10px 0 10px 0">
                <el-button @click="handAddFormGroup">新增</el-button>
                <el-button @click="handleDeleteMulti" :loading="delLoading">删除</el-button>
            </el-row>
            <el-table
                :data="data"
                @selection-change="handleSelectionChange"
                highlight-current-row
                @row-click="handleEditFormGroup"
                border
                stripe
            >
                <el-table-column type="selection" width="55" prop="id" header-align="center" align="center">
                </el-table-column>
                <el-table-column prop="groupName" label="分组名称" header-align="center" align="center">
                </el-table-column>
                <!--           <el-table-column prop="groupIndex" label="排序号" header-align="center" align="center">
                           </el-table-column>-->
            </el-table>
        </el-dialog>
        <!--编辑或新增表单分组-->
        <el-dialog :title="formGroupTitle" :visible.sync="addFormGroupVisible" width="50%"
                   :close-on-click-modal="closeOnClickModal">
            <el-form :model="formGroup" label-width="80px" :rules="formGroupRules" ref="formGroup">
                <el-row>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="22">
                        <el-form-item label="分组名称" prop="groupName">
                            <el-input v-model="formGroup.groupName"
                                      onkeypress="if(event.keyCode === 13) return false; "
                                      style="width: 50%"></el-input>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="addFormGroup" :loading="addFormGroupLoading">保存</el-button>
            </div>
        </el-dialog>
    </el-row>
</template>

<script>
    export default {
        name: "FormGroupDialog",
        // visible: 控制显示隐藏
        // data: 分组信息
        props: ['visible', 'data'],
        data() {
            return {
                formVisible: true,
                formGroupTitle: "",
                formGroupVisible: false,
                multipleSelection: [],
                // 新增或编辑控制显示隐藏
                addFormGroupVisible: false,
                addFormGroupLoading: false,
                delLoading: false,
                // 提交参数
                formGroup: {
                    groupName: ""
                },
                // 是否可以通过点击 modal关闭Dialog
                closeOnClickModal: false,
                formGroupRules: {
                    groupName: [
                        {required: true, message: '请输入分组名称', trigger: 'blur'},
                    ],
                },
            }
        },
        mounted() {
            // console.log("visible:" + this.visible);
        },
        methods: {
            // 关闭Dialog并通知父组件修改属性为false
            notifyParentClose() {
                this.$emit("changeFormGroupVisible");
            },
            // 删除选中的多条记录
            handleDeleteMulti() {
                if (this.multipleSelection === "" || this.multipleSelection.length === 0) {
                    this.$notify({
                        title: '警告',
                        message: '请选择要删除的记录',
                        type: 'warning'
                    });
                } else {
                    this.$confirm('确认删除该记录吗?', '提示', {}).then(() => {
                        this.delLoading = true;
                        let readyToDeleteIds = [];
                        if (this.multipleSelection instanceof Array) {
                            for (let item of this.multipleSelection) {
                                readyToDeleteIds += item.groupId + ","
                            }
                        } else {
                            readyToDeleteIds.push(this.multipleSelection.groupId)
                        }
                        let param = {
                            ids: readyToDeleteIds
                        };
                        this.$Get(this.khConfig.api.deleteFormGroup, param)
                            .then(res => {
                                if (res.errCode === 0) {
                                    // 通知父组件刷新
                                    this.$emit("listFormGroup");
                                    this.$notify({
                                        title: '成功',
                                        message: '删除成功',
                                        type: 'success'
                                    });
                                }
                                this.delLoading = false;
                            })
                    }).catch((e) => {
                        console.log(e)
                    })
                }
            },
            // 勾选触发事件
            handleSelectionChange(array) {
                let delArray = [];
                for (let i = 0, n = array.length; i < n; i++) {
                    let obj = array[i];
                    let param = {
                      groupName: obj.groupName
                    };
                    this.$Get(this.khConfig.api.listFormConfByGroup, param)
                        .then(res => {
                            if (res.errCode === 0 && res.datas != null && res.datas.length > 0) {
                                this.$notify({
                                    title: '警告',
                                    message: '所选择要删除的' + obj.groupName + '分组下有表单关联,若必须要删除,请先删除分组下的表单再进行操作',
                                    type: 'warning'
                                });
                            } else if (res.errCode === 0 && res.datas != null && res.datas.length === 0) {
                                delArray.push(obj);
                            }
                        })
                }
                this.multipleSelection = delArray;
            },
            // 新增分组信息
            handAddFormGroup() {
                this.formGroupTitle = "新增表单分组";
                this.addFormGroupVisible = true;
                this.formGroup = {};
            },
            // 编辑分组信息
            handleEditFormGroup(row) {
                this.formGroupTitle = "编辑表单分组";
                this.addFormGroupVisible = true;
                this.formGroup.groupName = row.groupName;
                this.formGroup.groupId = row.groupId;
            },
            // 保存提交
            addFormGroup() {
                this.$refs.formGroup.validate((valid) => {
                    if (valid) {
                        this.$confirm('确认提交吗？', '提示', {}).then(() => {
                            this.addFormGroupLoading = true;
                            let url = "";
                            if (this.KHUtils.isNull(this.formGroup.groupId)) {
                                // 新增
                                this.formGroup.groupId = "";
                                url = this.khConfig.api.addFormGroup;
                            } else {
                                url = this.khConfig.api.updateFormGroup;
                            }
                            this.$Get(url, this.formGroup)
                                .then(res => {
                                    if (res.errCode === 0) {
                                        // 通知父组件刷新
                                        this.$emit("listFormGroup");
                                        this.$notify({
                                            title: '成功',
                                            message: '操作成功',
                                            type: 'success'
                                        });
                                    }
                                    this.addFormGroupLoading = false;
                                    this.addFormGroupVisible = false;
                                })
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
    .form-group ::v-deep .custom-dialog-form-group {
        .el-dialog__body {
            padding: 10px 10px
        }
    }
</style>
