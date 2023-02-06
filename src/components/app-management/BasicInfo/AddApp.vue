<template>
  <el-dialog
    width="70vw"
    :modal="false"
    title="添加操作"
    custom-class="AddProcess"
    :visible.sync="dialogFormVisible"
    append-to-body
    destroy-on-close
    :close-on-click-modal="false"
  >
    <el-form :model="form" label-width="110px">
      <!-- <el-form-item label="应用图标：" prop="imageUrl">
        <el-button
          type="primary"
          class="update-icon"
          :style="iconStyle(form)"
          @click="appIconSetVisible = true"
        >
          <i :class="iconClassObject(form)" style="color: white; font-size: 20px"></i>
        </el-button>
      </el-form-item> -->

      <el-form-item label="应用名称：" prop="appName">
        <el-input v-model="form.appName"></el-input>
      </el-form-item>
      <el-form-item label="应用说明：">
        <el-input type="textarea" v-model="form.explain"></el-input>
      </el-form-item>
      <!-- <el-form-item label="新增后状态：" prop="appId">
        <el-select v-model="form.appId" placeholder="请选择活动区域">
          <el-option label="待验收" value="0"></el-option>
          <el-option label="关闭" value="1"></el-option>
        </el-select>
      </el-form-item> -->
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>

  </el-dialog>
</template>

<script>
export default {
  components: {},
  props: {
    // type: {
    //   type: String,
    //   default: "add",
    // },
    visible: {
      type: Boolean,
      default: false,
    },
    microApp: {
      type: Object,
      default: function () {
        return {};
      },
    },
    formData: {
      type: Array,
      default: function () {
        return [];
      },
    },
    microAppObjData: {
      type: Object,
      default: function () {
        return {};
      },
    },
    appName: {
      type: String,
      default: "",
    },
  },
  data() {
    return {
      currentUpdateMicroApp: {},
      appIconSetVisible: false,
      form: {
        appId: null,
        appName: this.appName || "",
        explain: "",
        iconName: "",
        iconBgColor: "",
      },
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
    iconStyle() {
      return function (data) {
        let styleObj = {};
        styleObj.backgroundColor = data.iconBgColor;
        styleObj.borderColor = data.iconBgColor;
        return styleObj;
      };
    },
    iconClassObject() {
      return function (appIcon) {
        let classObject = {};
        classObject.icon = true;
        classObject.iconfont = true;
        classObject[appIcon.iconName] = true;
        return classObject;
      };
    },
  },
  mounted() {
    if (this.microAppObjData) {
      this.form.appId = this.microAppObjData.appId;
      this.form.appName = this.microAppObjData.appName;
      this.form.explain = this.microAppObjData.explain;
      this.form.iconName = this.microAppObjData.iconName;
      this.form.iconBgColor = this.microAppObjData.iconBgColor;
    }
  },
  methods: {
    onSubmit() {
      this.$emit("onData", this.form);
      // this.$emit("updata:microApp", this.form);
      this.form = {
        appId: null,
        appName: "",
        explain: "",
        iconName: "",
        iconBgColor: "",
      };

      this.dialogFormVisible = !this.dialogFormVisible;
    },
    onAppIconObj(e) {
      this.form.iconBgColor = e.iconBgColor;
      this.form.iconName = e.iconName;
    },
  },
};
</script>

<style lang="scss" scope>
.AddProcess {
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
  .form-list-box {
    display: flex;
    flex-flow: wrap;
    span {
      background: #f6f6f6;
      border-radius: 5px;
      padding: 3px 15px;
      margin: 5px 10px 5px 0px;
    }
  }
  .avatar-uploader .el-upload {
    border: 1px dashed #d9d9d9;
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
  }
  .avatar-uploader .el-upload:hover {
    border-color: #409eff;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 60px;
    height: 60px;
    line-height: 60px;
    text-align: center;
  }
  .avatar {
    width: 60px;
    height: 60px;
    display: block;
  }
  .update-icon {
    width: 70px;
    height: 70px;
    border-radius: 10px;
    margin-bottom: 10px;
  }
}
</style>
