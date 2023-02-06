<template>
    <div class="block">
        <el-cascader-panel
            :options="orgUser"
            :props="props"
            clearable
            :show-all-levels="false"
            placeholder="可搜索"
            empty="暂无数据"
            filterable
            ref="orgUserRef"
            v-loading="loading"
        ></el-cascader-panel>
        <div slot="footer" class="dialog-footer" style="position: relative;left: 48%;">
            <el-button type="primary" @click.native="save">保存</el-button>
        </div>
    </div>
</template>

<script>
    export default {
        name: "CustomCascade",
        data() {
            return {
                loading: false,
                props: {
                    multiple: true,
                    checkStrictly: false,
                    children: 'children',
                    label: 'name',
                    value: 'id'
                },
                orgUser: [],
                idArray: []
            }
        },
        mounted() {
            this.initDeptUserTree();
        },
        methods: {
            initDeptUserTree() {
                this.loading = true;
                this.orgUser = [];
                this.$Get(this.khConfig.api.listOrgAndUserTree)
                    .then(res => {
                        if (res.errCode === 0) {
                            this.orgUser = res.children;
                        }
                        this.loading = false;
                    })
            },
            save() {
                let checkedNodes = [];
                checkedNodes = this.$refs.orgUserRef.getCheckedNodes();
                if (this.KHUtils.isNull(checkedNodes) || checkedNodes.length === 0) {
                    this.$notify.warning({
                        title: '警告',
                        message: '未选择任何的部门或人员'
                    });
                    return false;
                }
                let retArray = [];
                checkedNodes.forEach(node => {
                    let newObj = {};
                    // 如果当前节点为叶子节点,并且父节点未被选中或父节点为空,则认为没有重复
                    if (node.isLeaf && (node.parent === null || !node.parent.checked)) {
                        newObj.id = node.data.id;
                        newObj.userId = node.data.userId;
                        newObj.name = node.data.name;
                        retArray.push(newObj);
                    }
                    // 如果当前节点不为叶子节点即有子节点,并且父节点未被选中或父节点为空以及子节点全部被选中则认为没有重复
                    if (!node.isLeaf && (node.parent === null || !node.parent.checked)) {
                        let flag = true;
                        node.children.forEach(childNode => {
                            if (!childNode.checked) {
                                flag = false;
                                return false;
                            }
                        });
                        if (flag) {
                            newObj.id = node.data.id;
                            newObj.userId = node.data.userId;
                            newObj.name = node.data.name;
                            retArray.push(newObj);
                        }
                    }
                });
                // 通知父组件重新加载,并获取选中后的节点数据
                this.$emit("getCheckedNodesFromOrgUserTree", retArray);
            }
        }
    }
</script>
<style scoped>
</style>
