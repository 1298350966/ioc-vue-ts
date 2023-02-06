<template>
  <div>
     <!-- 步骤三内容 -->
        <!-- --------------------------------------表单同步结果显示-------------------------------------- -->
        <div v-show="isSync">
          <el-table
            v-if="currentStep === 2 "
            :data="syncOrAllotResultData"
            style="width: calc(80% + 100px);margin:0 auto;"
            :header-cell-style="{color:'#606266',fontSize:'18px',}"
            height="550"
            border
            stripe>
            <el-table-column
              prop="tenantName"
              label="租户名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="uploadStatus" 
              label="同步状态"
              align="center">
            <template slot-scope="scope">
              <el-tag  size="medium" v-if="scope.row.uploadStatus === 3" ><i class="el-icon-loading"></i>&nbsp;同步中.....</el-tag>
              <el-tag  size="medium" v-if="scope.row.uploadStatus === 0" type="success"><i class="el-icon-check"></i>&nbsp;同步完成</el-tag>
              <el-tag  size="medium" v-if="scope.row.uploadStatus === 1" type="danger"><i class="el-icon-circle-close"></i>&nbsp;同步失败</el-tag>
              <el-tag  size="medium" v-if="scope.row.uploadStatus === -1" type="warning"><i class="el-icon-circle-close"></i>&nbsp;同步完成(部分失败)</el-tag>
              <el-tag  size="medium" v-if="scope.row.uploadStatus === -2" type="info"><i class="el-icon-circle-close"></i>&nbsp;队列中.....</el-tag>
            </template>
            </el-table-column>
          </el-table>
        </div>
       <!-- --------------------------------------表单分配结果显示-------------------------------------- -->
        <div v-show="!isSync">
          <div class="resultHeader" v-if="isV2">
            <span style="color:#1296db;">{{totalStatus==0?"任务进行中......":"任务已完成"}}</span>
            <span style="margin-left:auto;">任务执行状态:&emsp;{{finishedTaskNum}}&nbsp;/&nbsp;{{totalTaskNum}}</span>
          </div>
          <el-table
            v-if="currentStep === 2 "
            :data="syncOrAllotResultData"
            style="width: calc(80% + 100px);margin:0 auto;"
            :header-cell-style="{color:'#606266',fontSize:'18px',}"
            :cell-style="{height:'45px',}"
            height="500"
            border
            stripe>
            <el-table-column
              prop="tenantName"
              label="租户名称"
              align="center">
            </el-table-column>
            <el-table-column
              prop="uploadStatus" 
              label="分配状态"
              align="center">
            <template slot-scope="scope">
                <el-tag  size="medium" v-if="scope.row.uploadStatus === 3" ><i class="el-icon-loading"></i>&nbsp;分配中.....</el-tag>
                <el-tag  size="medium" type="success" v-if="scope.row.uploadStatus === 0" ><i class="el-icon-check"></i>&nbsp;分配完成</el-tag>
                <el-tag  size="medium" type="success" v-if="scope.row.uploadStatus === 1" ><i class="el-icon-circle-close"></i>&nbsp;分配失败</el-tag>
                <el-tag  size="medium" type="warning" v-if="scope.row.uploadStatus === -1" ><i class="el-icon-circle-close"></i>&nbsp;分配完成(部分失败)</el-tag>
                <el-tag  size="medium" type="info" v-if="scope.row.uploadStatus === -2" ><i class="el-icon-icon-upload"></i>&nbsp;队列中.....</el-tag> 
            </template>
            </el-table-column>
            <!-- 内嵌表单分配/同步状态表格 -->
            <el-table-column type="expand" v-if="isV2">
              <el-table
                 border
                :data="formDependData"
                cell-style="border:0px;background:#f1f1f1;"
                :header-cell-style="{display:'none'}"
                row-key="id"
                default-expand-all
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
                :indent="indents"
                ref="allotResultTable"
                >
                <el-table-column
                  prop="name"
                  show-overflow-tooltip>
                </el-table-column>
                <el-table-column
                  prop="status"
                  align="center"
                  >
                  <template slot-scope="scope">
                    <el-tag effect="dark" size="mini" type="success" v-if="scope.row.status === 0" ><i class="el-icon-loading"></i>&nbsp;{{isSync?'正在同步':'正在分配'}}</el-tag>
                    <el-tag effect="dark" size="mini" type="danger" v-if="scope.row.status === 1" ><i class="el-icon-check"></i>&nbsp;{{isSync?'同步失败':'分配失败'}}</el-tag>
                    <el-tag effect="dark" size="mini" type="warning" v-if="scope.row.status === 2" ><i class="el-icon-circle-close"></i>&nbsp;{{isSync?'同步失败（部分失败）':'分配失败（部分失败）'}}</el-tag> 
                    <el-tag effect="dark" size="mini" type="info" v-if="scope.row.status === -1" ><i class="el-icon-upload"></i>&nbsp;队列中....</el-tag>
                    
                  </template>
                </el-table-column>
              </el-table>
            </el-table-column>
          </el-table>
        </div>
        

  </div>
</template>
<script>
export default ({
  name: 'allocationResult',
  props: {
    chekcdTenantsData:{
      type:Array,
      required:true,
    },
    allTenantsList:{
      type:Array,
      required:true,
    },
    currentStep:{
      type:Number,
      required:true,
    },
    formIds:{
      type:Number,
      required:true,
    },
    isSync:{
      type:Boolean,
      required:true,
    },
  },
  data () {
    return {
      //分配结果
      syncOrAllotResultData: [],
      // 分配任务定时器
      distributeTimer:'',
      // 同步结果
      syncTableData:[],   
      // 同步任务定时器
      syncTimer:null,
      // 同步表单任务提交密钥
      syncFormTaskKey:'',



      // ---------------------------------表单分配相关数据--------------------------------------
      // 分配结果数据模拟
      allotResult:[
        {
          tenantName:"张三",
          status:{
            "3":"finished",
            "122":"failed",
            "99":"finished",
            "66":"finished",
            "99":"syncing",
          }
        }
      ],
      //头部总状态,全部完成:1,正在进行:0
      totalStatus:0,
      totalTaskNum:30,
      finishedTaskNum:11,

      //内嵌表格相关数据
      formDependData: [{
        id: 1,
        name: '测试表单1',
        desc: '123',
        status:1,
      },{
        id: 2,
        name: '测试表单2',
        desc: '124',
        status:2,
      },
        {
        id: 4,
        name: '测试表单2',
        desc: '1231',
        status:0,
        children: [{
            id: 41,
            name: '111表单1',
            desc: '1232',
            status:1,
          }, {
            id: 42,
            name: '222表单2',
            desc: '1233',
            status:-1,
        }, {
            id: 43,
            name: '333表单2',
            desc: '1234',
            status:0,
        }, {
            id: 44,
            name: '444表单2',
            desc: '1234',
            status:2,
        }]
      }],
      indents:100,
      allotFormTaskKey:'',
      allotTimer:null,
      isV2:false,

    }
  },
  computed: {},
  watch: {
    currentStep(val,oldVal){
      if(val === 2){
        this.submitDistributeForm();
      }
    }
  },
  created () {

  },
  mounted () {
  },
  methods: {
    // 提交表单分配或同步
    submitDistributeForm(){
      let _this = this;
      if(_this.isSync){   //保存表单同步配置
        _this.submitSyncTenants();
      }else{              //保存表单分配配置
        _this.submitAllotTenants();
      }
    },
    // 提交表单同步
    submitSyncTenants(){
      let _this = this;
      let params = {
        formId : _this.formIds,
        tenantIds : _this.chekcdTenantsData.join(",")
      }
      _this.$Get(_this.khConfig.api.syncFormConf,params).then(res=>{
        if(res.errCode === 0){
          _this.syncFormTaskKey = res.syncFormTaskKey;
          _this.setTimerSyncTask();
        }
      })
    },
    // 表单同步配置：定时器轮询任务
    setTimerSyncTask(){
      let _this = this;
      _this.syncTask();
      _this.syncTimer = setInterval(_this.syncTask,2000);
    },
    // 同步定时任务
    syncTask(){
      let _this = this;
      let url = _this.khConfig.api.syncFormConfStatus + '/' + _this.syncFormTaskKey;
          _this.$Post(url).then(res=>{
            if(res.errCode === 0){
              let obj = {};
              _this.syncOrAllotResultData = [];
              if(res.data.status === "finished"){
                for(let key in res.data.statusDesc){
                  let obj={
                    id:key,
                    uploadStatus:Number(res.data.statusDesc[key])
                  }
                  _this.syncOrAllotResultData.push(obj);
                }
                _this.matchTenantName();
                clearInterval(_this.syncTimer);
              }else if(res.data.status === "failed"){
                _this.setResultData(res.data.status);
                clearInterval(_this.syncTimer);
              }else{  
                _this.setResultData(res.data.status);
              }
            }
          })

    },
    
    // finished状态，将已有的tenantID:status的键值对处理
    // 将同步结果的租户id匹配租户名称，进行显示
    matchTenantName(){
      let _this = this;
      // 这里map方法改变了原数组
      _this.syncOrAllotResultData.map((item)=>{
        _this.allTenantsList.forEach((item2)=>{
          if(item2.id === Number(item.id)){
            item.tenantName = item2.tenantName;
          }
        })
      })
    },
    // 如果是syncing状态，不会返回tenantID:status的键值对
    // 需要自己拼接所有已选中租户并初始化租户状态为同步中
    setResultData(state){
      let _this = this;
      let syncingResultData = [];
      _this.chekcdTenantsData.forEach((item)=>{
        let obj = {};
        _this.allTenantsList.forEach((item2)=>{
          if(item2.id === item){
            obj={
              id:item2.id,
              tenantName:item2.tenantName,
              uploadStatus:state==='syncing'?3:1
            }
          }
        })
        syncingResultData.push(obj)
      })
      // debugger
      _this.syncOrAllotResultData = syncingResultData;
    },
    


    // -----------------------------表单分配相关函数方法---------------------------
    //提交表单分配
    submitAllotTenants(){
      let _this = this;
      let params = {
        formId : _this.formIds,
        tenantIds : _this.chekcdTenantsData.join(",")
      }
      _this.$Get(_this.khConfig.api.formAllotTenants,params).then(res=>{
        if(res.errCode === 0){
          _this.allotFormTaskKey = res.syncFormTaskKey;
          _this.setTimerAllotTask();
        }
      })

    },
    // 表单分配：定时器轮询任务
    setTimerAllotTask(){
      let _this = this;
      _this.allotTask();
      _this.allotTimer = setInterval(_this.allotTask,2000);
    },

    //分配定时任务
    allotTask(){
      let _this = this;
      let url = _this.khConfig.api.syncFormConfStatus + '/' + _this.allotFormTaskKey;
      _this.$Post(url).then(res=>{
        if(res.errCode === 0){
          let obj = {};
          _this.syncOrAllotResultData = [];
          if(res.data.status === "finished"){  //分配完成状态
            for(let key in res.data.statusDesc){
              let obj={
                id:key,
                uploadStatus:Number(res.data.statusDesc[key])
              }
              _this.syncOrAllotResultData.push(obj);
            }
            _this.matchTenantName();
            // 分配结果倒序，因为分配状态的接口返回数据是倒序的，所以需要手动改回原来的顺序
            _this.syncOrAllotResultData = _this.syncOrAllotResultData.reverse();
            clearInterval(_this.allotTimer);
          }else if(res.data.status === "failed"){ //分配失败,这里的failed是所有任务总状态
            _this.setResultData(res.data.status);
            clearInterval(_this.syncTimer);
          }else{   //syncing分配中：需要数据处理
            _this.setResultData(res.data.status);
          }
        }
      })
    },
  }

})
</script>
<style lang="scss" scoped>
.resultHeader{
  width: 60%;
  height: 40px;
  line-height: 40px;
  margin:10px auto 0 auto;
  padding: 0 15px;
  display: flex;
  background: rgb(151, 200, 240);
  font-weight: 600;
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

  //::v-deep .el-table__row--level-1{
  //   background: #f1f1f1 ;
  // }
  //::v-deep .el-table--striped .el-table__body tr.el-table__row--striped td{
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

