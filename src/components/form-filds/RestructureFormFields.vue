<template>
  <el-container class="config-container">
    <el-header height="45px">
      <div
        class="config-tab"
        :class="{ active: activeName === 'first' }"
        @click="handleSelect('first')"
      >
        字段属性
      </div>
      <div
        class="config-tab"
        :class="{ active: activeName === 'second' }"
        @click="handleSelect('second')"
      >
        表单属性
      </div>
    </el-header>
    <el-main :key="data.key" class="config-content">
      <div v-show="activeName === 'first'" v-if="show">
        <el-form label-position="top">
          <!-- 表单选择 -->
          <subformFields v-if="data.type === 'table'" :data="data"></subformFields>
          <quoteformFields v-if="data.type === 'm_data_ref'" :data="data">
          </quoteformFields>
          <div style="padding: 10px">
            <el-form-item label="控件类型" v-if="data.type !== '' && data.type !== null">
              <el-input disabled value="单行文本" v-if="data.type === 'input'"></el-input>
              <el-input
                disabled
                value="多行文本"
                v-if="data.type === 'textarea'"
              ></el-input>
              <el-input disabled value="文字" v-if="data.type === 'text'"></el-input>
              <el-input
                disabled
                value="手机号码"
                v-if="data.type === 'input_mobile'"
              ></el-input>
              <el-input
                disabled
                value="电话号码"
                v-if="data.type === 'input_tel'"
              ></el-input>
              <el-input
                disabled
                value="邮箱"
                v-if="data.type === 'input_mail'"
              ></el-input>
              <el-input
                disabled
                value="邮政编码"
                v-if="data.type === 'input_postal'"
              ></el-input>
              <el-input
                disabled
                value="网址"
                v-if="data.type === 'input_website'"
              ></el-input>
              <el-input
                disabled
                value="数字(浮点型)"
                v-if="data.type === 'input_number'"
              ></el-input>
              <el-input
                disabled
                value="数字(整型)"
                v-if="data.type === 'input_int'"
              ></el-input>
              <el-input
                disabled
                value="数字(长整型)"
                v-if="data.type === 'input_long'"
              ></el-input>
              <el-input disabled value="计数器" v-if="data.type === 'number'"></el-input>
              <el-input disabled value="单选框" v-if="data.type === 'radio'"></el-input>
              <el-input
                disabled
                value="多选框"
                v-if="data.type === 'checkbox'"
              ></el-input>
              <el-input disabled value="年份" v-if="data.type === 'year'"></el-input>
              <el-input disabled value="月份" v-if="data.type === 'month'"></el-input>
              <el-input
                disabled
                value="年月份"
                v-if="data.type === 'year_month'"
              ></el-input>
              <el-input disabled value="日期" v-if="data.type === 'date'"></el-input>
              <el-input disabled value="时间" v-if="data.type === 'time'"></el-input>
              <el-input
                disabled
                value="日期时间"
                v-if="data.type === 'datetime'"
              ></el-input>
              <el-input disabled value="开关" v-if="data.type === 'switch'"></el-input>
              <el-input
                disabled
                value="多选下拉框"
                v-if="data.type === 'multiple_select'"
              ></el-input>
              <el-input
                disabled
                value="下拉选择框"
                v-if="data.type === 'select'"
              ></el-input>
              <el-input disabled value="签名" v-if="data.type === 'signature'"></el-input>
              <el-input
                disabled
                value="图片"
                v-if="data.type === 'image_upload'"
              ></el-input>
              <el-input
                disabled
                value="附件"
                v-if="data.type === 'file_upload'"
              ></el-input>
              <el-input
                disabled
                value="通用数据"
                v-if="data.type === 'data_select' || data.type === 'm_data_select'"
              ></el-input>
              <el-input
                disabled
                value="组织机构"
                v-if="data.type === 'org_select' || data.type === 'm_org_select'"
              ></el-input>
              <el-input
                disabled
                value="当前用户"
                v-if="data.type === 'current_user'"
              ></el-input>
              <el-input
                disabled
                value="用户"
                v-if="data.type === 'user_select' || data.type === 'm_user_select'"
              ></el-input>
              <el-input
                disabled
                value="企业"
                v-if="data.type === 'company_select' || data.type === 'm_company_select'"
              ></el-input>
              <el-input
                disabled
                value="角色"
                v-if="data.type === 'role_select' || data.type === 'm_role_select'"
              ></el-input>
              <el-input
                disabled
                value="数据字典"
                v-if="data.type === 'dic_select' || data.type === 'm_dic_select'"
              ></el-input>
              <el-input disabled value="子表单" v-if="data.type === 'table'"></el-input>
              <el-input
                disabled
                value="审批填报项"
                v-if="data.type === 'flow_table'"
              ></el-input>
              <el-input disabled value="栅格布局" v-if="data.type === 'grid'"></el-input>
              <el-input
                disabled
                value="Gis定位"
                v-if="data.type === 'gis_select'"
              ></el-input>
              <el-input
                disabled
                value="行政区划"
                v-if="data.type === 'region_select'"
              ></el-input>
              <el-input
                disabled
                value="计算公式"
                v-if="data.type === 'calculate_formula'"
              ></el-input>
              <el-button
                type="text"
                @click.stop="gisMappingVisible = true"
                v-show="data.type === 'gis_select'"
                :disabled="data.source === 0"
              >
                添加配置
              </el-button>
              <el-button
                type="text"
                @click.stop="regionMappingVisible = true"
                v-show="data.type === 'region_select'"
                :disabled="data.source === 0"
              >
                添加配置
              </el-button>
            </el-form-item>
            <el-form-item label="标题">
              <el-input v-model="data.name"></el-input>
            </el-form-item>
            <el-form-item label="备注">
              <el-input v-model="data.comment"></el-input>
            </el-form-item>
            <el-form-item label="字段标识" v-if="showLabelAndModelSet">
              <el-input v-model="data.model" :disabled="data.source === 0"></el-input>
            </el-form-item>
            <el-form-item label="字段长度" v-if="showLengthSet">
              <el-input v-model="data.len"></el-input>
            </el-form-item>
            <el-form-item label="正则表达式" v-if="data.options.hasOwnProperty('pattern')" >
              <el-input v-model="data.options.pattern" @change="patternChange" ></el-input>
              <el-input v-if="rulesPattern" v-model="rulesPattern.message" style="margin-top:5px;"></el-input>
            </el-form-item>
            <el-form-item
              label="宽度"
              v-if="Object.keys(data.options).indexOf('width') >= 0"
            >
              <el-input v-model="data.options.width"></el-input>
            </el-form-item>
            <el-form-item
              label="高度"
              v-if="Object.keys(data.options).indexOf('height') >= 0"
            >
              <el-input v-model="data.options.height"></el-input>
            </el-form-item>
            <el-form-item
              label="大小"
              v-if="Object.keys(data.options).indexOf('size') >= 0"
            >
              宽度：
              <el-input
                style="width: 90px"
                type="number"
                v-model.number="data.options.size.width"
              ></el-input>
              高度：
              <el-input
                style="width: 90px"
                type="number"
                v-model.number="data.options.size.height"
              ></el-input>
            </el-form-item>
            <el-form-item label="占位内容" v-if="showPlaceholderSet">
              <el-input v-model="data.options.placeholder"></el-input>
            </el-form-item>

            <el-form-item label="计算公式" v-if="data.type === 'calculate_formula'">
              <calculationFormulaInput :value="data.options.formula.exp" :variableList="formItemListAll" @click="calculator.dialogVisible = true" ></calculationFormulaInput>
              <calculator v-if="calculator.dialogVisible" :formulaObj="data.options.formula" :calculator="calculator" :formItemList="formItemList" @onFormula="data.options.formula = $event"></calculator>
            </el-form-item>
            <el-form-item label="小数点位数" v-if="data.type === 'calculate_formula' && data.options.formula.type === 'number'">
             <el-input-number v-model="data.options.formula.decimal"  :min="0" :max="6" label="描述文字"></el-input-number>
            </el-form-item>
            <el-form-item
              label="数据字典类型"
              v-if="data.type === 'dic_select' || data.type === 'm_dic_select'"
              :required="true"
            >
              <el-select v-model="data.typeCode" value="" filterable>
                <el-option
                  v-for="item in dicTypeData"
                  :key="item.typeCode"
                  :label="item.typeName"
                  :value="item.typeCode"
                >
                </el-option>
              </el-select>
            </el-form-item>
              <el-form-item label="地图类型" v-if="data.type === 'gis_select'">
                <el-select v-model="data.options.gisType"  @change="data.options.positions=[]">
                    <el-option value="高德" label="高德"></el-option>
                    <el-option value="天地图" label="天地图"></el-option>
                </el-select>
            </el-form-item>
            <el-form-item label="地图缩放级别" v-if="data.type === 'gis_select'">
              <el-input v-model="data.options.zoom"></el-input>
            </el-form-item>
            <el-form-item label="中心点的纬度" v-if="data.type === 'gis_select'">
              <el-input v-model="data.options.lat"></el-input>
            </el-form-item>
            <el-form-item label="中心点的经度" v-if="data.type === 'gis_select'">
              <el-input v-model="data.options.lnt"></el-input>
            </el-form-item>
            <el-form-item label="所在城市" v-if="data.type === 'gis_select'">
              <el-input v-model="data.options.city"></el-input>
            </el-form-item>
            <el-form-item label="定位配置" v-if="data.type === 'gis_select'">
              <el-row style="margin-bottom: 10px"
                ><span>启用：</span>
                <el-switch v-model="data.options.allowLocation"></el-switch
              ></el-row>
              <template v-if="data.options.allowLocation">
                <el-row style="margin-bottom: 10px"> </el-row>
                <div>
                  <div
                    v-if="
                      data.options.positions instanceof Array &&
                      data.options.positions.length > 0
                    "
                    v-for="(item, index) in data.options.positions"
                  >
                    <span>位置{{ index + 1 }}:</span>
                    <el-input
                      @focus="openGisDialog(item)"
                      v-model="item.address"
                      style="width: 60%; display: inline-block; margin-bottom: 10px"
                    ></el-input>
                    <el-button
                      @click="removePosition(index)"
                      circle
                      plain
                      type="danger"
                      size="mini"
                      icon="el-icon-minus"
                      style="padding: 4px; margin-left: 5px"
                    ></el-button>
                  </div>
                  <el-dialog
                    title="地图定位"
                    :visible.sync="gisVisible"
                    width="60%"
                    append-to-body
                    @close="handlerGisClose"
                  >
                    <Gis
                      v-if="gisMapVisible"
                      :gisType="data.options.gisType"
                      :from-parent-gis-obj="editGisObj"
                      :gis-init-obj="gisInitObj"
                      @recGisMsg="recGisMsg"
                      :child-resp="notifyChild"
                      style="height: 500px"
                    ></Gis>
                  </el-dialog>
                </div>
                <el-button type="text" @click="addPosition">添加位置信息</el-button>
              </template>
            </el-form-item>
            <el-form-item label="开启显示" v-if="data.type === 'switch'">
              <el-input v-model="data.options.openMsg"></el-input>
            </el-form-item>
            <el-form-item label="关闭显示" v-if="data.type === 'switch'">
              <el-input v-model="data.options.closeMsg"></el-input>
            </el-form-item>
            <el-form-item
              label="布局方式"
              v-if="Object.keys(data.options).indexOf('inline') >= 0"
            >
              <el-radio-group v-model="data.options.inline">
                <el-radio-button :label="false">块级</el-radio-button>
                <el-radio-button :label="true">行内</el-radio-button>
              </el-radio-group>
            </el-form-item>
            <el-form-item
              label="显示输入框"
              v-if="Object.keys(data.options).indexOf('showInput') >= 0"
            >
              <el-switch v-model="data.options.showInput"></el-switch>
            </el-form-item>
            <el-form-item
              label="启用范围控制"
              v-if="Object.keys(data.options).indexOf('enableMinMax') >= 0"
            >
              <el-switch v-model="data.options.enableMinMax"></el-switch>
            </el-form-item>
            <template v-if="(data.options.hasOwnProperty('enableMinMax') && data.options.enableMinMax) || (!data.options.hasOwnProperty('enableMinMax'))">
              <el-form-item
                label="最小值"
                v-if="Object.keys(data.options).indexOf('min') >= 0"
              >
                <el-input-number v-model="data.options.min" :step="1"></el-input-number>
              </el-form-item>
              <el-form-item
                label="最大值"
                v-if="Object.keys(data.options).indexOf('max') >= 0"
              >
                <el-input-number
                  v-model="data.options.max"
                  :step="1"
                  :min="data.options.min"
                ></el-input-number>
              </el-form-item>
            </template>
           
             
            <el-form-item
              label="步长"
              v-if="Object.keys(data.options).indexOf('step') >= 0"
            >
              <el-input-number
                v-model="data.options.step"
                :min="0"
                :max="100"
                :step="1"
              ></el-input-number>
            </el-form-item>
            <el-form-item label="是否可搜索" v-if="data.type === 'select'">
              <el-switch v-model="data.options.filterable"></el-switch>
            </el-form-item>
            <el-form-item
              label="允许半选"
              v-if="Object.keys(data.options).indexOf('allowHalf') >= 0"
            >
              <el-switch v-model="data.options.allowHalf"> </el-switch>
            </el-form-item>
            <el-form-item
              label="支持透明度选择"
              v-if="Object.keys(data.options).indexOf('showAlpha') >= 0"
            >
              <el-switch v-model="data.options.showAlpha"></el-switch>
            </el-form-item>
            <el-form-item
              label="是否显示标签"
              v-if="Object.keys(data.options).indexOf('showLabel') >= 0"
            >
              <el-switch v-model="data.options.showLabel"></el-switch>
            </el-form-item>
            <el-form-item
              label="新增时是否为隐藏字段"
              v-if="Object.keys(data.options).indexOf('showFields') >= 0"
            >
              <el-switch v-model="data.options.showFields"></el-switch>
            </el-form-item>
            <el-form-item
              label="编辑时是否为隐藏字段"
              v-if="Object.keys(data.options).indexOf('editShowFields') >= 0"
            >
              <el-switch v-model="data.options.editShowFields"></el-switch>
            </el-form-item>
            <el-form-item
              label="选项"
              v-if="Object.keys(data.options).indexOf('options') >= 0"
            >
              <!--               <el-radio-group v-model="data.options.remote" size="mini" style="margin-bottom:10px;">
                                           <el-radio-button :label="true">静态数据</el-radio-button>
                                       </el-radio-group>-->
              <template v-if="data.type === 'radio' || data.type === 'select'">
                <el-radio-group v-model="data.options.defaultValue">
                  <draggable
                    tag="ul"
                    :list="data.options.options"
                    v-bind="{
                      group: { name: 'options' },
                      ghostClass: 'ghost',
                      handle: '.drag-item',
                    }"
                    handle=".drag-item"
                  >
                    <li  style="display: flex;"  v-for="(item, index) in data.options.options" :key="index">
                      <el-radio :label="item.value" style="margin-right: 0px;flex:1;display: flex;align-items: center;"  @click.native.prevent="handleClickRaio(item)">
                        <div style="display: flex;">
                          <el-input
                            style="flex:1;"
                            @change="item.label = item.value"
                            size="mini"
                            v-model="item.value"
                          ></el-input>
                          <el-input
                            style="flex:1;"
                            size="mini"
                            v-if="data.options.showLabel"
                            v-model="item.label"
                          ></el-input>
                        </div>
                      </el-radio>
                      <i
                        class="drag-item"
                        style="font-size: 16px; margin: 0 5px; cursor: move"
                        ><i class="iconfont icon-icon_bars"></i
                      ></i>
                      <el-button
                        @click="removeOptions(index)"
                        circle
                        plain
                        type="danger"
                        size="mini"
                        icon="el-icon-minus"
                        style="width: 20px;height: 20px;padding: 4px; "
                      ></el-button>
                    </li>
                  </draggable>
                </el-radio-group>
              </template>
              <template
                v-if="data.type === 'checkbox' || data.type === 'multiple_select'"
              >
                <el-checkbox-group v-model="data.options.defaultValue">
                  <draggable
                    tag="ul"
                    :list="data.options.options"
                    v-bind="{
                      group: { name: 'options' },
                      ghostClass: 'ghost',
                      handle: '.drag-item',
                    }"
                    handle=".drag-item"
                  >
                    <li v-for="(item, index) in data.options.options" :key="index">
                      <el-checkbox :label="item.value" style="margin-right: 5px">
                        <el-input
                          @change="item.label = item.value"
                          :style="{ width: data.options.showLabel ? '90px' : '80px' }"
                          size="mini"
                          v-model="item.value"
                        ></el-input>
                        <el-input
                          style="width: 90px"
                          size="mini"
                          v-if="data.options.showLabel"
                          v-model="item.label"
                        ></el-input>
                      </el-checkbox>
                      <i
                        class="drag-item"
                        style="font-size: 16px; margin: 0 5px; cursor: move"
                        ><i class="iconfont icon-icon_bars"></i
                      ></i>
                      <el-button
                        @click="removeOptions(index)"
                        circle
                        plain
                        type="danger"
                        size="mini"
                        icon="el-icon-minus"
                        style="padding: 4px; margin-left: 5px"
                      ></el-button>
                    </li>
                  </draggable>
                </el-checkbox-group>
              </template>
              <div style="margin-left: 22px">
                <el-button type="text" @click="addOption">添加选项</el-button>
                <el-button
                  type="text"
                  @click="controlRelVisible"
                  v-if="data.type === 'radio' || data.type === 'select'"
                >
                  关联控件
                </el-button>
              </div>
            </el-form-item>
            <el-form-item label="远端数据" v-if="data.type === 'cascade'">
              <div>
                <el-input size="mini" style="" v-model="data.options.remoteCall">
                  <template slot="prepend">远端方法</template>
                </el-input>
                <el-input size="mini" style="" v-model="data.options.props.value">
                  <template slot="prepend">值</template>
                </el-input>
                <el-input size="mini" style="" v-model="data.options.props.label">
                  <template slot="prepend">标签</template>
                </el-input>
                <el-input size="mini" style="" v-model="data.options.props.children">
                  <template slot="prepend">子选项</template>
                </el-input>
              </div>
            </el-form-item>
            <el-form-item label="默认值" v-if="showDefaultValue">
              <el-input
                v-if="data.type === 'textarea'"
                type="textarea"
                :rows="5"
                v-model="data.options.defaultValue"
              ></el-input>
              <el-input
                v-if="data.type === 'input'"
                v-model="data.options.defaultValue"
              ></el-input>
              <el-input
                v-if="data.type === 'text'"
                v-model="data.options.defaultValue"
              ></el-input>
              <el-rate
                v-if="data.type === 'rate'"
                style="display: inline-block; vertical-align: middle"
                :max="data.options.max"
                :allow-half="data.options.allowHalf"
                v-model="data.options.defaultValue"
              ></el-rate>
              <el-button
                type="text"
                v-if="data.type === 'rate'"
                style="display: inline-block; vertical-align: middle; margin-left: 10px"
                @click="data.options.defaultValue = 0"
                >清空
              </el-button>
              <el-color-picker
                v-if="data.type === 'color'"
                v-model="data.options.defaultValue"
                :show-alpha="data.options.showAlpha"
              ></el-color-picker>
              <el-switch
                v-if="data.type === 'switch'"
                v-model="data.options.defaultValue"
              ></el-switch>
            </el-form-item>
            <template v-if="showDatePlaceholderSet">
              <el-form-item
                label="开始时间占位内容"
                v-if="
                  data.options.isRange ||
                  data.options.type === 'datetimerange' ||
                  data.options.type === 'daterange'
                "
              >
                <el-input v-model="data.options.startPlaceholder"></el-input>
              </el-form-item>
              <el-form-item
                label="结束时间占位内容"
                v-if="
                  data.options.isRange ||
                  data.options.type === 'datetimerange' ||
                  data.options.type === 'daterange'
                "
              >
                <el-input v-model="data.options.endPlaceholder"></el-input>
              </el-form-item>
              <el-form-item label="格式">
                <el-input v-model="data.options.format" disabled></el-input>
              </el-form-item>
              <el-form-item
                label="默认值"
                v-if="
                  data.type === 'time' &&
                  Object.keys(data.options).indexOf('isRange') >= 0
                "
              >
                <el-radio-group
                  v-model="data.options.defaultType"
                  style="margin-bottom: 10px"
                  @change="defaultTypeChange"
                >
                  <el-radio :label="0">自定义时间</el-radio>
                  <el-radio :label="1">当前时间</el-radio>
                </el-radio-group>
                <div v-show="data.options.defaultType == 0">
                  <el-time-picker
                    key="1"
                    style="width: 100%"
                    v-if="!data.options.isRange"
                    v-model="data.options.defaultValue"
                    :arrowControl="data.options.arrowControl"
                    :value-format="data.options.format"
                  >
                  </el-time-picker>
                  <el-time-picker
                    key="2"
                    v-if="data.options.isRange"
                    style="width: 100%"
                    v-model="data.options.defaultValue"
                    is-range
                    :arrowControl="data.options.arrowControl"
                    :value-format="data.options.format"
                  >
                  </el-time-picker>
                </div>
              </el-form-item>
              <el-form-item
                label="默认值"
                v-if="
                  data.type === 'date' ||
                  data.type === 'datetime' ||
                  data.type === 'year' ||
                  data.type === 'month' ||
                  data.type === 'year_month'
                "
              >
                <el-radio-group
                  v-model="data.options.defaultType"
                  style="margin-bottom: 10px"
                  @change="defaultTypeChange"
                >
                  <el-radio :label="0">自定义时间</el-radio>
                  <el-radio :label="1">当前时间</el-radio>
                </el-radio-group>
                <el-date-picker
                  v-show="data.options.defaultType == 0"
                  v-if="data.type === 'datetime'"
                  v-model="data.options.defaultValue"
                  type="datetime"
                  :is-range="data.options.isRange"
                  :placeholder="data.options.placeholder"
                  :start-placeholder="data.options.startPlaceholder"
                  :end-placeholder="data.options.endPlaceholder"
                  :clearable="data.options.clearable"
                  style="width: 100%"
                  :value-format="data.options.format"
                >
                </el-date-picker>
                <el-date-picker
                  v-if="
                    data.type === 'date' ||
                    data.type === 'year' ||
                    data.type === 'month' ||
                    data.type === 'year_month'
                  "
                  v-show="data.options.defaultType == 0"
                  style="width: 100%"
                  v-model="data.options.defaultValue"
                  :type="data.options.type"
                  :placeholder="data.options.placeholder"
                  :start-placeholder="data.options.startPlaceholder"
                  :end-placeholder="data.options.endPlaceholder"
                  :format="data.options.format"
                  :clearable="data.options.clearable"
                  :value-format="data.options.format"
                >
                </el-date-picker>
              </el-form-item>
            </template>
            <template v-if="data.type === 'user_select'">
              <el-form-item label="默认值">
                <el-checkbox v-model="data.options.defaultCurrentUser" style="color: #fff"
                  >默认当前用户
                </el-checkbox>
              </el-form-item>
            </template>
            <template>
              <el-form-item
                label="数据配置"
                v-if="data.type === 'current_user'"
                :required="true"
              >
                <el-button type="text" @click.stop="currentUserVisible = true">
                  添加配置
                </el-button>
              </el-form-item>
            </template>
            <template v-if="showSelectSet">
              <template v-if="data.options.maps && !data.options.maps.source">
                <el-form-item label="数据配置" :required="true">
                  <el-select
                    v-model="data.title"
                    placeholder="请选择"
                    @change="selectDataSource"
                    filterable
                    :disabled="showSysSelectSet || data.source === 0"
                    value=""
                  >
                    <el-option
                      v-for="item in mapsOptions"
                      :key="item.title"
                      :label="item.title"
                      :value="item.title"
                    >
                    </el-option>
                  </el-select>
                  <el-button
                    type="text"
                    @click.stop="showMappingConfig"
                    :disabled="data.source === 0"
                  >
                    添加配置
                  </el-button>
                </el-form-item>
                <el-form-item label="接口地址" :required="true">
                  <el-input v-model="data.options.remoteUrl" disabled></el-input>
                </el-form-item>
              </template>
              <template v-else>
                <el-form-item label="数据类型" :required="true">
                  <el-radio-group v-model="data.options.dataSelectType" @change="dataSelectTypeChange">
                    <el-radio label="0">表单数据</el-radio>
                    <el-radio label="1">接口数据</el-radio>
                  </el-radio-group>
                </el-form-item>
                <el-form-item v-if="data.options.dataSelectType === '0'" label="数据配置" :required="true">
                  <el-input :value="data.options.maps.source.table"  @focus="selectTableVisible = true"   placeholder="请选择"  ></el-input>
                  <el-button
                    type="text"
                    @click.stop="showMappingConfig"
                    :disabled="data.source === 0"
                    v-show="
                      data.options.maps.source.table &&
                      data.options.maps.source.table !== '' &&
                      data.options.maps.source.table !== null
                    "
                  >
                    添加配置
                  </el-button>
                  <selectTable  :visible.sync="selectTableVisible" v-model="data.options.maps.source.table" @change="changeSourceSelect"></selectTable>
                </el-form-item>
                
                <el-form-item v-else-if="data.options.dataSelectType === '1'" label="接口地址" :required="true">
                  <el-input v-model="data.options.remoteUrl"  style="width:208px"></el-input>
                  <el-button
                    type="text"
                    @click.stop="dataSelectParamsSettingShow = true"
                  >
                    数据配置
                  </el-button>
                    <el-dialog
                      title="接口参数设置"
                      :visible.sync="dataSelectParamsSettingShow"
                      :modal="false"
                      v-if="dataSelectParamsSettingShow"
                      :before-close="dataSelectParamsSettingClose"
                      custom-class="dataConfig"
                      :close-on-click-modal="false"
                    >  
                       <dataSelectinterfaceSetting :formItemList="formItemList" :data="data"></dataSelectinterfaceSetting>
                    </el-dialog>
                </el-form-item>
              </template>
            </template>
            <template
              v-if="
                data.type === 'file_upload' ||
                data.type === 'image_upload' ||
                data.type === 'signature'
              "
            >
              <el-form-item label="最大上传数">
                <el-input
                  type="number"
                  v-model.number="data.options.length"
                  min="1"
                ></el-input>
              </el-form-item>
              <el-form-item label="限制大小(M)">
                <el-input
                  type="number"
                  v-model.number="data.options.maxFileSize"
                  min="1"
                  max="10"
                ></el-input>
              </el-form-item>
              <el-form-item label="上传地址" :required="true">
                <el-input v-model="data.options.action" disabled></el-input>
              </el-form-item>
              <el-form-item v-if="data.type === 'image_upload'" label="模板图片">
                <uploadFlie :key="data.key" v-model="data.options.presetImgs" limit></uploadFlie>
              </el-form-item>
            </template>

            <template v-if="data.type === 'grid'">
              <el-form-item label="栅格间隔">
                <el-input type="number" v-model.number="data.options.gutter"></el-input>
              </el-form-item>
              <el-form-item label="列配置项">
                <draggable
                  tag="ul"
                  :list="data.columns"
                  v-bind="{
                    group: { name: 'options' },
                    ghostClass: 'ghost',
                    handle: '.drag-item',
                  }"
                  handle=".drag-item"
                >
                  <li v-for="(item, index) in data.columns" :key="index">
                    <i
                      class="drag-item"
                      style="font-size: 16px; margin: 0 5px; cursor: move"
                      ><i class="iconfont icon-icon_bars"></i
                    ></i>
                    <el-input
                      placeholder="栅格值"
                      size="mini"
                      style="width: 100px"
                      type="number"
                      v-model.number="item.span"
                      :min="0"
                    ></el-input>

                    <el-button
                      @click="removeOptions(index)"
                      circle
                      plain
                      type="danger"
                      size="mini"
                      icon="el-icon-minus"
                      style="padding: 4px; margin-left: 5px"
                    ></el-button>
                  </li>
                </draggable>
                <div style="margin-left: 22px">
                  <el-button type="text" @click="handleAddColumn">添加列</el-button>
                </div>
              </el-form-item>
            </template>
            <template v-if="data.type !== 'grid'">
              <el-form-item label="字段属性" v-show="false">
                <el-input v-model="data.model"></el-input>
              </el-form-item>
              <div
                v-if="
                  data.type !== 'file_upload' &&
                  data.type !== 'image_upload' &&
                  data.type !== 'signature' &&
                  data.type !== 'grid' &&
                  data.type !== 'table' &&
                  data.type !== 'flow_table' &&
                  data.type !== 'text' &&
                  data.type !== 'current_user'
                "
              >
                <el-form-item label="操作属性">
                  <el-checkbox
                    v-model="data.options.readonly"
                    v-if="Object.keys(data.options).indexOf('readonly') >= 0"
                    >完全只读
                  </el-checkbox>
                  <el-checkbox
                    v-model="data.options.disabled"
                    :disabled="data.options.required"
                    v-if="Object.keys(data.options).indexOf('disabled') >= 0"
                    style="color: #fff"
                    >禁用
                  </el-checkbox>
                  <el-checkbox
                    v-model="data.options.editDisabled"
                    v-if="data.options.hasOwnProperty('editDisabled')"
                    style="color: #fff"
                    >编辑禁用
                  </el-checkbox>
                  <el-checkbox
                    v-model="data.options.editable"
                    v-if="Object.keys(data.options).indexOf('editable') >= 0"
                    style="color: #fff"
                    >文本框可输入
                  </el-checkbox>
                  <el-checkbox
                    v-model="data.options.clearable"
                    v-if="Object.keys(data.options).indexOf('clearable') >= 0"
                    style="color: #fff"
                    >显示清除按钮
                  </el-checkbox>
                  <el-checkbox
                    v-model="data.options.arrowControl"
                    v-if="Object.keys(data.options).indexOf('arrowControl') >= 0"
                    style="color: #fff"
                    >使用箭头进行时间选择
                  </el-checkbox>
                  <el-checkbox
                    v-model="data.options.isDelete"
                    v-if="Object.keys(data.options).indexOf('isDelete') >= 0"
                    style="color: #fff"
                    >删除
                  </el-checkbox>
                  <el-checkbox
                    v-model="data.options.isEdit"
                    v-if="Object.keys(data.options).indexOf('isEdit') >= 0"
                    style="color: #fff"
                  >
                    编辑
                  </el-checkbox>
                </el-form-item>
              </div>
              <div
                v-if="
                  data.type !== 'grid' &&
                  data.type !== 'table' &&
                  data.type !== 'flow_table' &&
                  data.type !== 'text' &&
                  data.type !== 'current_user'
                "
              >
                <el-form-item label="校验">
                  <el-checkbox
                    v-model="data.options.required"
                    :disabled="data.options.disabled"
                    style="color: #fff"
                    >必填
                  </el-checkbox>
                  <span
                    v-if="
                      data.type === 'input_number' ||
                      data.type === 'input_int' ||
                      data.type === 'input_long' ||
                      data.type === 'number' ||
                      data.type === 'select' ||
                      data.type === 'radio'
                    "
                    style=" font-size: 10px"
                  >
                    <span style="color: #8bc3fc">(勾选后可做为流程条件)</span>
                  </span>
                  <div
                    v-if="Object.keys(data.options).indexOf('pattern') >= 0"
                    v-show="false"
                  >
                    <el-input
                      size="mini"
                      v-model.lazy="data.options.pattern"
                      @change=""
                      style="width: 240px"
                      placeholder="正则表达式"
                    ></el-input>
                  </div>
                </el-form-item>
              </div>
            </template>
            <el-form-item
              label="样式"
              v-if="
                data.type !== 'switch' &&
                data.type !== 'radio' &&
                data.type !== 'checkbox' &&
                data.type !== 'image_upload' &&
                data.type !== 'signature' &&
                data.type !== 'file_upload' &&
                data.type !== 'grid'
              "
            >
              <div style="margin-top: 10px; margin-bottom: 10px">
                <el-row :span="24">
                  <el-col :span="6">
                    <div class="secondary-font-color" style="color: #fff">背景色</div>
                    <el-color-picker
                      v-model="data.widgetBackgroundColor"
                      show-alpha
                    ></el-color-picker>
                  </el-col>
                  <el-col :span="6">
                    <div class="secondary-font-color" style="color: #fff">字体</div>
                    <el-color-picker
                      v-model="data.widgetFontColor"
                      show-alpha
                    ></el-color-picker>
                  </el-col>
                  <el-col :span="6">
                    <div class="secondary-font-color" style="color: #fff">图标</div>
                    <el-color-picker
                      v-model="data.widgetIconColor"
                      show-alpha
                    ></el-color-picker>
                  </el-col>
                  <el-col :span="6" v-show="data.type === 'number'">
                    <div class="secondary-font-color" style="color: #fff">其他</div>
                    <el-color-picker
                      v-model="data.widgetIconBackgroundColor"
                      show-alpha
                    ></el-color-picker>
                  </el-col>
                </el-row>
              </div>
              <div style="margin-top: 10px; margin-bottom: 10px">
                <div class="secondary-font-color" style="color: #fff">标题大小/颜色</div>
                <el-select
                  v-model="data.widgetTitleFontSize"
                  :popper-append-to-body="false"
                  style="width: 45%"
                  value=""
                >
                  <el-option
                    v-for="item in Constants.viceValueSizeOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-color-picker
                  v-model="data.widgetTitleFontColor"
                  show-alpha
                  style="position: absolute; left: 50%"
                ></el-color-picker>
                <div class="secondary-font-color" style="color: #fff">边框样式</div>
                <el-select
                  v-model="data.widgetBorderSize"
                  :popper-append-to-body="false"
                  style="width: 45%"
                  value=""
                >
                  <el-option
                    v-for="item in Constants.borderWidthOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value"
                  ></el-option>
                </el-select>
                <el-color-picker
                  v-model="data.widgetBorderColor"
                  show-alpha
                  style="position: absolute; left: 50%"
                ></el-color-picker>
              </div>
            </el-form-item>
            <el-form-item label="样式" v-if="data.type === 'switch'">
              <div style="margin-top: 10px; margin-bottom: 10px">
                <el-row :span="24">
                  <el-col :span="6">
                    <div class="secondary-font-color" style="color: #fff">打开</div>
                    <el-color-picker v-model="data.widgetActiveColor"></el-color-picker>
                  </el-col>
                  <el-col :span="6">
                    <div class="secondary-font-color" style="color: #fff">关闭</div>
                    <el-color-picker
                      v-model="data.widgetInActiveColorr"
                    ></el-color-picker>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
            <el-form-item
              label="样式"
              v-if="
                data.type === 'image_upload' ||
                data.type === 'signature' ||
                data.type === 'file_upload'
              "
            >
              <div style="margin-top: 10px; margin-bottom: 10px">
                <el-row :span="24">
                  <el-col :span="8">
                    <div class="secondary-font-color" style="color: #fff">背景色</div>
                    <el-color-picker
                      v-model="data.btnWidgetBackgroundColor"
                      show-alpha
                    ></el-color-picker>
                  </el-col>
                  <el-col :span="8">
                    <div class="secondary-font-color" style="color: #fff">字体</div>
                    <el-color-picker
                      v-model="data.btnWidgetFontColor"
                      show-alpha
                    ></el-color-picker>
                  </el-col>
                  <el-col :span="8">
                    <div class="secondary-font-color" style="color: #fff">提示语</div>
                    <el-color-picker
                      v-model="data.uploadTipFontColor"
                      show-alpha
                    ></el-color-picker>
                  </el-col>
                </el-row>
              </div>
            </el-form-item>
          </div>
        </el-form>
      </div>
      <div style="padding: 10px" v-show="activeName === 'second'">
        <el-form label-position="top">
          <el-form-item label="标签对齐方式">
            <el-radio-group v-model="config.labelPosition">
              <el-radio-button label="left">左对齐</el-radio-button>
              <el-radio-button label="right">右对齐</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="标签宽度">
            <el-input-number
              v-model="config.labelWidth"
              :min="0"
              :max="200"
              :step="10"
            ></el-input-number>
          </el-form-item>
          <el-form-item label="标签后缀">
            <el-input v-model="config.labelSuffix"></el-input>
          </el-form-item>
          <el-form-item label="控件尺寸">
            <el-radio-group v-model="config.size">
              <el-radio-button label="medium">medium</el-radio-button>
              <el-radio-button label="small">small</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="表名">
            <el-input v-model="config.tableName"></el-input>
          </el-form-item>
          <el-form-item label="是否生成默认字段">
            <el-radio-group v-model="config.generateDefaultFields">
              <el-radio-button label="0">是</el-radio-button>
              <el-radio-button label="1">否</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="游客访问权限">
             <div style="margin:5px 0;"> 
                <div class="secondary-font-color" style="color: #fff">启用</div>
                 <el-radio-group v-model="config.visitorAccess.allow">
                    <el-radio-button :label="true">是</el-radio-button>
                    <el-radio-button :label="false">否</el-radio-button>
                  </el-radio-group>
             </div>
              <div style="margin:5px 0;" v-show="config.visitorAccess.allow">
                <div class="secondary-font-color" style="color: #fff">操作类型</div>
                <el-checkbox-group v-model="config.visitorAccess.type">
                      <el-checkbox
                        v-for="(item, index) in visitorAccessTypeCheckbox"
                        :key="index"
                        :label="item.value"
                        >{{ item.label }}</el-checkbox
                      >
                </el-checkbox-group>
             </div>
          </el-form-item>
          <el-form-item label="企业访问权限（无企业控件生效）">
             <div style="margin:5px 0;"> 
                <div class="secondary-font-color" style="color: #fff">启用</div>
                 <el-radio-group v-model="config.companyAccess.allow">
                    <el-radio-button :label="true">是</el-radio-button>
                    <el-radio-button :label="false">否</el-radio-button>
                  </el-radio-group>
             </div>
              <div style="margin:5px 0;" v-show="config.companyAccess.allow">
                <div class="secondary-font-color" style="color: #fff">操作类型</div>
                <el-checkbox-group v-model="config.companyAccess.type">
                      <el-checkbox
                        v-for="(item, index) in EnterpriseAccessTypeCheckbox"
                        :key="index"
                        :label="item.value"
                        >{{ item.label }}</el-checkbox
                      >
                </el-checkbox-group>
             </div>
          </el-form-item>
          <el-form-item label="背景颜色">
            <el-color-picker
              v-model="config.backgroundColor"
              show-alpha
            ></el-color-picker>
          </el-form-item>
          <el-form-item label="控件">
            <div style="margin-top: 10px; margin-bottom: 10px">
              <el-row :span="24">
                <el-col :span="8">
                  <div class="secondary-font-color" style="color: #fff">背景色</div>
                  <el-color-picker
                    v-model="config.widgetBackgroundColor"
                    show-alpha
                  ></el-color-picker>
                </el-col>
                <el-col :span="8">
                  <div class="secondary-font-color" style="color: #fff">字体</div>
                  <el-color-picker
                    v-model="config.widgetFontColor"
                    show-alpha
                  ></el-color-picker>
                </el-col>
                <el-col :span="8">
                  <div class="secondary-font-color" style="color: #fff">图标</div>
                  <el-color-picker
                    v-model="config.widgetIconColor"
                    show-alpha
                  ></el-color-picker>
                </el-col>
              </el-row>
            </div>
            <div style="margin-top: 10px; margin-bottom: 10px">
              <div class="secondary-font-color" style="color: #fff">标题大小/颜色</div>
              <el-select
                v-model="config.widgetTitleFontSize"
                :popper-append-to-body="false"
                style="width: 45%"
                value=""
              >
                <el-option
                  v-for="item in Constants.viceValueSizeOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-color-picker
                v-model="config.widgetTitleFontColor"
                show-alpha
                style="position: absolute; left: 50%"
              ></el-color-picker>
              <div class="secondary-font-color" style="color: #fff">边框样式</div>
              <el-select
                v-model="config.widgetBorderSize"
                :popper-append-to-body="false"
                style="width: 45%"
                value=""
              >
                <el-option
                  v-for="item in Constants.borderWidthOptions"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value"
                ></el-option>
              </el-select>
              <el-color-picker
                v-model="config.widgetBorderColor"
                show-alpha
                style="position: absolute; left: 50%"
              ></el-color-picker>
            </div>
          </el-form-item>
          <el-form-item label="按钮">
            <div style="margin-top: 10px; margin-bottom: 10px">
              <el-row :span="24">
                <el-col :span="8">
                  <div class="secondary-font-color" style="color: #fff">背景色</div>
                  <el-color-picker
                    v-model="config.btnWidgetBackgroundColor"
                    show-alpha
                  ></el-color-picker>
                </el-col>
                <el-col :span="8">
                  <div class="secondary-font-color" style="color: #fff">字体</div>
                  <el-color-picker
                    v-model="config.btnWidgetFontColor"
                    show-alpha
                  ></el-color-picker>
                </el-col>
                <el-col :span="8">
                  <div class="secondary-font-color" style="color: #fff">提示语</div>
                  <el-color-picker
                    v-model="config.uploadTipFontColor"
                    show-alpha
                  ></el-color-picker>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
          <el-form-item label="表格风格"> 
            <div style="margin-top: 10px; margin-bottom: 10px">
              <el-row :span="24">
                <el-col :span="12">
                    <div class="secondary-font-color" style="color: #fff">启用</div>
                    <el-switch v-model="config.isBorder"></el-switch>
                </el-col>
                 <el-col :span="12">
                  <div class="secondary-font-color" style="color: #fff">线颜色</div>
                  <el-color-picker
                    v-model="config.borderColor"
                    show-alpha
                  ></el-color-picker>
                </el-col>
              </el-row>
              <el-row :span="24">
                <el-col :span="12">
                  <div class="secondary-font-color" style="color: #fff">线类型</div>
                  <el-select
                    v-model="config.borderStyle"
                    :popper-append-to-body="false"
                    style="width: 90%"
                  >
                    <el-option
                      v-for="item in Constants.borderStyleOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value"
                    ></el-option>
                  </el-select>
                </el-col>
                <el-col :span="12">
                  <div class="secondary-font-color" style="color: #fff">线宽</div>
                  <el-input-number
                      style="width:90%"
                      v-model="config.borderWidth"
                      :min="0"
                      :max="15"
                      :step="0.5"
                  ></el-input-number>
                </el-col>
              </el-row>
            </div>
          </el-form-item>
        </el-form>
      </div>
    </el-main>
    <!--重构后-->
    <el-dialog
      title="关联数据配置"
      :visible.sync="columnSetVisible"
      :modal="false"
      :close-on-click-modal="false"
      v-if="show"
      @close="saveRelatedConfig"
      :before-close="dataSelectParamsSettingClose"
      custom-class="dataConfig"
    >
      <el-tabs
        v-if="data.options.maps"
        v-model="columnSetActiveName"
        @tab-click="handleColumnSetClick"
      >
        <el-tab-pane label="数据库映射配置" name="first">
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
                      v-model="data.options.maps.key"
                      placeholder="请选择"
                      size="mini"
                      value=""
                      @change="selectKeySet"
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
                      v-model="data.options.maps.name"
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
        </el-tab-pane>
        <el-tab-pane label="数据选择配置" name="second">
          <div style="position: relative; padding-left: 10px" v-if="data.options.maps">
            <el-form>
              <el-form-item label="">
                <el-input
                  v-model="data.options.maps.title"
                  style="width: 20%"
                  placeholder="弹窗标题"
                ></el-input>
              </el-form-item>
            </el-form>
          </div>
          <div class="block" v-if="data.options.maps">
            <form-result-transfer-no-save-btn
              v-if="transferHackSet"
              sourcetitle="请选择"
              targettitle="已选择"
              :sourcedata="columnDescOptions"
              :targetdata="columnDescSelected"
              :custom="false"
              :is-result="false"
              :closed-notify-num="closedNotifyNum"
              @submitDataToParent="saveColumnSet"
            ></form-result-transfer-no-save-btn>
          </div>
        </el-tab-pane>
        <el-tab-pane
          v-if="this.data.type === 'data_select'"
          label="自动赋值配置"
          name="third"
        >
         <assignmentSetting :formItemList="formItemList" :data="data" :columnDescOptions="columnDescOptions"></assignmentSetting>
        </el-tab-pane>
        <el-tab-pane label="数据过滤" name="four">
          <el-row>
            <el-button
              size="mini"
              @click="colsCondFilters.dialogVisible = true"
              icon="el-icon-edit"
              type="primary"
              >添加
            </el-button>
          </el-row>
          <el-row style="padding-top: 10px" v-if="data.options.maps">
            <el-table
              :data="data.options.maps.condFilters"
              size="mini"
              highlight-current-row
              border
              style="width: 95%"
              ref="mappingRef"
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column prop="model" label="当前表单字段">
                <template slot-scope="scope">
                  <span>{{ scope.row.name }}</span>
                  <!-- <el-select
                    v-model="scope.row.model"
                    placeholder="请选择"
                    size="mini"
                    value=""
                  >

                    <el-option
                      v-for="item in dynCols"
                      :key="item.model"
                      :label="item.name"
                      :value="item.model"
                    >
                    </el-option>
                  </el-select> -->
                </template>
              </el-table-column>
              <el-table-column prop="selectKey" label="过滤条件">
                <template slot-scope="scope">
                  <div class="condFilter" @click="openCondFilterSeting(scope.row)">
                    <p>过滤方式：{{ filterTypeName(scope.row) }}</p>
                    <p>条件形式: {{ condTypeName(scope.row) }}</p>
                    <p>过滤条件: {{ condsName(scope.row) }}</p>
                  </div>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleCondFiltersDelete(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
          <!--列设置-过滤器对话框-->
          <el-dialog
            :title="'添加过滤器'"
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
                :item-data="colsCondFilters.itemData"
                :cols-array="colsCondFilters.colums"
                show-type="condFilters"
                :formName="data.options.maps.source.table"
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
            :visible.sync="condFilterConfig.dialogVisible"
            v-if="condFilterConfig.dialogVisible"
            :append-to-body="true"
            custom-class="form-cond-filter-dialog"
            width="35%"
            :close-on-click-modal="false"
            :close-on-press-escape="false"
          >
            <template v-slot:default>
              <form-cond-filter
                ref="formCondFilter"
                :formConfig="condFilterConfig.formConfig"
                :itemDataCondFilter="condFilterConfig.currentItemDataCondFilter"
              ></form-cond-filter>
            </template>
            <template v-slot:footer>
              <el-button @click="closeCondFilterConfigDialog">取消</el-button>
              <el-button type="primary" @click="saveCondFilterConfig">确定</el-button>
            </template>
          </el-dialog>
        </el-tab-pane>
        <el-tab-pane label="数据传参设置" name="five">
          <dataSelectParamsSetting :formItemList="formItemList" :options="data.options" :columnDescOptions="columnDescOptions"></dataSelectParamsSetting>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!--重构前-->
    <el-dialog
      title="关联数据配置"
      :visible.sync="mappingVisible"
      v-if="show"
      :close-on-click-modal="false"
      width="1000px"
      :modal="false"
      custom-class="dataConfig"
    >
      <el-tabs
        v-if="data.options.maps"
        v-model="mappingActiveName"
        @tab-click="handleMappingClick"
      >
        <el-tab-pane label="数据库映射配置" name="first">
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
                    <el-input v-model="data.options.maps.key" :disabled="true"></el-input>
                  </template>
                  <template v-if="scope.$index === 1">
                    <el-input
                      v-model="data.options.maps.name"
                      :disabled="true"
                    ></el-input>
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
        </el-tab-pane>
        <el-tab-pane label="自动赋值配置" name="second" v-if="showMappingConfigSet">
          <el-row>
            <el-button
              size="mini"
              @click="addMappingRow"
              icon="el-icon-edit"
              type="primary"
              >添加
            </el-button>
          </el-row>
          <el-row style="padding-top: 10px" v-if="data.options.maps">
            <el-table
              :data="data.options.maps.mapping"
              size="mini"
              highlight-current-row
              border
              style="width: 95%"
              ref="mappingRef"
            >
              <el-table-column type="index" width="50"> </el-table-column>
              <el-table-column prop="selectKey" label="数据配置字段">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.selectKey"
                    placeholder="请选择"
                    size="mini"
                    @change="scope.row.model = ''"
                  >
                    <el-option
                      v-for="item in mappingObj[data.model]"
                      :key="item.model"
                      :label="item.name"
                      :value="item.model"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column prop="model" label="当前表单字段">
                <template slot-scope="scope">
                  <el-select
                    v-model="scope.row.model"
                    @change="setMappingType(scope.row,userSelectDynCols(scope.row.selectKey),$event)"
                    placeholder="请选择"
                    size="mini"
                  >
                    <el-option
                      v-for="item in userSelectDynCols(scope.row.selectKey)"
                      :key="item.model"
                      :label="item.name"
                      :value="item.model"
                    >
                    </el-option>
                  </el-select>
                </template>
              </el-table-column>
              <el-table-column label="操作" width="100px">
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="danger"
                    @click="handleMappingDelete(scope.$index, scope.row)"
                  >
                    删除
                  </el-button>
                </template>
              </el-table-column>
            </el-table>
          </el-row>
        </el-tab-pane>
      </el-tabs>
    </el-dialog>
    <!-- 当前用户关联数据配置 -->
    <el-dialog
      title="关联数据配置"
      :visible.sync="currentUserVisible"
      v-if="show"
      width="650px"
      :modal="false"
    >
      <el-row style="padding: 10px">
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
          <el-table-column prop="name" label="控件字段备注">
            <template slot-scope="scope">
              <el-input v-model="data.key_name" v-if="scope.$index === 0"></el-input>
              <el-input v-model="data.label_name" v-if="scope.$index === 1"></el-input>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="控件字段标识">
            <template slot-scope="scope">
              <el-input v-model="data.model" v-if="scope.$index === 0"></el-input>
              <el-input v-model="data.label_model" v-if="scope.$index === 1"></el-input>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <!--GIS控件-->
    <el-dialog
      title="关联数据配置"
      :visible.sync="gisMappingVisible"
      v-if="show"
      width="1000px"
      :modal="false"
      custom-class="dataConfig"
    >
      <el-row style="padding-top: 10px">
        <el-table
          :data="gisRelatedConfigTable"
          size="mini"
          highlight-current-row
          border
          style="width: 95%"
        >
          <el-table-column type="index" width="100">
            <template slot-scope="scope">
              <template v-if="scope.$index === 0"> 经度 </template>
              <template v-if="scope.$index === 1"> 纬度 </template>
              <template v-if="scope.$index === 2"> 详细地址 </template>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="字段名称">
            <template slot-scope="scope">
              <template v-if="scope.$index === 0">
                <el-input v-model="data.modelExt.lntName"></el-input>
              </template>
              <template v-if="scope.$index === 1">
                <el-input v-model="data.modelExt.latName"></el-input>
              </template>
              <template v-if="scope.$index === 2">
                <el-input v-model="data.modelExt.addressName"></el-input>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="字段标识">
            <template slot-scope="scope">
              <template v-if="scope.$index === 0">
                <el-input v-model="data.modelExt.lnt"></el-input>
              </template>
              <template v-if="scope.$index === 1">
                <el-input v-model="data.modelExt.lat"></el-input>
              </template>
              <template v-if="scope.$index === 2">
                <el-input v-model="data.modelExt.address"></el-input>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <cus-dialog
      v-if="show"
      :visible="associateControl.visible"
      :title="associateControl.title"
      :show-close="false"
      width="1000px"
    >
      <div class="associate-control">
        <h4>根据选择的选项，控制其他控件是否显示。当前控件和上级选项不能被关联显示</h4>
        <el-table border :data="data.options.options">
          <el-table-column label="当选项为" prop="value" width="300px"></el-table-column>
          <el-table-column label="显示以下控件">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.relatedList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in controlList"
                  :disabled="item.isDisabled"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template slot="action">
        <el-button @click="cancelRelated">取消</el-button>
        <el-button type="primary" @click="sureRelated">确 定</el-button>
      </template>
    </cus-dialog>
    <!--行政区划控件-->
    <el-dialog
      title="关联数据配置"
      :visible.sync="regionMappingVisible"
      v-if="show"
      width="1000px"
      :modal="false"
      custom-class="dataConfig"
    >
      <el-row style="padding-top: 10px">
        <el-table
          :data="regionRelatedConfigTable"
          size="mini"
          highlight-current-row
          border
          style="width: 95%"
        >
          <el-table-column type="index" width="100">
            <template slot-scope="scope">
              <template v-if="scope.$index === 0"> 省份 </template>
              <template v-if="scope.$index === 1"> 省份代码 </template>
              <template v-if="scope.$index === 2"> 市 </template>
              <template v-if="scope.$index === 3"> 市代码 </template>
              <template v-if="scope.$index === 4"> 区县 </template>
              <template v-if="scope.$index === 5"> 区县代码 </template>
            </template>
          </el-table-column>
          <el-table-column prop="name" label="字段名称">
            <template slot-scope="scope">
              <template v-if="scope.$index === 0">
                <el-input v-model="data.modelExt.provinceName"></el-input>
              </template>
              <template v-if="scope.$index === 1">
                <el-input v-model="data.modelExt.provinceCodeName"></el-input>
              </template>
              <template v-if="scope.$index === 2">
                <el-input v-model="data.modelExt.cityName"></el-input>
              </template>
              <template v-if="scope.$index === 3">
                <el-input v-model="data.modelExt.cityCodeName"></el-input>
              </template>
              <template v-if="scope.$index === 4">
                <el-input v-model="data.modelExt.areaName"></el-input>
              </template>
              <template v-if="scope.$index === 5">
                <el-input v-model="data.modelExt.areaCodeName"></el-input>
              </template>
            </template>
          </el-table-column>
          <el-table-column prop="model" label="字段标识">
            <template slot-scope="scope">
              <template v-if="scope.$index === 0">
                <el-input v-model="data.modelExt.province"></el-input>
              </template>
              <template v-if="scope.$index === 1">
                <el-input v-model="data.modelExt.provinceCode"></el-input>
              </template>
              <template v-if="scope.$index === 2">
                <el-input v-model="data.modelExt.city"></el-input>
              </template>
              <template v-if="scope.$index === 3">
                <el-input v-model="data.modelExt.cityCode"></el-input>
              </template>
              <template v-if="scope.$index === 4">
                <el-input v-model="data.modelExt.area"></el-input>
              </template>
              <template v-if="scope.$index === 5">
                <el-input v-model="data.modelExt.areaCode"></el-input>
              </template>
            </template>
          </el-table-column>
        </el-table>
      </el-row>
    </el-dialog>
    <cus-dialog
      v-if="show"
      :visible="associateControl.visible"
      :title="associateControl.title"
      :show-close="false"
      width="1000px"
    >
      <div class="associate-control">
        <h4>根据选择的选项，控制其他控件是否显示。当前控件和上级选项不能被关联显示</h4>
        <el-table border :data="data.options.options">
          <el-table-column label="当选项为" prop="value" width="300px"></el-table-column>
          <el-table-column label="显示以下控件">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.relatedList"
                multiple
                filterable
                allow-create
                default-first-option
                placeholder="请选择"
                value=""
              >
                <el-option
                  v-for="item in controlList"
                  :disabled="item.isDisabled"
                  :key="item.key"
                  :label="item.name"
                  :value="item.key"
                >
                </el-option>
              </el-select>
            </template>
          </el-table-column>
        </el-table>
      </div>
      <template slot="action">
        <el-button @click="cancelRelated">取消</el-button>
        <el-button type="primary" @click="sureRelated">确 定</el-button>
      </template>
    </cus-dialog>
  </el-container>
</template>

<script>
import Draggable from "vuedraggable";
import ColsCondFiltersShow from "@/components/form-filds/subformFields/ColsCondFiltersShow2";
import FormResultTransferNoSaveBtn from "@/components/form-filds/FormResultTransferNoSaveBtn";
import CusDialog from "@/components/CustomDialog";
import subformFields from "@/components/form-filds/subformFields";
import quoteformFields from "@/components/form-filds/quoteformFields";
import FormCondFilter from "@/components/form-filds/dialog/FormCondFilter";
import Gis from "@/components/gis/Gis";
import calculationFormulaInput from '@/components/form-filds/RestructureFormFields/calculationFormulaInput'
import calculator from '@/components/form-filds/RestructureFormFields/calculator'
import dataSelectinterfaceSetting from '@/components/form-filds/RestructureFormFields/dataSelectinterfaceSetting'
import dataSelectParamsSetting from '@/components/form-filds/RestructureFormFields/dataSelectParamsSetting'
import assignmentSetting from "@/components/form-filds/RestructureFormFields/assignmentSetting"
import uploadFlie from "@/components/common/uploadFlie.vue";
import selectTable from "./RestructureFormFields/selectTable"
export default {
  name: "RestructureFormFields", // 重构后
  components: {
    Draggable,
    CusDialog,
    FormResultTransferNoSaveBtn,
    subformFields,
    quoteformFields,
    FormCondFilter,
    ColsCondFiltersShow,
    Gis,
    calculationFormulaInput,
    calculator,
    dataSelectinterfaceSetting,
    dataSelectParamsSetting,
    uploadFlie,
    assignmentSetting,
    selectTable
  },
  props: ["data", "config", "formItemList", "dynCols"],
  /*        props: {
                    "data": {type: Object, required: true},        // data: 被选中控件的配置
                    "config": {type: Object, required: true},      // config: 表单整体的配置信息
                    "formItemList": {type: Array, required: true}, // formItemList: 可以被控制的控件集合
                    "dynCols": {type: Array, required: true},      // dynCols: 当前表单拉取的所有控件
                },*/
  data() {
    return {
      dataSelectParamsSettingShow:false, //通用数据接口参数弹窗
      keyChange: false,
      dataSelectChange: false,
      regionMappingVisible: false,
      regionRelatedConfigTable: [
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
      ],
      gisMappingVisible: false,
      gisRelatedConfigTable: [
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
      ],
      columnSetActiveName: "first",
      mappingActiveName: "first",
      relatedConfigTable: [
        { source: "", model: "", name: "" },
        { source: "", model: "", name: "" },
      ],
      transferHackSet: true,
      closedNotifyNum: 0,
      activeNames: [],
      columnSetVisible: false,
      customDivClass: "customDivClass",
      customDivClass1: "customDivClass1",
      mappingVisible: false, // 控制映射配置显示隐藏
      mapsTitle: "",
      mapsOptions: [],
      columnDescOptions: [],
      columnDescSelected: [],
      mappingObj: {},
      activeName: "first",
      validator: {
        type: null,
        required: null,
        pattern: null,
        range: null,
        length: null,
      },
      associateControl: {
        visible: false,
        title: "关联控件",
      },
      controlList: [],
      dicTypeData: [],
      arr: [],
      currentUserVisible: false,
      condFilterConfig: {
        dialogVisible: false,
        currentItemDataCondFilter: {},
        formConfig: {
          config: {},
          list: [],
          sensorSettingsV2: {},
        },
      },
      colsCondFilters: {
        dialogVisible: false,
        itemData: [],
        type: "", //condFilters conditions
        colums: [],
      },
      stringMatchTypeOptions: [
        { label: "精确匹配", value: "$eq" },
        { label: "包含", value: "$like" },
        { label: "不包含", value: "$nlike" },
        { label: "不匹配", value: "$neq" },
        { label: "开头是", value: "$hlike" },
        { label: "为空", value: "$null" },
        { label: "不为空", value: "$notnull" },
        { label: "空文本", value: "$empty" },
      ],
      numberMatchTypeOption: [
        { label: "=", value: "$eq" },
        { label: "≠", value: "$neq" },
        { label: ">", value: "$gt" },
        { label: ">=", value: "$gte" },
        { label: "<", value: "$lt" },
        { label: "<=", value: "$lte" },
      ],
      currentUserOptions: [
        { label: "用户名", value: "0" },
        { label: "用户真实名", value: "1" },
        { label: "所属部门（或条件）", value: "2" },
        { label: "所属角色（或条件）", value: "3" },
      ],
      gisVisible: false,
      gisMapVisible:false,
      notifyChild: 0, // gis 地图
      gisInitObj: {},
      editGisObj: {}, // 编辑GIS
      currentPosition:{},
      calculator:{
        dialogVisible:false,
        calculationObject:[],
        formulaValue:'',
      },//计算器
      visitorAccessTypeCheckbox:[
        { label: "新增", value: "add" },
        { label: "编辑", value: "edit" },
        { label: "删除", value: "delete" },
        { label: "查看(个人)", value: "query" },
        { label: "查看(全部)", value: "queryAll"},
      ],
      EnterpriseAccessTypeCheckbox:[
        { label: "新增", value: "add" },
        { label: "编辑", value: "edit" },
        { label: "删除", value: "delete" },
        { label: "查看", value: "query" },
      ],
      selectTableVisible:false,
    };
  },
  computed: {
    rulesPattern(){
      return this.data.rules.find((v)=>{
        if(v.hasOwnProperty("pattern")){
          return true
        }
      })
    },
    show() {
      return this.data && Object.keys(this.data).length > 0;
    },
    showLengthSet() {
      /*        return this.data.type === 'input' || this.data.type === 'textarea'
                            || this.data.type === 'input_mobile' || this.data.type === 'input_tel'
                            || this.data.type === 'input_mail' || this.data.type === 'input_website';*/
      return (
        this.data.type === "input" ||
        this.data.type === "textarea" ||
        this.data.type === "input_website"
      );
    },
    showLabelAndModelSet() {
      return (
        this.data.type !== "org_select" &&
        this.data.type !== "company_select" &&
        this.data.type !== "user_select" &&
        this.data.type !== "role_select" &&
        this.data.type !== "dic_select" &&
        this.data.type !== "data_select" &&
        this.data.type !== "gis_select" &&
        this.data.type !== "region_select" &&
        this.data.type !== "grid"
      );
    },
    showPlaceholderSet() {
      return (
        this.data.type !== "switch" &&
        this.data.type !== "region_select" &&
        this.data.type !== "radio" &&
        this.data.type !== "image_upload" &&
        this.data.type !== "text" &&
        this.data.type !== "file_upload" &&
        this.data.type !== "checkbox" &&
        this.data.type !== "grid" &&
        this.data.type !== "table" &&
        this.data.type !== "flow_table" &&
        this.data.type !== "signature"
      );
    },
    showDefaultValue() {
      return (
        Object.keys(this.data.options).indexOf("defaultValue") >= 0 &&
        (this.data.type === "textarea" ||
          this.data.type === "text" ||
          this.data.type === "input" ||
          this.data.type === "rate" ||
          this.data.type === "color" ||
          this.data.type === "switch")
      );
    },
    showDatePlaceholderSet() {
      return (
        this.data.type === "time" ||
        this.data.type === "date" ||
        this.data.type === "datetime" ||
        this.data.type === "year" ||
        this.data.type === "month" ||
        this.data.type === "year_month"
      );
    },
    showSelectSet() {
      return (
        this.data.type === "org_select" ||
        this.data.type === "m_org_select" ||
        this.data.type === "company_select" ||
        this.data.type === "m_company_select" ||
        this.data.type === "user_select" ||
        this.data.type === "m_user_select" ||
        this.data.type === "role_select" ||
        this.data.type === "m_role_select" ||
        this.data.type === "dic_select" ||
        this.data.type === "m_dic_select" ||
        this.data.type === "data_select" ||
        this.data.type === "m_data_select"
      );
    },
    showSysSelectSet() {
      return (
        this.data.type === "org_select" ||
        this.data.type === "m_org_select" ||
        this.data.type === "company_select" ||
        this.data.type === "m_company_select" ||
        this.data.type === "user_select" ||
        this.data.type === "m_user_select" ||
        this.data.type === "role_select" ||
        this.data.type === "m_role_select" ||
        this.data.type === "dic_select" ||
        this.data.type === "m_dic_select"
      );
    },
    showMappingConfigSet() {
      return (
        this.data.title !== null &&
        this.data.title !== undefined &&
        this.data.title !== "" &&
        (this.data.type === "data_select" ||
          this.data.type === "m_data_select" ||
          this.data.type === "company_select" ||
          // this.data.type === "m_company_select" ||
          this.data.type === "user_select" 
          //|| this.data.type === "m_user_select"
        )
      );
    },
    formItemListAll(){
      let formItemListAll = []
      for (var i = 0; i < this.formItemList.length; i++) {
        let config = this.formItemList[i]
        if(config.type == "grid"){
          let gridList = []
          for (var j = 0; j < config.columns.length; j++) {
            gridList.push(...config.columns[j].list) 
          }
          formItemListAll.push(...gridList)
        }else{
          formItemListAll.push(config)
        }
      }
      return formItemListAll
    },
  },
  watch: {
    data(nv,ov){
      if(nv !== ov){
        this.compatibleConfig()
      }
    },
    "data.options.maps.name": function (val) {
      if (typeof val !== "undefined") {
        this.data.options.props.label = val;
      }
    },
    "data.options.isRange": function (val) {
      if (typeof val !== "undefined") {
        if (val) {
          this.data.options.defaultValue = null;
        } else {
          if (Object.keys(this.data.options).indexOf("defaultValue") >= 0)
            this.data.options.defaultValue = "";
        }
      }
    },
    "data.options.required": function (val) {
      this.checkRequired(val);
    },
    "data.options.dataType": function (val) {
      this.checkDataType(val);
    },
    "data.options.pattern": function (val) {
      this.checkPattern(val);
    },
    "data.name": function () {
      if (this.data.options) {
        this.checkRequired(this.data.options.required);
        this.checkDataType(this.data.options.dataType);
        this.checkPattern(this.data.options.pattern);
      }
    },
    "data.key": function (val, oldVal) {
      this.keyChange = !this.KHUtils.isNull(oldVal);
      this.dataSelectChange = !this.KHUtils.isNull(oldVal) && val !== oldVal;
      this.init()
    },
    "data.options.maps.source.table": function (val, oldVal) {
      let _this = this;
      if (!_this.KHUtils.isNull(val)) {
        if (!_this.dataSelectChange && !_this.KHUtils.isNull(oldVal) && val !== oldVal) {
          _this.data.options.maps.key = "";
          _this.data.options.maps.name = "";
          _this.data.key_name = "";
          _this.data.label_name = "";
          _this.data.label_model = "";
          _this.data.options.maps.title = "";
          _this.data.options.maps.source.columns = [];
          _this.data.options.maps.mapping = [];
          _this.data.options.maps.condFilters = [];
          _this.columnDescSelected = [];
        }
        _this.queryDescByTable(val);
      }
    },
  },
  mounted() {
    if(!this.config.visitorAccess){
      this.$set(this.config,"visitorAccess",{
        allow:false,
        type:[]
      })
    }
    if(!this.config.companyAccess){
      this.$set(this.config,"companyAccess",{
        allow:false,
        type:[]
      })
    }
    this.init()
  },
  methods: {
      //正则表达式改动
      patternChange(val){
          if(this.data.rules){
            try {
              new RegExp(val)
            } catch (error) {
              this.$notify.error({
                title: "正则错误",
                message: "请输入正确正则表达式",
              });
              return false
            }
            let rule = this.data.rules.find((v)=>{
              if(v.hasOwnProperty("pattern")){
                return true
              }
            })
            if(rule){
              rule.pattern = val
            }else{
              this.data.rules.push({
                pattern: val,
                message: ""
              })
            }
            
          }  
      },
      init(){
        if (this.data.type === "dic_select" || "m_dic_select") {
          this.listDicType();
        }
        if (
          this.data.type === "org_select" ||
          this.data.type === "m_org_select" ||
          this.data.type === "company_select" ||
          this.data.type === "m_company_select" ||
          this.data.type === "user_select" ||
          this.data.type === "m_user_select" ||
          this.data.type === "role_select" ||
          this.data.type === "m_role_select" ||
          this.data.type === "dic_select" ||
          this.data.type === "m_dic_select"
        ) {
          this.getDataConf("0"); // 第三方或者默认的控件,如用户、组织等
        } else if (this.data.type === "data_select" || this.data.type === "m_data_select") {
          if (this.data.options.maps && this.data.options.maps.source) {
          } else {
            this.getDataConf("1"); // 系统设计的表单
          }
        }
      },
      dataSelectTypeChange(val){
           this.data.options.maps.mapping = []
           this.data.options.maps.source.columns =  []
           this.data.options.remoteDataPoint = "datas"    
           this.data.options.maps.key = ""
           this.data.options.maps.name = ""
           this.data.options.remoteUrl = ""
           this.data.options.maps.title = "数据选择";
      },
      // 兼容通用数据控件 配置 dataSelectType remoteDataPoint
      initDataSelect(){
        let {type,options} = this.data
        if(type ==="data_select" || type === "m_data_select"){
          if(!options.hasOwnProperty("dataSelectType")){
            if(options.remoteUrl){
              this.$set(options,"dataSelectType","1");
            }else{
              this.$set(options,"dataSelectType","0");
            }
          }
          if(!options.hasOwnProperty("remoteDataPoint")){
            this.$set(options,"remoteDataPoint","datas");
          }
          if(!options.hasOwnProperty("method")){
            this.$set(options,"method","GET");
          }
          if(!options.hasOwnProperty("postType")){
            this.$set(options,"postType","json");
          }
          
        }
      },
      // 兼容数字控件以前配置 最大值最小值
      initMinMax(){
        let {type,options} = this.data
        if(type === "input_int" || type === "input_number" || type ==="input_long"){
            if(!options.hasOwnProperty("min")){
              this.$set(options,"min",0)
            }
            if(!options.hasOwnProperty("max")){
              this.$set(options,"max",10);
            }
            if(!options.hasOwnProperty("enableMinMax")){
              this.$set(options,"enableMinMax",false);
            }  
        }
      },
      // 兼容
      compatibleConfig(){
        // 兼容数字控件以前配置 编辑禁用
        let {options} = this.data
        if(options){
          if(options.hasOwnProperty("disabled")){
            if(!options.hasOwnProperty("editDisabled")){
              this.$set(options,"editDisabled",false);
            }
          }
        }
        // 兼容数字控件以前配置 最大值最小值
        this.initMinMax()
        // 兼容通用数据控件 配置 dataSelectType remoteDataPoint
        this.initDataSelect()
      },
      setMappingType(mapping,userSelectDynCols,modal){
         let config = userSelectDynCols.find(value => value.model == modal)
         if(config){
           mapping.type = config.type
         }else{
           mapping.type = ''
         }
      },
      getformItemListfilter(controlTypes){
        let list = []
        for (var i = 0; i < controlTypes.length; i++) {
          let controlType = controlTypes[i]

          let formItemListfilter = this.formItemListAll.filter(value => {
            if(this.data.key != value.key){
              return value.type == controlType
            }
          })
          list.push(...formItemListfilter)
        }
        return list
      },
      //用户数据配置字段
      userSelectDynCols(model){
        let controlTypes =  ['input','textarea']
        if(model == 'sex'){
         return this.getformItemListfilter(controlTypes)
        }else if(model == 'phone' || model == 'username'){
          controlTypes.push("input_mobile")
          return this.getformItemListfilter(controlTypes)
        }else if(model == 'realName'){
          // controlTypes.push(...["user_select","m_user_select"])
          return this.getformItemListfilter(controlTypes)
        }else if(model == 'email'){
          controlTypes.push("input_mail")
          return this.getformItemListfilter(controlTypes)
        }else if(model == 'orgList'){
          controlTypes.push(...["org_select","m_org_select"])
          return this.getformItemListfilter(controlTypes)
        }else if(model == 'roleList'){
          controlTypes.push(...["role_select","m_role_select"])
          return this.getformItemListfilter(controlTypes)
        }else{
          return []
        }
      },
      openGisDialog(position){
          let _this = this;
          _this.gisInitObj = {};
          _this.gisInitObj.gisInitZoom = 13;
          if(_this.KHUtils.isNull(position.lat) || _this.KHUtils.isNull(position.lnt) || _this.KHUtils.isNull(position.address)){
              _this.gisInitObj.gisInitLat = 28.683016;
              _this.gisInitObj.gisInitLng = 115.857963;
              _this.gisInitObj.gisInitCity = "南昌";
          }else {
              _this.gisInitObj.gisInitLat = position.lat;
              _this.gisInitObj.gisInitLng = position.lnt;
             // _this.gisInitObj.gisInitCity = "南昌";
          }
          _this.editGisObj = {};
          let tempObj = {};
          if(_this.KHUtils.isNull(position.lat) || _this.KHUtils.isNull(position.lnt) || _this.KHUtils.isNull(position.address)){
              tempObj.lat = 28.683016;
              tempObj.lnt = 115.857963;
              tempObj.address = "南昌";
          }else {
              tempObj.lat = position.lat;
              tempObj.lnt = position.lnt;
              tempObj.address = position.address;
          }
          tempObj.positionScope = position.scope;
          _this.editGisObj = tempObj;
          this.gisVisible = true;
          this.gisMapVisible = true;
          this.currentPosition = position;
      },
      recGisMsg(obj){
          this.currentPosition.lat = obj.lat;
          this.currentPosition.lnt = obj.lnt;
          this.currentPosition.address = obj.address;
          this.currentPosition.scope = obj.positionScope;
        console.log(obj);
          this.gisVisible = false;
          this.gisMapVisible = false;
      },
      // 关闭GIs窗口通知子组件返回数据给父组件
      handlerGisClose() {
          this.notifyChild++;

      },
      addPosition(){
          if(!this.data.options.positions){
              this.$set(this.data.options,'positions',[]);
          }
          let positon={
              lat :null,
              lnt:null,
              address:"",
              scope:100
          };
          this.data.options.positions.push(positon);
      },
      removePosition(index){
          if(this.data.options.positions instanceof Array && this.data.options.positions.length >0){
              this.data.options.positions.splice(index,1);
          }
      },
    filterTypeName(condFilter) {
      if (condFilter.dataType == "Number") {
        return "数字";
      } else if (condFilter.dataType == "Date") {
        return "时间";
      } else {
        return condFilter.filterType == "0"
          ? "单条件过滤"
          : condFilter.filterType == "1"
          ? "枚举过滤"
          : condFilter.filterType == "2"
          ? "按当前筛选"
          : "";
      }
    },
    condTypeName(condFilter) {
      if (condFilter.dataType == "Number") {
        return condFilter.condType == "0"
          ? "单条件"
          : condFilter.condType == "1"
          ? "或条件"
          : condFilter.condType == "2"
          ? "且条件"
          : "";
      } else if (condFilter.dataType == "Date") {
        return condFilter.filterType == "0"
          ? "指定时间"
          : condFilter.filterType == "1"
          ? "区间范围"
          : "";
      } else {
        if (condFilter.filterType == "0") {
          return condFilter.condType == "0"
            ? "单条件"
            : condFilter.condType == "1"
            ? "或条件"
            : condFilter.condType == "2"
            ? "且条件"
            : "";
        } else if (condFilter.filterType == "1") {
          return condFilter.condType == "0"
            ? "单选"
            : condFilter.condType == "1"
            ? "复选"
            : "";
        } else if (condFilter.filterType == "2") {
          return condFilter.condType == "0" ? "当前用户" : "";
        } else {
          return "";
        }
      }
    },
    condsName(condFilter) {
      if (condFilter.dataType == "Date" || condFilter.dataType == "Number") {
        if (Array.isArray(condFilter.conds)) {
          return condFilter.conds
            .map((cond) => {
              let numberMatchType = this.numberMatchTypeOption.find(
                (numberMatchType) => numberMatchType.value == cond.matchType
              );
              if (numberMatchType) {
                return numberMatchType.label + cond.value;
              } else {
                return "";
              }
            })
            .join("、");
        }
      } else {
        if (condFilter.filterType == "0") {
          return condFilter.conds0
            .map((value) => {
              let stringMatchType = this.stringMatchTypeOptions.find(
                (stringMatchType) => stringMatchType.value == value.matchType
              );
              if (stringMatchType) {
                return stringMatchType.label + value.value;
              } else {
                return "";
              }
            })
            .join("、");
        } else if (condFilter.filterType == "1") {
          return condFilter.conds1.join("、");
        } else if (condFilter.filterType == "2") {
          return condFilter.conds2
            .map((value) => {
              let currentUser = this.currentUserOptions.find(
                (currentUser) => currentUser.value == value.matchType
              );
              if (currentUser) {
                return currentUser.label;
              } else {
                return "";
              }
            })
            .join("、");
        } else {
          return "";
        }
      }
    },
    modelName(model) {
      let colums = this.colsCondFilters.colums.find((value) => value.model == model);
      if (colums) {
        return colums.name;
      } else {
        return model;
      }
    },
    saveAddColsCondFilters() {
      let checkedData = this.$refs["colsDataShow"].getCheckedData();
      this.data.options.maps.condFilters = checkedData || [];
      this.closeAddColsCondFiltersDialog();
    },
    closeAddColsCondFiltersDialog() {
      this.colsCondFilters.dialogVisible = false;
    },
    // 点击过滤设置
    openCondFilterSeting(e) {
      this.condFilterConfig.currentItemDataCondFilter = e;
      this.condFilterConfig.dialogVisible = true;
    },
    saveCondFilterConfig() {
      let condFilter = this.$refs.formCondFilter.saveCondFilter();
      let currentItemDataCondFilter = this.condFilterConfig.currentItemDataCondFilter;
      for (const key in condFilter) {
        this.$set(currentItemDataCondFilter, key, condFilter[key]);
      }
      // Object.assign(this.condFilterConfig.currentItemDataCondFilter, condFilter);
      console.log(
        this.condFilterConfig.currentItemDataCondFilter,
        this.data.options.maps.condFilters
      );
      this.$set(
        this.data.options.maps,
        "condFilters",
        this.data.options.maps.condFilters
      );
      this.condFilterConfig.dialogVisible = false;
    },
    closeCondFilterConfigDialog() {
      this.condFilterConfig.dialogVisible = false;
    },
    changeSourceSelect() {
      if (this.keyChange) {
        this.dataSelectChange = false;
      }
    },
    // 标签页切换
    handleColumnSetClick(tab) {
      let _this = this;
      _this.columnSetActiveName = tab.name;
    },
    // 标签页切换
    handleMappingClick(tab) {
      let _this = this;
      _this.mappingActiveName = tab.name;
    },
    // 关联数据配置关闭弹出框保存
    saveRelatedConfig() {
      this.closedNotifyNum++;
    },

    findFormType(model) {
      return this.formList.find((value) => {
        if (
          value.type === "current_user" ||
          value.type == "data_select" ||
          value.type == "org_select" ||
          value.type == "role_select" ||
          value.type == "user_select" ||
          value.type == "dic_select"
        ) {
          return model == value.model || model == value.label_model;
        } else if (value.type === "gis_select") {
          let { modelExt } = value;
          return (
            model == modelExt.lat || model == modelExt.lnt || model == modelExt.address
          );
        } else if (value.type == "region_select") {
          let { modelExt } = value;
          return (
            model == modelExt.province ||
            model == modelExt.provinceCode ||
            model == modelExt.city ||
            model == modelExt.cityCode ||
            model == modelExt.area ||
            model == modelExt.areaCode
          );
        } else if (
          value.type === "current_user" ||
          value.type == "m_data_select" ||
          value.type == "m_org_select" ||
          value.type == "m_role_select" ||
          value.type == "m_user_select" ||
          value.type == "m_dic_select"
        ) {
          return false;
        } else {
          return model == value.model;
        }
      });
    },
    // 通用数据控件,根据表名查询表结构字段
    queryDescByTable(tableName) {
      let _this = this;
      _this.columnDescOptions = [];
      _this.columnDescSelected = [];
      if (
        _this.data.options.maps.source.columns instanceof Array &&
        _this.data.options.maps.source.columns.length > 0
      ) {
        _this.data.options.maps.source.columns.forEach((cl) => {
          _this.columnDescSelected.push({
            id: cl.column,
            name: cl.bakName ? cl.bakName : cl.name, // 兼容性处理
            rename: cl.name,
          });
        });
      }
      _this
        .$Get(_this.khConfig.api.tableQueryDesc, {
          tbName: tableName,
          pageSize: 1000,
          pageNum: 1,
        })
        .then((res) => {
          if (res.errCode === 0) {
            if (res.colums instanceof Array) {
              this.colsCondFilters.colums = res.colums.map((value) => {
                let colum = {
                  name: value.columnDesc,
                  model: value.columnName,
                  dataType: value.javaType,
                  columnType: value.columnType,
                };
                // let formItem =this.findFormType(value.columnName)
                // if(formItem){
                //   colum.type =  formItem.type
                // }else{
                // if( value.columnName == "user_name" || value.columnName == "real_name" ||value.columnName =="last_update_user_id" || value.columnName == "last_update_user_name"){
                //   colum.type = "user_select"
                // }else  if((value.columnName == "create_time" || value.columnName == "last_update_time" || value.columnName == "real_name" )){
                //   colum.type = "datetime"
                // }else if(value.columnName == "process_instance_id" || value.columnName == "tenant_id" || value.columnName == "id") {
                //   colum.type = "input"
                // }
                // }
                return colum;
              });
              res.colums.forEach((cr) => {
                let newObj = {};
                newObj.id = cr.columnName;
                newObj.name = _this.KHUtils.isNull(cr.columnDesc)
                  ? cr.columnName
                  : cr.columnDesc;
                newObj.isSelected = false;
                newObj.paramName = cr.columnName;
                newObj.javaType = cr.javaType;
                newObj.len = cr.len;
                newObj.rename = newObj.name;
                _this.columnDescOptions.push(newObj);
              });
              if (
                !(_this.columnDescSelected instanceof Array) ||
                _this.columnDescSelected.length === 0
              ) {
                _this.columnDescSelected = [];
                _this.columnDescOptions.forEach((co) => {
                  _this.columnDescSelected.push(co);
                });
                _this.data.options.maps.title = "数据选择";
              }
              this.transferHackSet = false;
              this.$nextTick(() => {
                this.transferHackSet = true;
              });
            }
          }
        });
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
        _this.data.options.maps.source.columns = [];
        _this.columnDescSelected.forEach((cd) => {
          let newObj = {};
          newObj.column = cd.column;
          newObj.name = cd.rename;
          newObj.bakName = cd.name;
          _this.data.options.maps.source.columns.push(newObj);
        });
      }
      _this.colSetVisible = false;
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
    // 打开添加映射配置页面
    showMappingConfig() {
      let _this = this;
      _this.columnSetActiveName = "first";
      _this.mappingActiveName = "first";
      if (_this.data.options.maps && !_this.data.options.maps.source) {
        _this.mappingVisible = true;
        _this.selectDataSource(_this.data.title); // 用户/组织/数据字典/企业/通用数据控件
      } else {
        _this.columnSetVisible = true; // 重构后的通用数据控件
      }
    },
    // 映射配置表格行动态新增
    addMappingRow() {
      let _this = this;
      if (!_this.data.options.maps.mapping) {
        return false;
      }
      let obj = {
        model: "",
        selectKey: "",
      };
      _this.data.options.maps.mapping.push(obj);
      setTimeout(() => {
        this.$refs.mappingRef.setCurrentRow(obj);
      }, 10);
    },
    // 映射数据过滤配置表格行动态新增
    addCondFiltersRow() {
      let _this = this;
      if (!_this.data.options.maps.condFilters) {
        return false;
      }
      let obj = {
        model: "",
        dataType: "",
        filterType: "",
        condType: "",
        conds: "",
      };
      _this.data.options.maps.condFilters.push(obj);
    },
    // 映射配置表格行动态删除
    handleMappingDelete(index) {
      let _this = this;
      if (!_this.data.options.maps.mapping) {
        return false;
      }
      _this.data.options.maps.mapping.splice(index, 1);
    },
    // 映射配置数据过滤删除
    handleCondFiltersDelete(index) {
      let _this = this;
      if (!_this.data.options.maps.condFilters) {
        return false;
      }
      _this.data.options.maps.condFilters.splice(index, 1);
    },
    // 获取数据配置
    getDataConf(type) {
      let _this = this;
      _this.mapsOptions = [];
      _this.$Get(this.khConfig.api.getDataConf, { type: type }).then((res) => {
        if (res.errCode === 0) {
          _this.mapsOptions = res.datas;
          if (_this.KHUtils.isNull(_this.mapsOptions) || _this.mapsOptions.length <= 0) {
            _this.$notify.warning({
              title: "警告",
              message: "数据配置项未空,请联系管理员",
            });
            return false;
          }
          // 编辑时时初始化
          let flag =
            this.data.type === "org_select" ||
            this.data.type === "m_org_select" ||
            _this.data.type === "user_select" ||
            _this.data.type === "m_user_select" ||
            _this.data.type === "company_select" ||
            _this.data.type === "m_company_select" ||
            _this.data.type === "role_select" ||
            _this.data.type === "m_role_select" ||
            _this.data.type === "dic_select" ||
            _this.data.type === "m_dic_select";
          if (flag) {
            _this.selectDataSource();
          }
        }
      });
    },
    // 数据配置选择
    selectDataSource(compareTitle) {
      let _this = this;
      //_this.data.label_model = "";
      if (_this.KHUtils.isNull(compareTitle)) {
        compareTitle = _this.data.title;
      }
      if (!_this.KHUtils.isNull(_this.mapsOptions)) {
        _this.mapsOptions.forEach((obj) => {
          if (compareTitle === obj.title) {
            _this.data.key_name = _this.data.name + obj.valueDesc;
            _this.data.label_name = _this.data.name + obj.labelDesc;
            _this.data.options.maps.key = obj.valueKey;
            _this.data.options.maps.name = obj.labelKey;
            _this.data.options.maps.title = obj.title;
            if (obj.columns instanceof Array) {
              _this.mappingObj[_this.data.model] = obj.columns;
            } else {
              _this.mappingObj[_this.data.model] = [];
            }
            if (!_this.data.options.maps.mapping) {
              _this.data.options.maps.mapping = [];
            }
            if (
              !(_this.data.options.maps.related instanceof Array) ||
              _this.data.options.maps.related.length < 2
            ) {
              _this.data.options.maps.related = [];
              _this.data.options.maps.related.push({
                source: obj.valueDesc,
                model: obj.valueKey,
                name: obj.valueDesc,
              });
              _this.data.options.maps.related.push({
                source: obj.labelDesc,
                model: obj.labelKey,
                name: obj.labelDesc,
              });
            }
            _this.data.options.remoteUrl = obj.url;
          }
        });
      }
    },
    //  数据字典类型
    listDicType() {
      let _this = this;

      if (_this.dicTypeData.length > 0) {
        return false;
      }
      _this.$Get(_this.khConfig.api.listDicType).then((res) => {
        if (res.list != null && res.list.length > 0) {
          _this.dicTypeData = res.list;
          this.selectDataSource()
          if (_this.KHUtils.isNull(_this.data.typeCode)) {
            _this.data.typeCode = _this.dicTypeData[0].typeCode;
          }
        } else {
          _this.$notify.warning({
            title: "警告",
            message: "系统中未录入任何数据字典类型,请联系管理员",
          });
        }
      });
    },
    //  打开关联对话框
    controlRelVisible() {
      let _this = this;
      let keyList = [];
      _this.arr = [];
      this.associateControl.visible = true;
      this.controlList = [];
      if (!this.KHUtils.isNull(this.formItemList)) {
        this.formItemList.forEach((val) => {
          //  计算哪些控件是被控制了的
          if (val.type === "grid") {
            loop(val);
          } else {
            _this.arr.push(val);
          }
        });

        function loop(obj) {
          if (obj.columns) {
            obj.columns.forEach((cs) => {
              cs.list.forEach((ls) => {
                _this.arr.push(ls);
                if (ls.columns) {
                  loop(ls);
                }
              });
            });
          }
        }

        this.arr.forEach((item) => {
          if (item.key !== this.data.key) {
            this.controlList.push(item);
          } else {
            item.options.copyOptions = item.options.options.map((val) => {
              return [...val.relatedList];
            });
          }
        });
      }

      this.controlList.forEach((v) => {
        loopFilter(v);
        v.isDisabled = keyList.length > 0;
        keyList = [];
      });

      function loopFilter(control) {
        if (control === null || control === undefined || control === "") {
          return false;
        }
        if (control.type === "radio" || control.type === "select") {
          let list = [];
          for (let i = 0; i < control.options.options.length; i++) {
            if (
              control.options.options[i].relatedList !== undefined &&
              control.options.options[i].relatedList !== null &&
              control.options.options[i].relatedList !== ""
            ) {
              list.push(...control.options.options[i].relatedList);
            }
          }
          Array.from(new Set(list));
          if (list.indexOf(_this.data.key) !== -1) {
            keyList.push(control.key);
            return true;
          } else {
            list.forEach((val) => {
              for (let i = 0; i < _this.controlList.length; i++) {
                if (val === _this.controlList[i].key) {
                  let flag = loopFilter(_this.controlList[i]);
                  if (flag) break;
                }
              }
            });
          }
        }
      }
    },
    //  关联确定
    sureRelated() {
      let hasControls = []; //  当前单选框|下拉框所有控制的控件集合
      let controlled = []; //  被控制的控件key
      this.associateControl.visible = false;
      this.data.options.options.forEach((val) => {
        if (!this.KHUtils.isNull(val.relatedList)) {
          Array.prototype.push.apply(hasControls, val.relatedList);
        }
      });
      this.data.options.hasControl = hasControls.length > 0;
      if (!this.KHUtils.isNull(this.arr)) {
        this.arr.forEach((val) => {
          //  计算哪些控件是被控制了的
          delete val.isDisabled;
          if (val.type === "select" || val.type === "radio") {
            val.options.options.forEach((v) => {
              if (!this.KHUtils.isNull(v.relatedList)) {
                controlled.push(...v.relatedList);
              }
            });
          }
        });
      }
      delete this.data.options.copyOptions;
      this.$emit("sure-related", controlled); //  向上传递保存关联方法
    },
    //  关联取消
    cancelRelated() {
      let _this = this;
      this.data.options.options.forEach((val, index) => {
        Object.assign(val.relatedList, _this.data.options.copyOptions[index]);
      });
      delete this.data.options.copyOptions;
      this.associateControl.visible = false;
      this.controlList.forEach((item) => {
        delete item.isDisabled;
      });
    },
    //  计算防止双向控制 (包括循环依赖控制)
    calc(control) {
      let _this = this;
      let keyList = [];
      loopFilter(control.key);
      return keyList.indexOf(this.data.key) > -1;

      function loopFilter(key) {
        _this.arr.forEach((val) => {
          if (val.type === "radio" || val.type === "select") {
            let list = [];
            for (let i = 0; i < val.options.options.length; i++) {
              list.push(...val.options.options[i].relatedList);
            }
            Array.from(new Set(list));
            if (list.indexOf(key) !== -1) {
              keyList.push(val.key);
              loopFilter(val.key);
            }
          }
        });
      }
    },
    // 标签页切换
    handleSelect(value) {
      let _this = this;
      _this.activeName = value;
    },
    // 下拉框移除属性
    removeOptions(index) {
      let _this = this;
      if (_this.data.type === "grid") {
        _this.data.columns.splice(index, 1);
      } else {
        _this.data.options.options.splice(index, 1);
      }
    },
    // 下拉框添加属性
    addOption() {
      let _this = this;
      if (_this.data.options.showLabel) {
        _this.data.options.options.push({
          value: "新选项",
          label: "新选项",
          relatedList: [],
        });
      } else {
        _this.data.options.options.push({
          value: "新选项",
          label: "新选项",
          relatedList: [],
        });
      }
    },
    // 栅格添加列
    handleAddColumn() {
      let _this = this;
      _this.data.columns.push({
        span: "",
        list: [],
      });
    },
    // 是否多选
    multipleSelect(value) {
      let _this = this;
      if (value) {
        if (_this.data.options.defaultValue) {
          _this.data.options.defaultValue = [_this.data.options.defaultValue];
        } else {
          _this.data.options.defaultValue = [];
        }
      } else {
        if (_this.data.options.defaultValue.length > 0) {
          _this.data.options.defaultValue = _this.data.options.defaultValue[0];
        } else {
          _this.data.options.defaultValue = "";
        }
      }
    },
    // 校验必填
    checkRequired(val) {
      let _this = this;
      if (val) {
        _this.validator.required = {
          required: true,
          message: `${_this.data.name}为必填项`,
        };
      } else {
        _this.validator.required = null;
      }
      _this.$nextTick(() => {
        this.configRule();
      });
    },
    // 校验数据类型
    checkDataType(val) {
      let _this = this;
      if (!_this.show) {
        return false;
      }
      if (val) {
      } else {
        _this.validator.type = null;
      }
      _this.configRule();
    },
    // 正则校验
    checkPattern(val) {
      let _this = this;
      if (!_this.show) {
        return false;
      }
      if (val) {
        _this.validator.pattern = {
          pattern: val,
          message: this.data.name + "格式不匹配",
        };
      } else {
        _this.validator.pattern = null;
      }
      _this.configRule();
    },
    // 生成校验规则配置
    configRule() {
      let _this = this;
      _this.data.rules = [];
      Object.keys(_this.validator).forEach((key) => {
        if (_this.validator[key]) {
          _this.data.rules.push(_this.validator[key]);
        }
      });
    },
    defaultTypeChange(type) {
      if (type == 1) {
        this.data.options.defaultValue = "";
      }
    },
    //通用数据接口参数窗口关闭前
    dataSelectParamsSettingClose(done){
       let isNullUrlParams = this.data.options.urlParams && this.data.options.urlParams.some(value => !value.k)
       let isNullColumns = this.data.options.maps.source.columns.some(value => !value.column) || this.data.options.maps.source.columns.some(value => !value.name)
       if(isNullUrlParams){
        this.$notify.info({
          message: '请检查数据传参设置 key值是否为空'
        });
       }
       if(isNullColumns){
        this.$notify.info({
          message: '请检查数据字段设置 数据字段列表 是否存在空值'
        });
       }
       if(!(isNullUrlParams && isNullColumns)){
        done()
       }
    },
    
    //单选框控件点击取消选中
    handleClickRaio(e){
      if(e.value === this.data.options.defaultValue){
        this.data.options.defaultValue = ''
      }else{
        this.data.options.defaultValue = e.value
      }
    }
  },
};
</script>
<style lang="scss" scoped>
.config-content {
  padding: 0 !important;
}
.config-container > .config-content {
  .el-form-item--mini.el-form-item,
  .el-form-item--small.el-form-item {
    margin-bottom: 0;
  }
}

.config-container > .el-form-item__label {
  color: #fff !important;
}

.config-container {
  position: relative;
  height: 100%;
  border-left: 1px solid #e0e0e0;

  .el-header {
    border-bottom: solid 2px #e4e7ed;
    padding: 0 5px;
    color: #fff;
  }

  .config-tab {
    height: 40px;
    line-height: 40px;
    display: inline-block;
    width: 48%;
    text-align: center;
    font-size: 12px;
    font-weight: 500;
    position: relative;
    cursor: pointer;

    &.active {
      border-bottom: solid 2px $primary-color;
    }
  }

  .config-content {
    padding: 10px;

    .el-form-item__label {
      padding: 0;
      font-weight: 500;
    }

    .el-form-item {
      border-bottom: solid 1px #e1e1e1;
      padding-bottom: 5px;
    }
  }

  .ghost {
    background: #fff;
    border: 1px dashed $primary-color;

    &::after {
      background: #fff;
      display: block;
      content: "";
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
    }
  }

  ul {
    margin: 0;
    padding: 0;
  }

  li.ghost {
    list-style: none;
    font-size: 0;
    display: block;
    position: relative;
  }
}

.associate-control {
  height: 500px;
  margin: 0 -25px;
  padding: 25px;
  border-top: 1px solid #eee;

  h4 {
    margin: -5px 0 20px;
    color: #333;
  }

  .el-table {
    th > .cell {
      font-weight: normal;
      color: #000;
    }

    td .el-select {
      display: block;
    }
  }
}

.customDivClass {
  border: 1px solid #dcdfe6;
  padding-left: 5px;
  border-radius: 4px;
  //width: 95%;
}

.customDivClass1 {
  border: 1px solid #dcdfe6;
  padding-left: 5px;
  border-radius: 4px;
  //width: 95%;
  height: 28px;
}

/*滚动条里面小方块*/
.config-container .config-content::-webkit-scrollbar-thumb {
  background-color: #fff;
  border-radius: 10px;
}

/*滚动条整体样式*/
.config-container .config-content::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

/*滚动条里面轨道*/
.config-container .config-content::-webkit-scrollbar-track {
  background: rgba(77, 86, 133, 0.1);
  border-radius: 10px;
}
.condFilter {
  color: #1890ff;
  cursor: pointer;
}
::v-deep .dataConfig {
  .el-dialog__header{
    // background:#1890ff;
    background:var(--DialogHeaderBg) !important;
    height: 40px;
  }
  .el-dialog__body {
    // padding: 15px !important;
    padding: 10px 15px 15px 15px !important;
    .el-tabs__content {
      max-height: 60vh;
      overflow: auto;
    }
  }
}
</style>
