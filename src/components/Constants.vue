<template>
    <section>
    </section>
</template>

<script>
    const pieChartWidgetItem = {
        id: new Date().getTime(),
        name: "",
        type: "reportWidget", // 饼图报表控件类型
        borderColor: "#EBEAEF",
        paddingTop: 25,
        paddingRight: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        reportType: "",
        data: {
            dataset: "",
            smallType: "pie",
            valueAxis: [],
            classAxis: [],
            condFilters: [],
            superConds: []
        },
        style: {
            backgroundColor: null,
            // 基础设置
            mainTitle: "",
            mainTitleVisiable: true, // 显示主标题/备注
            mainTitleColor: null,    // 显示主标题/备注
            titleRemark: "", // 主标题备注
            subtitleVisiable: false,  // 展示链接跳转
            title: {
                text: ""
            },
            subtitle: {
                text: "",
                style: {
                    color: null,
                    fontSize: "14px",
                    fontWeight: 500,
                },
                useHTML: true,
                align: "right"
            },
            drillNavigationFontColor: null,//图例文字样式颜色
            drillNavigationFontSize: '16px',//图例文字样式大小
            totalFontSize: '20px',
            totalColor: null,
            labelColor: null,// x轴标签颜色
            labelSize: '12px',
            subtitleText: "", // 链接文案
            subtitleUrl: "", // 链接地址
            // 图表样式
            //chartType: "line", // 图表类型
            dataLabelsEnable: true, // 显示图表标签
            dataLabels: ["维度", "度量", "百分比"], // 标签类型(维度、度量)
            isIndeterminate: false,
            legendAlign: "none", // 图例位置
            shapeType: "pie", // 饼形(pie) Or 环形(annular)
            radius: '100%', // 半径百分比
            showTotal: false, // 显示总计
            seriesColor1: null,
            seriesColor2: null,
            seriesColor3: null,
            seriesColor4: null,
            seriesColor5: null,
            seriesColor6: null,
            seriesColor7: null,
            seriesColor8: null,
            seriesColor9: null,
            seriesColor10: null,
            superConds: {
                unselected: {
                    fontSize: '12px',
                    fontColor: '#FFFFFF',
                    backgroundColor: '#E11414'
                },
                selected: {
                    fontSize: '12px',
                    fontColor: '#FFFFFF',
                    backgroundColor: '#0F38B3'
                }
            }
        },
        sensior: {
            autoRefresh: false,
            count: 1,
            countType: "minute"
        },
        querySize: 1000,
        showMoreOptVisible: false,
        chartLoading: false,
        desc: "", // sql语句
        drillNavigation: []
    };
    const chartWidgetItem = {
        id: new Date().getTime(),
        name: "",
        type: "reportWidget",  // 线图报表控件类型
        reportType: "",
        borderColor: "#EBEAEF",
        paddingTop: 25,
        paddingRight: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        data: {
            dataset: "",
            smallType: "line",  // 图表类型
            valueAxis: [],
            classAxis: [],
            colorAxis: [],
            condFilters: [],
            superConds: []
        }, // 数据
        style: {
            backgroundColor: null,
            // 基础设置
            mainTitle: "",
            mainTitleVisiable: true, // 显示主标题/备注
            mainTitleColor: null,    // 显示主标题/备注
            titleRemark: "", // 主标题备注
            subtitleVisiable: false,  // 展示链接跳转
            subtitle: {
                text: "",
                style: {
                    color: null,
                    fontSize: "14px",
                    fontWeight: 500,
                },
                useHTML: true,
                align: "right"
            },
            subtitleText: "", // 链接文案
            subtitleUrl: "", // 链接地址
            // 图表样式
            //chartType: "line", // 图表类型
            drillNavigationFontColor: null,//图例文字样式颜色
            drillNavigationFontSize: '16px',//图例文字样式大小
            dataLabelsEnable: true, // 显示图表标签
            dataLabelsFontColor: null,//图表标签文字样式颜色
            dataLabelsFontSize: '12px',//图表标签文字样式大小
            legendAlign: "top", // 图例位置
            legendFontColor: null,//图例文字样式颜色
            legendFontSize: '12px',//图例文字样式大小
            doubleYVisiable: false, // 是否显示双y轴
            // 坐标轴
            // 水平轴
            xAxisTitle: {
                text: "",
                align: 'middle'
            },  // 轴标题
            xAxisTitleUnit: "",// 单位
            xAxisTitleVisiable: false, // 显示X轴标题和单位
            xAxisVisiable: true,  // 显示坐标轴
            gridLineVisiable: false, // 显示网格线
            gridLineDashStyle: "Dot", // 网格线样式
            gridLineWidth: 1, // 网格线宽度
            gridLineColor: null, // 网格颜色
            xAxisTickVisiable: false, // 显示刻度线
            xLabelColor: null,// x轴标签颜色
            xLabelSize: '12px',
            xAxisTitleColor: null,
            xAxisTitleFontSize: '12px',
            // xAxisUnitColor: null,
            // xAxisUnitFontSize: '12px',
            // 垂直左轴
            leftYAxisTitle: {
                text: "",
                align: 'middle'
            },  // 轴标题
            leftYTitleUnit: "",// 单位
            leftYTitleVisiable: false, // 显示X轴标题和单位
            leftYVisiable: true,  // 显示坐标轴
            leftYAxisMaxAuto: true,  // 自动计算最大值开启
            leftYAxisMinAuto: true, // 自动计算最小值开启
            leftYAxisMax: 0, // 最大值
            leftYAxisMin: 0, // 最小值
            leftYGridLineVisiable: false, // 显示网格线
            leftYGridLineDashStyle: "Dot", // 网格线样式
            leftYGridLineWidth: 1, // 网格线宽度
            leftYGridLineColor: null, // 网格颜色
            leftYTickVisiable: false, // 显示刻度线
            leftYLabelColor: null,// x轴标签颜色
            leftYLabelSize: '12px',
            leftYAxisTitleColor: null,
            leftYAxisTitleFontSize: '12px',
            // leftYAxisUnitColor: null,
            // leftYAxisUnitFontSize: '12px',
            // 垂直右轴
            rightYAxisTitle: {
                text: "",
                align: 'middle'
            },  // 轴标题
            rightYTitleUnit: "",// 单位
            rightYTitleVisiable: false, // 显示X轴标题和单位
            rightYVisiable: true,  // 显示坐标轴
            rightYAxisMaxAuto: true,  // 自动计算最大值开启
            rightYAxisMinAuto: true, // 自动计算最小值开启
            rightYAxisMax: 0, // 最大值
            rightYAxisMin: 0, // 最小值
            rightYGridLineVisiable: false, // 显示网格线
            rightYGridLineDashStyle: "Dot", // 网格线样式
            rightYGridLineWidth: 1, // 网格线宽度
            rightYGridLineColor: null, // 网格颜色
            rightYTickVisiable: false, // 显示刻度线
            rightYLabelColor: null,// x轴标签颜色
            rightYLabelSize: '12px',
            rightYAxisTitleColor: null,
            rightYAxisTitleFontSize: '12px',
            // rightYAxisUnitColor: null,
            // rightYAxisUnitFontSize: '12px',
            valueStyle: [],
            viceValueStyle: [],
            seriesColor1: null,
            seriesColor2: null,
            seriesColor3: null,
            seriesColor4: null,
            seriesColor5: null,
            seriesColor6: null,
            seriesColor7: null,
            seriesColor8: null,
            seriesColor9: null,
            seriesColor10: null,
            superConds: {
                unselected: {
                    fontSize: '12px',
                    fontColor: '#FFFFFF',
                    backgroundColor: '#E11414'
                },
                selected: {
                    fontSize: '12px',
                    fontColor: '#FFFFFF',
                    backgroundColor: '#0F38B3'
                }
            }
        }, // 样式
        sensior: {
            autoRefresh: false,
            count: 1,
            countType: "minute"
        }, // 高级
        showMoreOptVisible: false,
        chartLoading: false,
        desc: "", // sql语句
        drillNavigation: [],
        querySize: 1000
    };
    const chartReplaceNullOrDefined = "__";
    const drillNavigationReplaceNullOrDefined = "--";
    const conditionAggregateOptions = [
        {
            value: 'none',
            label: '无聚合'
        }, {
            value: 'sum',
            label: '求和'
        }, {
            value: 'avg',
            label: '平均数'
        }, {
            value: 'count',
            label: '计数'
        }, {
            value: 'dscount',
            label: '去重计数'
        }, {
            value: 'max',
            label: '最大值'
        }, {
            value: 'min',
            label: '最小值'
        }]; // 聚合
    const aggregateOptions = [
        {
            value: 'sum',
            label: '求和'
        }, {
            value: 'avg',
            label: '平均数'
        }, {
            value: 'count',
            label: '计数'
        }, {
            value: 'dscount',
            label: '去重计数'
        }, {
            value: 'max',
            label: '最大值'
        }, {
            value: 'min',
            label: '最小值'
        }]; // 聚合
    const chartTypeOptions = [
        {
            value: 'line',
            label: '线图'
        }, {
            value: 'area',
            label: '面积图'
        }, {
            value: 'areaspline',
            label: '堆积面积图'
        }, {
            value: 'areasplinerange',
            label: '百分比堆叠面积图'
        }]; // 线图切换类型
    const legendAlignOptions = [
        {
            value: 'none',
            label: '无'
        }, {
            value: 'top',
            label: '上'
        }, {
            value: 'bottom',
            label: '下'
        }, {
            value: 'center',
            label: '中'
        }, {
            value: 'left',
            label: '左'
        }, {
            value: 'right',
            label: '右'
        }]; // 图例的位置
    const gridLineDashStyleOptions = [
        {
            value: 'Solid',
            label: '————————'
        }, {
            value: 'Dot',
            label: '------------------------'
        }, {
            value: 'ShortDot',
            label: '•••••••••••••••••••••••'
        }]; // 网格线条样式
    const gridLineWidthOptions = [
        {
            value: 1,
            label: '1px'
        }, {
            value: 2,
            label: '2px'
        }, {
            value: 3,
            label: '3px'
        }, {
            value: 4,
            label: '4px'
        }, {
            value: 5,
            label: '5px'
        }]; // 网格设置的线条宽度
    const orderOptions = [
        {
            value: 'none',
            label: '不排序'
        }, {
            value: 'asc',
            label: '升序'
        }, {
            value: 'desc',
            label: '降序'
        }]; // 排序
    const radiusOptions = [
        {
            value: '35%',
            label: '35%'
        },
        {
            value: '45%',
            label: '45%'
        },
        {
            value: '50%',
            label: '50%'
        },
        {
            value: '60%',
            label: '60%'
        },
        {
            value: '70%',
            label: '70%'
        },
        {
            value: '80%',
            label: '80%'
        },
        {
            value: '90%',
            label: '90%'
        },
        {
            value: '100%',
            label: '100%'
        },
    ]; // 扇形半径百分比
    const columnOptions = [
        {
            value: 'column',
            label: '柱图'
        }, {
            value: 'accumulation',
            label: '堆积柱状图'
        }, {
            value: 'percentage',
            label: '百分比堆积柱状图'
        }]; // 柱图
    const barOptions = [
        {
            value: 'bar',
            label: '条形图'
        }, {
            value: 'accumulation',
            label: '堆积条形图'
        }, {
            value: 'percentage',
            label: '百分比堆积条形图'
        }]; // 柱图
    const imageFitOptions = [
        {
            value: 'fill',
            label: 'fill'
        },
        {
            value: 'contain',
            label: 'contain'
        },
        {
            value: 'cover',
            label: 'cover'
        },
        {
            value: 'none',
            label: 'none'
        },
        {
            value: 'scale-down',
            label: 'scale-down'
        }];
    const tablePaginationOptions = [
        {
            value: 5,
            label: '5'
        },
        {
            value: 10,
            label: '10'
        },
        {
            value: 20,
            label: '20'
        },
        {
            value: 50,
            label: '50'
        },
        {
            value: 100,
            label: '100'
        },
        
        {
            value: 200,
            label: '200'
        },
        {
            value: 300,
            label: '300'
        },
        {
            value: 500,
            label: '500'
        }
    ];
    const smallChartTypeOptions = [
        {
            value: 'line',
            label: '线'
        }, {
            value: 'area',
            label: '面'
        }, {
            value: 'column',
            label: '柱'
        }]; // 线图切换类型
    const smallColumnOptions = [
        {
            value: 'none',
            label: '常规'
        },
        {
            value: 'accumulation',
            label: '堆积'
        }, {
            value: 'percentage',
            label: '百分比堆积'
        }];
    const mainValueSizeOptions = [
        {value: '20px', label: '20'},
        {value: '22px', label: '22'},
        {value: '24px', label: '24'},
        {value: '26px', label: '26'},
        {value: '28px', label: '28'},
        {value: '30px', label: '30'},
        {value: '32px', label: '32'},
        {value: '34px', label: '34'},
        {value: '36px', label: '36'},
        {value: '38px', label: '38'},
        {value: '40px', label: '40'},
        {value: '42px', label: '42'},
        {value: '44px', label: '44'},
        {value: '60px', label: '60'}
    ];
    const viceValueSizeOptions = [
        {value: '12px', label: '12'},
        {value: '14px', label: '14'},
        {value: '16px', label: '16'},
        {value: '18px', label: '18'},
        {value: '20px', label: '20'},
        {value: '22px', label: '22'},
        {value: '24px', label: '24'},
        {value: '26px', label: '26'},
        {value: '28px', label: '28'},
        {value: '30px', label: '30'},
        {value: '32px', label: '32'},
        {value: '34px', label: '34'},
        {value: '36px', label: '36'},
        {value: '38px', label: '38'},
        {value: '40px', label: '40'},
        {value: '42px', label: '42'},
        {value: '44px', label: '44'},
        {value: '60px', label: '60'}
    ];
    const borderStyleOptions = [
        {value: 'none', label: '无边框'},
        {value: 'solid', label: '————————'},
        {value: 'dotted', label: '••••••••••••••••••••••'},
        {value: 'dashed', label: '------------------------'},
        {value: 'double', label: '═══════════'},
        {value: 'groove', label: '凹槽边框'},
        {value: 'ridge', label: '垄状边框'},
        {value: 'inset', label: '嵌入边框'},
        {value: 'outset', label: '外凸边框'}
    ];
    const borderWidthOptions = [
        {value: '0px', label: '0'},
        {value: '1px', label: '1'},
        {value: '2px', label: '2'},
        {value: '3px', label: '3'},
        {value: '4px', label: '4'},
        {value: '5px', label: '5'}
    ];
    const gapSizeOptions = [
        {value: '3px', label: '3'},
        {value: '4px', label: '4'},
        {value: '5px', label: '5'},
        {value: '6px', label: '6'},
        {value: '7px', label: '7'},
        {value: '8px', label: '8'},
        {value: '9px', label: '9'},
        {value: '10px', label: '10'},
        {value: '11px', label: '11'},
        {value: '12px', label: '12'},
        {value: '13px', label: '13'},
        {value: '14px', label: '14'},
        {value: '15px', label: '15'}
    ];
    
    export default {
        conditionAggregateOptions,
        aggregateOptions,
        chartTypeOptions,
        legendAlignOptions,
        gridLineDashStyleOptions,
        gridLineWidthOptions,
        orderOptions,
        radiusOptions,
        columnOptions,
        barOptions,
        imageFitOptions,
        smallChartTypeOptions,
        smallColumnOptions,
        tablePaginationOptions,
        mainValueSizeOptions,
        viceValueSizeOptions,
        borderStyleOptions,
        borderWidthOptions,
        gapSizeOptions,
        chartReplaceNullOrDefined,
        chartWidgetItem,
        pieChartWidgetItem,
        drillNavigationReplaceNullOrDefined
    }
</script>
