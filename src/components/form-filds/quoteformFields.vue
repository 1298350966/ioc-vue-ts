<template>
  <div class="subformFields">
    <el-collapse v-model="activeName" accordion>
      <el-collapse-item title="数据选取配置" name="1">
      <el-form-item label="数据配置" :required="true">

      <el-input @focus="formSelectVisible=true"  v-model="formName" clearable placeholder="请输入内容"></el-input>
    </el-form-item>
    <el-form-item label="关联控件" :required="true" v-if="dsConf.formId">
      <el-select
        style="width:100%"
        v-model="dsConf.mapping.value"
        placeholder="请选择"
        size="mini"
        value=""
        @change="selectLabelSet"
      >
        <el-option
          v-for="(item, index) in columsField"
          :key="index"
          :label="item.name + ' ('+item.model+')'"
          :value="item.model"
        >
        </el-option>
      </el-select>
        <!-- <el-link
          type="primary"
          @click="assignedTosponsorVisible = true"
          :underline="false"
        >
          <span>字段设置</span>
        </el-link> -->
    </el-form-item>
    <el-form-item label="数据过滤" :required="true" v-if="dsConf.formId">
      <div class="boxs">
        <div class="box-name" v-for="(item, index) in dsConf.condFilters" :key="index">
          <span>{{ item.name }}</span>
          <div>
            <i
              class="el-icon-s-operation"
              style="margin-right: 10px"
              @click="openCondFilterSeting(item)"
            ></i>
            <i
              class="el-icon-remove-outline"
              @click="$delete(dsConf.condFilters, index)"
            ></i>
          </div>
        </div>
        <el-link type="primary" :underline="false">
          <i class="el-icon-plus"></i>
          <span @click="colsCondFilters.dialogVisible = true;colsCondFilters.type = 'condFilters'">添加字段</span>
        </el-link>
      </div>
    </el-form-item>
    <el-form-item label="关联数据配置" v-if="dsConf.formId">
      <el-link type="primary" @click="columnSetVisible = true" :underline="false">
        添加配置
      </el-link>
    </el-form-item>
    <el-form-item label="查询配置" v-if="dsConf.formId">
      <div class="boxs">
        <div class="box-name" v-for="(item, index) in dsConf.conditions" :key="index">
          <span>{{ item.name }}</span>
          <div>

            <i
              class="el-icon-remove-outline"
              @click="$delete(dsConf.conditions, index)"
            ></i>
          </div>
        </div>
        <el-link type="primary" :underline="false">
          <i class="el-icon-plus"></i>
          <span @click="colsCondFilters.dialogVisible =true;colsCondFilters.type = 'conditions'">添加字段</span>
        </el-link>
      </div>
    </el-form-item>
    <el-form-item label="是否直接赋值" v-if="dsConf.formId">
      <el-switch  v-model="dsConf.defaultSelect"/>
    </el-form-item>
  </el-collapse-item>
  </el-collapse>
  

    <el-dialog
      :title="'添加列设置'"
      :visible.sync="formSelectVisible"
      v-if="formSelectVisible"
      :append-to-body="true"
      top="5vh"
      custom-class="col-cond-filter-dialog"
      @close="formSelectVisible = false"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template v-slot:default>
        <div style="margin-bottom:10px">
          <el-input placeholder="请输入表单名" size="small" v-model="searchName" >
            <el-button slot="append" icon="el-icon-search" @click="listFormConfWithPermissionHttp"></el-button>
          </el-input>
        </div>
        <div >
           <el-radio-group v-model="radio" >
          <div  class="radio-box"  v-for="(tree, index) in tableOptionsTree" :key="index">
            <div class="radio-item">
                <el-radio   :label="tree.formId+'|'+ '' ">
                  <span class="iocn "  style=" color:#53A2EB;">主</span>
                  <span class="mainName " :class="[radio == (tree.formId+'|'+ '') ? 'click':'' ]"> {{tree.name}}
                     <i v-show="radio == (tree.formId+'|'+ '')" class="el-icon-check"></i>
                  </span>
                </el-radio>
            </div>
            
            <div class="radio-item2"  v-for="(item, index) in tree.children" :key="index">
              <el-radio  :label="item.formId+'|'+ item.subKey">
                <span class="iocn" style="color:#FF913F;">子</span>
                <span class="subName" :class="[radio == (tree.formId+'|'+item.subKey ) ? 'click':'' ]">{{item.name}} <i v-show="radio == (tree.formId+'|'+ item.subKey)" class="el-icon-check"></i></span>
                </el-radio>
            </div>
          </div>
          </el-radio-group>
        </div>
            <el-pagination
            style="margin-top:10px ;"
              background
              @current-change="listFormConfWithPermissionHttp"
              layout="prev, pager, next"
              :current-page.sync="pageNum"
              :total="totalCount">
            </el-pagination>
          <!-- <el-tree
            :data="tableOptionsTree"
            show-checkbox
            node-key="id"
            :props="defaultProps"
             @check-change="handleCheckChange">
          </el-tree> -->
      </template>
      <template v-slot:footer>
        <el-button @click="formSelectVisible = false">取 消</el-button>
        <el-button @click="radioSave" type="primary">确 定</el-button>
      </template>
    </el-dialog>

    <!--列设置-过滤器对话框-->
    <el-dialog
      :title="configType === 'cols' ? '添加列设置' : '添加过滤器'"
      :visible.sync="colsCondFilters.dialogVisible"
      v-if="colsCondFilters.dialogVisible"
      :append-to-body="true"
      top="5vh"
      custom-class="col-cond-filter-dialog"
      @close="closeAddColsCondFiltersDialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template v-slot:default>
        <cols-cond-filters-show
          ref="colsDataShow"
          :widget="item.id"
          :item-data="itemData"
          :cols-array="colums"
          :show-type="configType"
          :formName="dsConf.formName"
        ></cols-cond-filters-show>
      </template>
      <template v-slot:footer>
        <el-button @click="closeAddColsCondFiltersDialog">取 消</el-button>
        <el-button type="primary" @click="saveAddColsCondFilters">确 定</el-button>
      </template>
    </el-dialog>
    <!-- 设置过滤条件 -->
    <el-dialog
      title="设置过滤条件"
      :visible.sync="condFilterConfigDialogVisible"
      v-if="condFilterConfigDialogVisible"
      :append-to-body="true"
      @close="closeCondFilterConfigDialog"
      custom-class="form-cond-filter-dialog"
      width="35%"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
    >
      <template v-slot:default>
        <form-cond-filter
          ref="formCondFilter"
          :formConfig="formConfig"
          :itemDataCondFilter="currentItemDataCondFilter"
        ></form-cond-filter>
      </template>
      <template v-slot:footer>
        <el-button @click="closeCondFilterConfigDialog">取消</el-button>
        <el-button type="primary" @click="saveCondFilterConfig">确定</el-button>
      </template>
    </el-dialog>
    <!-- 关联字段 -->
    <!-- <assignedTosponsor
      v-if="assignedTosponsorVisible"
      :visible.sync="assignedTosponsorVisible"
      @onData="onData"
      :columnList="formList"
    ></assignedTosponsor> -->

<el-dialog
      title="关联数据配置"
      :visible.sync="assignedTosponsorVisible"
      @close="saveRelatedConfig"
      custom-class="form-cond-filter-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <div class="block">
        <el-row style="padding-top: 10px">
            <el-table
              :data="relatedConfigTable"
              size="mini"
              highlight-current-row
              border
              style="width: 95%"
              ref="mappingRef"
            >
              <el-table-column type="index" width="100">
                <template slot-scope="scope">
                  <template v-if="scope.$index === 0"> 控件Value配置 </template>
                  <template v-else> 控件Label配置 </template>
                </template>
              </el-table-column>
              <el-table-column prop="source" label="源数据字段">
                <template slot-scope="scope">
                  <template v-if="scope.$index === 0">
                    <el-select
                      v-model="dsConf.mapping.key"
                      placeholder="请选择"
                      size="mini"
                      value=""
                      @change="selectKeySet"
                    disabled
                    >
                      <el-option
                        v-for="(item, index) in columnDescOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </template>
                  <template v-if="scope.$index === 1">
                    <el-select
                      v-model="dsConf.mapping.value"
                      placeholder="请选择"
                      size="mini"
                      value=""
                      @change="selectLabelSet"
                    >
                      <el-option
                        v-for="(item, index) in columnDescOptions"
                        :key="index"
                        :label="item.name"
                        :value="item.id"
                      >
                      </el-option>
                    </el-select>
                  </template>
                </template>
              </el-table-column>
              <el-table-column prop="name" label="控件字段备注">
                <template slot-scope="scope">
                  <el-input v-model="data.key_name" v-if="scope.$index === 0"></el-input>
                  <el-input
                    v-model="data.label_name"
                    v-if="scope.$index === 1"
                  ></el-input>
                </template>
              </el-table-column>
              <el-table-column prop="model" label="控件字段标识">
                <template slot-scope="scope">
                  <el-input v-model="data.model" v-if="scope.$index === 0"></el-input>
                  <el-input
                    v-model="data.label_model"
                    v-if="scope.$index === 1"
                  ></el-input>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
           </div>
    </el-dialog>
          <!-- @close="saveRelatedConfig" -->
    <el-dialog
      title="关联数据配置"
      :visible.sync="columnSetVisible"
      @close="saveRelatedConfig"
      custom-class="form-cond-filter-dialog"
      :close-on-click-modal="false"
      :close-on-press-escape="false"
      :append-to-body="true"
    >
      <div class="block">
        <form-result-transfer-no-save-btn
          sourcetitle="请选择"
          targettitle="已选择"
          :sourcedata="columnDescOptions"
          :targetdata="columnDescSelected"
          :custom="false"
          :is-result="false"
          :closed-notify-num="closedNotifyNum"
          @submitDataToParent="saveColumnSet"
          ref="submitData"
        ></form-result-transfer-no-save-btn>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import ColsCondFiltersShow from "@/components/form-design/restructure/dataConfig/ColsCondFiltersShow";
import FormCondFilter from '@/components/form-filds/dialog/FormCondFilter'
import FormResultTransferNoSaveBtn from "@/components/form-filds/FormResultTransferNoSaveBtn";
// import
export default {
  props: ["data"],
  components: {
    ColsCondFiltersShow,
    FormCondFilter,
    FormResultTransferNoSaveBtn,
  },
  data() {
    return {
      item: {},
      tableName: "",
      itemData: [],
      formObj: {},
      tableOptions: [],
      assignedTosponsorVisible: false,
      colsCondFilters:{
        dialogVisible: false,
        type:"" //condFilters conditions
      },
      subTableFormList: [],
      formList: [],
      formSelectList: [],
      dsConf: {
        formId: "",
        formName: "",
        subKey: "",
        mapping: {
            key:"id",
			      value:"",
        },
        columns: [],
        condFilters: [],
        conditions:[],
        defaultSelect:false,
      },
      configType: "condFilters",
      condFilterConfigDialogVisible: false,
      currentItemDataCondFilter: {},
      formConfig: {},

      columnSetVisible: false,
      transferHackSet: true,
      columnDescOptions: [],
      columnDescSelected: [],
      colums:[],
      columsField:[],
      closedNotifyNum: 1,
      formSelectVisible: false,
      defaultProps: {
          children: 'children',
          label: 'name'
        },
      radio:'',

      totalCount:100,
      pageNum:1,
      activeName:"",
      relatedConfigTable:[
          {},
          {}
      ],
      subformName:'',
      searchName:""
    };
  },
  computed: {
    formName:{
      get(){
        if(this.dsConf.subKey){
          return this.dsConf.formName + "(" + this.subformName  +")"
        }else{
          return this.dsConf.formName
        }
      },
      set(val){
        if(this.dsConf.subKey){
          let valList =val.split("(")
          this.dsConf.formName = valList[0] 
        }else{
           this.dsConf.formName = val
        }
      }
      
    },
    tableOptionsTree(){
      return this.tableOptions.map((value, index, array) => {
        let children = []
        let formMeta = JSON.parse(value.formMeta);
        if(formMeta){
          formMeta.list.forEach((formItem) => {
          if(formItem.type == "table"){
              children.push({
                 name:formItem.name,
                 formId:value.formId,
                 subKey:formItem.key
              })
          } 
        })
        }
          return{
            id:index,
            name:value.formName,
            formId:value.formId,
            children:children
          }
      })
    },
    // tableColumnsList() {
    //   // this.$refs.tree.setCheckedKeys([])
    //   return this.data.tableColumns.filter((column, index, tableColumns) => {
    //     return this.dsConf.mapping.find((dkObj) => {
    //       return column.key == dkObj.dk;
    //     });
    //   });
    // },
  },
  watch: {
    'dsConf.formName'(newVl, oldVl){
      if(newVl == ''){
        this.dsConf.formId= ""
        this.dsConf.formName= ""
        this.dsConf.subKey=""
        this.dsConf.mapping= { key:"id", value:""}
        this.dsConf.columns= []
        this.dsConf.condFilters= []
      }
    },
    formObj(newVl, oldVl) {
      if (newVl != oldVl) {
   
        let formMeta = JSON.parse(newVl.formMeta);
        if (this.dsConf.subKey || this.dsConf.subKey === 0) {
        let table = formMeta.list.find((value, index, array) => {
          if (value.type == "table") {
            return this.dsConf.subKey == value.key;
          } else {
            return false;
          }
        });
        if (table) {
          this.subformName = table.name
          this.formList = table.tableColumns;
        } else {
          this.formList = [];
        }
      } else {
        let formSelectList =[]
         formMeta.list.forEach((value, index, array) => {
          if(value.type === "grid"){
            value.columns.forEach((column, index, array) => {
              formSelectList.push(...column.list)
            })
          }else{
            formSelectList.push(value)
          }
        })
        formMeta.list = formSelectList
        this.formList = formMeta.list.filter((value, index, array) => {
          return value.type != "table";
        });
      }
        // this.subTableFormList = formMeta.list.filter((value, index, array) => {
        //   return value.type == "table";
        // });
        // this.formList = formMeta.list.filter((value, index, array) => {
        //   return value.type != "table";
        // });

      }
    },
    "dsConf.subKey"(newVl, oldVl) {
      if( newVl != oldVl ){
      let formMeta = JSON.parse(this.formObj.formMeta);
      if (this.dsConf.subKey || this.dsConf.subKey === 0) {
        let table = formMeta.list.find((value, index, array) => {
          if (value.type == "table") {
            return newVl == value.key;
          } else {
            return false;
          }
        });
        if (table) {
          this.subformName = table.name
          this.formList = table.tableColumns;
        } else {
          this.formList = [];
        }
      } else {
        this.formList = formMeta.list.filter((value, index, array) => {
          return value.type != "table";
        });
      }
      
      }
      
    },
    data(newVl, oldVl) {
      if(newVl !=oldVl){
        this.dsConf =  newVl.options.dsConf  || {
        formId: "",
        formName: "",
        subKey: "",
        mapping: {
           key:"id",
			value:"",
        },
        columns: [],
        condFilters: [],
      }

       this.getFormConfHttp();
       newVl.options.dsConf = this.dsConf;
       this.listFormConfWithPermissionHttp();
      }
      
    },
    // columnDescSelected(newVl, oldVl) {
    //   this.dsConf.columns = newVl.map((value, index, array) => {
    //     return {
    //       column: value.columnName,
    //       name: value.columnDesc,
    //       bakName: value.columnDesc,
    //     };
    //   });
    // },
  },

  mounted() {
    if(this.data.options.dsConf){
      let {formId,formName,subKey,mapping,columns,condFilters,conditions,defaultSelect} = this.data.options.dsConf
      this.dsConf.formId = formId
      this.dsConf.formName = formName
      this.dsConf.subKey = subKey
      this.dsConf.mapping = mapping
      this.dsConf.columns = columns
      this.dsConf.condFilters = condFilters
      this.dsConf.conditions = conditions
      this.dsConf.defaultSelect = defaultSelect
    }
    this.getFormConfHttp();
    this.data.options.dsConf = this.dsConf;
    this.listFormConfWithPermissionHttp();
  },
  methods: {
      // 主列选择默认带出标题/标识
    selectLabelSet(val) {
      let _this = this;
      if (_this.columnDescOptions instanceof Array) {
        _this.columnDescOptions.forEach((obj) => {
          if (obj.id === val || obj.name === val) {
            _this.data.label_name = obj.name;
            if (obj.id === "id") {
              _this.data.label_model = ""; // 防止与主键ID冲突
            } else {
              // _this.data.label_model = obj.id;
              _this.data.label_model = "";
            }
            _this.data.label_len = obj.len;
            _this.data.label_model_type = obj.javaType;
          }
        });
      }
    },
      // 主键选择默认带出标题/标识
    selectKeySet(val) {
      let _this = this;
      if (_this.columnDescOptions instanceof Array) {
        _this.columnDescOptions.forEach((obj) => {
          if (obj.id === val || obj.name === val) {
            _this.data.key_name = obj.name;
            /*                            if (obj.id === 'id') {
                                                            _this.data.model = "key_id";  // 防止与主键ID冲突
                                                        } else {
                                                            _this.data.model = obj.id;
                                                        }*/
            _this.data.key_len = obj.len;
            _this.data.key_model_type = obj.javaType;
          }
        });
      }
    },
    async radioSave(){
      if(this.dsConf.formId === "" && this.dsConf.subKey == ""){
             let radioArray = this.radio.split('|')
          this.dsConf.formId =  radioArray[0]
          this.dsConf.subKey =  radioArray[1] || ''
          
          this.data.tableColumns = [];
          this.dsConf.condFilters = [];
          this.dsConf.columns =  []
          this.dsConf.mapping={ key:"id",value:""},
          //  this.tableQueryDesc();
          await this.getFormConfHttp();
          this.formSelectVisible = false
      }else{
        this.$confirm('此操作会将表单配置数据删除，是否更换？', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'error'
        }).then( async () => {
           let radioArray = this.radio.split('|')
          this.dsConf.formId =  radioArray[0]
          this.dsConf.subKey =  radioArray[1] || ''
          
           this.data.tableColumns = [];
           this.dsConf.condFilters = [];
           this.dsConf.columns =  []
          //  this.tableQueryDesc();
          await this.getFormConfHttp();
          this.formSelectVisible = false
          
          this.$message({
            type: 'success',
            message: '更换成功!'
          });
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消'
          });          
        });
      }
 
     

    },
    handleCheckChange(data, checked, indeterminate) {
          this.dsConf.formId =  data.formId
          this.dsConf.formName = data.name
        if(data.subKey){
          this.dsConf.subKey =  data.subKey
        }
        this.getFormConfHttp();
        this.formSelectVisible = false
    },
    // 关联数据配置关闭弹出框保存
    saveRelatedConfig() {
      this.$nextTick(() => {
        this.$refs.submitData.submitDataToParent();
      });

      this.closedNotifyNum++;
    },
    // 保存数据选择配置
    saveColumnSet(targetList) {
      let _this = this;
      _this.columnDescSelected = [];
      if (
        _this.columnDescOptions.length > 0 &&
        targetList != null &&
        targetList.length > 0
      ) {
        targetList.forEach((obj) => {
          let flag = false;
          _this.columnDescOptions.forEach((rs) => {
            if (obj.id === rs.id || obj.column === rs.id) {
              flag = true;
            } // 多次打开添加配置,数据选择配置失效的问题
          });
          if (flag) {
            let newObj = {};
            newObj.column = obj.id ? obj.id : obj.column;
            newObj.name = obj.name;
            newObj.rename = obj.rename;
            _this.columnDescSelected.push(newObj);
          }
        });
      }
      if (
        _this.columnDescSelected instanceof Array &&
        _this.columnDescSelected.length > 0
      ) {
        this.dsConf.columns = [];
        _this.columnDescSelected.forEach((cd) => {
          let newObj = {};
          newObj.column = cd.column;
          newObj.name = cd.rename;
          newObj.bakName = cd.name;
          this.dsConf.columns.push(newObj);
        });
      }
      _this.colSetVisible = false;
    },
    deleteField(item, index, tableColumns) {
    //   this.dsConf.mapping.forEach((value, index, mapping) => {
    //       if( item.key == value.dk){
    //          this.$delete(mapping, index);
    //       }
    //   })
    //   this.data.tableColumns.forEach((column, index, tableColumns) => {
    //     if (column.key == item.key) {
    //       this.$delete(tableColumns, index);
    //     }
    //   });
    },
    // 点击过滤设置
    openCondFilterSeting(e) {
      this.currentItemDataCondFilter = e;
      this.condFilterConfigDialogVisible = true;
    },
    saveCondFilterConfig() {
      let condFilter = this.$refs.formCondFilter.saveCondFilter();
      Object.assign(this.currentItemDataCondFilter, condFilter);
      this.closeCondFilterConfigDialog();
    },
    closeCondFilterConfigDialog() {
      this.condFilterConfigDialogVisible = false;
    },
    saveAddColsCondFilters() {
      let checkedData = this.$refs["colsDataShow"].getCheckedData();
      if(this.colsCondFilters.type == 'condFilters'){
         this.dsConf.condFilters = checkedData;
      }else if(this.colsCondFilters.type == 'conditions'){
        let conditions = checkedData.map((value) =>{
          return {model:value.model,name:value.name,type:value.type}
        })
        if(this.dsConf.conditions){
          this.dsConf.conditions = conditions
        }else{
          this.$set(this.dsConf,"conditions",conditions )
        }
      }
      this.closeAddColsCondFiltersDialog();
    },
    closeAddColsCondFiltersDialog() {
      this.colsCondFilters.dialogVisible = false;
    },
    findFormType(model){
     return this.formList.find((value) => {
        if (
            value.type === "current_user" ||
            value.type == "data_select" ||
            value.type == "org_select" ||
            value.type == "role_select" ||
            value.type == "user_select" ||
            value.type == "dic_select"
          ) {
            return model == value.model || model == value.label_model
          }else if (value.type === "gis_select") {
            let { modelExt } = value;
           return model == modelExt.lat || model == modelExt.lnt || model == modelExt.address;        
          }else if (value.type == "region_select"){
            let { modelExt } = value;
            return model == modelExt.province || model == modelExt.provinceCode || model == modelExt.city || model == modelExt.cityCode || model == modelExt.area|| model == modelExt.areaCode;        
          }else if(value.type === "current_user" ||
            value.type == "m_data_select" ||
            value.type == "m_org_select" ||
            value.type == "m_role_select" ||
            value.type == "m_user_select" ||
            value.type == "m_dic_select"){
              return false
            }else{
            return model == value.model
          }
      })
    },
    async tableQueryDesc() {
      if (!this.dsConf.formId) return;
      this.colums = []
      this.columnDescOptions= []
      this.columnDescSelected= []
      let res = await this.$Get(this.khConfig.api.formtableQueryDesc, {
        formId: this.dsConf.formId,
        subKey: this.dsConf.subKey,
        pageSize: 1000,
        pageNum: 1,
      });
      if (Array.isArray(res.colums)) {
        this.columsField = res.colums.map((value, index, array) => {
          let colum = {
            name:value.columnDesc,
            model:value.columnName,
          }
          return colum
        })
        this.colums = res.colums.map((value, index, array) => {
          let colum = {
            name:value.columnDesc,
            model:value.columnName,
          }
          let formItem =this.findFormType(value.columnName)
          if(formItem){
            colum.type =  formItem.type 
          }else{
            if( value.columnName == "user_name" || value.columnName == "real_name" ||value.columnName =="last_update_user_id" || value.columnName == "last_update_user_name"){
              colum.type = "user_select"
            }else  if((value.columnName == "create_time" || value.columnName == "last_update_time" || value.columnName == "real_name" )){
              colum.type = "datetime"
            }else if(value.columnName == "process_instance_id" || value.columnName == "tenant_id" || value.columnName == "id") {
              colum.type = "input"
            }
          }
          return colum
        })
        this.colums = this.colums.filter((value)=>  value.type)
        this.columnDescOptions = [];
        this.columnDescSelected = [];
        res.colums.forEach((cr) => {
          let newObj = {};
          newObj.id = cr.columnName;
          newObj.name = this.KHUtils.isNull(cr.columnDesc)
            ? cr.columnName
            : cr.columnDesc;
          newObj.isSelected = false;
          newObj.paramName = cr.columnName;
          newObj.javaType = cr.javaType;
          newObj.len = cr.len;
          newObj.rename = newObj.name;
          this.columnDescOptions.push(newObj);
        });
        
        if(Array.isArray(this.dsConf.columns) && this.dsConf.columns.length > 0){
      
            this.dsConf.columns.forEach((cl, index, array) => {
              this.columnDescSelected.push({
                id: cl.column,
                name: cl.bakName ? cl.bakName : cl.name, // 兼容性处理
                rename: cl.name,
              });
            })
        }else{
           
        this.columnDescOptions.forEach((value) => {          
            this.columnDescSelected.push(value);
          });
          this.columnDescSelected.forEach((cd) => {
            let newObj = {};
            newObj.column = cd.id;
            newObj.name = cd.rename;
            newObj.bakName = cd.name;
            this.dsConf.columns.push(newObj);
         });
        }
     
        
           this.transferHackSet = false;
           this.$nextTick(() => {
            this.transferHackSet = true;
            this.selectKeySet("id")
           });
      }
    },
    async getFormConfHttp() {
      if (!this.dsConf.formId) return;
      const { getFormConf } = this.khConfig.api;
      let res = await this.$Get(getFormConf + "/" + this.dsConf.formId);
      if (res == "error") return;
      this.$set(this.dsConf,'formName',res.formConf.formName)
      this.dsConf.formName = res.formConf.formName;
      this.formObj = res.formConf;
      this.tableQueryDesc();
    },
    async listFormConfWithPermissionHttp() {
      let res = await this.$Get(this.khConfig.api.listFormConfWithPermission, {
        formName: this.searchName,
        // formType: this.formType,
        pageNum: this.pageNum,
        pageSize: 10,
      });

      if (Array.isArray(res.datas)) {
        this.tableOptions = res.datas;
        this.totalCount = res.totalCount
      }
    },
    onData(e) {
         this.formSelectList = e
    },
    // change(e) {
    //   this.dsConf.formName = e.formName;
    //   this.dsConf.formId = e.formId;
    //   this.dsConf.subKey = "";
    //   this.dsConf.mapping = [];
    //   this.dsConf.columns = [];
    //   this.dsConf.condFilters = [];
    //   // this.subTableFormList = [];
    //   this.formList = [];
    //   this.formObj = e;
    //   this.tableName = e.tableName;
    //   this.tableQueryDesc();
    // },
  },
};
</script>

<style lang="scss" scoped>
.subformFields {
  border-bottom: 1px solid rgb(255, 255, 255);
  .boxs {
    border: 1px dashed rgba(255, 255, 255, 0.2);
    background: #3e4760;
    padding: 1px 2px;
  }
  .box-name {
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #f4f6fc;
    border: 1px solid #f4f6fc;
    border-radius: 2px;
    margin: 2px 0;
    padding: 0 10px;
  }

  .box {
    background: #ffffff;
    height: 300px;
    border-radius: 5px;
    padding: 5px;
    border: 1px dashed rgba(255, 255, 255, 0.2);
    .boxItem {
      background: #2b3551;
      border-radius: 5px;
      padding: 5px;
      border: 1px solid#F4F6FC;
      display: flex;
      justify-content: space-between;
      align-items: center;
      color: #ffffff;
      .icon {
        width: 40px;
        height: 40px;
        border-radius: 5px;
        // margin-bottom: 10px;
      }
    }
  }
  

  ::v-deep .el-collapse-item__wrap {
    background-color: #2b3551;
    -webkit-box-sizing: border-box;
    box-sizing: border-box;
    border-bottom: 1 solid #c5c5c5;
    padding:10px;
   }
  ::v-deep .el-collapse-item__header{
      background-color: #3E4760;
      border: 0 solid #3E4760;
      color: #f4f6fc;
      height: 40px;
      padding-left:10px ;
      // border-radius: 4px;

      
   }
    ::v-deep .el-collapse{
     background-color: #2b3551;
    //  margin-bottom: 10px;
     border: 0 solid #c5c5c5;

      .el-collapse-item__content{
        margin:0px;
       
      }
      
   }

}

  .radio-box{
    // boa
    display: flex;
    flex-flow: column;
    justify-content: center;
    // align-items: center;
    ::v-deep .el-radio__inner{
      display: none;
    }
    .radio-item{
       height: 30px;
        display: flex;
    flex-flow: column;
    justify-content: center;
    // align-items: center;
    }
    .radio-item2{
       height: 20px;
       display: flex;
        flex-flow: column;
        justify-content: center;
        margin: 5px 0;
         margin-left:25px;
    // align-items: center;
    }
    
  }
  .mainName{
    position: relative;
    border-radius: 3px;
    padding: 2px 10px;
    background: #e6e6e6;
  }
  .subName{
    position: relative;
    border-radius: 3px;
    padding: 2px 10px;
    background: #e6e6e6;
  }
  .iocn{
    width: 20px;
    height: 20px;
    border-radius: 50%;
    // background: #c5c5c5;
    text-align: center;
    line-height: 20px;
    margin-right: 7px;
  }
  .click{
     position: relative;
    border-radius: 3px;
    padding: 2px 10px;
    background: #0895f3;
    color: #ffffff;
  }
  .el-icon-check{
    background: #046404;
    width: 14px;
    height: 14px;
    color: #ffffff;
    text-align: center;
    line-height: 12px;
    border-radius: 50%;
    position: absolute;
    transform: scale(0.8);
    vertical-align:middle;
    bottom: -1px;
    right:  -2px;
  }
::v-deep .col-cond-filter-dialog{
  .el-dialog__body{
    padding-top: 10px;
    padding-bottom: 10px;
  }
}
</style>
