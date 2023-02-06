<template>
  <el-row style="width: 100%" :class="classObject">
    <!--  <el-col style="height:100%;width: 5px;margin-top: 30px" >
        <span style='width:5px;border:0.2px solid #D8DADC;float:left;height: auto'></span>
      </el-col>-->
    <el-col>
      <el-row>
        <el-col style="width: auto">
          <el-row style="width: auto">
            <el-col style="width: 100%">
              <hr style="width: 30px;display: inline-block" v-if="index != -1"/>
              <!--<i class="el-icon-share" v-if="index != -1"></i>-->
              <img src="@/assets/images/inner_join.png" width="30px" height="30px" v-if="tableData.jointype == 0"/>
              <img src="@/assets/images/left_join.png" width="30px" height="30px" v-if="tableData.jointype == 1"/>
              <hr style="width: 60px;display: inline-block" v-if="index != -1"/>
              <el-button round size="medium" style="width: 200px;margin-top: 10px;margin-bottom: 10px"
                         @click="editTable">{{tableData.table}}
              </el-button>
              <div style="display: inline-block;margin-left: -30px">
                <i class="el-icon-delete" @click="dropTable"  v-if="index != -1"></i>
              </div>
              <div style="display: inline-block;margin-left: 10px">
                <el-button type="primary" icon="el-icon-plus" circle size="mini" @click="addTable"></el-button>

              </div>
              <hr style="width: 60px;display: inline-block"
                  v-if="tableData.children != null && tableData.children instanceof  Array && tableData.children.length>0"/>
            </el-col>
          </el-row>
        </el-col>
        <el-col style="width: auto"
                v-if="tableData.children != null && tableData.children instanceof  Array && tableData.children.length>0">
          <el-row style="width: auto;" v-for="(item,index) in tableData.children" :key="index">
            <data-set-table-item :tableData="item" :index="index" @deleteTable="deleteTable" @deleteJoinTable="deleteJoinTable"
                                 :isLastItem="index == (tableData.children.length-1)"
                                 :justOne="tableData.children.length == 1" :datasourceId="datasourceId"
                                 :parentTable="tableData.table" :dsMeta="dsMeta"
                                 @saveATable="saveATable"></data-set-table-item>
            <!--<span style='width:1px;border:0.2px solid #D8DADC;float:left;height: 100%;'></span>-->
          </el-row>
        </el-col>
      </el-row>
    </el-col>
    <el-dialog :visible.sync="formShow" :modal="false" title="构建模型">
      <div style="padding: 30px">
        <el-row>
          <table>
            <tr>
              <th>数据集字段</th>
              <th>关联方式</th>
              <th>关联表名</th>
              <th>关联字段</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item,index) in joinObj.condition" :key="index">
              <td>
                <el-select v-model="item.sc" filterable placeholder="请选择">
                  <el-option v-for="(sourceItem,sourceKey) in sourceColumns" :key="sourceKey"
                             :label="sourceItem.columnName"
                             :value="sourceItem.columnName"></el-option>
                </el-select>
              </td>
              <td :rowspan="joinObj.condition.length" v-if="index===0" style="width: 15%">
                <el-select v-model="joinObj.jointype" filterable placeholder="请选择">
                  <el-option v-for="(item,key) in jointypeOptions" :key="key" :label="item.label"
                             :value="item.value"></el-option>
                </el-select>
              </td>
              <td :rowspan="joinObj.condition.length" v-if="index===0">
                <el-select v-model="joinObj.table" filterable :disabled="!isAdd" placeholder="请选择"
                           @change="destChange">
                  <el-option v-for="(item,key) in tablesInfo" :key="key" :label="item.tableName"
                             :value="item.tableName"></el-option>
                </el-select>
              </td>
              <td>
                <el-select v-model="item.dc" filterable placeholder="请选择">
                  <el-option v-for="(destItem,destKey) in destColumns" :key="destKey"
                             :label="destItem.columnName"
                             :value="destItem.columnName"></el-option>
                </el-select>
              </td>
              <td>
                <el-button type="danger" icon="el-icon-delete" circle @click="deleteAssociation(index)"></el-button>
              </td>
            </tr>
          </table>
          <el-row style="margin-top: 30px">
            <el-col :span="24" style="text-align: center">
              <el-button type="primary" style="width: 100%" @click="addAssociation">添加关联条件</el-button>
            </el-col>
          </el-row>

        </el-row>
        <div slot="footer" class="dialog-footer" style="text-align: center;margin-top: 50px">
          <el-button @click="formShow = false">取 消</el-button>
          <el-button type="primary" @click="saveTable">确 定</el-button>
        </div>
      </div>
    </el-dialog>
  </el-row>
</template>

<script>

  export default {
    components: {
    },
    name: "DataSetTableItem",
    props: ['tableData', 'index', 'isLastItem', 'justOne', 'dataSetId', 'datasourceId', 'parentTable','dsMeta'],
    data() {
      return {
        tableData1: {
          "table": "table1",
          "children": [{
            "table": "table2",
            "jointype": 0,
            "condtion": [{"sc": "scId", "dc": "dcId"}],
            "children": []
          }, {"table": "table3", "jointype": 0, "condtion": [{"sc": "scId", "dc": "dcId"}], "children": []}]
        },
        isActive: true,
        formShow: false,
        sourceColumns: [],
        destColumns: [],
        join: {
          id:-1,
          parentId:-1,
          source: this.tableData.table,
          jointype: '',
          dest: '',
          condition: [
            {
              sc: '',
              dc: ''
            }
          ]
        },
        joinObj: {
          "id":-1,
          "parentId":-1,
          "table": "",
          "jointype": 0,
          "condition": [{
            sc: '',
            dc: ''
          }],
          "children": []
        },
        jointypeOptions: [
          {
            value: 1,
            label: '左关联'
          }, {
            value: 0,
            label: '内关联'
          }
        ],
        tablesInfo: [],
        isAdd: false


      }
    },
    methods: {
      addTable(){
        this.isAdd = true;
        this.formShow = true;
        this.sourceColumns = [];
        this.destColumns = [];
        this.join = {
          id:-1,
          parentId:-1,
          source: this.tableData.table,
          jointype: '',
          dest: '',
          condition: [
            {
              sc: '',
              dc: ''
            }
          ]
        },
          this.joinObj = {
            "id":-1,
            "parentId":-1,
            "table": "",
            "jointype": 0,
            "condition": [{
              sc: '',
              dc: ''
            }],
            "children": []
          },
          this.queryDataSetConfById(this.tableData.table, 1);
        this.queryTableById();
      },
      //编辑
      editTable(){
          //主表不允许编辑
        if(this.index != -1){
          this.isAdd = false;
          this.formShow = true;
          this.sourceColumns = [];
          this.destColumns = [];
          this.joinObj = this.tableData;

          this.queryDataSetConfById(this.parentTable, 1);
          this.queryDataSetConfById(this.tableData.table, 2);
        }


      },
      //用于注册父组件方法供字组件调用删除元素
      deleteTable(index,table){
          let _this = this;
        let tableArray=[];
        tableArray.push(table);
        _this.putTable(this.tableData.children[index].children,tableArray);
        this.tableData.children.splice(index, 1);
        //保存数据集配置信息并从新请求
        this.$emit('deleteJoinTable',tableArray);
      },
      putTable(children,tableArray){
          if(children instanceof Array && children.length>0){
              children.forEach((child,index)=>{
                  tableArray.push(child.table);
                  if(child.children instanceof Array && child.children.length>0){
                      this.putTable(child.children,tableArray);
                  }
              })
          }
      },
      deleteJoinTable(tableArray){
        this.$emit('deleteJoinTable',tableArray);
      },
      dropTable(){
        this.$confirm( "确认删除"+this.tableData.table +"的关联关系吗?", '提示', {}).then(() => {

          this.$emit('deleteTable',this.index,this.tableData.table);
        }).catch((e) => {
          console.log(e)
        });

      },
      //查询数据集信息
      queryDataSetConfById(tableName, type){

        let param = {
          pageSize: 1000,
          pageNum: 1,
          tableName: tableName,
          dsId: this.datasourceId
        }
        this.$Get(this.khConfig.api.queryTableDesc, param)
          .then(res => {
            if (res.errCode === 0) {
              if (res.colums instanceof Array && res.colums.length > 0) {
                if (type == 1) {
                  this.sourceColumns = res.colums;
                } else if (type == 2) {
                  this.destColumns = res.colums;
                }

              }
            }
          })
      },
      //根据数据源ID查询数据源中的所有表信息
      queryTableById(){
        let param = {
          dsId: this.datasourceId,
          pageSize: 1000,
          pageNum: 1
        };
        this.$Get(this.khConfig.api.queryTable, param)
          .then(res => {
            if (res.errCode === 0) {
              if (res.tables instanceof Array && res.tables.length > 0) {
                this.tablesInfo = res.tables;
              }
            }
          });
      },
      destChange(value){
        if (!this.KHUtils.isNull(this.joinObj.condition) && this.joinObj.condition.length > 0) {
          this.joinObj.condition.forEach(item => {
            item.dc = "";
          })
        }
        if (!this.KHUtils.isNull(value)) {
          this.queryDataSetConfById(value, 2);
        }
      },
      addAssociation() {
        this.joinObj.condition.push(
          {
            sc: '',
            dc: ''
          }
        );
      },
      deleteAssociation(index) {
        //第一行不允许删除
        if (index != 0) {
          this.joinObj.condition.splice(index, 1);
        }

      },
      saveTable(){

        if(!this.checkConditon(this.joinObj.condition)){
          this.$notify.error({
            title: '错误',
            message: '关联条件不允许为空'
          });
          return
        }

        if(this.isAdd){
          if(this.KHUtils.isNull(this.joinObj.table)){
            this.$notify.error({
              title: '错误',
              message: '关联表不允许为空'
            });
            return
          }
          if(this.joinObj.table == this.tableData.table){
            this.$notify.error({
              title: '错误',
              message: '原表和关联表相同，请选择其他表进行操作'
            });
            return
          }
           //计算最大的id +1 作为新增节点的id，确保节点id唯一
          let max = 0;
          if(this.dsMeta != null && this.dsMeta.joins != null && this.dsMeta.joins.length >0){
              this.dsMeta.joins.forEach(item=>{
                  if (item.id > max){
                      max = item.id;
                  }
              })
          }
          this.joinObj.id = max+1;
          this.joinObj.parentId = this.tableData.id;
          this.tableData.children.push(this.joinObj);
        }
        this.formShow = false;
        //保存数据集配置信息并从新请求
        this.$emit('saveATable',this.joinObj.table,this.isAdd);

      },
      saveATable(table,isAdd){
        this.$emit('saveATable',table,isAdd);
      },
      checkConditon(condition){
          let check = true;
          if(condition instanceof Array && condition.length>0){
              condition.forEach((item,index)=>{
                  let sc = item.sc;
                  let dc = item.dc;
                  if(this.KHUtils.isNull(sc) || this.KHUtils.isNull(dc)){
                      check = false;
                  }
              })
          }
          return check;
      }

    },

    computed: {
      classObject: function () {
        return {
          'data-set-item-one': this.justOne,
          'data-set-item-none': this.index == -1,
          'data-set-item-top': this.index == 0,
          'data-set-item': this.index != 0 && !this.isLastItem,
          'data-set-item-bottom': this.isLastItem,
        }
      },
      hiddenObject: function (index) {
        return {
          'data-set-item-one': index != 0
        }
      }
    }

  }
</script>

<style lang="scss" scoped>
  .data-set-item {
    background: url('~@/assets/images/line.png') 0 0 no-repeat no-repeat;

  }

  .data-set-item-top {
    background: url('~@/assets/images/line.png') 0 24px no-repeat no-repeat;

  }

  .data-set-item-bottom {
    background: url('~@/assets/images/line.png') 0 -776px no-repeat no-repeat;

  }

  .data-set-item-one {
    background: url('~@/assets/images/line.png') 0 -800px no-repeat no-repeat;

  }

  .data-set-item-none {
    background: white;

  }

  .hidden {
    visibility: hidden;
  }
</style>
