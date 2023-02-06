<template>
    <section style="height: 100%;">
        <el-row class="content" style="height: 100%;overflow: auto">
            <el-form ref="sensorSettings" :model="sensorSettings" label-width="100px" style="padding-top: 5px">
                <el-form-item label="查询条件设置">
                    <div @click="condSetVisible = true">
                        <div :class="queryConditions.length>0?customDivClass : customDivClass1">
                            <div>
                                <div class="el-tag el-tag--info el-tag--mini el-tag--light" :key="index"
                                     v-for="(item,index) in queryConditions"
                                     v-dragging="{ list: queryConditions, item: item, group: 'qc' }"
                                     style="margin-right: 2px"><span
                                    class="el-select__tags-text">{{item}}</span><i class="el-tag__close el-icon-close"
                                                                                   @click.stop="delCondSet(item)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="查询结果设置">
                    <div @click="resultSetVisible = true">
                        <div :class="queryResults.length>0? customDivClass:customDivClass1">
                            <div>
                                <div class="el-tag el-tag--info el-tag--mini el-tag--light"
                                     v-for="(item,index) in queryResults" style="margin-right: 2px"
                                     v-dragging="{ list: queryResults, item: item, group: 'qr' }" :key="index"><span
                                    class="el-select__tags-text">{{item.name}}</span><i
                                    class="el-tag__close el-icon-close"
                                    @click.stop="delResultSet(item.id)"></i></div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="功能按钮设置">
                    <el-checkbox :indeterminate="isFuncIndeterminate" v-model="checkFuncAll"
                                 @change="handleFuncCheckAllChange" style="float:left">全选
                    </el-checkbox>
                    <el-checkbox-group v-model="checkedFunc" @change="handleFuncCheckedChange">
                        <el-checkbox v-for="fc in func" :label="fc" :key="fc">{{fc}}</el-checkbox>
                    </el-checkbox-group>
                </el-form-item>
                <el-form-item label="操作按钮设置">
                    <el-checkbox :indeterminate="isOptIndeterminate" v-model="checkOptAll"
                                 @change="handleOptCheckAllChange" style="float:left">全选
                    </el-checkbox>
                    <el-checkbox-group v-model="checkedOpt" @change="handleCheckedOptChange">
                        <el-checkbox v-for="op in opt" :label="op.label" :key="op.key">{{op.label}}</el-checkbox>
                        <el-button type="primary" icon="el-icon-plus" circle @click="editOptButton"
                        ></el-button>
                    </el-checkbox-group>

                </el-form-item>
                <el-form-item label="新增页面设置">
                    <el-radio v-model="sensorSettings.addShowType" label="pop">弹窗</el-radio>
                    <el-radio v-model="sensorSettings.addShowType" label="normal">普通页面</el-radio>
                    <el-radio v-model="sensorSettings.addShowType" label="full">全屏页面</el-radio>
                </el-form-item>
                <el-form-item label="子表单设置">
                    <el-radio v-model="sensorSettings.tableShowType" label="transverse">横向</el-radio>
                    <el-radio v-model="sensorSettings.tableShowType" label="portrait">纵向</el-radio>
                </el-form-item>
                <el-form-item label="表单主列设置">
                    <el-select v-model="commonDataSelectColumn" placeholder="请选择" clearable filterable value="">
                        <el-option
                            v-for="item in resultSetOptions"
                            v-if="item.id !== '$seq'&& item.id !=='$opt'"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                        </el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="报表导入设置">
                    <div @click="importSettingsVisible = true">
                        <div :class="importSettings.length>0? customDivClass:customDivClass1">
                            <div>
                                <div class="el-tag el-tag--info el-tag--mini el-tag--light"
                                     v-for="(item,index) in importSettings"
                                     v-dragging="{ list: importSettings, item: item, group: 'is' }" :key="index"
                                     style="margin-right: 2px">
                                    <span class="el-select__tags-text">{{item.excelName}}</span>
                                    <i class="el-tag__close el-icon-close" @click.stop="delImportSettings(item.id)"></i>
                                </div>
                            </div>
                        </div>
                    </div>
                </el-form-item>
                <el-form-item label="报表导出设置">
                    <div @click="exportSettingsVisible = true">
                        <div :class="exportSettings.length>0? customDivClass:customDivClass1">
                            <span>
                                <span class="el-tag el-tag--info el-tag--mini el-tag--light"
                                      v-for="(item,index) in exportSettings"
                                      v-dragging="{ list: exportSettings, item: item, group: 'es' }" :key="index"
                                      style="margin-right: 2px">
                                    <span class="el-select__tags-text">{{item.excelName}}</span>
                                    <i class="el-tag__close el-icon-close" @click.stop="delExportSettings(item.id)"></i>
                                </span>
                            </span>
                        </div>
                    </div>
                </el-form-item>
            </el-form>
            <el-divider>
                预览
            </el-divider>
            <form-build-cond
                v-if="hackReset"
                :data.sync="condFormConfig"
                :value.sync="dataModels"
                ref="buildForm">
                <template v-slot:blank="scope">
                    宽度：
                    <el-input v-model="scope.model.blank.width" style="width: 100px"></el-input>
                    高度：
                    <el-input v-model="scope.model.blank.height" style="width: 100px"></el-input>
                </template>
            </form-build-cond>
            <el-row>
                <template v-for="item in checkedFunc">
                    <el-button>{{item}}</el-button>
                </template>
            </el-row>
            <el-row v-if="tableHackRest">
                <el-table
                    tooltip-effect="dark"
                    :data="tableData"
                    style="width: 96%"
                >
                    <el-table-column type="selection" width="55px"
                                     v-if="isShowChecked && queryResults.length > 0"></el-table-column>
                    <el-table-column label="序号" width="60px" type="index" v-if="isShowSeq && queryResults.length > 0">
                    </el-table-column>
                    <template v-for='(col) in dynCols'>
                        <el-table-column
                            :prop="col.id"
                            :label="col.name"
                            :key="col.id"
                        >
                        </el-table-column>
                    </template>
                    <el-table-column
                        fixed="right"
                        label="操作" v-if="isShowOpt && queryResults.length > 0">
                        <template v-for="item in checkedOpt">
                            <el-button type="text" size="small">{{item}}</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </el-row>
            <el-dialog title="查询条件设置" :visible.sync="condSetVisible" @close="saveCondSet" :modal="false">
              <div style="margin: 15px 0;color: #409EFF;">排列方式</div>
              <el-row>
                <el-col :span="6">
                  行：
                  <el-input-number v-model="condRowSet" :min="1" :max="10" label="行"
                                   disabled></el-input-number>
                </el-col>
                <el-col :span="6">
                  列：
                  <el-input-number v-model="condColumnSet" :min="1" :max="10" label="列"></el-input-number>
                </el-col>
              </el-row>
                <el-tabs v-model="activeName" @tab-click="handleClick" style="padding-bottom: 10px">
                    <el-tab-pane :label="eqCn" :name="eq$">

                        <el-checkbox-group  v-model="checkedEq" >
                          <el-checkbox class="myCheckBox" v-for="cd in cond" :label="cd" :key="cd" >  <div :title="cd">{{cd}}</div>
                          </el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>
                    <el-tab-pane :label="likeCn" :name="like$">
                        <el-checkbox-group  v-model="checkedLike">
                          <el-checkbox class="myCheckBox" v-for="cd in cond" :label="cd" :key="cd"><div :title="cd">{{cd}}</div></el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>
                    <el-tab-pane :label="inCn" :name="in$">
                        <el-checkbox-group v-model="checkedIn">
                          <el-checkbox class="myCheckBox" v-for="cd in cond" :label="cd" :key="cd"><div :title="cd">{{cd}}</div></el-checkbox>
                        </el-checkbox-group>
                    </el-tab-pane>
                   <!-- <el-tab-pane label="排列方式" name="$layout">
                        <div style="margin: 15px 0;"></div>
                        <el-row>
                            <el-col :span="6">
                                行：
                                <el-input-number v-model="condRowSet" :min="1" :max="10" label="行"
                                                 disabled></el-input-number>
                            </el-col>
                            <el-col :span="6">
                                列：
                                <el-input-number v-model="condColumnSet" :min="1" :max="10" label="列"></el-input-number>
                            </el-col>
                        </el-row>
                    </el-tab-pane>-->
                </el-tabs>

              <div style=" margin-bottom:10px;color: #409EFF; ">排序</div>
              <form-result-sort-transfer :sourcedata="resultSortOptions" sourcetitle="请选择" :targetdata="resultSort"
                                      :custom="false" :isResult="true"  ref="resultSort"
                                      targettitle="已选择"
                                      ></form-result-sort-transfer>


            </el-dialog>
            <el-dialog title="选择结果列" :visible.sync="resultSetVisible" :modal="false">
                <div class="block">
                    <form-result-transfer :sourcedata="resultSetOptions" sourcetitle="请选择" :targetdata="queryResults"
                                          :custom="false" :isResult="true" :jumpInfoList="jumpInfoList"
                                          targettitle="已选择"
                                          @submitDataToParent="saveResultSet"
                                          :form-list="formList"></form-result-transfer>

                </div>
            </el-dialog>
            <el-dialog title="报表导入设置" :visible.sync="importSettingsVisible" :modal="false">
                <div class="block">
                    <custom-transfer :sourcedata="importSettingsOptions" sourcetitle="请选择"
                                     :targetdata="importSettings" targettitle="已选择表单列名"
                                     @submitDataToParent="saveImportSettings" :custom="true"
                                     :start-obj="importStartObj"></custom-transfer>
                </div>
            </el-dialog>
            <el-dialog title="报表导出设置" :visible.sync="exportSettingsVisible" :modal="false">
                <div class="block">
                    <custom-transfer :sourcedata="exportSettingsOptions" sourcetitle="请选择"
                                     :targetdata="exportSettings" targettitle="已选择表单列名"
                                     :isExport="true"
                                     :fileList="exportFileList"
                                     @submitDataToParent="saveExportSettings" :custom="true"
                                     :start-obj="exportStartObj"></custom-transfer>
                </div>
            </el-dialog>
            <el-dialog title="链接设置" :visible.sync="operationSettingsVisible" :modal="false">
                <div class="block">
                    <operation-transfer :sourcedata="optButtonSettingOptions" sourcetitle="请选择"
                                        :targetdata="optButtonSetting" targettitle="已选择表单列名"
                                        @submitDataToParent="saveOptButtonSetting" :isOptBtn="true"
                                        :start-obj="optButtonStartObj" :form-list="formList"></operation-transfer>
                    <el-row>
                        <el-col :span="24" style="font-size: 14px;font-family:”SimSun”,serif">
                            <p style="margin: 5px 0;">配置说明</p>
                            <p style="margin: 5px 0;">
                                1、选择链接方式为组件的说明：填写的组件必须存在于项目当中，并将其实际对应的相对路径填写完毕。传递的参数名称必须与该组件中props定义的相同。比如预添加src/components/tree目录下的OrgUserTree组件，则相对路径填写为tree/OrgTree,参数的名称应填写对应组件中props定义的defaultCheckedKeys。</p>
                            <p style="margin: 5px 0;">2、现平台支持的组件：关联的信息已列表形式显示 component: [ListFormCustom] - props:
                                ['formId', 'listBusinessId']; 表单形式显示 component: [ViewFormCustom] - props: ['formId',
                                'businessId']。其中formId为必填项，是从配置中的关联表单属性选择,而其他参数通过穿梭框配置即可。</p>
                            <p style="margin: 5px 0;">3、如果选择以弹窗方式跳转,并且填写的是url路径,则以iframe的形式嵌入在弹窗中显示。</p>
                        </el-col>
                    </el-row>
                </div>
            </el-dialog>
        </el-row>
    </section>
</template>

<script>
    import FormBuildCond from "@/components/form-build/cond/FormBuildCond";
    import CustomTransfer from '@/components/CustomTransfer';
    import OperationTransfer from '@/components/OperationTransfer';
    import FormResultTransfer from '@/components/FormResultTransfer';
    import FormResultSortTransfer from '@/components/FormResultSortTransfer'


    const ADD_$ = "add";
    const ADD_$_CN = "新增";
    const DEL_$_FUN = "remove";
    const DEL_$_OPT = "delete";
    const DEL_$_CN = "删除";
    const IMPORT_$ = "import";
    const IMPORT_$_CN = "导入";
    const EXPORT_$ = "export";
    const EXPORT_$_CN = "导出";
    const EDIT_$ = "edit";
    const EDIT_$_CN = "编辑";
    const funcOptions = [ADD_$_CN, DEL_$_CN, IMPORT_$_CN, EXPORT_$_CN];
    const optOptions = [EDIT_$_CN, DEL_$_CN];
    const EQ_$ = "$eq";
    const EQ_$_CN = "精确查询";
    const LIKE_$ = "$like";
    const LIKE_$_CN = "模糊查询";
    const IN_$ = "$in";
    const IN_$_CN = "范围查询";
    const OPT_$ = "$opt";
    const OPT_$_CN = "操作";
    const SEQ_$ = "$seq";
    const SEQ_$_CN = "序号";
    const SEQ_$_OBJ = {id: SEQ_$, name: SEQ_$_CN, isSelected: false};
    const OPT_$_OBJ = {id: OPT_$, name: OPT_$_CN, isSelected: false};
    const SORT_$_ID = {id:"id",name:"id",isSelected:false,paramName:"id",sort:0};
    const SORT_$_CREATE_TIME = {id:"create_time",name:"创建时间",isSelected:false,paramName:"create_time",sort:0};
    const SORT_$_UPDATE_TIME = {id:"last_update_time",name:"更新时间",isSelected:false,paramName:"last_update_time",sort:0};
    export default {
        name: "AdvancedSetting",
        // formConfig: 表单配置
        // formId: 表单ID
        // formName: 表单名称
        // notifySave: 父表单点击下一步,触发通知当前页面进行保存操作
        props: ["formConfig", "formId", "notifySave", 'formName'],
        components: {
          CustomTransfer,
            FormBuildCond,
            OperationTransfer,
            FormResultTransfer,
          FormResultSortTransfer
        },
        created() {
            let _this = this;
            // 初始化查询条件、结果数据
            if (_this.KHUtils.isNull(_this.formConfig)) {
                return false;
            }
            if (_this.KHUtils.isNull(_this.formConfig.list)) {
                return false;
            }
            _this.listFormConf();
            _this.colsArray = [];
            _this.formConfig.list.forEach(val => {
                if (val.type === 'grid') {
                    loop(val, _this);
                } else {
                    if (val.type === 'data_select' || val.type === 'org_select'
                        || val.type === 'user_select'
                        || val.type === 'company_select'
                        || val.type === 'role_select'
                        || val.type === 'dic_select'
                        || val.type === 'current_user') {
                        _this.KHForm.processDataSourceControl(val, _this.colsArray, _this);
                    } else if (val.type === 'gis_select') {
                        _this.KHForm.processGisControl(val, _this.colsArray, _this);
                    } else if (val.type === 'region_select') {
                        _this.KHForm.processRegionControl(val, _this.colsArray, _this);
                    } else {
                        let temp = _this.KHUtils.clone(val);
                        if (temp.type === 'radio' || temp.type === 'select') {
                            // 查询条件设置,取消关联控件的设置
                            if (temp.options.options) {
                                if (temp.options.options instanceof Array) {
                                    temp.options.options.forEach(obj => {
                                        if (obj.relatedList) {
                                            obj.relatedList = [];
                                        }
                                    })
                                }
                            }
                        }
                        _this.colsArray.push(temp);
                    }
                }
            });

            function loop(obj, _this) {
                if (obj.columns) {
                    obj.columns.forEach(cs => {
                        cs.list.forEach(ls => {
                            if (ls.type === 'data_select' || ls.type === 'org_select'
                                || ls.type === 'user_select'
                                || ls.type === 'company_select'
                                || ls.type === 'role_select'
                                || ls.type === 'dic_select'
                                || ls.type === 'current_user') {
                                _this.KHForm.processDataSourceControl(ls, _this.colsArray, _this);
                            } else if (ls.type === 'gis_select') {
                                _this.KHForm.processGisControl(ls, _this.colsArray, _this);
                            } else if (ls.type === 'region_select') {
                                _this.KHForm.processRegionControl(ls, _this.colsArray, _this);
                            } else {
                                let temp = _this.KHUtils.clone(ls);
                                if (temp.type === 'radio' || temp.type === 'select') {
                                    // 查询条件设置,取消关联控件的设置
                                    if (temp.options.options) {
                                        if (temp.options.options instanceof Array) {
                                            temp.options.options.forEach(obj => {
                                                if (obj.relatedList) {
                                                    obj.relatedList = [];
                                                }
                                            })
                                        }
                                    }
                                }
                                _this.colsArray.push(temp);
                            }
                            if (ls.columns) {
                                loop(ls, _this);
                            }
                        })
                    })
                }
            }

            // 查询结果设置处理
            _this.exportSettings = [];  // 报表导出设置,源数据
            _this.exportSettingsOptions = [];  // 报表导出设置,源数据
            _this.importSettings = [];  // 报表导入设置,源数据
            _this.importSettingsOptions = [];  // 报表导入设置,源数据
            _this.optButtonSettingOptions = [];//操作按钮设置，源数据
            _this.optButtonSetting = [];
            _this.jumpInfoList = [];//查询结果跳转参数集合
            _this.cond = [];
            _this.condCopy = [];
            _this.resultSetOptions = [];
            _this.tableData = [];
            _this.queryResults = [];
            _this.queryResults.push(SEQ_$_OBJ);
            _this.resultSetOptions.push(SEQ_$_OBJ);
            _this.resultSortOptions=[];
            _this.resultSortOptions.push(SORT_$_ID);
            _this.resultSortOptions.push(SORT_$_CREATE_TIME);
            _this.resultSortOptions.push(SORT_$_UPDATE_TIME);
            _this.colsArray.forEach(cr => {
                if (!_this.KHUtils.isNull(cr.name)) {
                    // 子表单,标签不再父表单结果列,导入导出中显示
                    if (cr.type !== 'table' && cr.type !== 'flow_table' && cr.type !== 'text' && cr.type !== 'grid') {
                        let newObj = {};
                        newObj.id = cr.model;
                        newObj.name = cr.name;
                        newObj.isSelected = false;
                        newObj.paramName = cr.model;
                      let sortObj = {};
                      sortObj.id = cr.model;
                      sortObj.name = cr.name;
                      sortObj.isSelected = false;
                      sortObj.paramName = cr.model;
                      sortObj.sort = 0;
                        let excelObj = {};
                        excelObj.id = cr.model;
                        excelObj.name = cr.name;
                        excelObj.excelName = cr.name;
                        excelObj.isSelected = false;
                        _this.resultSetOptions.push(newObj);
                        _this.resultSortOptions.push(sortObj);
                        _this.importSettingsOptions.push(excelObj);
                        _this.exportSettingsOptions.push(excelObj);
                        _this.queryResults.push({id: newObj.id, name: newObj.name});
                        _this.importSettings.push({id: newObj.id, name: newObj.name, excelName: excelObj.excelName});
                        _this.exportSettings.push({id: newObj.id, name: newObj.name, excelName: excelObj.excelName});
                        _this.optButtonSettingOptions.push(({id: newObj.id, name: newObj.name, paramName: newObj.id}));
                        _this.optButtonSetting.push(({id: newObj.id, name: newObj.name, paramName: newObj.id}));
                        // 查询条件,除上面的控件之外,对于图片、附件
                        if (cr.type !== 'image_upload' && cr.type !== 'file_upload') {
                            _this.cond.push(cr.name);
                            _this.condCopy.push(cr.name);
                        }
                    }
                }
            });
            _this.queryResults.push(OPT_$_OBJ);
            _this.resultSetOptions.push(OPT_$_OBJ);
            _this.tableData.push({});
            _this.previewResultSet();
            if (_this.KHUtils.isNull(_this.formConfig.sensorSettings)) {
                return false;
            }
            let sensorSettings = _this.formConfig.sensorSettings;
            // 查询条件处理
            _this.checkedEq = [];
            _this.checkedLike = [];
            _this.checkedIn = [];
            _this.queryConditions = [];
            // 排列方式设置初始化
            if (_this.formConfig.sensorSettings) {
                if (_this.formConfig.sensorSettings.queryLayout) {
                    if (!_this.KHUtils.isNull(_this.formConfig.sensorSettings.queryLayout)) {
                        _this.condColumnSet = _this.formConfig.sensorSettings.queryLayout.cols;
                    }
                }
            }
            if (!_this.KHUtils.isNull(sensorSettings.queryConditions)) {
                sensorSettings.queryConditions.forEach(qc => {
                    if (!this.KHUtils.isNull(qc.opt)) {
                        let name = getNameByModel(_this.colsArray, qc.key);
                        let tmpStr = "";
                        switch (qc.opt) {
                            case EQ_$:
                                tmpStr = EQ_$_CN;
                                _this.checkedEq.push(name);
                                break;
                            case LIKE_$:
                                tmpStr = LIKE_$_CN;
                                _this.checkedLike.push(name);
                                break;
                            case IN_$:
                                tmpStr = IN_$_CN;
                                _this.checkedIn.push(name);
                                break;
                            default:
                        }
                        _this.queryConditions.push(name + "（" + tmpStr + "）");
                    }
                });
                _this.previewCondSet();
            }
            if (!_this.KHUtils.isNull(sensorSettings.queryResults)) {
                // 查询结果处理
                _this.queryResults = [];
                sensorSettings.queryResults.forEach(qr => {
                    let newObj = {};
                    let key = qr.key;
                    newObj.id = key;
                    newObj.isSelected = false;
                    if (_this.KHUtils.isNull(qr.isJump)) {
                        newObj.isJump = false;
                    } else {
                        newObj.isJump = qr.isJump;
                    }

                    if (SEQ_$ === key) {
                        newObj.name = SEQ_$_CN;
                    } else if (OPT_$ === key) {
                        newObj.name = OPT_$_CN;
                    } else {
                        newObj.name = getNameByModel(_this.colsArray, key);
                    }
                    _this.queryResults.push(newObj);
                });
            }

          if (!_this.KHUtils.isNull(sensorSettings.querySort)) {
            // 查询结果排序处理
            _this.resultSort = [];
            sensorSettings.querySort.forEach(qr => {
              let newObj = {};
              let key = qr.key;
              newObj.id = key;
              newObj.isSelected = false;
              newObj.sort = qr.sort;
              if (key == "id"){
                  newObj.name = "id";
              }else if(key == "create_time"){
                  newObj.name = "创建时间";
              }else if(key == "last_update_time"){
                  newObj.name = "更新时间"
              }else {
                newObj.name = getNameByModel(_this.colsArray, key);
              }
              _this.resultSort.push(newObj);
            });
          }
            if (!_this.KHUtils.isNull(sensorSettings.jumpInfoList)) {
                _this.jumpInfoList = [];
                sensorSettings.jumpInfoList.forEach(item => {
                    _this.jumpInfoList.push(item);
                })
            }
            _this.previewResultSet();
            // 功能按钮处理
            _this.checkedFunc = [];
            if (!this.KHUtils.isNull(sensorSettings.functionButtons)) {
                sensorSettings.functionButtons.forEach(fb => {
                    _this.checkedFunc.push(fb.label);
                })
            }
            // 操作按钮处理
            _this.checkedOpt = [];
            if (!this.KHUtils.isNull(sensorSettings.optButtons)) {
                _this.optButtonSetting = [];
                _this.optButtonStartObj = {type: "0", urlType: "0"};
                _this.opt = [{key: "edit", label: "编辑"}, {key: "delete", label: "删除"}];
                sensorSettings.optButtons.forEach(fb => {
                    _this.checkedOpt.push(fb.label);
                    if (fb.key !== "edit" && fb.key !== "delete") {
                        _this.opt.push(fb);
                    }
                })
            }
            // 全选/不全选处理
            _this.handleFuncCheckedChange(_this.checkedFunc);
            _this.handleCheckedOptChange(_this.checkedOpt);
            // 新增页面设置的处理
            if (sensorSettings.addShowType) {
                _this.sensorSettings.addShowType = sensorSettings.addShowType;
            }
            //子表单设置的处理
            if (sensorSettings.tableShowType) {
                _this.sensorSettings.tableShowType = sensorSettings.tableShowType;
            }
            if (sensorSettings.mainColumn) {
                _this.commonDataSelectColumn = sensorSettings.mainColumn;
            }
            if (sensorSettings.reportSettings) {
                // 导入设置初始化
                if (sensorSettings.reportSettings.importSettings) {
                    if (sensorSettings.reportSettings.importSettings.list instanceof Array) {
                        _this.importEdit = true;
                        _this.importSettings = [];
                        sensorSettings.reportSettings.importSettings.list.forEach(qr => {
                            let newObj = {};
                            newObj.id = qr.model;
                            newObj.isSelected = false;
                            newObj.name = qr.name;
                            newObj.excelName = qr.excelName;
                            _this.importSettings.push(newObj);
                        });
                    }
                    if (sensorSettings.reportSettings.importSettings.startRow) {
                        _this.importStartObj.startRow = sensorSettings.reportSettings.importSettings.startRow;
                    }
                    if (sensorSettings.reportSettings.importSettings.startColumn) {
                        _this.importStartObj.startColumn = sensorSettings.reportSettings.importSettings.startColumn;
                    }
                }
                // 导出设置初始化
                if (sensorSettings.reportSettings.exportSettings) {
                    if (sensorSettings.reportSettings.exportSettings.list instanceof Array) {
                        _this.exportEdit = true;
                        _this.exportSettings = [];
                        sensorSettings.reportSettings.exportSettings.list.forEach(qr => {
                            let newObj = {};
                            newObj.id = qr.model;
                            newObj.isSelected = false;
                            newObj.name = qr.name;
                            newObj.excelName = qr.excelName;
                            _this.exportSettings.push(newObj);
                        });
                    }
                    let exportObject = {}
                    if (sensorSettings.reportSettings.exportSettings.startRow) {
                        _this.exportStartObj.startRow = sensorSettings.reportSettings.exportSettings.startRow;
                    }
                    if (sensorSettings.reportSettings.exportSettings.startColumn) {
                        _this.exportStartObj.startColumn = sensorSettings.reportSettings.exportSettings.startColumn;
                    }
                    if (sensorSettings.reportSettings.exportSettings.exportModelInfo.fileId) {
                        _this.exportStartObj.exportModelInfo.fileId = sensorSettings.reportSettings.exportSettings.exportModelInfo.fileId;
                        exportObject.fileId = sensorSettings.reportSettings.exportSettings.exportModelInfo.fileId;
                    }
                    if (sensorSettings.reportSettings.exportSettings.exportModelInfo.originalfile) {
                        _this.exportStartObj.exportModelInfo.originalfile = sensorSettings.reportSettings.exportSettings.exportModelInfo.originalfile;
                        exportObject.name = sensorSettings.reportSettings.exportSettings.exportModelInfo.originalfile;
                    }
                    if (sensorSettings.reportSettings.exportSettings.exportRules) {
                        _this.exportStartObj.exportRules = sensorSettings.reportSettings.exportSettings.exportRules;
                    }
                    if (!this.KHUtils.isNull(exportObject.fileId) && !this.KHUtils.isNull(exportObject.name)) {
                        _this.exportFileList.push(exportObject);
                    }
                }
            }

            // 通过name获取model
            function getNameByModel(array, compare) {
                const index = array.findIndex(obj => obj.model === compare);
                if (index < 0) {
                    return null;
                }
                return array[index].name;
            }
        },
        watch: {
            notifySave: {
                deep: true,
                handler() {
                    this.save();
                }
            },
        },
        mounted() {
            this.$dragging.$on('dragged', (value) => {
                // 拖拽排序后重新预览
                this.previewCondSet();
                this.previewResultSet();
            })
        },
        data() {
            return {
                exportSettingsOptions: [],
                exportSettingsVisible: false,
                exportSettings: "",   // 导入设置,显示
                exportStartObj: {
                    startRow: 1,
                    startColumn: 1,
                    exportRules: "name",
                    exportModelInfo: {fileId: "", originalfile: ""}
                },
                exportFileList: [],
                importStartObj: {startRow: 1, startColumn: 1},
                importSettingsOptions: [],
                importSettingsVisible: false,
                importSettings: "",   // 导入设置,显示
                commonDataSelectColumn: "",   // 通用数据主列设置
                customDivClass: "customDivClass",
                customDivClass1: "customDivClass1",
                hackReset: false,
                dynCols: [],
                tableData: [],
                tableHackRest: false,
                isShowSeq: false, // 表格是否显示序号
                isShowChecked: false, // 表格是否显示Checked框
                isShowOpt: false, // 表格预览是否显示操作
                dataModels: {},
                addOrEdit: true,
                colsArray: [],
                queryResults: [], // 仅用作查询结果设置显示使用
                sensorSettings: {
                    queryConditions: [],
                    querySort:[],
                    queryResults: [],
                    functionButtons: [],
                    optButtons: [],
                    queryLayout: {},
                    reportSettings: {
                        importSettings: {
                            list: [],
                            startRow: 1,
                            startColumn: 1
                        },
                        exportSettings: {
                            list: [],
                            startRow: 1,
                            startColumn: 1,
                            exportRules: "name",
                            exportModelInfo: {
                                fileId: "",
                                originalfile: "",
                            }
                        }
                    },
                    addShowType: "pop",
                    tableShowType: "transverse",
                    mainColumn: "" // 通用数据控件中Label的显示字段名称
                },
                checkFuncAll: false,
                checkedFunc: [ADD_$_CN, DEL_$_CN],
                func: funcOptions,
                isFuncIndeterminate: true,
                checkOptAll: false,
                checkedOpt: [EDIT_$_CN],
                //opt: optOptions,
                opt: [{key: "edit", label: "编辑"}, {key: "delete", label: "删除"}],
                isOptIndeterminate: true,
                queryConditions: [], // 仅用作查询条件设置显示使用
                condRowSet: 1, // 查询条件设置排列设置的行
                condColumnSet: 3,// 查询条件设置排列设置的列
                condFormConfig: {
                    list: [],
                    config: {
                        labelWidth: 100,
                        labelPosition: 'right',
                        size: 'small'
                    }
                },
                activeName: EQ_$,
                condOptions: [],
                condSetVisible: false,
                eqCn: EQ_$_CN,
                likeCn: LIKE_$_CN,
                inCn: IN_$_CN,
                eq$: EQ_$,
                like$: LIKE_$,
                in$: IN_$,
                checkedEq: [],            //精确查询
                checkedLike: [],          //模糊查询
                checkedIn: [],            //范围查询
                cond: [],
                condCopy: [],
                resultSetVisible: false,
                resultSetChecked: [],
                resultSetOptions: [],
                title: ['请选择', '已选择'],
                operationSettingsVisible: false,//链接调整设置
                optButtonSettingOptions: [],//操作按钮跳转参数设置集合
                optButtonSetting: [],
                optButtonStartObj: {type: "0", urlType: "0"},
                jumpInfoList: [],//查询结果跳转参数集合
                formList: [],
                resultSortOptions:[],
              resultSort:[]//已设置的结果排序集合
            }
        },
        methods: {
            // 高级设置保存
            save() {
                let _this = this;
                _this.processCondSetParam();
                _this.processResultSetParam();
                _this.processFuncOptCheckedParam(_this.checkedFunc, "func");
                _this.processFuncOptCheckedParam(_this.checkedOpt, "opt");
                _this.sensorSettings.queryLayout.rows = _this.condRowSet;
                _this.sensorSettings.queryLayout.cols = _this.condColumnSet;
                if (!_this.KHUtils.isNull(_this.commonDataSelectColumn)) {
                    _this.sensorSettings.mainColumn = _this.commonDataSelectColumn; // 表单主列设置处理
                }
                if (!_this.KHUtils.isNull(_this.importSettings)) {  // 报表导入设置处理
                    _this.sensorSettings.reportSettings.importSettings.list = [];
                    _this.importSettings.forEach(is => {
                        let newObj = {};
                        newObj.model = is.id;
                        newObj.name = is.name;
                        newObj.excelName = is.excelName;
                        _this.sensorSettings.reportSettings.importSettings.list.push(newObj);
                    })
                }
                if (!_this.KHUtils.isNull(_this.exportSettings)) {  // 报表导出设置处理
                    _this.sensorSettings.reportSettings.exportSettings.list = [];
                    _this.exportSettings.forEach(is => {
                        let newObj = {};
                        newObj.model = is.id;
                        newObj.name = is.name;
                        newObj.excelName = is.excelName;
                        _this.sensorSettings.reportSettings.exportSettings.list.push(newObj);
                    })
                }
                // console.log("sensorSettings :" + JSON.stringify(_this.sensorSettings));
                this.$confirm('确认保存高级设置吗？', '提示', {}).then(() => {
                    let postJsParam = {
                        "formId": _this.formId,
                        "sensorSettings": _this.sensorSettings
                    };
                    this.$PostJson(this.khConfig.api.saveSeniorConf, postJsParam).then(res => {
                        if (res.errCode === 0) {
                            this.$notify({
                                title: '成功',
                                message: '高级设置成功',
                                type: 'success'
                            });
                            this.$emit("notifyParentClose", true, false, false); // 通知父表单已完成高级设置保存,可以进行下一步操作
                            if (this.sensorSettings.addShowType === 'full') {
                                // 直达新增页面的路由新增
                                this.$Get(this.khConfig.api.addFullMenu, {
                                    menuUrl: "/custom/" + this.formId,
                                    menuName: this.formName
                                }).then(res => {
                                    if (res.errCode === 0) {
                                        // console.log("新增页面全屏设置成功!")
                                    }
                                })
                            }
                        } else {
                            this.$emit("notifyParentClose", true, false, true);  // 通知父表单已完成高级设置保存失败
                        }
                    })
                }).catch((e) => {
                    this.$emit("notifyParentClose", true, false, true);  // 通知父表单已完成高级设置保存失败
                    console.log(e);
                });

            },
            // 查询条件设置参数处理
            processCondSetParam() {
                let _this = this;
                let tempArray = [];

                _this.sensorSettings.querySort = [];
                if(_this.resultSort != null && _this.resultSort.length >0){
                    _this.resultSort.forEach(item =>{
                        let newObj = {};
                        newObj.key = item.id;
                        newObj.sort = item.sort;
                        _this.sensorSettings.querySort.push(newObj);
                    })
                }
                  _this.sensorSettings.queryConditions = [];
                if (_this.checkedEq != null && _this.checkedEq.length > 0) {
                    _this.checkedEq.forEach(key => {
                        let newObj = {};
                        // newObj.key = getModelByName(_this.colsArray, obj, "name");
                        newObj.name = key;
                        newObj.opt = EQ_$;
                        tempArray.push(newObj);
                    })
                }
                if (_this.checkedLike != null && _this.checkedLike.length > 0) {
                    _this.checkedLike.forEach(key => {
                        let newObj = {};
                        newObj.name = key;
                        newObj.opt = LIKE_$;
                        tempArray.push(newObj);
                    })
                }
                if (_this.checkedIn != null && _this.checkedIn.length > 0) {
                    _this.checkedIn.forEach(key => {
                        let newObj = {};
                        newObj.name = key;
                        newObj.opt = IN_$;
                        tempArray.push(newObj);
                    })
                }

                // 按正确的排序保存
                if (_this.queryConditions.length > 0 && tempArray.length > 0) {
                    _this.queryConditions.forEach(qc => {
                        let compareName = "";
                        let tempEq = "（" + EQ_$_CN + "）";
                        let tempLike = "（" + LIKE_$_CN + "）";
                        let tempIn = "（" + IN_$_CN + "）";
                        if (qc.endsWith(tempEq)) {
                            compareName = qc.split(tempEq)[0];
                        } else if (qc.endsWith(tempLike)) {
                            compareName = qc.split(tempLike)[0];
                        } else {
                            compareName = qc.split(tempIn)[0];
                        }
                        tempArray.forEach(obj => {
                            if (obj.name && compareName === obj.name) {
                                let newObj = {};
                                newObj.key = getModelByName(_this.colsArray, obj.name, "name");
                                newObj.opt = obj.opt;
                                _this.sensorSettings.queryConditions.push(newObj);
                            }
                        });
                    })
                }

                // 通过名称转化 model 值
                function getModelByName(array, compareName, key) {
                    const index = array.findIndex(obj => obj[key] === compareName);
                    if (index < 0) {
                        return compareName;
                    }
                    return array[index].model;
                }

            },
            // 查询结果设置参数处理
            processResultSetParam() {
                let _this = this;
                _this.sensorSettings.queryResults = [];
                _this.sensorSettings.jumpInfoList = _this.jumpInfoList;
                if (_this.KHUtils.isNull(_this.queryResults)) {
                    return false;
                }
                _this.queryResults.forEach(qr => {
                    let newObj = {};
                    newObj.key = qr.id;
                    if (_this.KHUtils.isNull(qr.isJump)) {
                        newObj.isJump = false;
                    } else {
                        newObj.isJump = qr.isJump;
                    }
                    _this.sensorSettings.queryResults.push(newObj);
                })
            },
            // 功能、操作按钮参数处理
            processFuncOptCheckedParam(checkedGroup, flag) {
                let _this = this;
                if (!(checkedGroup instanceof Array) || _this.KHUtils.isNull(checkedGroup)) {
                    return false;
                }
                if ("func" === flag) {
                    _this.sensorSettings.functionButtons = [];
                } else if ("opt" === flag) {
                    _this.sensorSettings.optButtons = [];
                }
                checkedGroup.forEach(cf => {
                    if (!_this.KHUtils.isNull(cf)) {
                        let newObj = {};
                        newObj.label = cf;
                        switch (cf) {
                            case ADD_$_CN:
                                newObj.key = ADD_$;
                                break;
                            case EDIT_$_CN:
                                newObj.key = EDIT_$;
                                break;
                            case DEL_$_CN:
                                if ("func" === flag) {
                                    newObj.key = DEL_$_FUN;
                                } else if ("opt" === flag) {
                                    newObj.key = DEL_$_OPT;
                                }
                                break;
                            case IMPORT_$_CN:
                                newObj.key = IMPORT_$;
                                break;
                            case EXPORT_$_CN:
                                newObj.key = EXPORT_$;
                                break;
                            default:
                                if ("opt" === flag) {
                                    newObj = this.opt.filter(item => item.label === cf)[0];

                                }
                                break;
                        }
                        if (newObj != null) {
                            if ("func" === flag) {
                                _this.sensorSettings.functionButtons.push(newObj);
                            } else if ("opt" === flag) {
                                _this.sensorSettings.optButtons.push(newObj);
                            }
                        }

                    }
                })
            },
            // 查询条件,Tab标签页的点击事件
            handleClick(tab) {
                let _this = this;
                _this.activeName = EQ_$;
                if (EQ_$ === tab.name) {
                    _this.initCondSet(_this.checkedLike, _this.checkedIn);
                } else if (LIKE_$ === tab.name) {
                    // 查询条件对时间、下拉框、单选框等类型控件限制使用模糊查询处理
                    _this.initCondSet(_this.checkedEq, _this.checkedIn);
                } else if (IN_$ === tab.name) {
                    _this.initCondSet(_this.checkedEq, _this.checkedLike);
                }
            },
            // 初始化查询条件设置
            initCondSet(checked1, checked2) {
                let _this = this;
                _this.cond = _this.condCopy;
                let checkedArray = [];
                if (checked1 != null && checked1.length > 0) {
                    checked1.forEach(obj => {
                        checkedArray.push(obj);
                    })
                }
                if (checked2 != null && checked2.length > 0) {
                    checked2.forEach(obj => {
                        checkedArray.push(obj);
                    })
                }
                let newArray = [];
                if (checkedArray.length > 0) {
                    _this.cond.forEach(obj => {
                        let flag = false;
                        checkedArray.forEach(eq => {
                            if (obj === eq) {
                                flag = true;
                            }
                        });
                        if (!flag) {
                            newArray.push(obj);
                        }
                    });
                    _this.cond = newArray;
                }
            },
            // 保存查询条件设置
            saveCondSet() {
                let _this = this;
                console.log("子组件数据："+JSON.stringify(_this.$refs.resultSort.targetList));
                _this.resultSort = [];
               let sortList = _this.$refs.resultSort.targetList;
                sortList.forEach(item =>{
                  let newObj = {};
                  newObj.id = item.id;
                  newObj.name = item.name;
                  newObj.sort = item.sort;
                  newObj.isSelect = false;
                  _this.resultSort.push(newObj);
                })

                _this.queryConditions = [];
                if (_this.checkedEq != null && _this.checkedEq.length > 0) {
                    _this.checkedEq.forEach(obj => {
                        _this.queryConditions.push(obj + "（" + EQ_$_CN + "）");
                    })
                }
                if (_this.checkedLike != null && _this.checkedLike.length > 0) {
                    _this.checkedLike.forEach(obj => {
                        _this.queryConditions.push(obj + "（" + LIKE_$_CN + "）");
                    })
                }
                if (_this.checkedIn != null && _this.checkedIn.length > 0) {
                    _this.checkedIn.forEach(obj => {
                        _this.queryConditions.push(obj + "（" + IN_$_CN + "）");
                    })
                }
                _this.condSetVisible = false;
                _this.previewCondSet();
            },
            // 删除查询条件设置
            delCondSet(key) {
                let _this = this;
                if (key.indexOf(EQ_$_CN) > -1) {
                    delArray(_this.checkedEq, key);
                }
                if (key.indexOf(LIKE_$_CN) > -1) {
                    delArray(_this.checkedLike, key);
                }
                if (key.indexOf(IN_$_CN) > -1) {
                    delArray(_this.checkedIn, key);
                }
                delArray(_this.queryConditions, key);

                function delArray(array, key) {
                    if (!(array instanceof Array)) {
                        return false;
                    }
                    let tmp = "";
                    array.forEach(ar => {
                        if (key.indexOf(ar) > -1) {
                            tmp = ar;
                        }
                    });
                    const index = array.findIndex(obj => obj === tmp);
                    array.splice(index, 1);
                }

                _this.previewCondSet();
            },
            // 查询条件设置预览
            previewCondSet() {
                let _this = this;
                // 预览查询条件设置
                _this.condFormConfig = {
                    list: [],
                    config: {
                        labelWidth: 100,
                        labelPosition: 'right',
                        size: 'small'
                    },
                };
                if (_this.KHUtils.isNull(_this.queryConditions) || _this.queryConditions.length === 0) {
                    return false;
                }
                if (_this.KHUtils.isNull(_this.condColumnSet)) {
                    _this.condColumnSet = 3;
                }
                let row = Math.ceil(_this.queryConditions.length / _this.condColumnSet); // 根据列,条件设置的总数计算出共需要多少行
                // console.log("previewCondSet :" +  _this.condColumnSet);
                _this.condRowSet = row;
                let array = [];  // 条件设置所对应表单设计的对象集合
                _this.queryConditions.forEach(qc => {
                    _this.colsArray.forEach(obj => {
                        let compareName = "";
                        let tempEq = "（" + EQ_$_CN + "）";
                        let tempLike = "（" + LIKE_$_CN + "）";
                        let tempIn = "（" + IN_$_CN + "）";
                        if (qc.endsWith(tempEq)) {
                            compareName = qc.split(tempEq)[0];
                        } else if (qc.endsWith(tempLike)) {
                            compareName = qc.split(tempLike)[0];
                        } else {
                            compareName = qc.split(tempIn)[0];
                        }
                        if (!_this.KHUtils.isNull(obj.name) && compareName === obj.name) {
                            if (qc.indexOf(IN_$_CN) > -1) {
                                obj.query_range = true;   // 范围查询
                            }
                            let temp = _this.KHUtils.clone(obj);
                            array.push(temp);
                        }
                    });
                });
                let index = 0;
                let span = 90 / _this.condColumnSet + '%';
                for (let i = 0; i < row; i++) {
                    let currentMis = (new Date()).valueOf();
                    let grid = {
                        type: "grid",
                        name: "栅格布局" + i,
                        icon: "icon-grid",
                        columns: [],
                        options: {
                            gutter: 0,
                            justify: "start",
                            align: "top"
                        },
                        model: "grid" + currentMis + "_98622" + i,
                        rules: [],
                        key: currentMis + "_98622" + i,
                        show: true
                    };
                    for (let j = 0; j < _this.condColumnSet; j++) {
                        let column = {
                            span: span,
                            list: []
                        };
                        if (index < array.length) {
                            array[index].rules = [];
                            if ((array[index].type === 'datetime' || array[index].type === 'date') && array[index].query_range) {
                                array[index].type = 'datetime_range';
                            } else if (array[index].query_range && (array[index].type !== 'datetime' && array[index].type !== 'date')) {
                                array[index].type = 'input_range';
                            }
                            if (array[index].options.width) {
                                array[index].options.width = '80%';
                            }
                            array[index].show = true;
                            /*            if (array[index].type.indexOf("range") !== -1) {
                                            column.span = 12;
                                        }*/
                            column.list.push(array[index]);
                            grid.columns.push(column);
                        }
                        index++;
                    }
                    _this.condFormConfig.list.push(grid);
                }
                let queryBtnObj = {
                    span: span,
                    "list": [
                        {
                            "icon": "icon-input",
                            "key": "9999999",
                            "model": "input_9999999",
                            "name": "",
                            "options": {
                                "dataType": "string",
                                "defaultValue": "",
                                "disabled": false,
                                "isControlled": false,
                                "pattern": "",
                                "placeholder": "",
                                "required": false,
                                "width": "80%"
                            },
                            "rules": [],
                            "type": "query",
                            "show": true
                        }
                    ]
                };
                let len = _this.condFormConfig.list.length;
                let lastGrid = _this.condFormConfig.list[len - 1];
                let currentMis = new Date().getTime();
                // 一行摆不下,另起一行
                if (lastGrid.columns.length === _this.condColumnSet) {
                    _this.condFormConfig.list.push({
                        "type": "grid",
                        "name": "栅格布局" + currentMis,
                        "icon": "icon-grid",
                        "columns": [
                            {
                                "span": span,
                                "list": [
                                    {
                                        "icon": "icon-input",
                                        "key": "9999999",
                                        "model": "input_9999999",  // 防止被下拉框等控制
                                        "name": "",
                                        "options": {
                                            "dataType": "string",
                                            "defaultValue": "",
                                            "disabled": false,
                                            "isControlled": false,
                                            "pattern": "",
                                            "placeholder": "",
                                            "required": false,
                                            "width": "80%"
                                        },
                                        "rules": [],
                                        "type": "query",
                                        "show": true
                                    }
                                ]
                            }
                        ],
                        "options": {
                            "gutter": 0,
                            "justify": "start",
                            "align": "top",
                        },
                        "model": "grid" + currentMis,
                        "rules": [],
                        "key": currentMis,
                        "show": true
                    });
                } else {
                    lastGrid.columns.push(queryBtnObj);
                }
                // console.log("condFormConfig :" + JSON.stringify(_this.condFormConfig));
                _this.hackReset = false;
                // 重新渲染子组件
                this.$nextTick(() => {
                    this.hackReset = true
                });
            },
            // 保存查询结果设置
            saveResultSet(targetList, obj) {
                let _this = this;
                _this.queryResults = [];
                if (_this.resultSetOptions.length > 0 && targetList != null && targetList.length > 0) {
                    targetList.forEach(obj => {
                        let flag = false;
                        _this.resultSetOptions.forEach(rs => {
                            if (obj.id === rs.id) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            let newObj = {};
                            newObj.id = obj.id;
                            newObj.name = obj.name;
                            newObj.isJump = obj.isJump;
                            _this.queryResults.push(newObj);
                        }
                    });
                }
                _this.resultSetVisible = false;
                _this.previewResultSet();
            },
            // 刪除查询结果设置
            delResultSet(key) {
                let _this = this;
                if (_this.KHUtils.isNull(key)) {
                    return false;
                }
                delArrayObj(key, 'id', _this.queryResults);
                _this.previewResultSet();

                function delArrayObj(compareKey, key, array) {
                    if (!(array instanceof Array)) {
                        return false;
                    }
                    const index = array.findIndex(obj => obj[key] === compareKey);
                    array.splice(index, 1);
                }
            },
            // 查询结果预览
            previewResultSet() {
                let _this = this;
                _this.dynCols = [];
                _this.isShowChecked = true;
                _this.isShowOpt = false;
                _this.isShowSeq = false;
                _this.queryResults.forEach(obj => {
                    if (obj.name === OPT_$_CN) {
                        _this.isShowOpt = true;
                    }
                    if (obj.name === SEQ_$_CN) {
                        _this.isShowSeq = true;
                    }
                    if (obj.name !== SEQ_$_CN && obj.name !== OPT_$_CN) {
                        _this.dynCols.push(obj);
                    }
                });

                _this.tableHackRest = false;
                // 当动态列未发生数量上的变化,只是顺序上变化就需要重新渲染子组件
                this.$nextTick(() => {
                    this.tableHackRest = true
                });
            },
            // 功能按钮设置,全选
            handleFuncCheckAllChange(val) {
                this.checkedFunc = val ? funcOptions : [];
                this.isFuncIndeterminate = false;
                this.isShowChecked = val;
            },
            // 功能按钮设置,选择
            handleFuncCheckedChange(value) {
                let checkedCount = value.length;
                this.checkFuncAll = checkedCount === this.func.length;
                this.isFuncIndeterminate = checkedCount > 0 && checkedCount < this.func.length;
                this.isShowChecked = false;
                value.forEach(v => {
                    if (DEL_$_CN === v || IMPORT_$_CN === v || EXPORT_$_CN === v) {
                        this.isShowChecked = true;
                    }
                });
            },
            // 操作按钮设置,全选
            handleOptCheckAllChange(val) {
                this.checkedOpt = val ? optOptions : [];
                this.isOptIndeterminate = false;
                this.isShowOpt = val;
                this.tableData = [{}];
            },
            // 操作按钮设置,选择
            handleCheckedOptChange(value) {
                let checkedCount = value.length;
                this.checkOptAll = checkedCount === this.opt.length;
                this.isOptIndeterminate = checkedCount > 0 && checkedCount < this.opt.length;
                this.isShowOpt = checkedCount > 0;
                this.tableData = [{}];
            },
            // 保存报表导出设置
            saveExportSettings(targetList, obj) {
                let _this = this;
                _this.exportSettings = [];
                if (_this.exportSettingsOptions.length > 0 && targetList != null && targetList.length > 0) {
                    targetList.forEach(obj => {
                        let flag = false;
                        _this.exportSettingsOptions.forEach(rs => {
                            if (obj.id === rs.id) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            let newObj = {};
                            newObj.id = obj.id;
                            newObj.excelName = obj.excelName;
                            newObj.name = obj.name;
                            _this.exportSettings.push(newObj);
                        }
                    });
                }
                if (obj instanceof Object) {
                    _this.sensorSettings.reportSettings.exportSettings.startRow = obj.startRow ? obj.startRow : 1;
                    _this.sensorSettings.reportSettings.exportSettings.startColumn = obj.startColumn ? obj.startColumn : 1;
                    _this.sensorSettings.reportSettings.exportSettings.exportRules = obj.exportRules ? obj.exportRules : "name";
                    _this.sensorSettings.reportSettings.exportSettings.exportModelInfo.fileId = obj.exportModelInfo.fileId ? obj.exportModelInfo.fileId : "";
                    _this.sensorSettings.reportSettings.exportSettings.exportModelInfo.originalfile = obj.exportModelInfo.originalfile ? obj.exportModelInfo.originalfile : "";
                }
                _this.exportSettingsVisible = false;
            },
            // 刪除报表导入设置
            delExportSettings(key) {
                let _this = this;
                if (_this.KHUtils.isNull(key)) {
                    return false;
                }
                delArrayObj(key, 'id', _this.exportSettings);

                function delArrayObj(compareKey, key, array) {
                    if (!(array instanceof Array)) {
                        return false;
                    }
                    const index = array.findIndex(obj => obj[key] === compareKey);
                    array.splice(index, 1);
                }
            },
            // 保存报表导入设置
            saveImportSettings(targetList, obj) {
                let _this = this;
                _this.importSettings = [];
                _this.importEdit = false;
                if (_this.importSettingsOptions.length > 0 && targetList != null && targetList.length > 0) {
                    targetList.forEach(obj => {
                        let flag = false;
                        _this.importSettingsOptions.forEach(rs => {
                            if (obj.id === rs.id) {
                                flag = true;
                            }
                        });
                        if (flag) {
                            let newObj = {};
                            newObj.id = obj.id;
                            newObj.excelName = obj.excelName;
                            newObj.name = obj.name;
                            _this.importSettings.push(newObj);
                        }
                    });
                }
                if (obj instanceof Object) {
                    _this.sensorSettings.reportSettings.importSettings.startRow = obj.startRow ? obj.startRow : 1;
                    _this.sensorSettings.reportSettings.importSettings.startColumn = obj.startColumn ? obj.startColumn : 1;
                }
                _this.importSettingsVisible = false;
            },
            // 刪除报表导入设置
            delImportSettings(key) {
                let _this = this;
                if (_this.KHUtils.isNull(key)) {
                    return false;
                }
                delArrayObj(key, 'id', _this.importSettings);

                function delArrayObj(compareKey, key, array) {
                    if (!(array instanceof Array)) {
                        return false;
                    }
                    const index = array.findIndex(obj => obj[key] === compareKey);
                    array.splice(index, 1);
                }
            },
            //保存操作按钮设置
            saveOptButtonSetting(targetList, obj, formId) {
                let len = this.opt.length + 1;
                let newObj = {
                    key: "",
                    label: "",
                    imageId: "",
                    jumpInfo: {type: "0", urlType: "0", url: "", params: []}
                };
                newObj.key = "button" + len;
                newObj.label = obj.label;
                newObj.imageId = obj.imageId;
                newObj.jumpInfo.formId = formId;
                newObj.jumpInfo.type = obj.type;
                newObj.jumpInfo.urlType = obj.urlType;
                newObj.jumpInfo.url = obj.url;

                if (targetList != null && targetList.length > 0) {
                    targetList.forEach(item => {
                        let param = {};
                        param.model = item.id;
                        param.paramName = item.paramName;
                        newObj.jumpInfo.params.push(param);
                    })
                }
                this.opt.push(newObj);
                this.operationSettingsVisible = false;
                this.checkedOpt.push(obj.label);
            },
            listFormConf() {
                let _this = this;
                let param = {
                    flag: 0,
                    pageNum: 1,
                    pageSize: 1000
                };
                _this.formList = [];
                _this.$Get(_this.khConfig.api.listFormConf, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            if (res.datas != null && res.datas instanceof Array && res.datas.length > 0) {
                                res.datas.forEach(item => {
                                    let formObj = {};
                                    formObj.formName = item.formName;
                                    formObj.formId = item.formId + "";
                                    _this.formList.push(formObj);
                                })
                            }
                        }
                    });
            },
            editOptButton() {
                this.optButtonSetting = [];
                this.optButtonStartObj = {type: "0", urlType: "0"};
                this.operationSettingsVisible = true
            }
        }
    }
</script>

<style scoped lang="scss">
    .content {
        .el-form-item--mini.el-form-item, .el-form-item--small.el-form-item {
            margin-bottom: 2px;
        }

        .el-divider--horizontal {
            display: block;
            height: 1px;
            width: 100%;
            margin: 10px 0;
        }

        .customDivClass {
            border: 1px solid #DCDFE6;
            padding-left: 5px;
            border-radius: 4px;
            width: 95%;
        }

        .customDivClass1 {
            border: 1px solid #DCDFE6;
            padding-left: 5px;
            border-radius: 4px;
            width: 95%;
            height: 36px;
        }
      .myCheckBox{
        width: 100px;
        margin-right: 10px;
        margin-bottom: 10px;
        overflow: hidden;


      }
    }
</style>
