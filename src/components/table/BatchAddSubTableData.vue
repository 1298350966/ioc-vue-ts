<template>
    <div>
        <div style="padding: 20px">
            <div>
                <el-button type="text" @click="addData" style="font-size: 18px" v-if="isBatchAdd">添加</el-button>
            </div>
            <el-form :model="ruleForm"  ref="ruleForm">
                 <el-table
                stripe
                border
                :data="ruleForm.tableDatas"
                :header-cell-style="{background:'#eef1f6',color:'#606266'}">
                <template v-for="(col,key1) in allCols">
                    <el-table-column
                        :prop="col.model"
                        :label="col.name"
                        :key="col.model"
                        width="200">
                        <template slot-scope="scope" >
                            <el-form-item  :prop="'tableDatas.' + scope.$index + '.'+col.model" :rules='col.rules'>
                                <form-item
                                    :formId="formId"
                                    style="width: 150px;display: inline-block"
                                    :box="col"
                                    :models.sync="scope.row"
                                    :allCols="allCols"
                                    v-model="scope.row[col.model]"
                                ></form-item>
                            </el-form-item>

                        </template>
                    </el-table-column>
                </template>
                <el-table-column
                    label="操作" v-if="isBatchAdd">
                    <template slot-scope="scope">
                        <i class="el-icon-delete" @click.stop="deleteRow(scope.$index,scope.row)"></i>
                    </template>
                </el-table-column>
            </el-table>
            </el-form>


        </div>
        <div style="float: right;margin:20px">
            <el-button @click="$emit('closeDialog')">取 消</el-button>
            <el-button type="primary" @click="batchAddData">确 定</el-button>
        </div>
    </div>
</template>

<script>
    import FormItem from "@/components/qr-code-set/FormItem";
    import FormDataSelect from "@/components/table/FormDataSelect.vue";
    import BatchAddSubTableData from "@/components/table/BatchAddSubTableData.vue";
    import { mapGetters } from "vuex";
    export default {
        components: {
            FormItem
        },
        props:['selectDatas','allCols','isBatchAdd','parentId','formId'],
        created() {
            let _this = this;
            _this.ruleForm.tableDatas = [];
            if(_this.selectDatas instanceof Array && _this.selectDatas.length >0){
                //_this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                _this.ruleForm.tableDatas = _this.selectDatas;
            }
            _this.getCurrentDate();

        },
        computed: {
            ...mapGetters({
                user: "getUserInfo",
            })
        },
        data() {
            return {
                ruleForm:{
                    tableDatas:[]
                },
                // tableDatas:[],
                currentDate:null
            }
        },
        mounted() {
            this.initAllColsRule()
        },
        methods: {
            // 配置正则初始化
            initAllColsRule(){
                this.allCols.forEach((col, index, array) => {
                    col.rules.forEach((rule, index, array) => {
                        if(rule.pattern){
                            rule.pattern = eval(rule.pattern)
                        }
                    })
                })
            },
            batchAddData(){
                this.$refs.ruleForm.validate((valid) => {
                    if (valid) {
                         this.$emit('batchProcess',this.ruleForm.tableDatas);
                         this.$emit('closeDialog');
                    } else {
                        console.log('error submit!!');
                        return false;
                    }
                })
            },
            addData(){
                let _this = this;
                if(_this.allCols instanceof Array && _this.allCols.length >0){
                    let data = {};
                    _this.allCols.forEach((col,index)=>{
                       /* data[col.model] = "";*/
                       let type = col.type;
                        if(type === "year" || type === "month" || type === "year_month" || type === "date" || type === "time" || type === "datetime"){
                            if(col.options.defaultType == 0){
                                let defaultDate =col.options.defaultValue;
                                if(!_this.KHUtils.isNull(defaultDate)){
                                    if( type === "time"){
                                        data[col.model] = defaultDate;
                                    }else if(type === "datetime"){
                                        data[col.model] = _this.KHUtils.formatDate(defaultDate,'yyyy-MM-dd hh:mm:ss');
                                    }else {
                                        data[col.model] = _this.KHUtils.formatDate(defaultDate,col.options.format)
                                    }
                                }else {
                                    data[col.model] = '';
                                }

                            }else if(col.options.defaultType == 1){
                                if(_this.KHUtils.isNull(_this.currentDate)){

                                     //this.getCurrentDate();
                                    _this.currentDate = new Date;
                                }
                                if( type === "time"){
                                    data[col.model] = _this.KHUtils.formatDate(_this.currentDate,'hh:mm:ss');
                                }else if(type === "datetime"){
                                    data[col.model] = _this.KHUtils.formatDate(_this.currentDate,'yyyy-MM-dd hh:mm:ss');
                                }else {
                                    data[col.model] = _this.KHUtils.formatDate(_this.currentDate,col.options.format)
                                }

                            }else {
                                data[col.model] = col.options.defaultValue;
                            }
                        }else if(type === "switch"){
                            if( col.options.defaultValue == true){
                                data[col.model] = "0";
                            }else {
                                data[col.model] = "1";
                            }
                        }else if(type === "multiple_select" || type === "checkbox" ){
                            if( col.options.defaultValue instanceof Array){
                                data[col.model] =col.options.defaultValue.join(',');
                            }else {
                                data[col.model] = "";
                            }

                        }else if(type == "user_select" &&  col.options.defaultCurrentUser){
                            //是否默认当前用户
                            if(_this.KHUtils.isNull(data[col.model])){
                                data[col.model] = {};
                                data[col.model][col.model] =  _this.user.id;
                                data[col.model][col.label_model] = _this.user.realName;
                            }
                            //判断是否存在自动赋值
                            _this.KHForm.userSelectAutoAssing(col,data,_this.user,_this.allCols,_this);

                        }else {
                            if(_this.KHUtils.isNull(data[col.model])){
                                data[col.model] = col.options.defaultValue;
                            }

                        }
                    });
                    _this.ruleForm.tableDatas.push(data);
                }
            },
            deleteRow(index ,row){
                this.ruleForm.tableDatas.splice(index,1);
            },
            getCurrentDate(){
                let res =  this.$Get(this.khConfig.api.getCurrentDate);
                if (res.errCode === 0) {
                    this.currentDate = res.currentDate;
                }
            },
        }
    }
</script>

<style>

</style>
