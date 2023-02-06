var KHReport = {
    //根据数据集ID查询
    getDataSetConf(_this) {
        _this.dataSetConf = {};
        _this.dsMeta = {};
        _this.columns = [];
        _this.columnsGroup = [];
        _this.$Get(_this.khConfig.api.getDataSetConfById + "/" + _this.dataSetId, null).then(res => {
            if (res.errCode === 0) {
                if (!_this.KHUtils.isNull(res.dataSetConf)) {
                    _this.dataSetConf = res.dataSetConf;
                    _this.datasourceId = res.dataSetConf.datasourceId;
                    let dsMetaStr = _this.dataSetConf.dsMeta;
                    if (!_this.KHUtils.isNull(dsMetaStr)) {
                        _this.dsMeta = JSON.parse(dsMetaStr);
                        _this.KHReport.convertColumns(_this);
                    }
                }
            }
        })
    },
    // 数据集配置信息中获取维度和度量
    convertColumns(_this) {
        _this.columns = [];
        _this.columnsGroup = [];
        _this.dimColumns = [];
        _this.measureColumns = [];
        if (!_this.KHUtils.isNull(_this.dsMeta)) {
            //重新复制生成新的对象
            let dimArray = JSON.parse(JSON.stringify(_this.dsMeta.columns.dim));
            let measureArray = JSON.parse(JSON.stringify(_this.dsMeta.columns.measure));
            if (dimArray !== null && dimArray.length > 0) {
                dimArray.forEach(item => {
                    let table = item.table;
                    if (item.columns != null && item.columns.length > 0) {
                        item.columns.forEach(a => {
                            let obj = {
                                id: null,
                                table: "",
                                column: "",
                                desc: "",
                                dataType: "",
                                alias: "",
                                express: ""
                            };
                            if (a.hasOwnProperty('id')) {
                                obj.id = a.id;
                            }
                            obj.table = table;
                            obj.column = a.column;
                            obj.desc = a.desc;
                            obj.dataType = a.dataType;
                            obj.alias = a.alias;
                            obj.express = a.express;
                            _this.dimColumns.push(obj);
                        })
                    }
                });
            }
            if (measureArray != null && measureArray.length > 0) {
                measureArray.forEach(item => {
                    let table = item.table;
                    if (item.columns != null && item.columns.length > 0) {
                        item.columns.forEach(a => {
                            let obj = {
                                id: null,
                                table: "",
                                column: "",
                                desc: "",
                                dataType: "",
                                alias: "",
                                express: ""
                            };
                            if (a.hasOwnProperty('id')) {
                                obj.id = a.id;
                            }
                            obj.table = table;
                            obj.column = a.column;
                            obj.desc = a.desc;
                            obj.dataType = a.dataType;
                            obj.alias = a.alias;
                            obj.express = a.express;
                            _this.measureColumns.push(obj);
                        })

                    }
                });
            }
            if (!_this.KHUtils.isNull(_this.dimColumns) && _this.dimColumns.length > 0) {
                //新增的维度和度量不加入到columns集合中
                _this.dimColumns.forEach(item => {
                    if (!_this.KHUtils.isNull(item.column)) {
                        _this.columns.push(item);
                        _this.KHReport.addColumns(_this, item);
                    }
                })
            }
            if (!_this.KHUtils.isNull(_this.measureColumns) && _this.measureColumns.length > 0) {
                _this.measureColumns.forEach(item => {
                    if (!_this.KHUtils.isNull(item.column)) {
                        _this.columns.push(item);
                        _this.KHReport.addColumns(_this, item);
                    }
                })
            }
        }
        _this.KHReport.convertDimTreeData(_this);
        _this.KHReport.convertMeasureTreeData(_this);
    },
    addColumns(_this, item) {
        let flag = false;
        if (_this.columnsGroup instanceof Array && _this.columnsGroup.length > 0) {
            _this.columnsGroup.forEach((groupItem, index) => {
                if (groupItem.label == item.table) {
                    flag = true;
                    groupItem.options.push(item);
                    return false;
                }
            })
        }

        if (!flag) {
            let newObj = {
                label: "",
                options: []
            }
            newObj.label = item.table;
            newObj.options.push(item);
            _this.columnsGroup.push(newObj);
        }
    },
    // 同步树状结构维度和度量数据
    convertDimTreeData(_this) {
        _this.dimTreeData = [];
        if (_this.dsMeta.columns.dim != null && _this.dsMeta.columns.dim.length > 0) {
            let treeKey = 1;
            _this.dsMeta.columns.dim.forEach(item => {
                let table = item.table
                let newObj = {treeKey: "", label: "", dataType: "", alias: "", children: []};
                newObj.label = table;
                newObj.treeKey = table;
                if (item.columns != null && item.columns.length > 0) {
                    item.columns.forEach(children => {
                        let obj = {
                            treeKey: "",
                            label: "",
                            dataType: "",
                            alias: "",
                            children: [],
                            table: table,
                            item: children
                        };
                        obj.treeKey = treeKey;
                        obj.label = children.column;
                        obj.dataType = children.dataType;
                        obj.alias = children.alias;
                        _this.KHReport.dataConvert(obj);
                        newObj.children.push(obj);
                        treeKey++;
                    })
                }
                _this.dimTreeData.push(newObj);
            })
        }
    },
    dataConvert(obj) {
        let dataType = obj.dataType;
        if (dataType == "Timestamp" || dataType == "Date") {
            let yearObj = {label: "", dataType: "", alias: "", children: []};
            yearObj.label = obj.label;
            yearObj.dataType = "Date";
            yearObj.alias = "年";
            obj.children.push(yearObj);
            let quarterObj = {label: "", dataType: "", alias: "", children: []};
            quarterObj.label = obj.label;
            quarterObj.dataType = "Date";
            quarterObj.alias = "季度";
            obj.children.push(quarterObj);
            let monthObj = {label: "", dataType: "", alias: "", children: []};
            monthObj.label = obj.label;
            monthObj.dataType = "Date";
            monthObj.alias = "月";
            obj.children.push(monthObj);
            let weekObj = {label: "", dataType: "", alias: "", children: []};
            weekObj.label = obj.label;
            weekObj.dataType = "Date";
            weekObj.alias = "星期";
            obj.children.push(weekObj);
            let dayObj = {label: "", dataType: "", alias: "", children: []};
            dayObj.label = obj.label;
            dayObj.dataType = "Date";
            dayObj.alias = "日";
            obj.children.push(dayObj);
            let hourObj = {label: "", dataType: "", alias: "", children: []};
            hourObj.label = obj.label;
            hourObj.dataType = "Date";
            hourObj.alias = "时";
            obj.children.push(hourObj);
            let minuteObj = {label: "", dataType: "", alias: "", children: []};
            minuteObj.label = obj.label;
            minuteObj.dataType = "Date";
            minuteObj.alias = "分";
            obj.children.push(minuteObj);
            let secondObj = {label: "", dataType: "", alias: "", children: []};
            secondObj.label = obj.label;
            secondObj.dataType = "Date";
            secondObj.alias = "秒";
            obj.children.push(secondObj);
            let ymdhmsObj = {label: "", dataType: "", alias: "", children: []};
            ymdhmsObj.label = obj.label;
            ymdhmsObj.dataType = "Date";
            ymdhmsObj.alias = "年月日时分秒";
            obj.children.push(ymdhmsObj);
        }

    },
    convertMeasureTreeData(_this) {
        _this.measureTreeData = [];
        if (_this.dsMeta.columns.measure != null && _this.dsMeta.columns.measure.length > 0) {

            _this.dsMeta.columns.measure.forEach(item => {
                let table = item.table
                let newObj = {label: "", dataType: "", alias: "", children: []};
                newObj.label = table;
                if (item.columns != null && item.columns.length > 0) {
                    item.columns.forEach(children => {
                        let obj = {label: "", dataType: "", alias: "", children: [], table: table, item: children};
                        obj.label = children.column;
                        obj.dataType = children.dataType;
                        obj.alias = children.alias;
                        _this.KHReport.dataConvert(obj);
                        newObj.children.push(obj);
                    })
                }
                _this.measureTreeData.push(newObj);
            })
        }
    },
    // 组装报表的查询条件参数
    createReportConditions(_this, queryParams, queryConditions, reportId) {
        if (!_this.KHUtils.isNull(queryConditions) && queryConditions.length > 0) {
            queryConditions.forEach(item => {
                if (!_this.KHUtils.isNull(item.widget)) {
                    let queryCondition = {};
                    switch (item.dataType) {
                        case "String":
                            if (item.showType == 0) {//下拉列表
                                if (item.select.pickType == 0) {//单选
                                    if (_this.KHUtils.isNull(item.select.defaultValue[0])) {
                                        return;
                                    }
                                    queryCondition.table = item.table;
                                    queryCondition.column = item.column;
                                    queryCondition.dataType = item.dataType;
                                    queryCondition.condType = "single";
                                    queryCondition.matchType = "$eq";
                                    if (!_this.KHUtils.isNull(item.express)) {
                                        queryCondition.express = item.express;
                                    }
                                    if (!_this.KHUtils.isNull(item.aggregate)) {
                                        queryCondition.aggregate = item.aggregate;
                                    }
                                    queryCondition.value = item.select.defaultValue[0];
                                } else if (item.select.pickType == 1) {//多选
                                    if (item.select.defaultValue == null || item.select.defaultValue.length == 0) {
                                        return;
                                    }
                                    queryCondition.table = item.table;
                                    queryCondition.column = item.column;
                                    queryCondition.dataType = item.dataType;
                                    queryCondition.condType = "single";
                                    queryCondition.matchType = "$all";
                                    if (!_this.KHUtils.isNull(item.express)) {
                                        queryCondition.express = item.express;
                                    }
                                    if (!_this.KHUtils.isNull(item.aggregate)) {
                                        queryCondition.aggregate = item.aggregate;
                                    }
                                    queryCondition.value = item.select.defaultValue.toLocaleString();
                                }
                            } else if (item.showType == 1) {//文本框输入
                                if (item.text.condType == 0) {//单条件
                                    if (_this.KHUtils.isNull(item.text.defaultValue[0].value)) {
                                        return;
                                    }
                                    queryCondition.table = item.table;
                                    queryCondition.column = item.column;
                                    queryCondition.dataType = item.dataType;
                                    queryCondition.condType = "single";
                                    queryCondition.matchType = item.text.defaultValue[0].matchType;
                                    queryCondition.value = item.text.defaultValue[0].value;
                                    if (!_this.KHUtils.isNull(item.express)) {
                                        queryCondition.express = item.express;
                                    }
                                    if (!_this.KHUtils.isNull(item.aggregate)) {
                                        queryCondition.aggregate = item.aggregate;
                                    }
                                } else if (item.text.condType == 1) {//或条件
                                    if (_this.KHUtils.isNull(item.text.defaultValue[0].value) && _this.KHUtils.isNull(item.text.defaultValue[1].value)) {
                                        return;
                                    }
                                    queryCondition.condType = "multi";
                                    queryCondition.relation = "or";
                                    queryCondition.conds = [];
                                    let cond1 = {};
                                    let cond2 = {};
                                    cond1.table = item.table;
                                    cond1.column = item.column;
                                    cond1.dataType = item.dataType;
                                    cond1.matchType = item.text.defaultValue[0].matchType;
                                    cond1.value = item.text.defaultValue[0].value;
                                    cond2.table = item.table;
                                    cond2.column = item.column;
                                    cond2.dataType = item.dataType;
                                    cond2.matchType = item.text.defaultValue[1].matchType;
                                    cond2.value = item.text.defaultValue[1].value;
                                    if (!_this.KHUtils.isNull(item.express)) {
                                        cond1.express = item.express;
                                        cond2.express = item.express;
                                    }
                                    if (!_this.KHUtils.isNull(item.aggregate)) {
                                        cond1.aggregate = item.aggregate;
                                        cond2.aggregate = item.aggregate;
                                    }
                                    queryCondition.conds.push(cond1);
                                    queryCondition.conds.push(cond2);
                                } else if (item.text.condType == 2) {//且条件
                                    if (_this.KHUtils.isNull(item.text.defaultValue[0].value) && _this.KHUtils.isNull(item.text.defaultValue[1].value)) {
                                        return;
                                    }
                                    queryCondition.condType = "multi";
                                    queryCondition.relation = "and";
                                    queryCondition.conds = [];
                                    let cond1 = {};
                                    let cond2 = {};
                                    cond1.table = item.table;
                                    cond1.column = item.column;
                                    cond1.dataType = item.dataType;
                                    cond1.matchType = item.text.defaultValue[0].matchType;
                                    cond1.value = item.text.defaultValue[0].value;
                                    cond2.table = item.table;
                                    cond2.column = item.column;
                                    cond2.dataType = item.dataType;
                                    cond2.matchType = item.text.defaultValue[1].matchType;
                                    cond2.value = item.text.defaultValue[1].value;
                                    if (!_this.KHUtils.isNull(item.express)) {
                                        cond1.express = item.express;
                                        cond2.express = item.express;
                                    }
                                    if (!_this.KHUtils.isNull(item.aggregate)) {
                                        cond1.aggregate = item.aggregate;
                                        cond2.aggregate = item.aggregate;
                                    }
                                    queryCondition.conds.push(cond1);
                                    queryCondition.conds.push(cond2);
                                }
                            }
                            break;
                        case "Number":
                            if (item.condType == 0) {
                                if (_this.KHUtils.isNull(item.defaultValue[0].value)) {
                                    return;
                                }
                                queryCondition.table = item.table;
                                queryCondition.column = item.column;
                                queryCondition.dataType = item.dataType;
                                queryCondition.condType = "single";
                                queryCondition.matchType = item.defaultValue[0].matchType;
                                queryCondition.value = item.defaultValue[0].value;
                                if (!_this.KHUtils.isNull(item.express)) {
                                    queryCondition.express = item.express;
                                }
                                if (!_this.KHUtils.isNull(item.aggregate)) {
                                    queryCondition.aggregate = item.aggregate;
                                }
                            } else if (item.condType == 1) {
                                if (_this.KHUtils.isNull(item.defaultValue[0].value) && _this.KHUtils.isNull(item.defaultValue[1].value)) {
                                    return;
                                }
                                queryCondition.condType = "multi";
                                queryCondition.relation = "or";
                                queryCondition.conds = [];
                                let cond1 = {};
                                let cond2 = {};
                                cond1.table = item.table;
                                cond1.column = item.column;
                                cond1.dataType = item.dataType;
                                cond1.matchType = item.defaultValue[0].matchType;
                                cond1.value = item.defaultValue[0].value;
                                cond2.table = item.table;
                                cond2.column = item.column;
                                cond2.dataType = item.dataType;
                                cond2.matchType = item.defaultValue[1].matchType;
                                cond2.value = item.defaultValue[1].value;
                                if (!_this.KHUtils.isNull(item.express)) {
                                    cond1.express = item.express;
                                    cond2.express = item.express;
                                }
                                if (!_this.KHUtils.isNull(item.aggregate)) {
                                    cond1.aggregate = item.aggregate;
                                    cond2.aggregate = item.aggregate;
                                }
                                queryCondition.conds.push(cond1);
                                queryCondition.conds.push(cond2);
                            } else if (item.condType == 2) {
                                if (_this.KHUtils.isNull(item.defaultValue[0].value) && _this.KHUtils.isNull(item.defaultValue[1].value)) {
                                    return;
                                }
                                queryCondition.condType = "multi";
                                queryCondition.relation = "and";
                                queryCondition.conds = [];
                                let cond1 = {};
                                let cond2 = {};
                                cond1.table = item.table;
                                cond1.column = item.column;
                                cond1.dataType = item.dataType;
                                cond1.matchType = item.defaultValue[0].matchType;

                                cond1.value = item.defaultValue[0].value;
                                cond2.table = item.table;
                                cond2.column = item.column;
                                cond2.dataType = item.dataType;
                                cond2.matchType = item.defaultValue[1].matchType;
                                cond2.value = item.defaultValue[1].value;
                                if (!_this.KHUtils.isNull(item.express)) {
                                    cond1.express = item.express;
                                    cond2.express = item.express;
                                }
                                if (!_this.KHUtils.isNull(item.aggregate)) {
                                    cond1.aggregate = item.aggregate;
                                    cond2.aggregate = item.aggregate;
                                }
                                queryCondition.conds.push(cond1);
                                queryCondition.conds.push(cond2);
                            }
                            break;
                        case "Date":
                            if (item.filterType == 0) {
                                if (_this.KHUtils.isNull(item.defaultValue[0].value)) {
                                    return;
                                }
                                queryCondition.table = item.table;
                                queryCondition.column = item.column;
                                queryCondition.dataType = item.dataType;
                                queryCondition.condType = "single";
                                queryCondition.dateDim = item.dateDim;
                                queryCondition.matchType = item.defaultValue[0].matchType;
                                queryCondition.value = item.defaultValue[0].value;
                                if (!_this.KHUtils.isNull(item.express)) {
                                    queryCondition.express = item.express;
                                }
                                if (!_this.KHUtils.isNull(item.aggregate)) {
                                    queryCondition.aggregate = item.aggregate;
                                }
                            } else if (item.filterType == 1) {
                                if (item.defaultValue.length == 1) {
                                    if (_this.KHUtils.isNull(item.defaultValue[0].value)) {
                                        return;
                                    }
                                } else if (item.defaultValue.length == 2) {
                                    if (_this.KHUtils.isNull(item.defaultValue[0].value) && _this.KHUtils.isNull(item.defaultValue[1].value)) {
                                        return;
                                    }
                                }
                                queryCondition.condType = "multi";
                                queryCondition.relation = "and";
                                queryCondition.conds = [];
                                if (item.defaultValue != null && item.defaultValue.length > 0) {
                                    item.defaultValue.forEach(obj => {
                                        let cond = {};
                                        cond.table = item.table;
                                        cond.column = item.column;
                                        cond.dataType = item.dataType;
                                        cond.dateDim = item.dateDim;
                                        cond.matchType = obj.matchType;
                                        cond.value = obj.value;
                                        if (!_this.KHUtils.isNull(item.express)) {
                                            cond.express = item.express;
                                        }
                                        if (!_this.KHUtils.isNull(item.aggregate)) {
                                            cond.aggregate = item.aggregate;
                                        }
                                        queryCondition.conds.push(cond);
                                    })
                                }
                            }
                            break;
                        default:
                            break;
                    }
                    var widgetArray = item.widget.split(',');
                    if (widgetArray != null && widgetArray.length > 0) {
                        for (var j = 0; j < widgetArray.length; j++) {
                            let wigetId = widgetArray[j];
                            if (queryParams != null && queryParams.length > 0) {
                                for (var i = 0; i < queryParams.length; i++) {
                                    let param = queryParams[i];
                                    if (param.widgetId == wigetId) {
                                        param.queryConditions.push(queryCondition);
                                        break;
                                    } else {
                                        if (i == queryParams.length - 1) {
                                            let widgetQueryCondition = {
                                                reportId: reportId,
                                                widgetId: wigetId,
                                                queryConditions: [],
                                            };
                                            widgetQueryCondition.queryConditions.push(queryCondition);
                                            queryParams.push(widgetQueryCondition)
                                            break;
                                        }
                                    }
                                }
                            } else {
                                let widgetQueryCondition = {
                                    reportId: reportId,
                                    widgetId: wigetId,
                                    queryConditions: [],
                                };
                                widgetQueryCondition.queryConditions.push(queryCondition);
                                queryParams.push(widgetQueryCondition)
                            }
                        }
                    }
                }
            })
        }
    },
    //判断属于原生字段还是自定义的case when 表达式还是聚合表达式
    expressJudge(_this, item) {
        let type = "default";
        if (!_this.KHUtils.isNull(item.column)) {
            type = "default";
            return type;
        }
        if (!_this.KHUtils.isNull(item.express)) {
            let lowerExpress = item.express.toLowerCase();
            if (lowerExpress.indexOf("case") != -1 && lowerExpress.indexOf("when") != -1) {
                type = "caseExp";
            } else {
                type = "aggregateExp"
            }
            return type;
        } else {
            type = "error";
            return type;
        }
    },
    /*判断表达式中是否是Case when的表达式*/
    isExistFun(express) {
        //case when 条件匹配
        let pattern1 = /([cC][aA][sS][eE]).*?([wW][hH][eE][nN]).*?/;
        return pattern1.test(express)
    },
    /*将 匹配case when 的字段, express代表表达式*/
    resolvingCase(express) {
        let _this = this;
        let reg = /[tT][hH][eE][nN][ ]+'([\u4E00-\u9FA5\w\s-]*?)'[ ]+|[tT][hH][eE][nN][ ]+([\u4E00-\u9FA5\w\s-]*?)[ ]+|[eE][lL][sS][eE][ ]+([\u4E00-\u9FA5\w\s-]*?)[ ]+|[eE][lL][sS][eE][ ]+'([\u4E00-\u9FA5\w\s-]*?)'[ ]+/g;
        let arr = [];
        let temp;
        while ((temp = reg.exec(express)) != null) {
            for (let n = 1; n < temp.length; n++) {
                if (!_this.KHUtils.isNull(temp[n])) {
                    arr.push(temp[n])
                }
            }
        }
        return arr;
    },
    /**
     * 初始化报表查询条件的默认值
     * @param _this
     * @param widgets
     */
    initReportQueryCondtions(_this, widgets) {
        if (!(widgets instanceof Array)) {
            return false;
        }
        _this.queryParams = [];
        widgets.forEach((ml, index) => {
            if (ml.type == 'queryWidget') {
                _this.KHReport.createReportConditions(_this, _this.queryParams, ml.conditions, "");
            }
        })
    },
    /**
     * 自定义查询条件查询
     * @param widget 控件属性配置
     * @param _this
     * @param chartInstanceBox
     * @param widgets 控件集合
     * @param previewOrDesgin 挂载菜单(true)Or报表设计(false)
     */
    queryByCustomCondition(_this, queryParams, widgets, chartInstanceBox, previewOrDesgin) {
        let current_this = this;
        //_this.tabQueryParam = _this.KHUtils.clone(queryParams);
        // 查询条件为空,则默认查询所有
        if (!(queryParams instanceof Array) || queryParams.length === 0) {
            widgets.forEach(ml => {
                if (ml.type == "textWidget" || ml.type == "imgWidget" || ml.type == "innerPageWidget" || ml.type == "queryWidget") {
                    return false;
                }
                if (ml.type === "tabPageWidget") {
                    if (ml.tabs instanceof Array) {
                        ml.tabs.forEach(tb => {
                            if (tb.tabContent.widgets instanceof Array) {
                                tb.tabContent.widgets.forEach(obj => {
                                    if (obj.id) {
                                        _this.notifyTabQueryCustom++;  //在Tab外设置的查询条件起效于Tab页内的控件
                                    }
                                })
                            }
                        })
                    }
                } else {
                    //_this.query(ml);
                    current_this.renderWidget(ml, null, widgets, _this, chartInstanceBox, previewOrDesgin);
                }
            })
            return false;
        }
        queryParams.forEach((qp, index) => {
            if ((qp.widgetId) && (qp.queryConditions instanceof Array)) {
                widgets.forEach(ml => {
                    if (ml.type == "textWidget" || ml.type == "imgWidget" || ml.type == "innerPageWidget" || ml.type == "queryWidget") {
                        return false;
                    }
                    if (ml.type === "tabPageWidget") {
                        if (ml.tabs instanceof Array) {
                            ml.tabs.forEach(tb => {
                                if (tb.tabContent.widgets instanceof Array) {
                                    tb.tabContent.widgets.forEach(obj => {
                                        if (qp.widgetId === (obj.id + '')) {
                                            if (obj.id) {
                                                _this.notifyTabQueryCustom++;   // 在Tab外设置的查询条件起效于Tab页内的控件
                                            }
                                        }
                                    })
                                }
                            })
                        }
                    }
                    if (qp.widgetId === (ml.id + '')) {
                        if (ml.type !== "tabPageWidget") {
                            current_this.renderWidget(ml, qp.queryConditions, widgets, _this, chartInstanceBox, previewOrDesgin);
                        }
                    }
                })
            }
        });
    },
    // 渲染表格
    renderTable(item, res, currentSelectItemIndex, queryConditions, _this) {
        _this.tableData = [];
        _this.tableData = res.datas;
        _this.$refs["tableWidget" + currentSelectItemIndex][0].renderTable(res, true, false, queryConditions);
    },
    //渲染指标看板
    renderKanban(item, res, currentSelectItemIndex, _this) {
        _this.$refs['kanbanWidget' + currentSelectItemIndex][0].renderKanban(item, res);
    },
    /**
     * Charts钻取导航
     * @param item 控件配置属性
     * @param itemIndex 当前控件所在的下标
     * @param condIndex 当前导航所处的下标
     * @param _this
     */
    handleBackSenior(item, itemIndex, condIndex, _this, chartInstanceBox, previewOrDesgin) {
        if ((condIndex + 1) === item.drillNavigation.length) {
            return false;
        }
        let currentDrill = _this.KHUtils.clone(item.drillNavigation[condIndex + 1]);
        let tempArray = [];
        let i = condIndex;
        while (i >= 0) {
            tempArray.push(item.drillNavigation[i]);
            i--;
        }
        // 排序
        item.drillNavigation = [];
        if (condIndex > 0) {
            for (let j = tempArray.length - 1; j >= 0; j--) {
                item.drillNavigation.push(tempArray[j]);
            }
        }
        let queryConditions = !(item.queryConditions instanceof Array) ? [] : item.queryConditions;
        let param = {};
        if (previewOrDesgin) {
            if (condIndex > 0) {
                param = {
                    drillingConditions: {current: {}, conds: []}
                };
                param.drillingConditions.conds = [];
                if (item.drillNavigation instanceof Array && item.drillNavigation.length > 0) {
                    item.drillNavigation.forEach((dv, index) => {
                        if (0 < index) {
                            param.drillingConditions.conds.push(dv);
                        }
                    })
                }
                param.drillingConditions.current = currentDrill;
                param.datareport = _this.KHUtils.clone(item);
            }
            param.reportId = _this.reportId;
            param.widgetId = item.id;
        } else {
            if (condIndex === 0) {
                param.datareport = item;
                item.desc = "";  // 报表设计时可查看SQL
            } else {
                param = {
                    drillingConditions: {current: {}, conds: []}
                };
                param.drillingConditions.conds = [];
                if (item.drillNavigation instanceof Array && item.drillNavigation.length > 0) {
                    item.drillNavigation.forEach((dv, index) => {
                        if (0 < index) {
                            param.drillingConditions.conds.push(dv);
                        }
                    })
                }
                param.drillingConditions.current = currentDrill;
                param.datareport = _this.KHUtils.clone(item);
            }
        }
        param.pageNum = 1;
        param.pageSize = item.querySize;
        param.queryConditions = queryConditions;
        item.chartLoading = true;
        _this.$PostJson(previewOrDesgin ? _this.khConfig.api.queryreportdata : _this.khConfig.api.previewreportdata, param).then(res => {
            if (res.errCode === 0) {
                if (!_this.KHUtils.isNull(res.x)) {
                    //item.desc = Base64.decode(res.x);
                    item.desc = decodeURIComponent(escape(window.atob(res.x)));
                }
                if (res.datas instanceof Array) {
                    if (item.reportType === 'compositeReportWidget') {
                        if (condIndex === 0) {
                            _this.CompositeChart.renderDrilldownCompositeChart(item, res, itemIndex, queryConditions, _this, null, null, null, previewOrDesgin);
                        } else {
                            _this.CompositeChart.renderDrilldownCompositeChart(item, res, itemIndex, queryConditions, _this, null, item.data.drillingAxis[0].drillCol[0], currentDrill, previewOrDesgin);
                        }
                    } else if (item.reportType === 'pieReportWidget') {
                        if (condIndex === 0) {
                            _this.PieChart.renderDrilldownPieChart(item, res, itemIndex, queryConditions, _this, condIndex, null, null, null, previewOrDesgin);
                        } else {
                            _this.PieChart.renderDrilldownPieChart(item, res, itemIndex, queryConditions, _this, condIndex, null, item.data.drillingAxis[0].drillCol[0], currentDrill, previewOrDesgin);
                        }
                    } else {
                        if (condIndex === 0) {
                            _this.LineColumnChart.renderDrilldownChart(item, res, itemIndex, queryConditions, _this, null, null, null, previewOrDesgin);
                        } else {
                            _this.LineColumnChart.renderDrilldownChart(item, res, itemIndex, queryConditions, _this, null, item.data.drillingAxis[0].drillCol[0], currentDrill, previewOrDesgin);
                        }
                    }
                }
            }
        }).catch((e) => {
            item.chartLoading = false;
            console.log(e)
        });
    },
    /**
     * 通用查询
     * @param widget 控件属性配置
     * @param _this
     * @param chartInstanceBox
     * @param widgets 控件集合
     * @param previewOrDesgin 挂载菜单(true)Or报表设计(false)
     */
    commonQuery(widget, _this, chartInstanceBox, widgets, previewOrDesgin) {
        if (_this.queryParams != null && _this.queryParams.length > 0) {
            _this.queryParams.forEach((param, index) => {
                if (param.widgetId === (widget.id + '')) {
                    this.renderWidget(widget, param.queryConditions, widgets, _this, chartInstanceBox, previewOrDesgin);
                } else {
                    if (index == _this.queryParams.length - 1) {
                        this.renderWidget(widget, null, widgets, _this, chartInstanceBox, previewOrDesgin);
                    }
                }
            });
        } else {
            this.renderWidget(widget, null, widgets, _this, chartInstanceBox, previewOrDesgin);
        }
    },
    /**
     * 渲染控件
     * @param item 控件属性配置
     * @param queryConditions 自定义查询条件
     * @param widgets 控件集合
     * @param _this
     * @param chartInstanceBox
     * @param previewOrDesgin 挂载菜单(true)Or报表设计(false)
     * @returns {boolean}
     */
    renderWidget(item, queryConditions, widgets, _this, chartInstanceBox, previewOrDesgin) {
        if (!(widgets instanceof Array) || widgets.length <= 0) {
            return false;
        }
        if (!item.id) {
            return false;
        }
        if (item.type == "textWidget" || item.type == "imgWidget" || item.type == "innerPageWidget" || item.type == "queryWidget" || item.type == "tabPageWidget") {
            return false;
        }
        if (!_this.WidgetHelper.checkItem(_this, item)) {
            return false;
        }
        let currentSelectItemIndex = 0; // 当前选中控件的下标
        let existItem = false;        // 根据当前选择的控件取出对应的下标
        widgets.forEach((ml, index) => {
            if (ml.id === item.id) {
                currentSelectItemIndex = index;
                existItem = true;
            }
        })
        if (!existItem) {
            return false; // 如果不存在则返回
        }
        item.drillNavigation = [];
        let param = {
            "queryConditions": [],
            "pageNum": 1,
            "pageSize": 100
        };
        if (previewOrDesgin) {
            param.reportId = _this.reportId;
            param.widgetId = item.id;
        } else {
            param.datareport = item;
            item.desc = "";  // 报表设计时可查看SQL
        }
        if (item.reportType === 'tableReportWidget' && item.style.pagination == true) {
            param.pageSize = item.style.pageSize;
        } else {
            param.pageSize = item.querySize;
        }
        if (queryConditions instanceof Array && queryConditions.length > 0) {
            param.queryConditions = queryConditions;
        }
        // 叠加条件查询
        if (item.data.superConds instanceof Array && item.data.superConds.length > 0) {
            param.superConditions = [];
            item.data.superConds.forEach(cond => {
                if (cond.default) {
                    param.superConditions.push(cond);
                }
            })
        }
        // console.log("param: " + JSON.stringify(param));
        item.chartLoading = true;
        _this.$PostJson(previewOrDesgin ? _this.khConfig.api.queryreportdata : _this.khConfig.api.previewreportdata, param).then(res => {
            if (res.errCode === 0) {
                if (!(res.datas instanceof Array)) {
                    return false;
                }
                if (!_this.KHUtils.isNull(res.x)) {
                    //item.desc = Base64.decode(res.x);
                    item.desc = decodeURIComponent(escape(window.atob(res.x)));
                }
                //item.desc = res.x;  // 查询的SQL语句
                let drillingFlag = item.data.drillingAxis instanceof Array && item.data.drillingAxis.length === 1
                    && item.data.drillingAxis[0].drillCol instanceof Array && item.data.drillingAxis[0].drillCol.length === 1;
                if (item.reportType === 'lineReportWidget' || item.reportType === 'columnReportWidget' || item.reportType === 'barReportWidget') {
                    if (drillingFlag) {
                        chartInstanceBox["chart" + currentSelectItemIndex] = _this.LineColumnChart.renderDrilldownChart(item, res, currentSelectItemIndex, queryConditions, _this, null, null, null, previewOrDesgin); // 渲染可钻取的Charts
                    } else {
                        chartInstanceBox["chart" + currentSelectItemIndex] = _this.LineColumnChart.renderChart(item, res, currentSelectItemIndex, _this, null);
                    }
                } else if (item.reportType === 'pieReportWidget') {
                    if (drillingFlag) {
                        chartInstanceBox["chart" + currentSelectItemIndex] = _this.PieChart.renderDrilldownPieChart(item, res, currentSelectItemIndex, queryConditions, _this, null, null, null, null, previewOrDesgin); // 渲染可钻取的Charts
                    } else {
                        chartInstanceBox["chart" + currentSelectItemIndex] = _this.PieChart.renderPieChart(item, res, currentSelectItemIndex, _this, null);
                    }
                } else if (item.reportType === 'compositeReportWidget') {
                    if (drillingFlag) {
                        chartInstanceBox["chart" + currentSelectItemIndex] = _this.CompositeChart.renderDrilldownCompositeChart(item, res, currentSelectItemIndex, queryConditions, _this, null, null, null, previewOrDesgin); // 渲染可钻取的Charts
                    } else {
                        chartInstanceBox["chart" + currentSelectItemIndex] = _this.CompositeChart.renderCompositeChart(item, res, currentSelectItemIndex, _this, null);
                    }
                } else if (item.reportType === 'tableReportWidget') {
                    this.renderTable(item, res, currentSelectItemIndex, param.queryConditions, _this);
                } else if (item.reportType === 'kanbanWidget') {
                    this.renderKanban(item, res, currentSelectItemIndex, _this);
                }
                item.chartLoading = false;
            }
        }).catch((e) => {
            item.chartLoading = false;
            console.log(e)
        });
    },
}
//let Base64 = require('js-base64').Base64
export default {
    instance: KHReport,
    //注册插件
    install(Vue) {
        if (Vue.prototype.KHReport) return;
        Vue.prototype.KHReport = KHReport;
    }
}
