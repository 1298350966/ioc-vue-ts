<template>
  <div>
    <div class="content-header">
      <div style="display: flex;flex-direction: row;align-items: center">
        <span style="flex-shrink: 0">选中列</span>
        <div
            style="display: flex;flex-direction: row;height: 30px;align-items: center;flex-wrap: nowrap;background-color: #FFFFFF;margin-left: 15px;width: 200px">
          <div v-html="dataTypeHeader" :title="condFilter.dataType"
               style="margin-left: 10px;flex-shrink: 0"></div>
          <div v-text="condFilter.name" :title="condFilter.name" class="text-over-flow"
               style="margin-left: 5px;margin-right: auto"></div>
        </div>
      </div>
    </div>
    <div class="content-body" :style="contentBodyStyle">
      <template v-if="condFilter.dataType==='String'">
        <div class="content-body-item">
          <span style="margin-right: 15px">过滤方式</span>
          <el-radio :value="condFilter.filterType" @input="handleInputFilterType" :label="0">按条件筛选</el-radio>
          <el-radio :value="condFilter.filterType" @input="handleInputFilterType" :label="1">按枚举筛选</el-radio>
          <el-radio :value="condFilter.filterType" @input="handleInputFilterType" :label="2">按当前筛选</el-radio>
        </div>
        <template v-if="condFilter.filterType===0">
          <div class="content-body-item">
            <span style="margin-right: 15px">条件形式</span>
            <el-radio :value="condFilter.condType" @input="handleInputCondType" :label="0">单条件</el-radio>
            <el-radio :value="condFilter.condType" @input="handleInputCondType" :label="1">或条件</el-radio>
            <el-radio :value="condFilter.condType" @input="handleInputCondType" :label="2">且条件</el-radio>
          </div>
          <div class="content-body-item">
            <div style="display: flex;flex-direction: row;align-items: center">
              <span style="margin-right: 15px">过滤条件</span>
              <template v-if="condFilter.condType===0">
                <el-select v-model="condFilter.conds0[0].matchType" style="width: 100px">
                  <el-option v-for="(option, index) in stringMatchTypeOptions" :key="index"
                             :label="option.label" :value="option.value"></el-option>
                </el-select>
                <el-input
                    v-if="condFilter.conds0[0].matchType !== '$null' && condFilter.conds0[0].matchType !== '$notnull'"
                    v-model="condFilter.conds0[0].value"
                    style="width: 35%;margin-left: 15px"></el-input>
              </template>
              <div v-if="condFilter.condType===1 || condFilter.condType===2" style="width: 350px">
                <span>┌------</span>
                <el-select v-model="condFilter.conds0[0].matchType" style="width: 100px">
                  <el-option v-for="(option, index) in stringMatchTypeOptions" :key="index"
                             :label="option.label" :value="option.value"></el-option>
                </el-select>
                <el-input
                    v-if="condFilter.conds0[0].matchType !== '$null' && condFilter.conds0[0].matchType !== '$notnull'"
                    v-model="condFilter.conds0[0].value"
                    style="width: 35%;margin-left: 15px"></el-input>
                <div>
                  {{ condFilter.condType === 1 ? '或' : '且' }}
                </div>
                <span>└------</span>
                <el-select v-model="condFilter.conds0[1].matchType" style="width: 100px">
                  <el-option v-for="(option) in stringMatchTypeOptions" :key="option.value"
                             :label="option.label" :value="option.value"></el-option>
                </el-select>
                <el-input
                    v-if="condFilter.conds0[1].matchType !== '$null' && condFilter.conds0[1].matchType !== '$notnull'"
                    v-model="condFilter.conds0[1].value"
                    style="width: 35%;margin-left: 15px"></el-input>
              </div>
            </div>
          </div>
        </template>
        <template v-if="condFilter.filterType===1">
          <div class="content-body-item">
            <span style="margin-right: 15px">查询方式</span>
            <el-radio :value="condFilter.condType" @input="handleInputCondType" :label="0">单选</el-radio>
            <el-radio :value="condFilter.condType" @input="handleInputCondType" :label="1">复选</el-radio>
          </div>
          <div class="content-body-item">
            <span style="margin-right: 15px;margin-top: 12px">过滤条件</span>
            <div style="display: flex;flex-direction: column;width: 150px">
              <el-button icon="el-icon-search" v-if="enumDataButtonVisible"
                         @click="openAddConds1Dialog" style="width: 120px" size="mini">点击选择内容
              </el-button>
              <div style="margin-top: 5px"></div>
              <el-popover
                  placement="bottom-end"
                  width="250"
                  @after-leave="saveManualText"
                  trigger="click">
                <el-input type="textarea" v-model="manualText"
                          placeholder="请一行填一个，最多添加500个,识别录入时会自动过滤重复的选项和已经添加过的选项"
                          :autosize="{ minRows: 5, maxRows: 10}"></el-input>
                <el-button type="primary" icon="el-icon-edit" size="mini"
                           @click="showManualInput" slot="reference">手工输入
                </el-button>
              </el-popover>
            </div>
            <el-card class="card-box" shadow="never">
              <div slot="header">
                <span v-if="condFilter.conds1.length===0">
                  已选内容
                </span>
                <span v-else>已选内容({{ condFilter.conds1.length }})</span>
                <el-button style="float: right; padding: 3px 0" type="text" @click="clearAllEnum">清空
                </el-button>
              </div>
              <div class="conds1-body">
                <div v-if="condFilter.conds1.length===0" style="text-align: center;margin-top: 55px">
                  请从左侧进行添加
                </div>
                <div v-for="(item,index) in condFilter.conds1" :key="index" class="conds1-item"
                     :title="condFilter.conds1[index]">
                  <span>{{ condFilter.conds1[index] }}</span>
                  <i class="el-icon-delete" style="cursor: pointer" @click="deleteAEnum(index)"></i>
                </div>
              </div>
            </el-card>
          </div>
        </template>
        <template v-if="condFilter.filterType===2">
          <div class="content-body-item">
            <span style="margin-right: 15px">条件形式</span>
            <el-radio-group v-model="condFilter.condType"  @change="currentFilterType">
              <el-radio :label="0">当前用户</el-radio>
              <!-- <el-radio :label="1">当前时间</el-radio> -->
            </el-radio-group>
            
          </div>
          <div class="content-body-item">
            <div v-if="condFilter" style="display: flex;flex-direction: row;align-items: center">
              <span style="margin-right: 15px">过滤条件</span>
              <template v-if="condFilter.condType === 0">
                <el-select  v-model="condFilter.conds2[0].matchType"  style="width: 180px">
                  <el-option v-for="(option, index) in currentUserOptions" :key="index"
                             :label="option.label" :value="option.value"></el-option>
                </el-select>
              </template>
            </div>
          </div>
        </template>
      </template>
      <template v-if="condFilter.dataType==='Number'">
        <div class="content-body-item">
          <span style="margin-right: 15px">条件形式</span>
          <el-radio :value="condFilter.condType" @input="handleInputCondType" :label="0">单条件</el-radio>
          <el-radio :value="condFilter.condType" @input="handleInputCondType" :label="1">或条件</el-radio>
          <el-radio :value="condFilter.condType" @input="handleInputCondType" :label="2">且条件</el-radio>
        </div>
        <div class="content-body-item">
          <span style="margin-right: 15px;margin-top: 5px">过滤条件</span>
          <template v-if="condFilter.condType===0">
            <el-select v-model="condFilter.conds[0].matchType" style="width: 20%">
              <el-option v-for="(option, index) in numberMatchTypeOption" :key="index"
                         :label="option.label" :value="option.value"></el-option>
            </el-select>
            <el-input type="number" v-model="condFilter.conds[0].value"
                      style="width: 35%;margin-left: 15px"></el-input>
          </template>
          <div v-if="condFilter.condType===1 || condFilter.condType===2" style="width: 350px">
            <span>┌------</span>
            <el-select v-model="condFilter.conds[0].matchType" style="width: 30%">
              <el-option v-for="(option, index) in numberMatchTypeOption" :key="index"
                         :label="option.label" :value="option.value"></el-option>
            </el-select>
            <el-input type="number" v-model="condFilter.conds[0].value"
                      style="width: 35%;margin-left: 15px"></el-input>
            <div>
              {{ condFilter.condType === 1 ? '或' : '且' }}
            </div>
            <span>└------</span>
            <el-select v-model="condFilter.conds[1].matchType" style="width: 30%">
              <el-option v-for="(option, index) in numberMatchTypeOption" :key="index"
                         :label="option.label" :value="option.value"></el-option>
            </el-select>
            <el-input type="number" v-model="condFilter.conds[1].value"
                      style="width: 35%;margin-left: 15px"></el-input>
          </div>
        </div>
      </template>
      <template v-if="condFilter.dataType==='Date'">
        <div class="content-body-item">
          <span style="margin-right: 15px">过滤条件</span>
          <el-radio :value="condFilter.filterType" @input="handleInputFilterType" :label="1">区间范围</el-radio>
          <el-radio :value="condFilter.filterType" @input="handleInputFilterType" :label="0">指定时间</el-radio>
        </div>
        <div class="content-body-item">
          <!--年-->
          <template v-if="condFilter.dateDim==='year'">
            <div v-for="(picker,index) in condFilter.conds.length" :key="index">
              <span v-if="condFilter.filterType===0" style="margin-right: 15px">精确于</span>
              <span v-if="condFilter.filterType===1 && index===0" style="margin-right: 15px">开始于</span>
              <span v-if="condFilter.filterType===1 && index===1"
                    style="margin-left: 15px;margin-right: 15px">结束于</span>
              <el-date-picker v-model="condFilter.conds[index].value"
                              @change="handleChangeDate($event,index)"
                              :value-format="getDateValueFormat(condFilter.dateDim)"
                              :format="getDateFormat(condFilter.dateDim)"
                              size="mini"
                              style="width: 150px"
                              type="year">
              </el-date-picker>
            </div>
          </template>
          <!--月--><!--年-月-->
          <template v-if="condFilter.dateDim==='month'">
            <div v-for="(picker,index) in condFilter.conds.length" :key="index">
              <span v-if="condFilter.filterType===0" style="margin-right: 15px">精确于</span>
              <span v-if="condFilter.filterType===1 && index===0" style="margin-right: 15px">开始于</span>
              <span v-if="condFilter.filterType===1 && index===1"
                    style="margin-left: 15px;margin-right: 15px">结束于</span>
              <el-date-picker v-model="condFilter.conds[index].value"
                              @change="handleChangeDate($event,index)"
                              :value-format="getDateValueFormat(condFilter.dateDim)"
                              :format="getDateFormat(condFilter.dateDim)"
                              size="mini"
                              style="width: 150px"
                              type="month">
              </el-date-picker>
            </div>
          </template>
          <!--年月日-->
          <template v-if="condFilter.dateDim==='day'">
            <div v-for="(picker,index) in condFilter.conds.length" :key="index">
              <span v-if="condFilter.filterType===0" style="margin-right: 15px">精确于</span>
              <span v-if="condFilter.filterType===1 && index===0" style="margin-right: 15px">开始于</span>
              <span v-if="condFilter.filterType===1 && index===1"
                    style="margin-left: 15px;margin-right: 15px">结束于</span>
              <el-date-picker v-model="condFilter.conds[index].value"
                              @change="handleChangeDate($event,index)"
                              :value-format="getDateValueFormat(condFilter.dateDim)"
                              :format="getDateFormat(condFilter.dateDim)"
                              :picker-options="{'firstDayOfWeek': 1}"
                              size="mini"
                              style="width: 150px"
                              type="date">
              </el-date-picker>
            </div>
          </template>
          <!--秒-->
          <template v-if="condFilter.dateDim==='second'">
            <div v-for="(picker,index) in condFilter.conds.length" :key="index">
              <span v-if="condFilter.filterType===0" style="margin-right: 15px">精确于</span>
              <span v-if="condFilter.filterType===1 && index===0" style="margin-right: 15px">开始于</span>
              <span v-if="condFilter.filterType===1 && index===1"
                    style="margin-left: 15px;margin-right: 15px">结束于</span>
              <el-time-picker v-model="condFilter.conds[index].value"
                              @change="handleChangeDate($event,index)"
                              :value-format="getDateValueFormat(condFilter.dateDim)"
                              :format="getDateFormat(condFilter.dateDim)"
                              size="mini"
                              style="width: 150px">
              </el-time-picker>
            </div>
          </template>
          <!--年月日时分秒-->
          <template v-if="condFilter.dateDim==='ymdhms'">
            <div v-for="(picker,index) in condFilter.conds.length" :key="index">
              <span v-if="condFilter.filterType===0" style="margin-right: 15px">精确于</span>
              <span v-if="condFilter.filterType===1 && index===0" style="margin-right: 15px">开始于</span>
              <span v-if="condFilter.filterType===1 && index===1"
                    style="margin-left: 15px;margin-right: 15px">结束于</span>
              <el-date-picker v-model="condFilter.conds[index].value"
                              @change="handleChangeDate($event,index)"
                              :value-format="getDateValueFormat(condFilter.dateDim)"
                              :format="getDateFormat(condFilter.dateDim)"
                              :picker-options="{'firstDayOfWeek': 1}"
                              size="mini"
                              style="width: 150px"
                              type="datetime">
              </el-date-picker>
            </div>
          </template>
        </div>
      </template>
    </div>

    <el-dialog :title="condFilter.condType===0?'单选':'复选'" :visible.sync="addConds1DialogVisible"
               @close="closeAddConds1Dialog" custom-class="add-conds1-dialog" top="0vh" @open="handleDialogOpen"
               :append-to-body="true" :modal="false" width="70%" :close-on-press-escape="false"
               :close-on-click-modal="false">
      <div style="background-color: #FFFFFF;height:230px;width: 100%">
        <div style="display: flex;flex-direction: column;justify-content: center">
          <div style="padding-top: 10px;padding-left: 5px">
            <el-input style="width: 100px" size="mini" prefix-icon="el-icon-search" v-model="wd"
                      @change="handleSearchEnumData"></el-input>
            <el-button size="mini" @click="handleResetWd">重置</el-button>
          </div>
          <div class="conds1-content" style="padding: 10px;height: 150px">
            <template v-if="this.enumShowType==='list'">
              <el-checkbox-group :value="condFilter.conds1" @input="handleInputConds1"
                                 style="display: flex;flex-direction: row;flex-wrap: wrap">
                <el-checkbox :label="option.value" v-for="(option,index) in enumDataOptions"
                             :key="index">{{ option.label }}
                </el-checkbox>
              </el-checkbox-group>
            </template>
            <template v-if="this.enumShowType==='tree'">
              <el-tree ref="enumDataTree" :data="enumDataOptions" :props="defaultProps"
                       :check-strictly="true" @check="handleTreeItemCheck($event)"
                       default-expand-all :show-checkbox="true" :node-key="defaultProps.label"
                       :filter-node-method="filterNode" :default-checked-keys="defaultCheckedKeys"
                       :expand-on-click-node="false">
              </el-tree>
            </template>
          </div>
          <div style="padding-left: 10px;padding-top: 10px" v-if="totalCount / pageParam.pageSize > 1">
            <el-pagination
                background
                @current-change="handleCurrentChangeConds1PageNum"
                :hide-on-single-page="true"
                :current-page="pageParam.pageNum"
                :small="true"
                layout="prev, pager, next, jumper"
                :page-size="pageParam.pageSize"
                :total="totalCount">
            </el-pagination>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import CustomQuarterPicker from "@/components/CustomQuarterPicker";
import CustomHourPicker from "@/components/CustomHourPicker";
import CustomWeekPicker from "@/components/CustomWeekPicker";
import {srcProvince, srcCity, srcArea} from '@/utils/region/formatted';

export default {
  props: {
    itemDataCondFilter: {type: Object},
    formConfig: {type: Object}
  },

  created() {
    this.condFilter = JSON.parse(JSON.stringify(this.itemDataCondFilter));
    this.init();
  },

  computed: {
    contentBodyStyle() {
      let style = {};
      if (this.condFilter.dataType === 'String' && this.condFilter.filterType === 1) {
        style.height = '350px';
      } else if (this.condFilter.dataType === 'String') {
        style.height = '200px';
      } else if (this.condFilter.dataType === 'Number') {
        style.height = '150px';
      } else {
        style.height = '100px';
      }
      return style;
    },
    dataTypeHeader() {
      let html;
      if (this.condFilter.dataType === 'String') {
        html = `<span style="color: #00a0e8">Str.</span>`;
      } else if (this.condFilter.dataType === 'Number') {
        html = `<span style="color: #21b200">No</span>`;
      } else if (this.condFilter.dataType === 'Date') {
        html = `<span style="color: #00a0e8">Date</span>`;
      }
      return html;
    },
    enumDataButtonVisible() {
      if (this.condFilter.type === 'user_select' || this.condFilter.type === 'org_select' || this.condFilter.type === 'role_select' || this.condFilter.type === 'dic_select'
          || this.condFilter.type === 'region_select' && this.condFilter.model === 'province' || this.condFilter.model === 'city' || this.condFilter.model === 'area') {
        return true;
      }
      return false;
    }
  },

  data() {
    return {
      pageNum: 1,
      totalCount: 0,
      wd: "",
      remoteUrl: '',
      condFilter: {},
      manualText: '',
      pageParam: {
        pageNum: 1,
        pageSize: 30
      },
      label: '', //高级控件的lb
      stringMatchTypeOptions: [
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
      ],
      currentUserOptions:[
        {label: '用户名', value: '0'},
        {label: '用户真实名', value: '1'},
        {label: '所属部门（或条件）', value: '2'},
        {label: '所属角色（或条件）', value: '3'}
      ],
      enumDataOptions: [], //枚举数据的数据选项
      allDataOptions: [],
      enumShowType: [],
      defaultProps: {
        label: '',
        children: ''
      },
      defaultCheckedKeys: [],
      addConds1DialogVisible: false,
      treeCheckedClick: 0
    };
  },

  watch: {
    treeCheckedClick() {
      let checkedNodes = this.$refs['enumDataTree'].getCheckedNodes();
      this.condFilter.conds1 = [];
      for (let i = 0; i < checkedNodes.length; i++) {
        let checkedNode = checkedNodes[i];
        this.condFilter.conds1.push(checkedNode[this.defaultProps.label]);
      }
    }
  },

  components: {
    CustomQuarterPicker, CustomHourPicker, CustomWeekPicker
  },

  methods: {
    init() {
      console.log(this.itemDataCondFilter);
      console.log('formConfig', this.formConfig);
      this.initEnumDataOptions();
    },
    initEnumDataOptions() {
      let listItem = this.getListItemByModel();
      this.enumShowType = 'list';
      if (this.condFilter.type === 'switch') {
        this.enumDataOptions = [{label: '已关闭', value: '1'}, {label: '已打开', value: '0'}];
      } else if (this.condFilter.type === 'user_select' || this.condFilter.type === 'role_select') {
        let remoteUrl = listItem.options.remoteUrl;
        let label = listItem.options.props.label;
        this.label = label;
        this.remoteUrl = remoteUrl;
        let param = {
          pageNum: 1,
          pageSize: 10
        };
      } else if (this.condFilter.type === 'org_select') {
        this.enumShowType = 'tree';
        if (this.condFilter.model.indexOf('_lb') >= 0) {
          this.defaultProps = {label: 'orgName', children: 'children'};
        } else {
          this.defaultProps = {label: 'id', children: 'children'};
        }
      } else if (this.condFilter.type === 'dic_select') {
        this.enumShowType = 'tree';
        let typeCode = listItem.typeCode;
        let param = {
          typeCode
        };
        if (this.condFilter.model.indexOf('_lb') >= 0) {
          this.defaultProps = {label: 'name', children: 'children'};
        } else {
          this.defaultProps = {label: 'id', children: 'children'};
        }
      } else if (this.condFilter.type === 'region_select') {
        if (this.condFilter.model === 'province') {
          for (let i = 0; i < srcProvince.length; i++) {
            let srcProvinceItem = srcProvince[i];
            if (i < this.pageParam.pageSize) {
              this.enumDataOptions.push({label: srcProvinceItem.value, value: srcProvinceItem.value});
            }
            this.allDataOptions.push({label: srcProvinceItem.value, value: srcProvinceItem.value});
          }
          this.totalCount = srcProvince.length;
        } else if (this.condFilter.model === 'city') {
          for (let i = 0; i < srcCity.length; i++) {
            let srcCityItem = srcCity[i];
            if (i < this.pageParam.pageSize) {
              this.enumDataOptions.push({label: srcCityItem.value, value: srcCityItem.value});
            }
            this.allDataOptions.push({label: srcCityItem.value, value: srcCityItem.value});
          }
          this.totalCount = srcCity.length;
        } else if (this.condFilter.model === 'area') {
          for (let i = 0; i < srcArea.length; i++) {
            let srcAreaItem = srcArea[i];
            if (i < this.pageParam.pageSize) {
              this.enumDataOptions.push({label: srcAreaItem.value, value: srcAreaItem.value});
            }
            this.allDataOptions.push({label: srcAreaItem.value, value: srcAreaItem.value});
          }
          this.totalCount = srcArea.length;
        }
      }
      console.log('enumDataOptions', JSON.stringify(this.enumDataOptions));
    },
    getListItemByModel() {
      for (let i = 0; i < this.formConfig.list.length; i++) {
        let listItem = this.formConfig.list[i];
        if (this.condFilter.model === listItem.model || this.condFilter.model === listItem.label_model) {
          return listItem;
        }
      }
    },
    handleInputConds1(val) {
      if (this.condFilter.condType === 0) {
        if (val.length > 1) {
          this.condFilter.conds1 = val.splice(1, val.length - 1);
        } else {
          this.condFilter.conds1 = val;
        }
      } else {
        this.condFilter.conds1 = val;
      }
    },
    handleInputFilterType(val) {
      if (this.condFilter.dataType === 'String') {
        if (val === 1) {
          if (this.condFilter.hasOwnProperty('conds0') || this.condFilter.hasOwnProperty('conds2')) {
            this.condFilter.condType = 0;
            this.$delete(this.condFilter, 'conds0');
            this.$delete(this.condFilter, 'conds2');
            this.$set(this.condFilter, 'conds1', []);
          }
        } else if (val === 0) {
          if (this.condFilter.hasOwnProperty('conds1') || this.condFilter.hasOwnProperty('conds2') ) {
            this.$delete(this.condFilter, 'conds1');
             this.$delete(this.condFilter, 'conds2');
            if (this.condFilter.condType === 0) {
              this.$set(this.condFilter, 'conds0', [{
                matchType: '$eq',
                value: ''
              }]);
            } else if (this.condFilter.condType === 1 || this.condFilter.condType === 2) {
              this.$set(this.condFilter, 'conds0', [{
                matchType: '$eq',
                value: ''
              }, {
                matchType: '$eq',
                value: ''
              }]);
            }
          }
        } else if (val === 2) {
          
          if (this.condFilter.hasOwnProperty('conds0') || this.condFilter.hasOwnProperty('conds1')) {
            this.condFilter.condType = 0;
            // this.$delete(this.condFilter, 'conds0');
            // this.$delete(this.condFilter, 'conds1');
            this.$set(this.condFilter, 'conds2', [
              {
                matchType:'',
              }
            ]);
            
          }
        }
      } else if (this.condFilter.dataType === 'Date') {
        if (val === 1) {
          this.$set(this.condFilter, 'conds', [{
            matchType: '$gte',
            value: ''
          }, {
            matchType: '$lte',
            value: ''
          }]);
        } else if (val === 0) {
          this.$set(this.condFilter, 'conds', [{
            matchType: '$eq',
            value: ''
          }]);
        }
      }
      this.condFilter.filterType = val;
      this.addConds1DialogVisible = false;
    },
    handleInputCondType(val) {
      if (val === 0) {
        if (this.condFilter.dataType === 'String') {
          if (this.condFilter.filterType === 0) {
            if (this.condFilter.conds0.length === 2) {
              this.condFilter.conds0.splice(1, 1);
            }
          } else if (this.condFilter.filterType === 1) {
            if (this.condFilter.conds1.length > 1) {
              if (this.enumShowType === 'tree') {
                for (let i = 1; i < this.condFilter.conds1.length; i++) {
                  this.$refs['enumDataTree'].setChecked(this.condFilter.conds1[i], false);
                }
              }
              this.condFilter.conds1.splice(1, this.condFilter.conds1.length - 1);
            }
          }
        } else if (this.condFilter.dataType === 'Number') {
          if (this.condFilter.conds.length === 2) {
            this.condFilter.conds.splice(1, 1);
          }
        }
      } else if (val === 1 || val === 2) {
        if (this.condFilter.dataType === 'String') {
          if (this.condFilter.filterType === 0) {
            if (this.condFilter.conds0.length === 1) {
              this.condFilter.conds0.push({matchType: '$eq', value: ''});
            }
          }
        } else if (this.condFilter.dataType === 'Number') {
          if (this.condFilter.conds.length === 1) {
            this.condFilter.conds.push({matchType: '$eq', value: ''});
          }
        }
      }
      this.condFilter.condType = val;
    },
    currentFilterType(val){
      console.log(val)
    },
    clearAllEnum() {
      this.$set(this.condFilter, 'conds1', []);
    },
    showManualInput() {
      this.manualText = '';
    },
    deleteAEnum(index) {
      if (this.enumShowType === 'tree') {
        this.$refs['enumDataTree'].setChecked(this.condFilter.conds1[index], false);
      }
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
          let successMessage;
          if (checkArr.length > 0) {
            if (condFilter.condType === 0) {
              if (condFilter.conds1.length === 0) {
                condFilter.conds1.push(checkArr[0]);
                successMessage = true;
              }
            } else if (condFilter.condType === 1) {
              condFilter.conds1.push(...checkArr);
              successMessage = true;
            }
            if (successMessage) {
              this.$message({
                type: 'success',
                message: '手工输入添加成功'
              });
            }
          }
        }
      }
    },
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
    closeAddConds1Dialog() {
      this.addConds1DialogVisible = false;
    },
    handleDialogOpen() {
      let wrapper = document.getElementsByClassName('el-dialog__wrapper');
      let currentWrapper = wrapper[wrapper.length - 1];
      currentWrapper.style.top = '2px';
      currentWrapper.style.right = 'auto';
      currentWrapper.style.bottom = 'auto';
      currentWrapper.style.left = 'auto';
      currentWrapper.style.width = '750px';
      currentWrapper.style['margin-top'] = '360px';
    },
    openAddConds1Dialog() {
      if (this.enumShowType === 'tree') {
        this.defaultCheckedKeys = [];
        for (let i = 0; i < this.condFilter.conds1.length; i++) {
          let cond1 = this.condFilter.conds1[i];
          this.defaultCheckedKeys.push(cond1);
        }
      }
      if (this.condFilter.type === 'org_select') {
        this.$Get(this.khConfig.api.listOrgTree).then(res => {
          this.enumDataOptions = res.departManage;
          this.$nextTick(() => {
            this.handleSearchEnumData(this.wd);
          });
        });
      } else if (this.condFilter.type === "dic_select") {
        this.$Get(this.khConfig.api['listDicCatalog']).then(res => {
          this.enumDataOptions = res.children;
          this.$nextTick(() => {
            this.handleSearchEnumData(this.wd);
          });
        });
      } else {
        this.handleCurrentChangeConds1PageNum(this.pageParam.pageNum, this.wd);
      }
      this.addConds1DialogVisible = !this.addConds1DialogVisible;
    },
    handleCurrentChangeConds1PageNum(pageNum, wd) {
      this.pageParam.pageNum = pageNum;
      let pageParam = JSON.parse(JSON.stringify(this.pageParam));
      pageParam.wd = wd;
      if (this.remoteUrl) {
        this.$Get(this.remoteUrl, pageParam).then(res => {
          this.pageSize = res.pageSize;
          this.totalCount = res.totalCount;
          this.enumDataOptions = [];
          for (let i = 0; i < res.list.length; i++) {
            let listItem = res.list[i];
            if (this.condFilter.model.indexOf('_lb') >= 0) {
              this.enumDataOptions.push({label: listItem[this.label], value: listItem[this.label]});
            } else {
              this.enumDataOptions.push({label: listItem.id, value: listItem.id});
            }
          }
        });
      } else {
        if (wd) {
          this.handleSearchEnumData(wd);
        } else {
          if (this.allDataOptions.length > 0) {
            this.enumDataOptions = [];
            let totalPage = Math.ceil(this.allDataOptions.length / this.pageParam.pageSize);
            if (pageNum !== totalPage) {
              for (let i = (pageNum - 1) * this.pageParam.pageSize; i <= ((pageNum - 1) * this.pageParam.pageSize + this.pageParam.pageSize - 1); i++) {
                this.enumDataOptions.push(this.allDataOptions[i]);
              }
            } else {
              for (let i = (pageNum - 1) * this.pageParam.pageSize; i <= this.allDataOptions.length - 1; i++) {
                this.enumDataOptions.push(this.allDataOptions[i]);
              }
            }
          }
        }
      }
    },
    saveCondFilter() {
      return this.condFilter;
    },
    handleTreeItemCheck(e) {
      this.treeCheckedClick++;
    },
    handleChangeDate(val, index) {
      let condFilter = this.condFilter;
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
    handleSearchEnumData(val) {
      if (this.remoteUrl) {
        this.handleCurrentChangeConds1PageNum(1, val);
      } else {
        if (val) {
          if (this.enumShowType !== 'tree') {
            this.enumDataOptions = [];
            for (let i = 0; i < this.allDataOptions.length; i++) {
              let option = this.allDataOptions[i];
              if (option.label.indexOf(val) >= 0) {
                this.enumDataOptions.push(option);
              }
            }
            this.pageParam.pageNum = 1;
            this.totalCount = 0;
          } else {
            this.$refs['enumDataTree'].filter(val);
          }
        } else {
          if (this.enumShowType !== 'tree') {
            this.pageParam.pageSize = this.$options.data().pageParam.pageSize;
            this.totalCount = this.allDataOptions.length;
            this.handleCurrentChangeConds1PageNum(1);
          } else {
            this.$refs['enumDataTree'].filter(null);
          }
        }
      }
    },
    filterNode(value, data) {
      if (!value) return true;
      let str = data[this.defaultProps.label].toString();
      return str.indexOf(value) !== -1;
    },
    handleResetWd() {
      this.wd = '';
      this.handleSearchEnumData(this.wd);
    }
  }
};
</script>

<style lang="scss" scoped>
.content-header {
  display: flex;
  flex-direction: row;
  overflow: hidden;
  height: 30px;
  margin-bottom: 15px;
  font-size: 15px;
}

.content-body {
  padding-left: 15px;
  padding-right: 15px;
  display: flex;
  flex-direction: column;
  background-color: #FFFFFF;
}

.content-body-item {
  display: flex;
  flex-direction: row;
  margin-top: 25px;
}

::v-deep .card-box {
  .el-card__body {
    padding: 0px;
  }
}

.conds1-item {
  height: 35px;
  padding-left: 10px;
  overflow: hidden;
  display: flex;
  flex-direction: row;
  align-items: center;

  span {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
    width: 90%;
    display: inline-block;
  }

  &:hover {
    background-color: #F8F8FA;
    color: #3B67D9;

    & i {
      display: inline-block;
    }
  }

  & i {
    display: none;
  }
}

.conds1-body {
  height: 150px;
  width: 250px;
  overflow-y: auto;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

    &:hover {
      background: #535353;
    }

    background: #C5C5C5;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #EBEBED;
  }
}

.text-over-flow {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

::v-deep .add-conds1-dialog {
  margin-left: 28%;
  margin-right: 0px;

  .el-dialog__body {
    padding: 10px 20px;
    background-color: #F8F8FA;
  }

  .el-dialog__header {
    background-color: #F8F8FA;
    border-bottom: 1px solid #E8E8E8;
    padding: 10px 0px 10px 10px;
  }

  .el-pagination {
    padding: 0px 0px;

    .btn-prev {
      margin-left: 0px;
    }
  }
}

.conds1-content {
  overflow-y: auto;

  &::-webkit-scrollbar {
    /*滚动条整体样式*/
    width: 5px; /*高宽分别对应横竖滚动条的尺寸*/
    height: 1px;
  }

  &::-webkit-scrollbar-thumb {
    /*滚动条里面小方块*/
    border-radius: 10px;
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);

    &:hover {
      background: #535353;
    }

    background: #C5C5C5;
  }

  &::-webkit-scrollbar-track {
    /*滚动条里面轨道*/
    box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.2);
    background: #EBEBED;
  }
}
</style>
