<template>
  <div style="height: 100%">
    <div class="date-buttons-box">
      <el-tree :data="treeData" :props="defaultProps" default-expand-all
               @check="handleTreeItemCheck"
               :expand-on-click-node="false" show-checkbox>
        <span class="custom-tree-node" slot-scope="{ node, data }">
          <span :title="getTreeLabel(node, data)">
            {{ getTreeLabel(node, data) }}
          </span>
        </span>
      </el-tree>
    </div>
    <div class="footer">
      <el-button @click="close">取消</el-button>
      <el-button type="primary" @click="saveDateButtonsSet">确定</el-button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    dimTreeData: {type: Array},
    itemData: {type: Array}
  },

  created() {
    this.initDateButtonsTree();
  },

  computed: {
    getTreeLabel() {
      return function (node, data) {
        if (node.level === 1) {
          return data.column;
        } else if (node.level === 2 || node.level === 3) {
          if (data.alias) {
            return data.alias + '(' + data.column + ')';
          } else {
            return data.column;
          }
        }
      };
    }
  },

  data() {
    return {
      treeData: [],
      defaultProps: {
        label: 'column',
        children: 'children'
      },
      checkTreeData: []
    };
  },

  methods: {
    initDateButtonsTree() {
      for (let i = 0; i < this.dimTreeData.length; i++) {
        let dimTreeDataLevel1 = this.dimTreeData[i];
        let treeDataLeve1 = {};
        treeDataLeve1.column = dimTreeDataLevel1.column;
        treeDataLeve1.desc = dimTreeDataLevel1.desc;
        treeDataLeve1.dataType = dimTreeDataLevel1.dataType;
        treeDataLeve1.alias = dimTreeDataLevel1.alias;
        treeDataLeve1.express = dimTreeDataLevel1.express;
        treeDataLeve1.deafult = false;
        treeDataLeve1.children = [];
        for (let j = 0; j < dimTreeDataLevel1.children.length; j++) {
          let dimTreeDataLevel2 = dimTreeDataLevel1.children[j];
          if (dimTreeDataLevel2.children && dimTreeDataLevel2.children.length > 0) {
            let treeDataLevel2 = {};
            treeDataLevel2.dataType = dimTreeDataLevel2.dataType;
            treeDataLevel2.column = dimTreeDataLevel2.column;
            treeDataLevel2.alias = dimTreeDataLevel2.alias;
            treeDataLevel2.express = dimTreeDataLevel2.express;
            treeDataLevel2.id = dimTreeDataLevel2.id;
            treeDataLevel2.desc = dimTreeDataLevel2.desc;
            treeDataLevel2.deafult = false;
            treeDataLevel2.children = [];
            for (let k = 0; k < dimTreeDataLevel2.children.length; k++) {
              let dimTreeDataLevel3 = dimTreeDataLevel2.children[k];
              if (dimTreeDataLevel3.dateDim === 'year' || dimTreeDataLevel3.dateDim === 'month'
                || dimTreeDataLevel3.dateDim === 'week' || dimTreeDataLevel3.dateDim === 'quarter'
                || dimTreeDataLevel3.dateDim === 'day' /*|| dimTreeDataLevel3.dateDim === 'hour'*/) {
                let treeDataLevel3 = {};
                treeDataLevel3.table = dimTreeDataLevel3.table;
                treeDataLevel3.column = dimTreeDataLevel3.column;
                treeDataLevel3.desc = dimTreeDataLevel3.desc;
                treeDataLevel3.dataType = dimTreeDataLevel3.dataType;
                treeDataLevel3.express = dimTreeDataLevel3.express;
                treeDataLevel3.dateDim = dimTreeDataLevel3.dateDim;
                treeDataLevel3.deafult = false;
                this.initDateAlias(treeDataLevel3);
                treeDataLevel2.children.push(treeDataLevel3);
              }
            }
            treeDataLeve1.children.push(treeDataLevel2);
          }
        }
        this.treeData.push(treeDataLeve1);
      }
    },

    initDateAlias(obj) {
      if (obj.dateDim === 'year') {
        obj.alias = '本年';
      } else if (obj.dateDim === 'month') {
        obj.alias = '本月';
      } else if (obj.dateDim === 'week') {
        obj.alias = '本周';
      } else if (obj.dateDim === 'quarter') {
        obj.alias = '本季度';
      } else if (obj.dateDim === 'day') {
        obj.alias = '本日';
      } else if (obj.dateDim === 'hour') {
        obj.alias = '本小时';
      }
    },

    handleTreeItemCheck(data, args) {
      if (data.children && data.children.length > 0) {
        for (let i = 0; i < data.children.length; i++) {
          let dataLevel2 = data.children[i];
          if (dataLevel2.children && dataLevel2.children.length > 0) {
            for (let j = 0; j < dataLevel2.children.length; j++) {
              let dataLevel3 = dataLevel2.children[j];
              this.pushTreeItemCheck(dataLevel3);
            }
          } else {
            this.pushTreeItemCheck(dataLevel2);
          }
        }
      } else {
        this.pushTreeItemCheck(data);
      }
    },

    pushTreeItemCheck(checkedTreeItem) {
      let exist = false;
      for (let i = 0; i < this.checkTreeData.length; i++) {
        let existTreeDataItem = this.checkTreeData[i];
        if (existTreeDataItem.column === checkedTreeItem.column && existTreeDataItem.alias === checkedTreeItem.alias && existTreeDataItem.dateDim === checkedTreeItem.dateDim) {
          this.checkTreeData.splice(i, 1);
          exist = true;
          break;
        }
      }
      if (!exist) {
        this.checkTreeData.push(checkedTreeItem);
      }
    },

    close() {
      this.$emit('cancel');
    },

    saveDateButtonsSet() {
      for (let i = 0; i < this.checkTreeData.length; i++) {
        let checkTreeDataItem = this.checkTreeData[i];
        let exist = false;
        for (let j = 0; j < this.itemData.length; j++) {
          let dateButton = this.itemData[j];
          if (checkTreeDataItem.column === dateButton.column && checkTreeDataItem.alias === dateButton.alias && checkTreeDataItem.dateDim === dateButton.dateDim) {
            exist = true;
            break;
          }
        }
        if (!exist) {
          this.itemData.push(checkTreeDataItem);
        }
      }
      this.close();
    }
  }
};
</script>

<style lang="scss" scoped>
::v-deep .date-buttons-box {
   height: 90%;
   overflow: auto;
   /*滚动条里面小方块*/
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
     background: #FFFFFF;
     border-radius: 10px;
   }

   .el-tree {
     background-color: #3E475F !important;
     color: white;
     border-bottom: none;
     font-size: 12px;
   }

   background-color: #3E475F;
 }

  .footer {
    background-color: #F8F8FA;
    height: 10%;
    display: flex;
    flex-direction: row;
    justify-content: flex-end;
    align-items: center;
    padding-right: 15px;
    background-color: #2B3551;
  }
</style>
