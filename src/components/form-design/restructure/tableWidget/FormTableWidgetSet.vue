<template>
  <section>
      <el-form label-position="top" v-if="activeName === 'first'">
          <!--列设置-->
          <div class="config-data-item" v-if="item.reportType === 'tableReportWidget'">
              <div class="area-name clearfix">
                  <i v-if="item.data.cols.length!==0" :class="colsVisible ? activeClass : hiddenClass" style="cursor: pointer" @click="colsVisible =! colsVisible"></i>
                  <span> 列设置</span>
                  <el-tooltip v-if="item.data.cols.length!==0" effect="dark" content="清空" :open-delay="500" placement="top">
                      <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px;" @click="onClearItemData('cols')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="添加" :open-delay="500" placement="top">
                      <i class="el-icon-plus" style="float: right;cursor: pointer" @click="openAddColCondFilterDialog('cols')"></i>
                  </el-tooltip>
              </div>
              <el-collapse-transition>
                  <div v-show="colsVisible" :class="item.data.cols.length!==0 ? 'content-box' : 'empty-box'">
                      <span v-if="item.data.cols.length===0" class="empty-span">添加设置至此处</span>
                      <draggable id="cols" v-model="item.data.cols" force-fallback="true" :group="draggableGroup('settings')"
                                 handle=".mover" animation="100" :delay= "100" @start="onStart($event,'cols')" @end="onEnd" :move="onMove" @add="onAdd($event,'cols')">
                          <transition-group :class="item.data.cols.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                              <el-form-item v-for="(col, i) in item.data.cols" :key="col.key ? col.key : col.model ? col.model : col.name">
                                  <advanced-widget-set-item :isDraggable="isDraggable" show-type="cols" :item="col"
                                                            @removeCol="removeCol" @showSaveJumpInfoDialog="showSaveJumpInfoDialog(arguments)" @openSaveExportDialog="openSaveExportDialog"/>
                              </el-form-item>
                          </transition-group>
                      </draggable>
                  </div>
              </el-collapse-transition>
          </div>
          <!--过滤器-->
          <div class="config-data-item">
              <div class="area-name clearfix">
                  <i v-if="item.data.condFilters.length!==0" :class="condFiltersVisible ? activeClass : hiddenClass" style="cursor: pointer" @click="condFiltersVisible =! condFiltersVisible"></i>
                  <span> 过滤器</span>
                  <el-tooltip v-if="item.data.condFilters.length!==0" effect="dark" content="清空" :open-delay="500" placement="top">
                      <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px" @click="onClearItemData('condFilters')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="添加" :open-delay="500" placement="top">
                      <i class="el-icon-plus" style="float: right;cursor: pointer" @click="openAddColCondFilterDialog('condFilters')"></i>
                  </el-tooltip>
              </div>
              <el-collapse-transition>
                  <div v-show="condFiltersVisible" :class="item.data.condFilters.length!==0 ? 'content-box' : 'empty-box'">
                      <span v-if="item.data.condFilters.length===0" class="empty-span">添加设置至此处</span>
                      <draggable id="condFilters" v-model="item.data.condFilters" force-fallback="true" :group="draggableGroup('settings')"
                                 handle=".mover" animation="100" :delay= "100" @start="onStart($event,'condFilters')" @end="onEnd" @add="onAdd($event,'condFilters')">
                          <transition-group :class="item.data.condFilters.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                              <el-form-item v-for="(condFilter, i) in item.data.condFilters" :key="condFilter.key ? condFilter.key : condFilter.model ? condFilter.model : condFilter.name">
                                  <advanced-widget-set-item :isDraggable="isDraggable" :item="condFilter" show-type="condFilters"
                                                            @showCondFilterConfigDialog="showCondFilterConfigDialog" @removeCondFilter="removeCondFilter"/>
                              </el-form-item>
                          </transition-group>
                      </draggable>
                  </div>
              </el-collapse-transition>
          </div>
          <!--操作按钮设置-->
          <div class="config-data-item">
              <div class="area-name clearfix">
                  <i v-if="item.data.optButtons.length!==0" :class="optButtonsVisible ? activeClass : hiddenClass" style="cursor: pointer" @click="optButtonsVisible =! optButtonsVisible"></i>
                  <span> 操作按钮设置</span>
                  <el-tooltip v-if="item.data.optButtons.length!==0" effect="dark" content="清空" :open-delay="500" placement="top">
                      <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px" @click="onClearItemData('optButtons')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="添加" :open-delay="500" placement="top">
                      <i class="el-icon-plus" style="float: right;cursor: pointer" @click="openAddOptButtonDialog"></i>
                  </el-tooltip>
              </div>
              <el-collapse-transition>
                  <div v-show="optButtonsVisible" :class="item.data.optButtons.length!==0 ? 'content-box' : 'empty-box'">
                      <span v-if="item.data.optButtons.length===0" class="empty-span">添加设置至此处</span>
                      <draggable id="optButtons" v-model="item.data.optButtons" force-fallback="true" :group="draggableGroup('optButtons')"
                                 handle=".mover" animation="100" :delay= "100" @start="onStart($event,'optButtons')" @end="onEnd">
                          <transition-group :class="item.data.optButtons.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                              <el-form-item v-for="(optButton, i) in item.data.optButtons" :key="optButton.key">
                                  <advanced-widget-set-item :isDraggable="isDraggable" show-type="optButtons" :item="optButton" :colsArray="colsArray"
                                                            @showSaveJumpInfoDialog="showSaveJumpInfoDialog(arguments)" @removeOptButton="removeOptButton" @openSaveExportDialog="openSaveExportDialog"/>
                              </el-form-item>
                          </transition-group>
                      </draggable>
                  </div>
              </el-collapse-transition>
          </div>
          <!--功能按钮设置-->
          <div class="config-data-item">
              <div class="area-name clearfix">
                  <i v-if="item.data.btns.length!==0" :class="btnsVisible ? activeClass : hiddenClass" style="cursor: pointer" @click="btnsVisible =! btnsVisible"></i>
                  <span> 功能按钮设置</span>
                  <el-tooltip v-if="item.data.btns.length!==0" effect="dark" content="清空" :open-delay="500" placement="top">
                      <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px" @click="onClearItemData('btns')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="添加" :open-delay="500" placement="top">
                      <i class="el-icon-plus" style="float: right;cursor: pointer" @click="openAddBtnDialog"></i>
                  </el-tooltip>
              </div>
              <el-collapse-transition>
                  <div v-show="btnsVisible" :class="item.data.btns.length!==0 ? 'content-box' : 'empty-box'">
                      <span v-if="item.data.btns.length===0" class="empty-span">添加设置至此处</span>
                      <draggable id="btns" v-model="item.data.btns" force-fallback="true" :group="draggableGroup('btns')"
                                 handle=".mover" animation="100" :delay= "100" @start="onStart($event,'btns')" @end="onEnd">
                          <transition-group :class="item.data.btns.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                              <el-form-item v-for="(btn, i) in item.data.btns" :key="btn.key">
                                  <advanced-widget-set-item @showSaveJumpInfoDialog="showSaveJumpInfoDialog(arguments)" @openSaveExportDialog="openSaveExportDialog"
                                                            :isDraggable="isDraggable" show-type="btns" :item="btn"
                                                            @removeBtn="removeBtn"/>
                              </el-form-item>
                          </transition-group>
                      </draggable>
                  </div>
              </el-collapse-transition>
          </div>
          <!--排序设置-->
          <div class="config-data-item">
              <div class="area-name clearfix">
                  <i v-if="item.data.querySort.length!==0" :class="querySortVisible ? activeClass : hiddenClass" style="cursor: pointer" @click="querySortVisible =! querySortVisible"></i>
                  <span> 排序设置</span>
                  <el-tooltip v-if="item.data.querySort.length!==0" effect="dark" content="清空" :open-delay="500" placement="top">
                      <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px" @click="onClearItemData('querySort')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="添加" :open-delay="500" placement="top">
                      <i class="el-icon-plus" style="float: right;cursor: pointer" @click="openAddQuerySortDialog"></i>
                  </el-tooltip>
              </div>
              <el-collapse-transition>
                  <div v-show="querySortVisible" :class="item.data.querySort.length!==0 ? 'content-box' : 'empty-box'">
                      <span v-if="item.data.querySort.length===0" class="empty-span">添加设置至此处</span>
                      <draggable id="querySort" v-model="item.data.querySort" force-fallback="true" :group="draggableGroup('settings')"
                                 handle=".mover" animation="100" :delay= "100" @start="onStart($event,'querySort')" @end="onEnd" @add="onAdd($event,'querySort')">
                          <transition-group :class="item.data.querySort.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                              <el-form-item v-for="(querySort, i) in item.data.querySort" :key="querySort.key ? querySort.key :querySort.model ? querySort.model : querySort.name">
                                  <advanced-widget-set-item :isDraggable="isDraggable" show-type="querySort" :item="querySort" :colsArray="colsArray"
                                                            @removeQuerySort="removeQuerySort"/>
                              </el-form-item>
                          </transition-group>
                      </draggable>
                  </div>
              </el-collapse-transition>
          </div>
          <!--联动设置-->
          <div class="config-data-item">
              <div class="area-name clearfix">
                  <span> 联动设置</span>
              </div>
              <el-switch
                  v-model="item.data.allowLinkage"
              >
              </el-switch>
          </div>
          <!--导入设置-->
          <div class="config-data-item">
              <div class="area-name clearfix">
                  <i v-if="item.data.reportSettings.importSettings.list.length!==0" :class="importVisible ? activeClass : hiddenClass" style="cursor: pointer" @click="importVisible =! importVisible"></i>
                  <span> 导入设置</span>
                  <el-tooltip v-if="item.data.reportSettings.importSettings.list.length!==0" effect="dark" content="清空" :open-delay="500" placement="top">
                      <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px" @click="onClearItemData('import')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="添加" :open-delay="500" placement="top">
                      <i class="el-icon-plus" style="float: right;cursor: pointer" @click="openAddReportSettingDialog('import')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="设置" :open-delay="500" placement="top">
                      <i class="el-icon-setting" style="float: right;cursor: pointer;margin-right: 5px" @click="openReportSettingConfigDialog('import')"></i>
                  </el-tooltip>
              </div>
              <el-collapse-transition>
                  <div v-show="importVisible" :class="item.data.reportSettings.importSettings.list.length!==0 ? 'content-box' : 'empty-box'">
                      <span v-if="item.data.reportSettings.importSettings.list.length===0" class="empty-span">添加设置至此处</span>
                      <draggable id="import" v-model="item.data.reportSettings.importSettings.list" force-fallback="true" :group="draggableGroup('settings')"
                                 handle=".mover" animation="100" :delay= "100" @start="onStart($event,'import')" @end="onEnd" @add="onAdd($event,'import')">
                          <transition-group :class="item.data.reportSettings.importSettings.list.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                              <el-form-item v-for="(listItem, i) in item.data.reportSettings.importSettings.list" :key="listItem.key ? listItem.key : listItem.model ? listItem.model : listItem.name">
                                  <advanced-widget-set-item :isDraggable="isDraggable" show-type="import" :item="listItem" @setImportExcelName="setImportExcelName"
                                                            @removeImportSetting="removeImportSetting"/>
                              </el-form-item>
                          </transition-group>
                      </draggable>
                  </div>
              </el-collapse-transition>
          </div>
          <!--导出设置-->
          <div class="config-data-item">
              <div class="area-name clearfix">
                  <i v-if="item.data.reportSettings.exportSettings.list.length!==0" :class="exportVisible ? activeClass : hiddenClass" style="cursor: pointer" @click="exportVisible =! exportVisible"></i>
                  <span> 导出设置</span>
                  <el-tooltip v-if="item.data.reportSettings.exportSettings.list.length!==0" effect="dark" content="清空" :open-delay="500" placement="top">
                      <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px" @click="onClearItemData('export')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="添加" :open-delay="500" placement="top">
                      <i class="el-icon-plus" style="float: right;cursor: pointer" @click="openAddReportSettingDialog('export')"></i>
                  </el-tooltip>
                  <el-tooltip effect="dark" content="设置" :open-delay="500" placement="top">
                      <i class="el-icon-setting" style="float: right;cursor: pointer;margin-right: 5px" @click="openReportSettingConfigDialog('export')"></i>
                  </el-tooltip>
              </div>
              <el-collapse-transition>
                  <div v-show="exportVisible" :class="item.data.reportSettings.exportSettings.list.length!==0 ? 'content-box' : 'empty-box'">
                      <span v-if="item.data.reportSettings.exportSettings.list.length===0" class="empty-span">添加设置至此处</span>
                      <draggable id="export" v-model="item.data.reportSettings.exportSettings.list" force-fallback="true" :group="draggableGroup('settings')"
                                 handle=".mover" animation="100" :delay= "100" @start="onStart($event,'export')" @end="onEnd" @add="onAdd($event,'export')">
                          <transition-group :class="item.data.reportSettings.exportSettings.list.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                              <el-form-item v-for="(listItem, i) in item.data.reportSettings.exportSettings.list" :key="listItem.key ? listItem.key : listItem.model ? listItem.model : listItem.name">
                                  <advanced-widget-set-item :isDraggable="isDraggable" show-type="export" :item="listItem"
                                                            @removeExportSetting="removeExportSetting"/>
                              </el-form-item>
                          </transition-group>
                      </draggable>
                  </div>
              </el-collapse-transition>
          </div>
          <!--显示设置-->
          <div class="config-data-item">
              <div class="area-name clearfix">
                  <span>显示设置</span>
                  <el-tooltip effect="dark" content="设置" :open-delay="500" placement="top">
                      <i class="el-icon-setting" style="float: right;cursor: pointer;margin-right: 5px" @click="openShowTypeConfigDialog"></i>
                  </el-tooltip>
              </div>
              <div class="content-box">
                  <!-- <div style="border: 1px solid #f1da5b;height: 35px;font-size: 12px;line-height: 35px;padding-left: 5px">
                      <span style="color: #fff">新增页面设置：</span>
                      <span style="color: #fff" v-text="addShowType"></span>
                  </div> -->
                  <div style="border: 1px solid #f1905b;height: 35px;margin-top: 5px;font-size: 12px;line-height: 35px;padding-left: 5px">
                      <span style="color: #fff">子表单设置：</span>
                      <span style="color: #fff" v-text="tableShowType"></span>
                  </div>
              </div>
          </div>
      </el-form>
      <!--样式设置-->
      <el-collapse v-model="tableActiveNames" v-if="activeName === 'second'">
          <el-collapse-item title="基础信息" name="1">
              <el-form label-position="top" class="secondary-font-color report-set-margin-let">
                  <div class="secondary-font-color" style="margin-top: 10px">控件</div>
                  <div style="margin-bottom: 10px">
                      <span class="secondary-font-color">背景颜色</span>
                      <el-color-picker v-model="item.backgroundColor" show-alpha></el-color-picker>
                      <span class="secondary-font-color">边框颜色</span>
                      <el-color-picker v-model="item.borderColor" show-alpha></el-color-picker>
                  </div>
                  <div class="secondary-font-color" style="margin-top: 10px">填充边距</div>
                  <div style="margin-bottom: 10px">
                      <el-tooltip effect="dark" content="上内边距">
                          <el-input-number v-model="item.paddingTop" style="width: 20%"></el-input-number>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="右内边">
                          <el-input-number v-model="item.paddingRight" style="width: 20%"></el-input-number>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="下内边距">
                          <el-input-number v-model="item.paddingBottom" style="width: 20%"></el-input-number>
                      </el-tooltip>
                      <el-tooltip effect="dark" content="左内边距">
                          <el-input-number v-model="item.paddingLeft" style="width: 20%"></el-input-number>
                      </el-tooltip>
                  </div>
                  <el-checkbox v-model="item.style.mainTitleVisiable"
                               class="secondary-font-color">
                      显示主标题/备注
                  </el-checkbox>
                  <!--   <div>
                       <span class="secondary-font-color">背景颜色</span>
                       <el-color-picker v-model="item.style.backgroundColor"></el-color-picker>
                     </div>-->
                  <div class="secondary-font-color" style="margin-top: 10px">主标题</div>
                  <div style="margin-bottom: 10px">
                      <el-input style="width: 90%" v-model="item.style.mainTitle"></el-input>
                      <el-color-picker v-model="item.style.mainTitleColor" show-alpha></el-color-picker>
                  </div>
                  <el-checkbox v-model="item.style.showSerialNum" class="secondary-font-color">
                      显示序号
                  </el-checkbox>
                  <el-form-item label="">
                      <el-checkbox v-model="item.style.pagination" class="secondary-font-color">
                          显示分页
                      </el-checkbox>
                      <el-select v-model="item.style.pageSize" placeholder="请选择"
                                 style="width: 100px"
                                 class="report-set-style imageMarginTop"
                                 :popper-append-to-body="false" value="">
                          <el-option
                              v-for="item in Constants.tablePaginationOptions"
                              :key="item.value"
                              :label="item.label"
                              :value="item.value">
                          </el-option>
                      </el-select>
                      <span class="secondary-font-color">条/页</span>
                  </el-form-item>
              </el-form>
          </el-collapse-item>
          <el-collapse-item title="样式设置" name="2">
              <el-form label-position="top" class="secondary-font-color report-set-margin-let">
                  <el-form-item label="表格边框" v-if="item.style.tableBorderStyle">
                      <el-select v-model="item.style.tableBorderStyle.boderSize"
                                 :popper-append-to-body="false" style="width: 35%">
                          <el-option v-for="item in Constants.borderWidthOptions"
                                     :key="item.value" :label="item.label"
                                     :value="item.value"></el-option>
                      </el-select>
                      <el-color-picker v-model="item.style.tableBorderStyle.boderColor" show-alpha></el-color-picker>
                  </el-form-item>
                  <el-form-item label="按钮设置" v-if="item.style.tableBorderStyle">
                      <el-color-picker v-model="item.style.tableBorderStyle.btnBgColor" show-alpha></el-color-picker>
                      <el-color-picker v-model="item.style.tableBorderStyle.btnFontColor" show-alpha></el-color-picker>
                      <el-checkbox v-model="item.style.tableBorderStyle.btnRound">圆角按钮</el-checkbox>
                  </el-form-item>
                  <el-row v-if="item.style.tableBorderStyle">
                      <span>显示斑马纹</span>
                      <el-checkbox v-model="item.style.tableBorderStyle.stripe"></el-checkbox>
                  </el-row>
                  <el-divider></el-divider>
                  <el-form-item label="表头样式" >
                      <div style="margin-left: 10px">
                          字体大小/颜色 <el-select v-model="item.style.tableHeaderStyle.cellFontSize"
                                             :popper-append-to-body="false" style="width: 35%">
                          <el-option v-for="item in Constants.viceValueSizeOptions"
                                     :key="item.value" :label="item.label"
                                     :value="item.value"></el-option>
                      </el-select>
                          <el-color-picker v-model="item.style.tableHeaderStyle.cellColor" show-alpha></el-color-picker>
                          <el-form-item label="标题位置" >
                              <el-radio-group v-model="item.style.tableHeaderStyle.cellPosition"
                                              class="table-set-radio-button report-set-radio-button">
                                  <el-radio label="left" border>
                                      <el-tooltip effect="dark" content="左" placement="top">
                                          <i class="icon iconfont icon-icon--1"></i>
                                      </el-tooltip>
                                  </el-radio>
                                  <el-radio label="center" border>
                                      <el-tooltip effect="dark" content="中" placement="top">
                                          <i class="icon iconfont icon-shanchu-fangkuang"></i>
                                      </el-tooltip>
                                  </el-radio>
                                  <el-radio label="right" border>
                                      <el-tooltip effect="dark" content="右" placement="top">
                                          <i class="icon iconfont icon-icon--"></i>
                                      </el-tooltip>
                                  </el-radio>
                              </el-radio-group>
                          </el-form-item>
                          <el-form-item label="表头网格" >
                              <el-row :span="24">
                                  <el-col :span="24">
                                      左右 <el-select v-model="item.style.tableHeaderStyle.borderRight"
                                                    :popper-append-to-body="false" style="width: 35%">
                                      <el-option v-for="item in Constants.borderWidthOptions"
                                                 :key="item.value" :label="item.label"
                                                 :value="item.value"></el-option>
                                  </el-select>
                                      上下<el-select v-model="item.style.tableHeaderStyle.borderBottom"
                                                   :popper-append-to-body="false" style="width: 35%">
                                      <el-option v-for="item in Constants.borderWidthOptions"
                                                 :key="item.value" :label="item.label"
                                                 :value="item.value"></el-option>
                                  </el-select>
                                      <el-color-picker  v-model="item.style.tableHeaderStyle.cellBorderColor" show-alpha></el-color-picker>

                                  </el-col>

                              </el-row>
                          </el-form-item>
                          <div>
                              背景色 <el-color-picker v-model="item.style.tableHeaderStyle.backgroundColor" show-alpha></el-color-picker>
                          </div>
                          <div style="margin-top: 10px">
                              表头单元格高度
                              <el-input class="query-widget-style" style="width: 150px"
                                        placeholder="数值"
                                        type="number"
                                        v-model="item.style.tableHeaderStyle.cellHeight"
                              >
                              </el-input>
                              px
                          </div>
                      </div>
                  </el-form-item>
                  <el-divider></el-divider>
                  <el-form-item label="表内容样式" >
                      <div style="margin-left: 10px">
                          字体大小/颜色 <el-select v-model="item.style.tableBodyStyle.cellFontSize"
                                             :popper-append-to-body="false" style="width: 35%">
                          <el-option v-for="item in Constants.viceValueSizeOptions"
                                     :key="item.value" :label="item.label"
                                     :value="item.value"></el-option>
                      </el-select>
                          <el-color-picker v-model="item.style.tableBodyStyle.cellColor" show-alpha></el-color-picker>
                          <el-form-item label="表内容位置" >
                              <el-radio-group v-model="item.style.tableBodyStyle.cellPosition"
                                              class="table-set-radio-button report-set-radio-button">
                                  <el-radio label="left" border>
                                      <el-tooltip effect="dark" content="左" placement="top">
                                          <i class="icon iconfont icon-icon--1"></i>
                                      </el-tooltip>
                                  </el-radio>
                                  <el-radio label="center" border>
                                      <el-tooltip effect="dark" content="中" placement="top">
                                          <i class="icon iconfont icon-shanchu-fangkuang"></i>
                                      </el-tooltip>
                                  </el-radio>
                                  <el-radio label="right" border>
                                      <el-tooltip effect="dark" content="右" placement="top">
                                          <i class="icon iconfont icon-icon--"></i>
                                      </el-tooltip>
                                  </el-radio>
                              </el-radio-group>
                          </el-form-item>
                          <el-form-item label="网格边框" >
                              <el-row :span="24">
                                  <el-col :span="24">
                                      左右 <el-select v-model="item.style.tableBodyStyle.borderRight"
                                                    :popper-append-to-body="false" style="width: 35%">
                                      <el-option v-for="item in Constants.borderWidthOptions"
                                                 :key="item.value" :label="item.label"
                                                 :value="item.value"></el-option>
                                  </el-select>
                                      上下<el-select v-model="item.style.tableBodyStyle.borderBottom"
                                                   :popper-append-to-body="false" style="width: 35%">
                                      <el-option v-for="item in Constants.borderWidthOptions"
                                                 :key="item.value" :label="item.label"
                                                 :value="item.value"></el-option>
                                  </el-select>
                                      <el-color-picker  v-model="item.style.tableBodyStyle.cellBorderColor" show-alpha></el-color-picker>

                                  </el-col>

                              </el-row>
                          </el-form-item>
                          <el-row :span="24">

                              <el-col :span="8" >
                                  背景色 <el-color-picker v-model="item.style.tableBodyStyle.backgroundColor" show-alpha></el-color-picker>
                              </el-col>
                              <el-col :span="8">
                                  鼠标悬浮背景色 <el-color-picker v-model="item.style.tableBodyStyle.backgroundColorHover" show-alpha></el-color-picker>
                              </el-col>
                          </el-row>
                          <div style="margin-top: 10px">
                              表内容单元格高度
                              <el-input class="query-widget-style" style="width: 150px"
                                        placeholder="数值"
                                        type="number"
                                        v-model="item.style.tableBodyStyle.cellHeight"
                              >
                              </el-input>
                              px
                          </div>
                          <el-form-item label="操作列" >
                              <div >
                                  字体大小/颜色 <el-select v-model="item.style.tableBodyStyle.optFontSize"
                                                     :popper-append-to-body="false" style="width: 35%">
                                  <el-option v-for="item in Constants.viceValueSizeOptions"
                                             :key="item.value" :label="item.label"
                                             :value="item.value"></el-option>
                              </el-select>
                                  <el-color-picker v-model="item.style.tableBodyStyle.optColor" show-alpha></el-color-picker>
                                  <el-row :span="24">
                                      <el-col :span="12">
                                          <el-form-item label="按钮边框">
                                              <el-select v-model="item.style.tableBodyStyle.optBoder"
                                                         :popper-append-to-body="false" style="width: 50%">
                                                  <el-option v-for="item in Constants.borderWidthOptions"
                                                             :key="item.value" :label="item.label"
                                                             :value="item.value"></el-option>
                                              </el-select>
                                              <el-color-picker v-model="item.style.tableBodyStyle.optBoderColor" show-alpha></el-color-picker>
                                          </el-form-item>
                                      </el-col>
                                      <el-col :span="12">
                                          <el-form-item label="圆角/背景色">
                                              <el-select v-model="item.style.tableBodyStyle.optBorderRadius"
                                                         :popper-append-to-body="false" style="width: 50%">
                                                  <el-option v-for="item in Constants.borderRadiusOptions"
                                                             :key="item.value" :label="item.label"
                                                             :value="item.value"></el-option>
                                              </el-select>
                                              <el-color-picker v-model="item.style.tableBodyStyle.optBgColor" show-alpha></el-color-picker>
                                          </el-form-item>
                                      </el-col>

                                  </el-row>

                              </div>
                          </el-form-item>
                      </div>
                  </el-form-item>
                  <el-divider></el-divider>
                  <el-form-item label="分页样式" v-if="item.style.tablePaginationStyle">
                      <div style="margin-left: 10px">
                          字体颜色
                          <el-color-picker v-model="item.style.tablePaginationStyle.fontColor" show-alpha></el-color-picker>
                          <el-row :span="24">
                              <el-col :span="12">
                                  <el-form-item label="非选中按钮样式">
                                      <el-color-picker v-model="item.style.tablePaginationStyle.buttonStyle.backgroundColor" show-alpha></el-color-picker>
                                      <el-color-picker v-model="item.style.tablePaginationStyle.buttonStyle.fontColor" show-alpha></el-color-picker>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label="选中按钮样式">
                                      <el-color-picker v-model="item.style.tablePaginationStyle.buttonActiveStyle.backgroundColor" show-alpha></el-color-picker>
                                      <el-color-picker v-model="item.style.tablePaginationStyle.buttonActiveStyle.fontColor" show-alpha></el-color-picker>
                                  </el-form-item>
                              </el-col>

                          </el-row>
                          <el-row :span="24">
                              <el-col :span="12">
                                  <el-form-item label="输入框样式">
                                      <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.backgroundColor" show-alpha></el-color-picker>
                                      <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.fontColor" show-alpha></el-color-picker>
                                  </el-form-item>
                              </el-col>
                              <el-col :span="12">
                                  <el-form-item label="输入框边框样式">
                                      <el-select v-model="item.style.tablePaginationStyle.inputStyle.borderWidth"
                                                 :popper-append-to-body="false" style="width: 50%">
                                          <el-option v-for="item in Constants.borderWidthOptions"
                                                     :key="item.value" :label="item.label"
                                                     :value="item.value"></el-option>
                                      </el-select>
                                      <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.borderColor" show-alpha></el-color-picker>
                                  </el-form-item>
                              </el-col>
                          </el-row>
                      </div>
                  </el-form-item>
              </el-form>
          </el-collapse-item>
          <el-collapse-item title="列宽设置" name="3">
              <template v-for="(col,index) in item.data.cols">
                  <div style="margin-top: 10px;color: white" v-if="col.key != '$seq'">
                      <el-tooltip class="item" effect="dark" :content="col.alias?col.alias:col.name" placement="top">
                          <div class="colTitle"> {{col.alias?col.alias:col.name}}</div>
                      </el-tooltip>

                      <el-input class="query-widget-style" style="width: 150px"
                                placeholder="数值"
                                type="number"
                                v-model="col.width"
                      >
                      </el-input>
                      px
                  </div>
              </template>
          </el-collapse-item>
      </el-collapse>
  </section>
</template>

<script>
  import AdvancedWidgetSetItem from "@/components/form-design/restructure/AdvancedWidgetSetItem";
  import draggable from 'vuedraggable'

  export default {
    name: "FormTableWidgetSet",
    components: {
      AdvancedWidgetSetItem,draggable
    },

    created() {
      this.initProperties();
    },

    computed: {
      addShowType() {
        if (this.item.showType.addShowType === 'pop') {
          return '弹窗';
        } else if (this.item.showType.addShowType === 'normal') {
          return '普通页面';
        } else if (this.item.showType.addShowType === 'full') {
          return '全屏页面';
        }
      },
      tableShowType() {
        if (this.item.showType.tableShowType === 'transverse') {
          return '横向';
        } else if (this.item.showType.tableShowType === 'portrait') {
          return '纵向';
        }
      },
      draggableGroup() {
        return function (name) {
          let group = {};
          group.name = name;
          group.pull = (e) => {
            if (this.currDragType === e.options.id) {
              return true;
            } else {
              return false;
            }
          };
          return group;
        };
      }
    },

    props: {
      item: {type: Object},
      activeName: {type: String},
      currDragItem: {type: Object},
        colsArray: {type: Array},
    },

    data() {
      return {
        isDraggable: false,
        index: '',
        tableActiveNames: ['1'],
        renameVisible: false,
        refreshTableDrill: true,
        configDialogVisible: false,  //列设置-过滤器的对话框显示
        configType: '', //类型（列设置、过滤器）
        optButtonDialogVisible: false, //操作按钮对话框显示
        colsVisible: true,
        condFiltersVisible: true,
        optButtonsVisible: true,
        btnsVisible: true,
        querySortVisible: true,
        importVisible: true,
        exportVisible: true,
        currDragType: '',
        activeClass: ['el-collapse-item__arrow', 'el-icon-arrow-right', 'is-active'],
        hiddenClass: ['el-collapse-item__arrow', 'el-icon-arrow-right']
      };
    },

    methods: {
      
      initProperties() {
        if (!this.item.hasOwnProperty('showType')) {
          this.$set(this.item, 'showType', {
            addShowType: "pop",
            tableShowType: "transverse"
          });
        }
      },
      //打开列设置对话框
      openAddColCondFilterDialog(type) {
        this.$emit('showAddColCondFilterDialog', type);
      },
      //打开操作按钮对话框
      openAddOptButtonDialog() {
        this.$emit('showAddOptButtonDialog');
      },
      openReportSettingConfigDialog(type) {
        this.$emit('showReportSettingConfigDialog', type);
      },
      removeCol(item) {
        this.$emit('removeCol', item);
      },
      removeCondFilter(item) {
        this.$emit('removeCondFilter', item);
      },
      openAddQuerySortDialog() {
        this.$emit('showAddQuerySortDialog');
      },
      openAddReportSettingDialog(type) {
        this.$emit('showAddReportSettingDialog', type);
      },
      showCondFilterConfigDialog(item) {
        this.$emit('showCondFilterConfigDialog', item);
      },
        openSaveExportDialog(item){
            this.$emit('openSaveExportDialog', item);
        },
      openAddBtnDialog() {
        this.$emit('showAddBtnDialog');
      },
      removeBtn(item) {
        this.$emit('removeBtn', item);
      },
      removeOptButton(item) {
        this.$emit('removeOptButton', item);
      },
      removeQuerySort(item) {
        this.$emit('removeQuerySort', item);
      },
      removeImportSetting(item) {
        this.$emit('removeImportSetting', item);
      },
      removeExportSetting(item) {
        this.$emit('removeExportSetting', item);
      },
      showSaveJumpInfoDialog(args) {
        this.$emit('showSaveJumpInfoDialog', args[0], args[1]);
      },
      openShowTypeConfigDialog() {
        this.$emit('openShowTypeConfigDialog');
      },
      setImportExcelName(callback) {
        callback(this.item.data.reportSettings.importSettings.list);
      },
      //清空数据
      onClearItemData(type) {
        let typeContent;
        if (type === 'cols') {
          typeContent = '列设置';
        } else if (type === 'condFilters') {
          typeContent = '过滤器';
        } else if (type === 'optButtons') {
          typeContent = '操作按钮设置';
        } else if (type === 'btns') {
          typeContent = '功能按钮设置';
        } else if (type === 'querySort') {
          typeContent = '排序设置';
        } else if (type === 'import') {
          typeContent = '导入设置';
        } else if (type === 'export') {
          typeContent = '导出设置';
        }
        const h = this.$createElement;
        this.$msgbox({
          title: '提示',
          message: h('div', {style: "display: flex;flex-direction: row;align-items: center"},
              [
                h('i', {
                  class: 'el-icon-warning',
                  style: "margin-right: 10px;font-size: 1.7em;color: #E6A23C"
                }),
                h('span', {style: 'font-size: 13px'}, '删除'),
                h('span', {style: "color: #CE1221;font-size: 16px"}, `${typeContent}`),
                h('span', {style: 'font-size: 13px'}, '下的所有数据, 是否继续?')
              ]),
          showCancelButton: true,
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        }).then(action => {
          if (type === 'cols') {
            this.colsVisible = true;
            this.$nextTick(() => {
              this.$set(this.item.data, 'cols', []);
            });
          } else if (type === 'condFilters') {
            this.condFiltersVisible = true;
            this.$nextTick(() => {
              this.$set(this.item.data, 'condFilters', []);
            });
          } else if (type === 'optButtons') {
            this.optButtonsVisible = true;
            this.$nextTick(() => {
              this.$set(this.item.data, 'optButtons', []);
            });
          } else if (type === 'btns') {
            this.btnsVisible = true;
            this.$nextTick(() => {
              this.$set(this.item.data, 'btns', []);
            });
          } else if (type === 'querySort') {
            this.querySortVisible = true;
            this.$nextTick(() => {
              this.$set(this.item.data, 'querySort', []);
            });
          } else if (type === 'import') {
            this.importVisible = true;
            this.$nextTick(() => {
              this.$set(this.item.data.reportSettings.importSettings, 'list', []);
            });
          } else if (type === 'export') {
            this.exportVisible = true;
            this.$nextTick(() => {
              this.$set(this.item.data.reportSettings.exportSettings, 'list', []);
            });
          }
          this.$message({
            showClose: true,
            type: 'success',
            message: '删除成功!'
          });
        });
      },
      //数据拖拽
      onStart(e,type) {
        this.currDragType = type;
        this.isDraggable = true;
      },
      onEnd(e) {
        this.isDraggable = false;
      },
      onMove(e) {
        if (e.relatedContext.element.key == '$seq' || e.relatedContext.element.key === '$opt') return false;
        return true;
      },
      onAdd(e, type) {
        let node = this.currDragItem.node;
        let data = this.currDragItem.data;
        let newIndex = e.newIndex;
        if (type === 'cols') {
          this.item.data.cols.splice(newIndex, 1);
          this.addToCols(newIndex);
        } else if (type === 'condFilters') {
          this.item.data.condFilters.splice(newIndex, 1);
          this.addToCondFilters(newIndex);
        } else if (type === 'querySort') {
          this.item.data.querySort.splice(newIndex, 1);
          this.addToQuerySort(newIndex);
        } else if (type === 'import') {
          this.item.data.reportSettings.importSettings.list.splice(newIndex, 1);
          this.addToImportSettingList(newIndex);
        } else if (type === 'export') {
          this.item.data.reportSettings.exportSettings.list.splice(newIndex, 1);
          this.addToExportSettingList(newIndex);
        }
      },
      addToCols(newIndex) {

        if (!this.handleAddAllLeafNodeToItemData('cols')) {
          let col = {};
          if (this.currDragItem.data.key === 'seq' || this.currDragItem.data.key === 'opt') {
            col.key = '$' + this.currDragItem.data.key;
          } else {
            col.key = this.currDragItem.data.model;
          }
          col.name = this.currDragItem.data.name;
          col.alias = this.currDragItem.data.name;
          col.isJump = false;
          if (!this.checkIfExist(col, 'cols')) {
            this.handleColPush(col, newIndex);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          } else {
            this.$message({showClose: true, type: "warning", message: "已存在该字段"});
          }
        }
      },
      handleColPush(item, newIndex) {
        if (item.key === '$seq') {
          this.$delete(item, 'model');
          this.item.data.cols.unshift(item);
        } else {
          let optExist = false;
          for (let i = 0; i < this.item.data.cols.length; i++) {
            let col = this.item.data.cols[i];
            if (col.key === '$opt') {
              optExist = true;
            }
          }
          if (optExist) {
            if (newIndex === this.item.data.cols.length || !newIndex) {
              this.item.data.cols.splice(this.item.data.cols.length - 1, 0, item);
            } else {
              this.item.data.cols.splice(newIndex, 0, item);
            }
          } else {
            if (item.key === '$opt') {
              this.$delete(item, 'model');
              this.item.data.cols.push(item);
            } else {
              this.item.data.cols.push(item);
            }
          }
        }
      },
      addToCondFilters(newIndex) {
        if (!this.handleAddAllLeafNodeToItemData('condFilters')) {
          if (!this.checkIsSeqOrOpt()) {
            let condFilter = {};
            condFilter.name = this.currDragItem.data.name;
            condFilter.widget = this.currDragItem.data.widget;
            condFilter.model = this.currDragItem.data.model;
            condFilter.type = this.currDragItem.data.type;
            condFilter.dataType = this.initCondFilterDataType(this.currDragItem.data);
            this.initCondFilterField(condFilter);
            if (!this.checkIfExist(condFilter, 'condFilters')) {
              this.item.data.condFilters.splice(newIndex, 0, condFilter);
              this.$message({showClose: true, type: "success", message: "添加成功"});
            } else {
              this.$message({showClose: true, type: "warning", message: "已存在该字段"});
            }
          }
        }
      },
      addToQuerySort(newIndex) {
        if (!this.handleAddAllLeafNodeToItemData('querySort')) {
          if (!this.checkIsSeqOrOpt()) {
            let querySort = {};
            querySort.key = this.currDragItem.data.model;
            querySort.name = this.currDragItem.data.name;
            querySort.sort = 0;
            if (!this.checkIfExist(querySort, 'querySort')) {
              this.item.data.querySort.splice(newIndex, 0, querySort);
              this.$message({showClose: true, type: "success", message: "添加成功"});
            } else {
              this.$message({showClose: true, type: "warning", message: "已存在该字段"});
            }
          }
        }
      },
      addToImportSettingList(newIndex) {
        if (!this.handleAddAllLeafNodeToItemData('import')) {
          if (!this.checkIsSeqOrOpt()) {
            let listItem = {};
            listItem.model = this.currDragItem.data.model;
            listItem.name = this.currDragItem.data.name;
            listItem.excelName = this.currDragItem.data.name;
            if (!this.checkIfExist(listItem, 'import')) {
              this.item.data.reportSettings.importSettings.list.splice(newIndex, 0, listItem);
              this.$message({showClose: true, type: "success", message: "添加成功"});
            } else {
              this.$message({showClose: true, type: "warning", message: "已存在该字段"});
            }
          }
        }
      },
      addToExportSettingList(newIndex) {
        if (!this.handleAddAllLeafNodeToItemData('export')) {
          if (!this.checkIsSeqOrOpt()) {
            let listItem = {};
            listItem.model = this.currDragItem.data.model;
            listItem.name = this.currDragItem.data.name;
            listItem.excelName = this.currDragItem.data.name;
            if (!this.checkIfExist(listItem, 'export')) {
              this.item.data.reportSettings.exportSettings.list.splice(newIndex, 0, listItem);
              this.$message({showClose: true, type: "success", message: "添加成功"});
            } else {
              this.$message({showClose: true, type: "warning", message: "已存在该字段"});
            }
          }
        }
      },
      checkIsSeqOrOpt() {
        if (this.currDragItem.data.model === '$seq' || this.currDragItem.data.model === '$opt') {
          this.$message({
            type: 'warning',
            message: '不支持添加该字段'
          });
          return true;
        }
        return false;
      },
      checkIfExist(item, type) {
        let exist = false;
        if (type === 'cols') {
          for (let i = 0; i < this.item.data.cols.length; i++) {
            let col = this.item.data.cols[i];
            if (col.key === item.key) {
              exist = true;
              break;
            }
          }
        } else if (type === 'condFilters') {
          for (let i = 0; i < this.item.data.condFilters.length; i++) {
            let condFilter = this.item.data.condFilters[i];
            if (condFilter.model === item.model) {
              exist = true;
              break;
            }
          }
        } else if (type === 'querySort') {
          for (let i = 0; i < this.item.data.querySort.length; i++) {
            let querySort = this.item.data.querySort[i];
            if (querySort.key === item.key) {
              exist = true;
              break;
            }
          }
        } else if (type === 'import') {
          for (let i = 0; i < this.item.data.reportSettings.importSettings.list.length; i++) {
            let listItem = this.item.data.reportSettings.importSettings.list[i];
            if (listItem.model === item.model) {
              exist = true;
              break;
            }
          }
        } else if (type === 'export') {
          for (let i = 0; i < this.item.data.reportSettings.exportSettings.list.length; i++) {
            let listItem = this.item.data.reportSettings.exportSettings.list[i];
            if (listItem.model === item.model) {
              exist = true;
              break;
            }
          }
        }
        return exist;
      },
      handleAddAllLeafNodeToItemData(type) {
        if (this.currDragItem.data.children) {
          if (type === 'cols') {
            let existNames = [];
            for (let i = 0; i < this.currDragItem.data.children.length; i++) {
              let child = this.currDragItem.data.children[i];
              let col = {};
              if (child.key === 'seq' || child.key === 'opt') {
                col.key = '$' + child.key;
              } else {
                col.key = child.model;
              }
              col.name = child.name;
              col.alias = child.name;
              col.isJump = false;
              if (!this.checkIfExist(col, 'cols')) {
                this.handleColPush(col);
              } else {
                existNames.push(child.name);
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          } else if (type === 'condFilters') {
            let existNames = [];
            for (let i = 0; i < this.currDragItem.data.children.length; i++) {
              let child = this.currDragItem.data.children[i];
              if (child.model !== '$seq' && child.model !== '$opt') {
                let condFilter = {};
                condFilter.name = child.name;
                condFilter.widget = child.widget;
                condFilter.model = child.model;
                condFilter.type = child.type;
                condFilter.dataType = this.initCondFilterDataType(child);
                this.initCondFilterField(condFilter);
                if (!this.checkIfExist(condFilter, 'condFilters')) {
                  this.item.data.condFilters.push(condFilter);
                } else {
                  existNames.push(child.name);
                }
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          } else if (type === 'querySort') {
            let existNames = [];
            for (let i = 0; i < this.currDragItem.data.children.length; i++) {
              let child = this.currDragItem.data.children[i];
              if (child.model !== '$seq' && child.model !== '$opt') {
                let querySort = {};
                querySort.key = child.model;
                querySort.name = child.name;
                querySort.sort = 0;
                if (!this.checkIfExist(querySort, 'querySort')) {
                  this.item.data.querySort.push(querySort);
                } else {
                  existNames.push(child.name);
                }
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          } else if (type === 'import') {
            let existNames = [];
            for (let i = 0; i < this.currDragItem.data.children.length; i++) {
              let child = this.currDragItem.data.children[i];
              if (child.model !== '$seq' && child.model !== '$opt') {
                let listItem = {};
                listItem.model = child.model;
                listItem.name = child.name;
                listItem.excelName = child.name;
                if (!this.checkIfExist(listItem, 'import')) {
                  this.item.data.reportSettings.importSettings.list.push(listItem);
                } else {
                  existNames.push(child.name);
                }
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          } else if (type === 'export') {
            let existNames = [];
            for (let i = 0; i < this.currDragItem.data.children.length; i++) {
              let child = this.currDragItem.data.children[i];
              if (child.model !== '$seq' && child.model !== '$opt') {
                let listItem = {};
                listItem.model = child.model;
                listItem.name = child.name;
                listItem.excelName = child.name;
                if (!this.checkIfExist(listItem, 'export')) {
                  this.item.data.reportSettings.exportSettings.list.push(listItem);
                } else {
                  existNames.push(child.name);
                }
              }
            }
            if (existNames.length > 0) {
              this.$message({
                showClose: true,
                type: 'warning',
                message: `已存在字段：${existNames.join(',')}`
              });
            } else {
              this.$message({showClose: true, type: "success", message: "添加成功"});
            }
          }
          return true;
        }
        return false;
      },
      //初始化过滤器的数据类型
      initCondFilterDataType(colsArrayItem) {
        let type = colsArrayItem.type;
        let model = colsArrayItem.model;
        let dataType;
        if (type.indexOf('int') >= 0 || type.indexOf('number') >= 0 || type.indexOf('long') >= 0 || model === 'lat' || model === 'lnt') {
          dataType = 'Number';
        } else if (type === 'date') {
          dataType = 'Date';
        } else if (type === 'datetime') {
          dataType = 'Date';
        } else if (type === 'year_month') {
          dataType = 'Date';
        } else if (type === 'year') {
          dataType = 'Date';
        } else if (type === 'month') {
          dataType = 'Date';
        } else if (type === 'time') {
          dataType = 'Date';
        } else {
          dataType = 'String';
        }
        return dataType;
      },
      initCondFilterField(condFilter) {
        if (condFilter.dataType === 'String') {
          if (condFilter.type === 'radio' || condFilter.type === 'checkbox' || condFilter.type === 'switch' || condFilter.type === 'multiple_select' || condFilter.type === 'select') {
            condFilter.filterType = 1;
            condFilter.condType = 1;
            condFilter.conds1 = [];
          } else if (condFilter.type === 'user_select' || condFilter.type === 'org_select' || condFilter.type === 'role_select' || condFilter.type === 'dic_select' || condFilter.type === 'data_select') {
            condFilter.filterType = 1;
            condFilter.condType = 1;
            condFilter.conds1 = [];
          } else if (condFilter.type === 'region_select' && (condFilter.model === 'province' || condFilter.model === 'city' || condFilter.model === 'area')) {
            condFilter.filterType = 1;
            condFilter.condType = 1;
            condFilter.conds1 = [];
          } else {
            condFilter.filterType = 0;
            condFilter.condType = 0;
            condFilter.conds0 = [{
              matchType: "$eq",
              value: ""
            }];
          }
        } else if (condFilter.dataType === 'Number') {
          condFilter.condType = 0;
          condFilter.conds = [{
            matchType: '$eq',
            value: ""
          }];
        } else if (condFilter.dataType === 'Date') {
          if (condFilter.type === 'year') {
            condFilter.dateDim = 'year';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'month') {
            condFilter.dateDim = 'month';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'year_month') {
            condFilter.dateDim = 'month';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'date') {
            condFilter.dateDim = 'day';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'time') {
            condFilter.dateDim = 'second';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          } else if (condFilter.type === 'datetime') {
            condFilter.dateDim = 'ymdhms';
            condFilter.filterType = 0;
            condFilter.conds = [{
              matchType: '$eq',
              value: ""
            }];
          }
        }
      },
      onStartDrag() {
        this.isDraggable = true;
      },
      onEndDrag() {
        this.isDraggable = false;
      }
    }
  };
</script>

<style lang="scss" scoped>
  @import "@/assets/style/form/advanced-widget-set.scss";

  ::v-deep .content-box {
    border: 1px dashed hsla(0, 0%, 100%, .2);
    margin-top: 6px;
    padding-top: 1px;
    padding-left: 1px;
    padding-right: 1px;
    background-color: #3E4760;

    .el-form-item {
      margin-bottom: 6px !important;
    }

    .el-form-item:first-of-type {
      margin-top: 0px !important;
    }

    .el-form-item:last-of-type+span {
      margin-top: 6px !important;
      margin-bottom: 6px !important;
    }

    .el-form-item+span {
      margin-bottom: 6px !important;
    }
  }

  ::v-deep .list-group {
    height: auto;

    .drag-item:first-of-type {
      margin-bottom: 6px;
    }
  }

  ::v-deep .empty-group {
    .drag-item {
      position: absolute;
      background: rgba(62, 71, 96, 1);
      z-index: 996;
    }

    position: relative;
    height: 26px;
  }

  .empty-box {
    border: 1px dashed hsla(0, 0%, 100%, .2);
    margin-top: 5px;
    padding-bottom: 5px;
    padding-top: 1px;
    padding-left: 1px;
    padding-right: 1px;
    background-color: #3E4760;
    height: 36px;
    position: relative;
  }

  .empty-box>div {
    position: relative;
  }

  .empty-span {
    position: absolute;
    color: rgba(255, 255, 255, .4);
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
</style>
