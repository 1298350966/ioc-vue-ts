<template>
  <section>
      <el-container class="containers">
      <!--页面标题头-->
      <el-header style="background-color:#e9e9e9;height: 50px;line-height: 50px">
          <span>设置查询条件</span>
      </el-header>
      <!--核心部分-->
      <el-container class="containerMain">
        <!--侧页面-->
          <el-aside  style="width: 21%;background-color: #F3F3F3;height: 400px">
              <el-row>
                  <span class="spanMenu">查询条件</span>
                  <div class="addIcon"><el-button  type="text"  size="lager" icon="el-icon-plus" @click="showElInput"></el-button></div>
              </el-row>
              <el-row v-for="(tag,index) in conditions" :key="index">
                  <div  class="el-cond" @dblclick="dbClick(index)" @click="clickLeftMenu(index)"
                      :class="{changeStyle:changeSelectStyle == index}" v-if="showMenuIndex!==index">
                      <el-tooltip effect="dark" content="请先关联图表或字段" placement="top" v-if="condErrorIndex.indexOf(index)!==-1?true:false">
                          <el-button icon="el-icon-warning" type="text" style="color: red"></el-button>
                      </el-tooltip>
                      <div class="over-hide">
                          <el-tooltip effect="dark" placement="top" :content="tag.name" >
                              <span>{{tag.name}}</span>
                          </el-tooltip>
                      </div>
                      <div class="condRight">
                          <el-tooltip effect="dark" content="显示" v-show="tag.display">
                              <el-button type="text" icon="el-icon-view" @click.stop="changeHideOrShow(index)"></el-button>
                          </el-tooltip>
                          <el-tooltip effect="dark" content="隐藏" v-show="!tag.display">
                              <el-button type="text" icon="el-icon-remove" @click.stop="changeHideOrShow(index)"></el-button>
                          </el-tooltip>
                          <el-tooltip effect="dark" content="删除">
                              <span><el-button type="text" @click.stop="deleteQuery(tag)" icon="el-icon-delete"></el-button></span>
                          </el-tooltip>
                      </div>
                  </div>
                  <el-col v-if="showMenuIndex===index">
                      <el-input class="w100" ref="editInput" v-model="addInputValue" @blur="rename(index)"  placeholder="编辑查询条件名称"></el-input>
                  </el-col>
              </el-row>
              <el-row v-if="addInputBool">
                  <el-col>
                      <el-input class="w100" ref="addInput" v-model="addInputValue" @blur="saveInputValue"  placeholder="请输入添加的查询条件名称"></el-input>
                  </el-col>
              </el-row>
          </el-aside>
        <!--中间区域-->
          <el-main style="background-color: snow;width:44%;height: 400px;">
              <el-row style="width: 100%">
                  <el-col :span="3">
                     &nbsp;
                  </el-col>
                  <el-col :span="7">
                      <span>请选择图</span>
                  </el-col>
                  <el-col :span="7">
                      <span>数据集</span>
                  </el-col>
                  <el-col :span="7">
                      <span>请选择字段</span>
                  </el-col>
              </el-row>
              <el-checkbox-group v-model="checkedColumnIndex" @change="handleCheckedChange">
              <el-row v-for="(item,index) in dataChartOptions" :key="index">
                  <el-col :span="3">
                      <el-checkbox style="margin-top: 5px"  :label="item.widgetId">&nbsp;</el-checkbox>
                  </el-col>
                  <el-col :span="7">
                      <el-tooltip :content="item.label" placement="top-start">
                          <el-input class="w95"  :value="item.label" :disabled="true"></el-input>
                      </el-tooltip>
                  </el-col>
                  <el-col :span="7">
                      <el-tooltip :content="item.dsName" placement="top">
                          <el-input class="w95"  :value="item.dsName" :disabled="true"></el-input>
                      </el-tooltip>
                  </el-col>
                  <el-col :span="7">
                      <el-select v-if="index==0" @click.native="getDimOrMeasure()" filterable v-model="chartColumn" @change="changeChartColumn(chartColumn)" class="w95">
                          <el-option-group label="维度">
                              <el-option  v-for="(item,index) in dataSetDims" :label="item.columnLabel"
                                          :key="index" :value="toTran(index,0)" class="option1-box" >
                                  <span style="float: left; color: #468CFF; font-size: 13px;width: 40px">
                                     {{ item.dataType==="String"?"Str.":(item.dataType==="Date"?"Date.":"No.")}}
                                  </span>
                                  <el-tooltip  :content="item.columnLabel" placement="top" style="float: left">
                                      <span>{{ item.columnLabel}}</span>
                                  </el-tooltip>
                              </el-option>
                          </el-option-group>
                          <el-option-group label="度量">
                              <el-option v-for="(item,index) in dataSetMeasures" :label="item.columnLabel"
                                         :key="index" :value="toTran(index,1)" :title="item.columnLabel" class="option1-box">
                                  <span style="float:left; color: #64BD4F; font-size: 13px;width: 40px">
                                    {{item.dataType==="Number"?"No.":"Str."}}
                                  </span>
                                  <el-tooltip  :content="item.columnLabel" placement="top"  style="float: left">
                                      <span>{{ item.columnLabel}}</span>
                                  </el-tooltip>
                              </el-option>
                          </el-option-group>
                      </el-select>
                  </el-col>
              </el-row>
              </el-checkbox-group>
          </el-main>
        <!--右侧部分-->
          <el-main style="width:35%;height: 400px">
              <el-collapse v-if="baseConfBool" v-model="activeNames">
                  <el-collapse-item title="基础配置" name="1" style="width: 100%">
                     <el-row>
                         <el-col :span="5">
                             <span class="font">是否必填</span>
                         </el-col>
                         <el-col :span="16">
                             <el-checkbox v-model="required"><span class="font">必填</span></el-checkbox>
                         </el-col>
                     </el-row>
                     <el-row>
                         <el-col :span="5">
                             <span class="font">展示类型</span>
                         </el-col>
                         <el-col :span="19">
                             <el-select v-model="dataType" class="w75" @change="changeDataType">
                                  <el-option v-for="(item,index) in dataTypeOptions" :key="index"  :value="item.value" :label="item.label"
                               :disabled="item.disable"></el-option>
                             </el-select>
                         </el-col>
                    </el-row>
                     <!--日期类型开始-->
                     <el-row v-if="dataType==4" style="height: 400px">
                         <el-row>
                             <el-col :span="5"><span class="font">时间粒度:</span></el-col>
                             <el-col :span="19">
                                 <el-select v-model="dateDim" class="w75" >
                                     <el-option v-for="(item,index) in dataDimOptions" :value="item.value" :key="index" :label="item.label"
                                 :disabled="item.disable"></el-option>
                                 </el-select>
                             </el-col>
                         </el-row>
                         <el-row v-if="dateFormatBool">
                             <el-col :span="5">时间格式</el-col>
                             <el-col :span="19">
                                 <el-input v-model="dateFormat" disabled class="w75"></el-input>
                             </el-col>
                         </el-row>
                         <el-row v-if="false">
                             <el-col>
                                 <el-checkbox  :disabled="clickDateRangeDisabled"><span class="font">设定时间选择范围</span></el-checkbox>
                             </el-col>
                         </el-row>
                         <el-row v-if="false">
                             <el-col>
                                 <el-button icon="el-icon-help"   :disabled="dateChooseDisabled">设定时间筛选范围</el-button>
                             </el-col>
                         </el-row>
                         <!--设定时间筛选范围开始-->
                         <div v-if="setTimeRangeBool">
                             <el-row>
                                 <el-col :span="12">
                                     <el-checkbox style="margin-left: 10px">开始于:</el-checkbox>
                                 </el-col>
                                 <el-col :span="12">
                                     <el-checkbox>结束于:</el-checkbox>
                                 </el-col>
                             </el-row>
                             <el-row>
                             <el-col :span="12">
                                 <el-date-picker v-if="startDateTimeBool"
                                      type="year" format="yyyy" v-model="startTime"
                                      placeholder="选择日期时间">
                                 </el-date-picker>
                             </el-col>
                             <el-col :span="12">
                                 <el-date-picker v-if="endDateTimeBool" v-model="endTime"
                                      type="datetime"
                                      placeholder="选择日期时间">
                                 </el-date-picker>
                             </el-col>
                         </el-row>
                         </div>
                        <!--设定时间筛选范围结束-->
                         <el-row>
                             <el-col :span="5">筛选方式</el-col>
                             <el-col :span="16">
                                 <el-radio-group v-model="filterType">
                                     <el-radio  :label="0"><span class="font">单{{dateTypeToStr(dateDim)}}</span></el-radio>
                                     <el-radio  :label="1"><span class="font">{{dateTypeToStr(dateDim)}}开区</span></el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <el-row v-if="filterType==1">
                             <el-col :span="5"><span class="font">区间类型</span></el-col>
                             <el-col :span="16">
                                 <el-radio-group v-model="intervalType">
                                     <el-radio class="mar" label="1"><span class="font">开始于</span></el-radio>
                                     <el-radio class="mar" label="2"><span class="font">结束于</span></el-radio>
                                     <el-radio class="mar" label="3"><span class="font">时间区间</span></el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <el-row>
                             <el-col>
                                 <el-checkbox v-model="dateDefaultBool"><span class="font">设定预设筛选值</span></el-checkbox>
                             </el-col>
                         </el-row>
                         <!--设定预设筛选值开始-->
                         <el-row style=" background-color:#f8f8fa; height: 160px;" v-if="dateDefaultBool&&filterType==1">
                             <el-progress :percentage="100" status="success" style="line-height: 40px;height: 40px;margin-top: 20px"></el-progress>
                             <el-row>
                                 <el-col :span="12">
                                     <span class="mar">开始于:</span>
                                 </el-col>
                                 <el-col :span="12">
                                     <span class="mar">结束于:</span>
                                 </el-col>
                             </el-row>
                             <el-row>
                                 <el-col :span="12">
                                     <el-date-picker class="leftW25"  v-if="(intervalType==1||intervalType==3)&&(dimOrMeasure.type=='year'
                                       ||dimOrMeasure.type=='day'||dimOrMeasure.type=='ymdhms'||dimOrMeasure.type=='month')"  @change="handleChangeDate"
                                                 :value-format="getDateValueFormat(dimOrMeasure.type)"  :type="getDateFormatType(dimOrMeasure.type)" v-model="defaultStartTime"
                                               placeholder="选择日期时间">
                                     </el-date-picker>
                                     <custom-week-picker  class="leftW25" v-if="(intervalType==1||intervalType==3)&&(dimOrMeasure.type=='week')"
                                                    v-model="defaultStartTime" @change="handleChangeDate"></custom-week-picker>
                                     <custom-quarter-picker  class="leftW25" @change="handleChangeDate" v-if="(intervalType==1||intervalType==3)&&(dimOrMeasure.type=='quarter')" v-model="defaultStartTime">
                                     </custom-quarter-picker><!--年季度-->
                                     <custom-hour-picker class="leftW25" @change="handleChangeDate" v-model="defaultStartTime" v-if="(intervalType==1||intervalType==3)&&(dimOrMeasure.type=='hour')">
                                     </custom-hour-picker> <!--小时-->
                                      <!--分,秒-->
                                     <el-time-picker class="leftW25" @change="handleChangeDate" v-if="(intervalType==1||intervalType==3)&&(dimOrMeasure.type=='second'||dimOrMeasure.type=='minute')"
                                               v-model="defaultStartTime"
                                               :format="getDateFormatType(dimOrMeasure.type)"
                                               :value-format="getDateValueFormat(dimOrMeasure.type)"
                                               placeholder="请选择">
                                     </el-time-picker>
                                 </el-col>
                                 <el-col :span="12">
                                     <el-date-picker class="leftW25" v-if="(intervalType==2||intervalType==3)&&(dimOrMeasure.type=='year'
                                        ||dimOrMeasure.type=='day'||dimOrMeasure.type=='ymdhms'||dimOrMeasure.type=='month')" @change="handleChangeDate"
                                                 :value-format="getDateValueFormat(dimOrMeasure.type)"  :type="getDateFormatType(dimOrMeasure.type)" v-model="defaultEndTime"
                                          placeholder="选择日期时间">
                                     </el-date-picker>
                                     <custom-week-picker  class="leftW25" v-if="(intervalType==2||intervalType==3)&&(dimOrMeasure.type=='week')"
                                                   v-model="defaultEndTime" @change="handleChangeDate"></custom-week-picker>
                                     <custom-quarter-picker class="leftW25" @change="handleChangeDate" v-if="(intervalType==2||intervalType==3)&&(dimOrMeasure.type=='quarter')" v-model="defaultEndTime">
                                     </custom-quarter-picker><!--年季度-->
                                     <custom-hour-picker class="leftW25" @change="handleChangeDate" v-model="defaultEndTime" v-if="(intervalType==2||intervalType==3)&&(dimOrMeasure.type=='hour')">
                                     </custom-hour-picker> <!--小时-->
                                      <!--分,秒-->
                                     <el-time-picker class="leftW25" @change="handleChangeDate" v-if="(intervalType==2||intervalType==3)&&(dimOrMeasure.type=='second'||dimOrMeasure.type=='minute')"
                                               v-model="defaultEndTime"
                                               :format="getDateFormatType(dimOrMeasure.type)"
                                               :value-format="getDateValueFormat(dimOrMeasure.type)"
                                               placeholder="请选择">
                                 </el-time-picker>
                                 </el-col>
                             </el-row>
                         </el-row>
                         <!--设定预设筛选值结束-->
                     </el-row>
                     <!--日期类型结束-->
                     <!--数字类型开始-->
                     <el-row v-if="dataType==3">
                         <el-row>
                             <el-col :span="5">聚合方式
                             </el-col>
                             <el-col :span="19">
                                 <el-select v-model="showType" class="w75">
                                     <el-option v-for="(item,index) in numTypeOptions" :key="index" :value="item.value" :label="item.label" :disabled="item.disable">
                                     </el-option>
                                 </el-select>
                             </el-col>
                         </el-row>
                         <el-row>
                             <el-col :span="5">条件形式</el-col>
                             <el-col :span="16">
                                 <el-radio-group v-model="condType" @change="changeNumState">
                                     <el-radio value="0" :label="0" class="mar"><span class="font">单条件</span></el-radio>
                                     <el-radio value="1" :label="1" class="mar"><span class="font">或条件</span></el-radio>
                                     <el-radio value="2" :label="2" class="mar"><span class="font">且条件</span></el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <el-row style="margin-top: 15px">
                             <el-checkbox v-model="numDefaultBool">设定默认值</el-checkbox>
                         </el-row>
                        <!--单条件-->
                         <el-row v-if="condType ==0 && numDefaultBool" style="margin-top: 15px">
                             <div style="margin-left: 30px">
                                 <el-select v-model="matchType1" class="w-text-match">
                                     <el-option v-for="(item,index) in matchTypeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                                 </el-select>
                                 <el-input-number v-model="numValue1" controls-position="right" class="w-text-value" placeholder="数值"></el-input-number>
                             </div>
                         </el-row>
                        <!--或且条件-->
                         <el-row v-if="(condType==1||condType==2)&& numDefaultBool">
                             <div style="margin-left: 40px">
                                 <el-row style="margin: 5px">
                                      <el-col :span="2">
                                        ┌----
                                      </el-col>
                                      <el-col :span="8">
                                          <el-select v-model="matchType1" class="w-text-match">
                                              <el-option v-for="(item,index) in matchTypeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                                          </el-select>
                                      </el-col>
                                      <el-col :span="8">
                                          <el-input-number v-model="numValue1" class="w-text-value" controls-position="right"></el-input-number>
                                      </el-col>
                                 </el-row>
                                 <el-row style="line-height: 0px">
                                      <el-col :span="3" v-if="condType==1">或</el-col>
                                      <el-col :span="3" v-if="condType==2">且</el-col>
                                      <el-col :span="7">&nbsp;</el-col>
                                      <el-col :span="8">&nbsp;</el-col>
                                 </el-row>
                                 <el-row style="margin: 5px">
                                      <el-col :span="2">
                                      └----
                                      </el-col>
                                      <el-col :span="8">
                                           <el-select v-model="matchType2" class="w-text-match">
                                                <el-option v-for="(item,index) in matchTypeOptions" :key="index" :value="item.value"
                                                           :label="item.label"></el-option>
                                           </el-select>
                                      </el-col>
                                      <el-col :span="8">
                                            <el-input-number v-model="numValue2" class="w-text-value" controls-position="right"></el-input-number>
                                      </el-col>
                                 </el-row>
                             </div>
                         </el-row>
                     </el-row>
                    <!--数字类型结束-->
                    <!--字符串类型--下拉列表开始-->
                     <el-row v-if="dataType==0">
                         <el-row>
                             <el-col :span="5">
                                 <span class="font">选项值来源</span>
                             </el-col>
                             <el-col :span="19">
                                 <el-radio-group v-model="valueSource" @change="changeStringState">
                                     <el-radio label="0" class="mar"><span class="font">自动解析</span></el-radio>
                                     <el-radio label="1" class="mar"><span class="font">单个数据集</span></el-radio>
                                     <el-radio label="2" class="mar"><span class="font">手工输入</span></el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <!--单个数据集选择框-->
                         <el-row v-if="valueSource==1">
                             <el-row>
                                 <el-col :span="5">&nbsp;</el-col>
                                 <el-col :span="19">
                                     <el-select v-model="dataSet" class="w75" @click.native="selectDataSet" placeholder="请选择数据集" v-el-select-loadMore="loadMore">
                                         <el-option-group label="推荐选择的数据集">
                                             <el-option :label="dataSetName" value="" class="option2-box"></el-option>
                                         </el-option-group>
                                         <el-option-group label="其他数据集">
                                             <el-option v-for="(item,index) in dataSetOptions" :key="index"class="option2-box"
                                                      :value="index" :label="item.dsName">
                                                 <el-tooltip effect="dark" :content="item.dsName" placement="top">
                                                     <span>{{ item.dsName}}</span>
                                                 </el-tooltip>
                                             </el-option>
                                         </el-option-group>
                                     </el-select>
                                 </el-col>
                             </el-row>
                             <el-row>
                                 <el-col :span="5">&nbsp;</el-col>
                                 <el-col :span="19">
                                     <el-col :span="6"><span class="font">查询值字段</span></el-col>
                                     <el-col :span="13">
                                         <el-select v-model="selectColumn" @change="changeSelectColumn" @click.native="dealDataSetColumn" style="width: 92%">
                                             <el-option-group label="维度">
                                                 <el-option  v-for="(item,index) in selectDataSetDims" :label="item.columnLabel"
                                                  :key="index" :value="toTran(index,0)" class="option1-box" v-if="KHUtils.isNull(item.express)">
                                                      <span style="float: left; color: #468CFF; font-size: 13px;width: 40px">
                                                         {{ item.dataType==="String"?"Str.":item.dataType =="Date"?"Date":"No"}}
                                                      </span>
                                                      <el-tooltip effect="dark" :content="item.columnLabel" placement="top">
                                                          <span style="float: left">{{ item.columnLabel}}</span>
                                                      </el-tooltip>
                                                 </el-option>
                                             </el-option-group>
                                             <el-option-group label="度量">
                                                 <el-option v-for="(item,index) in selectDataSetMeasures" :label="item.columnLabel"
                                                     class="option1-box":key="index" :value="toTran(index,1)" v-if="KHUtils.isNull(item.express)">
                                                     <span style="float:left; color: #64BD4F; font-size: 13px;width: 40px">No</span>
                                                     <el-tooltip effect="dark" :content="item.columnLabel" placement="top">
                                                         <span style="float: left">{{ item.columnLabel}}</span>
                                                     </el-tooltip>
                                                 </el-option>
                                             </el-option-group>
                                         </el-select>
                                     </el-col>
                                 </el-col>
                             </el-row>
                             <el-row v-if="false">
                                 <el-col :span="6">&nbsp;</el-col>
                                 <el-col :span="18">
                                 <el-col :span="6">显示名称字段</el-col>
                                 <el-col :span="14">
                                     <el-select v-model="displayColumn">
                                         <el-option-group label="维度">
                                             <el-option  v-for="(item,index) in selectDataSetDims" :label="item.columnLabel"
                                              :key="index" :value="toTran(index,0)">
                                             </el-option>
                                         </el-option-group>
                                         <el-option-group label="度量">
                                             <el-option v-for="(item,index) in selectDataSetMeasures" :label="item.columnLabel"
                                             :key="index" :value="toTran(index,1)">
                                             </el-option>
                                         </el-option-group>
                                     </el-select>
                                 </el-col>
                              </el-col>
                         </el-row>
                         </el-row>
                         <!--手工输入-->
                         <el-row v-if="valueSource==2">
                             <el-row>
                                 <el-col :span="5">&nbsp;</el-col>
                                 <el-col :span="19">
                                     <el-button type="primary" icon="el-icon-edit" @click="clickManualInput">手工输入</el-button>
                                     <span v-if="KHUtils.isNull(manualKey)">未配置</span>
                                     <span v-if="!KHUtils.isNull(manualKey)" style="color: #55a532">已配置</span>
                                 </el-col>
                             </el-row>
                         </el-row>
                         <el-row>
                             <el-col :span="5">查询方式</el-col>
                             <el-col :span="19">
                                 <el-radio-group v-model="pickType" @change="changePickType">
                                     <el-radio  label="0">单选</el-radio>
                                     <el-radio  label="1">多选</el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <el-row>
                             <el-col>
                                 <el-checkbox v-model="setStringDefaultBool"  :disabled="stringDisabled">设定筛选默认值</el-checkbox>
                             </el-col>
                         </el-row>
                         <el-row v-if="valueSource==2&&setStringDefaultBool">
                             <el-col :span="7">
                                 <el-select  placeholder="请选择(单选)"  v-model="manualSingleVal" style="width: 250px" v-if="pickType==0">
                                     <el-option v-for="(item,index) in  manualValue"  :key="index" :value="item.key" :label="item.value"></el-option>
                                 </el-select>
                                 <el-select  placeholder="请选择(多选)" v-model="manualDoubleVal"  multiple style="width:250px" v-if="pickType==1">
                                     <el-option v-for="(item,index) in  manualValue" :key="index"  :value="item.key" :label="item.value"></el-option>
                                 </el-select>
                             </el-col>
                         </el-row>
                         <el-row v-if="valueSource==1&&setStringDefaultBool">
                             <el-col :span="7">
                                 <el-input  v-model="dataSetSingleVal" placeholder="请选择单选" @click.native="changeStringDefault" filterable style="width: 250px" v-if="pickType==0">
                                 </el-input>
                                 <el-input type="textarea" rows="5" placeholder="请选择多选" @click.native="changeStringDefault" v-model="dataSetDoubleVal" filterable multiple style="width:250px" v-if="pickType==1">
                                 </el-input>
                             </el-col>
                         </el-row>
                         <el-row v-if="valueSource==0&&setStringDefaultBool">
                             <el-col :span="7">
                                 <el-input v-if="pickType==0" @click.native="changeStringDefault" style="width:250px" v-model="manualSingleVal"></el-input>
                                 <el-select  placeholder="请选择(多选)" @click.native="changeStringDefault" v-model="manualDoubleVal" filterable multiple style="width:250px" v-if="pickType==1">
                                 </el-select>
                             </el-col>
                         </el-row>
                     </el-row>
                     <!--字符串类型----下拉列表结束-->
                    <!--字符串类型--文本输入框开始-->
                     <el-row v-if="dataType==1">
                         <el-row>
                             <el-col :span="5">条件形式</el-col>
                             <el-col :span="16">
                                 <el-radio-group v-model="condType" @change="changeNumCond">
                                     <el-radio value="0" class="mar" :label="0"><span class="font">单条件</span></el-radio>
                                     <el-radio value="1" class="mar" :label="1"><span class="font">或条件</span></el-radio>
                                     <el-radio value="2" class="mar" :label="2"><span class="font">且条件</span></el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <el-row style="margin-top: 15px">
                             <el-checkbox v-model="textDefaultBool">设定默认值</el-checkbox>
                         </el-row>
                          <!--单条件-->
                         <el-row v-if="condType==0 && textDefaultBool" style="margin-top: 15px">
                              <div style="margin-left: 30px">
                                  <el-select v-model="strMatchType1"  class="w-text-match">
                                       <el-option v-for="(item,index) in textMatchTypeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                                  </el-select>
                                  <el-input v-model="strValue1" controls-position="right" class="w-text-value"  placeholder="字符或值"></el-input>
                              </div>
                         </el-row>
                         <!--或且条件-->
                         <el-row v-if="(condType==1||condType==2)&& textDefaultBool">
                             <div style="margin-left: 40px">
                                 <el-row style="margin: 5px">
                                     <el-col :span="2">┌-----</el-col>
                                     <el-col :span="8">
                                         <el-select v-model="strMatchType1" class="w-text-match">
                                              <el-option v-for="(item,index) in textMatchTypeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                                         </el-select>
                                     </el-col>
                                     <el-col :span="8">
                                         <el-input v-model="strValue1" class="w-text-value" placeholder="字符或值"></el-input>
                                     </el-col>
                                  </el-row>
                                 <el-row style="line-height: 0px">
                                     <el-col :span="3" v-if="condType==1">或</el-col>
                                     <el-col :span="3" v-if="condType==2">且</el-col>
                                     <el-col :span="7">&nbsp;</el-col>
                                     <el-col :span="8">&nbsp;</el-col>
                                 </el-row>
                                 <el-row style="margin: 5px">
                                     <el-col :span="2">└-----</el-col>
                                     <el-col :span="8">
                                         <el-select v-model="strMatchType2" class="w-text-match">
                                             <el-option v-for="(item,index) in textMatchTypeOptions" :key="index" :value="item.value" :label="item.label"></el-option>
                                         </el-select>
                                     </el-col>
                                     <el-col :span="8">
                                         <el-input v-model="strValue2" class="w-text-value" placeholder="字符或值"></el-input>
                                     </el-col>
                                 </el-row>
                             </div>
                         </el-row>
                     </el-row>
                  <!--字符串类型--文本输入框结束-->
                  </el-collapse-item>
              </el-collapse>
              <div v-if="!baseConfBool">
                  <img src="@/assets/images/none.png" style="width: 60%;height: 50%;margin-left: 20%;margin-top: 20%"/>
                  <p class="fontNone">请先选择关联图表及字段哦</p>
              </div>
          </el-main>
      </el-container>
      <!--尾部-->
      <el-footer style="background-color:#e9e9e9;height: 50px;line-height: 50px">
          <div style="float: right">
              <el-button  type="primary" @click="cancelSave">取消</el-button>
              <el-button type="primary" @click="saveConditions">保存</el-button>
          </div>
      </el-footer>
    </el-container>
    <div v-if="manualInputBool&&(valueSource==2)" class="manualInput" >
        <div style="height: 50px;line-height: 50px;font-size: 20px;border-bottom: 1px solid #F2F2F2">
            <span style="margin-left: 20px">手工录入</span>
        </div>
        <div style="width: 480px;height: 600px;border-bottom: 1px solid #F2F2F2">
            <div style="width: 220px; height:600px;float: left;margin-left: 10px;">
                <div style="margin-top: 10px;margin-bottom: 10px"><span style="color: red">*</span><span style="color:#D3D3D3">查询值</span></div>
                <div>
                    <textarea v-model="manualKey" id="textareaId" @input="descInputKey" rows="22"  class="textArea"
                              >
                    </textarea>
                </div>
                <div style="margin-left: 10px">
                    <span>已添加{{manualKeyRows}}行</span>
                    <el-button type="text" icon="el-icon-delete" @click="clearInputKey">清空</el-button>
                </div>
            </div>
            <div style=" width: 220px; height:600px;float: right;margin-right: 10px">
                <div style="margin-left: 10px;margin-top: 10px;margin-bottom: 10px"><span style="color:#D3D3D3">显示名称</span></div>
                <div>
                    <textarea v-model="manualVal" @input="descInputVal" rows="22" class="textArea2">
                    </textarea>
                </div>
                <div style="margin-left: 10px;">
                    <span>已添加{{manualValRows}}行</span>
                    <el-button type="text" icon="el-icon-delete" @click="clearInputVal">清空</el-button>
                </div>
            </div>
        </div>
        <div>
            <div style="margin-top: 20px;float: right;margin-right: 30px">
                <el-button type="primary" @click="cancelManualInput">取消</el-button>
                <el-button type="primary" @click="checkManualConfig">确定</el-button>
            </div>
        </div>
    </div>
    <div  v-if="stringDefaultBool&&(valueSource==0||valueSource==1)"class="stringDefault" >
         <div style="width: 100%;height: 12%;border-bottom: 1px solid #F2F2F2">
             <div style="width: 50%;height:100%;float: left;padding-top: 30px;border-right: 1px solid #F2F2F2">
                 <span style="font-size: 18px;margin-left: 15px">字段</span>
             </div>
             <div style="width: 50%;height: 100%;float: right;padding-top: 30px ">
                 <span style="margin-left: 15%">已添加({{addColumns.length+'/'+maxLimitNum}})</span>
             </div>
         </div>
         <div style="width: 100%;height: 76%;">
            <!--左侧要选择和查询的值-->
             <div style="height:100%;float: left;width: 50%">
                <div style="height: 100%;width: 100%"  v-loading="loading">
                 <el-input placeholder="输入名称搜索" @blur="listColumnByKeyWord" v-model="KeyWord" prefix-icon="el-icon-search"></el-input>
                 <!--查询显示内容-->
                 <div :class="[pickType=='0'?'pick-type0':'pick-type1']"  v-infinite-scroll="busy?'':load" :infinite-scroll-disabled="busy">
                     <div @mouseover="overShow(index)" @click="selectedOver(index)" :class="{leftChangeStyle:overShowIndex===index}" @mouseleave="overShowIndex=''"
                         v-for="(item,index) in counts" :key="index" style="height: 10%;width: 95%;float: right">
                         <el-button class="left"  v-if="item.check" type="text" icon="el-icon-check" ></el-button>
                         <el-button class="left"  v-if="!item.check" type="text" >&nbsp;&nbsp;&nbsp;</el-button>
                         <div class="over-hide">
                             <el-tooltip :content="item.value" placement="top">
                                 <span class="spanLeft">{{item.value}}</span>
                             </el-tooltip>
                         </div>
                         <el-button circle type="text" v-if="overShowIndex===index" icon="el-icon-circle-plus" style="float: right;margin-right: 3%;font-size: 20px"></el-button>
                     </div>
                 </div>
                 <div style="height:10%;width: 100%;margin-bottom: 0;" v-if="pickType==1">
                     <el-button style="height:100%;width: 100%"  @click="saveAllColumns">添加左侧全部字段值(最多50)</el-button>
                 </div>
             </div>
             </div>
             <!--右侧被选中的值-->
             <div style="height:100%;float: left;width: 50%">
                 <div style="width: 100%;height: 90%;overflow:auto;">
                     <div v-for="(column,index) in addColumns" :key="index" style="width: 95%;height: 9%;" :class="{rightChangeStyle:rightShowIndex===index}"
                          @mouseover="rightShow(index)" @mouseleave="rightShowIndex=''">
                         <div class="over-hide" style="width: 70%">
                             <el-tooltip :content="column.value" placement="top">
                                 <span class="spanLeft">{{column.value}}</span>
                             </el-tooltip>
                         </div>
                         <el-button type="text" icon="el-icon-delete" class="buttonRight" @click="clearColumn(index)"></el-button>
                     </div>
                 </div>

                 <div style="width: 100%;height: 10%;border-bottom: 1px solid #F2F2F2;border-top: 1px solid #F2F2F2">
                     <span style="float: left;margin-top: 10px">已添加{{addColumns.length}}条</span>
                     <el-button type="text" icon="el-icon-delete" style="float: right" @click="clearAllColumn">清空</el-button>
                 </div>
             </div>
         </div>
         <div style="width: 100%;height: 12%">
             <div style="margin-top: 10px;float: right;margin-right: 10px">
                 <el-button type="primary" @click="cancelManualInput">取消</el-button>
                 <el-button type="primary" @click="saveSelectColumn">确认</el-button>
             </div>
         </div>
    </div>
  </section>
</template>
<script>
import CustomHourPicker from "@/components/CustomHourPicker";
import CustomQuarterPicker from "@/components/CustomQuarterPicker"
import CustomWeekPicker from "@/components/CustomWeekPicker";
var time=null;
export default {
  directives: {
    'el-select-loadMore': {
      inserted(el, binding) {
        const SELECTWRAP_DOM = el.querySelector(
          '.el-select-dropdown .el-select-dropdown__wrap'
        );
        SELECTWRAP_DOM.addEventListener('scroll', function() {
          const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
          if (condition) {
            binding.value();
          }
        });
      }
    }
  },
  name: "ConditionConfig",
  components:{CustomHourPicker,CustomQuarterPicker,CustomWeekPicker},
  props:{
    widgets:{
      type:Array,
      default(){
        return{}
      }
    },
    queryId:{

    }
  },
  data(){
      return{
          /*左侧功能的参数开始*/
          conditions: [],    //查询条件数组
          changeSelectStyle:"",
          showMenuIndex:"", //判断重命名下标
          addInputValue:"", //点击边框时会添加的值
          addInputBool:false,         //是否在增加查询条件
          queryMenuIndex:"",          //查询条件的下标,即是当前查询条件在conditions中的下标
          /*中间区域*/
          dataChartOptions:[],
          chartColumn:"", //维度或度量下标+类型的组合
          dataSetDims:[],//维度
          dataSetMeasures:[], //度量
          baseConfBool:false,
          activeNames:"1",
          dataTypeOptions:[
              {value:0,label:"下拉列表",disable:true},
              {value:1,label:"文本输入框",disable:true},
              {value:2,label:"树形下拉",disable:true},
              {value:3,label:"数值输入框",disable:true},
              {value:4,label:"时间选择",disable:true},
          ],
          dataType:"0",
          dateDim:"", //时间
          dataDimOptions:[
              {value:"year",label:"年",disable:true},
              {value:"quarter",label:"年-季度",disable:true},
              {value:"month",label:"年-月",disable:true},
              {value:"week",label:"年周",disable:true},
              {value:"day",label:"年-月-日",disable:true},
              {value:"hour",label:"时",disable:true},
              {value:"minute",label:"时-分",disable:true},
              {value:"second",label:"时-分-秒",disable:true},
              {value:"ymdhms",label:"年-月-日-时-分-秒",disable:true}
          ],
          copeDataDimOptions:[],
          valueSource:"0",//选择值来源,
          stringDisabled:false,
          pickType:"0",
          selectDataSetDims:[],  //查询字段--维度
          selectDataSetMeasures:[],// 查询字段-度量
          displayColumn:"",
          selectColumn:"",
          dataSetOptions:[],//String,类型的下拉列表,数据集通过查询得到
          dataSet:"",
          dimOrMeasure:{},
          dateFormat:"YYYY-MM-DD HH:mm:ss",
          clickDateRangeDisabled:false, //当点击了设定时间筛选范围,就不能点击设定时间选择范围按钮
          filterType:0, //过滤方式 单秒还是秒开区
          dateFormatBool:false,
          dateChooseDisabled:true,
          setTimeRangeBool:false,
          condType:0,//条件形式
          numTypeOptions:[
             {value:"none",label:"无聚合",disable:false},
             {value:"sum",label:"求和",disable:false},
             {value:"avg",label:"平均值",disable:false},
             {value:"count",label:"计数",disable:false},
             {value:"dscount",label:"去重计数",disable:false},
             {value:"min",label:"最小值",disable:false},
             {value:"max",label:"最大值",disable:false}
          ],
          intervalType:"1",  //区间类型
          dateDefaultBool:false,
          textMatchTypeOptions:[
             {value:"$eq",label:"精确匹配"},
             {value:"$like",label:"包含"},
             {value:"$nlike",label:"不包含"},
             {value:"$neq",label:"不匹配"},
             {value:"$hlike",label:"开头是"},
             {value:"$null",label:"为空"},
             {value:"$notnull",label:"不为空"},
             {value:"$empty",label:"空文本"},
          ],
          matchTypeOptions:[
             {value:"$eq",label:"等于"},
             {value:"$neq",label:"不等于"},
             {value:"$gt",label:"大于"},
             {value:"$gte",label:"大于等于"},
             {value:"$lt",label:"小于"},
             {value:"$lte",label:"小于等于"},
        ],
          defaultStartTime:"",
          defaultEndTime:"",
          numDefaultBool:false,    //数字 默认判断
          matchType1:"$eq", //数值类型匹配类型1
          matchType2:"$eq",//数值类型匹配类型2
          numValue1:"",//数字类型的值1
          numValue2:"", //数字类型值2
          showType:"none",//N数字类型集合方式默认为
          strMatchType1:"$eq",  //字符串类型匹配1
          strMatchType2:"$eq",  //字符串类型匹配2
          strValue1:"",  //字符串类型数值1
          strValue2:"", //字符串类型数值2
          widgetParam:{
             widget:""
          },//临时控件对象
          setStringDefaultBool:false,
          addColumns:[],  //已经添加的字段,
          KeyWord:"",//String类型中的
          counts:[],
          pageNum:0,
          overShowIndex:"",
          rightShowIndex:"",
          textDefaultBool:false,  //文本框的默认值判断
          manualInputBool:false,
          manualVal:"", //人工输入的值
          manualKey:"",  //人工输入的键
          manualKeyRows:0,
          manualValRows:0,
          manualValue:[],//人工输入的键值对
          manualSingleVal:"",//人工单选
          manualDoubleVal:[],//人工双选
          dataSetOptions:[],//String,类型的下拉列表,数据集通过查询得到
          dataSetSingleVal:"",//单个数据集的单选
          dataSetDoubleVal:"",//单个数据集的多选
          stringDefaultBool:false,
          dataSetName:"",
          dataSetId:"",
          newAddBool:false,  //当前查询条件是否为新增的查询条件判断
          queryName:"",
          queryConditionIndex:0,
          tabQueryBool:false, //判断查询控件是否在tab标签页中
          required:false,  //判断查询条件是否为必填
          busy:false,       //在自动解析和单个数据集中,滚动滑轮是否继续加载判断
          deleteMenuBool:true,
          deleteIndex:"",//删除查询条件的下标
          condErrorIndex:[],//查询条件错误配置的下标
          signCheckIndex:"",
          queryDSName:"",
          checkedColumnIndex:[],
          clickColumnBool:true,
          checkComputeBool:false,
          selectSource:{},
          manualKayValSize:0,
          loading:false,
          addMenuIndex:0, //新增查询条件的下标
          loadPageNum:1,
          maxLimitNum:50, //添加最大数据量
          cloneDataSetDims:[],
          cloneDataSetMeasures:[]
      }
  },
  computed:{
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
  },
  methods:{
    /*解析数据--父组件传给子组件的数据*/
     parsingData(){
       let _this=this;
       let queryIndex=""; //查询条件的下标
       let reportIndex=[]; //用于获取type为reportWidget的下标---第一级查询控件
       let tabIndex=[];  //用于获取type为tabPageWidget的下标--tab页只有一层级
       let condition=[]; //查询条件的设置
       _this.dataChartOptions=[];
       /*先将查询条件的名称获取出来*/
       for (let i=0;i<_this.widgets.length;i++){
          if (_this.widgets[i].type=='reportWidget'&&!_this.KHUtils.isNull(_this.widgets[i].data.dataset)){ /*一级图表*/
              reportIndex.push(i);
              let param={
                  label:_this.widgets[i].name,
                  widgetId:_this.widgets[i].id+"", //控件id
                  dsId:_this.widgets[i].data.dataset,
                  dsName:_this.widgets[i].data.dsName
              }
              _this.dataChartOptions.push(param);
          }else if (_this.widgets[i].type=='tabPageWidget'){   /*一级标签页*/
              tabIndex.push(i);
          }else if (_this.widgets[i].type=='queryWidget'){
              if(_this.queryId==_this.widgets[i].id){
                  queryIndex=i;
                  _this.queryConditionIndex=i;
                  _this.tabQueryBool=true;
              }
          }
       }
        if (_this.tabQueryBool){
           condition=_this.KHUtils.clone(_this.widgets[queryIndex].conditions);
        }
        if (!_this.KHUtils.isNull(tabIndex[0])){
           for (let j=0;j<tabIndex.length;j++){
              for(let n=0;n<_this.widgets[tabIndex[j]].tabs.length;n++){
                  let widget=_this.widgets[tabIndex[j]].tabs[n];
                  let secondWidget=widget.tabContent.widgets;
                  for (let i=0;i<secondWidget.length;i++) {
                      if (secondWidget[i].type == 'reportWidget' && !_this.KHUtils.isNull(secondWidget[i].data.dataset)) { /*一级图表*/
                          let param = {
                             label: secondWidget[i].name,
                             widgetId: secondWidget[i].id + "", //控件id
                             dsId: secondWidget[i].data.dataset,
                             dsName: secondWidget[i].data.dsName
                         }
                        _this.dataChartOptions.push(param);
                      }
                  }
              }
           }
        }
         /*对查询条件进行遍历获取控件名称和报表控件的Id*/
        for (let i=0;i<condition.length;i++){
            _this.conditions.push(condition[i]);
        }

        if (_this.conditions.length>0){
            _this.clickLeftMenu(0);
        } else {
            _this.addInputBool=true;
            _this.addInputValue="未命名";
            _this.queryMenuIndex=0;
            _this.$nextTick(function () {
                _this.$refs.addInput.focus()
            })
        }
    },
    /*左侧导航菜单,重命名双击事件*/
     dbClick(index){
         clearTimeout(time);  //清除
         let _this=this;
         _this.addInputValue="";
         _this.showMenuIndex=index;
         _this.addInputValue=_this.conditions[index].name;
     },
    /*保存输入框的值*/
     saveInputValue(){
      let _this=this;
      _this.showMenuIndex="";
      _this.dataSetName="";
      _this.baseConfBool=false;
      if (_this.KHUtils.isNull(_this.addInputValue)){
        _this.addInputBool=false;
      }else {
        let obj={
            name:_this.addInputValue,
            style:{widthScale:1},
            display:true
        }
        _this.conditions.push(obj);
        _this.addInputBool=false;
      }
      _this.clickLeftMenu(_this.conditions.length-1);
    },
    /*点击添加按钮,显示出添加输入框*/
     showElInput(){
         let _this=this;
         _this.addInputValue="";
         _this.showMenuIndex="";
         _this.checkedColumnIndex=[];
         _this.initColumnConfig();
         _this.addInputBool=true;
         _this.addMenuIndex=_this.conditions.length;
         _this.newAddBool=false;
         _this.addInputValue="未命名";
         _this.required=false;
         _this.$nextTick(function () {  //让新增的聚集
             _this.$refs.addInput.focus()
         });
         _this.changeSelectStyle='a';
         _this.baseConfBool=false;
     },
    /*重命名*/
    rename(index){
      let _this=this;
      if (!_this.KHUtils.isNull(_this.addInputValue)){
        _this.conditions[index].name=_this.addInputValue;
      }
      _this.showMenuIndex="";
      _this.closeMenuIndex="";
    },
    /*修改查询条件的样式--在主界面左侧,判断这个查询条件信息*/
     clickLeftMenu(index){
       clearTimeout(time);  //首先清除计时器,定时器的作用是防止双击事件
       time = setTimeout(() => {
        let _this=this;
        if (_this.deleteMenuBool){
             _this.saveQueryCond();
        }
        _this.initColumnConfig();
        _this.addMenuIndex=index;
        _this.changeSelectStyle=index;
        _this.busy=false;
        _this.addColumns=[];
        _this.dataSetMeasures=[];//将度量设为空
        _this.dataSetDims=[];   //将维度设为空
        _this.queryMenuIndex=index; //将下标赋给全局变量
        if (_this.KHUtils.isNull(_this.conditions[index].widget)) { //判断这个查询条件是否绑定图表控件,为空说明是新加的查询条件
            _this.checkedColumnIndex=[];
            _this.widgetParam={};
            _this.queryName=_this.conditions[index].name;
            _this.newAddBool=false;
            _this.baseConfBool=false;
            _this.deleteMenuBool=true;
        }else {  //父组件传过来的
            _this.checkedColumnIndex=[];
            let widgets=_this.conditions[index].widget.split(",");
            for (let j=0;j<widgets.length;j++){
                _this.checkedColumnIndex.push(widgets[j]);
            }
            _this.queryName=_this.conditions[index].name;
            _this.widgetParam.widget=_this.conditions[index].widget;
            _this.widgetParam.display=_this.conditions[index].display;
            if (_this.KHUtils.isNull( _this.getDataSetId(_this.checkedColumnIndex[0]))){
               _this.checkedColumnIndex=[];
               return;
            }
            _this.getDataSetDimAndMeasure( _this.getDataSetId(_this.checkedColumnIndex[0]),index);
            _this.newAddBool=true;
        }
       }, 300);
    },
    /*根据数据集Id获取维度和度量*/
    getDataSetDimAndMeasure(dsId,index){
      /*查询根据数据集id获取数据集对象*/
        let _this=this;
        _this.dataSetDims=[];
        _this.dataSetMeasures=[];
        _this.$Get(_this.khConfig.api.getDataSetConfById+"/"+dsId).then(res=>{
            if (res.errCode === 0) {
                _this.dataSetName=res.dataSetConf.dsName;
                let columns=JSON.parse(res.dataSetConf.dsMeta).columns;//数据集中的维度和度量的数组对象
                let dataSetDim=columns.dim;   //维度数组
                let dataSetMeasure=columns.measure;//度量数组
                //遍历度量数组
                for (let i=0;i<dataSetMeasure.length;i++){
                    let dsTableName=dataSetMeasure[i].table; //数据集中的表名
                    let tableMeasures=dataSetMeasure[i].columns;//获取当前表的度量数组
                    for (let j=0;j<tableMeasures.length;j++){
                        let tabMeasure=tableMeasures[j];
                        let measureLabel="";
                        if (_this.KHUtils.isNull(tabMeasure.column)){
                            measureLabel=tabMeasure.alias;
                        } else {
                           measureLabel=tabMeasure.column;
                            if (!_this.KHUtils.isNull(tabMeasure.alias)){
                                measureLabel=tabMeasure.alias+"("+measureLabel+")";//度量名称(类型)
                            }
                        }

                        let tabAndMeasure={
                            dataType:tabMeasure.dataType,
                            type:tabMeasure.dataType,
                            columnName:tabMeasure.column,
                            columnLabel:measureLabel,
                            tableName:dsTableName,
                            dsId:dsId,
                            alias:tabMeasure.alias,
                            express:tabMeasure.express,
                            columnType:'measure'
                        }
                        _this.dataSetMeasures.push(tabAndMeasure);
                    }
                }
                //遍历维度数组
                for (let i=0;i<dataSetDim.length;i++){
                    let dsTableName=dataSetDim[i].table;
                    let tableDims=dataSetDim[i].columns;
                    for (let j=0;j<tableDims.length;j++){
                        let tabDim=tableDims[j];
                       /*判断这个维度数据是否为Timestamp类型*/
                        if (tabDim.dataType=="Timestamp"||tabDim.dataType=="Date"){
                            let dimColumnLabel="";
                            if (_this.KHUtils.isNull(tabDim.column)){
                                dimColumnLabel=tabDim.alias;
                            } else {
                               dimColumnLabel=tabDim.column;
                               if (!_this.KHUtils.isNull(tabDim.alias)){
                                  dimColumnLabel=tabDim.alias+"("+dimColumnLabel+")";//度量名称(类型)
                                }
                            }
                        for (let k=0;k<9;k++){
                            let tabColumnName=tabDim.column;
                            let tabAndDim={
                                dataType:"Date",
                                type: _this.numToDataFormat(k),
                                dateDim: _this.numToDataFormat(k),
                                columnName:tabColumnName,
                                columnLabel:dimColumnLabel+"("+_this.numToDataFormat(k)+")",
                                tableName:dsTableName,
                                dsId:dsId,
                                express:tabDim.express,
                                columnType:'dim',
                                alias:tabDim.alias
                            }
                            _this.dataSetDims.push(tabAndDim);
                        }
                    } else{  /*普通的数据类型*/
                        let dimColumnLabel="";
                        if (_this.KHUtils.isNull(tabDim.column)){
                            dimColumnLabel=tabDim.alias;
                        } else {
                            dimColumnLabel=tabDim.column;
                            if (!_this.KHUtils.isNull(tabDim.alias)){
                                dimColumnLabel=tabDim.alias+"("+dimColumnLabel+")";//度量名称(类型)
                            }
                        }
                        let tabAndDim={
                            dataType:tabDim.dataType,
                            type:tabDim.dataType,
                            columnName:tabDim.column,
                            columnLabel:dimColumnLabel,
                            tableName:dsTableName,
                            dsId:dsId,
                            express:tabDim.express,
                            columnType:'dim',
                            alias:tabDim.alias
                        }
                        _this.dataSetDims.push(tabAndDim);
                    }

                   }
                }
                if (!_this.KHUtils.isNull(index)){
                    _this.setDimAndMea(index);
                    _this.setBaseConfParam(_this.dimOrMeasure.type,_this.dimOrMeasure.columnType,_this.dimOrMeasure.express)
                }
                if (_this.clickColumnBool){
                    _this.baseConfRendering();
                }
                _this.clickColumnBool=true;
            }
            _this.deleteMenuBool=true;
        });

    },
    /*时间类型分解具体的时间格式*/
    numToDataFormat(num){
      switch (num) {
        case 0:return "year";
        case 1:return "quarter";
        case 2:return "week";
        case 3:return "month";
        case 4:return "day";
        case 5:return "hour";
        case 6:return "minute";
        case 7:return "second";
        case 8:return "ymdhms";
      }
    },
    /*修改了字段后将,查询条件的表和字段重新设置*/
    changeChartColumn(chartColumn){
        let _this=this;
        if (_this.newAddBool){
            _this.conditions[_this.queryMenuIndex]={}; //将当前查询条件置为空
            _this.conditions[_this.queryMenuIndex].name= _this.queryName;
            _this.conditions[_this.queryMenuIndex].widget=_this.widgetParam.widget;
            _this.conditions[_this.queryMenuIndex].display=_this.widgetParam.display;
        }
        let index=chartColumn.split(",")[0];//下标
        let type=chartColumn.split(",")[1]; //类型--维度0,度量1
        if (type==0){ //维度
            _this.dimOrMeasure=_this.dataSetDims[index]
        } else {  //度量
          _this.dimOrMeasure=_this.dataSetMeasures[index];
        }
        if (!_this.KHUtils.isNull(_this.queryMenuIndex)){
            if (_this.KHUtils.isNull(_this.conditions[_this.queryMenuIndex].column)){
                _this.conditions[_this.queryMenuIndex].alias=_this.dimOrMeasure.alias;
                _this.conditions[_this.queryMenuIndex].express=_this.dimOrMeasure.express;
            }
            _this.conditions[_this.queryMenuIndex].column=_this.dimOrMeasure.columnName;
            _this.conditions[_this.queryMenuIndex].table=_this.dimOrMeasure.tableName;
            _this.conditions[_this.queryMenuIndex].dataType=_this.dimOrMeasure.dataType;
            _this.conditions[_this.queryMenuIndex].style={};
            _this.conditions[_this.queryMenuIndex].style.widthScale=1;
             if (_this.dimOrMeasure.dataType=="Date"){
               _this.conditions[_this.queryMenuIndex].dateDim=_this.dimOrMeasure.dateDim;
             }else if (_this.dimOrMeasure.dataType=="String"){
               _this.conditions[_this.queryMenuIndex].select={};
               if (_this.KHUtils.isNull(_this.conditions[_this.queryMenuIndex].column)){
                 _this.conditions[_this.queryMenuIndex].alias=_this.dimOrMeasure.alias;
                 _this.conditions[_this.queryMenuIndex].express=_this.dimOrMeasure.express;
                 if (_this.isExistFun(_this.dimOrMeasure.express)){
                   let arr=_this.dealCase(_this.dimOrMeasure.express);
                   let temp=[];
                   for (let n=0;n<arr.length;n++){
                     let obj={
                       key:arr[n],
                       value:arr[n]
                     }
                     temp.push(obj);
                   }
                   _this.conditions[_this.queryMenuIndex].select.manualValue=temp;
                 }
               }
               _this.valueSource="0";
               _this.initStringConfig();
             }
        }
        _this.baseConfBool=true;
        _this.defaultEndTime="";
        _this.defaultStartTime="";
        _this.setBaseConfParam(_this.dimOrMeasure.type,_this.dimOrMeasure.columnType,_this.dimOrMeasure.express);
      },
    /*保存查询条件*/
    saveConditions(){
        let _this=this;

        if (_this.conditions.length>0){
            _this.saveQueryCond();
        }
        _this.checkCondMenu();
        if (_this.condErrorIndex.length>0){
            return;
        }

        _this.widgets[_this.queryConditionIndex].conditions=_this.conditions;
       _this.$emit("closeCondition");
       _this.conditions=[];
    },
    cancelSave(){
      this.$emit("closeCondition");
    },
    /*渲染字段的维度或度量*/
    setDimAndMea(index){
        let _this=this;

        for(let k=0;k<_this.dataSetDims.length;k++){   //维度
            if (_this.conditions[index].dataType=="Date") {
               if (_this.KHUtils.isNull(_this.conditions[index].column)) {
                   if ((_this.dataSetDims[k].alias==_this.conditions[index].alias)&&
                       (_this.dataSetDims[k].dateDim==_this.conditions[index].dateDim)&&(_this.dataSetDims[k].tableName==_this.conditions[index].table)){
                        _this.chartColumn=_this.toTran(k,0);
                       _this.dimOrMeasure=_this.dataSetDims[k];
                   }
               }else {
                   if ((_this.dataSetDims[k].columnName==_this.conditions[index].column)&&
                       (_this.dataSetDims[k].dateDim==_this.conditions[index].dateDim)&&(_this.dataSetDims[k].tableName==_this.conditions[index].table)){
                       _this.chartColumn=_this.toTran(k,0);
                       _this.dimOrMeasure=_this.dataSetDims[k];
                   }
               }
            }else {
               if (_this.KHUtils.isNull(_this.conditions[index].column)){
                   if (_this.dataSetDims[k].alias==_this.conditions[index].alias&&(_this.dataSetDims[k].tableName==_this.conditions[index].table)){
                       _this.chartColumn=_this.toTran(k,0);
                       _this.dimOrMeasure=_this.dataSetDims[k];
                   }
               }else {
                   if (_this.dataSetDims[k].columnName==_this.conditions[index].column&&(_this.dataSetDims[k].tableName==_this.conditions[index].table)){
                       _this.chartColumn=_this.toTran(k,0);
                       _this.dimOrMeasure=_this.dataSetDims[k];
                   }
               }

            }
        }
        for (let i=0;i<_this.dataSetMeasures.length;i++){ //度量
            if (_this.KHUtils.isNull(_this.conditions[index].column)){
                if (_this.dataSetMeasures[i].alias==_this.conditions[index].alias&&_this.dataSetMeasures[i].tableName==_this.conditions[index].table){
                    _this.chartColumn=_this.toTran(i,1);
                   _this.dimOrMeasure=_this.dataSetMeasures[i];
                   _this.dimOrMeasure.dataType="Number";
                }
            }else {
                if (_this.dataSetMeasures[i].columnName==_this.conditions[index].column&&_this.dataSetMeasures[i].tableName==_this.conditions[index].table){
                    _this.chartColumn=_this.toTran(i,1);
                    _this.dimOrMeasure=_this.dataSetMeasures[i];
                }
            }

        }
        if (_this.KHUtils.isNull(_this.chartColumn)){
            _this.baseConfBool=false;
        }else {
            _this.baseConfBool=true;
        }
    },
    /*对选中的维度或度量存储其类型或者是下标*/
    toTran(index,type){
      let param=index+","+type;
      return param;
    },
    /*设置基础配置参数*/
    setBaseConfParam(type,columnType,express){
        let _this=this;
        switch (type) {
            case "String":
                if (columnType=='measure'){
                  _this.initNumType();
                  _this.initDataFormat();
                  _this.dataTypeOptions[3].disable=false;
                  _this.dataType=_this.dataTypeOptions[3].value;
                  _this.initNumConfig();
                  _this.numTypeOptions[1].disable=true;
                  _this.numTypeOptions[2].disable=true;
                  _this.numTypeOptions[5].disable=true;
                  _this.numTypeOptions[6].disable=true;
                  let bool=_this.isExistFun(express);
                  if (bool){
                      _this.numTypeOptions[0].disable=true;
                      _this.showType="count";
                  }else if (!_this.KHUtils.isNull(express)){
                    _this.dataTypeOptions[3].disable=false;
                    _this.dataType=_this.dataTypeOptions[3].value;
                  }
                } else {
                    _this.initDataFormat();
                    _this.dataTypeOptions[1].disable=false;
                    _this.dataTypeOptions[0].disable=false;
                    _this.dataTypeOptions[2].disable=false;
                    _this.dataType=_this.dataTypeOptions[0].value;
                    _this.initStringConfig();
                }
                return;
            case "Number":
                _this.initNumType();
                _this.initDataFormat();
                _this.dataTypeOptions[3].disable=false;
                _this.dataType=_this.dataTypeOptions[3].value;
                _this.initNumConfig();
                if (!_this.KHUtils.isNull(express)||columnType=='dim'){      //是case 的类型
                   if (_this.isExistFun(express)){
                       _this.numTypeOptions[1].disable=true;
                       _this.numTypeOptions[2].disable=true;
                       _this.numTypeOptions[5].disable=true;
                       _this.numTypeOptions[6].disable=true;
                   }else {
                       _this.numTypeOptions[1].disable=true;
                       _this.numTypeOptions[2].disable=true;
                       _this.numTypeOptions[3].disable=true;
                       _this.numTypeOptions[4].disable=true;
                       _this.numTypeOptions[5].disable=true;
                       _this.numTypeOptions[6].disable=true;
                   }
                }
                return;
            case "year":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dataDimOptions[0].disable=false;
                _this.dateDim=_this.dataDimOptions[0].value;
                _this.initDateConfig();
                return;
            case "quarter":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[1].disable=true;
                _this.dataTypeOptions[0].disable=true;
                _this.dataTypeOptions[2].disable=true;
                _this.dataTypeOptions[3].disable=true;
                _this.dataTypeOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dataDimOptions[1].disable=false;
                _this.dateDim=_this.dataDimOptions[1].value;
                _this.initDateConfig();
                return;
            case "month":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dataDimOptions[2].disable=false;
                _this.dateDim=_this.dataDimOptions[2].value;
                _this.initDateConfig();
                return
            case "week":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dataDimOptions[3].disable=false;
                _this.dateDim=_this.dataDimOptions[3].value;
                _this.initDateConfig();
                return;
            case "day":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[4].disable=false;
                _this.dataDimOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dateDim=_this.dataDimOptions[4].value;
                _this.initDateConfig();
                return
            case "hour":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dataDimOptions[5].disable=false;
                _this.dateDim=_this.dataDimOptions[5].value;
                _this.initDateConfig();
                return
            case "minute":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dataDimOptions[6].disable=false;
                _this.dateDim=_this.dataDimOptions[6].value;
                _this.initDateConfig();
                return
            case "second":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dataDimOptions[7].disable=false;
                _this.dateDim=_this.dataDimOptions[7].value;
                _this.initDateConfig();
                return
            case "ymdhms":
                _this.initDataFormat();
                _this.initDateFormat();
                _this.dataTypeOptions[4].disable=false;
                _this.dataType=_this.dataTypeOptions[4].value;
                _this.dataDimOptions[8].disable=false;
                _this.dateDim=_this.dataDimOptions[8].value;
                _this.dateFormatBool=true;
                _this.initDateConfig();
                return
        }
    },
    /*初始化date格式*/
    initDateFormat(){
        let _this=this;
        for (let i=0;i<_this.dataDimOptions.length;i++){
           _this.dataDimOptions[i].disable=true;
        }
    },
    /*初始化数据格式*/
    initDataFormat(){
        let _this=this;
        for (let i=0;i<_this.dataTypeOptions.length;i++){
            _this.dataTypeOptions[i].disable=true;
        }
    },
    /*初始化数据类型格式*/
    initNumType(){
      let _this=this;
      for (let i=0;i<_this.numTypeOptions.length;i++){
          _this.numTypeOptions[i].disable=false;
      }
    },
    /*将日期类型转化为对应的字符串*/
    dateTypeToStr(type){
      switch (type) { //year年，month月，quarter季度，day日，hour小时，minute分，second秒，ymdhms年月日时分秒
        case "year":
          return "年";
        case "quarter":
          return "季度";
        case "month" :
          return "月";
        case  "day":
          return "日";
        case "hour":
          return "小时";
        case  "minute":
          return "分钟";
        case  "second":
          return "秒";
        case "ymdhms":
          return "时间";
      }
    },
    /*在日期查询时转化日期类型*/
    /*修改数值型的条件格式*/
    changeNumState(){
      let _this=this;
      _this.matchType1="$eq";
      _this.matchType2="$eq";
      _this.numValue1="";
      _this.numValue2="";
    },
    /*基础配置渲染*/
    baseConfRendering(){
       let _this=this;
       let index=_this.queryMenuIndex;
       if (!(index<_this.conditions.length)){
          return
        }
       _this.required=_this.conditions[index].required;
       if (_this.dimOrMeasure.columnType=="measure"&&_this.isExistFun(_this.dimOrMeasure.express)){
           _this.dimOrMeasure.dataType="Number";
       }
       if (_this.dimOrMeasure.dataType=="Number"){
           _this.showType=_this.conditions[index].aggregate;
           _this.condType=_this.conditions[index].condType;
           if (_this.KHUtils.isNull(_this.conditions[index].defaultValue)){
               return;
           }
           if ((!_this.KHUtils.isNull(_this.conditions[index].defaultValue[0].value))) {
               _this.numDefaultBool=true;
               _this.matchType1=_this.conditions[index].defaultValue[0].matchType;
               _this.numValue1=_this.conditions[index].defaultValue[0].value;
               if (_this.conditions[index].defaultValue.length>1){
                   _this.matchType2=_this.conditions[index].defaultValue[1].matchType;
                   _this.numValue2=_this.conditions[index].defaultValue[1].value;
               }
           }
       }else if (_this.dimOrMeasure.dataType=="Date"){
              _this.filterType=_this.conditions[index].filterType;
             if (_this.KHUtils.isNull(_this.conditions[index].defaultValue)){
                   return;
             }
             if (!_this.KHUtils.isNull(_this.conditions[index].defaultValue[0])||
                  !_this.KHUtils.isNull(_this.conditions[index].defaultValue[1])) {

                 if (!_this.KHUtils.isNull(_this.conditions[index].defaultValue[0].value)){
                     _this.dateDefaultBool=true;
                 }
                 if (_this.conditions[index].defaultValue.length>1){//表示是结束于或开区间
                      _this.intervalType="3";
                      for (let i=0;i<_this.conditions[index].defaultValue.length;i++){
                          if (_this.conditions[index].defaultValue[i].matchType=="$gte"){
                              _this.defaultStartTime=_this.conditions[index].defaultValue[i].value;
                          }else {
                              _this.defaultEndTime=_this.conditions[index].defaultValue[i].value;
                          }
                      }
                 }else {
                     if (_this.conditions[index].defaultValue[0].matchType=="$lte"){ //结束于 $lte
                          _this.intervalType="2";
                         _this.defaultEndTime=_this.conditions[index].defaultValue[0].value;
                     }else {
                         _this.intervalType="1"; //开始于
                         _this.defaultStartTime=_this.conditions[index].defaultValue[0].value;
                     }
                 }
             }
       }else if (_this.dimOrMeasure.dataType=="String") {        //String类型渲染

           _this.dataType=_this.conditions[index].showType;
           if(_this.dataType==0){ //下拉列表
                _this.valueSource=_this.conditions[index].select.valueSource;
                _this.pickType=_this.conditions[index].select.pickType;
                if (_this.valueSource==2){ //人工输入的值
                    let manualKayVal=_this.conditions[index].select.manualValue;
                    _this.manualKayValSize=manualKayVal.length;
                    for (let i=0;i<manualKayVal.length;i++){
                        _this.manualVal=_this.manualVal+manualKayVal[i].value+"\n";
                        _this.manualKey=_this.manualKey+manualKayVal[i].key+"\n";
                    }
                    _this.manualValue=manualKayVal;
                    if (!_this.KHUtils.isNull(_this.conditions[index].select.defaultValue[0])) {
                        _this.setStringDefaultBool=true;
                        if (_this.pickType==0){
                            _this.manualSingleVal=_this.conditions[index].select.defaultValue[0];
                        }else {
                            _this.manualDoubleVal=_this.conditions[index].select.defaultValue;
                        }
                    }
                }else if (_this.valueSource==1){ //单个数据集
                    _this.loadPageNum=1;
                    _this.dataSetOptions=[];
                    _this.selectDS();
                }else if (_this.valueSource==0){//自动解析
                    if (_this.KHUtils.isNull(_this.conditions[index].select.defaultValue[0])){
                        _this.setStringDefaultBool=false;
                    }else {
                        _this.setStringDefaultBool=true;
                    }
                    if (_this.pickType==0){ //单选渲染
                        if (_this.KHUtils.isNull(_this.conditions[index].select.defaultValue[0])){
                            return
                        }
                        _this.manualSingleVal=_this.conditions[index].select.defaultValue[0];
                        let obj={
                            value:_this.manualSingleVal,
                            key:0
                        }
                        _this.addColumns.push(obj)
                    } else {
                        _this.manualDoubleVal=_this.conditions[index].select.defaultValue;
                        for(let i=0;i<_this.manualDoubleVal.length;i++){
                            let obj={
                               value:_this.manualDoubleVal[i],
                               key:0
                            }
                            _this.addColumns.push(obj)
                        }
                    }
                }
           }else if (_this.dataType==1){//文本输入框
               _this.condType=_this.conditions[index].text.condType;
               if (!_this.KHUtils.isNull(_this.conditions[index].text.defaultValue[0].matchType)){
                   _this.textDefaultBool=true;
                   _this.strMatchType1=_this.conditions[index].text.defaultValue[0].matchType;
                   _this.strValue1=_this.conditions[index].text.defaultValue[0].value;
                   if (_this.conditions[index].text.defaultValue.length>1){
                       _this.strMatchType2=_this.conditions[index].text.defaultValue[1].matchType;
                       _this.strValue2=_this.conditions[index].text.defaultValue[1].value;
                   }
               }
           }else {//树形下拉框

           }

       }
    },
    /*保存数字类型的数据*/
    saveNumQueryCond(){
      let _this=this;
      let defaultValue=[];
      let param1={};
      let param2={};
      _this.conditions[_this.queryMenuIndex].aggregate=_this.showType;
      _this.conditions[_this.queryMenuIndex].condType=_this.condType;
      if (_this.numDefaultBool){
        if (_this.condType==0){
          param1.matchType=_this.matchType1;
          param1.value=_this.numValue1;
          defaultValue.push(param1)
        }else if(_this.condType==1||_this.condType==2){
          param1.matchType=_this.matchType1;
          param1.value=_this.numValue1;
          param2.matchType=_this.matchType2;
          param2.value=_this.numValue2;
          defaultValue.push(param1);
          defaultValue.push(param2);
        }
      } else {
        if (_this.condType==0){
          param1.matchType="$eq";
          param1.value="";
          defaultValue.push(param1)
        }else if(_this.condType==1||_this.condType==2){
          param1.matchType="$eq";
          param1.value="";
          param2.matchType="$eq";
          param2.value="";
          defaultValue.push(param1);
          defaultValue.push(param2);
        }
      }
      _this.conditions[_this.queryMenuIndex].defaultValue=defaultValue;
    },
    /*保存查询条件*/
    saveQueryCond(){
      let _this=this;
      if (!_this.KHUtils.isNull(_this.queryMenuIndex)&&!_this.KHUtils.isNull(_this.dimOrMeasure)){
          if (_this.KHUtils.isNull(_this.required)){
              _this.required=false;
          }
          _this.conditions[_this.queryMenuIndex].required=_this.required;
          if (_this.dimOrMeasure.dataType=="Number"){
              _this.saveNumQueryCond();
          }else if (_this.dimOrMeasure.dataType=="Date"){
              let defaultValue=[];
              let param1={};
              let param2={};
              _this.conditions[_this.queryMenuIndex].filterType=_this.filterType;
              _this.conditions[_this.queryMenuIndex].dateDim=_this.dimOrMeasure.dateDim;
              if (_this.filterType=="0"){
                  param1.matchType="$eq";
                  param1.value="";
                  defaultValue.push(param1);
                  _this.conditions[_this.queryMenuIndex].defaultValue=defaultValue;
              }else if (_this.filterType=="1"&&_this.intervalType=="1"){
                   param1.matchType="$gte";
                   param1.value=_this.defaultStartTime;
                   defaultValue.push(param1);
              }else if (_this.filterType=="1"&&_this.intervalType=="2"){
                   param2.matchType="$lte";
                   param2.value=_this.defaultEndTime;
                   defaultValue.push(param2)
              }else if (_this.filterType=="1"&&_this.intervalType=="3"){
                  param1.matchType="$gte";
                  param1.value=_this.defaultStartTime;
                  param2.matchType="$lte";
                  param2.value=_this.defaultEndTime;
                  defaultValue.push(param1);
                  defaultValue.push(param2)

              }
              _this.conditions[_this.queryMenuIndex].defaultValue=defaultValue;
          }else if (_this.dimOrMeasure.dataType=="String"){
              if (_this.dimOrMeasure.columnType=="measure"&&!_this.KHUtils.isNull(_this.dimOrMeasure.express)){
                  _this.conditions[_this.queryMenuIndex].dataType="Number";
                  _this.saveNumQueryCond();
                   return
              }
              _this.conditions[_this.queryMenuIndex].showType=_this.dataType;
              if (_this.dataType==0){ //下拉列表
                  _this.saveQueryDropList()
              } else if (_this.dataType==1){//文本输入框
                  _this.saveQueryText();
              } else if (_this.dataType==2){} //树形下拉
          }
      }
    },
    /*保存字符串下拉列表查询条件*/
    saveQueryDropList(){
         let _this=this;

         if (_this.KHUtils.isNull(_this.conditions[_this.queryMenuIndex].select)) {
           _this.conditions[_this.queryMenuIndex].select={}
         }
         _this.conditions[_this.queryMenuIndex].select.valueSource=_this.valueSource;
         _this.conditions[_this.queryMenuIndex].select.pickType=_this.pickType;
         if (!_this.setStringDefaultBool){
             _this.conditions[_this.queryMenuIndex].select.defaultValue=[];
         }
         if (_this.valueSource==0){  //自动解析
             let param={
                 dataset:_this.dimOrMeasure.dsId,
                 table:_this.dimOrMeasure.tableName,
                 column:_this.dimOrMeasure.columnName
             }
             _this.conditions[_this.queryMenuIndex].select.source=param;
             if (_this.setStringDefaultBool){//设置默认值
                  if (_this.pickType=="0"){ //单选默认值
                      let obj=[];
                      obj.push(_this.manualSingleVal);
                     _this.conditions[_this.queryMenuIndex].select.defaultValue=obj;
                  } else {
                      if (_this.KHUtils.isNull(_this.manualDoubleVal)){
                         _this.conditions[_this.queryMenuIndex].select.defaultValue=[""];
                      }else {
                          _this.conditions[_this.queryMenuIndex].select.defaultValue=_this.manualDoubleVal;
                      }
                  }
             }
         }else if (_this.valueSource==1){//单个数据集
             if (_this.KHUtils.isNull(_this.selectColumn)){
                 return;
             }
             let index=_this.selectColumn.split(",")[0];
             let type=_this.selectColumn.split(",")[1];

             if (type==0){
                 _this.selectSource=_this.selectDataSetDims[index];
             } else {
                _this.selectSource=_this.selectDataSetMeasures[index];
             }
             let source={
                 dataset:_this.selectSource.dsId,
                 table:_this.selectSource.tableName,
                 column:_this.selectSource.columnName
             }
             if (_this.selectSource.dataType=="Date"){
                 source.dateDim=_this.selectSource.dateDim;
             }
             _this.conditions[_this.queryMenuIndex].select.source=source;
             if (_this.pickType==0){//单选
               let obj=[];
               obj.push(_this.dataSetSingleVal);
               _this.conditions[_this.queryMenuIndex].select.defaultValue=obj
             } else {//多选
                 if (_this.KHUtils.isNull(_this.dataSetDoubleVal)){
                    _this.conditions[_this.queryMenuIndex].select.defaultValue=[""];
                 }else {
                    let obj=_this.dataSetDoubleVal.split("\n");
                    obj.pop();
                    _this.conditions[_this.queryMenuIndex].select.defaultValue=obj;
                 }
             }

         }else if (_this.valueSource==2){ //人工输入
             _this.conditions[_this.queryMenuIndex].select.manualValue=_this.manualValue;
             if (_this.pickType==0){
                 let obj=[];
                 obj.push(_this.manualSingleVal)
                 _this.conditions[_this.queryMenuIndex].select.defaultValue=obj
             } else {
                 if (_this.KHUtils.isNull(_this.manualDoubleVal)){
                   _this.conditions[_this.queryMenuIndex].select.defaultValue=[""];
                 }else {
                   _this.conditions[_this.queryMenuIndex].select.defaultValue=_this.manualDoubleVal;
                 }

             }

         }
    },
    /*初始化number类型的配置*/
    initNumConfig(){
      let _this=this;
      _this.showType="none";
      _this.condType=0;
      _this.numDefaultBool=false;
      _this.numValue1="";
      _this.numValue2="";
      _this.matchType1="$eq";
      _this.matchType2="$eq";
    },
    /*初始化Date类型的配置*/
    initDateConfig(){
       let _this=this;
       _this.filterType=0;
       _this.dateDefaultBool=false;
       _this.intervalType="1";
    },
    /*初始化String类型的配置*/
    initStringConfig(){
        let _this=this;
        _this.condType="0";
        _this.pickType="0";
        _this.setStringDefaultBool=false;
        _this.condType=0;
        _this.dataSet="";
        _this.selectColumn="";
        _this.manualSingleVal="";
        _this.manualDoubleVal=[];
        _this.addColumns=[];
        _this.counts=[];
        _this.pageNum=0;
        _this.busy=false;
        _this.manualKey="";
        _this.manualVal="";
        _this.manualKeyRows=0;
        _this.manualValRows=0;
        _this.manualKayValSize=0;
    },
    /*初始化中间区域的配置*/
    initColumnConfig(){
      let _this=this;
      //_this.checkedColumnIndex=[];
      _this.dataSetName="";
      _this.chartColumn="";
    },
    /*加载*/
    load(){
      let _this=this;
      _this.pageNum=_this.pageNum+1;
      if (_this.valueSource==0){
        _this.getAutoSelectData();
      } else if (_this.valueSource==1){
        _this.changeDataSetColumn();
      }
    },
    //清除全部的字段
    clearAllColumn(){  //清除全部的字段
      let _this=this;
      _this.addColumns=[];
      for (let i=0;i<_this.counts.length;i++){
        _this.counts[i].check=false;
      }
    },
    /*手工输入界面取消*/
    cancelManualInput(){
      let _this=this;
      _this.manualInputBool=false;
      _this.stringDefaultBool=false;
    },
    dealCase(express){
      let _this=this;
      let reg=/[tT][hH][eE][nN][ ]+'([\u4E00-\u9FA5\w\s-]*?)'[ ]+|[tT][hH][eE][nN][ ]+([\u4E00-\u9FA5\w\s-]*?)[ ]+|[eE][lL][sS][eE][ ]+([\u4E00-\u9FA5\w\s-]*?)[ ]+|[eE][lL][sS][eE][ ]+'([\u4E00-\u9FA5\w\s-]*?)'[ ]+/g;
      let arr=[];
      let temp;
      while ((temp=reg.exec(express))!=null) {
        for (let n=1;n<temp.length;n++) {
          if (!_this.KHUtils.isNull(temp[n])){
            arr.push(temp[n])
          }
        }
      }
      return arr;
    },
    /*caseWhen 数据解析*/
    resolvingCase(express){
      let _this=this;
      let arr=_this.dealCase(express);
      for (let n=0;n<arr.length;n++){
        let obj={
          value:arr[n],
          check:false
        }
        _this.counts.push(obj);
      }
      _this.busy=true;
    },
     /*自动解析---设置筛选值*/
    getAutoSelectData(){
       let _this=this;
       if (_this.KHUtils.isNull(_this.dimOrMeasure.columnName)&&_this.isExistFun(_this.dimOrMeasure.express)){
           _this.resolvingCase(_this.dimOrMeasure.express);
           return
       }
      _this.loading=true;
       let param={
           dataSetId:_this.getDataSetId(_this.checkedColumnIndex[0]),
           tb:_this.dimOrMeasure.tableName,
           col:_this.dimOrMeasure.columnName,
           pageNum:_this.pageNum,
           pageSize:10
       }
       _this.$Get(_this.khConfig.api.queryColumnData,param).then(res=>{
           if (res.errCode==0){
               if (res.datas.length>0){
                   for (let i=0;i<res.datas.length;i++){
                       let obj={
                           value:res.datas[i],
                           check:false
                       }
                       _this.counts.push(obj);
                   }
                   if (res.datas.length<res.pageSize){
                       _this.busy=true;
                   }
               }else {
                   _this.pageNum=_this.pageNum-1;
                   _this.busy=true;
               }
           }

           if (_this.busy&&!_this.KHUtils.isNull(_this.addColumns)){
               for (let i=0;i<_this.addColumns.length;i++){
                   for (let j=0;j<_this.counts.length;j++){
                       if (_this.addColumns[i].value==_this.counts[j].value){
                           if (_this.pickType=="0") {  //单选的情况
                               _this.signCheckIndex=j;
                           }
                           _this.addColumns[i].key=j;
                           _this.counts[j].check=true;
                       }
                   }
               }
           }
       });
      _this.loading=false;
    },
    /*光标在上面*/
    overShow(index){
      let _this=this;
      _this.overShowIndex=index
    },
    /*字段区域内,实现勾的图标显示*/
    selectedOver(index){
        let  _this=this;
        if (_this.pickType==0&&_this.addColumns.length>0){  //单选判断
            if (_this.counts[index].check){
                _this.counts[index].check=false;
                _this.addColumns=[];
            }else {
                _this.addColumns=[];
                _this.counts[_this.signCheckIndex].check=false;
                _this.counts[index].check=true;
                let column={
                    value:_this.counts[index].value,
                    key:index
                }
                _this.addColumns.push(column);
                _this.signCheckIndex=index;
            }
            return
        }
        if (_this.counts[index].check){        //单选或多选
            _this.counts[index].check=false;
            for (let i=0;i<_this.addColumns.length;i++){
                if (_this.addColumns[i].value==_this.counts[index].value){
                     _this.addColumns.splice(i,1);
                }
            }
        } else {
            if (_this.pickType==0){
                _this.signCheckIndex=index;
            }
            _this.counts[index].check=true;
            let column={
                value:_this.counts[index].value,
                key:index
            }
            _this.addColumns.push(column);
        }
    },
    /*右侧光标停留效果*/
    rightShow(index){
      let _this=this;
      _this.rightShowIndex=index;
    },
    /*清除右侧中的字段*/
    clearColumn(index){
      let _this=this;
      if (!_this.KHUtils.isNull(index)) { //清除被选中的字段
        let column=_this.addColumns[index];
        if (!_this.KHUtils.isNull(column.key)){
           _this.counts[column.key].check=false;
        }
        _this.addColumns.splice(index,1);
      }

    },
    /*修改number文本类型的*/
    changeNumCond(){
      let _this=this;
      _this.strMatchType1="$eq";
      _this.strValue1="";
      _this.strMatchType2="$eq";
      _this.strValue2="";
    },
    /*保存文本类型查询条件*/
    saveQueryText(){
        let _this=this;
        let defaultValue=[];
        let param1={};
        let param2={};
        _this.conditions[_this.queryMenuIndex].text={}
        _this.conditions[_this.queryMenuIndex].text.condType=_this.condType;
        if (!_this.textDefaultBool){
           _this.strMatchType1="";
           _this.strMatchType2="";
        }
        if (_this.condType==0){
           param1.matchType=_this.strMatchType1;
           param1.value=_this.strValue1;
           defaultValue.push(param1)
        }else {
          param1.matchType=_this.strMatchType1;
          param1.value=_this.strValue1;
          param2.matchType=_this.strMatchType2;
          param2.value=_this.strValue2;
          defaultValue.push(param1);
          defaultValue.push(param2);
        }
        _this.conditions[_this.queryMenuIndex].text.defaultValue=defaultValue;
    },
    /*点击手工输入按钮*/
    clickManualInput(){
      let _this=this;
      _this.manualInputBool=true;
     // _this.manualValRows=_this.manualKeyRows;
      _this.manualKeyRows=_this.manualKayValSize;
      _this.manualValRows=_this.manualKeyRows;
    },
    /*清空人工输入的显示名称*/
    clearInputVal(){
      let _this=this;
      _this.manualVal="";
      _this.manualValRows=0;
    },
    /*清空人工输入的查询值*/
    clearInputKey(){
      let _this=this;
      _this.manualKey=""
      _this.manualKeyRows=0
    },
    /*点击保存校验配置是否正确*/
    checkManualConfig(){
        let _this=this;
        _this.manualValue=[];
        let manualValues;
        let keys=""
        let manualKeys;
        /*判断查询值是否为空*/
        if (_this.KHUtils.isNull(_this.manualKey)){
            _this.manualKayValSize=0;
            _this.manualKeyRows=0;
        }else {
            manualKeys =_this.manualKey.split("\n");//键的数组---查询值
            for (let i=0;i<manualKeys.length;i++){
                for (let j=1;j<manualKeys.length;j++){
                    if ((manualKeys[i]==manualKeys[j]&&i!=j)||manualKeys[i]==""||typeof(manualKeys[i])=="undefined"){
                        manualKeys.splice(i,1);
                        i=i-1;
                    }
                }
            }
            _this.manualKeyRows=manualKeys.length;
            _this.manualKayValSize=_this.manualKeyRows;
            for (let i=0;i<manualKeys.length;i++){
                if (i==manualKeys.length-1){
                    keys=keys+manualKeys[i];
                } else {
                    keys=keys+manualKeys[i]+"\n";
                }
            }
            _this.manualKey=keys;
        }
        /*当显示名称为空时进行处理*/
        if (!_this.KHUtils.isNull(_this.manualVal)){  //判断值是否为空
            manualValues=_this.manualVal.split("\n");
            let values="";
            for (let i=0;i<manualValues.length;i++){
                if (manualValues[i]==""||typeof manualValues[i]=="undefined"){
                    manualValues.splice(i,1);
                   i=i-1;
                }
            }
            _this.manualValRows=manualValues.length;
            for (let i=0;i<manualValues.length;i++){
                values=values+manualValues[i]+"\n";
            }
            _this.manualVal=values;
            if (_this.manualValRows!=_this.manualKeyRows){
                _this.$message({
                    showClose: true,
                    message: '查询值和显示名称行数不一致,无法实现一一对应',
                    type: 'error'
                });
                return false;
            }else {
                _this.manualInputBool=false;
            }
        }else {
            if(_this.manualKeyRows==0){  //输入值为零和显示值也为零,直接退出
                _this.manualInputBool=false;
            }else {
                _this.manualVal=_this.manualKey;
                _this.manualInputBool=false;
                manualValues=manualKeys;
            }
        }
        if (_this.manualKeyRows>0){
            for (let i=0;i<manualKeys.length;i++){
                let obj={};
                obj.key=manualKeys[i];
                obj.value=manualValues[i];
                _this.manualValue.push(obj);
            }
        }
    },
    /*人工输入计算查询值得行数*/
    descInputKey(){
      let _this=this;
      _this.manualKeyRows=_this.manualKey.split("\n").length;
    },
    /*人工输入计算显示名称的行数*/
    descInputVal(){
      let _this=this;
      _this.manualValRows=_this.manualKey.split("\n").length;
    },
    /*在改变下拉类型时*/
    changePickType(){
      let _this=this;
      _this.manualSingleVal="";
      _this.manualDoubleVal=[];
      _this.addColumns=[];
      _this.dataSetSingleVal="";
      _this.dataSetDoubleVal="";
      _this.counts=[];
      _this.pageNum=0;
      _this.busy=false;
      _this.KeyWord="";
    },
    //加载更多
    loadMore(){
       let _this=this;
       _this.loadPageNum++;
       _this.selectDataSet();
    },
    /*查询数据集配置信息*/
    selectDataSet(){
        let _this=this;
        _this.selectDataSetMeasures=[];
        _this.selectDataSetDims=[];
        _this.selectColumn="";
        _this.displayColumn="";
        let param={
            pageNum:_this.loadPageNum,
            pageSize:20
        }
        _this.$Get(_this.khConfig.api.queryDataSetConf,param).then(res=>{
        if (res.errCode==0){
            for (let i=0;i<res.datasets.length;i++){
                let item=res.datasets[i];
                let dataSet={
                dsId:item.dsId,
                dsName:item.dsName,
                dsMeta:item.dsMeta
            }
            _this.dataSetOptions.push(dataSet);
          }
        }


      })
    },
    /*处理查询字段*/
    dealDataSetColumn(){
        let _this=this;
        let source=_this.conditions[_this.queryMenuIndex].select.source;
        if (!_this.KHUtils.isNull(_this.dataSet)){
            let columns=JSON.parse(_this.dataSetOptions[_this.dataSet].dsMeta).columns;//数据集中的维度和度量的数组对象
            let dataSetId=_this.dataSetOptions[_this.dataSet].dsId;
            let dataSetDim=columns.dim;   //维度数组
            let dataSetMeasure=columns.measure;//度量数组
            _this.selectDataSetDims=[];
           _this.selectDataSetMeasures=[];
              //遍历度量数组
            for (let i=0;i<dataSetMeasure.length;i++){
                let dsTableName=dataSetMeasure[i].table; //数据集中的表名
                let tableMeasures=dataSetMeasure[i].columns;//获取当前表的度量数组
                for (let j=0;j<tableMeasures.length;j++){
                    let tabMeasure=tableMeasures[j];
                    let measureLabel//度量名称(类型)
                    if (_this.KHUtils.isNull(tabMeasure.column)){
                        measureLabel=tabMeasure.alias;
                    } else {
                        measureLabel=tabMeasure.column;
                        if (!_this.KHUtils.isNull(tabMeasure.alias)){
                            measureLabel=tabMeasure.alias+"("+measureLabel+")";//度量名称(类型)
                        }
                    }
                    let tabAndMeasure={
                        dataType:tabMeasure.dataType,
                        columnName:tabMeasure.column,
                        columnLabel:measureLabel,
                        tableName:dsTableName,
                        dsId:dataSetId,
                        alias:tabMeasure.alias,
                        express:tabMeasure.express,
                    }
                     _this.selectDataSetMeasures.push(tabAndMeasure);
                }
            }
             //遍历维度数组
            for (let i=0;i<dataSetDim.length;i++){
                let dsTableName=dataSetDim[i].table;
                let tableDims=dataSetDim[i].columns;
                for (let j=0;j<tableDims.length;j++){
                    let tabDim=tableDims[j];
                    /*判断这个维度数据是否为Timestamp类型*/
                    if (tabDim.dataType=="Timestamp"||tabDim.dataType=="Date"){
                        for (let k=0;k<9;k++){
                            let tabColumnName=tabDim.column;
                            let tabAndDim={
                                dataType: "Date",
                                dateDim:_this.numToDataFormat(k),
                                columnName:tabColumnName,
                                columnLabel:tabDim.column+"("+_this.numToDataFormat(k)+")",
                                tableName:dsTableName,
                                dsId:dataSetId,
                                express:tabDim.express,
                                alias:tabDim.alias
                            }
                             _this.selectDataSetDims.push(tabAndDim);
                        }
                    } else{  /*普通的数据类型*/
                        let dimColumnLabel="";
                        if (_this.KHUtils.isNull(tabDim.column)){
                            dimColumnLabel=tabDim.alias;
                        } else {
                            dimColumnLabel=tabDim.column;
                            if (!_this.KHUtils.isNull(tabDim.alias)){
                                 dimColumnLabel=tabDim.alias+"("+dimColumnLabel+")";//度量名称(类型)
                            }
                        }
                        let tabAndDim={
                            dataType:tabDim.dataType,
                            columnName:tabDim.column,
                            columnLabel:dimColumnLabel,
                            tableName:dsTableName,
                            dsId:dataSetId,
                            express:tabDim.express,
                            alias:tabDim.alias
                        }
                        _this.selectDataSetDims.push(tabAndDim);
                    }

                }

            }

        }else {   //是默认的
          _this.selectDataSetDims=_this.dataSetDims;
          _this.selectDataSetMeasures=_this.dataSetMeasures;
        }

        /*遍历度量*/
        if (_this.newAddBool) {
            if (_this.KHUtils.isNull(source)){  //如果判断该查询条件为空时,则直接返回
                return;
            }
            for (let i = 0; i < _this.selectDataSetMeasures.length; i++) {
              if (_this.KHUtils.isNull(source.column)){
                    if (_this.selectDataSetMeasures[i].alias==source.alias&&_this.selectDataSetMeasures[i].tableName==source.table){
                        _this.chartColumn=_this.toTran(i,1);
                        _this.selectSource=_this.selectDataSetMeasures[i];
                    }
                }else {
                    if (_this.selectDataSetMeasures[i].columnName==source.column&&_this.selectDataSetMeasures[i].tableName==source.table){
                        _this.selectColumn=_this.toTran(i,1);
                        _this.selectSource=_this.selectDataSetMeasures[i];
                    }
                }
            }
        for (let j = 0; j < _this.selectDataSetDims.length; j++) {
            if (_this.KHUtils.isNull(source.column)) {
              if (!_this.KHUtils.isNull(source.dateDim)) {
                if (_this.selectDataSetDims[j].tableName == source.table && _this.selectDataSetMeasures[i].alias==source.alias
                  && _this.selectDataSetDims[j].dateDim == source.dateDim) {
                  _this.selectColumn = j + "," + 0;
                  _this.selectSource = _this.selectDataSetDims[j];
                  return;
                }
              } else {
                if (_this.selectDataSetDims[j].tableName == source.table && _this.selectDataSetDims[j].columnName == source.column) {
                  _this.selectColumn = j + "," + 0;
                  _this.selectSource = _this.selectDataSetDims[j];
                  return;
                }
              }
            }else {
              if (!_this.KHUtils.isNull(source.dateDim)) {
                if (_this.selectDataSetDims[j].tableName == source.table && _this.selectDataSetDims[j].columnName == source.column
                  && _this.selectDataSetDims[j].dateDim == source.dateDim) {
                  _this.selectColumn = j + "," + 0;
                  _this.selectSource = _this.selectDataSetDims[j];
                  return;
                }
              } else {
                if (_this.selectDataSetDims[j].tableName == source.table && _this.selectDataSetDims[j].columnName == source.column) {
                  _this.selectColumn = j + "," + 0;
                  _this.selectSource = _this.selectDataSetDims[j];
                  return;
                }
              }
            }
        }
      }
    },
    //默认设置类型
    changeStringDefault(){
        let _this=this;
        if (_this.valueSource==1) {
            if (_this.KHUtils.isNull(_this.selectColumn)) {
                _this.$message.error('请先关联字段')
            }
        }
        if (_this.setStringDefaultBool){
            _this.stringDefaultBool=true;
        } else {
           _this.stringDefaultBool=false;
        }
    },
    /*单个数据集时修改查询字段*/
    changeDataSetColumn(){
        let _this=this;
        if (_this.KHUtils.isNull(_this.selectColumn)){
            return
        }
        let index=_this.selectColumn.split(",")[0];;
        let type=_this.selectColumn.split(",")[1];
        let id="";
        let tableName="";
        let columnName="";
        let dataSetColumn={};
        if (type==0){
            dataSetColumn=_this.selectDataSetDims[index];
        } else {
            dataSetColumn=_this.selectDataSetMeasures[index];
        }
        if (_this.KHUtils.isNull(dataSetColumn.columnName)&&_this.isExistFun(dataSetColumn.express)){
            _this.resolvingCase(dataSetColumn.express);
            return
        }
        _this.loading=true;
       tableName=dataSetColumn.tableName;
       columnName=dataSetColumn.columnName;
       id=dataSetColumn.dsId;
       let param={
           dataSetId:id,
           tb:tableName,
           col:columnName,
           pageNum:_this.pageNum,
           pageSize:10
       }
       let flag=false;
       _this.$Get(_this.khConfig.api.queryColumnData,param).then(res=>{
          if (res.errCode==0){
              if (res.datas.length<1){
                  _this.pageNum=_this.pageNum-1;
                  _this.busy=true;
                  _this.loading=false;
                  return;
              }
              for (let i=0;i<res.datas.length;i++){
                  let obj={
                      value:res.datas[i],
                      check:false
                  }
              _this.counts.push(obj);
              }
              if (res.datas.length<res.pageSize){
                 _this.busy=true;
              }
          }else {
              _this.pageNum=_this.pageNum-1;
              _this.busy=true;
          }
          if (!_this.KHUtils.isNull(_this.addColumns)){
              for (let i=0;i<_this.addColumns.length;i++){
                  for (let j=0;j<_this.counts.length;j++){
                      if (_this.addColumns[i].value==_this.counts[j].value){
                          _this.addColumns[i].key=j;
                          _this.counts[j].check=true;
                      }
                  }
              }
          }


      })
      _this.loading=false;
    },
     /*保存选择的字段*/
    saveSelectColumn(){
        let _this=this;
        //为添加字段直接返回,不需要进行判断;设置为空,防止原先保存的数据残留
        if (_this.KHUtils.isNull(_this.addColumns[0])){
            _this.stringDefaultBool=false;
            _this.dataSetDoubleVal="";
            _this.dataSetSingleVal="";
            _this.manualSingleVal="";
            _this.manualDoubleVal=[];
            return;
        }
        if (_this.valueSource==1){
            _this.dataSetSingleVal=_this.addColumns[0].value;
            let str=""
            for (let i=0;i<_this.addColumns.length;i++){
               str=str+_this.addColumns[i].value+"\n";
            }
            _this.dataSetDoubleVal=str;
        } else {
           _this.manualValue=_this.addColumns;
        }
        /*自动解析*/
        if (!_this.KHUtils.isNull(_this.manualValue[0])) {
            if (_this.pickType==1&&_this.valueSource==0) {//多选
                let obj=[];
                for (let i=0;i<_this.manualValue.length;i++){
                    obj.push(_this.manualValue[i].value);
                }
                _this.manualDoubleVal=obj;
            }else if(_this.pickType==0&&_this.valueSource==0){
                let obj=[];
                obj.push(_this.manualValue[0].value);
                _this.manualSingleVal=_this.manualValue[0].value;
            }
        }
        _this.stringDefaultBool=false;
    },
    /*渲染单个数据集*/
    selectDS(){
      let _this=this;
      _this.selectDataSetMeasures=[];
      _this.selectDataSetDims=[];
      _this.selectColumn="";
      _this.displayColumn="";
      let flag=true;
      let param={
        pageNum:_this.loadPageNum,
        pageSize:20
      }
      _this.$Get(_this.khConfig.api.queryDataSetConf,param).then(res=>{
          if (res.errCode==0){
              if (res.datasets.length<1){
                  _this.loadPageNum=_this.loadPageNum-1;
                  _this.busy=true;
                  return
              }
              for (let i=0;i<res.datasets.length;i++){
                  let item=res.datasets[i];
                  let dataSet={
                      dsId:item.dsId,
                      dsName:item.dsName,
                      dsMeta:item.dsMeta
                  }
                  _this.dataSetOptions.push(dataSet);
              }
              for (let j=0;j<_this.dataSetOptions.length;j++){
                  if (_this.conditions[_this.queryMenuIndex].select.source.dataset==_this.dataSetOptions[j].dsId){
                      _this.dataSet=j;
                      flag=false;
                      break;
                  }
              }
              if (flag){
                 _this.loadPageNum++;
                 _this.selectDS();
              } else {
                 _this.dealDataSetColumn();
              }
          }
          if (!flag){
              let items=_this.conditions[_this.queryMenuIndex].select.defaultValue;
              if (!_this.KHUtils.isNull(items[0])){
                  _this.setStringDefaultBool=true;
                  if (_this.conditions[_this.queryMenuIndex].select.pickType=="0"){
                      _this.dataSetSingleVal=items[0];
                      let obj={
                          value:_this.dataSetSingleVal,
                      }
                      _this.addColumns.push(obj);
                  } else{
                      let str="";
                      for (let k=0;k<items.length;k++){
                          str=str+items[k]+"\n";
                      }
                      _this.dataSetDoubleVal=str;
                      for(let k=0;k<items.length;k++){
                         let obj={
                            value:items[k],
                         }
                         _this.addColumns.push(obj);
                      }
                  }
              }

          }
      })

    },
    /*删除查询条件*/
    deleteQuery(row){
      let  _this=this;
      _this.deleteIndex=_this.conditions.indexOf(row);  //要删除的下标
      _this.conditions.splice(_this.conditions.indexOf(row),1);
      _this.checkedColumnIndex=[];
      _this.chartColumn="";
      _this.dataSetName="";
      _this.condErrorIndex=[];
      _this.baseConfBool=false;
      if (_this.conditions.length>0){
         _this.deleteMenuBool=false;
         _this.clickLeftMenu(0);
      }
    },
    /*根据关键字查询*/
    listColumnByKeyWord(){
        let _this=this;
        _this.counts=[];
        _this.pageNum=1;
        let dsId
        let tableName;
        let columnName;
        if (_this.valueSource==0){
            dsId=_this.getDataSetId(_this.checkedColumnIndex[0]);
            tableName=_this.dimOrMeasure.tableName
            columnName=_this.dimOrMeasure.columnName;
        }else {
            dsId=_this.selectSource.dsId;
            tableName=_this.selectSource.tableName;
            columnName=_this.selectSource.columnName;
        }
        let param={
            dataSetId:dsId,
            tb:tableName,
            col:columnName,
            pageNum:_this.pageNum,
            pageSize:101,
            wd:_this.KeyWord
        }
        _this.$Get(_this.khConfig.api.queryColumnData,param).then(res=>{
            if (res.errCode==0){
                for (let i=0;i<res.datas.length;i++){
                    let obj={
                        value:res.datas[i],
                        check:false
                    }
                    _this.counts.push(obj);
                }
            }
       })
    },
    /*改变数据状态*/
    changeStringState(){
        let _this=this;
        _this.conditions[_this.queryMenuIndex].select={};
        _this.initStringConfig()
    },
    //检查查询条件名称是否合法
    checkCondMenu(){
        let _this=this;
        _this.condErrorIndex=[];
        for(let i=0;i<_this.conditions.length;i++){
            if (_this.KHUtils.isNull(_this.conditions[i].widget)||_this.KHUtils.isNull(_this.conditions[i].table)){
                _this.condErrorIndex.push(i);
            }else {
                 if (_this.queryMenuIndex==i){
                     if (_this.conditions[i].dataType=="String"&&_this.valueSource==1&&_this.KHUtils.isNull(_this.selectColumn)){
                         _this.condErrorIndex.push(i);
                     }
                 } else {
                     if (_this.conditions[i].dataType=="String"&&_this.conditions[i].select.valueSource==1){
                         let source=_this.conditions[i].select.source;
                         if (_this.KHUtils.isNull(source)||_this.KHUtils.isNull(source.dataset)||
                             _this.KHUtils.isNull(source.table)||_this.KHUtils.isNull(source.column)){
                             _this.condErrorIndex.push(i);
                         }
                     }
                 }
                 //判断查询条件的数据图表是否存在,getDataSetId返回的是数据据,如果有返回,则该查询条件配置可以正常使用,否则该查询条件的表已被删除
                 if(_this.KHUtils.isNull(_this.getDataSetId(_this.conditions[i].widget.split(',')[0]))){
                     _this.condErrorIndex.push(i);
                 }
            }

        }

    },
    /*添加左侧所有的字段*/
    saveAllColumns(){
        let _this=this;
        _this.addColumns=[];
        for (let i=0;i<_this.counts.length;i++){
           if (i==_this.maxLimitNum){
               return;
           }
            _this.counts[i].check=true;
            let column={
                value:_this.counts[i].value,
                key:i
            }
           _this.addColumns.push(column);
        }
    },
    /*判断选的连个图表选的是否是同一个数据集*/
    handleCheckedChange(value){
       let _this=this;
       //主要判断已经配置的查询条,重新点击取消其配置的图表,解决空配置提醒问题
       if (_this.KHUtils.isNull(value[0])){
           _this.conditions[_this.queryMenuIndex].widget="";
           _this.chartColumn="";
           _this.baseConfBool=false;
       }
       for (let i=0;i<value.length;i++){
          for(let j=1;j<value.length;j++){
              if (value[i]==value[j]){
              }else{
                  let dsId1;
                  let dsId2;
                  for (let n=0;n<_this.dataChartOptions.length;n++){
                      if (_this.dataChartOptions[n].widgetId==value[i]){
                          dsId1=_this.dataChartOptions[n].dsId;
                      }
                      if (_this.dataChartOptions[n].widgetId==value[j]){
                          dsId2=_this.dataChartOptions[n].dsId
                      }
                  }
                  if (dsId1!==dsId2){
                      _this.$message.error("请选择选择相同数据集的图表")
                      value.pop();
                  }
              }
          }
       }
       /*除去重复的id后,查询控件进行保存*/
       if(!_this.KHUtils.isNull(value[0])){
         if (value.length>1){
           let widgetId="";
           for (let k=0;k<value.length;k++){
             if (k==value.length-1){
               widgetId=widgetId+value[k]
             } else {
               widgetId=widgetId+value[k]+","
             }

           }
           _this.conditions[_this.addMenuIndex].widget=widgetId;
         }else {
           _this.conditions[_this.addMenuIndex].widget=value[0];
         }
       }

      if (!_this.KHUtils.isNull(_this.checkedColumnIndex[0])){
          let dsId=_this.getDataSetId(_this.checkedColumnIndex[0]);
          _this.getDataSetDimAndMeasure(dsId);
      }

    },
    //获取维度或度量
    getDimOrMeasure(){
        let _this=this;
        /*保存图表控件id*/
        _this.clickColumnBool=false;
        _this.widgetParam.widget=_this.conditions[_this.queryMenuIndex].widget;

        /*判断查询维度*/
        if (_this.KHUtils.isNull(_this.checkedColumnIndex[0])){
            _this.dataSetDims=[];
            _this.dataSetMeasures=[];
            _this.$message.error("请先选择图表")
        }
    },
    /*根据组件id获取获取数据集ID*/
    getDataSetId(widgetId){
       let _this=this;
       for (let i=0;i<_this.dataChartOptions.length;i++){
           if (_this.dataChartOptions[i].widgetId==widgetId){
               return _this.dataChartOptions[i].dsId;
           }
       }
    },
    /*改变维度或度量的时候改变单个数据集的状态*/
    changeSelectColumn(){
        let _this=this;
        _this.dataSetSingleVal="";
        _this.dataSetDoubleVal="";
        _this.counts=[];
        _this.pageNum=0;
        _this.busy=false;
        _this.addColumns=[];
        _this.newAddBool=false;
        let index=_this.selectColumn.split(",")[0];;
        let type=_this.selectColumn.split(",")[1];
        if (type==0){
            _this.selectSource=_this.selectDataSetDims[index];
        } else {
            _this.selectSource=_this.selectDataSetMeasures[index];
        }
    },
    /*改变数据展示类型一般为String类型*/
    changeDataType(){
        let _this=this;
        _this.valueSource=0;
        if (_this.dataType==0){
            _this.valueSource="0";
        }
    },
    //选择了时间时，保证前面的时间小于后面的时间
    handleChangeDate() {
        let _this=this;
        if (_this.intervalType==3){
            if (_this.KHUtils.isNull(_this.defaultEndTime)){
                return;
            }
            if (_this.defaultStartTime>_this.defaultEndTime){
                let temp;
                temp=_this.defaultStartTime;
                _this.defaultStartTime=_this.defaultEndTime;
                _this.defaultEndTime=temp;
            }
        }
    },
   //隐藏或者是显示
    changeHideOrShow(index){
       let _this=this;
       _this.conditions[index].display=!_this.conditions[index].display;
    },
    /*判断表达式中是否存在聚合函数*/
    isExistFun(express){
        //case when 条件匹配
         let  pattern1=/([cC][aA][sS][eE]).*?([wW][hH][eE][nN]).*?/;
         return pattern1.test(express)
    },
  },
  mounted(){
    let _this=this;
    _this.parsingData();
  }
}
</script>

<style scoped lang="scss">
  .left{float: left}
  .right{float: right}
  .w100{width: 100%}
  .w95{width: 95%}
  .condHeader{width: 200px;height: 50px; border-radius: 4px;border-color: #413cfe}
  .el-col{margin-top: 10px}
  .leftChangeStyle{background-color: #EDEDED}
  .changeStyle{background-color: white}
  .rightChangeStyle{background-color: #EDEDED}
  .containers{height: 500px}
  .containerMain{height: 130%}
  .spanMenu{height: 30px;line-height: 30px;margin-left: 10px}
  .addIcon{float: right;margin-right: 15px}
  .el-cond{height: 40px;line-height: 40px;}
  .el-cond span{margin-left: 10px}
  .condRight{display: inline;float: right;margin-right: 15px}
  .font{font-size: 8px}
  .mar{margin-right: 15px;}
  .manualInput{width: 480px;height: 720px;position:absolute;z-index: 199;margin-top: -42%;margin-left: 48%; background-color: white;}
  .stringDefault{width:460px;height: 600px;background-color: white;position:absolute;z-index: 99;margin-top: -35%;margin-left: 48%}
  .spanLeft{float: left;margin-top: 10px;margin-left: 5px}
  .buttonRight{float: right;margin-right: 5px}
  .leftW25{width:80%;float: left;}
  .fontNone{margin-left: 30%;margin-top:15%;font-size: 8px;color: #999999}
  .w-text-match{width: 100px};
  .w-text-value{width: 200px}
  .w75{width: 75%}
  .pick-type0{height: 92%;width:100%; overflow:auto;}
  .pick-type1{height: 82%;width:100%; overflow:auto;}
  .over-hide{float: left;width:65%;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;}
  .option1-box {
    & span{
      width: 150px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
  .textArea{width: 220px;height: 520px;border: 0px;background-color: #FAFAFA; border-style:none;
    box-shadow:none;}
  .textArea2{width: 220px;height: 520px;border: 0px;background-color: #FAFAFA; border-style:none;
    box-shadow:none;
  }
  .textArea::-webkit-input-placeholder{
    height: 510px;line-height: 510px;margin-left: 50px;
  }
  .option2-box {
      width: 300px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
  }
</style>
