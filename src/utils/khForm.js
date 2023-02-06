import Vue from "vue";

var KHForm = {
    /**
     * 新增Form表单数据提交处理,根据表单配置中的类型进行匹配处理
     * @param data  业务数据
     * @param imageUrl 图片访问路径前缀
     * @param dynCols  表单所有控件集合
     * @constructor
     */
    formatDynCols(data, imageUrl, dynCols) {
        if (dynCols != null && dynCols instanceof Array) {
            dynCols.forEach(dc => {
                let key = dc.model;
                // 隐藏字段的处理
                if (Object.keys(dc.options).indexOf('editShowFields') >= 0 && dc.options.editShowFields) {
                    // 当该字段是由其他选择控件自动带出的时候,并且提交的值不为空则可以提交
                    if (null === data[key] || data[key] === '' || data[key] === undefined) {
                        
                        delete data[key];
                    }
                }
                if (dc.type === 'checkbox' || dc.type === 'multiple_select') {
                    let str = "";
                    if (data[key] instanceof Array && data[key].length > 0) {
                        for (let i = 0, n = data[key].length; i < n; i++) {
                            str += data[key][i] + ",";
                        }
                        //去掉最后一个逗号(如果不需要去掉,就不用写)
                        if (str.length > 0) {
                            str = str.substr(0, str.length - 1);
                        }
                    }
                    data[key] = str;
                } else if (dc.type === 'image_upload') {
                    if (null !== data[key] && data[key] !== '' && data[key] !== undefined) {
                        if (data[key] instanceof Array) {
                            let str = "";
                            
                            for (let i = 0, n = data[key].length; i < n; i++) {
                                //判断是不是第三方图片路径
                                var expression = /(http|https):\/\/\S*/;
                                var objExp = new RegExp(expression);
                                if( objExp.test(data[key][i]) == true){
                                    str += data[key][i]+ ",";
                                }else {
                                    str += data[key][i].split(imageUrl + "/")[1] + ",";
                                }

                            }
                            //去掉最后一个逗号(如果不需要去掉,就不用写)
                            if (str.length > 0) {
                                str = str.substr(0, str.length - 1);
                            }
                            data[key] = str;
                        }
                    } else {
                        data[key] = '';
                    }
                } else if (dc.type === 'file_upload') {
                    if (null !== data[key] && data[key] !== '' && data[key] !== undefined) {
                        if (data[key] instanceof Array) {
                            let str = "";
                            for (let i = 0, n = data[key].length; i < n; i++) {
                                str += data[key][i] + ",";
                            }
                            //去掉最后一个逗号(如果不需要去掉,就不用写)
                            if (str.length > 0) {
                                str = str.substr(0, str.length - 1);
                            }
                            data[key] = str;
                        }
                    } else {
                        data[key] = '';
                    }
                } else if (dc.type === 'switch') {
                    if (null !== data[key] && data[key] !== '' && data[key] !== undefined) {
                        if (data[key]) {
                            data[key] = "0";
                        } else {
                            data[key] = "1";
                        }
                    } else {
                        data[key] = '0';
                    }
                } else if (dc.type === 'data_select' || dc.type === 'org_select' || dc.type === 'user_select' || dc.type === 'company_select' || dc.type === 'role_select' || dc.type === 'dic_select') {
                    // 特殊之处在于,拉取的控件的model对应的字段需要提交到后台
                    if (data[key] instanceof Object) {
                        let cloneObj = {};
                        Object.keys(data[key]).forEach(function (k) {
                            cloneObj[k] = data[key][k];
                        });
                        Object.keys(cloneObj).forEach(function (k) {
                            data[k] = cloneObj[k];
                        });
                    }
                } else if (dc.type === 'current_user' ) {
                    // 特殊之处在于,拉取的控件的model对应的字段需要提交到后台
                    if (data[key] instanceof Object) {
                        let cloneObj = {};
                        Object.keys(data[key]).forEach(function (k) {
                            cloneObj[k] = data[key][k];
                        });
                        Object.keys(cloneObj).forEach(function (k) {
                            data[k] = cloneObj[k];
                        });
                    }
                }else if (dc.type === 'region_select' || dc.type === 'gis_select') {
                    if (data[key] instanceof Object) {
                        let cloneObj = {};
                        Object.keys(data[key]).forEach(function (k) {
                            cloneObj[k] = data[key][k];
                        });
                        Object.keys(cloneObj).forEach(function (k) {
                            data[k] = cloneObj[k];
                        });
                        delete data[key];
                    }
                }
            })
        }
    },
    /**
     * 编辑Form表单数据提交处理,根据表单配置中的类型进行匹配处理
     * @param data  业务数据
     * @param imageUrl 图片访问路径前缀
     * @param dynCols  表单所有控件集合
     * @constructor
     */
    ReversalDynCols(data, imageUrl, dynCols) {
        if (dynCols != null && dynCols instanceof Array) {
            dynCols.forEach(dc => {
                let key = dc.model;
                // 隐藏字段的处理
                if (Object.keys(dc.options).indexOf('showFields') >= 0 && dc.options.showFields) {
                    // 当该字段是由其他选择控件自动带出的时候,并且提交的值不为空则可以提交
                    if (null === data[key] || data[key] === '' || data[key] === undefined) {
                        delete data[key];
                    }
                }
                if (dc.type === 'checkbox' || dc.type === 'multiple_select') {
                    if(data[key] instanceof Array){

                    }else {
                        if (null !== data[key] && data[key] !== '' && data[key] !== undefined) {
                            let tempArray = data[key].split(',');
                            if (tempArray instanceof Array) {
                                data[key] = tempArray;
                            }
                        } else {
                            data[key] = [];
                        }
                    }
                } else if (dc.type === 'image_upload') {
                    if(data[key] instanceof Array){

                    }else {
                        if (null !== data[key] && data[key] !== '' && data[key] !== undefined) {
                            let array = data[key].split(',');
                            if (array.length > 0) {
                                for (let i = 0, n = array.length; i < n; i++) {
                                    //判断是完整图片路径还是uuid
                                    var expression = /(http|https):\/\/\S*/;
                                    var objExp = new RegExp(expression);
                                    if( objExp.test(array[i]) == true){
                                        array[i] = array[i];
                                    }else {
                                        array[i] = imageUrl + "/" + array[i];
                                    }
                                }
                                data[key] = array;
                            }
                        } else {
                            data[key] = [];
                        }
                    }
                } else if (dc.type === 'file_upload') {
                    if(data[key] instanceof Array){

                    }else {
                        if (null !== data[key] && data[key] !== '' && data[key] !== undefined) {
                            let array = data[key].split(',');
                            if (array.length > 0) {
                                data[key] = array;
                            }
                        } else {
                            data[key] = [];
                        }
                    }
                } else if (dc.type === 'switch') {
                    if (null !== data[key] && data[key] !== '' && data[key] !== undefined) {
                        data[key] = data[key] === "0";
                    } else {
                        data[key] = false;
                    }
                } else if (dc.type === 'data_select' || dc.type === 'org_select' || dc.type === 'user_select' || dc.type === 'company_select' || dc.type === 'role_select' || dc.type === 'dic_select') {
                    let newObj = {};
                    newObj[dc.label_model] = data[dc.label_model] ? data[dc.label_model] : "";
                    newObj[dc.model] = data[dc.model] ? data[dc.model] : "";
                    data[key] = newObj;
                }else if (dc.type === 'current_user') {
                    let newObj = {};
                    newObj[dc.label_model] = data[dc.label_model] ? data[dc.label_model] : "";
                    newObj[dc.model] = data[dc.model] ? data[dc.model] : "";
                    data[key] = newObj;
                }  else if (dc.type === 'year' || dc.type === 'month') {
                    if (null !== data[key] && data[key] !== '' && data[key] !== undefined) {
                        data[key] = data[key] + "";
                    }
                } else if (dc.type === 'gis_select') {
                    let newObj = {};
                    newObj[dc.modelExt.lat] = data[dc.modelExt.lat] ? data[dc.modelExt.lat] : "";
                    newObj[dc.modelExt.lnt] = data[dc.modelExt.lnt] ? data[dc.modelExt.lnt] : "";
                    newObj[dc.modelExt.address] = data[dc.modelExt.address] ? data[dc.modelExt.address] : "";
                    data[key] = newObj;
                } else if (dc.type === 'region_select') {
                    let newObj = {'town': ''};
                    newObj.province = data[dc.modelExt.provinceCode] ? data[dc.modelExt.provinceCode] : "";
                    newObj.city = data[dc.modelExt.cityCode] ? data[dc.modelExt.cityCode] : "";
                    newObj.area = data[dc.modelExt.areaCode] ? data[dc.modelExt.areaCode] : "";
                    data[key] = newObj;
                }
            })
        }
    },
    /**
     * 数据选择控件的特殊处理
     * @param obj 控件配置
     * @param array
     * @param _this
     */
    processDataSourceControl(obj, array, _this) {
        let temp = _this.KHUtils.clone(obj);
        temp.type = obj.type;
        temp.model = temp.label_model;
        temp.name = temp.label_name;
        array.push(temp);
        let temp2 = _this.KHUtils.clone(obj);
        temp2.type = obj.type;
        temp2.name = obj.key_name;
        array.push(temp2);
    },
    /**
     * GIS控件的特殊处理
     * @param obj 控件配置
     * @param array
     * @param _this
     */
    processGisControl(obj, array, _this) {
        let temp = _this.KHUtils.clone(obj);
        temp.type = obj.type;
        temp.model = temp.modelExt.lat;
        temp.name = "纬度";
        array.push(temp);
        let temp2 = _this.KHUtils.clone(obj);
        temp2.type = obj.type;
        temp2.model = temp.modelExt.lnt;
        temp2.name = "经度";
        array.push(temp2);
        let temp3 = _this.KHUtils.clone(obj);
        temp3.type = obj.type;
        temp3.model = temp.modelExt.address;
        temp3.name = "详细地址";
        array.push(temp3);
    },
    /**
     *行政区划控件的特殊处理
     * @param obj
     * @param array
     * @param _this
     */
    processRegionControl(obj, array, _this) {
        let temp = _this.KHUtils.clone(obj);
        temp.type = obj.type;
        temp.model = temp.modelExt.province;
        temp.name = "省份";
        array.push(temp);
        let temp2 = _this.KHUtils.clone(obj);
        temp2.type = obj.type;
        temp2.model = temp2.modelExt.city;
        temp2.name = "地市";
        array.push(temp2);
        let temp3 = _this.KHUtils.clone(obj);
        temp3.type = obj.type;
        temp3.model = temp3.modelExt.area;
        temp3.name = "区县";
        array.push(temp3);
    },
    /**
     * 自定义表单格式化列表数据
     * @param row
     * @param column
     * @param _this
     * @returns {string|*}
     */
    formatCustom(row, column, _this) {
        let key = column.property;
        if (_this.dynCols instanceof Array) {
            let formatVal = "";
            _this.dynCols.forEach(dc => {
                if (key === dc.model) {
                    if (dc.type === 'switch') {
                        let val = row[key];
                        if ("0" === val) {
                            formatVal = _this.KHUtils.isNull(_this.switchMsgObj[key][0]) ? "已开启" : _this.switchMsgObj[key][0];
                        } else {
                            formatVal = _this.KHUtils.isNull(_this.switchMsgObj[key][1]) ? "已开启" : _this.switchMsgObj[key][1];
                        }
                    }
                    if (dc.type === 'datetime') {
                        let val = row[key];
                        if (val != null && val !== '' && val.indexOf(".") > -1) {
                            formatVal = val.split('.')[0];
                        } else {
                            formatVal = row[key];
                        }
                    }
                    if (dc.type === 'select') {
                        if (_this.KHUtils.isNull(row[key])) {
                            formatVal = row[key];
                        }
                        // 下拉框,是否配置属性,显示格式化
                        let flag = "";
                        if (_this.formConfig) {
                            findSelect(key, _this.formConfig.list);
                        }

                        function findSelect(key, list) {
                            for (let j = 0, m = list.length; j < m; j++) {
                                let temp = list[j];
                                if ("grid" === temp.type) {
                                    for (let i = 0; i < temp.columns.length; i++) {
                                        findSelect(key, temp.columns[i].list);
                                    }
                                }
                                if (temp.type !== 'select') {
                                    continue;
                                }
                                if (key === temp.model && temp.options.showLabel) {
                                    temp.options.options.forEach(obj => {
                                        if (row[key] === obj.value) {
                                            flag = obj.label;
                                        }
                                    });
                                }
                            }
                        }

                        if (flag === null || flag === '' || flag === undefined) {
                            formatVal = row[key];
                        }
                        formatVal = flag;
                    }
                    if (dc.type === 'radio') {
                        if (_this.KHUtils.isNull(row[key])) {
                            formatVal = row[key];
                        }
                        // 下拉框,是否配置属性,显示格式化
                        let flag = "";
                        findRadio(key, _this.formConfig.list);

                        function findRadio(key, list) {
                            for (let j = 0, m = list.length; j < m; j++) {
                                let temp = list[j];
                                if ("grid" === temp.type) {
                                    for (let i = 0; i < temp.columns.length; i++) {
                                        findRadio(key, temp.columns[i].list);
                                    }
                                }
                                if (temp.type !== 'radio') {
                                    continue;
                                }
                                if (key === temp.model && temp.options.showLabel) {
                                    temp.options.options.forEach(obj => {
                                        if (row[key] === obj.value) {
                                            flag = obj.label;
                                        }
                                    });
                                }
                            }
                        }

                        if (flag === null || flag === '' || flag === undefined) {
                            formatVal = row[key];
                        }
                        formatVal = flag;
                    }
                    if (dc.type === 'checkbox') {
                        if (_this.KHUtils.isNull(row[key])) {
                            formatVal = row[key];
                        }
                        // 下拉框,是否配置属性,显示格式化
                        let flag = "";
                        findCheckbox(key, _this.formConfig.list);

                        function findCheckbox(key, list) {
                            for (let j = 0, m = list.length; j < m; j++) {
                                let temp = list[j];
                                if ("grid" === temp.type) {
                                    for (let i = 0; i < temp.columns.length; i++) {
                                        findCheckbox(key, temp.columns[i].list);
                                    }
                                }
                                if (temp.type !== 'checkbox') {
                                    continue;
                                }
                                if (key === temp.model && temp.options.showLabel) {
                                    if (row[key] === undefined || row[key] === null || row[key] === '') {
                                        flag = '';
                                    } else {
                                        let arr = row[key].split(",");
                                        if (arr instanceof Array && arr.length > 0) {
                                            arr.forEach(ar => {
                                                temp.options.options.forEach((obj, index) => {
                                                    if (ar === obj.value) {
                                                        flag += obj.label + ",";
                                                    }
                                                });
                                            })
                                        }
                                    }
                                }
                            }
                        }

                        if (flag === null || flag === '' || flag === undefined) {
                            formatVal = row[key];
                        }
                        formatVal = flag;
                    }
                    if (dc.type === 'multiple_select') {
                        if (_this.KHUtils.isNull(row[key])) {
                            formatVal = row[key];
                        }
                        // 下拉框,是否配置属性,显示格式化
                        let flag = "";
                        findMultipleSelect(key, _this.formConfig.list);

                        function findMultipleSelect(key, list) {
                            for (let j = 0, m = list.length; j < m; j++) {
                                let temp = list[j];
                                if ("grid" === temp.type) {
                                    for (let i = 0; i < temp.columns.length; i++) {
                                        findMultipleSelect(key, temp.columns[i].list);
                                    }
                                }
                                if (temp.type !== 'multiple_select') {
                                    continue;
                                }
                                if (key === temp.model && temp.options.showLabel) {
                                    if (row[key] === undefined || row[key] === null || row[key] === '') {
                                        flag = '';
                                    } else {
                                        let arr = row[key].split(",");
                                        if (arr instanceof Array && arr.length > 0) {
                                            arr.forEach(ar => {
                                                temp.options.options.forEach((obj, index) => {
                                                    if (ar === obj.value) {
                                                        flag += obj.label + ",";
                                                    }
                                                });
                                            })
                                        }
                                    }
                                }
                            }
                        }

                        if (flag === null || flag === '' || flag === undefined) {
                            formatVal = row[key];
                        }
                        formatVal = flag;
                    }
                    if (dc.type === 'm_data_select' || dc.type === 'm_org_select' || dc.type === 'm_user_select' || dc.type === 'm_role_select' || dc.type === 'm_company_select' || dc.type === 'm_dic_select' || dc.type === 'm_data_ref') {

                        if (row[key] && Array.isArray(JSON.parse(row[key]))) {
                            JSON.parse(row[key]).forEach(obj => {
                                if (!formatVal) {
                                    formatVal = obj.v
                                } else {
                                    formatVal = formatVal + '、' + obj.v
                                }
                            })
                        }

                    }
                    if(dc.type === "calculate_formula"){
                        let value = row[key];
                        formatVal = _this.KHForm.getCalculateFormulaValue(dc,value,_this);
                    }
                }
            });
            if (formatVal === null || formatVal === '' || formatVal === undefined) {
                return row[key];
            }
            return formatVal;
        }
    },

    getCalculateFormulaValue(box,value,_this){
        if(_this.KHUtils.isNull(value) || isNaN(value)){
            return null;
        }
        let formula =box.options.formula;
        let type = formula.type;
        if(type == "number"){
            return value;
        }else if(type == "year"){
            return  value +"年";
        }else if(type == "year_month"){
            return  value +"月";
        }else if(type == "month"){
            return  value +"月";
        }else if(type == "time"){
            return _this.KHForm.formatDays( value)
        }else if(type == "date"){
            return  value +"天";
        }else if(type == "datetime"){
            return _this.KHForm.formatDays(value)
        }
    },
    //value 单位是秒
    formatDays(value) {
        var theTime = parseInt(value);// 需要转换的时间秒
        if(theTime == 0){
            return 0;
        }
        var theTime1 = 0;// 分
        var theTime2 = 0;// 小时
        var theTime3 = 0;// 天
        if(theTime >= 60) {
            theTime1 = parseInt(theTime/60);
            theTime = parseInt(theTime%60);
            if(theTime1 >= 60) {
                theTime2 = parseInt(theTime1/60);
                theTime1 = parseInt(theTime1%60);
                if(theTime2 >= 24){
                    //大于24小时
                    theTime3 = parseInt(theTime2/24);
                    theTime2 = parseInt(theTime2%24);
                }
            }
        }
        var result = '';
        if(theTime > 0){
            result = ""+parseInt(theTime)+"秒";
        }
        if(theTime1 > 0) {
            result = ""+parseInt(theTime1)+"分"+result;
        }
        if(theTime2 > 0) {
            result = ""+parseInt(theTime2)+"小时"+result;
        }
        if(theTime3 > 0) {
            result = ""+parseInt(theTime3)+"天"+result;
        }
        return result;
    },
    /**
     * 自定义表单查询条件处理
     * @param data  表单提交数据
     * @param param 返回的参数
     * @param _this
     */
    processCond(data, param, _this) {
        // 定义的查询条件
        Object.keys(data).forEach(function (key) {
            if (null !== data[key] && data[key] !== '' && undefined !== data[key] && "&nbsp" !== data[key]) {
                _this.queryConditions.forEach(qc => {
                    if (key === qc.key) {
                        let newObj = {};
                        newObj.key = key;
                        newObj.type = qc.opt;
                        if ("$in" === qc.opt) {
                            // 范围查询
                            if (data[key] instanceof Array && data[key].length === 2) {
                                // 日期时间选择组件
                                newObj.bvalue = switchTimeFormat(data[key][0]);
                                newObj.evalue = switchTimeFormat(data[key][1]);

                                function switchTimeFormat(time) {
                                    let dateTime = new Date(time);
                                    let year = dateTime.getFullYear();
                                    let month = dateTime.getMonth() + 1;
                                    let date = dateTime.getDate();
                                    let hour = dateTime.getHours();
                                    let minute = dateTime.getMinutes();
                                    let second = dateTime.getSeconds();

                                    function addZero(v) {
                                        return v < 10 ? '0' + v : v
                                    }

                                    return year + '-' + addZero(month) + '-' + addZero(date) + " " + addZero(hour) + ':' + addZero(minute) + ':' + addZero(second);
                                }
                            } else {
                                data[key] = data[key].toString();
                                if (data[key].indexOf("&nbsp") !== -1) {
                                    newObj.bvalue = data[key].split("&nbsp")[0];
                                    newObj.evalue = data[key].split("&nbsp")[1];
                                }
                            }
                        } else {
                            let tempDynCols = [];
                            for (let i = 0, n = _this.condFormConfig.list.length; i < n; i++) {
                                let obj = _this.condFormConfig.list[i];
                                if ("grid" === obj.type) {
                                    loop(obj, tempDynCols, _this);

                                    function loop(obj, arr, _this) {
                                        let columns = obj.columns;
                                        for (let j = 0, m = columns.length; j < m; j++) {
                                            let colObj = columns[j];
                                            colObj.list.forEach(lsObj => {
                                                arr.push(lsObj);
                                                if ("grid" === lsObj.type) {
                                                    loop(obj, _this);
                                                }
                                            })
                                        }
                                    }
                                }
                            }
                            let str = "";
                            if (tempDynCols instanceof Array) {
                                tempDynCols.forEach(dc => {
                                    let compareKey = dc.model;
                                    if (key === compareKey) {
                                        if (dc.type === 'checkbox' || dc.type === 'multiple_select') {
                                            if (data[compareKey] instanceof Array && data[compareKey].length > 0) {
                                                for (let i = 0, n = data[compareKey].length; i < n; i++) {
                                                    str += data[compareKey][i] + ",";
                                                }
                                                //去掉最后一个逗号(如果不需要去掉,就不用写)
                                                if (str.length > 0) {
                                                    str = str.substr(0, str.length - 1);
                                                }
                                            } else {
                                                str = "";
                                            }
                                        } else {
                                            str = data[key];
                                        }
                                    }
                                })
                            }
                            newObj.value = str;
                        }
                        param.push(newObj);
                    }
                })
            }
        });
        // 自定义查询条件处理,前端开发人员自己自定义的
        _this.queryConditions.forEach(qc => {
            let flag = true;
            Object.keys(data).forEach(function (key) {
                if (key === qc.key) {
                    flag = false;
                }
            });
            if (flag) {
                param.push(qc);
            }
        })
    },
    /**
     * 处理高级设置
     * @param _this
     * @returns {boolean}
     */
    processAdvancedSetting(_this) {
        // 初始化查询条件、结果数据
        if (_this.KHUtils.isNull(_this.formConfig)) {
            return false;
        }
        if (_this.KHUtils.isNull(_this.formConfig.list)) {
            return false;
        }
        if (_this.KHUtils.isNull(_this.formConfig.sensorSettings)) {
            _this.colsArray = _this.KHUtils.clone(_this.dynCols);
            _this.isShowFunAdd = true;
            _this.isShowFunRemove = true;
            _this.isShowOpt = true;
            _this.isShowSeq = true;
            _this.isShowChecked = true;
            _this.isShowOptEdit = true;
            return false;
        }
        let sensorSettings = _this.formConfig.sensorSettings;
        // 查询条件处理
        _this.queryConditions = [];
        if (!_this.KHUtils.isNull(sensorSettings.queryConditions)) {
            _this.KHForm.previewCondSet(sensorSettings.queryConditions, _this);
            _this.queryConditions = sensorSettings.queryConditions;
        }
        // 功能按钮处理
        _this.isShowChecked = false;
        _this.isShowFunAdd = false;
        _this.isShowFunRemove = false;
        _this.isShowFunImport = false;
        _this.isShowFunExport = false;
        if (!_this.KHUtils.isNull(sensorSettings.functionButtons)) {
            sensorSettings.functionButtons.forEach(fb => {
                let key = fb.key;
                if ("remove" === key || "import" === key || "export" === key) _this.isShowChecked = true;
                if ("add" === key) _this.isShowFunAdd = true;
                if ("remove" === key) _this.isShowFunRemove = true;
                if ("import" === key) _this.isShowFunImport = true;
                if ("export" === key) _this.isShowFunExport = true;
            })
        }
        // 查询结果处理
        _this.colsArray = [];
        _this.dynCols.forEach(dc => {
            let temp = _this.KHUtils.clone(dc);
            _this.colsArray.push(temp);
        });
        _this.isShowSeq = false;
        _this.isShowOpt = false;
        if (!_this.KHUtils.isNull(sensorSettings.queryResults)) {
            let tempArray = [];
            sensorSettings.queryResults.forEach(qr => {
                let key = qr.key;
                _this.colsArray.forEach(obj => {
                    if (key === obj.model) {
                        let tempObj = _this.KHUtils.clone(obj);
                        tempObj.isJump = qr.isJump;
                        tempObj.jumpInfo = qr.jumpInfo;
                        tempArray.push(tempObj);
                        if (qr.jumpInfo) {
                            // 组件方式弹窗的形式
                            // urlType:0 组件方式; urlType:1
                            // Url路径 Vue.component("CustomUpload",require(`../components/CustomUpload`).default);
                            if (qr.jumpInfo.urlType === '0') {
                                let temp = qr.jumpInfo.url;
                                let componentName = temp.substring(temp.lastIndexOf('/') + 1, temp.length);
                                _this.KHForm.registerComponent(componentName, qr.jumpInfo.url);
                            }
                        }
                    }
                    if (key === '$seq') {
                        _this.isShowSeq = true;
                    }
                    if (key === '$opt') {
                        _this.isShowOpt = true;
                    }
                })
            });
            _this.colsArray = tempArray;
        }
        // 操作按钮处理
        _this.isShowOptEdit = false;
        _this.isShowOptDelete = false;
        if (!_this.KHUtils.isNull(sensorSettings.optButtons)) {
            _this.customOptList = [];
            sensorSettings.optButtons.forEach(fb => {
                if ("edit" === fb.key) {
                    _this.isShowOptEdit = true;
                }
                if ("delete" === fb.key) {
                    _this.isShowOptDelete = true;
                }
                if ("edit" !== fb.key && "delete" !== fb.key) {
                    let temp = _this.KHUtils.clone(fb);
                    if (temp.jumpInfo.urlType) {
                        if (temp.jumpInfo.urlType === '0') {
                            let componentName = temp.jumpInfo.url.substring(temp.jumpInfo.url.lastIndexOf('/') + 1, temp.jumpInfo.url.length);
                            _this.KHForm.registerComponent(componentName, temp.jumpInfo.url);
                        }
                        if (temp.imageId && !_this.KHUtils.isNull(temp.imageId)) {
                            temp.imageId = _this.khConfig.host.rest + _this.khConfig.api.imageDownload + "/" + fb.imageId;
                            if (temp.jumpInfo) {
                                // 组件方式弹窗的形式
                                // urlType:0 组件方式; urlType:1
                                // Url路径 Vue.component("CustomUpload",require(`../components/CustomUpload`).default);
                                temp.isImage = true;
                            }
                        } else {
                            temp.isImage = false;
                            temp.imageId = temp.jumpInfo.label ? temp.jumpInfo.label : temp.label;
                        }
                        _this.customOptList.push(temp);
                    }
                }
            })
        }
    },
    /**
     * 渲染查询条件设置
     * @param queryConditions
     * @param _this
     * @returns {boolean}
     */
    previewCondSet(queryConditions, _this) {
        if (queryConditions.length === 0) {
            return false;
        }
        // 预览查询条件设置
        _this.condFormConfig = {
            list: [],
            config: {
                labelWidth: _this.formConfig.config.labelWidth ? _this.formConfig.config.labelWidth : 100 + 'px',
                labelPosition: 'right',
                size: 'small'
            },
        };
        if (_this.formConfig.sensorSettings) {
            if (_this.formConfig.sensorSettings.queryLayout) {
                if (!_this.KHUtils.isNull(_this.formConfig.sensorSettings.queryLayout)) {
                    _this.condColumnSet = _this.formConfig.sensorSettings.queryLayout.cols;
                }
            }
        }
        let row = Math.ceil(queryConditions.length / _this.condColumnSet); // 根据列,条件设置的总数计算出共需要多少行
        let array = [];  // 条件设置所对应表单设计的对象集合
        queryConditions.forEach(qc => {
            _this.dynCols.forEach(obj => {
                if (obj.model === qc.key) {
                    if ("$in" === qc.opt) {
                        obj.query_range = true;   // 范围查询
                    }
                    let temp = _this.KHUtils.clone(obj);
                    array.push(temp);
                }
            });
        });
        let index = 0;
        let span = 90 / _this.condColumnSet + '%';
        for (let i = 0; i < row; i++) {
            let currentMis = (new Date()).valueOf();
            let grid = {
                type: "grid",
                name: "栅格布局" + i,
                icon: "icon-grid",
                columns: [],
                options: {
                    gutter: 0,
                    justify: "start",
                    align: "top"
                },
                model: "grid" + currentMis + "_98622" + i,
                rules: [],
                key: currentMis + "_98622" + i,
                show: true
            };
            for (let j = 0; j < _this.condColumnSet; j++) {
                let column = {
                    span: span,
                    list: []
                };
                if (index < array.length) {
                    array[index].rules = [];
                    if ((array[index].type === 'datetime' || array[index].type === 'date') && array[index].query_range) {
                        array[index].type = 'datetime_range';
                    } else if (array[index].query_range && (array[index].type !== 'datetime' && array[index].type !== 'date')) {
                        array[index].type = 'input_range';
                    }
                    if (array[index].options.width) {
                        array[index].options.width = '80%';
                    }
                    array[index].show = true;
                    column.list.push(array[index]);
                    grid.columns.push(column);
                }
                index++;
            }
            _this.condFormConfig.list.push(grid);
        }
        let queryBtnObj = {
            span: span,
            "list": [
                {
                    "icon": "icon-input",
                    "key": "01",
                    "model": "input_01",
                    "name": "",
                    "options": {
                        "dataType": "string",
                        "defaultValue": "",
                        "disabled": false,
                        "isControlled": false,
                        "pattern": "",
                        "placeholder": "",
                        "required": false,
                        "width": "80%"
                    },
                    "rules": [],
                    "type": "query",
                    "show": true
                }
            ]
        };
        let len = _this.condFormConfig.list.length;
        let lastGrid = _this.condFormConfig.list[len - 1];
        let currentMis = new Date().getTime();
        if (lastGrid.columns.length === _this.condColumnSet) {
            _this.condFormConfig.list.push({
                "type": "grid",
                "name": "栅格布局" + currentMis,
                "icon": "icon-grid",
                "columns": [
                    {
                        "span": span,
                        "list": [
                            {
                                "icon": "icon-input",
                                "key": "01",
                                "model": "input_01",
                                "name": "",
                                "options": {
                                    "dataType": "string",
                                    "defaultValue": "",
                                    "disabled": false,
                                    "isControlled": false,
                                    "pattern": "",
                                    "placeholder": "",
                                    "required": false,
                                    "width": "80%"
                                },
                                "rules": [],
                                "type": "query",
                                "show": true
                            }
                        ]
                    }
                ],
                "options": {
                    "gutter": 0,
                    "justify": "start",
                    "align": "top"
                },
                "model": "grid" + currentMis,
                "rules": [],
                "key": currentMis,
                "show": true
            });
        } else {
            lastGrid.columns.push(queryBtnObj);
        }
        // console.log("condFormConfig :" + JSON.stringify(_this.condFormConfig));
        _this.condSetHackRest = false;
        // 重新渲染子组件
        _this.$nextTick(() => {
            _this.condSetHackRest = true
        });
    },

    /**
     *
     * @param _this
     * @param formId
     * @param showType
     * @returns {boolean}
     */
    loadFormConf(_this, formId, showType) {
        if (_this.KHUtils.isNull(formId)) {
            // 从当前路由获取formId /custom/45
            let currentPath = _this.$router.currentRoute.path;
            currentPath = currentPath.replace(/^\s*|\s*$/g, "");
            _this.formId = currentPath.substring(currentPath.lastIndexOf('/') + 1, currentPath.length);
        } else {
            _this.formId = formId;
        }
        if (!_this.KHUtils.isNumber(_this.formId)) {
            _this.$notify.error({
                title: '错误',
                message: '路由formId不为字符串:' + currentPath
            });
            return false;
        }
        _this.dynCols = [];
        _this.allCols = [];
        _this.tableFormConfig = [];
        // 根据formId查询表单配置
        _this.$Get(_this.khConfig.api.getFormConf + "/" + _this.formId).then(res => {
            if (res.errCode === 0) {
                if (!_this.KHUtils.isNull(res.formConf)) {
                    _this.formConfig = JSON.parse(res.formConf.formMeta);
                    if (_this.KHUtils.isNull(_this.formConfig)) {
                        _this.$notify.warning({
                            title: '警告',
                            message: "表单ID(" + _this.formId + "): 暂未进行相关的表单设计"
                        });
                    }
                    let tempConfig = JSON.parse(res.formConf.formMeta);
                    if (!tempConfig || _this.KHUtils.isNull(tempConfig.list)) {
                        return false;
                    }
                    // 遍历配置
                    for (let i = 0, n = tempConfig.list.length; i < n; i++) {
                        let obj = tempConfig.list[i];
                        if ("grid" === obj.type) {
                            loop(obj, _this.dynCols, _this);
                            loopAll(obj, _this.allCols, _this);

                            function loop(obj, arr, _this) {
                                let columns = obj.columns;
                                for (let j = 0, m = columns.length; j < m; j++) {
                                    let colObj = columns[j];
                                    colObj.list.forEach(lsObj => {
                                        if (lsObj.type === 'switch') {
                                            _this.switchMsgObj[lsObj.model] = [lsObj.options.openMsg, lsObj.options.closeMsg];
                                        }
                                        if (lsObj.type === 'data_select' || lsObj.type === 'org_select'
                                            || lsObj.type === 'user_select'
                                            || lsObj.type === 'company_select'
                                            || lsObj.type === 'role_select'
                                            || lsObj.type === 'dic_select'
                                            || lsObj.type === 'current_user') {
                                            _this.KHForm.processDataSourceControl(lsObj, arr, _this);
                                        } else if (lsObj.type === 'gis_select') {
                                            _this.KHForm.processGisControl(lsObj, arr, _this);
                                        } else if (lsObj.type === 'region_select') {
                                            _this.KHForm.processRegionControl(lsObj, arr, _this);
                                        } else {
                                            arr.push(lsObj);
                                        }
                                        if ("grid" === lsObj.type) {
                                            loop(obj, _this);
                                        }
                                    })
                                }
                            }

                            function loopAll(obj, arr, _this) {
                                let columns = obj.columns;
                                for (let j = 0, m = columns.length; j < m; j++) {
                                    let colObj = columns[j];
                                    colObj.list.forEach(lsObj => {
                                        arr.push(lsObj);
                                        if ("grid" === lsObj.type) {
                                            loop(obj, _this);
                                        }
                                    })
                                }
                            }
                        } else if ("table" === obj.type) {
                            _this.tableFormConfig.push(obj);      // 子表单独立组件显示
                            if (_this.tableFormConfig.length > 0) {
                                _this.formActiveName = _this.tableFormConfig[0].model;
                            }
                        } else {
                            _this.allCols.push(obj);
                            if (obj.type === 'switch') {
                                _this.switchMsgObj[obj.model] = [obj.options.openMsg, obj.options.closeMsg];
                            }
                            if (obj.type === 'data_select' || obj.type === 'org_select'
                                || obj.type === 'user_select'
                                || obj.type === 'company_select'
                                || obj.type === 'role_select'
                                || obj.type === 'dic_select') {
                                _this.KHForm.processDataSourceControl(obj, _this.dynCols, _this);
                            } else if (obj.type === 'gis_select') {
                                _this.KHForm.processGisControl(obj, _this.dynCols, _this);
                            } else if (obj.type === 'region_select') {
                                _this.KHForm.processRegionControl(obj, _this.dynCols, _this);
                            } else {
                                _this.dynCols.push(obj);
                            }
                        }
                    }
                    _this.KHForm.processAdvancedSetting(_this);
                    if (!_this.KHUtils.isNull(showType)) {
                        if (showType === 'AddFormCustom') {
                            _this.KHForm.handleAdd(_this); // 如果是AddFormCustom,通过路由直达新增页面,则加载表单配置时直接打开新增页面
                        } else if (showType === 'ViewFormCustom') {
                            _this.handleView(); // 如果是ViewFormCustom,跳转配置直接查看关联的信息
                        }
                    }
                } else {
                    _this.$notify.warning({
                        title: '警告',
                        message: "表单ID(" + _this.formId + "): 暂未进行相关的表单设计"
                    });
                }
            }
        });
    },
    /**
     * 配置自定义跳转
     * @param row
     * @param config
     * @param _this
     * @returns {boolean}
     */
    handleCustomJump(row, config, _this) {
        
        if (!config.jumpInfo) {
            _this.$message.warning("跳转配置为空");
            return false;
        }
        _this.customUrl = "";       // 指定跳转的URL
        _this.customProps = {};        // 子组件参数
        _this.customComponent = "";    // 子组件名称
        // 外部链接跳转不携带任何参数
        if (config.jumpInfo.jumpType && "1" === config.jumpInfo.jumpType) {
            let tempUrl = config.jumpInfo.url;
            if (_this.KHUtils.isNull(tempUrl)) {
                _this.$message.warning("跳转跳转的外部链接地址为空");
                return false;
            }
            if (config.jumpInfo.type && '0' === config.jumpInfo.type) {
                // 弹窗模式处理
                _this.customTitle = config.jumpInfo.dialogTitle ? config.jumpInfo.dialogTitle : config.jumpInfo.label; // 弹窗标题
                _this.jumpDialogFullscreen = config.jumpInfo.dialogFullscreen === '1'; // 是否全屏
                _this.jumpDialogTop = config.jumpInfo.dialogTop;
                _this.jumpDialogHeight = config.jumpInfo.dialogHeight;
                if(_this.jumpDialogFullscreen){
                    _this.iframeHeight = document.body.clientHeight * 1 + 'px';
                }
                if (!_this.KHUtils.isNull(config.jumpInfo.dialogWidth)) {
                    _this.jumpDialogWidth = config.jumpInfo.dialogWidth; // 是否全屏
                }
                _this.customVisible = true;
            } else {
                if (config.jumpInfo.type === '1') {
                    // 当前页跳转处理
                    window.location.href = tempUrl;
                } else {
                    // 新窗口打开处理
                    window.open(tempUrl);
                }
            }
            _this.customUrl = tempUrl;
        } else {
            // 参数跳转默认弹窗 type:[0 弹窗 ; 1 当前页跳转 ;2 新窗口跳转]
            if (config.jumpInfo.type && '0' === config.jumpInfo.type || (  config.jumpInfo.urlType=="0" && config.jumpInfo.type == "1") ) {
                // 弹窗模式处理
                _this.customTitle = config.jumpInfo.dialogTitle ? config.jumpInfo.dialogTitle : config.jumpInfo.label; // 弹窗标题
                _this.jumpDialogFullscreen = config.jumpInfo.dialogFullscreen === '1'; // 是否全屏
                _this.jumpDialogTop = config.jumpInfo.dialogTop;
                _this.jumpDialogHeight = config.jumpInfo.dialogHeight;
                if(_this.jumpDialogFullscreen){
                    _this.iframeHeight = document.body.clientHeight * 1 + 'px';
                }
                if (!_this.KHUtils.isNull(config.jumpInfo.dialogWidth)) {
                    _this.jumpDialogWidth = config.jumpInfo.dialogWidth; // 设置弹窗宽度
                }
                // 组件的方式 Or Url方式 [0 组件方式;1 Url路径;2 API接口]
                if (_this.KHUtils.isNull(config.jumpInfo.urlType)) {
                    config.jumpInfo.urlType = '0'; // 默认以组件的方式
                }
                if (config.jumpInfo.urlType === '0') {
                    // 组件方式
                    if (config.jumpInfo.params instanceof Array) {
                        config.jumpInfo.params.forEach(obj => {
                            let val = "";
                            let type = obj.type;
                            if(!_this.KHUtils.isNull(type) && type =='1'){
                                //固定值
                                val = obj.model;
                            }else {
                                //控件值
                                if(row){
                                    val = _this.KHUtils.isInvalidValue(row[obj.model]) ? "" : row[obj.model];
                                }else {
                                    val = obj.model;
                                }
                            }


                            let param = obj.paramName;
                            _this.customProps[param] = val;   // 子组件接收参数处理
                        });
                        let temp = config.jumpInfo.url;
                        let componentName = temp.substring(temp.lastIndexOf('/') + 1, temp.length); // 组件名称
                        _this.KHForm.registerComponent(componentName, temp);
                        _this.customComponent = componentName;
                        _this.customHackSet = false;
                        if (!_this.KHUtils.isNull(config.jumpInfo.formId)) {
                            _this.customProps.formId = config.jumpInfo.formId;   // 自定义表单formId处理
                        }
                        _this.$nextTick(() => {
                            _this.customHackSet = true;   // 重新渲染子组件
                        });
                    }
                    _this.customVisible = true;
                } else if (config.jumpInfo.urlType === '1') {
                    // URL,以iframe嵌入
                    let tempUrl = _this.KHUtils.isNull(config.jumpInfo.url) ? "" : config.jumpInfo.url;
                    if (config.jumpInfo.params instanceof Array && config.jumpInfo.params.length >0) {
                        tempUrl += "?";
                        config.jumpInfo.params.forEach((obj, index) => {
                            let val = "";
                            let type = obj.type;
                            if(!_this.KHUtils.isNull(type) && type =='1'){
                                //固定值
                                val = obj.model;
                            }else {
                                //控件值
                                if(row){
                                    val = _this.KHUtils.isInvalidValue(row[obj.model]) ? "" : row[obj.model];
                                }else {
                                    val = obj.model;
                                }
                            }
                            let param = obj.paramName;
                            if (0 === index) {
                                tempUrl += param + '=' + val;
                            } else {
                                tempUrl += '&' + param + '=' + val;
                            }
                        })
                    }
                    _this.customUrl = tempUrl;
                    console.log("地址：", _this.customUrl);
                    _this.customVisible = true;
                } else if (config.jumpInfo.urlType === '2' || config.jumpInfo.urlType === '3') {
                    // API接口调用
                    let interUrl = config.jumpInfo.url;
                    if (_this.KHUtils.isNull(interUrl)) {
                        _this.$message.error("API接口地址为空,请重新配置！");
                        return false;
                    }

                    if (config.jumpInfo.respParamSet instanceof Array && config.jumpInfo.respParamSet.length > 0) {
                        let requestMethod = config.jumpInfo.requestMethod;
                        if ("post" === requestMethod) {
                            let paramArray = [];
                            if(config.jumpInfo.urlType === '2'){
                                config.jumpInfo.params.forEach(obj => {
                                    let val = "";
                                    let type = obj.type;
                                    if(!_this.KHUtils.isNull(type) && type =='1'){
                                        //固定值
                                        val = obj.model;
                                    }else {
                                        //控件值
                                        if(row){
                                            val = _this.KHUtils.isInvalidValue(row[obj.model]) ? "" : row[obj.model];
                                        }else {
                                            val = obj.model;
                                        }
                                    }
                                    let param = obj.paramName;
                                    paramArray.push(param + "=" + val);
                                });
                            }else if(config.jumpInfo.urlType === '3'){
                                config.jumpInfo.params.forEach(obj => {
                                    let val = obj.paramValue;
                                    let param = obj.paramName;
                                    paramArray.push(param + "=" + val);
                                });
                                paramArray.push("id=" + row.id);
                                interUrl = interUrl +"/"+_this.formId;
                            }

                            paramArray = paramArray.join("&");
                            _this.$Post(interUrl, paramArray)
                                .then(res => {
                                    if (res[config.jumpInfo.respParamSet[0].errCode] === 0) {
                                        _this.$message.success(res[config.jumpInfo.respParamSet[0].errMsg]);
                                        _this.listData();
                                        return false;
                                    }
                                    _this.$message.error(res[config.jumpInfo.respParamSet[0].errMsg]);
                                })
                        } else {
                            if(config.jumpInfo.urlType === '2'){
                                config.jumpInfo.params.forEach(obj => {
                                    let val = "";
                                    let type = obj.type;
                                    if(!_this.KHUtils.isNull(type) && type =='1'){
                                        //固定值
                                        val = obj.model;
                                    }else {
                                        //控件值
                                        if(row){
                                            val = _this.KHUtils.isInvalidValue(row[obj.model]) ? "" : row[obj.model];
                                        }else {
                                            val = obj.model;
                                        }
                                    }
                                    let param = obj.paramName;
                                    _this.customProps[param] = val;
                                });

                            }else if(config.jumpInfo.urlType === '3'){
                                config.jumpInfo.params.forEach(obj => {
                                    let val = obj.paramValue;
                                    let param = obj.paramName;
                                    _this.customProps[param] = val;
                                });
                                //_this.customProps.formId = _this.formId;
                                interUrl = interUrl +"/"+_this.formId;
                            }

                            _this.$Get(interUrl, _this.customProps)
                                .then(res => {
                                    if (res[config.jumpInfo.respParamSet[0].errCode] === 0) {
                                        _this.$message.success(res[config.jumpInfo.respParamSet[0].errMsg]);
                                        _this.listData();
                                        return false;
                                    }
                                    _this.$message.error(res[config.jumpInfo.respParamSet[0].errMsg]);
                                })
                        }
                    } else {
                        _this.$message.error("API调用接口返回参数设置为空,请重新配置！");
                    }
                }
            } else {
                _this.customTitle = config.jumpInfo.dialogTitle ? config.jumpInfo.dialogTitle : config.jumpInfo.label; // 弹窗标题
                
                if (_this.KHUtils.isNull(config.jumpInfo.url)) {
                    return false;
                }
                // Url路径方式,参数以拼接的方式处理
                let tempUrl = config.jumpInfo.url;
                if (config.jumpInfo.params instanceof Array) {
                    tempUrl += "?";
                    config.jumpInfo.params.forEach((obj, index) => {
                        let val = "";
                        let type = obj.type;
                        if(!_this.KHUtils.isNull(type) && type =='1'){
                            //固定值
                            val = obj.model;
                        }else {
                            //控件值
                            if(row){
                                val = _this.KHUtils.isInvalidValue(row[obj.model]) ? "" : row[obj.model];
                            }else {
                                val = obj.model;
                            }
                        }
                        let param = obj.paramName;
                        if (0 === index) {
                            tempUrl += param + '=' + val;
                        } else {
                            tempUrl += '&' + param + '=' + val;
                        }
                    })
                }
                console.log("跳转拼接的URL:" + tempUrl + "");
                if (config.jumpInfo.type === '1') {
                    // 当前页跳转处理
                    window.location.href = tempUrl;
                } else {
                    // 新窗口打开处理
                    window.open(tempUrl);
                }
            }
        }
    },
    /**
     * 新增表单业务数据
     * @param _this
     */
    handleAdd(_this) {
        _this.editFormVisible = true;
        _this.parentSaveDisable = false;
        _this.businessId = "";
        _this.hackReset = false;
        _this.formTitle = "新增";
        _this.addOrEdit = true;
        _this.dataModels = {};
        // 新增页面设置处理
        _this.addShowNormal = true;
        _this.parentFormId = _this.formId;
        _this.parentBusinessId = 0;
        if (_this.formConfig.sensorSettings) {
            if (_this.formConfig.sensorSettings.addShowType) {
                let addShowType = _this.formConfig.sensorSettings.addShowType;
                if ("normal" === addShowType) {
                    _this.addShowNormal = false;
                    _this.normalHackReset = false;
                    // 重新渲染子组件
                    _this.$nextTick(() => {
                        _this.normalHackReset = true
                    })
                }
            }
        }
        if (_this.addShowNormal) {
            _this.editFormVisible = true;
        }
        // 重新渲染子组件
        _this.$nextTick(() => {
            _this.hackReset = true
        })
    },
    /**
     * 编辑表单业务数据
     * @param row
     * @param _this
     * @returns {boolean}
     */
    handleEdit(row, _this) {
        let tempRow = _this.KHUtils.clone(row);
        _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
        _this.formTitle = "编辑";
        _this.parentSaveDisable = false;
        _this.editFormVisible = true;
        _this.dataModels = tempRow;
        _this.businessId = row.id;
        _this.addOrEdit = false;
        _this.hackReset = false;
        // 新增页面设置处理
        _this.addShowNormal = true;
        if (_this.formConfig.sensorSettings) {
            if (_this.formConfig.sensorSettings.addShowType) {
                let addShowType = _this.formConfig.sensorSettings.addShowType;
                if ("normal" === addShowType) {
                    _this.addShowNormal = false;
                    _this.normalHackReset = false;
                    // 重新渲染子组件
                    _this.$nextTick(() => {
                        _this.normalHackReset = true;
                    });
                    return false;
                }
            }
        }
        if (_this.addShowNormal) {
            _this.editFormVisible = true;
        }
        _this.parentFormId = _this.formId;
        _this.parentBusinessId = row.id;
        _this.hackReset = false;
        // 重新渲染子组件
        _this.$nextTick(() => {
            _this.hackReset = true;
        });
    },
    /**
     *批量删除操作
     * @param multipleSelection
     * @param _this
     */
    batchDel(multipleSelection, _this) {
        _this.$confirm('确认删除该记录吗?', '提示', {}).then(() => {
            _this.delLoading = true;
            let readyToDeleteIds = "";
            if (multipleSelection instanceof Array) {
                for (let item of multipleSelection) {
                    readyToDeleteIds += item.id + ","
                }
            } else {
                readyToDeleteIds = multipleSelection.id;
            }
            let param = {
                businessIds: readyToDeleteIds
            };
            _this.$Get(_this.khConfig.api.batchDelFormData + "/" + _this.formId, param)
                .then(res => {
                    if (res.errCode === 0) {
                        if(multipleSelection.length == _this.tableData.length &&   _this.queryParam.pageNum >1){
                            _this.queryParam.pageNum -- ;
                        }
                        _this.listData();
                        _this.$notify({
                            title: '成功',
                            message: '删除成功',
                            type: 'success'
                        });
                    }
                    _this.delLoading = false;
                })
        }).catch((e) => {
            console.log(e)
        });
    },
    /**
     * 保存表单业务数据
     * @param _this
     * @param showType
     */
    saveData(_this, showType) {
        _this.$refs.buildForm.getData().then(data => {
            _this.$confirm('确认保存吗？', '提示', {}).then(() => {
                _this.KHForm.formatDynCols(data, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                let url;
                if (!_this.KHUtils.isNull(_this.businessId)) {
                    // 业务ID
                    data.id = _this.businessId;
                    url = _this.khConfig.api.updateFormData
                } else {
                    url = _this.khConfig.api.addFormData
                }
                _this.nextLoading = true;
                data.formId = _this.formId;
                let paramArray = [];
                Object.keys(data).forEach(function (key) {
                    paramArray.push(key + "=" + data[key]);
                   /* if(data[key] != null){
                        paramArray.push(key + "=" + data[key]);
                    }*/
                });
                paramArray = paramArray.join("&");
                _this.$Post(url + "/" + _this.formId, paramArray).then(res => {
                    if (res.errCode === 0) {
                        _this.$notify({
                            title: '成功',
                            message: '保存成功',
                            type: 'success'
                        });
                        if (_this.KHUtils.isNull(showType)) {
                            _this.listData();  // FormCustom 组件调用正常执行,如果是AddFormCustom则不需要查询列表信息
                        } else if (!_this.KHUtils.isNull(showType)) {
                            if (showType === 'AddFormCustom') {
                                _this.parentSaveDisable = true; // 如果是AddFormCustom则保存完禁用保存按钮,防止重复提交
                            }
                        }
                    }
                    _this.nextLoading = false;
                    let flag = false;
                    if (_this.formConfig.list) {
                        _this.formConfig.list.forEach(obj => {
                            if (obj.type === 'table') {
                                flag = true;
                                return false;
                            }
                        })
                    }
                    if (flag) {
                        // 将业务ID与表单ID传递给子表单
                        _this.parentBusinessId = res.businessId ? res.businessId : _this.businessId;    // 父表单业务数据ID
                        _this.parentFormId = _this.formId;        // 表单Id
                        _this.parentSaveDisable = _this.formTitle !== '编辑'; // 含有子表单时,新增完禁用父表单的保存按钮
                        let tempRow = _this.KHUtils.clone(data);
                        _this.KHForm.ReversalDynCols(tempRow, _this.khConfig.host.rest + _this.khConfig.api.imageDownload, _this.allCols);
                        _this.dataModels = tempRow;
                        _this.hackReset = false;
                        // 重新渲染子组件
                        _this.$nextTick(() => {
                            _this.hackReset = true;
                        })
                    } else {
                        _this.addShowNormal = true;
                        if (_this.KHUtils.isNull(showType)) {
                            _this.editFormVisible = false;   // FormCustom 组件调用正常执行,如果是AddFormCustom则不正常关闭
                        }
                    }
                })
            }).catch((e) => {
                console.log(e)
            });
        }).catch(() => {
        })
    },
    /**
     * 导出Excel
     * @param _this
     */
    handleExport(_this) {
        _this.excelFileId = "";
        // 无查询条件设置,则导出所有的数据
        if (!_this.$refs.condSetForm) {
            exportExcel(_this, []);
        }
        // 按照查询条件导出数据
        _this.$refs.condSetForm.getData().then(data => {
            let param = [];
            _this.KHForm.processCond(data, param, _this);
            exportExcel(_this, param);
        });

        function exportExcel(_this, param) {
            let postJsParam = {
                "formId": _this.formId,
                "queryConditions": param
            };
            _this.$PostJson(_this.khConfig.api.exportForm, postJsParam).then(res => {
                if (res.errCode === 0) {
                    _this.excelFileId = res.importExportCode;
                    console.log("excelFileId :" + _this.excelFileId);
                    if (!_this.KHUtils.isNull(_this.excelFileId)) {
                        _this.KHForm.timeoutExportExcel(_this);
                    }
                }
            });
        }
    },
    handleExportV2(_this, queryParams) {
        _this.excelFileId = "";
        // 无查询条件设置,则导出所有的数据
        if (queryParams instanceof Array && queryParams.length > 0) {
            exportExcel(_this, queryParams);
        } else {
            exportExcel(_this, []);
        }

        function exportExcel(_this, param) {
            let postJsParam = {
                "formId": _this.formId,
                "queryConditions": param
            };
            if (_this.item) {
                postJsParam.widgetId = _this.item.id;
            }
            _this.$PostJson(_this.khConfig.api.exportForm, postJsParam).then(res => {
                if (res.errCode === 0) {
                    _this.excelFileId = res.importExportCode;
                    console.log("excelFileId :" + _this.excelFileId);
                    if (!_this.KHUtils.isNull(_this.excelFileId)) {
                        _this.KHForm.timeoutExportExcel(_this);
                    }
                }
            });
        }
    },
    /**
     * 轮询导出Excel结果
     * @param _this
     * @returns {Promise<void>}
     */
    async timeoutExportExcel(_this) {
        let timerId = await new Promise(resovle => {
            let timerId = setTimeout(async () => {
                try {
                    _this.exportLoading = true;
                    _this.$Get(_this.khConfig.api.getImportExportState + "/" + _this.excelFileId+"/1", {}).then(res => {
                        console.log("导出中...." + _this.excelFileId);
                        if (res.errCode === 0) {
                            if (res.formImportExportState) {
                                let state = res.formImportExportState.state;
                                if (_this.KHUtils.isNull(state)) {
                                    _this.KHForm.clearExportTimer(_this);
                                    _this.exportLoading = false;
                                    return false;
                                }
                                // 导出失败
                                if ("failed" === state) {
                                    _this.$notify.error({
                                        title: '错误',
                                        message: 'Excel导出失败'
                                    });
                                    _this.KHForm.clearExportTimer(_this);
                                    _this.exportLoading = false;
                                    return false;
                                }
                                // 导出成功
                                if ("success" === state) {
                                    _this.exportLoading = false;
                                    _this.$notify.success({
                                        title: '成功',
                                        message: 'Excel导出成功'
                                    });
                                    _this.$OpenUrl(_this.khConfig.host.rest + _this.khConfig.api.fileDownload + "/" + _this.excelFileId);
                                    _this.KHForm.clearExportTimer(_this);
                                    return false;
                                }
                                _this.KHForm.timeoutExportExcel(_this);
                            }
                        }
                    });
                } catch (err) {
                    console.log(err);
                    _this.KHForm.clearExportTimer(_this);
                }
            }, 1000);
            resovle(timerId);
        });
        _this.timerIdEnd = timerId;  //在data中定义，它永远是最后一个定时器的id
    },
    /**
     * 导出,清除最近的100个定时器，如果只清除最后一个，会出现bug
     * @param _this
     */
    clearExportTimer(_this) {
        let end = _this.timerIdEnd;
        let start = end - 100 > 0 ? end - 100 : 0;
        for (let i = start; i <= end; i++) {
            clearTimeout(i);
        }
    },
    /**
     * 轮询导入结果
     * @param _this
     * @returns {Promise<void>}
     */
    async timeoutImportExcel(_this) {
        let timerId = await new Promise(resovle => {
            let timerId = setTimeout(async () => {
                try {
                    _this.importLoading = true;
                    _this.$Get(_this.khConfig.api.getImportExportState + "/" + _this.importExcelFileId+"/2", {}).then(res => {
                        console.log("导入中...." + _this.importExcelFileId);
                        if (res.errCode === 0) {
                            if (res.formImportExportState) {
                                let state = res.formImportExportState.state;
                                let reason = res.formImportExportState.reason;
                                if (_this.KHUtils.isNull(state)) {
                                    _this.KHForm.clearImportTimer(_this);
                                    _this.importLoading = false;
                                    return false;
                                }
                                // 导出失败
                                if ("failed" === state) {
                                    if(_this.KHUtils.isNull(reason)){
                                        reason = 'Excel导入失败';
                                    }
                                    _this.$notify.error({
                                        title: '错误',
                                        message: reason
                                    });
                                    _this.KHForm.clearImportTimer(_this);
                                    _this.importLoading = false;
                                    return false;
                                }
                                // 导出成功
                                if ("success" === state) {
                                    _this.importLoading = false;
                                    _this.$notify.success({
                                        title: '成功',
                                        message: 'Excel导入成功'
                                    });
                                    _this.listData();
                                    _this.KHForm.clearImportTimer(_this);
                                    return false;
                                }
                                // 导出成功
                                if ("part_success" === state) {
                                    _this.importLoading = false;
                                    _this.$notify.warning({
                                        title: '警告',
                                        message: 'Excel部分导入成功!未导入成功的数据已下载至您本地目录,请您按正确格式修改后再进行导入!'
                                    });
                                    _this.listData();
                                    _this.$OpenUrl(_this.khConfig.host.rest + _this.khConfig.api.fileDownload + "/" + _this.importExcelFileId + "_error");
                                    _this.KHForm.clearImportTimer(_this);
                                    return false;
                                }
                                _this.KHForm.timeoutImportExcel(_this);
                            }
                        }
                    });
                } catch (err) {
                    console.log(err);
                    _this.KHForm.clearImportTimer(_this);
                }
            }, 2000);
            resovle(timerId);
        });
        _this.importTimerIdEnd = timerId;  //在data中定义，它永远是最后一个定时器的id
    },
    /**
     * 清除导入定时器
     * @param _this
     */
    clearImportTimer(_this) {
        let end = _this.importTimerIdEnd;
        let start = end - 100 > 0 ? end - 100 : 0;
        for (let i = start; i <= end; i++) {
            clearTimeout(i);
        }
    },
    /**
     * 动态注册子组件 componentName: 子组件名称;componentPath：子组件的相对路径
     * @param componentName
     * @param componentPath
     */
    registerComponent(componentName, componentPath) {
        let cp;
        switch (componentName) {
            case 'FormCustom':
                cp = () => import(`@/views/FormCustom`);
                Vue.component(componentName, cp);
                break;
            case 'FormCustomV2':
                cp = () => import(`@/views/FormCustomV2`);
                Vue.component(componentName, cp);
                break;
            case 'AddFormCustom':
                cp = () => import(`@/views/AddFormCustom`);
                Vue.component(componentName, cp);
                break;
            case 'Redirect':
                cp = () => import(`@/views/Redirect`);
                Vue.component(componentName, cp);
                break;
            case 'FormCustomBase':
                cp = () => import(`@/views/FormCustomBase`);
                Vue.component(componentName, cp);
                break;
            case 'ThirdFormCustomBase':
                cp = () => import(`@/views/ThirdFormCustomBase`);
                Vue.component(componentName, cp);
                break;
            case 'ReportCustomBase':
                cp = () => import(`@/views/FormCustomBase`);
                Vue.component(componentName, cp);
                break;
            case 'ThirdReportCustomBase':
                cp = () => import(`@/views/ThirdFormCustomBase`);
                Vue.component(componentName, cp);
                break;
            case 'CompanyRegister':
                cp = () => import(`@/views/CompanyRegister`);
                Vue.component(componentName, cp);
                break;
            case 'ViewFormCustom':
                cp = () => import(`@/views/ViewFormCustom`);
                Vue.component(componentName, cp);
                break;
            case 'ListFormCustom':
                cp = () => import(`@/views/ListFormCustom`);
                Vue.component(componentName, cp);
                break;
            default:
                /**
                 * @param {string} componentPath 代标组件路径，此处需要规范录入时的写法。分为两种：components/... 与 views/... （...代表后续路径）
                 * 当检测到 componentPath 开头为 components 路径时 require()方法加载 components 文件夹下组件
                 * 当检测到 componentPath 开头为 views 路径时 require()方法加载 views 文件夹下组件
                 */
                if (componentPath.indexOf('views') !== -1) {
                    let reg = /^(\S*?)views\//;
                    let transPath = componentPath.replace(reg, '');
                    try {
                        let cp = () => import(`@/views/${transPath}`);
                        Vue.component(componentName, cp);
                    } catch (e) {
                        console.error('路径有误');
                        return false;
                    }
                } else if (componentPath.indexOf('components') !== -1) {
                    let reg = /^(\S*?)components\//;
                    let transPath = componentPath.replace(reg, '');
                    try {
                        let cp = () => import(`@/components/${transPath}`);
                        Vue.component(componentName, cp);
                    } catch (e) {
                        console.error('路径有误');
                        return false;
                    }
                } else {
                    console.error('路径有误');
                    return false;
                }
        }
        return true;
    },
    judgeTableExit(myList) {
        let _this = this;
        let isExit = false;
        if (myList instanceof Array && myList.length > 0) {
            myList.forEach((item, index) => {
                if (item.reportType === "tableReportWidget") {
                    isExit = true;
                }
            })
        }
        return isExit;
    },
    /**
     *
     * @param myDiv dom对象
     * @param _this
     * @param dataList 控件集合配置
     * @param dataConfig 控件配置
     * @returns {boolean}
     */
    initGlobalStyle(myDiv, _this, dataList, dataConfig) {
        if (myDiv == null) {
            return false;
        }
        let allWidgetArray = [];   // 所有控件集合
        let elInputInnerArray = []; // 所有含el-input__inner控件集合
        let elIconDateArray = []; // 所有含icon-date图标控件集合,日期选择控件
        let elIconTimeArray = []; // 所有含icon-time图标控件集合,时间选择控件
        let elIconSelectArray = []; // 所有含icon-select图标控件集合,下拉选择框,多选下拉选择框
        let elInputNumberArray = []; // 所有计算器控件集合
        let elInputTextAreaArray = []; // 所有文本输入框控件集合
        let elRadioArray = []; // 所有radio控件集合
        let elCheckBoxArray = []; // 所有checkBox控件集合
        let elBtnArray = []; // 所有ImageUpload/fileUpload控件集合
        let regionSelectArray = []; // 行政区划控件
        dataList.forEach(val => {
            if (val.type === 'grid') {
                loop(val, _this);
            } else {
                if (inputInner(val)) {
                    elInputInnerArray.push(val);
                }
                if (iconDate(val)) {
                    elIconDateArray.push(val);
                }
                if (iconTime(val)) {
                    elIconTimeArray.push(val);
                }
                if (iconSelect(val)) {
                    elIconSelectArray.push(val);
                }
                if (val.type === 'number') {
                    elInputNumberArray.push(val);
                }
                if (val.type === 'textarea') {
                    elInputTextAreaArray.push(val);
                }
                if (val.type === 'radio') {
                    elRadioArray.push(val);
                }
                if (val.type === 'checkbox') {
                    elCheckBoxArray.push(val);
                }
                if (val.type === 'image_upload' || val.type === 'file_upload') {
                    elBtnArray.push(val);
                }
                if (val.type === 'region_select') {
                    regionSelectArray.push(val);
                }
                if (val.type !== 'text') {
                    allWidgetArray.push(val);
                }
            }
        });

        function loop(obj, _this) {
            if (obj.columns) {
                obj.columns.forEach(cs => {
                    cs.list.forEach(ls => {
                        if (inputInner(ls)) {
                            elInputInnerArray.push(ls);
                        }
                        if (iconDate(ls)) {
                            elIconDateArray.push(ls);
                        }
                        if (iconTime(ls)) {
                            elIconTimeArray.push(ls);
                        }
                        if (iconSelect(ls)) {
                            elIconSelectArray.push(ls);
                        }
                        if (ls.type === 'number') {
                            elInputNumberArray.push(ls);
                        }
                        if (ls.type === 'textarea') {
                            elInputTextAreaArray.push(ls);
                        }
                        if (ls.type === 'radio') {
                            elRadioArray.push(ls);
                        }
                        if (ls.type === 'checkbox') {
                            elCheckBoxArray.push(ls);
                        }
                        if (ls.type === 'image_upload' || ls.type === 'file_upload') {
                            elBtnArray.push(ls);
                        }
                        if (ls.type === 'region_select') {
                            regionSelectArray.push(ls);
                        }
                        if (ls.type !== 'text') {
                            allWidgetArray.push(ls);
                        }
                        if (ls.columns) {
                            loop(ls, _this);
                        }
                    })
                })
            }
        }

        function inputInner(obj) {
            return obj.type === 'input' || obj.type === 'input_mobile' || obj.type === 'input_tel' || obj.type === 'input_mail' || obj.type === 'input_postal'
                || obj.type === 'input_website' || obj.type === 'input_number' || obj.type === 'input_int' || obj.type === 'input_long' || obj.type === 'number'
                || obj.type === 'year' || obj.type === 'month' || obj.type === 'year_month' || obj.type === 'date' || obj.type === 'time'
                || obj.type === 'datetime' || obj.type === 'multiple_select' || obj.type === 'select' || obj.type === 'data_select' || obj.type === 'org_select'
                || obj.type === 'user_select' || obj.type === 'company_select' || obj.type === 'role_select' || obj.type === 'dic_select' || obj.type === 'gis_select';
        }

        function iconDate(obj) {
            return obj.type === 'year' || obj.type === 'month' || obj.type === 'year_month' || obj.type === 'date';
        }

        function iconTime(obj) {
            return obj.type === 'time' || obj.type === 'datetime';
        }

        function iconSelect(obj) {
            return obj.type === 'multiple_select' || obj.type === 'select';
        }

        let backgroundColor = null;
        let fontColor = null;
        let iconColor = null;
        let borderSize = '1px';
        let borderColor = null;
        if (!_this.KHUtils.isNull(dataConfig.widgetBackgroundColor)) {
            backgroundColor = dataConfig.widgetBackgroundColor;
        }
        if (!_this.KHUtils.isNull(dataConfig.widgetFontColor)) {
            fontColor = dataConfig.widgetFontColor;
        }
        if (!_this.KHUtils.isNull(dataConfig.widgetIconColor)) {
            iconColor = dataConfig.widgetIconColor;
        }
        if (!_this.KHUtils.isNull(dataConfig.widgetBorderSize)) {
            borderSize = dataConfig.widgetBorderSize;
        }
        if (!_this.KHUtils.isNull(dataConfig.widgetBorderColor)) {
            borderColor = dataConfig.widgetBorderColor;
        }
        // 文本输入框
        var inputs = myDiv.getElementsByClassName("el-input__inner");
        for (var i = 0; i < inputs.length; i++) {
            let widget = elInputInnerArray[i];
            let widgetBorderSize, widgetBorderColor, widgetBackgroundColor, widgetFontColor = null;
            let finalWidgetBorderSize, finalWidgetBorderColor, finalWidgetBackgroundColor,
                finalWidgetFontColor = null;
            if (!_this.KHUtils.isNull(widget.widgetBorderSize)) {
                widgetBorderSize = widget.widgetBorderSize;
            }
            if (!_this.KHUtils.isNull(widget.widgetBorderColor)) {
                widgetBorderColor = widget.widgetBorderColor;
            }
            if (!_this.KHUtils.isNull(widget.widgetBackgroundColor)) {
                widgetBackgroundColor = widget.widgetBackgroundColor;
            }
            if (!_this.KHUtils.isNull(widget.widgetFontColor)) {
                widgetFontColor = widget.widgetFontColor;
            }
            finalWidgetBorderSize = _this.KHUtils.isNull(widgetBorderSize) ? borderSize : widgetBorderSize;
            finalWidgetBorderColor = _this.KHUtils.isNull(widgetBorderColor) ? borderColor : widgetBorderColor;
            finalWidgetBackgroundColor = _this.KHUtils.isNull(widgetBackgroundColor) ? backgroundColor : widgetBackgroundColor;
            finalWidgetFontColor = _this.KHUtils.isNull(widgetFontColor) ? fontColor : widgetFontColor;
            inputs[i].setAttribute("style", "border: " + finalWidgetBorderSize + " solid " + finalWidgetBorderColor + ";background-color:" + finalWidgetBackgroundColor + ";color:" + finalWidgetFontColor);
        }
        // 日期选择控件Icon颜色设置
        var elInputIconsDate = myDiv.getElementsByClassName(" el-input__icon el-icon-date");
        for (var i = 0; i < elInputIconsDate.length; i++) {
            let widget = elIconDateArray[i];
            let tempWidgetIconColor = null;
            let finalWidgetIconColor = null;
            if (!_this.KHUtils.isNull(widget.widgetIconColor)) {
                tempWidgetIconColor = widget.widgetIconColor;
            }
            finalWidgetIconColor = _this.KHUtils.isNull(tempWidgetIconColor) ? iconColor : tempWidgetIconColor;
            elInputIconsDate[i].setAttribute("style", "color:" + finalWidgetIconColor)
        }
        // 时间选择控件Icon颜色设置
        var elInputIconsTime = myDiv.getElementsByClassName(" el-input__icon el-icon-time");
        for (var i = 0; i < elInputIconsTime.length; i++) {
            let widget = elIconTimeArray[i];
            let tempWidgetIconColor = null;
            let finalWidgetIconColor = null;
            if (!_this.KHUtils.isNull(widget.widgetIconColor)) {
                tempWidgetIconColor = widget.widgetIconColor;
            }
            finalWidgetIconColor = _this.KHUtils.isNull(tempWidgetIconColor) ? iconColor : tempWidgetIconColor;
            elInputIconsTime[i].setAttribute("style", "color:" + finalWidgetIconColor)
        }
        // 下拉选择框/多选下拉框icon颜色设置
        var elInputIconsSelect = myDiv.getElementsByClassName(" el-select__caret el-input__icon el-icon-arrow-up");
        for (var i = 0; i < elInputIconsSelect.length; i++) {
            let widget = elIconSelectArray[i];
            let tempWidgetIconColor = null;
            let finalWidgetIconColor = null;
            if (!_this.KHUtils.isNull(widget.widgetIconColor)) {
                tempWidgetIconColor = widget.widgetIconColor;
            }
            finalWidgetIconColor = _this.KHUtils.isNull(tempWidgetIconColor) ? iconColor : tempWidgetIconColor;
            elInputIconsSelect[i].setAttribute("style", "color:" + finalWidgetIconColor)
        }
        // 计数器icon颜色/背景颜色设置
        var elInputIconsArrowDown = myDiv.getElementsByClassName(" el-icon-arrow-down");
        let tempDownI = 0;
        for (var i = 0; i < elInputIconsArrowDown.length; i++) {
            if (elInputIconsArrowDown[i]._prevClass === 'el-icon-arrow-down') {
                let widget = elInputNumberArray[i - tempDownI];
                let tempWidgetIconColor = null;
                let finalWidgetIconColor = null;
                if (!_this.KHUtils.isNull(widget.widgetIconColor)) {
                    tempWidgetIconColor = widget.widgetIconColor;
                }
                finalWidgetIconColor = _this.KHUtils.isNull(tempWidgetIconColor) ? iconColor : tempWidgetIconColor;
                elInputIconsArrowDown[i].setAttribute("style", "color:" + finalWidgetIconColor)
            } else {
                tempDownI++;
            }
        }
        // 设置计算器Icon上半部分背景
        var elInputNumberDecrease = myDiv.getElementsByClassName(" el-input-number__decrease");
        for (var i = 0; i < elInputNumberDecrease.length; i++) {
            let widget = elInputNumberArray[i];
            elInputNumberDecrease[i].setAttribute("style", "background-color:" + widget.widgetIconBackgroundColor)
        }
        var elInputIconsArrowUp = myDiv.getElementsByClassName(" el-icon-arrow-up");
        let tempUpI = 0;
        for (var i = 0; i < elInputIconsArrowUp.length; i++) {
            if (elInputIconsArrowUp[i]._prevClass === 'el-icon-arrow-up') {
                let widget = elInputNumberArray[i - tempUpI];
                let tempWidgetIconColor = null;
                let finalWidgetIconColor = null;
                if (!_this.KHUtils.isNull(widget.widgetIconColor)) {
                    tempWidgetIconColor = widget.widgetIconColor;
                }
                finalWidgetIconColor = _this.KHUtils.isNull(tempWidgetIconColor) ? iconColor : tempWidgetIconColor;
                elInputIconsArrowUp[i].setAttribute("style", "color:" + finalWidgetIconColor)
            } else {
                tempUpI++;
            }
        }
        // 设置计算器Icon下半部分背景
        var elInputNumberIncrease = myDiv.getElementsByClassName(" el-input-number__increase");
        for (var i = 0; i < elInputNumberIncrease.length; i++) {
            let widget = elInputNumberArray[i];
            elInputNumberIncrease[i].setAttribute("style", "background-color:" + widget.widgetIconBackgroundColor)
        }
        // 标题字体/颜色设置
        var elFormItemLabel = myDiv.getElementsByClassName(" el-form-item__label");
        let widgetTitleFontColor = dataConfig.widgetTitleFontColor;
        let widgetTitleFontSize = dataConfig.widgetTitleFontSize;
        for (var i = 0; i < elFormItemLabel.length; i++) {
            let widget = allWidgetArray[i];
            let tempWidgetTitleFontSize, tempWidgetTitleFontColor = null;
            let finalWidgetTitleFontSize, finalWidgetTitleFontColor = null;
            if (!_this.KHUtils.isNull(widget.widgetTitleFontColor)) {
                tempWidgetTitleFontColor = widget.widgetTitleFontColor;
            }
            if (!_this.KHUtils.isNull(widget.widgetTitleFontSize)) {
                tempWidgetTitleFontSize = widget.widgetTitleFontSize;
            }
            finalWidgetTitleFontSize = _this.KHUtils.isNull(tempWidgetTitleFontSize) ? widgetTitleFontSize : tempWidgetTitleFontSize;
            finalWidgetTitleFontColor = _this.KHUtils.isNull(tempWidgetTitleFontColor) ? widgetTitleFontColor : tempWidgetTitleFontColor;
            elFormItemLabel[i].setAttribute("style", "color:" + finalWidgetTitleFontColor + ";font-size:" + finalWidgetTitleFontSize
                + ";text-align: " + dataConfig.labelPosition + ";vertical-align: middle;float: left;width:" + dataConfig.labelWidth + 'px');
        }
        // 行政区划
        if (regionSelectArray instanceof Array && regionSelectArray.length === 1) {
            var rgSelectEl = myDiv.getElementsByClassName(" rg-select__el");
            for (var i = 0; i < rgSelectEl.length; i++) {
                let widget = regionSelectArray[0];
                let widgetBorderSize, widgetBorderColor, widgetBackgroundColor;
                let finalWidgetBorderSize, finalWidgetBorderColor, finalWidgetBackgroundColor;
                if (!_this.KHUtils.isNull(widget.widgetBorderSize)) {
                    widgetBorderSize = widget.widgetBorderSize;
                }
                if (!_this.KHUtils.isNull(widget.widgetBorderColor)) {
                    widgetBorderColor = widget.widgetBorderColor;
                }
                if (!_this.KHUtils.isNull(widget.widgetBackgroundColor)) {
                    widgetBackgroundColor = widget.widgetBackgroundColor;
                }
                finalWidgetBorderSize = _this.KHUtils.isNull(widgetBorderSize) ? borderSize : widgetBorderSize;
                finalWidgetBorderColor = _this.KHUtils.isNull(widgetBorderColor) ? borderColor : widgetBorderColor;
                finalWidgetBackgroundColor = _this.KHUtils.isNull(widgetBackgroundColor) ? backgroundColor : widgetBackgroundColor;
                rgSelectEl[i].setAttribute("style", "background-color:" + finalWidgetBackgroundColor + ";border:" + finalWidgetBorderSize + " solid " + finalWidgetBorderColor);
            }
            var rgSelectContent = myDiv.getElementsByClassName(" rg-select__content");
            for (var i = 0; i < rgSelectContent.length; i++) {
                rgSelectContent[i].setAttribute("style", "color:" + fontColor);
            }
            var rgSelectCaret = myDiv.getElementsByClassName(" rg-select__caret");
            for (var i = 0; i < rgSelectCaret.length; i++) {
                rgSelectCaret[i].setAttribute("style", "color:" + iconColor);
            }
        }
        // 文本输入框
        var elTextareaInner = myDiv.getElementsByClassName(" el-textarea__inner");
        for (var i = 0; i < elTextareaInner.length; i++) {
            let widget = elInputTextAreaArray[i];
            let widgetBorderSize, widgetBorderColor, widgetBackgroundColor, widgetFontColor = null;
            let finalWidgetBorderSize, finalWidgetBorderColor, finalWidgetBackgroundColor,
                finalWidgetFontColor = null;
            if (!_this.KHUtils.isNull(widget.widgetBorderSize)) {
                widgetBorderSize = widget.widgetBorderSize;
            }
            if (!_this.KHUtils.isNull(widget.widgetBorderColor)) {
                widgetBorderColor = widget.widgetBorderColor;
            }
            if (!_this.KHUtils.isNull(widget.widgetBackgroundColor)) {
                widgetBackgroundColor = widget.widgetBackgroundColor;
            }
            if (!_this.KHUtils.isNull(widget.widgetFontColor)) {
                widgetFontColor = widget.widgetFontColor;
            }
            finalWidgetBorderSize = _this.KHUtils.isNull(widgetBorderSize) ? borderSize : widgetBorderSize;
            finalWidgetBorderColor = _this.KHUtils.isNull(widgetBorderColor) ? borderColor : widgetBorderColor;
            finalWidgetBackgroundColor = _this.KHUtils.isNull(widgetBackgroundColor) ? backgroundColor : widgetBackgroundColor;
            finalWidgetFontColor = _this.KHUtils.isNull(widgetFontColor) ? fontColor : widgetFontColor;
            elTextareaInner[i].setAttribute("style", "border: " + finalWidgetBorderSize + " solid " + finalWidgetBorderColor + ";background-color:" + finalWidgetBackgroundColor + ";color:" + finalWidgetFontColor);
        }
        // radio框文字颜色
        var elRadioLabel = myDiv.getElementsByClassName(" el-radio__label");
        for (var i = 0; i < elRadioLabel.length; i++) {
            elRadioLabel[i].setAttribute("style", "color:" + fontColor);
        }
        // checkbox框文字颜色
        var elCheckboxLabel = myDiv.getElementsByClassName(" el-checkbox__label");
        for (var i = 0; i < elCheckboxLabel.length; i++) {
            elCheckboxLabel[i].setAttribute("style", "color:" + fontColor);
        }
        // radio框文字颜色
        var elRadioInner = myDiv.getElementsByClassName(" el-radio__inner");
        for (var i = 0; i < elRadioInner.length; i++) {
            elRadioInner[i].setAttribute("style", "background-color:" + backgroundColor);
        }
        // checkbox框文字颜色
        var elCheckboxInner = myDiv.getElementsByClassName(" el-checkbox__inner");
        for (var i = 0; i < elCheckboxInner.length; i++) {
            elCheckboxInner[i].setAttribute("style", "background-color:" + backgroundColor);
        }
        // 图片/附件上传
        var elButtonPrimary = myDiv.getElementsByClassName(" el-button--primary");
        let btnWidgetBackgroundColor = dataConfig.btnWidgetBackgroundColor;
        let btnWidgetFontColor = dataConfig.btnWidgetFontColor;
        let tempBtnI = 0;
        for (var i = 0; i < elButtonPrimary.length; i++) {
            let widget = elBtnArray[i - tempBtnI];
            if (elButtonPrimary[i].textContent === '图片上传' || elButtonPrimary[i].textContent === '附件上传') {
                let tempBtnWidgetBackgroundColor, tempBtnWidgetFontColor = null;
                let finalBtnWidgetBackgroundColor, finalBtnWidgetFontColor = null;
                if (!_this.KHUtils.isNull(widget.btnWidgetFontColor)) {
                    tempBtnWidgetFontColor = widget.btnWidgetFontColor;
                }
                if (!_this.KHUtils.isNull(widget.btnWidgetBackgroundColor)) {
                    tempBtnWidgetBackgroundColor = widget.btnWidgetBackgroundColor;
                }
                finalBtnWidgetBackgroundColor = _this.KHUtils.isNull(tempBtnWidgetBackgroundColor) ? btnWidgetBackgroundColor : tempBtnWidgetBackgroundColor;
                finalBtnWidgetFontColor = _this.KHUtils.isNull(tempBtnWidgetFontColor) ? btnWidgetFontColor : tempBtnWidgetFontColor;
                elButtonPrimary[i].setAttribute("style", "background-color:" + finalBtnWidgetBackgroundColor + ";border-color:" + finalBtnWidgetBackgroundColor + ";color:" + finalBtnWidgetFontColor);
            } else {
                tempBtnI++;
            }
        }
        var elUploadTip = myDiv.getElementsByClassName(" el-upload__tip");
        let uploadTipFontColor = dataConfig.uploadTipFontColor;
        for (var i = 0; i < elUploadTip.length; i++) {
            let widget = elBtnArray[i];
            let tempUploadTipFontColor = null;
            let finalUploadTipFontColor = null;
            if (!_this.KHUtils.isNull(widget.uploadTipFontColor)) {
                tempUploadTipFontColor = widget.uploadTipFontColor;
            }
            finalUploadTipFontColor = _this.KHUtils.isNull(tempUploadTipFontColor) ? uploadTipFontColor : tempUploadTipFontColor;
            elUploadTip[i].setAttribute("style", "color:" + finalUploadTipFontColor);
        }
    },

    //表单高级设置 配置信息初始化兼容
    convertSensorSettingsV2(formId, _this) {
        let formConfig = _this.formConfig;
        if (formConfig.sensorSettings && !formConfig.sensorSettingsV2) {
            let dynCols = [];
            let allCols = [];
            _this.KHForm.convertCol(formConfig, dynCols, allCols, _this);
            formConfig.sensorSettingsV2 = {
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
                        "verticalSpacing": 5,
                    }
                },
                "widgets": []
            }
            let tableWidget = {
                id: new Date().getTime() + 1,
                name: "",
                type: "reportWidget",
                reportType: "tableReportWidget",
                borderColor: null,
                paddingTop: 25,
                paddingRight: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                data: {
                    smallType: "tab",
                    cols: [],
                    optButtons: [],
                    condFilters: [],
                    querySort: [],
                    addShowType: "prop",
                    btns: [],
                    reportSettings: {
                        importSettings: {
                            list: [],
                            startRow: 1,
                            startColumn: 1
                        },
                        exportSettings: {
                            list: [],
                            startRow: 1,
                            startColumn: 1,
                            exportRules: 'name',
                            exportModelInfo: {
                                fileId: "",
                                originalfile: ""
                            }
                        }
                    }
                }, // 数据
                style: {
                    mainTitleVisiable: true,
                    mainTitleColor: null,
                    mainTitle: "",
                    pagination: true,//显示分页
                    pageSize: 10,
                    showSerialNum: true,
                    backgroundColor: "#FFFFFF",
                    tableHeaderStyle: {
                        cellColor: null,
                        cellFontSize: '14px',
                        cellPosition: 'center',
                        cellBorderColor: null,
                        backgroundColor: null,
                        cellHeight: '50',
                        borderRight:'1px',
                        borderBottom:'1px',
                    },
                    tableBodyStyle: {
                        cellColor: null,
                        cellFontSize: '12px',
                        cellPosition: 'left',
                        cellBorderColor: null,
                        backgroundColor: '#FFFFFF',
                        backgroundColorHover: '#F5F7FA',
                        cellHeight: '40',
                        optFontSize: '12px',
                        optColor: '#409EFF',
                        borderRight:'1px',
                        borderBottom:'1px',


                    },
                    tableBorderStyle: {
                        boderSize: '1px',
                        boderColor: '#EBEEF5',
                        btnBgColor: null,
                        btnFontColor: null,
                        stripe:true
                    },
                    tablePaginationStyle: {
                        fontColor: null,
                        buttonStyle: {
                            backgroundColor: null,
                            fontColor: null,
                        },
                        buttonActiveStyle: {
                            backgroundColor: null,
                            fontColor: null,
                        },
                        inputStyle: {
                            backgroundColor: null,
                            fontColor: null,
                            borderWidth: '1px',
                            borderColor: null
                        }
                    }
                }, // 样式
                sensior: {
                    autoRefresh: false
                },
                x: 1,
                y: 1,
                sizex: 76,
                sizey: 90,
                querySize: 1000,
                showMoreOptVisible: false,
                designMaxCell: 77,
                _dragId: 0
            };
            let queryWidget = {
                id: new Date().getTime() + 2,
                name: "查询控件",
                type: "queryWidget",
                borderColor: null,
                paddingTop: 25,
                paddingRight: 5,
                paddingBottom: 5,
                paddingLeft: 5,
                x: 1,
                y: 1,
                sizex: 76,
                sizey: 16,
                layout: {},
                conditions: [],
                num: 0,
                style: {
                    mainTitleVisiable: true,
                    mainTitleColor: null,
                    mainTitle: "",
                    widgetType: 0,//0控件水平摆放 1：垂直摆放
                    titleType: 0,//字段标签 0：上方 1：左边
                    titleColor: null,
                    titleFontSize: '14px',
                    widgetStyle: {
                        backgroundColor: null,
                        fontColor: null,
                        iconColor: null,
                        borderSize: '1px',
                        borderColor: null,
                    }
                },
                showMoreOptVisible: false,
                designMaxCell: 77,
                _dragId: 0
            }
            let sensorSettings = formConfig.sensorSettings;
            let sensorSettingsV2 = formConfig.sensorSettingsV2;
            sensorSettingsV2.tableShowType = sensorSettings.tableShowType;
            sensorSettingsV2.addShowType = "pop";
            //查询条件转换
            if (sensorSettings.queryConditions instanceof Array && sensorSettings.queryConditions.length > 0) {
                tableWidget.y = 17
                tableWidget._dragId = 1;
                _this.KHForm.convertQueryConditions(sensorSettings.queryConditions, queryWidget.conditions, dynCols, _this);
                sensorSettingsV2.widgets.push(queryWidget);
            }


            //查询结果配置转换兼容
            _this.KHForm.convertQueryResults(sensorSettings.queryResults, tableWidget.data.cols, dynCols, _this);
            //操作按钮转换
            if (sensorSettings.optButtons instanceof Array && sensorSettings.optButtons.length > 0) {
                tableWidget.data.optButtons = [];
                sensorSettings.optButtons.forEach((item, index) => {
                    if(item.jumpInfo){
                        item.jumpInfo.dialogTitle = item.label;
                    }
                    tableWidget.data.optButtons.push(item);
                })

            }
            //排序
            if (sensorSettings.querySort instanceof Array && sensorSettings.querySort.length > 0) {
                tableWidget.data.querySort = [];
                sensorSettings.querySort.forEach((item, index) => {
                    let newObj = {};
                    newObj.key = item.key;
                    newObj.sort = item.sort;
                    if (newObj.key == "create_time") {
                        newObj.name = "创建时间";
                    } else if (newObj.key == "last_update_time") {
                        newObj.name = "更新时间";
                    } else {
                        newObj.name = _this.KHForm.getNameByModel(item.key, dynCols);
                    }

                    tableWidget.data.querySort.push(newObj);
                })


            }
            //功能按钮
            if (sensorSettings.functionButtons instanceof Array && sensorSettings.functionButtons.length > 0) {
                tableWidget.data.btns = [];
                sensorSettings.functionButtons.forEach((item, index) => {
                    tableWidget.data.btns.push(item);
                })

            }
            //导入导出
            if (sensorSettings.reportSettings) {
                tableWidget.data.reportSettings = sensorSettings.reportSettings;
            }
            sensorSettingsV2.widgets.push(tableWidget);
            console.log("高级设置转换：" + JSON.stringify(_this.formConfig))

        }
    },
    convertQueryConditions(queryConditions, conditions, dynCols, _this) {
        console.log("%%"+JSON.stringify(queryConditions));
        console.log("##"+JSON.stringify(dynCols));
        if (queryConditions instanceof Array && queryConditions.length > 0) {
            queryConditions.forEach((item, index) => {
                let newObj = {};
                newObj.key = item.key;
                newObj.opt = item.opt;
                _this.KHForm.convertCondition(newObj, dynCols, _this);
                newObj.style = {
                    "widthScale": 1
                }
                if (newObj.type === 'data_select' || newObj.type === 'org_select' || newObj.type === 'user_select' || newObj.type === 'role_select' || newObj.type === 'dic_select' || newObj.type === 'company_select') {
                    if (newObj.key.endsWith("lb")) {
                        conditions.push(newObj);
                    }
                } else if (newObj.type === 'gis_select_lat' || newObj.type === 'gis_select_lnt') {

                } else {
                    conditions.push(newObj);
                }

            })
        }

    },
    convertCondition(newObj, dynCols, _this) {
        for (var i = 0; i < dynCols.length; i++) {
            let item = dynCols[i];
            if (item.model == newObj.key) {
                newObj.label = item.name;
                newObj.type = item.type;
                if (item.options && item.options.options) {
                    newObj.options = item.options.options;
                }
                if (newObj.type === "switch") {
                    newObj.options = [
                        {label: "全部", value: ""},
                        {label: "已开启", value: "0"},
                        {label: "已关闭", value: "1"}
                    ]
                }

            }
        }

    },
    convertQueryResults(queryResults, cols, dyCols, _this) {
        if (queryResults instanceof Array && queryResults.length > 0) {
            queryResults.forEach((item, index) => {
                let newObj = {};
                newObj.key = item.key;
                if (item.key === "$seq") {
                    newObj.name = "序号"
                } else if (item.key === "$opt") {
                    newObj.name = "操作"
                } else {
                    newObj.name = _this.KHForm.getNameByModel(item.key, dyCols);
                }
                newObj.alias = newObj.name;
                if (item.hasOwnProperty("isJump")) {
                    newObj.isJump = item.isJump;
                }
                if (item.hasOwnProperty("jumpInfo")) {
                    item.jumpInfo.dialogTitle = item.jumpInfo.label;
                    newObj.jumpInfo = item.jumpInfo;
                }
                cols.push(newObj);

            })
        }
    },
    getNameByModel(model, dyCols) {
        let name = "";
        for (var i = 0; i < dyCols.length; i++) {
            if (dyCols[i].model === model) {
                name = dyCols[i].name;
                return name;
            }
        }
        return name;

    },

    convertCol(tempConfig, dynCols, allCols, _this) {
        if (!tempConfig || _this.KHUtils.isNull(tempConfig.list)) {
            return false;
        }
        // 遍历配置
        for (let i = 0, n = tempConfig.list.length; i < n; i++) {
            let obj = tempConfig.list[i];
            if ("grid" === obj.type) {
                loop(obj, dynCols, _this);
                loopAll(obj, allCols, _this);

                function loop(obj, arr, _this) {
                    let columns = obj.columns;
                    for (let j = 0, m = columns.length; j < m; j++) {
                        let colObj = columns[j];
                        colObj.list.forEach(lsObj => {
                            if (lsObj.type === 'switch') {
                                //  _this.switchMsgObj[lsObj.model] = [lsObj.options.openMsg, lsObj.options.closeMsg];
                            }
                            if (lsObj.type === 'data_select' || lsObj.type === 'org_select'
                                || lsObj.type === 'user_select'
                                || lsObj.type === 'company_select'
                                || lsObj.type === 'role_select'
                                || lsObj.type === 'dic_select') {
                                _this.KHForm.processDataSourceControl(lsObj, arr, _this);
                            } else if (lsObj.type === 'gis_select') {
                                _this.KHForm.processGisControl(lsObj, arr, _this);
                            } else if (lsObj.type === 'region_select') {
                                _this.KHForm.processRegionControl(lsObj, arr, _this);
                            } else {
                                arr.push(lsObj);
                            }
                            if ("grid" === lsObj.type) {
                                loop(obj, _this);
                            }
                        })
                    }
                }

                function loopAll(obj, arr, _this) {
                    let columns = obj.columns;
                    for (let j = 0, m = columns.length; j < m; j++) {
                        let colObj = columns[j];
                        colObj.list.forEach(lsObj => {
                            arr.push(lsObj);
                            if ("grid" === lsObj.type) {
                                loop(obj, _this);
                            }
                        })
                    }
                }
            } else if ("table" === obj.type) {
                /*   _this.tableFormConfig.push(obj);      // 子表单独立组件显示
                   if (_this.tableFormConfig.length > 0) {
                     _this.formActiveName = _this.tableFormConfig[0].model;
                   }*/
            } else {
                allCols.push(obj);
                if (obj.type === 'switch') {
                    // _this.switchMsgObj[obj.model] = [obj.options.openMsg, obj.options.closeMsg];
                }
                if (obj.type === 'data_select' || obj.type === 'org_select'
                    || obj.type === 'user_select'
                    || obj.type === 'company_select'
                    || obj.type === 'role_select'
                    || obj.type === 'dic_select') {
                    _this.KHForm.processDataSourceControl(obj, dynCols, _this);
                } else if (obj.type === 'gis_select') {
                    _this.KHForm.processGisControl(obj, dynCols, _this);
                } else if (obj.type === 'region_select') {
                    _this.KHForm.processRegionControl(obj, dynCols, _this);
                } else {
                    dynCols.push(obj);
                }
            }
        }
    },
    queryByCustomCondition(queryParams, myList, _this) {
        if (myList instanceof Array && myList.length > 0) {
            myList.forEach((ml, index) => {
                if (ml.reportType === "tabPageWidget") {
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
                } else if (ml.reportType == "tableReportWidget") {
                    _this.$refs["tableWidget" + index][0].renderTable(queryParams);

                }
            })
        }
    },
    /**
     * 将表单接口查询到的数据按控件类型转换成相应的结构
     * @param allCols
     * @param datas
     * @param newDatas
     */
    convertFormData(allCols,datas,newDatas){
    if(datas instanceof Array && datas.length >0){
        datas.forEach((data,index)=>{
            if(allCols instanceof Array && allCols.length >0){
                let newObj = {};
                if(data.hasOwnProperty('id')){
                    newObj.id = data.id;
                }
                allCols.forEach((col,key1)=>{
                    if (col.type === 'data_select' || col.type === 'org_select'
                        || col.type === 'user_select'
                        || col.type === 'company_select'
                        || col.type === 'role_select'
                        || col.type === 'dic_select' || col.type === 'current_user') {
                        let model = col.model;
                        let label_model = col.label_model;
                        let obj = {}
                        obj[model] = data[model];
                        obj[label_model] = data[label_model];
                        newObj[model] = obj;

                    } else if (col.type === 'gis_select') {
                        let model = col.model;
                        let lat = col.modelExt.lat;
                        let lnt = col.modelExt.lnt;
                        let address = col.modelExt.address;
                        let obj = {}
                        obj[lat] =data[lat];
                        obj[lnt] = data[lnt];
                        obj[address] = data[address];
                        newObj[model] = obj;

                    } else if (col.type === 'region_select') {
                        let model = col.model;
                        let province = col.modelExt.province;
                        let provinceCode = col.modelExt.provinceCode;
                        let city = col.modelExt.city;
                        let cityCode = col.modelExt.cityCode;
                        let area = col.modelExt.area;
                        let areaCode = col.modelExt.areaCode;
                        let obj = {}
                        obj[province] = data[province];
                        obj[provinceCode] = data[provinceCode];
                        obj[city] = data[city];
                        obj[cityCode] = data[cityCode];
                        obj[area] = data[area];
                        obj[areaCode] = data[areaCode];
                        newObj[model] = obj;

                    } else {
                        let model = col.model;
                        newObj[model] = data[model];
                    }

                });
                newDatas.push(newObj);
            }
        })
    }

},
/**
 * 子表单数据选择时，将选择的数据通过配置的映射关系，转换成现有子表单数据
 * @param allCols 子表单包含的所有控件
 * @param datas  选择的数据
 * @param selectDatas 转换后的数据
 * @param tableConfig 子表单配置
 */
selectDataMapping(_this,allCols,datas,selectDatas,tableConfig){
    if(datas instanceof Array && datas.length >0){
        datas.forEach((data,index)=>{
            if(allCols instanceof Array && allCols.length >0){
                let newObj = {};
                allCols.forEach((col,key1)=>{
                    let key = col.key;
                    let mapping = _this.KHForm.findMapping(key,tableConfig);
                    if (col.type === 'data_select' || col.type === 'org_select'
                        || col.type === 'user_select'
                        || col.type === 'company_select'
                        || col.type === 'role_select'
                        || col.type === 'dic_select' || col.type === 'current_user') {
                        let model = col.model;
                        let label_model = col.label_model;
                        if(mapping){
                            let obj = {}
                            obj[model] = data[mapping.model];
                            obj[label_model] = data[mapping.label_model];
                            newObj[model] = obj;
                        }else {
                            newObj[model] = "";
                        }

                    } else if (col.type === 'gis_select') {
                        let model = col.model;
                        let lat = col.modelExt.lat;
                        let lnt = col.modelExt.lnt;
                        let address = col.modelExt.address;
                        if(mapping){
                            let obj = {}
                            obj[lat] =data[mapping.lat];
                            obj[lnt] = data[mapping.lnt];
                            obj[address] = data[mapping.address];
                            newObj[model] = obj;
                        }else {
                            newObj[model] = "";
                        }

                    } else if (col.type === 'region_select') {
                        let model = col.model;
                        let province = col.modelExt.province;
                        let provinceCode = col.modelExt.provinceCode;
                        let city = col.modelExt.city;
                        let cityCode = col.modelExt.cityCode;
                        let area = col.modelExt.area;
                        let areaCode = col.modelExt.areaCode;
                        if(mapping){
                            let obj = {}
                            obj[province] = data[mapping.province];
                            obj[provinceCode] = data[mapping.provinceCode];
                            obj[city] = data[mapping.city];
                            obj[cityCode] = data[mapping.cityCode];
                            obj[area] = data[mapping.area];
                            obj[areaCode] = data[mapping.areaCode];
                            newObj[model] = obj;
                        }else {
                            newObj[model] = "";
                        }

                    } else if (col.type === 'year' || col.type === 'month') {
                        let model = col.model;
                        if(mapping){
                            if(data[mapping.model] == null){
                                newObj[model] = "";
                            }else {
                                newObj[model] = data[mapping.model]+"";
                            }

                        }else {
                            newObj[model] = "";
                        }

                    } else {
                        let model = col.model;
                        if(mapping){
                            newObj[model] = data[mapping.model];
                        }else {
                            newObj[model] = "";
                        }
                    }

                });
                selectDatas.push(newObj);
            }
        })
    }
},


//找到选择数据的映射关系
findMapping(key,tableConfig){
    let mapping = tableConfig.options.dsConf.mapping;
    if(mapping instanceof Array && mapping.length >0){
        for(var i = 0;i<mapping.length;i++){
            let dk = mapping[i].dk;
            if(key == dk){
                return mapping[i].mapping;
            }
        }
    }
    return null;
},

    //用户控件 当前用户 自动赋值
    userSelectAutoAssing(col,models,currentUser,allCols,_this){
        if (col.options.maps) {
            if (col.options.maps.mapping) {
                if (col.options.maps.mapping instanceof Array) {
                    let mappingArray = col.options.maps.mapping;

                    for (let i = 0, n = mappingArray.length; i < n; i++) {
                        let obj = mappingArray[i];
                        //如果没有值才进行赋值
                        if(_this.KHUtils.isNull(models[obj.model]) || (models[obj.model] instanceof Object && _this.KHUtils.isNull(models[obj.model][obj.model]))){
                            if(obj.selectKey == "orgList"){
                                if (currentUser.orgList instanceof Array && currentUser.orgList.length > 0) {
                                    let value = "";
                                    let array = currentUser.orgList;
                                    array.forEach((item, index) => {
                                        if (array.length == index + 1) {
                                            value = value.concat(item.orgName)
                                        } else {
                                            value = value.concat(item.orgName).concat("、")
                                        }

                                    });
                                    let col =  _this.KHForm.findColsByModel(obj.model,allCols);
                                    if(col){
                                        if (col.type == "org_select") {
                                            
                                            //默认取第一个
                                            let data = array[0];
                                            models[col.model] = {};
                                            models[col.model][col.model] = data.id;
                                            models[col.model][col.label_model] = data.orgName;

                                        }else if (col.type == "m_org_select") {
                                            let JsopDataModel = [];
                                            array.forEach((value) => {
                                                let obj = {
                                                    k: value.id,
                                                    v: value.orgName,
                                                };
                                                JsopDataModel.push(obj);
                                            });
                                            models[obj.model] = JSON.stringify(JsopDataModel);

                                        } else {
                                            models[obj.model] = value;
                                        }
                                    }else {
                                        models[obj.model] = value;
                                    }
                                }

                            }else if(obj.selectKey == "roleList"){
                                if (currentUser.roleList instanceof Array && currentUser.roleList.length > 0) {
                                    let value = "";
                                    let array =currentUser.roleList;
                                    array.forEach((item, index) => {
                                        if(array.length == index+1){
                                            value = value.concat(item.roleName)
                                        }else {
                                            value = value.concat(item.roleName).concat("、")
                                        }

                                    })
                                    let col =  _this.KHForm.findColsByModel(obj.model,allCols);
                                    if(col){
                                        if (col.type == "role_select") {
                                            //默认取第一个
                                            let data = array[0];
                                            models[col.model] = {};
                                            models[col.model][col.model] = data.id;
                                            models[col.model][col.label_model] = data.roleName;


                                        }else if (col.type == "m_role_select") {
                                            let JsopDataModel = [];
                                            array.forEach((value) => {
                                                let obj = {
                                                    k: value.id,
                                                    v: value.roleName,
                                                };
                                                JsopDataModel.push(obj);
                                            });
                                            models[obj.model] = JSON.stringify(JsopDataModel);

                                        }  else {
                                            models[obj.model] = value;
                                        }
                                    }else {
                                        models[obj.model] = value;
                                    }

                                }

                            }else if(obj.selectKey == "sex"){
                                if(currentUser[obj.selectKey] === "0"){
                                    models[obj.model] = "男";
                                }else {
                                    models[obj.model] = "女";
                                }
                            }else {
                                models[obj.model] = currentUser[obj.selectKey];
                            }
                        }



                    }

                }
            }
        }
    },
    findColsByModel(key,allCols){
        if(allCols instanceof Array && allCols.length >0){
            for(var i = 0;i<allCols.length;i++){
                let col = allCols[i];
                if(col.model == key){
                    return col;
                }
            }
        }
        return null;
    },
    getPQuery(_this) {
        // let obj = {};
        let url = "";
        let { query } = _this.$route;
        for (const key in query) {
            if (Object.hasOwnProperty.call(query, key)) {
                if (/^p\./.test(key)) {
                    // obj[key] = query[key];
                    url ? (url += "&" + key + "=" + query[key]) : (url = key + "=" + query[key]);
                }
            }
        }
        return url;
    }
};


export default {
    instance: KHForm,
    //注册插件
    install(Vue) {
        if (Vue.prototype.KHForm) return;
        Vue.prototype.KHForm = KHForm;
    }
}
