<template>
  <div class="Receiver">
    <el-form-item label="接收人">
      <el-radio-group v-model="recipient.type" @change="radioChange">
        <el-radio label="0">角色</el-radio>
        <el-radio label="1">指定人</el-radio>
        <!-- <el-radio label="2">主管</el-radio> -->
        <el-radio label="4">表单内用户控件值</el-radio>
        <el-radio label="5">组织+角色</el-radio>
        <el-radio label="6">表单内用户控件值所属部门+角色</el-radio>
        <!-- <el-radio label="7">发起人所属部门+角色</el-radio> -->
        <el-radio label="8">表单内部门控件值+角色 </el-radio>
        <el-radio label="9">条件+接收人</el-radio>
      </el-radio-group>
    </el-form-item>
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
        找不到主管时，由直接主管代审批 <i class="el-icon-warning-outline"></i>
      </p>
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
          <template slot-scope="scope">
            {{ scope.row.orgName }}
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
              @click="recipient.orgAndRole.splice(scope.$index, 1)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <selectOrganization
        :data="organizationData"
        v-if="organizationVisible"
        :visible.sync="organizationVisible"
        @onData="onOrganizationData"
      ></selectOrganization>
      <selectRole
        :visible.sync="selectRoleVisible"
        :data.sync="recipient.role"
      ></selectRole>
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
        :colsArray="colsArray"
        v-if="selectFormRoleVisible"
        :visible.sync="selectFormRoleVisible"
        @onData="recipient.dyncUserAndRole.push($event)"
      ></selectFormRole>
    </el-form-item>
    <!-- <el-form-item v-if="recipient.type == 7">
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
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="recipient.cuserOrgAndRole.splice(scope.$index, 1)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <selectDepartmentRole
        :colsArray="colsArray"
        v-if="selectDepartmentRoleVisible"
        :visible.sync="selectDepartmentRoleVisible"
        @onData="recipient.cuserOrgAndRole.push($event)"
      ></selectDepartmentRole>
    </el-form-item> -->
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
      
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <el-button
              type="text"
              size="small"
              @click="recipient.dyncOrgAndRole.splice(scope.$index, 1)"
            >
              移除
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <selectOrgFormRole
        :colsArray="colsArray"
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
            <!-- <span
                      v-show="
                        recipient.conditions.length == scope.$index + 1
                      "
                      style="color: red"
                      >【默认】</span
                    > -->
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
              <span class="conditionsItem"> {{ item.name }} </span>
              <span
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
              <span class="conditionsItem"> {{ formValue(item.value) }}</span>
            </div>

            <!-- {{ scope.row.conditions | conditionsfilters }} -->
          </template>
        </el-table-column>

        <!-- <el-table-column label="是否结束"> </el-table-column>> -->
        <el-table-column label="操作" align="center">
          <template slot-scope="scope">
            <!-- v-if="
                        recipient.conditions.length != scope.$index + 1
                      " -->
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
      <!-- :isLast="isLastformconditionData" -->
      <addformcondition
        :colsArray="colsArray"
        :data="formconditionData"
        v-if="addformconditionVisible"
        :visible.sync="addformconditionVisible"
        @onData="onData($event, recipient.conditions)"
      ></addformcondition>
    </el-form-item>
    <el-form-item label="默认接收" required>
      <el-button type="primary" @click="selectDefaultPeopleVisible = true"
        >添加默认接收人</el-button
      >
      <p class="selected_list">
        <span
          v-for="(item, index) in defaultRecipient"
          :key="index"
          >{{ item.name }}
          <img
            @click="removeEle(defaultRecipient, item)"
            src="@/assets/images/flow/add-close1.png"
          />
        </span>
        <a v-show="defaultRecipient.length" @click="$emit('update:defaultRecipient',[])">清除</a>
      </p>
      <selectPeople
        :visible.sync="selectDefaultPeopleVisible"
        :data.sync="defaultRecipient"
        @onSelectPeople="$emit('update:defaultRecipient',$event)"
      ></selectPeople>
    </el-form-item>
  </div>
</template>

<script>
import selectRole from "@/components/form/FormRemindSet/formItemSettings/selectRole";
import selectPeople from "@/components/form/FormRemindSet/formItemSettings/selectPeople";
import selectOrganization from "@/components/form/FormRemindSet/formItemSettings/selectOrganization";
import selectDepartmentRole from "@/components/form/FormRemindSet/formItemSettings/selectDepartmentRole";
import selectFormRole from "@/components/form/FormRemindSet/formItemSettings/selectFormRole";
import selectOrgFormRole from "@/components/form/FormRemindSet/formItemSettings/selectOrgFormRole";
import addformcondition from "@/components/form/FormRemindSet/formItemSettings/addformcondition";

export default {
  components: {
    selectRole,
    selectPeople,
    selectOrganization,
    selectDepartmentRole,
    selectFormRole,
    selectOrgFormRole,
    addformcondition,
  },
  props: {
    recipient: {
      type: Object,
      default: () => {
        return {};
      },
    },
    defaultRecipient:{
      type: Array,
      default: () => {
        return [];
      },
    },
    colsArray: {
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      type: "",
      index: "",
      organizationData: [],
      selectPeopleVisible: false,
      selectRoleVisible: false,
      organizationVisible: false,
      selectFormRoleVisible: false,
      selectDepartmentRoleVisible: false,
      selectOrgFormRoleVisible: false,
      formconditionData: {},
      isLastformconditionData: false,
      addformconditionVisible: false,
      selectDefaultPeopleVisible:false,
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
      //   receiverType: ["角色", "指定人", "主管", "发起人自己", "表单内用户控件值"],
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
      ],
    };
  },
  computed: {
    conditionsLength() {
      return this.recipient.conditions.length;
    },

    userSelect() {
      if (!this.colsArray) return [];
      return this.colsArray.filter((value, index, array) => {
        return value.type == "user_select";
      });
    },
    modelName() {
      return function (model) {
        if (!model) return "";
        let formDataItem = this.colsArray.find((value) => {
          return value.model == model;
        });
        if (formDataItem) {
          return formDataItem.name;
        } else {
          return "";
        }
      };
    },
    receiver() {
      return function (obj) {
        if (!obj && !obj.type) return "";
        if (obj.type == 0) {
          return obj.role.map((value) => value.roleName).join("、");
        } else if (obj.type == 1) {
          return obj.person.map((value) => value.name).join("、");
        } else if (obj.type == 2) {
          return obj.leader == 1 ? "直接主管" : obj.leader + "级主管";
        } else if (obj.type == 3) {
          return "发起人自己";
        } else if (obj.type == 4) {
          return this.modelName(obj.model);
        } else if (obj.type == 5) {
          return obj.orgAndRole.map((value, index, array) => {
            return value.orgName +"+"+ value.roleName
          }).join('、')
        } else if (obj.type == 6) {
          return obj.dyncUserAndRole.map((value, index, array) => {
            return this.modelName(value.model) +"+"+ value.roleName
          }).join('、')
        }else if (obj.type == 7) {
          return obj.cuserOrgAndRole.map((value, index, array) => {
            return  value.roleName
          }).join('、')
        } else if (obj.type == 8) {
          return obj.dyncOrgAndRole.map((value, index, array) => {
            return  this.modelName(value.model) + "+" + value.roleName
          }).join('、')
        }
      };
    },
  },
  mounted() {},
  methods: {
    formValue(value){
      if(Array.isArray(value)){
        return value.join('、')
      }else if(value instanceof Object){
        let valueStr = ''
   
        for (const key in value) {
          if(valueStr){

            valueStr=valueStr +"/"+ value[key]
          }else{
            valueStr= value[key]
          }
          
        }
        return valueStr

      }else{
        return value
      }
    },
    radioChange() {
      let recipient = this.recipient;

      recipient.model = "";
      // recipient.leader = "";
      recipient.role = [];
      recipient.person = [];
      recipient.orgAndRole = [];
      recipient.dyncUserAndRole = [];
      // recipient.cuserOrgAndRole = [];
      recipient.dyncOrgAndRole = [];
      recipient.conditions = [];
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
    onOrganizationData(e) {
      this.recipient.orgAndRole.push(e);
      // this.selectRoleVisible = true;
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
  },
};
</script>

<style lang="scss" scope>
.Receiver {
  .selected_list {
    margin-bottom: 20px;
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
  .conditions-box {
    display: flex;
    justify-content: center;
    align-items: center;
    .conditionsItem {
      // flex: 1;
      padding:0 4px;
    }
    .conditionsItem:first-child {
      text-align: right;
    }
    .conditionsItem:last-child {
      text-align: left;
    }
  }
}
</style>