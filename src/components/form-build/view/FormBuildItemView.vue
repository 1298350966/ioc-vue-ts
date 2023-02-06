<template>
    <!--当子表单数据以批量的方式提交或者控件为文字类型时,不显示Label-->
    <el-form-item :label="box.type!=='text' ? box.name : ''" :prop="box.model">
        <template v-if="box.type === 'region_select'">
            <v-region @values="regionChange" :city="true" v-model="dataModel" class="form-control"
                      :disabled="true"></v-region>
        </template>
        <template v-if="box.type === 'gis_select'">
            <el-input
                @focus="gisVisible = true"
                clearable
                @clear="clearDataModel"
                v-model="address"
                :disabled="true"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
            ></el-input>
            <el-dialog title="地图定位"
                       :visible.sync="gisVisible"
                       :close-on-click-modal="closeOnClickModal"
                       :close-on-press-escape="closeOnClickModal"
                       width="60%"
                       append-to-body
                       @close="handlerGisClose">
                <Gis :gisType="box.options.gisType" :from-parent-gis-obj="editGisObj"
                            :gis-init-obj="gisInitObj"
                            @recGisMsg="recGisMsg"
                            :child-resp="notifyChild"></Gis>
            </el-dialog>
        </template>
        <template v-if="box.type === 'text'">
            <span>{{box.options.defaultValue}}</span>
        </template>
        <template
            v-if="box.type === 'data_select'  || box.type === 'org_select' || box.type === 'user_select' || box.type === 'company_select'
             || box.type === 'role_select' || box.type === 'dic_select' ">
            <el-input
                @focus="loadSelectData"
                clearable
                @clear="clearDataModel"
                v-model="dataModel === '' || dataModel === undefined || dataModel === null ? '' :dataModel[box.label_model]"
                :disabled="true"
                :placeholder="box.options.placeholder"
                :style="{width: box.options.width}"
            ></el-input>
            <el-dialog :title="box.options.maps.title" :visible.sync="selectDialogVisible"
                       :close-on-click-modal="closeOnClickModal"
                       custom-class="select-tree-dialog" append-to-body>
                <el-row v-if="box.options.displayModel === 'tree'">
                    <el-input
                        :placeholder="box.label_name"
                        v-model="filterText" style="width: 50%">
                    </el-input>
                    <el-tree
                        :props="box.options.props"
                        :load="loadNode"
                        :filter-node-method="filterNode"
                        lazy
                        show-checkbox
                        check-strictly
                        ref="tree">
                    </el-tree>
                </el-row>
                <el-row v-if="box.options.displayModel === 'table' && colsArray.length > 0">
                    <el-input style="width: 160px;" :placeholder="box.type=== 'user_select' ? '用户名' :box.label_name"
                              prefix-icon="el-icon-search" v-model="keywords" @blur="getDataSource"></el-input>
                    <el-table
                        :data="tableData"
                        v-loading="tableDataLoading"
                        tooltip-effect="dark"
                        @selection-change="handleSelectionChange"
                        style="width: 96%"
                    >
                        <el-table-column type="selection" width="55px" :props="box.options.maps.key"
                                         fixed></el-table-column>
                        <el-table-column label="序号" width="60px" type="index" fixed>
                        </el-table-column>
                        <template v-for='(col) in colsArray'>
                            <el-table-column
                                sortable
                                :prop="col.model"
                                :label="col.name"
                                :key="col.model"
                            >
                            </el-table-column>
                        </template>
                    </el-table>
                    <p style="width: 96%;margin: 0 auto">
                        <el-pagination
                            layout="prev, pager, next"
                            :current-page="queryCommonDataParam.pageNum"
                            @current-change="handleCurrentChange"
                            :total="totalPage" style="float: right">
                        </el-pagination>
                    </p>
                </el-row>
                <div slot="footer" class="dialog-footer" style="position: relative;left: -4%;">
                    <el-button type="primary" @click.native="handleSave">保存</el-button>
                </div>
            </el-dialog>
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
            v-if="box.type==='input_number'  || box.type==='input_int' || box.type==='input_long'
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
                            :disabled="true" @change="controlShow">
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
                @change="controlShow"
                popper-class="custom-select"
                :popper-append-to-body="closeOnClickModal"
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
                :popper-append-to-body="closeOnClickModal"
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
        <template v-if="box.type === 'file_upload' || box.type === 'image_upload'">
            <!--            <el-input v-model="dataModel" :hidden="true" style="width: 1px;float:left"
                                  v-if="box.options.required"></el-input>
                        <el-upload
                            class="upload-demo"
                            :action="this.khConfig.host.rest+box.options.action"
                            :disabled="true"
                            :multiple="box.options.multiple"
                            :file-list="box.options.fileList"
                            :limit="box.options.length"
                            :on-exceed="handleExceed"
                            :on-success="uploadCall"
                            :on-remove="uploadRemove"
                            :before-upload="beforeUpload"
                        >
                            <el-button size="small" type="primary" v-if="box.type === 'image_upload'">图片上传</el-button>
                            <el-button size="small" type="primary" v-if="box.type === 'file_upload'">附件上传</el-button>
                            <div slot="tip" class="el-upload__tip" v-if="box.type === 'image_upload'">
                                只能上传jpg/png文件，且不超过{{box.options.maxFileSize}}M
                            </div>
                            <div slot="tip" class="el-upload__tip" v-if="box.type === 'file_upload'">
                                上传的附件大小不允许超过{{box.options.maxFileSize}}M
                            </div>
                        </el-upload>-->
            <div class="demo-image"
                 v-if="!addOrEdit && box.type === 'image_upload' && dataModel !== undefined && dataModel instanceof Array">
                <div class="demo-image-box" v-for="url in dataModel" >
                    <el-image style=""
                              :src="url"
                              :preview-src-list="srcObj[box.model]"
                    ></el-image>
                    <i class="iconfont" @click="deleteFile(url)"
                       style="">
                        &#xe635;
                    </i>
                </div>
            </div>
            <div v-if="!addOrEdit && box.type === 'file_upload' && dataModel instanceof Array" style="width: 50%">
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
                                <a href="#" @click="editFile(file.fileId)">在线编辑</a>
                                <a href="#" @click="deleteFile(file.fileId)">删除</a>
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
    </el-form-item>
</template>

<script>
    import Gis from '@/components/gis/Gis';
    import {mapGetters} from 'vuex'
    
    export default {
        name: "FormBuildItemView",
        // box: 控件配置; (必填)
        // models: 表单填写的值{input_01:1,text_01:"111"}; (必填)
        // rules: 控件校验规则; (必填)
        // addOrEdit: 区分当前表单新增Or编辑,true:新增; (必填)
        // remote: 下拉框、单选框等远程获取数据的方法名称 (非必填)
        props: ['box', 'models', 'rules', 'addOrEdit', 'remote'],
        components: {
            Gis
        },
        data() {
            return {
                filterText: '',
                keywords: "", // 搜索关键字
                colsArray: [],
                totalPage: 0,
                queryCommonDataParam: {
                    pageNum: 1,    // 查询参数
                    pageSize: 10
                },
                tableData: [],
                tableDataLoading: false,
                selectTableData: [], // 被选择的列表数据
                notifyChild: 0,     // gis 地图
                gisVisible: false,
                gisInitObj: {},
                editGisObj: {},  // 编辑GIS
                selectDialogVisible: false,
                closeOnClickModal: false,
                dataModel: this.models[this.box.model],
                srcObj: {},
                fileObj: {},
                bValue: '',
                eValue: '',
                address: '',
                regionObj: {
                    province: '130000',
                    city: '130500',
                    area: '130523',
                    town: '350104008'
                },
                selected: {province: "130000", city: "130500", area: "130523", town: ''}
            }
        },
        created() {
            let _this = this;
            // 编辑GIS控件地图初始化处理
            if (_this.box.type === 'gis_select') {
                if (!_this.KHUtils.isNull(_this.dataModel)) {
                    _this.address = _this.dataModel[_this.box.modelExt.address];
                    let tempDataModel = _this.KHUtils.clone(_this.dataModel);
                    _this.editGisObj = {};
                    let tempObj = {};
                    tempObj.lat = tempDataModel[_this.box.modelExt.lat];
                    tempObj.lnt = tempDataModel[_this.box.modelExt.lnt];
                    tempObj.address = tempDataModel[_this.box.modelExt.address];
                    _this.editGisObj = tempObj;
                }
            }
            if (_this.box.type === 'region_select') {
                if (_this.KHUtils.isNull(_this.dataModel)) {
                    _this.dataModel = {};   // 解决新增行政区划时,数据绑定类型不匹配的问题
                }
            }
            // 图片的预览处理
            if (_this.box.type === 'image_upload') {
                _this.srcObj[_this.box.model] = [];
                if (!_this.KHUtils.isNull(_this.dataModel)) {
                    _this.dataModel.forEach(obj => {
                        _this.srcObj[_this.box.model].push(obj);
                    })
                }
            }
            // 文件的处理
            if (_this.box.type === 'file_upload') {
                if (!_this.KHUtils.isNull(_this.dataModel)) {
                    _this.fileObj[_this.box.model] = [];
                    _this.dataModel.forEach(obj => {
                        // 查询文件的详细信息
                        let xhr;
                        if (window.ActiveXObject) {
                            xhr = new ActiveXObject("Microsoft.XMLHTTP");
                        } else {
                            xhr = new XMLHttpRequest();
                        }
                        // 原生Ajax同步请求
                        xhr.open("GET", _this.khConfig.host.rest + _this.khConfig.api.getFileInfo + "/" + obj, false);
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
                    })
                }
            }
            // Gis定位
            if (_this.box.type === 'gis_select') {
                _this.gisInitObj = {};
                if (!_this.KHUtils.isNull(_this.box.options.city)) {
                    _this.gisInitObj.gisInitCity = _this.box.options.city;
                } else {
                    _this.gisInitObj[_this.box.model].gisInitCity = '南昌';
                }
                if (!_this.KHUtils.isNull(_this.box.options.zoom)) {
                    _this.gisInitObj.gisInitZoom = _this.box.options.zoom;
                } else {
                    _this.gisInitObj.gisInitCity = 13;
                }
                if (!_this.KHUtils.isNull(_this.box.options.lat) && !_this.KHUtils.isNull(_this.box.options.lnt)) {
                    _this.gisInitObj.gisInitLat = _this.box.options.lat;
                    _this.gisInitObj.gisInitLng = _this.box.options.lnt;
                } else {
                    _this.gisInitObj.gisInitLat = 28.683016;
                    _this.gisInitObj.gisInitLng = 115.857963;
                }
            }
            // 通用数据选择控件
            if (_this.box.type === 'data_select' || _this.box.type === 'org_select' || _this.box.type === 'user_select' || _this.box.type === 'company_select' || _this.box.type === 'role_select' || _this.box.type === 'dic_select') {
                if (_this.dataModel instanceof Object) {
                    if (_this.box.options.displayModel === 'table') {
                        _this.queryCommonDataParam.condition = _this.dataModel[_this.box.label_model];  // 编辑状态时，初始化列表搜索字段的值,
                    }
                }
            }
            // 企业选择控件
            if (_this.box.type === 'company_select') {
                let userType = _this.user.userType;
                if (!_this.KHUtils.isNull(userType) && userType === '1') {
                    // 0:政府用户; 1:企业用户
                    _this.box.options.disabled = true;
                    _this.$Get(_this.khConfig.api.getCompanyInfoByUserId, {})
                        .then(res => {
                            if (res.errCode === 0) {
                                _this.dataModel = {};
                                _this.dataModel[_this.box.model] = res.companyInfo.id;
                                _this.dataModel[_this.box.label_model] = res.companyInfo.companyName;
                            }
                        })
                }
            }
        },
        watch: {
            filterText(val) {
                if (this.box.options.displayModel === 'tree') {
                    this.$refs.tree.filter(val);
                }
            },
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
            }
        },
        computed: mapGetters({
            user: 'getUserInfo'
        }),
        methods: {
            // 通用数据、组织、用户等控件清空input框提交时,一并将绑定的dataModel也清空
            clearDataModel() {
                let _this = this;
                deep(_this.dataModel);
                
                function deep(obj) {
                    for (let k in obj) {
                        obj[k] = '';
                        if (obj[k] instanceof Object) {
                            deep(obj[k])
                        }
                    }
                }
            },
            // 通用数据,组织,用户等控件加载选择项数据
            loadSelectData() {
                let _this = this;
                if (_this.box.options.displayModel === 'table') {
                    _this.getDataSource();
                } else {
                    if (_this.KHUtils.isNull(_this.box.options.remoteUrl)) {
                        _this.$notify.warning({
                            title: '警告',
                            message: '接口地址为空',
                        });
                        return false;
                    }
                    let param = {};
                    if (_this.box.type === 'user_select' || _this.box.type === 'company_select') {
                        param.pageSize = 10000000;
                        param.pageNum = 1;
                    } else if (_this.box.type === 'dic_select') {
                        param.typeCode = this.box.typeCode;
                        param.parentId = null;
                    } else {
                        param.parentId = null;
                    }
                    this.$Get(_this.box.options.remoteUrl, param).then(res => {
                        if (res.errCode === 0) {
                            if (_this.box.type === 'data_select' || _this.box.type === 'company_select') {
                                _this.tableData = res.datas;  // 通用数据特殊化处理;
                            } else {
                                _this.tableData = res.list;
                            }
                            if (!_this.KHUtils.isNull(_this.tableData)) {
                                _this.selectDialogVisible = true;
                            }
                        }
                    });
                }
            },
            // 树形展示搜索
            filterNode(value, data) {
                if (!value) return true;
                return data[this.box.options.maps.name].indexOf(value) !== -1;
            },
            // 通用数据树形展示
            loadNode(node, resolve) {
                let _this = this;
                if (!_this.box.options.remoteUrl || _this.KHUtils.isNull(this.box.options.remoteUrl)) {
                    return false;
                }
                if (node.level === 0) {
                    return resolve(_this.tableData);
                }
                if (this.box.type === 'data_select' || this.box.type === 'user_select' || this.box.type === 'role_select' || this.box.type === 'company_select') {
                    return resolve([]); // 无上下级关系
                } else {
                    let param = {};
                    if (this.box.type === 'dic_select') {
                        param.parentId = node.data.id; // 数据字典的特殊化处理,选择时带出code,name;
                    } else {
                        param.parentId = node.data[this.box.options.maps.key];
                    }
                    this.$Get(this.box.options.remoteUrl, param).then(res => {
                        if (res.errCode === 0) {
                            return resolve(res.list);
                        }
                    });
                }
            },
            // 通用数据控件数据源查询
            getDataSource() {
                let _this = this;
                if (!_this.box.options.remoteUrl || _this.KHUtils.isNull(this.box.options.remoteUrl)) {
                    _this.$notify.warning({
                        title: '警告',
                        message: '未选择任何的数据配置项',
                    });
                    return false;
                }
                if (_this.box.type === 'user_select') {
                    _this.queryCommonDataParam.wd = _this.keywords;
                } else {
                    _this.queryCommonDataParam.condition = _this.keywords;
                }
                _this.tableDataLoading = true;
                _this.$Get(_this.box.options.remoteUrl, _this.queryCommonDataParam).then(res => {
                    if (res.errCode === 0) {
                        _this.totalPage = res.totalCount;
                        // 展示形式为表格
                        if (_this.box.options.displayModel === 'table') {
                            if (res.desc) {
                                _this.colsArray = [];
                                let dataObj = res.desc;
                                Object.keys(dataObj).forEach(function (key) {
                                    let newObj = {};
                                    newObj.name = dataObj[key];
                                    newObj.model = key;
                                    _this.colsArray.push(newObj);
                                });
                            } else {
                                if (_this.box.type === 'user_select') {
                                    _this.colsArray = [
                                        {name: "用户名", model: "username"}, {
                                            name: "真实名称",
                                            model: "realName"
                                        }, {name: "所属组织", model: "orgName"},
                                        {name: "手机号", model: "phone"}, {name: "邮箱", model: "email"}
                                    ]
                                } else if (_this.box.type === 'company_select') {
                                    _this.colsArray = [
                                        {name: "企业名称", model: "companyName"}, {
                                            name: "行政区划",
                                            model: "administrativeAreaName"
                                        }, {name: "所属行业", model: "industryName"},
                                        {name: "行业类别", model: "industyType"}, {
                                            name: "国民经济行业类型",
                                            model: "economicTypeName"
                                        }, {name: "组织机构代码", model: "companyCode"}
                                    ]
                                }
                            }
                            if (res.datas) {
                                _this.tableData = res.datas;
                            } else {
                                _this.tableData = res.list;
                            }
                        }
                        if (!_this.KHUtils.isNull(_this.tableData)) {
                            _this.selectDialogVisible = true;
                        }
                    }
                    _this.tableDataLoading = false;
                });
            },
            // 分页查询
            handleCurrentChange(val) {
                this.queryCommonDataParam.pageNum = val;
                this.getDataSource();
            },
            // 列表选中触发
            handleSelectionChange(array) {
                this.selectTableData = [];
                if (array instanceof Array && array.length >= 2) {
                    this.$notify.warning({
                        title: '警告',
                        message: '选择关联的数据不允许超过一条',
                    });
                    return false;
                }
                this.selectTableData = array;
            },
            // 定位信息返回
            recGisMsg(obj) {
                let _this = this;
                _this.gisVisible = false;
                _this.address = obj.address;
                _this.dataModel = {};
                _this.dataModel[_this.box.modelExt.lat] = obj.lat ? obj.lat : "";
                _this.dataModel[_this.box.modelExt.lnt] = obj.lnt ? obj.lnt : "";
                _this.dataModel[_this.box.modelExt.address] = obj.address ? obj.address : "";
                // console.log("GisObj:" + JSON.stringify(obj));
            },
            // 关闭GIs窗口通知子组件返回数据给父组件
            handlerGisClose() {
                this.notifyChild++;
            },
            // 数据选择控件保存
            handleSave() {
                let _this = this;
                let selected = {};
                if (_this.box.type === 'data_select' || _this.box.type === 'org_select' || _this.box.type === 'user_select' || _this.box.type === 'company_select' || _this.box.type === 'role_select' || _this.box.type === 'dic_select') {
                    // 以列表的形式展示
                    if (_this.box.options.displayModel === 'table') {
                        if (_this.KHUtils.isNull(_this.selectTableData) || _this.selectTableData.length <= 0) {
                            return false;
                        }
                        selected = _this.selectTableData[0];
                    } else {
                        let data = _this.$refs.tree.getCheckedNodes();
                        if (data.length >= 2) {
                            this.$notify.warning({
                                title: '警告',
                                message: '选择关联的数据不允许超过一条',
                            });
                            return false;
                        }
                        if (_this.KHUtils.isNull(data) || data.length === 0) {
                            data = this.$refs.tree.getCurrentNode();
                        }
                        selected = data[0];
                    }
                    let label = _this.box.options.maps.name;
                    let key = _this.box.options.maps.key;
                    _this.dataModel = {};
                    _this.dataModel[this.box.model] = selected[key];
                    _this.dataModel[this.box.label_model] = selected[label];
                    _this.selectDialogVisible = false;
                }
            },
            // 行政区划选择
            regionChange(data) {
                // console.log("regionObj :" + JSON.stringify(data));
                this.dataModel = {};
                if (data.province) {
                    if (data.province.value) {
                        this.dataModel[this.box.modelExt.province] = data.province.value; // 省
                        this.dataModel[this.box.modelExt.provinceCode] = data.province.key;
                    }
                } else {
                    this.dataModel[this.box.modelExt.province] = ""; // 省
                    this.dataModel[this.box.modelExt.provinceCode] = "";
                }
                if (data.city) {
                    if (data.city.value) {
                        this.dataModel[this.box.modelExt.city] = data.city.value; // 市
                        this.dataModel[this.box.modelExt.cityCode] = data.city.key;
                    }
                } else {
                    this.dataModel[this.box.modelExt.city] = ""; // 市
                    this.dataModel[this.box.modelExt.cityCode] = "";
                }
                if (data.area) {
                    if (data.area.value) {
                        this.dataModel[this.box.modelExt.area] = data.area.value; // 县
                        this.dataModel[this.box.modelExt.areaCode] = data.area.key;
                    }
                } else {
                    this.dataModel[this.box.modelExt.area] = "";
                    this.dataModel[this.box.modelExt.areaCode] = "";
                }
            },
            // 移除文件
            deleteFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.warning("请选择移除的文件");
                    return false;
                }
                if (this.models[this.box.model] instanceof Array && this.models[this.box.model].length > 0) {
                    let modelArray = this.models[this.box.model];
                    // 移除该节点的上级节点
                    let deleteIndex = [];
                    for (let i = 0, n = modelArray.length; i < n; i++) {
                        if (fileId === modelArray[i]) {
                            deleteIndex.push(i);
                        }
                    }
                    for (let i = deleteIndex.length - 1; i >= 0; i--) {
                        this.models[this.box.model].splice(deleteIndex[i], 1);
                    }
                }
                // 删除文件对象
                if (!(this.fileObj[this.box.model] instanceof Array)) {
                    return false;
                }
                const index = this.fileObj[this.box.model].findIndex(obj => obj.fileId === fileId);
                this.fileObj[this.box.model].splice(index, 1);
            },
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
            // 在线编辑
            editFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.error("编辑失败,未上传任何文件");
                    return false;
                }
                window.open(this.khConfig.host.basePath + "/static/wps.html?_w_fileId=" + fileId + "&_w_type=write");
            },
            // 单选框选择触发事件
            controlShow() {
                this.$emit('func', {...this.box, data: this.dataModel});
            },
            // 文件上传成功的钩子函数
            uploadCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    // 如果是编辑
                    if (this.models[this.box.model] instanceof Array && this.models[this.box.model].length > 0) {
                        let modelArray = this.models[this.box.model];
                        for (let i = 0, n = fileList.length; i < n; i++) {
                            let flag = true;
                            let fileId = fileList[i].response.datas[0].fileId;
                            for (let j = 0; j < modelArray.length; j++) {
                                if (modelArray[j].endsWith(fileId)) {
                                    flag = false;
                                }
                            }
                            if (flag) {
                                if (this.box.type === 'image_upload') {
                                    this.models[this.box.model].push(this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + fileId);
                                } else {
                                    this.models[this.box.model].push(fileId);
                                }
                            }
                        }
                    } else {
                        // 新增操作
                        let str = "";
                        for (let i = 0, n = fileList.length; i < n; i++) {
                            str += fileList[i].response.datas[0].fileId + ",";
                        }
                        //去掉最后一个逗号(如果不需要去掉,就不用写)
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                        this.models[this.box.model] = str;
                    }
                    this.dataModel = this.models[this.box.model];
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            // 文件上传成功后移除的钩子函数
            uploadRemove(file, fileList) {
                if (file.response.errCode === 0) {
                    if (file.response.datas != null && file.response.datas.length > 0) {
                        let compareKey = file.response.datas[0].fileId;
                        // 如果是编辑
                        if (this.models[this.box.model] instanceof Array && this.models[this.box.model].length > 0) {
                            let modelArray = this.models[this.box.model];
                            const index = modelArray.findIndex(obj => obj === compareKey);
                            modelArray.splice(index, 1);
                        } else {
                            if (!this.KHUtils.isNull(this.models[this.box.model])) {
                                let modelArray = this.models[this.box.model].split(",");
                                const index = modelArray.findIndex(obj => obj === compareKey);
                                modelArray.splice(index, 1);
                                if (modelArray.length > 0) {
                                    let str = "";
                                    for (let i = 0, n = modelArray.length; i < n; i++) {
                                        str += modelArray[i] + ",";
                                    }
                                    //去掉最后一个逗号(如果不需要去掉,就不用写)
                                    if (str.length > 0) {
                                        str = str.substr(0, str.length - 1);
                                    }
                                    this.models[this.box.model] = str;
                                } else {
                                    this.models[this.box.model] = '';
                                }
                            }
                        }
                    }
                }
            },
            // 文件上传前的钩子函数
            beforeUpload(file) {
                if (this.box.type === 'image_upload') {
                    if (file.type !== "image/jpeg" && file.type !== "image/png") {
                        this.$message.error("只能上传jpg/png文件");
                        return false;
                    }
                }
                const limitSize = file.size / 1024 / 1024 < this.box.options.maxFileSize;
                if (!limitSize) {
                    this.$message.error(`上传文件大小不能超过 ${this.box.options.maxFileSize}M`);
                    return false;
                }
            },
            // 文件超限
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 ${this.box.options.length}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                return false;
            },
        }
    }
</script>
<style lang="scss">
    .select-tree-dialog {
        z-index: 2020;
        
        .el-dialog__body {
            padding: 10px 20px;
        }
    }
    
    .form-control {
        div.rg-select div.rg-select__el div.rg-select__content {
            padding: 0px 30px 0px 15px;
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
        /*float: left;*/
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
    
    .upload-demo > > > .el-upload {
        float: left;
        padding-right: 10px;
    }
</style>
