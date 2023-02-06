<template>
  <div class="BasicInfo">
    <!-- <div class="tilte-box">
      <h4 class="ML20">表单内容</h4>
    </div>
    <div class="">
      <span>隐患描述</span>
    </div> -->

    <el-form label-width="80px">
      <el-form-item label="应用名称">
        <el-input
          style="width: 320px"
          v-model="appName"
          placeholder="请输入应用名称"
          clearable
          size="small"
        />
      </el-form-item>
      <el-form-item label="表单内容">
        <div class="tilte-box">
          <el-link
            class="ML-20"
            icon="el-icon-s-promotion"
            type="primary"
            :underline="false"
            @click="selectFormVisible = true"
            v-show="isSelectForm || !formIdData"
            >从表单中选取</el-link
          >
          <el-link
            v-show="isSelectForm || !formIdData"
            class="ML-20"
            icon="el-icon-circle-plus-outline"
            type="primary"
            :underline="false"
            @click="$refs.formDesign.handleAdd()"
            >新建</el-link
          >
          <el-link
            class="ML-20"
            icon="el-icon-refresh"
            type="primary"
            :underline="false"
            @click="stateAssociationVisible = true"
            >状态设置</el-link
          >
        </div>
        <div class="form-list-box">
          <span
            class="form-tag"
            @click="$refs.formDesign.handleEdit({ formId: formId })"
            >{{ formName }}</span
          >
        </div>
      </el-form-item>
    </el-form>
    <div class="form-design-dialog">
      <form-design-dialog
        ref="formDesign"
        @onFormId="getReportConfHttp"
      ></form-design-dialog>
    </div>

    <SelectForm
      v-if="selectFormVisible"
      :visible.sync="selectFormVisible"
      @onData="SelectFormoData"
    ></SelectForm>
    <!-- <AddApp
      :visible.sync="addProcessVisible"
      @onData="microApp.push($event)"
    ></AddApp> -->
    <StateAssociation
      v-if="stateAssociationVisible"
      :states.sync="states"
      :visible.sync="stateAssociationVisible"
    ></StateAssociation>
  </div>
</template>

<script>
import SelectForm from "./SelectForm";
// import AddApp from "./AddApp";
import StateAssociation from "./StateAssociation";
import FormDesignDialog from '@/components/app-management/BasicInfo/FormDesignDialog'
import { mapMutations } from "vuex";
export default {
  components: { SelectForm, StateAssociation, FormDesignDialog },
  props: ["formIdData", "formNameData", "appNameData", "statesData", "isSelectForm"],

  data() {
    return {
      NewFormVisible: false,
      selectFormVisible: false,
      // addProcessVisible: false,
      stateAssociationVisible: false,
      form: {},
      formDataconfig: [],
      // AppManagementConfig:this.config,
      // formId: "",
      // formName: "",
      // appName: "",
      // states: [],
    };
  },
  computed: {
    formId: {
      get() {
        return this.formIdData;
      },
      set(val) {
        this.$emit("update:isSelectForm", true);
        this.$emit("update:formIdData", val);
      },
    },
    formName: {
      get() {
        return this.formNameData;
      },
      set(val) {
        console.log(val);
        this.$emit("update:isSelectForm", true);
        this.$emit("update:formNameData", val);
      },
    },
    appName: {
      get() {
        return this.appNameData;
      },
      set(val) {
        this.$emit("update:appNameData", val);
      },
    },
    states: {
      get() {
        return this.statesData;
      },
      set(val) {
        this.setStateConfig(val);
        this.$emit("update:statesData", val);
      },
    },
  },
  methods: {
    SelectFormoData(arr) {
      if (typeof arr == "object") {
        this.formId = arr.formId;
        this.formName = arr.formName;

        this.setFormDataconfig(arr.list);
        this.$emit("changeFrom");
      }
    },
    async getReportConfHttp(formId) {
      const { getFormConf } = this.khConfig.api;
      let res = await this.$Get(getFormConf + "/" + formId);
      if (res == "error") return;

      this.formId = res.formConf.formId;
      this.formName = res.formConf.formName;

      this.setFormDataconfig(JSON.parse(res.formConf.formMeta).list);
    },
    ...mapMutations({
      setFormDataconfig: "appManagement/setFormDataconfig",
      setStateConfig: "appManagement/setStateConfig",
    }),
  },
};
</script>

<style lang="scss" scope>
@import "@/assets/style/form/form-design.scss";
.BasicInfo {
  position: relative;
  box-sizing: border-box;

  .tilte-box {
    display: flex;
    align-items: center;

    h4,
    .el-link {
      margin-right: 40px;
      i {
        font-size: 22px;
      }
    }
  }
  .form-list-box {
    display: flex;
    flex-flow: wrap;
    .form-tag {
      cursor: pointer;
      background: #f6f6f6;
      border-radius: 5px;
      padding: 3px 15px;
      margin: 5px 10px 5px 0px;
    }
  }
  .header-table {
    background: #f2f2f2;
  }
  .el-icon-edit {
    font-size: 15px;
    margin-left: 10px;
  }
}
.custom-dialog {
  .form-design-step :hover {
    cursor: pointer;
  }
  .el-dialog__body {
    height: calc(100% - 45px);
    //padding: 10px 10px;
    padding: 0;
    overflow: hidden;
  }
  //height: 80%;

  .el-dialog__header {
    padding: 0 0 0;
    background-color: #0b1532;
  }

  .el-dialog__title {
    font-size: 20px;
    color: #fff;
    position: absolute;
    z-index: 1;
    top: 7px;
    padding-left: 5px;
    width: 270px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .el-dialog__footer {
    border-top: 0 solid #2b3551;
    background-color: #0b1532 !important;
    padding: 8px 20px 5px;
  }

  .el-dialog__headerbtn {
    position: absolute;
    top: 6px;
    right: 20px;
    padding: 0;
    background: 0 0;
    border: none;
    outline: 0;
    cursor: pointer;
    font-size: 16px;
    z-index: 1;
  }

  // .custom-box > .el-form-item__label {
  //   color: #fff;
  // }

  .customDivClass {
    border: 1px solid #dcdfe6;
    padding-left: 5px;
    border-radius: 4px;
    /*min-height: 36px;*/
    /*max-height: 148px;*/
    width: 100%;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-box-orient: vertical;
    -webkit-line-clamp: 10; // 控制显示的行数,如果超过以省略号的形式显示
  }

  .customDivClass1 {
    border: 1px solid #dcdfe6;
    padding-left: 5px;
    border-radius: 4px;
    width: 100%;
    height: 36px;
  }
  .custom-box {
    height: calc(100% - 40px);
    //height: 100%;
    background: #2b3551;
    /*overflow: hidden;*/
  }
}
</style>
