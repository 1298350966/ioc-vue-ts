<template>
    <nav-group  v-if="hackReset"></nav-group>
</template>

<script>
    import NavGroup from "@/components/NavGroup"
    
    export default {
        name: "Form",
        components: {NavGroup},
        data() {
            return {
                hackReset: true,
            }
        },
        created() {
            this.resetChild();
        },
        methods: {
            // 重新渲染子组件,解决二级菜单无法选中的问题
            resetChild() {
                this.hackReset = false;
                this.$nextTick(() => {
                    this.hackReset = true
                })
            }
        },
    }
</script>

<style scoped lang="scss">

</style>
