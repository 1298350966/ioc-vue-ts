<template>
  <div class="theme-box">
    <div id="themeTable">
      <el-table
        :data="tableData"
        border
        class="theme-table"
        stripe>
        <el-table-column
          label="主题名称">
          <template slot-scope="scope">
            <span>{{ scope.row.themeName }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="主题类型">
          <template slot-scope="scope">
            <span>{{ themeType(scope.row.themeType) }}</span>
          </template>
        </el-table-column>
        <el-table-column label="操作" :width="optWidth">
          <template slot-scope="scope">
            <el-button
              size="mini"
              type="danger"
              @click="handleDelete(scope.$index, scope.row)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div class="pagination">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="pageParam.pageNum"
          :page-sizes="[10, 30, 50, 100]"
          :page-size="pageParam.pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalCount">
        </el-pagination>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    currentType: {type: Number}
  },

  data() {
    return {
      tableData: [],
      pageParam: {
        pageNum: 1,
        pageSize: 10
      },
      totalCount: 0,
      optWidth: '100px',
      columnWidth: ''
    };
  },

  computed: {
    themeType() {
      return function (val) {
        if (val === 0) {
          return '表单';
        } else if (val === 1) {
          return '表单新增';
        } else if (val === 2) {
          return '报表';
        }
      };
    }
  },

  watch: {
    currentType(type) {
      this.listThemeByType(type);
    }
  },

  created() {
    this.listThemeByType(this.currentType);
  },

  methods: {
    listThemeByType(type) {
      if (type === 5) {
        this.$Get(this.khConfig.api.queryThemeByType, this.pageParam).then(res => {
          this.tableData = res.datas;
          this.totalCount = res.totalCount;
        });
      } else {
        let param = {};
        param.pageNum = this.pageParam.pageNum;
        param.pageSize = this.pageParam.pageSize;
        param.type = type;
        this.$Get(this.khConfig.api.queryThemeByType, param).then(res => {
          this.tableData = res.datas;
          this.totalCount = res.totalCount;
        });
      }
    },
    handleCurrentChange(pageNum) {
      this.pageParam.pageNum = pageNum;
      this.listThemeByType(this.currentType);
    },
    handleSizeChange(val) {
      this.pageParam.pageSize = val;
      this.listThemeByType(this.currentType);
    },
    handleDelete(index, data) {
      this.$confirm('此操作将永久删除主题, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$Post(this.khConfig.api.deleteTheme + '/' + data.id).then(res => {
          if (res.errCode === 0) {
            this.$message({
              showClose: true,
              type: "success",
              message: "删除成功"
            });
            this.pageParam.pageNum = 1;
            this.listThemeByType(this.currentType);
          } else {
            this.$message({
              showClose: true,
              type: "error",
              message: "删除失败"
            });
          }
        });
      });
    }
  }
};
</script>

<style lang="scss" scoped>
  .theme-box {
    margin-right: 15px;
  }
  .pagination {
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    margin-top: 10px;
  }

 ::v-deep .pagination .el-input__inner{
    background-color: white;
    border: 1px solid #DDE0E7;
    color: #0B1532;
  }
 ::v-deep .pagination .el-input__inner:focus{
    border-color: #409EFF;
  }
</style>
