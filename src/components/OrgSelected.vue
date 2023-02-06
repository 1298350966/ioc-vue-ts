<template>
    <div class="div-center">
        <div class="ty-transfer mt20 ml20 transfer-center">
            <div class="fl ty-transfer-list transfer-list-left transfer-left">
                <div class="ty-transfer-list-head">
                    <el-breadcrumb class="dib fs14 fw ml5" separator-class="el-icon-arrow-right" style="margin:5px;">
                        <el-breadcrumb-item v-for="(item,key) in titleList" :key="key" style="margin-top: 5px"><a
                            @click="backOrg(item)">{{item.orgName}}</a></el-breadcrumb-item>
                    </el-breadcrumb>
                </div>
                <div class="ty-transfer-list-body">
                    <ul class="ty-tree-select">
                        <li v-for="item in currentOrg">
                            <div class="ty-tree-div">
                                <label class="tyue-checkbox-wrapper" @change="addOrgUser(item)">
		                            <span class="tyue-checkbox">
		                                <input type="checkbox" v-model="item.isSelected == null?false:item.isSelected"
                                               class="tyue-checkbox-input">
                                      <span class="tyue-checkbox-circle"></span>
		                            </span>
                                    <i class="el-icon-folder-opened" style="color: #409EFF;font-size: 18px"
                                       v-if="isOrg(item)"></i>
                                    <span class="tyue-checkbox-txt">{{item.orgName}}</span>
                                </label>
                                <el-link type="primary" style="float: right" :disabled="isSelect(item)"
                                         @click="exterOrg(item)">下级
                                </el-link>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="fl ty-transfer-list transfer-list-right transfer-left" style="margin-left: 50px">
                <div class="ty-transfer-list-head">
                    <div class="dib fs14 fw ml5" style="margin:7px;">已选择</div>
                </div>
                <div class="ty-transfer-list-body">
                    <ul class="ty-tree-select">
                        <li v-for="item in selectOrg">
                            <div class="ty-tree-div">
                                <label class="tyue-checkbox-wrapper">
                                    <i class="el-icon-folder-opened" style="color: #409EFF;font-size: 18px"></i>
                                    <span class="tyue-checkbox-txt">{{item.orgName}}</span>
                                </label>
                                <el-link type="primary" style="float: right"
                                         @click="deleteOrg(item)">删除
                                </el-link>
                            </div>
                        
                        </li>
                    </ul>
                </div>
            </div>
            <div class="clearboth" style="margin-bottom: 30px"></div>
            <div slot="footer" class="dialog-footer">
                <el-button type="primary" @click.native="save">保存</el-button>
            </div>
        </div>
    </div>
</template>

<script>
    
    export default {
        name: "OrgSelected",
        props: {
            selectedArray: {required: true, type: Array},
            tenantId: {required: true, type: Number}
        },
        computed: {
            isOrg() {
                return function (value) {
                    // 0:组织架构 1：用户
                    return true;
                }
            },
            isSelectOrg() {
                return function (value) {
                    return value.userId == null;
                }
            },
            isSelect() {
                return function (value) {
                    return value.isSelected == null ? false : value.isSelected;
                }
            }
        },
        watch: {
            selectedArray() {
                this.init();
            }
        },
        data() {
            return {
                loading: false,
                props: {
                    multiple: true,
                    checkStrictly: false,
                    children: 'children',
                    label: 'orgName',
                    value: 'id'
                },
                currentOrg: [],
                selectOrg: [],
                level: 0,
                titleList: [],//标题导航栏
            }
        },
        mounted() {
            this.init();
        },
        methods: {
            init() {
                this.loading = true;
                this.currentOrg = [];
                this.selectOrg = [];
                this.titleList = [];
                this.queryOrg(null, 0);
            },
            //按部门id查询组织架构下的部门和用户 type:0 初始化第一次 1：进入部门 2：返回
            queryOrg(orgId, type, item) {
                let param = {
                    orgId: orgId,
                    tenantId: this.tenantId
                };
                this.$Get(this.khConfig.api.listTenantOrg, param)
                    .then(res => {
                        if (res.errCode === 0) {
                            this.currentOrg = res.list;
                            this.initSelect(this.currentOrg);
                            if (type === 0) {
                                this.initCheckSelect();
                                let newObj = {};
                                newObj.id = -1;
                                newObj.orgName = "组织架构";
                                this.titleList = [];
                                this.titleList.push(newObj);
                            } else if (type === 1) {
                                this.checkSelect();
                                /*                       let newObj = {};
                                                       newObj.id = item.id;
                                                       newObj.orgName = item.orgName;
                                                       newObj.level = item.level;*/
                                this.titleList.push(item);
                            } else if (type === 2) {
                                this.checkSelect();
                                //删除后续目录连接
                                if (this.titleList != null && this.titleList.length > 0) {
                                    for (var i = 0; i < this.titleList.length; i++) {
                                        let title = this.titleList[i];
                                        if (title.id === item.id) {
                                            this.titleList.splice(i + 1, 100);
                                        }
                                    }
                                }
                            }
                        }
                        this.loading = false;
                    })
            },
            initSelect(org) {
                if (org != null && org.length > 0) {
                    org.forEach(item => {
                        if (item.isSelected == null) {
                            item.isSelected = false;
                        }
                    })
                }
            },
            addOrgUser(item) {
                if (item.isSelected) {
                    this.selectOrg = [];
                    this.selectOrg.push(item);
                    this.currentOrg.forEach(obj => {
                        if (obj.id !== item.id) {
                            obj.isSelected = false;
                        }
                    })
                } else {
                    if (this.selectOrg != null && this.selectOrg.length > 0) {
                        for (var i = 0; i < this.selectOrg.length; i++) {
                            let org = this.selectOrg[i];
                            if (org.id === item.id) {
                                this.selectOrg.splice(i, 1);
                            }
                        }
                    }
                }
            },
            deleteOrg(item) {
                if (this.selectOrg != null && this.selectOrg.length > 0) {
                    for (var i = 0; i < this.selectOrg.length; i++) {
                        let org = this.selectOrg[i];
                        if (org.id === item.id) {
                            this.selectOrg.splice(i, 1);
                            //this.checkSelect()
                        }
                    }
                }
                this.currentOrg.forEach(obj => {
                    obj.isSelected = false;
                })
            },
            //进入下一级通讯录
            exterOrg(item) {
                this.currentOrg = [];
                this.queryOrg(item.id, 1, item);
            },
            //返回到某个目录
            backOrg(item) {
                this.currentOrg = [];
                if (item.id === -1) {
                    //首页
                    this.queryOrg(null, 2, item);
                } else {
                    this.queryOrg(item.id, 2, item);
                }
            },
            initCheckSelect() {
                this.selectOrg = [];
                if (this.selectedArray != null && this.selectedArray.length > 0) {
                    for (var i = 0; i < this.selectedArray.length; i++) {
                        let obj = this.selectedArray[i];
                        /*
                                          let newObj = {};
                                          newObj.id = parseInt(obj.id);
                                          newObj.name = obj.name;
                                          newObj.type = obj.type;*/
                        this.selectOrg.push(obj);
                    }
                    this.checkSelect();
                }
            },
            //校验是选中状态
            checkSelect() {
                if (this.selectOrg != null && this.selectOrg.length > 0) {
                    for (var i = 0; i < this.currentOrg.length; i++) {
                        let obj = this.currentOrg[i];
                        obj.isSelected = false;
                        for (var j = 0; j < this.selectOrg.length; j++) {
                            let selectObj = this.selectOrg[j];
                            if (obj.id === selectObj.id) {
                                obj.isSelected = true;
                            }
                        }
                    }
                }
            },
            save() {
                this.$emit("getCheckedNodes", this.selectOrg);
            },
        },
    }
</script>
<style scoped>
    img {
        border: 0;
        vertical-align: middle;
        max-width: 100%;
    }
    
    body {
        font-size: 12px;
        font-family: 'PingFang SC', 'Hiragino Sans GB', 'PingHei', 'Open Sans', 'sans-serif', 'Helvetica Neue', 'Helvetica', 'Microsoft YaHei', 'SimSun', 'Arial';
        color: #666666;
    }
    
    html, body, div, dl, dt, dd, ul, ol, li, h1, h2, h3, h4, h5, h6, pre, form, input, textarea, p, table, tr, th, td, span, strong, em {
        padding: 0;
        margin: 0;
        font-style: normal;
        font-size: 12px;
    }
    
    input {
        border: 0;
        padding: 0px;
        font-size: 12px;
        background: none;
        font-family: "PingFang SC", "Hiragino Sans GB", "PingHei", "Open Sans", "sans-serif", "Helvetica Neue", "Helvetica", "Microsoft YaHei", "SimSun", "Arial";
    }
    
    input:-webkit-autofill,
    textarea:-webkit-autofill,
    select:-webkit-autofill {
        background-color: #fff;
        -webkit-box-shadow: 0 0 0 1000px white inset;
    }
    
    button, button:focus, button:active, button:link {
        -webkit-appearance: none;
        outline: none;
    }
    
    ol, ul, li {
        list-style: none;
    }
    
    h1, h2, h3, h4, h5, h6 {
        font-weight: normal;
        font-size: 100%;
    }
    
    table {
        border-collapse: collapse;
        border-spacing: 0;
    }
    
    a {
        text-decoration: none;
        outline: none;
        cursor: pointer;
        color: #333;
    }
    
    a:link, a:visited {
        text-decoration: none;
    }
    
    a:hover {
        text-decoration: none;
    }
    
    a:active {
        text-decoration: none;
    }
    
    .clearboth {
        clear: both;
    }
    
    .dib {
        display: inline-block;
    }
    
    .fl {
        float: left;
    }
    
    .fr {
        float: right;
    }
    
    .ml5 {
        margin-left: 5px;
    }
    
    .ml10 {
        margin-left: 10px;
    }
    
    /*   .mt20{margin-top:13px;}*/
    .mt50 {
        margin-top: 20px;
    }
    
    .mt10 {
        margin-top: 10px;
    }
    
    .ml20 {
        margin-left: 10px;
    }
    
    .div-h, .ty-p {
        line-height: 1.5;
    }
    
    .color9 {
        color: #999;
    }
    
    .color-blue {
        color: #00a0e8;
    }
    
    .p16 {
        padding: 16px;
    }
    
    .p24 {
        padding: 24px;
    }
    
    .bgf7 {
        padding: 10px;
        background: #f7f7f7;
    }
    
    .bg999 {
        padding: 10px;
        background: #999;
    }
    
    .ty-relative {
        position: relative;
    }
    
    .fs14 {
        font-size: 14px;
    }
    
    .fw {
        font-weight: 600;
    }
    
    .tyue-checkbox {
        vertical-align: middle;
        display: inline-block;
        position: relative;
        white-space: nowrap;
    }
    
    .tyue-checkbox-txt {
        margin-left: 6px;
        margin-right: 8px;
    }
    
    .tyue-checkbox-txt.active {
        color: #00A0E8;
    }
    
    /*过滤*/
    .ty-transfer-list {
        width: 280px;
        height: 290px;
        border: 1px solid #e8e8e8;
        border-radius: 3px;
        background: #fff;
        box-shadow: 0 0 5px #e8e8e8
    }
    
    .ty-transfer-list-head {
        /* height: 32px;*/
        /*  line-height: 32px;*/
        font-size: 14px;
        color: #666;
        background-color: #f5f7fc;
    }
    
    .ty-transfer-list-serach {
        width: auto;
        padding: 0 15px 8px;
        position: relative;
    }
    
    .ty-transfer-list-serach input {
        display: block;
        width: 100%;
        height: 28px;
        line-height: 28px;
        padding-left: 30px;
        border: 1px solid #ccc;
        border-radius: 4px;
        box-sizing: border-box;
    }
    
    .ty-transfer-list-serach input {
        transition: all .3s linear;
        -webkit-transition: all .3s linear;
        -o-transition: all .3s linear;
        -moz-transition: all .3s linear;
    }
    
    .ty-transfer-list-serach > input:focus,
    .ty-transfer-list-serach > input:hover {
        border-color: #57c5f7;
        border: 1px solid #57c5f7;
        outline: 0;
        box-shadow: 0 0 0 2px rgba(45, 183, 245, .2);
    }
    
    .ty-tree-select {
        margin-top: 10px;
    }
    
    .ty-transfer-list-serach-icon {
        width: 17px;
        height: 17px;
        display: block;
        position: absolute;
        top: 4px;
        left: 22px;
        z-index: 10;
    }
    
    .ty-transfer-list-body {
        border-top: 1px solid #e8e8e8;
        padding: 4px 10px;
        height: 250px;
        overflow-y: auto;
        box-sizing: border-box;
    }
    
    .ty-transfer .ty-tree-arrow-right span, .ty-transfer .ty-tree-arrow-bottom span {
        margin-left: 0;
    }
    
    .ty-transfer .ty-tree-select-ul {
        padding-left: 38px;
    }
    
    .ty-transfer .ty-tree-div .tyc-check-blue {
        margin: 8px 6px;
    }
    
    .ty-transfer .ty-tree-div {
        height: 30px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }
    
    .ty-transfer .ty-tree-text {
        height: 30px;
        line-height: 30px;
        line-height: 30px;
        cursor: pointer;
    }
    
    .ty-transfer .ty-tree-switcher {
        height: 28px;
    }
    
    .ty-transfer-list-foot {
        background: #f1f1f1;
    }
    
    .ty-transfer-list-serach + .ty-transfer-list-body {
        height: 230px;
    }
    
    .ty-transfer-operation {
        padding: 107px 5px 0 5px;
    }
    
    .ty-transfer-operation span {
        display: block;
        width: 34px;
        height: 34px;
        text-align: center;
        position: relative;
        cursor: pointer;
        border: 1px solid #d9d9d9;
        border-radius: 50%;
        background-image: url("../assets/images/icon-little.png");
        background-repeat: no-repeat;
        background-color: #f3f3f3;
        transition: background-color 0.3s linear;
        -moz-transition: background-color 0.3s linear;
        -webkit-transition: background-color 0.3s linear;
        -o-transition: background-color 0.3s linear;
        
    }
    
    .ty-transfer-operation span i {
        font-size: 2em;
        color: #bbb;
    }
    
    .ty-transfer-operation span + span {
        margin-top: 25px;
    }
    
    .ty-transfer-operation span:hover {
        border: 1px solid #3dadf2;
        background-color: #7AC7F8;
    }
    
    .ty-transfer-operation span:hover i {
        color: #fff;
    }
    
    .ty-transfer-btn-toright, .ty-transfer-btn-toright.disabled:hover {
        background-position: 8px 2px;
    }
    
    .ty-transfer-btn-toright:hover, .ty-transfer-btn-toright.active, .ty-transfer-btn-toright.active:hover {
        background-position: 8px -23px;
    }
    
    .ty-transfer-btn-toleft, .ty-transfer-btn-toleft.disabled:hover {
        background-position: 6px -54px;
    }
    
    .ty-transfer-btn-toleft:hover, .ty-transfer-btn-toleft.active, .ty-transfer-btn-toleft.active:hover {
        background-position: 6px -79px;
    }
    
    .ty-transfer-operation span.active {
        border: 1px solid #3dadf2;
        background-color: #00A0E8;
    }
    
    .ty-transfer-operation span.active i {
        color: #fff;
    }
    
    .ty-transfer-btn-toleft.disabled:hover, .ty-transfer-btn-toright.disabled:hover {
        cursor: not-allowed;
        border: 1px solid #d9d9d9;;
        background-color: #f3f3f3;
    }
    
    .ty-transfer-operation .active:hover {
        background-color: #7AC7F8;
    }
    
    .ty-transfer-btn-totop, .ty-transfer-btn-totop.disabled:hover {
        background-position: 8px 2px;
        transform: rotate(-90deg);
    }
    
    .ty-transfer-btn-tobottom, .ty-transfer-btn-tobottom.disabled:hover {
        background-position: 8px 2px;
        transform: rotate(90deg);
    }
    
    .ty-transfer-btn-totop.disabled:hover, .ty-transfer-btn-tobottom.disabled:hover {
        cursor: not-allowed;
        border: 1px solid #d9d9d9;
        background-color: #f3f3f3;
    }
    
    .ty-transfer-btn-totop:hover, .ty-transfer-btn-totop.active, .ty-transfer-btn-totop.active:hover,
    .ty-transfer-btn-tobottom:hover, .ty-transfer-btn-tobottom.active, .ty-transfer-btn-tobottom.active:hover {
        background-position: 8px -23px;
    }
    
    .transfer-all-check {
        vertical-align: middle;
    }
    
    .show .ty-tabs {
        width: 460px;
    }
    
    .ty-tabs-nav {
        height: 38px;
        border-bottom: 2px solid #d9d9d9;
        position: relative;
    }
    
    .ty-tabs-nav > div {
        height: 40px;
        overflow: hidden;
        position: relative;
    }
    
    .ty-tabs-nav-scroll > div {
        width: auto;
        margin: 0 40px;
    }
    
    .ty-tabs-ul {
        width: 100%;
        height: 38px;
        position: absolute;
        top: 0;
        left: 0;
        z-index: 10;
    }
    
    .tabs-nav-scroll-ul {
        width: 1300px;
    }
    
    .ty-tabs-ul li {
        float: left;
        padding: 0 15px;
        height: 38px;
        line-height: 38px;
        font-size: 14px;
        color: #666;
        cursor: pointer;
    }
    
    .ty-tabs-ul li.current {
        color: #00a0e8;
    }
    
    .ty-tabs-icon-prev, .ty-tabs-icon-next {
        width: 38px;
        height: 38px;
        display: block;
        border-bottom: 2px solid #d9d9d9;
        cursor: pointer;
        position: absolute;
        top: 0;
        z-index: 100;
    }
    
    .ty-tabs-icon-prev {
        background-position: 15px -368px;
        left: 0;
    }
    
    .ty-tabs-icon-prev:hover {
        background-position: 15px -396px;
    }
    
    .ty-tabs-icon-next {
        background-position: 15px -424px;
        right: 0;
    }
    
    .ty-tabs-icon-next:hover {
        background-position: 15px -454px;
    }
    
    .ty-tabs-line {
        width: 86px;
        height: 2px;
        background: #00a0e8;
        position: absolute;
        bottom: -2px;
        left: 0;
        z-index: 101;
    }
    
    .ty-tabs-nav-scroll .ty-tabs-line {
        left: 40px;
    }
    
    .show .ty-tabs-card {
        width: 460px;
    }
    
    .ty-tabs-card-nav {
        height: 32px;
        position: relative;
    }
    
    .ty-tabs-card-nav > div {
        height: 32px;
        position: relative;
    }
    
    .ty-tabs-card-nav-scroll > div {
        width: auto;
        margin: 0 40px;
    }
    
    .ty-tabs-card-ul {
        width: 100%;
        height: 32px;
        position: absolute;
        top: 1px;
        left: 0;
        z-index: 10;
    }
    
    .ty-tabs-card-ul li {
        float: left;
        min-width: 48px;
        height: 30px;
        line-height: 30px;
        text-align: center;
        padding: 0 15px;
        font-size: 12px;
        color: #666;
        border: 1px solid #f1f1f1;
        border-bottom: 0;
        background: #f1f1f1;
        border-radius: 4px 4px 0 0;
        cursor: pointer;
    }
    
    .ty-tabs-card-ul li + li {
        margin-left: 8px;
    }
    
    .ty-tabs-card-ul li.current {
        color: #00a0e8;
        border: 1px solid #d9d9d9;
        border-bottom: 1px solid #fff;
        background: #fff;
    }
    
    .ty-tabs-card-con {
        border: 1px solid #d9d9d9;
    }
    
    .tabbox {
        width: 100%;
        height: 140px;
        margin: auto;
    }
    
    .tabbox .content {
        overflow: hidden;
        width: auto;
        height: auto;
        position: relative;
    }
    
    .tabbox .content ul {
        position: relative;
        left: 0;
        top: 0;
        height: auto;
    }
    
    .tabbox .content li {
        width: 1500px;
        height: auto;
        float: left;
        padding: 50px;
    }
    
    .tabbox .content li p {
        padding: 10px;
    }
    
    /*.ty-tabs-card-con{height:100px;padding-top:80px;}*/
    .ty-tabs-card-con > .mt20 {
        text-align: center;
    }
    
    .ty-tabs-card .ty-tabs-icon-prev, .ty-tabs-card .ty-tabs-icon-next {
        width: 32px;
        height: 32px;
        display: block;
        border-bottom: 0;
        cursor: pointer;
        position: absolute;
        top: 0;
        z-index: 100;
    }
    
    .ty-tabs-card .ty-tabs-icon-prev {
        background-position: 15px -371px;
        left: 0;
    }
    
    .ty-tabs-card .ty-tabs-icon-prev:hover {
        background-position: 15px -399px;
    }
    
    .ty-tabs-card .ty-tabs-icon-next {
        background-position: 15px -427px;
        right: 0;
    }
    
    .ty-tabs-card .ty-tabs-icon-next:hover {
        background-position: 15px -457px;
    }
    
    .ty-breadcrumb {
        height: 24px;
    }
    
    .ty-breadcrumb li {
        float: left;
        height: 24px;
        line-height: 24px;
        font-size: 14px;
        color: #999;
    }
    
    .ty-breadcrumb span {
        padding: 0 10px;
        color: #ccc;
        font-size: 14px;
    }
    
    .ty-breadcrumb a {
        color: #666;
        font-size: 14px;
    }
    
    .ty-breadcrumb a:hover {
        text-decoration: none;
        color: #00a0e8;
    }
    
    .ty-breadcrumb a:hover {
        font-weight: bold;
    }
    
    .ty-breadcrumb a.current:hover {
        color: #666;
        font-weight: bold;
        cursor: default;
    }
    
    .ty-breadcrumb a.current {
        font-weight: bold;
    }
    
    .four-icon.ty-transfer-operation {
        padding-top: 30px;
    }
    
    .ty-transfer-operation .ty-transfer-btn-zhiding,
    .ty-transfer-operation .ty-transfer-btn-zhidi {
        background-image: url(../assets/images/zhiding-zhidi.png);
        background-size: 27px 108px;
        background-repeat: no-repeat;
    }
    
    .ty-transfer-operation .ty-transfer-btn-zhiding:hover,
    .ty-transfer-operation .ty-transfer-btn-zhiding.active,
    .ty-transfer-operation .ty-transfer-btn-zhiding.active:hover {
        background-position: 4px -50px;
    }
    
    .ty-transfer-operation .ty-transfer-btn-zhidi:hover,
    .ty-transfer-operation .ty-transfer-btn-zhidi.active,
    .ty-transfer-operation .ty-transfer-btn-zhidi.active:hover {
        background-position: 4px -78px;
    }
    
    .ty-transfer-operation .ty-transfer-btn-zhiding.normal {
        background-position: 4px 4px;
    }
    
    .ty-transfer-operation .ty-transfer-btn-zhidi.normal {
        background-position: 4px -25px;
    }
    
    .ty-transfer-operation .ty-transfer-btn-zhiding.normal.active,
    .ty-transfer-operation .ty-transfer-btn-zhiding.normal:hover {
        background-position: 4px -50px;
    }
    
    .ty-transfer-operation .ty-transfer-btn-zhidi.normal.active,
    .ty-transfer-operation .ty-transfer-btn-zhidi.normal:hover {
        background-position: 4px -78px;
    }
    
    .ty-transfer-operation .ty-transfer-btn-zhiding.normal.disabled,
    .ty-transfer-operation .ty-transfer-btn-zhidi.normal.disabled {
        cursor: not-allowed;
        border: 1px solid #d9d9d9;
        background-color: #f3f3f3;
    }
    
    @font-face {
        font-family: 'iconfont';
        src: url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.eot');
        src: url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.eot?#iefix') format('embedded-opentype'),
        url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.woff2') format('woff2'),
        url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.woff') format('woff'),
        url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.ttf') format('truetype'),
        url('//at.alicdn.com/t/font_1467856_gfac3yoy5zk.svg#iconfont') format('svg');
    }
    
    .el-upload {
        float: left;
        padding-right: 10px;
    }
    
    a.custom-a-jump {
        color: #606266;
        text-decoration: none
    }
    
    a.custom-a-jump:hover {
        color: #409EFF;
    }
    
    .avatarUser {
        background: #409EFF;
        display: inline-block;
        vertical-align: bottom;
        font-size: 5px;
    }
    
    .transfer-left {
        text-align: left;
    }
    
    .transfer-center {
        display: inline-block;
        margin: 0 auto
    }
    
    .div-center {
        text-align: center;
    }
</style>
