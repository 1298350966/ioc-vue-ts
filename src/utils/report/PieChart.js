/*
  饼图控件处理类
 */
import Highcharts from 'highcharts/highstock';

const chartLoaingMsg = "数据加载中......";
const drillUpText = "返回上一级";
var PieChart = {
    /**
     * 渲染普通饼图
     * @param item 饼图属性配置
     * @param res 后台返回数据对象
     * @param currentSelectItemIndex 当前控件对应的下标
     * @param _this DragPower对象
     * @param chart 当前饼图对应的chart对象
     * @returns {boolean|*}
     */
    renderPieChart(item, res, currentSelectItemIndex, _this, chart) {
        let chartAttr = this.commonProcess(item, res, _this, false);
        chart = new Highcharts.chart(_this.$refs["chart" + currentSelectItemIndex][0], chartAttr);
        this.positionTitle(item, chart);
        return chart;
    },
    /**
     * 渲染可下钻的饼图
     * @param item 饼图属性配置
     * @param res  后台返回数据对象
     * @param currentSelectItemIndex 当前控件对应的下标
     * @param queryConditions 查询控件组装的查询条件
     * @param _this DragPower对象
     * @param chart 当前饼图对应的chart对象
     * @returns {boolean|*}
     */
    renderDrilldownPieChart(item, res, currentSelectItemIndex, queryConditions, _this, currentDrillNavigationIndex, chart, drillCol, currentDrillCol,previewOrDesgin) {
        let drillingConditions = {
            current: {},
            conds: []
        };  // 钻取查询条件
        let dataLabelsEnable = item.style.dataLabels instanceof Array && item.style.dataLabels.length > 0;    // 动态设置是否显示数据标签
        let current_this = this;
        let events = {
            drilldown: function (e) {
                if (e.seriesOptions || (e.points instanceof Array && e.points.length > 1)) {
                    return false;     // 颜色图例情况分组时,点击X轴上的值钻取会触发多次处理
                }
                _this.KHChart.handleDrillDown(e, drillingConditions, queryConditions, item, _this, currentSelectItemIndex);
                current_this.positionTitle(item, chart);
                _this.KHChart.handleDrillNavigation(drillingConditions, item, _this);
            }
        };
        let drilldown = {
            activeAxisLabelStyle: {
                textDecoration: 'none',
                fontStyle: 'bold',
                color: item.style.labelColor
            },
            activeDataLabelStyle: {
                textDecoration: 'none',
                fontStyle: 'bold',
                color: item.style.labelColor
            },
            series: []
        };
        let chartAttr = this.commonProcess(item, res, _this, true, drillCol, currentDrillCol);
        chartAttr.chart.events = events;
        chartAttr.drilldown = drilldown;
        if (!_this.KHUtils.isNull(currentDrillCol) && chartAttr.xAxis instanceof Array && chartAttr.xAxis.length > 0) {
            chartAttr.xAxis[0].title.text = _this.KHChart.splicingDrillTitleText(currentDrillCol, _this);
        }
        chart = new Highcharts.chart(_this.$refs["chart" + currentSelectItemIndex][0], chartAttr);
        if (item.reportType == 'pieReportWidget' && _this.KHUtils.isNull(currentDrillNavigationIndex)) {
            if (item.drillNavigation[currentDrillNavigationIndex] && item.drillNavigation[currentDrillNavigationIndex].total) {
                item.total = item.drillNavigation[currentDrillNavigationIndex].total;
            }
        }
        this.positionTitle(item, chart);
        return chart;
    },
    
    /**
     * 公共处理方法
     * @param item 组合图属性配置
     * @param res  后台返回数据对象
     * @param _this DragPower对象
     * @param startDrillingFlag 是否开启钻取,true:开启;false:未开启
     * @returns {*|{plotOptions, credits, legend, subtitle, tooltip, title, chart}}
     */
    commonProcess(item, res, _this, startDrillingFlag, drillCol, currentDrillCol) {
        _this.KHChart.settingGolbalColor(_this, item);
        let chartAttr = _this.KHChart.renderChartPublicAttribute(item, _this);
        _this.KHChart.renderChartPublicAttribute(item, _this);
        if (res.datas instanceof Array) {
            this.addPieSeriesData(item, res, _this, startDrillingFlag, drillCol, currentDrillCol);
        }
        let seriesName = _this.KHChart.splicingDrillTitleText(item.data.valueAxis[0], _this);
        let serie = {
            name: seriesName,
            colorByPoint: true,
            data: item.seriesData,
            type: 'pie',
            innerSize: item.style.shapeType && item.style.shapeType === 'pie' ? '0%' : '80%',
            size: item.style.radius,
        }
        chartAttr.series = [serie];
        return chartAttr;
    },
    /**
     * 处理SeriesData
     * @param item 当前图表属性配置
     * @param res 后台返回数据对象
     * @param chart 当前图表对应的chart对象
     * @param _this DragPower对象
     * #######################钻取相关参数########################
     * @param startDrillingFlag 是否开启钻取,true:开启;false:未开启
     * @returns {boolean}
     */
    addPieSeriesData(item, res, _this, startDrillingFlag, drillCol, currentDrillCol) {
        item.total = 0;
        if (!(item.data.valueAxis instanceof Array) || item.data.valueAxis.length <= 0) {
            _this.$message.warning("缺少度量项")
            return false;
        }
        if (!(item.data.classAxis instanceof Array) || item.data.classAxis.length <= 0) {
            _this.$message.warning("缺少维度项")
            return false;
        }
        item.seriesData = [];
        let vaIndex = 0;
        let drilldowns = {};
        let tempArray = [];
        let valueColumn = _this.KHChart.splicingColumnSet(item.data.valueAxis[0], _this);
        let classColumn = _this.KHChart.splicingColumnSet(item.data.classAxis[0], _this);
        if (!_this.KHUtils.isNull(currentDrillCol)) {
            classColumn = _this.KHChart.splicingColumnSet(currentDrillCol, _this);
        }
        let seriesName = _this.KHChart.splicingDrillTitleText(item.data.valueAxis[0], _this);
        res.datas.forEach((data, index) => {
            let tempObj = {}
            if (item.data.drillingAxis instanceof Array) {
                if (_this.KHUtils.isNull(currentDrillCol)) {
                    tempObj = _this.KHUtils.clone(item.data.drillingAxis[0].drillCol[0]);
                } else {
                    tempObj = _this.KHUtils.clone(currentDrillCol);
                }
            }
            let tempClassValue = _this.KHChart.formatNumber(item.data.classAxis[0], data[classColumn]);
            let tempValue = _this.KHChart.formatNumber(item.data.valueAxis[0], data[valueColumn]);
            if (startDrillingFlag) {
                tempObj.name = _this.KHUtils.isNull(tempClassValue) ? _this.Constants.chartReplaceNullOrDefined : tempClassValue;
                tempObj.y = !_this.KHUtils.isNull(tempValue) ? tempValue : null;
                tempObj.drilldown = true;
            } else {
                tempObj.name = _this.KHUtils.isNull(tempClassValue) ? _this.Constants.chartReplaceNullOrDefined : tempClassValue;
                tempObj.y = !_this.KHUtils.isNull(tempValue) ? tempValue : null;
            }
            item.total += !_this.KHUtils.isNull(tempValue) ? tempValue : 0;
            item.seriesData.push(tempObj);
        });
        //console.log("pie :" + JSON.stringify(item.seriesData));
    },
    /**
     * 标题信息定位
     * @param item 饼图属性配置
     * @param chart 当前饼图对应的chart对象
     */
    positionTitle(item, chart) {
        var centerY = chart.series[0].center[1],
            titleHeight = parseInt(chart.title.styles.fontSize);
        // 动态设置标题位置
        chart.setTitle({
            text: item.style.showTotal ? '总计' + item.total : "",
            style: {
                color: item.style.totalColor ? item.style.totalColor : '#000',
                fontSize: item.style.totalFontSize ? item.style.totalFontSize : '20px',
            },
        });
        let legendAlign = item.style.legendAlign; // 动态设置图例的显示位置
        let x = null;
        let y = null;
        if (legendAlign === 'bottom') {
            x = null;
            y = 0;
        } else if (legendAlign === 'top') {
            x = null;
            y = 0;
        } else if (legendAlign === 'left') {
            y = 0;
            x = 60;
        } else if (legendAlign === 'right') {
            y = 0;
            x = -60;
        } else {
            y = 0;
            x = null;
        }
        if (item.style.shapeType === 'annular') {
            chart.setTitle({
                y: centerY + titleHeight / 2 + y,
                x: x,
                floating: true
            })
        } else {
            chart.setTitle({
                align: 'left',
                floating: false
            })
        }
    },
    /***
     * 随着控件缩放的大小,标题重新定位
     * @param item
     * @param chartInstanceBox
     * @param index
     * @returns {boolean}
     */
    resizeTitle(item, chartInstanceBox, index) {
        if (!item.reportType) {
            return false;
        }
        if (item.reportType === 'pieReportWidget' && item.style.shapeType === 'annular') {
            let chart = chartInstanceBox["chart" + index];
            var centerY = chart.series[0].center[1],
                titleHeight = parseInt(chart.title.styles.fontSize);
            // 动态设置标题位置
            chart.setTitle({
                text: item.style.showTotal ? '总计' + item.total : "",
                style: {
                    color: item.style.totalColor ? item.style.totalColor : '#000',
                    fontSize: '20px',
                }
            });
            let legendAlign = item.style.legendAlign; // 动态设置图例的显示位置
            let x = null;
            let y = null;
            if (legendAlign === 'bottom') {
                x = null;
                y = 0;
            } else if (legendAlign === 'top') {
                x = null;
                y = 0;
            } else if (legendAlign === 'left') {
                y = 0;
                x = 60;
            } else if (legendAlign === 'right') {
                y = 0;
                x = -60;
            } else {
                y = 0;
                x = null;
            }
            if (item.style.shapeType === 'annular') {
                chart.setTitle({
                    y: centerY + titleHeight / 2 + y,
                    x: x,
                    floating: true
                })
            } else {
                chart.setTitle({
                    align: 'left',
                    floating: false
                })
            }
        }
    },
};
//let Base64 = require('js-base64').Base64
export default {
    instance: PieChart,
    //注册插件
    install(Vue) {
        if (Vue.prototype.PieChart) return;
        Vue.prototype.PieChart = PieChart;
    }
}
