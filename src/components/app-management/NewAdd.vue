<template>
  <div>
    <el-dialog
      custom-class="NewAdd"
      :modal="false"
      width="70vw"
      title="新增"
      :visible.sync="dialogFormVisible"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-row>
        <el-col
          v-for="(item, index) in stepsList"
          :key="index"
          :span="24 / stepsList.length"
        >
          <div
            class="step-box"
            :class="{ 'step-box-click': stepsActive == index }"
            @click="setStepsActive(index)"
          >
            <span class="step-icon">{{ item.icon }}</span>
            <span class="step-text">{{ item.text }}</span>
          </div>
        </el-col>
      </el-row>
      <div></div>
      <div class="step-content">
        <!-- <BasicInfo :config.sync="AppManagementConfig"></BasicInfo> -->
        <BasicInfo
          :formIdData.sync="AppManagementConfig.formId"
          :formNameData.sync="AppManagementConfig.formName"
          :appNameData.sync="AppManagementConfig.appName"
          :statesData.sync="AppManagementConfig.states"
          @changeFrom="initialization"
          :isSelectForm.sync="isSelectForm"
          v-show="stepsActive == 0"
        ></BasicInfo>
        <processDefinition
          :config.sync="AppManagementConfig"
          :newFlowList.sync="AppManagementConfig.stateFlow.newFlow"
          :businessFlowList.sync="AppManagementConfig.stateFlow.businessFlow"
          v-show="stepsActive == 1"
        ></processDefinition>
        <CirculationSettingindex
          :config="AppManagementConfig"
          v-show="stepsActive == 2"
        ></CirculationSettingindex>
      </div>
      <div slot="footer" class="dialog-footer" v-show="stepsActive == 2">
        <el-button type="primary" @click="dialogVisible = true">部署</el-button>
      </div>
    </el-dialog>

    <el-dialog title="提示" top="35vh" :visible.sync="dialogVisible" width="400px">
      <span>您是否需要更新配置？</span>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="deploySpecialServiceHttp">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import { mapMutations } from "vuex";
import processDefinition from "./processDefinition/index";
import CirculationSettingindex from "@/components/app-management/CirculationSetting/CirculationSettingindex";
import BasicInfo from "./BasicInfo/index";
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    circulationId: {
      type: String | Number,
      default: "",
    },
  },
  components: {
    BasicInfo,
    processDefinition,
    CirculationSettingindex,
  },
  data() {
    return {
      id: this.circulationId || "",
      stepsActive: 0,
      stepsList: [
        { icon: 1, text: "基本信息" },
        { icon: 2, text: "流程定义" },
        { icon: 3, text: "流转设定" },
      ],
      addFillInformationVisible: false,
      addConditionGroupVisible: false,
      dialogVisible: false,
      AppManagementConfig: {
        formId: "",
        formName: "",
        appName: "",
        states: [],
        stateFlow: {
          newFlow: [],
          businessFlow: [],
        },
      },
      isSelectForm: false,
      ishttpEnd: true,
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
  },
  created() {
    this.querySecialServiceConfByIdHttp();
  },
  methods: {
    async deploySpecialServiceHttp() {
      let { deploySpecialService } = this.khConfig.api;
      let res = await this.$Get(deploySpecialService + "/" + this.id);
      if (res == "error") return;
      if (res.errMsg == "成功") {
        this.$notify({
          title: "成功",
          message: "部署成功",
          type: "success",
        });
        this.dialogVisible = false;
      }
    },
    async saveBasicInfoHttp() {
      if (!this.ishttpEnd) return;
      this.ishttpEnd = false;
      let { saveBasicInfo } = this.khConfig.api;
      let params = {
        id: this.id,
        formId: this.AppManagementConfig.formId,
        formName: this.AppManagementConfig.formName,
        appName: this.AppManagementConfig.appName,
        states: this.AppManagementConfig.states,
      };
      let res = await this.$Post(saveBasicInfo, params);
      if (res) this.ishttpEnd = true;
      if (res == "error") {
        return false;
      } else {
        this.id = res.id;

        return true;
      }
    },
    async saveFlowSetHttp() {
      if (!this.ishttpEnd) return;
      let { saveFlowSet } = this.khConfig.api;
      let res = await this.$Post(saveFlowSet, {
        id: this.id,
        stateFlow: this.AppManagementConfig.stateFlow,
      });
      if (res) this.ishttpEnd = true;
      if (res == "error") {
        return false;
      } else {
        this.$notify({
          title: "成功",
          message: "保存成功",
          type: "success",
        });
        return true;
      }
    },
    async querySecialServiceConfByIdHttp() {
      if (!this.id) return;
      const { querySecialServiceConfById } = this.khConfig.api;
      let res = await this.$Get(querySecialServiceConfById + "/" + this.id);
      if (res == "error") return;
      var serviceConf = JSON.parse(res.specialServiceConf.serviceConf);

      if (!serviceConf.stateFlow) {
        serviceConf.stateFlow = {
          newFlow: [],
          businessFlow: [],
        };
      }

      this.AppManagementConfig = serviceConf;

      // console.log(res, JSON.parse(res.specialServiceConf.serviceConf));
      this.setStateConfig(this.AppManagementConfig.states);
      this.getFormConfHttp();
    },

    async getFormConfHttp() {
      if (!this.AppManagementConfig.formId) return;
      const { getFormConf } = this.khConfig.api;
      let res = await this.$Get(getFormConf + "/" + this.AppManagementConfig.formId);
      if (res == "error") return;
      let formConf = res.formConf;
      (this.AppManagementConfig.formId = formConf.formId),
        (this.AppManagementConfig.formName = formConf.formName),
        this.setFormDataconfig(JSON.parse(formConf.formMeta).list);
      this.isSelectForm = false;
    },
    async setStepsActive(index) {
      if (this.stepsActive == 0) {
        if (!this.AppManagementConfig.formId) return this.error("请选择表单");
        if (!this.AppManagementConfig.formName) return this.error("请选择表单");
        if (!this.AppManagementConfig.appName) return this.error("请输入应用名称");
        if (this.AppManagementConfig.states.length == 0)
          return this.error("请添加状态关联");

        let issuccess = await this.saveBasicInfoHttp();
        if (issuccess) {
          this.$notify({
            title: "成功",
            message: "添加成功",
            type: "success",
          });
        }
        this.querySecialServiceConfByIdHttp();
      } else if (this.stepsActive == 1) {
        // ;
        // if (this.AppManagementConfig.stateFlow.newFlow.length == 0)
        //   return this.error("请添加新增");
        // if (this.AppManagementConfig.stateFlow.businessFlow.length == 0)
        let issuccess = await this.saveFlowSetHttp();
        if (!issuccess) return;
        this.querySecialServiceConfByIdHttp();
      } else if (this.stepsActive == 2) {
          this.querySecialServiceConfByIdHttp();
      }
      if (index == 2) {
        this.querySecialServiceConfByIdHttp();
      }
      if (index) {
        this.isSelectForm = false;
      }
      this.stepsActive = index;
    },
    error(message) {
      this.$notify.error({
        title: "提示",
        message: message,
      });
    },
    initialization() {
      this.AppManagementConfig.stateFlow.newFlow = [];
      this.AppManagementConfig.stateFlow.businessFlow = [];
    },
    ...mapMutations({
      setFormDataconfig: "appManagement/setFormDataconfig",
      setStateConfig: "appManagement/setStateConfig",
    }),
  },
};
</script>

<style lang="scss" scope>
.NewAdd {
  height: 70vh;
  box-sizing: border-box;
  position: relative;
  box-shadow: 0 0 40px #00000050;
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
    padding-top: 0;
    height: calc(100% - 110px);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
    margin: 0;
  }
  .step-box {
    display: flex;
    justify-content: center;
    align-items: center;
    background: #f4f7fa;
    padding: 10px 5px;
    color: #bfbfbf;
    margin-top: 10px;
    cursor: pointer;
    .step-icon {
      width: 40px;
      height: 40px;
      border-radius: 50%;
      font-size: 30px;
      display: flex;
      background: #bfbfbf;
      color: #ffffff;
      justify-content: center;
      align-items: center;
      margin-right: 10px;
    }
    .step-text {
      font-size: 18px;
      color: #bfbfbf;
      font-weight: bold;
    }
  }
  .step-box-click {
    .step-icon {
      background: #1296db;
    }
    .step-text {
      color: #1296db;
    }
  }
  .step-content {
    height: calc(100% - 70px);
    position: relative;
    padding-top: 10px;
    // overflow: auto;
    box-sizing: border-box;
  }
  .BM-5 {
    margin-bottom: 5px;
  }
  .BM-18 {
    margin-bottom: 18px;
  }
}
</style>
