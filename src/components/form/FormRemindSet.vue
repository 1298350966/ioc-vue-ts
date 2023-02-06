<template>
    <div>
        <el-tabs v-model="remindActiveName">
            <el-tab-pane label="定时填报提醒设置" name="first">
                <div v-if="formSet.formSet && formSet.formSet.formRemind instanceof Array && formSet.formSet.formRemind.length >0">
                    <el-row type="flex" class="row-bg" justify="center" v-for="(item,index) in formSet.formSet.formRemind"
                            :key="index">
                        <el-col :span="20" style="margin-bottom: 10px">
                            <el-card shadow="never" class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>提醒方式{{index + 1}}</span>
                                    <el-button style="float: right; padding: 3px 0" type="text"
                                               @click="deleteRemind(item,index)">删除
                                    </el-button>
                                </div>
                                <el-form ref="form" label-width="80px">
                                    <el-form-item label="接收人">
                                        <el-col @click.native="selectRecipient(item)">
                                            <div style="border: 1px solid #C0C4CC;padding: 5px;height: 30px;line-height: 30px">
                                                {{getRecipient(item)}}
                                            </div>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="提醒方式">
                                        <el-select placeholder="请选择" v-model="item.remind.remindType"
                                                   @change="remindTypeChange(item)" style="width: 100%">
                                            <el-option
                                                v-for="item in remindTypeOptions"
                                                :key="item.value"
                                                :label="item.label"
                                                :value="item.value">
                                            </el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="">
                                        <el-col v-if="item.remind.remindType != 'day'">
                                            <el-select placeholder="请选择" v-if="item.remind.remindType == 'week'"
                                                       v-model="item.remind.remindDay" multiple style="width: 100%">
                                                <el-option
                                                    v-for="item in weekOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                            <el-select placeholder="请选择" v-if="item.remind.remindType == 'mouth'"
                                                       v-model="item.remind.remindDay" multiple style="width: 100%">
                                                <el-option
                                                    v-for="item in mouthOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </el-select>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="提醒时间">
                                        <el-col>
                                            <el-time-select
                                                v-model="item.remind.remindTime"
                                                :picker-options="{
                                        start: '00:00',
                                        step: '00:05',
                                        end: '23:55'
                                      }"
                                                placeholder="选择时间">
                                            </el-time-select>
                                        </el-col>
                                    </el-form-item>
                                    <el-form-item label="提醒方式">
                                        <el-col>
                                            <el-checkbox-group v-model="item.remind.remindWay">
                                                <el-checkbox label="1">系统推送</el-checkbox>
                                                <el-checkbox label="2">短信提醒</el-checkbox>
                                                <el-checkbox label="3">邮件提醒</el-checkbox>
                                            </el-checkbox-group>
                                        </el-col>
                                    </el-form-item>
                                </el-form>
                            </el-card>
                        </el-col>

                    </el-row>
                </div>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="20">
                        <el-button type="success" plain icon="el-icon-plus" style="width: 100%;margin-top: 20px"
                                   @click="addRemind">新增提醒
                        </el-button>
                    </el-col>

                </el-row>
            </el-tab-pane>
            <el-tab-pane label="数据提醒设置" name="second">
                <div v-if="formSet.formSet && formSet.formSet.condRemind instanceof Array && formSet.formSet.condRemind.length >0">
                    <el-row type="flex" class="row-bg" justify="center" v-for="(item,index) in formSet.formSet.condRemind"
                            :key="index">
                        <el-col :span="20" style="margin-bottom: 10px">
                            <el-card shadow="never" class="box-card">
                                <div slot="header" class="clearfix">
                                    <span>提醒方式{{index + 1}}</span>
                                    <el-button style="float: right; padding: 3px 0" type="text"
                                               @click="deleteCondRemind(item,index)">删除
                                    </el-button>
                                </div>
                                <el-form ref="form" label-width="80px">
                                    <Receiver :recipient="item.recipient" :defaultRecipient.sync="item.defaultRecipient" :colsArray="allCols"></Receiver>

                                    <el-form-item label="条件">
                                        <div class="item-condition" >
                                            <!-- <div class="item-condition-title">
                                                 <b>需求字段</b>
                                             </div>-->
                                            <el-tabs v-model="item.remind.condType"  @tab-click="handleRemindCondTypeClick(item.remind)">
                                                <el-tab-pane label="普通条件" name="1">

                                                </el-tab-pane>
                                                <el-tab-pane label="周期条件" name="2">

                                                </el-tab-pane>
                                                <div>
                                                    <el-container>
                                                        <el-aside width="100px" style="padding: 20px;overflow: hidden">
                                                            <div style="height: 33%">
                                                                <span>┌------</span>
                                                            </div>
                                                            <div style="height: 33%" class="center-vertical">
                                                                <el-select v-model="item.remind.condRelative" placeholder="请选择">
                                                                    <el-option label="AND" value="and"></el-option>
                                                                    <el-option label="OR" value="or"></el-option>
                                                                </el-select>
                                                            </div>
                                                            <div style="height: 33%" class="center-vertical-bottom">
                                                                <span>└------</span>
                                                            </div>
                                                        </el-aside>
                                                        <el-main v-if="item.remind.cond && (item.remind.cond instanceof Array)">
                                                            <div v-for="(itemCond,index) in item.remind.cond " :key="index">
                                                                <el-card shadow="never" class="box-card" style="margin-bottom: 5px">
                                                                    <div slot="header" class="clearfix">
                                                                        <el-select v-model="itemCond.key" placeholder="请选择" style="width: 150px"  @change="setformSelec($event, itemCond)">
                                                                            <el-option
                                                                                v-for="col in remindColsList"
                                                                                :key="col.model"
                                                                                :label="col.name"
                                                                                :value="col.model">
                                                                            </el-option>
                                                                        </el-select>
                                                                        <el-select v-model="itemCond.condType" placeholder="请选择" style="width: 100px" @change="condTypeChange($event, itemCond)">
                                                                            <template v-if="(itemCond.type =='date' || itemCond.type =='datetime') && item.remind.condType == '1'">
                                                                                <el-option
                                                                                    v-for="item in dateCondTypeSelectOptions"
                                                                                    :key="item.value"
                                                                                    :label="item.label"
                                                                                    :value="item.value">
                                                                                </el-option>
                                                                            </template>
                                                                            <template v-else>
                                                                                <el-option
                                                                                    v-for="item in condTypeSelectOptions"
                                                                                    :key="item.value"
                                                                                    :label="item.label"
                                                                                    :value="item.value">
                                                                                </el-option>
                                                                            </template>




                                                                        </el-select>
                                                                        <i class="el-icon-delete" style="float: right" @click="deleteRemindCondition(item.remind.cond,index)"></i>
                                                                    </div>
                                                                    <div class="content-body-item">
                                                                        <template v-if="itemCond.condType==='0' && itemCond.conds instanceof Array && itemCond.conds.length >0">
                                                                            <el-select v-model="itemCond.conds[0].matchType" style="width: 20%">
                                                                                <template v-if="itemCond.dataType == 'String'">
                                                                                    <el-option v-for="(option, index) in stringMatchTypeOptions" :key="index"
                                                                                               :label="option.label" :value="option.value"></el-option>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <el-option v-for="(option, index) in numberSelectOptions" :key="index"
                                                                                               :label="option.label" :value="option.value"></el-option>
                                                                                </template>

                                                                            </el-select>
                                                                            <div style="width: 200px;margin-left: 5px">
                                                                                <form-item   :box="remindBoxConfig(itemCond.key)" :formId="formId" :readonly="false"
                                                                                             v-model="itemCond.conds[0].value"></form-item>
                                                                            </div>
                                                                        </template>
                                                                        <div v-if="itemCond.condType==='1' || itemCond.condType==='2'" style="width: 450px">
                                                                            <span>┌------</span>
                                                                            <el-select v-model="itemCond.conds[0].matchType" style="width: 30%">
                                                                                <template v-if="itemCond.dataType == 'String'">
                                                                                    <el-option v-for="(option, index) in stringMatchTypeOptions" :key="index"
                                                                                               :label="option.label" :value="option.value"></el-option>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <el-option v-for="(option, index) in numberSelectOptions" :key="index"
                                                                                               :label="option.label" :value="option.value"></el-option>
                                                                                </template>
                                                                            </el-select>
                                                                            <div style="width: 200px;display: inline-block">
                                                                                <form-item   :box="remindBoxConfig(itemCond.key)" :formId="formId" :readonly="false"
                                                                                             v-model="itemCond.conds[0].value"></form-item>
                                                                            </div>
                                                                            <div>
                                                                                {{ itemCond.condType === '1' ? '或' : '且' }}
                                                                            </div>
                                                                            <span>└------</span>
                                                                            <el-select v-model="itemCond.conds[1].matchType" style="width: 30%">
                                                                                <template v-if="itemCond.dataType == 'String'">
                                                                                    <el-option v-for="(option, index) in stringMatchTypeOptions" :key="index"
                                                                                               :label="option.label" :value="option.value"></el-option>
                                                                                </template>
                                                                                <template v-else>
                                                                                    <el-option v-for="(option, index) in numberSelectOptions" :key="index"
                                                                                               :label="option.label" :value="option.value"></el-option>
                                                                                </template>
                                                                            </el-select>
                                                                            <div style="width: 200px;display: inline-block">
                                                                                <form-item   :box="remindBoxConfig(itemCond.key)" :formId="formId" :readonly="false"
                                                                                             v-model="itemCond.conds[1].value"></form-item>
                                                                            </div>
                                                                        </div>
                                                                        <template v-if="itemCond.condType==='3'">
                                                                            <el-input v-model="itemCond.dateCond.count" placeholder="如：1" type="number" style="width:150px;" v-if = "itemCond.dateCond.type != 'theDay'"
                                                                                      onKeypress="return (/[\d]/.test(String.fromCharCode(event.keyCode || event.which))) || event.which === 8"></el-input>
                                                                            <el-select v-model="itemCond.dateCond.type" style="width: 100px;margin-left: 5px">
                                                                                <el-option v-for="(option, index) in dateCondOptions" :key="index"
                                                                                           :label="option.label" :value="option.value"></el-option>
                                                                            </el-select>
                                                                        </template>
                                                                    </div>
                                                                </el-card>

                                                            </div>

                                                            <el-button type="text" icon="el-icon-plus"  @click="addRemindCondition(item.remind.cond)">添加字段</el-button>
                                                        </el-main>
                                                    </el-container>

                                                </div>
                                            </el-tabs>

                                        </div>
                                    </el-form-item>
                                    <el-form-item label="提醒周期" v-if="item.remind.condType == '2'&& item.remind.period ">
                                        <el-input
                                            v-model="item.remind.period.count" type="number" style = "width: 150px"
                                        ></el-input>
                                        <el-select v-model="item.remind.period.type" placeholder="请选择" style="width: 100px">

                                            <template>
                                                <el-option
                                                    v-for="item in periodSelectOptions"
                                                    :key="item.value"
                                                    :label="item.label"
                                                    :value="item.value">
                                                </el-option>
                                            </template>


                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label="提醒标题">
                                        <el-input
                                            v-model="item.remind.title"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item label="提醒内容">
                                        <el-input
                                            v-model="item.remind.content"
                                        ></el-input>
                                    </el-form-item>
                                    <el-form-item label="时间范围">
                                        <el-date-picker
                                            v-model="item.remind.startTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="开始时间">
                                        </el-date-picker>
                                        <el-date-picker
                                            v-model="item.remind.endTime"
                                            type="datetime"
                                            value-format="yyyy-MM-dd HH:mm:ss"
                                            placeholder="结束时间">
                                        </el-date-picker>
                                    </el-form-item>
                                    <el-form-item label="提醒方式">
                                        <el-col>
                                            <el-checkbox-group v-model="item.remind.remindWay">
                                                <el-checkbox label="1">系统推送</el-checkbox>
                                                <el-checkbox label="2">短信提醒</el-checkbox>
                                                <el-checkbox label="3">邮件提醒</el-checkbox>
                                            </el-checkbox-group>
                                        </el-col>
                                    </el-form-item>
                                </el-form>
                            </el-card>
                        </el-col>

                    </el-row>
                </div>
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="20">
                        <el-button type="success" plain icon="el-icon-plus" style="width: 100%;margin-top: 20px"
                                   @click="addCondRemind">新增提醒
                        </el-button>
                    </el-col>

                </el-row>
            </el-tab-pane>
        </el-tabs>


        <el-row type="flex" class="row-bg" justify="center">
            <el-col :span="20" style="text-align: center;margin-top: 20px">
                <el-button @click="closeDialog()">取 消</el-button>
                <el-button type="primary" @click="saveFormRemid">保存</el-button>
            </el-col>

        </el-row>
        <el-dialog title="接收人" :visible.sync="recipientVisible" width="50%" :modal="false" :append-to-body="true"
                   :close-on-click-modal="false">

            <ore-transfer @getCheckedNodesFromOrgUserTree="getCheckedNodesFromOrgUserTree"
                          :formPermissions="currentRemind.recipient"></ore-transfer>
        </el-dialog>
    </div>
</template>

<script>
    import OreTransfer from "@/components/OreTransfer";
    import FormItem from "@/components/qr-code-set/FormItem";
    import Receiver from '@/components/form/FormRemindSet/Receiver'
    export default {
        name:"FormRemindSet",
        props:{
            formId: {
                type: Number,
                required: true
            },
            colsArray:{
                type:Array
            },
            allCols:{
                type:Array
            },

        },
        components: {
            OreTransfer,
            FormItem,
            Receiver
        },
        data(){
            return {

                formSet: {
                    id: null,
                    formId: null,
                    formSet: {
                        formRemind: [],
                        condRemind:[],
                        dataPermissions: {
                            field:{
                                name:"录入人员",
                                model:"user_id"
                            },
                            groups:[]
                        }
                    }
                },
                recipientVisible:false,
                currentRemind: {},
                remindActiveName:"first",
                numberSelectOptions: [
                    { value: "$eq", label: "=" },
                    { value: "$neq", label: "≠" },
                    { value: "$gt", label: ">" },
                    { value: "$gte", label: ">=" },
                    { value: "$lt", label: "<" },
                    { value: "$lte", label: "<=" },
                ],
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
                condTypeSelectOptions: [
                    { value: "0", label: "单条件" },
                    { value: "1", label: "或条件" },
                    { value: "2", label: "且条件" }
                ],
                dateCondTypeSelectOptions: [
                    { value: "0", label: "单条件" },
                    { value: "1", label: "或条件" },
                    { value: "2", label: "且条件" },
                    { value: "3", label: "日期条件" },
                ],
                dateCondOptions:[
                    { value: "monthAgo", label: "月前" },
                    { value: "weekAgo", label: "周前" },
                    { value: "dayAgo", label: "天前" },
                    { value: "theDay", label: "当天" },
                    { value: "monthAfter", label: "月后" },
                    { value: "weekAfter", label: "周后" },
                    { value: "dayAfter", label: "天后" },
                ],
                periodSelectOptions: [
                    { value: "day", label: "天" },
                    { value: "month", label: "月" },
                ],
                remindTypeOptions: [{
                    value: 'day',
                    label: '每天'
                }, {
                    value: 'week',
                    label: '每周'
                }, {
                    value: 'mouth',
                    label: '每月'
                }],
                weekOptions: [
                    {
                        value: '1',
                        label: '星期天'
                    },
                    {
                        value: '2',
                        label: '星期一'
                    },
                    {
                        value: '3',
                        label: '星期二'
                    },
                    {
                        value: '4',
                        label: '星期三'
                    },
                    {
                        value: '5',
                        label: '星期四'
                    }, {
                        value: '6',
                        label: '星期五'
                    },
                    {
                        value: '7',
                        label: '星期六'
                    }

                ],
                mouthOptions: [],
                defaultOptions: [],
                remindDayOptions: [],
                remindColsList:[],
            }
        },
        created() {
            for (var i = 1; i <= 31; i++) {
                let obj = {
                    value: i,
                    label: i
                }
                this.mouthOptions.push(obj);
            }
            this.initRemindCols();
            this.getFormSet();
        },
        computed: {
            getRecipient(){
                return function (item) {
                    if (item.recipient instanceof Array && item.recipient.length > 0) {
                        let name = "";
                        item.recipient.forEach((recipient, index) => {
                            if(item.recipient.length == index+1){
                                name = name.concat(recipient.name)
                            }else {
                                name = name.concat(recipient.name).concat("、")
                            }

                        })
                        return name;
                    } else {
                        return ""
                    }
                }
            },
            remindBoxConfig() {
                return function (key) {
                    if (key) {
                        return this.remindColsList.find((value, index, array) => {
                            return value.model == key;
                        });
                    } else {
                        return {};
                    }
                };
            },
        },
        methods:{
            getFormSet(){
                let _this = this;
                _this.formSet = {
                    id: null,
                    formId: _this.formId,
                    formSet: null
                }
                _this.$Get(_this.khConfig.api.queryFormSetByFormId + "/" + _this.formId, null).then(res => {
                    if (res.errCode === 0) {
                        if (res.data) {
                            _this.formSet.id = res.data.id;
                            _this.formSet.formId = res.data.formId;
                            if(_this.KHUtils.isNull(res.data.formSet)){
                                _this.formSet.formSet = {
                                    formRemind: [],
                                    condRemind:[],
                                    dataPermissions: {
                                        field:{
                                            name:"录入人员",
                                            model:"user_id"
                                        },
                                        groups:[]
                                    }
                                };
                            }else {
                                _this.formSet.formSet = JSON.parse(res.data.formSet);
                            }

                        } else {
                            _this.formSet.id = null;
                            _this.formSet.formId = _this.formId;
                            _this.formSet.formSet = {
                                formRemind: [],
                                condRemind:[],
                                dataPermissions: {
                                    field:{
                                        name:"录入人员",
                                        model:"user_id"
                                    },
                                    groups:[]
                                }
                            };
                        }



                    }
                })
            },
            //初始化表单提醒设置控件：目前可以支持日期类型控件和数字类型控件
            initRemindCols(){
                this.remindColsList = [];
                if(this.colsArray instanceof Array && this.colsArray.length >0){
                    this.colsArray.forEach((col,index)=>{
                        let type = col.type;
                        if(type == 'input_number' || type == 'input_int' || type == 'input_long' || type == 'number' || type == 'year' || type == 'month'
                            || type == 'year_month'  || type == 'date'  || type == 'time' || type == 'datetime' || type == 'input' || type == 'textarea' || type == 'input_mobile'
                            || type == 'input_tel' || type == 'input_mail'|| type == 'input_postal'|| type == 'input_website'|| type == 'radio'|| type == 'checkbox' || type == 'multiple_select'
                            || type == 'select'){
                            this.remindColsList.push(col);
                        }
                    })
                }
            },
            setformSelec(e, cond) {
                let box = this.remindBoxConfig(e);
                if(box){
                    cond.type = box.type;
                    let dataType;
                    let type = box.type
                    if (type.indexOf('int') >= 0 || type.indexOf('number') >= 0 || type.indexOf('long') >= 0 ) {
                        dataType = 'Number';
                    } else if (type === 'date') {
                        dataType = 'Date';
                    } else if (type === 'datetime') {
                        dataType = 'Date';
                    } else if (type === 'year_month') {
                        dataType = 'Date';
                    } else if (type === 'year') {
                        dataType = 'Date';
                    } else if (type === 'month') {
                        dataType = 'Date';
                    } else if (type === 'time') {
                        dataType = 'Date';
                    } else {
                        dataType = 'String';
                    }
                    cond.dataType = dataType;

                }
                cond.condType = '';
                cond.conds = [];
            },
            condTypeChange(val,itemCond){
                itemCond.conds = [];
               if(val == '0'){
                   itemCond.conds.push({matchType: '$eq', value: ''});
               }else if(val == '1' || val == '2'){
                   itemCond.conds.push({matchType: '$eq', value: ''});
                   itemCond.conds.push({matchType: '$eq', value: ''});
               }
            },

            addRemindCondition(conds){
                let condition = {
                    key:"",
                    type:"",
                    dataType:"",
                    condType:"0",
                    dateCond:{
                        type:"",
                        count:0
                    },
                    conds:[]
                };
              //  condition.conds.push({matchType: '$eq', value: ''});
                conds.push(condition);
            },
            deleteRemindCondition(conditions,index){
                conditions.splice(index,1);
            },
            //删除提醒
            deleteRemind(item, index){
                this.formSet.formSet.formRemind.splice(index, 1);
            },
            deleteCondRemind(item,index){
                this.formSet.formSet.condRemind.splice(index, 1);
            },
            selectRecipient(item){
                this.recipientVisible = true;
                this.currentRemind = item;
            },
            //新增提醒
            addRemind(){
                let newObj = {
                    recipient: {
                        type: "0",
                        role: [],
                        person: [],
                        model: "",
                        //leader: "1",
                        orgAndRole: [],
                        dyncUserAndRole: [],
                        //cuserOrgAndRole: [],
                        dyncOrgAndRole: [],
                        conditions: [],
                    },
                    defaultRecipient:[],
                    remind: {
                        remindType: "day",
                        remindDay: [],
                        remindTime: "09:00",
                        remindWay: ['1']
                    }
                }
                this.formSet.formSet.formRemind.push(newObj);
            },
            addCondRemind(){
                let newObj = {
                    recipient:{
                        type: "0",
                        role: [],
                        person: [],
                        model: "",
                        //leader: "1",
                        orgAndRole: [],
                        dyncUserAndRole: [],
                        //cuserOrgAndRole: [],
                        dyncOrgAndRole: [],
                        conditions: [],
                    },
                    defaultRecipient:[],
                    remind: {
                        remindWay: ['1'],
                        condType:"1",
                        condRelative:"and",
                        title:"",
                        content:"",
                        period:{
                            type:"day",
                            count:1
                        },
                        cond:[]
                    }
                };
                let condition = {
                    key:"",
                    type:"",
                    dataType:"",
                    dateCond:{
                        type:"",
                        count:0
                    },
                    condType:"",
                    conds:[]
                };
                //condition.conds.push({matchType: '$eq', value: ''});
                newObj.remind.cond.push(condition);
                if(!this.formSet.formSet.condRemind){
                    this.$set(this.formSet.formSet,'condRemind',[]);
                }
                this.formSet.formSet.condRemind.push(newObj);
            },
            remindTypeChange(item){
                let remindType = item.remind.remindType;
                item.remind.remindDay = [];
                if (remindType == "day") {

                } else if (remindType == "week") {
                    this.defaultOptions = this.weekOptions;
                } else if (remindType == "mouth") {
                    this.defaultOptions = this.mouthOptions;
                }
            },
            saveFormRemid(){

                console.log( this.formSet.formSet)
                var isError = false
                isError = this.formSet.formSet.condRemind.some((value)=>{

                  return Array.isArray(value.defaultRecipient)  && value.defaultRecipient.length == 0
                })
               console.log( isError)
                if(isError){
                    this.$notify({
                        title: '提示',
                        message: '请填写默认接收人',
                        type: 'warning'
                    });
                }else{
                    this.$PostJson(this.khConfig.api.saveFormRemindSet, this.formSet).then(res => {
                     this.$emit('closeDialog');
                        if (res.errCode === 0) {
                            this.$notify({
                                title: '成功',
                                message: '保存成功',
                                type: 'success'
                            });
                        }
                    })
                }


            },
            getCheckedNodesFromOrgUserTree(checkedNodes) {
                let _this = this;
                _this.currentRemind.recipient = [];
                _this.currentRemind.recipient = checkedNodes;
                _this.recipientVisible = false;
            },
            closeDialog(){
                this.$emit('closeDialog');
            },
            handleRemindCondTypeClick(remind){
                //清空条件
                remind.cond=[];
                this.addRemindCondition(remind.cond);
            }
        }
    }
</script>

<style  lang="scss" scoped>
    .center-vertical{
        position: relative;
        top:23%;
        width: 80px;
        transform:translateY(-43%);
    ::v-deep .el-input__suffix{
               visibility: hidden;
           }
    ::v-deep .el-input--mini .el-input__inner{
               height: 28px;
               line-height: 28px;
               width: 100%;
               padding: 0px;
               border: 0px;
               background-color:#FAFAFA ;
           }
    }
    .center-vertical-bottom{
        position: relative;
        top:23%;
        transform:translateY(-43%);
    }
    .title-label{
        font-size: 16px;
        margin-right: 20px;
    }

    .content-body-item {
        display: flex;
        flex-direction: row;
        margin-top: 0px;
    }
</style>
