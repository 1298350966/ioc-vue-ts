<template>
    <section>
        <div>
            <tree-transfer :title="title"
                           :from_data='fromData'
                           :to_data='toData'
                           :defaultProps="{label:'name'}"
                           pid="parentId"
                           @addBtn='add'
                           @removeBtn='remove'
                           :mode='mode'
                           height='540px'
                           :defaultCheckedKeys="defaultCheckedKeys"
                           filter openAll>
            </tree-transfer>
        </div>
        <div slot="footer" class="dialog-footer" style="position: relative;left: 48%;">
            <el-button type="primary" @click.native="save">保存</el-button>
        </div>
    </section>
</template>

<script>
    import treeTransfer from 'el-tree-transfer'
    
    export default {
        name: "OrgUserTree",
        components: {treeTransfer},
        props: ['defaultCheckedKeys'],
        data() {
            return {
                title: ["选择", "已选"],
                mode: "transfer", // transfer addressList
                fromData: [],
                toData: [],
                checkedNodes: []
            }
        },
        mounted() {
            this.initDeptUserTree();
        },
        methods: {
            initDeptUserTree() {
                this.$Get(this.khConfig.api.listOrgAndUserTree)
                    .then(res => {
                        if (res.errCode === 0) {
                            this.fromData = res.children;
                        }
                    })
            },
            save() {
                if (this.checkedNodes.length <= 0) {
                    this.$notify.warning({
                        title: '警告',
                        message: '未选择任何的部门或人员'
                    });
                    return;
                }
                let retArray = [];
                // 处理部门
                for (let i = 0, n = this.checkedNodes.length; i < n; i++) {
                    let node = this.checkedNodes[i];
                    if (node.level === 0) {
                        // 如果是顶级部门,则授权于所有部门
                        retArray.push(node);
                        break;
                    } else if (node.level === 1) {
                        // 如果是一级部门,则下属的所有二级部门、人在范围内
                        retArray.push(node);
                    } else if (node.level === 2) {
                        // 如果是二级部门并且没有上级部门存在,则下属的人在范围之内
                        for (let j = 0, m = this.checkedNodes.length; j < m; j++) {
                            if (node.parentId === this.checkedNodes[j].id) {
                                break;
                            } else if (node.id === this.checkedNodes[j].id) {
                                retArray.push(node);
                            }
                        }
                    }
                }
                // 处理人员
                for (let i = 0, n = this.checkedNodes.length; i < n; i++) {
                    let node = this.checkedNodes[i];
                    if (node.level != null && this.KHUtils.isNull(node.userId)) {
                        continue;
                    }
                    for (let j = 0, m = this.checkedNodes.length; j < m; j++) {
                        let compareNode = this.checkedNodes[j];
                        if (node.parentId === compareNode.id) {
                            // 存在上级部门
                            break;
                        } else if (node.id === compareNode.id) {
                            retArray.push(node);
                        }
                    }
                }
                // 通知父组件重新加载,并获取选中后的节点数据
                this.$emit("getCheckedNodesFromOrgUserTree", retArray);
            },
            // 监听穿梭框组件添加
            add(fromData, toData, obj) {
                // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
                // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
                // console.log("fromData:", fromData);
                // console.log("toData:", toData);
                // console.log("obj:", obj);
                // console.log("obj nodes:", obj.nodes);
                obj.nodes.forEach(objNode => {
                    this.checkedNodes.push(objNode);
                });
                // console.log("add :" + JSON.stringify(this.checkedNodes));
            },
            // 监听穿梭框组件移除
            remove(fromData, toData, obj) {
                // 树形穿梭框模式transfer时，返回参数为左侧树移动后数据、右侧树移动后数据、移动的{keys,nodes,halfKeys,halfNodes}对象
                // 通讯录模式addressList时，返回参数为右侧收件人列表、右侧抄送人列表、右侧密送人列表
                // console.log("obj:", obj);
                // console.log("obj nodes:", obj.nodes);
                let deleteIndex = [];
                let parentIdArray = [];
                if (this.checkedNodes.length > 0) {
                    let index = -1;
                    this.checkedNodes.forEach(node => {
                        index++;
                        obj.nodes.forEach(objNode => {
                            if (node.id === objNode.id) {
                                deleteIndex.push(index);
                                // 移除上级
                                parentIdArray.push(objNode.parentId);
                            }
                        })
                    })
                }
                // 移除重复节点
                for (let i = deleteIndex.length - 1; i >= 0; i--) {
                    this.checkedNodes.splice(deleteIndex[i], 1);
                }
                // 移除该节点的上级节点
                deleteIndex = [];
                for (let i = 0, n = this.checkedNodes.length; i < n; i++) {
                    let node = this.checkedNodes[i];
                    for (let j = 0, m = parentIdArray.length; j < m; j++) {
                        if (node.id != null && node.id === parentIdArray[j]) {
                            deleteIndex.push(i);
                        }
                    }
                }
                for (let i = deleteIndex.length - 1; i >= 0; i--) {
                    this.checkedNodes.splice(deleteIndex[i], 1);
                }
                // console.log("remove :" + JSON.stringify(this.checkedNodes));
            }
        }
    }
</script>

<style lang="scss" scoped>
    .transfer-footer {
        margin-left: 20px;
        padding: 6px 5px;
    }
</style>