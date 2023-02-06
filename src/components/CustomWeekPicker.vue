<template>
  <el-row >
    <el-date-picker
      value-format="yyyy-MM-dd"
      format="yyyy-WW周"
      :picker-options="{'firstDayOfWeek': 1}"
      size="mini"
      style="width: 100%;height: 32px"
      v-model="value_"
      type="week"
      :placeholder="placeholder">
    </el-date-picker>
  </el-row>
</template>

<script>
  export default {
    props: ['placeholder', 'value'],

    data() {
      return {

      };
    },

    computed: {
      value_: {
        get() {
          if (this.KHUtils.isNull(this.value)) {
            return this.value;
          }
          let split = this.value.split('-');
          let year = split[0];
          let week = split[1];
          var startdate = new Date(year + '-1' + '-1')
          var date = startdate.getDay();
          var start = 1 + (week - 1) * 7 - (date - 1);
          startdate.setDate(startdate.getDate() + start - 1)
          return startdate;
        },
        set(val) {
          if (this.KHUtils.isNull(val)) {
            this.$emit('input', null);
            this.change(null);
          } else {
            let date = new Date(val);
            //周几
            let weekday = date.getDay() || 7;
            //周1+5天=周六
            date.setDate(date.getDate() - weekday + 1 + 5);
            let firstDay = new Date(date.getFullYear(), 0, 1);
            let dayOfWeek = firstDay.getDay();
            let spendDay = 1;
            if (dayOfWeek != 0) {
              spendDay = 7 - dayOfWeek + 1
            }
            firstDay = new Date(date.getFullYear(), 0, 1 + spendDay);
            let d = Math.ceil((date.valueOf() - firstDay.valueOf()) / 86400000);
            let result = Math.ceil(d / 7) + 1;
            if (result < 10) {
              result = '0' + result;
            }
            let formatValue = date.getFullYear() + "-" + result;
            this.$emit('input', formatValue);
            this.change(formatValue);
          }
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
