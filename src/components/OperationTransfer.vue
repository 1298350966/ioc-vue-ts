<template>
    <div class="ty-transfer mt20 ml20">
        <el-form>
            <el-row v-if="isOptBtn">
                <el-form-item label="图标">
                    <custom-upload
                        @fromCustomChild="getFileIdFromCusUpload"></custom-upload>
                </el-form-item>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="跳转方式">
                        <el-radio v-model="startObj.type" label="0">弹窗</el-radio>
                        <el-radio v-model="startObj.type" label="1">当前页跳转</el-radio>
                        <el-radio v-model="startObj.type" label="2">新窗口跳转</el-radio>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="startObj.type === '0'">
                    <el-form-item label="弹窗标题">
                        <el-input v-model="startObj.label" style="width: 150px"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12">
                    <el-form-item label="链接方式" v-if="startObj.type === '0'">
                        <el-radio v-model="startObj.urlType" label="0">组件</el-radio>
                        <el-radio v-model="startObj.urlType" label="1">url路径</el-radio>
                    </el-form-item>
                    <el-form-item label="链接方式" v-if="startObj.type !== '0'">
                        <el-radio v-model="startObj.urlType" label="1">url路径</el-radio>
<!--                        <el-input v-model="startObj.url" style="width: 300px" placeholder="url地址"></el-input>-->
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="startObj.urlType === '0'">
                    <el-form-item label="相对路径">
                        <el-input v-model="startObj.url" style="width:300px"
                                  placeholder="@/components/form-build/FormBuild"></el-input>
                    </el-form-item>
                </el-col>
                <el-col :span="12" v-if="startObj.urlType === '1'">
                    <el-form-item label="url地址">
                        <el-input v-model="startObj.url" style="width: 300px" placeholder="http://10.10.10.31:9001/form/design"></el-input>
                    </el-form-item>
                </el-col>
            </el-row>
            <el-row>
                <el-col :span="12" v-if="startObj.urlType === '0'">
                    <el-form-item label="关联表单">
                        <el-select v-model="formId" filterable clearable placeholder="请选择" value="">
                            <el-option
                                v-for="item in formList"
                                :key="item.formId"
                                :label="item.formName"
                                :value="item.formId">
                            </el-option>
                        </el-select>
                    </el-form-item>
                </el-col>
            </el-row>
        </el-form>
        <div class="fl ty-transfer-list transfer-list-left">
            <div class="ty-transfer-list-head">
                <div class="tyc-check-blue dib ml10">
                    <input :disabled="sourceList.length === 0" type="checkbox" @click="toggleAll(0)"
                           :checked="selectedAllStatus(0)" class="transfer-all-check">
                    <span>全选</span>
                </div>
                <div class="dib fs14 fw ml5">{{sourcetitle}} {{selectSourceItemNumber}}/{{sourceList.length}}</div>
            </div>
            <div class="ty-transfer-list-body">
                <ul class="ty-tree-select">
                    <li v-for="item in sourceList">
                        <div class="ty-tree-div">
                            <label class="tyue-checkbox-wrapper">
		                            <span class="tyue-checkbox">
		                                <input type="checkbox" v-model="item.isSelected" class="tyue-checkbox-input">
		                                <span class="tyue-checkbox-circle"></span>
		                            </span>
                                <span class="tyue-checkbox-txt">{{item.name}}</span>
                            </label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="fl ty-transfer-operation">
                <span @click="toTarget"
                      :class="[sourceList.length !== 0 && sourceRefNum !== 0 ? 'active' : 'disabled', 'ty-transfer-btn-toright to-switch']"></span>
            <span @click="toSource"
                  :class="[targetList.length !== 0 && targetRefNum !== 0 ? 'active' : 'disabled', 'ty-transfer-btn-toleft to-switch']"></span>
        </div>
        <div class="fl ty-transfer-list transfer-list-right">
            <div class="ty-transfer-list-head">
                <div class="tyc-check-blue dib ml10">
                    <input :disabled="targetList.length === 0" type="checkbox" @click="toggleAll(1)"
                           :checked="selectedAllStatus(1)" class="transfer-all-check">
                    <span>全选</span>
                </div>
                <div class="dib fs14 fw ml5">{{targettitle}} {{selectTargetItemNumber}}/{{targetList.length}}</div>
            </div>
            <div class="ty-transfer-list-body">
                <ul class="ty-tree-select">
                    <li v-for="item in targetList">
                        <div class="ty-tree-div">
                            <label class="tyue-checkbox-wrapper">
		                            <span class="tyue-checkbox">
		                                <input type="checkbox" v-model="item.isSelected" class="tyue-checkbox-input">
		                                <span class="tyue-checkbox-circle"></span>
		                            </span>
                                <span class="tyue-checkbox-txt">{{item.name}}</span>
                            </label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="fl ty-transfer-operation four-icon">
                <span @click="moveItems(4)"
                      :class="[targetList.length !== 0 && targetRefNum !== 0? 'active' : 'disabled', 'ty-transfer-btn-zhiding to-switch  normal']"></span>
            <span @click="moveItems(0)"
                  :class="[targetList.length !== 0 && targetRefNum !== 0? 'active' : 'disabled', 'ty-transfer-btn-totop to-switch']"></span>
            <span @click="moveItems(1)"
                  :class="[targetList.length !== 0 && targetRefNum !== 0? 'active' : 'disabled', 'ty-transfer-btn-tobottom to-switch']"></span>
            <span @click="moveItems(3)"
                  :class="[targetList.length !== 0 && targetRefNum !== 0? 'active' : 'disabled', 'ty-transfer-btn-zhidi to-switch normal']"></span>
        </div>
        <div class="fl ty-transfer-list transfer-list-right">
            <div class="ty-transfer-list-head">
                <div class="tyc-check-blue dib ml10">
                    <span>参数名称</span>
                </div>
            </div>
            <div class="ty-transfer-list-body">
                <ul class="ty-tree-select">
                    <li v-for="item in targetList">
                        <div class="ty-tree-div">
                            <label class="tyue-checkbox-wrapper">
                                  <span class="tyue-checkbox">
                                      <input type="string" v-model="item.paramName" class="tyue-checkbox-input">
                                       <i class="el-icon-edit"></i>
                                  </span>
                            </label>
                        </div>
                    </li>
                </ul>
            </div>
        </div>
        <div class="clearboth"></div>
        <div slot="footer" class="dialog-footer" style="position: relative;left: 48%;padding:20px">
            <el-button type="primary" @click.native="submitData">保存</el-button>
        </div>
    </div>
</template>

<script>
    import CustomUpload from "@/components/CustomUpload";
    
    export default {
        name: "OperationTransfer",
        // sourcedata: 源数据集合
        // sourcetitle: 源数据标题
        // targetdata: 目标数据集合
        // targettitle 目标数据标题
        // startObj: 高级设置中报表导入导出设置的起始行,起始列数据对象
        components: {
            CustomUpload
        },
        props: ['sourcedata', 'sourcetitle', 'targetdata', 'targettitle', 'startObj', "isOptBtn", "formList"],
        watch: {
            targetdata() {
                var source = [];
                var target = this.targetdata;
                this.sourcedata.forEach(function (item) {
                    let data = target.filter(n => n.name === item.name);
                    if (data == null || data.length === 0) {
                        source.push(item);
                    }
                });
                this.sourceList = this.formatData(source);
                this.targetList = this.formatData(this.targetdata);
            },
            'startObj': function (newValue) {
                // console.log("监听" + JSON.stringify(newValue))
                this.formId = newValue.formId;
                if (this.startObj.type !== '0') {
                    this.startObj.urlType = '1';
                }
            },
            'startObj.type': function () {
                if (this.startObj.type !== '0') {
                    this.startObj.urlType = '1';
                }
            }
        },
        data() {
            return {
                sourceList: [],
                targetList: [],
                formId: ""
            }
        },
        computed: {
            // 源数据中选中的数量
            sourceRefNum() {
                return this.sourceList.filter(item => item.isSelected).length;
            },
            // 目标数据中选中的数量
            targetRefNum() {
                return this.targetList.filter(item => item.isSelected).length;
            },
            // 选择的源记录数量
            selectSourceItemNumber() {
                return this.sourceList.filter(item => item.isSelected).length;
            },
            // 选择目标记录数量
            selectTargetItemNumber() {
                return this.targetList.filter(item => item.isSelected).length;
            },
        },
        created() {
            var source = [];
            var target = this.targetdata;
            this.formId = this.startObj.formId;
            this.sourcedata.forEach(function (item) {
                let data = target.filter(n => n.name === item.name);
                if (data == null || data.length === 0) {
                    source.push(item);
                }
            });
            this.sourceList = this.formatData(source);
            this.targetList = this.formatData(this.targetdata);
        },
        methods: {
            getFileIdFromCusUpload(fileId) {
                if (!this.KHUtils.isNull(fileId)) {
                    // 存储文件ID便于后续对文件访问的权限控制
                    this.startObj.imageId = fileId;
                }
            },
            // 通知父组件重新加载,并获取选中后的节点数据
            submitData() {
                let _this = this;
                this.$emit("submitDataToParent", _this.targetList, _this.startObj, _this.formId);
            },
            formatData(dataList) {
                let data = dataList.map(item => {
                    return {
                        ...item,
                        isSelected: false
                    };
                });
                return data;
            },
            moveItems(direction) {
                let selectedItem = this.targetList.filter(item => item.isSelected).map(item => {
                    return item.name;
                });
                if (direction === 1) {//下移
                    for (var i = selectedItem.length - 1; i >= 0; i--) {
                        let index = this.targetList.map(item => {
                            return item.name;
                        }).indexOf(selectedItem[i]);
                        if (index >= this.targetList.length - 1) return;
                        this.targetList[index] = this.targetList.splice(index + 1, 1, this.targetList[index])[0];
                    }
                }
                if (direction === 0) {//上移
                    for (var i = 0; i < selectedItem.length; i++) {
                        let index = this.targetList.map(item => {
                            return item.name;
                        }).indexOf(selectedItem[i]);
                        if (index <= 0) return;
                        this.targetList[index] = this.targetList.splice(index - 1, 1, this.targetList[index])[0];
                    }
                }
                if (direction === 3) {//置底
                    for (var i = 0; i < selectedItem.length; i++) {
                        let index = this.targetList.map(item => {
                            return item.name;
                        }).indexOf(selectedItem[i]);
                        if (index >= this.targetList.length - 1) return;
                        this.targetList.push(this.targetList[index]);
                        this.targetList.splice(index, 1);
                    }
                }
                if (direction === 4) {//置顶
                    for (var i = selectedItem.length - 1; i >= 0; i--) {
                        let index = this.targetList.map(item => {
                            return item.name;
                        }).indexOf(selectedItem[i]);
                        if (index <= 0) return;
                        this.targetList.unshift(this.targetList[index]);
                        this.targetList.splice(index + 1, 1);
                    }
                }
            },
            exchange(fd, td) {
                let selectedItem = fd.filter(item => item.isSelected).map(item => {
                    return {
                        ...item,
                        isSelected: false
                    };
                });
                td.push(...selectedItem);
                var selectedlist = fd.filter(item => !item.isSelected);
                return selectedlist;
            },
            // 全选状态
            selectedAllStatus(type) {
                if (type === 0) {
                    if (this.selectSourceItemNumber === this.sourceList.length && this.selectSourceItemNumber !== 0) {
                        return true;
                    } else {
                        return false;
                    }
                } else {
                    if (this.selectTargetItemNumber === this.targetList.length && this.selectTargetItemNumber !== 0) {
                        return true;
                    } else {
                        return false;
                    }
                }
            },
            // 全选及反选
            toggleAll(type) {
                if (type === 0) {
                    let len = this.sourceList.length;
                    let slen = this.sourceList.filter(item => item.isSelected).length;
                    if (len !== slen) {
                        this.sourceList.map(item => (item.isSelected = true));
                    } else {
                        this.sourceList.map(item => (item.isSelected = false));
                    }
                } else {
                    let len = this.targetList.length;
                    let slen = this.targetList.filter(item => item.isSelected).length;
                    if (len !== slen) {
                        this.targetList.map(item => (item.isSelected = true));
                    } else {
                        this.targetList.map(item => (item.isSelected = false));
                    }
                }
            },
            // 把选择数据转移到目标（右框）
            toTarget() {
                this.sourceList = this.exchange(this.sourceList, this.targetList);
            },
            // 把选择数据转回到源（左框）
            toSource() {
                this.targetList = this.exchange(this.targetList, this.sourceList);
            }
        }
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
        width: 200px;
        height: 350px;
        border: 1px solid #e8e8e8;
        border-radius: 3px;
        background: #fff;
        box-shadow: 0 0 5px #e8e8e8
    }
    
    .ty-transfer-list-head {
        height: 32px;
        line-height: 32px;
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
        height: 318px;
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
        padding-top: 70px;
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
    
    .el-item-magin {
        margin-bottom: 5px;
    }
</style>
