<template>
    <div>
        <el-dialog title="导出配置" :visible.sync="visibleDialog" v-if="visibleDialog"
                   :append-to-body="true" top="1vh"
                   custom-class="jump-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <template v-slot:default>
                <div >
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="20">
                            <el-button type="success" plain icon="el-icon-plus" style="width: 100%;margin-top: 20px" @click="addExportModel">新增模板</el-button>
                        </el-col>

                    </el-row>
                    <el-row type="flex" class="row-bg" justify="center">
                        <el-col :span="20">
                            <el-row  style="margin-top: 5px;" v-if="currentOptBtn && currentOptBtn.exportModelInfo instanceof Array">
                                <el-col :span="7" clss="file-style" v-for="(exportModel,index) in currentOptBtn.exportModelInfo" :key="index" style="margin-right: 10px">
                                    <el-card shadow="always" style="margin-bottom: 5px;margin-top: 5px">
                                        <el-row :span="24" style="margin-bottom: 10px">
                                            <span style="color: #409EFF;font-size: 15px">{{exportModel.name}}</span>
                                            <i class="el-icon-delete" style="float: right" @click="deleteExportModel(index)"></i>
                                        </el-row>
                                        <el-row :span="24">
                                            <el-col :span="6">
                                                <img alt=" " src="../../assets/images/word.png"/>
                                            </el-col>
                                            <el-col :span="18">
                                                <p style="font-size: 10px" class="text-oneLine">{{exportModel.originalfile}}</p>
                                                <p style="font-size: 10px;position: relative;bottom: -8px;">
                                                    <a href="#" @click="downLoadFile(exportModel.fileId)">下载</a>
                                                    <a href="#" @click="previewFile(exportModel.fileId)">预览</a>
                                                    <a href="#" @click="editFile(exportModel.fileId)">在线编辑</a>
                                                    <!--           <a href="#" @click="deleteFile(file.fileId)">删除</a>-->

                                                </p>
                                            </el-col>
                                        </el-row>
                                    </el-card>
                                </el-col>
                            </el-row>
                        </el-col>

                    </el-row>

                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="visibleDialog = false">取消</el-button>
                <el-button type="primary" @click="visibleDialog = false">确定</el-button>
            </template>
        </el-dialog>
        <el-dialog title="添加模板" :visible.sync="addModelDialog" v-if="addModelDialog" width="30%"
                   :append-to-body="true" top="1vh"
                   custom-class="jump-dialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <template v-slot:default>
                <div >
                    <el-form  :model="modelInfo" label-width="80px">
                        <el-form-item label="模板名称">
                            <el-input v-model="modelInfo.name"></el-input>
                        </el-form-item>
                        <el-form-item label="模板">
                            <el-upload
                                class="custom-upload"
                                :action="uploadUrl"
                                :on-remove="handleRemove"
                                :before-upload="beforeUpload"
                                :limit="1"
                                :on-success="uploadCall"
                                :file-list="optBtnExportfileList">
                                <el-button size="small" type="primary">点击上传</el-button>
                                <div slot="tip" class="el-upload__tip">请上传导出模板文件</div>
                            </el-upload>
                        </el-form-item>
                    </el-form>

                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="addModelDialog = false">取消</el-button>
                <el-button type="primary" @click="saveExportModel">确定</el-button>
            </template>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        name:"ExportModelConfDialog",
        props:['visible','currentOptBtn'],
        computed:{

            visibleDialog:{
                get(){
                    return this.visible
                },
                set(value){
                    console.log(value);
                    this.$emit("update:visible",value)
                }
            }
        },
        created(){
            this.uploadUrl = this.khConfig.host.rest+this.khConfig.api.fileUpload;
            if(!this.currentOptBtn.exportModelInfo){
                this.$set(this.currentOptBtn,'exportModelInfo',[])
            }
        },
        data(){
            return {
                uploadUrl:"",
                optBtnExportfileList: [],
                addModelDialog:false,
                modelInfo:{
                    originalfile:"",
                    fileId:"",
                    name:""
                }
            }
        },
        methods:{
            addExportModel(){
                this.modelInfo = {
                    originalfile:"",
                    fileId:"",
                    name:""
                };
                this.optBtnExportfileList = [];
                this.addModelDialog = true;
            },
            //保存模板
            saveExportModel(){
                if(!this.currentOptBtn.exportModelInfo){
                    this.$set(this.currentOptBtn,'exportModelInfo',[])
                }
                this.currentOptBtn.exportModelInfo.push(this.modelInfo);
                this.addModelDialog = false;

            },
            deleteExportModel(index){
                if(this.currentOptBtn.exportModelInfo instanceof  Array && this.currentOptBtn.exportModelInfo.length >0){
                    this.$confirm('是否确认删除该导出模板?', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        type: 'warning'
                    }).then(() => {
                        this.currentOptBtn.exportModelInfo.splice(index,1);
                    }).catch(() => {

                    });
                }
            },
            uploadCall(response, file, fileList) {
                if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
                    this.$notify({
                        title: '成功',
                        message: '上传成功',
                        type: 'success'
                    });
                    this.modelInfo.fileId = response.datas[0].fileId;
                    this.modelInfo.originalfile = response.datas[0].originalfile;


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
                if (file.name.lastIndexOf('docx') == -1 ) {
                    this.$message.error("只能上传docx格式文件");
                    return false;
                }
            },
            handleRemove(file, fileList) {
              /*  this.currentOptBtn.exportModelInfo.fileId = "";
                this.currentOptBtn.exportModelInfo.originalfile ="";*/
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

        }

    }
</script>

<style lang="scss" scoped>
    .text-oneLine{
        display:block;            /*内联对象需加*/
        word-break:keep-all;      /* 不换行 */
        white-space:nowrap;       /* 不换行 */
        overflow:hidden;          /* 内容超出宽度时隐藏超出部分的内容 */
        text-overflow:ellipsis;   /* 当对象内文本溢出时显示省略标记(...) ；需与overflow:hidden;一起使用。*/

    }
</style>
