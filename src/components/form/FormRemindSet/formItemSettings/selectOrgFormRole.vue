<template>
  <el-dialog
    title="表单内部门控件值+角色"
    custom-class="selectPeople"
    :visible.sync="approverVisible"
    append-to-body
    destroy-on-close
    class="promoter_person"
  >
    <el-form label-width="auto">
      <el-form-item label="角色:">
        <el-select value-key="id" v-model="roleObj" placeholder="请选择">
          <el-option
            v-for="item in roleLsit"
            :key="item.id"
            :label="item.roleName"
            :value="item"
          >
          </el-option>
        </el-select>
      </el-form-item>

      <el-form-item label="表单中选择:">
        <el-select value-key="model" v-model="model" placeholder="请选择">
          <el-option
            v-for="item in orgSelect"
            :key="item.value"
            :label="item.name"
            :value="item.model"
          >
          </el-option>
        </el-select>
      </el-form-item>
    </el-form>
    <div slot="footer" class="dialog-footer">
      <el-button type="danger" @click="approverVisible = false">取消</el-button>
      <el-button type="primary" @click="onSubmit">提交</el-button>
    </div>
  </el-dialog>
</template>

<script>
export default {
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
    selectType: {
      type: Number,
      default: 0,
    },
    data: {
      type: Array,
      default: function () {
        return [];
      },
    },
    colsArray:{
      type: Array,
      default: () => {
        return [];
      },
    },
  },
  data() {
    return {
      orgList: [],
      defaultProps: {
        children: "children",
        label: "orgName",
      },
      filterText: "",
      roleLsit: [],
      roleObj: "",
      model: "",
    };
  },
  computed: {
    approverVisible: {
      get() {
        return this.visible;
        // return true;
      },
      set(val) {
        return this.$emit("update:visible", val);
      },
    },
    orgSelect() {
      if (!this.colsArray) return [];
      return this.colsArray.filter((value, index, array) => {
        return value.type == "org_select";
      });
    },
  },

  mounted() {
    this.listRoleHttp();
    // if (this.data) {
    //   this.roleObj = {
    //     roleId: this.data.roleId,
    //     roleName: this.data.roleName,
    //   };

    //   setCheckedNodesthis.$refs.treeForm.setCheckedNodes([
    //     { id: this.data.orgId, orgName: this.data.orgName },
    //   ]);
    // }
  },
  methods: {
    async listRoleHttp() {
      const { listRole } = this.khConfig.api;
      let res = await this.$Get(listRole);
      if (res == "error") return;
      this.roleLsit = res.list;
    },

    onSubmit() {
      if (!this.roleObj.id) return this.error("请选择角色");
      if (!this.model) return this.error("请选择表单中字段");

      this.$emit("onData", {
        model: this.model,
        roleId: this.roleObj.id,
        roleName: this.roleObj.roleName,
      });
      this.approverVisible = false;
    },
    error(message) {
      this.$notify.error({
        title: "提示",
        message: message,
      });
    },
  },
};
</script>

<style>
.selectOrganization {
}
</style>
