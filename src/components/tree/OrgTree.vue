<template>
    <div style="height:100%;">
        <div class="el-input"><input type="text"
                                     v-model="filterText"
                                     autocomplete="off"
                                     placeholder="输入组织名称进行搜索"
                                     class="el-input__inner" style="width: 100%">
        </div>
        <el-tree
            :data="treeData"
            :props="props"
            :filter-node-method="filterNode"
            node-key="id"
            accordion
            highlight-current
            class="org-tree-container"
            ref="tree"
            empty-text="暂无组织数据"
            @node-click="handleNodeClick"
            default-expand-all
        >
        </el-tree>
    </div>
</template>
<script>
    import {mapGetters, mapActions} from 'vuex'
    
    export default {
        name: 'orgTree',
        data() {
            return {
                filterText: '',
                clickNode: true,
                props: {
                    children: 'children',
                    label: 'orgName'
                }
            }
        },
        watch: {
            filterText(val) {
                this.$refs.tree.filter(val);
            }
        },
        computed: mapGetters({
            treeData: 'getDeptTree',
        }),
        methods: {
            ...mapActions({
                'setDeptTree': 'setDeptTree'
            }),
            filterNode(value, data) {
                if (!value) return true;
                return data.orgName.indexOf(value) !== -1;
            },
            handleNodeClick(data) {
                this.setDeptTree(data)
            }
        }
    }
</script>
<style scoped lang="scss">
::v-deep .el-tree-node > .el-tree-node__children {
	overflow: visible;
}



.org-tree-container:hover{
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
</style>
