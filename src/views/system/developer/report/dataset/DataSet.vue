<template>
  <div>
    <section>
      <!--查询条件-->
      <el-row style="padding-bottom: 10px">
        <el-col :span="4">
          数据集
        </el-col>
        <el-col :span="8" :offset="12">
          <el-input style="width: 250px;" placeholder="请输入查询的数据集名称" v-model="dsKeyWord"
                    @change="handleSearchDataSetConf"
                    prefix-icon="el-icon-search"></el-input>
          <el-button icon="el-icon-plus" @click="handleAddDs">新增数据集</el-button>
        </el-col>
      </el-row>
      <!--数据集列表-->
      <el-row type="flex" justify="center">
        <el-col :span="24">
          <el-table
            :data="tbData"
            v-loading="dsLoading"
            highlight-current-row
            border
            stripe
            style="width: 100%">
            <el-table-column
              prop="dsName"
              label="名称">
            </el-table-column>
            <el-table-column
              prop="userName"
              label="创建者">
            </el-table-column>
            <el-table-column
              prop="createTime"
              label="创建时间"
              :formatter="formatTime">
            </el-table-column>
            <el-table-column
              prop="lastUpdateUserName"
              label="修改人">
            </el-table-column>
            <el-table-column
              prop="lastUpdateTime"
              :formatter="formatTime"
              label="修改时间">
            </el-table-column>
            <el-table-column
              label="数据源"
              prop="dsMeta"
              :formatter="formatDsMeta">
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-tooltip effect="dark" content="编辑" placement="bottom" :open-delay="500">
                  <el-button icon="el-icon-edit-outline" type="text" @click="handleEditDs(scope.row)"></el-button>
                </el-tooltip>
                <el-tooltip effect="dark" content="删除" placement="bottom" :open-delay="500">
                  <el-button icon="el-icon-delete" type="text" @click="handleDeleteDs(scope.row)"></el-button>
                </el-tooltip>
              </template>
            </el-table-column>
          </el-table>
        </el-col>
      </el-row>
      <!--分页-->
      <el-row>
        <el-col :span="6" :offset="15">
          <el-pagination
            :total="totalCount"
            :page-size="param.pageSize"
            :current-page.sync="param.pageNum"
            :hide-on-single-page="true"
            layout="total,prev, pager, next"
            @current-change="handleCurrentChange">
          </el-pagination>
        </el-col>
      </el-row>
      <!--编辑数据集-->
      <el-dialog class="dataSetDialog" title="编辑数据集" :visible.sync="dataSetConfDetailVisible" width="80%"
                 :close-on-click-modal="false" :close-on-press-escape="false" v-if="dataSetConfDetailVisible">
        <data-set-save :dataSetId="dataSetId" ref="dataSetSave"></data-set-save>
      </el-dialog>
      <!--新增数据集-->
      <el-dialog title="新增数据集" :visible.sync="dataSetConfVisible" :close-on-click-modal="false" :before-close="cancel">
        <el-form :model="dsForm" label-width="120px" :rules="dsFormRules" ref="dsForm">
          <el-row>
            <el-col :span="24">
              <el-form-item label="数据源" prop="datasourceId">
                <el-select v-model="dsForm.datasourceId" filterable no-data-text="请先创建数据源" @change="listTableNameByDsId">
                  <el-option v-for="(item,index) in dataSourceData" :key="index" :label="item.dsName"
                             :value="item.dsId"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="24">
              <el-form-item label="表名称" prop="tableName">
                <el-select v-model="dsForm.tableName" filterable>
                  <el-option v-for="(item,index) in tableData" :key="index" :label="item.tableName"
                             :value="item.tableName"></el-option>
                </el-select>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row>
            <el-col :span="12">
              <el-form-item label="数据集名称" prop="dsName">
                <el-input v-model="dsForm.dsName"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click.native="cancel()">取消</el-button>
          <el-button type="primary" @click.native="createDs">保存</el-button>
        </div>
      </el-dialog>
    </section>
  </div>
</template>

<script>
  import DataSetSave from "@/components/report/dataSet/DataSetSave";

  export default {
    name: "DataSet",
    components: {DataSetSave},
    data() {
      return {
        dataSetId: 1,
        dataSetConfDetailVisible: false,
        dataSetConfVisible: false,
        totalCount: 0,
        dsKeyWord: '',
        dsLoading: true,
        dsFormRules: {
          datasourceId: [
            {required: true, message: '请选择数据源', trigger: 'blur'}
          ],
          tableName: [
            {required: true, message: '请选择表名称', trigger: 'blur'}
          ],
          dsName: [
            {required: true, message: '请输入数据集名称', trigger: 'blur'}
          ]
        },
        tbData: [],
        param: {
          dsName: '',
          pageNum: 1,
          pageSize: 10,
        },
        dsForm: {
          datasourceId: null,
          tableName: '',
          dsName: ''
        },
        dataSourceData: [],
        tableData: []
      }
    },
    mounted() {
      let _this = this;
      if (_this.$route.query.dsId) {
        _this.dataSetConfDetailVisible = true;
        _this.dataSetId = _this.$route.query.dsId;
      }
      _this.listDataSetConf();
    },
    methods: {
      //查询数据集列表
      listDataSetConf() {
        let _this = this;
        _this.tbData = [];
        _this.param.dsName = _this.dsKeyWord;
        _this.dsLoading = true;
        _this.$Get(_this.khConfig.api.queryDataSetConf, _this.param).then(res => {
          if (res.errCode === 0) {
            if (res.datasets instanceof Array && res.datasets.length > 0) {
              _this.tbData = res.datasets;
              _this.totalCount = res.totalCount;
            }
          }
          _this.dsLoading = false;
        });
      },
      //根据条件查询数据集
      handleSearchDataSetConf() {
        let _this = this;
        _this.param.pageNum = 1;
        _this.listDataSetConf();
      },
      //点击添加数据集
      handleAddDs() {
        let _this = this;
        _this.dsForm = {
          datasourceId: null,
          tableName: '',
          dsName: ''
        };
        let param = {
          pageSize: 1000,
          pageNum: 1
        };
        _this.$Get(_this.khConfig.api.queryDataSource, param).then(res => {
          if (res.errCode === 0) {
            if (res.datasources instanceof Array && res.datasources.length > 0) {
              _this.dataSourceData = res.datasources;
            }
          }
        });
        _this.dataSetConfVisible = true;
      },
      //编辑数据集
      handleEditDs(row) {
        let _this = this;
        _this.dataSetId = row.dsId;
        _this.dataSetConfDetailVisible = true;
      },
      //分页查询数据集
      handleCurrentChange(val) {
        let _this = this;
        _this.param.pageNum = val;
        _this.listDataSetConf();
      },
      //删除数据集
      handleDeleteDs() {

      },
      //获取数据源的表名
      listTableNameByDsId(val) {
        let _this = this;
        let param = {
          dsId: val,
          pageSize: 1000,
          pageNum: 1
        };
        _this.tableData = [];
        _this.$Get(_this.khConfig.api.queryTable, param).then(res => {
          if (res.errCode === 0) {
            if (res.tables instanceof Array && res.tables.length > 0) {
              _this.tableData = res.tables;
            }
          }
        });
      },
      //创建数据集
      createDs() {
        let _this = this;
        this.$refs['dsForm'].validate((valid) => {
          if (valid) {
            _this.$Post(_this.khConfig.api.createDataSetConf, _this.convertForm2Array(_this.dsForm)).then(res => {
              if (res.errCode === 0) {
                _this.$notify({
                  title: '成功',
                  message: '操作成功',
                  type: 'success'
                });
                _this.listDataSetConf();
                _this.dataSetId = res.dsId;
                _this.dataSetConfDetailVisible = true;
              }
              _this.dataSetConfVisible = false;
            });
          } else {
            return false;
          }
        });
      },
      //格式化时间
      formatTime(row, column) {
        let _this = this;
        const date = new Date(row[column.property]);
        return _this.KHUtils.formatDate(date, "yyyy-MM-dd hh:mm:ss");
      },
      //格式化数据源，根据dsMeta获得数据源名称
      formatDsMeta(row, column) {
        let str = row.dsMeta;
        let obj = JSON.parse(str);
        return obj.datasource;
      },
      //数据集保存参数处理
      convertForm2Array(_form) {
        let _this = this;
        let paramArray = [];
        if (!_this.KHUtils.isNull(_form.datasourceId)) {
          paramArray.push("datasourceId=" + _form.datasourceId);
        }
        if (!_this.KHUtils.isNull(_form.tableName)) {
          paramArray.push("tableName=" + _form.tableName);
        }
        if (!_this.KHUtils.isNull(_form.datasourceId)) {
          paramArray.push("dsName=" + _form.dsName);
        }
        paramArray = paramArray.join("&");
        return paramArray;
      },
      cancel() {
        this.$refs['dsForm'].resetFields();
        this.dataSetConfVisible = false;
      }
    }
  };
</script>


<style lang="scss" scoped>
 ::v-deep .dataSetDialog .el-dialog__body {
    padding: 0px 0px 0px 0px;
  }
</style>
