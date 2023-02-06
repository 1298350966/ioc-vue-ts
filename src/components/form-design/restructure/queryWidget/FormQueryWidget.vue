<template>
  <el-row class="FormQueryWidget scrollBar" :id="'myDiv'+queryWidgetData.id" ref="myDiv" :gutter="0"
       v-if="refreshQueryWidgetStyle && queryConditionData.conditions != null && queryConditionData.conditions.length >0">
     <el-col class="content"  :span="24" :style="columnAndRow"><!---->
        <el-row  class="query-box" v-for="(item,key) in queryConditionData.conditions" :key="key" :style="computeSelectWidth(item.style.widthScale,20)">
            <!--文本输入框类型-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='input'||item.type=='input_mobile'||item.type=='input_mail'||item.type=='input_postal'
            ||item.type=='input_website'|| item.type=='gis_select'||item.type=='textarea'||item.type=='input_tel'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                    <div class="queryTitle" :style="titleStyle">
                         {{item.label}}
                    </div>
                </el-tooltip>
                <el-row  class="titleType1">
                    <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                        <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                            <div class="leftTitle" :style="titleStyle">
                                <span>{{item.label}}</span>
                            </div>
                        </el-tooltip>
                    </el-col>
                    <el-col class="item-height item-margin-left" >
                        <el-input class="query-widget-style" placeholder="请输入你要查询的值" v-model="item.defaultValue">
                        </el-input>
                    </el-col>
                </el-row>
            </el-col>
            <!--高级控件类型-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='data_select'||item.type=='org_select'||item.type=='user_select'||item.type=='role_select'||item.type=='company_select'||item.type=='dic_select'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                    <div class="queryTitle" :style="titleStyle">
                         {{item.label}}
                    </div>
                </el-tooltip>
                <el-row class="titleType1">
                    <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                        <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                            <div class="leftTitle" :style="titleStyle">
                                <span>{{item.label}}</span>
                            </div>
                        </el-tooltip>
                    </el-col>
                    <el-col class="item-height item-margin-left" >
                      <advancedControlsSelection :formId="formId" :defaultValue.sync="item.defaultValue" :model="item.key" :config="colsArrayMap.get(item.key)" placeholder="请输入你要查询的值"></advancedControlsSelection>
                    </el-col>
                </el-row>
            </el-col>
            <!--数组类型-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='input_number'||item.type=='input_int'||item.type=='input_long'||item.type=='number'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                   <div class="queryTitle" :style="titleStyle">
                     {{item.label}}
                   </div>
                </el-tooltip>
                <el-row class="titleType1">
                    <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                        <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                            <div class="leftTitle" :style="titleStyle">
                                <span>{{item.label}}</span>
                            </div>
                        </el-tooltip>
                    </el-col>
                    <el-col class="input-box" v-if="item.opt =='$eq' || item.opt == '$like'">
                        <el-col class=" item-height item-margin-left" >
                            <el-input class="query-widget-style" placeholder="数值" type="number" v-model="item.defaultValue">
                            </el-input>
                        </el-col>
                    </el-col>
                    <el-col class="input-box" v-if="item.opt =='$in'">
                        <el-col class=" item-height item-margin-left" >
                            <el-input class="query-widget-style" placeholder="数值" type="number" v-model="item.defaultValue[0]">
                            </el-input>
                        </el-col>
                        <el-col class="input-box">
                            <span class="item-line-height">至</span>
                        </el-col>
                        <el-col class="item-height item-margin-left" >
                                <el-input class="query-widget-style" placeholder="数值" type="number" v-model="item.defaultValue[1]">
                                </el-input>
                        </el-col>
                    </el-col>
                </el-row>
            </el-col>
            <!--Date类型-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='year'||item.type=='month'||item.type=='year_month'||item.type=='date'
               ||item.type=='time'||item.type=='datetime'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                    <div class="queryTitle" :style="titleStyle">
                        {{item.label}}
                    </div>
                </el-tooltip>
                <el-row class="titleType1">
                    <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                        <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                            <div class="leftTitle" :style="titleStyle">
                                <span>{{item.label}}</span>
                            </div>
                        </el-tooltip>
                    </el-col>
                    <el-col class="input-box" v-if="item.opt =='$eq'">
                        <el-col class=" item-height item-margin-left" >
                        <el-date-picker class="query-widget-style" v-if="item.type!='time'"  :value-format="getDateValueFormat(item.type)"
                                        :format="getDateValueFormat(item.type)" :type="item.type=='year_month'?'month':item.type" v-model="item.defaultValue"
                                      placeholder="选择日期时间">
                        </el-date-picker>
                        <el-time-picker class="query-widget-style" value-format="HH:mm:ss" v-if="item.type=='time'" v-model="item.defaultValue">
                        </el-time-picker>
                        </el-col>
                    </el-col>
                    <el-col class="input-box" v-if="item.opt =='$in'">
                        <el-col class="item-height item-margin-left" >
                            <el-date-picker v-if="item.type!='time'" class="query-widget-style"
                                            :value-format="getDateValueFormat(item.type)"     :format="getDateValueFormat(item.type)" :type="item.type=='year_month'?'month':item.type"
                                            v-model="item.defaultValue[0]" placeholder="选择日期时间">
                            </el-date-picker>
                            <el-time-picker class="query-widget-style" value-format="HH:mm:ss" v-if="item.type=='time'" v-model="item.defaultValue[0]">
                            </el-time-picker>
                        </el-col>
                        <el-col  class="input-box">
                            <span class="item-line-height">至</span>
                        </el-col>
                        <el-col class=" item-height item-margin-left" >
                            <el-date-picker v-if="item.type!='time'"  class="query-widget-style"
                                         :format="getDateValueFormat(item.type)" :value-format="getDateValueFormat(item.type)" :type="item.type=='year_month'?'month':item.type"
                                          v-model="item.defaultValue[1]" placeholder="选择日期时间">
                            </el-date-picker>
                            <el-time-picker class="query-widget-style" value-format="HH:mm:ss" v-if="item.type=='time'" v-model="item.defaultValue[1]">
                            </el-time-picker>
                        </el-col>
                    </el-col>
                </el-row>
            </el-col>
             <!--单选下拉类型-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='select'||item.type=='switch'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                   <div class="queryTitle" :style="titleStyle">
                       {{item.label}}
                   </div>
                </el-tooltip>
                <el-row class="titleType1">
                    <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                        <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                           <div class="leftTitle" :style="titleStyle">
                               <span>{{item.label}}</span>
                           </div>
                        </el-tooltip>
                    </el-col>
                    <el-col class="input-box">
                       <el-col class=" item-height item-margin-left" >
                           <el-select class="query-widget-style" v-model="item.defaultValue" clearable style="width: 100%;">
                               <el-option v-for="(em,index) in item.options" :value="em.value" :label="em.label" :key="index">
                               </el-option>
                           </el-select>
                       </el-col>
                    </el-col>
                </el-row>
            </el-col>
            <!--多选下拉类型-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='multiple_select'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                    <div class="queryTitle" :style="titleStyle">
                       {{item.label}}
                    </div>
                </el-tooltip>
                <el-row class="titleType1">
                     <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                         <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                             <div class="leftTitle" :style="titleStyle">
                                 <span>{{item.label}}</span>
                             </div>
                         </el-tooltip>
                     </el-col>
                     <el-col class="input-box">
                         <el-col class=" item-height item-margin-left" >
                             <el-select class="query-widget-style" collapse-tags  clearable
                                        style="width: 100%;" multiple v-model="item.defaultValue" placeholder="请选择">
                                 <el-option v-for="(em,index) in item.options" :value="em.value" :label="em.label" :key="index">
                                 </el-option>
                             </el-select>
                         </el-col>
                     </el-col>
                </el-row>
            </el-col>
            <!--多选框-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='checkbox'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                    <div class="queryTitle" :style="titleStyle">
                        {{item.label}}
                    </div>
                </el-tooltip>
                <el-row class="titleType1">
                    <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                        <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                            <div class="leftTitle" :style="titleStyle">
                                <span>{{item.label}}</span>
                            </div>
                        </el-tooltip>
                    </el-col>
                    <el-col class="input-box">
                        <el-col class="item-height item-margin-left" >
                           <el-checkbox-group v-model="item.defaultValue">
                               <el-checkbox class="checkboxCond" :label="em.label" :value="em.value" v-for="(em,index) in item.options" :key="index" ></el-checkbox>
                           </el-checkbox-group>
                        </el-col>
                    </el-col>
                </el-row>
            </el-col>
            <!--单选框-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='radio'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                    <div class="queryTitle" :style="titleStyle">
                      {{item.label}}
                    </div>
                </el-tooltip>
                <el-row class="titleType1">
                   <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                      <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                          <div class="leftTitle" :style="titleStyle">
                              <span>{{item.label}}</span>
                          </div>
                      </el-tooltip>
                   </el-col>
                   <el-col class="input-box">
                       <el-col class="item-height item-margin-left" >
                           <el-radio-group  v-model="item.defaultValue">
                               <el-radio class="checkboxCond"  v-for="(em,index) in item.options" :key="index" :value="em.value" :label="em.label"></el-radio>
                           </el-radio-group>
                      </el-col>
                   </el-col>
                </el-row>
            </el-col>
             <!--行政区划-->
            <el-col class="query-item" :class="colFirst" v-if="item.type=='region_select'">
                <el-tooltip v-if="queryWidgetData.style.titleType == 0" class="item" effect="dark" :content="item.label" placement="top-start">
                    <div class="queryTitle" :style="titleStyle">
                      {{item.label}}
                    </div>
                </el-tooltip>
                <el-row class="titleType1">
                    <el-col v-if="queryWidgetData.style.titleType == 1" class="myLeftTitle">
                        <el-tooltip class="item" effect="dark" :content="item.label" placement="top-start">
                            <div class="leftTitle" :style="titleStyle">
                                <span>{{item.label}}</span>
                            </div>
                        </el-tooltip>
                    </el-col>
                    <el-col class="input-box">
                        <el-col class=" item-height item-margin-left" >
                             <v-region @values="regionChange($event,item)" id="form-control" v-model="item.defaultValue" class="form-control"></v-region>
                        </el-col>
                    </el-col>
                </el-row>
            </el-col>
        </el-row>
        <div style="display: flex;align-items: end;" :style="buttonStyle">
            <div  class="button-box" :class="colFirst">
                <el-button  style="float: right" type="primary" @click="queryReport">查询</el-button>
                <el-button style="float: right;" type="primary" @click="clearQuery">清空</el-button>
            </div>
        </div>
    </el-col>
  </el-row>
  <div v-else class="no-query-widget">
    请添加查询条件
  </div>


</template>
<script>
  import CustomQuarterPicker from "@/components/CustomQuarterPicker";
  import CustomWeekPicker from "@/components/CustomWeekPicker";
  import advancedControlsSelection from "@/components/common/advancedControlsSelection.vue";
  // import "@/assets/theme/form/control/FormQueryWidget.scss"
  export default {
    components: {
      CustomQuarterPicker,
      CustomWeekPicker,
      advancedControlsSelection
    },
    name: "QueryWidget",
    props: {
      formId:{type:String|Number},
      queryWidgetData: {required: true, type: Object},
      formConfig: {type: Object},
    },
    data(){
      return {
        queryConditionData: {},
        isRefresh: true,
        stringSelectLoading: false,
        queryParams: [],
        refreshQueryWidgetStyle: true,
        numberInputWidth: 240,
        regionWidth:280,
        numberWidth:110,
        titleStyle: {},
        color: 'red',
        selectData: [],
        selectItem: {},
        radioWidth:130,
        keys:{},
        bvalue:"",
        evalue:"",
        colsArray:[],
        currentDate:null,
        
        isQueryReport:false,
      }
    },
    watch: {
      queryWidgetData: {
        deep: true,
        handler() {
          if(this.isQueryReport){ //修复点击查询按钮时触发的queryWidgetData更改，queryConditionData重新赋值导致重置默认值
            this.isQueryReport = false;
            return;
          };
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
                    || val.type === 'dic_select') {
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
                            || ls.type === 'dic_select') {
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
      this.initColArray();
      this.initQueryCondition();
      this.exchangeConditions();
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
      this.initDateDefaultValue();
      this.initTitleStyle();
      setTimeout(() => {
        this.initWidgetStyle();
      }, 10);




    },
    methods: {
      async initDateDefaultValue() {
        let _this = this;
        if (_this.queryWidgetData && _this.queryWidgetData.conditions instanceof Array && _this.queryWidgetData.conditions.length > 0) {
          let res = await this.$Get(this.khConfig.api.getCurrentDate);
          if (res.errCode === 0) {
            _this.currentDate = res.currentDate;
          }
          for (let i = 0; i < _this.queryWidgetData.conditions.length; i++) {
            let item = _this.queryWidgetData.conditions[i];
            if (item.type == 'year' || item.type == 'month' || item.type == 'year_month' || item.type == 'date'
                || item.type == 'time' || item.type == 'datetime') {
              if (item.isCurrentDate) {
                  let time = null;
                  if(item.type == 'year'){
                     time = _this.currentDate.substring(0,4);
                  }else if( item.type == 'month'){
                     time = _this.currentDate.substring(5,7);
                  }else if( item.type == 'year_month'){
                    time = _this.currentDate.substring(0,7);
                  }else if( item.type == 'date'){
                    time = _this.currentDate.substring(0,10);
                  }else if( item.type == 'time'){
                    time = _this.currentDate.substring(11,19);
                  }else if( item.type == 'datetime'){
                    time = _this.currentDate.substring(0,19);
                  }
                  if(item.opt == '$in'){
                    item.defaultValue[0] = time;
                    item.defaultValue[1] = time;
                  }else {
                    item.defaultValue = time;
                  }
              }
            }
          }
        }

        _this.queryConditionData = {};
        _this.queryConditionData = JSON.parse(JSON.stringify(_this.queryWidgetData));
      },
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
        for(let i=0;i<_this.queryWidgetData.conditions.length;i++){
           if (_this.queryWidgetData.conditions[i].type=="checkbox"){
             let checkboxs=myDiv.getElementsByClassName("checkboxCond");
             for(let i=0;i<checkboxs.length;i++){
               checkboxs[i].setAttribute("style", "border: " + borderSize + " solid " + borderColor + ";background-color:" + backgroundColor)
             }
           }
           if(_this.queryWidgetData.conditions[i].type=="radio"){
                let radios=myDiv.getElementsByClassName("radioCond");
                for(let n=0;i<radios.length;n++){
                    radios[n].setAttribute("style", "border: " + borderSize + " solid " + borderColor + ";background-color:" + backgroundColor)
                }
           }
           if(_this.queryWidgetData.conditions[i].type=="region_select"){
               var region=document.getElementById("form-control");
               var regionSelects=region.getElementsByClassName("rg-select__content");
               for(let n=0;n<regionSelects.length;n++) {
                  regionSelects[n].setAttribute("style", "border: " + borderSize + " solid " + borderColor + ";background-color:" + backgroundColor)
               }
           }
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
        this.isQueryReport = true;
        if (this.KHUtils.isNull(this.queryConditionData.conditions) || this.queryConditionData.conditions.length <1) {
             return;
        }
        this.queryParams = [];
        this.createReportConditions(this.queryParams, this.queryConditionData.conditions, this.queryConditionData.id);
        console.log(JSON.stringify(this.queryParams))
        this.$emit('queryFormConditions', this.queryParams);
      },
      createReportConditions(queryParams, queryConditions, reportId){
        let _this=this;
        if (!_this.KHUtils.isNull(queryConditions) && queryConditions.length > 0) {
          queryConditions.forEach(item => {
            if (item.type=='input'||item.type=='input_mobile'||item.type=='input_mail'||item.type=='input_postal'
              ||item.type=='input_website'||item.type=='data_select'||item.type=='org_select'||item.type=='user_select'
              ||item.type=='role_select'||item.type=='company_select'||item.type=='dic_select'||item.type=='gis_select'||item.type=='textarea'||item.type=='input_tel'||item.type=='input_mobile'){
              if (!_this.KHUtils.isNull(item.defaultValue)){
                let param={};
                param.key=item.key;
                param.type=item.opt;
                param.value=item.defaultValue;
                queryParams.push(param);
              }
            }else if (item.type=="select"||item.type=="radio"||item.type=="switch"){
                if (!_this.KHUtils.isNull(item.defaultValue)){
                  let param={};
                  param.key=item.key;
                  param.type="$eq";
                  param.value=item.defaultValue;
                  queryParams.push(param);
                }
            }else if(item.type=="input_number"||item.type=="input_int"||item.type=="number"||item.type=="input_long"||item.type=="year"
              ||item.type=="month"||item.type=="year_month"||item.type=="date"||item.type=="time"||item.type=="datetime"){
              let param={};
              param.key=item.key;
              param.type=item.opt;
              if (item.opt=="$in"){
                  if (!_this.KHUtils.isNull(item.defaultValue[0])){
                    param.bvalue=item.defaultValue[0];
                    param.evalue=item.defaultValue[1];
                    queryParams.push(param);
                  }
              }else {
                if (!_this.KHUtils.isNull(item.defaultValue)){
                  param.value=item.defaultValue;
                  queryParams.push(param);
                }
              }

            }else if (item.type=="checkbox"||item.type=="multiple_select") {
               if (!_this.KHUtils.isNull(item.defaultValue[0])){
                 let param={};
                 let values="";
                 param.key=item.key;
                 param.type="$eq"

                 for(let i=0;i<item.defaultValue.length;i++){
                   values=values+item.defaultValue[i]+",";
                 }
                 param.value=values.substring(0,values.length-1);
                 queryParams.push(param);
               }
            }
            if(item.type=="region_select"){
               if (!_this.KHUtils.isNull(item.defaultValue.provinceName)) {
                   let obj0={
                      key:item.keys.province,
                      type:"$eq",
                      value:item.defaultValue.provinceName
                   }
                   queryParams.push(obj0);
               }
               if (!_this.KHUtils.isNull(item.defaultValue.cityCodeName)){
                  let obj1={
                     key:item.keys.city,
                     type:"$eq",
                     value:item.defaultValue.cityCodeName
                  }
                  queryParams.push(obj1);
               }
               if (!_this.KHUtils.isNull(item.defaultValue.areaName)){
                  let obj2={
                     key:item.keys.area,
                     type:"$eq",
                     value:item.defaultValue.areaName
                  }
                  queryParams.push(obj2);
               }
            }
          })
        }
     },
      regionChange(data,item){
        let _this=this;
        if (data.province) {
          if (data.province.value) {
            item.defaultValue.provinceName= data.province.value; // 省
          }
        } else {
          item.defaultValue.provinceName = ""; // 省
        }
        if (data.city) {
          if (data.city.value) {
            item.defaultValue.cityCodeName = data.city.value; // 市
          }
        } else {
          item.defaultValue.cityCodeName = ""; // 市
        }
        if (data.area) {
          if (data.area.value) {
            item.defaultValue.areaName = data.area.value; // 县
          }
        } else {
          item.defaultValue.area= "";
        }

      },
      //清空查询条件
      clearQuery(){
         let _this=this;
         for(let i=0;i<_this.queryConditionData.conditions.length;i++){
             if (_this.queryConditionData.conditions[i].type=="select"||_this.queryConditionData.conditions[i].type=="radio"
               ||_this.queryConditionData.conditions[i].type=="switch") {
                  _this.queryConditionData.conditions[i].defaultValue="";
                  continue;
             }
             if (_this.queryConditionData.conditions[i].type=="region_select") {
               _this.queryConditionData.conditions[i].defaultValue.province=""
               continue;
             }
             if (_this.queryConditionData.conditions[i].type=="multiple_select" ||_this.queryConditionData.conditions[i].type=="checkbox"){
                _this.queryConditionData.conditions[i].defaultValue=[];
                continue;
             }

             if (_this.queryConditionData.conditions[i].opt=="$eq"||_this.queryConditionData.conditions[i].opt=="$like"){
                 _this.queryConditionData.conditions[i].defaultValue="";
             } else if (_this.queryConditionData.conditions[i].opt=="$in"){
                 _this.queryConditionData.conditions[i].defaultValue=[];
             }
         }
      },
      initQueryCondition(){
          let _this=this;
          let index=[];
          let regionBool=true;
          let gisBool=true;
          let keys={};
          for (let i=0;i<this.queryWidgetData.conditions.length;i++){
             if (_this.KHUtils.isNull(this.queryWidgetData.conditions[i].defaultValue)){
                 if (this.queryWidgetData.conditions[i].type=='input'||this.queryWidgetData.conditions[i].type=='input_mobile'||
                    this.queryWidgetData.conditions[i].type=='input_mail'||this.queryWidgetData.conditions[i].type=='input_postal'
                   ||this.queryWidgetData.conditions[i].type=='input_website'||this.queryWidgetData.conditions[i].type=='data_select'
                   ||this.queryWidgetData.conditions[i].type=='org_select'||this.queryWidgetData.conditions[i].type=='user_select'
                   ||this.queryWidgetData.conditions[i].type=='role_select'||this.queryWidgetData.conditions[i].type=='company_select'
                   ||this.queryWidgetData.conditions[i].type=='dic_select'||this.queryWidgetData.conditions[i].type=='gis_select'
                   ||this.queryWidgetData.conditions[i].type=='textarea'){
                       if(this.queryWidgetData.conditions[i].opt=="$in"){
                           this.queryWidgetData.conditions[i].opt="$eq";
                       }
                       this.queryWidgetData.conditions[i].defaultValue="";
                 } else if(this.queryWidgetData.conditions[i].type=="select"||this.queryWidgetData.conditions[i].type=="radio"
                        ||this.queryWidgetData.conditions[i].type=="switch"){
                        this.queryWidgetData.conditions[i].defaultValue="";
                 }else if(this.queryWidgetData.conditions[i].type=="input_number"||this.queryWidgetData.conditions[i].type=="input_int"
                        ||this.queryWidgetData.conditions[i].type=="number"||this.queryWidgetData.conditions[i].type=="input_long"){
                         if (this.queryWidgetData.conditions[i].opt=="$in"){
                           this.queryWidgetData.conditions[i].defaultValue=[];
                           this.queryWidgetData.conditions[i].defaultValue.push("");
                           this.queryWidgetData.conditions[i].defaultValue.push("");
                         } else {
                           this.queryWidgetData.conditions[i].defaultValue="";
                         }
                 }else if(this.queryWidgetData.conditions[i].type=="year"||this.queryWidgetData.conditions[i].type=="month"
                       ||this.queryWidgetData.conditions[i].type=="year_month"||this.queryWidgetData.conditions[i].type=="date"
                       ||this.queryWidgetData.conditions[i].type=="time"||this.queryWidgetData.conditions[i].type=="datetime"){
                       if (this.queryWidgetData.conditions[i].opt=="$like"){
                          this.queryWidgetData.conditions[i].opt="$eq";
                       }
                      if (this.queryWidgetData.conditions[i].opt=="$in"){
                          this.queryWidgetData.conditions[i].defaultValue=[];
                          this.queryWidgetData.conditions[i].defaultValue.push("");
                          this.queryWidgetData.conditions[i].defaultValue.push("");
                      } else {
                          this.queryWidgetData.conditions[i].defaultValue="";
                      }
                 }else if (this.queryWidgetData.conditions[i].type=="checkbox"||this.queryWidgetData.conditions[i].type=="multiple_select"){
                       this.queryWidgetData.conditions[i].defaultValue=[];
                 }
             }
             if (_this.queryWidgetData.conditions[i].type=="region_select") {
                 if (regionBool){
                     this.queryWidgetData.conditions[i].label="行政区划";
                     this.queryWidgetData.conditions[i].defaultValue={};
                     this.queryWidgetData.conditions[i].keys=this.keys;
                     this.queryWidgetData.conditions[i].key=this.keys.province;
                     regionBool=false;
                 } else {
                    index.push(i);
                 }
             }
          }
          for (let n=index.length-1;n>=0;n--){
             _this.queryWidgetData.conditions.splice(index[n],1)
          }
          index=[];
          for (let k=0;k<_this.queryWidgetData.conditions.length;k++){
               if (this.queryWidgetData.conditions[k].type=='gis_select'&&(this.queryWidgetData.conditions[k].label=='经度'||this.queryWidgetData.conditions[k].label=="纬度")) {
                    index.push(k);
               }
          }
          for (let n=index.length-1;n>=0;n--){
              _this.queryWidgetData.conditions.splice(index[n],1)
          }
      },
      exchangeConditions(){
        let _this=this;
        let index=[];
        for (let i=0;i<this.queryWidgetData.conditions.length;i++){
          if ((this.queryWidgetData.conditions[i].type=="radio"||this.queryWidgetData.conditions[i].type=="checkbox"
            ||this.queryWidgetData.conditions[i].type=="region_select")&&index.indexOf(i)==-1){
            for (let n =this.queryWidgetData.conditions.length-1;n>0;n--){
              if (i>n){
                break;
              }
              if (this.queryWidgetData.conditions[n].type!=="radio"&&this.queryWidgetData.conditions[n].type!=="checkbox"
                &&this.queryWidgetData.conditions[n].type!=="region_select"&&(index.indexOf(n)==-1&&i<n)){
                let temp=this.queryWidgetData.conditions[i];
                this.queryWidgetData.conditions[i]=this.queryWidgetData.conditions[n];
                this.queryWidgetData.conditions[n]=temp;
                index.push(n);
                break;
              }
            }
          }
        }
      },
      initColArray(){
         if (this.KHUtils.isNull(this.colsArray)){
              return;
         }
         for(let i=0;i<this.colsArray.length;i++){
            if (this.colsArray[i].type=="region_select"){
                this.keys.province=this.colsArray[i].modelExt.province;
                this.keys.city=this.colsArray[i].modelExt.city;
                this.keys.area=this.colsArray[i].modelExt.area;
                return;
            }
         }
      }
    },
    computed: {
      colsArrayMap(){
          let map = new Map()
          this.colsArray.forEach((config)=>{
            map.set(config.model,config)
          })
          return map
      },
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
          return {width: parseInt(scale * defaultWidth) + '%'}
        }
      },
      computeSelectWidths(){
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
      columnAndRow: function () {
        return {
          "flexDirection": this.queryWidgetData.style.widgetType == 1 ? 'column' : 'row'
        }
      },
      buttonStyle(){
        let style = {}
        let buttonStyle =  this.queryWidgetData.style.buttonStyle
        for (const key in buttonStyle) {
          if (Object.hasOwnProperty.call(buttonStyle, key)) {
            if(typeof buttonStyle[key] === "number"){
              style[key] = buttonStyle[key] + "px"
            }else{
              style[key] = buttonStyle[key]
            }
          }
        }
        return style
      }
    }
  }
</script>

<style lang="scss" scoped>
 
</style>
