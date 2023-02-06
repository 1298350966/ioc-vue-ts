<template>
    <div style="display:flex;align-items:center;justify-content:center;">
        <div>
            <el-upload
                    ref="upload"
                    :limit="limit"
                    :accept="accept"
                    :action="''"
                    :before-upload="beforeUpload"
                    :on-remove="onRemove"
                    :on-exceed="onExceed"
                    :on-preview="onPreview"
                    :http-request="httpRequest"
                    :show-file-list="!showCustomFileList"
                    :multiple="multiple"
                    :fileList.sync="fileList"
                    :disabled="disabled"
                    drag
            >   
                <i class="el-icon-upload"></i>
                <div class="el-upload__text">将表单文件拖到此处，或<em>点击上传</em></div>
                <div class="el-upload__tip" slot="tip">只能上传{{ fileTypes.join("/") }}格式</div>
                <!-- <el-button size="small" type="primary" :loading="isLoad" :disabled="disabled">点击上传</el-button>
                <div slot="tip" class="el-upload__tip">只能上传{{ fileTypes.join("/") }}格式</div> -->
            </el-upload>
            <div
                    v-if="showCustomFileList && fileList instanceof Array && fileList.length >0"
                    style="width: 100%"
            >
                <ul class="el-upload-list el-upload-list--text">
                    <li
                            tabindex="0"
                            class="el-upload-list__item is-success"
                            v-for="(file, index) in fileList"
                            :key="index"
                    >
                        <el-row style="display:flex;background:#f4f7fa;border-radius:10px;padding:0 10px 0 0;">
                            <el-col :span="3" style="align-self:center;margin-left:15px;">
                                <img
                                        v-if="file.fileSuffix && file.fileSuffix.startsWith('doc') || file.fileSuffix.startsWith('DOC')"
                                        alt=" "
                                        src="../../assets/images/word.png"
                                        @click="downLoadFile(file.fileId)"
                                />
                                <img
                                        v-if="file.fileSuffix && file.fileSuffix.startsWith('xls') || file.fileSuffix.startsWith('XLS')"
                                        alt=" "
                                        src="../../assets/images/excel.png"
                                        @click="downLoadFile(file.fileId)"
                                />
                                <img
                                        v-if="file.fileSuffix && file.fileSuffix.startsWith('ppt') || file.fileSuffix.startsWith('PPT')"
                                        alt=" "
                                        src="../../assets/images/ppt.png"
                                        @click="downLoadFile(file.fileId)"
                                />
                                <img
                                        v-if="
                    !file.fileSuffix ||
                    (file.fileSuffix &&
                        !file.fileSuffix.startsWith('doc') &&
                        !file.fileSuffix.startsWith('xls') &&
                        !file.fileSuffix.startsWith('ppt'))
                    "
                                        alt=" "
                                        src="../../assets/images/others.png"
                                        @click="downLoadFile(file.fileId)"
                                />
                            </el-col>
                            <el-col :span="21">
                                <p style="font-size: 10px;margin:5px;">{{ file.name }}</p>
                                <p
                                        style="font-size: 10px; position: relative;display:flex;margin:5px; "
                                        v-if="
                    file.fileSuffix &&
                    (file.fileSuffix.startsWith('jpg') || file.fileSuffix.startsWith('png') || file.fileSuffix.startsWith('jpeg') || file.fileSuffix.startsWith('JPG') || file.fileSuffix.startsWith('PNG') || file.fileSuffix.startsWith('JPEG'))
                    "
                                >
                                    <a href="#" @click="downLoadFile(file.fileId)" class="downLoadLink">下载</a>
                                    <!-- <a href="#" @click="previewImage(file.fileId)" style="margin-left:10px;">预览</a> -->
                                    <a href="#" v-if="!disabled" @click="remove(file.fileId)" class="deleteLink">删除</a>
                                </p>
                                <p style="font-size: 10px; position: relative; display:flex;margin:5px; " v-else>
                                    <a href="#" @click="downLoadFile(file.fileId)" class="downLoadLink">下载</a>
                                    <!-- <a href="#" @click="previewFile(file.fileId)" style="margin-left:10px;">预览</a> -->
                                    <!-- <a href="#" @click="editFile(file.fileId)" style="margin-left:10px;">在线编辑</a> -->
                                    <a href="#" v-if="!disabled" @click="remove(file.fileId)" class="deleteLink">删除</a>
                                </p>
                            </el-col>
                        </el-row>
                    </li>
                </ul>
            </div>
            <el-dialog
                    top="10vh"
                    title="图片"
                    :visible.sync="imageDialogVisible"
                    v-if="imageDialogVisible"
                    :modal="false"
                    width="60%"
                    :close-on-click-modal="false"
            >
                <el-row type="flex" class="row-bg" justify="center">
                    <el-col :span="2"></el-col>
                    <el-col :span="14">
                        <el-image :src="getImgeUrl(imageId)" style="width: 100%; height: 100%">
                            <div slot="error" class="image-slot">
                                <i class="el-icon-picture-outline"></i>
                            </div>
                        </el-image>
                    </el-col>
                    <el-col :span="2"></el-col>
                </el-row>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    // import customPreview from "../common/customPreview.vue";
    // import khConfig from "@static/kh.config.js";
    import khConfig from "../../../public/static/kh.config.json";
    // import fetchRequest from "@/utils/fetch";

    export default {
        name: "FormImportUpload",
        data() {
            return {
                fileIds: [],
                fileId: "",
                isLoad: false,
                isOpen: false,
                imageDialogVisible:false,
                imageId:''
            };
        },
        mounted() {
            console.log(this.fileList)
        },
        methods: {
            previewImage(imageId) {
                this.imageId = imageId;
                this.imageDialogVisible = true;
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
            async httpRequest(file) {
                const files = file.file;
                this.$emit("importFilesChange",files)
                // this.$emit("update:importFiles",files)
                const formData = new FormData();
                formData.append("file", files);
                // const res = await this.$Post(khConfig.api.formImport, formData).finally(() => {
                //     this.isLoad = false;
                // });
                const res = await this.$Post(khConfig.api.fileUpload, formData).finally(() => {
                    this.isLoad = false;
                });
                if (res.errCode === 0) {
                    const data = res.datas[0];
                    const newData = await this.$Get(khConfig.api.getFileInfo+"/"+data.fileId)
                    this.fileIds.push(data.fileId);
                    this.$emit("change", this.fileIds, this.symbol);
                    this.$message.success("上传成功");
                    if (this.showCustomFileList) {
                        this.fileList.push({
                            name: data.originalfile,
                            fileId: data.fileId,
                            fileSuffix:newData.suffix
                        });
                    }
                }
            },
            remove(index) {
                this.fileList.splice(index, 1);
                this.fileIds.splice(index, 1);
                this.$emit("change", this.fileIds, this.symbol);
                this.$emit("importFilesChange",null)
                this.$message.success("删除成功");
            },
            onRemove(file, fileList) {
                this.fileIds = [];
                fileList.forEach((item) => {
                    if (item.response && item.response.datas[0].fileId) {
                        this.fileIds.push(item.response.datas[0].fileId);
                    } else {
                        this.fileIds.push(item.fileId);
                    }
                });
                this.$emit("change", this.fileIds, this.symbol);
            },
            beforeUpload(file) {
                this.isLoad = true;
                const type = file.name.substring(file.name.lastIndexOf(".") + 1).toLowerCase();
                if (!this.fileTypes.includes(type)) {
                    this.$message({
                        type: "error",
                        message: `文件格式错误，只能上传 ${this.fileTypes.join("/")} 格式文件`,
                        duration: 3000,
                    });
                    this.isLoad = false;
                    return false;
                }
                let isLt10M = file.size / 1024 / 1024 < this.size;
                if (!isLt10M) {
                    this.$message({
                        type: "error",
                        message: `文件大小不得超过 ${this.size} M`,
                        duration: 3000,
                    });
                    this.isLoad = false;
                    return false;
                }
            },
            onExceed() {
                this.$message.warning(`最多可上传${this.limit}个附件`);
            },
            onPreview(file) {
                this.fileId = file.fileId || file.response.datas[0].fileId;
                this.isOpen = true;
            },
            preview(item) {
                this.fileId = item.fileId;
                this.isOpen = true;
            },
            download(item) {
                this.$OpenUrl(this.khConfig.host.rest + this.khConfig.api.fileDownload + "/" + item.fileId);
            },

            init(){
                let _this = this;
                _this.fileIds.forEach(async(fileId,index)=>{
                    const newData = await this.$Get(khConfig.api.getFileInfo+"/"+fileId)
                    if (_this.showCustomFileList) {
                        _this.fileList.push({
                            name: newData.originalName,
                            fileId: newData.fileId,
                            fileSuffix:newData.suffix
                        });
                    }
                })
            }
        },
        props: {
            limit: {
                type: Number,
                default: 1,
            },
            size: {
                type: Number,
                default: 10,
            },
            accept: {
                type: String,
                default: ".jpg,.png,.jpeg",
            },
            fileTypes: {
                type: Array,
                default: function () {
                    return ["jpg", "png", "jpeg"];
                },
            },
            fileList: {
                type: Array,
                default: function () {
                    return [];
                },
            },
            value: {
                type: Array,
                default: function () {
                    return [];
                },
            },
            showCustomFileList: {
                type: Boolean,
                default: false,
            },
            showCustomRemove: {
                type: Boolean,
                default: true,
            },
            disabled: {
                type: Boolean,
                default: false,
            },
            multiple: {
                type: Boolean,
                default: false,
            },
            symbol: {
                type: [String, Number],
            },
            showPreBtn: {
                type: Boolean,
                default: true,
            },
            showDowBtn: {
                type: Boolean,
                default: true,
            },
            // importFiles:{
            //     default:null
            // }
            
        },
        computed:{
            getImgeUrl() {
                return function (imageUrl) {
                    //如果是完整图片路径直接返回 ，如果是uuid 就补齐路径
                    if(this.KHUtils.isUrlPath(imageUrl) == true){
                        return imageUrl;
                    }else {
                        return this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + imageUrl;
                    }

                }
            },
        },
        watch: {
            value: {
                handler(value) {
                    if (Array.isArray(value)) {
                        this.fileIds = value;
                        if(value.length>0 && this.fileList.length == 0){
                            this.init();
                        }
                    } else {
                        this.fileIds = [];
                    }
                },
                deep: true,
                immediate: true,
            },
        },
        components: {
            // customPreview,
        },
    };
</script>

<style lang="scss" scoped>
    .file-list {
        display: flex;
        align-items: center;

        span {
            margin-left: 5px;
            width: 100%;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            cursor: pointer;
        }
    }

    .deleteLink{
        margin-left:10px;
        color: red;
    }
    .downLoadLink{
        color:#3493da;
    }
</style>
