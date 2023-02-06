<template>
    <section>
        <el-container style="height: 50%">
            <el-main class="dim-select-list">
                <template v-if="dimShow">
                    <el-header class="myHeader headerTitle" style="height:30px;background-color: #2b3551">
                        <span class="whiteFont" v-if="dimShow">维度</span>
                    </el-header>
                    <el-tree
                        ref="dimTree"
                        class="dataSetTree"
                        default-expand-all
                        :show-checkbox="true"
                        :props="dimTreeProps"
                        :data="dimTreeData"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        check-strictly
                        @check="checkedDim"
                    >
                        <div slot-scope="{ node, data }">
                            <span class="blueFont" v-if="data.dataType==='String'">Str.</span>
                            <span class="blueFont"
                                  v-else-if="data.dataType==='Timestamp' || data.dateType==='Date' || data.dateType==='Time'">Date.</span>
                            <span v-else class="blueFont">{{data.dataType}}</span>
                            <template v-if="data.alias">
                                <span class="whiteFont">{{data.column + '(' + data.alias + ')'}}</span>
                            </template>
                            <template v-else>
                                <span class="whiteFont">{{data.column}}</span>
                            </template>
                        </div>
                    </el-tree>
                </template>
                <!--度量-->
                <template v-if="measureShow">
                    <el-header class="myHeader headerTitle" style="height:30px;background-color: #2b3551">
                        <span class="whiteFont" v-if="measureShow">度量</span>
                    </el-header>
                    <el-tree
                        ref="measureTree"
                        class="dataSetTree"
                        default-expand-all
                        :show-checkbox="true"
                        :props="measureTreeProps"
                        :data="measureTreeData"
                        :expand-on-click-node="false"
                        :filter-node-method="filterNode"
                        check-strictly
                        @check="checkedMeasure"
                    >
                        <div slot-scope="{ node, data }">
                            <span class="greenFont" v-if="data.dataType==='Number'">No</span>
                            <span v-else>{{data.dataType}}</span>
                            <template v-if="data.alias">
                                <span class="whiteFont">{{data.column + '(' + data.alias + ')'}}</span>
                            </template>
                            <template v-else>
                                <span class="whiteFont">{{data.column}}</span>
                            </template>
                        </div>
                    </el-tree>
                </template>
            </el-main>
        </el-container>


    </section>
</template>

<script>
    export default {
        name: "DimMeasureTreeSelect",
        created() {
        },
        props: {
            selectDownNum: {required: true, type: Number},
            selectType: {required: true, type: String},
            dimTreeData: {required: true, type: Array},
            measureTreeData: {required: true, type: Array},
            dimTreeProps: {required: true, type: Object},
            measureTreeProps: {required: true, type: Object},
        },
        computed: {
            dimShow: function () {
                return this.KHUtils.isNull(this.selectType) || this.selectType === 'classAxis' || this.selectType === 'colorAxis' || this.selectType === 'condFilters'
                    || this.selectType === 'rowAxis' || this.selectType === 'colAxis' || this.selectType === 'drillingAxis' || this.selectType === 'tableDrillingAxis';
            },
            measureShow: function () {
                return this.KHUtils.isNull(this.selectType) || this.selectType === 'valueAxis' || this.selectType === 'viceValueAxis' || this.selectType === 'condFilters' || this.selectType === 'colAxis';
            }
        },
        data() {
            return {
                filterTreeData: '',
                checkedNodes: [],
            }
        },
        watch: {
            filterTreeData(val) {
                this.$refs.dimTree.filter(val);
                this.$refs.measureTree.filter(val);
            },
            selectDownNum() {
                this.$emit("getCheckedNodes", this.checkedNodes);
            }
        },
        mounted() {
            let _this = this;
        },
        methods: {
            // 维度,度量查询
            filterNode(value, data) {
                if (!value) return true;
                return data.column.indexOf(value) !== -1;
            },
            checkedMeasure(currentNode, checkedKeys) {
                this.checked(currentNode, checkedKeys, 'measure');
            },
            checkedDim(currentNode, checkedKeys) {
                this.checked(currentNode, checkedKeys, 'dim');
            },
            // 过滤条件的动态新增
            checked(currentNode, checkedKeys, type) {
                let _this = this;
                // 如果是父节点,则不允许选择
                if (currentNode.children instanceof Array && currentNode.children.length > 0) {
                    return false;
                }
                // check框选中 Or 取消选中都会触发
                let checked = false;
                if (checkedKeys.checkedNodes instanceof Array) {
                    let compareName = _this.KHChart.splicingColumnSetNoIdWithTableName(currentNode, _this);
                    checkedKeys.checkedNodes.forEach(obj => {
                        let tempName = _this.KHChart.splicingColumnSetNoIdWithTableName(obj, _this);
                        if (tempName === compareName) {
                            // 选中状态
                            checked = true;
                        }
                    })
                }
                // 选中状态
                let data = currentNode;
                let newObj = {};
                newObj.type = type;
                newObj.table = data.table;
                newObj.column = data.column;
                newObj.desc = data.desc;
                newObj.dataType = data.dataType;
                newObj.alias = data.alias;
                newObj.express = data.express;
                // 日期控件的特殊处理
                if (data.dataType === "Date") {
                    newObj.dateDim = data.dateDim;
                }
                // 维度 Or 度量的区分
                if (data.aggregate && !_this.KHUtils.isNull(data.aggregate)) {
                    newObj.aggregate = data.aggregate;  // 聚合函数
                } else {
                    if (_this.KHUtils.isNull(data.express) && data.dataType === 'Number') {
                        newObj.aggregate = "sum";
                    } else {
                        newObj.aggregate = "none";
                    }
                }
                if (!checked) {
                    // 非选中状态
                    _this.unchecked(newObj);
                    return false;
                }
                _this.checkedNodes.push(newObj);
                //console.log("checked :" + JSON.stringify(_this.checkedNodes));
            },
            // 取消选中
            unchecked(item) {
                let _this = this;
                //const index = _this.checkedNodes.findIndex(obj => obj.column + obj.alias === item.column + item.alias);
                let index = _this.KHChart.findIndexInArray(_this.checkedNodes, item, _this);
                _this.checkedNodes.splice(index, 1);
                //console.log("unchecked :" + JSON.stringify(_this.checkedNodes));
            },
        }
    }
</script>
<style scoped>
    .dim-select-list {
        border: 1px solid #525A70;
        padding: 0 0;
        height: 500px;
        overflow-y: auto;
        box-sizing: border-box;
        background-color: #3E4760;
    }

    .dim-select-list::-webkit-scrollbar {
     /*  display: none; !* Chrome Safari *!*/
    }

    .myHeader {
        line-height: 50px;
        height: 50px;
    }

    .myHeader.headerTitle {
        line-height: 30px;
        height: 30px;
    }

    .blueFont {
        color: #409EFF;
    }

    .whiteFont {
        color: white;
        font-size: 10px;
    }

    .greenFont {
        color: green;
    }

    /*滚动条里面小方块*/
    .dim-select-list ::-webkit-scrollbar-thumb {
      background-color: #333A4E;
      border-radius: 10px;
    }

    /*滚动条整体样式*/
    .dim-select-list ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    /*滚动条里面轨道*/
    .dim-select-list ::-webkit-scrollbar-track {
      background: rgba(77, 86, 133, 0.1);
      border-radius: 10px;
    }

    /*滚动条里面小方块*/
    .dim-select-list ::-webkit-scrollbar-thumb {
      background-color: #EBEAEF;
      border-radius: 10px;
    }

    /*滚动条整体样式*/
    .dim-select-list ::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    /*滚动条里面轨道*/
    .dim-select-list ::-webkit-scrollbar-track {
      background: rgba(77, 86, 133, 0.1);
      border-radius: 10px;
    }

    /*滚动条里面小方块*/
    .dim-select-list::-webkit-scrollbar-thumb {
      background-color: #EBEAEF;
      border-radius: 10px;
    }

    /*滚动条整体样式*/
    .dim-select-list::-webkit-scrollbar {
      width: 6px;
      height: 6px;
    }

    /*滚动条里面轨道*/
    .dim-select-list::-webkit-scrollbar-track {
      background: rgba(77, 86, 133, 0.1);
      border-radius: 10px;
    }

</style>
