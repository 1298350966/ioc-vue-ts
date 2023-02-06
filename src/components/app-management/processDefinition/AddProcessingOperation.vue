<template>
  <el-dialog
    custom-class="AddProcessingOperation"
    width="70vw"
    :modal="false"
    title="添加操作"
    :visible.sync="dialogFormVisible"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form label-width="auto" ref="form">
      <h4>操作名称</h4>
      <el-form-item label="名称:">
        <el-input style="width: 300px" v-model="form.name"></el-input>
      </el-form-item>
      <!-- {{ form.state }} -->
      <el-form-item label="状态：">
        <el-select value-key="label" v-model="form.state" placeholder="请选择状态转换">
          <el-option
            v-for="(item, index) in stateOptions"
            :key="index"
            :label="item.label"
            :value="item"
          ></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="抄送人:">
          <selectHandler  :recipient="form.ccPeople" :formDataconfig="formDataconfig"></selectHandler>
      </el-form-item>
      <div class="cell">
          <h4>操作时查看信息</h4>
          <el-link type="primary" @click="addReadInformationVisible = true"
            >添加查看信息</el-link
          >
          <div   class="form-item-box Information"  v-if="form.readInfo.parent.content.length > 0 || form.readInfo.child.length > 0">
             <div style="position: relative;">
               <div class="text-box">
                <div class="readtext" v-show="form.readInfo.parent.content.length > 0" >
                  <span>主表单:</span>
                  <span> {{readInfoParentStr}} </span>
                </div>
                <div class="readtext" v-for="(child, index) in form.readInfo.child" :key="index"> 
                  <span>{{child.name}}:</span>
                  <span> {{readInfoChildStr(child.content)}} </span>
                </div>  
            </div>
            <i
              @click="form.readInfo = { parent:{content:[],},child:[]}"
              class="el-icon-delete delete"
            ></i>
            </div>
          </div>
           <AddReadInformation
            v-if="addReadInformationVisible"
            :visible.sync="addReadInformationVisible"
            :readInfo.sync="form.readInfo"
          ></AddReadInformation>
      </div>
      <div class="cell">
      <h4>操作时填写信息</h4>
      <el-link type="primary" @click="addFillInformationVisible = true"
        >添加填写信息</el-link
      >
      <AddFillInformation
        v-if="addFillInformationVisible"
        :visible.sync="addFillInformationVisible"
        :writeInfo="form.writeInfo"
        @onWriteInfo="
          form.writeInfo = $event;
          form.process = [];
        "
      ></AddFillInformation>
      <el-form-item
        class="form-item-box Information"
        :label="item.name"
        v-for="(item, index) in form.writeInfo"
        :key="'A' + index"
      >
        <div class="text-box">
          <span class="text"
            >{{ readText(item.parent.content) }} {{ editText(item.parent.content) }}
            {{ hiddenText(item.parent.content) }}
          </span>

          <span v-for="(childitem, index) in item.child" :key="'a' + index">
            {{ editText(childitem.content) }}
          </span>
        </div>

        <i
          @click="
            form.writeInfo.splice(index, 1);
            form.process = [];
          "
          class="el-icon-delete delete"
        ></i>
      </el-form-item>
      </div>
      <div class="cell">
         <h4>操作流程</h4>
      <el-link type="primary" @click="addData()">添加</el-link>
      <AddConditionGroup
        v-if="addConditionGroupVisible"
        :visible.sync="addConditionGroupVisible"
        :writeInfo="form.writeInfo"
        :data="conditionData"
        @onProcessObj="onProcessObj"
      ></AddConditionGroup>

      <div
        class="operation-process-box"
        v-for="(processItem, index) in form.process"
        :key="index"
      >
        <el-link class="link" type="primary" @click="upDataProcessObj(processItem, index)"
          >【添加条件】</el-link
        >
        <div class="operationItem">
          <el-form-item label="状态转换：">
            <!-- :value="processItem.stateConver" -->
            <!-- @input="$set(processItem, 'stateConver', $event)" -->
            <el-select
              v-model="processItem.stateConver"
              value-key="label"
              placeholder="请选择状态转换"
            >
              <el-option
                v-for="(item, index) in stateConfig"
                :key="index"
                value-key="label"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="operationItem">
          <el-form-item label="填写信息：">
            <el-select
              v-model="processItem.writeInfo"
              disabled
              placeholder="请选择活动区域"
            >
              <el-option
                :label="item.name"
                :value="item.name"
                v-for="(item, index) in form.writeInfo"
                :key="'C' + index"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <i @click="form.process.splice(index, 1)" class="el-icon-delete delete"></i>
      </div>
      <div class="operation-process-box">
        <el-link class="link" type="danger" :underline="false">【默认状态流转】</el-link>
        <div class="operationItem">
          <el-form-item label="状态转换：">
            <!-- :value="processItem.stateConver" -->
            <!-- @input="$set(processItem, 'stateConver', $event)" -->
            <el-select
              v-model="defaultProcess.stateConver"
              value-key="label"
              placeholder="请选择状态转换"
            >
              <el-option
                v-for="(item, index) in stateConfig"
                :key="index"
                value-key="label"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <div class="operationItem"></div>
        <i class="delete"></i>
      </div>
      </div>
      
      <p style="color: red">提交需要验证新增的操作流程条件相同,无法提交</p>
    </el-form>
    <!-- <el-link icon="el-icon-plus" type="primary">添加处理操作</el-link> -->
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
import AddReadInformation from '@/components/app-management/processDefinition/AddProcessingOperation/AddReadInformation'
import AddFillInformation from '@/components/app-management/processDefinition/AddProcessingOperation/AddFillInformation'
import AddConditionGroup from "./AddConditionGroup";
import selectHandler from '@/components/app-management/processDefinition/NewAdd/selectHandler'
export default {
  components: {
    AddFillInformation,
    AddConditionGroup,
    selectHandler,
    AddReadInformation
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    operation: {
      type: Array,
      default: function () {
        return [];
      },
    },
    stateOptions: {
      type: Array,
      default: function () {
        return [];
      },
    },
    operationObjData: {
      type: String | Object,
      default: function () {
        return {};
      },
    },
  },

  data() {
    return {
      type: "add",
      index: 0,
      conditionData: {},
      form: {
        name: "",
        state: "",
        readInfo:{
          parent:{
            content:[],
          },
          child:[],
        },
        writeInfo: [],
        process: [],
        ccPeople:{
        }
      },
      addFillInformationVisible: false,
      addReadInformationVisible: false,
      addConditionGroupVisible: false,
      defaultProcess: {
        writeInfo: "",
        condition: "",
        stateConver: {},
      },
    };
  },
  computed: {
    dialogFormVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
    },
    // process: {
    //   get() {
    //     if (this.form.process.length == 0) {
    //       return this.form.process
    //     } else {
    //       return this.form.process.slice(0, -1);
    //     }
    //   },
    //   set(val) {
    //     this.form.process = val;
    //   },
    // },
    readInfoParentStr(){
        return  this.form.readInfo.parent.content.map((value) => {
            return value.name
          }).join("、") || ""
    }, 
    readInfoChildStr(){
        return  function(content){
            return content.map((value) => {
              return value.name
            }).join("、") || ""
        }
    },
     
    readText() {
      return function (content) {
        let contentNames = [];
        content.forEach((value) => {
          if (value.type === "read") contentNames.push(value.name);
        });
        if (contentNames.join("、")) {
          return "只读：" + contentNames.join("、") + "；";
        } else {
          return "";
        }
      };
    },
    editText() {
      return function (content) {
        let contentNames = [];
        content.forEach((value) => {
          if (value.type === "edit") contentNames.push(value.name);
        });

        if (contentNames.join("、")) {
          return "可编辑：" + contentNames.join("、") + "；";
        } else {
          return "";
        }
      };
    },
    hiddenText() {
      return function (content) {
        let contentNames = [];
        content.forEach((value) => {
          if (value.type === "hidden") contentNames.push(value.name);
        });
        if (contentNames.join("、")) {
          return "隐藏：" + contentNames.join("、") + "；";
        } else {
          return "";
        }
      };
    },

    ...mapState({
      stateConfig: (state) => state.appManagement.stateConfig,
      formDataconfig: (state) => state.appManagement.formDataconfig,
    }),
  },
  mounted() {
    console.log(this.operationObjData);
    if (this.operationObjData && this.operationObjData.process.length >= 1) {
      this.form.name = this.operationObjData.name || "";
      this.form.state = this.operationObjData.state || "";
      this.form.ccPeople = this.operationObjData.ccPeople || {}
      this.form.writeInfo = this.operationObjData.writeInfo || [];
      this.form.readInfo = this.operationObjData.readInfo || {parent:{content:[]}, child:[]}
      this.form.process = this.operationObjData.process.slice(0, -1) || [];
      this.defaultProcess = this.operationObjData.process[
        this.operationObjData.process.length - 1
      ];
    } else {
      this.form = this.operationObjData || this.form;
    }

    if (this.stateOptions.length == 1) {
      this.form.state = this.stateOptions[0];
    }
  },
  methods: {
    onSubmit() {
      if (!this.form.name) return this.error("请输入操作名称");
      // if (this.form.writeInfo.length == 0) return this.error("请添加填写信息");
      if (!this.form.state) return this.error("请选择状态转换");
      this.form.process.push(this.defaultProcess);
      if (this.form.process.length == 0) return this.error("请添加操作流程");

      this.form.writeInfo.forEach((writeInfo) => {
        writeInfo.parent.content.forEach((content) => {
          this.$delete(content, "config");
        });
        writeInfo.child.forEach((child) => {
          child.content.forEach((content) => {
            this.$delete(content, "config");
          });
        });
      });
      this.$emit("onOperationObj", this.form);
      // this.operation.push(this.form);
      // this.$emit("updata:operation", this.operation);
      this.dialogFormVisible = false;
    },
    error(message) {
      this.$notify.error({
        title: "提示",
        message: message,
      });
    },
    addData() {
      this.type = "add";
      this.conditionData = {};
      this.addConditionGroupVisible = true;
    },
    upDataProcessObj(data, index) {
      this.type = "updata";
      this.index = index;
      this.conditionData = data;
      this.addConditionGroupVisible = true;
    },
    onProcessObj(e) {
      console.log(e, this.type);
      if (this.type == "updata") {
        // [] = ;
        this.$set(this.form.process, this.index, e);
      } else {
        this.form.process.push(e);
      }
      this.conditionData = {};
    },
  },
};
</script>

<style lang="scss" scoped>
.AddProcessingOperation {
  height: 70vh;
  box-sizing: border-box;
  position: relative;
  .el-dialog__body {
    padding: 10px 20px;
    height: calc(100% - 116px);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
  }
  .operation-process-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: #f2f2f2;
    border-radius: 5px;
    padding: 10px;
    margin-top: 5px;
    .operationItem {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    .delete {
      margin-left: 10px;
      justify-content: flex-end;
    }

    .link {
      flex: 0.43;
      justify-content: flex-start;

      // margin-bottom: 18px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .Information {
    padding-right: 60px;
    box-sizing: border-box;
    position: relative;
    .text-box {
      overflow: auto;
      margin-right: 30px;
    }
    .delete {
      position: absolute;
      right: 3px;
      top: 50%;
      transform: translate(0,-50%);
    }
    .readtext{
      line-height: 24px;
      span:first-child{
          font-weight: bold;
      }
    }
  }
  .form-item-box {
    margin: 7px 0;
    width: 100%;
    background: #f2f2f2;
    padding: 10px 8px;
    padding-right: 30px;
    border-radius: 5px;
    // .text {
    //   width: 500px;
    // }
    .el-form-item__content {
      white-space: nowrap;
      overflow: hidden;

      text-overflow: ellipsis;
    }
  }
  .cell{
     margin: 10px 0;
  }
}
</style>
