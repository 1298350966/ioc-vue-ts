<template>
  <el-row style="border-top: 1px solid #E8E8E8;padding: 3%;background-color: #f8f8fa">
    <!--头部-->
    <el-row class="filter-head">
      <el-col :span="2">
        <span style="font-size: small">数据集</span>
      </el-col>
      <el-col :span="8" class="data-set">
        <el-tooltip class="item" effect="dark" :content="fromParentObj.dsName" placement="top">
          <span class="data-set-text">{{fromParentObj.dsName}}</span>
        </el-tooltip>
      </el-col>
      <el-col :span="2" :offset="1">
        <span style="font-size: small">选中字段</span>
      </el-col>
      <el-col :span="10" v-if="condFilter.itemType==='measure'" class="measure">
        <div style="display: flex;flex-direction: row;justify-content: flex-start">
          <span class="cond-type-measure">{{condFilter.dataType==='Number'?'No':'Str.'}}</span>
          <el-tooltip effect="dark"
                      :content="condFilterText"
                      placement="top">
            <span class="cond-filter-text">
              {{condFilterText}}
            </span>
          </el-tooltip>
        </div>
      </el-col>
      <el-col :span="10" v-else class="dim">
        <div style="display: flex;flex-direction: row;justify-content: flex-start">
          <span class="cond-type-dim">{{condFilter.dataType==='String'?'Str.':'Date'}}</span>
          <el-tooltip effect="dark"
                      :content="condFilterText"
                      placement="top">
            <span class="cond-filter-text">
              {{condFilterText}}
            </span>
          </el-tooltip>
        </div>
      </el-col>
    </el-row>

    <!--不同类型的过滤页面-->
    <el-row style="padding: 10px;background-color: #FFFFFF;font-size: small;margin-top: 15px">
      <el-row v-if="condFilter.itemType==='dim' && condFilter.dataType==='String'">
        <el-row>
          <el-col :span="4">过滤方式</el-col>
          <el-col :span="5">
            <el-radio :label="0" v-model="condFilter.filterType" @change="handleChangeFilterType">按条件筛选</el-radio>
          </el-col>
          <el-col :span="5">
            <el-radio :label="1" v-model="condFilter.filterType" @change="handleChangeFilterType">按枚举筛选</el-radio >
          </el-col>
        </el-row>
        <el-row v-if="condFilter.filterType===0" >
          <el-row style="margin-top: 15px">
            <el-col :span="4">条件形式</el-col>
            <el-col :span="5">
              <el-radio :label="0" v-model="condFilter.condType" @change="handleChangeCondType">单条件</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio :label="1" v-model="condFilter.condType" @change="handleChangeCondType">或条件</el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio :label="2" v-model="condFilter.condType" @change="handleChangeCondType">且条件</el-radio>
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4" style="padding-top: 7px">
              过滤条件
            </el-col>
            <el-row>
              <el-col :span="2" v-if="condFilter.condType!==0" style="margin-top: 5px">
                <el-row>
                  <el-row>
                    ┌------
                  </el-row>
                  <el-row>
                    <br/>
                    {{condFilter.condType===1?'或':'且'}}
                  </el-row>
                  <el-row>
                    <br/>
                    └------
                  </el-row>
                </el-row>
              </el-col>
              <el-col :span="12">
                <el-row :style="index===1?'margin-top: 25px':''" v-for="(item,index) in condFilter.conds0" :key="index">
                  <el-col :span="8">
                    <el-select size="mini" v-model="condFilter.conds0[index].matchType" placeholder="请选择">
                      <el-option v-for="(item1,index1) in stringMatchTypeOption"
                                 :key="index1"
                                 :label="item1.label"
                                 :value="item1.value">
                      </el-option>
                    </el-select>
                  </el-col>
                  <el-col :span="11"  :offset="1">
                    <el-input size="mini" v-if="condFilter.conds0[index].matchType!='$null'&&condFilter.conds0[index].matchType!='$notnull'" v-model="condFilter.conds0[index].value">
                    </el-input>
                  </el-col>
                </el-row>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
        <el-row v-if="condFilter.filterType===1">
          <el-row style="margin-top: 15px">
            <el-col :span="4">查询方式</el-col>
            <el-col :span="5">
              <el-radio v-model="condFilter.condType"
                        @change="handleChangeMultiple" :label="0">单选
              </el-radio>
            </el-col>
            <el-col :span="5">
              <el-radio v-model="condFilter.condType"
                        @change="handleChangeMultiple" :label="1">复选
              </el-radio>
            </el-col>
          </el-row>
          <el-row style="margin-top: 15px">
            <el-col :span="4" style="padding-top: 7px">
              过滤条件
            </el-col>
            <el-row style="margin-top: 10px">
              <el-col :span="4">
                <el-row>
                  <el-popover
                    placement="bottom"
                    ref="popover"
                    :title="condFilter.condType===0?'单选':'复选'"
                    width="399"
                    trigger="click">
                    <el-input style="width: 150px;" @change="handleSearchEnumData" v-model="wd">
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-row v-if="condFilter.condType===0">
                      <el-row v-for="(item,index) in enumData" :key="index" class="enum-item" :title="item">
                        <el-checkbox-group v-model="condFilter.conds1">
                          <el-checkbox :label="item" @change="handleChangeEnumData"></el-checkbox>
                        </el-checkbox-group>
                      </el-row>
                    </el-row>
                    <el-row v-if="condFilter.condType===1">
                      <el-row v-for="(item,index) in enumData" :key="index" class="enum-item" :title="item">
                        <el-checkbox-group v-model="condFilter.conds1">
                          <el-checkbox :label="item"></el-checkbox>
                        </el-checkbox-group>
                      </el-row>
                    </el-row>
                    <el-pagination
                      @current-change="handleCurrentChange"
                      :current-page="pageNum"
                      background
                      :pager-count="4"
                      :page-size="10"
                      :hide-on-single-page="true"
                      layout="prev, pager, next"
                      :total="totalCount">
                    </el-pagination>
                    <el-button icon="el-icon-search" slot="reference" size="mini">点击选择内容</el-button>
                  </el-popover>
                </el-row>
                <el-row style="margin-top: 10px"  v-if="condFilter.condType===1">
                  <el-popover
                    placement="bottom"
                    width="250"
                    @after-leave="saveManualText"
                    trigger="click">
                    <el-input type="textarea" v-model="manualText"
                              placeholder="请一行填一个，最多添加500个,识别录入时会自动过滤重复的选项和已经添加过的选项"
                              :autosize="{ minRows: 5, maxRows: 10}"></el-input>
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                               @click="showManualInput" slot="reference">手工输入</el-button>
                  </el-popover>
                </el-row>
              </el-col>
              <el-col :span="10" :offset="6">
                <el-card class="card-box" shadow="hover" ref="enumCard">
                  <el-row slot="header">
                    <span v-if="condFilter.conds1.length===0">
                      已选内容
                    </span>
                    <span v-else>
                      已选内容({{condFilter.conds1.length}})
                    </span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="clearAllEnum">清空</el-button>
                  </el-row>
                  <div class="conds1-body">
                    <el-row v-if="condFilter.conds1.length===0" style="text-align: center;margin-top: 55px">
                      请从左侧进行添加
                    </el-row>
                    <el-row v-for="(item,index) in condFilter.conds1" :key="index"
                            class="conds1-row"
                            :title="condFilter.conds1[index]">
                      <el-col :span="20" class="conds1-item">
                        {{ condFilter.conds1[index] }}
                      </el-col>
                      <el-col :span="3">
                        <i class="el-icon-delete" style="cursor: pointer;margin-left: 15px" @click="deleteAEnum"></i>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-row>
        </el-row>
      </el-row>

      <el-row v-if="condFilter.itemType==='measure'">
        <el-row>
          <el-col :span="4">查询方式</el-col>
          <el-col :span="5">
            <el-radio :label="0" v-model="condFilter.condType" @change="handleChangeCondType">单条件</el-radio>
          </el-col>
          <el-col :span="5">
            <el-radio :label="1" v-model="condFilter.condType" @change="handleChangeCondType">或条件</el-radio>
          </el-col>
          <el-col :span="5">
            <el-radio :label="2" v-model="condFilter.condType" @change="handleChangeCondType">且条件</el-radio>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :span="4" style="padding-top: 7px">
            过滤条件
          </el-col>
          <el-row>
            <el-col :span="2" v-if="condFilter.condType!==0" style="margin-top: 5px">
              <el-row>
                <el-row>
                  ┌------
                </el-row>
                <el-row>
                  <br/>
                  {{condFilter.condType===1?'或':'且'}}
                </el-row>
                <el-row>
                  <br/>
                  └------
                </el-row>
              </el-row>
            </el-col>
            <el-col :span="12">
              <el-row :style="index===1?'margin-top: 25px':''" v-for="(item,index) in condFilter.conds" :key="index">
                <el-col :span="8">
                  <el-select size="mini" v-model="condFilter.conds[index].matchType" placeholder="请选择">
                    <el-option v-for="(item1,index1) in numberMatchTypeOption"
                               :key="index1"
                               :label="item1.label"
                               :value="item1.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col :span="11"  :offset="1">
                  <el-input type="number" size="mini" v-model="condFilter.conds[index].value">
                  </el-input>
                </el-col>
              </el-row>
            </el-col>
          </el-row>
        </el-row>
      </el-row>

      <el-row v-if="condFilter.dataType==='Date'">
        <el-row style="margin-top: 15px">
          <el-col :span="4">
            过滤条件
          </el-col>
          <el-col :span="5">
            <el-radio  @change="handleChangeFilterType" v-model="condFilter.filterType" :label="1">区间粒度
            </el-radio>
          </el-col>
          <el-col :span="5">
            <el-radio @change="handleChangeFilterType" v-model="condFilter.filterType" :label="0">日期粒度
            </el-radio>
          </el-col>
        </el-row>
        <el-row style="margin-top: 15px;font-size: 12px">
          <el-row v-if="condFilter.filterType===1">
            <el-col :span="4" :offset="4">开始于：</el-col>
            <el-col :span="4" :offset="3">结束于：</el-col>
          </el-row>
          <el-row v-if="condFilter.filterType===0">
            <el-col :span="4" :offset="4">精确于：</el-col>
          </el-row>
        </el-row>
        <el-row style="margin-top: 15px">
          <el-col :offset="2">
            <!--年月-->
            <el-row v-if="condFilter.dateDim==='year' || condFilter.dateDim==='month'">
              <el-col :span="5" v-for="(item,index) in condFilter.conds" :key="index" :offset="2">
                <el-date-picker
                  @change="handleChangeDate($event,index)"
                  :value-format="getDateValueFormat(condFilter.dateDim)"
                  :format="getDateFormat(condFilter.dateDim)"
                  size="mini"
                  style="width: 150px"
                  v-model="condFilter.conds[index].value"
                  :type="condFilter.dateDim"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
            <!--周-->
            <el-row v-if="condFilter.dateDim==='week'">
              <el-col :span="5" v-for="(item,index) in condFilter.conds" :key="index" :offset="2">
                <custom-week-picker placeholder="请选择日期"
                                    @change="handleChangeDate($event,index)"
                                    v-model="condFilter.conds[index].value">
                </custom-week-picker>
              </el-col>
            </el-row>
            <!--日-->
            <el-row v-if="condFilter.dateDim==='day'">
              <el-col :span="5" v-for="(item,index) in condFilter.conds" :key="index" :offset="2">
                <el-date-picker
                  @change="handleChangeDate($event,index)"
                  :value-format="getDateValueFormat(condFilter.dateDim)"
                  :format="getDateFormat(condFilter.dateDim)"
                  :picker-options="{'firstDayOfWeek': 1}"
                  size="mini"
                  style="width: 150px"
                  v-model="condFilter.conds[index].value"
                  type="date"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
            <!--季度-->
            <el-row v-if="condFilter.dateDim==='quarter'">
              <el-col :span="5" v-for="(item,index) in condFilter.conds" :key="index" :offset="2">
                <custom-quarter-picker
                  placeholder="请选择日期"
                  @change="handleChangeDate($event,index)"
                  v-model="condFilter.conds[index].value"></custom-quarter-picker>
              </el-col>
            </el-row>
            <!--年月日时分秒-->
            <el-row v-if="condFilter.dateDim==='ymdhms'">
              <el-col :span="5" v-for="(item,index) in condFilter.conds" :key="index" :offset="2">
                <el-date-picker
                  @change="handleChangeDate($event,index)"
                  :value-format="getDateValueFormat(condFilter.dateDim)"
                  :format="getDateFormat(condFilter.dateDim)"
                  :picker-options="{'firstDayOfWeek': 1}"
                  v-model="condFilter.conds[index].value"
                  size="mini"
                  style="width: 180px"
                  type="datetime"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
            <!--小时-->
            <el-row v-if="condFilter.dateDim==='hour'">
              <el-col :span="5" v-for="(item,index) in condFilter.conds" :key="index" :offset="2">
                <custom-hour-picker
                  placeholder="请选择时间"
                  @change="handleChangeDate($event,index)"
                  v-model="condFilter.conds[index].value"></custom-hour-picker>
              </el-col>
            </el-row>
            <!--分钟、秒-->
            <el-row v-if="condFilter.dateDim==='second' || condFilter.dateDim==='minute'">
              <el-col :span="5" v-for="(item,index) in condFilter.conds" :key="index" :offset="2">
                <el-time-picker
                  @change="handleChangeDate($event,index)"
                  :value-format="getDateValueFormat(condFilter.dateDim)"
                  :format="getDateFormat(condFilter.dateDim)"
                  v-model="condFilter.conds[index].value"
                  size="mini"
                  style="width: 150px"
                  placeholder="请选择时间">
                </el-time-picker>
              </el-col>
            </el-row>
          </el-col>
        </el-row>
      </el-row>
    </el-row>

    <!--尾部-->
    <el-row style="margin-top: 15px" type="flex" justify="end">
      <el-col :span="7">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="saveCondFilter">确定</el-button>
      </el-col>
    </el-row>
  </el-row>
</template>

<script>
  import CustomQuarterPicker from "@/components/CustomQuarterPicker";
  import CustomHourPicker from "@/components/CustomHourPicker";
  import CustomWeekPicker from "@/components/CustomWeekPicker";

  export default {
    props: {
      fromParentObj: {
        //测试数据
        default: () => {
          return {
            dsId: 116,
            dsName: '6njk',
            widgetId: 0,
            condFilter: {
              table: "mnt_history",
              column: "msg_sn",
              desc: "",
              dataType: "String",
              alias: "",
              express: "",
              // 聚合方式：none无聚合，sum求和，avg平均值，count计数，dscount去重计数，min最小值，max最大值
              dateDim: "week",
              condType: 0,
              // 条件形式：0单条件，1或条件，2且条件
              filterType: 1,
              // 条件
              conds0: [{
                // 匹配方式：0 精确匹配，1包含，2不包含，3不匹配，4开头是，5为空，6不为空，7空文本
                matchType: "$eq",
                // 值
                value: ""
              }],
              conds1: [],
              conds: [{
                // 匹配方式：8 等于，11大于等于，13小于等于
                matchType: "$eq",
                // 值
                value: ""
              }, {
                // 匹配方式：8 等于，11大于等于，13小于等于
                matchType: "$eq",
                // 值
                value: ""
              }]
            }
          }
        },
        type: Object
      }
    },

    mounted() {
      Object.assign(this.$data, this.$options.data());
      this.condFilter = this.fromParentObj.condFilter;
      this.init();
    },

    watch: {
      fromParentObj: function (val) {
        //让data数据为默认值
        Object.assign(this.$data, this.$options.data());
        this.condFilter = val.condFilter;
        this.init();
      }
    },

    computed: {
      condFilterText() {
        let condFilter = this.condFilter;
        let condFilterText = condFilter.column;
        if (!this.KHUtils.isNull(condFilter.express)) {
          if (!this.KHUtils.isNull(condFilter.aggregate) && condFilter.aggregate !== 'none') {
            condFilterText = condFilter.alias + "(" + condFilter.aggregate + ")";
          } else {
            condFilterText = condFilter.alias;
          }
        } else {
          if (!this.KHUtils.isNull(condFilter.alias)) {
            condFilterText = condFilter.alias + "(" + condFilter.column + ")";
          }
        }
        if (!this.KHUtils.isNull(condFilter.dateDim)) {
          condFilterText = condFilterText + '(' + condFilter.dateDim + ')';
        }
        return condFilterText;
      }
    },

    data() {
      return {
        pageNum: 1,
        totalCount: 0,
        wd: "",
        enumData: [],
        condFilter: {},
        manualText: '',
        stringMatchTypeOption: [
          {label: '精确匹配', value: '$eq'},
          {label: '包含', value: '$like'},
          {label: '不包含', value: '$nlike'},
          {label: '不匹配', value: '$neq'},
          {label: '开头是', value: '$hlike'},
          {label: '为空', value: '$null'},
          {label: '不为空', value: '$notnull'},
          {label: '空文本', value: '$empty'}
        ],
        numberMatchTypeOption: [
          {label: '=', value: '$eq'},
          {label: '≠', value: '$neq'},
          {label: '>', value: '$gt'},
          {label: '>=', value: '$gte'},
          {label: '<', value: '$lt'},
          {label: '<=', value: '$lte'}
        ]
      };
    },

    components: {
      CustomQuarterPicker,CustomHourPicker, CustomWeekPicker
    },

    methods: {
      //重新初始化
      init() {
        let condFilter = this.condFilter;
        //设置属性
        if (condFilter.itemType === 'dim' && condFilter.dataType === 'String') {
          if (condFilter.hasOwnProperty('filterType')) {
            if (!condFilter.hasOwnProperty('conds0')) {
              if (condFilter.condType === 0) {
                this.$set(condFilter, 'conds0', [{
                  matchType: '$eq',
                  value: ''
                }]);
              } else {
                this.$set(condFilter, 'conds0', [{
                  matchType: '$eq',
                  value: ''
                }, {
                  matchType: '$eq',
                  value: ''
                }]);
              }
            } else {
              if (condFilter.condType !== 0) {
                if (condFilter.conds0.length === 1) {
                  condFilter.conds0.push({
                    matchType: "$eq",
                    value: ""
                  });
                }
              }
            }
            if (condFilter.filterType === 1) {
              this.getEnumData(condFilter);
            }
            if (!condFilter.hasOwnProperty('conds1')) {
              this.$set(condFilter, 'conds1', []);
            }
          } else {
            this.$set(condFilter, 'filterType', 0);
            this.$set(condFilter, 'condType', 0);
            this.$set(condFilter, 'conds0', [{
              matchType: "$eq",
              value: ""
            }]);
            this.$set(condFilter, 'conds1', []);
          }
        } else if (condFilter.itemType === 'measure') {
          if (condFilter.hasOwnProperty('condType')) {
            if (!condFilter.hasOwnProperty('conds')) {
              if (condFilter.condType === 0) {
                this.$set(condFilter, 'conds', [{
                  matchType: '$eq',
                  value: ''
                }]);
              } else {
                this.$set(condFilter, 'conds', [{
                  matchType: '$eq',
                  value: ''
                }, {
                  matchType: '$eq',
                  value: ''
                }]);
              }
            } else {
              if (condFilter.condType !== 0) {
                if (condFilter.conds.length === 1) {
                  condFilter.conds.push({
                    matchType: "$eq",
                    value: ""
                  });
                }
              }
            }
          } else {
            this.$set(condFilter, 'condType', 0);
            this.$set(condFilter, 'conds', [{
              matchType: "$eq",
              value: ""
            }]);
          }
        } else if (condFilter.dataType === 'Date') {
          if (condFilter.hasOwnProperty('filterType')) {
            if (!condFilter.hasOwnProperty('conds')) {
              if (condFilter.filterType === 0) {
                this.$set(condFilter, 'conds', [{
                  matchType: '$eq',
                  value: ''
                }]);
              } else {
                this.$set(condFilter, 'conds', [{
                  matchType: '$gte',
                  value: ''
                }, {
                  matchType: '$lte',
                  value: ''
                }]);
              }
            } else {
              if (condFilter.filterType === 1) {
                if (condFilter.conds.length === 1) {
                  if (condFilter.conds[0].matchType === '$gte') {
                    condFilter.conds.push({
                      matchType: '$lte',
                      value: ''
                    });
                  } else {
                    condFilter.conds.unshift({
                      matchType: '$gte',
                      value: ''
                    });
                  }
                }
              }
            }
          } else {
            this.$set(condFilter, 'filterType', 1);
            this.$set(condFilter, 'conds', [{
              matchType: '$gte',
              value: ''
            }, {
              matchType: '$lte',
              value: ''
            }]);
          }
        }
      },

      //单选选择枚举数据后
      handleChangeEnumData() {
        let conds1 = this.condFilter.conds1;
        conds1.splice(0, conds1.length - 1);
      },

      //多选选择了枚举数据后
      handleSelectChangeEnumData(val) {
        this.condFilter.conds1 = val;
      },

      //获取指定页码数据
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getEnumData(this.condFilter, val, this.wd);
      },

      //处理单、且、或条件
      handleChangeCondType(val) {
        let condFilter = this.condFilter;
        if (val === 0) {
          if (condFilter.itemType === 'dim' && condFilter.dataType === "String") {
            condFilter.conds0 = [{
              matchType: '$eq',
              value: ""
            }];
          }
          if (condFilter.itemType === 'measure') {
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          }
        } else {
          if (condFilter.itemType === 'dim' && condFilter.dataType === "String") {
            condFilter.conds0 = [{
              matchType: '$eq',
              value: ""
            }, {
              matchType: '$eq',
              value: ""
            }];
          }
          if (condFilter.itemType === 'measure') {
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }, {
              matchType: '$eq',
              value: ""
            }];
          }
        }
      },

      //改变了filterType时
      handleChangeFilterType(val) {
        let condFilter = this.condFilter;
        if (condFilter.itemType === 'dim' && condFilter.dataType === "String") {
          if (val === 0) {
            condFilter.condType = 0;
            condFilter.conds1 = [];
            this.$set(condFilter, 'conds0', [{
              matchType: "$eq",
              value: ""
            }]);
          } else {
            this.getEnumData(condFilter);
          }
        }
        if (condFilter.dataType === 'Date') {
          if (val === 0) {
            condFilter.conds = [{
              matchType: "$eq",
              value: ""
            }];
          } else {
            condFilter.conds = [{
              matchType: "$gte",
              value: ""
            }, {
              matchType: "$lte",
              value: ""
            }];
          }
        }
      },

      //根据关键字搜索枚举数据
      handleSearchEnumData(val) {
        this.pageNum = 1;
        this.wd = val;
        this.getEnumData(this.condFilter, 1, val);
      },

      //获取枚举数据
      getEnumData(condFilter, pageNum = 1, wd = '') {
        if (this.KHUtils.isNull(condFilter.express)) {
          let param = {
            dataSetId: this.fromParentObj.dsId,
            tb: condFilter.table,
            col: condFilter.column,
            pageNum: pageNum,
            wd: wd
          };

          this.$Get(this.khConfig.api.queryColumnData, param).then(res => {
            if (res.errCode === 0) {
              this.enumData = res.datas;
              this.totalCount = res.totalCount;
            }
          });
        } else {
          let express = condFilter.express;
          let compareExpress = express.replaceAll(/([tT][hH][eE][nN])/g, 'then').replaceAll(/([eE][lL][sS][eE])/g, 'else').replaceAll(/([wW][hH][eE][nN])/g, 'when').replaceAll(/([eE][nN][dD])/g, 'end');
          let result = compareExpress.split("then");
          if (result.length > 0) {
            result.splice(0, 1);
            let resArray = [];
            for (let i = 0; i < result.length; i++) {
              if (result[i].indexOf('else') >= 0) {
                resArray.push(result[i].split('else')[0].replaceAll(/'/g, '').replaceAll(/\s/g, ''));
                resArray.push(result[i].split("else")[1].split("end")[0].replaceAll(/'/g, '').replaceAll(/\s/g, ''));
              } else {
                if (result[i].indexOf('when') >= 0) {
                  resArray.push(result[i].split("when")[0].replaceAll(/'/g, '').replaceAll(/\s/g, ''));
                } else {
                  resArray.push(result[i].split("end")[0].replaceAll(/'/g, '').replaceAll(/\s/g, ''));
                }
              }
            }
            this.enumData = resArray;
          }
        }
      },

      //枚举类型点击单选或者多选
      handleChangeMultiple(val) {
        this.condFilter.condType = val;
        this.condFilter.conds1 = [];
      },

      //选择了时间时，保证前面的时间小于后面的时间
      handleChangeDate(val, index) {
        let conds = this.condFilter.conds;
        if (conds.length > 1) {
          if (index === 0) {
            if (conds[1].value && val && val > conds[1].value) {
              let temp = conds[0].value;
              conds[0].value = conds[1].value;
              conds[1].value = temp;
            }
          }
          if (index === 1) {
            if (conds[0].value && val && val < conds[0].value) {
              let temp = conds[0].value;
              conds[0].value = conds[1].value;
              conds[1].value = temp;
            }
          }
        }
      },

      //日期类型格式化
      getDateValueFormat(type) {
        if (type === 'year') {
          return 'yyyy';
        } else if (type === 'month') {
          return 'yyyy-MM';
        } else if (type === 'day') {
          return 'yyyy-MM-dd';
        } else if (type === 'ymdhms') {
          return 'yyyy-MM-dd HH:mm:ss'
        } else if (type === 'hour') {
          return 'HH';
        } else if (type === 'minute') {
          return 'HH:mm';
        } else if (type === 'second') {
          return 'HH:mm:ss';
        }
      },

      //日期类型显示格式化
      getDateFormat(type) {
        if (type === 'year') {
          return 'yyyy';
        } else if (type === 'month') {
          return 'yyyy-MM';
        } else if (type === 'week') {
          return "yyyy-WW";
        } else if (type === 'day') {
          return 'yyyy-MM-dd';
        } else if (type === 'ymdhms') {
          return 'yyyy-MM-dd HH:mm:ss';
        } else if (type === 'hour') {
          return 'HH';
        } else if (type === 'minute') {
          return 'HH:mm';
        } else if (type === 'second') {
          return 'HH:mm:ss';
        }
      },

      showManualInput() {
        this.manualText = '';
      },

      clearAllEnum() {
        this.$set(this.condFilter, 'conds1', []);
      },

      deleteAEnum(index) {
        this.condFilter.conds1.splice(index, 1);
      },

      saveManualText() {
        let condFilter = this.condFilter;
        if (condFilter.conds1.length <= 500) {
          if (!this.KHUtils.isNull(this.manualText)) {
            let manualValues = [];
            let arr = this.manualText.split("\n");
            for (let i = 0; i < arr.length; i++) {
              let item = arr[i];
              if (!item.match(/^[ ]*$/)) {
                let value = item.replace(/(^\s*)|(\s*$)/g, "");
                let flag = false;
                condFilter.conds1.forEach(cond => {
                  if (cond === value) {
                    flag = true;
                  }
                });
                if (!flag) {
                  manualValues.push(value);
                }
              } else {
                arr.splice(i, 1);
                i--;
              }
            }
            let checkArr = Array.from(new Set(manualValues));
            if (checkArr.length > 0) {
              condFilter.conds1.push(...checkArr);
              this.$message({
                type: 'success',
                message: '手工输入添加成功'
              });
            }
          }
        }
      },

      //保存当前的过滤条件
      saveCondFilter() {
        let condFilter = this.condFilter;
        let condFilterObject = {};
        this.$set(condFilterObject, 'id', condFilter.id);
        this.$set(condFilterObject, 'table', condFilter.table);
        this.$set(condFilterObject, 'column', condFilter.column);
        this.$set(condFilterObject, 'desc', condFilter.desc);
        this.$set(condFilterObject, 'dataType', condFilter.dataType);
        this.$set(condFilterObject, 'alias', condFilter.alias);
        this.$set(condFilterObject, 'express', condFilter.express);
        this.$set(condFilterObject, 'itemType', condFilter.itemType);

        if (condFilter.itemType === 'dim' && condFilter.dataType === "String") {
          this.$set(condFilterObject, 'filterType', condFilter.filterType);
          this.$set(condFilterObject, 'condType', condFilter.condType);
          if (condFilter.filterType === 0) {
            this.$set(condFilterObject, 'conds0', []);
            for (let i = 0; i < condFilter.conds0.length; i++) {
              if (!this.KHUtils.isNull(condFilter.conds0[i].value) || condFilter.conds0[i].matchType === "$null" || condFilter.conds0[i].matchType === '$notnull') {
                condFilterObject.conds0.push(condFilter.conds0[i]);
              }
            }
            if (condFilterObject.conds0.length === 0) {
              this.$delete(condFilterObject, 'conds0');
              this.$delete(condFilterObject, 'conds1');
            }
          } else {
            this.$set(condFilterObject, 'conds1', []);
            for (let i = 0; i < condFilter.conds1.length; i++) {
              if (!this.KHUtils.isNull(condFilter.conds1[i])) {
                condFilterObject.conds1.push(condFilter.conds1[i]);
              }
            }
            if (condFilterObject.conds1.length === 0) {
              this.$delete(condFilterObject, 'conds0');
              this.$delete(condFilterObject, 'conds1');
            }
          }
        } else if (condFilter.itemType === 'measure') {
          this.$set(condFilterObject, 'aggregate', condFilter.aggregate);
          this.$set(condFilterObject, 'condType', condFilter.condType);
          this.$set(condFilterObject, 'conds', []);
          for (let i = 0; i < condFilter.conds.length; i++) {
            if (!this.KHUtils.isNull(condFilter.conds[i].value)) {
              condFilterObject.conds.push(condFilter.conds[i]);
            }
          }
          if (condFilterObject.conds.length === 0) {
            this.$delete(condFilterObject, 'conds');
          }
        } else if (condFilter.dataType === 'Date') {
          this.$set(condFilterObject, 'dateDim', condFilter.dateDim);
          this.$set(condFilterObject, 'filterType', condFilter.filterType);
          this.$set(condFilterObject, 'conds', []);
          for (let i = 0; i < condFilter.conds.length; i++) {
            if (!this.KHUtils.isNull(condFilter.conds[i].value)) {
              condFilterObject.conds.push(condFilter.conds[i]);
            }
          }
          if (condFilterObject.conds.length === 0) {
            this.$delete(condFilterObject, 'conds');
          }
        }
        Object.assign(this.$data, this.$options.data());
        this.$emit('save', condFilterObject);
      },

      cancel() {
        Object.assign(this.$data, this.$options.data());
        this.$emit('cancel');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .measure {
    margin-left: 12px;
    background-color: #E3F3E8;
    border: 1px solid #2BC048;
    font-size: small;
    padding: 5px;
  }
  .dim {
    margin-left: 12px;
    background-color: #e6edfb;
    border: 1px solid #468CFF;
    font-size: small;
    padding: 5px;
  }
  .data-set {
    text-align: left;
    background-color: #FFFFFF;
    font-size: small;
    padding: 5px;
  }

 ::v-deep .card-box {
    .el-card__body {
      padding: 0px;
    }
  }

  .conds1-body {
    height: 200px;
    overflow-y: auto;
  }

  .conds1-body::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 5px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .conds1-body::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    &:hover {
      background:  #535353;
    }
    background: #C5C5C5;
  }
  .conds1-body::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #EBEBED;
  }

  .conds1-row {
    height: 35px;
    line-height: 35px;
    padding-left: 10px;
    width: 100%;
    &:hover {
      background-color: #F8F8FA;
      color: #3B67D9;
      & i {
        visibility: visible;
      }
    }
    & i {
      visibility: hidden;
    }
  }

  .conds1-item {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  .cond-filter-text {
    margin-left: 3%;
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 80%;
    display: block;
    overflow: hidden;
  }

  .data-set-text {
    white-space: nowrap;
    text-overflow: ellipsis;
    width: 100%;
    display: block;
    overflow: hidden;
  }

  .cond-type-measure {
    color: #3BC15A;
  }

  .cond-type-dim {
    color: #5091f7;
  }

  .filter-head {
    display: flex;
    align-items: center;
    flex-direction: row;
  }

 ::v-deep .enum-item {
    .el-checkbox__label {
      overflow: hidden;
      vertical-align: top;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 350px;
    }
  }
</style>
