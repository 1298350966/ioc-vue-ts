<template>
  <div class="PageSetup">
    <div class="pc-app">
      <el-image
        @click="isPc = true"
        v-show="isPc"
        style="width: 40px; height: 40px; margin-right: 43px"
        :src="require('@/assets/images/app-management/u9779.svg')"
        fit="fill"
      ></el-image>

      <el-image
        @click="isPc = true"
        v-show="!isPc"
        style="width: 40px; height: 40px; margin-right: 43px"
        :src="require('@/assets/images/app-management/u9940.svg')"
        fit="fill"
      ></el-image>
      <el-image
        @click="isPc = false"
        v-show="!isPc"
        style="width: 40px; height: 40px"
        :src="require('@/assets/images/app-management/u9939.svg')"
        fit="fill"
      ></el-image>
      <el-image
        @click="isPc = false"
        v-show="isPc"
        style="width: 40px; height: 40px"
        :src="require('@/assets/images/app-management/u9780.svg')"
        fit="fill"
      ></el-image>
    </div>

    <div class="pc-box" v-if="isPc">
      <el-tabs>
        <el-tab-pane label="未处理">
          <el-table
            ref="multipleTable"
            :data="tableData"
            tooltip-effect="dark"
            style="width: 100%"
          >
            <el-table-column type="selection" width="55"> </el-table-column>
            <el-table-column label="字段1">
              <template slot-scope="scope">{{ scope.row.date }}</template>
            </el-table-column>
            <el-table-column prop="name" label="字段2"> </el-table-column>
            <el-table-column prop="address" label="字段3" show-overflow-tooltip>
            </el-table-column>
            <el-table-column fixed="right" label="操作" width="120">
              <template slot-scope="scope">
                <el-button type="text" size="small"> 编辑 </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-tab-pane>
        <el-tab-pane label="已处理"> </el-tab-pane>
      </el-tabs>
    </div>
    <div class="app-box" v-if="!isPc">
      <el-image
        class="app-bg-img"
        :src="require('@/assets/images/app-management/u8792.svg')"
        fit="fill"
      ></el-image>
      <el-image
        class="app-bg-img"
        :src="require('@/assets/images/app-management/u8792.svg')"
        fit="fill"
      ></el-image>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isPc: true,
      tableData: [
        {
          date: "2016-05-03",
          name: "王小虎",
          address: "上海市普陀区金沙江路 1518 弄",
        },
      ],
    };
  },
};
</script>

<style lang="scss" scope>
.PageSetup {
  height: 100%;
  width: 100%;
  position: relative;
  .pc-app {
    display: flex;
  }
  .pc-box {
  }
  .app-box {
    display: flex;
    justify-content: space-around;
    align-items: center;
    padding-top: 20px;
    .app-bg-img {
      width: 220px;
      height: 360px;
    }
  }
}
</style>