<template>
    <el-upload
        class="upload"
        :action="this.khConfig.host.rest+this.khConfig.api.fileUpload"
        :file-list="fileList"
        :list-type="listType"
        :on-exceed="handleExceed"
        :on-success="uploadCall"
        :before-upload="beforeUpload"
        :on-remove="handleRemove"
        :limit="fileLimit">
        <el-button size="small" type="primary">选择图标</el-button>
        <div slot="tip" class="el-upload__tip">只能上传jpg/png文件，且不超过500kb</div>
    </el-upload>
</template>

<script>
    export default {
      created() {
        if (this.fileName && this.fileUrl) {
          this.fileList.push({name: this.fileName, url: this.fileUrl});
        }
      },
      data() {
            return {
                fileList: [],
                fileLimit: 1,
                fileId: ''
            }
        },
        // listType: 文件上传的类型
        props: ['listType', 'fileName', 'fileUrl'],
        methods: {
            // 文件上传前的钩子函数
            beforeUpload(file) {
                const isLt500kb = file.size / 1024 < 500;
                if (file.type !== "image/jpeg" && file.type !== "image/png") {
                    this.$message.error("只能上传jpg/png文件");
                    return false;
                }
                if (!isLt500kb) {
                    this.$message.error("上传图片大小不能超过 500kb");
                    return false;
                }
            },
            handleExceed(files, fileList) {
                this.$message.warning(`当前限制选择 1 个文件，本次选择了 ${files.length} 个文件，共选择了 ${files.length + fileList.length} 个文件`);
                return false;
            },
            // 文件上传成功的钩子函数
            uploadCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    // 存储文件ID便于后续对文件访问的权限控制
                    this.fileId = response.datas[0].fileId;
                    // 将数据传递给父组件
                    this.$emit("fromCustomChild", this.fileId)
                } else {
                    this.$notify.error({
                        title: '错误',
                        message: response.errMsg
                    });
                    return false;
                }
            },
            handleRemove(file, fileList) {
              this.fileList = [];
              this.$emit("fromCustomChild", '');
            }
        },
    }
</script>

<style lang="scss" scoped>
    .upload > > > .el-upload {
        float: left;
        padding-right: 10px;
    }
</style>
