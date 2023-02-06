<template>
    <div>
        <el-row
            :key="item.model"
            type="flex"
            :gutter="item.options.gutter ? item.options.gutter : 0"
            :justify="item.options.justify"
            :align="item.options.align">
            <el-row style="width: 100%">
                <el-row style="padding-top: 5px;padding-bottom: 10px;">
                    <el-table
                        :data="tableData"
                        tooltip-effect="dark"
                        style="width: 96%">
                        <el-table-column label="序号" width="60px" type="index">
                        </el-table-column>
                        <template v-for='(col) in dynCols'>
                            <el-table-column
                                sortable
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                               >
                            </el-table-column>
                        </template>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <el-button @click.stop="handleEdit(scope.row)" type="text"
                                           size="small">查看
                                </el-button>
                            </template>
                        </el-table-column>
                    </el-table>
                    <p style="width: 96%;margin: 0 auto" v-if="tableData.length > 0">
                        <el-pagination
                            layout="prev, pager, next"
                            :page-size="queryParam.pageSize"
                            :current-page.sync="queryParam.pageNum"
                            @current-change="handleCurrentChange()"
                            :total="totalPage" style="float: right">
                        </el-pagination>
                    </p>
                </el-row>
            </el-row>
        </el-row>
        <el-row>
            <el-dialog :title="childFormTitle" :visible.sync="childFormVisible" :modal="false"
                       :close-on-click-modal="false" append-to-body width="40%">
                <form-build-process
                    v-if="hackReset"
                    :formId="formId"
                    :data.sync="childFormConfig"
                    :value.sync="childDataModels"
                    ref="childBuildForm">
                    <template v-slot:blank="scope">
                        宽度：
                        <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                        高度：
                        <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                    </template>
                </form-build-process>
                <!--                <div slot="footer" class="dialog-footer">
                                    <el-button type="primary" @click.native="save" :loading="childSaveLoading">保存</el-button>
                                </div>-->
            </el-dialog>
        </el-row>
    </div>
</template>

<script>

    import FormBuildProcess from "@/components/form-build/process/RestructureFormBuildProcess";

    export default {
        name: 'BatchTableDisable', // 子表单数据提交的方式为批量时的查看
        components: {FormBuildProcess},
        // item:子表单配置; (必填)
        // dataConfig:{labelWidth: 100, labelPosition: 'right',  size: 'small'},配置(必填)
        // formId:父表单ID(必填)
        // parentId:父表单的业务ID(必填)
        props: ['item', 'dataConfig', 'formId', 'parentId'],

        created() {
            let _this = this;
            _this.initTableForm();
            if (!_this.KHUtils.isNull(_this.parentId) && !_this.KHUtils.isNull(_this.formId) && _this.parentId !== 0) {
                // 查询子表单的业务数据
                _this.listTableData();
            }
        },
        watch: {
            parentId: {
                deep: true,
                handler(value) {
                    this.listTableData();
                },
            },
        },

        data() {
            return {
                tableData: [],
                queryParam: {
                    pageNum: 1,
                    pageSize: 5
                },
                totalPage: 0,
                multipleSelection: [],
                switchMsgObj: {}, // 开关
                allCols: [],
                dynCols: [],
                hackReset: false,
                childFormConfig: {},
                childDataModels: {},
                childAddOrEdit: false,
                childSaveLoading: false,
                childFormTitle: "",
                childFormVisible: false,
                childBusinessId: "", // 子表单业务数据ID
                childFormKey: "" // 子表单Key
            }
        },

        mounted() {
        },

        methods: {
            // 初始化子表单配置
            initTableForm() {
                let _this = this;
                if (!_this.item.formConfig) {
                    initFormConfig(_this.item, this.dataConfig, _this);
                }
                initDynCols(_this.item, this);

                function initFormConfig(td, config, _this) {
                    let formConfig = {
                        list: [],
                        config: config
                    };
                    if (td.tableColumns && td.tableColumns.length > 0) {
                        td.tableColumns.forEach(tc => {
                            formConfig.list.push(tc);
                        })
                    }
                    _this.childFormConfig = formConfig;
                }

                function initDynCols(td, _this) {
                    _this.dynCols = [];
                    _this.allCols = [];
                    if (td.tableColumns && td.tableColumns.length > 0) {
                        td.tableColumns.forEach(obj => {
                            _this.allCols.push(obj);
                            if (obj.type === 'switch') {
                                _this.switchMsgObj[obj.model] = [obj.options.openMsg, obj.options.closeMsg];
                            }
                            if (obj.type === 'data_select' || obj.type === 'org_select'
                                || obj.type === 'user_select'
                                || obj.type === 'company_select'
                                || obj.type === 'role_select'
                                || obj.type === 'dic_select' || obj.type === 'current_user') {
                                _this.KHForm.processDataSourceControl(obj, _this.dynCols, _this);
                            } else if (obj.type === 'gis_select') {
                                _this.KHForm.processGisControl(obj, _this.dynCols, _this);
                            } else if (obj.type === 'region_select') {
                                _this.KHForm.processRegionControl(obj, _this.dynCols, _this);
                            } else {
                                _this.dynCols.push(obj);
                            }
                        })
                    }
                }
            },
            // 查询列表数据
            listTableData() {
                let _this = this;
                _this.tableData = [];
                _this.queryParam.parentId = _this.parentId;
                _this.$Get(_this.khConfig.api.querySubFormData + "/" + _this.formId + "/" + _this.item.key, _this.queryParam).then(res => {
                    if (res.datas) {
                        _this.tableData = res.datas;
                        _this.totalPage = res.totalCount;
                    }
                });
            },
            // 分页查询
            handleCurrentChange() {
                this.listTableData();
            },
            // 查看
            handleEdit(row) {
                let _this = this;
                let tempRow = _this.KHUtils.clone(row);
                _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                this.childDataModels = tempRow;
                this.childBusinessId = row.id;
                this.childSaveLoading = false;
                this.hackReset = false;
                this.childAddOrEdit = false;
                this.childFormVisible = true;
                this.childFormKey = _this.item.key;
                this.childFormTitle = _this.item.name;
                // 重新渲染子组件
                this.$nextTick(() => {
                    this.hackReset = true
                });
            },
            // 列表显示格式化
            formatCustom(row, column) {
                let _this = this;
                return _this.KHForm.formatCustom(row, column, _this);
            },
        }
    }
</script>
<style lang="scss" scoped>
</style>
