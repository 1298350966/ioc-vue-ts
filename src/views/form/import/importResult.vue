<template>
  <div>
      <div class="resultHeader">
        <span style="color:#1296db;" v-if="totalStatus === 0">
          {{"正在导入表单......"}}
        </span>
        <span style="color:#65c33b;" v-if="totalStatus === 1">
          {{"导入完成，导入成功的表单已覆盖原表单！"}}
        </span>
        <span style="color:red;" v-if="totalStatus === -1">
          {{"导入失败！请重新选择表单文件进行导入"}}
        </span>
        <span style="margin-left:auto;color:#b1b1b1">
          任务总数:&emsp;<span style="color:#65c33b;">{{successCount}}</span>&nbsp;/&nbsp;{{totalCount}}
        </span>
      </div>
      <el-table
        v-if="currentStep === 2 "
        :data="resultData"
        style="width: calc(80% + 100px);margin:0 auto;"
        :header-cell-style="{color:'#606266',fontSize:'18px',}"
        :cell-style="{height:'45px',}"
        height="500"
        stripe
        v-loading="tableLoading">
        <el-table-column
          prop="formName"
          label="表单名称"
          align="center">
        </el-table-column>
        <el-table-column
          prop="uploadStatus" 
          label="导入状态"
          align="center">
        <template slot-scope="scope">
            <el-tag  size="medium" :type="resultTag[resultTagMap.get(scope.row.uploadStatus)].type">
              <i :class="[resultTag[resultTagMap.get(scope.row.uploadStatus)].icon]"></i>
              &nbsp;{{resultTag[resultTagMap.get(scope.row.uploadStatus)].text}}
            </el-tag> 
        </template>
        </el-table-column>
      </el-table>
  </div>
</template>
<script>
export default ({
  name: 'importResult',
  props: {
    importFiles:{
      require:true,
    },
    formDependData:{
      type:Array,
    },
    // importFormList:{
    //   type:Array,
    //   required:true,
    // },
    currentStep:{
      type:Number,
      required:true,
    },
  },
  data () {
    return {
      tableLoading:true,
      resultTag:[
        {state:3,type:'primary',icon:'el-icon-loading',text:'导入中.....'},
        {state:0,type:'success',icon:'el-icon-check',text:'导入成功'},
        {state:1,type:'danger',icon:'el-icon-circle-close',text:'导入失败'},
        {state:-1,type:'warning',icon:'el-icon-circle-close',text:'导入成功(部分失败)'},
        {state:-2,type:'info',icon:'el-icon-icon-upload',text:'队列中.....'},
      ],
      
      resultData: [], //导入结果
      totalStatus:0,
      successCount:0,

      timerTaskKey:'',  // 导入任务密钥
      importTimer:null,   // 导入任务定时器
      exportFormList:[],  // 导入文件解析出的表单列表

    }
  },
  computed: {
    totalCount(){
      return this.formDependData.length;
    },
    resultTagMap(){
      let map = new Map();
      this.resultTag.forEach((item,index)=>{
        map.set(item.state,index)
      })
      return map;
    },
    formDependDataMap(){
      let map =new Map();
      this.formDependData.forEach((item,index)=>{
        map.set(item.id,item.name)
      })
      return map;
    }
  },
  watch: {
    currentStep(val,oldVal){
      if(val === 2){
        this.submitFormImport(this.importFiles);
      }
    }
  },
  created () {

  },
  mounted () {
  },
  methods: {
    //提交表单文件,获取导入结果密钥
    async submitFormImport(file) {
        let _this = this;
        const files = file;
        const formData = new FormData();
        formData.append("dmpfile", files);
        const res = await this.$Post(_this.khConfig.api.formImport, formData).finally(() => {
            this.isLoad = false;
        });
        if (res.errCode === 0) {
           _this.timerTaskKey = res.syncFormTaskKey;
           _this.setTimerTask();
        }
    },
    // 表单导入：定时器轮询任务
    setTimerTask(){
      let _this = this;
      _this.timerTask();
      _this.importTimer = setInterval(_this.timerTask,2000);
    },

    //导入定时任务
    timerTask(){
      let _this = this;
      let url = _this.khConfig.api.queryExportOrImportStatus + '/' + _this.timerTaskKey;
      _this.$Post(url).then(res=>{
        if(res.errCode === 0){
          _this.resultData = [];
          if(res.data.status === "finished"){  //导入完成状态
            _this.totalStatus = 1;
            for(let key in res.data.statusDesc){
              let obj={
                id:key,
                formName:_this.formDependDataMap.get(key),
                uploadStatus:Number(res.data.statusDesc[key])
              }
              _this.resultData.push(obj);

              if(obj.uploadStatus === 0){
                _this.successCount++;
              }
            }
            
            clearInterval(_this.importTimer);
          }else if(res.data.status === "failed"){ //导入失败,这里的failed是所有任务总状态
            // _this.setResultData(res.data.status);
            _this.totalStatus = -1;
            clearInterval(_this.importTimer);
          }else{   //backuping导入中：需要数据处理
            _this.setResultData(res.data.status);
            _this.totalStatus = 0;
          }
          _this.tableLoading = false;
        }
      })
    },

    // 未返回状态的情况下，手动拼接状态结果为导入中
    setResultData(state){
      let _this = this;
      let importResultData = [];
      _this.formDependData.forEach((item)=>{
        let obj = {
          id: item.id,
          formName: _this.formDependDataMap.get(item.id),
          uploadStatus: state === 'backuping'?3:1
        };
        importResultData.push(obj)
      })
      _this.resultData = importResultData;
    },

  },

  //组件销毁清空定时器
  beforeDestroy(){
    clearInterval(this.importTimer);
    this.importTimer = null;
  }
})
</script>
<style lang="scss" scoped>
.resultHeader{
  width: 90%;
  height: 40px;
  line-height: 40px;
  margin:10px auto 0 auto;
  padding: 0 15px;
  display: flex;
  // background: rgb(151, 200, 240);
  font-weight: 400;
}




::v-deep .el-table__indent{
    position: relative;
    &::before{
      position: absolute;
      content: '依赖表单:';
      left: 50px;
      color: red;
    }

  }

  // ::v-deep .el-table__row--level-1{
  //   background: #f1f1f1 ;
  // }
  // ::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td{
  //   background:transparent;
  // }

  ::v-deep .el-table__expanded-cell{
    padding: 20px 0px 20px 50px;
    background: #f1f1f1;
  }
  ::v-deep .el-table__expanded-cell:hover{
    background: #f1f1f1 !important;
  }
</style>

