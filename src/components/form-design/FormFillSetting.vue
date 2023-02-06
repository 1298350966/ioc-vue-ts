<template>
    <div class="main">
        <div>
            <div class="main-header">
                <span>主表</span>
                <!--  <el-button type="primary" icon="el-icon-plus" circle style="float: right" @click="addSet(true,null)"></el-button>-->
            </div>
            <div v-if="formFillConf.parent instanceof Array && formFillConf.parent.length >0"
                 v-for="(item,index) in formFillConf.parent" :key="index" class="item-cond">
                <el-row v-if="item.user_id"  class="item-set">
                    <el-checkbox v-model="item.user_id.isCheck"></el-checkbox> <span>填报人</span>
                </el-row>
                <el-row v-if="item.create_time" class="item-set">
                    <el-checkbox v-model="item.create_time.isCheck"></el-checkbox> <span>填报时间</span>
                    <el-radio-group v-model="item.create_time.timeType">
                        <el-radio :label="0">范围设置</el-radio>
                        <el-radio :label="1">定期设置</el-radio>
                    </el-radio-group>
                    <div v-if="item.create_time.timeType === 0" style="margin-top: 10px">
                        <el-date-picker
                            v-model="item.create_time.startTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间">
                        </el-date-picker>
                        <el-date-picker
                            v-model="item.create_time.endTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="item.create_time.timeType === 1"  style="margin-top: 10px">
                        <el-select v-model="item.create_time.type" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-row>

                <el-row>
                    <span>限制项目满足时，可提交次数：</span><el-input-number v-model="item.count"></el-input-number>  <span style="font-size: 16px">条</span>
                </el-row>

                <!--  <i class="el-icon-delete" @click="deleteItem(formFillConf.parent,index)"></i>-->
            </div>
        </div>
        <div class="dividing-line"></div>
        <div v-if="tableFormConfig instanceof Array && tableFormConfig.length >0"
             v-for="(table,index) in tableFormConfig" :key="index">
            <div class="main-header">
                <span>{{table.name}}</span>
                <!--<el-button type="primary" icon="el-icon-plus" circle style="float: right" @click="addSet(false,table.key)"></el-button>-->
            </div>
            <div
                v-if="getSubLimit(table.key) != null && getSubLimit(table.key) instanceof Array && getSubLimit(table.key).length >0"
                v-for="(item,index) in getSubLimit(table.key)" :key="index" class="item-cond">
                <el-row v-if="item.user_id"  class="item-set">
                    <el-checkbox v-model="item.user_id.isCheck"></el-checkbox> <span>填报人</span>
                </el-row>
                <el-row v-if="item.create_time" class="item-set">
                    <el-checkbox v-model="item.create_time.isCheck"></el-checkbox> <span>填报时间</span>
                    <el-radio-group v-model="item.create_time.timeType">
                        <el-radio :label="0">范围设置</el-radio>
                        <el-radio :label="1">定期设置</el-radio>
                    </el-radio-group>
                    <div v-if="item.create_time.timeType === 0" style="margin-top: 10px">
                        <el-date-picker
                            v-model="item.create_time.startTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="开始时间">
                        </el-date-picker>
                        <el-date-picker
                            v-model="item.create_time.endTime"
                            type="datetime"
                            value-format="yyyy-MM-dd HH:mm:ss"
                            placeholder="结束时间">
                        </el-date-picker>
                    </div>
                    <div v-if="item.create_time.timeType === 1"  style="margin-top: 10px">
                        <el-select v-model="item.create_time.type" placeholder="请选择">
                            <el-option
                                v-for="item in options"
                                :key="item.value"
                                :label="item.label"
                                :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </el-row>

                <el-row>
                    <span>限制项目满足时，可提交次数：</span><el-input-number v-model="item.count"></el-input-number>  <span style="font-size: 16px">条</span>
                </el-row>

                <!--  <i class="el-icon-delete"  @click="deleteItem(getSubLimit(table.key),index)"></i>-->
            </div>
        </div>
        <el-row type="flex" class="row-bg" justify="space-between">
            <el-col :span="6"></el-col>
            <el-col :span="6"></el-col>
            <el-col :span="6">
                <el-button @click="$emit('closeFormFillSetDialog')">取 消</el-button>
                <el-button type="primary" @click="saveFormFillSetting">确 定</el-button>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    export default {
        name: "FormFillSetting",
        props: {
            formId: {
                type: Number,
                required: true
            },
            formConfig: {type: Object},
        },
        computed: {
            getSubLimit(){
                return function (subKey) {
                    if (this.formFillConf.childs instanceof Array && this.formFillConf.childs.length > 0) {
                        let child = this.formFillConf.childs.find((item, index) => {
                            if (item.subKey == subKey) {
                                return true;
                            } else {
                                return false;
                            }
                        });
                        if (child) {
                            return child.limit;
                        } else {
                            return null;
                        }
                    }
                    return null;
                }
            }
        },
        created(){
            let _this = this;
            if (_this.KHUtils.isNull(_this.formConfig)) {
                return false;
            }
            if (!_this.formConfig) {

                return false;
            }
            if (!_this.formConfig.list) {
                return false;
            }
            _this.colsArray = [];
            _this.formConfig.list.forEach(val => {
                if (val.type === 'grid') {
                    loop(val, _this);
                } else {
                    if ("table" === val.type) {
                        _this.tableFormConfig.push(val);      // 子表单独立组件显示
                    } else {
                        _this.colsArray.push(val);
                    }
                }
            });

            function loop(obj, _this) {
                if (obj.columns) {
                    obj.columns.forEach(cs => {
                        cs.list.forEach(ls => {
                            if ("table" === ls.type) {
                                _this.tableFormConfig.push(ls);      // 子表单独立组件显示
                            } else {
                                _this.colsArray.push(ls);
                            }
                            if (ls.columns) {
                                loop(ls, _this);
                            }
                        })
                    })
                }
            }
        },
        mounted(){
            this.initFormFillConf();
        },
        data(){
            return {
                colsArray: [], // 所有拉取的控件除子表单控件
                tableFormConfig: [],  // 子表单控件集合
                options: [ {
                    value: 'hour',
                    label: '每小时'
                }, {
                    value: 'day',
                    label: '每天'
                }, {
                    value: 'week',
                    label: '每星期'
                }, {
                    value: 'month',
                    label: '每月'
                }, {
                    value: 'quarter',
                    label: '每季度'
                }, {
                    value: 'year',
                    label: '每年'
                }],
                formFillConf: {}
            }
        },
        methods: {
            //初始化表单填报次数配置
            initFormFillConf(){
                let _this = this;
                _this.$Get(_this.khConfig.api.queryFormSetByFormId + "/" + _this.formId, null).then(res => {
                    if (res.errCode === 0) {
                        if (res.data) {
                            let formSet = JSON.parse(res.data.formSet);
                            if (formSet && formSet.formFillNum) {
                                _this.formFillConf = formSet.formFillNum;
                            } else {
                                /*  _this.formFillConf = {
                                 parent:[],
                                 childs:[],
                                 }*/
                                _this.addDefaultConf();
                            }

                        } else {
                            _this.addDefaultConf();
                        }


                    }
                })
            },
            addDefaultConf(){
                let _this = this;
                _this.formFillConf = {
                    parent: [{
                        user_id:{
                            isCheck:false
                        },
                        create_time:{
                            isCheck:true,
                            timeType:0,
                            startTime:"",
                            endTime:"",
                            type:"month"
                        },
                        count:0
                    }],
                    childs: [],
                };
                if (_this.tableFormConfig instanceof Array && _this.tableFormConfig.length > 0) {
                    _this.tableFormConfig.forEach((table, index) => {
                        let child = {
                            subKey: table.key,
                            limit: [],
                        }
                        child.limit.push({
                            user_id:{
                                isCheck:false
                            },
                            create_time:{
                                isCheck:true,
                                timeType:0,
                                startTime:"",
                                endTime:"",
                                type:"month"
                            },
                            count:0
                        });
                        this.formFillConf.childs.push(child);
                    })
                }

            },
            //添加配置
            addSet(isParent, subKey){
                let newObj = {
                    user_id:{
                        isCheck:false
                    },
                    create_time:{
                        isCheck:true,
                        timeType:0,
                        startTime:"",
                        endTime:"",
                        type:""
                    },
                    count:0
                }
                if (isParent) {
                    this.formFillConf.parent.push(newObj);
                } else {
                    let child;
                    if (this.formFillConf.childs instanceof Array && this.formFillConf.childs.length > 0) {
                        child = this.formFillConf.childs.find((item, index) => {
                            if (item.subKey == subKey) {
                                return true;
                            } else {
                                return false;
                            }
                        });

                    }
                    if (child) {
                        child.limit.push(newObj)
                    } else {
                        child = {
                            subKey: subKey,
                            limit: [],
                        }
                        child.limit.push(newObj);
                        this.formFillConf.childs.push(child);
                    }
                }
            },
            saveFormFillSetting(){
                let param = {
                    formId: this.formId,
                    formFillNum: this.formFillConf
                }
                this.$PostJson(this.khConfig.api.saveFormFillSet, param).then(res => {
                    this.$emit('closeFormFillSetDialog');
                    if (res.errCode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });

                    } else {

                    }
                })
            },
            deleteItem(list, index){
                list.splice(index, 1);
            }
        }
    }
</script>

<style lang="scss" scoped>
    .main {
        padding: 20px;
        .main-header {
            line-height: 30px;
            font-size: 16px;
            color: #409EFF;
            margin-bottom: 10px;
        }
        .item-cond {
            margin-bottom: 10px;
        }
        .dividing-line {
            background-color: #FAFAFA;
            height: 5px;
            margin-top: 10px;
            margin-bottom: 10px;
        }
        .item-set{
            margin-bottom: 10px;
        }
    }
</style>
