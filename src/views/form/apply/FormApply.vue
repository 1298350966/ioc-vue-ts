<template>
    <el-row>
        <form-process-design-tool :showManageProcess="false"></form-process-design-tool>
    </el-row>
</template>

<script>
    import FormProcessDesignTool from '@/components/form-design/FormProcessDesignTool';
    
    export default {
        name: "FormApply",
        components: {
            FormProcessDesignTool
        }
    }
</script>
