<template>
  <div class="assignmentSetting">
    <el-row>
          <el-button
              size="mini"
              @click="addMappingRow"
              icon="el-icon-edit"
              type="primary"
              >添加
            </el-button>
          </el-row>
          <el-row style="padding-top: 10px" v-if="data.options.maps">
            <el-table
              :data="data.options.maps.mapping"
              size="mini"
              highlight-current-row
              border
              style="width: 95%"
              ref="mappingRef"
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column prop="selectKey" label="数据配置字段">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.selectKey"
                    placeholder="请选择"
                    size="mini"
                    value=""
                  >
                    <el-option
                      v-for="(item, index) in columnDescOptions"
                      :key="index"
                      :label="item.name"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="model" label="当前表单字段">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.model"
                    placeholder="请选择"
                    size="mini"
                    value=""
                  >
                    <el-option
                      v-for="item in colsArray"
                      :key="item.model"
                      :label="item.name"
                      :value="item.model"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleMappingDelete(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
  </div>
</template>

<script>
export default {
  props:["data","columnDescOptions","formItemList"],
  data() {
    return {
      colsArray: []
    }
  },
  mounted(){
    this.setColsArray()
  },
  methods:{
    setColsArray() {
      let _this = this
      _this.formItemList.forEach(val => {
        if(val.type === 'table') return
        if (val.type === 'grid') {
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

<style>

</style>