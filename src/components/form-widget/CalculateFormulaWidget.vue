<template>
    <div>
        <el-input
           v-bind:value="getDataValue"
            controls-position="right"
            :disabled="box.options.disabled"
        ></el-input>
    </div>
</template>

<script>
    export default {
        name: "CalculateFormulaWidget",
        props:{
            dataModel:{
                type:[Number,String]
            },
            box:{
                type:Object
            },
            models:{
                type:Object
            },
        },
        created(){
            let formula = this.box.options.formula;
            let type = formula.type;
            let exp = formula.exp;
            let decimal = formula.decimal;
            if(exp instanceof Array && exp.length >0) {
                var regexStr = new RegExp(this.regex);
                exp.forEach((item, index) => {
                    let match = regexStr.test(item);
                    if (match) {
                        let start = item.indexOf("{") + 1;
                        let end = item.indexOf("}");
                        let model = item.substring(start, end);
                        this.associatedControl.push(model);
                    }
                })
            }
            //设置动态监听，只监听计算公式控件相关的控件值的变化
            if(this.associatedControl instanceof Array && this.associatedControl.length >0){
                 this.associatedControl.forEach((item,index)=>{
                     let key = 'models.'+item;
                     this.$watch(key, function (newValue, oldValue) {//a是属性名，表示要监听的对象
                         this.calculateExp();
                     })
                 })
            }
            this.calculateExp();

        },
        computed:{
            getDataValue(){
               return this.KHForm.getCalculateFormulaValue(this.box,this.dataModel,this);
            }
        },
        data(){
            return {
                regex:/\$\{(.+?)\}/,
                associatedControl:[]
            }
        },
        methods:{
            calculateExp(){
                let formula = this.box.options.formula;
                let type = formula.type;
                let exp = formula.exp;
                let decimal = formula.decimal;
                let overCalculate = false;//判断是否所有需要参与计算的控件都有值，如果存在没有值的控件就直接结束计算
                if(exp instanceof Array && exp.length >0){
                    let expValue = "";
                    var regexStr = new RegExp(this.regex);
                    let startTime = null;
                    let endTime= null;
                    exp.forEach((item,index)=>{
                        let match = regexStr.test(item);
                        if(match){
                            let start = item.indexOf("{")+1;
                            let end = item.indexOf("}");
                            let model = item.substring(start,end);
                             let value = this.models[model];
                            if(this.KHUtils.isNull(value)){
                                overCalculate = true;
                                return;
                            }
                             if(type != 'number'){
                                 if(index == 0){
                                     startTime = value;
                                 }else {
                                     endTime = value;
                                 }
                             }
                            expValue = expValue.concat(value);
                        }else {
                            expValue = expValue.concat(item);
                        }

                    })
                    if(!overCalculate){
                        if(type == "number"){
                            this.calculateNumber(expValue,decimal);
                        }else if(type == "year") {
                            this.calculateYear(startTime,endTime);
                        }else if(type == "year_month") {
                            this.calculateYearMonth(startTime,endTime);
                        }else if(type == "month") {
                            this.calculateMonth(startTime,endTime);
                        }else if(type == "time") {
                            this.calculateTime(startTime,endTime);
                        }else if(type == "date") {
                            this.calculateDate(startTime,endTime);
                        }else if(type == "datetime") {
                            this.calculateDateTime(startTime,endTime);
                        }
                    }else {
                        this.$emit("update:dataModel",null );
                    }

                }


            },
            calculateNumber(expValue,decimal){
                let result = eval(expValue);
                if(!this.KHUtils.isNull(result)){
                    result =  Math.round(result*Math.pow(10,decimal))/Math.pow(10,decimal);
                }
                if(isNaN(result)){
                    result = null;
                }
                this.$emit("update:dataModel",result );
            },
            calculateYear(start,end){
                let year = Math.abs(parseInt(start) - parseInt(end));
                console.log(year);
                if(isNaN(year)){
                    year = null;
                }
                this.$emit("update:dataModel",year );
            },
            calculateMonth(start,end){
                let month = Math.abs(parseInt(start) - parseInt(end));
                console.log(month);
                if(isNaN(month)){
                    month = null;
                }
                this.$emit("update:dataModel",month );
            },
            calculateTime(start,end){
                start = start.split(':');
                start = parseInt(start[0]) * 60*60 + parseInt(start[1])*60+parseInt(start[2]);
                end = end.split(':');
                end = parseInt(end[0]) * 60*60 + parseInt(end[1])*60+parseInt(end[2]);
                var seconds = Math.abs(start - end);
                console.log(seconds);
                if(isNaN(seconds)){
                    seconds = null;
                }
                this.$emit("update:dataModel",seconds );
            },
            calculateYearMonth(start,end){
                // 拆分年月日
                start = start.split('-');
              // 得到月数
                start = parseInt(start[0]) * 12 + parseInt(start[1]);
             // 拆分年月日
                // 拆分年月日
                end = end.split('-');
                // 得到月数
                end = parseInt(end[0]) * 12 + parseInt(end[1]);
                var month = Math.abs(start - end);
                if(isNaN(month)){
                    month = null;
                }
                console.log(month);
                this.$emit("update:dataModel",month );

            },
            calculateDate(start,end){
                start = new Date(start);
                end = new Date(end);
                let days = parseInt(Math.abs(start - end) / 1000 / 60 / 60 / 24);
                console.log(days);
                if(isNaN(days)){
                    days = null;
                }
                this.$emit("update:dataModel",days );
            },
            calculateDateTime(start,end){
                start = new Date(start);
                end = new Date(end);
                let minutes = parseInt(Math.abs(start - end) / 1000 );
                if(isNaN(minutes)){
                    minutes = null;
                }
                this.$emit("update:dataModel",minutes );
            },

        }
    }
</script>

<style>

</style>
