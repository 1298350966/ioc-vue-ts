<template>
  <div>
    <el-dialog
      top="10vh"
      width="50vw"
      :modal="false"
      title="选择表单"
      custom-class="selectTable"
      :visible.sync="dialogFormVisible"
      append-to-body
      destroy-on-close
      :close-on-click-modal="false"
    >
    <div class="input-with-select">
      <el-input
        placeholder="请输入表描述"
        v-model="tbComment"
        size="large"
        style="width:40%;"
        clearable
      >
      </el-input>
      <el-input
        placeholder="请输入表名"
        v-model="tableName"
        size="large"
        style="width:40%;margin:0 5%;"
        clearable
      >
      </el-input>
        <el-button type="success" plain size="large"  icon="el-icon-search" @click="search" style="margin-left:auto;"></el-button>
      </div>
      <el-radio-group class="radio-group" v-model="table">
        <div v-for="(item, index) in formList" :key="index" class="cardItem">
          <el-radio class="radio-box" :label="item.tableName" border size="medium">
            <div class="radio-label">
              <el-image
                class="icon"
                :src="require('@/assets/images/automation/u11884.svg')"
                fit="contain"
              ></el-image>

              <span class="text">{{ item.tableName }} </span>
              <span v-if="item.comment">（{{item.comment}}）</span>
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
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    value: {
      default: "",
    },
  },
  data() {
    return {
      formObj: {},
      tableName:"",
      tbComment:"",
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
        this.$emit("update:visible", val);
      },
    },
    table:{
      get(){
        return this.value;
      },
      set(val){
        this.$emit("input", val);
        this.$emit("change",val)
      }
    }
  },
  mounted() {
    this.queryFormList();
  },

  methods: {
    search(){
      this.pagination.page = 1
      this.queryFormList();
    },
    handleCurrentChange() {
      this.queryFormList();
    },
    //查询普通表单列表
    queryFormList() {
      let params = {
        TbName: this.tableName || null,
        tbComment: this.tbComment || "",
        pageNum: this.pagination.page,
        pageSize: this.pagination.size,
      };
      this.formList = [];
      // /api/form/datasource/table/query
      this.$Get(this.khConfig.api.tableQuery, params).then((res) => {
        if (res.errCode === 0) {
          this.formList = res.tables;
          this.pagination.total = res.totalCount;
        }
      });
    },
  },
};
</script>

<style lang="scss" scope>
.selectTable {
  height: 85vh;
  min-width: 700px;
  box-sizing: border-box;
  position: relative;

  .el-dialog__body {
    padding: 10px 20px;
    height: calc(100% - 116px);
    box-sizing: border-box;
    position: relative;
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
  position: absolute;
  top:10px;
  display: flex;

  width: calc(100% - 40px);
  left:20px;
  right: 40px;
}
.radio-group {
   margin-top: 50px;
  position: relative;
  width: 100%;
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
      padding: 0 10px;
      width: 100%;
      &:hover{
        background:rgb(185, 222, 247);
      }
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
