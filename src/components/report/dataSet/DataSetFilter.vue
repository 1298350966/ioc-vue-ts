<template>
  <el-container class="container">
    <!--左布局-->
    <el-aside>
      <!--添加过滤字段-->
      <el-row style="margin-left: 15px;margin-top: 20px">
        <el-col :span="8" style="text-align: left; font-size: 12px;margin-top: 9px">
          过滤字段项
        </el-col>
        <el-col :span="2" :offset="12" class="add-button">
          <el-button type="primary" icon="el-icon-plus" @click="handleAddCondFilter" size="mini" circle></el-button>
        </el-col>
      </el-row>
      <el-row style="margin-top: 15px"></el-row>
      <!--过滤字段-->
      <div class="filter-box">
        <el-row v-for="(item,index) in condFilters" :key="index" class="row-select" @click.native="handleClickRowSelect(index)" :style="rowSelectStyle(index)">
          <el-select v-model="condFilters[index]" :class="condSelectClass(index)"
                     :title="condFilterLabel(index)"
                     placeholder="请选择过滤字段" filterable value-key="id"
                     @change="handleSelectCondFilter($event,index)"
                     @focus="handleFocusCondFilter(index)">
            <el-option-group
              v-for="(group,index1) in filterOptions"
              :key="index1"
              :label="group.label">
              <el-option
                v-for="(item1,index2) in group.options"
                :disabled="item1.disabled"
                :key="index2"
                :label="item1.label"
                :value="item1.value"
                :title="item1.label"
                class="option-box">
                <span style="float: left">{{ item1.label }}</span>
                <span v-if="item1.value.dataType==='Number'" style="float: right; color: #64BD4F; font-size: 13px">No</span>
                <span v-else style="float: right; color: #468CFF; font-size: 13px">{{ item1.value.dataType==="String"?"Str.":"Date" }}</span>
              </el-option>
            </el-option-group>
          </el-select>
          <i class="el-icon-delete" style="cursor: pointer;margin-left: 15px" @click="handleDeleteCondFilter(index)"></i>
        </el-row>
      </div>
    </el-aside>

    <!--右布局-->
    <el-container style="padding-right: 20px;padding-top: 20px;background-color: #F8F8FA">
      <!--标题-->
      <el-header class="title-head">
        <span>设置筛选条件</span>
        <span :title="condFilterText"> {{condFilterText}} </span>
      </el-header>

      <el-main style="background-color: #FFFFFF">
        <!--String类型的页面-->
        <el-row v-if="condFilters[condFilterIndex].dataType==='String'">
          <el-row>
            <el-col :span="12">
              <el-button :type="condFilters[condFilterIndex].filterType===0?'primary':''" style="width: 100%"
                         @click="handleConditionFilter(condFilterIndex)">按条件筛选
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button :type="condFilters[condFilterIndex].filterType===1?'primary':''" style="width: 100%"
                         @click="handleEnumFilter(condFilterIndex)">按枚举筛选
              </el-button>
            </el-col>
          </el-row>
          <el-row v-if="condFilters[condFilterIndex].filterType===0">
            <el-row style="margin-top: 15px">
              <el-col :span="8">
                <el-radio v-model="condFilters[condFilterIndex].condType" @change="handleChangeCondType" :label='0'>
                  单条件
                </el-radio>
              </el-col>
              <el-col :span="8">
                <el-radio v-model="condFilters[condFilterIndex].condType" @change="handleChangeCondType" :label='1'>或
                </el-radio>
              </el-col>
              <el-col :span="8">
                <el-radio v-model="condFilters[condFilterIndex].condType" @change="handleChangeCondType" :label='2'>且
                </el-radio>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px" v-for="(item,index) in condFilters[condFilterIndex].conds0" :key="index">
              <el-col :span="9">
                <el-select v-model="condFilters[condFilterIndex].conds0[index].matchType" placeholder="请选择">
                  <el-option v-for="(item1,index1) in stringMatchTypeOption"
                             :key="index1"
                             :label="item1.label"
                             :value="item1.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col :span="10" :offset="1" v-if="condFilters[condFilterIndex].conds0[index].matchType!='$null'&&condFilters[condFilterIndex].conds0[index].matchType!='$notnull'">
                <el-input v-model="condFilters[condFilterIndex].conds0[index].value"></el-input>
              </el-col>
              <el-col :span="4" v-if="condFilters[condFilterIndex].condType!==0&&index===0" style="margin-top: 10px">
                <span>{{condFilters[condFilterIndex].condType===0 ?'':condFilters[condFilterIndex].condType===1?'或者':'且'}}</span>
              </el-col>
            </el-row>
          </el-row>
          <el-row v-if="condFilters[condFilterIndex].filterType===1">
            <el-row style="margin-top: 15px">
              <el-col :span="8" :offset="2">
                <el-radio v-model="condFilters[condFilterIndex].condType"
                          @change="handleChangeMultiple($event,condFilterIndex)" :label="0">单选
                </el-radio>
              </el-col>
              <el-col :span="8">
                <el-radio v-model="condFilters[condFilterIndex].condType"
                          @change="handleChangeMultiple($event,condFilterIndex)" :label="1">复选
                </el-radio>
              </el-col>
            </el-row>
            <el-row style="margin-top: 10px">
              <el-col :span="4">
                <el-row>
                  <el-popover
                    placement="bottom"
                    ref="popover"
                    :title="condFilters[condFilterIndex].condType===0?'单选':'复选'"
                    width="399"
                    trigger="click">
                    <el-input style="width: 150px;" @change="handleSearchEnumData" v-model="wd">
                      <i slot="prefix" class="el-input__icon el-icon-search"></i>
                    </el-input>
                    <el-row v-if="condFilters[condFilterIndex].condType===0">
                      <el-row v-for="(item,index) in enumData" :key="index" class="enum-item" :title="item">
                        <el-checkbox-group v-model="condFilters[condFilterIndex].conds1">
                          <el-checkbox :label="item" @change="handleChangeEnumData">{{item}}</el-checkbox>
                        </el-checkbox-group>
                      </el-row>
                    </el-row>
                    <el-row v-if="condFilters[condFilterIndex].condType===1">
                      <el-row v-for="(item,index) in enumData" :key="index" class="enum-item" :title="item">
                        <el-checkbox-group v-model="condFilters[condFilterIndex].conds1">
                          <el-checkbox :label="item">{{item}}</el-checkbox>
                        </el-checkbox-group>
                      </el-row>
                    </el-row>
                    <el-pagination
                      @current-change="handleCurrentChange"
                      :current-page="pageNum"
                      background
                      :page-size="10"
                      :pager-count="4"
                      :hide-on-single-page="true"
                      layout="prev, pager, next"
                      :total="totalCount">
                    </el-pagination>
                    <el-button icon="el-icon-search" slot="reference" size="mini">点击选择内容</el-button>
                  </el-popover>
                </el-row>
                <el-row style="margin-top: 10px" v-if="condFilters[condFilterIndex].condType===1">
                  <el-popover
                    placement="bottom"
                    width="250"
                    @after-leave="saveManualText"
                    trigger="click">
                    <el-input type="textarea" v-model="manualText"
                              :autosize="{ minRows: 5, maxRows: 10}"
                              placeholder="请一行填一个，最多添加500个,识别录入时会自动过滤重复的选项和已经添加过的选项"></el-input>
                    <el-button type="primary" icon="el-icon-edit" size="mini"
                               @click="showManualInput" slot="reference">手工输入</el-button>
                  </el-popover>
                </el-row>
              </el-col>
              <el-col :span="15" :offset="5">
                <el-card class="card-box"  shadow="hover" ref="enumCard">
                  <el-row slot="header">
                    <span v-if="condFilters[condFilterIndex].conds1.length===0">
                      已选内容
                    </span>
                    <span v-else>
                      已选内容({{condFilters[condFilterIndex].conds1.length}})
                    </span>
                    <el-button style="float: right; padding: 3px 0" type="text" @click="clearAllEnum">清空</el-button>
                  </el-row>
                  <div class="conds1-body">
                    <el-row v-if="condFilters[condFilterIndex].conds1.length===0" style="text-align: center;margin-top: 55px">
                      请从左侧进行添加
                    </el-row>
                    <el-row v-for="(item,index) in condFilters[condFilterIndex].conds1" :key="index"
                            class="conds1-row"
                            :title="condFilters[condFilterIndex].conds1[index]">
                      <el-col :span="21" class="conds1-item">
                        {{ condFilters[condFilterIndex].conds1[index] }}
                      </el-col>
                      <el-col :span="3">
                        <i class="el-icon-delete" style="cursor: pointer;margin-left: 5px" @click="deleteAEnum"></i>
                      </el-col>
                    </el-row>
                  </div>
                </el-card>
              </el-col>
            </el-row>
          </el-row>
        </el-row>

        <!--Number类型的页面-->
        <el-row v-else-if="condFilters[condFilterIndex].dataType==='Number'">
          <el-row style="margin-top: 15px">
            <el-col :span="8">
              <el-radio v-model="condFilters[condFilterIndex].condType" @change="handleChangeCondType" :label='0'>单条件
              </el-radio>
            </el-col>
            <el-col :span="8">
              <el-radio v-model="condFilters[condFilterIndex].condType" @change="handleChangeCondType" :label='1'>或
              </el-radio>
            </el-col>
            <el-col :span="8">
              <el-radio v-model="condFilters[condFilterIndex].condType" @change="handleChangeCondType" :label='2'>且
              </el-radio>
            </el-col>
          </el-row>
          <el-row style="margin-top: 10px" v-for="(item,index) in condFilters[condFilterIndex].conds" :key="index">
            <el-col :span="9">
              <el-select v-model="condFilters[condFilterIndex].conds[index].matchType" placeholder="请选择">
                <el-option v-for="(item1,index1) in numberMatchTypeOption"
                           :key="index1"
                           :label="item1.label"
                           :value="item1.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col :span="10" :offset="1">
              <el-input type="number" v-model="condFilters[condFilterIndex].conds[index].value"></el-input>
            </el-col>
            <el-col :span="4" v-if="condFilters[condFilterIndex].condType!==0&&index===0" style="margin-top: 10px">
              <span>{{condFilters[condFilterIndex].condType===0 ?'':condFilters[condFilterIndex].condType===1?'或者':'且'}}</span>
            </el-col>
          </el-row>
        </el-row>

        <!--日期类型的页面-->
        <el-row v-else-if="condFilters[condFilterIndex].dataType==='Date'">
          <el-row>
            <el-col :span="12">
              <el-button :type="condFilters[condFilterIndex].filterType===1?'primary':''" style="width: 100%"
                         @click="handleIntervalDateFilter(condFilterIndex)">区间粒度
              </el-button>
            </el-col>
            <el-col :span="12">
              <el-button :type="condFilters[condFilterIndex].filterType===0?'primary':''" style="width: 100%"
                         @click="handleSingleDateFilter(condFilterIndex)">日期粒度
              </el-button>
            </el-col>
          </el-row>
          <el-row>
            <el-tag type="info" effect="dark" :disable-transitions="true" style="margin-top: 15px">
              {{condFilters[condFilterIndex].filterType===0?'精确时间':'时间区间'}}
            </el-tag>
          </el-row>
          <el-row style="margin-top: 15px;font-size: 12px">
            <el-col :span="12" v-if="condFilters[condFilterIndex].filterType===1">开始于：</el-col>
            <el-col :span="12" v-else>精确于：</el-col>
            <el-col :span="12" v-if="condFilters[condFilterIndex].filterType===1">结束于：</el-col>
          </el-row>
          <el-row style="margin-top: 10px">
            <!--年月-->
            <el-row v-if="condFilters[condFilterIndex].dateType==='year' || condFilters[condFilterIndex].dateType==='month'">
              <el-col :span="8" v-for="(item,index) in condFilters[condFilterIndex].conds" :key="index" :offset="index===1?4:0">
                <el-date-picker
                  @change="handleChangeDate($event,index)"
                  :value-format="getDateValueFormat(condFilters[condFilterIndex].dateType)"
                  :format="getDateFormat(condFilters[condFilterIndex].dateType)"
                  size="mini"
                  style="width: 150px"
                  v-model="condFilters[condFilterIndex].conds[index].value"
                  :type="condFilters[condFilterIndex].dateType"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
            <!--周-->
            <el-row v-if="condFilters[condFilterIndex].dateType==='week'">
              <el-col :span="8" v-for="(item,index) in condFilters[condFilterIndex].conds" :key="index" :offset="index===1?4:0">
                <custom-week-picker placeholder="请选择日期"
                                    @change="handleChangeDate($event,index)"
                                    v-model="condFilters[condFilterIndex].conds[index].value">
                </custom-week-picker>
              </el-col>
            </el-row>
            <!--日-->
            <el-row v-if="condFilters[condFilterIndex].dateType==='day'">
              <el-col :span="8" v-for="(item,index) in condFilters[condFilterIndex].conds" :key="index" :offset="index===1?4:0">
                <el-date-picker
                  @change="handleChangeDate($event,index)"
                  :value-format="getDateValueFormat(condFilters[condFilterIndex].dateType)"
                  :format="getDateFormat(condFilters[condFilterIndex].dateType)"
                  :picker-options="{'firstDayOfWeek': 1}"
                  size="mini"
                  style="width: 150px"
                  v-model="condFilters[condFilterIndex].conds[index].value"
                  type="date"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
            <!--季度-->
            <el-row v-if="condFilters[condFilterIndex].dateType==='quarter'">
              <el-col :span="8" v-for="(item,index) in condFilters[condFilterIndex].conds" :key="index" :offset="index===1?4:0">
                <custom-quarter-picker
                  placeholder="请选择日期"
                  @change="handleChangeDate($event,index)"
                  v-model="condFilters[condFilterIndex].conds[index].value"></custom-quarter-picker>
              </el-col>
            </el-row>
            <!--年月日时分秒-->
            <el-row v-if="condFilters[condFilterIndex].dateType==='ymdhms'">
              <el-col :span="8" v-for="(item,index) in condFilters[condFilterIndex].conds" :key="index" :offset="index===1?4:0">
                <el-date-picker
                  @change="handleChangeDate($event,index)"
                  :value-format="getDateValueFormat(condFilters[condFilterIndex].dateType)"
                  :format="getDateFormat(condFilters[condFilterIndex].dateType)"
                  :picker-options="{'firstDayOfWeek': 1}"
                  v-model="condFilters[condFilterIndex].conds[index].value"
                  size="mini"
                  style="width: 180px"
                  type="datetime"
                  placeholder="请选择日期">
                </el-date-picker>
              </el-col>
            </el-row>
            <!--小时-->
            <el-row v-if="condFilters[condFilterIndex].dateType==='hour'">
              <el-col :span="8" v-for="(item,index) in condFilters[condFilterIndex].conds" :key="index" :offset="index===1?4:0">
                <custom-hour-picker
                  placeholder="请选择时间"
                  @change="handleChangeDate($event,index)"
                  v-model="condFilters[condFilterIndex].conds[index].value"></custom-hour-picker>
              </el-col>
            </el-row>
            <!--分钟、秒-->
            <el-row v-if="condFilters[condFilterIndex].dateType==='second' || condFilters[condFilterIndex].dateType==='minute'">
              <el-col :span="8" v-for="(item,index) in condFilters[condFilterIndex].conds" :key="index" :offset="index===1?4:0">
                <el-time-picker
                  @change="handleChangeDate($event,index)"
                  :value-format="getDateValueFormat(condFilters[condFilterIndex].dateType)"
                  :format="getDateFormat(condFilters[condFilterIndex].dateType)"
                  v-model="condFilters[condFilterIndex].conds[index].value"
                  size="mini"
                  style="width: 150px"
                  placeholder="请选择时间">
                </el-time-picker>
              </el-col>
            </el-row>
          </el-row>
        </el-row>

        <el-row v-else style="width: 100%;height: 100%;display: flex;flex-direction: column;justify-content: center;overflow: hidden">
          <img src="@/assets/images/none.png" style="width: 80%;height: 60%;margin-left: auto;margin-right: auto"/>
          <p class="font-none">暂无过滤字段，请先在左侧添加过滤字段!</p>
        </el-row>
      </el-main>

      <el-footer>
        <el-row type="flex" justify="end">
          <el-col :span="4">
            <el-button @click="cancel">取消</el-button>
          </el-col>
          <el-col :span="4">
            <el-button type="primary" @click="saveCondFilters">确定</el-button>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>
  </el-container>
</template>

<script>
  import CustomQuarterPicker from "@/components/CustomQuarterPicker";
  import CustomHourPicker from "@/components/CustomHourPicker";
  import CustomWeekPicker from "@/components/CustomWeekPicker";

  let types = ['year', 'quarter', 'month', 'week', 'day', 'hour', 'minute', 'second', 'ymdhms'];

  export default {
    components: {
      CustomQuarterPicker,CustomHourPicker, CustomWeekPicker
    },

    props: ['filters','dsId'],

    computed: {
      condSelectClass() {
        return function (index) {
          if (this.condFilters[index].hasOwnProperty('dataType')) {
            if (this.condFilters[index].dataType === 'Number') {
              return 'measure-select';
            } else {
              return 'dim-select';
            }
          } else {
            return 'default-select';
          }
        };
      },
      rowSelectStyle() {
        return function (index) {
          if (index === this.condFilterIndex) {
            if (this.condFilters[index].hasOwnProperty('dataType')) {
              if (this.condFilters[index].dataType === 'Number') {
                return 'border: 2px solid #2BC048';
              }
            }
            return 'border: 2px solid #468CFF';
          }
        };
      },
      condFilterLabel() {
        return function (index) {
          let condFilter = this.condFilters[index];
          let condFilterLabel = '';
          if (JSON.stringify(condFilter) !== '{}') {
            condFilterLabel = condFilter.column;
            if (!this.KHUtils.isNull(condFilter.alias)) {
              condFilterLabel = condFilter.alias + '(' + condFilter.column + ')';
            }
            if (!this.KHUtils.isNull(condFilter.dateType)) {
              condFilterLabel = condFilterLabel + '(' + condFilter.dateType + ')';
            }
          }
          return condFilterLabel;
        };
      }
    },

    data() {
      return {
        condFilterText: '',
        manualText: '',
        pageNum: 1,
        totalCount: 0,
        condFilterIndex: 0,
        condFilters: [{}],
        columns: {},
        filterOptions: [],
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
        enumData: [],
        numberMatchTypeOption: [
          {label: '=', value: '$eq'},
          {label: '≠', value: '$neq'},
          {label: '>', value: '$gt'},
          {label: '>=', value: '$gte'},
          {label: '<', value: '$lt'},
          {label: '<=', value: '$lte'}
        ],
        //枚举查询关键字
        wd: '',
        //临时字段，用来将禁用的字段恢复
        temp: []
      };
    },

    methods: {
      handleClickRowSelect(index) {
        this.condFilterIndex = index;
        let condFilter = this.condFilters[index];
        if (JSON.stringify(condFilter) !== '{}') {
          this.showCondFilterText(condFilter);
          if (condFilter.dataType === "String") {
            if (condFilter.filterType === 1) {
              this.getEnumData(condFilter);
            }
          }
        } else {
          this.condFilterText = "";
        }
      },
      //单选选择枚举数据后
      handleChangeEnumData() {
        let conds1 = this.condFilters[this.condFilterIndex].conds1;
        conds1.splice(0, conds1.length - 1);
      },

      //页面初始化
      init(val, val1) {
        //让data数据为默认值
        Object.assign(this.$data, this.$options.data());
        this.columns = JSON.parse(val);
        this.convertColumnsToDataBind(this.columns);
        if (val1 === '[]') {
          this.condFilters = [{}];
        } else {
          let condFilters = JSON.parse(val1);
          for (let i = 0; i < condFilters.length; i++) {
            let condFilter = condFilters[i];
            let table = condFilter.table;
            let column = condFilter.column;
            let dataType = condFilter.dataType;
            if (condFilter.hasOwnProperty('dateDim')) {
              let dateDim = condFilter.dateDim;
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
              this.$delete(condFilter, 'dateDim');
              this.$set(condFilter, 'dateType', dateDim);
            } else if (dataType === 'String') {
              if (condFilter.condType !== 0 && condFilter.filterType === 0) {
                if (condFilter.conds0.length === 1) {
                  condFilter.conds0.push({
                    matchType: '$eq',
                    value: ''
                  });
                }
              }
            } else if (dataType === 'Number') {
              if (condFilter.condType !== 0) {
                if (condFilter.conds.length === 1) {
                  condFilter.conds.push({
                    matchType: '$eq',
                    value: ''
                  });
                }
              }
            }
            //添加id，让选择框可以回显，并添加disabled
            for (let j = 0; j < this.filterOptions.length; j++) {
              let filterOption = this.filterOptions[j];
              if (filterOption.label === table) {
                let t = 0;
                for (let k = 0; k < filterOption.options.length; k++) {
                  let option = filterOption.options[k];
                  let value = option.value;
                  if (value.column === column) {
                    if (dataType === 'Date') {
                      if (condFilter.dateType === value.dateType) {
                        this.$set(condFilter, 'id', value.id);
                        this.$set(option, 'disabled', true);
                        this.temp.push({
                          i: j,
                          j: k,
                          index: i
                        });
                      }
                    } else {
                      this.$set(condFilter, 'id', value.id);
                      this.$set(option, 'disabled', true);
                      this.temp.push({
                        i: j,
                        j: k,
                        index: i
                      });
                    }
                  }
                }
              }
            }
          }
          this.condFilters = condFilters;
          //显示信息
          this.showCondFilterText(condFilters[0]);
          if (condFilters[0].dataType === "String") {
            if (condFilters[0].filterType === 1) {
              this.getEnumData(condFilters[0]);
            }
          }
        }
      },

      //将columns字段转为能进行数据绑定的字段
      convertColumnsToDataBind(columns) {
        this.filterOptions = [];
        let measure = columns.measure;
        let dim = columns.dim;

        let tablesLocation = [];

        //记录表名相同的维度和度量数组下表
        for (let i = 0; i < measure.length; i++) {
          let measureTable = measure[i].table;
          for (let j = 0; j < dim.length; j++) {
            if (dim[j].table === measureTable) {
              tablesLocation.push({
                measure: i,
                dim: j
              });
              break;
            }
          }
        }

        //找出只有维度的表
        for (let i = 0; i < dim.length; i++) {
          let flag = false;
          for (let j = 0; j < tablesLocation.length; j++) {
            if (tablesLocation[j].dim === i) {
              flag = true;
            }
          }
          if (!flag) {
            tablesLocation.push({
              measure: null,
              dim: i
            });
          }
        }

        //找出只有度量的表
        for (let i = 0; i < measure.length; i++) {
          let flag = false;
          for (let j = 0; j < tablesLocation.length; j++) {
            if (tablesLocation[j].measure === i) {
              flag = true;
            }
          }
          if (!flag) {
            tablesLocation.push({
              measure: i,
              dim: null
            });
          }
        }

        let data = [];

        //封装成选择框的数据
        for (let i = 0; i < tablesLocation.length; i++) {
          let measureLocation = tablesLocation[i].measure;
          let dimLocation = tablesLocation[i].dim;
          let item = {
            columns: [],
            table: ''
          }
          if (dimLocation != null) {
            let dimColumns = dim[dimLocation].columns;
            item.table = dim[dimLocation].table;
            item.columns = dimColumns;
          }
          if (measureLocation != null) {
            let measureColumns = measure[measureLocation].columns;
            item.table = measure[measureLocation].table;
            for (let measureColumn of measureColumns) {
              item.columns.push(measureColumn);
            }
          }
          data.push(item);
        }

        for (let element of data) {
          let filterOption = {
            label: '',
            options: []
          };
          filterOption.label = element.table;
          for (let i = 0; i < element.columns.length; i++) {
            let column = element.columns[i];
            if (this.KHUtils.isNull(column.express)) {
              if (column.dataType === "Date") {
                //年 季度 月 周 日
                for (let j = 0; j < 5; j++) {
                  let dateChild = {
                    value: {},
                    label: ''
                  };
                  let dateValue = {
                    id: element.table + i + "-" + j,
                    table: element.table,
                    column: column.column,
                    desc: column.desc,
                    dataType: 'Date',
                    dateType: types[j],
                    alias: column.alias,
                    express: column.express
                  };
                  dateChild.value = dateValue;
                  if (this.KHUtils.isNull(column.alias)) {
                    dateChild.label = column.column + "(" + types[j] + ")";
                  } else {
                    dateChild.label = column.alias + "(" + column.column + ")" + "(" + types[j] + ")";
                  }
                  filterOption.options.push(dateChild);
                }
              } else if (column.dataType === "Time") {
                //小时 分钟 秒
                for (let j = 5; j < 8; j++) {
                  let dateChild = {
                    value: {},
                    label: ''
                  };
                  let dateValue = {
                    id: element.table + i + "-" + j,
                    table: element.table,
                    column: column.column,
                    desc: column.desc,
                    dataType: 'Date',
                    dateType: types[j],
                    alias: column.alias,
                    express: column.express
                  };
                  dateChild.value = dateValue;
                  if (this.KHUtils.isNull(column.alias)) {
                    dateChild.label = column.column + "(" + types[j] + ")";
                  } else {
                    dateChild.label = column.alias + "(" + column.column + ")" + "(" + types[j] + ")";
                  }
                  filterOption.options.push(dateChild);
                }
              } else if (column.dataType === "Timestamp") {
                //年 季度 月 周 日 小时 分钟 秒 年月日时分秒
                for (let j = 0; j < 9; j++) {
                  let dateChild = {
                    value: {},
                    label: ''
                  };
                  let dateValue = {
                    id: element.table + i + "-" + j,
                    table: element.table,
                    column: column.column,
                    desc: column.desc,
                    dataType: 'Date',
                    dateType: types[j],
                    alias: column.alias,
                    express: column.express
                  };
                  dateChild.value = dateValue;
                  if (this.KHUtils.isNull(column.alias)) {
                    dateChild.label = column.column + "(" + types[j] + ")";
                  } else {
                    dateChild.label = column.alias + "(" + column.column + ")" + "(" + types[j] + ")";
                  }
                  filterOption.options.push(dateChild);
                }
              } else {
                let child = {
                  value: {},
                  label: ''
                };
                let value = {
                  id: element.table + i,
                  table: element.table,
                  column: column.column,
                  desc: column.desc,
                  dataType: column.dataType,
                  dateType: '',
                  alias: column.alias,
                  express: column.express
                };
                child.value = value;
                if (column.alias) {
                  child.label = column.alias + "(" + column.column + ")";
                } else {
                  child.label = column.column;
                }
                filterOption.options.push(child);
              }
            }
          }
          this.filterOptions.push(filterOption);
        }
      },

      //添加过滤字段
      handleAddCondFilter() {
        this.condFilters.push({});
      },

      //选中过滤字段后进行字段处理
      handleSelectCondFilter(val, index) {
        this.condFilterIndex = index;
        let condFilter = this.condFilters[index];

        //不能选择重复字段,设置disabled
        for (let i = 0; i < this.filterOptions.length; i++) {
          let filterOption = this.filterOptions[i];
          if (filterOption.label === val.table) {
            for (let j = 0; j < filterOption.options.length; j++) {
              let option = filterOption.options[j];
              if (option.value.id === val.id) {
                for (let k = 0; k < this.temp.length; k++) {
                  let tempElement = this.temp[k];
                  if (tempElement.index === index) {
                    this.filterOptions[tempElement.i].options[tempElement.j].disabled = false;
                    this.temp.splice(k, 1);
                  }
                }
                this.$set(option, 'disabled', true);
                this.temp.push({
                  i: i,
                  j: j,
                  index: index
                });
              }
            }
          }
        }

        //删除当前已有的String、Number、Date类型字段
        if (condFilter.hasOwnProperty('filterType')) {
          this.$delete(condFilter, 'filterType');
        }
        if (condFilter.hasOwnProperty('condType')) {
          this.$delete(condFilter, 'condType');
        }
        if (condFilter.hasOwnProperty('conds0')) {
          this.$delete(condFilter, 'conds0');
        }
        if (condFilter.hasOwnProperty('conds1')) {
          this.$delete(condFilter, 'conds1');
        }
        if (condFilter.hasOwnProperty('conds')) {
          this.$delete(condFilter, 'conds');
        }
        if (condFilter.hasOwnProperty('aggregate')) {
          this.$delete(condFilter, 'aggregate');
        }
        if (condFilter.hasOwnProperty('dateDim')) {
          this.$delete(condFilter, 'dateDim');
        }

        //设置当前类型的字段
        if (val.dataType === "String") {
          this.$set(condFilter, 'filterType', 0);
          this.$set(condFilter, 'condType', 0);
          this.$set(condFilter, 'conds0', [{
            matchType: '$eq',
            value: ""
          }]);
          this.$set(condFilter, 'conds1', []);
        }
        if (val.dataType === "Number") {
          this.$set(condFilter, 'aggregate', 'none')
          this.$set(condFilter, 'condType', 0);
          this.$set(condFilter, 'conds', [{
            matchType: '$eq',
            value: ""
          }]);
        }
        if (val.dataType === "Date") {
          this.$set(condFilter, 'dateDim', val.dateType);
          this.$set(condFilter, 'filterType', 1);
          this.$set(condFilter, 'conds', [{
            matchType: '$gte',
            value: ""
          }, {
            matchType: '$lte',
            value: ""
          }]);
        }
        this.showCondFilterText(condFilter);
      },

      //字段获得焦点后进行显示
      handleFocusCondFilter(index) {
        this.condFilterIndex = index;
        let condFilter = this.condFilters[index];
        if (JSON.stringify(condFilter) !== '{}') {
          this.showCondFilterText(condFilter);
          if (condFilter.dataType === "String") {
            if (condFilter.filterType === 1) {
              this.getEnumData(condFilter);
            }
          }
        } else {
          this.condFilterText = "";
        }
      },

      //删除过滤字段
      handleDeleteCondFilter(index) {
        let condFilter = this.condFilters[index];
        if (JSON.stringify(condFilter) !== '{}') {
          for (let i = 0; i < this.filterOptions.length; i++) {
            let filterOption = this.filterOptions[i];
            if (filterOption.label === condFilter.table) {
              for (let j = 0; j < filterOption.options.length; j++) {
                let option = filterOption.options[j];
                if (option.value.id === condFilter.id) {
                  this.$set(option, 'disabled', false);
                }
              }
            }
          }
        }
        for (let i = 0; i < this.temp.length; i++) {
          let tempElement = this.temp[i];
          if (tempElement.index === index) {
            this.temp.splice(i, 1);
          }
          if (tempElement.index > index) {
            tempElement.index = tempElement.index - 1;
          }
        }

        //删除字段，并改变索引显示内容
        if (index > this.condFilterIndex) {
          this.condFilters.splice(index, 1);
          this.showCondFilterText(this.condFilters[this.condFilterIndex]);
        } else if (index < this.condFilterIndex) {
          this.condFilters.splice(index, 1);
          this.condFilterIndex = this.condFilterIndex - 1;
          this.showCondFilterText(this.condFilters[this.condFilterIndex]);
        } else if (index === this.condFilterIndex && index !== 0) {
          this.condFilters.splice(index, 1);
          this.condFilterIndex = this.condFilterIndex - 1;
          this.showCondFilterText(this.condFilters[this.condFilterIndex]);
        } else if (index === this.condFilterIndex && index === 0) {
          if (this.condFilters.length - 1 === 0) {
            this.condFilters.splice(index, 1);
            this.condFilters.push({});
            this.condFilterText = '';
          }
          if (this.condFilters.length - 1 !== 0) {
            this.condFilters.splice(index, 1);
            this.showCondFilterText(this.condFilters[this.condFilterIndex]);
          }
        }
      },

      //String类型按条件筛选
      handleConditionFilter(index) {
        this.condFilters[index].filterType = 0;
        this.condFilters[index].condType = 0;
        this.$set(this.condFilters[index], 'conds1', []);
        this.$set(this.condFilters[index], 'conds0', [{
          matchType: "$eq",
          value: ""
        }]);
      },

      //String类型按枚举筛选
      handleEnumFilter(index) {
        this.condFilters[index].filterType = 1;
        this.condFilters[index].condType = 0;
        this.$set(this.condFilters[index], 'conds1', []);
        this.$set(this.condFilters[index], 'conds0', []);
        this.getEnumData(this.condFilters[index]);
      },

      //枚举类型点击单选或者多选
      handleChangeMultiple(val, index) {
        this.condFilters[index].conds1 = [];
        this.condFilters[index].condType = val;
      },

      //处理单、且、或条件
      handleChangeCondType(val) {
        let condFilter = this.condFilters[this.condFilterIndex];
        if (val === 0) {
          if (condFilter.dataType === "String") {
            condFilter.conds0 = [{
              matchType: '$eq',
              value: ""
            }];
          }
          if (condFilter.dataType === "Number") {
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          }
        } else {
          if (condFilter.dataType === "String") {
            condFilter.conds0 = [{
              matchType: '$eq',
              value: ""
            }, {
              matchType: '$eq',
              value: ""
            }];
          }
          if (condFilter.dataType === "Number") {
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

      //右上角显示过滤字段名称
      showCondFilterText(condFilter) {
        let condFilterLabel = '';
        if (JSON.stringify(condFilter) !== '{}') {
          condFilterLabel = condFilter.column;
          if (!this.KHUtils.isNull(condFilter.alias)) {
            condFilterLabel = condFilter.alias + '(' + condFilter.column + ')';
          }
          if (!this.KHUtils.isNull(condFilter.dateType)) {
            condFilterLabel = condFilterLabel + '(' + condFilter.dateType + ')';
          }
        }
        this.condFilterText = condFilterLabel;
      },

      //保存手工录入的内容
      saveManualText() {
        let condFilter = this.condFilters[this.condFilterIndex];
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

      //保存过滤字段，对已经绑定的数据进行格式处理，保存为符合格式的json数据
      saveCondFilters() {
        let condFiltersArray = [];
        for (let i = 0; i < this.condFilters.length; i++) {
          let condFilter = this.condFilters[i];
          if (JSON.stringify(condFilter) !== "{}") {
            if (condFilter.dataType === "String") {
              if (condFilter.filterType === 0) {
                let condFilterObject = {
                  table: condFilter.table,
                  column: condFilter.column,
                  desc: condFilter.desc,
                  dataType: "String",
                  alias: condFilter.alias,
                  express: condFilter.express,
                  filterType: 0,
                  condType: condFilter.condType,
                  conds0: []
                };
                for (let j = 0; j < condFilter.conds0.length; j++) {
                  if (!this.KHUtils.isNull(condFilter.conds0[j].value) || condFilter.conds0[j].matchType === "$null" || condFilter.conds0[j].matchType === '$notnull') {
                    condFilterObject.conds0.push(condFilter.conds0[j]);
                  }
                }
                if (condFilterObject.conds0.length > 0) {
                  condFiltersArray.push(condFilterObject);
                }
              } else {
                let condFilterObject = {
                  table: condFilter.table,
                  column: condFilter.column,
                  desc: condFilter.desc,
                  dataType: "String",
                  alias: condFilter.alias,
                  express: condFilter.express,
                  filterType: 1,
                  condType: condFilter.condType,
                  conds1: []
                };
                for (let j = 0; j < condFilter.conds1.length; j++) {
                  condFilterObject.conds1.push(condFilter.conds1[j]);
                }
                if (condFilterObject.conds1.length > 0) {
                  condFiltersArray.push(condFilterObject);
                }
              }
            }
            if (condFilter.dataType === "Number") {
              let condFilterObject = {
                table: condFilter.table,
                column: condFilter.column,
                desc: condFilter.desc,
                dataType: "Number",
                alias: condFilter.alias,
                express: condFilter.express,
                aggregate: condFilter.aggregate,
                // 条件形式：0单条件，1或条件，2且条件
                condType: condFilter.condType,
                // 条件
                conds: []
              };
              for (let j = 0; j < condFilter.conds.length; j++) {
                if (!this.KHUtils.isNull(condFilter.conds[j].value)) {
                  condFilterObject.conds.push(condFilter.conds[j]);
                }
              }
              if (condFilterObject.conds.length > 0) {
                condFiltersArray.push(condFilterObject);
              }
            }
            if (condFilter.dataType === 'Date') {
              let condFilterObject = {
                table: condFilter.table,
                column: condFilter.column,
                desc: condFilter.desc,
                dataType: condFilter.dataType,
                alias: condFilter.alias,
                express: condFilter.express,
                dateDim: condFilter.dateType,
                filterType: condFilter.filterType,
                conds: []
              };
              for (let j = 0; j < condFilter.conds.length; j++) {
                if (!this.KHUtils.isNull(condFilter.conds[j].value)) {
                  condFilterObject.conds.push(condFilter.conds[j]);
                }
              }
              if (condFilterObject.conds.length > 0) {
                condFiltersArray.push(condFilterObject);
              }
            }
          }
        }
        this.$emit('save', JSON.stringify(condFiltersArray));
      },

      //日期类型按区间筛选
      handleIntervalDateFilter(index) {
        this.condFilters[index].conds = [{
          matchType: "$gte",
          value: ""
        }, {
          matchType: "$lte",
          value: ""
        }];
        this.condFilters[index].filterType = 1;
      },

      //日期类型单值筛选
      handleSingleDateFilter(index) {
        this.condFilters[index].conds = [{
          matchType: "$eq",
          value: ""
        }];
        this.condFilters[index].filterType = 0;
      },

      //当选择日期的时候进行判断保证前面的值小于后面的值
      handleChangeDate(val, index) {
        let condFilter = this.condFilters[this.condFilterIndex];
        let conds = condFilter.conds;
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

      clearAllEnum() {
        this.$set(this.condFilters[this.condFilterIndex], 'conds1', []);
      },

      deleteAEnum(index) {
        this.condFilters[this.condFilterIndex].conds1.splice(index, 1);
      },

      //多选选择了枚举数据后
      handleSelectChangeEnumData(val) {
        this.condFilters[this.condFilterIndex].conds1 = val;
      },

      //日期类型格式化
      getDateValueFormat(type) {
        if (type === 'year') {
          return 'yyyy';
        } else if (type === 'month') {
          return 'yyyy-MM';
        } else if (type === 'day') {
          return 'yyyy-MM-dd';
        } else if (type === 'week') {
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

      //获取枚举数据
      getEnumData(condFilter, pageNum = 1, wd = '') {
        let param = {
          dataSetId: this.dsId,
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
      },

      //枚举数据分页展示
      handleCurrentChange(val) {
        this.pageNum = val;
        this.getEnumData(this.condFilters[this.condFilterIndex], val, this.wd);
      },

      //根据关键字搜索枚举数据
      handleSearchEnumData(val) {
        this.pageNum = 1;
        this.wd = val;
        this.getEnumData(this.condFilters[this.condFilterIndex], 1, val);
      },

      //显示手工输入框
      showManualInput() {
        this.manualText = '';
      },

      //点击取消键
      cancel() {
        this.$emit('cancel');
      }
    }
  };
</script>

<style lang="scss" scoped>
  .el-header {
    background-color: #FDFDFD;
    border-bottom: 1px solid #EAEAEA;
    color: #333;
    line-height: 33px;
    text-align: left;
    font-size: 12px;
    height: 35px !important;
  }

  .el-aside {
    color: #333;
    width: 300px;
    background-color: #F8F8FA;
  }

  .el-footer {
    background-color: #F8F8FA;
    line-height: 60px;
  }

  .container {
    height: 500px;
    border: 1px solid #eee;
  }

  .row-select {
    margin-bottom: 10px;
    margin-left: 10px;
    margin-right: 15px;
    padding: 5px;
    box-sizing: border-box;
    background-color: #FFFFFF;
  }

 ::v-deep .dim-select {
    @extend .default-select;
    input.el-input__inner {
      background-color: #ECF1FF;
    }
  }

 ::v-deep .measure-select {
    @extend .default-select;
    input.el-input__inner {
      background-color: #EDF9ED;
    }
  }

 ::v-deep .default-select {
    input.el-input__inner {
      border-radius: 0px;
      border: none;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    .el-input__inner:focus {
      border-color: transparent;
    }
  }

  .font-none {
    text-align: center;
    margin-top: 15%;
    font-size: 15px;
    color: #999999;
  }

  .option-box {
    & span:first-child {
      width: 200px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }

  .title-head {
    & span:nth-child(1){
      float: left;
      width: 20%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
    & span:nth-child(2){
      float: left;
      width: 80%;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
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

 ::v-deep .enum-item {
    .el-checkbox__label {
      overflow: hidden;
      vertical-align: top;
      text-overflow: ellipsis;
      white-space: nowrap;
      width: 350px;
    }
  }

  .filter-box {
    overflow: auto;
    height: 375px;
  }
  .filter-box::-webkit-scrollbar {
    /*滚动条整体样式*/
    width : 5px;  /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }
  .filter-box::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    &:hover {
      background:  #535353;
    }
    background: #C5C5C5;
  }
  .filter-box::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow   : inset 0 0 5px rgba(0, 0, 0, 0.2);
    background   : #EBEBED;
  }


</style>
