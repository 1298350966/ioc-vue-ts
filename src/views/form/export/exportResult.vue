<template>
  <div>
      <div class="resultHeader">
        <span style="color:#1296db;" v-if="totalStatus === 0">
          {{"正在导出表单......"}}
        </span>
        <span style="color:#65c33b;" v-if="totalStatus === 1">
          {{"导出成功，请点击链接下载导出的表单文件："}}
          <a @click="downLoadFile(exportFileId)" style="text-decoration: underline;cursor:pointer;">{{exportFileId}}</a>
        </span>
        <span style="color:red;" v-if="totalStatus === -1">
          {{"导出失败！请重新选择表单进行导出"}}
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
          label="导出状态"
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
  name: 'exportResult',
  props: {
    exportFormList:{
      type:Array,
      required:true,
    },
    currentStep:{
      type:Number,
      required:true,
    },
    formIds:{
      type:Array,
      required:true,
    },
  },
  data () {
    return {
      tableLoading:true,
      resultTag:[
        {state:3,type:'primary',icon:'el-icon-loading',text:'正在导出.....'},
        {state:0,type:'success',icon:'el-icon-check',text:'导出成功'},
        {state:1,type:'danger',icon:'el-icon-circle-close',text:'导出失败'},
        {state:-1,type:'warning',icon:'el-icon-circle-close',text:'导出成功(部分失败)'},
        {state:-2,type:'info',icon:'el-icon-icon-upload',text:'队列中.....'},
      ],

      resultData: [],   //导出结果
      totalStatus:0,    //总状态：-1失败，0导出中，1成功
      successCount:0,
      
      timerTaskKey:'',    // 导出任务密钥
      exportTimer:null,   // 导出定时器
      exportFileId:'',    //导出文件ID

    }
  },
  computed: {
    totalCount(){
      return this.formIds.length;
    },
    resultTagMap(){
      let map = new Map();
      this.resultTag.forEach((item,index)=>{
        map.set(item.state,index)
      })
      return map;
    },
    exportFormListMap(){
      let map = new Map();
      this.exportFormList.forEach((item,index)=>{
        map.set(item.formId,item.formName)
      })
      return map;
    }
  },
  watch: {
    currentStep(val,oldVal){
      if(val === 2){
        this.submitAllotTenants();
      }
    }
  },
  created () {

  },
  mounted () { 
  },
  methods: {
    //提交表单导出,获取导出结果密钥
    submitAllotTenants(){
      let _this = this;
      let params = {
        formIds : _this.formIds.join(","),
      }
      _this.$Get(_this.khConfig.api.formExport,params).then(res=>{
        if(res.errCode === 0){
          _this.timerTaskKey = res.syncFormTaskKey;
          _this.setTimerTask();
        }
      })

    },
    // 表单导出：定时器轮询任务
    setTimerTask(){
      let _this = this;
      _this.timerTask();
      _this.exportTimer = setInterval(_this.timerTask,2000);
    },

    //导出定时任务
    timerTask(){
      let _this = this;
      let url = _this.khConfig.api.queryExportOrImportStatus + '/' + _this.timerTaskKey;
      _this.$Post(url).then(res=>{
        if(res.errCode === 0){
          _this.resultData = [];
          if(res.data.status === "finished"){  //导出完成状态
            _this.totalStatus = 1;
            _this.exportFileId = res.data.fileId;
            for(let key in res.data.statusDesc){
              let obj={
                id:key,
                formName:_this.exportFormListMap.get(Number(key)),
                uploadStatus:Number(res.data.statusDesc[key])
              }
              _this.resultData.push(obj);
              
              if(obj.uploadStatus === 0){
                _this.successCount++;
              }
            }
            clearInterval(_this.exportTimer);
          }else if(res.data.status === "failed"){ //导出失败,这里的failed是所有任务总状态
            _this.totalStatus = -1;
            // _this.setResultData(res.data.status);
            clearInterval(_this.exportTimer);
          }else{   //backuping导出中：需要数据处理
            _this.totalStatus = 0;
            _this.setResultData(res.data.status);
          }
          _this.tableLoading = false;
        }
      })
    },
    // 未返回状态的情况下，手动拼接状态结果为导入/导出中
    setResultData(state){
      let _this = this;
      let exportResultData = [];
      _this.exportFormList.forEach((item)=>{
        let obj = {
          id:item.formId,
          formName:item.formName,
          uploadStatus:state==='backuping'?3:1
        }
        exportResultData.push(obj)
      })
      _this.resultData = exportResultData;
    },



    // 下载文件
    downLoadFile(fileId) {
        if (this.KHUtils.isNull(fileId)) {
            this.$message.warning("下载失败,未上传任何文件");
            return false;
        }
        this.$OpenUrl(this.khConfig.host.rest + this.khConfig.api.fileDownload + "/" + fileId);
    },
  },

  //组件销毁清空定时器
  beforeDestroy (){
    clearInterval(this.exportTimer);
    this.exportTimer = null;
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

