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
              <el-row v-for="(item,index) in conditions" :key="index">
                  <div  class="el-cond" @dblclick="dbClick(index)" @click="clickLeftMenu(index)"
                      :class="{changeStyle:changeSelectStyle == index}" v-if="showMenuIndex!==index">
                      <el-tooltip effect="dark" content="请先关联字段" placement="top" v-if="condErrorIndex.indexOf(index)!==-1?true:false">
                          <el-button icon="el-icon-warning" type="text" style="color: red"></el-button>
                      </el-tooltip>
                      <div class="over-hide">
                          <el-tooltip effect="dark" placement="top" :content="item.label" >
                              <span>{{item.label}}</span>
                          </el-tooltip>
                      </div>
                      <div class="condRight">
                          <el-tooltip effect="dark" content="删除">
                              <span><el-button type="text" @click.stop="deleteQuery(item)" icon="el-icon-delete"></el-button></span>
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
                  <el-col :span="10">
                      <span>请选择对应的控件</span>
                  </el-col>

                  <el-col :span="10">
                      <span>请选择字段</span>
                  </el-col>
              </el-row>
              <el-row v-for="(item,index) in dataChartOptions" :key="index">
                  <el-col :span="10">
                      <el-tooltip :content="item.widgetId" placement="top-start">
                          <el-input class="w95"  :value="item.widgetId" :disabled="true"></el-input>
                      </el-tooltip>
                  </el-col>
                  <el-col :span="10">
                      <el-select v-if="index==0"  filterable v-model="chartColumn" class="w95" @change="changeChartColumn(chartColumn)">
                          <el-option-group label="普通控件">
                              <el-option  v-for="(item,index) in baseControl" :label="item.alias"
                                          :value="toTran(index,0)" :key="index"  class="option1-box" >
                                  <span style="float: left; color: #468CFF; font-size: 13px;width: 40px">
                                     {{ item.dataType==="String"?"Str.":(item.dataType==="Date"?"Date.":"No.")}}
                                  </span>
                                  <el-tooltip  :content="item.alias" placement="top" style="float: left">
                                      <span>{{ item.alias}}</span>
                                  </el-tooltip>
                              </el-option>
                          </el-option-group>
                          <el-option-group label="特殊控件">
                              <el-option v-for="(item,index) in seniorControl" :key="index" class="option1-box" :label="item.alias" :value="toTran(index,1)">
                                <el-tooltip  :content="item.alias" placement="top"  style="float: left">
                                      <span>{{ item.alias}}</span>
                                  </el-tooltip>
                              </el-option>
                          </el-option-group>
                      </el-select>
                  </el-col>
              </el-row>
          </el-main>
        <!--右侧部分-->
          <el-main style="width:35%;height: 400px">
              <el-collapse v-if="baseConfBool" v-model="activeNames">
                  <el-collapse-item title="基础配置" name="1" style="width: 100%">
                     <!--日期类型开始-->
                     <el-row v-if="baseOrSenior.dataType=='Date'" style="height: 400px">
                         <el-row>
                             <el-col :span="5"><span class="font">时间粒度:</span></el-col>
                             <el-col :span="19">
                                 <el-select v-model="dateDim" class="w75" >
                                     <el-option v-for="(item,index) in dataDimOptions" :value="item.value" :key="index" :label="item.label"
                                     :disabled="item.disable"></el-option>
                                 </el-select>
                             </el-col>
                         </el-row>
                         <!--设定时间筛选范围开始-->
                         <el-row>
                             <el-col :span="5">匹配形式:</el-col>
                             <el-col :span="16">
                                 <el-radio-group v-model="condType" @change="initCondType">
                                     <el-radio value="$eq" class="mar" label="$eq"><span class="font">精确</span></el-radio>
                                     <el-radio value="$in" class="mar" label="$in">范围</el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <el-row>
                             <el-col>
                                <el-checkbox v-model="isCurrentDate"><span class="font">设定当前时间</span></el-checkbox>
                                 <el-checkbox v-model="setDefaultBool"><span class="font">设定预设筛选值</span></el-checkbox>
                             </el-col>
                         </el-row>
                         <!--设定预设筛选值开始-->
                         <el-row style="height: 160px;" v-if="setDefaultBool">
                             <el-row v-if="condType=='$eq'">
                                 <el-col :span="21">
                                     <el-date-picker v-if="(baseOrSenior.type!='time')"  @change="handleChangeDate"
                                                     :value-format="getDateValueFormat(baseOrSenior.type)"  :type="baseOrSenior.type=='year_month'?'month':baseOrSenior.type" v-model="defaultStartTime"
                                               placeholder="选择日期时间">
                                     </el-date-picker>
                                     <el-time-picker v-model="defaultStartTime" v-if="baseOrSenior.type=='time'" value-format="HH:mm:ss">
                                     </el-time-picker>
                                 </el-col>
                             </el-row>
                             <el-row v-if="condType=='$in'">
                               <el-col :span="12">
                                 <el-date-picker class="leftW25"  v-if="(baseOrSenior.type!='time')"  @change="handleChangeDate"
                                                 :value-format="getDateValueFormat(baseOrSenior.type)"  :type="baseOrSenior.type=='year_month'?'month':baseOrSenior.type" v-model="defaultStartTime"
                                                 placeholder="选择日期时间">
                                 </el-date-picker>
                                 <el-time-picker class="leftW25" v-model="defaultStartTime" v-if="baseOrSenior.type=='time'" value-format="HH:mm:ss">
                                 </el-time-picker>
                               </el-col>
                               <el-col :span="12">
                                 <el-date-picker class="leftW25" v-if="baseOrSenior.type!='time'" @change="handleChangeDate"
                                                 :value-format="getDateValueFormat(baseOrSenior.type)" :type="baseOrSenior.type=='year_month'?'month':baseOrSenior.type" v-model="defaultEndTime"
                                                 placeholder="选择日期时间">
                                 </el-date-picker>
                                 <el-time-picker class="leftW25" v-if="baseOrSenior.type=='time'" v-model="defaultEndTime" value-format="HH:mm:ss">
                                 </el-time-picker>
                               </el-col>
                             </el-row>
                         </el-row>
                         <!--设定预设筛选值结束-->
                     </el-row>
                     <!--日期类型结束-->
                     <!--数字类型开始-->
                     <el-row v-if="baseOrSenior.dataType=='Number'">
                         <el-row>
                             <el-col :span="5">匹配形式:</el-col>
                             <el-col :span="19">
                                 <el-radio-group v-model="condType" @change="initCondType">
                                     <el-radio value="$eq" class="mar" label="$eq"><span class="font">精确</span></el-radio>
                                     <el-radio value="$like" class="mar" label="$like"><span class="font">模糊</span></el-radio>
                                     <el-radio value="$in" class="mar" label="$in">范围</el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <el-row style="margin-top: 15px">
                         <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                       </el-row>
                         <!--单条件-->
                         <el-row v-if="setDefaultBool" style="margin-top: 15px">
                             <el-col :span="5" v-if="condType=='$eq'">精确查询:</el-col>
                             <el-col :span="5" v-if="condType=='$like'">模糊查询:</el-col>
                             <el-col :span="5" v-if="condType=='$in'">范围查询:</el-col>
                             <el-col v-if="condType=='$eq'||condType=='$like'" :span="16">
                                 <el-input-number v-model="numValue1" controls-position="right" class="w-text-value"  placeholder="请输入值">
                                 </el-input-number>
                             </el-col>
                             <el-col v-if="condType=='$in'" :span="19">
                                 <el-input-number v-model="numValue1" controls-position="right"  placeholder="开始于">
                                 </el-input-number>
                               —
                               <el-input-number v-model="numValue2" controls-position="right"   placeholder="结束于">
                               </el-input-number>
                             </el-col>
                         </el-row>
                     </el-row>
                    <!--数字类型结束-->
                    <!--字符串类型--文本输入框开始-->
                     <el-row v-if="baseOrSenior.dataType=='String'">
                         <el-row>
                             <el-col :span="5">匹配形式:</el-col>
                             <el-col :span="16">
                                 <el-radio-group v-model="condType" @change="initCondType">
                                     <el-radio value="$eq" class="mar" label="$eq"><span class="font">精确</span></el-radio>
                                     <el-radio value="$like" class="mar" label="$like"><span class="font">模糊</span></el-radio>
                                 </el-radio-group>
                             </el-col>
                         </el-row>
                         <el-row style="margin-top: 15px">
                             <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                         </el-row>
                          <!--单条件-->
                         <el-row v-if="setDefaultBool" style="margin-top: 15px">
                              <el-col :span="5" v-if="condType=='$eq'">精确查询:</el-col>
                              <el-col :span="5" v-if="condType=='$like'">模糊查询</el-col>
                              <el-col :span="16">
                                    <template v-if="baseOrSenior.type === 'user_select' ||  baseOrSenior.type === 'data_select' || baseOrSenior.type === 'org_select' || baseOrSenior.type === 'role_select' || baseOrSenior.type === 'company_select' || baseOrSenior.type === 'dic_select'">
                                        <advancedControlsSelection :formId="formId" :defaultValue.sync="strValue" :model="baseOrSenior.columnName" :config="colsArrayMap.get(baseOrSenior.columnName)" placeholder="字符或值"></advancedControlsSelection>
                                    </template>
                                    <template v-else>
                                        <el-input v-model="strValue" controls-position="right" class="w-text-value"  placeholder="字符或值"></el-input>
                                    </template>
                              </el-col>
                         </el-row>
                     </el-row>
                  <!--字符串类型--文本输入框结束-->
                  </el-collapse-item>
              </el-collapse>
              <div v-if="!baseConfBool&&seniorType==''">
                  <img src="@/assets/images/none.png" style="width: 60%;height: 50%;margin-left: 20%;margin-top: 20%"/>
                  <p class="fontNone">请先选择关联图表及字段哦</p>
              </div>
              <div v-if="seniorType=='switch'">
                  <el-row style="margin-top: 15px">
                      <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                  </el-row>
                  <el-row v-if="setDefaultBool">
                      <el-col :span="5">
                          开关选项:
                      </el-col>
                      <el-col :span="16">
                          <el-select v-model="seniorData">
                              <el-option v-for="(item,index) in seniorDatas" :label="item.label" :key="index" :value="item.value"></el-option>
                          </el-select>
                      </el-col>
                  </el-row>
              </div>
              <div v-if="seniorType=='radio'">
                  <el-row style="margin-top: 15px">
                      <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                  </el-row>
                  <el-row v-if="setDefaultBool">
                      <el-col :span="5">
                         单选框:
                      </el-col>
                      <el-col :span="19">
                          <el-radio-group v-model="seniorData">
                              <el-radio v-for="(item,index) in seniorDatas" :label="item.value" :value="item.value" :key="index">{{item.label}}</el-radio>
                          </el-radio-group>
                      </el-col>
                  </el-row>
              </div>
              <div v-if="seniorType=='checkbox'">
                  <el-row style="margin-top: 15px">
                      <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                  </el-row>
                  <el-row v-if="setDefaultBool">
                     <el-col :span="5">
                        多选框:
                     </el-col>
                     <el-col :span="19">
                         <el-checkbox-group v-model="seniorCheckbox">
                                <el-checkbox :label="item.value" :value="item.value" :key="index" v-for="(item,index) in seniorDatas">{{item.label}}</el-checkbox>
                         </el-checkbox-group>
                     </el-col>
                </el-row>
              </div>
              <div v-if="seniorType=='multiple_select'">
                  <el-row style="margin-top: 15px">
                      <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                  </el-row>
                  <el-row v-if="setDefaultBool">
                      <el-col :span="5">
                          下拉多选框:
                      </el-col>
                      <el-col :span="16">
                          <el-select v-model="seniorData" multiple placeholder="请选择">
                              <el-option v-for="(item,index) in seniorDatas" :label="item.label" :value="item.value" :key="index">
                              </el-option>
                          </el-select>
                      </el-col>
                  </el-row>
              </div>
              <div v-if="seniorType=='select'">
                  <el-row style="margin-top: 15px">
                      <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                  </el-row>
                  <el-row v-if="setDefaultBool">
                      <el-col :span="5">
                        下拉框:
                      </el-col>
                      <el-col :span="16">
                          <el-select v-model="seniorData">
                              <el-option v-for="(item,index) in seniorDatas" :label="item.label" :value="item.value" :key="index">
                              </el-option>
                          </el-select>
                      </el-col>
                  </el-row>
              </div>

      
              <div v-if="seniorType=='user_select'||seniorType=='data_select'||seniorType=='org_select'
              ||seniorType=='role_select'||seniorType=='company_select'||seniorType=='dic_select'">
                 <el-row>
                    <el-col :span="5">匹配形式</el-col>
                    <el-col :span="16">
                    <el-radio-group v-model="condType" @change="initCondType">
                        <el-radio value="$eq" class="mar" label="$eq"><span class="font">精确</span></el-radio>
                        <el-radio value="$like" class="mar" label="$like"><span class="font">模糊</span></el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
                 <el-row style="margin-top: 15px">
                     <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                 </el-row>
                 <!--单条件-->
                 <el-row v-if="setDefaultBool" style="margin-top: 15px">
                    <el-col :span="5" v-if="condType=='$eq'">精确查询:</el-col>
                    <el-col :span="5" v-if="condType=='$like'">模糊查询</el-col>
                    <el-col :span="16">
                        <el-input v-model="strValue" controls-position="right" class="w-text-value"  placeholder="字符或值">
                        </el-input>
                   </el-col>
                </el-row>
              </div>
              <div v-if="seniorType=='gis_select'">
                 <el-row>
                    <el-col :span="5">匹配形式</el-col>
                    <el-col :span="16">
                    <el-radio-group v-model="condType" @change="initCondType">
                        <el-radio value="$eq" class="mar" label="$eq"><span class="font">精确</span></el-radio>
                        <el-radio value="$like" class="mar" label="$like"><span class="font">模糊</span></el-radio>
                    </el-radio-group>
                  </el-col>
                </el-row>
                 <el-row style="margin-top: 15px">
                     <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                 </el-row>
                 <!--单条件-->
                 <el-row v-if="setDefaultBool" style="margin-top: 15px">
                    <el-col :span="5" v-if="condType=='$eq'">精确查询:</el-col>
                    <el-col :span="5" v-if="condType=='$like'">模糊查询</el-col>
                    <el-col :span="16">
                        <el-input v-model="strValue" controls-position="right" class="w-text-value"  placeholder="字符或值">
                        </el-input>
                   </el-col>
                </el-row>
              </div>
              <div v-if="seniorType=='region_select'">
                  <el-row style="margin-top: 15px">
                      <el-checkbox v-model="setDefaultBool">设定默认值</el-checkbox>
                  </el-row>
                  <el-row v-if="setDefaultBool">
                      <el-col :span="5">
                         行政区划:
                      </el-col>
                      <el-col :span="19">
                          <v-region @values="regionChange" class="form-control" v-model="regionData"></v-region>
                      </el-col>
                  </el-row>
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
  </section>
</template>
<script>
import CustomHourPicker from "@/components/CustomHourPicker";
import CustomQuarterPicker from "@/components/CustomQuarterPicker"
import CustomWeekPicker from "@/components/CustomWeekPicker";
import advancedControlsSelection from "@/components/common/advancedControlsSelection.vue";
var time=null;
var extendBaseControl = [
    {dataType:"Date",type:"datetime",columnName:"create_time","alias":"创建时间"},
    {dataType:"Date",type:"datetime",columnName:"last_update_time","alias":"更新时间"},
    {dataType:"String",type:"input",columnName:"last_update_user_id","alias":"更新人ID"},
    {dataType:"String",type:"input",columnName:"last_update_user_name","alias":"更新人"},
    {dataType:"String",type:"input",columnName:"user_id","alias":"创建人ID"},
    {dataType:"String",type:"input",columnName:"user_name","alias":"创建人"},
    {dataType:"String",type:"input",columnName:"real_name","alias":"创建人真实姓名"},
]


export default {
  name: "FormConditionConfig",
  components:{CustomHourPicker,CustomQuarterPicker,CustomWeekPicker,advancedControlsSelection},
  props:{
    widgets:{
      type:Array,
      default(){
        return{}
      }
    },
    queryId:{},
    formConfig: {type: Object},
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
          baseConfBool:false,
          activeNames:"1",
          activeName:"first",
          dateDim:"", //时间
          dataDimOptions:[
              {value:"year",label:"年",disable:true},
              {value:"month",label:"月",disable:true},
              {value:"year_month",label:"年-月",disable:true},
              {value:"date",label:"日期",disable:true},
              {value:"time",label:"时间",disable:true},
              {value:"datetime",label:"日期时间",disable:true}
          ],
          stringDisabled:false,
          dataSet:"",
          condType:"$eq",//条件形式
          intervalType:"1",  //区间类型
          textMatchTypeOptions:[
             {value:"$eq",label:"精确匹配"},
             {value:"$like",label:"模糊查询"}
          ],
          defaultStartTime:"",
          defaultEndTime:"",
          numValue1:0,//数字类型的值1
          numValue2:0, //数字类型值2
          strValue:"",  //字符串类型数值
          setDefaultBool:false,  //文本框的默认值判断
          queryConditionIndex:0,
          tabQueryBool:false, //判断查询控件是否在tab标签页中
          deleteIndex:"",//删除查询条件的下标
          condErrorIndex:[],//查询条件错误配置的下标
        /*--------------------------------------------------*/
         baseControl:[], //基础控件
         seniorControl:[],//高级控件
         baseOrSenior:{}, //基本或高级控件
         seniorType:"",//高级控件类型
         seniorData:"",//单选类型选择的值
         seniorCheckbox:[],
         seniorDatas:[],//单选类型的键值对
         isAddBool:false,
         regionData:{},
         deleteMenuBool:true,
         colsArray:[],
         isCurrentDate:false,// 当前时间
      }
  },
    created(){
        let _this = this;
        if (_this.KHUtils.isNull(_this.formConfig)) {
            return false;
        }
        if (!_this.formConfig) {

            return false;
        }
        if (!_this.formConfig.list) {
            return false;
        }
        _this.colsArray = [];
        _this.formConfig.list.forEach(val => {
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
  computed:{
    colsArrayMap(){
        let map = new Map()
        this.colsArray.forEach((config)=>{
            map.set(config.model,config)
        })
        return map
    },
    getDateValueFormat(){
      return function (type) {
        if (type == "year") {
          return "yyyy";
        }
        if (type=="month") {
          return "MM";
        }
        if (type=="year_month"){
           return "yyyy-MM";
        }
        if (type == "date") {
          return "yyyy-MM-dd";
        }

        if (type == "time") {
          return "HH:mm:ss";
        }
        if (type == "datetime") {
          return "yyyy-MM-dd HH:mm:ss";
        }

      }
    },
  },
  watch:{
    //监听并将isCurrentDate和setDefaultBool选中状态互斥
    isCurrentDate(val,oldVal){
        if(val === true){
            this.setDefaultBool = false
            this.defaultStartTime = ""
            this.defaultEndTime = ""
        }
    },
    setDefaultBool(val,oldVal){
        if(val === true){
            this.isCurrentDate = false
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
          if (_this.widgets[i].type=='reportWidget'){ /*一级图表*/
              reportIndex.push(i);
              let param={
                  label:_this.widgets[i].name,
                  widgetId:_this.widgets[i].id+"", //控件id
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
                      if (secondWidget[i].type == 'reportWidget') { /*一级图表*/
                          let param = {
                             label: secondWidget[i].name,
                             widgetId: secondWidget[i].id + "", //控件id
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
            _this.addInputBool=false;
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
         _this.addInputValue=_this.conditions[index].label;
     },
    /*保存输入框的值*/
     saveInputValue(){
      let _this=this;
      _this.showMenuIndex="";
      _this.baseConfBool=false;
        let obj={
            label:_this.addInputValue,
        }
        _this.conditions.push(obj);
        _this.addInputBool=false;
      _this.seniorType="";
      _this.clickLeftMenu(_this.conditions.length-1);
    },
    /*点击添加按钮,显示出添加输入框*/
     showElInput(){
         let _this=this;
         if (_this.conditions.length>0){
             _this.saveQueryCond();
         }
         _this.chartColumn="";
         _this.addInputValue="";
         _this.showMenuIndex="";
         _this.addInputBool=true;
         /*控件绑定的默认值清空*/
         _this.strValue = "";
         _this.numValue1 = 0;
         _this.numValue2 = 0;
         _this.defaultStartTime = "";
         _this.defaultEndTime = "";
         _this.baseOrSenior = {};
         _this.seniorData="";
         _this.seniorDatas=[];
         _this.addInputValue="未命名";
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
        _this.conditions[index].label=_this.addInputValue;
      }
      _this.showMenuIndex="";
    },
    /*修改查询条件的样式--在主界面左侧,判断这个查询条件信息*/
     clickLeftMenu(index){
 
       clearTimeout(time);  //首先清除计时器,定时器的作用是防止双击事件
       time = setTimeout(() => {
        let _this=this;
        if (_this.conditions.length>0&&_this.deleteMenuBool){
            _this.saveQueryCond();
        }
        _this.chartColumn="";
        _this.changeSelectStyle=index;
         _this.deleteMenuBool=true;
        _this.queryMenuIndex=index; //将下标赋给全局变
        _this.getControlColumn(_this.conditions[index].key);
        if(_this.isCurrentDate && _this.setDefaultBool){    //“设置当前时间”和“设置预设筛选值”同时勾选，优先保留当前时间   
            _this.setDefaultBool = false
            _this.defaultStartTime = ""
            _this.defaultEndTime = ""
        }
       }, 300);
    },
    /*获取控件的的名称*/
    getControlColumn(columnName){
        debugger
        let _this=this;
        for (let i=0;i<_this.baseControl.length;i++){
           if (_this.baseControl[i].columnName==columnName){
              _this.chartColumn=i+','+0;
              _this.baseOrSenior=_this.baseControl[i];
           }
        }
        for (let n=0;n<_this.seniorControl.length;n++){
           if (columnName=='region_select') {
             if (_this.seniorControl[n].type==columnName){
               _this.chartColumn=n+','+1;
               _this.baseOrSenior=_this.seniorControl[n];
               break;
             }
           }
             if (_this.seniorControl[n].columnName==columnName){
               _this.chartColumn=n+','+1;
               _this.baseOrSenior=_this.seniorControl[n];
             }

        }
        if (!_this.KHUtils.isNull(_this.chartColumn)) {
          _this.setBaseConfParam(_this.baseOrSenior.dataType,_this.baseOrSenior.type);
          _this.baseConfRendering();
        }else {
           _this.baseConfBool=false;
        }
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
        let queryName=_this.conditions[_this.queryMenuIndex].label;
        _this.conditions[_this.queryMenuIndex]={};
        _this.conditions[_this.queryMenuIndex].label=queryName;
        _this.conditions[_this.queryMenuIndex].style={widthScale:1};
        _this.initConfig();
        let index=chartColumn.split(",")[0];//下标
        let type=chartColumn.split(",")[1]; //类型--维度0,度量1
        if (type==0){ //基本控件
            _this.baseOrSenior=_this.baseControl[index];
            _this.conditions[_this.queryMenuIndex].key=_this.baseOrSenior.columnName;
            _this.conditions[_this.queryMenuIndex].type=_this.baseOrSenior.type;
            _this.seniorType="";
            _this.setBaseConfParam(_this.baseOrSenior.dataType,_this.baseOrSenior.type);
        } else {  //高级控件
            _this.baseConfBool=false;
            _this.baseOrSenior = _this.seniorControl[index];
            _this.conditions[_this.queryMenuIndex].type=_this.baseOrSenior.type;
            _this.conditions[_this.queryMenuIndex].key=_this.baseOrSenior.columnName;
            _this.seniorType=_this.baseOrSenior.type;
            if (_this.seniorType=="data_select"||_this.seniorType=="org_select"||_this.seniorType=="user_select"
              ||_this.seniorType=="role_select"||_this.seniorType=="company_select"||_this.seniorType=="dic_select"){
               _this.setSeniorConfParam(_this.seniorType,_this.baseOrSenior.keyModel);
            } else if (_this.seniorType=="gis_select") {
              _this.setSeniorConfParam(_this.seniorType,_this.baseOrSenior.modelExt)
            }else {
               _this.setSeniorConfParam(_this.seniorType,_this.baseOrSenior.options);
            }

        }
      },
    /*初始化配置*/
    initConfig(){
      let _this=this;
      _this.setDefaultBool=false;
      _this.strValue="";
      _this.defaultStartTime="";
      _this.defaultEndTime="";
      _this.condType="$eq";
      _this.seniorData="",
      _this.seniorDatas=[]
      _this.isCurrentDate = false
    },
    /*保存查询条件*/
    saveConditions(){
        let _this=this;

        if (_this.conditions.length>0){
            _this.saveQueryCond();
        }
        _this.checkCondition();
        if (_this.condErrorIndex.length>0){
            return;
        }
         _this.exchangeConditions();
        console.log(JSON.stringify(_this.conditions))
        _this.widgets[_this.queryConditionIndex].conditions=_this.conditions;
       _this.$emit("closeCondition");
       _this.conditions=[];
    },
    /*检查查询条件的合法性*/
    checkCondition(){
         let _this=this;
         _this.condErrorIndex=[];
         for (let i=0;i<_this.conditions.length;i++){
             if (_this.KHUtils.isNull(_this.conditions[i].type)){
                 _this.condErrorIndex.push(i);
             }
         }
    },
    cancelSave(){
      this.$emit("closeCondition");
    },
    /*对选中的维度或度量存储其类型或者是下标*/
    toTran(index,type){
      let param=index+","+type;
      return param;
    },
    /*设置基础配置参数*/
    setBaseConfParam(dataType,type){
        let _this=this;
        switch (dataType) {
            case "String":
               _this.baseConfBool=true;
                return;
            case "Number":
                _this.baseConfBool=true;
                return;
            case "Date":
                 _this.baseConfBool=true;
                 switch (type) {
                   case "year":
                     _this.initDateFormat();
                     _this.dataDimOptions[0].disable=false;
                     _this.dateDim=_this.dataDimOptions[0].value;
                     return;
                   case "month":
                     _this.initDateFormat();
                     _this.dataDimOptions[1].disable=false;
                     _this.dateDim=_this.dataDimOptions[1].value;
                     return;
                   case "year_month":
                     _this.initDateFormat();
                     _this.dataDimOptions[2].disable=false;
                     _this.dateDim=_this.dataDimOptions[2].value;
                     return;
                   case "date":
                     _this.initDateFormat();
                     _this.dataDimOptions[3].disable=false;
                     _this.dateDim=_this.dataDimOptions[3].value;
                     return
                   case "time":
                     _this.initDateFormat();
                     _this.dataDimOptions[4].disable=false;
                     _this.dateDim=_this.dataDimOptions[4].value;
                     return
                   case "datetime":
                     _this.initDateFormat();
                     _this.dataDimOptions[5].disable=false;
                     _this.dateDim=_this.dataDimOptions[5].value;
                     return
                 }
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
    /*基础配置渲染*/
    baseConfRendering(){
        
       let _this=this;
        _this.setDefaultBool=false;
        _this.strValue = "";
        _this.numValue1 = 0;
        _this.numValue2 = 0;
        _this.defaultStartTime = "";
        _this.defaultEndTime = "";
        _this.seniorData="";
        _this.seniorDatas=[];
       let index=_this.queryMenuIndex;

       if (!(index<_this.conditions.length)){
          return
        }
       if (_this.baseOrSenior.dataType=="") {
           _this.seniorType=_this.baseOrSenior.type;
           _this.baseConfBool=false;
           _this.seniorConfRendering();
           return;
       }else {
          _this.baseConfBool=true;
          _this.seniorType="";
       }
       if (_this.baseOrSenior.dataType=="Number"){
           _this.condType=_this.conditions[index].opt;
           if (_this.condType=="$in"){
               if (!_this.KHUtils.isNull(_this.conditions[index].defaultValue[0])){
                   _this.setDefaultBool=true;
               }
              _this.numValue2=_this.conditions[index].defaultValue[1];
              _this.numValue1=_this.conditions[index].defaultValue[0];
           } else {
               if (!_this.KHUtils.isNull(_this.conditions[index].defaultValue)){
                   _this.numValue1=_this.conditions[index].defaultValue;
                   _this.setDefaultBool=true;
               }
           }

       }else if (_this.baseOrSenior.dataType=="Date"){
             _this.condType=_this.conditions[index].opt;
             _this.isCurrentDate = _this.conditions[index].isCurrentDate
        
                  if (_this.condType=="$eq"){
                      if (!_this.KHUtils.isNull(_this.conditions[_this.queryMenuIndex].defaultValue)){
                         _this.setDefaultBool=true;
                      }
                      _this.defaultStartTime=_this.conditions[index].defaultValue;
                  } else {
                      if (!_this.KHUtils.isNull(_this.conditions[_this.queryMenuIndex].defaultValue[0])){
                          _this.setDefaultBool=true;
                      }
                      _this.defaultStartTime=_this.conditions[index].defaultValue[0];
                      _this.defaultEndTime=_this.conditions[index].defaultValue[1];
                  }
                


       }else if (_this.baseOrSenior.dataType=="String") {        //String类型渲染
               _this.condType=_this.conditions[index].opt;
               if (!_this.KHUtils.isNull(_this.conditions[index].defaultValue)){
                   _this.setDefaultBool=true;
                   _this.strValue=_this.conditions[index].defaultValue;
               }
       }
    },
    /*高级控件配置渲染*/
    seniorConfRendering(){
      let _this=this;
      _this.baseConfBool=false;
      if (_this.baseOrSenior.type=="switch"||_this.baseOrSenior.type=="radio"||_this.baseOrSenior.type=="multiple_select"
        ||_this.baseOrSenior.type=="checkbox"||_this.baseOrSenior.type=="select"){
          if(_this.baseOrSenior.type=="multiple_select"
              ||_this.baseOrSenior.type=="checkbox"){
              if(_this.conditions[_this.queryMenuIndex].defaultValue instanceof Array && _this.conditions[_this.queryMenuIndex].defaultValue.length >0){
                  _this.setDefaultBool=true;
              }
          }else {
              if (!_this.KHUtils.isNull(_this.conditions[_this.queryMenuIndex].defaultValue)){
                  _this.setDefaultBool=true;
              }
          }
          _this.seniorDatas=_this.conditions[_this.queryMenuIndex].options;
          if (_this.baseOrSenior.type=="checkbox"){
              _this.seniorCheckbox= _this.conditions[_this.queryMenuIndex].defaultValue
          } else {
              _this.seniorData=_this.conditions[_this.queryMenuIndex].defaultValue;
          }
      }else if(_this.baseOrSenior.type=="data_select"||_this.baseOrSenior.type=="org_select"||_this.baseOrSenior.type=="user_select"
        ||_this.baseOrSenior.type=="role_select"||_this.baseOrSenior.type=="company_select"||_this.baseOrSenior.type=="dic_select"
        ||_this.baseOrSenior.type=="gis_select"){
           if (!_this.KHUtils.isNull(_this.conditions[_this.queryMenuIndex].defaultValue)){
               _this.setDefaultBool=true;
               _this.strValue=_this.conditions[_this.queryMenuIndex].defaultValue;
           }
      }else if(_this.baseOrSenior.type=="region_select"){
         if (!_this.KHUtils.isNull(_this.conditions[_this.queryMenuIndex].defaultValue.provinceName)) {
            _this.setDefaultBool=true;
            _this.regionData=_this.conditions[_this.queryMenuIndex].defaultValue;
         }
      }
    },
    /*保存数字类型的数据*/
    saveNumQueryCond(){
       let _this=this;
       _this.conditions[_this.queryMenuIndex].opt=_this.condType;
       if (!_this.setDefaultBool){
         _this.numValue2="";
         _this.numValue1="";
       }
           if (_this.condType=="$in"){
               _this.conditions[_this.queryMenuIndex].defaultValue=[]
               _this.conditions[_this.queryMenuIndex].defaultValue.push(_this.numValue1);
               _this.conditions[_this.queryMenuIndex].defaultValue.push(_this.numValue2);
           }else {
               _this.conditions[_this.queryMenuIndex].defaultValue=_this.numValue1;
           }
    },
    /*保存查询条件*/
    saveQueryCond(){
      let _this=this;
      if (!_this.KHUtils.isNull(_this.queryMenuIndex)&&!_this.KHUtils.isNull(_this.baseOrSenior)){
          if(_this.baseOrSenior.dataType==""){
               _this.saveSeniorCond();
               return;
          }
          if (_this.baseOrSenior.dataType=="Number"){
              _this.saveNumQueryCond();
          }else if (_this.baseOrSenior.dataType=="Date"){
              _this.conditions[_this.queryMenuIndex].opt=_this.condType;
              _this.conditions[_this.queryMenuIndex].isCurrentDate=_this.isCurrentDate;
              if (_this.condType=="$in"){
                  _this.conditions[_this.queryMenuIndex].defaultValue=[];
                  if(_this.setDefaultBool){
                      _this.conditions[_this.queryMenuIndex].defaultValue.push(_this.defaultStartTime);
                      _this.conditions[_this.queryMenuIndex].defaultValue.push(_this.defaultEndTime);
                  }else {
                      _this.defaultStartTime = null;
                      _this.defaultEndTime = null;
                  }
              }else {
                  if(_this.setDefaultBool){
                      _this.conditions[_this.queryMenuIndex].defaultValue=_this.defaultStartTime;
                  }else {
                      _this.conditions[_this.queryMenuIndex].defaultValue=null;
                  }
              }
          }else if (_this.baseOrSenior.dataType=="String"){
              _this.saveQueryText();
          }
      }
    },
    /*初始化number类型的配置*/
    initNumConfig(){
      let _this=this;
      _this.condType=0;
      _this.numValue1="";
      _this.numValue2="";
      _this.matchType1="$eq";
      _this.matchType2="$eq";
    },
    /*保存文本类型查询条件*/
    saveQueryText(){
        let _this=this;
        _this.conditions[_this.queryMenuIndex].opt=_this.condType;
        if (!_this.KHUtils.isNull(_this.strValue) && _this.setDefaultBool){
            _this.conditions[_this.queryMenuIndex].defaultValue=_this.strValue;
        }else {
            _this.conditions[_this.queryMenuIndex].defaultValue="";
        }
    },
    /*删除查询条件*/
    deleteQuery(row){
      let  _this=this;
      _this.deleteIndex=_this.conditions.indexOf(row);  //要删除的下标
      _this.conditions.splice(_this.conditions.indexOf(row),1);
      _this.chartColumn="";
      _this.condErrorIndex=[];
      _this.baseConfBool=false;
      if (_this.conditions.length>0){
         _this.deleteMenuBool=false;
         _this.clickLeftMenu(0);
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
    //保存高级控件查询条件
    saveSeniorCond(){
        let _this=this;
        if (_this.baseOrSenior.type=="switch"||_this.baseOrSenior.type=="select"||_this.baseOrSenior.type=="radio"
            ||_this.baseOrSenior.type=="checkbox"||_this.baseOrSenior.type=="multiple_select"){
            _this.conditions[_this.queryMenuIndex].options=_this.seniorDatas;
            if (_this.baseOrSenior.type=="checkbox"){
                if(_this.setDefaultBool){
                    _this.conditions[_this.queryMenuIndex].defaultValue=_this.seniorCheckbox;
                }else {
                    _this.conditions[_this.queryMenuIndex].defaultValue=[];
                }

            } else {
                if(_this.setDefaultBool){
                    _this.conditions[_this.queryMenuIndex].defaultValue=_this.seniorData;
                }else {
                    _this.conditions[_this.queryMenuIndex].defaultValue="";
                }

            }

        }else if(_this.baseOrSenior.type=="data_select"||_this.baseOrSenior.type=="org_select"||_this.baseOrSenior.type=="user_select"
          ||_this.baseOrSenior.type=="role_select"||_this.baseOrSenior.type=="company_select"||_this.baseOrSenior.type=="dic_select"
          ||_this.baseOrSenior.type=="gis_select"){
            _this.conditions[_this.queryMenuIndex].opt=_this.condType;
            if (_this.setDefaultBool){
              if (!_this.KHUtils.isNull(_this.strValue)){
               _this.conditions[_this.queryMenuIndex].defaultValue=_this.strValue;
            } else {
              _this.conditions[_this.queryMenuIndex].defaultValue="";
               }
            }else {
               _this.conditions[_this.queryMenuIndex].defaultValue="";
            }
        }else if(_this.baseOrSenior.type=='region_select'){
            _this.conditions[_this.queryMenuIndex].defaultValue={};
            _this.conditions[_this.queryMenuIndex].keys={};
            _this.conditions[_this.queryMenuIndex].keys.province=_this.baseOrSenior.modelExt.province;
            _this.conditions[_this.queryMenuIndex].keys.city=_this.baseOrSenior.modelExt.city;
            _this.conditions[_this.queryMenuIndex].keys.area=_this.baseOrSenior.modelExt.area;
            if (_this.setDefaultBool){
                _this.conditions[_this.queryMenuIndex].defaultValue=_this.regionData;
            } else {
                //_this.conditions[_this.queryMenuIndex].defaultValue.province="";
            }

        }
    },
   //初始化table数据
    initTable(){
      let _this=this;
      let regionBool=true;
      let gisBool=true;
      let stringColumns=[];
      let numberColumns=[];
      let dateColumns=[];
      console.log(JSON.stringify(_this.colsArray));
      for (let i=0;i<_this.colsArray.length;i++){
         if (_this.colsArray[i].type=='input'||_this.colsArray[i].type=='text'||_this.colsArray[i].type=='textarea'||_this.colsArray[i].type=='input_mail'
           ||_this.colsArray[i].type=='input_mobile'||_this.colsArray[i].type=='input_postal'||_this.colsArray[i].type=='input_website'||_this.colsArray[i].type=='input_tel'){
           let param ={dataType:'String'};
           param.type=_this.colsArray[i].type;
           param.columnName=_this.colsArray[i].model;
           param.alias=_this.colsArray[i].name;
           stringColumns.push(param);
         }else if (_this.colsArray[i].type=='input_number'||_this.colsArray[i].type=='input_int'||_this.colsArray[i].type=='input_long'
           ||_this.colsArray[i].type=='number'){
           let param ={dataType:'Number'};
           param.type=_this.colsArray[i].type;
           param.columnName=_this.colsArray[i].model;
           param.alias=_this.colsArray[i].name;
           numberColumns.push(param);
         }else if (_this.colsArray[i].type=='year'||_this.colsArray[i].type=='month'||_this.colsArray[i].type=='year_month'
           ||_this.colsArray[i].type=='date'||_this.colsArray[i].type=='time'||_this.colsArray[i].type=='datetime'){
           let param ={dataType:'Date'};
           param.type=_this.colsArray[i].type;
           param.columnName=_this.colsArray[i].model;
           param.alias=_this.colsArray[i].name;
           dateColumns.push(param);
         }else if (_this.colsArray[i].type=='region_select'||_this.colsArray[i].type=='switch'||_this.colsArray[i].type=='radio'
               ||_this.colsArray[i].type=='checkbox'||_this.colsArray[i].type=='multiple_select'||_this.colsArray[i].type=='select') {
               let param={dataType:''}
               param.type=_this.colsArray[i].type;
               param.columnName=_this.colsArray[i].model;
               param.alias=_this.colsArray[i].name;
               if(_this.colsArray[i].type=="region_select"&&regionBool){
                   param.alias="行政区划";
                   param.modelExt=_this.colsArray[i].modelExt;
                   regionBool=false;
               }else if(_this.colsArray[i].type=="region_select"&&!regionBool){
                  continue;
               }
               if (_this.colsArray[i].type=='switch'||_this.colsArray[i].type=='radio'||_this.colsArray[i].type=='checkbox'
                 ||_this.colsArray[i].type=='multiple_select'||_this.colsArray[i].type=='select'){
                    if (_this.colsArray[i].type=='radio'||_this.colsArray[i].type=='multiple_select'||_this.colsArray[i].type=='select'){
                        let obj=[];
                        let options=_this.colsArray[i].options.options;
                        for (let n=0;n<options.length;n++){
                           let param={}
                           param.label=options[n].label;
                           param.value=options[n].value;
                           obj.push(param);
                        }
                        param.options=obj;
                    } else if (_this.colsArray[i].type=='switch') {
                        param.options=_this.colsArray[i].options;
                    }else {
                        param.options=_this.colsArray[i].options.options;
                    }

               }
               _this.seniorControl.push(param);
         }else if (_this.colsArray[i].type=='data_select'|| _this.colsArray[i].type=='org_select'||_this.colsArray[i].type=='user_select'
                  ||_this.colsArray[i].type=='role_select' ||_this.colsArray[i].type=='company_select'
                 ||_this.colsArray[i].type=='dic_select') {
                 if (_this.colsArray[i].label_model!==_this.colsArray[i].model){
                     let param={dataType:'String'}
                     param.type=_this.colsArray[i].type;
                     param.columnName=_this.colsArray[i].label_model;
                     if (_this.colsArray[i].type=='data_select') {
                         if (!_this.KHUtils.isNull(_this.colsArray[i].label_name)) {
                             param.alias=_this.colsArray[i].label_name;
                         }else if(!_this.KHUtils.isNull(_this.colsArray[i].name)) {
                             param.alias=_this.colsArray[i].label_name;
                         }else if (!_this.KHUtils.isNull(_this.colsArray[i].title)){
                             param.alias=_this.colsArray[i].title;
                         }else {
                             param.alias="通用数据";
                         }
                     }else {
                         param.alias=_this.colsArray[i].label_name;
                     }
                    _this.seniorControl.push(param);
                 }else {
                     continue;
                 }
         }else if (_this.colsArray[i].type=='gis_select'){
             if (gisBool){
                 let param={dataType:'String'};
                 param.type=_this.colsArray[i].type;
                 param.alias="详细地址";
                 param.columnName=_this.colsArray[i].modelExt.address;
                 _this.seniorControl.push(param);
                 gisBool=false;
             } else {
                continue;
             }

         }
      }
      for(let j=0;j<numberColumns.length;j++){
        _this.baseControl.push(numberColumns[j]);
      }
      for (let i=0;i<stringColumns.length;i++){
        _this.baseControl.push(stringColumns[i]);
      }

      for (let n=0;n<dateColumns.length;n++){
        _this.baseControl.push(dateColumns[n]);
      }
      _this.baseControl.push(...extendBaseControl)
    },
    //设置高级类型的参数
    setSeniorConfParam(type,options){
        let _this=this;
        switch (type) {
          case "switch":
              _this.switchDatas=[];
              _this.setSwitchParam(options);
            break
          case "radio":
              _this.setRadioParam(options);
            break;
          case "checkbox":
            _this.setCheckboxParam(options);
            break;
          case "multiple_select":
            _this.setMultiple_selectParam(options)
            break;
          case "select":
            _this.setSelectParam(options)
            break;
        }

    },
    /*通用数据,组织结构,角色,组织,数据字典,企业*/
    setSwitchParam(options){
       let _this=this;
       let param0={
          label:"全部",
          value:""
       }
       let param1={
          label:options.openMsg,
          value:"0"
       }
       let param2={
           label:options.closeMsg,
           value:"1"
       }
       _this.seniorDatas.push(param0);
      _this.seniorDatas.push(param1);
      _this.seniorDatas.push(param2);
    },
    setRadioParam(options){
      let _this=this;
      _this.seniorDatas=options;
    },
    setCheckboxParam(options){
      let _this=this;
      _this.seniorDatas=options;
    },
    setMultiple_selectParam(options){
       let _this=this;
       _this.seniorDatas=options;
    },
    setSelectParam(options){
       let _this=this;
       _this.seniorDatas=options;
    },
    regionChange(data){
       let _this=this;
       if (data.province) {
          if (data.province.value) {
             _this.regionData.provinceName= data.province.value; // 省
          }
       } else {
           _this.regionData.provinceName = ""; // 省
       }
       if (data.city) {
          if (data.city.value) {
             _this.regionData.cityCodeName = data.city.value; // 市
          }
       } else {
          _this.regionData.cityCodeName = ""; // 市
       }
      if (data.area) {
          if (data.area.value) {
             _this.regionData.areaName = data.area.value; // 县
          }
      } else {
          _this.regionData.area= "";
      }

    },
    /*初始化类型配置*/
    initCondType(){
       let _this=this;
       _this.defaultStartTime="";
       _this.defaultEndTime="";
       _this.strValue="";
       _this.numValue1=0;
       _this.numValue2=0;
       _this.setDefaultBool=false;
    },
    //交换位置
    exchangeConditions(){
      let _this=this;
      let index=[];
      for (let i=0;i<_this.conditions.length;i++){
        if ((_this.conditions[i].type=="radio"||_this.conditions[i].type=="checkbox"
          ||_this.conditions[i].type=="region_select")&&index.indexOf(i)==-1){
          for (let n =_this.conditions.length-1;n>0;n--){
            if (i>n){
              break;
            }
            if (_this.conditions[n].type!=="radio"&&_this.conditions[n].type!=="checkbox"
              &&_this.conditions[n].type!=="region_select"&&(index.indexOf(n)==-1&&i<n)){
              let temp=_this.conditions[i];
              _this.conditions[i]=_this.conditions[n];
              _this.conditions[n]=temp;
              index.push(n);
              break;
            }

          }
        }
      }
    },
  },
  mounted(){
    let _this=this;
    _this.parsingData();
    _this.initTable();


  }
}
</script>

<style scoped lang="scss">
  .form-control {
    div.rg-select div.rg-select__el div.rg-select__content {
      padding: 0px 30px 0px 15px;
    }
  }

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
