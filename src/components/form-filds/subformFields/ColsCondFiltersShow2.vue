<template>
  <div>
    <el-tree ref="colsCondFiltersTableTree" :data="treeData" :props="defaultProps" default-expand-all
             :show-checkbox="true" :node-key="getUniqueField" :default-checked-keys="defaultCheckedKeys" :expand-on-click-node="false">
      <span class="custom-tree-node" slot-scope="{ node, data }">
        <span :title="getTreeLabel(node, data)">
          {{ getTreeLabel(node, data) }}
        </span>
      </span>
    </el-tree>
  </div>
</template>

<script>
  export default {
    props: {
      formName: {type: String},
      itemData: {type: Array},
      colsArray: {type: Array},
      widget: {type: Number},
      showType: {type: String} //列设置为cols 过滤器为condFilters
    },
    data() {
      return {
        treeData: [{}],
        checkTreeData: [],
        defaultProps: {},
        defaultCheckedKeys: []
      };
    },

    created() {
      console.log(this.colsArray)
      this.initTreeData();
    },

    computed: {
      getUniqueField() {
        let key;
        if (this.showType === 'cols') {
          key = 'key';
        } else if (this.showType === 'condFilters') {
          key = 'model';
        }
        return key
      },
      getTreeLabel() {
        return function (node, data) {
          return node.level > 1 ? this.showType === 'cols' ? data.name + '(' + data.key + ')' : data.name + '(' + data.model + ')' : data.name;
        };
      }
    },

    methods: {
      //初始化树形结构字段格式
      initTreeData() {
        
        if (this.showType === 'cols') {
          this.initColsData();
          this.defaultProps = {
            label: 'name',
            children: 'cols'
          };
        } else if (this.showType === 'condFilters') {
          this.initCondFiltersData();
          this.defaultProps = {
            label: 'name',
            children: 'condFilters'
          };
        }
      },
      //初始化列设置的数据
      initColsData() {
        let firstCol = {
          key: '$seq',
          name: '序号',
          alias: '序号',
          isJump: false
        };
        this.treeData[0].name = this.formName;
        this.treeData[0].cols = [];
        this.treeData[0].cols.push(firstCol);
        let treeData0 = this.treeData[0];
        treeData0[this.getUniqueField] = this.formName;

        for (let i = 0; i < this.colsArray.length; i++) {
          let colsArrayItem = this.colsArray[i];
          if (colsArrayItem.hasOwnProperty('tableColumns')) {
            continue;
          }
          let col = {};
          col.key = colsArrayItem.model;
          col.name = colsArrayItem.name;
          col.alias = colsArrayItem.name;
          col.isJump = false;
          this.treeData[0].cols.push(col);
        }

        let lastCol = {
          key: '$opt',
          name: '操作',
          alias: '操作',
          isJump: false
        };
        this.treeData[0].cols.push(lastCol);
        this.initDisabledCheckedTree();
      },
      initDisabledCheckedTree() {
        let tableData = this.treeData[0];
        let colsCondFilters = tableData[this.showType];
        let disabledLength = 0;
        for (let i = 0; i < this.itemData.length; i++) {
          let currItemData = this.itemData[i];
          for (let j = 0; j < colsCondFilters.length; j++) {
            let colCondFilter = colsCondFilters[j];
            if (currItemData[this.getUniqueField] === colCondFilter[this.getUniqueField]) {
              colCondFilter.disabled = true;
              this.defaultCheckedKeys.push(colCondFilter[this.getUniqueField]);
              disabledLength++;
              break;
            }
          }
        }
        if (disabledLength === colsCondFilters.length) {
          tableData.disabled = true;
        }
      },
      //初始化过滤器的数据
      initCondFiltersData() {
        this.treeData[0].name = this.formName;
        this.treeData[0].condFilters = [];
        for (let i = 0; i < this.colsArray.length; i++) {
          let colsArrayItem = this.colsArray[i];
          if (colsArrayItem.hasOwnProperty('tableColumns')) {
            continue;
          }
          let condFilter = {};
          condFilter.name = colsArrayItem.name;
          // condFilter.widget = this.widget;
          condFilter.model = colsArrayItem.model;
          condFilter.columnType = colsArrayItem.columnType;
          condFilter.dataType = colsArrayItem.dataType == 'Timestamp' ? 'Date' : colsArrayItem.dataType
          this.initCondFilterField(condFilter);
          this.treeData[0].condFilters.push(condFilter);
        }
        this.initDisabledCheckedTree();
      },
      initCondFilterField(condFilter) {
        if (condFilter.dataType === 'String') {
          if (condFilter.columnType === 'radio' || condFilter.columnType === 'checkbox' || condFilter.columnType === 'switch' || condFilter.columnType === 'multiple_select' || condFilter.columnType === 'select') {
            condFilter.filterType = 0;
            condFilter.condType = 0;
            condFilter.conds0 = [{
              matchType: "$eq",
              value: ""
            }];
          } else if (condFilter.columnType === 'user_select' || condFilter.columnType === 'org_select' || condFilter.columnType === 'role_select' || condFilter.columnType === 'dic_select') {
            condFilter.filterType = 1;
            condFilter.condType = 1;
            condFilter.conds1 = [];
          } else if (condFilter.columnType === 'region_select' && (condFilter.model === 'province' || condFilter.model === 'city' || condFilter.model === 'area')) {
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
          
          if (condFilter.columnType === 'year') {
            condFilter.dateDim = 'year';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.columnType === 'month') {
            condFilter.dateDim = 'month';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.columnType === 'year_month') {
            condFilter.dateDim = 'month';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.columnType === 'date') {
            condFilter.dateDim = 'day';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.columnType === 'datetime') {
            condFilter.dateDim = 'ymdhms';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          }
        }
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
      //确定后获取所有选中的数据
      getCheckedData() {
        let nodes = this.$refs['colsCondFiltersTableTree'].getCheckedNodes();
        for (let i = 0; i < nodes.length; i++) {
          let node = nodes[i];
          if (node.hasOwnProperty(this.showType)) {
            nodes.splice(i, 1);
            i--;
            continue;
          }
          for (let j = 0; j < this.defaultCheckedKeys.length; j++) {
            if (node[this.getUniqueField] === this.defaultCheckedKeys[j]) {
              nodes.splice(i, 1);
              i--;
              break;
            }
          }
        }
        console.log(nodes)
        return nodes;
      }
    }
  };
</script>

<style lang="scss" scoped>
  .custom-tree-node {
    white-space: nowrap;
    line-height: 1.5;
    overflow: hidden;
    text-overflow: ellipsis;
    padding-right: 10px;
  }
</style>
