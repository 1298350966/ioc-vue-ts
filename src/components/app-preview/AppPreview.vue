<template>
    <div style="width: 100%;height: 100%;overflow: hidden;">
        <el-card class="box-card">
            <el-input style="margin-bottom: 10px" v-if="appSensorSettings.queryCondition && appSensorSettings.queryCondition.conditions instanceof Array && appSensorSettings.queryCondition.conditions.length>0"
                      :placeholder="appSensorSettings.queryCondition.placeholder"
                      prefix-icon="el-icon-search"
            />
            <div v-for="(item,index) in datas" :key="index">
                <el-card class="item-card">

                    <div class="title-div"
                         v-if="appSensorSettings && appSensorSettings.tableItem && appSensorSettings.tableItem.title instanceof Array &&appSensorSettings.tableItem.title.length>0">
                        <span>{{getTitle(item)}}</span>
                        <span class="right-top">{{getRightTopContent(item)}}</span>
                    </div>

                    <div v-for="(col,index) in appSensorSettings.tableItem.cols" :key="index"
                         v-if="appSensorSettings && appSensorSettings.tableItem && appSensorSettings.tableItem.cols instanceof Array &&appSensorSettings.tableItem.cols.length>0">
                        <el-row class="item-content-row">
                            <span class="item-content-name">{{KHUtils.isNull(col.alias) ? col.name : col.alias}}:</span>
                            <span class="item-content">{{getContent(item, col)}}</span>
                        </el-row>
                    </div>
                    <el-row :span="24" v-if="isExitFooter">
                        <el-divider></el-divider>
                        <el-col :span="12" class="left-bottom" style="min-height: 10px">
                                      <span
                                          v-if="appSensorSettings && appSensorSettings.tableItem && appSensorSettings.tableItem.leftBottom instanceof Array && appSensorSettings.tableItem.leftBottom.length>0">
                                {{getLeftContent(item)}}
                                 </span>

                        </el-col>
                        <el-col :span="12" class="right-bottom">
                             <span
                                 v-if="appSensorSettings && appSensorSettings.tableItem && appSensorSettings.tableItem.rightBottom instanceof Array && appSensorSettings.tableItem.rightBottom.length>0">
                                {{getRightContent(item)}}
                            </span>
                        </el-col>
                    </el-row>
                </el-card>
            </div>
        </el-card>
    </div>
</template>

<script>
    export default {
        name: "AppPreview",
        props: {
            colsArray: {type: Array},
            formConfig: {type: Object},
            reviewAppEventListen:{type:Number},
            formId:{type:Number},
            appSensorSettings:{type:Object}
        },
        watch:{
            reviewAppEventListen: {
                deep: true,
                handler() {
                   this.queryAppData();
                }
            },
        },
        data(){
            return {
                datas: [],
                queryParam: {
                    pageNum: 1,    // 查询参数
                    pageSize: 10,
                    formId: this.formId,
                    tableItem: {},
                    queryConditions: []
                },
            }
        },
        computed: {
            getTitle()  {
                return function (item) {
                    let _this = this;
                    if (_this.appSensorSettings && _this.appSensorSettings.tableItem && _this.appSensorSettings.tableItem.title instanceof Array && _this.appSensorSettings.tableItem.title.length > 0) {
                        let titleObj = _this.appSensorSettings.tableItem.title[0];
                        let title = "";
                        if (titleObj.format && !_this.KHUtils.isNull(titleObj.format.prefix)) {
                            title = title.concat(titleObj.format.prefix);
                        }
                        title = title.concat(item[titleObj.key]);
                        if (titleObj.format && !_this.KHUtils.isNull(titleObj.format.suffix)) {
                            title = title.concat(titleObj.format.suffix);
                        }
                        return title;

                    }
                }
            },
            getContent(){
                return function (item, col) {
                    let _this = this;
                    return item[col.key];

                }
            },
            getRightTopContent(){
              return function (item) {
                  let _this = this;
                  if (_this.appSensorSettings && _this.appSensorSettings.tableItem && _this.appSensorSettings.tableItem.rightTop instanceof Array &&  _this.appSensorSettings.tableItem.rightTop.length>0) {
                      let rightTopObj = _this.appSensorSettings.tableItem.rightTop[0];
                      let content = "";
                      if (rightTopObj.format && !_this.KHUtils.isNull(rightTopObj.format.prefix)) {
                          content = content.concat(rightTopObj.format.prefix);
                      }
                      if(!_this.KHUtils.isNull(item[rightTopObj.key])){
                          content = content.concat(item[rightTopObj.key]);
                      }
                      if (rightTopObj.format && !_this.KHUtils.isNull(rightTopObj.format.suffix)) {
                          content = content.concat(rightTopObj.format.suffix);
                      }
                      return content;
                  }
              }
            },
            getRightContent(){
                return function (item) {
                    let _this = this;
                    if (_this.appSensorSettings && _this.appSensorSettings.tableItem && _this.appSensorSettings.tableItem.rightBottom instanceof Array &&  _this.appSensorSettings.tableItem.rightBottom.length>0) {
                        let rightObj = _this.appSensorSettings.tableItem.rightBottom[0];
                        let content = "";
                        if (rightObj.format && !_this.KHUtils.isNull(rightObj.format.prefix)) {
                            content = content.concat(rightObj.format.prefix);
                        }
                        if(!_this.KHUtils.isNull(item[rightObj.key])){
                            content = content.concat(item[rightObj.key]);
                        }
                        if (rightObj.format && !_this.KHUtils.isNull(rightObj.format.suffix)) {
                            content = content.concat(rightObj.format.suffix);
                        }
                        return content;
                    }
                }
            },
            getLeftContent(){
                return function (item) {
                    let _this = this;
                    if (_this.appSensorSettings && _this.appSensorSettings.tableItem && _this.appSensorSettings.tableItem.leftBottom instanceof Array && _this.appSensorSettings.tableItem.leftBottom.length>0) {
                        let leftObj = _this.appSensorSettings.tableItem.leftBottom[0];
                        let content = "";
                        if (leftObj.format && !_this.KHUtils.isNull(leftObj.format.prefix)) {
                            content = content.concat(leftObj.format.prefix);
                        }
                        if(!_this.KHUtils.isNull(item[leftObj.key])){
                            content = content.concat(item[leftObj.key]);
                        }

                        if (leftObj.format && !_this.KHUtils.isNull(leftObj.format.suffix)) {
                            content = content.concat( leftObj.format.suffix);
                        }
                        return content;
                    }
                }
            },
            isExitFooter: function () {
                let _this = this;
                let isExit = false;
                if (_this.appSensorSettings && _this.appSensorSettings.tableItem) {
                    if (_this.appSensorSettings.tableItem.leftBottom && _this.appSensorSettings.tableItem.leftBottom instanceof Array && _this.appSensorSettings.tableItem.leftBottom.length>0) {
                        isExit = true;
                    }
                    if (_this.appSensorSettings.tableItem.rightBottom  && _this.appSensorSettings.tableItem.rightBottom instanceof Array && _this.appSensorSettings.tableItem.rightBottom.length>0) {
                        isExit = true;
                    }
                }
                return isExit;
            }
        },
        created(){

        },
        mounted(){
            this.queryAppData();
        },
        methods: {
            queryAppData(){
                this.datas = [];
                this.queryParam.tableItem = this.appSensorSettings.tableItem;
                this.$PostJson(this.khConfig.api.previewQueryAppFormData, this.queryParam).then(res => {
                    if (res.errCode === 0) {
                        this.datas = res.datas;
                    } else {

                    }
                });
            }
        }
    }
</script>

<style scoped lang="scss">
    .box-card {
        width: 375px;
        height: 670px;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        margin: auto;
        margin-top: 50px;
        background-color: #F6F6F6;
        overflow-y: scroll;

    }

    .box-card::-webkit-scrollbar {
        display: none;
    }

    .item-card {
        width: 100%;
        margin-bottom: 10px;

    }

    ::v-deep .box-card .el-card__body {
        padding: 10px 10px;
    }

    ::v-deep .box-card .el-card__header {
        padding: 10px 10px;
    }

    ::v-deep .item-card .el-card__body {
        padding: 10px 10px;
    }

    ::v-deep .item-card .el-card__header {
        padding: 10px 10px;
    }

    .title-div {
        font-weight: bold;
        font-size: 16px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .item-content-row {
        margin-top: 3px;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
    }

    .item-content-name {
        color: #A3A2A7;
    }

    .item-content {
        color: #474C51;
        margin-left: 10px;
    }
    .right-top{
        float: right;
        color: #474C51;
        font-size: 14px;
    }
    .right-bottom {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        text-align: right;
        color: #A3A2A7;
        padding-left: 5px;
    }

    .left-bottom {
        text-overflow: ellipsis;
        overflow: hidden;
        white-space: nowrap;
        color: #A3A2A7;
        padding-right: 5px;
    }

    ::v-deep .el-divider.el-divider--horizontal {
        display: block;
        height: 1px;
        width: 100%;
        margin: 10px 0;
    }
</style>
