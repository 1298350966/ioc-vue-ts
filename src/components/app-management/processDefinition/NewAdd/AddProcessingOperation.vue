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
    <el-form label-width="auto">
      <el-form-item label="新增填写内容：" required>
        <div class="formData-box">
          <span
            @click="setContentList(item, index, formDataList)"
            v-for="(item, index) in formDataList"
            :key="index"
            :class="{ 'checked-click': item.checked || false }"
            >{{ item.name }}
            <i v-show="item.checked || false" class="el-icon-check"></i>
          </span>
        </div>
      </el-form-item>

      <h4>操作流程</h4>
      <el-link
        type="primary"
        @click="
          addConditionGroupVisible = true;
          type = 'add';
          conditionData = {};
        "
        >添加条件</el-link
      >
      <AddConditionGroup
        v-if="addConditionGroupVisible"
        :visible.sync="addConditionGroupVisible"
        :content="contentData"
        :contentFormConfig="contentFormConfig"
        :data="conditionData"
        @onProcessObj="onProcessObj"
      ></AddConditionGroup>
      <div
        class="operation-process-box"
        v-for="(processItem, index) in process"
        :key="index"
      >
        <div class="operationItem">
          <el-link
            class="link"
            type="primary"
            :underline="false"
            @click="
              conditionData = processItem;
              addConditionGroupVisible = true;
              type = 'updata';
            "
            >【添加条件】</el-link
          >
        </div>

        <div class="operationItem">
          <el-form-item label="状态转换：">
            <el-select
              value-key="label"
              v-model="processItem.stateConver"
              placeholder="请选择状态转换"
            >
              <el-option
                v-for="(item, index) in stateConfig"
                :key="index"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>
        <i @click="process.splice(index, 1)" class="el-icon-delete delete"></i>
      </div>
      <div class="operation-process-box">
        <div class="operationItem">
          <el-link class="link" type="danger" :underline="false"
            >【默认状态流转】</el-link
          >
        </div>

        <div class="operationItem">
          <el-form-item label="状态转换：">
            <el-select
              value-key="label"
              v-model="defaultProcess.stateConver"
              placeholder="请选择状态转换"
            >
              <el-option
                v-for="(item, index) in stateConfig"
                :key="index"
                :label="item.label"
                :value="item"
              ></el-option>
            </el-select>
          </el-form-item>
        </div>

        <div class="delete"></div>
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
import { mapState, mapMutations } from "vuex";
import AddFillInformation from '@/components/app-management/processDefinition/AddProcessingOperation/AddFillInformation'
import AddConditionGroup from "./AddConditionGroup";
export default {
  components: {
    AddFillInformation,
    AddConditionGroup,
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
    content: {
      type: Array,
      default: function () {
        return [];
      },
    },
    processData: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },

  data() {
    return {
      type: "",
      index: 0,
      conditionData: {},
      contentList: [],
      process: [],
      // form: {
      //   condition: [],
      //   stateConver: {},
      // },
      defaultProcess: {
        condition: [],
        stateConver: {},
      },
      addFillInformationVisible: false,
      addConditionGroupVisible: false,
      contentFormConfig: [],
      formDataList: [],
      contentData: this.content || [],
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

    ...mapState({
      stateConfig: (state) => state.appManagement.stateConfig,
      formDataconfig: (state) => state.appManagement.formDataconfig,
    }),
    getKey() {
      return (value) => {
        if (
          value.type == "data_select" ||
          value.type == "org_select" ||
          value.type == "user_select" ||
          value.type == "role_select" ||
          value.type == "company_select" ||
          value.type == "dic_select"
        ) {
          // return value.label_model;
          return value.model;
        } else {
          return value.model;
        }
      };
    },
    // formDataList: {
    //   get() {
    //     return this.formDataconfig;
    //   },
    //   set(val) {
    //     console.log(val);
    //     this.setStateConfig(val);
    //   },
    // },
  },
  mounted() {
    // this.process.pop();
    // this.$delete(this.process, this.process.length - 1, 0);

    if (this.processData && this.processData.length >= 1) {
      this.process = this.processData.slice(0, -1) || this.process;
      this.defaultProcess =
        this.processData[this.processData.length - 1] || this.defaultProcess;
    }
    // console.log(this.formDataconfig);
    // if (Array.isArray(this.stateConfig)) {
    //   this.defaultProcess.stateConver = this.stateConfig[0];
    // }


    this.formDataList = JSON.parse(JSON.stringify(this.formDataconfig));
    console.log(this.content);
    if (Array.isArray(this.content)) {
      this.formDataList.forEach((formconfig, i, formDataList) => {
        let contentObj = this.content.find((value) => formconfig.model == value.key);

        if (contentObj) {
          // .checked = true;
          this.$set(formDataList[i], "checked", true);
        } else {
          // formDataList[i].checked = false;
          this.$set(formDataList[i], "checked", false);
        }
      });
    }
  },
  methods: {
    setContentList(item, index, formDataList) {
      console.log(item);
      if (item.checked) {
        this.$set(item, "checked", false);
        this.$set(formDataList, index, item);
        // this.content = this.content.filter((value) => {
        //   return value.key != item.model;
        // });
      } else {
        this.$set(item, "checked", true);
        this.$set(formDataList, index, item);
        // this.content.push({ key: item.model, name: item.name, formType: item.type });
        // this.contentFormConfig.push(item);
      }
      this.contentData = formDataList
        .filter((value) => value.checked == true)
        .map((value) => {
          return { key: this.getKey(value), name: value.name, controlType: value.type };
        });
      // item.checked = !item.checked;
      // this.contentList.push(item);
    },
    onSubmit() {
      // this.process.push(this.form);
      // console.log(, this.process);
      // this.content = [...this.contentData];
      // this.$emit("updata:content", this.content);
      this.process.push(this.defaultProcess);
      // this.processData
      // this.$set(this.processData, this.processData.length, this.defaultProcess);
      console.log(this.contentData, this.process);
      this.$emit("onContent", this.contentData);
      this.$emit("onProcessData", this.process);
      this.dialogFormVisible = false;
    },
    onProcessObj(e) {
      if (this.type == "updata") {
        this.process[this.index] = e;
      } else {
        this.process.push(e);
      }
      this.conditionData = {};
    },
    ...mapMutations({
      setStateConfig: "appManagement/setStateConfig",
    }),
  },
};
</script>

<style lang="scss" scope>
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
    position: relative;
    .operationItem {
      flex: 1;
      display: flex;
      justify-content: center;
    }
    .delete {
      flex: 0.5;
      // position: absolute;
      text-align: right;
      margin-right: 10px;
      justify-content: flex-end;
    }
    .link {
      // margin-bottom: 18px;
    }
    .el-form-item {
      margin-bottom: 0;
    }
  }
  .form-item-box {
    margin: 7px 0;
    width: 100%;
    background: #f2f2f2;
    padding: 10px 8px;
    border-radius: 5px;
    .el-form-item__content {
      white-space: nowrap;
      overflow: hidden;

      text-overflow: ellipsis;
    }
  }
  .formData-box {
    display: flex;
    flex-flow: wrap;
    align-items: center;
    span {
      padding: 2px 20px;
      background: #f2f2f2;
      margin-right: 10px;
      border-radius: 5px;
      margin-bottom: 10px;
      position: relative;
      .el-icon-check {
        position: absolute;
        width: 15px;
        height: 15px;
        display: flex;
        align-items: center;
        justify-content: center;
        right: 0px;
        bottom: 0px;
        border-radius: 50%;
        font-weight: bold;
        color: #ffffff;
        font-size: 10px;
        background: #008040;

        box-shadow: 1px 1px 5px 2px #00000010;
        &::before {
          transform: scale(0.9);
        }
      }
    }
  }
  .checked-click {
    color: #ffffff;
    background: rgb(250, 103, 103) !important;
  }
}
</style>
