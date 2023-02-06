<template>
  <div>
    
    <el-dialog
      width="70vw"
      title="查看信息"
      :modal="false"
      custom-class="AddFillInformation"
      :visible.sync="dialogFormVisible"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <!-- {{ writeInfo }} -->
      <!-- {{ formDataconfig }} -->
       <h4 class="title">主表单</h4>
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
      </el-table>
      <div v-for="(childObj, index) in writeInfoObjChild" :key="index">
      <h4 class="title">{{childObj.name}}</h4>
      <el-table
        :ref="'child' + childObj.subKey"
    
        :data="childObj.content"
        style="width: 100%"
        header-cell-class-name="tableRowClassName"
        @selection-change="handleSelectionChange($event, '子表单', childObj.subKey,childObj.name)"
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
      </div>
   
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
    readInfo: {
      type: Object,
      default: function () {
        return {};
      },
    },
  },
  data() {
    return {
      name: "",
      writeInfoObj: {
        parent: {
          content: [],
        },
        child: [],
      },
      parentContent: [],
      child: [],
      childObj: {
        subKey: "",
        name:"",
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
    this.setParentChild();
  },
  methods: {
    setwriteInfoObj() {
        let readInfo  = this.KHUtils.clone(this.readInfo);
        if (typeof readInfo.parent == "object") {
          this.writeInfoObj.parent.content = [];

          let parentContent = this.parentContent.filter((value1) => {
            return readInfo.parent.content.find((value2) => {
              return value1.key == value2.key;
            });
          });
          this.toggleSelection(parentContent, "parent");
        } else {
          this.writeInfoObj.parent = {
            content: [],
          };
        }
        this.writeInfoObj.child = [];
        this.writeInfoObjChild.forEach((Child1) => {
          readInfo.child.find((Child2) => {
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
    },
    setParentChild() {
      this.formDataconfig.forEach((value) => {
        if (value.type == "table") {
          let content = value.tableColumns.map((childValue) => {
            return {
              key: childValue.model,
              name: childValue.name,
              controlType: childValue.type,
            };
          });
          this.writeInfoObjChild.push({
            name:value.name,
            subKey: value.key,
            content: content,
          });
        } else {
          this.parentContent.push({
            key: this.getKey(value),
            name: value.name,
            controlType: value.type,
          });
        }
      });
      this.setwriteInfoObj();
    },
    onSubmit() {
      this.$emit("update:readInfo", this.writeInfoObj);
      console.log(this.readInfo);
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
    handleSelectionChange(e, type, subKey, name) {
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
            name: name || "",
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
  .title{
      line-height: 40px;
      font-weight: bold;
      background: #b1d8f1;
      padding:0 10px;
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
