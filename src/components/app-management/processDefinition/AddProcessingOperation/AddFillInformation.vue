<template>
  <div>
    <el-dialog
      width="70vw"
      title="添加操作"
      :modal="false"
      custom-class="AddFillInformation"
      :visible.sync="dialogFormVisible"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <!-- {{ writeInfo }} -->
      <!-- {{ formDataconfig }} -->
      <el-form :model="writeInfoObj">
        <el-form-item label="填写信息名称:" style="margin-top: 18px">
          <el-input style="width: 300px" v-model="writeInfoObj.name"></el-input>
        </el-form-item>
      </el-form>

      <el-form-item label="是否开启备注:" style="margin-top: 18px">
        <el-checkbox v-model="writeInfoObj.needRemark"></el-checkbox>
      </el-form-item>

      <el-table
        :data="parentContent"
        style="width: 100%"
        header-cell-class-name="tableRowClassName"
        @selection-change="handleSelectionChange($event, '主表单')"
        ref="parent"
      >
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column label="字段名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作类型">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.type">
              <el-radio label="read">只读</el-radio>
              <el-radio label="edit">可编辑</el-radio>
              <el-radio label="hidden">隐藏</el-radio>
            </el-radio-group>
          </template>
        </el-table-column> -->
      </el-table>
      <h4 v-show="writeInfoObjChild.length !== 0">子表单</h4>
      <el-table
        :ref="'child' + childObj.subKey"
        v-for="(childObj, index) in writeInfoObjChild"
        :key="index"
        :data="childObj.content"
        style="width: 100%"
        header-cell-class-name="tableRowClassName"
        @selection-change="handleSelectionChange($event, '子表单', childObj.subKey)"
      >
        <el-table-column type="selection" width="55" align="center"> </el-table-column>
        <el-table-column label="字段名称" align="center">
          <template slot-scope="scope">
            <span>{{ scope.row.name }}</span>
          </template>
        </el-table-column>
        <!-- <el-table-column label="操作类型">
          <template slot-scope="scope">
            <el-radio-group v-model="scope.row.type">
              <el-radio label="read">只读</el-radio>
              <el-radio label="edit">可编辑</el-radio>
              <el-radio label="hidden">隐藏</el-radio>
            </el-radio-group>
          </template>
        </el-table-column> -->
      </el-table>
      <div slot="footer" class="dialog-footer">
        <el-button type="primary" @click="onSubmit">提交</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import { mapState } from "vuex";
export default {
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
  },
  data() {
    return {
      tableData: [
        { date: "隐患描述", value: 0 },
        { date: "隐患级别", value: 0 },
        { date: "整改类型", value: 0 },
      ],
      name: "",
      needRemark: false,
      writeInfoObj: {
        name: "",
        parent: {
          formId: "",
          content: [],
        },
        child: [],
        needRemark: false,
      },
      parentContent: [],
      child: [],
      childObj: {
        subKey: "",
        content: [],
      },
      writeInfoObjChild: [],
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
    // contentConfig() {
    //   return this.formDataconfig.map((value) => {
    //     return {
    //       key: value.model,
    //       name: value.name,
    //       type: "read",
    //     };
    //   });
    // },
    ...mapState({
      formDataconfig: (state) => state.appManagement.formDataconfig,
    }),

    getKey() {
      return (value) => {
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
  },
  mounted() {
    // console.log(1111111111);
    // this.name = this.writeInfo[0].name;
    this.setParentChild();
  },
  methods: {
    setwriteInfoObj() {
      if (this.writeInfo.length > 0) {
        this.writeInfoObj.name = this.writeInfo[0].name || "";
        if (typeof this.writeInfo[0].parent == "object") {
          this.writeInfoObj.parent.formId = this.writeInfo[0].parent.formId || "";
          this.writeInfoObj.parent.content = [];

          let parentContent = this.parentContent.filter((value1) => {
            return this.writeInfo[0].parent.content.find((value2) => {
              return value1.key == value2.key;
            });
          });
          this.toggleSelection(parentContent, "parent");
        } else {
          this.writeInfoObj.parent = {
            formId: "",
            content: [],
          };
        }
        this.writeInfoObj.child = [];
        this.writeInfoObjChild.forEach((Child1) => {
          this.writeInfo[0].child.find((Child2) => {
            if (Child2.subKey == Child1.subKey) {
              let parentContent = Child1.content.filter((value1) => {
                return Child2.content.find((value2) => {
                  return value1.key == value2.key;
                });
              });
              this.toggleSelection(parentContent, "child" + Child1.subKey);
              return true;
            }
          });
        });

        if (typeof this.writeInfo[0].needRemark == "boolean") {
          this.writeInfoObj.needRemark = this.writeInfo[0].needRemark;
        } else {
          this.writeInfoObj.needRemark = false;
        }
      }
    },
    setParentChild() {
      this.formDataconfig.forEach((value) => {
        if (value.type == "table") {
          let content = value.tableColumns.map((childValue) => {
            return {
              key: childValue.model,
              name: childValue.name,
              type: "edit",
              controlType: childValue.type,
            };
          });
          this.writeInfoObjChild.push({
            subKey: value.key,
            content: content,
          });
        } else {
          this.parentContent.push({
            key: this.getKey(value),
            name: value.name,
            type: "edit",
            controlType: value.type,
            // config: value,
          });
        }
      });
      this.setwriteInfoObj();
    },
    onSubmit() {
      if (!this.writeInfoObj.name) return this.error("请输入填写信息名称");
      // if (this.parentContent.length == 0) return this.error("请选择主表单控件");

      // this.writeInfo.push(this.writeInfoObj);
      // this.writeInfoObj.parent = this.parentContent;
      // this.writeInfoObj.child = this.child
      this.writeInfo[0] = this.writeInfoObj;
      // this.writeInfo[0] = {
      //   name: this.name,
      //   parent: {
      //     formId: "",
      //     content: this.parentContent,
      //   },
      //   child: this.child,
      //   needRemark: this.needRemark,
      // };
      this.$emit("onWriteInfo", this.writeInfo);
      console.log(this.writeInfo);
      this.dialogFormVisible = false;
    },
    error(message) {
      this.$notify.error({
        title: "提示",
        message: message,
      });
    },
    toggleSelection(rows, refName) {
      if (rows) {
        rows.forEach((row) => {
          this.$nextTick(() => {
            if (Array.isArray(this.$refs[refName])) {
              this.$refs[refName][0].toggleRowSelection(row, true);
            } else {
              this.$refs[refName].toggleRowSelection(row, true);
            }
          });
        });
      } else {
        this.$refs[refName].clearSelection();
      }
    },
    handleSelectionChange(e, type, subKey) {
      if (type === "主表单") {
        this.writeInfoObj.parent.content = e;
      } else {
        let child = this.writeInfoObj.child.find((value) => {
          return value.subKey == subKey;
        });
        if (child) {
          child.content = e;
        } else {
          this.writeInfoObj.child.push({
            subKey: subKey,
            content: e,
          });
        }
      }
    },
  },
};
</script>

<style lang="scss" scope>
.AddFillInformation {
  height: 70vh;
  .el-dialog__body {
    padding-top: 0;
    height: calc(100% - 116px) !important;
    box-sizing: border-box;
    position: relative;
    overflow: auto !important;
  }
  .tableRowClassName {
    background: #f2f2f2;
  }
  .operation-process-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    .link {
      margin-bottom: 18px;
    }
  }
}
</style>
