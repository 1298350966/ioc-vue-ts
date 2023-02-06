<template>
    <el-collapse v-model="queryActiveNames">
        <el-collapse-item title="基础设置" name="1">
            <el-form label-position="top" class="report-set-margin-let">
                <el-form-item label=" ">
                    <el-row>
                        <span class="secondary-font-color">背景颜色</span>
                        <el-color-picker v-model="baseSet.backgroundColor" show-alpha></el-color-picker>
                    </el-row>
                    <el-row>
                        <span class="secondary-font-color">垂直间距</span>
                        <el-input-number v-model="baseSet.verticalSpacing" :min="1" :max="20"></el-input-number>
                    </el-row>
                </el-form-item>
            </el-form>
        </el-collapse-item>
    </el-collapse>
</template>

<script>
    export default {
        name: "BasePageSet",
        created() {
        },
        props: {
            baseSet: {required: false, type: Object}
        },
        data() {
            return {
                queryActiveNames: ['1'],
            }
        },
        watch: {},
        methods: {}
    }
</script>

<style lang="scss" scoped>
    @import "@/assets/style/report/report-set.scss";
</style>
