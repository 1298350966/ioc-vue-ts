<template>
  <div class="selectRole">
    <el-dialog
      title="选择角色"
      :visible.sync="approverVisible"
      width="600px"
      append-to-body
      destroy-on-close
      class="promoter_person"
    >
      <div class="person_body clear">
        <div class="person_tree l">
          <el-checkbox
            :indeterminate="isIndeterminate"
            v-model="checkAll"
            @change="handleCheckAllChange"
            >全选</el-checkbox
          >
          <div style="margin: 15px 0"></div>
          <el-checkbox-group v-model="value" @change="handleCheckedCitiesChange">
            <div class="checkbox-group-box">
              <el-checkbox
                v-for="(item, index) in columnArray"
                :label="item"
                :key="index"
                >{{ item.roleName }}</el-checkbox
              >
            </div>
          </el-checkbox-group>
        </div>
        <div class="has_selected l">
          <div v-for="item in value" :key="item.id">
            <p>{{ item.roleName }}</p>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="approverVisible = false">取 消</el-button>
        <el-button type="primary" @click="sureApprover">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      columnArray: [],
      value: [],
      isIndeterminate: false,
      checkAll: false,
    };
  },
  computed: {
    approverVisible: {
      get() {
        return this.visible;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
    },
  },
  mounted() {
    this.listRoleHttp();
  },
  methods: {
    async listRoleHttp() {
      const { listRole } = this.khConfig.api;
      let res = await this.$Get(listRole);
      if (res == "error") return;
      this.columnArray = res.list;
    },
    sureApprover() {
      this.approverVisible = false;
      this.value = this.value.map((value) => {
        return {
          roleId: value.id,
          roleName: value.roleName,
        };
      });

      this.$emit("update:data", this.value);
      
    },
    handleCheckAllChange(val) {
      this.value = val ? this.columnArray : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnArray.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnArray.length;
    },
  },
};
</script>

<style lang="scss" scope>
.selectRole {
  .error_tip {
    position: absolute;
    top: 0px;
    right: 0px;
    transform: translate(150%, 0px);
    font-size: 24px;
  }
  .add-node-popover-body {
    display: flex;
  }
  .promoter_content {
    padding: 0 20px;
  }
  .condition_content .el-button,
  .copyer_content .el-button,
  .approver_self_select .el-button,
  .promoter_content .el-button,
  .approver_content .el-button {
    margin-bottom: 20px;
  }
  .promoter_content p {
    padding: 18px 0;
    font-size: 14px;
    line-height: 20px;
    color: #000000;
  }
  .promoter_person .el-dialog__body {
    padding: 10px 20px 14px 20px;
  }
  .person_body {
    display: flex;
    border: 1px solid #f5f5f5;
    height: 500px;
    overflow: hidden;
  }
  .person_tree {
    padding: 10px 12px 0 8px;
    width: 280px;
    height: 100%;
    border-right: 1px solid #f5f5f5;
    overflow: auto;
  }
  .person_tree input {
    padding-left: 22px;
    width: 210px;
    height: 30px;
    font-size: 12px;
    border-radius: 2px;
    border: 1px solid #d5dadf;
    background: url(~@/assets/images/flow/list_search.png) no-repeat 10px center;
    background-size: 14px 14px;
    margin-bottom: 14px;
  }
  .tree_nav span {
    display: inline-block;
    padding-right: 10px;
    margin-right: 5px;
    max-width: 6em;
    color: #38adff;
    font-size: 12px;
    cursor: pointer;
    white-space: nowrap;
    background: url(~@/assets/images/flow/jiaojiao.png) no-repeat right center;
  }
  .tree_nav span:last-of-type {
    background: none;
  }
  .person_tree ul,
  .has_selected ul {
    height: 420px;
    overflow-y: auto;
  }
  .person_tree li {
    padding: 5px 0;
  }
  .person_tree li i {
    float: right;
    padding-left: 24px;
    padding-right: 10px;
    color: #3195f8;
    font-size: 12px;
    cursor: pointer;
    background: url(~@/assets/images/flow/next_level_active.png) no-repeat 10px center;
    border-left: 1px solid rgb(238, 238, 238);
  }
  .person_tree li a.active + i {
    color: rgb(197, 197, 197);
    background-image: url(~@/assets/images/flow/next_level.png);
    pointer-events: none;
  }
  .person_tree img {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .has_selected {
    width: 275px;
    height: 100%;
    font-size: 12px;
    overflow: auto;
  }
  .has_selected ul {
    height: 460px;
  }
  .has_selected p {
    padding-left: 19px;
    padding-right: 20px;
    line-height: 37px;
    border-bottom: 1px solid #f2f2f2;
  }
  .has_selected p a {
    float: right;
  }
  .has_selected ul li {
    margin: 11px 26px 13px 19px;
    line-height: 17px;
  }
  .has_selected li span {
    vertical-align: middle;
  }
  .has_selected li img:first-of-type {
    width: 14px;
    vertical-align: middle;
    margin-right: 5px;
  }
  .has_selected li img:last-of-type {
    float: right;
    margin-top: 2px;
    width: 14px;
  }
  el-radio-group {
    padding: 20px 0;
  }
  .approver_content {
    padding-bottom: 10px;
    border-bottom: 1px solid #f2f2f2;
  }
  .approver_content .el-radio,
  .approver_some .el-radio,
  .approver_self_select .el-radio {
    width: 27%;
    margin-bottom: 20px;
  }
  .copyer_content .el-checkbox {
    margin-bottom: 20px;
  }
  .el-checkbox__label {
    font-size: 14px;
  }
  .condition_content,
  .copyer_content,
  .approver_self_select,
  .approver_manager,
  .approver_content,
  .approver_some {
    padding: 20px 20px 0;
  }
  .approver_manager p:first-of-type,
  .approver_some p {
    line-height: 19px;
    font-size: 14px;
    margin-bottom: 14px;
  }

  .approver_manager p {
    line-height: 32px;
  }
  .approver_manager select {
    width: 420px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .approver_manager p.tip {
    margin: 10px 0 22px 0;
    font-size: 14px;
    line-height: 16px;
    color: #f8642d;
  }
  .approver_self {
    padding: 28px 20px;
  }
  .selected_list {
    margin-bottom: 20px;
    line-height: 30px;
  }
  .selected_list span {
    margin-right: 10px;
    padding: 3px 6px 3px 9px;
    line-height: 12px;
    white-space: nowrap;
    border-radius: 2px;
    border: 1px solid rgba(220, 220, 220, 1);
  }
  .selected_list img {
    margin-left: 5px;
    width: 7px;
    height: 7px;
    cursor: pointer;
  }
  .approver_self_select h3 {
    margin: 5px 0 20px;
    font-size: 14px;
    font-weight: bold;
    line-height: 19px;
  }
  .condition_copyer .el-drawer__body .priority_level {
    position: absolute;
    top: 11px;
    right: 30px;
    width: 100px;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .condition_content p.tip {
    margin: 20px 0;
    width: 510px;
    text-indent: 17px;
    line-height: 45px;
    background: rgba(241, 249, 255, 1);
    border: 1px solid rgba(64, 163, 247, 1);
    color: #46a6fe;
    font-size: 14px;
  }
  .condition_content ul {
    max-height: 500px;
    overflow-y: scroll;
    margin-bottom: 20px;
  }
  .condition_content li > span {
    float: left;
    margin-right: 8px;
    width: 70px;
    line-height: 32px;
    text-align: right;
  }
  .condition_content li > div {
    display: inline-block;
    width: 370px;
  }
  .condition_content li:not(:last-child) > div > p {
    margin-bottom: 20px;
  }
  .condition_content li > div > p:not(:last-child) {
    margin-bottom: 10px;
  }
  .condition_content li > a {
    float: right;
    margin-right: 10px;
    margin-top: 7px;
  }
  .condition_content li select,
  .condition_content li input {
    width: 100%;
    height: 32px;
    background: rgba(255, 255, 255, 1);
    border-radius: 4px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .condition_content li select + input {
    width: 260px;
  }
  .condition_content li select {
    margin-right: 10px;
    width: 100px;
  }
  .condition_content li p.selected_list {
    padding-left: 10px;
    border-radius: 4px;
    min-height: 32px;
    border: 1px solid rgba(217, 217, 217, 1);
  }
  .condition_content li p.check_box {
    line-height: 32px;
  }
  .condition_list .el-dialog__body {
    padding: 16px 26px;
  }
  .condition_list p {
    color: #666666;
    margin-bottom: 10px;
  }
  .condition_list p.check_box {
    margin-bottom: 0;
    line-height: 36px;
  }

  .el-icon-edit {
    margin-left: 15px;
    font-size: 18px;
  }
}
</style>
