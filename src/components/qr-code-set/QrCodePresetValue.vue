<template>
    <div style="padding: 20px">
        <el-form label-width="100px"
                 v-if="qrCodeItemConf.content && qrCodeItemConf.content.parent instanceof Array && qrCodeItemConf.content.parent.length >0">
            <template v-for="(item,index) in qrCodeItemConf.content.parent">
                <el-form-item :label="item.name" v-if="item.preset" :prop="item.model" :rules="findRules(item.key)">
                    <div style="width: 100%;" v-if="boxConfig(colsArray,item.key).type  === 'image_upload' || boxConfig(colsArray,item.key).type  === 'file_upload' || boxConfig(colsArray,item.key).type  === 'signature'
                      || boxConfig(colsArray,item.key).type  === 'region_select'">
                        <form-item
                            :formId="formId"
                            :box="boxConfig(colsArray,item.key)"
                            v-model="item.value"
                            :models.sync="models"
                        ></form-item>
                    </div>
                    <div  v-else>
                        <div style="width: 100%;display: inline-block">
                            <form-item
                                :formId="formId"
                                :box="boxConfig(colsArray,item.key)"
                                v-model="item.value"
                                :models.sync="models"
                            ></form-item>
                        </div>
                        <el-checkbox v-model="item.currentTime" v-if="boxConfig(colsArray,item.key).type === 'year' || boxConfig(colsArray,item.key).type === 'month' || boxConfig(colsArray,item.key).type === 'year_month' || boxConfig(colsArray,item.key).type === 'date' || boxConfig(colsArray,item.key).type === 'time' || boxConfig(colsArray,item.key).type === 'datetime'">默认当前时间</el-checkbox>
                    </div>
                </el-form-item>
            </template>
        </el-form>
        <template v-if="tableFormConfig instanceof Array && tableFormConfig.length >0">
            <div v-if="refreshSubTable" v-for="(table,index) in tableFormConfig" :key="index">
                <div v-if="allowPresetSubTable(table.key)">
                    <div>
                        <span style="font-size: 16px">{{table.name}}</span>
                        <el-button type="text" @click="addPresetValue(table.colsArray,table.key)">添加预置</el-button>
                    </div>
                    <el-table
                        :data="getSubTablePresetValues(table.key)">
                        <template v-for="(col,key1) in table.colsArray">
                            <el-table-column
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                                width="400">
                                <template slot-scope="scope">
                                    <div v-if="isAllowPresetValue(col.model,table.key)">
                                        <form-item
                                            :formId="formId"
                                            v-if="!(typeof scope.row[col.model] === 'boolean')"
                                            style="width: 200px;display: inline-block"
                                            :box="col"
                                            v-model="scope.row[col.model]"
                                        ></form-item>
                                        <el-checkbox @change="checkChange($event,scope.row,col.model)" v-model="scope.row[col.model]" v-if="col.type === 'year' || col.type === 'month' || col.type === 'year_month' || col.type === 'date' || col.type === 'time' || col.type === 'datetime'">默认当前时间</el-checkbox>
                                    </div>

                                </template>
                            </el-table-column>
                        </template>
                        <el-table-column
                            label="操作">
                            <template slot-scope="scope">
                                <i class="el-icon-delete" @click.stop="deleteRow(scope.$index,scope.row,getSubTablePresetValues(table.key))"></i>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>

            </div>
        </template>
    </div>
</template>

<script>
    import FormItem from "@/components/qr-code-set/FormItem";
    export default {
        name: "QrCodePresetValue",
        components: {
            FormItem
        },
        props: {
            /*colsArray :主表单字段   tableFormConfig：子表单配置信息*/
            colsArray: {type: Array},
            tableFormConfig: {type: Array},
            qrCodeItemConf: {type: Object},
            qrCodeType: {type: String},
            formId:{type:Number},
        },
        computed: {
            boxConfig() {
                return function (list, key) {
                    if (key) {
                        return list.find((value, index, array) => {
                            return value.model == key;
                        });
                    } else {
                        return {};
                    }
                };
            },
            findSubTableConf(){
                return function (subKey) {
                    if (this.tableFormConfig instanceof Array && this.tableFormConfig.length > 0) {
                        this.tableFormConfig.forEach((table, index) => {
                            if (subKey == table.key) {
                                return table;
                            }
                        })
                    }
                    return null;
                }
            },
            findSubTableList(){
                return function (subKey) {
                    if (this.tableFormConfig instanceof Array && this.tableFormConfig.length > 0) {
                        this.tableFormConfig.forEach((table, index) => {
                            if (subKey == table.key) {
                                return table.colsArray;
                            }
                        })
                    }
                    return null;
                }
            },
            findSubTableName(){
                return function (subKey) {
                    if (this.tableFormConfig instanceof Array && this.tableFormConfig.length > 0) {
                        this.tableFormConfig.forEach((table, index) => {
                            if (subKey == table.key) {
                                return table.name;
                            }
                        })
                    }
                    return "";
                }
            },
            //判断子表单是否允许设置预置值
            allowPresetSubTable(){
                return function (subKey) {
                    let allow = false;
                    if (this.qrCodeItemConf.content && this.qrCodeItemConf.content.childs instanceof Array && this.qrCodeItemConf.content.childs.length > 0) {
                        this.qrCodeItemConf.content.childs.forEach((child, index) => {
                            if (subKey == child.subKey) {
                                let contents = child.contents;
                                if (contents instanceof Array && contents.length > 0) {
                                    contents.forEach((item, key) => {
                                        if (item.preset) {
                                            allow = true;
                                        }
                                    })
                                }
                            }
                        })
                    }
                    return allow;
                }
            },
            getSubTablePresetValues(){
                return function (subKey) {
                    if (this.qrCodeItemConf.content && this.qrCodeItemConf.content.childs instanceof Array && this.qrCodeItemConf.content.childs.length > 0) {
                        let child = this.qrCodeItemConf.content.childs.find((child, index) => {
                            return subKey == child.subKey

                        })
                        if (!child.values) {
                            this.$set(child, 'values', [])
                        }

                        return child.values;

                    }
                    return null;
                }
            },
            //子表单是否允许设置预置值
            isAllowPresetValue(){
                return function (model,subKey) {
                    let isAllow = false;
                    if (this.qrCodeItemConf.content && this.qrCodeItemConf.content.childs instanceof Array && this.qrCodeItemConf.content.childs.length > 0) {
                        let child = this.qrCodeItemConf.content.childs.find((child1, index) => {
                            return subKey == child1.subKey
                        })
                        if(child && child.contents instanceof Array && child.contents.length >0 ){
                            for (var i = 0;i<child.contents.length;i++){
                                let content = child.contents[i];
                                if(model == content.key &&content.preset){
                                    isAllow = true;
                                    return isAllow;
                                }
                            }
                        }


                    }
                    return isAllow;
                }
            },
            findRules(){
                return function (model) {
                    return this.rules[model];

                }
            }
        },
        created(){

        },
        mounted(){
            this.initRules();
        },
        data(){
            return {
                models: {
                },
                refreshSubTable: true,
                rules: {},
            }
        },
        methods: {
            checkChange(val,row,model,){
                if(!val){
                    row[model] = "";
                }
            },
            //初始化主表的控件规则验证  表单校验处理
            initRules(){
                let _this = this;
                if(_this.colsArray instanceof Array && _this.colsArray.length >0){
                    _this.colsArray.forEach((col,index)=>{
                        if (_this.rules[col.model]) {
                            _this.rules[col.model] = [
                                ..._this.rules[col.model],
                                ...col.rules.map((item) => {
                                    if (item.pattern) {
                                        return { ...item, pattern: eval(item.pattern) };
                                    } else {
                                        return { ...item };
                                    }
                                }),
                            ];
                        } else {
                            _this.rules[col.model] = [
                                ...col.rules.map((item) => {
                                    if (item.pattern) {
                                        return { ...item, pattern: eval(item.pattern) };
                                    } else {
                                        return { ...item };
                                    }
                                }),
                            ];
                        }
                    })

                }

            },
            addPresetValue(list, subKey){

                if (this.qrCodeItemConf.content && this.qrCodeItemConf.content.childs instanceof Array && this.qrCodeItemConf.content.childs.length > 0) {
                    this.qrCodeItemConf.content.childs.forEach((child, index) => {
                        if (subKey == child.subKey) {
                            if (list instanceof Array && list.length > 0) {
                                let data = {};
                                list.forEach((item, key) => {
                                    data[item.model] = "";
                                })
                                child.values.push(data);
                                this.refreshSubTable = false;
                                this.$nextTick(function () {
                                    this.refreshSubTable = true;
                                })
                            }
                        }
                    })
                }
            },
            deleteRow(index,row,tableData){
                tableData.splice(index,1);
            }
        }
    }
</script>

<style>

</style>
