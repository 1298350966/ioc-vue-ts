<template>
  <div class="stateBottoms">
    <div class="stateBottom">
        <h4 style="margin-bottom:10px;">固定按钮</h4>
        <el-table
          row-class-name="tableRowClassName"
          :data="[addBtn,editBtn]"
          style="width: 100%; text-align: left;">
          <el-table-column label="操作类型" width="100" align="center">
            <template slot-scope="scope"  >
              {{scope.$index === 0 ? "重新发起" : "编辑操作" }}
            </template>
          </el-table-column>
          <el-table-column prop="label" width="200"  label="名称" align="center"> 
            <template slot-scope="scope">
              <el-input style="width: 100%" v-model="scope.row.name"></el-input>
            </template>
          </el-table-column>
            <el-table-column prop="isShow"  width="200"  label="启用" align="center"> 
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row.isShow"></el-checkbox>
            </template>
          </el-table-column>
          <el-table-column prop="color"  width="200"  label="按钮颜色" align="center"> 
            <template slot-scope="scope">
              <el-color-picker v-model="scope.row.color"></el-color-picker>
            </template>
          </el-table-column>

          <el-table-column prop="states"  label="状态" align="center"> 
            <template slot-scope="scope">
              <el-checkbox-group v-model="scope.row.states">
                  <el-checkbox
                    v-for="(item, index) in stateConfig"
                    :key="index"
                    :label="item.label"
                    >{{ item.label }}</el-checkbox
                  >
              </el-checkbox-group>
            </template>
          </el-table-column>

    

      
        </el-table>
    </div>
  
    <div class="stateBottom">
      <h4 style="margin-bottom:10px;">自定义按钮</h4>
      <customActionButton :stateConfig="stateConfig" :formDataconfig="formDataconfig" :customBtn="customBtn"></customActionButton>
    </div>
  </div>
</template>

<script>
import customActionButton from '@/components/app-management/processDefinition/NewAdd/stateOperation/customActionButton'

export default {
  props: ["stateConfig","editBtn","addBtn","formDataconfig","customBtn"],
  components:{
    // addCustomActionButton,
    customActionButton
  },
  data() {
    return {
      states: [],
      value: "",
      checked: false,
      dialogVisible: false,
      type: "add",
      customBtnConfig:{},
      // customBtn:[],
    };
  },
  methods:{
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
                    dialogWidth:"50",
                    dialogFullscreen:"0"
                    //         "dialogFullscreen":"0",
                    //         "requestMethod":"post"
                },
                cond:[],
                color:""
            }
    },
    // save(){

    //   this.customBtn.push(this.customBtnConfig)
    // }
  }
};
</script>

<style scoped lang="scss">
.stateBottoms{
  .stateBottom{
  padding-top: 18px;
  padding-bottom: 18px;
  padding-left: 10px;
  padding-right: 10px;
  border-radius: 5px;
  background: rgba(157, 219, 255, 0.185);
  margin-bottom: 15px;
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
}

</style>
