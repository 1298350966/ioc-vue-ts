<template>
  <div>
    <form-result-sort-transfer :sourcedata="resultSortOptions" sourcetitle="请选择" :targetdata="resultSort"
                               :custom="false" :isResult="true"  ref="resultSort" class="sort-transfer"
                               targettitle="已选择"
    ></form-result-sort-transfer>
  </div>
</template>

<script>
  import FormResultSortTransfer from '@/components/FormResultSortTransfer';

  const SORT_$_ID = {id: "id", name: "id", realName: 'id', isSelected: false, paramName: "id", sort: 0};
  const SORT_$_CREATE_TIME = {
    id: "create_time",
    name: "创建时间(create_time)",
    realName: '创建时间',
    isSelected: false,
    paramName: "create_time",
    sort: 0
  };
  const SORT_$_UPDATE_TIME = {
    id: "last_update_time",
    name: "更新时间(last_update_time)",
    realName: '更新时间',
    isSelected: false,
    paramName: "last_update_time",
    sort: 0
  };

  export default {
    props: {
      item: {type: Object},
      colsArray: {type: Array},
      itemDataQuerySort: {type: Array}
    },

    components: {
      FormResultSortTransfer
    },

    created() {
      this.resultSortOptions=[];
      for (let i = 0; i < this.itemDataQuerySort.length; i++) {
        let querySort = this.itemDataQuerySort[i];
        this.resultSort.push({
          id: querySort.key,
          name: querySort.name + '(' + querySort.key + ')',
          realName: querySort.name,
          sort: querySort.sort
        });
      }
      this.colsArray.forEach(cr => {
        if (!this.KHUtils.isNull(cr.name)) {
          // 子表单,标签不再父表单结果列,导入导出中显示
          if (cr.type !== 'table' && cr.type !== 'flow_table' && cr.type !== 'text' && cr.type !== 'grid') {
            let sortObj = {};
            sortObj.id = cr.model;
            sortObj.name = cr.name + '(' + cr.model + ')';
            sortObj.realName = cr.name;
            sortObj.isSelected = false;
            sortObj.paramName = cr.model;
            sortObj.sort = 0;
            let exist = false;
            for (let i = 0; i < this.itemDataQuerySort.length; i++) {
              let querySort = this.itemDataQuerySort[i];
              if (querySort.key === sortObj.id) {
                exist = true;
              }
            }
            if (!exist) {
              this.resultSortOptions.push(sortObj);
            }
          }
        }
      });
      let exist1 = false;
      let exist2 = false;
      let exist3 = false;
      for (let i = 0; i < this.itemDataQuerySort.length; i++) {
        let querySort = this.itemDataQuerySort[i];
        if (querySort.key === 'id') {
          exist1 = true;
        }
        if (querySort.key === 'create_time') {
          exist2 = true;
        }
        if (querySort.key === 'last_update_time') {
          exist3 = true;
        }
      }
      if (!exist3) {
        this.resultSortOptions.unshift(SORT_$_UPDATE_TIME);
      }
      if (!exist2) {
        this.resultSortOptions.unshift(SORT_$_CREATE_TIME);
      }
      if (!exist1) {
        this.resultSortOptions.unshift(SORT_$_ID);
      }
    },

    data() {
      return {
        resultSortOptions: [],
        resultSort: []//已设置的结果排序集合
      };
    },

    methods: {
      getCheckedSort() {
        this.resultSort = [];
        let sortList = this.$refs.resultSort.targetList;
        sortList.forEach(item => {
          let newObj = {};
          newObj.key = item.id;
          newObj.name = item.realName;
          newObj.sort = item.sort;
          this.resultSort.push(newObj);
        });
        console.log(JSON.stringify(this.resultSort));
        return this.resultSort;
      }
    }
  };
</script>

<style scoped>
  .sort-transfer {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
</style>
