<template>
    <div>
        <el-input
            style="width: 300px"
            v-model="item.targetName"
            placeholder="请选择报表"
            @focus="selectReportVisible = true"
            clearable
            @clear="item.targetId=''"
        ></el-input>

        <div style="margin-top: 10px;margin-bottom: 10px">
            <span class="secondary-font-color">关联设置</span>
            <el-button type="primary" icon="el-icon-plus" circle @click.native="addParams"></el-button>
            <el-row :span="24" style="margin-top: 10px;margin-bottom: 5px">
                <el-col :span="10">
                    <span class="secondary-font-color">当前表单</span>
                </el-col>
                <el-col :span="10" style="margin-left: 5px;margin-right: 5px">
                    <span class="secondary-font-color">报表参数</span>
                </el-col>
                <el-col :span="2">

                </el-col>
            </el-row>
            <div v-if="item.params instanceof Array && item.params.length >0" v-for="(param,index) in item.params"
                 :key="index" style="margin-bottom: 10px;padding-right: 10px">
                <el-row :span="24">
                    <el-col :span="10">
                        <el-select v-model="param.model" placeholder="请选择参数">
                            <el-option
                                v-for="col in dynCols"
                                :key="col.model"
                                :label="col.name"
                                :value="col.model">
                            </el-option>
                        </el-select>
                    </el-col>
                    <el-col :span="10" style="margin-left: 5px;margin-right: 5px">
                        <el-input v-if="param.reportParam && param.reportParam.dimOrMeasure" v-model="param.reportParam.dimOrMeasure.columnLabel" placeholder="请选择报表参数"
                                  @focus="setReportParam(param.reportParam)"></el-input>
                    </el-col>
                    <el-col :span="2">
                        <el-button type="danger" icon="el-icon-delete" circle
                                   @click.native="deleteParams(index)"></el-button>
                    </el-col>
                </el-row>

            </div>
        </div>
        <el-dialog
            title="报表参数设置" v-if="setReportDialogVisible"  :visible.sync="setReportDialogVisible" custom-class="col-cond-filter-dialog" :modal=false :append-to-body="true"  width="40%">
            <el-row style="width: 100%;margin-bottom: 10px;text-align: center">
                <el-col :span="1">
                    &nbsp;
                </el-col>
                <el-col :span="7">
                    <span>请选择图</span>
                </el-col>
                <el-col :span="7">
                    <span>数据集</span>
                </el-col>
                <el-col :span="7">
                    <span>请选择字段</span>
                </el-col>
            </el-row>
            <el-checkbox-group v-if="currentReportParam" v-model="currentReportParam.widget" @change="handleCheckedChange">
                <el-row v-for="(item,index) in dataChartOptions" :key="index">
                    <el-col :span="1">
                        <el-checkbox style="margin-top: 5px"  :label="item.widgetId">&nbsp;</el-checkbox>
                    </el-col>
                    <el-col :span="7" style="padding-left: 10px;padding-right: 10px">
                        <el-tooltip :content="item.label" placement="top-start">
                            <el-input class="w95"  :value="item.label" :disabled="true" ></el-input>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="7" style="padding-left: 10px;padding-right: 10px">
                        <el-tooltip :content="item.dsName" placement="top">
                            <el-input class="w95"  :value="item.dsName" :disabled="true"></el-input>
                        </el-tooltip>
                    </el-col>
                    <el-col :span="7" style="padding-left: 10px;padding-right: 10px">
                        <!-- @click.native="getDimOrMeasure()" filterable v-model="chartColumn" @change="changeChartColumn(chartColumn)"-->
                        <el-select v-if="index==0" filterable v-model="currentReportParam.charKey" @change="changeChartColumn(currentReportParam.charKey)"  class="w95">
                            <el-option-group label="维度">
                                <el-option  v-for="(item,index) in dataSetDims" :label="item.columnLabel"
                                            :key="index" :value="toTran(index,0)" class="option1-box" >
                                  <span style="float: left; color: #468CFF; font-size: 13px;width: 40px">
                                     {{ item.dataType==="String"?"Str.":(item.dataType==="Date"?"Date.":"No.")}}
                                  </span>
                                    <el-tooltip  :content="item.columnLabel" placement="top" style="float: left">
                                        <span>{{ item.columnLabel}}</span>
                                    </el-tooltip>
                                </el-option>
                            </el-option-group>
                            <el-option-group label="度量">
                                <el-option v-for="(item,index) in dataSetMeasures" :label="item.columnLabel"
                                           :key="index" :value="toTran(index,1)" :title="item.columnLabel" class="option1-box">
                                  <span style="float:left; color: #64BD4F; font-size: 13px;width: 40px">
                                    {{item.dataType==="Number"?"No.":"Str."}}
                                  </span>
                                    <el-tooltip  :content="item.columnLabel" placement="top"  style="float: left">
                                        <span>{{ item.columnLabel}}</span>
                                    </el-tooltip>
                                </el-option>
                            </el-option-group>
                        </el-select>
                    </el-col>
                </el-row>
            </el-checkbox-group>
            <span slot="footer" class="dialog-footer">
            <el-button @click="setReportDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="setReportDialogVisible = false">确 定</el-button>
           </span>
        </el-dialog>
        <select-report
            v-if="selectReportVisible"
            :reportId="item.targetId"
            :visible.sync="selectReportVisible"
            @onData="SelectReportData">
        </select-report>
    </div>
</template>

<script>
    import SelectReport from "@/components/SelectReport";
    export default {
        name: "FormInnerReportSet",
        components: {
            SelectReport
        },
        props: ['item', 'dynCols'],
        created(){
            this.queryReportSet();
        },
        data() {
            return {
                selectReportVisible: false,
                setReportDialogVisible: false,
                reportSet: null,
                widgets: [],
                dataChartOptions:[],
                dataSetDims:[],
                dataSetMeasures:[],
                currentReportParam:null
            }
        },
        watch: {
            'item.targetId': {
                handler() {
                    this.queryReportSet();
                    this.$set(this.item,'params',[]);
                    this.$emit("notifyUpdateInnerComponent");
                }
            }
        },
        methods: {
            changeChartColumn(charKey){
                let _this = this;
                let index=charKey.split(",")[0];//下标
                let type=charKey.split(",")[1]; //类型--维度0,度量1
                if (type==0){ //维度
                      _this.currentReportParam.dimOrMeasure=_this.dataSetDims[index];
                } else {  //度量
                    _this.currentReportParam.dimOrMeasure=_this.dataSetMeasures[index];
                }

            },
            /*对选中的维度或度量存储其类型或者是下标*/
            toTran(index,type){
                let param=index+","+type;
                return param;
            },
            handleCheckedChange(value){
                let _this=this;
                for (let i=0;i<value.length;i++){
                    for(let j=1;j<value.length;j++){
                        if (value[i]==value[j]){
                        }else{
                            let dsId1;
                            let dsId2;
                            for (let n=0;n<_this.dataChartOptions.length;n++){
                                if (_this.dataChartOptions[n].widgetId==value[i]){
                                    dsId1=_this.dataChartOptions[n].dsId;
                                }
                                if (_this.dataChartOptions[n].widgetId==value[j]){
                                    dsId2=_this.dataChartOptions[n].dsId
                                }
                            }
                            if (dsId1!==dsId2){
                                _this.$message.error("请选择选择相同数据集的图表")
                                value.pop();
                            }
                        }
                    }
                }

                if (!_this.KHUtils.isNull(_this.currentReportParam.widget[0])){
                    let dsId=_this.getDataSetId(_this.currentReportParam.widget[0]);
                    _this.getDataSetDimAndMeasure(dsId);
                }


            },
            /*根据组件id获取获取数据集ID*/
            getDataSetId(widgetId){
                let _this=this;
                for (let i=0;i<_this.dataChartOptions.length;i++){
                    if (_this.dataChartOptions[i].widgetId==widgetId){
                        return _this.dataChartOptions[i].dsId;
                    }
                }
            },
            queryReportSet(){
                let _this = this;
                _this.widgets = [];
                _this.dataChartOptions = [];
                if(_this.item.innerType != '3'){
                    return false;
                }
                if (!_this.KHUtils.isNull(_this.item.targetId)) {
                    _this.$Get(_this.khConfig.api.getReportConf + "/" + _this.item.targetId).then(res => {
                        if (res.errCode === 0) {
                            if (!_this.KHUtils.isNull(res.reportConf)) {
                                _this.reportSet = JSON.parse(res.reportConf.settingMeta);
                                if (_this.KHUtils.isNull(_this.reportSet)) {
                                /*    _this.$notify.warning({
                                        title: '警告',
                                        message: "报表ID(" + _this.item.targetId + "): 暂未进行相关的报表设计"
                                    });*/
                                    return false;
                                }
                                _this.widgets = _this.reportSet.widgets;
                                if(_this.widgets instanceof Array && _this.widgets.length >0){
                                    for (let i=0;i<_this.widgets.length;i++){
                                        if (_this.widgets[i].type=='reportWidget'&&!_this.KHUtils.isNull(_this.widgets[i].data.dataset)){ /*一级图表*/
                                            let param={
                                                label:_this.widgets[i].name,
                                                widgetId:_this.widgets[i].id+"", //控件id
                                                dsId:_this.widgets[i].data.dataset,
                                                dsName:_this.widgets[i].data.dsName
                                            }
                                            _this.dataChartOptions.push(param);
                                        }
                                    }

                                }


                            } else {
                            /*    _this.$notify.warning({
                                    title: '警告',
                                    message: "报表ID(" + _this.reportId + "): 暂未进行相关的报表设计"
                                });*/
                            }
                        }
                    });
                }
            },

            /*根据数据集Id获取维度和度量*/
            getDataSetDimAndMeasure(dsId){
                /*查询根据数据集id获取数据集对象*/
                let _this=this;
                _this.dataSetDims=[];
                _this.dataSetMeasures=[];
                _this.$Get(_this.khConfig.api.getDataSetConfById+"/"+dsId).then(res=>{
                    if (res.errCode === 0) {
                        let columns=JSON.parse(res.dataSetConf.dsMeta).columns;//数据集中的维度和度量的数组对象
                        let dataSetDim=columns.dim;   //维度数组
                        let dataSetMeasure=columns.measure;//度量数组
                        //遍历度量数组
                        for (let i=0;i<dataSetMeasure.length;i++){
                            let dsTableName=dataSetMeasure[i].table; //数据集中的表名
                            let tableMeasures=dataSetMeasure[i].columns;//获取当前表的度量数组
                            for (let j=0;j<tableMeasures.length;j++){
                                let tabMeasure=tableMeasures[j];
                                let measureLabel="";
                                if (_this.KHUtils.isNull(tabMeasure.column)){
                                    measureLabel=tabMeasure.alias;
                                } else {
                                    measureLabel=tabMeasure.column;
                                    if (!_this.KHUtils.isNull(tabMeasure.alias)){
                                        measureLabel=tabMeasure.alias+"("+measureLabel+")";//度量名称(类型)
                                    }
                                }

                                let tabAndMeasure={
                                    dataType:tabMeasure.dataType,
                                    type:tabMeasure.dataType,
                                    columnName:tabMeasure.column,
                                    columnLabel:measureLabel,
                                    tableName:dsTableName,
                                    dsId:dsId,
                                    alias:tabMeasure.alias,
                                    express:tabMeasure.express,
                                    columnType:'measure'
                                }
                                _this.dataSetMeasures.push(tabAndMeasure);
                            }
                        }
                        //遍历维度数组
                        for (let i=0;i<dataSetDim.length;i++){
                            let dsTableName=dataSetDim[i].table;
                            let tableDims=dataSetDim[i].columns;
                            for (let j=0;j<tableDims.length;j++){
                                let tabDim=tableDims[j];
                                /*判断这个维度数据是否为Timestamp类型*/
                                if (tabDim.dataType=="Timestamp"||tabDim.dataType=="Date"){
                                    let dimColumnLabel="";
                                    if (_this.KHUtils.isNull(tabDim.column)){
                                        dimColumnLabel=tabDim.alias;
                                    } else {
                                        dimColumnLabel=tabDim.column;
                                        if (!_this.KHUtils.isNull(tabDim.alias)){
                                            dimColumnLabel=tabDim.alias+"("+dimColumnLabel+")";//度量名称(类型)
                                        }
                                    }
                                    for (let k=0;k<9;k++){
                                        let tabColumnName=tabDim.column;
                                        let tabAndDim={
                                            dataType:"Date",
                                            type: _this.numToDataFormat(k),
                                            dateDim: _this.numToDataFormat(k),
                                            columnName:tabColumnName,
                                            columnLabel:dimColumnLabel+"("+_this.numToDataFormat(k)+")",
                                            tableName:dsTableName,
                                            dsId:dsId,
                                            express:tabDim.express,
                                            columnType:'dim',
                                            alias:tabDim.alias
                                        }
                                        _this.dataSetDims.push(tabAndDim);
                                    }
                                } else{  /*普通的数据类型*/
                                    let dimColumnLabel="";
                                    if (_this.KHUtils.isNull(tabDim.column)){
                                        dimColumnLabel=tabDim.alias;
                                    } else {
                                        dimColumnLabel=tabDim.column;
                                        if (!_this.KHUtils.isNull(tabDim.alias)){
                                            dimColumnLabel=tabDim.alias+"("+dimColumnLabel+")";//度量名称(类型)
                                        }
                                    }
                                    let tabAndDim={
                                        dataType:tabDim.dataType,
                                        type:tabDim.dataType,
                                        columnName:tabDim.column,
                                        columnLabel:dimColumnLabel,
                                        tableName:dsTableName,
                                        dsId:dsId,
                                        express:tabDim.express,
                                        columnType:'dim',
                                        alias:tabDim.alias
                                    }
                                    _this.dataSetDims.push(tabAndDim);
                                }

                            }
                        }


                    }

                });

            },

            /*时间类型分解具体的时间格式*/
            numToDataFormat(num){
                switch (num) {
                    case 0:return "year";
                    case 1:return "quarter";
                    case 2:return "week";
                    case 3:return "month";
                    case 4:return "day";
                    case 5:return "hour";
                    case 6:return "minute";
                    case 7:return "second";
                    case 8:return "ymdhms";
                }
            },
            setReportParam(reportParam){
                let _this = this;
                this.currentReportParam = null;
                this.currentReportParam = reportParam;
                if(_this.currentReportParam.widget instanceof  Array && _this.currentReportParam.widget .length >0){
                    if (!_this.KHUtils.isNull(_this.currentReportParam.widget[0])){
                        let dsId=_this.getDataSetId(_this.currentReportParam.widget[0]);
                        _this.getDataSetDimAndMeasure(dsId);
                    }
                }
                this.setReportDialogVisible = true;
            },
            SelectReportData(dataObj) {
                this.$set(this.item,'targetId',dataObj.reportId);
                this.$set(this.item,'targetName',dataObj.reportName);
                this.selectReportVisible = false;
            },
            addParams(){
                
                if (this.KHUtils.isNull(this.item.params)) {
                    this.$set(this.item, 'params', []);
                }
                let obj = {model: "", reportParam: {
                    widget:[],
                    dimOrMeasure:{

                    }
                }};
                this.item.params.push(obj);
            },
            deleteParams(index){
                if (this.item.params instanceof Array && this.item.params.length > 0) {
                    this.item.params.splice(index, 1)
                }
            },
        }

    }
</script>

<style lang="scss" scoped>
    ::v-deep .col-cond-filter-dialog {
        margin-left: 20%;
    .el-dialog__body {
        padding: 15px 15px !important;
        height: 500px !important;
        background-color: #FFFFFF;
        overflow-y: auto !important;

    /*滚动条里面小方块*/
    &::-webkit-scrollbar-thumb {
         background-color: #EBEAEF;
         border-radius: 10px;
     }
    /*滚动条整体样式*/
    &::-webkit-scrollbar {
         width: 6px;
         height: 6px;
     }
    /*滚动条里面轨道*/
    &::-webkit-scrollbar-track {
         background: #FFFFFF;
         border-radius: 10px;
     }
    }

    .el-dialog__header {
        background-color: #F8F8FA;
        border-bottom: 1px solid #E8E8E8;
        padding-left: 10px !important;
        padding-top: 15px !important;
        padding-bottom: 15px !important;
    }

    .el-dialog__footer {
        padding-top: 5px;
        padding-bottom: 5px;
        background-color: #F8F8FA !important;
    }
    }

    .secondary-font-color {
        color: #C0C3CB;
    }
</style>
