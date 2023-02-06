<template>
  <div ref="normalPage" class="normalPage">
    <div class="page-header">
        <el-page-header @back="back" :content="formTitle">
        </el-page-header>
    </div>
    <component
     :is="componentName"
      v-bind="$attrs" 
      @close="customVisible = false">
    </component>
  </div>
</template>

<script>
// import addOrEditForm from "./addOrEditForm.vue"
// import formDetail from "./formDetail.vue"
import {dialogConfig} from "@/config"
export default {
  components:{
    // addOrEditForm,
    // formDetail
  },
  props:{
    btnConfig:{
      type:Object,
      default:()=>{
        return {
        }
      }
    }
  },
  computed:{
    dialogConfig(){
       if(this.btnConfig.displayConfig){
        return this.btnConfig.displayConfig
       }else{
        return  {
          type: "0", // /0 弹窗 1普通页面
          dialogTitle: "", //标题
          dialogTop: dialogConfig.top || "10",
          dialogWidth:dialogConfig.width || "60", //宽度
          dialogHeight: dialogConfig.height ||"80", 
          dialogFullscreen:"0", //0非全屏 1全屏
        }
       }       
    },
    formTitle(){ 
      return this.dialogConfig.dialogTitle || this.$attrs.formTitle || ""
    },
    componentName(){
      // "detail" "edit" "add"
      if(this.btnConfig.key==="add" || this.btnConfig.key==="edit"){
        return this.asyncComp("addOrEditForm")
      }else if(this.btnConfig.key==="detail") {
        return this.asyncComp("formDetail")
      }
    },
    customVisible:{
       get(){
        return this.$attrs.visible
       },
       set(val){
         this.$emit("close",false)
         this.$emit("update:visible",val)
       }
    },
  },
  mounted(){
    let FormPage = document.getElementById("FormPage")
    let FormDrag = document.getElementById("FormDrag")
    this.$nextTick(()=>{
      FormPage.style.display = "block"
      FormDrag.style.display = "none"
      if(FormPage.childNodes.length){
        FormPage.removeChild(FormPage.childNodes[0])
      }
      FormPage.appendChild(this.$refs.normalPage)
    })
  },
  beforeDestroy(){
    let FormPage = document.getElementById("FormPage")
    let FormDrag = document.getElementById("FormDrag")
    FormPage.style.display = "none"
    FormDrag.style.display = "block"
    // if(this.$refs.normalPage){
    //   FormPage.removeChild(this.$refs.normalPage)
    // }
  },
  methods:{
    back(){
      this.customVisible = false
    },
    asyncComp(cn){
        let ts = () => import(`./${cn}`);
        this.$options.components[cn]=ts;
        return cn
    },
  }
}
</script>

<style lang="scss" scoped>

.normalPage{
  .page-header{
    margin: 0 0 20px 0;
  }
}

</style>