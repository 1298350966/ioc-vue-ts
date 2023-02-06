<template>
  <div
    id="inputBox"
    v-html="inputBoxhtml"
    class="input-box"
    ref="inputBox"
    contenteditable="true"
    @paste.prevent
    @blur="changeText"
  ></div>
</template>

<script>
export default {
  name:"tagInput",
  props: {
    value: {
      type: String | Number,
      default: "",
    },
    variableList:{
      type: Array,
      default: function(){
          return []
      }
    }
  },
  data() {
    return {
        list:[]
    //   inputBoxhtml:`<span style="background: #6ad5ff8e;padding: 2px 4px;border-radius: 4px;margin:0 2px;" contenteditable="false">111111</span>`
    };
  },
  computed: {
    inputBoxhtml () {
        let domHtml = this.value.replace(/\$\{([^\}]+)\}/g, (model) => { 
            model = model.replace("${","");
            model = model.replace("}","")
            let variable = this.variableList.find(value => value.model == model)
            if(variable){
                this.list.push(variable)
                return  `<span class="tag"  style="background: #6ad5ff8e;padding: 2px 4px;border-radius: 4px;margin:0 2px;" contenteditable="false">${variable.name}</span>`
            }else{
                return ''
            }
            
        });
        return domHtml 
      
    },
   

  },
  methods:{
    getExecStrs(str) {
        var reg = /\$\{(.+?)\}/g
        var list = []
        var result = null
        do {
            result = reg.exec(str)
            result && list.push(result[1])
        } while (result)
        return list
    },
    changeText(e,b){
        let value =''
        e.target.childNodes.forEach((domNode, index, array) => {
            if(domNode.innerText){
              
                let  formconf =this.list.find((value, index, array) => {
                  return value.name == domNode.innerText
                })
                if(formconf){
                  value = value + '${' + formconf.model + '}'
                }
            }else{
                value =value +   domNode.textContent
            }
        })     
        this.$emit('input',value) 
    }
  }

};
</script>

<style scoped lang="scss">
.input-box {
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
  min-height: 32px;
  line-height: 20px;
  outline: 0;
  padding: 6px 15px;
  -webkit-transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  transition: border-color 0.2s cubic-bezier(0.645, 0.045, 0.355, 1);
  width: 100%;
  overflow: hidden;
  // white-space: nowrap;
  &:focus {
    border-color: #409eff;
    outline: 1;
  }
}
.tag {
    background: #6ad5ff8e;
    padding: 2px 4px;
    border-radius: 4px;
    margin:0 2px;

}
</style>