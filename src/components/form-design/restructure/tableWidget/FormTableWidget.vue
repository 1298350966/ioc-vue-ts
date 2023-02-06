<template>
   <div class="FormTableWidget scrollBar">
       <section class="flex_column">
           <!--功能按钮渲染-->
           <el-row class="button-box" :id="'btn'+item.id" v-if="item.data.btns instanceof Array &&  item.data.btns.length >0">
               <span v-for="(btn,key) in item.data.btns" :key="key">
                   <template v-if="btn.key == 'remove'">
                       <el-button class="top-btn-class" @click.stop="handleDeleteMulti" :loading="delLoading"  type="primary"  icon="el-icon-delete" :round="item.style.tableBorderStyle.btnRound">删除 </el-button>
                   </template>
                   <template v-else-if="btn.key == 'add'">
                       <el-button class="top-btn-class" @click.stop="handleAdd(btn)" type="primary"  icon="el-icon-plus" :round="item.style.tableBorderStyle.btnRound">新增</el-button>
                   </template>
                   
                   <template v-else-if="btn.key == 'import'">
                       <div class="top-btn-class" style="display:inline-block">
                           <el-upload
                               class="upload"
                               :action="uploadUrl"
                               :multiple="false"
                               :on-success="uploadCall"
                               :on-error="uploadError"
                               :before-upload="beforeUpload"
                               :show-file-list="false"
                           >
                               <el-button :loading="importLoading" type="primary" icon="el-icon-upload" :round="item.style.tableBorderStyle.btnRound">导入</el-button>
                           </el-upload>
                       </div>
                       <el-button class="top-btn-class" @click.stop="getExcelTemplate"  type="primary" icon="el-icon-download" :round="item.style.tableBorderStyle.btnRound">模板下载</el-button>
                   </template>
                   <template v-else-if="btn.key == 'export'">
                       <el-button class="top-btn-class" @click.stop="handleExport" :loading="exportLoading" type="primary"  icon="el-icon-download" :round="item.style.tableBorderStyle.btnRound">导出
                       </el-button>
                   </template>
                   <template v-else>
                       <template v-if="KHUtils.isNull(btn.imageId)">
                             <el-button class="top-btn-class" @click.stop="handleCustomJump(null,btn)" type="primary" :round="item.style.tableBorderStyle.btnRound" >{{btn.label}}</el-button>
                       </template>
                     <template v-else>
                           <img class="top-btn-class"
                               style="width: 60px; height: 30px;margin-bottom: -10px;margin-right: 10px"
                               :src="getImgeUrl(btn.imageId)"
                               @click.stop="handleCustomJump(null,btn)"
                               ></img>
                     </template>
                   </template>
               </span>

               <el-tooltip class="item" effect="dark" content="查看二维码" placement="top" style="float: right" v-if="item.enableQrCode">
                   <img alt=" " src="@/assets/images/qr-code.png" style="width: 30px;height: 30px;"
                        @click="handleViewQrCode('add')"/>
               </el-tooltip>
           </el-row>
           <!--列表、操作按钮渲染-->
           <el-row class="flex_column" v-if="refreshTable">
               <lb-form-table :column="colsArray" style="height: 100%" class="tableScollStyle"
                              v-loading="tdLoading"
                              :data="tableData"
                              :tableStyle="item.style"
                              :pagination="item.style.pagination"
                              :widgetId="item.id"
                              :pageListener="pageListener"
                              background
                              layout="total, prev, pager, next,jumper"
                              :page-sizes="[10, 20, 50, 100,200,300,500]"
                              :page-size="item.style.pageSize"
                              :current-page.sync="queryParam.pageNum"
                              :total="totalPage"
                              @size-change="handleSizeChange"
                              @p-current-change="handleCurrentChange"
                              :isShowChecked="isShowChecked"
                              :isShowSeq="isShowSeq"
                              :isShowOpt="isShowOpt"
                              :isShowStripe="item.style.tableBorderStyle.stripe"
                              @handleEdit="handleEdit"
                              @batchDel="batchDel"
                              @handleSelectionChange="handleSelectionChange"
                              @handleCustomJump="handleCustomJump"
                              @rowClick="rowClick"
                              border
                              :ref="'lbTable'+item.id">
               </lb-form-table>
           </el-row>

           <component :is="componentName" 
                v-if="componentVisible"
                :visible.sync="componentVisible" 
                :formTitle="formTitle" 
                :item="item"
                :btnConfig="btnConfig || {}" 
                :formId="formId" :addOrEdit="addOrEdit" 
                :tableShowType="tableShowType" 
                :hackReset="hackReset" 
                :formConfig="formConfig" 
                :dataModels="dataModels" 
                :allCols="allCols" 
                :tableFormConfig="tableFormConfig" 
                :formActiveName="formActiveName" 
                :parentBusinessId="parentBusinessId" 
                :businessId="businessId" 
                :parentSaveDisable="parentSaveDisable" 
                @close="componentClose"
                >
            </component>
            
           <!--列表字段点击弹窗-->
           <component 
            :is="jumpComponent" 
            v-if="customVisible"
            :visible.sync="customVisible"
            :customTitle="customTitle"
            :jumpDialogWidth="jumpDialogWidth"
            :jumpDialogTop="jumpDialogTop"
            :jumpDialogHeight="jumpDialogHeight"
            :jumpDialogFullscreen="jumpDialogFullscreen"
            :customUrl="customUrl" 
            :customComponent="customComponent" 
            :customProps="customProps" 
            :customHackSet="customHackSet" 
            :iframeHeight="iframeHeight"
            @close="componentClose">
            </component>
           <el-dialog
               title="二维码管理"
               custom-class="advanced-set-dialog"
               :visible.sync="qrCodeVisible"  :append-to-body="true"
               :close-on-click-modal="false" :modal="false"
               width="600px"
           >
               <qr-code-manager :formId="formId" :qrCodeType="qrCodeType" :dataId="businessId" v-if="qrCodeVisible"></qr-code-manager>
           </el-dialog>
       </section>
   </div>
</template>

<script>
    import FormBuild from "@/components/form-build/RestructureFormBuild";
    import PortraitRestructureFormBuild from "@/components/form-build/PortraitRestructureFormBuild";
    import PortraitRestructureFormDetailBuild from "@/components/form-build/PortraitRestructureFormDetailBuild";
    import FormDetailBuild from "@/components/form-build/RestructureFormDetailBuild";
    import SingleTable from "@/components/table/SingleTable";
    import AddSingleTable from "@/components/table/AddSingleTable";
    import BatchTable from "@/components/table/BatchTable";
    import LbFormTable from '@/components/lb-table/lb-form-table';
    import QrCodeManager from '@/components/qr-code-set/QrCodeManager'
    
    const inv = [];
    export default {
        name: "FormTableWidget",
        //assignConditions 默认固定的查询条件
        props: ['item', 'formId', 'queryParams','isPreview','assignConditions'],
        components: {
            FormBuild,
            SingleTable,
            BatchTable,
            LbFormTable,
            FormDetailBuild,
            QrCodeManager,
            AddSingleTable,
            PortraitRestructureFormBuild,
            PortraitRestructureFormDetailBuild,
        },
        created() {
            let _this = this;
            //样式设置兼容处理
            if (!_this.item.style.tableHeaderStyle) {
                _this.item.style.tableHeaderStyle = {
                    cellColor: null,
                    cellFontSize: '14px',
                    cellPosition: 'center',
                    cellBorderColor: null,
                    backgroundColor: null,
                    cellHeight: '50'
                }
            }
            if (!_this.item.style.tableBodyStyle) {
                _this.item.style.tableBodyStyle = {
                    cellColor: null,
                    cellFontSize: '12px',
                    cellPosition: 'left',
                    cellBorderColor: null,
                    backgroundColor: '#FFFFFF',
                    backgroundColorHover: '#F5F7FA',
                    cellHeight: '40',
                    optFontSize: '12px',
                    optColor: null

                }
            }
            if (!_this.item.style.tableBorderStyle) {
                _this.item.style.tableBorderStyle = {
                    boderSize: '0px',
                    boderColor: null,
                    btnBgColor: null,
                    btnFontColor: null,
                }
            }
            if (!_this.item.style.tablePaginationStyle) {
                _this.item.style.tablePaginationStyle = {
                    fontColor: null,
                    buttonStyle: {
                        backgroundColor: null,
                        fontColor: null,
                    },
                    buttonActiveStyle: {
                        backgroundColor: null,
                        fontColor: null,
                    },
                    inputStyle: {
                        backgroundColor: null,
                        fontColor: null,
                        borderWidth: '1px',
                        borderColor: null
                    }
                }
            }

            //_this.KHForm.loadFormConf(_this,_this.formId, "");

        },
        computed:{
            tableShowType(){
               return this.item.showType.tableShowType || "transverse"
            },
            getImgeUrl(){
                return function (imageUrl) {
                    //如果是完整图片路径直接返回 ，如果是uuid 就补齐路径
                    if(this.KHUtils.isUrlPath(imageUrl) == true){
                        return imageUrl;
                    }else {
                        return  this.khConfig.host.rest + this.khConfig.api.imageDownload + "/" + imageUrl;
                    }

                }
            },
            componentVisible:{
                get(){
                    if(this.formTitle == "新增" || this.formTitle == "编辑"){
                        return this.editFormVisible
                    }else if(this.formTitle == "详情"){
                        return this.formDetailVisible
                    }
                },
                set(val){
                    if(this.formTitle == "新增" || this.formTitle == "编辑"){
                        return this.editFormVisible = val
                    }else if(this.formTitle == "详情"){
                        return this.formDetailVisible = val
                    }
                }
            }
        },
        watch: {
            'item.data.btns': {
                deep: true,
                handler() {
                    this.funButtonConvert();
                    setTimeout(() => {
                        this.$refs["lbTable" + this.item.id].initTableBorderStyle();
                    }, 10);

                }
            },
        },
        beforeDestroy() {
            let _this = this;
            _this.KHForm.clearExportTimer(_this);
            _this.KHForm.clearImportTimer(_this);
            // 清除计时器
            Object.keys(inv).forEach(function (k) {
                clearInterval(inv[k]);
            });
        },
        mounted() {
            this.iframeHeight = document.body.clientHeight * 0.6 + 'px';
            if(this.$attrs.hasOwnProperty("formConfig")){
               this.formConfig = this.$attrs.formConfig
               this.initLoadFormConf()
            }else{
                new Promise((resolve, reject) => {
                    this.loadFormConf(resolve);
                }).then(()=>{
                    if (this.item.data && this.item.data.cols instanceof Array && this.item.data.cols.length > 0) {
                        this.renderTable();
                    }
                })
            }
            let param = this.formId + "&" + this.item.id;
            this.uploadUrl = this.khConfig.host.rest + this.khConfig.api.importForm + "/" + param;  // 导入接口
            //启动定时任务
            this.autoRefresh();

        },
        data() {
            return {
                jumpComponent:null,
                componentName:null,
                btnConfig:null,
                iframeHeight: 600 + 'px',
                // tableShowType:"transverse",
                jumpDialogWidth: 50,
                jumpDialogFullscreen: false,
                jumpDialogTop:10,
                jumpDialogHeight:"",
                // customCss1: 'custom-pop-iframe',
                // customCss2: 'custom-dialog-form',
                customTitle: "", // 弹窗名称
                customVisible: false,
                customComponent: "",
                customProps: {},
                customHackSet: false,
                customUrl: "", // 默认弹窗
                // 操作按钮自定义跳转
                optBtnList:[],//操作按钮
                allCols: [], // 所有拉取的控件
                tableFormConfig: [],  // 子表单控件集合
                formActiveName: "", // 子表单页签
                // addShowNormal: true, // 新增页面以非弹窗,即普通方式展示
                importExcelFileId: "", // 导出Excel文件ID
                parentSaveDisable: false,
                parentFormId: 0,
                parentBusinessId: 0,
                tdLoading: false,
                uploadUrl: "",
                importLoading: false,
                exportLoading: false,
                excelFileId: "", // 导出Excel文件ID
                queryDataModels: {},
                multipleSelection: [],
                delLoading: false,
                tableData: [],
                formTitle: "新增",
                editFormVisible: false,
                formDetailVisible:false,
                formConfig: {},
                dataModels: {},
                blank: '',
                nextLoading: false,
                queryParam: {
                    pageNum: 1,    // 查询参数
                    pageSize: 10,
                    formId: 0,
                    widgetId: 0,
                    widget: {},
                    queryConditions: []
                },
                totalPage: 0,
                // normalHackReset: false,
                hackReset: false,
                businessId: "",  // 业务ID
                //  formId: 0,  // 表单ID
                addOrEdit: false,
                dynCols: [],  // 动态列
                switchMsgObj: {},
                isShowSeq: false, // 表格是否显示序号
                isShowChecked: false, // 表格是否显示Checked框
                isShowOpt: false, // 表格预览是否显示操作
                condFormConfig: {
                    list: [],
                    config: {
                        labelWidth: 100,
                        labelPosition: 'right',
                        size: 'small'
                    }
                }, // 查询条件设置
                queryConditions: {},
                condSetHackRest: false,
                condColumnSet: 3, // 列
                colsArray: [],
                isShowFunAdd: false, // 是否显示新增
                isShowFunRemove: false, // 是否显示删除
                isShowFunImport: false, // 是否显示导入
                isShowFunExport: false, // 是否显示导出
                customBtns: [],//除导入导出新增删除以外的自定义按钮
                timerIdEnd: "",
                importTimerIdEnd: "",
                pageListener: 1,
                colorRed: "#ddff22",
                refreshTable:true,
                exportModelInfo:[],
                qrCodeType:"",
                qrCodeVisible:false,
            }

        },
    methods: {
        componentClose(){
            this.listData();
        },
        closeCustomDialog(){
            let _this = this;
            _this.customVisible = false;
            _this.listData();
        },
        rowClick(row, column){
            //是否设置联动
            if(this.item.data.allowLinkage){
                this.$EventBus.$emit("topic-form-"+this.formId,row);
            }

        },
        //查看二维码
        handleViewQrCode(qrCodeType){
            this.qrCodeType=qrCodeType;
            this.qrCodeVisible = true
        },
        // 定时任务刷新
        autoRefresh() {
            let _this = this;
            if (_this.item.sensior && _this.item.sensior.autoRefresh && _this.isPreview) {
                let countType = _this.item.sensior.countType;
                let senconds = 0;
                let tempCount = 0;
                if ("minute" === countType) {
                     senconds = 60 * _this.item.sensior.count;
                }else if("seconds" === countType){
                    senconds =  _this.item.sensior.count;
                }else {
                    senconds = 60 * _this.item.sensior.count;
                }

                inv[_this.item.id] = setInterval(function () {
                     let conditions = _this.queryParam.queryConditions;
                    _this.renderTable(conditions);
                }, senconds*1000)

            }


        },
        initLoadFormConf(){
            let _this = this;
            _this.dynCols = [];
            _this.allCols = [];
            _this.dynColsWithSubTable = [];
            _this.tableFormConfig = [];
            // 根据formId查询表单配置
            if (!_this.KHUtils.isNull(_this.formConfig)) {
                        _this.KHForm.convertSensorSettingsV2(_this.formId, _this);
                        if (_this.KHUtils.isNull(_this.formConfig)) {
                            _this.$notify.warning({
                                title: '警告',
                                message: "表单ID(" + _this.formId + "): 暂未进行相关的表单设计"
                            });
                        }
                        let tempConfig = _this.formConfig;
                        if (!tempConfig || _this.KHUtils.isNull(tempConfig.list)) {
                            return false;
                        }
                            // 遍历配置
                        for (let i = 0, n = tempConfig.list.length; i < n; i++) {
                            let obj = tempConfig.list[i];
                            if ("grid" === obj.type) {
                                loop(obj, _this.dynCols, _this);
                                loopAll(obj, _this.allCols, _this);

                                function loop(obj, arr, _this) {
                                    let columns = obj.columns;
                                    for (let j = 0, m = columns.length; j < m; j++) {
                                        let colObj = columns[j];
                                        colObj.list.forEach(lsObj => {
                                            if (lsObj.type === 'switch') {
                                                _this.switchMsgObj[lsObj.model] = [lsObj.options.openMsg, lsObj.options.closeMsg];
                                            }
                                            if (lsObj.type === 'data_select' || lsObj.type === 'org_select'
                                                || lsObj.type === 'user_select'
                                                || lsObj.type === 'company_select'
                                                || lsObj.type === 'role_select'
                                                || lsObj.type === 'dic_select') {
                                                _this.KHForm.processDataSourceControl(lsObj, arr, _this);
                                            } else if (lsObj.type === 'gis_select') {
                                                _this.KHForm.processGisControl(lsObj, arr, _this);
                                            } else if (lsObj.type === 'region_select') {
                                                _this.KHForm.processRegionControl(lsObj, arr, _this);
                                            } else {
                                                arr.push(lsObj);
                                            }
                                            if ("grid" === lsObj.type) {
                                                loop(obj, _this);
                                            }
                                        })
                                    }
                                }

                                function loopAll(obj, arr, _this) {
                                    let columns = obj.columns;
                                    for (let j = 0, m = columns.length; j < m; j++) {
                                        let colObj = columns[j];
                                        colObj.list.forEach(lsObj => {
                                            arr.push(lsObj);
                                            if ("grid" === lsObj.type) {
                                                loop(obj, _this);
                                            }
                                        })
                                    }
                                }
                            } else if ("table" === obj.type) {
                                obj.subData = [];
                                _this.tableFormConfig.push(obj);      // 子表单独立组件显示
                                if (_this.tableFormConfig.length > 0) {
                                    _this.formActiveName = _this.tableFormConfig[0].model;
                                }
                            } else {
                                _this.allCols.push(obj);
                                if (obj.type === 'switch') {
                                    _this.switchMsgObj[obj.model] = [obj.options.openMsg, obj.options.closeMsg];
                                }
                                if (obj.type === 'data_select' || obj.type === 'org_select'
                                    || obj.type === 'user_select'
                                    || obj.type === 'company_select'
                                    || obj.type === 'role_select'
                                    || obj.type === 'dic_select') {
                                    _this.KHForm.processDataSourceControl(obj, _this.dynCols, _this);
                                } else if (obj.type === 'gis_select') {
                                    _this.KHForm.processGisControl(obj, _this.dynCols, _this);
                                } else if (obj.type === 'region_select') {
                                    _this.KHForm.processRegionControl(obj, _this.dynCols, _this);
                                } else {
                                    _this.dynCols.push(obj);
                                }
                            }
                        }

            } else {
                _this.$notify.warning({
                    title: '警告',
                    message: "表单ID(" + _this.formId + "): 暂未进行相关的表单设计"
                });
            }
            if (this.item.data && this.item.data.cols instanceof Array && this.item.data.cols.length > 0) {
                this.renderTable();
            }
        },
        loadFormConf(resolve) {
            let _this = this;
            if (_this.KHUtils.isNull(_this.formId)) {
                _this.$notify.error({
                    title: '错误',
                    message: '路由formId为空'
                });
                return false;
            }
            if (!_this.KHUtils.isNumber(_this.formId)) {
                _this.$notify.error({
                    title: '错误',
                    message: '路由formId不为字符串:'
                });
                return false;
            }
            _this.dynCols = [];
            _this.allCols = [];
            _this.tableFormConfig = [];
            // 根据formId查询表单配置
            _this.$Get(_this.khConfig.api.getFormConf + "/" + _this.formId).then(res => {
                if (res.errCode === 0) {
                    if (!_this.KHUtils.isNull(res.formConf)) {
                        _this.formConfig = JSON.parse(res.formConf.formMeta);
                        _this.KHForm.convertSensorSettingsV2(_this.formId, _this);
                        if (_this.KHUtils.isNull(_this.formConfig)) {
                            _this.$notify.warning({
                                title: '警告',
                                message: "表单ID(" + _this.formId + "): 暂未进行相关的表单设计"
                            });
                        }
                        let tempConfig = JSON.parse(res.formConf.formMeta);
                        if (!tempConfig || _this.KHUtils.isNull(tempConfig.list)) {
                            return false;
                        }
                        // 遍历配置
                        for (let i = 0, n = tempConfig.list.length; i < n; i++) {
                            let obj = tempConfig.list[i];
                            if ("grid" === obj.type) {
                                loop(obj, _this.dynCols, _this);
                                loopAll(obj, _this.allCols, _this);

                                function loop(obj, arr, _this) {
                                    let columns = obj.columns;
                                    for (let j = 0, m = columns.length; j < m; j++) {
                                        let colObj = columns[j];
                                        colObj.list.forEach(lsObj => {
                                            if (lsObj.type === 'switch') {
                                                _this.switchMsgObj[lsObj.model] = [lsObj.options.openMsg, lsObj.options.closeMsg];
                                            }
                                            if (lsObj.type === 'data_select' || lsObj.type === 'org_select'
                                                || lsObj.type === 'user_select'
                                                || lsObj.type === 'company_select'
                                                || lsObj.type === 'role_select'
                                                || lsObj.type === 'dic_select') {
                                                _this.KHForm.processDataSourceControl(lsObj, arr, _this);
                                            } else if (lsObj.type === 'gis_select') {
                                                _this.KHForm.processGisControl(lsObj, arr, _this);
                                            } else if (lsObj.type === 'region_select') {
                                                _this.KHForm.processRegionControl(lsObj, arr, _this);
                                            } else {
                                                arr.push(lsObj);
                                            }
                                            if ("grid" === lsObj.type) {
                                                loop(obj, _this);
                                            }
                                        })
                                    }
                                }

                                function loopAll(obj, arr, _this) {
                                    let columns = obj.columns;
                                    for (let j = 0, m = columns.length; j < m; j++) {
                                        let colObj = columns[j];
                                        colObj.list.forEach(lsObj => {
                                            arr.push(lsObj);
                                            if ("grid" === lsObj.type) {
                                                loop(obj, _this);
                                            }
                                        })
                                    }
                                }
                            } else if ("table" === obj.type) {
                                obj.subData = [];
                                _this.tableFormConfig.push(obj);      // 子表单独立组件显示
                                if (_this.tableFormConfig.length > 0) {
                                    _this.formActiveName = _this.tableFormConfig[0].model;
                                }
                            } else {
                                _this.allCols.push(obj);
                                if (obj.type === 'switch') {
                                    _this.switchMsgObj[obj.model] = [obj.options.openMsg, obj.options.closeMsg];
                                }
                                if (obj.type === 'data_select' || obj.type === 'org_select'
                                    || obj.type === 'user_select'
                                    || obj.type === 'company_select'
                                    || obj.type === 'role_select'
                                    || obj.type === 'dic_select') {
                                    _this.KHForm.processDataSourceControl(obj, _this.dynCols, _this);
                                } else if (obj.type === 'gis_select') {
                                    _this.KHForm.processGisControl(obj, _this.dynCols, _this);
                                } else if (obj.type === 'region_select') {
                                    _this.KHForm.processRegionControl(obj, _this.dynCols, _this);
                                } else {
                                    _this.dynCols.push(obj);
                                }
                            }
                        }

                    } else {
                        _this.$notify.warning({
                            title: '警告',
                            message: "表单ID(" + _this.formId + "): 暂未进行相关的表单设计"
                        });
                    }
                }
                resolve();
            });
        },
        //获取table 高级设置配置信息
        initSensorSettings(){
            let _this = this;
            _this.colsArray = [];
            _this.isShowSeq = false;
            _this.isShowOpt = false;


            //显示列
            let optWidth;
            if (_this.item.data.cols instanceof Array && _this.item.data.cols.length > 0) {
            _this.item.data.cols.forEach((col, index) => {
                let key = col.key;
                if (key === "$seq") {
                _this.isShowSeq = true;
                } else if (key === "$opt") {
                _this.isShowOpt = true;
                    if(!_this.KHUtils.isNull(col.width)){
                        optWidth=col.width+"px"
                    }
                } else {
                let newObj = {};
                    let currentCol =  _this.findColByKey(col.key,this.dynCols);
                newObj.prop = col.key;
                newObj.label = _this.KHUtils.isNull(col.alias) ? col.name : col.alias;
                if(!_this.KHUtils.isNull(col.width)){
                    newObj.width=col.width+"px"
                }
                let jumpStyle =this.item.style.tableBodyStyle.optColor ?"color:"+this.item.style.tableBodyStyle.optColor:"color:#409EFF";
                    if(currentCol && (currentCol.type == 'image_upload'|| currentCol.type == 'signature')){
                        newObj.render = (h,scope) =>{
                            let html=[] ;
                            if(!this.KHUtils.isNull(scope.row[scope.column.property])){
                                let imageIds = scope.row[scope.column.property].split(",");
                                for(var i = 0;i<imageIds.length;i++){
                                    if(!this.KHUtils.isNull(imageIds[i])){
                                        html.push(<el-image
                                        style="width: 30px; height: 30px;margin-left:10px"
                                        src={this.getImgeUrl(imageIds[i])}
                                    ></el-image>)
                                    }

                                }

                            }
                            return (

                                <div>
                                {html}
                                </div>

                            )
                        };
                    }else {
                        if(col.isJump){
                            newObj.render = (h,scope) =>{
                                return (
                                    <div>
                                    <a type="text"  onClick={ (e)=>{e.stopPropagation() ;this.handleCustomJump(scope.row,col)}} style={jumpStyle}>{scope.row[scope.column.property]}</a>
                                </div>
                                )
                            };
                        }else {
                            newObj.formatter = _this.formatCustom;
                        }
                    }
                _this.colsArray.push(newObj);
                }
            })



            }
            //功能按钮
            _this.funButtonConvert();

            //操作按钮
            _this.optBtnList = [];
            if (_this.item.data.optButtons instanceof Array && _this.item.data.optButtons.length > 0) {
            _this.item.data.optButtons.forEach((optButton, index) => {
                let key = optButton.key;
                if ("export" === key){
                    _this.exportModelInfo = optButton.exportModelInfo;
                }

                if ("edit" !== key && "delete" !== key && 'export' !== key  && 'detail' !== key) {
                let temp = _this.KHUtils.clone(optButton);
                if (temp.jumpInfo&&temp.jumpInfo.urlType) {
                    if (temp.jumpInfo.urlType === '0') {
                        if(temp.jumpInfo.url){
                        let componentName = temp.jumpInfo.url.substring(temp.jumpInfo.url.lastIndexOf('/') + 1, temp.jumpInfo.url.length);
                        _this.KHForm.registerComponent(componentName, temp.jumpInfo.url);
                        }

                    }
                    if (temp.imageId && !_this.KHUtils.isNull(temp.imageId)) {
                    temp.imageId = _this.khConfig.host.rest + _this.khConfig.api.imageDownload + "/" + optButton.imageId;
                    if (temp.jumpInfo) {
                        // 组件方式弹窗的形式
                        // urlType:0 组件方式; urlType:1
                        // Url路径 Vue.component("CustomUpload",require(`../components/CustomUpload`).default);
                        temp.isImage = true;
                    }
                    } else {
                    temp.isImage = false;
                    temp.imageId = temp.jumpInfo.label ? temp.jumpInfo.label : temp.label;
                    }
                    _this.optBtnList.push(temp);
                }
                }else {
                    _this.optBtnList.push(optButton);
                }
            })
            }


            if(_this.isShowOpt){
                let optObj = {
                    label: '操作',

                    render: (h, scope) => {
                        let optStyle;
                        let optStyle1;
                        if(this.item.style.tableBodyStyle){
                        /*  optStyle = "color:"+this.item.style.tableBodyStyle.optColor+";font-size:"+this.item.style.tableBodyStyle.optFontSize;*/
                            optStyle = "margin-left:3px;color:"+this.item.style.tableBodyStyle.optColor+";border:"+this.item.style.tableBodyStyle.optBoder+" solid "+this.item.style.tableBodyStyle.optBoderColor+";font-size:"+this.item.style.tableBodyStyle.optFontSize+";background-color:"+this.item.style.tableBodyStyle.optBgColor+";border-radius:"+this.item.style.tableBodyStyle.optBorderRadius;
                            optStyle1 = "color:"+this.item.style.tableBodyStyle.optColor+";font-size:"+this.item.style.tableBodyStyle.optFontSize;
                        }
                        return (
                            <div class="operation-box">
                        {
                            this.optBtnList.map((opt,index) =>{
                                if(this.isShowOptBtn(opt,scope.row)){
                                    if(opt.key == "edit"){
                                       return  <el-button round style={optStyle} size="small"  onClick={ (e) => {e.stopPropagation() ; this.handleEdit( scope.row,opt) } }>{opt.label}</el-button>
                                    }else if(opt.key == "delete"){
                                        return <el-button round size="small" style={optStyle} onClick={ (e) => { e.stopPropagation() ;this.batchDel(scope.row) } }>{opt.label}</el-button>
                                    }else if(opt.key == "detail"){
                                        return  <el-button round style={optStyle} size="small"  onClick={ (e) => { e.stopPropagation() ;this.handleDetail( scope.row, opt) } }>{opt.label}</el-button>
                                    }else if(opt.key == "export"){
                                        let _this = this;
                                         return  <el-dropdown  style="margin-left:0px;margin-right:0px;">
                                            <el-button   style={optStyle} round size="small" >{opt.label}</el-button>
                                            <el-dropdown-menu slot="dropdown">

                                            { h('div',{}, _this.exportModelInfo.map(function (item) {
                                            return <el-dropdown-item ><el-button  style={optStyle1} type="text"size="small"  onClick={ (e) => { e.stopPropagation() ;_this.exportModel(scope.row,item) } }>{item.name}</el-button></el-dropdown-item>
                                        }))}

                                    </el-dropdown-menu>
                                        </el-dropdown>
                                    }else {
                                        if(opt.isImage){
                                            let image = opt.imageId;
                                            let imgsrc2 = require('../../../../assets/images/excel.png')
                                            return   <img alt=" " key={index} src={opt.imageId} style="width: 32px;height: 32px;margin-left:5px" onClick={ () => { this.handleCustomJump(scope.row,opt) } } />
                                        }else {
                                            return  <el-button key={index} style={optStyle} onClick={ (e) => {e.stopPropagation() ; this.handleCustomJump(scope.row,opt) } } round size="small">{opt.imageId}</el-button>
                                        }
                                    }

                                }

                            })
                        }
                        </div>
                        )
                    }
                }

                if(!_this.KHUtils.isNull(optWidth)){
                    optObj.width=optWidth
                }
            _this.colsArray.push(optObj)
            }
        },
        isShowOptBtn(btn,row){
          let isShow = true;
          if(btn.cond instanceof Array && btn.cond.length >0){
             for(var i = 0;i<btn.cond.length;i++){
                 let cond = btn.cond[i];
                 if(!this.matchOptCondition(cond,row)){
                     return false;
                 }
             }

          }
          return isShow;
        },
        matchOptCondition(cond,row){
            let model = cond.model;
            let values = cond.values;
            let mv = row[model];
            if(values instanceof Array && values.length >0){
                for(var i = 0;i<values.length ;i++){
                    if(values[i] === mv+""){
                        return true;
                    }
                }
                return false;
            }
            return false;
        },
        funButtonConvert() {
            let _this = this;
            _this.customBtns = [];
            _this.isShowFunAdd = false;
            _this.isShowFunRemove = false;
            _this.isShowFunImport = false;
            _this.isShowFunExport = false;
            _this.isShowChecked = false;
            if (_this.item.data.btns instanceof Array && _this.item.data.btns.length > 0) {
                _this.item.data.btns.forEach((btn, index) => {
                    let key = btn.key;
                    if ("remove" === key || "import" === key || "export" === key) _this.isShowChecked = true;
                    if ("add" === key) _this.isShowFunAdd = true;
                    if ("remove" === key) _this.isShowFunRemove = true;
                    if ("import" === key) _this.isShowFunImport = true;
                    if ("export" === key) _this.isShowFunExport = true;
                    //自定义按钮
                    if (key != "remove" && key != "add" && key != "import" && key != "export") {
                        _this.customBtns.push(btn);
                    }
                })
            }
        },
        // 初始话表单样式
        initAddEditFormStyle() {
            let _this = this;
            setTimeout(() => {
                if (!_this.KHUtils.isNull(_this.formConfig.config.backgroundColor)) {
                    var addEditDialog = document.getElementById(_this.formId);
                    if (addEditDialog !== null) {
                        var elDialog = addEditDialog.getElementsByClassName(" el-dialog");
                        for (var i = 0; i < elDialog.length; i++) {
                            if (elDialog[i]._prevClass === 'el-dialog') {
                                elDialog[i].setAttribute("style", "background-color:" + _this.formConfig.config.backgroundColor + ";margin-top: 15vh;width:80%");
                            }
                        }
                        var elDialogTitle = addEditDialog.getElementsByClassName(" el-dialog__title");
                        for (var i = 0; i < elDialogTitle.length; i++) {
                            if (elDialogTitle[i]._prevClass === 'el-dialog__title') {
                                elDialogTitle[i].setAttribute("style", "color:" + _this.formConfig.config.widgetTitleFontColor + ";line-height: 24px;font-size: 18px");
                            }
                        }
                    }
                    // 保存按钮
                    var elButtonPrimary = addEditDialog.getElementsByClassName(" el-button--primary");
                    let btnWidgetBackgroundColor = _this.formConfig.config.btnWidgetBackgroundColor;
                    let btnWidgetFontColor = _this.formConfig.config.btnWidgetFontColor;
                    for (var i = 0; i < elButtonPrimary.length; i++) {
                        if (elButtonPrimary[i].textContent === '保存') {
                            elButtonPrimary[i].setAttribute("style", "background-color:" + btnWidgetBackgroundColor + ";border-color:" + btnWidgetBackgroundColor + ";color:" + btnWidgetFontColor + ";float:right");
                        } else if (elButtonPrimary[i].textContent === '新增' || elButtonPrimary[i].textContent === '删除') {
                            elButtonPrimary[i].setAttribute("style", "background-color:" + btnWidgetBackgroundColor + ";border-color:" + btnWidgetBackgroundColor + ";color:" + btnWidgetFontColor);
                        }
                    }
                }
            }, 100);
        },
        // 列表显示格式化
        formatCustom(row, column) {
            let _this = this;
            return _this.KHForm.formatCustom(row, column, _this);
        },
        //刷新table
        renderTable(conditions) {
            let _this = this;
            _this.initSensorSettings();
            _this.queryParam.formId = _this.formId;
            if (_this.item.style.pagination) {
                _this.queryParam.pageNum = 1;
                _this.queryParam.pageSize = _this.item.style.pageSize;
            } else {
                _this.queryParam.pageNum = 1;
                _this.queryParam.pageSize = _this.item.querySize;
            }
            _this.queryParam.widgetId = _this.item.id;
            if (conditions instanceof Array && conditions.length > 0) {
                _this.queryParam.queryConditions = conditions;
            } else {
                _this.queryParam.queryConditions = [];
            }
            let widget = {};
            widget.id = _this.item.id;
            widget.name = _this.item.name;
            widget.type = _this.item.type;
            widget.reportType = _this.item.reportType;
            widget.data = {
                condFilters: [],
                querySort: []
            };
            if (_this.item.data.condFilters instanceof Array && _this.item.data.condFilters.length > 0) {
                _this.item.data.condFilters.forEach((cond, index) => {
                    widget.data.condFilters.push(cond);
                })
            }
            if (_this.item.data.querySort instanceof Array && _this.item.data.querySort.length > 0) {
                _this.item.data.querySort.forEach((sort, index) => {
                    widget.data.querySort.push(sort);
                })
            }
            _this.queryParam.widget = widget;
            _this.listData();
            _this.pageListener++;
            _this.refreshTable = false;
            // 重新渲染子组件
            _this.$nextTick(() => {
                _this.refreshTable = true;
            });

        },
        handleSizeChange(val) {
            let _this = this;
            _this.item.style.pageSize = val;
        },
        // 查询表格数据
        listData() {
            this.tdLoading = true;
            let url;
              if(!this.isPreview){
             url = this.khConfig.api.previewQueryFormDataV2;
             }else {
             url = this.khConfig.api.queryFormDataV2;
             this.queryParam.widget={};
             }
            let menuParamUrl = this.KHForm.getPQuery(this);
            if(!this.KHUtils.isNull(menuParamUrl)){
                url = url+"?"+menuParamUrl;
            }
            //添加默认固定的查询条件
            if(this.assignConditions instanceof Array && this.assignConditions.length >0){
                this.queryParam.queryConditions = this.assignConditions
            }
            this.$PostJson(url, this.queryParam).then(res => {
                if (res.errCode === 0) {
                    this.tableData = res.datas;
                    this.totalPage = res.totalCount;
                    this.tdLoading = false;
                } else {
                    this.tdLoading = false;
                }
            });

        },
        // 分页查询
        handleCurrentChange(val) {
            let _this = this;
            _this.queryParam.pageNum = val;
            _this.listData();  // 无查询条件设置
            _this.pageListener++;
        },
        // 查询条件重置
        resetCond() {
            this.$refs.condSetForm.reset();
        },
        // 按条件查询
        queryByCond(flag) {
            let _this = this;
            if (_this.KHUtils.isNull(_this.queryConditions) || _this.queryConditions.length === 0) {
                return false;
            }
            if (!flag) {
                // 直接点击查询条件查询
                _this.queryParam.pageNum = 1;
            }
            this.$refs.condSetForm.getData().then(data => {
                let param = [];
                _this.KHForm.processCond(data, param, _this);   // 查询条件参数处理
                let postJsParam = {
                    "formId": _this.formId,
                    "pageNum": _this.queryParam.pageNum,
                    "pageSize": 10,
                    "queryConditions": param
                };
                this.$PostJson(this.khConfig.api.queryFormDataByConditions, postJsParam).then(res => {
                    if (res.errCode === 0) {
                        this.tableData = res.datas;
                        this.totalPage = res.totalCount;
                    }
                });
            });
        },
        // 新增
        handleAdd(btn) {
            this.btnConfig = btn
            this.asyncComp(btn)
            let _this = this;
            if(_this.tableFormConfig instanceof Array && _this.tableFormConfig.length >0){
                _this.tableFormConfig.forEach((table,index)=>{
                    table.subData = [];
                })
            }
            _this.editFormVisible = true;
            _this.parentSaveDisable = false;
            _this.businessId = "";
            _this.hackReset = false;
            _this.formTitle = "新增";
            _this.addOrEdit = true;
            _this.dataModels = {};

            // 新增页面设置处理
            _this.parentFormId = _this.formId;
            _this.parentBusinessId = 0;
            // 重新渲染子组件
            _this.$nextTick(() => {
                _this.hackReset = true
            })
        },
        // 编辑
        handleEdit(row,opt) {
            this.btnConfig = opt  
            this.asyncComp(opt)
            let _this = this;
            // _this.KHForm.handleEdit(row, _this);
            let tempRow = _this.KHUtils.clone(row);
            _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
            _this.formTitle = "编辑";
            _this.parentSaveDisable = false;
            _this.editFormVisible = true;
            _this.dataModels = tempRow;
            _this.businessId = row.id;
            _this.addOrEdit = false;
            _this.hackReset = false;
            _this.parentFormId = _this.formId;
            _this.parentBusinessId = row.id;
            _this.hackReset = false;
            // 重新渲染子组件
            _this.$nextTick(() => {
                _this.hackReset = true;
            });
        },
        handleDetail(row,opt) {
            this.btnConfig = opt  
            this.asyncComp(opt)
            let _this = this;
            let tempRow = _this.KHUtils.clone(row);
            _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
            _this.formTitle = "详情"
            _this.parentSaveDisable = false;
            _this.formDetailVisible = true;
            _this.dataModels = tempRow;
            _this.businessId = row.id;
            _this.addOrEdit = false;
            _this.hackReset = false;
            _this.parentFormId = _this.formId;
            _this.parentBusinessId = row.id;
            _this.hackReset = false;
            // 重新渲染子组件
            _this.$nextTick(() => {
                _this.hackReset = true;
            });
        },
        //异步加载组件
        asyncComp(btn){
            if(btn.displayConfig && btn.displayConfig.type == "1"){
                var cn="formPage"     
            }else{
                var cn="formDialog" 
            }
            let ts = () => import(`./components/${cn}`);
            this.$options.components[cn]=ts;
            this.componentName = cn;
        },

        // 删除选中的多条记录
        handleDeleteMulti() {
            if (this.multipleSelection === "" || this.multipleSelection.length === 0) {
                this.$notify({
                    title: '警告',
                    message: '请选择要删除的记录',
                    type: 'warning'
                });
            } else {
                this.batchDel(this.multipleSelection);
            }
        },
        // 批量删除操作
        batchDel(multipleSelection) {
            let _this = this;
            _this.KHForm.batchDel(multipleSelection, _this);
        },
        // 选中列表数据
        handleSelectionChange(array) {
            this.multipleSelection = array;
        },
        // // 保存数据
        // saveData() {
        //     let _this = this;
        //     _this.KHForm.saveData(_this);
        // },
        // //保存新增数据
        // saveAddData(){
        //     let _this = this;
        //     _this.$refs.buildForm.getData().then(data => {
        //         this.$confirm('确认保存吗？', '提示', {}).then(() => {
        //             let newData = JSON.parse(JSON.stringify(data));
        //             _this.KHForm.formatDynCols(newData, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
        //             let param = {
        //                 parent:{},
        //                 child:[]
        //             }
        //             //this.checkMapData(newData);
        //             param.parent = newData;
        //             if(_this.tableFormConfig instanceof Array && _this.tableFormConfig.length >0){
        //                 _this.tableFormConfig.forEach((table,index)=>{
        //                     if(!_this.KHUtils.isNull(table.key) && table.subData instanceof Array && table.subData.length >0){
        //                         table.subData.forEach((tableData,index1)=>{
        //                             _this.convertParam(tableData,table.tableColumns);
        //                         })
        //                         let newObj = {};
        //                         newObj.subKey = table.key;
        //                         //this.checkMapData(table.subData);
        //                         //剔除为null的数据
        //                         let newDatas = [];
        //                         if(table.subData instanceof Array && table.subData.length >0){
        //                             table.subData.forEach((data,index)=>{
        //                                 let newObj = {};
        //                                 Object.keys(data).forEach(function (key) {
        //                                     if(data[key] != null){
        //                                         newObj[key] = data[key];
        //                                     }
        //                                 });
        //                                 newDatas.push(newObj);
        //                             })
        //                         }
        //                         newObj.subDatas= newDatas;
        //                         param.child.push(newObj);
        //                     }
        //                 })
        //             }
        //             _this.nextLoading = true;
        //             _this.$PostJson(_this.khConfig.api.addpcformdata+"/"+_this.formId, param).then(res => {
        //                 _this.nextLoading = false;
        //                 if (res.errCode === 0) {
        //                     this.$message({
        //                         message: '添加成功',
        //                         type: 'success'
        //                     });
        //                     this.editFormVisible = false;
        //                     _this.listData();
        //                 }
        //             })
        //         }).catch((e) => {
        //             console.log(e)
        //         });
        //     }).catch(() => {
        //     })

        // },
        // checkMapData(data){
        //     let arrayKeys = Object.keys(data);
        //     if(arrayKeys instanceof Array && arrayKeys.length >0){
        //         for(var i = 0;i<arrayKeys.length;i++){
        //             let key = arrayKeys[i];
        //             if(data[key] == null){
        //                 delete data[key];
        //             }
        //         }
        //     }
        // },
        // convertParam(object,list){
        //     for(let key of Object.keys(object)){
        //         if(list instanceof Array && list.length >0){
        //             let col = this.findColByKey(key,list);
        //             //选择控件传 0或1 不是true，false
        //             if(col && col.type === 'switch'){
        //                 if (null !== object[key] && object[key] !== '' && object[key] !== undefined && typeof object[key] === 'boolean' ) {
        //                     if (object[key]) {
        //                         object[key] = "0";
        //                     } else {
        //                         object[key] = "1";
        //                     }
        //                 }else if(!this.KHUtils.isNull(object[key])){

        //                 } else {
        //                     object[key] = '0';
        //                 }
        //             }
        //         }
        //         let value = object[key];

        //         if(value instanceof Array){
        //             object[key] = value.join(",");
        //         }else if(value instanceof Object){
        //             for (let valueKey of Object.keys(value)){
        //                 object[valueKey] = value[valueKey];
        //             }
        //         }
        //     }
        // },
        findColByKey(key,list){
            if(list instanceof Array && list.length >0){
                for(var i = 0;i<list.length;i++){
                    let col = list[i];
                    if(col.model == key){
                        return col;
                    }
                }
            }
            return null;
        },
        // 导出Excel
        handleExport() {
            let _this = this;
            _this.KHForm.handleExportV2(_this, _this.queryParams);
        },
        // 获取导入模板
        getExcelTemplate() {
            let _this = this;
            let param = _this.formId + "&" + _this.item.id;
            this.$OpenUrl(this.khConfig.host.rest + this.khConfig.api.exportFormTemplate + "/" + param);
        },
        // 文件上传前处理
        beforeUpload() {
            this.importLoading = true;
        },
        // 导出文件上传
        uploadCall(response) {
            let _this = this;
            _this.importLoading = false;
            if (response.errCode === 0) {
                if (response.importExportCode) {
                    if (_this.KHUtils.isNull(response.importExportCode)) {
                        this.$notify.error({
                            title: '错误',
                            message: 'importExportCode为空,上传失败'
                        });
                    }
                    _this.importExcelFileId = response.importExportCode;
                    _this.KHForm.timeoutImportExcel(_this);
                }
            } else {
                this.$notify.error({
                    title: '错误',
                    message: '导入失败'
                });
            }
        },
        // 导入文件出错处理
        uploadError(error, file, fileList) {
            this.importLoading = false;
            let message = "导入失败";
            let errorObj = JSON.parse(error.message);
            if(errorObj && !this.KHUtils.isNull(errorObj.errMsg)){
                message = errorObj.errMsg;
            }
            this.$notify.error({
                title: '错误',
                message: message
            });
        },
        // 自定义跳转
        handleCustomJump(row, config) {
            let _this = this;
            _this.KHForm.handleCustomJump(row, config, _this);
            if(config.jumpInfo.jumpType === "0" && config.jumpInfo.type === "1"){
                var cn="jumpPage"     
            }else{
                var cn="jumpDialog" 
            }
            let ts = () => import(`./components/${cn}`);
            this.$options.components[cn]=ts;
            this.jumpComponent = cn;
        },
        // 自定义跳转异步组件加载
        customJumpAsyncComponent(){
               
        },
        //导出模板
        exportModel(row,item){
            let _this = this;
            let param ={
                formId:_this.formId,
                dataId:row.id,
                fileId:item.fileId,
                originalfile:item.originalfile,
            }
            _this.$Get(_this.khConfig.api.exportWordModel ,param).then(res => {
                if (res.errCode === 0) {
                    _this.downLoadFile(res.fileId);
                }
            })
        },
        // 下载文件
        downLoadFile(fileId) {
            if (this.KHUtils.isNull(fileId)) {
                this.$message.warning("下载失败");
                return false;
            }
            this.$OpenUrl(this.khConfig.host.rest + this.khConfig.api.fileDownload + "/" + fileId);
        }
    }
  }
</script>

<style lang="scss" scoped>

</style>
