<template>
  <div>
    <el-dialog
        title="表单导出"
        :visible.sync="formExportVisible2"
        v-if="formExportVisible2"
        width="70%"
        :close-on-click-modal="false"
        >
        <!-- 引用的步骤条 -->
        <el-row style="margin-bottom:15px;">
          <el-col
            v-for="(item, index) in stepsList"
            :key="index"
            :span="24 / stepsList.length"
          >
            <div
              class="step-box"
              :class="{ 'step-box-click': currentStep == index }"
              @click="setStepsActive(index)"
            >
              <span class="step-icon" :style="{background:colorArray[currentStep][index]}">{{ item.icon }}</span>
              <span class="step-text" :style="{color:colorArray[currentStep][index]}">{{ item.text }}</span>
            </div>
          </el-col>
        </el-row>

        <!-- 步骤一内容 -->
        <div v-show="currentStep === 0">
          <FormSelection :currentStep="currentStep" :formIds.sync="formIds" :exportFormList.sync="exportFormList"  ></FormSelection>
        </div>

        <!-- 步骤二内容 -->
        <div v-if="currentStep === 1">
          <DependencyAnalysis :currentStep="currentStep" :formIds="formIds" ></DependencyAnalysis>
        </div>
        <!-- 步骤三内容 -->
        <div v-show="currentStep === 2">
          <ExportResult :currentStep="currentStep" :formIds="formIds" :exportFormList="exportFormList"></ExportResult>
        </div>

        
        <span slot="footer">
          <el-button v-if="currentStep === 0" type="primary" @click="nextStep()">下一步</el-button>
          <el-button v-if="currentStep === 1" type="primary" @click="currentStep = 0">上一步</el-button>
          <el-button v-if="currentStep === 1" type="success" @click="handleSubmit()"><span>表单导出</span></el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script>
import DependencyAnalysis from "./dependencyAnalysis";
import FormSelection from "./formSelection";
import ExportResult from "./exportResult";
export default ({
  name: 'formExportDialog',
  components:{
    DependencyAnalysis,
    FormSelection,
    ExportResult,
  },
  props: {
    formExportVisible:{
      type:Boolean,
      required:true,
    },
  },
  data () {
    return {
      formExportVisible2:false,
      // 当前步骤条步骤
      currentStep:0,
      //步骤条内容
      stepsList: [
        { icon: 1, text: "表单选择" },
        { icon: 2, text: "依赖分析" },
        { icon: 3, text: "导出结果" },
      ],
      //步骤条动态内联样式
      colorArray:[
        ['#1296db','#bfbfbf','#bfbfbf'],
        ['#67c23a','#1296db','#bfbfbf'],
        ['#67c23a','#67c23a','#1296db'],
      ],

      formIds:[],   //选中的表单id数组
      exportFormList:[],    //选中的表单对象数组

    }
  },
  computed: {},
  watch: {
    formExportVisible2(val,oldVal){
      if(val === false){
        this.exportFormList = [];
        this.formIds = [];
      }
      this.$emit('update:formExportVisible',val);
    },
    formExportVisible(val,oldVal){
      this.currentStep = 0;
      // 将formExportVisible与formExportVisible2动态绑定，
      // 再由关闭窗口触发的formExportVisible2改变事件,提交关闭（不能直接触发formExportVisible改变）
      this.formExportVisible2 = val;
    },
  },
  created () {

  },
  mounted () {
  },
  methods: {
    // 下一步
    nextStep(){
      if(this.exportFormList.length === 0){
        this.$message.error("选中表单不能为空！");
        return
      }else{
        this.currentStep++;
      }
    },
    // 提交
    handleSubmit(){
      let _this = this;
      _this.currentStep++;
    },
    
    // 步骤条点击事件
    setStepsActive(index){
      // let _this = this;
      // if((_this.currentStep === 1 && index ===0)||(_this.currentStep === 0 && index ===1)){
      //   _this.currentStep = index;
      // }
    },
  }
})
</script>
<style lang="scss" scoped>
 .el-step{
    // cursor:pointer;
  }
  ::v-deep .el-dialog{
    margin-top:10vh !important;
    border-radius:10px;
  }
  ::v-deep .el-dialog__header{
    border-radius:5px;
    // background:linear-gradient(45deg, #e0e0e0, #424242);
    background: #0078ee;
    .el-dialog__title {
      color: #ffffff;
      font-size: 15px;
    }
    .el-dialog__headerbtn {
      color: #ffffff !important;
      font-size: 20px !important;
    }
    .el-dialog__headerbtn .el-dialog__close{
      color:#ffffff;
    }
  }
  ::v-deep .el-dialog__body{
    padding:20px;
  }
  ::v-deep .el-steps--simple{
    background:#e4e4e4;
    color:black;
    border-radius: 10px;

  }

  



  .step-box {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f7fa;
    padding: 10px 5px;
    color: #bfbfbf;
    margin-top: 10px;
    // cursor:pointer;
    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 30px;
      display: flex;
      background: #bfbfbf;
      color: #ffffff;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
    }
    .step-text {
      font-size: 18px;
      color: #bfbfbf;
      font-weight: bold;
    }
  }
  .step-box-click {
    .step-icon {
      background: #1296db;
    }
    .step-text {
      color: #1296db;
    }
  }
</style>

