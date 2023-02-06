<template>
  <div>
    <el-form label-width="68px" :inline="true">
      <el-form-item label="应用名称" prop="appName">
        <el-input v-model="queryParams.appName"
                  placeholder="请输入应用名称"
                  clearable
                  size="small"/>
      </el-form-item>
      <el-form-item label="功能介绍" prop="introduce">
        <el-input v-model="queryParams.introduce"
                  placeHolder="请输入功能介绍"
                  clearable
                  size="small"/>
      </el-form-item>
      <el-form-item label="来源" prop="source">
        <el-select v-model="queryParams.source"
                   placeholder="请选择来源"
                   clearable
                   size="small">
          <el-option v-for="item in sourceOptions" :key="item.value"
                     :label="item.label" :value="item.value"/>
        </el-select>
      </el-form-item>
      <el-form-item label="标签" prop="tag">
        <el-input v-model="queryParams.tag"
                  placeHolder="请选择标签"
                  clearable
                  size="small"></el-input>
      </el-form-item>
      <el-form-item class="opt-button">
        <el-button type="info" @click="handleQuery">查询</el-button>
        <el-button type="success" @click="handleQueryReset">重置</el-button>
      </el-form-item>
    </el-form>
    <div class="table-box">
      <el-table v-loading="loading" :data="appList" row-key="id" border @selection-change="handleSelectionChange">
        <el-table-column type="selection" width="55" align="center"/>
        <el-table-column label="Logo/应用名称" show-overflow-tooltip align="center" width="250px">
          <template slot-scope="scope">
          <!--  <div class="logo-column">
              <img :src="imgSrc(scope.row.iconId)" class="avatar">
              <span>{{ scope.row.appName }}</span>
            </div>-->
              <div class="logo-column">

                  <el-button   type="primary" class="icon" :style="iconStyle(scope.row)">
                      <i :class="iconClassObject(scope.row)" style="color: white;font-size: 20px"></i>
                  </el-button>
                  <span style="margin-left: 15px">{{ scope.row.appName }}</span>
              </div>
          </template>
        </el-table-column>
        <el-table-column label="功能介绍" prop="introduce" align="center" show-overflow-tooltip/>
        <el-table-column label="标签" class-name="tag-column" align="center">
          <template slot-scope="scope">
            {{ scope.row.tag?scope.row.tag.split(',').join('、') :''}}
          </template>
        </el-table-column>
      </el-table>
    </div>
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
      <span slot="footer" class="dialog-footer" style="float: right;margin-top: 10px">
                <el-button @click="closeDialog">取 消</el-button>
                <el-button type="primary" @click="saveApp">确 定</el-button>
            </span>
  </div>
</template>

<script>
export default {
    name:"AppList",
  created() {
    this.getAppList();
  },

  computed: {
    imgSrc() {
      return function (fileId) {
        return window.location.origin + this.khConfig.api['fileDownload'] + '/' + fileId;
      };

    },
      iconStyle(){
          return function (data) {
              let styleObj = {};
              styleObj.backgroundColor = data.iconBgColor;
              styleObj.borderColor = data.iconBgColor;
              return styleObj;
          }

      },
      iconClassObject(){
          return function (appIcon) {
              let classObject = {};
              classObject.icon = true;
              classObject.iconfont = true;
              classObject[appIcon.iconName] = true;
              return classObject;
          }

      }
  },

  data() {
    return {
      pageParam: {
        pageNum: 1,
        pageSize: 10
      },
      queryParams: {},
      appList: [],
      loading: true,
      total: 0,
      sourceOptions: [
        {label: "表单服务", value: 0},
        {label: "流程服务", value: 1},
        {label: "专项服务", value: 2},
        {label: "第三方服务", value: 3},
      ],
        selectionData:[],
    };
  },

  methods: {
    getAppList() {
      this.loading = true;
      let param = {
        ...this.pageParam,
        ...this.queryParams
      };
      this.$Get(this.khConfig.api['listMicroApp'], param).then(res => {
        this.total = res.totalCount;
        this.appList = res.datas;
        this.loading = false;
      });
    },
    handleQuery() {
      this.pageParam.pageNum = 1;
      this.getAppList();
    },
    handleQueryReset() {
      this.queryParams = this.$options.data().queryParams;
      this.pageParam.pageNum = 1;
      this.getAppList();
    },
    handleCurrentChange(pageNum) {
      this.getAppList();
    },
    handleSelectionChange(selection) {
        this.selectionData = selection;
    },
      closeDialog(){
          this.$emit('closeMicroDialog');
      },
      saveApp(){
          this.$emit('saveMicroApp',this.selectionData);
      }
  }
};
</script>

<style lang="scss" scoped>
 ::v-deep .table-box {
    .el-table th.gutter {
      display: table-cell !important;
    }
    .logo-column {
      display: flex;
      flex-direction: row;
      align-items: center;

      span {
        //margin-left: 15px;
        text-overflow: ellipsis;
        overflow: hidden;
      }
    }
    .avatar {
      width: 60px;
      height: 60px;
      display: inline-block;
    }
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


  .icon {
      width: 50px;
      height: 50px;
      border-radius: 10px;
      // margin-bottom: 10px;
  }
</style>
