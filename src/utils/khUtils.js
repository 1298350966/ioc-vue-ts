var KHUtils = {
    //字符串转日期
    formatStrToDate(date) {
        var t = Date.parse(date);
        if (!isNaN(t)) {
            return new Date(Date.parse(date.replace(/-/g, "/")));
        } else {
            return new Date();
        }
    },
    //匹配网址
    isDomain(val) {
       // let regNeg = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-z_!~*'().&=+$%-]+:)?[0-9a-z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\.){3}[0-9]{1,3}|([0-9a-z_!~*'()-]+\.)*([0-9a-z][0-9a-z-]{0,61})?[0-9a-z]\.[a-z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-z_!~*'().;?:@&=+$,%#-]+)+\/?)/g;
        let regNeg = /((https|http|ftp|rtsp|mms):\/\/)?(([0-9a-zA-Z_!~*'().&=+$%-]+:)?[0-9a-zA-Z_!~*'().&=+$%-]+@)?(([0-9]{1,3}\\.){3}[0-9]{1,3}|([0-9a-zA-Z_!~*'()-]+\\.)*([0-9a-zA-Z][0-9a-zA-Z-]{0,61})?[0-9a-zA-Z]\\.[a-zA-Z]{2,6})(:[0-9]{1,4})?((\/?)|(\/[0-9a-zA-Z_!~*'().;?:@&=+$,%#-]+)+\/?)/g
        ;
        return regNeg.test(val);
    },
    //判断字符串是否为数字
    isNumber(val) {
        // 非负浮点数
        let regPos = /^\d+(\.\d+)?$/;
        // 负浮点数
        let regNeg = /^(-(([0-9]+\.[0-9]*[1-9][0-9]*)|([0-9]*[1-9][0-9]*\.[0-9]+)|([0-9]*[1-9][0-9]*)))$/;
        return regPos.test(val) || regNeg.test(val);
    },
    //判断是否未定义
    isUndefined(T) {
        var res = false;
        if (T === null || T === undefined) {
            res = true;
        }
        return res;
    },
    //判断是否为空
    isNull(T) {
        var res = false;
        if (this.isUndefined(T) || T === '' || null === T) {
            res = true;
        }
        return res;
    },
    //是否是无效的字符串
    isInvalidValue(T) {
        var res = false;
        if (T === undefined || T === 'null' || null === T || 'undefined' === T) {
            res = true;
        }
        return res;
    },
    //判断是正整数
    isInteger(T) {
        var r = /^\+?[1-9][0-9]*$/;
        return r.test(T);
    },
    isUrlPath(url){
        var expression = /(http|https):\/\/\S*/;
        var objExp = new RegExp(expression);
        return objExp.test(url);
    },
    formatDate(date, fmt) {
        if (date === undefined ) {
            return date;
        }
        if (!(date instanceof Date)) {
            if(/(iPhone|iPad|iPod|iOS|Mac)/i.test(navigator.userAgent)){
                if(fmt == 'yyyy-MM'){
                    date = date+'-01'
                }
                date =  this.strToDate(date)
            }else{
                date = new Date(date)
            }
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds(), //毫秒
            // 'D': weekday[date.getDay()] //周几
        };
        if (/(y+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, (date.getFullYear().toString() + "").substr(4 - RegExp.$1.length));
        }
        if (/(E+)/.test(fmt)) {
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "星期" : "周") : "") + week[date.getDay().toString() + ""]);
        }
        for (var k in o) {
            if (new RegExp("(" + k + ")").test(fmt)) {
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k].toString()) : (("00" + o[k].toString()).substr(("" + o[k].toString()).length)));
            }
        }
        return fmt;
    },
    // //日期格式化
    // formatDate(date, fmt) {
    //     if (date === undefined) {
    //         return date;
    //     }
    //     if (!(date instanceof Date)) {
    //         date = new Date(date);
    //     }
    //     var o = {
    //         "M+": date.getMonth() + 1, //月份
    //         "d+": date.getDate(), //日
    //         "h+": date.getHours(), //小时
    //         "m+": date.getMinutes(), //分
    //         "s+": date.getSeconds(), //秒
    //         "q+": Math.floor((date.getMonth() + 3) / 3), //季度
    //         "S": date.getMilliseconds() //毫秒
    //     };
    //     if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
    //     for (var k in o)
    //         if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
    //     return fmt;
    // },
    //日期格式化适配火狐浏览器
    formatDateToAdjustHuoHu(date, fmt) {
        if (date === undefined) {
            return date;
        }
        if (!(date instanceof Date)) {
            // 解决火狐显示日期显示 NaN 的问题
            date = "2001-" + date + ":00";
            date = date.replace(/-/g, ':').replace(' ', ':');
            date = date.split(':');
            date = new Date(date[0], (date[1] - 1), date[2], date[3], date[4], date[5]);
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    //日期格式化适配IE浏览器
    formatDateToAdjustIE(date, fmt) {
        if (date === '' || date === undefined || date === 'NaN-aN-aN aN:aN:aN') {
            return null;
        }
        if (!(date instanceof Date)) {
            // 解决火狐/IE显示日期显示 NaN 的问题
            // date = new Date(date);
            // date = "2001-" + date + ":00"
            date = date + ":00";
            date = date.replace(/-/g, ':').replace(' ', ':');
            date = date.split(':');
            date = new Date(date[0], (date[1] - 1), date[2], date[3], date[4], date[5]);
        }
        var o = {
            "M+": date.getMonth() + 1, //月份
            "d+": date.getDate(), //日
            "h+": date.getHours(), //小时
            "m+": date.getMinutes(), //分
            "s+": date.getSeconds(), //秒
            "q+": Math.floor((date.getMonth() + 3) / 3), //季度
            "S": date.getMilliseconds() //毫秒
        };
        if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (date.getFullYear() + "").substr(4 - RegExp.$1.length));
        for (var k in o)
            if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
        return fmt;
    },
    //判断校验8到16位数字与密码组合的密码
    isValidPwd(T) {
        //let reg = /^(?![0-9]+$)(?![a-zA-Z]+$)[0-9A-Za-z]{8,16}$/;
        let reg=/^(?=.*\d)(?=.*[A-Z])(?=.*[a-z])(?=.*[/`~!@#$%^&*()\-+_=\\|[\]{};:'",<.>/? ]).{6,}$/;
        return reg.test(T);
    },
    //判断是否为电话号码
    isTel(T) {
        let reg = /^0\d{2,3}-?\d{7,8}$/;
        return reg.test(T);
    },
    //判断是否为手机号码
    isMobile(T) {
        // let reg = /^1[3|5|8][0-9]\d{4,8}$/;
        let reg = /^1([34578])\d{9}$/;
        return reg.test(T);
    },
    //判断是否为邮箱
    isEmail(T) {
        let reg = /^([a-zA-Z0-9_.\-])+@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
        return reg.test(T);
    },
    //拷贝对象
    clone(T) {
        var newObj = {};
        if (val instanceof Date) { //拷贝Date对象会造成栈溢出
            newObj = val;
        } else {
            if (T instanceof Array) {
                newObj = [];
            }
            for (var key in T) {
                var val = T[key];
                if (null == val) {
                    newObj[key] = "";
                } else {
                    newObj[key] = typeof val === 'object' ? this.clone(val) : val;
                }
            }
        }
        return newObj;
    },
    //是否数据同步转换
    formatSyn(row, column) {
        return parseInt(row.syn) === 0 ? '是' : '否';
    },
    //是否使用单点登录转换
    formatSso(row, column) {
        return parseInt(row.sso) === 0 ? '是' : '否';
    },
    //性别转换
    formatSex(row, column) {
        return row.sex === '0' ? '男' : '女';
    },
    //级别显示转换
    formatLevel(row, column) {
        return row.level === 1 ? '一级' : row.level === 2 ? '二级' : '三级';
    },
    //随机生成32位的UUID
    generate32Uuid() {
        var s = [];
        var hexDigits = "0123456789abcdef";
        for (var i = 0; i < 32; i++) {
            s[i] = hexDigits.substr(Math.floor(Math.random() * 0x10), 1);
        }
        s[14] = "4"; // bits 12-15 of the time_hi_and_version field to 0010
        s[19] = hexDigits.substr((s[19] & 0x3) | 0x8, 1); // bits 6-7 of the clock_seq_hi_and_reserved to 01
        s[8] = s[13] = s[18] = s[23];
        return s.join("");
    },
    transformRequest(data) {
        let ret = ''
        for (let it in data) {
            if(data[it] != null){
                ret += it + '=' + data[it] + '&';
            }

        }
        return ret.substring(0, ret.lastIndexOf('&'));
    },
    //判断JSON
    isJSON(str) {
        if (typeof str == 'string') {
            try {
                var obj=JSON.parse(str);
                if(typeof obj == 'object' && obj ){
                    return true;
                }else{
                    return false;
                }

            } catch(e) {
                return false;
            }
        }
    }
};


export default {
    instance: KHUtils,
    //注册插件
    install(Vue) {
        Vue.filter('arrayJsonVal', function (val) {
            if(val == 0){
                return val;
            }
            if(!val)  return ""
            if( KHUtils.isJSON(val) && Array.isArray(JSON.parse(val)) ){
                let  dataModel = ''
                JSON.parse(val).forEach(obj=>{
                if(!dataModel){
                        dataModel = obj.v
                    } else{
                        dataModel = dataModel + '、' + obj.v
                    }
                })
                return  dataModel
            }else{
                return  val
            }

          })
          Vue.filter('KHTime',  (value,type)=> {

            if(!value ) return ''

            if(isNaN(Date.parse(value))){
                return value
            }

            if(type === 'time')return  value
            if(type === 'datetime'){
                value = value.toString()
                // if(!value.match(/(-|\/)/g))  return value

                let isdate = value.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/g)
                let isYearMonth = value.match(/^(\d{1,4})(-|\/)(\d{1,2})$/g)
                let isMonth = value.match(/^(\d{1,2})$/g)
                let istime =  value.match(/^(\d{1,2})(:)?(\d{1,2})\2(\d{1,2})$/g)
                if(isdate || istime ||isYearMonth || isMonth){
                    return value
                }
                return  KHUtils.formatDate(value, 'yyyy-MM-dd hh:mm:ss')
            }
            if(type === 'date')return KHUtils.formatDate(value, 'yyyy-MM-dd')
            if(type === 'year_month')return KHUtils.formatDate(value, 'yyyy-MM')

            if(type === 'day'){
                return KHUtils.formatDate(value, 'MM月dd日 D')
            }
            if(type === 'datetime2'){
                return KHUtils.formatDate(value, 'yyyy-MM-dd hh:mm')
            }

          })
        if (Vue.prototype.KHUtils) return;
        Vue.prototype.KHUtils = KHUtils;

        Vue.isNull = function (T) {
            return KHUtils.isNull(T);
        }
    }
}
