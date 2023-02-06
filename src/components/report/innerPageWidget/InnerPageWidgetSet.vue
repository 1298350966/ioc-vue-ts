<template>
    <div class="report-set-margin-let">
        <div class="secondary-font-color" style="margin-top: 10px">控件</div>
        <div style="margin-bottom: 10px">
            <span class="secondary-font-color">背景颜色</span>
            <el-color-picker v-model="item.backgroundColor" show-alpha></el-color-picker>
            <span class="secondary-font-color">边框颜色</span>
            <el-color-picker v-model="item.borderColor" show-alpha></el-color-picker>
        </div>
        <div class="secondary-font-color" style="margin-top: 10px">填充边距</div>
        <div style="margin-bottom: 10px">
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
        </div>
        <div class="secondary-font-color" style="margin-top: 10px">主标题</div>
        <div style="margin-bottom: 10px">
            <el-input class="report-set-style" style="width: 90%"
                      v-model="item.style.mainTitle"></el-input>
            <el-color-picker v-model="item.style.mainTitleColor" show-alpha></el-color-picker>
        </div>
        <div>
            <span class="secondary-font-color">链接</span>
            <el-input
                class="report-set-style imageMarginTop"
                placeholder="请输入页面地址"
                v-model="item.src"
                clearable>
            </el-input>
        </div>
    </div>
</template>

<script>
    export default {
        name: "InnerPageWidgetSet",
        created() {
        },
        props: {
            item: {required: true, type: Object}
        },
        data() {
            return {}
        },
        watch: {},
        methods: {}
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/report/report-set.scss";
</style>
