<template>
  <el-form-item
    class="widget-view"
    v-if="element && element.key"
    :class="{
      active: selectFormItem.key === element.key,
      is_req: element.options.required,
      controlled: controlledArr.indexOf(element.key) !== -1,
    }"
    :label="element.type !== 'text' ? element.name : ''"
    @click.native.stop="selectBoxItem(index)"
  >
    <template
      v-if="
        element.type === 'input' ||
        element.type === 'data_select' ||
        element.type === 'm_data_select' ||
        element.type === 'org_select' ||
        element.type === 'm_org_select' ||
        element.type === 'dic_select' ||
        element.type === 'm_dic_select' ||
        element.type === 'user_select' ||
        element.type === 'm_user_select' ||
        element.type === 'role_select' ||
        element.type === 'm_role_select' ||
        element.type === 'company_select' ||
        element.type === 'm_company_select' ||
        element.type === 'gis_select'
      "
    >
      <el-input
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
      ></el-input>
    </template>

    <template v-if="element.type === 'region_select'">
      <v-region class="form-control"></v-region>
    </template>

    <template v-if="element.type === 'textarea'">
      <el-input
        type="textarea"
        :rows="5"
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :disabled="element.options.disabled"
        :placeholder="element.options.placeholder"
      ></el-input>
    </template>
    <template v-if="element.type === 'current_user'">
      <span>{{ user.realName }}</span>
      <!-- <el-input
        v-model="user.realName"
        :style="{ width: element.options.width }"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
      ></el-input> -->
    </template>
    <template v-if="element.type === 'text'">
      <span>{{ element.options.defaultValue }}</span>
    </template>

    <template
      v-if="
        element.type === 'input_number' ||
        element.type === 'input_int' ||
        element.type === 'input_long' ||
        element.type === 'input_mobile' ||
        element.type === 'input_tel' ||
        element.type === 'input_mail' ||
        element.type === 'input_postal' ||
        element.type === 'input_website'
      "
    >
      <el-input
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :placeholder="element.options.placeholder"
        :disabled="element.options.disabled"
      ></el-input>
    </template>

    <template v-if="element.type === 'number'">
      <el-input-number
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :controls-position="element.options.controlsPosition"
        :style="{ width: element.options.width }"
      ></el-input-number>
    </template>

    <template v-if="element.type === 'radio'">
      <el-radio-group
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :disabled="element.options.disabled"
      >
        <el-radio
          :style="{ display: element.options.inline ? 'inline-block' : 'block' }"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-radio>
      </el-radio-group>
    </template>

    <template v-if="element.type === 'checkbox'">
      <el-checkbox-group
        v-model="element.options.defaultValue"
        :style="{ width: element.options.width }"
        :disabled="element.options.disabled"
      >
        <el-checkbox
          :style="{ display: element.options.inline ? 'inline-block' : 'block' }"
          :label="item.value"
          v-for="(item, index) in element.options.options"
          :key="item.value + index"
        >
          {{ element.options.showLabel ? item.label : item.value }}
        </el-checkbox>
      </el-checkbox-group>
    </template>

    <template v-if="element.type === 'time'">
      <el-time-picker
        v-model="element.options.defaultValue"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :arrowControl="element.options.arrowControl"
        :value-format="element.options.format"
        :style="{ width: element.options.width }"
      >
      </el-time-picker>
    </template>

    <template
      v-if="
        element.type === 'date' ||
        element.type === 'year' ||
        element.type === 'month' ||
        element.type === 'year_month'
      "
    >
      <el-date-picker
        v-model="element.options.defaultValue"
        :type="element.options.type"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :format="element.options.format"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :style="{ width: element.options.width }"
      >
      </el-date-picker>
    </template>

    <template v-if="element.type === 'datetime'">
      <el-date-picker
        v-model="element.options.defaultValue"
        type="datetime"
        :is-range="element.options.isRange"
        :placeholder="element.options.placeholder"
        :start-placeholder="element.options.startPlaceholder"
        :end-placeholder="element.options.endPlaceholder"
        :readonly="element.options.readonly"
        :disabled="element.options.disabled"
        :editable="element.options.editable"
        :clearable="element.options.clearable"
        :style="{ width: element.options.width }"
      >
      </el-date-picker>
    </template>

    <template v-if="element.type === 'rate'">
      <el-rate
        v-model="element.options.defaultValue"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :allow-half="element.options.allowHalf"
      >
      </el-rate>
    </template>

    <template v-if="element.type === 'select'">
      <el-select
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{ width: element.options.width }"
        :value="''"
      >
        <el-option
          v-for="item in element.options.options"
          :key="item.value"
          :value="item.value"
          :label="element.options.showLabel ? item.label : item.value"
        ></el-option>
      </el-select>
    </template>

    <template v-if="element.type === 'multiple_select'">
      <el-select
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{ width: element.options.width }"
        :value="''"
      >
        <el-option
          v-for="item in element.options.options"
          :key="item.value"
          :value="item.value"
          :label="element.options.showLabel ? item.label : item.value"
        ></el-option>
      </el-select>
    </template>

    <template v-if="element.type === 'switch'">
      <el-switch
        :style="{ width: element.options.width }"
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
      >
      </el-switch>
    </template>

    <template v-if="element.type === 'slider'">
      <el-slider
        v-model="element.options.defaultValue"
        :min="element.options.min"
        :max="element.options.max"
        :disabled="element.options.disabled"
        :step="element.options.step"
        :show-input="element.options.showInput"
        :range="element.options.range"
        :style="{ width: element.options.width }"
      >
      </el-slider>
    </template>

    <template v-if="element.type === 'file_upload' || element.type === 'image_upload'">
      <el-upload
        :style="{ width: element.options.width }"
        v-model="element.options.defaultValue"
        class="upload-demo"
        :action="this.khConfig.host.rest + element.options.action"
        :disabled="element.options.disabled"
        :multiple="element.options.multiple"
        :file-list="element.options.fileList"
      >
        <el-button size="small" type="primary">点击上传</el-button>
        <div slot="tip" class="el-upload__tip" v-if="element.type === 'image_upload'">
          只能上传jpg/png文件，且不超过{{ element.options.maxFileSize }}M
        </div>
        <div slot="tip" class="el-upload__tip" v-if="element.type === 'file_upload'">
          上传的附件大小且不超过{{ element.options.maxFileSize }}M
        </div>
      </el-upload>
    </template>
    <template v-if="element.type === 'signature'">
      <el-button size="small" type="primary">签名</el-button>
    </template>

    <template v-if="element.type === 'cascade'">
      <el-cascader
        v-model="element.options.defaultValue"
        :disabled="element.options.disabled"
        :clearable="element.options.clearable"
        :placeholder="element.options.placeholder"
        :style="{ width: element.options.width }"
        :options="element.options.remoteOptions"
      >
      </el-cascader>
    </template>

    <div class="widget-view-action" v-if="selectFormItem.model === element.model">
      <i
        class="iconfont icon-icon_clone"
        @click.stop="copyBoxItem(index)"
        v-show="false"
      ></i>
      <i
        class="iconfont icon-trash"
        @click.stop="deleteBoxItem(index)"
        v-if="selectFormItem.source !== 0"
      ></i>
    </div>

    <div class="widget-view-drag" v-if="selectFormItem.model === element.model">
      <i class="iconfont icon-drag drag-widget"></i>
    </div>
  </el-form-item>
</template>

<script>
import { VueEditor } from "vue2-editor";
import { mapGetters } from "vuex";

export default {
  // element: 当前控件
  // select: 当前被选中的控件
  // index: 当前控件的下标
  // data: 表单配置
  // controlledArr: 被控制的控制的样式改变
  props: ["element", "select", "index", "data", "controlledArr", "notifyLoadMapping"],
  components: {
    VueEditor,
  },

  data() {
    return {
      selectFormItem: this.select,
    };
  },
  computed: {
    ...mapGetters({
      user: "getUserInfo",
    }),
  },
  watch: {
    select(val) {
      this.selectFormItem = val;
    },
    selectFormItem: {
      handler(val) {
        this.$emit("update:select", val);
      },
      deep: true,
    },
    notifyLoadMapping(newIndex) {
      //this.selectBoxItem(newIndex);  // 解决刚拖拉出通用数据控件时,不加载selectBoxItem()也就无法加载映射配置的
    },
  },
  methods: {
    // 选中控件
    selectBoxItem(index) {
      let _this = this;
      let tmpArray = [];
      // 子表单
      if (_this.data.tableColumns && _this.data.tableColumns.length > 0) {
        this.$emit('onFormItemList', _this.data.tableColumns);
        _this.selectFormItem = _this.data.tableColumns[index];
        /*                    if (_this.selectFormItem.type === 'data_select' || _this.selectFormItem.type === 'user_select'
                        || _this.selectFormItem.type === 'company_select') {
                        // 通用数据,映射配置的处理
                        if (_this.data.tableColumns instanceof Array) {
                            _this.data.tableColumns.forEach(t => {
                                let tmpObj = {};
                                tmpObj.model = t.model;
                                tmpObj.name = t.name;
                                if (t.type !== 'data_select' && t.type !== 'org_select' && t.type !== 'user_select'
                                    && t.type !== 'company_select' && t.type !== 'role_select'
                                    && t.type !== 'dic_select' && t.type !== 'gis_select' && t.type !== 'region_select') {
                                    tmpArray.push(tmpObj);
                                }
                            })
                        }
                        this.$emit("loadFormMapping", tmpArray);
                    }*/
      } else {
        this.$emit('onFormItemList', _this.data.list);
        // 普通
        _this.selectFormItem = _this.data.list[index];
        if (
          _this.selectFormItem.type === "data_select" ||
          _this.selectFormItem.type === "m_data_select" ||
          _this.selectFormItem.type === "user_select" ||
          _this.selectFormItem.type === "m_user_select" ||
          _this.selectFormItem.type === "company_select" ||
          _this.selectFormItem.type === "m_company_select"
        ) {
          // 通用数据,映射配置的处理
          let tempConfig = _this.data;
          if (_this.data.span) {
            // 栅格,则通知到父组件FormBox进行处理
            this.$emit("loadFormMapping", []);
            return false;
          }
          for (let i = 0, n = tempConfig.list.length; i < n; i++) {
            let obj = tempConfig.list[i];
            if ("grid" === obj.type) {
              loop(obj, tmpArray, _this);

              function loop(obj, arr, _this) {
                let columns = obj.columns;
                for (let j = 0, m = columns.length; j < m; j++) {
                  let colObj = columns[j];
                  colObj.list.forEach((lsObj) => {
                    if (
                      (lsObj.type !== "data_select" &&
                        lsObj.type !== "m_data_select" &&
                        lsObj.type !== "org_select" &&
                        lsObj.type !== "m_org_select" &&
                        lsObj.type !== "user_select") ||
                      (lsObj.type !== "m_user_select" &&
                        lsObj.type !== "company_select" &&
                        lsObj.type !== "m_company_select" &&
                        lsObj.type !== "role_select" &&
                        lsObj.type !== "m_role_select" &&
                        lsObj.type !== "dic_select" &&
                        lsObj.type !== "m_dic_select" &&
                        lsObj.type !== "gis_select" &&
                        lsObj.type !== "region_select")
                    ) {
                      arr.push(lsObj);
                    }
                    if ("grid" === lsObj.type) {
                      loop(obj, _this);
                    }
                  });
                }
              }
            } else if ("table" !== obj.type && "flow_table" !== obj.type) {
              if (
                obj.type !== "data_select" &&
                obj.type !== "m_data_select" &&
                obj.type !== "org_select" &&
                obj.type !== "m_org_select" &&
                obj.type !== "user_select" &&
                obj.type !== "m_user_select" &&
                obj.type !== "company_select" &&
                obj.type !== "m_company_select" &&
                obj.type !== "role_select" &&
                obj.type !== "m_role_select" &&
                obj.type !== "dic_select" &&
                obj.type !== "m_dic_select" &&
                obj.type !== "gis_select" &&
                obj.type !== "region_select"
              ) {
                tmpArray.push(obj);
              }
            }
          }
        }
        this.$emit("loadFormMapping", tmpArray);
      }
    },

    // 删除控件
    deleteBoxItem(index) {
      let _this = this;
      if (_this.data.tableColumns && _this.data.tableColumns.length > 0) {
        _this.$emit("changeNum", _this.data.tableColumns[index].type, "delete"); // 通知父组件,控件命名需要作调整
        if (_this.data.tableColumns.length - 1 === index) {
          if (index === 0) {
            _this.selectFormItem = {};
          } else {
            _this.selectFormItem = _this.data.tableColumns[index - 1];
          }
        } else {
          _this.selectFormItem = _this.data.tableColumns[index + 1];
        }
        _this.$nextTick(() => {
          _this.data.tableColumns.splice(index, 1);
        });
      } else {
        _this.$emit("changeNum", _this.data.list[index].type, "delete"); // 通知父组件,控件命名需要作调整
        if (_this.data.list.length - 1 === index) {
          if (index === 0) {
            _this.selectFormItem = {};
          } else {
            _this.selectFormItem = _this.data.list[index - 1];
          }
        } else {
          _this.selectFormItem = _this.data.list[index + 1];
        }
        _this.$nextTick(() => {
          _this.data.list.splice(index, 1);
        });
      }
    },

    // 复制控件
    copyBoxItem(index) {
      // 通知父组件
      this.$emit("changeNum", index, "copy");
      let _this = this;
      let cloneData = {
        ..._this.data.list[index],
        // options: {..._this.data.list[index].options},
        key: Date.parse(new Date()) + "_" + Math.ceil(Math.random() * 99999),
      };

      if (
        _this.data.list[index].type === "radio" ||
        _this.data.list[index].type === "checkbox"
      ) {
        cloneData = {
          ...cloneData,
          options: {
            ...cloneData.options,
            options: cloneData.options.options.map((item) => ({ ...item })),
          },
        };
      }
      _this.data.list.splice(index, 0, cloneData);
      _this.$nextTick(() => {
        _this.selectFormItem = _this.data.list[index + 1];
      });
    },
  },
};
</script>

<style scoped lang="scss"></style>
