<template>
    <section>
        <el-row v-show="!viewOpt">
            <h1 style="font-weight:bold ">上传新的背景图片</h1>
        </el-row>
        <el-row style="padding: 20px 0 20px 0" v-show="!viewOpt">
            <el-form label-width="120px">
                <el-form-item label="背景图片" class="custom-form-item">
                    <el-upload
                        class="upload-demo"
                        :action="this.khConfig.host.rest+this.khConfig.api.fileUpload"
                        :multiple="false"
                        :file-list="fileList"
                        :on-success="uploadCall"
                        :on-remove="uploadRemove"
                        :before-upload="beforeUpload"
                    >
                        <el-button size="small" type="primary">上传图片</el-button>
                        <div slot="tip" class="el-upload__tip">
                            只能上传jpg/png文件，且不允许超过100M
                        </div>
                    </el-upload>
                </el-form-item>
            </el-form>
        </el-row>
        <el-row>
            <h1 style="font-weight:bold ">选择现有的背景图片</h1>
            <el-button type="text" style="float: right;padding-left: 10px;font-weight:bold;font-size: 20px"
                       @click="handleDelete" v-show="!viewOpt">删除
            </el-button>
            <el-button type="text" style="float: right;font-weight:bold;font-size: 20px" @click="handleSetDefault"
                       v-show="!viewOpt">
                设置默认图片
            </el-button>
        </el-row>
        <div class="demo-image">
            <!--         :style="[{border:(item.fileId === img ? '1px solid yellow' : (item.fileId === imgDef ? '1px solid red' :'none'))}]"-->
            <div class="demo-image-box" v-for="item in previewImgArray" @click="handleSelectItem(item)"
                 :class="{active: currentSelectedItem !== null && item.fileId === currentSelectedItem.fileId}">
                <div style="position:relative;">
                    <el-image :src="item.url"></el-image>
                    <div
                        style="position:absolute;z-indent:2;left:0;top:0;font-size: 20px;font-weight: bold;color: #02A7F0">
                        {{item.content}}
                    </div>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "BackgroundSelected",
        props: {
            "tenantId": {required: true},// 租户ID
            "type": {required: false},// platform:平台公告;enterprise:企业公告
            "noticeId": {required: true},// 公告ID
            "img": {required: true},// 目前正在使用的背景图片
            "imgDef": {required: false},// 默认使用的背景图片
            "isAdd": {type: Boolean, required: false}, // 是否为新增操作,true:新增
            "viewOpt": {type: Boolean, required: false}, // 是否为查看操作,true:是
        },
        data() {
            return {
                fileList: [],
                noticeImg: "",   // 目前正在使用的背景图片
                noticeImgDef: "", // 默认使用的背景图片
                currentSelectedItem: null, // 当前选中的图片
                previewImgArray: []
            }
        },
        mounted() {
            this.listImgByNoticeId();
        },
        methods: {
            listImgByNoticeId() {
                this.previewImgArray = [];
                let url = "";
                if (this.type === "platform") {
                    url = this.khConfig.api.queryPlatFormNoticeUsedBackground;
                } else {
                    if (this.KHUtils.isNull(this.tenantId)) {
                        return false;
                    }
                    url = this.khConfig.api.queryEnterpriseNoticeUsedBackground + "/" + this.tenantId;
                }
                this.$Get(url).then(res => {
                    if (res.errCode === 0) {
                        if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                            for (let i = 0, n = res.datas.length; i < n; i++) {
                                let tempObj = res.datas[i];
                                tempObj.url = this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + tempObj.fileId;
                                tempObj.previewList = [tempObj.url];
                                this.previewImgArray.push(tempObj);
                            }
                            const imgDefIndex = this.previewImgArray.findIndex(obj => obj.fileId === this.imgDef);
                            const imgIndex = this.previewImgArray.findIndex(obj => obj.fileId === this.img);
                            if (imgDefIndex !== -1 && imgIndex !== -1 && imgDefIndex === imgIndex) {
                                this.previewImgArray[imgDefIndex].content = "默认";
                            }
                            if (imgDefIndex !== -1 && imgIndex !== -1 && imgDefIndex !== imgIndex) {
                                this.previewImgArray[imgDefIndex].content = "默认";
                                this.previewImgArray[imgIndex].content = "正在使用";
                            }
                            this.noticeImgDef = this.imgDef;
                            this.noticeImg = this.img;
                        }
                    }
                });
            },
            handleSetDefault() {
                let _this = this;
                if (_this.KHUtils.isNull(_this.currentSelectedItem) || _this.KHUtils.isNull(_this.currentSelectedItem.fileId)) {
                    _this.$message.warning("请选择需要设置为默认的背景图片");
                    return false;
                }
                _this.noticeImgDef = _this.currentSelectedItem.fileId;
                _this.$message.success("设置为默认背景图片成功");
            },
            handleDelete() {
                let _this = this;
                if (_this.KHUtils.isNull(_this.currentSelectedItem) || _this.KHUtils.isNull(_this.currentSelectedItem.fileId)) {
                    _this.$message.warning("请选择需要删除的背景图片");
                    return false;
                }
                let flag = false;
                if (this.previewImgArray instanceof Array) {
                    for (let j = 0; j < this.previewImgArray.length; j++) {
                        if (this.previewImgArray[j].fileId === _this.currentSelectedItem.fileId) {
                            flag = true;
                        }
                    }
                }
                const index = this.previewImgArray.findIndex(obj => obj.fileId === _this.currentSelectedItem.fileId);
                this.previewImgArray.splice(index, 1);
                if (_this.imgDef === _this.currentSelectedItem.fileId) {
                    _this.noticeImgDef = "";
                }
                if (_this.img === _this.currentSelectedItem.fileId) {
                    _this.noticeImg = "";
                }
                _this.$message.success("删除背景图片成功");
            },
            handleSelectItem(item) {
                this.currentSelectedItem = item;
                this.noticeImg = this.currentSelectedItem.fileId;
            },
            getCheckedNode() {
                if (!(this.previewImgArray instanceof Array) || this.previewImgArray.length <= 0) {
                    this.noticeImg = "";
                    this.noticeImgDef = "";
                }
                return {
                    noticeImg: this.noticeImg,
                    noticeImgDef: this.noticeImgDef,
                    previewImgArray: this.previewImgArray
                };
            },
            // 文件上传成功的钩子函数
            uploadCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$message.success("上传成功");
                    if (this.KHUtils.isNull(this.imgDef)) {
                        this.noticeImgDef = file.response.datas[0].fileId;
                    }
                    if (!this.isAdd) {
                        if (this.previewImgArray instanceof Array) {
                            for (let i = 0, n = fileList.length; i < n; i++) {
                                let flag = true;
                                let fileId = fileList[i].response.datas[0].fileId;
                                for (let j = 0; j < this.previewImgArray.length; j++) {
                                    if (this.previewImgArray[j].fileId === fileId) {
                                        flag = false;
                                    }
                                }
                                if (flag) {
                                    let fileId = fileList[i].response.datas[0].fileId;
                                    this.processPreviewImgArray(fileId);
                                }
                            }
                        }
                    } else {
                        for (let i = 0, n = fileList.length; i < n; i++) {
                            let fileId = fileList[i].response.datas[0].fileId;
                            this.processPreviewImgArray(fileId);
                        }
                    }
                    console.log("previewImgArray :" + JSON.stringify(this.previewImgArray));
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            processPreviewImgArray(fileId) {
                let _this = this;
                let flag = true;
                if (this.previewImgArray instanceof Array && this.previewImgArray.length > 0) {
                    for (let j = 0; j < this.previewImgArray.length; j++) {
                        if (this.previewImgArray[j].fileId === fileId) {
                            flag = false;
                        }
                    }
                }
                if (flag) {
                    let tempObj = {};
                    tempObj.fileId = fileId;
                    tempObj.url = _this.khConfig.host.rest + _this.khConfig.api.imageDownload + "/" + tempObj.fileId;
                    tempObj.previewList = [tempObj.url];
                    _this.previewImgArray.push(tempObj)
                }
            },
            // 文件上传成功后移除的钩子函数
            uploadRemove(file) {
                if (file.response.errCode === 0) {
                    if (file.response.datas != null && file.response.datas.length > 0) {
                        let compareKey = file.response.datas[0].fileId;
                        if (this.previewImgArray instanceof Array) {
                            let tempArray = [];
                            for (let j = 0; j < this.previewImgArray.length; j++) {
                                if (this.previewImgArray[j].fileId !== compareKey) {
                                    tempArray.push(this.previewImgArray[j]);
                                }
                            }
                            this.previewImgArray = tempArray;
                        }
                        console.log("previewImgArray :" + JSON.stringify(this.previewImgArray));
                    }
                }
            },
            // 文件上传前的钩子函数
            beforeUpload(file) {
                if (file.type !== "image/jpeg" && file.type !== "image/png") {
                    this.$message.error("只能上传jpg/png文件");
                    return false;
                }
                const limitSize = file.size / 1024 / 1024 <= 100;
                if (!limitSize) {
                    this.$message.error(`上传文件大小不能超过100M`);
                    return false;
                }
            }
        }
    }
</script>
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
    
    .demo-image {
        height: 350px;
        overflow: auto;
        padding: 20px 0 20px 0;
    }
    
    .demo-image .demo-image-box {
        padding: 10px;
        position: relative;
        display: inline-block;
        
        &.active {
            border: 2px solid #468cff;
        }
        
        .el-image {
            width: 180px;
            height: 150px;
        }
    }
    
    .upload-demo > > > .el-upload {
        float: left;
        padding-right: 10px;
    }
</style>
