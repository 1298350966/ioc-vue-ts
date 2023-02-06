<template>
  <div>
    <el-dialog
      width="70vw"
      title="添加流程"
      :modal="false"
      custom-class="AddProcess"
      :visible.sync="dialogFormVisible"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <!-- {{ businessFlowObj.states }}
      {{ stateConfig }} -->
      <!-- {{ businessFlowObj.states }} -->
      <el-tabs v-model="activeName">
        <el-tab-pane label="流程设置" name="流程设置">
          <el-form label-width="auto" ref="form" :model="businessFlowObj">
            <el-form-item label="本环节名称:" required>
              <el-input style="width: 300px" v-model="businessFlowObj.name"></el-input>
            </el-form-item>
            <!-- {{ statesNameList }}
            {{ businessFlowObj }} -->
            <el-form-item label="状态转换:" required>
              <!-- {{ this.businessFlowObj.states }} -->
              <el-checkbox-group v-model="statesNameList" placeholder="请选择状态转换">
                <!-- statesNameList -->
                <!-- businessFlowObj.states -->
                <!-- :checked="item.checked" -->
                <el-checkbox
                  v-for="(item, index) in stateConfig"
                  :key="index"
                  :label="item.label"
                  >{{ item.label }}</el-checkbox
                >
              </el-checkbox-group>
            </el-form-item>
            <el-form-item label="是否单独设置应用:" required>
              <el-radio-group v-model="businessFlowObj.isApp">
                <el-radio label="yes">是</el-radio>
                <el-radio label="no">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="本环节接收人:" required>
              <el-radio-group
                v-model="businessFlowObj.recipient.type"
                @change="radioChange"
              >
                <el-radio label="0">角色</el-radio>
                <el-radio label="1">组织+人</el-radio>
                <el-radio label="13">指定人</el-radio>
                <el-radio label="2">主管</el-radio>
                <el-radio label="3">发起人自己</el-radio>
                <el-radio label="10">企业</el-radio>
                <el-radio label="4">表单内用户控件值</el-radio>
                <el-radio label="12">表单内用户控件值(多选)</el-radio>
                <el-radio label="11">表单内企业控件值</el-radio>
                <el-radio label="5">组织+角色</el-radio>
                <el-radio label="6">表单内用户控件值所属部门+角色</el-radio>
                <el-radio label="7">发起人所属部门+角色</el-radio>
                <el-radio label="8">表单内部门控件值+角色 </el-radio>
                <el-radio label="9">条件+接收人</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 0">
              <el-button type="primary" @click="selectRoleVisible = true"
                >添加角色</el-button
              >
              <p class="selected_list">
                <span v-for="(item, index) in businessFlowObj.recipient.role" :key="index"
                  >{{ item.roleName }}
                  <img
                    @click="removeEle(businessFlowObj.recipient.role, item)"
                    src="@/assets/images/flow/add-close1.png"
                  />
                </span>
                <a @click="businessFlowObj.recipient.role = []">清除</a>
              </p>
              <selectRole
                v-if="selectRoleVisible"
                :visible.sync="selectRoleVisible"
                :data.sync="businessFlowObj.recipient.role"
              ></selectRole>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 1 || businessFlowObj.recipient.type == 13">
              <el-button type="primary" @click="selectPeopleVisible = true"
                >添加指定人</el-button
              >
              <p class="selected_list">
                <draggable v-model="businessFlowObj.recipient.person">
                    <transition-group>
                      <span
                      class="border"
                      v-for="(item, index) in businessFlowObj.recipient.person"
                      :key="index"
                      >{{ item.name }}
                      <img
                        @click="removeEle(businessFlowObj.recipient.person, item)"
                        src="@/assets/images/flow/add-close1.png"
                      />
                    </span>
                    </transition-group>
                </draggable>
                <a @click="businessFlowObj.recipient.person = []">清除</a>
              </p>
              <el-radio-group v-if="businessFlowObj.recipient.type == 13" v-model="businessFlowObj.recipient.handleType">
                  <el-radio label="1">或签</el-radio>
                  <el-radio label="2">会签</el-radio>
                  <el-radio label="3">依次签</el-radio>
              </el-radio-group>
              <selectPeople
                v-if="selectPeopleVisible"
                :isOrgSelect="businessFlowObj.recipient.type == 1"
                :visible.sync="selectPeopleVisible"
                :data.sync="businessFlowObj.recipient.person"
                @onSelectPeople="businessFlowObj.recipient.person = $event"
                >></selectPeople
              >
            </el-form-item>
            <el-form-item label="结束状态" v-if="businessFlowObj.recipient.type == 13 && businessFlowObj.recipient.handleType!=='1'">
               <el-select  v-model="businessFlowObj.recipient.outState" placeholder="请选择">
                <el-option
                  v-for="item in stateConfig"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 2">
              <el-select v-model="businessFlowObj.recipient.leader" placeholder="请选择">
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
            <el-form-item label="发起人自己:" v-if="businessFlowObj.recipient.type == 3">
              发起人自己将作为审批人处理申批单 <i class="el-icon-warning-outline"></i>
            </el-form-item>
            <el-form-item required v-if="businessFlowObj.recipient.type == 4">
              <el-select
                value-key="model"
                v-model="businessFlowObj.recipient.model"
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
                v-model="businessFlowObj.recipient.model"
                :models.sync="models"
              ></formItem> -->
            </el-form-item>
            <el-form-item required v-if="businessFlowObj.recipient.type == 12">
              <el-select
                multiple 
                style="min-width:300px"
                value-key="model"
                v-model="businessFlowObj.recipient.userModels"
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
              <div>
                <el-radio-group v-model="businessFlowObj.recipient.handleType">
                  <el-radio label="1">或签</el-radio>
                  <el-radio label="2">会签</el-radio>
                  <el-radio label="3">依次签</el-radio>
                </el-radio-group>
              </div>
              <!-- <el-select
                value-key="model"
                v-model="businessFlowObj.recipient.model"
                placeholder="请选择"
              >
                <el-option
                  v-for="item in userSelect"
                  :key="item.value"
                  :label="item.name"
                  :value="item.model"
                >
                </el-option>
              </el-select> -->
            </el-form-item>
            <el-form-item label="结束状态" v-if="businessFlowObj.recipient.type == 12 && businessFlowObj.recipient.handleType!=='1'">
               <el-select  v-model="businessFlowObj.recipient.outState" placeholder="请选择">
                <el-option
                  v-for="item in stateConfig"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                  >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item required v-if="businessFlowObj.recipient.type == 11">
              <el-select
                value-key="model"
                v-model="businessFlowObj.recipient.companyModel.model"
                placeholder="请选择"
                @change="changeCompanyModel"
              >
                <el-option
                  v-for="item in companySelect"
                  :key="item.value"
                  :label="item.name"
                  :value="item.model"
                  
                >
                </el-option>
              </el-select>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 5">
              <el-button type="primary" @click="organizationVisible = true"
                >添加</el-button
              >
              <el-table
                row-class-name="tableRowClassName"
                :data="businessFlowObj.recipient.orgAndRole"
                style="width: 100%"
              >
                <el-table-column prop="orgName" label="组织名称" align="center">
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
                      @click="
                        businessFlowObj.recipient.orgAndRole.splice(scope.$index, 1)
                      "
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
              <selectRole
                :visible.sync="selectRoleVisible"
                :data.sync="businessFlowObj.recipient.role"
              ></selectRole>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 6">
              <el-button type="primary" @click="selectFormRoleVisible = true"
                >添加</el-button
              >
              <el-table
                row-class-name="tableRowClassName"
                :data="businessFlowObj.recipient.dyncUserAndRole"
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
                      @click="
                        businessFlowObj.recipient.dyncUserAndRole.splice(scope.$index, 1)
                      "
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
                @onData="businessFlowObj.recipient.dyncUserAndRole.push($event)"
              ></selectFormRole>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 7">
              <el-button type="primary" @click="selectDepartmentRoleVisible = true"
                >添加</el-button
              >
              <el-table
                row-class-name="tableRowClassName"
                :data="businessFlowObj.recipient.cuserOrgAndRole"
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
                      @click="
                        businessFlowObj.recipient.cuserOrgAndRole.splice(scope.$index, 1)
                      "
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
                @onData="businessFlowObj.recipient.cuserOrgAndRole.push($event)"
              ></selectDepartmentRole>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 8">
              <el-button type="primary" @click="selectOrgFormRoleVisible = true"
                >添加</el-button
              >
              <el-table
                row-class-name="tableRowClassName"
                :data="businessFlowObj.recipient.dyncOrgAndRole"
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
                      @click="
                        businessFlowObj.recipient.dyncOrgAndRole.splice(scope.$index, 1)
                      "
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
                @onData="onData($event, businessFlowObj.recipient.dyncOrgAndRole)"
              ></selectOrgFormRole>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 9">
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
                :data="businessFlowObj.recipient.conditions"
                style="width: 100%"
              >
                <el-table-column prop="type" label="接收人类型" align="center">
                  <template slot-scope="scope">
                    <!-- <span
                      v-show="
                        businessFlowObj.recipient.conditions.length == scope.$index + 1
                      "
                      style="color: red"
                      >【默认】</span
                    > -->
                    <span>{{ receiverType[scope.row.type] }}</span>
                  </template>
                </el-table-column>
                <el-table-column prop="role" label="接收对象" align="center">
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
                      <span class="conditionsItem"> {{ formValue(item) }} </span>
                    </div>

                    <!-- {{ scope.row.conditions | conditionsfilters }} -->
                  </template>
                </el-table-column>

                <!-- <el-table-column label="是否结束"> </el-table-column>> -->
                <el-table-column label="操作" align="center">
                  <template slot-scope="scope">
                    <!-- v-if="
                        businessFlowObj.recipient.conditions.length != scope.$index + 1
                      " -->
                    <el-button
                      type="text"
                      size="small"
                      @click="
                        businessFlowObj.recipient.conditions.splice(scope.$index, 1)
                      "
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
                :data="formconditionData"
                v-if="addformconditionVisible"
                :visible.sync="addformconditionVisible"
                @onData="onData($event, businessFlowObj.recipient.conditions)"
              ></addformcondition>
            </el-form-item>
            <el-form-item v-if="businessFlowObj.recipient.type == 10">
              <el-button type="primary" @click="companyRecipientVisible = true"
                >添加公司</el-button
              >
              <p class="selected_list">
                <span
                  class="border"
                  v-for="(item, index) in businessFlowObj.recipient.company"
                  :key="index"
                  >{{ item.name }}
                  <img
                    @click="removeEle(businessFlowObj.recipient.person, item)"
                    src="@/assets/images/flow/add-close1.png"
                  />
                </span>
                <a @click="businessFlowObj.recipient.person = []">清除</a>
              </p>
        
               <el-dialog title="企业接收人" :visible.sync="companyRecipientVisible" v-if="companyRecipientVisible" width="50%" :modal="false" :append-to-body="true"
                   :close-on-click-modal="false">
                <company-transfer :selectCompany="businessFlowObj.recipient.company" @getSelectCompany="getSelectCompany"></company-transfer>
              </el-dialog>
  
            </el-form-item>

            
              <el-form-item label="默认接收人:" required>
                  <el-button type="primary" @click="selectDefaultPeopleVisible = true"
                  >添加默认接收人</el-button
                  >
                  <p class="selected_list">
                <span
                    class="border"
                    v-for="(item, index) in businessFlowObj.defaultRecipient"
                    :key="index"
                >{{ item.name }}
                  <img
                      @click="removeEle(businessFlowObj.defaultRecipient, item)"
                      src="@/assets/images/flow/add-close1.png"
                  />
                </span>
                      <a @click="cleanDefaultRecipent()">清除</a>

                  </p>

                  <selectPeople
                      :visible.sync="selectDefaultPeopleVisible"
                      :data.sync="businessFlowObj.defaultRecipient"
                      @onSelectPeople="businessFlowObj.defaultRecipient= $event"
                  ></selectPeople>
              </el-form-item>
            <el-form-item label="是否支持批量操作:" required>
              <el-radio-group v-model="businessFlowObj.batchOperation">
                <el-radio label="yes">是</el-radio>
                <el-radio label="no">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="是否支持转办操作:" required>
              <el-radio-group v-model="businessFlowObj.openTransfer">
                <el-radio :label="true">是</el-radio>
                <el-radio :label="false">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              v-show="businessFlowObj.isApp == 'yes'"
              required
              label="应用设置:"
            >
              <el-link
                class="ML-20"
                type="primary"
                :underline="false"
                @click="
                  AddAppVisible = true;
                  microAppObjData = {};
                "
                >添加</el-link
              >

              <AddApp
                v-if="AddAppVisible"
                :microApp.sync="businessFlowObj.microApp"
                @onData="businessFlowObj.microApp = $event"
                :microAppObjData="microAppObjData"
                :visible.sync="AddAppVisible"
                :appName="businessFlowObj.name"
              ></AddApp>
            </el-form-item>
            <el-table
              row-class-name="tableRowClassName"
              v-show="businessFlowObj.isApp == 'yes'"
              ref="multipleTable"
              :data="microAppList"
              tooltip-effect="dark"
              header-cell-class-name="header-table"
              style="width: 100%"
            >
              <el-table-column label="应用名称" align="center" show-overflow-tooltip>
                <template slot-scope="scope">
                  <el-input
                    v-show="appNameShow"
                    @blur="appNameShow = false"
                    style="width: 60%"
                    placeholder="请输入内容"
                    v-model="scope.row.appName"
                    :autofocus="true"
                  >
                  </el-input>
                  <div v-show="!appNameShow">
                    <span>{{ scope.row.appName }}</span>

                    <i @click="appNameShow = true" class="el-icon-edit"></i>
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
              <el-table-column label="操作" align="center">
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
                      AddAppVisible = true;
                    "
                  >
                    查看
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-form>
          <div class="BM-18">
            <el-link
              icon="el-icon-plus"
              @click="
                addProcessingOperationVisible = true;
                operationObjData = null;
                type = 'add';
              "
              type="primary"
              >添加处理操作</el-link
            >
          </div>

          <AddProcessingOperation
            v-if="addProcessingOperationVisible"
            :operation.sync="businessFlowObj.operation"
            :stateOptions="businessFlowObj.states"
            :visible.sync="addProcessingOperationVisible"
            :operationObjData="operationObjData"
            @onOperationObj="onOperationObj"
            :type="type"
          ></AddProcessingOperation>

          <el-table
            row-class-name="tableRowClassName"
            :data="businessFlowObj.operation"
            style="width: 100%"
          >
            <el-table-column prop="name" label="名称" align="center"> </el-table-column>
            <el-table-column label="对应状态" align="center">
              <template slot-scope="scope">
                {{ scope.row.state.label }}
              </template>
            </el-table-column>
            <!-- <el-table-column label="是否结束"> </el-table-column>> -->
            <el-table-column label="操作" align="center">
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
          </el-table>

          <div class="stateOperation">
          <h3 style="font-weight: bold;
              line-height: 30px;
              margin-bottom: 10px;">自定义操作按钮</h3>   
              <customActionButton :stateConfig="stateConfig" :formDataconfig="formDataconfig2" :customBtn="businessFlowObj.customBtn"></customActionButton>
        </div>
        </el-tab-pane>
        <el-tab-pane label="限时处理" name="限时处理">
           <timeLimitedProcessing v-if="activeName == '限时处理'" :timeProcess="businessFlowObj.timeProcess"></timeLimitedProcessing>
        </el-tab-pane>
        <!-- <el-tab-pane label="页面设置" name="页面设置">
          <PageSetup></PageSetup>
        </el-tab-pane> -->
      </el-tabs>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
// import formItem from "../formItemSettings/formItem";
import { mapState } from "vuex";
import selectPeople from "../formItemSettings/selectPeople";
import selectRole from "../formItemSettings/selectRole";
import AddApp from "@/components/app-management/BasicInfo/AddApp";
import AddProcessingOperation from "./AddProcessingOperation";
import PageSetup from "./AddProcess/PageSetup";
import selectOrganization from "../formItemSettings/selectOrganization";
import selectDepartmentRole from "../formItemSettings/selectDepartmentRole";
import selectFormRole from "../formItemSettings/selectFormRole";
import selectOrgFormRole from "../formItemSettings/selectOrgFormRole";
import addformcondition from "./AddProcess/addformcondition";
import CompanyTransfer from "@/components/CompanyTransfer";
import timeLimitedProcessing from '@/components/app-management/processDefinition/AddProcess/timeLimitedProcessing/timeLimitedProcessing'
import customActionButton from '@/components/app-management/processDefinition/AddProcess/customActionButton'
import draggable from 'vuedraggable'
export default {
  name: "AddProcess",
  components: {
    AddProcessingOperation,
    PageSetup,
    AddApp,
    selectRole,
    selectPeople,
    selectOrganization,
    selectDepartmentRole,
    selectFormRole,
    selectOrgFormRole,
    addformcondition,
    CompanyTransfer,
    timeLimitedProcessing,
    customActionButton,
    draggable
  },
  props: {
    businessFlow: {
      type: Array,
      default: function () {
        return [];
      },
    },
    businessFlowObjData: {
      type: Object,
      default: function () {
        return {};
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
      type: "",
      index: "",
      operationObjData: null,
      microAppObjData: null,
      organizationData: null,
      formconditionData: {},
      isLastformconditionData: false,
      selectPeopleVisible: false,
        selectDefaultPeopleVisible:false,
      selectRoleVisible: false,
      addProcessVisible: false,
      AddAppVisible: false,
      organizationVisible: false,
      selectFormRoleVisible: false,
      selectDepartmentRoleVisible: false,
      selectOrgFormRoleVisible: false,
      addformconditionVisible: false,
      appNameShow: false,
      activeName: "流程设置",
      addProcessingOperationVisible: false,
      businessFlowObj: {
        id: "",
        name: "",
        isApp: "yes",
        microApp: {},
        recipient: {
          type: "0",
          role: [],
          person: [],
          model: "",
          userModels:[],
          handleType:"1",
          outState:"",
          companyModel:{
            model:"",
            labelModel:""
          },
          leader: "1",
          orgAndRole: [],
          company:[],
          dyncUserAndRole: [],
          cuserOrgAndRole: [],
          dyncOrgAndRole: [],
          conditions: [],
        },
        defaultRecipient:[],
        batchOperation: "yes",
        openTransfer:true,
        states: [],
        operation: [],
        timeProcess:{},
        customBtn:[]
      },
      tableData: [
        {
          date: "2016-05-03",
          name: "完成整改",
          province: "待验收",
          city: "否",
        },
      ],
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

      receiverType: ["角色", "指定人", "主管", "发起人自己", "表单内用户控件值","组织+角色","表单内用户控件值所属部门+角色","发起人所属部门+角色","表单内部门控件值+角色","","企业","表单内企业控件值"],
      companyRecipientVisible:false,

    };
  },
  filters: {
    conditionsfilters: function (data) {
      if (!data && !array.isArray(data)) return "";
      return data
        .map((value) => {
          return (
            "[" +
            value.name +
            "|" +
            (value.opt == "$gt"
              ? "大于"
              : value.opt == "$gte"
              ? "大于等于"
              : value.opt == "$numEq"
              ? "等于"
              : value.opt == "$lte"
              ? "小于等于"
              : value.opt == "$lt"
              ? "小于"
              : value.opt == "$eq"
              ? "等于"
              : value.opt == "$liket"
              ? "like"
              : "") +
            "|" +
            value.value +
            "]"
          );
        })
        .join("、");
    },
  },
  computed: {
    conditionsLength() {
      return this.businessFlowObj.recipient.conditions.length;
    },
    statesNameList: {
      get() {
        return this.businessFlowObj.states.map((statesObj) => statesObj.label);
      },
      set(val) {
        if (!Array.isArray(val)) return [];
        this.businessFlowObj.states = this.stateConfig.filter((value, index, array) => {
          return val.find((label) => {
            return value.value == label;
          });
        });
      },
    },
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
        if (this.businessFlowObj.microApp && this.businessFlowObj.microApp.appName) {
          return [this.businessFlowObj.microApp];
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
    companySelect() {
      if (!this.formDataconfig) return [];
      return this.formDataconfig.filter((value, index, array) => {
        return value.type == "company_select";
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
        } else if (obj.type == 11) {
          return this.modelName(obj.companyModel.model );
        }else if (obj.type == 10) {
          return obj.company.map((value) => value.name).join("、");
        }
      };
    },
    ...mapState({
      stateConfig: (state) => state.appManagement.stateConfig,
      formDataconfig: (state) => state.appManagement.formDataconfig,
      formDataconfig2:(state) => state.appManagement.formDataconfig2,
    }),
  },
  mounted() {
    
    this.setBusinessFlowObj();

    if (this.stateConfig.length == 1) {
      this.businessFlowObj.states = this.stateConfig;
    }
     
    // this.businessFlowStateConfig = JSON.parse(JSON.stringify(this.stateConfig));
    // this.businessFlowStateConfig.forEach((value, index, array) => {
    //   let statetObj = this.businessFlowObj.states.find(
    //     (value1) => value.label == value1.label
    //   );
    //   if (statetObj) {
    //     this.$set(array[index], "checked", true);
    //   } else {
    //     this.$set(array[index], "checked", false);
    //   }
    // });
  },
  methods: {
    changeCompanyModel(model){
      let company =  this.companySelect.find(value =>  value.model == model )
      
      if (company){
        this.businessFlowObj.recipient.companyModel.labelModel = company.label_model
      }
    },
    //选择公司回调
    getSelectCompany(company){
      this.businessFlowObj.recipient.company = company
      console.log( this.businessFlowObj.recipient ,company)
      this.companyRecipientVisible = false
    },
    formValue(item){
      let {value,key} = item
      if(Array.isArray(value)){
        return value.join('、')
      }else if(value instanceof Object){
        for(let k in value){
          if(k !== key){
            return value[k]
          }
        }
        // return value[key]
      }else{
        return value
      }
    },
    cleanDefaultRecipent(){
        this.businessFlowObj.defaultRecipient = [];
    },
    setBusinessFlowObj() {
      if (!this.businessFlowObjData || JSON.stringify(this.businessFlowObjData) == "{}")
        return;
      if(!this.businessFlowObj.customBtn){
         this.$set(this.businessFlowObj,'customBtn',[])
      }  
     
      Object.assign(this.businessFlowObj,this.businessFlowObjData)
    
      this.businessFlowObj.id = this.businessFlowObjData.id || "";
      this.businessFlowObj.name = this.businessFlowObjData.name || "";
      this.businessFlowObj.isApp = this.businessFlowObjData.isApp || "";
      this.businessFlowObj.microApp = this.businessFlowObjData.microApp || {};
      // this.businessFlowObj.recipient = this.businessFlowObjData.recipient || {};
      this.$set(this.businessFlowObj.recipient,"handleType",this.businessFlowObjData.recipient.handleType || "1")     
      this.$set(this.businessFlowObj.recipient,"outState",this.businessFlowObjData.recipient.outState || "")     
      this.$set(this.businessFlowObj.recipient,"userModels",this.businessFlowObjData.recipient.userModels || [])   
      this.businessFlowObj.defaultRecipient = this.businessFlowObjData.defaultRecipient || [];
      this.businessFlowObj.recipient.type =
        this.businessFlowObjData.recipient.type || "0";
      this.businessFlowObj.recipient.role = this.businessFlowObjData.recipient.role || [];
      this.businessFlowObj.recipient.person =
        this.businessFlowObjData.recipient.person || [];
      this.businessFlowObj.recipient.model =
        this.businessFlowObjData.recipient.model || "";
      this.businessFlowObj.recipient.leader =
        this.businessFlowObjData.recipient.leader || "1";
      this.businessFlowObj.recipient.orgAndRole =
        this.businessFlowObjData.recipient.orgAndRole || [];
      this.businessFlowObj.recipient.dyncUserAndRole =
        this.businessFlowObjData.recipient.dyncUserAndRole || [];
      this.businessFlowObj.recipient.cuserOrgAndRole =
        this.businessFlowObjData.recipient.cuserOrgAndRole || [];
      this.businessFlowObj.recipient.dyncOrgAndRole =
        this.businessFlowObjData.recipient.dyncOrgAndRole || [];
      this.businessFlowObj.recipient.conditions =
        this.businessFlowObjData.recipient.conditions || [];
      this.businessFlowObj.recipient.company = this.businessFlowObjData.recipient.company || [];
      this.businessFlowObj.recipient.companyModel = this.businessFlowObjData.recipient.companyModel || {model:"",labelModel:""}
      
      this.businessFlowObj.batchOperation =
        this.businessFlowObjData.batchOperation || "yes";
      this.businessFlowObj.states = this.businessFlowObjData.states || [];
      // this.$set(this.businessFlowObj, "states", this.businessFlowObj.states);
      this.businessFlowObj.customBtn = this.businessFlowObjData.customBtn 
      
      this.businessFlowObj.operation = this.businessFlowObjData.operation || [];

      if(!this.businessFlowObj.timeProcess){
        this.$set(this.businessFlowObj,'timeProcess',{})  
      }
      
    },
    onSubmit() {
      // this.businessFlow.push(this.KHUtils.clone(this.businessFlowObj));
      // this.$emit("update:businessFlow", this.businessFlow);
      if (!this.businessFlowObj.name) return this.error("请输入本环节名称");
      if (!this.businessFlowObj.microApp.appName) return this.error("请填写应用名称");
      if (!this.businessFlowObj.isApp) return this.error("请选择是否单独设置应用");
      if (!this.businessFlowObj.recipient.type) return this.error("请选择本环节接收人");
      if (this.businessFlowObj.defaultRecipient.length == 0 ) return this.error("请选择本环节默认接收人");
      if (!this.businessFlowObj.batchOperation)
        return this.error("请选择是否支持批量操作");
      if (this.businessFlowObj.states.length == 0) return this.error("请选择状态转换");
      if (this.businessFlowObj.operation.length == 0) return this.error("请添加处理操作");
      this.$emit("onBusinessFlow", this.businessFlowObj);
      console.log(this.businessFlowObj);
      this.dialogFormVisible = false;
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
    OrganizationData(e) {
      this.businessFlowObj.recipient.orgAndRole.push(e);
    },
    updataProcessingOperation(row, index) {
      this.type = "updata";
      this.index = index;
      this.operationObjData = row;
      this.addProcessingOperationVisible = true;
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
    onOperationObj(e) {
      if (this.type == "updata") {
        this.$set(this.businessFlowObj.operation, this.index, e);
        // this.businessFlowObj.operation[this.index] = e;
      } else {
        this.businessFlowObj.operation.push(e);
      }
    },
    radioChange() {
      let recipient = this.businessFlowObj.recipient;
      recipient.model = "";
      recipient.leader = "";
      recipient.role = [];
      recipient.person = [];
      recipient.orgAndRole = [];
      recipient.dyncUserAndRole = [];
      recipient.cuserOrgAndRole = [];
      recipient.dyncOrgAndRole = [];
      recipient.conditions = [];
      recipient.company = [];
      recipient.companyModel = {model:"",labelModel:""}
      recipient.handleType = "1"
      recipient.userModels = []
      if (recipient.type == 9) {
        // recipient.conditions.push({
        //   conditions: [],
        //   type: "3",
        //   leader: "",
        //   model: "",
        //   role: [],
        //   person: [],
        // });
      }
    },
  },
};
</script>

<style lang="scss" scope>
.AddProcess {
  height: 70vh;
  box-sizing: border-box;
  position: relative;
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
  .el-dialog__body {
    padding: 10px 20px;
    height: calc(100% - 116px);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
  }
  .BM-18 {
    margin-bottom: 18px;
  }
  .selected_list {
    margin-bottom: 20px;
    line-height: 30px;
    .border {
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
      flex: 1;
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
