<template>
  <div ref="jumpPage" class="jumpPage">
    <div class="page-header">
        <el-page-header @back="back" :content="customTitle">
        </el-page-header>
    </div>
    <customJump v-bind="$attrs" @close="customVisible = false"></customJump>
  </div>
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
    }
  },
  computed:{
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
      FormPage.appendChild(this.$refs.jumpPage)
    })
  },
  beforeDestroy(){
    let FormPage = document.getElementById("FormPage")
    let FormDrag = document.getElementById("FormDrag")
    FormPage.style.display = "none"
    FormDrag.style.display = "block"
    // if(this.$refs.jumpPage){
    //   FormPage.removeChild(this.$refs.jumpPage)
    // }
  },
  methods:{
    back(){
      this.customVisible = false
    },
  }   
}
</script>

<style lang="scss" scoped>
.normalPage{
  position: relative;
  .page-header{
    margin: 0 0 20px 0;
  }
}
</style>