<template>
    <el-row v-if="visible" class="custom-dialog-form-group">
        <!--新增表单分组-->
        <el-dialog title="新增表单分组" :visible.sync="addFormGroupVisible" width="50%"
                   :close-on-click-modal="closeOnClickModal" @close="notifyParentClose" append-to-body>
            <el-form :model="formGroup" label-width="80px" :rules="formGroupRules" ref="formGroup">
                <el-row>
                    <el-col :span="1">&nbsp;</el-col>
                    <el-col :span="22">
                        <el-form-item label="分组名称" prop="groupName">
                            <!--  onkeypress="if(event.keyCode == 13) return false;" 解决按回车刷新的问题-->
                            <el-input v-model="formGroup.groupName" onkeypress="if(event.keyCode === 13) return false; "
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
        name: "FormGroupAdd",
        // visible: 控制显示隐藏
        props: ['visible'],
        data() {
            return {
                // 新增或编辑控制显示隐藏
                addFormGroupVisible: true,
                addFormGroupLoading: false,
                // 提交参数
                formGroup: {},
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
            // console.log("Add visible:" + this.visible);
        },
        methods: {
            // 关闭Dialog并通知父组件修改属性为false
            notifyParentClose() {
                this.$emit("changeFormGroupVisible");
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
                                        // 通知父组件刷新添加完成后的列表信息
                                        this.$emit("listFormGroup", this.formGroup.groupName);
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
    .custom-dialog-form-group ::v-deep .el-dialog__body {
        padding: 10px 10px
    }
</style>
