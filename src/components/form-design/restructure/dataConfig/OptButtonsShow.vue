<template>
  <div>
    <div style="padding-left: 15px;padding-top: 10px">
      <el-checkbox :indeterminate="isOptIndeterminate" v-model="checkOptAll"
                   @change="handleOptCheckAllChange">
        <span>全选</span>
      </el-checkbox>
      <el-checkbox-group v-model="checkedOpt" @change="handleCheckedOptChange" class="checkbox-group">
        <el-checkbox v-for="op in opt" :key="op.key"  :label="op" :disabled="op.disabled">
          <div style="display: flex;flex-direction: row;align-items: center">
            <span class="checkbox-label" :title="op.label">{{op.label}}</span>
            <i class="el-icon-picture" v-if="op.imageId" style="padding-left: 5px"></i>
          </div>
        </el-checkbox>
        <el-popover
          placement="bottom"
          title="新增操作按钮"
          trigger="manual"
          v-model="addVisible">
          <template v-slot:default>
            <div style="display: flex;flex-direction: column">
              <div style="display:flex;flex-direction:row;align-items: center">
                <span style="margin-right: 15px">名称</span>
                <el-input style="width: 150px" v-model="optButtonStartObj.label"></el-input>
              </div>
              <div style="display: flex;flex-direction: row;margin-top: 10px;">
                <span style="margin-right: 15px">图标</span>
                <custom-upload class="custom-upload" ref="customUpload" @fromCustomChild="getFileIdFromCusUpload"></custom-upload>
              </div>
            </div>
            <div style="display: flex;flex-direction: row;justify-content: flex-end;margin-top: 5px;
            padding-top: 5px;border-top: 1px solid #E8E8E8">
              <el-button @click="closeAddPopover">取 消</el-button>
              <el-button type="primary" @click="saveAddOpt">确 定</el-button>
            </div>
          </template>
          <el-button slot="reference" type="primary" icon="el-icon-plus" circle @click="openAddPopover"></el-button>
        </el-popover>
      </el-checkbox-group>
    </div>
  </div>
</template>

<script>
  import CustomUpload from "@/components/CustomUpload";
  import {dialogConfig} from "@/config"
  export default {
    props: {
      itemDataOptButtons: {type: Array},
      colsArray: {type: Array},
    },
    components: {
      CustomUpload
    },
    data() {
      return {
        isOptIndeterminate: false,
        checkOptAll: false,
        checkedOpt: [],
        opt: [],
        optButtonStartObj: {key: "", label: "", imageId: ""},
        addVisible: false
      };
    },

    created() {
      this.initOptButtonData();
    },

    methods: {
      initOptButtonData() {
        let objArray = [
          {key: "edit", label: "编辑", displayConfig: {
            type: "0", // /0 弹窗 1普通页面
            dialogTitle: "", //标题
            dialogTop: dialogConfig.top || "10",
            dialogWidth:dialogConfig.width || "60", //宽度
            dialogHeight: dialogConfig.height ||"70", 
            dialogFullscreen:"0", //0非全屏 1全屏
          }},
          {key: "delete", label: "删除"}, 
          {key: "detail", label: "详情", displayConfig: {
            type: "0", // /0 弹窗 1普通页面
            dialogTitle: "", //标题
            dialogTop: dialogConfig.top || "10",
            dialogWidth:dialogConfig.width || "60", //宽度
            dialogHeight: dialogConfig.height ||"70", 
            dialogFullscreen:"0", //0非全屏 1全屏
          }},  
          {key: "export", label: "导出",exportModelInfo:[]}
        ];
        for (let i = 0; i < this.itemDataOptButtons.length; i++) {
          let optButton = this.itemDataOptButtons[i];
          if (optButton.key === 'edit') {
            objArray[0].disabled = true;
            this.checkedOpt.push(objArray[0]);
          } else if (optButton.key === 'delete') {
            objArray[1].disabled = true;
            this.checkedOpt.push(objArray[1]);
          }else if (optButton.key === 'detail') {
              objArray[2].disabled = true;
              this.checkedOpt.push(objArray[2]);
          }else if (optButton.key === 'export') {
              objArray[3].disabled = true;
              this.checkedOpt.push(objArray[3]);
          }
        }
        this.opt.push(...objArray);
        this.checkOptAll = this.checkedOpt.length === this.opt.length;
        this.isOptIndeterminate = this.checkedOpt.length > 0 && this.checkedOpt.length < this.opt.length;
      },

      // 操作按钮设置,全选
      handleOptCheckAllChange(val) {
        this.checkedOpt = val ? this.opt : [];
        this.isOptIndeterminate = false;
      },
      // 操作按钮设置,选择
      handleCheckedOptChange(value) {
        let checkedCount = value.length;
        this.checkOptAll = checkedCount === this.opt.length;
        this.isOptIndeterminate = checkedCount > 0 && checkedCount < this.opt.length;
      },

      getOptButtons() {
        let OptButtons = [];
        for (let i = 0; i < this.checkedOpt.length; i++) {
          let checkedOpt = this.checkedOpt[i];
          let exist = false;
          for (let j = 0; j < this.itemDataOptButtons.length; j++) {
            let btn = this.itemDataOptButtons[j];
            if (btn.key === checkedOpt.key) {
              exist = true;
            }
          }
          if (!exist) {
            OptButtons.push(this.checkedOpt[i]);
          }
        }
        return OptButtons;
      },

      getFileIdFromCusUpload(fileId) {
        if (!this.KHUtils.isNull(fileId)) {
          // 存储文件ID便于后续对文件访问的权限控制
          this.optButtonStartObj.imageId = fileId;
        }
      },

      closeAddPopover() {
        this.addVisible = false;
      },

      restOptButtonsKey() {
        let key = 1;
        for (let i = 0; i < this.itemDataOptButtons.length; i++) {
          let optButton = this.itemDataOptButtons[i];
          if (optButton.key !== 'edit' && optButton.key !== 'delete'&& optButton.key !== 'detail'&& optButton.key !== 'export') {
            optButton.key = key;
            key++;
          }
        }
      },

      saveAddOpt() {
        this.restOptButtonsKey();
        let optLen = this.opt.length - 2;
        let len = this.itemDataOptButtons.length + optLen + 1;
        this.optButtonStartObj.key = "button" + len;
        let newObj = JSON.parse(JSON.stringify(this.optButtonStartObj));
        this.opt.push(newObj);
        this.checkedOpt.push(newObj);
        this.optButtonStartObj = this.$options.data().optButtonStartObj;
        this.$refs['customUpload'].handleRemove();
        this.closeAddPopover();
      },

      openAddPopover() {
        this.addVisible = !this.addVisible;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .custom-upload {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
  }

  .checkbox-group {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }

  .checkbox-label {
    text-overflow: ellipsis;
    max-width: 200px;
    overflow: hidden;
  }
</style>
