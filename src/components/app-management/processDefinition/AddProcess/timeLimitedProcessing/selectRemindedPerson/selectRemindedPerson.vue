<template>
  <div class="selectHandler">
    <!-- <el-form-item  :label="label" required> -->
      <el-radio-group class="radio-group" v-model="recipient.type" @change="radioChange">
        <el-radio label="0">角色</el-radio>
        <el-radio label="1">指定人</el-radio>
        <el-radio label="2">主管</el-radio>
        <el-radio label="3">发起人自己</el-radio>
        <el-radio label="4">表单内用户控件值</el-radio>
        <el-radio label="5">组织+角色</el-radio>
        <el-radio label="6">表单内用户控件值所属部门+角色</el-radio>
        <el-radio label="7">发起人所属部门+角色</el-radio>
        <el-radio label="8">表单内部门控件值+角色 </el-radio>
        <el-radio label="9">条件+接收人</el-radio>
        <el-radio label="10">处理人主管</el-radio>
        <el-radio label="11">处理人所属部门+角色</el-radio>
      </el-radio-group>
    <!-- </el-form-item> -->
    <el-form-item v-if="recipient.type == 0">
      <el-button type="primary" @click="selectRoleVisible = true"
        >添加角色</el-button
      >
      <p class="selected_list">
        <span v-for="(item, index) in recipient.role" :key="index"
          >{{ item.roleName }}
          <img
            @click="removeEle(recipient.role, item)"
            src="@/assets/images/flow/add-close1.png"
          />
        </span>
        <a @click="recipient.role = []">清除</a>
      </p>
      <selectRole
        v-if="selectRoleVisible"
        :visible.sync="selectRoleVisible"
        :data.sync="recipient.role"
      ></selectRole>
    </el-form-item>
    <el-form-item v-if="recipient.type == 1">
      <el-button type="primary" @click="selectPeopleVisible = true"
        >添加指定人</el-button
      >
      <p class="selected_list">
        <span v-for="(item, index) in recipient.person" :key="index"
          >{{ item.name }}
          <img
            @click="removeEle(recipient.person, item)"
            src="@/assets/images/flow/add-close1.png"
          />
        </span>
        <a @click="recipient.person = []">清除</a>
      </p>

      <selectPeople
        :visible.sync="selectPeopleVisible"
        :data.sync="recipient.person"
        @onSelectPeople="recipient.person = $event"
        >></selectPeople
      >
    </el-form-item>
    <el-form-item v-if="recipient.type == 2">
      <el-select v-model="recipient.leader" placeholder="请选择">
        <el-option
          v-for="item in executiveDirectorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <p>
        找不到主管时，由直接主管 <i class="el-icon-warning-outline"></i>
      </p>
    </el-form-item>
    <el-form-item  v-if="recipient.type == 3">
      发起人自己 <i class="el-icon-warning-outline"></i>
    </el-form-item>
    <el-form-item required v-if="recipient.type == 4">
      <el-select
        value-key="model"
        v-model="recipient.model"
        placeholder="请选择"
      >
        <el-option
          v-for="item in userSelect"
          :key="item.value"
          :label="item.name"
          :value="item.model"
        >
        </el-option>
      </el-select>
      <!-- <formItem
                :box="userSelect"
                v-model="recipient.model"
                :models.sync="models"
              ></formItem> -->
    </el-form-item>
    <el-form-item v-if="recipient.type == 5">
      <el-button type="primary" @click="organizationVisible = true"
        >添加</el-button
      >
      <el-table
        row-class-name="tableRowClassName"
        :data="recipient.orgAndRole"
        style="width: 100%"
      >
        <el-table-column prop="orgName" label="组织名称" align="center">
        </el-table-column>
        <el-table-column prop="roleName" label="角色" align="center">
          <template slot-scope="scope">
            {{ scope.row.roleName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="recipient.orgAndRole.splice(scope.$index, 1)"
            >
              移除
            </el-button>
            <!-- <el-button
                      type="text"
                      size="small"
                      @click="updataOrganization(scope.row, scope.$index)"
                    >
                      查看
                    </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <selectOrganization
        :data="organizationData"
        v-if="organizationVisible"
        :visible.sync="organizationVisible"
        @onData="OrganizationData"
      ></selectOrganization>
    </el-form-item>
    <el-form-item v-if="recipient.type == 6">
      <el-button type="primary" @click="selectFormRoleVisible = true"
        >添加</el-button
      >
      <el-table
        row-class-name="tableRowClassName"
        :data="recipient.dyncUserAndRole"
        style="width: 100%"
      >
        <el-table-column prop="model" label="表单中选择" align="center">
          <template slot-scope="scope">
            {{ modelName(scope.row.model) }}
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色" align="center">
          <template slot-scope="scope">
            {{ scope.row.roleName }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否结束"> </el-table-column>> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="recipient.dyncUserAndRole.splice(scope.$index, 1)"
            >
              移除
            </el-button>
            <!-- <el-button
                      type="text"
                      size="small"
                      @click="updataOrganization(scope.row, scope.$index)"
                    >
                      查看
                    </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <selectFormRole
        v-if="selectFormRoleVisible"
        :visible.sync="selectFormRoleVisible"
        @onData="recipient.dyncUserAndRole.push($event)"
      ></selectFormRole>
    </el-form-item>
    <el-form-item v-if="recipient.type == 7">
      <el-button type="primary" @click="selectDepartmentRoleVisible = true"
        >添加</el-button
      >
      <el-table
        row-class-name="tableRowClassName"
        :data="recipient.cuserOrgAndRole"
        style="width: 100%"
      >
        <el-table-column prop="roleName" label="角色" align="center">
          <template slot-scope="scope">
            {{ scope.row.roleName }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否结束"> </el-table-column>> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="recipient.cuserOrgAndRole.splice(scope.$index, 1)"
            >
              移除
            </el-button>
            <!-- <el-button
                      type="text"
                      size="small"
                      @click="updataOrganization(scope.row, scope.$index)"
                    >
                      查看
                    </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <selectDepartmentRole
        v-if="selectDepartmentRoleVisible"
        :visible.sync="selectDepartmentRoleVisible"
        @onData="recipient.cuserOrgAndRole.push($event)"
      ></selectDepartmentRole>
    </el-form-item>
    <el-form-item v-if="recipient.type == 8">
      <el-button type="primary" @click="selectOrgFormRoleVisible = true"
        >添加</el-button
      >
      <el-table
        row-class-name="tableRowClassName"
        :data="recipient.dyncOrgAndRole"
        style="width: 100%"
      >
        <el-table-column prop="model" label="表单中选择" align="center">
          <template slot-scope="scope">
            {{ modelName(scope.row.model) }}
          </template>
        </el-table-column>
        <el-table-column prop="roleName" label="角色" align="center">
          <template slot-scope="scope">
            {{ scope.row.roleName }}
          </template>
        </el-table-column>
        <!-- <el-table-column label="是否结束"> </el-table-column>> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="recipient.dyncOrgAndRole.splice(scope.$index, 1)"
            >
              移除
            </el-button>
            <!-- <el-button
                      type="text"
                      size="small"
                      @click="updataOrganization(scope.row, scope.$index)"
                    >
                      查看
                    </el-button> -->
          </template>
        </el-table-column>
      </el-table>

      <selectOrgFormRole
        v-if="selectOrgFormRoleVisible"
        :visible.sync="selectOrgFormRoleVisible"
        @onData="onData($event, recipient.dyncOrgAndRole)"
      ></selectOrgFormRole>
    </el-form-item>
    <el-form-item v-if="recipient.type == 9">
      <el-button
        type="primary"
        @click="
          addformconditionVisible = true;
          formconditionData = {};
          type = 'add';
          isLastformconditionData = false;
        "
        >添加</el-button
      >
      <el-table
        row-class-name="tableRowClassName"
        :data="recipient.conditions"
        style="width: 100%"
      >
        <el-table-column prop="type" label="接收人类型" align="center">
          <template slot-scope="scope">
            <span>{{ receiverType[scope.row.type] }}</span>
          </template>
        </el-table-column>
        <el-table-column prop="role" label="接收人" align="center">
          <template slot-scope="scope">
            {{ receiver(scope.row) }}
          </template>
        </el-table-column>
        <el-table-column label="条件" align="center">
          <template slot-scope="scope">
            <div
              class="conditions-box"
              v-for="(item, index) in scope.row.conditions"
              :key="index"
            >
              <span class="condiotinsItem"> {{ item.name }} </span>
              <span  class="condiotinsItem"
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
              <span class="conditionsItem"> {{ formValue(item.value) }} </span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="recipient.conditions.splice(scope.$index, 1)"
            >
              移除
            </el-button>

            <el-button
              type="text"
              size="small"
              @click="
                updataFormcondition(
                  scope.row,
                  scope.$index,
                  conditionsLength != scope.$index + 1
                )
              "
            >
              查看
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <addformcondition
        :data="formconditionData"
        v-if="addformconditionVisible"
        :visible.sync="addformconditionVisible"
        @onData="onData($event, recipient.conditions)"
      ></addformcondition>
    </el-form-item>
    <el-form-item v-if="recipient.type == 10">
      <el-select v-model="recipient.dealingLeader" placeholder="请选择">
        <el-option
          v-for="item in executiveDirectorOptions"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
        </el-option>
      </el-select>
      <p>
        找不到主管时，由直接主管<i class="el-icon-warning-outline"></i>
      </p>
    </el-form-item>
    <el-form-item v-if="recipient.type == 11">
      <el-button type="primary" @click="dealingOrgAndRoleVisible = true"
        >添加</el-button
      >
      <el-table
        row-class-name="tableRowClassName"
        :data="recipient.dealingOrgAndRole"
        style="width: 100%"
      >
        <el-table-column prop="roleName" label="角色" align="center">
          <template slot-scope="scope">
            {{ scope.row.roleName }}
          </template>
        </el-table-column>
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="recipient.dealingOrgAndRole.splice(scope.$index, 1)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>
      <selectDepartmentRole
          v-if="dealingOrgAndRoleVisible"
          :visible.sync="dealingOrgAndRoleVisible"
          @onData="recipient.dealingOrgAndRole.push($event)"
        ></selectDepartmentRole>
    </el-form-item>
  </div>
</template>

<script>
import {mapState} from "vuex"
import addformcondition from '@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/selectRemindedPerson/addformcondition'
import selectRole from "@/components/app-management/formItemSettings/selectRole";
import selectPeople from "@/components/app-management/formItemSettings/selectPeople";
import selectFormRole from "@/components/app-management/formItemSettings/selectFormRole";
import selectOrganization from "@/components/app-management/formItemSettings/selectOrganization";
import selectOrgFormRole from "@/components/app-management/formItemSettings/selectOrgFormRole";
import selectDepartmentRole from '@/components/app-management/formItemSettings/selectDepartmentRole'
import date from '@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/selectRemindedPerson/date'
export default {
  props: ["recipient",'label'],
  components: {
    addformcondition,
    selectRole,
    selectPeople,
    selectFormRole,
    selectOrganization,
    selectOrgFormRole,
    selectDepartmentRole
  },
  data() {
    return {
      type: "",
      index: "",
      organizationData: null,
      formconditionData: {},
      dealingOrgAndRoleData:{},
      isLastformconditionData: false,
      selectRoleVisible: false,
      selectPeopleVisible: false,
      organizationVisible: false,
      selectFormRoleVisible: false,
      selectDepartmentRoleVisible: false,
      addformconditionVisible: false,
      selectOrgFormRoleVisible: false,
      dealingOrgAndRoleVisible:false,
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
      receiverType: [
        "角色",
        "指定人",
        "主管",
        "发起人自己",
        "表单内用户控件值",
        "组织+角色",
        "表单内用户控件值所属部门+角色",
        '发起人所属部门+角色',
        '表单内部门控件值+角色',
         '',
        '处理人主管',
        '处理人所属部门+角色'
      ],
    };
  },
  computed: {
    ...mapState({
      formDataconfig: (state) => state.appManagement.formDataconfig,
    }),
    conditionsLength() {
      return this.recipient.conditions.length;
    },
    userSelect() {
      if (!this.formDataconfig) return [];
      return this.formDataconfig.filter((value, index, array) => {
        return value.type == "user_select";
      });
    },
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
    //处理人
    receiver(){
      return date.receiver
    }
  },
  mounted(){
    console.log(this.recipient)
      this.init()
      
  },
  methods: {
    init(){
      if(!this.recipient) return
        if(!this.recipient.type){
            this.$set(this.recipient,'type',"0")
        }
        if(!this.recipient.role){
            this.$set(this.recipient,'role',[])
        }
        if(!this.recipient.person){
            this.$set(this.recipient,'person',[])
        }
        if(!this.recipient.model){
            this.$set(this.recipient,'model',"")
        }
        if(!this.recipient.leader){
            this.$set(this.recipient,'leader',"")
        }
        if(!this.recipient.orgAndRole){
            this.$set(this.recipient,'orgAndRole',[])
        }
        if(!this.recipient.dyncUserAndRole){
            this.$set(this.recipient,'dyncUserAndRole',[])
        }if(!this.recipient.cuserOrgAndRole){
            this.$set(this.recipient,'cuserOrgAndRole',[])
        }

        if(!this.recipient.dyncOrgAndRole){
            this.$set(this.recipient,'dyncOrgAndRole',[])
        }
        if(!this.recipient.conditions){
            this.$set(this.recipient,'conditions',[])
        }
        if(!this.recipient.dealingLeader){
            this.$set(this.recipient,'dealingLeader','')
        }
        if(!this.recipient.dealingOrgAndRole){
            this.$set(this.recipient,'dealingOrgAndRole',[])
        }
    },
    onData(e, data) {
      if (this.type == "updata") {
        this.$set(data, this.index, e);
        // this.businessFlowObj.operation[this.index] = e;
      } else {
        data.unshift(e);
      }
      if (this.isLastformconditionData) {
        this.isLastformconditionData = false;
      }
    },
    formValue(value) {
      if (Array.isArray(value)) {
        return value.join("、");
      } else if (value instanceof Object) {
        return value.model;
      } else {
        return value;
      }
    },
    removeEle(arr, elem) {
      var includesIndex;
      arr.map((item, index) => {
        if (item == elem) {
          includesIndex = index;
        }
      });
      arr.splice(includesIndex, 1);
    },

    OrganizationData(e) {
      this.recipient.orgAndRole.push(e);
    },

    updataOrganization(row, index) {
      this.type = "updata";
      this.index = index;
      this.organizationData = row;
      this.organizationVisible = true;
    },
    updataFormcondition(row, index, isLast) {
      this.type = "updata";
      this.index = index;
      this.formconditionData = row;
      this.addformconditionVisible = true;
      this.isLastformconditionData = isLast;
    },
    radioChange() {
      let recipient = this.recipient;
      recipient.model = "";
      recipient.leader = "";
      recipient.role = [];
      recipient.person = [];
      recipient.orgAndRole = [];
      recipient.dyncUserAndRole = [];
      recipient.cuserOrgAndRole = [];
      recipient.dyncOrgAndRole = [];
      recipient.conditions = [];
      recipient.dealingLeader = '';
      recipient.dealingOrgAndRole = []
    },
  },
};
</script>

<style lang="scss" scope>
.selectHandler {
    .radio-group{
        margin-bottom: 10px;
        position: relative;
        .el-radio{
          width: 40%;
          line-height: 26px;
        }
    }
    .selected_list {
    margin: 5px 0;
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
 ::v-deep .conditions-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .conditionsItem {
      flex: 1;
      &:nth-last-child(2){
        padding: 0 3px;
      }
    }
  }
}


</style>