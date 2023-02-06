<template>
  <div class="scrollBar">
    <!-- <div style="width: 100%;height: 100%"> -->
    <template v-if="widget.innerType === '0'">
      <iframe
        v-if="refreshIFrame"
        :style="{ pointerEvents: pointerEvents ? 'none' : '' }"
        :src="iframeUrl"
        width="100%"
        height="100%"
        style="border-width: 0; height: calc(100% - 3px)"
      ></iframe>
    </template>
    <template v-if="widget.innerType === '1' || widget.innerType === '2'">
      <template v-if="FIPWShow">
        <component
          v-if="innerPageComponentHackSet"
          :is="customComponent"
          :currentFormId="currentFormId"
          :widget="widget"
          :isInnerPage="true"
          @queryByInnerPageParam="queryByInnerPageParam"
        ></component>
      </template>
    </template>
    <template v-if="widget.innerType === '3'">
        <template v-if="FIPWShow">
            <component
                v-if="innerPageComponentHackSet"
                :is="customComponent"
                :currentFormId="currentFormId"
                :widget="widget"
                :isInnerPage="true"
            ></component>
        </template>

    </template>
    <!-- </div> -->
  </div>
</template>

<script>
export default {
  name: "FormInnerPageWidget",
  props: {
    currentFormId: { type: Number, require: true },
    widget: { type: Object, require: true },
    dynCols: { type: Array },
    pointerEvents: {
      type: Boolean,
      default: false,
    },
    FIPWShow: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      customComponent: "",
      innerPageComponentHackSet: false,
      innerPageParam: [],
      eventTopic: "topic-form-" + this.currentFormId,
      refreshIFrame: true,
      iframeUrl: this.widget.src,
    };
  },
  created() {
    let _this = this;
    if (_this.widget.innerType === "1") {
      let url = _this.widget.src;
      let componentName = url.substring(url.lastIndexOf("/") + 1, url.length);
      _this.KHForm.registerComponent(componentName, url);
      _this.customComponent = componentName;
      _this.innerPageComponentHackSet = false;
      _this.$nextTick(() => {
        _this.innerPageComponentHackSet = true;
      });
    }
    if (_this.widget.innerType === "2") {
      let url = "@/views/FormCustomV2";
      let componentName = url.substring(url.lastIndexOf("/") + 1, url.length);
      _this.KHForm.registerComponent(componentName, url);
      _this.customComponent = componentName;
      _this.innerPageComponentHackSet = false;
      _this.$nextTick(() => {
        _this.innerPageComponentHackSet = true;
      });
    }
    if (_this.widget.innerType === "3") {
      let url = "@/views/ReportCustom";
      let componentName = url.substring(url.lastIndexOf("/") + 1, url.length);
      _this.KHForm.registerComponent(componentName, url);
      _this.customComponent = componentName;
      _this.innerPageComponentHackSet = false;
      _this.$nextTick(() => {
        _this.innerPageComponentHackSet = true;
      });
    }
    if (!_this.KHUtils.isNull(_this.eventTopic)) {
      _this.$EventBus.$on(_this.eventTopic, function (value) {
        if (_this.widget.innerType === "0") {
          _this.iframeUrl = _this.widget.src;
          if (_this.widget.params instanceof Array && _this.widget.params.length > 0) {
            _this.iframeUrl = _this.iframeUrl.concat("?");
            for (var i = 0; i < _this.widget.params.length; i++) {
              let param = _this.widget.params[i];
              let str = param.paramName + "=" + value[param.model];
              if (i < _this.widget.params.length - 1) {
                str = str.concat("&");
              }
              _this.iframeUrl = _this.iframeUrl.concat(str);
            }
          }
          console.log("iframeUrl:", _this.iframeUrl);
          _this.refreshIFrame = false;
          _this.$nextTick(() => {
            _this.refreshIFrame = true;
          });
        }
      });
    }
  },
  methods: {
    queryByInnerPageParam(innerPageParam) {
      this.$emit("queryByInnerPageParam", innerPageParam);
    },
  },
};
</script>

<style>
.scrollBar {
  height: 100%;
  width: 100%;
  position: relative;
  box-sizing: border-box;
  overflow: auto;
}
</style>
