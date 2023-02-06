<template xmlns:v-on="http://www.w3.org/1999/xhtml">
  <div>
    <ul v-if="itemType == 'dim'" class="column-list-blue">
      <div class="column-title">
        <span v-if="item.dataType == 'String'" style="color: #409EFF;font-size: 10px ">Str.</span>
        <span v-if="item.dataType == 'Date'" style="color: #409EFF;font-size: 10px ">Date.</span>
        <span v-if="item.dataType == 'Number'" style="color: #409EFF;font-size: 10px ">No.</span>
        <i v-if="item.order == 'asc'" class="el-icon-sort-up"></i>
        <i v-if="item.order == 'desc'" class="el-icon-sort-down"></i>
        <el-tooltip class="item" effect="dark" :content="getColumnTitle">
          <span class="column-name">{{getColumnTitle}}</span>
        </el-tooltip>

      </div>
      <div class="rightButton">
        <el-dropdown v-if="refreshCascader"  style="position: static">
          <el-tooltip v-if="moreMenu" class="item" effect="dark" content="更多">
            <i class="el-icon-arrow-down"></i>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-cascader-panel ref="cascader" :options="options" @change="change"></el-cascader-panel>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip v-if="drillDown" class="item" effect="dark" content="钻取">
          <i class="el-icon-d-caret" @click="addDrillDownAxis"></i>
        </el-tooltip>
        <el-tooltip v-if="filter" class="item" effect="dark" content="过滤">
          <i class="el-icon-s-operation" @click="addFilters"></i>
        </el-tooltip>
        <el-tooltip v-if="deleteItem" class="item" effect="dark" content="删除">
          <i class="el-icon-delete-solid" @click="removeAxis"></i>
        </el-tooltip>
      </div>
    </ul>
    <ul v-if="itemType == 'measure'" class="column-list-green">
      <div class="column-title">
        <span  v-if="item.dataType == 'String'" style="color: #67C23A;font-size: 10px ">Str.</span>
        <span v-if="item.dataType == 'Date'" style="color: #67C23A;font-size: 10px ">Date.</span>
        <span v-if="item.dataType == 'Number'" style="color: #67C23A;font-size: 10px ">No.</span>
        <template v-if="reportType == 'compositeReportWidget'&& showChar">

          <el-dropdown style="position: static" @command="handleCommand">
              <span>
                <i v-if="item.charttype == 'line'" class="icon iconfont icon-zhexiantu"></i>
                <i v-else-if="item.charttype == 'area'" class="icon iconfont icon-jibenmianjitu"></i>
                <i v-else-if="item.charttype == 'column'" class="icon iconfont icon-zhuzhuangtu"></i>
              </span>
            <el-dropdown-menu slot="dropdown">
              <el-dropdown-item command="line"><i class="icon iconfont icon-zhexiantu">折线图</i></el-dropdown-item>
              <el-dropdown-item command="column"><i class="icon iconfont icon-zhuzhuangtu">柱状图</i></el-dropdown-item>
              <el-dropdown-item command="area"><i class="icon iconfont icon-jibenmianjitu">面积图</i></el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>
        </template>
        <i v-if="item.order == 'asc'" class="el-icon-sort-up"></i>
        <i v-if="item.order == 'desc'" class="el-icon-sort-down"></i>
        <el-tooltip class="item" effect="dark" :content="getColumnTitle">
          <span class="column-name" style="margin-left: 3px" >{{getColumnTitle}}</span>
        </el-tooltip>

      </div>
      <div class="rightButton">
        <el-dropdown v-if="refreshCascader" style="position: static"  >
          <el-tooltip v-if="moreMenu" class="item" effect="dark" content="更多">
            <i class="el-icon-arrow-down"></i>
          </el-tooltip>
          <el-dropdown-menu slot="dropdown">
            <el-cascader-panel ref="cascader"
                               :options="optionsNum"
                               @change="change"></el-cascader-panel>
          </el-dropdown-menu>
        </el-dropdown>
        <el-tooltip v-if="drillDown" class="item" effect="dark" content="钻取">
          <i class="el-icon-d-caret" @click="addDrillDownAxis"></i>
        </el-tooltip>
        <el-tooltip v-if="filter" class="item" effect="dark" content="过滤">
          <i class="el-icon-s-operation" @click="addFilters"></i>
        </el-tooltip>
        <el-tooltip v-if="deleteItem" class="item" effect="dark" content="删除">
          <i class="el-icon-delete-solid" @click="removeAxis"></i>
        </el-tooltip>
      </div>
    </ul>
    <ul v-if="itemType === 'dateButtons'" class="column-list-blue">
      <div class="column-title">
        <el-tooltip class="item" effect="dark" :content="item.alias?item.alias + '(' + item.column + ')' : item.column">
          <span class="column-name">{{item.alias?item.alias + '(' + item.column + ')' : item.column}}</span>
        </el-tooltip>
      </div>
      <div class="rightButton">
        <el-tooltip v-if="deleteItem" class="item" effect="dark" content="设为默认">
          <i class="el-icon-s-flag" :style="item.default ? 'color: #409EFF' : ''" @click="setDefaultDateButton"></i>
        </el-tooltip>
        <el-tooltip v-if="deleteItem" class="item" effect="dark" content="重命名">
          <i class="el-icon-edit" @click="()=>{renameVisible=true;alias=item.alias;desc=item.desc}"></i>
        </el-tooltip>
        <el-tooltip v-if="deleteItem" class="item" effect="dark" content="删除">
          <i class="el-icon-delete-solid" @click="removeAxis"></i>
        </el-tooltip>
      </div>
    </ul>
    <!--    <el-dialog title="重命名"  :visible.sync="renameVisible" width="45%"
                   :modal="false">

        </el-dialog>-->
    <el-dialog
      title="重命名"
      :visible.sync="renameVisible"
      :modal="false"
      width="35%"
    >
      <el-col style="padding: 20px 50px;" class="rename-input">
        <el-row :span="24">
            <el-col :span = "4">
              <div>字段别名:</div>
            </el-col>
            <el-col :span="20">
              <el-input size="medium" v-model="alias" style="background-color: white"></el-input>
            </el-col>
        </el-row>
        <el-row :span="24" style="margin-top: 20px">
          <el-col :span = "4">
            <div>字段描述:</div>
          </el-col>
          <el-col :span="20">
            <el-input  type="textarea" v-model="desc"></el-input>
          </el-col>
        </el-row>
      </el-col>
      <span slot="footer" class="dialog-footer">
    <el-button @click="renameVisible = false">取 消</el-button>
    <el-button type="primary" @click="renameAliasDesc">确 定</el-button>
  </span>
    </el-dialog>
  </div>
</template>

<script>
  export default {
    name: "ReportSetItem",
    props: {
      item: {required: false, type: Object},
      drillDown: {required: false, type: Boolean},
      moreMenu: {required: false, type: Boolean},
      deleteItem:{required: false, type: Boolean,default:true},
      showChar:{required: false, type: Boolean,default:true},
      reportType: {required: false, type: String},
      itemType: {required: false, type: String},
      isFilter:{required: false, type: Boolean},
      filter:{required: false, type: Boolean},
      tableGroup:{required: false, type: String},


    },
    data(){
      return {
        options: [
          {
            value: 'rename',
            label: '重命名',
            disabled: false
          },
          {
            value: 'sort',
            label: '排序',
            disabled: false,
            children: [{
              value: 'none',
              label: '不排序',
              disabled: false
            }, {
              value: 'asc',
              label: '升序',
              disabled: false
            }, {
              value: 'desc',
              label: '降序',
              disabled: false
            }]
          }
        ],
        optionsNum: [
          {
            value: 'rename',
            label: '重命名',
            disabled: false
          },
          {
            value: 'sort',
            label: '排序',
            disabled: false,
            children: [{
              value: 'none',
              label: '不排序',
              disabled: false
            }, {
              value: 'asc',
              label: '升序',
              disabled: false
            }, {
              value: 'desc',
              label: '降序',
              disabled: false
            }]
          },
          {
            value: 'aggregate',
            label: '聚合方式',
            disabled: false,
            children: [{
              value: 'none',
              label: '无聚合',
              disabled: false
            }, {
              value: 'sum',
              label: '求和',
              disabled: false
            }, {
              value: 'avg',
              label: '平均数',
              disabled: false
            }, {
              value: 'count',
              label: '计数',
              disabled: false
            }, {
              value: 'dscount',
              label: '去重计数',
              disabled: false
            }, {
              value: 'max',
              label: '最大值',
              disabled: false
            }, {
              value: 'min',
              label: '最小值',
              disabled: false
            }]
          },
          {
            value: 'numberType',
            label: '数据展示格式',
            disabled: false,
            children: [{
              value: 'default',
              label: '默认',
              disabled: false
            }, {
              value: 'decimal_0',
              label: '整数',
              disabled: false
            }, {
              value: 'decimal_1',
              label: '保留1位小数',
              disabled: false
            }, {
              value: 'decimal_2',
              label: '保留2位小数',
              disabled: false
            } ,{
              value: 'percent_0',
              label: '百分比',
              disabled: false
            } ,{
              value: 'percent_1',
              label: '百分比1位小数',
              disabled: false
            } ,{
              value: 'percent_2',
              label: '百分比2位小数',
              disabled: false
            }]
          }
        ],
         aggregateType : [
          {
            value: 'none',
            label: '无聚合',
            disabled: true,
          }, {
            value: 'sum',
            label: '求和',
             disabled: false,
          }, {
            value: 'avg',
            label: '平均数',
             disabled: false,
          }, {
            value: 'count',
            label: '计数',
             disabled: false,
          }, {
            value: 'dscount',
            label: '去重计数',
             disabled: false,
          }, {
            value: 'max',
            label: '最大值',
             disabled: false,
          }, {
            value: 'min',
            label: '最小值',
             disabled: false,
          }],
        detailType : [
        {
          value: 'none',
          label: '无聚合',
          disabled: false,
        }, {
          value: 'sum',
          label: '求和',
          disabled: true,
        }, {
          value: 'avg',
          label: '平均数',
          disabled: true,
        }, {
          value: 'count',
          label: '计数',
          disabled: true,

        }, {
          value: 'dscount',
          label: '去重计数',
          disabled: true,
        }, {
          value: 'max',
          label: '最大值',
          disabled: true,
        }, {
          value: 'min',
          label: '最小值',
          disabled: true,
        }],
        noAggregateType : [
          {
            value: 'none',
            label: '无聚合',
            disabled: true,
          }, {
            value: 'sum',
            label: '求和',
            disabled: true,
          }, {
            value: 'avg',
            label: '平均数',
            disabled: true,
          }, {
            value: 'count',
            label: '计数',
            disabled: true,

          }, {
            value: 'dscount',
            label: '去重计数',
            disabled: true,
          }, {
            value: 'max',
            label: '最大值',
            disabled: true,
          }, {
            value: 'min',
            label: '最小值',
            disabled: true,
          }],
        strAggregateType : [
          {
            value: 'none',
            label: '无聚合',
            disabled: true,
          }, {
            value: 'sum',
            label: '求和',
            disabled: true,
          }, {
            value: 'avg',
            label: '平均数',
            disabled: true,
          }, {
            value: 'count',
            label: '计数',
            disabled: false,
          }, {
            value: 'dscount',
            label: '去重计数',
            disabled: false,
          }, {
            value: 'max',
            label: '最大值',
            disabled: true,
          }, {
            value: 'min',
            label: '最小值',
            disabled: true,
          }],
        refreshCascader: true,
        renameVisible: false,
        alias:"",
        desc:"",

      }
    },
    created(){
        let _this = this;
      if(!_this.isFilter && _this.KHUtils.isNull(_this.item.aggregate)){
        _this.initColumnAggregate();
      }
    },
    mounted(){
        let _this = this;
      _this.initAggregate();
    },
    methods: {
      initAggregate(){
        let _this = this;
        if(_this.itemType == "measure"){
          //判断是自定义的表达式还是默认字段
          let expressType = _this.KHReport.expressJudge(_this,_this.item);
          _this.optionsNum[2].children=[];
          if(expressType == "default"){
            if(_this.item.dataType == "String" || _this.item.dataType == "Date"){
              _this.optionsNum[2].children = _this.optionsNum[2].children.concat(_this.strAggregateType);
              if(_this.filter){
                _this.optionsNum[2].children[0].disabled = false;
              }
            }else {
              _this.optionsNum[2].children = _this.optionsNum[2].children.concat(_this.aggregateType);
            }
          }else if(expressType == "caseExp"){
            if(_this.item.dataType == "String" ){
              _this.optionsNum[2].children = _this.optionsNum[2].children.concat(_this.strAggregateType);
              if(_this.filter){
                _this.optionsNum[2].children[0].disabled = false;
              }
            }else if(_this.item.dataType == "Number"){
              _this.optionsNum[2].children = _this.optionsNum[2].children.concat(_this.aggregateType);
            }
          }else if(expressType == "aggregateExp"){
            _this.optionsNum[2].children = _this.optionsNum[2].children.concat(_this.noAggregateType);

          }
        }


      },
      initColumnAggregate(){
        let _this = this;
        if(_this.itemType == "dim"){//纬度  纬度默认没有聚合
          if(_this.item.aggregate){
              delete _this.item.aggregate;
          }

        }else if(_this.itemType == "measure"){//度量
          //交叉表 明细  设置聚合为“无聚合”
          if(_this.reportType == "tableReportWidget" && _this.tableGroup == "detail"){
            _this.item.aggregate = "none";
          }else {
            //判断是自定义的表达式还是默认字段
            let expressType = _this.KHReport.expressJudge(_this,_this.item);
            if(expressType == "default"){
              if(_this.item.dataType == "String" || _this.item.dataType == "Date"){
                _this.item.aggregate = "count";
              }else {
                _this.item.aggregate = "sum";
              }
            }else if(expressType == "caseExp"){
              if(_this.item.dataType == "String" ){
                _this.item.aggregate = "count";
              }else if(_this.item.dataType == "Number"){
                _this.item.aggregate = "sum";
              }
            }else if(expressType == "aggregateExp"){
              _this.item.aggregate = "none";

            }
          }

        }
      },
      change(val){
        let _this = this;
        let nodesObj = this.$refs['cascader'].getCheckedNodes();
        _this.refreshCascader = false;
        _this.$nextTick(() => {
          _this.refreshCascader = true
        });
        if (nodesObj instanceof Array && nodesObj.length > 0) {
          let node = nodesObj[0];
          let level = node.level;
          if (level == 1) {
            let value = node.value;
            if (value == "rename") {//重命名
              _this.renameVisible = true;
              _this.alias = _this.item.alias;
              _this.desc = _this.item.desc;

            }

          } else if (level == 2) {
            let parentValue = node.parent.value;
            if (parentValue == "sort") {//排序
              let value = node.value;
              _this.item.order = value;

            } else if (parentValue == "aggregate") {//聚合
              let value = node.value;
              _this.item.aggregate = value;
            }else if(parentValue == "numberType"){
                if(!_this.item.format){
                  _this.item.format = {
                    type:"default",
                    places:0
                  }
                }

              let value = node.value;
              if(value == "default"){
                  _this.item.format.type = "default";

              }else if(value == "decimal_0"){
                _this.item.format.type = "decimal";
                _this.item.format.places = "0";
              }else if(value == "decimal_1"){
                _this.item.format.type = "decimal";
                _this.item.format.places = "1";
              }else if(value == "decimal_2"){
                _this.item.format.type = "decimal";
                _this.item.format.places = "2";
              }else if(value == "percent_0"){
                _this.item.format.type = "percent";
                _this.item.format.places = "0";
              }else if(value == "percent_1"){
                _this.item.format.type = "percent";
                _this.item.format.places = "1";
              }else if(value == "percent_2"){
                _this.item.format.type = "percent";
                _this.item.format.places = "2";
              }
            }
          }
        }

      },
      renameAliasDesc(){
        let _this = this;
        _this.renameVisible = false;
        _this.item.alias = _this.alias;
        _this.item.desc =  _this.desc;
      },
      handleCommand(command){
        this.item.charttype = command;
      },
      //删除
      removeAxis(){
        this.$emit('removeAxis', this.item);
      },
      addDrillDownAxis(){
        this.$emit('addDrillDownAxis', this.item);
      },
      addFilters(){
        this.$emit('addFilters', this.item);
      },
      aggregateSwitch(value){
          let _this = this;
          if(_this.itemType == "measure"){
            if(value == "aggregate"){
              _this.initColumnAggregate();
              _this.initAggregate();
            }else if(value == "detail"){
              _this.item.aggregate = "none"
              _this.optionsNum[2].children=[];
              _this.optionsNum[2].children = _this.optionsNum[2].children.concat(_this.detailType);
            }
          }
      },
      setDefaultDateButton() {
        this.$emit('setDefaultDateButton', this.item);
      }
    },
    computed: {
      getColumnTitle: function () {
        let _this = this;
        let title = "";
        if(_this.itemType =="dim"){
          if (_this.item.dataType == "String" || _this.item.dataType == "Number" ) {
            if (!_this.KHUtils.isNull(_this.item.column) && !_this.KHUtils.isNull(_this.item.alias)) {
               title = _this.item.alias + "(" + _this.item.column + ")";
            } else if(!_this.KHUtils.isNull(_this.item.column)) {
              title = _this.item.column ;
            }else if(!_this.KHUtils.isNull(_this.item.alias)) {
              title = _this.item.alias ;
            }

          } else if( _this.item.dataType == "Date"){
            if (_this.KHUtils.isNull(_this.item.alias)) {
              title = _this.item.column+"["+_this.item.dateDim+"]";
            } else {
              title = _this.item.alias + "(" + _this.item.column + ")"+"["+_this.item.dateDim+"]";
            }
          }

        }else if(_this.itemType == "measure"){
          if (_this.item.dataType == "String" ) {
            if (!_this.KHUtils.isNull(_this.item.column) && !_this.KHUtils.isNull(_this.item.alias)) {
              title = _this.item.alias + "(" + _this.item.column + ")";
            } else if(!_this.KHUtils.isNull(_this.item.column)) {
              title = _this.item.column ;
            }else if(!_this.KHUtils.isNull(_this.item.alias)) {
              title = _this.item.alias ;
            }
            if (_this.item.hasOwnProperty("aggregate")  && !_this.KHUtils.isNull(_this.item.aggregate)  &&_this.item.aggregate != "" &&_this.item.aggregate != null) {
              title = title + " [" + _this.getAggregateName + "]";
            }

          } else if (_this.item.dataType == "Number") {
            if (!_this.KHUtils.isNull(_this.item.column) && !_this.KHUtils.isNull(_this.item.alias)) {
              title = _this.item.alias + "(" + _this.item.column + ")";
            } else if(!_this.KHUtils.isNull(_this.item.column)) {
              title = _this.item.column ;
            }else if(!_this.KHUtils.isNull(_this.item.alias)) {
              title = _this.item.alias ;
            }
            if (_this.item.hasOwnProperty("aggregate")  && !_this.KHUtils.isNull(_this.item.aggregate)  &&_this.item.aggregate != "" &&_this.item.aggregate != null) {
              title = title + " [" + _this.getAggregateName + "]";
            }

          }else if( _this.item.dataType == "Date"){
            if (_this.KHUtils.isNull(_this.item.alias)) {
              title = _this.item.column+"["+_this.item.dateDim+"]";
            } else {
              title = _this.item.alias + "(" + _this.item.column + ")"+"["+_this.item.dateDim+"]";
            }
          }
        }


        return title;
      },
      getAggregateName: function () {
        let _this = this;
        let name = ""
        let aggregate = _this.item.aggregate;
        if (aggregate == "none") {
          name = "无聚合"
        } else if (aggregate == "sum") {
          name = "求和"
        } else if (aggregate == "avg") {
          name = "平均数"
        } else if (aggregate == "count") {
          name = "计数"
        } else if (aggregate == "dscount") {
          name = "去重计数"
        } else if (aggregate == "max") {
          name = "最大值"
        } else if (aggregate == "min") {
          name = "最小值"
        } else if(aggregate =="aggregateExp"){
            name = "聚合计算"
        }
        return name;
      },
    }
  }
</script>

<style scoped>
  .column-list-blue {
    min-height: 28px;
    overflow-y: hidden;
    overflow-x: hidden;
    background: rgba(255, 255, 255, .1);
    border: 1px solid #409EFF;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: 5px;
    margin-bottom: 0px;
  }

  .column-list-green {
    min-height: 28px;
    overflow-y: hidden;
    overflow-x: hidden;
    background: rgba(255, 255, 255, .1);
    border: 1px solid #67C23A;
    padding-left: 5px;
    padding-right: 5px;
    margin-top: 5px;
    margin-bottom: 0px;
  }

  .column-list-blue div {
    line-height: 28px;
    color: white;
    position: absolute;
    left: 5px;
  }

  .column-list-green div {
    line-height: 28px;
    color: white;
    position: absolute;
    left: 5px;
  }

  .column-list-blue .rightButton {
    float: right;
    width: -moz-max-content;
    position: static;

  }

  .column-list-green .rightButton {
    float: right;
    width: -moz-max-content;
    position: static;
  }

  .column-name {
    text-overflow: ellipsis;
    overflow: hidden;
    max-width: 110px;
    white-space: nowrap;
    position: absolute;
    font-size: 12px;
  }

 ::v-deep .rename-input .el-input__inner{
    background-color: white;
    border: 1px solid #DDE0E7;
    color: #0B1532;
         }
 ::v-deep .rename-input .el-input__inner:focus{
           border-color: #409EFF;

         }


  .el-dropdown-menu.el-popper.el-dropdown-menu--small{
    background-color: #0B1532;
    border:0px;
  }
  .el-cascader-panel.is-bordered{
    border: 0px;
  }
 ::v-deep .el-scrollbar.el-cascader-menu {
    border-right: solid 1px #414A63;
   /* min-width: 120px;*/
  }
 ::v-deep .el-cascader-menu__list {
     border-right: solid 1px #414A63;
           color: white;

  }
 ::v-deep .el-cascader-node:hover{
    background-color: #414A63;
         }

</style>
