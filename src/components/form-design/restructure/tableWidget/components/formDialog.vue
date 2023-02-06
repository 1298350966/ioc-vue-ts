<template>
  <div class="FormDialog">
    <el-dialog id="FormDialog" custom-class="FormDialog" top="10vh" :title="dialogTitle" :visible.sync="customVisible" v-if="customVisible" :close-on-click-modal="false"
                      :width="dialogWidth" :append-to-body="true"
                      :fullscreen="dialogFullscreen" :top="dialogTop">
          <div>
              <component ref="FormDialogBody" :is="componentName" 
                v-bind="$attrs" 
                @close="customVisible = false">
              </component>    
          </div>
    </el-dialog>
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
          dialogHeight:"", 
          dialogFullscreen:"0", //0非全屏 1全屏
        }
       }       
    },
    dialogTitle(){ 
      return this.dialogConfig.dialogTitle || this.$attrs.formTitle || ""
    },
    dialogWidth(){ 
      let width = this.dialogConfig.dialogWidth || ""
      if(width.includes("px") || width.includes("vw") || width.includes("%") ){
        return width
      }else{
        return (width || "60")  + "%"
      }
    }, 
    dialogHeight(){
      let height = this.dialogConfig.dialogHeight || ""
      if(height.includes("px") || height.includes("vw") || height.includes("%") ){
        return height
      }else{
        if(height){
          return (height || "80" ) + "vh"
        }else{
          return ""
        }
      }
    },
    dialogTop(){
      let top = this.dialogConfig.dialogTop
      if(top.includes("px") || top.includes("vw") || top.includes("%") ){
        return top
      }else{
        return ( top || "10" ) + "vh"
      }
    },
    dialogFullscreen(){
      return this.dialogConfig.dialogFullscreen  === "1" ? true :false
    },
    componentName(){
      if(this.$attrs.formTitle==="新增" || this.$attrs.formTitle==="编辑"){
        return this.asyncComp("addOrEditForm")
      }else if(this.$attrs.formTitle==="详情") {
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
    this.init()
  },
  methods: {
    init(){
      if(this.dialogHeight){
        this.$nextTick(()=>{
          let dialog__header = document.querySelector("#FormDialog > div > div.el-dialog__header")
          let headerHeight = dialog__header.offsetHeight
          let dialog__body = document.querySelector("#FormDialog > div > div.el-dialog__body")
          if(this.dialogFullscreen){
            dialog__body.style.height = `100%`
          }else{
            dialog__body.style.height = `calc( ${this.dialogHeight} - ${headerHeight}px)`
          }
          dialog__body.style.overflow = "auto"
        })
      }
    },
    asyncComp(cn){
        let ts = () => import(`./${cn}`);
        this.$options.components[cn]=ts;
        return cn
    },
  },
}
</script>

<style>

</style>