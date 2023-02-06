<template>
<div class="scrollBar">
  <div :id="'myDiv'+queryWidgetData.id" ref="myDiv" style="padding: 10px;height: 100%"
       v-if="refreshQueryWidgetStyle && queryConditionData.conditions != null && queryConditionData.conditions.length >0">
    <el-row :gutter="10"><!---->
      <div v-for="(item,key) in queryConditionData.conditions" :key="key">
        <!--Number类型-->
        <el-col :class="colFirst" v-if="item.dataType=='Number'">
          <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.name"
                      placement="top-start">
            <div class="queryTitle" :style="titleStyle"><span v-if="item.required"
                                                              style="color: red">*</span>{{item.name}}
            </div>
          </el-tooltip>
          <el-row>
            <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="leftTitle" :style="titleStyle"><span v-if="item.required"
                                                                 style="color: red">*</span>{{item.name}}
                </div>
              </el-tooltip>
            </el-col>
            <el-col class="number-select item-height">
              <el-select class="query-widget-style" clearable v-model="item.defaultValue[0].matchType"
                         placeholder="请选择">
                <el-option
                  v-for="numberSelectItem in numberSelectOptions"
                  :key="numberSelectItem.value"
                  :label="numberSelectItem.label"
                  :value="numberSelectItem.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col class=" item-height item-margin-left"
                    :style="computeSelectWidth(item.style.widthScale,numberInputWidth)">
              <el-input class="query-widget-style"
                        placeholder="数值"
                        type="number"
                        v-model="item.defaultValue[0].value"
              >
              </el-input>
            </el-col>
            <el-col style="width: auto" v-if="item.condType == 1 || item.condType == 2">
              <el-col style="width: auto">
                <span class="item-line-height" v-if="item.condType == 1">或</span>
                <span class="item-line-height" v-if="item.condType == 2">且</span>
              </el-col>
              <el-col class="number-select item-height">
                <el-select class="query-widget-style" clearable v-model="item.defaultValue[1].matchType"
                           placeholder="请选择">
                  <el-option
                    v-for="numberSelectItem in numberSelectOptions"
                    :key="numberSelectItem.value"
                    :label="numberSelectItem.label"
                    :value="numberSelectItem.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col class=" item-height item-margin-left"
                      :style="computeSelectWidth(item.style.widthScale,numberInputWidth)">
                <el-input class="query-widget-style"
                          placeholder="数值"
                          type="number"
                          v-model="item.defaultValue[1].value"
                >
                </el-input>
              </el-col>
            </el-col>

          </el-row>

        </el-col>

        <!--String类型-->
        <el-col :class="colFirst" v-if="item.dataType=='String'">
          <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.name"
                      placement="top-start">
            <div class="queryTitle" :style="titleStyle"><span v-if="item.required"
                                                              style="color: red">*</span>{{item.name}}
            </div>
          </el-tooltip>
          <!--下拉列表-->
          <el-row v-if="item.showType == 0">
            <!--0自动解析，1单个数据集，-->
            <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="leftTitle" :style="titleStyle"><span v-if="item.required"
                                                                 style="color: red">*</span>{{item.name}}
                </div>
              </el-tooltip>
            </el-col>
            <el-col style="width: auto" v-if="item.select.valueSource == 0 || item.select.valueSource == 1">
              <el-col class=" item-height" v-if="isRefresh && item.select.pickType == 0"
                      :style="computeSelectWidth(item.style.widthScale,itemBigWidth)">
                <!--单选 @focus="loadingString(item)   :default-first-option='true'"-->
                <el-select class=" query-widget-style" v-model="item.select.defaultValue[0]"
                           placeholder="请选择"
                           filterable
                           clearable
                           style="width: 100%"
                           @click.native="loadFirst(item)"
                           v-el-select-load-more="loadMore"
                >
                  <el-option
                    v-for="(itemData,index) in selectData"
                    :key="itemData.value+'-'+index"
                    :label="itemData.label"
                    :value="itemData.value">
                  </el-option>
                </el-select>
              </el-col>
              <!--多选-->
              <el-col class=" item-height" v-if="isRefresh && item.select.pickType == 1"
                      :style="computeSelectWidth(item.style.widthScale, itemBigWidth)">
                <el-select class="query-widget-style" v-model="item.select.defaultValue" collapse-tags filterable
                           multiple placeholder="请选择"
                           clearable
                           style="width: 100%;"
                           @click.native="loadFirst(item)"
                           v-el-select-load-more="loadMore"
                            >
                  <el-option
                    v-for="itemData in selectData"
                    :key="itemData.value"
                    :label="itemData.label"
                    :value="itemData.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <!--，2手工输入-->
            <el-col style="width: auto" v-if="item.select.valueSource == 2">
              <el-col class=" item-height" v-if="item.select.pickType == 0"
                      :style="computeSelectWidth(item.style.widthScale, itemBigWidth)">
                <!--d单选-->
                <el-select class="query-widget-style" v-model="item.select.defaultValue[0]" placeholder="请选择" filterable
                           style="width: 100%"
                >
                  <el-option
                    v-for="itemData in item.select.manualValue"
                    :key="itemData.key"
                    :label="itemData.value"
                    :value="itemData.key">
                  </el-option>
                </el-select>
              </el-col>
              <!--多选-->
              <el-col class=" item-height" v-if="item.select.pickType == 1"
                      :style="computeSelectWidth(item.style.widthScale, itemBigWidth)">
                <el-select class="query-widget-style" v-model="item.select.defaultValue" collapse-tags filterable
                           style="width: 100%"
                           multiple placeholder="请选择">
                  <el-option
                    v-for="itemData in item.select.manualValue"
                    :key="itemData.key"
                    :label="itemData.value"
                    :value="itemData.key">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
          </el-row>
          <!--文本框输入-->
          <el-row v-if="item.showType == 1">
            <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="leftTitle" :style="titleStyle"><span v-if="item.required"
                                                                 style="color: red">*</span>{{item.name}}
                </div>
              </el-tooltip>
            </el-col>
            <el-col class="item-width item-height">
              <el-select class="query-widget-style" v-model="item.text.defaultValue[0].matchType" placeholder="请选择">
                <el-option
                  v-for="stringSelectItem in stringSelectOptions"
                  :key="stringSelectItem.value"
                  :label="stringSelectItem.label"
                  :value="stringSelectItem.value">
                </el-option>
              </el-select>
            </el-col>
            <el-col class=" item-height item-margin-left" :style="computeSelectWidth(item.style.widthScale, itemWidth)">
              <el-input class="query-widget-style"
                        placeholder="字符或值"
                        v-model="item.text.defaultValue[0].value"
              >
              </el-input>
            </el-col>
            <el-col style="width: auto" v-if="item.text.condType == 1 || item.text.condType == 2">
              <el-col style="width: auto">
                <span class="item-line-height" v-if="item.text.condType == 1">或</span>
                <span class="item-line-height" v-if="item.text.condType == 2">且</span>
              </el-col>
              <el-col class="item-width item-height ">
                <el-select class="query-widget-style " v-model="item.text.defaultValue[1].matchType" placeholder="请选择">
                  <el-option
                    v-for="stringSelectItem in stringSelectOptions"
                    :key="stringSelectItem.value"
                    :label="stringSelectItem.label"
                    :value="stringSelectItem.value">
                  </el-option>
                </el-select>
              </el-col>
              <el-col class=" item-height item-margin-left"
                      :style="computeSelectWidth(item.style.widthScale, itemWidth)">
                <el-input class="query-widget-style "
                          placeholder="字符或值"
                          v-model="item.text.defaultValue[1].value"
                >
                </el-input>
              </el-col>
            </el-col>
          </el-row>
        </el-col>

        <!--Date类型-->
        <el-col :class="colFirst" v-if="item.dataType=='Date'">
          <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.name"
                      placement="top-start">
            <div class="queryTitle" :style="titleStyle"><span v-if="item.required"
                                                              style="color: red">*</span>{{item.name}}
            </div>
          </el-tooltip>

          <!--年、月、日、datetime-->
          <el-row
            v-if="item.dateDim == 'year'|| item.dateDim == 'month' || item.dateDim == 'day' || item.dateDim == 'ymdhms'">
            <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="leftTitle" :style="titleStyle"><span v-if="item.required"
                                                                 style="color: red">*</span>{{item.name}}
                </div>
              </el-tooltip>
            </el-col>
            <!--0单值-->
            <el-col style="width: auto" v-if="item.filterType == 0 ">
              <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale, itemBigWidth)">
                <el-date-picker class="query-widget-style" v-model="item.defaultValue[0].value"
                                :type="getDateFormatType(item.dateDim)"
                                :value-format="getDateValueFormat(item.dateDim)"
                                placeholder="请选择">
                </el-date-picker>
              </el-col>
            </el-col>
            <!--区间-->
            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 1">
              <el-col style="width: auto">
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$gte'">
                  开始于
                </el-col>
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$lte'">
                  结束于
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale, itemDataWidth)">
                  <el-date-picker class="query-widget-style"
                                  v-model="item.defaultValue[0].value"
                                  :type="getDateFormatType(item.dateDim)"
                                  :value-format="getDateValueFormat(item.dateDim)"
                                  placeholder="请选择">
                  </el-date-picker>
                </el-col>
              </el-col>
            </el-col>

            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 2">
              <el-col style="width: auto">
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale, itemBigWidth)">
                  <el-date-picker class="query-widget-style"
                                  v-model="item.defaultValue[0].value"
                                  :type="getDateFormatType(item.dateDim)"
                                  :value-format="getDateValueFormat(item.dateDim)"
                                  placeholder="请选择">
                  </el-date-picker>
                </el-col>
                <el-col style="width: auto">
                  <span class="item-line-height connectLine"> - </span>
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale, itemBigWidth)">
                  <el-date-picker class="query-widget-style"
                                  v-model="item.defaultValue[1].value"
                                  :type="getDateFormatType(item.dateDim)"
                                  :value-format="getDateValueFormat(item.dateDim)"
                                  placeholder="请选择">
                  </el-date-picker>
                </el-col>
              </el-col>
            </el-col>
          </el-row>
          <!--周-->
          <el-row
            v-if="item.dateDim == 'week'">
            <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="leftTitle" :style="titleStyle"><span v-if="item.required"
                                                                 style="color: red">*</span>{{item.name}}
                </div>
              </el-tooltip>
            </el-col>
            <!--0单值-->
            <el-col style="width: auto" v-if="item.filterType == 0 ">
              <el-col class=" item-height">
                <custom-week-picker class="query-widget-style"
                                    :style="computeSelectWidth(item.style.widthScale, itemBigWidth)"
                                    v-model="item.defaultValue[0].value"></custom-week-picker>
              </el-col>
            </el-col>
            <!--区间-->
            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 1">
              <el-col style="width: auto">
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$gte'">
                  开始于
                </el-col>
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$lte'">
                  结束于
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale, itemDataWidth)">
                  <custom-week-picker class="query-widget-style"
                                      v-model="item.defaultValue[0].value"></custom-week-picker>
                </el-col>
              </el-col>
            </el-col>

            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 2">
              <el-col style="width: auto">
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale, itemBigWidth)">
                  <custom-week-picker class="query-widget-style"
                                      v-model="item.defaultValue[0].value"></custom-week-picker>
                </el-col>
                <el-col style="width: auto">
                  <span class="item-line-height connectLine"> - </span>
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale, itemBigWidth)">
                  <custom-week-picker class="query-widget-style"
                                      v-model="item.defaultValue[1].value"></custom-week-picker>
                </el-col>
              </el-col>
            </el-col>
          </el-row>
          <!--小时-->
          <el-row style="width: auto" v-if="item.dateDim == 'hour'">
            <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="leftTitle" :style="titleStyle"><span v-if="item.required"
                                                                 style="color: red">*</span>{{item.name}}
                </div>
              </el-tooltip>
            </el-col>
            <!--0单值-->
            <el-col style="width: auto" v-if="item.filterType == 0 ">
              <el-col class=" item-height">
                <el-select class="query-widget-style" v-model="item.defaultValue[0].value" clearable placeholder="请选择"
                           :style="computeSelectWidth(item.style.widthScale,itemBigWidth)">
                  <el-option
                    v-for="hourItem in hourSelectOptions"
                    :key="hourItem.value"
                    :label="hourItem.label"
                    :value="hourItem.value">
                  </el-option>
                </el-select>
              </el-col>
            </el-col>
            <!--区间-->
            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 1">
              <el-col style="width: auto">
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$gte'">
                  开始于
                </el-col>
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$lte'">
                  结束于
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,itemDataWidth)">
                  <el-select class="query-widget-style" v-model="item.defaultValue[0].value" clearable
                             style="width: 100%"
                             placeholder="请选择">
                    <el-option
                      v-for="hourItem in hourSelectOptions"
                      :key="hourItem.value"
                      :label="hourItem.label"
                      :value="hourItem.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-col>
            </el-col>

            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 2">
              <el-col style="width: auto">
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,itemBigWidth)">
                  <el-select class="query-widget-style" v-model="item.defaultValue[0].value" clearable
                             style="width: 100%"
                             placeholder="请选择">
                    <el-option
                      v-for="hourItem in hourSelectOptions"
                      :key="hourItem.value"
                      :label="hourItem.label"
                      :value="hourItem.value">
                    </el-option>
                  </el-select>
                </el-col>
                <el-col style="width: auto">
                  <span class="item-line-height connectLine"> - </span>
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,itemBigWidth)">
                  <el-select class="query-widget-style" v-model="item.defaultValue[1].value" clearable
                             style="width:100%;"
                             placeholder="请选择">
                    <el-option
                      v-for="hourItem in hourSelectOptions"
                      :key="hourItem.value"
                      :label="hourItem.label"
                      :value="hourItem.value">
                    </el-option>
                  </el-select>
                </el-col>
              </el-col>
            </el-col>
          </el-row>
          <!--分、秒-->
          <el-row v-if="item.dateDim == 'minute'|| item.dateDim == 'second'">
            <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="leftTitle" :style="titleStyle"><span v-if="item.required"
                                                                 style="color: red">*</span>{{item.name}}
                </div>
              </el-tooltip>
            </el-col>
            <!--0单值-->
            <el-col style="width: auto" v-if="item.filterType == 0 ">
              <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,   itemBigWidth)">
                <el-time-picker class="query-widget-style"
                                v-model="item.defaultValue[0].value"
                                :format="getDateFormatType(item.dateDim)"
                                :value-format="getDateValueFormat(item.dateDim)"
                                placeholder="请选择">
                </el-time-picker>
              </el-col>
            </el-col>
            <!--区间-->
            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 1">
              <el-col style="width: auto">
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$gte'">
                  开始于
                </el-col>
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$lte'">
                  结束于
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,itemDataWidth)">
                  <el-time-picker class="query-widget-style"
                                  v-model="item.defaultValue[0].value"
                                  :format="getDateFormatType(item.dateDim)"
                                  :value-format="getDateValueFormat(item.dateDim)"
                                  placeholder="请选择">
                  </el-time-picker>
                </el-col>
              </el-col>
            </el-col>

            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 2">
              <el-col style="width: auto">
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,   itemBigWidth)">
                  <el-time-picker class="query-widget-style"
                                  v-model="item.defaultValue[0].value"
                                  :format="getDateFormatType(item.dateDim)"
                                  :value-format="getDateValueFormat(item.dateDim)"
                                  placeholder="请选择">
                  </el-time-picker>
                </el-col>
                <el-col style="width: auto">
                  <span class="item-line-height connectLine"> - </span>
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,   itemBigWidth)">
                  <el-time-picker class="query-widget-style"
                                  v-model="item.defaultValue[1].value"
                                  :format="getDateFormatType(item.dateDim)"
                                  :value-format="getDateValueFormat(item.dateDim)"
                                  placeholder="请选择">
                  </el-time-picker>
                </el-col>
              </el-col>
            </el-col>
          </el-row>

          <!--季度-->
          <el-row v-if="item.dateDim == 'quarter'">
            <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
              <el-tooltip class="item" effect="dark" :content="item.name" placement="top-start">
                <div class="leftTitle" :style="titleStyle"><span v-if="item.required"
                                                                 style="color: red">*</span>{{item.name}}
                </div>
              </el-tooltip>
            </el-col>
            <!--0单值-->
            <el-col style="width: auto" v-if="item.filterType == 0 ">
              <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,itemBigWidth )">
                <custom-quarter-picker class="query-widget-style" v-model="item.defaultValue[0].value">

                </custom-quarter-picker>
              </el-col>
            </el-col>
            <!--区间-->
            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 1">
              <el-col style="width: auto">
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$gte'">
                  开始于
                </el-col>
                <el-col class="item-date-text-width item-height" v-if="item.defaultValue[0].matchType == '$lte'">
                  结束于
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,itemDataWidth)">
                  <custom-quarter-picker class="query-widget-style" v-model="item.defaultValue[0].value">

                  </custom-quarter-picker>
                </el-col>
              </el-col>
            </el-col>

            <el-col style="width: auto" v-if="item.filterType == 1 && item.defaultValue.length == 2">
              <el-col style="width: auto">
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,itemBigWidth )">
                  <custom-quarter-picker class="query-widget-style" v-model="item.defaultValue[0].value">

                  </custom-quarter-picker>
                </el-col>
                <el-col style="width: auto">
                  <span class="item-line-height connectLine "> - </span>
                </el-col>
                <el-col class=" item-height" :style="computeSelectWidth(item.style.widthScale,itemBigWidth )">
                  <custom-quarter-picker class="query-widget-style" v-model="item.defaultValue[1].value">
                  </custom-quarter-picker>
                </el-col>
              </el-col>
            </el-col>
          </el-row>

        </el-col>
      </div>


    </el-row>
    <el-row>
      <el-button style="float: right" type="primary" @click="queryReport">查询</el-button>
    </el-row>
  </div>
  <div v-else class="no-query-widget">
    请添加查询条件
  </div>
</div>
</template>

<script>
  import CustomQuarterPicker from "@/components/CustomQuarterPicker";
  import CustomWeekPicker from "@/components/CustomWeekPicker";
  export default {
    directives: {
      'el-select-load-more': {
        bind(el, binding) {
          const SELECTWRAP_DOM = el.querySelector(
            '.el-select-dropdown .el-select-dropdown__wrap'
          );
          SELECTWRAP_DOM.addEventListener('scroll', function () {
            const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
            if (condition) {
              binding.value();
            }
          });
        }
      }
    },
    components: {
      CustomQuarterPicker,
      CustomWeekPicker
    },
    name: "QueryWidget",
    props: {
      queryWidgetData: {required: true, type: Object},
    },
    data(){
      return {
        queryConditionData: {},
        numberSelectOptions: [
          {value: "$eq", label: "="},
          {value: "$neq", label: "≠"},
          {value: "$gt", label: ">"},
          {value: "$gte", label: ">="},
          {value: "$lt", label: "<"},
          {value: "$lte", label: "<="},
        ],
        stringSelectOptions: [
          {value: "$eq", label: "精确匹配"},
          {value: "$like", label: "包含"},
          {value: "$nlike", label: "不包含"},
          {value: "$neq", label: "不匹配"},
          {value: "$hlike", label: "开头是"},
          {value: "$null", label: "为空"},
          {value: "$notnull", label: "不为空"},
          {value: "$empty", label: "空文本"},
        ],
        hourSelectOptions: [
          {value: "00", label: "00"},
          {value: "01", label: "01"},
          {value: "02", label: "02"},
          {value: "03", label: "03"},
          {value: "04", label: "04"},
          {value: "05", label: "05"},
          {value: "06", label: "06"},
          {value: "07", label: "07"},
          {value: "08", label: "08"},
          {value: "09", label: "09"},
          {value: "10", label: "10"},
          {value: "11", label: "11"},
          {value: "12", label: "12"},
          {value: "13", label: "13"},
          {value: "14", label: "14"},
          {value: "15", label: "15"},
          {value: "16", label: "16"},
          {value: "17", label: "17"},
          {value: "18", label: "18"},
          {value: "19", label: "19"},
          {value: "20", label: "20"},
          {value: "21", label: "21"},
          {value: "22", label: "22"},
          {value: "23", label: "23"},
        ],
        test: "",
        isRefresh: true,
        stringSelectLoading: false,
        queryParams: [],
        conditionRules: {
          value: [
            {required: true, message: '请输入字段名称', trigger: 'blur'}
          ],

        },
        refreshQueryWidgetStyle: true,
        numberSelectWidth: 60,
        numberInputWidth: 140,
        itemWidth: 100,
        itemBigWidth: 205,
        itemDataWidth: 155,
        titleStyle: {},
        color: 'red',
        selectData: [],
        selectItem: {}
      }
    },
    watch: {
      queryWidgetData: {
        deep: true,
        handler() {
          this.queryConditionData = {};
          this.queryConditionData = JSON.parse(JSON.stringify(this.queryWidgetData));
          this.initTitleStyle();
          setTimeout(() => {
            this.initWidgetStyle();
          }, 10);
        }
      }
    },
    created(){
      let _this = this;
      if (!_this.queryWidgetData.style.widgetStyle) {
        _this.queryWidgetData.style.widgetStyle = {
          backgroundColor: null,
          fontColor: null,
          iconColor: null,
          borderSize: '1px',
          borderColor: null,
        }
      }
    },
    mounted(){
      this.queryConditionData = {};
      this.queryConditionData = JSON.parse(JSON.stringify(this.queryWidgetData));
      this.initStringData();
      this.initTitleStyle();
      setTimeout(() => {
        this.initWidgetStyle();
      }, 10);


    },
    methods: {
      initWidgetStyle(){
        let _this = this;
        var myDiv = document.getElementById("myDiv" + _this.queryWidgetData.id);
        if (myDiv == null) {
          return false;
        }
        var inputs = myDiv.getElementsByClassName("el-input__inner");
        let backgroundColor = null;
        let fontColor = null;
        let iconColor = null;
        let borderSize = '1px';
        let borderColor = null;
        if (_this.queryWidgetData.style.widgetStyle && _this.queryWidgetData.style.widgetStyle.backgroundColor) {
          backgroundColor = _this.queryWidgetData.style.widgetStyle.backgroundColor;
        }
        if (_this.queryWidgetData.style.widgetStyle && _this.queryWidgetData.style.widgetStyle.fontColor) {
          fontColor = _this.queryWidgetData.style.widgetStyle.fontColor;
        }
        if (_this.queryWidgetData.style.widgetStyle && _this.queryWidgetData.style.widgetStyle.iconColor) {
          iconColor = _this.queryWidgetData.style.widgetStyle.iconColor;
        }
        if (_this.queryWidgetData.style.widgetStyle && _this.queryWidgetData.style.widgetStyle.borderSize) {
          borderSize = _this.queryWidgetData.style.widgetStyle.borderSize;
        }
        if (_this.queryWidgetData.style.widgetStyle && _this.queryWidgetData.style.widgetStyle.borderColor) {
          borderColor = _this.queryWidgetData.style.widgetStyle.borderColor;
        }
        for (var i = 0; i < inputs.length; i++) {
          inputs[i].setAttribute("style", "border: " + borderSize + " solid " + borderColor + ";background-color:" + backgroundColor + ";color:" + fontColor)
        }
        var dataTexts = myDiv.getElementsByClassName(" item-date-text-width");
        for (var i = 0; i < dataTexts.length; i++) {
          dataTexts[i].setAttribute("style", "border: " + borderSize + " solid " + borderColor + ";background-color:" + backgroundColor + ";color:" + fontColor)
        }

        var icons = myDiv.getElementsByTagName("i");
        for (var i = 0; i < icons.length; i++) {
          icons[i].setAttribute("style", "color:" + iconColor)
        }


      },
      initTitleStyle(){
        let _this = this;
        _this.$set(_this.titleStyle, 'color', _this.queryWidgetData.style.titleColor);
        _this.$set(_this.titleStyle, 'font-size', _this.queryWidgetData.style.titleFontSize);
      },
      initStringData(select){
        if (!this.KHUtils.isNull(this.queryConditionData) && !this.KHUtils.isNull(this.queryConditionData.conditions) && this.queryConditionData.conditions.length > 0) {
          this.queryConditionData.conditions.forEach(item => {
            if (!this.KHUtils.isNull(item.select) && this.KHUtils.isNull(item.select.selectData)) {
              item.select.selectData = [];

            }
          })
        }

      },
      loadFirst(item){
        let _this = this;
        _this.selectItem = item;
        item.pageNum = 1;
        _this.selectData = [];
        let select = item.select;
        if (_this.KHUtils.isNull(item.express)) {
          _this.querySelectData(select, item.pageNum);
        } else {

          if (select.manualValue instanceof Array && select.manualValue.length > 0) {
            select.manualValue.forEach((obj, index) => {
              let newObj = {
                label: obj.value,
                value: obj.value
              }
              _this.selectData.push(newObj);
            });
          }

        }

      },
      loadMore(){
        let _this = this;
        if (!_this.selectItem.pageNum) {
          return false;
        }
        let select = _this.selectItem.select;
        if (_this.KHUtils.isNull(_this.selectItem.express)) {
          _this.selectItem.pageNum++;
          _this.querySelectData(select, _this.selectItem.pageNum);
        }
      },
      querySelectData(select, pageNum){
        if (!this.KHUtils.isNull(select) && !this.KHUtils.isNull(select.source)) {
          let param = {
            dataSetId: select.source.dataset,
            tb: select.source.table,
            col: select.source.column,
            pageNum: pageNum,
            pageSize: 50
          };
          this.$Get(this.khConfig.api.queryColumnData, param).then(res => {
            if (res.errCode === 0) {
              if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                res.datas.forEach(item => {
                  let obj = {
                    label: item,
                    value: item
                  }
                  this.selectData.push(obj);

                })
                // this.refresh();
              }


            }
          });
        }
      },
      loadingString(item){
        let _this = this;
        let select = item.select;
        if (_this.KHUtils.isNull(item.express)) {
          if (!this.KHUtils.isNull(select) && !this.KHUtils.isNull(select.source)) {
            if (select.selectData == null || select.selectData.length == 0) {
              let param = {
                dataSetId: select.source.dataset,
                tb: select.source.table,
                col: select.source.column,
                pageNum: 1,
                pageSize: 10000
              };
              this.$Get(this.khConfig.api.queryColumnData, param).then(res => {

                if (res.errCode === 0) {
                  if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                    res.datas.forEach(item => {
                      let obj = {
                        label: item,
                        value: item
                      }
                      if (select.selectData == null) {
                        select.selectData = [];
                      }
                      select.selectData.push(obj);

                    })
                    this.refresh();
                  }


                }
              });
            }
          }
        } else {
          if (select.selectData == null) {
            select.selectData = [];
          }
          if (select.selectData.length == 0) {
            if (select.manualValue instanceof Array && select.manualValue.length > 0) {
              select.manualValue.forEach((obj, index) => {
                let newObj = {
                  label: obj.value,
                  value: obj.value
                }
                select.selectData.push(newObj);
              });
              this.refresh();
            }
          }

        }


      },
      refresh(){
        this.isRefresh = false;
        this.$nextTick(function () {
          this.isRefresh = true;
        })
        setTimeout(() => {
          this.initWidgetStyle();
        }, 10);
      },
      //组装查询条件
      queryReport(){
        if (!this.KHUtils.isNull(this.queryConditionData.conditions) && this.queryConditionData.conditions.length > 0) {
          for (var i = 0; i < this.queryConditionData.conditions.length; i++) {
            var obj = this.queryConditionData.conditions[i];
            if (obj.required) {
              if (obj.dataType == "String") {
                if (obj.showType == 0) {
                  if (obj.select.defaultValue == null || obj.select.defaultValue.length == 0) {
                    this.$message.error(obj.name + ' 默认值不允许为空');
                    return;
                  } else {
                    for (var j = 0; j < obj.select.defaultValue.length; j++) {
                      if (this.KHUtils.isNull(obj.select.defaultValue[j])) {
                        this.$message.error(obj.name + ' 默认值不允许为空');
                        return;
                      }
                    }
                  }

                } else if (obj.showType == 1) {
                  if (obj.text.defaultValue == null || obj.text.defaultValue.length == 0) {
                    this.$message.error(obj.name + ' 默认值不允许为空');
                    return;
                  } else {
                    for (var j = 0; j < obj.text.defaultValue.length; j++) {
                      if (this.KHUtils.isNull(obj.text.defaultValue[j].value)) {
                        this.$message.error(obj.name + ' 默认值不允许为空');
                        return;
                      }
                    }
                  }
                }

              } else if (obj.dataType == "Number") {
                if (obj.defaultValue == null || obj.defaultValue.length == 0) {
                  this.$message.error(obj.name + ' 默认值不允许为空');
                  return;
                } else {
                  for (var j = 0; j < obj.defaultValue.length; j++) {
                    if (this.KHUtils.isNull(obj.defaultValue[j].value)) {
                      this.$message.error(obj.name + ' 默认值不允许为空');
                      return;
                    }
                  }
                }


              } else if (obj.dataType == "Date") {
                if (obj.defaultValue == null || obj.defaultValue.length == 0) {
                  this.$message.error(obj.name + ' 默认值不允许为空');
                  return;
                } else {
                  for (var j = 0; j < obj.defaultValue.length; j++) {
                    if (this.KHUtils.isNull(obj.defaultValue[j].value)) {
                      this.$message.error(obj.name + ' 默认值不允许为空');
                      return;
                    }
                  }
                }
              }
            }
          }
        }

        this.queryParams = [];
        this.KHReport.createReportConditions(this, this.queryParams, this.queryConditionData.conditions, this.queryConditionData.id);

        this.$emit('queryReportData', this.queryParams);
      }
    },
    computed: {
      getDateFormatType(){
        return function (type) {
          if (type == "year") {
            return "year";
          }
          if (type == "month") {
            return "month";
          }
          if (type == "day") {
            return "date";
          }
          if (type == "week") {
            return "week";
          }
          if (type == "ymdhms") {
            return "datetime";
          }
          if (type == "minute") {
            return "HH:mm";
          }
          if (type == "second") {
            return "HH:mm:ss";
          }
        }
      },
      getDateValueFormat(){
        return function (type) {
          if (type == "year") {
            return "yyyy";
          }
          if (type == "month") {
            return "yyyy-MM";
          }
          if (type == "day") {
            return "yyyy-MM-dd";
          }
          if (type == "hour") {
            return "HH";
          }
          if (type == "minute") {
            return "HH:mm";
          }
          if (type == "second") {
            return "HH:mm:ss";
          }
          if (type == "ymdhms") {
            return "yyyy-MM-dd HH:mm:ss";
          }

        }
      },
      scrollerWidth(){
        return function (item) {
          return item.select.style.width;
        }
      },

      dateValueBind: {
        get(defaultValue) {
          return this.test;
        },
        set(defaultValue, value) {
          /*  if(defaultValue != null && defaultValue.length >0) {
           for (var i = 0; i < defaultValue.length; i++) {
           let object = defaultValue[i];
           if (object.matchType == matchType) {
           object.value = value;
           break;
           }
           }
           }*/
          this.test = value;
        },
      },
      //计算筛选器宽度
      computeSelectWidth(){
        return function (scale, defaultWidth) {
          return {width: scale * defaultWidth + 'px'}
        }

      },
      colFirst: function () {
        return {
          'col-first': this.queryWidgetData.style.widgetType == 1,
          'col-first-width-auto': this.queryWidgetData.style.widgetType == 0,
        }
      },
    }
  }
</script>

<style lang="scss" scoped>
.scrollBar{
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  overflow:auto;
}
  .queryTitle {
    margin-bottom: 5px;
    margin-top: 5px;
    font-size: 10pt;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 205px;
  }

  .leftTitle {
    line-height: 32px;
    // width: 100px;
    max-width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

 ::v-deep .myLeftTitle.el-col-24 {
    width: auto;
  }

  .el-input__inner {
    background-color: red;
  }

  .col-first {
    //  width: auto;
    margin-bottom: 10px;
  }

  .col-first-width-auto {
    width: auto;
    margin-bottom: 10px;
  }

  .number-select {
    width: 60px;
  }

  .number-input {
    width: 140px;;
  }

  .item-width {
    width: 100px;
  }

  .item-big-width {
    width: 205px;
  }

  .item-date-width {
    width: 155px;
  }

  .item-date-text-width {
    width: 50px;
    line-height: 32px;
    background-color: #F8F8FA;
    margin-right: 2px;
  }

  .item-margin-left {
    margin-left: 5px;
  }

  .item-line-height {
    line-height: 32px;
  }

  // .item-height {
  //   height: 32px;
  // }
  .el-checkbox-group {
      display: flex;
  }

  .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }

  .no-query-widget {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #409EFF;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  .connectLine {
    margin-left: 3px;
    margin-right: 3px;
  }

  .query-widget-style {
    // 未选中任何选项的时候 placeholder的样式 需要先选中父元素 增加权重
   ::v-deep input::-webkit-input-placeholder {
      color: #D8D8DA;
    }
   ::v-deep input::-moz-input-placeholder {
      color: #D8D8DA;
    }
   ::v-deep input::-ms-input-placeholder {
      color: #D8D8DA;
    }

    //修改的是el-input的样式
    //一种方法是设置最里层el-input__inner的背景色 外层的两级父元素设置为透明色
    //另一种方法是从el-select到el-input__inenr的背景色都设置为需要的颜色
   ::v-deep .el-select,
   ::v-deep .el-input,
   ::v-deep .el-input__inner {
      background-color: #F8F8FA;
      border: 0px;
      border-radius: 0px;
      /*text-align: center;*/
      color: #575757;
    }

    //el-input聚焦的时候 外层的border会有一个样式
   ::v-deep .el-select .el-input.is-focus .el-input__inner {
      border: 0px;
    }

    //修改的是el-input上下的小图标的颜色
   ::v-deep .el-select .el-input .el-select__caret {
      color: #fff;
    }

    //修改总体选项的样式 最外层
   ::v-deep .el-select-dropdown {
      background-color: #ffffff;
      margin: 0px;
      border: 0px;
      border-radius: 0px;
    }

    //修改单个的选项的样式
   ::v-deep .el-select-dropdown__item {
      background-color: transparent;
      color: black;
    }

    //item选项的hover样式
   ::v-deep .el-select-dropdown__item.hover,
   ::v-deep .el-select-dropdown__item:hover {
      color: #409eff;
    }

    //修改的是下拉框选项内容上方的尖角
   ::v-deep .el-popper .popper__arrow, .el-popper .popper__arrow::after {
      display: none;
    }

  }

</style>
