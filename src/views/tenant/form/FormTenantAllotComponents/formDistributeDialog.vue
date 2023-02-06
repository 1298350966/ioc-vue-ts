<template>
  <div>
    <el-dialog
        :title="isSync?'表单配置同步':'表单分配'"
        :visible.sync="formDistributeVisible2"
        v-if="formDistributeVisible2"
        width="70%"
        >
        <!-- 引用的步骤条 -->
        <el-row style="margin-bottom:15px;">
          <el-col
            v-for="(item, index) in isSync?stepsList:stepsList2"
            :key="index"
            :span="24 / (isSync?stepsList.length:stepsList2.length)"
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
        <div v-if="currentStep === 0">
          <DependencyAnalysis :currentStep="currentStep" :formIds="formIds" :isSync="isSync"></DependencyAnalysis>
        </div>

        <!-- 步骤二内容 -->
        <div v-if="currentStep === 1">
          <TenantSelection :currentStep="currentStep" :formIds="formIds" @chekcdTenantsData="submitChekcdTenantsData" @allTenantsList="submitAllTenantsList" :isSync="isSync"></TenantSelection>
        </div>
        <!-- 步骤三内容 -->
        <div v-show="currentStep === 2">
          <AllocationResult :currentStep="currentStep" :formIds="formIds" :chekcdTenantsData="chekcdTenantsData" :allTenantsList="allTenantsList" :isSync="isSync"></AllocationResult>
        </div>

        
        <span slot="footer">
          <el-button v-if="currentStep === 0" type="primary" @click="nextStep()">下一步</el-button>
          <el-button v-if="currentStep === 1" type="primary" @click="currentStep = 0">上一步</el-button>
          <el-button v-if="currentStep === 1" type="success" @click="handleSubmit()">{{isSync?'同步配置':'表单分配'}}</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script>
import DependencyAnalysis from "@/views/tenant/form/FormTenantAllotComponents/dependencyAnalysis";
import TenantSelection from "@/views/tenant/form/FormTenantAllotComponents/tenantSelection";
import AllocationResult from "@/views/tenant/form/FormTenantAllotComponents/allocationResult";
export default ({
  name: 'formDistributeDialog',
  components:{
    DependencyAnalysis,
    TenantSelection,
    AllocationResult,
  },
  props: {
    formDistributeVisible:{
      type:Boolean,
      required:true,
    },
    formIds:{
      type:Number,
      required:true,
    },
    isSync:{
      type:Boolean,
      required:true,
    }
  },
  data () {
    return {
      // isSync:true,
      formDistributeVisible2:false,
      // 已选中的租户
      chekcdTenantsData:[],
      //所有租户（穿梭框选中）
      allTenantsList:[],
      // 当前步骤条步骤
      currentStep:0,
      //步骤条内容
      stepsList: [
        { icon: 1, text: "依赖分析" },
        { icon: 2, text: "租户选择" },
        { icon: 3, text: "同步结果" },
      ],
      stepsList2: [
        { icon: 1, text: "依赖分析" },
        { icon: 2, text: "租户选择" },
        { icon: 3, text: "分配结果" },
      ],
      //步骤条动态内联样式
      colorArray:[
        ['#1296db','#bfbfbf','#bfbfbf'],
        ['#67c23a','#1296db','#bfbfbf'],
        ['#67c23a','#67c23a','#1296db'],
      ],

    }
  },
  computed: {},
  watch: {
    formDistributeVisible2(val,oldVal){
      this.$emit('update:formDistributeVisible',val);
    },
    formDistributeVisible(val,oldVal){
      this.currentStep = 0;
      this.chekcdTenantsData = [];
      // 将formDistributeVisible与formDistributeVisible2动态绑定，
      // 再由关闭窗口触发的formDistributeVisible2改变事件,提交关闭（不能直接触发formDistributeVisible改变）
      this.formDistributeVisible2 = val;
    },
  },
  created () {

  },
  mounted () {
  },
  methods: {
    
    // 下一步
    nextStep(){
      this.currentStep++;
    },
    // 提交
    handleSubmit(){
      let _this = this;
      if(_this.chekcdTenantsData.length === 0){
        _this.$message.error("选择租户不能为空！");
      }else{
        _this.currentStep++;
      }
    },
    
    

    submitChekcdTenantsData(checkedArray){
      this.chekcdTenantsData = checkedArray;
    },
    submitAllTenantsList(checkedArray){
      this.allTenantsList = checkedArray;
    },

    // 步骤条点击事件
    setStepsActive(index){
      let _this = this;
      if((_this.currentStep === 1 && index ===0)||(_this.currentStep === 0 && index ===1)){
        _this.currentStep = index;
      }
    },

  }
})
</script>
<style lang="scss" scoped>
 .el-step{
    cursor:pointer;
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
    cursor:pointer;
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

