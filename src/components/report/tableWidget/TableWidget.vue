<template>
  <div class="scrollBar">
     <el-row>
       <el-button v-if="item.sensior.isExport" @click="exportTableExcel" :loading="exportLoading" type="primary" style="float: right;margin-right: 30px;margin-bottom: 10px;">导出</el-button>
     </el-row>
     <lb-table v-if="refreshTable" :column="tableData.column" style="height: 100%" class="tableScollStyle"
               v-loading="loading"
               :data="tableData.data"
               :tableStyle="item.style"
               :isExport="item.sensior.isExport"
               :pagination="item.style.pagination"
               :tableId="item.id"
               :pageListener="pageListener"
               background
               layout="total, prev, pager, next,jumper"
               :page-sizes="[10, 20, 50, 100,200,300,500]"
               :page-size="item.style.pageSize"
               :current-page.sync="currentPage"
               :total="totalPage"
               @size-change="handleSizeChange"
               @p-current-change="handleCurrentChange"
               :drillNavigation="drillNavigation"
               @backDrill="backDrill"
               border>

     </lb-table>
   </div>
</template>

<script>
  import LbTable from '@/components/lb-table/lb-table'
  //let Base64 = require('js-base64').Base64
  export default {
    name: "TableWidget",
    components: {
      LbTable
    },
    created(){
      let _this = this;
      //样式设置兼容处理
      if(!_this.item.style.tableHeaderStyle){
        _this.item.style.tableHeaderStyle = {
          cellColor: null,
          cellFontSize: '14px',
          cellPosition: 'center',
          cellBorderColor: null,
          backgroundColor: null,
          cellHeight: '50'
        }
      }
      if(!_this.item.style.tableBodyStyle){
        _this.item.style.tableBodyStyle = {
          cellColor:null,
          cellFontSize:'12px',
          cellPosition:'left',
          cellBorderColor:null,
          backgroundColor:null,
          backgroundColorHover: '#F5F7FA',
          cellHeight:'40'

        }
      }
      if(!_this.item.style.drillingNavigationStyle){
        _this.item.style.drillingNavigationStyle = {
          fontSize:'14px',
          fontColor:null,
          iconColor:null
        }
      }
      if(!_this.item.style.tableBorderStyle){
        _this.item.style.tableBorderStyle = {
          boderSize:'0px',
          boderColor:null
        }
      }
      if(!_this.item.style.tablePaginationStyle){
        _this.item.style.tablePaginationStyle = {
          fontColor:null,
          buttonStyle:{
            backgroundColor:null,
            fontColor:null,
          },
          buttonActiveStyle:{
            backgroundColor:null,
            fontColor:null,
          },
          inputStyle:{
            backgroundColor:null,
            fontColor:null,
            borderWidth:'1px',
            borderColor:null
          }
        }
      }


    },
    mounted(){

    },
    props: ['item','reportId'],
    data(){
      return {
        tableData: {
          column: [],
          data: []
        },
        rowAxis: [],
        colClassAxis: [],
        colValueAxis: [],
        groupData: [],
        dataPosition: [],
        refreshTable: true,
        value: "",
        data: [],
        loading:false,
        currentPage: 1,
        totalPage:0,
        //钻取
        //当前钻取的层级
        currentDrillingIndex:-1,
        //当前钻取的主列
        currentDrillingAxis:{},
        //钻取查询条件
        drillingConditions : {
          current: {},
          conds: []
        },
        //钻取导航
        drillNavigation:[],
        allColumns:[],
        //查询条件
        queryConditions:[],
        tableBackgroundColor:"#1f62e8",
        pageListener:1,
        exportCode:"",
        exportLoading:false,
        timerIdEnd:""
    }
    },
    watch:{
      currentDrillingIndex: {
        deep: true,
        handler() {

        }
      }
    },
    methods: {

      renderTable(res,isUpdate,isDrilling,queryConditions){
        let _this = this;
        _this.data = res.datas;
        _this.queryConditions = queryConditions;
        if(isUpdate){
          _this.currentPage = 1;

        }
        if(!isDrilling){
          _this.currentDrillingIndex = -1;
          _this.currentDrillingAxis = {};
          _this.drillingConditions = {
            current: {},
            conds: []
          }
          _this.drillNavigation=[]
        }

        _this.tableData = {
          column: [],
          data: []
        };
        if(_this.item.style.showSerialNum == true){
             let obj = {type:'index',align:'center'}
            _this.tableData.column.push(obj);
        }

        if (_this.item.data.tableGroup === "aggregate") {
          _this.convertData();
        } else {
          _this.detailTable();
        }


        //没有返回值默认显示“--”
        _this.allColumns = [];
        if(_this.tableData.column instanceof Array && _this.tableData.column.length>0){
            _this.getColumns(_this.tableData.column);
        }
        if(_this.tableData.data instanceof Array && _this.tableData.data.length>0){
          _this.tableData.data.forEach((item,index)=>{
                _this.allColumns.forEach((column,key)=>{
                    if(item[column]==null){
                        item[column] = "一"
                    }
                })

          })
        }
        _this.totalPage = res.totalCount;
        _this.refreshTable = false;     //先关闭，
        this.$nextTick(function () {
          _this.refreshTable = true;      //再打开
        })

      },
      getColumns(columns){
          let _this =this;
          if(columns instanceof Array && columns.length>0){
              columns.forEach((item,index)=>{
                  if(!_this.KHUtils.isNull(item.prop)){
                    _this.allColumns.push(item.prop);
                  }
                  if(item.children instanceof Array && item.children.length>0){
                      _this.getColumns(item.children);
                  }
              })
          }
      },
      //明细table
      detailTable(){
        let _this = this;
        _this.rowAxis = [];
        if (_this.item.data.rowAxis && _this.item.data.rowAxis.length > 0) {
          _this.item.data.rowAxis.forEach((obj, index) => {

              /*if(_this.isSetDrilling(obj)){
               if(_this.currentDrillingIndex >=0 && _this.currentDrillingAxis.drillCol && _this.currentDrillingAxis.drillCol[0] &&  _this.currentDrillingAxis.drillCol[0].column == obj.column && _this.currentDrillingAxis.drillCol[0].table == obj.table && _this.currentDrillingAxis.drillCol[0].dateDim == obj.dateDim){
               currentChildCol = _this.currentDrillingAxis.childCols[_this.currentDrillingIndex];
               }
               }*/

            let newObj = {};
            //判断是否属于钻取行
            if(_this.isSetDrilling(obj,true)){
              let currentChildCol = obj;
              if(_this.currentDrillingIndex >=0 && _this.currentDrillingAxis.drillCol && _this.currentDrillingAxis.drillCol[0] &&  _this.currentDrillingAxis.drillCol[0].column == obj.column && _this.currentDrillingAxis.drillCol[0].table == obj.table && _this.currentDrillingAxis.drillCol[0].dateDim == obj.dateDim){
                currentChildCol = _this.currentDrillingAxis.childCols[_this.currentDrillingIndex];

              }

              newObj.prop = _this.getColumnProp(currentChildCol);

              newObj.label = _this.KHUtils.isNull(currentChildCol.alias) ? currentChildCol.column : currentChildCol.alias;
              newObj.render = (h,scope) =>{
                return (
                  <div>
                  <el-button type="text" onClick={ ()=>{this.drillingEvent(currentChildCol,scope.row[scope.column.property],false)}}>{scope.row[scope.column.property]}</el-button>
                </div>
                )
              };

            }else {
              newObj.prop = _this.getColumnProp(obj);
              newObj.label = _this.KHUtils.isNull(obj.alias) ? obj.column :obj.alias;
            }

            _this.tableData.column.push(newObj);


          })
        }
        if (_this.item.data.colAxis.classAxis && _this.item.data.colAxis.classAxis.length > 0) {
          _this.item.data.colAxis.classAxis.forEach((obj, index) => {
            let newObj = {};
            newObj.prop = _this.getColumnProp(obj);
            newObj.label = _this.KHUtils.isNull(obj.alias) ? obj.column : obj.alias;
            _this.tableData.column.push(newObj);
          })
        }

        if (_this.item.data.colAxis.valueAxis && _this.item.data.colAxis.valueAxis.length > 0) {
          _this.item.data.colAxis.valueAxis.forEach((obj, key) => {
            let newObj = {};
            newObj.label = _this.KHUtils.isNull(obj.alias) ? obj.column :obj.alias;
            newObj.prop = _this.getColumnProp(obj);
            _this.tableData.column.push(newObj);

          })
        }

        if (_this.data instanceof Array && _this.data.length > 0) {
          _this.data.forEach((obj, index) => {
            let newObj={};
            for(let key of Object.keys(obj)){
                  var str = key.split("_");
                   var id = str[str.length-1];
                   var axis = _this.getColValueAxisById(id);
                   if(axis && axis.dataType == "Number" && axis.format){
                   if(axis.format.type == "default"){
                   newObj[key] = obj[key];
                   }else if(axis.format.type == "decimal"){
                   newObj[key] = obj[key].toFixed(axis.format.places);

                   }else if(axis.format.type == "percent"){
                   newObj[key] = (obj[key]*100).toFixed(axis.format.places) +"%";
                   }
                   }else {
                   newObj[key] = obj[key];
                   }

            }
            _this.tableData.data.push(newObj);

            //_this.tableData.data.push(obj);




          })
        }


      },
      getColValueAxisById(id){
        let _this = this;
        let obj;
        if(_this.item.data.colAxis && _this.item.data.colAxis.valueAxis instanceof Array &&  _this.item.data.colAxis.valueAxis.length>0){
          _this.item.data.colAxis.valueAxis.forEach((axis,index)=>{
              if(axis.id == id){
                  obj = axis;
              }
          })
        }

        return obj;
      },
      //聚合table
      convertData(){
        //数据分组
        let _this = this;
        _this.rowAxis = [];
        _this.colValueAxis=[];

        if (_this.item.data.rowAxis && _this.item.data.rowAxis.length > 0) {
          _this.item.data.rowAxis.forEach((obj, index) => {
             let currentChildCol = obj;
             if(_this.isSetDrilling(obj)){
               if(_this.currentDrillingIndex >=0 && _this.currentDrillingAxis.drillCol && _this.currentDrillingAxis.drillCol[0] &&  _this.currentDrillingAxis.drillCol[0].column == obj.column && _this.currentDrillingAxis.drillCol[0].table == obj.table && _this.currentDrillingAxis.drillCol[0].dateDim == obj.dateDim){
                 currentChildCol = _this.currentDrillingAxis.childCols[_this.currentDrillingIndex];
               }
             }
            _this.rowAxis.push( _this.getColumnProp(currentChildCol))
          })
        }

        if (_this.item.data.colAxis.valueAxis && _this.item.data.colAxis.valueAxis.length > 0) {
          _this.item.data.colAxis.valueAxis.forEach((obj, key) => {
            _this.colValueAxis.push( _this.getColumnProp(obj));

          })
        }
        let att = [];
        _this.groupData = [];
        if (_this.rowAxis && _this.rowAxis instanceof Array && _this.rowAxis.length > 0) {
          _this.rowAxis.forEach((rowA, index) => {
            let array = att;
            att = [];
            if (index == 0) {
              _this.groupArr(_this.data, rowA, att);
            } else {
              if (array && array.length > 0) {
                array.forEach((arr, key) => {
                  _this.groupArr(arr, rowA, att);
                })

              }
            }

          })
        }
        _this.groupData = att;
        console.log(JSON.stringify(_this.groupData))
        _this.convertTableHeader();
        _this.convertTableData();


      },
      //生成字段
      getColumnProp(obj){
          let _this = this;
          let prop = "";
          let column = obj.column;
          //判断是否为新增的维度或度量
       /*   if(_this.KHUtils.isNull(obj.column) && !_this.KHUtils.isNull(obj.alias) && !_this.KHUtils.isNull(obj.express)){
              column = obj.alias;
          }

        if (obj.dataType === "Date") {
          prop = column + "_" + obj.dateDim + "_" + obj.id
        } else if(obj.dataType === "String") {
          prop = column + "_" + obj.id;
        }else if(obj.dataType === "Number") {
          if (!_this.KHUtils.isNull(obj.aggregate) && obj.aggregate != "none") {
            prop = obj.column + "_" + obj.aggregate + "_" + obj.id;
          } else {
            prop = obj.column + "_" + obj.id;
          }
        }*/
        let type =  _this.KHReport.expressJudge(_this,obj);
        if(type == "default"){
            if(obj.dataType == "String"){
              prop = column + "_" + obj.id;
            }else if(obj.dataType == "Date"){
              prop = column + "_" + obj.dateDim + "_" + obj.id

            }else if(obj.dataType == "Number"){
              if (!_this.KHUtils.isNull(obj.aggregate) && obj.aggregate != "none" && obj.aggregate != "aggregateExp") {
                prop = obj.column + "_" + obj.aggregate + "_" + obj.id;
              } else {
                prop = obj.column + "_" + obj.id;
              }
            }

        }else if(type == "caseExp" || type == "aggregateExp"){

          if(obj.dataType == "String"){
            prop = obj.alias + "_" + obj.id;

          }else if(obj.dataType == "Date"){
            prop = obj.alias + "_"+ obj.dateDim + "_" + obj.id;

          }else if(obj.dataType == "Number"){
            if (!_this.KHUtils.isNull(obj.aggregate) && obj.aggregate != "none" && obj.aggregate != "aggregateExp") {
              prop = obj.alias + "_" + obj.aggregate + "_" + obj.id;
            } else {
              prop = obj.alias + "_" + obj.id;
            }

          }

        }
        return prop;







      },
      groupArr(myList, field, att){
        var fieldList = []
        myList.map((e) => {
          fieldList.push(e[field])
        });
        //数组去重
        fieldList = fieldList.filter((e, i, self) => {
          return self.indexOf(e) == i
        });
        for (var j = 0; j < fieldList.length; j++) {
          //过滤出匹配到的数据
          var arr = myList.filter((e) => {
            return e[field] == fieldList[j];
          });
          att.push(arr);
        }
      },
      convertTableHeader(){
        let _this = this;
        if (_this.item.data.rowAxis && _this.item.data.rowAxis.length > 0) {
          _this.item.data.rowAxis.forEach((obj, index) => {
            let newObj = {};
            //判断是否属于钻取行
            if(_this.isSetDrilling(obj,true)){
              let currentChildCol = obj;
              if(_this.currentDrillingIndex >=0 && _this.currentDrillingAxis.drillCol && _this.currentDrillingAxis.drillCol[0] &&  _this.currentDrillingAxis.drillCol[0].column == obj.column && _this.currentDrillingAxis.drillCol[0].table == obj.table && _this.currentDrillingAxis.drillCol[0].dateDim == obj.dateDim){
                currentChildCol = _this.currentDrillingAxis.childCols[_this.currentDrillingIndex];

              }
              newObj.prop = _this.getColumnProp(currentChildCol);

              newObj.label = _this.KHUtils.isNull(currentChildCol.alias) ? currentChildCol.column : currentChildCol.alias;
              newObj.render = (h,scope) =>{
                return (
                  <div>
                  <el-button type="text" onClick={ ()=>{this.drillingEvent(currentChildCol,scope.row[scope.column.property],false)}}>{scope.row[scope.column.property]}</el-button>
                </div>
                )
              };

            }else {
              newObj.prop = _this.getColumnProp(obj);
              newObj.label = _this.KHUtils.isNull(obj.alias) ? obj.column : obj.alias;
            }



            _this.tableData.column.push(newObj);
          })
        }
        _this.colClassAxis = [];
        if (_this.item.data.colAxis && _this.item.data.colAxis.classAxis && _this.item.data.colAxis.classAxis.length > 0) {

          let length = _this.item.data.colAxis.classAxis.length;
          let index = 0;

          let message = _this.tableData.column;
          for (var i = 0; i < _this.item.data.colAxis.classAxis.length; i++) {
            let obj = _this.item.data.colAxis.classAxis[i];
            _this.colClassAxis.push(_this.getColumnProp(obj));

          }

          for (var i = 0; i < _this.colClassAxis.length; i++) {

            let column = _this.colClassAxis[i];
            for (var j = 0; j < _this.data.length; j++) {
              let obj = _this.data[j];
              let array = message;
              for (var k = 0; k < i; k++) {
                let columnK = _this.colClassAxis[k];
                for (var m = 0; m < array.length; m++) {
                  let object = array[m];
                  if (object.label == obj[columnK]) {
                    array = object.children;
                    break;
                  }
                }
              }
              let newObj = _this.isExitItem(array, obj[column]);
              if (newObj == null || newObj == 'null') {
                let newObj = {};
                newObj.label = obj[column];
                newObj.index = array.length;
                newObj.children = [];
                if (i === _this.colClassAxis.length - 1) {
                  if (_this.item.data.colAxis.valueAxis && _this.item.data.colAxis.valueAxis.length > 0) {
                    _this.item.data.colAxis.valueAxis.forEach((obj, key) => {
                      let child = {};
                      child.label = _this.KHUtils.isNull(obj.alias) ? obj.column : obj.alias;
                      child.column = _this.getColumnProp(obj);


                      newObj.children.push(child);

                    })
                  }
                }
                array.push(newObj);
              }

            }
          }






        }else {
          if (_this.item.data.colAxis.valueAxis && _this.item.data.colAxis.valueAxis.length > 0) {
            _this.item.data.colAxis.valueAxis.forEach((obj, key) => {
              let newObj = {};
              newObj.prop = _this.getColumnProp(obj);
              newObj.label = _this.KHUtils.isNull(obj.alias) ? obj.column : obj.alias;
              _this.tableData.column.push(newObj);
            })
          }

        }

        //生成prop
        if (_this.tableData.column && _this.tableData.column.length > 0) {
          _this.tableData.column.forEach((obj, index) => {
            if (obj.children && obj.children.length > 0) {
              _this.createProp(obj.children, obj.index);
            }
          })
        }




      },
      //判断是否开启钻取
      isSetDrilling(obj,isFirst){
          let _this = this;
          let isSet = false;
        if(_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length>0){
          _this.item.data.drillingAxis.forEach((item,index)=>{
              let drillCol = item.drillCol;
              let childCols = item.childCols;
              if(isFirst){
                if(drillCol[0] && drillCol[0].column == obj.column && drillCol[0].table == obj.table && drillCol[0].dateDim == obj.dateDim){
                  isSet = true;
                }
              }else {
                if(drillCol[0] && drillCol[0].column == obj.column && drillCol[0].table == obj.table && drillCol[0].dateDim == obj.dateDim){
                  isSet = true;
                }else {
                  if(childCols instanceof Array && childCols.length>0){
                    childCols.forEach((childCol,m)=>{
                      if( childCol.column == obj.column && childCol.table == obj.table && childCol.dateDim == obj.dateDim){
                        isSet = true;
                      }
                    })
                  }
                }
              }



          })
        }
        return isSet;
      },
      //钻取
      drillingEvent(obj,value,back){
        let _this = this;
        if( _this.queryCurrentDrillAxis(obj)){
          return false;
        }
       _this.currentDrillingIndex++;
        if (_this.currentDrillingIndex > (_this.currentDrillingAxis.childCols.length -1)) {
          _this.currentDrillingIndex--;
          _this.$message.warning("已经钻取到最后一层了");
          return false;
        }

         // 钻取查询条件
        _this.drillingConditions.current = _this.currentDrillingAxis.childCols[_this.currentDrillingIndex];
        let tempCond = null;
        if (_this.currentDrillingIndex === 0) {
          tempCond = _this.KHUtils.clone(_this.currentDrillingAxis.drillCol[0]);
        } else if (_this.currentDrillingIndex >= 1) {
          tempCond = _this.KHUtils.clone(_this.currentDrillingAxis.childCols[_this.currentDrillingIndex - 1]);
        }
        if (tempCond != null) {
          let cond = {
            "condType": "single",
            "table": tempCond.table,
            "column": tempCond.column,
            "id": tempCond.id,
            "dataType": tempCond.dataType,
            "dateDim": tempCond.dateDim,
            "matchType": "$eq",
            "express":tempCond.express,
            "value":value
          };
          if (_this.drillingConditions.conds instanceof Array) {
            if (_this.drillingConditions.conds.length > 0) {
              const index = _this.drillingConditions.conds.findIndex(obj => obj.column + obj.id === cond.column + cond.id);
              if (index === -1) {
                _this.drillingConditions.conds.push(cond);
              }
            } else {
              _this.drillingConditions.conds.push(cond);
            }
          }

        }
        let param = {
          datareport: {},
          queryConditions: [],
          drillingConditions:{},
          pageNum: 1,
          pageSize: 1000
        };
        if(_this.queryConditions instanceof Array && _this.queryConditions.length>0){
            param.queryConditions = _this.queryConditions;
        }
        param.datareport = _this.KHUtils.clone(_this.item);
        param.drillingConditions = _this.drillingConditions;
        if(_this.item.style.pagination == true){
            param.pageSize = _this.item.style.pageSize;
        }else {
            param.pageSize = _this.item.querySize;
        }
        _this.loading = true;
        _this.item.desc=""
        _this.$PostJson(_this.khConfig.api.previewreportdata, param).then(res => {
          _this.loading = false;
          if (res.errCode === 0) {
            if (!_this.KHUtils.isNull(res.x)) {
              //_this.item.desc = Base64.decode(res.x);
                _this.item.desc = decodeURIComponent(escape(window.atob(res.x)));
            }
           // _this.item.desc = res.x;
            if(back){

              }else {
                _this.addDrillNavigation(obj,value);
              }
              _this.renderTable(res,true,true,param.queryConditions);
          }else {
            _this.currentDrillingIndex--;
          }
        }).catch((e) => {
          _this.currentDrillingIndex--;
          console.log(e);
          _this.loading = false;
        });



      },
      //添加钻取数据到导航栏
      addDrillNavigation(item,value){
        let _this = this;
        let newObj ={};
        if(_this.currentDrillingIndex == 0){
            let obj={};
            obj.item={id:0};
            obj.currentDrillingIndex = -1;
          obj.label = _this.KHUtils.isNull(_this.currentDrillingAxis.drillCol[0].alias)?_this.currentDrillingAxis.drillCol[0].column:_this.currentDrillingAxis.drillCol[0].column+"("+_this.currentDrillingAxis.drillCol[0].alias+")";
          _this.drillNavigation.push(obj);
        }
        newObj.label = value;
        newObj.item = _this.KHUtils.clone(item);
        newObj.currentDrillingIndex = _this.currentDrillingIndex;
        _this.drillNavigation.push(newObj);
      },
      backDrillNavigation(navigationItem){
          let _this = this;
          let index = _this.drillNavigation.findIndex(obj=>obj.label+obj.item.id == navigationItem.label+navigationItem.item.id);
          if(index != -1){
            _this.drillNavigation.splice(index+1,1000);
          }
      },

      backDrill(navigationItem){
        let _this = this;
        if(navigationItem.currentDrillingIndex == -1){
          _this.refrshTable();
        }else {
          let currentChildCol = _this.currentDrillingAxis.childCols[navigationItem.currentDrillingIndex];
          _this.currentDrillingIndex = navigationItem.currentDrillingIndex-1;
          //移除_this.drillingConditions.conds
          let index = this.drillingConditions.conds.findIndex(obj=>obj.table+obj.column+obj.dateDim == navigationItem.item.table+navigationItem.item.column+navigationItem.item.dateDim);
          if(index != -1){
            this.drillingConditions.conds.splice(index,1000);
          }
          _this.backDrillNavigation(navigationItem);
          _this.drillingEvent(currentChildCol,navigationItem.label,true);
        }

      },
      //
      refrshTable(){
        let _this = this;
        let param = {
          datareport: {},
          queryConditions: [],
          drillingConditions:null,
          pageNum: 1,
          pageSize: 1000
        };
        param.datareport = _this.KHUtils.clone(_this.item);
        if(_this.queryConditions instanceof Array && _this.queryConditions.length>0){
          param.queryConditions = _this.queryConditions;
        }
        _this.loading = true;
        _this.item.desc=""
        _this.$PostJson(_this.khConfig.api.previewreportdata, param).then(res => {
          _this.loading = false;
          if (res.errCode === 0) {
            if (!_this.KHUtils.isNull(res.x)) {
              //_this.item.desc = Base64.decode(res.x);
                _this.item.desc = decodeURIComponent(escape(window.atob(res.x)));
            }
            //_this.item.desc = res.x;
            _this.renderTable(res,true,false,param.queryConditions);
          }
        }).catch((e) => {
          console.log(e);
          _this.loading = false;
        });



      },
      //查询点击的钻取图层
      queryCurrentDrillAxis(obj){
        let _this = this;
        //判断是否是同一个钻取
        let isSame = false;
        let isEnd = false;
        if(_this.currentDrillingAxis.drillCol && _this.currentDrillingAxis.drillCol[0] &&  _this.currentDrillingAxis.drillCol[0].column == obj.column && _this.currentDrillingAxis.drillCol[0].table == obj.table && _this.currentDrillingAxis.drillCol[0].dateDim == obj.dateDim){
            isSame = true;
            return false;
        }
        if(_this.currentDrillingAxis.childCols instanceof Array && _this.currentDrillingAxis.childCols.length>0){
          _this.currentDrillingAxis.childCols.forEach((childCol,index)=>{
            if(childCol.column == obj.column && childCol.table == obj.table && childCol.dateDim == obj.dateDim){
              isSame = true;
              return false;
            }
          })
        }

      if(!isSame){

        if(_this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length>0){
          _this.item.data.drillingAxis.forEach((item,index)=>{
            let drillCol = item.drillCol;
            let childCols = item.childCols;
            if(drillCol[0] && drillCol[0].column == obj.column && drillCol[0].table == obj.table && drillCol[0].dateDim == obj.dateDim){
               if(childCols instanceof Array && childCols.length>0){
                 _this.currentDrillingAxis={};
                 _this.currentDrillingIndex = -1;
                 _this.drillNavigation=[];
                 _this.drillingConditions={
                   current: {},
                   conds: []
                 };
                 _this.currentDrillingAxis = item;

               }else {
                 _this.$message.warning("已经钻取到最后一层了");
                 isEnd = true;
               }


            }
          })
        }
      }
      return isEnd;

      },
      createProp(children, index){
        let _this = this;
        if (children && children instanceof Array && children.length > 0) {
          children.forEach((child, key) => {
            if (!child.column && child.children) {
              let newIndex = index + "$" + child.index;
              _this.createProp(child.children, newIndex);
            } else {
              child.prop = child.column + "$" + index;
            }
          })
        }

      },
      convertTableData(){
        let _this = this;
        if (_this.groupData instanceof Array && _this.groupData.length > 0) {
          _this.groupData.forEach((array, index) => {
            if (array instanceof Array && array.length > 0) {
              let newObj = {};
              if (_this.rowAxis && _this.rowAxis.length > 0) {
                for (var i = 0; i < _this.rowAxis.length; i++) {
                  newObj[_this.rowAxis[i]] = array[0][_this.rowAxis[i]];
                }
              }
              array.forEach((obj, key) => {
                if (_this.colValueAxis instanceof Array && _this.colValueAxis.length > 0) {
                  let valueObj = {value: ""};
                  _this.value = "";
                  _this.getPropIndex(obj, _this.value);
                  _this.colValueAxis.forEach((cv, key1) => {
                    let label = cv + _this.value;
                    var str = cv.split("_");
                    var id = str[str.length-1];
                    var axis = _this.getColValueAxisById(id);
                    if(axis && axis.dataType == "Number" && axis.format){
                        if(axis.format.type == "default"){
                          newObj[label] = obj[cv];
                        }else if(axis.format.type == "decimal"){
                          newObj[label] = obj[cv].toFixed(axis.format.places);

                        }else if(axis.format.type == "percent"){
                          newObj[label] = (obj[cv]*100).toFixed(axis.format.places) +"%";
                        }
                    }else {
                      newObj[label] = obj[cv];
                    }

                  })
                }
              })
              _this.tableData.data.push(newObj);

            }
          })
        }

      },

      getPropIndex(obj, index){
        let _this = this;

        if (_this.colClassAxis instanceof Array && _this.colClassAxis.length > 0) {
          let values = [];
          _this.colClassAxis.forEach((column, key) => {
            let v = obj[column];
            values.push(v);
          })

          let k = 0;
          _this.createPropIndex(_this.tableData.column, k, values, index);
        }


      },
      createPropIndex(array, k, values, index){
        let _this = this;
        if (array instanceof Array && array.length > 0) {
          for (var i = 0; i < array.length; i++) {
            let child = array[i];
            if (child.label == values[k]) {

              index = index + "$" + child.index;
              k++;
              if (k < values.length) {
                _this.createPropIndex(child.children, k, values, index)
              } else {
                _this.value = index;

              }
              break;


            }
          }

        }

      },

      isExitItem(data, label){
        if (data && data.length > 0) {
          for (var i = 0; i < data.length; i++) {
            let obj = data[i];
            if (obj.label == label) {
              return obj;
            }
          }
        }
        return null;
      },
      handleCurrentChange(val) {
        let _this =this;
        _this.currentPage = val;
        let param = {
          datareport: {},
          queryConditions: [],
          pageNum: 1,
          pageSize: 1000
        };
        param.datareport = _this.KHUtils.clone(_this.item);
        param.drillingConditions = _this.drillingConditions;
        if(_this.queryConditions instanceof Array && _this.queryConditions.length>0){
            param.queryConditions = _this.queryConditions;
        }
        param.pageNum =  _this.currentPage;
        param.pageSize = _this.item.style.pageSize;
    /*    if (queryConditions instanceof Array && queryConditions.length > 0) {
          param.queryConditions = queryConditions;
        }*/

        _this.loading = true;
        _this.item.desc=""
        _this.$PostJson(_this.khConfig.api.previewreportdata, param).then(res => {
          if (res.errCode === 0) {
            if (!_this.KHUtils.isNull(res.x)) {
              //_this.item.desc = Base64.decode(res.x);
                _this.item.desc = decodeURIComponent(escape(window.atob(res.x)));
            }
            //_this.item.desc = res.x;
            if (!(res.datas instanceof Array)) {
              return false;
            }
            _this.renderTable(res,false,true,param.queryConditions);

          }
          _this.loading = false;
          //_this.pageListener++;
        }).catch((e) => {
          _this.loading = false;
          console.log(e)
        });
        _this.pageListener++;


      },
      handleSizeChange(val){
          let _this = this;
        _this.item.style.pageSize = val;
      },
      //导出excel
      exportTableExcel(){
        let _this = this;
        _this.exportCode = "";
        let param = {
          "queryConditions": [],
          "drillingConditions":{},
          "reportId": 0,
          "widgetId": ""
        };
        param.reportId =_this.reportId;
        param.widgetId = _this.item.id;
        if(_this.KHUtils.isNull(param.reportId) || _this.KHUtils.isNull(param.widgetId)){
            return false;
        }
        param.drillingConditions = _this.drillingConditions;
        if(_this.queryConditions instanceof Array && _this.queryConditions.length>0){
          param.queryConditions = _this.queryConditions;
        }

        _this.$PostJson(_this.khConfig.api.exportTableReport , param).then(res => {
          if (res.errCode === 0) {
              _this.exportCode = res.exportCode;
              if(!_this.KHUtils.isNull(_this.exportCode)){
                  _this.timeoutExportExcel();
              }
          }
        }).catch((e) => {
          console.log(e)
        });
      },
      /**
       * 轮询导出Excel结果
       * @param _this
       * @returns {Promise<void>}
       */
      async timeoutExportExcel() {
        let _this = this;
        let timerId = await new Promise(resovle => {
          let timerId = setTimeout(async () => {

            try {
              _this.exportLoading = true;
              _this.$Get(_this.khConfig.api.getExportTableReportState + "/" + _this.exportCode, {}).then(res => {
                console.log("导出中...." + _this.exportCode);
                if (res.errCode === 0) {
                  if (res.exportTableReportState) {
                    let state = res.exportTableReportState.state;
                    if (_this.KHUtils.isNull(state)) {
                      _this.clearExportTimer();
                      _this.exportLoading = false;
                      return false;
                    }
                    // 导出失败
                    if ("failed" === state) {
                      _this.$notify.error({
                        title: '错误',
                        message: 'Excel导出失败'
                      });
                    _this.clearExportTimer();
                      _this.exportLoading = false;
                      return false;
                    }
                    // 导出成功
                    if ("success" === state) {
                      _this.exportLoading = false;
                      _this.$notify.success({
                        title: '成功',
                        message: 'Excel导出成功'
                      });
                      _this.$OpenUrl(_this.khConfig.api.fileDownload + "/" + _this.exportCode);
                      _this.clearExportTimer();
                      return false;
                    }
                    _this.timeoutExportExcel();
                  }
                }
              });
            } catch (err) {
              console.log(err);
              _this.exportLoading = false;
              _this.clearExportTimer();
            }
          }, 1000);
          resovle(timerId);
        });
        _this.timerIdEnd = timerId;  //在data中定义，它永远是最后一个定时器的id
      },
      /**
       * 导出,清除最近的100个定时器，如果只清除最后一个，会出现bug
       * @param _this
       */
      clearExportTimer() {
        let _this = this;
        let end = _this.timerIdEnd;
        let start = end - 100 > 0 ? end - 100 : 0;
        for (let i = start; i <= end; i++) {
          clearTimeout(i);
        }
      },

    }
  }
</script>

<style lang="scss" scoped>
.scrollBar{
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  overflow:auto;
}
  .el-table .warning-row {
    background: oldlace;
  }

  .el-table .success-row {
    background: #f0f9eb;
  }

  .el-table {
    height: 100%;
  }

  /*滚动条里面小方块*/
 ::v-deep .tableScollStyle {
    ::-webkit-scrollbar-thumb {
      box-shadow: inset 0 0 5px rgba(0, 0, 0, 0.45);
      border-radius: 10px;
      /*  &:hover {
          background: #535353;
        }*/
    }
    /*滚动条整体样式*/
    ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }
    /*滚动条里面轨道*/
    ::-webkit-scrollbar-track {
      background: #FFFFFF;
      border-radius: 10px;
    }

  }




</style>
