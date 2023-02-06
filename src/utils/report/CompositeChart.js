/*
  组合图控件处理类
 */
import Highcharts from 'highcharts/highstock';

var CompositeChart = {
    /**
     * 渲染普通的组合图
     * @param item 组合图属性配置
     * @param res  后台返回数据对象
     * @param currentSelectItemIndex 当前控件对应的下标
     * @param _this DragPower对象
     * @param chart 当前组合图对应的chart对象
     * @returns {boolean|*}
     */
    renderCompositeChart(item, res, currentSelectItemIndex, _this, chart) {
        let chartAttr = this.commonProcess(item, res, _this, false);
        chart = new Highcharts.chart(_this.$refs["chart" + currentSelectItemIndex][0], chartAttr);
        return chart;
    },
    /**
     * 渲染可下钻组合图
     * @param item 组合图属性配置
     * @param res  后台返回数据对象
     * @param currentSelectItemIndex 当前控件对应的下标
     * @param queryConditions 查询控件组装的查询条件
     * @param _this DragPower对象
     * @param chart 当前组合图对应的chart对象
     * @returns {boolean|*}
     */
    renderDrilldownCompositeChart(item, res, currentSelectItemIndex, queryConditions, _this, chart, drillCol, currentDrillCol, previewOrDesgin) {
        let drillingConditions = {
            current: {},
            conds: []
        };  // 钻取查询条件
        let events = {
            drilldown: function (e) {
                if (e.seriesOptions || (e.points instanceof Array && e.points.length > 1)) {
                    return false;     // 颜色图例情况分组时,点击X轴上的值钻取会触发多次处理
                }
                _this.KHChart.handleDrillDown(e, drillingConditions, queryConditions, item, _this, currentSelectItemIndex);
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
                color: item.style.dataLabelsFontColor
            },
            series: []
        };
        // 1. 渲染标题、图例等
        let chartAttr = this.commonProcess(item, res, _this, true, drillCol, currentDrillCol);
        chartAttr.chart.events = events;
        chartAttr.drilldown = drilldown;
        if (!_this.KHUtils.isNull(currentDrillCol) && chartAttr.xAxis instanceof Array && chartAttr.xAxis.length > 0) {
            chartAttr.xAxis[0].title.text = _this.KHChart.splicingDrillTitleText(currentDrillCol, _this);
        }
        chart = new Highcharts.chart(_this.$refs["chart" + currentSelectItemIndex][0], chartAttr);
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
        let chartType = _this.KHUtils.isNull(item.data.smallType) ? "line" : item.data.smallType;   // 动态设置图表类型
        let dataLabelsEnable = item.style.dataLabelsEnable;    // 动态设置是否显示数据标签
        let lineStyle = _this.KHUtils.isNull(item.style.lineStyle) ? "line" : item.style.lineStyle;// 动态设置线条样式
        // 1. 渲染标题、图例等
        let chartAttr = _this.KHChart.renderChartPublicAttribute(item, _this);
        chartAttr.chart.type = chartType === 'line' ? lineStyle : (chartType === 'areasplinerange' ? 'area' : chartType);
        if (res.datas instanceof Array) {
            // 2. 类别轴、数据列设置
            let category = _this.KHChart.processChartCategory(item, res, _this, drillCol, currentDrillCol);
            category = category.sort(function (a, b) {
                return a < b ? -1 : 1
            });
            _this.KHChart.addSeriesData(item, res, _this, category, startDrillingFlag, drillCol, currentDrillCol);
            let xAxisAttr = _this.KHChart.renderChartXAxis(item, _this);
            xAxisAttr.categories = category;
            chartAttr.xAxis = [xAxisAttr];
        }
        // 4. 渲染垂直左轴
        let leftYAxisAttr = _this.KHChart.renderChartLeftYAxis(item, _this);
        let rightYAxisAttr = _this.KHChart.renderChartRightYAxis(item, _this);
        chartAttr.yAxis = [leftYAxisAttr];
        let valueSetFlag = item.data.valueAxis instanceof Array && item.data.valueAxis.length > 0;
        let viceValueSetFlag = item.data.viceValueAxis instanceof Array && item.data.viceValueAxis.length > 0
        if (valueSetFlag && viceValueSetFlag) {
            let rightYAxisAttr = _this.KHChart.renderChartRightYAxis(item, _this);
            rightYAxisAttr.id = "second-axis";
            rightYAxisAttr.opposite = true;
            chartAttr.yAxis.push(rightYAxisAttr);
        }
        // 如果只设置了副轴,则y轴在右侧
        if (!valueSetFlag && viceValueSetFlag) {
            leftYAxisAttr.opposite = true;
        }
        chartAttr.series = item.seriesData;
        //console.log("chartAttr :" + JSON.stringify(chartAttr));
        return chartAttr;
    }
};

export default {
    instance: CompositeChart,
    //注册插件
    install(Vue) {
        if (Vue.prototype.CompositeChart) return;
        Vue.prototype.CompositeChart = CompositeChart;
    }
}
