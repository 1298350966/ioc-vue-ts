<template>
    <section>
        <el-dialog :title="formTitle" :visible.sync="editFormVisible"
                   :close-on-click-modal="closeOnClickModal" fullscreen>
            <form-build
                v-if="hackReset"
                :data.sync="formConfig"
                :value.sync="dataModels"
                :addOrEdit.sync="addOrEdit"
                ref="buildForm">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build>
            <template v-if="tableFormConfig.length > 0">
                <el-tabs v-model="formActiveName">
                    <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model"
                                 :key="item.model">
                        <single-table v-if="hackReset" :item="item" :data-config="formConfig.config"
                                      :form-id="parentFormId"
                                      :parent-id="parentBusinessId"></single-table>
                    </el-tab-pane>
                </el-tabs>
            </template>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="saveData" :loading="nextLoading" :disabled="parentSaveDisable">
                    保存
                </el-button>
            </div>
        </el-dialog>
    </section>
</template>

<script>
    import FormBuild from "@/components/form-build/FormBuild";
    import SingleTable from "@/components/table/SingleTable";
    
    const SHOW_TYPE = "AddFormCustom";
    export default {
        name: "AddFormCustom",
        components: {
            FormBuild,
            SingleTable
        },
        created() {
            let _this = this;
            _this.KHForm.loadFormConf(_this, "", SHOW_TYPE);
        },
        data() {
            return {
                switchMsgObj: {},
                formActiveName: "", // 子表单页签
                allCols: [], // 所有拉取的控件
                tableFormConfig: [],        // 子表单控件集合
                parentSaveDisable: false,
                parentFormId: 0,
                parentBusinessId: 0,
                nextLoading: false,
                closeOnClickModal: false,     // 是否可以通过点击 modal关闭Dialog
                formTitle: "新增",
                editFormVisible: false,
                formConfig: {},
                dataModels: {},
                blank: '',
                hackReset: false,
                formId: 0,             // 表单ID
                addOrEdit: false,
                dynCols: []
            }
        },
        methods: {
            // 保存数据
            saveData() {
                let _this = this;
                _this.KHForm.saveData(_this, SHOW_TYPE);
            }
        }
    }
</script>

<style lang="scss" scoped>
</style>
