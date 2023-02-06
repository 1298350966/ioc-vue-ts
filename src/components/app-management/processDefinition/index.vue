<template>
  <div class="process-definition">
    <el-row>
      <el-col :span="24" class="color-A">
        <span>流程定义</span>
        <span>|</span>
        <span>支持添加、编辑、删除流程</span>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="new-add-button">
        <el-link
          icon="el-icon-plus"
          @click="
            newAddVisible = true;
            newFlowobjData = null;
            type = 'add';
          "
          type="primary"
          >新增</el-link
        >
        <el-table :data="newFlow" row-class-name="tableRowClassName" style="width: 100%">
          <el-table-column label="流程名称" align="center">
            <template slot-scope="scope">
              <span>{{ scope.row.name }}</span>
              <span>（单独应用）</span>
            </template>
          </el-table-column>
          <el-table-column label="应用名称" align="center">
            <template slot-scope="scope">
              {{ scope.row.microApp ? scope.row.microApp.appName : "" }}
            </template>
          </el-table-column>
          <!-- <el-table-column label="对应状态" align="center">
            <template slot-scope="scope">
  
            </template>
          </el-table-column> -->
          <el-table-column label="是否单独设置应用" align="center">
            <template slot-scope="scope">
              {{ scope.row.isApp == "yes" ? "是" : "否" }}
            </template>
          </el-table-column>
          
          <el-table-column label="操作" align="center">
            <template slot-scope="scope">
              <el-button
                type="text"
                size="small"
                @click="newFlow.splice(scope.$index, 1)"
              >
                移除
              </el-button>
              <el-button
                type="text"
                size="small"
                @click="seeNewFlowobj(scope.row, scope.$index)"
              >
                查看
              </el-button>
            </template>
          </el-table-column>
          <el-table-column label="菜单地址" align="center">
          <template slot-scope="scope">
              <el-link style="font-size:12px" type="primary" @click="editFormObj = scope.row ; editFormVisible = true" class="tagItem">{{ scope.row.menu  ? "已设置" : "未设置" }}  </el-link>
          </template>
        </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="BM-5">
        <el-link
          icon="el-icon-plus"
          @click="
            addProcessVisible = true;
            businessFlowObjData = null;
            type = 'add';
          "
          type="primary"
          >添加流程</el-link
        >
      </el-col>

      <el-table
        :data="businessFlow"
        row-class-name="tableRowClassName"
        style="width: 100%"
      >
        <el-table-column label="流程名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
            <span>{{ scope.row.isApp == "yes" ? "（单独应用）" : "" }}</span>
          </template>
        </el-table-column>

        <el-table-column label="应用名称" align="center">
          <template slot-scope="scope">
            {{ scope.row.microApp ? scope.row.microApp.appName : "" }}
          </template>
        </el-table-column>
        <el-table-column label="是否单独设置应用" align="center">
          <template slot-scope="scope">
            {{ scope.row.isApp == "yes" ? "是" : "否" }}
          </template>
        </el-table-column>
        <el-table-column label="状态" align="center">
          <template slot-scope="scope">
            <el-tag
              style="margin: 0 5px"
              v-for="(item, index) in scope.row.states"
              :key="index"
              >{{ item.label }}</el-tag
            >

            <!-- <span>{{ scope.row.states.map((value) => value.label).join("、") }}</span> -->
          </template>
        </el-table-column>
        <el-table-column label=" 状态 | 操作" align="center">
          <template slot-scope="scope">
            <div
              class="operation-box"
              v-for="(item, index) in scope.row.operation"
              :key="index"
            >
              <span class="tagItem"> {{ item.state.label }}</span>
              <span>|</span>

              <span class="tagItem">{{ item.name }} </span>
            </div>
            <!-- {{
              scope.row.operation
                .map((value) => value.name + " | " + value.state.label)
                .join("、")
            }} -->
          </template>
        </el-table-column>
        
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="businessFlow.splice(scope.$index, 1)"
            >
              移除
            </el-button>
            <el-button
              type="text"
              size="small"
              @click="seeBusinessFlow(scope.row, scope.$index)"
            >
              查看
            </el-button>
          </template>
        </el-table-column>
        <el-table-column label="菜单地址" align="center">
          <template slot-scope="scope">
              <el-link style="font-size:12px" type="primary" @click="editFormObj = scope.row ; editFormVisible = true" class="tagItem">{{ scope.row.menu  ? "已设置" : "未设置" }}  </el-link>
          </template>
        </el-table-column>
        
      </el-table>
    </el-row>
    <NewAdd
      v-if="newAddVisible"
      :newFlow.sync="newFlow"
      :newFlowobjData="newFlowobjData"
      @onNewFlowobj="addNewFlow"
      :visible.sync="newAddVisible"
    ></NewAdd>
    <AddProcess
      v-if="addProcessVisible"
      :businessFlowObjData="businessFlowObjData"
      :businessFlow.sync="businessFlow"
      @onBusinessFlow="addBusinessFlow"
      :visible.sync="addProcessVisible"
    ></AddProcess>
   <el-dialog  :modal="false" :title="editFormObj.microApp.appName"
   v-if="editFormVisible"
                   :visible.sync="editFormVisible"
                   custom-class="custom-dialog" :close-on-click-modal="false" @close="handleClose" fullscreen>
            <el-row class="custom-box">
              <el-row >
                <el-steps  simple finish-status="success" process-status="process"
                          class="form-design-step">
                    <el-step title="菜单配置" icon="el-icon-menu" ></el-step>
                </el-steps>
            </el-row>
                <!--菜单配置-->
                <el-row  style="height:calc(100% - 40px)">
                    <menu-setting  :form-type="formType"  :form-name="editFormObj.microApp.appName" :formId="config.formId"
                                  :notify-save="notifySaveMenu" @onMenu="onMenu" @notifyParentClose="notifyParentClose"></menu-setting>
                </el-row>
            </el-row>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click="next" :loading="nextLoading"
                           style="background: #0b1532;border-color: #2153d4">
                    保存
                </el-button>
            </div>
        </el-dialog>
  </div>
</template>

<script>
import AddProcess from "./AddProcess";
import NewAdd from "./NewAdd/index";
import MenuSetting from '@/components/app-management/processDefinition/MenuSetting'
export default {
  name: "processDefinition",
  props: ["config", "newFlowList", "businessFlowList"],
  components: {
    AddProcess,
    NewAdd,
    MenuSetting
  },
  data() {
    return {
      type: "",
      index: 0,
      addProcessVisible: false,
      newAddVisible: false,
      newFlowobjData: null,
      businessFlowObjData: null,
      editFormObj:{},
      editFormVisible:false,
      formPermissions:[],
      formType: "0", // 表单类型,0:普通表单
      notifySaveMenu: 0, // 保存菜单配置
      active:0,
      nextLoading: false,
      // newFlow: [],
      // businessFlow: [],
    };
  },
  computed: {
    newFlow: {
      get() {
        return this.newFlowList;
      },
      set(val) {
        // this.config.stateFlow.newFlow = val;
        // console.log(this.config.stateFlow.newFlow);
        this.$emit("updata:newFlowList", val);
      },
    },
    businessFlow: {
      get() {
        return this.businessFlowList;
      },
      set(val) {
        // this.config.stateFlow.businessFlow = val;
        // console.log(this.config.stateFlow.businessFlow);
        this.$emit("updata:businessFlowList", val);
      },
    },
  },
  methods: {
    onMenu(menu){
      console.log(menu)
      if(this.editFormObj.menu){
        this.editFormObj.menu.level = menu.level
        this.editFormObj.menu.parentId = menu.parentId
        this.editFormObj.menu.orderIndex = menu.orderIndex
        this.editFormObj.menu.hidden = menu.hidden
    
      }else{
        this.$set(this.editFormObj,"menu",{})
        this.editFormObj.menu.level = menu.level
        this.editFormObj.menu.parentId = menu.parentId
        this.editFormObj.menu.orderIndex = menu.orderIndex
        this.editFormObj.menu.hidden = menu.hidden
      }
      
        
      console.log(menu,this.editFormObj,this.businessFlowList)
    },
    next() {       
        this.nextLoading = true;
        this.notifySaveMenu++;
    },
    // Dialog关闭回调
    handleClose() {
        this.nextLoading = false;
    },
    // 子组件设置成功后,子组件回调,是否关闭父组件的某些状态
    notifyParentClose(btnClose, dialogClose, cancel, checkFormDesignNoPass) {
        console.log(btnClose, dialogClose, cancel, checkFormDesignNoPass)
          if (checkFormDesignNoPass) {
              this.$notify.error({
                  title: '错误',
                  message: '请先完成确保设计的表单中含有字段并发布成功,否则无法进行下一步操作'
              });
              return false;
          }
  
          if (btnClose) {
              this.nextLoading = false; // 下一步按钮状态关闭
          }
          if (dialogClose) {
              this.editFormVisible = false; // 步骤全部设置完成,关闭弹窗
          }

      },
    // 从表单权限子组件中获取选中的节点
    getCheckedNodesFromOrgUserTree(checkedNodes) {
        let _this = this;
        _this.formPermissions = [];
        _this.formPermissions = checkedNodes;
        _this.formPermissionVisible = false;
    },
    addNewFlow(e) {
      if (this.type == "updata") {
        // [this.index] = e;
        this.$set(this.newFlow, this.index, e);
        e.id = this.index + 1;
      } else {
        this.newFlow.push(e);
        e.id = this.newFlow.length;
      }
      // this.newFlow = this.newFlow;
      console.log(e, this.newFlow);
      this.newFlowobjData = null;
    },
    addBusinessFlow(e) {
      console.log(e);
      if (this.type == "updata") {
        // this.businessFlow[] = e;
        this.$set(this.businessFlow, this.index, e);
        e.id = this.index;
      } else {
        this.businessFlow.push(e);
        e.id = this.businessFlow.length;
      }
      this.businessFlowObjData = null;
    },
    seeBusinessFlow(row, index) {
      this.type = "updata";
      this.index = index;
      this.businessFlowObjData = row;
      this.addProcessVisible = true;
    },
    seeNewFlowobj(row, index) {
      console.log(11, row);
      this.type = "updata";
      this.index = index;
      this.newFlowobjData = row;

      this.newAddVisible = true;
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/form/form-design.scss";
:deep(.custom-dialog){
  .custom-box{
    height: 100%;
  }
  .el-dialog__body {
    height: calc(100% - 40px);
  }
  .el-dialog__header{
    padding: 0px;
  }
} 
.process-definition {
  height: 100%;
  width: 100%;
  padding: 5px;
  position: relative;
  .new-add-button {
    margin-bottom: 20px;
  }
  .color-A {
    color: #aaaaaa;
    font-size: 10px;
    margin: 10px 0 20px;
  }
  .tableRowClassName {
    background: #f4f7fa;
  }
  .operation-box {
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    .tagItem {
      flex: 1;
      margin: 0 5px;
    }
    .tagItem:first-child {
      text-align: right;
    }
    .tagItem:last-child {
      text-align: left;
    }
  }
}
</style>
