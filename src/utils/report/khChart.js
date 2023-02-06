import Highcharts from "highcharts/highstock";

var KHChart = {
    // 全局颜色设置
    settingGolbalColor(_this, item) {
        let colors = [];
        for (let i = 1; i < 11; i++) {
            let column = "seriesColor" + i;
            if (!_this.KHUtils.isNull(item.style[column])) {
                colors.push(item.style[column]);
            }
        }
        if (colors.length > 0) {
            Highcharts.setOptions({
                colors: colors
            });
        } else {
            Highcharts.setOptions({
                colors: ['#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
                    '#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1']
            });
        }
    },
    // 渲染报表公共部分,如title,subtitle等
    renderChartPublicAttribute(item, _this) {
        let backgroundColor = item.style.backgroundColor;
        let dataLabelsEnable = item.style.dataLabelsEnable;    // 动态设置是否显示数据标签
        let toBeUpdatedAttr = {
            chart: {backgroundColor: !_this.KHUtils.isNull(backgroundColor) ? backgroundColor : null}, // 图表背景颜色设置
            title: {
                text: " "
            },// 主标题设置
            subtitle: {
                text: item.style.subtitleVisiable ? "<a href='" + item.style.subtitleUrl + "' target='_blank'>" + item.style.subtitleText + "</a>" : "",
                style: {
                    color: item.style.subtitle.style.color,
                },
                align: "right"
            }, // 副标题设置
            tooltip: {
                shared: true
            },
            plotOptions: {},
            legend: {
                itemStyle: {
                    color: item.style.legendFontColor,
                    fontSize: item.style.legendFontSize ? item.style.legendFontSize : '12px'
                },
                enabled: item.style.legendAlign !== 'none',
                borderWidth: 0,
                floating: true,
            },// 图例设置
            credits: {
                enabled: false // 禁用版权信息
            }
        };
        if (item.reportType !== "pieReportWidget") {
            toBeUpdatedAttr.plotOptions.series = {
                dataLabels: {
                    enabled: dataLabelsEnable,     // 开启数据标签
                    style: {
                        "color": item.style.dataLabelsFontColor ? item.style.dataLabelsFontColor : 'contrast',
                        "fontSize": item.style.dataLabelsFontSize ? item.style.dataLabelsFontSize : '12px',
                        "textOutline": null // 去除文字的阴影
                    }
                },
                borderWidth: 0, // 去除柱状图边框;
            };
        } else {
            toBeUpdatedAttr.chart.type = "pie";
            let decimalSize = 2; // 定义百分比小数点位数
            let tooltip = {
                pointFormat: '{series.name}: <b>{point.percentage:.' + decimalSize + 'f} %</b>'
            }
            toBeUpdatedAttr.tooltip = tooltip;
            let defaultFormat = '';
            let dataLabelsEnable = item.style.dataLabels instanceof Array && item.style.dataLabels.length > 0;    // 动态设置是否显示数据标签
            if (dataLabelsEnable) {
                let dataLabels = item.style.dataLabels; // 需要显示的标签
                if (dataLabels instanceof Array) {
                    // 按维度、度量、百分比的顺序拼接显示label
                    dataLabels.forEach(dl => {
                        if (dl === '维度') {
                            defaultFormat += '<b>{point.name}</b>';
                        }
                    })
                    dataLabels.forEach(dl => {
                        if (dl === '度量') {
                            defaultFormat += ' {point.y}';
                        }
                    })
                    dataLabels.forEach(dl => {
                        if (dl === '百分比') {
                            defaultFormat += ' ({point.percentage:.' + decimalSize + 'f} %)';
                        }
                    })
                }
            }
            toBeUpdatedAttr.plotOptions.pie = {
                allowPointSelect: true,
                cursor: 'pointer',
                dataLabels: {
                    enabled: dataLabelsEnable,
                    format: defaultFormat,
                    style: {
                        color: item.style.labelColor,
                        "fontSize": item.style.labelSize ? item.style.labelSize : '12px',
                        "textOutline": null, // 去除文字的阴影
                    },
                },
                showInLegend: item.style.legendAlign !== 'none'
            };
            toBeUpdatedAttr.series = [{
                name: 'Brands',
                colorByPoint: true,
                type: 'pie',
                data: [{
                    name: '',
                    y: 61.41,
                    sliced: true,
                    selected: true
                }],
            }];
        }
        let legendAlign = _this.KHUtils.isNull(item.style.legendAlign) ? "top" : item.style.legendAlign; // 动态设置图例的显示位置
        let marginTop = null, marginBottom = null, marginRight = null, marginLeft = null, align = null,
            layout = null,
            maxHeight = null;
        // 图表图例的设置
        if (!_this.KHUtils.isNull(legendAlign)) {
            switch (legendAlign) {
                case "bottom":
                    marginBottom = 65;
                    align = 'center';
                    layout = 'horizontal';
                    toBeUpdatedAttr.legend.verticalAlign = legendAlign;
                    toBeUpdatedAttr.legend.y = 25;
                    maxHeight = 56;
                    break;
                case "top":
                    if (item.reportType !== 'pieReportWidget') {
                        marginTop = 40
                    } else {
                        marginTop = 20;
                        toBeUpdatedAttr.legend.y = -18;
                    }
                    align = 'center';
                    layout = 'horizontal';
                    toBeUpdatedAttr.legend.verticalAlign = legendAlign;
                    toBeUpdatedAttr.legend.x = 10;
                    maxHeight = 56;
                    break;
                case "left":
                    let tempX = -20;
                    if (item.reportType === 'pieReportWidget') {
                        tempX = 0;
                    }
                    marginLeft = 130;
                    align = legendAlign;
                    layout = 'vertical';
                    toBeUpdatedAttr.legend.verticalAlign = 'top';
                    toBeUpdatedAttr.legend.x = tempX;
                    maxHeight = null;
                    break;
                case "right":
                    marginRight = 130;
                    align = legendAlign;
                    layout = 'vertical';
                    maxHeight = null;
                    break;
                default:
            }
        }
        toBeUpdatedAttr.chart.marginTop = marginTop;
        toBeUpdatedAttr.chart.marginBottom = marginBottom;
        toBeUpdatedAttr.chart.marginRight = marginRight;
        toBeUpdatedAttr.chart.marginLeft = marginLeft;
        toBeUpdatedAttr.legend.align = align;
        toBeUpdatedAttr.legend.layout = layout;
        toBeUpdatedAttr.legend.maxHeight = maxHeight;
        if (item.reportType === 'lineReportWidget') {
            let smallType = _this.KHUtils.isNull(item.data.smallType) ? "line" : item.data.smallType;// 动态设置线条样式
            if ("areasplinerange" === smallType) {
                // 百分比堆积柱状图
                toBeUpdatedAttr.plotOptions.area = {
                    stacking: 'percent'
                }
            }
        }
        // 柱状图/条形图的特殊处理
        if (item.reportType === 'columnReportWidget') {
            let columnStyle = item.style.columnStyle;
            if ("accumulation" === columnStyle) {
                // 堆积柱状图
                toBeUpdatedAttr.plotOptions.column = {
                    stacking: 'normal'
                }
            } else if ("percentage" === columnStyle) {
                toBeUpdatedAttr.plotOptions.column = {
                    stacking: 'percent'
                }
            }
        }
        if (item.reportType === 'barReportWidget') {
            let columnStyle = item.style.columnStyle;
            if ("accumulation" === columnStyle) {
                toBeUpdatedAttr.plotOptions.series.stacking = 'normal';    // 堆积条形图
            } else if ("percentage" === columnStyle) {
                toBeUpdatedAttr.plotOptions.series.stacking = 'percent';        // 百分比堆积条形图
            }
        }
        return toBeUpdatedAttr;
    },
    // 渲染报表X轴
    renderChartXAxis(item, _this) {
        let xAxisTitle = _this.KHUtils.isNull(item.style.xAxisTitle.text) ? "" : item.style.xAxisTitle.text; // x轴标题
        let xAxisUnit = _this.KHUtils.isNull(item.style.xAxisTitleUnit) ? "" : item.style.xAxisTitleUnit; // x轴单位
        let xAxisVisiable = item.style.xAxisVisiable; // x轴显示隐藏
        let xAxisTickVisiable = item.style.xAxisTickVisiable; // 是否显示刻度
        let gridLineVisiable = item.style.gridLineVisiable; // x轴是否显示网格线
        let xLabelColor = item.style.xLabelColor; // x轴及字体颜色
        let toBeUpdatedAttr = {
            title: {
                text: item.style.xAxisTitleVisiable ? (!_this.KHUtils.isNull(xAxisUnit) ? xAxisTitle + '(' + xAxisUnit + ')' : xAxisTitle) : "",
                align: 'middle',
                style: {
                    fontSize: item.style.xAxisTitleFontSize ? item.style.xAxisTitleFontSize : '12px',
                    color: item.style.xAxisTitleColor
                },
            },
            visible: true,
            lineColor: xLabelColor ? xLabelColor : '#E2E2E2',
            lineWidth: xAxisVisiable ? 1 : 0,  // 通过控制x轴线图的粗细来显示隐藏,轴线宽度、颜色
            gridLineColor: item.style.gridLineColor,  // 网格线颜色
            gridLineWidth: gridLineVisiable ? 1 : 0,  // 网格线宽度
            gridLineDashStyle: _this.KHUtils.isNull(item.style.gridLineDashStyle) ? 'Dot' : item.style.gridLineDashStyle,   // 网格线样式
            tickWidth: xAxisTickVisiable ? 1 : 0, // 刻度线
            labels: {
                style: {
                    color: item.style.xLabelColor,
                }
            }
        };
        return toBeUpdatedAttr;
    },
    // 渲染报表垂直左轴
    renderChartLeftYAxis(item, _this) {
        let leftYAxisTitle = _this.KHUtils.isNull(item.style.leftYAxisTitle.text) ? "" : item.style.leftYAxisTitle.text; // y轴标题
        let leftYTitleUnit = _this.KHUtils.isNull(item.style.leftYTitleUnit) ? "" : item.style.leftYTitleUnit;  // y轴单位
        let leftYAxisMax = _this.KHUtils.isNull(item.style.leftYAxisMax) ? "" : item.style.leftYAxisMax;// y轴最大值
        let leftYAxisMin = _this.KHUtils.isNull(item.style.leftYAxisMin) ? "" : item.style.leftYAxisMin;// y轴最小值
        let leftYAxisMaxAuto = item.style.leftYAxisMaxAuto; // 自动计算最大值开启
        let leftYAxisMinAuto = item.style.leftYAxisMinAuto; // 自动计算最小值开启
        let leftYVisiable = item.style.leftYVisiable; // 垂直左轴显示隐藏
        let leftYTitleVisiable = item.style.leftYTitleVisiable; // 是否显示标题和单位
        let leftYTickVisiable = item.style.leftYTickVisiable; // 垂直左轴是否显示刻度线
        let leftYGridLineVisiable = item.style.leftYGridLineVisiable; // 垂直左轴是否显示网格线
        let leftYLabelColor = item.style.leftYLabelColor;
        let toBeUpdatedAttr = {
            title: {
                text: leftYTitleVisiable ? (!_this.KHUtils.isNull(leftYTitleUnit) ? leftYAxisTitle + '(' + leftYTitleUnit + ')' : leftYAxisTitle) : "",
                style: {
                    fontSize: item.style.leftYAxisTitleFontSize ? item.style.leftYAxisTitleFontSize : '12px',
                    color: item.style.leftYAxisTitleColor
                }
            },
            visible: leftYVisiable, // 轴线显示隐藏
            lineColor: leftYLabelColor ? leftYLabelColor : '#E2E2E2', // 轴线颜色
            lineWidth: 1,  // 轴线宽度
            tickWidth: leftYTickVisiable ? 1 : 0,
            gridLineColor: item.style.leftYGridLineColor,  // 网格线颜色
            gridLineWidth: leftYGridLineVisiable ? item.style.leftYGridLineWidth : 0,  // 网格线宽度
            gridLineDashStyle: _this.KHUtils.isNull(item.style.leftYGridLineDashStyle) ? 'Dot' : item.style.leftYGridLineDashStyle,   // 网格线样式
            labels: {
                style: {
                    color: leftYLabelColor,
                }
            },
            max: !leftYAxisMaxAuto && !_this.KHUtils.isNull(leftYAxisMax) ? leftYAxisMax : null,
            min: !leftYAxisMinAuto && !_this.KHUtils.isNull(leftYAxisMin) ? leftYAxisMin : null,
            //startOnTick: !(!leftYAxisMaxAuto && !_this.KHUtils.isNull(leftYAxisMax)) || !(!leftYAxisMinAuto && !_this.KHUtils.isNull(leftYAxisMin)) // 不强制按最大值/最小值
        };
        return toBeUpdatedAttr;
    },
    // 渲染报表垂直右轴
    renderChartRightYAxis(item, _this) {
        let rightYAxisTitle = _this.KHUtils.isNull(item.style.rightYAxisTitle.text) ? "" : item.style.rightYAxisTitle.text; // y轴标题
        let rightYTitleUnit = _this.KHUtils.isNull(item.style.rightYTitleUnit) ? "" : item.style.rightYTitleUnit;  // y轴单位
        let rightYAxisMax = _this.KHUtils.isNull(item.style.rightYAxisMax) ? "" : item.style.rightYAxisMax;// y轴最大值
        let rightYAxisMin = _this.KHUtils.isNull(item.style.rightYAxisMin) ? "" : item.style.rightYAxisMin;// y轴最小值
        let rightYAxisMaxAuto = item.style.rightYAxisMaxAuto; // 自动计算最大值开启
        let rightYAxisMinAuto = item.style.rightYAxisMinAuto; // 自动计算最小值开启
        let rightYVisiable = item.style.rightYVisiable; // 垂直右轴显示隐藏
        let rightYTitleVisiable = item.style.rightYTitleVisiable; // 是否显示标题和单位
        let rightYTickVisiable = item.style.rightYTickVisiable; // 垂直右轴是否显示刻度线
        let rightYGridLineVisiable = item.style.rightYGridLineVisiable; // 垂直右轴是否显示网格线
        let rightYLabelColor = item.style.rightYLabelColor;
        let toBeUpdatedAttr = {
            title: {
                text: rightYTitleVisiable ? (!_this.KHUtils.isNull(rightYTitleUnit) ? rightYAxisTitle + '(' + rightYTitleUnit + ')' : rightYAxisTitle) : "",
                style: {
                    fontSize: item.style.rightYAxisTitleFontSize ? item.style.rightYAxisTitleFontSize : '12px',
                    color: item.style.rightYAxisTitleColor
                }
            },
            visible: rightYVisiable, // 轴线显示隐藏
            lineColor: rightYLabelColor ? rightYLabelColor : '#E2E2E2', // 轴线颜色
            lineWidth: 1,  // 轴线宽度
            tickWidth: rightYTickVisiable ? 1 : 0,
            gridLineColor: item.style.rightYGridLineColor,  // 网格线颜色
            gridLineWidth: rightYGridLineVisiable ? item.style.rightYGridLineWidth : 0,  // 网格线宽度
            gridLineDashStyle: _this.KHUtils.isNull(item.style.rightYGridLineDashStyle) ? 'Dot' : item.style.rightYGridLineDashStyle,   // 网格线样式
            labels: {
                style: {
                    color: rightYLabelColor,
                }
            },
            max: !rightYAxisMaxAuto && !_this.KHUtils.isNull(rightYAxisMax) ? rightYAxisMax : null,
            min: !rightYAxisMinAuto && !_this.KHUtils.isNull(rightYAxisMin) ? rightYAxisMin : null,
            //startOnTick: !(!leftYAxisMaxAuto && !_this.KHUtils.isNull(leftYAxisMax)) || !(!leftYAxisMinAuto && !_this.KHUtils.isNull(leftYAxisMin)) // 不强制按最大值/最小值
        };
        return toBeUpdatedAttr;
    },
    /**
     * 水平轴图例数组的处理
     * @param item 当前图表属性配置
     * @param res 后台返回数据对象
     * @param _this DragPower对象
     * @returns {[]}
     */
    processChartCategory(item, res, _this, drillCol, currentDrillCol) {
        let category = [];
        let array = []
        let current_this = this; // 当前js对象
        // 维度仅设置了颜色维度,此时不分组
        let colorSetNoOtherClassValueSet = (!(item.data.classAxis instanceof Array) || item.data.classAxis.length <= 0);
        array = colorSetNoOtherClassValueSet ? item.data.colorAxis : item.data.classAxis;
        if (!(array instanceof Array) || array.length === 0) {
            return category;
        }
        // 类别轴/维度 即x轴处理
        res.datas.forEach((data, index) => {
            let temp = "";
            array.forEach((va, vaIndex) => {
                let tempValue = "";
                if (!_this.KHUtils.isNull(drillCol)) {
                    if (_this.KHChart.splicingColumnSetNoIdWithTableName(drillCol, _this)
                        === _this.KHChart.splicingColumnSetNoIdWithTableName(va, _this)) {
                        tempValue = data[current_this.splicingColumnSet(currentDrillCol, _this)];
                    } else {
                        tempValue = data[current_this.splicingColumnSet(va, _this)];
                    }
                } else {
                    tempValue = data[current_this.splicingColumnSet(va, _this)];
                }
                temp += tempValue + "_";
            });
            if (temp.length > 0) {
                temp = temp.substr(0, temp.length - 1);
            }
            const existIndex = category.findIndex(compare => compare === temp);
            if (existIndex === -1) {
                category.push(temp);
            }
        })
        //console.log("category :" + JSON.stringify(category));
        return category;
    },
    /**
     * 按颜色图例/维度统计处理SeriesData
     * @param item 当前图表属性配置
     * @param res 后台返回数据对象
     * @param chart 当前图表对应的chart对象
     * @param _this DragPower对象
     * @param category 图例集合
     * #######################钻取相关参数########################
     * @param startDrillingFlag 是否开启钻取,true:开启;false:未开启
     * @param e 钻取事件触发对象
     * @param drillCol 主钻取列
     * @param currentDrillCol 当前钻取列
     * @param drillingConditions  钻取查询条件
     * @returns {boolean}
     */
    addSeriesData(item, res, _this, category, startDrillingFlag, drillCol, currentDrillCol) {
        let colorDrill = false;        // 标识是否是颜色图例/维度设置的钻取
        if (!_this.KHUtils.isNull(drillCol)) {
            if (item.data.colorAxis && item.data.colorAxis.length === 1) {
                let tempColor = item.data.colorAxis[0];
                if (this.splicingColumnSetNoIdWithTableName(tempColor, _this) === this.splicingColumnSetNoIdWithTableName(drillCol, _this)) {
                    colorDrill = true;
                }
            }
        }
        item.seriesData = [];// 初始化seriesData
        let current_this = this; // 当前js对象
        let newArray = [];// 按颜色维度分组处理
        let viceSeriesData = []; // 无设置颜色图例副轴数据列集合
        let valueSeriesData = [];// 无设置颜色图例主轴数据列集合
        let colorSetNoOtherClassValueSet = (!(item.data.classAxis instanceof Array) || item.data.classAxis.length <= 0);  // 维度仅设置了颜色维度,此时不分组
        if ((!(item.data.colorAxis instanceof Array) || item.data.colorAxis.length < 1) || colorSetNoOtherClassValueSet) {
            if (item.data.valueAxis instanceof Array && item.data.valueAxis.length > 0) {
                let T = processNoSetColorLegend(item.data.valueAxis, true, current_this);
                if (T instanceof Array) {
                    let flag = item.style.valueStyle instanceof Array && item.style.valueStyle.length > 0;
                    T.forEach((tr, index) => {
                        if (flag && item.style.valueStyle[index] && !_this.KHUtils.isNull(item.style.valueStyle[index].lineColor)) {
                            tr.color = item.style.valueStyle[index].lineColor;
                        }
                        item.seriesData.push(tr);
                    })
                }
            }
            if (item.data.viceValueAxis instanceof Array && item.data.viceValueAxis.length > 0) {
                let T = processNoSetColorLegend(item.data.viceValueAxis, false, current_this);
                if (T instanceof Array) {
                    let flag = item.style.viceValueStyle instanceof Array && item.style.viceValueStyle.length > 0;
                    T.forEach((tr, index) => {
                        if (flag && item.style.viceValueStyle[index] && !_this.KHUtils.isNull(item.style.viceValueStyle[index].lineColor)) {
                            tr.color = item.style.viceValueStyle[index].lineColor;
                        }
                        item.seriesData.push(tr);
                    })
                }
            }
        } else {
            let tempColor = colorDrill ? currentDrillCol : item.data.colorAxis[0];
            let colorColumn = current_this.splicingColumnSet(tempColor, _this); //颜色图例/维度设置列
            let colorAxisObj = item.data.colorAxis[0];
            for (let i = 0, n = res.datas.length; i < n; i++) {
                let state = false;
                let compareObj = res.datas[i];
                if (newArray.length > 0) {
                    for (let j = 0, m = newArray.length; j < m; j++) {
                        let obj = newArray[j];
                        if (obj[colorColumn] === compareObj[colorColumn]) {
                            state = true;
                        }
                    }
                }
                if (!state) {
                    newArray.push(compareObj);
                }
            }
            if (newArray.length <= 0) {
                return false;
            }
            let valueColumn = "";  // 主轴度量设置列
            let viceValueColumn = ""; // 副轴处理
            if (item.data.valueAxis instanceof Array && item.data.valueAxis.length === 1) {
                valueColumn = current_this.splicingColumnSet(item.data.valueAxis[0], _this);// 主轴度量设置列
            }
            if (item.data.viceValueAxis instanceof Array && item.data.viceValueAxis.length === 1) {
                viceValueColumn = current_this.splicingColumnSet(item.data.viceValueAxis[0], _this); // 副轴度量设置列
            }
            if (!_this.KHUtils.isNull(valueColumn)) {
                let T = processSetColorLegend(colorColumn, valueColumn, true, current_this);
                if (T instanceof Array) {
                    T.forEach(tr => {
                        item.seriesData.push(tr);
                    })
                }
            }
            if (!_this.KHUtils.isNull(viceValueColumn)) {
                let T = processSetColorLegend(colorColumn, viceValueColumn, false, current_this);
                if (T instanceof Array) {
                    T.forEach(tr => {
                        item.seriesData.push(tr);
                    })
                }
            }
        }
        //console.log("item.seriesData :" + JSON.stringify(item.seriesData));
        
        /**
         * 处理没有设置颜色图例的数据列
         * @param array: 主轴/副轴属性配置
         * @param valueOrViceValue: 区分主轴/副轴,true:主轴;false:副轴
         */
        function processNoSetColorLegend(array, valueOrViceValue, current_this) {
            let retArry = [];
            array.forEach((va, vaIndex) => {
                let tempObj = {
                    name: _this.KHUtils.isNull(va.alias) ? va.column : va.alias,
                    data: [],
                };
                if (item.reportType === 'compositeReportWidget') {
                    if (!_this.KHUtils.isNull(va.charttype)) {
                        tempObj.type = va.charttype;
                    }
                    if (!valueOrViceValue && item.data.valueAxis instanceof Array && item.data.valueAxis.length > 0) {
                        tempObj.yAxis = 1;   // 设置副轴
                    }
                    if (!_this.KHUtils.isNull(va.columnStyle) && va.columnStyle != 'none') {
                        if (va.columnStyle === 'accumulation') {
                            tempObj.stacking = 'normal';
                        } else {
                            tempObj.stacking = 'percent';
                        }
                    }
                }
                let tempColumn = current_this.splicingColumnSet(va, _this);
                let tempArray = [];
                category.forEach((c, i) => {
                    res.datas.forEach((data, index) => {
                        let tempClassValue = current_this.splicingDimSet(item, _this, drillCol, currentDrillCol, data, colorSetNoOtherClassValueSet ? item.data.colorAxis : item.data.classAxis);
                        if (c === tempClassValue) {
                            let tempValue = _this.KHChart.formatNumber(va, data[tempColumn]);
                            if (startDrillingFlag) {
                                let drillObj = {};
                                if (item.data.drillingAxis instanceof Array) {
                                    if (_this.KHUtils.isNull(currentDrillCol)) {
                                        drillObj = _this.KHUtils.clone(item.data.drillingAxis[0].drillCol[0]);
                                    } else {
                                        drillObj = _this.KHUtils.clone(currentDrillCol);
                                    }
                                }
                                //drillObj.colorByPoint = true;
                                drillObj.name = tempClassValue;
                                drillObj.drilldown = true;
                                drillObj.y = tempValue;
                                tempObj.data.push(drillObj);
                            } else {
                                // 非向下钻取处理
                                if (!_this.KHUtils.isNull(tempValue)) {
                                    tempObj.data.push(tempValue);
                                } else {
                                    tempObj.data.push(null);
                                }
                            }
                        }
                    });
                })  // 根据图例数量补位
                retArry.push(tempObj);
                tempArray = [];
            })
            return retArry;
        }
        
        /**
         * 处理设置颜色图例的数据列
         * @param colorColumn: 颜色设置列
         * @param valueColumn: 主轴/副轴设置列
         * @param valueOrViceValue: 区分主轴/副轴,true:主轴;false:副轴
         */
        function processSetColorLegend(colorColumn, valueColumn, valueOrViceValue, current_this) {
            let retArry = [];
            let compositeReportWidget = item.reportType === 'compositeReportWidget';
            let valueAndViceSet = (item.data.valueAxis instanceof Array && item.data.valueAxis.length === 1)
                && (item.data.viceValueAxis instanceof Array && item.data.viceValueAxis.length === 1);    // 标识同时设置主副轴
            let va = null;
            if (valueOrViceValue) {
                va = item.data.valueAxis[0];
            } else {
                va = item.data.viceValueAxis[0];
            }
            newArray.forEach((arr, arrIndex) => {
                let dataList = [];
                let newObj = {};
                res.datas.forEach(data => {
                    if (data[colorColumn] === arr[colorColumn]) {
                        let tempObj = {};
                        if (item.data.drillingAxis instanceof Array) {
                            if (_this.KHUtils.isNull(currentDrillCol)) {
                                tempObj = _this.KHUtils.clone(item.data.drillingAxis[0].drillCol[0]);
                            } else {
                                tempObj = _this.KHUtils.clone(currentDrillCol);
                            }
                        }
                        let tempClassValue = current_this.splicingDimSet(item, _this, drillCol, currentDrillCol, data, colorSetNoOtherClassValueSet ? item.data.colorAxis : item.data.classAxis);
                        let tempValue = _this.KHChart.formatNumber(va, data[valueColumn]);
                        if (startDrillingFlag) {
                            tempObj.name = _this.KHUtils.isNull(tempClassValue) ? _this.Constants.chartReplaceNullOrDefined : tempClassValue;
                            tempObj.y = tempValue;
                            tempObj.drilldown = true;
                            dataList.push(tempObj);
                        } else {
                            dataList.push({"name": tempClassValue, "val": tempValue});
                        }
                    }
                });
                let tempName = _this.KHUtils.isNull(arr[colorColumn]) ? _this.Constants.chartReplaceNullOrDefined : arr[colorColumn];
                if (startDrillingFlag) {
                    newObj.name = valueAndViceSet ? (_this.KHUtils.isNull(va.alias) ? va.column : va.alias) + "_" + tempName : tempName;
                    //newObj.colorByPoint = true;
                    let tempDataList = [];
                    category.forEach((c, i) => {
                        let tempObj = {
                            name: c,
                            y: null,
                            drilldown: true
                        }
                        let flag = false;
                        dataList.forEach(d => {
                            if (c === d.name) {
                                flag = true;
                                tempDataList.push(d);
                            }
                        })
                        if (!flag) {
                            tempDataList.push(tempObj);
                        }
                    })  // 根据图例数量补位
                    newObj.data = tempDataList;
                } else {
                    let tempDataList = [];
                    category.forEach((c, i) => {
                        tempDataList.push(null);
                        dataList.forEach(d => {
                            if (c === d.name) {
                                tempDataList[i] = d.val;
                            }
                        })
                    })  // 根据图例数量补位
                    newObj.name = valueAndViceSet ? (_this.KHUtils.isNull(va.alias) ? va.column : va.alias) + "_" + tempName : tempName;
                    newObj.data = tempDataList;
                }
                if (compositeReportWidget) {
                    if (!_this.KHUtils.isNull(va.columnStyle) && va.columnStyle != 'none') {
                        if (va.columnStyle === 'accumulation') {
                            newObj.stacking = 'normal';
                        } else {
                            newObj.stacking = 'percent';
                        }
                    }
                    if (!valueOrViceValue && item.data.valueAxis instanceof Array && item.data.valueAxis.length === 1) {
                        newObj.yAxis = 1;
                    }
                    if (!_this.KHUtils.isNull(va.charttype)) {
                        newObj.type = va.charttype;
                    }
                }
                retArry.push(newObj);
            })
            return retArry;
        }
    },
    /**
     * 钻取触发向下钻取事件
     * @param e 钻取事件触发对象
     * @param drillingConditions 钻取查询条件
     * @param queryConditions  查询控件组装的查询条件
     * @param item 当前图表属性配置
     * @param _this DragPower对象
     */
    handleDrillDown(e, drillingConditions, queryConditions, item, _this, currentSelectItemIndex, previewOrDesgin) {
        let drillCol = _this.KHUtils.clone(item.data.drillingAxis[0].drillCol[0]);  // 主钻取维度
        if (item.drillNavigation instanceof Array && item.drillNavigation.length > 0) {
            item.drillNavigation.forEach((dv, index) => {
                if (0 < index) {
                    drillingConditions.conds.push(dv);
                }
            })
        }
        if (e.point && e.point.options) {
            let tempCond = _this.KHUtils.clone(e.point.options);
            let currentIndex = _this.KHChart.findIndexInArray(item.data.drillingAxis[0].childCols, tempCond, _this);
            drillingConditions.current = item.data.drillingAxis[0].childCols[currentIndex + 1];
            if ((currentIndex + 1) === item.data.drillingAxis[0].childCols.length) {
                _this.$message.warning("已经钻取到最后一层了");
                return false;
            }
            if (tempCond != null) {
                let cond = {
                    "condType": "single",
                    "table": tempCond.table,
                    "column": tempCond.column,
                    "alias": tempCond.alias,
                    "id": tempCond.id,
                    "dataType": tempCond.dataType,
                    "dateDim": tempCond.dateDim,
                    "matchType": "$eq",
                    "express": tempCond.express,
                };
                let colorSetNoOtherClassValueSet = (!(item.data.classAxis instanceof Array) || item.data.classAxis.length <= 0);  // 维度仅设置了颜色维度,此时不分组,当成类别轴处理
                let colorDrill = false;
                if (!_this.KHUtils.isNull(drillCol)) {
                    if (item.data.colorAxis && item.data.colorAxis.length === 1) {
                        let tempColor = item.data.colorAxis[0];
                        if (this.splicingColumnSetNoIdWithTableName(tempColor, _this) === this.splicingColumnSetNoIdWithTableName(drillCol, _this)) {
                            colorDrill = true;
                        }
                    }
                }
                if (colorDrill && !colorSetNoOtherClassValueSet) {
                    let tempSplitArray = e.point.series.name.split("_");
                    cond.value = tempSplitArray[tempSplitArray.length - 1];
                } else {
                    let classIndex = -1;
                    if (colorSetNoOtherClassValueSet) {
                        classIndex = _this.KHChart.findIndexInArray(item.data.colorAxis, drillCol, _this);
                    } else {
                        classIndex = _this.KHChart.findIndexInArray(item.data.classAxis, drillCol, _this);
                    }
                    let ePointArr = e.point.name.split("_");
                    cond.value = classIndex != -1 ? ePointArr[classIndex] : ePointArr[ePointArr.length - 1];
                }
                if (_this.KHUtils.isNull(cond.value)) {
                    _this.$message.warning("已经钻取到最后一层了");
                    return false;
                }
                let cloneCond = _this.KHUtils.clone(cond);
                if (drillingConditions.conds instanceof Array) {
                    if (drillingConditions.conds.length > 0) {
                        let index = _this.KHChart.findIndexInArray(drillingConditions.conds, cloneCond, _this);
                        if (index === 0) {
                            drillingConditions.conds.splice(index, 1)
                        }
                        drillingConditions.conds.push(cloneCond);
                    } else {
                        drillingConditions.conds.push(cloneCond);
                    }
                }
            }
        }
        let param = {
            "queryConditions": [],
            "pageNum": 1,
            "pageSize": 100
        };
        if (previewOrDesgin) {
            param.reportId = _this.reportId;
            param.widgetId = item.id;
        } else {
            param.datareport = _this.KHUtils.clone(item);
            item.desc = "";  // 报表设计时可查看SQL
        }
        param.drillingConditions = drillingConditions;
        param.pageNum = 1;
        param.pageSize = item.querySize;
        if (queryConditions instanceof Array && queryConditions.length > 0) {
            param.queryConditions = queryConditions;
        } else {
            param.queryConditions = [];
        }
        item.queryConditions = param.queryConditions; // 记录下自定义查询条件
        let current_this = this; // 当前js对象
        _this.$PostJson(previewOrDesgin ? _this.khConfig.api.queryreportdata : _this.khConfig.api.previewreportdata, param).then(res => {
            if (res.errCode === 0) {
                if (!_this.KHUtils.isNull(res.x)) {
                    //item.desc = Base64.decode(res.x);
                    item.desc = decodeURIComponent(escape(window.atob(res.x)));
                }
                if (res.datas instanceof Array) {
                    if (item.reportType === 'compositeReportWidget') {
                        _this.CompositeChart.renderDrilldownCompositeChart(item, res, currentSelectItemIndex, queryConditions, _this, null, drillCol, param.drillingConditions.current, previewOrDesgin);
                    } else if (item.reportType === 'pieReportWidget') {
                        _this.PieChart.renderDrilldownPieChart(item, res, currentSelectItemIndex, queryConditions, _this, null, null, drillCol, param.drillingConditions.current, previewOrDesgin);
                    } else {
                        _this.LineColumnChart.renderDrilldownChart(item, res, currentSelectItemIndex, queryConditions, _this, null, drillCol, param.drillingConditions.current, previewOrDesgin);
                    }
                }
            }
        }).catch((e) => {
            console.log(e)
        });
    },
    /**
     *
     * @param drillingConditions 钻取查询条件
     * @param item 当前图表属性配置
     * @param _this  DragPower对象
     */
    handleDrillNavigation(drillingConditions, item, _this) {
        let drillCol = _this.KHUtils.clone(item.data.drillingAxis[0].drillCol[0]);  // 主钻取维度列
        const navIndex = item.drillNavigation.findIndex(obj => obj.column + obj.id + obj.value === drillCol.column + drillCol.id + obj.value);
        if (navIndex === -1 || item.drillNavigation.length === 0) {
            drillCol.value = this.splicingDrillTitleText(drillCol, _this);
            drillCol.total = item.total;
            item.drillNavigation.push(drillCol);
        }
        drillingConditions.conds.forEach(c => {
            const navIndex = item.drillNavigation.findIndex(obj => obj.column + obj.id + obj.value === c.column + c.id + c.value);
            if (navIndex === -1) {
                c.total = item.total;
                item.drillNavigation.push(c);
            }
        })
    },
    /**
     * 拼接维度设置列的对应的值
     * @param item 当前图表属性配置
     * @param _this  DragPower对象
     * @param drillCol 主钻取列
     * @param currentDrillCol 当前钻取列
     * @param data 查询返回的基础数据对象
     * @param array
     * @returns {string}
     */
    splicingDimSet(item, _this, drillCol, currentDrillCol, data, array) {
        let tempClassValue = "";
        let tempArray = [];
        array.forEach((va, vaIndex) => {
            let tempVa = _this.KHUtils.clone(va);
            if (!_this.KHUtils.isNull(drillCol)) {
                if (_this.KHChart.splicingColumnSetNoIdWithTableName(drillCol, _this)
                    === _this.KHChart.splicingColumnSetNoIdWithTableName(tempVa, _this)) {
                    tempVa = _this.KHUtils.clone(currentDrillCol);    // 如果设置的是维度钻取,则替换成当前钻取列;颜色图例钻取,则沿用原来设置的维度
                    let flag = false;
                    array.forEach(compareObj => {
                        let compareColumn = _this.KHChart.splicingColumnSetNoIdWithTableName(compareObj, _this);
                        if (_this.KHChart.splicingColumnSetNoIdWithTableName(tempVa, _this) === compareColumn) {
                            flag = true;
                        }
                    })
                    if (flag) {
                        return false;
                    }
                }
            }
            let tempVaColumn = _this.KHChart.splicingColumnSet(tempVa, _this);
            let tempValue = _this.KHChart.formatNumber(tempVa, data[tempVaColumn]);
            //tempClassValue += _this.KHUtils.isNull(tempValue) ? _this.Constants.chartReplaceNullOrDefined : tempValue + "_";
            tempClassValue += tempValue + "_";
        });
        if (tempClassValue.length > 0) {
            tempClassValue = tempClassValue.substr(0, tempClassValue.length - 1);
        }
        return tempClassValue;
    },
    /**
     * 拼接设置对象返回实际的列名,取后台数据所用
     * @param columnSetObj 设置对象
     * @param _this
     * @returns {string}
     */
    splicingColumnSet(columnSetObj, _this) {
        let retColumn = "";
        if (!_this.KHUtils.isNull(columnSetObj.express)) {
            if (columnSetObj.dataType === 'Date' && !_this.KHUtils.isNull(columnSetObj.dateDim)) {
                retColumn = columnSetObj.alias + "_" + columnSetObj.dateDim + "_" + columnSetObj.id;
            } else if (columnSetObj.dataType === 'Number' && !_this.KHUtils.isNull(columnSetObj.aggregate) && columnSetObj.aggregate !== 'none') {
                retColumn = columnSetObj.alias + "_" + columnSetObj.aggregate + "_" + columnSetObj.id;
            } else {
                retColumn = columnSetObj.alias + "_" + columnSetObj.id;
            }
            return retColumn;
        }
        if (columnSetObj.dataType === 'Date' && !_this.KHUtils.isNull(columnSetObj.dateDim)) {
            retColumn = columnSetObj.column + "_" + columnSetObj.dateDim + "_" + columnSetObj.id;
        } else if (columnSetObj.dataType === 'Number' && !_this.KHUtils.isNull(columnSetObj.aggregate) && columnSetObj.aggregate !== 'none') {
            retColumn = columnSetObj.column + "_" + columnSetObj.aggregate + "_" + columnSetObj.id;
        } else {
            retColumn = columnSetObj.column + "_" + columnSetObj.id;
        }
        return retColumn;
    },
    /**
     * 拼接设置对象返回列名用于比对使用
     * @param columnSetObj 设置对象
     * @param _this
     * @returns {string}
     */
    splicingColumnSetNoIdWithTableName(columnSetObj, _this) {
        let retColumn = "";
        if (!_this.KHUtils.isNull(columnSetObj.express)) {
            if (columnSetObj.dataType === 'Date' && !_this.KHUtils.isNull(columnSetObj.dateDim)) {
                retColumn = columnSetObj.table + "_" + columnSetObj.alias + "_" + columnSetObj.dateDim;
            } else if (columnSetObj.dataType === 'Number' && !_this.KHUtils.isNull(columnSetObj.aggregate) && columnSetObj.aggregate !== 'none') {
                retColumn = columnSetObj.table + "_" + columnSetObj.alias + "_" + columnSetObj.aggregate;
            } else {
                retColumn = columnSetObj.table + "_" + columnSetObj.alias;
            }
            return retColumn;
        }
        if (columnSetObj.dataType === 'Date' && !_this.KHUtils.isNull(columnSetObj.dateDim)) {
            retColumn = columnSetObj.table + "_" + columnSetObj.column + "_" + columnSetObj.dateDim;
        } else if (columnSetObj.dataType === 'Number' && !_this.KHUtils.isNull(columnSetObj.aggregate) && columnSetObj.aggregate !== 'none') {
            retColumn = columnSetObj.table + "_" + columnSetObj.column + "_" + columnSetObj.aggregate;
        } else {
            retColumn = columnSetObj.table + "_" + columnSetObj.column;
        }
        return retColumn;
    },
    /**
     * 拼接返回下钻显示的X轴标题
     * @param currentCol 实际传递的对象
     * @param _this
     * @returns {string}
     */
    splicingDrillTitleText(currentCol, _this) {
        return _this.KHUtils.isNull(currentCol.alias) ?
            (!_this.KHUtils.isNull(currentCol.dateDim) ? (currentCol.column + "(" + currentCol.dateDim + ")") : currentCol.column ? currentCol.column : _this.Constants.drillNavigationReplaceNullOrDefined) : currentCol.alias;
    },
    /**
     * 返回实际设置对象在数组中是否存在,-1不存在;其他:存在返回实际在数组中的下标
     * @param array
     * @param compareObj
     * @param _this
     * @returns {*}
     */
    findIndexInArray(array, compareObj, _this) {
        if (!_this.KHUtils.isNull(compareObj.express)) {
            if (compareObj.dataType === 'Date' && !_this.KHUtils.isNull(compareObj.dateDim)) {
                return array.findIndex(obj => obj.alias + "_" + obj.dateDim + "_" + obj.id === compareObj.alias + "_" + compareObj.dateDim + "_" + compareObj.id);
            } else if (compareObj.dataType === 'Number' && !_this.KHUtils.isNull(compareObj.aggregate) && compareObj.aggregate !== 'none') {
                return array.findIndex(obj => obj.alias + "_" + obj.aggregate + "_" + obj.id === compareObj.alias + "_" + compareObj.aggregate + "_" + compareObj.id);
            } else {
                return array.findIndex(obj => obj.alias + "_" + obj.id === compareObj.alias + "_" + compareObj.id);
            }
        }
        if (compareObj.dataType === 'Date' && !_this.KHUtils.isNull(compareObj.dateDim)) {
            return array.findIndex(obj => obj.column + "_" + obj.dateDim + "_" + obj.id === compareObj.column + "_" + compareObj.dateDim + "_" + compareObj.id)
        } else if (compareObj.dataType === 'Number' && !_this.KHUtils.isNull(compareObj.aggregate) && compareObj.aggregate !== 'none') {
            return array.findIndex(obj => obj.column + "_" + obj.aggregate + "_" + obj.id === compareObj.column + "_" + compareObj.aggregate + "_" + compareObj.id)
        } else {
            return array.findIndex(obj => obj.column + "_" + obj.id === compareObj.column + "_" + compareObj.id)
        }
    },
    /**
     *
     * @param columnSetObj 设置对象
     * @param val 该设置对象列对应的Value值
     * @returns {string|*}
     */
    formatNumber(columnSetObj, val) {
        if (columnSetObj.dataType !== 'Number') {
            return val;
        }
        if (!columnSetObj.format) {
            return val;
        }
        if (!columnSetObj.format.type) {
            return val;
        }
        if (columnSetObj.format.type == "default") {
            return val;
        }
        if (!columnSetObj.format.places) {
            return val;
        }
        if (columnSetObj.format.type == "decimal") {
            return parseFloat(val.toFixed(columnSetObj.format.places));
        }
        if (columnSetObj.format.type == "percent") {
            return val;
        }
    }
};
//let Base64 = require('js-base64').Base64
export default {
    instance: KHChart,
    //注册插件
    install(Vue) {
        if (Vue.prototype.KHChart) return;
        Vue.prototype.KHChart = KHChart;
    }
}
