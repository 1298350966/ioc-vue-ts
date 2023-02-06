<template>
    <div>
       <template v-if="item.opt=='$in'">
         <el-date-picker v-if="start" class="query-widget-style"
                         type="month"
                         v-model="item.bvalue"
                         placeholder="请选择">
         </el-date-picker>
         <el-date-picker v-if="!start" class="query-widget-style"
                         type="month"
                         v-model="item.evalue"
                         placeholder="请选择">
         </el-date-picker>
       </template>
        <template v-else>
          <template  v-if="item.type==='input_number' || item.type==='input_int' || item.type==='input_long'
             || item.type==='input_mobile' || item.type==='input_tel' || item.type==='input_mail' || item.type==='input_postal' || item.type==='input_website'
             ||item.type === 'input' || item.type === 'region_select' || item.type === 'gis_select' || item.type === 'data_select'  || item.type === 'org_select' || item.type ==='user_select'
             || item.type === 'company_select' || item.type === 'role_select' || item.type === 'dic_select'">
            <el-input class="query-widget-style"
                      v-model="item.value"
                      placeholder=""
            >
            </el-input>
          </template>
          <template v-if="item.type === 'textarea'">
            <el-input type="textarea"
                      v-model="item.value"
            ></el-input>
          </template>
          <template v-if="item.type === 'number'">
            <el-input-number
              v-model="item.value"
            ></el-input-number>
          </template>
        </template>
      <template v-if="item.type === 'radio'">
        <el-radio-group v-model="item.value">
          <el-radio
            v-for="(radioItem, index) in item.options"
            :label="radioItem.value"
            :key="index">
            <template >{{radioItem.label}}</template>
          </el-radio>
        </el-radio-group>
      </template>
      <template v-if="item.type === 'checkbox'">
        <!--特别注意-->
        <el-checkbox-group v-model="item.defaultValue">
          <el-checkbox
            :label="checkboxItem.value"
            v-for="(checkboxItem, index) in item.options"
            :key="index">
            <template>{{checkboxItem.label}}</template>
          </el-checkbox>
        </el-checkbox-group>
      </template>
      <template v-if="item.type === 'time'">
        <el-time-picker
          v-model="item.value"
        >
        </el-time-picker>
      </template>
      <template
        v-if="item.type === 'date' || item.type === 'year' || item.type === 'month' || item.type === 'year_month'">
        <el-date-picker
          v-model="item.value"
          :type="getDataType(item.type)"
          :format="getDateFormatType(item.type)"
          :value-format="getDateValueFormat(item.type)"
        >
        </el-date-picker>
      </template>
      <template v-if="item.type === 'datetime'">
        <el-date-picker
          v-model="item.value"
          type="datetime"
          :format="getDateFormatType(item.type)"
          :value-format="getDateValueFormat(item.type)"
        >
        </el-date-picker>
      </template>


    </div>
</template>

<script>
  export default {
    name: "FormQueryWidgetItem",
    props: {
       item: {required: true, type: Object},
       start: {required: false, type: Boolean},
    },
    data(){
      return {
         isShow:true,
        array:[]
      }
    },
    computed: {
        getDataType(){
          return function (type) {
            if(type == "year"){
                return "year";
            }else if(type == "month"){
              return "month"
            }else if(type == "year_month"){
                return "month"
            }else if(type == "date"){
                return "date";
            }
          }
        },
      getDateFormatType(){
        return function (type) {
          if(type == "year"){
            return "year";
          }else if(type == "month"){
            return "month"
          }else if(type == "year_month"){
            return "month"
          }else if(type == "date"){
            return "date";
          }
        }
      },
      getDateValueFormat(){
        return function (type) {
          if (type == "year") {
            return "yyyy";
          }
          if (type == "month") {
            return "yyyy-MM";
          }
          if (type == "day") {
            return "yyyy-MM-dd";
          }
          if (type == "hour") {
            return "HH";
          }
          if (type == "minute") {
            return "HH:mm";
          }
          if (type == "second") {
            return "HH:mm:ss";
          }
          if (type == "ymdhms") {
            return "yyyy-MM-dd HH:mm:ss";
          }

        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  .queryTitle {
    margin-bottom: 5px;
    margin-top: 5px;
    font-size: 10pt;
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
    width: 205px;
  }

  .leftTitle {
    line-height: 32px;
    // width: 100px;
    max-width: 200px;
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;

  }

  ::v-deep .myLeftTitle.el-col-24 {
    width: auto;
  }

  .el-input__inner {
    background-color: red;
  }

  .col-first {
    //  width: auto;
    margin-bottom: 10px;
  }

  .col-first-width-auto {
    width: auto;
    margin-bottom: 5px;
    margin-top: 5px;
  }

  .number-select {
    width: 60px;
  }

  .number-input {
    width: 140px;;
  }

  .item-width {
    width: 100px;
  }

  .item-big-width {
    width: 205px;
  }

  .item-date-width {
    width: 155px;
  }

  .item-date-text-width {
    width: 50px;
    line-height: 32px;
    background-color: #F8F8FA;
    margin-right: 2px;
  }

  .item-margin-left {
    margin-left: 5px;
  }

  .item-line-height {
    line-height: 32px;
  }

  .item-height {
    height: 32px;
  }

  .el-input--suffix .el-input__inner {
    padding-right: 0px;
  }

  .no-query-widget {
    width: 100%;
    height: 50px;
    line-height: 50px;
    text-align: center;
    color: #409EFF;
  }

  .el-date-editor.el-input, .el-date-editor.el-input__inner {
    width: 100%;
  }

  .connectLine {
    margin-left: 3px;
    margin-right: 3px;
  }

  .query-widget-style {
    // 未选中任何选项的时候 placeholder的样式 需要先选中父元素 增加权重
    ::v-deep input::-webkit-input-placeholder {
      color: #D8D8DA;
    }
    ::v-deep input::-moz-input-placeholder {
      color: #D8D8DA;
    }
    ::v-deep input::-ms-input-placeholder {
      color: #D8D8DA;
    }

    //修改的是el-input的样式
    //一种方法是设置最里层el-input__inner的背景色 外层的两级父元素设置为透明色
    //另一种方法是从el-select到el-input__inenr的背景色都设置为需要的颜色
    ::v-deep .el-select,
    ::v-deep .el-input,
    ::v-deep .el-input__inner {
      background-color: #F8F8FA;
      border: 0px;
      border-radius: 0px;
      /*text-align: center;*/
      color: #575757;
    }

    //el-input聚焦的时候 外层的border会有一个样式
    ::v-deep .el-select .el-input.is-focus .el-input__inner {
      border: 0px;
    }

    //修改的是el-input上下的小图标的颜色
    ::v-deep .el-select .el-input .el-select__caret {
      color: #fff;
    }

    //修改总体选项的样式 最外层
    ::v-deep .el-select-dropdown {
      background-color: #ffffff;
      margin: 0px;
      border: 0px;
      border-radius: 0px;
    }

    //修改单个的选项的样式
    ::v-deep .el-select-dropdown__item {
      background-color: transparent;
      color: black;
    }

    //item选项的hover样式
    ::v-deep .el-select-dropdown__item.hover,
    ::v-deep .el-select-dropdown__item:hover {
      color: #409eff;
    }

    //修改的是下拉框选项内容上方的尖角
    ::v-deep .el-popper .popper__arrow, .el-popper .popper__arrow::after {
      display: none;
    }

  }

</style>
