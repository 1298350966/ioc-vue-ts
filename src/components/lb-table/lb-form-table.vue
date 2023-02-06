/*
* FileName: lb-table.vue
* Remark: element table
* Project: lb-element-table
* Author: LiuBing
* File Created: Tuesday, 19th March 2019 9:55:27 am
* Last Modified: Tuesday, 19th March 2019 9:55:34 am
* Modified By: LiuBing
*/

<template xmlns:el-row="http://www.w3.org/1999/xhtml">
  <div class="lb-table">
    <el-container style="height: 100%;" :id="'tableContainer'+widgetId">
      <el-main style="padding: 0px;overflow: hidden;" >
        <el-table :id="'table'+widgetId"
                  ref="elTable"
                  v-bind="$attrs"
                  v-on="$listeners"
                  :data="data"
                  :height="tableHeight"
                  border
                  :stripe="isShowStripe"
                  :row-style="rowStyle"
                  :cell-style="cellStyle"
                  :header-cell-style="tableHeaderStyle"
                  @selection-change="handleSelectionChange"
                  @row-click="rowClick"
                  :span-method="this.merge ? this.mergeMethod : this.spanMethod">
          <el-table-column type="selection" width="55px" v-if="isShowChecked && column.length>0"></el-table-column>
          <el-table-column label="序号" width="60px" type="index" v-if="isShowSeq"></el-table-column>
          <lb-column v-bind="$attrs"
                     v-for="(item, index) in column"
                     :key="index"
                     :column="item">
          </lb-column>
        </el-table>
      </el-main>
      <el-footer  v-if="pagination">
        <el-row :span="24">
          <el-col :span="24">
            <el-pagination class="lb-table-pagination" :id="'pagination'+widgetId"
                           v-bind="$attrs"
                           v-on="$listeners"
                           @current-change="paginationCurrentChange"
                           :style="{ 'margin-top': paginationTop, 'text-align': paginationAlign,'float':paginationAlign }">
            </el-pagination>
          </el-col>
        </el-row>
      </el-footer>
    </el-container>


  </div>
</template>

<script>
  import LbColumn from './lb-column'
  export default {
    props: {
      column: Array,
      data: Array,
      customOptList: Array,
      drillNavigation: Array,
      spanMethod: Function,
      pagination: {
        type: Boolean,
        default: false
      },
      paginationTop: {
        type: String,
        default: '15px'
      },
      paginationAlign: {
        type: String,
        default: 'right'
      },
      merge: Array,
      tableStyle: Object,
      widgetId: Number,
      pageListener:Number,
      isExport:Boolean,
      isShowChecked:Boolean,
      isShowSeq:Boolean,
      isShowStripe:Boolean,
      isShowOpt:{
        type: Boolean,
        default: true
      },
      isShowOptEdit:Boolean,
      isShowOptDelete:Boolean,
    },
    components: {
      LbColumn
    },
    data () {
      return {
        mergeLine: {},
        mergeIndex: {},
        tableHeight:"100%",
      }
    },
    created () {
      this.getMergeArr(this.data, this.merge)
    },
    mounted(){
      let _this = this;
      setTimeout(() => {
        _this.initTableBorderStyle();
      }, 10);

      setTimeout(() => {
        this.initPaginationStyle();
      }, 100);
      setTimeout(() => {
        this.initTableHoverStyle();
      }, 100);

    },
    computed: {
      dataLength () {
        return this.data.length
      }
    },
    methods: {
        rowClick(row, column){
            this.$emit('rowClick', row,column);
        },
      handleSelectionChange(array){
        this.$emit('handleSelectionChange', array);
      },
      handleEdit(row){
        this.$emit('handleEdit', row);
      },
      batchDel(row){
        this.$emit('batchDel', row);
      },
      handleCustomJump(row,opt){
        this.$emit('handleCustomJump', row,opt);
      },
      initTableHoverStyle(){
        let _this = this;
        var table = document.getElementById("table" + _this.widgetId);
        if(table != null){
          var tr =  table.getElementsByClassName("el-table__row");
          if(tr == null || tr.length<=0){
            return false;
          }
          let backgroundColor = this.tableStyle.tableBodyStyle.backgroundColor;
          let backgroundColorHover = this.tableStyle.tableBodyStyle.backgroundColorHover;
          for(var i = 0;i<tr.length;i++){
            tr[i].onmouseover = function () {
              //设置其背景颜色为黄色
              // this.setAttribute("style","background-color:"+backgroundColorHover);
              this.style.backgroundColor = backgroundColorHover;


            };
            //为li注册鼠标离开事件
            tr[i].onmouseout = function () {
              //恢复到这个标签默认的颜色
              //this.setAttribute("style","background-color:"+backgroundColor);
              if(backgroundColor){
                this.style.backgroundColor = backgroundColor;
              }else {
                this.style.backgroundColor = '#FFFFFF';
              }

            };
          }
        }
      },
      initPaginationStyle(){
        let _this = this;
        if (_this.tableStyle.tablePaginationStyle) {
          var pagination = document.getElementById("pagination" + _this.widgetId);
          if(pagination != null){
            var paginationTotal = pagination.getElementsByClassName("el-pagination__total")[0];
            var paginationJump = pagination.getElementsByClassName("el-pagination__jump")[0];
            paginationTotal.setAttribute("style", "color:" + _this.tableStyle.tablePaginationStyle.fontColor);
            paginationJump.setAttribute("style", "color:" + _this.tableStyle.tablePaginationStyle.fontColor);
            var btnPrev = pagination.getElementsByClassName("btn-prev")[0];
            var btnNext = pagination.getElementsByClassName("btn-next")[0];
            btnPrev.setAttribute("style", "background-color:" + _this.tableStyle.tablePaginationStyle.buttonStyle.backgroundColor + ";color:" + _this.tableStyle.tablePaginationStyle.buttonStyle.fontColor);
            btnNext.setAttribute("style", "background-color:" + _this.tableStyle.tablePaginationStyle.buttonStyle.backgroundColor + ";color:" + _this.tableStyle.tablePaginationStyle.buttonStyle.fontColor);
            var pager = pagination.getElementsByClassName("el-pager")[0];
            var lis = pager.getElementsByTagName("li");
            for (var i = 0; i < lis.length; i++) {
              lis[i].setAttribute("style", "background-color:" + _this.tableStyle.tablePaginationStyle.buttonStyle.backgroundColor + ";color:" + _this.tableStyle.tablePaginationStyle.buttonStyle.fontColor)
            }
            var btnActive = pager.getElementsByClassName("number active")[0];
            btnActive.setAttribute("style", "background-color:" + _this.tableStyle.tablePaginationStyle.buttonActiveStyle.backgroundColor + ";color:" + _this.tableStyle.tablePaginationStyle.buttonActiveStyle.fontColor);

            var input = pagination.getElementsByClassName("el-input__inner")[0];
            input.setAttribute("style", "border: " + _this.tableStyle.tablePaginationStyle.inputStyle.borderWidth + " solid " + _this.tableStyle.tablePaginationStyle.inputStyle.borderColor + ";background-color:" + _this.tableStyle.tablePaginationStyle.inputStyle.backgroundColor + ";color:" + _this.tableStyle.tablePaginationStyle.inputStyle.fontColor)

          }

        }
      },
      initTableBorderStyle(){
        let _this = this;
        var table = document.getElementById("table" + _this.widgetId);
        if(table != null){
          let boderSize = '1px'
          let boderColor = null;
          if (_this.tableStyle.tableBorderStyle) {
            boderSize = _this.tableStyle.tableBorderStyle.boderSize;
            boderColor = _this.tableStyle.tableBorderStyle.boderColor;
          }
          table.setAttribute("style", " border:" + boderSize + " solid " + boderColor);

          var row = document.getElementById("btn"+_this.widgetId);
          var btns = row.getElementsByClassName("el-button");
          for(var i = 0;i<btns.length;i++){
            btns[i].setAttribute("style","background-color:"+_this.tableStyle.tableBorderStyle.btnBgColor+";color:"+_this.tableStyle.tableBorderStyle.btnFontColor+";border:0px");
          }
        }
      },

      rowStyle({row, rowIndex}) {
        return {
          color: this.tableStyle.tableBodyStyle.cellColor,
          backgroundColor: this.tableStyle.tableBodyStyle.backgroundColor,
          fontSize: this.tableStyle.tableBodyStyle.cellFontSize,
          height: this.tableStyle.tableBodyStyle.cellHeight + 'px'

        }
      },
      cellStyle({row, rowIndex}) {
        return {
          // border: '1px solid '+this.tableStyle.tableBodyStyle.cellBorderColor,
          borderBottom: '1px solid ' + this.tableStyle.tableBodyStyle.cellBorderColor,
          borderRight: '1px solid ' + this.tableStyle.tableBodyStyle.cellBorderColor,
          textAlign: this.tableStyle.tableBodyStyle.cellPosition,

        }
      },
      tableHeaderStyle({row, column, rowIndex, columnIndex}){
        return {
          color: this.tableStyle.tableHeaderStyle.cellColor,
          backgroundColor: this.tableStyle.tableHeaderStyle.backgroundColor,
          fontSize: this.tableStyle.tableHeaderStyle.cellFontSize,
          borderBottom: '1px solid ' + this.tableStyle.tableHeaderStyle.cellBorderColor,
          borderRight: '1px solid ' + this.tableStyle.tableHeaderStyle.cellBorderColor,
          //border: '1px solid '+this.tableStyle.tableHeaderStyle.cellBorderColor,
          textAlign: this.tableStyle.tableHeaderStyle.cellPosition,
          height: this.tableStyle.tableHeaderStyle.cellHeight + 'px'
        }

      },
      clearSelection () {
        this.$refs.elTable.clearSelection()
      },
      toggleRowSelection (row, selected) {
        this.$refs.elTable.toggleRowSelection(row, selected)
      },
      toggleAllSelection () {
        this.$refs.elTable.toggleAllSelection()
      },
      toggleRowExpansion (row, expanded) {
        this.$refs.elTable.toggleRowExpansion(row, expanded)
      },
      setCurrentRow (row) {
        this.$refs.elTable.setCurrentRow(row)
      },
      clearSort () {
        this.$refs.elTable.clearSort()
      },
      clearFilter (columnKey) {
        this.$refs.elTable.clearFilter(columnKey)
      },
      doLayout () {
        this.$refs.elTable.doLayout()
      },
      sort (prop, order) {
        this.$refs.elTable.sort(prop, order)
      },
      paginationCurrentChange (val) {
        this.$emit('p-current-change', val);
      },
      getMergeArr (tableData, merge) {
        if (!merge) return
        this.mergeLine = {}
        this.mergeIndex = {}
        merge.forEach((item, k) => {
          tableData.forEach((data, i) => {
            if (i === 0) {
              this.mergeIndex[item] = this.mergeIndex[item] || []
              this.mergeIndex[item].push(1)
              this.mergeLine[item] = 0
            } else {
              if (data[item] === tableData[i - 1][item]) {
                this.mergeIndex[item][this.mergeLine[item]] += 1
                this.mergeIndex[item].push(0)
              } else {
                this.mergeIndex[item].push(1)
                this.mergeLine[item] = i
              }
            }
          })
        })
      },
      mergeMethod ({row, column, rowIndex, columnIndex}) {
        const index = this.merge.indexOf(column.property)
        if (index > -1) {
          const _row = this.mergeIndex[this.merge[index]][rowIndex]
          const _col = _row > 0 ? 1 : 0
          return {
            rowspan: _row,
            colspan: _col
          }
        }
      },

    },
    watch: {
      merge () {
        this.getMergeArr(this.data, this.merge)
      },
      dataLength () {
        this.getMergeArr(this.data, this.merge)
      },
      tableStyle: {
        deep: true,
        handler() {
          this.initTableBorderStyle();
          this.initPaginationStyle();
          this.initTableHoverStyle();
        }
      },

      pageListener:{
        deep: true,
        handler() {
          setTimeout(() => {
            this.initPaginationStyle();
          }, 100);

        }
      },
      data:{
        deep: true,
        handler() {
          setTimeout(() => {
            this.initTableHoverStyle();
          }, 100);


        }
      },
    }
  }

</script>
<style lang="scss" scoped>
  ::v-deep
  .el-table th {
    white-space: nowrap;
    overflow: hidden;
    -moz-user-select: text;
    -webkit-user-select: text;
    -ms-user-select: text;
    user-select: text;
    text-align: center;
  }

  ::v-deep
  .el-table .cell {
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    white-space: nowrap;
    word-break: break-all;
    line-height: 23px;
  }

  ::v-deep
  .el-table--border, .el-table--group {
    border: 0px solid #EBEEF5;
  }
  ::v-deep .el-table--enable-row-hover .el-table__body tr:hover>td {
        background-color: transparent;
        }



</style>
