<template>
  <div class="addOrEditForm">
    <el-tooltip v-if="!addOrEdit && item.enableQrCode" class="item QRCode" effect="dark" content="查看二维码" placement="top">
      <img src="@/assets/images/qr-code.png"
        @click="handleViewQrCode('edit')" />
    </el-tooltip>
    <template v-if="addOrEdit == true">
      <template v-if="tableShowType === 'transverse'">
        <form-build :data.sync="formConfig" :value.sync="dataModels" :addOrEdit.sync="addOrEdit" :allCols="allCols"
          :form-id="formId" ref="buildForm">
          <template v-slot:blank="scope">
            宽度：
            <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
            高度：
            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </form-build>

        <template v-if="tableFormConfig.length > 0">
          <el-tabs v-model="formActiveName">
            <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model" :key="item.model">
              <add-single-table :formId="formId" :item="item" :data-config="formConfig.config"
                :tableData="item.subData"></add-single-table>
            </el-tab-pane>
          </el-tabs>
        </template>
        <div class="buttonBox">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="saveAddData" :loading="nextLoading">保存</el-button>
        </div>

      </template>
      <template v-else>
        <portrait-restructure-form-build :data.sync="formConfig" :value.sync="dataModels" :addOrEdit.sync="addOrEdit"
          :allCols="allCols" :form-id="formId" :tableFormConfig="tableFormConfig" :parentBusinessId="parentBusinessId"
          ref="buildForm">
          <template v-slot:blank="scope">
            宽度：
            <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
            高度：
            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </portrait-restructure-form-build>
        <div class="buttonBox">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="saveAddData" :loading="nextLoading">保存</el-button>
        </div>

      </template>
    </template>
    <template v-if="addOrEdit == false">
      <template v-if="tableShowType === 'transverse'">
        <form-build :data.sync="formConfig" :value.sync="dataModels" :addOrEdit.sync="addOrEdit" :allCols="allCols"
          :form-id="formId" ref="buildForm">
          <template v-slot:blank="scope">
            宽度：
            <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
            高度：
            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </form-build>
        <div class="buttonBox">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="saveData" :loading="nextLoading" :disabled="parentSaveDisable">保存</el-button>
        </div>
        <template v-if="tableFormConfig.length > 0">
          <el-tabs v-model="formActiveName">
            <el-tab-pane v-for="item in tableFormConfig" :label="item.name" :name="item.model" :key="item.model">
              <single-table :item="item" :data-config="formConfig.config" :form-id="formId"
                :parent-id="parentBusinessId"></single-table>
            </el-tab-pane>
          </el-tabs>
        </template>
      </template>
      <template v-else>
        <portrait-restructure-form-build :data.sync="formConfig" :value.sync="dataModels" :addOrEdit.sync="addOrEdit"
          :allCols="allCols" :form-id="formId" :tableFormConfig="tableFormConfig" :parentBusinessId="parentBusinessId"
          ref="buildForm">
          <template v-slot:blank="scope">
            宽度：
            <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
            高度：
            <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
          </template>
        </portrait-restructure-form-build>
        <div class="buttonBox">
          <el-button @click="close">取消</el-button>
          <el-button type="primary" @click="saveData" :loading="nextLoading" :disabled="parentSaveDisable">保存</el-button>
        </div>
      </template>
    </template>

    <el-dialog title="二维码管理" custom-class="advanced-set-dialog" :visible.sync="qrCodeVisible" :append-to-body="true"
      :close-on-click-modal="false" :modal="false" width="600px">
      <qr-code-manager :formId="formId" :qrCodeType="qrCodeType" :dataId="businessId"
        v-if="qrCodeVisible"></qr-code-manager>
    </el-dialog>
  </div>
</template>

<script>
import FormBuild from "@/components/form-build/RestructureFormBuild";
import PortraitRestructureFormBuild from "@/components/form-build/PortraitRestructureFormBuild";
import SingleTable from "@/components/table/SingleTable";
import AddSingleTable from "@/components/table/AddSingleTable";
import QrCodeManager from '@/components/qr-code-set/QrCodeManager'
export default {
  props: ["formId","item","formTitle","addOrEdit", "tableShowType", "formConfig", "dataModels", "allCols", "tableFormConfig", "formActiveName", "parentBusinessId", "businessId",],
  components: {
    FormBuild,
    SingleTable,
    QrCodeManager,
    AddSingleTable,
    PortraitRestructureFormBuild,
  },
  data() {
    return {
      qrCodeType: "",
      qrCodeVisible: false,
      nextLoading: false,
      parentSaveDisable: false,
      hackReset: false,
    }
  },
  methods: {
    close(){
      this.$emit("close", false)
    },
    //查看二维码
    handleViewQrCode(qrCodeType) {
      this.qrCodeType = qrCodeType;
      this.qrCodeVisible = true
    },
    // 保存数据
    saveData() {
      let _this = this
      _this.$refs.buildForm.getData().then(formData => {
        _this.$confirm('确认保存吗？', '提示', {}).then(() => {
          let data = _this.KHUtils.clone(formData);
          _this.KHForm.formatDynCols(data, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
          let url;
          if (!_this.KHUtils.isNull(_this.businessId)) {
            // 业务ID
            data.id = _this.businessId;
            url = _this.khConfig.api.updateFormData
          } else {
            url = _this.khConfig.api.addFormData
          }
          _this.nextLoading = true;
          data.formId = _this.formId;
          let paramArray = [];
          Object.keys(data).forEach(function (key) {
            paramArray.push(key + "=" + data[key]);
          });
          paramArray = paramArray.join("&");
          _this.$Post(url + "/" + _this.formId, paramArray).then(res => {
            if (res.errCode === 0) {
              _this.$notify({
                title: '成功',
                message: '保存成功',
                type: 'success'
              });
            }
            _this.nextLoading = false;
            let flag = false;
            if (_this.formConfig.list) {
              _this.formConfig.list.forEach(obj => {
                if (obj.type === 'table') {
                  flag = true;
                  return false;
                }
              })
            }
            if (flag) {
              // 将业务ID与表单ID传递给子表单
              _this.parentSaveDisable = _this.formTitle !== '编辑'; // 含有子表单时,新增完禁用父表单的保存按钮
              let tempRow = _this.KHUtils.clone(data);
              _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
              // _this.dataModels = tempRow;
              Object.assign(this.dataModels,tempRow)
            } else {
              this.$emit("close", false)   // FormCustom 组件调用正常执行,如果是AddFormCustom则不正常关闭
            }
          })
        }).catch((e) => {
          console.log(e)
        });
      }).catch(() => {
      })
    },
    //保存新增数据
    saveAddData() {
      let _this = this;
      _this.$refs.buildForm.getData().then(data => {
        this.$confirm('确认保存吗？', '提示', {}).then(() => {
          let newData = JSON.parse(JSON.stringify(data));
          _this.KHForm.formatDynCols(newData, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
          let param = {
            parent: {},
            child: []
          }
          //this.checkMapData(newData);
          param.parent = newData;
          if (_this.tableFormConfig instanceof Array && _this.tableFormConfig.length > 0) {
            _this.tableFormConfig.forEach((table, index) => {
              if (!_this.KHUtils.isNull(table.key) && table.subData instanceof Array && table.subData.length > 0) {
                table.subData.forEach((tableData, index1) => {
                  _this.convertParam(tableData, table.tableColumns);
                })
                let newObj = {};
                newObj.subKey = table.key;
                //this.checkMapData(table.subData);
                //剔除为null的数据
                let newDatas = [];
                if (table.subData instanceof Array && table.subData.length > 0) {
                  table.subData.forEach((data, index) => {
                    let newObj = {};
                    Object.keys(data).forEach(function (key) {
                      if (data[key] != null) {
                        newObj[key] = data[key];
                      }
                    });
                    newDatas.push(newObj);
                  })
                }
                newObj.subDatas = newDatas;
                param.child.push(newObj);
              }
            })
          }
          _this.nextLoading = true;
          _this.$PostJson(_this.khConfig.api.addpcformdata + "/" + _this.formId, param).then(res => {
            _this.nextLoading = false;
            if (res.errCode === 0) {
              this.$message({
                message: '添加成功',
                type: 'success'
              });
              this.$emit("close", false)
            }
          })
        }).catch((e) => {
          console.log(e)
        });
      }).catch(() => {
      })

    },
    convertParam(object, list) {
      for (let key of Object.keys(object)) {
        if (list instanceof Array && list.length > 0) {
          let col = this.findColByKey(key, list);
          //选择控件传 0或1 不是true，false
          if (col && col.type === 'switch') {
            if (null !== object[key] && object[key] !== '' && object[key] !== undefined && typeof object[key] === 'boolean') {
              if (object[key]) {
                object[key] = "0";
              } else {
                object[key] = "1";
              }
            } else if (!this.KHUtils.isNull(object[key])) {

            } else {
              object[key] = '0';
            }
          }
        }
        let value = object[key];

        if (value instanceof Array) {
          object[key] = value.join(",");
        } else if (value instanceof Object) {
          for (let valueKey of Object.keys(value)) {
            object[valueKey] = value[valueKey];
          }
        }
      }
    },
    findColByKey(key, list) {
      if (list instanceof Array && list.length > 0) {
        for (var i = 0; i < list.length; i++) {
          let col = list[i];
          if (col.model == key) {
            return col;
          }
        }
      }
      return null;
    },
  }
}
</script>

<style lang="scss" scoped>

.buttonBox{
  margin-top: 20px;
  display: flex;
  justify-content: flex-end;  
}
</style>