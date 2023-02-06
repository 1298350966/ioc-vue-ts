<template>
    <el-collapse v-model="queryActiveNames">
        <el-collapse-item title="样式" name="1">
            <el-form label-position="top" class="report-set-margin-let">
                <el-form-item label="控件">
                    <span class="secondary-font-color">背景颜色</span>
                    <el-color-picker v-model="item.backgroundColor" show-alpha></el-color-picker>
                    <span class="secondary-font-color">边框颜色</span>
                    <el-color-picker v-model="item.borderColor" show-alpha></el-color-picker>
                </el-form-item>
                <el-form-item label="填充边距">
                    <el-tooltip class="item" effect="dark" content="上内边距">
                        <el-input-number v-model="item.paddingTop" style="width: 20%"></el-input-number>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="右内边">
                        <el-input-number v-model="item.paddingRight" style="width: 20%"></el-input-number>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="下内边距">
                        <el-input-number v-model="item.paddingBottom" style="width: 20%"></el-input-number>
                    </el-tooltip>
                    <el-tooltip class="item" effect="dark" content="左内边距">
                        <el-input-number v-model="item.paddingLeft" style="width: 20%"></el-input-number>
                    </el-tooltip>
                </el-form-item>
            </el-form>
        </el-collapse-item>
        <el-collapse-item title="布局" name="2">
            <el-form label-position="top" class="report-set-margin-let">
                <el-form-item label="Tab位置">
                    <el-radio label="top" v-model="item.style.tabPosition">top</el-radio>
                    <el-radio label="right" v-model="item.style.tabPosition">right</el-radio>
                    <el-radio label="bottom" v-model="item.style.tabPosition">bottom</el-radio>
                    <el-radio label="left" v-model="item.style.tabPosition">left</el-radio>
                </el-form-item>
                <el-form-item label="Tab样式">
                    <el-radio label='' v-model="item.style.tabType">默认</el-radio>
                    <el-radio label="border-card" v-model="item.style.tabType">卡片化</el-radio>
                    <el-radio label="card" v-model="item.style.tabType">选项卡样式</el-radio>
                </el-form-item>
            </el-form>
        </el-collapse-item>
        <el-collapse-item title="标签" name="3">
            <el-form label-position="top" class="report-set-margin-let">
                <el-form-item
                    v-for="(vaItem, index) in item.tabs"
                    :key="index"
                >
                    <el-input v-model="vaItem.tabName" style="width: 40%"></el-input>&nbsp;&nbsp;<el-input
                    v-model="vaItem.remark" placeholder="备注" style="width: 55%"></el-input>
                </el-form-item>
            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
    export default {
        name: "TabPageWidgetSet",
        created() {
        },
        props: {
            item: {required: true, type: Object}
        },
        data() {
            return {
                queryActiveNames: ['1', '2'],
            }
        },
        watch: {},
        methods: {}
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/report/report-set.scss";
</style>
