<template>
    <div>
        <template v-for="(item,key) in presetImagedata">
            <div style="display: inline-block" @click="position = key">
                <el-upload
                    v-if="item.image == null || item.image == ''"
                    class="avatar-uploader"
                    style="display: inline-block;margin-right: 15px"
                    :show-file-list="false"
                    :action="rest + box.options.action"
                    :disabled="box.options.disabled"
                    :multiple="box.options.multiple"
                    :on-success="uploadCall"
                    :on-error="uploadError"
                    :before-upload="beforeUpload"
                >
                    <div  style="position: relative">
                        <img :src="getImgeUrl(item.presetImage)" class="avatar">
                        <i class="el-icon-upload uploadIcon" ></i>
                    </div>
                </el-upload>
                <div v-else class="image-container" @mouseenter="handleShowModal(item,key,'enter')" @mouseleave="handleShowModal(item,key,'leave')" >
                    <el-image   @click.stop :ref="'elImage'+key" :id="'elImage'+key" :src="getImgeUrl(item.image)" :preview-src-list="[getImgeUrl(item.image)]"
                        class="avatar-successed"   style="display: inline-block;margin-right: 5px" />
                    <div class="image-hover-modal" :ref="'elImageModal'+key" :id="'elImageModal'+key" v-if="item.image != null && item.image != '' ">
                        <div  class="image-hover-operate">
                            <span style="margin:0 15px;cursor:pointer;" @click.stop="previewFile(item,key)">
                                <i  class="el-icon-zoom-in"  ></i>
                            </span>
                            <span style="margin:0 15px;cursor:pointer;" @click.stop="deleteFile(item)">
                                <i  class="el-icon-delete" ></i>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </template>
  
        <!-- <template v-for="(item,key) in presetImagedata">
            <div style="display: inline-block" @click="position = key">
                <el-upload
                    v-if="item.image == null || item.image == ''"
                    class="avatar-uploader"
                    style="display: inline-block;margin-right: 5px"
                    :show-file-list="false"
                    :action="rest + box.options.action"
                    :disabled="box.options.disabled"
                    :multiple="box.options.multiple"
                    :on-success="uploadCall"
                    :on-error="uploadError"
                    :before-upload="beforeUpload"
                >
                    <div  style="position: relative">
                        <img :src="getImgeUrl(item.presetImage)" class="avatar">
                        <i class="el-icon-plus uploadIcon" ></i>
                    </div>

                </el-upload>
                <el-image v-else @click.stop :src="getImgeUrl(item.image)" :preview-src-list="[getImgeUrl(item.image)]"
                    class="avatar" style="display: inline-block;margin-right: 5px" />
                <i  v-if="item.image != null && item.image != ''"  class="iconfont" @click="deleteFile(item)" style="position: relative;right: 10px"> &#xe635; </i>

            </div>
        </template> -->
    </div>
</template>

<script>
    export default {
        name:"ImageUploadPreset.vue",
        props:['box','models'],
        data(){
            return {
                rest:this.khConfig.host.rest,
                presetImags:[], //图片上传控件样例图片集合,
                position:0,
                dataModel: ( this.models[this.box.model] || this.models[this.box.model] === 0) ? this.models[this.box.model]  : "",
                presetImagedata:[]
            }
        },
        created(){
            let _this = this;
            if(!_this.KHUtils.isNull(_this.box.options.presetImgs)){
             _this.presetImags = _this.box.options.presetImgs.split(",");
                let array = [];
                if(_this.dataModel instanceof Array && _this.dataModel.length >0){
                    _this.dataModel.forEach((item,key)=>{
                        array.push(item.substring(item.lastIndexOf('/') + 1))
                    })

                }
                _this.presetImags.forEach((id,key)=>{
                    let obj = {};
                    obj.presetImage=id;
                    obj.image=array[key];
                    _this.presetImagedata.push(obj);
                })
              }
        },
        computed: {
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
        methods:{
            //鼠标事件触发图片遮罩蒙版开启与关闭
            handleShowModal(item,key,keyWord){
                if(keyWord === "enter"){
                    this.$refs[`elImageModal${key}`][0].style.display = "flex";
                }else{
                    this.$refs[`elImageModal${key}`][0].style.display = 'none';
                }
            },
            // 预览文件
            previewFile(item,key){
                this.$refs[`elImageModal${key}`][0].style.display = 'none';     //关闭遮罩蒙版
                this.$refs[`elImage${key}`][0].clickHandler();  //触发el-image自带的点击事件（预览）
            },

            // 移除文件
            deleteFile(item) {
                
                console.log(item);
                let fileId = item.image;
                item.image="";
                if (this.KHUtils.isNull(fileId)) {
                    this.$message.warning("请选择移除的文件");
                    return false;
                }
                if (this.models[this.box.model] instanceof Array && this.models[this.box.model].length > 0) {
                    let modelArray = this.models[this.box.model];
                    // 移除该节点的上级节点
                    let deleteIndex = [];
                    for (let i = 0, n = modelArray.length; i < n; i++) {
                        if (modelArray[i].includes(fileId)) {
                            deleteIndex.push(i);
                        }
                    }
                    for (let i = deleteIndex.length - 1; i >= 0; i--) {
                        this.models[this.box.model].splice(deleteIndex[i], 1);
                    }
                }

            },
            // 文件上传成功的钩子函数
            uploadCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    
                    let fileId = response.datas[0].fileId;
                    this.presetImagedata[this.position].image = fileId;
                    //编辑
                    if (this.models[this.box.model] instanceof Array && this.models[this.box.model].length > 0) {
                        this.models[this.box.model] = [];
                        for (let i = 0, n = this.presetImagedata.length; i < n; i++) {
                            let imageId = this.presetImagedata[i].image;
                            if(this.KHUtils.isNull(imageId)){
                                this.models[this.box.model].push("");
                            }else {
                                this.models[this.box.model].push(this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + imageId);
                            }

                        }
                    }else {
                        //新增
                        let str = "";
                        for (let i = 0, n = this.presetImagedata.length; i < n; i++) {
                            let imageId = this.presetImagedata[i].image;
                            if(this.KHUtils.isNull(imageId)){
                                str += "" + ",";
                            }else {
                                str += imageId + ",";
                            }

                        }
                        //去掉最后一个逗号(如果不需要去掉,就不用写)
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                        this.models[this.box.model] = str;

                    }


                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            uploadError(error, file, fileList){
                if(error.status == 401){
                    let errorMsg = JSON.parse(error.message);{
                        if(errorMsg.errorcode  === "no login"){
                            location.href = errorMsg.redirect;
                        }
                    }
                }else {
                    let message = "上传失败";
                    let errorObj = JSON.parse(error.message);
                    if(errorObj && !this.KHUtils.isNull(errorObj.errMsg)){
                        message = errorObj.errMsg;
                    }
                    this.$notify.error({
                        title: '错误',
                        message:  message
                    });
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
        }
    }
</script>

<style lang="scss" scoped>
    .avatar-uploader .el-upload {
        border: 1px dashed #d9d9d9;
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
    }
    .avatar-uploader .el-upload:hover {
        border-color: #409EFF;
    }
    .avatar-uploader-icon {
        font-size: 28px;
        color: #8c939d;
        width: 120px;
        height: 120px;
        line-height: 120px;
        text-align: center;
    }
    .avatar {
        width: 120px;
        height: 120px;
        display: block;
        border: 1px dashed #c0ccda;
        border-radius:6px;
        
        &:hover{
            border: 1px dashed #409eff;
        }
    }
    .image-container{
        position:relative;
        width: 120px;
        height: 120px;
        margin:0 15px 0 0;

        .avatar-successed{
            width: 120px;
            height: 120px;
            display: block;
            border: 1px dashed #c0ccda;
            border-radius:6px;
            
        }

        .image-hover-modal{
            position: absolute;
            top: 0;
            width: 120px;
            height: 120px;
            transition:opacity .3s;
            background: rgba(0,0,0,.5);
            font-size:20px;
            opacity:1;
            text-align:center;
            color:#fff;
            border: 1px dashed #c0ccda;
            border-radius:6px;

            display: none;
            justify-content: space-between;
            align-items: center;

        }

        .image-hover-operate{
            // position: absolute;
            width: 100%;
            display: flex;
            justify-content: center;
            // color:#fff;
            text-align:center;

        }
        
        
        
    }
    
    .demo-image-box {
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
            z-index: 99;
        }

        .el-image {
            width: 120px;
            height: 120px;
            outline: 1px solid $primary-color;
            border: 1px solid $primary-color;
        }
    }
    .uploadIcon{
        position: absolute;
        font-size: 50px;
        // color: #8c939d;
        left: 50%;
        top: 50%;
        transform: translate(-50%,-50%);
    }
</style>
