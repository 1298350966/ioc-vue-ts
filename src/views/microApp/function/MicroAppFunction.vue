<template>
  <div>
    <div class="header-row" >
      <span class="header-title">功能管理</span>
      <el-form :model="queryParams" label-width="68px" :inline="true">
        <el-form-item label="功能名称" prop="funName">
          <el-input v-model="queryParams.funName" clearable></el-input>
        </el-form-item>
        <el-form-item label="标签" prop="tag">
          <el-input v-model="queryParams.tag" clearable></el-input>
        </el-form-item>
        <el-form-item label="类型" prop="type">
          <el-select v-model="queryParams.type" clearable>
            <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
        </el-form-item>
        <el-form-item>
          <el-button type="info" @click="handleQuery">查询</el-button>
          <el-button type="success" @click="handleQueryReset">重置</el-button>
          <el-button type="danger" @click="handleDelete">删除</el-button>
          <el-button type="primary" @click="handleAdd">新增</el-button>
        </el-form-item>
      </el-form>
    </div>

    <el-table class="table" ref="funTable" :data="funList" row-key="id" border @selection-change="handleFunSelectionChange">
      <el-table-column type="selection" width="55" align="center" :reserve-selection="true"/>
      <el-table-column label="图标" show-overflow-tooltip align="center" width="250px">
        <template slot-scope="scope">
          <div class="logo-column">
              <el-image  v-if="!KHUtils.isNull(scope.row.iconId)" :src="imgSrc(scope.row.iconId)" class="avatar"></el-image>
              <el-image  v-else  :src="require('@/assets/images/default_app_icon.png')" class="avatar"></el-image>
          </div>
        </template>
      </el-table-column>
      <el-table-column label="功能名称" prop="funName" align="center"/>
      <el-table-column label="标签" class-name="tag-column" align="center">
        <template slot-scope="scope" v-if="!KHUtils.isNull(scope.row.tag)">
          {{ scope.row.tag.split(',').join('、') }}
        </template>
      </el-table-column>
      <el-table-column label="类型" prop="type" align="center"/>
      <el-table-column label="操作" align="center">
        <template slot-scope="scope">
        <!--  <el-button type="text" size="small">查看</el-button>-->
          <el-button type="text" size="small" @click="handleUpdate(scope.row.id)">修改</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        class="pagination"
        background
        :page-size="pageParam.pageSize"
        :current-page.sync="pageParam.pageNum"
        hide-on-single-page
        @current-change="handleCurrentChange"
        layout="prev, pager, next, jumper"
        :total="total">
    </el-pagination>

    <el-dialog custom-class="custom-dialog" :title="title" :visible.sync="open" v-if="open" width="50%" top="5vh"
               append-to-body :close-on-click-modal="false" @close="cancel">
      <el-form class="form" ref="form" :model="form" :rules="rules" label-width="100px">
        <el-form-item label="logo：" prop="iconId">
          <el-upload :action="khConfig.host.rest + khConfig.api.fileUpload" :on-remove="handleRemoveUpload"
                     :on-success="handleUploadSuccess" list-type="picture-card" :show-file-list="false"
                     :before-upload="beforeUpload">
            <img v-if="form.iconId" :src="imgSrc(form.iconId)"
                 class="avatar">
            <i v-else class="el-icon-plus"></i>
          </el-upload>
        </el-form-item>
        <el-form-item label="功能名称：" prop="funName">
          <el-input v-model="form.funName" class="w80"></el-input>
        </el-form-item>
        <el-form-item label="类型：" prop="type">
          <el-select v-model="form.type">
              <el-option v-for="item in typeOptions" :key="item.value" :label="item.label" :value="item.value"/>
          </el-select>
      </el-form-item>
          <el-form-item label="显示：" prop="type">
              <el-select v-model="form.showType">
                  <el-option v-for="item in showTypeOptions" :key="item.value" :label="item.label" :value="item.value"/>
              </el-select>
          </el-form-item>
        <el-form-item label="地址：" prop="menu_url">
          <el-input v-model="form.menuUrl" class="w80"></el-input>
        </el-form-item>
          <el-form-item label="组件名称" prop="component">
              <el-input v-model="form.component" class="w80"></el-input>
          </el-form-item>
        <el-form-item label="标签：" prop="tag">
          <el-select
              :value="tagValue"
              @input="handleTagInput($event)"
              multiple
              filterable
              allow-create
              default-first-option
              placeholder="请添加标签">
          </el-select>
        </el-form-item>
        <el-form-item label="说明：" prop="explanation">
          <el-input v-model="form.explanation" class="w80" type="textarea"></el-input>
        </el-form-item>
      </el-form>
      <template v-slot:footer>
        <el-button size="small" @click="cancel">取消</el-button>
        <el-button type="primary" size="small" @click="submitForm">确定</el-button>
      </template>
    </el-dialog>
  </div>
</template>

<script>
export default {
  created() {
    this.getAppFunctionList();
  },

  computed: {
    tagValue() {
      let tagArray = [];
      this.form.tag.split(',').forEach(item => {
        if (item) {
          tagArray.push(item);
        }
      });
      return tagArray;
    },
    imgSrc() {
      return function (fileId) {
        return window.location.origin + this.khConfig.api['fileDownload'] + '/' + fileId;
      };
    }
  },

  data() {
    return {
      queryParams: {},
      addOpen: false,
      loading: true,
      funList: [],
      pageParam: {
        pageNum: 1,
        pageSize: 10
      },
      total: 0,
      title: '新增',
      form: {
        tag: ''
      },
      open: false,
      typeOptions: [
        {label: '表单', value: 0},
        {label: '流程', value: 1},
        {label: '专项开发', value: 2}
      ],
        showTypeOptions:[
            {label: '全部显示', value: 0},
            {label: 'PC端显示', value: 1},
            {label: '移动端显示', value: 2}
        ],
      rules: {},
      selectedRowIds: []
    };
  },

  methods: {
    getAppFunctionList() {
      let param = {
        ...this.pageParam,
        ...this.queryParams
      };
      this.loading = true;
      this.$Get(this.khConfig.api['listMicroAppFunction'], param).then(res => {
        this.funList = res.datas;
        this.total = res.totalCount;
        this.loading = false;
      });
    },
    handleQuery() {
      this.pageParam.pageNum = 1;
      this.getAppFunctionList();
      this.$refs['funTable'].clearSelection();
    },
    handleQueryReset() {
      this.pageParam.pageNum = 1;
      this.queryParams = this.$options.data().queryParams;
      this.getAppFunctionList();
    },
    handleDelete() {
      console.log(this.selectedRowIds);
      if (this.selectedRowIds.length > 0) {
        this.$confirm('此操作将永久删除该功能, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let param = {
            ids: this.selectedRowIds
          };
          this.$Post(this.khConfig.api['deleteMicroAppFunction'], this.KHUtils.transformRequest(param)).then(res => {
            this.$message({type: "success", message: '删除成功'});
            this.pageParam.pageNum = 1;
            this.$refs['funTable'].clearSelection();
            this.getAppFunctionList();
          });
        });
      } else {
        this.$message({
          type: 'warning',
          message: '请选择要删除的项'
        });
      }
    },
    handleFunSelectionChange(selection) {
      this.selectedRowIds = selection.map(item => {
        return item.id;
      });
    },
    handleUpdate(id) {
      this.$Get(this.khConfig.api['getMicroAppFunction'], {id: id}).then(res => {
        this.form = res.microAppFunction;
        this.open = true;
      });
    },
    handleCurrentChange() {
      this.getAppFunctionList();
    },
    handleAdd() {
      this.title = '新增';
      this.open = true;
    },
    cancel() {
      this.form = this.$options.data().form;
      this.open = false;
    },
    submitForm() {
      if (!this.form.id) {
        this.$Post(this.khConfig.api['addMicroAppFunction'], this.KHUtils.transformRequest(this.form)).then(res => {
          this.$message({
            type: 'success',
            message: '新增成功'
          });
          this.pageParam.pageNum = 1;
          this.getAppFunctionList();
        });
      } else {
        this.$Post(this.khConfig.api['updateMicroAppFunction'], this.KHUtils.transformRequest(this.form)).then(res => {
          this.$message({
            type: 'success',
            message: '修改成功'
          })
          this.getAppFunctionList();
        });
      }
      this.cancel();
    },
    beforeUpload(file) {
      if (file.type !== "image/jpeg" && file.type !== "image/png") {
        this.$message.error("只能上传jpg/png文件");
        return false;
      }
      const limitSize = file.size / 1024 / 1024 < 5;
      if (!limitSize) {
        this.$message.error('上传文件大小不能超过 5M');
        return false;
      }
    },
    handleRemoveUpload() {
      this.form.iconId = "";
    },
    handleUploadSuccess(response, file, fileList) {
      if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
        this.$notify({
          title: '成功',
          message: '上传成功',
          type: 'success'
        });
        this.$set(this.form, 'iconId', response.datas[0].fileId);
      } else {
        this.$notify.error({
          title: '错误',
          message: response.errMsg
        });
        return false;
      }
    },
    handleTagInput(val) {
      console.log(val);
      this.form.tag = val.join(',');
      console.log('tag', this.form.tag);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/microApp/micro-app.scss";

.avatar {
  width: 50px;
  height: 50px;
  display: inline-block;
}

::v-deep .pagination {
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  padding: 0px;
  margin-top: 10px;
  margin-bottom: 10px;
  margin-right: 5px;

  .btn-next {
    margin-right: 0px;
  }
}

::v-deep .table {
  th {
    display: table-cell !important;
  }

  .logo-column {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;

    span {
      margin-left: 15px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
  }
}

::v-deep .form {
  .el-upload {
    width: 60px;
    height: 60px;
    border: none;
    display: flex;
    flex-direction: column;
    justify-content: center;
    position: relative;
  }

  .el-icon-close:before {
    font-size: 12px;
  }
}

</style>
