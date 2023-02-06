<template>
    <div style="margin-right: 30px">
        <div class="header-row" >
            <span class="header-title">企业文件库</span>
        </div>
        <el-row style="padding-top: 10px;">
            <el-form :inline="true" v-model="queryCondition" class="demo-form-inline" label-suffix="：">
                <el-form-item label="个人所属企业（团队）名称">
                    <el-select v-model="tenantValue" placeholder="请选择租户" collapse-tags filterable
                               style="width: 200px"
                               class="report-set-style imageMarginTop" :popper-append-to-body="false"
                               @change="tenantSelect" v-el-select-load-more="loadTenantMore" value="" clearable
                               @clear="handleClearTenant">
                        <el-option
                            v-for="item in tenantData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row style="padding-bottom: 10px;">
            <el-form :inline="true" v-model="queryCondition" class="demo-form-inline" label-suffix="：">
                <el-form-item label="文件名称">
                    <el-input v-model="queryCondition.originalName" placeholder="文件名称"></el-input>
                </el-form-item>
                <el-form-item label="分类">
                    <el-input v-model="queryCondition.classification" placeholder="分类"></el-input>
                </el-form-item>
                <el-form-item label="文件类型">
                    <el-input v-model="queryCondition.fileType" placeholder="文件类型"></el-input>
                </el-form-item>
                <el-form-item label="上传时间">
                    <el-date-picker
                        v-model="queryCondition.bt"
                        value-format="yyyy-MM-dd HH:mm:ss"
                        placeholder="开始"
                        type="datetime"
                        style="margin-right:5px">
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
        <div class="table-container">
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
                prop="classification"
                label="分类"
            >
            </el-table-column>
            <el-table-column
                prop="originalName"
                label="文件名称"
                :formatter="formatOriginalName"
            >
            </el-table-column>
            <el-table-column
                prop="fileType"
                label="文件类型"
            >
            </el-table-column>
            <el-table-column
                prop="uploadTime"
                label="上传时间" :formatter="formatTime">
            </el-table-column>
            <el-table-column
                prop="userName"
                label="上传人">
            </el-table-column>
            <el-table-column
                prop="tenantName"
                label="企业（团队）名称">
            </el-table-column>
            <el-table-column
                prop="fileLabel"
                label="标签">
                <template slot-scope="scope">
                    <el-tag
                        type="info"
                        size="medium"
                        style="margin-right: 10px;"
                        v-show="!KHUtils.isNull(scope.row.fileLabel)"
                        v-for="(tag,index) in scope.row.fileLabel.split(',')"
                        :key="index">
                        {{tag}}
                    </el-tag>
                </template>
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
        </div>
        <el-dialog
            :title="dialogTitle"
            :visible.sync="dialogVisible"
            :close-on-click-modal="false"
            width="50%"
        >
            <!--可编辑-->
            <el-form :model="docObj" label-width="135px" ref="docObj" style="margin-left: 50px;margin-right: 80px">
                <el-form-item label="所属企业（团队）" class="custom-form-item">
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
                <el-form-item label="选择企业文件" class="custom-form-item">
                    <el-upload
                        class="upload-demo"
                        :action="this.khConfig.host.rest+this.khConfig.api.fileUpload"
                        :multiple="false"
                        :file-list="fileList"
                        :on-exceed="handleExceed"
                        :on-success="uploadCall"
                        :before-upload="beforeUpload"
                    >
                        <el-button size="small" type="primary">附件上传</el-button>
                        <div slot="tip" class="el-upload__tip">
                            上传的附件大小不允许超过100M
                        </div>
                    </el-upload>
                    <div class="file-card-list">
                        <div class="file-card-item"
                            v-for="(file,index) in docFileList" :key="index">
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
                <el-form-item label="分类" class="custom-form-item">
                    <el-input v-model="docObj.classification" @focus="showSelectClassification"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <div @click="showSelectFileLabel">
                        <div :class="fileLabelTags.length>0 ? customDivClass:customDivClass1">
                            <el-tag
                                type="info"
                                size="medium"
                                style="margin-right: 10px;"
                                v-for="(tag,index) in fileLabelTags"
                                :key="index"
                                @close="delFileLabel(tag.id)" closable>
                                {{tag.name}}
                            </el-tag>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveDoc" :loading="saveDocLoading">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="选择所属企业"
            :visible.sync="backListVisible"
            :close-on-click-modal="false"
            width="45%"
        >
            <tenant-selected v-if="tenantSelectedHackSet" :multiple="false" ref="tenantSelectedRef"></tenant-selected>
            <span slot="footer" class="dialog-footer">
                <el-button @click="backListVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureSelectedTenant">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="选择标签"
            :visible.sync="tagSelectedVisible"
            :close-on-click-modal="false"
            width="40%"
        >
            <tag-selected :multiple="selectedMultiple" ref="tagSelectRef" v-if="tagHackSet" :tenant-id="docObjTenantId"
                          :source="source" :classification-id="docObj.classificationId"></tag-selected>
            <span slot="footer" class="dialog-footer">
                <el-button @click="tagSelectedVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureSelectedFileLabel">确 定</el-button>
            </span>
        </el-dialog>
        <el-dialog
            title="选择文件分类"
            :visible.sync="classificationSelectedVisible"
            :close-on-click-modal="false"
            width="40%"
        >
            <file-classification-selected :multiple="selectedMultiple" ref="classificationSelectedVisibleRef"
                                          :tenant-id="docObjTenantId"
                                          v-if="classificationSelectedHackSet"
                                          :source="source"></file-classification-selected>
            <span slot="footer" class="dialog-footer">
                <el-button @click="classificationSelectedVisible = false">取 消</el-button>
                <el-button type="primary" @click="sureClassificationSelected">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import TenantSelected from "@/components/TenantSelected"
    import FileClassificationSelected from "@/views/extended/doc/components/FileClassificationSelected"
    import TagSelected from "@/views/extended/doc/components/TagSelected"

    export default {
        components: {FileClassificationSelected, TagSelected, TenantSelected},
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
                source: "1",
                tenantValue: null,
                tenantData: [],
                queryTenantParam: {
                    pageNum: 1,
                    pageSize: 100
                },
                docObjTenantId: null, // 表单提交的租户ID
                docObjTenantName: "",// 表单提交的租户名称
                tenantSelectedHackSet: false,
                /**以下与共享文件夹定义参数相同**/
                backListSelectedHackSet: false,
                backListVisible: false,
                backListArray: [],
                customDivClass: "customDivClass",
                customDivClass1: "customDivClass1",
                classificationSelectedHackSet: false,
                classificationSelectedVisible: false,
                tagHackSet: false,
                tagSelectedVisible: false,
                fileLabelTags: [],
                selectedMultiple: false,
                fileList: [],
                exceedSetSize: 1,
                docFileList: [],
                dialogTitle: "",
                docObj: {
                    fileId: "",
                    classification: "",
                    blackList: "",
                    fileLabel: "",
                    fileLabelId: "",
                    classificationId: null,
                    classificationParentId: null,
                },
                tableData: [],
                total: 0,
                loading: false,
                queryCondition: {
                    originalName: "",
                    classification: "",
                    fileType: "",
                    bt: "",
                    et: "",
                    pageSize: 10,
                    pageNum: 1,
                    order:1
                },
                saveDocLoading: false,
                isAdd: true,//记录是新增还是编辑
                dialogVisible: false,
                multipleSelection: [],
                fileExtendId: null, // 文件扩展属性唯一ID
                oldFileId: "" // 重新上传文件
            }
        },
        mounted() {
            this.loadTenantFirst();
        },
        methods: {
            loadTenantFirst() {
                let _this = this;
                _this.queryTenantParam.pageNum = 1;
                _this.tenantData = [];
                _this.queryTenant();
            },
            loadTenantMore() {
                let _this = this;
                _this.queryTenantParam.pageNum++;
                _this.queryTenant();
            },
            queryTenant() {
                this.$Get(this.khConfig.api.listTenant, this.queryTenantParam).then(res => {
                    if (res.errCode === 0) {
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
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
            handleClearTenant() {
                this.queryCondition.tenantId = null;
                this.listData();
            },
            tenantSelect(value) {
                this.tenantValue = value;
                if (!this.KHUtils.isNull(value)) {
                    this.queryCondition.tenantId = this.tenantValue;
                    this.listData();
                }
            },
            /**
             * 所屬企业选择
             */
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
                _this.backListArray = [];
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
                if (_this.backListArray.length > 0) {
                    _this.docObjTenantId = _this.backListArray[0].id;
                    _this.docObjTenantName = _this.backListArray[0].name;
                }
                _this.backListVisible = false;
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
             * 查询共享文件
             */
            listData() {
                let _this = this;
                if ((!_this.KHUtils.isNull(_this.queryCondition.bt) && !_this.KHUtils.isNull(_this.queryCondition.et)) && (_this.queryCondition.bt > _this.queryCondition.et)) {
                    _this.$message.warning("起始日期不能大于截止日期");
                    return false
                }
                this.tableData = [];
                this.loading = true;
                this.$Get(this.khConfig.api.queryEnterpriseDocForPlatForm, this.queryCondition).then(res => {
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
            //重置
            resetQuery() {
                let _this = this;
                _this.tenantValue = null;
                _this.queryCondition = {
                    originalName: "",
                    classification: "",
                    fileType: "",
                    bt: "",
                    et: "",
                    pageSize: 10,
                    pageNum: 1
                }
            },
            //格式化时间显示
            formatTime(row, column) {
                const date = new Date(row[column.property]);
                return this.KHUtils.formatDate(date, "yyyy-MM-dd hh:mm:ss");
            },
            //格式化文件名称显示
            formatOriginalName(row) {
                const str = row.originalName;
                if (!this.KHUtils.isNull(str)) {
                    return str.substr(0, str.lastIndexOf("."));
                }
                return str;
            },
            /**
             * 文件标签相关
             */
            showSelectFileLabel() {
                let _this = this;
                if (!(_this.backListArray instanceof Array) || _this.backListArray.length === 0) {
                    _this.$message.warning("请先选择所属企业（团队）");
                    return;
                }
                if (_this.KHUtils.isNull(_this.docObj.classificationId)) {
                    _this.$message.warning("请先选择分类");
                    return false;
                }
                _this.tagHackSet = false;
                _this.$nextTick(() => {
                    _this.tagHackSet = true;
                });
                _this.tagSelectedVisible = true;
                _this.selectedMultiple = true; // 单选
            },
            sureSelectedFileLabel() {
                let _this = this;
                let tempArray = _this.$refs.tagSelectRef.getCheckedNode();
                if (tempArray instanceof Array && tempArray.length > 0) {
                    for (let i = 0, n = tempArray.length; i < n; i++) {
                        let flag = false;
                        if (_this.fileLabelTags instanceof Array && _this.fileLabelTags.length > 0) {
                            for (let j = 0, n = _this.fileLabelTags.length; j < n; j++) {
                                if (_this.fileLabelTags[j].id === tempArray[i].id) {
                                    flag = true;
                                }
                            }
                        }
                        if (!flag) {
                            let tempObj = {};
                            tempObj.id = tempArray[i].id;
                            tempObj.name = tempArray[i].name;
                            _this.fileLabelTags.push(tempObj);
                        }
                    }
                }
                let str = "";
                let strId = "";
                if (_this.fileLabelTags instanceof Array && _this.fileLabelTags.length > 0) {
                    for (let j = 0, n = _this.fileLabelTags.length; j < n; j++) {
                        str += _this.fileLabelTags[j].name + ",";
                        strId += _this.fileLabelTags[j].id + ",";
                    }
                }
                //去掉最后一个逗号(如果不需要去掉,就不用写)
                if (str.length > 0) {
                    str = str.substr(0, str.length - 1);
                }
                if (strId.length > 0) {
                    strId = strId.substr(0, strId.length - 1);
                }
                _this.docObj.fileLabel = str;
                _this.docObj.fileLabelId = strId;
                _this.tagSelectedVisible = false;
            },
            delFileLabel(key) {
                let _this = this;
                if (_this.KHUtils.isNull(key)) {
                    return false;
                }
                delArrayObj(key, 'id', _this.fileLabelTags);
                let str = "";
                let strId = "";
                if (_this.fileLabelTags instanceof Array && _this.fileLabelTags.length > 0) {
                    for (let j = 0, n = _this.fileLabelTags.length; j < n; j++) {
                        str += _this.fileLabelTags[j].name + ",";
                        strId += _this.fileLabelTags[j].id + ",";
                    }
                }
                //去掉最后一个逗号(如果不需要去掉,就不用写)
                if (str.length > 0) {
                    str = str.substr(0, str.length - 1);
                }
                if (strId.length > 0) {
                    strId = strId.substr(0, strId.length - 1);
                }
                _this.docObj.fileLabel = str;
                _this.docObj.fileLabelId = strId;

                function delArrayObj(compareKey, key, array) {
                    if (!(array instanceof Array)) {
                        return false;
                    }
                    const index = array.findIndex(obj => obj[key] === compareKey);
                    array.splice(index, 1);
                }
            },
            /**
             * 文件分类相关
             */
            showSelectClassification() {
                let _this = this;
                if (!(_this.backListArray instanceof Array) || _this.backListArray.length === 0) {
                    _this.$message.warning("请先选择所属企业（团队）");
                    return;
                }
                _this.classificationSelectedVisible = true;
                _this.selectedMultiple = false; // 单选
                _this.classificationSelectedHackSet = false;
                _this.$nextTick(() => {
                    _this.classificationSelectedHackSet = true;
                });
            },
            sureClassificationSelected() {
                let _this = this;
                let tempArray = _this.$refs.classificationSelectedVisibleRef.getCheckedNode();
                let str = "";
                if (tempArray instanceof Array && tempArray.length > 0) {
                    for (let i = 0, n = tempArray.length; i < n; i++) {
                        str += tempArray[i].name + ",";
                    }
                    //去掉最后一个逗号(如果不需要去掉,就不用写)
                    if (str.length > 0) {
                        str = str.substr(0, str.length - 1);
                    }
                    _this.docObj.classificationId = tempArray[0].id;
                    _this.docObj.classificationParentId = tempArray[0].parentId;
                }
                _this.classificationSelectedVisible = false;
                _this.docObj.classification = str;
            },
            handleAdd() {
                let _this = this;
                _this.dialogTitle = "新增企业文件";
                _this.docObj = {
                    fileId: "",
                    classification: "",
                    blackList: "",
                    fileLabel: "",
                };
                _this.fileExtendId = "";
                _this.docFileList = [];
                _this.docObjTenantName = "";
                _this.docObjTenantId = null;
                _this.fileLabelTags = [];
                _this.fileList = [];
                _this.backListArray = [];
                _this.isAdd = true;
                _this.dialogVisible = true;
            },
            handleEdit(index, row) {
                let _this = this;
                _this.dialogTitle = "编辑企业文件";
                _this.fileExtendId = row.id;
                _this.oldFileId = row.fileId;
                _this.isAdd = false;
                _this.fileList = [];
                _this.docFileList = [];
                _this.docObj.fileId = row.fileId;
                _this.docObj.id = row.id;
                _this.docObj.classification = row.classification;
                _this.docObj.classificationId = row.classificationId;
                _this.docObj.classificationParentId = row.classificationParentId;
                _this.fileLabelTags = [];
                _this.docObjTenantId = row.tenantId;
                _this.docObjTenantName = row.tenantName;
                _this.backListArray = [];
                _this.backListArray.push({id: row.tenantId, name: row.tenantName});
                if (!_this.KHUtils.isNull(row.fileLabel) && !_this.KHUtils.isNull(row.fileLabelId)) {
                    let array = row.fileLabel.split(",");
                    let arrayId = row.fileLabelId.split(",");
                    if (array instanceof Array) {
                        for (let i = 0; i < array.length; i++) {
                            let tempObj = {};
                            tempObj.id = parseInt(arrayId[i]);
                            tempObj.name = array[i];
                            _this.fileLabelTags.push(tempObj);
                        }
                    }
                }
                if (!_this.KHUtils.isNull(row.fileId)) {
                    let tempArray = row.fileId.split(",");
                    if (tempArray instanceof Array && tempArray.length > 0) {
                        for (let i = 0, n = tempArray.length; i < n; i++) {
                            _this.$Get(_this.khConfig.api.getFileInfo + "/" + tempArray[i]).then(res => {
                                if (res.errCode === 0) {
                                    let newObj = {};
                                    newObj.fileName = res.originalName;
                                    newObj.fileId = res.fileId;
                                    newObj.fileSuffix = res.suffix;
                                    _this.docFileList.push(newObj);
                                }
                            });
                        }
                    }
                }
                _this.dialogVisible = true;
            },
            saveDoc() {
                let _this = this;
                if (_this.KHUtils.isNull(_this.docObj.fileId)) {
                    _this.$message.warning("上传共享文件不能为空");
                    return false;
                }
                if (_this.KHUtils.isNull(_this.docObj.classificationId)) {
                    _this.$message.warning("分类不能为空");
                    return false;
                }
                _this.$refs.docObj.validate((valid) => {
                    if (valid) {
                        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                            _this.saveDocLoading = true;
                            let param = {
                                fileExtendId: _this.fileExtendId,
                                fileId: _this.docObj.fileId,
                                oldFileId: _this.oldFileId,
                                classification: _this.docObj.classification,
                                classificationId: _this.docObj.classificationId,
                                classificationParentId: _this.docObj.classificationParentId,
                                fileLabel: _this.docObj.fileLabel,
                                fileLabelId: _this.docObj.fileLabelId,
                                backList: _this.backListArray,
                                tenantName: _this.docObjTenantName,
                            };
                            if (!_this.KHUtils.isNull(_this.docObjTenantId)) {
                                param.tenantId = _this.docObjTenantId;
                            }
                            _this.$PostJson(this.khConfig.api.saveFileExtend, param).then(res => {
                                _this.saveDocLoading = false;
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
                            _this.saveDocLoading = false;
                            console.log(e)
                        });
                    }
                });
            },
            handleSelectionChange(array) {
                this.multipleSelection = array;
            },
            //删除
            handleDelete() {
                let _this = this;
                if (_this.multipleSelection instanceof Array && _this.multipleSelection.length > 0) {
                    _this.$confirm('是否确认删除吗?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        var idsStr = _this.multipleSelection.map(function (obj, index) {
                            return obj.id;
                        }).join(",");
                        let param = {
                            ids: idsStr
                        };
                        _this.$Get(_this.khConfig.api.batchDeleteFileExtend, param).then(res => {
                            if (res.errCode === 0) {
                                _this.$message({
                                    message: '删除文件库成功',
                                    type: 'success'
                                });
                                _this.listData();
                            }
                        });
                    }).catch(() => {

                    });
                } else {
                    _this.$message({
                        message: '请选择需要删除的文件库',
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
                const index = this.fileList.findIndex(obj => obj.fileId === fileId);
                this.fileList.splice(index, 1);
                this.docObj.fileId = "";
                const docIndex = this.docFileList.findIndex(obj => obj.fileId === fileId);
                this.docFileList.splice(docIndex, 1);
            },
            // 文件上传成功的钩子函数
            uploadCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$message.success("上传成功");
                    this.docObj.fileId = fileList[0].response.datas[0].fileId;
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            // 文件上传前的钩子函数
            beforeUpload(file) {
                if (this.docFileList.length === 1) {
                    this.$message.warning(`当前限制上传1个文件`);
                    return false;
                }
                const limitSize = file.size / 1024 / 1024 <= 100;
                if (!limitSize) {
                    this.$message.error(`上传文件大小不能超过100M`);
                    return false;
                }
            },
            // 文件超限
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制上传1个文件`);
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

    .table-container{
        &::after{
            content:"";
            clear:both;
            display: block;
        }
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
