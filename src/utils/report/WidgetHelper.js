var WidgetHelper = {
    /**
     *
     * @param addChart defaultType 图表类型,column:柱状,bar:条形
     * @param addChart name 图表对应的名称
     * @param addChart reportType 控件类型
     * @param _this DragPower对象
     * @param gridster 拖拽缩放 对象
     * @param x
     * @param y
     * @param sizex
     * @param sisey
     */
    // 表格增加
    addImageWidget(_this, gridster, x, y, sizex, sisey) {
        let widgetStyle =  _this.KHUtils.clone(_this.WidgetStyleConstants.imgWidgetStyle);
        let item = {
            id: new Date().getTime(),
            name: "图片控件",
            type: "imgWidget",
            borderColor: "#EBEAEF",
            paddingTop: 25,
            paddingRight: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            x: x,
            y: y,
            sizex: sizex,
            sizey: sisey,
            layout: {},
            imageUrl: "",
            adjustUrl: "",
            style: widgetStyle,
            content: null,
            showMoreOptVisible: false,
        };
      this.addThemeStyle(item,_this);
        item.designMaxCell = gridster.getMaxCell();
        gridster.addItemBox(item);
        _this.currentSelectItem = item;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
        _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
    },
    // 查询控件增加
    addQuery(_this, gridster, x, y, sizex, sisey) {
        let widgetStyle =  _this.KHUtils.clone(_this.WidgetStyleConstants.queryWidgetStyle);
        let item = {
            id: new Date().getTime(),
            name: "查询控件",
            type: "queryWidget",
            borderColor: "#EBEAEF",
            paddingTop: 25,
            paddingRight: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            x: x,
            y: y,
            sizex: sizex,
            sizey: sisey,
            layout: {},
            conditions: [],
            num: 0,
            style: widgetStyle,
            showMoreOptVisible: false,
        };
      this.addThemeStyle(item,_this);
        //let maxCell = gridster.getMaxCell();
        item.designMaxCell = gridster.getMaxCell();
        gridster.addItemBox(item);
        _this.currentSelectItem = item;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
        _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
    },
    // 新增文本控件
    addTextWidget(_this, gridster, x, y, sizex, sisey) {
        let widgetStyle =  _this.KHUtils.clone(_this.WidgetStyleConstants.textWidgetStyle);
        let item = {
            id: new Date().getTime(),
            name: "文本控件",
            type: "textWidget",
            borderColor: "#EBEAEF",
            paddingTop: 25,
            paddingRight: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            x: x,
            y: y,
            sizex: sizex,
            sizey: sisey,
            layout: {},
            style: widgetStyle,
            content: null,
            showMoreOptVisible: false,
        };
      this.addThemeStyle(item,_this);
        item.designMaxCell = gridster.getMaxCell();
        gridster.addItemBox(item);
        _this.currentSelectItem = item;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
        _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
        _this.refreshTextWidget = false;
        _this.$nextTick(function () {
            _this.refreshTextWidget = true;
        })
    },
    // 新增内嵌页面
    addInnerPageWidget(_this, gridster, x, y, sizex, sisey) {
        let widgetStyle =  _this.KHUtils.clone(_this.WidgetStyleConstants.innerPageWidgetStyle);
        let item = {
            id: new Date().getTime(),
            name: "内嵌页面控件",
            type: "innerPageWidget",
            borderColor: "#EBEAEF",
            paddingTop: 25,
            paddingRight: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            x: x,
            y: y,
            sizex: sizex,
            sizey: sisey,
            layout: {},
            src: "",
            style: widgetStyle,
            content: null,
            showMoreOptVisible: false,
        };
      this.addThemeStyle(item,_this);
        item.designMaxCell = gridster.getMaxCell();
        gridster.addItemBox(item);
        _this.currentSelectItem = item;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
        _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
    },
    // 表格增加
    addTableWidget(_this, gridster, x, y, sizex, sisey) {
        let widgetStyle =  _this.KHUtils.clone(_this.WidgetStyleConstants.reportTableWidgetStyle);
        let item = {
            id: new Date().getTime(),
            name: "交叉表",
            type: "reportWidget",
            reportType: "tableReportWidget",
            borderColor: "#EBEAEF",
            paddingTop: 25,
            paddingRight: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            data: {
                dataset: "",
                tableGroup: "aggregate",
                smallType: "tab",
                rowAxis: [],
                colAxis: {
                    classAxis: [],
                    valueAxis: [],
                },
                drillingAxis: [],
                condFilters: [],
                superConds: []
            }, // 数据
            style: widgetStyle, // 样式
            sensior: {
              isExport:false
            }, // 高级
            x: x,
            y: y,
            sizex: sizex,
            sizey: sisey,
            querySize: 1000,
            showMoreOptVisible: false,
        };
      this.addThemeStyle(item,_this);
        item.designMaxCell = gridster.getMaxCell();
        gridster.addItemBox(item);
        _this.currentSelectItem = item;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
        _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
    },
    // Tab增加
    addTabPageWidget(_this, gridster, x, y, sizex, sisey) {
        let widgetStyle =  _this.KHUtils.clone(_this.WidgetStyleConstants.tabPageWidgetStyle);
        let item = {
            id: new Date().getTime(),
            x: x,
            y: y,
            borderColor: "#EBEAEF",
            paddingTop: 25,
            paddingRight: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            sizex: sizex,
            sizey: sisey,
            type: "tabPageWidget",
            reportType: "tabPageWidget",
            showMoreOptVisible: false,
            style:widgetStyle, // 样式
            activeTabId: "0",  // 当前激活选中Tab的ID
            tabs: [
                {
                    tabId: "0",
                    tabName: "Tab 1",
                    remark: "",
                    widgetCount: 0,  // 当前页签中组件的数量
                    tabContent: {
                        layout: {
                            rows: [
                                {
                                    columns: [
                                        {
                                            widgetId: ""
                                        }
                                    ]
                                }
                            ],
                            style: {}
                        },
                        widgets: []
                    },
                },
                {
                    tabId: "1",
                    tabName: "Tab 2",
                    remark: "",
                    widgetCount: 0,  // 当前页签中组件数量
                    tabContent: {
                        layout: {
                            rows: [
                                {
                                    columns: [
                                        {
                                            widgetId: ""
                                        }
                                    ]
                                }
                            ],
                            style: {}
                        },
                        widgets: []
                    },
                }
            ]
        };
      this.addThemeStyle(item,_this);
        item.designMaxCell = gridster.getMaxCell();
        gridster.addItemBox(item);
        _this.currentSelectItem = item;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
    },
    // 指标看板增加
    addKanban(_this, gridster, x, y, sizex, sisey) {
        let widgetStyle =  _this.KHUtils.clone(_this.WidgetStyleConstants.kanbanWidgetStyle);
        let item = {
            id: new Date().getTime(),
            name: "指标看板",
            type: "reportWidget",
            borderColor: "#EBEAEF",
            paddingTop: 25,
            paddingRight: 5,
            paddingBottom: 5,
            paddingLeft: 5,
            reportType: "kanbanWidget",
            x: x,
            y: y,
            sizex: sizex,
            sizey: sisey,
            data: {
                smallType: "kanbanWidget",
                dataset: "",
                valueAxis: [],
                classAxis: [],
                condFilters: [],
                superConds: []
            },
            style:widgetStyle,
            sensior: {
                autoRefresh: false,
                count: 1,
                countType: "minute"
            },
            num: 0,
            querySize: 1000,
            showMoreOptVisible: false,
        };
      this.addThemeStyle(item,_this);
        item.designMaxCell = gridster.getMaxCell();
        gridster.addItemBox(item);
        _this.currentSelectItem = item;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
        _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
    },
    // 线图/柱图/条形图增加
    addChart(defaultType, name, reportType, _this, gridster, x, y, sizex, sizey) {
        let tempItem = _this.KHUtils.clone(_this.Constants.chartWidgetItem);
        tempItem.id = new Date().getTime();
        tempItem.name = name;
        tempItem.reportType = reportType;
        tempItem.data.smallType = defaultType;
        tempItem.style.mainTitle = name;
        if (tempItem.reportType === "lineReportWidget") {
            tempItem.style.lineStyle = defaultType;
        } else {
            tempItem.style.columnStyle = defaultType;
        }
        tempItem.x = x;
        tempItem.y = y;
        tempItem.sizex = sizex;
        tempItem.sizey = sizey;
        this.addThemeStyle(tempItem,_this);
        tempItem.designMaxCell = gridster.getMaxCell();
        gridster.addItemBox(tempItem);
        _this.currentSelectItem = tempItem;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
        _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
    },
    // 组合图增加
    addCompositeChart(_this, gridster, x, y, sizex, sizey) {
        let tempItem = _this.KHUtils.clone(_this.Constants.chartWidgetItem);
        tempItem.id = new Date().getTime();
        tempItem.name = "组合图";
        tempItem.reportType = "compositeReportWidget";
        tempItem.data.viceValueAxis = [];
        tempItem.data.smallType = "line";
        tempItem.style.mainTitle = "组合图";
        tempItem.x = x;
        tempItem.y = y;
        tempItem.sizex = sizex;
        tempItem.sizey = sizey;
        tempItem.designMaxCell = gridster.getMaxCell();
        this.addThemeStyle(tempItem,_this);
        gridster.addItemBox(tempItem);
        _this.currentSelectItem = tempItem;
        _this.addOrEdit = true;
        _this.$emit("notifyItemChange", _this.currentSelectItem);
        _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
    },
    // 饼图增加
    addPieChart(_this, gridster, x, y, sizex, sizey) {
        let tempItem = _this.KHUtils.clone(_this.Constants.pieChartWidgetItem);
        tempItem.id = new Date().getTime();
        tempItem.name = "饼图";
        tempItem.reportType = "pieReportWidget";
        tempItem.data.smallType = "pie";
        tempItem.style.mainTitle = "饼图";
        tempItem.x = x;
        tempItem.y = y;
        tempItem.sizex = sizex;
        tempItem.sizey = sizey;
        tempItem.designMaxCell = gridster.getMaxCell();
        this.addThemeStyle(tempItem,_this);
        gridster.addItemBox(tempItem);
        if (_this.currentSelectItem) {
            _this.currentSelectItem = tempItem;
            _this.addOrEdit = true;
            _this.$emit("notifyItemChange", _this.currentSelectItem);
            _this.$emit("notifyCurrentItemChange", _this.currentSelectItem);
        }
    },
    // 检查当前添加Charts控件属性的合法性
    checkItem(_this, item) {
        if (!item.id) {
            return false;
        }
        let charTabShow = item.reportType === 'lineReportWidget' || item.reportType === 'pieReportWidget'
            || item.reportType === 'columnReportWidget' || item.reportType === 'barReportWidget'
            || item.reportType === 'compositeReportWidget';
        if (charTabShow) {
            let tempValueArray = [];
            if (item.data.valueAxis instanceof Array) {
                item.data.valueAxis.forEach(va => {
                    tempValueArray.push(va);
                })
            }
            if (item.data.viceValueAxis instanceof Array) {
                item.data.viceValueAxis.forEach(va => {
                    tempValueArray.push(va);
                })
            }
            // 校验度量是否存在重复
            for (let i = 0; i < tempValueArray.length - 1; i++) {
                for (let j = i + 1; j < tempValueArray.length; j++) {
                    if (tempValueArray[i].table + tempValueArray[i].column + tempValueArray[i].aggregate === tempValueArray[j].table + tempValueArray[j].column + tempValueArray[j].aggregate) {
                        // _this.$message.error("度量存在重复项");
                        return false;
                    }
                }
            }
            let classFlag = !(item.data.classAxis) || item.data.classAxis.length <= 0;
            let colorFlag = !(item.data.colorAxis) || item.data.colorAxis.length <= 0;
            if (classFlag && colorFlag) {
                //_this.$message.error("类别轴/维度区域缺少维度项");
                return false;
            }
            let valueFlag = item.data.valueAxis instanceof Array && item.data.valueAxis.length === 0;
            let viceValueAxisFlag = item.data.viceValueAxis instanceof Array && item.data.viceValueAxis.length === 0;
            if (item.reportType === "compositeReportWidget") {
                if (valueFlag && viceValueAxisFlag) {
                    //_this.$message.error("缺少度量项");
                    return false;
                }
            } else {
                if (valueFlag || viceValueAxisFlag) {
                    //_this.$message.error("缺少度量项");
                    return false;
                }
            }
        }
        return true;
    },
    /**
     * 根据当前屏幕分辨率,重新计算x,y,sizex,sizey
     * @param obj 控件对象
     * @param maxCell 当前屏幕宽度最大可添加的控件数
     * @param sizeX
     * @param sizeY
     * @param outerOrInner 区分是Tab内添加的控件还是Tab外,true:Tab外;false:Tab内
     */
    recalItemPosition(obj, maxCell) {
        let designMaxCell = obj.designMaxCell;
        if (maxCell === designMaxCell) {
            return false;
        }
        obj.sizex = Math.floor(obj.sizex * (maxCell / designMaxCell));
        //obj.sizey = Math.floor(obj.sizey * (maxCell / designMaxCell));  高度不变
        obj.x = Math.floor(obj.x * (maxCell / designMaxCell));
        obj.y = Math.floor(obj.y * (maxCell / designMaxCell));
        obj.designMaxCell = maxCell;
    },
    /**
     * initGridBase
     * 预览屏幕适配，使得当前布局能在所有分辨率下适用
     * @param _this
     */
    initGridBase(_this,version) {
        if( version && _this.$el){
            let screenWidth = _this.$refs.cyGridster.clientWidth || _this.$refs.cyGridster.$el.clientWidth;
            _this.baseWidth = 5 * (screenWidth / 1366);
            _this.baseHeight = 14.5;
            _this.baseMarginLeft = 5 * (screenWidth / 1366);
            if (_this.reportSet && _this.reportSet.layout && _this.reportSet.layout.style && _this.reportSet.layout.style.verticalSpacing) {
                _this.baseMarginTop = _this.reportSet.layout.style.verticalSpacing 
            } else {
                _this.baseMarginTop = 5 
            }
          }else{
            let screenWidth = window.innerWidth;
            let screenHeight = window.innerHeight;
            let outWidth = window.screen.width ? window.screen.width : 1440;
            let outHeight = window.screen.height ? window.screen.height : 900;
            _this.baseWidth = 5 * (screenWidth / outWidth) * (outWidth / 1366);
            _this.baseHeight = 5 * (screenHeight / outHeight);
            _this.baseMarginLeft = 10 * (screenWidth / outWidth);
            if (_this.reportSet && _this.reportSet.layout && _this.reportSet.layout.style && _this.reportSet.layout.style.verticalSpacing){
                _this.baseMarginTop = _this.reportSet.layout.style.verticalSpacing * (screenHeight / outHeight);
            }else{
                _this.baseMarginTop = 5 * (screenHeight / outHeight);
            }
          }
    },
    /**
     * initGridBaseTab
     * 预览屏幕适配，使得当前布局能在所有分辨率下适用
     * @param _this
     */
    initGridBaseTab(_this,version) {
        if( version && _this.$el){
            let screenWidth = _this.$refs.cyGridster.clientWidth || _this.$refs.cyGridster.$el.clientWidth;
            _this.baseWidth = 5 * (screenWidth / 1366);
            _this.baseHeight = 14.5;
            _this.baseMarginLeft = 5 * (screenWidth / 1366);
            _this.baseMarginTop = 5
        }else{
            let screenWidth = window.innerWidth;
            let screenHeight = window.innerHeight;
            let outWidth = window.screen.width ? window.screen.width : 1440;
            let outHeight = window.screen.height ? window.screen.height : 900;
            _this.baseWidth = 5 * (screenWidth / outWidth) * (outWidth / 1366);
            _this.baseHeight = 5 * (screenHeight / outHeight);
            _this.baseMarginLeft = screenWidth / outWidth;
            _this.baseMarginTop = 5 * (screenHeight / outHeight);
        }

    },
    /**
     * initGridBaseDesign
     * 报表设计屏幕适配，使得当前布局能在所有分辨率下适用
     * @param _this
     */
    initGridBaseDesign(_this) {
        if(_this.$el){
            let screenWidth = _this.$refs.cyGridster.clientWidth ||  _this.$refs.cyGridster.$el.clientWidth;
            _this.baseWidth = 5 * (screenWidth / 1366);
            _this.baseHeight = 14.5;
            _this.baseMarginLeft = 5 * (screenWidth / 1366);
            if (_this.baseSet.verticalSpacing) {
                _this.baseMarginTop = _this.baseSet.verticalSpacing 
            } else {
                _this.baseMarginTop = 5 
            }
        }
},
    /**
     * 根据当前屏幕分辨率,重新计算x,y
     * @param myList
     * @param _this
     * @param maxCell
     * @param sizeX
     * @returns {null|{gridX: *, gridY: *}}
     */
    calItemPosition(myList, _this, maxCell, sizeX) {
        if (!(myList instanceof Array) || myList.length <= 0) {
            return null;
        }
        let gridY = 1;
        let gridX = 1;
        let flag = false;    // 判断当前容器的一行是否已经是满列状态,true:满列;
        let halfXWidget = _this.widgetType === 'imgWidget' || _this.widgetType === 'lineReportWidget' ||
            _this.widgetType === 'compositeReportWidget' || _this.widgetType === 'barReportWidget'
            || _this.widgetType === 'columnReportWidget'
            || _this.widgetType === 'pieReportWidget' || _this.widgetType === 'kanbanWidget';
        let lastCell = null;
        for (let i = myList.length - 1; i >= 0; i--) {
            let tempCell = myList[i];
            if (tempCell.y) {
                lastCell = tempCell;
                break;
            }
        }
        if (lastCell) {
            let lastCellY = lastCell.y;
            myList.forEach((obj) => {
                if (obj.id !== lastCell.id && obj.y === lastCellY) {
                    flag = true;
                }
                obj.showMoreOptVisible = false;
            });
            if (flag) {
                gridY = lastCellY + maxCell;    // 满列状态,直接换行   // 1 => 2  2 => 4 4 => 8
            } else {
                if (lastCell.x <= 1 && lastCell.sizex <= sizeX && halfXWidget) {
                    gridX = lastCell.sizex + 1;
                    gridY = lastCellY;
                } else {
                    gridY = lastCellY + maxCell;
                }
            }
        }
        return {
            "gridX": gridX,
            "gridY": gridY
        };
    },
    /**
     * 初始化控件
     * @param _this
     * @param gridster
     * @param gridX
     * @param gridY
     * @param sizeX
     * @param sizeY
     * @param outerOrInner
     */
    addWidget(_this, gridster, gridX, gridY, sizeX, sizeY, outerOrInner) {
        let widgetInitMaxHeight = sizeY * (outerOrInner ? 8 : 4);
        let widgetInitMaxWidth = sizeX * 2;
        switch (_this.widgetType) {
            case "queryWidget":
                this.addQuery(_this, gridster, gridX, gridY, widgetInitMaxWidth, sizeY * 2);
                break;
            case "textWidget":
                this.addTextWidget(_this, gridster, gridX, gridY, widgetInitMaxWidth, widgetInitMaxHeight);
                break;
            case "innerPageWidget":
                this.addInnerPageWidget(_this, gridster, gridX, gridY, widgetInitMaxWidth, widgetInitMaxHeight);
                break;
            case "tableReportWidget":
                this.addTableWidget(_this, gridster, gridX, gridY, widgetInitMaxWidth, widgetInitMaxHeight);
                break;
            case "tabPageWidget":
                this.addTabPageWidget(_this, gridster, gridX, gridY, widgetInitMaxWidth, widgetInitMaxHeight);
                break;
            case "imgWidget":
                this.addImageWidget(_this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                break;
            case "lineReportWidget":
                this.addChart("line", "线图", _this.widgetType, _this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                break;
            case "compositeReportWidget":
                this.addCompositeChart(_this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                break;
            case "barReportWidget":
                this.addChart("bar", "条形图", _this.widgetType, _this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                break;
            case "columnReportWidget":
                this.addChart("column", "柱状图", _this.widgetType, _this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                break;
            case "pieReportWidget":
                this.addPieChart(_this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                break;
            case "kanbanWidget":
                this.addKanban(_this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                break;
            default:
                console.log("待添加的控件类型有误:" + _this.widgetType);
                _this.$message.warning("敬请期待");
        }
    },
    addThemeStyle(item,_this){
      let type = item.type;
      if (type === "reportWidget") {
        type = item.reportType;
      }
      let themeStyle = this.findWidgetStyle(type, _this.themeMeta  ? _this.themeMeta.widgetsStyle : {});
      if(themeStyle && !_this.KHUtils.isNull(themeStyle)){
        item.paddingTop = themeStyle.paddingTop;
        item.paddingRight = themeStyle.paddingRight;
        item.paddingBottom = themeStyle.paddingBottom;
        item.paddingLeft = themeStyle.paddingLeft;
        item.borderColor = themeStyle.borderColor;
        item.backgroundColor = themeStyle.backgroundColor;
        item.style = themeStyle.style
      }
    },
    findWidgetStyle(type, widgetsStyle){
      let style = null;
      if (widgetsStyle instanceof Array && widgetsStyle.length > 0) {
        widgetsStyle.forEach((item, index) => {
          if (item.widgetType === type) {
            style = item;
            return style;
          }
        })
      }
      return style;
    },
    getWidgetInitStyle(type,_this){
        let style = null;
        switch (type) {
            case "queryWidget":
                style =  _this.KHUtils.clone(_this.WidgetStyleConstants.queryWidgetStyle);
                break;
            case "textWidget":
                style =  _this.KHUtils.clone(_this.WidgetStyleConstants.textWidgetStyle);
                break;
            case "innerPageWidget":
                style =  _this.KHUtils.clone(_this.WidgetStyleConstants.innerPageWidgetStyle);
                break;
            case "tableReportWidget":
                style =  _this.KHUtils.clone(_this.WidgetStyleConstants.reportTableWidgetStyle);
                break;
            case "tabPageWidget":
                style =  _this.KHUtils.clone(_this.WidgetStyleConstants.tabPageWidgetStyle);
                break;
            case "imgWidget":
                style =  _this.KHUtils.clone(_this.WidgetStyleConstants.imgWidgetStyle);
                break;
            case "lineReportWidget":
               // this.addChart("line", "线图", _this.widgetType, _this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                //style =  _this.KHUtils.clone(_this.WidgetStyleConstants.imgWidgetStyle);
                break;
            case "compositeReportWidget":
                //this.addCompositeChart(_this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                //style =  _this.KHUtils.clone(_this.WidgetStyleConstants.imgWidgetStyle);
                break;
            case "barReportWidget":
                //this.addChart("bar", "条形图", _this.widgetType, _this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                //style =  _this.KHUtils.clone(_this.WidgetStyleConstants.imgWidgetStyle);
                break;
            case "columnReportWidget":
                //this.addChart("column", "柱状图", _this.widgetType, _this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
               // style =  _this.KHUtils.clone(_this.WidgetStyleConstants.imgWidgetStyle);
                break;
            case "pieReportWidget":
                //this.addPieChart(_this, gridster, gridX, gridY, sizeX, widgetInitMaxHeight);
                //style =  _this.KHUtils.clone(_this.WidgetStyleConstants.imgWidgetStyle);
                break;
            case "kanbanWidget":
                style =  _this.KHUtils.clone(_this.WidgetStyleConstants.kanbanWidgetStyle);
                break;

            default:

        }
        return style;
    }
};

export default {
    instance: WidgetHelper,
    //注册插件
    install(Vue) {
        if (Vue.prototype.WidgetHelper) return;
        Vue.prototype.WidgetHelper = WidgetHelper;
    }
}
