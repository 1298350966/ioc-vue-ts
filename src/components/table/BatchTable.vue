<template>
    <div>
        <el-row style="width: 100%">
            <el-button size="mini" @click="addTableRow" icon="el-icon-edit" type="primary">
                添加行
            </el-button>
            <el-button size="mini" @click="handleSelect" icon="el-icon-edit" type="primary" v-if="item.options.dsConf && item.options.dsConf.formId && item.options.dsConf != null  && item.options.dsConf.defaultSelect != true">
                数据选择
            </el-button>
            <el-row style="padding-top: 10px;padding-bottom: 10px;" v-if="refreshForm">
                <el-table :data="item.tableData" size="mini" highlight-current-row border
                          @current-change="handleCurrentTableRow">
                    <el-table-column type="index" width="50"></el-table-column>
                    <template v-if="item.tableColumns.length > 0" v-for="it in item.tableColumns">
                        <el-table-column :label="it.name" :prop="it.model"  width="200">
                            <template slot-scope="scope">
                                <form-build-item-td :key="it.model" :formId="formId"
                                                    :models.sync="scope.row"
                                                    :allCols="allCols"
                                                    @refreshFormView="refreshFormView"
                                                    :box="it"></form-build-item-td>
                            </template>
                        </el-table-column>
                    </template>
                    <el-table-column label="操作" width="80">
                        <template slot-scope="scope">
                            <el-button size="mini" type="danger"
                                       @click="handleDeleteTableRow(scope.$index)">删除
                            </el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
        </el-row>
        <el-dialog title="数据选择" :visible.sync="formDataSelectDialogVisible" :modal="false" v-if="formDataSelectDialogVisible && item.options.dsConf && item.options.dsConf.formId && item.options.dsConf != null"
                   :close-on-click-modal="false" append-to-body width="60%"    custom-class="advanced-set-dialog">
            <form-data-select :formId= "formId" :subKey="item.key" :destFormId="item.options.dsConf.formId" :destSubKey ="item.options.dsConf.subKey" :columns="item.options.dsConf.columns" @closeDialog="closeFormDataSelectDialog"
                              @selectFormData="selectFormData"  :conditions="item.options.dsConf.conditions" :isDefaultSelect="item.options.dsConf.defaultSelect"></form-data-select>

        </el-dialog>
    </div>
</template>

<script>
    import FormBuildItemTd from '@/components/form-build/table/RestructureFormBuildItemTd';
    import { mapGetters } from "vuex";
    import FormDataSelect from "@/components/table/FormDataSelect.vue";
    import FormItem from "@/components/qr-code-set/FormItem";
    export default {
        name: 'BatchTable',  // 子表单数据提交的方式为批量
        components: {FormBuildItemTd,FormDataSelect,FormItem},
        // item:子表单配置; (必填)
        props: ['item','formId'],
        created() {

        },

        data() {
            return {
                allCols:[],
                currentRow: null,
                currentDate:null,
                formDataSelectDialogVisible:false,
                selectDatas:[],
                refreshForm:true

            }
        },
        computed: {
            ...mapGetters({
                user: "getUserInfo",
            })
        },

        mounted() {
            this.initDynCols();
            this.getCurrentDate();
            //默认赋值
            if(this.item.options.dsConf.defaultSelect == true){
                this.formDataSelectDialogVisible = true;
            }
        },

        methods: {
            refreshFormView(){

                this.refreshForm = false;
                this.$nextTick(() => {
                    this.refreshForm = true;
                });
            },
            //数据选择返回数据
            selectFormData(datas){
                let _this = this;
                if(_this.item.options.dsConf.defaultSelect == true){
                    let defaultDatas = [];
                    _this.KHForm.selectDataMapping(_this,_this.allCols,datas,defaultDatas,_this.item);
                    if(defaultDatas instanceof Array && defaultDatas.length >0){
                        defaultDatas.forEach((data,index)=>{
                            this.convertParam(data);
                            this.item.tableData.push(data);
                        })

                    }
                }else {
                    _this.selectDatas = [];
                    _this.KHForm.selectDataMapping(_this,_this.allCols,datas,_this.selectDatas,_this.item);
                    if(_this.selectDatas instanceof Array && _this.selectDatas.length >0){
                        _this.selectDatas.forEach((data,index)=>{
                            _this.item.tableData.push(data);
                        })

                    }
                }
            },
            convertParam(object){
                for(let key of Object.keys(object)){
                    let value = object[key];
                    if(value instanceof Array){
                        object[key] = value.join(",");
                    }else if(value instanceof Object){
                        for (let valueKey of Object.keys(value)){
                            object[valueKey] = value[valueKey];
                        }
                    }

                }
            },
            closeFormDataSelectDialog(){
                this.formDataSelectDialogVisible = false;
            },

            handleSelect(){
                this.formDataSelectDialogVisible = true;
            },

            initDynCols() {
                let _this = this;
                _this.allCols = [];
                if (_this.item.tableColumns && _this.item.tableColumns.length > 0) {
                    _this.item.tableColumns.forEach(obj => {
                        _this.allCols.push(obj);
                    })
                }
            },
            async getCurrentDate(){
                let res = await this.$Get(this.khConfig.api.getCurrentDate);
                if (res.errCode === 0) {
                    this.currentDate = res.currentDate;
                }
            },
            // 添加行
            addTableRow() {
                let _this = this;
                if (_this.item.tableData instanceof Array && _this.item.tableData.length > 99) {
                    _this.$notify.warning({
                        title: '警告',
                        message: '最多只能够添加100行',
                    });
                    return false;
                }
                let newObj = {};
                _this.item.tableColumns.forEach( async obj => {
                    let type = obj.type;
                    if(type === "year" || type === "month" || type === "year_month" || type === "date" || type === "time" || type === "datetime"){
                        if( obj.options.defaultType == 0){
                            let defaultDate = obj.options.defaultValue;
                            if(!_this.KHUtils.isNull(defaultDate)){
                                if( type === "time"){
                                    newObj[obj.model] = defaultDate;
                                }else if(type === "datetime"){
                                    newObj[obj.model] = _this.KHUtils.formatDate(defaultDate,'yyyy-MM-dd hh:mm:ss');
                                }else {
                                    newObj[obj.model] = _this.KHUtils.formatDate(defaultDate,obj.options.format)
                                }
                            }else {
                                newObj[obj.model] = '';
                            }

                        }else if(obj.options.defaultType == 1){
                            if(_this.KHUtils.isNull(_this.currentDate)){
                                //_this.currentDate = new Date;
                                await this.getCurrentDate();
                            }
                            if( type === "time"){
                                newObj[obj.model] = _this.KHUtils.formatDate( _this.currentDate,'hh:mm:ss');
                            }else if(type === "datetime"){
                                newObj[obj.model] = _this.KHUtils.formatDate( _this.currentDate,'yyyy-MM-dd hh:mm:ss');
                            }else {
                                newObj[obj.model] = _this.KHUtils.formatDate( _this.currentDate,obj.options.format)
                            }

                        }else {
                            newObj[obj.model] = obj.options.defaultValue;
                        }
                    }else if(type === "switch"){
                        if( obj.options.defaultValue == true){
                            newObj[obj.model] = "0";
                        }else {
                            newObj[obj.model] = "1";
                        }
                    }else if(type === "multiple_select" || type === "checkbox" ){
                        if( obj.options.defaultValue instanceof Array){
                            newObj[obj.model] =obj.options.defaultValue.join(',');
                        }else {
                            newObj[obj.model] = "";
                        }

                    }else if(type === "current_user"){
                        let userObj = {};
                        userObj[obj.model] = this.user.id;;
                        userObj[obj.label_model] = this.user.realName;
                        newObj[obj.model] = userObj;

                    }else if(type == "user_select" &&  obj.options.defaultCurrentUser){
                        //是否默认当前用户
                        if(_this.KHUtils.isNull(newObj[obj.model])){
                            newObj[obj.model] = {};
                            newObj[obj.model][obj.model] =  _this.user.id;
                            newObj[obj.model][obj.label_model] = _this.user.realName;
                        }
                        //判断是否存在自动赋值
                        _this.KHForm.userSelectAutoAssing(obj,newObj,_this.user,_this.allCols,_this);

                    }else {
                        if(_this.KHUtils.isNull(newObj[obj.model])){
                            newObj[obj.model] =obj.options.defaultValue;
                        }
                    }
                });
                _this.item.tableData.push(newObj);
            },
            // 选中当前行
            handleCurrentTableRow(val) {
                this.currentRow = val;
            },
            // 删除行
            handleDeleteTableRow(index) {
                let _this = this;
                _this.item.tableData.splice(index, 1);
            }
        }
    }
</script>
<style lang="scss" scoped>
    ::v-deep .advanced-set-dialog {
        .el-dialog__body {
            padding: 0px 0px !important;
            background-color: #FFFFFF;
            overflow-y: auto !important;

            /*滚动条里面小方块*/
            &::-webkit-scrollbar-thumb {
                background-color: #EBEAEF;
                border-radius: 10px;
            }
            /*滚动条整体样式*/
            &::-webkit-scrollbar {
                width: 6px;
                height: 6px;
            }
            /*滚动条里面轨道*/
            &::-webkit-scrollbar-track {
                background: #FFFFFF;
                border-radius: 10px;
            }
        }

        .el-dialog__header {
            background-color: #E6EBFE;
            border-bottom: 1px solid #E8E8E8;
            padding-left: 10px !important;
            padding-top: 15px !important;
            padding-bottom: 15px !important;
        }

        .el-dialog__footer {
            padding-top: 5px;
            padding-bottom: 5px;
            background-color: #F8F8FA !important;
        }
    }
</style>
