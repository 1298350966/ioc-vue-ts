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
                        <el-input-number v-model="baseSet.verticalSpacing"  :min="1" :max="20"></el-input-number>
                    </el-row>
 <!--                   <el-row>
                        <el-checkbox class="secondary-font-color">显示水印</el-checkbox>
                    </el-row>
                    <el-row>
                        <el-checkbox class="secondary-font-color">允许下载</el-checkbox>
                    </el-row>
                    <el-row>
                        <el-checkbox class="secondary-font-color">无线端隐藏头部</el-checkbox>
                    </el-row>-->
                </el-form-item>
            </el-form>
        </el-collapse-item>
  <!--      <el-collapse-item title="主题设计" name="2">
            <el-form label-position="top" class="report-set-margin-let">
                <el-form-item label="官方模板" class="secondary-font-color">
                    <el-radio label="transverse" class="secondary-font-color">官方模板</el-radio>
                </el-form-item>
                <el-form-item label="皮肤" class="secondary-font-color">
                    <el-radio label="transverse" class="secondary-font-color">浅色版</el-radio>
                    <el-radio label="portrait" class="secondary-font-color">深色版</el-radio>
                </el-form-item>
                <el-form-item label="主题色系" class="secondary-font-color">
                    <el-radio label="transverse" class="secondary-font-color">商务</el-radio>
                    <el-radio label="portrait" class="secondary-font-color">经典</el-radio>
                </el-form-item>
            </el-form>
        </el-collapse-item>-->
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
