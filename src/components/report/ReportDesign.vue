<template>
    <el-row class="report-design">
        <el-dialog
            title=""
            :visible.sync="editFormVisible"
            :show-close="false"
            :close-on-click-modal="false"
            custom-class="custom-report-dia"
            fullscreen
        >
            <!--导航行-->
            <div class="container-header">
                <div class="header-left">
                    <el-tooltip effect="dark" content="返回" placement="bottom">
                        <span class="header-icon">
                            <img src="../../assets/images/back.png" @click="goBack" alt/>
                        </span>
                    </el-tooltip>
                    <h4 class="header-title">
                        <!-- <el-input v-model="reportName"></el-input>-->
                        <input type="text" autocomplete="off" class="el-input__inner"
                               style=" background-color: transparent;border-color: transparent;color: #ffffff"
                               v-model="reportName">
                    </h4>
                </div>
                <div class="header-right">
                    <div style="position: relative;left: -20%;">
                        <el-tooltip effect="dark" content="页面设置" placement="bottom">
                            <el-button type="text" size="medium" @click="notifyItemChange(null)"
                                       icon="el-icon-s-tools"></el-button>
                        </el-tooltip>
                        <!--     <el-button
                                 type="info"
                                 size="mini"
                                 style="background: rgba(196,211,255,.2);border-color:rgba(196,211,255,.2)"
                             >编辑
                             </el-button>
                             <el-button
                                 type="info"
                                 size="mini"
                                 style="background: rgba(196,211,255,.2);border-color:rgba(196,211,255,.2)"
                             >预览
                             </el-button>-->
                        <el-button type="info" size="mini" style="background: #0b1532;border-color: #2153d4"
                                   :loading="saveReportConfLoading"
                                   @click="saveReportConf">保存
                        </el-button>
                        <!--                     <el-button
                                                 type="primary"
                                                 size="mini"
                                                 style="background: #2153d4;border-color: #2153d4"
                                             >保存并发布
                                             </el-button>-->
                    </div>
                </div>
            </div>

            <div class="main">
                <div class="main-page animated watermark">
                    <div class="main-icons">
                        <draggable
                            tag="ul"
                            :list="reportTypeItems.basic"
                            v-bind="{group:{ name:'people', pull:'clone',put:false},sort:false, ghostClass: 'ghost'}"
                            :move="clickMove"
                        >
                            <li
                                class="form-edit-widget-label"
                                :class="{'no-put': item.type === 'divider'}"
                                v-for="(item, index) in reportTypeItems.basic"
                                @click="addDragPowerClickListen(item.type)"
                                :key="index"
                            >
                                <a>
                                    <el-tooltip effect="dark" :content="item.name" placement="bottom">
                                        <i class="icon iconfont" :class="item.icon"></i>
                                    </el-tooltip>
                                </a>
                            </li>
                        </draggable>
                    </div>
                    <div class="drag-container">
                        <drag-power
                            :add-widget-event-listen="addWidgetEventListen"
                            :widget-type="reportType"
                            :my-list="reportSet.widgets"
                            :review-widget-event-listen="reviewWidgetEventListen"
                            :review-type="reviewType"
                            :base-set="reportSet.layout.style"
                            @notifyItemChange="notifyItemChange"
                            :themeMeta="themeMeta"
                             ref="dragPower">
                        </drag-power>
                    </div>
                </div>
                <div class="main-operation">
                    <div class="main-data">
                        <report-set :item="currentSelectItem" v-if="reportSetHackSet" :base-set="reportSet.layout.style"
                                    @refreshChart="refreshChart" @reviewItem="reviewItem"   @addTheme="addTheme"    @resetTheme="resetTheme"
                                    @refreshTheme="refreshTheme">
                        </report-set>
                    </div>
                </div>
            </div>
        </el-dialog>
      <el-dialog title="添加主题" :visible.sync="themeDialogVisible" :modal="false">
        <el-form :model="themeInfo"  label-width="120px">
          <el-form-item label="主题名称" >
            <el-input v-model="themeInfo.themeName" style="width: 200px" ></el-input>
          </el-form-item>
        </el-form>
        <div slot="footer" class="dialog-footer">
          <el-button @click="themeDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="saveTheme" :loading="themeLoading">确 定</el-button>
        </div>
      </el-dialog>
    </el-row>
</template>

<script>
    import DragPower from "@/components/report/drag/DragPower";
    import ReportSet from "@/components/report/ReportSet";
    import reportTypeItems from "@/utils/report/reportType.config";
    import Draggable from "vuedraggable";

    export default {

        name: "ReportDesign",
        components: {ReportSet, Draggable, DragPower},
        props: {
            type: {},
            dataConf: {
                type: Object,
                required: true
            },
        },
        created() {
            let _this = this;
            if (_this.dataConf && _this.dataConf.settingMeta && !_this.KHUtils.isNull(_this.dataConf.settingMeta)) {
                _this.reportSet = _this.KHUtils.clone(JSON.parse(_this.dataConf.settingMeta));
                _this.reportName = _this.dataConf.reportName;
                _this.reportId = _this.dataConf.reportId;
                /*                if (_this.reportSet.widgets instanceof Array && _this.reportSet.widgets.length > 0) {
                                    _this.notifyItemChange(_this.reportSet.widgets[0]); // 默认选中第一个
                                }*/
            }
        },
        data() {
            return {
                reviewType: "back", // front:不调用后台接口,仅前端做样式的更新;back:调用后台接口
                activeName: "first",
                editFormVisible: true,
                reportTypeItems: reportTypeItems,
                reportType: "",
                reportId: "",
                addWidgetEventListen: 0,
                reviewWidgetEventListen: 0,
                currentSelectItem: null,
                reportSetHackSet: true,
                reportSet: {
                    "layout": {
                        "rows": [
                            {
                                "columns": [
                                    {
                                        "widgetId": ""
                                    }
                                ]
                            }
                        ],
                        "style": {
                            verticalSpacing: 5,
                          backgroundColor:null
                        }
                    },
                    "widgets": [],
                    "themeId":null
                },
                saveReportConfLoading: false,
                reportName: "未命名",
              themeDialogVisible:false,
              themeInfo:{
                themeName:"",
                themeMeta:{
                  widgetsStyle:[]
                },
                type:2
              },
              themeMaps:[],
              themeLoading:false,
              themeMeta:{}
            };
        },
      mounted() {
        let _this = this;
        //获取主题
        _this.themeMeta = {};
        if(!_this.KHUtils.isNull(_this.reportSet.themeId)){
          this.$Get(this.khConfig.api.queryThemeMeta+"/"+_this.reportSet.themeId).then(res => {
            if (res.errCode === 0) {
              _this.themeMeta = JSON.parse(res.themeMeta);
            }
          });
        }

      },
        methods: {
          refreshTheme(themeId,themeMeta){
            let _this = this;
            _this.themeMeta = {};
            _this.themeMeta = themeMeta;
            _this.reportSet.themeId = themeId;
            let widgetsStyle = themeMeta.widgetsStyle;
            let layout = _this.reportSet.layout;
            if(themeMeta.verticalSpacing){
              layout.style.verticalSpacing = themeMeta.verticalSpacing;
            }
            if(themeMeta.backgroundColor){
              _this.$set(layout.style,'backgroundColor',themeMeta.backgroundColor);
            }
            if(widgetsStyle instanceof Array && widgetsStyle.length>0){
              let widgets = _this.reportSet.widgets;
              if(widgets instanceof Array && widgets.length>0){
                _this.updateThemeStyle(widgets,widgetsStyle);
              }
            }
            _this.$refs.dragPower.refreshWidgets();



          },
          updateThemeStyle(widgets,widgetsStyle){
            let _this = this;
            for(var i = 0;i<widgets.length;i++) {
              let widget = widgets[i];
              let type = widget.type;
              if (type === "reportWidget") {
                type = widget.reportType;
              }

              let themeStyle = _this.findWidgetStyle(type,widgetsStyle);
              if(themeStyle && !_this.KHUtils.isNull(themeStyle)){
                widget.paddingTop = themeStyle.paddingTop;
                widget.paddingRight = themeStyle.paddingRight;
                widget.paddingBottom = themeStyle.paddingBottom;
                widget.paddingLeft = themeStyle.paddingLeft;
                widget.borderColor = themeStyle.borderColor;
                widget.backgroundColor = themeStyle.backgroundColor;
                widget.style = themeStyle.style
              }
              if(type === "tabPageWidget"){
                if(widget.tabs instanceof Array && widget.tabs.length>0){
                  widget.tabs.forEach((tab,index)=>{
                    if(tab.tabContent.widgets instanceof Array && tab.tabContent.widgets.length>0){
                      _this.updateThemeStyle(tab.tabContent.widgets,widgetsStyle);
                    }
                  })
                }
              }
            }
          },
          findWidgetStyle(type,widgetsStyle){
            let style = null;
            if(widgetsStyle instanceof Array && widgetsStyle.length>0){
              widgetsStyle.forEach((item,index)=>{
                if(item.widgetType === type){
                  style = item;
                  return style;
                }
              })
            }
            return style;
          },
            resetTheme(){
                let _this = this;
                let layout = _this.reportSet.layout;
                layout.style.verticalSpacing = 5;
                _this.$set(layout.style, 'backgroundColor', null);
                let widgets = _this.reportSet.widgets;
                if (widgets instanceof Array && widgets.length > 0) {
                    _this.resetWidgetTheme(widgets);
                }
                _this.themeMeta = {};
                _this.$refs.dragPower.refreshWidgets();

            },
            resetWidgetTheme(widgets){
                let _this = this;
                for (var i = 0; i < widgets.length; i++) {
                    let widget = widgets[i];
                    let type = widget.type;
                    if (type === "reportWidget") {
                        type = widget.reportType;
                    }

                    widget.paddingTop = 25;
                    widget.paddingRight = 5;
                    widget.paddingBottom =5;
                    widget.paddingLeft = 5;
                    widget.borderColor = null;
                    widget.backgroundColor = null;
                    let style =  this.WidgetHelper.getWidgetInitStyle(type,_this);
                    if(!_this.KHUtils.isNull(style)){
                        widget.style = style;

                    }

                    if (type === "tabPageWidget") {
                        if (widget.tabs instanceof Array && widget.tabs.length > 0) {
                            widget.tabs.forEach((tab, index) => {
                                if (tab.tabContent.widgets instanceof Array && tab.tabContent.widgets.length > 0) {
                                    _this.resetWidgetTheme(tab.tabContent.widgets);
                                }
                            })
                        }
                    }
                }
            },
          addTheme(){
            let _this = this;
            _this.themeInfo={
              themeName:"",
              themeMeta:{
                widgetsStyle:[]
              },
              type:2
            }
            _this.themeDialogVisible = true;


          },
          saveTheme(){
            let _this = this;
            _this.themeMaps = []
            let widgets = _this.reportSet.widgets;
            if(widgets instanceof Array && widgets.length>0){
              let layout = _this.reportSet.layout;
              if(layout.style && layout.style.verticalSpacing){
                _this.themeInfo.themeMeta.verticalSpacing = layout.style.verticalSpacing;
              }
              if(layout.style && layout.style.backgroundColor){
                _this.themeInfo.themeMeta.backgroundColor = layout.style.backgroundColor;
              }
              _this.converThemeInfo(widgets);
              _this.themeLoading = true;
              _this.$PostJson(this.khConfig.api.addTheme, _this.themeInfo).then(res => {
                _this.themeDialogVisible = false;
                _this.themeLoading = false;
                if (res.errCode === 0) {
                  this.$notify({
                    title: '成功',
                    message: '主题保存成功',
                    type: 'success'
                  });


                } else {

                }
              }).catch((e) => {
                _this.themeDialogVisible = false;
                _this.themeLoading = false;
                console.log(e);
              });

            }else {
              this.$message({
                message: '未找到任何控件',
                type: 'warning'
              });
            }

          },
          converThemeInfo(widgets){
            let _this = this;
            for(var i = 0;i<widgets.length;i++){
              let widget = widgets[i];
              let type = widget.type;
              if(type === "reportWidget"){
                type = widget.reportType;
              }
              if(_this.themeMaps.indexOf(type) == -1){
                let newObj = {};
                newObj.widgetType = type;
                newObj.paddingTop = widget.paddingTop;
                newObj.paddingRight = widget.paddingRight;
                newObj.paddingBottom = widget.paddingBottom;
                newObj.paddingLeft = widget.paddingLeft;
                newObj.borderColor = widget.borderColor;
                newObj.backgroundColor = widget.backgroundColor;

                newObj.style = widget.style;
                _this.themeMaps.push(type);
                _this.themeInfo.themeMeta.widgetsStyle.push(newObj);
                if(type === "tabPageWidget"){
                  if(widget.tabs instanceof Array && widget.tabs.length>0){
                    widget.tabs.forEach((tab,index)=>{
                      if(tab.tabContent.widgets instanceof Array && tab.tabContent.widgets.length>0){
                        _this.converThemeInfo(tab.tabContent.widgets);
                      }
                    })
                  }
                }
              }
            }
          },
            refreshChart(isNewChart) {
                let _this = this;
                _this.reviewType = isNewChart ? "back" : "front";
                _this.reviewWidgetEventListen++;
            },
            // 更新预览,对应监听DragPower更新按钮
            reviewItem() {
                let _this = this;
                _this.reviewType = "back";
                _this.reviewWidgetEventListen++;
                //console.log("reviewItem reportSet: " + JSON.stringify(_this.reportSet));
            },
            // 切换选择控件,对应显示不同的属性设置
            notifyItemChange(currentSelectItem) {
                let _this = this;
                _this.currentSelectItem = currentSelectItem;
                _this.reportSetHackSet = false;
                _this.$nextTick(() => {
                    _this.reportSetHackSet = true
                })
            },
            // 双击选择添加控件
            addDragPowerClickListen(type) {
                let _this = this;
                _this.reportType = type;
                _this.addWidgetEventListen++;
            },
            // 返回报表配置
            goBack() {
                this.editFormVisible = false;
                this.$emit("goBack")
            },
            // 保存报表配置
            saveReportConf() {
                let _this = this;
                _this.saveReportConfLoading = true;
                _this.reportSet.version = 1
                //控件配置重新排序
                _this.reportSet.widgets = _this.reportSet.widgets.sort((a, b) => {
                    if (a.y == b.y) {
                    return a.x - b.x;
                    } else {
                    return a.y - b.y;
                    }
                });
                let param = {
                    reportName: _this.reportName,
                    settingMeta: _this.reportSet,
                };
                if (!_this.KHUtils.isNull(_this.dataConf.reportId)) {
                    param.reportId = _this.dataConf.reportId;
                }
                if (_this.reportSet.widgets instanceof Array) {
                    _this.reportSet.widgets.forEach(wt => {
                        if (wt.desc) {
                            delete wt.desc;
                        }
                        if (wt.seriesData) {
                            delete wt.seriesData;
                        }
                        if (wt.drillNavigation) {
                            wt.drillNavigation = [];
                        }
                    })
                }
                //console.log("saveReportConf :" + JSON.stringify(param));
                _this.$PostJson(_this.khConfig.api.saveDataReportConf, param).then(res => {
                    if (res.errCode === 0) {
                        _this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                        if (!_this.KHUtils.isNull(res.reportId)) {
                            _this.dataConf.reportId = res.reportId;
                        }
                    }
                    _this.saveReportConfLoading = false;
                }).catch((e) => {
                    console.log(e)
                });
            },
            clickMove() {
                return true;
            },
        },
    };
</script>


<style lang="scss" scoped>
    @import "@/assets/style/report/report-design.scss";
</style>
