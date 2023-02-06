<template>
  <el-row>
    <el-select v-model="value_" :placeholder="placeholder" size="mini">
      <i slot="prefix" class="el-input__icon el-icon-time"></i>
      <el-option
        v-for="(item,index) in hours"
        :key="item"
        :label="item"
        :value="item">
      </el-option>
    </el-select>
  </el-row>
</template>

<script>
  export default {
    props: ['placeholder','value'],
    data() {
      return {
        hours: ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10',
          '11', '12', '13', '14', '15', '16', '17', '18', '19', '20', '21', '22', '23']
      };
    },

    computed: {
      value_: {
        get() {
          return this.value;
        },
        set(val) {
          this.$emit('input', val);
          this.change(val);
        }
      }
    },

    methods: {
      change(val) {
        this.$emit('change', val);
      }
    }
  };
</script>

<style scoped>

</style>
