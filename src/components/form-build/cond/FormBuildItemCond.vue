<template>
    <el-form-item :label="box.name" :prop="box.model">
        <!--除时间外其他控件选择范围查询-->
        <template v-if="box.type === 'input_range'">
            <el-input
                type="string"
                v-model="bValue"
                style="width :37%"
            ></el-input>
            ~
            <el-input
                type="string"
                v-model="eValue"
                style="width :38%"
            ></el-input>
        </template>
        <!--时间选择范围查询-->
        <template v-if="box.type === 'datetime_range'">
            <el-date-picker
                style="width:100%"
                v-model="dataModel"
                :unlink-panels="true"
                size="mini"
                type="datetimerange"
                range-separator="~"
                start-placeholder=""
                end-placeholder=""
                align="right">
            </el-date-picker>
        </template>
        <template
            v-if="box.type === 'input' || box.type === 'region_select' || box.type === 'gis_select' || box.type === 'data_select'  || box.type === 'org_select' || box.type ==='user_select' || box.type === 'company_select' || box.type === 'role_select' || box.type === 'dic_select'">
            <el-input
                v-if="box.options.dataType === 'number' || box.options.dataType === 'integer' || box.options.dataType === 'float'"
                :type="box.options.dataType"
                v-model.number="dataModel"
                :placeholder="box.options.placeholder"
                :disabled="box.options.disabled"
            ></el-input>
            <el-input
                v-else
                :type="box.options.dataType"
                v-model="dataModel"
                :disabled="box.options.disabled"
                :placeholder="box.options.placeholder"
            ></el-input>
        </template>
        <template
            v-if="box.type==='input_number' || box.type==='input_int' || box.type==='input_long'
             || box.type==='input_mobile' || box.type==='input_tel' || box.type==='input_mail' || box.type==='input_postal' || box.type==='input_website'">
            <el-input
                v-model="dataModel"
                controls-position="right"
                :disabled="box.options.disabled"
                :placeholder="box.options.placeholder"
            ></el-input>
        </template>
        <template v-if="box.type === 'textarea'">
            <el-input type="textarea" :rows="5"
                      v-model="dataModel"
                      :disabled="box.options.disabled"
                      :placeholder="box.options.placeholder"
            ></el-input>
        </template>
        <template v-if="box.type === 'number'">
            <el-input-number
                v-model="dataModel"
                :step="box.options.step"
                controls-position="right"
                :disabled="box.options.disabled"
                :max="box.options.max"
                :min="box.options.min"
            ></el-input-number>
        </template>
        <template v-if="box.type === 'radio'">
            <el-radio-group v-model="dataModel"
            
                            :disabled="box.options.disabled">
                <el-radio
                    :style="{display: box.options.inline ? 'inline-block' : 'block'}"
                    :label="item.value"
                    v-for="(item, index) in (!box.options.remote ? box.options.remoteOptions : box.options.options)"
                    :key="index">
                    <template v-if="!box.options.remote">{{item.label}}</template>
                    <template v-else>{{box.options.showLabel ? item.label : item.value}}</template>
                </el-radio>
            </el-radio-group>
        </template>
        <template v-if="box.type === 'checkbox'">
            <el-checkbox-group v-model="dataModel"
                               :disabled="box.options.disabled">
                <el-checkbox
                    :style="{display: box.options.inline ? 'inline-block' : 'block'}"
                    :label="item.value"
                    v-for="(item, index) in (!box.options.remote ? box.options.remoteOptions : box.options.options)"
                    :key="index">
                    <template v-if="!box.options.remote">{{item.label}}</template>
                    <template v-else>{{box.options.showLabel ? item.label : item.value}}</template>
                </el-checkbox>
            </el-checkbox-group>
        </template>
        <template v-if="box.type === 'time'">
            <el-time-picker
                v-model="dataModel"
                :is-range="box.options.isRange"
                :placeholder="box.options.placeholder"
                :start-placeholder="box.options.startPlaceholder"
                :end-placeholder="box.options.endPlaceholder"
                :readonly="box.options.readonly"
                :disabled="box.options.disabled"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :arrowControl="box.options.arrowControl"
                :value-format="box.options.format"
            >
            </el-time-picker>
        </template>
        <template
            v-if="box.type === 'date' || box.type === 'year' || box.type === 'month' || box.type === 'year_month'">
            <el-date-picker
                v-model="dataModel"
                :type="box.options.type"
                :placeholder="box.options.placeholder"
                :start-placeholder="box.options.startPlaceholder"
                :end-placeholder="box.options.endPlaceholder"
                :readonly="box.options.readonly"
                :disabled="box.options.disabled"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :value-format="box.options.timestamp ? 'timestamp' : box.options.format"
                :format="box.options.format"
            >
            </el-date-picker>
        </template>
        <template v-if="box.type === 'datetime'">
            <el-date-picker
                v-model="dataModel"
                type="datetime"
                :placeholder="box.options.placeholder"
                :start-placeholder="box.options.startPlaceholder"
                :end-placeholder="box.options.endPlaceholder"
                :readonly="box.options.readonly"
                :disabled="box.options.disabled"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :value-format="box.options.timestamp ? 'timestamp' : box.options.format"
                :format="box.options.format"
            >
            </el-date-picker>
        </template>
        <template v-if="box.type === 'select'">
            <el-select
                popper-class="custom-select"
                v-model="dataModel"
                :disabled="box.options.disabled"
                :multiple="box.options.multiple"
                clearable
                :placeholder="box.options.placeholder"
                :filterable="box.options.filterable"
                value="">
                <el-option
                    v-for="item in (!box.options.remote ? box.options.remoteOptions : box.options.options)"
                    :key="item.value" :value="item.value"
                    :label="box.options.showLabel || !box.options.remote?item.label:item.value"></el-option>
            </el-select>
        </template>
        <template v-if="box.type === 'multiple_select'">
            <el-select
                v-model="dataModel"
                :disabled="box.options.disabled"
                :multiple="box.options.multiple"
                clearable
                :placeholder="box.options.placeholder"
                :filterable="box.options.filterable"
                value="">
                <el-option
                    v-for="item in (!box.options.remote ? box.options.remoteOptions : box.options.options)"
                    :key="item.value" :value="item.value"
                    :label="box.options.showLabel || !box.options.remote?item.label:item.value"></el-option>
            </el-select>
        </template>
        <template v-if="box.type === 'switch'">
            <el-select v-model="dataModel" clearable placeholder="请选择" style="width: 100px" value="">
                <el-option label="全部" value="" key=""></el-option>
                <el-option :label="box.options.openMsg" value="0" key="0"></el-option>
                <el-option :label="box.options.closeMsg" value="1" key="1"></el-option>
            </el-select>
        </template>
        <!--查询按钮-->
        <template v-if="box.type === 'query'">
            <el-button type="primary" icon="search" id="query" @click="queryByCond">查询</el-button>
            <el-button type="info" icon="search" @click="resetCond">重置</el-button>
        </template>
    </el-form-item>
</template>

<script>
    
    export default {
        name: "FormBuildItemCond", // 查询条件渲染
        // box: 控件配置; (必填)
        // models: 表单填写的值{input_01:1,text_01:"111"}; (必填)
        // remote: 下拉框、单选框等远程获取数据的方法名称 (非必填)
        props: ['box', 'models', 'remote', 'notifyReset'],
        data() {
            return {
                dataModel: this.models[this.box.model],
                bValue: '',
                eValue: ''
            }
        },
        created() {
            // 开关控件处理
            if (this.box.type === 'switch' && !(this.dataModel instanceof String)) {
                this.dataModel = "";
            }
        },
        watch: {
            dataModel: {
                deep: true,
                handler(val) {
                    this.models[this.box.model] = val;
                    this.$emit('update:models', {
                        ...this.models,
                        [this.box.model]: val
                    });
                }
            },
            // 解决在编辑时,修改了一些字段后，删除图片或附件,之前修改的值会恢复到修改之前的缺陷修复;
            /*        models: {
                        deep: true,
                        handler(val) {
                            this.dataModel = val[this.box.model];
                        }
                    },*/
            bValue: {
                deep: true,
                handler(val) {
                    this.dataModel = val + "&nbsp" + this.eValue;
                }
            },
            eValue: {
                deep: true,
                handler(val) {
                    this.dataModel = this.bValue + "&nbsp" + val;
                }
            },
            notifyReset: {
                deep: true,
                handler() {
                    if (this.box.type === 'switch') {
                        this.dataModel = "";
                    }
                    if (this.box.type === 'input_range') {
                        this.eValue = "";
                        this.bValue = "";
                    }
                }
            },
        },
        methods: {
            // 点击查询按钮查询
            queryByCond() {
                this.$emit('queryByCond', true);
            },
            // 点击重置按钮
            resetCond() {
                this.$emit('resetCond', true);
            }
        }
    }
</script>
<style lang="scss" scoped>
</style>
