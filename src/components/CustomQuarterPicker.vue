<template>
  <div>
    <mark
      style="position:fixed;top:0;bottom:0;left:0;right:0;background: transparent;z-index:999;"
      v-show="showSeason || showTenYear"
      @click.stop="close"
    ></mark>
    <el-input :placeholder="placeholder" @input="handleInputValue" :value="value_" style="width:100%;" size="mini" @focus="showSeason=true" clearable>
      <i slot="prefix" class="el-input__icon el-icon-date"></i>
    </el-input>
    <el-card
      class="box-card"
      style="width:322px;padding: 0 3px 20px;margin-top:10px;position:fixed;z-index:9999"
      v-show="showSeason"
    >
      <div slot="header" class="clearfix" style="text-align:center;padding:0">
        <button
          type="button"
          class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
          @click="prev"
        ></button>
        <span role="button" class="el-date-picker__header-label" @click="handleChangeTenYear">{{year}}年</span>
        <button
          type="button"
          @click="next"
          class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
        ></button>
      </div>
      <div class="text item" style="text-align:center;">
        <el-button
          type="text"
          size="medium"
          style="width:40%;color: #606266;float:left;"
          @click="selectSeason(0)"
        >第一季度
        </el-button>
        <el-button
          type="text"
          size="medium"
          style="float:right;width:40%;color: #606266;"
          @click="selectSeason(1)"
        >第二季度
        </el-button>
      </div>
      <div class="text item" style="text-align:center;">
        <el-button
          type="text"
          size="medium"
          style="width:40%;color: #606266;float:left;"
          @click="selectSeason(2)"
        >第三季度
        </el-button>
        <el-button
          type="text"
          size="medium"
          style="float:right;width:40%;color: #606266;"
          @click="selectSeason(3)"
        >第四季度
        </el-button>
      </div>
    </el-card>
    <el-card  class="box-card"
              style="width:322px;padding: 0 3px 20px;margin-top:10px;position:fixed;z-index:9999"
              v-show="showTenYear">
      <div slot="header" class="clearfix" style="text-align:center;padding:0">
        <button
          type="button"
          class="el-picker-panel__icon-btn el-date-picker__prev-btn el-icon-d-arrow-left"
          @click="prevTenYear"
        ></button>
        <span role="button" class="el-date-picker__header-label">{{yearScope}}年 - {{yearScope+9}}年</span>
        <button
          type="button"
          @click="nextTenYear"
          class="el-picker-panel__icon-btn el-date-picker__next-btn el-icon-d-arrow-right"
        ></button>
      </div>
      <div class="text item" style="text-align: center">
        <el-button v-for="(item,index) in 4" :key="index"
          type="text"
          size="medium"
          style="color: #606266;width: 20%"
          @click="selectYear(index)"
        >{{yearScope+index}}
        </el-button>
      </div>
      <div class="text item" style="text-align: center">
        <el-button v-for="(item,index) in 4" :key="index"
                   type="text"
                   size="medium"
                   style="color: #606266;width: 20%"
                   @click="selectYear(4+index)"
        >{{yearScope+4+index}}
        </el-button>
      </div>
      <div class="text item" style="text-align: center">
        <el-button v-for="(item,index) in 2" :key="index"
                   type="text"
                   size="medium"
                   style="color: #606266;width: 20%"
                   @click="selectYear(8+index)"
        >{{yearScope+8+index}}
        </el-button>
      </div>
    </el-card>
  </div>
</template>
<script>
  /**
   * @file:  View 组件 季节选择控件
   * @description: UI组件  可选择季节
   */
  export default {
    props: {
      valueArr: {
        default: () => {
          return ['01-03', '04-06', '07-09', '10-12']
        },
        type: Array
      },
      getValue: {
        default: () => {
        },
        type: Function
      },
      defaultValue: {
        default: '',
        type: String
      },
      value: {
        type: String
      },
      placeholder: {
        type: String
      }
    },
    data() {
      return {
        showSeason: false,
        showTenYear: false,
        season: '',
        yearScope: 0,
        year: new Date().getFullYear()
      }
    },
    created() {
      if (this.defaultValue) {
        let value = this.defaultValue;
        let arr = value.split('-');
        this.year = arr[0].slice(0, 4);
        let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6);
        let arrAll = this.valueArr;
        this.value_ = `${this.year}-0${arrAll.indexOf(str) + 1}`;
      }
    },
    watch: {
      defaultValue: function (value, oldValue) {
        let arr = value.split('-');
        this.year = arr[0].slice(0, 4);
        let str = arr[0].slice(4, 6) + '-' + arr[1].slice(4, 6);
        let arrAll = this.valueArr;
        this.value_ = `${this.year}-0${arrAll.indexOf(str) + 1}`;
      }
    },
    methods: {
      one() {
        this.showSeason = false;
      },
      prev() {
        this.year = this.year * 1 - 1;
      },
      next() {
        this.year = this.year * 1 + 1;
      },
      prevTenYear() {
        this.yearScope = this.yearScope * 1 - 10;

      },
      nextTenYear() {
        this.yearScope = this.yearScope * 1 + 10;
      },
      handleChangeTenYear() {
        let str = this.year.toString();
        let digits = parseInt(str.substring(str.length - 1));
        if (digits === 0) {
          this.yearScope = this.year;
        } else {
          let s = str.substring(0, str.length - 1) + '0';
          this.yearScope = parseInt(s);
        }
        this.showSeason = false;
        this.showTenYear = true;
      },
      selectYear(val) {
        this.showTenYear = false;
        this.year = this.yearScope + val;
        this.showSeason = true;
      },
      selectSeason(i) {
        let that = this;
        that.season = i + 1;
        let arr = that.valueArr[i].split('-');
        that.getValue(that.year + arr[0] + '-' + that.year + arr[1]);
        that.showSeason = false;
        this.value_ = `${this.year}-0${this.season}`;
      },
      change(val) {
        this.$emit('change', val);
      },
      close() {
        this.showSeason=false;
        this.showTenYear = false;
      },
      handleInputValue(val) {
        this.value_ = val;
      }
    },
    computed: {
      value_: {
        get() {
          if (!this.KHUtils.isNull(this.value)) {
            return this.value + '季度';
          }
          return this.value;
        },
        set(val) {
          val = val.split('季度')[0];
          this.$emit('input', val);
          this.change(val);
        }
      }
    }
  }
</script>
