const WARN_0 = "颜色图例轴已有项，主值轴/副值轴只能出现一项";
const WARN_1 = "颜色图例轴已有项，值轴只能出现一项";
var KHReportSet = {
    /**#################start##########################**/
    /**#################Chart控件通用的处理方法###########################**/
    // 移除维度、颜色维度等维度字段时初始化对应的钻取配置
    initDrillingAxis(item, _this) {
        if (_this.item && _this.item.data && _this.item.data.drillingAxis instanceof Array && _this.item.data.drillingAxis.length > 0) {
            if (_this.item.data.drillingAxis[0].drillCol instanceof Array && _this.item.data.drillingAxis[0].drillCol.length > 0) {
                let drillCol = _this.item.data.drillingAxis[0].drillCol[0];
                if ((item.dataType === 'Date' ? drillCol.column === item.column && drillCol.dateDim === item.dateDim : drillCol.column === item.column)) {
                    _this.item.data.drillingAxis = [{drillCol: [], childCols: []}];
                    _this.item.drillNavigation = [];
                    _this.drillingAxisSelectVisible = true;
                    _this.$nextTick(() => {
                        _this.drillingAxisSelectVisible = false
                    });
                }
            }
        }
    },
    // 钻取设置
    showDrillingAxisSelect(drillCol, _this) {
        _this.item.data.drillingAxis = [{drillCol: [], childCols: []}];
        // 默认带出年份的钻取维度
        if (drillCol.dataType === 'Date') {
            let tempArray = [];
            let compareArray = [];
            _this.dimTreeData.forEach(obj => {
                if (obj.column === drillCol.table) {
                    compareArray = obj.children;
                }
            });
            find(compareArray);

            function find(arr) {
                arr.forEach(obj => {
                    if (obj.children) {
                        find(obj.children)
                    }
                    if (drillCol.column === obj.column && drillCol.dateDim === obj.dateDim) {
                        tempArray = arr;
                    }
                })
            }

            let compareIndex = null;
            tempArray.forEach((ta, index) => {
                if (drillCol.column === ta.column && drillCol.dateDim === ta.dateDim) {
                    compareIndex = index;
                }
                if (compareIndex !== null && index > compareIndex && ta.dateDim !== 'ymdhms' && ta.dateDim !== 'week') {
                    let newObj = {};
                    newObj.column = ta.column;
                    newObj.desc = ta.desc;
                    newObj.dataType = ta.dataType;
                    newObj.alias = ta.alias;
                    newObj.express = ta.express;
                    newObj.aggregate = ta.aggregate && !_this.KHUtils.isNull(ta.aggregate) ? ta.aggregate : "none";
                    newObj.charttype = ta.charttype;
                    newObj.table = ta.table;
                    newObj.dateDim = ta.dateDim;
                    if (ta.order && !_this.KHUtils.isNull(ta.order)) {
                        newObj.order = ta.order;
                    } else {
                        newObj.order = "none";
                    }
                    _this.item.data.drillingAxis[0].childCols.push(newObj);
                }
            });
            //console.log("tempArray :" + JSON.stringify(tempArray));
        }
        _this.item.data.drillingAxis[0].drillCol.push(drillCol);
        _this.drillingAxisSelectVisible = false;
        _this.$nextTick(() => {
            _this.drillingAxisSelectVisible = true
        });
    },
    // 主钻取维度的动态删除
    removeDrillColAxis(item, _this) {
        var index = _this.item.data.drillingAxis[0].drillCol.indexOf(item);
        if (index !== -1) {
            _this.item.data.drillingAxis[0].drillCol.splice(index, 1);
            _this.item.data.drillingAxis[0].childCols = [];
            delete _this.item.data.drillingAxis;
        }
        _this.drillingAxisSelectVisible = true;
        _this.$nextTick(() => {
            _this.drillingAxisSelectVisible = false
        });
    },
    // 子钻取维度的动态删除
    removeChildColsAxis(item, _this) {
        var index = _this.item.data.drillingAxis[0].childCols.indexOf(item);
        if (index !== -1) {
            _this.item.data.drillingAxis[0].childCols.splice(index, 1)
        }
        _this.drillingAxisSelectVisible = false;
        _this.$nextTick(() => {
            _this.drillingAxisSelectVisible = true
        });
        //console.log("drillingAxis[0].childCols :" + JSON.stringify(_this.item.data.drillingAxis[0].childCols));
    },
    // 子钻取维度的动态新增
    addChildColsAxis(data, _this) {
        // 如果是父节点,则不允许选择
        if (data.children instanceof Array && data.children.length > 0) {
            return false;
        }
        // 如果与钻取有冲突则不允许选择
        let drillCol = _this.item.data.drillingAxis[0].drillCol[0];
        if ((drillCol.dataType === 'Date' ? drillCol.column === data.column && drillCol.dateDim === data.dateDim : drillCol.column === data.column)) {
            return false;
        }
        let newObj = {};
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.alias = data.alias;
        newObj.express = data.express;
        newObj.aggregate = data.aggregate && !_this.KHUtils.isNull(data.aggregate) ? data.aggregate : "none";
        newObj.charttype = data.charttype;
        newObj.table = data.table;
        // 日期控件的特殊处理
        if (data.dataType === "Date") {
            newObj.dateDim = data.dateDim;
        }
        if (data.order && !_this.KHUtils.isNull(data.order)) {
            newObj.order = data.order;  // 聚合函数
        } else {
            newObj.order = "none";
        }
        _this.item.data.drillingAxis[0].childCols.push(newObj);
        _this.drillingAxisSelectVisible = false;
        _this.$nextTick(() => {
            _this.drillingAxisSelectVisible = true
        });
        //console.log("addChildColsAxis :" + JSON.stringify(_this.item.data.drillingAxis[0].childCols));
    },
    // 颜色图例的动态新增
    addColorAxis(event, data, _this) {
        // 如果是父节点,则不允许选择
        if (data.children instanceof Array && data.children.length > 0) {
            return false;
        }
        if (_this.item.data.viceValueAxis instanceof Array && _this.item.data.viceValueAxis.length > 1) {
            _this.$message.warning(WARN_0);
            return false;
        }
        if (_this.item.data.valueAxis instanceof Array && _this.item.data.valueAxis.length > 1) {
            _this.$message.warning(_this.item.reportType === "compositeReportWidget" ? WARN_0 : WARN_1);
            return false;
        }
        let limitFlag = _this.item.data.colorAxis instanceof Array && _this.item.data.colorAxis.length >= 1;
        if (limitFlag) {
            _this.$message.warning("已超过[颜色图例/维度]最多可添加项数量（1）");
            return false;
        }
        let newObj = {};
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.alias = data.alias;
        newObj.express = data.express;
        newObj.table = data.table;
        if (data.dataType === "Date") {
            newObj.dateDim = data.dateDim;
        }
        _this.item.data.colorAxis.push(newObj);
        //console.log("addColorAxis :" + JSON.stringify(_this.item.data.classAxis));
    },
    // 颜色图例的动态删除
    removeColorAxis(item, _this) {
        var index = _this.item.data.colorAxis.indexOf(item);
        if (index !== -1) {
            _this.item.data.colorAxis.splice(index, 1)
        }
        this.initDrillingAxis(item, _this);
        //console.log("removeColorAxis :" + JSON.stringify(_this.item.data.colorAxis));
    },
    // 副值轴/度量的动态新增
    addViceValueAxis(data, _this) {
        if (_this.item.data.colorAxis instanceof Array && _this.item.data.colorAxis.length >= 1) {
            if (_this.item.data.viceValueAxis instanceof Array && _this.item.data.viceValueAxis.length >= 1) {
                _this.$message.warning(WARN_0);
                return false;
            }
        }
        // 如果是父节点,则不允许选择
        if (data.children instanceof Array && data.children.length > 0) {
            return false;
        }
        let newObj = {};
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.alias = data.alias;
        newObj.express = data.express;
        //newObj.aggregate = data.aggregate && !_this.KHUtils.isNull(data.aggregate) && data.aggregate !== 'none' ? data.aggregate : "sum";
        newObj.aggregate = null;
        newObj.charttype = "line";
        newObj.table = data.table;
        if (data.order && !_this.KHUtils.isNull(data.order)) {
            newObj.order = data.order;  // 聚合函数
        } else {
            newObj.order = "none";
        }
        _this.item.data.viceValueAxis.push(newObj);
        //console.log("addViceValueAxis :" + JSON.stringify(_this.item.data.viceValueAxis));
    },
    // 副值轴/度量的动态删除
    removeViceValueAxis(item, _this) {
        var index = _this.item.data.viceValueAxis.indexOf(item);
        if (index !== -1) {
            _this.item.data.viceValueAxis.splice(index, 1)
        }
        //console.log("removeViceValueAxis :" + JSON.stringify(_this.item.data.viceValueAxis));
    },
    /**#################end##########################**/

    /**#################start##########################**/
    /**#################Chart控件/交叉表/指标看板控件通用的处理方法###########################**/
    // 度量的动态新增
    addValueAxis(data, _this) {
        if (_this.item.reportType === 'pieReportWidget' && _this.item.data.valueAxis instanceof Array && _this.item.data.valueAxis.length >= 1) {
            // 如果是饼图,则限制只允许添加一个
            _this.$message.warning("已超过[扇区角度/度量]最多可添加项数量（1）");
            return false;
        }
        let flag = _this.item.reportType === 'lineReportWidget' || _this.item.reportType === 'columnReportWidget' || _this.item.reportType === 'barReportWidget' || _this.item.reportType === 'compositeReportWidget';
        if (flag && _this.item.data.colorAxis instanceof Array && _this.item.data.colorAxis.length >= 1) {
            // 如果是折线图/柱图/条形图,在添加了颜色图例/维度的基础上限制只允许添加一个
            if (_this.item.data.valueAxis instanceof Array && _this.item.data.valueAxis.length >= 1) {
                _this.$message.warning(WARN_1);
                return false;
            }
        }
        // 如果是父节点,则不允许选择
        if (data.children instanceof Array && data.children.length > 0) {
            return false;
        }
        let newObj = {};
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.aggregate = null;
        newObj.alias = data.alias;
        newObj.express = data.express;
        if (_this.item.reportType === 'compositeReportWidget') {
            newObj.charttype = "line";
        } else {
            newObj.charttype = data.charttype;
        }
        newObj.table = data.table;
        if (data.order && !_this.KHUtils.isNull(data.order)) {
            newObj.order = data.order;  // 聚合函数
        } else {
            newObj.order = "none";
        }
        _this.item.data.valueAxis.push(newObj);
        //console.log("addValueAxis :" + JSON.stringify(_this.item.data.valueAxis));
    },
    // 度量的动态删除
    removeValueAxis(item, _this) {
        var index = _this.item.data.valueAxis.indexOf(item);
        if (index !== -1) {
            _this.item.data.valueAxis.splice(index, 1)
        }
        //console.log("removeValueAxis :" + JSON.stringify(_this.item.data.valueAxis));
    },
    // 维度的动态新增
    addClassAxis(data, _this) {
        // 如果是饼图,则限制只允许添加一个
        if (_this.item.reportType === 'pieReportWidget' && _this.item.data.classAxis instanceof Array && _this.item.data.classAxis.length >= 1) {
            _this.$message.warning("已超过[扇区标签/维度]最多可添加项数量（1）");
            return false;
        } else if (_this.item.reportType === 'kanbanWidget' && _this.item.data.classAxis instanceof Array && _this.item.data.classAxis.length >= 1) {
            _this.$message.warning("已超过[看板标签/维度]最多可添加项数量（1）");
            return false;
        }
        // 如果是父节点,则不允许选择
        if (data.children instanceof Array && data.children.length > 0) {
            return false;
        }
        let newObj = {};
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.alias = data.alias;
        newObj.express = data.express;
        newObj.table = data.table;
        if (data.dataType === "Date") {
            newObj.dateDim = data.dateDim;
        }
        if (data.order && !_this.KHUtils.isNull(data.order)) {
            newObj.order = data.order;  // 聚合函数
        } else {
            newObj.order = "none";
        }
        _this.item.data.classAxis.push(newObj);
        //console.log("addClassAxis :" + JSON.stringify(_this.item.data.classAxis));
    },
    // 维度的动态删除
    removeClassAxis(item, _this) {
        var index = _this.item.data.classAxis.indexOf(item);
        if (index !== -1) {
            _this.item.data.classAxis.splice(index, 1)
        }
        this.initDrillingAxis(item, _this);
        //console.log("removeClassAxis :" + JSON.stringify(_this.item.data.classAxis));
    },
    // 当前时间按钮动态删除
    removeDateButtons(item, _this) {
        var index = _this.item.data.superConds.indexOf(item);
        if (index !== -1) {
            _this.item.data.superConds.splice(index, 1);
        }
    },
    // 过滤条件的动态新增
    addCondFilters(currentNode, checkedKeys, _this, itemType) {
        // 如果是父节点,则不允许选择
        if (currentNode.children instanceof Array && currentNode.children.length > 0) {
            return false;
        }
        // check框选中 Or 取消选中都会触发
        let checked = false;
        if (!_this.KHUtils.isNull(checkedKeys) && checkedKeys.checkedNodes instanceof Array) {
            checkedKeys.checkedNodes.forEach(obj => {
                let tempName = obj.column + obj.alias;
                let compareName = currentNode.column + currentNode.alias;
                if (tempName === compareName) {
                    // 选中状态
                    checked = true;
                }
            })
        }
        // 选中状态
        let data = currentNode;
        let newObj = {};
        newObj.id = data.id;
        newObj.table = data.table;
        newObj.column = data.column;
        newObj.desc = data.desc;
        newObj.dataType = data.dataType;
        newObj.alias = data.alias;
        newObj.express = data.express;
        newObj.itemType = itemType;
        // 日期控件的特殊处理
        if (data.dataType === "Date") {
            newObj.dateDim = data.dateDim;
        }
        // 维度 Or 度量的区分
        if (data.aggregate && !_this.KHUtils.isNull(data.aggregate)) {
            newObj.aggregate = data.aggregate;  // 聚合函数
        } else {
            newObj.aggregate = "none";
        }
        if (!_this.KHUtils.isNull(checkedKeys) && !checked) {
            // 非选中状态
            this.removeCondFilters(newObj, _this);
            return false;
        }
        _this.item.data.condFilters.push(newObj);
        //console.log("addCondFilters :" + JSON.stringify(_this.item.data.condFilters));
    },
    // 过滤条件的动态删除
    removeCondFilters(item, _this) {
        const index = _this.item.data.condFilters.findIndex(obj => obj.column + obj.id === item.column + item.id);
        _this.item.data.condFilters.splice(index, 1);
       // console.log("removeCondFilters :" + JSON.stringify(_this.item.data.condFilters));
    },
    //初始化新字段的兼容性
    initDataField(_this) {
        if (!_this.item.data.hasOwnProperty('superConds')) {
            _this.$set(_this.item.data, 'superConds', []);
        }
    },
    // 当前时间按钮设为默认
    setDefaultDateButton(item, _this) {
        for (let i = 0; i < _this.item.data.superConds.length; i++) {
            let superCond = _this.item.data.superConds[i];
            if (item.column === superCond.column && item.alias === superCond.alias && item.dateDim === superCond.dateDim) {
                _this.$set(_this.item.data.superConds[i], 'default', true);
            } else {
                _this.$set(_this.item.data.superConds[i], 'default', false);
            }
        }
    },
    // 兼容新的样式配置
    initChartStyle(_this) {
        if (!_this.item.style.hasOwnProperty('superConds')) {
            _this.$set(_this.item.style, 'superConds', {
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
            });
        }
    }
    /**#################end##########################**/
};

export default {
    instance: KHReportSet,
    //注册插件
    install(Vue) {
        if (Vue.prototype.KHReportSet) return;
        Vue.prototype.KHReportSet = KHReportSet;
    }
};
