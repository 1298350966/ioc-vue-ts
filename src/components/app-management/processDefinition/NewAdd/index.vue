<template>
  <div>
    <el-dialog
      width="70vw"
      title="添加流程"
      :modal="false"
      custom-class="NewAdd2"
      :visible.sync="dialogFormVisible"
      append-to-body
      :close-on-click-modal="false"
    >
    <div style="overflow: auto;height: 100%;"> 
       <el-form label-width="auto">
        <el-form-item label="本环节名称:" required>
          <el-input style="width: 300px" v-model="newFlowobj.name"></el-input>
        </el-form-item>
        <el-form-item label="是否单独设置应用:" required>
          <el-radio-group v-model="newFlowobj.isApp">
            <el-radio label="yes">是</el-radio>
            <el-radio label="no">否</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="抄送人:" >
          <selectHandler  :recipient="newFlowobj.ccPeople" :formDataconfig="formDataconfig"></selectHandler>
        </el-form-item>
        <el-form-item v-show="newFlowobj.isApp == 'yes'" label="应用设置:" required>
          <el-link
            class="ML-20"
            type="primary"
            :underline="false"
            @click="
              addProcessVisible = true;
              addAppType = 'add';
              microAppObjData = null;
            "
            >添加</el-link
          >

          <AddApp
            v-if="addProcessVisible"
            :microApp.sync="newFlowobj.microApp"
            @onData="newFlowobj.microApp = $event"
            :microAppObjData="microAppObjData"
            :visible.sync="addProcessVisible"
            :type="addAppType"
            :appName="newFlowobj.name"
          ></AddApp>
        </el-form-item>
        <el-table
          row-class-name="tableRowClassName"
          v-show="newFlowobj.isApp == 'yes'"
          ref="multipleTable"
          :data="microAppList"
          tooltip-effect="dark"
          header-cell-class-name="header-table"
          style="width: 100%"
        >
          <el-table-column label="应用名称" align="center" show-overflow-tooltip>
            <template slot-scope="scope">
              <div v-show="!appNameShow">
                <span>{{ scope.row.appName }}</span>

                <!-- <i @click="appNameShow = true" class="el-icon-edit"></i> -->
              </div>
            </template>
          </el-table-column>
          <el-table-column
            prop="iconName"
            label="应用图标"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- <el-table-column
            prop="appId"
            label="新增完状态"
            align="center"
            show-overflow-tooltip
          >
            <template slot-scope="scope">
              <span>待验收/关闭</span>
            </template>
          </el-table-column> -->
          <el-table-column
            prop="explain"
            label="应用说明"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <el-table-column align="center" label="操作">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="microAppList.splice(scope.$index, 1)"
              >
                移除
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="
                  microAppObjData = scope.row;
                  addProcessVisible = true;
                "
              >
                查看
              </el-button>
            </template>
          </el-table-column>
          <!-- <el-table-column
          prop="explain"
          label="应用说明"
          align="center"
          show-overflow-tooltip
        >
          <template slot-scope="scope">
            <el-button size="mini" @click="handleEdit(scope.$index, scope.row)"
              >Edit</el-button
            >
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)"
              >Delete</el-button
            >
          </template>
        </el-table-column> -->
        </el-table>
        <div class="BM-18">
          <el-link
            icon="el-icon-plus"
            @click="addProcessingOperationVisible = true"
            type="primary"
            >添加处理操作</el-link
          >
        </div>

        <div class="stateOperation">
          <h3 style="font-weight: bold;
              line-height: 30px;
              margin-bottom: 10px;">操作按钮</h3>      
             <stateOperation :customBtn="newFlowobj.customBtn" :editBtn="newFlowobj.editBtn" :addBtn="newFlowobj.addBtn" :stateConfig="stateConfig" :formDataconfig="formDataconfig2"></stateOperation> 
        </div>
      </el-form>
      
    </div>
      <!-- {{ newFlowobj.content }} -->
     
     
     

       
      <!-- <el-table :data="form.process" style="width: 100%">
        <el-table-column prop="name" label="名称"> </el-table-column>
        <el-table-column label="对应状态">
          <template slot-scope="scope">
            {{ scope.row.state.label }}
          </template>
        </el-table-column>
        <el-table-column align="center" label="操作">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="businessFlowObj.operation.splice(scope.$index, 1)"
            >
              移除
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="updataProcessingOperation(scope.row, scope.$index)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table> -->
        
   
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
      <AddProcessingOperation
        v-if="addProcessingOperationVisible"
        :operation.sync="newFlowobj.operation"
        :visible.sync="addProcessingOperationVisible"
        :content="newFlowobj.content"
        @onContent="newFlowobj.content = $event"
        :processData="newFlowobj.process"
        @onProcessData="newFlowobj.process = $event"
      ></AddProcessingOperation>
    </el-dialog>
  </div>
</template>

<script>
// import formItem from "../../formItemSettings/formItem";
import selectPeople from "../../formItemSettings/selectPeople";
import selectRole from "../../formItemSettings/selectRole";
import AddProcessingOperation from "./AddProcessingOperation";
import AddApp from "@/components/app-management/BasicInfo/AddApp";
import selectHandler from '@/components/app-management/processDefinition/NewAdd/selectHandler'
import stateOperation from '@/components/app-management/processDefinition/NewAdd/stateOperation'
import addCustomActionButton from '@/components/app-management/processDefinition/AddProcess/customActionButton/addCustomActionButton'

import { mapState } from "vuex";
export default {
  //   name: "AddProcess",
  components: { AddApp, AddProcessingOperation, selectPeople, selectRole, selectHandler,stateOperation,addCustomActionButton },
  props: {
    newFlowobjData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    newFlow: {
      type: Array,
      default: function () {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      models: {},
      microAppObjData: null,
      selectRoleVisible: false,
      selectPeopleVisible: false,
      addAppType: "add",
      appNameShow: false,
      addProcessVisible: false,
      addProcessingOperationVisible: false,
      newFlowobj: this.newFlowobjData || {
        id: "",
        name: "",
        isApp: "yes",
        // recipient: {
        //   type: "0",
        //   role: [],
        //   person: [],
        //   model: "",
        //   leader: "1",
        // },
        content: [],
        microApp: {},
        process: [],
        ccPeople: {
          type: "0",
          role: [],
          person: [],
          model: "",
          leader: "1",
          orgAndRole: [],
          dyncUserAndRole: [],
          cuserOrgAndRole: [],
          dyncOrgAndRole: [],
          conditions: [],
          
        },   
        editBtn:{
            isShow:false,
            name:"",
            states:[],
            color:""
          },
          addBtn:{
            isShow:false,
            name:"",
            states:[],
            color:""
          }, 
          customBtn:[]
      },
      executiveDirectorOptions: [
        {
          value: "1",
          label: "直接主管",
        },
        {
          value: "2",
          label: "2级主管",
        },
        {
          value: "3",
          label: "3级主管",
        },
        {
          value: "4",
          label: "4级主管",
        },
        {
          value: "5",
          label: "5级主管",
        },
      ],
    };
  },
  computed: {
    ...mapState({
      stateConfig: (state) => state.appManagement.stateConfig,
      formDataconfig: (state) => state.appManagement.formDataconfig,
      formDataconfig2:(state) => state.appManagement.formDataconfig2,
    }),

    dialogFormVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
    },
    microAppList: {
      get() {
        if (this.newFlowobj.microApp && this.newFlowobj.microApp != "{}") {
          return [this.newFlowobj.microApp];
        }
        return [];
      },
      set(val) {
        this.microAppList = val;
      },
    },
    userSelect() {
      if (!this.formDataconfig) return [];
      return this.formDataconfig.filter((value, index, array) => {
        return value.type == "user_select";
      });
    },
  },
  mounted() {
    this.setNewFlowobj();
  },
  methods: {
    setNewFlowobj() {
      if (!this.newFlowobj.ccPeople) {
        this.$set(this.newFlowobj,"ccPeople",{
          type: "0",
          role: [],
          person: [],
          model: "",
          leader: "1",
          orgAndRole: [],
          dyncUserAndRole: [],
          cuserOrgAndRole: [],
          dyncOrgAndRole: [],
          conditions: [],
        })   
      }
      if (!this.newFlowobj.content) {
        this.newFlowobj.content = [];
        this.newFlowobj.process = [];
      }
      if (!this.newFlowobj.editBtn) {
        this.$set(this.newFlowobj,'editBtn',{
          isShow:false,
          name:"",
          states:[],
          color:""
        })
      }
      if (!this.newFlowobj.addBtn) {
        this.$set(this.newFlowobj,'addBtn',{
          isShow:false,
          name:"",
          states:[],
          color:""
        })
      }
      if(!this.newFlowobj.customBtn){
        this.$set(this.newFlowobj,'customBtn',[])
      }
    },
    error(message) {
      this.$notify.error({
        title: "提示",
        message: message,
      });
    },
    onSubmit() {
      if (!this.newFlowobj.name) return this.error("请输入本环节名称");
      if (!this.newFlowobj.microApp.appName) return this.error("请填写应用名称");
      console.log(this.newFlowobj);
      this.$emit("onNewFlowobj", this.newFlowobj);

      this.dialogFormVisible = false;
    },
    handleEdit() {
      this.addAppType = "updata";
      this.addProcessVisible = "add";
    },
    handleDelete() {},
    removeEle(arr, elem) {
      var includesIndex;
      arr.map((item, index) => {
        if (item == elem) {
          includesIndex = index;
        }
      });
      arr.splice(includesIndex, 1);
    },
  },
};
</script>

<style lang="scss" scope>
.NewAdd2 {
  height: 70vh;
  box-sizing: border-box;
  position: relative;
  .el-dialog__body {
    padding: 10px 20px;
    height: calc(100% - 116px);
    box-sizing: border-box;
    position: relative;
  }
  .BM-18 {
    margin:18px 0;
  }
  .selected_list {
    margin-bottom: 0px;
    line-height: 30px;
    span {
      margin-right: 10px;
      padding: 3px 6px 3px 9px;
      line-height: 12px;
      white-space: nowrap;
      border-radius: 2px;
      border: 1px solid rgba(220, 220, 220, 1);
    }
    img {
      margin-left: 5px;
      width: 7px;
      height: 7px;
      cursor: pointer;
    }
  }
  .tableRowClassName {
    background: #f4f7fa;
  }
}
</style>
