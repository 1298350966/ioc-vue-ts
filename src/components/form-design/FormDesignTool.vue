<template>
    <section style="height: 100%">
        <el-row class="content" style="height: 100%;">
            <el-col :span="6" style="height: 100%;">
                <form-type :type="type"></form-type>
            </el-col>
            <el-col :span="18">
                <form-content :form-config="formConfig" :form-id="formId" @notifyParentClose="notifyParentClose"
                              :notify-save="save"></form-content>
            </el-col>
        </el-row>
    </section>
</template>

<script>
    import FormContent from "@/components/form-content/FormContent";
    import FormType from "@/components/form-type/FormType";
    
    export default {
        name: "FormDesignTool",
        components: {FormType, FormContent},
        // formConfig: 表单配置
        // formId : 表单ID
        // type: 区分其他代表流程表单 Or 0:普通表单
        // notifySaveFormDesign: 表单设计点击下一步,触发子组件的方法保存
        props: ["formConfig", "formId", "type", "notifySave"],
        data() {
            return {
                save: 0,
            }
        },
        watch: {
            notifySave: {
                deep: true,
                handler() {
                    this.save++;
                }
            },
        },
        methods: {
            // 子组件设置成功后,子组件回调,是否关闭父组件的某些状态
            notifyParentClose(btnClose, dialogClose, cancel, checkFormDesignNoPass) {
                this.$emit("notifyParentClose", btnClose, dialogClose, cancel, checkFormDesignNoPass);  // 通知父表单已完成高级设置保存失败
            },
        }
    }
</script>

<style scoped lang="scss">
    .content {
        height: calc(100vh - 81px);
        
        > .el-col {
            position: relative;
            height: calc(100%);
        }
    }
</style>
