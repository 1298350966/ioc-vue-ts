<template>
    <div style="padding: 40px">
        <div style="margin-bottom: 10px">
            <el-button type="primary" icon="el-icon-tickets" circle></el-button>
            <span>且满足以下条件</span>
        </div>
        <div>
            <div style="text-align: end">
                <span>条件间关系</span>
                <el-radio-group v-model="editData.cond.type">
                    <el-radio label="and">与</el-radio>
                    <el-radio label="or">或</el-radio>
                </el-radio-group>
            </div>
        </div>
        <div class="item-condition" v-if="editData.cond && editData.cond.conds instanceof Array && editData.cond.conds.length >0" v-for="(item,index) in editData.cond.conds" :key="index">
            <div class="item-condition-title">
                <b>需求字段</b>
                <i class="el-icon-delete" style="float: right" @click="deleteConditionGroup(editData.cond.conds,index)"></i>
            </div>
            <div>
                <el-container>
                    <el-aside width="100px" style="padding: 20px">
                        <div style="height: 33%">
                            <span>┌------</span>
                        </div>
                        <div style="height: 33%" class="center-vertical">
                            <el-select v-model="item.type" placeholder="请选择">
                                <el-option label="AND" value="and"></el-option>
                                <el-option label="OR" value="or"></el-option>
                            </el-select>
                        </div>
                        <div style="height: 33%" class="center-vertical-bottom">
                            <span>└------</span>
                        </div>
                    </el-aside>
                    <el-main v-if="item.conds instanceof Array && item.conds.length >0">
                        <el-row :span="24"  :gutter="10" v-for="(cond,key) in item.conds" style="margin-bottom: 10px" :key="key">
                            <el-col :span="6" >
                                <el-select v-model="cond.key" placeholder="请选择" style="width: 100%"  @change="setformSelec($event, cond)">
                                    <el-option
                                        v-for="col in colList"
                                        :key="col.model"
                                        :label="col.name"
                                        :value="col.model">
                                    </el-option>
                                </el-select>
                            </el-col>
                            <el-col :span="6">
                                <el-select v-model="cond.opt" placeholder="请选择" style="width: 100%">

                                    <template v-if="isNumber(boxConfig(cond.key))">
                                        <el-option
                                            v-for="item in numberSelectOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </template>
                                    <template v-else>
                                        <el-option
                                            v-for="item in stringSelectOptions"
                                            :key="item.value"
                                            :label="item.label"
                                            :value="item.value">
                                        </el-option>
                                    </template>

                                </el-select>
                            </el-col>
                            <el-col :span="9">
                                <div style="width: 200px">
                                    <form-item   :box="boxConfig(cond.key)" :formId="formId"
                                                 v-model="cond.value"></form-item>
                                </div>
                            </el-col>
                            <el-col :span="3">

                                <i class="el-icon-delete" @click="deleteCondition(item.conds,key)"></i>
                            </el-col>
                        </el-row>
                        <el-button type="text" icon="el-icon-plus"  @click="addCondition(item.conds)">添加字段</el-button>
                    </el-main>
                </el-container>

            </div>
        </div>
        <el-button type="text" icon="el-icon-plus" @click="addConditionGroup">添加条件</el-button>
    </div>
</template>

<script>
    import FormItem from "@/components/qr-code-set/FormItem";
    export default {
        name: "QrCodeDataPermissions",
        components: {
            FormItem
        },
        props: {
            editData:{type:Object},
            colsArray: {type: Array},
            formId: {type: Number},
        },
        computed: {
            isNumber() {
                return function (boxConfig) {
                    if (!boxConfig) return;
                    if (
                        boxConfig.type == "input_number" ||
                        boxConfig.type == "input_int" ||
                        boxConfig.type == "input_long" ||
                        boxConfig.type == "number"
                    ) {
                        return true;
                    } else {
                        return false;
                    }
                };
            },
            boxConfig() {
                return function (key) {
                    if (key) {
                        return this.colsArray.find((value, index, array) => {
                            return value.model == key;
                        });
                    } else {
                        return {};
                    }
                };
            },
        },
        created(){

        },
        mounted(){
            this.initCols();
        },
        data(){
            return {
                colList:[],//条件控件
                numberSelectOptions: [
                    { value: "$eq", label: "=" },
                    { value: "$neq", label: "≠" },
                    { value: "$gt", label: ">" },
                    { value: "$gte", label: ">=" },
                    { value: "$lt", label: "<" },
                    { value: "$lte", label: "<=" },
                ],
                stringSelectOptions: [
                    { value: "$eq", label: "精确匹配" },
                    { value: "$like", label: "包含" },
                    { value: "$nlike", label: "不包含" },
                    { value: "$neq", label: "不匹配" },
                    { value: "$hlike", label: "开头是" },
                    { value: "$null", label: "为空" },
                    { value: "$notnull", label: "不为空" },
                    { value: "$empty", label: "空文本" },
                ],
            }
        },
        methods: {
            //剔除一些无法作为查询条件的控件，例如附件、图片等
            initCols(){
                this.colList = [];
                if(this.colsArray instanceof Array && this.colsArray.length >0){
                    this.colsArray.forEach((col,index)=>{
                        let type = col.type;
                        if(type != 'image_upload' && type != 'file_upload' && type != 'signature' && type != 'region_select' && type != 'gis_select' ){
                            this.colList.push(col);
                        }
                    })
                }
            },
            //添加条件组
            addConditionGroup(){
                let conditionGroup = {
                    type:"and",
                    conds:[]
                }
                let condition = {
                    key:"",
                    opt:"",
                    value:""
                }
                conditionGroup.conds.push(condition);

                this.editData.cond.conds.push(conditionGroup);
            },
            addCondition(conds){
                let condition = {
                    key:"",
                    opt:"",
                    value:""
                }
                conds.push(condition);
            },
            setformSelec(e, cond) {
                cond.opt = "";
                cond.value = "";
            },
            deleteConditionGroup(groups,index){
                groups.splice(index,1);
            },
            deleteCondition(conditions,index){
                conditions.splice(index,1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .item-condition{
        background-color: #FAFAFA;
        padding: 20px;
        margin-bottom: 20px;
        .item-condition-title{
            font-size: 16px;
        }
    }
    .center-vertical{
        position: relative;
        top:23%;
        transform:translateY(-43%);
       ::v-deep .el-input__suffix{
            visibility: hidden;
        }
       ::v-deep .el-input--mini .el-input__inner{
            height: 28px;
            line-height: 28px;
            width: 100%;
            padding: 0px;
            border: 0px;
            background-color:#FAFAFA ;
        }
    }
    .center-vertical-bottom{
        position: relative;
        top:23%;
        transform:translateY(-43%);
    }
    .title-label{
        font-size: 16px;
        margin-right: 20px;
    }
</style>
