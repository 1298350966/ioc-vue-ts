<template>
  <div class="show-type-box">
    <!-- <div class="add-box">
      <span style="margin-right: 15px">新增页面设置</span>
      <el-radio label="pop" v-model="addShowType">弹窗</el-radio>
      <el-radio label="normal" v-model="addShowType">普通页面</el-radio>
      <el-radio label="full" v-model="addShowType">全屏页面</el-radio>
    </div> -->
    <div class="table-box">
      <span style="margin-right: 15px">子表单设置</span>
      <el-radio label="transverse" v-model="tableShowType">横向</el-radio>
      <el-radio label="portrait" v-model="tableShowType">纵向</el-radio>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    itemShowType: {type: Object}
  },

  created() {
    this.addShowType = this.itemShowType.addShowType;
    this.tableShowType = this.itemShowType.tableShowType;
  },

  data() {
    return {
      addShowType: "",
      tableShowType: ""
    };
  },

  methods: {
    saveShowTypeConfig() {
      this.itemShowType.addShowType = this.addShowType;
      this.itemShowType.tableShowType = this.tableShowType;
    }
  }
};
</script>

<style lang="scss" scoped>
  .show-type-box {
    display: flex;
    flex-direction: column;
    height: 100px;
  }
  .add-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }
  .table-box {
    display: flex;
    flex-direction: row;
    align-items: center;
    flex: 1;
  }
</style>
