<template>
  <div class="CirculationSetting">
    <el-row>
      <el-col class="color-A" :span="24">
        <span>流程定义</span>
        <span>|</span>
        <span
          >工作流程流转设定，是设置工作数据在各状态下可执行的操作设置。如果在某一状态下需要设置该操作，请在流程前的复选框内打勾。</span
        >
      </el-col>
    </el-row>
    <!-- {{ statesList }} -->
    <el-row>
      <el-col :span="24" class="BM-5">
        <el-table
          ref="multipleTable"
          :data="statesList"
          tooltip-effect="dark"
          header-cell-class-name="header-table"
          style="width: 100%"
        >
          <el-table-column
            prop="label"
            label="状态名称"
            align="center"
            show-overflow-tooltip
          >
          </el-table-column>
          <!-- businessFlowNameList -->

          <el-table-column
            :label="item"
            align="center"
            show-overflow-tooltip
            v-for="(item, index) in businessFlowNameList"
            :key="index"
          >
            <template slot-scope="scope">
              <el-checkbox v-model="scope.row['checked' + index]" disabled></el-checkbox>
            </template>
          </el-table-column>
        </el-table>
      </el-col>
    </el-row>
    <el-row>
      <el-col :span="24" class="color-A">
        <span>页面预览：所有状态下，电脑端和手机端下页面预览</span>
      </el-col>
    </el-row>
  </div>
</template>

<script>
export default {
  props: ["config"],
  data() {
    return {
      tableData: [
        {
          label: "新建",
          value: 1,
          checked1: false,
          checked2: false,
          checked3: false,
          checked4: false,
        },
        {
          label: "待完善",
          value: 2,
          checked1: false,
          checked2: false,
          checked3: false,
          checked4: false,
        },
        {
          label: "待整改",
          value: 3,
          checked1: false,
          checked2: false,
          checked3: false,
          checked4: false,
        },
        {
          label: "整改中",
          value: 4,
          checked1: false,
          checked2: false,
          checked3: false,
          checked4: false,
        },
      ],
      //   states: [ ],
    };
  },
  computed: {
    states() {
      this.tableData.map((value, index, array) => {
        let businessFlow = [];
        if (checked1) businessFlow.push("隐患整改");
        if (checked2) businessFlow.push("延期申请");
        if (checked3) businessFlow.push("复查验收");
        if (checked4) businessFlow.push("整改任务接收");
        return {
          label: value.label,
          value: value.value,
          businessFlow: businessFlow,
        };
      });
    },
    statesList() {
      if (!this.config.states) return;
      return this.config.states.map((value) => {
        let checkedList = this.businessFlowNameList.map((businessFlowName, index) => {
          let name = value.businessFlow.find((name) => {
            return name == businessFlowName;
          });
          if (name) {
            return true;
          } else {
            return false;
          }
        });
        let checkedObj = {};
        checkedList.forEach((value, index) => {
          checkedObj["checked" + index] = value;
        });
        return {
          label: value.label,
          ...checkedObj,
        };
      });
    },
    businessFlowNameList() {
      if (
        !this.config.stateFlow.businessFlow &&
        !Array.isArray(this.config.stateFlow.businessFlow)
      )
        return [];
      return this.config.stateFlow.businessFlow.map((value) => {
        return value.name;
      });
    },
  },
  methods: {},
};
</script>

<style lang="scss" scope>
.CirculationSetting {
  .header-table {
    background: #f2f2f2;
  }
  .color-A {
    color: #aaaaaa;
    font-size: 10px;
    margin: 10px 0 20px;
  }
  .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner {
    background: #1296db;
    &::after {
      border-color: #fff;
      font-weight: bold;
    }
  }
  // .el-checkbox__input.is-disabled.is-checked .el-checkbox__inner::after {
  //   border-color: #000;
  // }
}
</style>
