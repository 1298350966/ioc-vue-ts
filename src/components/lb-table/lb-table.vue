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
  <div class="lb-table" style="height: 100%">
    <el-container style="height: 100%;background-color: transparent" :id="'tableContainer'+tableId">
      <el-main style="padding: 0px;background-color: transparent">
        <el-table :id="'table'+tableId"
                  ref="elTable"
                  v-bind="$attrs"
                  v-on="$listeners"
                  :data="data"
                  :maxHeight="tableHeight"
                  border
                  :row-style="rowStyle"
                  :cell-style="cellStyle"
                  :header-cell-style="tableHeaderStyle"
                  :span-method="this.merge ? this.mergeMethod : this.spanMethod">
          <lb-column v-bind="$attrs"
                     v-for="(item, index) in column"
                     :key="index"
                     :column="item">
          </lb-column>
        </el-table>
      </el-main>
      <el-footer :style="{'height':(isExport ? '90px': '60px' )}" v-if="pagination || (drillNavigation && drillNavigation.length>0)">
        <el-row :span="24">
          <el-col :span="12">
            <el-breadcrumb :id="'breadcrumb'+tableId" class="dib fs14 fw ml5" separator-class="el-icon-arrow-right"
                           style="margin:5px;padding-top: 15px">
              <el-breadcrumb-item v-for="(item,key) in drillNavigation" :key="key" style="margin-top: 5px"><a
                @click="back(item,key)">{{item.label}}</a></el-breadcrumb-item>
            </el-breadcrumb>
          </el-col>
          <el-col :span="12">
            <el-pagination class="lb-table-pagination" :id="'pagination'+tableId"
                           v-if="pagination"
                           v-bind="$attrs"
                           v-on="$listeners"
                           @current-change="paginationCurrentChange"
                           :style="{ 'margin-top': paginationTop, 'text-align': paginationAlign }">
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
      tableId: Number,
      pageListener:Number,
      isExport:Boolean
    },
    components: {
      LbColumn
    },
    data () {
      return {
        mergeLine: {},
        mergeIndex: {},
          tableHeight:0
      }
    },
    created () {
      this.getMergeArr(this.data, this.merge)
    },
    mounted(){
      let _this = this;
      _this.drillingNavigationStyle();
      _this.initTableBorderStyle();
      _this.initPaginationStyle();
      _this.initTableHoverStyle();
        setTimeout(() => {
            var container = document.getElementById("tableContainer" + _this.tableId);
            var elMain = container.getElementsByClassName("el-main");
            if(elMain == null || elMain.length<=0){
                return false;
            }
            this.tableHeight =elMain[0].offsetHeight;
        }, 1000);
    },
    computed: {
      dataLength () {
        return this.data.length
      }
    },
    methods: {
      initTableHoverStyle(){
        let _this = this;
        var table = document.getElementById("table" + _this.tableId);
        var tr =  table.getElementsByClassName("el-table__row");
        if(tr == null || tr.length<=0){
          return false;
        }
        let backgroundColor = this.tableStyle.tableBodyStyle.backgroundColor;
        let backgroundColorHover = this.tableStyle.tableBodyStyle.backgroundColorHover;
        for(var i = 0;i<tr.length;i++){
          tr[i].onmouseover = function () {
            //设置其背景颜色为黄色
            //this.setAttribute("style","background-color:"+backgroundColorHover);
            this.style.backgroundColor = backgroundColorHover;
          };
          //为li注册鼠标离开事件
          tr[i].onmouseout = function () {
            //恢复到这个标签默认的颜色
           // this.setAttribute("style","background-color:"+backgroundColor);
            if(backgroundColor){
              this.style.backgroundColor = backgroundColor;
            }else {
              this.style.backgroundColor = '#FFFFFF';
            }

          };
        }
      },
      initPaginationStyle(){
        let _this = this;
        if (_this.tableStyle.tablePaginationStyle) {
          var pagination = document.getElementById("pagination" + _this.tableId);
          if(pagination == null){
              return false
          }
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
      },
      initTableBorderStyle(){
        let _this = this;
        var table = document.getElementById("table" + _this.tableId);
        let boderSize = '1px'
        let boderColor = null;
        if (_this.tableStyle.tableBorderStyle) {
          boderSize = _this.tableStyle.tableBorderStyle.boderSize;
          boderColor = _this.tableStyle.tableBorderStyle.boderColor;
        }
        table.setAttribute("style", " border:" + boderSize + " solid " + boderColor);

      },
      drillingNavigationStyle(){
        let _this = this;
        var myBreadcrumb = document.getElementById("breadcrumb" + _this.tableId);
        if (myBreadcrumb == null) {
          return false;
        }
        var inners = myBreadcrumb.getElementsByClassName("el-breadcrumb__inner");
        let fontSize = '14px';
        let fontColor = null;
        let iconColor = null;
        if (_this.tableStyle.drillingNavigationStyle) {
          fontSize = _this.tableStyle.drillingNavigationStyle.fontSize
          fontColor = _this.tableStyle.drillingNavigationStyle.fontColor
          iconColor = _this.tableStyle.drillingNavigationStyle.iconColor
        }
        for (var i = 0; i < inners.length; i++) {
          inners[i].getElementsByTagName("a")[0].setAttribute("style", "color:" + fontColor + ";font-size:" + fontSize)
        }

        var items = myBreadcrumb.getElementsByClassName("el-breadcrumb__item");
        for (var i = 0; i < items.length; i++) {
            var icon =  items[i].getElementsByTagName("i");
            if(icon.length>0){
              icon[0].setAttribute("style", "color:" + iconColor);
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
      back(item, key){
        if (key == this.drillNavigation.length - 1) {
          return false;
        }
        this.$emit('backDrill', item)
      }
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
          this.drillingNavigationStyle();
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
      }
    }
  }

</script>
<style scoped>
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
