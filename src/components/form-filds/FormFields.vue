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

    <el-main class="config-content">
      <div v-show="activeName === 'first'" v-if="show">
        <el-form label-position="top">
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
            <el-input disabled value="邮箱" v-if="data.type === 'input_mail'"></el-input>
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
            <el-input disabled value="图片" v-if="data.type === 'signature'"></el-input>
            <el-input
              disabled
              value="图片"
              v-if="data.type === 'image_upload'"
            ></el-input>
            <el-input disabled value="附件" v-if="data.type === 'file_upload'"></el-input>
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
          </el-form-item>
          <el-form-item label="标题" v-if="data.type !== 'grid'">
            <el-input v-model="data.name"></el-input>
          </el-form-item>
          <el-form-item label="字段标识">
            <el-input v-model="data.model"></el-input>
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
          <el-form-item
            label="占位内容"
            v-if="
              data.type !== 'switch' &&
              data.type !== 'region_select' &&
              data.type !== 'radio' &&
              data.type !== 'image_upload' &&
              data.type !== 'text' &&
              data.type !== 'file_upload' &&
              data.type !== 'checkbox' &&
              data.type !== 'grid' &&
              data.type !== 'table' &&
              data.type !== 'flow_table'
            "
          >
            <el-input v-model="data.options.placeholder"></el-input>
          </el-form-item>
          <el-form-item
            label="数据字典类型"
            v-if="data.type === 'dic_select' || data.type === 'm_dic_select'"
            :required="true"
          >
            <el-select v-model="data.typeCode" value="" clearable filterable>
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
            <el-select v-model="data.options.gisType" value="">
              <el-option value="0" label="高德"></el-option>
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
          <el-form-item label="开启显示" v-if="data.type === 'switch'">
            <el-input v-model="data.options.openMsg"></el-input>
          </el-form-item>
          <el-form-item label="关闭显示" v-if="data.type === 'switch'">
            <el-input v-model="data.options.closeMsg"></el-input>
          </el-form-item>
          <!--                    <el-form-item label="是否支持多选" v-if="data.type === 'data_select' || data.type === 'dic_select' || data.type === 'org_select'">
                                            <el-switch v-model="data.options.multiple">
                                            </el-switch>
                                        </el-form-item>-->
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
            <el-radio-group
              v-model="data.options.remote"
              size="mini"
              style="margin-bottom: 10px"
            >
              <el-radio-button :label="true">静态数据</el-radio-button>
              <!--                <el-radio-button :label="false">远端数据</el-radio-button>-->
            </el-radio-group>
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
                  <li v-for="(item, index) in data.options.options" :key="index">
                    <el-radio :label="item.value" style="margin-right: 5px">
                      <el-input
                        @change="item.label = item.value"
                        :style="{ width: data.options.showLabel ? '80px' : '80px' }"
                        size="mini"
                        v-model="item.value"
                      ></el-input>
                      <el-input
                        style="width: 80px"
                        size="mini"
                        v-show="data.options.showLabel"
                        v-model="item.label"
                      ></el-input>
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
                      style="padding: 4px; margin-left: 5px"
                    ></el-button>
                  </li>
                </draggable>
              </el-radio-group>
            </template>
            <template v-if="data.type === 'checkbox' || data.type === 'multiple_select'">
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
                        v-show="data.options.showLabel"
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
          <el-form-item
            label="默认值"
            v-if="
              Object.keys(data.options).indexOf('defaultValue') >= 0 &&
              (data.type === 'textarea' ||
                data.type === 'text' ||
                data.type === 'input' ||
                data.type === 'rate' ||
                data.type === 'color' ||
                data.type === 'switch')
            "
          >
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
          <template
            v-if="
              data.type === 'time' ||
              data.type === 'date' ||
              data.type === 'datetime' ||
              data.type === 'year' ||
              data.type === 'month' ||
              data.type === 'year_month'
            "
          >
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
                data.type === 'time' && Object.keys(data.options).indexOf('isRange') >= 0
              "
            >
              <el-radio-group
                v-model="data.options.defaultType"
                style="margin-bottom: 10px"
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
              >
              </el-date-picker>
            </el-form-item>
          </template>
          <template
            v-if="
              data.type === 'data_select' ||
              data.type === 'm_data_select' ||
              data.type === 'org_select' ||
              data.type === 'm_org_select' ||
              data.type === 'company_select' ||
              data.type === 'm_company_select' ||
              data.type === 'user_select' ||
              data.type === 'm_user_select' ||
              data.type === 'role_select' ||
              data.type === 'm_role_select' ||
              data.type === 'dic_select' ||
              data.type === 'm_dic_select'
            "
          >
            <el-form-item label="数据配置" :required="true">
              <el-select
                v-model="data.title"
                placeholder="请选择"
                @change="selectDataSource"
                clearable
                filterable
                :disabled="
                  data.type === 'org_select' ||
                  data.type === 'm_org_select' ||
                  data.type === 'user_select' ||
                  data.type === 'm_user_select' ||
                  data.type === 'company_select' ||
                  data.type === 'm_company_select' ||
                  data.type === 'role_select' ||
                  data.type === 'm_role_select' ||
                  data.type === 'dic_select' ||
                  data.type === 'm_dic_select'
                "
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
                v-if="
                  data.title !== null &&
                  data.title !== undefined &&
                  data.title !== '' &&
                  (data.type === 'data_select' ||
                    data.type === 'm_data_select' ||
                    data.type === 'company_select' ||
                    data.type === 'm_company_select' ||
                    data.type === 'user_select' ||
                    data.type === 'm_user_select')
                "
              >
                添加映射配置
              </el-button>
            </el-form-item>
            <el-form-item label="接口地址" :required="true">
              <el-input v-model="data.options.remoteUrl" disabled></el-input>
            </el-form-item>
            <!--           <el-form-item label="数据选择框展现形式">
                                       <el-radio label="table" v-model="data.options.displayModel">列表</el-radio>
                                       <el-radio label="tree" v-model="data.options.displayModel">树状结构</el-radio>
                                   </el-form-item>-->
          </template>
          <!--           <template v-if="data.type === 'table'">
                                   <el-form-item label="子表单数据添加方式">
                                       <el-radio label="single" v-model="data.options.addModel">单条</el-radio>
                                       <el-radio label="batch" v-model="data.options.addModel">批量</el-radio>
                                   </el-form-item>
                               </template>-->
          <template v-if="data.type === 'file_upload' || data.type === 'image_upload'">
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
                data.type !== 'grid' &&
                data.type !== 'table' &&
                data.type !== 'flow_table' &&
                data.type !== 'text'
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
                  >禁用
                </el-checkbox>
                <el-checkbox
                  v-model="data.options.editable"
                  v-if="Object.keys(data.options).indexOf('editable') >= 0"
                  >文本框可输入
                </el-checkbox>
                <el-checkbox
                  v-model="data.options.clearable"
                  v-if="Object.keys(data.options).indexOf('clearable') >= 0"
                  >显示清除按钮
                </el-checkbox>
                <el-checkbox
                  v-model="data.options.arrowControl"
                  v-if="Object.keys(data.options).indexOf('arrowControl') >= 0"
                  >使用箭头进行时间选择
                </el-checkbox>
                <el-checkbox
                  v-model="data.options.isDelete"
                  v-if="Object.keys(data.options).indexOf('isDelete') >= 0"
                  >删除
                </el-checkbox>
                <el-checkbox
                  v-model="data.options.isEdit"
                  v-if="Object.keys(data.options).indexOf('isEdit') >= 0"
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
                data.type !== 'text'
              "
            >
              <el-form-item label="校验">
                <el-checkbox
                  v-model="data.options.required"
                  :disabled="data.options.disabled"
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
                  style="margin-left: -32px; font-size: 10px"
                >
                  (勾选后可做为
                  <span style="color: #8bc3fc">流程条件)</span>
                </span>
                <div
                  v-if="Object.keys(data.options).indexOf('pattern') >= 0"
                  v-show="false"
                >
                  <el-input
                    size="mini"
                    v-model.lazy="data.options.pattern"
                    style="width: 240px"
                    placeholder="正则表达式"
                  ></el-input>
                </div>
              </el-form-item>
            </div>
          </template>
        </el-form>
      </div>

      <div v-show="activeName === 'second'">
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
          <el-form-item label="控件尺寸">
            <el-radio-group v-model="config.size">
              <el-radio-button label="medium">medium</el-radio-button>
              <el-radio-button label="small">small</el-radio-button>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="表名">
            <el-input v-model="config.tableName"></el-input>
          </el-form-item>
        </el-form>
      </div>
    </el-main>

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
    <el-dialog
      title="映射配置"
      :visible.sync="mappingVisiable"
      v-if="show"
      width="1000px"
      :modal="false"
    >
      <el-row>
        <el-button size="mini" @click="addMappingRow" icon="el-icon-edit" type="primary"
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
          <el-table-column prop="model" label="当前表单字段">
            <template slot-scope="scope">
              <el-select
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
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="selectKey" label="数据配置字段">
            <template slot-scope="scope">
              <el-select
                v-model="scope.row.selectKey"
                placeholder="请选择"
                size="mini"
                value=""
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
    </el-dialog>
  </el-container>
</template>

<script>
import Draggable from "vuedraggable";
import CusDialog from "@/components/CustomDialog";

export default {
  name: "FormFields",

  components: {
    Draggable,
    CusDialog,
  },

  // data: 被选中控件的配置
  // config: 表单整体的配置信息
  // formItemList: 可以被控制的控件集合
  // dynCols: 当前表单拉取的所有控件
  props: ["data", "config", "formItemList", "dynCols"],

  data() {
    return {
      mappingVisiable: false, // 控制映射配置显示隐藏
      mapsTitle: "",
      mapsOptions: [],
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
    };
  },

  computed: {
    show() {
      return this.data && Object.keys(this.data).length > 0;
    },
  },

  watch: {
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
    "data.type": function () {
      if (this.data.type === "dic_select" || this.data.type === "m_dic_select") {
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
        this.getDataConf("1"); // 系统设计的表单
      }
    },
  },

  methods: {
    // 打开添加映射配置页面
    showMappingConfig() {
      let _this = this;
      _this.mappingVisiable = true;
      _this.selectDataSource(_this.data.title);
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
    // 映射配置表格行动态删除
    handleMappingDelete(index) {
      let _this = this;
      if (!_this.data.options.maps.mapping) {
        return false;
      }
      _this.data.options.maps.mapping.splice(index, 1);
    },
    // 获取数据配置
    getDataConf(type) {
      let _this = this;
      _this.mapsOptions = [];
      _this.$Get(this.khConfig.api.getDataConf, { type: type }).then((res) => {
        if (res.errCode === 0) {
          _this.mapsOptions = res.datas;
          debugger;
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
        _this.validator.type = { type: val, message: _this.data.name + "数据类型不正确" };
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
  },
};
</script>
<style lang="scss" scoped>
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
</style>
