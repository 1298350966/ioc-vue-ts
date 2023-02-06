<template>
  <div class="formSelectionContainer">
        <div class="selectArea">
          <el-form class="query-form" inline size="small">
              <el-form-item >
                  <el-select v-model="selectFormGroup" placeholder="选择分组" value="" clearable  @clear="listData" @change="listData" >
                      <el-option v-for="item in formGroupOptions" :key="item.groupName" :label="item.groupName" :value="item.groupName"></el-option>
                  </el-select>
              </el-form-item>
              <el-form-item >
                  <el-input v-model="formNameInput" placeholder="请输入普通表单名称" clearable  @clear="listData" @blur="listData"></el-input>
              </el-form-item>
              <el-form-item>
                  <el-button @click="listData" type="success" plain>查询</el-button>
              </el-form-item>
          </el-form>
          <el-table
              class="process-table"
              height="440"
              :data="tableData"
              empty-text="暂无数据"
              tooltip-effect="dark"
              ref="formSelectionTable"
              @selection-change="handleSelectionChange"
              row-key="formId">
              <el-table-column
                  type="selection"
                  :reserve-selection="true"
                  width="80"></el-table-column>
              <el-table-column prop="formName" label="表单名称"  >
              </el-table-column>
          </el-table>
          <el-pagination :current-page="queryParams.pageNum" 
                          :page-size="queryParams.pageSize"
                          layout="total,sizes,prev, pager, next"
                          @size-change="handleSizeChange"
                          @current-change="handleCurrentPage"
                          :total="queryParams.totalCount"
                          :page-sizes="[5, 10, 15, 20]"
                          style="margin-top:10px;"
                          >
          </el-pagination>
        </div>
        
        <div class="checkedFormListContainer">
            <div class="checkedFormListHeader">
              <span>已选中表单（{{exportFormList2.length}}）：</span>
              <el-button style="margin-left:auto;" type="danger" plain size="mini" @click="clearAll">清空</el-button>

            </div>
            <div class="checkedItemList">
            <template v-for="(item,index) in exportFormList2">
                <div :key="index" class="checkedFormItem">
                  {{item.formName}}
                  <span class="checkedFormItemButton" @click="handleDeleteCheckFormItem(item.formId)">删除</span>
                </div>
            </template>
            </div>
        </div>
  </div>
</template>
<script>
export default ({
  name: 'formSelection',
  props: {
    currentStep:{
      type:Number,
      required:true,
    },
    formIds:{
      type:Array,
      required:true,
    },
    exportFormList:{
      type:Array,
      required:false,
    }
  },
  data () {
    return {
        tableData: [],
        formType: "0", // 表单类型,0:普通表单
        queryParams:{
          pageSize:10,
          pageNum:1,
          totalCount:0,
        },
        currentCheckedFormList:[],
        exportFormList2:this.exportFormList,

        // 查询条件
        formNameInput:'',
        selectFormGroup:'',
        formGroupOptions: [],   // 所属菜单选择项

    }
  },
  computed: {},
  watch: {
    exportFormList2:{
      handler(val){
        this.$emit('update:exportFormList',val);
      }
    }
  },
  created () {

  },
  mounted () {
    this.listFormGroup();
    this.listData();
  },
  methods: {
    // 查询流程相关的表单数据
    listData() {
        let _this = this;
        const loading = this.$loading({
            lock: true,
            text: '拼命加载中..',
            spinner: 'el-icon-loading',
            background: 'transparent'
        });
        let param = {};
        if(_this.formNameInput){
          param.formName = _this.formNameInput;
        }
        if(_this.selectFormGroup){
          param.formGroup = _this.selectFormGroup;
        }
        let params=Object.assign(param,{formType:this.formType,pageNum:this.queryParams.pageNum,pageSize:this.queryParams.pageSize});
        // 流程表单类型查询
        this.$Get(this.khConfig.api.listFormConfWithPermission, params).then(res => {
            if (res.errCode === 0) {
                this.queryParams.totalCount = res.totalCount;
                this.tableData = res.datas;
            }
            loading.close();
        });
    },
    // 查询表单分组
    listFormGroup(groupName) {
        if (!this.KHUtils.isNull(groupName)) {
            this.formConf.formGroup = groupName;
        }
        this.$Get(this.khConfig.api.listFormGroup).then(res => {
            if (res.groups != null) {
                this.formGroupOptions = res.groups;
            } else {
                this.formGroupOptions = [];
            }
        });
    },
    handleQuery(){

    },

    // 分页
    handleCurrentPage(val){
      this.exportFormList2.push(...this.currentCheckedFormList)
      this.queryParams.pageNum = val;
      this.listData()
    },
    handleSizeChange(val){
      this.queryParams.pageSize = val;
      this.listData()
    },
    
    // 点击表格，选中需要导出的表单数据
    handleSelectionChange(e){
      let _this = this;
      _this.exportFormList2 = e;
      //  _this.exportFormList2=[...(new Set(_this.exportFormList2.concat(e)))];
      // _this.exportFormList2 = _this.arrDistinctByProp(_this.exportFormList2.concat(e),'formId');

      _this.$nextTick(function(){
          let chekedFormIds = [];
          _this.exportFormList2.forEach((item,index)=>{
            chekedFormIds.push(item.formId)
          })
          _this.$emit('update:formIds',chekedFormIds)
          _this.$emit('update:exportFormList',_this.exportFormList2)
      })
    },

    //清空全部
    clearAll(){
      let _this = this;
      _this.$refs.formSelectionTable.selection.splice(0,10000);
      _this.exportFormList2 = [];
      let chekedFormIds = [];
      _this.$emit('update:formIds',chekedFormIds)
      _this.$emit('update:exportFormList',_this.exportFormList2)
    },
    // 删除选中表单
    handleDeleteCheckFormItem(formId){
      let _this = this;
      
      let tableIndex = _this.$refs.formSelectionTable.selection.findIndex(item=>item.formId === formId)
      _this.$refs.formSelectionTable.selection.splice(tableIndex, 1);

      let index = _this.exportFormList2.findIndex(item=>item.formId === formId);
      _this.exportFormList2.splice(index,1);

      let chekedFormIds = [];
      _this.exportFormList2.forEach((item,index)=>{
        chekedFormIds.push(item.formId)
      })
      _this.$emit('update:formIds',chekedFormIds)
      _this.$emit('update:exportFormList',_this.exportFormList2)
    },

    // 对象数组去重方法，返回去重后的新数组
    arrDistinctByProp(arr,prop){
        return arr.filter(function(item,index,self){
            return self.findIndex(el=>el[prop]==item[prop])===index
        })
    }

  }
})
</script>
<style lang="scss" scoped>
::v-deep .el-transfer{
  // height: 100%;
  // width:60%;
  .el-transfer-panel{
    height: 100%;
    width:calc(50% - 33px);
    border: 1px solid #ddd;
    .el-transfer-panel__header{
      .el-checkbox{
        .el-checkbox__label{
          font-size:18px;
          font-weight: 600;
        }
      }
    }  
    .el-transfer-panel__body{
      height: calc(100% - 55px);
      .el-transfer-panel__list.is-filterable{
        height: calc(100% - 45px);
      }
    }
  }
  .el-transfer__buttons{
    margin:auto 0;
    padding:0 15px;
  }
}

.box-card {
    width: 25%;
    background: #efefef;
    margin: 0 50px 0 0;
    border-radius: 4px;
    vertical-align:middle;
  }
  .clearfix{
    height: 40px;
    line-height: 40px;
    background:#F5F7FA;
    padding-left: 25px;
    font-size: 16px;
    display: flex;

  }
  .itemClass{
    width:100%;
    padding-left: 24px;
    line-height: 30px;
    overflow: hidden;
    white-space: nowrap;
    text-overflow: ellipsis;
  }
  ::v-deep .el-card__header{
    padding: 0;
  }
  ::v-deep .el-card__body{
    max-height: calc(100% - 40px);
    overflow: auto;
    padding:10px 0;
  }
  
  ::v-deep .query-form{
    display: flex;
   .el-form{
      .el-form-item{
        .el-form-item__content{
          width:50%;
        }
      }
    }

  }
  


.formSelectionContainer{
  display:flex;
  justify-content:space-between;

  .selectArea{
    height:510px;
    width:50%;
  }


  .checkedFormListContainer{
    padding: 5px 0px 15px 0px;
    height:500px;
    width:40%;
    background: #f4f7fa;

    .checkedFormListHeader{
      display: flex;
      font-size: 15px;
      font-weight: 600;
      height: 30px;
      line-height: 30px;
      color:#909399;
      margin:5px 10px 10px 15px;
    }
    
    .checkedItemList{
        height:calc(100% - 35px);
        overflow:auto;
        border-top:2px solid white;

        .checkedFormItem{
          width: 100%;
          line-height: 30px;
          font-size: 13px;
          display: flex;
          letter-spacing: 1px;
          padding:0 10px 0 15px;

          &:hover{
            background: #fcfcfc;
          }

          .checkedFormItemButton{
            margin-left:auto;
            color:red;
            cursor:pointer;

            &:hover{
              text-decoration: underline;
            }
          }
        }
    }
  }
}

</style>

