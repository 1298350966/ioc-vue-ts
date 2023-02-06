<template>
    <section v-if="hackReset">
        <router-view :key="$route.fullPath"></router-view>
    </section>
</template>

<script>
    
    export default {
        name: "Doc",
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
