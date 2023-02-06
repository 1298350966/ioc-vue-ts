<template>
  <div class="dataSelectinterfaceSetting">
    <el-tabs v-if="data.options.maps" v-model="columnSetActiveName" @tab-click="handleColumnSetClick">
      <el-tab-pane label="数据字段配置" name="first">
        <div class="dataSelection">
          <div class="box">
            <el-row class="title" type="flex">
              <span>请求方法：</span>
              <el-radio-group v-model="data.options.method">
                  <el-radio label="GET">GET</el-radio>
                  <el-radio label="POST">POST</el-radio>
              </el-radio-group>
            </el-row>
          </div>
          <div class="box">
            <el-row class="title" type="flex" v-show="data.options.method == 'POST'">
              <span>传参类型：</span>
              <el-radio-group v-model="data.options.postType">
                  <el-radio label="formData">formData</el-radio>
                  <el-radio label="json">json</el-radio>
              </el-radio-group>
            </el-row>
          </div>
          <div class="box">
            <el-row class="title" type="flex">
              <span>数据返回节点：</span>
              <el-input v-model="data.options.remoteDataPoint" style="flex: 1"></el-input>
            </el-row>
          </div>
        
          <div class="box">
            <el-row class="title" type="flex" justify="space-between">
              <span>数据字段列表：</span>
              <span>
                <el-tooltip class="item" effect="dark" content="添加字段" placement="top-end">
                  <el-button @click="addColumnDescOptions" type="primary" icon="el-icon-plus" circle size="mini">
                  </el-button>
                </el-tooltip>
              </span>
            </el-row>
            <el-table border :data="columnDescOptions" style="width: 100%">
              <el-table-column prop="date" label="字段名称">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.name" @input="scope.row.bakName = $event" style="width:100%"></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="字段标识">
                <template slot-scope="scope">
                  <el-input v-model="scope.row.column" style="width:100%"></el-input>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100">
                <template slot-scope="scope">
                  <el-button @click="columnDescOptions.splice(scope.$index, 1)" type="text" size="small">删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

      </el-tab-pane>
      <el-tab-pane label="数据库映射配置" name="second">
        <el-row style="padding-top: 10px">
          <el-table :data="relatedConfigTable" size="mini" highlight-current-row border style="width: 95%"
            ref="mappingRef">
            <el-table-column type="index" width="100">
              <template slot-scope="scope">
                <template v-if="scope.$index === 0"> 控件Value配置 </template>
                <template v-else> 控件Label配置 </template>
              </template>
            </el-table-column>
            <el-table-column prop="source" label="源数据字段">
              <template slot-scope="scope">
                <template v-if="scope.$index === 0">
                  <el-select v-model="data.options.maps.key" placeholder="请选择" size="mini">
                    <el-option v-for="(item, index) in columnDescOptions" :key="index" :label="item.name"
                      :value="item.column">
                    </el-option>
                  </el-select>
                </template>
                <template v-if="scope.$index === 1">
                  <el-select v-model="data.options.maps.name" placeholder="请选择" size="mini">
                    <el-option v-for="(item, index) in columnDescOptions" :key="index" :label="item.name"
                      :value="item.column">
                    </el-option>
                  </el-select>
                </template>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="控件字段备注">
              <template slot-scope="scope">
                <el-input v-model="data.key_name" v-if="scope.$index === 0"></el-input>
                <el-input v-model="data.label_name" v-if="scope.$index === 1"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="控件字段标识">
              <template slot-scope="scope">
                <el-input v-model="data.model" v-if="scope.$index === 0"></el-input>
                <el-input v-model="data.label_model" v-if="scope.$index === 1"></el-input>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>
      <el-tab-pane label="数据传参设置" name="four">
        <dataSelectParamsSetting :formItemList="formItemList" :colsArray="colsArray" :options="data.options"></dataSelectParamsSetting>
      </el-tab-pane>
      <el-tab-pane v-if="this.data.type === 'data_select'" label="自动赋值配置" name="third">
        <el-row>
          <el-button size="mini" @click="addMappingRow" icon="el-icon-edit" type="primary">添加
          </el-button>
        </el-row>
        <el-row style="padding-top: 10px" v-if="data.options.maps">
          <el-table :data="mapping" size="mini" highlight-current-row border style="width: 95%" ref="mappingRef">
            <el-table-column type="index" width="50"> </el-table-column>
            <el-table-column prop="selectKey" label="数据配置字段">
              <template slot-scope="scope">
                <el-select v-model="scope.row.selectKey" placeholder="请选择" size="mini">
                  <el-option v-for="(item, index) in columnDescOptions" :key="index" :label="item.name"
                    :value="item.column">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="model" label="当前表单字段">
              <template slot-scope="scope">
                <el-select v-model="scope.row.model" placeholder="请选择" size="mini">
                  <el-option v-for="item in colsArray" :key="item.model" :label="item.name" :value="item.model">
                  </el-option>
                </el-select>
              </template>
            </el-table-column>
            <el-table-column label="操作" width="100px">
              <template slot-scope="scope">
                <el-button size="mini" type="danger" @click="handleMappingDelete(scope.$index, scope.row)">
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </el-row>
      </el-tab-pane>

    </el-tabs>
  </div>
</template>

<script>
import dataSelectParamsSetting from '@/components/form-filds/RestructureFormFields/dataSelectParamsSetting'
export default {
  props: ["data", "formItemList"],
  components: {
    dataSelectParamsSetting
  },
  data() {
    return {
      colsArray: [],
      remoteDataPoint: "data",
      columnSetActiveName: "first",
      relatedConfigTable: [
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
      ],
      // columnDescOptions: [],
      // mapping:[],
    }
  },
  computed: {
    columnDescOptions() {
      return this.data.options.maps.source.columns
    },
    mapping() {
      return this.data.options.maps.mapping
    }
  },
  mounted() {
    this.setColsArray()
  },
  methods: {
    setColsArray() {
      let _this = this
      _this.formItemList.forEach(val => {
        if(val.type === 'table'){
           return
        }else if (val.type === 'grid') {
          loop(val, _this);
        } else {
          if (val.type === 'data_select' || val.type === 'org_select'
            || val.type === 'user_select'
            || val.type === 'company_select'
            || val.type === 'role_select'
            || val.type === 'dic_select'
            || val.type === 'current_user') {
            _this.KHForm.processDataSourceControl(val, _this.colsArray, _this);
          } else if (val.type === 'gis_select') {
            _this.KHForm.processGisControl(val, _this.colsArray, _this);
          } else if (val.type === 'region_select') {
            _this.KHForm.processRegionControl(val, _this.colsArray, _this);
          } else {
            let temp = _this.KHUtils.clone(val);
            if (temp.type === 'radio' || temp.type === 'select') {
              // 查询条件设置,取消关联控件的设置
              if (temp.options.options) {
                if (temp.options.options instanceof Array) {
                  temp.options.options.forEach(obj => {
                    if (obj.relatedList) {
                      obj.relatedList = [];
                    }
                  })
                }
              }
            }
            _this.colsArray.push(temp);
          }
        }
      });

      function loop(obj, _this) {
        if (obj.columns) {
          obj.columns.forEach(cs => {
            cs.list.forEach(ls => {
              if (ls.type === 'data_select' || ls.type === 'org_select'
                || ls.type === 'user_select'
                || ls.type === 'company_select'
                || ls.type === 'role_select'
                || ls.type === 'dic_select'
                || ls.type === 'current_user') {
                _this.KHForm.processDataSourceControl(ls, _this.colsArray, _this);
              } else if (ls.type === 'gis_select') {
                _this.KHForm.processGisControl(ls, _this.colsArray, _this);
              } else if (ls.type === 'region_select') {
                _this.KHForm.processRegionControl(ls, _this.colsArray, _this);
              } else {
                let temp = _this.KHUtils.clone(ls);
                if (temp.type === 'radio' || temp.type === 'select') {
                  // 查询条件设置,取消关联控件的设置
                  if (temp.options.options) {
                    if (temp.options.options instanceof Array) {
                      temp.options.options.forEach(obj => {
                        if (obj.relatedList) {
                          obj.relatedList = [];
                        }
                      })
                    }
                  }
                }
                _this.colsArray.push(temp);
              }
              if (ls.columns) {
                loop(ls, _this);
              }
            })
          })
        }
      }
    },
    addColumnDescOptions() {
      this.columnDescOptions.push({
        column: "",
        name: "",
        bakName: ""
      })
    },
    // 标签页切换
    handleColumnSetClick(tab) {
      let _this = this;
      _this.columnSetActiveName = tab.name;
    },
    // 映射配置表格行动态新增
    addMappingRow() {
      let _this = this;
      if (!_this.data.options.maps.mapping) {
        return false;
      }
      let obj = {
        model: "",
        selectKey: "",
      };
      _this.data.options.maps.mapping.push(obj);
      setTimeout(() => {
        this.$refs.mappingRef.setCurrentRow(obj);
      }, 10);
    },
    // 映射配置表格行动态删除
    handleMappingDelete(index) {
      let _this = this;
      if (!_this.data.options.maps.mapping) {
        return false;
      }
      _this.data.options.maps.mapping.splice(index, 1);
    },
  }
}
</script>

<style lang="scss" scoped>
.dataSelectinterfaceSetting {
  .dataSelection {

    .title {
      margin-bottom: 10px;
      font-size: 14px;
      margin-bottom: 10px;
      font-weight: bold;
      // border-left: 4px solid #319eff;
      // padding-left: 15px;
      // padding-right: 15px;
      // background: #93c4f242;
      // border-radius: 3px;
    }

    .box {
      width: 100%;
      margin-bottom: 10px;
    }
  }
}
</style>