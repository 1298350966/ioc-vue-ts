<template>
    <section>
        <el-container style="height: 50%">
            <el-main class="dim-select-list">
                <el-tree
                    ref="dimTree"
                    class="dataSetTree"
                    default-expand-all
                    :show-checkbox="true"
                    :props="treeProps"
                    :data="treeData"
                    :expand-on-click-node="false"
                    check-strictly
                    @check="checkedTreeData"
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
            </el-main>
        </el-container>
    </section>
</template>

<script>
    export default {
        name: "TableAttributeTreeSelect",
        props: {
            treeData: {required: true, type: Array},
            treeProps: {required: true, type: Object},
        },
        watch: {
            selectDownNum() {
                this.$emit("getCheckedNodes", this.checkedNodes);
            }
        },
        data() {
            return {
                checkedNodes: [],
            }
        },
        mounted() {
            let _this = this;
        },
        methods: {
            checkedTreeData(currentNode, checkedKeys) {
                this.checked(currentNode, checkedKeys, 'dim');
            },
            // ???????????????????????????
            checked(currentNode, checkedKeys, type) {
                let _this = this;
                // ??????????????????,??????????????????
                if (currentNode.children instanceof Array && currentNode.children.length > 0) {
                    return false;
                }
                // check????????? Or ????????????????????????
                let checked = false;
                if (checkedKeys.checkedNodes instanceof Array) {
                    let compareName = _this.KHChart.splicingColumnSetNoIdWithTableName(currentNode, _this);
                    checkedKeys.checkedNodes.forEach(obj => {
                        let tempName = _this.KHChart.splicingColumnSetNoIdWithTableName(obj, _this);
                        if (tempName === compareName) {
                            // ????????????
                            checked = true;
                        }
                    })
                }
                // ????????????
                let data = currentNode;
                let newObj = {};
                newObj.type = type;
                newObj.table = data.table;
                newObj.column = data.column;
                newObj.desc = data.desc;
                newObj.dataType = data.dataType;
                newObj.alias = data.alias;
                newObj.express = data.express;
                // ???????????????????????????
                if (data.dataType === "Date") {
                    newObj.dateDim = data.dateDim;
                }
                // ?????? Or ???????????????
                if (data.aggregate && !_this.KHUtils.isNull(data.aggregate)) {
                    newObj.aggregate = data.aggregate;  // ????????????
                } else {
                    if (_this.KHUtils.isNull(data.express) && data.dataType === 'Number') {
                        newObj.aggregate = "sum";
                    } else {
                        newObj.aggregate = "none";
                    }
                }
                if (!checked) {
                    // ???????????????
                    _this.unchecked(newObj);
                    return false;
                }
                _this.checkedNodes.push(newObj);
                //console.log("checked :" + JSON.stringify(_this.checkedNodes));
            },
            // ????????????
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
    
    /*????????????????????????*/
    .dim-select-list ::-webkit-scrollbar-thumb {
        background-color: #333A4E;
        border-radius: 10px;
    }
    
    /*?????????????????????*/
    .dim-select-list ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    /*?????????????????????*/
    .dim-select-list ::-webkit-scrollbar-track {
        background: rgba(77, 86, 133, 0.1);
        border-radius: 10px;
    }
    
    /*????????????????????????*/
    .dim-select-list ::-webkit-scrollbar-thumb {
        background-color: #EBEAEF;
        border-radius: 10px;
    }
    
    /*?????????????????????*/
    .dim-select-list ::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    /*?????????????????????*/
    .dim-select-list ::-webkit-scrollbar-track {
        background: rgba(77, 86, 133, 0.1);
        border-radius: 10px;
    }
    
    /*????????????????????????*/
    .dim-select-list::-webkit-scrollbar-thumb {
        background-color: #EBEAEF;
        border-radius: 10px;
    }
    
    /*?????????????????????*/
    .dim-select-list::-webkit-scrollbar {
        width: 6px;
        height: 6px;
    }
    
    /*?????????????????????*/
    .dim-select-list::-webkit-scrollbar-track {
        background: rgba(77, 86, 133, 0.1);
        border-radius: 10px;
    }

</style>
