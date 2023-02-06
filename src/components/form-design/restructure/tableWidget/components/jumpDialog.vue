<template>
  <el-dialog id="FormDialog" top="10vh" :title="customTitle" :visible.sync="customVisible" v-if="customVisible" :close-on-click-modal="false"
                      :width="dialogWidth" :append-to-body="true"
                      :fullscreen="jumpDialogFullscreen"
                      :top="dialogTop"
                      :class="KHUtils.isNull(customUrl) ? customCss1 : customCss2">
        <div>
            <customJump ref="FormDialogBody"  v-bind="$attrs"  @close="customVisible = false"></customJump>
        </div>
  </el-dialog>

</template>

<script>
import customJump from "./customJump"
export default {
  props:["customTitle","jumpDialogFullscreen","jumpDialogWidth","jumpDialogHeight","jumpDialogTop"],
  components:{
    customJump
  },
  data() {
    return {
      customCss1: 'custom-pop-iframe',
      customCss2: 'custom-dialog-form',
    }
  },
  computed:{
    dialogWidth(){ 
      let width = this.jumpDialogWidth || ""
      if(width.includes("px") || width.includes("vw") || width.includes("%") ){
        return width
      }else{
        return (width || "60")  + "%"
      }
    }, 
    dialogHeight(){
      let height = this.jumpDialogHeight || ""
      if(height.includes("px") || height.includes("vw") || height.includes("%") ){
        return height
      }else{
        if(height){
          return ( height || "80" ) + "vh"
        }else{
          return ""
        }
      }
    },
    dialogTop(){
      let top = this.jumpDialogTop || ""
      if(top.includes("px") || top.includes("vw") || top.includes("%") ){
        return top
      }else{
        return ( top || "10" ) + "vh"
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
  methods:{
    init(){
      if(this.dialogHeight){
        this.$nextTick(()=>{
          let dialog__header = document.querySelector("#FormDialog > div > div.el-dialog__header")
          let headerHeight = dialog__header.offsetHeight
          let dialog__body = document.querySelector("#FormDialog > div > div.el-dialog__body")
          dialog__body.style.height = `calc( ${this.dialogHeight} - ${headerHeight}px)`
          dialog__body.style.overflow = "auto"
        })
      }
    },
  }
}
</script>

<style>

</style>