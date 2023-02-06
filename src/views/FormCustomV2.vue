<template>
  <div class="FormTheme" :formId="formId" id="chartVue">
    <!-- 页面新增 编辑 详情 自定义 -->
    <div id="FormPage"></div>
    <previewDrag id="FormDrag" ref="cyGridster" :your-list="myList" :baseMarginTop="baseMarginTop">
      <template v-for="(item,index) in myList" :slot="'slot'+index">
        <div
          class="dragHandle"
          style="height: 100%;overflow:auto;"
          :key="index"
          onClick="event.cancelBubble = true"
          :style="[
            {
              'background-color': item.backgroundColor
                ? item.backgroundColor
                : 'transparent',
            },
            { border: item.borderColor ? '1px solid ' + item.borderColor : 'none' },
            {
              padding:
                (typeof item.paddingTop === 'number' ? item.paddingTop + 'px' : '25px') +
                ' ' +
                (typeof item.paddingRight === 'number'
                  ? item.paddingRight + 'px'
                  : '5px') +
                ' ' +
                (typeof item.paddingBottom === 'number'
                  ? item.paddingBottom + 'px'
                  : '5px') +
                ' ' +
                (typeof item.paddingLeft === 'number' ? item.paddingLeft + 'px' : '5px'),
            },
          ]"
        >
          <!--左侧标题-->
          <div class="tool-title">
            <!--挂载菜单后不显示-->
            <template v-if="item.style">
              <div
                class="caption"
                v-if="item.style.mainTitleVisiable"
                :style="{ color: item.style.mainTitleColor }"
              >
                {{ item.style.mainTitle }}
              </div>
            </template>
            <template v-else>
              <div class="caption">{{ item.name }}</div>
            </template>
          </div>
          <!--表格-->
          <template
            v-if="
              item.type &&
              item.type === 'reportWidget' &&
              item.reportType === 'tableReportWidget'
            "
          >
            <table-widget
              :item="item"
              :ref="'tableWidget' + index"
              :formId="formId"
              :queryParams="queryParams"
              :assignConditions="assignConditions"
              :isPreview="true"
              style="height: 100%"
              :formConfig="formConfig"
            ></table-widget>
          </template>
          <!--Tab标签页-->
          <template v-if="item.type && item.type === 'tabPageWidget'">
            <custom-tab
              :tab-page-widget-id="item.id"
              :active-tab-id="item.activeTabId"
              :editable-tabs="item.tabs"
              :tab-item="item"
              :review-type="reviewType"
              :notify-tab-query-custom="notifyTabQueryCustom"
              :tab-query-param="tabQueryParam"
              :form-id="formId"
              :sensor-settings-v2="sensorSettingsV2"
              @queryByCustomCondition="queryByCustomCondition"
              :baseMarginTop="baseMarginTop"
            ></custom-tab>
          </template>
          <!--查询控件-->
          <template v-if="item.type && item.type === 'queryWidget'">
            <query-widget
              :formId="formId"
              :queryWidgetData="item"
              :formConfig="formConfig"
              @queryFormConditions="queryByCustomCondition"
            ></query-widget>
          </template>
          <!--文本控件-->
          <template v-if="item.type && item.type === 'textWidget'">
            <text-widget :textWidgetData="item" :isEdit="true"></text-widget>
          </template>
          <!--图片控件-->
          <template v-if="item.type && item.type === 'imgWidget'">
            <image-widget :imageWidgetData="item"></image-widget>
          </template>
          <!--内嵌页面-->
          <template v-if="item.type && item.type === 'innerPageWidget'">
            <form-inner-page-widget
              :currentFormId="formId"
              :widget="item"
              @queryByInnerPageParam="queryByInnerPageParam"
              style="width: 100%; height: 100%"
            ></form-inner-page-widget>
          </template>
        </div>
      </template>
    </previewDrag>

    <el-dialog
      top="10vh"
      :visible.sync="conditionVisible"
      v-if="conditionVisible"
      :modal="false"
      width="85%"
      :close-on-click-modal="false"
    >
      <condition-config
        :widgets="myList"
        @closeCondition="conditionVisible = false"
        :formConfig="formConfig"
        :queryId="queryId"
      ></condition-config>
    </el-dialog>
  </div>
</template>
<script>
let chartInstanceBox = {};
import PreviewCustomTab from "@/components/form-design/restructure/drag/preview/FormPreviewCustomTab.vue";
import QueryWidget from "@/components/form-design/restructure/queryWidget/FormQueryWidget.vue";
import TextWidget from "@/components/form-design/restructure/textWidget/FormTextWidget.vue";
import TableWidget from "@/components/form-design/restructure/tableWidget/FormTableWidget.vue";
import ImgWidget from "@/components/form-design/restructure/imgWidget/FormImgWidget.vue";
import FormInnerPageWidget from "@/components/form-design/restructure/innerPageWidget/FormInnerPageWidget.vue";
import ConditionConfig from "@/components/form-design/restructure/conditions/FormConditionConfig";
import FormInnerPageBase from "@/components/form-design/restructure/innerPageWidget/FormInnerPageBase";
import previewDrag from "@/components/form-design/restructure/drag/preview/PreviewDrag.vue"
import "@/assets/theme/form/index.scss"
const inv = [];
export default {
  name: "FormCustomV2",
  extends: FormInnerPageBase,
  components: {
    "query-widget": QueryWidget,
    "custom-tab": PreviewCustomTab,
    "text-widget": TextWidget,
    "image-widget": ImgWidget,
    "table-widget": TableWidget,
    "condition-config": ConditionConfig,
    "form-inner-page-widget": FormInnerPageWidget,
    previewDrag
  },
    props: {
        //指定的表单ID 和指定的查询条件 可以供其他组件使用加载需要显示的表单和设置自定义固定查询条件
        assignFormId: {type: Number, require: false,default : null},
        assignConditions:{type:Array ,require:false,default :()=>[]}
    },
  mounted() {
    let _this = this;
    //有可能当前显示的组件是从内嵌页面过来的，不能通过路由获取formId 避免造成死循环
    //有可能当前显示的组件是从内嵌页面过来的，不能通过路由获取formId 避免造成死循环
    if (!_this.isInnerPage) {
        if(_this.assignFormId){
            _this.formId = _this.assignFormId;
        }else {
            let currentPath = _this.$router.currentRoute.path;
            currentPath = currentPath.replace(/^\s*|\s*$/g, "");
            _this.formId = currentPath.substring(
                currentPath.lastIndexOf("/") + 1,
                currentPath.length
            );
        }
      if (!_this.KHUtils.isNumber(_this.formId)) {
        _this.$notify.error({
          title: "错误",
          message: "当前路由不为字符串:" + currentPath,
        });
        return false;
      }

    } else {
      //FormCustomV2是内嵌页面时，需要延迟处理否则渲染界面会出错
      setTimeout(function () {
        _this.formId = _this.innerPageFormId;
          if(_this.KHUtils.isNull(_this.formId)){
              _this.initFormCustom();
          }
        _this.initFormCustom();
      }, 2000);
    }
        if(!_this.KHUtils.isNull(_this.formId)){
            _this.formId = parseInt(_this.formId);
        }

      _this.initFormCustom();


  },
  data() {
    return {
      customComponent: "",
      innerPageComponentHackSet: false,
      innerPageParam: [],
      notifyTabQueryCustom: 0,
      tabQueryParam: [],
      notifyCancelSelected: 0,
      notifyTabQuery: 0,
      currentSelectItem: {}, // 当前选中的控件
      tdLoading: false,
      seriesData: [],
      refreshTextWidget: true,
      addOrEdit: true, // 默认新增状态
      resizable: true,
      draggable: true,
      myList: [],
      formId: null,
      sensorSettingsV2: {},
      formConfig: {},
      queryParams: [],
      conditionVisible: false,
      queryId: "",
      reviewType: "back",
      FIPWShow: true,
    };
  },
  computed:{
    baseMarginTop(){
      try {
        return this.sensorSettingsV2.layout.style.verticalSpacing
      } catch (error) {
        return 5
      }
    } 
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

  methods: {
    initFormCustom() {
      let _this = this;
      if (_this.KHUtils.isNull(_this.formId)) {
        return false;
      }
      _this.formId = parseInt(_this.formId);
      _this
        .$Get(_this.khConfig.api.getFormConf + "/" + _this.formId)
        .then(async (res) => {
          if (res.errCode === 0) {
            if (!_this.KHUtils.isNull(res.formConf)) {
              _this.formConfig = JSON.parse(res.formConf.formMeta);
              _this.KHForm.convertSensorSettingsV2(_this.formId, _this);
              _this.sensorSettingsV2 = _this.formConfig.sensorSettingsV2;
              if (_this.KHUtils.isNull(_this.sensorSettingsV2)) {
                /*  _this.$notify.warning({
                                    title: '警告',
                                    message: "报表ID(" + _this.formId + "): 暂未进行相关的报表设计"
                                });*/
                return false;
              }
              if (
                !(_this.sensorSettingsV2.widgets instanceof Array) ||
                _this.sensorSettingsV2.widgets.length === 0
              ) {
                return false;
              }
              _this.myList = _this.KHUtils.clone(_this.sensorSettingsV2.widgets);

              _this.KHReport.initReportQueryCondtions(_this, _this.myList); // 初始化查询条件默认值

              _this.myList.forEach((obj) => {
                if (obj.type === "innerPageWidget" && obj.innerType === "1") {
                  let url = obj.src;
                  let componentName = url.substring(url.lastIndexOf("/") + 1, url.length);
                  _this.KHForm.registerComponent(componentName, url);
                  _this.customComponent = componentName;
                  _this.innerPageComponentHackSet = false;
                  _this.$nextTick(() => {
                    _this.innerPageComponentHackSet = true;
                  });
                }
                if (
                  obj.type === "textWidget" ||
                  obj.type === "imgWidget" ||
                  obj.type === "innerPageWidget" ||
                  obj.type === "queryWidget" ||
                  obj.type === "tabPageWidget"
                ) {
                  return false;
                }
                // 定时器(挂载菜单后执行)
                if (obj.sensior && obj.sensior.autoRefresh) {
                  let countType = obj.sensior.countType;
                  if ("minute" === countType) {
                    let senconds = 60 * obj.sensior.count;
                    _this.autoRefresh(obj, senconds, senconds);
                  }
                }
              });
            } else {
              /*  _this.$notify.warning({
                                title: '警告',
                                message: "报表ID(" + _this.formId + "): 暂未进行相关的报表设计"
                            });*/
            }
          }
        });
    },

    // 定时任务刷新
    autoRefresh(obj, seconds, tempCount) {
      let _this = this;
      inv[obj.id] = setInterval(function () {
        seconds = seconds - 1;
        if (seconds === -1) {
          seconds = tempCount;
          _this.KHReport.commonQuery(obj, _this, chartInstanceBox, _this.myList, true);
        }
      }, 1000);
    },
    // 根据内嵌页面嵌入自定义组件,传参查询
    queryByInnerPageParam(innerPageParam) {
      this.innerPageParam = innerPageParam;
      this.queryByCustomCondition(innerPageParam);
    },
    // 自定义条件查询
    queryByCustomCondition(queryParams) {
      let _this = this;
      if (_this.innerPageParam instanceof Array && _this.innerPageParam.length > 0) {
        if (queryParams instanceof Array) {
          _this.innerPageParam.forEach((obj) => {
            queryParams.push(obj);
          });
        }
      }
      _this.queryParams = queryParams;
      console.log("查询条件1：" + JSON.stringify(queryParams));
      _this.KHForm.queryByCustomCondition(queryParams, _this.myList, _this);
      _this.notifyTabQueryCustom++;
      _this.tabQueryParam = queryParams;
    },
    triggerVue(params) {
      ;
      let _this = this;
      if (_this.KHUtils.isNull(_this.formId)) {
        _this.formId = params.$formId;
        _this.initFormCustom();
      }
      //组装查询条件
      if (!_this.KHUtils.isNull(params)) {
        let conditions = [];
        Object.keys(params).forEach(function (key) {
          if (key != "$formId") {
            //参数为‘’或null 不作为查询条件
            if (!_this.KHUtils.isNull(params[key])) {
              let condition = {};
              condition.key = key;
              condition.type = "$eq";
              condition.value = params[key];
              conditions.push(condition);
            }
          }
        });
        _this.queryByCustomCondition(conditions);
      }
    },
  },
};
</script>

<style lang="scss" scoped>
@import "@/assets/style/dialog-maxheight.scss";
@import "@/assets/style/form/drag-power.scss";
</style>
