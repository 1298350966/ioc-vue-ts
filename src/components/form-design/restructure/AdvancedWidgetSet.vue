<template>
    <el-container class="config-container">
        <!--表单设计-页面设置-->
        <div class="main-design">
            <template v-if="item">
                <div class="chart-design">表单设计</div>
            </template>
            <template v-else>
                <span class="chart-design">页面设置</span>
            </template>
          <el-row>
              <el-tooltip class="item" effect="dark" content="恢复默认主题" placement="top">
              <i class="el-icon-brush" @click="resetTheme" size="medium"  style="color: #409EFF"></i>
              </el-tooltip>
              <el-tooltip class="item" effect="dark" content="编辑主题" placement="top">
            <i class="el-icon-edit-outline" @click="themeDialogVisible = true" size="medium"  style="color: #409EFF"></i>
              </el-tooltip>
            <el-select v-model="themeValue" placeholder="请选择主题" collapse-tags filterable
                       style="width: 200px"
                       class="report-set-style imageMarginTop"   :popper-append-to-body="false"
                       clearable  @click.native="loadThemeFirst" @change="themeSelect"
                       v-el-select-load-more="loadThemeMore">
              <el-option
                v-for="item in themeData"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
            <el-button type="primary" style="height: 30px;margin-top: 7px" @click="addTheme" size="small">另存主题</el-button>
          </el-row>
        </div>
        <!--头部(数据-样式-高级)-->
        <el-header :style="item ? 'text-align: center;height:45px':'text-align: center;height:0'">
            <template
                v-if="item && dataTabShow">
                <div class="config-tab" :class="{active: activeName === 'first',tableColor: activeName === 'first'}"
                     @click="handleTabSelect('first')">数据
                </div>
                <div class="config-tab" :class="{active: activeName === 'second'}"
                     @click="handleTabSelect('second')">样式
                </div>
                <div class="config-tab" :class="{active: activeName === 'third'}"
                     @click="handleTabSelect('third')">高级
                </div>
            </template>
            <template
                v-if="item && (item.type === 'queryWidget' || item.type === 'textWidget' || item.type === 'imgWidget' || item.type === 'tabPageWidget')">
                <div class="config-tab" style="height: 45px">样式</div>
            </template>
        </el-header>
        <!--设置内容-->
        <el-main class="config-content">
            <!--控件设置-->
            <template v-if="item">
                <!--数据设置的控件设置-->
                <template v-if="dataTabShow">
                    <!--数据-->
                    <div v-show="activeName === 'first'"
                         style="display: flex;flex-direction: row;height: 100%">
                        <!--左侧栏-->
                        <div class="data-config-panel-left">
                            <div class="div-first">
                                <div class="div-second">
                                    <!--设置-->
                                    <div class="div-third">
                                        <!--表单数据设置-->
                                        <template v-if="item.reportType === 'tableReportWidget'">
                                            <table-widget-set :item="item" :active-name="activeName"
                                                              :currDragItem="currDragItem"
                                                              ref="tableWidgetSet"
                                                              @showAddColCondFilterDialog="showAddColCondFilterDialog"
                                                              @showAddOptButtonDialog="showAddOptButtonDialog"
                                                              @showAddQuerySortDialog="showAddQuerySortDialog"
                                                              @showAddReportSettingDialog="showAddReportSettingDialog"
                                                              @showReportSettingConfigDialog="showReportSettingConfigDialog"
                                                              @showCondFilterConfigDialog="showCondFilterConfigDialog"
                                                              @showAddBtnDialog="showAddBtnDialog"
                                                              @showSaveJumpInfoDialog="showSaveJumpInfoDialog(arguments)"
                                                              @removeCol="removeCol"
                                                              @removeCondFilter="removeCondFilter"
                                                              @removeBtn="removeBtn"
                                                              @removeOptButton="removeOptButton"
                                                              @removeQuerySort="removeQuerySort"
                                                              @removeImportSetting="removeImportSetting"
                                                              @removeExportSetting="removeExportSetting"
                                                              @openShowTypeConfigDialog="openShowTypeConfigDialog"
                                                              @openSaveExportDialog="openSaveExportDialog"
                                                              :cols-array="colsArray"
                                            ></table-widget-set>
                                        </template>
                                    </div>
                                </div>
                                <!--更新-->
                                <div class="bottom-menus">
                                    <div class="preview-panel">
                                        <label class="preview-label">结果展示</label>
                                        <el-input type="number" :value="1000"
                                                  style="width: 40%;background-color: #414A63"></el-input>
                                    </div>
                                    <div class="refresh-panel">
                                        <el-button type="primary"
                                                   style="width: 100%;background-color: #2153D4;border: none;border-radius: 0px"
                                                   @click="updateForm">更新
                                        </el-button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!--右侧栏-->
                        <div class="data-config-panel-right" style="width: 50%;overflow: auto">
                            <data-tree-show :cols-array="colsArray" :itemData="item.data" :formName="formName"
                                            @addDragItem="addDragItem" @endDragItem="endDragItem"/>
                        </div>
                    </div>
                    <!--样式-->
                    <div v-show="activeName === 'second'" class="second-config-content report-set-style">
                        <template v-if="item.reportType === 'tableReportWidget'">
                            <table-widget-set :item="item" :active-name="activeName"  :cols-array="colsArray"></table-widget-set>
                        </template>
                    </div>
                    <!--高级-->
                    <div v-show="activeName === 'third'">
                        <el-collapse v-model="queryActiveNames">
                            <el-collapse-item title="高级设置" name="1">
                                <el-form label-position="top" class="report-set-margin-let">
                                    <el-form-item label=" ">
                                        <el-checkbox v-model="item.sensior.autoRefresh">自动刷新</el-checkbox>
                                        <el-input style="width: 40%" type="number"
                                                  v-model="item.sensior.count"
                                                  min="1"
                                                  :disabled="!item.sensior.autoRefresh"></el-input>
                                        <el-select placeholder="请选择" v-model="item.sensior.countType" value=""
                                                   :disabled="!item.sensior.autoRefresh"
                                                   style="width: 25%" :popper-append-to-body="false">
                                            <el-option label="分钟" value="minute"></el-option>
                                            <el-option label="秒" value="seconds"></el-option>
                                        </el-select>
                                    </el-form-item>
                                    <el-form-item label=" ">
                                        <el-button v-if="formType == 0" type="primary" @click="openRemindSetDialog">
                                            提醒设置
                                        </el-button>
                                    </el-form-item>
                                    <el-form-item label=" ">
                                        <el-button type="primary" @click="openDataPermissionSetDialog"
                                                   :loading="remindLoading">数据权限设置
                                        </el-button>
                                    </el-form-item>
                                    <el-form-item label=" ">
                                        <el-button type="primary" @click="openQrCodeSetDialog"
                                        >二维码设置
                                        </el-button>
                                        <el-switch
                                            v-model="item.enableQrCode"
                                            active-color="#13ce66"
                                           >
                                        </el-switch>
                                        <span style="color: #409EFF">开启二维码</span>
                                    </el-form-item>
                                    <el-form-item label=" ">
                                        <el-button type="primary" @click="openFormFillSetDialog"
                                        >表单填报次数设置
                                        </el-button>
                                    </el-form-item>
                                </el-form>
                            </el-collapse-item>
                            <el-collapse-item title="控件信息" name="2">
                                <div style="font-size: 14px;margin-left: 10px;margin-top: 15px">
                                    <span style="color: #C0C3CB">控件id</span>
                                    <span v-text="item.id" style="color: #FFFFFF"></span>
                                </div>
                            </el-collapse-item>
                        </el-collapse>
                    </div>
                </template>
                <!--查询控件-->
                <template v-if="item.type === 'queryWidget'">
                    <query-widget-set :item="item" class="report-set-style"></query-widget-set>
                </template>
                <!--文本控件-->
                <template v-else-if="item.type === 'textWidget'">
                    <text-widget-set :item="item" class="report-set-style"></text-widget-set>
                </template>
                <!--图形控件-->
                <template v-else-if="item.type === 'imgWidget'">
                    <img-widget-set :item="item" class="report-set-style"></img-widget-set>
                </template>
                <!--内嵌页面-->
                <template v-else-if="item.type === 'innerPageWidget'">
                    <inner-page-widget-set :item="item" class="report-set-style" :dynCols="colsArray" @notifyUpdateInnerComponent="updateForm"></inner-page-widget-set>
                </template>
                <!--tab页-->
                <template v-else-if="item.type === 'tabPageWidget'">
                    <tab-page-widget-set :item="item" class="report-set-style"></tab-page-widget-set>
                </template>
            </template>
            <!--基础设置-->
            <template v-else>
                <base-page-set :base-set="baseSet" class="report-set-style"></base-page-set>
            </template>
        </el-main>

        <!--列设置-过滤器对话框-->
        <el-dialog :title="configType==='cols' ? '添加列设置' : '添加过滤器'" :visible.sync="colsCondFiltersDialogVisible"
                   v-if="colsCondFiltersDialogVisible" :append-to-body="true" top="5vh" custom-class="col-cond-filter-dialog"
                   @close="closeAddColsCondFiltersDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <template v-slot:default>
                <cols-cond-filters-show ref="colsDataShow" :widget="item.id"
                                        :item-data="configType==='cols' ? item.data.cols : item.data.condFilters"
                                        :cols-array="colsArray" :show-type="configType"
                                        :formName="formName"></cols-cond-filters-show>
            </template>
            <template v-slot:footer>
                <el-button @click="closeAddColsCondFiltersDialog">取 消</el-button>
                <el-button type="primary" @click="saveAddColsCondFilters">确 定</el-button>
            </template>
        </el-dialog>
        <!--操作按钮对话框-->
        <el-dialog title="添加操作按钮设置" :visible.sync="optButtonDialogVisible" v-if="optButtonDialogVisible" :append-to-body="true"
                   @close="closeAddOptButtonDialog" custom-class="opt-button-dialog" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <template v-slot:default>
                <opt-buttons-show ref="optButtonShow" :itemDataOptButtons="item.data.optButtons" :cols-array="colsArray"></opt-buttons-show>
            </template>
            <template v-slot:footer>
                <el-button @click="closeAddOptButtonDialog">取 消</el-button>
                <el-button type="primary" @click="saveAddOptButtons">确 定</el-button>
            </template>
        </el-dialog>
        <!--功能按钮对话框-->
        <el-dialog title="添加功能按钮设置" :visible.sync="btnDialogVisible" v-if="btnDialogVisible" :append-to-body="true"
                   @close="closeAddBtnsDialog" custom-class="btn-dialog" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <template v-slot:default>
                <btns-show ref="btnsShow" :itemDataBtns="item.data.btns"></btns-show>
            </template>
            <template v-slot:footer>
                <el-button @click="closeAddBtnsDialog">取 消</el-button>
                <el-button type="primary" @click="saveAddBtns">确 定</el-button>
            </template>
        </el-dialog>
        <!--排序对话框-->
        <el-dialog title="添加排序设置" :visible.sync="querySortDialogVisible" v-if="querySortDialogVisible" :append-to-body="true"
                   @close="closeAddQuerySortDialog" width="45%" custom-class="query-sort-dialog" :close-on-click-modal="false"
                   :close-on-press-escape="false">
            <template v-slot:default>
                <query-sort-show ref="querySortShow" :item="item" :itemDataQuerySort="item.data.querySort"
                                 :colsArray="colsArray"></query-sort-show>
            </template>
            <template v-slot:footer>
                <el-button @click="closeAddQuerySortDialog">取 消</el-button>
                <el-button type="primary" @click="saveAddQuerySort">确 定</el-button>
            </template>
        </el-dialog>
        <!--导入导出对话框-->
        <el-dialog :title="configType==='import' ? '添加导入设置' : '添加导出设置'" custom-class="report-setting-dialog"
                   :visible.sync="ReportSettingDialogVisible" v-if="ReportSettingDialogVisible" :append-to-body="true"
                   @close="closeAddReportSettingDialog" :close-on-click-modal="false" :close-on-press-escape="false">
            <report-settings-show :show-type="configType" :itemReportSettings="item.data.reportSettings"
                                  @closeAddReportSettingDialog="closeAddReportSettingDialog"
                                  :colsArray="colsArray"></report-settings-show>
        </el-dialog>
        <!--导入导出设置对话框-->
        <el-dialog :title="configType==='import' ? '导入设置' : '导出设置'" custom-class="report-setting-config-dialog"
                   :visible.sync="ReportSettingConfigDialog" top="30vh" width="30%" v-if="ReportSettingConfigDialog" :append-to-body="true"
                   @close="closeReportSettingConfigDialog" :close-on-click-modal="false" :close-on-press-escape="false">
          <template v-slot:default>
            <report-setting-config-show ref="reportSettingConfigShow" :showType="configType" :itemReportSettings="item.data.reportSettings"></report-setting-config-show>
          </template>
          <template v-slot:footer>
            <el-button @click="closeReportSettingConfigDialog">取消</el-button>
            <el-button type="primary" @click="saveReportSettingConfig">确定</el-button>
          </template>
        </el-dialog>
        <!--过滤器配置-->
        <el-dialog title="设置过滤条件" :visible.sync="condFilterConfigDialogVisible" v-if="condFilterConfigDialogVisible"
                   :append-to-body="true"
                   @close="closeCondFilterConfigDialog" custom-class="form-cond-filter-dialog" width="35%"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <template v-slot:default>
                <form-cond-filter ref="formCondFilter" :formConfig="formConfig"
                                  :itemDataCondFilter="currentItemDataCondFilter"></form-cond-filter>
            </template>
            <template v-slot:footer>
                <el-button @click="closeCondFilterConfigDialog">取消</el-button>
                <el-button type="primary" @click="saveCondFilterConfig">确定</el-button>
            </template>
        </el-dialog>
        <!--col的跳转设置-->
        <el-dialog title="跳转配置" :visible.sync="jumpInfoSettingDialogVisible" v-if="jumpInfoSettingDialogVisible"
                   :append-to-body="true" top="15vh"
                   custom-class="jump-dialog" :close-on-click-modal="false" :close-on-press-escape="false"
                   @close="closeJumpInfoSettingDialog">
            <template v-slot:default>
                <div>
                    <jump-config :cols-list="jumpInfoSettingOptions" 
                                 :jump-config="jumpInfoStartObj" :showType="configType" ref="jumpRef"></jump-config>
                </div>
            </template>
            <template v-slot:footer>
                <el-button @click="closeJumpInfoSettingDialog">取消</el-button>
                <el-button type="primary" @click="saveJumpInfoSetting">确定</el-button>
            </template>
        </el-dialog>
        <export-model-conf-dialog :visible.sync="exportSettingDialogVisible" :currentOptBtn="currentOptBtn" ></export-model-conf-dialog>

        <!--主题样式-->
      <el-dialog title="主题样式" :visible.sync="themeDialogVisible"
                top="5vh" custom-class="col-cond-filter-dialog" width="50%"
                 :modal = false :append-to-body="true">
        <theme-list-show :currentType="0"></theme-list-show>
      </el-dialog>

      <!--显示设置-->
      <el-dialog title="显示设置" :visible.sync="showTypeConfigDialogVisible" v-if="showTypeConfigDialogVisible" :append-to-body="true" width="30%" top="30vh"
                 custom-class="report-setting-config-dialog" :close-on-click-modal="false" :close-on-press-escape="false"
                 @close="closeShowTypeConfigDialog">
          <template v-slot:default>
            <show-type-config-show ref="showTypeConfigShow" :itemShowType="item.showType"></show-type-config-show>
          </template>
          <template v-slot:footer>
            <el-button @click="closeShowTypeConfigDialog">取消</el-button>
            <el-button type="primary" @click="saveShowTypeConfig">确定</el-button>
          </template>
      </el-dialog>
        <el-dialog title="提醒设置" custom-class="filter-dialog" :visible.sync="formRemindSetVisible" width="50%"
                   :modal="false" :append-to-body="true" :close-on-click-modal="false">
            <form-remind-set @closeDialog="formRemindSetVisible = false" :formId="formId" :colsArray="colsArray" :allCols="allCols"></form-remind-set>
        </el-dialog>
        <el-dialog title="数据权限设置" custom-class="filter-dialog" :visible.sync="formDataPermissionsSetVisible" width="50%"
                   :modal="false" :append-to-body="true" :close-on-click-modal="false">
            <template v-if="formSet.formSet.dataPermissions">
                <el-row type="flex" class="row-bg" justify="center" style="">
                    <el-col :span="20" style="margin-bottom: 10px">
                        <el-form label-width="80px" >
                            <el-form-item label="字段权限">
                                <div >
                                    <div style="border: 1px solid #C0C4CC;padding: 5px;min-height: 30px;line-height: 22px" @click="selectColPermission">
                                        {{formSet.formSet.dataPermissions.field.name}}
                                    </div>
                                </div>
                            </el-form-item>
                        </el-form>
                    </el-col>
                </el-row>
                <el-row type="flex" class="row-bg" justify="center"
                        v-for="(item,index) in formSet.formSet.dataPermissions.groups" :key="index">
                    <el-col :span="20" style="margin-bottom: 10px">
                        <el-card shadow="never" class="box-card">
                            <div slot="header" class="clearfix">
                                <span>数据权限{{index + 1}}</span>
                                <el-button style="float: right; padding: 3px 0" type="text"
                                           @click="deletePermission(item,index)">删除
                                </el-button>
                            </div>
                            <el-form ref="form" label-width="80px" :rules="dataRules">
                                <el-form-item label="权限成员" prop="recipient">
                                    <el-col @click.native="selectPermissionRecipient(item)">
                                        <div style="border: 1px solid #C0C4CC;padding: 5px;min-height: 30px;line-height: 22px">
                                            {{getRecipient(item)}}
                                        </div>
                                    </el-col>
                                </el-form-item>
                                <el-form-item label="管理范围">
                                    <el-radio-group v-model="item.scope.type">
                                        <el-radio :label="1">自己负责的</el-radio>
                                        <el-radio :label="2">全公司</el-radio>
                                        <el-radio :label="3">同层级</el-radio>
                                        <el-radio :label="4">下属的</el-radio>
                                        <el-radio :label="5">自定义</el-radio>
                                    </el-radio-group>
                                </el-form-item>
                                <el-form-item label="" v-if="item.scope.type == '5'">
                                    <el-col @click.native="selectPermissionCustomRecipient(item)">
                                        <div style="border: 1px solid #C0C4CC;padding: 5px;min-height: 30px;line-height: 22px">
                                            {{getCustomRecipient(item)}}
                                        </div>
                                    </el-col>
                                </el-form-item>
                                <!--        <el-form-item label="字段权限">
                                            <el-col @click.native="selectColPermission(item)">
                                                <div style="border: 1px solid #C0C4CC;padding: 5px;height: 15px;line-height: 15px">
                                                    {{getUserControl(item)}}
                                                </div>
                                            </el-col>
                                        </el-form-item>-->
                                <el-form-item label="操作权限">
                                    <el-checkbox-group v-model="item.operation">
                                        <el-checkbox label="1">查看</el-checkbox>
                                        <el-checkbox label="2">导出</el-checkbox>
                                        <el-checkbox label="3">删除</el-checkbox>
                                        <el-checkbox label="4">新增</el-checkbox>
                                        <el-checkbox label="5" v-if="formType == 0">编辑</el-checkbox>
                                    </el-checkbox-group>
                                </el-form-item>

                            </el-form>
                        </el-card>
                    </el-col>

                </el-row>
            </template>
            <el-row type="flex" class="row-bg" justify="center">
                <el-col :span="20">
                    <el-button type="success" plain icon="el-icon-plus" style="width: 100%;margin-top: 20px"
                               @click="addPermission">新增权限
                    </el-button>
                </el-col>

            </el-row>

            <span slot="footer" class="dialog-footer">
                <el-button @click="formDataPermissionsSetVisible = false">取 消</el-button>
                <el-button type="primary" @click="saveFormDataPermissions()">保存</el-button>
              </span>
        </el-dialog>
        <el-dialog title="接收人" :visible.sync="recipientVisible" width="50%" :modal="false" :append-to-body="true"
                   :close-on-click-modal="false">

            <ore-transfer @getCheckedNodesFromOrgUserTree="getCheckedNodesFromOrgUserTree"
                          :formPermissions="getRemidRecipient"></ore-transfer>
        </el-dialog>
        <el-dialog title="企业接收人" :visible.sync="companyRecipientVisible" v-if="companyRecipientVisible" width="50%" :modal="false" :append-to-body="true"
                   :close-on-click-modal="false">

           <company-transfer :selectCompany="getRemidCompany" @getSelectCompany="getSelectCompany"></company-transfer>
        </el-dialog>

        <el-dialog title="权限成员" :visible.sync="permissionRecipientVisible" width="50%" :modal="false"
                   :append-to-body="true" :close-on-click-modal="false">

            <ore-transfer @getCheckedNodesFromOrgUserTree="getRecipientCheckedNodes"
                          :formPermissions="currentPermission.recipient"></ore-transfer>
        </el-dialog>
        <el-dialog title="自定义范围" :visible.sync="customRecipientVisible" width="50%" :modal="false"
                   :append-to-body="true" :close-on-click-modal="false">

            <ore-transfer @getCheckedNodesFromOrgUserTree="getScopeCustomCheckedNodes"
                          :formPermissions="currentPermission.scope.custom"></ore-transfer>
        </el-dialog>
        <el-dialog title="字段权限设置" :visible.sync="colsDialogVisible"
                   v-if="colsDialogVisible" :append-to-body="true" top="5vh" custom-class="col-cond-filter-dialog"
                   :close-on-click-modal="false" :close-on-press-escape="false">
            <template v-slot:default>
                <el-tree
                    :data="userControls"
                    show-checkbox
                    default-expand-all
                    node-key="model"
                    ref="tree"
                    @check="getname"
                    :check-strictly="true"
                    highlight-current
                    :default-checked-keys="defaultCheckedKeys"
                    :props="defaultProps">
                     <span class="custom-tree-node" slot-scope="{ node, data }">
                        <span :title="getTreeLabel(node, data)">
                          {{ getTreeLabel(node, data) }}
                        </span>
      </span>
                </el-tree>
            </template>
            <template v-slot:footer>
                <el-button @click="colsDialogVisible = false">取 消</el-button>
                <el-button type="primary" @click="selectFormDataUserControls">确 定</el-button>
            </template>
        </el-dialog>
        <el-dialog title="二维码设置" :visible.sync="qrCodeDialogVisible" :append-to-body="true" width="60%"
                   custom-class="advanced-set-dialog":close-on-click-modal="false" :close-on-press-escape="false">
            <qr-code-setting :formId="formId" :formConfig="formConfig" @closeQrCodeSetDialog="closeQrCodeSetDialog"></qr-code-setting>
        </el-dialog>
        <el-dialog title="表单填报次数设置" :visible.sync="formFillSetDialogVisible" :append-to-body="true" width="40%"
                   custom-class="advanced-set-dialog":close-on-click-modal="false" :close-on-press-escape="false">
            <form-fill-setting :formId="formId" :formConfig="formConfig" @closeFormFillSetDialog="closeFormFillSetDialog"></form-fill-setting>
        </el-dialog>
    </el-container>
</template>

<script>
    import QueryWidgetSet from "@/components/form-design/restructure/queryWidget/FormQueryWidgetSet";
    import ImgWidgetSet from "@/components/form-design/restructure/imgWidget/FormImgWidgetSet";
    import TextWidgetSet from "@/components/form-design/restructure/textWidget/FormTextWidgetSet";
    import InnerPageWidgetSet from "@/components/form-design/restructure/innerPageWidget/FormInnerPageWidgetSet";
    import TabPageWidgetSet from "@/components/form-design/restructure/tabPageWidget/FormTabPageWidgetSet";
    import BasePageSet from "@/components/form-design/restructure/FormBasePageSet";
    import TableWidgetSet from "@/components/form-design/restructure/tableWidget/FormTableWidgetSet";
    import FormCondFilter from "@/components/form-design/restructure/FormCondFilter";
    import AdvancedWidgetSetItem from "@/components/form-design/restructure/AdvancedWidgetSetItem";
    import ColsCondFiltersShow from "@/components/form-design/restructure/dataConfig/ColsCondFiltersShow";
    import OptButtonsShow from "@/components/form-design/restructure/dataConfig/OptButtonsShow";
    import QuerySortShow from "@/components/form-design/restructure/dataConfig/QuerySortShow";
    import ReportSettingsShow from "@/components/form-design/restructure/dataConfig/ReportSettingsShow";
    import ReportSettingConfigShow from "@/components/form-design/restructure/dataConfig/ReportSettingConfigShow";
    import BtnsShow from "@/components/form-design/restructure/dataConfig/BtnsShow";
    import ShowTypeConfigShow from "@/components/form-design/restructure/dataConfig/ShowTypeConfigShow";
    import OperationTransfer from '@/components/OperationTransfer';
    import JumpConfig from "@/components/JumpConfig";
    import DataTreeShow from "@/components/form-design/restructure/dataConfig/DataTreeShow";
    import ThemeListShow from "@/components/theme/ThemeListShow";
    import OreTransfer from "@/components/OreTransfer";
    import CompanyTransfer from "@/components/CompanyTransfer";
    import ExportModelConfDialog from  "@/components/form-design/ExportModelConfDialog";
    import QrCodeSetting from  "@/components/form-design/QrCodeSetting";
    import FormFillSetting from  "@/components/form-design/FormFillSetting";
    import FormItem from "@/components/qr-code-set/FormItem";
    import FormRemindSet from "@/components/form/FormRemindSet";

    export default {
      directives: {
        'el-select-load-more': {
          bind(el, binding) {
            const SELECTWRAP_DOM = el.querySelector(
              '.el-select-dropdown .el-select-dropdown__wrap'
            );
            SELECTWRAP_DOM.addEventListener('scroll', function () {
              const condition = this.scrollHeight - this.scrollTop <= this.clientHeight;
              if (condition) {
                binding.value();
              }
            });
          }
        }
      },
        name: "AdvancedWidgetSet",
        components: {
            DataTreeShow,
            ColsCondFiltersShow, //列字段选择显示-组件
            OptButtonsShow,
            TableWidgetSet, //表格控件-组件
            FormCondFilter, //表单过滤器-组件
            AdvancedWidgetSetItem, //配置字段item-组件
            QuerySortShow, //排序字段设置
            ReportSettingsShow, //导入导出字段设置
            ReportSettingConfigShow,
            BtnsShow,
            ShowTypeConfigShow,
            OperationTransfer,
            QueryWidgetSet,
            ImgWidgetSet,
            TextWidgetSet,
            InnerPageWidgetSet,
            TabPageWidgetSet,
            BasePageSet,
            JumpConfig,
          ThemeListShow,
            OreTransfer,
            ExportModelConfDialog,
            QrCodeSetting,
            FormFillSetting,
            CompanyTransfer,
            FormItem,
            FormRemindSet
        },
        props: {
            colsArray: {type: Array},
            allCols: {type: Array},
            formConfig: {type: Object},
            // formList: {type: Array},
            item: {required: false, type: Object}, // 当前控件item的有关配置
            baseSet: {required: false, type: Object}, //页面基础配置
            formName: {type: String},
            formId: {
                type: Number,
                required: true
            },
            formType:{
                type:String | Number,
                required:true
            }
        },
        computed: {
            dataTabShow: function () {
                if (this.item) {
                    if (this.item.hasOwnProperty('reportType')) {
                        return this.item.reportType === 'tableReportWidget';
                    } else {
                        return false;
                    }
                } else {
                    return false;
                }
            },
            getRecipient(){
                return function (item) {
                    if (item.recipient instanceof Array && item.recipient.length > 0) {
                        let name = "";
                        item.recipient.forEach((recipient, index) => {
                            if(recipient.type == 0 || recipient.type == 1){
                                if(item.recipient.length == index+1){
                                    name = name.concat(recipient.name)
                                }else {
                                    name = name.concat(recipient.name).concat("、")
                                }
                            }


                        })
                        return name;
                    } else {
                        return ""
                    }
                }
            },
            getComyanyRecipent(item){
                return function (item) {
                    if (item.recipient instanceof Array && item.recipient.length > 0) {
                        let name = "";
                        item.recipient.forEach((recipient, index) => {
                            if(recipient.type ==9){
                                if(item.recipient.length == index+1){
                                    name = name.concat(recipient.name)
                                }else {
                                    name = name.concat(recipient.name).concat("、")
                                }
                            }


                        })
                        return name;
                    } else {
                        return ""
                    }
                }
            },
            getRemidCompany:function () {
                let companys = [];
                if(this.currentRemind.recipient instanceof Array && this.currentRemind.recipient.length >0){
                    this.currentRemind.recipient.forEach((item,index)=>{
                        if(item.type == 9){
                            companys.push(item);
                        }
                    })
                }
                return companys;

            },
            getRemidRecipient:function () {
                let recipient = [];
                if(this.currentRemind.recipient instanceof Array && this.currentRemind.recipient.length >0){
                    this.currentRemind.recipient.forEach((item,index)=>{
                        if(item.type == 0 || item.type == 1){
                            recipient.push(item);
                        }
                    })
                }
                return recipient;

            },
            getCustomRecipient(){
                return function (item) {
                    if (item.scope.custom instanceof Array && item.scope.custom.length > 0) {
                        let name = "";
                        item.scope.custom.forEach((recipient, index) => {
                            if(item.scope.custom.length == index+1){
                                name = name.concat(recipient.name);
                            }else {
                                name = name.concat(recipient.name).concat("、");
                            }

                        })
                        return name;
                    } else {
                        return ""
                    }
                }
            },
            getTreeLabel() {
                return function (node, data) {
                    return data.name + '(' + data.model + ')';
                };
            },
            getUserControl(){
                return function (item) {
                    if (item.userControls instanceof Array && item.userControls.length > 0) {
                        let name = "";
                        item.userControls.forEach((userControl, index) => {
                            if(item.userControls.length == index+1){
                                name = name.concat(userControl.name)
                            }else {
                                name = name.concat(userControl.name).concat("、")
                            }

                        })
                        return name;
                    } else {
                        return ""
                    }
                }
            }
        },
        data() {
            return {
                activeName: 'first', //数据-样式-高级切换
                queryActiveNames: ['1'], //高级
                defaultProps: {children: 'cols', label: 'name'},  //树形结构格式
                configType: '', //列设置或过滤器
                colsCondFiltersDialogVisible: false, //字段显示对话框
                optButtonDialogVisible: false, //按钮对话框
                querySortDialogVisible: false, //排序对话框
                ReportSettingDialogVisible: false, //导入导出对话框
                ReportSettingConfigDialog: false,
                condFilterConfigDialogVisible: false,
                btnDialogVisible: false,
                jumpInfoSettingDialogVisible: false,//链接调整设置
              showTypeConfigDialogVisible: false,
                jumpInfoSettingOptions: [],//操作按钮跳转参数设置集合
                currentItemDataCondFilter: null,
                currentItemDataObject: null,
                jumpInfoStartObj: {},
                jumpType: '',
                themeData:[],
                queryThemeParam:{
                    type:0,
                    pageNum:1,
                    pageSize:10
                },
              themeValue:null,
              themeDialogVisible:false,
              currDragItem: null,


                formRemindSetVisible: false,
                remindLoading: false,
                saveRemindLoading: false,

                formSet: {
                    id: null,
                    formId: null,
                    formSet: {
                        formRemind: [],
                        condRemind:[],
                        dataPermissions: {
                            field:{
                                name:"录入人员",
                                model:"user_id"
                            },
                            groups:[]
                        }
                    }
                },
                recipientVisible: false,
                companyRecipientVisible:false,
                currentRemind: {},
                //表单权限设置
                formDataPermissionsSetVisible: false,
                currentPermission: {
                    recipient: [],
                    scope: {
                        type: 1,
                        custom: []
                    },
                    operation: []
                },
                permissionRecipientVisible: false,
                customRecipientVisible: false,
                colsDialogVisible: false,
                defaultProps: {
                    children: 'children',
                    label: 'name'
                },
                userControls:[],
                defaultCheckedKeys:[],
                exportSettingDialogVisible:false,
                currentOptBtn:{},
                uploadUrl:"",
                /*二维码设置*/
                qrCodeDialogVisible:false,
                qrColdeLoading:false,
                formFillSetDialogVisible:false,
            };
        },
      created() {

          //初始化用户控件，以供数据权限设置选择
          this.userControls.push({
              name:"录入人员",
              model:"user_id"
          })
          if(this.colsArray instanceof Array && this.colsArray.length >0){
              this.colsArray.forEach((item,index)=>{

                  if(item.type == "user_select" && !item.model.endsWith('_lb')){
                      let newObj= {
                          name:"",
                          model:""
                      };
                      newObj.name = item.title;
                      newObj.model = item.model;
                      this.userControls.push(newObj);
                  }
              })
          }
          this.initJumpInfoSettingData();
          this.uploadUrl = this.khConfig.host.rest+this.khConfig.api.fileUpload;
      },
        methods: {
            /*二维码设置*/
            openQrCodeSetDialog(){
                this.qrCodeDialogVisible = true;
            },
            /*表单填报设置*/
            openFormFillSetDialog(){
                this.formFillSetDialogVisible = true;
            },
            closeQrCodeSetDialog(){
                this.qrCodeDialogVisible = false;
            },
            closeFormFillSetDialog(){
                this.formFillSetDialogVisible = false;
            },
          //重置主题
          resetTheme(){
            let _this = this;
              this.$confirm('是否重置主题?', '提示', {
                  confirmButtonText: '确定',
                  cancelButtonText: '取消',
                  type: 'warning'
              }).then(() => {
                  _this.$emit("resetTheme");
                 /* this.$message({
                      type: 'success',
                      message: '删除成功!'
                  });*/
              });

          },
          addTheme(){
            let _this = this;
            _this.$emit("addTheme");
          },
          loadThemeFirst(){
            let _this = this;
             _this.queryThemeParam.pageNum = 1;
            _this.themeData = [];
             _this.queryTheme();

          },
          loadThemeMore(){
            let _this = this;
            _this.queryThemeParam.pageNum++;
            _this.queryTheme();
          },
          queryTheme(){
            this.$Get(this.khConfig.api.queryThemeByType, this.queryThemeParam).then(res => {
              if (res.errCode === 0) {
                if (!this.KHUtils.isNull(res.datas) && res.datas.length > 0) {
                  res.datas.forEach(item => {
                    let obj = {
                      label: item.themeName,
                      value: item.id
                    }
                    this.themeData.push(obj);

                  })

                }


              }
            });
          },
          themeSelect(value){
            if(!this.KHUtils.isNull(value)){
              this.$Get(this.khConfig.api.queryThemeMeta+"/"+value).then(res => {
                if (res.errCode === 0) {
                  let themeMeta = JSON.parse(res.themeMeta);
                  this.$emit("refreshTheme",value,themeMeta);

                }
              });
            }

          },
            updateForm() {
                let _this = this;
                _this.$emit("reviewItem");
            },
            //数据-样式-高级切换
            handleTabSelect(value) {
                this.activeName = value;
            },
            initJumpInfoSettingData() {
                this.colsArray.forEach(cr => {
                    if (!this.KHUtils.isNull(cr.name)) {
                        // 子表单,标签不再父表单结果列,导入导出中显示
                        if (cr.type !== 'table' && cr.type !== 'flow_table' && cr.type !== 'text' && cr.type !== 'grid') {
                            let newObj = {};
                            newObj.id = cr.model;
                            newObj.name = cr.name;
                            newObj.isSelected = false;
                            newObj.paramName = cr.model;
                            this.jumpInfoSettingOptions.push(({
                                id: newObj.id,
                                name: newObj.name,
                                paramName: newObj.id
                            }));
                        }
                    }
                });
            },
          openShowTypeConfigDialog() {
            this.showTypeConfigDialogVisible = true;

          },
          closeShowTypeConfigDialog() {
            this.showTypeConfigDialogVisible = false;
          },
          saveShowTypeConfig() {
            this.$refs['showTypeConfigShow'].saveShowTypeConfig();
            this.closeShowTypeConfigDialog();
          },
            showAddColCondFilterDialog(type) {
                //console.log('item', JSON.stringify(this.item));
                this.configType = type;
                this.colsCondFiltersDialogVisible = true;
            },
            showAddOptButtonDialog() {
                this.optButtonDialogVisible = true;
            },
            showAddQuerySortDialog() {
                this.querySortDialogVisible = true;
            },
            showAddReportSettingDialog(type) {
                this.configType = type;
                this.ReportSettingDialogVisible = true;
            },
            showReportSettingConfigDialog(type) {
                this.configType = type;
                this.ReportSettingConfigDialog = true;
            },
            showCondFilterConfigDialog(item) {
                this.currentItemDataCondFilter = item;
                this.condFilterConfigDialogVisible = true;
            },
            showAddBtnDialog() {
                this.btnDialogVisible = true;
            },
            showSaveJumpInfoDialog(args) {
                this.configType = args[1];
                this.currentItemDataObject = args[0];
                this.jumpInfoStartObj = {};
                if (this.currentItemDataObject.hasOwnProperty('jumpInfo')) {
                    this.jumpInfoStartObj.type = args[0].jumpInfo.type;
                    this.jumpInfoStartObj.urlType = args[0].jumpInfo.urlType;
                    this.jumpInfoStartObj.jumpType = args[0].jumpInfo.jumpType;
                    this.jumpInfoStartObj.url = args[0].jumpInfo.url;
                    this.jumpInfoStartObj.params = args[0].jumpInfo.params;
                    this.jumpInfoStartObj.formId = args[0].jumpInfo.formId;
                    this.jumpInfoStartObj.componentType = args[0].jumpInfo.componentType;
                    this.jumpInfoStartObj.dialogTitle = args[0].jumpInfo.dialogTitle;
                    this.jumpInfoStartObj.dialogWidth = args[0].jumpInfo.dialogWidth;
                    this.jumpInfoStartObj.dialogTop = args[0].jumpInfo.dialogTop;
                    this.jumpInfoStartObj.dialogHeight = args[0].jumpInfo.dialogHeight;
                    this.jumpInfoStartObj.dialogFullscreen = args[0].jumpInfo.dialogFullscreen;
                    this.jumpInfoStartObj.respParamSet = args[0].jumpInfo.respParamSet;
                    this.jumpInfoStartObj.requestMethod = args[0].jumpInfo.requestMethod;
                }
                if(!(args[0].jumpInfo)){
                  this.jumpInfoStartObj.respParamSet = [{errCode: "errCode", errMsg: "errMsg"}];
                }
                if (this.KHUtils.isNull(this.jumpInfoStartObj.urlType)) {
                    this.jumpInfoStartObj.urlType = "0";
                }
                if (this.KHUtils.isNull(this.jumpInfoStartObj.type)) {
                    this.jumpInfoStartObj.type = "0";
                }
                if (this.KHUtils.isNull(this.jumpInfoStartObj.jumpType)) {
                    if (this.configType !== 'btns') {
                      this.jumpInfoStartObj.jumpType = "0";
                    } else {
                      this.jumpInfoStartObj.jumpType = "1";
                    }
                }
                if (this.KHUtils.isNull(this.jumpInfoStartObj.dialogWidth)) {
                    this.jumpInfoStartObj.dialogWidth = "50";
                }
                if (this.KHUtils.isNull(this.jumpInfoStartObj.dialogFullscreen)) {
                    this.jumpInfoStartObj.dialogFullscreen = "0";
                }
                this.jumpInfoSettingDialogVisible = true;
            },
            openSaveExportDialog(item){
                this.currentOptBtn = item;
                this.exportSettingDialogVisible = true;
            },
            closeAddColsCondFiltersDialog() {
                this.colsCondFiltersDialogVisible = false;
            },
            closeAddOptButtonDialog() {
                //console.log(JSON.stringify(this.item.data.optButtons));
                this.optButtonDialogVisible = false;
            },
            closeAddQuerySortDialog() {
                this.querySortDialogVisible = false;
            },
            closeAddReportSettingDialog() {
                this.ReportSettingDialogVisible = false;
            },
            closeCondFilterConfigDialog() {
                this.condFilterConfigDialogVisible = false;
            },
            closeAddBtnsDialog() {
                this.btnDialogVisible = false;
            },
            closeReportSettingConfigDialog() {
                this.ReportSettingConfigDialog = false;
            },
            closeJumpInfoSettingDialog() {
                this.jumpInfoSettingDialogVisible = false;
            },
            closeExportSettingDialog(){
                this.exportSettingDialogVisible = false;
            },

            saveReportSettingConfig() {
                let reportSettingConfig = this.$refs['reportSettingConfigShow'].getReportSettingConfig();
                if (this.configType === 'import') {
                    this.item.data.reportSettings.importSettings.startRow = reportSettingConfig.startRow;
                    this.item.data.reportSettings.importSettings.startColumn = reportSettingConfig.startColumn;
                } else {
                    this.item.data.reportSettings.exportSettings.startRow = reportSettingConfig.startRow;
                    this.item.data.reportSettings.exportSettings.startColumn = reportSettingConfig.startColumn;
                    this.item.data.reportSettings.exportSettings.exportModelInfo.fileId = reportSettingConfig.exportModelInfo.fileId;
                    this.item.data.reportSettings.exportSettings.exportModelInfo.originalfile = reportSettingConfig.exportModelInfo.originalfile;
                }
                this.closeReportSettingConfigDialog();
            },
            saveAddColsCondFilters() {
                let checkedData = this.$refs['colsDataShow'].getCheckedData();
                //console.log(JSON.stringify(checkedData));
                if (this.configType === 'cols') {
                    let optItem;
                    let optExist = false;
                    for (let i = 0; i < this.item.data.cols.length; i++) {
                        let col = this.item.data.cols[i];
                        if (col.key === '$opt') {
                            optExist = true;
                            this.item.data.cols.splice(i, 1);
                            break;
                        }
                    }
                    for (let i = 0; i < checkedData.length; i++) {
                        let checkedDataItem = checkedData[i];
                        if (checkedDataItem.key === '$seq') {
                            this.item.data.cols.unshift(checkedDataItem);
                        } else if (checkedDataItem.key === '$opt') {
                            optItem = checkedDataItem;
                        } else {
                            this.item.data.cols.push(checkedDataItem);
                        }
                    }
                    if (optItem) {
                        this.item.data.cols.push(optItem);
                    }
                    if (optExist) {
                        this.item.data.cols.push({
                            "key": "$opt",
                            "name": "操作",
                            "alias": "操作",
                            "isJump": false
                        });
                    }
                } else if (this.configType === 'condFilters') {
                    this.item.data.condFilters.push(...checkedData);
                }
                this.closeAddColsCondFiltersDialog();
            },
            saveAddOptButtons() {
                let optButtons = this.$refs.optButtonShow.getOptButtons();
                this.item.data.optButtons.push(...optButtons);
                //console.log(JSON.stringify(optButtons));
                this.closeAddOptButtonDialog();
            },
            saveAddQuerySort() {
                let querySort = this.$refs.querySortShow.getCheckedSort();
                this.item.data.querySort = [];
                this.item.data.querySort.push(...querySort);
                this.closeAddQuerySortDialog();
            },
            saveCondFilterConfig() {
                let condFilter = this.$refs.formCondFilter.saveCondFilter();
                Object.assign(this.currentItemDataCondFilter, condFilter);
                //console.log(JSON.stringify(this.currentItemDataCondFilter));
                this.closeCondFilterConfigDialog();
            },
            saveAddBtns() {
                let btns = this.$refs.btnsShow.getCheckedBtns();
                //console.log(JSON.stringify(btns));
                this.item.data.btns.push(...btns);
                this.closeAddBtnsDialog();
            },
            saveJumpInfoSetting() {
                let _this = this;
                _this.$refs.jumpRef.submitData();
                let obj = _this.KHUtils.clone(_this.jumpInfoStartObj);
                console.log('obj',obj);
                let jumpInfo = {};
                jumpInfo.formId = obj.formId;
                jumpInfo.type = obj.type;
                jumpInfo.urlType = obj.urlType;
                jumpInfo.url = obj.url;
                if(_this.jumpInfoStartObj.respParamSet){
                    jumpInfo.respParamSet = _this.jumpInfoStartObj.respParamSet;
                }
                jumpInfo.params = _this.jumpInfoStartObj.params;
                jumpInfo.jumpType = _this.jumpInfoStartObj.jumpType;
                jumpInfo.componentType = _this.jumpInfoStartObj.componentType;
                jumpInfo.dialogTitle = _this.jumpInfoStartObj.dialogTitle;
                jumpInfo.dialogWidth = _this.jumpInfoStartObj.dialogWidth;
                jumpInfo.dialogTop = _this.jumpInfoStartObj.dialogTop;
                jumpInfo.dialogHeight = _this.jumpInfoStartObj.dialogHeight;
                jumpInfo.dialogFullscreen = _this.jumpInfoStartObj.dialogFullscreen;
                jumpInfo.requestMethod = _this.jumpInfoStartObj.requestMethod;
                if (this.configType === 'cols') {
                    for (let i = 0; i < this.item.data.cols.length; i++) {
                        let col = this.item.data.cols[i];
                        if (col.key === this.currentItemDataObject.key) {
                            this.$set(this.item.data.cols[i], 'jumpInfo', jumpInfo);
                            this.$set(this.item.data.cols[i], 'isJump', true);
                        }
                    }
                } else if (this.configType === 'optButtons') {
                    for (let i = 0; i < this.item.data.optButtons.length; i++) {
                        let optButton = this.item.data.optButtons[i];
                        if (optButton.key === this.currentItemDataObject.key) {
                            this.$set(this.item.data.optButtons[i], 'jumpInfo', jumpInfo);
                        }
                    }
                } else if (this.configType === 'btns') {
                    for (let i = 0; i < this.item.data.btns.length; i++) {
                        let optButton = this.item.data.btns[i];
                        if (optButton.key === this.currentItemDataObject.key) {
                            this.$set(this.item.data.btns[i], 'jumpInfo', jumpInfo);
                        }
                    }
                }
                console.log(JSON.stringify(this.item.data.btns));
                this.closeJumpInfoSettingDialog();
            },
            //保存操作按钮导出设置
            saveOptBtnExportSetting(){
                this.exportSettingDialogVisible = false;
            },
            //移除列设置
            removeCol(item) {
                for (let i = 0; i < this.item.data.cols.length; i++) {
                    let col = this.item.data.cols[i];
                    if (col.key === item.key) {
                        this.item.data.cols.splice(i, 1);
                        break;
                    }
                }
            },
            // 过滤条件的删除
            removeCondFilter(item) {
                for (let i = 0; i < this.item.data.condFilters.length; i++) {
                    let condFilter = this.item.data.condFilters[i];
                    if (condFilter.model === item.model) {
                        this.item.data.condFilters.splice(i, 1);
                        break;
                    }
                }
            },
            removeBtn(item) {
                for (let i = 0; i < this.item.data.btns.length; i++) {
                    let btn = this.item.data.btns[i];
                    if (btn.key === item.key) {
                        this.item.data.btns.splice(i, 1);
                        break;
                    }
                }
            },
            removeOptButton(item) {
                for (let i = 0; i < this.item.data.optButtons.length; i++) {
                    let optButton = this.item.data.optButtons[i];
                    if (optButton.key === item.key) {
                        this.item.data.optButtons.splice(i, 1);
                        break;
                    }
                }
            },
            removeQuerySort(item) {
                for (let i = 0; i < this.item.data.querySort.length; i++) {
                    let querySort = this.item.data.querySort[i];
                    if (querySort.key === item.key) {
                        this.item.data.querySort.splice(i, 1);
                        break;
                    }
                }
            },
            removeImportSetting(item) {
                for (let i = 0; i < this.item.data.reportSettings.importSettings.list.length; i++) {
                    let importSetting = this.item.data.reportSettings.importSettings.list[i];
                    if (importSetting.model === item.model) {
                        this.item.data.reportSettings.importSettings.list.splice(i, 1);
                        break;
                    }
                }
            },
            removeExportSetting(item) {
                for (let i = 0; i < this.item.data.reportSettings.exportSettings.list.length; i++) {
                    let exportSetting = this.item.data.reportSettings.exportSettings.list[i];
                    if (exportSetting.model === item.model) {
                        this.item.data.reportSettings.exportSettings.list.splice(i, 1);
                        break;
                    }
                }
            },
          addDragItem(currDragItem) {
            this.currDragItem = currDragItem;
            this.$refs['tableWidgetSet'].onStartDrag();
          },
          endDragItem() {
            this.$refs['tableWidgetSet'].onEndDrag();
          },
            openRemindSetDialog(){
                let _this = this;
                this.formRemindSetVisible = true;

            },

            getCheckedNodesFromOrgUserTree(checkedNodes) {
                let _this = this;
                if(_this.currentRemind.recipient instanceof Array && _this.currentRemind.recipient.length >0){
                    for(var i = 0;i<_this.currentRemind.recipient.length;){
                        let recipient = _this.currentRemind.recipient[i];
                        if(recipient.type == 0 || recipient.type == 1){
                            _this.currentRemind.recipient.splice(i,1);
                        }else {
                            i++;
                        }
                    }
                }else {
                    _this.currentRemind.recipient = [];
                }
                _this.currentRemind.recipient = _this.currentRemind.recipient.concat(checkedNodes);
                _this.recipientVisible = false;
            },
            getSelectCompany(companys){
                let _this = this;
                if(_this.currentRemind.recipient instanceof Array && _this.currentRemind.recipient.length >0){
                    for(var i = 0;i<_this.currentRemind.recipient.length;){
                        let recipient = _this.currentRemind.recipient[i];
                        if(recipient.type == 9){
                            _this.currentRemind.recipient.splice(i,1);
                        }else {
                            i++;
                        }
                    }
                }else {
                    _this.currentRemind.recipient = [];
                }
                _this.currentRemind.recipient = _this.currentRemind.recipient.concat(companys);
                _this.companyRecipientVisible = false;
            },
            selectRecipient(item){
                this.recipientVisible = true;
                this.currentRemind = item;
            },
            selectCompanyRecipient(item){
                this.companyRecipientVisible = true;
                this.currentRemind = item;

            },
            //删除提醒
            deleteRemind(item, index){
                this.formSet.formSet.formRemind.splice(index, 1);
            },
            saveFormRemid(){
                this.saveRemindLoading = true;
                this.$PostJson(this.khConfig.api.saveFormRemindSet, this.formSet).then(res => {
                    this.saveRemindLoading = false;
                    this.formRemindSetVisible = false
                    if (res.errCode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });

                    } else {

                    }
                })
            },
            //新增表单数据权限
            addPermission(){
                let newObj = {
                    recipient: [],
                    scope: {
                        type: 1,
                        custom: []
                    },
                    operation: ['1']
                }
                this.formSet.formSet.dataPermissions.groups.push(newObj);
            },
            openDataPermissionSetDialog(){
                let _this = this;
                _this.formSet = {
                    id: null,
                    formId: _this.formId,
                    formSet: {
                        formRemind: [],
                        condRemind:[],
                        dataPermissions: {
                            field:{
                                name:"录入人员",
                                model:"user_id"
                            },
                            groups:[]
                        }
                    }
                }
                _this.remindLoading = true;
                _this.$Get(_this.khConfig.api.queryFormSetByFormId + "/" + _this.formId, null).then(res => {
                    _this.remindLoading = false;
                    if (res.errCode === 0) {
                        this.formDataPermissionsSetVisible = true;

                        if (res.data) {
                            _this.formSet.id = res.data.id;
                            _this.formSet.formId = res.data.formId;
                            if(_this.KHUtils.isNull(res.data.formSet)){
                                _this.$set(_this.formSet.formSet,'dataPermissions', {
                                    field:{
                                        name:"录入人员",
                                        model:"user_id"
                                    },
                                    groups:[]
                                })
                            }else {
                                let formSetObj = JSON.parse(res.data.formSet);
                                _this.formSet.formSet = JSON.parse(res.data.formSet);
                                if( !_this.formSet.formSet.dataPermissions){
                                    _this.$set(_this.formSet.formSet,'dataPermissions', {
                                        field:{
                                            name:"录入人员",
                                            model:"user_id"
                                        },
                                        groups:[]
                                    })
                                }
                            }
                        } else {
                            _this.formSet.id = null;
                            _this.formSet.formId = _this.formId;
                            _this.formSet.formSet = {
                                formRemind: [],
                                condRemind:[],
                                dataPermissions: {
                                    field:{
                                        name:"录入人员",
                                        model:"user_id"
                                    },
                                    groups:[]
                                }
                            };
                        }


                    }
                })
            },
            selectPermissionRecipient(item){
                this.currentPermission = item;
                this.permissionRecipientVisible = true;
            },
            selectColPermission(){
                this.defaultCheckedKeys = [];
                this.defaultCheckedKeys.push(this.formSet.formSet.dataPermissions.field.model)
                this.colsDialogVisible = true;
            },
            selectPermissionCustomRecipient(item){
                this.currentPermission = item;
                this.customRecipientVisible = true;
            },
            getRecipientCheckedNodes(checkedNodes){
                let _this = this;
                _this.currentPermission.recipient = [];
                _this.currentPermission.recipient = checkedNodes;
                _this.permissionRecipientVisible = false;
            },
            getScopeCustomCheckedNodes(checkedNodes){
                let _this = this;
                _this.currentPermission.scope.custom = [];
                _this.currentPermission.scope.custom = checkedNodes;
                _this.customRecipientVisible = false;
            },
            //删除权限
            deletePermission(item, index){
                this.formSet.formSet.dataPermissions.groups.splice(index, 1);
            },
            dataFieldChange(val){
                for(var i = 0;i<this.userControls.length;i++){
                    let control = this.userControls[i];
                    if(control.model == val){
                        this.formSet.formSet.dataPermissions.field.name = control.name;
                        this.formSet.formSet.dataPermissions.field.model = control.model;
                        break;
                    }
                }
            },
            saveFormDataPermissions(){
                let dataPermissions = this.formSet.formSet.dataPermissions;
                let groups = dataPermissions.groups;
                if(groups instanceof Array && groups.length >0){
                    let check = this.checkPermissionsGroup(groups);
                    if(!check){
                        this.$message({
                            message: '有部分参数未设置，请设置完善！',
                            type: 'warning'
                        });
                        return;
                    }
                }else {
                    this.formSet.formSet.dataPermissions = null;
                }
                this.saveRemindLoading = true;
                this.$PostJson(this.khConfig.api.saveFormDataPermissionsSet, this.formSet).then(res => {
                    this.saveRemindLoading = false;
                    this.formDataPermissionsSetVisible = false
                    if (res.errCode === 0) {
                        this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });

                    } else {

                    }
                })
            },
            checkPermissionsGroup(groups){
                let check = false;
                if(groups instanceof Array && groups.length >0){
                    for(var i = 0;i<groups.length;i++){
                        let group = groups[i];
                        let operation = group.operation;
                        let recipient = group.recipient;
                        if(operation instanceof Array && operation.length >0 && recipient instanceof Array && recipient.length >0){
                            check = true;
                        }else {
                            check = false;
                            return check;
                        }
                    }
                }
                return check;
            },
            selectFormDataUserControls(){
                let nodes =  this.$refs.tree.getCheckedNodes();
                this.formSet.formSet.dataPermissions.field = {}
                if(nodes instanceof Array && nodes.length>0){
                    this.colsDialogVisible = false;
                    this.formSet.formSet.dataPermissions.field.name = nodes[0].name;
                    this.formSet.formSet.dataPermissions.field.model = nodes[0].model;
                }else {
                    this.$message({
                        message: '请选择！',
                        type: 'warning'
                    });
                }
            },
            // 选择会触发getname方法
            getname() {
                // 获取当节点的值
                var getlist = this.$refs.tree.getCheckedNodes().concat(this.$refs.tree.getHalfCheckedNodes());
                // 循环遍历当前节点的值
                for (var i in getlist) {
                    // 判断子节点是否存在子节点 如果存在直接请求并且提示 false
                    if(!getlist[i].hasOwnProperty("children")) {
                        // 判断是否只选择一个 如果存在直接请求并且提示 false
                        if(getlist.length == 1) {
                            console.log(getlist[0].id)
                        }else {
                            this.$message.error("只选择一个节点");
                            this.$refs.tree.setCheckedKeys([]);
                            return
                        }
                    }else {
                        this.$message.error("只能选择当前分类最后的子分类");
                        this.$refs.tree.setCheckedKeys([]);
                        return
                    }
                }
            }
        }
    };
</script>
<style lang="scss" scoped>
    @import "@/assets/style/form/advanced-widget-set.scss";
    ::v-deep .advanced-set-dialog {
        .el-dialog__body {
            padding: 0px 0px !important;
            background-color: #FFFFFF;
            overflow-y: auto !important;

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
        }

        .el-dialog__header {
            background-color: #EAF1F7;
            border-bottom: 1px solid #E8E8E8;
            padding-left: 10px !important;
            padding-top: 15px !important;
            padding-bottom: 15px !important;
        }

        .el-dialog__footer {
            padding-top: 5px;
            padding-bottom: 5px;
            background-color: #F8F8FA !important;
        }
    }
    .item-condition{
        background-color: #FAFAFA;
        padding: 20px;
        margin-bottom: 20px;
        .item-condition-title{
            font-size: 16px;
        }
    }

</style>

