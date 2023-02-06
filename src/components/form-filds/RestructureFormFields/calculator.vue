<template>
  <calculatorDialog
    title="计算器设置"
    :visible.sync="calculator.dialogVisible"
    @onCancel="onCancel"
    @onDetermine="onDetermine"
  >
    <div class="calculator">

     <div class="switchType">
        <span class="name">计算类型:</span>
        <el-radio-group  class="radio-group" v-model="formula.type" @change="switchType">
          <el-radio class="radio" el-radio :label="item.type"  v-for="(item, index) in typeList" :key="index">{{item.name}}</el-radio>
        </el-radio-group>
     </div>
      <div class="calculationFormulaBox">
        <calculationFormulaInput :value="formula.exp" :variableList="calculationObject" class="calculationFormula"></calculationFormulaInput>
        <div class="close">
          <i class="el-icon-circle-close" @click="formula.exp.pop()"></i>
          <span @click="formula.exp = []">清空</span>
        </div>
        
      </div>
      
      <p class="text">
        编辑计算公式可用来完成审批单内数据的自动结算，例如：采购单内设置计算公式“合计=单价×数量”，发起人填写单价、数量后，组件将自动计算出合计金额，免手动计算。
      </p>
      <div v-show="isNumber">
        <div class="buttonBox">
          <span class="name">计算对象:</span>
          <span class="button"  @click="addControlValue(item)"  v-for="(item, index) in calculationObject" :key="index">{{item.name}}</span>
        </div>
        <div class="buttonBox">
          <span class="name">计算符号:</span>
          <span class="button" @click="addValue(item)" v-for="(item, index) in calculationSymbol" :key="index">{{
            item
          }}</span>
        </div>
        <div class="buttonBox">
          <span class="name">数字键盘:</span>
          <div class="numberKey">
            <span class="button" @click="addValue(item)" v-for="(item, index) in digitalKeyboard" :key="index">{{
              item
            }}</span>
          </div>
        </div>
      </div>
      <div v-show="!isNumber">
        <div class="buttonBox">
          <span class="name">计算对象:</span>
          <span class="button"  @click="addControlValue(item)"  v-for="(item, index) in calculationObject" :key="index">{{item.name}}</span>
        </div>
        <div class="buttonBox">
          <span class="name">计算符号:</span>
          <span class="button" @click="addValue(item)" v-for="(item, index) in calculationSymbolData" :key="index">{{
            item
          }}</span>
        </div>
      </div>
    </div>
  </calculatorDialog>
</template>

<script>
import calculatorDialog from "@/components/form-filds/RestructureFormFields/calculatorDialog";
import calculationFormulaInput from "@/components/form-filds/RestructureFormFields/calculationFormulaInput";
export default {
  props: ["calculator", "formItemList",'formulaObj'],
  components: { calculatorDialog, calculationFormulaInput },
  data() {
    return {
      formula:{
        type:"number",
        exp:[],
        decimal:2
      },
      typeList:[
        {name:"数字类型",type:"number"},
        {name:"年类型",type:"year"},
        {name:"年月类型",type:"year_month"},
        {name:"月类型",type:"month"},
        {name:"日期类型",type:"date"},
        {name:"日期时间类型",type:"datetime"},
        {name:"时间类型",type:"time"},
      ],
      calculationObject:[],
      calculationSymbol: ["+", "-", "*", "/", "(", ")"],
      calculationSymbolData: ["-"],
      digitalKeyboard: [1, 2, 3, 4, 5, 6, 7, 8, 9, 0],
    };
  },
  computed:{
    isNumber(){
      return this.formula.type == 'number'
    },
    formulaValue(){
      let value = ''
      for (var i = 0; i < this.formula.exp.length; i++) {
        value += this.formula.exp[i]
      }
      return value
    },
    formItemListAll(){
      let formItemListAll = []
      for (var i = 0; i < this.formItemList.length; i++) {
        let config = this.formItemList[i]
        if(config.type == "grid"){
          let gridList = []
          for (var j = 0; j < config.columns.length; j++) {
            gridList.push(...config.columns[j].list) 
          }
          formItemListAll.push(...gridList)
        }else{
          formItemListAll.push(config)
        }
      }
      console.log(formItemListAll)
      return formItemListAll
    }
  },
  mounted(){
    this.switchType(this.formula.type)
    this.formula = JSON.parse(JSON.stringify(this.formulaObj))   
  },
  methods: {
    switchType(type){
      if(type == "number"){
         this.calculationObject = this.getformItemListfilter(["number","input_number","input_int","input_long"])
      }else if(type == "year"){
        this.calculationObject = this.getformItemListfilter(["year"])
      }else if(type == "year_month"){
        this.calculationObject = this.getformItemListfilter(["year_month"])
      }else if(type == "month"){
        this.calculationObject = this.getformItemListfilter(["month"])
      }else if(type == "datetime"){
        this.calculationObject = this.getformItemListfilter(["datetime"])
      }else if(type == "date"){
        this.calculationObject = this.getformItemListfilter(["date"])
      }else if(type == "time"){
        this.calculationObject = this.getformItemListfilter(["time"])
      }
      this.formula.exp = []
    },
    getformItemListfilter(controlTypes){
      let list = []
      for (var i = 0; i < controlTypes.length; i++) {
        let controlType = controlTypes[i]
        
        let formItemListfilter = this.formItemListAll.filter(value => {
            return value.type == controlType
        })
        list.push(...formItemListfilter)
      }
      return list
    }, 
    addControlValue(obj){
      this.formula.exp.push("${"+ obj.model +"}")
    },
    addValue(value){
      this.formula.exp.push(value) 
    },
    onCancel() {
      this.calculator.dialogVisible = false;
    },
    
    onDetermine() { 
      let isError = false
      for (var i = 0; i < this.formula.exp.length - 1; i++) {
        if(this.isModel(this.formula.exp[i]) == true && this.isModel(this.formula.exp[i + 1]) == true ){
          isError = true
          break;
        } 
      }
      if(isError){
        this.$notify.error({
          title: '错误',
          message: '编辑的公式不符合计算法则，无法计算'
        });
      }else{
        let str = this.formulaValue.replace(/\$\{([^\}]+)\}/g, (model) => { 
          return 1
        });
        try{
          eval(str)
          if(this.formula.type != "number"){
            if(this.formula.exp.length !== 3){
               this.$notify.error({
                title: '错误',
                message: '时间类型只能两控件相减,请重新编辑'
              });
              return 
            }
          } 
          this.$emit('onFormula', this.formula); 
          this.calculator.dialogVisible = false; 
        }catch(err){
          this.$notify.error({
            title: '错误',
            message: '编辑的公式不符合计算法则，无法计算'
          });
        }
      }
    },
    isModel(value){
      return  /^\$\{\w+\}$/.test(value)
    },

  },
};
</script>

<style lang="scss" scoped>
.calculator {
  position: relative;
  height: 50vh;
  padding: 20px;
  font-size: 14px;
  line-height: 20px;
  overflow:auto;
  .switchType{
    display: flex;
    // flex-flow: wrap;
    margin-bottom: 10px;
    .name{
      line-height: 30px;
      font-weight: bold;
      margin-right: 15px;
      font-size: 15px;
    }
    .radio-group{
      flex: 1;
      display: flex;
      flex-flow: wrap;
      padding-left: 0;
      .radio{
        margin:10px 0;
        min-width: 24%;
      }
    }
  }
  .calculationFormulaBox{
    position: relative;
    .calculationFormula{
      width: 100%;
      min-height: 60px;
      border: 1px solid #cecacaec;
      padding:5px 10px;
      border-radius: 4px;
    }
    .close{
      position: absolute;
      bottom: 5px;
      right: 5px; 
    }
  } 
  
  .text {
    font-size: 13px;
  }
  .buttonBox {
    display: flex;
    // align-items: center;
    flex-flow: wrap;
    .name{
      height: 49px;
      display: flex;
      align-items: center;
      margin-right: 15px;
      font-weight: bold;
      font-size: 15px;
    }
    .button {
      display: inline-block;
      text-align: center;
      min-height: 30px;
      min-width: 30px;
      // border: 1px solid #cecacaec;
      box-shadow: 0px 1px 5px #33333371;
      padding: 0 5px;
      line-height: 30px;
      background: #ffffff;
      margin: 10px;
      border-radius: 3px;
      &:hover {
        background: #e0dede;
      }
      &:active{
        box-shadow: none;
      }
    }
  }
  .numberKey{
    width: 180px;
  }
}
</style>
