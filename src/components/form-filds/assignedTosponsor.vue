<template>
  <el-dialog
    title="选择关联控件"
    :visible.sync="approverVisible"
    width="600px"
    append-to-body
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
              >{{ item.name }}</el-checkbox
            >
          </div>
        </el-checkbox-group>
      </div>
      <!-- <div class="has_selected l">
        <div v-for="item in value" :key="item.id">
          <p>{{ item.name }}</p>
        </div>
      </div> -->
    </div>
    <!-- <el-transfer
    v-model="value"
    :props="{
      key: 'model',
      label: 'name'
    }"
    :data="columnArray"
    @change='change'>
  </el-transfer> -->
    <span slot="footer" class="dialog-footer">
      <el-button @click="approverVisible = false">取 消</el-button>
      <el-button type="primary" @click="sureApprover">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { mapState } from "vuex";
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
    columnList: {
      type: Array,
      default: function () {
        return [];
      },
    },
  },
  data() {
    return {
      columnArray: this.columnList,
      value: this.data,
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
        // 
        return this.$emit("update:visible", val);
      },
    },
    ...mapState({
      flowKey: (state) => state.workFlow.flowKey,
    }),
  },
  mounted() {
    // this.process_312Http();
  },
  methods: {
    handleCheckAllChange(val) {
      this.value = val ? this.columnArray : [];
      this.isIndeterminate = false;
    },
    handleCheckedCitiesChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.columnArray.length;
      this.isIndeterminate = checkedCount > 0 && checkedCount < this.columnArray.length;
    },
    async process_312Http() {
      const { queryapproveform } = this.khConfig.api;
      let res = await this.$Get(queryapproveform + "/" + this.flowKey);
      if (res == "error") return;
      ;
      this.columnArray = res.columnArray.map((value) => {
        return {
          name: value.name,
          checked: true,
          model: value.model,
          type: value.type,
          $$hashKey: `object:${Math.floor(Math.random() * 9999)}`,
        };
      });
    },
    sureApprover() {
      this.approverVisible = false;
      this.$emit("onData", JSON.parse(JSON.stringify(this.value)));
    },
  },
};
</script>

<style lang="scss" scoped>
.checkbox-group-box {
  display: flex;
  flex-flow: column;
}
</style>
