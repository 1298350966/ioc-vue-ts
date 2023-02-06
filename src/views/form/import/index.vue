<template>
  <div>
    <el-dialog
        title="表单导入"
        :visible.sync="formImportVisible2"
        v-if="formImportVisible2"
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
        <div v-if="currentStep === 0">
          <FileSelection :currentStep="currentStep" :formIds.sync="formIds" :importFiles.sync="importFiles"></FileSelection>
        </div>

        <!-- 步骤二内容 -->
        <div v-if="currentStep === 1">
          <DependencyAnalysis :currentStep="currentStep" :formIds="formIds" :importFiles="importFiles" @formDependDataChange="formDependDataChange"></DependencyAnalysis>
        </div>
        <!-- 步骤三内容 -->
        <div v-show="currentStep === 2">
          <ImportResult :currentStep="currentStep"  :importFiles="importFiles" :formDependData="formDependData"></ImportResult>
        </div>

        
        <span slot="footer">
          <el-button v-if="currentStep === 0" type="primary" @click="nextStep()">下一步</el-button>
          <el-button v-if="currentStep === 1" type="primary" @click="currentStep = 0">上一步</el-button>
          <el-button v-if="currentStep === 1" type="danger" @click="handleSubmit()">表单导入</el-button>
        </span>
    </el-dialog>

  </div>
</template>
<script>
import DependencyAnalysis from "./dependencyAnalysis";
import FileSelection from "./fileSelection";
import ImportResult from "./importResult";
export default ({
  name: 'formImportDialog',
  components:{
    DependencyAnalysis,
    FileSelection,
    ImportResult,
  },
  props: {
    formImportVisible:{
      type:Boolean,
      required:true,
    },
  },
  data () {
    return {
      formImportVisible2:false,
      // 当前步骤条步骤
      currentStep:0,
      //步骤条内容
      stepsList: [
        { icon: 1, text: "选择表单文件" },
        { icon: 2, text: "导入表单列表" },
        { icon: 3, text: "导入结果" },
      ],
      //步骤条动态内联样式
      colorArray:[
        ['#1296db','#bfbfbf','#bfbfbf'],
        ['#67c23a','#1296db','#bfbfbf'],
        ['#67c23a','#67c23a','#1296db'],
      ],

      formIds:[],
      importFiles:null,
      formDependData:[],

    }
  },
  computed: {},
  watch: {
    formImportVisible2(val,oldVal){
      if(val === false){
        this.formIds = [];
        this.importFiles = null;
        // 导入完成，关闭弹窗后通知页面刷新数据
        if(this.currentStep === 2){
          this.$emit('handleImportSave',true)
        }
      }
      this.$emit('update:formImportVisible',val);
    },
    formImportVisible(val,oldVal){
      this.currentStep = 0;
      // 将formImportVisible与formImportVisible2动态绑定，
      // 再由关闭窗口触发的formImportVisible2改变事件,提交关闭（不能直接触发formImportVisible改变）
      this.formImportVisible2 = val;
    },
  },
  created () {

  },
  mounted () {
  },
  methods: {
    
    // 下一步
    nextStep(){
      let _this = this;
      if(_this.importFiles == null){
        _this.$message.error("请先选择需要导入的表单文件！")
        return;
      }else{
        _this.currentStep++;
      }
    },
    // 提交导入
    handleSubmit(){
      let _this = this;
      this.$confirm('导入成功后导入表单将覆盖原表单！是否继续?', '警告', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        if(_this.importFiles == null){
          _this.$message.error("请先选择需要导入的表单文件！")
          return;
        }else{
          _this.currentStep++;
        }
      })
    },

    // 步骤条点击事件
    setStepsActive(index){
      // let _this = this;
      // if((_this.currentStep === 1 && index ===0)||(_this.currentStep === 0 && index ===1)){
      //   _this.currentStep = index;
      // }
    },

    importFilesChange(files){
      this.importFiles = files
    },
    formDependDataChange(val){
      this.formDependData = val;
    }

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

