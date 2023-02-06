<template>
    <div style="margin-right: 30px">
        <div class="header-row" >
            <span class="header-title">平台公告</span>
        </div>
        <!--        <el-row>
                    <el-form :inline="true" v-model="queryCondition" class="demo-form-inline" label-suffix="：">
                        <el-form-item label="个人所属企业（团队）名称">
                            &lt;!&ndash;                    <el-input v-model="queryCondition.tenantName" placeholder="个人所属企业（团队）名称"></el-input>&ndash;&gt;
                            &lt;!&ndash;clearable @clear="queryCondition.tenantId=''"&ndash;&gt;
                            <el-select v-model="tenantValue" placeholder="请选择租户" collapse-tags filterable
                                       style="width: 200px"
                                       class="report-set-style imageMarginTop" :popper-append-to-body="false"
                                       @change="tenantSelect" v-el-select-load-more="loadTenantMore" value="">
                                <el-option
                                    v-for="item in tenantData"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </el-form-item>
                        &lt;!&ndash;                <el-button type="primary" round @click="listData">查询</el-button>
                                        <el-button type="warning" round @click="resetQuery">重置</el-button>&ndash;&gt;
                    </el-form>
                </el-row>-->
        <el-row style="padding: 10px 0;">
            <el-form :inline="true" v-model="queryCondition" class="demo-form-inline" label-suffix="：">
                <el-form-item label="公告类型">
                    <el-input v-model="queryCondition.noticeType" placeholder="公告类型"></el-input>
                </el-form-item>
                <el-form-item label="标题">
                    <el-input v-model="queryCondition.noticeTitle" placeholder="标题"></el-input>
                </el-form-item>
                <el-form-item label="发布时间">
                    <el-date-picker
                        v-model="queryCondition.bt"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="开始"
                        type="datetime"
                        style="margin-right:5px;">
                    </el-date-picker>
                    <el-date-picker
                        v-model="queryCondition.et"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="结束"
                        type="datetime">
                    </el-date-picker>
                </el-form-item>
                <el-button type="primary" round @click="listData">查询</el-button>
                <el-button type="warning" round @click="resetQuery">重置</el-button>
                <el-button type="danger" round @click="handleDelete">删除</el-button>
                <el-button type="success" round @click="handleAdd">新增</el-button>
            </el-form>
        </el-row>
        <el-table
            :data="tableData"
            border
            stripe
            v-loading="loading"
            @selection-change="handleSelectionChange"
            style="width: 100%">
            <el-table-column
                type="selection"
                width="55">
            </el-table-column>
            <el-table-column
                prop="noticeTitle"
                label="标题"
            >
            </el-table-column>
            <el-table-column
                prop="noticeType"
                label="公告类型">
            </el-table-column>
            <el-table-column
                prop="createTime"
                label="发布时间"
                :formatter="formatTime">
            </el-table-column>
            <el-table-column
                label="操作"
            >
                <template slot-scope="scope">
                    <el-button
                        @click.native.prevent="handleEdit(scope.$index, scope.row)"
                        type="primary"
                        size="small">
                        编辑
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
        <el-pagination style="float: right;margin: 10px"
                       background
                       :current-page.sync="queryCondition.pageNum"
                       :page-size.sync="queryCondition.pageSize"
                       layout="total, prev, pager, next, jumper"
                       :total="total"
                       @current-change="handleCurrentChange"
        />
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="50%"
        >
            <el-form :model="noticeObj" label-width="120px" ref="noticeObj" :rules="noticeFormRules"
                     style="margin-left: 50px;margin-right: 80px">
                <el-form-item label="标题" prop="noticeTitle">
                    <el-input v-model="noticeObj.noticeTitle"></el-input>
                    默认背景图
                    <el-button type="text" @click="handleBackgroundSelected">修改</el-button>
                </el-form-item>
                <el-form-item label="公告类型" class="custom-form-item">
                    <el-input v-model="noticeObj.noticeType" @focus="selectNoticeType"></el-input>
                </el-form-item>
                <el-form-item label="不可见企业">
                    <div @click="showBackListSelect">
                        <div :class="backListArray.length>0 ? customDivClass:customDivClass1">
                            <span><span class="el-tag el-tag--info el-tag--mini el-tag--light"
                                        v-for="item in backListArray" style="margin-right: 2px"><span
                                class="el-select__tags-text">{{item.name}}</span><i
                                class="el-tag__close el-icon-close"
                                @click.stop="delBackListItem(item.id)"></i></span></span>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="详细内容">
                    <text-widget :textWidgetData="textWidgetData" :isEdit="true" v-if="textWidgetHackSet"></text-widget>
                </el-form-item>
                <el-form-item label="相关附件">
                    <el-upload
                        class="upload-demo"
                        :action="this.khConfig.host.rest+this.khConfig.api.fileUpload"
                        :multiple="false"
                        :file-list="fileList"
                        :on-success="uploadCall"
                        :on-remove="uploadRemove"
                        :before-upload="beforeUpload"
                    >
                        <el-button size="small" type="primary">附件上传</el-button>
                        <div slot="tip" class="el-upload__tip">
                            上传的附件大小不允许超过100M
                        </div>
                    </el-upload>
                    <div class="file-card-list">
                        <div class="file-card-item" v-for="(file,index) in noticeFileList" :key="index">
                            <!--                   <el-col :span="2">
                                                   <img v-if="file.fileSuffix && file.fileSuffix.startsWith('doc')" alt=" "
                                                        src="../../../../assets/images/word.png" @click="downLoadFile(file.fileId)"/>
                                                   <img v-if="file.fileSuffix && file.fileSuffix.startsWith('xls')" alt=" "
                                                        src="../../../../assets/images/excel.png" @click="downLoadFile(file.fileId)"/>
                                                   <img v-if="file.fileSuffix && file.fileSuffix.startsWith('ppt')" alt=" "
                                                        src="../../../../assets/images/ppt.png" @click="downLoadFile(file.fileId)"/>
                                                   <img v-if="file.fileSuffix && file.fileSuffix.startsWith('pdf')" alt=" "
                                                        src="../../../../assets/images/pdf.png" @click="downLoadFile(file.fileId)"/>
                                                   <img v-if="file.fileSuffix && file.fileSuffix.startsWith('txt')" alt=" "
                                                        src="../../../../assets/images/txt.png" @click="downLoadFile(file.fileId)"/>
                                                   <img
                                                       v-if="!file.fileSuffix || (file.fileSuffix && !file.fileSuffix.startsWith('doc') && !file.fileSuffix.startsWith('xls')
                                                        && !file.fileSuffix.startsWith('ppt') && !file.fileSuffix.startsWith('pdf') && !file.fileSuffix.startsWith('txt'))"
                                                       alt=" " src="../../../../assets/images/others.png"
                                                       @click="downLoadFile(file.fileId)"/>
                                               </el-col>
                                               <el-col :span="22">
                                                   <p style="font-size: 10px">{{file.fileName}}</p>
                                                   <p style="font-size: 10px;position: relative;bottom: -8px;">
                                                       <a href="#" @click="downLoadFile(file.fileId)">下载</a>
                                                       <a href="#" @click="previewFile(file.fileId)">预览</a>
                                                       <a href="#" @click="editFile(file.fileId)">在线编辑</a>
                                                       <a href="#" @click="deleteFile(file.fileId)">删除</a>
                                                   </p>
                                               </el-col>-->
                            <div class="item-pic">
                                <template v-if="KHUtils.isNull(file.fileSuffix)">
                                    <img alt=" " src="../../../../assets/images/others.png"/>
                                </template>
                                <template v-else>
                                    <template v-if="file.fileSuffix.toLowerCase().startsWith('doc')">
                                        <img alt=" " src="../../../../assets/images/word.png"/>
                                    </template>
                                    <template v-else-if="file.fileSuffix.toLowerCase().startsWith('xls')">
                                        <img alt=" " src="../../../../assets/images/excel.png"/>
                                    </template>
                                    <template v-else-if="file.fileSuffix.toLowerCase().startsWith('ppt')">
                                        <img alt=" " src="../../../../assets/images/ppt.png"/>
                                    </template>
                                    <template v-else-if="file.fileSuffix.toLowerCase().startsWith('pdf')">
                                        <img alt=" " src="../../../../assets/images/pdf.png"/>
                                    </template>
                                    <template v-else-if="file.fileSuffix.toLowerCase().startsWith('txt')">
                                        <img alt=" " src="../../../../assets/images/txt.png"/>
                                    </template>
                                    <template v-else>
                                        <img alt=" " src="../../../../assets/images/others.png"/>
                                    </template>
                                </template>
                            </div>
                            <div class="item-content">
                                <p style="font-size: 10px">{{file.fileName}}</p>
                                <p style="font-size: 10px;position: relative;bottom: -8px;">
                                    <a href="#" @click="downLoadFile(file.fileId)">下载</a>
                                    <template v-if="!KHUtils.isNull(file.fileSuffix)&& (file.fileSuffix.toLowerCase().startsWith('doc') || file.fileSuffix.toLowerCase().startsWith('xls')
                                    || file.fileSuffix.toLowerCase().startsWith('ppt') || file.fileSuffix.toLowerCase().startsWith('pdf'))">
                                        <a href="#" @click="previewFile(file.fileId)">预览</a>
                                        <a href="#" @click="editFile(file.fileId)">在线编辑</a>
                                    </template>
                                    <a href="#" @click="deleteFile(file.fileId)">删除</a>
                                </p>
                            </div>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveNotice" :loading="saveNoticeLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            :title="dicCatalogTitle"
            :visible.sync="dicCatalogVisible"
            :close-on-click-modal="false"
            width="40%"
        >
            <dic-catalog-select :type-code="dicTypeCode" :multiple="dicCatalogMultiple" ref="dicCatalogSelectRef"
                                v-if="dicCatalogHackSet"></dic-catalog-select>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dicCatalogVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureSelected">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="不可见企业选择"
            :visible.sync="backListVisible"
            :close-on-click-modal="false"
            width="45%"
        >
            <tenant-selected v-if="tenantSelectedHackSet" :multiple="true" ref="tenantSelectedRef"></tenant-selected>
            <span slot="footer" class="dialog-footer">
                <el-button @click="backListVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureSelectedTenant">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title=""
            :visible.sync="backgroundSelectedVisible"
            :close-on-click-modal="false"
            width="45%"
        >
            <background-selected :notice-id="noticeObj.id" :img="noticeObj.noticeImg" :img-def="noticeObj.noticeImgDef"
                                 :tenant-id="'0'"
                                 :type="'platform'"
                                 :is-add="true" ref="backgroundSelectedRef"
                                 v-if="backgroundSelectedHackSet"></background-selected>
            <span slot="footer" class="dialog-footer">
                <el-button @click="backgroundSelectedVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureSelectedBackground">使 用</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import DicCatalogSelect from "@/components/DicCatalogSelected"
    import TenantSelected from "@/components/TenantSelected"
    import BackgroundSelected from "@/views/extended/notice/components/BackgroundSelected"
    import TextWidget from "@/components/report/textWidget/TextWidget.vue";
    
    const NOTICE_TYPE_CODE = "NOTICE_TYPE";
    export default {
        components: {DicCatalogSelect, TenantSelected, BackgroundSelected, TextWidget},
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
        data() {
            return {
                textWidgetData: {
                    id: 1,
                    content: "",
                    style: {
                        backgroundColor: "transparent"
                    }
                },
                tenantValue: null,
                tenantData: [],
                textWidgetHackSet: false,
                queryTenantParam: {
                    pageNum: 1,
                    pageSize: 100
                },
                dialogTitle: "",
                tenantSelectedHackSet: false,
                backgroundSelectedVisible: false,
                backListVisible: false,
                backListArray: [],
                customDivClass: "customDivClass",
                customDivClass1: "customDivClass1",
                dicCatalogHackSet: false,
                dicCatalogMultiple: false,
                dicCatalogTitle: "",
                dicCatalogVisible: false,
                dicTypeCode: "",
                dicTypeHackSet: false,
                fileList: [],
                noticeObj: {
                    id: null,
                    noticeTitle: "",
                    noticeImg: "",
                    noticeImgDef: "",
                    noticeType: "",
                    noticeTypeId: "",
                    noticeContent: "",
                    noticeFile: "",
                },
                noticeFileList: [],
                tableData: [],
                total: 0,
                loading: false,
                queryCondition: {
                    noticeTitle: "",
                    noticeType: "",
                    bt: "",
                    et: "",
                    pageSize: 10,
                    pageNum: 1
                },
                saveNoticeLoading: false,
                isAdd: true,//记录是新增还是编辑
                dialogVisible: false,
                multipleSelection: [],
                noticeId: null, // 公告唯一ID
                backgroundImage: "",
                backgroundSelectedHackSet: false,
                noticeFormRules: {
                    noticeTitle: [
                        {required: true, message: '请输入标题', trigger: 'blur'},
                        {min: 1, max: 100, message: '标题长度在 1 到 100 个字符', trigger: 'blur'}
                    ],
                    noticeType: [
                        {required: true, message: '请输入公告类型', trigger: 'blur'}
                    ]
                }
            }
        },
        mounted() {
            let _this = this;
            //this.loadTenantFirst();
            _this.listData();
        },
        methods: {
            loadTenantFirst() {
                let _this = this;
                _this.queryTenantParam.pageNum = 1;
                _this.tenantData = [];
                _this.queryTenant("init");
            },
            loadTenantMore() {
                let _this = this;
                _this.queryTenantParam.pageNum++;
                _this.queryTenant();
            },
            queryTenant(sign) {
                this.$Get(this.khConfig.api.listTenant, this.queryTenantParam).then(res => {
                    if (res.errCode === 0) {
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            if (sign === "init") {
                                this.tenantValue = res.datas[0].id; // 首次加载时
                            }
                            this.queryCondition.tenantId = this.tenantValue;
                            this.listData();
                            res.datas.forEach(item => {
                                let obj = {
                                    label: item.tenantName,
                                    value: item.id
                                };
                                this.tenantData.push(obj);
                            })
                        }
                    }
                });
            },
            tenantSelect(value) {
                this.tenantValue = value;
                if (!this.KHUtils.isNull(value)) {
                    this.queryCondition.tenantId = this.tenantValue;
                    this.listData();
                }
            },
            /**
             * 查询公告列表相关
             * */
            listData() {
                let _this = this;
                if ((!_this.KHUtils.isNull(_this.queryCondition.bt) && !_this.KHUtils.isNull(_this.queryCondition.et)) && (_this.queryCondition.bt > _this.queryCondition.et)) {
                    _this.$message.warning("起始日期不能大于截止日期");
                    return false
                }
                this.tableData = [];
                this.loading = true;
                this.$Get(this.khConfig.api.queryNotice, this.queryCondition).then(res => {
                    this.loading = false;
                    if (res.errCode === 0) {
                        this.total = res.totalCount;
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            this.tableData = res.datas;
                        }
                    } else {
                    
                    }
                });
            },
            resetQuery() {
                let _this = this;
                _this.queryCondition = {
                    noticeTitle: "",
                    noticeType: "",
                    bt: "",
                    et: "",
                    pageSize: 10,
                    pageNum: 1
                }
            },
            formatTime(row, column) {
                const date = new Date(row[column.property]);
                return this.KHUtils.formatDate(date, "yyyy-MM-dd hh:mm:ss");
            },
            /**
             * 背景图片选择相关
             * */
            handleBackgroundSelected() {
                let _this = this;
                _this.backgroundSelectedVisible = true;
                /*          _this.backgroundSelectedHackSet = false;
                          _this.$nextTick(() => {
                              _this.backgroundSelectedHackSet = true;
                          });*/
            },
            sureSelectedBackground() {
                let _this = this;
                let tempObj = _this.$refs.backgroundSelectedRef.getCheckedNode();
                console.log("tempObj :" + JSON.stringify(tempObj));
                if (!_this.KHUtils.isNull(tempObj)) {
                    _this.noticeObj.noticeImg = tempObj.noticeImg;
                    _this.noticeObj.noticeImgDef = tempObj.noticeImgDef;
                    if (tempObj.previewImgArray instanceof Array) {
                        this.backgroundImage = "";
                        for (let i = 0, n = tempObj.previewImgArray.length; i < n; i++) {
                            this.backgroundImage += tempObj.previewImgArray[i].fileId + ",";
                        }
                    }
                }
                _this.backgroundSelectedVisible = false;
            },
            /**
             * 不可见企业相关
             * */
            showBackListSelect() {
                let _this = this;
                _this.backListVisible = true;
                _this.tenantSelectedHackSet = false;
                _this.$nextTick(() => {
                    _this.tenantSelectedHackSet = true;
                });
            },
            sureSelectedTenant() {
                let _this = this;
                let tempArray = _this.$refs.tenantSelectedRef.getCheckedNode();
                if (tempArray instanceof Array && tempArray.length > 0) {
                    for (let i = 0, n = tempArray.length; i < n; i++) {
                        let tempObj = {};
                        tempObj.id = tempArray[i].id;
                        tempObj.name = tempArray[i].tenantName;
                        let flag = false;
                        if (_this.backListArray instanceof Array && _this.backListArray.length > 0) {
                            for (let j = 0, n = _this.backListArray.length; j < n; j++) {
                                if (_this.backListArray[j].id === tempObj.id) {
                                    flag = true;
                                }
                            }
                        }
                        if (!flag) {
                            _this.backListArray.push(tempObj);
                        }
                    }
                }
                _this.backListVisible = false;
                console.log("checkedTenant :" + JSON.stringify(tempArray));
            },
            delBackListItem(key) {
                let _this = this;
                if (_this.KHUtils.isNull(key)) {
                    return false;
                }
                delArrayObj(key, 'id', _this.backListArray);
                
                function delArrayObj(compareKey, key, array) {
                    if (!(array instanceof Array)) {
                        return false;
                    }
                    const index = array.findIndex(obj => obj[key] === compareKey);
                    array.splice(index, 1);
                }
            },
            /**
             * 公告类型相关
             * */
            sureSelected() {
                let _this = this;
                let tempArray = _this.$refs.dicCatalogSelectRef.getCheckedNode();
                console.log("checkedCatalog :" + JSON.stringify(tempArray));
                let str = "";
                let strId = "";
                if (tempArray instanceof Array && tempArray.length > 0) {
                    for (let i = 0, n = tempArray.length; i < n; i++) {
                        str += tempArray[i].name + ",";
                        strId += tempArray[i].code + ",";
                    }
                    //去掉最后一个逗号(如果不需要去掉,就不用写)
                    if (str.length > 0) {
                        str = str.substr(0, str.length - 1);
                    }
                    if (strId.length > 0) {
                        strId = strId.substr(0, strId.length - 1);
                    }
                }
                _this.dicCatalogVisible = false;
                _this.noticeObj.noticeType = str;
                _this.noticeObj.noticeTypeId = strId;
            },
            selectNoticeType() {
                let _this = this;
                _this.dicCatalogVisible = true;
                _this.dicTypeCode = NOTICE_TYPE_CODE;
                _this.dicCatalogTitle = "选择公告类型";
                _this.dicCatalogMultiple = false; // 单选
                _this.dicCatalogHackSet = false;
                _this.$nextTick(() => {
                    _this.dicCatalogHackSet = true;
                });
            },
            /**
             * 公告操作相关:新增、编辑、删除
             */
            handleAdd() {
                let _this = this;
                _this.dialogTitle = "新增平台公告";
                _this.textWidgetData.id = new Date().getTime();
                _this.textWidgetData.content = "";
                _this.noticeId = null;
                _this.noticeFileList = [];
                _this.noticeObj = {
                    fileId: "",
                    classification: "",
                    blackList: "",
                    fileLabel: "",
                };
                _this.backgroundSelectedHackSet = false;
                _this.$nextTick(() => {
                    _this.backgroundSelectedHackSet = true;
                });
                _this.fileList = [];
                _this.backListArray = [];
                _this.isAdd = true;
                _this.textWidgetHackSet = false;
                _this.$nextTick(() => {
                    _this.textWidgetHackSet = true;
                });
                _this.dialogVisible = true;
            },
            handleEdit(index, row) {
                let _this = this;
                _this.dialogTitle = "编辑平台";
                _this.isAdd = false;
                _this.fileList = [];
                _this.noticeId = row.id;
                _this.noticeObj.noticeType = row.noticeType;
                _this.textWidgetData.content = row.noticeContent;
                _this.textWidgetHackSet = false;
                _this.$nextTick(() => {
                    _this.textWidgetHackSet = true;
                });
                _this.backgroundSelectedHackSet = false;
                _this.$nextTick(() => {
                    _this.backgroundSelectedHackSet = true;
                });
                _this.$Get(_this.khConfig.api.queryNoticeTenantBlackLisByFileId + "/" + row.id).then(res => {
                    if (res.errCode === 0) {
                        _this.noticeObj = row;
                        _this.noticeFileList = [];
                        if (!_this.KHUtils.isNull(row.noticeFile)) {
                            let tempArray = row.noticeFile.split(",");
                            if (tempArray instanceof Array && tempArray.length > 0) {
                                for (let i = 0, n = tempArray.length; i < n; i++) {
                                    // 查询文件的详细信息
                                    let xhr;
                                    if (window.ActiveXObject) {
                                        xhr = new ActiveXObject("Microsoft.XMLHTTP");
                                    } else {
                                        xhr = new XMLHttpRequest();
                                    }
                                    // 原生Ajax同步请求
                                    xhr.open("GET", _this.khConfig.host.rest + _this.khConfig.api.getFileInfo + "/" + tempArray[i], false);
                                    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
                                    xhr.onreadystatechange = function () {
                                        if (xhr.readyState === 4 && (xhr.status === 200 || xhr.status === 304)) {
                                            let res = JSON.parse(xhr.responseText);
                                            if (res.errCode === 0) {
                                                let newObj = {};
                                                newObj.fileName = res.originalName;
                                                newObj.fileId = res.fileId;
                                                newObj.fileSuffix = res.suffix;
                                                _this.noticeFileList.push(newObj);
                                            }
                                        }
                                    };
                                    // 传递参数
                                    xhr.send();
                                }
                            }
                        }
                        _this.backListArray = [];
                        if (res.datas instanceof Array) {
                            for (let i = 0, n = res.datas.length; i < n; i++) {
                                let tempObj = {};
                                tempObj.id = res.datas[i].tenantId;
                                tempObj.name = res.datas[i].tenantName;
                                _this.backListArray.push(tempObj);
                            }
                        }
                        _this.dialogVisible = true;
                    }
                });
            },
            saveNotice() {
                let _this = this;
                if (_this.KHUtils.isNull(_this.noticeObj.noticeType)) {
                    _this.$message.warning("请选择公告类型");
                    return false;
                }
                _this.$refs.noticeObj.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            _this.saveNoticeLoading = true;
                            let param = {
                                id: _this.noticeId,
                                noticeTitle: _this.noticeObj.noticeTitle,
                                noticeImg: _this.noticeObj.noticeImg,
                                noticeImgDef: _this.noticeObj.noticeImgDef,
                                noticeType: _this.noticeObj.noticeType,
                                noticeTypeId: _this.noticeObj.noticeTypeId,
                                noticeContent: _this.textWidgetData.content,
                                noticeFile: _this.noticeObj.noticeFile,
                                backList: _this.backListArray,
                                backgroundImage: _this.backgroundImage
                            };
                            _this.$PostJson(this.khConfig.api.saveNotice, param).then(res => {
                                _this.saveNoticeLoading = false;
                                if (res.errCode === 0) {
                                    _this.dialogVisible = false;
                                    _this.$message({
                                        message: '保存成功',
                                        type: 'success'
                                    });
                                    _this.listData();
                                }
                            });
                        }).catch((e) => {
                            console.log(e)
                        });
                    }
                });
            },
            handleSelectionChange(array) {
                this.multipleSelection = array;
            },
            handleDelete() {
                let _this = this;
                if (_this.multipleSelection instanceof Array && _this.multipleSelection.length > 0) {
                    _this.$confirm('是否确认删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var idsStr = _this.multipleSelection.map(function (obj) {
                            return obj.id;
                        }).join(",");
                        let param = {
                            ids: idsStr
                        };
                        _this.$Get(_this.khConfig.api.batchDeleteNotice, param).then(res => {
                            if (res.errCode === 0) {
                                _this.$message({
                                    message: '删除公告成功',
                                    type: 'success'
                                });
                                _this.listData();
                            }
                        });
                    }).catch(() => {
                    
                    });
                } else {
                    _this.$message({
                        message: '请选择需要删除的公告',
                        type: 'warning'
                    });
                }
            },
            handleCurrentChange(val) {
                let _this = this;
                _this.queryCondition.pageNum = val;
                _this.listData();
            },
            /**
             * 附件操作相关:下载、预览、删除
             */
            // 文件上传成功的钩子函数
            uploadCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    let str = "";
                    if (!this.KHUtils.isNull(this.noticeObj.noticeFile) && !this.isAdd) {
                        let tempArray = this.noticeObj.noticeFile.split(",");
                        if (tempArray instanceof Array) {
                            for (let i = 0, n = fileList.length; i < n; i++) {
                                let flag = true;
                                let fileId = fileList[i].response.datas[0].fileId;
                                for (let j = 0; j < tempArray.length; j++) {
                                    if (tempArray[j] === fileId) {
                                        flag = false;
                                    }
                                }
                                if (flag) {
                                    str += fileList[i].response.datas[0].fileId + ",";
                                }
                            }
                        }
                    } else {
                        for (let i = 0, n = fileList.length; i < n; i++) {
                            str += fileList[i].response.datas[0].fileId + ",";
                        }
                    }
                    //去掉最后一个逗号(如果不需要去掉,就不用写)
                    if (str.length > 0) {
                        str = str.substr(0, str.length - 1);
                    }
                    this.noticeObj.noticeFile = str;
                    console.log("this.noticeObj.noticeFile :" + this.noticeObj.noticeFile)
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
                        let str = "";
                        if (!this.KHUtils.isNull(this.noticeObj.noticeFile)) {
                            let tempArray = this.noticeObj.noticeFile.split(",");
                            if (tempArray instanceof Array) {
                                for (let j = 0; j < tempArray.length; j++) {
                                    if (tempArray[j] !== compareKey) {
                                        str += tempArray[j] + ",";
                                    }
                                }
                            }
                        }
                        //去掉最后一个逗号(如果不需要去掉,就不用写)
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                        this.noticeObj.noticeFile = str;
                        console.log("this.noticeObj.noticeFile :" + this.noticeObj.noticeFile)
                    }
                }
            },
            // 文件上传前的钩子函数
            beforeUpload(file) {
                const limitSize = file.size / 1024 / 1024 <= 100;
                if (!limitSize) {
                    this.$message.error(`上传文件大小不能超过100M`);
                    return false;
                }
            },
            // 文件超限
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择1个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                return false;
            },
            // 下载文件
            downLoadFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.warning("下载失败,未上传任何文件");
                    return false;
                }
                this.$OpenUrl(this.khConfig.api.fileDownload + "/" + fileId);
            },
            // 在线预览
            previewFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.error("预览失败,未上传任何文件");
                    return false;
                }
                window.open("/static/wps.html?_w_fileId=" + fileId + "&_w_type=read");
            },
            // 在线编辑
            editFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.error("编辑失败,未上传任何文件");
                    return false;
                }
                window.open("/static/wps.html?_w_fileId=" + fileId + "&_w_type=write");
            },
            // 移除文件
            deleteFile(fileId) {
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.warning("请选择移除的文件");
                    return false;
                }
                let compareKey = fileId;
                let str = "";
                if (!this.KHUtils.isNull(this.noticeObj.noticeFile)) {
                    let tempArray = this.noticeObj.noticeFile.split(",");
                    if (tempArray instanceof Array) {
                        for (let j = 0; j < tempArray.length; j++) {
                            if (tempArray[j] !== compareKey) {
                                str += tempArray[j] + ",";
                            }
                        }
                    }
                }
                //去掉最后一个逗号(如果不需要去掉,就不用写)
                if (str.length > 0) {
                    str = str.substr(0, str.length - 1);
                }
                this.noticeObj.noticeFile = str;
                const index = this.noticeFileList.findIndex(obj => obj.fileId === fileId);
                this.noticeFileList.splice(index, 1);
                console.log("this.noticeObj.noticeFile :" + this.noticeObj.noticeFile)
            },
        }
    }
</script>
<style lang="scss" scoped>
    
    .custom-form-item {
        > > > .el-form-item__label {
            &:before {
                content: '*';
                color: #F56C6C;
                margin-right: 4px;
            }
        }
    }
    
    .customDivClass {
        border: 1px solid #DCDFE6;
        padding-left: 5px;
        border-radius: 4px;
        width: 100%;
        max-height: 200px;
        overflow-y: auto;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 10 // 控制显示的行数,如果超过以省略号的形式显示
    }
    
    .customDivClass1 {
        border: 1px solid #DCDFE6;
        padding-left: 5px;
        border-radius: 4px;
        width: 100%;
        height: 36px;
    }

    .file-card-list{
        margin-bottom: 10px;

        .file-card-item{
            display: flex;
            width:400px;
            padding:10px 15px;
            margin:0 0 15px 0;
            background:#ffffff;
            border: 1px solid #e5e5e5;
            border-radius: 10px;
            box-shadow: 4px 4px 4px #f5f5f5;

            .item-pic{
                flex:1;
                display: flex;
                align-items: center;
                justify-content: center;
            }
            .item-content{
                flex:4;

                a{
                    margin-right:5px;
                }
            }
        }
    }
</style>
