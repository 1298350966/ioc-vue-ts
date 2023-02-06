<template>
  <div class="uploadFlie">
       <el-upload
            class="avatar-uploader"
            :action="this.khConfig.host.rest+this.khConfig.api.fileUpload"
            :multiple="true"
            :file-list.sync="fileList"
            :limit="limit"
            :on-exceed="handleExceed"
            :on-success="uploadCall"
            :on-error="uploadError"
            :on-remove="uploadRemove"
            :before-upload="beforeUpload"
            :on-preview="handlePictureCardPreview"
            list-type="picture-card"
            v-bind="$attrs"
            v-on="$listeners"
            > 
            <i class="el-icon-plus"></i>
        <div slot="tip" class="el-upload__tip">
            只能上传jpg/png文件，且不超过1M
        </div>
        </el-upload>
        <!-- <el-dialog :visible.sync="dialogVisible" :modal="false">
            <img width="100%" :src="dialogImageUrl" alt="">
        </el-dialog> -->
        <preview-image-dialog :visible.sync="dialogVisible" :imageId="dialogImageUrl"></preview-image-dialog>
    </div>
</template>

<script>
import PreviewImageDialog from "@/components/PreviewImageDialog.vue";
export default {
    components:{PreviewImageDialog},
    props:{
       value:{
           type: String,
           default:""
       }
    },
   data() {
       return {
            fileList:[],
            dialogImageUrl: '',
            dialogVisible: false
       }
   },
   computed:{
        limit(){
            if(this.$attrs.hasOwnProperty("limit")){
                return this.$attrs.limit || 0
            }else{
                return 1
            }
        },
        fileIds:{
            get(){         
                return this.value
            },
            set(val){
                this.$emit("input", val) 
            }
       },
   },
   mounted(){
        this.init()
   },
   methods:{
        handlePictureCardPreview(file) {
            this.dialogImageUrl = file.fileId;
            this.dialogVisible = true;
        },
        init(){
            let list = this.fileIds ? this.fileIds.split(",") : []              
            this.fileList = list.map((fileId)=>{
                return {name: fileId,url: this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + fileId ,fileId:fileId}
            })
        },
        // 文件上传成功的钩子函数
        uploadCall(response, file, fileList) {
            if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
            let {fileId,originalfile} = response.datas[0]
            file.fileId = fileId
            file.name = originalfile,
            file.url = this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + fileId

            this.fileIds = fileList.map(file => {
                return file.fileId
            }).join(",")

            this.$notify({
                title: "成功",
                message: "上传成功",
                type: "success",
            });
            } else {
            this.$notify.error({
                title: "错误",
                message: response.errMsg,
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
            this.fileIds = fileList.map(file => {
                return file.fileId
            }).join(",")
        },
        // 文件上传前的钩子函数
        beforeUpload(file) {
            if (file.type !== "image/jpeg" && file.type !== "image/png") {
                this.$message.error("只能上传jpg/png文件");
                return false;
            }
            // const limitSize = file.size / 1024 / 1024 < 10;
            // if (!limitSize) {
            // this.$message.error(`上传文件大小不能超过 10M`);
            // return false;
            // }
        },

        // 文件超限
        handleExceed(files, fileList) {
            this.$message.warning(`当前限制选择${this.limit}个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
            return false;
        },
   },
}
</script>

<style lang="scss" scoped>
.uploadFlie{
    ::v-deep .el-upload--picture-card{
        width: 70px;
        height: 70px;
        line-height: 70px;
        border-radius: 10px;
        overflow: hidden;
        i{
            line-height: 70px;
        }
    }
    ::v-deep .el-upload-list--picture-card .el-upload-list__item{
      width:70px ;
      height:70px ;
    }
}
   
</style>