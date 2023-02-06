<template>
  <div style="width: 3000px;">
    <data-set-table-item :tableData="tableData" :dataSetId="dataSetId" :datasourceId="datasourceId" :dsMeta="dsMeta"
                         @saveATable="saveATable" @deleteJoinTable="deleteJoinTable" :index="'-1'" style="width: 100%"></data-set-table-item>
  </div>
</template>

<script>
  import DataSetTableItem from "@/components/report/dataSet/DataSetTableItem";
  export default {
    components: {
      DataSetTableItem
    },
    name: "DataSetATable",
    props: ['dsMeta', 'dataSetId', 'datasourceId'],
    data() {
      return {
        tableData: {
          "table": "",
          "children": []
        },
        //后台表关联保存的数据结构
        joins: [],
        //记录表关联缓存
        tableCache: [],

      }
    },
    montend(){
    },
    methods: {
      //转换成父子结构数据，便于显示
      convertJoins(){
        this.tableData = {
          "id": 0,
          "table": "",
          "parentId": -1,
          "children": []
        };
        if (!this.KHUtils.isNull(this.dsMeta)) {
          this.tableData.table = this.dsMeta.table;
          this.convertJoin(this.tableData);

        }
      },
      //递归转换
      convertJoin(parentObj){
        let _this = this;
        _this.tableCache = [];
        if (!_this.KHUtils.isNull(_this.dsMeta.joins) && _this.dsMeta.joins.length > 0) {
          try {
            _this.dsMeta.joins.forEach(obj => {
              let newObj = {
                "id": -1,
                "table": "",
                "jointype": 0,
                "condition": [],
                "parentId": -1,
                "children": []

              };
              if (obj.parentId == parentObj.id) {
                newObj.id = obj.id;
                newObj.parentId = obj.parentId;
                newObj.table = obj.dest;
                newObj.jointype = obj.jointype;
                newObj.condition = obj.condition;
                parentObj.children.push(newObj);
                _this.convertJoin(newObj);
              }

            })
          } catch (e) {
            throw  e;
          }
        }
      },
      //转换成非父子结构关系数据，
      convertData(){
        this.joins = [];
        this.convertDataChild(this.tableData);
        this.dsMeta.joins = this.joins;
      },
      convertDataChild(obj){
        if (!this.KHUtils.isNull(obj)) {
          if (!this.KHUtils.isNull(obj.children) && obj.children.length > 0) {
            obj.children.forEach(item => {
              let newObj = {
                  "id":-1,
                "parentId":-1,
                "source": "",
                "jointype": 0,
                "dest": "",
                "condition": []
              };
              newObj.id = item.id;
              newObj.parentId = item.parentId;
              newObj.source = obj.table;
              newObj.jointype = item.jointype;
              newObj.dest = item.table;
              if (!this.KHUtils.isNull(item.condition) && item.condition.length > 0) {
                item.condition.forEach(conditionItem => {
                  newObj.condition.push(conditionItem);
                })

              }
              this.joins.push(newObj);
              this.convertDataChild(item);
            })

          }
        }

      },
      saveATable(table,isAdd){
        this.$emit('saveATable',table,isAdd);
      },
      deleteJoinTable(tableArray){
        this.$emit('deleteJoinTable',tableArray);
      }
    }
  }
</script>

<style>

</style>
