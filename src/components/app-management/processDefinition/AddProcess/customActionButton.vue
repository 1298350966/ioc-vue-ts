<template>
  <div class="customActionButton">
    <el-link
      icon="el-icon-plus"
      @click="
        addActionButton
      "
      type="primary"
      >添加操作按钮</el-link
    >
    <el-table
      row-class-name="tableRowClassName"
      :data="customBtn"
      style="width: 100%; text-align: left;"
    >
      <el-table-column prop="label" label="名称" align="center"> </el-table-column>
      <el-table-column label="字段|值" align="center">
        <template slot-scope="scope">
          <div class="cond" v-for="(item, index) in scope.row.cond" :key="index">
            <!-- <el-row style="width:100%">
              <el-col :span="8">
             
              </el-col>
              <el-col :span="16">
                
              </el-col>
            </el-row> -->
            <span style="text-align: right;" class="condItem">{{ item.model}}</span> 
            <span style="padding:0 2px"> | </span>
            <span style="text-align: left;"  class="condItem">{{item.values.join("、")}}</span> 
          </div>
         
        </template>
      </el-table-column>
      <el-table-column label="处理状态" align="center">
        <template slot-scope="scope">
        <span style="margin:0 5px" v-for="(item, index) in scope.row.pageType" :key="index">
            {{item == "0" ? "未处理" : "已处理" }}
        </span>
        </template>
      </el-table-column>
      <el-table-column label="按钮颜色" align="center">
        <template slot-scope="scope">
            <el-color-picker v-model="scope.row.color"></el-color-picker>
        </template>
      </el-table-column>
      <!-- <el-table-column label="是否结束"> </el-table-column>> -->
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
          <el-button
            type="text"
            size="small"
            @click="customBtn.splice(scope.$index, 1)"
          >
            移除
          </el-button>

          <el-button
            type="text"
            size="small"
            @click="upadteActionButton(scope.row, scope.$index)"
          >
            编辑
          </el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog
        custom-class="centerDialogClass"
        top="20vh"
        width="750px"
        :modal="true"
        title="自定义操作按钮"
        :visible.sync="dialogVisible"
        append-to-body
        destroy-on-close
        :close-on-click-modal="false"
    >              
        <addCustomActionButton :stateConfig="stateConfig" :customBtnConfig="customBtnConfig" :formDataconfig="formDataconfig"></addCustomActionButton>
        <template #footer>
            <div class="dialog-footer">
                <el-button type="primary" @click="save">
                    保存
                </el-button>
            </div>
        </template>
    </el-dialog>
  </div>
</template>

<script>
import addCustomActionButton from '@/components/app-management/processDefinition/AddProcess/customActionButton/addCustomActionButton'

export default {
    props:["stateConfig","customBtn","formDataconfig"],
    components:{addCustomActionButton},
    data() {
        return {
            datatable:[],
            dialogVisible:false,
            customBtnConfig:null,
            type:"add",
            upadteActionButtonIndex:"",
            addBtn:{
                name:"",
                isShow:"",
                states:[]
            }
        };
    },

    methods:{
        upadteActionButton(data,index){
            this.customBtnConfig = this.KHUtils.clone(data);  
            this.upadteActionButtonIndex = index
            this.type = "update"
            this.dialogVisible = true
        },
        addActionButton(){
            this.dialogVisible = true
            this.type = "add"

            this.customBtnConfig = {
                key:"",
                label:"",
                imageId:"",
                jumpInfo:{
                    formId:"",
                    type:"0",
                    urlType:"0",
                    url:"",
                    respParamSet:[
                        {errCode:"errCode",
                        errMsg:"errMsg"}
                    ],
                    jumpType:"0",
                    dialogTop:"80",
                    dialogWidth:"50",
                    dialogHeight:"80",
                    dialogFullscreen:"0"
                    //         "dialogFullscreen":"0",
                    //         "requestMethod":"post"
                },
                pageType:[],
                cond:[],
                color:""
            }
        },
        save(){

            if(this.type == 'add'){
                this.customBtn.push(this.customBtnConfig)
            }else if(this.type == 'update'){
                this.$set(this.customBtn,this.upadteActionButtonIndex,this.customBtnConfig)
            }
            this.dialogVisible = false
        }
    }
};
</script>

<style lang="scss" scope>
.customActionButton{
  .cond{
    display: flex;
    .condItem{
      flex: 1;
    }
  }
  .centerDialogClass{
    .el-dialog__header {
      background: #0078ee;
      .el-dialog__title {
        color: #ffffff;
        font-size: 15px;
        
      }
      .el-dialog__headerbtn {
        color: #ffffff !important;
        font-size: 20px !important;
      }
      
    }
    .el-dialog__body{
        overflow: auto;
        max-height: 50vh;

    }  
  }
}



</style>
