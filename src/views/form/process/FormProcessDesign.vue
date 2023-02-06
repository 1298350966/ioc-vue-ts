<template>
    <div class="process-manage FormProcessDesign" style="padding:15px;">
        <form-process-design-tool :showManageProcess="true"></form-process-design-tool>
    </div>
</template>

<script>
    import FormProcessDesignTool from '@/components/form-design/FormProcessDesignTool';
    
    export default {
        name: "FormProcessDesign",
        components: {
            FormProcessDesignTool
        }
    }
</script>
<style lang="scss" scoped>
</style>
