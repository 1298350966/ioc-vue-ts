<template>
  <div>
    <el-dialog
      width="50vw"
      :modal="false"
      title="选择表单"
      custom-class="SelectForm"
      :visible.sync="dialogFormVisible"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
      <el-input
        placeholder="请输入表单名称"
        v-model="formName"
        class="input-with-select"
        size="large"
        style="margin-bottom: 10px"
      >
        <el-button slot="append" icon="el-icon-search" @click="queryFormList"></el-button>
      </el-input>
      <el-radio-group class="radio-group" v-model="formObj" @change="rowClick">
        <div v-for="(item, index) in formList" :key="index" class="cardItem">
          <el-radio class="radio-box" :label="item" border size="medium">
            <div class="radio-label">
              <el-image
                class="icon"
                :src="require('@/assets/images/u11884.svg')"
                fit="contain"
              ></el-image>

              <span class="text">{{ item.formName }}</span>
            </div>
          </el-radio>
        </div>
      </el-radio-group>
      <div slot="footer" class="dialog-footer">
        <el-pagination
          background
          layout="prev, pager, next ,total, sizes, jumper"
          :total="pagination.total"
          :page-size.sync="pagination.size"
          @current-change="handleCurrentChange"
          @size-change="queryFormList"
          :current-page.sync="pagination.page"
        >
        </el-pagination>
      </div>
    </el-dialog>
  </div>
</template>

<script>
export default {
  // inject: ["getRiggerObj"],
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    formId: {
      default: "",
    },
  },
  data() {
    return {
      formObj: {},
      formName: "",
      formList: [],
      multipleSelection: [],
      pagination: {
        total: 0,
        page: 1,
        size: 10,
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
  watch: {
    formList(newVl, oldVl) {
      if (newVl != oldVl) {
        let formObj = this.formList.find((value, index, array) => {
          return value.formId == this.formId;
        });
        if (formObj) {
          this.formObj = formObj;
        } else {
          this.formObj = {};
        }
      }
    },
  },
  mounted() {
    this.queryFormList();
  },

  methods: {
    handleCurrentChange() {
      this.queryFormList();
    },
    //查询普通表单列表
    queryFormList() {
      let params = {
        formName: this.formName || null,
        formType: 0,
        pageNum: this.pagination.page,
        pageSize: this.pagination.size,
      };
      this.formList = [];
      this.$Get(this.khConfig.api.listFormConfWithPermission, params).then((res) => {
        if (res.errCode === 0) {
          this.formList = res.datas;
          this.pagination.total = res.totalCount;
        }
      });
    },
    rowClick(row) {
      this.multipleSelection = {
        formId: row.formId,
        formName: row.formName,
        // list: JSON.parse(row.formMeta).list,
      };

      this.addData();
    },
    addData() {
      this.dialogFormVisible = !this.dialogFormVisible;
      this.$emit("onData", this.multipleSelection);
    },
  },
};
</script>

<style lang="scss" scope>
.SelectForm {
  height: 80vh;
  min-width: 700px;
  box-sizing: border-box;
  position: relative;

  .el-dialog__body {
    padding: 10px 20px;
    height: calc(100% - 116px);
    box-sizing: border-box;
    position: relative;
    overflow: hidden;
  }
}
.step-content-2 {
  // display: flex;

  // justify-content: space-between;
  margin: 20px 10px;
  box-sizing: border-box;
  position: relative;
}
.input-with-select {
  // position: absolute;
  // top:0;
  // width: calc(100% - 40px);
  // left:20px;
  // // right: 40px;
  // z-index: 99;
}
.radio-group {
  //  margin-top: 60px;
  position: relative;
  width: 100%;
  height: calc(100% - 60px);
  overflow: auto;
  .cardItem {
    width: 100%;
    display: block;
    border-radius: 7px;
    margin-bottom: 10px;
    display: flex;
    flex-flow: column;
    .radio-box {
      display: flex;
      align-items: center;
      height: 60px !important;
      width: 100%;
      .radio-label {
        display: flex;
        align-items: center;
        .icon {
          display: inline-block;
          width: 40px;
          height: 40px;
          border-radius: 7px;
          border: 1px solid #bfbfbf;
        }
        .text {
          margin-left: 10px;
          flex: 1;
        }
      }
    }
  }
}
</style>
