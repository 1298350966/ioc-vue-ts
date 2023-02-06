<template>
  <div>
    <!-- <el-dialog
      width="700px"
      top="20vh"
      :modal="false"
      title="添加操作"
      custom-class="AddConditionGroup"
      :visible.sync="dialogFormVisible"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    > -->
    <div class="add-group" @click="addGroup">
      <i class="el-icon-plus"></i>
      <span>新增条件组</span>
    </div>

    <div class="form-box" v-for="(form, index) in condition" :key="index">
      <i class="delete-box el-icon-close" @click="condition.splice(index, 1)"></i>
      <h4>条件组{{ index + 1 }}</h4>
      <el-form label-position="top" class="text">
        <el-form-item label="选择字段">
          <el-select
            :value="{ key: form.key, name: form.name, form: form.type }"
            @input="
              form.key = $event.key;
              form.name = $event.name;
              form.type = $event.type;
            "
            value-key="key"
            @change="setformSelec($event, form)"
            placeholder="请选择字段"
          >
            <el-option
              :label="item.name"
              :value="item"
              v-for="(item, index) in contentconfig"
              :key="index"
            >
            </el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="条件">
          <el-select v-model="form.opt">
            <div v-if="isNumber(boxConfig(form.key))">
              <el-option label="大于" value="$gt"></el-option>
              <el-option label="大于等于" value="$gte"></el-option>
              <el-option label="等于" value="$numEq"></el-option>
              <el-option label="小于等于" value="$lte"></el-option>
              <el-option label="小于" value=" $lt"></el-option>
            </div>
            <div v-else>
              <el-option label="等于" value="$eq"></el-option>
              <el-option label="like" value="$like"></el-option>
            </div>
          </el-select>
        </el-form-item>

        <el-form-item label="条件值" >
          <formItem
            :box="boxConfig(form.key)"
            v-model="form.value"
            :models.sync="models"
          ></formItem>
          <!-- <el-input v-model="form.value"></el-input> -->
        </el-form-item>
      </el-form>
    </div>

    <!-- <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div> -->
    <!-- </el-dialog> -->
  </div>
</template>

<script>
import { mapState } from "vuex";
import formItem from "../../formItemSettings/formItem";
export default {
  components: {
    formItem,
  },
  props: {
    conditions: {
      type: Array,
      default: function () {
        return [];
      },
    },
    visible: {
      type: Boolean,
      default: false,
    },
    content: {
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
      //   condition: this.data.condition || [],
    };
  },
  computed: {
    ...mapState({
      formDataconfig: (state) => state.appManagement.formDataconfig,
    }),
    contentconfig() {
      let formData = this.formDataconfig.filter((value, index, array) => {
        // let formData =
        //   this.formDataconfig.find((formData) => {
        //     return formData.model == value.key;
        //   }) || {};
        if (
          value.type == 'm_data_ref' ||  value.type == 'm_data_select' || value.type == 'm_org_select' || value.type == 'm_user_select' || value.type == 'm_role_select' || value.type == 'm_company_select' ||value.type == 'm_dic_select'||
          value.type == "image_upload" ||
          value.type == "file_upload" ||
          value.type == "region_select" ||
          value.type == "gis_select" ||
          value.type == "gis_select" ||
          value.type == "table" ||
          value.type == "grid" ||
          value.type == "signature"
        ) {
          return false;
        } else {
          return true;
        }
      });

      return formData.map((value) => {
        return { key: value.model, name: value.name, type: value.type };
      });
    },
    boxConfig() {
      return function (key) {
        if (key) {
          return this.formDataconfig.find((value, index, array) => {
            return value.model == key;
          });
        } else {
          return {};
        }
      };
    },
    dialogFormVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
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
    condition: {
      get() {
        return this.conditions || [];
      },
      set(val) {
        return this.$emit("update:conditions", val);
      },
    },
  },
  mounted() {
    console.log(this.data);
  },
  methods: {
    setformSelec(e, form) {
      // form.key = e.model;
      // form.name = e.name;
      form.opt = "";
      form.value = "";
    },
    addGroup() {
      this.condition.push({
        key: "",
        name: "",
        opt: "",
        value: "",
      });
    },
    onSubmit() {
      this.$emit("onCondition", {
        condition: this.condition,
      });
      console.log(this.condition);
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
  background: #f2f2f2;
  padding: 10px;
  box-sizing: border-box;
  margin-bottom: 10px;
  position: relative;
  .delete-box {
    position: absolute;
    right: 10px;
    top: 10px;
    font-size: 15px;
  }
  h4 {
    margin: 10px;
  }
  .text{
     margin: 10px;
  }
  .el-form-item {
    margin-bottom: 5px;
    .el-form-item__label{
      padding:  0;
    }
  }
  .el-input,
  .el-select {
    width: 100%;
  }
}
</style>
