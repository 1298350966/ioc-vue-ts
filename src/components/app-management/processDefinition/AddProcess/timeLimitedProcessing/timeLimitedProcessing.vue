<template>
  <div class="timeLimitedProcessing">
    <el-form>
      <el-row>
        <el-col :span="12">
          <div>
            <el-switch v-model="flag" active-text="限时处理"> </el-switch>
          </div>
        </el-col>
        <el-col :span="12"
          ><div>
            <!-- <el-form-item label="选择不计时规则"> -->
            <!-- <el-select v-model="value2" placeholder="请选择">
                <el-option
                  v-for="(item, index) in selectUntimedRuleOption"
                  :key="index"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select> -->
            <!-- </el-form-item> -->
          </div>
        </el-col>
      </el-row>

      <p>
        支持自动提醒、转交、处理等，为每一项业务的处理设置一个智能闹钟。自动处理时间
        > 自动转交时间 > 自动发送消息时间
      </p>
      <div v-show="flag">
        <div
        class="handleInfoBox"
        v-for="(item, index) in timeProcess.settings"
        :key="index"
      >
        <div v-if="item.type == '1'">
          <p>
            流程到达该节点超过 {{ item.time
            }} {{ timeUnitStr(item.unit) }}，处理人仍然未处理，自动提醒 
          </p>
          <p>
            被提醒人：
            <span v-if="item.remind.type != '9'">{{ remindStr(item.remind) }}</span>
            <p v-if="item.remind.type  == '9'">
               <el-table
              row-class-name="tableRowClassName"
                :data="item.remind.conditions"
                style="width: 100%"
              >
                <el-table-column prop="type" label="接收人类型" align="center">
                  <template slot-scope="scope">
                    <span>{{ receiverType[scope.row.type] }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="role" label="接收人" align="center">
                  <template slot-scope="scope">
                    {{ remindStr(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column label="条件" align="center">
                  <template slot-scope="scope">
                    <div
                      class="conditions-box"
                      v-for="(item, index) in scope.row.conditions"
                      :key="index"
                    >
                      <span class="conditionsItem"> {{ item.name }} </span>
                      <span class="conditionsItem"
                        >{{
                          item.opt == "$gt"
                            ? " 大于 "
                            : item.opt == "$gte"
                            ? " 大于等于 "
                            : item.opt == "$numEq"
                            ? " 等于 "
                            : item.opt == "$lte"
                            ? " 小于等于 "
                            : item.opt == "$lt"
                            ? " 小于 "
                            : item.opt == "$eq"
                            ? " 等于 "
                            : item.opt == "$like"
                            ? " like "
                            : " "
                        }}
                      </span>
                      <span class="conditionsItem"> {{ formValue(item) }} </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </p>
          </p>
          <p>提醒方式：{{ remindTypeStr(item.remindType) }}</p>
          <div class="operation-icon">
            <i class="el-icon-edit" @click="settingEdit(item)"></i>
            <i
              class="el-icon-delete"
              @click="$delete(timeProcess.settings, index)"
            ></i>
          </div>
          <div class="iocn-type1">
              <i class="el-icon-message-solid"></i>
              <span>自动提醒</span>
          </div>
        </div>
        <div v-if="item.type == '2'">
          <p>
            流程到达该节点超过 {{ item.time }}{{ timeUnitStr(item.unit) }}，处理人仍然未处理，自动转交
          </p>
          <p>
            被转交人：
            <span>{{transferStr(item.transfer)}}</span>
            <p v-if="item.transfer.type  == '9'">
               <el-table
              row-class-name="tableRowClassName"
                :data="item.transfer.conditions"
                style="width: 100%"
              >
                <el-table-column prop="type" label="接收人类型" align="center">
                  <template slot-scope="scope">
                    <span>{{ receiverType[scope.row.type] }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="role" label="接收人" align="center">
                  <template slot-scope="scope">
                    {{ transferStr(scope.row) }}
                  </template>
                </el-table-column>
                <el-table-column label="条件" align="center">
                  <template slot-scope="scope">
                    <div
                      class="conditions-box"
                      v-for="(item, index) in scope.row.conditions"
                      :key="index"
                    >
                      <span class="conditionsItem"> {{ item.name }} </span>
                      <span class="conditionsItem"
                        >{{
                          item.opt == "$gt"
                            ? " 大于 "
                            : item.opt == "$gte"
                            ? " 大于等于 "
                            : item.opt == "$numEq"
                            ? " 等于 "
                            : item.opt == "$lte"
                            ? " 小于等于 "
                            : item.opt == "$lt"
                            ? " 小于 "
                            : item.opt == "$eq"
                            ? " 等于 "
                            : item.opt == "$like"
                            ? " like "
                            : " "
                        }}
                      </span>
                      <span class="conditionsItem"> {{ formValue(item) }} </span>
                    </div>
                  </template>
                </el-table-column>
              </el-table>
            </p>
          </p>
          <p>提醒方式：{{ remindTypeStr(item.remindType) }}</p>
          <div class="operation-icon">
            <i class="el-icon-edit" @click="settingEdit(item)"></i>
            <i
              class="el-icon-delete"
              @click="$delete(timeProcess.settings, index)"
            ></i>
          </div>
          <div class="iocn-type2">
              <i class="iocn-zidongtijiao"></i>
              <span>自动转交</span>
          </div>
        </div>
      </div>

      <div
        class="add-button"
        @click="
          dialogVisible = true;
          operationType = 'add';
          setting = {}
        "
      >
        <i class="el-icon-plus"></i>
        <span class="text">处理方式</span>
      </div>
      </div>
      
    </el-form>
    <el-dialog
      custom-class="treatmentMethodDialog"
      title="提示"
      :visible.sync="dialogVisible"
      :close-on-click-modal="false"
      width="800px"
      append-to-body
      v-if="dialogVisible"
    >
      <treatmentMethod  v-if="setting"  :setting.sync="setting"></treatmentMethod>
      <template #footer>
        <el-button type="primary" @click="saveSettings">确 定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import date from "@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/selectRemindedPerson/date.js";
import treatmentMethod from "@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/treatmentMethod";

export default {
  components: { treatmentMethod },
  props: ["timeProcess"],
  data() {
    return {
      value2: "",
      selectUntimedRuleOption: [
        { label: "危险作业显示处理不计时", value: "" },
        { label: "普通限时处理不计时", value: "" },
      ],
      timeUnitOptions: [
        { label: "分钟", value: "minute" },
        { label: "小时", value: "hour" },
        { label: "天", value: "day" },
      ],
      remindTypeOptions: [
        { label: "应用内消息提醒", value: "1" },
        { label: "短信提醒", value: "2" },
        { label: "电话提醒", value: "3" },
      ],
      receiverType: [
        "角色",
        "指定人",
        "主管",
        "发起人自己",
        "表单内用户控件值",
        "组织+角色",
        "表单内用户控件值所属部门+角色",
        "发起人所属部门+角色",
        "表单内部门控件值+角色",
        "",
        "处理人主管",
        "处理人所属部门+角色",
      ],
      dialogVisible: false,
      operationType: "add",
      setting: {},
    };
  },
  computed: {
    ...mapState({
      formDataconfig: (state) => state.appManagement.formDataconfig,
    }),
    modelName() {
      return function (model) {
        if (!model) return "";
        let formDataItem = this.formDataconfig.find((value) => {
          return value.model == model;
        });
        if (formDataItem) {
          return formDataItem.name;
        } else {
          return "";
        }
      };
    },
    flag: {
      get() {
        if (this.timeProcess.flag) {
          if (this.timeProcess.flag === "0") {
            return true;
          } else {
            return false;
          }
        } else {
          return false;
        }
      },
      set(val) {
        if (val) {
          this.timeProcess.flag = "0";
        } else {
          this.timeProcess.flag = "1";
        }
      },
    },
  },
  mounted() {
    this.initTimeProcess();
  },
  methods: {
    remindStr: date.receiver,
    transferStr: date.receiver,
    formValue(item) {
      let {value,key} = item
      if (Array.isArray(value)) {
        return value.join("、");
      } else if (value instanceof Object) {
        return value[key];
      } else {
        return value;
      }
    },
    timeUnitStr(unit) {
      let timeUnit = this.timeUnitOptions.find((value) => {
        return value.value === unit;
      });
      if (timeUnit) {
        return timeUnit.label;
      } else {
        return "";
      }
    },

    remindTypeStr(remindType) {
      return remindType
        .map((value, index, array) => {
          let remindType = this.remindTypeOptions.find((value2) => {
            return value2.value === value;
          });
          if (remindType) {
            return remindType.label;
          } else {
            return "";
          }
        })
        .join("、");
    },
    settingEdit(item) {
      this.setting = JSON.parse(JSON.stringify(item)) || {};
      console.log(this.setting,JSON.parse(JSON.stringify(item)) )
      this.operationType = "update";
      this.dialogVisible = true;
    },
    message(message) {
      this.$notify.error({
        title: "提示",
        message: message,
      });
    },
    saveSettings() {
      console.log(this.setting)
      let TSetting= this.timeProcess.settings.filter(value => value.type == '1')
      let ZSetting = this.timeProcess.settings.filter(value => value.type == '2')
      if (this.setting.type === "1") {
        if (!this.setting.time) return this.message("请输入时间");
        if (!this.setting.unit) return this.message("请选择时间单位");
        if (this.setting.remindType.length == 0) return this.message("请选择提醒方式");
        if (!this.setting.title) return this.message("请输入标题");
        if (!this.setting.content) return this.message("请输入内容");
        let isLess = true
        let isRepeat = false
        if(Array.isArray(this.timeProcess.settings) && this.timeProcess.settings.length >  0){
           TSetting.forEach((value ) => {
              let valueMinute =  this.getMinute(value)
              let settingMinute =  this.getMinute(this.setting)
              if(valueMinute == settingMinute  && this.setting.idx != value.idx){
                 isRepeat = true
              }   
          })
          if(ZSetting.length > 0){
            let valueMinute =  this.getMinute(ZSetting[0])
            let settingMinute =  this.getMinute(this.setting)
            isLess = settingMinute < valueMinute
          }
        }
        if(isRepeat) return this.message("您设置的自动提醒时间已设置,请设置其他时间");
        if(!isLess) return this.message("自动提醒时间应小于自动转交时间");
      } else if (this.setting.type === "2") {
        if (!this.setting.time) return this.message("请输入时间");
        if (!this.setting.unit) return this.message("请选择时间单位");
        if (this.setting.remindType.length == 0) return this.message("请选择提醒方式");
        if (!this.setting.title) return this.message("请输入标题");
        if (!this.setting.content) return this.message("请输入内容");
        let isGreater = true
        let isRepeat = false
        if(Array.isArray(this.timeProcess.settings) && this.timeProcess.settings.length >  0){
          this.timeProcess.settings.forEach((value ) => {
            if(value.type === "1"){
              let valueMinute =  this.getMinute(value)
              let settingMinute =  this.getMinute(this.setting)
              isGreater = settingMinute > valueMinute
            }
          }) 
        }
        if (this.operationType === "update"){
          if(!isGreater && ZSetting.length == 1) return this.message("自动转交时间应大于自动提醒时间");
        }else{
          if(!isGreater && ZSetting.length == 0) return this.message("自动转交时间应大于自动提醒时间");
        }
        
      }
      if (this.operationType === "add") {
        if(this.setting.type == '1'){
          TSetting.push(this.setting);
        }else if(this.setting.type == '2'){
          ZSetting.push(this.setting);
        }
        
      } else if (this.operationType === "update") {
        // if(this.setting.type == '1'){
        //   let index = this.timeProcess.settings.findIndex(value => value.idx == this.setting.idx )
        //   this.timeProcess.settings.splice(index, 1, this.setting);
        // }else if(this.setting.type == '2'){
        //   let index = this.timeProcess.settings.findIndex(value => value.idx == this.setting.idx )
        //   this.timeProcess.settings.splice(index, 1, this.setting);
        // }
        let index = this.timeProcess.settings.findIndex(value => value.idx == this.setting.idx )
        this.timeProcess.settings.splice(index, 1, this.setting);
        TSetting= this.timeProcess.settings.filter(value => value.type == '1')
        ZSetting = this.timeProcess.settings.filter(value => value.type == '2')
      }
      
      TSetting.sort(function(a,b){ 
        if(a && b){
          let aMinute =  a.unit == "minute" ? a.time : a.unit == 'hour' ?  a.time * 60 : a.unit == 'day' ? a.time * 60 * 24: ""
          let bMinute =  b.unit == "minute" ? b.time : b.unit == 'hour' ?  b.time * 60 : b.unit == 'day' ? b.time * 60 * 24: ""
         return Number(aMinute)  -  Number(bMinute)
        }
      })
      this.timeProcess.settings = [...TSetting,...ZSetting]
      this.timeProcess.settings.forEach((setting, index) => {
        setting.idx = index;
      });
      this.dialogVisible = false;
      this.setting = {}
    },
    //時間转成分钟
    getMinute(obj){
      let minute = obj.unit == "minute" ? obj.time : obj.unit == 'hour' ?  obj.time * 60 : obj.unit == 'day' ? obj.time * 60 * 24: 0
      return Number(minute)
    },
    initTimeProcess() {
      if (!this.timeProcess.flag) {
        this.$set(this.timeProcess, "flag", "0");
      }
      if (!this.timeProcess.settings) {
        this.$set(this.timeProcess, "settings", []);
      }
    },
  },
};
</script>

<style lang="scss" scope>
.timeLimitedProcessing {
  .handleInfoBox {
    position: relative;
    background: #ebf4fc;
    padding: 10px 15px;
    margin-bottom: 10px;
    .operation-icon {
      position: absolute;
      bottom: 15px;
      right: 15px;

      i {
        font-size: 20px;
        margin-left: 10px;
      }
    }
    .iocn-type1 {
      display: flex;
      align-items: center;
      position: absolute;
      padding: 7px 10px;
      // box-shadow:1px 1px 5px #b5b5b5;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      top: 5px;
      right: 0px;
      color: #ff913f;
      background: #ffffff;
      i {
        font-size: 28px;
        margin-right: 3px;
      }
    }
    .iocn-type2 {
      background: #ffffff;
      padding: 7px 10px;
      // box-shadow:1px 1px 5px #b5b5b5;
      display: flex;
      align-items: center;
      position: absolute;
      border-top-left-radius: 5px;
      border-bottom-left-radius: 5px;
      top: 5px;
      right: 0px;
      color: #53b3e5;
      background: #ffffff;
      i {
        font-size: 28px;
        margin-right: 3px;
      }
    }
  }
  .tableRowClassName {
    background: #f4f7fa;
  }
  .add-button {
    border: 1px #b5b5b5 dashed;
    margin-top: 20px;
    height: 80px;
    display: flex;
    justify-content: center;
    align-items: center;

    .el-icon-plus {
      width: 40px;
      height: 40px;
      border: 3px solid #bfbfbf;
      border-radius: 5px;
      font-weight: bold;
      color: #bfbfbf;
      margin-right: 10px;
      font-size: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-sizing: border-box;
    }
    .text {
      color: #bfbfbf;
      font-weight: bold;
    }
  }
}
.treatmentMethodDialog {
  .el-dialog__body {
    padding: 10px 20px;
    height: calc(100% - 116px);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
  }
}
.iocn-zidongtijiao {
  background: url("../../../../../assets/images/app-management/u10887.svg")
    center center no-repeat;
  width: 30px;
  height: 30px;
  background-size: contain;
}
.conditions-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .conditionsItem {
      flex: 1;
    }
  }
</style>