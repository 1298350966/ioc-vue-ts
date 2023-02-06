<template>
  <section>
    <el-form label-position="top" v-if="activeName === 'first'">
      <!--查询设置-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.queryCondition.conditions.length!==0" :class="conditionsVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="conditionsVisible =! conditionsVisible"></i>
          <span> 查询设置</span>
          <el-tooltip v-if="item.queryCondition.conditions.length!==0" effect="dark" content="清空" :open-delay="500"
                      placement="top">
            <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px"
               @click="onClearItemData('conditions')"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="设置" :open-delay="500" placement="top">
            <i class="el-icon-setting" style="float: right;cursor: pointer" @click="$emit('openPlaceHolderDialog')"></i>
          </el-tooltip>
        </div>
        <el-collapse-transition>
          <div v-show="conditionsVisible" :class="item.queryCondition.conditions.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.queryCondition.conditions.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="conditions" v-model="item.queryCondition.conditions" force-fallback="true"
                       :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'conditions')" @end="onEnd"
                       @add="onAdd($event,'conditions')">
              <transition-group :class="item.queryCondition.conditions.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(cond, i) in item.queryCondition.conditions"
                              :key="cond.key ? cond.key :cond.model ? cond.model : cond.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="conditions" :item="cond" @removeCondition="$emit('removeCondition',$event)"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
        <!--枚举查询设置-->
        <div class="config-data-item">
            <div class="area-name clearfix">
                <i v-if="item.queryCondition.enumConditions.length!==0" :class="enumConditionsVisible ? activeClass : hiddenClass"
                   style="cursor: pointer" @click="enumConditionsVisible =! enumConditionsVisible"></i>
                <span> 快捷查询设置</span>
                <el-tooltip v-if="item.queryCondition.enumConditions.length!==0" effect="dark" content="清空" :open-delay="500"
                            placement="top">
                    <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px"
                       @click="onClearItemData('enumConditions')"></i>
                </el-tooltip>

            </div>
            <el-collapse-transition>
                <div v-show="enumConditionsVisible" :class="item.queryCondition.enumConditions.length!==0 ? 'content-box' : 'empty-box'">
                    <span v-if="item.queryCondition.enumConditions.length===0" class="empty-span">添加设置至此处</span>
                    <draggable id="enumConditions" v-model="item.queryCondition.enumConditions" force-fallback="true"
                               :group="draggableGroup('settings')"
                               handle=".mover" animation="100" :delay="100" @start="onStart($event,'enumConditions')" @end="onEnd"
                               @add="onAdd($event,'enumConditions')">
                        <transition-group :class="item.queryCondition.enumConditions.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                            <el-form-item v-for="(cond, i) in item.queryCondition.enumConditions"
                                          :key="cond.key ? cond.key :cond.model ? cond.model : cond.name">
                                <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="enumConditions" :item="cond" @removeEnumCondition="$emit('removeEnumCondition',$event)"/>
                            </el-form-item>
                        </transition-group>
                    </draggable>
                </div>
            </el-collapse-transition>
        </div>
      <!--头部图标设置-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.head.iocn.length!==0" :class="headVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="headVisible =! headVisible"></i>
          <span> 头部设置</span>
        </div>
        <el-collapse-transition>
          <div v-show="headVisible">
            <div>
              <span style="display:inline-block;padding-top:0px;color: #b9b9b9;">图标设置</span>
              <div  :class="item.tableItem.head.iocn.length!==0 ? 'content-box' : 'empty-box'">
                <span v-if="item.tableItem.head.iocn.length===0" class="empty-span">添加设置至此处</span>
                <draggable id="headIocn" v-model="item.tableItem.head.iocn" force-fallback="true"
                          :group="draggableGroup('settings')"
                          handle=".mover" animation="100" :delay="100" @start="onStart($event,'headIocn')" @end="onEnd"
                          @add="onAdd($event,'headIocn')">
                  <transition-group :class="item.tableItem.head.iocn.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                    <el-form-item v-for="(t, i) in item.tableItem.head.iocn"
                                  :key="t.key ? t.key :t.model ? t.model : t.name">
                      <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="title" :item="t" @removeTitle="$emit('removeHeadIocn',$event)"/>
                    </el-form-item>
                  </transition-group>
                </draggable>
              </div>
            </div>
            <div>
              <span style="display:inline-block;padding-top:6px;color: #b9b9b9;">标题设置</span>
              <div  :class="item.tableItem.head.title.length!==0 ? 'content-box' : 'empty-box'">
                <span v-if="item.tableItem.head.title.length===0" class="empty-span">添加设置至此处</span>
                <draggable id="headTitle" v-model="item.tableItem.head.title" force-fallback="true"
                          :group="draggableGroup('settings')"
                          handle=".mover" animation="100" :delay="100" @start="onStart($event,'headTitle')" @end="onEnd"
                          @add="onAdd($event,'headTitle')">
                  <transition-group :class="item.tableItem.head.title.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                    <el-form-item v-for="(t, i) in item.tableItem.head.title"
                                  :key="t.key ? t.key :t.model ? t.model : t.name">
                      <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="title" :item="t" @removeTitle="$emit('removeHeadTitle',$event)"/>
                    </el-form-item>
                  </transition-group>
                </draggable>
              </div>
            </div>
            <div>
              <span style="display:inline-block;padding-top:6px;color: #b9b9b9;">描述设置</span>
              <div :class="item.tableItem.head.describe.length!==0 ? 'content-box' : 'empty-box'">
                <span v-if="item.tableItem.head.describe.length===0" class="empty-span">添加设置至此处</span>
                <draggable id="headDescribe" v-model="item.tableItem.head.describe" force-fallback="true"
                          :group="draggableGroup('settings')"
                          handle=".mover" animation="100" :delay="100" @start="onStart($event,'headDescribe')" @end="onEnd"
                          @add="onAdd($event,'headDescribe')">
                  <transition-group :class="item.tableItem.head.describe.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                    <el-form-item v-for="(t, i) in item.tableItem.head.describe"
                                  :key="t.key ? t.key :t.model ? t.model : t.name">
                      <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="title" :item="t" @removeTitle="$emit('removeHeadDescribe',$event)"/>
                    </el-form-item>
                  </transition-group>
                </draggable>
              </div>
            </div>
          </div>
        </el-collapse-transition>
      </div>
      <!--头部标题设置-->
      <!-- <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.head.title.length!==0" :class="titleVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="titleVisible =! titleVisible"></i>
          <span> 头部标题设置</span>
        </div>
        <el-collapse-transition>
       
        </el-collapse-transition>
      </div> -->
      <!--头部描述设置-->
      <!-- <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.title.length!==0" :class="titleVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="titleVisible =! titleVisible"></i>
          <span> 头部描述设置</span>
        </div>
        <el-collapse-transition>
          <div v-show="titleVisible" :class="item.tableItem.head.describe.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.tableItem.head.describe.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="headDescribe" v-model="item.tableItem.head.describe" force-fallback="true"
                       :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'headDescribe')" @end="onEnd"
                       @add="onAdd($event,'headDescribe')">
              <transition-group :class="item.tableItem.head.describe.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(t, i) in item.tableItem.head.describe"
                              :key="t.key ? t.key :t.model ? t.model : t.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="title" :item="t" @removeTitle="$emit('removeHeadDescribe',$event)"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div> -->
      <!--标题设置-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.title.length!==0" :class="titleVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="titleVisible =! titleVisible"></i>
          <span> 标题设置</span>
        </div>
        <el-collapse-transition>
          <div v-show="titleVisible" :class="item.tableItem.title.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.tableItem.title.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="title" v-model="item.tableItem.title" force-fallback="true"
                       :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'title')" @end="onEnd"
                       @add="onAdd($event,'title')">
              <transition-group :class="item.tableItem.title.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(t, i) in item.tableItem.title"
                              :key="t.key ? t.key :t.model ? t.model : t.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="title" :item="t" @removeTitle="$emit('removeTitle',$event)"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
      <!--右上角设置-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.rightTop.length!==0" :class="rightTopVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="rightTopVisible =! rightTopVisible"></i>
          <span> 右上角设置</span>
        </div>
        <el-collapse-transition>
          <div v-show="rightTopVisible" :class="item.tableItem.rightTop.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.tableItem.rightTop.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="rightTop" v-model="item.tableItem.rightTop" force-fallback="true"
                       :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'rightTop')" @end="onEnd"
                       @add="onAdd($event,'rightTop')">
              <transition-group :class="item.tableItem.rightTop.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(rt, i) in item.tableItem.rightTop"
                              :key="rt.key ? rt.key :rt.model ? rt.model : rt.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="rightTop" :item="rt" @removeRightTop="$emit('removeRightTop',$event)"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
      <!--列设置-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.cols.length!==0" :class="colsVisible ? activeClass : hiddenClass" style="cursor: pointer"
             @click="colsVisible =! colsVisible"></i>
          <span> 列设置</span>
          <el-tooltip v-if="item.tableItem.cols.length!==0" effect="dark" content="清空" :open-delay="500" placement="top">
            <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px;"
               @click="onClearItemData('cols')"></i>
          </el-tooltip>
        </div>
        <el-collapse-transition>
          <div v-show="colsVisible" :class="item.tableItem.cols.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.tableItem.cols.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="cols" v-model="item.tableItem.cols" force-fallback="true" :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'cols')" @end="onEnd"
                       :move="onMove" @add="onAdd($event,'cols')">
              <transition-group :class="item.tableItem.cols.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(col, i) in item.tableItem.cols"
                              :key="col.key ? col.key : col.model ? col.model : col.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="cols" :item="col"
                                            @removeCol="removeCol"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
      <!--左下角设置-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.leftBottom.length!==0" :class="leftBottomVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="leftBottomVisible =! leftBottomVisible"></i>
          <span> 左下角设置</span>
        </div>
        <el-collapse-transition>
          <div v-show="leftBottomVisible" :class="item.tableItem.leftBottom.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.tableItem.leftBottom.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="leftBottom" v-model="item.tableItem.leftBottom" force-fallback="true"
                       :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'leftBottom')" @end="onEnd"
                       @add="onAdd($event,'leftBottom')">
              <transition-group :class="item.tableItem.leftBottom.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(lb, i) in item.tableItem.leftBottom"
                              :key="lb.key ? lb.key :lb.model ? lb.model : lb.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="leftBottom" :item="lb" @removeLeftBottom="$emit('removeLeftBottom',$event)"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
      <!--右下角设置-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.rightBottom.length!==0" :class="rightBottomVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="rightBottomVisible =! rightBottomVisible"></i>
          <span> 右下角设置</span>
        </div>
        <el-collapse-transition>
          <div v-show="rightBottomVisible" :class="item.tableItem.rightBottom.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.tableItem.rightBottom.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="rightBottom" v-model="item.tableItem.rightBottom" force-fallback="true"
                       :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'rightBottom')" @end="onEnd"
                       @add="onAdd($event,'rightBottom')">
              <transition-group :class="item.tableItem.rightBottom.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(rb, i) in item.tableItem.rightBottom"
                              :key="rb.key ? rb.key :rb.model ? rb.model : rb.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="rightBottom" :item="rb" @removeRightBottom="$emit('removeRightBottom',$event)"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
      <!--过滤器-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.condFilters.length!==0" :class="condFiltersVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="condFiltersVisible =! condFiltersVisible"></i>
          <span> 过滤器</span>
          <el-tooltip v-if="item.tableItem.condFilters.length!==0" effect="dark" content="清空" :open-delay="500"
                      placement="top">
            <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px"
               @click="onClearItemData('condFilters')"></i>
          </el-tooltip>
        </div>
        <el-collapse-transition>
          <div v-show="condFiltersVisible" :class="item.tableItem.condFilters.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.tableItem.condFilters.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="condFilters" v-model="item.tableItem.condFilters" force-fallback="true"
                       :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'condFilters')" @end="onEnd"
                       @add="onAdd($event,'condFilters')">
              <transition-group :class="item.tableItem.condFilters.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(condFilter, i) in item.tableItem.condFilters"
                              :key="condFilter.key ? condFilter.key : condFilter.model ? condFilter.model : condFilter.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" :item="condFilter" show-type="condFilters"
                                                @showCondFilterConfigDialog="showCondFilterConfigDialog"
                                                @removeCondFilter="removeCondFilter"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
      <!--排序设置-->
      <div class="config-data-item">
        <div class="area-name clearfix">
          <i v-if="item.tableItem.querySort.length!==0" :class="querySortVisible ? activeClass : hiddenClass"
             style="cursor: pointer" @click="querySortVisible =! querySortVisible"></i>
          <span> 排序设置</span>
          <el-tooltip v-if="item.tableItem.querySort.length!==0" effect="dark" content="清空" :open-delay="500"
                      placement="top">
            <i class="el-icon-delete-solid" style="cursor:pointer;margin-left: 5px"
               @click="onClearItemData('querySort')"></i>
          </el-tooltip>
          <el-tooltip effect="dark" content="添加" :open-delay="500" placement="top">
            <i class="el-icon-plus" style="float: right;cursor: pointer" @click="openAddQuerySortDialog"></i>
          </el-tooltip>
        </div>
        <el-collapse-transition>
          <div v-show="querySortVisible" :class="item.tableItem.querySort.length!==0 ? 'content-box' : 'empty-box'">
            <span v-if="item.tableItem.querySort.length===0" class="empty-span">添加设置至此处</span>
            <draggable id="querySort" v-model="item.tableItem.querySort" force-fallback="true"
                       :group="draggableGroup('settings')"
                       handle=".mover" animation="100" :delay="100" @start="onStart($event,'querySort')" @end="onEnd"
                       @add="onAdd($event,'querySort')">
              <transition-group :class="item.tableItem.querySort.length!==0 ? 'list-group' : 'empty-group'" tag="div">
                <el-form-item v-for="(querySort, i) in item.tableItem.querySort"
                              :key="querySort.key ? querySort.key :querySort.model ? querySort.model : querySort.name">
                  <app-advanced-widget-set-item :isDraggable="isDraggable" show-type="querySort" :item="querySort"
                                                @removeQuerySort="removeQuerySort"/>
                </el-form-item>
              </transition-group>
            </draggable>
          </div>
        </el-collapse-transition>
      </div>
    </el-form>
    <!--样式设置-->
    <el-collapse v-model="tableActiveNames" v-if="activeName === 'second'">
      <el-collapse-item title="基础信息" name="1">
        <!--        <el-form label-position="top" class="secondary-font-color report-set-margin-let">
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
        </el-form>-->
      </el-collapse-item>
      <el-collapse-item title="样式设置" name="2">
        <!--        <el-form label-position="top" class="secondary-font-color report-set-margin-let">
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
          </el-form-item>
          <el-divider></el-divider>
          <el-form-item label="表头样式">
            <div style="margin-left: 10px">
              字体大小/颜色
              <el-select v-model="item.style.tableHeaderStyle.cellFontSize"
                         :popper-append-to-body="false" style="width: 35%">
                <el-option v-for="item in Constants.viceValueSizeOptions"
                           :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-color-picker v-model="item.style.tableHeaderStyle.cellColor" show-alpha></el-color-picker>
              <el-form-item label="标题位置">
                <el-radio-group v-model="item.style.tableHeaderStyle.cellPosition"
                                class="table-set-radio-button report-set-radio-button">
                  <el-radio label="left" border>
                    <el-tooltip effect="dark" content="左" placement="top">
                      <i class="icon iconfont icon-icon&#45;&#45;1"></i>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="center" border>
                    <el-tooltip effect="dark" content="中" placement="top">
                      <i class="icon iconfont icon-shanchu-fangkuang"></i>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="right" border>
                    <el-tooltip effect="dark" content="右" placement="top">
                      <i class="icon iconfont icon-icon&#45;&#45;"></i>
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row :span="24">
                <el-col :span="12">
                  表头网格颜色
                  <el-color-picker v-model="item.style.tableHeaderStyle.cellBorderColor" show-alpha></el-color-picker>
                </el-col>
                <el-col :span="12">
                  背景色
                  <el-color-picker v-model="item.style.tableHeaderStyle.backgroundColor" show-alpha></el-color-picker>
                </el-col>
              </el-row>

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
          <el-form-item label="表内容样式">
            <div style="margin-left: 10px">
              字体大小/颜色
              <el-select v-model="item.style.tableBodyStyle.cellFontSize"
                         :popper-append-to-body="false" style="width: 35%">
                <el-option v-for="item in Constants.viceValueSizeOptions"
                           :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-color-picker v-model="item.style.tableBodyStyle.cellColor" show-alpha></el-color-picker>
              <el-form-item label="表内容位置">
                <el-radio-group v-model="item.style.tableBodyStyle.cellPosition"
                                class="table-set-radio-button report-set-radio-button">
                  <el-radio label="left" border>
                    <el-tooltip effect="dark" content="左" placement="top">
                      <i class="icon iconfont icon-icon&#45;&#45;1"></i>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="center" border>
                    <el-tooltip effect="dark" content="中" placement="top">
                      <i class="icon iconfont icon-shanchu-fangkuang"></i>
                    </el-tooltip>
                  </el-radio>
                  <el-radio label="right" border>
                    <el-tooltip effect="dark" content="右" placement="top">
                      <i class="icon iconfont icon-icon&#45;&#45;"></i>
                    </el-tooltip>
                  </el-radio>
                </el-radio-group>
              </el-form-item>
              <el-row :span="24">
                <el-col :span="8">
                  表内容网格颜色
                  <el-color-picker v-model="item.style.tableBodyStyle.cellBorderColor" show-alpha></el-color-picker>
                </el-col>
                <el-col :span="8" style="text-align: center">
                  背景色
                  <el-color-picker v-model="item.style.tableBodyStyle.backgroundColor" show-alpha></el-color-picker>
                </el-col>
                <el-col :span="8">
                  鼠标悬浮背景色
                  <el-color-picker v-model="item.style.tableBodyStyle.backgroundColorHover"
                                   show-alpha></el-color-picker>
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
              操作列：字体大小/颜色
              <el-select v-model="item.style.tableBodyStyle.optFontSize"
                         :popper-append-to-body="false" style="width: 35%">
                <el-option v-for="item in Constants.viceValueSizeOptions"
                           :key="item.value" :label="item.label"
                           :value="item.value"></el-option>
              </el-select>
              <el-color-picker v-model="item.style.tableBodyStyle.optColor" show-alpha></el-color-picker>
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
                    <el-color-picker v-model="item.style.tablePaginationStyle.buttonStyle.backgroundColor"
                                     show-alpha></el-color-picker>
                    <el-color-picker v-model="item.style.tablePaginationStyle.buttonStyle.fontColor"
                                     show-alpha></el-color-picker>
                  </el-form-item>
                </el-col>
                <el-col :span="12">
                  <el-form-item label="选中按钮样式">
                    <el-color-picker v-model="item.style.tablePaginationStyle.buttonActiveStyle.backgroundColor"
                                     show-alpha></el-color-picker>
                    <el-color-picker v-model="item.style.tablePaginationStyle.buttonActiveStyle.fontColor"
                                     show-alpha></el-color-picker>
                  </el-form-item>
                </el-col>

              </el-row>
              <el-row :span="24">
                <el-col :span="12">
                  <el-form-item label="输入框样式">
                    <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.backgroundColor"
                                     show-alpha></el-color-picker>
                    <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.fontColor"
                                     show-alpha></el-color-picker>
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
                    <el-color-picker v-model="item.style.tablePaginationStyle.inputStyle.borderColor"
                                     show-alpha></el-color-picker>
                  </el-form-item>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-form>-->
      </el-collapse-item>
      <el-collapse-item title="列宽设置" name="3">
        <!--        <template v-for="(col,index) in item.tableItem.cols">
          <div style="margin-top: 10px;color: white" v-if="col.key != '$seq'">
            <el-tooltip class="item" effect="dark" :content="col.alias?col.alias:col.name" placement="top">
              <div class="colTitle"> {{ col.alias ? col.alias : col.name }}</div>
            </el-tooltip>

            <el-input class="query-widget-style" style="width: 150px"
                      placeholder="数值"
                      type="number"
                      v-model="col.width"
            >
            </el-input>
            px
          </div>
        </template>-->
      </el-collapse-item>
    </el-collapse>
  </section>
</template>

<script>
import AppAdvancedWidgetSetItem from "@/components/app-preview/AppAdvancedWidgetSetItem";
import draggable from 'vuedraggable'

export default {
  name: "AppWidgetSet",
  components: {
    AppAdvancedWidgetSetItem, draggable
  },

  created() {
      //兼容老表单的枚举查询设置
      if(!this.item.queryCondition.enumConditions){
          this.$set(this.item.queryCondition, 'enumConditions', []);
      }
      if(this.item.tableItem && !this.item.tableItem.hasOwnProperty("head")){
        this.$set(this.item.tableItem, 'head', {
          iocn:[],
          title:[],
          describe:[]
        });
      }
       
  },

  computed: {
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
    currDragItem: {type: Object}
  },

  data() {
    return {
      isDraggable: false,
      index: '',
      tableActiveNames: ['1'],
      configDialogVisible: false,  //列设置-过滤器的对话框显示
      configType: '', //类型（列设置、过滤器）
      colsVisible: true,
      condFiltersVisible: true,
      querySortVisible: true,
      conditionsVisible: true,
      enumConditionsVisible:true,
      headVisible: true,
      titleVisible: true,
      rightTopVisible: true,
      leftBottomVisible: true,
      rightBottomVisible: true,
      currDragType: '',
      activeClass: ['el-collapse-item__arrow', 'el-icon-arrow-right', 'is-active'],
      hiddenClass: ['el-collapse-item__arrow', 'el-icon-arrow-right']
    };
  },

  methods: {
    //打开列设置对话框
    openAddColCondFilterDialog(type) {
      this.$emit('showAddColCondFilterDialog', type);
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
    showCondFilterConfigDialog(item) {
      this.$emit('showCondFilterConfigDialog', item);
    },
    removeQuerySort(item) {
      this.$emit('removeQuerySort', item);
    },
    //清空数据
    onClearItemData(type) {
      let typeContent;
      if (type === 'cols') {
        typeContent = '列设置';
      } else if (type === 'condFilters') {
        typeContent = '过滤器';
      } else if (type === 'querySort') {
        typeContent = '排序设置';
      } else if (type === 'conditions') {
        typeContent = '查询设置';
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
            this.$set(this.item.tableItem, 'cols', []);
          });
        } else if (type === 'condFilters') {
          this.condFiltersVisible = true;
          this.$nextTick(() => {
            this.$set(this.item.tableItem, 'condFilters', []);
          });
        } else if (type === 'conditions') {
          this.conditionsVisible = true;
          this.$nextTick(() => {
            this.$set(this.item.queryCondition, 'conditions', []);
          });
        }else if (type === 'enumConditions') {
            this.enumConditionsVisible = true;
            this.$nextTick(() => {
                this.$set(this.item.queryCondition, 'enumConditions', []);
            });
        } else if (type === 'querySort') {
          this.querySortVisible = true;
          this.$nextTick(() => {
            this.$set(this.item.tableItem, 'querySort', []);
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
    onStart(e, type) {
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
        this.item.tableItem.cols.splice(newIndex, 1);
        this.addToCols(newIndex);
      } else if (type === 'condFilters') {
        this.item.tableItem.condFilters.splice(newIndex, 1);
        this.addToCondFilters(newIndex);
      } else if (type === 'querySort') {
        this.item.tableItem.querySort.splice(newIndex, 1);
        this.addToQuerySort(newIndex);
      } else if (type === 'title') {
        this.item.tableItem.title.splice(newIndex, 1);
        this.addToTitle(newIndex);
      } else if (type === 'leftBottom') {
        this.item.tableItem.leftBottom.splice(newIndex, 1);
        this.addToLeftBottom(newIndex);
      } else if (type === 'rightBottom') {
        this.item.tableItem.rightBottom.splice(newIndex, 1);
        this.addToRightBottom(newIndex);
      } else if (type === 'conditions') {
        this.item.queryCondition.conditions.splice(newIndex, 1);
        this.addToConditions(newIndex);
      }else if (type === 'enumConditions') {
          this.item.queryCondition.enumConditions.splice(newIndex, 1);
          this.addToEnumConditions(newIndex);
      } else if (type === 'rightTop') {
        this.item.tableItem.rightTop.splice(newIndex, 1);
        this.addToRightTop(newIndex);
      } else if(type === "headIocn"){
         this.item.tableItem.head.iocn.splice(newIndex, 1);
         this.addToHeadIocn(newIndex);
      } else if(type === "headTitle"){
         this.item.tableItem.head.title.splice(newIndex, 1);
         this.addToHeadTitle(newIndex);
      } else if(type === "headDescribe"){
         this.item.tableItem.head.describe.splice(newIndex, 1);
         this.addToHeadDescribe(newIndex);
      }
    },
    addToHeadIocn(newIndex){
      if (!this.checkIsSeqOrOpt()) {
        if (!this.currDragItem.data.children) {
          if (this.checkIsOnlyOne('headIocn')) {
            let titleItem = {};
            titleItem.type = this.currDragItem.data.type;
            titleItem.key = this.currDragItem.data.model;
            titleItem.name = this.currDragItem.data.name;
            titleItem.format = {
              prefix: "",
              suffix: ""
            };
            this.item.tableItem.head.iocn.splice(newIndex, 0, titleItem);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          }
        } else {
          this.$message({type: "warning", message: "不支持添加该字段"});
        }
      }
    },
    addToHeadTitle(newIndex){
      if (!this.checkIsSeqOrOpt()) {
        if (!this.currDragItem.data.children) {
          if (this.checkIsOnlyOne('headTitle')) {
            let titleItem = {};
            titleItem.type = this.currDragItem.data.type;
            titleItem.key = this.currDragItem.data.model;
            titleItem.name = this.currDragItem.data.name;
            titleItem.format = {
              prefix: "",
              suffix: ""
            };
            this.item.tableItem.head.title.splice(newIndex, 0, titleItem);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          }
        } else {
          this.$message({type: "warning", message: "不支持添加该字段"});
        }
      }
    },
    addToHeadDescribe(newIndex){
      if (!this.checkIsSeqOrOpt()) {
        if (!this.currDragItem.data.children) {
          if (this.checkIsOnlyOne('headDescribe')) {
            let titleItem = {};
            titleItem.type = this.currDragItem.data.type;
            titleItem.key = this.currDragItem.data.model;
            titleItem.name = this.currDragItem.data.name;
            titleItem.format = {
              prefix: "",
              suffix: ""
            };
            this.item.tableItem.head.describe.splice(newIndex, 0, titleItem);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          }
        } else {
          this.$message({type: "warning", message: "不支持添加该字段"});
        }
      }
    },
    addToConditions(newIndex) {
      if (!this.handleAddAllLeafNodeToItemData('conditions')) {
        let cond = {};
        cond.type = this.currDragItem.data.type;
        cond.key = this.currDragItem.data.model;
        cond.name = this.currDragItem.data.name;
        cond.type = 'input';
        if (!this.checkIsSeqOrOpt()) {
          if (!this.checkIfExist(cond, 'conditions')) {
            this.item.queryCondition.conditions.splice(newIndex, 0, cond);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          } else {
            this.$message({showClose: true, type: "warning", message: "已存在该字段"});
          }
        }
      }
    },
    addToEnumConditions(newIndex) {
        if (!this.handleAddAllLeafNodeToItemData('enumConditions')) {
            let cond = {};
            cond.type = this.currDragItem.data.type;
            cond.key = this.currDragItem.data.model;
            cond.name = this.currDragItem.data.name;
            cond.type = this.currDragItem.data.type;
            if(cond.type != 'select' && cond.type != 'radio'){
                this.$message({showClose: true, type: "warning", message: "只允许添加枚举类控件！"});
            }else {
                if (!this.checkIsSeqOrOpt()) {
                    if (!this.checkIfExist(cond, 'enumConditions')) {
                        this.item.queryCondition.enumConditions.splice(newIndex, 0, cond);
                        this.$message({showClose: true, type: "success", message: "添加成功"});
                    } else {
                        this.$message({showClose: true, type: "warning", message: "已存在该字段"});
                    }
                }
            }

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
        this.item.tableItem.cols.unshift(item);
      } else {
        let optExist = false;
        for (let i = 0; i < this.item.tableItem.cols.length; i++) {
          let col = this.item.tableItem.cols[i];
          if (col.key === '$opt') {
            optExist = true;
          }
        }
        if (optExist) {
          if (newIndex === this.item.tableItem.cols.length) {
            this.item.tableItem.cols.splice(this.item.tableItem.cols.length - 1, 0, item);
          } else {
            this.item.tableItem.cols.splice(newIndex, 0, item);
          }
        } else {
          if (item.key === '$opt') {
            this.$delete(item, 'model');
            this.item.tableItem.cols.push(item);
          } else {
            this.item.tableItem.cols.push(item);
          }
        }
      }
    },
    addToCondFilters(newIndex) {
      if (!this.handleAddAllLeafNodeToItemData('condFilters')) {
        if (!this.checkIsSeqOrOpt()) {
          let condFilter = {};
          condFilter.type = this.currDragItem.data.type;
          condFilter.name = this.currDragItem.data.name;
          condFilter.widget = this.currDragItem.data.widget;
          condFilter.model = this.currDragItem.data.model;
          condFilter.type = this.currDragItem.data.type;
          condFilter.dataType = this.initCondFilterDataType(this.currDragItem.data);
          this.initCondFilterField(condFilter);
          if (!this.checkIfExist(condFilter, 'condFilters')) {
            this.item.tableItem.condFilters.splice(newIndex, 0, condFilter);
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
            this.item.tableItem.querySort.splice(newIndex, 0, querySort);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          } else {
            this.$message({showClose: true, type: "warning", message: "已存在该字段"});
          }
        }
      }
    },
    addToTitle(newIndex) {
      if (!this.checkIsSeqOrOpt()) {
        if (!this.currDragItem.data.children) {
          if (this.checkIsOnlyOne('title')) {
            let titleItem = {};
            titleItem.type = this.currDragItem.data.type;
            titleItem.key = this.currDragItem.data.model;
            titleItem.name = this.currDragItem.data.name;
            titleItem.format = {
              prefix: "",
              suffix: ""
            };
            this.item.tableItem.title.splice(newIndex, 0, titleItem);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          }
        } else {
          this.$message({type: "warning", message: "不支持添加该字段"});
        }
      }
    },
    addToRightTop(newIndex) {
      if (!this.checkIsSeqOrOpt()) {
        if (!this.currDragItem.data.children) {
          if (this.checkIsOnlyOne('rightTop')) {
            let rightTopItem = {};
            rightTopItem.type = this.currDragItem.data.type;
            rightTopItem.key = this.currDragItem.data.model;
            rightTopItem.name = this.currDragItem.data.name;
            rightTopItem.format = {
              prefix: "",
              suffix: ""
            };
            this.item.tableItem.rightTop.splice(newIndex, 0, rightTopItem);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          }
        } else {
          this.$message({type: "warning", message: "不支持添加该字段"});
        }
      }
    },
    addToLeftBottom(newIndex) {
      if (!this.checkIsSeqOrOpt()) {
        if (!this.currDragItem.data.children) {
          if (this.checkIsOnlyOne('leftBottom')) {
            let leftBottomItem = {};
            leftBottomItem.type = this.currDragItem.data.type;
            leftBottomItem.key = this.currDragItem.data.model;
            leftBottomItem.name = this.currDragItem.data.name;
            leftBottomItem.format = {
              prefix: "",
              suffix: ""
            };
            this.item.tableItem.leftBottom.splice(newIndex, 0, leftBottomItem);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          }
        } else {
          this.$message({type: "warning", message: "不支持添加该字段"});
        }
      }
    },
    addToRightBottom(newIndex) {
      if (!this.checkIsSeqOrOpt()) {
        if (!this.currDragItem.data.children) {
          if (this.checkIsOnlyOne('rightBottom')) {
            let rightBottomItem = {};
            rightBottomItem.type = this.currDragItem.data.type;
            rightBottomItem.key = this.currDragItem.data.model;
            rightBottomItem.name = this.currDragItem.data.name;
            rightBottomItem.format = {
              prefix: "",
              suffix: ""
            };
            this.item.tableItem.rightBottom.splice(newIndex, 0, rightBottomItem);
            this.$message({showClose: true, type: "success", message: "添加成功"});
          }
        } else {
          this.$message({type: "warning", message: "不支持添加该字段"});
        }
      }
    },
    checkIsOnlyOne(type) {
      if (type === 'title') {
        if (this.item.tableItem.title.length > 0) {
          this.$message({
            type: 'warning',
            message: '只能添加一个字段'
          });
          return false;
        }
      } else if (type === 'leftBottom') {
        if (this.item.tableItem.leftBottom.length > 0) {
          this.$message({
            type: 'warning',
            message: '只能添加一个字段'
          });
          return false;
        }
      } else if (type === 'rightBottom') {
        if (this.item.tableItem.rightBottom.length > 0) {
          this.$message({
            type: 'warning',
            message: '只能添加一个字段'
          });
          return false;
        }
      } else if (type === 'rightTop') {
        if (this.item.tableItem.rightTop.length > 0) {
          this.$message({
            type: 'warning',
            message: '只能添加一个字段'
          });
          return false;
        }
      } else if (type === 'rightTop') {
        if (this.item.tableItem.rightTop.length > 0) {
          this.$message({
            type: 'warning',
            message: '只能添加一个字段'
          });
          return false;
        }
      } else if (type === 'headIocn') {
        if (this.item.tableItem.head.iocn.length > 0) {
          this.$message({
            type: 'warning',
            message: '只能添加一个字段'
          });
          return false;
        }
      } else if (type === 'headTitle') {
        if (this.item.tableItem.head.title.length > 0) {
          this.$message({
            type: 'warning',
            message: '只能添加一个字段'
          });
          return false;
        }
      } else if (type === 'headDescribe') {
        if (this.item.tableItem.head.describe.length > 0) {
          this.$message({
            type: 'warning',
            message: '只能添加一个字段'
          });
          return false;
        }
      }
      return true;
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
        for (let i = 0; i < this.item.tableItem.cols.length; i++) {
          let col = this.item.tableItem.cols[i];
          if (col.key === item.key) {
            exist = true;
            break;
          }
        }
      } else if (type === 'condFilters') {
        for (let i = 0; i < this.item.tableItem.condFilters.length; i++) {
          let condFilter = this.item.tableItem.condFilters[i];
          if (condFilter.model === item.model) {
            exist = true;
            break;
          }
        }
      } else if (type === 'querySort') {
        for (let i = 0; i < this.item.tableItem.querySort.length; i++) {
          let querySort = this.item.tableItem.querySort[i];
          if (querySort.key === item.key) {
            exist = true;
            break;
          }
        }
      } else if (type === 'conditions') {
        for (let i = 0; i < this.item.queryCondition.conditions.length; i++) {
          let condition = this.item.queryCondition.conditions[i];
          if (condition.key === item.key) {
            exist = true;
            break;
          }
        }
      }else if (type === 'enumConditions') {
          for (let i = 0; i < this.item.queryCondition.enumConditions.length; i++) {
              let condition = this.item.queryCondition.enumConditions[i];
              if (condition.key === item.key) {
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
                this.item.tableItem.condFilters.push(condFilter);
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
        } else if (type === 'conditions') {
          let existNames = [];
          for (let i = 0; i < this.currDragItem.data.children.length; i++) {
            let child = this.currDragItem.data.children[i];
            if (child.model !== '$seq' && child.model !== '$opt') {
              let cond = {};
              cond.name = child.name;
              cond.key = child.model;
              cond.input = 'input';
              if (!this.checkIfExist(cond, 'conditions')) {
                this.item.queryCondition.conditions.push(cond);
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
        }else if (type === 'enumConditions') {
            let existNames = [];
            for (let i = 0; i < this.currDragItem.data.children.length; i++) {
                let child = this.currDragItem.data.children[i];
                if (child.model !== '$seq' && child.model !== '$opt') {
                    let cond = {};
                    cond.name = child.name;
                    cond.key = child.model;
                    cond.input = 'input';
                    if (!this.checkIfExist(cond, 'enumConditions')) {
                        this.item.queryCondition.enumConditions.push(cond);
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
                this.item.tableItem.querySort.push(querySort);
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

  .el-form-item:last-of-type + span {
    margin-top: 6px !important;
    margin-bottom: 6px !important;
  }

  .el-form-item + span {
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

.empty-box > div {
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
