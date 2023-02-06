<template>
  <div>
    <el-dialog
      width="700px"
      top="20vh"
      title="添加操作"
      custom-class="AddConditionGroup"
      :visible.sync="dialogFormVisible"
      :modal="false"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-form label-width="auto" ref="form">
        <el-form-item label="填写信息：">
          <el-select v-model="writeInfoObj" value-key="name" placeholder="请选择填写信息">
            <el-option
              :label="item.name"
              :value="item"
              v-for="(item, index) in writeInfo"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <!-- content -->
        <div class="add-group" v-show="writeInfoObj" @click="addGroup">
          <i class="el-icon-plus"></i>
          <span>新增条件组</span>
        </div>

        <div class="form-box" v-for="(conditionItem, index) in condition" :key="index">
          <i class="delete-box el-icon-close" @click="condition.splice(index, 1)"></i>
          <h4>条件组{{ index + 1 }}</h4>
          <el-form-item label="选择字段">
            <el-select
              :value="{
                key: conditionItem.key,
                name: conditionItem.name,
                type: conditionItem.type,
              }"
              @input="
                conditionItem.key = $event.key;
                conditionItem.name = $event.name;
                conditionItem.type = $event.controlType;
              "
              value-key="key"
              @change="setformSelec($event, conditionItem)"
              placeholder="请选择字段"
            >
              <el-option
                :label="item.name"
                :value="item"
                v-for="(item, index) in selectFields"
                :key="index"
              >
              </el-option>
            </el-select>
          </el-form-item>

          <el-form-item label="条件">
            <el-select v-model="conditionItem.opt">
              <div v-if="isNumber(boxConfig(conditionItem.key, conditionItem.subKey))">
                <el-option label="大于" value="$gt"></el-option>
                <el-option label="大于等于" value="$gte"></el-option>
                <el-option label="等于" value="$numEq"></el-option>
                <el-option label="小于等于" value="$lte"></el-option>
                <el-option label="小于" value="$lt"></el-option>
              </div>
              <div v-else>
                <el-option label="等于" value="$eq"></el-option>
                <el-option label="like" value="$like"></el-option>
              </div>
            </el-select>
          </el-form-item>
          <el-form-item label="条件值">
            <formItem
              :box="boxConfig(conditionItem.key, conditionItem.subKey)"
              v-model="conditionItem.value"
              :models.sync="models"
            ></formItem>
            <!-- <el-input v-model="form.value"></el-input> -->
          </el-form-item>
        </div>
      </el-form>

      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
import formItem from "../formItemSettings/formItem";
export default {
  components: {
    formItem,
  },
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    writeInfo: {
      type: Array,
      default: function () {
        return [];
      },
    },
    contentFormConfig: {
      type: Array,
      default: function () {
        return [];
      },
    },
    data: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      models: {},
      condition: this.data.condition || [],
      writeInfoObj: "",
    };
  },
  computed: {
    ...mapState({
      formDataconfig: (state) => state.appManagement.formDataconfig,
    }),
    dialogFormVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
    },
    getKey() {
      return (value) => {
        if (!value && !typeof value === "object") return;
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
    boxConfig() {
      return function (key, subKey) {
        if (subKey) {
          let formDataObj = this.formDataconfig.find((value, index, array) => {
            return value.key == subKey;
          });

          return formDataObj.tableColumns.find((value, index, array) => {
            return this.getKey(value) == key;
          });

        } else if (key) {
          return this.formDataconfig.find((value, index, array) => {
            return this.getKey(value) == key;
          });
        } else {
          return {};
        }
      };
    },
    isNumber() {
      return function (boxConfig) {
        if (!boxConfig) return;
        if (
          boxConfig.type == "input_number" ||
          boxConfig.type == "input_int" ||
          boxConfig.type == "input_long" ||
          boxConfig.type == "number"
        ) {
          return true;
        } else {
          return false;
        }
      };
    },
    selectFields() {
      let selectFieldList = [];
      if (this.writeInfoObj.parent) {
        this.writeInfoObj.parent.content.forEach((value) => {
          selectFieldList.push(value);
        });
      }
      if (this.writeInfoObj.child) {
        this.writeInfoObj.child.forEach((child) => {
          child.content.forEach((value) => {
            selectFieldList.push({
              key: value.key,
              name: value.name,
              type: value.type,
              subKey: child.subKey,
            });
          });
        });
      }
      return selectFieldList.filter((value) => {
        let formData =
          this.formDataconfig.find((formData) => {
            if(formData.type == 'm_data_ref' ||  formData.type == 'm_data_select' || formData.type == 'm_org_select' || formData.type == 'm_user_select' || formData.type == 'm_role_select' || formData.type == 'm_company_select' || formData.type == 'm_dic_select' ){
              return false;
            }else{
              return formData.model == value.key;
            }
          }) 
        if(!formData) return false;
        if (
          
          formData.type == "image_upload" ||
          formData.type == "file_upload" ||
          formData.type == "region_select" ||
          formData.type == "gis_select" ||
          formData.type == "gis_select" ||
          formData.type == "table"
        ) {
          return false;
        } else {
          return true;
        }
      });
    },
  },
  mounted() {
    if (this.data.writeInfo) {
      this.writeInfoObj = this.writeInfo.find((value) => {
        return (value.name = this.data.writeInfo);
      });
    }
    // this.condition.forEach((value, index, array) => {
    //   this.$set(value, "boxConfig", "");
    // });
  },
  methods: {
    setformSelec(e, form) {
      // this.$set(form, "boxConfig", e);
      // form.key = e.model;
      // form.name = e.name;
      if (e.subKey) {
        this.$set(form, "subKey", e.subKey);
      }
      form.opt = "";
      form.value = "";
    },
    addGroup() {
      this.condition.push({
        key: "",
        name: "",
        opt: "",
        value: "",
        type: "",
      });
    },
    onSubmit() {
      this.$emit("onProcessObj", {
        writeInfo: this.writeInfoObj.name,
        condition: this.condition,
        stateConver: this.data.stateConver,
      });
      this.dialogFormVisible = false;
    },
  },
};
</script>

<style lang="scss" scope>
.AddConditionGroup {
  height: 60vh;
  .el-dialog__body {
    padding-top: 0;
    height: calc(100% - 116px);
    box-sizing: border-box;
    position: relative;
    overflow: auto;
  }
  .add-group {
    width: 80%;
    margin: 15px auto;
    border-radius: 5px;
    line-height: 35px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: #fafbfb;
    box-shadow: 0 0 5px #b6b6b6;
    color: #026bfe;
    i {
      margin-right: 10px;
    }
  }
  .form-box {
    position: relative;
    background: #f2f2f2;
    padding: 10px;
    box-sizing: border-box;
    margin-bottom: 10px;
    .delete-box {
      position: absolute;
      right: 10px;
      top: 10px;
      font-size: 15px;
    }
    h4 {
      margin: 10px;
    }
    .el-form-item {
      margin-bottom: 10px;
    }
    .el-input,
    .el-select {
      width: 100%;
    }
  }
}
</style>
