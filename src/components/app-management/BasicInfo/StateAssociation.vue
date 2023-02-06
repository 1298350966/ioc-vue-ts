<template>
  <el-dialog
    width="70vw"
    :modal="false"
    title="状态设置"
    custom-class="SelectForm"
    :visible.sync="dialogFormVisible"
    append-to-body
    :destroy-on-close="true"
    :close-on-click-modal="false"
  >
    <el-button type="primary" @click="addstatesVisible = true" style="margin-bottom: 15px"
      >添加状态</el-button
    >
    <el-table :data="tableData" header-cell-class-name="header-table" style="width: 100%">
      <el-table-column label="状态名称" align="center">
        <template slot-scope="scope">
          <div v-show="isInput">
            <span>{{ scope.row.label }}</span>
            <i class="el-icon-edit" @click="isInput = false"></i>
          </div>
          <!--  -->
          <el-input
            v-show="!isInput"
            @blur="isInput = true"
            @focus="$event.currentTarget.select()"
            v-focus
            v-model="scope.row.label"
            style="width: 80px"
          ></el-input>
        </template>
      </el-table-column>
      <el-table-column label="显示颜色" align="center">
        <template slot-scope="scope">
          <el-color-picker v-model="scope.row.color"></el-color-picker>
        </template>
      </el-table-column>
      <el-table-column label="是否结束状态" align="center">
        <template slot-scope="scope">
          <el-radio-group v-model="scope.row.isEnd">
            <el-radio label="yes">是</el-radio>
            <el-radio label="no">否</el-radio>
          </el-radio-group>
        </template>
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="120">
        <template slot-scope="scope">
          <el-button
            @click.native.prevent="deleteRow(scope.$index, tableData)"
            type="text"
            size="small"
          >
            移除
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-dialog
      width="400px"
      :modal="false"
      title="添加状态"
      custom-class="addstates"
      :visible.sync="addstatesVisible"
      append-to-body
      :destroy-on-close="true"
      top="25vh"
    >
      <el-form :model="form" label-width="120px" :inline="true">
        <el-form-item label="状态名称：" prop="appName">
          <el-input
            v-model="form.label"
            placeholder="请输入状态名称"
            clearable
            size="small"
          />
        </el-form-item>
        <el-form-item label="显示颜色：" prop="introduce">
          <el-color-picker v-model="form.color"></el-color-picker>
        </el-form-item>
        <el-form-item label="是否结束状态：" prop="introduce">
          <el-radio-group v-model="form.isEnd">
            <el-radio label="yes">是</el-radio>
            <el-radio label="no">否</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item class="opt-button">
          <el-button type="primary" @click="addstates">提交</el-button>
        </el-form-item>
      </el-form>
    </el-dialog>

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
    states: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      isInput: true,
      addstatesVisible: false,
      tableData: this.states || [],
      form: {
        label: "",
        value: "",
        color: this.color() || "",
        isEnd: "no",
        businessFlow: [],
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
  mounted() {},
  methods: {
    color() {
      var i = 0;
      var str = "#";
      var random = 0;
      var aryNum = [
        "0",
        "1",
        "2",
        "3",
        "4",
        "5",
        "6",
        "7",
        "8",
        "9",
        "A",
        "B",
        "C",
        "D",
        "E",
        "F",
      ];
      for (i = 0; i < 6; i++) {
        random = parseInt(Math.random() * 16);
        str += aryNum[random];
      }
      return str;
    },
    onSubmit() {
      this.tableData.forEach((value, index, array) => {
        array[index].value = value.label;
      });
      console.log(this.tableData);
      this.$emit("update:states", this.tableData);
      this.dialogFormVisible = !this.dialogFormVisible;
    },
    addstates() {
      if (!this.form.label)
        return this.$notify({
          title: "警告",
          message: "请填写状态名称",
          type: "warning",
        });
      if (!this.form.color)
        return this.$notify({
          title: "警告",
          message: "请选择显示颜色",
          type: "warning",
        });
      if (!this.form.isEnd)
        return this.$notify({
          title: "警告",
          message: "请选择结束状态",
          type: "warning",
        });
      this.tableData.push(Object.assign({}, this.form));
      this.form = {
        label: "",
        value: "",
        color: this.color(),
        isEnd: "no",
        businessFlow: [],
      };
      this.addstatesVisible = false;
    },
    //移除
    deleteRow(index, tableData) {
      tableData.splice(index, 1);
    },
  },
};
</script>

<style lang="scss" scope>
.SelectForm {
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
  .header-table {
    background: #f2f2f2;
  }
  .el-icon-edit {
    margin-left: 10px;
  }
  .addstates {
    height: 60vh;
    box-sizing: border-box;
    position: relative;
  }
}
</style>
