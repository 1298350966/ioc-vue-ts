<template>
  <div>
    <span>主题类型：</span>
    <el-select style="margin-bottom: 15px" v-model="currentType" placeholder="请选择">
      <el-option
        v-for="option in typeOptions"
        :key="option.value"
        :label="option.label"
        :value="option.value">
      </el-option>
    </el-select>
    <theme-list-show :currentType="currentType"></theme-list-show>
  </div>
</template>

<script>
  import ThemeListShow from "@/components/theme/ThemeListShow";
  export default {
    components: {
      ThemeListShow
    },

    data() {
      return {
        currentType: 5,
        typeOptions: [{
          label: '全部',
          value: 5,
        }, {
          label: '表单',
          value: 0
        }, {
          label: '表单新增',
          value: 1
        }, {
          label: '报表',
          value: 2
        }]
      };
    }
  };
</script>

<style scoped>

</style>
