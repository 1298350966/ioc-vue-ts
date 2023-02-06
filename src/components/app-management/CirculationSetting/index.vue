<template>
  <div class="CirculationSetting">
    <!-- <el-form ref="form" :model="form" label-width="80px">
      <el-form-item label="应用设置">
        <el-link
          class="ML-20"
          type="primary"
          :underline="false"
          @click="addProcessVisible = true"
          >添加</el-link
        >
      </el-form-item>
    </el-form> -->

    <!-- <el-table
      ref="multipleTable"
      :data="microApp"
      tooltip-effect="dark"
      header-cell-class-name="header-table"
      style="width: 100%"
    >
      <el-table-column
        prop="appName"
        label="应用名称"
        align="center"
        show-overflow-tooltip
      >
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
      <el-table-column
        prop="appId"
        label="新增完状态"
        align="center"
        show-overflow-tooltip
      >
        <template slot-scope="scope">
          <span>待验收/关闭</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="explain"
        label="应用说明"
        align="center"
        show-overflow-tooltip
      >
      </el-table-column>
    </el-table> -->

    <AddApp
      v-if="addProcessVisible"
      @onData="microApp.push($event)"
      :visible.sync="addProcessVisible"
    ></AddApp>
  </div>
</template>

<script>
import AddApp from "@/components/app-management/BasicInfo/AddApp";
import CirculationSettingindex from "@/components/app-management/CirculationSetting/CirculationSettingindex";
export default {
  components: { AddApp, CirculationSettingindex },
  data() {
    return {
      addProcessVisible: false,
      appNameShow: false,
      form: {},
      tableData: [],
      microApp: [],
    };
  },
};
</script>

<style lang="scss" scope>
.CirculationSetting {
}
</style>
