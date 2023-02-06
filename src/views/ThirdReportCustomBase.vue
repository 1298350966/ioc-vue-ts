<template>
    <router-view v-if="hackReset" :key="$route.fullPath"></router-view>
</template>

<script>
    
    export default {
        name: "ThirdReportCustomBase",
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
