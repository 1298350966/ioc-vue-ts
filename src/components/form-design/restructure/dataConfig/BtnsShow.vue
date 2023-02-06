<template>
  <div>
    <div style="padding-left: 15px;padding-top: 10px">
      <el-checkbox :indeterminate="isIndeterminate" v-model="checkAll" @change="handleCheckAllChange">
        <span>全选</span>
      </el-checkbox>
      <el-checkbox-group v-model="checkedBtns" @change="handleCheckedBtnsChange" class="checkbox-group">
        <el-checkbox v-for="btn in btns" :label="btn" :key="btn.key" :disabled="btn.disabled">
          <div style="display: flex;flex-direction: row;align-items: center">
            <span class="checkbox-label" :title="btn.label">{{ btn.label }}</span>
            <i class="el-icon-picture" v-if="btn.imageId" style="padding-left: 5px"></i>
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
                <el-input style="width: 150px" v-model="btnsStartObj.label"></el-input>
              </div>
              <div style="display: flex;flex-direction: row;margin-top: 10px;">
                <span style="margin-right: 15px">图标</span>
                <custom-upload class="custom-upload" ref="customUpload" @fromCustomChild="getFileIdFromCusUpload"></custom-upload>
              </div>
            </div>
            <div style="display: flex;flex-direction: row;justify-content: flex-end;margin-top: 5px;
            padding-top: 5px;border-top: 1px solid #E8E8E8">
              <el-button @click="closeAddPopover">取 消</el-button>
              <el-button type="primary" @click="saveAddBtn">确 定</el-button>
            </div>
          </template>
          <el-button slot="reference" type="primary" icon="el-icon-plus" style="margin-left: 20px" circle @click="openAddPopover"></el-button>
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
      itemDataBtns: {type: Array},
    },

    components: {
      CustomUpload
    },

    data() {
      return {
        isIndeterminate: false,
        checkAll: false,
        addVisible: false,
        checkedBtns: [],
        btns: [{
          label: "新增",
          key: "add",
          displayConfig: {
            type: "0", // /0 弹窗 1普通页面
            dialogTitle: "", //标题
            dialogTop: dialogConfig.top || "10",
            dialogWidth:dialogConfig.width || "60", //宽度
            dialogHeight: dialogConfig.height ||"70", 
            dialogFullscreen:"0", //0非全屏 1全屏
          }
        }, {
          label: "删除",
          key: "remove"
        }, {
          label: "导入",
          key: "import"
        }, {
          label: "导出",
          key: "export"
        }],
        btnsStartObj: {}
      };
    },

    created() {
      this.initBtnsData();
    },

    methods: {
      initBtnsData() {
        for (let i = 0; i < this.itemDataBtns.length; i++) {
          let btn = this.itemDataBtns[i];
          if (btn.key === 'add') {
            this.btns[0].disabled = true;
            this.checkedBtns.push(this.btns[0]);
          } else if (btn.key === 'remove') {
            this.btns[1].disabled = true;
            this.checkedBtns.push(this.btns[1]);
          } else if (btn.key === 'import') {
            this.btns[2].disabled = true;
            this.checkedBtns.push(this.btns[2]);
          } else if (btn.key === 'export') {
            this.btns[3].disabled = true;
            this.checkedBtns.push(this.btns[3]);
          }
        }
        this.checkAll = this.checkedBtns.length === this.btns.length;
        this.isIndeterminate = this.checkedBtns.length > 0 && this.checkedBtns.length < this.btns.length;
      },
      handleCheckAllChange(val) {
        this.checkedBtns = val ? this.btns : [];
        this.isIndeterminate = false;
      },

      handleCheckedBtnsChange(value) {
        let checkedCount = value.length;
        this.checkAll = checkedCount === this.btns.length;
        this.isIndeterminate = checkedCount > 0 && checkedCount < this.btns.length;
      },

      getCheckedBtns() {
        let checkedBtns = [];
        for (let i = 0; i < this.checkedBtns.length; i++) {
          let checkedBtn = this.checkedBtns[i];
          let exist = false;
          for (let j = 0; j < this.itemDataBtns.length; j++) {
            let btn = this.itemDataBtns[j];
            if (btn.key === checkedBtn.key) {
              exist = true;
            }
          }
          if (!exist) {
            checkedBtns.push(this.checkedBtns[i]);
          }
        }
        return checkedBtns;
      },

      getFileIdFromCusUpload(fileId) {
        if (!this.KHUtils.isNull(fileId)) {
          // 存储文件ID便于后续对文件访问的权限控制
          this.btnsStartObj.imageId = fileId;
        }
      },

      closeAddPopover() {
        this.addVisible = false;
      },

      openAddPopover() {
        this.addVisible = !this.addVisible;
      },

      saveAddBtn() {
        let btnLen = this.btns.length - 2;
        let len = this.itemDataBtns.length + btnLen + 1;
        this.btnsStartObj.key = "button" + len;
        let newObj = JSON.parse(JSON.stringify(this.btnsStartObj));
        this.btns.push(newObj);
        console.log(this.btns);
        this.btnsStartObj = this.$options.data().btnsStartObj;
        this.$refs['customUpload'].handleRemove();
        this.checkedBtns.push(newObj);
        this.closeAddPopover();
      }
    }
  };
</script>

<style scoped>
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
