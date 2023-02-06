<template>
  <div class="displaySettings">
    <div class="add-box">
      <el-form-item label="页面设置">
        <el-radio-group v-model="displayConfig.type">
          <el-radio label="0">弹窗</el-radio>
          <el-radio label="1">普通页面</el-radio>
        </el-radio-group>
      </el-form-item>
      <!-- <span style="margin-right: 15px">页面设置</span> -->
    </div>
    <div class="table-box">
      <el-row>
        <el-col :span="6">
          <el-form-item label="标题">
            <el-input v-model="displayConfig.dialogTitle" style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row style="width:100%" v-show="displayConfig.type === '0'">
        <el-col :span="6">
          <el-form-item label="顶部位置(%)">
            <el-input v-model="displayConfig.dialogTop" style="width: 150px"></el-input>
          </el-form-item>
   
        </el-col>
        <el-col :span="6">
          <el-form-item label="宽度(%)">
            <el-input v-model="displayConfig.dialogWidth" style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="6">
          <el-form-item label="高度(%)">
            <el-input v-model="displayConfig.dialogHeight" style="width: 150px"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="全屏" v-show="displayConfig.type === '0'">
        <el-radio v-model="displayConfig.dialogFullscreen" label="0">非全屏</el-radio>
        <el-radio v-model="displayConfig.dialogFullscreen" label="1">全屏</el-radio>
      </el-form-item>
    </div>
  </div>
</template>

<script>
import {dialogConfig} from "@/config"
export default {
  props: {
    config: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      displayConfig: {
        type: "0", // /0 弹窗 1普通页面
        dialogTitle: "", //标题
        dialogTop: dialogConfig.top || "10",
        dialogWidth:dialogConfig.width || "60", //宽度
        dialogHeight: dialogConfig.height ||"70", 
        dialogFullscreen:"0", //0非全屏 1全屏
      }
    }
  },

  mounted() {
      Object.assign(this.displayConfig, this.config)
  }
}
</script>

<style lang="scss" scoped>
.displaySettings {
  display: flex;
  flex-direction: column;
  min-width: 600px;
}

.add-box {
  display: flex;
  flex-direction: row;
  flex: 1;
}

.table-box {
  display: flex;
  flex-direction: column;
  flex: 1;
}
</style>