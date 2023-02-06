<template>
  <el-dialog
    custom-class="custom-dialog-icon"
    title="图标设置"
    :visible.sync="appIconSetVisible"
    width="30%"
    top="5vh"
    append-to-body
    :close-on-click-modal="false"
  >
    <el-row type="flex" class="row-bg" justify="space-between">
      <el-col :span="6"></el-col>
      <el-col :span="6"
        ><el-button type="primary" class="update-icon" :style="iconStyle(appIconObj)">
          <i
            :class="iconClassObject(appIconObj)"
            style="color: white; font-size: 20px"
          ></i> </el-button
      ></el-col>
      <el-col :span="6"></el-col>
    </el-row>
    <el-row :gutter="12" style="margin-bottom: 10px" class="icon-content">
      <template v-for="appIcon in MicroAppIcons.appIcons">
        <el-col :span="3">
          <i
            :class="iconClassObject(appIcon)"
            style="font-size: 25px; margin-left: 20px"
            @click="selectIcon(appIcon)"
          ></i>
        </el-col>
      </template>
    </el-row>

    <el-row style="padding: 10px; border-top: 1px solid #eaf1f7">
      <el-button
        style="background-color: #409eff; border-color: #409eff"
        circle
        @click="slectBgColor('#409EFF')"
      ></el-button>
      <el-button
        style="background-color: #67c23a; border-color: #67c23a"
        circle
        @click="slectBgColor('#67C23A')"
      ></el-button>
      <el-button
        style="background-color: #e6a23c; border-color: #e6a23c"
        circle
        @click="slectBgColor('#E6A23C')"
      ></el-button>
      <el-button
        style="background-color: #f56c6c; border-color: #f56c6c"
        circle
        @click="slectBgColor('#F56C6C')"
      ></el-button>
      <el-button
        style="background-color: #909399; border-color: #909399"
        circle
        @click="slectBgColor('#909399')"
      ></el-button>
    </el-row>
    <template v-slot:footer>
      <el-button size="small" @click="appIconSetVisible = false">取消</el-button>
      <el-button type="primary" size="small" @click="setAppIcon">确定</el-button>
    </template>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      currentUpdateMicroApp: {},
      appIconObj: {
        iconName: "",
        iconBgColor: "",
      },
    };
  },
  computed: {
    appIconSetVisible: {
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
  methods: {
    setAppIcon() {
      this.appIconSetVisible = false;
      this.$emit("onAppIconObj", this.appIconObj);
    },
    selectIcon(appIcon) {
      this.appIconObj.iconName = appIcon.iconName;
    },
    slectBgColor(color) {
      this.appIconObj.iconBgColor = color;
    },
  },
};
</script>

<style lang="scss" scope>
.update-icon {
  width: 70px;
  height: 70px;
  border-radius: 10px;
  margin-bottom: 10px;
}
</style>
