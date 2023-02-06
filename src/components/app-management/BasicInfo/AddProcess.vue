<template>
  <el-dialog
    width="70vw"
    :modal="false"
    title="添加操作"
    custom-class="AddProcess"
    :visible.sync="dialogFormVisible"
    append-to-body
    destroy-on-close
  >
    <el-form ref="form" :model="form" label-width="110px">
      <!-- <el-form-item label="应用图标：">
        <el-upload
          class="avatar-uploader"
          action="https://jsonplaceholder.typicode.com/posts/"
          :show-file-list="false"
          :on-success="handleAvatarSuccess"
          :before-upload="beforeAvatarUpload"
        >
          <img v-if="form.imageUrl" :src="form.imageUrl" class="avatar" />
          <i v-else class="el-icon-plus avatar-uploader-icon"></i>
        </el-upload>
      </el-form-item> -->
      <el-form-item label="应用名称：">
        <el-input v-model="form.appName"></el-input>
      </el-form-item>
      <el-form-item label="应用说明：">
        <el-input type="textarea" v-model="form.explain"></el-input>
      </el-form-item>
      <el-form-item label="新增后状态：">
        <el-select v-model="form.appId" placeholder="请选择活动区域">
          <el-option label="待验收" value="0"></el-option>
          <el-option label="关闭" value="1"></el-option>
        </el-select>
      </el-form-item>
      <el-form-item label="新增填写内容：">
        <div class="form-list-box">
          <span v-for="(item, index) in form.content" :key="index"
            >{{item.name}}</span
          >
        </div>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formDataList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      form: {
        imageUrl: "",
        appName: "",
        explain: "",
        iconName: "",
        iconBgColor: "",
        content: [
          {
            key: "field_001",
            name: "隐患描述",
          },
          {
            key: "field_002",
            name: "隐患位置",
          },
        ],
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
  },
  methods: {
    handleAvatarSuccess(res, file) {
      this.form.imageUrl = URL.createObjectURL(file.raw);
    },
    beforeAvatarUpload(file) {
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!isLt2M) {
        this.$message.error("上传头像图片大小不能超过 2MB!");
      }
      return isLt2M;
    },
    onSubmit() {
      this.$emit("onData", this.form);
      this.dialogFormVisible = !this.dialogFormVisible;
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
}
</style>