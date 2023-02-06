<template>
    <div class="widget-div">
        <el-row v-if="!readOnly">
            <el-button type="primary" @click="openDataSelect">选择</el-button>
            <i class="el-icon-delete" style="float: right" @click="cleanData"></i>
        </el-row>
        <template  >
            <div>
                <el-link type="primary" style="margin-right: 10px" @click="openFormDetail(item.k)"  v-for="(item,key) in getDataModel" :key="key">{{item.v}}</el-link>

            </div>
        </template>

        <el-dialog style="overflow:hidden;" title="数据选择" :visible.sync="formDataSelectDialogVisible" :modal="false" v-if="formDataSelectDialogVisible && box.options.dsConf && box.options.dsConf.formId && box.options.dsConf != null"
                   :close-on-click-modal="false" append-to-body top="10vh" width="60%" custom-class="advanced-set-dialog">
            <form-data-select :formId="formId" :subKey="box.key" :destFormId="box.options.dsConf.formId" :destSubKey ="box.options.dsConf.subKey" :columns="box.options.dsConf.columns" @closeDialog="closeFormDataSelectDialog"
                              @selectFormData="selectFormData" :isDataRef=true :conditions="box.options.dsConf.conditions"></form-data-select>

        </el-dialog>
        <el-dialog title="详情" :visible.sync="formDetailVisible" :close-on-click-modal="false" v-if="formDetailVisible"
                   :append-to-body="true"
                   width="60%"
                   class="advanced-set-dialog">
            <form-detail :formId="box.options.dsConf.formId" :dataId="dataId"></form-detail>
        </el-dialog>
        <el-dialog title="详情" :visible.sync="subTableDetailVisible" :close-on-click-modal="false" v-if="subTableDetailVisible"
                   :append-to-body="true"
                   width="60%"
                   class="advanced-set-dialog">
            <sub-table-detail :formId="box.options.dsConf.formId" :dataId="dataId" :subKey="box.options.dsConf.subKey"></sub-table-detail>
        </el-dialog>
    </div>
</template>

<script>
    import FormDataSelect from "@/components/table/FormDataSelect.vue";
    import FormDetail from "@/components/FormDetail.vue";
    import SubTableDetail from "@/components/SubTableDetail.vue";
    export default {
        name:"MDataRefWidget",
        components: {
            FormDataSelect,
            FormDetail,
            SubTableDetail
        },
        props:{
            dataModel:{
                type:String
            },
            box:{
                type:Object
            },
            formId:{
                type:Number
            },
            defaultSelect:{
                type:Boolean,
                default:false
            },
            readOnly:{
                type:Boolean,
                default:false
            }
        },
        computed: {
            
            getDataModel: {
                get(){
                    if(this.KHUtils.isNull(this.dataModel)){
                        return [];
                    }else {

                        let datas = JSON.parse(this.dataModel);
                        return datas;
                    }
                }
            },
        },
        watch: {
            dataModel: {
                deep: true,
                handler(value) {
                    if (this.KHUtils.isNull(value)) {
                        this.selectDatas = [];
                    } else {
                        let datas = JSON.parse(value);
                        if (datas instanceof Array && datas.length > 0) {
                            datas.forEach((data, index) => {
                                this.selectDatas.push(data);
                                //this.$set(this.selectDatas, data);
                            })

                        }
                    }
                }
            },
        },
        created() {
        },
        mounted(){
            if(this.KHUtils.isNull(this.dataModel)){
                this.selectDatas =  [];
            }else {
                let datas = JSON.parse(this.dataModel);
                this.selectDatas = datas;
            }
        },
        data(){
            return {
                formDataSelectDialogVisible:false,
                selectDatas:[],
                dataId:null,
                formDetailVisible:false,
                subTableDetailVisible:false,
                refreshView:true,
            }
        },
        methods:{
            cleanData(){
                this.$emit('update:dataModel', "");
            },
            //打开详情
            openFormDetail(dataId){
                this.dataId = dataId;
                if(this.KHUtils.isNull(this.box.options.dsConf.subKey)){
                    //打开主表详情页面
                    this.formDetailVisible = true;
                }else {
                    //打开子表单详情页面
                    this.subTableDetailVisible = true;
                }
            },
            openDataSelect(){
                this.formDataSelectDialogVisible = true;
            },
            //数据选择返回数据
            selectFormData(datas){
                let _this = this;
                _this.selectDatas = [];

                let label = _this.box.options.dsConf.mapping.value;
                let key = _this.box.options.dsConf.mapping.key;
                if (
                    _this.KHUtils.isNull(datas) ||
                    datas.length <= 0
                ) {
                    return false;
                }
                let JsopDataModel = [];
                datas.forEach((value) => {
                    let labelValue = value[label];
                    let obj = {};
                    if(_this.KHUtils.isJSON(labelValue)){
                        let jsonArray = JSON.parse(labelValue);
                        let strValue = "";
                        if(jsonArray instanceof Array && jsonArray.length >0){
                            for(var i = 0;i<jsonArray.length;i++){
                                strValue += jsonArray[i].v+ ",";
                            }
                            if (strValue.length > 0) {
                                strValue = strValue.substr(0, strValue.length - 1);
                            }
                        }
                        obj = {
                            k: value[key],
                            v: "["+strValue+"]",
                        };
                    }else {
                        obj = {
                            k: value[key],
                            v: labelValue,
                        };
                    }

                    JsopDataModel.push(obj);
                });
                let selectValue = JSON.stringify(JsopDataModel);
                this.$nextTick(()=>{
                    this.$emit('update:dataModel', selectValue);
                })
            },
            closeFormDataSelectDialog(){
                this.formDataSelectDialogVisible = false;
            },

        }
    }
</script>

<style lang="scss" scoped>
     @import "@/assets/style/dialog-maxheight.scss";
    .widget-div{
        // border: 1px solid #DCDFE6;
        padding: 5px;
        border-radius: 4px;
    }
    ::v-deep .advanced-set-dialog {
        height: 80vh;
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
