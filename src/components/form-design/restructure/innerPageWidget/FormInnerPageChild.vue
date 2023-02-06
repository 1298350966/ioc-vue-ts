<template>
    <div>
        <el-tree
            :data="data"
            show-checkbox
            default-expand-all
            node-key="id"
            ref="tree"
            highlight-current
            check-strictly
            @check="checkedNode"
            :props="defaultProps">
        </el-tree>
    </div>
</template>

<script>
    import FormInnerPageBase from "@/components/form-design/restructure/innerPageWidget/FormInnerPageBase";
    
    export default {
        name: "FormInnerPageChild",
        extends: FormInnerPageBase,
        created() {
            //console.log('i am child,created....');
            //console.log('i am child,name :' + this.name);
            //console.log('i am child,formName :' + this.formName);
        },
        data() {
            return {
                data: [{
                    id: 1,
                    label: '一级 1',
                    children: [{
                        id: 4,
                        label: '二级 1-1',
                        children: [{
                            id: 9,
                            label: '三级 1-1-1'
                        }, {
                            id: 10,
                            label: '三级 1-1-2'
                        }]
                    }]
                }, {
                    id: 2,
                    label: '一级 2',
                    children: [{
                        id: 5,
                        label: '二级 2-1'
                    }, {
                        id: 6,
                        label: '二级 2-2'
                    }]
                }, {
                    id: 3,
                    label: '一级 3',
                    children: [{
                        id: 7,
                        label: '二级 3-1'
                    }, {
                        id: 8,
                        label: '二级 3-2'
                    }]
                }],
                defaultProps: {
                    children: 'children',
                    label: 'label'
                },
                queryConditions: [] // 传递给父类的参数集合
            }
        },
        mounted() {
            //console.log('i am child,mounted.....');
        },
        methods: {
            checkedNode(currentNode, checkedKeys) {
                let _this = this;
                let checked = false;        // check框选中 Or 取消选中都会触发
                if (!_this.KHUtils.isNull(checkedKeys) && checkedKeys.checkedNodes instanceof Array) {
                    checkedKeys.checkedNodes.forEach(obj => {
                        let tempName = obj.id + obj.id;
                        let compareName = currentNode.id + currentNode.id;
                        if (tempName === compareName) {
                            // 选中状态
                            checked = true;
                        }
                    })
                }
                // 选中状态
                if (checked) {
                    // 执行查询动作
                    let tempObj1 = _this.KHUtils.clone(_this.EQ_OR_LIKE_QUERY_OBJ);
                    let tempObj2 = _this.KHUtils.clone(_this.IN_QUERY_OBJ);
                    _this.queryConditions = [];
                    tempObj1.key = "field_003";
                    tempObj1.value = currentNode.id;
                    tempObj1.type = _this.LIKE_$;
                    _this.queryConditions.push(tempObj1);
                    let tipMsg = _this.query(_this.queryConditions);
                    console.log("query retMsg :" + tipMsg);
                } else {
                    _this.query([]);
                }
            },
        }
    }

</script>

<style scoped lang="scss">

</style>
