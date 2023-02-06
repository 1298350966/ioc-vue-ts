<template>
    <div class="advancedControlsSelection">
        <el-input class="query-widget-style" v-model="value"  :placeholder="placeholder || config.options.placeholder"></el-input>
        <i class="el-icon-plus" @click="loadSysSelectData"></i>
        <el-dialog  v-if="selectDialogVisible" :title="config.options.maps.title" :visible.sync="selectDialogVisible"
            :close-on-click-modal="closeOnClickModal" custom-class="dialog-maxheight" append-to-body
            @close="handleSave">
            <el-row v-if="config.options.displayModel === 'tree'">
                <el-input :placeholder="config.label_name" v-model="filterText" style="width: 50%">
                </el-input>
                <el-tree :props="config.options.props" :load="loadNode" :filter-node-method="filterNode" lazy show-checkbox
                    check-strictly @check="handleSave" ref="tree">
                </el-tree>
            </el-row>
            <el-row v-if="config.options.displayModel === 'table' && colsArray.length > 0">
                <template v-if="config.type === 'user_select'">
                    <userSelectWidget 
                        :widgetType="config.type" 
                        :allowMultiSelect="config.type==='user_select'?false:true" 
                        @handleSelectionChange="handleSelectionChange"
                        >
                    </userSelectWidget>
                </template>

                <template v-else>
                    <el-input style="width: 160px" :placeholder="config.type === 'user_select' ? '用户名' : config.label_name"
                        prefix-icon="el-icon-search" v-model="keywords" @blur="getDataSource"></el-input>
                    <el-table :data="tableData" v-loading="tableDataLoading" tooltip-effect="dark"
                        @selection-change="handleSelectionChange" style="width: 96%">
                        <el-table-column type="selection" width="55px" :props="config.options.maps.key" fixed>
                        </el-table-column>
                        <el-table-column label="序号" width="60px" type="index" fixed>
                        </el-table-column>
                        <template v-for="col in colsArray">
                            <el-table-column sortable :prop="col.model" :label="col.name" :key="col.model">
                            </el-table-column>
                        </template>
                    </el-table>
                </template>
            </el-row>
            <p v-if="config.options.displayModel === 'table' && colsArray.length > 0 && config.type !== 'user_select'" style="width: 100%; margin: 0 auto" slot="footer">
                <el-pagination layout="prev, pager, next" :current-page="queryCommonDataParam.pageNum"
                    @current-change="handleCurrentChange" :total="totalPage">
                </el-pagination>
            </p>
        </el-dialog>
    </div>
</template>

<script>
import userSelectWidget from "@/components/form-widget/UserSelectWidget.vue";

export default {
    name: 'advancedControlsSelection',
    props:{
        formId:{
            type:String | Number,
            default:""
        },
        defaultValue:{
            type:String,
            default:""
        },
        model:{
            type:String,
            default:""
        },
        config:{
            type:Object,
            default:function(){
                return {}
            }
        },
        placeholder:{
            type:String,
            default:""
        }
    },
    components:{ userSelectWidget },
    data() {
        return {
            data:{},
            filterText: "",
            keywords: "", // 搜索关键字
            selectTableData: [], // 被选择的列表数据
            selectDialogVisible:false,
            closeOnClickModal: false,
            queryCommonDataParam: {
                pageNum: 1, // 查询参数
                pageSize: 10,
            },
            totalPage:0,
            tableDataLoading:false,
            tableData:[]
        };
    },
    computed:{
        value:{
            get(){
                return this.defaultValue
            },
            set(val){
                this.$emit("update:defaultValue",val)
            } 
        }
    },
    watch:{
    },
    mounted() {
        if(this.config.model){
        this.$set(this.data,this.config.model,"")
        }
        if(this.config.label_model){
        this.$set(this.data,this.config.label_model,"")
        }

    },

    methods: {

        // 分页查询
        handleCurrentChange(val) {
            this.queryCommonDataParam.pageNum = val;
            if(this.config.type === "data_select"){
                this.loadDataSelectData()
            }else{
                this.getDataSource();
            }
        },
        loadNode(node, resolve) {
            let _this = this;
            if (
                !_this.config.options.remoteUrl ||
                _this.KHUtils.isNull(this.config.options.remoteUrl)
            ) {
                return false;
            }
            if (node.level === 0) {
                return resolve(_this.tableData);
            }

            let param = {};
            if (this.config.type === "dic_select" || this.config.type === "m_dic_select") {
                param.parentId = node.data.id; // 数据字典的特殊化处理,选择时带出code,name;
            } else {
                param.parentId = node.data[this.config.options.maps.key];
            }
            this.$Get(this.config.options.remoteUrl, param).then((res) => {
                if (res.errCode === 0) {
                    return resolve(res.list);
                }
            });
        
        },
         // 树形展示搜索
        filterNode(value, data) {
            if (!value) return true;
            return data[this.config.options.maps.name].indexOf(value) !== -1;
        },
        // 数据选择控件保存
        handleSave() {
            let _this = this
            let selected = {};
            if(this.config.options.displayModel === 'tree'){
                let data = _this.$refs.tree.getCheckedNodes();
                if (data.length >= 2) {
                    this.$notify.warning({
                        title: "警告",
                        message: "选择关联的数据不允许超过一条",
                    });
                    return false;
                }
                if (_this.KHUtils.isNull(data) || data.length === 0) {
                    data = this.$refs.tree.getCurrentNode();
                }        
                selected = data[0]
                let label = _this.config.options.maps.name;
                let key = _this.config.options.maps.key;   
                this.data[this.config.model] = selected[key]
                this.data[this.config.label_model] = selected[label]
                this.value = this.data[this.model]
                this.selectDialogVisible = false;
            }
            if(this.config.options.displayModel === 'table'){
                if (
                    _this.KHUtils.isNull(_this.selectTableData) ||
                    _this.selectTableData.length <= 0
                ) {
                    return false;
                }
                selected = _this.selectTableData[0];
                let label = _this.config.options.maps.name;
                let key = _this.config.options.maps.key;   
                this.data[this.config.model] = selected[key]
                this.data[this.config.label_model] = selected[label]
                this.value = this.data[this.model]
                this.selectDialogVisible = false;
            }
            
        },
         // 组织,用户等控件加载选择项数据
        loadSysSelectData() {
            let _this = this;
            if (_this.config.options.displayModel === "table") {
                if(_this.config.type === "data_select"){
                    this.loadDataSelectData()
                }else{
                    _this.getDataSource();
                }
            } else {
                if (_this.KHUtils.isNull(_this.config.options.remoteUrl)) {
                    _this.$notify.warning({
                        title: "警告",
                        message: "接口地址为空",
                    });
                    return false;
                }
                let param = {};
                if (
                    _this.config.type === "user_select" ||
                    _this.config.type === "company_select" 
                ) {
                    param.pageSize = 10000000;
                    param.pageNum = 1;
                } else if (_this.config.type === "dic_select") {
                    param.typeCode = this.config.typeCode;
                    param.parentId = null;
                } else {
                    param.parentId = null;
                }
                this.$Get(_this.config.options.remoteUrl, param).then((res) => {
                    if (res.errCode === 0) {
                        if (
                            _this.config.type === "data_select" ||
                            _this.config.type === "company_select" 
                        ) {
                            _this.tableData = res.datas; // 通用数据特殊化处理;
                        } else {
                            _this.tableData = res.list;
                        }
                        if (!_this.KHUtils.isNull(_this.tableData)) {
                            _this.selectDialogVisible = true;
                        }
                    }
                });
            }
        },
        // 表单重构后通用数据查询
        loadDataSelectData() {
            let _this = this;
            if (!(_this.config.options.maps.source.columns instanceof Array) ||
                (_this.config.options.maps.source.columns instanceof Array && _this.config.options.maps.source.columns.length <= 0)) {
                return false;
            }
            let param = {
                cond: _this.keywords,
                pageNum: _this.queryCommonDataParam.pageNum,
                pageSize: _this.queryCommonDataParam.pageSize
            };
            let mountedOrPreview = _this.KHUtils.isNull(_this.formId);
            let tempCols = "";
            _this.colsArray = [];
            _this.config.options.maps.source.columns.forEach(cl => {
                tempCols += cl.column + ",";
                let newObj = {};
                newObj.name = cl.name;
                newObj.model = cl.column;
                _this.colsArray.push(newObj);
            });
            if (tempCols.length > 0) {
                tempCols = tempCols.substr(0, tempCols.length - 1);
            }
            if (mountedOrPreview) {
                param.tbName = _this.config.options.maps.source.table;
                param.cols = tempCols;
            } else {
                param.formId = _this.formId;
                param.fk = _this.config.key;
            }
            _this.selectDialogVisible = true;
            _this.tableDataLoading = true;
            //判断通用数据控件是否自定义接口
            if(_this.config.type == "data_select" || _this.config.type == "m_data_select"){
              //j将modelsl 里面的数据全部遍历处理遇到object 遍历
              let newModels = {};
              let urlParams = _this.config.options.urlParams;
              if(urlParams instanceof Array && urlParams.length >0){
                for(var i = 0;i<urlParams.length;i++){
                  let obj = urlParams[i];
                  if(obj.t == "0"){
                    //控件值
                    if(newModels[obj.v]){
                      param[obj.k] = newModels[obj.v];
                    }
                  }else if(obj.t == "1"){
                    //固定值
                    param[obj.k] = obj.v;
                  }
                }
              }
            let remoteUrl = _this.config.options.remoteUrl;
            if(_this.KHUtils.isNull(remoteUrl)){
                 if(_this.config.options.urlParams){
                    _this.config.options.urlParams.map((urlParam) => {
                        if (urlParam.t === "0") {
                        } else {
                            param[urlParam.k] = urlParam.v;
                        }
                    });
                    }
                //没有设置走原来逻辑
                _this.$Get(mountedOrPreview ? _this.khConfig.api.previewquerydata : _this.khConfig.api.mountedquerydata, param).then(res => {
                if (res.errCode === 0) {
                    _this.totalPage = res.totalCount;
                    _this.tableData = res.datas;
                }
                _this.tableDataLoading = false;
                });
            }else {
              let method = _this.box.options.method;
              let postType = _this.box.options.postType;
              if(!_this.KHUtils.isNull(method) && method === 'GET'){
                _this.$Get(remoteUrl, param).then(res => {
                  if (res.errCode === 0) {
                    _this.totalPage = res.totalCount;
                    if(_this.KHUtils.isNull( _this.box.options.remoteDataPoint)){
                      _this.tableData = res.datas;
                    }else {
                      let remoteDataPoint =  _this.box.options.remoteDataPoint;
                      let pointArray = remoteDataPoint.split(".");
                      for(var i = 0 ;i<pointArray.length;i++){
                        _this.tableData = res[pointArray[i]]
                      }
                    }

                  }
                  _this.tableDataLoading = false;
                });
              }else if(!_this.KHUtils.isNull(method) && method === 'POST'){
                if(postType === 'formData'){
                  let paramArray = [];
                  Object.getOwnPropertyNames(param).forEach(function (key) {
                    paramArray.push(key+"="+param[key]);
                  });
                  paramArray = paramArray.join("&");
                  _this.$Post(remoteUrl, paramArray).then(res => {
                    if (res.errCode === 0) {
                      _this.totalPage = res.totalCount;
                      if(_this.KHUtils.isNull( _this.box.options.remoteDataPoint)){
                        _this.tableData = res.datas;
                      }else {
                        let remoteDataPoint =  _this.box.options.remoteDataPoint;
                        let pointArray = remoteDataPoint.split(".");
                        for(var i = 0 ;i<pointArray.length;i++){
                          _this.tableData = res[pointArray[i]]
                        }
                      }

                    }
                    _this.tableDataLoading = false;
                  });
                }else if(postType == 'json'){
                  _this.$PostJson(remoteUrl, param).then(res => {
                    if (res.errCode === 0) {
                      _this.totalPage = res.totalCount;
                      if(_this.KHUtils.isNull( _this.box.options.remoteDataPoint)){
                        _this.tableData = res.datas;
                      }else {
                        let remoteDataPoint =  _this.box.options.remoteDataPoint;
                        let pointArray = remoteDataPoint.split(".");
                        for(var i = 0 ;i<pointArray.length;i++){
                          _this.tableData = res[pointArray[i]]
                        }
                      }

                    }
                    _this.tableDataLoading = false;
                  });
                }

              }else {
                let paramArray = [];
                Object.getOwnPropertyNames(param).forEach(function (key) {
                  paramArray.push(key+"="+param[key]);
                });
                paramArray = paramArray.join("&");
                _this.$Post(remoteUrl, paramArray).then(res => {
                  if (res.errCode === 0) {
                    _this.totalPage = res.totalCount;
                    if(_this.KHUtils.isNull( _this.box.options.remoteDataPoint)){
                      _this.tableData = res.datas;
                    }else {
                      let remoteDataPoint =  _this.box.options.remoteDataPoint;
                      let pointArray = remoteDataPoint.split(".");
                      for(var i = 0 ;i<pointArray.length;i++){
                        _this.tableData = res[pointArray[i]]
                      }
                    }

                  }
                  _this.tableDataLoading = false;
                });
              }
            }


            }else {
            _this.$Get(mountedOrPreview ? _this.khConfig.api.previewquerydata : _this.khConfig.api.mountedquerydata, param).then(res => {
                if (res.errCode === 0) {
                _this.totalPage = res.totalCount;
                _this.tableData = res.datas;
                }
                _this.tableDataLoading = false;
            });
            }
        },
        
        // 通用数据控件数据源查询
        getDataSource() {
            let _this = this;
            if(this.config.type === "data_select"){
                this.loadDataSelectData()
                return false;
            }
            if (
                !_this.config.options.remoteUrl ||
                _this.KHUtils.isNull(this.config.options.remoteUrl)
            ) {
                _this.$notify.warning({
                    title: "警告",
                    message: "未选择任何的数据配置项",
                });
                return false;
            }
            if (_this.config.type === "user_select") {
                _this.queryCommonDataParam.wd = _this.keywords;
            } else if (
                _this.config.type === "company_select" 
            ) {
                _this.queryCommonDataParam.companyName = _this.keywords;
            } else {
                _this.queryCommonDataParam.condition = _this.keywords;
            }
            _this.tableDataLoading = true;
            _this.$Get(_this.config.options.remoteUrl, _this.queryCommonDataParam).then((res) => {
                if (res.errCode === 0) {
                    _this.totalPage = res.totalCount;
                    // 展示形式为表格
                    if (_this.config.options.displayModel === "table") {
                        if (res.desc) {
                            _this.colsArray = [];
                            let dataObj = res.desc;
                            Object.keys(dataObj).forEach(function (key) {
                                let newObj = {};
                                newObj.name = dataObj[key];
                                newObj.model = key;
                                _this.colsArray.push(newObj);
                            });
                        } else {
                            if (
                                _this.config.type === "user_select"
                            ) {
                                _this.colsArray = [
                                    { name: "用户名", model: "username" },
                                    {
                                        name: "真实名称",
                                        model: "realName",
                                    },
                                    { name: "所属组织", model: "orgName" },
                                    { name: "手机号", model: "phone" },
                                    { name: "邮箱", model: "email" },
                                ];
                            } else if (
                                _this.config.type === "company_select" ||
                                _this.config.type === "m_company_select"
                            ) {
                                _this.colsArray = [
                                    { name: "企业名称", model: "companyName" },
                                    {
                                        name: "行政区划",
                                        model: "administrativeAreaName",
                                    },
                                    { name: "所属行业", model: "industryName" },
                                    { name: "行业类别", model: "industyType" },
                                    {
                                        name: "国民经济行业类型",
                                        model: "economicTypeName",
                                    },
                                    { name: "组织机构代码", model: "companyCode" },
                                ];
                            }
                        }
                        if (res.datas) {
                            _this.tableData = res.datas;
                        } else {
                            _this.tableData = res.list;
                        }
                    }
                    if (!_this.KHUtils.isNull(_this.tableData)) {
                        _this.selectDialogVisible = true;
                    }
                }
                _this.tableDataLoading = false;
            });
        },
        // 列表选中触发
        handleSelectionChange(array) {
            console.log(array);
            if (array instanceof Array && array.length === 0) {
                return false;
            }
            this.selectTableData = [];
            if (
                !(
                    this.config.type == "m_data_select" ||
                    this.config.type == "m_org_select" ||
                    this.config.type == "m_user_select" ||
                    this.config.type == "m_role_select" ||
                    this.config.type == "m_company_select" ||
                    this.config.type == "m_dic_select"
                )
            ) {
                if (array instanceof Array && array.length >= 2) {
                    this.$notify.warning({
                        title: "警告",
                        message: "选择关联的数据不允许超过一条",
                    });
                    return false;
                }
            }
            this.selectTableData = array;
            this.handleSave();
        },
    },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/dialog-maxheight.scss";
.advancedControlsSelection{
    display: flex;
    position: relative;
   ::v-deep .el-input{
        .el-input__inner{
            padding-right: 30px;
        }
    }
    .el-icon-plus{
        position: absolute;
        right: 0px;
        height: 100%;
        border-top-right-radius: 4px;
        border-bottom-right-radius: 4px;
        width: 30px;
        font-size: inherit;
        display: flex;
        align-items: center;
        justify-content: center;
        background: rgba(51, 51, 51, 0.062);
    }
}
</style>