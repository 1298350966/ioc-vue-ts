<template>
  <div  v-bind="$attrs" v-on="$listeners" class="calculationFormulaInput">
    <span> 计算公式= </span>
    <span v-html="valueHtml"></span>
  </div>
</template>

<script>
export default {
  props:{
    value:{
      type:Array,
      default:function(){
        return []
      }
    },
    variableList:{
      type:Array,
      default:function(){
        return []
      }
    }
  },
  computed:{
    formulaValue(){
      let value = ''
      for (var i = 0; i < this.value.length; i++) {
        value += this.value[i]
      }
      return value
    },
    valueHtml(){
      console.log(this.value)
      let domHtml = this.formulaValue.replace(/\$\{([^\}]+)\}/g, (model) => { 
          model = model.replace("${","");
          model = model.replace("}","")
          let variable = this.variableList.find(value => value.model == model)
          if(variable){
              return  `<span class="tag"  style="background: #6ad5ff8e;padding: 2px 4px;border-radius: 4px;margin:0 2px;" contenteditable="false">${variable.name}</span>`
          }else{
              return ''
          }
          
      });
      return domHtml
    }
  }
};
</script>

<style lang="scss" scoped>
.calculationFormulaInput {
  font-size: 10px;
  border-radius: 3px;
  min-height: 45px;
  -webkit-appearance: none;
  background-color: #fff;
  background-image: none;
  border-radius: 4px;
  border: 1px solid #dcdfe6;
  -webkit-box-sizing: border-box;
  box-sizing: border-box;
  color: #606266;
  display: inline-block;
  font-size: inherit;
  line-height: 25px;
  outline: none;
  padding: 2px 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
}
</style>
