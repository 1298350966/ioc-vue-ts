<template>
  <el-dialog
    title="组织+角色"
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
      <el-form-item label="组织:">
        <!-- <el-input
          placeholder="输入关键字进行过滤"
          v-model="filterText"
          style="width: 50%"
        >
        </el-input> -->

        <!-- {{ orgList }} -->
        <el-tree
          class="filter-tree"
          :default-expand-all="false"
          node-key="id"
          :data="orgList"
          :props="defaultProps"
          show-checkbox
          :filter-node-method="filterNode"
          :check-strictly="true"
          @check="handleSave"
          ref="treeForm"
        >
        </el-tree>
        <!-- <el-tree
          class="filter-tree"
          :default-expand-all="false"
          node-key="id"
          :data="orgList"
          :props="defaultProps"
          :load="loadNode"
          lazy
          show-checkbox
          :filter-node-method="filterNode"
          :check-strictly="true"
          @check="handleSave"
          ref="treeForm"
        >
        </el-tree> -->
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
  },

  mounted() {
    this.listRoleHttp();
    this.listOrgTreeHttp();
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
    async listOrgTreeHttp() {
      const { listOrgTree } = this.khConfig.api;
      let res = await this.$Get(listOrgTree);
      this.orgList = res.departManage;
      console.log(res);
    },
    async listOrgByParentIdHttp(parentId) {
      let params = {
        parentId: parentId || "",
      };
      const { listOrgByParentId } = this.khConfig.api;
      let res = await this.$Get(listOrgByParentId, params);
      if (res == "error") return;
      if (parentId) {
        return res.list;
      } else {
        return res.list;
      }

      // 
      //   this.listUserByOrgIdHttp(parentId);
    },
    filterNode(value, data, node) {
      if (!value) return true;
      return data.orgName.indexOf(value) !== -1;
    },
    async loadNode(node, resolve) {
      let list = await this.listOrgByParentIdHttp(node.data.id);
      return resolve(list);
    },
    handleSave(data, checked) {
      //   this.$refs.tree.setCheckedKeys([]);
      var labvalojb = data; //暂存选中节点
      // console.log(data);
      this.$refs.treeForm.setCheckedKeys([]); //删除所有选中节点
      this.$refs.treeForm.setCheckedNodes([labvalojb]); //选中已选中节点
      // checked
      console.log(this.$refs.treeForm.getCheckedNodes(), checked);
      //   this.$emit("onData", {
      //     orgId: data.id,
      //     orgName: data.orgName,
      //   });
      //   this.approverVisible = false;
    },
    onSubmit() {
      let data = this.$refs.treeForm.getCheckedNodes();
      if (!this.roleObj) return this.error("请选择角色");
      if (data.length == 0) return this.error("请选择组织");
      //   ;
      this.$emit("onData", {
        orgId: data[0].id,
        orgName: data[0].orgName,
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
