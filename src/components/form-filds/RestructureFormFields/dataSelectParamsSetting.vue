<template>
  <div class="dataSelectCustomApi" v-if="options.urlParams">
    <div style="margin-top: 10px;margin-bottom: 10px">
      <div style="margin-bottom: 10px">
        <span class="secondary-font-color">传参设置</span>
        <el-button style="margin-left:10px" type="primary" icon="el-icon-plus" circle @click.native="addParams">
        </el-button>
      </div>

      <div v-for="(param, index) in options.urlParams" :key="index" style="margin-bottom: 10px;padding-right: 10px">

        <el-row :span="24" :gutter="20">
          <el-col :span="7" style="margin-left: 5px;margin-right: 5px">
            <el-select style="width:100%" v-if="isSelect" v-model="param.k" placeholder="请选择接收参数" size="mini">
              <el-option v-for="(item, index) in columnDescOptions" :key="index" :label="item.name" :value="item.id">
              </el-option>
            </el-select>
            <el-input style="width:100%" v-else v-model="param.k" placeholder="请输入接收参数名称"></el-input>
          </el-col>
          <el-col :span="7" style="white-space: nowrap;line-height: 28px;">
            <el-radio-group v-model="param.t" @change="param.v = ''">
              <el-radio label="0">控件字段</el-radio>
              <el-radio label="1">自定义</el-radio>
            </el-radio-group>
          </el-col>
          <el-col :span="7">
            <el-input v-if="param.t === '1'" v-model="param.v" placeholder="请输入接收参数值"></el-input>
            <el-select v-else style="width:100%" v-model="param.v" placeholder="请选择参数">
              <el-option v-for="col in colsArray" :key="col.model" :label="col.name" :value="col.model">
              </el-option>
            </el-select>
          </el-col>
          <el-col :span="1">
            <el-button type="danger" icon="el-icon-delete" circle @click.native="deleteParams(index)"></el-button>
          </el-col>
        </el-row>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    formItemList: {
      type: Array,
      default: function () {
        return []
      }
    },
    columnDescOptions: {
      type: Array,
      default: function () {
        return []
      }
    },
    // colsArray:{
    //   type: Array,
    //   default: function () {
    //     return []
    //   }
    // },
    options: {
      type: Object,
      default: function () {
        return {}
      }
    }
  },
  data() {
    return {
      colsArray: []
    }
  },
  computed: {
    isSelect() {
      return this.columnDescOptions.length > 0
    }
    
  },
  mounted() {
    if (!this.options.urlParams) {
      this.$set(this.options, "urlParams", [])
    }
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
    addParams() {
      this.options.urlParams.push({
        k: "",
        v: "",
        t: "0",
      })
    },
    deleteParams(index) {
      this.$delete(this.options.urlParams, index)
    }
  },
}
</script>


<style lang="scss" scoped>
.dataSelectCustomApi {
  color: #333333;
}
</style>