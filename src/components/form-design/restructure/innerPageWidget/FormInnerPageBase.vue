<template>
</template>

<script>
    export default {
        name: "FormInnerPageBase",
        props: {
            currentFormId: {type: Number, require: true},
            widget: {type: Object, require: true},
            /*判断FormCustomV2组件是否是在内嵌页面过来的*/
            isInnerPage: {type: Boolean, require: false, default: false},
        },
        created() {
            let _this = this;
            if(_this.widget && _this.widget.type=="innerPageWidget"){
                if(_this.widget.innerType == "2"){
                    _this.innerPageFormId = _this.widget.targetId;
                }
                if(_this.widget.innerType == "3"){
                    _this.innerPageReportId = _this.widget.targetId;
                }
            }
            if(!_this.KHUtils.isNull(_this.currentFormId)){
                _this.$EventBus.$on(_this.eventTopic,function (value) {
                    
                    if(_this.widget.params instanceof Array && _this.widget.params.length >0 ){
                        let obj = {};
                        _this.widget.params.forEach((item,index)=>{
                            obj[item.paramName] = value[item.model];
                        });
                        if(_this.widget.innerType == "1"){
                            _this.triggerVue(obj);
                        }
                        if(_this.widget.innerType == "2"){
                            obj.$formId = _this.widget.targetId;
                            _this.triggerVue(obj);
                        }
                        if(_this.widget.innerType == "3"){
                            let conditions =  _this.convertReportConditions(value,_this.widget.params);
                            console.log(conditions);
                            _this.triggerVue(conditions);
                        }

                    }else {
                        if(_this.widget.innerType == "2"){
                            let obj = {};
                            obj.$formId = _this.widget.targetId;
                            _this.triggerVue(obj);
                        }
                        if(_this.widget.innerType == "3"){

                        }
                    }

                });


            };
        },
        beforeDestroy () {
            let _this  = this;
            _this.$EventBus.$off(_this.eventTopic);
        },
        data() {
            return {
                EQ_$: "$eq",  // 精确查询
                LIKE_$: "$like", // 模糊查询
                IN_$: "$in", // 范围查询
                EQ_OR_LIKE_QUERY_OBJ: {key: "", type: "", value: ""}, // 对于模糊,精确查询的参数要求
                IN_QUERY_OBJ: {key: "", type: "", bvalue: "", evalue: ""},// 对于范围查询的参数要求
                eventTopic:"topic-form-"+this.currentFormId,
                /*内嵌页面是普通表单或报表时对应的id*/
                innerPageReportId:null,
                innerPageFormId:null,
            }
        },
        mounted() {
            //console.log('i am parent,mounted......');
        },
        methods: {
            query(queryConditions) {
                let _this = this;
                let errMsg = "";
                let warnMessage = "参数对象不符合要求,key是需要传递的参数名,value是传递参数的值,type对象查询的类型。如精确查询{key: 'name', type: '" + _this.EQ_$ + "', value: '张三'};" +
                    "模糊查询{key: 'name', type: '" + _this.LIKE_$ + "', value: '张三'};范围查询{key: 'name', type: '" + _this.IN_$ + "', bvalue: '2019',evalue: '2020'}。以数组对象的形式传递";
                if (!(queryConditions instanceof Array)) {
                    let tempMsg = "内嵌组件传递参数必须是数组";
                    _this.$message.warning(tempMsg);
                    errMsg = tempMsg;
                    return errMsg;
                }
                if (queryConditions.length > 0) {
                    queryConditions.forEach(qc => {
                        if (!qc.key) {
                            _this.$message.warning(warnMessage);
                            errMsg = warnMessage;
                            return errMsg;
                        }
                        if (!qc.type) {
                            _this.$message.warning(warnMessage);
                            errMsg = warnMessage;
                            return errMsg;
                        }
                        if (qc.type !== _this.EQ_$ && qc.type !== _this.LIKE_$ && qc.type !== _this.IN_$) {
                            let tempMsg = "内嵌组件传递参数含有不支持的查询类型{" + qc.type + "}";
                            _this.$message.warning(tempMsg);
                            errMsg = tempMsg;
                            return errMsg;
                        }
                        if (qc.type === _this.IN_$) {
                            if (!qc.bvalue || !qc.evalue) {
                                _this.$message.warning(warnMessage);
                                errMsg = warnMessage;
                                return errMsg;
                            }
                        } else {
                            if (!qc.value) {
                                _this.$message.warning(warnMessage);
                                errMsg = warnMessage;
                                return errMsg;
                            }
                        }
                    });
                }
                console.log("queryConditions :" + JSON.stringify(_this.queryConditions));
                this.$emit("queryByInnerPageParam", queryConditions);
                return "success";
            },
            //组织报表查询条件
            convertReportConditions(value,params){
                let conditions = [];
                params.forEach((item,index)=>{
                    let modelValue = value[item.model];
                    if(item.reportParam){
                        let widget = item.reportParam.widget;
                        let dimOrMeasure = item.reportParam.dimOrMeasure;
                        if(widget instanceof Array && widget.length >0){
                            for(var i = 0;i<widget.length;i++){
                                let widgetId = widget[i];
                                let queryCondition = {};
                                queryCondition.column = dimOrMeasure.columnName;
                                queryCondition.condType = "single";
                                queryCondition.dataType = dimOrMeasure.dataType;
                                queryCondition.dateDim = dimOrMeasure.dateDim;
                                queryCondition.matchType = "$eq";
                                queryCondition.table = dimOrMeasure.tableName;
                                queryCondition.value = modelValue;
                                let condition = this.findReportCondition(conditions,widgetId);
                                if(condition){
                                    condition.queryConditions.push(queryCondition);
                                }else {
                                    condition = {
                                        queryConditions:[],
                                        widgetId:widgetId
                                    };
                                    condition.queryConditions.push(queryCondition);
                                    conditions.push(condition);
                                }
                            }
                        }
                    }
                });
                return conditions;
            },
            findReportCondition(conditions,widgetId){
                if(conditions instanceof Array && conditions.length >0){
                    for(var i = 0;i<conditions.length;i++){
                        let condition = conditions[i];
                        if(condition.widgetId == widgetId){
                            return condition;
                        }
                    }
                }
                return null;
            },
            //继承的子类一定要重写该方法，才能实现联动
            triggerVue(params){

            }
        }
    }

</script>

<style scoped lang="scss">

</style>
