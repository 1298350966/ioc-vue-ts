<template>
    <div style="margin-right: 30px">
        <div class="header-row" >
            <span class="header-title">个人文件夹</span>
        </div>
        <el-row style="padding-top: 10px;">
            <el-form :inline="true" v-model="queryCondition" class="demo-form-inline" label-suffix="：">
                <el-form-item label="个人所属企业（团队）名称">
                    <el-select v-model="tenantValue" placeholder="请选择租户" collapse-tags filterable
                               style="width: 200px"
                               class="report-set-style imageMarginTop" :popper-append-to-body="false"
                               @change="tenantSelect" v-el-select-load-more="loadTenantMore" value="" clearable
                               @clear="clearTenantQuery">
                        <el-option
                            v-for="item in tenantData"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="个人姓名">
                    <el-input v-model="queryCondition.realName" placeholder="个人姓名"></el-input>
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
            </el-form>
        </el-row>
        <div class="table-container">
            <el-table
                :data="tableData"
                border
                stripe
                v-loading="loading"
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
                    label="所属个人姓名">
                </el-table-column>
                <el-table-column
                    prop="tenantName"
                    label="个人所属企业（团队）名称">
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
                            查看
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
            <el-form :model="docObj" label-width="135px" ref="docObj" style="margin-left: 50px;margin-right: 80px">
                <el-form-item label="分类">
                    <el-input v-model="docObj.classification" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="文件" class="custom-form-item">
                    <div class="file-card-list">
                        <div class="file-card-item" v-for="(file,index) in docFileList" :key="index">
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
                         <!--               <a href="#" @click="editFile(file.fileId)">在线编辑</a>-->
                                    </template>
                         <!--           <a href="#" @click="deleteFile(file.fileId)">删除</a>-->
                                </p>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="所属企业（团队）">
                    <el-input v-model="tenantName" :disabled="true"></el-input>
                </el-form-item>
                <el-form-item label="标签">
                    <div>
                        <div :class="fileLabelTags.length>0 ? customDivClass:customDivClass1">
                            <el-tag
                                type="info"
                                size="medium"
                                style="margin-right: 10px;"
                                v-for="(tag,index) in fileLabelTags"
                                :key="index"
                                :type="tag.type">
                                {{tag.name}}
                            </el-tag>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="dialogVisible = false">取 消</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
    import TenantSelected from "@/components/TenantSelected"

    export default {
        components: {TenantSelected},
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
                tenantName: "",
                docFileList: [],
                tenantValue: null,
                tenantData: [],
                queryTenantParam: {
                    pageNum: 1,
                    pageSize: 100
                },
                dialogTitle: "",
                tenantSelectedHackSet: false,
                backListVisible: false,
                backListArray: [],
                customDivClass: "customDivClass",
                customDivClass1: "customDivClass1",
                fileLabelTags: [],
                docObj: {
                    fileId: "",
                    classification: "",
                    blackList: "",
                    fileLabel: "",
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
                    realName: "",
                    tenantId: "",
                    order:1
                },
                isAdd: true,//记录是新增还是编辑
                dialogVisible: false,
            }
        },
        mounted() {
            this.loadTenantFirst();
        },
        methods: {
            clearTenantQuery() {
                this.queryCondition.tenantId = '';
                this.listData();
            },
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
            queryTenant() {
                this.$Get(this.khConfig.api.listTenant, this.queryTenantParam).then(res => {
                    if (res.errCode === 0) {
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
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
            listData() {
                let _this = this;
                if ((!_this.KHUtils.isNull(_this.queryCondition.bt) && !_this.KHUtils.isNull(_this.queryCondition.et)) && (_this.queryCondition.bt > _this.queryCondition.et)) {
                    _this.$message.warning("起始日期不能大于截止日期");
                    return false
                }
                this.tableData = [];
                this.loading = true;
                this.$Get(this.khConfig.api.queryPersonalDocForPlatForm, this.queryCondition).then(res => {
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
            handleEdit(index, row) {
                let _this = this;
                _this.dialogTitle = "查看个人文件";
                _this.isAdd = false;
                _this.docFileList = [];
                _this.docObjTenantId = row.tenantId;
                _this.docObj.fileId = row.fileId;
                _this.docObj.id = row.id;
                _this.docObj.classification = row.classification;
                _this.fileLabelTags = [];
                _this.tenantName = row.tenantName;
                if (!_this.KHUtils.isNull(row.fileLabel) && !_this.KHUtils.isNull(row.fileLabelId)) {
                    let array = row.fileLabel.split(",");
                    let arrayId = row.fileLabelId.split(",");
                    if (array instanceof Array) {
                        for (let i = 0; i < array.length; i++) {
                            let tempObj = {};
                            tempObj.id = arrayId[i];
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
            resetQuery() {
                let _this = this;
                _this.queryCondition = {
                    originalName: "",
                    classification: "",
                    fileType: "",
                    bt: "",
                    et: "",
                    pageSize: 10,
                    pageNum: 1,
                    realName: "",
                    tenantId: ""
                }
            },
            handleCurrentChange(val) {
                let _this = this;
                _this.queryCondition.pageNum = val;
                _this.listData();
            },
            formatTime(row, column) {
                const date = new Date(row[column.property]);
                return this.KHUtils.formatDate(date, "yyyy-MM-dd hh:mm:ss");
            },
            formatOriginalName(row) {
                const str = row.originalName;
                if (!this.KHUtils.isNull(str)) {
                    return str.substr(0, str.lastIndexOf("."));
                }
                return str;
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
