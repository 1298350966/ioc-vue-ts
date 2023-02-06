<template>
    <div class="home">
        <form-process-design-tool :showManageProcess="false"></form-process-design-tool>
    </div>
</template>

<script>
    import FormProcessDesignTool from '@/components/form-design/FormProcessDesignTool';
    
    export default {
        name: "Home",
        components: {
            FormProcessDesignTool
        },
        data() {
            return {}
        },
        methods: {}
    }
</script>


<style lang="scss" scoped>
    .home {
        height: 100%;
        padding: 20px 30px;
        overflow: auto;
    }
</style>
