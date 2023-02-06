<template>
    <!--当子表单数据以批量的方式提交或者控件为文字类型时,不显示Label-->
    <el-form-item :label="box.type!=='text' ? box.name : ''" :prop="box.model">
        <template v-if="box.type === 'region_select'">
            <v-region :city="true" v-model="dataModel" class="form-control" :disabled="true"></v-region>
        </template>
        <template v-if="box.type === 'gis_select'">
            <el-input
                v-model="address"
                :disabled="true"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
            ></el-input>
        </template>
        <template v-if="box.type === 'text'">
            <span>{{box.options.defaultValue}}</span>
        </template>
        <template v-if="box.type === 'current_user'">
            <span>{{ dataModel[box.label_model]}}</span>
            <!-- <el-input
              v-model="user.realName"
              :style="{ width: box.options.width }"
              :placeholder="box.options.placeholder"
              :disabled="box.options.disabled"
            ></el-input> -->
        </template>
        <template
            v-if="box.type === 'data_select'  || box.type === 'org_select' || box.type === 'user_select' || box.type === 'company_select'
             || box.type === 'role_select' || box.type === 'dic_select' ">
            <el-input
                v-model="dataModel === '' || dataModel === undefined || dataModel === null? '' :dataModel[box.label_model]"
                :disabled="true"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
            ></el-input>
        </template>
        <template
            v-if="box.type === 'm_data_select'  || box.type === 'm_org_select' || box.type === 'm_user_select' || box.type === 'm_company_select'
             || box.type === 'm_role_select' || box.type === 'm_dic_select' ">
            <el-input
                :value="dataModel | arrayJsonVal"
                :disabled="true"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
            ></el-input>
            <!-- {{dataModel}} -->
        </template>
        <template v-if="box.type === 'input'">
            <el-input
                v-if="box.options.dataType === 'number' || box.options.dataType === 'integer' || box.options.dataType === 'float'"
                :type="box.options.dataType"
                v-model.number="dataModel"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
                :disabled="true"
            ></el-input>
            <el-input
                v-else
                :type="box.options.dataType"
                v-model="dataModel"
                :disabled="true"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
            ></el-input>
        </template>
        <template
            v-if="box.type==='input_number' || box.type==='input_int' || box.type==='input_long'
             || box.type==='input_mobile' || box.type==='input_tel' || box.type==='input_mail' || box.type==='input_postal' || box.type==='input_website'">
            <el-input
                v-model="dataModel"
                :style="{width: box.options.width}"
                controls-position="right"
                :disabled="true"
                :placeholder="box.options.placeholder"
            ></el-input>
        </template>
        <template v-if="box.type === 'textarea'">
            <el-input type="textarea" :rows="5"
                      v-model="dataModel"
                      :disabled="true"
                      :placeholder="box.options.placeholder"
                      :style="{width: box.options.width}"
            ></el-input>
        </template>
        <template v-if="box.type === 'number'">
            <el-input-number
                v-model="dataModel"
                :style="{width: box.options.width}"
                :step="box.options.step"
                controls-position="right"
                :disabled="true"
                :max="box.options.max"
                :min="box.options.min"
            ></el-input-number>
        </template>
        <template v-if="box.type === 'radio'">
            <el-radio-group v-model="dataModel"
                            :style="{width: box.options.width}"
                            :disabled="true">
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
                               :style="{width: box.options.width}"
                               :disabled="true">
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
                :disabled="true"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :arrowControl="box.options.arrowControl"
                :value-format="box.options.format"
                :style="{width: box.options.width}"
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
                :disabled="true"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :value-format="box.options.timestamp ? 'timestamp' : box.options.format"
                :format="box.options.format"
                :style="{width: box.options.width}"
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
                :disabled="true"
                :editable="box.options.editable"
                :clearable="box.options.clearable"
                :value-format="box.options.timestamp ? 'timestamp' : box.options.format"
                :format="box.options.format"
                :style="{width: box.options.width}"
            >
            </el-date-picker>
        </template>
        <template v-if="box.type === 'select'">
            <el-select
                popper-class="custom-select"
                v-model="dataModel"
                :disabled="true"
                :multiple="box.options.multiple"
                clearable
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
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
                :disabled="true"
                :multiple="box.options.multiple"
                clearable
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
                :filterable="box.options.filterable"
                value="">
                <el-option
                    v-for="item in (!box.options.remote ? box.options.remoteOptions : box.options.options)"
                    :key="item.value" :value="item.value"
                    :label="box.options.showLabel || !box.options.remote?item.label:item.value"></el-option>
            </el-select>
        </template>
        <template v-if="box.type === 'switch'">
            <el-switch
                v-model="dataModel"
                :disabled="true"
            >
            </el-switch>
        </template>
        <template v-if="box.type === 'slider'">
            <el-slider
                v-model="dataModel"
                :min="box.options.min"
                :max="box.options.max"
                :disabled="true"
                :step="box.options.step"
                :show-input="box.options.showInput"
                :range="box.options.range"
                :style="{width: box.options.width}"
            ></el-slider>
        </template>
        <template v-if="box.type === 'signature'">
            <div class="demo-image"
            >
                <div class="demo-image-box"  >
                    <el-image
                        v-show="dataModel"
                        style="width:100%;height: 200px;"
                        fit="contain"
                        :src="khConfig.host.rest + khConfig.api.imageDownload + '/' +dataModel"
                        :preview-src-list="srcObj[box.model]"
                    ></el-image>

                </div>
            </div>
        </template>
        <template v-if="box.type === 'file_upload' || box.type === 'image_upload'">
            <div class="demo-image"
                 v-if="box.type === 'image_upload' && dataModel !== undefined && dataModel instanceof Array">
                <div class="demo-image-box" v-for="url in dataModel">
                    <el-image style=""
                              :src="url"
                              :preview-src-list="srcObj[box.model]"
                    ></el-image>
                </div>
            </div>
            <div v-if="box.type === 'file_upload' && dataModel instanceof Array" style="width: 100%">
                <ul class="el-upload-list el-upload-list--text">
                    <li tabindex="0" class="el-upload-list__item is-success" v-for="(file,index) in fileObj[box.model]">
                        <el-col :span="1" style="margin-top: 2%">
                            <img v-if="file.fileSuffix && file.fileSuffix.startsWith('doc')" alt=" "
                                 src="../../../assets/images/word.png" @click="downLoadFile(file.fileId)"/>
                            <img v-if="file.fileSuffix && file.fileSuffix.startsWith('xls')" alt=" "
                                 src="../../../assets/images/excel.png" @click="downLoadFile(file.fileId)"/>
                            <img v-if="file.fileSuffix && file.fileSuffix.startsWith('ppt')" alt=" "
                                 src="../../../assets/images/ppt.png" @click="downLoadFile(file.fileId)"/>
                            <img
                                v-if="!file.fileSuffix || (file.fileSuffix && !file.fileSuffix.startsWith('doc') && !file.fileSuffix.startsWith('xls') && !file.fileSuffix.startsWith('ppt'))"
                                alt=" " src="../../../assets/images/others.png" @click="downLoadFile(file.fileId)"/>
                        </el-col>
                        <el-col :span="23">
                            <p style="font-size: 10px">{{file.fileName}}</p>
                            <p style="font-size: 10px;position: relative;bottom: 15px;">
                                <a href="#" @click="downLoadFile(file.fileId)">下载</a>
                                <a href="#" @click="previewFile(file.fileId)">预览</a>
                            </p>
                        </el-col>
                    </li>
                </ul>
            </div>
        </template>
        <template v-if="box.type === 'cascade'">
            <el-cascader
                v-model="dataModel"
                :disabled="true"
                :clearable="box.options.clearable"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
                :options="box.options.remoteOptions"
            >
            </el-cascader>
        </template>
        <template v-if="box.type === 'm_data_ref'">
            <m-data-ref-widget :formId="formId" :dataModel.sync="dataModel" :box="box"></m-data-ref-widget>
        </template>
        <template v-if="box.type === 'calculate_formula'">
            <calculate-formula-widget :dataModel.sync="dataModel" :box="box" :models="models" :style="{ width: box.options.width }"></calculate-formula-widget>
        </template>

    </el-form-item>
</template>

<script>
    import {mapGetters} from 'vuex';
    import MDataRefWidget from "@/components/form-widget/MDataRefWidget.vue";
    import CalculateFormulaWidget from "@/components/form-widget/CalculateFormulaWidget.vue";
    export default {
        name: "RestructureFormBuildItemProcess", // 审批记录查看时渲染
        // box: 控件配置; (必填)
        // models: 表单填写的值{input_01:1,text_01:"111"}; (必填)
        // rules: 控件校验规则; (必填)
        props: ['box', 'models', 'rules','formId'],
        components: {
            MDataRefWidget,
            CalculateFormulaWidget
        },
        data() {
            return {
                dataModel: this.models[this.box.model],
                srcObj: {},
                fileObj: {},
                address: '',
            }
        },
        created() {
            let _this = this;
            // 编辑GIS控件地图初始化处理
            if (this.box.type === 'gis_select') {
                if (!this.KHUtils.isNull(this.dataModel)) {
                    _this.address = this.dataModel[_this.box.modelExt.address];
                }
            }
            // 图片的预览处理
            if (this.box.type === 'image_upload') {
                this.srcObj[this.box.model] = [];
                if (!this.KHUtils.isNull(this.dataModel) && this.dataModel instanceof Array) {
                    this.dataModel.forEach(obj => {
                        this.srcObj[this.box.model].push(obj);
                    })
                }
            }
            // 文件的处理
            if (this.box.type === 'file_upload') {
                let _this = this;
                if (!_this.KHUtils.isNull(_this.dataModel)) {
                    _this.fileObj[_this.box.model] = [];
                    if (_this.dataModel instanceof Array) {
                        _this.dataModel.forEach(fileId => {
                            getFileInfo(_this, fileId);
                        })
                    }

                    function getFileInfo(_this, fileId) {
                        // 查询文件的详细信息
                        let xhr;
                        if (window.ActiveXObject) {
                            xhr = new ActiveXObject("Microsoft.XMLHTTP");
                        } else {
                            xhr = new XMLHttpRequest();
                        }
                        // 原生Ajax同步请求
                        xhr.open("GET", _this.khConfig.host.rest + _this.khConfig.api.getFileInfo + "/" + fileId, false);
                        xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                        xhr.onreadystatechange = function () {
                            if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                                let res = JSON.parse(xhr.responseText);
                                if (res.errCode === 0) {
                                    let newObj = {};
                                    newObj.fileName = res.originalName;
                                    newObj.fileId = res.fileId;
                                    newObj.fileSuffix = res.suffix;
                                    _this.fileObj[_this.box.model].push(newObj);
                                }
                            }
                        };
                        // 传递参数
                        xhr.send();
                    }
                }
            }
            if(_this.box.type === 'current_user'){
                if(_this.KHUtils.isNull( _this.dataModel)){
                    _this.dataModel = {};
                    _this.dataModel[this.box.model] = _this.user.id;
                    _this.dataModel[this.box.label_model] = _this.user.realName;
                }else {
                    if( _this.dataModel instanceof Object){
                        if(_this.KHUtils.isNull(_this.dataModel[this.box.label_model])){
                            _this.dataModel = {};
                            _this.dataModel[this.box.model] = _this.user.id;
                            _this.dataModel[this.box.label_model] = _this.user.realName;
                        }
                    }
                }

            }
            if (_this.box.type === "calculate_formula") {
                _this.box.options.disabled = true;
                let value =  _this.models[_this.box.model];
                if(_this.KHUtils.isNull(value)){
                    _this.dataModel = null;
                }
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
        },
        computed: mapGetters({
            user: 'getUserInfo'
        }),
        methods: {
            // 下载文件
            downLoadFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.warning("下载失败,未上传任何文件");
                    return false;
                }
                this.$OpenUrl(this.khConfig.host.rest + this.khConfig.api.fileDownload + "/" + fileId);
            },
            // 在线预览
            previewFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.error("预览失败,未上传任何文件");
                    return false;
                }
                window.open(this.khConfig.host.basePath + "/static/wps.html?_w_fileId=" + fileId + "&_w_type=read");
            },
        }
    }
</script>
<style lang="scss">
    .form-control {
        div.rg-select div.rg-select__el div.rg-select__content {
            padding: 0 30px 0 15px;
        }
    }
</style>
<style lang="scss" scoped>
    @font-face {
        font-family: 'iconfont';
        src: url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.eot');
        src: url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.woff') format('woff'),
        url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.svg#iconfont') format('svg');
    }

    .demo-image .demo-image-box {
        padding: 10px;
        position: relative;

        .iconfont {
            background-color: $primary-color;
            position: relative;
            bottom: 2px;
            right: 20px;
            font-size: 16px;
            cursor: pointer;
            color: #ffffff;
            z-index: 4;
        }

        .el-image {
            width: 100px;
            height: 100px;
            outline: 1px solid $primary-color;
            border: 1px solid $primary-color;
        }
    }
    ::v-deep .el-input{
        min-width: 60px;
    }
</style>
