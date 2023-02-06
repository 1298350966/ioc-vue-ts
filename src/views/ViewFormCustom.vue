<template>
    <section>
        <form-build-view
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
        </form-build-view>
        <template v-if="tableFormConfig.length > 0">
            <el-tabs v-model="formActiveName">
                <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model"
                             :key="item.model">
                    <batch-table-disable v-if="hackReset" :item="item" :data-config="formConfig.config"
                                         :form-id="parentFormId"
                                         :parent-id="parentBusinessId"></batch-table-disable>
                </el-tab-pane>
            </el-tabs>
        </template>
    </section>
</template>

<script>
    import FormBuildView from "@/components/form-build/view/RestructureFormBuildView";
    import SingleTable from "@/components/table/SingleTable";
    import BatchTableDisable from "@/components/table/BatchTableDisable";

    const SHOW_TYPE = "ViewFormCustom";
    export default {
        name: "ViewFormCustom",   //  列表字段点击或操作点击弹窗查看详情
        components: {
            FormBuildView,
            SingleTable,
            BatchTableDisable
        },
        // formId: 指定弹出框的fromId
        // businessId: 关联数据的业务ID
        props: ['formId', 'businessId'],
        created() {
            let _this = this;
            if (_this.KHUtils.isNull(_this.formId)) {
                _this.$notify.error({
                    title: '错误',
                    message: 'ViewFormCustom接收的参数【formId】为空'
                });
                return false;
            }
            if (_this.KHUtils.isNull(_this.businessId)) {
                _this.$notify.error({
                    title: '错误',
                    message: 'ViewFormCustom接收的参数【businessId】为空'
                });
                return false;
            }
            _this.KHForm.loadFormConf(_this, _this.formId, SHOW_TYPE);
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
                addOrEdit: false,
                dynCols: []
            }
        },
        methods: {
            // 查看
            handleView() {
                let param = {
                    "formId": this.formId,
                    "businessId": this.businessId
                };
                this.$Get(this.khConfig.api.getFormDataById, param).then(res => {
                    this.editFormVisible = true;
                    this.parentSaveDisable = false;
                    this.hackReset = false;
                    this.formTitle = "新增";
                    this.addOrEdit = false;
                    let tempRow = this.KHUtils.clone(res.data);
                    this.KHForm.ReversalDynCols(tempRow, this.khConfig.host.rest + this.khConfig.api.imageDownload, this.allCols);
                    this.dataModels = tempRow;
                    this.parentFormId = this.formId;
                    this.parentBusinessId = this.businessId;
                    // 重新渲染子组件
                    this.$nextTick(() => {
                        this.hackReset = true
                    })
                });
            },
        }
    }
</script>

<style lang="scss" scoped>
</style>
