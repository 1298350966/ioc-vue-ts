<template>
  <el-dialog
    width="70vw"
    title="选择组织"
    custom-class="addformcondition"
    :visible.sync="approverVisible"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form label-width="auto">
      <el-form-item label="本环节接收人:" required>
        <el-radio-group v-model="conditions.type" @change="radioChange">
          <el-radio label="0">角色</el-radio>
          <el-radio label="1">指定人</el-radio>
          <!-- <el-radio label="2">主管</el-radio> -->
          <el-radio label="4">表单内用户控件值</el-radio>
          <el-radio label="5">组织+角色</el-radio>
          <el-radio label="6">表单内用户控件值所属部门+角色</el-radio>
          <!-- <el-radio label="7">发起人所属部门+角色</el-radio> -->
          <el-radio label="8">表单内部门控件值+角色 </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="角色:" required v-if="conditions.type == 0">
        <el-button type="primary" @click="selectRoleVisible = true">添加角色</el-button>
        <p class="selected_list">
          <span v-for="(item, index) in conditions.role" :key="index"
            >{{ item.roleName }}
            <img
              @click="removeEle(conditions.role, item)"
              src="@/assets/images/flow/add-close1.png"
            />
          </span>
          <a @click="conditions.role = []">清除</a>
        </p>
        <selectRole
          v-if="selectRoleVisible"
          :visible.sync="selectRoleVisible"
          :data.sync="conditions.role"
        ></selectRole>
      </el-form-item>
      <el-form-item label="指定人:" required v-if="conditions.type == 1">
        <el-button type="primary" @click="selectPeopleVisible = true"
          >添加指定人</el-button
        >
        <p class="selected_list">
          <span v-for="(item, index) in conditions.person" :key="index"
            >{{ item.name }}
            <img
              @click="removeEle(conditions.person, item)"
              src="@/assets/images/flow/add-close1.png"
            />
          </span>
          <a @click="conditions.person = []">清除</a>
        </p>

        <selectPeople
          :visible.sync="selectPeopleVisible"
          :data.sync="conditions.person"
          @onSelectPeople="conditions.person = $event"
          >></selectPeople
        >
      </el-form-item>
      <!-- <el-form-item label="主管:" required v-if="conditions.type == 2">
        <el-select v-model="conditions.leader" placeholder="请选择">
          <el-option
            v-for="item in executiveDirectorOptions"
            :key="item.value"
            :label="item.label"
            :value="item.value"
          >
          </el-option>
        </el-select>
        <p>找不到主管时，由上级主管代审批 <i class="el-icon-warning-outline"></i></p>
      </el-form-item> -->
      <el-form-item label="发起人自己:" v-if="conditions.type == 3">
        发起人自己将作为审批人处理申批单 <i class="el-icon-warning-outline"></i>
      </el-form-item>
      <el-form-item label="表单信息中选择:" required v-if="conditions.type == 4">
        <el-select value-key="model" v-model="conditions.model" placeholder="请选择">
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
                v-model="conditions.model"
                :models.sync="models"
              ></formItem> -->
      </el-form-item>

      <el-form-item v-if="conditions.type == 5">
        <el-button type="primary" @click="organizationVisible = true">添加</el-button>
        <el-table
          row-class-name="tableRowClassName"
          :data="conditions.orgAndRole"
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
                @click="conditions.orgAndRole.splice(scope.$index, 1)"
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
          @onData="onData($event, conditions.orgAndRole)"
        ></selectOrganization>
        <selectRole
          :visible.sync="selectRoleVisible"
          :data.sync="conditions.role"
        ></selectRole>
      </el-form-item>
      <el-form-item v-if="conditions.type == 6">
        <el-button type="primary" @click="selectFormRoleVisible = true">添加</el-button>
        <el-table
          row-class-name="tableRowClassName"
          :data="conditions.dyncUserAndRole"
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
                @click="conditions.dyncUserAndRole.splice(scope.$index, 1)"
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
          @onData="conditions.dyncUserAndRole.push($event)"
        ></selectFormRole>
      </el-form-item>
      <!-- <el-form-item v-if="conditions.type == 7">
        <el-button type="primary" @click="selectDepartmentRoleVisible = true"
          >添加</el-button
        >
        <el-table
          row-class-name="tableRowClassName"
          :data="conditions.cuserOrgAndRole"
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
                @click="conditions.cuserOrgAndRole.splice(scope.$index, 1)"
              >
                移除
              </el-button>
            </template>
          </el-table-column>
        </el-table>

        <selectDepartmentRole
          v-if="selectDepartmentRoleVisible"
          :visible.sync="selectDepartmentRoleVisible"
          @onData="conditions.cuserOrgAndRole.push($event)"
        ></selectDepartmentRole>
      </el-form-item> -->
      <el-form-item v-if="conditions.type == 8">
        <el-button type="primary" @click="selectOrgFormRoleVisible = true"
          >添加</el-button
        >
        <el-table
          row-class-name="tableRowClassName"
          :data="conditions.dyncOrgAndRole"
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
                @click="conditions.dyncOrgAndRole.splice(scope.$index, 1)"
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
         :colsArray="colsArray"
          v-if="selectOrgFormRoleVisible"
          :visible.sync="selectOrgFormRoleVisible"
          @onData="onData($event, conditions.dyncOrgAndRole)"
        ></selectOrgFormRole>
      </el-form-item>
    </el-form>
    <fromConditionGroup :conditions.sync="conditions.conditions" :colsArray="colsArray"></fromConditionGroup>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="approverVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
import selectPeople from '@/components/form/FormRemindSet/formItemSettings/selectPeople'
import selectRole from '@/components/form/FormRemindSet/formItemSettings/selectRole'
import fromConditionGroup from '@/components/form/FormRemindSet/formItemSettings/fromConditionGroup'
import selectOrganization from '@/components/form/FormRemindSet/formItemSettings/selectOrganization'
import selectDepartmentRole from '@/components/form/FormRemindSet/formItemSettings/selectDepartmentRole'
import selectFormRole from '@/components/form/FormRemindSet/formItemSettings/selectFormRole'
import selectOrgFormRole from '@/components/form/FormRemindSet/formItemSettings/selectOrgFormRole'
export default {
  components: {
    selectPeople,
    selectRole,
    fromConditionGroup,
    selectOrganization,
    selectDepartmentRole,
    selectFormRole,
    selectOrgFormRole,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectType: {
      type: Number,
      default: 0,
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
    isLast: {
      type: Boolean,
      default: false,
    },
    colsArray:{
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      type: "add",
      organizationData: null,
      formconditionData: {},
      fromConditionGroupVisible: false,
      selectPeopleVisible: false,
      selectRoleVisible: false,
      organizationVisible: false,
      selectFormRoleVisible: false,
      selectDepartmentRoleVisible: false,
      selectOrgFormRoleVisible: false,
      conditions: {
        conditions: [],
        type: "0",
        // leader: "1",
        model: "",
        role: [],
        person: [],
        orgAndRole: [],
        dyncUserAndRole: [],
        // cuserOrgAndRole: [],
        dyncOrgAndRole: [],
        conditions: [],
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
    approverVisible: {
      get() {
        return this.visible;
        // return true;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
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
    userSelect() {
      if (!this.colsArray) return [];
      return this.colsArray.filter((value, index, array) => {
        return value.type == "user_select";
      });
    },
  },

  mounted() {
    this.listRoleHttp();
    if (this.data) {
      this.conditions.conditions = this.data.conditions || [];
      this.conditions.type = this.data.type || "";
      // this.conditions.leader = this.data.leader || "";
      this.conditions.model = this.data.model || "";
      this.conditions.role = this.data.role || [];
      this.conditions.person = this.data.person || [];
      this.conditions.orgAndRole = this.data.orgAndRole || [];
      this.conditions.dyncOrgAndRole = this.data.dyncOrgAndRole || []
      this.conditions.dyncUserAndRole = this.data.dyncUserAndRole || [];
      // this.conditions.cuserOrgAndRole = this.data.cuserOrgAndRole || [];
    }
  },
  methods: {
    onData(e, data) {
      ;
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
    async listRoleHttp() {
      const { listRole } = this.khConfig.api;
      let res = await this.$Get(listRole);
      if (res == "error") return;
      this.roleLsit = res.list;
    },

    onSubmit() {
      if (this.conditions.type == 0) {
        if (this.conditions.role.length == 0) return this.error("请添加角色");
      } else if (this.conditions.type == 1) {
        if (this.conditions.person.length == 0) return this.error("请添加指定人");
      } else if (this.conditions.type == 2) {
        if (!this.conditions.leader) return this.error("请添加主管");
      } else if (this.conditions.type == 4) {
        if (!this.conditions.model) return this.error("请选择表单信息");
      }

      if (Array.isArray(this.conditions.conditions)) {
        let isNull = this.conditions.conditions.find((value, index, array) => {
          if (!value.key && !value.name) {
            this.error(`请选择条件组${index + 1}字段`);
            return true;
          }
          if (!value.opt) {
            this.error(`请选择条件组${index + 1}条件`);
            return true;
          }
          if(!(value.value)) {
            if(value.type === 'switch'){
               value.value =  value.value ? true : false
            }else{
              this.error(`请选择条件组${index + 1}条件`);
              return true;
            }
          }
        });
        if (isNull) return;
      }
      this.$emit("onData", this.conditions);
      this.approverVisible = false;
    },
    onCondition(e) {
      console.log(e);
    },
    error(message) {
      this.$notify.error({
        title: "提示",
        message: message,
      });
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
    radioChange() {
      // this.conditions.leader = "1";
      this.conditions.model = "";
      this.conditions.role = [];
      this.conditions.person = [];
      this.conditions.orgAndRole =  [];
      this.conditions.dyncOrgAndRole = []
      this.conditions.dyncUserAndRole = [];
      // this.conditions.cuserOrgAndRole =  [];
    },
  },
};
</script>

<style lang="scss" scope>
.addformcondition {
  box-sizing: border-box;
  position: relative;
  .el-dialog__body {
    height: 52vh;
    overflow: auto;
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
  }
}
</style>
