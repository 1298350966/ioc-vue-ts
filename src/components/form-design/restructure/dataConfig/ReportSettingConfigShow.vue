<template>
  <div>
    <template v-if="showType==='import'">
      <div style="display: flex;flex-direction: row;align-items: center">
        <span>表头设置</span>
        <div style="margin-left: 10px">
          <span>起始行</span>
          <el-input-number v-model="importSettings.startRow" controls-position="right" style="width: 100px" :min="1"></el-input-number>
        </div>
        <div style="margin-left: 10px">
          <span>起使列</span>
          <el-input-number v-model="importSettings.startColumn" controls-position="right" style="width: 100px" :min="1"></el-input-number>
        </div>
      </div>
    </template>
    <template v-if="showType==='export'">
      <div style="display: flex;flex-direction: row;align-items: center">
        <span>表头设置</span>
        <div style="margin-left: 10px">
          <span>起始行</span>
          <el-input-number v-model="exportSettings.startRow" controls-position="right" style="width: 100px" :min="1"></el-input-number>
        </div>
        <div style="margin-left: 10px">
          <span>起使列</span>
          <el-input-number v-model="exportSettings.startColumn" controls-position="right" style="width: 100px" :min="1"></el-input-number>
        </div>
      </div>
      <div style="display: flex;flex-direction: row;margin-top: 15px">
        <span style="margin-right: 10px;margin-top: 5px">导出模板</span>
        <el-upload
          class="custom-upload"
          :action="this.khConfig.host.rest+this.khConfig.api.fileUpload"
          :on-preview="handlePreview"
          :on-remove="handleRemove"
          :limit="1"
          :on-success="uploadCall"
          :file-list="fileList">
          <el-button size="small" type="primary">点击上传</el-button>
          <div slot="tip" class="el-upload__tip">请上传导出模板文件</div>
        </el-upload>
      </div>
    </template>
  </div>
</template>

<script>
  export default {
    props: {
      itemReportSettings: {required: true, type: Object},
      showType: {required: true, type: String}
    },

    created() {
      if (this.showType === 'import') {
        this.importSettings.startRow = this.itemReportSettings.importSettings.startRow;
        this.importSettings.startColumn = this.itemReportSettings.importSettings.startColumn;
      } else {
        this.exportSettings.startRow = this.itemReportSettings.exportSettings.startRow;
        this.exportSettings.startColumn = this.itemReportSettings.exportSettings.startColumn;
        this.exportSettings.exportModelInfo.fileId = this.itemReportSettings.exportSettings.exportModelInfo.fileId;
        this.exportSettings.exportModelInfo.originalfile = this.itemReportSettings.exportSettings.exportModelInfo.originalfile;
        let fileName = this.itemReportSettings.exportSettings.exportModelInfo.originalfile;
        let fileId = this.itemReportSettings.exportSettings.exportModelInfo.fileId;
        if (fileId && fileName) {
          let fileSrc = window.location.origin + this.khConfig.api.fileDownload + '/' + fileId;
          this.fileList.push({
            name: fileName,
            url: fileSrc
          });
        }
      }
    },

    data() {
      return {
        importSettings: {
          startRow: 1,
          startColumn: 1
        },
        exportSettings: {
          startRow: 1,
          startColumn: 1,
          exportModelInfo: {
            fileId: '',
            originalfile: ''
          }
        },
        fileList: []
      };
    },

    methods: {
      handlePreview(file) {
        let fileId = this.exportSettings.exportModelInfo.fileId;
        if (this.KHUtils.isNull(fileId)) {
          this.$message.error("预览失败,未上传任何文件");
          return false;
        }
        window.open(this.khConfig.host.basePath + "/static/wps.html?_w_fileId=" + fileId + "&_w_type=read");
      },
      handleRemove(file, fileList) {
        this.exportSettings.exportModelInfo.fileId = "";
        this.exportSettings.exportModelInfo.originalfile = "";
      },
      uploadCall(response, file, fileList) {
        if (response.errCode === 0 && response.datas != null && response.datas.length > 0) {
          this.$notify({
            title: '成功',
            message: '上传成功',
            type: 'success'
          });
          // 存储文件ID便于后续对文件访问的权限控制
          this.exportSettings.exportModelInfo.fileId = response.datas[0].fileId;
          this.exportSettings.exportModelInfo.originalfile = response.datas[0].originalfile;
        } else {
          this.$notify.error({
            title: '错误',
            message: response.errMsg
          });
          return false;
        }
      },
      getReportSettingConfig() {
        if (this.showType === 'import') {
          console.log(JSON.stringify(this.importSettings));
          return this.importSettings;
        } else {
          console.log(JSON.stringify(this.exportSettings));
          return this.exportSettings;
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .custom-upload {
    .el-upload-list__item {
      .el-icon-close-tip {
        display: none !important;
      }
    }
  }
</style>
