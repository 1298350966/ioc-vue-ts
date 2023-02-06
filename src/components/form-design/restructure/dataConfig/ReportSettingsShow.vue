<template>
  <div id="report-setting">
    <div v-if="showType==='import'" class="setting-box">
      <custom-transfer :sourcedata="importSettingsOptions" sourcetitle="请选择" :custom="true"
                       :targetdata="importSettings" targettitle="已选择表单列名" :start-obj="importStartObj"
                       @submitDataToParent="saveImportSettings"></custom-transfer>
    </div>
    <div v-if="showType==='export'" class="setting-box">
      <custom-transfer :sourcedata="exportSettingsOptions" sourcetitle="请选择" :custom="true"
                       :targetdata="exportSettings" targettitle="已选择表单列名" :start-obj="exportStartObj"
                       @submitDataToParent="saveExportSettings"></custom-transfer>
    </div>
  </div>
</template>

<script>
import CustomTransfer from '@/components/CustomTransfer';
  export default {
    props: {
      colsArray: {type: Array},
      showType: {type: String},
      itemReportSettings: {type: Object}
    },

    components: {
      CustomTransfer
    },

    created() {
      this.initSetting();
    },

    mounted() {
      let reportSettingElement = document.getElementById('report-setting');
      let element = reportSettingElement.getElementsByClassName('ty-transfer')[0];
      element.firstChild.style.display = 'none';
    },

    data() {
      return {
        importSettingsOptions: [],
        importSettings: [],
        exportSettingsOptions: [],
        exportSettings: [],
        settings: [],
        exportFileList: [],
        importStartObj: {startRow: 1, startColumn: 1},
        exportStartObj: {
          startRow: 1,
          startColumn: 1,
          exportRules: "name",
          exportModelInfo: {fileId: "", originalfile: ""}
        }
      };
    },

    methods: {
      initSetting() {
        if (this.showType === 'import') {
          this.initImportSetting();
        } else if (this.showType === 'export') {
          this.initExportSetting();
        }
      },
      initImportSetting() {
        for (let i = 0; i < this.itemReportSettings.importSettings.list.length; i++) {
          let listItem = this.itemReportSettings.importSettings.list[i];
          this.importSettings.push({
            id: listItem.model,
            name: listItem.name + '(' + listItem.model + ')',
            realName: listItem.name,
            excelName: listItem.excelName,
          });
        }
        this.colsArray.forEach(cr => {
          if (!this.KHUtils.isNull(cr.name)) {
            // 子表单,标签不再父表单结果列,导入导出中显示
            if (cr.type !== 'table' && cr.type !== 'flow_table' && cr.type !== 'text' && cr.type !== 'grid') {
              let excelObj = {};
              excelObj.id = cr.model;
              excelObj.name = cr.name + '(' + cr.model + ')';
              excelObj.realName = cr.name;
              excelObj.excelName = cr.name;
              excelObj.isSelected = false;
              let exist = false;
              for (let i = 0; i < this.itemReportSettings.importSettings.list.length; i++) {
                let listItem = this.itemReportSettings.importSettings.list[i];
                if (excelObj.id === listItem.model) {
                  exist = true;
                  break;
                }
              }
              if (!exist) {
                this.importSettingsOptions.push(excelObj);
              }
            }
          }
        });
      },
      initExportSetting() {
        for (let i = 0; i < this.itemReportSettings.exportSettings.list.length; i++) {
          let listItem = this.itemReportSettings.exportSettings.list[i];
          this.exportSettings.push({
            id: listItem.model,
            name: listItem.name + '(' + listItem.model + ')',
            realName: listItem.name,
            excelName: listItem.excelName,
          });
        }
        this.colsArray.forEach(cr => {
          if (!this.KHUtils.isNull(cr.name)) {
            // 子表单,标签不再父表单结果列,导入导出中显示
            if (cr.type !== 'table' && cr.type !== 'flow_table' && cr.type !== 'text' && cr.type !== 'grid') {
              let excelObj = {};
              excelObj.id = cr.model;
              excelObj.name = cr.name + '(' + cr.model + ')';
              excelObj.realName = cr.name;
              excelObj.excelName = cr.name;
              excelObj.isSelected = false;
              let exist = false;
              for (let i = 0; i < this.itemReportSettings.exportSettings.list.length; i++) {
                let listItem = this.itemReportSettings.exportSettings.list[i];
                if (excelObj.id === listItem.model) {
                  exist = true;
                  break;
                }
              }
              if (!exist) {
                this.exportSettingsOptions.push(excelObj);
              }
            }
          }
        });
      },

      // 保存报表导入设置
      saveImportSettings(targetList, cofig) {
        this.settings = [];
        if (targetList != null && targetList.length > 0) {
          targetList.forEach(obj => {
            let newObj = {};
            newObj.model = obj.id;
            newObj.excelName = obj.excelName;
            newObj.name = obj.realName;
            this.settings.push(newObj);
          });
        }
        if (this.checkImportSettingsExcelName(this.settings)) {
          this.$set(this.itemReportSettings.importSettings, 'list', this.settings);
          this.importSettings = JSON.parse(JSON.stringify(this.settings));
          this.$emit('closeAddReportSettingDialog');
        } else {
          this.$message({showClose: true, type: "warning", message: "映射报表列名存在相同的字段"});
        }
      },

      checkImportSettingsExcelName(importSettings) {
        for (let i = 0; i < importSettings.length; i++) {
          let listItem = importSettings[i];
          for (let j = 0; j < importSettings.length; j++) {
            let checkItem = importSettings[j];
            if (i !== j) {
              if (listItem.excelName === checkItem.excelName) {
                return false;
              }
            }
          }
        }
        return true;
      },

      // 保存报表导出设置
      saveExportSettings(targetList, cofig) {
        this.settings = [];
        if (targetList != null && targetList.length > 0) {
          targetList.forEach(obj => {
            let newObj = {};
            newObj.model = obj.id;
            newObj.excelName = obj.excelName;
            newObj.name = obj.realName;
            this.settings.push(newObj);
          });
        }
        this.itemReportSettings.exportSettings.list = [];
        this.itemReportSettings.exportSettings.list.push(...this.settings);
        this.exportSettings = JSON.parse(JSON.stringify(this.settings));
        this.$emit('closeAddReportSettingDialog');
      },

      filterExistReportSetting(settings) {
        let list;
        if (this.showType === 'import') {
          list = this.itemReportSettings.importSettings.list;
        } else if (this.showType === 'export') {
          list = this.itemReportSettings.exportSettings.list;
        }
        for (let i = 0; i < settings.length; i++) {
          let setting = settings[i];
          let exist = false;
          for (let j = 0; j < list.length; j++) {
            if (setting.model === list[j].model) {
              settings.splice(i, 1);
              i--;
              exist = true;
              break;
            }
          }
        }
      }
    }
  };
</script>

<style lang="scss" scoped>
  ::v-deep .setting-box {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
