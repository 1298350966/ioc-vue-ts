<template>
  <div class="data-tree-box">
    <el-input
      class="filter-input"
      placeholder="输入关键字搜索"
      prefix-icon="el-icon-search"
      v-model="filterText">
      <i slot="suffix" :class="filterText ? 'el-icon-close' : ''"></i>
    </el-input>
    <div class="tree-box">
      <el-tree ref="dataTableTree" :data="treeData" :props="defaultProps" default-expand-all
               node-key="model" :filter-node-method="filterNodeMethod"
               :expand-on-click-node="false" @node-contextmenu="handleNodeContextmenu">
          <span class="custom-tree-node" slot-scope="{ node, data }">
            <custom-tree-node-item :node="node" :data="data" :onDrag="onDrag" :onEndDrag="onEndDrag"></custom-tree-node-item>
          </span>
      </el-tree>
    </div>
    <transition name="el-zoom-in-top">
      <div id="nodeContextMenu" v-if="menuVisible" class="custom-dropdown-menu">
        <div id="addToCols" class="menu-item" @mousedown="addToCols">
          <span style="margin-left: 5px;margin-right: 3px">添加至</span><span style="color: #468CFF">列</span>
        </div>
        <div id="addToCondFilters" class="menu-item" @mousedown="addToCondFilters">
          <span style="margin-left: 5px;margin-right: 3px">添加至</span><span style="color: #2BC048">过滤器</span>
        </div>
        <div id="addToQuerySort" class="menu-item" @mousedown="addToQuerySort">
          <span style="margin-left: 5px;margin-right: 3px">添加至</span><span style="color: #f56c6c">排序</span>
        </div>
        <div id="addToImportSettingList" class="menu-item" @mousedown="addToImportSettingList">
          <span style="margin-left: 5px;margin-right: 3px">添加至</span><span style="color: #FFD700">导入</span>
        </div>
        <div id="addToExportSettingList" class="menu-item" @mousedown="addToExportSettingList">
          <span style="margin-left: 5px;margin-right: 3px">添加至</span><span style="color: #CE62D6">导出</span>
        </div>
      </div>
    </transition>
  </div>
</template>

<script>
  import draggable from 'vuedraggable'
  import CustomTreeNodeItem from "@/components/form-design/restructure/dataConfig/CustomTreeNodeItem";

  export default {
    components: {
      draggable,
      CustomTreeNodeItem
    },

    computed: {
      draggableValue() {
        return function (data) {
          let dataArray = [];
          dataArray.push(data);
          return dataArray;
        };
      }
    },

    props: {
      itemData: {type: Object},
      colsArray: {type: Array},
      formName: {type: String},
        isApp: {type: Boolean}
    },

    data() {
      return {
        defaultProps: {
          label: 'name',
          children: 'children'
        },
        filterText: null,
        draggableGroup: {name: 'cols', pull: 'clone'},
        treeData: [{}],
        currentTreeDataItem: {},
        menuVisible: false,
        currDragItem: {
          node: null,
          data: null
        },
        filterNodes: [],
        onDrag: (node, data) => {
          this.currDragItem.node = node;
          if (data.hasOwnProperty('children')) {
            let realNodes = [];
            for (let i = 0; i < this.filterNodes.length; i++) {
              let parentData = this.filterNodes[i].parent.data;
              if (parentData.name === data.name) {
                realNodes.push(this.filterNodes[i]);
              }
            }
            let dragData = realNodes[0].parent.data;
            dragData.children = [];
            for (let i = 0; i < realNodes.length; i++) {
              dragData.children.push(realNodes[i].data);
            }
            this.currDragItem.data = dragData;
          } else {
            this.currDragItem.data = data;
          }
          this.$emit('addDragItem', this.currDragItem);
        },
        onEndDrag: () => {
          this.$emit('endDragItem');
        }
      };
    },

    created() {
      this.initTreeData();
    },

    mounted() {
      this.filterText = '';
      this.addClearContentEvent();
      this.initTreeClickStyle();
    },

    watch: {
      filterText(val) {
        this.filterNodes = [];
        this.$refs.dataTableTree.filter(val);
      }
    },

    methods: {
      initTreeClickStyle() {
        let tree = this.$refs['dataTableTree'].$el;
        let nodes = tree.getElementsByClassName('drag-item');
        nodes[0].style['border'] = '1px solid #468CFF';
        nodes[0].style['background-color'] = '#454D66';

        function removeAnotherBorder() {
          for (let i = 0; i < nodes.length; i++) {
            let node = nodes[i];
            node.style['border'] = '1px solid transparent';
            node.style['background-color'] = 'transparent';
          }
        }

        function clickBorder(e) {
          removeAnotherBorder();
          let toEl = e.toElement || e.target;
          toEl.style['border'] = '1px solid #468CFF';
          toEl.style['background-color'] = '#454D66';
        }

        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          node.addEventListener('mousedown', clickBorder, true);
        }
      },
      //初始化树形结构字段格式
      initTreeData() {
        let firstCol = {
          key: 'seq',
          model: '$seq',
          name: '序号',
          alias: '序号',
          isJump: false
        };
        this.treeData[0].name = this.formName;
        this.treeData[0].children = [];
        this.treeData[0].children.push(firstCol);

        for (let i = 0; i < this.colsArray.length; i++) {
          if (this.colsArray[i].hasOwnProperty('tableColumns')  && this.colsArray[i].type != 'm_data_ref') {
            continue;
          }
          let tableDataItem = {};
          tableDataItem = this.colsArray[i];
          this.treeData[0].children.push(tableDataItem);
        }

        let lastCol = {
          key: 'opt',
          model: '$opt',
          name: '操作',
          alias: '操作',
          isJump: false
        };
        
        this.treeData[0].children.push(lastCol);
      },
      handleNodeContextmenu(e, data, node, self) {
          if (!this.isApp) {
              let path = e.path || (e.composedPath && e.composedPath());
              if (path[0].className.indexOf('el-tree-node') < 0) {
                  this.menuVisible = true;
                  this.currentTreeDataItem = JSON.parse(JSON.stringify(data));
                  for (let i = 0; i < path.length; i++) {
                      let element = path[i];
                      if (element.className === 'el-tree-node__content') {
                          this.$nextTick(() => {
                              let x = element.getBoundingClientRect().x;
                              let y = element.getBoundingClientRect().y;
                              let menu = document.getElementById('nodeContextMenu');
                              menu.style.left = x + 15 + 'px';
                              menu.style.top = y + 32 + 'px';
                              if ((y + 80 + menu.offsetHeight) >= document.body.clientHeight) {
                                  menu.style.top = y - 2 - menu.clientHeight + 'px';
                              }
                              if ((x + 15 + menu.offsetWidth) >= document.body.clientWidth) {
                                  menu.style.left = document.body.clientWidth - menu.offsetWidth - 15 + 'px';
                              }

                              let _this = this;

                              function closeMenu(e) {
                                  _this.menuVisible = false;
                                  document.body.removeEventListener('mousedown', closeMenu);
                              }

                              document.body.addEventListener('mousedown', closeMenu);
                          });
                          break;
                      }
                  }
              }
          }
      },
      addToCols() {
        if (!this.handleAddAllLeafNodeToItemData('cols')) {
          let col = {};
          if (this.currentTreeDataItem.key === 'seq' || this.currentTreeDataItem.key === 'opt') {
            col.key = '$' + this.currentTreeDataItem.key;
          } else {
            col.key = this.currentTreeDataItem.model;
          }
          col.name = this.currentTreeDataItem.name;
          col.alias = this.currentTreeDataItem.name;
          col.isJump = false;
          if (!this.checkIfExist(col, 'cols')) {
            this.handleColPush(col);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          } else {
            this.$message({showClose: true, type: "warning", message: "已存在该字段"});
          }
        }
      },
      handleColPush(item) {
        if (item.key === '$seq') {
          this.$delete(item, 'model');
          this.itemData.cols.unshift(item);
        } else {
          let optExist = false;
          for (let i = 0; i < this.itemData.cols.length; i++) {
            let col = this.itemData.cols[i];
            if (col.key === '$opt') {
              optExist = true;
            }
          }
          if (optExist) {
            this.itemData.cols.splice(this.itemData.cols.length - 1, 0, item);
          } else {
            if (item.key === '$opt') {
              this.$delete(item, 'model');
            }
            this.itemData.cols.push(item);
          }
        }
      },
      addToCondFilters() {
        if (!this.handleAddAllLeafNodeToItemData('condFilters')) {
          if (!this.checkIsSeqOrOpt()) {
            let condFilter = {};
            condFilter.name = this.currentTreeDataItem.name;
            condFilter.widget = this.currentTreeDataItem.widget;
            condFilter.model = this.currentTreeDataItem.model;
            condFilter.type = this.currentTreeDataItem.type;
            condFilter.dataType = this.initCondFilterDataType(this.currentTreeDataItem);
            this.initCondFilterField(condFilter);
            if (!this.checkIfExist(condFilter, 'condFilters')) {
              this.itemData.condFilters.push(condFilter);
              this.$message({showClose: true, type: "success", message: "添加成功"});
            } else {
              this.$message({showClose: true, type: "warning", message: "已存在该字段"});
            }
          }
        }
      },
      addToQuerySort() {
        if (!this.handleAddAllLeafNodeToItemData('querySort')) {
          if (!this.checkIsSeqOrOpt()) {
            let querySort = {};
            querySort.key = this.currentTreeDataItem.model;
            querySort.name = this.currentTreeDataItem.name;
            querySort.sort = 0;
            if (!this.checkIfExist(querySort, 'querySort')) {
              this.itemData.querySort.push(querySort);
              this.$message({showClose: true, type: "success", message: "添加成功"});
            } else {
              this.$message({showClose: true, type: "warning", message: "已存在该字段"});
            }
          }
        }
      },
      addToImportSettingList() {
        if (!this.handleAddAllLeafNodeToItemData('import')) {
          if (!this.checkIsSeqOrOpt()) {
            let listItem = {};
            listItem.model = this.currentTreeDataItem.model;
            listItem.name = this.currentTreeDataItem.name;
            listItem.excelName = this.currentTreeDataItem.name;
            if (!this.checkIfExist(listItem, 'import')) {
              this.itemData.reportSettings.importSettings.list.push(listItem);
              this.$message({showClose: true, type: "success", message: "添加成功"});
            } else {
              this.$message({showClose: true, type: "warning", message: "已存在该字段"});
            }
          }
        }
      },
      addToExportSettingList() {
        if (!this.handleAddAllLeafNodeToItemData('export')) {
          if (!this.checkIsSeqOrOpt()) {
            let listItem = {};
            listItem.model = this.currentTreeDataItem.model;
            listItem.name = this.currentTreeDataItem.name;
            listItem.excelName = this.currentTreeDataItem.name;
            if (!this.checkIfExist(listItem, 'export')) {
              this.itemData.reportSettings.exportSettings.list.push(listItem);
              this.$message({showClose: true, type: "success", message: "添加成功"});
            } else {
              this.$message({showClose: true, type: "warning", message: "已存在该字段"});
            }
          }
        }
      },
      checkIsSeqOrOpt() {
        if (this.currentTreeDataItem.model === '$seq' || this.currentTreeDataItem.model === '$opt') {
          this.$message({
            type: 'warning',
            message: '不支持添加该字段'
          });
          return true;
        }
        return false;
      },
      checkIfExist(item, type) {
        let exist = false;
        if (type === 'cols') {
          for (let i = 0; i < this.itemData.cols.length; i++) {
            let col = this.itemData.cols[i];
            if (col.key === item.key) {
              exist = true;
              break;
            }
          }
        } else if (type === 'condFilters') {
          for (let i = 0; i < this.itemData.condFilters.length; i++) {
            let condFilter = this.itemData.condFilters[i];
            if (condFilter.model === item.model) {
              exist = true;
              break;
            }
          }
        } else if (type === 'querySort') {
          for (let i = 0; i < this.itemData.querySort.length; i++) {
            let querySort = this.itemData.querySort[i];
            if (querySort.key === item.key) {
              exist = true;
              break;
            }
          }
        } else if (type === 'import') {
          for (let i = 0; i < this.itemData.reportSettings.importSettings.list.length; i++) {
            let listItem = this.itemData.reportSettings.importSettings.list[i];
            if (listItem.model === item.model) {
              exist = true;
              break;
            }
          }
        } else if (type === 'export') {
          for (let i = 0; i < this.itemData.reportSettings.exportSettings.list.length; i++) {
            let listItem = this.itemData.reportSettings.exportSettings.list[i];
            if (listItem.model === item.model) {
              exist = true;
              break;
            }
          }
        }
        return exist;
      },
      handleAddAllLeafNodeToItemData(type) {
        if (this.currentTreeDataItem.children) {
          if (type === 'cols') {
            let existNames = [];
            for (let i = 0; i < this.currentTreeDataItem.children.length; i++) {
              let child = this.currentTreeDataItem.children[i];
              let col = {};
              if (child.key === 'seq' || child.key === 'opt') {
                col.key = '$' + child.key;
              } else {
                col.key = child.model;
              }
              col.name = child.name;
              col.alias = child.name;
              col.isJump = false;
              if (!this.checkIfExist(col, 'cols')) {
                this.handleColPush(col);
              } else {
                existNames.push(child.name);
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          } else if (type === 'condFilters') {
            let existNames = [];
            for (let i = 0; i < this.currentTreeDataItem.children.length; i++) {
              let child = this.currentTreeDataItem.children[i];
              if (child.model !== '$seq' && child.model !== '$opt') {
                let condFilter = {};
                condFilter.name = child.name;
                condFilter.widget = child.widget;
                condFilter.model = child.model;
                condFilter.type = child.type;
                condFilter.dataType = this.initCondFilterDataType(child);
                this.initCondFilterField(condFilter);
                if (!this.checkIfExist(condFilter, 'condFilters')) {
                  this.itemData.condFilters.push(condFilter);
                } else {
                  existNames.push(child.name);
                }
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          } else if (type === 'querySort') {
            let existNames = [];
            for (let i = 0; i < this.currentTreeDataItem.children.length; i++) {
              let child = this.currentTreeDataItem.children[i];
              if (child.model !== '$seq' && child.model !== '$opt') {
                let querySort = {};
                querySort.key = child.model;
                querySort.name = child.name;
                querySort.sort = 0;
                if (!this.checkIfExist(querySort, 'querySort')) {
                  this.itemData.querySort.push(querySort);
                } else {
                  existNames.push(child.name);
                }
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          } else if (type === 'import') {
            let existNames = [];
            for (let i = 0; i < this.currentTreeDataItem.children.length; i++) {
              let child = this.currentTreeDataItem.children[i];
              if (child.model !== '$seq' && child.model !== '$opt') {
                let listItem = {};
                listItem.model = child.model;
                listItem.name = child.name;
                listItem.excelName = child.name;
                if (!this.checkIfExist(listItem, 'import')) {
                  this.itemData.reportSettings.importSettings.list.push(listItem);
                } else {
                  existNames.push(child.name);
                }
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          } else if (type === 'export') {
            let existNames = [];
            for (let i = 0; i < this.currentTreeDataItem.children.length; i++) {
              let child = this.currentTreeDataItem.children[i];
              if (child.model !== '$seq' && child.model !== '$opt') {
                let listItem = {};
                listItem.model = child.model;
                listItem.name = child.name;
                listItem.excelName = child.name;
                if (!this.checkIfExist(listItem, 'export')) {
                  this.itemData.reportSettings.exportSettings.list.push(listItem);
                } else {
                  existNames.push(child.name);
                }
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          }
          return true;
        }
        return false;
      },
      //初始化过滤器的数据类型
      initCondFilterDataType(colsArrayItem) {
        let type = colsArrayItem.type;
        let model = colsArrayItem.model;
        let dataType;
        if (type.indexOf('int') >= 0 || type.indexOf('number') >= 0 || type.indexOf('long') >= 0 || model === 'lat' || model === 'lnt') {
          dataType = 'Number';
        } else if (type === 'date') {
          dataType = 'Date';
        } else if (type === 'datetime') {
          dataType = 'Date';
        } else if (type === 'year_month') {
          dataType = 'Date';
        } else if (type === 'year') {
          dataType = 'Date';
        } else if (type === 'month') {
          dataType = 'Date';
        } else if (type === 'time') {
          dataType = 'Date';
        } else {
          dataType = 'String';
        }
        return dataType;
      },
      initCondFilterField(condFilter) {
        if (condFilter.dataType === 'String') {
          if (condFilter.type === 'radio' || condFilter.type === 'checkbox' || condFilter.type === 'switch' || condFilter.type === 'multiple_select' || condFilter.type === 'select') {
            condFilter.filterType = 1;
            condFilter.condType = 1;
            condFilter.conds1 = [];
          } else if (condFilter.type === 'user_select' || condFilter.type === 'org_select' || condFilter.type === 'role_select' || condFilter.type === 'dic_select' || condFilter.type === 'data_select') {
            condFilter.filterType = 1;
            condFilter.condType = 1;
            condFilter.conds1 = [];
          } else if (condFilter.type === 'region_select' && (condFilter.model === 'province' || condFilter.model === 'city' || condFilter.model === 'area')) {
            condFilter.filterType = 1;
            condFilter.condType = 1;
            condFilter.conds1 = [];
          } else {
            condFilter.filterType = 0;
            condFilter.condType = 0;
            condFilter.conds0 = [{
              matchType: "$eq",
              value: ""
            }];
          }
        } else if (condFilter.dataType === 'Number') {
          condFilter.condType = 0;
          condFilter.conds = [{
            matchType: '$eq',
            value: ""
          }];
        } else if (condFilter.dataType === 'Date') {
          if (condFilter.type === 'year') {
            condFilter.dateDim = 'year';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'month') {
            condFilter.dateDim = 'month';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'year_month') {
            condFilter.dateDim = 'month';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'date') {
            condFilter.dateDim = 'day';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'time') {
            condFilter.dateDim = 'second';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'datetime') {
            condFilter.dateDim = 'ymdhms';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          }
        }
      },
      filterNodeMethod(value, data, node) {
        if (!value) {
          this.filterNodes.push(node);
          return true;
        }
        if (data.hasOwnProperty('children')) {
          if (data.name.indexOf(value) !== -1) {
            this.filterNodes.push(node);
            return true;
          }
          return false;
        } else {
          if (data.name.indexOf(value) !== -1 || data.model.indexOf(value) !== -1) {
            this.filterNodes.push(node);
            return true;
          }
          return false;
        }
      },
      addClearContentEvent() {
        let filterInput = document.getElementsByClassName('filter-input')[0];
        let btn = filterInput.getElementsByClassName('el-input__suffix-inner')[0];
        let _this = this;
        btn.addEventListener('click', function () {
          _this.filterText = '';
        });
      }
    }
  };
</script>

<style lang="scss" scoped>
  .custom-dropdown-menu {
    z-index: 9999;
    position: fixed;
    width: 150px;
    padding: 5px 0px;
    display: flex;
    flex-direction: column;
    background-color: rgb(11, 21, 50);
    color: #AAADB7;
    box-shadow: 0 2px 8px rgba(0, 0, 0, .15);
  }

  .menu-item {
    padding: 4px 20px 0 10px;
    font-size: 12px;
    line-height: 26px;
    cursor: pointer;

    &:hover {
      color: #fff;
      background-color: rgba(196, 211, 255, .08);
    }
  }

  .custom-tree-node {
    width: 100%;
  }

  ::v-deep .filter-input {
    .el-input__inner {
      border-radius: 0px;
      background-color: #2B3551;
      border: none;
      padding-left: 20px;
      padding-right: 0px;
      font-size: 13px;
      caret-color: #FFFFFF;
      color: #FFFFFF;
      &::-webkit-input-placeholder {
        color: gray;
        font-size: 12px;
      }
    }
    .el-input__prefix {
      left: -6px;
    }
    .el-input__suffix {
      cursor: pointer;
      top: 10px;
      .el-icon-close {
        &::before {
          font-size: 13px;
        };
      }
    }
    margin-bottom: 1px;
    margin-left: 10px;
    margin-right: 10px;
    width: calc(100% - 20px);
    border-bottom: 1px solid #434C64;
  }

  .data-tree-box {
    height: 100%;
  }

  .tree-box {
    height: calc(100% - 35px);
    overflow: auto !important;
    &::-webkit-scrollbar-thumb {
      background-color: #EBEAEF;
      border-radius: 10px;
    }

    /*滚动条整体样式*/
    &::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    /*滚动条里面轨道*/
    &::-webkit-scrollbar-track {
      background: rgba(77, 86, 133, 0.1);
      border-radius: 10px;
    }
  }
</style>
